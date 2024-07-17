---
title: "TypeScript 編譯配置 tsconfig.json compilerOptions 全解析"
sidebar_label: "compilerOptions"
description: 這篇筆記文章詳細解析了 tsconfig.json 中的 compilerOptions 設定，涵蓋了每個選項的作用及其簡短解釋，方便讀者快速了解編譯配置選項
last_update:
  date: 2024-07-18
keywords:
  - TypeScript
  - tsconfig.json
  - compilerOptions
tags:
  - TypeScript
---



:::note
由於 tsconfig.json 中的 compilerOptions 可配置選項實在是太多了，常常會忘記一些選項的用途，但 TypeScript 的官方文件有些選項要不是寫得太冗長就是太簡短。因此決定一次將所有 compilerOptions 透過 chatgpt 整理成一個大抄，方便我日後快速查詢。
:::


import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc}/>


## **Type Checking**

### **allowUnreachableCode**

設定是否允許在程式中存在不可達的程式碼。

**說明範例：**

```tsx
function example1() {
  return;
  console.log("這段程式永遠不會被執行"); // 如果 allowUnreachableCode 為 true，則不會報錯
}
```

### **allowUnusedLabels**

設定是否允許在程式中存在未使用的標籤。

**說明範例：**

```tsx
unusedLabel: // 如果 allowUnusedLabels 為 true，則不會報錯
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break;
  }
}
```

### **alwaysStrict**

設定是否在 ECMAScript 嚴格模式下進行解析，在編譯輸出的 JavaScript 文件中強制啟用嚴格模式（插入 “use strict”）。

**說明範例：**

```tsx
function example2() {
  // "use strict"; 自動插入於此
  let x = 1;
  delete x; // 在嚴格模式下，這將會拋出錯誤
}
```

### **exactOptionalPropertyTypes**

設定是否精確控制可選屬性類型，即是否允許 `undefined` 類型的值被賦給可選屬性。

**說明範例：**

```tsx
interface User {
  name: string;
  age?: number;
}

const user1: User = { name: "Alice" };
const user2: User = { name: "Bob", age: undefined }; // 如果 exactOptionalPropertyTypes 為 true，則將報錯
```

### **noFallthroughCasesInSwitch**

設定是否在 switch 語句中禁止 case 子句的穿透行為。

**說明範例：**

```tsx
function example3(x: number) {
  switch (x) {
    case 1:
      console.log("1");
      // 沒有 break 語句會導致穿透，若 noFallthroughCasesInSwitch 為 true，則這將報錯
    case 2:
      console.log("2");
      break;
    default:
      console.log("default");
  }
}
```

### **noImplicitAny**

設定是否在變數或參數的類型未明確指定時報錯。

**說明範例：**

```tsx
function example1(x) {
  // 如果 noImplicitAny 為 true，這將報錯，因為 x 的類型未指定
  console.log(x);
}
```

### **noImplicitOverride**

設定是否要求在覆蓋基類方法時必須明確使用 `override` 關鍵字。

**說明範例：**

```tsx
class Base {
  greet() {
    console.log("Hello from Base");
  }
}

class Derived extends Base {
  override greet() { // 如果 noImplicitOverride 為 true，這裡必須加上 override，否則報錯
    console.log("Hello from Derived");
  }
}
```

### **noImplicitReturns**

設定是否在函數的所有程式碼路徑未明確返回值時報錯。

**說明範例：**

```tsx
function example2(condition: boolean): number {
  if (condition) {
    return 1;
  }
  // 如果 noImplicitReturns 為 true，這裡將報錯，因為並非所有路徑都有返回值
}
```

### **noImplicitThis**

設定是否在 `this` 表示式的值為 `any` 類型時報錯。

**說明範例：**

```tsx
class Example {
  value: number = 0;

  logValue() {
    console.log(this.value);
  }

  method() {
    [1, 2, 3].forEach(function () {
      console.log(this.value); // 如果 noImplicitThis 為 true，這將報錯，因為 this 的類型未明確指定
    });
  }
}
```

### **noPropertyAccessFromIndexSignature**

這個選項確保通過“點”語法 (`obj.key`) 和“索引”語法 (`obj["key"]`) 訪問屬性的一致性，並要求以索引方式訪問來自索引簽名的屬性。

**說明範例：**

```tsx
interface GameSettings {
  // 明確定義的屬性
  speed: "fast" | "medium" | "slow";
  quality: "high" | "low";

  // 索引簽名，表示其他未定義的屬性均為字符串類型
  [key: string]: string;
}

const settings: GameSettings = {
  speed: "fast",
  quality: "high",
  username: "player1"
};

console.log(settings.speed); // 正常訪問
console.log(settings.quality); // 正常訪問

// 如果 noPropertyAccessFromIndexSignature 為 true，以下將報錯
console.log(settings.username);
// Property 'username' comes from an index signature, so it must be accessed with ['username'].

// 正確的訪問方式應為
console.log(settings["username"]); // 正常訪問
```

### **noUncheckedIndexedAccess**

設定是否在通過索引簽名訪問屬性時進行嚴格檢查。啟用後，索引簽名的屬性訪問將返回可能 `undefined` 的值。

**說明範例：**

```tsx
interface MyObject {
  [key: string]: string;
}

const obj: MyObject = {
  knownProperty: "value"
};

const value = obj["unknownProperty"]; // 如果 noUncheckedIndexedAccess 為 true，value 的類型將是 string | undefined
if (value !== undefined) {
  console.log(value.toUpperCase()); // 這樣可以避免對 undefined 調用方法
}
```

### **noUnusedLocals**

設定是否在程式中存在未使用的本地變量時報錯。

**說明範例：**

```tsx
function example1() {
  const unusedVariable = 42; // 如果 noUnusedLocals 為 true，這將報錯，因為未使用
  const usedVariable = 24;
  console.log(usedVariable); // 這是使用過的變量，沒問題
}
```

### **noUnusedParameters**

設定是否在函數中存在未使用的參數時報錯。

**說明範例：**

```tsx
function example2(unusedParam: number, usedParam: number) {
  // 如果 noUnusedParameters 為 true，unusedParam 將報錯，因為未使用
  console.log(usedParam); // 這是使用過的參數，沒問題
}
```

### **strict**

設定是否啟用所有嚴格類型檢查選項。這是一個總開關，用於啟用各種嚴格模式的檢查。

**Related Rules:**

- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig/#alwaysStrict)
- [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks)
- [`strictBindCallApply`](https://www.typescriptlang.org/tsconfig/#strictBindCallApply)
- [`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes)
- [`strictPropertyInitialization`](https://www.typescriptlang.org/tsconfig/#strictPropertyInitialization)
- [`noImplicitAny`](https://www.typescriptlang.org/tsconfig/#noImplicitAny)
- [`noImplicitThis`](https://www.typescriptlang.org/tsconfig/#noImplicitThis)
- [`useUnknownInCatchVariables`](https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables)

### **strictBindCallApply**

設定是否對 `Function.prototype.bind`, `call`, 和 `apply` 方法進行嚴格檢查。

**說明範例：**

```tsx
function example4(a: number, b: string) {
  console.log(a, b);
}

const boundFunction = example4.bind(null, 42); // 在 strictBindCallApply 為 true 時，bind 的參數必須匹配原始函數
boundFunction("hello"); // 正常工作

// 如果 bind, call, apply 的參數類型不匹配，則會報錯
example4.call(null, 42, "hello"); // 正常工作
example4.apply(null, [42, "hello"]); // 正常工作
```

### **strictFunctionTypes**

設定是否啟用嚴格的函數類型檢查。這會更嚴格地檢查函數參數和返回值的類型相容性。

**說明範例：**

```tsx
type Handler = (a: number) => void;

function example1(handler: Handler) {
  handler(42);
}

const validHandler: Handler = (a) => console.log(a);
example1(validHandler); // 正常工作

const invalidHandler = (a: string) => console.log(a);
// 如果 strictFunctionTypes 為 true，這將報錯，因為參數類型不匹配
// example1(invalidHandler);
```

### **strictNullChecks**

設定是否啟用嚴格的空值檢查。啟用後，null 和 undefined 不能賦值給其他類型，除非明確允許。

**說明範例：**

```tsx
function example2(value: string | null) {
  if (value !== null) {
    console.log(value.toUpperCase()); // 在 strictNullChecks 為 true 時，需要檢查 null
  }
}

let nullableString: string | null = "Hello";
// nullableString = null; // 正常工作

let nonNullableString: string = "Hello";
// nonNullableString = null; // 如果 strictNullChecks 為 true，這將報錯
```

### **strictPropertyInitialization**

設定是否啟用嚴格的屬性初始化檢查。啟用後，類別的所有屬性必須在構造函數中初始化，或者在定義時初始化。

**說明範例：**

```tsx
class Example3 {
  initializedProperty: string = "Hello";
  uninitializedProperty: string; // 如果 strictPropertyInitialization 為 true，這將報錯

  constructor() {
    this.uninitializedProperty = "World"; // 正常初始化
  }
}
```

### **useUnknownInCatchVariables**

設定是否在 catch 子句的變量中使用 `unknown` 類型，而不是 `any` 類型。這可以提高類型安全性，強制開發者處理未知類型。

**說明範例：**

```tsx
try {
  throw new Error("Something went wrong");
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message); // 在 useUnknownInCatchVariables 為 true 時，需要檢查 error 的類型
  }
}
```


<br/>


## **Modules**

### **allowArbitraryExtensions**

這個選項允許導入路徑中包含非標準擴展名的文件。當一個導入路徑以一個非 JavaScript 或 TypeScript 文件擴展名結尾時，編譯器將會查找該路徑的聲明文件，格式為 `{file basename}.d.{extension}.ts`。

**說明範例：**

假設你有一個 CSS 文件和對應的 TypeScript 聲明文件：

```css
/* app.css */
.cookie-banner {
  display: none;
}
```

對應的聲明文件：

```tsx
// app.d.css.ts
declare const css: {
  cookieBanner: string;
};
export default css;
```

在 TypeScript 文件中導入這個 CSS 文件：

```tsx
// App.tsx
import styles from "./app.css"; // 如果 allowArbitraryExtensions 為 true，這將被允許
console.log(styles.cookieBanner); // "string"
```

### **allowImportingTsExtensions**

這個選項允許 TypeScript 文件之間使用 TypeScript 特有的擴展名（如 `.ts`, `.mts`, 或 `.tsx`）進行導入。

此選項僅在 `--noEmit` 或 `--emitDeclarationOnly` 啟用時允許，因為這些導入路徑在 JavaScript 輸出文件中是無法解析的。預期情況下，你的解析器（例如你的打包工具、運行時或其他工具）將使這些 `.ts` 文件之間的導入能夠正常工作。

**說明範例：**

假設你有兩個 TypeScript 文件：

```tsx
// utils.ts
export const foo = () => "Hello, World!";
```

在另一個 TypeScript 文件中，你可以顯式地包含擴展名進行導入：

```tsx
// index.ts
import { foo } from "./utils.ts"; // 如果 allowImportingTsExtensions 為 true，這將被允許
console.log(foo());
```

### **allowUmdGlobalAccess**

當設定為 `true` 時，允許你在模塊文件內部訪問 UMD 模塊的全局變量。模塊文件是指包含導入和/或導出的文件。沒有這個選項時，使用 UMD 模塊的導出需要一個導入聲明。

**說明範例：**

假設你使用一個 UMD 模塊：

```jsx
// utils.js (UMD 模塊)
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory();
  } else {
    // 全局變量
    root.myLibrary = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return {
    foo: function () {
      return "Hello, World!";
    }
  };
}));
```

在 TypeScript 文件中，你可以直接使用這個全局變量：

```tsx
// index.ts
declare var myLibrary: any;

