---
title: 全面了解 Javascript 閉包(Closure)
sidebar_label: "[JS] 閉包(Closure)"
description: 本篇紀錄閉包的概念、優點、缺點、實現方式和使用技巧，同時也可以讓讀者了解閉包在實際開發中的應用場景和注意事項，以便更好地應用閉包來解決問題。
last_update:
  date: 2023-03-19
keywords:
  - Javascript
  - Closure
tags:
  - Javascript
---


閉包是 JavaScript 中一個重要的概念，也是一個比較難理解的概念之一。本篇技術筆記將詳細解釋閉包的概念、優點、缺點、實現方式和技巧，以及閉包在不同程式語言中的異同。希望通過本篇技術筆記的介紹，讀者可以更好地理解和應用閉包。

## **什麼是閉包？**
閉包是指一個函式與其引用的外部變數形成的一個環境，也可以理解為函式和其引用的外部變數的一個包裹。下面是一個簡單的閉包例子：

```js
function outer() {
  const outerVar = 'Hello';  // 真正要執行的函式內要用到的變數

  // 真正要執行的函式
  function inner() {
    const innerVar = 'World';
    console.log(`${outerVar} ${innerVar}`);
  }

  return inner;  // 把內部函數回傳出來
}

const fn = outer();
fn(); // output: "Hello World"

```

:::tip
**看到一個 function 內 return 了另一個 function，通常就是有用到閉包的概念。**
:::


<br/>


## **閉包的優點和應用**
閉包的優點在於可以保存狀態、實現私有變數和方法、實現函式柯里化、實現延遲計算等。

### **保存狀態**
閉包可以保存狀態，也就是說，當我們執行閉包時，它可以記住之前的狀態。這一點在一些場景下非常有用，例如實現**計數器、緩存**等。

下面是一個實現計數器的例子：
```js
function counter() {
  let count = 0;

  return function () {
    count++;
    console.log(count);
  };
}

const fn = counter();
fn();  //output: "1"
fn();  //output: "2"
fn();  //output: "3"
```

在上面的例子中，counter 函式返回一個閉包，閉包中保存了 **count 變數的狀態**，每次執行閉包時 count 變量會增加 1，然後輸出 count 的值。當我們連續執行 fn() 時，**閉包會記住上一次 count 的值**，因此 count 會持續增加。


### **實現私有變數和方法**
閉包可以實現私有變數和方法，這是因為閉包中的變數和方法只能在閉包內部訪問，無法從閉包外部訪問。

下面是一個實現私有變數和方法的例子：

```js
function createPerson(name) {
  let age = 0;

  function grow() {
    age++;
  }

  function getAge() {
    return age;
  }

  return {
    getName: function () {
      return name;
    },
    getAge: getAge,
    grow: grow,
  };
}

const person = createPerson('John');
person.grow();
console.log(`${person.getName()} is ${person.getAge()} years old.`);

```

在上面的例子中，createPerson 函式返回一個物件，物件中包含了 **getName**、**getAge** 和 **grow** 三個方法。其中 getName 方法返回 name 參數，getAge 方法返回 age 變數，grow 方法自增 age 變數。由於 age 變數和 grow 方法只在閉包中被定義，因此無法從閉包外部訪問，從而實現了私有變數和方法。


### **實現函式柯里化 Currying**
閉包可以實現函式**柯里化(Currying)**，也就是將一個接受多個參數的函式轉換為一系列只接受一個參數的函式，並且返回一個新的函式，新的函式接受一個參數，並且返回一個新的函式，直到最後一個函式返回結果為止。柯里化的作用在於**提前接收部分參數，延遲執行，不立即輸出結果。**

下面是一個實現函式柯里化的例子：
```js
function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  const len = fn.length;
  let args = [];

  return function curryFn(...curryArgs) {
    args = [...args, ...curryArgs];

    if (args.length >= len) {
      const result = fn.apply(this, args);
      args = [];
      return result;
    } else {
      return curryFn;
    }
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // output: 6
console.log(curriedAdd(1, 2)(3)); // output: 6
console.log(curriedAdd(1, 2, 3)); // output: 6
```
在上面的例子中，add 函式接受三個參數，返回三個參數的和。curry 函式接受一個函式 fn，返回一個新的函式 `curryFn`。`curryFn` 接受一個參數 `curryArgs`，將 `curryArgs` 添加到 **args** 中，如果 **args** 的長度大於等於 fn 的參數個數 len，則執行 fn，返回結果；否則，返回 `curryFn`。這樣，就可以實現將一個接受多個參數的函式轉換為一系列只接受一個參數的函式。

