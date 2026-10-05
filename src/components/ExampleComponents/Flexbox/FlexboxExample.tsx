import type React from "react";
import { useState } from "react";

// Props 介面定義
interface FlexboxExampleProps {
  title?: string;
  description?: string;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  alignContent?: "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: number;
  gapUnit?: "px" | "rem" | "em" | "%";
  itemCount?: number;
  showControls?:
    | "all"
    | "flexDirection"
    | "justifyContent"
    | "alignItems"
    | "alignContent"
    | "flexWrap"
    | "gap"
    | false;
}
// 選項元件 Props
interface SelectControlProps {
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}
const flexDirectionOptions = [
  { value: "row", label: "row" },
  { value: "row-reverse", label: "row-reverse" },
  { value: "column", label: "column" },
  { value: "column-reverse", label: "column-reverse" },
];
const justifyContentOptions = [
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
  { value: "space-evenly", label: "space-evenly" },
];
const alignItemsOptions = [
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "baseline", label: "baseline" },
];
const alignContentOptions = [
  { value: "stretch", label: "stretch" },
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
  { value: "space-evenly", label: "space-evenly" },
];
const flexWrapOptions = [
  { value: "nowrap", label: "nowrap" },
  { value: "wrap", label: "wrap" },
  { value: "wrap-reverse", label: "wrap-reverse" },
];
const gapUnitOptions = [
  { value: "px", label: "px" },
  { value: "rem", label: "rem" },
  { value: "em", label: "em" },
  { value: "%", label: "%" },
];
/**
 * 通用選項控制元件
 * 用於渲染 select 下拉選單
 */
const SelectControl: React.FC<SelectControlProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
    <span className="block mb-2 text-sm font-medium">{label}:</span>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
/**
 * Flexbox 互動範例元件
 * 用於展示 Flexbox 容器屬性的效果
 *
 * @param showControls - 控制顯示哪些屬性的調整選項
 *   - "all": 顯示所有控制項
 *   - 特定屬性名稱: 只顯示該屬性的控制項
 *   - false: 不顯示控制項
 */
