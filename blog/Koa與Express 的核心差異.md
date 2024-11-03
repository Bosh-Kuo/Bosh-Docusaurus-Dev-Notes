---
title: "Koa 與 Express 的核心差異"
slug: koa-vs-express
authors: bosh
description: 這篇文章深入探討 Koa 與 Express 這兩個流行的 Node.js 框架之間的核心差異，涵蓋中介層執行機制、錯誤處理方式以及框架設計理念。透過詳細範例和清晰說明，幫助開發者理解它們在實際應用中的不同之處，進而做出更合適的技術選擇。
keywords: [Koa vs Express, Koa 洋蔥模型, Node.js 框架比較, Koa 中介層設計, Express 中介層機制, Koa 中的錯誤處理, Express 中的錯誤處理]
tags: [Node.js, Backend]
date: 2024-11-03
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1730600792/Docusaurus%20Blog/Blog/Koa%20vs%20Express/Koa-vs-express_v8ysw7.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1730600792/Docusaurus%20Blog/Blog/Koa%20vs%20Express/Koa-vs-express_v8ysw7.png)

> **前言:**  
> 最近在公司被分派一個 Koa backend 的功能開發任務，雖然我平時多數時間主要負責前端相關的工作，不過因為學生時期有稍微接觸過一點 Express，它與 Koa 都是 Node.js 知名 web 框架，所以閱讀程式碼時並不會太陌生。這兩者雖然有不少相似之處，但實際使用後發現，它們在設計理念和使用體驗上有很大的不同。

<!-- truncate -->

## **簡介**

Express 是目前 Node.js 最知名且下載量最多的 web 框架。它誕生於 2010 年，是當時第一批專門針對 Node.js 設計的 Web 框架之一。因為它簡單易學又功能強大，再加上豐富的社群資源，短短時間內就成為了開發者們的首選工具。Express 的成功也推動了整個 Node.js 生態系統的成長，甚至可以說是後來許多框架的靈感來源。

而在 2013 年，Express 的開發團隊決定推出一個新的框架，就是 **Koa**。Koa 的特點是簡潔、輕量，它移除了所有內建中介軟體，讓你可以自行選擇所需的模組來打造應用。它的一大賣點是原生支援 `async/await`， 目的是解決一些 Express 在同步與異步操作中的不便。Express 中的中介軟體本質上是基於 **callback** 而不是 **Promise**，其內部的 `next()` 函數是同步執行的，他並不能像在 Koa 中那樣等待下層中介軟體執行完畢後再繼續執行。關於這一點，我們等等就會在下面的說明中看到實際的範例與執行結果。

這篇文章的目標是在整理我的學習心得的同時帶大家深入瞭解 Express 和 Koa 之間的核心差異，希望大家看完之後也會跟我在查閱資料的時候一樣有「哦，原來是這樣！」的感覺。



<br/>

## **框架的內建功能**

### **Express：開箱即用**

如果你使用過 Express，那你一定知道它最大的優點就是「方便」。Express 是一個接近於完整的框架，它內建了不少功能，讓開發者可以快速啟動專案，少去找第三方套件的麻煩。Express 還附帶了許多便捷方法來處理各種需求，例如：

- `express.Router()`：提供靈活的路由管理。
- `express.static()`：方便地設定靜態文件服務。
- `express.set()`：用於應用設定。
- `express.json()` 和 `express.urlencoded()`：內建的 body parser，讓你能輕鬆解析 JSON 和 URL 編碼的請求體。

簡單看個範例：

```jsx title="src/index.ts"
const express = require('express');
const app = express();

app.use(express.json()); // 內建 body parser
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(3000, () => console.log('Express server running on http://localhost:3000'));
```

這段程式碼展示了 Express 如何快速設定一個簡單的 HTTP 伺服器。只需要幾行程式碼，不需要下載額外的第三方套件，就能處理基本的路由和請求解析。

