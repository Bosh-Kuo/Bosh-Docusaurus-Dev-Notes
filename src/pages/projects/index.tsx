import { GitHubIcon } from "@site/src/components/BrandIcons";
import ContributionCalendar from "@site/src/components/ContributionCalendar";
import PageSurface from "@site/src/components/PageSurface";
import RepoCard from "@site/src/components/RepoCard";
import TechCloud from "@site/src/components/TechCloud";
import { Badge } from "@site/src/components/ui/badge";
import { Button, buttonVariants } from "@site/src/components/ui/button";
import { Card } from "@site/src/components/ui/card";
import { Input } from "@site/src/components/ui/input";
import { Skeleton } from "@site/src/components/ui/skeleton";
import { TextMarkerHighlight } from "@site/src/components/ui/text-marker-highlight";
import { useColors } from "@site/src/hooks/useColors";
import { REPOS_PER_PAGE, useGithubRepos } from "@site/src/hooks/useGithubRepos";
import Layout from "@theme/Layout";
import { Check, RotateCcw, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
export default function Projects(): React.JSX.Element {
  const [page, setPage] = useState(1);
  const { repos, loading, hasError, refetch } = useGithubRepos("Bosh-Kuo");
  const { colors } = useColors();
  const [query, setQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const languages = useMemo(() => [...new Set(repos.map((repo) => repo.language || "none"))].sort(), [repos]);
  const filtered = useMemo(
    () =>
      repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query.trim().toLowerCase()) &&
          (!selectedLanguages.length || selectedLanguages.includes(repo.language || "none")),
      ),
    [repos, query, selectedLanguages],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / REPOS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visibleRepos = filtered.slice((currentPage - 1) * REPOS_PER_PAGE, currentPage * REPOS_PER_PAGE);
  function toggleLanguage(value: string) {
    setPage(1);
    setSelectedLanguages((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }
  return (
    <Layout title="近期專案" description="近期在 GitHub 更新的專案與實作紀錄。">
      <PageSurface variant="projects">
        <main className="w-full max-w-305 m-[0_auto] p-[4rem_2rem_5rem] [@media(max-width:_640px)]:p-[2.5rem_1.25rem_3rem]">
          <header className="flex justify-between gap-8 items-center mb-12 [&_h1]:text-[2.75rem] [&_h1]:font-[550] [&_h1]:tracking-[-0.03em] [&_h1]:mb-4 [&_h1_span]:text-(--ifm-color-primary) [&_p]:text-[0.9375rem] [&_p]:text-muted-foreground [&_p]:max-w-xl [&_p]:m-0 [&_p]:leading-[1.9] [@media(max-width:_640px)]:flex-col [@media(max-width:_640px)]:items-start [@media(max-width:_640px)]:mb-8 [@media(max-width:_640px)]:gap-5 [@media(max-width:_640px)]:[&_h1]:text-[2.25rem]">
            <div>
              <h1>
                近期專案<span>.</span>
              </h1>
              <p>收錄近期在 GitHub 更新的專案，記錄想法、實作與持續探索的足跡。</p>
            </div>
            <a
              href="https://github.com/Bosh-Kuo"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
              data-slot="button"
            >
              <GitHubIcon />
              前往 GitHub
            </a>
          </header>
          <TextMarkerHighlight
            text="最近更新的專案"
            highlight="最近更新的專案"
            className="text-2xl! sm:text-[1.5rem]!"
          />
          <div className="flex justify-between items-center gap-4 pb-6 [border-bottom:1px_solid_var(--border)] mb-4 [@media(max-width:_640px)]:flex-col [@media(max-width:_640px)]:items-start [@media(max-width:_996px)]:flex-wrap [@media(max-width:_720px)]:items-stretch">
            <div className="relative w-[min(100%,340px)] [&_>_svg]:absolute [&_>_svg]:left-3 [&_>_svg]:top-[50%] [&_>_svg]:transform-[translateY(-50%)] [&_>_svg]:text-muted-foreground [&_input]:font-[inherit] [@media(max-width:_640px)]:w-full [@media(max-width:_720px)]:w-full">
              <Search size={17} aria-hidden="true" />
              <label
                className="absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap [border:0]"
                htmlFor="project-search"
              >
                篩選專案名稱
              </label>
              <Input
                className="pl-9"
                id="project-search"
                type="search"
                placeholder="搜尋所有專案名稱…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                disabled={loading || hasError}
              />
            </div>
            <p
              className="text-[0.8125rem] m-0 flex items-center gap-3 text-muted-foreground [@media(max-width:_996px)]:ml-auto [@media(max-width:_720px)]:ml-0"
              role="status"
            >
              {loading ? (
                "正在讀取 GitHub…"
              ) : hasError ? (
                "資料暫時無法取得"
              ) : (
                <>
                  依最近更新排序
                  <Badge className="border-brand-secondary/30 bg-brand-secondary/15 text-(--brand-secondary-foreground)">
                    {filtered.length} / {repos.length} 個專案
                  </Badge>
                </>
              )}
            </p>
          </div>
          {!loading && !hasError && languages.length > 0 && (
            <fieldset
              className="flex items-center flex-wrap gap-[0.6rem] m-[0_0_2rem] min-w-0 border-0 p-0"
              aria-label="篩選程式語言，可複選"
            >
              <span className="inline-flex items-baseline gap-[0.4rem] mr-[0.4rem] text-muted-foreground text-[0.8125rem] [&_small]:text-[0.7rem] [@media(max-width:_640px)]:w-full [@media(max-width:_640px)]:mb-1">
                程式語言 <small>可複選</small>
              </span>
              <button
                type="button"
                className="min-h-9.5 inline-flex items-center gap-2 p-[0.4rem_0.85rem] [border:1px_solid_var(--border)] rounded-[999px] bg-card text-muted-foreground [font:inherit] text-[0.8125rem] cursor-pointer [transition:background_180ms,border-color_180ms,transform_180ms] aria-pressed:text-foreground aria-pressed:border-(--ifm-color-primary) aria-pressed:bg-accent [&:hover]:text-foreground [&:hover]:border-(--ifm-color-primary) [@media(hover:_hover)_and_(prefers-reduced-motion:_no-preference)]:[&:hover]:transform-[translateY(-2px)] [@media(max-width:_640px)]:min-h-11"
                aria-pressed={!selectedLanguages.length}
                onClick={() => {
                  setSelectedLanguages([]);
                  setPage(1);
                }}
              >
                全部
              </button>
              {languages.map((value) => {
                const selected = selectedLanguages.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className="min-h-9.5 inline-flex items-center gap-2 p-[0.4rem_0.85rem] [border:1px_solid_var(--border)] rounded-[999px] bg-card text-muted-foreground [font:inherit] text-[0.8125rem] cursor-pointer [transition:background_180ms,border-color_180ms,transform_180ms] aria-pressed:text-foreground aria-pressed:border-(--ifm-color-primary) aria-pressed:bg-accent [&:hover]:text-foreground [&:hover]:border-(--ifm-color-primary) [@media(hover:_hover)_and_(prefers-reduced-motion:_no-preference)]:[&:hover]:transform-[translateY(-2px)] [@media(max-width:_640px)]:min-h-11"
                    aria-pressed={selected}
                    onClick={() => toggleLanguage(value)}
                  >
                    <span
                      className="w-2 h-2 rounded-[50%]"
                      style={{
                        background: colors[value]?.color || "var(--ifm-color-primary)",
                      }}
                      aria-hidden="true"
                    />
                    {value === "none" ? "未標示語言" : value}
                    {selected && <Check size={13} aria-hidden="true" />}
                  </button>
                );
              })}
            </fieldset>
          )}
          {loading ? (
            <div
              className="grid grid-cols-3 gap-4 [@media(max-width:_996px)]:grid-cols-2 [@media(max-width:_640px)]:grid-cols-[1fr]"
              role="status"
              aria-busy="true"
              aria-label="正在載入專案"
            >
              {Array.from({ length: 9 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 範例與骨架的固定編號不會重新排序，也不保存個別項目的狀態。
                <Card key={i} className="p-6">
                  <Skeleton className="h-5 w-3/4 mb-6" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-2/3 mb-8" />
                  <Skeleton className="h-4 w-1/3" />
                </Card>
              ))}
            </div>
          ) : hasError ? (
            <div
              className="text-center p-[4rem_1.25rem] bg-muted rounded-[12px] [&_h2]:text-[1.25rem] [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:text-muted-foreground [&_p]:max-w-xl [&_p]:m-[0_auto_1.5rem]"
              role="alert"
            >
              <h2>暫時無法載入專案</h2>
              <p>GitHub 連線可能中斷或已達 API 請求上限。請稍後重試，也可以直接前往 GitHub 查看。</p>
              <Button onClick={() => void refetch()}>
                <RotateCcw size={16} aria-hidden="true" />
                重新載入
              </Button>
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-3 gap-4 [@media(max-width:_996px)]:grid-cols-2 [@media(max-width:_640px)]:grid-cols-[1fr]">
              {visibleRepos.map((repo) => (
                <RepoCard key={repo.html_url} repo={repo} colors={colors} />
              ))}
            </div>
          ) : (
            <div className="text-center p-[4rem_1.25rem] bg-muted rounded-[12px] [&_h2]:text-[1.25rem] [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:text-muted-foreground [&_p]:max-w-xl [&_p]:m-[0_auto_1.5rem]">
              <h2>{repos.length ? "沒有符合的專案" : "目前沒有公開專案"}</h2>
              <p>
                {repos.length
                  ? "試試其他名稱或程式語言，或清除篩選查看所有專案。"
                  : "稍後再來看看，或直接前往 GitHub。"}
              </p>
              {(query || selectedLanguages.length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setSelectedLanguages([]);
                    setPage(1);
                  }}
                >
                  清除篩選
                </Button>
              )}
            </div>
          )}
          <nav aria-label="專案分頁" className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              disabled={currentPage === 1 || loading || hasError}
              onClick={() => setPage(currentPage - 1)}
            >
              上一頁
            </Button>
            <span className="text-sm text-muted-foreground" role="status">
              第 {currentPage} / {pageCount} 頁
            </span>
            <Button
              variant="outline"
              disabled={currentPage === pageCount || loading || hasError}
              onClick={() => setPage(currentPage + 1)}
            >
              下一頁
            </Button>
          </nav>
          <section className="mt-16 border-0 border-t border-solid border-border pt-12">
            <TextMarkerHighlight text="程式足跡" highlight="程式足跡" className="text-2xl! sm:text-[1.5rem]!" />
            <p className="mb-8 text-muted-foreground">
              透過專案驗證想法，透過持續的實作累積經驗。這裡是我正在探索的技術，以及過去一年的 GitHub 活動。
            </p>
            <div className="grid items-stretch gap-6 lg:grid-cols-2">
              <TechCloud />
              <ContributionCalendar />
            </div>
          </section>
        </main>
      </PageSurface>
    </Layout>
  );
}
