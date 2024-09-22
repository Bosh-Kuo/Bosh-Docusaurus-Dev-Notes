---
title: Vite 環境變數 (Env Variables) 與模式 (Modes)
sidebar_label: 環境變數與模式
description: 這篇文章介紹了 Vite 開發環境中的「環境變數」與「模式 (Modes)」，並闡述了如何使用 Vite 提供的 import.meta.env 訪問環境變數，包含了模式與常見的 NODE_ENV 區別。文章詳細解釋了如何配置 .env 文件來自定義變數，並通過命令行來切換模式，幫助讀者靈活掌控 Vite 開發中的環境設定，避免與傳統 NODE_ENV 概念的混淆。
last_update:
  date: 2024-09-22
keywords:
  - Vite
  - import.meta.env.MODE
  - NODE_ENV
  - Modes
tags:
  - Vite
---


> 在 Vite 開發環境中，除了 **「環境變數」** 外還有個 Vite 自己特有的概念稱之為 **「模式 (Mode)」**。由於 Mode 的用途跟 **NODE_ENV** 很類似，我在開發時有時候也會不小心把這兩者搞混。本篇文章簡單介紹了在 Vite 中環境變數與模式的使用方法，以及模式與 NODE_ENV 的區別，希望能幫助大家避免更靈活地使用 Vite 來開發！
> 

## **在 Vite 中如何使用環境變數？**

Vite 提供了一個簡單的方式來在程式碼中訪問環境變數，那就是透過 `import.meta.env`。這是 Vite 的環境變數專屬入口，內置了一些有用的預設變數，例如：

- `import.meta.env.MODE`：告訴你當前應用運行在哪個模式（預設為 "development" 或 "production"）。
- `import.meta.env.BASE_URL`：由 `vite.config.js` 中的 base 選項決定的應用基礎路徑。
- `import.meta.env.PROD`：布林值，表示應用是否處於生產環境。
- `import.meta.env.DEV`：布林值，與 PROD 相對，表示應用是否處於開發環境。
- `import.meta.env.SSR`：布林值，表示應用是否在服務端運行。

:::tip[常見疑問]
**為什麼不能在 Vite 應用的程式碼中直接使用 process.env？**  
簡單來說，`process.env` 是 Node.js 的專屬 API，無法在瀏覽器中使用，而 Vite 開發環境下並不會進行打包，而是直接讓 .js 檔案在瀏覽器中運行。因此，環境變數只能透過 `import.meta.env` 訪問。不過，由於 `vite.config.js` 是在 Node.js 環境中執行的，所以可以直接使用 process.env。
:::

## **如何用 .env 文件自定環境變數**

Vite 支援多種 `.env` 文件：

- `.env`：任何時候都會加載
- `.env.local`：任何時候都會加載，但在以 vite 創建的專案中會被 git 忽略
- `.env.[mode]`：只在特定模式下加載，例如 `.env.production`
- `.env.[mode].local`：只在特定模式下加載，但在以 vite 創建的專案中會被 git 忽略

:::tip
Vite 執行時，優先級是命令行中的環境變數 > 指定模式的 `.env.[mode]` 文件 > 通用 `.env` 文件
:::

:::caution
為了防止敏感資訊意外洩露到客戶端，只有以 `VITE_` 為前綴的變量才會被暴露出來。例如：例如，VITE_SOME_KEY=123 可以在程式碼中訪問，但 DB_PASSWORD 則無法被瀏覽器讀取。
:::


## **Vite 的模式 (Modes)**

在 Vite 開發環境中，模式（Modes）可以視為應用的運行環境，比如開發環境與生產環境。Vite 預設提供了兩個模式：

- **development**：開發模式，用於啟動開發服務器。
- **production**：生產模式，用於打包應用。

你也可以通過命令行自定義模式：

```tsx
vite build --mode staging
```

## **NODE_ENV 和 Modes 的關係**

對於有 Webpack 經驗的開發者來說，可能會困惑 Vite 中的 NODE_ENV 與模式（Mode）有何不同。簡單來說，NODE_ENV 是一個全局的環境變數，通常表示運行環境，而模式（Mode）是 Vite 內部管理要用哪一組環境變數的機制。不同的命令會改變 NODE_ENV 和模式的值：

| **Command**                                          | **NODE_ENV**  | **Mode**      |
| ---------------------------------------------------- | ------------- | ------------- |
| `vite build`                                         | "production"  | "production"  |
| `vite build --mode development`                      | "production"  | "development" |
| `NODE_ENV=development vite build`                    | "development" | "production"  |
| `NODE_ENV=development vite build --mode development` | "development" | "development" |

不同的 NODE_ENV 也會反映在 `import.meta.env` 中：

| Command                  | **import.meta.env.PROD** | **import.meta.env.DEV** |
| ------------------------ | ------------------------ | ----------------------- |
| **NODE_ENV=production**  | true                     | false                   |
| **NODE_ENV=development** | false                    | true                    |
| **NODE_ENV=other**       | false                    | true                    |

而 `import.meta.env.MODE` 的值則會根據你選擇的模式來改變：

| **Command**            | **import.meta.env.MODE** |
| ---------------------- | ------------------------ |
| **--mode production**  | "production"             |
| **--mode development** | "development"            |
| **--mode staging**     | "staging"                |

## **Reference**

- [**@Vite - Env Variables and Modes**](https://vitejs.dev/guide/env-and-mode.html)
