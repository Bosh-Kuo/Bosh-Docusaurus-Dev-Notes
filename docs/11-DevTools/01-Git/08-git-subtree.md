---
title: Git Subtree：多專案整合的實用技巧
sidebar_label: "[Git] Git Subtree"
description: 深入介紹 Git Subtree 的使用方法與實際應用，包含指令詳解、與 Git Submodule 的比較，以及如何使用 Subtree 建立統一的專案展示 Repository，解決多專案整合與版本控制的問題。
last_update:
  date: 2025-10-31
keywords: [開發工具, Git, Git Subtree]
tags: [開發工具, Git]
---

## **Git Subtree 介紹**

### **什麼是 Git Subtree？**

`git subtree` 是 Git 內建的專案管理工具，它解決了一個常見的開發需求：

> **如何在專案 A 中整合專案 B 的程式碼，同時保持專案 B 的獨立性與可更新性？**

假設你正在開發一個主專案，需要使用另一個獨立維護的函式庫。如果只是把那個函式庫 clone 下來後複製到主專案中，雖然可以使用，但會遇到幾個問題：無法追蹤程式碼來源、難以同步原始專案的更新、無法將改進推送回原始專案。類似的情境還包括：

- 如何將主專案中某個模組拆分成獨立的 repository 供其他專案使用？
- 如何將多個獨立的小專案整合到一個統一的大 repository 中？

Git Subtree 提供的功能可以很好地解決這些問題。它可以將一個外部 Git repository 的內容**完整嵌入**到你的專案的子目錄中。這些內容會真正成為你的專案的一部分（不是連結或參照），同時保留與原始專案的關聯。使用 Git Subtree 後，你的專案結構可能如下：

```
main-project/
├── .git/
├── src/
│   └── main.js
├── lib/
│   └── shared-library/    ← Git Subtree (來自外部 repo)
│       ├── index.js
│       └── utils.js
└── README.md
```

在這個例子中，`lib/shared-library/` 目錄的內容來自另一個獨立的 Git repository（例如 `https://github.com/user/shared-library.git`），但它已經完全整合到 `main-project` 中。

Git Subtree 有以下幾個主要的功能特點：

- **完整整合**：當其他開發者 clone 主專案時，會直接取得 `lib/shared-library/` 的所有檔案和內容，不需要執行任何額外的初始化指令。這與 Git Submodule 不同，後者 clone 後只會得到一個空目錄的參照，需要額外執行 `git submodule init` 和 `git submodule update` 才能取得實際內容。
- **可直接修改**：`lib/shared-library/` 是真實存在於主專案中的目錄和檔案，不是符號連結或參照。你可以直接在主專案中編輯這些檔案，所有修改都會被 Git 正常追蹤。這與 Git Submodule 不同，後者的子目錄實際上是一個獨立的 Git repository，修改時需要進入該目錄並在其 Git 環境中操作。
- **雙向同步**：可以從原始專案拉取更新（使用 `git subtree pull` 將原始 `shared-library` repository 的新版本同步到主專案），也可以將主專案中的修改推送回原始專案（使用 `git subtree push` 將你在主專案中對 `lib/shared-library/` 的改進推送回原始的 `shared-library` repository）。

### **Git Subtree vs Git Submodule**

| 特性           | Git Subtree                       | Git Submodule                            |
| -------------- | --------------------------------- | ---------------------------------------- |
| **內容儲存**   | 完整複製到主 repo                 | 僅儲存 commit 參照                       |
| **Clone 行為** | 一次 `git clone` 即可取得所有內容 | 需要額外執行 `git submodule init/update` |
| **學習曲線**   | 較簡單，使用標準 Git 指令         | 較複雜，需要理解 submodule 概念          |
| **歷史記錄**   | 子專案歷史可選擇性保留或壓縮      | 子專案歷史獨立於主專案                   |
| **檔案大小**   | 主 repo 較大（包含所有內容）      | 主 repo 較小（僅參照）                   |
| **適用情境**   | 需要完整整合、簡化協作流程        | 需要明確版本控制、多專案共用             |
| **修改子專案** | 可直接在主 repo 中修改並推回      | 需要進入 submodule 目錄操作              |

<br/>

## **Git Subtree 的兩大常見用法**

### **1. 將外部專案整合到主專案（Add & Pull）**

**使用情境**：在主專案中使用某個函式庫或共用模組，並且能夠定期同步上游的更新。

