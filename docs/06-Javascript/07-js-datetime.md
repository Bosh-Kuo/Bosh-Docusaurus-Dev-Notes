---
title: "JS 日期與時間重點整理"
sidebar_label: "日期與時間(Date)"
description: "本篇文章深入探討了 JavaScript 中日期與時間的處理，包括介紹ISO 8601, RFC2822 等標準時間格式，與建立 Date 物件的四種方法，以及如何使用 Date 物件進行格式轉換，並提供了具體的實務案例來幫助開發者應對常見的時間處理"
last_update:
  date: 2024-09-08
keywords:
  - Javascript
  - Date
  - ISO 8601
  - RFC 2822
  - UTC
  - Unix
tags:
  - Javascript
---

> **前情提要：**  
> 由於我過去比較少接觸到時間與日期相關的功能需求，對於在 JavaScript 中如何處理時間一直處在一個一知半解的狀態，只是大概知道 JavaScript 有提供了一個內建的 `Date` 物件來可以用來輔助操作時間類型的資料，常常是碰到相關需求時，才來找看看有沒有什麼現成的內建函式或套件可以達成我要的功能。因此，我想透過這篇筆記，一次性地整理 JS 中日期與時間的重點知識。

## **時間的表示方法與標準格式**

在開發應用程式時，我們常常會以字串來儲存日期與時間的資料，但由於時間的表示方法有很多種，如果前後端沒有事先溝通好使用一個相同的時間表示格式，就可能會導致錯誤地解析對方傳來的時間資料。比方說，後端習慣以 「2024/01/01」 這樣的格式傳遞時間，但前端卻期待接收「01.01.2024」這種格式的時間。

因此，如果有個放諸四海皆通用的標準時間格式讓所有人去遵守，那麼將可以省下非常多的溝通成本。以下我將介紹在開發 JavaScript 時常見的幾種時間表示標準，包括 **ISO 8601** 、**RFC 2822**、**UTC 世界標準時間**和 **Unix 時間戳記**。

### **ISO 8601 格式**

