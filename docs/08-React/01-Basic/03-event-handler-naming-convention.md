---
title: onClick 還是 handleClick？淺談 React 事件處理的命名慣例
sidebar_label: "[Concept] Event Handler 的命名慣例"
description: 雖然命名上並沒有「正確答案」，但為了理清思緒並統一未來的實作方式，我整理了 React 社群中關於事件處理命名的常見慣例，也分享一些自己的理解，希望能幫助讓程式碼更具一致性與可讀性。
slug: "/React/event-handler-naming-convention"
last_update:
  date: 2024-11-16
keywords: [React event handler naming, React props naming conventions, onClick vs handleClick]
tags: [React]
---

> **前言：**  
> 隨著 React 開發經驗的累積，我開始對專案中命名原則的一致性越來越在意。最近在維護公司專案時，我發現有時候同樣是事件處理函數，卻被命名為 `onXXX` 或 `handleXXX`，而命名方式常常沒有統一。這樣的情況在定義 props 時尤為明顯：明明傳遞的是同一個函數，但在元件 A 的 props 中叫做 `onXXX`，到了元件 B 又被命名為 `handleXXX`，導致我在追蹤程式邏輯時不免覺得煩躁。
> 
> 雖然命名上並沒有「正確答案」，但為了理清思緒並統一未來的實作方式，我整理了 React 社群中關於事件處理命名的常見慣例，也分享一些自己的理解，希望能幫助讓程式碼更具一致性與可讀性。
> 

## **React 中的事件與事件處理**

在討論 `onXXX` 和 `handleXXX` 的命名慣例之前，我們需要先區分兩個重要的概念：**事件 (Event)** 和 **事件處理函數 (Event Handler)**

- **事件 (Event)**
    
    事件是應用程式中由使用者操作觸發的行為，例如點擊按鈕、改變輸入框內容、或者提交表單。React 通過 SyntheticEvent 將瀏覽器的原生事件包裝起來，為我們提供跨瀏覽器一致的事件行為處理。
    
- **事件處理函數 (Event Handler)**
    
    事件處理函數是程式碼中用來回應事件的邏輯。簡單來說，它是一段「事件發生後執行什麼」的程式碼。例如：
    
    ```jsx
    function handleClick() {
      console.log('Button was clicked!');
    }
    ```
    

### **常見的事件處理範例**

在 React 中，事件處理函數經常被作為 props 傳遞到子元件，子元件則負責決定在何時、如何觸發這些函數。例如：

```jsx
function Parent() {
  const handleClick = () => console.log("Button clicked!");

  return <Child onClick={handleClick} />;
}

function Child({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
}
```

在這段程式碼中，我們看到了一個常見的模式：

- 父元件定義了一個事件處理函數 `handleClick`。
- 父元件將該函數作為 props 傳遞，命名為 `onClick`。
- 子元件接收到 `onClick`，並將它綁定到按鈕的 `onClick` 屬性上。

### **容易引起疑惑的事件處理命名**

當事件處理函數需要跨元件傳遞時，命名上的選擇往往會帶來困擾。以剛才的例子為基礎，這樣的情境很常發生：

1. 父元件定義了一個事件處理函數，應該命名為 `handleClick` 還是 `onClick`？
    
    如果命名為 `onClick`，可能會與 HTML 屬性混淆，但命名為 `handleClick`，又似乎少了一些「事件觸發」的語意。
    
2. 子元件接收到 props，應該命名為 `onClick` 還是 `handleClick`？
    
    作為一個暴露的 API，`onClick` 更符合直覺，但內部若混用 `handleClick` 來處理邏輯，命名一致性可能會出現問題。
    

這種情境下，如果沒有統一的命名規範，程式碼可能會變得難以維護。例如以下場景：

```jsx
function Parent() {
  const onClick = () => console.log("Button clicked!"); // 父元件用 `onClick`

  return <Child handleClick={onClick} />; // 傳遞時改名為 `handleClick`
}

function Child({ handleClick }) {
  return <button onClick={handleClick}>Click me</button>; // 接收到的還是 `handleClick`
}
```

這段程式碼中：

- 父元件的事件處理函數被命名為 `onClick`，但傳遞到子元件時又被重新命名為 `handleClick`。
- 子元件的 props 命名和內部按鈕的 `onClick` 命名不一致，容易造成混淆。

### **命名問題的核心：語意與責任的混淆**

React 中的事件命名問題，其實圍繞兩個核心：

1. **語意性**
    - `onXXX` 更接近於描述「事件觸發條件」，例如「當按鈕被點擊時」。
    - `handleXXX` 更接近於描述「事件處理邏輯」，例如「當按鈕被點擊後，執行什麼行為」。
