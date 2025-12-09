---
title: 深入理解 useEffect
sidebar_label: "useEffect"
description: 本篇文章深入探討 React useEffect 的核心概念、心智模型、常見陷阱與進階使用模式，幫助開發者建立正確的 Effect 思維
slug: "/React/useEffect"
last_update:
  date: 2025-12-10
keywords: [React, Hooks, useEffect, Side Effects, Cleanup Function, Race Condition, AbortController]
tags:
  - React
---

## **前情提要**

剛開始學 React 的時候，我對 `useEffect` 的理解就是「用來處理副作用的 Hook」，然後就開始到處亂用 XD。後來在實際專案中踩了不少坑，像是無限迴圈、Race Condition、不必要的 re-render 等等，才發現自己對 `useEffect` 的理解太淺了。後來讀了 Dan Abramov 的 [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) 這篇經典文章，才終於建立起正確的心智模型。這篇文章整理了我對 `useEffect` 的理解，希望能幫助路過的讀者少走一些彎路。

<br/>


## **useEffect 的核心概念**

`useEffect` 是 React 中用於處理 **副作用 (Side Effects)** 的 Hook。副作用指的是任何與外部系統互動的操作，例如：網路請求、DOM 操作、訂閱事件、計時器等。

### **基本語法**

```tsx
useEffect(setup, dependencies?)
```

- **`setup`**: Effect 函數，可選擇性回傳一個 cleanup 函數
- **`dependencies`**: 依賴陣列，決定 Effect 何時重新執行

### **依賴陣列的三種情況**

| 依賴陣列    | 執行時機                             |
| ----------- | ------------------------------------ |
| 不傳入      | 每次 render 後都執行                 |
| `[]` 空陣列 | 僅在 mount 時執行一次                |
| `[a, b]`    | 初始 render 及 `a` 或 `b` 變化時執行 |

:::tip[小提醒]
依賴陣列中的比較是使用 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 來判斷的，這意味著如果依賴項是 object 或 function，每次 render 都會被視為「新的」，很容易造成非預期的重新執行。
:::

<br/>


## **同步化思維：Effect 的正確心智模型**

> **"It's all about the destination, not the journey."** — Dan Abramov

許多開發者習慣用 Class Component 的生命週期（`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`）來理解 `useEffect`，但這會導致錯誤的心智模型。

### **「響應生命週期」vs「同步化」的差異**

先來看看這兩種思維的差別：

**生命週期思維（錯誤）：**
- 「component mount 時，我要做 X」
- 「props 改變時，我要做 Y」
- 「component unmount 時，我要做 Z」
- 關注的是：**「什麼時候」發生了什麼事件**

**同步化思維（正確）：**
- 「我要讓外部系統 A 的狀態，永遠與 React 的 state/props 保持一致」
- 關注的是：**「最終狀態」應該是什麼**

舉個具體的例子：假設你要根據 `userId` 訂閱聊天室。

```tsx
// ❌ 生命週期思維：「mount 時訂閱，userId 變化時重新訂閱，unmount 時取消」
// 這種思維會讓你想：我要處理三種「事件」

// ✅ 同步化思維：「聊天室訂閱狀態要與 userId 同步」
// 這種思維會讓你想：不管 userId 怎麼變，訂閱狀態最終要正確
useEffect(() => {
  const connection = ChatAPI.connect(userId);
  return () => connection.disconnect();
}, [userId]);
```

兩種寫法的程式碼可能一樣，但**思考方式**不同。同步化思維讓你專注於「結果」，而不是「過程中發生了什麼」。

### **區別的重要性**

因為當你用生命週期思維時，很容易寫出這種程式碼：

```tsx
// ❌ 生命週期思維：「mount 時 fetch 一次資料」
useEffect(() => {
  fetchData();
}, []);  // 故意寫空陣列，因為「只想在 mount 時執行」
```

但如果 `fetchData` 依賴某個 prop，這就會出 bug。正確的思維應該是：

```tsx
// ✅ 同步化思維：「資料要與 query 保持同步」
useEffect(() => {
  fetchData(query);
}, [query]);  // query 變了，資料就要重新同步
```

簡單來說：**不要想「什麼時候執行」，要想「要同步什麼」**。

### **useEffect 不是生命週期**

`useEffect` 的本質是 **同步化 (Synchronization)**，而非響應生命週期事件。它的職責是讓 React 外部的系統與當前的 props 和 state 保持同步。

```tsx
function Greeting({ name }) {
  useEffect(() => {
    // 將 document.title 與 name 同步
    document.title = `Hello, ${name}`;
  });

  return <h1>Hello, {name}</h1>;
}
```

無論 `name` 從 `"Dan"` 變成 `"Yuzhi"`，還是直接渲染 `"Yuzhi"`，最終結果都應該相同。這就是「同步化」的概念：**我們關心的是最終狀態，而非變化的過程**。

