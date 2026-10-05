import type React from "react";
import { useState } from "react";

// Props 介面定義
interface GridExampleProps {
  title?: string;
  description?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gap?: number;
  gapUnit?: "px" | "rem" | "em" | "%";
  rowGap?: number;
  columnGap?: number;
  justifyItems?: "start" | "end" | "center" | "stretch";
  alignItems?: "start" | "end" | "center" | "stretch";
  justifyContent?: "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly";
  alignContent?: "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly";
  itemCount?: number;
  showControls?:
    | "all"
    | "gridTemplate"
    | "gap"
    | "justifyItems"
    | "alignItems"
    | "justifyContent"
    | "alignContent"
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
const justifyItemsOptions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];
const alignItemsOptions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];
const justifyContentOptions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
  { value: "space-evenly", label: "space-evenly" },
];
const alignContentOptions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
  { value: "space-evenly", label: "space-evenly" },
];
const gapUnitOptions = [
  { value: "px", label: "px" },
  { value: "rem", label: "rem" },
  { value: "em", label: "em" },
  { value: "%", label: "%" },
];
const gridTemplateColumnsOptions = [
  { value: "repeat(3, 1fr)", label: "repeat(3, 1fr)" },
  { value: "repeat(4, 1fr)", label: "repeat(4, 1fr)" },
  { value: "repeat(2, 1fr)", label: "repeat(2, 1fr)" },
  { value: "1fr 2fr 1fr", label: "1fr 2fr 1fr" },
  { value: "200px 1fr 2fr", label: "200px 1fr 2fr" },
  { value: "repeat(auto-fit, minmax(150px, 1fr))", label: "repeat(auto-fit, minmax(150px, 1fr))" },
  { value: "repeat(auto-fill, minmax(200px, 1fr))", label: "repeat(auto-fill, minmax(200px, 1fr))" },
  { value: "100px 200px 100px", label: "100px 200px 100px" },
];
const gridTemplateRowsOptions = [
  { value: "auto", label: "auto" },
  { value: "repeat(3, 100px)", label: "repeat(3, 100px)" },
  { value: "repeat(2, 150px)", label: "repeat(2, 150px)" },
  { value: "100px auto 100px", label: "100px auto 100px" },
  { value: "repeat(3, 1fr)", label: "repeat(3, 1fr)" },
];
/**
 * 通用選項控制元件
 * 用於渲染 select 下拉選單
 */
const SelectControl: React.FC<SelectControlProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
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
 * Grid 互動範例元件
 * 用於展示 CSS Grid 容器屬性的效果
 *
 * @param showControls - 控制顯示哪些屬性的調整選項
 *   - "all": 顯示所有控制項
 *   - 特定屬性名稱: 只顯示該屬性的控制項
 *   - false: 不顯示控制項
 */
