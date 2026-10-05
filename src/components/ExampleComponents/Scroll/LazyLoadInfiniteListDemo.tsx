import React from "react";

type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  accent: string;
};
const palettes = [
  "linear-gradient(135deg, #1d4ed8, #a5b4fc)",
  "linear-gradient(135deg, #0f172a, #64748b)",
  "linear-gradient(135deg, #115e59, #34d399)",
  "linear-gradient(135deg, #92400e, #fcd34d)",
  "linear-gradient(135deg, #dc2626, #fb7185)",
  "linear-gradient(135deg, #6d28d9, #c084fc)",
];
const demoSentences = [
  "Intersection Observer 監聽滾動臨界點，自動載入下一批內容。",
  "滾動至底部時才 append 新節點，可避免一次渲染太多項目。",
  "視覺上以 skeleton 過渡，降低等待感。",
  "延遲載入圖片或資料 API，是常見的效能優化策略。",
  "也能搭配 scroll-padding，預留觸達 sentinel 的緩衝。",
];
const BATCH_SIZE = 6;
const MAX_BATCH = 4;
const createBatch = (batchIndex: number) =>
  Array.from({ length: BATCH_SIZE }).map((_, idx) => {
    const sentence = demoSentences[(batchIndex + idx) % demoSentences.length];
    const accent = palettes[(batchIndex + idx) % palettes.length];
    return {
      id: `${batchIndex}-${idx}-${Date.now()}`,
      title: `Card ${batchIndex * BATCH_SIZE + idx + 1}`,
      description: sentence,
      accent,
    } satisfies ShowcaseItem;
  });
const LazyLoadInfiniteListDemo: React.FC = () => {
  const [items, setItems] = React.useState(() => createBatch(0));
  const [batchIndex, setBatchIndex] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const loadMore = React.useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    window.setTimeout(() => {
      setItems((prev) => [...prev, ...createBatch(batchIndex)]);
      setBatchIndex((prev) => prev + 1);
      setHasMore(batchIndex + 1 <= MAX_BATCH);
      setIsLoading(false);
    }, 600);
  }, [batchIndex, hasMore, isLoading]);
  const resetList = () => {
    setItems(createBatch(0));
    setBatchIndex(1);
    setHasMore(true);
    setIsLoading(false);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  React.useEffect(() => {
    const root = listRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root,
        threshold: 0.6,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);
  return (
    <div className="[border:1px_solid_rgba(15,23,42,0.08)] rounded-[1.25rem] p-7 [background:linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-[#f8fafc] flex flex-col gap-4 [box-shadow:0_25px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="flex flex-wrap gap-6 items-start justify-between [@media(max-width:_640px)]:flex-col">
        <div>
          <p className="m-0 uppercase tracking-[0.2em] text-[0.75rem] text-[rgba(226,232,240,0.85)]">
            Lazy Loading / Infinite Scroll
          </p>
          <h3>Intersection Observer 與 scroll 邊界協作</h3>
          <p>滑至列表底部或點按按鈕，觀察觀測點觸發追加批次的過程。</p>
        </div>
        <button
          className="rounded-[999px] [border:1px_solid_rgba(248,250,252,0.3)] [background:rgba(15,23,42,0.4)] text-white p-[0.6rem_1.4rem] font-semibold cursor-pointer [transition:background_0.2s_ease,border-color_0.2s_ease] [&:hover]:[background:rgba(30,64,175,0.7)] [&:hover]:border-[rgba(191,219,254,0.7)]"
          type="button"
          onClick={resetList}
        >
          重新整理資料
        </button>
      </div>

      <div className="flex gap-6 flex-wrap [&_span]:block [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[0.7rem] [&_span]:text-[rgba(248,250,252,0.75)] [&_strong]:text-[1.1rem]">
        <div className="rounded-[0.85rem] [background:rgba(15,23,42,0.5)] [border:1px_solid_rgba(148,163,184,0.3)] p-[0.8rem_1.1rem] min-w-30">
          <span>已載入卡片</span>
          <strong>{items.length}</strong>
        </div>
        <div className="rounded-[0.85rem] [background:rgba(15,23,42,0.5)] [border:1px_solid_rgba(148,163,184,0.3)] p-[0.8rem_1.1rem] min-w-30">
          <span>觸發批次</span>
          <strong>{batchIndex}</strong>
        </div>
        <div className="rounded-[0.85rem] [background:rgba(15,23,42,0.5)] [border:1px_solid_rgba(148,163,184,0.3)] p-[0.8rem_1.1rem] min-w-30">
          <span>是否仍可載入</span>
          <strong>{hasMore ? "Yes" : "已達上限"}</strong>
        </div>
      </div>

      <div
        ref={listRef}
        className="rounded-2xl [border:1px_solid_rgba(148,163,184,0.3)] [background:rgba(15,23,42,0.7)] max-h-90 overflow-auto p-4 flex flex-col gap-[0.9rem]"
        role="feed"
        aria-live="polite"
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            className="grid grid-cols-[56px_1fr] gap-4 rounded-2xl p-[0.9rem_1rem] [background:rgba(15,23,42,0.8)] [border:1px_solid_rgba(148,163,184,0.2)] [box-shadow:0_20px_45px_-35px_rgba(15,23,42,0.9)] [&_h4]:m-[0_0_0.3rem] [&_p]:m-0 [&_p]:text-[rgba(248,250,252,0.8)] [@media(max-width:_640px)]:grid-cols-[1fr]"
            aria-posinset={index + 1}
            aria-setsize={hasMore ? -1 : items.length}
          >
            <div className="rounded-[0.8rem]" style={{ backgroundImage: item.accent }} />
            <div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
        <div
          ref={sentinelRef}
          className="rounded-2xl p-4 text-center [background:rgba(30,64,175,0.25)] [border:1px_dashed_rgba(191,219,254,0.5)] grid gap-[0.6rem] [&_button]:rounded-[999px] [&_button]:[border:1px_solid_rgba(191,219,254,0.7)] [&_button]:[background:transparent] [&_button]:text-[#e0f2fe] [&_button]:p-[0.4rem_1.4rem] [&_button]:cursor-pointer"
          aria-hidden="true"
        >
          {isLoading ? (
            <div className="inline-flex gap-[0.6rem] items-center justify-center">
              <span
                className="w-4 h-4 rounded-[999px] [border:2px_solid_rgba(191,219,254,0.25)] border-t-[#93c5fd] animate-[ui-components-examplecomponents-scroll-lazyloadinfinitelistdemo-spin_0.8s_linear_infinite]"
                aria-hidden
              />
              <span>載入中...</span>
            </div>
          ) : hasMore ? (
            <>
              <p>滑到這裡觀察者就會觸發下一批資料。</p>
              <button type="button" onClick={loadMore}>
                手動載入
              </button>
            </>
          ) : (
            <p>已經沒有更多資料，Intersection Observer 停止監聽。</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default LazyLoadInfiniteListDemo;
