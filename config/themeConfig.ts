import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const isEnglish = process.env.DOCUSAURUS_CURRENT_LOCALE === "en";
const themeConfig = {
  // * 共用設定
  image: "img/logo.png", // 社群分享圖片，供 og:image 與 twitter:image 使用。
  announcementBar: {
    id: "announcement",
    content: isEnglish
      ? 'If these notes help you, consider giving the project a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/Bosh-Kuo/docusaurus-dev-notes">GitHub</a> ⭐️'
      : '如果我的筆記對你有幫助，歡迎到我的 <a target="_blank" rel="noopener noreferrer" href="https://github.com/Bosh-Kuo/docusaurus-dev-notes">GitHub</a> 點個 Star ⭐️ 支持',
    backgroundColor: "var(--accent)",
    textColor: "var(--foreground)",
    isCloseable: true,
  },
  // * 導覽列
  navbar: {
    title: "Bosh Kuo",
    logo: {
      alt: "Bosh Kuo Logo",
      src: "img/logo.png",
    },
    // hideOnScroll: true,
    items: [
      {
        type: "dropdown",
        position: "left",
        label: "筆記",
        items: [
          { type: "doc", docId: "index", label: "探索筆記" },
          { to: "/archive/notes", label: "筆記歸檔" },
        ],
      },
      {
        type: "dropdown",
        label: "部落格",
        position: "left",
        items: [
          { to: "/blog", label: "所有文章" },
          { to: "/archive/blog", label: "部落格歸檔" },
        ],
      },
      {
        to: "/projects",
        label: "近期專案",
        position: "left",
      },
      { to: "/about", label: "關於我", position: "left" },
      {
        href: "https://github.com/Bosh-Kuo",
        title: "GitHub",
        className: "header-github-link",
        "aria-label": isEnglish ? "GitHub profile" : "GitHub 個人檔案",
        position: "right",
      },
      // Classic 會把右側 items 放在亮暗模式按鈕前；最後一項即緊鄰其左側。
      { type: "localeDropdown", position: "right" },
    ],
  },
  // * 程式碼區塊
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
  },
  // * 頁尾
  footer: {
    style: "dark",
    links: [
      {
        title: "This Website",
        items: [
          {
            label: "筆記",
            to: "/docs",
          },
          {
            label: "部落格",
            to: "/blog",
          },
          {
            label: "近期專案",
            to: "/projects",
          },
        ],
      },
      {
        title: "Community",
        items: [
          {
            label: "Github",
            href: "https://github.com/Bosh-Kuo",
          },
          {
            label: "Linkedin",
            href: "https://www.linkedin.com/in/po-chih-kuo-918452231/",
          },
        ],
      },
      {
        title: "Acknowledgement",
        items: [
          {
            html: `
              <p>
              ${isEnglish ? "Illustrations by" : "插圖提供："} <a href="https://storyset.com/web">Storyset</a>
              </p>
              `,
          },
          {
            html: `
              <a href="https://vercel.com/?utm_source=vignette&utm_campaign=oss" target="_blank" rel="noreferrer noopener" aria-label="Powered by Vercel">
                <img src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" />
              </a>
            `,
          },
        ],
      },
    ],
    copyright: isEnglish
      ? `Copyright © ${new Date().getFullYear()} Bosh Kuo. Built with Docusaurus.`
      : `Copyright © ${new Date().getFullYear()} Bosh Kuo. 使用 Docusaurus 建置。`,
  },
  // * 文件側欄
  docs: {
    sidebar: {
      hideable: true,
      autoCollapseCategories: true,
    },
  },
  // * 部落格側欄
  blog: {
    sidebar: {
      groupByYear: false, // 停用年份分組，避免出現 scrollbar
    },
  },
  // * Algolia 搜尋
  // https://docusaurus.io/docs/search#using-algolia-docsearch
  algolia: {
    // Algolia 提供的應用程式 ID。
    appId: "XAYHN71OBB",
    // 公開搜尋用的 API key，可隨專案提交。
    apiKey: "6e8c7aa1573050bf1bcf7cf52216978e",
    indexName: "boshkuo",
    // 介面先雙語、文章仍為中文：共用現有中文索引，避免英文語系被篩成空結果。
    // 開始索引英文譯文後，可改回 contextualSearch: true 並移除以下語系篩選與路徑替換。
    contextualSearch: false,
    // 跨網站的搜尋結果改用完整頁面導向，避免交由本站路由處理。
    externalUrlRegex: "external\\.com|domain\\.com",

    // 額外的 Algolia 搜尋參數。
    searchParameters: { facetFilters: ["language:zh-Hant"] },
    // from 是正規表示式字串，結果路徑使用目前語系。
    replaceSearchResultPathname: {
      from: "^/(?:en/)?",
      to: isEnglish ? "/en/" : "/",
    },
    // 搜尋頁面的路徑；設為 false 可停用。
    searchPagePath: "search",
    // 其他 Algolia 參數。
  },
  // * 即時程式碼預覽
  liveCodeBlock: {
    playgroundPosition: "bottom", // "top" | "bottom"
  },
} satisfies Preset.ThemeConfig;

export default themeConfig;
