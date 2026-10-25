---
title: "[Implementation Notes] Setting Up React + TypeScript + Jest + React Testing Library + MSW"
description: "How to install and configure React, TypeScript, Jest, React Testing Library, and MSW (Mock Service Worker) together, building a testing environment from scratch."
slug: react-ts-jest-rtl-msw-setup
authors: bosh
date: 2024-05-19
tags:
  - React
  - Testing
---

Here are my notes on the testing tools I recently set up in one of my projects at work. I chose **`Jest + React Testing Library + MSW`**, and used **`Husky + lint-staged`** to automatically run related tests at **pre-commit** time. There are plenty of other popular testing tools in the React ecosystem worth trying, too, including **Vitest**, which has recently been gaining ground on **Jest**, and **Cypress** for E2E testing.

<!-- truncate -->

## **Installing Packages** {#套件安裝}

### **The Frontend Development Environment** {#前端基本開發環境}

- React 18
- TypeScript
- Webpack
- Babel

    ```json
    // .babelrc configuration
    {
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ]
    }
    ```

### **Jest Packages** {#jest-相關套件}

```bash
yarn add --dev jest babel-jest jest-environment-jsdom jest-svg-transformer identity-obj-proxy
```

### **React Testing Library Packages** {#react-testing-library-相關套件}

```bash
yarn add --dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom
```

### **Mock Service Worker Packages** {#mock-service-worker-相關套件}

```bash
yarn add --dev msw@latest dotenv undici@5
```

<br/>

## **Jest Packages and Configuration** {#jest-相關套件介紹與配置}

### **Jest** {#jest}