console.log(myLibrary.foo()); // 如果 allowUmdGlobalAccess 為 true，這將被允許
```

### **baseUrl**

設定相對模塊導入的基礎路徑。這個選項主要用於解析非絕對路徑的模塊，允許你在項目中使用更簡潔的導入路徑。

**說明範例：**

假設你的項目結構如下：

```
src/
  components/
    Header.ts
  utils/
    helpers.ts
tsconfig.json

```

在 `tsconfig.json` 中設定 `baseUrl` 為 `src`：

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  }
}
```

這樣，你可以在 `Header.ts` 中使用相對於 `src` 目錄的路徑來導入模塊：

```tsx
// src/components/Header.ts
import { helperFunction } from "utils/helpers"; // 如果 baseUrl 設定為 src，這將被允許
```

這樣的配置使導入路徑更加簡潔，避免了使用相對路徑（例如 `../../utils/helpers`）的麻煩。

### **customConditions**

`customConditions` 允許你指定一些額外的條件，這些條件在 TypeScript 解析 `package.json` 的 `exports` 或 `imports` 字段時應該被考慮。這些條件會添加到解析器默認使用的條件列表中。

**說明範例：**

假設在你的 `tsconfig.json` 中設定了 `customConditions`：

```json
{
  "compilerOptions": {
    "target": "es2022",
    "moduleResolution": "bundler",
    "customConditions": ["my-condition"]
  }
}
```

這樣，在引用 `package.json` 中的 `exports` 或 `imports` 字段時，TypeScript 會考慮名為 `my-condition` 的條件。

例如，你的 `package.json` 文件包含以下內容：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "exports": {
    ".": {
      "my-condition": "./foo.mjs",
      "node": "./bar.mjs",
      "import": "./baz.mjs",
      "require": "./biz.mjs"
    }
  }
}
```

在 TypeScript 文件中進行導入時：

```tsx
// main.ts
import myPackage from "my-package";
// TypeScript 將根據 `my-condition` 解析到 `./foo.mjs`
```

設定 `customConditions` 後，TypeScript 在解析 `exports` 或 `imports` 字段時，會優先考慮匹配 `my-condition` 的文件。例如，上面的配置會讓 TypeScript 在解析 `my-package` 時選擇 `./foo.mjs` 文件，而不是其他條件匹配的文件。

這樣的配置允許你在模塊解析過程中使用自定義條件，以適應不同的運行環境或配置需求。這對於需要在不同環境中使用不同導出文件的應用程序特別有用。例如，你可以根據不同的條件提供不同的模塊版本，從而提高靈活性和適應性。

<aside>
⚠️ 請注意，這個選項僅在 `--moduleResolution` 設置為 `node16`, `nodenext` 或 `bundler` 時有效。

</aside>

### **module**

`module` 設定 TypeScript 編譯後的 JavaScript 模組格式，適用於不同的運行環境和需求。以下是主要的幾個選項及其適用場景：

1. **CommonJS**
    - 適用於 Node.js 環境。
    - 生成 CommonJS 模組格式。
    - 範例：
        
        ```jsx
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.twoPi = void 0;
        const constants_1 = require("./constants");
        exports.twoPi = constants_1.valueOfPi * 2;
        ```
        
2. **UMD**
    - 適用於能在多種環境（如 Node.js、AMD 模組系統、全域變數）中運行的程式碼。
    - 範例：
        
        ```jsx
        (function (factory) {
            if (typeof module === "object" && typeof module.exports === "object") {
                var v = factory(require, exports);
                if (v !== undefined) module.exports = v;
            } else if (typeof define === "function" && define.amd) {
                define(["require", "exports", "./constants"], factory);
            }
        })(function (require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.twoPi = void 0;
            const constants_1 = require("./constants");
            exports.twoPi = constants_1.valueOfPi * 2;
        });
        ```
        
3. **AMD**
    - 適用於瀏覽器環境中的非同步模組定義。
    - 範例：
        
        ```jsx
        define(["require", "exports", "./constants"], function (require, exports, constants_1) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.twoPi = void 0;
            exports.twoPi = constants_1.valueOfPi * 2;
        });
        
        ```
        
4. **System**
    - 使用 SystemJS 載入模組。
    - 範例：
        
        ```jsx        
        System.register(["./constants"], function (exports_1, context_1) {
            "use strict";
            var constants_1, twoPi;
            var __moduleName = context_1 && context_1.id;
            return {
                setters: [
                    function (constants_1_1) {
                        constants_1 = constants_1_1;
                    }
                ],
                execute: function () {
                    exports_1("twoPi", twoPi = constants_1.valueOfPi * 2);
                }
            };
        });
        ```
        
5. **ESNext、ES2022**
    - 適用於現代 JavaScript 環境，生成 ES 模組格式。
    - 支援最新的 JavaScript 特性，如動態匯入 (`import()`) 和頂層 await。
    - 範例：
        
        ```jsx
        import { valueOfPi } from "./constants";
        export const twoPi = valueOfPi * 2;
        ```
        
6. **node16、nodenext**
    - 從 TypeScript 4.7 開始支援，與 Node.js 的原生 ECMAScript 模塊支持集成，根據文件副檔名和最近的 `package.json` 中的 `type` 設定來選擇生成 CommonJS 或 ES2020 格式
    - 範例：
        
        ```jsx
        import { valueOfPi } from "./constants";
        export const twoPi = valueOfPi * 2;
        ```
        
7. **preserve**
    - 在 `--module preserve` 模式下，保留原始的 ECMAScript 匯入和匯出語句，混合使用 CommonJS 和 ECMAScript 模塊語句。
    - 範例：
        
        ```tsx
        import { valueOfPi } from "./constants";
        const constants = require("./constants");
        export const piSquared = valueOfPi * constants.valueOfPi;
        ```
        

### **moduleResolution**

`moduleResolution` 設定 TypeScript 在編譯過程中如何解析模組匯入路徑的策略。不同的策略適用於不同的運行環境和需求。以下是主要的幾個選項及其適用場景：

1. **node16 或 nodenext**
    - 適用於現代版本的 Node.js。
    - Node.js 12 及更高版本同時支援 **ECMAScript imports** 和 **CommonJS require** 的不同解析演算法。
    - 與相應的 `module` 值結合時，根據 Node.js 在輸出 JavaScript 程式碼中看到的匯入或 require，選擇正確的解析演算法。
2. **node10**
    - 適用於 Node.js 10 之前的版本，只支援 CommonJS require。
    - 在現代程式碼中可能不需要使用 `node10`。
3. **bundler**
    - 適用於打包工具。
    - 像 `node16` 和 `nodenext` 一樣，此模式支援 `package.json` 中的 `imports` 和 `exports` 欄位。
    - 與 Node.js 解析模式不同的是，打包工具在匯入的相對路徑上不需要文件擴展名。
4. **classic**
    - TypeScript 1.6 發佈前使用的解析模式。
    - 不推薦使用 `classic`。

### **moduleSuffixes**

`moduleSuffixes` 允許你為匯入模組指定一個後綴列表。TypeScript 會依次嘗試這些後綴，直到找到匹配的模組。

**說明範例：**

假設你有以下文件結構：

```css
src/
  utils.ts
  utils.test.ts
  tsconfig.json
