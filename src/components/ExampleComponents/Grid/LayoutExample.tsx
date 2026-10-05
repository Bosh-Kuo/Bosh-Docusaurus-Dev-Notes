import { cn } from "cn";

interface LayoutExampleProps {
  title?: string;
  type: "holy-grail" | "card-grid" | "gallery";
}
function LayoutExample({ title, type }: LayoutExampleProps) {
  const renderHolyGrail = () => (
    <div className="grid grid-cols-[150px_1fr_150px] grid-rows-[auto_1fr_auto] [grid-template-areas:'header_header_header'_'sidebar_main_aside'_'footer_footer_footer'] min-h-100 gap-2.5 p-4 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
      <div className="[grid-area:header] flex items-center justify-center p-4 [background:linear-gradient(135deg,#667eea,#764ba2)] text-[white] [font-weight:bold] rounded-lg">
        Header
      </div>
      <div className="[grid-area:sidebar] flex items-center justify-center p-4 [background:linear-gradient(135deg,#f093fb,#f5576c)] text-[white] [font-weight:bold] rounded-lg">
        Sidebar
      </div>
      <div className="[grid-area:main] flex items-center justify-center p-8 [background:linear-gradient(135deg,#4facfe,#00f2fe)] text-[white] [font-weight:bold] rounded-lg">
        Main Content
      </div>
      <div className="[grid-area:aside] flex items-center justify-center p-4 [background:linear-gradient(135deg,#43e97b,#38f9d7)] text-[white] [font-weight:bold] rounded-lg">
        Aside
      </div>
      <div className="[grid-area:footer] flex items-center justify-center p-4 [background:linear-gradient(135deg,#fa709a,#fee140)] text-[white] [font-weight:bold] rounded-lg">
        Footer
      </div>
    </div>
  );
  const renderCardGrid = () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-6 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: 範例與骨架的固定編號不會重新排序，也不保存個別項目的狀態。
          key={i}
          className="flex items-center justify-center min-h-37.5 p-6 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] [font-weight:bold] text-[1.1rem] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[translateY(-4px)]"
        >
          Card {i + 1}
        </div>
      ))}
    </div>
  );
  const renderGallery = () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] auto-rows-30 gap-3 p-4 bg-(--ifm-color-emphasis-50) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: 範例與骨架的固定編號不會重新排序，也不保存個別項目的狀態。
          key={i}
          className={cn(
            "flex items-center justify-center [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] text-[white] [font-weight:bold] text-[1.5rem] rounded-lg [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:transform_0.2s] [&:hover]:transform-[scale(1.05)] [&.ui-components-examplecomponents-grid-layoutexample-large]:col-[span_2] [&.ui-components-examplecomponents-grid-layoutexample-large]:row-[span_2]",
            (i + 1) % 3 === 0 ? "ui-components-examplecomponents-grid-layoutexample-large" : "",
          )}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
  return (
    <div className="m-[1.5rem_0]">
      {title && <h4 className="mt-0 mb-4 text-(--ifm-color-emphasis-800) text-[1rem] font-semibold">{title}</h4>}
      {type === "holy-grail" && renderHolyGrail()}
      {type === "card-grid" && renderCardGrid()}
      {type === "gallery" && renderGallery()}
    </div>
  );
}
export default LayoutExample;
