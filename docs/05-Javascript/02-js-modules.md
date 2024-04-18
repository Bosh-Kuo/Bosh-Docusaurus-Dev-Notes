---
title: Modules - ECMAScript(import, export) & CommonJS(require, module.exports)
sidebar_label: "[Basic] 模組(Modules)"
description: 本篇為介紹 import, export, require 等常見的 Modules 語法
last_update:
  date: 2023-03-09
keywords:
  - Javascript
  - Modules
  - ECMAScript
  - CommonJS
tags:
  - Javascript
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## **Modules**

JavaScript 模組（`Modules`）是一種將程式碼封裝起來，並且以特定介面供其他程式碼使用的方法。在開發一個 project 時將程式碼分成模塊有以下幾個優點：

- 縮短通譯檔案長度，有助於代碼的可讀性和組織。
- 程式碼依照功能區分更方便維護也降低發生衝突的機會
- 有助於 project 中不同文件和部分中使用和重用

### **ECMAScript Modules  vs. CommonJS**

在 JavaScript 中，有兩種主要的模組系統，分別是 **`CommonJS`** 和 **`ECMAScript Modules`**。

`ECMAScript Modules` 是 JavaScript 在 ES6(2015) 後的標準模組系統。它使用 `import` 關鍵字匯入模組，使用 `export` 關鍵字匯出模組。例如，我們可以使用以下方式匯入與匯出模組：

```js
// 匯入模組
import { add, subtract } from './math.js';

// 匯出模組
export { add, subtract };
```

`CommonJS` 是一種用於 Node.js 程式碼的模組系統。它使用 `require()` 函式匯入模組，使用 `module.exports` 屬性匯出模組。例如，我們可以使用以下方式匯入與匯出模組：

```js
// 匯入模組
const math = require('./math.js');

// 匯出模組
module.exports = { add, subtract };
```

:::tip
`ECMAScript Modules` 相對於 `CommonJS` 有以下幾點不同：

1. `載入方式`：CommonJS 使用`同步`載入，而 ECMAScript Modules 使用`非同步`載入。
2. `載入時間`：CommonJS 模組是在運行時載入，而 ECMAScript Modules 在分析時就已經載入，這使得程式碼可以進行更好的靜態分析和優化。
3. `範圍`：在 CommonJS 中，模組是在局部作用域中執行的。而在 ECMAScript Modules 中，模組是在全局作用域中執行的，但是每個模組的變數和函式都是私有的，不會泄漏到全局作用域。


<Tabs>
  <TabItem value="ECMAScript Modules" label="ECMAScript Modules" default>

在 Node.js 環境下，`CommonJS` 的同步載入機制比較適合的例子是文件系統操作。在 Node.js 中，你可以使用 fs 模組來進行文件系統的操作，例如讀取文件、寫入文件、刪除文件等等。如果你使用 `ECMAScript Modules` 來載入 fs 模組，你需要使用 `import` 指令進行非同步載入，例如：

```jsx
import { readFile } from 'fs/promises';

async function readMyFile() {
  const data = await readFile('myFile.txt', 'utf8');
  console.log(data);
}
```
  這樣的寫法需要使用 `async/await` 或者 `Promise`，才能確保在讀取文件完成之後再進行後續操作。
  </TabItem>
  <TabItem value="CommonJS" label="CommonJS">

但是在 `CommonJS` 中，你可以使用 `require()` 函式進行同步載入，例如：

```js
const fs = require('fs');

function readMyFile() {
  const data = fs.readFileSync('myFile.txt', 'utf8');
  console.log(data);
} 
```
這樣的寫法可以讓你直接獲取文件的內容，並且不需要使用 `async/await` 或者 `Promise`。由於在 Node.js 中，文件系統操作通常是同步進行的，因此使用 `CommonJS` 的同步載入機制比較適合。但是需要注意的是，如果你在進行大量的文件系統操作，使用同步載入可能會導致程式阻塞，因此需要根據具體情況進行選擇。
  </TabItem>

</Tabs>
:::


<br/>


## **ECMAScript Modules**

`ECMAScript Modules` 是 `ES6` 引入的一個新特性，它是一個內建的模組系統，可以用來進行模組化開發。`ECMAScript Modules` 使用 import 和 export 關鍵字來載入和導出模組，支援非同步載入和靜態分析。在 `ECMAScript Modules` 中，模組是在編譯時靜態分析的，也就是說，模組載入是在程式碼執行之前完成的。


### **在瀏覽器中運行**
如果要在瀏覽器運行模組化，需要在 `<script>` 標籤加上 `type="module"`，告訴瀏覽器該區塊應該被視為一個模塊。接下來就能在該 `<script>` 內外運用模組功能。
```html
<!doctype html>
<script type="module">
  import {sayHi} from './say.js';

  document.body.innerHTML = sayHi('John');
</script>
```


### **具名匯出/導入 Named Exports/Import**
具名匯出需要將變數預先賦予在特定的名稱上才能匯出。在 import 時必須以 `{}` 引入使用相同的名稱才能取到相同的變數。

我們可以宣告之前就放置 export 來匯出具名變數。
```js
// 📁 user.js
// export an array
export let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// export a constant
export const MODULES_BECAME_STANDARD_YEAR = 2015;
// export a class
export class User {
  constructor(name) {
    this.name = name;
  }
}


// 📁 main.js
import {months, MODULES_BECAME_STANDARD_YEAR, User} from './user.js'; 
new User('John');
```

