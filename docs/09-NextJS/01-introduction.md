---
title: 認識 Next.js
sidebar_label: "[快速導讀] 認識 Next.js"
description: 本篇為閱讀 Next.js 官方教學文章的學習筆記
last_update:
  date: 2023-03-15
keywords:
  - React
  - Next.js
tags:
  - React
  - Next.js
---


## **Next.js 是什麼?**
`Next.js` 是一個基於 React 的全端框架。它可以讓開發者更快速地建立 React 應用程式，並且可以輕鬆地實現**伺服器端渲染(Server-side rendering, SSR)、靜態網頁產生(Static Generation, SG)、路由、預取資料(prefetching)等功能**。Next.js 的獨特之處在於它提供了一個內建的伺服器端渲染的功能，讓應用程式的初次載入時間更短，並且讓 SEO 更為友好。

Next.js 主要針對 `SSR` 和 `SG` 做了優化。它提供了許多內置功能，例如**自動代碼分割(code splitting)、預取(data fetching) 和懶加載(lazy loading)、靜態資源優化**等，這些都可以幫助提高應用程式的性能。此外，Next.js 還支持自定義路由和伺服器端 API 等功能，使得開發人員可以更加靈活地構建應用程式。


<br/>


## **Next.js 如何讓你更輕鬆地使用 React 建立網站?**
### **使用 React 打造完整的網頁應用程式所需注意的細節**
儘管 React 在構建 UI 方面表現出色，但將 UI 獨立構建為功能齊全的網頁應用程式還需要考慮許多細節。舉例來說，像是:

- **Routing**
- **Data Fetching**
- **Integrations (third-party services)**
- **Infrastructure (where you deploy, store, and run your application code)**
- **Performance**
- **Scalability (how your application adapts as your team, data, and traffic grow.)**
- **Developer Experience**

這可能會使得初學者感到困惑，因為要達成這些需求需要額外自行設定許多第三方工具。但是，使用 Next.js 可以使這個過程更加容易 Next.js 為上述所有問題提供了解決方案。Next.js 擁有很好的開發體驗和許多內置功能，例如：

