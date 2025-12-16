import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ResizeObserverBoxOptions.module.css";

type BoxOption = "content-box" | "border-box";

const ResizeObserverBoxOptions: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<BoxOption>("content-box");
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(8);
  const [dimensions, setDimensions] = useState({
    inlineSize: 0,
    blockSize: 0,
  });

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const boxSize =
          selectedBox === "content-box"
            ? entry.contentBoxSize[0]
            : entry.borderBoxSize[0];

        setDimensions({
          inlineSize: Math.round(boxSize.inlineSize),
          blockSize: Math.round(boxSize.blockSize),
        });
      }
    },
    [selectedBox]
  );

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(box, { box: selectedBox });

    return () => observer.disconnect();
  }, [handleResize, selectedBox]);

  // Trigger resize recalculation when padding/border changes
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Force a resize event by briefly modifying the element
    const originalWidth = box.style.width;
    box.style.width = `${parseInt(originalWidth || "200") + 0.1}px`;
    requestAnimationFrame(() => {
      box.style.width = originalWidth;
    });
  }, [padding, border, selectedBox]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Box 選項比較</h3>
        <p className={styles.description}>
          切換不同的 box 選項，觀察回報尺寸的差異
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlRow}>
          <div className={styles.boxSelector}>
            <button
              className={`${styles.optionBtn} ${
                selectedBox === "content-box" ? styles.active : ""
              }`}
              onClick={() => setSelectedBox("content-box")}
            >
              content-box
            </button>
            <button
              className={`${styles.optionBtn} ${
                selectedBox === "border-box" ? styles.active : ""
              }`}
              onClick={() => setSelectedBox("border-box")}
            >
              border-box
            </button>
          </div>
        </div>

        <div className={styles.sliderRow}>
          <label className={styles.sliderLabel}>
            Padding: {padding}px
            <input
              type='range'
              min='0'
              max='40'
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className={styles.slider}
            />
          </label>
          <label className={styles.sliderLabel}>
            Border: {border}px
            <input
              type='range'
              min='0'
              max='20'
              value={border}
              onChange={(e) => setBorder(Number(e.target.value))}
              className={styles.slider}
            />
          </label>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.demoArea}>
          <div
            ref={boxRef}
            className={styles.resizableBox}
            style={{
              padding: `${padding}px`,
              borderWidth: `${border}px`,
            }}
          >
            <div className={styles.innerContent}>Content</div>
          </div>
        </div>

        <div className={styles.infoPanel}>
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <span className={styles.observeIcon}>📐</span>
              <span className={styles.boxType}>{selectedBox}</span>
            </div>
            <div className={styles.resultValues}>
              <div className={styles.valueItem}>
                <span className={styles.valueLabel}>inlineSize</span>
                <span className={styles.valueNum}>
                  {dimensions.inlineSize}px
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.valueLabel}>blockSize</span>
                <span className={styles.valueNum}>
                  {dimensions.blockSize}px
                </span>
              </div>
            </div>
          </div>

          <div className={styles.explanation}>
            {selectedBox === "content-box" ? (
              <p>
                <strong>content-box</strong>（預設值）：只計算內容區域的尺寸，
                不包含 padding 和 border。
              </p>
            ) : (
              <p>
                <strong>border-box</strong>：計算包含 padding 和 border
                在內的完整尺寸。 尺寸 = content + padding × 2 + border × 2
              </p>
            )}
          </div>

          <div className={styles.formula}>
            {selectedBox === "border-box" && (
              <code>
                {dimensions.inlineSize} = content + {padding * 2} + {border * 2}
              </code>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizeObserverBoxOptions;
