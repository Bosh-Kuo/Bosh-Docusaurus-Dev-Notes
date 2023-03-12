---
title: "第一階段結尾篇:從管理到發布，如何規劃與管理一篇文章？"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(12)] - 第一階段結尾篇:從管理到發布，如何規劃與管理一篇文章？"
description: Hexo 專案從管理到發布，如何規劃與管理一篇文章？
last_update:
  date: 2022-02-01
keywords:
  - Hexo
tags:
  - Hexo
---

## **寫文章，從做筆記開始！**

### **先做筆記，再寫文章**
> 想學好一個新技術或知識，你一定得做筆記，但你不一定要發文章

<!-- more -->

其實在寫`從零開始使用Hexo + Github Page搭建個人技術筆記網站`這個系列文時，我就清楚的感受到對我個人而言做筆記跟寫文章的完全是兩回事。對我來說做筆記是吸收知識的過程，而寫文章則是輸出知識的過程。在學新東西的時候通常會快速且廣泛的搜尋以及閱讀很多資料，並且簡單地記下最重點的地方以及留下幾篇重要文章的網址，只要方便自己日後能迅速複習即可。但寫文章時會希望內容通俗易懂，文章結構分明有條理，因此會花很多時間在用字遣詞、搜集資料等。由於這個系列文當初就是抱著一邊學著架部落格一邊寫部落格系列文的想法開始寫的，我能感受到以寫出一片文章為目的來學習雖然會迫使自己更深入地去查資料瞭解技術，但卻大大地拖延了學會一樣東西時間。且在知識背景不足的情況下，常常只能透過截取其他人的文章片段再換句話說的方式來寫文章，寫出來的文章看起來比較像是經過仔細整理的筆記但卻缺乏自己的見解。

在這邊想提醒未來回來看這篇文的自己，如果你想快速地學習一個新的知識，不要以我要發表一篇文章來展現我的知識這個出發點來做筆記，這會浪費你的時間，你應該用最簡單的方式記錄下學習的重點，在最短的時間內學會這個新知，接著動手實作並且將重點記錄在筆記中。當你對該主題已經有一定程度的見解，也已經累積了一定的筆記量或相關資料，再把他們整理成通俗易懂的文章。


<br/>



## **如何系統性的管理自架部落格與文章？**

關於如何備份hexo專案與設定文件已經在[`從零開始使用Hexo + Github Page搭建個人技術筆記網站(11) - 用Git&Github備份hexo專案`](https://bosh-kuo.github.io/Bosh-Hexo-Blog/hexo-from-scratch-11/)提到了，這邊來說說我如何管理我自己的文章。

### **超強筆記軟體：Notion**

Notion是我目前最愛用的筆記軟體，自從漸漸脫離紙筆考試後我就比較少用ipad手寫筆記了，並開始愛上這款筆記軟體，當我的學習與工作全都離不開電腦時就會發現，不一定要寫一堆重點才叫筆記，就算只是把重要的文章分類歸檔存起來也可以是筆記，只要能在日後幫我省下時間，任何形式的內容都可以叫做筆記，而Notion在歸檔資源的歸檔真的很方便（比瀏覽器書籤方便大概100倍吧）。

Notion除了可以用來寫一般的筆記之外，還可以用它來保存我寫過的文章，得益於Notion是`Markdown-based` 編輯器因此我在使用`hexo new`開啟一個.md檔來編寫文章前我會先在Notion裡面寫好，再將整份直接複製貼上到.md檔，若文章裡有圖片則會將圖片先上傳到[`Imgur`](https://imgur.com/)，再透過圖片網址連結進文章中，最後再修飾就完成了，這麼一來同樣是寫一篇文章，我多備份了一份在Notion裡，萬一hexo Blog真的出最壞的差錯我挽救不來，至少我的文章都在Notion裡面備份了一份，也算是多一道保障。另一個優點是如果對markdown語法不太熟悉，Notion裡面都有相應的提示可以直接點擊使用，比起直接寫markdown好讀好寫得多。

<br/>

## **我的文章發布逐步詳細全記錄：一探文章生命週期**

### **Notion: Blog DataBase**

我會用Notion DataBase來管理我的文章，一方面我可以很清楚知道我發過什麼類型的文章，發布日與更新日也一目瞭然，當我當我要寫一篇新文章的時候我就能快速參考過去的文章。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673861910/Hexo%20Blog/2022-02-01-hexo-from-scratch-12/notion1_kjpmex.png)



### **Notion: 編輯文章**

雖然前面一直說發文從筆記開始，但恰巧這篇文不太算是技術筆記，所以就直接進入編寫文章的部分，以本篇為例，我的一篇Blog文章在Notion裡面大概都是長得像這樣子：

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673861910/Hexo%20Blog/2022-02-01-hexo-from-scratch-12/notion2_gnwfal.png)



### **Hexo: 編輯文章.md檔**

用hexo新增一篇文章的指令是：

```markdown
hexo new [layout] <title>
```

**title** 就是網址上會呈現的字，這篇我會下 `hexo new hexo-from-scratch-12` 這個指令。

接著更改.md檔中預設的title(同剛剛指令中的 title)，以及tag, categoriy。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673861910/Hexo%20Blog/2022-02-01-hexo-from-scratch-12/post_tgwrkf.png)

### **Hexo: 預覽並發布**

- 在本地端檢查文章

```shell
hexo server
```

- 清除靜態檔案與快取

```shell
hexo clean
```

- 產生靜態網頁檔案

```shell
hexo generate
```

- 修改_config.yml文件deploy commit文字
- 部署至 Github Pages

```shell
hexo deploy
```

### **Github備份**

- git add and commit

```shell
git add .
git commit -m ""
```

- git推送至github備份

```shell
git push origin master
```

<br/>

## **Hexo系列文結尾心得**

到目前為止我記錄了一些我的Hexo Blog的一些筆記，剛好很適合拿來發文章於是就邊寫邊發了，短期內應該會以當前模式嘗試多發一些文章，再看看需不需要進一步客製化 hexo，所以我的 Hexo 系列文就在這邊告一段落了，日後如果有換佈景主題或做其他客製化會再補上筆記～

其實在這篇的時候滿有成就感的，由於這是我第一次架 Blog，第一次寫文章，所以前面的幾篇筆記其實還真的是筆記成分居多，主要是參考其他文章再將內容稍做修改而成，整篇系列文大概只有這篇是不需要 reference 的吧哈哈，而且最酷的是這篇文在寫一些指令的時候我就是翻著我的Blog文章找我要的指令的，自己過去的筆記成為了自己的網路資源這種感覺真的滿有成就感的 XD