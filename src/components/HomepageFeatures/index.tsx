import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};
const FeatureList: FeatureItem[] = [
  {
    title: "用最簡單的方式理解複雜問題",
    Svg: require("@site/static/img/undraw_learning.svg").default,
    description: (
      <>
        這個網站記錄我的學習旅程，我會嘗試透過簡單易懂的言語，記錄並整理學習中遇到的複雜問題，享受學習的樂趣。
      </>
    ),
  },
  {
    title: "隨時記錄，隨時學習",
    Svg: require("@site/static/img/undraw_code_review_review.svg").default,
    description: (
      <>
        <Link to='/docs'>Docs</Link>{" "}
        為一個一站式的技術筆記資源中心，裡面收錄了我在工作與學習時所記錄下的筆記。
      </>
    ),
  },
  {
    title: "近期專案",
    Svg: require("@site/static/img/undraw_programming.svg").default,
    description: (
      <>
        <Link to='/projects'>Projects</Link> 收錄集結了我最近在 Github
        上更新的專案，我的專案目前主要與 Web 開發和深度學習等相關領域有關。
      </>
    ),
  },
];

function Feature({ Svg, title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