### **Koa：極簡核心**

反觀 **Koa**，它的設計理念是「保持核心極簡」。換句話說，Koa 的核心不包含任何預設的中介層，連基本的路由和 body parser 都需要你自己安裝。這樣的設計讓開發者能夠有極高的自由度，按照自己的需求去組裝應用程式。

Koa 特別適合那些不依賴大量路徑管理的 HTTP 服務，比如 Webhook 或聊天機器人，因為它不會預設任何結構，開發者可以靈活選擇所需的中介軟體來實現功能。

舉個簡單的例子來看看如何在 Koa 中新增路由和 body parser：

```jsx title="src/index.ts"
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser()); // 需要手動引入 body parser

router.get('/', (ctx) => {
  ctx.body = 'Hello from Koa with Router and Body Parser!';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Koa server running on http://localhost:3000'));

```

可以看到，使用 Koa 時需要我們手動安裝 `@koa/router` 和 `koa-bodyparser` 等套件，來補足 Express 內建的功能。這樣的設計讓 Koa 的核心保持簡潔，並給予開發者極大的掌控權。當然，自由也意味著在搭建應用時需要更多的決策和設置，這對於習慣快速啟動專案的人來說，可能需要適應一下。


<br/>


## **Request/Response 處理方式**

### **Express：使用 `req` 和 `res` 物件**

在 Express 中，處理請求和回應的核心是 `req`（Request）和 `res`（Response）物件。這兩個物件由 Express 根據 Node.js 原生的 `http.IncomingMessage` 和 `http.ServerResponse` 包裝而來，並添加了更多方便開發的屬性與方法。

req 提供了各種屬性和方法，用於存取請求相關的數據，例如：

- `req.body`：存取 POST 請求的資料。
- `req.params`：存取路由中的參數。
- `req.query`：存取 URL 中的查詢參數。

res 物件則用來處理回應，包括：

- `res.send()`：發送回應。
- `res.json()`：發送 JSON 格式的回應。
- `res.status()`：設置 HTTP 狀態碼。

以下是一個簡單的 Express 範例，展示如何處理請求和回應：

```jsx title="src/index.ts"
const express = require('express');
const app = express();

app.use(express.json()); // 解析 JSON 請求體

app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.status(200).json({ message: `Hello, ${name}!` });
});

app.listen(3000, () => console.log('Express server is running on http://localhost:3000'));
```

### **Koa：使用 `ctx` 上下文物件**

Koa 的 Request/Response 處理則是基於 `ctx（Context）`物件。ctx 是一個上下文物件，它封裝了 `request` 和 `response`，將這兩者整合在一起，提供了一個乾淨的 API 來操作請求和回應。

這種設計的好處是每次請求都擁有自己的 ctx，開發者可以在同一個物件上存取和修改請求與回應。Koa 將 Node.js 原生的 `req` 和 `res` 包裝進 ctx.request 和 ctx.response 並進一步擴展了功能。

在 Koa 中，你會常用以下方式來處理請求：

- `ctx.request.body`：存取 POST 請求的數據（需搭配 `koa-bodyparser`）。
- `ctx.params`：存取路由參數（需搭配路由模組，如 `@koa/router`）。
- `ctx.query`：存取 URL 查詢參數。

回應部分：

- `ctx.body`：設置回應內容。
- `ctx.status`：設置 HTTP 狀態碼。

以下是一個簡單的 Koa 範例：

```jsx title="src/index.ts"
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser()); // 解析 JSON 請求體

router.get('/greet/:name', (ctx) => {
  const name = ctx.params.name;
  ctx.status = 200;
  ctx.body = { message: `Hello, ${name}!` };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Koa server is running on http://localhost:3000'));
```

除了 ctx.request 和 ctx.response，ctx 還包括許多方便的 helper methods 與屬性，讓開發者更輕鬆處理常見任務。以下是一些實用的例子：

