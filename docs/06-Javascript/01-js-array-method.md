---
title: "JavaScript Array 常用操作大補帖"
sidebar_label: "陣列(Array)"
description: Array 是 JS 中最常用的資料結構之一，本筆記提供了對 JavaScript 陣列方法的詳細解說和實用範例，包括排序、篩選、映射、迭代等常見操作。無論你是初學者還是有經驗的開發人員，這份筆記都能幫助你深入理解和運用 JavaScript 陣列方法。
last_update:
  date: 2023-05-21
keywords:
  - Javascript
  - Array
tags:
  - Javascript
---

:::note
Array 是 JS 中最常用的資料結構之一。本篇文章整理 JS 中常見的 Array methods，以便忘記語法時快速查詢。
:::


## **新增與移除方法**

### **`push()` - 在陣列末端添加一個或多個元素，並返回陣列的新長度**

- 範例：

```jsx
const animals = ['pigs', 'goats', 'sheep'];
const count = animals.push('cows');
console.log(count);
// Expected output: 4
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows"]
```

- 語法：

```jsx
arr.push(element1[, ...[, elementN]])
```

- 回傳值：呼叫此方法之物件的新 `length` 屬性值。

### **`pop()` - 從陣列末端移除最後一個元素並返回該元素的值**

- 範例：

```jsx
const animals = ['pigs', 'goats', 'sheep', 'cows'];
const lastAnimal = animals.pop();
console.log(lastAnimal);
// 預期輸出: "cows"
console.log(animals);
// 預期輸出: Array ["pigs", "goats", "sheep"]
```

- 語法：

```jsx
arr.pop()
```

- 回傳值：被移除的元素值，若陣列為空則為 undefined。

### **`shift()` - 從陣列開頭移除第一個元素並返回該元素的值**

- 範例：

```jsx
const animals = ['pigs', 'goats', 'sheep'];
const firstAnimal = animals.shift();
console.log(firstAnimal);
// 預期輸出: "pigs"
console.log(animals);
// 預期輸出: Array ["goats", "sheep"]
```

- 語法：

```jsx
arr.shift()
```

- 回傳值：被移除的元素值，若陣列為空則為 undefined。

### **`unshift()` - 在陣列開頭添加一個或多個元素，並返回陣列的新長度**

- 範例：

```jsx
const animals = ['pigs', 'goats', 'sheep'];
const count = animals.unshift('cows');
console.log(count);
// 預期輸出: 4
console.log(animals);
// 預期輸出: Array ["cows", "pigs", "goats", "sheep"]
```

- 語法：

```jsx
arr.unshift(element1[, ...[, elementN]])
```

- 回傳值：呼叫此方法之陣列的新 `length` 屬性值。

### **`splice()` - 在指定位置插入或移除元素並返回被移除的元素**

- 範例：

```jsx
const months = ['January', 'February', 'March', 'April', 'May'];
const removedMonths = months.splice(2, 2, 'June', 'July');
console.log(removedMonths);
// 預期輸出: Array ["March", "April"]
console.log(months);
// 預期輸出: Array ["January", "February", "June", "July", "May"]
```

- 語法：

```jsx
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

- 回傳值：包含被移除元素的陣列。如果沒有移除任何元素，則返回空陣列。


<br/>


## **存取方法**

### **`indexOf()` - 回傳指定元素在陣列中第一個出現的索引，若不存在則回傳 -1**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange', 'apple'];
console.log(fruits.indexOf('apple'));
// 預期輸出: 0
console.log(fruits.indexOf('grape'));
// 預期輸出: -1
```

- 語法：

```jsx
arr.indexOf(searchElement[, fromIndex])
```

- 回傳值：指定元素的索引值，若不存在則回傳 -1。

### **`slice()` - 回傳指定範圍的陣列元素組成的新陣列**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange', 'grape', 'kiwi'];
const slicedFruits = fruits.slice(1, 4);
console.log(slicedFruits);
// 預期輸出: Array ["banana", "orange", "grape"]
console.log(fruits);
// 預期輸出: Array ["apple", "banana", "orange", "grape", "kiwi"]
```

- 語法：

```jsx
arr.slice([begin[, end]])
```

- 回傳值：一個包含提取之元素的新陣列。


<br/>


## **遍歷與迭代方法**

### **`forEach()` - 迭代陣列並執行指定操作**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
numbers.forEach((number) => {
  console.log(number * 2);
});
// 預期輸出:
// 2
// 4
// 6
// 8
// 10
```

- 語法：

```jsx
arr.forEach(function callback(currentValue[, index[, array]]) {
    //your iterator
}[, thisArg]);
```

- 回傳值：undefined。forEach() 方法是用來遍歷陣列，並對每個元素執行指定的回調函式，但並不會返回新的陣列。


<br/>


## **搜尋方法**

