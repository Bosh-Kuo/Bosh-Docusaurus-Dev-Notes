import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";

/**
 * This is a hook for fetching the basic information from my GitHub repos
 */
interface Repo {
  name: string;
  forks: number;
  language: string;
  stargazers_count: number;
  description: string;
  html_url: string;
}
function useGithubRepos(user) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [hasError, setHasError] = useState(false);

  async function getLatestReposInfo() {
    try {
      const octokit = new Octokit({});
      const results = await octokit.request("GET /users/{username}/repos", {
        username: user,
        sort: "updated",
        per_page: 15,
      });

      const ReposInfo = results.data.map((repo) => ({
        name: repo.name,
        forks: repo.forks,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        description: repo.description,
        html_url: repo.html_url,
      }));
      setRepos(ReposInfo);
    } catch (error) {
      setHasError(true);
      console.log(error);
    }
  }
  useEffect(() => {
    getLatestReposInfo();
  }, []);

  return { repos, hasError };
}

export default useGithubRepos;
