import Link from "@docusaurus/Link";
import { GitHubIcon, LinkedInIcon } from "@site/src/components/BrandIcons";
import PageSurface from "@site/src/components/PageSurface";
import { buttonVariants } from "@site/src/components/ui/button";
import { TextMarkerHighlight } from "@site/src/components/ui/text-marker-highlight";
import Layout from "@theme/Layout";
import { ArrowRight, BookOpen } from "lucide-react";
export default function About() {
  return (
    <Layout title="關於我" description="我是 Bosh，目前專注於 Web 全端開發，持續探索軟體工程、AI 與 Computer Science。">
      <PageSurface variant="about">
        <main className="max-w-280 m-auto w-full p-[4rem_2rem_5rem] [@media(max-width:_720px)]:p-[2.5rem_1.25rem_3rem]">
          <header className="grid grid-cols-[1.4fr_1fr] gap-20 items-center pb-16 [&_h1]:text-[clamp(2.5rem,4vw,3.8rem)] [&_h1]:font-[550] [&_h1]:tracking-[-0.03em] [&_h1]:mb-6 [&_h1_span]:text-(--ifm-color-primary) [&_p:not(.ui-pages-about-styles-lead)]:text-[0.9375rem] [&_p:not(.ui-pages-about-styles-lead)]:leading-[1.95] [&_p:not(.ui-pages-about-styles-lead)]:text-muted-foreground [&_p:not(.ui-pages-about-styles-lead)]:max-w-132 [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-8 [@media(max-width:_720px)]:pb-12">
            <div>
              <h1>
                Hi，我是 Bosh<span>.</span>
              </h1>
              <p className="ui-pages-about-styles-lead text-[1.5rem] leading-[1.7] font-[450] mb-6">
                跨領域的軟體工程師，
                <br />
                目前專注於 Web 全端開發。
              </p>
              <p>
                我喜歡從實作中遇到的問題出發，理解技術背後的原理，再透過筆記加深對技術的理解。 工作之餘，也喜歡 follow
                最新的技術發展，並嘗試將新技術融入到實際開發中。
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href="https://github.com/Bosh-Kuo"
                  className={buttonVariants({ variant: "soft" })}
                  data-slot="button"
                >
                  <GitHubIcon />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/po-chih-kuo-918452231/"
                  className={buttonVariants({ variant: "outline" })}
                  data-slot="button"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="relative justify-self-center transform-[rotate(3deg)] p-[1rem_1rem_0.7rem] bg-muted rounded-2xl [&_img]:w-65 [&_img]:h-70 [&_img]:object-cover [&_img]:rounded-[10px] [&_img]:block [&_span]:block [&_span]:text-center [&_span]:text-[0.8125rem] [&_span]:tracking-wider [&_span]:m-[0.9rem_0_0.25rem] [&_span]:text-muted-foreground [@media(max-width:_720px)]:[justify-self:start] [@media(max-width:_720px)]:[&_img]:w-55 [@media(max-width:_720px)]:[&_img]:h-57.5">
              <img src="/img/avatar.jpeg" alt="Bosh Kuo" width="300" height="300" />
              <span>Bosh Kuo</span>
            </div>
          </header>
          <section className="grid grid-cols-[1.5fr_1fr] items-center gap-16 p-[3rem_0] [border-block:1px_solid_var(--border)] [&_h2]:text-[1.6rem] [&_h2]:font-[550] [&_h2]:mb-5 [&_h2]:leading-[1.6] [&_p]:text-[0.9375rem] [&_p]:leading-[1.95] [&_p]:text-muted-foreground [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:text-[0.875rem] [&_a]:text-foreground [&_img]:w-full [&_img]:h-auto [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-8 [@media(max-width:_720px)]:p-[2.5rem_0] [@media(max-width:_720px)]:[&_img]:max-w-75 [@media(max-width:_720px)]:[&_img]:justify-self-center">
            <div>
              <TextMarkerHighlight
                text="把學習，變成可以分享的知識"
                highlight="把學習，變成可以分享的知識"
                className="text-2xl! sm:text-[1.75rem]! leading-[1.3333333333]!"
              />
              <p>
                一路上，我從網路上的技術筆記與開源專案得到許多幫助。前人的經驗，讓我少踩了不少坑；開源與分享精神，也一直是軟體生態圈最吸引我的地方。
              </p>
              <p>
                這個網站是我的學習紀錄。我把工作或學習中遇到的問題、重要觀念與解決方法寫下來，希望自己能真正理解，也希望這些內容能幫助遇到相似問題的你。
              </p>
              <Link to="/docs">
                <BookOpen size={17} />
                探索我的筆記
                <ArrowRight size={16} />
              </Link>
            </div>
            <img src="/img/undraw_programming.svg" alt="" width="340" height="260" loading="lazy" />
          </section>
          <section className="[&_h2]:text-[1.6rem] [&_h2]:font-[550] [&_h2]:mb-5 [&_h2]:leading-[1.6] p-[3.5rem_0] [&_>_div]:grid [&_>_div]:grid-cols-[repeat(3,1fr)] [&_>_div]:gap-10 [&_h3]:text-[1.125rem] [&_h3]:font-medium [&_p]:text-[0.875rem] [&_p]:leading-[1.9] [&_p]:text-muted-foreground [&_p]:m-0 [@media(max-width:_720px)]:[&_>_div]:grid-cols-[1fr] [@media(max-width:_720px)]:[&_>_div]:gap-6">
            <TextMarkerHighlight
              text="我正在探索的方向"
              highlight="我正在探索的方向"
              className="text-2xl! sm:text-[1.75rem]! leading-[1.3333333333]!"
            />
            <div>
              <article>
                <h3>Software Engineering</h3>
                <p>以 Web 全端開發為主軸，從系統設計、測試到維護，思考如何把需求轉成可靠、容易演進的軟體。</p>
              </article>
              <article>
                <h3>AI</h3>
                <p>從機器學習與深度學習的基礎出發，探索 AI 工具與模型如何融入產品與開發流程。</p>
              </article>
              <article>
                <h3>Computer Science</h3>
                <p>
                  持續補足作業系統、資料結構與軟體底層知識，理解程式背後的運作原理，把用過卻說不清楚的觀念重新整理。
                </p>
              </article>
            </div>
          </section>
          <footer className="flex items-center flex-wrap gap-6 pt-8 [border-top:1px_solid_var(--border)] text-[0.875rem] [&_p]:text-muted-foreground [&_p]:m-[0_auto_0_0] [&_a]:flex [&_a]:items-center [&_a]:gap-[0.4rem] [&_a]:text-foreground [@media(max-width:_720px)]:gap-4">
            <p>看看實作，也聊聊技術</p>
            <Link to="/projects">
              近期專案
              <ArrowRight size={16} />
            </Link>
          </footer>
        </main>
      </PageSurface>
    </Layout>
  );
}
