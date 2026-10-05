import type React from "react";
import { useState } from "react";

interface BoxSizingComparisonProps {
  title?: string;
  description?: string;
  showControls?: boolean;
}
const BoxSizingComparison: React.FC<BoxSizingComparisonProps> = ({
  title = "box-sizing 屬性比較",
  description = "比較 content-box 與 border-box 的差異",
  showControls = true,
}) => {
  const [width, setWidth] = useState(300);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(5);
  const contentBoxTotal = width + padding * 2 + border * 2;
  const contentBoxContentWidth = width;
  const borderBoxTotal = width;
  const borderBoxContentWidth = width - padding * 2 - border * 2;
  return (
    <div className="m-[2rem_0] p-6 [background:#f9fafb] rounded-xl">
      {title && <h3 className="m-[0_0_0.5rem_0] text-[#1f2937] text-[1.25rem]">{title}</h3>}
      {description && <p className="m-[0_0_1.5rem_0] text-[#6b7280] text-[0.95rem]">{description}</p>}

      {showControls && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 p-4 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb]">
          <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              Width: {width}px
              <input
                type="range"
                min="200"
                max="400"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </span>
          </div>
          <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              Padding: {padding}px
              <input
                type="range"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
              />
            </span>
          </div>
          <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              Border: {border}px
              <input type="range" min="0" max="20" value={border} onChange={(e) => setBorder(Number(e.target.value))} />
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mb-6">
        <div className="flex flex-col gap-4">
          <h4 className="m-0 p-[0.75rem_1rem] [background:white] rounded-[6px] [border:2px_solid_#e5e7eb] text-[1rem] text-[#1f2937] text-center">
            content-box (預設)
          </h4>
          <div className="p-4 [background:#1f2937] rounded-[6px] font-['Courier_New',monospace] text-[0.85rem] [&_code]:text-[#e5e7eb] [&_code]:leading-[1.6]">
            <code>
              width: {width}px;
              <br />
              padding: {padding}px;
              <br />
              border: {border}px;
              <br />
              box-sizing: content-box;
            </code>
          </div>
          <div className="flex justify-center p-8 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb] overflow-x-auto">
            <div
              className="[background:#eff6ff] flex justify-center items-center min-h-25 border-[#3b82f6]!"
              style={{
                width: `${width}px`,
                padding: `${padding}px`,
                border: `${border}px solid #3b82f6`,
              }}
            >
              <div className="text-[0.9rem] font-semibold text-[#1f2937] text-center p-2">
                Content Width: {contentBoxContentWidth}px
              </div>
            </div>
          </div>
          <div className="p-4 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb]">
            <div className="flex justify-between items-center p-[0.5rem_0] [border-bottom:1px_solid_#f3f4f6] last-of-type:[border-bottom:none]">
              <span className="text-[0.9rem] text-[#6b7280] font-medium">Content 寬度:</span>
              <span className="text-[0.95rem] text-[#1f2937] font-semibold">{contentBoxContentWidth}px</span>
            </div>
            <div className="flex justify-between items-center p-[0.5rem_0] [border-bottom:1px_solid_#f3f4f6] last-of-type:[border-bottom:none]">
              <span className="text-[0.9rem] text-[#6b7280] font-medium">實際總寬度:</span>
              <span className="text-[0.95rem] text-[#1f2937] font-semibold">{contentBoxTotal}px</span>
            </div>
            <div className="mt-3 p-3 [background:#f9fafb] rounded-lg text-[0.85rem] text-[#4b5563] text-center font-['Courier_New',monospace]">
              {width} + {padding * 2} + {border * 2} = {contentBoxTotal}px
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="m-0 p-[0.75rem_1rem] [background:white] rounded-[6px] [border:2px_solid_#e5e7eb] text-[1rem] text-[#1f2937] text-center">
            border-box
          </h4>
          <div className="p-4 [background:#1f2937] rounded-[6px] font-['Courier_New',monospace] text-[0.85rem] [&_code]:text-[#e5e7eb] [&_code]:leading-[1.6]">
            <code>
              width: {width}px;
              <br />
              padding: {padding}px;
              <br />
              border: {border}px;
              <br />
              box-sizing: border-box;
            </code>
          </div>
          <div className="flex justify-center p-8 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb] overflow-x-auto">
            <div
              className="[background:#eff6ff] flex justify-center items-center min-h-25 border-[#10b981]!"
              style={{
                width: `${width}px`,
                padding: `${padding}px`,
                border: `${border}px solid #10b981`,
                boxSizing: "border-box",
              }}
            >
              <div className="text-[0.9rem] font-semibold text-[#1f2937] text-center p-2">
                Content Width: {borderBoxContentWidth}px
              </div>
            </div>
          </div>
          <div className="p-4 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb]">
            <div className="flex justify-between items-center p-[0.5rem_0] [border-bottom:1px_solid_#f3f4f6] last-of-type:[border-bottom:none]">
              <span className="text-[0.9rem] text-[#6b7280] font-medium">Content 寬度:</span>
              <span className="text-[0.95rem] text-[#1f2937] font-semibold">{borderBoxContentWidth}px</span>
            </div>
            <div className="flex justify-between items-center p-[0.5rem_0] [border-bottom:1px_solid_#f3f4f6] last-of-type:[border-bottom:none]">
              <span className="text-[0.9rem] text-[#6b7280] font-medium">實際總寬度:</span>
              <span className="text-[0.95rem] text-[#1f2937] font-semibold">{borderBoxTotal}px</span>
            </div>
            <div className="mt-3 p-3 [background:#f9fafb] rounded-lg text-[0.85rem] text-[#4b5563] text-center font-['Courier_New',monospace]">
              {width} - {padding * 2} - {border * 2} = {borderBoxContentWidth}
              px (content)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoxSizingComparison;
