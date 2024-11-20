---
title: React 事件處理與事件傳遞：一篇搞懂冒泡、捕獲與阻止事件！
sidebar_label: "[Concept] 事件傳遞：冒泡與捕獲"
description: 這篇文章將帶你從 React 的事件基礎開始，逐步深入事件傳遞中的捕獲與冒泡，並通過實際案例解釋它們在日常開發中的應用場景。閱讀完這篇文章，你將學會：如何在 React 中處理事件、捕獲與冒泡階段的詳細解析，以及什麼時候需要阻止事件傳遞與預設行為？
slug: "/React/event-propagation"
last_update:
  date: 2024-11-17
keywords: [React propagation, 事件傳遞, 事件冒泡, 事件捕獲, event.stopPropagation(), event.preventDefault()]
tags: [React]
---

> **前言：**  
> 在開發React 時，「事件」是我們最常打交道的部分之一。無論是點擊按鈕、提交表單，還是操作其他互動元素，都需要處理事件。如果你剛接觸 React，可能會有以下疑問：
> - 為什麼點擊按鈕時會觸發父層的事件？
> - 什麼是事件的「冒泡」和「捕獲」？
> - 如何攔截事件傳播或避免預設行為？
> 
> 這篇文章將帶你從零開始理解 React 的事件處理，並解釋事件傳遞的原理及其在開發中的實際應用場景。
> 

## **React 的事件處理基礎**

### **什麼是事件？**

根據 [**@MDN Web Docs - Introduction to events**](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events) 對於事件的定義，事件是瀏覽器用來回應用戶操作的一種訊號。例如當你點擊按鈕、鍵入文字、或滑動滑鼠時，瀏覽器都會生成一個事件並傳遞給應用程式進行處理。

常見的事件類型包括：

- **滑鼠事件（Mouse Events）：**`click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`
- **鍵盤事件（Keyboard Events）：**`keydown`, `keyup`, `keypress`
- **表單事件（Form Events）：**`submit`, `change`, `input`, `focus`, `blur`

在 JavaScript 中，事件本身是一個由瀏覽器產生的**事件物件（Event Object）**，它記錄了與互動相關的所有資訊，例如觸發的 HTML 元素、滑鼠座標、鍵盤按鍵等。

讓我們看看事件物件的基本樣貌和幾個常用屬性：

```jsx
document.querySelector('button').addEventListener('click', (event) => {
    console.log(event.type); // 事件類型，例如 "click"
    console.log(event.target); // 觸發事件的 DOM 元素
    console.log(event.currentTarget); // 綁定事件的 DOM 元素
    console.log(event.clientX, event.clientY); // 滑鼠的 X、Y 座標
});
```

### **HTML/JS 的事件處理方式**

在早期的網頁開發中，事件處理主要有以下幾種方式：

1. **內聯屬性（Inline Attributes）**
    
    直接在 HTML 元素上綁定事件處理邏輯，這種方式直觀但不推薦，因為不易維護。
    
    ```html
    <button onclick="alert('Hello!')">點擊我</button>
    ```
    

1. **使用 DOM 的 `addEventListener`**
    
    更現代且推薦的方式是使用 JavaScript 的 `addEventListener`，可以將事件邏輯與 HTML 結構分離，提升可讀性和重用性。
    
    ```jsx
    const button = document.querySelector('button');
    button.addEventListener('click', () => {
        alert('Hello!');
    });
    ```
    

### **React 的事件處理方式**

React 的事件處理與原生 HTML 有顯著的不同，主要表現在以下幾點：

1. **使用合成事件（Synthetic Event）**
    
    在 React 中，事件處理是基於一種叫做 **合成事件（Synthetic Event）** 的機制。合成事件是一層跨瀏覽器的事件封裝，提供了一個一致的介面。React 不會直接將事件綁定到每個 DOM 元素，而是採用事件委派的方式，將所有事件統一綁定到根節點（例如 `document` 或 `root` 元素）。
    
    這樣做的好處是：
    
    - **跨瀏覽器兼容性**：自動處理不同瀏覽器之間的事件差異。
    - **效能提升**：React 使用事件委派機制，將所有事件綁定在根元素上，減少 DOM 操作。
    
    ```jsx
    function handleClick(event) {
        console.log(event.type); // "click"
    }
    <button onClick={handleClick}>點我</button>
    ```
    
