import React, { useState } from "react";
import styles from "./BoxModelVisualization.module.css";

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
  const totalHeight = contentSize + padding * 2 + border * 2;
  const totalWithMargin = totalWidth + margin * 2;

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}

      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>
              Content: {contentSize}px
              <input
                type="range"
                min="100"
                max="300"
                value={contentSize}
                onChange={(e) => setContentSize(Number(e.target.value))}
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
          <div className={styles.controlGroup}>
            <label>
              Margin: {margin}px
              <input
                type="range"
                min="0"
                max="50"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}

      <div className={styles.visualization}>
        <div className={styles.dimensions}>
          <div className={styles.dimensionLabel}>
            <div className={styles.dimensionTitle}>總寬度 (含 margin): {totalWithMargin}px</div>
            <div className={styles.dimensionFormula}>
              = Content ({contentSize}px) + Padding ({padding * 2}px) + Border ({border * 2}px) + Margin ({margin * 2}px)
            </div>
          </div>
          <div className={styles.dimensionLabel}>
            <div className={styles.dimensionTitle}>盒子寬度: {totalWidth}px</div>
            <div className={styles.dimensionFormula}>
              = Content ({contentSize}px) + Padding ({padding * 2}px) + Border ({border * 2}px)
            </div>
          </div>
        </div>

        <div
          className={styles.marginBox}
          style={{
            padding: `${margin}px`,
          }}
        >
          <div className={styles.marginLabel}>Margin: {margin}px</div>
          <div
            className={styles.borderBox}
            style={{
              border: `${border}px solid #f59e0b`,
            }}
          >
            {border > 0 && <div className={styles.borderLabel}>Border: {border}px</div>}
            <div
              className={styles.paddingBox}
              style={{
                padding: `${padding}px`,
              }}
            >
              <div className={styles.paddingLabel}>Padding: {padding}px</div>
              <div
                className={styles.contentBox}
                style={{
                  width: `${contentSize}px`,
                  height: `${contentSize}px`,
                }}
              >
                <div className={styles.contentLabel}>
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
