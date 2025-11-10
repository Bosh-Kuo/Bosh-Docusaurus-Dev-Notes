import React, { useState } from "react";
import styles from "./GridTemplateAreasExample.module.css";

interface GridTemplateAreasExampleProps {
  title?: string;
  description?: string;
}

function GridTemplateAreasExample({
  title = "Grid Template Areas 範例",
  description,
}: GridTemplateAreasExampleProps) {
  const [templateAreas, setTemplateAreas] = useState(
    `"header header header"
"sidebar main main"
"footer footer footer"`
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}

      {/* 控制面板 */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>grid-template-areas:</label>
          <textarea
            value={templateAreas}
            onChange={(e) => setTemplateAreas(e.target.value)}
            rows={5}
            placeholder='e.g., "header header header"&#10;"sidebar main main"&#10;"footer footer footer"'
          />
        </div>
      </div>

      {/* 預設範本按鈕 */}
      <div className={styles.templates}>
        <button
          onClick={() =>
            setTemplateAreas(
              `"header header header"
"sidebar main main"
"footer footer footer"`
            )
          }
        >
          經典佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(
              `"header header header header"
"sidebar main main aside"
"footer footer footer footer"`
            )
          }
        >
          三欄佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(
              `"header header"
"main sidebar"
"main footer"`
            )
          }
        >
          側邊欄佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(
              `"nav nav nav"
"content content sidebar"
"content content sidebar"
"footer footer footer"`
            )
          }
        >
          內容為主佈局
        </button>
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className={styles.codeBlock}>
        <code>
          {`.container {
  display: grid;
  grid-template-columns: repeat(${templateAreas.split("\n")[0].split(" ").length}, 1fr);
  grid-template-areas:
    ${templateAreas.split("\n").map((line) => line.trim()).join("\n    ")};
  gap: 10px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
.nav { grid-area: nav; }
.content { grid-area: content; }`}
        </code>
      </div>

      {/* Grid 容器與項目 */}
      <div
        className={styles.gridContainer}
        style={{
          gridTemplateAreas: templateAreas,
          gridTemplateColumns: `repeat(${templateAreas.split("\n")[0].split(" ").length}, 1fr)`,
        }}
      >
        {/* 根據 templateAreas 動態渲染區域 */}
        {Array.from(
          new Set(
            templateAreas
              .split("\n")
              .flatMap((line) =>
                line
                  .replace(/"/g, "")
                  .trim()
                  .split(/\s+/)
              )
              .filter((area) => area && area !== ".")
          )
        ).map((area) => (
          <div
            key={area}
            className={`${styles.gridItem} ${styles[area]}`}
            style={{ gridArea: area }}
          >
            {area}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridTemplateAreasExample;
