---
title: Git 操作大集合：常用指令 CheatSheet 總整理
sidebar_label: "[Git] Git 常用指令大集合"
description: 本篇文章記錄 Git 常用指令
last_update:
  date: 2023-04-28
keywords:
  - 開發工具
  - Git
tags:
  - 開發工具
  - Git
---

## **常用 Git 指令**
| 指令                            | 功能                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `git init`                      | 初始化 Git 儲存庫                                          |
| [`git add`](#git-add)           | 將檔案加入 Git 的暫存區                                    |
| [`git commit`](#git-commit)     | 提交檔案到 Git 儲存庫                                      |
| [`git pull`](#git-pull)         | 從遠端儲存庫下載最新的資訊並合併到本地端                   |
| [`git push`](#git-push)         | 將本地端的提交推送到遠端儲存庫                             |
| [`git clone`](#git-clone)       | 複製遠端儲存庫到本地端                                     |
| [`git status`](#git-status)     | 檢視目前 Git 儲存庫的狀態                                  |
| [`git diff`](#git-diff)         | 比較檔案與 Git 儲存庫之間的差異                            |
| [`git log`](#git-log)           | 檢視 Git 儲存庫的歷史記錄                                  |
| [`git branch`](#git-branch)     | 列出、建立或切換分支                                       |
| [`git checkout`](#git-checkout) | 切換到指定的分支或提交                                     |
| [`git merge`](#git-merge)       | 合併分支或提交                                             |
| [`git rebase`](#git-rebase)     | 將一個分支的修改應用到另一個分支上，以獲得更線性的提交歷史 |
| [`git reset`](#git-reset)       | 回復到指定的提交或狀態                                     |
| [`git revert`](#git-revert)     | 建立一個反向提交，撤銷之前的提交                           |
| [`git stash`](#git-stash)       | 將當前的修改藏起來，以便稍後套用                           |
| [`git fetch`](#git-fetch)       | 從遠端儲存庫下載最新的資訊                                 |
| [`git remote`](#git-remote)     | 管理遠端儲存庫                                             |
| [`git config`](#git-config)     | 設定 Git 的環境變數                                        |



## **git add** {#git-add}
<details>
    <summary>Toggle me!</summary>

| 指令                  | 功能                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| `git add .`           | 將所有修改過的檔案和新增的檔案加入暫存區，不包括已經被刪除的檔案。   |
| `git add <file>`      | 將指定的檔案加入暫存區。例如：git add index.html。                   |
| `git add <directory>` | 將指定的目錄加入暫存區。例如：git add images/。                      |
| `git add -u`          | 將所有修改過的檔案和已經被刪除的檔案加入暫存區，但不包括新增的檔案。 |
</details>


## **git commit** {#git-commit}
<details>
    <summary>Toggle me!</summary>

| 指令                                      | 功能                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `git commit -m "<message>"`               | 將暫存區中的所有修改過的檔案和新增的檔案提交到 Git 儲存庫中，並加上提交訊息。例如：git commit -m "新增首頁"。                  |
| `git commit -a -m "<message>"`            | 將所有修改過的檔案、新增的檔案和已經被刪除的檔案提交到 Git 儲存庫中，並加上提交訊息。例如：git commit -a -m "更新 README.md"。 |
| `git commit --amend`                      | 將最後一個提交的訊息修改為新的提交訊息，並且將當前的暫存併入最後一次的 Commit。例如：git commit --amend -m "修改提交訊息"。    |
| `git commit --allow-empty -m "<message>"` | 建立一個空的提交訊息，這個指令可以用於建立沒有任何檔案修改的提交，例如：git commit --allow-empty -m "初始化專案"。             |
</details>


## **git pull** {#git-pull}
<details>
    <summary>Toggle me!</summary>

| 指令                                     | 功能                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git pull`                               | 從遠端儲存庫中取回最新的版本並合併到當前分支                                                                                                      |
| `git pull --rebase`                      | 等同於 git fetch + git rebase 當遠端有新 commit 尚未同步到本地，從遠端儲存庫中取回最新的版本，並以 rebase 取代預設的 merge 合併，避免產生合併提交 |
| `git pull <remote> <branch>`             | 從指定的遠端儲存庫和分支中取回最新的版本並合併到當前分支                                                                                          |
| `git pull --no-commit <remote> <branch>` | 從指定的遠端儲存庫和分支中取回最新的版本並合併到當前分支，但不會自動產生一個新的提交                                                              |
| `git pull --rebase <remote> <branch>`    | 從指定的遠端儲存庫和分支中取回最新的版本，並以 rebase 取代預設的 merge 合併，避免產生合併提交                                                     |
</details>


## **git push** {#git-push} 
<details>
    <summary>Toggle me!</summary>

| 指令                                        | 功能                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| `git push`                                  | 將本地分支的提交推送到遠端分支                                                   |
| `git push <remote>`                         | 將當前本地分支的提交推送到指定的遠端分支                                         |
| `git push <remote> <branch>`                | 將指定的本地分支的提交推送到指定的遠端分支                                       |
| `git push --force`                          | 強制推送本地分支的提交到遠端分支                                                 |
| `git push --tags`                           | 推送本地所有標籤到遠端分支                                                       |
| `git push --set-upstream <remote> <branch>` | 將本地分支的提交推送到指定的遠端分支，並且設置遠端分支為本地分支的遠端上游分支。 |
</details>


## **git clone** {#git-clone} 
<details>
    <summary>Toggle me!</summary>

| 指令                                          | 功能                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `git clone <repository>`                      | 從遠端複製一個 Git 儲存庫到本地端                                           |
| `git clone <repository> <directory>`          | 從遠端複製一個 Git 儲存庫到本地端指定的資料夾                               |
| `git clone --branch <branch> <repository>`    | 從遠端複製指定分支的 Git 儲存庫到本地端                                     |
| `git clone --depth <depth> <repository>`      | 從遠端複製指定深度的 Git 儲存庫到本地端（僅複製部分歷史記錄）               |
| `git clone --recursive <repository>`          | 從遠端複製一個 Git 儲存庫到本地端，並遞迴複製其所有子模組                   |
| `git clone --recurse-submodules <repository>` | 從遠端複製一個 Git 儲存庫到本地端，並遞迴複製其所有子模組（同 --recursive） |
</details>


## **git status** {#git-status} 
<details>
    <summary>Toggle me!</summary>

| 指令            | 功能                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `git status`    | 顯示當前工作目錄和暫存區的狀態，包括哪些檔案已修改、哪些檔案已經被加入暫存區，以及哪些檔案還沒有被追蹤。             |
| `git status -s` | 以簡潔的方式顯示當前工作目錄和暫存區的狀態，包括哪些檔案已修改、哪些檔案已經被加入暫存區，以及哪些檔案還沒有被追蹤。 |
</details>


## **git diff** {#git-diff} 
<details>
    <summary>Toggle me!</summary>

| 指令                            | 功能                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `git diff`                      | 比較當前工作目錄中的檔案和暫存區中的檔案之間的差異。                                     |
| `git diff <commit>`             | 比較當前工作目錄中的檔案和指定版本的檔案之間的差異。例如：git diff HEAD~1。              |
| `git diff <commit> <file>`      | 比較當前工作目錄中的檔案和指定版本中的檔案之間的差異。例如：git diff HEAD~1 index.html。 |
| `git diff --staged`             | 比較暫存區中的檔案和上一次提交的檔案之間的差異。                                         |
| `git diff <commit1>..<commit2>` | 比較指定兩個版本之間的差異。例如：git diff HEAD~3..HEAD~1。                              |
</details>


## **git log** {#git-log} 
<details>
    <summary>Toggle me!</summary>

| 指令                      | 功能                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `git log`                 | 顯示所有提交記錄，按時間順序列出每次提交的作者、日期、提交訊息和 SHA-1 校驗和。     |
| `git log --oneline`       | 以簡潔的方式顯示提交記錄，每個提交記錄只顯示一行，包括 SHA-1 校驗和和提交訊息。     |
| `git log --graph`         | 以圖形化的方式顯示提交記錄，可以清晰地顯示分支和合併操作。                          |
| `git log --author=<name>` | 只顯示指定作者的提交記錄。例如：git log --author=john。                             |
| `git log --after=<date>`  | 只顯示指定日期之後的提交記錄。例如：git log --after="2019-01-01"。                  |
| `git log <file>`          | 只顯示指定檔案的提交記錄，以及該檔案每次提交的作者、日期、提交訊息和 SHA-1 校驗和。 |
</details>


## **git branch** {#git-branch} 
<details>
    <summary>Toggle me!</summary>

| 指令                                                | 功能                                                            |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `git branch`                                        | 列出所有分支，並標註當前所在的分支。                            |
| `git branch <branch name>`                          | 創建一個新的分支。例如：git branch feature-branch。             |
| `git branch -d <branch name>`                       | 刪除指定的分支。例如：git branch -d feature-branch。            |
| `git branch -m <old branch name> <new branch name>` | 將指定的分支重命名。例如：git branch -m old-branch new-branch。 |
| `git branch -r`                                     | 列出所有遠端分支。                                              |
| `git branch -a`                                     | 列出所有本地和遠端的分支。                                      |
</details>


## **git checkout** {#git-checkout} 
<details>
    <summary>Toggle me!</summary>

| 指令                                   | 功能                                                                                                                  |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `git checkout <branch name>`           | 切換到指定的分支。例如：git checkout feature-branch。                                                                 |
| `git checkout -b <new branch name>`    | 創建一個新的分支並切換到新分支。例如：git checkout -b feature-branch。                                                |
| `git checkout <commit>`                | 切換到指定的提交。例如：git checkout 1234567。                                                                        |
| `git checkout -- <file>`               | 取消對指定檔案的更改，還原到最近一次提交的狀態。例如：git checkout -- index.html。                                    |
| `git checkout <branch name> -- <file>` | 將指定分支中的檔案覆蓋當前分支中的檔案，還原檔案到指定分支中的狀態。例如：git checkout feature-branch -- index.html。 |
</details>


## **git merge** {#git-merge} 
<details>
    <summary>Toggle me!</summary>

| 指令                               | 功能                                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `git merge <branch name>`          | 將指定分支合併到當前分支中。例如：git merge feature-branch。                                                          |
| `git merge --no-ff <branch name>`  | 禁用快進合併，使用普通的合併方式。例如：git merge --no-ff feature-branch。                                            |
| `git merge --abort`                | 取消當前的合併操作，恢復到合併前的狀態。例如：git merge --abort。                                                     |
| `git merge --continue`             | 當合併遇到衝突時，手動解決衝突後，使用該指令繼續合併操作。例如：git merge --continue。                                |
| `git merge --squash <branch name>` | 合併指定分支的提交，但不產生一個新的合併提交，而是將所有提交壓縮成一個提交。例如：git merge --squash feature-branch。 |
</details>


## **git rebase** {#git-rebase} 
<details>
    <summary>Toggle me!</summary>

| 指令                     | 功能                                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| `git rebase <branch>`    | 將目前所在分支的變更，重新以 `<branch>` 為基礎進行變基                      |
| `git rebase -i <commit>` | 以交互模式進行變基，可以修改 commit 訊息、squash commit、丟棄 commit 等操作 |
| `git rebase --abort`     | 放棄目前正在進行的變基操作，恢復為變基前的狀態                              |
| `git rebase --continue`  | 當變基發生衝突時，修正完異常後，使用此指令繼續執行變基                      |
| `git rebase --skip`      | 當變基發生衝突時，若確定跳過該 commit，可使用此指令                         |
</details>


## **git reset** {#git-reset} 
<details>
    <summary>Toggle me!</summary>

| 指令                        | 功能                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `git reset <commit>`        | 將當前分支的 HEAD 移到指定的 commit 上，並且這些更改會出現在工作目錄中，但不會自動被加到暫存區             |
| `git reset --hard <commit>` | 將當前分支的 HEAD 移到指定的 commit 上，並刪除工作目錄和暫存區中的更改                                     |
| `git reset --soft <commit>` | 將當前分支的 HEAD 移到指定的 commit 上，但不會修改工作目錄或暫存區，這些更改會出現在未提交的更改暫存區中。 |
</details>


## **git revert** {#git-revert} 
<details>
    <summary>Toggle me!</summary>

| 指令                              | 說明                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `git revert <commit>`             | 撤銷指定 commit 的修改，會新建一個 commit，並將撤銷後的修改記錄在這個 commit 中。               |
| `git revert <commit1>..<commit2>` | 撤銷從 commit1 到 commit2 之間的修改，會新建一個 commit，並將撤銷後的修改記錄在這個 commit 中。 |
| `git revert HEAD`                 | 撤銷最後一次 commit 的修改，會新建一個 commit，並將撤銷後的修改記錄在這個 commit 中。           |
| `git revert --no-commit <commit>` | 撤銷指定 commit 的修改，但不建立新的 commit                                                     |
| `git revert --abort`              | 取消當前正在進行的 revert 操作                                                                  |
</details>


## **git stash** {#git-stash} 
<details>
    <summary>Toggle me!</summary>

| 指令                       | 解釋                                                                       |
| -------------------------- | -------------------------------------------------------------------------- |
| `git stash`                | 儲存當前工作目錄的變更，並清空當前工作目錄，使其回到最近一次 commit 的狀態 |
| `git stash save <message>` | 儲存當前工作目錄的變更，同時可在 commit message 中加入描述訊息 `<message>` |
| `git stash list`           | 列出所有已儲存的 stash                                                     |
| `git stash show <stash>`   | 顯示指定 stash 的詳細內容                                                  |
| `git stash apply <stash>`  | 將指定 stash 的變更應用到目前的工作目錄，但不會刪除 stash                  |
| `git stash pop <stash>`    | 將指定 stash 的變更應用到目前的工作目錄，並刪除 stash                      |
| `git stash drop <stash>`   | 刪除指定的 stash                                                           |
| `git stash clear`          | 刪除所有 stash                                                             |
</details>


## **git fetch** {#git-fetch} 
<details>
    <summary>Toggle me!</summary>

| 指令                          | 說明                                                                 |
| ----------------------------- | -------------------------------------------------------------------- |
| `git fetch <remote>`          | 從指定遠端倉庫下載最新的提交歷史，但不會自動合併到本地分支。         |
| `git fetch <remote> <branch>` | 從指定遠端倉庫下載指定分支的最新提交歷史，但不會自動合併到本地分支。 |
| `git fetch --all`             | 從所有遠端倉庫下載最新的提交歷史。                                   |
| `git fetch --prune`           | 在從遠端倉庫下載最新提交歷史時，同時刪除本地不存在的遠端分支的引用。 |
</details>


## **git remote** {#git-remote} 
<details>
    <summary>Toggle me!</summary>

| 指令                                  | 說明                               |
| ------------------------------------- | ---------------------------------- |
| `git remote`                          | 列出遠端儲存庫                     |
| `git remote add <name> <url>`         | 新增一個遠端儲存庫                 |
| `git remote remove <name>`            | 移除指定的遠端儲存庫               |
| `git remote rename <old> <new>`       | 更改指定遠端儲存庫的名稱           |
| `git remote set-url <name> <new url>` | 更改指定遠端儲存庫的 URL           |
| `git remote -v`                       | 顯示遠端儲存庫的詳細資訊，包括 URL |
</details>


## **git config** {#git-config} 
<details>
    <summary>Toggle me!</summary>

| 指令                                                      | 說明                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `git config --global user.name "Your Name"`               | 設定使用者名稱，--global 表示全域設定，即所有 Git 專案都會套用這個名稱          |
| `git config --global user.email "your_email@example.com"` | 設定使用者電子郵件，--global 表示全域設定，即所有 Git 專案都會套`用這個電子郵件 |
| `git config --global core.editor "vim"`                   | 設定 Git 編輯器，預設是使用系統預設的編輯器，可以使用這個指令修改為其他編輯器   |
| `git config --global color.ui true`                       | 設定 Git 顯示彩色文字                                                           |
| `git config --global alias.co checkout`                   | 設定 Git 別名，這個指令設定了 co 別名，等同於 checkout 指令                     |
</details>



