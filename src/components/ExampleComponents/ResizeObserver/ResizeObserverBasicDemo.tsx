import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ResizeObserverBasicDemo.module.css";

const ResizeObserverBasicDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    contentWidth: 0,
    contentHeight: 0,
    borderWidth: 0,
    borderHeight: 0,
  });
  const [resizeCount, setResizeCount] = useState(0);
  const [isObserving, setIsObserving] = useState(true);
  const observerRef = useRef<ResizeObserver | null>(null);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const contentBoxSize = entry.contentBoxSize[0];
      const borderBoxSize = entry.borderBoxSize[0];

      setDimensions({
        contentWidth: Math.round(contentBoxSize.inlineSize),
        contentHeight: Math.round(contentBoxSize.blockSize),
        borderWidth: Math.round(borderBoxSize.inlineSize),
        borderHeight: Math.round(borderBoxSize.blockSize),
      });
      setResizeCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    observerRef.current = new ResizeObserver(handleResize);

    if (isObserving) {
      observerRef.current.observe(box);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleResize, isObserving]);

  const toggleObserving = () => {
    if (!observerRef.current || !boxRef.current) return;

    if (isObserving) {
      observerRef.current.unobserve(boxRef.current);
    } else {
      observerRef.current.observe(boxRef.current);
    }
    setIsObserving(!isObserving);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>ResizeObserver 基本用法</h3>
        <p className={styles.description}>
          拖曳右下角調整盒子大小，觀察尺寸即時變化
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.demoArea}>
          <div ref={boxRef} className={styles.resizableBox}>
            <span className={styles.boxLabel}>Resize me!</span>
          </div>
        </div>

        <div className={styles.infoPanel}>
          <div className={styles.controls}>
            <button
              className={`${styles.toggleBtn} ${
                isObserving ? styles.active : ""
              }`}
              onClick={toggleObserving}
            >
              {isObserving ? "🔍 觀察中" : "⏸️ 已暫停"}
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Resize 次數</span>
              <span className={styles.statValue}>{resizeCount}</span>
            </div>
          </div>

          <div className={styles.dimensions}>
            <div className={styles.dimensionGroup}>
              <h4 className={styles.dimensionTitle}>contentBoxSize</h4>
              <div className={styles.dimensionItem}>
                <span>inlineSize (width):</span>
                <span className={styles.value}>
                  {dimensions.contentWidth}px
                </span>
              </div>
              <div className={styles.dimensionItem}>
                <span>blockSize (height):</span>
                <span className={styles.value}>
                  {dimensions.contentHeight}px
                </span>
              </div>
            </div>

            <div className={styles.dimensionGroup}>
              <h4 className={styles.dimensionTitle}>borderBoxSize</h4>
              <div className={styles.dimensionItem}>
                <span>inlineSize (width):</span>
                <span className={styles.value}>{dimensions.borderWidth}px</span>
              </div>
              <div className={styles.dimensionItem}>
                <span>blockSize (height):</span>
                <span className={styles.value}>
                  {dimensions.borderHeight}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizeObserverBasicDemo;
