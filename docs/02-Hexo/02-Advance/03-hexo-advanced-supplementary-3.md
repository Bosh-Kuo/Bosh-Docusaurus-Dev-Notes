---
title: "更換 NexT 主題： Butterfly 主題客製化設定"
sidebar_label: "[進階系列] - 更換 NexT 主題： Butterfly 主題客製化設定"
description: 本文章紀錄如何更換 NexT 主題並客製化 Butterfly 主題頁面。
last_update:
  date: 2023-01-18
keywords:
  - Hexo
  - NexT
  - Butterfly
  - Theme
tags:
  - Hexo
---

## **從 NexT theme 換到 Butterfly theme**

用了一陣子的 NexT theme 也看了很多用 NexT theme 的 blog，總覺 Next 的設計有點過於乾淨缺乏活力，像是側邊欄訊息、dark mode、回到頂層、側邊欄的分類、標籤、歸檔還有網站資訊這些 Butterfly theme 原本就預設存在的可客製化選項在 NexT 都需要另外調整甚至是客製化部分程式碼，或許有些人喜歡部落格頁面乾淨一點，那 NexT 就滿適合的，但我私心覺得 Butterfly 的設計比較美啦 XD 而且 Butterfly 的中文教學可能是我看過最用心的了，第一次選用 NexT 時我查了很多篇不同的文章才拼湊出當時部落格的樣貌，但 Butterfly 的官方教學網站幾乎包辦了所有客製化需要的資訊，這讓我在更換 theme 節省了滿多時間的。


<br/>


## **安裝 Butterfly Theme**

我安裝當下的 butterfly theme 版本為 4.6.1，可以選擇用 `git clone`，或是 `npm install`，來安裝，因為用 npm 安裝的 theme 設定黨都會放在 `node_modules` 資料夾底下，對於有客製化需求的人來說比較不容易管理，因此我選擇用 git clone 來安裝。

- 首先將主題 clone 到 `theme/butterfly` 裡面

```bash
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

- 接著將隱藏的 .git 資料夾刪除，讓 `theme/butterfly` 資料夾跟著自己 repo 的版本控制走。
- 接著安裝必要插件：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

- 接著修改 Hexo 目錄下的 `_config.yml`，把主題改為 butterfly

```bash
theme: butterfly
```

尚未客製化的主題長得像這樣 ⬇︎
![butterfly theme 初始主頁頂部圖示](https://res.cloudinary.com/djtoo8orh/image/upload/v1674842776/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-3/butterfly_init1_xu4gp3.png)

![butterfly theme 初始配置](https://res.cloudinary.com/djtoo8orh/image/upload/v1674842777/Hexo%20Blog/2023-01-28-hexo-advanced-supplementary-3/butterfly_init2_muuu5r.png)

<br/>

## **404 頁面**

`theme/_config.yaml` 設置開啟 404 頁面

```yaml
error_404:
  enable: true
  subtitle: 'Page Not Found'
  background: https://i.loli.net/2020/05/19/aKOcLiyPl2JQdFD.png
```


<br/>


## 導航菜單

```yaml
menu: 
  首頁: / || fas fa-home
  歸檔: /archives/ || fas fa-archive
  標籤: /tags/ || fas fa-tags
  分類: /categories/ || fas fa-folder-open
  # List||fas fa-list:
  #   Music: /music/ || fas fa-music
  #   Movie: /movies/ || fas fa-video
  # Link: /link/ || fas fa-link
  # About: /about/ || fas fa-heart
```


<br/>


## **導航欄設置**

```yaml
nav:
  logo: # 網站的 logo，支持圖片，直接填入圖片鏈接
  display_title: true # 是否顯示網站標題，填寫 true 或者 false
  fixed: false # 是否固定狀態欄，填寫 true 或者 false
```


<br/>


## **社交圖標**

可以在 [font-awesome v6](https://fontawesome.com/search) 找到圖標名稱

```yaml
social:
  fab fa-github: https://github.com/xxxxx || Github
  fas fa-envelope: mailto:xxxxxx@gmail.com || Email
```


<br/>


## **主頁文章節選**

若文章的 front-matter 有添加 description，就優先顯示 description，若沒有則自動節選。

```yaml
# Display the article introduction on homepage
# 1: description
# 2: both (if the description exists, it will show description, or show the auto_excerpt)
# 3: auto_excerpt (default)
# false: do not show the article introduction
index_post_content:
  method: 2
  length: 500 # if you set method to 2 or 3, the length need to config
```


<br/>


## **頂部圖**

```yaml
index_img	#主頁的 top_img
default_top_img	#默認的 top_img，當頁面的 top_img 沒有配置時，會顯示 default_top_img
archive_img	#歸檔頁面的 top_img
tag_img	tag #子頁面 的 默認 top_img
tag_per_img	#tag 子頁面的 top_img，可配置每個 tag 的 top_img
category_img	#category 子頁面的默認 top_img
category_per_img	category #子頁面的 top_img，可配置每個 category 的 top_img
```


> 頂部圖的獲取順序，如果都沒有配置，則不顯示頂部圖。 
> 1. 頁面頂部圖的獲取順序：
> 各自配置的 top_img > 配置文件的 default_top_img
> 2. 文章頁頂部圖的獲取順序：
> 各自配置的 top_img > cover > 配置文件的 default_top_img

<br/>

## **文章封面**

文章的 Front-matter 如果不配置 cover,可以設置顯示默認的 cover 或設為 false

當配置多張圖片時,會隨機選擇一張作為cover。

```yaml
cover:
  # display the cover or not (是否顯示文章封面)
	index_enable	#主頁是否顯示文章封面圖
	aside_enable	#側欄是否顯示文章封面圖
	archives_enable	#歸檔頁面是否顯示文章封面圖
	position	#主頁卡片文章封面的顯示位置
		- left：全部顯示在左邊
		- right：全部顯示在右邊
		- both：封面位置以左右左右輪流顯示
	default_cover	#默認的 cover, 可配置圖片鏈接/顔色/漸變色等
		- #cover1
		- #cover2
