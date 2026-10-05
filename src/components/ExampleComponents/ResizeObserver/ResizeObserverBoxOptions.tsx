import { cn } from "cn";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type BoxOption = "content-box" | "border-box";
const ResizeObserverBoxOptions: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<BoxOption>("content-box");
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(8);
  const [dimensions, setDimensions] = useState({
    inlineSize: 0,
    blockSize: 0,
  });
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const boxSize = selectedBox === "content-box" ? entry.contentBoxSize[0] : entry.borderBoxSize[0];
        setDimensions({
          inlineSize: Math.round(boxSize.inlineSize),
          blockSize: Math.round(boxSize.blockSize),
        });
      }
    },
    [selectedBox],
  );
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(handleResize);
    observer.observe(box, { box: selectedBox });
    return () => observer.disconnect();
  }, [handleResize, selectedBox]);
  // ResizeObserver 會自動回報所選盒模型的變化，包含 padding 與 border 的影響，
  // 不需要額外修改寬度來觸發通知。
  return (
    <div className="[background:linear-gradient(135deg,#fdf4ff_0%,#fae8ff_100%)] rounded-[12px] p-6 m-[1.5rem_0] [border:1px_solid_#e9d5ff]">
      <div className="mb-4">
        <h3 className="m-[0_0_0.5rem_0] text-[1.25rem] text-[#581c87]">Box 選項比較</h3>
        <p className="m-0 text-[#7e22ce] text-[0.9rem]">切換不同的 box 選項，觀察回報尺寸的差異</p>
      </div>

      <div className="[background:#ffffff] rounded-xl p-4 mb-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <div className="flex gap-2 [background:#f3e8ff] p-1 rounded-xl">
            <button
              className={cn(
                "p-[0.5rem_1rem] [border:none] rounded-[6px] [background:transparent] text-[#7e22ce] cursor-pointer text-[0.9rem] font-medium font-[ui-monospace,monospace] [transition:all_0.2s_ease] [&:hover]:[background:rgba(168,85,247,0.2)] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:[background:#a855f7] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:text-[white] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:[box-shadow:0_2px_4px_rgba(168,85,247,0.3)]",
                selectedBox === "content-box"
                  ? "ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active"
                  : "",
              )}
              onClick={() => setSelectedBox("content-box")}
              type="button"
            >
              content-box
            </button>
            <button
              className={cn(
                "p-[0.5rem_1rem] [border:none] rounded-[6px] [background:transparent] text-[#7e22ce] cursor-pointer text-[0.9rem] font-medium font-[ui-monospace,monospace] [transition:all_0.2s_ease] [&:hover]:[background:rgba(168,85,247,0.2)] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:[background:#a855f7] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:text-[white] [&.ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active]:[box-shadow:0_2px_4px_rgba(168,85,247,0.3)]",
                selectedBox === "border-box"
                  ? "ui-components-examplecomponents-resizeobserver-resizeobserverboxoptions-active"
                  : "",
              )}
              onClick={() => setSelectedBox("border-box")}
              type="button"
            >
              border-box
            </button>
          </div>
        </div>

        <div className="flex gap-8 justify-center flex-wrap">
          <label className="flex flex-col gap-2 text-[#581c87] text-[0.85rem] font-medium">
            Padding: {padding}px
            <input
              type="range"
              min="0"
              max="40"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-37.5 accent-[#a855f7]"
            />
          </label>
          <label className="flex flex-col gap-2 text-[#581c87] text-[0.85rem] font-medium">
            Border: {border}px
            <input
              type="range"
              min="0"
              max="20"
              value={border}
              onChange={(e) => setBorder(Number(e.target.value))}
              className="w-37.5 accent-[#a855f7]"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-8 items-start [@media(max-width:_768px)]:flex-col">
        <div className="flex-1 flex justify-center items-center p-6 [background:#ffffff] rounded-xl min-h-62.5">
          <div
            ref={boxRef}
            className="w-50 h-37.5 min-w-25 min-h-20 max-w-87.5 max-h-75 [background:linear-gradient(135deg,#c084fc_0%,#a855f7_100%)] border-solid border-[#7e22ce] rounded-xl resize overflow-auto flex justify-center items-center [box-shadow:0_4px_12px_rgba(168,85,247,0.3)]"
            style={{
              padding: `${padding}px`,
              borderWidth: `${border}px`,
            }}
          >
            <div className="[background:rgba(255,255,255,0.9)] p-[0.5rem_1rem] rounded-lg font-semibold text-[#7e22ce] text-[0.9rem]">
              Content
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-70 flex flex-col gap-4">
          <div className="[background:#ffffff] rounded-xl p-4 [border:2px_solid_#e9d5ff]">
            <div className="flex items-center gap-2 mb-4 pb-3 [border-bottom:1px_solid_#f3e8ff]">
              <span className="text-[1.25rem]">📐</span>
              <span className="font-[ui-monospace,monospace] font-semibold text-[#a855f7] text-[1rem]">
                {selectedBox}
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 [background:#faf5ff] p-3 rounded-[6px] text-center">
                <span className="block text-[0.75rem] text-[#7e22ce] mb-1 font-[ui-monospace,monospace]">
                  inlineSize
                </span>
                <span className="text-[1.25rem] font-bold text-[#581c87] font-[ui-monospace,monospace]">
                  {dimensions.inlineSize}px
                </span>
              </div>
              <div className="flex-1 [background:#faf5ff] p-3 rounded-[6px] text-center">
                <span className="block text-[0.75rem] text-[#7e22ce] mb-1 font-[ui-monospace,monospace]">
                  blockSize
                </span>
                <span className="text-[1.25rem] font-bold text-[#581c87] font-[ui-monospace,monospace]">
                  {dimensions.blockSize}px
                </span>
              </div>
            </div>
          </div>

          <div className="[background:#ffffff] rounded-xl p-4 [border:1px_solid_#e9d5ff] [&_p]:m-0 [&_p]:text-[0.9rem] [&_p]:text-[#475569] [&_p]:leading-[1.6] [&_strong]:text-[#7e22ce]">
            {selectedBox === "content-box" ? (
              <p>
                <strong>content-box</strong>（預設值）：只計算內容區域的尺寸， 不包含 padding 和 border。
              </p>
            ) : (
              <p>
                <strong>border-box</strong>：計算包含 padding 和 border 在內的完整尺寸。 尺寸 = content + padding × 2 +
                border × 2
              </p>
            )}
          </div>

          <div className="text-center min-h-6 [&_code]:[background:#f3e8ff] [&_code]:p-[0.5rem_1rem] [&_code]:rounded-lg [&_code]:text-[0.85rem] [&_code]:text-[#7e22ce]">
            {selectedBox === "border-box" && (
              <code>
                {dimensions.inlineSize} = content + {padding * 2} + {border * 2}
              </code>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResizeObserverBoxOptions;
