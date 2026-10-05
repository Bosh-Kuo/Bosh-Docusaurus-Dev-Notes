import { useState } from "react";

interface GridItemExampleProps {
  title?: string;
  description?: string;
  showControls?: "gridColumn" | "gridRow" | "gridArea" | "justifySelf" | "alignSelf" | "all";
}
const justifySelfOptions = [
  { value: "auto", label: "auto" },
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];
const alignSelfOptions = [
  { value: "auto", label: "auto" },
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
];
const gridColumnOptions = [
  { value: "1 / 2", label: "1 / 2" },
  { value: "1 / 3", label: "1 / 3" },
  { value: "1 / 4", label: "1 / 4" },
  { value: "2 / 3", label: "2 / 3" },
  { value: "2 / 4", label: "2 / 4" },
  { value: "3 / 4", label: "3 / 4" },
  { value: "1 / span 2", label: "1 / span 2" },
  { value: "2 / span 2", label: "2 / span 2" },
];
const gridRowOptions = [
  { value: "1 / 2", label: "1 / 2" },
  { value: "1 / 3", label: "1 / 3" },
  { value: "2 / 3", label: "2 / 3" },
  { value: "1 / span 2", label: "1 / span 2" },
  { value: "2 / span 2", label: "2 / span 2" },
];
function GridItemExample({ title = "Grid Item 範例", description, showControls = "all" }: GridItemExampleProps) {
  // Item 1 狀態
  const [gridColumn1, setGridColumn1] = useState("1 / 3");
  const [gridRow1, setGridRow1] = useState("1 / 2");
  const [justifySelf1, setJustifySelf1] = useState("stretch");
  const [alignSelf1, setAlignSelf1] = useState("stretch");
  // Item 2 狀態
  const [gridColumn2, setGridColumn2] = useState("3 / 4");
  const [gridRow2, setGridRow2] = useState("1 / 3");
  const [justifySelf2, setJustifySelf2] = useState("stretch");
  const [alignSelf2, setAlignSelf2] = useState("stretch");
  // Item 3 狀態
  const [gridColumn3, setGridColumn3] = useState("1 / 2");
  const [gridRow3, setGridRow3] = useState("2 / 3");
  const [justifySelf3, setJustifySelf3] = useState("stretch");
  const [alignSelf3, setAlignSelf3] = useState("stretch");
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      {/* 控制面板 */}
      <div className="flex flex-wrap gap-6 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
        {/* Item 1 控制 */}
        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-200)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-(--ifm-color-primary) [&_h4]:text-[1rem] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 1</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-column:</span>
              <select value={gridColumn1} onChange={(e) => setGridColumn1(e.target.value)}>
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-row:</span>
              <select value={gridRow1} onChange={(e) => setGridRow1(e.target.value)}>
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">justify-self:</span>
              <select value={justifySelf1} onChange={(e) => setJustifySelf1(e.target.value)}>
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">align-self:</span>
              <select value={alignSelf1} onChange={(e) => setAlignSelf1(e.target.value)}>
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Item 2 控制 */}
        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-200)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-(--ifm-color-primary) [&_h4]:text-[1rem] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 2</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-column:</span>
              <select value={gridColumn2} onChange={(e) => setGridColumn2(e.target.value)}>
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-row:</span>
              <select value={gridRow2} onChange={(e) => setGridRow2(e.target.value)}>
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">justify-self:</span>
              <select value={justifySelf2} onChange={(e) => setJustifySelf2(e.target.value)}>
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">align-self:</span>
              <select value={alignSelf2} onChange={(e) => setAlignSelf2(e.target.value)}>
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Item 3 控制 */}
        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-200)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-(--ifm-color-primary) [&_h4]:text-[1rem] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 3</h4>
          {(showControls === "all" || showControls === "gridColumn") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-column:</span>
              <select value={gridColumn3} onChange={(e) => setGridColumn3(e.target.value)}>
                {gridColumnOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "gridRow") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">grid-row:</span>
              <select value={gridRow3} onChange={(e) => setGridRow3(e.target.value)}>
                {gridRowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "justifySelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">justify-self:</span>
              <select value={justifySelf3} onChange={(e) => setJustifySelf3(e.target.value)}>
                {justifySelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(showControls === "all" || showControls === "alignSelf") && (
            <div className="flex flex-col gap-1 mb-3 last:mb-0 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_select]:p-[0.4rem] [&_select]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_select]:rounded-lg [&_select]:bg-(--ifm-background-color) [&_select]:text-(--ifm-font-color-base) [&_select]:text-[0.9rem] [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_select:focus]:[outline:none] [&_select:focus]:border-(--ifm-color-primary) [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
              <span className="block mb-2 text-sm font-medium">align-self:</span>
              <select value={alignSelf3} onChange={(e) => setAlignSelf3(e.target.value)}>
                {alignSelfOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className="mb-4 p-4 bg-(--ifm-code-background) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_code]:block [&_code]:[font-family:var(--ifm-font-family-monospace)] [&_code]:text-[0.9rem] [&_code]:text-(--ifm-color-emphasis-900) [&_code]:whitespace-pre [&_code]:leading-[1.6] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <code>
          {`/* Item 1 */
.item1 {
  grid-column: ${gridColumn1};
  grid-row: ${gridRow1};
  justify-self: ${justifySelf1};
  align-self: ${alignSelf1};
}

/* Item 2 */
.item2 {
  grid-column: ${gridColumn2};
  grid-row: ${gridRow2};
  justify-self: ${justifySelf2};
  align-self: ${alignSelf2};
}

/* Item 3 */
.item3 {
  grid-column: ${gridColumn3};
  grid-row: ${gridRow3};
  justify-self: ${justifySelf3};
  align-self: ${alignSelf3};
}`}
        </code>
      </div>

      {/* Grid 容器與項目 */}
      <div className="grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(2,150px)] gap-2.5 p-4 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <div
          className="flex items-center justify-center p-4 text-[white] [font-weight:bold] text-[1.5rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)] [background:linear-gradient(135deg,#667eea,#764ba2)]"
          style={{
            gridColumn: gridColumn1,
            gridRow: gridRow1,
            justifySelf: justifySelf1 as React.CSSProperties["justifySelf"],
            alignSelf: alignSelf1 as React.CSSProperties["alignSelf"],
          }}
        >
          1
        </div>
        <div
          className="flex items-center justify-center p-4 text-[white] [font-weight:bold] text-[1.5rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)] [background:linear-gradient(135deg,#f093fb,#f5576c)]"
          style={{
            gridColumn: gridColumn2,
            gridRow: gridRow2,
            justifySelf: justifySelf2 as React.CSSProperties["justifySelf"],
            alignSelf: alignSelf2 as React.CSSProperties["alignSelf"],
          }}
        >
          2
        </div>
        <div
          className="flex items-center justify-center p-4 text-[white] [font-weight:bold] text-[1.5rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)] [background:linear-gradient(135deg,#4facfe,#00f2fe)]"
          style={{
            gridColumn: gridColumn3,
            gridRow: gridRow3,
            justifySelf: justifySelf3 as React.CSSProperties["justifySelf"],
            alignSelf: alignSelf3 as React.CSSProperties["alignSelf"],
          }}
        >
          3
        </div>
      </div>
    </div>
  );
}
export default GridItemExample;
