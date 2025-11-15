import React, { useState } from "react";
import styles from "./BoxSizingComparison.module.css";

interface BoxSizingComparisonProps {
  title?: string;
  description?: string;
  showControls?: boolean;
}

const BoxSizingComparison: React.FC<BoxSizingComparisonProps> = ({
  title = "box-sizing 屬性比較",
  description = "比較 content-box 與 border-box 的差異",
  showControls = true,
}) => {
  const [width, setWidth] = useState(300);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(5);

  const contentBoxTotal = width + padding * 2 + border * 2;
  const contentBoxContentWidth = width;

  const borderBoxTotal = width;
  const borderBoxContentWidth = width - padding * 2 - border * 2;

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}

      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>
              Width: {width}px
              <input
                type="range"
                min="200"
                max="400"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </label>
          </div>
          <div className={styles.controlGroup}>
            <label>
              Padding: {padding}px
              <input
                type="range"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
              />
            </label>
          </div>
          <div className={styles.controlGroup}>
            <label>
              Border: {border}px
              <input
                type="range"
                min="0"
                max="20"
                value={border}
                onChange={(e) => setBorder(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}

      <div className={styles.comparison}>
        <div className={styles.boxWrapper}>
          <h4 className={styles.boxTitle}>content-box (預設)</h4>
          <div className={styles.codeBlock}>
            <code>
              width: {width}px;
              <br />
              padding: {padding}px;
              <br />
              border: {border}px;
              <br />
              box-sizing: content-box;
            </code>
          </div>
          <div className={styles.boxContainer}>
            <div
              className={styles.contentBox}
              style={{
                width: `${width}px`,
                padding: `${padding}px`,
                border: `${border}px solid #3b82f6`,
              }}
            >
              <div className={styles.boxContent}>
                Content Width: {contentBoxContentWidth}px
              </div>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Content 寬度:</span>
              <span className={styles.value}>{contentBoxContentWidth}px</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>實際總寬度:</span>
              <span className={styles.value}>{contentBoxTotal}px</span>
            </div>
            <div className={styles.calculation}>
              {width} + {padding * 2} + {border * 2} = {contentBoxTotal}px
            </div>
          </div>
        </div>

        <div className={styles.boxWrapper}>
          <h4 className={styles.boxTitle}>border-box</h4>
          <div className={styles.codeBlock}>
            <code>
              width: {width}px;
              <br />
              padding: {padding}px;
              <br />
              border: {border}px;
              <br />
              box-sizing: border-box;
            </code>
          </div>
          <div className={styles.boxContainer}>
            <div
              className={styles.borderBox}
              style={{
                width: `${width}px`,
                padding: `${padding}px`,
                border: `${border}px solid #10b981`,
                boxSizing: "border-box",
              }}
            >
              <div className={styles.boxContent}>
                Content Width: {borderBoxContentWidth}px
              </div>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Content 寬度:</span>
              <span className={styles.value}>{borderBoxContentWidth}px</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>實際總寬度:</span>
              <span className={styles.value}>{borderBoxTotal}px</span>
            </div>
            <div className={styles.calculation}>
              {width} - {padding * 2} - {border * 2} = {borderBoxContentWidth}
              px (content)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BoxSizingComparison;
