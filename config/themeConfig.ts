import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

const themeConfig = {
  // * Common
  image: "img/logo.png", // used for social card, in particular og:image and twitter:image.
  announcementBar: {
    id: "announcement",
    content:
      '如果我的筆記對你有幫助，歡迎到我的 <a target="_blank" rel="noopener noreferrer" href="https://github.com/Bosh-Kuo/docusaurus-dev-notes">GitHub</a> 點個 Star ⭐️ 支持',
    textColor: "#091E42",
    isCloseable: true,
  },
  // * Navbar
  navbar: {
    title: "Bosh Kuo",
    logo: {
      alt: "My Site Logo",
      src: "img/logo.png",
    },
    // hideOnScroll: true,
    items: [
      {
        type: "doc",
        docId: "index",
        position: "left",
        label: "筆記",
      },
      {
        to: "/blog",
        label: "部落格",
        position: "left",
      },
      {
        to: "/projects",
        label: "近期專案",
        position: "left",
      },
      {
        href: "https://github.com/Bosh-Kuo",
        title: "GitHub",
        className: "header-github-link",
        "aria-label": "GitHub repository",
        position: "right",
      },
    ],
  },
  // * CodeBlock
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
  },
  // * Footer
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
          {
            label: "CakeResume",
            href: "https://www.cakeresume.com/s--IPijnOZLMFNIJ6ofjbn6Dg--/bosh-kuo",
          },
        ],
      },
      {
        title: "More",
        items: [
          {
            label: "Portfolio",
            href: "https://boshkuo.com/",
          },
          {
            label: "Hexo Blog",
            href: "https://blog.boshkuo.com/",
          },
          {
            label: "Youtube Channel",
            href: "https://www.youtube.com/channel/UCV5iS4O95pCO0humhYXnrwg",
          },
        ],
      },
      {
        title: "Acknowledgement",
        items: [
          {
            html: `
              <p>
              illustrations by <a href="https://storyset.com/web">Storyset</a>                  
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
    copyright: `Copyright © ${new Date().getFullYear()} Bosh Kuo. Built with Docusaurus.`,
  },
  // * Sidebar
  docs: {
    sidebar: {
      hideable: true,
      autoCollapseCategories: true,
    },
  },
  // * Blog sidebar
  blog: {
    sidebar: {
      groupByYear: false, // 停用年份分組，避免出現 scrollbar
    },
  },
  // * Algolia DocSearch
  // https://docusaurus.io/docs/search#using-algolia-docsearch
  algolia: {
    // The application ID provided by Algolia
    appId: "XAYHN71OBB",
    // Public API key: it is safe to commit it
    apiKey: "6e8c7aa1573050bf1bcf7cf52216978e",
    indexName: "boshkuo",
    // Optional: see doc section below
    contextualSearch: true,
    // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
    externalUrlRegex: "external\\.com|domain\\.com",

    // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
    // replaceSearchResultPathname: {
    //   from: "/docs/", // or as RegExp: /\/docs\//
    //   to: "",
    // },

    // Optional: Algolia search parameters
    searchParameters: {},
    // Optional: path for search page that enabled by default (`false` to disable it)
    searchPagePath: "search",
    //... other Algolia params
  },
  // * theme-live-codeblock
  liveCodeBlock: {
    playgroundPosition: "bottom", // "top" | "bottom"
  },
  // * docusaurus-plugin-image-zoom
  zoom: {
    selector: ".markdown :not(em) > img",
    background: {
      light: "rgb(255, 255, 255)",
      dark: "rgb(50, 50, 50)",
    },
  },
} satisfies Preset.ThemeConfig;

export default themeConfig;
