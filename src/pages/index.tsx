import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import PageSurface from "@site/src/components/PageSurface";
import PostCard from "@site/src/components/PostCard";
import { buttonVariants } from "@site/src/components/ui/button";
import { useContentIndex } from "@site/src/hooks/useContentIndex";
import { formatDate } from "@site/src/lib/format";
import Layout from "@theme/Layout";
import ThemedImage from "@theme/ThemedImage";
import { ArrowRight, BookOpen, Code2 } from "lucide-react";
import { TextMarkerHighlight } from "../components/ui/text-marker-highlight";
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const { posts, recentNotes, notesCount } = useContentIndex();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <PageSurface variant="home">
        <main className="max-w-305 m-[0_auto] p-[0_2rem] [@media(max-width:_720px)]:p-[0_1.25rem]">
          <section
            className="grid grid-cols-[1.15fr_1fr] gap-12 items-center p-[3.8rem_0_3rem] min-h-135 [@media(max-width:_996px)]:gap-6 [@media(max-width:_996px)]:min-h-0 [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:p-[2.5rem_0_1rem] [@media(max-width:_720px)]:gap-4"
            aria-labelledby="home-title"
          >
            <div className="[&_h1]:text-[clamp(2.6rem,4.5vw,4.2rem)] [&_h1]:leading-[1.3] [&_h1]:tracking-[-0.035em] [&_h1]:font-[550] [&_h1]:m-[0_0_1.5rem] [&_h1_span]:text-(--ifm-color-primary-darkest) [[data-theme='dark']_&_h1_span]:text-(--ifm-color-primary-lightest) [@media(max-width:_720px)]:[&_h1]:text-[clamp(2.3rem,8vw,3.2rem)]">
              <h1 id="home-title">
                Bosh 的<br />
                <span>技術探索筆記.</span>
              </h1>
              <p className="text-[1.0625rem] leading-loose text-muted-foreground mb-7">
                遇見問題，理解原理，紀錄重點。
                <br />
                在軟體開發的路上，持續記錄我的探索足跡。
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/docs" className={buttonVariants({ variant: "soft", size: "lg" })} data-slot="button">
                  <BookOpen size={18} aria-hidden="true" />
                  探索筆記
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link to="/about" className={buttonVariants({ variant: "outline", size: "lg" })} data-slot="button">
                  認識 Bosh
                </Link>
              </div>
              <div className="flex items-center gap-[0.8rem] flex-wrap text-[0.8rem] mt-[1.65rem] text-muted-foreground [&_a]:text-muted-foreground [&_a:last-child]:flex [&_a:last-child]:p-[0.4rem] [&>a:first-child]:text-(--brand-secondary-foreground) [&>a:first-child]:rounded-md [&>a:first-child]:bg-brand-secondary/10 [&>a:first-child]:px-2 [&>a:first-child]:py-1">
                <Link to="/blog">{posts.length} 篇部落格文章</Link>
                <span aria-hidden="true">/</span>
                <Link to="/docs">{notesCount} 篇學習筆記</Link>
                <a href="https://github.com/Bosh-Kuo" aria-label="Bosh 的 GitHub">
                  <Code2 size={19} />
                </a>
              </div>
            </div>
            <div className="relative min-w-0 [&_img]:relative [&_img]:align-middle [&_img]:w-full [&_img]:h-auto [&_img]:max-h-117.5 motion-safe:animate-[ui-pages-index-artReveal_850ms_cubic-bezier(0.16,1,0.3,1)] [@media(max-width:_720px)]:max-w-105 [@media(max-width:_720px)]:w-full [@media(max-width:_720px)]:m-auto">
              <div
                className="absolute inset-[12%_7%_20%] [border:1px_solid_color-mix(in_srgb,var(--ifm-color-primary)_22%,transparent)] rounded-[50%] bg-accent transform-[rotate(-12deg)] bg-[radial-gradient(ellipse_at_25%_20%,color-mix(in_srgb,var(--brand-secondary)_38%,transparent),transparent_60%)]"
                aria-hidden="true"
              />
              <ThemedImage
                alt="開發者在電腦前探索程式與知識的插畫"
                sources={{
                  light: "/img/source-code-light.svg",
                  dark: "/img/source-code-dark.svg",
                }}
                width={480}
                height={480}
              />
              <div className="relative w-[84%] m-[0.5rem_auto_0] bg-card [border:1px_solid_var(--border)] rounded-[12px] p-[0.9rem_1.1rem] flex items-center gap-[0.6rem] text-[0.8125rem] [box-shadow:0_10px_28px_#0d203a0b] motion-safe:animate-float mt-7!">
                <span className="w-1.75 h-1.75 rounded-[50%] [background:var(--ifm-color-primary)] bg-emerald-500! motion-safe:animate-pulse" />
                持續學習，持續分享
                <span className="ml-auto text-muted-foreground font-[monospace]" aria-hidden="true">
                  &lt;/&gt;
                </span>
              </div>
            </div>
          </section>
          <section
            className="p-[3rem_0_4rem] [@media(max-width:_720px)]:p-[2.5rem_0]"
            aria-labelledby="recent-blog-title"
          >
            <div className="flex justify-between items-end gap-6 mb-7 [&_h2]:text-[1.75rem] [&_h2]:font-[550] [&_h2]:tracking-tight [&_h2]:mb-[0.6rem] [&_p]:text-muted-foreground [&_p]:text-[0.9375rem] [&_p]:m-0 [&_>_a]:inline-flex [&_>_a]:items-center [&_>_a]:gap-2 [&_>_a]:text-[0.875rem] [&_>_a]:text-foreground [&_>_a]:shrink-0 [@media(max-width:_720px)]:items-start [@media(max-width:_720px)]:flex-col [@media(max-width:_720px)]:gap-[0.8rem]">
              <div>
                <TextMarkerHighlight
                  text="近期部落格文章"
                  highlight="近期部落格文章"
                  className="text-2xl! sm:text-[1.75rem]! leading-[1.3333333333]!"
                />
                <p>技術觀點、開發實作，以及踩過的坑。</p>
              </div>
              <Link to="/blog">
                所有文章
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-[1.35rem] [@media(max-width:_996px)]:gap-4 [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-6">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.permalink} post={post} />
              ))}
            </div>
          </section>
          <section
            className="grid grid-cols-[0.8fr_1.5fr] gap-16 p-[3rem_0_4rem] [border-top:1px_solid_var(--border)] [@media(max-width:_996px)]:gap-8 [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-6 [@media(max-width:_720px)]:p-[2.5rem_0]"
            aria-labelledby="recent-notes-title"
          >
            <div className="[&_h2]:text-[1.75rem] [&_h2]:font-[550] [&_h2]:tracking-tight [&_h2]:mb-[0.6rem] [&_>_a]:inline-flex [&_>_a]:items-center [&_>_a]:gap-2 [&_>_a]:text-[0.875rem] [&_>_a]:text-foreground [&_>_a]:shrink-0 [&_img]:block [&_img]:w-47.5 [&_img]:h-42.5 [&_img]:object-contain [&_img]:mb-4 [&_p]:text-muted-foreground [&_p]:text-[0.875rem] [&_p]:leading-[1.9] [&_p]:max-w-88 [@media(max-width:_720px)]:[&_img]:float-right [@media(max-width:_720px)]:[&_img]:w-32.5 [@media(max-width:_720px)]:[&_img]:h-32.5 [@media(max-width:_720px)]:[&_img]:m-[0_0_1rem_1rem]">
              <img src="/img/storyset_notes.svg" alt="" width="240" height="240" loading="lazy" />
              <TextMarkerHighlight
                text="近期更新筆記"
                highlight="近期更新筆記"
                className="text-2xl! sm:text-[1.75rem]! leading-[1.3333333333]!"
              />
              <p>
                輸出式學習，以筆記內化知識。
                <br />
                將重要的觀念與問題解法，慢慢整理成自己的知識庫。
              </p>
              <Link to="/docs">
                回顧筆記歷程
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <ul className="list-none m-0 p-0 [&_li+li]:[border-top:1px_solid_var(--border)] [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-4 [&_a]:p-[1.15rem_0.8rem] [&_a]:text-foreground [&_a]:rounded-xl [&_a]:[transition:background_200ms] [&_a:hover]:bg-accent [&_a:hover]:[text-decoration:none] [&_h3]:text-[1rem] [&_h3]:font-medium [&_h3]:leading-[1.6] [&_h3]:m-[0.25rem_0_0.3rem] [&_time]:text-[0.75rem] [&_time]:text-muted-foreground [&_time]:[font-variant-numeric:tabular-nums] [&_svg]:text-muted-foreground [&_svg]:shrink-0 [&_svg]:[transition:transform_250ms] [&_a:hover_svg]:transform-[translateX(4px)] [@media(max-width:_720px)]:[&_a]:px-1">
              {recentNotes.map((note) => (
                <li key={note.permalink}>
                  <Link to={note.permalink}>
                    <div>
                      <span className="text-[0.7rem] text-muted-foreground">{note.tags[0] ?? "技術筆記"}</span>
                      <h3>{note.title}</h3>
                      <time dateTime={note.date ?? undefined}>{formatDate(note.date)} 更新</time>
                    </div>
                    <ArrowRight size={19} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </PageSurface>
    </Layout>
  );
}
