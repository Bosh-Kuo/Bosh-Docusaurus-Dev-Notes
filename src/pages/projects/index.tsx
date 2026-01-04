import React from "react";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import RepoCard from "@site/src/components/RepoCard";
import { useGithubRepos } from "@site/src/hooks/useGithubRepos";

export default function Projects(): JSX.Element {
  const user = "Bosh-Kuo"; // 指定使用者名稱
  const { repos, loading, hasError: loadingRepoError } = useGithubRepos(user);

  return (
    <Layout
      title="My Projects"
      description="My latest updated github repositories"
    >
      {loadingRepoError ? (
        <div className={styles.projects_container}>
          <h1>Loading Error...</h1>
        </div>
      ) : (
        <div className={styles.projects_container}>
          <h1>My Projects</h1>
          <h3>My latest updated github repositories</h3>
          <section>
            <div>
              {loading ? (
                <p>Loading Page...</p>
              ) : repos.length > 0 ? (
                repos.map((repo, i) => <RepoCard key={i} repo={repo} />)
              ) : (
                <p>No repositories found.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
}