在這個例子中，我們使用了閉包保存了 args 變數和 curryFn 方法，因此 curryFn 方法可以持續保存 args 變量的值，直到最後一個函式返回結果為止。


<br/>

## **閉包的缺點和限制**
閉包雖然有很多優點和應用，但也存在一些缺點和限制。以下是其中幾個值得關注的方面。

**1. 記憶體消耗:**  
閉包會記錄外部函式的環境，這意味著閉包會佔用額外的記憶體。當閉包中包含大量的變數時，可能會導致記憶體消耗過大，影響性能。

**2. 內存洩漏:**  
閉包中的變數會被一直保留在內存中，直到閉包被銷毀。如果不小心使用閉包，可能會導致內存洩漏，進而影響應用程序的性能。

**3. 參數傳遞:**  
閉包中的函數只能訪問當前閉包被創建時的變數值，而不能直接訪問當前變數的值。因此，在閉包中使用外部函數的變數時，需要注意變數的值是否已被修改。


<br/>


## **閉包的實現方式和技巧**
閉包的實現方式和技巧非常多樣，下面是一些常用的方法。

### **在函數內部定義真正要運行的執行函數**
在函數內部定義函數是最基本的實現閉包的方式。這種方式可以實現封裝變數，並且保證變數值在函數調用之間持續存在。
```js
function outer() {
  var count = 0;
  function inner() {
    count++;
    console.log(count);
  }
  return inner;
}
var counter = outer();
counter(); // 1
counter(); // 2
counter(); // 3
```


### **綁定事件的 Callback Function**
有些情境下我們會希望點選不同的按鈕時，會根據每個 button 內容的不同而得到不同的結果。以下為一個使用閉包將三個 button 綁定**同一個 callback function**，但讓三個 button 有不同點擊結果的例子：


```html
<button id="first">First</button>
<button id="second">Second</button>
<button id="third">Third</button>
```

```js
// 建立一個閉包把資料存在這個 function 當中
function saveButtonName(buttonName) {
  // buttonName 被儲存在閉包當中
  var buttonName = buttonName;
  return function () {
    console.log(buttonName);
  };
}

var buttons = document.getElementsByTagName('button');
for (var i = 0; i < buttons.length; i++) {
  var buttonName = buttons[i].innerHTML;
  buttons[i].addEventListener('click', saveButtonName(buttonName));
}
```

在這個情境下，除了使用必保存 **buttonName** 之外，可以用 `let buttonName` 幫我們把 **buttonName** 限縮在 `{ }` 內，就可以避免 buttonName 這個變數暴露在 global environment。





### **使用 IIFE**
`IIFE（Immediately Invoked Function Expression）`是 JavaScript 中一種常見的函數執行方式，它可以讓函數立即執行而不需要額外的調用。IIFE 通常被用於封裝一些私有的變量或函數，以避免它們污染全局命名空間。

`閉包`和 `IIFE` 之間的關係在於，IIFE 可以創建一個閉包，並且在閉包中定義一些私有變量和函數，從而實現信息隱藏和保護。以下是一個簡單的示例：
```js
var counter = (function () {
  var count = 0;
  return {
    increment: function () {
      count++;
      console.log(count);
    },
    reset: function () {
      count = 0;
      console.log(count);
    }
  };
})();

counter.increment(); // 1
counter.increment(); // 2
counter.reset(); // 0
```
在這個示例中，我們使用 `IIFE` 創建了一個閉包，並且在閉包中定義了一個私有變量 count 和兩個公共方法 **increment** 和 **reset**。外部代碼只能訪問這兩個公共方法，而無法直接訪問 count 變量。當我們調用 **increment** 方法時，count 變量的值會增加並輸出到控制台中。同樣地，當我們調用 **reset** 方法時，count 變量的值會被重置為 0。

值得注意的是，**IIFE 和閉包不是完全相同的概念**。閉包是指函數和其相關的引用環境，而 IIFE 則是一種特定的函數調用方式。**但是，IIFE 常常被用於創建閉包，並且在閉包中定義私有變量和函數，因此它們經常一起出現。**


<br/>


## **Reference**

- [閉包](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures) (@MDN)
- [[JS] 深入淺出 JavaScript 閉包（closure）](https://pjchender.dev/javascript/js-closure/) (@PJCHENder)
- [閉包，原來這就是閉包啊！](https://www.casper.tw/development/2020/09/26/js-closure/) (@卡斯伯的 Blog)
- [Day 19 [其他03] 柯里化與反柯里化](https://ithelp.ithome.com.tw/articles/10248416)
