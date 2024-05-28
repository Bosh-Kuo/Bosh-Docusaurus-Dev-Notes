---
title: 在 Vite + TypeScript 專案中設定路徑別名(path alias)
sidebar_label: "[問題紀錄] 在 Vite + TypeScript 專案中設定路徑別名(path alias)"
description: 本篇文章記錄如何在 Vite + TypeScript 專案下設定路徑別名(path alias)。
last_update:
  date: 2023-05-30
keywords:
  - Vite
  - TypeScript
tags:
  - Vite
---


## **問題**

資料夾深度很深的專案中使用路徑別名在是一種常見的方法，可以幫助我們再 import 時少打很多字，讓排版更簡潔。最近我開始嘗試使用 Vite 以及 TypeScript 來建立新專案，我嘗試在 `vite.config.ts` 裡設置路徑別名，如下所示

```jsx
export default defineConfig({
	...
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

但是我使用 `@`來從 components 資料夾引入 Layout 模組的時候 VSCode 編輯器卻跳出`找不到模組 '@/components/Layout' 或其對應的型別宣告。` 的錯誤訊息。


<br/>


## **原因**

TypeScript 找不到模組和型別宣告的問題可能有幾個原因：

1. TypeScript 編譯器無法正確解析別名
2. 缺少必要的型別宣告檔案：如果使用了自定義的別名或第三方 library，而沒有相應的型別宣告檔案，TypeScript 編譯器可能無法正確識別模組的型別
3. 別名設定有誤

因為 TypeScript 編譯器預設只會按照相對或絕對路徑來解析模組引入，這個例子中我們沒有告訴 TypeScript 編譯器如何處理別名，編譯器無法理解模組別名 `@`，才會在編譯過程中產生錯誤。


<br/>


## **解決方法**

在 `tsconfig.json` 中，我們可以使用 `paths` 屬性來定義模組別名和對應的路徑。這樣，當程式碼中使用別名引入模組時，TypeScript 編譯器就能夠根據 `tsconfig.json` 中的設定來正確解析路徑。

將在`vite.config.ts` 裡設置的路徑別名一併設定到 `tsconfig.json` 裡：

```json
"compilerOptions": {
    // ... your other compiler options
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
    },
  },
```

此外，也必須確認專案有安裝 **`@types/node`** 套件，如果未安裝這個套件，編譯器無法正確解析 Node.js 相關模組的類型以及相關的語法提示和自動完成功能。


<br/>


## **Reference**

- **[Day_11 : 讓 Vite 來開啟你的 Vue 之 Config 常見配置 (Vite 最終篇 XD)](https://ithelp.ithome.com.tw/m/articles/10270465)**
- **[Shared Options](https://vitejs.dev/config/shared-options.html) (@Vite)[](https://vitejs.dev/config/shared-options.html#shared-options)**
- **[Aliasing paths in Vite projects w/ TypeScript](https://dev.to/tilly/aliasing-in-vite-w-typescript-1lfo)**