- **`ctx.querystring`**：用來存取原始的查詢字符串。例如，對於 URL http://localhost:3000/greet?name=John&age=30，`ctx.querystring` 會返回 `"name=John&age=30"`。
- **`ctx.throw(status, message)`**：一個用於主動拋出錯誤的輔助方法。這樣可以簡化錯誤處理流程。例如，ctx.throw(400, 'Bad Request') 會立即中斷當前中介軟體，並返回 400 狀態碼和錯誤訊息。
- **`ctx.state`**：這個屬性是一個共享的物件，讓中介軟體之間能夠方便地傳遞數據。開發者可以在不同中介軟體內設置和讀取 ctx.state 來共享資訊。
- **`ctx.is(types)`**：檢查請求的 `Content-Type` 是否匹配指定類型。例如，ctx.is('json', 'text') 可以用來判斷請求是否為 JSON 或純文本格式，對處理不同類型的請求非常有用。


<br/>


## **中介層（Middleware）的執行機制**

在後端開發中，中介層（middleware）的用途就是在請求抵達路由處理器之前或回應送出之前進行一些處理，這些處理可以是日誌記錄、驗證、錯誤處理、解析請求體等等。它的目標是讓應用程式具備可擴充性和模組化的特性，從而提升開發體驗和維護性。中介層在不同框架中有不同的設計模式，但基本概念是：它們都會像一道道「守門員」，依序接收請求、處理，然後傳遞給下一個中介層或路由。這樣的設計使得你可以把應用的處理邏輯分成幾個小步驟，各自負責不同的功能。

Express 與 Koa 的中介層設計最大的不同在於 ：

- **Express** 的中介層是基於 **callback** 設計的，呼叫 `next()` 時是同步進行的。也就是說，當 `next()` 被呼叫後，程式會立即執行接下來的代碼，而不會等待後續的中介層完成。
- **Koa** 則是基於 **Promise**，允許使用 `async/await`。當在 Koa 中使用 `await next()` 時，程式會等待後續中介層完成後，才繼續執行 `next()` 之後的程式碼。這種設計貼近**洋蔥模型**，使得處理非同步邏輯更加直觀和自然

### **洋蔥模型**

在介紹 Koa 和 Express 之前，先來說說一個非常重要的概念——**洋蔥模型**。這是 Koa 中的中介層設計基礎。洋蔥模型的運作方式就像剝洋蔥一樣：當請求進來時，請求會先經過最外層的中介層，然後一路「穿透」到最內層。等到請求處理完成後，回應會從最內層開始，逐層返回到外層。在這個過程中，每個中介軟體都可以對請求進行處理或者將請求傳遞給下一個中介軟體，就像穿出一個洋蔥一樣，下圖就是一個非常經典的例子。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1730601978/Docusaurus%20Blog/Blog/Koa%20vs%20Express/onion_model_avous5.png)

我們可以把中介層的洋蔥模型機制理解為兩個階段：**進入階段**和**返回階段。進入階段**指的是寫在 next() 前面執行的邏輯，在這個階段的執行順序是從最先註冊的中介層執行到最晚註冊的中介層；而**返回階段**指的則是寫在 next() 後執行的邏輯，在這個階段的執行順序則反過來從最晚註冊的中介層執行到最早註冊的中介層。

### **Express：線性、同步執行**

前面我們有提到，在 Express 中，中介層的執行機制是一種**線性、同步**的模式。當請求進入時，中介層會依照註冊的順序一個接一個地執行，並透過 `next()` 函數來將控制權傳遞給下一個中介層。但在遇到需要等待的異步操作時，由於其**同步執行**的特性，會導致 middleware 執行的順序變得很不直觀。

**觀察範例**  
讓我們先來看看下面這段 Express 中介層的範例，來理解這種直線執行的特性：

