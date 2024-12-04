---
title: 箭頭函數(Arrow Function)
sidebar_label: "箭頭函數(Arrow Function)"
description: 本篇紀錄 Arrow function 的用法與常見常見誤用
last_update:
  date: 2023-03-19
keywords:
  - Javascript
  - Arrow Function
  - ES6
tags:
  - Javascript
---


箭頭函數是 ES6 中新增的一種函數形式，它是一個簡潔、精簡的語法，可以幫助我們更方便地定義函數。

## **基本語法**

箭頭函數的基本語法如下：

```jsx
// 無參數的箭頭函數
const func1 = () => {
  // 函數體
}

// 單參數的箭頭函數
const func2 = x => {
  // 函數體
}

// 多參數的箭頭函數
const func3 = (x, y) => {
  // 函數體
}
```

## **特點**

### **1. 簡潔**

箭頭函數可以讓我們用更簡潔的語法來定義函數，不需要再寫 `function` 關鍵字和花括號。

### **2. 隱式返回值**

當函數只有一條語句時，箭頭函數可以省略花括號和 `return` 關鍵字，自動返回該語句的結果。

```jsx
// 傳統函數
function add(x, y) {
  return x + y;
}

// 箭頭函數
const add = (x, y) => x + y;
```

### **3. 靜態綁定 `this`**

箭頭函式中的 this 指向為宣告時的作用域內 this 指向，不會像傳統函式一樣因為呼叫方式的不同而改變 this 指向。

```jsx
const person = {
  name: 'Alice',
  age: 20,
  sayHi: function () {
    console.log(`Hi, my name is ${this.name}.`);
  },
  sayHiArrow: () => {
    console.log(`Hi, my name is ${this.name}.`);
  },
};
person.sayHi(); // Hi, my name is Alice.
person.sayHiArrow(); // Hi, my name is undefined.\
```
在這個例子中，sayHiArrow 的 `this` 指向的是定義時的作用域，也就是全域物件 (global object)。因此，在箭頭函式內部的 this.name 會回傳 **undefined**。

## **注意事項**

除了上面提到的 **this** 以外，箭頭函數還有一些注意事項需要特別注意：

1. 箭頭函數不能用作 **constructor**（建構函數），不能使用 `new` 關鍵字呼叫，否則會拋出錯誤。
2. 箭頭函數不能被運用在 `call、apply、bind` 中，因為箭頭函數沒有自己的 this，這些方法改變 this 的方式在箭頭函數中是無效的。
3. 在箭頭函數中，不可以使用 `arguments`，`arguments` 關鍵字被繫結到父級函數的 `arguments` object中，而不是繫結到箭頭函數本身的 arguments 中，如果要用，可以用 `rest` 參數代替。。
4. 在箭頭函數中，不能使用 `yield` 關鍵字，因為箭頭函數是沒有自己的 `this` 和 `arguments` 的，所以不能作為 `generator` 函數使用。

## **箭頭函數常見的誤用**

箭頭函數的誤用主要是跟 `this` 的誤解有關，以下是幾個常見的誤用：

### **1. 將箭頭函數用在需要 `this` 指向物件本身的場景**

```jsx
const obj = {
  name: "John",
  greet: () => console.log(`Hello, ${this.name}!`)
}

obj.greet(); // Hello, undefined!
```

正確的方式是使用傳統的函數宣告方式，讓 `this` 指向物件本身：

```jsx
const obj = {
  name: "John",
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}

obj.greet(); // Hello, John!
```

### **2. 將箭頭函數用在需要繫結到 `this` 的事件監聽器上**
例如，假設我們有一個按鈕，當使用者點擊按鈕時，我們想要顯示按鈕的文本內容。
```js
const button = document.querySelector('button');

// 建立 function 時 this 指 Window
const arrowfn = () => {
  console.log(this.textContent); 
};

// 執行 function 時 this 指全域物件 Window，所以 this.textContent 為 undefined
button.addEventListener('click', arrowfn);
```
由於箭頭函數的 `this` 綁定是靜態的，不會隨著函數呼叫時的語境而改變，因此在這個例子中，箭頭函數定義在全域作用域中，所以 `this` 會綁定到**全域物件 Window**，當事件觸發執行的這個函數時 this 仍然是指向**全域物件 Window**。



```js
const button = document.querySelector('button');

const fn = function(){
  console.log(this.textContent);
};
// 執行 function 時 this 指向 HTMLButtonElement，所以可以獲取到按鈕的文本內容
button.addEventListener('click', fn);
```

**addEventListener** 會在整個 execution context 執行結束後在觸發事件時才執行。因此不論在傳統的函式寫法 fn 或箭頭函式 arrowFn 的寫法，一開始建立 function 的時候 this 所指稱的都是**全域物件 Window**。如果是使用傳統的寫法，在觸發這個事件時所指稱的對象會從原本的 Window 物件變成 HTMLButtonElement。





### **3. 將箭頭函數用在需要動態繫結 `this` 的場景**

由於箭頭函數的 `this` 繫結是靜態的，因此無法透過 `call`、`apply` 或 `bind` 來動態繫結。

```jsx
const obj1 = {
  name: "John",
  greet: () => console.log(`Hello, ${this.name}!`)
}

const obj2 = {
  name: "Mary"
}

obj1.greet.call(obj2); // Hello, undefined!
```

正確的方式是使用傳統的函數宣告方式，然後使用 `call`、`apply` 或 `bind` 來動態繫結 `this`：

```jsx
const obj1 = {
  name: "John",
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
}

const obj2 = {
  name: "Mary"
}

obj1.greet.call(obj2); // Hello, Mary!
```


### **4. 在物件中以箭頭函數定義成員函數時使用 `this` 呼叫物件成員變數** 
```js
globalThis.s = 21;

const obj = {
  s: 42,
  m: () => console.log(this.s)
};

obj.m() // 21
```

JS 引擎的處理方法會先在全局空間產生這個箭頭函數，然後賦值給 `obj.m`，這導致箭頭函數內部的 `this` 指向全局物件，實際上等同於下列程式碼：

```js
globalThis.s = 21;
globalThis.m = () => console.log(this.s);

const obj = {
  s: 42,
  m: globalThis.m
};

obj.m() // 21
```






## **Reference**

- **[箭头函数](https://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0) (@[ECMAScript 6 入门](https://es6.ruanyifeng.com/))**
- **[[JS] 箭頭函式（arrow function）和它對 this 的影響](https://pjchender.dev/javascript/js-arrow-function/) (@PJCHENder)**