**國際標準ISO 8601**，是[國際標準化組織](https://zh.wikipedia.org/wiki/%E5%9C%8B%E9%9A%9B%E6%A8%99%E6%BA%96%E5%8C%96%E7%B5%84%E7%B9%94)的日期和時間的表示方法，其基本原則如下：

- 時間日期按照年月日時分秒的順序排列，大時間單位在小時間單位之前。
- 每個時間單位的位數固定，不足時於左補0。
- 精度不足時，可以從右側開始忽略日期或時間的某個單位。

EMCAScript 標準中 ISO 8601 標準日期和時間的結構如下：

```tsx
YYYY-MM-DDTHH:mm:ss.sssZ
```

- YMD代表年月日，Hms代表是時分秒
- `T`只是分隔年月日與時分秒的符號
- `Z`是時區的意思，單純用Z代表是UTC標準時間，如果是其他時區的時間可以用`+`或`-`，再加上`HH:mm`作為時區的表達式。

以下為符合 ISO 8601 標準的日期時間字串：

```tsx
2024-09-05  // 僅表示日期
14:48:00  // 僅表示時間
2024-09-05T14:48  // 時間的部份至少要有時與分
2024-09-05T14:48:00.000Z
2024-09-05T14:48:00.000+08:00
```

### **RFC 2822 格式**

**RFC 2822** 格式最常見於電子郵件系統中，它是一種簡單的文字格式，並且與我們日常生活中看到的時間格式比較相似。它主要用於將時間表示成一個對人類更加友善的方式，不過它的精確度相比 ISO 8601 略遜一籌。

RFC 2822 的日期時間表示方式相對靈活，可以接受多種不同的格式。常見的完整格式如下：

```tsx
ddd, DD MMM YYYY HH:mm:ss ±HHmm
```

- `ddd`：表示星期的縮寫（例如：Mon、Tue）
- `DD`：日期，固定為兩位數，位數不足時左側補 0
- `MMM`：月份的英文縮寫（例如：Jan、Feb）
- `YYYY`：四位數的年份
- `HH:mm:ss`：時間，使用 24 小時制
- `±HHmm`：時區偏移量，表示相對於 UTC 的時差（例如：`+0800` 表示東八區，`0500` 表示美國東部時間）

除此之外，RFC 2822 也接受其他變體格式，例如：

- `MMM DD, YYYY`
- `DD MMM, YYYY`

以下是幾個符合 **RFC 2822** 標準的日期和時間格式範例：

```tsx
Mon, 05 Sep 2024 14:48:00 +0800  // 表示東八區時間
Tue, 06 Sep 2024 03:00:00 -0500  // 表示美國東部時區
Jan 1, 2024                      // 僅顯示月份和日期
1 Jan, 2024                      // 日期和月份的另一種變體
```

### **UTC 世界標準時間**

[世界協調時間 UTC（Coordinated Universal Time）](https://zh.wikipedia.org/zh-tw/%E5%8D%8F%E8%B0%83%E4%B8%96%E7%95%8C%E6%97%B6)是目前世界上使用最為廣泛的時間標準。與 GMT（格林威治標準時間）相似，UTC 不會受地理位置或時間調整（例如夏令時間）的影響，是一個穩定、統一的時間基準。

JavaScript 的 `Date` 物件內部就是使用 UTC 來儲存和處理時間，以確保跨時區的時間一致性。，而 `Date` 提供了一系列與 UTC 相關的函式來取得或設定時間，例如 `getUTCFullYear()`、`getUTCHours()`、`toUTCString()` 等。

UTC 的時間格式範例如下：

```tsx
Thu, 05 Sep 2024 14:48:00 GMT
```

### **Unix 時間戳記**

**Unix 時間戳記**是另一種常見的時間表示方式，它表示自 1970 年 1 月 1 日 00:00:00 UTC 以來的秒數（或毫秒數）。這種表示方式非常常見於後端資料庫和系統層級的應用中，因為它能提供一個簡單且不依賴時區的標準化時間格式。使用這種格式可以很方便地進行時間的運算，例如計算兩個時間點之間的差異，或是進行時間排序。

在 JavaScript 中，`Date.now()` 會返回當前時間的毫秒級 Unix 時間戳

```tsx
let timestamp = Date.now();  // 返回當前時間的毫秒數
console.log(timestamp);      // 輸出類似 1693937280000 的值
```

## **Date 物件的建立與使用**

### **如何建立 Date 物件？**

在 JavaScript 中，`Date` 物件是操作日期和時間的核心工具。Date 物件提供四種可在建構式傳入參數的類型：

```tsx
new Date();
new Date(value);
new Date(dateString);
new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
```

1. **new Date()**
    
    如果不傳入任何參數，`new Date()` 會返回一個代表當前日期和時間的 `Date` 物件。它會根據系統時區來生成當前時間，並包含毫秒精度。
    
    ```tsx
    let now = new Date();
    console.log(now);  
    // Fri Sep 06 2024 10:35:44 GMT+0800 (台北標準時間)
    ```
    
2. **new Date(value)**
    
    `Date` 可以接受一個單一的數字參數 `value`，這個參數代表 **Unix 時間戳記**
    
    ```tsx
    let timestamp = 1693937280000;
    let date = new Date(timestamp);
    console.log(date);  
    // Wed Sep 06 2023 02:08:00 GMT+0800 (台北標準時間)
    ```
    
3. **new Date(dateString)**
    
    也可以傳入一個日期字串來建立 `Date` 物件，這個字串需要是可解析的格式。常見的格式包括 ISO 8601 和 RFC 2822。如果格式正確，JavaScript 會自動解析並轉換成對應的日期和時間。
    
    ```tsx
    let date1 = new Date('2024-09-05T14:48:00.000Z');  // ISO 8601 格式
    console.log(date1);  
    // Thu Sep 05 2024 22:48:00 GMT+0800 (台北標準時間)
    
    let date2 = new Date('Mon, 05 Sep 2024 14:48:00 +0800');  // RFC 2822 格式
    console.log(date2);  
    // Thu Sep 05 2024 14:48:00 GMT+0800 (台北標準時間)
    ```
    
    > 需要確保字串的格式是標準的，否則解析可能會失敗或返回 `Invalid Date`。
    > 
4. **new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]])**
    
    這種方式允許我們指定具體的年、月、日和時間來建立 `Date` 物件。
    
    ```tsx
    let date = new Date(2024, 8, 5, 14, 48, 0, 0);  
    // 9 月代表 month = 8，月份是從 0 開始計數
    console.log(date);  
    // Thu Sep 05 2024 14:48:00 GMT+0800 (台北標準時間)
    ```
    
    > 需要注意的是，**月份從 0 開始計算**，也就是說 0 代表 1 月，1 代表 2 月。這是 JavaScript 中常見的陷阱之一，新手開發者需要特別留意。
    > 

### **如何透過 Date 物件轉換特定的時間格式？**

將日期時間轉換成特定格式的字串是一個常見的需求。`Date` 物件提供了以下幾種方法來輸出特定格式化的時間字串：

```tsx
let date = new Date();

// 本地時間字串表示
console.log(date.toString());  // Fri Sep 06 2024 11:35:17 GMT+0800

// 只返回日期
console.log(date.toDateString());  // Fri Sep 06 2024

// 只返回時間
console.log(date.toTimeString());  // 11:35:17 GMT+0800

// UTC 標準時間字串表示
console.log(date.toUTCString());  // Fri, 06 Sep 2024 03:35:17 GMT

// 與 toUTCString() 兩者的輸出結果一致，將日期轉換為 GMT 格式。
// 已被視為過時，在現代應用中不推薦使用。
console.log(date.toGMTString());  // Fri, 06 Sep 2024 03:35:17 GMT

// ISO 8601 格式 UTC 時間字串
console.log(date.toISOString());  // 2024-09-06T03:35:17.631Z

// 根據語言和地區格式化
console.log(date.toLocaleString());  // 2024/9/6 上午11:35:17 （根據系統設定顯示）
console.log(date.toLocaleString('en-US'));  // 9/6/2024, 11:35:17 AM
console.log(date.toLocaleString('zh-TW'));  // 2024/9/6 上午11:35:17

// 只顯示日期部分
console.log(date.toLocaleDateString());  // 2024/9/6 （根據系統設定顯示）
console.log(date.toLocaleDateString('en-US'));  // 9/6/2024
console.log(date.toLocaleDateString('zh-TW'));  // 2024/9/6

// 只顯示時間部分
console.log(date.toLocaleTimeString());  // 上午11:35:17 （根據系統設定顯示）
console.log(date.toLocaleTimeString('en-US'));  // 11:35:17 AM
console.log(date.toLocaleTimeString('zh-TW'));  // 上午11:35:17
```

### **如何取得時間細節？**

`Date` 物件可以通過以下方法提取日期和時間的具體部分：

```tsx
let date = new Date();

// 取得年份、月份和日期
console.log(date.getFullYear());  // 2024
console.log(date.getMonth());     // 8 (代表 9 月) 需要注意的是，返回的月份是以 **0** 為基數，即 0 代表 1 月，1 代表 2 月，以此類推。
console.log(date.getDate());      // 5

// 取得星期幾（0 表示星期日）
console.log(date.getDay());       // 4 (代表星期四)

// 取得小時、分鐘、秒和毫秒
console.log(date.getHours());        // 14
console.log(date.getMinutes());      // 48
console.log(date.getSeconds());      // 30
console.log(date.getMilliseconds()); // 123

// 取得 Unix 時間戳記（毫秒級）
console.log(date.getTime());  // 1693937280000

```

### **如何修改 Date 物件？**

`Date` 物件被創建之後仍然可以更改其代表的日期時間，以下為常見的修改方法：

```tsx
let date = new Date();

// 修改年份，可以同時修改月份和日期
date.setFullYear(2025, 7, 10);  // 設置為 2025 年 8 月 10 日

// 修改月份，可以同時修改日期（0 代表 1 月）
date.setMonth(0, 15);  // 設置為 1 月 15 日

// 修改日期，超出範圍會自動進位
date.setDate(35);  // 自動調整為下一個月

// 修改小時，可以同時修改分鐘、秒和毫秒
date.setHours(10, 30, 45);  // 設置為 10:30:45

// 修改分鐘，可以同時修改秒和毫秒
date.setMinutes(20, 50);  // 設置為 20 分 50 秒

// 修改秒數，可以同時修改毫秒
date.setSeconds(45, 500);  // 設置為 45 秒 500 毫秒

// 修改毫秒
date.setMilliseconds(250);  // 設置為 250 毫秒

console.log(date);
// Tue Feb 04 2025 10:20:45 GMT+0800 (台北標準時間)
```

## **如何處理時區轉換？**

由於 JavaScript 的 `Date` 物件主要基於本地時區運行，如果開發的應用程式涉及到顯示非本地時區的時間，那麼就必須要考慮到時區轉換的問題了，但它也提供了一些方法來處理 UTC 時間以及了解當前時區的差異。

### **本地時間 vs. UTC 時間**

`Date` 物件默認使用系統的本地時間來返回日期和時間。要處理 UTC 時間，JavaScript 提供了類似 `getUTCFullYear()` 和 `getUTCHours()` 的方法，這些方法專門用來提取 UTC 標準時間。

```tsx
let date = new Date();

// 本地時間
console.log(date.getFullYear());     // 2024
console.log(date.getHours());        // 14

// UTC 時間
console.log(date.getUTCFullYear());  // 2024
console.log(date.getUTCHours());     // 6  （與當地時間相比偏移 8 小時）
```

### **處理時區差異**

JavaScript 提供了多種方法來處理本地時間與 UTC 的差異，並且可以靈活地手動處理不同時區之間的時間轉換。以下是常見的處理方法。

**1. 使用 `getTimezoneOffset()` 確定時區差異**

`Date` 物件的 `getTimezoneOffset()` 方法返回本地時區與 UTC 之間的差值（單位為分鐘）。這個方法可以用來計算當前時區與 UTC 的偏移，並根據這個值進行進一步的時間處理。

範例：

