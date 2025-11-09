import React, { useState } from "react";
import styles from "./FlexboxExample.module.css";

// Props 介面定義
interface FlexboxExampleProps {
  title?: string;
  description?: string;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  alignContent?:
    | "stretch"
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
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
  options: Array<{ value: string; label: string }>;
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
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {/* 控制面板 */}
      {showControls && (
        <div className={styles.controls}>
          {/* flex-direction 控制 */}
          {(showControls === "all" || showControls === "flexDirection") && (
            <SelectControl
              label="flex-direction"
              value={flexDirection}
              options={flexDirectionOptions}
              onChange={(value) => setFlexDirection(value as any)}
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

          {/* align-items 控制 */}
          {(showControls === "all" || showControls === "alignItems") && (
            <SelectControl
              label="align-items"
              value={alignItems}
              options={alignItemsOptions}
              onChange={(value) => setAlignItems(value as any)}
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

          {/* flex-wrap 控制 */}
          {(showControls === "all" || showControls === "flexWrap") && (
            <SelectControl
              label="flex-wrap"
              value={flexWrap}
              options={flexWrapOptions}
              onChange={(value) => setFlexWrap(value as any)}
            />
          )}

          {/* gap 控制 (數值 + 單位) */}
          {(showControls === "all" || showControls === "gap") && (
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
                    setCurrentItemCount(Math.min(15, currentItemCount + 1))
                  }
                  disabled={currentItemCount >= 15}
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
        className={styles.flexContainer}
        style={{
          display: 'flex',
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
          <div key={i} className={styles.flexItem}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlexboxExample;
