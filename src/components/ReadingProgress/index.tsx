import { useLocation } from "@docusaurus/router";
import { useEffect, useState } from "react";

/** 監看 DOM 變化，處理 MDX 模組晚於 Root 掛載的路由。 */
export default function ReadingProgress() {
  const { pathname } = useLocation();
  const [reading, setReading] = useState({ visible: false, percent: 0, top: 0 });
  // biome-ignore lint/correctness/useExhaustiveDependencies: 每次路由切換都需要重新綁定文章的觀察目標。
  useEffect(() => {
    let frame = 0;
    let article: HTMLElement | null = null;
    let navbar: HTMLElement | null = null;
    function measure() {
      frame = 0;
      if (!article?.isConnected) return;
      const top = Math.max(0, navbar?.getBoundingClientRect().bottom ?? 0);
      const bounds = article.getBoundingClientRect();
      const distance = bounds.height - (window.innerHeight - top);
      const percent = distance > 0 ? Math.max(0, Math.min(100, ((top - bounds.top) / distance) * 100)) : 100;
      setReading({ visible: true, percent, top });
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    const resizeObserver = new ResizeObserver(schedule);
    function bindArticle() {
      const nextNavbar = document.querySelector<HTMLElement>(".navbar");
      if (nextNavbar !== navbar) {
        if (navbar) resizeObserver.unobserve(navbar);
        navbar = nextNavbar;
        if (navbar) resizeObserver.observe(navbar);
        schedule();
      }
      const next = document.querySelector<HTMLElement>("[data-reading-content], .theme-doc-markdown");
      if (article === next) return;
      if (article) resizeObserver.unobserve(article);
      article = next;
      setReading({ visible: Boolean(article), percent: 0, top: 0 });
      if (article) {
        resizeObserver.observe(article);
        measure();
      }
    }
    // 單次查詢可能早於非同步 MDX 掛載；監看子節點變化後重新綁定，
    // 捲動與視窗縮放則透過同一個 animation frame 合併更新。
    const mutationObserver = new MutationObserver(bindArticle);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    bindArticle();
    return () => {
      cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  if (!reading.visible) return null;
  // 維持在 Navbar 的堆疊層級下方，讓下拉選單與手機選單遮住進度條。
  return (
    <div
      role="progressbar"
      aria-label="閱讀進度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(reading.percent)}
      className="pointer-events-none fixed inset-x-0 z-[calc(var(--ifm-z-index-fixed)-1)] h-0.5 bg-brand/15"
      style={{ top: reading.top }}
    >
      <div
        className="h-full w-full origin-left bg-brand transition-transform duration-100 motion-reduce:transition-none"
        style={{ transform: `scaleX(${reading.percent / 100})` }}
      />
    </div>
  );
}
