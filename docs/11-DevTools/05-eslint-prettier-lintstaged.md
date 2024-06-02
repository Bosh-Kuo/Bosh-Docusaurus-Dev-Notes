---
title: 整合 ESLint, Prettier, Husky, lint-staged 維護團隊開發品質
sidebar_label: "[Other] 整合 ESLint, Prettier, Husky, lint-staged 維護團隊開發品質"
description: 本篇文如何在一個前後端專案中設置 ESLint, Prettier, Husky, lint-staged
last_update:
  date: 2023-04-24
keywords:
  - 開發工具
  - ESLint
  - Prettier
  - Husky
  - lint-staged
tags:
  - 開發工具
  - ESLint
  - Prettier
  - Husky
  - lint-staged
---

![](https://miro.medium.com/v2/resize:fit:720/format:webp/1*PdxQHwcQZDxJK4rWB743Sg.png)

<p >
圖片來源：
<a href="https://tech.groww.in/maintain-code-consistency-using-eslint-prettier-husky-and-lint-staged-a657083d461b">Maintain code consistency using ESLint, Prettier, husky and lint-staged</a>
</p>

## **前言**

由於公司的專案缺乏統一的程式碼風格和格式規範，這對於團隊的協作和專案的維護都帶來了一些困擾。主要遇到的問題是每個開發人員都有自己的 coding style 和格式偏好，各自使用的編輯器的 formatter 也不盡相同，這導致大家的自動排版格式都不太一樣。同時，許多人使用 VSCode 編輯器的 formatOnSave 功能，這個功能雖然方便，但常常會把與修改內容無關的程式碼一起自動格式化並且 commit，這些跟真正修改內容無關的 code 會影響到 reviewer 檢查提交者的程式碼。

為了改善這種情況，我決定幫公司導入 `ESLint`、`Prettier`、`Husky` 和 `lint-staged` 等工具來統一程式碼風格和格式規範，在編輯頁面就讓所有開發者使用相同的 coding style 與 format ，並且在提交程式碼之前進行檢查，強制 push 到 Github/GitLab 的 Code 都是採用相同的風格與規範，從而保證程式碼品質和提高團隊開發效率。我將導入的過程與查詢的資料記錄下來，方便未來創建新專案時可以 follow 相同的步驟導入這些工具。

### **工具介紹**

以下是這些工具的簡單介紹和協作使用方式：

1. `ESLint`：靜態程式碼分析工具，用於檢查 JavaScript 程式碼中的錯誤和風格問題。可以透過在專案根目錄下的 `.eslintrc` 配置檔案進行自訂的規則設置。
2. `Prettier`：程式碼格式化工具，可以自動調整程式碼的縮排、空格、引號等格式問題。可以透過在專案根目錄下的 `.prettierrc` 配置檔案進行自訂的格式化設置。
3. `Husky`：Git hooks 工具，可以在 Git 版本控制系統中設置 pre-commit 和 pre-push 的鉤子，讓開發人員在進行 commit 和 push 操作前執行指定的腳本。
4. `lint-staged`：一個 Git hooks 工具，可以在 Git pre-commit 鉤子執行時對指定的檔案進行 lint 檢查以及 format 等動作，以確保程式碼符合預定的規範和標準。

<br/>

## **ESLint**

`ESLint` 是一個靜態程式碼分析工具，用於檢查 JavaScript 程式碼中的錯誤和風格問題。它可以幫助開發者在開發過程中發現和修復程式碼問題，從而提高程式碼品質和開發效率。`ESLint` 可以通過定義開頭為 `.eslintrc` 的配置文件進行自定義設置，例如指定需要檢查的規則、忽略某些檔案或目錄等，同時可以通過 .eslintignore 文件來排除不需要進行 Linter 檢查的文件或文件夾

### **安裝並且配置基本 config**

這個步驟可以 follow ESLint 官方的 [Quick start](https://eslint.org/docs/latest/use/getting-started)，使用下列指令：

```bash
npm init @eslint/config
```

CLI 工具會問以下幾個問題來幫助配置 `.eslintrc`

**✔ How would you like to use ESLint?** · style

**✔ What type of modules does your project use? ·** esm

**✔ Which framework does your project use?** · react

**✔ Does your project use TypeScript? · No / Yes**

**✔ Where does your code run?** · browser

**✔ How would you like to define a style for your project? ·** guide

**✔ Which style guide do you want to follow? ·** airbnb

**✔ What format do you want your config file to be in? ·** JSON

配置完成後會產生一個 .eslintrc 開頭的 config 檔，以下為一個範例：

```bash
# .eslintrc.json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
```

### **簡介 .eslintrc 配置選項**

**`.eslintrc`** 是一個用於配置 ESLint 的文件，下面是一些常見的配置選項：

- **`env`**: 指定使用的環境，例如 **browser**、**node**、**es6** 等等。
- **`parser`**: 指定使用的 JavaScript 解析器，例如 **babel-eslint**、**@typescript-eslint/parser** 等等。
- **`extends`**: 繼承自哪些 ESLint 配置文件，可以使用官方提供的 **`eslint:recommended`**，也可以使用第三方提供的配置文件。
- **`plugins`**: 引入自定義的 ESLint 插件，例如 **eslint-plugin-react**、**eslint-plugin-vue** 等等。
- **`rules`**: 定義 ESLint 規則，可以覆蓋繼承的配置，也可以自定義一些規則，例如 **no-console**、**no-unused-vars** 等等。

:::tip
💡 在 ESLint 中，**`extends`** 和 **`plugins`** 都是用來擴展 ESLint 功能的機制，但它們的作用不同：

- **`extends`**: 用於引入已有的 ESLint 配置，例如官方提供的 **eslint:recommended**，也可以使用第三方提供的配置文件。**extends** 適合用於導入一個完整的、已經設置好的配置，可以讓開發者輕鬆地擁有一個較為完整的 ESLint 配置。
- **`plugins`**: 用於引入自定義的 ESLint 插件，例如 **eslint-plugin-react**、**eslint-plugin-vue** 等等。**plugins** 適合用於導入一個或多個特定領域的 ESLint 檢查規則，例如 React、Vue 等等。這樣可以讓開發者使用 ESLint 檢查特定領域的程式碼，從而更加準確地進行程式碼檢查。
:::

### **安裝 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) 套件**

通常 Linter 不僅包含 code quality rules，還包含 stylistic rules。然而，大多數 stylistic rules 在使用 Prettier 時都是不必要的，更糟糕的是，它們有可能會與 Prettier 發生衝突！ESLint 與 Prettier 都建議在 ESLint 配置中包含 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) ，它會禁用 ESLint 中與 Prettier 重複的規則，讓 ESLint 只檢查 Prettier 不能處理的格式化問題。

- Install

```bash
yarn add -dev eslint-config-prettier
```

- 記得每個 .eslintrc 都要在 extends 加上 prettier，因為子目錄的 .eslintrc 設定會 override 父目錄的 .eslintrc 設定，詳見 [@ESLint - Cascading and Hierarchy](https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy)。且記得要在加在 extends array 的最後一個位置，這樣他才能 override 其他 extends。

```json
// .eslintrc
{
  "extends": [
	  ...
    "prettier"
  ]
}
```


<br/>


## **Prettier**

`Prettier` 是一款強大的程式碼格式化工具，它可以自動化地使程式碼變得更加統一和易於閱讀。使用 `Prettier`，可以避免在整個團隊中使用不同的編輯器和不同的程式碼風格所帶來的不一致性問題。在使用 `Prettier` 時，我們可以通過定義開頭為`.prettierrc` 的配置文件來設置自己的格式化規則，同時也可以通過 `.prettierignore` 文件來排除不需要格式化的文件或文件夾。這樣可以使 `Prettier` 更好地符合團隊的需求和習慣，並減少因 `Prettier` 格式化而造成的問題。

### **Install**

```bash
yarn add -D prettier @trivago/prettier-plugin-sort-imports
```

- 添加 .prettierignore
- 於 package.json 的 scripts 中加入 format 指令:

```jsx
"format": "prettier --check \"./src/**/*.js\"",
"format-write": "prettier --write --ignore-unknown \"./src/**/*.js\"",
```

### **.prettierrc 常用配置解釋**

```json
// .prettierrc
{
  "semi": false,  // 控制是否在語句結尾加上分號。
  "singleQuote": false,  // 控制是否使用單引號或雙引號。
  "tabWidth": 2,  // 設置縮進的寬度。
  "trailingComma": "all",  // 控制是否在多行程式碼的最後一行添加逗號。
  "arrowParens": "always",  // 控制是否在箭頭函數的參數周圍添加括號。
  "bracketSameLine": false,  // 控制 > 是否放置在與 tag 結尾同行或是換行
}
```

更多配置說明可以參考官方文檔 [@Prettier - Options](https://prettier.io/docs/en/options.html) 

:::tip
當 Vscode 的自動排版沒有反應時，通常是因為 Prettier 的相關設定或套件出現問題。可以檢查**輸出**查看錯誤訊息。舉例來說，我本來嘗試使用 [prettier-plugin-organize-imports](https://www.npmjs.com/package/prettier-plugin-organize-imports) 這個 plugin，但安裝後 prettier 就沒有反應了，才發現是因為這個套件與 typescript 是 peer dependencies 關係。
:::


### **[prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)**

**`prettier-plugin-sort-imports`** 是一個 `Prettier` 插件，用於指定 import 語句的排序順序。排序順序以 Regular Expression 表示，匹配的模塊將按照指定的順序進行排序。此 plugin 預設自動將第三方套件排序至最上層，若要調整第三方套件的排序順位可以使用 `<THIRD_PARTY_MODULES>` 來安排第三方套件的排序順位。

```jsx
// .prettierrc.js
// react 套件 >> 第三方套件 >> @core 開頭路徑 >> @server 開頭路徑 >> ~ 開頭路徑 >> .或/開頭路徑
{  
	"importOrder": [
    '^(^react$|@react|react)',
    "<THIRD_PARTY_MODULES>",
    '^@core/(.*)$',
    '^@server/(.*)$',
    '^@ui/(.*)$',
    "^~/(.*)$",
    '^[./]',
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```


<br/>


## **Husky + lint-staged**

`Husky` 是一個 Git Hooks 管理工具，它可以在 Git 提交前、提交時、提交後等關鍵點上執行指定的腳本。透過 Husky，開發者可以自定義在提交程式碼前要執行哪些程式碼檢查、格式化等操作。而 `lint-staged` 則是一個可以讓開發者在 Git 提交前只對即將提交的程式碼進行 Lint 檢查的工具。它可以透過正則表達式對即將提交的文件進行篩選，然後對這些文件進行 Lint 檢查，最後將檢查結果反饋給開發者。透過 lint-staged，開發者可以在提交前及時發現程式碼中的錯誤和風格問題。 這兩者可以協作使用，透過 `Husky`，可以在 Git 提交前觸發 `lint-staged` 進行 Lint 檢查，如果檢查失敗，則阻止 Git 提交操作，從而保證提交的程式碼品質。具體實現方式是，在 `Husky` 的 **pre-commit hook** 中執行 `lint-staged` 的腳本，將 Lint 檢查結果傳遞給 `Husky`，再由 `Husky` 判斷是否允許提交操作。

### **Install**

```bash
# 安裝 Husky 和 Lint-staged
yarn add --dev husky lint-staged
# 初始化 Husky，會在專案中創建一些預設的 Git Hooks。
npx husky install
# 設置了一個腳本，使得每次執行 npm install 或 npm ci 之前，都會自動運行 husky install
npm pkg set scripts.prepare="husky install"
# 添加一個 Git hook，每次在提交程式碼之前運行 Lint-staged
npx husky add .husky/pre-commit "npx lint-staged"
```

## **配置 .lintstagedrc**

```bash
{
    "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx}": "eslint --fix",
        "src/**/*.{js,jsx,ts,tsx,css,scss,md}": "prettier --write --ignore-unknown"
    }
	}
```

這個配置會讓 commit 前先對 src 中所有 js,jsx,ts,tsx 檔跑過一次 `eslint --fix`，如果這個指令拋出錯誤則 commit 會被擋下來，接著對 src 中所有 js,jsx,ts,tsx,css,scss,md 檔跑過一次 `prettier --write --ignore-unknown`，如此我們就能確定團隊中每個成員 commit 後的程式碼都使用同一套風格與檢查規則

:::tip
💡 [Prettier 官方文件](https://prettier.io/docs/en/install.html#git-hooks) 提到，如果 lint-staged 有使用 ESLint，那必須確保 ESLint 在 Prettier 前面先執行
:::


<br/>


## **Reference**

- [**ESLint**](https://eslint.org/)
    - [**@ESlint - Rules Reference**](https://eslint.org/docs/latest/rules)
    - [**@ESLint - Command Line Interface Reference**](https://eslint.org/docs/latest/use/command-line-interface)
    - [**@ESLint - Configuration Files**](https://eslint.org/docs/latest/use/configure/configuration-files)
    - **[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript#types)**
- [**Prettier**](https://prettier.io/)
    - [**@Prettier - Integrating with Linters**](https://prettier.io/docs/en/integrating-with-linters.html)
    - [**@Prettier - Options**](https://prettier.io/docs/en/options.html)
    - [**@Prettier - CLI**](https://prettier.io/docs/en/cli.html)
    - [**@Prettier - Git hooks**](https://prettier.io/docs/en/install.html#git-hooks)
    - [**eslint-config-prettier**](https://github.com/prettier/eslint-config-prettier)
    - [**prettier-plugin-sort-imports**](https://github.com/trivago/prettier-plugin-sort-imports)
- [**Husky**](https://typicode.github.io/husky/#/)
- [**lint-staged**](https://github.com/okonet/lint-staged)
- **ESLint + Prettier + Husky**
    - **[使用ESLint, Prettier, Husky, Lint-staged以及Commitizen提升專案品質及一致性](https://medium.com/@danielhu95/set-up-eslint-pipeline-zh-tw-990d7d9eb68e)**
    - **[Configure prettier, eslint, husky (pre commit hook), lint-staged in react + typescript project](https://gist.github.com/shahsagarm/4017ae2a918d15b673299be400157062)**
    - **[Maintain code consistency using ESLint, Prettier, husky and lint-staged](https://tech.groww.in/maintain-code-consistency-using-eslint-prettier-husky-and-lint-staged-a657083d461b)**
    - **[ESLint with VSCode, Prettier, Husky and React For Beginners](https://www.youtube.com/watch?v=ZXW6Jn6or1w&ab_channel=CoderOne)**