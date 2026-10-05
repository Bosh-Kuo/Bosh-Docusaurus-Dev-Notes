import { cn } from "cn";
import type React from "react";
import { useState } from "react";

const ScrollSnapDemo: React.FC = () => {
  const [snapType, setSnapType] = useState<"none" | "mandatory" | "proximity">("mandatory");
  const [snapAlign, setSnapAlign] = useState<"start" | "center" | "end">("start");
  const cards = [
    {
      id: 1,
      title: "卡片 1",
      color: "#FF6B6B",
      description: "這是第一張卡片",
    },
    {
      id: 2,
      title: "卡片 2",
      color: "#4ECDC4",
      description: "這是第二張卡片",
    },
    {
      id: 3,
      title: "卡片 3",
      color: "#45B7D1",
      description: "這是第三張卡片",
    },
    {
      id: 4,
      title: "卡片 4",
      color: "#FFA07A",
      description: "這是第四張卡片",
    },
    {
      id: 5,
      title: "卡片 5",
      color: "#98D8C8",
      description: "這是第五張卡片",
    },
    {
      id: 6,
      title: "卡片 6",
      color: "#F7DC6F",
      description: "這是第六張卡片",
    },
  ];
  const getSnapTypeClass = () => {
    switch (snapType) {
      case "mandatory":
        return "[scroll-snap-type:x_mandatory]";
      case "proximity":
        return "[scroll-snap-type:x_proximity]";
      default:
        return "";
    }
  };
  const getSnapAlignClass = () => {
    switch (snapAlign) {
      case "center":
        return "[&_.ui-components-examplecomponents-scroll-scrollsnapdemo-card]:[scroll-snap-align:center]";
      case "end":
        return "[&_.ui-components-examplecomponents-scroll-scrollsnapdemo-card]:[scroll-snap-align:end]";
      default:
        return "[&_.ui-components-examplecomponents-scroll-scrollsnapdemo-card]:[scroll-snap-align:start]";
    }
  };
  return (
    <div className="p-6 [background:var(--ifm-background-surface-color)] rounded-xl m-[2rem_0]">
      <div className="mb-6 [&_h3]:mb-2 [&_p]:text-(--ifm-color-emphasis-700) [&_p]:m-0 [&_code]:[background:var(--ifm-code-background)] [&_code]:p-[0.2rem_0.4rem] [&_code]:rounded-lg [&_code]:text-[0.9em]">
        <h3>Scroll Snap Demo</h3>
        <p>
          調整下方選項，體驗不同的 <code>scroll-snap-type</code> 與 <code>scroll-snap-align</code> 組合效果。
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 [background:var(--ifm-color-emphasis-100)] rounded-[6px] mb-6">
        <div className="flex flex-col gap-2 [&_>_label]:text-[0.95rem]">
          <span className="block mb-2 text-sm font-medium">
            <strong>scroll-snap-type:</strong>
          </span>
          <div className="flex flex-wrap gap-4 [&_label]:flex [&_label]:items-center [&_label]:gap-[0.4rem] [&_label]:cursor-pointer [&_label]:text-[0.9rem] [&_input[type='radio']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapType"
                value="none"
                checked={snapType === "none"}
                onChange={(e) => setSnapType(e.target.value as "none" | "mandatory" | "proximity")}
              />
              none (無吸附)
            </span>
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapType"
                value="mandatory"
                checked={snapType === "mandatory"}
                onChange={(e) => setSnapType(e.target.value as "none" | "mandatory" | "proximity")}
              />
              mandatory (強制吸附)
            </span>
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapType"
                value="proximity"
                checked={snapType === "proximity"}
                onChange={(e) => setSnapType(e.target.value as "none" | "mandatory" | "proximity")}
              />
              proximity (接近時吸附)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 [&_>_label]:text-[0.95rem]">
          <span className="block mb-2 text-sm font-medium">
            <strong>scroll-snap-align:</strong>
          </span>
          <div className="flex flex-wrap gap-4 [&_label]:flex [&_label]:items-center [&_label]:gap-[0.4rem] [&_label]:cursor-pointer [&_label]:text-[0.9rem] [&_input[type='radio']]:cursor-pointer">
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapAlign"
                value="start"
                checked={snapAlign === "start"}
                onChange={(e) => setSnapAlign(e.target.value as "start" | "center" | "end")}
              />
              start (對齊開始)
            </span>
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapAlign"
                value="center"
                checked={snapAlign === "center"}
                onChange={(e) => setSnapAlign(e.target.value as "start" | "center" | "end")}
              />
              center (對齊中央)
            </span>
            <span className="block mb-2 text-sm font-medium">
              <input
                type="radio"
                name="snapAlign"
                value="end"
                checked={snapAlign === "end"}
                onChange={(e) => setSnapAlign(e.target.value as "start" | "center" | "end")}
              />
              end (對齊結尾)
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-4 mb-3 flex-wrap [&_code]:[background:var(--ifm-code-background)] [&_code]:p-[0.4rem_0.6rem] [&_code]:rounded-lg [&_code]:text-[0.85em]">
          <code>scroll-snap-type: x {snapType}</code>
          <code>scroll-snap-align: {snapAlign}</code>
        </div>
        <div
          className={cn(
            "flex gap-4 overflow-x-auto p-6 [border:2px_solid_var(--ifm-color-emphasis-300)] rounded-[6px] [background:linear-gradient(to_right,#f8f9fa,#e9ecef)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:[background:#f1f1f1] [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:[background:#888] [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:[background:#555]",
            getSnapTypeClass(),
            getSnapAlignClass(),
          )}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="ui-components-examplecomponents-scroll-scrollsnapdemo-card flex-[0_0_280px] h-50 rounded-xl p-6 text-[white] [box-shadow:0_4px_6px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center text-center [transition:transform_0.2s] [&:hover]:transform-[translateY(-4px)] [&:hover]:[box-shadow:0_6px_12px_rgba(0,0,0,0.15)] [&_h4]:m-[0_0_0.5rem_0] [&_h4]:text-[1.5rem] [&_h4]:[font-weight:bold] [&_p]:m-0 [&_p]:text-[1rem] [&_p]:opacity-[0.9] [@media(max-width:_768px)]:flex-[0_0_240px] [@media(max-width:_768px)]:h-45"
              style={{ backgroundColor: card.color }}
            >
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ScrollSnapDemo;
