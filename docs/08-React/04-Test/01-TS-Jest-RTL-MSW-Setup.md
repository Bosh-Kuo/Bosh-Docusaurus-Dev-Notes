---
title: React + TypeScript + Jest + React Testing Library + MSW 前端測試工具安裝與配置
sidebar_label: "[實作紀錄] React+TS+Jest+RTL+MSW 前端測試工具安裝與配置"
description: 這篇技術筆記文章將詳細介紹如何在現代前端開發環境中整合 React、TypeScript、Jest、React Testing Library 及 MSW（Mock Service Worker）。文章將指導讀者從零開始安裝和組態這些工具，展示它們如何配合使用來建構一個健壯的測試環境。
slug: "/React/TS-Jest-RTL-MSW-Setup"
last_update:
  date: 2024-05-19
keywords:
  - Frontend Testing
  - React
  - TypeScript
  - Jest
  - React Testing Library
  - Mock Server Worker
  - Husky
  - Lint Stage
tags:
  - React
  - Testing
---

我目前所在的開發團隊一直以來都沒有寫測試的習慣，所有的前端專案都沒有任何測試文檔，也沒有配置測試環境。剛進入公司時，一直都很想嘗試為公司的專案導入前端測試，但一方面對公司的 codebase 和開發流程不夠熟悉，另一方面後來又持續收到許多排成很趕的工項，一直沒時間去研究。最近趁著手上的工項都告一段落，決定拿手上其中一個 codebase 比較乾淨的專案來嘗試為公司導入前端測試，以提供未來其他專案導入測試時一個參考範本。

:::note
這篇文章主要記錄近期在工作時嘗試在手上的其中一個專案中安裝與配置的測試工具，我在這個專案中選擇使用了 **`Jest + React Testing Library + MSW`** 這幾個測試工具，並使用 **`Husky + lint-staged`** 設定在 **pre-commit** 時自動執行相關測試文件的自動測試。除了本文章所介紹的測試工具以外，React 生態系還有許多受歡迎的測試工具，像是近期有取代 **Jest** 勢頭的 **Vitest**，以及用來做 E2E 測試的 **Cypress** 等，都很值得嘗試與研究。
:::


## **套件安裝**

### **前端基本開發環境**

- React 18
- TypeScript
- Webpack
- Babel
    
    ```json
    // .babelrc 設定
    {
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ]
    }
    ```
    

### **Jest 相關套件**

```bash
yarn add --dev jest babel-jest jest-environment-jsdom jest-svg-transformer identity-obj-proxy
```

### **React Testing Library 相關套件**

```bash
yarn add --dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom
```

### **Mock Service Worker 相關套件**

```bash
yarn add --dev msw@latest dotenv undici@5
```


<br/>


## **Jest 相關套件介紹與配置**

### **Jest**

