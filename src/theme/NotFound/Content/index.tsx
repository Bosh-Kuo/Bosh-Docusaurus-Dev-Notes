import Link from "@docusaurus/Link";
import PageSurface from "@site/src/components/PageSurface";
import { buttonVariants } from "@site/src/components/ui/button";
import type { Props } from "@theme/NotFound/Content";
import { cn } from "cn";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

export default function NotFoundContent({ className }: Props) {
  return (
    <PageSurface variant="archive">
      <main
        className={cn(
          "mx-auto grid min-h-[65vh] max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-500",
          className,
        )}
      >
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Compass size={18} />
            換個方向，繼續探索
          </p>
          <h1 className="mb-5 text-4xl font-semibold leading-tight">這一頁，暫時迷路了</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            找不到你想看的頁面。它可能已經搬家，或連結中的地址有些不同。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonVariants()} to="/">
              <ArrowLeft size={16} />
              回到首頁
            </Link>
            <Link className={buttonVariants({ variant: "outline" })} to="/docs">
              探索技術筆記
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="relative grid place-items-center">
          <span className="font-semibold text-[clamp(7rem,20vw,13rem)] leading-none tracking-tighter text-brand/25">
            404
          </span>
          <div className="absolute -bottom-6 right-4 size-16 rounded-full border border-brand-secondary/40 bg-brand-secondary/10 motion-safe:animate-float" />
        </div>
      </main>
    </PageSurface>
  );
}
