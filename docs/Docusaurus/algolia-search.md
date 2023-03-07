---
title: Algolia DocSearch
sidebar_label: Algolia DocSearch
sidebar_position: 7
description: Docusaurus 專案 - Algolia DocSearch
last_update:
  date: 2023-03-08
keywords:
  - Docusaurus
  - Algolia DocSearch
tags:
  - Docusaurus
---

## **What is Algolia DocSearch?**
`Algolia DocSearch` 的運作方式由以下兩點組成：

- Algolia 每週會在在自己的設備中運行的爬蟲（也可以自己配置）。它會追踪網站中的每個 link，並從它遍歷的每個頁面中提取內容。然後它將此內容推送到 Algolia 索引。
- 使用者透過插入一段 JS snippet 將此 Algolia 索引綁定到網站的搜索輸入並在 UI 中顯示其結果。

使用 Algolia DocSearch 前建議先閱讀 [Who can apply?](https://docsearch.algolia.com/docs/who-can-apply/) ，接著到 [apply to the DocSearch program](https://docsearch.algolia.com/apply) 填寫網站的基本資料，依據 checklist 所述，網站必須為開源且所述，網站必須為開源且必須為技術筆記或部落格。

![apply](https://res.cloudinary.com/djtoo8orh/image/upload/v1678212127/Docusaurus%20Blog/Docusaurus/DocSearch/apply_pdd08m.png)


<br/>


## **index Configuration**
Algolia 審核會需要一些時間，審查批准後會收到一封會收到一封確認信件。信件會包含 `docusaurus.config.js` 需要的 `appId, apiKey, indexName` 資訊。Algolia 爬蟲可以透過 [the web interface](https://crawler.algolia.com/) 來管理，來管理，通常不需要手動添加 爬蟲相關的 config。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1678212127/Docusaurus%20Blog/Docusaurus/DocSearch/email_jwsyfh.png)

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1678212127/Docusaurus%20Blog/Docusaurus/DocSearch/crawler_azrdt1.png)


<br/>


## **連結 Algolia**

Docusaurus 自己的 `@docusaurus/preset-classic` 就有支援 Algolia DocSearch 功能，依照官方文件在 `docusaurus.config.js` 加入 `themeConfig`

```js title=docusaurus.config.js
module.exports = {
  // ...
  themeConfig: {
    // ...
    algolia: {
      // The application ID provided by Algolia
      appId: 'YOUR_APP_ID',

      // Public API key: it is safe to commit it
      apiKey: 'YOUR_SEARCH_API_KEY',

      indexName: 'YOUR_INDEX_NAME',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      //... other Algolia params
    },
  },
};
```



## **Reference**

- [Search](https://docusaurus.io/docs/search#using-algolia-docsearch)  (@Docusaurus)
- [Who can apply?](https://docsearch.algolia.com/docs/who-can-apply/)  (@DocSearch)
- [apply to the DocSearch program](https://docsearch.algolia.com/apply)  (@DocSearch)