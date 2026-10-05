import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const ResponsiveFontDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [fontSize, setFontSize] = useState(16);
  const [sliderWidth, setSliderWidth] = useState(400);
  const calculateFontSize = useCallback((width: number) => {
    // 根據容器寬度，將字級限制在 12px 到 32px 之間。
    const minWidth = 200;
    const maxWidth = 600;
    const minFont = 12;
    const maxFont = 32;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth);
    return Math.round(minFont + ratio * (maxFont - minFont));
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentBoxSize[0].inlineSize;
        setContainerWidth(Math.round(width));
        setFontSize(calculateFontSize(width));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [calculateFontSize]);
  // 滑桿變動時更新容器寬度。
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${sliderWidth}px`;
    }
  }, [sliderWidth]);
  return (
    <div className="[background:linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] rounded-[12px] p-6 m-[1.5rem_0] [border:1px_solid_#a7f3d0]">
      <div className="mb-6">
        <h3 className="m-[0_0_0.5rem_0] text-[1.25rem] text-[#064e3b]">實際應用：響應式字體</h3>
        <p className="m-0 text-[#047857] text-[0.9rem]">使用 ResizeObserver 根據容器寬度動態調整字體大小</p>
      </div>

      <div className="[background:#ffffff] rounded-xl p-4 mb-6">
        <label className="flex flex-col gap-2 text-[#064e3b] text-[0.9rem] font-medium text-center">
          容器寬度: {sliderWidth}px
          <input
            type="range"
            min="200"
            max="600"
            value={sliderWidth}
            onChange={(e) => setSliderWidth(Number(e.target.value))}
            className="w-full max-w-100 m-[0_auto] accent-[#10b981]"
          />
        </label>
      </div>

      <div className="flex justify-center p-4 [background:linear-gradient(45deg,#f0fdf4_25%,transparent_25%),linear-gradient(-45deg,#f0fdf4_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0fdf4_75%),linear-gradient(-45deg,transparent_75%,#f0fdf4_75%)] bg-size-[20px_20px] bg-position-[0_0,0_10px,10px_-10px,-10px_0px] bg-[#ffffff] rounded-xl min-h-37.5 items-center">
        <div
          ref={containerRef}
          className="[background:linear-gradient(135deg,#10b981_0%,#059669_100%)] rounded-xl p-6 [box-shadow:0_4px_12px_rgba(16,185,129,0.3)] [transition:width_0.1s_ease-out]"
          style={{ width: sliderWidth }}
        >
          <p
            className="m-0 text-[white] font-semibold leading-[1.4] text-center [transition:font-size_0.1s_ease-out]"
            style={{ fontSize: `${fontSize}px` }}
          >
            這段文字的大小會隨著容器寬度自動調整！
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-6 p-4 [background:#ffffff] rounded-xl">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.8rem] text-[#047857]">容器寬度</span>
          <span className="text-[1.5rem] font-bold text-[#064e3b] font-[ui-monospace,monospace]">
            {containerWidth}px
          </span>
        </div>
        <div className="text-[1.5rem] text-[#10b981]">→</div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[0.8rem] text-[#047857]">字體大小</span>
          <span className="text-[1.5rem] font-bold text-[#064e3b] font-[ui-monospace,monospace]">{fontSize}px</span>
        </div>
      </div>

      <div className="mt-4 text-center [&_code]:[background:rgba(16,185,129,0.15)] [&_code]:p-[0.5rem_1rem] [&_code]:rounded-[6px] [&_code]:text-[0.85rem] [&_code]:text-[#047857]">
        <code>fontSize = map(containerWidth, [200, 600], [12, 32])</code>
      </div>
    </div>
  );
};
export default ResponsiveFontDemo;
