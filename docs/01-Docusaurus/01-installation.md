---
title: Getting Started
sidebar_label: Getting Started
description: Docusaurus 本地安裝教學
last_update:
  date: 2023-02-19
keywords:
  - Docusaurus
  - nvm
tags:
  - Docusaurus
---


## **Introduction**

Docusaurus 是一個由 Facebook 開發的`靜態網站生成器 (Static Site Generator, SSG)`，旨在為開發者和文檔編輯者提供一個簡單易用的框架，讓他們可以輕鬆地建立、維護和部署文檔網站，Docusaurus 的目錄結構非常清晰，易於理解和維護，且目錄可折疊，方便讀者閱讀文件的同時挖掘其他有興趣的內容。以下是 Docusaurus 的一些優點和特色：
1. 易於使用：Docusaurus 具有簡單的目錄結構和易於使用的命令行工具，可以快速構建一個完整的文檔網站。
2. 優秀的擴展性：Docusaurus 使用 React 和 Markdown 來構建頁面和組件。
3. 可定制性：Docusaurus 允許使用者自定義主題，為文檔網站添加自己的樣式和功能，同時還可以自定義部分配置項目。
4. 易於部署：Docusaurus 可以生成一個靜態網站，可以很方便地部署到各種平臺上，包括 GitHub Pages、Netlify、Vercel、AWS S3 等等。

## **Installation**
安裝當下 `Docusaurus` 最新版本為 `2.3.1`，`Node.js` 最低版本為 `16.14`。

我習慣使用 `nvm` 來管理該專案的 Node 環境。
首先確認可安裝的 Node.js 版本：
```bash
nvm ls-remote --lts
```


接著安裝最新的 LTS 版本
```bash
# 根據當前支援最新的 LTS 版本
nvm install 18.14.0
```

接著安裝 Docusaururs
```bash
npx create-docusaurus@latest my-website classic
```

安裝完成後可以進入專案資料節內新增一個 `.nvmrc` 檔，在第一行寫下剛安裝好的 Node.js 版本號 v18.14.0，未來只要下 `nvm use` 指令，就換自動切到該專案的版本，不需要去記各專案使用的 Node.js 版本。  
接下來執行 `npm start` 就可以在 [localhost:3000](http://localhost:3000) 看到最初始的網站了。




## **Reference**
- [Docusaurus](https://docusaurus.io/)  (官方文件)
- [Tutorial Intro](https://tutorial.docusaurus.io/docs/intro)  (官方教學)
- [nvm](https://github.com/nvm-sh/nvm)