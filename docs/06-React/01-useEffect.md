---
title: 初探 useEffect
sidebar_label: "[Hooks] 初探 useEffect"
description: 本篇為閱讀 @React Docs Beta 文檔的 useEffect 學習筆記
last_update:
  date: 2023-03-12
keywords:
  - React
  - Hooks
  - useEffect
tags:
  - React
---


## **什麼是 useEffect?**
React 的 **`useEffect`** 是一個非常重要且常用的 hook，它用於在 functional component 中執行 **side effects**，透過使用這個 Hook，我們告訴 React 我們的 component 需要在 render 後做一些事情。React 將記住我們傳遞的 function（我們將其稱為「effect」），並在執行 DOM 更新之後呼叫它，例如修改 DOM、網路請求、訂閱事件等等，它是實現 **side effects** 的重要手段。

### **一個簡單的範例：**
```jsx live
// import React, { useEffect, useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`You clicked ${count} times`);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

```

### **useEffect API**

```jsx
useEffect(setup, dependencies?)
```
useEffect 接收一個函數和一個依賴陣列作為參數：
- `setup`: component re-render 時想要執行的 **side effects**。該 setup function 可以選擇性回傳一個清理函數。當 component 首次添加到 DOM 時，React 將運行一次該函數。當 dependencies 中有變數 re-render 時，React 會先使用舊值運行清理函數（如果有提供的話），然後使用新值運行該函數。當 component 從 DOM 中移除後，React 將最後一次運行清理函數（如果有提供的話）。

