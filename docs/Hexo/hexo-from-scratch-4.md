---
title: "寫下第一篇部落格文章"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(4)] - 寫下第一篇部落格文章"
sidebar_position: 3
description: 寫下第一篇部落格文章
last_update:
  date: 2022-01-23
keywords:
  - Hexo
  - NexT
tags:
  - Hexo
---

## **來寫第一篇部落格文章吧！**

接下來使用hexo指令來創建這個部落格的第一篇文章!

<!-- more -->



### **創建新文章或草稿.md檔**

```shell
cd 專案目錄

hexo new "<文章名稱>"
# hexo new draft "文章名稱" 用來建立草稿 .md 檔

```

輸入指令後`source/_posts`中會自動新增一個md檔，指令中輸入的文章名稱則是用於網站中該篇文章的網址。若是建立草稿（文章與頁面都可以），建立的 .md 檔會放置在 `./source/_drafts` 內，存放在 `_drafts` 目錄內的檔案不會被建立成文章或是頁面，因此如果想先建立檔案但不一定要先發佈，可以先建立成草稿，等到要發佈時，再移動到 `_post` 目錄內或是獨立建成一個頁面。



### **設定文章資訊**

```markdown
---
title: first-test-article
date: 2022-01-20 16:58:52
tags:
- [test]
category:
- [test]
---
```

創建好文章後一開始會是一個空白頁面，以及預設的post layout (不會顯示於內文)，`title`為在網頁中的文章標題，`date`為文章創建日期，文章資訊可以日後再進行修改，tags與categoty與接下面提到標籤頁面與分類頁面有關。



### **分類與標籤**

tags 欄與 category 欄就是標籤頁與分類頁對應的標籤與分類，而 category 又有兩種不同寫法會影響文章的分類方式。

```markdown
---
title: first-test-article
date: 2022-01-20 16:58:52
tags:
- [標籤1]
- [標籤2]
category:
- [分類1]
- [分類2]
---
```

```markdown
---
title: first-test-article
date: 2022-01-20 16:58:52
tags:
- 標籤1
- 標籤2
category:
- 分類1
- 分類2
---
```

第一種寫法:分類1, 分類2為獨立的兩個分類，標籤1, 標籤2為獨立的兩個標籤。

第二種寫法:分類2為分類1底下的子分類，而標籤1, 標籤2依舊為獨立的兩個標籤。



### **Markdown語法編輯內文**

hexo 的文章是以 markdown 語法格式來編寫的，我自己是習慣用 Notion 或 VScode 來寫，至於要在文章中插入的圖片我選擇將圖片先丟到  [Cloudinary](https://cloudinary.com/) 圖床，再用連結導入文章當中。一方面方便管理部落格的圖片，另一方面因為 Github Page有容量限制，如果直接在專案資料夾引入很快就沒空間了。本來我是用 [Imgur](https://imgur.com/) 作為我的圖床，但由於 [Imgur](https://imgur.com/) 其實不鼓勵使用者將其作為圖床，且每半年未被瀏覽的圖片會被自動刪除，因此把部落格的圖片放在 [Imgur](https://imgur.com/) 其實有丟失的風險。

在編輯文章內容時可同時用`hexo server`在本地端預覽文章在網站上的樣子來做排版。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673801701/Hexo%20Blog/2022-01-23-hexo-from-scratch-4/markdown_m9lhcu.png)



### **隱藏過長的文章內容**

打完一篇文章發布後發現首頁完全被這片文章給佔據了，要如何讓文章只在首頁顯示部分內容，讓讀者想閱讀全文再點擊進入該文章呢？

只要在想要開始隱藏的內文上頭加上`<!-- more -->`，首頁就會出現閱讀全文按鈕並隱藏內文。

```markdown
# 會顯示出來的部分
<!-- more -->
# 會隱藏起來的部分
```

<br/>

## **Reference**

- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)