```

在 `tsconfig.json` 中配置 `moduleSuffixes`：

```json
{
  "compilerOptions": {
    "moduleSuffixes": [".test", ""]
  }
}
```

這樣，當你匯入 `./utils` 時，TypeScript 會先嘗試 `./utils.test.ts`，如果找不到，則會嘗試 `./utils.ts`：

```tsx
// main.ts
import { foo } from "./utils"; // 這將優先匹配 utils.test.ts，其次是 utils.ts
```

### **noResolve**

`noResolve` 配置選項禁止 TypeScript 自動解析模組匯入和引用。默認情況下，TypeScript 會檢查初始文件集中的匯入和 `<reference>` 指令，並將這些解析後的文件新增到你的程序中。儘管如此，TypeScript 仍會檢查匯入語句以確保它們解析為有效模組。

**說明範例：**

假設你有以下文件結構：

```css
src/
  main.ts
  utils.ts
  tsconfig.json
```

在 `tsconfig.json` 中配置 `noResolve`：

```json
{
  "compilerOptions": {
    "noResolve": true}
}
```

**TypeScript 文件：**

```tsx
// main.ts
import { foo } from "./utils"; // TypeScript 不會解析和編譯 utils.ts
```

### **paths**

`paths` 配置選項允許你為模組匯入指定自訂路徑對應。這對於重構項目結構或簡化模組匯入特別有用。

**說明範例：**

假設你有以下文件結構：

```
src/
  components/
    Header.ts
  utils/
    helpers.ts
  tsconfig.json
```

在 `tsconfig.json` 中配置 `paths`：

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

這樣，你可以使用別名來匯入模組：

```tsx
// main.ts
import { Header } from "@components/Header";
import { helperFunction } from "@utils/helpers";
```

### **resolveJsonModule**

`resolveJsonModule` 允許你匯入 `.json` 文件並將其內容作為模組使用。這對於需要使用 JSON 配置或資料文件的項目特別有用。

**說明範例：**

假設你有以下文件結構：

```
src/
  config.json
  tsconfig.json
```

在 `tsconfig.json` 中配置 `resolveJsonModule`：

```json
{
  "compilerOptions": {
    "resolveJsonModule": true}
}
```

**JSON 文件：**

```json
// config.json
{
  "apiEndpoint": "https://api.example.com",
  "timeout": 5000
}
```

**TypeScript 文件：**

```tsx
// main.ts
import config from "./config.json";

console.log(config.apiEndpoint); // "https://api.example.com"
console.log(config.timeout); // 5000
```

### **resolvePackageJsonExports**

`resolvePackageJsonExports` 選項讓 TypeScript 在解析模塊時考慮 `package.json` 文件中的 `exports` 字段。這對於現代 JavaScript 包結構非常有用，能夠正確處理不同的導入格式。

**默認設置：**

- 當 `moduleResolution` 設置為 `node16`、`nodenext` 或 `bundler` 時，默認為 `true`。
- 否則默認為 `false`。

**說明範例：**

假設 `package.json` 包含以下 `exports` 字段：

```json
{
  "name": "my-package",
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js"
    }
  }
}
```

這樣，當你導入這個包時，TypeScript 會根據 `exports` 字段選擇正確的模塊文件。

### **resolvePackageJsonImports**

`resolvePackageJsonImports` 選項讓 TypeScript 在解析以 `#` 開頭的導入時，考慮 `package.json` 文件中的 `imports` 字段。這對於自定義路徑映射非常有用。

**默認設置：**

- 當 `moduleResolution` 設置為 `node16`、`nodenext` 或 `bundler` 時，默認為 `true`。
- 否則默認為 `false`。

**說明範例：**

假設 `package.json` 包含以下 `imports` 字段：

```json
{
  "name": "my-project",
  "imports": {
    "#utils/*": "./src/utils/*"
  }
}
```

這樣，當你使用 `#utils/helpers` 這樣的導入時，TypeScript 會根據 `imports` 字段解析到正確的文件。

### **rootDir**

`rootDir` 用於指定編譯輸入文件的根目錄，TypeScript 會保持輸入文件的目錄結構在輸出目錄中不變。

**默認設置：**

- 所有非聲明文件的最長公共路徑。如果設置了 `composite`，默認為包含 `tsconfig.json` 的目錄。

**說明範例：**

假設項目結構如下：

```css
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts

```

默認情況下，`rootDir` 為 `core/`。如果希望輸出保留 `core` 目錄，可以在 `tsconfig.json` 中設置 `rootDir` 為 `.`：

這樣，編譯後的文件結構將包含 `core` 目錄：

```css
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js

```

### **rootDirs**

`rootDirs` 允許你將多個目錄視為同一虛擬目錄結構的一部分，這對於多源目錄項目中特別有用。

**說明範例：**

假設項目結構如下：

```css
src
└── views
    └── view1.ts
    └── view2.ts
generated
└── templates
    └── views
        └── template1.ts
```

在 `tsconfig.json` 中配置 `rootDirs`：

```json
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}

```

這樣，TypeScript 會將 `src/views` 和 `generated/templates/views` 視為同一虛擬目錄結構的一部分，允許模塊在這兩個目錄之間相互導入。

**TypeScript 文件：**

```tsx
// src/views/view1.ts
import { template1 } from "./template1"; // 可以導入 generated/templates/views/template1.ts
```

### **typeRoots**

`typeRoots` 用於指定 TypeScript 查找類型定義文件的根目錄。這個選項允許你自定義類型定義文件的搜索範圍，而不是使用默認的 `node_modules/@types` 目錄。

**說明範例：**

假設你的項目結構如下：

```vbnet
MyProj
├── tsconfig.json
├── custom_typings
│   ├── lib
│   │   ├── index.d.ts

```

在 `tsconfig.json` 中配置 `typeRoots`：

```json
{
  "compilerOptions": {
    "typeRoots": ["./custom_typings"]
  }
}
```

這樣，TypeScript 會在 `custom_typings` 目錄下查找類型定義文件，而不是默認的 `node_modules/@types`。

### **types**

`types` 用於指定 TypeScript 需要包含在編譯中的類型定義包。這個選項允許你精確控制需要包含的類型定義，而不是自動包含 `node_modules/@types` 下的所有類型定義。

**說明範例：**

假設你的項目使用了 `lodash` 和 `jquery`，但你只希望包含 `lodash` 的類型定義。

在 `tsconfig.json` 中配置 `types`：

```json
{
  "compilerOptions": {
    "types": ["lodash"]
  }
}
```

這樣，TypeScript 只會包含 `lodash` 的類型定義，而不會包含 `jquery` 或其他包的類型定義。


<br/>


## **Emit**

### **declaration**

`declaration` 選項啟用 TypeScript 編譯器生成 `.d.ts` 類型定義文件。

**說明範例：**

假設你的目錄結構如下：

```css
src/
  index.ts
  utils.ts
tsconfig.json
```

這樣，編譯後會生成對應的 `.d.ts` 文件：

```
dist/
  index.js
  index.d.ts
  utils.js
  utils.d.ts
```

### **declarationDir**

`declarationDir` 選項用於指定生成的類型定義文件應該放置的目錄。這個選項對於希望將輸出目錄與原始碼目錄分開的項目特別有用。

**說明範例：**

假設你的項目結構如下：

```css
src/
  index.ts
  utils.ts
tsconfig.json
```

這樣，編譯後的類型定義文件會放置在 `types` 目錄中：

```
types/
  index.d.ts
  utils.d.ts
dist/
  index.js
  utils.js
```

### **declarationMap**

`declarationMap` 選項啟用生成 `.d.ts.map` 文件，這些文件提供了 `.d.ts` 類型定義文件的來源對應。這對於偵錯類型定義文件中特別有用，可以追蹤類型資訊到源 TypeScript 文件。

**說明範例：**

這樣，編譯後會生成對應的 `.d.ts.map` 文件：

```arduino
dist/
  index.js
  index.d.ts
  index.d.ts.map
  utils.js
  utils.d.ts
  utils.d.ts.map
```

### **downlevelIteration**

`downlevelIteration` 選項啟用在目標較低版本的 JavaScript（如 ES5）中正確編譯迭代器。這對於需要支援舊版 JavaScript 運行環境的項目特別有用。

**說明範例：**

假設你有以下程式碼：

```tsx
const array = [1, 2, 3];
for (const value of array) {
  console.log(value);
}
```

這樣，編譯後的 JavaScript 文件會正確處理迭代器，即使目標是 ES5：

```jsx
var array = [1, 2, 3];
for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
  var value = array_1[_i];
  console.log(value);
}
```

