import React from "react";
import styles from "./LazyLoadInfiniteListDemo.module.css";

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
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headingBar}>
        <div>
          <p className={styles.kicker}>Lazy Loading / Infinite Scroll</p>
          <h3>Intersection Observer 與 scroll 邊界協作</h3>
          <p>滑至列表底部或點按按鈕，觀察觀測點觸發追加批次的過程。</p>
        </div>
        <button className={styles.refreshButton} type="button" onClick={resetList}>
          重新整理資料
        </button>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span>已載入卡片</span>
          <strong>{items.length}</strong>
        </div>
        <div className={styles.metaItem}>
          <span>觸發批次</span>
          <strong>{batchIndex}</strong>
        </div>
        <div className={styles.metaItem}>
          <span>是否仍可載入</span>
          <strong>{hasMore ? "Yes" : "已達上限"}</strong>
        </div>
      </div>

      <div ref={listRef} className={styles.list} role="feed" aria-live="polite">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={styles.card}
            aria-posinset={index + 1}
            aria-setsize={hasMore ? -1 : items.length}
          >
            <div
              className={styles.accent}
              style={{ backgroundImage: item.accent }}
            />
            <div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true">
          {isLoading ? (
            <div className={styles.loadingRow}>
              <span className={styles.spinner} aria-hidden />
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
