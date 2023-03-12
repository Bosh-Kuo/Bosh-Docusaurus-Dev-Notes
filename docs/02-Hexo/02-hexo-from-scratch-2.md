---
title: "Hexo 基本設定"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(2)] - Hexo 基本設定"
description: Hexo 基本設定
last_update:
  date: 2022-01-23
keywords:
  - Hexo
tags:
  - Hexo
---

## **Hexo網站基本設定介紹**

用 hexo 架設網站非常的方便，hexo 把所有網站的基本設定參數都放在 `_config.yml` 裡面，我們可以根據自己對網站的需求調整這些晚站配置參數。配置參數很多這裡就不一一列舉，只記錄一些重要需要更改的參數。詳細也可以參考[官方配置文件](https://hexo.io/zh-tw/docs/configuration)

> `任何有關設定檔案的設定值，一定要在冒號後加上一個空格再接設定值`


<!-- more -->



### **網站基本資訊**

```yaml
# Site
title: Hexo # 部落格標題
subtitle: '' # 部落格副標題
description: '' # 部落格簡介
keywords: '關鍵字1', '關鍵字2' # 網站關鍵字，多個關鍵字用逗號隔開
author: John Doe # 作者名字
language: en # 語言，繁體中文設定 zh-TW
timezone: '' # 使用系統時間即可
```



### **URL設定**

```yaml
# URL
## If your site is put in a subdirectory, set url as 'http://example.com/child' and root as '/child/'
url: http://example.com # 正式部落格網址
# permalink: :year/:month/:day/:title/ # 文章路徑
permalink: :title/  # 可以設定網址後直接接文章名稱，網址整體才比較短
permalink_defaults:
pretty_urls:
  trailing_index: false # 設置 false 會移除網址中的 index.html
  trailing_html: false # 設置 false 會移除網址中的 html
```



### **載入文章**

```yaml
# Writing
# new_post_name: :title.md  設定對應的文章原始編輯檔
new_post_name: :year-:month-:day-:title.md  # 這樣設定會在生成新文章.md檔時將文章生成日輸入進檔名，方便日後管理
```


### **中文分類與標籤**

```yaml
# Category & Tag
default_category: uncategorized
category_map:
  # 中文分類: english-category  一個分類一列
	學習: Learning
tag_map:
  # 中文標籤: english-tag  一個標籤一列
	學習: Learning
```

如果新增文章分類或是標籤是中文，因為預設網址會抓分類與標籤名稱，網址就會跟著是中文。因此若要改成是英文網址，就要透過以上範例方式，即可將中文網址改為英文。不過這個部分不用一開始就設定，之後新增分類或標籤有設定到中文名稱時再設定就可以。


<br/>



## **Reference**

- [【學習筆記】如何使用 Hexo + GitHub Pages 架設個人網誌](https://hackmd.io/@Heidi-Liu/note-hexo-github#%E5%89%8D%E7%BD%AE%E4%BD%9C%E6%A5%AD)
- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)
- [Hexo文件-配置](https://hexo.io/zh-tw/docs/configuration)