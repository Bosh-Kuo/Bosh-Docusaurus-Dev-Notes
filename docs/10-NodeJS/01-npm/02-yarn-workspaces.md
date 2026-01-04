---
title: 深入解析 Yarn Workspaces：高效管理 monorepo 的必備技能
sidebar_label: "yarn workspaces"
description: 本文章深入介紹了 Yarn Workspaces，內容涵蓋了共享依賴、集中化管理、避免依賴 hoisting 的技巧，以及常用指令的應用，幫助開發者優化多專案開發流程，提高安裝效率與依賴管理的靈活性。
last_update:
  date: 2024-10-10
keywords: [yarn, yarn workspaces]
tags: [yarn]
---

> 本文適用於 `Yarn 1.x` 的版本

## **關於 Yarn Workspaces**

**Yarn Workspaces** 是 Yarn 提供的一個功能，專門用來管理一個 monorepo 中的多個子專案（通常稱為 **workspace**）。這些 workspace 可以互相依賴，並且共享相同的依賴，從而提升專案的開發效率，減少重複安裝依賴的開銷。

### **單一 Workspace 的定義與特性**

每個 **workspace** 本質上是一個包含自己 package.json 文件的獨立 npm 專案，可以相互依賴，也可以作為獨立 npm 套件發佈到 npm 等套件管理平台。

- **獨立運作**：每個 workspace 都像是一個獨立的 package，具有自己的 package.json 文件，包含自己專屬的依賴和設定。這允許子專案像是普通的 npm package 一樣被單獨發佈。
- **相互依賴**：子專案可以相互依賴，不需重複下載依賴。

### **Yarn Workspaces 的定義與特性**

Yarn Workspaces 允許在一個 monorepo 中同時管理多個子專案，它帶來的好處包括以下幾點：

- **多專案共享依賴**：不同子專案可以共用相同的 `node_modules` 目錄，這避免了重複安裝同一個依賴，從而節省磁碟空間和時間。
- **集中化管理**：所有子專案的依賴可以統一管理在根目錄的 `yarn.lock` 中，避免了每個子專案都獨立管理依賴的混亂局面。
- **跨專案依賴**：子專案之間可以相互依賴，Yarn 會自動解決這些依賴關係，無需手動處理。這讓子專案可以輕鬆引用其他子專案，無需將其發佈到 npm registry。
- **提升安裝效率**：Yarn Workspaces 可以自動將通用的依賴 **「提升」（hoist）** 到 monorepo 根目錄，避免子專案之間重複安裝相同的依賴，顯著加快安裝速度，特別是在大型專案中效果尤為明顯。

### **注意事項**

使用 Yarn Workspaces 進行開發時，必須特別注意依賴的聲明：

1. **依賴未聲明的風險**：如果某個子專案 _packageA_ 在開發過程中使用了另一個子專案 _packageB_ 的依賴 _dependencyB_，但忘記在 _packageA_ 的 package.json 中聲明該依賴，可能在開發和測試階段一切運行正常。這是因為 Workspaces 會共享根目錄的 node_modules，所以 _dependencyB_ 仍能被找到。但當 _packageA_ 發佈到 npm 等平台後，因為依賴聲明不完整，使用者將無法正常運行這個套件，因為 _dependencyB_ 不會被自動安裝。
2. **無自動檢查**：目前 Yarn Workspaces 沒有自動檢測未聲明依賴的機制，因此開發者需要格外注意，確保每個子專案的 package.json 文件中包含了所有必要的依賴聲明。

## **配置 Yarn Workspaces**

在這一章，我們將介紹如何在 monorepo 中正確配置 Yarn Workspaces，並探討一些在配置過程中常見的問題與解決方法。

### **根目錄配置**

首先，在 monorepo 的根目錄下，我們需要定義 Workspaces 的範圍和設定。根目錄的 package.json 應包含以下兩個重要屬性：

1. **private**：在根目錄的 package.json 中，必須將 private 設為 true，這是因為 monorepo 的根目錄通常不會作為一個單獨的 npm 套件發佈，而只是用來管理 Workspaces 和共享依賴。如果未將 private 設為 true，Yarn 會警告你這個專案是可發佈的。
2. **workspaces**：這是一個字串數組，用來定義哪些目錄是 Workspaces。Yarn 支持使用 glob patterns 來匹配特定路徑。例如，`"packages/*"` 會告訴 Yarn Workspaces 所有位於 packages/ 資料夾下的子目錄都是 Workspaces。

   ```json title='package.json'
   {
     "private": true,
     "workspaces": ["packages/*"]
   }
   ```

### **個別 workspace 配置**

在每個子專案（即 Workspace）中，我們需要配置自己的 package.json 文件。以下是配置時需要注意的幾個要點：

