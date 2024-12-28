---
title: "暫停一下再出發！全面解析 JavaScript Generator 實用技巧"
sidebar_label: "Generator"
description: "這篇文章將帶你從基礎概念到進階應用，深入理解 JavaScript Generator 如何實現「暫停與恢復」的程式控制模式。除了探討 yield、yield*、與 return 的核心機制，也透過實際案例示範如何把同步或非同步流程寫得更優雅、更易維護。"
last_update:
  date: 2024-12-28
keywords: [JavaScript, Generator, AsyncGenerator, yield, yield*, return, Iterator]
tags: [Javascript]
---

## **什麼是 Generator？**

### **Generator 的基本概念**

在現實生活中，很多情境需要我們「做一點事、暫停一下、再繼續做下一點事」，例如：

- **填問卷**：先回答前幾題，暫時休息，等想到答案後再繼續填。
- **做菜**：準備食材、放進鍋裡煮，等熟了之後再進行下一個步驟。

在程式世界裡，如果我們希望「做一點事、暫停一下、再繼續做下一點事」就需要依賴 **Generator。Generator** 就像幫我們建立了一個「可隨時暫停和繼續」的函式。透過在函式宣告前面加上 `*`（例如 `function* myGenerator()`）並在需要暫停的地方使用 `yield` 關鍵字，我們就可以一步步地控制這個函式的執行。

:::tip `function*` 與 `yield`

- **`function*`**：這個宣告方式代表「這是一個生成器函式」，與普通的 `function` 最大差別在於，它能透過 `yield` 進行暫停與繼續。
- **`yield`**：可以想像成「把工作階段暫停，先把目前結果交出去，等之後再被叫起來繼續做」。程式每次跑到 `yield` 就會停住，直到有人呼叫 `next()` 才再往下繼續。
:::

以下我們先舉一個簡單的「計數器生成器」範例，帶大家感受一下 Generator 的神奇之處：

```jsx
function* counter() {
  let count = 0;
  while (true) {
    yield count;     // 暫停並返回當前 count
    count++;
  }
}

const c = counter();
console.log(c.next()); // { value: 0, done: false }
console.log(c.next()); // { value: 1, done: false }
console.log(c.next()); // { value: 2, done: false }
```

以上的程式中，每次呼叫 `c.next()`，就像對計數器說：「往下跑一步，並告訴我現在的數字」。

### **為什麼需要 Generator？**

我們已經知道 Generator 可以在函式執行過程中隨時暫停、繼續，那這對我們到底有什麼幫助呢？以下舉幾個常見的使用場景：

1. **循序執行（順序產生資料）**    
    假設你在寫一支程式，需要依序產生一大串數字或資料，就像流水線一樣，每做一個就回傳一次給外面使用者。這時候，Generator 可以很直覺地實現「一個一個丟出來」的功能，而不需要一次把所有資料都生成完才回傳。
    
2. **延遲計算（按需計算資料）**    
    在面對龐大的資料或複雜的運算時，有時候我們不想一次算到完，因為那樣可能會非常耗時或耗記憶體。透過 Generator，我們可以在需要用到結果的時候，才去計算下一步。
    
    > *以餐廳廚房出餐作為比喻*：通常一般的餐廳不會一次煮好一桌菜才出餐，而是先做好前菜就立即出餐，等待客人吃完再出下一道菜，減少廚房忙亂，也可節省資源。
    > 
3. **提高程式碼可讀性**    
    在某些需要階段性處理的流程中，如果不用 Generator，可能會寫得一團亂，或需要很多旗標變數來控制執行時機。Generator 讓我們可以在邏輯上更容易地一段一段看，每次 `yield` 都代表一個「休息切點」，這樣程式結構會變得較清晰。


<br/>


## **Generator 的運作原理**

### **迭代器與生成器的關係**

在探討 Generator 的運作前，我們先簡單認識一下「迭代器（Iterator）」的概念。

- **迭代器**：一個符合 [**Iteration protocols**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) 的物件，能夠逐一取出內部的資料，每次往前「走一步」，給你下一個資料，直到資料走完為止。
- 在 JavaScript 裡，迭代器會實作一個 `next()` 方法，每次呼叫都回傳一個 `{ value, done }` 物件。`value` 表示當前的資料，`done` 表示是否已到末端。

以下我們來用個簡單的範例示範如何「手動」實作一個簡單的迭代器，用來取得陣列中每個元素：

```jsx
function createIterator(array) {
  let index = 0;
  return {
	  [Symbol.iterator]() {
	    return this;
	  },
    next() {
      if (index < array.length) {
        return { value: array[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    }
  };
}

const myIterator = createIterator([1, 2, 3]);

console.log(myIterator.next()); // { value: 1, done: false }
console.log(myIterator.next()); // { value: 2, done: false }
console.log(myIterator.next()); // { value: 3, done: false }
console.log(myIterator.next()); // { value: undefined, done: true }
```

