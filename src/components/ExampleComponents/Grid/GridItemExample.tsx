import React, { useState } from "react";
import styles from "./GridItemExample.module.css";

interface GridItemExampleProps {
  title?: string;
  description?: string;
  showControls?: "gridColumn" | "gridRow" | "gridArea" | "justifySelf" | "alignSelf" | "all";
}

const justifySelfOptions = [
  { value: "auto", label: "auto" },
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];

const alignSelfOptions = [
  { value: "auto", label: "auto" },
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];

const gridColumnOptions = [
  { value: "1 / 2", label: "1 / 2" },
  { value: "1 / 3", label: "1 / 3" },
  { value: "1 / 4", label: "1 / 4" },
  { value: "2 / 3", label: "2 / 3" },
  { value: "2 / 4", label: "2 / 4" },
  { value: "3 / 4", label: "3 / 4" },
  { value: "1 / span 2", label: "1 / span 2" },
  { value: "2 / span 2", label: "2 / span 2" },
];

const gridRowOptions = [
  { value: "1 / 2", label: "1 / 2" },
  { value: "1 / 3", label: "1 / 3" },
  { value: "2 / 3", label: "2 / 3" },
  { value: "1 / span 2", label: "1 / span 2" },
  { value: "2 / span 2", label: "2 / span 2" },
];

function GridItemExample({
  title = "Grid Item 範例",
  description,
  showControls = "all",
}: GridItemExampleProps) {
  // Item 1 狀態
  const [gridColumn1, setGridColumn1] = useState("1 / 3");
  const [gridRow1, setGridRow1] = useState("1 / 2");
  const [justifySelf1, setJustifySelf1] = useState("stretch");
  const [alignSelf1, setAlignSelf1] = useState("stretch");

  // Item 2 狀態
  const [gridColumn2, setGridColumn2] = useState("3 / 4");
  const [gridRow2, setGridRow2] = useState("1 / 3");
  const [justifySelf2, setJustifySelf2] = useState("stretch");
  const [alignSelf2, setAlignSelf2] = useState("stretch");

  // Item 3 狀態
  const [gridColumn3, setGridColumn3] = useState("1 / 2");
  const [gridRow3, setGridRow3] = useState("2 / 3");
  const [justifySelf3, setJustifySelf3] = useState("stretch");
  const [alignSelf3, setAlignSelf3] = useState("stretch");

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {/* 控制面板 */}
      <div className={styles.controls}>
        {/* Item 1 控制 */}
        <div className={styles.itemControls}>
          <h4>Item 1</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className={styles.controlGroup}>
              <label>grid-column:</label>
              <select
                value={gridColumn1}
                onChange={(e) => setGridColumn1(e.target.value)}
              >
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className={styles.controlGroup}>
              <label>grid-row:</label>
              <select
                value={gridRow1}
                onChange={(e) => setGridRow1(e.target.value)}
              >
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className={styles.controlGroup}>
              <label>justify-self:</label>
              <select
                value={justifySelf1}
                onChange={(e) => setJustifySelf1(e.target.value)}
              >
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className={styles.controlGroup}>
              <label>align-self:</label>
              <select
                value={alignSelf1}
                onChange={(e) => setAlignSelf1(e.target.value)}
              >
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Item 2 控制 */}
        <div className={styles.itemControls}>
          <h4>Item 2</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className={styles.controlGroup}>
              <label>grid-column:</label>
              <select
                value={gridColumn2}
                onChange={(e) => setGridColumn2(e.target.value)}
              >
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className={styles.controlGroup}>
              <label>grid-row:</label>
              <select
                value={gridRow2}
                onChange={(e) => setGridRow2(e.target.value)}
              >
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className={styles.controlGroup}>
              <label>justify-self:</label>
              <select
                value={justifySelf2}
                onChange={(e) => setJustifySelf2(e.target.value)}
              >
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className={styles.controlGroup}>
              <label>align-self:</label>
              <select
                value={alignSelf2}
                onChange={(e) => setAlignSelf2(e.target.value)}
              >
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Item 3 控制 */}
        <div className={styles.itemControls}>
          <h4>Item 3</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className={styles.controlGroup}>
              <label>grid-column:</label>
              <select
                value={gridColumn3}
                onChange={(e) => setGridColumn3(e.target.value)}
              >
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className={styles.controlGroup}>
              <label>grid-row:</label>
              <select
                value={gridRow3}
                onChange={(e) => setGridRow3(e.target.value)}
              >
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className={styles.controlGroup}>
              <label>justify-self:</label>
              <select
                value={justifySelf3}
                onChange={(e) => setJustifySelf3(e.target.value)}
              >
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className={styles.controlGroup}>
              <label>align-self:</label>
              <select
                value={alignSelf3}
                onChange={(e) => setAlignSelf3(e.target.value)}
              >
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className={styles.codeBlock}>
        <code>
          {`/* Item 1 */
.item1 {
  grid-column: ${gridColumn1};
  grid-row: ${gridRow1};
  justify-self: ${justifySelf1};
  align-self: ${alignSelf1};
}

/* Item 2 */
.item2 {
  grid-column: ${gridColumn2};
  grid-row: ${gridRow2};
  justify-self: ${justifySelf2};
  align-self: ${alignSelf2};
}

/* Item 3 */
.item3 {
  grid-column: ${gridColumn3};
  grid-row: ${gridRow3};
  justify-self: ${justifySelf3};
  align-self: ${alignSelf3};
}`}
        </code>
      </div>

      {/* Grid 容器與項目 */}
      <div className={styles.gridContainer}>
        <div
          className={`${styles.gridItem} ${styles.item1}`}
          style={{
            gridColumn: gridColumn1,
            gridRow: gridRow1,
            justifySelf: justifySelf1 as any,
            alignSelf: alignSelf1 as any,
          }}
        >
          1
        </div>
        <div
          className={`${styles.gridItem} ${styles.item2}`}
          style={{
            gridColumn: gridColumn2,
            gridRow: gridRow2,
            justifySelf: justifySelf2 as any,
            alignSelf: alignSelf2 as any,
          }}
        >
          2
        </div>
        <div
          className={`${styles.gridItem} ${styles.item3}`}
          style={{
            gridColumn: gridColumn3,
            gridRow: gridRow3,
            justifySelf: justifySelf3 as any,
            alignSelf: alignSelf3 as any,
          }}
        >
          3
        </div>
      </div>
    </div>
  );
}

export default GridItemExample;
