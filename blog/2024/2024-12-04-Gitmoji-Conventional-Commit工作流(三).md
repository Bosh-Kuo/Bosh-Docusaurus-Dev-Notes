---
title: "Gitmoji x Conventional Commit 工作流 (三) - 使用 commit-and-tag-version 自動化生成 CHANGELOG.md"
slug: gitmoji-x-conventional-commit-workflow-commit-and-tag-version
authors: bosh
description: 這篇文章深入探討如何根據 Keep a Changelog 標準撰寫結構化、清晰的日誌，並介紹如 commit-and-tag-version 等工具，自動化生成變更日誌，讓維護工作更加高效。同時提供實踐範例與調整建議，幫助專案參與者打造更專業的工作流。
keywords: [Conventional Commits, Gitmoji, Commitizen, Commitlint, Husky, Git-hook, commit-and-tag-version, standard-version, CHANGELOG.md ]
tags: [實作紀錄]
date: 2024-12-04
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1733057458/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-3_okqmuy.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1733057458/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-3_okqmuy.png)


## **變更日誌的意義與重要性**

### **變更日誌是什麼？**

在軟體專案中，**變更日誌（Change Log）** 是一份用來記錄專案功能變更、問題修復、優化內容的重要「歷史日記」。這份日誌的對象通常是開發者、測試人員。它可以幫助專案參與者快速掌握專案歷史，甚至在需要版本回滾時節省大量時間。

變更日誌最主要的目的是為了讓大家能「看懂版本變化」。它有幾個很實用的好處：

1. 讓專案更透明，無論是團隊成員還是用戶，都能快速知道每次更新改了些什麼。
2. 提高團隊效率，讓團隊成員快速理解改動，避免重複查詢。
3. 輔助問題追蹤與版本回滾


<!-- truncate -->


### **如何寫出好的變更日誌？**