*看上去跟前一章節 Generator 範例中的使用方法完全一樣對吧？* 這是因為 Generator 函數返回的Generator Object ，其本質上就是一個迭代器物件。

Generator 幫我們自動實作了上述「迭代器介面」的繁瑣部分。只要我們用 `function*` 宣告函式，裡面寫上 `yield`，就能生成一個物件，內建了 `next()` 方法，無須手動管理索引或結束時機。每次呼叫 Generator 物件的 `next()`，回傳的結構也與一般迭代器相同： `{ value, done }`。


```jsx
function* myGenerator() {
  yield 'Hello';
  yield 'World';
}

const genObj = myGenerator();

console.log(genObj.next()); // { value: 'Hello', done: false }
console.log(genObj.next()); // { value: 'World', done: false }
console.log(genObj.next()); // { value: undefined, done: true }

```

可以看到，`genObj` 自帶 `next()` 方法，每次執行都回傳 `{ value, done }`，說明這個物件同時是「可迭代」的。

:::note
如果想更深入了解迭代器（Iterator）的規範與用法，建議可參考 [MDN: Iterator](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterators) 進行進一步閱讀。
:::


### **`yield` 與 `return`**

在 Generator 裏面，最常見也最重要的兩個關鍵字莫過於 `yield` 與 `return`。它們雖然都能「輸出」值，但實際上有著不同的意義與行為。

**`yield` 的功能與特性：單向與雙向通信**

- *單向*：你可以在 `yield` 後面寫一個值，例如 `yield "Hello"`，呼叫 `next()` 時，這個值會被「拋出」給外部。
- *雙向*：如果外部在 `next()` 裏面傳入參數，例如 `genObj.next("some data")`，那麼該次執行的 `yield` 也能「接收」到這個參數。
- 範例程式（展示雙向通信）：
    
    ```jsx
    function* twoWayGenerator() {
      const firstData = yield 'Send me something';
      console.log('I received:', firstData);
    
      const secondData = yield 'One more time?';
      console.log('I received:', secondData);
    }
    
    const gen = twoWayGenerator();
    
    console.log(gen.next());          // { value: 'Send me something', done: false }
    console.log(gen.next('Hi there')); // 在這裡傳入參數
      // 主控台輸出: I received: Hi there
      // => { value: 'One more time?', done: false }
    console.log(gen.next('Yes!'));
      // 主控台輸出: I received: Yes!
      // => { value: undefined, done: true }
    ```
    

---

**`return` 在 Generator 中的作用**

1. **生成器結束時的返回值**
    - 一旦 `return someValue` 出現，整個 Generator 就直接結束，並透過 `{ value: someValue, done: true }` 回傳。
    - 此後再呼叫 `next()`，`done` 都會維持 `true`，不會再有新的 `value`。
2. **`return` 與 `yield` 的差異**
    - `yield`：暫停函式執行，但有機會再被「叫醒」繼續跑。
    - `return`：一次性結束函式，相當於「收工」。
    - 結束時也會回傳一個 `{ value, done: true }` 物件，但從此之後就不再有任何新輸出了。
3. **範例：比較 `yield` 與 `return`**
    
    ```jsx
    function* checkYieldAndReturn() {
      yield 'First yield value';   // 先暫停一次
      yield 'Second yield value';  // 再暫停一次
      return 'Final return value'; // 結束並回傳
      // 下面任何程式碼都不會再被執行到
      yield 'This will never show';
    }
    
    const gen = checkYieldAndReturn();
    
    console.log(gen.next()); // { value: 'First yield value', done: false }
    console.log(gen.next()); // { value: 'Second yield value', done: false }
    console.log(gen.next()); // { value: 'Final return value', done: true }
    // 之後再怎麼呼叫，都不會再有新的結果
    console.log(gen.next()); // { value: undefined, done: true }
    ```
    
    可以看到，當遇到 `return 'Final return value'` 時，就一次性結束了生成器。
    

:::tip 提醒：

- 如果想繼續吐出更多值，就不要使用 `return`；
- 如果只想在某個狀況下結束整個生成器，就可使用 `return` 來做「中斷且回傳」的動作。
:::


<br/>


## **Generator 的進階應用與技巧**

### **`yield*`**

在 Generator 內除了可以使用 `yield` 把工作階段暫停，先把目前結果交出去，還有一個相當實用的關鍵字：**`yield*`**。它常被用來將「產值」委派給另外一個生成器（或任何可迭代物件），就像是呼叫「副司機」來幫忙開車一段，或是把工作轉給另一個人來完成。

**1. 什麼是 `yield*`？**