2. **駝峰式命名**
    
    在 React 中，事件屬性使用**駝峰式命名（Camel Case）**，例如 `onClick`、`onMouseOver`。
    
3. **事件處理程式是函式引用**
    
    React 要求事件處理程式是函式的引用，而不是直接執行結果。這樣可以避免函式在渲染時被過早執行。
    
    **錯誤示範：**
    
    ```jsx
    function handleClick() {
        alert('點擊了');
    }
    <button onClick={handleClick()}>點我</button> // handleClick 立即執行，錯誤！
    ```
    
    **正確寫法：**
    
    ```jsx
    <button onClick={handleClick}>點我</button>
    ```
    

<br/>


## **什麼是事件傳遞？捕獲與冒泡解讀**

在 JavaScript 事件模型中，當事件觸發時，並不僅僅作用於目標元素本身，還會按照一個固定的順序傳遞。這種事件傳遞機制分為兩個主要階段：**捕獲階段** 和 **冒泡階段**。

### **事件傳遞的階段**

事件在傳遞過程中會經歷以下三個階段：

1. **捕獲階段（Capture Phase）**
    
    從 `window` 開始，沿著 DOM 樹向下傳遞到事件的目標元素。
    
2. **目標階段（Target Phase）**
    
    事件到達目標元素，並執行與該元素相關的事件處理程式。
    
3. **冒泡階段（Bubble Phase）**
    
    從目標元素開始，沿著 DOM 樹向上傳遞到 `window`。
    

這樣的流程讓開發者可以在事件傳遞的不同階段執行邏輯。

### **冒泡階段（Bubble Phase）**

**冒泡**指的是事件從目標元素向其祖先元素傳遞，直至 `window` 為止。當需要在父層統一處理子層的邏輯時，冒泡階段非常有用。

:::caution
React 默認只處理冒泡階段的事件，
:::

**範例：父元素捕獲子元素的點擊事件**

```jsx
function handleParentClick(event) {
    console.log('父層事件觸發');
    console.log('點擊的子元素是：', event.target);
}

<div onClick={handleParentClick}>
    <button>按鈕 1</button><button>按鈕 2</button>
</div>
```

**輸出結果：**

1. 當點擊「按鈕 1」時，`event.target` 是 `<button>`，但事件處理程式屬於 `<div>`。
2. 這種行為利用了冒泡機制，可以讓父元素統一監聽子元素的點擊事件，適用於動態新增的元素。

### **捕獲階段（Capture Phase）**

**捕獲**指的是事件從 `window` 開始向下傳遞，直到目標元素。當需要攔截某些特定事件時，捕獲階段可以優先處理。

前面提到，React 預設只處理 **冒泡階段** 的事件。如果我們需要在捕獲階段處理事件，可以在事件名稱後加上 `Capture`，例如 `onClickCapture`。

**範例：捕獲事件的使用**

```jsx
function handleCapture(event) {
    console.log('捕獲階段');
}

function handleBubble(event) {
    console.log('冒泡階段');
}

<div onClickCapture={handleCapture} onClick={handleBubble}>
    <button>點擊我</button>
</div>
```

**執行順序：**

1. `handleCapture` 執行（捕獲階段）。
2. `handleBubble` 執行（冒泡階段）。


<br/>


## **捕獲與冒泡的實際應用**

看到這邊你可能會想：「我在日常開發中真的需要關心捕獲和冒泡嗎？不能一招 onClick 打天下嗎」答案是 **視情況而定**。以下我來舉一些常見的例子

### **冒泡階段的應用**

