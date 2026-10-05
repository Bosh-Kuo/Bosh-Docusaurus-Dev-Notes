import { cn } from "cn";
import { useState } from "react";

const areaColors: Record<string, string> = {
  header: "[background:linear-gradient(135deg,#667eea,#764ba2)]",
  sidebar: "[background:linear-gradient(135deg,#f093fb,#f5576c)]",
  main: "[background:linear-gradient(135deg,#4facfe,#00f2fe)]",
  aside: "[background:linear-gradient(135deg,#43e97b,#38f9d7)]",
  footer: "[background:linear-gradient(135deg,#fa709a,#fee140)]",
  nav: "[background:linear-gradient(135deg,#30cfd0,#330867)]",
  content: "[background:linear-gradient(135deg,#a8edea,#fed6e3)] text-[#333] in-data-[theme='dark']:text-[white]",
};
interface GridTemplateAreasExampleProps {
  title?: string;
  description?: string;
}
function GridTemplateAreasExample({ title = "Grid Template Areas 範例", description }: GridTemplateAreasExampleProps) {
  const [templateAreas, setTemplateAreas] = useState(`"header header header"
"sidebar main main"
"footer footer footer"`);
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      <div className="mb-4 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
        <div className="flex flex-col gap-2 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_textarea]:p-3 [&_textarea]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_textarea]:rounded-lg [&_textarea]:bg-(--ifm-background-color) [&_textarea]:text-(--ifm-font-color-base) [&_textarea]:[font-family:var(--ifm-font-family-monospace)] [&_textarea]:text-[0.9rem] [&_textarea]:leading-[1.6] [&_textarea]:resize-y [&_textarea:focus]:[outline:none] [&_textarea:focus]:border-(--ifm-color-primary)">
          <span className="block mb-2 text-sm font-medium">grid-template-areas:</span>
          <textarea
            value={templateAreas}
            onChange={(e) => setTemplateAreas(e.target.value)}
            rows={5}
            placeholder='e.g., "header header header"&#10;"sidebar main main"&#10;"footer footer footer"'
          />
        </div>
      </div>

      {/* 預設範本按鈕 */}
      <div className="flex flex-wrap gap-3 mb-6 [&_button]:p-[0.5rem_1rem] [&_button]:[border:1px_solid_var(--ifm-color-primary)] [&_button]:rounded-lg [&_button]:bg-(--ifm-background-color) [&_button]:text-(--ifm-color-primary) [&_button]:text-[0.9rem] [&_button]:font-medium [&_button]:cursor-pointer [&_button]:[transition:all_0.2s] [&_button:hover]:bg-(--ifm-color-primary) [&_button:hover]:text-[white]">
        <button
          onClick={() =>
            setTemplateAreas(`"header header header"
"sidebar main main"
"footer footer footer"`)
          }
          type="button"
        >
          經典佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(`"header header header header"
"sidebar main main aside"
"footer footer footer footer"`)
          }
          type="button"
        >
          三欄佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(`"header header"
"main sidebar"
"main footer"`)
          }
          type="button"
        >
          側邊欄佈局
        </button>
        <button
          onClick={() =>
            setTemplateAreas(`"nav nav nav"
"content content sidebar"
"content content sidebar"
"footer footer footer"`)
          }
          type="button"
        >
          內容為主佈局
        </button>
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className="mb-4 p-4 bg-(--ifm-code-background) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_code]:block [&_code]:[font-family:var(--ifm-font-family-monospace)] [&_code]:text-[0.9rem] [&_code]:text-(--ifm-color-emphasis-900) [&_code]:whitespace-pre [&_code]:leading-[1.6] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <code>
          {`.container {
  display: grid;
  grid-template-columns: repeat(${templateAreas.split("\n")[0].split(" ").length}, 1fr);
  grid-template-areas:
    ${templateAreas
      .split("\n")
      .map((line) => line.trim())
      .join("\n    ")};
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
        className="grid gap-2.5 min-h-100 p-4 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)"
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
              .flatMap((line) => line.replace(/"/g, "").trim().split(/\s+/))
              .filter((area) => area && area !== "."),
          ),
        ).map((area) => (
          <div
            key={area}
            className={cn(
              "flex items-center justify-center p-6 text-[white] [font-weight:bold] text-[1.2rem] uppercase rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.02)]",
              areaColors[area] ?? "",
            )}
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
