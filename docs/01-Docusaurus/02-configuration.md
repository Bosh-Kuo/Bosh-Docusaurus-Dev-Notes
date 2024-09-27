---
title: docusaurus.config.ts 配置解說
sidebar_label: "[學習筆記] Configuration"
description: 本文將詳細介紹如何配置 docusaurus.config.js，包括網站基本資訊、部署配置、主題與插件設定，以及如何進行客製化配置，幫助開發者充分利用 Docusaurus 的強大功能，打造符合自己需求的文檔網站。
last_update:
  date: 2024-09-24
keywords:
  - Docusaurus
  - Configuration
tags:
  - Docusaurus
---

`docusaurus.config.js` 是 Docusaurus 專案中的配置檔案，用於設定和自訂網站的各種屬性、插件和行為。使用 `npx create-docusaurus` CLI 工具建立的 Docusaurus 專案都已附帶一個包含預設配置的 **docusaurus.config.js** 檔(如果是 TypeScript 用戶則為 **docusaurus.config.ts**)，大部分情況下我們只需要將預設值改為自己網站的相關設定就可以了。但如果預設的設置選項無法滿足某些客製化需求，Docusaurus 也提供了詳盡的 API 文件 [**@Docusaurus - docusaurus.config.js**](https://docusaurus.io/docs/api/docusaurus-config)，以滿足更高階的客製化需求。

docusaurus.config.js 的配置選項主要可以分成下列幾種類類型：

- **Site metadata**
- **Deployment configurations**
- **Theme, plugin, and preset configurations**
- **Custom configurations**

:::info
**Docusaurus3** 已支援使用 **ES Modules**, **TypeScript** 來撰寫 `docusaurus.config.js` ，若使用 ESM 語法，必須以**默認導出** config object

```tsx
const config: Config = {
	...
}
export default config
```

:::

## **網站基本資訊(Site metadata)**

- **title**：網站的標題，這個標題會顯示在瀏覽器標籤頁上。
- **tagline**：網站的標語，通常顯示在首頁。
- **favicon**: 網站圖標路徑。e.g., favicon 位於 static/img/favicon.ico，則填寫 img/favicon.ico
- **url**：網站的對外 URL。
- **baseUrl**：網站的基礎路徑，通常用於指定網站的根路徑。

```tsx
const config: Config = {
  title: "Bosh's Tech Notes",
  tagline: "Sharing my learning journey.",
  favicon: "img/favicon.ico",
  url: "https://notes.boshkuo.com", // Set the production url of your site here
  baseUrl: "/", // The path after the host, ex: https://facebook.github.io/<baseURL>/.
  ...
 }
```

### [](https://docusaurus.io/docs/configuration#site-metadata)

## **部署配置(Deployment configurations)**

部署配置主要涉及使用 `docusaurus deploy` 指令或 `docusaurus build` 時的部署行為。

以下前兩項只限於部署至 Github pages 的相關配置，若不使用 GitHub pages 則可以忽略

- **organizationName**：GitHub 組織名稱。
- **projectName**：GitHub 專案名稱。
- **onBrokenLinks**：設置當網站中存在無效鏈接時的行為，**throw** 會在構建過程中報錯，**warn** 則只會發出警告。
- **onBrokenMarkdownLinks**：設置當網站中存在無效 Markdown 鏈接時的行為，選項同上。

```tsx
const config: Config = {
  ...
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "bosh-kuo", // Usually your GitHub org/user name.
  projectName: "docusaurus-dev-notes", // Usually your repo name.
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  ...
 }
```

## **主題、插件、預設配置(Theme, plugin, and preset configurations)**

在介紹具體的配置之前，我們先來簡單了解一下 Docusaurus 中的 **主題 (Theme)**、**插件 (Plugin)** 和 **預設配置 (Preset)** 這三者之間的關係。

- **插件（Plugins）**：類似於網站資料搜集者的角色，負責從不同的資料來源收集內容，並在打包時將這些內容轉換為 JSON 格式的資料
- **主題（Themes）**：類似於網站的展示者的角色，負責定義網站的外觀和佈局。它會接收插件收集到的 JSON 資料，並以定義好的樣式與佈局將資料呈現在網頁上。
- **預設配置（Presets）**：是一個包裝好的「組合」，它把多個插件和主題打包在一起，幫助你快速啟動並設置網站。當你使用一個 preset 時，它會自動幫你加載預設的插件和主題，讓你不需要自己手動去配置每個插件和主題。

延續上述的比喻，docusaurus.config.ts 負責告訴插件和主題怎麼合作，設定整體網站的運作邏輯。

### **主題配置(themes)**

目前 Docusaurus 只有提供 `@docusaurus/theme-classic` 一個主要主題，而在 docusaurus.config.ts 中，主題的配置選項主要集中於 **[themeConfig](https://docusaurus.io/docs/api/themes/configuration)** 。

<details>
  <summary>以下列出 themeConfig 中常見的調整項目</summary>

- [**Common**](https://docusaurus.io/docs/api/themes/configuration#common)
    - [**Color mode**](https://docusaurus.io/docs/api/themes/configuration#color-mode---dark-mode)
    - [**Meta image**](https://docusaurus.io/docs/api/themes/configuration#meta-image)
    - [**Metadata**](https://docusaurus.io/docs/api/themes/configuration#metadata)
    - [**Announcement bar**](https://docusaurus.io/docs/api/themes/configuration#announcement-bar)
- [**Navbar**](https://docusaurus.io/docs/api/themes/configuration#navbar)
    - [**Navbar logo**](https://docusaurus.io/docs/api/themes/configuration#navbar-logo)
    - [**Navbar items**](https://docusaurus.io/docs/api/themes/configuration#navbar-items)
    - [**Auto-hide sticky navbar**](https://docusaurus.io/docs/api/themes/configuration#auto-hide-sticky-navbar)
    - [**Navbar style**](https://docusaurus.io/docs/api/themes/configuration#navbar-style)
- [**CodeBlock**](https://docusaurus.io/docs/api/themes/configuration#codeblock)
    - [**Theme**](https://docusaurus.io/docs/api/themes/configuration#theme)
    - [**Default language**](https://docusaurus.io/docs/api/themes/configuration#default-language)
- [**Footer**](https://docusaurus.io/docs/api/themes/configuration#footer-1)
    - [**Footer Links**](https://docusaurus.io/docs/api/themes/configuration#footer-links)
- [**Table of Contents**](https://docusaurus.io/docs/api/themes/configuration#table-of-contents)
- [**Hooks**](https://docusaurus.io/docs/api/themes/configuration#hooks)
    - [**useColorMode**](https://docusaurus.io/docs/api/themes/configuration#use-color-mode)
- [**i18n**](https://docusaurus.io/docs/api/themes/configuration#i18n)
  
</details>

除了主要主題之外，Docusaurus 目前也有提供幾個提供附加功能與使用介面的主題，包含：

- **Sidebar**: [**@Docusaurus - Sidebar**](https://docusaurus.io/docs/sidebar#theme-configuration)
- **Algolia DocSearch**: [**@Docusaurus - 🥇 Using Algolia DocSearch**](https://docusaurus.io/docs/search#using-algolia-docsearch)
- **mermaid**: [**@Docusaurus - 📦 theme-mermaid**](https://docusaurus.io/docs/api/themes/@docusaurus/theme-mermaid)
- **live-codeblock**: [**@Docusaurus - 📦 theme-live-codeblock**](https://docusaurus.io/docs/api/themes/@docusaurus/theme-live-codeblock)


### **插件配置(plugins)**

前面有提到，plugins 是用來新增或擴展 Docusaurus 網站功能的模組，不同的功能由不同的 plugin 來提供。例如：
- [**plugin-content-docs**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs) 提供文件功能
- [**plugin-content-blog**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog) 提供部落格功能
- [**plugin-content-pages**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages) 提供個別頁面功能

以上舉例的幾個常見的 plugins 都已被包含在 `@docusaurus/preset-classic`  裡，因此通常我們會在 **presets** 中配置這些 plugins 的功能，而不是在 **plugins** 中。若我們想要在網站添加一些預設沒有的功能可以到官方維護的 plugins 列表 [**@Docusaurus plugins**](https://docusaurus.io/docs/api/plugins) 或開源社群維護的非官方 plugins 列表 [@**Community plugins**](https://docusaurus.io/community/resources#community-plugins) 來尋找。尋找

### **預設配置(presets)**

使用 `npx create-docusaurus` CLI 工具建立的專案都會預設安裝 `@docusaurus/preset-classic` 這個 **preset** ，它預設包含了以下 themes 與 plugins：

- [`@docusaurus/theme-classic`](https://docusaurus.io/docs/api/themes/@docusaurus/theme-classic)
- [`@docusaurus/theme-search-algolia`](https://docusaurus.io/docs/api/themes/@docusaurus/theme-search-algolia)
- [`@docusaurus/plugin-content-docs`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs)
- [`@docusaurus/plugin-content-blog`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog)
- [`@docusaurus/plugin-content-pages`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages)
- [`@docusaurus/plugin-debug`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-debug)
- [`@docusaurus/plugin-google-gtag`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag)
- [`@docusaurus/plugin-google-tag-manager`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-tag-manager)
- [`@docusaurus/plugin-google-analytics`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-analytics) (**deprecated**)
- [`@docusaurus/plugin-sitemap`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-sitemap)

若要修改預設中的主題或插件配置選項，可以在 presets 陣列內傳遞自定義設置。配置物件中的每個 key 都對應到一個 `@docusaurus/preset-classic` 包含的 theme 或 plugin， value 則為對該 theme 或 plugin 的配置物件。

```tsx
export default {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // Debug defaults to true in dev, false in prod
        debug: undefined,
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: ['./src/css/custom.css'],
        },
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {},
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {},
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        pages: {},
        // Will be passed to @docusaurus/plugin-sitemap (false to disable)
        sitemap: {},
        // Will be passed to @docusaurus/plugin-google-gtag (only enabled when explicitly specified)
        gtag: {},
        // Will be passed to @docusaurus/plugin-google-tag-manager (only enabled when explicitly specified)
        googleTagManager: {},
        // DEPRECATED: Will be passed to @docusaurus/plugin-google-analytics (only enabled when explicitly specified)
        googleAnalytics: {},
      },
    ],
  ],
};
```

## **客製化配置(Custom configurations)**

除了官方提供的標準配置項目，Docusaurus 也允許使用者添加自定義配置，以供被網站中的元件引用，用於控制網站的行為或外觀。不過，Docusaurus 預設會保護 docusaurus.config.js 檔案，防止未知的字段進入。如果需要添加自定義配置，必須在 `customFields` 欄位中定義它們。

以下是一個範例，在 docusaurus.config.js 中添加自定義配置：

```jsx
const config: Config = {
  ...
  customFields: {
    myCustomField: 'This is a custom field',
    enableFeatureX: true,
  },
  ...
}
```

## **如何在 components 中取得配置文件內容？**

在 Docusaurus 專案中，有時我們需要在 React 組件中獲取和使用 docusaurus.config.js 中的配置項目。這可以通過 `@docusaurus/core` 提供的 `useDocusaurusContext` 來實現。

以下是一個範例，展示如何在組件中獲取和使用配置文件中的內容，包括自定義配置：

```jsx
import React from 'react';
import { useDocusaurusContext } from '@docusaurus/core';

const SiteInfo = () => {
  const { siteConfig } = useDocusaurusContext();
  const { title, tagline, url, baseUrl, customFields } = siteConfig;
  const { myCustomField, enableFeatureX } = customFields;

  return (
    <div>
      <h1>{title}</h1>
      <p>{tagline}</p>
      <p>Website URL: {url}</p>
      <p>Base URL: {baseUrl}</p>
      <p>Custom Field: {myCustomField}</p>
      {enableFeatureX && <p>Feature X is enabled!</p>}
    </div>
  );
};

export default SiteInfo;
```

## **Reference**

- [**@Docusaurus**](https://docusaurus.io/)
    - [**Configuration**](https://docusaurus.io/docs/configuration)
    - [**docusaurus.config.js**](https://docusaurus.io/docs/api/docusaurus-config)
    - [**Using Plugins**](https://docusaurus.io/docs/using-plugins)