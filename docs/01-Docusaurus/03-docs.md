---
title: Docusaurus Docs 簡易筆記：組織文件時你該注意的重要事項
sidebar_label: "Docs"
description: Docusaurus 的 Docs 提供了一個基於文件系統的分層結構來組織文檔的功能，讓側邊欄能清晰呈現文檔層次和結構，提升維護便利性與讀者的導航體驗。本篇文章將深入介紹 Docs 配置、文件路徑與 URL 路徑的影響，以及如何利用插件來管理目錄變動對 SEO 的影響。
last_update:
  date: 2024-10-02
keywords:
  - Docusaurus
  - React
  - Docs
tags:
  - Docusaurus
---

Docusaurus 的 **Docs** 提供了一種以分層結構來組織 Markdown 文件的功能。在預設狀態下，Docusaurus 會自動將 `/docs` 目錄下的文章按照其文件夾結構，在網站的左側顯示為對應的側邊欄。這種側邊欄不僅呈現出清晰的文檔層次，還能讓讀者一目了然地掌握文檔的整體架構，這也是 Docusaurus 最吸引我的其中一個功能。

對於網站管理者來說，這樣的分層結構使得文檔維護的工作變得更加簡單和直觀。而對於讀者而言，這樣的分層結構不僅提升了導航的便利性，還可以輕鬆地在側邊欄中看出文章之間的脈絡和層次關係。


## **Docs 功能配置**

