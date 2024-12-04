---
title: "Gitmoji x Conventional Commit 工作流 (二) - 使用 Commitlint + Husky 校驗提交格式"
slug: gitmoji-x-conventional-commit-workflow-commitlint-husky
authors: bosh
description: 在這篇文章中，我們將深入探討如何透過 Commitlint 校驗提交訊息格式，並利用 Husky 自動化校驗流程，確保提交訊息始終符合規範。不論是 不使用 Gitmoji 還是 使用 Gitmoji 的情境，我們都將展示具體的配置與效果，幫助你打造嚴謹又高效的提交工作流。
keywords: [Conventional Commits, Gitmoji, Commitizen, Commitlint, Husky, Git-hook, commitlint-config-cz, commitlint-config-gitmoji]
tags: [實作紀錄]
date: 2024-12-01
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1733057459/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-2_obvtrb.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1733057459/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-2_obvtrb.png)

## **前言**
在上一篇文章中，我們介紹了如何透過 **Commitizen** 與 **Gitmoji** 規範化提交訊息。但規範的建立並不保證會被嚴格執行，許多團隊仍可能面臨這樣的情況：

> 「提交訊息格式看起來很簡單，但實際操作時，不是漏寫了類型，就是格式寫錯了。」
> 

這種情況下，提交訊息的規範就形同虛設。因此，若要確保提交訊息始終符合規範，勢必得設立一道自動化檢核機制來攔截不合格的提交。

這正是 **Commitlint** 發揮作用的地方！它專門校驗提交訊息是否符合規範，無論是 Conventional Commits 還是 Gitmoji，都可透過自定義配置嚴格檢查，避免不合格的提交進入版本控制歷史。當然，工具的強大功能需要在正確的時間觸發才能發揮作用，搭配 **Husky**，我們能利用 Git hooks 在提交前自動執行 Commitlint 的校驗邏輯，將自動化檢核落實於日常開發流程。

本篇文章將帶你實作以下內容：

1. **不使用 Gitmoji 的提交校驗**：延續前一篇的配置，透過 **@commitlint/config-conventional** 校驗提交訊息。
2. **使用 Gitmoji 的提交校驗**：加入 **commitlint-config-gitmoji** 與 **commitlint-config-cz**，支援帶有 Emoji 的訊息格式。
3. **整合 Husky**：將 Commitlint 校驗嵌入 Git Hooks，阻止不符合規範的提交。

<!-- truncate -->

## **提交訊息校驗工具: Commitlint**

**Commitlint** 是一個專門用來檢查提交訊息格式的工具，能根據預設規範或自訂規則檢查每一筆提交訊息是否合格。它的核心功能包括：

1. **校驗提交訊息格式**：確保每次提交的訊息都符合既定規範，例如 Conventional Commits 或自訂的 Gitmoji 規範。
2. **即時阻止不合規提交**：透過與 Git Hooks 的整合（如搭配 Husky），在提交階段自動執行校驗邏輯，避免錯誤訊息進入版本控制歷史。
3. **高度可擴展性**：支援多種現成的規範配置，例如 **@commitlint/config-conventional**、**commitlint-config-gitmoji**，也可自定義檢核規則。

舉例來說，以下這樣的提交訊息格式符合 Conventional Commits 的規範：

```bash
feat(api): add new endpoint for user authentication
```

但若提交訊息不符合規範，例如這樣：

```bash
updated something
```

Commitlint 會立即提示錯誤，並阻止提交，確保不規範的訊息不會進入版本控制歷史。


<br/>


## **實作一：不使用 Gitmoji 的 Commitlint 配置**

在上一篇中，我們針對不使用 Gitmoji 的情境提出了兩種工具選擇：

1. **cz-conventional-changelog**    
    配置簡單，生成的提交訊息符合 Conventional Changelog 標準，可直接通過 **`@commitlint/config-conventional`** 的檢核。
    
2. **@commitlint/cz-commitlint + @commitlint/config-conventional**    
    從 commitlint 的角度出發，根據指定規則（設定於`commitlint.config.js`）生成提交訊息，適合需要自定義驗證規則的專案。
    

本節將延續第一篇文章中的設定，透過 **Commitlint** 與 **@commitlint/config-conventional**，實現基於 Conventional Commits 規範的提交訊息校驗，並確保提交符合標準格式。

### **安裝與配置 Commitlint**

**步驟 1：安裝 Commitlint**

在專案中安裝 Commitlint CLI 和 Conventional Commits 的預設配置：

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

**步驟 2：新增配置文件**

在專案根目錄新增 `commitlint.config.js` 文件，內容如下：