2. **責任的清晰性**
    - 父元件定義的函數應如何命名，才能表達它的邏輯屬性？
    - 子元件暴露的 props 應如何命名，才能明確表示它是事件的入口？

雖然命名方式並沒有唯一的答案，但統一命名原則能有效提升程式碼的可讀性和可維護性。


<br/>


## **React 中的事件命名慣例：`onXXX` 與 `handleXXX` 的區別**

在 React 中，`onXXX` 和 `handleXXX` 是最常見的事件處理命名方式。雖然這兩者都與事件處理有關，但它們的語意和使用情境明顯不同。

### **`onXXX`：事件觸發的入口**

`onXXX` 通常用於**元件的 props**，表示「當某事件發生時，應該執行什麼回調函數」。這種命名方式直接對應 HTML 中的事件屬性命名，例如 `onClick` 和 `onChange` 等。

**使用情境**

`onXXX` 的使用場景通常是：

- **暴露事件接口**：元件對外提供一個事件入口，允許父元件定義行為。
- **保持語意一致**：子元件的 props 名稱和 HTML 事件屬性一致，減少使用者的理解成本。

**範例**

```jsx
function Button({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
}

// 父元件使用
function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <Button onClick={handleClick} />;
}
```

在這裡：

1. 子元件 `Button` 定義了一個 `onClick` props，語意是「當按鈕被點擊時執行什麼行為」。
2. 父元件傳遞了自己的事件處理函數 `handleClick`。

**命名特色**

- **描述事件觸發條件**：`onXXX` 表達的是「什麼時候執行」。
- **接收回調函數**：props 的主要功能是作為事件的觸發入口，並不處理邏輯。

### **`handleXXX`：事件處理的實際邏輯**

`handleXXX` 則通常用於**元件內部的事件處理函數**，表示「事件發生後，應該執行什麼邏輯」。相比 `onXXX`，`handleXXX` 更加側重於「如何處理事件」的行為語意。

**使用情境**

`handleXXX` 的使用場景通常是：

- **內部邏輯實作**：元件內部定義的函數，用於實現具體的行為。
- **清晰表達行為**：用名稱表達函數的目的和具體執行內容。

**範例**

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

在這裡：

1. `handleClick` 是內部定義的事件處理函數，用於更新 `count` 狀態。
2. 函數名稱明確表達了它的目的：處理按鈕點擊事件。

**命名特色**

- **描述行為邏輯**：`handleXXX` 表達的是「執行什麼行為」。
- **與元件內部責任一致**：該函數只處理元件內的邏輯，與父元件無直接關係。


<br/>


## **主流的事件處理命名慣例**

為了避免命名不一致帶來的混淆，可以參考以下原則來統一專案中的命名方式：

1. **清楚區分 props 和內部函數**
    - 元件暴露的事件屬性用 `onXXX` 命名。
    - 元件內部的邏輯函數用 `handleXXX` 命名。
2. **對應命名**
    
    `onXXX` 和 `handleXXX` 通常成對使用。例如：
    
    ```jsx
    function ParentComponent() {
      const handleChildClick = () => {
        console.log('Child clicked!');
      };
    
      return <ChildComponent onClick={handleChildClick} />;
    }
    ```
    
3. **遵循語意**
    - 如果是描述觸發條件（事件的入口），使用 `onXXX`。
    - 如果是描述處理邏輯（事件的行為），使用 `handleXXX`。


<br/>


## **命名誤區與反例**

### **反例 1：props 使用 `handleXXX`**

這會讓開發者誤以為函數是內部邏輯，而非來自父層的回調函數：

```jsx
function Button({ handleClick }) {
  return <button onClick={handleClick}>Click me</button>;
}

// 應改為：
function Button({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
}
```

### **反例 2：內部函數使用 `onXXX`**

這可能導致誤解，讓人以為函數是作為事件屬性暴露出來：

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  // 命名不清楚，應改為 handleClick
  const onClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return <button onClick={onClick}>Count: {count}</button>;
}\
```


<br/>


## **Reference**

- [**@stack overflow - What is the right name of event handler? onClick or handleClick? [closed]**](https://stackoverflow.com/questions/60048249/what-is-the-right-name-of-event-handler-onclick-or-handleclick)
- [**How to Handle Events in React – Explained with Code Examples**](https://www.freecodecamp.org/news/how-to-handle-events-in-react-19/)
- [**Responding to Events**](https://react.dev/learn/responding-to-events)