---
title: "客製化 NexT 主題：添加側邊欄 Tag Cloud / Mermaid 圖表"
sidebar_label: "[Hexo 進階補充系列(2)] - 客製化 NexT 主題：添加側邊欄 Tag Cloud / Mermaid 圖表"
sidebar_position: 13
description: 本文紀錄如何客製化設定 NexT 主題，包含：添加側邊欄 Tag Cloud / Mermaid 圖表
last_update:
  date: 2023-01-17
keywords:
  - Hexo
  - Tag Cloud
  - Mermaid 圖表
tags:
  - Hexo
---

## **Tag Cloud**


### **hexo-tag-cloud**

- github repo: [hexo-tag-cloud](https://github.com/MikeCoder/hexo-tag-cloud)

<!-- more -->

### **命令列安裝**

```shell
npm install hexo-tag-cloud
```


<br/>


### **文件配置**

以本人使用的 Next 主題示範，詳細可參考官方文件

找到`theme/next/layout/_macro/sidebar.swig`文件，在文貼上下列程式碼

```html
{% if site.tags.length > 1 %}
  <script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcloud.js') }}"></script>
  <script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcanvas.js') }}"></script>
  <div class="widget-wrap">
    <h3 class="widget-title">Tag Cloud</h3>
    <div id="myCanvasContainer" class="widget tagcloud">
      <canvas width="250" height="250" id="resCanvas" style="width:100%">
        {{ list_tags() }}
      </canvas>
    </div>
  </div>
{% endif %}
```


### **主題配置**

找到`theme/next/_config.yml`，在最下面貼上下列程式碼

```yaml
# hexo-tag-cloud
tag_cloud:
    textFont: Trebuchet MS, Helvetica
    textColor: '#333'
    textHeight: 50
    outlineColor: '#E2E1D1'
    maxSpeed: 0.1
```



### **預覽**
![Tag Cloud 預覽](https://res.cloudinary.com/djtoo8orh/image/upload/v1673940709/Hexo%20Blog/2023-01-17-hexo-advanced-supplementary-2/tag_cloud_zluzpc.png)


<br/>


## **Mermaid圖表**


### **hexo-filter-mermaid-diagrams**

github repo: [hexo-filter-mermaid-diagrams](https://github.com/webappdevelp/hexo-filter-mermaid-diagrams/blob/master/README.md)

### **命令列安裝**

```shell
npm install hexo-filter-mermaid-diagrams --save
```



### **Next 啟用 Mermaid**

找到`theme/next/_config.yml`文件，找到 `mermaid` 的配置選項，設定 `enable: true`

```
# Mermaid tag
mermaid:
  enable: true
  # Available themes: default | dark | forest | neutral
  theme:
    light: default
    dark: dark
```

找到`theme/next/layout/partials/footer.swig`，在最底加上下列程式碼

```html
{% if theme.mermaid.enable %}
  <script src='https://unpkg.com/mermaid@{{ theme.mermaid.version }}/dist/mermaid.min.js'></script>
  <script>
    if (window.mermaid) {
      mermaid.initialize({theme: 'forest'});
    }
  </script>
{% endif %}
```



### **Hexo 啟用 Mermaid**

找到`_config.yml`文件，在最底加上下列程式碼

```yaml
# mermaid chart
mermaid: ## mermaid url https://github.com/knsv/mermaid
  enable: true  # default true
  version: "7.1.2" # default v7.1.2
  options:  # find more api options from https://github.com/knsv/mermaid/blob/master/src/mermaidAPI.js
    #startOnload: true  // default true
```



### **預覽**
![mermaid 畫面渲染](https://res.cloudinary.com/djtoo8orh/image/upload/v1673940708/Hexo%20Blog/2023-01-17-hexo-advanced-supplementary-2/mermaid_zl8ruh.png)


<br/>


## **Reference**

- [Hexo个人博客添加标签云及效果展示](https://enfangzhong.github.io/2019/12/08/Hexo%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE%E4%BA%91%E5%8F%8A%E6%95%88%E6%9E%9C%E5%B1%95%E7%A4%BA/)
- [hexo-tag-cloud](https://github.com/D0n9X1n/hexo-tag-cloud)