```tsx
let date = new Date();
console.log(date.getTimezoneOffset());
// 假設本地時區為 UTC+8，輸出：-480  （代表本地時間比 UTC 快 8 小時）
```

**2. 手動處理不同時區**

當我們需要將時間轉換為其他時區時，可以通過手動計算時差來實現。首先將當前時間轉換為 UTC，然後根據需要加上目標時區的時差。

範例：將 UTC+8 的時間轉換為 UTC+2

```tsx
let date = new Date();
let utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);  // 轉換為 UTC 時間
let newDate = new Date(utcTime + 2 * 60 * 60000);  // 加上 UTC+2 的時差

console.log(date);  // 轉換前的時間
// Tue Feb 04 2025 10:20:45 GMT+0800 (台北標準時間)

console.log(newDate);  // 轉換後的時間
// Tue Feb 04 2025 04:20:45 GMT+0800 (台北標準時間)
```

**3. 使用 `toLocaleString()` 指定時區格式化**

`toLocaleString()` 是處理不同時區的便捷工具。通過指定 `timeZone` 選項，我們可以直接顯示其他時區的時間，無需手動計算時差。

範例：將時間顯示為 Athens（UTC+2）時區的時間

```tsx
let date = new Date();
console.log(date.toLocaleString('en-US'));  // 本地時間顯示
// 2/4/2025, 10:20:45 AM

console.log(date.toLocaleString('en-US', { timeZone: 'Europe/Athens' }));  // 轉換後的 Athens 時區時間
// 2/4/2025, 4:20:45 AM
```

## **時間操作與運算的實務案例**

在實際開發中，時間的計算與處理往往涉及到精確的計算和不規則的時間處理問題，例如計算事件的持續時間、處理不同的月份天數、以及應對閏年等問題。這一章節將展示如何通過具體案例來應用 JavaScript 的日期與時間運算功能。

### **計算時間差：活動的持續時間計算**

假設我們需要計算一個活動從開始到結束的總時長，我們可以使用 `getTime()` 方法來獲取兩個時間點的毫秒數，然後轉換為易於理解的單位（如天、時、分等）。

```tsx
let startDate = new Date('2024-09-01T09:00:00');
let endDate = new Date('2024-09-05T17:30:00');

// 計算毫秒差距
let timeDiff = endDate.getTime() - startDate.getTime();

// 轉換為天、時、分
let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

console.log(`活動總持續時間：${days} 天 ${hours} 小時 ${minutes} 分鐘`);
// 輸出：活動總持續時間：4 天 8 小時 30 分鐘
```

### **人類可讀的時間差顯示：倒數計時**

在倒數計時器或顯示剩餘時間的功能中，將時間差轉換為“X 天 X 小時 X 分鐘”的格式是常見需求。

```tsx
let eventTime = new Date('2024-12-31T23:59:59');
let now = new Date();

let timeUntilEvent = eventTime.getTime() - now.getTime();

let daysLeft = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
let hoursLeft = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutesLeft = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));

console.log(`倒數計時：${daysLeft} 天 ${hoursLeft} 小時 ${minutesLeft} 分鐘`);
// 輸出：倒數計時：X 天 X 小時 X 分鐘
```

### **判斷閏年與判斷月份天數**

**判斷閏年**

閏年是每四年出現一次，除非是整百年且不能被 400 整除。因此，判斷是否為閏年的條件如下：

1. 該年份能被 4 整除且不能被 100 整除，或者
2. 該年份能被 400 整除。

```tsx
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

console.log(isLeapYear(2024));  // true，2024 年是閏年
console.log(isLeapYear(2023));  // false，2023 年不是閏年
```

**判斷月份的天數**

每個月的天數是固定的，除了 2 月份的天數根據是否為閏年而變化。你可以根據月份手動返回每個月的天數：

```tsx
function getDaysInMonth(year, month) {
	const monthIdx = month - 1;
  return new Date(year, monthIdx + 1, 0).getDate();  // 將日期設為下個月的第 0 天，即為當月最後一天
}

console.log(getDaysInMonth(2024, 2));  // 29，2024 年 2 月有 29 天（閏年）
console.log(getDaysInMonth(2023, 2));  // 28，2023 年 2 月有 28 天
console.log(getDaysInMonth(2024, 1));  // 31，2024 年 1 月有 31 天
```

> 這邊要注意的是 `Date` 物件的月份參數是以 **0** 為基數
> 

## **Reference**

- [**日期與時間，從ES6開始的JavaScript學習生活**](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part3/datetime.html)
- [**JS的日期與時間**](https://lala9990929.medium.com/js的日期與時間-d48b765df1f0)
- [**MDN Date - JavaScript**](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [**Wiki - ISO 8601**](https://zh.wikipedia.org/wiki/ISO_8601)