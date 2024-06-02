import React from "react";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import RepoCard from "../../components/RepoCard";
import useGithubRepos from "../../hooks/useGithubRepos";

export default function Projects(): JSX.Element {
  const user = "Bosh-Kuo"; // 指定使用者名稱
  const { repos, hasError: loadingRepoError } = useGithubRepos(user);

  return (
    <Layout
      title='My Projects'
      description='My latest updated github repositories'
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
              {repos.length > 0 ? (
                repos.map((repo, i) => <RepoCard key={i} repo={repo} />)
              ) : (
                <p>Loading Page...</p>
              )}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
}