冒泡階段特別適合用於以下場景：

**1. 父元素統一監聽子元素的事件**

這種模式常被稱為 **事件委派（Event Delegation）**。它能夠有效減少事件監聽器的數量，並支持動態新增或刪除子元素。

**範例：列表項的點擊事件**

假設我們有一個動態生成的列表，每個項目都需要響應點擊事件。可以在父層 `<ul>` 上添加事件監聽器，通過 `event.target` 獲取具體被點擊的項目。

```jsx
function handleItemClick(event) {
    console.log('點擊的項目是：', event.target.textContent);
}

<ul onClick={handleItemClick}>
    <li>項目 1</li>
    <li>項目 2</li>
    <li>項目 3</li>
</ul>

```

**2. 全局事件監聽**

在某些情況下，我們需要監聽整個頁面中的某類事件。例如，只在點擊彈窗以外的頁面空白處時才隱藏彈窗。

**範例：點擊空白處關閉彈窗**

```jsx
function Modal({ onClose }) {
    function handleOutsideClick(event) {
        if (event.target.id === 'modal-background') {
            onClose(); // 僅在點擊背景時觸發
        }
    }

    return (
        <div id="modal-background" onClick={handleOutsideClick}>
            <div className="modal-content">
                <p>這是一個彈窗</p>
            </div>
        </div>
    );
}
```

### **捕獲階段的應用**

捕獲階段適合處理需要「優先攔截」的場景，讓特定邏輯早於其他事件執行。

**1. 攔截全局事件**

捕獲階段適合在事件到達目標元素之前攔截並處理邏輯。例如，全局鍵盤監聽。

**範例：按下 `Escape` 鍵關閉彈窗**

```jsx
useEffect(() => {
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal(); // 關閉彈窗
        }
    }
    document.addEventListener('keydown', handleKeyDown, true); // 捕獲階段
    return () => document.removeEventListener('keydown', handleKeyDown, true);
}, []);
```

**分析：**

- `true` 表示在捕獲階段執行監聽邏輯。
- 適合需要優先執行的邏輯，例如攔截鍵盤操作。

**2. 特定元素優先處理**

有時，我們希望某些元素的事件能夠在目標元素邏輯執行前處理。例如，記錄用戶行為的追蹤工具，可以在捕獲階段蒐集事件資料。

**範例：用戶行為追蹤**

```jsx
function handleCapture(event) {
    console.log('事件捕獲：', event.type, event.target);
}

<div onClickCapture={handleCapture}>
    <button>點擊我</button>
</div>

```


<br/>


## **如何阻止事件傳遞？**

現在我們已經知道當事件觸發時，會根據事件模型的規則在**捕獲階段**和**冒泡階段**進行傳遞。但在某些情況下，我們可能希望事件在特定的邏輯處理後就終止傳播，避免影響其他元素的行為。JavaScript 提供了 `event.stopPropagation()` 方法來實現這一目標。

以下我們來看幾個實際的應用場景：

**1. 防止父層事件被觸發**

有時，我們希望某個子元素處理事件後，阻止該事件繼續冒泡到父層。例如，在一個模態框內的按鈕點擊時，不應觸發背景的關閉邏輯。

**範例：點擊按鈕時不關閉模態框**

```jsx
function Modal({ onClose }) {
    function handleBackgroundClick() {
        onClose();
    }

    function handleButtonClick(event) {
        event.stopPropagation(); // 阻止事件冒泡到背景
        console.log('按鈕被點擊');
    }

    return (
        <div onClick={handleBackgroundClick} style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ padding: '20px', background: 'white' }}>
                <p>這是一個模態框</p>
                <button onClick={handleButtonClick}>按鈕</button>
            </div>
        </div>
    );
}
```

- 當點擊背景時，觸發 `handleBackgroundClick` 關閉模態框。
- 當點擊按鈕時，`handleButtonClick` 使用 `event.stopPropagation()`，阻止事件冒泡到背景。

**2. 停止全局事件的影響**

