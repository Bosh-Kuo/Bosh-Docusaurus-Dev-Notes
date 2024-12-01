---
title: "Gitmoji x Conventional Commit 工作流 - 使用 Commitizen 互動式產生 Conventional Commit (一)"
slug: gitmoji-x-conventional-commit-workflow-commitizen
authors: bosh
description: 在這篇文章中，我分享了如何利用 Commitizen 和 Gitmoji 打造一套規範化的提交訊息工作流，幫助開發者更高效地管理專案歷史紀錄。我們將深入探討 Conventional Commits 的重要性，並比較不同的適配器（如 cz-conventional-changelog、@commitlint/cz-commitlint 和 cz-customizable）的特點與應用場景。
keywords: [Conventional Commits, Gitmoji, Commitizen, cz-conventional-changelog, cz-customizable, "@commitlint/cz-commitlint"]
tags: [實作紀錄]
date: 2024-11-30
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1732957536/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-1_l8krir.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732957536/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-1_l8krir.png)

## **前言**

前陣子在研究一些關於 Git 專案的專業開發流程，比如如何遵循 **Conventional Commits** 規範撰寫 commit message，還有依照 **Semantic Versioning** 原則來管理版本號等等。這段時間我看了滿多 Github 上知名度高的開源專案，從它們的 commit 歷史、PR 紀錄 、Change log、Release notes 中學習如何建立一套高效且規範化的開發工作流程。

在這個過程中，我逐漸歸納出一些具體的適合用於未來新專案的工作流程，比如：

1. 使用交互式問答界面工具，輔助撰寫規範化的 commit messages
2. 結合 Git Hook ，在提交時自動檢查 commit messages 是否符合提交規範
3. 利用規範化的提交紀錄自動生成 Changelog

為了在專案中實踐這些流程，我研究了許多相關工具。在研究的過程中，我偶然發現不少開源專案的提交訊息中都搭配了 Emoji，看起來滿直觀有趣的，於是稍微查了一下，才知道這東西叫做 **Gitmoji** 。於是，便一併研究如何將 Gitmoji 整合到上述工作流程中。

由於內容較多，我將以上三個工作階段分成三篇文章來介紹，並在每篇文章中詳細講解有使用 Gitmoji 和未使用 Gitmoji 的情況下，該如何安裝、配置所需工具，以及實際使用的效果。

<!-- truncate -->

## **Conventional Commits**

### **為什麼需要規範提交訊息？**

你有沒有遇過這樣的情況：打開 Git 提交記錄，看到的都是「Fix bug」「Update」「Change」這類模糊不清的訊息？完全無法理解這些提交到底改了什麼，或者影響了哪些地方。我認為，對於一個優秀的多人協作專案來說，提交訊息不只是用來記錄改動的工具，還是團隊協作和專案管理的重要一環。如果提交訊息清晰規範，大家都能快速看懂改了什麼，為什麼改，甚至能用它來自動生成變更日誌，節省不少手動整理的麻煩。

這就是為什麼會有 [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) 規範的原因。它提供了一套簡單又實用的規範，比如用固定格式的「標籤」來描述提交的類型（像 `feat` 表示新增功能，`fix` 表示修復問題），這樣不但讓提交訊息更容易看得懂，還能搭配工具實現一些方便的自動化功能，比如自動生成變更日誌或自動升級版本號，讓專案管理更高效輕鬆。

