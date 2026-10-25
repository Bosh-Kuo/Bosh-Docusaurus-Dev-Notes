import type { Config } from "@docusaurus/types";
import plugins from "./config/plugins";
import presets from "./config/presets";
import themeConfig from "./config/themeConfig";

// 每個語系會重新載入設定；網站 metadata 也要跟著切換。
const isEnglish = process.env.DOCUSAURUS_CURRENT_LOCALE === "en";
const config: Config = {
  // * 網站基本資料
  title: isEnglish ? "Bosh’s Tech Exploration Notes" : "Bosh 的技術探索筆記",
  tagline: isEnglish
    ? "Notes on software development, technical discoveries, and the process of understanding and solving problems."
    : "這裡匯集了我在軟體技術領域中的各種學習記錄與實踐經歷，分享我的觀點與問題解決過程，希望這些內容對來到這裡的你有所幫助",
  favicon: "img/favicon.ico",
  url: "https://notes.boshkuo.com", // 正式網站網址。
  baseUrl: "/", // 網址主機後的基礎路徑。

  // * 部署設定
  // GitHub Pages 部署資訊；使用其他部署方式時可省略。
  organizationName: "bosh-kuo", // GitHub 組織或使用者名稱。
  projectName: "docusaurus-dev-notes", // GitHub 儲存庫名稱。
  onBrokenLinks: "throw",
  // 原本的 CSS 壓縮流程會錯誤改寫 cascade layers，
  // 改用 Lightning CSS 保留 Tailwind v4 在正式版的 layer 順序。
  future: {
    faster: {
      lightningCssMinimizer: true,
    },
  },

  // * 預設套件設定
  presets,

  // * Plugin 設定
  plugins,

  // * 主題設定
  themeConfig,

  // * 其他設定
  // 啟用 Mermaid 圖表。
  // 參考文件：https://docusaurus.io/docs/markdown-features/diagrams
  themes: ["@docusaurus/theme-mermaid", "@docusaurus/theme-live-codeblock"],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // 啟用數學公式。
  // 參考文件：https://docusaurus.io/docs/markdown-features/math-equations
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity: "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  // 未翻譯的 docs/blog 會由官方內容 Plugin 回退至來源檔案，不必複製文章。
  i18n: {
    defaultLocale: "zh-Hant",
    locales: ["zh-Hant", "en"],
    localeConfigs: {
      "zh-Hant": { label: "繁體中文", htmlLang: "zh-Hant" },
      en: { label: "English", htmlLang: "en" },
    },
  },
};

export default config;
