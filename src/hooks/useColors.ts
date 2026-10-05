import useIsBrowser from "@docusaurus/useIsBrowser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export interface GithubColor {
  color: string;
  url: string;
}
export interface GithubColors {
  [key: string]: GithubColor;
}
export function useColors() {
  const query = useQuery({
    queryKey: ["github", "language-colors"],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<GithubColors>(
        "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
        {
          // 將 Query 的取消通知交給 Axios，中止已不再需要的請求。
          signal,
          timeout: 15000,
        },
      );
      return data;
    },
    enabled: useIsBrowser(),
    staleTime: 7 * 24 * 60 * 60 * 1000,
    // 產生靜態 HTML 的 Node 程序不建立快取回收計時器，避免建置完成後仍持續等待。
    // 瀏覽器則保留未使用的顏色快取七天，減少重複下載。
    gcTime: typeof window === "undefined" ? Infinity : 7 * 24 * 60 * 60 * 1000,
  });
  return { colors: query.data ?? {}, hasError: query.isError };
}
