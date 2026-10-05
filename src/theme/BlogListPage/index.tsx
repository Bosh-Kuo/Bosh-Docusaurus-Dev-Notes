import Link from "@docusaurus/Link";
import { useHistory, useLocation } from "@docusaurus/router";
import useIsBrowser from "@docusaurus/useIsBrowser";
import PageSurface from "@site/src/components/PageSurface";
import PostCard from "@site/src/components/PostCard";
import { Button } from "@site/src/components/ui/button";
import { Input } from "@site/src/components/ui/input";
import { useContentIndex } from "@site/src/hooks/useContentIndex";
import type { Props } from "@theme/BlogListPage";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import Layout from "@theme/Layout";
import { ArrowRight, Check, Search } from "lucide-react";

export default function BlogListPage(props: Props) {
  const { posts, postTags: tags } = useContentIndex();
  const location = useLocation();
  const history = useHistory();
  const isBrowser = useIsBrowser();
  // 瀏覽器第一次渲染與 SSG 一致，掛載後再從 URL 還原篩選條件。
  const params = new URLSearchParams(isBrowser ? location.search : "");
  const query = params.get("q") ?? "";
  const selected = params.getAll("tag").filter((tag) => tags.includes(tag));
  const filtered = posts.filter(
    (post) =>
      (!selected.length || selected.some((tag) => post.tags.includes(tag))) &&
      [post.title, post.description, ...post.tags].join(" ").toLowerCase().includes(query.trim().toLowerCase()),
  );
  function update(key: string, values: string[]) {
    const next = new URLSearchParams(location.search);
    next.delete(key);
    for (const value of values) if (value) next.append(key, value);
    history.replace({ pathname: location.pathname, search: next.size ? `?${next}` : "" });
  }
  function toggle(tag: string) {
    update("tag", selected.includes(tag) ? selected.filter((value) => value !== tag) : [...selected, tag]);
  }
  return (
    <Layout title="部落格" description={props.metadata.blogDescription}>
      <BlogListPageStructuredData {...props} />
      <PageSurface variant="blog">
        <main className="mx-auto max-w-305 px-5 pb-20 pt-12 md:px-8">
          <header className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="mb-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
                技術、實作與探索<span className="text-brand">.</span>
              </h1>
              <p className="m-0 text-muted-foreground">記錄開發中的發現，分享理解問題的過程。</p>
            </div>
            <Link to="/archive/blog" className="inline-flex items-center gap-2 text-sm text-foreground">
              部落格歸檔
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </header>
          <div className="relative mb-5 max-w-xl">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
            />
            <label className="sr-only" htmlFor="blog-search">
              搜尋部落格文章
            </label>
            <Input
              id="blog-search"
              type="search"
              placeholder="搜尋文章、觀念或關鍵字…"
              className="pl-10"
              value={query}
              onChange={(event) => update("q", [event.target.value])}
            />
          </div>
          <fieldset className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-label="文章主題，可複選">
            <Button
              size="sm"
              variant={selected.length ? "outline" : "secondary"}
              aria-pressed={!selected.length}
              className="rounded-full border-border shadow-none hover:shadow-none"
              onClick={() => update("tag", [])}
            >
              全部文章
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant="outline"
                aria-pressed={selected.includes(tag)}
                className="rounded-full shadow-none aria-pressed:border-brand aria-pressed:bg-accent aria-pressed:text-accent-foreground hover:shadow-none"
                onClick={() => toggle(tag)}
              >
                {tag}
                {selected.includes(tag) && <Check size={13} aria-hidden="true" />}
              </Button>
            ))}
          </fieldset>
          <p className="mb-6 mt-5 text-sm text-muted-foreground" role="status">
            {query || selected.length ? "符合條件的文章" : "由新到舊"} · {filtered.length} / {posts.length} 篇
          </p>
          {filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <PostCard key={post.permalink} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-solid border-border bg-card px-6 py-16 text-center">
              <h2 className="text-xl">沒有找到符合的文章</h2>
              <p className="text-muted-foreground">試試不同關鍵字，或移除主題篩選。</p>
              <Button variant="outline" onClick={() => history.replace(location.pathname)}>
                清除所有篩選
              </Button>
            </div>
          )}
        </main>
      </PageSurface>
    </Layout>
  );
}
