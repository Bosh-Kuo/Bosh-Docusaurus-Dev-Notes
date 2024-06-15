import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  // * Site metadata
  title: "Bosh's Tech Notes",
  tagline: "Sharing my learning journey.",
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
  presets: [
    [
      // 正式寫法： "@docusaurus/preset-classic"
      "classic",
      {
        // * theme-classic
        theme: {
          customCss: "./src/css/custom.css",
        },
        // * plugin-content-docs
        docs: {
          sidebarPath: "./sidebars.ts",
          showLastUpdateTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        // * plugin-content-blog
        blog: false,
        // * plugin-google-gtag
        gtag: {
          trackingID: "G-HF9KVZT5MF",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  // * plugin configurations
  plugins: [
    "@docusaurus/plugin-ideal-image", // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image
    "docusaurus-plugin-image-zoom", // https://github.com/gabrielcsapo/docusaurus-plugin-image-zoom
  ],

  // * theme configurations
  themeConfig: {
    // * Common
    image: "img/logo.png", // used for social card, in particular og:image and twitter:image.
    announcementBar: {
      id: "announcement",
      content:
        '如果我的筆記對你有幫助，歡迎到我的 <a target="_blank" rel="noopener noreferrer" href="https://github.com/Bosh-Kuo/docusaurus-dev-notes">Github</a> 給我一顆星星 ⭐️',
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
      items: [
        {
          type: "doc",
          docId: "index",
          position: "left",
          label: "Docs",
        },
        {
          to: "/projects",
          label: "Projects",
          position: "left",
        },
        {
          href: "https://boshkuo.com",
          label: "Portfolio",
          position: "right",
        },
        {
          href: "https://blog.boshkuo.com/",
          label: "Blog",
          position: "right",
        },
        {
          href: "https://github.com/Bosh-Kuo",
          label: "GitHub",
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
          title: "Dev notes",
          items: [
            {
              label: "Docs",
              to: "/docs",
            },
            {
              label: "Projects",
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
        autoCollapseCategories: false,
      },
    },
    // * Algolia DocSearch
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
  } satisfies Preset.ThemeConfig,
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
