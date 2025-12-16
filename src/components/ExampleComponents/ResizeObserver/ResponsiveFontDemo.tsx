import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ResponsiveFontDemo.module.css";

const ResponsiveFontDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [fontSize, setFontSize] = useState(16);
  const [sliderWidth, setSliderWidth] = useState(400);

  const calculateFontSize = useCallback((width: number) => {
    // Font size scales between 12px and 32px based on container width
    const minWidth = 200;
    const maxWidth = 600;
    const minFont = 12;
    const maxFont = 32;

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth);
    return Math.round(minFont + ratio * (maxFont - minFont));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentBoxSize[0].inlineSize;
        setContainerWidth(Math.round(width));
        setFontSize(calculateFontSize(width));
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [calculateFontSize]);

  // Update container width when slider changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${sliderWidth}px`;
    }
  }, [sliderWidth]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>實際應用：響應式字體</h3>
        <p className={styles.description}>
          使用 ResizeObserver 根據容器寬度動態調整字體大小
        </p>
      </div>

      <div className={styles.slider}>
        <label className={styles.sliderLabel}>
          容器寬度: {sliderWidth}px
          <input
            type='range'
            min='200'
            max='600'
            value={sliderWidth}
            onChange={(e) => setSliderWidth(Number(e.target.value))}
            className={styles.sliderInput}
          />
        </label>
      </div>

      <div className={styles.demoWrapper}>
        <div
          ref={containerRef}
          className={styles.textContainer}
          style={{ width: sliderWidth }}
        >
          <p
            className={styles.dynamicText}
            style={{ fontSize: `${fontSize}px` }}
          >
            這段文字的大小會隨著容器寬度自動調整！
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>容器寬度</span>
          <span className={styles.statValue}>{containerWidth}px</span>
        </div>
        <div className={styles.statArrow}>→</div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>字體大小</span>
          <span className={styles.statValue}>{fontSize}px</span>
        </div>
      </div>

      <div className={styles.codeHint}>
        <code>fontSize = map(containerWidth, [200, 600], [12, 32])</code>
      </div>
    </div>
  );
};

export default ResponsiveFontDemo;