當頁面設置了全局事件監聽器時，內層的某些互動不應觸發全局邏輯。例如，一個嵌套表單的提交按鈕，不應觸發父層監聽的 `click` 事件。

**範例：嵌套按鈕的行為控制**

```jsx
function App() {
    function handleGlobalClick() {
        console.log('全局點擊事件');
    }

    function handleInnerClick(event) {
        event.stopPropagation(); // 阻止冒泡
        console.log('內層按鈕事件');
    }

    return (
        <div onClick={handleGlobalClick} style={{ padding: '20px', border: '2px solid blue' }}>
            <p>外層點擊區域</p>
            <button onClick={handleInnerClick}>內層按鈕</button>
        </div>
    );
}
```

- 點擊按鈕時，僅觸發 `handleInnerClick`。
- 點擊外層區域時，觸發 `handleGlobalClick`。


<br/>


## **如何阻止瀏覽器的預設行為？**

在上一節中，我們學到了如何使用 `event.stopPropagation()` 阻止事件的傳遞，避免某些不必要的邏輯被觸發。然而，事件的影響不僅限於傳播，還涉及到瀏覽器的**預設行為**。

在許多互動場景中，瀏覽器會對某些事件觸發一系列預設行為。例如：

- **表單事件：** 當表單被提交時，瀏覽器會嘗試重新載入頁面。
- **超連結點擊：** 點擊 `<a>` 元素時，瀏覽器會跳轉到 `href` 指定的目標地址。
- **鍵盤事件：** 按下 `Enter` 鍵時，可能會觸發表單提交。

當這些預設行為不符合我們的需求時，可以使用 `event.preventDefault()` 方法，它不會影響事件的傳遞，但會阻止瀏覽器執行與該事件相關的預設操作。

以下我們來看幾個應用場景：

**1. 避免表單提交刷新頁面**

在表單處理時，我們常常需要阻止瀏覽器的預設提交行為，以便執行自定義邏輯（例如 Ajax 提交）。

**範例：表單提交邏輯**

```jsx
function handleSubmit(event) {
    event.preventDefault(); // 阻止預設的表單提交行為
    alert('表單提交已被攔截');
    // 在這裡執行自定義提交邏輯
}

<form onSubmit={handleSubmit}>
    <input type="text" placeholder="輸入內容" /><button type="submit">提交</button>
</form>
```

**2. 防止超連結跳轉**

當我們希望使用超連結執行某些自定義操作（如切換視圖或觸發動作）而非跳轉時，可以阻止它的預設跳轉行為。

**範例：超連結作為導航按鈕**

```jsx
function handleClick(event) {
    event.preventDefault(); // 阻止跳轉
    console.log('導航至自定義路由邏輯');
}

<a href="/example" onClick={handleClick}>
    點擊我
</a>
```

- `event.preventDefault()` 阻止了瀏覽器跳轉到 `/example`。
- 可以在 `handleClick` 中執行自定義的導航邏輯（例如 React Router 的 `useNavigate`）。

**3. 攔截鍵盤快捷鍵**

有時，我們需要攔截某些鍵盤快捷鍵的預設行為，例如阻止 `F5` 刷新或 `Ctrl+S` 儲存頁面。

**範例：自定義快捷鍵**

```jsx
useEffect(() => {
    function handleKeyDown(event) {
        if (event.key === 'F5') {
            event.preventDefault(); // 阻止頁面刷新
            console.log('自定義刷新行為');
        } else if (event.ctrlKey && event.key === 's') {
            event.preventDefault(); // 阻止瀏覽器儲存
            console.log('儲存資料到伺服器');
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

- 攔截了 `F5` 和 `Ctrl+S` 的預設行為。
- 提供了自定義的行為（如自動儲存資料或避免刷新）。


<br/>


## **Reference**

- [**React 官方文件：Responding to Events**](https://react.dev/learn/responding-to-events)
- [**MDN：JavaScript 事件的捕獲與冒泡**](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events)