- **用於委派給其他生成器或可迭代對象：**    
    當我們有兩個生成器，A 與 B，如果想要在 A 的某個階段，直接把控制權交給 B，讓 B 幫我們一口氣產出多個值，就能使用 `yield* B`。
    
- **示例：遞迴結構（如樹狀結構的展開）：**    
    當你的資料結構是一顆樹，或是巢狀很深的結構，你想把所有值「攤平」來遍歷，就可以在程式裡碰到「子節點」時，使用 `yield*` 把子節點展開。

    舉一個最簡單的例子：
    
    ```jsx
    function* subGenerator() {
      yield 'A';
      yield 'B';
    }
    
    function* mainGenerator() {
      yield 'Start';
      yield* subGenerator(); // 把控制權交給 subGenerator
      yield 'End';
    }
    
    for (const value of mainGenerator()) {
      console.log(value);
    }
    // 輸出:
    // Start
    // A
    // B
    // End
    ```
    
    在 `mainGenerator` 中，我們使用 `yield* subGenerator()`，等於把執行流程委派給 `subGenerator`。當 `subGenerator` 結束後，又會繼續回到 `mainGenerator` 往下執行。這樣就能讓程式結構更有彈性，不用手動在 mainGenerator 裡一個個 `yield 'A'`、`yield 'B'`。
    

**2. `yield*` 的應用場景**

1. **嵌套生成器的簡化操作**
    - 如果沒有 `yield*`，我們可能要在一個生成器裡頭手動呼叫另一個生成器的 `next()`，把值撈出來再 `yield` 出去，程式碼寫起來相對瑣碎。
    - `yield*` 幫你自動完成「一個個撈出來再吐出去」的動作。
2. **合併多個生成器**
    - 當你有多個生成器，例如 `gen1`, `gen2`, `gen3`，都要在同一支程式裡執行時，可以用 `yield* gen1()`, `yield* gen2()`, `yield* gen3()` 一條龍串起來，省去重複撰寫的麻煩。
    - 例如，你希望能在一個迭代流程中把「標題列表」「內容列表」「註腳列表」都從不同生成器裡串接到一起，可以用 `yield*` 依序把它們串回主生成器中。

### **傳遞參數與錯誤處理**

前面我們談到，Generator 能透過 `next()` 將外部的參數「丟」到生成器裡，這讓 Generator 不只是一味產出資料，也能收資料。當我們更進一步想處理「錯誤」時，還可以用 `throw` 在 Generator 裡做相應的錯誤捕捉。

1. **在 `yield` 語句中傳遞參數**
    - 呼叫 `next(someValue)` 時，`yield` 語句就能接收到這個 `someValue`。
    - 範例：
        
        ```jsx
        function* twoWayGenerator() {
          const firstInput = yield 'First output';
          console.log('我收到了：', firstInput);
        
          const secondInput = yield 'Second output';
          console.log('又收到了：', secondInput);
        }
        
        const gen = twoWayGenerator();
        console.log(gen.next());         // { value: 'First output', done: false }
        console.log(gen.next('Hello'));  // "我收到了： Hello"
                                         // { value: 'Second output', done: false }
        console.log(gen.next('World'));  // "又收到了： World"
                                         // { value: undefined, done: true }
        ```
        
        我把以上範例繪製成時序圖，方便大家觀察 console.log 的先後順序：
        
        ```mermaid
        sequenceDiagram
            participant Main as Main Program
            participant Generator as Generator Function (twoWayGenerator)
            
            Main->>Generator: Create twoWayGenerator() (const gen = twoWayGenerator())
            activate Generator
            Generator-->>Main: Generator object created
            
            Main->>Generator: gen.next()
            activate Generator
            Generator-->>Main: Log: { value: 'First output', done: false }
            deactivate Generator
        
            Main->>Generator: gen.next('Hello')
            activate Generator
            Generator->>Generator: Log in Generator '我收到了： Hello'
            Generator-->>Main: Log: { value: 'Second output', done: false }
            deactivate Generator
        
            Main->>Generator: gen.next('World')
            activate Generator
            Generator->>Generator: Log in Generator '又收到了： World'
            Generator-->>Main: Log: { value: undefined, done: true }
            deactivate Generator
        
        ```
        
    - 透過這種機制，可以實現更靈活的互動，像是「請求 - 回應」的*雙向交流*。