function GridExample({
  title = "Grid 範例",
  description,
  gridTemplateColumns: initialGridTemplateColumns = "repeat(3, 1fr)",
  gridTemplateRows: initialGridTemplateRows = "auto",
  gap: initialGap = 10,
  gapUnit: initialGapUnit = "px",
  rowGap: initialRowGap,
  columnGap: initialColumnGap,
  justifyItems: initialJustifyItems = "stretch",
  alignItems: initialAlignItems = "stretch",
  justifyContent: initialJustifyContent = "start",
  alignContent: initialAlignContent = "start",
  itemCount = 9,
  showControls = false,
}: GridExampleProps) {
  // 狀態管理
  const [gridTemplateColumns, setGridTemplateColumns] = useState(initialGridTemplateColumns);
  const [gridTemplateRows, setGridTemplateRows] = useState(initialGridTemplateRows);
  const [gap, setGap] = useState(initialGap);
  const [gapUnit, setGapUnit] = useState(initialGapUnit);
  const [rowGap, setRowGap] = useState(initialRowGap ?? initialGap);
  const [columnGap, setColumnGap] = useState(initialColumnGap ?? initialGap);
  const [useIndividualGaps, setUseIndividualGaps] = useState(
    initialRowGap !== undefined || initialColumnGap !== undefined,
  );
  const [justifyItems, setJustifyItems] = useState(initialJustifyItems);
  const [alignItems, setAlignItems] = useState(initialAlignItems);
  const [justifyContent, setJustifyContent] = useState(initialJustifyContent);
  const [alignContent, setAlignContent] = useState(initialAlignContent);
  const [currentItemCount, setCurrentItemCount] = useState(itemCount);
  // 計算最終的 gap 值
  const gapValue = !useIndividualGaps ? `${gap}${gapUnit}` : undefined;
  const rowGapValue = useIndividualGaps ? `${rowGap}${gapUnit}` : undefined;
  const columnGapValue = useIndividualGaps ? `${columnGap}${gapUnit}` : undefined;
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      {showControls && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
          {/* grid-template-columns/rows 控制 */}
          {(showControls === "all" || showControls === "gridTemplate") && (
            <>
              <SelectControl
                label="grid-template-columns"
                value={gridTemplateColumns}
                options={gridTemplateColumnsOptions}
                onChange={(value) => setGridTemplateColumns(value)}
              />
              <SelectControl
                label="grid-template-rows"
                value={gridTemplateRows}
                options={gridTemplateRowsOptions}
                onChange={(value) => setGridTemplateRows(value)}
              />
            </>
          )}

          {/* gap 控制 */}
          {(showControls === "all" || showControls === "gap") && (
            <>
              <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
                <span className="block mb-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={useIndividualGaps}
                    onChange={(e) => setUseIndividualGaps(e.target.checked)}
                  />{" "}
                  分別設定 row-gap / column-gap
                </span>
              </div>
              {!useIndividualGaps ? (
                <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
                  <span className="block mb-2 text-sm font-medium">gap:</span>
                  <div className="flex gap-2 items-center [&_input]:flex-1 [&_input]:min-w-15 [&_input]:max-w-25 [&_select]:w-17.5 [&_select]:shrink-0">
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
              ) : (
                <>
                  <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
                    <span className="block mb-2 text-sm font-medium">row-gap:</span>
                    <div className="flex gap-2 items-center [&_input]:flex-1 [&_input]:min-w-15 [&_input]:max-w-25 [&_select]:w-17.5 [&_select]:shrink-0">
                      <input type="number" min="0" value={rowGap} onChange={(e) => setRowGap(Number(e.target.value))} />
                      <select value={gapUnit} onChange={(e) => setGapUnit(e.target.value as typeof gapUnit)}>
                        {gapUnitOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
                    <span className="block mb-2 text-sm font-medium">column-gap:</span>
                    <div className="flex gap-2 items-center [&_input]:flex-1 [&_input]:min-w-15 [&_input]:max-w-25 [&_select]:w-17.5 [&_select]:shrink-0">
                      <input
                        type="number"
                        min="0"
                        value={columnGap}
                        onChange={(e) => setColumnGap(Number(e.target.value))}
                      />
                      <select value={gapUnit} onChange={(e) => setGapUnit(e.target.value as typeof gapUnit)}>
                        {gapUnitOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* justify-items 控制 */}
          {(showControls === "all" || showControls === "justifyItems") && (
            <SelectControl
              label="justify-items"
              value={justifyItems}
              options={justifyItemsOptions}
              onChange={(value) => setJustifyItems(value as typeof justifyItems)}
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

          {/* justify-content 控制 */}
          {(showControls === "all" || showControls === "justifyContent") && (
            <SelectControl
              label="justify-content"
              value={justifyContent}
              options={justifyContentOptions}
              onChange={(value) => setJustifyContent(value as typeof justifyContent)}
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

          {/* 項目數量控制 (僅在完整模式顯示) */}
          {showControls === "all" && (
            <div className="flex flex-col gap-1 min-w-37.5 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input[type='text']]:p-[0.4rem] [&_input[type='text']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='text']]:rounded-lg [&_input[type='text']]:bg-(--ifm-background-color) [&_input[type='text']]:text-(--ifm-font-color-base) [&_input[type='text']]:text-[0.9rem] [&_input[type='number']]:p-[0.4rem] [&_input[type='number']]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input[type='number']]:rounded-lg [&_input[type='number']]:bg-(--ifm-background-color) [&_input[type='number']]:text-(--ifm-font-color-base) [&_input[type='number']]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
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
                  onClick={() => setCurrentItemCount(Math.min(20, currentItemCount + 1))}
                  disabled={currentItemCount >= 20}
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
          {`display: grid;
grid-template-columns: ${gridTemplateColumns};
grid-template-rows: ${gridTemplateRows};
${useIndividualGaps ? `row-gap: ${rowGapValue};\ncolumn-gap: ${columnGapValue};` : `gap: ${gapValue};`}
justify-items: ${justifyItems};
align-items: ${alignItems};
justify-content: ${justifyContent};
align-content: ${alignContent};`}
        </code>
      </div>

      {/* Grid 容器與項目 */}
      <div
        className="grid min-h-100 p-4 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)"
        style={{
          display: "grid",
          gridTemplateColumns,
          gridTemplateRows,
          ...(useIndividualGaps ? { rowGap: rowGapValue, columnGap: columnGapValue } : { gap: gapValue }),
          justifyItems,
          alignItems,
          justifyContent,
          alignContent,
        }}
      >
        {Array.from({ length: currentItemCount }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: 範例與骨架的固定編號不會重新排序，也不保存個別項目的狀態。
            key={i}
            className="flex items-center justify-center min-w-15 min-h-15 p-4 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] [font-weight:bold] text-[1.2rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)]"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
export default GridExample;