```


> 文章封面的獲取順序 Front-matter 的 cover > 配置文件的 default_cover > false

<br/>

## **圖片設置**

### 頭像

```yaml
avatar:
  img: /img/avatar.png
  effect: true # 頭像會一直轉圈
```

### **網站圖標**

```yaml
# Favicon（網站圖標）
favicon: /img/favicon.ico
```


<br/>


## **Footer**

```yaml
# Footer Settings
# --------------------------------------
footer:
  owner:
    enable: true
    since: 2022
  custom_text: Welcome to my blog!
  copyright: true # Copyright of theme and framework
```

<br/>

## **右下角按鈕**

### **夜間模式**

```yaml
# dark mode
darkmode:
  enable: true
  # Toggle Button to switch dark/light mode
  button: true
  # Switch dark/light mode automatically (自動切換 dark mode和 light mode)
  # autoChangeMode: 1  Following System Settings, if the system doesn't support dark mode, it will switch dark mode between 6 pm to 6 am
  # autoChangeMode: 2  Switch dark mode between 6 pm to 6 am
  # autoChangeMode: false
  autoChangeMode: false
```

<br/>

## **側邊欄**

### **作者資訊**

```yaml
card_author:
    enable: true
    description:  #優先於根目錄的 description
    button: #連結按鈕
      enable: false
      icon: fab fa-github
      text: Follow Me
      link: https://github.com/xxxxxx
```

### **訪問人數 busuanzi (UV 和 PV)**

```yaml
busuanzi:
  site_uv: true
  site_pv: true
  page_pv: true
```

### **運行時間**

```yaml
runtimeshow:
  enable: true
  publish_date: 2022/01/20 18:00:00 +0800
  ##網頁開通時間
  #格式: 月/日/年 時間
  #也可以寫成 年/月/日 時間
```


<br/>


## **美化/特效**

### **背景**

```yaml
# 圖片格式 url(http://xxxxxx.com/xxx.jpg)
# 顏色（HEX值/RGB值/顔色單詞/漸變色)
# 留空 不顯示背景
background: "#f5f1ed"
```

### 主題顏色

```yaml
theme_color:
  enable: true
  main: "#49B1F5"
  paginator: "#00c4b6"
  button_hover: "#FF7242"
  text_selection: "#00c4b6"
  link_color: "#99a9bf"
  meta_color: "#858585"
  hr_color: "#A4D8FA"
  code_foreground: "#F47466"
  code_background: "rgba(27, 31, 35, .05)"
  toc_color: "#00c4b6"
  blockquote_padding_color: "#49b1f5"
  blockquote_background_color: "#49b1f5"
  scrollbar_color: "#49b1f5"
```

### **頁面美化**

```yaml
# 美化頁面顯示
beautify:
  enable: true
  field: site # site/post
  title-prefix-icon: '\f0c1'
  title-prefix-icon-color: "#F47466"
```

### **網站副標題**

```yaml
# the subtitle on homepage (主頁subtitle)
subtitle:
  enable: true
  # Typewriter Effect (打字效果)
  effect: true
  # Customize typed.js (配置typed.js)
  # https://github.com/mattboldt/typed.js/#customization
  typed_option:
  # source 調用第三方服務
  # source: false 關閉調用
  # source: 1  調用一言網的一句話（簡體） https://hitokoto.cn/
  # source: 2  調用一句網（簡體） https://yijuzhan.com/
  # source: 3  調用今日詩詞（簡體） https://www.jinrishici.com/
  # subtitle 會先顯示 source , 再顯示 sub 的內容
  source: false
  # 如果關閉打字效果，subtitle 只會顯示 sub 的第一行文字
  sub:
      - 慢慢來，比較快
      - 積少成多，聚沙成塔
```


<br/>


## **搜尋功能**

- 安裝 [hexo-generator-search](https://github.com/wzpan/hexo-generator-search)

```yaml
npm install hexo-generator-search --save
```

- 修改 `_config.yml`

```yaml
# Local search
local_search:
  enable: true
  preload: true
  CDN:
```


<br/>


## **Google Anaysis**

可以看 [從零開始使用Hexo + Github Page搭建個人技術筆記網站(7) - 客製化 NexT 主題：Google Analytics 分析部落格文章流量](https://blog.boshkuo.com/hexo-from-scratch-7/) 這篇的介紹

```yaml
google_analytics: 你的追蹤碼 # 評估 ID
```


<br/>


## **Reference**:
- **[Butterfly 安裝文檔(一) 快速開始](https://butterfly.js.org/posts/21cfbf15/)**
- **[Butterfly 安裝文檔(二) 主題頁面](https://butterfly.js.org/posts/dc584b87/)**
- **[Butterfly 安裝文檔(三) 主題配置-1](https://butterfly.js.org/posts/4aa8abbe/)**
- **[Butterfly 安裝文檔(四) 主題配置-2](https://butterfly.js.org/posts/ceeb73f/)**
- **[(33)試著學 Hexo-番外篇之更新 NexT 主題](https://israynotarray.com/hexo/20201101/60919/)**