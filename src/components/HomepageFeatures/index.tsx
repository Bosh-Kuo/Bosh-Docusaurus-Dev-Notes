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
    title: "技術雜談與實作紀錄",
    Svg: require("@site/static/img/undraw_blogging.svg").default,
    description: (
      <>
        <Link to='/blog'>部落格</Link>{" "}
        匯集了各種非特定技術類型的專題文章，並記錄了我在開發過程中遇到的問題與解決方案。
      </>
    ),
  },
  {
    title: "輸出式學習，以筆記內化知識",
    Svg: require("@site/static/img/storyset_notes.svg").default,
    description: (
      <>
        <Link to='/docs'>筆記</Link>{" "}
        為一個一站式的技術筆記資源中心，裡面收錄了我在學習各種技術時所記錄下的重要觀念與知識點。
      </>
    ),
  },
  {
    title: "近期專案",
    Svg: require("@site/static/img/undraw_programming.svg").default,
    description: (
      <>
        <Link to='/projects'>近期專案</Link> 收錄了近期我在 Github
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