> **[@Jest](https://jestjs.io/)**  
> **[@Jest - Configuring Jest](https://jestjs.io/docs/configuration#coveragedirectory-string)**


**`Jest`** 是一個由 Facebook 開發的開源 JavaScript 測試框架，它提供了完整的單元測試環境，包括斷言、模擬、測試監視和報告等功能。**Jest** 使用 `describe` 和 `it` 塊來組織測試。`describe` 塊用於描述測試的大組別，而 `it` 塊用於描述單個測試。每個測試都應該包含一個或多個斷言，用於驗證測試的結果。

**jest.config.js 配置文檔**

```jsx
module.exports = {
  collectCoverage: true,  // 啟用覆蓋率收集
	collectCoverageFrom: [  // 指定收集覆蓋率的檔案範圍
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: 'coverage',
};
```

**package.json 配置文檔**

```jsx
"scripts": {
  "test": "jest --verbose",
  "test:coverage": "yarn test --coverage",
  "test:watch": "yarn test --watch",
  "test:watch:coverage": "yarn test --watch --coverage",
},
```

:::tip[Code Coverage]
1. **Statements** : 有多少比例語句被執行到，一個  console.log(); 就算是一個語句，一行中可以有多個 Statements。

2. **Branches**：條件語句，像是 if ... else 或是 switch，每個情況都是一個 Branch。

3. **Functions**：一個檔案有多少比例的函式被執行到。

4. **Lines**：有幾行的程式碼被執行到，基本上 Lines 的數量會小於等於 Statements 的數量
:::
    
:::danger[安裝 Jest 時遇到的 Bug]
安裝 **jest** 後我在 src/test/ 目錄下建立了一個簡單的 sum.ts 和 sum.test.ts 來測試，並在 package.json 中設置了：

```json
"scripts": {
  "test": "jest",
},
```

當我下 yarn test 指令後卻出現以下錯誤訊息

```bash
Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/strip-ansi/index.js from /Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/string-width/index.js not supported.
Instead change the require of /Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/strip-ansi/index.js in /Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/string-width/index.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/string-width/index.js:2:19)
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/cliui/build/index.cjs:291:21)
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/yargs/build/index.cjs:1:60678)
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/yargs/index.cjs:5:30)
    at _yargs (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/jest-cli/build/run.js:30:39)
    at buildArgv (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/jest-cli/build/run.js:149:26)
    at Object.run (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/jest-cli/build/run.js:124:24)
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/jest-cli/bin/jest.js:16:17)
    at Object.<anonymous> (/Users/boshkuo/Desktop/D8AI/ctbc-tc-test/frontend/node_modules/jest/bin/jest.js:12:3)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

神奇的是如果我直接執行 **npx jest** 是不會跳出這個錯誤的。看起來這個錯誤應該跟 **yarn** 脫不了關係

查了一下發現 github 社群上有很多人遇到相同的問題：

- **[[Bug?]: Error [ERR_REQUIRE_ESM]: require() of ES Module string-width/index.js #8994](https://github.com/yarnpkg/yarn/issues/8994)**
- [**[Bug]: string-width dependency stops storybook from executing**](https://github.com/storybookjs/storybook/issues/22431)

參考社群上的解法，把 **yarn.lock** 刪除後重新 yarn 一次就沒有報錯了
:::


### **babel-jest**

> **[@Jest - Using Babel](https://jestjs.io/docs/getting-started#using-babel)**
> 

由於 Jest 原生支持 **CommonJS** 模塊，當使用 **ES6**、**TypeScript** 或其他編譯語言時，我們需要 **`babel-jest`** 來轉換這些語法。

**對應配置**

```jsx
// jest.config.js
module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // 使用 babel-jest 轉換 ts, tsx, js, jsx 文件
  },
};
```

**注意事項：**

- 實際測試發現，沒有裝也沒有發生錯誤，這是因為目前開發環境使用的 Node.js V20 以支援 ES6 語法，因此在本專案可以不裝。
- 若同時使用 `ts-jest` ，建議配置中設定 **transform** 的檔案類型不要包括 **.ts**, **.tsx** 檔，原因參考 `ts-jest` 章節

### **ts-jest**

> **[@Jest - TypeScript-Via - ts-jest](https://jestjs.io/docs/getting-started#via-ts-jest)**  
> **[@ts-jest](https://kulshekhar.github.io/ts-jest/)**
> 

雖然 Jest 支援透過 **Babel (babel-jest)** 編譯 TypeScript 測試檔，但畢竟 Babel 僅純粹負責將 TS 轉成 JS，因此執行測試時 Jest 並不會檢查測到試程式碼內的型別錯誤。**`ts-jest`** 是一個讓 Jest 能夠測試 TypeScript 程式碼 的 Jest 插件，他不僅能讓 Jest 能夠轉譯 TypeScript 程式碼，還會在執行測試之前先對 TypeScript 程式碼進行靜態類型檢查，幫助發現潛在的型別錯誤。

當執行測試時，檢查到測試檔案的型別錯誤，會顯示如下錯誤訊息，並且在該行終止該測試檔案的測試任務，不繼續往下執行該測試檔案中的其他測試。

```bash
src/test/sum.test.ts:9:17 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**對應配置**

```jsx
// jest.config.js
module.exports = {
    preset: 'ts-jest',
};
```