> 如果對 **Conventional Commits** 有興趣想要進一步深入了解，歡迎參閱我之前寫的這篇文章：[**Conventional Commits 的實踐指南：寫出乾淨的提交訊息**](https://notes.boshkuo.com/docs/DevTools/Git/conventional-commits)
> 

### **Commitizen：規範化提交的好幫手**

雖然提交訊息規範化聽起來挺有道理，但實際上要執行起來，很多人還是會感到麻煩：每次提交都要手動寫那麼多規範的內容？也太費時了吧！

本篇文章要介紹的主角 **Commitizen** 就是一個用來解決這個問題的工具。簡單來說，Commitizen 是一個幫助你撰寫規範化提交訊息的工具，它最大的亮點就是「互動式提示」。當你準備提交程式碼時，Commitizen 會以問答的形式引導你一步步完成提交訊息，讓你不用擔心忘記格式或細節。在接下來的章節裡，我會記錄我如何實作 **Commitizen** 安裝與配置。此外，我還會進一步教大家如何搭配 **Gitmoji** 在提交訊息前面加上自定義的 emoji 表情符號，讓提交訊息更生動 😁

不過，在介紹 **Commitizen** 搭配 **Gitmoji** 的實作之前，讓我們先來了解一下什麼是 **Gitmoji** 🧐。

### **Gitmoji 簡介**

[**Gitmoji**](https://gitmoji.dev/) 是一套專門為提交訊息設計的表情符號（Emoji）規範，它為一些 emoji 圖示定義了專屬的**語義化的標記**（也就是名稱），再將它們透過工具轉為 Emoji 符號，透過可視化的方式來強調提交類型。比如：

- **✨ feat:** 新增功能時，用一個「閃亮亮」的圖示來告訴大家這是個新功能。
- **🐛 fix:** 修復錯誤時，直觀地用「小蟲」來表示這是 Bug 的修復。
- **📝 docs:** 更新文件時，一個簡單的筆記本圖示瞬間傳遞信息。
- **⚡️ perf:** 提升性能，用一個閃電般的符號突顯出效率提升的改動。

以下是一些常見的 Gitmoji ：

| **Emoji** | **名稱**             | **用途**                           |
| --------- | -------------------- | ---------------------------------- |
| ✨         | `:sparkles:`         | 新增功能或重大改進                 |
| 🐛         | `:bug:`              | 修復 Bug                           |
| 📝         | `:memo:`             | 更新文件或增加說明                 |
| 💄         | `:lipstick:`         | 優化程式碼樣式（如格式調整、空白） |
| ♻️         | `:recycle:`          | 程式碼重構（非功能性變更）         |
| ⚡️         | `:zap:`              | 改善效能的變更                     |
| ✅         | `:white_check_mark:` | 添加或修正測試                     |

:::tip
由於 Git 本身只專注於版本控制，並不負責處理格式化或語法轉換，不會自動將這些名稱轉換為 Emoji。如果想在提交訊息中自動顯示 Emoji，需要借助一些工具。例如：

- **gitmoji-cli** 提供互動式選擇並插入 Emoji。
- **cz-gitmoji** 或 **cz-customizable** 可以通過配置 Commitizen 來插入 Gitmoji。
:::

:::note
雖然 Gitmoji 很酷，但也不是每個團隊都適合引入。這裡是一些你可能需要考慮的點：

- **成本考量**：Gitmoji 的引入需要額外的工具配置和規範制定，對於輕量型或快速開發的專案可能顯得繁瑣。
- **團隊文化**：有些團隊偏好嚴謹的文字風格，可能會認為表情符號不夠正式。

基於這些考量，接下來的教學我們會針對「不使用 Gitmoji」和「使用 Gitmoji」分別展示工具配置與實作流程，讓大家能根據團隊需求靈活選擇。
:::


<br/>


## **工具選擇與比較：Commitizen 適配器概覽**

### **Commitizen 適配器是什麼？**

Commitizen 本身只是一個框架，想讓它運作起來，需要安裝一個「適配器(adapter)」來定義提交訊息的規則和互動流程。市面上有許多不同的適配器，每個適配器針對不同的場景提供了對應的功能。以下是三個常見的選擇：

| **適配器**                                                                               | **特色**                                                                                                                 | **優點**                                                                                                                                       | **缺點**                                                                |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [**cz-conventional-changelog**](https://www.npmjs.com/package/cz-conventional-changelog) | 1. 社群成熟度高，是 Commitizen 社群內廣泛使用的適配器。 <br/> 2. 完全基於 Conventional Commit 規範                       | 1. 配置簡單，基本零配置即可使用 <br/> 2. 遵循廣泛採用的 Angular 規範 <br/> 3. 預設配置產生的提交訊息就能通過 `@commitlint/config-conventional` | 1. 不支援自訂 Prompt <br/> 2. 無法直接支援 Gitmoji                      |
| [**@commitlint/cz-commitlint**](https://www.npmjs.com/package/@commitlint/cz-commitlint) | 1. Commitlint 官方提供的 Commitizen 適配器 <br/> 2. 直接根據 `commitlint.config.js` 配置的規則生成提交訊息，確保規範同步 | 1. 結合 Commitlint 配置，提供強大的規範校驗能力 <br/> 2. 配置選項豐富- 提供更嚴格的提交信息驗證                                                | 1. 配置相對較多 <br/> 2. 不支援 Gitmoji                                 |
| [**cz-customizable**](https://github.com/leoforfree/cz-customizable)                     | 高度自訂，允許完全掌控 Prompt 的顯示內容與行為                                                                           | 1. 適合需要自訂提交規範的團隊，特別是整合 Gitmoji 的情境 <br/> 2. 支援中文或其他語言 <br/> 3. 適合特殊提交規範的需求                           | 1. 需要手動編寫自訂配置，學習成本稍高 <br/> 2. 團隊需維護自定義規範文檔 |

### **哪種適配器最適合你的團隊？**

1. **如果不需要 Gitmoji**：
    - **初學者**：選擇 **cz-conventional-changelog**，簡單高效，適合用於只需快速生成符合 Conventional Changelog 的提交訊息的場景。
    - **進階需求**：選擇 **@commitlint/cz-commitlint**，雖然需另外搭配 **@commitlint/config-conventional** 這類的規則集設定，但與 **commitlint** 整合的靈活性更高，可額外添加自定義的規則，且生成的訊息和驗證規則一致。適合有客製化規範需求的專案。
    
    這兩種適配器都基於 Angular 的提交訊息規範，因此兩者 Prompt 的規則非常相似。如果你沒有額外自定義規則的需求，那麼我會推薦配置最為簡單的 **cz-conventional-changelog。**
    
2. **如果需要 Gitmoji**：
    - 強烈推薦使用 **cz-customizable**，它能輕鬆整合 Gitmoji，並根據團隊需求自訂提交訊息的 Prompt。


<br/>


## **實作：安裝與配置 Commitizen**

### **不使用 Gitmoji(1): 搭配 cz-conventional-changelog**

1. **安裝依賴**：
    
    ```bash
    npm install --save-dev commitizen cz-conventional-changelog
    ```
    
2. **配置 Commitizen**：
    - 在專案的 `package.json` 中新增以下內容：
        
        ```json
        {
          "scripts": {
            "commit": "cz"
          },
          "config": {
            "commitizen": {
              "path": "cz-conventional-changelog"
            }
          }
        }
        ```
        
        - `config` 欄位用於指定專案的配置設定。其中，`commitizen` 欄位包含 `path` 屬性，指向 `cz-conventional-changelog` 這個適配器
        - 使用 `npm run commit` 即可啟動互動式提交
3. **效果演示**：
    - 使用以下命令啟動互動式提交：
        
        ```bash
        npm run commit
        ```
        
    - 互動式 Prompt 介面如下：        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/cz-conventional-changelog-1_y6lwy2.png)

        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/cz-conventional-changelog-2_f5mjcb.png)


### **不使用 Gitmoji(2): 搭配 @commitlint/cz-commitlint + @commitlint/config-conventional**

1. **安裝依賴**：
    
    ```bash
    npm install --save-dev commitizen @commitlint/cz-commitlint @commitlint/config-conventional
    ```
    
    - **@commitlint/cz-commitlint:** 為 Commitizen 的適配器，依賴於 `commitlint.config.js` 中的配置
    - **@commitlint/config-conventional:**  提供了預設的規範配置（用來設置於 `commitlint.config.js` ）

1. **配置 Commitizen**：
    - 在 `package.json` 中新增以下內容：
        
        ```json
        {
          "scripts": {
            "commit": "cz"
          },
          "config": {
            "commitizen": {
              "path": "@commitlint/cz-commitlint"
            }
          }
        }
        ```
        
2. **配置 Commitlint**：
    - 在專案根目錄新增 `commitlint.config.js`，並擴展 `@commitlint/config-conventional`：
        
        ```jsx
        module.exports = {
          extends: ['@commitlint/config-conventional'],
        };
        ```
        
3. **效果演示**：
    - 使用以下命令啟動互動式提交：
        
        ```
        npm run commit
        ```
        
    - 互動式 Prompt 介面如下：
        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/commitlint_config-conventional-1_zyu6oq.png)
        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/commitlint_config-conventional-2_hw2xdf.png)


### 使用 Gitmoji: **搭配** cz-customizable

1. **安裝依賴**：
    
    ```bash
    npm install --save-dev commitizen cz-customizable
    ```
    
2. **根目錄創建配置文件**：
<details>
    <summary> 中文版 cz-config.js </summary>
        ```jsx
        module.exports = {
            types: [
            { value: ":sparkles: feat", name: "✨ feat: 新功能" },
            { value: ":bug: fix", name: "🐛 fix: 修復 Bug" },
            { value: ":memo: docs", name: "📝 docs: 文件變更" },
            {
                value: ":art: style",
                name: "🎨 style: 程式碼格式（不影響功能，例如空白、格式化、缺少分號等）",
            },
            {
                value: ":recycle: refactor",
                name: "♻️  refactor: 程式碼重構（既不是修復錯誤也不是添加功能）",
            },
            { value: ":zap: perf", name: "⚡️ perf: 改善效能的程式碼變更" },
            { value: ":white_check_mark: test", name: "✅ test: 添加或修正測試" },
            {
                value: ":package: build",
                name: "📦️ build: 影響構建系統或外部依賴的變更（例如：gulp、npm）",
            },
            {
                value: ":construction_worker: ci",
                name: "👷 ci: 更改持續整合文件和腳本（例如：Jenkins, Travis、Circle、Github Action 等）",
            },
            {
                value: ":wrench: chore",
                name: "🔧 chore: 其他不修改 src 或測試文件的變更",
            },
            { value: ":rewind: revert", name: "⏪️ revert: 回退先前的提交" },
            ],
            scopes: [
            { name: "ui" },
            { name: "backend" },
            { name: "api" },
            { name: "docs" },
            { name: "tests" },
            ],
            messages: {
            type: "選擇您要提交的變更類型：",
            scope: "選擇此變更的範圍（可選）：",
            subject: "簡短描述變更（必填）：",
            body: "詳細描述（可選）：",
            breaking: "此提交是否包含重大變更？如果是，請詳細描述（可選）：",
            footer: "列出此變更相關的 ISSUE，例如：#31, #34（可選）：",
            confirmCommit: "您確定要提交上述內容嗎？",
            },
            askForBreakingChangeFirst: true,
            allowBreakingChanges: ["feat", "fix"],
            allowCustomScopes: true,
            subjectLimit: 100,
        };
        ```
</details>
                            
<details>
    <summary> 英文版 cz-config.js </summary>                      
    ```jsx
    module.exports = {
        types: [
        { value: ":sparkles: feat", name: "✨ feat: New feature" },
        { value: ":bug: fix", name: "🐛 fix: Bug fix" },
        { value: ":memo: docs", name: "📝 docs: Documentation changes" },
        {
            value: ":art: style",
            name: "🎨 style: Code style changes (formatting, white spaces, missing semicolons, etc.)",
        },
        {
            value: ":recycle: refactor",
            name: "♻️  refactor: Code refactoring (neither a fix nor a feature addition)",
        },
        { value: ":zap: perf", name: "⚡️ perf: Performance improvement changes" },
        { value: ":white_check_mark: test", name: "✅ test: Adding or updating tests" },
        {
            value: ":package: build",
            name: "📦️ build: Changes that affect the build system or external dependencies (e.g., gulp, npm)",
        },
        {
            value: ":construction_worker: ci",
            name: "👷 ci: Changes to CI configuration files and scripts (e.g., Jenkins, Travis, Circle, GitHub Actions)",
        },
        {
            value: ":wrench: chore",
            name: "🔧 chore: Other changes that don't modify src or test files",
        },
        { value: ":rewind: revert", name: "⏪️ revert: Revert a previous commit" },
        ],
        scopes: [
        { name: "ui" },
        { name: "backend" },
        { name: "api" },
        { name: "docs" },
        { name: "tests" },
        ],
        messages: {
        type: "Select the type of change you are committing:",
        scope: "Select the scope of this change (optional):",
        subject: "Write a short description of the change (required):",
        body: "Provide a longer description of the change (optional):",
        breaking: "Does this commit include a breaking change? If yes, provide details (optional):",
        footer: "List any issues related to this change, e.g., #31, #34 (optional):",
        confirmCommit: "Are you sure you want to commit the above?",
        },
        askForBreakingChangeFirst: true,
        allowBreakingChanges: ["feat", "fix"],
        allowCustomScopes: true,
        subjectLimit: 100,
    };    
    ```
</details>

3. **配置 Commitizen**：
    - 在 `package.json` 中新增以下內容：
        
        ```json
        {
          "scripts": {
            "commit": "cz"
          },
          "config": {
            "commitizen": {
              "path": "cz-customizable"
            }
          }
        }
        ```
        
4. **效果演示**：
    - 使用以下命令啟動互動式提交：
        
        ```bash
        npm run commit
        ```
        
    - 互動式 Prompt 介面如下：
        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/cz-customizable-1_y1zn6h.png)
        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979826/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/cz-customizable-2_yomm0m.png)
        
        ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1732979825/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/cz-customizable-3_vqhbkr.png)