1. **private**：在大多數情況下，個別 Workspace 不需要設置 `private: true`，因為這些子專案可能會單獨發佈為 npm package。
2. **package name**：Yarn Workspaces 依據每個 package.json 中的 name 屬性來識別專案，而不是使用目錄名稱。因此，在下達 `yarn workspace <workspace_name> <command>` 時，必須使用 package.json 中的 name 屬性，而不是該 Workspace 的目錄名稱。
3. **依賴聲明**：正如在第一章提到的，在 Workspaces 中開發時，務必確認每個子專案的 package.json 文件包含了所有必要的依賴聲明，避免發佈時出現未聲明依賴的問題。

### **特別注意：相對路徑的問題**

設定 workspaces 時，使用相對路徑（如 `./package/*`）的話有可能會遇到依賴解析的問題。由於 Yarn Workspaces 預期接收 glob patterns 來匹配路徑，可能會導致 Yarn 無法正確解析依賴，這可能會導致安裝過程中發生錯誤。可以參考 [**Dots**](https://github.com/isaacs/node-glob#dots)。
以下是我遇過的錯誤：

**例子 1：有內部依賴時的解析錯誤**

如果某個 workspace（如 web）依賴於另一個內部 package，當使用 `yarn workspace install web` 時，可能會發生依賴解析錯誤，導致安裝失敗。這是因為 Yarn 無法正確處理這樣的相對路徑。

**例子 2：無內部依賴時的單一安裝**

在某些情況下，如果 web 沒有依賴於其他內部 package，安裝過程可能會成功，但這只會安裝該 workspace 自己的依賴。並且，安裝完成後，會在該 workspace 的路徑下生成一個新的 yarn.lock 檔案，而不是將依賴集中在根目錄的 yarn.lock 中，這違反了 Workspaces 的集中管理原則。

## **Yarn Workspace 相關指令**

### **`yarn workspaces info [--json]`**

這個指令會列出當前專案中的所有 Workspaces，並顯示每個 Workspace 的相關資訊。

```bash
yarn workspaces info
```

### **`yarn workspaces run <command>`**

此指令可以讓你在所有 Workspaces 中執行一個指定的命令。例如，你可以一次性在所有子專案中執行 `build` 或 `test` 指令。

```bash
yarn workspaces run build
```

### **`yarn workspace <workspace_name> <command>`**

這個指令用來對某個特定的 Workspace 執行 Yarn 命令，相當於進入該 Workspace 的目錄中執行普通的 Yarn 指令。

e.g.

```bash
yarn workspace web build
```

### **`yarn add/remove <package...> [--ignore-workspace-root-check/-W]`**

在默認情況下，Yarn 會防止你在根目錄中安裝依賴，因為它通常只是作為 Workspaces 的管理層，但有時我們可能需要在根目錄安裝一些工具或全局依賴，這時可以使用 `-W` 標誌來忽略這個限制。

e.g.

```bash
yarn add typescript -W
```

## **以 Jest 為例解釋 Yarn Workspaces 的依賴解析方法**

[**Jest**](https://github.com/jestjs/jest) 是一個使用 Yarn Workspaces 管理其套件的範例。Jest 的專案結構典型於一個 JavaScript monorepo 專案，根目錄有一個 package.json，並且 packages/ 資料夾內包含多個子專案，每個子專案也有自己的 package.json。

根目錄的 package.json 主要負責管理專案的整體依賴與設定，而子專案 jest-matcher-utils 和 jest-diff 則在 packages/ 目錄中。這些子專案的目標是可以被單獨發佈到 npm 上。根目錄通常不會被發佈，因此會將其設置為 private。

範例根目錄 package.json：

```json title='package.json'
{
  "private": true,
  "name": "jest",
  "devDependencies": {
    "chalk": "^2.0.1"
  },
  "workspaces": ["packages/*"]
}
```

其中兩個子專案的範例：

1. `jest-matcher-utils`：

   ```json title='package.json'
   {
     "name": "jest-matcher-utils",
     "version": "20.0.3",
     "dependencies": {
       "chalk": "^1.1.3",
       "pretty-format": "^20.0.3"
     }
   }
   ```

2. `jest-diff`（依賴於 `jest-matcher-utils`）：

   ```json title='package.json'
   {
     "name": "jest-diff",
     "version": "20.0.3",
     "dependencies": {
       "chalk": "^1.1.3",
       "diff": "^3.2.0",
       "jest-matcher-utils": "^20.0.3",
       "pretty-format": "^20.0.3"
     }
   }
   ```

### **Lerna 的傳統方式**

如果使用 Lerna 等工具，通常會先為每個子專案分別執行 `yarn install`，每個子專案都會有自己獨立的 `node_modules`。例如，`jest-diff` 專案會有自己的 `jest-matcher-utils` 符號連結（symlink），這會導致重複安裝許多依賴。

目錄結構如下：

```lua
jest/
| ---- node_modules/
| -------- chalk/
| ---- packages/
| -------- jest-matcher-utils/
| ------------ node_modules/
| ---------------- chalk/
| ---------------- pretty-format/
| -------- jest-diff/
| ------------ node_modules/
| ---------------- chalk/
| ---------------- diff/
| ---------------- jest-matcher-utils/  (symlink)
| ---------------- pretty-format/

```

### **Yarn Workspaces 的優化**

使用 Yarn Workspaces 後，Yarn 會將通用的依賴（如 `chalk`、`diff` 和 `pretty-format`）提升到根目錄的 `node_modules`，並且為每個子專案自動處理內部依賴的符號連結。這樣可以避免重複安裝依賴，節省安裝時間和空間。

優化後的結構如下：

```lua
jest/
| ---- node_modules/
| -------- chalk/
| -------- diff/
| -------- pretty-format/
| -------- jest-matcher-utils/  (symlink)
| ---- packages/
| -------- jest-matcher-utils/
| ------------ node_modules/
| ---------------- chalk/
| -------- jest-diff/
| ------------ node_modules/
| ---------------- chalk/

```

**優點**：這樣的架構使得依賴管理更高效，不會因為每個子專案各自安裝依賴而導致冗餘。即使某些依賴（如不同版本的 `chalk`）無法被提升，Yarn 也會保持正確的依賴解析。

這與 Lerna 的 `--hoist` 參數類似，會提升依賴以減少重複安裝。而在 `jest-diff` 中使用 `require` 時，它仍然可以正確解析它的依賴，例如：

- `require('chalk')` 會解析到當前專案的 `node_modules/chalk`。
- `require('diff')` 和其他依賴則會從提升的 `node_modules` 中解析。

## **特殊情境：使用 nohoist 避免依賴被安裝到根目錄**

Yarn Workspaces 的 **hoisting** 機制會自動將子專案（Workspaces）中重複的依賴提升（hoist）到 monorepo 根目錄的 `node_modules` 中，以減少第三方套件的佔用體積並提升安裝效率。然而，在某些情況下，我們希望某些依賴不被 hoist，並且保留在各自的 workspace 中，這時可以使用 **nohoist** 來解決這類需求。

### **設定方式**

有兩種方式可以設定 **nohoist**：

1.  **在任意 workspace 中設定**：
    你可以在單一 workspace 的 `package.json` 中使用 glob patterns 來指定哪些依賴不應該被 hoist。這允許你為特定的子專案保留獨立的依賴安裝方式。
        ```json title='package.json'
        {
          "name": "my-package",
          "version": "1.0.0",
          "private": true,
          "dependencies": {
            "example-package": "^1.0.0"
          },
          "workspaces": {
            "nohoist": [
              "**/example-package",
              "**/example-package/**"
            ]
          }
        }
        ```

        在這個例子中，`example-package` 及其所有子依賴將不會被 hoist，會保留在 `my-package` 的 `node_modules` 中。
2.  **在根目錄的 package.json 中統一設定**：
    如果多個 workspace 都有相同的需求，可以在專案的根目錄 package.json 中進行設定，這樣你可以在全局統一管理哪些依賴需要 nohoist。
        ```json title='package.json'
        {
          "private": true,
          "workspaces": {
            "packages": ["packages/*"],
            "nohoist": [
              "packages/**/example-package",
              "packages/**/example-package/**"
            ]
          }
        }
        ```

        在這種情況下，所有位於 packages/ 資料夾中的 workspace 都會根據設定，避免 hoist 指定的依賴。

### **注意事項**

- **nohoist 僅適用於 private 的 package**：不僅 monorepo 根目錄的 private 必須設為 true，個別的 workspace 也需要將 private 設為 true，否則 `nohoist` 設定將無法生效。如果 workspace 沒有設置為 private，Yarn 將認為它可能會被發佈，因此禁止一些特殊配置。
- **性能考量**：使用 `nohoist` 可能會增加安裝時間，並佔用更多的磁碟空間，因為依賴將不會被共享，而是每個 workspace 各自持有一份。

## **Reference**

- [**Workspaces in Yarn**](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)
- [**Workspaces | Yarn 管理**](https://hondrytravis.com/docs/ci_with_cd/workspace/#%E5%90%8C%E4%B8%80%E4%B8%AA-workspace-%E7%9B%B8%E4%BA%92%E5%BC%95%E7%94%A8%E5%AE%89%E8%A3%85)
- [**yarn workspaces**](https://classic.yarnpkg.com/en/docs/workspaces/)
- [**nohoist in Workspaces**](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
