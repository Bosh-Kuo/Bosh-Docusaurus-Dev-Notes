// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// math
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Bosh's Tech Notes",
  tagline:
    "Sharing my learning journey as a software engineer, one note at a time.",
  url: "https://notes.boshkuo.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hant".
  i18n: {
    defaultLocale: "zh-Hant",
    locales: ["zh-Hant"],
  },

  themes: ["@docusaurus/theme-live-codeblock", "@docusaurus/theme-mermaid"],

  presets: [
    [
      // 正式寫法： "@docusaurus/preset-classic"
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          remarkPlugins: [math],
          rehypePlugins: [katex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          // "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: false,

        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },

        // Google Analytics
        gtag: {
          trackingID: "G-HF9KVZT5MF",
          anonymizeIP: true,
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  // mermaid
  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Bosh Kuo",
        logo: {
          alt: "My Site Logo",
          src: "img/favicon.ico",
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
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Bosh Kuo. Built with Docusaurus.`,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
