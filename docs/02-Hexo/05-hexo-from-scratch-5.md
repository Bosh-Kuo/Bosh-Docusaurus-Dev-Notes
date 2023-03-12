---
title: "標籤、分類與關於頁面"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(5)] - 標籤、分類與關於頁面"
description: 標籤、分類與關於頁面
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - tags
  - category
  - page
tags:
  - Hexo
---

## **幫部落格添加標籤、分類與關於頁面！**

### **建立新自訂頁面**

```shell
hexo new page "頁面名稱"
```
<!-- more -->

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673801933/Hexo%20Blog/2022-01-24-hexo-from-scratch-5/new_page_dvi8zn.png)

hexo會自動在source資料夾建立一個跟該新建頁面名稱相同的資料夾，裡面放著一個index.md檔用來編寫頁面內容。若是原本存為草稿的md檔編輯好要發布成頁面，就以同個道理在source創建一個該頁面名稱的資料夾，並將草稿從草稿資料夾移到該資料夾並將檔案改命名為index.md。



### **頁面資訊**

```shell
---
title: about
date: 2022-01-20 20:16:29
comments: false  # 設定為 false 表示不開放留言
---
```

有些頁面的目的為專門提供資訊或指引，沒有互動的需求，因此可以設定使該頁面不開放留言，當然現在還沒有打算加入留言功能所以有沒有這一行都沒關係。



### **建立分類頁與標籤頁**

Hexo 本身就有提供一些能夠連動網站資訊的頁面，例如文章分類與標籤頁，建立的方式就跟建立自訂頁面一樣。

```shell
# 建立標籤頁
hexo new page tags
# 建立分類頁
hexo new page categories
```

<br/>

打開新建的分頁index.md，會發現其實跟前述自訂分頁一樣一開始一開始只有title和date兩欄，如果要連接 Hexo 資訊，就要加上 `type` 資訊，並設定為 `tags`或`categories`。

```markdown
# tags/index.md
---
title: tags
date: 2022-01-20 20:58:13
type: tags 
comments: false 
---

# categories/index.md
---
title: categories
date: 2022-01-20 20:58:31
type: categories 
comments: false 
---
```

<br/>

接著打開`./themes/next/_config.yml`，設定側欄顯示清單，完成後側邊欄就多了剛剛新增的幾個頁面連結了。

```yaml
menu:
  home: / || fa fa-home
  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
```

<br/>

## **Reference**

- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)