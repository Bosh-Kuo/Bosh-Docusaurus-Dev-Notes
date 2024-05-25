---
title: "淺談 __esModule 屬性在 JavaScript 模組系統中的作用"
sidebar_label: "[Advanced] __esModule"
description: 探討 JavaScript 模組系統中 ESM 和 CJS 的差異，並深入解析 __esModule 屬性在模組轉換及相容性處理中的關鍵作用。本文將介紹 __esModule 屬性的工作原理，並分析 Webpack 和 TypeScript 如何利用該屬性實現不同模組系統引入導出的兼容性處理。
last_update:
  date: 2024-05-25
keywords:
  - Javascript
  - ECMAScript Module
  - ESM
  - CommonJS
  - CJS
  - __esModule
tags:
  - Javascript
---


## **引言**

**模組系統**是 JavaScript 中一個相對複雜且容易混淆的概念，因此常成為初學者最容易碰壁的部分。在現代 JavaScript 開發中，模組系統允許開發者將程式碼分解成可重用的部分，並更輕鬆地管理依賴關係。目前最主要的模組系統有 `ECMAScript Modules(ESM)` 和 `CommonJS(CJS)`，它們在設計理念和實作方式上有所不同，因此經常造成互操作性的問題。特別是在需要將 **ESM** 模組轉換為 **CJS** 模組時，常常出現不相容的問題。

### **簡單介紹 ESM 和 CJS 模塊系統**

**`ECMAScript Modules（ESM`** 是 JavaScript 的標準模組系統，由 **ES6（ECMAScript 2015）**引入。**ESM** 使用 **import** 和 **export** 關鍵字來進行模組的匯入和匯出，並且支援靜態分析，使得工具能夠在編譯階段最佳化程式碼。以下是一個簡單的 **ESM** 模組範例：

```jsx
// foo.js
export default function foo() {
  console.log('Hello from ESM module');
}

// main.js
import foo from './foo.js';
foo();
```

**`CommonJS（CJS）`**是 Node.js 中廣泛使用的模組系統，使用 **require** 和 **module.exports** 來進行模組的匯入和匯出。以下是一個簡單的 **CJS** 模組範例：

```jsx
// foo.js
module.exports = function foo() {
  console.log('Hello from CJS module');
}

// main.js
const foo = require('./foo.js');
foo();

```

### **為什麼需要進行模組轉換？**

在現實開發情境中，模組轉換的需求來自於模組使用方的支援度問題。在 **ES6** 之前 **CJS** 是最主流的模組方案，被廣泛使用在 Node.js 生態系。即便今日 Node.js 已對 **ESM** 系統有足夠的支援，但由於 Node.js 早期的 npm 套件以及較早期的專案大部分都是以 **CJS** 開發，且因 **CJS** 無法引入 **ESM** 模組系統，當我們以 **ESM** 開發的套件或專案需要在較老舊的專案中引入，或在較老的 Node.js 版本上運行時，就需要將 **ESM** 模組轉換為 **CJS** 模組。

模組轉換過程中，處理**默認匯出（export default）**和**命名匯出（export）**的差異是關鍵之一。**CJS** 並不原生支援`默認匯出`，因此在轉換時需要特別處理。此外，正確地新增 **`__esModule`** 屬性，可以讓轉換後的模組更好地相容 **ESM** 和 **CJS** 系統，減少不必要的錯誤和不相容問題。


<br/>


## **ESM 與 CJS 不相容造成的問題**

### **ESM 的 export default 轉譯成 CJS 後會變成什麼？**

當我們將一個 **ESM** 模組轉譯為 **CJS** 模組時，`export default` 匯出的預設值需要特別處理。這是因為 **CJS** 沒有直接對應的`默認匯出`概念。常見的轉譯工具如 **Babel** 會通過建立一個 `default` 屬性來模擬 **ESM** 的默認匯出。此外，**Babel** 會新增 `__esModule` 屬性來指示這是一個從 **ESM** 轉換來的模組。

