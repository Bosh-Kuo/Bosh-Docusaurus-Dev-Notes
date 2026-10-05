/**
 * 改寫自 Docusaurus theme-classic 的 BlogPostPage（MIT 授權）。
 * Copyright (c) Facebook, Inc. and its affiliates. MIT license.
 */
import Link from "@docusaurus/Link";
import { BlogPostProvider, useBlogPost } from "@docusaurus/plugin-content-blog/client";
import { HtmlClassNameProvider, ThemeClassNames } from "@docusaurus/theme-common";
import { useContentIndex } from "@site/src/hooks/useContentIndex";
import { formatDate } from "@site/src/lib/format";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostPage";
import BlogPostPageMetadata from "@theme/BlogPostPage/Metadata";
import BlogPostPageStructuredData from "@theme/BlogPostPage/StructuredData";
import BlogPostPaginator from "@theme/BlogPostPaginator";
import ContentVisibility from "@theme/ContentVisibility";
import Layout from "@theme/Layout";
import TOC from "@theme/TOC";
import TOCInline from "@theme/TOCInline";
import { cn } from "cn";
import { ArrowLeft, Clock3 } from "lucide-react";
import type React from "react";

function ReadingPage({ children }: { children: React.ReactNode }) {
  const { metadata: m, toc } = useBlogPost();
  const { posts } = useContentIndex();
  const post = posts.find((p) => p.permalink === m.permalink);
  const hasTOC = !m.frontMatter.hide_table_of_contents && toc.length > 0;
  const tocContent = (
    <TOC
      toc={toc}
      minHeadingLevel={m.frontMatter.toc_min_heading_level}
      maxHeadingLevel={m.frontMatter.toc_max_heading_level}
    />
  );
  return (
    <Layout>
      <div data-reading-content>
        <header className="ui-theme-blogpostpage-styles-hero relative isolate min-h-105 grid place-items-center p-[3rem_2rem] text-white [background:#0d203a] overflow-hidden [&:after]:[content:''] [&:after]:absolute [&:after]:inset-0 [&:after]:z-[-1] [&:after]:[background:linear-gradient(180deg,#07182cbf,#07182cd9)] [&_h1]:text-[clamp(2rem,3.2vw,3.2rem)] [&_h1]:font-[550] [&_h1]:leading-normal [&_h1]:tracking-tight [&_h1]:text-balance [&_h1]:m-[0_auto_1.75rem] [&_h1]:max-w-250 [@media(max-width:_640px)]:min-h-100 [@media(max-width:_640px)]:p-[2rem_1.25rem] [@media(max-width:_640px)]:[&_h1]:text-[1.9rem]">
          <img
            className="ui-theme-blogpostpage-styles-cover absolute inset-0 z-[-2] w-full h-full object-cover object-center"
            src={
              post?.image ??
              (typeof m.frontMatter.image === "string" ? m.frontMatter.image : "/img/undraw_blogging.svg")
            }
            alt={post?.imageAlt ?? ""}
            fetchPriority="high"
          />
          <div className="ui-theme-blogpostpage-styles-heroInner w-full max-w-275 text-center">
            <Link
              className="ui-theme-blogpostpage-styles-back inline-flex items-center gap-2 text-[0.8rem] text-[#d8eef5] mb-6 [&:hover]:text-[white]"
              to="/blog"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              所有文章
            </Link>
            <div className="ui-theme-blogpostpage-styles-heroTags flex justify-center gap-2 flex-wrap mb-4 [&_a]:text-[0.75rem] [&_a]:text-[#e5f8fc] [&_a]:[background:#ffffff14] [&_a]:p-[0.2rem_0.65rem] [&_a]:[border:1px_solid_#ffffff30] [&_a]:rounded-[5px]">
              {m.tags.map((t) => (
                <Link key={t.permalink} to={t.permalink}>
                  {t.label}
                </Link>
              ))}
            </div>
            <h1>{m.title}</h1>
            <div className="ui-theme-blogpostpage-styles-info flex items-center justify-center gap-5 flex-wrap text-[#dbe9f0] text-[0.8125rem] [font-variant-numeric:tabular-nums] [&_span]:inline-flex [&_span]:items-center [&_span]:gap-2 [@media(max-width:_640px)]:gap-3">
              {m.authors.map((a) => (
                <span
                  key={a.name}
                  className="ui-theme-blogpostpage-styles-author [&_img]:rounded-[50%] [&_a]:text-white"
                >
                  {a.imageURL && <img src={a.imageURL} alt="" width={28} height={28} />}
                  <a href={a.url}>{a.name}</a>
                </span>
              ))}
              <time dateTime={m.date}>{formatDate(m.date)}</time>
              <span>
                <Clock3 size={14} aria-hidden="true" />
                {Math.ceil(m.readingTime ?? 1)} 分鐘閱讀
              </span>
            </div>
          </div>
        </header>
        <div
          className={cn(
            "ui-theme-blogpostpage-styles-reading w-full max-w-330 p-[3rem_2.5rem_5rem] m-auto grid grid-cols-[minmax(0,1fr)_290px] gap-14 [@media(max-width:_996px)]:grid-cols-[1fr] [@media(max-width:_996px)]:p-[2rem_1.5rem_3rem] [@media(max-width:_996px)]:gap-0 [@media(max-width:_996px)]:max-w-225 [@media(max-width:_640px)]:p-[1.75rem_1.25rem_3rem]",
            !hasTOC && "ui-theme-blogpostpage-styles-noTOC grid-cols-[minmax(0,900px)] justify-center",
          )}
        >
          <main className="ui-theme-blogpostpage-styles-body min-w-0 text-[1.0625rem] [&_.markdown]:leading-[1.95] [&_.markdown_>_h2]:text-[1.65rem] [&_.markdown_>_h2]:font-[550] [&_.markdown_>_h3]:font-[550] [@media(max-width:_640px)]:text-[1rem]">
            <ContentVisibility metadata={m} />
            {hasTOC && (
              <details className="ui-theme-blogpostpage-styles-mobileTOC hidden [@media(max-width:_996px)]:block [@media(max-width:_996px)]:[border:1px_solid_var(--border)] [@media(max-width:_996px)]:rounded-[10px] [@media(max-width:_996px)]:p-[0.9rem_1rem] [@media(max-width:_996px)]:mb-8 [@media(max-width:_996px)]:text-[0.875rem] [@media(max-width:_996px)]:[&_summary]:cursor-pointer [@media(max-width:_996px)]:[&_nav]:mt-4 [@media(max-width:_996px)]:[&_.table-of-contents]:[border:0] [@media(max-width:_996px)]:[&_.table-of-contents]:[font-size:inherit] [@media(max-width:_996px)]:[&_.table-of-contents]:p-[0_0_0_1rem] [@media(max-width:_996px)]:[&_nav_a]:block [@media(max-width:_996px)]:[&_nav_a]:p-[0.4rem_0] [@media(max-width:_996px)]:[&_nav_a]:leading-[1.75] [@media(max-width:_996px)]:[&_nav_a]:text-(--ifm-color-primary-darkest) [@media(max-width:_996px)]:[&_nav_ul]:[font-size:inherit] [@media(max-width:_996px)]:[[data-theme='dark']_&_nav_a]:text-(--ifm-color-primary-lightest)">
                <summary>本篇章節導覽</summary>
                <nav aria-label="本篇章節">
                  <TOCInline
                    toc={toc}
                    minHeadingLevel={m.frontMatter.toc_min_heading_level}
                    maxHeadingLevel={m.frontMatter.toc_max_heading_level}
                  />
                </nav>
              </details>
            )}
            <BlogPostItem>{children}</BlogPostItem>
            {(m.nextItem || m.prevItem) && <BlogPostPaginator nextItem={m.nextItem} prevItem={m.prevItem} />}
          </main>
          {hasTOC && (
            <aside
              className="ui-theme-blogpostpage-styles-toc [align-self:start] sticky [top:6rem] [max-height:calc(100vh_-_7rem)] [overflow-y:auto] [scrollbar-width:thin] [padding-left:1.25rem] [border-left:1px_solid_var(--border)] [&_>_.thin-scrollbar]:[position:static] [&_>_.thin-scrollbar]:[max-height:none] [&_>_.thin-scrollbar]:[overflow:visible] [&_>_p]:[font-size:0.8125rem] [&_>_p]:text-foreground [&_>_p]:font-medium [&_>_p]:[margin-bottom:0.8rem] [&_.table-of-contents]:[font-size:0.8125rem] [&_.table-of-contents]:[border-left:0] [&_.table-of-contents]:p-0 [&_.table-of-contents_li]:[margin:0.6rem_0] [&_.table-of-contents\_\_link]:[line-height:1.8] [@media(max-width:_996px)]:hidden"
              aria-label="本篇章節"
            >
              <p>本篇章節</p>
              {tocContent}
            </aside>
          )}
        </div>
      </div>
    </Layout>
  );
}
export default function BlogPostPage(props: Props) {
  const Content = props.content;
  return (
    <BlogPostProvider content={Content} isBlogPostPage>
      <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogPostPage)}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <ReadingPage>
          <Content />
        </ReadingPage>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
