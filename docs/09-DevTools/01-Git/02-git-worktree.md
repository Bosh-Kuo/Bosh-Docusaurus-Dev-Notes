---
title: Git Worktree：有效管理多個分支和工作目錄的秘訣
sidebar_label: "[Git] Git Worktree：有效管理多個分支和工作目錄的秘訣"
description: 本篇文章紀錄如何使用 Git Worktree 來解決切換分支時常遇到問題
last_update:
  date: 2023-11-08
keywords:
  - 開發工具
  - Git
  - Git Worktree
tags:
  - 開發工具
  - Git
---

## **Git 工作流程中常見的切換分支問題**

Git 在現代的軟體開發工作中佔了舉足輕重的角色，它提供了版本控制管理的強大功能，使開發團隊能夠更好地追蹤程式碼更改、合併新功能。無論是小型團隊還是大型企業，Git 都成為了不可或缺的工具，有助於提高開發效率並確保程式碼的穩定性和可靠性。隨著專案的開發人數增加，開發團隊通常會制定自己的 Git 團隊規範，以確保團隊中所有的開發人員都是用同個工作流程在協作。說到工作流程，有在使用 Git 協作的開發團隊應該都有看過這張 **Git Flow** 工作流程圖：

<img src= "https://res.cloudinary.com/djtoo8orh/image/upload/v1699373286/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Git%20Worktree/Git-flow_nydjxg.png" width="500"/>

<p >圖片來源：
    <a href="https://nvie.com/posts/a-successful-git-branching-model/">A successful Git branching model</a>
</p>

除了 **Git Flow** 外，與有許多優秀的 Work Flow ，像是：**Github Flow**, **GitLab Flow**。這些 Work Flow 的共通點就是以 branch 來區分不同階段的工作進程。無論我們使用哪種 Work Flow，在現代的團體開發過程中，我們經常需要在不同的分支之間切換，來處理不同的任務。

當我們正在某個分支開發，卻臨時需要切換到不同的分支時，若目前正在更動的檔案與目標分支上的檔案有衝突，git 會跳出向下列這樣的錯誤警告訊息：

```bash
error: Your local changes to the following files would be overwritten by checkout:
        <檔案名稱>
Please commit your changes or stash them before you switch branches.
Aborting
```

這時候我們通常有兩種選擇：

1. 先在目前的分支 `git stash`，切換到目標分支完成要做的事情後再切回原本的分支 `git pop`。
2. 先在目前的分支提交一個暫時 `commit`，切換到目標分支完成要做的事情後再切回原本的分支用 `git reset -soft <commit>` 拆掉剛剛的 `commit`。

這兩種方法都可以還原本來在這個分支上的更動，但都有危險之處。假設我同時收到兩個修改 feature-1 與 feature-2 分支的任務需求，而且這兩個修改任務可能都需要花費我足夠長的時間，我可能修完 feature-1 與 feature-2 後已經忘記之前在哪個 branch 上曾經 `git stash` 過或提交過暫時 `commit`，這種狀況就滿危險的。其次，有可能我在修改 feature-1 與 feature-2 時是需要交互切換確認資訊的，那麽在 feature-1 與 feature-2 的切換過程中，就有可能再遇到上面提到的 git 衝突警告訊息。

本篇要介紹 Git worktree 非常適合用來處理上述的情境。

<br/>


## **Git worktree 的使用方法**
簡單介紹一下 Git worktree 能怎麼幫我們解決上述的問題。在認識 Git worktree 之前我常常在想，要是 Git 可以幫我把我現在正在編輯的檔案保留在現在的分支上，切換分支的時候不要把這些還沒 commit 或 stash 的已編輯檔案一起帶到目標分支上，這樣不就不會起衝突了嗎？

經過一番搜尋後，我發現 GIt worktree 正好可以實現這個需求。Git worktree 可以幫我們為特定的分支建立一個獨立的**工作目錄**，這個工作目錄可以不在原 Git 專案的資料夾底下，但它仍受原 Git 專案所管理。當我們想要在不提交 commit 或 stash 的情況下換到不同分支上工作，我們可以利用 Git worktree 幫我們建立目標分支的工作目錄，然後直接進入該工作目錄裡面工作。

### **簡單的 Git worktree 使用範例**

如下圖所示，我目前正在 `~/Desktop/Experiments/Git-Experiment` 這個專案資料夾底下的 `main` branch 上編輯 `A.txt` 與 `B.txt`。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1699373286/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Git%20Worktree/main-branch_juppqo.png)

突然間，我收到一個緊急修改 `C.txt` 檔案的一個小 bug 的緊急需求，需要開一個 `branchC` 來解決。由於我的`A.txt` 與 `B.txt`都還在編輯中，我不想要 commit 或 stash，也不想把 `A.txt` 與 `B.txt` 編輯紀錄帶到 `branchC` 上，這時候我可以下這個指令：

```bash
git worktree add -b branchC ../branchCFolder main
```

這個指令的意思是在 `../branchCFolder` 路徑下建立一個工作目錄，並且以 `main` branch 為基底創建一個 `branchC` 分支。當我們進入 `../branchCFolder` 時，預設就是處在 `branchC` 分支上，而且在這個資料夾底下，是沒有 `A.txt` 與 `B.txt` 的編輯紀錄的。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1699373286/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Git%20Worktree/branchC_stjwcj.png)