> **[@Jest](https://jestjs.io/)**  
> **[@Jest - Configuring Jest](https://jestjs.io/docs/configuration#coveragedirectory-string)**

**`Jest`** is an open-source JavaScript testing framework developed by Facebook. It provides a complete unit testing environment, including assertions, mocking, watch mode, and reporting. Tests are organized with `describe` and `it` blocks: `describe` groups tests, while `it` describes an individual test. Each test should contain one or more assertions to verify the result.

**jest.config.js configuration**

```jsx
module.exports = {
  collectCoverage: true,  // Enable coverage collection
	collectCoverageFrom: [  // Specify which files to collect coverage from
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: 'coverage',
};
```

**package.json configuration**

```jsx
"scripts": {
  "test": "jest --verbose",
  "test:coverage": "yarn test --coverage",
  "test:watch": "yarn test --watch",
  "test:watch:coverage": "yarn test --watch --coverage",
},
```

:::tip[Code Coverage]
1. **Statements**: The proportion of statements executed. A `console.log();` counts as one statement, and a single line can contain multiple statements.

2. **Branches**: The paths through conditional logic, such as `if ... else` or `switch`. Each case is a branch.

3. **Functions**: The proportion of functions executed in a file.

4. **Lines**: The number of lines of code executed. The line count is generally less than or equal to the statement count.
:::

:::danger[A Bug I Hit While Installing Jest]
After installing **jest**, I created a simple sum.ts and sum.test.ts under src/test/ to try it out, and added this to package.json:

```json
"scripts": {
  "test": "jest",
},
```

But running `yarn test` produced this error:

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

Strangely, running **npx jest** directly didn't produce the error. It seemed pretty clear that **yarn** had something to do with it.

A search turned up plenty of people on GitHub with the same problem:

- **[[Bug?]: Error [ERR_REQUIRE_ESM]: require() of ES Module string-width/index.js #8994](https://github.com/yarnpkg/yarn/issues/8994)**
- [**[Bug]: string-width dependency stops storybook from executing**](https://github.com/storybookjs/storybook/issues/22431)

Following the suggested fix, I deleted **yarn.lock** and ran `yarn` again. The error went away.
:::

### **babel-jest** {#babel-jest}

> **[@Jest - Using Babel](https://jestjs.io/docs/getting-started#using-babel)**

Jest supports **CommonJS** modules natively. When using **ES6**, **TypeScript**, or other syntax that needs compilation, we use **`babel-jest`** to transform it.

**Configuration**

```jsx
// jest.config.js
module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Use babel-jest to transform ts, tsx, js, and jsx files
  },
};
```

**Things to watch for:**

- In my testing, leaving it uninstalled didn't cause an error. My development environment used Node.js v20, which already supported ES6 syntax, so I could leave it out in this project.
- If you're also using `ts-jest`, I recommend excluding **.ts** and **.tsx** files from babel-jest's **transform** configuration. The `ts-jest` section explains why.

### **ts-jest** {#ts-jest}

> **[@Jest - TypeScript-Via - ts-jest](https://jestjs.io/docs/getting-started#via-ts-jest)**  
> **[@ts-jest](https://kulshekhar.github.io/ts-jest/)**

Jest can compile TypeScript test files through **Babel (babel-jest)**, but Babel only turns TS into JS. It doesn't make Jest check the test code for type errors. **`ts-jest`** is a Jest plugin for testing TypeScript that both transpiles the code and performs static type checking before running tests, helping catch potential type errors.

If it finds a type error in a test file, it reports an error like this and stops that file's test run at the offending line, without continuing to the other tests in the file:

```bash
src/test/sum.test.ts:9:17 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Configuration**

```jsx
// jest.config.js
module.exports = {
    preset: 'ts-jest',
};
```

:::caution[Things to Watch For]
I found that if the project also had `babel-jest` configured to transform **.ts** and **.tsx** files, Babel would compile those test files into **.js**. As a result, even when the test code contained type errors, running `yarn test` didn't flag them.
:::

### **jest-environment-jsdom** {#jest-environment-jsdom}

> **[@Jest - Configuring - testEnvironmentOptions](https://jestjs.io/docs/configuration#testenvironmentoptions-object)**

**`jest-environment-jsdom`** provides a testing environment that simulates browser APIs. Jest still runs in Node.js, but browser globals such as **window** and **document** are available. You don't need to install `jsdom` separately, because **jest-environment-jsdom** already includes it.

Its main role here is to give **`@testing-library`** a simulated browser environment. That lets Testing Library methods such as **render** and **fireEvent** work correctly in a browser-like setting.

**Configuration**

```jsx
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom'  // Defaults to 'node'
};
```

:::caution[Things to Watch For]
If your tests use the DOM or need to simulate browser behavior without a `jsdom` environment, they may fail because the required browser objects are missing. Accessing **document** or **window**, for example, can cause an error because those objects don't exist in the Node environment.
:::

### **jest-svg-transformer** {#jest-svg-transformer}

**`jest-svg-transformer`** handles SVG imports. Jest needs a way to process SVG files during tests to avoid import or parsing errors. The transformer turns SVG files into React components so they can work in Jest tests.

**Configuration**

```jsx
// jest.config.js
module.exports = {
  '\\.svg$': 'jest-svg-transformer' // You can also map SVG files to jest-svg-transformer
};
```

### **identity-obj-proxy** {#identity-obj-proxy}

**`identity-obj-proxy`** mocks CSS module imports. When React components use CSS modules (CSS-in-JS), importing CSS files directly causes Jest to fail because it can't parse the CSS. **identity-obj-proxy** lets Jest ignore the CSS contents and treat the import as an empty object or proxy, so the tests can run.

**Configuration**

```jsx
// jest.config.js
module.exports = {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
};
```

### **vscode-jest (VSCode Extension)** {#vscode-jestvscode-plugin}

> **[@vscode-jest](https://github.com/jest-community/vscode-jest)**

Configure the Jest extension in `.vscode/settings.json`:

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

## **React Testing Library Packages and Configuration** {#react-testing-library-相關套件介紹與配置}

### **@testing-library/react** {#testing-libraryreact}

> [**@React Testing Library**](https://testing-library.com/docs/react-testing-library/intro)

**`@testing-library/react`** is built on **`@testing-library/dom`**. Its main features include:

- **render()**: Render React components in test files.
- **screen()**: Find DOM elements in the rendered components within the simulated test environment.
- **fireEvent()**: Simulate events such as clicks and text input.

### **@testing-library/jest-dom** {#testing-libraryjest-dom}

> **[@React Testing Library - Simulate user events?](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#simulate-user-events)**  
> **[@jest-dom](https://testing-library.com/docs/ecosystem-jest-dom)**

**Jest** already provides plenty of **matchers**, such as `toBe()` and `toMatch()`. **`@testing-library/jest-dom`** adds DOM-specific matchers such as `toBeDisabled()`, `toBeVisible()`, and `toHaveTextContent()`.

**Configuration**

To make these additional matchers available to every test file, import them in Jest's setup file as part of initializing the test environment.

- Create `jest.setup.ts`:

```jsx
import '@testing-library/jest-dom';
```

- Update `tsconfig.json`:

```jsx
"include": ["src/**/*", ".eslintrc.js", "jest.setup.ts"],
```

- Update `jest.config.js` to include the setup file:

```jsx
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom'
};
```

:::caution[Things to Watch For]
- `<rootDir>` in `jest.config.js` is a special Jest token representing the project root. Jest replaces it with the actual root directory path at runtime.

- **@testing-library/jest-dom** and **@testing-library/dom** have similar names but very different roles.
  - `@testing-library/dom` is the core of Testing Library and mainly provides DOM queries.
  - `@testing-library/jest-dom` extends Jest's assertions with additional DOM-related matchers.
:::

### **@testing-library/user-event** {#testing-libraryuser-event}

> **[@React Testing Library - What is React Testing Library?](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#simulate-user-events)**  
> **[user-event](https://github.com/testing-library/user-event)**

**`@testing-library/user-event`** offers a higher-level API for simulating real user interactions. It models actions such as typing text, clicking links, and selecting options more closely, triggering the corresponding mouse and keyboard events in order. It also waits for DOM updates when simulating events, making tests more reliable and closer to real application usage. Compared with **fireEvent** from **@testing-library/react**, it provides interactions that are closer to what a user actually does.

- **fireEvent** dispatches a specified event directly on a DOM element, without simulating the steps before it or the events that follow. For example, **fireEvent.click** triggers a click, but doesn't simulate moving the pointer onto the element, pressing the mouse button, and releasing it.
- **userEvent** simulates the full interaction. For example, **userEvent.type** triggers a series of events, including keydown and keyup, as it types text.

<br/>

## **MSW and Its Configuration** {#msw-介紹與配置}

### **Creating API Mocks** {#建立-api-模擬}

> **[@MSW - Response resolver](https://mswjs.io/docs/concepts/response-resolver)**

Create `handlers.ts` under `src/mocks` to define the mocked backend API responses.

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

### **Development Environment Setup** {#開發環境配置}

> **[@MSW - Browser integration](https://mswjs.io/docs/integrations/browser)**  
> **[@MSW - init](https://mswjs.io/docs/cli/init)**

During **development**, frontend code runs in the **browser**. MSW's **Service Worker** can intercept and modify HTTP requests there, and you can see the mocked API responses directly in the browser. Early in product development, before API payloads and response formats are finalized, frontend engineers can use MSW's Service Worker as a **mock API server**. That lets us work on data flow and state management before the backend is ready, saving a lot of waiting. Here's how to set it up.

**1. Initialize the Service Worker**

To mock backend APIs in development, MSW needs its Service Worker script (`mockServiceWorker.js`) in a publicly accessible directory. The browser must be able to fetch and register it as a static asset. The following command copies `mockServiceWorker.js` from the MSW npm package into the specified public directory, `./public` in this project:

```bash
npx msw init ./public --save
```

You can also add it to **package.json** scripts for easy reuse:

```bash
"scripts": {
  "init:msw": "msw init ./public --save"
}
```

**2. Set Up the Service Worker**

Create `browser.ts` under `src/mocks` to configure the **Service Worker**.

```tsx
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

**3. Conditionally Enable Mocking**

To mock backend APIs at runtime during development, call `worker.start()` to start the worker. Environment variables can control whether it starts, as in this example:

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

### **Test Environment Setup** {#測試環境配置}

Unlike **development** and **production**, tests generally run in **Node.js**, rather than a real **browser**. We therefore need the **Node.js version of MSW** to mock API requests and responses during tests. Here's the setup process.

**Set Up the Mock Server for Tests**

Create `server.ts` under `src/mocks` to initialize MSW's **Node mock server**.

```tsx
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**Configure `jest.setup.ts`**

```tsx
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

<details>
  <summary>A Bug I Hit While Setting Up the Mock Server [TL;DR]</summary>
  <div>

:::warning[A Bug I Hit While Setting Up the Mock Server]
**Error message**

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

**Cause: see the following link**

- **[@MSW - Frequent issues - `Request`/`Response`/`TextEncoder` is not defined (Jest)](https://mswjs.io/docs/migrations/1.x-to-2.x/#requestresponsetextencoder-is-not-defined-jest)**

After configuring `jest.polyfill.js` according to the official solution, I got another error:

```bash
ReferenceError: ReadableStream is not defined

  20 |
  21 | const { Blob, File } = require('node:buffer');
> 22 | const { fetch, Headers, FormData, Request, Response } = require('undici');
     |                                                         ^
```

**Solution: see the following link**

- **[ReferenceError: ReadableStream is not defined #1934](https://github.com/mswjs/msw/discussions/1934)**

Add `jest.polyfill.js` in the same directory as `jest.setup.ts`:

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

Configure `jest.config.ts`:

```jsx
module.exports = {
  setupFiles: ['./jest.polyfills.js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1', // Match the path alias defined in tsconfig.json.
    '\\.svg$': 'jest-svg-transformer', // Map SVG files to jest-svg-transformer
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
  },
  testEnvironmentOptions: {
    // https://mswjs.io/docs/migrations/1.x-to-2.x/#cannot-find-module-mswnode-jsdom
    customExportConditions: [''],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    // Specify which files to collect coverage from
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
  <summary>MSW V2 + Jest + JSDOM: Network Error Bug [TL;DR]</summary>
  <div>

:::warning[MSW V2 + Jest + JSDOM: Network Error Bug]
**Problem:**

- **[Network error with Axios in Jest tests with MSW 2.x #1915](https://github.com/mswjs/msw/discussions/1915)**
- **[Undici 6.x - Request/Response/TextEncoder is not defined (Jest) no longer works](https://github.com/mswjs/msw/issues/1916)**

**Cause:**

- This is related to the **`Bug I Hit While Setting Up the Mock Server`** above. It mainly concerns Jest's internals rather than MSW itself. See [this comment](https://github.com/mswjs/msw/issues/1916#issuecomment-1908544946).

**Solution:**

- The MSW author recommends switching from **Jest** to **Vitest**. I'm leaving that option aside for now.
- With the configuration from the **`Bug I Hit While Setting Up the Mock Server`** section, downgrade undici from v6 to v5.
:::

  </div>
</details>

<br/>

## **Running Related Tests Automatically at Pre-commit with lint-staged** {#搭配-lint-staged-在-pre-commit-階段對更動的程式碼執行自動測試}

One reason for introducing tests is to stop us from accidentally breaking each other's features. Suppose a feature I'm working on depends on a function written by a colleague. Without tests, that colleague could change the function's parameters or return value and break my feature. If I've written tests for my feature, those changes can be caught early instead.

Of course, that only helps if my colleague actually runs the project's tests before committing. If they forget, broken code can still be pushed to the remote. Running every test file on every commit isn't particularly efficient, either.

**`Husky + lint-staged`** lets us set up **Git pre-commit hooks** that automatically run the tests related to the code being committed. This helps catch the “change A, break B” problems without spending time on unrelated tests. I covered installation and the tools in more detail in [Keeping Team Code Consistent with ESLint, Prettier, Husky, and lint-staged](/en/blog/eslint-prettier-lintstaged). If you're interested in setting up consistent code style and conventions for a project, take a look.

**Configure `.lintstagedrc`:**

```jsx
{
  "frontend/src/**/*.{js,jsx,ts,tsx}": [    
	  "jest --findRelatedTests --bail --config='./frontend/jest.config.ts' "
	]
}
```

- **—bail**: Exit as soon as a test fails.
- **—findRelatedTests**: Run tests related to the specified source files. It accepts one or more space-separated file paths, identifies the related test files, and runs only those tests. This makes it useful with pre-commit hook tools.

<br/>

## **Reference** {#reference}

- **[Jest](https://jestjs.io/)**
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)**
- **[Testing Library](https://testing-library.com/)**
- **[[Day 05] Installing React Testing Tools (CRA / Vite / Next.js)](https://ithelp.ithome.com.tw/articles/10322782)**
- **[Setup Jest and React Testing Library in a React project | a step-by-step guide](https://dev.to/ivadyhabimana/setup-jest-and-react-testing-library-in-a-react-project-a-step-by-step-guide-1mf0)**