2. **在 Generator 中使用 `throw` 處理錯誤**
    - Generator 物件也可以在外部呼叫 `gen.throw(new Error("錯誤內容"))`，直接把錯誤丟到生成器函式裡。
    - 在生成器內，可以用 `try...catch` 來攔截這個錯誤。如以下範例：
        
        ```jsx
        function* errorHandlerGen() {
          try {
            yield 'Start';
          } catch (err) {
            console.log('捕捉到錯誤：', err.message);
          }
          yield 'End';
        }
        
        const g = errorHandlerGen();
        console.log(g.next());               // { value: 'Start', done: false }
        console.log(g.throw(new Error('Oops')));
          // "捕捉到錯誤： Oops"
          // => { value: 'End', done: false }
        console.log(g.next());               // { value: undefined, done: true }
        ```
        
        同樣地，我把以上範例繪製成時序圖方便大家觀察 error 被印出來順序
        
        ```mermaid
        sequenceDiagram
            participant Main as Main Program
            participant Generator as Generator Function (errorHandlerGen)
            
            Main->>Generator: Create errorHandlerGen() (const g = errorHandlerGen())
            activate Generator
            Generator-->>Main: Generator object created
            
            Main->>Generator: g.next()
            activate Generator
            Generator-->>Main: Log: { value: 'Start', done: false }
            deactivate Generator
        
            Main->>Generator: g.throw(new Error('Oops'))
            activate Generator
            Generator->>Generator: Catch error "Oops"
            Generator->>Generator: Log in Generator: '捕捉到錯誤： Oops'
            Generator-->>Main: Log: { value: 'End', done: false }
            deactivate Generator
        
            Main->>Generator: g.next()
            activate Generator
            Generator-->>Main: Log: { value: undefined, done: true }
            deactivate Generator
        ```
        
    - 一旦在外部 `throw()`，就會把錯誤「注入」到生成器中當前的位置，若沒有 `try...catch`，就會結束該生成器；有的話就能在 `catch` 中妥善處理，並繼續往下執行後續的程式。

### **`AsyncGenerator`**

在繼續深入「控制流程」與「非同步操作」前，我們先來了解一下 **AsyncGenerator**。

這個特性是在 ECMAScript 2018（ES9）中正式引入的語法，讓我們能夠在生成器函式中直接使用 `await`，並搭配 `for await...of` 來處理非同步資料流。

以下是一個最簡單的 AsyncGenerator 範例：

```tsx
// 一個簡單的 asyncGenerator，會等 1 秒後回傳一個數字
async function* asyncGen() {
  let i = 0;
  while (i < 3) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬非同步工作
    yield i++;
  }
}

// for await...of 語法用法
(async function() {
  for await (const num of asyncGen()) {
    console.log(num);
  }
  console.log("All done!");
})();
```

- **`async function*`:** 表示這是一個「非同步的生成器函式」，允許在函式內使用 `await`。
- **`for await...of`:** 能自動消化「非同步的迭代結果」，每等到一次 `yield` 時，程式就會得到一個值並繼續往下執行。
- **執行時機：** 透過 `await` 可以在生成器裡直接等待 Promise 完成，讓程式看起來像「同步」邏輯一般，但實際上是非同步運行。

### **一般（同步）Generator 的非同步控制流程**

在這裡，我們會示範如何利用 **一般（同步）Generator** 來控管**非同步流程**。你或許會好奇：「剛剛不是介紹了 AsyncGenerator？為什麼還要用同步的？」

實際上，在以前還沒有 `async/await` 的年代，JavaScript 要處理多個非同步流程時，常常要「回呼函式（callback）層層疊」，導致程式碼很難讀。如果你還沒想用 `async/await`，又想把結構寫得漂亮一些，可以考慮透過 Generator 來做「步驟式」的流程控制。

以下是一個示意範例，展示如何將原本多重的回呼換成 Generator：

**原本的回呼型式（callback hell）**

```jsx
function doStep1(data, callback) {
  setTimeout(() => {
    callback(null, data + ' Step1 done.');
  }, 1000);
}

function doStep2(data, callback) {
  setTimeout(() => {
    callback(null, data + ' Step2 done.');
  }, 1000);
}

// 想要依序執行 doStep1 -> doStep2 -> ...
doStep1('Start...', (err, result1) => {
  if (err) throw err;
  console.log(result1);
  doStep2(result1, (err, result2) => {
    if (err) throw err;
    console.log(result2);
    // 繼續下去...
  });
});
```

---

**利用 Generator 管控流程**

結合 Promise（或類似的封裝函式），我們可以將同樣的邏輯以「同步程式」的寫法串起來：

```jsx
 function doStep1(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + ' Step1 done.');
    }, 1000);
  });
}

function doStep2(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + ' Step2 done.');
    }, 1000);
  });
}

function* flowController() {
  let result1 = yield doStep1('Start...');
  console.log(result1);

  let result2 = yield doStep2(result1);
  console.log(result2);

  // 繼續下去...
}

// 然後我們需要一個runner，幫忙自動執行yield回傳的Promise
function run(genFunc) {
  const gen = genFunc();

  function nextStep(input) {
    let { value, done } = gen.next(input);
    if (done) return;
    if (value instanceof Promise) {
      value.then(res => {
        nextStep(res);
      }).catch(err => {
        gen.throw(err);
      });
    }
  }

  nextStep();
}

run(flowController);
```

