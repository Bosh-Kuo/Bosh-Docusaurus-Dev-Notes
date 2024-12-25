---
title: 一次搞懂 JavaScript 的 this：簡單實用的指南
sidebar_label: this
description: "JavaScript 的 this 總是讓人又愛又恨，為什麼它的值總是變來變去？在這篇文章中，我們將以簡單實用的方式拆解 this 的運作邏輯，從物件方法到箭頭函式、從靜態作用域到動態上下文，幫助你輕鬆掌握 90% 的常見情境。"
last_update:
  date: 2024-12-19
keywords: [JavaScript, this, bind, call, apply]
tags: [Javascript]
---

## **前言**

在 JavaScript 的世界裡，有一個讓新手困惑、讓老手心生畏懼的主題：**`this` 到底是什麼？**

> **「為什麼這個函式裡的 `this` 是 `undefined`？」
「物件的方法好好的，為什麼 `this` 突然變成了 `window`？」
「箭頭函式的 `this` 跟普通函式不一樣？到底要怎麼判斷？」**
> 

如果你曾在開發中遇到這樣的問題，我想對你說：你並不孤單😿

雖然網路上已經有很多介紹 `this` 的文章，我可能也不會寫得比其他文章還深入，但我還是想要以我目前對 `this` 的理解程度，站在我的視角，來分享我是如何理解 `this` 的。當然，這篇文章不會「完全」解釋所有 `this` 的邏輯，畢竟要徹底理解它，你還得翻開 ECMAScript 規範才行。但我保證，這篇文章能夠幫助你在大多數情況下快速判斷 `this`，甚至對 this 有更深一層的認識。

:::note
這篇文章適合 **對 JavaScript 有一定基礎** 的開發者。文章內容將會包括：

1. JavaScript 的 **基本語法**（如物件、函式、`class` 等）。
2. JavaScript 的 **作用域** 和 **閉包** 是什麼（沒關係，這裡也會簡單提到）。

如果這些你還不太熟悉，建議先補充相關知識，否則讀到後面你可能會更加混亂。
:::


<br/>


## **為什麼 JS 的 this 這麼難懂？**

其實，JavaScript 的 `this` 之所以讓人困惑，是因為它和其他物件導向語言的 `this` 有所不同：

- **它可以脫離物件被呼叫**。
- **它可以被手動改變 `this` 的指向（例如 `call`、`apply` 和 `bind`）**。
- **它還有箭頭函式這種特殊存在，會繼承外部作用域的 `this`。**

JavaScript 的 `this` 最大的特點在於：

> **`this` 的值並不是在「函式定義時」決定的，而是在「函式執行時」根據呼叫方式動態決定的。**
> 

這種彈性雖然賦予了 JavaScript 很大的自由度，但也讓 `this` 變得複雜且容易出錯。


<br/>


## **`this` 的本質：物件導向的延伸**

在大多數物件導向語言中，`this` 從來都不是什麼難懂的概念。它的存在非常單純：**它代表當前實例（instance）本身**，方便在類別內存取物件的屬性或方法。但在 JavaScript 裡面，好像並沒有這麼單純。

### **物件導向語言裡的 `this`**

我們先來看看一個簡單的例子：

```js
class Car {
  setName(name) {
    this.name = name; // this 指向當前的實例
  }

  getName() {
    return this.name;
  }
}

const myCar = new Car();
myCar.setName('Tesla');
console.log(myCar.getName()); // Tesla
```

在這段程式碼中，`this` 的存在是必需的，因為我們需要一個方式來指代**當前物件的屬性或方法**。

- `this.name = name`：表示把傳進來的 `name` 設定到**當前實例** 的 `name` 屬性上。
- `myCar.setName('Tesla')` 呼叫時，`this` 指向 `myCar`，所以 `this.name` 實際上是 `myCar.name`。

這種寫法在物件導向語言中是非常直觀的，因為 `this` 就是物件自己的「代名詞」。

### **脫離物件導向的 `this`**

然而，在 JavaScript 中，`this` 並不局限於物件或類別內，它可以出現在任何地方！

- **在函式中**，`this` 可能是全域物件（`window` 或 `global`）。
- **在事件處理函式中**，`this` 指向觸發事件的元素。
- **在 `setTimeout`、箭頭函式等情境下**，`this` 的行為又不一樣了。

我們來看一個例子：

```js
function hello() {
  console.log(this);
}

hello();
```

*你覺得這裡的 `this` 是什麼？*

在其他語言中，這段程式碼可能根本不成立，因為 `this` 只有在類別或物件內才有意義。但在 JavaScript 裡，`this` 會根據執行環境給出一個預設值：

1. **非嚴格模式**：`this` 指向 **全域物件**（瀏覽器中是 `window`，Node.js 是 `global`）。
2. **嚴格模式**：`this` 是 `undefined`。

