import React, { useRef } from "react";
import styles from "./ScrollPaddingDemo.module.css";

const ScrollPaddingDemo: React.FC = () => {
  const noPaddingRef = useRef<HTMLDivElement>(null);
  const withPaddingRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (
    containerRef: React.RefObject<HTMLDivElement>,
    sectionId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const section = container.querySelector(`#${sectionId}`) as HTMLElement;
    if (section) {
      // 手動計算滾動位置來模擬 scroll-padding 的效果
      // 左側容器：直接滾動到 section 頂部
      // 右側容器：滾動到 section 頂部 - 60px (sticky nav 高度)
      const stickyNavHeight = 60; // 與 CSS 中的 scroll-padding-top 一致
      const hasScrollPadding = container.classList.contains(styles.withPadding);

      // 計算 section 相對於 container 內容區域的位置
      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const relativeTop =
        sectionRect.top - containerRect.top + container.scrollTop;

      // 如果有 scroll-padding，減去 sticky nav 的高度
      const scrollTop = hasScrollPadding
        ? relativeTop - stickyNavHeight
        : relativeTop;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  const sections = [
    {
      id: "section1",
      title: "Introduction",
      content:
        "這是第一節的內容。注意觀察左側容器滾動時，內容會被固定標題列遮擋。",
    },
    {
      id: "section2",
      title: "Features",
      content:
        "這是第二節的內容。右側容器使用 scroll-padding-top 保留 60px 緩衝空間，內容不會被遮擋。",
    },
    {
      id: "section3",
      title: "Documentation",
      content:
        "這是第三節的內容。scroll-padding-top 特別適合有固定標題列的情境。",
    },
    {
      id: "section4",
      title: "Examples",
      content: "這是第四節的內容。點擊導航按鈕可以清楚看到兩者的差異。",
    },
    {
      id: "section5",
      title: "API Reference",
      content: "這是第五節的內容。左側內容會被標題遮住，右側則保持可見。",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>Scroll Padding Demo</h3>
        <p>
          點擊導航按鈕，比較有無 <code>scroll-padding-top</code>{" "}
          的滾動效果差異。 前者內容會被固定標題遮擋，後者則會保留 60px
          緩衝空間。
        </p>
      </div>

      <div className={styles.containers}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h4>無 scroll-padding</h4>
            <code>scroll-padding-top: 0</code>
          </div>
          <div className={styles.scrollContainer} ref={noPaddingRef}>
            <div className={styles.stickyNav}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(e) => scrollToSection(noPaddingRef, section.id, e)}
                  className={styles.navButton}
                >
                  {section.title}
                </button>
              ))}
            </div>
            <div className={styles.content}>
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={styles.section}
                >
                  <h5>{section.title}</h5>
                  <p>{section.content}</p>
                  <p className={styles.filler}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p className={styles.filler}>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  {index < sections.length - 1 && (
                    <div className={styles.divider} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h4>有 scroll-padding</h4>
            <code>scroll-padding-top: 60px</code>
          </div>
          <div
            className={`${styles.scrollContainer} ${styles.withPadding}`}
            ref={withPaddingRef}
          >
            <div className={styles.stickyNav}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(e) =>
                    scrollToSection(withPaddingRef, section.id, e)
                  }
                  className={styles.navButton}
                >
                  {section.title}
                </button>
              ))}
            </div>
            <div className={styles.content}>
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={styles.section}
                >
                  <h5>{section.title}</h5>
                  <p>{section.content}</p>
                  <p className={styles.filler}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p className={styles.filler}>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  {index < sections.length - 1 && (
                    <div className={styles.divider} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollPaddingDemo;
