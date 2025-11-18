import React, { useState } from "react";
import styles from "./ScrollSnapDemo.module.css";

const ScrollSnapDemo: React.FC = () => {
  const [snapType, setSnapType] = useState<"none" | "mandatory" | "proximity">(
    "mandatory"
  );
  const [snapAlign, setSnapAlign] = useState<"start" | "center" | "end">(
    "start"
  );

  const cards = [
    {
      id: 1,
      title: "卡片 1",
      color: "#FF6B6B",
      description: "這是第一張卡片",
    },
    {
      id: 2,
      title: "卡片 2",
      color: "#4ECDC4",
      description: "這是第二張卡片",
    },
    {
      id: 3,
      title: "卡片 3",
      color: "#45B7D1",
      description: "這是第三張卡片",
    },
    {
      id: 4,
      title: "卡片 4",
      color: "#FFA07A",
      description: "這是第四張卡片",
    },
    {
      id: 5,
      title: "卡片 5",
      color: "#98D8C8",
      description: "這是第五張卡片",
    },
    {
      id: 6,
      title: "卡片 6",
      color: "#F7DC6F",
      description: "這是第六張卡片",
    },
  ];

  const getSnapTypeClass = () => {
    switch (snapType) {
      case "mandatory":
        return styles.snapMandatory;
      case "proximity":
        return styles.snapProximity;
      default:
        return "";
    }
  };

  const getSnapAlignClass = () => {
    switch (snapAlign) {
      case "center":
        return styles.snapCenter;
      case "end":
        return styles.snapEnd;
      default:
        return styles.snapStart;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>Scroll Snap Demo</h3>
        <p>
          調整下方選項，體驗不同的 <code>scroll-snap-type</code> 與{" "}
          <code>scroll-snap-align</code> 組合效果。
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>
            <strong>scroll-snap-type:</strong>
          </label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="snapType"
                value="none"
                checked={snapType === "none"}
                onChange={(e) =>
                  setSnapType(
                    e.target.value as "none" | "mandatory" | "proximity"
                  )
                }
              />
              none (無吸附)
            </label>
            <label>
              <input
                type="radio"
                name="snapType"
                value="mandatory"
                checked={snapType === "mandatory"}
                onChange={(e) =>
                  setSnapType(
                    e.target.value as "none" | "mandatory" | "proximity"
                  )
                }
              />
              mandatory (強制吸附)
            </label>
            <label>
              <input
                type="radio"
                name="snapType"
                value="proximity"
                checked={snapType === "proximity"}
                onChange={(e) =>
                  setSnapType(
                    e.target.value as "none" | "mandatory" | "proximity"
                  )
                }
              />
              proximity (接近時吸附)
            </label>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>
            <strong>scroll-snap-align:</strong>
          </label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="snapAlign"
                value="start"
                checked={snapAlign === "start"}
                onChange={(e) =>
                  setSnapAlign(e.target.value as "start" | "center" | "end")
                }
              />
              start (對齊開始)
            </label>
            <label>
              <input
                type="radio"
                name="snapAlign"
                value="center"
                checked={snapAlign === "center"}
                onChange={(e) =>
                  setSnapAlign(e.target.value as "start" | "center" | "end")
                }
              />
              center (對齊中央)
            </label>
            <label>
              <input
                type="radio"
                name="snapAlign"
                value="end"
                checked={snapAlign === "end"}
                onChange={(e) =>
                  setSnapAlign(e.target.value as "start" | "center" | "end")
                }
              />
              end (對齊結尾)
            </label>
          </div>
        </div>
      </div>

      <div className={styles.scrollContainerWrapper}>
        <div className={styles.currentSettings}>
          <code>scroll-snap-type: x {snapType}</code>
          <code>scroll-snap-align: {snapAlign}</code>
        </div>
        <div
          className={`${
            styles.scrollContainer
          } ${getSnapTypeClass()} ${getSnapAlignClass()}`}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={styles.card}
              style={{ backgroundColor: card.color }}
            >
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollSnapDemo;
