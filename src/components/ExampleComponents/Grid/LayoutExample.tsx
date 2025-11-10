import React from "react";
import styles from "./LayoutExample.module.css";

interface LayoutExampleProps {
  title?: string;
  type: "holy-grail" | "card-grid" | "gallery";
}

function LayoutExample({ title, type }: LayoutExampleProps) {
  const renderHolyGrail = () => (
    <div className={styles.holyGrailContainer}>
      <div className={styles.header}>Header</div>
      <div className={styles.sidebar}>Sidebar</div>
      <div className={styles.main}>Main Content</div>
      <div className={styles.aside}>Aside</div>
      <div className={styles.footer}>Footer</div>
    </div>
  );

  const renderCardGrid = () => (
    <div className={styles.cardGridContainer}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={styles.card}>
          Card {i + 1}
        </div>
      ))}
    </div>
  );

  const renderGallery = () => (
    <div className={styles.galleryContainer}>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`${styles.galleryItem} ${
            (i + 1) % 3 === 0 ? styles.large : ""
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {type === "holy-grail" && renderHolyGrail()}
      {type === "card-grid" && renderCardGrid()}
      {type === "gallery" && renderGallery()}
    </div>
  );
}

export default LayoutExample;
