---
title: "SEO： Google Search Console  設定"
sidebar_label: "[進階系列] - SEO： Google Search Console  設定"
description: 本文紀錄如何在 Google Search Console 中設定自己的 Hexo Blog 資訊，將部落格文章納入 Google 的搜尋索引。
last_update:
  date: 2023-01-28
keywords:
  - Hexo
  - SEO
  - Google Search Console
tags:
  - Hexo
---

## **Google Search Console**

[Google Search Console](https://search.google.com/search-console/about) 簡稱GSC，舊稱網站管理員 / Google Webmaster）是Google提供的免費工具，使用這工具的前提是你必須要驗證為網站的所有者，完成驗證之後即可檢視網站在Google Search上的表現。GSC可以讓你查看網站在Google搜尋結果中的排名、點擊率、錯誤報告、網站地圖等資訊，還可以設定網站的首頁、提交網站地圖、提醒網站管理員有關網站問題的通知，進而改善網站的搜尋引擎優化。使用GSC可以更好地瞭解網站在Google上的表現，並採取適當的措施來提升網站的曝光度與排名。


<br/>


## **驗證**

以前Google Search Console只提供網址前置字元層級的驗證，後來有提供網域層級（[Google的說明](https://support.google.com/webmasters/answer/34592?hl=zh-Hant&ref_topic=9455938)），完成該層級的驗證就能使用對應層級的資源。

![GSC 驗證](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/GSC_%E9%A9%97%E8%AD%89_n4hebj.png)

### **網域驗證**

網域層級資源可以彙整屬於該網域於Google Search的所有資料，該資源會包含所有子網域的資料，以本站來說，驗證`根網域` [boshkuo.com](http://boshkuo.com) 資源後， [blog.boshkuo.com](http://blog.boshkuo.com) , [note.boshkuo.com](http://note.boshkuo.com) 的資料都會被包含進來，可以一次性的建立該網域下所有網站的資源，當一個網域下有多個放在不同子網域的網站時就可以同時管理不同網站的資源。

雖然說輸入框的說明寫 “輸入網域或子網域”，但一開始要填入的應該是`根網域`，以本網站為例，這個部落格架在 [blog.boshkuo.com](http://blog.boshkuo.com) 這個`子網域`下，而他的根網域為 [boshkuo.com](http://boshkuo.com) ，完成根網域資源的驗證後創建子網域層級或子目錄層級的資源就不用再需驗證。這是操作時可能踩的一個小坑，我一開始在尚未驗證根網域前先嘗試驗證 [blog.boshkuo.com](http://blog.boshkuo.com) 這個`子網域`，但點選驗證後就會發生錯誤。所以若一開始要進行網域層級的驗證，首先應該先填入自己的根網域，以本站為例: [boshkuo.com](http://boshkuo.com)。此外網域層級的驗證不需要填寫 http 或 https。

最新的 Google Search Console 能夠自行檢測出網域名稱供應商， 點選繼續後會自動幫我倒向供應商的頁面，以本站購買網域的供應商 Godday 為例，以前的教學文章都寫 Google Search Console 會提供 `TXT 紀錄`，使用者須自行複製至 DNS 設定內，現在直接以連線的方式幫我設定好 DNS 的 TXT 紀錄還滿貼心的～

![godday 驗證連結](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/godday_%E9%A9%97%E8%AD%89%E9%80%A3%E7%B5%90_rxpk5y.png)

點選連線後，Godday 的 DNS 設定中就會新增了一筆 TXT 紀錄
![DNS 設定](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900780/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/DNS_%E8%A8%AD%E5%AE%9A_nyog0x.png)

完成網域驗證的根網域在 Google Search Console：
![根網域](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/%E6%A0%B9%E7%B6%B2%E5%9F%9F_thvepd.png)

接著新增子網域 blog.boshkuo.com 資源就不需要驗證了
![子網域](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/%E5%AD%90%E7%B6%B2%E5%9F%9F_wr1zct.png)


### **網址前置字元驗證**

網址前置字元可以簡單想成子網域或子目錄，這邊就要填入包含 http 或 https 的完整網址，以本站為例，我的網址變體有 [https://blog.boshkuo.com/](https://blog.boshkuo.com/) , [https://bosh-kuo.github.io/Bosh-Hexo-Blog/](https://bosh-kuo.github.io/Bosh-Hexo-Blog/) 。由於本網站之前就有設定過 `Google Analytics` 因此新增資源時都不需要再次驗證，若此前從來沒有對該網站進行過驗證，可以參考下列文章以 HTML 檔案或是 HTML 標記來進行驗證：

- [Hexo-Butterfly-主题-谷歌搜索引擎优化](https://qyun.fun/posts/6452ae09/)
- [(24) 試著學 Hexo - SEO 篇 - Google Search Console](https://israynotarray.com/hexo/20201007/3723180073/)
- [Butterfly 進階篇（一） - SEO 優化搜索引擎收錄](https://qmike.top/posts/2a1b5a62)

![前置字元-自訂網域](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/%E5%89%8D%E7%BD%AE%E5%AD%97%E5%85%83-%E8%87%AA%E8%A8%82%E7%B6%B2%E5%9F%9F_khyu4r.png)

![前置字元-github.io](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/%E5%89%8D%E7%BD%AE%E5%AD%97%E5%85%83-github.io_eugaf1.png)


<br/>


## **提交 Sitemap**

sitemap 其實是一個頁面，上面放置了網站上需要搜索引擎抓取的所有頁面的連結，這個頁面檔案是專門提交給搜尋引擎爬蟲使用的， sitemap 可以告訴搜索引擎網站上有哪些可供抓取的網頁，以便搜索引擎可以更加智能地抓取網站。提交 sitemap 有助於 Google 進一步瞭解你的網站上有哪些網址，且 sitemap 涵蓋範圍報告，可以快速的了解 Google 爬取跟索引重點網頁的狀態。 

使用 GSC 的 sitemap 功能後 Google 的爬蟲就會定期去看 sitemap.xml 檔案是否有更新，如果有更新，爬蟲就會重新索引網站內容。使用 GSC 的 sitemap 功能可以讓你提交網站地圖，讓 Google 爬蟲能夠更快地索引網站內容，提高網站在搜尋結果中的曝光度。另外，GSC 還有一個功能叫做 "Crawl Errors"，可以告訴你爬蟲在爬取網站時發生的錯誤，讓你及時知道並修復網站上的錯誤。

- 安裝套件 google 引擎的 [hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap) 套件:

```bash
npm install hexo-generator-sitemap --save
```

- 設定 hexo 根目錄的 _config.yml:

```yaml
sitemap:
  path: sitemap.xml
```

- 部署

```bash
hexo clean
hexo generate
hexo deploy
```

- 檢查 sitemap.xml 是否可以被訪問，若可以的話就即可設定至 Google Search Console

```bash
# https://你的域名/sitemap.xml
https://blog.boshkuo.com/sitemap.xml
```

- 完成 Google Search Console 設定：  
![sitemap](https://res.cloudinary.com/djtoo8orh/image/upload/v1674900781/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-5/sitemap_cyrirs.png)

將 sitemap 提交網站地圖後，要被 google 搜尋引擎收入，保守估計至少要等到一個星期左右，因為提交網站地圖並不能立即使網站被收入。提交網站地圖只是讓 google 爬蟲能夠更快地索引網站內容，但是實際上 google 爬蟲仍需要一段時間來爬取網站內容並對其進行評估。如果網站內容是有價值且符合 google 的質量指標，那麼網站就有可能在一個星期內被收入。如果想要讓網站更快被收入，建議經常更新網站內容並且遵循 google 的質量指標。


<br/>

## **Reference**

- **[SEO小教室｜Google Search Console驗證與提交XML Sitemap教學](https://www.wpandseo.tw/715/seo-google-search-console-validation/#domain)**
- **[Hexo-Butterfly-主题-谷歌搜索引擎优化](https://qyun.fun/posts/6452ae09/)**
- **[(24) 試著學 Hexo - SEO 篇 - Google Search Console](https://israynotarray.com/hexo/20201007/3723180073/)**
- **[Butterfly 進階篇（一） - SEO 優化搜索引擎收錄](https://qmike.top/posts/2a1b5a62)**