import type React from "react";
import { useState } from "react";

// Props 介面定義
interface FlexItemExampleProps {
  title?: string;
  description?: string;
  showControls?: "flexGrow" | "flexShrink" | "flexBasis" | false;
  initialFlexGrow1?: number;
  initialFlexGrow2?: number;
  initialFlexGrow3?: number;
  initialFlexShrink1?: number;
  initialFlexShrink2?: number;
  initialFlexShrink3?: number;
  initialFlexBasis1?: number;
  initialFlexBasis2?: number;
  initialFlexBasis3?: number;
  basisUnit?: "px" | "%" | "rem" | "em" | "auto";
}
// 項目控制元件 Props
interface ItemControlProps {
  itemNumber: number;
  showControls: "flexGrow" | "flexShrink" | "flexBasis";
  flexGrow: number;
  flexShrink: number;
  flexBasis: number;
  basisUnit: string;
  onFlexGrowChange: (value: number) => void;
  onFlexShrinkChange: (value: number) => void;
  onFlexBasisChange: (value: number) => void;
}
// Flex 項目元件 Props
interface FlexItemProps {
  itemNumber: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
}
/**
 * 項目控制元件
 * 根據 showControls 顯示對應的輸入控制項
 */
const ItemControl: React.FC<ItemControlProps> = ({
  itemNumber,
  showControls,
  flexGrow,
  flexShrink,
  flexBasis,
  basisUnit,
  onFlexGrowChange,
  onFlexShrinkChange,
  onFlexBasisChange,
}) => (
  <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-[1rem] [&_h4]:text-(--ifm-color-primary) in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
    <h4>Item {itemNumber}</h4>
    {showControls === "flexGrow" && (
      <div className="flex flex-col gap-1 mb-3 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
        <span className="block mb-2 text-sm font-medium">flex-grow:</span>
        <input type="number" min="0" value={flexGrow} onChange={(e) => onFlexGrowChange(Number(e.target.value))} />
      </div>
    )}
    {showControls === "flexShrink" && (
      <div className="flex flex-col gap-1 mb-3 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
        <span className="block mb-2 text-sm font-medium">flex-shrink:</span>
        <input type="number" min="0" value={flexShrink} onChange={(e) => onFlexShrinkChange(Number(e.target.value))} />
      </div>
    )}
    {showControls === "flexBasis" && basisUnit !== "auto" && (
      <div className="flex flex-col gap-1 mb-3 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
        <span className="block mb-2 text-sm font-medium">flex-basis ({basisUnit}):</span>
        <input type="number" min="0" value={flexBasis} onChange={(e) => onFlexBasisChange(Number(e.target.value))} />
      </div>
    )}
  </div>
);
/**
 * Flex 項目顯示元件
 * 顯示項目及其當前的 flex 屬性值
 */
const FlexItem: React.FC<FlexItemProps> = ({ itemNumber, flexGrow, flexShrink, flexBasis }) => (
  <div
    className="flex flex-col justify-center items-center p-2 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] [border:2px_solid_white] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:all_0.3s_ease]"
    style={{
      flexGrow,
      flexShrink,
      flexBasis,
    }}
  >
    <div className="[font-weight:bold] text-[1.1rem] mb-2">Item {itemNumber}</div>
    <div className="text-[0.75rem] text-center opacity-[0.9] [&_code]:whitespace-pre [&_code]:leading-[1.4]">
      <code>
        {`flex-grow: ${flexGrow}
flex-shrink: ${flexShrink}
flex-basis: ${flexBasis}`}
      </code>
    </div>
  </div>
);
/**
 * Flex Item 屬性範例元件
 * 用於展示 flex-grow、flex-shrink、flex-basis 的效果
 *
 * @param showControls - 控制顯示哪個屬性的調整選項
 */
function FlexItemExample({
  title = "Flex Item 屬性範例",
  description,
  showControls = false,
  initialFlexGrow1 = 0,
  initialFlexGrow2 = 0,
  initialFlexGrow3 = 0,
  initialFlexShrink1 = 1,
  initialFlexShrink2 = 1,
  initialFlexShrink3 = 1,
  initialFlexBasis1 = 0,
  initialFlexBasis2 = 0,
  initialFlexBasis3 = 0,
  basisUnit = "auto",
}: FlexItemExampleProps) {
  // 狀態管理 - Item 1
  const [flexGrow1, setFlexGrow1] = useState(initialFlexGrow1);
  const [flexShrink1, setFlexShrink1] = useState(initialFlexShrink1);
  const [flexBasis1, setFlexBasis1] = useState(initialFlexBasis1);
  // 狀態管理 - Item 2
  const [flexGrow2, setFlexGrow2] = useState(initialFlexGrow2);
  const [flexShrink2, setFlexShrink2] = useState(initialFlexShrink2);
  const [flexBasis2, setFlexBasis2] = useState(initialFlexBasis2);
  // 狀態管理 - Item 3
  const [flexGrow3, setFlexGrow3] = useState(initialFlexGrow3);
  const [flexShrink3, setFlexShrink3] = useState(initialFlexShrink3);
  const [flexBasis3, setFlexBasis3] = useState(initialFlexBasis3);
  // 計算 flex-basis 的最終值
  const getBasisValue = (value: number) => (basisUnit === "auto" ? "auto" : `${value}${basisUnit}`);
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      {showControls && (
        <div className="flex flex-wrap gap-6 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
          <ItemControl
            itemNumber={1}
            showControls={showControls}
            flexGrow={flexGrow1}
            flexShrink={flexShrink1}
            flexBasis={flexBasis1}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow1}
            onFlexShrinkChange={setFlexShrink1}
            onFlexBasisChange={setFlexBasis1}
          />
          <ItemControl
            itemNumber={2}
            showControls={showControls}
            flexGrow={flexGrow2}
            flexShrink={flexShrink2}
            flexBasis={flexBasis2}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow2}
            onFlexShrinkChange={setFlexShrink2}
            onFlexBasisChange={setFlexBasis2}
          />
          <ItemControl
            itemNumber={3}
            showControls={showControls}
            flexGrow={flexGrow3}
            flexShrink={flexShrink3}
            flexBasis={flexBasis3}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow3}
            onFlexShrinkChange={setFlexShrink3}
            onFlexBasisChange={setFlexBasis3}
          />
        </div>
      )}

      {/* Flex 容器與項目 */}
      <div
        className="flex gap-0 min-h-50 p-0 bg-(--ifm-color-emphasis-100) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)"
        style={{
          maxWidth: showControls === "flexShrink" ? "500px" : "none",
        }}
      >
        <FlexItem itemNumber={1} flexGrow={flexGrow1} flexShrink={flexShrink1} flexBasis={getBasisValue(flexBasis1)} />
        <FlexItem itemNumber={2} flexGrow={flexGrow2} flexShrink={flexShrink2} flexBasis={getBasisValue(flexBasis2)} />
        <FlexItem itemNumber={3} flexGrow={flexGrow3} flexShrink={flexShrink3} flexBasis={getBasisValue(flexBasis3)} />
      </div>
    </div>
  );
}
export default FlexItemExample;
