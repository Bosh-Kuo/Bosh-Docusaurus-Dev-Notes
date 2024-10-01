---
title: 專業協作開發：使用 Commitlint 規範你的提交訊息
sidebar_label: Commitlint
description: 這篇文章將帶你深入了解 commitlint 的作用、安裝與配置過程，以及如何在開發流程中應用它來提升專案的品質和協作效率。無論你是版本控制的新手還是有經驗的開發者，都能從中獲得實用的建議和技巧，確保你的提交訊息始終保持一致和可讀性。
last_update:
  date: 2024-08-01
keywords:
  - npm 套件
  - npm packages
  - Commitlint
tags:
  - npm packages
---

一直以來，不論是過去在實習的時候或是做自己的專案的時候，我大都沒有特別在意我的 commit message 格式，直到去年加入目前的公司後，開發團隊要求以有固定的 commit message 格式提交 commit ，我才發現原來 GitHub 上大多數的知名開源專案也都有自己的 commit message 格式要求。這才意識到，對於多人協作開發的專案，保持 commit 訊息的一致性與可讀性對專案的長期維護是一件很重要的事情。

雖然我們團隊有很明確的 commit 規範，但是每當有新成員或外部支援加入開發時，在加入初期還不熟悉我們的開發習慣時，總會出現一些不符合規範的 commit 訊息。為了解決這個問題，我引入了 `commitlint` 這個工具。它能幫助我們在開發過程中自動檢查 commit message 是否符合預定的規範，從而確保每一次提交都符合團隊的標準。

## **認識 commitlint**

`commitlint` 是一個用於檢查 git commit 訊息的工具，確保提交訊息符合特定的規範。透過使用 commitlint，團隊可以保持一致的提交訊息格式，提升程式碼的可維護性和可讀性。

### **commitlint 的作用**

**commitlint** 的主要作用是確保提交訊息符合預定的規範，常見的規範如 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) 。這不僅有助於保持提交訊息的一致性，還能幫助開發團隊可以更有效地進行程式碼審查和協作，也有助於自動化使用 commit log 生成的 changelog 時，保持內容格式整齊一致。

### **Conventional Commits 規範**

**Conventional Commits** 是一種提交訊息的命名規範，其結構如下：

```
<類型 type>[(可省略)作用範圍 scope]: <描述 description>

[(可省略)正文 body]

[(可省略)頁腳 footer]
```

**commitlint** 官方建議使用 `@commitlint/config-conventional` 作為擴展配置，這個配置基於 [Angular 的提交訊息規範](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)，提供了一組預定義的規則：

- `type`: 描述這次提交的類型，常見類型包括：
    - `build`: 影響構建系統或外部依賴的更改（例如範圍：gulp、broccoli、npm）
    - `ci`: 對持續集成（CI）配置文件和腳本的更改（例如範圍：Travis、Circle、BrowserStack、SauceLabs）
    - `docs`: 僅限文檔的更改
    - `feat`: 新功能
    - `fix`: 修復錯誤
    - `perf`: 提升性能的程式碼更改
    - `refactor`: 不屬於修復錯誤或新增功能的代碼更改
    - `style`: 不影響程式碼含義的更改（空白字符、格式化、缺少的分號等）
    - `test`: 添加缺失的測試或更正現有的測試
- `scope`: 這次變更的影響範圍，例如模組或文件名稱。
- `description`: 簡短描述這次變更的內容。
- `body`: 對提交變更的詳細描述，可以分為多行。
- `footer`: 列出重大變更(**BREAKING CHANGE**) 或關聯的問題追蹤 ID。

### **範例**

下面分別舉一個符合規範和不符合規範的提交訊息範例：

- **符合規範的範例：**

```
feat(parser): add ability to parse arrays

This commit adds a new feature that allows the parser to handle arrays.

BREAKING CHANGE: The `parse` function now returns an array instead of a string.
```

- **不符合規範的範例：**

```bash
add new feature for parsing

- Added functionality to parse arrays
- Updated tests
```

在符合規範的範例中，我們可以清楚地看到提交的類型（`feat`）、範疇（`parser`）以及簡短的主題（`add ability to parse arrays`）。而在不符合規範的範例中，缺少了明確的類型(**type**)。

## **安裝與基礎配置**

### **安裝**

要在專案中使用 `commitlint`，首先需要安裝相關的套件。這裡我們還會安裝 `husky`，用來在提交訊息時自動執行 `commitlint` 的檢查。

1. 安裝 `commitlint` 及其配置套件：
    
    ```bash
    yarn add --dev @commitlint/{cli,config-conventional}
    
    # Configure commitlint to use conventional config
    echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
    ```
    
2. 安裝 `husky`：
    
    ```bash
    yarn add --dev husky
    
    yarn husky init
    
    # Add commit message linting to commit-msg hook
    echo "yarn commitlint --edit \$1" > .husky/commit-msg
    ```
    

### **基礎配置**

安裝完套件後，我們需要進行一些基礎配置，使 `commitlint` 和 `husky` 能夠正常運作。

1. 配置 `commitlint.config.js`：
    
    在專案根目錄下新增一個 `commitlint.config.js` 檔案，並加入以下內容：
    
    ```jsx
    module.exports = {
      extends: ['@commitlint/config-conventional'],
    };
    ```
    
    這個配置文件告訴 commitlint 使用 **@commitlint/config-conventional** 的規則來檢查提交訊息。
    
