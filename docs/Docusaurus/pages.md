---
sidebar_position: 1
description: Docusaurus 專案 - 創建獨立頁面(Pages)
last_update:
  date: 2023-02-19
keywords:
  - Docusaurus
  - React
  - Pages
tags:
  - Docusaurus
---

# Pages
`@docusaurus/plugin-content-pages` 這個套件讓使用者可以建立獨立頁面，參考官方創建的Docusaurus 專案便會預設安裝 `@docusaurus/preset-classic` 套件，就不需要額外安裝這個套件，若沒有的話可以以下列指令安裝:
```bash
# npm
npm install --save @docusaurus/plugin-content-pages

# yarn
yarn add @docusaurus/plugin-content-pages
```

:::tip
💡 詳細設定可參考 [📦 plugin-content-pages](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages)
:::

## 建立 Page

用來作為單獨頁面的文件放置於 `src/pages` ，單獨頁面文檔可以是 `.js`、`.mdx` 或 `.md` 檔。除了直接放置在該目錄下之外，也可以在該目錄下創建資料夾，並將頁面檔案放置在裡面，最終的頁面路徑會包含資料夾的名稱。

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## React page

使用 React 來編寫的頁面需要導出一個 React component，若沒有在最外層使用 `Layout` component ，那頁面將不會套上任何主題樣式（navbar, footer, css）

```jsx
import React from 'react';
import Layout from '@theme/Layout';

export default function Hello() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          Edit <code>pages/helloReact.js</code> and save to reload.
        </p>
      </div>
    </Layout>
  );
}
```

- `title`: 顯示於分頁的文字
- `description`: 於 ```<head><meta></head>``` 中

## Markdown page

```jsx
---
title: my hello page title
description: my hello page description
hide_table_of_contents: true
---

# Hello

How are you?
```

- `title`: 顯示於分頁的文字
- `description`: 於 ```<head><meta></head>``` 中
- `hide_table_of_contents`: 是否隱藏目錄

## Routing

在 /src/pages/ 目錄下創建的任何 JavaScript 文件都將按照 /src/pages/ 目錄層次結構自動轉換為網站頁面。

- `/src/pages/index.js` → `[baseUrl]`
- `/src/pages/foo.js` → `[baseUrl]/foo`
- `/src/pages/foo/test.js` → `[baseUrl]/foo/test`
- `/src/pages/foo/index.js` → `[baseUrl]/foo/`

Docusaurus Docusaurus 建議將樣式與特定頁面組件放在其同一個目錄中，如下資料夾結構所示：

```jsx
my-website
├── src
│   └── pages
│       ├── styles.module.css
│       ├── index.js
│       ├── _ignored.js
│       ├── _ignored-folder
│       │   ├── Component1.js
│       │   └── Component2.js
│       └── support
│           ├── index.js
│           └── styles.module.css
.
```

:::tip
src/pages/ 目錄中的所有 JavaScript/TypeScript 文件都會生成相應的網站路徑。如果要在該目錄中創建可重用組件，可以使用**排除選項**（默認情況下，**前綴為 _ 的文件、測試文件（.test.js）和 tests 目錄中的文件**不會轉換為頁面）。
:::

## Reference
- [Creating Pages](https://docusaurus.io/docs/creating-pages)
- [📦 plugin-content-pages](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages)