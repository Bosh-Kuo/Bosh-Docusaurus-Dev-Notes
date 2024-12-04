---
title: 一次搞懂如何使用 Promise 實現非同步操作
sidebar_label: "Promise"
description: 本篇介紹 Promise 的歷史、基本用法，接著介紹 Promise 的進階應用以及與其他技術結合的情境，最後收錄Promise 的最佳實踐與常見錯誤
last_update:
  date: 2023-03-19
keywords:
  - Javascript
  - Promise
  - async/await
tags:
  - Javascript
---

## **前言**
在現代 Web 開發中，處理非同步操作是一個很常見的需求。JavaScript 提供了一些內建的方法來處理非同步操作，例如 **setTimeout、XMLHttpRequest、Fetch API** 等等。`Promise` 就是一種能夠更好地處理非同步操作的方法。

### **同步與非同步**
在開始學習 Promise 之前，我們需要先了解什麼是**同步操作**和**非同步操作**。
JavaScript 是一`種單線程 (single-thread)` 的程式語言，也就是說**它在任意一個時間點只能執行一個任務**。當程式碼在運行時，如果遇到一個耗時較長的操作 (複雜的計算 or 巨大的迴圈)，如果這個操作是同步的，則整個程式碼會被阻塞 **(blocked)** ，直到這個操作完成。這種方式稱為同步操作。

相反的，當程式碼遇到一個非同步操作時，**它不會等待這個操作完成**，而是會繼續執行下去，直到該操作完成後才會通知程式碼。在這種情況下，程式碼不會被阻塞，因為它可以繼續執行其他的操作。當操作完成時，通常會執行一個回調函式 (callback function) 來處理操作的結果。這種方式稱為非同步操作。而以下是一個簡單的非同步操作範例：

```js
console.log("start");

setTimeout(() => {
  console.log("middle");
}, 1000);

console.log("end");

// output:
// start
// end
// middle
```

以上程式碼會先輸出 **start、end**，然後一秒後再輸出 **middle**。這是因為 setTimeout 方法是一個**非同步操作**，當 JavaScript 遇到 setTimeout 時，會將其加入**事件循環（Event Loop）**中，並繼續執行後續程式碼，等到指定的時間過後，setTimeout 才會被加入到待處理的事件佇列中，等到 JavaScript 處理完當前的程式碼後，才會從**事件佇列(callback queue)**中取出 setTimeout 並執行其中的函式。


<br/>


## **淺談 Promise**
### **什麼是 Promise?**
`Promise` 是一個封裝非同步操作的物件，它代表了一個還未完成但承諾將來完成的操作。Promise 有三種狀態，分別為 `Pending（進行中）、Fulfilled（已完成）和 Rejected（已拒絕）`。當一個 Promise 被創建時，它的初始狀態是 Pending。當操作完成時，Promise 會從 **Pending** 狀態轉換為 **Fulfilled** 狀態，並且會傳遞一個結果給後續處理程序。如果操作失敗，Promise 會從 **Pending** 狀態轉換為 **Rejected** 狀態，並且會傳遞一個錯誤給後續處理程序。

以下是一個簡單的**模擬前端向後端伺服器發送 request 的非同步事件操作範例**：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="promiseExample">
  <TabItem value="w/o promise" label="未處理非同步事件">

```js
function fetchUser(userId) {
// 模擬發送請求獲取用戶訂單信息
setTimeout(() => {
  const user = { id: userId, name: "John" };
  return user;
}, 2000);
}

function fetchUserOrders() {
  // 模擬發送請求獲取用戶訂單信息
  setTimeout(() => {
    const orders = [
      { id: 1, product: "Book" },
      { id: 2, product: "Pen" },
    ];
    return orders;
  }, 2000);
}

function fetchUserData() {
  // 獲取用戶信息後再使用它發送另一個請求獲取訂單信息
  const user = fetchUser(1);
  const orders = fetchUserOrders();

  // 返回用戶信息和訂單信息
  return { user, orders };
}

console.log(fetchUserData());

// output: 
// { user: undefined, orders: undefined }
```

  我們本來預期應該要在 4 秒之後輸出 ：