當我在這個 worktree 上完成對 `C.txt` 的修改與 commit 後，這個 worktree 就沒有存在的必要了，我們可以用兩種方式把這個 worktree 移除。

- 第一種是用 `remove` 指令：

```
git worktree remove ~/Desktop/Experiments/branchCFolder
```

- 第二種則是手動刪除 branchCFolder 資料夾，再下 `prune` 指令

```
git worktree prune
```

如果只有手動刪除 `branchCFolder` 資料夾，那麼 `~/Desktop/Experiments/Git-Experiment` 底下的 .git 仍然會有 `branchCFolder` 的 worktree 引用紀錄，當我之後想再用`branchCFolder`為工作目錄路徑在建立一個 worktree 就會報錯。


<br/>


## **Git worktree 的工作原理與概念**

那麼 Git worktree 是怎麼運作的呢？延續上面的例子，打開 `branchCFolder` 資料夾並且顯示隱藏檔案，會發現有一個 `.git` 檔，這個檔案的內容為:

```
gitdir: /Users/boshkuo/Desktop/Experiments/Git-Experiment/.git/worktrees/branchCFolder
```

這表示該 worktree 的 Git 儲存庫是存儲在這個路徑下的。

接著我們來看看 `/Users/boshkuo/Desktop/Experiments/Git-Experiment/.git/worktrees/branchCFolder` 這個路徑。在這個資料夾下有幾個檔案：

- **gitdir**:

```
/Users/boshkuo/Desktop/Experiments/branchCFolder/.git
```

該 gitdir 檔案是一個符號連結（symlink），它指向與工作樹關聯的.git 目錄。它告訴 Git 在哪個位置可以找到工作樹相關的儲存庫。

- **HEAD**:

```
ref: refs/heads/branchC
```

這表示這個 worktree 現在處於 "branchC" 分支上。


<br/>


## **常見 Git worktree 指令**

### **創建新的工作目錄**：

```bash
# 創建新的工作目錄，並在其中工作於指定的分支或提交。 
git worktree add <工作目錄路徑> <分支或commit的名稱>

# 創建一個「分離頭指針」的工作目錄，新工作目錄將處於分離狀態，不會自動與分支關聯。
git worktree add --detach <工作目錄路徑> <特定提交的哈希值>

# 創建新工作目錄的同時創建一個新分支，新分支以 <基礎分支> 為基底起點
git worktree add -b <新分支名> <工作目錄路徑> <基礎分支>

# 強制創建工作目錄，即使存在相同名稱的目錄。
git worktree add -f <工作目錄路徑> <分支或提交的名稱>
```

### **列出現有的工作目錄**：

```bash
git worktree list
```

### **刪除工作目錄**：

```bash
# 刪除工作目錄，並清理 .git 中的 worktree 引用。
git worktree remove <工作目錄路徑>
```

### **清理工作目錄**：

```bash
# 清理 .git 中被手動刪除的工作目錄的 worktree 引用。
git worktree prune
```

### **鎖定和解鎖工作目錄**：

```bash
# 鎖定工作目錄，防止在其中進行修改
git worktree lock /path/to/worktree

# 解鎖工作目錄，允許在其中進行修改
git worktree unlock /path/to/worktree
```


<br/>


## **個人使用情境**

自從認識 Git worktree 後，我發現在很多日常工作的情境下都很適合使用，我自己使用 GIt worktree 的場景大概有四個：

1. **緊急修復其他分支上的問題：** 在軟體開發中，經常會遇到需要立即修復其他分支上的問題的情況。使用 Git worktree，我可以輕鬆地在主工作目錄之外建立一個新的工作樹，以快速解決問題，而不會干擾正在進行的開發工作。
2. **同時開發多個功能：** 在進行多個功能開發時，往往需要在不同的分支上工作。使用工作樹，我可以同時保持多個獨立的工作目錄，每個目錄都專注於不同的功能或任務，這樣可以更容易地管理和切換工作上下文。
3. **在本地端 code review 與測試：**有時候在 code review 時，會需要把 code 拉下來跑跑看，使用 Git worktree，我可以輕鬆地創建一個獨立的測試工作目錄，在其中進行程式測試，而不會影響主要的開發環境。
4. **建立做 Code base 筆記專用的獨立筆記分支：** 團體專案的 codebase 一定會有很多 與自己的 coding style 不同的的 code ，在修改功能時，常常需要先花大量的時間理解別人寫的 code 是怎麼運作的，才有辦法開始開始寫。因此我習慣開一隻 `Notes` 分支，當我在 trace code 時會直接在這個分支上做筆記，這可以輔助我修改功能時能更快速的理解怎麼使用別人寫的 code，同時又不會在開發分支上留下太多註解。


<br/>


## **Reference**

- **[How to Use Git Worktree | Checkout Multiple Git Branches at Once](https://www.youtube.com/watch?v=s4BTvj1ZVLM&t=78s)**
- **[使用 git worktree 管理一個本地儲存庫下的多個工作目錄副本](https://blog.miniasp.com/post/2023/10/29/git-worktree-manage-multiple-working-directories)**
- **[Git worktree 教學](https://myapollo.com.tw/blog/git-worktree/)**