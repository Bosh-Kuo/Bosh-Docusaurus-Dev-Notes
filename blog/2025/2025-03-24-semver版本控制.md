---
title: "軟體工程基本功：用 Semver 駕馭版本控制的藝術"
slug: semver
authors: bosh
description: 這篇文章從我親身踩坑的經驗出發，帶你一步步理解 Semantic Versioning（語意化版本）是什麼、該怎麼判斷要升哪個欄位、以及常見的誤解與實務應用。無論你是剛接觸版本管理的新手，還是想幫團隊建立更穩定發佈流程的工程師，都能在這篇筆記中找到實用觀念與範例。
keywords: [Semver, Semantic Versioning, 版本管理, 語意化版本]
tags: [Software Engineering]
date: 2025-03-24
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1742804790/Docusaurus%20Blog/Blog/Semver/semver_fj3cz7.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1742804790/Docusaurus%20Blog/Blog/Semver/semver_fj3cz7.png)

<!-- truncate -->

## **論版本號的重要性，從一個掉進坑裡的故事說起**

我剛社會第一年的時候，對套件版本隱藏的相容性問題沒什麼概念，還記得當時我看到一個平常在用的套件發布了最新版，心想：

> 「哦～有新版本釋出了！第五版耶，官網上描述的新功能看起來挺酷的，更新來玩玩看好了。」
> 

我就不假思索，直接把我專案裡原本用的第四版套件升級到第五版。誰知道這麼一升級，我整個專案就跑不起來了。翻了一下文件才發現，原本我用的某些 API 在第五版已經被移除了，甚至連套件的引入方式都整個改掉了。

舉例來說，原本這樣寫是沒問題的：

```tsx
import functionA from 'some-library';
```

但新版本強制使用 named import，變成要這樣寫才行：

```tsx
import { functionA } from 'some-library';
```

後來我才知道，這是因為這個套件升級的是「**大版號（Major）**」，代表它可能包含**破壞性變更（breaking changes）**，使用方式可能會跟之前不一樣。也正是從這次經驗開始，我才慢慢了解版本號其實**不是只是個數字而已**，而是有一套設計邏輯與意圖，背後還有「**語意化版本（Semantic Versioning）**」這個規則存在。

