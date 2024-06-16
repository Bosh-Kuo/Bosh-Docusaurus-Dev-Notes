---
title: "剖析JS 「萬物皆物件」的迷思"
slug: js-all-types-object
authors: bosh
description: 透過本文的探討，我們澄清了「萬物皆物件」這一說法的真實含義。JavaScript 中的基本資料類型和物件有著本質的區別，儘管基本資料類型在某些情況下可以表現出物件的行為，但這只是因為 JavaScript 的臨時包裝機制。
keywords: [Javascript, Primitive Types, Wrapper Object, Primitive Wrapper, 萬物皆物件]
tags: [Javascript]
date: 2024-05-30
---

初學 JavaScript 時，偶爾會在教學文或討論區中看到這樣的說法：

> **`「在 JavaScript 中，萬物皆為物件。」`**
> 

便在潛意識中埋下一個 JS 中所有變數都是物件的種子。如今因為工作上大量使用 JS 這個語言，對 JS 這個語言有比較深一點的了解後，便想要回來探討這個議題。

> 先講結論，這個說法是不正確的。
> 

但是，我相信正在看這篇文章的你應該也跟我一樣，會想要了解為什麼訪間會有 **「JavaScript 萬物皆為物件」** 的說法，以及這個說法背後的論點是什麼？反對這個說法的論點是什麼？本篇文章將帶大家探討這個議題，挖掘正反兩方的論點，並釐清一些 JS 的觀念。

<!-- truncate -->


## **為何會有「萬物皆物件」的說法？**

### **JavaScript 的基本資料型別**

在探討 **「萬物皆為物件」** 這個議題之前，我們首先需要了解 JavaScript 中的基本資料型別。JavaScript 中有七種資料型別，Undefined、Null、Boolean、Number、String、Symbol（ES6新增）、Object。其中，前六種是**基本資料型別（Primitive Types）**，而 Object 是**複雜資料型別**。

由此可見，在 JavaScript 的世界中，並非所有的資料型別本質上都是物件。基本資料型別是獨立的，它們並不具備物件的屬性和方法。然而，在某些情況下，基本資料型別也可以表現出類似物件的行為，這正是 **「萬物皆物件」** 這種說法產生的原因之一。

### **「萬物皆物件」說法的起源**

雖然基本資料型別和物件有著明顯的區別，但在實際使用中，我們常常發現基本資料型別可以像物件一樣操作。例如：

```jsx
const a = "123";
console.log(a.__proto__)
/* String {
    anchor: ƒ anchor()
    at: ƒ at()
    big: ƒ big()
    blink: ƒ blink()
    bold: ƒ bold()
    charAt: ƒ charAt()
    charCodeAt: ƒ charCodeAt()
    codePointAt: ƒ codePointAt()
    concat: ƒ concat()
    constructor: ƒ String()
    ...
} */

const b = "456";
console.log(b.substr(1)); // "56"
```

從上述例子中可以看到，變數 a 和 b 雖然是基本資料型別 **String**，但它們都有 `__proto__` 屬性，並且可以調用多種方法。這似乎印證了 **「基本型別也是一種物件」** 的說法。


<br/>


## **「萬物皆物件」說法的誤區**

### **包裝物件(Wrapper Object)**

然而，這種理解其實是不正確的。事實上，這涉及到 JavaScript 中的`包裝物件（Wrapper Object）`機制。當我們對基本資料型別的變數調用方法時，JavaScript 會臨時創建一個對應的**包裝物件，**或稱作**基本型別包裹器 (Primitive Wrapper)**，使其具有物件的行為。例如：

```jsx
const str = "hello";
console.log(str.toUpperCase()); // "HELLO"
```

在這裡，str 是一個字串，但調用 **toUpperCase** 方法時，JavaScript 會臨時創建一個 **String 包裝物件**，使其具有物件的行為。內部運行過程如下：

1. 建立一個 **String** 的實例。
2. 在實例上呼叫指定的方法。
3. 銷毀這個實例。

具體過程如下所示：

```jsx
const tempStr = new String("hello");
const result = tempStr.toUpperCase();
tempStr = null;
console.log(result); // "HELLO"
```

### **驗證包裝物件**

這種包裝物件的機制使得基本資料型別在某些情況下看起來像物件，但實際上它們並不是物件，這只是短暫的包裝過程。這一點可以通過以下例子得到印證：

```jsx
var str1 = "hello";
var str2 = new String("你好");

console.log(str1.__proto__ === str2.__proto__); // true
console.log(str1 instanceof String); // false 
console.log(str2 instanceof String); // true 
```

在這個例子中，str1 在調用 `__proto__` 屬性的瞬間，JavaScript 會用 **new String()** 臨時實例化一個物件，因此在那一瞬間，它們的**建構函式**和**原型(prototype)** 是相同的。但這並不意味著 str1 是一個真正的物件。

這種臨時包裝的特性常常導致開發者誤以為基本資料型別也是物件。因此，我們需要清楚地認識到，JavaScript 中的基本資料型別和物件有本質上的區別，**「萬物皆物件」** 這種說法並不完全準確。


<br/>


## **總結**

### **常見誤解整理**

**誤解一：所有資料型別都是物件**  
事實上，JavaScript 中的基本資料型別（Primitive Types）並不是物件。這些基本資料型別包括：Undefined、Null、Boolean、Number、String、Symbol。它們在本質上與物件不同，雖然在某些情況下會被臨時包裝成物件，但這並不意味著它們本質上是物件。
    
**誤解二：基本資料型別具有物件的方法和屬性**
這個誤解源於 JavaScript 在運行時對基本資料型別的臨時包裝行為。當我們對基本資料型別調用方法時，JavaScript 會臨時創建一個包裝物件，使其具有物件的行為。然而，這只是一個短暫的過程，並不意味著基本資料型別本身具有物件的方法和屬性。
    
**誤解三：所有變數都可以使用 __proto__ 屬性**  
**__proto__** 屬性是用來訪問物件的原型的。在基本資料型別被臨時包裝成物件時，這些變數也可以訪問 **__proto__** 屬性。但這並不意味著基本資料型別本身具有 **__proto__** 屬性，這只是臨時包裝物件的特性。
    

<br/>


## **Reference**

- [**你还认为JS中万物皆对象？**](https://segmentfault.com/a/1190000012037062)
- [**重新認識 JavaScript: Day 23 基本型別包裹器 Primitive Wrapper**](https://ithelp.ithome.com.tw/articles/10193902?sc=iThelpR)