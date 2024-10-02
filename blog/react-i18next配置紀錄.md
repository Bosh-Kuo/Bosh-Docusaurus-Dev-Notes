---
title: React 專案配置 i18n 多國語系
slug: react-i18next
authors: bosh
description: 這篇文章記錄了我在 React + TypeScript 專案中配置多國語系支持的過程，從工具選擇、需求分析到實際安裝與配置，帶你一步步了解如何使用 i18next 與 react-i18next 來實現應用的多語言切換功能。
keywords: [React, react-i18next, i18n, i18next-browser-languageDetector, i18next-http-backend]
tags: [React]
date: 2024-10-02
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1727802838/Docusaurus%20Blog/Blog/react-i18next/react-i18next_a2co8x.png
---

> 前言：  
最近我在更新公司內部的前端 Codebase，其中一項任務是為應用加入多國語系（i18n）的支持。雖然在舊專案上一直有在使用 i18n 的功能，但這是我第一次接觸 i18n 的配置，正好藉此機會把學習過程和實作細節記錄下來。


![](https://res.cloudinary.com/djtoo8orh/image/upload/v1727802838/Docusaurus%20Blog/Blog/react-i18next/react-i18next_a2co8x.png)

<!-- truncate -->

## **主要工具介紹：i18next 與 react-i18next**

在研究 React 應用程式中的多國語系解決方案時，[**18next**](https://www.i18next.com/) 和 [**react-i18next**](https://react.i18next.com/) 是最常被推薦的組合。

### **i18next**

**18next** 是一個強大且可擴充的國際化庫，專門用來處理語言轉換。i18next 的特點是可以跨框架使用，這讓它成為前後端通用的國際化解決方案。它的核心功能包括語言偵測、語言切換，以及使用 JSON 語系檔案來管理文本內容。

此外，i18next 支援多種插件，例如：當你想要根據用戶的偏好來設定語言時，可以透過語言檢測插件來判斷用戶的語言喜好。它還支援 HTTP 加載器，可以動態從伺服器端載入翻譯文件。

### **react-i18next**

**react-i18next** 則是 i18next 的 React 封裝。它的目的是讓 React 開發者能更方便地將 i18next 的功能整合進應用程式中。它提供了很多直觀的工具，例如 Hook (`useTranslation`) 和高階元件 (`withTranslation`)，讓我們能夠以更符合 React 思維的方式處理翻譯工作。

## **專案需求**

大致理解這些工具的作用後，我開始分析專案的需求。根據過去舊專案的 i18n 使用情況，目前的需求至少要包括：

- **支持中英文切換**：應用需要支持用戶隨時切換介面語言。
- **根據用戶的瀏覽器語言自動設置語言**：提升用戶體驗，讓應用自動選擇最合適的語言。
- **命名空間來管理翻譯文檔**：不同的功能模組應該有各自獨立的翻譯檔，避免文檔過於混亂。比如，通用部分 (`common`) 和應用特定部分 (`app`)。

## **安裝與配置**

### **套件安裝**

開始實作之前，首先要安裝所需的工具。以下是我在專案中使用的插件和它們的作用：

```bash
yarn add i18next i18next-browser-languagedetector i18next-http-backend react-i18next
```

- `i18next-http-backend`：這個插件用於從伺服器端加載翻譯文檔，可以方便我們將翻譯文案分開管理，並根據所需語言動態加載。
- `i18next-browser-languagedetector`：這個插件用於自動偵測用戶的瀏覽器語言，例如通過 URL 的查詢參數或瀏覽器的語言設置。

### **i18n 配置**

安裝完套件之後，下一步就是配置 **i18next**，讓它符合我們的需求。我根據官方文檔做了以下配置：

```tsx
// i18n.ts
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// 初始化配置
i18n
  .use(HttpBackend) // 使用 HttpBackend 來載入翻譯文件
  .use(LanguageDetector) // 使用語言檢測插件
  .use(initReactI18next) // 初始化 React i18next
  .init({
    // lng: 'zh-TW', // 預設語言
    fallbackLng: 'zh-TW', // 如果檢測不到則使用的預設語言
    detection: {
      order: ['querystring', 'navigator'], // 定義語言檢測的順序，例如通過查詢參數或瀏覽器語言
      caches: [], // 不緩存語言設定，不使用 localStorage 或 cookie
    },
    backend: {
      loadPath: '/translations/{{ns}}/{{lng}}.json', // 翻譯檔案路徑
    },
    ns: ['common'], // 使用的 namespaces
    defaultNS: 'common', // 預設 namespace
    interpolation: {
      escapeValue: false, // React 已自帶 XSS 安全處理，不需額外 escape
    },
    debug: import.meta.env.DEV, // 在開發時期可以開啟以查看 debug 信息
  });

export default i18n;
```

在這段程式碼中，我對語言偵測的順序和命名空間做了詳細的設定。例如，我使用了 `common` 和 `app` 兩個命名空間，以保持翻譯內容的模組化管理。這樣一來，不同的功能模組就不會互相干擾，維護起來也更加輕鬆。接著我們只需要在案入口文件（如 `main.tsx`）中引入，我們就可以在所有元件中使用 i18n 的翻譯功能。


:::note
詳細可配置選項與定義可參考 **[@i18next documentation - Configuration Options](https://www.i18next.com/overview/configuration-options)** 。
:::


### **準備翻譯文件**

在配置完成後，接下來就是準備翻譯文件。在 i18next 的設定中，我把翻譯檔案的路徑設定為 `'/translations/{{ns}}/{{lng}}.json'`，因此我建立了以下目錄結構：

```
public/translations
└── common
    ├── en.json
    └── zh-TW.json
```

每個 JSON 文件都包含 key-value 形式的翻譯文字，例如：

```json
// zh-TW.json
{
  "login": "登入",
  "logout": "登出",
  ...
}
```

## **使用 `react-i18next`**

### **實際處理翻譯內容**

在 `react-i18next` 中，最常用的方式是使用 `useTranslation` hook 來處理翻譯：

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation('app'); // 使用 'app' 命名空間

  return <h1>{t('welcome_message')}</h1>;
};

export default MyComponent;
```

在這段程式碼中，我使用 useTranslation 來取得 `t` 函數。這個 `t()` 函數可以根據當前語言和鍵值來取得相應的翻譯文字，讓元件渲染時可以自動切換語言，實現真正的多語系支援。

此外，在使用 useTranslation 時可以指定特定的 namespace，例如 `useTranslation('common')` 或 `useTranslation('app')`。這樣做可以有效地組織和管理不同領域的翻譯內容。如果不指定的話，i18n 則會自動使用預設的 namespace 來翻譯。

除了 useTranslation，還有一些其他的 API，如 [**withTranslation**](https://react.i18next.com/latest/withtranslation-hoc) HOC 和 [**Translation**](https://react.i18next.com/latest/translation-render-prop) render prop，但由於它們較少用到，我這裡就不做深入介紹。

### **語言切換功能**

除了翻譯，語言切換也是多國語系的核心功能之一。在這裡，我使用了 i18next 提供的 `changeLanguage` 方法，讓使用者能夠隨時切換語言：

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
    </div>
  );
};

export default LanguageSwitcher;
```

## **Reference**

- [**react-i18next documentation**](https://react.i18next.com/)
- [**i18next documentation**](https://www.i18next.com/)
- [**i18next-browser-languageDetector**](https://github.com/i18next/i18next-browser-languageDetector)
- [**i18next-http-backend**](https://github.com/i18next/i18next-http-backend)