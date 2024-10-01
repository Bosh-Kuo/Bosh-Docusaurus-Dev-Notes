---
title: "一次學會瀏覽器常見的三種資料儲存方式 Cookie vs. SessionStorage vs. LocalStorage"
sidebar_label: "Cookie vs. SessionStorage vs. LocalStorage"
description: 本文章介紹了 HTTP 協議的無狀態特性以及在瀏覽器端常見的三種資料儲存方式：Cookie、SessionStorage 和 LocalStorage，並深入探討它們的特性、用途及差異。透過這些機制，我們可以在前端有效地保存狀態，改善使用者體驗並實現持久性的資料儲存。
last_update:
  date: 2024-10-01
keywords:
  - Cookie
  - SessionStorage
  - LocalStorage
tags: [Web]
---

> HTTP 協議本身是一種**無狀態**的通訊協議，伺服器不會保存兩個請求之間的資料（狀態）。因此，每當我們重新整理網頁時，前端的操作和資料都會消失，除非有機制幫助我們保存這些狀態。
為了解決這個問題，瀏覽器端提供了多種方式來保存資料，讓我們可以在不同的頁面之間保持狀態，甚至在關閉瀏覽器後也能保留資料。其中，**Cookie**、**SessionStorage** 和 **LocalStorage** 是三種常見的資料儲存方式，它們各自具有不同的特性和應用場景。接下來，我們將深入介紹這三者的用途與區別。
> 

## **Cookie**

### **什麼是 Cookie？**

**Cookie** 是一種小型的文本文件，通常由伺服器在使用者瀏覽網站時創建並存儲在使用者的瀏覽器中。這些小文件包含著與使用者相關的資訊，讓伺服器可以在未來訪問同一網站時恢復使用者的狀態。

### **Cookie 的特性**

- **大小限制**：每個 Cookie 的大小不能超過 4KB，並且每個域名最多只能有約 20-50 個 Cookie（取決於瀏覽器）。
- **安全性**：Cookie 在未加密的網路中傳輸時存在被竊取的風險，特別是在沒有使用 `Secure` 和 `HttpOnly` 標誌時。
- **隱私性問題**：Cookie 被廣泛用於追踪使用者行為，因此可能對隱私造成影響。

### **Cookie 的結構**

一個 Cookie 通常包含以下信息：

- **名稱 (Name)**：標識這個 Cookie 的名稱。
- **值 (Value)**：儲存的實際資料，例如使用者的識別碼。
- **域 (Domain)**：指定此 Cookie 屬於哪個域名，只有該域名的網站才能訪問這個 Cookie。
- **路徑 (Path)**：設定 Cookie 可以作用的 URL 路徑。
- **大小 (Size)**：表示這個 Cookie 的大小，以字節 (bytes) 為單位，通常由瀏覽器自動計算並顯示。
- **到期時間 (Expiration)**：設定 Cookie 的有效期，逾期後瀏覽器將刪除這個 Cookie。如果不設置到期時間，則該 Cookie 為會話 Cookie，在使用者關閉瀏覽器時自動刪除。
- **HttpOnly 標誌 (HttpOnly)**：設定此標誌可以讓 Cookie 無法被 JavaScript 訪問，增加安全性，防止 XSS 攻擊。
- **安全標誌 (Secure)**：告訴瀏覽器這個 Cookie 只能在 HTTPS 協議下傳輸，增加資料傳輸的安全性。
- **SameSite**：此標誌用於防止 CSRF（跨站請求偽造）攻擊，限制 Cookie 在跨站情況下的使用。可能的值包括：
    - **Strict**：Cookie 只會在同一站點的請求中發送。
    - **Lax**：允許部分跨站請求（如 GET 請求）發送 Cookie。
    - **None**：允許所有跨站請求，但要求必須設置 `Secure` 標誌。
