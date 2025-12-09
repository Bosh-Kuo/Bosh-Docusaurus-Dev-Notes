---
title: onClick 還是 handleClick？淺談 React 事件處理的命名慣例
sidebar_label: "Event Handler 的命名慣例"
description: 雖然命名上並沒有「正確答案」，但為了理清思緒並統一未來的實作方式，我整理了 React 社群中關於事件處理命名的常見慣例，也分享一些自己的理解，希望能幫助讓程式碼更具一致性與可讀性。
slug: "/React/event-handler-naming-convention"
last_update:
  date: 2024-11-16
keywords: [React event handler naming, React props naming conventions, onClick vs handleClick]
tags: [React]
---

> **前言：**  
> 隨著 React 開發經驗的累積，我開始對專案中命名原則的一致性這件事越來越在意。在維護公司專案時常常會看到同樣是事件處理函數，有的地方以 `onXXX` 命名 ，有的地方則是 `handleXXX`。這樣的情況在定義 props 時尤為明顯：假設一個 callback function 要從元件 A 傳到 B 再傳到 C，明明傳遞的是同一個東西，但在元件 B 的 props 中叫做 `onXXX`，到了元件 C 又被改命名為 `handleXXX`，導致我在追蹤程式邏輯時不免覺得煩躁。
> 
> 雖然命名上並沒有所謂的「正確答案」，但為了理清思緒並統一我自己寫程式的命名風格，我整理了 React 社群中關於事件處理命名的常見慣例，也分享一些自己的理解，希望能幫助讓程式碼更具一致性與可讀性。
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
    

### **容易引起疑惑的事件處理命名**

當事件處理函數需要跨元件傳遞時，命名上的選擇往往會帶來困擾：

1. 父元件定義了一個事件處理函數，應該命名為 `handleClick` 還是 `onClick`？    
    如果命名為 `onClick`，可能會與 HTML 屬性混淆，但命名為 `handleClick`，又似乎少了一些「事件觸發」的語意。
    
2. 子元件接收到 props，應該命名為 `onClick` 還是 `handleClick`？    
    作為一個暴露的 API，`onClick` 更符合直覺，但內部若混用 `handleClick` 來處理邏輯，命名一致性可能會出現問題。
    

這邊舉一個我在工作時常遇到的例子。  
你可以停下來數數看同個 callback function 在傳遞的過程中換過幾次名字：

```jsx
function GrandParent() {
  const onClick = () => console.log("Button clicked!");  // GrandParent 命名了一個叫做 "onClick" 的 callback function

  return <Parent handleClick={onClick} />;  // GrandParent 把 "onClick" 作為 Parent 期望接收到的 "handleClick" 傳遞給 Parent
}

function Parent({ handleClick }) {
  return <Child handleSuccess={handleClick} />; // Parent 把接收到的 "handleClick" 作為 Child 期望接收到的 "handleSuccess" 傳遞給 Child
}

function Child({ handleSuccess }) {
  return <button onClick={handleSuccess}>Click me</button>; // Child 把接收到的 "handleSuccess" 綁定到 button 的 onClick 事件上
}
```
> 嗯，沒錯，3 次喔 ...

從上面的例子可以知道，當沒有一致的事件處理命名風格時，三個 Components 就足以讓你感到困惑了，更不用說工作時面對的商業級別規模的專案，trace code 起來只有滿滿的心累...


<br/>


## **React 中的事件命名慣例**

### **命名問題的核心：語意與責任的混淆**

說到事件處理的命名問題，其實背後主要圍繞兩個核心概念：**語意性**和**責任清晰性**。

- **語意性**：好的命名應該能直觀地表達這段程式碼的用途，讓開發者在閱讀時一目了然。例如，`handleClick` 就能很清楚地表示這是一個用來處理點擊事件的函數，而 `onClick` 則能直接聯想到這是點擊事件的入口。
- **責任清晰性**：命名應該反映程式碼的責任範疇，讓人知道這段程式碼的職責是什麼。特別是在 callback function 被多層傳遞的情況下，名稱需要保持一致，否則不僅會增加閱讀負擔，也容易讓開發者對事件的流向感到困惑。

舉例來說，當父元件定義一個函數時，應如何命名才能清楚地表達這個函數的處理邏輯？而子元件暴露的 props，則應如何命名才能讓人一眼看出它是事件觸發的入口？如果這些細節處理不當，程式碼的可讀性和維護性就會大大降低。

### **主流的事件處理命名慣例**

React 中，大家常見的兩種命名慣例其實是圍繞兩個概念：**事件的觸發**與**事件的處理邏輯**。分別使用 `onXXX` 和 `handleXXX`，每個名稱其實都有它適合的場景。

