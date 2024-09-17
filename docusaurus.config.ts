import type { Config } from "@docusaurus/types";
import plugins from "./config/plugins";
import presets from "./config/presets";
import themeConfig from "./config/themeConfig";

const config: Config = {
  // * Site metadata
  title: "Bosh 的技術探索筆記",
  tagline:
    "這裡匯集了我在軟體技術領域中的各種學習記錄與實踐經歷，分享我的觀點與問題解決過程，希望這些內容對來到這裡的你有所幫助",
  favicon: "img/favicon.ico",
  url: "https://notes.boshkuo.com", // Set the production url of your site here
  baseUrl: "/", // The path after the host, ex: https://facebook.github.io/<baseURL>/.

  // * Deployment configurations
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "bosh-kuo", // Usually your GitHub org/user name.
  projectName: "docusaurus-dev-notes", // Usually your repo name.
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // * preset configurations
  presets,

  // * plugin configurations
  plugins,

  // * theme configurations
  themeConfig,

  // * others
  // Enabling mermaid
  // reference: https://docusaurus.io/docs/markdown-features/diagrams
  themes: ["@docusaurus/theme-mermaid", "@docusaurus/theme-live-codeblock"],
  markdown: {
    mermaid: true,
  },

  // Enabling math equations
  // reference: https://docusaurus.io/docs/markdown-features/math-equations
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hant",
    locales: ["zh-Hant"],
  },

  // An array of tags that will be inserted in the HTML <head>
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "shortcut icon",
        href: "img/favicon.ico",
        type: "image/x-icon",
      },
    },
  ],
};

export default config;