```tsx title="src/middleware/testMiddleware.ts"
import { Request, Response, NextFunction } from "express";

export const syncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("1. 同步中介層 - Before next");
  next();
  console.log("1. 同步中介層 - After next");
};

export const asyncMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("2. 非同步中介層 - Before next");
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log("2. 非同步中介層 - Before next wait for 1 second");
      resolve();
    }, 1000)
  ); // 模擬非同步事件
  next();
  console.log("2. 非同步中介層 - After next");
};

export const terminateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("3. 終止中介層 - Before termination");
  res.send("Request terminated by middleware");
  // 不執行 next()，這裡會終止請求
};
```

**執行結果**

```
1. 同步中介層 - Before next
2. 非同步中介層 - Before next
1. 同步中介層 - After next
2. 非同步中介層 - Before next wait for 1 second
3. 終止中介層 - Before termination
2. 非同步中介層 - After next
```

相信對 Express 不熟的朋友第一眼看到這個執行結果可能會覺得有點難以理解，咦？為什麼 `1. 同步中介層 - After next` 會跑到 `2. 非同步中介層 - Before next wait for 1 second` 前面執行呢？

為了解釋這個行為，我們需要進一步拆解 Express 中介層的執行邏輯。如同前面所提到，Express 的中介層是基於 **callback** 設計的，當 `next()` 被執行時，控制權會立刻交給下一個中介層，但 `next()` 後的程式碼會立即執行，而不會等待後續中介層完成。

```jsx
((req, res) => {
  console.log("1. 同步中介層 - Before next");
  ((req, res) => {
    console.log("2. 非同步中介層 - Before next");
    // 呼叫非同步邏輯，進入等待
    (async (req, res) => {
      console.log("2. 非同步中介層 - Before next wait for 1 second");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ((req, res) => {
        console.log("3. 終止中介層 - Before termination");
        res.send("Request terminated by middleware");
      })(req, res);
      console.log("2. 非同步中介層 - After next");
    })(req, res);
  console.log("1. 同步中介層 - After next");  // 這行在等待非同步結果前就執行
})(req, res);

```

若看到這邊你還是覺得有點難理解，以下的時序圖可以幫助你理解 middleware 內部運行順序的邏輯

```mermaid
sequenceDiagram
    participant Request
    participant SyncMiddleware
    participant AsyncMiddleware
    participant TerminateMiddleware
    participant Client

    Request->>SyncMiddleware: 執行 "1. 同步中介層 - Before next"
    SyncMiddleware->>AsyncMiddleware: 呼叫 next()
    AsyncMiddleware->>AsyncMiddleware: 執行 "2. 非同步中介層 - Before next"
    AsyncMiddleware-->>SyncMiddleware: 呼叫 next() 後繼續執行
    SyncMiddleware->>SyncMiddleware: 執行 "1. 同步中介層 - After next"
    AsyncMiddleware->>AsyncMiddleware: 等待 1 秒後執行 "2. 非同步中介層 - Before next wait for 1 second"
    AsyncMiddleware->>TerminateMiddleware: 呼叫 next()
    TerminateMiddleware->>Client: 執行 "3. 終止中介層 - Before termination" 並發送回應
    AsyncMiddleware->>AsyncMiddleware: 執行 "2. 非同步中介層 - After next"

```

:::tip
有些文章提到可以把 Express 的 middleware 理解為一個 `FIFO Queue`，但我認為這種說法存在誤區。這是因為，如果中介層中沒有任何非同步操作，實際上的執行順序會更接近於 LIFO（後進先出）的呼叫堆疊（call stack）

然而，當遇到非同步操作時，例如 `setTimeout` 或 `Promise`，這時候就涉及到 JavaScript 的 **event loop** 機制。當一個中介層遇到非同步操作並將控制權轉交後，這個非同步操作會被放入事件隊列中等待執行。只有當事件隊列中的非同步任務完成後，主執行緒才會再次取回控制權，繼續執行 `next()` 後的代碼。