<br/>


## **結語：為後續工作流打下基礎**

到這裡，我們已經完成了 Commitizen 的安裝與配置，並且針對 **不使用 Gitmoji** 和 **使用 Gitmoji** 兩種情境，分別展示了適合的工具選擇與實作步驟。這些基礎設置並不僅僅是為了提交訊息的美觀或規範化，更重要的是，這為後續的自動化流程鋪平了道路。未來我們便可以透過規範化的提交歷史，實現自動生成 **Changelog**，甚至結合 **CI/CD** 工具進一步優化開發流程。

如果你在導入這套流程時有其他需求或改進想法，別忘了靈活調整工具和設定，讓它更符合你的專案需求。下一篇文章我將介紹如何使用 Husky 來自動檢查提交訊息，確保提交符合規範。希望這篇文章對你有幫助，為你的開發流程帶來一點效率提升，也增添一些樂趣！


<br/>


## **Reference**

- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- [**Gitmoji**](https://gitmoji.dev/)
- [**Commitizen**](https://commitizen.github.io/cz-cli/)
- [**cz-customizable**](https://github.com/leoforfree/cz-customizable)
- [**cz-conventional-changelog**](https://www.npmjs.com/package/cz-conventional-changelog)
- [**@commitlint/cz-commitlint**](https://www.npmjs.com/package/@commitlint/cz-commitlint)