雖然這段程式碼後來在 `async/await` 出現後就被更簡化了，但它示範了 Generator 如何把「多層回呼」變成「逐步流程」，大幅提高可讀性，避免了「回呼地獄」。

### **淺談與一般（同步）Generator 與 AsyncGenerator 實作非同步流程的差異**

在前面的範例程式碼中，我們用了一個**一般 Generator**（`function* ...`）來搭配 Promise。或許你會納悶：「**遇到非同步，不是應該要用 `async function*`（AsyncGenerator）嗎？**」

其實並不一定。由於我們已經習慣了使用 `async/await` 來寫 JS 的非同步邏輯，所以看到 `Promise` 竟然沒有搭配 `async/await` 一起服用，不免會覺得不太習慣。但實際上，這種「**一般 Generator + Promise + 協助函式**」的模式，在 `async/await` 還沒正式登場前非常流行，因為這種寫法可以把層層的 callback function 寫得更像同步程式流程，閱讀起來更價值觀。

讓我們先來探討「**為什麼使用一般（同步）Generator 也能處理非同步流程？**」這個議題吧。

這麼做之所以可行，原因有幾點：

- **Generator 本身僅「產出」資料，不限定它是同步還是非同步**
    - 一般（同步）Generator 做的事情是：「我可以 `yield` 出一個值，並在外部呼叫 `next()` 後，再繼續執行到下一個 `yield`。」
    - 至於 `yield` 出來的是「即時可用的值」還是「Promise（未來才會解開的值）」，Generator 並不干涉。
    - 也就是說，Generator 不管「value 是同步或非同步」，它只負責「吐出 value」，然後在下一次 `next()` 被呼叫前暫停。
- **外部協助函式（如範例中的 `run`）幫忙處理 Promise**
    - 當 Generator `yield` 出一個 Promise 時，外部程式就會接手這個 Promise：
        1. 等 Promise 結果 `resolve` 後，把結果再「塞回」 Generator（呼叫 `next(結果)`），讓生成器繼續運行。
        2. 如果 Promise 失敗 `reject`，則呼叫 `gen.throw(錯誤)`，讓生成器能在內部用 `try...catch` 處理。
    - 這樣一來，我們就能達到「每次等非同步完成後，才往下繼續執行生成器」的效果，看起來就像同步程式碼一步步往下跑。

`AsyncGenerator` 跟前者的差異在於可以直接 `await`，也可以 `for await...of`，不需要額外搭配像上面範例中 run 這樣的「協助函式」，更好閱讀與理解。不過 `AsyncGenerator` 屬於較新的語法，需要 ES2018+ 或 Babel/TypeScript 編譯。若你的執行環境夠新，建議直接用它；反之，使用「一般 Generator + Promise + 協助函式」 依然可行。

### **非同步操作的範例**

在前面的內容，我們分別介紹了 **`AsyncGenerator`** 與「一般（同步）Generator + Promise + 協助函式」兩種在 JavaScript 中處理非同步的方式。接著，我們以「抓取多個 API 資料、並將結果依序處理」這個常見情境，示範如何使用這兩種方式，讓大家可以更清楚看到它們之間的異同。

> 情境描述：  
> 想像我們有三個資料來源 `API1`, `API2`, `API3`，都需要分別向伺服器發出請求，再將回傳結果做簡單的處理，最後輸出到主控台。由於這三個 API 彼此之間有邏輯順序，必須等前一步資料取得後再進行下一步。
> 

**1. 使用一般（同步）Generator + Promise + 協助函式**

先回到「舊時代」的寫法：我們用 **一般（同步）Generator** 來「逐步產出」Promise，並在外部寫個簡單的 `runner`（協助函式）來自動串起非同步流程。

**1.1 建立模擬 API 請求函式**

```jsx
function mockRequest(apiName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 假裝1秒後從伺服器拿到資料
      if (Math.random() < 0.9) {
        // 90% 機率成功
        resolve(`Fetched data from ${apiName}`);
      } else {
        // 10% 機率失敗
        reject(new Error(`Failed to fetch ${apiName}`));
      }
    }, 1000);
  });
}
```

這個函式簡單模擬了一個「網路請求」，其中有成功與失敗的機率，以便我們可以測試「成功與錯誤處理」。

**1.2 實作 Generator 函式**

```jsx
function* fetchDataFlow() {
  try {
    const data1 = yield mockRequest('API1');
    console.log(data1);

    const data2 = yield mockRequest('API2');
    console.log(data2);

    const data3 = yield mockRequest('API3');
    console.log(data3);

    console.log("All data fetched successfully!");
    return "Done!";
  } catch (error) {
    console.error("Something went wrong:", error.message);
  }
}
```

