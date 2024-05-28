---
title: useEffect 常見的誤用
sidebar_label: "[Hooks] useEffect 常見的誤用"
description: 本篇文章記錄閱讀 React 官方文件後歸納出的常見的 useEffect 誤用
last_update:
  date: 2023-03-16
keywords:
  - React
  - Hooks
  - useEffect
tags:
  - React
---

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

:::danger 無窮迴圈的原因
當 Effect 進入無窮迴圈，必定源自於兩件事：  
**1. 該 Effect 更新了某 state**  
**2. 該 state 導致 Effect 的依賴項發生變化從而引起 re-render**
:::


:::tip 1. 將邏輯移出 Effect
在開始解決問題之前，先問問自己 Effect 是否連接到某個外部系統（如 DOM、網絡、第三方小部件等），如果沒有外部系統，那代表不一定需要用 `useEffect`，可以考慮將邏輯完全移除 Effect。
:::

:::tip 2. 通過 dependencies 來解決
- state: 使用**其他 dependencies**來控制 Effect，只有 **value** 改變時才會觸發 setValue
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
可以使用 [useRef](https://beta.reactjs.org/reference/react/useRef) 建立 Ref，**更新 Ref 不會觸發元件的重新渲染**。
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
:::danger 1. 直接把 async function 作為 setup function
```jsx
// ❌ don't do this
useEffect(async () => {
  const data = await fetchData();
}, [fetchData])
```
這裡的問題是 useEffect 的第一個參數應該是一個不返回任何內容（未定義）或返回一個函數（以清除副作用）的函數。但是異步函數返回一個 `Promise`，它不能作為 `useEffect` 的 `setup function` 調用！
:::

:::tip 1. async function 在 Effect 的正確寫法
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


:::danger 2. 接收 async function 的值來更新 state
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


:::tip 2. setState 正確寫法
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


:::danger 3. 直接將 fetchData function 寫在 Effect 外
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


:::tip 3. fetchData function 寫在 Effect 外的正確寫法
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
同前一個例子，如果只是要用從 props 取得的 **todos**, **filter** 來計算 **visibleTodos**，不需要另 **visibleTodos** 作為 state，直接做為普通變數及可。

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

但如果 **todos** 很大造成 **getFilteredTodos()** 的計算成本很高時，我們可以將 **visibleTodos** 包裝在 [useMemo](https://beta.reactjs.org/reference/react/useMemo) 中來**緩存**（或**記憶**）它。[useMemo](https://beta.reactjs.org/reference/react/useMemo)告訴 React ，除非 **todos** 或 **filter** 發生變化，否則不要重複執行 **getFilteredTodos()**。 React 將在初始渲染期間記住 **getFilteredTodos()** 的返回值。在下一次渲染期間，[useMemo](https://beta.reactjs.org/reference/react/useMemo) 將檢查 **todos** 與 **filter**  若沒有發生變化則返回它存儲的最後一個結果。

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
通常，當同一個 component 在同一個位置渲染時，React 會保留 state，若使用 `useEffect` 來重置 **comment** 狀態的話，當 component **重新渲染時，comment** 狀態會在第一次渲染時仍然是舊的值，然後又因為 `useEffect` 的執行而重新渲染一次，這樣會造成渲染的浪費和顯示的錯誤。同時，如果 comment UI 是被嵌套在子元件中的話，就需要在每個子元件中重置 comment 的狀態，這樣會增加程式碼的複雜度和維護成本。

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

我們可以通將將 **userId** 作為 `key` 傳遞給 `Profile` component，要求 React 將具有不同 userId 的兩個 `Profile` component 視為不應共享任何狀態的兩個不同組件。每當 `key`（已設置為 userId）更改時，React 將重新創建 DOM 並重置 `Profile` 組件及其所有子組件的狀態。因此，在配置文件之間導航時，評論字段將自動清除。
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
應該要避將與特定事件相關的邏輯寫進 Effect。如下面這個例子，本來我們只希望按下 **Buy** or **Checkout** 按鈕才觸發 `showNotification()`，但假如我們將一個 **product** 加入購物車後再次 reload ，又會再呼叫一次 `showNotification()`，因為前面加入購物車的動作已經使 **product.isInCart** 為 **true**，每次 reload 都會重新執行 useEffect，而觸發 `showNotification()`。
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

當用戶點擊一個按鈕時，通知應該顯示出來，但是這個操作不需要在每次組件渲染時都執行，因為用戶並不一定會點擊這個按鈕。如果將這個操作放在Effect中，那麼每次組件渲染時都會執行這個操作，這是不必要的開銷。相反，我們可以將這個操作放在事件處理函數中，在用戶點擊按鈕時執行。這樣就可以節省不必要的程式碼運行。
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
同前例，應該要避將與**特定事件**相關的邏輯寫進 Effect。
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







## **Reference**
- **[@React Docs Beta](https://react.dev/)**
  - **[useEffect](https://beta.reactjs.org/reference/react/useEffect)**
  - **[useMemo](https://beta.reactjs.org/reference/react/useMemo)**
  - **[useRef](https://beta.reactjs.org/reference/react/useRef)**
  - **[useCallback](https://beta.reactjs.org/reference/react/useCallback)**
  - **[You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect)**
- **[如何解決 React.useEffect() 的無限迴圈](https://www.gushiciku.cn/dl/1px4o/zh-tw)**
- **[How to use async functions in useEffect (with examples)](https://devtrium.com/posts/async-functions-useeffect#write-the-asynchronous-function-inside-the-useeffect)**