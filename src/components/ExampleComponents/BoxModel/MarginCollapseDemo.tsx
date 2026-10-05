import type React from "react";
import { useState } from "react";

interface MarginCollapseDemoProps {
  title?: string;
  description?: string;
}
const MarginCollapseDemo: React.FC<MarginCollapseDemoProps> = ({
  title = "Margin Collapse (外距折疊) 示範",
  description = "觀察垂直方向上相鄰元素的 margin 如何折疊",
}) => {
  const [topMargin, setTopMargin] = useState(30);
  const [bottomMargin, setBottomMargin] = useState(20);
  const [useFloat, setUseFloat] = useState(false);
  const [useFlexbox, setUseFlexbox] = useState(false);
  const collapsedMargin = Math.max(topMargin, bottomMargin);
  return (
    <div className="m-[2rem_0] p-6 [background:#f9fafb] rounded-xl">
      {title && <h3 className="m-[0_0_0.5rem_0] text-[#1f2937] text-[1.25rem]">{title}</h3>}
      {description && <p className="m-[0_0_1.5rem_0] text-[#6b7280] text-[0.95rem]">{description}</p>}

      <div className="flex flex-col gap-4 mb-8 p-4 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb]">
        <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
          <span className="block mb-2 text-sm font-medium">
            上方元素 margin-bottom: {topMargin}px
            <input
              type="range"
              min="0"
              max="60"
              value={topMargin}
              onChange={(e) => setTopMargin(Number(e.target.value))}
            />
          </span>
        </div>
        <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
          <span className="block mb-2 text-sm font-medium">
            下方元素 margin-top: {bottomMargin}px
            <input
              type="range"
              min="0"
              max="60"
              value={bottomMargin}
              onChange={(e) => setBottomMargin(Number(e.target.value))}
            />
          </span>
        </div>
        <div className="flex gap-6 pt-2 [border-top:1px_solid_#e5e7eb] [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_label]:cursor-pointer [&_input[type='checkbox']]:cursor-pointer [&_input[type='checkbox']]:w-4 [&_input[type='checkbox']]:h-4">
          <span className="block mb-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={useFloat}
              onChange={(e) => {
                setUseFloat(e.target.checked);
                if (e.target.checked) setUseFlexbox(false);
              }}
            />
            使用 float (阻止折疊)
          </span>
          <span className="block mb-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={useFlexbox}
              onChange={(e) => {
                setUseFlexbox(e.target.checked);
                if (e.target.checked) setUseFloat(false);
              }}
            />
            使用 Flexbox (阻止折疊)
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="m-[0_0_1rem_0] text-[#1f2937] text-[1rem] font-semibold">視覺化示範</h4>
        <div
          className="p-8 [background:white] rounded-[6px] [border:2px_dashed_#d1d5db] min-h-75"
          style={{
            display: useFlexbox ? "flex" : "block",
            flexDirection: useFlexbox ? "column" : undefined,
          }}
        >
          <div
            className="p-6 [background:linear-gradient(135deg,#667eea_0%,#764ba2_100%)] rounded-[6px] text-[white] [box-shadow:0_4px_6px_rgba(0,0,0,0.1)]"
            style={{
              marginBottom: `${topMargin}px`,
              float: useFloat ? "left" : "none",
              width: useFloat ? "100%" : "auto",
            }}
          >
            <div className="text-[1rem] font-semibold mb-2">上方元素</div>
            <div className="text-[0.85rem] opacity-[0.9] font-['Courier_New',monospace]">
              margin-bottom: {topMargin}px
            </div>
          </div>
          <div
            className="p-6 [background:linear-gradient(135deg,#667eea_0%,#764ba2_100%)] rounded-[6px] text-[white] [box-shadow:0_4px_6px_rgba(0,0,0,0.1)]"
            style={{
              marginTop: `${bottomMargin}px`,
              float: useFloat ? "left" : "none",
              width: useFloat ? "100%" : "auto",
            }}
          >
            <div className="text-[1rem] font-semibold mb-2">下方元素</div>
            <div className="text-[0.85rem] opacity-[0.9] font-['Courier_New',monospace]">
              margin-top: {bottomMargin}px
            </div>
          </div>
          {useFloat && <div style={{ clear: "both" }}></div>}
        </div>
      </div>

      <div className="mb-6 p-6 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb] [&_h4]:m-[0_0_1rem_0] [&_h4]:text-[#1f2937] [&_h4]:text-[1rem]">
        <h4>實際間距:</h4>
        {!useFloat && !useFlexbox ? (
          <div className="flex flex-col gap-3">
            <div className="p-[0.5rem_1rem] [background:#eff6ff] [border-left:3px_solid_#3b82f6] rounded-lg font-semibold text-[#1e40af] text-[0.95rem]">
              發生 Margin Collapse
            </div>
            <div className="p-4 [background:#f0fdf4] rounded-[6px] text-[1rem] text-[#166534] text-center [&_strong]:text-[1.25rem] [&_strong]:text-[#15803d]">
              間距 = max({topMargin}px, {bottomMargin}px) = <strong>{collapsedMargin}px</strong>
            </div>
            <div className="p-3 [background:#fef3c7] rounded-lg text-[0.85rem] text-[#92400e] text-center">
              兩個 margin 會折疊,取較大值作為實際間距
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="p-[0.5rem_1rem] [background:#eff6ff] [border-left:3px_solid_#3b82f6] rounded-lg font-semibold text-[#1e40af] text-[0.95rem]">
              未發生 Margin Collapse
            </div>
            <div className="p-4 [background:#f0fdf4] rounded-[6px] text-[1rem] text-[#166534] text-center [&_strong]:text-[1.25rem] [&_strong]:text-[#15803d]">
              間距 = {topMargin}px + {bottomMargin}px = <strong>{topMargin + bottomMargin}px</strong>
            </div>
            <div className="p-3 [background:#fef3c7] rounded-lg text-[0.85rem] text-[#92400e] text-center">
              {useFloat && "使用 float 會建立 BFC,阻止 margin collapse"}
              {useFlexbox && "Flexbox 容器內的子元素不會發生 margin collapse"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MarginCollapseDemo;