function FlexboxExample({
  title = "Flexbox 範例",
  description,
  flexDirection: initialFlexDirection = "row",
  justifyContent: initialJustifyContent = "flex-start",
  alignItems: initialAlignItems = "stretch",
  alignContent: initialAlignContent = "stretch",
  flexWrap: initialFlexWrap = "nowrap",
  gap: initialGap = 10,
  gapUnit: initialGapUnit = "px",
  itemCount = 5,
  showControls = false,
}: FlexboxExampleProps) {
  // 狀態管理
  const [flexDirection, setFlexDirection] = useState(initialFlexDirection);
  const [justifyContent, setJustifyContent] = useState(initialJustifyContent);
  const [alignItems, setAlignItems] = useState(initialAlignItems);
  const [alignContent, setAlignContent] = useState(initialAlignContent);
  const [flexWrap, setFlexWrap] = useState(initialFlexWrap);
  const [gap, setGap] = useState(initialGap);
  const [gapUnit, setGapUnit] = useState(initialGapUnit);
  const [currentItemCount, setCurrentItemCount] = useState(itemCount);
  // 計算最終的 gap 值
  const gapValue = `${gap}${gapUnit}`;
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      {showControls && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
          {/* flex-direction 控制 */}
          {(showControls === "all" || showControls === "flexDirection") && (
            <SelectControl
              label="flex-direction"
              value={flexDirection}
              options={flexDirectionOptions}
              onChange={(value) => setFlexDirection(value as typeof flexDirection)}
            />
          )}

          {/* justify-content 控制 */}
          {(showControls === "all" || showControls === "justifyContent") && (
            <SelectControl
              label="justify-content"
              value={justifyContent}
              options={justifyContentOptions}
              onChange={(value) => setJustifyContent(value as typeof justifyContent)}
            />
          )}

          {/* align-items 控制 */}
          {(showControls === "all" || showControls === "alignItems") && (
            <SelectControl
              label="align-items"
              value={alignItems}
              options={alignItemsOptions}
              onChange={(value) => setAlignItems(value as typeof alignItems)}
            />
          )}

          {/* align-content 控制 */}
          {(showControls === "all" || showControls === "alignContent") && (
            <SelectControl
              label="align-content"
              value={alignContent}
              options={alignContentOptions}
              onChange={(value) => setAlignContent(value as typeof alignContent)}
            />
          )}

          {/* flex-wrap 控制 */}
          {(showControls === "all" || showControls === "flexWrap") && (
            <SelectControl
              label="flex-wrap"
              value={flexWrap}
              options={flexWrapOptions}
              onChange={(value) => setFlexWrap(value as typeof flexWrap)}
            />
          )}

          {/* gap 控制 (數值 + 單位) */}
          {(showControls === "all" || showControls === "gap") && (
            <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">gap:</span>
              <div className="flex gap-2 [&_input]:flex-1 [&_input]:min-w-15 [&_select]:w-17.5">
                <input type="number" min="0" value={gap} onChange={(e) => setGap(Number(e.target.value))} />
                <select value={gapUnit} onChange={(e) => setGapUnit(e.target.value as typeof gapUnit)}>
                  {gapUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 項目數量控制 (僅在完整模式顯示) */}
          {showControls === "all" && (
            <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">項目數量:</span>
              <div className="flex items-center gap-3 [&_button]:w-8 [&_button]:h-8 [&_button]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_button]:rounded-lg [&_button]:bg-(--ifm-background-color) [&_button]:text-(--ifm-font-color-base) [&_button]:text-[1.2rem] [&_button]:[font-weight:bold] [&_button]:cursor-pointer [&_button]:[transition:all_0.2s] [&_button:hover:not(:disabled)]:bg-(--ifm-color-primary) [&_button:hover:not(:disabled)]:text-[white] [&_button:hover:not(:disabled)]:border-(--ifm-color-primary) [&_button:disabled]:opacity-[0.4] [&_button:disabled]:cursor-not-allowed [&_span]:min-w-7.5 [&_span]:text-center [&_span]:font-semibold [&_span]:text-[1rem]">
                <button
                  onClick={() => setCurrentItemCount(Math.max(1, currentItemCount - 1))}
                  disabled={currentItemCount <= 1}
                  type="button"
                >
                  -
                </button>
                <span>{currentItemCount}</span>
                <button
                  onClick={() => setCurrentItemCount(Math.min(15, currentItemCount + 1))}
                  disabled={currentItemCount >= 15}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS 程式碼顯示區 */}
      <div className="mb-4 p-4 bg-(--ifm-code-background) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_code]:block [&_code]:[font-family:var(--ifm-font-family-monospace)] [&_code]:text-[0.9rem] [&_code]:text-(--ifm-color-emphasis-900) [&_code]:whitespace-pre [&_code]:leading-[1.6] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <code>
          {`display: flex;
flex-direction: ${flexDirection};
justify-content: ${justifyContent};
align-items: ${alignItems};
align-content: ${alignContent};
flex-wrap: ${flexWrap};
gap: ${gapValue};`}
        </code>
      </div>

      {/* Flexbox 容器與項目 */}
      <div
        className="flex min-h-75 p-4 bg-(--ifm-color-emphasis-100) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)"
        style={{
          display: "flex",
          flexDirection,
          justifyContent,
          alignItems,
          alignContent,
          flexWrap,
          gap: gapValue,
          maxHeight: flexDirection.includes("column") ? "600px" : "none",
        }}
      >
        {Array.from({ length: currentItemCount }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: 範例與骨架的固定編號不會重新排序，也不保存個別項目的狀態。
            key={i}
            className="flex items-center justify-center min-w-20 min-h-20 p-4 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] [font-weight:bold] text-[1.2rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)]"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
export default FlexboxExample;
