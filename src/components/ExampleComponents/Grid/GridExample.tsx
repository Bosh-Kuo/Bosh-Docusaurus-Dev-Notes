import React, { useState } from "react";
import styles from "./GridExample.module.css";

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
  justifyContent?:
    | "start"
    | "end"
    | "center"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignContent?:
    | "start"
    | "end"
    | "center"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
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
  options: Array<{ value: string; label: string }>;
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
const SelectControl: React.FC<SelectControlProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <div className={styles.controlGroup}>
    <label>{label}:</label>
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
  const [gridTemplateColumns, setGridTemplateColumns] = useState(
    initialGridTemplateColumns
  );
  const [gridTemplateRows, setGridTemplateRows] = useState(
    initialGridTemplateRows
  );
  const [gap, setGap] = useState(initialGap);
  const [gapUnit, setGapUnit] = useState(initialGapUnit);
  const [rowGap, setRowGap] = useState(initialRowGap ?? initialGap);
  const [columnGap, setColumnGap] = useState(initialColumnGap ?? initialGap);
  const [useIndividualGaps, setUseIndividualGaps] = useState(
    initialRowGap !== undefined || initialColumnGap !== undefined
  );
  const [justifyItems, setJustifyItems] = useState(initialJustifyItems);
  const [alignItems, setAlignItems] = useState(initialAlignItems);
  const [justifyContent, setJustifyContent] = useState(initialJustifyContent);
  const [alignContent, setAlignContent] = useState(initialAlignContent);
  const [currentItemCount, setCurrentItemCount] = useState(itemCount);

  // 計算最終的 gap 值
  const gapValue = !useIndividualGaps ? `${gap}${gapUnit}` : undefined;
  const rowGapValue = useIndividualGaps ? `${rowGap}${gapUnit}` : undefined;
  const columnGapValue = useIndividualGaps
    ? `${columnGap}${gapUnit}`
    : undefined;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {/* 控制面板 */}
      {showControls && (
        <div className={styles.controls}>
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
              <div className={styles.controlGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={useIndividualGaps}
                    onChange={(e) => setUseIndividualGaps(e.target.checked)}
                  />
                  {" "}分別設定 row-gap / column-gap
                </label>
              </div>
              {!useIndividualGaps ? (
                <div className={styles.controlGroup}>
                  <label>gap:</label>
                  <div className={styles.gapControl}>
                    <input
                      type="number"
                      min="0"
                      value={gap}
                      onChange={(e) => setGap(Number(e.target.value))}
                    />
                    <select
                      value={gapUnit}
                      onChange={(e) => setGapUnit(e.target.value as any)}
                    >
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
                  <div className={styles.controlGroup}>
                    <label>row-gap:</label>
                    <div className={styles.gapControl}>
                      <input
                        type="number"
                        min="0"
                        value={rowGap}
                        onChange={(e) => setRowGap(Number(e.target.value))}
                      />
                      <select
                        value={gapUnit}
                        onChange={(e) => setGapUnit(e.target.value as any)}
                      >
                        {gapUnitOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.controlGroup}>
                    <label>column-gap:</label>
                    <div className={styles.gapControl}>
                      <input
                        type="number"
                        min="0"
                        value={columnGap}
                        onChange={(e) => setColumnGap(Number(e.target.value))}
                      />
                      <select
                        value={gapUnit}
                        onChange={(e) => setGapUnit(e.target.value as any)}
                      >
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
              onChange={(value) => setJustifyItems(value as any)}
            />
          )}

          {/* align-items 控制 */}
          {(showControls === "all" || showControls === "alignItems") && (
            <SelectControl
              label="align-items"
              value={alignItems}
              options={alignItemsOptions}
              onChange={(value) => setAlignItems(value as any)}
            />
          )}

          {/* justify-content 控制 */}
          {(showControls === "all" || showControls === "justifyContent") && (
            <SelectControl
              label="justify-content"
              value={justifyContent}
              options={justifyContentOptions}
              onChange={(value) => setJustifyContent(value as any)}
            />
          )}

          {/* align-content 控制 */}
          {(showControls === "all" || showControls === "alignContent") && (
            <SelectControl
              label="align-content"
              value={alignContent}
              options={alignContentOptions}
              onChange={(value) => setAlignContent(value as any)}
            />
          )}

          {/* 項目數量控制 (僅在完整模式顯示) */}
          {showControls === "all" && (
            <div className={styles.controlGroup}>
              <label>項目數量:</label>
              <div className={styles.itemCountControl}>
                <button
                  onClick={() =>
                    setCurrentItemCount(Math.max(1, currentItemCount - 1))
                  }
                  disabled={currentItemCount <= 1}
                >
                  -
                </button>
                <span>{currentItemCount}</span>
                <button
                  onClick={() =>
                    setCurrentItemCount(Math.min(20, currentItemCount + 1))
                  }
                  disabled={currentItemCount >= 20}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS 程式碼顯示區 */}
      <div className={styles.codeBlock}>
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
        className={styles.gridContainer}
        style={{
          display: "grid",
          gridTemplateColumns,
          gridTemplateRows,
          ...(useIndividualGaps
            ? { rowGap: rowGapValue, columnGap: columnGapValue }
            : { gap: gapValue }),
          justifyItems,
          alignItems,
          justifyContent,
          alignContent,
        }}
      >
        {Array.from({ length: currentItemCount }, (_, i) => (
          <div key={i} className={styles.gridItem}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridExample;
