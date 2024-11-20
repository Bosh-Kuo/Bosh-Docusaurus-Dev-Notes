---
title: Conventional Commits 的實踐指南：寫出乾淨的提交訊息
sidebar_label: "[Git] Conventional Commits"
description: 這篇文章深入介紹了 Conventional Commit，從定義與格式到實際應用，並包含常見問題的解答與實用工具推薦，幫助你在版本控制中提升規範性與效率，讓 Commit Message 不僅清晰易讀，還能無縫整合自動化工具與語意化版本管理。
last_update:
  date: 2024-11-20
keywords: [開發工具, Git, Conventional Commits, Commit Message, Commitizen, Commitlint, Husky, Git 提交訊息格式]
tags: [開發工具, Git]
---
 
> **前言：**  
你是不是也常遇到這樣的情況：翻開 Git 的 Commit 記錄，滿滿的「Update」、「Fix bug」或乾脆直接用 emoji 混過去。在團隊協作中，這種隨意的 Commit Message 不但讓歷史紀錄難以理解，還可能拖累整個專案的自動化流程，甚至影響版本管理的準確性。
> 
> 這就是 **Conventional Commit** 派上用場的時候了！它是一套簡單又實用的規範，幫助你把 Commit Message 寫得清楚又有條理。不僅讓版本歷史一目了然，還能輕鬆實現自動生成變更日誌，甚至和語意化版本控制（Semantic Versioning）無縫接軌。
> 
> 接下來，這篇文章會一步步帶你了解什麼是 Conventional Commit、它的格式怎麼寫、為什麼它能對專案有幫助，以及在日常開發中要怎麼用它來讓你的工作更高效，讓團隊合作更順暢！
>


## **什麼是 Conventional Commit？**

### **定義與目的**

簡單來說，**Conventional Commit** 就是一套用來規範 Git Commit Message 的寫法規則。它的目的是幫助我們在版本控制中維持一致性與可讀性，同時為自動化工具提供足夠的資訊，讓整個開發流程更有效率。

那為什麼要這麼麻煩規範 Commit Message 呢？其實，Conventional Commit 的好處不只是看起來整齊，它還能幫助你做到以下幾件事：

1. **提升版本控制的可讀性**  
    清楚的 Commit Message 讓團隊中的每個人都能快速理解變更內容，甚至可以直接找到問題的根源。
    
2. **支援自動生成變更日誌（Change Log）**      
    根據規範好的 Message，工具可以自動整理出完整的變更日誌，節省手動編寫的時間。
    
3. **輔助語意化版本控制（Semantic Versioning）**      
    結合 Semantic Versioning，可以根據不同類型的 Commit 自動決定版本號的升級方式，讓版本管理更加可靠。
    

### **基本格式**

Conventional Commit 的格式其實很簡單，看起來像這樣：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

讓我們來分解一下每個部分的用途：

1. **`type`（Commit 類型）**: 描述這次 Commit 的性質，例如是新增功能（`feat`）、修復問題（`fix`），還是進行雜項更新（`chore`）。
    
2. **`scope`（影響範圍，可選）**: 用來標記這次變更影響的範圍，比如是哪個模組或功能。如果影響範圍明確，建議加上，能讓訊息更清楚。
    
3. **`description`（簡短描述）**: 一句話清楚說明這次 Commit 的內容。最好簡短有力，保持在 50 字以內。
    
1. **`body`（詳細說明，可選）**: 如果需要，可以在這裡詳細描述 Commit 的背景、動機或實現方式。
    
1. **`footer`（註解或 Breaking Change，可選）**: 用來記錄像 Breaking Change 的訊息，或者相關 Issue 的 ID。例如：
    
    ```
    BREAKING CHANGE: 改變了 API 的回傳結構
    Resolves #123
    ```
    

### **與 Semantic Versioning 的關係**