Docs 的功能主要由 [**@docusaurus/plugin-content-docs**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs) 這個 plugin 所提供，不過由於該 plugin 已包含在 [**@docusaurus/preset-classic**](https://docusaurus.io/docs/using-plugins#docusauruspreset-classic) 裡，因此，若要改變 Docs 的預設功能行為，則需要透過 `docusaurus.config.ts` 內的 `preset` 屬性來調整配置選項。

```tsx title='docusaurus.config.ts'
module.exports = {  
  presets: [
    '@docusaurus/preset-classic',
    {
      docs: {
        routeBasePath: '/', // Serve the docs at the site's root
        /* other docs plugin options */
      },
      ...
    },
  ],
};
```

Docs 的可配置功能項目可參考 [**@plugin-content-docs - Configuration**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#configuration) 。基本上大部分設定使使用預設即可，以下列出幾個比較可能會用到的配置選項：

| **Name**             | **Type** | **Default** | **Description**                                                                                                                      |
| -------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| path                 | string   | 'docs'      | 設定文檔內容在本地文件系統中的相對路徑。如果你設置 `path: 'documents'`，Docusaurus 會從專案根目錄的 `documents` 目錄中讀取文檔內容。 |
| routeBasePath        | string   | 'docs'      | 設定文檔部分在網站上的 URL 路徑。如果你設置 `routeBasePath: 'guide'`，則文檔部分的路徑變為 `https://your-site.com/guide/`。          |
| sidebarCollapsible   | boolean  | true        | 側邊欄目錄是否可折疊（預設為可折疊）。                                                                                               |
| sidebarCollapsed     | boolean  | true        | 側邊欄目錄是否預設為折疊狀態。                                                                                                       |
| remarkPlugins        | any[]    | []          | 傳遞給 MDX 的 Remark 插件。                                                                                                          |
| rehypePlugins        | any[]    | []          | 傳遞給 MDX 的 Rehype 插件。                                                                                                          |
| showLastUpdateAuthor | boolean  | false       | 是否顯示最後更新此文檔的作者。                                                                                                       |
| showLastUpdateTime   | boolean  | false       | 是否顯示文檔最後更新的日期。                                                                                                         |
| breadcrumbs          | boolean  | true        | 是否啟用或禁用文檔頁面最上方的導航列                                                                                                 |


<br/>


## **Markdown front matter**

**front matter** 是 Docusaurus 文檔中的一段 YAML 格式的配置，位於每個 Markdown 文件的頂部，用於定義文檔的各種屬性和行為。它類似於文件的 meta data，決定該文檔如何呈現、在側邊欄中的名稱、是否顯示更新信息等等。當你懷疑 Docs 頁面的某個元件樣式是否可以隱藏或客製化時，通常可以在 **front matter** 找到答案。

以下列出一些常用配置選項的說明，詳細格式可以參考 [**@plugin-content-docs - Markdown**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter) 

| **Name**                   | **Type**   | **Default**                                          | **Description**                                                                                                                                                                                                                   |
| -------------------------- | ---------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **id**                     | string     | file path (including folders, without the extension) | A unique document ID.                                                                                                                                                                                                             |
| **title**                  | string     | Markdown title or id                                 | The text title of your document. Used for the page metadata and as a fallback value in multiple places (sidebar, next/previous buttons...). Automatically added at the top of your doc if it does not contain any Markdown title. |
| **sidebar_label**          | string     | title                                                | The text shown in the document sidebar for this document.                                                                                                                                                                         |
| **sidebar_position**       | number     | Default ordering                                     | Controls the position of a doc inside the generated sidebar slice when using autogenerated sidebar items. See also Autogenerated sidebar metadata.                                                                                |
| **hide_table_of_contents** | boolean    | false                                                | Whether to hide the table of contents to the right.                                                                                                                                                                               |
| **keywords**               | string[]   | undefined                                            | Keywords meta tag for the document page, for search engines.                                                                                                                                                                      |
| **description**            | string     | The first line of Markdown content                   | The description of your document, which will become the `<meta name="description" content="..."/>` and `<meta property="og:description" content="..."/>` in `<head>`, used by search engines.                                     |
| **slug**                   | string     | File path                                            | Allows to customize the document URL (/`<routeBasePath>`/`<slug>`). Support multiple patterns: slug: my-doc, slug: /my/path/myDoc, slug: /.                                                                                       |
| **tags**                   | Tag[]      | undefined                                            | A list of strings or objects of two string fields label and permalink to tag to your docs.                                                                                                                                        |
| **draft**                  | boolean    | false                                                | A boolean flag to indicate that a document is a work-in-progress. Draft documents will only be displayed during development.                                                                                                      |
| **unlisted**               | boolean    | false                                                | Unlisted documents will be available in both development and production. They will be "hidden" in production, not indexed, excluded from sitemaps, and can only be accessed by users having a direct link.                        |
| **last_update**            | FileChange | undefined                                            | Allows overriding the last updated author and/or date. Date can be any parsable date string.                                                                                                                                      |

以下是我常用的 front matter 模板：

```yaml
---
title: 文章標題
sidebar_label: 文章於側邊目錄顯示的名稱
description: 文章描述文字
last_update:
  date: yyyy-mm-dd
keywords: [keyword1, keyword2, ...] 
tags: [tag1, tag2, ...]
# image: 
# slug: 
# draft: 
# unlisted: 
---
```

:::tip
- id: 預設為檔名，用於作為網址後綴，就不另外設定
- title: 文章標題的預設順位為: `title` > `放至於最頂端的 head1` > `檔名`，若文章中的 head1 不是放在文章最頂端，head1 的大小會被縮小至與 head2 相同，這就顯得有點奇怪，因此還是另外設定 title 不要依賴 head1 作為文章標題比較保險。
- sidebar_label: 側邊欄名稱的預設順位為: `sidebar_label` > `title` > `放至於最頂端的 head1` > `檔名`
:::


<br/>


## **文件路徑與 URL 路徑**

在 Docusaurus 中，URL 路徑是根據文件的文件系統結構生成的，例如，當你有多層次的目錄時，這些目錄結構會映射為對應的 nested router：

```
docs/
├── getting-started/
│   ├── basics/
│   │   └── overview.md         # URL: /docs/getting-started/basics/overview
│   └── advanced/
│       └── setup.md            # URL: /docs/getting-started/advanced/setup
└── guides/
    └── troubleshooting.md      # URL: /docs/guides/troubleshooting
```

由於 URL 是根據文件的物理目錄結構生成的，更換文件的目錄位置，會直接改變 URL 路徑，導致原有的 URL 無法再被訪問。這樣的行為會嚴重影響 SEO，因為搜尋引擎已經為原有的 URL 索引並收錄了它們，當這些 URL 變成無效時，搜尋引擎會將這些連結視為壞鏈接（broken links），這對網站的排名和流量都有不良影響。

但是隨著文件數量的增加和內容的變化，重新組織文件目錄結構在所難免，但這也會導致 URL 的改變。為了減少對 SEO 的影響，我建議使用 Docusaurus 提供的插件 [**📦 plugin-client-redirects**](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects)。該插件可以幫助我們為改變的 URL 自動設置重定向，確保原有的 URL 依然能夠被訪問，並跳轉到新的 URL，避免用戶訪問到 404 頁面。這樣做有助於保持用戶的良好體驗，也能讓搜尋引擎繼續追蹤到這些重定向後的新頁面。


<br/>


## **Sidebar**

Docusaurus 支援使用者手動定義的 Sidebar ，也提供自動生成 Sidebar 的功能。手動定義的 Sidebar 允許開發者自行撰寫一個 JSON 檔案來指定各個文件的順序和層次結構，而自動生成的 Sidebar 則會根據檔案系統中的文件結構自動生成 Sidebar 中文件的層級。根據我的使用經驗，除非你的 Sidebar 需要高度的客製化，否則讓 Docusaurus 自動產生 Sidebar 會比自己手動定義還要好維護非常多。以下將以使用 Autogenerated Sidebar 為角度來進行介紹。

### **Sidebar 相關的配置選項**

在 `docusaurus.config.ts` 中與 sidebar 相關的配置項目不多， 可配置項目如下：

```tsx title='docusaurus.config.ts'
export default {
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,  // 側邊欄是否可隱藏
        autoCollapseCategories: true,  // 在展開一個類別時折疊所有同級類別
      },
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          breadcrumbs: true,  // 是否將目前頁面的「側邊欄路徑」呈現在頂部。 
        },
      },
    ],
  ],
};
```

### **自定義折疊類別**

在 Docusaurus 中，`_category_.json` 或 `_category_.yml` 讓我們可以自訂該文件夾作為一個類別在 sidebar 中的顯示方式，比如設定標籤（label）、順序（position）、是否可折疊（collapsible）等屬性。

```json title='_category_.json'
{
  "position": 2.5, // 定義該類別在 sidebar 中的顯示順序，越小越靠前顯示
  "label": "Tutorial", // 設置該類別在 sidebar 中的顯示名稱
  "collapsible": true, // 指定該類別是否可以被折疊
  "collapsed": false, // 指定類別是否在初始狀態下折疊，false 代表展開
  "className": "red", // 為該類別設置自定義的 CSS 類名
  "link": {
    "type": "generated-index", // 設置類別鏈接的類型為自動生成的索引頁面
    "title": "Tutorial overview" // 設置鏈接頁面的標題
  },
  "customProps": {
    "description": "This description can be used in the swizzled DocCard" // 自定義屬性，可以在自定義的 UI 中使用
  }
}

```

### **數字前綴命名**

Docusaurus 提供了一個極為方便簡單的方法來維護 Sidebar 項目的順序，我們可以透過在文件和資料夾前添加數字前綴，這樣文件系統中的顯示順序就會與 sidebar 一致。例如：

```
docs
├── 01-Intro.md
├── 02-Tutorial-Easy
│   ├── 01-First-Part.md
│   ├── 02-Second-Part.md
│   └── 03-End.md
├── 03-Tutorial-Hard
│   ├── 01-First-Part.md
│   ├── 02-Second-Part.md
│   ├── 03-Third-Part.md
│   └── 04-End.md
└── 04-End.md
```

Docusaurus 在生成文件時，會移除這些數字前綴，因此文檔的 ID、標題、標籤和 URL 路徑中不會包含數字部分。例如，`02-Tutorial-Easy/01-First-Part.md` 的 URL 路徑會是 `/docs/Tutorial-Easy/First-Part`。

:::caution
使用 Number prefixes 有個需要非常注意的點是，有時候我們會為了調整文章在 sidebar 上的順序而改動文檔的數字前綴，若剛好有其他篇文章有引用到這篇文章時，檔名路徑改變將會導致引用失效。

例如，將 /docs/Tutorial/02-Blog.mdx 改成 /docs/Tutorial/03-Blog.mdx。

```
- [Tutorial End](../02-Blog.mdx);
+ [Tutorial End](../03-Blog.mdx);
```

當我們修改了 `02-Blog.mdx` 的數字前綴為 `03-Blog.mdx`，則需要手動更新所有的引用。
:::

:::danger
在預設情況下，Docusaurus 在 build 階段若檢查到專案內有引用到失效的連結，會直接終止 build 流程，因而導致網站更新失敗。因此，通常如果我有改動文檔的名稱的話，我都會在 push code 前先在本地 build 一次，確認在本地可以 build 成功才會 push code
:::


<br/>


## **Reference**

- [**@Docusaurus - Docs**](https://docusaurus.io/docs/create-doc)
- [**@Docusaurus - Routing**](https://docusaurus.io/docs/advanced/routing#docs-routing)
- [**@Docusaurus - Sidebar**](https://docusaurus.io/docs/sidebar)