可能你會覺得，寫個變更日誌能有多難？隨便列幾個點就好啦。但真要讓日誌清晰又有條理，還真有不少學問。這裡就不得不提到 [**Keep a Changelog**](https://keepachangelog.com/zh-TW/0.3.0/)。它是一套專門為變更日誌設計的標準，目的是幫助大家寫出「清晰且結構化」的日誌。這套標準幫我們解決了寫日誌的常見問題，比如內容亂、不知道該記哪些東西、不統一的格式等等。

### **好的**變更**日誌的核心原則**

這套標準有幾個核心原則，非常值得參考：

- **為人而非機器書寫：** 不用寫得像機器碼一樣複雜，越自然越好，重點是大家能看懂。
- **保持結構化與易讀性：** 使用 Markdown 格式，方便快速跳轉或引用特定內容。
- **頂部留一個 `Unreleased` 區域：** 未正式發布的改動都放在這裡，等發布時再歸檔到對應版本。
- **最新版本置頂：** 日誌按照時間倒序排列，最新的放最上面，方便查找。
- **統一的日期格式：** 建議使用 `YYYY-MM-DD`，像 2024-11-21，這種格式清晰易懂，國際化也沒問題。
- **遵守語義化版本控制：** 和版本號一樣，要讓讀者知道變更的範圍，比如新增功能是小版本更新，Bug 修復則是補丁版本。
- **分類記錄變更：** 把每次改動歸類到以下幾種標籤裡，方便閱讀
    - **Added**：新增的功能。
    - **Changed**：改變的功能。
    - **Deprecated**：不建議用的功能（但還沒刪）。
    - **Removed**：刪掉的功能。
    - **Fixed**：修復的 Bug。
    - **Security**：修正的安全漏洞。

### **好的 Change Log 長什麼樣子？**

來看看下面這個範例，這是一個符合 Keep a Changelog 標準的變更日誌：

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- v1.1 Brazilian Portuguese translation.
- v1.1 German Translation

### Changed

- Use frontmatter title & description in each language version template
- Replace broken OpenGraph image with an appropriately-sized Keep a Changelog 
  image that will render properly (although in English for all languages)
- Fix OpenGraph title & description for all languages so the title and 
description when links are shared are language-appropriate

### Removed

- Trademark sign previously shown after the project description in version 
0.3.0

## [1.1.1] - 2023-03-05

### Added

- Arabic translation (#444).
- v1.1 French translation.

### Fixed

- Improve French translation (#377).
- Fix missing logo in 1.1 pages.

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.

```

**範本的結構說明**

1. **`Unreleased` 區域：** 還沒發布的改動先放這裡，等確定版本號時再移到下一節。    
2. **版本章節：** 每個版本對應一個章節，標明版本號和發布日期（例如 `[1.0.0] - 2024-11-21`）。    
3. **分類標籤：** 把變更內容分成 `Added`（新增功能）、`Fixed`（修復問題）等類別，方便快速檢索。


<br/>


## 工具概覽: **commit-and-tag-version**

### **自動化 Change Log 工具選擇**

雖說寫變更日誌很重要，但想想，如果你是一個專案的維護者，每更新一次版號就要回去翻上個版號到這個版號之間所有的 commit 紀錄，還要想辦法去蕪存菁，過濾掉一些不是很重要的變更紀錄，是一件多折騰人的事。

因此你會發現，很多開源專案都會使用自動化生成變更日誌的工具，來輔助專案維護者快速撈出重要的 commit 歷史紀錄，有些甚至會結合 CICD ，在分支合併進主幹時自動進版、發布 Release notes。我在尋找這類自動生成 Change Log 的工具時，發現市面上有不少選擇：

**1. [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog?tab=readme-ov-file)**

- **特點：**    
    `conventional-changelog` 是一個專門用於生成 Change Log 的工具，它專注於解析 Git 提交訊息，根據 [Conventional Commits](https://www.conventionalcommits.org/) 規範生成日誌。然而，它僅僅專注於 Change Log 的生成，沒有其他額外功能。
    
- **限制：**    
    原生不支援 Gitmoji 格式，經過我的實測，即使跟著網路上的教學搭配 `conventional-changelog-gitmoji-config`，仍無法正確生成 Change Log。
    

**2. [standard-version](https://github.com/conventional-changelog/standard-version)**

- **特點：**    
    `standard-version` 是一個多功能工具，除了生成 Change Log，還包含自動版本升級（bumping）、生成 Git Tag 和提交（commit）的功能。
    
- **現狀：**    
    它是 `commit-and-tag-version` 的前身，但目前已經被社群標記為 **deprecated**（停止維護）。主要原因是維護停滯、功能擴展困難，無法滿足更多使用場景需求。
    

**3. [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version)**

- **特點：**    
    `commit-and-tag-version` 是 `standard-version` 的 Fork，並進一步改進和擴展功能：
    
    - **持續維護：** 提供社群支持，保持與最新需求的同步。
    - **靈活配置：** 更細緻的參數控制，滿足多場景應用。
    - **高整合性：** 繼承了 `standard-version` 的全部功能，並支持 `.versionrc` 文件進行自定義。

**4. [semantic-release](https://github.com/semantic-release/semantic-release)**

- **特點：**    
    `semantic-release` 是功能最強大的選項，除了 Change Log 的生成，還可以結合複雜的自動化工作流（如自動推送、發佈到 npm 或 GitHub）。
    
- **限制：**    
    設定相對複雜，對於單純關注 Change Log 生成的專案來說，可能顯得過於繁重。本篇文章的範疇並不涉及與遠端倉庫的整合，因此不選擇這個工具。
    

> 我將上述工具都下載下來實際測試後，最終選擇了 `commit-and-tag-version`。相比其他工具，`commit-and-tag-version` 可能是目前功能性相對完整且配置靈活的選擇，且最重要的是，它目前仍然持續在更新，短期內不用擔心沒有人維護。

### **commit-and-tag-version 的基本工作流**

根據官方文件，`commit-and-tag-version` 的執行流程如下：

1. **遵循 Conventional Commits 規範：**
    
    確保專案的提交訊息格式符合 [**Conventional Commits**](https://www.conventionalcommits.org/) 標準。
    
2. **執行 `commit-and-tag-version` 指令：**
    - **檢索當前版本號：** 從 `packageFiles` 或最新的 Git Tag 中獲取版本號。
    - **版本升級：** 根據提交訊息自動升級版本號（bump）。
    - **生成 Change Log：** 使用 `conventional-changelog` 底層工具生成結構化的日誌。
    - **生成 Commit：** 自動提交包含新版本號和 Change Log 的變更。
    - **生成 Git Tag：** 添加新的版本 Tag。

:::tip
`commit-and-tag-version` 提供了一個非常實用的功能焦作 `Dry Run Mode`。可以預覽即將執行的命令與生成的 Change Log，避免直接修改檔案或 Git 紀錄。

- 使用方式：
    
    ```bash
    npx commit-and-tag-version --dry-run
    ```
    
- 輸出示例：
    
    ```bash
    $ commit-and-tag-version
    ✔ bump version from 1.0.0 to 1.1.0
    ✔ generate CHANGELOG.md
    [Dry Run Mode] Skipping tag creation and commit.
    ```
:::

### **聚焦 Change Log 生成**

不過在本篇文章中，我們僅關注 Change Log 的自動生成，因此需要在CLI 參數或是設定檔中禁用其他功能，如版本升級、提交與 Tagging。`commit-and-tag-version` 支援透過 `.versionrc`、`.versionrc.json` 或 `.versionrc.js` 文件進行配置。所有 CLI 中的參數均可直接寫入設定檔。

以下是 **`.versionrc`** 配置範例，跳過一些預設的流程：

```json
{
  "skip": {
    "bump": true,  // 禁用版本升級
    "changelog": false,
    "commit": true,  // 禁用自動提交
    "tag": true  // 禁用自動 Tag
  }
}
```

> 補充：也可以在 CLI 中加上 `—skip.bump`/`—skip.commit`/`—skip.tag`} 等參數的方式來跳過預設流程
> 

:::note **如何客製化 CHANGELOG 的格式?**

`commit-and-tag-version` 預設使用 [**conventionalcommits preset**](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) 這套規則，找出特定類型的 commit 紀錄，以特定的格式填寫進變更日誌。當然，我們也可以在 `.versionrc` 中調整變更日誌的格式。所有與 Change Log 相關的設定規範定義於 [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md)。
:::


<br/>


## **無使用 Gitmoji 的自動化 CHANGELOG.md 生成**

接下來，我們來看看搭配前面兩篇文章的配置，在不使用 Gitmoji 的工作流下要如何用 **commit-and-tag-version** 自動生成 Change Log 吧！

### **安裝**

首先，我們需要安裝 `commit-and-tag-version` 工具：

```bash
npm install --save-dev commit-and-tag-version
```

### **配置 `.versionrc.js` 文件**

在專案根目錄創建 `.versionrc.js` 文件，並加入以下配置：

```jsx
module.exports = {
  types: [
    { type: "feat", section: "✨ Features | 新功能" },
    { type: "fix", section: "🐛 Bug Fixes | 修復 Bug" },
    { type: "docs", section: "📝 Documentation | 文件變更" },
    { type: "style", section: "🎨 Styles | 程式碼格式" },
    { type: "refactor", section: "♻️ Code Refactoring | 程式碼重構" },
    {
      type: "perf",
      section: "⚡ Performance Improvements | 改善效能的程式碼變更",
    },
    { type: "test", section: "✅ Tests | 添加或修正測試" },
    { type: "revert", section: "⏪ Revert | 回退先前的提交" },
    {
      type: "build",
      section: "📦 Build System | 影響構建系統或外部依賴的變更",
    },
    {
      type: "chore",
      section: "🔧 chore | 其他不修改 src 或測試文件的變更",
    },
    {
      type: "ci",
      section: "👷 Continuous Integration | CI 配置",
    },
  ],
  skip: {
    bump: true,
    changelog: false,
    commit: true,
    tag: true,
  },
};
```

### 生成 CHANGELOG.md

在 package.json 內，將生成指令加入 script:

```json
"scripts": {
  "release": "commit-and-tag-version"
},
```

通過以上配置所產生的 CHANGELOG.md 範本如下

```markdown
# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 1.1.0 (2024-11-25)

### ✨ Features | 新功能

* rEADME 5f9cf7e

### 🐛 Bug Fixes | 修復 Bug

* a bug fix fec43ca

### 📦 Build System | 影響構建系統或外部依賴的變更

* package.json 70d5f77

### 🔧 chore | 其他不修改 src 或測試文件的變更

* .gitignore ca32df4
```

:::caution **注意事項：**

- **提交訊息需遵循 Conventional Commits 格式**：
    
    為了讓工具正確生成日誌，所有的 Git 提交訊息應符合 Conventional Commits 的規範，例如：
    
    ```bash
    feat: 新增第三方登入功能
    fix: 修正登入頁按鈕的樣式問題
    ```
    
- **自行納入其他類型的 Commit**：
    
    預設配置僅生成 `Features` 和 `Bug Fixes` 兩種標題，若專案有其他提交類型需求（如文件變更、性能改進等），可以在 `.versionrc.js` 中根據 [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md) 定義的規範手動添加。
:::    


<br/>


## **實踐維護變更日誌的最佳方式**

自動化工具讓我們輕鬆生成 Change Log，但要讓日誌真正服務於團隊與用戶，還需要適度的手動調整。這章節我們會討論如何將 Change Log 納入工作流，以及在哪些階段需要補充或調整內容，讓日誌成為專案透明度的助力。

### **如何將 Change Log 納入工作流？**

**1. 開發階段：提交訊息規範是基礎**

一份好的 Change Log，從提交訊息就開始打基礎。如果提交訊息不規範或缺乏細節，即使使用再強大的工具，也無法生成高品質的日誌。因此，建議團隊在開發階段做到以下幾點：

- **統一提交訊息格式**：
    
    使用 Conventional Commits 或 Gitmoji，讓提交訊息的類型和內容清晰有條。例如：
    
    ```bash
    feat: 新增用戶登入功能
    fix: 修正登入頁按鈕的樣式問題
    ```
    
- **加強訊息的上下文**：
    
    提交訊息應簡明扼要，但又能準確描述改動的重點。例如：
    
    - **不好的例子：**
        
        ```makefile
        fix: 修正按鈕問題
        ```
        
    - **好的例子：**
        
        ```makefile
        fix: 修正登入頁按鈕的樣式問題，避免重疊顯示
        ```
        

**2. 合併分支後：生成初版 Change Log**

當功能完成並合併到主分支後，可以使用像 `commit-and-tag-version` 這類的工具生成初版 Change Log。這一步的目的是確保所有提交都能被正確記錄，但生成的內容可能需要進一步調整。

例如，以下是工具生成的初版日誌：

```markdown
## [1.2.0] - 2024-11-22
### ✨ Features | 新功能
- 新增角色管理模組 [#c2e3b7](https://example.com/commit/c2e3b7)

### 🐛 Bug Fixes | 修復 Bug
- 修正角色刪除時的權限問題 [#a1b2c3](https://example.com/commit/a1b2c3)
```

這個結果已經很接近可以發布的狀態，但還需要進一步手動調整來提升可讀性。

### **手動調整的關鍵點**

工具生成的 Change Log 是基於提交訊息的內容，因此難免會有不夠清晰或不夠全面的情況。以下是手動調整的常見場景和處理方式：

**1. 補充上下文說明**

對於工具生成的內容，可以補充一些上下文，幫助讀者更全面地理解變更的影響。例如：

- **自動生成的日誌：**
    
    ```markdown
    ### ✨ Features | 新功能
    - 新增角色管理模組 [#c2e3b7](https://example.com/commit/c2e3b7)
    ```
    
- **手動補充後的日誌：**
    
    ```markdown
    ### ✨ Features | 新功能
    - 新增角色管理模組，支援查看、編輯和刪除角色操作 [#c2e3b7](https://example.com/commit/c2e3b7)
    ```
    

**2. 修改模板字樣**

有些日誌生成的模板內容可能不符合專案需求，這時可以直接調整工具的模板設置。例如，在 `.versionrc.js` 中自定義標題樣式，讓輸出更加貼近專案的風格。

```jsx
module.exports = {
  types: [
    { type: "feat", section: "🚀 Features | 新功能" },
    { type: "fix", section: "🛠️ Fixes | 修復問題" },
  ],
};
```

生成的結果會更新為：

```markdown
### 🚀 Features | 新功能
- 新增角色管理模組 [#c2e3b7](https://example.com/commit/c2e3b7)

### 🛠️ Fixes | 修復問題
- 修正角色刪除時的權限問題 [#a1b2c3](https://example.com/commit/a1b2c3)
```

**3. 手動添加 `## [Unreleased]` 區塊**

大多數工具生成的日誌是針對已發佈的版本，未涵蓋尚未發布的變更內容。因此，需要手動添加 `## [Unreleased]` 區塊，幫助團隊跟蹤當前的變更記錄。

- **手動添加的區塊範例：**
    
    ```markdown
    ## [Unreleased]
    ### 🚀 Features | 新功能
    - 支援用戶密碼重設功能 [#d4e5f6](https://example.com/commit/d4e5f6)
    ```
    

這樣的設置可以作為待發布版本的臨時記錄，在正式發布時再移到對應版本區域。


<br/>


## **結語：打造高效且透明的提交工作流**

在這三篇系列文章中，我們一步步搭建起了一套高效的 Git 提交工作流，從撰寫規範的提交訊息到自動化生成結構化的 Change Log，每一環節都圍繞提升團隊協作效率和專案透明度展開。

### **commit-and-tag-version 的自動化優勢**

在這篇文章中，我們重點介紹了 `commit-and-tag-version`，一個專注於版本管理與 Change Log 自動化的工具。它的自動化能力不僅幫助我們快速生成符合規範的日誌，還提供了靈活的配置方式，可以很好地滿足使用 Gitmoji 的開發者的需求。

### **自動化工具在工作流中的重要性**

從 **Commitizen** 的互動式提交，到 **Commitlint** 與 **Husky** 的格式校驗，再到 Change Log 的自動生成，自動化工具的引入顯著降低了開發者在日常操作中的負擔。它們不僅提升了操作的一致性和規範性，還讓團隊能更專注於核心業務，減少因溝通或流程問題造成的摩擦。

回顧這三篇系列文章，我們已構建出一條完整的 Conventional Commit 工作流：

1. **使用 Commitizen：** 互動式工具幫助快速生成規範的提交訊息，無需手動記憶格式。
2. **結合 Commitlint 與 Husky：** 在提交階段即時校驗，確保所有提交符合規範，避免不規範訊息進入版本控制歷史。
3. **借助 commit-and-tag-version：** 自動生成結構化的 Change Log，讓版本變更更加清晰可追溯。

這套工作流不僅讓提交訊息更具可讀性，還能通過自動化流程大幅提升團隊的開發效率與專案透明度。

### **Future**

實踐 Conventional Commit 並非終點，而是一個持續優化的過程。隨著團隊規模的擴大與專案需求的變化，我們還可以結合更進階的工具（如 `semantic-release`），打造一條更加自動化、可擴展的 DevOps 工作流。

希望這三篇文章能為你的專案帶來啟發與幫助。如果你有任何想法或實踐經驗，歡迎留言分享，讓我們一起探索更高效的工作流解決方案！


<br/>


## **Reference**

- [**我心中 Release note 與 changelog 在產品中應用的差異**](https://sean22492249.medium.com/%E6%88%91%E5%BF%83%E4%B8%AD-release-note-%E8%88%87-changelog-%E5%9C%A8%E7%94%A2%E5%93%81%E4%B8%AD%E6%87%89%E7%94%A8%E7%9A%84%E5%B7%AE-a466a69ae595)
- [**如何維護更新日誌**](https://keepachangelog.com/zh-TW/0.3.0/)
- [**Conventional Changelog**](https://github.com/conventional-changelog/conventional-changelog?tab=readme-ov-file)
- [**standard-version**](https://github.com/conventional-changelog/standard-version)
- [**conventional-changelog-cli**](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)
- [**conventional-changelog-gitmoji-config**](https://github.com/arvinxx/gitmoji-commit-workflow/tree/master/packages/changelog#readme)
- [**commit-and-tag-version**](https://github.com/absolute-version/commit-and-tag-version)
- [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md)