### **emitBOM**

`emitBOM` 選項用於指定是否在輸出的文件中包含 BOM (Byte Order Mark)。某些 run-time 環境需要 BOM 才能正確解釋 JavaScript 檔案；而某些則不支援。

### **emitDeclarationOnly**

`emitDeclarationOnly` 選項用於指定 TypeScript 只生成類型定義文件，而不生成對應的 JavaScript 文件。這對於只需要提供類型定義而不需要實際運行程式碼的情況特別有用。

**說明範例：**

假設你的項目結構如下：

```css
src/
  index.ts
  utils.ts
```

如果 `emitDeclarationOnly` 設置為 `true`，編譯後只會生成 `.d.ts` 文件，而不會生成對應的 `.js` 文件：

```
dist/
  index.d.ts
  utils.d.ts
```

### **importHelpers**

`importHelpers` 選項用於指定 TypeScript 是否從 `tslib` 模組中匯入幫助函數，從而減少生成的程式碼體積。這個選項特別適用於使用多個文件的項目，因為這些幫助函數（如 `__extends`, `__assign`）將只會被引入一次，而不是每個文件都生成一份。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
class Base {
  constructor(public name: string) {}
}

class Derived extends Base {
  constructor(name: string, public age: number) {
    super(name);
  }
}
```

如果 `importHelpers` 設定為 `true`，編譯後的 `index.js` 文件將使用 `tslib` 中的幫助函數：

```jsx
import { __extends } from "tslib";

var Base = /** @class */ (function () {
  function Base(name) {
    this.name = name;
  }
  return Base;
})();

var Derived = /** @class */ (function (_super) {
  __extends(Derived, _super);
  function Derived(name, age) {
    var _this = _super.call(this, name) || this;
    _this.age = age;
    return _this;
  }
  return Derived;
})(Base);
```

### **inlineSourceMap**

`inlineSourceMap` 選項用於指定是否將 Source Map 內聯到生成的 JavaScript 文件中，而不是生成單獨的 `.map` 文件。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
const message = "Hello, World!";
console.log(message);

```

如果 `inlineSourceMap` 設定為 `true`，編譯後的 `index.js` 文件將包含內聯的 Source Map：

```jsx
var message = "Hello, World!";
console.log(message);
//# sourceMappingURL=data:application/json;base64,...
```

### **inlineSources**

`inlineSources` 選項用於指定是否將 TypeScript 源文件內容內聯到 Source Map 中。這在生成 Source Map 並進行偵錯時特別有用，這樣可以在偵錯工具中直接查看 TypeScript 原始碼，而無需單獨的源文件。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
const message = "Hello, World!";
console.log(message);
```

如果 `inlineSources` 設定為 `true`，編譯後的 `index.js` 文件中的 Source Map 將包含 TypeScript 源文件內容：

```jsx
var message = "Hello, World!";
console.log(message);
//# sourceMappingURL=data:application/json;base64,...
/* sourceMapping comment includes the inlined source */
```

### **mapRoot**

`mapRoot` 選項用於指定生成的 Source Map 文件的根目錄。這個選項特別適用於將編譯後的文件放置在不同於源文件的位置時，可以確保 Source Map 文件的路徑正確。

**說明範例：**

假設你的項目結構如下：

```css
src/
  index.ts
dist/
  js/
  maps/
tsconfig.json
```

在 `tsconfig.json` 中配置 `mapRoot` 為 `"./maps"`，這樣編譯後的 Source Map 文件將被放置在 `maps` 目錄中，而 JavaScript 文件將被放置在 `js` 目錄中。

```json
{
  "compilerOptions": {
    "outDir": "./dist/js",
    "sourceMap": true,
    "mapRoot": "./maps"
  }
}
```

這樣，編譯後的文件結構將如下：

```arduino
dist/
  js/
    index.js
    index.js.map // Source map 會指向 mapRoot 中的對應位置
  maps/
    index.js.map
```

### **newLine**

`newLine` 選項用於指定編譯後的文件中使用的行結尾符。這個選項允許你選擇不同的行結尾符以適應不同的作業系統或程式碼風格要求。

可選值：

- `crlf`：Enter分行符號，適用於 Windows。
- `lf`：分行符號，適用於 Unix/Linux 和 macOS。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
const message = "Hello, World!";
console.log(message);
```

如果 `newLine` 設定為 `lf`，編譯後的 `index.js` 文件將使用 LF 作為行結尾符：

```jsx
const message = "Hello, World!\n";
console.log(message);
```

如果 `newLine` 設定為 `crlf`，編譯後的 `index.js` 文件將使用 CRLF 作為行結尾符：

```jsx
const message = "Hello, World!\r\n";
console.log(message);
```

### **noEmit**

`noEmit` 選項用於指定 TypeScript 編譯器在編譯過程中不生成任何輸出文件。這個選項特別適用於僅進行類型檢查而不需要生成輸出文件的情況。

### **noEmitHelpers**

`noEmitHelpers` 選項用於禁止 TypeScript 自動生成幫助函數（如 `__extends`, `__awaiter`, `__generator` 等），而是期望這些幫助函數由全域範圍內的自訂實現來提供。這可以減少生成的程式碼量，特別是當多個文件中需要相同的幫助函數時。

**說明範例：**

假設你有以下使用 `async` 函數的 TypeScript 程式碼：

```tsx
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

在沒有設定 `noEmitHelpers` 時，編譯後的 JavaScript 程式碼會包含幫助函數：

```jsx
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var getAPI = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Get API
        return [2 /*return*/, {}];
    });
}); };
```

如果設定 `noEmitHelpers` 為 `true`，TypeScript 將不再內聯這些幫助函數，而是期望你在全域範圍內提供它們：

```tsx
// 在全域範圍內提供 __awaiter 和 __generator
global.__awaiter = function (thisArg, _arguments, P, generator) {
    // 幫助函數的實現...
};

global.__generator = function (thisArg, body) {
    // 幫助函數的實現...
};
```

這樣，編譯後的 JavaScript 程式碼將使用你提供的全域幫助函數：

```jsx
"use strict";
var getAPI = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Get API
        return [2 /*return*/, {}];
    });
}); };
```

使用這個選項，你可以完全控制幫助函數的實現方式，並減少生成的 JavaScript 文件的大小。

### **noEmitOnError**

`noEmitOnError` 選項用於指定當編譯過程中發生類型檢查錯誤時不生成任何輸出文件。這可以確保只有在程式碼沒有錯誤的情況下才生成輸出文件。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
const message: number = "Hello, World!"; // 類型錯誤
console.log(message);
```

如果 `noEmitOnError` 設定為 `true`，編譯過程中檢測到類型錯誤，TypeScript 將不會生成 `index.js` 文件。這樣可以防止有錯誤的程式碼進入生產環境：

### **outDir**

`outDir` 選項用於指定 TypeScript 編譯後的輸出目錄。這個選項可以將所有生成的 JavaScript 文件、地圖文件和類型定義文件放在指定的目錄中，從而保持源文件目錄的整潔。

**說明範例：**

假設你的項目結構如下：

```css
src/
  index.ts
  utils.ts
tsconfig.json
```

這樣，編譯後的文件結構如下：

```css
dist/
  index.js
  utils.js
src/
  index.ts
  utils.ts
```

### **outFile**

`outFile` 選項用於將所有輸入文件合併為一個輸出文件。這個選項通常用於生成單個文件的應用場景，如單頁應用或合併指令碼。

**說明範例：**

假設你的項目結構如下：

```css
src/
  a.ts
  b.ts
tsconfig.json
```

在 `tsconfig.json` 中設定 `outFile` 為 `"dist/output.js"`，那麼編譯後所有的輸入文件將合併為一個 `output.js` 文件：

這樣，編譯後的文件結構如下：

```css
dist/
  output.js
src/
  a.ts
  b.ts
```

### **preserveConstEnums**

`preserveConstEnums` 選項用於指定 TypeScript 編譯器是否保留 `const enum` 的聲明。默認情況下，TypeScript 會在編譯過程中內聯 `const enum` 的值並移除其聲明，而啟用此選項後，`const enum` 的聲明將被保留在編譯後的輸出中。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// enums.ts
export const enum Colors {
  Red,
  Green,
  Blue
}

// index.ts
import { Colors } from "./enums";

console.log(Colors.Red);
```

如果 `preserveConstEnums` 設置為 `true`，編譯後的 JavaScript 文件將保留 `const enum` 的聲明：

```jsx
// enums.js
export const enum Colors {
  Red,
  Green,
  Blue
}

// index.js
import { Colors } from "./enums";

console.log(Colors.Red);
```

如果 `preserveConstEnums` 設置為 `false`，編譯後的 JavaScript 文件將內聯 `const enum` 的值並移除其聲明：

```jsx
// index.js
console.log(0 /* Colors.Red */);
```

### **removeComments**

`removeComments` 選項用於指定 TypeScript 編譯器是否在編譯後的輸出文件中移除註釋。這對於縮小輸出文件大小或刪除不必要的註釋非常有用。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// index.ts
// This is a comment
const message = "Hello, World!";
console.log(message); // Log the message
```

如果 `removeComments` 設置為 `true`，編譯後的 JavaScript 文件將不包含註釋：

