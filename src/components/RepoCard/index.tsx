import { Card } from "@site/src/components/ui/card";
import type { GithubColors } from "@site/src/hooks/useColors";
import type { Repo } from "@site/src/hooks/useGithubRepos";
import { ArrowUpRight, BookMarked, GitFork, Star } from "lucide-react";

export default function RepoCard({ repo, colors }: { repo: Repo; colors: GithubColors }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${repo.name}（在新分頁開啟 GitHub）`}
      className="group block min-w-0 rounded-xl text-foreground no-underline hover:text-foreground hover:no-underline"
    >
      <Card className="flex h-full min-h-55 flex-col p-6 transition-[transform,border-color,box-shadow,background-color] duration-300 group-hover:border-brand group-hover:bg-accent group-hover:shadow-[0_12px_30px_-20px_var(--brand)] motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none">
        <div className="flex items-start gap-2.5">
          <BookMarked size={18} aria-hidden="true" className="mt-1 shrink-0 text-muted-foreground" />
          <h2 className="m-0 wrap-break-word text-[0.9375rem] font-semibold leading-relaxed">{repo.name}</h2>
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="ml-auto mt-1 shrink-0 text-muted-foreground transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </div>
        <p
          className="mb-6 mt-4 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted-foreground"
          title={repo.description ?? undefined}
        >
          {repo.description || "此專案尚未提供描述，可前往 GitHub 查看程式碼。"}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground tabular-nums">
          {repo.language && (
            <span className="mr-auto inline-flex items-center gap-1.5">
              <span
                className="size-2.25 rounded-full"
                style={{ backgroundColor: colors[repo.language]?.color ?? "var(--brand)" }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
          )}
          <span role="img" className="inline-flex items-center gap-1" aria-label={`${repo.stargazers_count} stars`}>
            <Star size={14} aria-hidden="true" />
            {repo.stargazers_count}
          </span>
          <span role="img" className="inline-flex items-center gap-1" aria-label={`${repo.forks} forks`}>
            <GitFork size={14} aria-hidden="true" />
            {repo.forks}
          </span>
        </div>
      </Card>
    </a>
  );
}