- 每個 `yield` 都會吐出一個 **Promise**（由 `mockRequest` 建立），讓外部去處理。
- 如果其中任何一個步驟出錯（`reject`），就會被 `try...catch` 捕捉到，我們可以在這邊做錯誤處理或補救措施。

**1.3 撰寫 `runner`（協助函式）**

```jsx
function run(genFunc) {
  const gen = genFunc();

  function handleNextStep(input) {
    const { value, done } = gen.next(input);
    if (done) return; // 若已經結束（done: true），就停止

    // 如果 yield 出來的是 Promise，就等它完成再前進
    if (value instanceof Promise) {
      value
        .then(res => handleNextStep(res))
        .catch(err => gen.throw(err));
    }
  }

  handleNextStep(); // 從最開始執行
}
```

- 只要從 `gen.next()` 得到的 `value` 是個 Promise，我們就 `then()` 等它完成，完成後的結果再丟回 `gen.next(...)`；
- 如果 Promise 出現錯誤（`reject`），我們則呼叫 `gen.throw(err)`，把錯誤拋回 Generator 內部的 `try...catch` 做捕捉。

**1.4 執行流程**

```jsx
run(fetchDataFlow);
```

執行時，程式會依序呼叫 `API1`、`API2`、`API3`，每個成功後才前進到下一個 `yield`。若任何一步失敗，就會被 `catch` 到，並在主控台印出錯誤資訊。

> **優點：**
> 
> - 寫起來比傳統的 callback 版本容易閱讀，也能「一行一行」掌控非同步流程。
> 
> **缺點**：
> 
> - 需要額外寫一個 `runner` 函式來幫忙處理 Promise；
> - 與現代的 `async/await` 相比稍顯繁瑣。

---

**2. 使用 `AsyncGenerator`**

接下來，看看「**比較新的做法**」：直接利用 **AsyncGenerator** 和 `for await...of` 來寫出非同步流程。這是 ES2018（ES9）之後引入的語法，如果你的執行環境支援，會更直覺。

**2.1 建立模擬 API 請求函式**

這個可以跟上面一樣，我們沿用相同的 `mockRequest`：

```jsx
function mockRequest(apiName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve(`Fetched data from ${apiName}`);
      } else {
        reject(new Error(`Failed to fetch ${apiName}`));
      }
    }, 1000);
  });
}
```

**2.2 實作 AsyncGenerator**

```jsx
async function* asyncFetchDataFlow() {
  // 用陣列儲存要呼叫的 API 名稱
  const apis = ["API1", "API2", "API3"];

  for (const apiName of apis) {
    // 在生成器函式中使用 await 非同步
    const result = await mockRequest(apiName);
    yield result; // 產出每一步獲得的資料
  }
}
```

這樣做下來，就把「非同步請求」的邏輯寫得很像「同步」，不需要再手動管理 `next()` 或 `throw()`。

**2.3 使用 `for await...of` 執行**

```jsx
(async function() {
  try {
    for await (const data of asyncFetchDataFlow()) {
      console.log(data);
    }
    console.log("All data fetched successfully! (AsyncGenerator)");
  } catch (err) {
    console.error("Something went wrong:", err.message);
  }
})();
```

- `for await...of` 能幫我們自動「等每次 `yield` 出來的 Promise 結果」，每次等到後再進迴圈下一輪；
- 如果任何一次 `await` 出現 `reject`，就直接被 `try...catch` 捕捉到，結束整個流程；
- 不再需要像「同步 Generator + runner」那樣手動推動流程。

> **優點：**
> - 語法相對「現代」，且可直接 `await`，不需要額外的協助函式；
> - 可讀性更高，結構更簡單，錯誤處理更直覺。
> 
> **缺點(就現在這個時間點來說不算缺點)**：
> - 需要編譯/執行環境支援 ES2018（或使用 Babel/TypeScript 進行轉譯）。


<br/>


## **實戰案例**

### **案例一：自定義的數據生成器**

我們先從一個比較輕量級的範例開始，示範如何利用 **「同步」** Generator 來自訂一個「數據生成器」。常見的例子就是 **Fibonacci 數列**：

> **Fibonacci 數列的回顧**
>
> - 數列前兩項為 0、1（有些定義以 1、1 開頭，也可視需求調整）。
> - 從第三項開始，每項都是前兩項的和：
>     
>    $$
>    F(0)=0, F(1)=1, F(n)=F(n−1)+F(n−2) (n \ge 2)
>    $$


    

範例：

```jsx
function* fibonacciGenLimit(n = 10) {
  let [prev, curr] = [0, 1];
  for (let i = 0; i < n; i++) {
    yield prev;
    [prev, curr] = [curr, prev + curr];
  }
}

// 只產生前 6 項
for (const num of fibonacciGenLimit(6)) {
  console.log(num);
}
// 輸出: 0, 1, 1, 2, 3, 5
```