### **每次 Render 都有自己的 Effect**

這是理解 `useEffect` 最關鍵的概念：**每次 render 都會產生一個全新的 Effect 函數，它會「捕獲」該次 render 的 props 和 state**。

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 這個 Effect 捕獲的是「這次 render」的 count 值
    setTimeout(() => {
      console.log(`Count: ${count}`);
    }, 3000);
  });

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

如果快速點擊 5 次，3 秒後會依序印出 `0, 1, 2, 3, 4`，而非 5 個 `5`。這是因為每個 Effect 都捕獲了它所屬 render 的 `count` 值。

<br/>


## **Cleanup 函數的運作機制**

Cleanup 函數用於「撤銷」Effect 的操作，例如取消訂閱、清除計時器等。

### **執行時機**

React 會在以下時機執行 cleanup 函數：
1. **下一次 Effect 執行之前**（依賴項變化時）
2. **Component unmount 時**

重要的是，cleanup 函數同樣會捕獲它所屬 render 的 props 和 state：

```tsx
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  
  return () => {
    // 這裡的 props.id 是「定義這個 cleanup 時」的值
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

### **執行順序**

當 `props.id` 從 `10` 變成 `20` 時，執行順序如下：

1. React 渲染 `{id: 20}` 的 UI
2. 瀏覽器繪製畫面
3. React 執行 `{id: 10}` 的 cleanup（取消訂閱 id=10）
4. React 執行 `{id: 20}` 的 Effect（訂閱 id=20）

這個順序確保了 cleanup 總是能正確清理「舊的」訂閱。

<br/>


## **依賴陣列的正確使用**

### **不要對 React 說謊**

這是 Dan Abramov 在文章中反覆強調的重點：**依賴陣列必須包含 Effect 中使用的所有 reactive values**（props、state、以及在 component 內部宣告的變數和函數）。

:::danger[常見錯誤]
很多人（包括以前的我）會為了「讓 Effect 只執行一次」而故意寫 `[]`，但這樣做只是在欺騙 React，最終會導致難以追蹤的 bug。正確的做法是重構程式碼，讓 Effect 真的不需要那些依賴。
:::

```tsx
// ❌ 錯誤：遺漏依賴項
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);  // 使用了 count，但沒有加入依賴
  }, 1000);
  return () => clearInterval(id);
}, []);  // 空依賴會導致 count 永遠是初始值

// ✅ 正確：使用 functional update 移除依賴
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);  // 不需要讀取 count
  }, 1000);
  return () => clearInterval(id);
}, []);
```

### **移除依賴的正確方式**

當你想移除某個依賴時，不是直接從陣列中刪除，而是**重構程式碼讓 Effect 不再需要它**：

**方法一：使用 Functional Update**

```tsx
// 使用 functional update 避免依賴 count
setCount(c => c + 1);
```

**方法二：將函數移入 Effect 內部**

```tsx
// ❌ 函數在外部，需要加入依賴
function SearchResults({ query }) {
  async function fetchData() {
    const result = await fetch(`/api/search?q=${query}`);
    setData(await result.json());
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);  // fetchData 每次 render 都會重新建立
}

// ✅ 將函數移入 Effect 內部
function SearchResults({ query }) {
  useEffect(() => {
    async function fetchData() {
      const result = await fetch(`/api/search?q=${query}`);
      setData(await result.json());
    }
    fetchData();
  }, [query]);  // 只依賴 query
}
```

**方法三：使用 useReducer**

當 Effect 需要根據多個 state 計算新值時，`useReducer` 是更好的選擇：

```tsx
function Counter({ step }) {
  const [count, dispatch] = useReducer(reducer, 0);

  function reducer(state, action) {
    if (action.type === 'tick') {
      return state + step;  // 可以在 reducer 中讀取 props
    }
    throw new Error();
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });  // dispatch 的 identity 是穩定的
    }, 1000);
    return () => clearInterval(id);
  }, []);  // 不需要依賴 step

  return <h1>{count}</h1>;
}
```

<br/>


## **Race Condition 與解決方案**

這是我在實際專案中遇到最頭痛的問題之一。當 Effect 中有非同步操作時，可能會發生 Race Condition：使用者快速切換頁面，導致舊的請求結果覆蓋新的請求結果。

### **問題示例**

```tsx
useEffect(() => {
  async function fetchData() {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    setUser(data);  // 可能是過時的資料！
  }
  fetchData();
}, [userId]);
```

如果 `userId` 快速從 `1` 變成 `2`，而 `userId=1` 的請求比較慢，最終顯示的可能是 `userId=1` 的資料。

### **解法一：Boolean Flag**

```tsx
useEffect(() => {
  let active = true;

  async function fetchData() {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    
    if (active) {  // 只有在 active 時才更新 state
      setUser(data);
    }
  }
  
  fetchData();

  return () => {
    active = false;  // cleanup 時將 flag 設為 false
  };
}, [userId]);
```

### **解法二：AbortController（推薦）**

```tsx
useEffect(() => {
  const abortController = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        signal: abortController.signal,
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        // 請求被取消，不需要處理
        return;
      }
      // 處理其他錯誤
      console.error(error);
    }
  }

  fetchData();

  return () => {
    abortController.abort();  // 取消進行中的請求
  };
}, [userId]);
```

`AbortController` 的優勢是能真正取消網路請求，節省頻寬和系統資源。

:::tip[實務建議]
在實際專案中，我更推薦使用 [React Query](https://tanstack.com/query/latest) 或 [SWR](https://swr.vercel.app/) 這類資料請求函式庫，它們已經幫你處理好 Race Condition、快取、重試等複雜邏輯，可以省下很多心力。
:::

<br/>


## **常見的 useEffect 誤用**

以下整理了幾個我自己初學時常犯的錯誤，希望能幫助大家避免踩坑。

### **1. 可以在 render 時計算的值**

```tsx
// ❌ 不必要的 Effect
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
}

