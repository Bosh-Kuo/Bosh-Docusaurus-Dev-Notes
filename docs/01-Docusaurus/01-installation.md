---
title: 認識 Docusaurus3
sidebar_label: "Docusaurus 簡介"
description: 本文將詳細介紹 Docusaurus 的基本概念、功能特色，以及我從 Hexo 遷移至 Docusaurus 的過程，並提供完整的安裝步驟和專案結構導覽，幫助更多開發者輕鬆上手這個強大的工具。
last_update:
  date: 2024-06-10
keywords:
  - Docusaurus
  - Install
  - nvm
tags:
  - Docusaurus
---

作為一名喜歡記錄筆記的軟體工程師，我喜歡透過撰寫筆記來學習新的技術，也喜歡使用像是 Notion 這樣的筆記軟體來記錄我日常的工作進度與記錄。我認為如果能將這些筆記組織成系統化的文檔，並公開分享出去，不僅可以鞏固自己的學習，還能為他人提供價值，這就是我開始考慮建立個人技術部落格的原因。

**Docusaurus** 是目前流行的部落格搭建工具中，最符合我的需求與喜好的工具。它的易用性靈活性讓我可以輕鬆地管理我的技術筆記，同時又具備優秀的擴展性，讓我可以根據我的喜好為網站添加各種功能以及自定義網站的版面。


## **Docusaurus 簡介**

**Docusaurus** 是一個由 Meta(Facebook) 開發的靜態網站生成器 (Static Site Generator, SSG)，專門用於構建文檔網站。這個工具的最大優勢在於它的簡單易用性和強大的功能。**Docusaurus** 基於 **React** 和 **Markdown**，讓我可以用最熟悉的工具快速搭建出一個功能齊全的文檔網站。

### **Docusaurus 有什麼功能？**

**Docusaurus** 提供了一系列強大的功能，以下是 **Docusaurus** 的一些優點和特色：

- **易於安裝和使用**：**Docusaurus** 提供簡單的 CLI 工具，可以快速初始化和配置專案。
- **支持 Markdown 和 MDX**：**Docusaurus** 支持使用 Markdown 撰寫文檔，並且可以使用 MDX（Markdown + JSX）來嵌入 React 元件，使文檔更具互動性。
- **多語言支持**：內建多語言支持，適合需要面向多語言使用者。
- **版本控制**：可以輕鬆管理不同版本的文檔，適合有長期維護需求的專案。
- **插件系統**：支持各種官方和社區插件，能夠擴展功能，如搜索、分析、SEO 等。
- **主題自定義**：提供現成的主題，並支援開發者自定義主題，使用者甚至可以撰寫 React 元件來創建自定義頁面。
- **SEO 友好**：內建 SEO 最佳化功能，幫助提高搜索引擎排名。

### **為什麼我選擇從 Hexo 搬移到 Docusaurus？**

