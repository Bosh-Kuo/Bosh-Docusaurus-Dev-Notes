---
title: "以 Git & Github 管理 hexo 專案"
sidebar_label: "[基本系列] - 以 Git & Github 管理 hexo 專案"
description: 以 Git & Github 管理 hexo 專案
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - Git
  - Github
tags:
  - Hexo
---

## **備份hexo設定與文章**

到目前為止我們做了一系列的操作客製化hexo部落格，但有沒有想過，有沒有可能真的這麼衰，好不容易完成了hexo的一系列設定，照著各種教學文章安裝了一堆套件，在看起來莫名其妙的檔案中加了那麼幾句我自己也看不懂的程式碼後，終於開開心心的發了幾篇文章後結果電腦莫名其妙掛了資料全不見了？如果沒有備份習慣，當發生這種事情的時候還真的只能乾瞪著眼看著那曾經美好的Blog，偷流幾滴淚把repo從github上刪掉後再重來一次。(可能有其他補救辦法啦但我的話會乾脆再重頭來XD)

<!-- more -->

因此當決定自用hexo搭建部落格時，備份就成為了必學的功課，我們可以土法煉鋼每次改完設定後都把專案檔copy到一顆硬碟或雲端空間，但這麼做久了其實滿麻煩，而且還需要花錢購買備份空間，而且也得承擔備份空間會不會哪天也一起壞掉的風險，這時候`Git & Github`就顯的非常高效好用了，我們可以在自己的電腦上的專案資料夾新增一個git專案，接下來再連接自己的github repo，就可以在每次更新完hexo專案檔案、更換主題、發新文章後就把當前的專案文件push到github上，這樣就可以保證就算即使自己的電腦壞掉檔案損壞我的Hexo設定檔與文章都還在自己的Github上(ＧGithub掛掉機率應該比自己的硬碟掛掉機率小很多吧)。甚至哪天我突然想換別台電腦來寫文章，我也可以直接clone我的專案repo到另一台電腦，再用`npm install`把套件裝回來就可以直接開始寫文章了。

所以這篇文章就是要示範如何將hexo專案push到github作為遠端備份。




### **建立本地端Git儲存庫**

```shell
cd Blog  # 我的hexo專案根目錄

git init  # 建立本地端Git儲存庫

git status  # 看一下檔案追蹤狀況 
```

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673835247/Hexo%20Blog/2022-01-24-hexo-from-scratch-11/git_mpdeaj.png)



### **確認.gitignore**

確認資料夾裡有`.gitignore`這個檔案並且檔案內容如下，定義不推送的資料（可自訂）

```plain text
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```



### **在本地端commit**

`git`的`commit`指令有點像是為當前的儲存庫拍一張快照，紀錄當下的版本，在連結遠端github repo並推送之前必須先在本地端commit

```shell
git add .
```

`這時候我遇到了一個問題`

```shell
warning: adding embedded git repository: themes/next
hint: You’ve added another git repository inside your current repository.
hint: Clones of the outer repository will not contain the contents of
hint: the embedded repository and will not know how to obtain it.
hint: If you meant to add a submodule, use:
hint:
hint: git submodule add themes/next
hint:
hint: If you added this path by mistake, you can remove it from the
hint: index with:
hint:
hint: git rm --cached themes/next
hint:
hint: See “git help submodule” for more information.
```

查了一下原因是我在Blog（專案根目錄）`git init`初始化本地儲存庫時，裡面的某個資料夾也含有 .git 文件 → `就是themes資料夾底下next資料夾`，這因為next是從外部clone進來的，所以會發生這個問題。我的解決方法是將next資料夾中原本的.git資料夾刪掉然後重新回Blog資料夾add，把next資料夾中的檔案重新作為子資料夾加入追蹤。

接下來更新此Git除存庫的版本也就是上面比喻的『拍一張快照』

```shell
git commit -m "first commit"
```



### **連結github遠端repo**

我們可以專門創一個repo給hexo專案，但因為我們已經在搭建的過程中就有創一個用來架設Github Page的repo，所以這裡直接用這個repo來連結本地端的git儲存庫就好。

```shell
# 以我的repo網址為例https://github.com/Bosh-Kuo/Bosh-Hexo-Blog.git
git remote add origin https://github.com/Bosh-Kuo/Bosh-Hexo-Blog.git
```

### **push到github上的master分支**

由於這個github repo已經存在gh-pages這個分支了，所以我們要推送到github的別的分支，這邊我們推到遠端的master分支，推送指令送出就會在遠端自動創建master分支。

```shell
git push -u origin master
```

<br/>

如此一來遠端就有電腦上hexo專案檔案的備份了！

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673835247/Hexo%20Blog/2022-01-24-hexo-from-scratch-11/github_pz2by5.png)



### **檢視遠端分支**

現在我的遠端github上有兩個分支了，之後在推送時得小心不要不小心推到gh-pages這個分支，如果我們想知道遠端的更多資訊可以用`git remote show [remote-name]` 命令

```shell
git remote show origin
```

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673835247/Hexo%20Blog/2022-01-24-hexo-from-scratch-11/git_remote_pfswwz.png)

從圖片中可以看到`Head branch`現在指的是`gh-pages`這個分支，所以如果我只輸入`git push`還真的會不小心推到gh-pages這個分支，因此之後推送時應該要輸入完整指令`git push [remote-name] [branch-name]`

```shell
git push origin master
```


<br/>


## **Reference**

- **[30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)**
- **[2.5 Git 基礎 - 與遠端協同工作](https://git-scm.com/book/zh-tw/v2/Git-%E5%9F%BA%E7%A4%8E-%E8%88%87%E9%81%A0%E7%AB%AF%E5%8D%94%E5%90%8C%E5%B7%A5%E4%BD%9C)**