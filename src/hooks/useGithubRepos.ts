import { Octokit } from "@octokit/core";
import { useCallback, useEffect, useState } from "react";

/**
 * This is a hook for fetching the basic information from my GitHub repos
 */
export interface Repo {
  name: string;
  forks: number;
  language: string | null;
  stargazers_count: number;
  description: string | null;
  html_url: string;
}

export interface UseGithubReposReturn {
  repos: Repo[];
  loading: boolean;
  hasError: boolean;
}

export function useGithubRepos(username: string): UseGithubReposReturn {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const getLatestReposInfo = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);
      const octokit = new Octokit({});
      const results = await octokit.request("GET /users/{username}/repos", {
        username,
        sort: "updated",
        per_page: 15,
      });

      const reposInfo: Repo[] = results.data.map((repo: any) => ({
        name: repo.name,
        forks: repo.forks,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        description: repo.description,
        html_url: repo.html_url,
      }));

      setRepos(reposInfo);
    } catch (error) {
      setHasError(true);
      console.error("Error fetching GitHub repos:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    getLatestReposInfo();
  }, [getLatestReposInfo]);

  return { repos, loading, hasError };
}
