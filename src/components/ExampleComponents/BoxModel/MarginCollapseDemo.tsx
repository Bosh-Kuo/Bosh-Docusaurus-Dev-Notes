import React, { useState } from "react";
import styles from "./MarginCollapseDemo.module.css";

interface MarginCollapseDemoProps {
  title?: string;
  description?: string;
}

const MarginCollapseDemo: React.FC<MarginCollapseDemoProps> = ({
  title = "Margin Collapse (外距折疊) 示範",
  description = "觀察垂直方向上相鄰元素的 margin 如何折疊",
}) => {
  const [topMargin, setTopMargin] = useState(30);
  const [bottomMargin, setBottomMargin] = useState(20);
  const [useFloat, setUseFloat] = useState(false);
  const [useFlexbox, setUseFlexbox] = useState(false);

  const collapsedMargin = Math.max(topMargin, bottomMargin);

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>
            上方元素 margin-bottom: {topMargin}px
            <input
              type="range"
              min="0"
              max="60"
              value={topMargin}
              onChange={(e) => setTopMargin(Number(e.target.value))}
            />
          </label>
        </div>
        <div className={styles.controlGroup}>
          <label>
            下方元素 margin-top: {bottomMargin}px
            <input
              type="range"
              min="0"
              max="60"
              value={bottomMargin}
              onChange={(e) => setBottomMargin(Number(e.target.value))}
            />
          </label>
        </div>
        <div className={styles.toggleGroup}>
          <label>
            <input
              type="checkbox"
              checked={useFloat}
              onChange={(e) => {
                setUseFloat(e.target.checked);
                if (e.target.checked) setUseFlexbox(false);
              }}
            />
            使用 float (阻止折疊)
          </label>
          <label>
            <input
              type="checkbox"
              checked={useFlexbox}
              onChange={(e) => {
                setUseFlexbox(e.target.checked);
                if (e.target.checked) setUseFloat(false);
              }}
            />
            使用 Flexbox (阻止折疊)
          </label>
        </div>
      </div>

      <div className={styles.demoSection}>
        <h4 className={styles.sectionTitle}>視覺化示範</h4>
        <div
          className={styles.demoContainer}
          style={{
            display: useFlexbox ? "flex" : "block",
            flexDirection: useFlexbox ? "column" : undefined,
          }}
        >
          <div
            className={styles.box}
            style={{
              marginBottom: `${topMargin}px`,
              float: useFloat ? "left" : "none",
              width: useFloat ? "100%" : "auto",
            }}
          >
            <div className={styles.boxLabel}>上方元素</div>
            <div className={styles.boxInfo}>margin-bottom: {topMargin}px</div>
          </div>
          <div
            className={styles.box}
            style={{
              marginTop: `${bottomMargin}px`,
              float: useFloat ? "left" : "none",
              width: useFloat ? "100%" : "auto",
            }}
          >
            <div className={styles.boxLabel}>下方元素</div>
            <div className={styles.boxInfo}>margin-top: {bottomMargin}px</div>
          </div>
          {useFloat && <div style={{ clear: "both" }}></div>}
        </div>
      </div>

      <div className={styles.explanation}>
        <h4>實際間距:</h4>
        {!useFloat && !useFlexbox ? (
          <div className={styles.result}>
            <div className={styles.resultLabel}>發生 Margin Collapse</div>
            <div className={styles.resultValue}>
              間距 = max({topMargin}px, {bottomMargin}px) ={" "}
              <strong>{collapsedMargin}px</strong>
            </div>
            <div className={styles.resultNote}>
              兩個 margin 會折疊,取較大值作為實際間距
            </div>
          </div>
        ) : (
          <div className={styles.result}>
            <div className={styles.resultLabel}>未發生 Margin Collapse</div>
            <div className={styles.resultValue}>
              間距 = {topMargin}px + {bottomMargin}px ={" "}
              <strong>{topMargin + bottomMargin}px</strong>
            </div>
            <div className={styles.resultNote}>
              {useFloat && "使用 float 會建立 BFC,阻止 margin collapse"}
              {useFlexbox && "Flexbox 容器內的子元素不會發生 margin collapse"}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MarginCollapseDemo;