### **`filter()` - 回傳符合條件的元素組成的新陣列**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter((number) => {
  return number % 2 === 0;
});
console.log(evenNumbers);
// 預期輸出: Array [2, 4]
```

- 語法：

```jsx
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：一個新的陣列，包含符合條件的元素。

### **`find()` - 回傳第一個符合條件的元素**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange'];
const foundFruit = fruits.find((fruit) => {
  return fruit === 'banana';
});
console.log(foundFruit);
// 預期輸出: "banana"
```

- 語法：

```jsx
arr.find(callback[, thisArg])
```

- 回傳值：第一個符合條件的元素，若找不到則回傳 undefined。

### **`findLast()` - 回傳最後一個符合條件的元素**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const lastEvenNumber = numbers.findLast((number) => {
  return number % 2 === 0;
});
console.log(lastEvenNumber);
// 預期輸出: 4
```

- 語法：

```jsx
arr.findLast(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：最後一個符合條件的元素，若找不到則回傳 undefined。

### **`findIndex()` - 回傳第一個符合條件的元素索引**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const evenIndex = numbers.findIndex((number) => {
  return number % 2 === 0;
});
console.log(evenIndex);
// 預期輸出: 1
```

- 語法：

```jsx
arr.findLast(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：第一個符合條件的元素索引，若找不到則回傳 -1。

### **`findLastIndex()` - 回傳最後一個符合條件的元素索引**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const lastEvenIndex = numbers.findLastIndex((number) => {
  return number % 2 === 0;
});
console.log(lastEvenIndex);
// 預期輸出: 3
```

- 語法：

```jsx
arr.findLastIndex(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：最後一個符合條件的元素索引，若找不到則回傳 -1。

### **`includes()` - 判斷陣列是否包含指定元素，回傳布林值。**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange'];
const hasBanana = fruits.includes('banana');
console.log(hasBanana);
// 預期輸出: true
```

- 語法：

```jsx
arr.includes(searchElement[, fromIndex])
```

- 回傳值：若陣列中包含指定元素則回傳 true，否則回傳 false。

### **`every()` - 判斷陣列中所有元素是否符合條件，回傳布林值。**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const allEven = numbers.every((number) => {
  return number % 2 === 0;
});
console.log(allEven);
// 預期輸出: false
```

- 語法：

```jsx
arr.every(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：若陣列中所有元素都符合條件則回傳 true，否則回傳 false。

### **`some()` - 判斷陣列中是否存在符合條件的元素，回傳布林值**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some((number) => {
  return number % 2 === 0;
});
console.log(hasEven);
// 預期輸出: true
```

- 語法：

```jsx
arr.some(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：若陣列中至少有一個元素符合條件則回傳 true，否則回傳 false。


<br/>


## **排序與反轉方法**

### **`sort()` - 對陣列元素進行排序**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange', 'grape'];
fruits.sort();
console.log(fruits);
// 預期輸出: ["apple", "banana", "grape", "orange"]
```

- 語法：

```jsx
arr.sort([compareFunction])
```

- 回傳值：原地排序後的陣列。

### **`reverse()` - 反轉陣列元素的順序**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
numbers.reverse();
console.log(numbers);
// 預期輸出: [5, 4, 3, 2, 1]
```

- 語法：

```jsx
arr.reverse()
```

- 回傳值：反轉後的陣列。


<br/>


## **轉換方法**

### **`join()` - 將陣列元素連接為字串**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange'];
const joinedString = fruits.join(', ');
console.log(joinedString);
// 預期輸出: "apple, banana, orange"
```

- 語法：

```jsx
arr.join(separator)
```

- 回傳值：一個合併所有陣列元素的字串。假如 `arr.length` 為 `0`，將回傳空字串。

### **`map()` - 透過指定的函式對陣列的每個元素進行轉換**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map(num => num * 2);
console.log(doubledNumbers);
// 預期輸出: [2, 4, 6, 8, 10]
```

- 語法：

```jsx
arr.map(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：一個所有元素皆為回呼函式運算結果的新陣列。

### **`with()` - 修改指定索引值並返回新陣列**

- 範例：

```jsx
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6)); // [1, 2, 6, 4, 5]
console.log(arr); // [1, 2, 3, 4, 5]
```

- 語法：

```jsx
array.with(index, value)
```

- 回傳值：一個全新的陣列，其中 `index` 索引處的元素被替換為 `value`。

### **`toString()` - 將陣列轉換為字串**

- 範例：

```jsx
const fruits = ['apple', 'banana', 'orange'];
const fruitsString = fruits.toString();
console.log(fruitsString);
// 預期輸出: "apple,banana,orange"
```

- 語法：

```jsx
arr.toString()
```

- 回傳值：一個表達該陣列及該陣列中元素的字串。

### **`concat()` - 合併多個陣列為一個陣列**

- 範例：

```jsx
const fruits = ['apple', 'banana'];
const moreFruits = ['orange', 'grape'];
const allFruits = fruits.concat(moreFruits);
console.log(allFruits);
// 預期輸出: ["apple", "banana", "orange", "grape"]
```

- 語法：

```jsx
arr.concat(value1[, value2[, ...[, valueN]]])
```

- 回傳值：合併後的新陣列。

### **`flat()` - 以遞迴方式將特定深度的子陣列展平成為一新的陣列**

- 範例：

```jsx
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

