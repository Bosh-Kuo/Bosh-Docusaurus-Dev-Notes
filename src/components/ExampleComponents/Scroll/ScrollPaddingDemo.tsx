import type React from "react";
import { useRef } from "react";

const ScrollPaddingDemo: React.FC = () => {
  const noPaddingRef = useRef<HTMLDivElement>(null);
  const withPaddingRef = useRef<HTMLDivElement>(null);
  const scrollToSection = (
    containerRef: React.RefObject<HTMLDivElement>,
    sectionId: string,
    event: React.MouseEvent,
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
      const hasScrollPadding = container.classList.contains("[scroll-padding-top:60px]");
      // 計算 section 相對於 container 內容區域的位置
      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const relativeTop = sectionRect.top - containerRect.top + container.scrollTop;
      // 如果有 scroll-padding，減去 sticky nav 的高度
      const scrollTop = hasScrollPadding ? relativeTop - stickyNavHeight : relativeTop;
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
      content: "這是第一節的內容。注意觀察左側容器滾動時，內容會被固定標題列遮擋。",
    },
    {
      id: "section2",
      title: "Features",
      content: "這是第二節的內容。右側容器使用 scroll-padding-top 保留 60px 緩衝空間，內容不會被遮擋。",
    },
    {
      id: "section3",
      title: "Documentation",
      content: "這是第三節的內容。scroll-padding-top 特別適合有固定標題列的情境。",
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
    <div className="rounded-2xl [border:1px_solid_rgba(15,23,42,0.12)] p-6 [background:radial-gradient(circle_at_top_right,rgba(96,165,250,0.25),transparent_55%),#fff] flex flex-col gap-4">
      <div className="mb-6 [&_h3]:mb-2 [&_p]:text-(--ifm-color-emphasis-700) [&_p]:m-0 [&_p]:leading-[1.6] [&_code]:[background:var(--ifm-code-background)] [&_code]:p-[0.2rem_0.4rem] [&_code]:rounded-lg [&_code]:text-[0.9em]">
        <h3>Scroll Padding Demo</h3>
        <p>
          點擊導航按鈕，比較有無 <code>scroll-padding-top</code> 的滾動效果差異。 前者內容會被固定標題遮擋，後者則會保留
          60px 緩衝空間。
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-4">
        <div className="flex flex-col">
          <div className="mb-3 [&_h4]:m-[0_0_0.5rem_0] [&_h4]:text-[1rem] [&_h4]:text-(--ifm-color-emphasis-900) [&_code]:inline-block [&_code]:[background:var(--ifm-code-background)] [&_code]:p-[0.3rem_0.6rem] [&_code]:rounded-lg [&_code]:text-[0.85em] [&_code]:text-(--ifm-color-primary)">
            <h4>無 scroll-padding</h4>
            <code>scroll-padding-top: 0</code>
          </div>
          <div
            className="relative h-100 overflow-y-auto [border:2px_solid_var(--ifm-color-emphasis-300)] rounded-[6px] [background:white]"
            ref={noPaddingRef}
          >
            <div className="sticky top-0 z-10 flex gap-1 p-2 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] [border-bottom:2px_solid_var(--ifm-color-primary-darker)] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)]">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(e) => scrollToSection(noPaddingRef, section.id, e)}
                  className="flex-1 p-[0.4rem_0.6rem] [background:rgba(255,255,255,0.2)] text-[white] [border:1px_solid_rgba(255,255,255,0.3)] rounded-lg cursor-pointer text-[0.75rem] font-medium [transition:all_0.2s] whitespace-nowrap overflow-hidden text-ellipsis min-w-0 [&:hover]:[background:rgba(255,255,255,0.3)] [&:hover]:border-[rgba(255,255,255,0.5)] active:[background:rgba(255,255,255,0.4)]"
                  type="button"
                >
                  {section.title}
                </button>
              ))}
            </div>
            <div className="p-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="p-[1rem_0] [&_h5]:m-[0_0_0.75rem_0] [&_h5]:text-(--ifm-color-primary) [&_h5]:text-[1.25rem] [&_h5]:font-semibold [&_p]:m-[0.5rem_0] [&_p]:text-(--ifm-color-emphasis-800) [&_p]:leading-[1.6]"
                >
                  <h5>{section.title}</h5>
                  <p>{section.content}</p>
                  <p className="text-(--ifm-color-emphasis-600) text-[0.9rem]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                  <p className="text-(--ifm-color-emphasis-600) text-[0.9rem]">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                  </p>
                  {index < sections.length - 1 && (
                    <div className="m-[1.5rem_0] h-px [background:linear-gradient(to_right,transparent,var(--ifm-color-emphasis-300),transparent)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 [&_h4]:m-[0_0_0.5rem_0] [&_h4]:text-[1rem] [&_h4]:text-(--ifm-color-emphasis-900) [&_code]:inline-block [&_code]:[background:var(--ifm-code-background)] [&_code]:p-[0.3rem_0.6rem] [&_code]:rounded-lg [&_code]:text-[0.85em] [&_code]:text-(--ifm-color-primary)">
            <h4>有 scroll-padding</h4>
            <code>scroll-padding-top: 60px</code>
          </div>
          <div
            className="relative h-100 overflow-y-auto [border:2px_solid_var(--ifm-color-emphasis-300)] rounded-[6px] [background:white] scroll-pt-15"
            ref={withPaddingRef}
          >
            <div className="sticky top-0 z-10 flex gap-1 p-2 [background:linear-gradient(135deg,var(--ifm-color-primary),var(--ifm-color-primary-dark))] [border-bottom:2px_solid_var(--ifm-color-primary-darker)] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)]">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(e) => scrollToSection(withPaddingRef, section.id, e)}
                  className="flex-1 p-[0.4rem_0.6rem] [background:rgba(255,255,255,0.2)] text-[white] [border:1px_solid_rgba(255,255,255,0.3)] rounded-lg cursor-pointer text-[0.75rem] font-medium [transition:all_0.2s] whitespace-nowrap overflow-hidden text-ellipsis min-w-0 [&:hover]:[background:rgba(255,255,255,0.3)] [&:hover]:border-[rgba(255,255,255,0.5)] active:[background:rgba(255,255,255,0.4)]"
                  type="button"
                >
                  {section.title}
                </button>
              ))}
            </div>
            <div className="p-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="p-[1rem_0] [&_h5]:m-[0_0_0.75rem_0] [&_h5]:text-(--ifm-color-primary) [&_h5]:text-[1.25rem] [&_h5]:font-semibold [&_p]:m-[0.5rem_0] [&_p]:text-(--ifm-color-emphasis-800) [&_p]:leading-[1.6]"
                >
                  <h5>{section.title}</h5>
                  <p>{section.content}</p>
                  <p className="text-(--ifm-color-emphasis-600) text-[0.9rem]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                  <p className="text-(--ifm-color-emphasis-600) text-[0.9rem]">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                  </p>
                  {index < sections.length - 1 && (
                    <div className="m-[1.5rem_0] h-px [background:linear-gradient(to_right,transparent,var(--ifm-color-emphasis-300),transparent)]" />
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
