---
title: "淺談 XSS (Cross-Site Scripting) 攻擊"
sidebar_label: "XSS 攻擊"
description: 本篇技術筆記將深入介紹 XSS（跨網站指令碼）攻擊的原理、類型及可能造成的損害，並提供具體的防禦措施及程式碼範例，幫助初學者理解如何防範這類常見的網頁安全威脅。
last_update:
  date: 2024-09-30
keywords:
  - XSS
  - Cross-Site Scripting
  - Reflected XSS
  - Stored XSS
  - DOM-based XSS
tags: [Web]
---


## **何謂 XSS (Cross-Site Scripting) 攻擊?**

**XSS**，全稱為 **Cross-Site Scripting（跨網站指令碼）**，是一種攻擊者透過植入的惡意腳本來攻擊使用者瀏覽器的攻擊手法。攻擊者會藉由各種手段將惡意腳本注入網頁，當受害者訪問這些網頁時，惡意腳本就會在使用者的瀏覽器中被執行。

由於這種 XSS 攻擊的惡意程式碼試運行在受害者的瀏覽器環境上，因此，用更專業的詞彙來說，Cross-site scripting 是一種**用戶端程式碼插入攻擊**。

XSS攻擊之所以被稱為 **"跨站腳本"** 攻擊，其核心在於它巧妙地利用了網站對用戶輸入的信任機制，從而繞過瀏覽器的同源政策。這種攻擊的獨特之處在於：

- **信任的濫用**：雖然惡意腳本可能源自外部，但因為它是通過受信任的用戶 **"代理"** 提交的，所以在網站看來，這個腳本仍然是來自 **"可信來源"**。
- **繞過防禦**：這種方式巧妙地規避了同源政策的限制。因為從網站的角度來看，這個腳本是在它自己的域內執行的，而非來自外部網站。

## **XSS攻擊可能造成的損害**

因為在 Web 的世界中 JavaScript 幾乎可以做到任何事，所以 XSS 的攻擊能做到的事情也是五花八門。舉例來說：

- **竊取使用者資料**：攻擊者可以獲取受害者的 cookie、session tokens，進一步竊取帳號控制權。
- **偽造使用者行為**：攻擊者可以在使用者的瀏覽器中執行惡意行為，例如偽造表單提交、假冒使用者發表留言或按讚。
- **植入惡意程式碼**：攻擊者甚至可以在網站中植入更多的惡意程式碼，擴大攻擊影響。
- **執行社交工程攻擊**：攻擊者可以利用被感染的網頁顯示虛假的登錄頁面或其他欺騙性內容，誘導使用者提供更多敏感信息。

## **XSS 的類性**

XSS 攻擊主要可以分為三種類型：**反射型 XSS**、**儲存型 XSS** 以及 **DOM 型 XSS**。每種類型的攻擊都有其特點和方式，以下我們會詳細解釋攻擊者如何注入惡意腳本以及這些腳本是如何被執行的。

### **反射型 XSS（Reflected XSS）**

反射型 XSS 是最常見的攻擊方式。反射型 XSS 通常出現在需要使用者輸入表單資料來動態生成回應的情況，例如搜尋框或查詢參數。攻擊者會將惡意腳本包含在請求的 URL 中，當受害者點擊該 URL，伺服器會把攻擊者的輸入直接反射到回應中，導致瀏覽器執行惡意程式碼。

**注入方法與執行機制**

攻擊者通常會構造一個 URL，將惡意指令碼作為查詢參數。例如：

```
http://example.com/search?query=<script>alert('You have been hacked!')</script>
```

在這裡，攻擊者將惡意的 JavaScript 程式碼作為 `query` 參數提交，目的是讓伺服器將這段指令碼嵌入到回應的 HTML 中，並在受害者的瀏覽器中執行。因為此手法需透過特定網址點入，因此攻擊者通常會以釣魚手法、社交工程等方式誘騙受害者點入連結。

**範例**

假設伺服器端程式碼未對使用者輸入進行適當處理，就可能會出現以下情況：

