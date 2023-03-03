---
title: useEffect
sidebar_label: "[Hooks] useEffect"
sidebar_position: 0
description: 本篇為閱讀 @React Docs Beta 文檔的 useEffect 學習筆記
last_update:
  date: 2023-03-03
keywords:
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

這個缺點列表並不是 React 特有的。React 官方推薦可以用以下方法來避免上述缺點：
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


## **移除 component 中非必要的 Effects**
>本節範例皆取自 [You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect) - @React Docs Beta

`useEffect` 是用來讓 component “走出” React 與一些外部系統同步，比如: non-React widgets、網絡或瀏覽器 DOM。如果不涉及外部系統（例如，如果只是想在某些 props 或 state 更改時更新component），則不需要 Effect。刪除不必要的 Effects 將使程式碼碼更易於理解、運行速度更快並且更不容易出錯。

### **根據 props 或 state 更新 state**
當某些東西可以從現有的​​ props 或 state 中計算出來時，不要把它放在狀態中。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // highlight-start
  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // highlight-end
  // ...
}
```

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // highlight-start
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // highlight-end
  // ... 
}
```

### **Caching 高成本的計算結果**
同前一個例子，如果只是要用從 props 取得的 `todos`, `filter` 來計算 `visibleTodos`，不需要另 `visibleTodos` 作為 state，直接做為普通變數及可。

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // highlight-start
  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);
  // highlight-end

  // ...
}
```

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // highlight-start
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // highlight-end
  // ...
}
```

但如果 `todos` 很大造成 `getFilteredTodos()` 的計算成本很高時，我們可以將 `visibleTodos` 包裝在 [useMemo](https://beta.reactjs.org/reference/react/useMemo) 中來緩存（或`記憶`）它。[useMemo](https://beta.reactjs.org/reference/react/useMemo)告訴 React ，除非 `todos` 或 `filter` 發生變化，否則不要重複執行 `getFilteredTodos()`。 React 將在初始渲染期間記住 `getFilteredTodos()` 的返回值。在下一次渲染期間，[useMemo](https://beta.reactjs.org/reference/react/useMemo) 將檢查 `todos` 與 `filter`  若沒有發生變化則返回它存儲的最後一個結果。

```jsx
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // highlight-start
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // highlight-end
  // ...
}
```


### **當 props 改變時重置所有 state**
通常，當同一個 component 在同一個位置渲染時，React 會保留 state，若使用 `useEffect` 來重置 `comment` 狀態的話，當 component `重新渲染時，comment` 狀態會在第一次渲染時仍然是舊的值，然後又因為 `useEffect` 的執行而重新渲染一次，這樣會造成渲染的浪費和顯示的錯誤。同時，如果 comment UI 是被嵌套在子元件中的話，就需要在每個子元件中重置 comment 的狀態，這樣會增加代碼的複雜度和維護成本。

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // highlight-start
  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // highlight-end
  // ...
}
```

過將 `userId` 作為 `key` 傳遞給 `Profile` 組件，要求 React 將具有不同 userId 的兩個 `Profile` component 視為不應共享任何狀態的兩個不同組件。每當 `key`（已設置為 userId）更改時，React 將重新創建 DOM 並重置 `Profile` 組件及其所有子組件的狀態。因此，在配置文件之間導航時，評論字段將自動清除。
```jsx
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      // highlight-next-line
      key={userId}
    />
  );
}

// highlight-start
function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // highlight-end
  // ...
}
```


### **當 props 改變時更新部分 state**
有時我們可能希望在 props 更改時重置或調整部分而非全部的 state。 於前例相同的，我們應該避免在 Effect 中監聽 props 來更新 state。該例子中每次更改 `items` ，List 及其子組件將首先使用舊的 `selection` 值渲染畫面然後才運行 Effects。當執行到 `setSelection(null)` 後將導致 `List` 及其子組件再次重新渲染。

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // highlight-start
  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // highlight-end
  // ...
}
```

在下面的例子中，`setSelection` 會直接在渲染期間被呼叫。React 會在退出 component 的 `return` 後將立即重新渲染 `List`。此時，React 尚未渲染 List 的子元素或更新DOM，因此這使得List子元素可以跳過渲染舊的 `selection` 值。
```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // highlight-start
  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // highlight-end
  // ...
}
```

儘管此方法比 Effect 更有效率，但大多數 component 也不需要它。不管怎麼做，基於 props 或其他 state 來調整 state 都會使數據流更難理解和調試。我們可以持續檢查是否可以使用 key 重置所有 state 或在渲染期間計算所有內容。例如，存儲所選項目 ID，而不是存儲（和重置）所選項目。在渲染期間，可以通過將 `selectedId` 與 `item` 的 `id` 進行比較來計算出選中的 `item` 。如果找不到匹配的項目，則返回 null。這樣做的好處是不需要在渲染期間調整 state，而且大多數情況下，當 items 改變時，selection 的狀態也會保持不變。
```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  // highlight-start
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // highlight-end
  // ...
}
```


