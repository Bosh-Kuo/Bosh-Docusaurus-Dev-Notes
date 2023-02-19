---
sidebar_position: 6
description: Docusaurus 專案 - SEO
last_update:
  date: 2023-02-19
keywords:
  - Docusaurus
  - SEO
tags:
  - Docusaurus
---

# SEO

SEO (Search Engine Optimization) 是一種通過優化網站內容和結構，提高網站在搜索引擎中的排名，從而吸引更多有價值的訪客和流量的網站優化方法。

SEO 的重要性體現在以下幾個方面：

1. 增加網站流量：當網站在搜索引擎中排名較高，就能更容易地被搜索到，吸引更多的訪客和流量。
2. 提高網站曝光率：搜索引擎的使用量非常大，當網站的排名較高時，就能更容易被用戶發現，進而提高網站的曝光率。
3. 增加銷售機會：如果網站的排名較高，就能更容易被潛在客戶發現，進而增加銷售機會。
4. 降低營銷成本：相比於其他網絡營銷方式，SEO 的成本更低，而且效果更好，因此可以降低網站的營銷成本。

## Google Analytics

[Google Analytics](https://analytics.google.com/analytics/web/provision/#/provision) 是由 Google 開發的一款免費的網站分析工具，可以追蹤網站訪問者的行為，並提供各種詳細的報告和統計資料，以幫助網站所有者了解其網站的訪問者和流量。使用者可以透過 Google Analytics 跟踪網站的流量、參觀者行為、訪問網頁的時長、地理位置、以及在網站上花費的時間和金錢等。透過這些資料，使用者可以了解網站的流量狀況，分析參觀者喜好、興趣、以及搜尋引擎關鍵字，並且在此基礎上做出適當的改進和優化。

### GA 設定

關於 [Google Analytics](https://analytics.google.com/analytics/web/provision/#/provision) 使用者後台的設定與介紹，過去在建置我的 Hexo Blog 時有寫一篇文章介紹，可以參考 [從零開始使用Hexo + Github Page搭建個人技術筆記網站(7) - 客製化 NexT 主題：Google Analytics 分析部落格文章流量](https://blog.boshkuo.com/hexo-from-scratch-7/) 來操作設定 GA 後台，Docusaurus 部分的的設定則可以參考這篇官方文章 [📦 plugin-google-gtag](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag) 。

:::tip
💡 同樣，若已安裝`@docusaurus/preset-classic` 套件，就不需要額外安裝這個 `@docusaurus/plugin-google-gtag` 套件
:::

:::info
要注意，官方的 **[📦 plugin-google-analytics](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-analytics)** 插件將於今年將於今年失效，原本使用這個 GA 插件的使用者可以改使用 [📦 plugin-google-gtag](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag)
:::

## Sitemap file

Sitemap 是一個 XML 文件，簡單來說，Sitemap 就是一個網站地圖，可以向搜索引擎展示網站的整體架構和內容，讓搜索引擎更容易了解網站的內容和結構。Sitemap 會列出網站上的所有頁面，並提供有關這些頁面的相關信息，例如它們的 URL、最後修改日期、更改頻率以及相對於其他頁面的重要性。這些信息可以幫助搜索引擎更有效地抓取和索引您的網站，從而提高網站的搜尋引擎排名。

我們可以使用 Sitemap 將網站的內容結構提交給 [Google Search Console](https://search.google.com/search-console/about)。這樣做可以讓搜索引擎更容易了解網站的內容和結構，從而提高搜索引擎抓取網站內容的效率，進而提高網站在搜索引擎結果頁面中的排名。當我們提交 Sitemap 後，就可以使用 Google Search Console 監控網站的索引狀態，並解決任何潛在的問題，關於 GSC 詳細的講解可以參考之前寫的 **[Hexo 進階補充系列(5) - SEO： Google Search Console 設定](https://blog.boshkuo.com/hexo-advanced-supplementary-5/)** 這篇文章。

Docusaurus 的 `@docusaurus/plugin-sitemap` 插件，它默認被包含在 `preset-classic` 中。它會自動生成一個 sitemap.xml 文件，該文件將在完成  production 構建後在 [https://example.com/[baseUrl]/sitemap.xml](https://example.com/%5BbaseUrl%5D/sitemap.xml) 中提供。

## Reference

- [Google Analytics](https://analytics.google.com/analytics/web/provision/#/provision)
- [Google Search Console](https://search.google.com/search-console/about)
- [📦 plugin-google-gtag](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag)
- [從零開始使用Hexo + Github Page搭建個人技術筆記網站(7) - 客製化 NexT 主題：Google Analytics 分析部落格文章流量](https://blog.boshkuo.com/hexo-from-scratch-7/)
- [Hexo 進階補充系列(5) - SEO： Google Search Console 設定](https://blog.boshkuo.com/hexo-advanced-supplementary-5/)