```jsx
const message = "Hello, World!";
console.log(message);
```

### **sourceMap**

`sourceMap` 選項用於指定 TypeScript 是否生成對應的 `.map` 文件，這些文件用於偵錯時將編譯後的 JavaScript 對應回原始的 TypeScript 程式碼。

### **sourceRoot**

`sourceRoot` 選項用於指定 Source Map 文件中指向 TypeScript 源文件的根目錄。這在將輸出文件放在與源文件不同的目錄結構中時特別有用。

### **stripInternal**

`stripInternal` 選項用於指定 TypeScript 是否移除帶有 `/** @internal */` 註釋的程式碼。這對於從生成的 `.d.ts` 類型定義文件中移除內部 API 特別有用，使得這些內部 API 不會暴露給最終的使用者。

**說明範例：**

假設你有以下 TypeScript 文件：

```tsx
// api.ts
/** @internal */
export function internalFunction() {
  console.log("This is an internal function");
}

export function publicFunction() {
  console.log("This is a public function");
}
```

在 `tsconfig.json` 中設定 `stripInternal` 為 `true`。這樣，生成的 `api.d.ts` 文件將不包含內部的 `internalFunction` 定義：

```tsx
// api.d.ts
export declare function publicFunction(): void;
```


<br/>


## **JavaScript Support**

### **allowJs**

`allowJs` 選項允許 TypeScript 編譯器編譯 JavaScript 文件。這對於漸進式地將現有的 JavaScript 項目遷移到 TypeScript 特別有用，因為你可以逐步將 JavaScript 文件轉換為 TypeScript 文件，而不必一次性完成。

### **checkJs**

`checkJs` 選項允許 TypeScript 編譯器對 JavaScript 文件進行語法和類型檢查。這對於在純 JavaScript 項目中引入靜態類型檢查非常有用，可以幫助捕捉到更多潛在的錯誤。

### **maxNodeModuleJsDepth**

`maxNodeModuleJsDepth` 選項用於指定 TypeScript 在 `node_modules` 目錄中遞歸查找和加載 JavaScript 文件的最大深度。這個選項僅在 `allowJs` 啟用時生效，用於讓 TypeScript 推斷 `node_modules` 中所有 JavaScript 文件的類型。

默認情況下，`maxNodeModuleJsDepth` 設置為 `0`，建議保持默認值，並使用 `.d.ts` 文件來明確定義模塊的形狀。


<br/>


## **Editor Support**

### **disableSizeLimit**

`disableSizeLimit` 選項用於禁用 TypeScript 編譯器對文件大小的限制。默認情況下，TypeScript 會對編譯的文件大小進行限制，以防止編譯器處理過大的文件導致性能問題。啟用此選項後，這一限制將被移除。

**說明範例：**

假設你有一個非常大的 TypeScript 文件：

```tsx
// largeFile.ts
const largeArray = new Array(1000000).fill(0);
console.log(largeArray);
```

如果 `disableSizeLimit` 設置為 `true`，TypeScript 將允許編譯這個大文件而不會報錯：

### **plugins**

`plugins` 選項用於配置在編輯器中運行的語言服務外掛。這些外掛可以基於現有的 TypeScript 檔案提供額外的資訊，增強 TypeScript 與編輯器之間的消息，或提供自訂的錯誤消息。

**說明範例：**

假設你想使用一些語言服務外掛來增強編輯器中的 TypeScript 體驗：

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-sql-plugin"
      },
      {
        "name": "typescript-styled-plugin"
      },
      {
        "name": "typescript-eslint-language-service"
      },
      {
        "name": "ts-graphql-plugin"
      }
    ]
  }
}
```

**常見外掛：**

- `ts-sql-plugin`：為範本字串中的 SQL 程式碼提供 SQL 語法檢查。
- `typescript-styled-plugin`：為範本字串中的 CSS 程式碼提供 CSS 語法檢查。
- `typescript-eslint-language-service`：在編譯器的輸出中提供 ESLint 錯誤消息和修正建議。
- `ts-graphql-plugin`：為 GraphQL 查詢範本字串提供驗證和自動完成。


<br/>


## **Interop Constraints**

### **allowSyntheticDefaultImports**

`allowSyntheticDefaultImports` 選項允許你在模組沒有顯式默認匯出的情況下，使用默認匯入語法。這對於與某些工具（如 Babel）一起使用時特別有用，因為這些工具會自動建立默認匯出，使程式碼更加簡潔。

**說明範例：**

假設你有一個 JavaScript 檔案：

```jsx
// utilFunctions.js
const getStringLength = (str) => str.length;

module.exports = {
  getStringLength,
};
```

在 TypeScript 檔案中，如果 `allowSyntheticDefaultImports` 設定為 `true`，你可以使用默認匯入語法來匯入這個模組：

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true}
}
```

```tsx
// index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
console.log(count); // 正常工作，因為啟用了 allowSyntheticDefaultImports
```

如果 `allowSyntheticDefaultImports` 設定為 `false`，你必須使用命名匯入語法：

```tsx
// index.ts
import * as utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
console.log(count); // 也能正常工作，但語法較繁瑣
```

當 `allowSyntheticDefaultImports` 為 `true` 時，即使模組沒有顯式默認匯出，你也可以像使用默認匯出一樣進行匯入。這個選項不會影響 TypeScript 編譯後的 JavaScript 檔案，它只是改變了類型檢查的行為，使其與 Babel 等工具的行為一致。

### **esModuleInterop**

`esModuleInterop` 選項啟用 ECMAScript 模組與 CommonJS 模組之間的互操作性。這個選項會修正 TypeScript 在處理這些模組時的一些不一致行為，確保生成的程式碼符合 ECMAScript 標準。

**問題背景**

在默認情況下（`esModuleInterop` 設定為 `false` 或未設定），TypeScript 會將 CommonJS/AMD/UMD 模組處理得類似於 ES6 模組，但這裡存在兩個主要問題：

1. **命名空間匯入：** `import * as x from "x"`
    
    TypeScript 在默認情況下會將 `import * as x from "x"` 視為 `const x = require("x")`。這意味著 `x` 可以是任何類型，包括函數。然而，這違反了 ES6 模組的規範，因為 ES6 規範明確要求命名空間匯入應該僅能是一個物件（object），而不應該是一個可呼叫的函數。
    
    **問題示例**
    
    假設我們有一個 CommonJS 模組，它匯出了一個函數：
    
    ```jsx
    // utilFunctions.js
    module.exports = function() {
      console.log("I am a function");
    };
    ```
    
    在 TypeScript 中，使用命名空間匯入：
    
    ```tsx
    import * as utils from "./utilFunctions";
    
    utils(); // 這是可行的，但違反了 ES6 規範
    ```
    
    根據 ES6 規範，`import * as utils` 應該只能是一個物件，不應該能夠作為函數呼叫。
    
2. **默認匯入：`import x from "x”`**
    
    在 ES6 模組中，默認匯入（`import x from "x"`）要求模組必須顯式匯出一個默認匯出（`export default`）。然而，大多數 CommonJS/AMD/UMD 模組並不遵守這一點。
    
    TypeScript 在默認情況下會將 `import x from "x"` 視為 `const x = require("x").default`。這在嚴格遵守 ES6 規範的模組中是正確的，但大多數使用 CommonJS/AMD/UMD 模組的庫並不遵守這一規範，這會導致執行時出錯。
    
    **問題示例**
    
    假設我們有一個 CommonJS 模組，它沒有默認匯出：
    
    ```jsx
    // utilFunctions.js
    module.exports = {
      getStringLength: (str) => str.length,
    };
    ```
    
    在 TypeScript 中，使用默認匯入：
    
    ```tsx
    import utils from "./utilFunctions";
    
    console.log(utils.getStringLength("Check JS")); // 這將在執行時出錯，因為在原始碼中沒有顯示地默認匯出
    ```
    
    TypeScript 將這段程式碼視為：
    
    ```tsx
    const utils = require("./utilFunctions").default;
    ```
    
    但 `utilFunctions.js` 沒有 `.default` 屬性，這會導致執行時錯誤。
    

**啟用 `esModuleInterop` 的效果**

啟用 `esModuleInterop` 後，TypeScript 會修正這些問題：

1. **修正編譯器行為**：命名空間匯入將符合 ES6 模組規範，確保匯入的物件不能被當作函數呼叫。
2. **新增輔助函數**：TypeScript 會生成新的輔助函數，確保在生成的 JavaScript 中正確處理默認匯入和命名空間匯入。

**示例**

假設你有以下 TypeScript 程式碼：

```tsx
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

**未啟用 `esModuleInterop` 時的編譯結果：**

```jsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");

fs.readFileSync("file.txt", "utf8");
lodash_1.default.chunk(["a", "b", "c", "d"], 2);
```

在這個編譯結果中，`lodash_1.default` 的處理可能會導致執行階段錯誤，因為大多數 CommonJS 模組並不會設定 `.default` 屬性。

**啟用 `esModuleInterop` 後的編譯結果：**

```jsx
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));

