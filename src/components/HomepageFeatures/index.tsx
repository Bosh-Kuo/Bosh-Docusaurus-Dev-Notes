import Link from "@docusaurus/Link";
import { ArrowUpRight } from "lucide-react";
import type React from "react";

const features = [
  {
    title: "技術雜談與實作紀錄",
    to: "/blog",
    link: "閱讀部落格",
    description: "部落格匯集了各種非特定技術類型的專題文章，並記錄了我在開發過程中遇到的問題與解決方案。",
  },
  {
    title: "輸出式學習，以筆記內化知識",
    to: "/docs",
    link: "探索筆記",
    description: "筆記為一個一站式的技術筆記資源中心，裡面收錄了我在學習各種技術時所記錄下的重要觀念與知識點。",
  },
  {
    title: "近期專案",
    to: "/projects",
    link: "查看近期專案",
    description: "近期專案收錄了近期我在 GitHub 上更新的專案，我的專案目前主要與 Web 開發和深度學習等相關領域有關。",
  },
];
export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section
      className="grid grid-cols-[repeat(3,1fr)] gap-10 [border-top:1px_solid_var(--border)] p-[3rem_0_4rem] [@media(max-width:_720px)]:grid-cols-[1fr] [@media(max-width:_720px)]:gap-8 [@media(max-width:_720px)]:pb-12"
      aria-label="關於本站"
    >
      {features.map((feature) => (
        <div
          key={feature.to}
          className="flex flex-col [&_h2]:text-[1rem] [&_h2]:font-semibold [&_h2]:leading-[1.6] [&_h2]:mb-3.5 [&_p]:text-[0.875rem] [&_p]:leading-[1.85] [&_p]:text-muted-foreground [&_p]:mb-5 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:text-[0.8125rem] [&_a]:text-foreground [&_a]:mt-auto [&_a]:self-start"
        >
          <h2>{feature.title}</h2>
          <p>{feature.description}</p>
          <Link to={feature.to}>
            {feature.link}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ))}
    </section>
  );
}