```json
{
  user: { id: 1, name: 'John' },
  orders: [ { id: 1, product: 'Book' }, { id: 2, product: 'Pen' } ]
}
```
  但以上程式碼卻在執行當下就輸出 **\{ user: undefined, orders: undefined \}**，並在 4 秒後才結束。這是因為 **fetchUser** 與 **fetchUserOrders** 這兩個函式為非同步事件，簡單來說 JS 會優先處理完所有同步事件後才處理非同步事件。

  </TabItem>
  
  <TabItem value="w/promise" label="以 Promise 處理同步事件">

```js
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    // 模擬發送請求獲取用戶訂單信息
    setTimeout(() => {
      const user = { id: userId, name: "John" };
      resolve(user);
    }, 2000);
  });
}

function fetchUserOrders() {
  return new Promise((resolve, reject) => {
    // 模擬發送請求獲取用戶訂單信息
    setTimeout(() => {
      const orders = [
        { id: 1, product: "Book" },
        { id: 2, product: "Pen" },
      ];
      resolve(orders);
    }, 2000);
  });
}

function fetchUserData() {
  return new Promise((resolve, reject) => {
    // 發送請求獲取用戶信息
    fetchUser(1).then((user) => {
      fetchUserOrders().then((orders) => {
        // 返回用戶信息和訂單信息
        resolve({ user, orders });
      });
    });
  });
}

// 使用 fetchUserData 函数獲取用戶信息和訂單信息
fetchUserData().then((data) => {
  const userData = data;
  console.log(userData);
});

// output:
// {
//   user: { id: 1, name: 'John' },
//   orders: [ { id: 1, product: 'Book' }, { id: 2, product: 'Pen' } ]
// }
```  

  以上程式碼會按照預期在 4 秒後輸出正確資訊，這是因為我們把要必須等非同步操作做完才能做的動作(console.log)放在 `Promise.then()` 裡，所以程式會等到 Promise 狀態改變成 **Fulfilled** 才印出 userData。

  </TabItem>
</Tabs>


<br/>


## **Promise 的基本用法**
### **創建 Promise 物件**

`Promise` 本身是一個**建構函式**，因此會需要使用到 `new` 語法來實例化它。 `Promise` 接受一個 **callback function** 做為參數，該 **callback function** 又接受兩個參數 `resolve` 和 `reject`（他們都是 JS 提供的內建函式），分別在異步操作成功和失敗時用來回傳結果。


### **resolve, reject 與 then, catch 關鍵字**
`resolve` 和 `reject` 都是函式，他們的作用是用來改變 Promise 的狀態（從 **pending 變成 fulfilled 或 rejected**），當 Promise 內的異步操作成功時用 `resolve` 傳遞成功結果；異步操作失敗時用 `reject` 傳遞失敗結果。

在 Promise 物件建立後，我們可以使用 `then` 和 `catch` 方法來處理 Promise 狀態改變後進入 **Fulfilled** 狀態與 **Rejected** 狀態的結果，通常就是用來**處理異步函式結束才能夠接續的動作**。
- `then` 方法會接受一個 callback function 作為參數，當 Promise 執行成功(Fulfilled)時，會呼叫這個 callback function，並**以 resolve 函式所傳遞的值做為 callback function 的參數**；
- `catch` 方法會接受一個 callback function 作為參數，當 Promise 執行失敗(Rejected)時，會呼叫這個 callback function，並**以 reject 函式所傳遞的錯誤物件作為 callback function 的參數**。


### **Promise 實例**
```js
const myPromise = new Promise((resolve, reject) => {
  // 做一些非同步操作
  if (/*如果操作成功*/){
    // 傳遞 'success' 字串
    resolve('success');
  } else {
    reject(new Error('操作失敗'))
    // 傳遞錯誤物件
  }
  
});

myPromise
  .then(result => {
    console.log(result); // 'success'
  })
  .catch(error => {
    console.error(error); // Error: 操作失敗
  });
```