fs.readFileSync("file.txt", "utf8");
lodash_1.default.chunk(["a", "b", "c", "d"], 2);
```

在這個編譯結果中，`__importStar` 和 `__importDefault` 輔助函數確保命名空間匯入和默認匯入正確地繫結到模組上，符合 ECMAScript 標準，並確保程式碼在執行階段不會出錯。

### **forceConsistentCasingInFileNames**

`forceConsistentCasingInFileNames` 選項用於強制在文件名中使用一致的大小寫。這有助於避免因為不同大小寫的文件名導致的跨平台問題，特別是在大小寫不敏感的文件系統（如 Windows）和大小寫敏感的文件系統（如 Linux）之間切換時。

**說明範例：**

假設你的項目結構如下：

```css
src/
  MyComponent.ts
  index.ts
```

在 `index.ts` 中，你可能會寫如下程式碼：

```tsx
import { MyComponent } from "./myComponent"; // 注意大小寫不一致
```

如果 `forceConsistentCasingInFileNames` 設定為 `true`，TypeScript 會報錯，因為實際文件名是 `MyComponent.ts`，而不是 `myComponent.ts`。

### **isolatedDeclarations**

`isolatedDeclarations` 選項要求對匯出的內容進行充分的註釋，以便其他工具可以輕鬆生成聲明文件。這對於確保程式碼能夠正確生成 `.d.ts` 文件非常有用。

### **isolatedModules**

`isolatedModules` 選項告訴 TypeScript 每個文件應作為一個獨立的模組進行編譯。這對於使用 Babel 或其他單文件轉譯器的項目特別有用，因為這些工具無法進行跨文件的類型系統理解。

**問題背景**

使用單文件轉譯器（如 Babel）時，它們只能逐個文件進行處理，這意味著它們無法應用需要完整類型系統理解的程式碼轉換。這一限制同樣適用於 TypeScript 的 `ts.transpileModule` API，該 API 被一些建構工具使用。

這些限制可能會導致某些 TypeScript 特性（如 `const enum` 和 `namespace`）在執行階段出現問題。設定 `isolatedModules` 標誌會告訴 TypeScript 警告你某些程式碼在單文件轉譯過程中無法正確解釋。

這不會改變你的程式碼行為，也不會改變 TypeScript 的檢查和輸出過程。

**說明範例：**

**不支援的程式碼示例**

1. **匯出非值識別碼**

在 TypeScript 中，你可以匯入一個類型，然後再匯出它：

```tsx
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

因為 `someType` 不是一個值，所以生成的 JavaScript 不會嘗試匯出它：

```jsx
export { someFunction };
```

單文件轉譯器無法判斷 `someType` 是否生成了一個值，因此匯出一個僅引用類型的名稱會報錯。

1. **非模組文件**

如果設定了 `isolatedModules`，則僅允許在模組中使用命名空間（意味著它必須具有某種形式的匯入/匯出）。如果在非模組文件中發現命名空間，則會報錯：

```tsx
namespace Instantiated {
  export const x = 1;
}
// 錯誤：在啟用 'isolatedModules' 時，不允許在全域指令碼文件中使用命名空間。
```

這一限制不適用於 `.d.ts` 文件。

1. **引用 `const enum` 成員**

在 TypeScript 中，當你引用 `const enum` 成員時，這些引用會被取代為實際值：

```tsx
declare const enum Numbers {
  Zero = 0,
  One = 1,
}

console.log(Numbers.Zero + Numbers.One);
```

轉換為 JavaScript：

```jsx
console.log(0 + 1);
```

如果沒有這些成員的值，其他轉譯器無法替換對 `Numbers` 的引用，這會導致執行階段錯誤。因此，當設定了 `isolatedModules` 時，引用外部 `const enum` 成員會報錯。

### **preserveSymlinks**

`preserveSymlinks` 選項的作用是讓 TypeScript 在解析模塊時保留符號連結（symlinks），而不是將它們解析為實際的路徑。這與 Node.js 的同名標誌相一致，但與 Webpack 的 `resolve.symlinks` 選項的行為相反（即設置 TypeScript 的 `preserveSymlinks` 為 `true` 相當於設置 Webpack 的 `resolve.symlinks` 為 `false`，反之亦然）。

啟用此選項後，對模塊和包的引用（例如 `import` 語句和 `/// <reference type="..." />` 指令）將相對於符號連結文件的位置解析，而不是相對於符號連結解析到的路徑。

### **verbatimModuleSyntax**

`verbatimModuleSyntax` 選項用於告訴 TypeScript 保留所有的原始模組語法，這意味著不會對匯入和匯出的語法進行任何轉換或解析。這個選項簡化了 TypeScript 處理模組匯入和匯出語法的規則，使你看到的程式碼就是最終生成的程式碼。

默認情況下，TypeScript 會執行一種稱為“匯入省略”的操作。如果你僅使用某個匯入進行類型檢查，TypeScript 會在生成的 JavaScript 中刪除這個匯入。這通常是有益的，因為如果某個匯入的值在模組中沒有被匯出，我們會在執行階段遇到錯誤。

但是，這增加了某些邊緣情況的複雜性。例如，對於具有副作用的模組，省略匯入會有所不同。`verbatimModuleSyntax` 簡化了這些情況，任何沒有 `type` 修飾符的匯入或匯出都會被保留。

**說明範例：**

假設你有以下 TypeScript 程式碼：

```tsx
import { Car } from "./car";
export function drive(car: Car) {
  // ...
}
```

默認情況下，TypeScript 會省略掉僅用於類型的匯入，生成的 JavaScript 可能如下所示：

```jsx
export function drive(car) {
  // ...
}
```

但如果設定了 `verbatimModuleSyntax`：

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true}
}
```

這樣，TypeScript 會保留所有匯入語法：

```jsx
import { Car } from "./car";
export function drive(car) {
  // ...
}
```

這使得你看到的 TypeScript 程式碼與最終生成的 JavaScript 程式碼保持一致，避免了由於匯入省略引起的各種問題。


<br/>


## **Backwards Compatibility**

### **charset**

`charset` 選項用於指定編譯輸出文件的字元集編碼。默認情況下，TypeScript 使用系統默認的字元集，但你可以通過設定此選項來指定特定的字元集。

### **importsNotUsedAsValues**

`importsNotUsedAsValues` 選項用於指定對僅用於類型的匯入的處理方式。這對於控制匯入的行為特別有用，特別是在使用一些只在編譯時有意義的匯入時。

**說明範例：**

- `"remove"`: 移除僅用於類型的匯入。
- `"preserve"`: 保留所有匯入。
- `"error"`: 對僅用於類型的匯入產生錯誤。

```json
{
  "compilerOptions": {
    "importsNotUsedAsValues": "preserve"
  }
}
```

### **keyofStringsOnly**

`keyofStringsOnly` 選項限制 `keyof` 運算子僅返回字串類型的鍵。這有助於與舊版 TypeScript 保持相容。

### **noImplicitUseStrict**

`noImplicitUseStrict` 選項停用編譯器自動在文件開頭插入 `"use strict";` 指令。這對於與不使用嚴格模式的舊版程式碼保持相容非常有用。

### **noStrictGenericChecks**

`noStrictGenericChecks` 選項停用對泛型的嚴格檢查。這有助於與舊版程式碼中使用寬鬆泛型約束的情況保持相容。

### **out**

`out` 選項用於將所有輸出文件合併為一個文件。這在某些舊版建構系統中可能是必要的，但不建議在現代項目中使用。

### **preserveValueImports**

`preserveValueImports` 選項保留那些在編譯過程中未使用的匯入值，而這些值本來會被刪除。這有助於確保在編譯後仍能使用這些匯入值。

### **suppressExcessPropertyErrors**

`suppressExcessPropertyErrors` 選項停用對物件字面量中多餘屬性的錯誤檢查。這對於相容使用物件字面量進行靈活配置的舊程式碼特別有用。

### **suppressImplicitAnyIndexErrors**

`suppressImplicitAnyIndexErrors` 選項停用對使用 `any` 類型作為索引簽名的錯誤檢查。這對於相容舊程式碼中特定索引使用方式特別有用。


<br/>


## **Language and Environment**

### **emitDecoratorMetadata**

當我們在 TypeScript 中使用裝飾器時，裝飾器的中繼資料是指在執行階段可以用來描述類、方法、屬性或參數的 metadata。這些中繼資料可以提供有關被裝飾元素的類型、參數類型以及返回類型的資訊。

`emitDecoratorMetadata` 選項會在編譯後的 JavaScript 程式碼中生成關於裝飾器的中繼資料，這些中繼資料可以用於執行階段與  [`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata) 模組一起使用。這對於依賴這些中繼資料進行操作的框架（如 Angular）特別有用。

**說明範例：**

假設你有以下 TypeScript 程式碼使用了裝飾器：

```tsx
function LogMethod(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
}

class Demo {
  @LogMethod
  public foo(bar: number) {
    // do nothing
  }
}

const demo = new Demo();
```

在這個例子中，我們定義了一個方法裝飾器 `LogMethod`，它會在方法被定義時執行。裝飾器的參數包括：

- `target`: 被裝飾方法所屬的類的原型。
- `propertyKey`: 被裝飾方法的名稱。
- `descriptor`: 方法的屬性描述符。

**未啟用 `emitDecoratorMetadata` 時，編譯後的 JavaScript：**