// ✅ 直接在 render 時計算
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName;  // 直接計算
}
```

### **2. 高成本計算應使用 useMemo**

```tsx
// ✅ 使用 useMemo 快取計算結果
function TodoList({ todos, filter }) {
  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [todos, filter]
  );
}
```

### **3. Props 變化時重置 State 應使用 key**

```tsx
// ❌ 使用 Effect 重置 state
function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [userId]);
}

// ✅ 使用 key 讓 React 重新建立 component
function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  const [comment, setComment] = useState('');  // userId 變化時自動重置
}
```

### **4. 事件相關邏輯不應放在 Effect**

```tsx
// ❌ 事件邏輯放在 Effect
function ProductPage({ product, addToCart }) {
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }
}

// ✅ 事件邏輯放在 event handler
function ProductPage({ product, addToCart }) {
  function handleBuyClick() {
    addToCart(product);
    showNotification(`Added ${product.name} to cart!`);
  }
}
```

### **5. 避免 Effect Chain**

多個 Effect 互相觸發會造成效能問題和難以維護的程式碼：

```tsx
// ❌ Effect Chain
useEffect(() => {
  if (card !== null) {
    setGoldCardCount(c => c + 1);
  }
}, [card]);

useEffect(() => {
  if (goldCardCount > 3) {
    setRound(r => r + 1);
    setGoldCardCount(0);
  }
}, [goldCardCount]);

// ✅ 在 event handler 中一次處理所有邏輯
function handleCardClick(card) {
  const newGoldCardCount = goldCardCount + 1;
  setGoldCardCount(newGoldCardCount);
  
  if (newGoldCardCount > 3) {
    setRound(round + 1);
    setGoldCardCount(0);
  }
}
```

<br/>


## **useEffect vs useLayoutEffect**

| 特性     | useEffect    | useLayoutEffect       |
| -------- | ------------ | --------------------- |
| 執行時機 | 瀏覽器繪製後 | DOM 更新後、繪製前    |
| 阻塞渲染 | 否           | 是                    |
| 適用場景 | 大多數副作用 | 需要同步測量/修改 DOM |

```tsx
// 使用 useLayoutEffect 避免閃爍
function Tooltip({ targetRect }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    // 在繪製前計算位置，避免 tooltip 閃爍
    setPosition(calculatePosition(targetRect));
  }, [targetRect]);

  return <div style={{ left: position.x, top: position.y }}>...</div>;
}
```

<br/>


## **何時該使用 useEffect？**

經過這麼多的討論，最後來總結一下 `useEffect` 的使用時機。

**適合使用 useEffect 的情況：**

- 與外部系統同步（網路請求、WebSocket、第三方函式庫）
- 瀏覽器 API（`addEventListener`、`setInterval`）
- 需要在 DOM 更新後執行的操作

**不應該使用 useEffect 的情況：**

- 可以在 render 時計算的值 → 直接計算或用 `useMemo`
- 響應使用者事件的邏輯 → 放在 event handler
- 初始化只需執行一次的邏輯 → 考慮放在 module scope
- 根據 props 變化重置 state → 使用 `key`

:::tip[總結]
當你想用 `useEffect` 時，問問自己：「我是要讓某個外部系統的狀態與 React 的 state/props 保持一致嗎？」

- **是** → 用 `useEffect`，並把所有相關的 state/props 放進依賴陣列
- **不是** → 很可能有更好的解法（直接計算、event handler、`useMemo` 等）

不要想「mount 時做什麼」，要想「我要同步什麼」。
:::

<br/>


## **Reference**

- **[React 官方文件 - useEffect](https://react.dev/reference/react/useEffect)**
- **[React 官方文件 - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)**
- **[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)** - Dan Abramov
- **[Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)** - Max Rozen