在處理非同步操作時，Promise 可以讓程式碼更易讀且更易維護。但要注意的是，Promise 是一個**一次性的物件**，當它的狀態改變後，就不能再次使用。如果需要多次使用 Promise，可以使用 `async/await` 或其他類似的方式來處理。



<br/>


## **Promise, Callback, Async/Await 之間的關係**
### **Callback 與 Promise 的區別**
在 JavaScript 中，`Callback` 和 `Promise` 都是用於處理非同步操作的機制。然而，它們之間有著一些重要的區別。Callback 是一個函式，通常被作為參數傳遞給一個非同步函式，用於處理操作完成後的回調。以下是一個使用 `Callback` 的例子：
```js
function fetchData(callback) {
  setTimeout(() => {
    const data = "fetch data";
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

`Callback` 有一些缺點。當多個非同步操作需要被處理時，Callback 可能會導致 Callback Hell，即多個 Callback 嵌套在一起，使代碼難以閱讀和維護。此外，Callback 也不支持 Promise 提供的一些便捷的方法，例如 Promise.all 和 Promise.race。

`Promise` 是一個封裝了非同步操作的物件，它可以幫助我們更好地處理非同步操作，使程式碼更容易閱讀和維護。相比於 Callback，Promise 更容易閱讀和維護，而且支持 **Promise.all** 和 **Promise.race** 等便捷的方法。


### **Async/Await 與 Promise 的關聯**
`Async/Await` 是 ES2017 引進的語法糖，用來簡化 Promise 的使用方式，讓我們可以**用同步的方式編寫異步程式碼**。
- `Async` 是一個關鍵字，它可以讓普通的同步函式變成**異步函式**，且`Async function` 的回傳是一個 **Promise 物件**。
-  `await` 也是一個關鍵字，它可以讓函式等待一個 Promise 的執行結果，也就是 **Promise 中 resolve 函式回傳的值**。

:::tip async/await 與 Promise 的類比: async
**1. async function 相當於 Promise.resolve() / Promise.reject():**  
當我們在 `async` 函式中使用 **return** 關鍵字返回一個值時，`async` 函式會自動把這個值包裝在一個完成 (fulfilled) 的 Promise 物件中並且使用 **Promise.resolve()** 解析 return 的值。因此，如果使用 `async` 函式返回一個值，我們可以在 async 函式外面使用 **.then()** 方法獲取這個值。

如果在 `async` 函式中發生了錯誤，這個錯誤會被自動包裝在一個被拒絕（rejected）的 Promise 物件中，這個 Promise 物件是使用 **Promise.reject()** 方法創建的，而不是使用 Promise.resolve() 方法。這就意味著使用 `async` 函式返回的 Promise 物件可以捕獲到函式中的錯誤。
```js
async function asyncFunc() {
  return 'Hello World';
}

asyncFunc()
  .then(result => console.log(result))  // logs 'Hello World'
  .catch(error => console.error(error)); 
```
:::

:::tip ASYNC/AWAIT 與 PROMISE 的類比: await
**2. await 類似於使用 .then():**  
前面提到，`then` 會把 Promise 中 resolve 函式所傳遞的值做為 callback function 的參數，繼續完成異步操作後續的動作。 `await` 則是直接取得 Promise 中 resolve 函式回傳的值，使得異步操作在 async function 裡可以像同步操作的程式碼一樣由上到下逐行執行，當有多個異步操作接續執行時，使用 `await` 可以提高程式碼的可讀性，避免程式碼形成巢狀結構。

`await` 關鍵字可以等待一個 Promise 的執行結果(**resolve 值**)，並返回 Promise 的 resolve 值。它的作用等類似於使用 **then()** 方法。

```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully!');
    }, 2000);
  });
}

async function processData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

processData();

// 使用 then() 來編寫的 Promise 範例
fetchData().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