![git-subtree-add-pull.svg](https://res.cloudinary.com/djtoo8orh/image/upload/v1761895997/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Git%20Subtree/git-subtree-add-pull_vneiem.svg)

### **2. 從主專案拆分出子專案（Split & Push）**

**使用情境**：將主專案中開發某個模組拆分成獨立的 repository，方便其他專案使用。

![git-subtree-split-push.svg](https://res.cloudinary.com/djtoo8orh/image/upload/v1761895997/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Git%20Subtree/git-subtree-split-push_wtlhrt.svg)

<br/>

## **Git Subtree 指令詳解**

### **`git subtree add`**

**用途**：將外部 repository 的內容加入到當前 repo 的指定子目錄中。

**語法**

```bash
git subtree add --prefix=<dir> <repository> <ref> [--squash] [--message=<msg>]
```

**參數說明**

| 參數              | 必填/選填 | 說明                                    | 預設值               |
| ----------------- | --------- | --------------------------------------- | -------------------- |
| `--prefix=<dir>`  | **必填**  | 指定子專案要放置的目錄路徑              | 無                   |
| `<repository>`    | **必填**  | 遠端 repo 的 URL 或已設定的 remote 名稱 | 無                   |
| `<ref>`           | **必填**  | 要拉取的分支名稱、tag 或 commit hash    | 無                   |
| `--squash`        | 選填      | 將外部 repo 的所有歷史壓縮成單一 commit | 不壓縮，保留完整歷史 |
| `--message=<msg>` | 選填      | 自訂合併 commit 的訊息                  | 自動生成訊息         |

**實際範例**

```bash
# 範例 1：加入外部函式庫（保留完整歷史）
git subtree add --prefix=lib/utils https://github.com/user/utils-lib.git main

# 範例 2：加入外部函式庫（壓縮歷史，保持主專案乾淨）
git subtree add --prefix=vendor/logger https://github.com/user/logger.git v1.0 --squash

# 範例 3：使用已設定的 remote
git remote add utils-remote https://github.com/user/utils-lib.git
git subtree add --prefix=lib/utils utils-remote main --squash
```

### **`git subtree pull`**

**用途**：從遠端 repository 拉取最新變更，並合併到當前 repo 的 subtree 目錄中。用於同步上游專案的更新。

**語法**

```bash
git subtree pull --prefix=<dir> <repository> <ref> [--squash] [--message=<msg>]
```

**參數說明**

| 參數              | 必填/選填 | 說明                            | 預設值               |
| ----------------- | --------- | ------------------------------- | -------------------- |
| `--prefix=<dir>`  | **必填**  | 指定要更新的 subtree 目錄路徑   | 無                   |
| `<repository>`    | **必填**  | 遠端 repo 的 URL 或 remote 名稱 | 無                   |
| `<ref>`           | **必填**  | 要拉取的分支、tag 或 commit     | 無                   |
| `--squash`        | 選填      | 將更新壓縮成單一 commit         | 不壓縮，保留完整歷史 |
| `--message=<msg>` | 選填      | 自訂合併 commit 訊息            | 自動生成訊息         |

**實際範例**

```bash
# 範例 1：更新 subtree（保留完整歷史）
git subtree pull --prefix=lib/utils https://github.com/user/utils-lib.git main

# 範例 2：更新 subtree（壓縮歷史）
git subtree pull --prefix=lib/utils https://github.com/user/utils-lib.git main --squash

# 範例 3：使用 remote 名稱
git subtree pull --prefix=vendor/logger logger-remote v2.0 --squash
```

:::caution[重要]
如果在  `add`  時使用了  `--squash`，那麼後續的  `pull`  也應該使用  `--squash`，以保持一致性。
:::

:::note[原因]
當使用  `--squash`  時，Git 會壓縮外部 repo 的歷史並記錄特殊的合併點。如果後續  `pull`  不使用  `--squash`，Git 會嘗試合併完整歷史，但無法正確追踪合併基底（merge base），導致重複的 commit、合併衝突或歷史混亂。
:::

### **`git subtree push`**

**用途**：將 subtree 目錄中的變更推送回對應的外部 repository。適用於在主專案中修改了 subtree 的內容，需要同步回上游專案的情境。

**語法**

```bash
git subtree push --prefix=<dir> <repository> <ref>
```

**參數說明**

| 參數             | 必填/選填 | 說明                            | 預設值 |
| ---------------- | --------- | ------------------------------- | ------ |
| `--prefix=<dir>` | **必填**  | 指定要推送的 subtree 目錄路徑   | 無     |
| `<repository>`   | **必填**  | 遠端 repo 的 URL 或 remote 名稱 | 無     |
| `<ref>`          | **必填**  | 要推送到的目標分支名稱          | 無     |

**實際範例**

```bash
# 範例 1：推送變更到上游 main 分支
git subtree push --prefix=lib/utils https://github.com/user/utils-lib.git main

# 範例 2：推送到特定分支
git subtree push --prefix=vendor/logger logger-remote feature/new-feature

# 範例 3：使用 remote 名稱
git remote add utils-upstream https://github.com/user/utils-lib.git
git subtree push --prefix=lib/utils utils-upstream main
```

**工作流程示意**

```
1. 在主專案修改 subtree 內容
   main-project/lib/utils/index.js  (修改檔案)
   ↓
2. 在主專案 commit 變更
   git add lib/utils/
   git commit -m "fix: improve utils"
   ↓
3. 推送變更回上游
   git subtree push --prefix=lib/utils https://github.com/user/utils-lib.git main
   ↓
4. 上游 repo 收到更新
   utils-lib repo 的 main 分支更新
```

### **`git subtree merge`**

**用途**：將本地已存在的分支或 commit 合併到 subtree 目錄中。與  `pull`  的差異在於  `merge`  不會自動從遠端抓取，僅處理本地已有的內容。

**語法**

```bash
git subtree merge --prefix=<dir> <ref> [--squash] [--message=<msg>]
```

**參數說明**

| 參數              | 必填/選填 | 說明                               | 預設值       |
| ----------------- | --------- | ---------------------------------- | ------------ |
| `--prefix=<dir>`  | **必填**  | 指定 subtree 目錄路徑              | 無           |
| `<ref>`           | **必填**  | 要合併的本地分支名稱或 commit hash | 無           |
| `--squash`        | 選填      | 將合併壓縮成單一 commit            | 不壓縮       |
| `--message=<msg>` | 選填      | 自訂合併 commit 訊息               | 自動生成訊息 |

**實際範例**

```bash
# 範例 1：先 fetch 再 merge（分兩步驟）
git fetch https://github.com/user/utils-lib.git main
git subtree merge --prefix=lib/utils FETCH_HEAD --squash

# 範例 2：合併本地分支
git subtree merge --prefix=lib/utils utils-local-branch

# 範例 3：合併特定 commit
git subtree merge --prefix=lib/utils abc123def --squash
```

**`pull` vs `merge`  的差異**

```
git subtree pull = git fetch + git subtree merge

使用 pull（一步完成）：
git subtree pull --prefix=lib/utils https://github.com/user/utils-lib.git main
   ↓
自動執行：fetch + merge

使用 fetch + merge（分兩步）：
git fetch https://github.com/user/utils-lib.git main
git subtree merge --prefix=lib/utils FETCH_HEAD
```

### **`git subtree split`**

**用途**：將主專案中某個子目錄的 Git 歷史切分出來，建立成一個獨立的分支。這個分支只包含該目錄的變更歷史，常用於從單一大型 repo 拆分出子專案。

**語法**

```bash
git subtree split --prefix=<dir> [--branch <name>] [--annotate=<str>] [--onto=<rev>] [--rejoin] [--ignore-joins] [--squash]
```

**參數說明**

| 參數               | 必填/選填 | 說明                            | 預設值           |
| ------------------ | --------- | ------------------------------- | ---------------- |
| `--prefix=<dir>`   | **必填**  | 指定要切分的子目錄路徑          | 無               |
| `--branch <name>`  | 選填      | 將切分結果直接輸出到指定分支    | 輸出 commit hash |
| `--annotate=<str>` | 選填      | 在 commit message 加上前綴標註  | 無標註           |
| `--onto=<rev>`     | 選填      | 將切分後的歷史基於指定的 commit | 無基底           |
| `--rejoin`         | 選填      | 建立一個 join commit 記錄切分點 | 不建立           |
| `--ignore-joins`   | 選填      | 忽略先前的 join commit          | 不忽略           |
| `--squash`         | 選填      | 將所有歷史壓縮成單一 commit     | 保留完整歷史     |

**實際範例**

```bash
# 範例 1：切分子目錄並建立新分支
git subtree split --prefix=modules/auth --branch auth-module

# 範例 2：切分並推送到新的 repo
git subtree split --prefix=lib/utils --branch utils-split
git push https://github.com/user/new-utils-repo.git utils-split:main

# 範例 3：壓縮歷史後切分
git subtree split --prefix=components/ui --branch ui-lib --squash

# 範例 4：切分並加上註解
git subtree split --prefix=services/api --branch api-service --annotate="[API] "
```

**使用  `--rejoin`  的好處**

```bash
# 使用 --rejoin
git subtree split --prefix=modules/auth --branch auth-module --rejoin
```

- `--rejoin`  會建立一個特殊的 merge commit，記錄這次切分的位置。好處是：
- 下次再執行  `split`  時，Git 知道從哪裡開始，速度更快
- 避免重複處理已經切分過的歷史
- 適合需要多次執行  `split`  的情境

<br/>

## **我的使用情境：使用 Git Subtree 建立練習用專案管理 Repo**

### **問題與需求**

在學習新技術或框架時，我通常會建立小型實作專案來練習。每學一個新技術就會有一個新專案，數量累積起來相當可觀。由於是練習性質，這些專案的 commit 訊息和程式碼結構都比較隨意，因此我也不太想要把每個練習用的小專案都公開到 Github 上，怕會讓我的 Github 公開版面變得很雜亂。但另一方面，儘管這些專案雖然是練習，仍然有一定的展示價值，我還是希望能保留這些練習成果。

總合上面所述，整理了一下我的問題與需求：

- 每個小專案都公開 → GitHub 頁面變得很亂
- 全部設為私有 → 失去展示學習成果的機會
- 練習專案的 commit 通常很雜亂（如 "test", "fix bug", "try again"）
- 不想讓這些不專業的 commit 訊息公開展示
- 練習專案可能會持續改進
- 需要一個簡單的方式同步更新到展示 repo

### **解決方案：使用 Git Subtree 建立統一展示 Repo**

我一開始的想法是，或許我可以把所有練習用的專案都集中放到一個公開的 repo，用資料夾名稱區分類型，這樣別人就可以在我的 Github 公開版面上透過這個單一公開 repo 看到所有我想要展示的小專案。經過一些研究後發現， Git Subtree 提供的功能可以洽好滿足我的所有需求

我想到，我可以建立一個公開的  `learning-projects` repository，使用 Git Subtree 整合所有練習專案，專案結構如下：

```
learning-projects/  (公開 repo)
├── frontend/
│   ├── react-hooks-practice/      ← subtree from private repo
│   ├── nextjs-blog/                ← subtree from private repo
│   └── vue3-composition-api/       ← subtree from private repo
├── backend/
│   ├── express-api-practice/       ← subtree from private repo
│   └── graphql-server/             ← subtree from private repo
├── fullstack/
│   └── mern-todo-app/              ← subtree from private repo
└── README.md
```

**工作流程**

**1. 初始設定：將私有練習專案加入展示 repo**

```bash
# 進入展示 repocd learning-projects

# 使用 --squash 壓縮雜亂的 commit 歷史
git subtree add --prefix=frontend/react-hooks-practice \
  https://github.com/myusername/react-hooks-practice-private.git \
  main --squash \
  --message="Add React Hooks practice project"

# 重複此步驟加入其他專案
git subtree add --prefix=backend/express-api-practice \
  https://github.com/myusername/express-api-private.git \
  main --squash

```

**2. 在私有 repo 中持續開發**

```bash
# 在私有專案中正常開發cd ~/projects/react-hooks-practice-private
git add .
git commit -m "try new approach"# 隨意的 commit 訊息沒關係
git commit -m "fix"
git commit -m "test again"
git push origin main
```

**3. 定期同步到展示 repo**

```bash
# 回到展示 repocd ~/projects/learning-projects

# 使用 pull 同步更新（--squash 壓縮所有新 commit）
git subtree pull --prefix=frontend/react-hooks-practice \
  https://github.com/myusername/react-hooks-practice-private.git \
  main --squash \
  --message="Update React Hooks practice"

# 推送到公開 repo
git push origin main
```

### **實際效果與優點**

**私有練習 repo 的 commit 歷史**（雜亂）：

```
react-hooks-practice-private (main)
* a1b2c3d test again
* d4e5f6g fix
* g7h8i9j try new approach
* j1k2l3m add useCallback
* m4n5o6p wip
* p7q8r9s initial setup
```

**公開展示 repo 的 commit 歷史**（乾淨）：

```
learning-projects (main)
* xyz789 Update React Hooks practice  ← 壓縮了 6 個雜亂的 commit
* abc123 Add Express API practice
* def456 Add React Hooks practice project
* ghi789 Initial commit
```

**使用 Subtree 的優點：**

- **保持 GitHub 個人頁面整潔**：訪客只看到一個整理過的  `learning-projects` repository，按技術分類清楚展示所有練習專案，而不是散落各處的零散 repo
- **隱藏雜亂的開發歷史**：使用  `--squash`  壓縮 commit 歷史，可以將隨意的 commit 訊息轉換為簡潔專業的更新記錄
- **簡化同步流程**：只需一行  `git subtree pull`  指令即可將更新同步到展示 repo
- **分離關注點**：私有 repo 作為「工作草稿區」可以亂七八糟，公開 repo 作為「精選作品集」保持整潔

<br/>

## **Reference**

- [**Git Subtrees: Simplify Project Dependencies for Beginners 🚀**](https://www.youtube.com/watch?v=xPPwSOaVUM8)
- [**git subtree tutorial 📝**](https://github.com/twtrubiks/Git-Tutorials/blob/master/git_subtree_turorial.md)
- [**Git subtree: the alternative to Git submodule**](https://www.atlassian.com/git/tutorials/git-subtree)