**原始 ESM 模組**

```jsx
// esmModule.js
export default function foo() {
  console.log('Hello from ESM module');
}
```

**使用 Babel 轉譯後的 CJS 模組**

```jsx
// cjsModule.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function foo() {
  console.log('Hello from ESM module');
};
```

在這個轉譯後的模組中，我們可以看到 `default` 屬性被新增到 `exports` 物件上，而 `__esModule` 屬性則用來標示這個模組是從 **ESM** 轉換而來的。這樣做的目的是讓 **CJS** 環境中的工具和開發者可以識別並正確處理默認匯出。

### **在 ESM 中默認導入轉譯成 CJS 的模組會發生什麼事？**

前面我們有提到，**CJS** 並不支援默認匯出，若當我們在 **ESM** 中使用默認匯入一個轉譯自 **ESM** 的 **CJS** 模組時，如果 **CJS** 模組沒有 `__esModule` 屬性，就可能會導致以下不相容問題，如以下範例：

```jsx
// cjsModuleNoEsModule.js
exports.default = function() {
  console.log('Hello from default export');
};
exports.name = 'Jony';
exports.age = 16;
```

```jsx
// esmUsageNoEsModule.mjs
import myModule from './cjsModuleNoEsModule.js';

console.log(myModule);        // 輸出: { default: [Function], name: 'Jony', age: 16 }
console.log(myModule.default); // 輸出: [Function]
myModule.default();            // 輸出: 'Hello from default export'
console.log(myModule.name);    // 輸出: 'Jony'
console.log(myModule.age);     // 輸出: 16
```

在這個範例中，因為 **cjsModuleNoEsModule.js** 中沒有 `__esModule` 屬性，**myModule** 會被匯入為一個包含所有屬性的物件。因此，我們需要通過 **myModule.default** 來訪問默認匯出，並且可以直接訪問其他屬性。


<br/>


## **__esModule 屬性**

### **__esModule 屬性的作用**

`__esModule` 屬性是一個用來標示模塊的屬性，表示該模塊是從 ESM 轉換而來的。當一個 **ESM** 模塊被轉換為 **CJS** 模塊時，添加 `__esModule` 屬性可以幫助在 **CJS** 環境中正確地處理默認導出（**export default**）。

延續前面的例子，若我們在 **exports** 添加 **__esModule** 屬性如下：

**CJS 模組定義**

```jsx
// cjsModuleWithEsModule.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function() {
  console.log('Hello from default export');
};
exports.name = 'Jony';
exports.age = 16;
```

**在 ESM 模組中默認匯入這個 CJS 模組**

```jsx
// esmUsageWithEsModule.mjs
import myModule from './cjsModuleWithEsModule.js';

console.log(myModule);        // 輸出: [Function: default]
myModule();                   // 輸出: 'Hello from default export'
console.log(myModule.name);   // 輸出: undefined
console.log(myModule.age);    // 輸出: undefined
```

在這個範例中，由於 **cjsModuleWithEsModule.js** 中有 `__esModule` 屬性，**myModule** 會直接引用 **exports.default**，這使得我們可以直接呼叫 **myModule** 作為函數。然而，這也意味著我們無法直接訪問 name 和 age 屬性，因為這些屬性不是默認匯出的一部分。這可以用`具名匯入`來解決：

```jsx
// esmUsageNamedImport.mjs
import { default as myModule, name, age } from './cjsModuleWithEsModule.js';

myModule();                   // 輸出: 'Hello from default export'
console.log(name);            // 輸出: 'Jony'
console.log(age);             // 輸出: 16
```

### **Webpack 如何根據 __esModule 處理模組引入**

上面的例子我們示範了在 **ESM** 環境下， `__esModule` 如何輔助 **ESM 正確默認匯入沒有默認匯出的 CJS 模組**，接下來我們進一步來認識像 **Webpack** 這樣的打包工具，是如何將以 **ESM** 語法撰寫的程式碼轉換成 **CJS** 模組，且確保打包後的 **CJS** 程式碼能像上述例子一樣被其他 **ESM** 模組以默認匯入。