```

但由於 `await` 只能等待 Promise 中 **resolve** 函式的回傳值，而不是 **reject** 函式回傳的錯誤訊息，因此必須要用 try/catch 語法來捕捉異步操作中的錯誤訊息。
:::



<br/>


## **Promise 的進階應用**
在使用 Promise 時，有些情況下我們需要同時處理多個 Promise 物件的執行結果，或者只關注其中最快或最先完成的 Promise 物件。為了解決這些問題，JavaScript 提供了三個靜態方法：`Promise.all`、`Promise.race`、`Promise.any`。

### **Promise.all**
`Promise.all` 方法接受一個 Promise 物件的陣列作為參數，**並在所有 Promise 物件都執行成功後，回傳一個陣列**，陣列中的元素依照傳入 Promise 物件陣列的順序排列，每個元素對應一個 Promise 物件的 resolve 函式所傳遞的值。**如果任何一個 Promise 物件執行失敗，則 Promise.all 會立即中斷執行**，並回傳該 Promise 物件的 reject 函式所傳遞的錯誤物件。
```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });

```


### **Promise.race**
`Promise.race` 方法與 `Promise.all` 方法非常相似，也接受一個 Promise 物件的陣列作為參數。但不同的是，**Promise.race 只回傳最先解決的 Promise 物件的 resolve 函式所傳遞的值，並立即中斷執行**。如果最先解決的 Promise 物件執行失敗，`Promise.race` 會回傳該 Promise 物件的 reject 函式所傳遞的錯誤物件。

```js
const promise1 = new Promise(resolve => setTimeout(resolve, 1000, 'foo'));
const promise2 = new Promise(resolve => setTimeout(resolve, 2000, 'bar'));

Promise.race([promise1, promise2])
  .then(result => {
    console.log(result); // 'foo'
  })
  .catch(error => {
    console.error(error);
  });
```



### **Promise.any**
`Promise.any` 方法是在 ES2021 中新增的方法，與 `Promise.all` 和 `Promise.race` 不同的是，`Promise.any` 回傳的是傳入 Promise 物件陣列中第一個執行成功（resolve）的 Promise 物件的 resolve 函式所傳遞的值。如果所有的 Promise 物件都執行失敗（reject），Promise.any 會回傳一個 **AggregateError** 物件，其中包含所有 Promise 物件 reject 函式所傳遞的錯誤物件。

```js
const promise1 = new Promise((resolve, reject) => setTimeout(reject, 1000, 'error1'));
const promise2 = new Promise((resolve, reject) => setTimeout(resolve, 2000, 'foo'));
const promise3 = new Promise((resolve, reject) => setTimeout(reject, 1500, 'error3'));

Promise.any([promise1, promise2, promise3])
  .then(result => {
    console.log(result); // 'foo'
  })
  .catch(error => {
    console.error(error); // AggregateError: All promises were rejected
  });
s
```


<br/>


## **使用 Promise 需注意的事項**
### **避免 Promise Hell**
當需要處理多個 Promise 物件時，往往會出現**多層巢狀的 then** 方法，稱之為 `Promise Hell`。這會使程式碼難以閱讀和維護。為了避免 `Promise Hell`，可以使用 `async/await` 語法糖，讓程式碼更加簡潔易讀。

```js
function getData() {
  return fetch('/data')
    .then(response => response.json())
    .then(data => {
      return fetch(`/details/${data.id}`)
        .then(response => response.json())
        .then(details => {
          return fetch(`/user/${details.userId}`)
            .then(response => response.json())
            .then(user => {
              return { data, details, user };
            });
        });
    });
}

// 使用 async/await 改寫
async function getData() {
  const response = await fetch('/data');
  const data = await response.json();
  
  const detailsResponse = await fetch(`/details/${data.id}`);
  const details = await detailsResponse.json();
  
  const userResponse = await fetch(`/user/${details.userId}`);
  const user = await userResponse.json();
  
  return { data, details, user };
}
```

### **正確地處理錯誤**
Promise 在執行過程中可能會發生錯誤，因此必須在 then 方法中處理錯誤，或使用 catch 方法捕捉錯誤。如果未正確處理錯誤，程式可能會因為錯誤而停止執行，甚至出現不明錯誤。

```js
fetch('/data')
  .then(response => {
    if (response.status !== 200) {
      throw new Error('Fetch failed');
    }
    return response.json();
  })
  .then(data => {
    // handle data
  })
  .catch(error => {
    console.error(error);
  });

