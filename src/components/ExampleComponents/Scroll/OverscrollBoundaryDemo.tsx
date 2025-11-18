import React from "react";
import styles from "./OverscrollBoundaryDemo.module.css";

const paragraphs = [
  "當內層滾動容器捲到邊界時，瀏覽器預設會把剩餘的滾動動量交給外層，造成 scroll chaining。",
  "在行動裝置上這會觸發瀏覽器的彈性橡皮筋效果，讓使用者誤以為頁面已經回到頂端。",
  "overscroll-behavior 可以控制這種動量傳遞，避免模態視窗或側邊欄被非預期關閉。",
  "右側容器設定 contain 後，內層滾動到底再繼續滑，外層不會再被影響。",
];

const OverscrollBoundaryDemo: React.FC = () => {
  const columns = [
    {
      title: "預設行為",
      behavior: "auto",
      description: "繼續滑動會把滾動事件往外冒泡，造成父層跟著移動。",
    },
    {
      title: "overscroll-behavior: contain",
      behavior: "contain",
      description: "限制滾動動量，內層觸底後就停止。",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div>
        <h3>Overscroll Boundary Demo</h3>
        <p>滾動右方卡片，感受 scroll chaining 與 overscroll-behavior 的差異。</p>
      </div>
      <div className={styles.columns}>
        {columns.map((column) => (
          <section key={column.behavior}>
            <header>
              <h4>{column.title}</h4>
              <code>overscroll-behavior: {column.behavior}</code>
              <p>{column.description}</p>
            </header>
            <div className={styles.outerScroller}>
              <div
                className={`${styles.innerScroller} ${
                  column.behavior === "contain" ? styles.innerContain : ""
                }`}
              >
                {paragraphs.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
                <div className={styles.badge}>內層內容底部</div>
              </div>
              <div className={styles.footerNote}>父層高度受限，可視為模態或面板。</div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default OverscrollBoundaryDemo;