當 Webpack 打包模塊時，會添加 **__webpack_require__.r** 和 **__webpack_require__.n** 函數來處理 `__esModule` 屬性：

```jsx
// Webpack 轉譯後的程式碼片段
__webpack_require__.r = function(exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
};
__webpack_require__.n = function(module) {
  var getter = module && module.__esModule ? 
    function getDefault() { return module['default']; } : 
    function getModuleExports() { return module; };
  __webpack_require__.d(getter, 'a', getter);
  return getter;
};

```

從以上 Webpack 打包後的程式碼片段可以看到， Webpack 使用 **__webpack_require__.r** 函數添加 `__esModule` 屬性，來標記該模組是否為 **ESM** 模組。並使用 **__webpack_require__.n** 函數來來判斷傳入的模組是 **ESM** 還是 **CJS** 模組，並返回適當的「getter」函數，如果模組是 **ESM** 模組，返回 **getDefault** 函數，用於獲取模組的預設匯出(default export)；如果模組是 **CJS** 模組，返回 getModuleExports 函數，用於獲取模組的整個匯出物件。

### **TypeScript 如何根據 __esModule 處理模組引入**

為了使 **CJS** 模組能夠正確地處理 **ESM** 模組的預設匯入，當 TypeScript 將 **ESM** 轉譯為 **CJS** 模組時，TypeScript 編譯器會新增 `__esModule` 標誌，並在轉譯後的程式碼中檢查它。這個過程通過一個名為 `__importDefault` 的輔助函數來實現，這個函數會檢查 `__esModule` 屬性，以確定如何匯入預設匯出。

假設我們有一個 **ESM** 模組, **bar.ts**：

```jsx
export const bar = 'bar';
export default 'default bar';
```

TypeScript 會將其編譯為 **CJS** 模組：

```jsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bar = 'bar';
exports.default = 'default bar';

```

在另一個 TypeScript 文件中，我們用 **ESM** 語法導入這個模組：

```jsx
import bar, { bar as namedBar } from './bar';
console.log(bar); // 'default bar'
console.log(namedBar); // 'bar'
```

編譯後，會生成以下 **CJS** 程式碼：

```jsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bar_1 = __importDefault(require("./bar"));
console.log(bar_1.default); // 'default bar'
console.log(bar_1.bar); // 'bar'

```

TypeScript compiler 定義了一個輔助函數 `__importDefault`，其作用是幫助處理模組的預設匯入。它會檢查傳入的模組物件 **mod** 是否有 `__esModule` 屬性，且該屬性為 **true**。如果有，則視其為從 **ESM** 轉譯過來的模組，直接返回該模組；否則，視其為 **CJS** 模組並返回一個包含 **default** 屬性的物件，其值為整個模組物件。

在這裡，`__importDefault` 函數確保了即使在 **CJS** 環境中，我們依然能夠使用 `import bar from './bar'` 的 **ESM** 語法來正確地匯入 bar 的**預設匯出**。

總結來說，`__esModule` 標誌和 `__importDefault` 輔助函數使得 TypeScript 能夠在將 **ESM** 模組轉譯為 **CJS** 模組時，正確地處理**預設匯出**和**命名匯出**，從而實現 **ESM** 和 **CJS** 之間的相容性。

:::info
如果不在 **tsconfig.json** 開啟 `esModuleInterop` 編譯選項，則不能使用默認匯入，必須用 `import * bar mod from './bar'` 才能通過編譯。
:::


<br/>


## **Reference**

- **[深入聊一聊__esModule](https://juejin.cn/post/7063002055308214302)**
- **[__esModule 的作用](https://toyobayashi.github.io/2020/06/29/ESModule/)**
- **[What's the purpose of `Object.defineProperty(exports, "__esModule", { value: !0 })`?](https://stackoverflow.com/questions/50943704/whats-the-purpose-of-object-definepropertyexports-esmodule-value-0)**