import useIsBrowser from "@docusaurus/useIsBrowser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Repo {
  name: string;
  forks: number;
  language: string | null;
  stargazers_count: number;
  description: string | null;
  html_url: string;
}
export const REPOS_PER_PAGE = 9;
export function useGithubRepos(username: string) {
  const query = useQuery({
    queryKey: ["github", "repos", username],
    queryFn: async ({ signal }) => {
      const repos: Repo[] = [];
      let page = 1;
      // 先讀取所有 API 分頁，再發布完整清單，
      // 讓語言篩選與前端分頁使用同一份完整資料。
      while (true) {
        const { data, headers } = await axios.get<Repo[]>(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&page=${page}`,
          // 所有分頁共用 Query 的取消通知，取消後不繼續下載剩餘頁面。
          { signal, timeout: 15000 },
        );
        repos.push(...data);
        if (!/rel="next"/.test(headers.link ?? "")) break;
        page += 1;
      }
      return repos;
    },
    enabled: useIsBrowser(),
    staleTime: 5 * 60 * 1000,
    // 產生靜態 HTML 的 Node 程序不建立快取回收計時器，避免建置完成後仍持續等待。
    // 瀏覽器則在清單不再被使用後，保留快取一小時。
    gcTime: typeof window === "undefined" ? Infinity : 60 * 60 * 1000,
  });
  return {
    repos: query.data ?? [],
    loading: query.isPending,
    fetching: query.isFetching,
    hasError: query.isError,
    refetch: query.refetch,
  };
}