1. **`onXXX`：事件觸發的入口**
    - **適用場景**：
        - **暴露事件接口**：當你要將一個事件處理函數暴露給父元件時，這時使用 `onXXX` 命名會比較直觀。例如 `onClick` 或 `onChange`。
        - **保持語意一致**：`onXXX` 通常與 HTML 的事件屬性名稱保持一致，像是 `<button onClick={...}>`，這樣會比較符合使用者的直覺。
    - **語意**：
        
        > 我不在意傳入的函數的實作細節，我只在意外部有沒有按照我定義的格式實作這個函數，以及在什麼時機要 call 這個函數。
        > 
2. **`handleXXX`：事件處理的實際邏輯**
    - **適用場景**：
        - **內部邏輯實作**：當元件內部需要定義具體的行為邏輯時，通常使用 `handleXXX`。例如 `handleClick` 或 `handleSubmit`。
        - **清楚表達意圖**：這樣的命名能清楚表達函數的目的，讓人一看就知道它是用來「處理」某個事件的。
    - **語意**：
        
        > 我不在意這個函式會在綁定在哪個元件上，我只在意當某事件發生時，應該處理什麼邏輯。
        > 

:::tip
結論：

- 只要是在傳遞 callback function 的地方，使用 `onXXX` 就對了。
- 只要是在實作 callback function 的地方，`handleXXX` 就是比較合適的選擇。
:::

為了讓兩種命名方式的差異更清楚，我們接下來用兩個實際案例來說明。



### **範例 1：Table 刪除按鈕的事件處理**

假設我們需要在一個資料表格（Table）中為每一行增加一個刪除按鈕，這裡我們會用 `onDelete` 作為事件入口，並用 `handleDelete` 處理刪除的邏輯。

1. **父元件定義刪除邏輯：**
父元件負責定義具體的刪除邏輯，函數名稱應該表達它的用途——處理刪除行為，因此命名為 `handleDelete`。
    
    ```jsx
    function TableContainer() {
      const handleDelete = (rowId) => {
        console.log(`Deleting row with id: ${rowId}`);
      };
    
      return <Table onDelete={handleDelete} />;
    }
    ```
    
2. **子元件處理按鈕事件：**
Table 元件作為中間層，負責將刪除事件傳遞給 `columns` 的設定。在這裡，`onDelete` 直接作為一個 props 傳遞下去，表明它是刪除事件的入口。
    
    ```jsx
    function Table({ onDelete }) {
      const columns = [
        {
          key: "action",
          renderElement: (row) => (
            <button onClick={() => onDelete(row.id)}>Delete</button>
          ),
        },
      ];
    
      return <TableRenderer columns={columns} />;
    }
    ```
    
3. **最終的按鈕綁定：**
在 `renderElement` 中，我們直接將 `onDelete` 綁定到按鈕的 `onClick` 上，實現刪除事件的觸發。

### **範例 2：確認對話框的按鈕事件**

假設我們有一個「確認對話框」（Confirm Dialog）元件，這個對話框會顯示一段訊息，並在按下「確認」按鈕時觸發父元件定義的行為。由於事件需要在多層元件中傳遞，以下是正確的命名方式及解釋：

1. **祖父元件定義邏輯：**
    
    最外層的元件負責定義具體的業務邏輯，負責處理「確認」按鈕點擊後的行為，因此使用 `handleConfirm` 命名來強調它的職責是處理事件。
    
    ```jsx
    function GrandParent() {
      const handleConfirm = () => {
        console.log("Form submitted!");
      };
    
      return <Parent onConfirm={handleConfirm} />;
    }
    ```
    
2. **父元件傳遞事件：**
    
    中間層的元件（Parent）只負責接收 `onConfirm` ，保持名稱一致並將其傳遞給下一層，不會直接改變邏輯的責任。
    
    ```jsx
    function Parent({ onConfirm }) {
      return <Child onConfirm={onConfirm} />;
    }
    ```
    
3. **子元件處理按鈕事件：**
    
    子元件（Child）負責渲染確認對話框，並將接收到的 `onConfirm` 綁定到話框內部，語意上表明「點擊按鈕後，會觸發此事件」。
    
    ```jsx
    function Child({ onConfirm }) {
      return (
        <ConfirmDialog
          message="Are you sure you want to proceed?"
          onConfirm={onConfirm}
        />
      );
    }
    ```
    
4. **確認對話框內部綁定按鈕事件：**
    
    確認對話框內部將傳遞過來的 `onConfirm`，幫定於按鈕的 `onClick` (負責觸發傳入的事件入口)。
    
    ```jsx
    function ConfirmDialog({ onConfirm, message }) {
      return (
        <div>
          <p>{message}</p>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      );
    }
    ```


<br/>


## **Reference**

- [**@stack overflow - What is the right name of event handler? onClick or handleClick? [closed]**](https://stackoverflow.com/questions/60048249/what-is-the-right-name-of-event-handler-onclick-or-handleclick)
- [**How to Handle Events in React – Explained with Code Examples**](https://www.freecodecamp.org/news/how-to-handle-events-in-react-19/)
- [**Responding to Events**](https://react.dev/learn/responding-to-events)