- 語法：

```jsx
var newArray = arr.flat([depth]);
```

- 回傳值：函數將會回傳一個由原先陣列的子陣列串接而成的新陣列。

### **`flatMap()` - 對陣列的每個元素執行映射，然後將結果展平成一個新陣列**

- 範例：

```jsx
const numbers = [1, 2, 3, 4, 5];
const squaredAndDoubledNumbers = numbers.flatMap(num => [num ** 2, num * 2]);
console.log(squaredAndDoubledNumbers);
// 預期輸出: [1, 2, 4, 4, 9, 6, 16, 8, 25, 10]
```

- 語法：

```jsx
arr.flatMap(callback(element[, index[, array]])[, thisArg])
```

- 回傳值：展平後的新陣列。

### **`from()` - 將類陣列或可迭代物件轉換為陣列**

- 範例：

```jsx
const string = 'hello';
const stringArray = Array.from(string);
console.log(stringArray);
// 預期輸出: ["h", "e", "l", "l", "o"]
```

- 語法：

```jsx
Array.from(arrayLike[, mapFn[, thisArg]])
```

- 回傳值：轉換後的新陣列。

### **`of()` - 根據提供的引數創建一個新陣列**

- 範例：

```jsx
const numbersArray = Array.of(1, 2, 3, 4, 5);
console.log(numbersArray);
// 預期輸出: [1, 2, 3, 4, 5]
```

- 語法：

```jsx
Array.of(element0, element1, /* … ,*/ elementN)
```

- 回傳值：包含參數的新陣列。


<br/>


## **陣列迭代器方法**

### **`entries()` - 回傳一個陣列迭代器，包含索引與元素**

- 範例：

```jsx
const array = ['a', 'b', 'c'];
const iterator = array.entries();

for (const [index, value] of iterator) {
  console.log(index, value);
}
// 預期輸出： 0 a
//          1 b
//          2 c
```

- 語法：

```jsx
array.entries()
```

- 回傳值：回傳一個新的陣列迭代器物件，該物件包含索引/值對的鍵/值對。

### **`keys()` - 回傳一個陣列迭代器，包含索引**

- 範例：

```jsx
const array = ['a', 'b', 'c'];
const iterator = array.keys();

for (const index of iterator) {
  console.log(index);
}
// 預期輸出： 0
//          1
//          2
```

- 語法：

```jsx
array.keys()
```

- 回傳值：回傳一個新的陣列迭代器物件，該物件包含陣列的索引。

### **`values()` - 回傳一個陣列迭代器，包含元素**

- 範例：

```jsx
const array = ['a', 'b', 'c'];
const iterator = array.values();

for (const value of iterator) {
  console.log(value);
}
// 預期輸出： 'a'
//          'b'
//          'c'
```

- 語法：

```jsx
array.values()
```

- 回傳值：回傳一個新的陣列迭代器物件，該物件包含陣列的值。


<br/>


## **其他常用方法**

### **`fill()` - 將陣列中索引的第一個到最後一個的每個位置填入指定值**

- 範例：

```jsx
const array = [1, 2, 3, 4, 5];
array.fill(0, 2, 4);
console.log(array);
// 預期輸出： [1, 2, 0, 0, 5]
```

- 語法：

```jsx
array.fill(value, start, end)
```

- 回傳值：修改後的陣列。

### **`reduce()` - 對陣列元素進行累加計算**

- 範例：

```jsx
const array = [1, 2, 3, 4, 5];
const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum);
// 預期輸出： 15
```

- 語法：

```jsx
array.reduce(callback, initialValue)
```

- 回傳值：回傳最後一次回呼函式的結果，或是初始值（如果有提供初始值）。

### **`reduceRight()` - 從右至左對陣列元素進行累加計算**

- 範例：

```jsx
const array = ['a', 'b', 'c'];
const concatenatedString = array.reduceRight((accumulator, currentValue) => accumulator + currentValue);
console.log(concatenatedString);
// 預期輸出： 'cba'
```

- 語法：

```jsx
array.reduceRight(callback, initialValue)
```

- 回傳值：回傳最後一次回呼函式的結果，或是初始值（如果有提供初始值）。


<br/>


## **Reference**
- **[Array methods](https://javascript.info/array-methods#most-methods-support-thisarg) (@JAVASCRIPT.INFO)**
- **[数组的扩展](https://es6.ruanyifeng.com/#docs/array) (@ECMAScript 6 入门)**