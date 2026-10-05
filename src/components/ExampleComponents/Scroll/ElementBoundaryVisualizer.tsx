import { cn } from "cn";
import React from "react";

const scenarios = [
  {
    id: "balanced",
    label: "固定高度",
    description: "client 與 scroll 尺寸接近，滾動距離有限。",
    className:
      "[--boundary-border:rgba(15,23,42,0.12)] border-[rgba(59,130,246,0.35)] overflow-hidden [&_.ui-components-examplecomponents-scroll-elementboundaryvisualizer-contentLayer]:min-h-50",
  },
  {
    id: "overflow",
    label: "內容溢出",
    description: "scrollHeight 大於 clientHeight，scrollTop 明顯變化。",
    className:
      "[--boundary-border:rgba(15,23,42,0.12)] border-[rgba(248,113,113,0.4)] max-h-65 [&_.ui-components-examplecomponents-scroll-elementboundaryvisualizer-contentLayer]:min-h-110 [&_.ui-components-examplecomponents-scroll-elementboundaryvisualizer-contentLayer]:[background:linear-gradient(180deg,#fff_0%,#fde68a_100%)]",
  },
  {
    id: "nested",
    label: "多層邊框",
    description: "厚 padding/border 讓 offset 大於 client。",
    className:
      "[--boundary-border:rgba(15,23,42,0.12)] border-[rgba(16,185,129,0.4)] [box-shadow:inset_0_0_0_2px_rgba(16,185,129,0.3)] [border-width:4px] p-[1rem_1.5rem] [&_.ui-components-examplecomponents-scroll-elementboundaryvisualizer-borderLayer]:[border-width:12px] [&_.ui-components-examplecomponents-scroll-elementboundaryvisualizer-borderLayer]:border-[rgba(16,185,129,0.35)]",
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
const scenarioCopy: Record<
  ScenarioId,
  {
    title: string;
    highlight: string;
  }
> = {
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
  const [activeScenario, setActiveScenario] = React.useState<ScenarioId>(scenarios[0].id);
  const [metrics, setMetrics] = React.useState<Metrics>(initialMetrics);
  const scrollBoxRef = React.useRef<HTMLElement | null>(null);
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: 情境切換會改變 DOM 尺寸，量測前必須重設捲動位置。
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
  const activeConfig = scenarios.find((scenario) => scenario.id === activeScenario) ?? scenarios[0];
  const activeCopy = scenarioCopy[activeScenario];
  return (
    <div className="[--boundary-border:rgba(15,23,42,0.12)] [border:1px_solid_var(--boundary-border)] rounded-[1.25rem] p-7 [background:linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] [box-shadow:0_20px_60px_-40px_rgba(15,23,42,0.8)] flex flex-col gap-6">
      <h3 className="[--boundary-border:rgba(15,23,42,0.12)] mb-1">元素與邊界關係觀察器</h3>

      <div className="[--boundary-border:rgba(15,23,42,0.12)] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 [&_button]:rounded-2xl [&_button]:[border:1px_solid_var(--boundary-border)] [&_button]:[background:rgba(15,23,42,0.02)] [&_button]:p-[0.75rem_1rem] [&_button]:flex [&_button]:flex-col [&_button]:gap-[0.35rem] [&_button]:text-left [&_button]:cursor-pointer [&_button]:[transition:border-color_0.2s_ease,background_0.2s_ease,box-shadow_0.2s_ease] [&_button_strong]:text-[0.95rem] [&_button_span]:text-[0.85rem] [&_button_span]:text-(--ifm-color-emphasis-700)">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setActiveScenario(scenario.id)}
            className={
              scenario.id === activeScenario
                ? "[--boundary-border:rgba(15,23,42,0.12)] border-[rgba(79,70,229,0.4)] [background:rgba(79,70,229,0.1)] [box-shadow:0_0_0_1.5px_rgba(79,70,229,0.2)]"
                : undefined
            }
          >
            <strong>{scenario.label}</strong>
            <span>{scenario.description}</span>
          </button>
        ))}
      </div>

      <div className="[--boundary-border:rgba(15,23,42,0.12)] grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6 items-start [@media(max-width:_960px)]:grid-cols-[1fr]">
        <div className="[--boundary-border:rgba(15,23,42,0.12)] flex flex-col gap-2">
          <section
            ref={scrollBoxRef}
            className={cn(
              "[--boundary-border:rgba(15,23,42,0.12)] rounded-[1.25rem] [border:2px_dashed_rgba(79,70,229,0.25)] p-0 min-h-65 max-h-90 overflow-auto [background:#fff] relative scroll-smooth",
              activeConfig.className,
            )}
            aria-label="可捲動的元素尺寸示範"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 鍵盤使用者需要能聚焦這個可捲動的範例。
            tabIndex={0}
          >
            <div className="ui-components-examplecomponents-scroll-elementboundaryvisualizer-borderLayer [--boundary-border:rgba(15,23,42,0.12)] [border:6px_solid_rgba(15,23,42,0.4)] rounded-2xl m-4">
              <div className="[--boundary-border:rgba(15,23,42,0.12)] rounded-[0.75rem] [background:rgba(59,130,246,0.08)] p-[1.1rem]">
                <div className="ui-components-examplecomponents-scroll-elementboundaryvisualizer-contentLayer [--boundary-border:rgba(15,23,42,0.12)] rounded-[0.75rem] [background:#fff] p-5 [box-shadow:inset_0_0_0_1px_rgba(15,23,42,0.05)] flex flex-col gap-[0.6rem] [&_h4]:m-0">
                  <p className="[--boundary-border:rgba(15,23,42,0.12)] uppercase text-[0.75rem] tracking-[0.12em] text-[rgba(15,23,42,0.5)] m-0">
                    Scenario
                  </p>
                  <h4>{activeCopy.title}</h4>
                  <p className="[--boundary-border:rgba(15,23,42,0.12)] m-0 text-(--ifm-color-emphasis-800) font-medium">
                    {activeCopy.highlight}
                  </p>
                  <div className="[--boundary-border:rgba(15,23,42,0.12)] flex gap-[0.4rem] flex-wrap [&_span]:text-[0.75rem] [&_span]:font-semibold [&_span]:rounded-[999px] [&_span]:p-[0.2rem_0.9rem] [&_span]:[background:rgba(15,23,42,0.08)] [&_span]:uppercase [&_span]:tracking-widest">
                    <span>client</span>
                    <span>scroll</span>
                    <span>offset</span>
                  </div>
                  <div className="[--boundary-border:rgba(15,23,42,0.12)] grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 [&_div]:rounded-[0.65rem] [&_div]:[border:1px_solid_rgba(15,23,42,0.12)] [&_div]:p-[0.6rem_0.75rem] [&_div]:[background:rgba(59,130,246,0.08)] [&_span]:block [&_span]:text-[0.7rem] [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[rgba(15,23,42,0.6)] [&_strong]:text-[0.95rem] [&_strong]:text-(--ifm-color-emphasis-800)">
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
            <div className="[--boundary-border:rgba(15,23,42,0.12)] sticky bottom-0 [background:rgba(15,23,42,0.85)] text-white p-[0.4rem_0.8rem] text-[0.8rem] inline-flex rounded-[0.6rem] m-2">
              scrollTop: {metrics.scrollTop}px · scrollLeft: {metrics.scrollLeft}px
            </div>
          </section>
        </div>

        <div className="[--boundary-border:rgba(15,23,42,0.12)] rounded-2xl [border:1px_solid_var(--boundary-border)] [background:#fff] p-5 flex flex-col gap-4 [&_>_div]:[border-bottom:1px_solid_rgba(15,23,42,0.08)] [&_>_div]:pb-4 [&_>_div:last-child]:[border-bottom:none] [&_>_div:last-child]:pb-0 [&_span]:text-[0.85rem] [&_span]:text-(--ifm-color-emphasis-600)">
          <div>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-0 uppercase tracking-[0.12em] text-[0.75rem] text-[rgba(15,23,42,0.6)]">
              client 尺寸
            </p>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-[0.25rem_0_0.35rem] text-[1.25rem] font-semibold">
              {metrics.clientWidth}px × {metrics.clientHeight}px
            </p>
            <span>可視內容區域，不包含 border 以及捲動條寬度。</span>
          </div>
          <div>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-0 uppercase tracking-[0.12em] text-[0.75rem] text-[rgba(15,23,42,0.6)]">
              scroll 尺寸
            </p>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-[0.25rem_0_0.35rem] text-[1.25rem] font-semibold">
              {metrics.scrollWidth}px × {metrics.scrollHeight}px
            </p>
            <span>實際內容長度，超出視窗仍會被計算。</span>
          </div>
          <div>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-0 uppercase tracking-[0.12em] text-[0.75rem] text-[rgba(15,23,42,0.6)]">
              offset 尺寸
            </p>
            <p className="[--boundary-border:rgba(15,23,42,0.12)] m-[0.25rem_0_0.35rem] text-[1.25rem] font-semibold">
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