### **在 event handlers 間共享邏輯**
應該要避將與特定事件相關的邏輯寫進 Effect。如下面這個例子，本來我們只希望按下 `Buy` or `Checkout` 按鈕才觸發 `showNotification()`，但假如我們將一個 `product` 加入購物車後再次 reload ，又會再呼叫一次 `showNotification()`，因為前面加入購物車的動作已經使 `product.isInCart` 為 true，每次 reload 都會重新執行 useEffect，而觸發 `showNotification()`。
```jsx
function ProductPage({ product, addToCart }) {
  // highlight-start
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);
  // highlight-end
  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

當用戶點擊一個按鈕時，通知應該顯示出來，但是這個操作不需要在每次組件渲染時都執行，因為用戶並不一定會點擊這個按鈕。如果將這個操作放在Effect中，那麼每次組件渲染時都會執行這個操作，這是不必要的開銷。相反，我們可以將這個操作放在事件處理函數中，在用戶點擊按鈕時執行。這樣就可以節省不必要的代碼運行。
```jsx
function ProductPage({ product, addToCart }) {
  // highlight-start
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }
  // highlight-end

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```


### **發送 Post request**
同前例，應該要避將與特定事件相關的邏輯寫進 Effect。
```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // highlight-start
  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);
  // highlight-end

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

若只想在一個特定的時間及時發送請求：當用戶按下按鈕時。它應該只發生在那個特定的交互上。
```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // highlight-start
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
    // highlight-end
  }
  
  // ...
}
```

> 當不確定該將某些邏輯放入事件處理還是 Effect 時，我們可以從用戶的角度來看它是什麼樣的邏輯。如果此邏輯是由特定交互引起的，就將其保留在事件處理程序中。如果是因為用戶在屏幕上看到組件造成的，就把它放在 Effect 中。


### **useEffect 鏈**
應該要避免 Effect 間互相觸發造成 `Effect Chains`。住要有兩個明顯的缺點，第一：每觸發一個 Effect 都會重新 render，非常沒有效率。第二：`Effect Chains` 很難維護，當有新的需求加入時很容易就破壞原本的 `Effect Chains` 關係。



### **初始化 app**
應該避免在 `useEffect` 中寫只應該運行一次的邏輯，在 development 模式下 useEffect 會運行兩次，這可能會造成像是 `authentication` 之類的問題。
```jsx
function App() {
  // highlight-start
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // highlight-end
  // ...
}
```

如果某些邏輯必須在每次 app 加載時運行一次而不是每次 component mount 時運行一次，可以添加一個頂級變量來跟踪它是否已經執行，並始終跳過重新運行它，並且將 app 範圍內的初始化邏輯保留在 App.js 等根組件模塊或應用程序的入口點模塊中。
```jsx
// highlight-next-line
let didInit = false;

function App() {
  useEffect(() => {
    // highlight-start
    if (!didInit) {
      didInit = true;
      // highlight-end
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```


### **通知 parent component 狀態變化**
當我們希望 `Toggle` 內的 state 被更新時可以通知其父組件，應該要避免將通知函數寫在 Effect，因為 React 會先
更新 `Toggle` 的 state，接著更新畫面，最後才進入 Effect，這時 parent 才開始更新 state。
```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);
  // highlight-start
  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])
  // highlight-end

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

較理想的做法是在同個 event handler 裡更新 `Toggle` 與父組件的 state。
```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // highlight-start
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
    // highlight-end
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```


### **傳遞資料給 parent**

```jsx
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // highlight-start
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // highlight-end
  // ...
}
```

在 React 中，數據從父組件流向它們的子組件。當我們看到錯誤時，我們可以沿著組件鏈向上追踪信息的來源，直到找到哪個組件傳遞了錯誤的 prop 或具有錯誤的狀態。當子組件在 Effects 中更新其父組件的狀態時，數據流變得很難追踪。讓父組件獲取該數據，然後將其傳遞給子組件是比較好的寫法。
```jsx
function Parent() {
  const data = useSomeAPI();
  // ...
  // highlight-start
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
  // highlight-end
}

function Child({ data }) {
  // ...
}
```



## **useEffect 常見誤用問題與解決方法**
### **useEffect 無限迴圈陷阱**

**無窮迴圈案例：**
```jsx
function CountInputChanges() {
  const [value, setValue] = useState('');
  const [count, setCount] = useState(-1);

 useEffect(() => setCount(count + 1));
  const onChange = ({ target }) => setValue(target.value);

  return (
    <div>
      <input type="text" value={value} onChange={onChange} />
      <div>Number of changes: {count}</div>
    </div>
  )
}
```

:::danger
當 Effect 進入無窮迴圈，必定源自於兩件事：
1. 該 Effect 更新了某 state
2. 該 state 導致 Effect 的依賴項發生變化從而引起 re-render
:::


:::tip 1. 將邏輯移出 Effect
在開始解決問題之前，先問問自己 Effect 是否連接到某個外部系統（如 DOM、網絡、第三方小部件等），如果沒有外部系統，那代表不一定需要用 `useEffect`，可以考慮將邏輯完全移除 Effect。
:::

:::tip 2. 通過 dependencies 來解決
- state: 新增其他 dependencies，只有 value 改變時才會觸發 setValue
```jsx
import { useEffect, useState } from 'react';