```js
"use strict";
function hello() {
  console.log(this);
}

hello(); // undefined
```

:::tip **結論:**
**當 `this` 脫離物件，並單純存在於一般函式中時，它其實沒有什麼太大的意義，僅僅是語言機制給了一個預設值罷了。**
(引用自 [**@淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂**](https://blog.techbridge.cc/2019/02/23/javascript-this/))：
:::


<br/>


## **`this`的指向規則**

前面我們有提到，在 JavaScript 中，`this` 的值**不是在函式定義時決定的**，而是根據 **「函式執行時的呼叫方式」** 動態決定的，這是理解 `this` 的核心關鍵。在判斷 this 值時，我們需要時刻記住一個核心原則：
> **要看 `this`，就看「誰，在哪裡呼叫了這個函式」**

### **全域環境中的 `this`**

我們先從最簡單的情況開始：在全域環境中 `this` 的值是什麼？

**範例：**

```js
console.log(this);
```

**結果：**

1. **瀏覽器環境**：`this` 指向 `window` 物件。
2. **Node.js 環境**：`this` 指向 `global` 物件（模組作用域則是 `{}`）。

### **一般函式中的 `this`**

當函式**不是物件方法**，而是單獨呼叫時，`this` 的值取決於是否處於「嚴格模式」。

**範例：**

```js
function hello() {
  console.log(this);
}

hello(); // 非嚴格模式
```

**結果：**

1. **非嚴格模式**：`this` 指向全域物件（`window` 或 `global`）。
2. **嚴格模式**：`this` 是 `undefined`。

**嚴格模式範例：**

```js
"use strict";

function hello() {
  console.log(this);
}

hello(); // undefined
```

> 小結：普通函式中的 this 取決於是否嚴格模式。如果脫離物件，this 基本上沒有意義，只會回傳預設值。
> 

### **物件方法中的 `this`**

當函式作為「物件的方法」被呼叫時，`this` 指向呼叫該方法的物件。

**範例：**

```js
const obj = {
  name: 'Alice',
  sayName() {
    console.log(this.name);
  }
};

obj.sayName();
```

**結果：**

- `this` 指向 `obj`，因此輸出 `Alice`。

### **箭頭函式中的 `this`**

箭頭函式是個特例，它**不會產生自己的 `this`**，而是繼承自定義時的外部作用域。

**範例：**

```js
const obj = {
  name: 'Alice',
  sayName() {
    const arrowFunc = () => {
      console.log(this.name);
    };
    arrowFunc();
  }
};

obj.sayName();
```

**結果：**

- `this` 繼承自 `sayName` 方法中的 `this`，也就是 `obj`，所以輸出 `Alice`。

> 小結：箭頭函式的 this 是靜態的，取決於它被「定義時」所在的作用域。
> 

### **setTimeout 中的 `this`**

在 `setTimeout` 中，回呼函式的 `this` 取決於它是**普通函式**還是**箭頭函式**。

**範例：**

```js
const obj = {
  name: 'Alice',
  sayName() {
    setTimeout(function() {
      console.log(this.name);
    }, 1000);
  }
};

obj.sayName();
```

**結果：**

- 由於回呼函式是普通函式，`this` 在非嚴格模式下會指向 `window`，輸出 `undefined`。

**解決方法：使用箭頭函式**：

```js
setTimeout(() => {
  console.log(this.name);
}, 1000);
```

- 箭頭函式會繼承 `sayName` 中的 `this`，所以輸出 `Alice`。

### **事件處理中的 `this`**

當函式用作 DOM 事件處理時，`this` 指向觸發事件的元素。

**範例：**

```js
const button = document.createElement('button');
button.innerText = 'Click me';

button.addEventListener('click', function() {
  console.log(this); // 指向觸發事件的元素
});

document.body.appendChild(button);
```

**結果：**

- `this` 指向 `button` 元素。

如果改成箭頭函式呢？

```js
button.addEventListener('click', () => {
  console.log(this);
});
```

- 箭頭函式會繼承定義時的 `this`，在這裡指向全域物件（`window`）。


<br/>


## **改變 `this` 的方法：`call`、`apply` 和 `bind`**

有時候我們不滿意 JavaScript 預設的 `this` 指向，這時候可以透過 **`call`**、**`apply`** 和 **`bind`** 來手動改變 `this` 的值。

### **為什麼要改變 `this`？**

我們先看一個常見的問題：

```js
const obj = {
  value: 42,
  getValue() {
    console.log(this.value);
  }
};

const extracted = obj.getValue;
extracted(); // undefined
```

> *為什麼印出來的是 undefined ？看得出來問題出在哪嗎？*

這是因為，當我們把 `obj.getValue` 提取出來後，它成為了一個獨立函式。由於這個函式**不是透過物件呼叫的**，`this` 指向了全域物件（非嚴格模式下是 `window`）。

這時候我們可以使用 **`call`**、**`apply`** 或 **`bind`** 來手動指定 `this`。

- `call`、`apply`皆回傳 function 執行結果
- `bind` 方法回傳的則是綁定 this 後的**原函數**

### **`call()` 方法**

**語法：**

`function.call(this, arg1, arg2..., argn)`

- `thisArg`：指定 `this` 的值。
- `arg1, arg2, ...`：傳給函式的參數，依序傳遞。

**範例：**

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); // Hello, Alice!
```

- 在這裡，`call` 強制將 `this` 指向 `person`，並立即執行 `greet` 函式。

### **`apply()` 方法**

**語法：**

`function.apply(this, [arg1, arg2..., argn])`

- `thisArg`：指定 `this` 的值。
- `[argsArray]`：參數以**陣列**的形式傳入。

**範例：**

```js
greet.apply(person, ['Hi', '!']); // Hi, Alice!
```

- **差異點**：`apply` 和 `call` 唯一的區別在於參數的傳遞方式。`call` 用逗號分隔，`apply` 則使用陣列。

### **`bind()` 方法**

**語法：**

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

- `thisArg`：指定 `this` 的值。
- `arg1, arg2, ...`：可以預設一些參數（可選）。

**範例：**

```js
const boundGreet = greet.bind(person, 'Hey');
boundGreet('!'); // Hey, Alice!
```

- `bind` 創造一個函式物件的**拷貝**，這個拷貝函式的 `this` 會永遠被綁定成 `thisArg`，即使後續我們再用 `call` 或再次 `bind`，也無法改變一開始被綁定的 `this`。
- `bind` 後面傳入的參數值也會設定為拷貝函式的永久參數值，之後執行拷貝函式時，無論怎麼給予參數都沒有用

### **其他應用場景**

以下我們多看幾個手動改變 `this` 值的應用場景：

1. **解決事件處理中的 `this` 問題**
    
    ```js
    const obj = {
      value: 'Hello',
      showValue() {
        console.log(this.value);
      }
    };
    
    const button = document.createElement('button');
    button.innerText = 'Click me';
    
    // 事件處理中的 this 會指向觸發事件的元素
    button.addEventListener('click', obj.showValue); // undefined
    
    // 解決方法：用 bind 綁定 this
    button.addEventListener('click', obj.showValue.bind(obj)); // Hello
    document.body.appendChild(button);
    ```
    
2. **預設參數：偏函數應用**
    
    ```js
    function multiply(a, b) {
      return a * b;
    }
    
    const double = multiply.bind(null, 2); // 預設 a = 2
    console.log(double(5)); // 10
    ```


<br/>


## **判斷 `this` 的小技巧：轉成 `call` 形式**

前面我們有提到，this 的值取決於函式「怎麽」被呼叫。這裡我想介紹一個我在 [**@淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂**](https://blog.techbridge.cc/2019/02/23/javascript-this/) 中學到的很簡易的判斷法：把 **函式呼叫的形式轉成 `call`**。

我們之前提過 `call`的第一個參數就是用來指定 `this` 的值。因此如果一個函式是以 `call` 來呼教，本質上就是顯式地告訴你 `this` 是什麼。

### **怎麼轉成 `call`？**

這個方法的規則很簡單：*把你在呼叫 function 以前那一串東西直接作為 call 的第一個參數。*

我們以下面這個例子來說明：

```js
const obj = {
  value: 1,
  hello() {
    console.log(this.value);
  }
};

const hey = obj.hello;

obj.hello(); // 1, 等價於 obj.hello.call(obj)
hey();       // undefined, 等價於 hey.call(undefined)（非嚴格模式下指向 window）
```

接著我們來看個更複雜的例子：

```js
const obj = {
  value: 1,
  hello() {
    console.log(this.value);
  },
  inner: {
    value: 2,
    hello() {
      console.log(this.value);
    }
  }
};

const obj2 = obj.inner;
const hello = obj.inner.hello;

obj.inner.hello(); // 2, 等價於 obj.inner.hello.call(obj.inner)
obj2.hello();      // 2, 等價於 obj2.hello().call(obj2)
hello();           // undefined, 等價於 hello.call(undefined)（非嚴格模式下指向 window）
```


<br/>


## **結語**

聊到這裡，我們應該對 JavaScript 的 `this` 有了一個比較完整的理解。說真的，一開始接觸 `this` 時，我也覺得它讓人抓狂，總是搞不清楚到底指的是誰。但在一次次踩坑、一篇篇文章的幫助下，我慢慢明白了：其實，`this` 並沒有那麼複雜，它只是需要換個角度去理解。希望這篇文章能幫助你更輕鬆地理解 `this` 。如果未來的某一天，你看到一段和 `this` 有關的程式碼，能自信地解釋它的行為，那這篇文章的目的就達到了！