- **[基於頁面的路由系統](https://nextjs.org/docs/basic-features/pages)**（支持[**動態路由**](https://nextjs.org/docs/routing/dynamic-routes)）
- **[預渲染](https://nextjs.org/docs/basic-features/pages#pre-rendering)**，支持基於頁面的[**靜態生成**](https://nextjs.org/docs/basic-features/pages#static-generation-recommended)（SG）和[**伺服器端渲染**](https://nextjs.org/docs/basic-features/pages#server-side-rendering)（SSR）
- 自動代碼拆分以加快頁面加載速度
- [**客戶端路由**](https://nextjs.org/docs/routing/introduction#linking-between-pages)帶有優化的預取
- 內置 CSS 和 Sass 支持，並支持任何[**CSS-in-JS**](https://nextjs.org/docs/basic-features/built-in-css-support#css-in-js)庫
- 支持 [**Fast Refresh**](https://nextjs.org/docs/basic-features/fast-refresh) 的開發環境
- [**API路由**](https://nextjs.org/docs/api-routes/introduction) 可用於構建帶有無服務器函數的API端點


<br/>


## **Next.js 如何運作?**
### **開發階段(Development Environments)與生產階段(Production Environments)**

Next.js 在開發階段與生產階段提供了不同的功能：
- `開發階段`: Next.js 會優化開發人員的體驗，提供像 [TypeScript](https://nextjs.org/docs/basic-features/typescript), [ESLint integration](https://nextjs.org/docs/basic-features/eslint), [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh) 等功能，以改善開發人員的開發體驗。

- `生產階段`: Next.js 則會優化給使用者使用應用程式的體驗，並且會將程式碼轉換為高效能且具有可訪問性的程式碼。因為每個階段都有不同的需求和目標，所以當從開發環境轉移到生產環境時，需要進行許多工作。例如，程式碼需要 [compiled](https://nextjs.org/learn/foundations/how-nextjs-works/compiling), [bundled](https://nextjs.org/learn/foundations/how-nextjs-works/bundling), [minified](https://nextjs.org/learn/foundations/how-nextjs-works/minifying), [code split](https://nextjs.org/learn/foundations/how-nextjs-works/code-splitting)


### **什麼是 Compiling?**
在開發階段，開發者常常會使用像是 JSX、TypeScript 和現代版本的 JavaScript 來增強開發體驗與效率。但瀏覽器通常沒辦法“理解”這些程式碼，它們需要先被轉換為瀏覽器能夠“看得懂”的 JavaScript。`Compiling` 是指將原始碼轉換成可執行的程式碼。在 Next.js 中，編譯通常發生在兩個階段：開發階段和生產階段。

1. 開發階段
在開發階段，Next.js 會將 React 和其他程式碼轉換為可以在瀏覽器上運行的 JavaScript 代碼。為了提高開發體驗，Next.js 還會自動偵測原始碼的更改，並快速重新編譯，這樣你就可以立即看到變化。

2. 生產階段
在生產階段，Next.js 會將應用程式打包成一個或多個最終的 JavaScript 和 CSS 文件。此過程包括將 React 程式碼編譯成可以運行的 JavaScript 代碼，並最小化代碼的大小，以提高頁面載入速度。此外，Next.js 會自動使用優化技術，如**代碼分割**和**延遲加載**，以確保網頁的性能和效率。這些優化技術可以幫助減少頁面的載入時間和數據傳輸量，從而提高用戶體驗。


在將應用程式從開發階段移植到生產階段時，還需要進行其他一些操作。這些操作包括程式碼壓縮、優化圖像、使用 CDN 加速等，以確保應用程式可以快速而穩定地運行。Next.js 提供了一些內置的優化功能，以簡化這些過程，幫助開發人員快速將應用程序推向生產環境。


### **什麼是 Minifying?**
開發者寫 code 時一定會把可讀性擺在第一位，因此程式碼裡面可能包含代碼運行所**不需要的額外信息**，例如**註釋、空格、縮進和多行**。在 Next.js 中，`Minifying` 是一個在 production 環境下將程式碼最小化的過程。`Minifying` 的目的是為了減少傳輸時間和網頁加載時間，因為程式碼越小，下載和解析的時間就越短。

`Minifying` 會將 JavaScript 和 CSS 檔案中的所有不必要的字元（例如空格、換行符、註解等）都刪除，同時縮短變數名稱，以減少檔案大小。這些最小化的檔案仍然可以運行，但是它們的大小更小，因此可以更快地下載到使用者的瀏覽器中。



### **什麼是 Bundling?**
在 Next.js 中，Bundling 是指將應用程序中的所有模組和資源打包成一個或多個 bundle 的過程。這個過程使得應用程序能夠在瀏覽器中載入和運行。 Next.js 使用 Webpack 作為其主要的 Bundler，Webpack 是一個 JavaScript 應用程序的模組打包工具，它支援使用許多不同的模組格式（例如 CommonJS、AMD 和 ES6 模組）。

在 Next.js 中，Webpack 配置是預設的，因此大多數情況下，開發者通常不需要自己設置。但是我們也可以透過 **`next.config.js`** 檔案來修改這些預設設置，例如**更改輸出目錄、指定自訂的 Webpack 設定或添加自訂的 Loader 和 Plugins。在 Bundle 時，Next.js 還會使用 `code-splitting` 技術，它可以將應用程序代碼和資源拆分成較小的塊，並在需要時動態載入。這樣可以大幅度減少初始載入時間和頁面大小，從而提高應用程序的性能和速度。



### **什麼是 Code Splitting?**
當網站有大量程式碼時，每次載入網站時都必須下載所有程式碼，這將導致網站載入時間變慢。`Code Splitting` 可以將程式碼拆分成較小的塊，並僅在需要時載入它們，從而減少網站的載入時間。在 Next.js 中，`Code Splitting` 是自動進行的，並且支援靜態和動態頁面。當 Next.js 載入一個頁面時，它只下載該頁面所需的程式碼，而不是下載整個應用程式的程式碼。這可以大大減少頁面載入時間，提高用戶體驗。

![](https://nextjs.org/static/images/learn/foundations/code-splitting.png)


### **Build Time 與 Runtime 的差別**
Next.js 中的 `Build Time` 和 `Runtime` 涉及到應用程式的生命週期和部署方式。

- **Build Time (or build step)** 是指在開發者將應用程式部署到伺服器上時所進行的編譯、打包、壓縮等過程，通常是在應用程式上線之前完成。在 Next.js 中，開發者可以使用 **`npm run build`** 指令來進行 Build Time。在 Build Time 中，Next.js 會根據頁面之間的相依關係自動進行代碼分割（Code Splitting）和最小化（Minification），從而減少應用程式的文件大小，提高載入速度。

- **Runtime (or request time)** 則是指在使用者訪問應用程式時所進行的運行過程，通常是在應用程式上線之後。在 Next.js 中，當使用者訪問頁面時，Next.js 會動態加載相關代碼。這種動態加載方式可讓應用程式更快地載入，並幫助減少冗餘的請求和加快頁面的載入速度。


<br/>


## **關於 Rendering**
在 Next.js 中，有兩種主要的渲染方式：**`Client-Side Rendering（CSR）`**和 **`Pre-Rendering（預渲染）`**。

- **`Client-Side Rendering（CSR）`:**
在標準的 React App 中，當使用者在瀏覽器中輸入網址時，瀏覽器會向伺服器發送請求，然後伺服器返回一個**空的 HTML 文件以及 JS 檔案**，JavaScript 會運行並生成網頁內容，然後顯示在用戶的瀏覽器中。這種渲染畫面的模式就是 `CRS`，因為初始渲染工作是發生在使用者的設備上。
- **`Pre-Rendering（預渲染）`：**
Pre-Rendering 則是指在伺服器端（而非瀏覽器）渲染網頁，並將結果作為一個 HTML 檔案發送給瀏覽器。在使用者輸入網址並向伺服器發送請求時，伺服器會立即返回**已經完成的 HTML 文件**，用戶瀏覽器下載該文件後可以直接顯示網頁內容，無需再運行 JavaScript 代碼。
Pre-Rendering 可以提高頁面的載入速度和 SEO，因為網頁的內容已經在伺服器端渲染完成，瀏覽器只需下載 HTML 文件即可顯示網頁內容。
在 Next.js 中，可以使用兩種方式進行 Pre-Rendering：
  - `靜態生成（Static Generation）`：在**構建（build）階段**預先渲染頁面，不需要在每次請求時生成 HTML。這樣可以大幅減少伺服器負載和頁面載入時間，並且可以利用 CDN 進行緩存，使得用戶在請求相同頁面時可以直接從 CDN 獲取 HTML，進一步提升性能。
  - `伺服器端渲染（Server-Side Rendering）`：當使用者請求頁面時，在伺服器端動態渲染該頁面，然後將結果作為 HTML 文件發送到瀏覽器。在客戶端，HTML 用於顯示快速的非交互式頁面，而 React 使用 JSON 數據和 JavaScript 指令使組件具有交互性（例如，將事件處理程序附加到按鈕），這個過程稱為 **hydration。**這種方式可以提供更好的用戶體驗，因為網站的資料在 `SSR` 的情況下都是在 server 端就已經取得並在 server 端做渲染，所以在 client 端只需要載入已經渲染完成的資料，所以載入速度相對而言較快。在 Next.js 中，使用者可以使用 [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) 選擇 `SSR`。 


<br/>


## **Reference**
- **[@NEXT.js](https://nextjs.org/)**
  - [**What is Next.js?**](https://nextjs.org/learn/foundations/about-nextjs/what-is-nextjs) 
  - [**How Next.js Works**](https://nextjs.org/learn/foundations/how-nextjs-works)
  
