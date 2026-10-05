import { cn } from "cn";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const ResizeObserverBasicDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    contentWidth: 0,
    contentHeight: 0,
    borderWidth: 0,
    borderHeight: 0,
  });
  const [resizeCount, setResizeCount] = useState(0);
  const [isObserving, setIsObserving] = useState(true);
  const observerRef = useRef<ResizeObserver | null>(null);
  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const contentBoxSize = entry.contentBoxSize[0];
      const borderBoxSize = entry.borderBoxSize[0];
      setDimensions({
        contentWidth: Math.round(contentBoxSize.inlineSize),
        contentHeight: Math.round(contentBoxSize.blockSize),
        borderWidth: Math.round(borderBoxSize.inlineSize),
        borderHeight: Math.round(borderBoxSize.blockSize),
      });
      setResizeCount((prev) => prev + 1);
    }
  }, []);
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    observerRef.current = new ResizeObserver(handleResize);
    if (isObserving) {
      observerRef.current.observe(box);
    }
    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleResize, isObserving]);
  const toggleObserving = () => {
    if (!observerRef.current || !boxRef.current) return;
    if (isObserving) {
      observerRef.current.unobserve(boxRef.current);
    } else {
      observerRef.current.observe(boxRef.current);
    }
    setIsObserving(!isObserving);
  };
  return (
    <div className="[background:linear-gradient(135deg,#f8fafc_0%,#f1f5f9_100%)] rounded-[12px] p-6 m-[1.5rem_0] [border:1px_solid_#e2e8f0]">
      <div className="mb-6">
        <h3 className="m-[0_0_0.5rem_0] text-[1.25rem] text-[#1e293b]">ResizeObserver 基本用法</h3>
        <p className="m-0 text-[#64748b] text-[0.9rem]">拖曳右下角調整盒子大小，觀察尺寸即時變化</p>
      </div>

      <div className="flex gap-8 items-start [@media(max-width:_768px)]:flex-col">
        <div className="flex-1 min-w-50 flex justify-center items-center p-4 [background:#ffffff] rounded-xl [border:2px_dashed_#cbd5e1] min-h-62.5">
          <div
            ref={boxRef}
            className="w-45 h-30 min-w-25 min-h-20 max-w-87.5 max-h-75 [background:linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] [border:4px_solid_#1d4ed8] rounded-xl resize overflow-auto flex justify-center items-center cursor-grab [box-shadow:0_4px_12px_rgba(59,130,246,0.3)] [transition:box-shadow_0.2s_ease] [&:hover]:[box-shadow:0_6px_16px_rgba(59,130,246,0.4)] active:cursor-grabbing"
          >
            <span className="text-[white] font-semibold text-[1rem] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] pointer-events-none select-none">
              Resize me!
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-70 [background:#ffffff] rounded-xl p-4 [border:1px_solid_#e2e8f0]">
          <div className="flex justify-center mb-4">
            <button
              className={cn(
                "p-[0.5rem_1rem] [border:2px_solid_#e2e8f0] rounded-xl [background:#f8fafc] text-[#64748b] cursor-pointer text-[0.9rem] font-medium [transition:all_0.2s_ease] [&:hover]:[background:#f1f5f9] [&.ui-components-examplecomponents-resizeobserver-resizeobserverbasicdemo-active]:[background:#dcfce7] [&.ui-components-examplecomponents-resizeobserver-resizeobserverbasicdemo-active]:border-[#22c55e] [&.ui-components-examplecomponents-resizeobserver-resizeobserverbasicdemo-active]:text-[#15803d]",
                isObserving ? "ui-components-examplecomponents-resizeobserver-resizeobserverbasicdemo-active" : "",
              )}
              onClick={toggleObserving}
              type="button"
            >
              {isObserving ? "🔍 觀察中" : "⏸️ 已暫停"}
            </button>
          </div>

          <div className="flex justify-center mb-4 pb-4 [border-bottom:1px_solid_#e2e8f0]">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.8rem] text-[#64748b]">Resize 次數</span>
              <span className="text-[1.5rem] font-bold text-[#3b82f6] font-[ui-monospace,monospace]">
                {resizeCount}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="[background:#f8fafc] rounded-[6px] p-3">
              <h4 className="m-[0_0_0.5rem_0] text-[0.85rem] font-semibold text-[#3b82f6] font-[ui-monospace,monospace]">
                contentBoxSize
              </h4>
              <div className="flex justify-between items-center text-[0.85rem] text-[#475569] p-[0.25rem_0]">
                <span>inlineSize (width):</span>
                <span className="font-[ui-monospace,monospace] font-semibold text-[#1e293b] [background:#e2e8f0] p-[0.15rem_0.5rem] rounded-lg">
                  {dimensions.contentWidth}px
                </span>
              </div>
              <div className="flex justify-between items-center text-[0.85rem] text-[#475569] p-[0.25rem_0]">
                <span>blockSize (height):</span>
                <span className="font-[ui-monospace,monospace] font-semibold text-[#1e293b] [background:#e2e8f0] p-[0.15rem_0.5rem] rounded-lg">
                  {dimensions.contentHeight}px
                </span>
              </div>
            </div>

            <div className="[background:#f8fafc] rounded-[6px] p-3">
              <h4 className="m-[0_0_0.5rem_0] text-[0.85rem] font-semibold text-[#3b82f6] font-[ui-monospace,monospace]">
                borderBoxSize
              </h4>
              <div className="flex justify-between items-center text-[0.85rem] text-[#475569] p-[0.25rem_0]">
                <span>inlineSize (width):</span>
                <span className="font-[ui-monospace,monospace] font-semibold text-[#1e293b] [background:#e2e8f0] p-[0.15rem_0.5rem] rounded-lg">
                  {dimensions.borderWidth}px
                </span>
              </div>
              <div className="flex justify-between items-center text-[0.85rem] text-[#475569] p-[0.25rem_0]">
                <span>blockSize (height):</span>
                <span className="font-[ui-monospace,monospace] font-semibold text-[#1e293b] [background:#e2e8f0] p-[0.15rem_0.5rem] rounded-lg">
                  {dimensions.borderHeight}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResizeObserverBasicDemo;