```jsx
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function LogMethod(target, propertyKey, descriptor) {
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);
}
class Demo {
    foo(bar) {
        // do nothing
    }
}
__decorate([
    LogMethod
], Demo.prototype, "foo", null);
const demo = new Demo();
```

在這裡，我們看到裝飾器被應用於 `Demo` 類的 `foo` 方法上，但沒有生成任何中繼資料。

**啟用 `emitDecoratorMetadata` 的編譯結果**

```jsx
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function LogMethod(target, propertyKey, descriptor) {
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);
}
class Demo {
    foo(bar) {
        // do nothing
    }
}
__decorate([
    LogMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], Demo.prototype, "foo", null);
const demo = new Demo();
```

啟用 `emitDecoratorMetadata` 後，我們看到生成的 JavaScript 中包含了三個 `__metadata` 呼叫：

- `__metadata("design:type", Function)`: 描述 `foo` 方法的類型為 `Function`。
- `__metadata("design:paramtypes", [Number])`: 描述 `foo` 方法的參數類型為 `Number`。
- `__metadata("design:returntype", void 0)`: 描述 `foo` 方法的返回類型為 `void`。

這些中繼資料是使用 `reflect-metadata` 模組進行執行階段反射的基礎。

### **experimentalDecorators**

`experimentalDecorators` 選項允許在 TypeScript 中使用裝飾器語法。裝飾器是一種特殊的語法，用於修改類、方法、屬性或參數的行為。目前這個特性還處於實驗階段，因為裝飾器的標準尚未最終確定。

**說明**

### **JSX**

`jsx` 選項用於指定如何處理 JSX 語法。JSX 是一種 JavaScript 語法擴展，常用於像 React 這樣的框架中，用於定義元件的結構。TypeScript 支援多種方式來處理 JSX。

**選項詳解**

1. **preserve**
    - **作用**：保留 JSX 語法，不將其轉換為其他形式。
    - **用途**：通常用於需要進一步處理的情況，例如使用 Babel 進行轉譯。
    - **編譯結果**：生成的文件仍然包含 JSX 語法。
    
    ```jsx
    export const HelloWorld = () => <h1>Hello world</h1>;
    ```
    
2. **react**
    - **作用**：將 JSX 語法轉換為 `React.createElement` 呼叫。
    - **用途**：傳統 React 項目，使用經典的 JSX 轉換方式。
    - **編譬結果**：將 JSX 轉換為 `React.createElement` 呼叫。
    
    ```jsx
    import React from 'react';
    export const HelloWorld = () => React.createElement("h1", null, "Hello world");
    ```
    

**3. react-jsx** 和 **react-jsxdev**

- **作用**：使用新的 JSX 轉換方法，不再需要引入 `React`。
- **用途**：React 17 及更高版本，簡化了 JSX 的轉換。
- **編譯結果**：生成的程式碼不需要引入 `React`，而是使用 JSX 轉換函數。

```jsx
import { jsx as _jsx } from "react/jsx-runtime";
export const HelloWorld = () => _jsx("h1", { children: "Hello world" });
```

- **react-jsxdev**：類似於 `react-jsx`，但包含開發時間的附加檢查和錯誤資訊。
1. **react-native**
    - **作用**：保留 JSX，並假設目標環境是 React Native。
    - **用途**：React Native 項目。
    - **編譯結果**：保留 JSX 語法，與 `preserve` 類似，但針對 React Native 進行最佳化。
        
        ```jsx
        import React from 'react';
        export const HelloWorld = () => <h1>Hello world</h1>;
        ```
        

### **jsxFactory**

`jsxFactory` 選項用於指定在編譯 JSX 元素時調用的函數名稱。默認情況下，這個值是 `React.createElement`，但如果你使用其他框架或庫來處理 JSX，你可以設置此選項來使用自定義的工廠函數。

**說明範例：**

假設你使用 Preact 而不是 React，可以設置 `jsxFactory` 為 `h`，這樣，以下 JSX 程式碼：

```tsx
import { h } from "preact";

const HelloWorld = () => <div>Hello</div>;
```

將被轉換為：

```jsx
const preact_1 = require("preact");
const HelloWorld = () => preact_1.h("div", null, "Hello");
```

你還可以在每個文件中使用 Babel 的指令來指定工廠函數：

```tsx
/** @jsx h */
import { h } from "preact";

const HelloWorld = () => <div>Hello</div>;
```

如果工廠函數定義為 `React.createElement` （預設），編譯器將在檢查全域 JSX 之前檢查 `React.JSX`。如果工廠定義為 `h`，它將在全域 JSX 之前檢查 `h.JSX`。

### **jsxFragmentFactory**

`jsxFragmentFactory` 選項用於指定在編譯 JSX 片段（Fragments）時呼叫的函數名稱。默認情況下，這個值是 `React.Fragment`。如果你使用其他框架或庫來處理 JSX 片段，你可以設定此選項來使用自訂的片段工廠函數。

**說明範例：**

假設你使用 Preact 而不是 React，可以設定 `jsxFragmentFactory` 為 `Fragment`：

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

這樣，以下 JSX 片段程式碼：

```tsx
import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

將被轉換為：

```jsx
const preact_1 = require("preact");
const HelloWorld = () => preact_1.h(preact_1.Fragment, null, preact_1.h("div", null, "Hello"));
```

你還可以在每個文件中使用指令來指定片段工廠函數：

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

### **jsxImportSource**

`jsxImportSource` 選項用於指定在使用 `jsx: react-jsx` 或 `jsx: react-jsxdev` 時匯入的 JSX 工廠函數的模組。這允許你在不顯式引入 React 的情況下使用自訂的 JSX 編譯器。

**說明範例：**

假設你使用 Preact 來處理 JSX，可以設定 `jsxImportSource` 為 `preact`：

這樣，以下 JSX 程式碼：

```tsx
const App = () => <h1>Hello World</h1>;
```

將被轉換為：

```jsx
import { jsx as _jsx } from "preact/jsx-runtime";

