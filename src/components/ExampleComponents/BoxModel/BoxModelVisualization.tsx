import type React from "react";
import { useState } from "react";

interface BoxModelVisualizationProps {
  title?: string;
  description?: string;
  showControls?: boolean;
  initialContent?: number;
  initialPadding?: number;
  initialBorder?: number;
  initialMargin?: number;
}
const BoxModelVisualization: React.FC<BoxModelVisualizationProps> = ({
  title = "Box Model 視覺化",
  description = "調整各個屬性來觀察 Box Model 的變化",
  showControls = true,
  initialContent = 200,
  initialPadding = 30,
  initialBorder = 5,
  initialMargin = 30,
}) => {
  const [contentSize, setContentSize] = useState(initialContent);
  const [padding, setPadding] = useState(initialPadding);
  const [border, setBorder] = useState(initialBorder);
  const [margin, setMargin] = useState(initialMargin);
  const totalWidth = contentSize + padding * 2 + border * 2;
  const _totalHeight = contentSize + padding * 2 + border * 2;
  const totalWithMargin = totalWidth + margin * 2;
  return (
    <div className="m-[2rem_0] p-6 [background:#f9fafb] rounded-xl">
      {title && <h3 className="m-[0_0_0.5rem_0] text-[#1f2937] text-[1.25rem]">{title}</h3>}
      {description && <p className="m-[0_0_1.5rem_0] text-[#6b7280] text-[0.95rem]">{description}</p>}

      {showControls && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 p-4 [background:white] rounded-[6px] [border:1px_solid_#e5e7eb]">
          <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              Content: {contentSize}px
              <input
                type="range"
                min="100"
                max="300"
                value={contentSize}
                onChange={(e) => setContentSize(Number(e.target.value))}
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
          <div className="[&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[0.9rem] [&_label]:font-medium [&_label]:text-[#374151] [&_input[type='range']]:w-full [&_input[type='range']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              Margin: {margin}px
              <input type="range" min="0" max="50" value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 p-8 [background:white] rounded-[6px] overflow-x-auto">
        <div className="flex flex-col gap-2 w-full max-w-125">
          <div className="p-[0.75rem_1rem] [background:#eff6ff] [border-left:3px_solid_#3b82f6] rounded-lg flex flex-col gap-2">
            <div className="text-[1rem] font-medium text-[#1e40af]">總寬度 (含 margin): {totalWithMargin}px</div>
            <div className="text-[0.85rem] text-[#3b82f6] font-['Courier_New',monospace]">
              = Content ({contentSize}px) + Padding ({padding * 2}px) + Border ({border * 2}px) + Margin ({margin * 2}
              px)
            </div>
          </div>
          <div className="p-[0.75rem_1rem] [background:#eff6ff] [border-left:3px_solid_#3b82f6] rounded-lg flex flex-col gap-2">
            <div className="text-[1rem] font-medium text-[#1e40af]">盒子寬度: {totalWidth}px</div>
            <div className="text-[0.85rem] text-[#3b82f6] font-['Courier_New',monospace]">
              = Content ({contentSize}px) + Padding ({padding * 2}px) + Border ({border * 2}px)
            </div>
          </div>
        </div>

        <div
          className="relative [background:linear-gradient(135deg,#fef3c7_0%,#fde68a_100%)] [border:2px_dashed_#f59e0b] inline-flex justify-center items-center"
          style={{
            padding: `${margin}px`,
          }}
        >
          <div className="absolute top-1 left-1 text-[0.75rem] font-semibold text-[#92400e] [background:rgba(255,255,255,0.9)] p-[2px_6px] rounded-[3px]">
            Margin: {margin}px
          </div>
          <div
            className="relative [background:#fed7aa] flex justify-center items-center"
            style={{
              border: `${border}px solid #f59e0b`,
            }}
          >
            {border > 0 && (
              <div className="absolute top-1 right-1 text-[0.75rem] font-semibold text-[#92400e] [background:rgba(255,255,255,0.9)] p-[2px_6px] rounded-[3px]">
                Border: {border}px
              </div>
            )}
            <div
              className="relative [background:linear-gradient(135deg,#dbeafe_0%,#bfdbfe_100%)] flex justify-center items-center"
              style={{
                padding: `${padding}px`,
              }}
            >
              <div className="absolute bottom-1 left-1 text-[0.75rem] font-semibold text-[#1e40af] [background:rgba(255,255,255,0.9)] p-[2px_6px] rounded-[3px]">
                Padding: {padding}px
              </div>
              <div
                className="[background:linear-gradient(135deg,#60a5fa_0%,#3b82f6_100%)] [border:2px_solid_#1e40af] flex justify-center items-center text-center"
                style={{
                  width: `${contentSize}px`,
                  height: `${contentSize}px`,
                }}
              >
                <div className="text-[0.9rem] font-semibold text-[white] leading-[1.4]">
                  Content
                  <br />
                  {contentSize} × {contentSize}px
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoxModelVisualization;
