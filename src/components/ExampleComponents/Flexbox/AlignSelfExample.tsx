import type React from "react";
import { useState } from "react";

// Props 介面定義
interface AlignSelfExampleProps {
  title?: string;
  description?: string;
}
// 項目控制元件 Props
interface ItemControlProps {
  itemNumber: number;
  value: string;
  onChange: (value: string) => void;
}
// Flex 項目元件 Props
interface FlexItemProps {
  itemNumber: number;
  alignSelf: string;
}
// align-self 可用選項
const alignSelfOptions = [
  { value: "auto", label: "auto" },
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "baseline", label: "baseline" },
];
/**
 * 項目控制元件
 * 用於調整單個項目的 align-self 屬性
 */
const ItemControl: React.FC<ItemControlProps> = ({ itemNumber, value, onChange }) => (
  <div className="flex-1 min-w-45 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-[1rem] [&_h4]:text-(--ifm-color-primary) in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
    <h4>Item {itemNumber}</h4>
    <div className="flex flex-col gap-1 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary)">
      <span className="block mb-2 text-sm font-medium">align-self:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {alignSelfOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
/**
 * Flex 項目顯示元件
 * 顯示項目及其當前的 align-self 值
 */
const FlexItem: React.FC<FlexItemProps> = ({ itemNumber, alignSelf }) => (
  <div
    className="flex flex-col justify-center items-center flex-1 p-4 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)]"
    style={{ alignSelf: alignSelf as React.CSSProperties["alignSelf"] }}
  >
    <div className="[font-weight:bold] text-[1.1rem] mb-2">Item {itemNumber}</div>
    <div className="text-[0.75rem] text-center opacity-[0.9]">
      <code>align-self: {alignSelf}</code>
    </div>
  </div>
);
/**
 * align-self 屬性範例元件
 * 用於展示 align-self 如何覆蓋容器的 align-items 設定
 */
function AlignSelfExample({ title = "align-self 範例", description }: AlignSelfExampleProps) {
  // 狀態管理
  const [alignSelf1, setAlignSelf1] = useState<string>("auto");
  const [alignSelf2, setAlignSelf2] = useState<string>("auto");
  const [alignSelf3, setAlignSelf3] = useState<string>("auto");
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      <div className="flex flex-wrap gap-6 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
        <ItemControl itemNumber={1} value={alignSelf1} onChange={setAlignSelf1} />
        <ItemControl itemNumber={2} value={alignSelf2} onChange={setAlignSelf2} />
        <ItemControl itemNumber={3} value={alignSelf3} onChange={setAlignSelf3} />
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className="mb-4 p-4 bg-(--ifm-code-background) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_code]:block [&_code]:[font-family:var(--ifm-font-family-monospace)] [&_code]:text-[0.9rem] [&_code]:text-(--ifm-color-emphasis-900) [&_code]:whitespace-pre [&_code]:leading-[1.6] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <code>
          {`/* Container */
display: flex;
align-items: stretch; /* 預設對齊方式 */`}
        </code>
      </div>

      {/* Flex 容器與項目 */}
      <div className="flex items-stretch gap-2.5 min-h-75 p-4 bg-(--ifm-color-emphasis-100) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <FlexItem itemNumber={1} alignSelf={alignSelf1} />
        <FlexItem itemNumber={2} alignSelf={alignSelf2} />
        <FlexItem itemNumber={3} alignSelf={alignSelf3} />
      </div>
    </div>
  );
}
export default AlignSelfExample;