function CountInputChanges() {
  const [value, setValue] = useState('');
  const [count, setCount] = useState(-1);

  useEffect(() => setCount(count + 1), [value]);
  const onChange = ({ target }) => setValue(target.value);

  return (
    <div>
      <input type="text" value={value} onChange={onChange} />
      <div>Number of changes: {count}</div>
    </div>
  );
}
```
- 移除 object & function dependencies: 因為每次 re-render，object 與 function 都會被從頭建立，因此若 dependencies 包含 object or React 會判定 dependencies 發生變化而不斷 re-render。
:::

:::tip 3. 使用 Ref
可以使用 [useRef](https://beta.reactjs.org/reference/react/useRef) 建立 Ref，更新 Ref 不會觸發元件的重新渲染。
```jsx
import { useEffect, useState, useRef } from "react";

function CountInputChanges() {
  const [value, setValue] = useState("");
  const countRef = useRef(0);

  useEffect(() => countRef.current++);
  const onChange = ({ target }) => setValue(target.value);

  return (
    <div>
      <input type="text" value={value} onChange={onChange} />
      <div>Number of changes: {countRef.current}</div>
    </div>
  );
}
```
:::

### **async await 在 useEffect 中常見的誤用**
:::danger 直接把 async function 作為 setup function
```jsx
// ❌ don't do this
useEffect(async () => {
  const data = await fetchData();
}, [fetchData])
```
這裡的問題是 useEffect 的第一個參數應該是一個不返回任何內容（未定義）或返回一個函數（以清除副作用）的函數。但是異步函數返回一個 `Promise`，它不能作為 `useEffect` 的 `setup function` 調用！
:::

:::tip async function 在 Effect 的正確寫法
```jsx
useEffect(() => {
  // declare the data fetching function
  const fetchData = async () => {
    const data = await fetch('https://yourapi.com');
  }

  // call the function
  fetchData()
    // make sure to catch any error
    .catch(console.error);
}, [])
```
:::


:::danger 接收 async function 的值來更新 state
```jsx
useEffect(() => {
  // declare the async data fetching function
  const fetchData = async () => {
    // get the data from the api
    const data = await fetch('https://yourapi.com');
    // convert data to json
    const json = await data.json();
    return json;
  }

  // call the function
  const result = fetchData()
    // make sure to catch any error
    .catch(console.error);;

  // ❌ don't do this, it won't work as you expect!
  setData(result);
}, [])
```

上述 result 如果我們 console.log 出來會是一個 pending Promise object
```jsx
Promise {<pending>}
```
:::


:::tip setState 正確寫法
```jsx
useEffect(() => {
  // declare the async data fetching function
  const fetchData = async () => {
    // get the data from the api
    const data = await fetch('https://yourapi.com');
    // convert the data to json
    const json = await response.json();

    // set state with the result
    setData(json);
  }

  // call the function
  fetchData()
    // make sure to catch any error
    .catch(console.error);;
}, [])

```
:::


:::danger 直接將 fetchData function 寫在 Effect 外
```jsx
// declare the async data fetching function
const fetchData = async () => {
  const data = await fetch('https://yourapi.com');
  setData(data);
}

// the useEffect is only there to call `fetchData` at the right time
useEffect(() => {
  fetchData()
    // make sure to catch any error
    .catch(console.error);;
}, [fetchData])
```
由於每次 re-render function 都會被從頭建立，因此會在每次 re-render 時都被呼叫一次
:::


:::tip fetchData function 寫在 Effect 外的正確寫法
```jsx
// declare the async data fetching function
const fetchData = useCallback(async () => {
  const data = await fetch('https://yourapi.com');

  setData(data);
}, [])

// the useEffect is only there to call `fetchData` at the right time
useEffect(() => {
  fetchData()
    // make sure to catch any error
    .catch(console.error);;
}, [fetchData])
```
useCallback 可以在 re-render 之間緩存函數定義，使得不會在每次 re-render 都觸發 fetchData。
:::


<br/>



## **Reference**
- [useEffect](https://beta.reactjs.org/reference/react/useEffect)  (@React Docs Beta)
- [useMemo](https://beta.reactjs.org/reference/react/useMemo)  (@React Docs Beta)
- [useRef](https://beta.reactjs.org/reference/react/useRef)  (@React Docs Beta)
- [useCallback](https://beta.reactjs.org/reference/react/useCallback)  (@React Docs Beta)
- [You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect)  (@React Docs Beta)
- [如何解決 React.useEffect() 的無限迴圈](https://www.gushiciku.cn/dl/1px4o/zh-tw)
- [How to use async functions in useEffect (with examples)](https://devtrium.com/posts/async-functions-useeffect#write-the-asynchronous-function-inside-the-useeffect)