:::caution[注意事項]
經過測試後發現，若專案中同時安裝並配置 `babel-jest` 轉譯 **.ts**, **.tsx** 檔案， **babel-jest** 會幫我們把測試 **.ts**, **.tsx** 檔編譯成 **.js** 檔，因此即便測試程式碼中有型別錯誤的地方，執行 yarn test 後也沒有特別被標出來。
:::


### **jest-environment-jsdom**

> **[@Jest - Configuring - testEnvironmentOptions](https://jestjs.io/docs/configuration#testenvironmentoptions-object)**
> 

**`jest-environment-jsdom`** 是一個測試環境，模擬了一個瀏覽器的 API 環境。它允許 Jest 在 Node.js 環境中運行，但提供了像 **window** 或 **document** 這樣的瀏覽器全局變數。使用 **jest-environment-jsdom** 進行 Jest 測試時，不需要額外安裝 `jsdom`，因為 **jest-environment-jsdom** 已經包含了 **jsdom**。

該套件主要是用來提供 **`@testing-library`** 一個模擬瀏覽器的執行環境。**jest-environment-jsdom** 確保了 **render** 和 **fireEvent** 這些 **@testing-library** 提供的方法能在一個類似瀏覽器的環境中正確執行。

**對應配置**

```jsx
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom'  // 預設為 'node'
};
```

:::caution[注意事項]
如果測試中涉及到 DOM 或需要模擬瀏覽器行為，但沒有設置 `jsdom` 環境，那麼測試可能會因為缺少必要的瀏覽器物件而失敗。例如，試圖訪問 **document** 或 **window** 可能會導致錯誤，因為在 Node 環境中這些物件是不存在的。
:::


### **jest-svg-transformer**

**`jest-svg-transformer`** 用於處理 SVG 檔案的導入，在測試時，Jest 需要適當地處理這些 SVG 檔案，以避免導入錯誤或解析問題。它能將 SVG 檔案轉換成 React 元件，使其在 Jest 測試中可以正常工作。

**對應配置**

```jsx
// jest.config.js
module.exports = {
  '\\.svg$': 'jest-svg-transformer' // 也可將 SVG 檔案映射到 jest-svg-transformer
};
```


### **identity-obj-proxy**

**`identity-obj-proxy`** 用於模擬 CSS 模塊的導入。當我們在 React 元件中使用 CSS 模塊（CSS-in-JS）時，直接導入 CSS 檔案將導致 Jest 測試因無法解析 CSS 而失敗。**identity-obj-proxy** 允許 Jest 忽略 CSS 導入的具體內容，而是將導入的 CSS 檔案視為一個空的物件或代理，從而不影響測試的運行。

**對應配置**

```jsx
// jest.config.js
module.exports = {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // 對 CSS 模塊進行模擬
};
```


### **vscode-jest(vscode plugin)**

> **[@vscode-jest](https://github.com/jest-community/vscode-jest)**
> 

於 `.vscode/settings.json` 設定 jest plugin

```json
{
  "jest.virtualFolders": [
    { "name": "frontend", "rootPath": "./frontend" },
    { "name": "backend", "rootPath": "./backend" }
  ],
  "jest.runMode": "on-demand"
}

```


<br/>


## **React Testing Library 相關套件介紹與配置**

### **@testing-library/react**

> [**@React Testing Library**](https://testing-library.com/docs/react-testing-library/intro)
> 

**`@testing-library/react`** 基於 **`@testing-library/dom`**，主要功能為：

- **render()**: 在測試檔案中渲染 React 元件
- **screen()**: 在測試模擬環境中查找渲染元件的 DOM 元素
- **fireEvent()**：支持事件模擬，允許模擬用戶觸發如點擊、輸入等事件

### **@testing-library/jest-dom**

> **[@React Testing Library - Simulate user events?](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#simulate-user-events)**  
> **[@jest-dom](https://testing-library.com/docs/ecosystem-jest-dom)**
> 

**Jest** 本身就提供了許多**斷言器(Matchers)**，如： `toBe()`, `toMatch()` 等。  
**`@testing-library/jest-dom`** 擴充了 Jest 更多的跟 **DOM** 有關的斷言方法，如：`toBeDisabled()`, `toBeVisible()`, `toHaveTextContent()` 等。

**對應配置**

為了讓所有測試檔案皆可以使用 **@testing-library/jest-dom** 擴充的斷言器，通常建議在 Jest 的設置文件設置建立 Jest 測試境前直接引入這些斷言器

- 創建 `jest.setup.ts`，：

```jsx
import '@testing-library/jest-dom';
```

- 更新 `tsconfig.json`：

```jsx
"include": ["src/**/*", ".eslintrc.js", "jest.setup.ts"],
```

- 更新 `jest.config.js` 以包括設置檔案：

```jsx
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom'
};
```

:::caution[注意事項]

- 在 `jest.config.js` 檔案中使用 `<rootDir>` 是 Jest 提供的一個特殊標記，它代表專案的根目錄，當 Jest 執行階段，它會自動將 `<rootDir>` 取代為實際的根目錄路徑。


- **@testing-library/jest-dom** 與 **@testing-library/dom** 雖然名稱看上去很相近，但實際的功能卻完全不同。
  - `@testing-library/dom` 是 Testing Library 的核心，主要功能為提供 DOM 查找
  - `@testing-library/jest-dom` 則是擴充 Jest 的斷言方法，提供 Jest 更多與 DOM 相關的 Matcher

:::

### **@testing-library/user-event**

> **[@React Testing Library - What is React Testing Library?](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#simulate-user-events)**  
> **[user-event](https://github.com/testing-library/user-event)**
> 

**`@testing-library/user-event`** 是一個用於模擬真實使用者行為的 library，它提供了一個更高層級的 API 來模擬使用者操作。這個套件可以模擬更接近真實使用者行為的事件，比如輸入文字、點選連結、選擇選項等，它會觸發相應的事件，包括鼠標事件和鍵盤事件，並考慮這些事件的順序。且當模擬事件時，會等待 DOM 的更新完成，使得測試更加可靠和符合實際的應用場景。相對於 **@testing-library/react** 中的 **fireEvent**，提供了更接近於使用者的交互方式。

- **fireEvent** 直接在 DOM 元素上觸發指定的事件，而不模擬使用者實際操作的前置步驟或後續事件。例如，使用 **fireEvent.click** 只會觸發點擊事件，而不會模擬鼠標移動到元素上、按下和釋放的過程。
- **userEvent** 則模擬整個使用者操作的流程，例如在使用 **userEvent.type** 模擬輸入文字時，會觸發鍵盤按下、鍵盤釋放等一系列事件。


<br/>


## **MSW 介紹與配置**

### **建立 API 模擬**

> **[@MSW - Response resolver](https://mswjs.io/docs/concepts/response-resolver)**
> 

在 `src/mocks` 目錄下建立一個 `handlers.ts` 檔案來定義模擬後端的 API Response。

```tsx
// example

import { http, HttpResponse } from 'msw'
 
export const handlers = [
  // Describe what request to intercept...
  http.get('/greeting', () => {
    // ...and how to respond to it.
    return new HttpResponse('Hello world!')
  }),
]
```

### **開發環境配置**

> **[@MSW - Browser integration](https://mswjs.io/docs/integrations/browser)
[@MSW - init](https://mswjs.io/docs/cli/init)**
> 

在**開發環境**中，前端程式碼是在`瀏覽器`中運行的。 **MSW** 提供的 **Service Worker** 能夠在瀏覽器環境中自然地攔截和修改 HTTP 請求，且可以直接在瀏覽器中看到模擬 API 的及時反應。在產品規劃初期的開發階段，當 API 的 payload 與回傳規格尚未定義好之前，前端工程師可以使用 **MSW** 的 **Service Worker** 作為 **mock API Server**，在後端 API ready 之前就可以先行開發資料流與狀態管理的邏輯，可以節省許多等待的時間。以下將一步步講解 **MSW** 用於開發環境的配置流程。

**1. 初始化 Service Worker**

當我們希望前端在開發環境下使用 **MSW** 模擬後端 API 時，為了使 **MSW** 正常工作，我們需要將 **Service Worker** 腳本（`mockServiceWorker.js`）放置到應用的可訪問目錄中。這是因為 **Service Worker** 必須作為靜態資源被客戶端瀏覽器訪問和註冊。以下指令會自動將 `mockServiceWorker.js`從 **MSW** 的 npm 包複製到指定的公共目錄（在本專案中為 `./public` 目錄）。

```bash
npx msw init ./public --save
```

也可以將此命令添加到 **package.json** 的 scripts 部分，以便輕鬆重複使用：

```bash
"scripts": {
  "init:msw": "msw init ./public --save"
}
```


**2. 設置 Service Worker**

在 `src/mocks` 目錄下建立一個 `browser.ts` 檔案來設定 **Service Worker**。

```tsx
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```


**3. Conditionally enable mocking**

若要在開發的執行階段使用 **Service Worker** 模擬後端 API，我們需要透過呼叫 `worker.start()` 來啟動 worker。我們可以透過設定環境變數來控制是否要啟動 **Server Worker**，如下列範例：

```tsx
async function enableMocking(): Promise<ServiceWorkerRegistration | undefined> {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_MOCKING_SERVER !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return await worker.start();
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  enableMocking().then(() => {
    root.render(
      <AppProviders>
        <App />
      </AppProviders>,
    );
  });
} else {
  console.error('root container element not found');
}

```


### **測試環境配置**

與**開發環境**和**正式環境**不同的是，在**測試環境**中，測試通常不是在真實的`瀏覽器環境`中執行，而是在 `Node.js 環境`中運行。因此，使用 **Node.js 版的 MSW** 才能夠再執行測試時模擬 API 請求和回應。以下將一步步講解 MSW 用於測試環境的配置流程。

**設置測試環境 Mock Server**

在 `src/mocks` 目錄下創建  `server.ts`初始化 MSW 的 **Node Mock Server**。

```tsx
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**配置 `jest.setup.ts` 文件**

```tsx
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

<details>
  <summary>配置 MOCK SERVER 時遇到的 BUG [TL;DR]</summary>
  <div>

:::warning[配置 Mock Server 時遇到的 Bug]
**錯誤訊息**

```bash
Test suite failed to run

ReferenceError: TextEncoder is not defined

> 1 | import { setupServer } from 'msw/node';
    | ^
  2 | import { handlers } from './handlers';
  3 |
  4 | export const server = setupServer(...handlers);

  at Object.<anonymous> (node_modules/@mswjs/interceptors/src/utils/bufferUtils.ts:1:17)
  at Object.<anonymous> (node_modules/@mswjs/interceptors/lib/node/chunk-K74ZLSG6.js:5:24)
  at Object.<anonymous> (node_modules/@mswjs/interceptors/lib/node/interceptors/XMLHttpRequest/index.js:3:24)
  at Object.<anonymous> (node_modules/msw/src/node/SetupServerApi.ts:3:43)
  at Object.<anonymous> (src/mocks/server.ts:1:1)
  at Object.<anonymous> (jest.setup.ts:2:1)
```

**原因：參考以下連結**

- **[@MSW - Frequent issues - `Request`/`Response`/`TextEncoder` is not defined (Jest)](https://mswjs.io/docs/migrations/1.x-to-2.x/#requestresponsetextencoder-is-not-defined-jest)**

根據官方解法配置  `jest.polyfill.js` 又出現以下錯誤：

```bash
ReferenceError: ReadableStream is not defined

  20 |
  21 | const { Blob, File } = require('node:buffer');
> 22 | const { fetch, Headers, FormData, Request, Response } = require('undici');
     |                                                         ^
```

**解法：參考以下連結**

- **[ReferenceError: ReadableStream is not defined #1934](https://github.com/mswjs/msw/discussions/1934)**

在 `jest.setup.ts` 同層級目錄下新增 `jest.polyfill.js`

```jsx
// jest.polyfill.js
// https://mswjs.io/docs/migrations/1.x-to-2.x/#requestresponsetextencoder-is-not-defined-jest
/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */

const { TextDecoder, TextEncoder, ReadableStream } = require('node:util');

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  // ReadableStream: { value: ReadableStream },
});

const { Blob, File } = require('node:buffer');
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
});
```

配置 `jest.config.ts`

```jsx
module.exports = {
  setupFiles: ['./jest.polyfills.js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1', // 匹配在 tsconfig.json 中定義的路徑別名。
    '\\.svg$': 'jest-svg-transformer', // 將 SVG 檔案映射到 jest-svg-transformer
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // 對 CSS 模塊進行模擬
  },
  testEnvironmentOptions: {
    // https://mswjs.io/docs/migrations/1.x-to-2.x/#cannot-find-module-mswnode-jsdom
    customExportConditions: [''],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    // 指定收集覆蓋率的檔案範圍
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
};

```
:::

  </div>
</details>


<details>
  <summary>MSW V2 + Jest + JSDOM: Network error Bug [TL;DR]</summary>
  <div>

:::warning[MSW V2 + Jest + JSDOM: Network error Bug ]
**問題：**

- **[Network error with Axios in Jest tests with MSW 2.x #1915](https://github.com/mswjs/msw/discussions/1915)**
- **[Undici 6.x - Request/Response/TextEncoder is not defined (Jest) no longer works](https://github.com/mswjs/msw/issues/1916)**

**原因：**

- 與上述 **`配置 Mock Server 時遇到的 Bug`** 問題相關，主要跟 Jest 內部程式碼有關，不是 MSW 本身的問題，可參考 https://github.com/mswjs/msw/issues/1916#issuecomment-1908544946。

**解法：**

- MSW 作者建議使用 **Vitest** 取代 **Jest**，暫時不考慮。
- 根據上述 **`配置 Mock Server 時遇到的 Bug`** 問題解法的配置，將 undici 從 v6 降版到 v5
:::
  
  </div>
</details>


<br/>


## **搭配 lint-staged 在 pre-commit 階段對更動的程式碼執行自動測試**
導入測試的其中一個目的就是為了防止工程師之間 co-work 時不小心改壞了別人負責的功能。假設我目前所開發的功能需要依賴同事A的某個函數，在沒有寫測試的情況下，同事A把函數的參數介面或回傳值換掉都很可能造成我開發的功能無法正常運作；相反地，如果我有為我開發的功能寫測試，當同事A改動該函數而造成錯誤就能在測試中被提早發現。

然而，以上測試所帶來的好處的前提是建立在同事A有乖乖地在 commit 程式碼前先跑一次專案的測試，若同事A忘記執行專案測試，有問題的程式碼還是會被推送到雲端。此外，每次 commit 都執行所有的測試檔案顯然不是個有效率的工作流程。

**`Husky + lint-staged`** 這兩個工具可以幫助我們建立 **Git pre-commit hooks** ，針對與提交的程式碼相關的所有測試檔案進行自動化測試，這將能大大地改善開發過程中**改A錯B**的情況，且能節省執行不必要的測試的時間。關於 **Husky** 與 **lint-staged** 的安裝與更詳細的介紹，在我之前寫的 [整合 ESLint, Prettier, Husky, lint-staged 維護團隊開發品質](../../11-DevTools/05-eslint-prettier-lintstaged.md) 這篇文章中有比較詳細的介紹，歡迎對如何配置專案統一程式碼風格與規範有興趣的讀者閱讀這篇文章。


**設置 `.lintstagedrc`**:

```jsx
{
  "frontend/src/**/*.{js,jsx,ts,tsx}": [    
	  "jest --findRelatedTests --bail --config='./frontend/jest.config.ts' "
	]
}
```
  - **—bail**: 遇到運行失敗的測驗立即退出
  - —**findRelatedTests**: 用來運行與指定的源文件相關的測試。這個命令接受一個或多個文件路徑（空格分隔），Jest 會識別出哪些測試檔案是這些源文件的相關測試，並只執行這些測試。適合與 pre-commit hook 工具搭配使用


<br/>
    

## **Reference**

- **[Jest](https://jestjs.io/)**
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)**
- **[Testing Library](https://testing-library.com/)**
- **[[Day 05] React 測試安裝介紹 ( CRA / Vite / Next.js )](https://ithelp.ithome.com.tw/articles/10322782)**
- **[Setup Jest and React Testing Library in a React project | a step-by-step guide](https://dev.to/ivadyhabimana/setup-jest-and-react-testing-library-in-a-react-project-a-step-by-step-guide-1mf0)**