後來，我在工作上也接觸到了開發與維護套件的任務，成為了套件與原始碼的維護方，**Semantic Versioning** 這套軟體版本管理的原則變得更加重要，因為套件版本管理的好與壞會直接影響到團隊協作、使用者體驗，甚至是產品的穩定性。這篇文章我想帶大家一起來探索 **Semantic Versioning** 的核心概念與我在實際維護套件時的一些經驗，礙於篇幅可能沒辦法涵蓋到 **Semantic Versioning** 的所有細節，建議讀者有時間的話可以搭配 [Semantic Versioning 2.0.0 官方文件](https://semver.org/) 一起閱讀。


<br/>


## **語意化版本（Semantic Versioning）是什麼？基礎規則與範例一次搞懂**

版本號其實是種「溝通的語言」，那麼這個語言是怎麼設計的呢？這就要介紹 **Semantic Versioning**（簡稱 **SemVer**）。

### **語意化版本的格式：`MAJOR.MINOR.PATCH`**

SemVer 採用一種簡單的三位數格式：

```
MAJOR.MINOR.PATCH
```

各位數的意義如下：

| 欄位  | 說明                              |
| ----- | --------------------------------- |
| MAJOR | **破壞性變更**：不相容的 API 變更 |
| MINOR | **新增功能**：向下相容的功能擴充  |
| PATCH | **修復錯誤**：向下相容的 bug 修正 |

來看幾個簡單的例子：

- `1.2.3` → `1.2.4`：修了一個小 bug（patch）
- `1.2.3` → `1.3.0`：加入一個新功能（minor）
- `1.2.3` → `2.0.0`：有破壞性變更，升級需特別注意（major）

:::tip
SemVer 的核心精神是「傳遞改動的意圖」。給出版本號，不只是「程式寫完了」，更是告訴使用者：「這次我改了什麼，影響到你嗎？」
:::

### **預發布版本與建構元資料**

除了主版本號，SemVer 還支援額外的標記，用來描述還沒正式發布或內部用途的預發布版本（Pre-release）:

```
格式為：1.0.0-<標記>
```

常見標記有：

- `1.0.0-alpha`：非常早期，可能還不穩
- `1.0.0-beta`：比 alpha 穩定，仍可能有問題
- `1.0.0-rc.1`（release candidate）：候選版本，準備好要正式釋出了

> 📌 預發布版本不會自動被安裝，除非你特別指定，例如 npm install some-lib@beta
> 

## **該升級哪個版本號？用元件庫範例學會判斷 `Patch / Minor / Major`**

上一章我們學會了版本號三個欄位的意義，這章就要帶大家進入實務場景，用 **Component Library** 的範例，幫你建立「版本直覺」。判斷邏輯其實可以簡化成一個簡單的直覺：

> 會壞就 bump `major`，加功能就 bump `minor`，修 bug 就 bump `patch`。
> 

### **🔴 大版號（Major, `X.0.0`）：破壞性變更（Breaking Changes）**

當你做出「**升級後原本的寫法會壞掉**」的改動，就屬於破壞性變更，應該 bump `MAJOR`。

**✅ 刪除或修改現有 API**

```tsx
// v1.x 寫法
<Button variant="outlined" />

// v2.0.0 移除 `variant` prop
<Button /> // 🚨 升級後錯誤：variant 不被支援

```

**✅ 改變命名或使用方式**

```tsx
// v1.x
<Modal isOpen={true} />

// v2.0.0 改為 open（更貼近 HTML 標準）
<Modal open={true} /> // 🚨 需要改程式碼才能用
```

**✅ 改變元件的預設行為**

- 原本 `Table` 預設是 server-side pagination，改為 client-side → 會直接改變使用者的畫面與資料邏輯。

**✅ 改變 TypeScript 類型（造成型別不相容）**

```tsx
// v1.x
type InputProps = {
  value: string | number;
}

// v2.0.0 僅接受 string
type InputProps = {
  value: string;
}
```

這會導致原本傳 `number` 的使用者出現型別錯誤。

:::tip[判斷提示]
只要升級會讓現有的寫法不能用，就是 breaking change。
:::

### **🟡 中版號（Minor, `X.Y.0`）：新增功能但相容**

只要是**加東西但不破壞原有功能**，通常都可以放心 bump `MINOR`。

**✅ 新增新的 prop**

```tsx
// v1.2.0
<Tooltip content="Hi" />

// v1.3.0 新增 delay prop
<Tooltip content="Hi" delay={300} /> // ✅ 舊寫法照常可用
```

**✅ 新增支援的事件**

```tsx
// v1.2.0
<Button onClick={handleClick} />

// v1.3.0 新增 onDoubleClick
<Button onClick={handleClick} onDoubleClick={handleDoubleClick} />
```

**✅ 新增樣式選項、變體**

```tsx
// v1.3.0 新增 variant="secondary"
<Button variant="secondary" />
```

**✅ 新增元件**

```tsx
// v1.4.0 加入 AvatarGroup
<AvatarGroup>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
</AvatarGroup>
```

:::tip[判斷提示]
新增功能，但不會讓使用者既有程式碼壞掉，就是 minor。
:::

### **🟢 小版號（Patch, `X.Y.Z`）：錯誤修正與內部優化**

這類改動的特點是：**使用者的寫法不變，但效果更好或問題被修正了。**

**✅ 修 bug**

```tsx
// v1.2.3: Modal 的 onClose 不會觸發（bug）

// v1.2.4 修正後
<Modal open={true} onClose={() => console.log('關閉')} />
```

使用方式完全沒改，但行為正確了。

**✅ 修樣式問題**

- 修正 `Button` 在 Firefox 中 padding 過大的問題。

**✅ 效能優化、不影響 API 的重構**

- `Table` 加上虛擬化，提升渲染效能
- 移除多餘的 re-render，但對外部 API 無影響

**✅ 改進 TypeScript 定義（不影響現有用法）**

```tsx
// v1.2.3
type TextFieldProps = {
  onChange: (value: any) => void;
}

// v1.2.4
type TextFieldProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

對使用者來說可選擇更明確的型別，但舊寫法仍可用。

**✅ 升級相依套件但不影響對外行為**

```
chore(deps): update react to 18.2.0
```

:::tip[判斷提示]
使用者感受不到改動，但行為更正確、更穩定，就是 patch。
::: 


<br/>


## **Semantic Versioning 常見問題整理**

到了這裡，相信你對 **Semantic Versioning** 已經有一定掌握了。不過在實務中，還是常會遇到一些讓人搞混的地方。本章我們就用 **常見問題 FAQ 的方式**，快速釐清一些細節與誤解。

### **❓我只改了內部邏輯，沒改 API，還需要 bump 版本號嗎？**

✅ **需要**。

即使 API 沒變，但如果改動可能導致元件行為變化（例如回傳值不同、預設行為變了），就應該 bump 版本，視影響程度選擇適當欄位。

> 📌 常見錯誤：「內部邏輯不算 API」
> 
> 
> 👉 實際上，**行為**也是一種 API。只要使用者感受得到變化，就要負責。
> 

### **❓已經 deprecated 的功能，如果移除了，算是 breaking change 嗎？**

✅ **是**，**還是 breaking change**，應該 bump **Major**。

就算功能早已標註 deprecated，只要使用者還能用，就不能隨意移除。移除的那一刻，仍然是破壞性改動。

> ⚠️ 重要觀念：deprecated 是預告，不代表你可以跳過版本規則。
> 

### **❓我新增了一個參數（prop），但改變了元件預設行為，這樣算 breaking change 嗎？**

🟠 **視情況而定**，但通常應該算是 **breaking change**。

舉例來說：

```tsx
// 原本 Tooltip 預設永遠顯示在右側
<Tooltip content="Hi" />

// 新版新增 `placement`，但預設改成 bottom
<Tooltip content="Hi" />
```

雖然寫法沒變，但畫面結果改了，可能影響使用者體驗或布局。這類行為建議 bump **Major** 或至少寫清楚 release notes。

> 💡 判斷依據：使用者不修改程式碼卻出現不同結果 → 通常就算是 breaking。
> 

### **❓我看到套件版本是 `0.1.0`，這代表它穩定了嗎？**

❌ **不是**。

根據 SemVer 定義，只要是 `0.x.y` 版本，代表這個專案還在「開發階段」，**不保證 API 穩定**。任何欄位變動都可能是 breaking change。

> 📌 常見誤解：「0.1.0 應該就是第一版吧？」
> 
> 
> 👉 錯，**`1.0.0` 才代表第一個穩定版**，這時才開始遵守 MAJOR/MINOR/PATCH 的變更邏輯。
> 

### **❓可以用日期版本（像 `2024.03.01`）來取代 SemVer 嗎？**

✅ **可以，但目的不同**。

這種稱為 **CalVer（Calendar Versioning）**，適合快速迭代的產品（如 Ubuntu、Chrome）。但如果你的專案強調 API 穩定性與相容性，**SemVer 更適合用來溝通版本意圖**。

> 📌 CalVer 看得出發行時間，但看不出改動類型；SemVer 則反過來。
> 

### **🧩 額外補充：npm 中的 `^` 跟 `~` 是什麼意思？**

這些符號是用來表示「可以接受的版本範圍」。

| 符號 | 意思                | 範例                            |
| ---- | ------------------- | ------------------------------- |
| `^`  | 同一個 MAJOR 內最新 | `^1.2.3` → 可以裝到 `1.999.999` |
| `~`  | 同一個 MINOR 內最新 | `~1.2.3` → 可以裝到 `1.2.x`     |

> ✅ 小結：^ 比 ~ 更寬鬆。選擇哪個要看你想控制更新的程度。
> 

### **🔐 `package-lock.json` 的角色是什麼？**

即使 `package.json` 使用了版本範圍（如 `^1.2.3`），實際安裝時會根據 `package-lock.json` 中**記錄的精確版本**來進行安裝。

這樣做的好處是：

- 確保你團隊每次安裝的套件版本一致
- 避免「今天能跑、明天壞掉」的神祕 bug

> 📌 小提醒：如果你刪掉 lock file 再裝一次，可能會裝到不一樣的版本。
> 


<br/>


## **結語**

當我們的程式碼不再只是自己用，而是給團隊、開源社群，甚至未來的自己使用時，版本管理就不再是選項，而是基本功的一部分。希望這篇文章能幫助你更清楚 Semantic Versioning 的精神與實務應用，無論你是正在維護套件、架構元件庫，還是只是好奇版本號背後的設計哲學，都能從中找到一些啟發。

如果你正在維護一個套件、元件庫，或只是想讓自己的 side project 更有品質，不妨從下一個 release 開始，認真地思考這次改動該升哪個號碼吧！


<br/>


## **Reference**

- [**Semantic Versioning 2.0.0**](https://semver.org/)