```jsx
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

這裡的配置表示我們將使用 Conventional Commits 的規範。

### **整合 Commitizen 與 Commitlint**

為了讓提交訊息規範與 Commitizen 完美配合，我們將測試使用 **cz-conventional-changelog** 或是 **@commitlint/cz-commitlint + @commitlint/config-conventional** 這兩種方法生成的提交訊息是否符合 **@commitlint/config-conventional** 的校驗標準。

**步驟 1：在 `package.json` 中配置 Commitizen**

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog" // 或 @commitlint/cz-commitlint
    }
  }
}
```

**步驟 2：使用 Commitizen 產生互動式提交**

使用以下命令啟動互動式提交：

```bash
npm run commit
```

假設我們在互動式提交中輸入以下訊息：

```
type: feat
scope: api
subject: add authentication endpoint
```

Commitizen 生成的提交訊息將是：

```
feat(api): add authentication endpoint
```

**步驟 3：測試 Commitizen 產生的提交訊息**

Commitlint 安裝完成後，可以使用以下命令測試前一個提交訊息的校驗：

```bash
npx commitlint --from=HEAD~1 --to=HEAD
```

執行上述命令後，Commitlint 不會報錯，表示提交訊息符合規範。

**步驟 4：測試不符合規範的提交訊息**

嘗試手動輸入一條不符合規範的提交訊息，例如：

```bash
update something
```

Commitlint 會提示錯誤，阻止提交：

```bash
⧗   input: update something
    ✖   type must not be empty [type-empty]
    ✖   found 2 problems, 0 warnings
```


<br/>


## **實作二：使用 Gitmoji 的 Commitlint 配置**

在上一節中，我們實作了不使用 Gitmoji 的提交訊息校驗。本節將專注於帶有 Gitmoji 的提交訊息，並介紹兩個 Commitlint 配置模組 **commitlint-config-gitmoji** 與 **commitlint-config-cz** 的作用與差異，幫助你選擇適合的工具來進一步規範提交工作流。

### **commitlint-config-gitmoji 與 commitlint-config-cz 的作用與差別**

[**commitlint-config-gitmoji**](https://www.npmjs.com/package/commitlint-config-gitmoji)

- **功能**：校驗提交訊息是否符合 Gitmoji 規範，要求每次提交訊息必須包含對應的 Emoji。
- **限制**：該配置**無法讀取 .cz-config.js 中自定義的 type**，若你在 **cz-customizable** 中新增了自定義 type，則提交時會被認為是不符合規範的訊息。例如：
    - `.cz-config.js` 自定義 type 為 `:construction_worker: bosh`。
    - 提交訊息：
        
        ```scss
        👷 bosh: Hi, I'm bosh
        ```
        
        - 結果：commitlint 報錯，因為該 type 不在 **commitlint-config-gitmoji** 內建的 types 列表中。

[**commitlint-config-cz**](https://www.npmjs.com/package/commitlint-config-cz)

- **功能**：校驗提交訊息是否符合 **cz-customizable** 所定義的格式，支援自定義 type。
- **限制**：相較於 **commitlint-config-gitmoji**，其校驗較為寬鬆。如果提交訊息完全沒有 type，例如 `First commit`，也不會報錯。
- **報錯場景**：
    - 偵測到提交訊息有 type，但該 type 不在 `.cz-config.js` 的定義中。例如：
        
        ```
        typo: fix spelling error
        ```
        
        - 結果：commitlint 報錯，因為 `typo` 不在自定義 type 的範圍內。

:::tip
若你在第一篇文章中已配置 **cz-customizable**，建議根據團隊需求選擇其一即可，無需同時安裝兩者。
:::

### **安裝與配置 Commitlint**

根據需求選擇安裝以下其中一個模組：

```bash
# 安裝 commitlint-config-gitmoji
npm install --save-dev commitlint-config-gitmoji
# 或安裝 commitlint-config-cz
npm install --save-dev commitlint-config-cz
```

在專案根目錄的 `commitlint.config.js` 中，擴展對應的配置：

- 若使用 **commitlint-config-gitmoji**：
    
    ```jsx
    module.exports = {
      extends: ['gitmoji'],
    };
    ```
    
- 若使用 **commitlint-config-cz**：
    
    ```jsx
    module.exports = {
      extends: ['cz'],
    };
    ```
    

這裡的配置表示我們將使用 **commitlint-config-gitmoji** 的規範，或是 **commitlint-config-cz** 的規範。

### **整合 Commitizen 與 Commitlint**

與前一章節的配置邏輯相同，如果我們想要產生帶有 Gitmoji 的互動式提示，就要設定 commitizen 使用 cz-customizable

**步驟 1：在 `package.json` 中配置 Commitizen**

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-customizable" // 或 @commitlint/cz-commitlint
    }
  }
}
```

接下來可以 follow 前一章節相同的步驟，使用 Commitizen 產生互動式提交，接著使用 commintlint 來測試提交訊息。

### **如何選擇合適的配置？**

| **需求**                                 | **建議配置**                  | **原因**                                     |
| ---------------------------------------- | ----------------------------- | -------------------------------------------- |
| 團隊需要嚴謹的提交規範，強制包含 Gitmoji | **commitlint-config-gitmoji** | 適合不需要自定義 type 的情境，校驗邏輯嚴格。 |
| 使用 cz-customizable 且有自定義需求      | **commitlint-config-cz**      | 可讀取 `.cz-config.js` 的自定義 type。       |


<br/>


## **整合 Husky：實現 Git Hooks 自動化執行 Commitlint**

在前面章節中，我們介紹了如何透過 Commitlint 校驗提交訊息，但僅靠手動執行 `npx commitlint` 並不足以確保每次提交都符合規範。因此，這個章節將帶你實作 **Husky**，利用 Git Hooks 在提交時自動執行 Commitlint。

### **安裝與配置 Husky**

**步驟 1：安裝 Husky**

```bash
npm install --save-dev husky
```

**步驟 2：啟用 Husky**

執行以下命令初始化 Husky 並啟用 Git Hooks：

```bash
npx husky init
```

此命令會在專案根目錄新增一個 `.husky/` 資料夾，用於存放 Git Hooks 腳本，並且會自動在`package.json` 中新增 `prepare` 腳本：

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

**步驟 4：新增 commit-msg 鉤子**

為了在每次提交訊息時執行 Commitlint 校驗，我們需要新增 `commit-msg` 鉤子：

```bash
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