> Generator 尤其適合**「一次一次產出值」**的場合，不管是數學數列或任何分段運算，只要把計算邏輯封裝在 yield 前後，就能實現「延遲計算、按需取得」的效果。
這種**「依需生成」**資料的方式，不用一次在記憶體裡存好所有值，對於可能很長的序列（例如大數量 Fibonacci、或其他複雜運算）相當方便。
> 

### **案例二：模擬分段下載（以 AsyncGenerator 示範）**

為了讓大家看到 **AsyncGenerator** 在實務情境中的強大與簡潔，我們用「模擬分段下載」這個常見場景，示範如何寫出分段傳輸與處理的邏輯。這能有效 **減少一次性下載的資源負擔**，也能帶來更好的使用者體驗（如顯示進度條、支援暫停／繼續下載等）。

**1. 模擬大型檔案的下載**

首先，用一個簡單的函式來「模擬」大檔案的下載過程，假設每次可以下載一部分（chunk）：

```jsx
function mockFileDownloader(fileSize, chunkSize = 1024) {
  let downloaded = 0;
  return async function downloadChunk() {
    // 每次呼叫 downloadChunk，就模擬下載一個 chunk
    return new Promise((resolve) => {
      setTimeout(() => {
        if (downloaded < fileSize) {
          const remaining = fileSize - downloaded;
          const currentChunk = Math.min(chunkSize, remaining);
          downloaded += currentChunk;
          resolve({
            chunkSize: currentChunk,
            downloaded,
            fileSize
          });
        } else {
          // 檔案已全部下載完畢
          resolve(null);
        }
      }, 200);
    });
  };
}
```

- `fileSize`：總檔案大小，單位隨意，可視為 KB 或 Byte。
- `chunkSize`：每次模擬下載的大小。
- 每次呼叫 `downloadChunk()` 會回傳一個 `Promise`，等 200ms 後（模擬下載時間），吐出下載的資訊。若全部下載完，傳回 `null`。

**2. 使用 AsyncGenerator 進行分段下載**

接著，我們來設計一個 **AsyncGenerator**，把「逐段下載」的執行邏輯封裝在裡面：

```jsx
async function* fileDownloadFlowAsync(fileSize, chunkSize = 1024) {
  const downloader = mockFileDownloader(fileSize, chunkSize);

  while (true) {
    const chunkInfo = await downloader();
    // await等待這次下載完成 (downloadChunk的結果)

    if (!chunkInfo) {
      // 如果為 null，代表檔案已下載完畢
      return "Download complete!";
    }

    // 這裡可以進行中間處理或打印進度
    yield chunkInfo;
  }
}
```

- 在 `while (true)` 迴圈裡，我們直接用 `await` 等待每次下載的 `Promise`。
- 如果下載完成（`chunkInfo === null`），就透過 `return` 結束整個 AsyncGenerator。
- 否則，每次下載完就 `yield chunkInfo`，讓外部（呼叫方）可以拿到每段下載的資料。

**3. 執行並顯示下載進度**

接著，我們就能利用 **`for await...of`** 來迭代整個下載流程。每一次迴圈都代表完成一塊資料的下載。

```jsx
(async function() {
  const fileSize = 5000; // 總共 5000KB
  const chunkSize = 1024; // 每次下載 1024KB
  const downloader = fileDownloadFlowAsync(fileSize, chunkSize);

  try {
    for await (const chunkInfo of downloader) {
      console.log(
        `Downloaded ${chunkInfo.downloaded}/${chunkInfo.fileSize} (chunk size: ${chunkInfo.chunkSize})`
      );
    }
    // 當 AsyncGenerator return "Download complete!" 時，迴圈會結束
    console.log("All done! (AsyncGenerator)");
  } catch (error) {
    console.error("Download failed:", error.message);
  }
})();
```

- **`for await...of`**：能幫我們一次次地「等到」AsyncGenerator `yield` 出的值（`chunkInfo`），每拿到一塊就印出進度。
- 如果下載失敗，可在 `mockFileDownloader` 裡面改成 `reject(new Error(...))`，就能在這裡的 `catch` 進行錯誤處理。

**4. 實務上的應用與延伸**

- **檔案分段處理**：不只是下載，也可用於上傳或串流播放。
- **監控進度**：每次 `yield` 出來時，就可以更新進度或顯示在 UI 上。
- **中途暫停/續傳**：若要暫停，停止取用生成器的下一步即可；若要重新繼續，可視情況再設計機制，或重新呼叫生成器、記錄中斷點等。
- **多任務併發控制**：可以延伸搭配「多個 AsyncGenerator 一起執行」，或在外部使用 `Promise.all` 等，依需求彈性混合設計。