- **Partition Key**：此欄位表明 Cookie 是否屬於某個特定的「隔離範疇」，例如針對第三方內容的隔離。此欄位通常由瀏覽器管理，您不需要手動設置。
- **Cross Site**：顯示 Cookie 是否可在跨站情境中使用。這通常與 `SameSite` 屬性密切相關。
- **優先級 (Priority)**：指定 Cookie 的優先級，用於決定在瀏覽器中清除 Cookie 時的順序。可能的值包括：
    - **Low**：低優先級。
    - **Medium**：中等優先級。
    - **High**：高優先級，這些 Cookie 更不容易被瀏覽器清除。

如果我們訪問一個網站，並且從開發者工具的「應用程式 (Application)」中打開它的 Cookie，我們可能會看到類似這樣的 Cookie 結構：

| **Name**   | **Value** | **Domain**  | **Path** | **Size** | **Expires**                   | **HttpOnly** | **Secure** | **SameSite** | **Partition Key** | **Cross Site** | **Priority** |
| ---------- | --------- | ----------- | -------- | -------- | ----------------------------- | ------------ | ---------- | ------------ | ----------------- | -------------- | ------------ |
| session_id | abc123xyz | example.com | /        | 16       | Fri, 31 Dec 2024 23:59:59 GMT | Yes          | Yes        | Lax          | No                | Yes            | Medium       |
| lang       | en-US     | example.com | /        | 8        | Session                       | No           | No         | Strict       | No                | No             | Low          |
### **Cookie 的用途**

- **會話管理**：保存使用者的登錄狀態，例如保持登入而不必在每次訪問新頁面時重新登入。
- **個人化設定**：記錄使用者的偏好，例如網站的語言選擇或顯示模式。
- **追踪和分析**：一些網站使用 Cookie 來記錄使用者的行為，進而提供更好的內容或目標廣告。

### **如何使用 JavaScript 操作 Cookie**

JavaScript 提供了 API 來創建、讀取、修改和刪除 Cookie。

```jsx
// 創建或修改 Cookie
document.cookie = "username=JohnDoe; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";

// 讀取 Cookie
console.log(document.cookie);

// 刪除 Cookie
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

## **SessionStorage**

### **什麼是 SessionStorage？**

**SessionStorage** 是一種在單個瀏覽器會話（Session）中儲存 key/value 結構資料的機制。它與 LocalStorage 類似，但其資料僅在當前標籤頁有效，當標籤頁關閉後，資料即會被清除。

### **SessionStorage 的**特性

- **範圍限制**：僅在當前標籤頁有效，無法跨標籤頁共享。
- **持久性**：資料會在關閉標籤頁後刪除。
- **容量限制**：儲存容量約 5-10MB。

### **SessionStorage 的用途**

- **多頁表單流程**：在多步驟的表單中，SessionStorage 可以用來保存每個步驟的資料，避免使用者因頁面刷新而丟失已填寫的部分資料。
- **單次使用者操作的狀態儲存**：例如篩選或排序操作，可以使用 SessionStorage 保存這些狀態資訊，以便在頁面刷新時恢復先前的狀態，提升使用體驗的一致性。
- **臨時的會話狀態儲存**：保存會話期間的一些臨時資料（如 Token），確保這些資料僅在當前標籤頁有效，標籤頁關閉後資料會被清除。
- **路由跳轉過程中保存資料**：在多個路由之間跳轉時，SessionStorage 可以用來保存臨時狀態（如搜尋條件），避免因跳轉導致資料丟失。
- **單標籤頁的暫存資料**：在編輯過程中，將暫存資料保存到 SessionStorage，以便使用者離開後再次返回時能恢復編輯狀態。
- **防止重複提交**：可以利用 SessionStorage 保存提交表單的唯一識別碼，防止使用者重複提交相同的資料。

### **如何使用 JavaScript 操作 SessionStorage**

JavaScript 提供了簡單的 API 來創建、讀取、修改和刪除 SessionStorage 中的數據。

```jsx
// 儲存資料
sessionStorage.setItem('username', 'JohnDoe');