Conventional Commit 和 [**Semantic Versioning**](https://semver.org/)（語意化版本控制） 是一對好搭檔。後者使用版本號的格式 `MAJOR.MINOR.PATCH`，分別代表：

- **MAJOR**：重大改動（可能破壞向後相容性）
- **MINOR**：新增功能（不影響向後相容性）
- **PATCH**：修正錯誤（不影響向後相容性）

而 Conventional Commit 的規範則可以幫助我們自動決定版本號的升級規則：

- 使用 `fix` 的 Commit，通常只影響 **PATCH** 版本，表示修正錯誤。
- 使用 `feat` 的 Commit，會影響 **MINOR** 版本，表示新增功能。
- 如果有 **BREAKING CHANGE**，就會升級 **MAJOR** 版本，因為改動可能影響到向後相容性。


<br/>


## **常用 Commit 類型與範例**

### **常見的 Commit 類型**

在使用 Conventional Commit 時，除了大家熟悉的 `feat`（新增功能）和 `fix`（修正 Bug），其實還有很多其他類型的 Commit 可以用來描述不同的變更。以下推薦一套我滿喜歡的類型定義集 [**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) ，這套規範是基於 [Angular 團隊的開發慣例](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) 所制定的，目前在開源社群中被廣泛採用。

- **`feat`：** 表示新增了一個新的功能。通常會影響 **MINOR** 版本號。
- **`fix`：** 用來描述修復的問題。通常會影響 **PATCH** 版本號。
- **`docs`：** 任何文檔的更新，例如 README 或 API 文件的修改。不會影響程式碼執行。
- **`style`：** 只涉及程式碼的格式化，與程式邏輯無關的修改，比如縮排、逗號位置等。
- **`refactor`：** 改善程式結構或優化，未新增功能，也沒有修正 Bug。
- **`test`：** 專門針對測試檔案的修改。
- **`chore`：** 一些雜項工作，例如工具設定、依賴更新等。
- **`build`：** 涉及編譯過程的修改，例如修改 webpack、rollup 等配置。
- **`ci`：** 與 CI/CD 腳本或流程有關的更動。
- **`perf`：** 專注於提升執行效能的修改。
- **`revert`：** 如果需要回退某次提交，使用 `revert`。
        

### **範例**

以下是幾個實際的使用場景，幫助你更好理解這些類型的應用：

1. **新增功能提交**
    
    ```bash
    feat(profile): add profile picture upload feature
    ```
    
2. **Bug 修正提交**
    
    ```bash
    fix(payment): resolve issue with invalid card numbers
    ```
    
3. **Breaking Change**
    
    ```bash
    feat(api): migrate to new authentication flow
    
    BREAKING CHANGE: user API now requires OAuth token
    ```
    
4. **文件變更提交**
    
    ```bash
    docs(api): add endpoint usage examples
    ```
    
5. **回退某次提交**
    
    ```bash
    revert: revert "feat(auth): add login with Google"
    ```

    
<br/>


## **常見問題與注意事項**

### **常見問題**

1. **Q:當提交符合多種提交類型時，該怎麼辦？**  
   
    當一次提交同時符合多種類型，建議選擇最能代表此次變更的主要類型。例如，如果新增功能時也修正了 Bug，應選擇 `feat`，並在正文中補充說明修正的內容。
    
2. **Q: 什麼時候該寫 Scope？**
   
    `scope` 是可選的，但建議在影響範圍清晰時加以描述，例如指定某個功能模組、檔案或子系統。這能幫助開發者快速理解變更的影響範圍，如果範圍不明確或無特定模組影響，可以省略。
    
3. **Q: Commit Message 一定要用英文嗎？**
   
    Commit Message 的語言應以團隊習慣為準。英文是國際化的標準選擇，但如果團隊成員習慣用中文或其他語言，也可以使用母語，只要訊息內容清楚、一致即可。
    
4. **Q: 如果不小心用錯提交類型，該怎麼辦？**

    可以使用 `git commit --amend` 修正最近一次提交訊息，或者使用 `git rebase -i <base commit>` 來編輯提交歷史。
    
5. **Q: 如何處理回退提交 (revert commit)？**

    在實際開發中，回退提交（revert commit）有時是不可避免的，但這可能比想像中複雜得多。你需要考慮以下幾個問題：    
    1. **是回退一個提交還是多個提交？**        
        如果是多個提交，需特別小心可能產生的衝突，並確保每個被回退的改動都處理妥當。        
    2. **回退的是功能還是修復？**        
        如果回退的內容是某個功能，那麼回退後的變更應該算作 **修正檔（PATCH）** 嗎？這需要根據專案的語意化版本策略來決定。        
    
    Conventional Commit 並沒有對回退行為做出強制規範，這留給工具作者或團隊自行定義。一個推薦的方式是使用 `revert` 類型，並在頁腳中標註被回退的 Commit 的 SHA 雜湊。這樣能清楚表達回退的意圖，同時為工具處理提供必要的資訊。
    
    範例：
    
    ```
    revert: let us never again speak of the noodle incident
    
    Refs: 676104e, a215868
    ```
    

### **注意事項**

1. **避免過長的描述**
    
    `description` 部分應保持簡潔，建議 50 個字以內即可清楚表達變更的重點。詳細的內容可以放在 `body` 區塊中，避免讓標題過於冗長。
    
2. **合理的提交粒度**
    
    每次提交應專注於單一變更，保持適當的粒度。過大的提交會讓變更難以追溯，而過於零碎的提交則可能讓記錄過於冗長，增加維護成本。
    
3. **大小寫規範**
    
    Commit Message 的 `type` 和 `scope` 建議使用小寫字母，以保持格式的一致性。唯有 `BREAKING CHANGE` 必須大寫，且後需接分號與空格。
    
4. **`BREAKING CHANGE` 的規範**
    
    當變更中包含破壞性更新（例如影響向後相容性），必須在頁腳中明確標註 `BREAKING CHANGE`，並描述破壞性改動的原因及影響。例如：
    
    ```
    BREAKING CHANGE: user authentication now requires OAuth tokens
    ```
    
5. **頁腳格式的書寫規範**
    
    頁腳應另起一行，並清楚標明變更類型或符記，例如 `BREAKING CHANGE` 或關聯 Issue 編號。正確格式如下：
    
    ```
    BREAKING CHANGE: removed deprecated endpoint /api/v1/users
    
    Closes #123
    ```
    
6. **提交訊息的格式需機械可讀**
    
    確保提交訊息的格式符合 Conventional Commit 的規範，讓工具可以自動解析並生成變更日誌、版本升級或其他自動化操作。
    

<br/>


## **實用工具推薦**

在實際開發中，想要高效地執行 **Conventional Commit** 規範，幾款強大的工具可以大幅簡化你的工作，讓規範的執行更輕鬆且準確。

- [**Commitizen**](https://commitizen.github.io/cz-cli/)
    - **功能**：        
        - Commitizen 是一款專門用來輔助生成規範化 Commit Message 的工具。它可以引導你一步步填寫符合規範的訊息，避免手寫格式時出錯。        
    - **特點**：
        - 透過互動式 CLI 進行提交，讓規範化流程更直覺。
        - 支援多種規範模板，例如 Conventional Commit。
- [**Commitlint**](https://commitlint.js.org/)
    - **功能**：        
        - Commitlint 是一款校驗工具，用來檢查你的 Commit Message 是否符合規範，避免提交不合規的訊息。        
    - **特點**：
        - 可整合到 CI/CD 流程中，自動化檢查提交訊息。
        - 支援高度自訂，可以針對團隊需求調整規則。
- [**Standard Version**](https://github.com/conventional-changelog/standard-version)
    - **功能**：        
        - Standard Version 是一款自動化工具，基於 Conventional Commit 規範，幫助你自動生成語意化版本號和變更日誌（Change Log）。        
    - **特點**：
        - 根據提交訊息，計算版本升級類型（MAJOR、MINOR 或 PATCH）。
        - 自動更新版本號、生成變更日誌，甚至可以幫你打 Tag。
        - 無需手動操作，讓發版流程更高效。
- [**Husky**](https://typicode.github.io/husky/)
    - **功能**：        
        - Husky 是一款用來管理 Git Hook 的工具，能幫助你在特定 Git 操作（如提交、推送）時執行自動化流程，例如校驗提交訊息。        
    - **特點**：
        - 配合 Commitlint 使用，實現提交訊息的本地校驗。
        - 可用於其他操作，如執行測試、格式化程式碼等，擴展性強。


<br/>


## **Reference**

- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)