我們也可以最後再一次性匯出所有已宣告名稱的變數
```js
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}
function sayBye(user) {
  alert(`Bye, ${user}!`);
}
export {sayHi, sayBye}; // a list of exported variables


// 📁 main.js
import {sayHi, sayBye} from './say.js';
sayHi('John');
sayBye('John');
```


### **預設匯出/導入  Default Export/Import**
`default export` 不需要預先賦予變數名稱，可以在 import 時另外賦予任意名稱，且不需使用 `{}` ，但要特別注意 export default 每個檔案僅能有一個。

```js
// 📁 user.js
export default class User { // just add "default"
  constructor(name) {
    this.name = name;
  }
}


// 📁 main.js
import User from './user.js'; // not {User}, just User
new User('John');
```

同樣的，也可以最後再用 `as default` 匯出已宣告命名的變數
```js
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}
// same as if we added "export default" before the function
export {sayHi as default};


// 📁 main.js
import {default as sayHi} from './say.js'; // not {User}, just User
sayHi('John');
```



### **Import ***
通常，我們在花括號 import {...} 中列出要導入的內容，但是如果要導入的內容很多，我們可以使用 `import * as <obj>` 將所有內容作為 object 導入，例如：
```js
// 📁 main.js
import * as say from './say.js';

say.sayHi('John');
say.sayBye('John');
```

:::tip 不需擔心 import 的效能問題
現代構建工具，如 `webpack`等打包工具，會將模塊捆綁在一起並優化它們以加速加載。他們還會刪除沒有使用的導入。
因此若我們用 import * 從一個巨大的 library 只取一小部分需要用的功能，未使用的變數並不會包含在 optimized bundle中，也不會影響到效能。
:::


### **“as” for Import and Export**
我們還可以使用 `as` 將原變數以不同的名稱導入。
```js
// 📁 main.js
import {sayHi as hi, sayBye as bye} from './say.js';

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

同樣的，我們也可以在 export 時，以 `as`將原變數名稱以不同名稱導出。
```js
// 📁 say.js
...
// highlight-next-line
export {sayHi as hi, sayBye as bye};

// 📁 main.js
import * as say from './say.js';

// highlight-start
say.hi('John'); // Hello, John!
say.bye('John'); // Bye, John!
// highlight-end
```


### **重新導出 Re-export**
“重新導出”語法 `export ... from ...` 允許導入內容並立即導出它們（可能使用另一個名稱），如下所示：
```js
export {sayHi} from './say.js'; // re-export sayHi
export {default as User} from './user.js'; // re-export default
```

:::tip 什麼情況下需要導入後立即導出？
當我們正在編寫一個 “`package`”：一個 `package` 包含很多模塊的文件夾、文件，其中只有一些功能是要導出到外部提供別人使用，而許多模塊只用來供其他 `package` 內的內部模塊使用。
:::

假設 package 的資料結結構如下所示
```json
auth/
    index.js
    user.js
    helpers.js
    tests/
        login.js
    providers/
        github.js
        facebook.js
        ...
```
我們希望使用這個 `package` 的人只從這個 `package` 的 `main file` 取得需要的功能。也就是我們希望 `auth/index.js` 匯出所有外部使用者可以使用的功能，使用者也只透過這個入口取得需要的功能。
```js
import {login, logout} from 'auth/index.js'
```

`export ... from ...` 可以幫助我們縮短程式碼
```js
// 📁 auth/index.js
export {login, logout} from './helpers.js'; // re-export login/logout
export * from './user.js'; // to re-export named exports
export {default} from './user.js'; // to re-export the default export
...
```


<br/>


## **CommonJS modules**
`CommonJS` 模塊是為 Node.js 打包 JavaScript 代碼的原始方式。 隨著時間的推移，Node.js 也逐漸開始支援 ECMAScript Modules，但 CJS 仍然廣泛用於後端 Node.js 應用程序。有時，這些模塊將使用 `.cjs` 擴展名編寫。

### **匯出 module.exports**
`module.exports` 是 `CommonJS` 匯出的內容的關鍵字。
```js
const mod1Function = () => console.log('Mod1 is alive!')
const mod1Function2 = () => console.log('Mod1 is rolling, baby!')

module.exports = { mod1Function, mod1Function2 }
```


### **導入 require**
`require()` 是 `CommonJS` 匯出的內容的關鍵字。
```js
({ mod1Function, mod1Function2 } = require('./mod1.js'))

const testFunction = () => {
    console.log('Im the main function')
    mod1Function()
    mod1Function2()
}

testFunction()
```


<br/>


## **Reference**

- **[JavaScript Roadmap](https://roadmap.sh/javascript)  (@roadmap.sh)**
- **[Modules in JavaScript – CommonJS and ESmodules Explained](https://www.freecodecamp.org/news/modules-in-javascript/#usingmodules)  (@freeCodeCamp)**
- **[Modules, introduction](https://javascript.info/modules-intro)  (@JAVASCRIPT.INFO)**
- **[Export and Import](https://javascript.info/import-export)  (@JAVASCRIPT.INFO)**