執行後，`.husky/` 資料夾內將新增一個 `commit-msg` 腳本，其內容如下：

```bash
npx --no-install commitlint --edit $1
```

這段腳本的作用是：

1. 捕捉提交訊息文件。
2. 執行 Commitlint 校驗提交訊息，若不符合規範則阻止提交。

### **效果展示**

這裡我用前一章節「**實作二：使用 Gitmoji 的 Commitlint 配置**」的設定來測試。

**測試不符合規範的提交訊息：**

使用 npm run commit 產生以下提交訊息：

```bash
> conventional-commit-workflow@1.0.0 commit
> cz

cz-cli@4.3.1, cz-customizable@7.2.1

All lines except first will be wrapped after 100 characters.
? 此提交是否包含重大變更？如果是，請詳細描述（可選，輸入 enter 跳過）： 
? 選擇您要提交的變更類型： 🔧 chore: 其他不修改 src 或測試文件的變更
? 選擇此變更的範圍（可選，輸入 enter 跳過）： empty
? 簡短描述變更（必填）： 新增 .husky
? 詳細描述（可選，輸入 enter 跳過）： 
? 列出此變更相關的 ISSUE，例如：#31, #34（可選，輸入 enter 跳過）： 

###--------------------------------------------------------###
:wrench: chore: 新增 .husky
###--------------------------------------------------------###

? 您確定要提交上述內容嗎？ Yes
[main d9c48dd] :wrench: chore: 新增 .husky
 2 files changed, 1 insertion(+)
 create mode 100644 .husky/commit-msg
 create mode 100644 .husky/pre-commit
```

執行後 Commitlint 通過校驗，提交成功。

**測試不符合規範的提交訊息：**

```bash
git commit -m "add new features"
```

執行後 Commitlint 馬上報錯並阻止提交：

```bash
⧗   input: add new features
✖   Your commit should start with gitmoji code. Please check the emoji code on https://gitmoji.dev/. [start-with-gitmoji]
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 3 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg script failed (code 1)
```


<br/>


## **結語：規範與效率的雙贏**

總結在這篇文章中我們所引入的工具：

1. **Commitlint**：確保提交訊息的結構化與一致性，避免因提交格式問題影響團隊協作。
2. **Husky：**將規範執行嵌入 Git Hooks，使校驗流程無縫融入日常開發，實現提交訊息規範的自動化。

再加上本系列的前一篇文章，我們逐步構建了一個規範化且高效的提交工作流。下一步，我將在下一篇文章中介紹，基於這套規範化的提交工作流，如何自動生成變更日誌並實現語義化版本管理，進一步提升版本控制與專案管理的效率。


<br/>


## **Reference**

- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- [**Gitmoji**](https://gitmoji.dev/)
- [**Commitizen**](https://commitizen.github.io/cz-cli/)
- [**commitlint**](https://commitlint.js.org/)
- [**commitlint-config-gitmoji**](https://www.npmjs.com/package/commitlint-config-gitmoji)
- [**commitlint-config-cz**](https://www.npmjs.com/package/commitlint-config-cz)
- [**Husky**](https://typicode.github.io/husky/)