> **使用 AsyncGenerator 的好處：**
> 
> - **免寫協助函式**：不需要像「同步 Generator + runner」那樣另外撰寫控制程式。
> - **程式結構直覺**：整個下載流程宛如同步，每段結束再往下跑，一看就懂。
> - **錯誤處理易懂**：可以直接用 `try...catch` 包住 `for await...of`，省去手動接續錯誤的麻煩。


<br/>


## **常見問題與最佳實踐**

### **常見問題**

1. Generator 內部執行完畢後再呼叫 `next()` 會發生什麼事？
    - 當生成器執行到 `return`，或是整個函式正常跑完，再度呼叫 `next()` 時會得到 `{ value: undefined, done: true }`，表示該生成器已經「收工」。
    - 一旦進入 `done: true` 狀態，之後再怎麼呼叫 `next()` 都只會得到 `{ value: undefined, done: true }`。
2. 什麼時候該用 `yield*` ？
    - **程式碼的可讀性與結構**
        - 如果你有一個生成器 B，需要產出一大堆值，而主生成器 A 只是「搬運工」，要一個一個地把 B 產出的值再 `yield` 出去，手動寫起來不但繁瑣，也增加維護成本。
        - `yield*` 能自動幫你「把 B 全部的值」接力回傳給 A，使程式碼更簡潔。
    - **遞迴或樹狀結構**
        - 當我們處理類似樹狀或巢狀結構，經常需要在「遍歷一個節點時，同時處理它的子節點」。
        - 這時用 `yield*` 可以自然地遞迴子節點生成器，不必手動迭代它的每個 `next()`。
3. 何時選擇 Generator，而不是其他解決方案（如 `async/await`）
    - **需要分段執行、可中途暫停的流程**
        - Generator 的特點在於「可以執行到一半，等狀況允許時再繼續」，這在特定情境（如音訊串流處理、動態資料生成）很實用。
        - 如果只是單純的「非同步處理」，而且你的環境支援度夠，`async/await` 反而更直覺。
    - **建立可迭代的資料生產線**
        - 當你想產生一連串數值或物件（可能是無限或超大筆資料）並依序供外部取用，Generator 在語義上非常明確。
        - 例如一個大型清單，你不想一次計算所有資料後再回傳，而是需要「一筆筆慢慢來」，這時候 Generator 會更貼切。

### **最佳實踐**

1. **Generator 的命名與使用習慣**
    - 若生成器是產生「序列」相關資料，可在函式名稱上加點敘述性字眼，比如 `function* fibonacciGenerator()`、`function* userDataStream()`。
    - 若是 AsyncGenerator，則通常會在函式名稱前加上 `async`，如 `async function* asyncFibonacciGenerator()`，提示後端程式或其他開發者「這是個非同步生成器」。
    - 依照程式碼風格的慣例，有些人喜歡 `function *myGen()`、有些人喜歡 `function* myGen()`, 看團隊一致性即可。
2. **搭配 `for...of` 與解構賦值**
    - 只要你的生成器實作了預設的可迭代介面（也就是所有使用 `function*` 建立的生成器都自帶），就能直接用 `for...of` 迭代它。這個寫法在處理「一批資料」時特別自然，就像遍歷陣列一樣。：
        
        ```jsx
        for (const val of myGenerator()) {
          console.log(val);
        }
        ```
        
    - 假設你在生成器裡 `yield` 出一個物件 `{ a, b }`，你可以在迭代時搭配解構語法。可以讓程式碼更易讀：
        
        ```jsx
        for (const { a, b } of myObjectGenerator()) {
          console.log(a, b);
        }
        ```
        
3. **避免濫用的情境**
    - **只是一般的資料傳遞？**
        - 如果你只是想從函式回傳一個陣列，或一次性回傳固定資料，沒必要使用 Generator。
        - Generator 的用意是「一次一次產生、或能手動控制流程」，不適合拿來做一個「單純回傳值」的函式。
    - **單純非同步讀檔／讀 API？**
        - 如果你的需求只是「呼叫 API → 拿資料 → 顯示」，且只有一兩個步驟，那直接用 `async/await` 就能搞定。
        - 使用 Generator 反而會徒增程式碼複雜度。
    - **太多深度巢狀 `yield`**
        - 雖然 Generator 允許我們在函式裡隨意 `yield`，但如果巢狀結構太深或流程非常複雜，難保日後維護時會亂成一團。
        - 若邏輯真的複雜，可考慮用更模組化的方式拆分，或改用狀態機等更明確的流程管理設計。

## **Reference**

- [**MDN - Iterators and generators**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)
- [**MDN - function\***](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [**MDN - Generator**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- [**MDN - yield**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield)
- [**MDN - \*yield**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*)
- [**JavaScript.info - Generators**](https://javascript.info/generators)
- [**JavaScript.info - Async iteration and generators**](https://javascript.info/async-iterators-generators)
- [**JavaScript ES6 Generators 生成器**](https://www.fooish.com/javascript/ES6/generators.html)