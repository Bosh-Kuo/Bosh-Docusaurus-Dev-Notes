---
title: Markdown Features
sidebar_label: "[學習筆記] Markdown Features"
description: Docusaurus 專案 - Markdown 編輯功能
last_update:
  date: 2023-02-19
keywords:
  - Docusaurus
  - Markdown
tags:
  - Docusaurus
---


Docusaurus 2 使用可以編寫交互式文檔，使用者可以在 markdown 中嵌入 React 組件，或構建互動式 codeblock，讓讀者可以在即時看到程式碼的渲染結果。以下功能可參閱官方文檔的範例圖示與使用說明。

## **Standard Features**

- [Front-matter](https://docusaurus.io/docs/markdown-features#front-matter): Markdown 文件的 metadata
- [Quotes](https://docusaurus.io/docs/markdown-features#quotes): 引用框
- [Details](https://docusaurus.io/docs/markdown-features#details): Toggle 展開

## **MDX and React**

- [Exporting-components](https://docusaurus.io/docs/markdown-features/react#exporting-components): 導出元件
- [Importing-components](https://docusaurus.io/docs/markdown-features/react#importing-components): 導入元件
- [Mdx-component-scope](https://docusaurus.io/docs/markdown-features/react#mdx-component-scope): 將 component 註冊到全局範圍，這將使它在每個 MDX 文件中自動可用，而無需任何 import 語句。
- [Markdown-and-jsx-interoperability](https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability): Markdown jsx 交互使用時常會遇到的問題
- [Importing-code-snippets](https://docusaurus.io/docs/markdown-features/react#importing-code-snippets): 將任何程式碼文件作為原始文本導入
- [Importing-markdown](https://docusaurus.io/docs/markdown-features/react#importing-markdown): 將名稱有 `_` 前綴的 markdown 文件作為 `partial` 引入，作為 component
- [Available-exports](https://docusaurus.io/docs/markdown-features/react#available-exports): 全局變量

## **Tabs**

- [Syncing-tab-choices](https://docusaurus.io/docs/markdown-features/tabs?current-os=ios#syncing-tab-choices): 同步相同類型的 Tabs
- [Customizing-tabs](https://docusaurus.io/docs/markdown-features/tabs?current-os=ios#customizing-tabs): 自定義 Tabs 樣式
- [Query-string](https://docusaurus.io/docs/markdown-features/tabs?current-os=ios#query-string): 將選定的 Tab 作為 search parameter 加入 url 中

## **Code blocks**

- [Code-title](https://docusaurus.io/docs/markdown-features/code-blocks#code-title): 加入 `title=<codeblock 標題>`
- [Syntax-highlighting](https://docusaurus.io/docs/markdown-features/code-blocks#syntax-highlighting): 設定 code blocks 主題與支持語言
- [Line-highlighting](https://docusaurus.io/docs/markdown-features/code-blocks#line-highlighting): highlight 特定行數的程式碼
- [Line-numbering](https://docusaurus.io/docs/markdown-features/code-blocks#line-numbering): 加入 `showLineNumbers` 以顯示行號
- [Interactive-code-editor](https://docusaurus.io/docs/markdown-features/code-blocks#interactive-code-editor): 在 jsx code block 後加上 `live` 直接在頁面上渲染出 React component
- [Using-jsx-markup](https://docusaurus.io/docs/markdown-features/code-blocks#using-jsx-markup): 嵌入 HTML markup
- [Multi-language-support-code-blocks](https://docusaurus.io/docs/markdown-features/code-blocks#multi-language-support-code-blocks): 使用 Tabs 切換多種程式語言 code blocks
- [Usage-in-jsx](https://docusaurus.io/docs/markdown-features/code-blocks#usage-in-jsx): 在 js 中使用 `<CodeBlock>`

## **Admonitions**

- [Usage-with-prettier](https://docusaurus.io/docs/markdown-features/admonitions#usage-with-prettier): 避免 Prettier 錯誤修改 admonitions 語法
- [Specifying-title](https://docusaurus.io/docs/markdown-features/admonitions#specifying-title): 在 admonition 加上標題
- [Admonitions-with-mdx](https://docusaurus.io/docs/markdown-features/admonitions#admonitions-with-mdx): 在 MDX 中使用 admonition
- [Usage-in-jsx](https://docusaurus.io/docs/markdown-features/admonitions#usage-in-jsx): 在 JSX 中使用 admonition
- [Customizing-admonitions](https://docusaurus.io/docs/markdown-features/admonitions#customizing-admonitions): 客製化 admonitions 樣式

## **Headings and Table of contents**

- [Markdown-headings](https://docusaurus.io/docs/markdown-features/toc#markdown-headings)
- [Table-of-contents-heading-level](https://docusaurus.io/docs/markdown-features/toc#table-of-contents-heading-level)
- [Inline-table-of-contents](https://docusaurus.io/docs/markdown-features/toc#inline-table-of-contents): 直接在 Markdown 內顯示 TOC table

## **Assets**

- [images](https://docusaurus.io/docs/markdown-features/assets#images)
- [files](https://docusaurus.io/docs/markdown-features/assets#files): 在頁面中嵌入文件下載連結
- [inline-svgs](https://docusaurus.io/docs/markdown-features/assets#inline-svgs)
- [themed-images](https://docusaurus.io/docs/markdown-features/assets#themed-images)
- [static-assets](https://docusaurus.io/docs/markdown-features/assets#static-assets)

## **Math**

- [Usage](https://docusaurus.io/docs/markdown-features/math-equations#usage)
- [Configuration](https://docusaurus.io/docs/markdown-features/math-equations#configuration)
- [Self-hosting-katex-assets](https://docusaurus.io/docs/markdown-features/math-equations#self-hosting-katex-assets)
- [Upgrading-rehype-katex-beyond-recommended-version](https://docusaurus.io/docs/markdown-features/math-equations#upgrading-rehype-katex-beyond-recommended-version)

## **Diagrams**

- [Installation](https://docusaurus.io/docs/markdown-features/diagrams#installation)
- [Usage](https://docusaurus.io/docs/markdown-features/diagrams#usage)
- [Theming](https://docusaurus.io/docs/markdown-features/diagrams#theming)
- [Mermaid Config](https://docusaurus.io/docs/markdown-features/diagrams#configuration)

## **Head metadata**

- [Customizing-head-metadata](https://docusaurus.io/docs/markdown-features/head-metadata#customizing-head-metadata)
- [Markdown-page-description](https://docusaurus.io/docs/markdown-features/head-metadata#markdown-page-description)

## **Reference**
- **[@Docusaurus](https://docusaurus.io/)**
  - **[Markdown Features](https://docusaurus.io/docs/markdown-features)**
  - **[MDX and React](https://docusaurus.io/docs/markdown-features/react)**
  - **[MDX docs](https://mdxjs.com/)**
  - **[Tabs](https://docusaurus.io/docs/markdown-features/tabs)**
  - **[Code blocks](https://docusaurus.io/docs/markdown-features/code-blocks)**
  - **[Admonitions](https://docusaurus.io/docs/markdown-features/admonitions)**
  - **[Headings and Table of contents](https://docusaurus.io/docs/markdown-features/toc)**
  - **[Assets](https://docusaurus.io/docs/markdown-features/assets)**
  - **[Markdown links](https://docusaurus.io/docs/markdown-features/links)** 
  - **[MDX Plugins](https://docusaurus.io/docs/markdown-features/plugins)**
  - **[Math Equations](https://docusaurus.io/docs/markdown-features/math-equations)**
  - **[Diagrams](https://docusaurus.io/docs/markdown-features/diagrams)**
  - **[Head metadata](https://docusaurus.io/docs/markdown-features/head-metadata)**