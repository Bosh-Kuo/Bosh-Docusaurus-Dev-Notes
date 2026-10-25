import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { Button } from "@site/src/components/ui/button";
import { Skeleton } from "@site/src/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Day = {
  date: string;
  count: number;
  level: number;
};
function parseDays(value: unknown): Day[] {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray(
      (
        value as {
          contributions?: unknown;
        }
      ).contributions,
    )
  )
    throw new Error("Invalid contributions");
  const days = (
    value as {
      contributions: Day[];
    }
  ).contributions;
  if (
    !days.length ||
    !days.every(
      (d) =>
        /^\d{4}-\d{2}-\d{2}$/.test(d.date) &&
        Number.isFinite(d.count) &&
        d.count >= 0 &&
        Number.isInteger(d.level) &&
        d.level >= 0 &&
        d.level <= 4,
    )
  )
    throw new Error("Invalid days");
  return [...days].sort((a, b) => a.date.localeCompare(b.date));
}
export default function ContributionCalendar() {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const [active, setActive] = useState<number | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const {
    data: days = [],
    isPending: loading,
    isError: error,
    refetch,
  } = useQuery({
    queryKey: ["github", "contributions", "Bosh-Kuo"],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<unknown>("https://github-contributions-api.jogruber.de/v4/Bosh-Kuo?y=last", {
        signal,
        timeout: 15000,
      });
      return parseDays(data);
    },
    enabled: useIsBrowser(),
    staleTime: 30 * 60 * 1000,
    gcTime: typeof window === "undefined" ? Infinity : 12 * 60 * 60 * 1000,
  });
  const grid = useMemo(() => {
    if (!days.length)
      return {
        offset: 0,
        weeks: 0,
        months: [] as {
          label: string;
          column: number;
        }[],
      };
    const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
    const months: {
      label: string;
      column: number;
    }[] = [];
    let prev = "";
    for (let i = 0; i < days.length; i++) {
      const month = days[i].date.slice(0, 7);
      if (month !== prev) {
        const column = Math.floor((i + offset) / 7);
        if (!months.length || column - months[months.length - 1].column >= 3)
          months.push({
            label: new Intl.DateTimeFormat(currentLocale, { month: "short", timeZone: "UTC" }).format(
              new Date(`${month}-01T00:00:00Z`),
            ),
            column,
          });
        prev = month;
      }
    }
    return { offset, weeks: Math.ceil((days.length + offset) / 7), months };
  }, [days, currentLocale]);
  useEffect(() => {
    if (!loading && scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [loading]);
  const total = days.reduce((sum, d) => sum + d.count, 0),
    selected = active == null ? null : days[active];
  function move(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const steps: {
      [key: string]: number;
    } = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    };
    if (event.key in steps) {
      event.preventDefault();
      const next = Math.max(0, Math.min(days.length - 1, index + steps[event.key]));
      setActive(next);
      scroll.current?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus();
    }
  }
  return (
    <section
      className="min-w-0 p-[1.6rem_1.75rem] [border:1px_solid_var(--border)] rounded-[14px] bg-card [--level0:var(--muted)] [--level1:#c5eaf0] [--level2:#80cedc] [--level3:#3eb4c6] [--level4:#297f8d] in-data-[theme='dark']:[--level0:#25252d] in-data-[theme='dark']:[--level1:#163a48] in-data-[theme='dark']:[--level2:#12647d] in-data-[theme='dark']:[--level3:#0493be] in-data-[theme='dark']:[--level4:#1dc7fb] **:data-[level='0']:[background:var(--level0)] **:data-[level='1']:[background:var(--level1)] **:data-[level='2']:[background:var(--level2)] **:data-[level='3']:[background:var(--level3)] **:data-[level='4']:[background:var(--level4)] [@media(max-width:_640px)]:p-5 h-full flex flex-col"
      aria-labelledby="activity-title"
    >
      <div className="flex justify-between items-center gap-4 [&_h2]:text-[1.2rem] [&_h2]:font-[550] [&_h2]:m-0 [&_a]:text-muted-foreground">
        <h2 id="activity-title">{translate({ id: "site.github.activity", message: "GitHub 活動" })}</h2>
        <a
          href="https://github.com/Bosh-Kuo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translate({ id: "site.view.boshs.github.activity", message: "查看 Bosh 的 GitHub 活動" })}
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
      {loading ? (
        <div
          className="min-h-50 pt-6"
          role="status"
          aria-busy="true"
          aria-label={translate({ id: "site.loading.github.activity", message: "正在載入 GitHub 活動" })}
        >
          <Skeleton className="h-4 w-1/2 mb-6" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : error ? (
        <div className="min-h-50 pt-6 [&_p]:text-muted-foreground [&_p]:text-[0.875rem]" role="alert">
          <p>
            {translate({
              id: "site.github.activity.is.temporarily.unavailable",
              message: "暫時無法取得 GitHub 活動資料。",
            })}
          </p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            <RotateCcw size={14} aria-hidden="true" />
            {translate({ id: "site.retry", message: "重新載入" })}
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground text-[0.875rem] m-[1rem_0] [&_strong]:text-foreground [&_strong]:font-[550] [&_strong]:[font-variant-numeric:tabular-nums]">
            {translate(
              { id: "site.activity.total", message: "過去一年 {count} 次 contributions" },
              { count: total.toLocaleString(currentLocale) },
            )}
          </p>
          <div className="overflow-x-auto pb-[0.7rem] scrollbar-thin my-auto min-h-38.75" ref={scroll}>
            <div className="relative min-h-32.25 p-[24px_0_0_35px]" style={{ width: grid.weeks * 15 + 35 }}>
              <div className="h-5 absolute top-0 left-0 right-0 text-[0.6875rem] text-muted-foreground [&_span]:absolute [&_span]:whitespace-nowrap">
                {grid.months.map((m) => (
                  <span key={m.column} style={{ left: 35 + m.column * 15 }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="absolute left-0 top-9.25 flex flex-col gap-2.75 text-[0.625rem] text-muted-foreground leading-4.75">
                <span>{translate({ id: "site.mon", message: "一" })}</span>
                <span>{translate({ id: "site.wed", message: "三" })}</span>
                <span>{translate({ id: "site.fri", message: "五" })}</span>
              </div>
              <fieldset
                className="grid gap-0.75 grid-rows-[repeat(7,12px)] m-0 min-w-0 border-0 p-0"
                style={{
                  gridTemplateColumns: `repeat(${grid.weeks},12px)`,
                }}
                aria-label={translate({
                  id: "site.daily.github.contributions.use.arrow.keys.to.navigate",
                  message: "每日 GitHub contribution 數量；方向鍵可移動",
                })}
              >
                {days.map((day, i) => (
                  <button
                    key={day.date}
                    type="button"
                    data-day={i}
                    data-level={day.level}
                    className="w-3 h-3 [border:1px_solid_#0d203a08] rounded-[3px] p-0 cursor-default focus-visible:[outline:2px_solid_var(--foreground)] focus-visible:outline-offset-1 [&:hover]:[outline:1px_solid_var(--foreground)]"
                    style={{
                      gridColumn: Math.floor((i + grid.offset) / 7) + 1,
                      gridRow: ((i + grid.offset) % 7) + 1,
                    }}
                    aria-label={translate(
                      { id: "site.activity.day", message: "{date} · {count} 次 contributions" },
                      { date: day.date, count: day.count },
                    )}
                    title={translate(
                      { id: "site.activity.day", message: "{date} · {count} 次 contributions" },
                      { date: day.date, count: day.count },
                    )}
                    tabIndex={i === (active ?? days.length - 1) ? 0 : -1}
                    onFocus={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => {
                      if (!scroll.current?.contains(document.activeElement)) setActive(null);
                    }}
                    onKeyDown={(e) => move(e, i)}
                  />
                ))}
              </fieldset>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4 mt-[0.6rem] text-[0.6875rem] text-muted-foreground [@media(max-width:_640px)]:items-start [@media(max-width:_640px)]:flex-col [@media(max-width:_640px)]:gap-3">
            <span aria-live="polite">
              {selected
                ? translate(
                    { id: "site.activity.day", message: "{date} · {count} 次 contributions" },
                    { date: selected.date, count: selected.count },
                  )
                : translate({
                    id: "site.includes.commits.pull.requests.and.other.github.contributions",
                    message: "包含 commits、pull requests 等 GitHub 貢獻",
                  })}
            </span>
            <div className="flex gap-0.75 items-center shrink-0 [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[3px] [&_i]:block [&_span]:mx-0.75">
              <span>{translate({ id: "site.less", message: "少" })}</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <i key={level} data-level={level} />
              ))}
              <span>{translate({ id: "site.more", message: "多" })}</span>
            </div>
          </div>
        </>
      )}
      <a
        className="block text-[0.625rem] text-muted-foreground mt-4 mt-6"
        href="https://github.com/grubersjoe/github-contributions-api"
        target="_blank"
        rel="noopener noreferrer"
      >
        {translate({ id: "site.source.github.contributions.api", message: "資料來源：GitHub Contributions API" })}
      </a>
    </section>
  );
}