- `dependencies`:它決定了 `useEffect` 要以 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 監聽哪些變數的變化以及何時重新執行，監聽的變數包括 props、state 以及直接在 component body 內宣告的所有變數和函數。

  - **`不傳入 dependencies`**：表示 `useEffect` 需要監聽所有變數的變化，**每次渲染後都會重新執行**。
  - **`傳入 dependencies`**：表示 `useEffect` 不需要監聽任何變數，**只會在第一次渲染後執行一次，以及在和 unmount 時執行清理函數（如果有提供的話）**。
  - **`傳入 dependencies`**：**只有在初始渲染或監聽變數發生改變時才會重新執行**。
  
  <br/>

  :::note
  上述 3 種 dependencies 情況的程式碼與運行結果可參考 [Examples of passing reactive dependencies](https://beta.reactjs.org/reference/react/useEffect#examples-dependencies) - @React Docs Beta
  :::


<br/>


## **useEffect 常見的使用時機**

### **連結到外部系統**
有時，component 可能需要保持與網絡、某些瀏覽器 API 或第三方 library 的連接。

> **ChatRoom 範例情境**：  
當 ChatRoom 組件被添加到頁面上時，它將使用初始的 serverUrl 和 roomId 連接到聊天室後端伺服器。如果 serverUrl 或 roomId 因重新渲染而改變（例如，如果用戶在下拉列表中選擇了不同的聊天室），則 Effect 將從先前的聊天室後端伺服器斷開連接，並連接到下一個聊天室後端伺服器。當 ChatRoom 組件最終從頁面中移除時， Effect 將斷開最後一次連接。

:::note
- 此處的外部系統指的事任何不受 React 控制的程式碼，如：
  - 使用 `setInterval()` 和 `clearInterval()` 管理的計時器。
  - 使用 `window.addEventListener()` 和 `window.removeEventListener()` 的事件監聽。
  - 帶有 API 的第三方動畫庫，如 `animation.start()` 和 `animation.reset()`。

- 使用 useEffect 連結外部系統的範例情境與程式碼可參考 [Examples of connecting to an external system](https://beta.reactjs.org/reference/react/useEffect#examples-connecting) - @React Docs Beta，包含連結 ChatRoom server、監聽全局瀏覽器事件、觸發動畫、控制 modal 對話框、追蹤元素可見性
- `如果沒有連接到任何外部系統，可能不需要使用 useEffect`，參考 [You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect) - @React Docs Beta。
:::

:::tip
程式碼中的每個 Effect 都應該代表一個單獨且獨立的同步過程，不要僅僅因為此邏輯需要與已編寫的 Effect 同時運行而將不相關的邏輯添加到同一個 Effect 中，當添加了額外的 dependencies，就可能導致不相干的邏輯在意外的時機觸發。
> 參考 [Each Effect represents a separate synchronization process](https://beta.reactjs.org/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) - @React Docs Beta
:::

### **將 Effects 包裝在自定義 Hooks 中**
如果有些 Effects 重複地出現在不同 components，那意味著可以將重複性的邏輯提取出來組成自定義 [custom Hooks](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks)，以滿足組件所依賴的常見行為。

:::note
使用 useEffect 於 custom Hooks 的範例情境與程式碼可以參考 [Examples of wrapping Effects in custom Hooks](https://beta.reactjs.org/reference/react/useEffect#examples-custom-hooks) - @React Docs Beta
:::


### **控制 non-React widget**
有時我們希望使非受 React 控制的外部系統與 component 的某些屬性或狀態保持同步，以官方文件的範例來舉例，如果我們的 component 中有一個第三方地圖 widget，我們可以使用一個 Effect 來使其狀態與我們的 component 的當前狀態相匹配。

:::note
程式碼可以參考 [Controlling a non-React widget](https://beta.reactjs.org/reference/react/useEffect#controlling-a-non-react-widget) - @React Docs Beta
:::


### **透過 Effect 獲取資料**
在 Effects 中寫 fetch call 是一種流行的獲取資料方式，尤其是在完全客戶端應用(client-side apps)。然而，這是一種非常手動的方法，這使得它有一些缺點：

- `Effects 無法在伺服器上運行`：初始的伺服器端 HTML 只包含沒有資料的載入狀態。客戶端必須下載所有 JavaScript 並渲染應用程式，才能看到現在需要加載資料，這樣效率不高。
- `直接在 Effects 中提取資料容易創建“network waterfalls”`：先渲染父組件，它提取一些資料，然後渲染子組件，然後子組件開始提取它們的資料。如果網路不是很快，這比並行提取所有資料慢得多。
- `直接在 Effects 中提取資料通常意味著無法預加載或快取資料`：組件卸載然後再次掛載，它就需要再次 fetch。
- `race conditions`: 當多個操作（例如程式碼執行緒或進程）同時操作共享資源時，由於彼此之間的順序未被正確管理或同步，導致最終結果依賴於操作的執行順序，而不是程式邏輯本身所產生的一種錯誤情況。在 React 中，當多個 Effect 同時更新同一個狀態時，就可能會發生`race conditions`。參考 [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

上述缺點並不是 React 特有的。React 官方推薦可以用以下方法來避免上述缺點：
- 如果使用框架，請使用其內建的數據獲取機制。現代 React 框架集成了高效的數據獲取機制，不會出現上述問題。
- 考慮使用或構建客戶端緩存。流行的開源解決方案包括 [React Query](https://tanstack.com/query/v3/)、[useSWR](https://swr.vercel.app/) 和 [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)。

> 參考 [What are good alternatives to data fetching in Effects? ](https://beta.reactjs.org/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects) - @React Docs Beta


<br/>


## **使用 useEffect 時需要注意的事項**
:::tip
- `useEffect` 是一個 Hook，所以只能在 component 頂層或者 custom Hooks 調用它。不能在 loop 或條件式內調用它。
- 如果不需要與某些外部系統同步，那可能不需要用到 `useEffect`。
- 如果的某些依賴項是在 component 內部定義的物件或函數，它們可能會導致 Effect 頻繁地進行非必要的重新運行。要解決此問題，可以刪除不必要的物件和函數依賴項。
- 如果 Effect 不是由交互引起的（比如點擊），React 會讓瀏覽器在運行 Effect 之前先繪製更新後的屏幕。如果Effect 正在做一些可視化的事情（例如，定位工具提示），並且延遲很明顯（例如，閃爍），需要將 `useEffect` 替換為 `useLayoutEffect`。
- 即使 Effect 是由交互（如點擊）引起的，瀏覽器也可能會在處理 Effect 內的狀態更新之前重新繪製屏幕。如果這會影響使用，必須阻止瀏覽器重新繪製屏幕，則需要將 `useEffect` 替換為 `useLayoutEffect`。
- 我們無法`選擇` Effect 的依賴項。Effect 中使用的每個 `reactive value`(props 與直接在 component 內部宣告的所有變量和函數) 都必須宣告為依賴項。 
:::

<br/>


## **Reference**
- [useEffect](https://beta.reactjs.org/reference/react/useEffect)  (@React Docs Beta)
- [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
