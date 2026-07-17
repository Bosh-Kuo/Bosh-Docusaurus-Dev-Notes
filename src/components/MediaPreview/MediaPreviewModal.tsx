import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePanZoom } from "./usePanZoom";
import styles from "./styles.module.css";

interface MediaPreviewModalProps {
  /** 實際顯示的媒體內容；圖片與 Mermaid SVG 都會放進同一個平移／縮放畫布。 */
  children: ReactNode;
  /** 媒體自身座標系的寬度，不是 Modal 在畫面上的 CSS 寬度。 */
  width: number;
  /** 媒體自身座標系的高度，不是 Modal 在畫面上的 CSS 高度。 */
  height: number;
  /** 提供給螢幕閱讀器辨識此 dialog 用途的名稱。 */
  dialogLabel: string;
  /** 離場動畫結束後才呼叫；父元件通常會在這裡清空預覽狀態並卸載 Modal。 */
  onClose: () => void;
  /**
   * 初次配適視窗時允許的最大倍率。
   * 點陣圖片通常設為 1，避免一開啟就被放大而模糊；SVG 等向量內容則可提高。
   */
  maxInitialScale?: number;
}

// 必須涵蓋 CSS 中最長的離場動畫；若太早卸載 Portal，使用者會看不到淡出效果。
const CLOSE_ANIMATION_MS = 360;

/**
 * 圖片與 Mermaid 共用的全螢幕預覽容器。
 *
 * 這個元件負責 Portal、開關動畫、背景捲動鎖定、焦點與鍵盤操作；媒體種類
 * 完全由 children 決定。座標與 Pointer Events 則交給 usePanZoom，避免 Modal
 * 同時承擔 UI 生命週期與手勢計算兩種責任。
 */
export default function MediaPreviewModal({
  children,
  width,
  height,
  dialogLabel,
  onClose,
  maxInitialScale = 1,
}: MediaPreviewModalProps): ReactNode {
  // 元件掛載不代表已進入可見狀態：先以隱藏樣式渲染一幀，transition 才有起點。
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Timer 同時用來等待離場動畫，並防止連續點擊造成 onClose 重複執行。
  const closeTimerRef = useRef<number | null>(null);
  const panZoom = usePanZoom({ width, height, maxInitialScale });

  const close = useCallback(() => {
    if (closeTimerRef.current !== null) return;

    // 先移除 visible class 觸發離場動畫，再請父元件真正卸載 Modal。
    setIsVisible(false);
    const respectsReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    closeTimerRef.current = window.setTimeout(
      onClose,
      respectsReducedMotion ? 0 : CLOSE_ANIMATION_MS,
    );
  }, [onClose]);

  useEffect(() => {
    // 記住開啟預覽前的頁面狀態，關閉時必須精確還原，而不是一律設回預設值。
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // 等瀏覽器先畫出初始隱藏狀態，再加入 visible class，確保進場 transition 會執行。
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));

    // Portal 位於 body；鎖住背景捲動，避免使用滾輪縮放時文章也跟著移動。
    document.body.style.overflow = "hidden";
    // 將焦點移到可操作元素，讓鍵盤使用者能立即按 Enter 或 Esc 關閉。
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // 無論正常關閉或路由切換導致卸載，都要完整清理全域副作用。
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [close]);

  function handleBackgroundClick(event: MouseEvent<HTMLDivElement>) {
    // 拖曳放開滑鼠後瀏覽器仍會派發 click；先吃掉該次 click，避免誤關預覽。
    if (panZoom.consumeSuppressedClick()) return;

    // 只有直接點到 overlay 空白處才關閉；媒體畫布與控制按鈕的點擊都不算。
    if (event.target === event.currentTarget) {
      close();
    }
  }

  // Portal 避免 Modal 被文章容器的 overflow、stacking context 或版面寬度裁切。
  return createPortal(
    <div
      className={`${styles.overlay} ${isVisible ? styles.visible : ""} ${
        panZoom.isDragging ? styles.dragging : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      onWheel={panZoom.handleWheel}
      onPointerDown={panZoom.handlePointerDown}
      onPointerMove={panZoom.handlePointerMove}
      onPointerUp={panZoom.finishDrag}
      onPointerCancel={panZoom.finishDrag}
      onClick={handleBackgroundClick}
    >
      {/*
        進出場動畫放在 stage，平移與縮放則留在 canvas。兩層 transform 分離後，
        拖曳或滾輪縮放不會被 CSS transition 延遲，仍能直接跟隨輸入。
      */}
      <div className={styles.stage} aria-hidden="true">
        <div
          className={styles.canvas}
          style={{
            width,
            height,
            transform: `translate(${panZoom.transform.x}px, ${panZoom.transform.y}px) scale(${panZoom.transform.scale})`,
          }}
        >
          {children}
        </div>
      </div>

      <button
        ref={closeButtonRef}
        className={styles.closeButton}
        type="button"
        title="關閉 (Esc)"
        aria-label={`關閉${dialogLabel}`}
        onClick={close}
      >
        ✕
      </button>

      <div className={styles.hint} aria-hidden="true">
        滾輪縮放 · 拖曳平移 · 點擊背景或按 Esc 關閉
      </div>

      {/* 控制列不放進 canvas，才能在媒體平移／縮放時固定於視窗右下角。 */}
      <div className={styles.controls} role="group" aria-label="縮放控制">
        <button
          className={styles.controlButton}
          type="button"
          title="縮小"
          aria-label="縮小預覽內容"
          onClick={panZoom.zoomOut}
        >
          −
        </button>
        {/* 百分比以「初次配適視窗」為 100%，不是圖片原始像素的 100%。 */}
        <output className={styles.zoomLevel} aria-live="polite">
          {panZoom.zoomPercentage}%
        </output>
        <button
          className={styles.controlButton}
          type="button"
          title="放大"
          aria-label="放大預覽內容"
          onClick={panZoom.zoomIn}
        >
          +
        </button>
        <button
          className={styles.controlButton}
          type="button"
          title="重置"
          aria-label="重置預覽內容的位置與縮放"
          onClick={panZoom.reset}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
