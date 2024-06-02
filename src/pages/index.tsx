import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className='container'>
      <header className={clsx(styles.heroBanner)}>
        <div className='row'>
          <div className='col col--6'>
            <div className={styles.bkg} />
          </div>
          <div className='col col--6'>
            <div className={styles.right}>
              <h1 className='hero__title'>{siteConfig.title}</h1>
              <p className='hero__subtitle'>{siteConfig.tagline}</p>
              <div className={styles.buttons}>
                <Link
                  className={"button button--secondary button--lg"}
                  to='/docs'
                >
                  🗂 Go To Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