const App = () => _jsx("h1", { children: "Hello World" });
```

你還可以在每個文件中使用指令來指定匯入源：

```tsx
/** @jsxImportSource preact */
const App = () => <h1>Hello World</h1>;
```

這將新增 `preact/jsx-runtime` 作為 `_jsx` 工廠的匯入。

### **lib**

`lib` 選項用於指定 TypeScript 應該包含哪些內建的 JavaScript API 和 ECMAScript 版本的類型定義。默認情況下，TypeScript 會自動包含一些常用的 API，如 `Math` 和 `document`，以及與目標 ECMAScript 版本相匹配的 API。

**為什麼要使用 `lib`？**

- 你的程序不運行在瀏覽器中，因此不需要 `dom` 類型定義。
- 你的運行時平台提供了一些 JavaScript API 對象，但尚不支持某些 ECMAScript 語法。
- 你有一些 Polyfill 或原生實現，涵蓋了部分高版本 ECMAScript 的功能。

**使用範例：**

假設你只需要 ES6 的功能和 `dom` 類型定義，可以這樣設置：

```json
{
  "compilerOptions": {
    "lib": ["ES6", "dom"]
  }
}
```

這樣，TypeScript 只會包含 ES6 和 `dom` 的類型定義。

**常用標準庫定義：**

- **ES5**：包含所有 ES3 和 ES5 的核心定義。
- **ES2015**（也稱為 ES6）：包含 ES2015 的附加 API，如 array.find、Promise、Proxy、Symbol、Map、Set、Reflect 等。
- **ES2016**（也稱為 ES7）：包含 ES2016 的附加 API，如 array.includes 等。
- **ES2017**：包含 ES2017 的附加 API，如 Object.entries、Object.values、Atomics、SharedArrayBuffer 等。
- **ES2018**：包含 ES2018 的附加 API，如 async iterables、promise.finally、Intl.PluralRules 等。
- **ES2019**：包含 ES2019 的附加 API，如 array.flat、Object.fromEntries、string.trimStart 等。
- **ES2020**：包含 ES2020 的附加 API，如 string.matchAll 等。
- **ES2021**：包含 ES2021 的附加 API，如 promise.any、string.replaceAll 等。
- **ES2022**：包含 ES2022 的附加 API，如 array.at、RegExp.hasIndices 等。
- **ESNext**：包含最新的 JavaScript 標準中的附加 API，隨著標準演進而變化。
- **DOM**：瀏覽器 DOM 定義，如 window、document 等。
- **WebWorker**：WebWorker 環境中的 API。
- **ScriptHost**：Windows Script Hosting 系統的 API。

### **moduleDetection**

`moduleDetection` 選項用於控制 TypeScript 如何判斷一個文件是指令碼還是模組。

**選項：**

- `auto`（默認）: TypeScript 會檢查文件中的 `import` 和 `export` 語句，並且在 `module: nodenext` 或 `node16` 模式下會檢查 `package.json` 中的 `type` 欄位，當使用 `jsx: react-jsx` 時會檢查當前文件是否為 JSX 文件。
- `legacy`: 與 TypeScript 4.6 及之前的行為一致，只檢查 `import` 和 `export` 語句來判斷文件是否為模組。
- `force`: 強制所有非聲明文件都作為模組處理。

### **noLib**

`noLib` 選項用於停用 TypeScript 默認包含的所有庫文件。如果設定了這個選項，`lib` 選項將被忽略。

**注意**：啟用 `noLib` 後，TypeScript 無法編譯任何東西，除非你自己提供了基本的類型定義，如 `Array`, `Boolean`, `Function` 等。

### **reactNamespace**

`reactNamespace` 選項用於指定在編譯 JSX 時使用的 React 命名空間。默認情況下，這個值是 `React`，但如果你使用自定義的命名空間，可以設置此選項。

### **target**

`target` 選項用於指定 TypeScript 編譯時的目標 ECMAScript 版本。這將影響生成的 JavaScript 語法特性和可用的內建 API。

**常用選項：**

- `ES3`
- `ES5`
- `ES6`/`ES2015`
- `ES2016` 到 `ES2022`
- `ESNext`

### **useDefineForClassFields**

`useDefineForClassFields` 選項用於控制 TypeScript 編譯類欄位時是否使用 `Object.defineProperty`。這是根據 ECMAScript 提案來實現的，並且可以影響類欄位的初始化行為。

**說明範例：**

假設你有以下 TypeScript 程式碼：

```tsx
class Person {
  name = "Alice";
}
```

如果 `useDefineForClassFields` 設定為 `true`，編譯結果將使用 `Object.defineProperty` 來定義欄位：

```jsx
class Person {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Alice"
        });
    }
}
```

如果 `useDefineForClassFields` 設定為 `false`，編譯結果將直接給欄位賦值：

```jsx
class Person {
    constructor() {
        this.name = "Alice";
    }
}
```


<br/>


## **Compiler Diagnostics**

### **diagnostics**

`diagnostics` 選項用於啟用詳盡的編譯診斷資訊。當設定為 `true` 時，TypeScript 編譯器將顯示更多的診斷資訊，包括編譯過程中的內部細節和性能統計資料，這對於偵錯和最佳化大型項目非常有用。

**說明範例：**

啟用後，編譯器將輸出額外的診斷資訊，例如每個文件的編譯時間、記憶體使用情況等：

```yaml
Files:           10
Lines:        30000
Nodes:       100000
Identifiers:  50000
Symbols:      20000
Types:        10000
Memory used:  200000K
I/O read:     0.01s
I/O write:    0.01s
Parse time:   0.20s
Bind time:    0.10s
Check time:   0.30s
Emit time:    0.20s
Total time:   0.80s
```

### **explainFiles**

`explainFiles` 選項用於生成有關 TypeScript 如何確定哪些文件包含在編譯中的詳細資訊。這對於理解和偵錯複雜的項目結構特別有用，特別是在使用了多個 `include`、`exclude` 或 `files` 設定時。

**說明範例：**

啟用後，編譯器將輸出每個文件的包含原因，例如：

```bash
src/index.ts: Matched by 'include' pattern 'src'
src/util.ts: Matched by 'include' pattern 'src'
test/test.ts: Matched by 'include' pattern 'test'
node_modules/some-package/index.d.ts: Matched by 'types' reference
```

### **extendedDiagnostics**

`extendedDiagnostics` 選項提供更詳細的診斷資訊，比 `diagnostics` 選項提供的資訊更多。這個選項特別適用於需要深入瞭解編譯器性能和行為的情況。

### **generateCpuProfile**

`generateCpuProfile` 選項用於生成 CPU 性能分析報告，幫助你分析 TypeScript 編譯過程中的性能問題。當設置這個選項時，TypeScript 編譯器將在編譯期間收集 CPU 性能數據，並生成一個 CPU 分析報告文件。

**說明範例：**

假設你想生成一個 CPU 性能分析報告，可以這樣設置：

```json
{
  "compilerOptions": {
    "generateCpuProfile": "profile.cpuprofile"
  }
}
```

當你運行編譯器時，它將生成一個名為 `profile.cpuprofile` 的文件，你可以使用 Chrome 開發者工具或其他性能分析工具來打開和分析這個文件。

### **listEmittedFiles**

`listEmittedFiles` 選項用於在編譯過程中列出所有已生成的文件。這對於查看哪些文件被編譯器生成以及確認輸出文件是否正確特別有用。

### **listFiles**

`listFiles` 選項用於在編譯過程中列出所有包含在編譯中的文件。這對於查看哪些文件被編譯器包含以及確認輸入文件是否正確特別有用。

### **noCheck**

`noCheck` 選項用於在編譯過程中禁用所有的類型檢查。這對於快速進行編譯而不關注類型錯誤的情況特別有用，特別是在開發早期或進行原型開發時。

這樣，TypeScript 編譯器將忽略所有的類型錯誤，只生成對應的 JavaScript 文件。這有助於快速迭代，但在項目穩定後，建議重新啟用類型檢查以確保程式碼質量。

**注意**：啟用 `noCheck` 後，編譯器將不會報告任何類型錯誤，因此需要謹慎使用。

### **traceResolution**

`traceResolution` 選項用於追蹤模組解析過程中的詳細資訊。當設定為 `true` 時，TypeScript 編譯器將輸出有關模組解析過程的詳細日誌，這對於偵錯模組解析問題非常有用。


<br/>


## **Projects**

### **composite**

`composite` 選項用於啟用增量編譯，允許 TypeScript 項目被另一個 TypeScript 項目引用，並在多個編譯過程中共享編譯狀態。這對於大型項目和 monorepos 特別有用。

**說明範例：**

假設你有一個大型項目，將其拆分為多個子項目進行編譯和管理：

在主項目中，你可以引用這些子項目：

```json
{
  "references": [
    { "path": "../projectA" },
    { "path": "../projectB" }
  ]
}
```

這樣，TypeScript 編譯器將能夠正確地處理和編譯這些相互依賴的項目。

### **disableReferencedProjectLoad**

`disableReferencedProjectLoad` 選項用於停用自動載入參考項目。當設定為 `true` 時，TypeScript 編譯器將不會自動載入在 `references` 欄位中指定的項目，這對於需要手動控制項目載入的情況特別有用。

### **disableSolutionSearching**

`disableSolutionSearching` 選項用於停用在父目錄中搜尋 `tsconfig.json` 或 `jsconfig.json` 文件的行為。當設定為 `true` 時，TypeScript 編譯器將不會在當前項目的父目錄中搜尋這些配置文件，這對於防止無意中引用到錯誤的配置文件特別有用。

### **disableSourceOfProjectReferenceRedirect**

`disableSourceOfProjectReferenceRedirect` 選項用於停用 TypeScript 項目引用中的原始碼重新導向功能。當你在一個 TypeScript 項目中引用另一個 TypeScript 項目時，默認情況下，編譯器會嘗試重新導向到被引用項目的原始碼，而不是已編譯的輸出文件。設定這個選項可以強制編譯器使用已編譯的輸出文件，而不是原始碼。

### **incremental**

`incremental` 選項用於啟用增量編譯。當啟用此選項時，TypeScript 編譯器會生成一個增量編譯的狀態文件，從而在後續的編譯中只編譯自上次編譯以來發生變化的文件。這可以大大加快大型項目的編譯速度。

### **tsBuildInfoFile**

`tsBuildInfoFile` 選項用於指定增量編譯狀態文件的輸出位置。默認情況下，TypeScript 會在與 `outDir` 相同的目錄下生成 `.tsbuildinfo` 文件。如果你希望將這個文件儲存在特定位置，可以使用這個選項來指定文件路徑。


<br/>


## **Output Formatting**

### **noErrorTruncation**

`noErrorTruncation` 選項用於禁用 TypeScript 編譯錯誤消息的截斷。當設置為 `true` 時，TypeScript 編譯器將顯示完整的錯誤消息，而不是將其截斷以適應終端寬度。這對於調試複雜錯誤特別有用，因為你可以看到完整的錯誤上下文。

### **preserveWatchOutput**

`preserveWatchOutput` 選項用於在監視模式下保留編譯輸出。當設置為 `true` 時，每次重新編譯時，編譯器將不會清除上一次編譯的輸出，這樣可以保留之前的錯誤信息和警告，幫助開發者追踪和修復問題。

### **pretty**

`pretty` 選項用於啟用彩色輸出，使得編譯過程中的錯誤和警告信息更具可讀性。這對於在終端中查看編譯輸出特別有用，因為彩色輸出可以幫助你更容易地區分和識別不同類型的消息。


<br/>


## **Completeness**

### **skipDefaultLibCheck**

`skipDefaultLibCheck` 選項用於跳過對默認庫文件（如 `lib.d.ts`）的類型檢查。這可以加快編譯速度，特別是當你確定默認庫文件不會引起問題時。

### **skipLibCheck**

`skipLibCheck` 選項用於跳過對所有聲明文件（`*.d.ts` 文件）的類型檢查。這對於減少編譯時間和避免第三方庫的類型問題影響項目編譯特別有用。


<br/>


## **Watch Options**

### **assumeChangesOnlyAffectDirectDependencies**

`assumeChangesOnlyAffectDirectDependencies` 選項用於假設文件更改僅影響其直接依賴項，而不影響間接依賴項。這可以加快增量編譯的速度，特別是在大型項目中。


<br/>


## **Reference**

- [**@TypeScript - tsconfig**](https://www.typescriptlang.org/tsconfig/)