2022 年初，我用 **Hexo** 創建了我人生中第一個自己的部落格網站 [**Bosh's Blog**](https://blog.boshkuo.com/) 。那時我花了好幾個禮拜研究怎麼客製化我的 Hexo 部落格，甚至把我的設置過程全部記錄起來，寫成一系列的 Hexo 教學文章：

- [**從零開始使用 Hexo + Github Page 搭建個人技術筆記網站**](https://notes.boshkuo.com/docs/Hexo/Basic/hexo-from-scratch-1)
- [**Hexo 進階補充系列**](https://notes.boshkuo.com/docs/Hexo/Advance/hexo-advanced-supplementary-1)

在尋找適合的部落格搭建工具的過程中，我注意到中文技術社群的偏好隨時間有所變化。幾年前，當我在網上搜索程式相關的主題時，大多數搜尋結果都指向使用 **Hexo** 建立的技術部落格。然而，從 2022 年開始，我發現越來越多的中文技術部落格開始使用 **Docusaurus** 作為他們的網站生成工具。這個明顯的趨勢轉變引起了我對 **Docusaurus** 的興趣，促使我深入了解這個新興的部落格網站搭建工具。

經過了一段時間的研究後，我在 2023 年初毅然決然決定將我的技術部落格平台從 **Hexo** 轉移到 **Docusaurus** 上，主要是因為我在 **Docusaurus** 上看到了許多 **Hexo** 沒有的優點，包括：

- **清晰的側邊欄文檔分類**：
**Docusaurus** 提供了預設的側邊欄結構，讓我可以輕鬆地組織和分類文檔，側邊欄的結構非常清晰明了，讀者可以快速找到他們需要的資訊。
- **高度可自定義**：
**Hexo** 的主題系統雖然靈活，但要實現深度自定義需要花費大量時間和精力。而 **Docusaurus** 基於 React 開發，這讓我可以利用現有的 **React** 知識來快速進行自定義，無論是修改主題還是添加新功能，都變得更加簡單高效。
- **教學資源集中**：
**Docusaurus** 的官方文檔非常詳細且易於理解，並且有一個活躍的社區提供支持。相比之下，**Hexo** 的社群雖然也很豐富，但是學習資源分散，但在遇到某些問題時，往往需要花費更多時間在網上搜尋與比對解決方案。
- **底層基於 React**：
作為一個熟悉 **React** 生態系統的開發者，使用 **Docusaurus** 給人一種安心的感覺。我可以利用 **React** 的所有強大功能和工具來構建和維護我的文檔網站，當配置發生任何的問題時，我可以利用我現有的 **React** 知識來解決，而這在 **Hexo** 中是無法實現的。

### **他們也在用 Docusaurus**

選擇一個工具時，看到其他知名公司和項目也在使用它，無疑會增加我們的信心。**Docusaurus** 的成功案例眾多，從開源專案到大型企業，許多都選擇了這個工具來管理和展示他們的技術文件。

Facebook 作為 **Docusaurus** 的開發者，自然是這個工具的最大使用者之一。他們用 Docusaurus 來管理許多開源項目的文件，包括著名的 **Create-React-App** 和 **React Native**。這些專案的文件不僅結構清晰，而且內容豐富，為全球開發者提供了巨大的幫助。

在 JavaScript 生態系統中，**Docusaurus** 的身影隨處可見。**Jest**，這個由 Facebook 開發的 JavaScript 測試框架，就是使用 **Docusaurus** 的典範之一。同樣，**Redux**，那個廣泛應用於大型應用的 JavaScript 狀態管理庫，也選擇了 **Docusaurus** 來構建其文件網站。

不僅是大型企業和框架，許多流行的開源工具也選擇了 **Docusaurus**。比如 **Prettier** 以及 **Babel**，它們都使用 **Docusaurus** 來展示其文件。

這些成功的案例證明了 **Docusaurus** 的可靠性。無論是企業級的複雜項目，還是個人或小團隊的開源項目，**Docusaurus** 都能提供強大的支持。對於那些希望構建一個高品質文檔網站的開發者來說，**Docusaurus** 無疑是最佳選擇之一。


<br/>


## **安裝步驟**

### **以 NVM 管理本地端 Node.js 版本**

目前我使用的 **Docusaurus** 版本為 3.4.0，**Docusaurus** 從 v3 開始對 Node.js 版本的最低要求為 v18 以上。通常我習慣使用 **nvm** 來管理專案的 Node.js 版本。

1. 首先確認可安裝的 Node.js 版本：
    
    ```bash
    nvm ls-remote --lts
    ```
    
2. 安裝最新的 LTS 版本(我之前安裝的版本為 v20.9.0)
    
    ```bash
    # 根據當前支援最新的 LTS 版本安裝即可
    nvm install 20.9.0
    ```
    
3. 創建 **.nvmrc** 檔案
    
    ```bash
    # .nvmrc
    v20.9.0
    ```
    
4. 使用 **.nvmrc** 指定的 Node.js 版本
    
    ```bash
    nvm use
    ```
    

### **初始化一個新的 Docusaurus 專案**

接下來，使用以下指令來創建一個新的 Docusaurus 專案，我在自己的專案中選擇了 TypeScript 版本：

```bash
npx create-docusaurus@latest my-website classic --typescript
```

這段指令會幫我們生成一個名為 **my-website** 的 Docusaurus 專案，並使用 `classic` 模板及 **TypeScript** 設置。進入專案目錄後，就可以透過 npm or yarn or pnpm 使用以下指令啟動本地開發伺服器：

```bash
yarn start
```

啟動後，打開瀏覽器並訪問 `http://localhost:3000`，就會看到一個運行中的 Docusaurus 網站。

### **基本指令**

以下是 **Docusaurus** 在 package.json 中常用指令的解釋：

- **docusaurus start**
    - 啟動本地開發伺服器，在默認瀏覽器的 **http://localhost:3000** 上運行。這個命令會監視我們的源文件，當我們修改內容時自動重新加載頁面，提供即時的預覽。
- **docusaurus build**
    - 生成靜態網站文件，準備部署到生產環境。這會在 **build** 目錄中生成最終的靜態文件。
- **docusaurus swizzle**
    - **"Swizzle"** 是 Docusaurus 中的一個特殊概念，它允許我們自定義或替換 **Docusaurus** 的默認元件。使用這個命令，**Docusaurus** 會將指定的內部元件（如導航欄、側邊欄等）複製到專案目錄中，供我們自由修改，對於需要深度自定義網站外觀的開發者非常有用。
- **docusaurus deploy**
    - 打包網站靜態資源並部署到 GitHub Pages。注意，這需要在 `docusaurus.config.ts` 中正確配置 **organizationName**、**projectName** 等字段。
    - 這個命令會自動處理 Git 提交和推送到 `gh-pages` 分支。
- **docusaurus clear**
    - 清除 **Docusaurus** 生成的靜態文件和臨時文件。如果遇到 build 相關的問題，運行這個命令可能會有幫助。
- **docusaurus serve**
    - 在本地伺服器上預覽生成的靜態網站。你通常會先運行 **yarn build**，然後運行 **yarn serve** 來查看構建結果。
- **tsc**
    - 這不是 **Docusaurus** 特有的命令，而是 **TypeScript** 的一部分。它會運行 TypeScript 編譯器來檢查程式碼是否有任何型別錯誤。


<br/>


## **專案結構導覽**

### **目錄與文件結構**

一個典型的 Docusaurus 專案目錄結構如下所示：

```
my-website
├── blog
│   ├── 2019-05-28-hola.md
│   ├── 2019-05-29-hello-world.md
│   └── 2020-05-30-welcome.md
├── docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   └── mdx.md
├── src
│   ├── css
│   │   └── custom.css
│   └── pages
│       ├── styles.module.css
│       └── index.tsx
├── static
│   └── img
├── docusaurus.config.ts
├── package.json
├── README.md
├── sidebars.ts
└── yarn.lock
```

接下來，我們將逐一介紹各個目錄及其用途，並說明在新增功能或設定時需要修改的檔案。

- **/blog**：存放部落格文章，每個檔案以 Markdown 格式撰寫。
- **/docs**：存放所有的文件檔案，每個檔案通常以 Markdown 或 MDX 格式撰寫
- **/src**：包含自訂的 React 元件和頁面
    - **/css**：存放自訂的 CSS 樣式。
    - **/pages**：存放自訂頁面的元件，一個元件及對應一個自訂頁面。
- **/static**：存放靜態資源，如圖片、CSS、JavaScript 檔案。這些資源會被複製到最終打包後的建構輸出目錄中。
- **docusaurus.config.ts**：主要的配置檔案，設定網站的基本資訊、導覽列、頁尾、插件等。
- **package.json**：列出了專案的依賴關係和指令。
- **sidebars.js**：定義文件的側邊欄結構，組織文件的展示順序和層級。也可以直接套用 Docusuaurus 的 **autogenerated** 設定

## **Reference**

- [**@Docusaurus**](https://docusaurus.io/)
    - [**Introduction**](https://docusaurus.io/docs)
    - [**Installation**](https://docusaurus.io/docs/installation)