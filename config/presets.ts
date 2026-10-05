import type * as Preset from "@docusaurus/preset-classic";

import type { PresetConfig } from "@docusaurus/types";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const presets: PresetConfig[] = [
  [
    // 正式寫法： "@docusaurus/preset-classic"
    "classic",
    {
      // * Classic 主題
      theme: {
        customCss: ["./src/css/globals.css"],
      },
      // * 文件內容 Plugin
      docs: {
        sidebarPath: "./sidebars.ts",
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
      // * 部落格內容 Plugin
      blog: {
        path: "blog",
        routeBasePath: "blog",
        blogSidebarCount: 0,
        blogSidebarTitle: "最新文章",
        blogDescription: "部落格，分享我對各種技術議題的觀點與開發實作紀錄",
        postsPerPage: "ALL",
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        showLastUpdateTime: false,
      },
      // * Google Analytics Plugin
      gtag: {
        trackingID: "G-HF9KVZT5MF",
        anonymizeIP: true,
      },
    } satisfies Preset.Options,
  ],
];

export default presets;
