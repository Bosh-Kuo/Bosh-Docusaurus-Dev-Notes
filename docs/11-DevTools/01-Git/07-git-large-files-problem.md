---
title: 不小心 git commit 到太大的檔案，推不上遠端該怎麼辦？
sidebar_label: "[Git] 不小心 git commit 到太大的檔案怎麼辦？"
description: 在使用 Git 進行版本控制時，偶爾會不小心提交過大的文件，導致無法推送到遠端倉庫。這篇文章將詳細介紹如何處理這種情況，包括如何刪除歷史記錄中的大文件，以及如何重寫提交歷史以成功推送到遠端。
last_update:
  date: 2024-07-13
keywords:
  - 開發工具
  - Git
  - GitLab  
tags:
  - 開發工具
  - Git  
---
 

> **前情提要**  
> 最近在公司遇到了一個有趣的 git 操作問題，決定做個筆記記錄一下~
>

## **問題**

這陣子我在公司趁著沒有任務的空閒時間幫忙研究一些新技術和工具，希望未來能導入團隊以改善團隊開發體驗與效率。我在本地端建立了一個 POC 專案，一邊研究一邊驗證新工具是否符合我們團隊平常的開發習慣與需求。當我研究得差不多也完成了驗證用的 POC 專案後，我在將程式碼推送到公司 Gitlab 的環節遇到了以下這個錯誤：

```bash {3-12}
git push -u origin main

Enumerating objects: 277, done.
Counting objects: 100% (277/277), done.
Delta compression using up to 8 threads
Compressing objects: 100% (253/253), done.
error: RPC failed; HTTP 413 curl 22 The requested URL returned error: 413
send-pack: unexpected disconnect while reading sideband packet
Writing objects: 100% (277/277), 1.68 MiB | 5.04 MiB/s, done.
Total 277 (delta 98), reused 0 (delta 0), pack-reused 0
fatal: the remote end hung up unexpectedly
Everything up-to-date
```

這個錯誤 (`HTTP 413`) 表示我嘗試推送的資料量超過了遠端伺服器允許的最大限制。當時我覺得很奇怪，我的專案內應該沒有大小過大的檔案才對呀？

於是我用以下指令分批推送 commit 到 gitlab，嘗試找出是哪一次的 commit 推不上去。

```bash
git push origin <commit_hash>:refs/heads/main
```

果然到了某個 commit 便出現了開頭顯示的錯誤。仔細一看，發現原來是因為我在專案中曾一度使用 `yarn policies set-version 1.19.0` 這個指令在本地端下載了 v1.19.0 的 yarn 並且指定為專案使用的 yarn 版本。而我當時沒注意到的是，原來 .yarn-1.19.0.cjs 一個檔案的大小就達 4.9Mb，難怪會推不上 Gitlab @@

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1720860149/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/%E4%B8%8D%E5%B0%8F%E5%BF%83%20git%20commit%20%E5%88%B0%E5%A4%AA%E5%A4%A7%E7%9A%84%E6%AA%94%E6%A1%88/git_%E8%A8%98%E9%8C%84_yp87f9.png)

麻煩的是，即便我後來移除了 .yarn-1.19.0.cjs 這個檔案，並提交了刪除檔案的 commit，git 仍然會將這個文件保留在提交歷史中，因此 push 時還是會碰到上傳檔案大小過大的問題。


<br/>


## **解決方法**

我將這個問題拿來問 ChatGPT 4o，他給了我幾種解決方法，方法一與方法二都屬於直接讓 Git 處理大型檔案的解法。但由於我比較希望直接將大型檔案從 git 的紀錄中移除，因此我選擇使用方案三 git rebase 的方式。

### **方法一：增加 HTTP Buffer Size (未採用)**

手動增加 Git 的 HTTP buffer 大小，將 `http.postBuffer` 設定為 500 MB。

```bash
git config http.postBuffer 524288000
```

### **方法二：Git LFS (未採用)**

使用 **Git LFS（Large File Storage）** 用二進位的方式處理特定的大型檔案

- **安裝 Git LFS**：
    
    ```bash
    git lfs install
    ```
    
- **跟蹤大型文件**：
    
    ```bash
    git lfs track "*.psd"  # 取代為你要跟蹤的文件類型
    ```
    
- **提交變更**：
    
    ```bash
    git add .gitattributes
    git add path/to/large/file
    git commit -m "Track large files with LFS"
    ```

### **方法三：使用 rebase 互動模式刪除指定 commit**

1. **備份分支**
    
    在開始之前，建議建立當前分支的備份，以防出現問題：
    
    ```bash
    git branch backup-main
    ```
    
2. **使用 git rebase -i 刪除指定 commit**
    
    首先，先啟動互動式 rebase，其中 `<commit_hash>` 是我們要刪除的 commit 的雜湊值
    
    ```bash
    git rebase -i <commit_hash>^
    ```
    
    接著，找到並標記需要編輯的提交（包括大文件提交和後續刪除該文件的提交）。例如：

    ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1720860148/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/%E4%B8%8D%E5%B0%8F%E5%BF%83%20git%20commit%20%E5%88%B0%E5%A4%AA%E5%A4%A7%E7%9A%84%E6%AA%94%E6%A1%88/git_rebase_se4fxm.png)

    點擊 Start Rebase 後Git 會應用 rebase 並暫停在第一個 `edit` 標記的提交，以上圖這個為例，git 會停在 `3c51d30e` 這個提交進度上。

3. **修改提交以刪除大文件** 
    
    當 Git 暫停在第一個 `edit` 標記的提交時，使用以下命令來移除大文件：
    
    ```bash
    git rm --cached path/to/largefile
    ```
    
    更新提交以反映大文件的刪除：
    
    ```bash
    git commit --amend --no-edit
    ```
    
    繼續 rebase 過程：
    
    ```bash
    git rebase --continue
    ```
    
    當 Git 暫停在刪除大文件的提交時，再次執行 rebase 過程：
    
    ```bash
    git rebase --continue
    ```
    
    如此便完成了 rebase。可以看到原本被卡住的 commit 紀錄中已經不包含 .yarn-1.19.0.cjs 這個檔案了。需要注意的是，由於 git rebase 調整了 git 的提交歷史，因此從本次 rebase 第一個編輯的 commit 開始（原本為`3c51d30e`） ，後面的每個提交 commit hash 都會與原本的不相同。

    ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1720860149/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/%E4%B8%8D%E5%B0%8F%E5%BF%83%20git%20commit%20%E5%88%B0%E5%A4%AA%E5%A4%A7%E7%9A%84%E6%AA%94%E6%A1%88/rebase_%E5%BE%8C%E7%9A%84_git_%E8%A8%98%E9%8C%84_ygykwg.png)

4. **推送到遠端倉庫**
    
    由於我透過 git rebase 修改的 commit 記錄本來就沒有成功被推到遠端 gitlab 上，因此不需要使用 `--force` 強制模式便可以直接推送：
    
    ```bash
    git push origin main 
    ```


<br/>


## **Reference**

- [**Git LFS 原理、大小檔案都適用**](https://haway.30cm.gg/git-lfs/)
- [**不小心误commit超大文件到git，怎么办？**](https://xmanyou.com/how-to-revert-commit-with-large-file/)