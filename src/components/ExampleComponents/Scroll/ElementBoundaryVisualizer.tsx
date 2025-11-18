import React from "react";
import styles from "./ElementBoundaryVisualizer.module.css";

const scenarios = [
  {
    id: "balanced",
    label: "固定高度",
    description: "client 與 scroll 尺寸接近，滾動距離有限。",
    className: "scenarioBalanced",
  },
  {
    id: "overflow",
    label: "內容溢出",
    description: "scrollHeight 大於 clientHeight，scrollTop 明顯變化。",
    className: "scenarioOverflow",
  },
  {
    id: "nested",
    label: "多層邊框",
    description: "厚 padding/border 讓 offset 大於 client。",
    className: "scenarioNested",
  },
] as const;

type ScenarioId = (typeof scenarios)[number]["id"];

type Metrics = {
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  offsetWidth: number;
  offsetHeight: number;
  scrollTop: number;
  scrollLeft: number;
};

const initialMetrics: Metrics = {
  clientWidth: 0,
  clientHeight: 0,
  scrollWidth: 0,
  scrollHeight: 0,
  offsetWidth: 0,
  offsetHeight: 0,
  scrollTop: 0,
  scrollLeft: 0,
};

const scenarioCopy: Record<ScenarioId, { title: string; highlight: string }> = {
  balanced: {
    title: "視口剛好包住內容",
    highlight: "client 與 scroll 尺寸接近，觀察邊界起點。",
  },
  overflow: {
    title: "內容超出需要滾動",
    highlight: "scrollHeight 遠大於 clientHeight，scrollTop 會快速增加。",
  },
  nested: {
    title: "多層邊界堆疊",
    highlight: "厚 padding/border 讓 offset 尺寸高於 client。",
  },
};

const ElementBoundaryVisualizer: React.FC = () => {
  const [activeScenario, setActiveScenario] = React.useState<ScenarioId>(
    scenarios[0].id
  );
  const [metrics, setMetrics] = React.useState<Metrics>(initialMetrics);
  const scrollBoxRef = React.useRef<HTMLDivElement | null>(null);

  const updateMeasurements = React.useCallback(() => {
    const node = scrollBoxRef.current;
    if (!node) return;

    setMetrics({
      clientWidth: Math.round(node.clientWidth),
      clientHeight: Math.round(node.clientHeight),
      scrollWidth: Math.round(node.scrollWidth),
      scrollHeight: Math.round(node.scrollHeight),
      offsetWidth: Math.round(node.offsetWidth),
      offsetHeight: Math.round(node.offsetHeight),
      scrollTop: Math.round(node.scrollTop),
      scrollLeft: Math.round(node.scrollLeft),
    });
  }, []);

  React.useEffect(() => {
    const node = scrollBoxRef.current;
    if (!node) return undefined;

    node.scrollTo({ top: 0, left: 0 });
    updateMeasurements();

    node.addEventListener("scroll", updateMeasurements, { passive: true });
    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(node);

    return () => {
      node.removeEventListener("scroll", updateMeasurements);
      resizeObserver.disconnect();
    };
  }, [updateMeasurements, activeScenario]);

  const activeConfig =
    scenarios.find((scenario) => scenario.id === activeScenario) ??
    scenarios[0];
  const activeCopy = scenarioCopy[activeScenario];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.titleHeading}>元素與邊界關係觀察器</h3>

      <div className={styles.scenarioToggle}>
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setActiveScenario(scenario.id)}
            className={
              scenario.id === activeScenario ? styles.activeToggle : undefined
            }
          >
            <strong>{scenario.label}</strong>
            <span>{scenario.description}</span>
          </button>
        ))}
      </div>

      <div className={styles.playground}>
        <div className={styles.previewArea}>
          <div
            ref={scrollBoxRef}
            className={`${styles.measureBox} ${styles[activeConfig.className]}`}
            tabIndex={0}
          >
            <div className={styles.borderLayer}>
              <div className={styles.paddingLayer}>
                <div className={styles.contentLayer}>
                  <p className={styles.kicker}>Scenario</p>
                  <h4>{activeCopy.title}</h4>
                  <p className={styles.bodyText}>{activeCopy.highlight}</p>
                  <div className={styles.tagCloud}>
                    <span>client</span>
                    <span>scroll</span>
                    <span>offset</span>
                  </div>
                  <div className={styles.metricTokens}>
                    <div>
                      <span>scrollTop</span>
                      <strong>{metrics.scrollTop}px</strong>
                    </div>
                    <div>
                      <span>clientWidth</span>
                      <strong>{metrics.clientWidth}px</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.scrollHint}>
              scrollTop: {metrics.scrollTop}px · scrollLeft:{" "}
              {metrics.scrollLeft}px
            </div>
          </div>
        </div>

        <div className={styles.metricPanel}>
          <div>
            <p className={styles.metricLabel}>client 尺寸</p>
            <p className={styles.metricValue}>
              {metrics.clientWidth}px × {metrics.clientHeight}px
            </p>
            <span>可視內容區域，不包含 border 以及捲動條寬度。</span>
          </div>
          <div>
            <p className={styles.metricLabel}>scroll 尺寸</p>
            <p className={styles.metricValue}>
              {metrics.scrollWidth}px × {metrics.scrollHeight}px
            </p>
            <span>實際內容長度，超出視窗仍會被計算。</span>
          </div>
          <div>
            <p className={styles.metricLabel}>offset 尺寸</p>
            <p className={styles.metricValue}>
              {metrics.offsetWidth}px × {metrics.offsetHeight}px
            </p>
            <span>包含 border / scrollbar。</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementBoundaryVisualizer;