```jsx
const http = require('http');
const url = require('url');

http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // 直接將用戶輸入寫入回應中
  res.end(`<html><body>Search result: ${queryObject.query}</body></html>`);
}).listen(8080);
```

在上述範例中，使用者輸入的內容會被直接插入 HTML 中，導致惡意指令碼在受害者的瀏覽器中執行。當受害者訪問攻擊者給出的 URL 時，瀏覽器會直接顯示彈窗，顯示「You have been hacked!」。

### **儲存型 XSS（Stored XSS）**

儲存型 XSS 是當攻擊者將惡意指令碼儲存在伺服器上，使其他使用者在訪問相關內容時執行這段指令碼。這類 XSS 攻擊通常發生在具備留言板、評論功能或其他可以持久儲存使用者輸入的網站。

**注入方法與執行機制**

攻擊者可以透過提交惡意內容至伺服器，例如在評論欄位中輸入以下內容：

```html
<script>alert('Your account is compromised!')</script>
```

如果伺服器沒有對這些內容進行適當的過濾與處理，這段指令碼會被儲存在伺服器的資料庫中，並在其他使用者瀏覽該評論時被執行。

**範例**

伺服器端將使用者的輸入儲存到資料庫中，並且在顯示時直接將其插入 HTML 中：

```jsx
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let comments = []; // 假設這裡是我們的簡單儲存空間

app.post('/comment', (req, res) => {
  comments.push(req.body.comment); // 將使用者的評論儲存起來
  res.send('Comment added successfully!');
});

app.get('/comments', (req, res) => {
  let commentsHtml = comments.map(comment => `<div>${comment}</div>`).join('');
  res.send(`<html><body>${commentsHtml}</body></html>`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

在這個範例中，當攻擊者在 `/comment` 路徑提交一個含有惡意 JavaScript 的評論時，例如 `<script>alert('Your account is compromised!')</script>`，當其他使用者訪問 `/comments` 時，這段指令碼就會被執行。

### **DOM 型 XSS（DOM-based XSS）**

DOM 型 XSS 與反射型或儲存型 XSS 的不同之處在於，DOM 型 XSS 是由 JavaScript 在客戶端上直接操作 DOM 元素而導致的，這些惡意指令碼並不需要透過伺服器處理，而是直接在受害者的瀏覽器中生成並執行。

**注入方法與執行機制**

攻擊者會利用存在安全漏洞的 JavaScript 程式碼，將惡意內容注入頁面中。通常，這些 JavaScript 程式碼會從 URL、Cookies 或本地存儲中讀取用戶輸入，並且未經過適當處理就直接使用這些數據更新 DOM。

例如，攻擊者構造以下 URL：

```
http://example.com/#<img src=x onerror="alert('Hacked via DOM!')">
```

這段 URL 包含了惡意的 HTML 片段，目的是利用網頁中的不安全 JavaScript 來插入到頁面中。

**範例**

假設有以下 HTML 和 JavaScript 程式碼：

```html
<!DOCTYPE html>
<html>
<head>
  <title>DOM XSS Example</title>
</head>
<body>
  <h1>Welcome to our site!</h1>
  <p id="output"></p>
  <script>
    // 讀取 URL 中的 hash 值，並將其插入到網頁中
    const hashContent = location.hash.substring(1);
    // 不安全地將用戶輸入的內容直接插入 DOM，沒有任何過濾或跳脫
    document.getElementById('output').innerHTML = hashContent;
  </script>
</body>
</html>
```

在這個範例中，當攻擊者構造一個惡意 URL，例如 `http://example.com/#<img src=x onerror="alert('Hacked via DOM!')">`，並誘導受害者點擊時，網頁會從 `location.hash` 讀取該值並插入到 `<p id="output">` 中。

由於程式碼中未對用戶輸入進行任何過濾或跳脫，攻擊者的惡意腳本（`<img src=x onerror="alert('Hacked via DOM!')">`）就會在受害者的瀏覽器中被執行。當受害者載入這個頁面時，`<img>` 元素的 `onerror` 事件處理器會被觸發，並顯示彈窗提示「Hacked via DOM!」。

