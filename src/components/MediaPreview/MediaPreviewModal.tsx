import { Dialog } from "@base-ui/react/dialog";
import { cn } from "cn";
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { usePanZoom } from "./usePanZoom";

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
 * Base UI 負責 Portal、背景捲動鎖定、焦點圈限與 Esc；這裡處理開關動畫；媒體種類
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
    const respectsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(onClose, respectsReducedMotion ? 0 : CLOSE_ANIMATION_MS);
  }, [onClose]);
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));
    return () => {
      cancelAnimationFrame(animationFrame);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);
  function handleBackgroundClick(event: MouseEvent<HTMLDivElement>) {
    // 拖曳放開滑鼠後瀏覽器仍會派發 click；先吃掉該次 click，避免誤關預覽。
    if (panZoom.consumeSuppressedClick()) return;
    // 只有直接點到 overlay 空白處才關閉；媒體畫布與控制按鈕的點擊都不算。
    if (event.target === event.currentTarget) {
      close();
    }
  }
  // Portal 避免 Modal 被文章容器的 overflow、stacking context 或版面寬度裁切。
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup
          initialFocus={closeButtonRef}
          className={cn(
            "fixed inset-0 z-99999 overflow-hidden [background:rgb(255,255,255)] cursor-grab opacity-[0] touch-none [transition:opacity_0.28s_cubic-bezier(0.22,1,0.36,1)] [html[data-theme='dark']_&]:[background:rgb(50,50,50)] [&.ui-components-mediapreview-styles-visible]:opacity-[1] motion-reduce:[transition:none]",
            isVisible
              ? "ui-components-mediapreview-styles-visible [&_.ui-components-mediapreview-styles-stage]:opacity-[1] [&_.ui-components-mediapreview-styles-stage]:transform-[scale(1)] [&_.ui-components-mediapreview-styles-closeButton]:opacity-[1] [&_.ui-components-mediapreview-styles-closeButton]:transform-[translateY(0)_scale(1)] [&_.ui-components-mediapreview-styles-hint]:opacity-[1] [&_.ui-components-mediapreview-styles-hint]:transform-[translateX(-50%)_translateY(0)] [&_.ui-components-mediapreview-styles-controls]:opacity-[1] [&_.ui-components-mediapreview-styles-controls]:transform-[translateY(0)_scale(1)] [@media(max-width:_640px)]:[&_.ui-components-mediapreview-styles-hint]:transform-[translateY(0)]"
              : "",
            panZoom.isDragging ? "cursor-grabbing" : "",
          )}
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
          <div
            className="ui-components-mediapreview-styles-stage absolute inset-0 pointer-events-none opacity-[0] transform-[scale(0.965)] origin-center [transition:opacity_0.24s_ease-out,transform_0.36s_cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] motion-reduce:[transition:none]"
            aria-hidden="true"
          >
            <div
              className="absolute top-0 left-0 pointer-events-auto origin-top-left will-change-transform"
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
            className="ui-components-mediapreview-styles-closeButton flex items-center justify-center p-0 [border:0] text-[rgb(0_0_0/55%)] [background:rgb(0_0_0/7%)] cursor-pointer leading-none [transition:color_0.15s_ease,background_0.15s_ease] [&:hover]:text-[rgb(0_0_0/85%)] [&:hover]:[background:rgb(0_0_0/14%)] focus-visible:relative focus-visible:z-1 focus-visible:[outline:2px_solid_var(--ifm-color-primary)] focus-visible:-outline-offset-2 [html[data-theme='dark']_&]:text-[rgb(255_255_255/70%)] [html[data-theme='dark']_&]:[background:rgb(255_255_255/10%)] [html[data-theme='dark']_&:hover]:text-white [html[data-theme='dark']_&:hover]:[background:rgb(255_255_255/22%)] fixed top-4 right-5 z-2 w-9 h-9 rounded-[50%] text-[18px] opacity-[0] transform-[translateY(-8px)_scale(0.92)] [transition:color_0.15s_ease,background_0.15s_ease,opacity_0.2s_ease-out,transform_0.32s_cubic-bezier(0.16,1,0.3,1)] motion-reduce:[transition:none]"
            type="button"
            title="關閉 (Esc)"
            aria-label={`關閉${dialogLabel}`}
            onClick={close}
          >
            ✕
          </button>

          <div
            className="ui-components-mediapreview-styles-hint fixed bottom-6 left-[50%] z-2 p-[6px_18px] rounded-[20px] text-[rgb(0_0_0/50%)] [background:rgb(0_0_0/8%)] font-[system-ui,-apple-system,sans-serif] text-[13px] whitespace-nowrap pointer-events-none opacity-[0] transform-[translateX(-50%)_translateY(8px)] [transition:opacity_0.22s_ease-out_0.08s,transform_0.34s_cubic-bezier(0.16,1,0.3,1)_0.08s] animate-[ui-components-mediapreview-styles-hideHint_0.4s_ease_3s_forwards] [html[data-theme='dark']_&]:text-[rgb(255_255_255/65%)] [html[data-theme='dark']_&]:[background:rgb(0_0_0/45%)] [@media(max-width:_640px)]:right-4 [@media(max-width:_640px)]:bottom-17 [@media(max-width:_640px)]:left-4 [@media(max-width:_640px)]:text-center [@media(max-width:_640px)]:whitespace-normal [@media(max-width:_640px)]:transform-[translateY(8px)] motion-reduce:[transition:none] motion-reduce:animate-none"
            aria-hidden="true"
          >
            滾輪縮放 · 拖曳平移 · 點擊背景或按 Esc 關閉
          </div>

          {/* 控制列不放進 canvas，才能在媒體平移／縮放時固定於視窗右下角。 */}
          <fieldset
            className="ui-components-mediapreview-styles-controls fixed right-5 bottom-5 z-2 flex items-center overflow-hidden rounded-xl [background:rgb(0_0_0/7%)] font-[system-ui,-apple-system,sans-serif] select-none opacity-[0] transform-[translateY(10px)_scale(0.96)] [transition:opacity_0.2s_ease-out_0.05s,transform_0.34s_cubic-bezier(0.16,1,0.3,1)_0.05s] [html[data-theme='dark']_&]:[background:rgb(255_255_255/10%)] motion-reduce:[transition:none] m-0 min-w-0 border-0 p-0"
            aria-label="縮放控制"
          >
            <button
              className="flex items-center justify-center p-0 [border:0] text-[rgb(0_0_0/55%)] [background:rgb(0_0_0/7%)] cursor-pointer leading-none [transition:color_0.15s_ease,background_0.15s_ease] [&:hover]:text-[rgb(0_0_0/85%)] [&:hover]:[background:rgb(0_0_0/14%)] focus-visible:relative focus-visible:z-1 focus-visible:[outline:2px_solid_var(--ifm-color-primary)] focus-visible:-outline-offset-2 [html[data-theme='dark']_&]:text-[rgb(255_255_255/70%)] [html[data-theme='dark']_&]:[background:rgb(255_255_255/10%)] [html[data-theme='dark']_&:hover]:text-white [html[data-theme='dark']_&:hover]:[background:rgb(255_255_255/22%)] w-9 h-8.5 text-[18px]"
              type="button"
              title="縮小"
              aria-label="縮小預覽內容"
              onClick={panZoom.zoomOut}
            >
              −
            </button>
            {/* 百分比以「初次配適視窗」為 100%，不是圖片原始像素的 100%。 */}
            <output
              className="flex items-center justify-center min-w-13 h-8.5 p-[0_2px] text-[rgb(0_0_0/60%)] text-[12px] font-medium [font-variant-numeric:tabular-nums] [html[data-theme='dark']_&]:text-[rgb(255_255_255/75%)]"
              aria-live="polite"
            >
              {panZoom.zoomPercentage}%
            </output>
            <button
              className="flex items-center justify-center p-0 [border:0] text-[rgb(0_0_0/55%)] [background:rgb(0_0_0/7%)] cursor-pointer leading-none [transition:color_0.15s_ease,background_0.15s_ease] [&:hover]:text-[rgb(0_0_0/85%)] [&:hover]:[background:rgb(0_0_0/14%)] focus-visible:relative focus-visible:z-1 focus-visible:[outline:2px_solid_var(--ifm-color-primary)] focus-visible:-outline-offset-2 [html[data-theme='dark']_&]:text-[rgb(255_255_255/70%)] [html[data-theme='dark']_&]:[background:rgb(255_255_255/10%)] [html[data-theme='dark']_&:hover]:text-white [html[data-theme='dark']_&:hover]:[background:rgb(255_255_255/22%)] w-9 h-8.5 text-[18px]"
              type="button"
              title="放大"
              aria-label="放大預覽內容"
              onClick={panZoom.zoomIn}
            >
              +
            </button>
            <button
              className="flex items-center justify-center p-0 [border:0] text-[rgb(0_0_0/55%)] [background:rgb(0_0_0/7%)] cursor-pointer leading-none [transition:color_0.15s_ease,background_0.15s_ease] [&:hover]:text-[rgb(0_0_0/85%)] [&:hover]:[background:rgb(0_0_0/14%)] focus-visible:relative focus-visible:z-1 focus-visible:[outline:2px_solid_var(--ifm-color-primary)] focus-visible:-outline-offset-2 [html[data-theme='dark']_&]:text-[rgb(255_255_255/70%)] [html[data-theme='dark']_&]:[background:rgb(255_255_255/10%)] [html[data-theme='dark']_&:hover]:text-white [html[data-theme='dark']_&:hover]:[background:rgb(255_255_255/22%)] w-9 h-8.5 text-[18px]"
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
          </fieldset>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
