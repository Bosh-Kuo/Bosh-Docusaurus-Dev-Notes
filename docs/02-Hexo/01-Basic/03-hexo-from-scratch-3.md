---
title: "Hexo NexT 佈景主題基本設置"
sidebar_label: "[基本系列] - Hexo NexT 佈景主題基本設置"
description: 本文章記錄如何安裝 Hexo NexT 佈景主題以及如何配置 _config.yml 檔來設定喜歡的佈景樣式
last_update:
  date: 2022-01-23
keywords:
  - Hexo
  - NexT
tags:
  - Hexo
---

## **換一個好看的佈景主題**

我以 hexo 主題中最多人使用的 `NexT` (version 7.8.0)作為我佈景主題。  

第一步先將 `NexT` 佈景主題 clone 進 theme 資料夾。

```shell
git clone https://github.com/theme-next/hexo-theme-next themes/next
```

接下來修改 `_config.yml` 檔案

```yaml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next 
```

修改完後重新 hexo generate、hexo server就可以看到`next`主題被套上去了


<br/>


## **客製化自己的NexT佈景主題**

因為接下來要調整的設定參數是針對NexT佈景主題而不是整個網站，我們要開啟的檔案是在 Hexo 根目錄下的 `thems/next/_config.yml` 這個檔案，而不是根目錄下的`_config.yml`。

<!-- more -->



### **Scheme設置**

調整scheme可以變換部落格主頁、邊欄等的擺放位置，可以參考官方文件的範例[https://github.com/next-theme/awesome-next#live-preview](https://github.com/next-theme/awesome-next#live-preview)，或自己動手調整看看哪整編排方式最順眼，我目前是比較喜歡`Gemini`的編排。

```yaml
# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini

# Dark Mode
darkmode: false
```



### **頁尾作者連結**

正常來說頁尾部分就會顯示自己在根目錄`_config.yml`設定的作者名稱。若要將文字設定成一個鏈結，可以透過Html `<a></a>`語法嵌入指定的連結。

```yaml
copyright: "<a href='<指定連結>'>作者名字</a>"
```



### **主選單配置**

一開始next預設開啟的選單為首頁以及歸檔

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673801434/Hexo%20Blog/2022-01-23-hexo-from-scratch-3/menu_n03qji.png)

```yaml
menu:
# 分頁名稱: 路徑 || Icon 圖示
  home: / || fa fa-home
  #about: /about/ || fa fa-user
  #tags: /tags/ || fa fa-tags
  #categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
```

關於、標籤以及分類頁都需要我們額外新增頁面，因此在這裡就先不開啟。

<br/>

```yaml
# Enable / Disable menu icons / item badges.
menu_settings:
  icons: true
  badges: false
```

`icons` 控制選單是否要顯示圖示，`badges` 旁邊會顯示有幾篇文章的數字，有點像Line的未讀訊息數

<br/>

```yaml
sidebar:
  # Sidebar Position.
  position: left
  #position: right
```

Scheme 是選擇 Pisces 或 Gemini 的話，就會直接看到文章列表旁邊的邊欄（如果是 Muse 跟 Mist 的話，可以看到左下角的方形內三條線的按鈕，點一下就會跑出邊欄了），預設是靠左。

<br/>

```yaml
avatar:
  # Replace the default image and set the url here.
  url: /images/avatar.gif
```

url 認的網址為 next 資料夾下的 `source` 資料夾

<br/>

```yaml
social:
  #GitHub: https://github.com/yourname || fab fa-github
  #E-Mail: mailto:yourname@gmail.com || fa fa-envelope
  #Weibo: https://weibo.com/yourname || fab fa-weibo
  #Google: https://plus.google.com/yourname || fab fa-google
  #Twitter: https://twitter.com/yourname || fab fa-twitter
  #FB Page: https://www.facebook.com/yourname || fab fa-facebook
  #StackOverflow: https://stackoverflow.com/yourname || fab fa-stack-overflow
  #YouTube: https://youtube.com/yourname || fab fa-youtube
  #Instagram: https://instagram.com/yourname || fab fa-instagram
  #Skype: skype:yourname?call|chat || fab fa-skype
```

跟menu主選單很像，提供連結社群媒體的icon與連結

<br/>

```yaml
back2top:
  enable: true
  # Back to top in sidebar.
  sidebar: false
  # Scroll percent label in b2t button.
  scrollpercent: false
```

- sidebar: 設定在側邊欄的個人資訊區塊中，Social Links 下，顯示回到頂部按鈕。
- scrollpercent: 閱讀進度百分比。

```yaml
codeblock:
  # Code Highlight theme
  # Available values: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic
  # See: https://github.com/chriskempson/tomorrow-theme
  highlight_theme: normal
  # Add copy button on codeblock
  copy_button:
    enable: false
    # Show text copy result.
    show_result: false
    # Available values: default | flat | mac
    style: mac
```

文章中出現的程式碼的佈景顏色、主題以及複製特效，可以試試看哪個風格和胃口


<br/>


## **Reference**

- **[30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)**
- **[NexT](https://github.com/next-theme/hexo-theme-next)**