## **如何防範 XSS 攻擊？**

參閱 [**@Huli’s blog - 淺談 XSS 攻擊與防禦的各個環節**](https://blog.huli.tw/2021/06/19/xss-attack-and-defense/) 這篇文章，防範 XSS 攻擊可以分成以下三個層次(關卡)：

1. 如何不要讓攻擊者在網站中能夠植入程式碼
2. 如果真的不幸被植入程式碼了，可以怎麼不讓它執行
3. 假設攻擊者已經能夠在網站上執行任意程式碼，該如何把損害控制到最低

以下我們將根據這三個層次來說明有哪些不同的防禦方法。

### **第一關：阻止惡意程式碼的植入**

- **輸入驗證**：
    
    對所有來自用戶的輸入進行驗證，以確保只允許合法的資料格式。例如，對文字輸入的長度、內容類型進行限制。這樣可以大幅降低惡意腳本被注入的可能性。
    
    **程式碼範例**：
    假設我們有一個用戶評論功能，我們可以使用正則表達式來檢查輸入是否包含不允許的符號：
    
    ```jsx
    function validateInput(input) {
      // 僅允許字母和數字
      const regex = /^[a-zA-Z0-9 ]*$/;
      if (!regex.test(input)) {
        throw new Error('Invalid input, only letters and numbers are allowed.');
      }
    }
    
    try {
      validateInput('<script>alert("XSS")</script>'); // 將拋出錯誤
    } catch (e) {
      console.error(e.message);
    }
    ```
    
    在這個例子中，任何包含 `<` 或 `>` 的輸入都會被拒絕，防止攻擊者注入 HTML 或 JavaScript。
    
- **輸出跳脫（Escaping Output）**：
    
    當將用戶輸入的資料輸出到 HTML 頁面時，應進行適當的跳脫（escaping），以確保輸入的內容被當作純文本顯示，而不是 HTML 或 JavaScript 程式碼。
    
    **程式碼範例**：
    使用 JavaScript 進行輸出跳脫的簡單方法：
    
    ```jsx
    function escapeHTML(unsafeString) {
      return unsafeString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    const userInput = '<script>alert("XSS")</script>';
    document.getElementById('output').innerHTML = escapeHTML(userInput); // 輸出為安全的文本
    ```
    
    在這裡，使用 `escapeHTML` 函數可以確保任何不安全的字元被替換成 HTML 實體，防止它們被瀏覽器解讀為程式碼。
    

### **第二關：限制惡意程式碼的執行**

即使攻擊者成功在網站中植入了惡意腳本，我們仍然可以採取一些措施，讓這些惡意腳本無法順利被執行。其中最常用的方法就是設置 **「內容安全策略」（Content Security Policy, CSP）**。

CSP 是一套規則，用來告訴瀏覽器哪些來源的內容是安全的，可以被加載執行，以及瀏覽器只執行那些該被執行的腳本。我們可以通過設置 HTTP Header 或 `<meta>` 標籤來指定 CSP 規則。這裡，我們用幾個簡單的例子來看看如何設置 CSP：

> 在 Node.js 中，我們可以使用一個叫做 `helmet` 的 Node.js 套件來幫助我們簡單地設置 CSP。
> 
- **防止內嵌 JavaScript 執行**：
    
    攻擊者經常會通過 XSS 攻擊將 JavaScript 直接嵌入到 HTML 中，例如 `<script>alert('XSS')</script>`，或通過內聯事件（如 `<img src="x" onerror="alert('Hacked!')">`）。這些惡意腳本雖然是在你自己網站上運行的，但 CSP 可以設定禁止「內聯腳本」的執行，這樣即使攻擊者成功插入了這段 JavaScript，瀏覽器也不會執行。
    
    ```jsx
    const express = require('express');
    const helmet = require('helmet');
    
    const app = express();
    
    // 使用 helmet 套件來設置 CSP
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // 設置禁止內聯腳本（去掉 'unsafe-inline'）
        },
      })
    );
    
    app.get('/', (req, res) => {
      res.send('<h1>Hello World! This site is protected by CSP.</h1>');
    });
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
    ```
    
- **阻止外部不受信任的 JavaScript 文件**：
    
    攻擊者可能會嘗試將外部的 JavaScript 文件加載到你的頁面上。例如，他們可能會使用類似 `<script src="http://malicious-site.com/malicious.js"></script>` 的方式來載入惡意腳本。如果沒有 CSP 的保護，這段外部代碼會被正常加載並執行。而 CSP 可以限制腳本只允許從信任的域名載入，這樣來自其他不受信任網站的代碼就會被阻止。
    
    ```jsx
    const express = require('express');
    const helmet = require('helmet');
    
    const app = express();
    
    // 使用 helmet 套件來設置 CSP
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"], // 只允許來自本站的 JavaScript 文件被載入
        },
      })
    );
    
    app.get('/', (req, res) => {
      res.send('<h1>Hello World! This site is protected by CSP.</h1>');
    });
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
    ```
    

### **第三關：降低攻擊的影響**

假設攻擊者已經能夠在網站上執行任意程式碼，我們應該嘗試把損害控制到最低。

- **限制使用者的權限**：
    
    對重要的操作進行權限驗證，避免攻擊者以受害者的身份執行敏感操作。例如，對於重要的資料修改操作，可以使用 CSRF Token 來防止跨站請求偽造。
    
    **程式碼範例**：
    假設我們使用 Express.js 來實現簡單的 CSRF 防護：
    
    ```js
    const express = require('express');
    const csrf = require('csurf');
    const cookieParser = require('cookie-parser');
    
    const app = express();
    const csrfProtection = csrf({ cookie: true });
    
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    
    app.get('/form', csrfProtection, (req, res) => {
      res.send(`<form action="/process" method="POST">
                  <input type="hidden" name="_csrf" value="${req.csrfToken()}">
                  <button type="submit">Submit</button>
                </form>`);
    });
    
    app.post('/process', csrfProtection, (req, res) => {
      res.send('Form data processed successfully.');
    });
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
    
    ```
    
    在這個範例中，我們使用 `csrf` 中間件生成並驗證 CSRF Token，以確保只有合法的請求才能進行敏感操作。
    
- **避免將敏感資料存儲在客戶端**：
    
    盡可能減少敏感資訊在客戶端的存儲，例如不要將用戶的身份驗證資料直接存儲在 JavaScript 變數中，以免被攻擊者透過 XSS 攻擊獲取。
    
    **程式碼範例**：
    如果必須存儲某些資料，可以考慮將其存儲在受保護的 HttpOnly Cookie 中，以防止 JavaScript 在客戶端端讀取這些資訊。
    
    ```js
    const express = require('express');
    const cookieParser = require('cookie-parser');
    
    const app = express();
    app.use(cookieParser());
    
    app.get('/set-auth', (req, res) => {
      // 設置 HttpOnly Cookie，防止 JavaScript 存取
      res.cookie('auth', 'user-auth-token', { httpOnly: true });
      res.send('Auth cookie set.');
    });
    
    app.get('/dashboard', (req, res) => {
      if (req.cookies.auth) {
        res.send('Welcome to your dashboard!');
      } else {
        res.send('Unauthorized access.');
      }
    });
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
    
    ```
    
    在這個例子中，`auth` cookie 被設置為 `httpOnly`，這樣 JavaScript 無法訪問它，有助於防範 XSS 攻擊對身份資訊的竊取。
    

## **Reference**

- [**ExplainThis - 什麼是 XSS 攻擊？如何防範？**](https://www.explainthis.io/zh-hant/swe/what-is-xss)
- [**淺談 XSS 攻擊與防禦的各個環節**](https://blog.huli.tw/2021/06/19/xss-attack-and-defense/)