因此，Express 的中介層在處理非同步任務時，實際上並不是簡單的 FIFO 隊列，而更像是由 `Event Loop` 驅動的一種複雜的調度流程。
:::

### **Koa：洋蔥模型**

在了解了 **Express** 的線性、同步中介層執行後，接下來我們來看看 **Koa** 是如何處理中介層的。Koa 採用了所謂的「洋蔥模型」來設計中介層，這種設計讓中介層的執行順序從外到內，再從內到外，確保邏輯的順序執行與控制流的可預測性。

**觀察範例**

以下是一個簡單的 Koa 中介層範例，用於說明其執行順序與洋蔥模型的運作：

```tsx title="src/middleware/testMiddleware.ts"
import { Context, Next } from "koa";

export const syncMiddleware = async (ctx: Context, next: Next) => {
  console.log("1. 同步中介層 - Before next");
  await next();
  console.log("1. 同步中介層 - After next");
};

export const asyncMiddleware = async (ctx: Context, next: Next) => {
  console.log("2. 非同步中介層 - Before next");
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log("2. 非同步中介層 - Before next wait for 1 second");
      resolve();
    }, 1000)
  );
  await next();
  console.log("2. 非同步中介層 - After next");
};

export const terminateMiddleware = async (ctx: Context, next: Next) => {
  console.log("3. 終止中介層 - Before termination");
  ctx.body = "Request terminated by middleware";
  // 不執行 next()，這裡會終止請求
};
```

**執行結果**：

```
1. 同步中介層 - Before next
2. 非同步中介層 - Before next
2. 非同步中介層 - Before next wait for 1 second
3. 終止中介層 - Before termination
2. 非同步中介層 - After next
1. 同步中介層 - After next
```

可以發現，Koa 的 middleware 運行順序相比於 Express 要好預測得多了。因為 Koa 的中介層是基於 **Promise** 設計的，當一個中介層呼叫 `await next()` 時，控制會傳遞到下一個中介層，並等待內層中介層的完成後，才繼續執行 `next()` 後的程式碼。這就產生了從「外到內，內到外」的執行順序。


<br/>


## **中介層（Middleware）執行細節探討**

### **Express：回應與中介層執行的陷阱**

在 Express 中，當中介層遇到 `res.send()` 等方法發送回應時，請求流程就會被終止，不會再繼續執行後面的中介層或程式碼，即使有呼叫 `next()`。如果在發送回應後依然呼叫 `next()`，會拋出錯誤 `Error: Cannot set headers after they are sent to the client`，因為回應頭已經被發送，不允許再次修改。這點需要開發者特別注意，避免在回應之後意外呼叫 `next()`，導致程式拋錯。

**範例**：

```tsx title="src/middleware/testMiddleware.ts"
import { Request, Response, NextFunction } from "express";

export const terminateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("3. 終止中介層 - Before termination");
  res.send("Request terminated by middleware");
  next(); // 將導致錯誤：Cannot set headers after they are sent to the client
};

```

**預期結果**：

```
3. 終止中介層 - Before termination
Express Error: Error: Cannot set headers after they are sent to the client
```

Express 的回應邏輯一旦觸發，請求流程就不會繼續執行後續中介層。這樣的特性對於設計響應結束的中介層（如終止請求或錯誤處理）尤為重要。

### **Koa：回應後的執行與控制**

Koa 的設計則不同，即使設置了 `ctx.body` 來回應請求，請求流程並不會立刻終止，後續的中介層仍然會繼續執行。這樣的設計提供了更多的靈活性，讓開發者能在設置 `ctx.body` 後，進行更多處理或記錄操作。

**範例**：

