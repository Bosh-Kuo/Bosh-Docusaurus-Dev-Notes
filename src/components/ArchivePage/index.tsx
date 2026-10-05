import Link from "@docusaurus/Link";
import PageSurface from "@site/src/components/PageSurface";
import { Input } from "@site/src/components/ui/input";
import { formatDate } from "@site/src/lib/format";
import type { ContentEntry } from "@site/src/plugins/contentIndex/shared";
import Layout from "@theme/Layout";
import { ArrowUpRight, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
export default function ArchivePage({
  archive,
}: {
  archive: {
    kind: "notes" | "blog";
    entries: ContentEntry[];
  };
}) {
  const [query, setQuery] = useState("");
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const timeline = useRef<HTMLDivElement>(null);
  const isNotes = archive.kind === "notes",
    title = isNotes ? "筆記歸檔" : "部落格歸檔";
  const filtered = useMemo(
    () =>
      archive.entries.filter((e) =>
        `${e.title} ${e.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, archive.entries],
  );
  const groups = useMemo(() => {
    const result = new Map<string, ContentEntry[]>();
    for (const e of filtered) {
      const year = e.date?.slice(0, 4) ?? "未記錄日期";
      result.set(year, [...(result.get(year) ?? []), e]);
    }
    return [...result];
  }, [filtered]);
  useEffect(() => {
    const sections = groups.flatMap(([year]) => {
      const section = document.getElementById(`archive-${year}`);
      return section ? [section] : [];
    });
    let frame = 0;
    function updateYear() {
      frame = 0;
      const threshold = (document.querySelector(".navbar")?.getBoundingClientRect().bottom ?? 0) + 40;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top > threshold) break;
        current = section;
      }
      // 最後一年內容較短時可能無法到達視窗頂端；
      // 捲到頁底時直接標示讀者已到達的最後一個年份。
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      setActiveYear(current?.dataset.archiveYear ?? null);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(updateYear);
    }
    const observer = new ResizeObserver(schedule);
    if (timeline.current) observer.observe(timeline.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    updateYear();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [groups]);
  return (
    <Layout title={title} description={isNotes ? "沿著時間軸回顧技術筆記的累積。" : "沿著時間軸回顧部落格的發布紀錄。"}>
      <PageSurface variant="archive">
        <main className="max-w-285 w-full m-auto p-[3.5rem_2rem_5rem] [@media(max-width:_720px)]:p-[2.5rem_1.25rem_3rem]">
          <header className="flex justify-between items-end gap-8 mb-6 [&_h1]:text-[2.75rem] [&_h1]:font-[550] [&_h1]:tracking-[-0.03em] [&_h1]:mb-[0.7rem] [&_h1_span]:text-(--ifm-color-primary) [&_p]:text-muted-foreground [&_p]:m-0 [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-2 [&_>_a]:text-[0.875rem] [&_>_a]:shrink-0 [&_>_a]:text-foreground [@media(max-width:_720px)]:flex-col [@media(max-width:_720px)]:items-start [@media(max-width:_720px)]:gap-4 [@media(max-width:_720px)]:[&_h1]:text-[2.3rem]">
            <div>
              <h1>
                {title}
                <span>.</span>
              </h1>
              <p>
                {isNotes ? "沿著時間軸，回顧知識慢慢累積的過程。" : "開發實作、技術觀點與學習歷程，依發布時間整理。"}
              </p>
            </div>
            <Link to={isNotes ? "/docs" : "/blog"}>
              回到{isNotes ? "筆記" : "文章列表"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </header>
          <div className="relative max-w-110 mt-8 [&_>_svg]:absolute [&_>_svg]:top-[50%] [&_>_svg]:left-[0.85rem] [&_>_svg]:transform-[translateY(-50%)] [&_>_svg]:text-muted-foreground">
            <Search size={17} aria-hidden="true" />
            <label className="sr-only" htmlFor="archive-search">
              搜尋{title}
            </label>
            <Input
              id="archive-search"
              type="search"
              placeholder="搜尋筆記或文章…"
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p className="text-[0.8125rem] text-muted-foreground m-[1rem_0_2rem]" role="status">
            {filtered.length} 篇 · 由新到舊
          </p>
          <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-12 [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-6">
            <nav
              className="sticky top-24 [align-self:start] flex flex-col gap-2 [&_a]:flex [&_a]:justify-between [&_a]:p-[0.5rem_0.75rem] [&_a]:text-foreground [&_a]:rounded-[7px] [&_a]:[font-variant-numeric:tabular-nums] [&_a:hover]:bg-brand-secondary/10 [&_a:hover]:text-(--brand-secondary-foreground) [&_a:hover]:[text-decoration:none] [&_span]:text-muted-foreground [&_span]:text-[0.75rem] [@media(max-width:_720px)]:static [@media(max-width:_720px)]:flex-row [@media(max-width:_720px)]:flex-wrap [@media(max-width:_720px)]:gap-2 [@media(max-width:_720px)]:[&_a]:gap-3"
              aria-label="歸檔年份"
            >
              {groups.map(([year, entries]) => (
                <a
                  key={year}
                  href={`#archive-${year}`}
                  aria-current={activeYear === year ? "location" : undefined}
                  className="transition-colors aria-[current=location]:bg-brand-secondary/15 aria-[current=location]:font-semibold aria-[current=location]:text-(--brand-secondary-foreground)"
                >
                  {year}
                  <span className="rounded bg-brand-secondary/15 px-1.5 text-(--brand-secondary-foreground)!">
                    {entries.length}
                  </span>
                </a>
              ))}
            </nav>
            <div className="min-w-0" ref={timeline}>
              {groups.map(([year, entries]) => (
                <section
                  key={year}
                  id={`archive-${year}`}
                  data-archive-year={year}
                  className="relative scroll-mt-24 [border-left:1px_solid_var(--border)] p-[0_0_2.5rem_2rem] [&_h2]:text-[1.8rem] [&_h2]:font-medium [&_h2]:m-[0_0_1.5rem] [&_h2]:[font-variant-numeric:tabular-nums] [&_h2:before]:[content:''] [&_h2:before]:absolute [&_h2:before]:-left-1.25 [&_h2:before]:top-3.5 [&_h2:before]:w-2.25 [&_h2:before]:h-2.25 [&_h2:before]:rounded-[50%] [&_h2:before]:[background:var(--brand-secondary)] [&_ul]:list-none [&_ul]:m-0 [&_ul]:p-0 [&_li]:grid [&_li]:grid-cols-[125px_minmax(0,1fr)_20px] [&_li]:items-center [&_li]:gap-5 [&_li]:p-[1.15rem_0] [&_li]:[border-bottom:1px_solid_var(--border)] [&_a]:text-foreground [&_h3]:text-[1rem] [&_h3]:font-medium [&_h3]:m-0 [&_h3]:leading-[1.65] [&_li_>_svg]:text-muted-foreground [@media(max-width:_720px)]:pl-5 [@media(max-width:_720px)]:[&_li]:grid-cols-[1fr_20px] [@media(max-width:_720px)]:[&_li]:gap-[0.4rem] [@media(max-width:_720px)]:[&_li_>_svg]:col-2 [@media(max-width:_720px)]:[&_li_>_svg]:row-2"
                >
                  <h2>{year}</h2>
                  <ul>
                    {entries.map((e) => (
                      <li key={e.permalink}>
                        <div className="flex flex-col gap-1 text-[0.8rem] text-muted-foreground [font-variant-numeric:tabular-nums] [&_span]:text-[0.7rem] [@media(max-width:_720px)]:col-span-full [@media(max-width:_720px)]:flex-row [@media(max-width:_720px)]:gap-[0.7rem]">
                          <time dateTime={e.date ?? undefined}>{formatDate(e.date)}</time>
                        </div>
                        <Link to={e.permalink}>
                          <h3>{e.title}</h3>
                          <div className="flex gap-[0.6rem] flex-wrap text-[0.7rem] text-muted-foreground mt-2">
                            {e.tags.slice(0, 3).map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </Link>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              {!filtered.length && <p>沒有符合的內容，試試其他關鍵字。</p>}
            </div>
          </div>
        </main>
      </PageSurface>
    </Layout>
  );
}