```

### **使用 Promise.resolve 和 Promise.reject**
Promise.resolve 和 Promise.reject 是兩個靜態方法，可以**用來創建已經 resolved 或 rejected 的 Promise 物件**。這些方法可以使代碼更加簡潔明瞭，並且可以方便地返回已經 resolved 或 rejected 的 Promise 物件。

```js
// 使用 Promise.reject 改寫
function getData(id) {
  return id ? fetch(`/data/${id}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Fetch failed');
      }
      return response.json();
    })
    .then(data => {
      return { id, data };
    })
    : Promise.reject(new Error('Invalid ID'));
}
```

### **避免競態條件(Race condition)**
Promise 可能會發生競態條件(`Race condition`)問題，當多個 Promise 同時競爭一個資源時，例如同時對一個變數進行操作，可能會導致不可預測的結果。

以下是一個可能會發生競態條件問題的範例程式碼：

```js
let count = 0;

function increment() {
  return new Promise(resolve => {
    setTimeout(() => {
      count++;
      resolve(count);
    }, Math.random() * 1000);
  });
}

Promise.all([increment(), increment(), increment()])
  .then(results => console.log(results))
  .catch(error => console.error(error));

```

在這個範例中，我們創建了三個 Promise，它們都會對一個全域變數 count 進行加一操作。**由於這三個 Promise 是同時執行的，可能會導致競態條件問題**，例如兩個 Promise 同時讀取 count，然後將它加一，這樣 count 就只會增加一次，而不是兩次。

以下提供兩種解決方法：
1. 第一種方法是**避免共享狀態**，也就是不要在 Promise 中使用共享的變數或資源。相反，可以將資源傳遞給 Promise，讓每個 Promise 都有自己的資源，這樣可以避免競態條件問題。在這個範例中，我們將初始的 count 值傳遞給第一個 Promise，然後每個 Promise 都會返回一個新的 count 值，傳遞給下一個 Promise。這樣每個 Promise 都有自己的 count 值，不會有共享狀態，也就不會發生競態條件問題。
```js
function increment(count) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(count + 1);
    }, Math.random() * 1000);
  });
}

Promise.resolve(0)
  .then(count => increment(count))
  .then(count => increment(count))
  .then(count => increment(count))
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

2. 第二種方法是使用 `async/await` 來解決 Promise 競態條件問題，在使用 async/await 時，我們可以使用 async function 宣告一個異步函式，然後在函式內使用 await 關鍵字等待 Promise 物件的結果，在 **run** 函式內部，我們創建了一個 count 變數，然後**依次調用 increment 函式**，並將結果加到 count 變數中。這樣可以確保異步操作是順序執行的，避免了競態條件問題。

```js
function increment() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, Math.random() * 1000);
  });
}

async function run() {
  let count = 0;
  count += await increment();
  count += await increment();
  count += await increment();
  console.log(count);
}

run().catch(error => console.error(error));

```

<br/>


## **Reference**

- **[JavaScript Promise 全介紹](https://www.casper.tw/development/2020/02/16/all-new-promise/) (@卡斯伯的 Blog)**
- **[JavaScript 中的 Promise 是什麼？以及為什麼你要懂 Promise](https://israynotarray.com/javascript/20211128/2950137358/#ES7-Async-x2F-Await) (@是 Ray 不是 Array)**
- **[用淺顯方式說明 Javascript 的 Promise](https://ithelp.ithome.com.tw/articles/10230214)**
- **[Promise 对象](https://es6.ruanyifeng.com/#docs/promise) (@ECMAScript 6 入门)**
- **[The Async Await Episode I Promised](https://www.youtube.com/watch?v=vn3tm0quoqE&ab_channel=Fireship)**