```tsx title="src/middleware/testMiddleware.ts"
import { Context, Next } from "koa";

export const terminateMiddleware = async (ctx: Context, next: Next) => {
  console.log("3. 終止中介層 - Before termination");
  ctx.body = "Request terminated by middleware";
  await next(); // 即使設置了 ctx.body，後面的中介層仍會執行
};

export const logMiddleware = async (ctx: Context, next: Next) => {
  console.log("4. 日誌記錄中介層 - 執行中");
  await next();
  console.log("4. 日誌記錄中介層 - 完成");
};
```

**預期結果**：

```markdown
3. 終止中介層 - Before termination
4. 日誌記錄中介層 - 執行中
4. 日誌記錄中介層 - 完成
...
```

在 Koa 中，即使設置了 `ctx.body`，後續的中介層仍然可以執行，這讓開發者在回應設置後仍能執行額外的邏輯，例如日誌記錄或資源清理。


<br/>


## **錯誤處理**

### **Express 的錯誤處理**

在 Express 中，有兩種類型的中介層：

- **一般**中介層：參數為 `(req, res, next)`，處理正常的請求和回應邏輯。
- **錯誤處理**中介層：參數為 `(err, req, res, next)`，必須接受 4 個參數。這樣的中介層專門用於捕獲和處理應用程式中的錯誤。Express 會自動識別並執行這種中介層來處理錯誤。

當 Express 檢測到一個這個中介層帶有四個參數`(err, req, res, next)`時，它會將其視為錯誤處理中間件，並且只在以下情況下執行它：

- 當中介層或路由處理器呼叫 `next(error)` 時。
- 當程式碼中主動拋出異常（如 `throw new Error(...)`）時。

當錯誤發生後，Express 會跳過所有後續的正常中介層，直接進入錯誤處理中介層。

**錯誤處理範例**

以下我們透過範例來看在 Express 中如何做錯誤處理：

```jsx title="src/index.ts"
app.use((req, res, next) => {
  console.log("第一個中介層 - Before next");
  next(new Error("模擬錯誤"));
  console.log("第一個中介層 - After next"); // 這行仍然會被執行
});

app.use((req, res, next) => {
  console.log("第二個中介層");
  next(); // 這行不會被執行，因為錯誤已經傳遞到錯誤處理中間件
});

// 錯誤處理中介層，必須放在所有其他中間件和路由之後
app.use((err, req, res, next) => {
  console.error("錯誤捕獲:", err.message);
  res.status(500).send("發生錯誤");
});
```

**執行結果**：

```
第一個中間件 - Before next
第一個中間件 - After next
錯誤捕獲: 模擬錯誤
```

值得特別注意的是，當上層中間件中調用 `next(error)` 或拋出異常時，Express 會執行錯誤處理中間件，**但不會中止上層中間件 `next()` 後面的程式碼**。也就是說，即便 `next(error)` 已經被調用，上層中介層中的 `next()` 後面的程式碼仍然會繼續執行。

:::note[為什麼錯誤處理中介層，必須放在所有其他中間件和路由之後？]
如前所述，因為 Express 採用線性執行模型，`next()` 會將控制權傳遞給下一個中間件或路由。如果錯誤處理中間件不放在最後，Express 將無法正確捕獲和處理錯誤 `next(error)` 向後傳遞的錯誤。
:::

### **Koa 的錯誤處理**

在 **Koa** 中，錯誤處理的機制與 **Express** 有一些根本上的不同。Koa 採用了原生的 `async/await` 和 `try...catch` 結構，使得錯誤處理的邏輯更直觀且易於理解。這讓開發者能夠在中介層中集中捕捉和處理錯誤，而不需要額外設置專用的錯誤處理中間件。

**`try...catch` 的使用**

前面我們一再提到的，Koa 的中介層是基於 Promise 的洋蔥模型，這代表每一層中介層都可以使用 `try...catch` 來捕捉異常。一旦發生錯誤，Koa 會自動中止後續中介層 `next()` 之後的程式碼，並跳回最近的 `catch` 區塊來處理錯誤。這樣的設計避免了錯誤在返回過程中被忽略或執行不必要的程式碼。但如果沒有 `try...catch`，未捕捉的異常會直接被傳遞到應用層，可能會導致應用崩潰或未處理的錯誤回應

