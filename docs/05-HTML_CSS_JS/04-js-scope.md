---
title: Javascript 的作用域(Scope)
sidebar_label: "[JS] 作用域(Scope)"
description: 本篇為紀錄 JS 的 Scope 分級用法以及常見錯誤
last_update:
  date: 2023-03-19
keywords:
  - Javascript
  - Scope
  - ES6
tags:
  - Javascript
---


## **什麼是 Scope?**
Scope 是定義變數的可見性或作用域的範圍，它確定了變數在哪裡可以被訪問或使用。在 JavaScript 中，作用域分為`全域作用域(Global Scope)`和`函式作用域(Function Scope)`，以及由 let 和 const 創建的`區塊作用域(Block Scope)`。


<br/>


## **Global Scope**
在 JavaScript 中，所有在函式外部宣告的變數都屬於全域作用域。這意味著這些變數可以在程式碼的任何位置被訪問和使用。例如：
```js
var message = "Hello, world!";

function showMessage() {
  console.log(message);
}

showMessage(); // "Hello, world!"
```

這裡的 **message** 變數宣告在函式之外，因此它是一個全域變數，可以在任何地方使用。


<br/>


## **Function Scope**
在 JavaScript 中，每當定義一個函式時，都會創建一個新的函式作用域。在函式中宣告的變數只能在函式內部使用，不能在函式外部訪問。例如：

```js
function showMessage() {
  var message = "Hello, world!";
  console.log(message);
}

showMessage(); // "Hello, world!"
console.log(message); // ReferenceError: message is not defined
```

在這裡， **message** 變數是在函式中宣告的，它只能在該函式內部使用，如果在函式之外嘗試訪問它，則會出現引用錯誤。


<br/>


## **Block Scope**
在 ES6 中，可以使用 let 和 const 關鍵字來宣告區塊作用域的變數。區塊是指花括號 {} 中的任何程式碼區域，例如 if 語句或 for 循環。這意味著變數的可見範圍僅限於宣告該變數的區塊內。例如：

```js
if (true) {
  let x = 1;
  const y = 2;
  var z = 3;
  console.log(x, y, z); // 1 2 3
}

console.log(x, y, z); // ReferenceError: x is not defined, ReferenceError: y is not defined, 3
```

在上述範例中，x 和 y 僅存在於 if 區塊內部，因此在區塊外部無法存取。而 z 則是使用 var 宣告的變數，其作用域為 Function Scope，因此可以在區塊外部存取。

:::tip
很多人常常搞混 `var` 的變數範圍，以為 `var` 可以在 { } 外存取所以 `var` 是全域變數，但實際上 var 的作用範圍是 function scope，若在一個函數內使用 `var` 宣告變數，是沒辦法在其他函數使用的。

:::


<br/>


## **常見的使用錯誤**
### **在未宣告變數時賦值**
```js
function myFunction() {
  x = 1;
  console.log(x);
}

myFunction(); // 1
console.log(x); // 1

```

在上述範例中，變數 `x` 並沒有使用 `var` `let` 或 `const`等方式宣告，因此它會自動被建立為全域變數。這會造成許多問題，因為全域變數會對整個應用程式產生影響，也可能會被其他函式意外修改到。


### **變數提升(Hoisting)**
JavaScript 具有`變數提升(Hoisting)`的特性，即在一個作用域中宣告的變數，無論宣告的位置在哪裡，都會被提升至作用域頂部，且可以在宣告之前被使用，但若在被使用前未被賦值，其職將為 `undefined`。
```js
console.log(a); // undefined
var a = 1;
```









<br/>

## **Reference**
- [JavaScript 進階 - 什麼是閉包？探討 Closure & Scope Chain](https://hackmd.io/@Heidi-Liu/note-js201-closure)
- [你懂 JavaScript 嗎？#12 函式範疇與區塊範疇（Function vs Block Scope）](https://www.cythilya.tw/2018/10/19/function-vs-block-scope/)