2. 初始化 **husky** 並配置 `.husky/commit-msg`：
    
    初始化 **husky** 來設置 git hooks：
    
    ```bash
    yarn husky init
    
    ```
    
    這會在專案根目錄下創建 `.husky` 目錄。
    
    接著，配置 **commit-msg** hook，使其在提交訊息時自動檢查訊息格式：
    
    ```bash
    # Add commit message linting to commit-msg hook
    echo "yarn commitlint --edit \$1" > .husky/commit-msg
    ```
    
    這樣，在每次提交訊息時，**husky** 都會執行 **commitlint**，確保提交訊息符合規範。
    

## **使用 Prompt 建立提交 commit log**

commitlint 官方提供了幾個 prompt 工具，能夠幫助開發者以互動式介面簡單方便的建立符合 conventional commit 的提交訊息。

### **安裝**

我選擇使用 `commitizen` 和官方提供的 adaptor `@commitlint/cz-commitlint` ：

```bash
# inquirer is required as peer dependency
yarn add -D @commitlint/cz-commitlint commitizen inquirer@9
```

### **配置**

安裝完必要的套件後，我們需要進行一些配置來啟用命令行提示。

在專案的 `package.json` 檔案中新增以下配置：

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

這個配置告訴 `commitizen` 使用 @commitlint/cz-commitlint 作為提示模板，基於`commitlint.config.js` 來工作。

### **使用範例**

現在，我們可以使用 `commitizen` 提供的命令行提示來生成提交訊息。使用以下命令來替代 `git commit`：

```json
yarn commit
```

執行後，命令行會提示你填寫提交訊息的各個部分：

1. **選擇提交類型**：
    
    ```yaml
    ? Select the type of change that you're committing: (Use arrow keys)
    ❯ feat:       A new feature 
      fix:        A bug fix 
      docs:       Documentation only changes 
      style:      Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) 
      refactor:   A code change that neither fixes a bug nor adds a feature 
      perf:       A code change that improves performance 
      test:       Adding missing tests or correcting existing tests 
    (Move up and down to reveal more choices)
    ```
    
2. **填寫範疇**（可選）：
    
    ```yaml
    ? What is the scope of this change (e.g. component or file name) (press enter to skip): (max 96 chars)
     (0) 
    ```
    
3. **填寫主題**：
    
    ```yaml
    ? Write a short, imperative tense description of the change: (max 96 chars)
     (45) install commitizen, @commitlint/cz-commitlint
    ```
    
4. **填寫詳情**（可選）：
    
    ```yaml
    ? Provide a longer description of the change (press enter to skip):
    
    ```
    
5. **Breaking Changes（可選）**
    
    ```yaml
    ? Are there any breaking changes?: (y/N)
    ```
    

6. **關聯的問題**（可選）：

```yaml
? Does this change affect any open issues?: Yes
```

完成這些步驟後，`commitizen` 會自動生成符合規範的提交訊息，並提交到版本控制系統。

## **配置文件重點整理**

**commitlint** 的配置文件可以幫助我們定義提交訊息的規則和行為，確保提交訊息符合預期。以下將對配置文件中的常見配置項目進行重點整理，包括名詞解釋、常用規則以及插件的使用。

### **名詞解釋**

在 **commitlint** 的配置文件中，我們可以配置以下幾個主要項目：

- **extends**: 繼承現有的配置規則，例如 @commitlint/config-conventional。
- **rules**: 自定義規則，用於檢查提交訊息的格式和內容。
- **parserPreset**: 定義提交訊息解析的預設設定。
- **plugins**: 插件，用於擴展 commitlint 的功能。

### **常用 Rules**

`commitlint` 允許我們自定義規則，以滿足專案的特定需求。以下我以一個自定義規則的範例來說明：

```jsx
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 50],
    'header-max-length': [2, 'always', 72],
  },
};
```

- `2`: 錯誤等級，2 表示錯誤（不符合規則則提交失敗）。
- `'always'`: 檢查規則，表示總是檢查。
- `'never'`: 檢查規則，表示不允許使用某些值。

---

- **type-enum**: 限制提交類型必須是指定的類型之一。這裡指定了 **feat**、**fix**、**docs** 等。
- **subject-case**: 限制主題部分的大小寫格式。
- **subject-max-length**: 限制主題部分的最大長度。
- **eader-max-length**: 限制提交訊息頭部（標題）的最大長度。

### **Plugins**

**plugins** 的作用是用來增加新的規則，或修改現有規則的行為。它們與 **rules** 配置項目相輔相成，讓我們可以針對專案需求進行高度自訂。

假設我們要自定義一個插件，來檢查提交訊息中是否包含特定的關鍵字(JIRA)：

1. 我們可以將其定義在專案內部。假設我們的插件檔案名為 `keyword-plugin.js`，內容如下：
    
    ```jsx
    // keyword-plugin.js
    module.exports = {
      rules: {
        'keyword-check': ({ header }) => {
          const keyword = 'JIRA';
          const result = header.includes(keyword);
          return [
            result,
            result ? '' : `The commit message must include the keyword: ${keyword}`
          ];
        }
      }
    };
    ```
    
2. 在 `commitlint.config.js` 中引入並配置這個自定義插件：
    
    ```jsx
    // commitlint.config.js
    const keywordPlugin = require('./keyword-plugin');
    
    module.exports = {
      extends: ['@commitlint/config-conventional'],
      plugins: [
        keywordPlugin
      ],
      rules: {
        'keyword-check': [2, 'always'],
      },
    };
    ```
    
    在這個例子中，我們創建了一個名為 `keyword-check` 的自定義規則，檢查提交訊息的標題是否包含特定的關鍵字（如 `JIRA`）。如果提交訊息不包含這個關鍵字，則會報錯並提示具體的錯誤訊息。
    

## **Reference**

- [**commitlint**](https://commitlint.js.org/)
- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- [**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)