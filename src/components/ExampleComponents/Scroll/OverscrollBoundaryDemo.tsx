import { cn } from "cn";
import type React from "react";

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
    <div className="rounded-2xl [border:1px_solid_rgba(15,23,42,0.12)] p-6 [background:radial-gradient(circle_at_top_right,rgba(96,165,250,0.25),transparent_55%),#fff] flex flex-col gap-4">
      <div>
        <h3>Overscroll Boundary Demo</h3>
        <p>滾動右方卡片，感受 scroll chaining 與 overscroll-behavior 的差異。</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 [&_section]:rounded-[0.75rem] [&_section]:[border:1px_solid_rgba(148,163,184,0.6)] [&_section]:[background:rgba(255,255,255,0.9)] [&_section]:p-4 [&_section]:flex [&_section]:flex-col [&_section]:gap-3 [&_section_header]:flex [&_section_header]:flex-col [&_section_header]:items-start [&_section_header]:gap-[0.35rem] [&_section_header_h4]:m-0 [&_section_header_code]:[background:rgba(15,23,42,0.06)] [&_section_header_code]:rounded-[999px] [&_section_header_code]:p-[0.15rem_0.75rem] [&_section_header_code]:text-[0.85rem] [&_section_header_code]:font-semibold [&_section_header_code]:text-(--ifm-color-emphasis-900) [&_section_header_code]:inline-flex [&_section_header_p]:m-[0.15rem_0_0] [&_section_header_p]:text-(--ifm-color-emphasis-700)">
        {columns.map((column) => (
          <section key={column.behavior}>
            <header>
              <h4>{column.title}</h4>
              <code>overscroll-behavior: {column.behavior}</code>
              <p>{column.description}</p>
            </header>
            <div className="rounded-[0.75rem] [border:1px_dashed_rgba(59,130,246,0.5)] p-3 [background:rgba(59,130,246,0.04)] max-h-65 overflow-y-auto">
              <div
                className={cn(
                  "max-h-80 p-4 rounded-[0.75rem] [border:1px_solid_rgba(15,23,42,0.08)] [background:#fff] overflow-y-auto overscroll-auto [box-shadow:inset_0_0_0_1px_rgba(59,130,246,0.08)] [&_p]:mt-0 [&_p+p]:mt-3",
                  column.behavior === "contain"
                    ? "overscroll-contain border-[rgba(34,197,94,0.6)] [box-shadow:inset_0_0_0_1px_rgba(34,197,94,0.25)]"
                    : "",
                )}
              >
                {paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <div className="mt-4 text-center p-[0.4rem_0.8rem] rounded-[999px] [background:rgba(34,197,94,0.1)] [border:1px_solid_rgba(34,197,94,0.4)] text-[0.8rem] font-semibold">
                  內層內容底部
                </div>
              </div>
              <div className="mt-[0.6rem] text-[0.8rem] text-(--ifm-color-emphasis-600)">
                父層高度受限，可視為模態或面板。
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
export default OverscrollBoundaryDemo;
