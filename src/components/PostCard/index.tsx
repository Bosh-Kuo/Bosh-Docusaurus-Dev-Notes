import Link from "@docusaurus/Link";
import { formatDate } from "@site/src/lib/format";
import type { ContentEntry } from "@site/src/plugins/contentIndex/shared";
import { ArrowUpRight, Clock3 } from "lucide-react";
export default function PostCard({ post }: { post: ContentEntry }) {
  return (
    <article className="min-w-0 overflow-hidden bg-card [border:1px_solid_var(--border)] rounded-[14px] ring-2 ring-transparent ring-offset-4 ring-offset-background transition-[transform,box-shadow] duration-300 motion-reduce:transition-none hover:ring-brand focus-within:ring-brand [&:hover]:transform-[translateY(-5px)] [&:hover_.ui-components-postcard-styles-cover_img]:transform-[scale(1.035)]">
      <Link
        to={post.permalink}
        className="ui-components-postcard-styles-cover block aspect-video overflow-hidden bg-muted [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:[transition:transform_500ms_cubic-bezier(0.16,1,0.3,1)]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img src={post.image} alt="" loading="lazy" width="640" height="360" />
      </Link>
      <div className="p-[1.4rem] [&_h3]:text-[1.15rem] [&_h3]:font-[550] [&_h3]:leading-[1.6] [&_h3]:m-[0.8rem_0_0.7rem] [&_h3_a]:flex [&_h3_a]:items-start [&_h3_a]:gap-[0.6rem] [&_h3_a]:text-foreground [&_h3_svg]:shrink-0 [&_h3_svg]:mt-1 [&_h3_svg]:text-muted-foreground [&_p]:text-[0.875rem] [&_p]:leading-[1.85] [&_p]:text-muted-foreground [&_p]:[display:-webkit-box] [&_p]:[-webkit-line-clamp:3] [&_p]:[-webkit-box-orient:vertical] [&_p]:overflow-hidden [&_p]:m-[0_0_1.2rem]">
        <div className="flex justify-between gap-2 text-[0.75rem] text-muted-foreground [font-variant-numeric:tabular-nums] [&_span]:flex [&_span]:gap-[0.3rem] [&_span]:items-center">
          <time
            className="rounded-md bg-brand-secondary/15 px-2 py-1 text-(--brand-secondary-foreground)"
            dateTime={post.date ?? undefined}
          >
            {formatDate(post.date)}
          </time>
          <span>
            <Clock3 size={13} aria-hidden="true" />
            {Math.ceil(post.readingTime ?? 1)} 分鐘
          </span>
        </div>
        <h3>
          <Link to={post.permalink}>
            {post.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </h3>
        <p>{post.description}</p>
        <div className="flex flex-wrap gap-[0.4rem] [&_span]:bg-accent [&_span]:[color:var(--accent-foreground)] [&_span]:p-[0.2rem_0.55rem] [&_span]:rounded-[5px] [&_span]:text-[0.7rem] [[data-theme='dark']_&_span]:text-(--ifm-color-primary-lightest)">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
