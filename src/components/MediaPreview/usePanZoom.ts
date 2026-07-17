import {
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";

interface ViewTransform {
  /** 相對於媒體原始座標系的縮放倍率。 */
  scale: number;
  /** 媒體左上角在 viewport 座標系中的水平位置。 */
  x: number;
  /** 媒體左上角在 viewport 座標系中的垂直位置。 */
  y: number;
}

interface DragState {
  /** 鎖定起始手勢的 pointer，避免多點觸控時不同手指互相覆寫。 */
  pointerId: number;
  /** pointer 按下時的 viewport 座標。 */
  startX: number;
  startY: number;
  /** pointer 按下時既有的平移量，後續位移都以此快照計算。 */
  startPanX: number;
  startPanY: number;
  /** 是否已超過點擊容錯距離；用來區分背景點擊與真正的拖曳。 */
  moved: boolean;
}

interface UsePanZoomOptions {
  /** 媒體座標系尺寸，而非畫面經過縮放後的尺寸。 */
  width: number;
  height: number;
  /** 初始 fit-to-viewport 可以使用的最大倍率。 */
  maxInitialScale: number;
}

// 滾輪採小步進，讓連續 wheel event 看起來平順；按鈕則採較明顯的單次步進。
const WHEEL_ZOOM_FACTOR = 1.06;
const BUTTON_ZOOM_FACTOR = 1.25;

// 上下限相對於「初始配適倍率」，因此大小不同的媒體會有一致的操作範圍。
const MIN_ZOOM_RATIO = 0.3;
const MAX_ZOOM_RATIO = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 計算能完整容納媒體內容、並替控制列保留空間的初始位置。
 *
 * 寬度保留 12% 邊界，高度保留 18% 給提示與控制列；最後再用
 * maxInitialScale 限制點陣圖不被預設放大。SSR 階段沒有 window，退回媒體
 * 自身尺寸可讓伺服器端計算保持安全，實際 Modal 只會在瀏覽器互動後掛載。
 */
function getFittedTransform({
  width,
  height,
  maxInitialScale,
}: UsePanZoomOptions): ViewTransform {
  const viewportWidth =
    typeof window === "undefined" ? width : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? height : window.innerHeight;
  const scale = Math.min(
    (viewportWidth * 0.88) / width,
    (viewportHeight * 0.82) / height,
    maxInitialScale,
  );

  return {
    scale,
    x: (viewportWidth - width * scale) / 2,
    y: (viewportHeight - height * scale) / 2,
  };
}

/**
 * 管理預覽內容的平移與縮放。
 *
 * Hook 只處理座標，不接觸 Modal 或媒體種類，因此圖片與 Mermaid 可以共用
 * 完全相同的滑鼠、觸控與滾輪行為。搭配 CSS 的 `transform-origin: 0 0`，
 * x/y 永遠代表縮放後媒體左上角在 viewport 中的位置。
 */
export function usePanZoom(options: UsePanZoomOptions) {
  // 只在媒體尺寸或初始倍率規則變更時重算，並作為 reset 與百分比的共同基準。
  const initialTransform = useMemo(
    () => getFittedTransform(options),
    [options.height, options.maxInitialScale, options.width],
  );
  const [transform, setTransform] = useState(initialTransform);
  const [isDragging, setIsDragging] = useState(false);

  // 拖曳中的高頻快照不需要觸發 render，因此放在 ref；畫面所需 transform 才用 state。
  const dragRef = useRef<DragState | null>(null);
  // PointerUp 後緊接著出現的 click 需要跨事件保存，因此也使用 ref。
  const suppressClickRef = useRef(false);

  function zoomAroundPoint(factor: number, centerX: number, centerY: number) {
    setTransform((current) => {
      const minScale = initialTransform.scale * MIN_ZOOM_RATIO;
      const maxScale = initialTransform.scale * MAX_ZOOM_RATIO;
      const nextScale = clamp(current.scale * factor, minScale, maxScale);
      const ratio = nextScale / current.scale;

      // 以游標為縮放中心：縮放前位於 center 下方的媒體座標，縮放後仍保持在
      // 同一個 viewport 位置。公式可視為把「center 到左上角」的距離乘上倍率。
      return {
        scale: nextScale,
        x: centerX - (centerX - current.x) * ratio,
        y: centerY - (centerY - current.y) * ratio,
      };
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    // 此處的滾輪用途是縮放媒體，不應再觸發瀏覽器預設的頁面捲動。
    event.preventDefault();
    const factor =
      event.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR;
    zoomAroundPoint(factor, event.clientX, event.clientY);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // 僅接受主要按鍵；控制按鈕保留自己的 click，不啟動背景拖曳。
    if (
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("button"))
    ) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPanX: transform.x,
      startPanY: transform.y,
      moved: false,
    };

    // Pointer Capture 讓游標即使移出 overlay，後續 move/up 仍交給同一元素處理。
    // Pointer Events 同時涵蓋 mouse、touch 與 pen，不必維護三套事件監聽器。
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    event.preventDefault();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    // 保留 3px 點擊容錯，避免手部微小晃動讓普通背景點擊被判定為拖曳。
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      drag.moved = true;
    }

    setTransform((current) => ({
      ...current,
      x: drag.startPanX + deltaX,
      y: drag.startPanY + deltaY,
    }));
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    // 若確實移動過，標記下一個 click 為拖曳尾端事件，交由 Modal 一次性消耗。
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function zoomFromViewportCenter(factor: number) {
    // 按鈕沒有游標位置可當中心，因此以 viewport 中央作為穩定且可預期的錨點。
    zoomAroundPoint(factor, window.innerWidth / 2, window.innerHeight / 2);
  }

  return {
    transform,
    isDragging,
    // UI 的 100% 表示「剛開啟時的完整配適狀態」，讓重置後一定回到 100%。
    zoomPercentage: Math.round(
      (transform.scale / initialTransform.scale) * 100,
    ),
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    finishDrag,
    zoomIn: () => zoomFromViewportCenter(BUTTON_ZOOM_FACTOR),
    zoomOut: () => zoomFromViewportCenter(1 / BUTTON_ZOOM_FACTOR),
    reset: () => setTransform(initialTransform),
    consumeSuppressedClick: () => {
      // 這是一個 one-shot flag；消耗後立刻清除，下一次真正點背景仍可關閉。
      const shouldSuppress = suppressClickRef.current;
      suppressClickRef.current = false;
      return shouldSuppress;
    },
  };
}