**範例**：

讓我們看一個簡單的例子，展示如何在 Koa 中使用 `try...catch` 來捕獲和處理錯誤：

```tsx title="src/index.ts"
import Koa, { Context, Next } from 'koa';

const app = new Koa();
// 全局錯誤監聽器
app.on('error', (err, ctx) => {
  console.error('全局錯誤監聽器捕獲錯誤:', err.message);
  // 可以在此處添加日誌記錄或通知系統等處理
});

// 一般中介層，包含 try...catch 來捕獲錯誤
app.use(async (ctx: Context, next: Next) => {
  try {
    console.log('第一個中介層 - Before next');
    await next(); // 傳遞控制權給下一個中介層
    console.log('第一個中介層 - After next'); // 這行在發生錯誤時不會執行
  } catch (err) {
    console.error('第一個中介層捕獲錯誤:', err.message);
    ctx.status = 500;
    ctx.body = '伺服器發生錯誤';
    ctx.app.emit('error', err, ctx); // 將錯誤發送到全局監聽器
  }
});

// 模擬異常的中介層
app.use(async (ctx: Context, next: Next) => {
  console.log('第二個中介層 - Before throw');
  throw new Error('模擬錯誤'); // 主動拋出錯誤
  console.log('第二個中介層 - After throw'); // 不會執行
});

app.listen(3000, () => {
  console.log('Koa server is running on http://localhost:3000');
});
```

**執行結果**：

```
第一個中介層 - Before next
第二個中介層 - Before throw
第一個中介層捕獲錯誤: 模擬錯誤
全局錯誤監聽器捕獲錯誤: 模擬錯誤
```

**客戶端回應**：

```
伺服器發生錯誤
```

在這個範例中，當 `第二個中介層` 拋出錯誤後，Koa 會立即進入 `第一個中介層` 的 `catch` 區塊，設置 HTTP 狀態碼為 500 並回傳錯誤訊息，同時停止執行 `第一個中介層` 中 `next()` 後的程式碼。這種機制確保錯誤發生後，流程能夠被中止，並進行適當的錯誤處理。

除了使用 `try...catch` 來捕捉錯誤，Koa 還提供了 `ctx.app.emit('error', err, ctx)` 方法來將錯誤事件發送給應用的全局錯誤監聽器。這在大型應用中特別有用，因為它允許集中處理所有錯誤，例如記錄日誌或發送通知，而不需要在每個中介層中重複錯誤處理邏輯。

在這個範例中， `ctx.app.emit('error', err, ctx)` 被調用時，全局監聽器 `app.on('error', …)` 會接收到這個錯誤事件，並根據需求進行集中處理。


<br/>


## **Reference**

- [**Express vs Koa**](https://medium.com/@gary92.gs/express-vs-koa-e48458020ce4)
- [**釐清 Express.js 和 Koa.js 的設計差異**](https://medium.com/cow-say/%E9%87%90%E6%B8%85-express-js-%E5%92%8C-koa-js-%E7%9A%84%E8%A8%AD%E8%A8%88%E5%B7%AE%E7%95%B0-7f95c9f5d596)
- [**NodeJS 輕量開發框架 Expressjs 與 Koa2 的區別**](https://johnnywang1994.github.io/book/articles/js/express-vs-koa.html#nodejs-%E8%BC%95%E9%87%8F%E9%96%8B%E7%99%BC%E6%A1%86%E6%9E%B6-expressjs-%E8%88%87-koa2-%E7%9A%84%E5%8D%80%E5%88%A5)
- [**浅谈 Koa 和 Express 的中间件设计模式**](https://blog.xav1er.com/p/middleware-of-koa-and-express/)
- [**Koa vs Express**](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md)