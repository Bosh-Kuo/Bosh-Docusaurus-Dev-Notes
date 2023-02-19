import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: "Learning in a simple way",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        This site record my learning journey. I try to simplifies the
        complexities of technology and makes it easy to understand and enjoy.
      </>
    ),
  },
  {
    title: "Tech insights",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        <Link to="/projects">Docs</Link> is an one-stop-shop resource hub for
        tech knowledge, offering a deep dive into some interesting topics such
        as AI and web development.
      </>
    ),
  },
  {
    title: "Projects",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        <Link to="/projects">Projects</Link> is where I showcase my recent
        works. As a software engineer, my projects are born from my desire to
        turn ideas into reality..
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