// 讀取資料
console.log(sessionStorage.getItem('username'));

// 刪除資料
sessionStorage.removeItem('username');

// 清空所有資料
sessionStorage.clear();
```

## **LocalStorage**

### **什麼是 LocalStorage？**

**LocalStorage** 是一種在瀏覽器中存儲 key/value 結構資料的機制，適合儲存較長期的客戶端數據。與 SessionStorage 相似，但其數據在瀏覽器或標籤頁關閉後仍然保留，除非手動刪除。

### **LocalStorage 的特性**

- **範圍限制**：同域名下的標籤頁可以共享資料。
- **持久性**：資料會一直保留，直到手動刪除。
- **容量限制**：通常在 5-10MB。

### **LocalStorage 的用途**

- **長期儲存使用者偏好**：LocalStorage 可用來保存使用者的偏好設定，例如網站的語言、主題顏色等，即使使用者下次打開網站也能保持相同的個性化設定。
- **儲存使用者資料**：可以用來保存非敏感的使用者資料，例如使用者名稱，讓使用者不必在每次訪問時重新輸入。
- **儲存應用設定**：例如某個單頁應用的 UI 設定、側邊欄是否展開等設定，可以保存到 LocalStorage，方便使用者刷新頁面或再次訪問時保留相同的應用狀態。
- **離線應用支援**：LocalStorage 可用於儲存一些臨時資料，允許使用者在沒有網路連線的情況下繼續使用應用。例如，儲存需要在網路恢復時同步的運算元據。
- **資料快取**：在一些不頻繁更新的資料（如靜態配置）情況下，LocalStorage 可以用來快取這些資料，避免每次請求都訪問伺服器，從而提升應用的響應速度。

### **如何使用 JavaScript 操作 LocalStorage**

JavaScript 提供了簡單的 API 來建立、讀取、修改和刪除 LocalStorage 中的資料。

```jsx
// 儲存資料
localStorage.setItem('username', 'JohnDoe');

// 讀取資料
console.log(localStorage.getItem('username'));

// 刪除資料
localStorage.removeItem('username');

// 清空所有資料
localStorage.clear();
```

## **三者異同總整理**

| **特性**       | **Cookie**                                   | **SessionStorage**                         | **LocalStorage**                        |
| -------------- | -------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| **持久性**     | 可設置有效期，會話 Cookie 在瀏覽器關閉時清除 | 僅限於當前標籤頁或窗口，關閉即刪除         | 持久保存，直到被手動刪除                |
| **容量**       | 通常最大 4KB                                 | 通常在 5-10MB                              | 通常在 5-10MB                           |
| **作用範圍**   | 同一域名下所有標籤頁共享                     | 僅限於當前標籤頁，無法跨頁共享             | 同一域名下所有標籤頁共享                |
| **安全性**     | 可設定 `Secure` 和 `HttpOnly` 標誌           | 只能被 JavaScript 存取，受 XSS 攻擊風險    | 只能被 JavaScript 存取，受 XSS 攻擊風險 |
| **伺服器通信** | 可隨 HTTP 請求自動傳送至伺服器               | 不會隨 HTTP 請求自動傳送                   | 不會隨 HTTP 請求自動傳送                |
| **用途**       | 會話管理、個人化設定、追踪與分析             | 單次會話中的暫存數據，防止頁面刷新資料丟失 | 長期儲存使用者設定、資料快取及離線支援  |

## **Reference**

- [**ExplainThis - 請描述 cookie, sessionStorage 和 localStorage 的差異**](https://www.explainthis.io/zh-hant/swe/cookie-sessionstorage-localstorage-difference)
- [**【JavaScript】Cookie、LocalStorage、SessionStorage**](https://molu.in/blog/JavaScript-cookie-localStorage-sessionStorage/)