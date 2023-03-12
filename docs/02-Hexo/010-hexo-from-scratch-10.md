---
title: "客製化 NexT 主題：github 圖標 / Dark mode / Canvas Ribbon背景"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(10)] - 客製化 NexT 主題：github 圖標 / Dark mode / Canvas Ribbon背景"
description: 設定 github 圖標 / Dark mode / Canvas Ribbon背景
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - github 圖標
  - Dark mode
  - Canvas Ribbon背景
  - NexT
tags:
  - Hexo
---

## **設置左上角或右上角 github 圖標**

打開hexo根目錄的`_config.yml`，將enable改為true即可

```yaml
# `Follow me on GitHub` banner in the top-right corner.
github_banner:
  enable: true
  # 點擊即跳轉到該鏈接，自行設定
  permalink: https://github.com/yourname
  # 當鼠標懸浮於上方時顯示的文本
  title: Follow me on GitHub
```

<!-- more -->


<br/>


## **可切換式 Dark mode**

next雖然有支援dark mode，但沒有直接支援手動切換dark/light mode的功能，因此我們要使用一個plug-in：`hexo-next-darkmode`，先到Blog專案目錄npm安裝

```shell
npm install hexo-next-darkmode --save
```

<br/>

接著更改 Next 主题的配置文件 `themes/next/_config.yml`，在底下添加下列程式碼

```yaml
# Darkmode JS
# For more information: https://github.com/rqh656418510/hexo-next-darkmode, https://github.com/sandoche/Darkmode.js
darkmode_js:
  enable: true
  bottom: '64px' # default: '32px'
  right: 'unset' # default: '32px'
  left: '32px' # default: 'unset'
  time: '0.5s' # default: '0.3s'
  mixColor: 'transparent' # default: '#fff'
  backgroundColor: 'transparent' # default: '#fff'
  buttonColorDark: '#100f2c' # default: '#100f2c'
  buttonColorLight: '#fff' # default: '#fff'
  isActivated: false # default false
  saveInCookies: true # default: true
  label: '🌓' # default: ''
  autoMatchOsTheme: true # default: true
  libUrl: # Set custom library cdn url for Darkmode.js
```

<br/>

`isActivated: true`: 默認激活dark mode, 必須搭配 `saveInCookies: false` 與 `autoMatchOsTheme: false`

關於如何調整dark mode的css 可以參考plug-in作者的repo: **[Hexo NexT Darkmode](https://github.com/rqh656418510/hexo-next-darkmode)**

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673833980/Hexo%20Blog/2022-01-24-hexo-from-scratch-10/dark_mode_m4wbsr.png)


<br/>


## **加上Canvas Ribbon背景**

加上dark mode後現在的背景不是全黑就是全白，要如何讓背景更豐富呢？NexT 默認提供3種背景配置，但都需要安裝依賴，這邊選擇Canvas Ribbon背景。

1. 首先進入next資料夾

```shell
cd themes/next
```
<br/>

2. 安裝模塊到 source/lib 目錄下：

```shell
git clone https://github.com/theme-next/theme-next-canvas-ribbon source/lib/canvas-ribbon
```

<br/>

3. 編輯`/theme/next/_config.yml`，將enable改為true

```yaml
# 更改 Next 主题的配置文件 themes/next/_config.yml，设置以下内容
canvas_ribbon:
  enable: true
  size: 300           # Ribbon的寬度
  alpha: 0.6          # Ribbon的透明度
  zIndex: -1          # Ribbon的顯示級別
```

<br/>

修改完成後Canvas Ribbon背景就出現了～

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673833980/Hexo%20Blog/2022-01-24-hexo-from-scratch-10/ribbon_yywifz.png)


<br/>


## **Reference**

- [Hexo Next 8.x 主题添加可切换的暗黑模式](https://www.techgrow.cn/posts/abf4aee1.html)
- [Hexo 搭建個人博客（九）NexT 主題進階配置](https://www.twblogs.net/a/5ef7dc58f638e9bb9bd55a57)