---
title: "客製化 NexT 主題：統計訪客人數與閱讀次數"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(8)] - 客製化 NexT 主題：統計訪客人數與閱讀次數"
sidebar_position: 7
description: 使用不蒜子統計訪客人數與閱讀次數
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - NexT
  - uv
  - pv
  - 不蒜子
tags:
  - Hexo
---

## **添加網站訪客計數器**

hexo主題可以搭配第三方計數器來統計訪客人數，這邊我選擇的是[不蒜子](https://busuanzi.ibruce.info/)，因為它有內建在next主題內所以設定起來很方便。

<!-- more -->



### **修改 hexo next 主題配置檔**

首先打開`theme/next/_config.yml`，將`enable`改為true

```yaml
# Show Views / Visitors of the website / page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi
busuanzi_count:
  enable: false
  total_visitors: true
  total_visitors_icon: fa fa-user
  total_views: true
  total_views_icon: fa fa-eye
  post_views: true
  post_views_icon: fa fa-eye
```

<br/>

接著打開`themes\next\layout\_third-party\analytics\busuanzi-counter.swig`，確認src後面接的網址為[不蒜子](https://busuanzi.ibruce.info/)官方提供的最新網址。

```JS
{%- if theme.busuanzi_count.enable %}
<div class="busuanzi-count">
  <script{{ pjax }} async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

  {%- if theme.busuanzi_count.total_visitors %}
```

到這裡打開`hexo server`應該就能看到網站底下出現統計人數跟觀看數量的圖標與數字了，在local端會看到異常大的統計數字這是正常的，部署到github page後就會顯示正常。



### **統計網站uv, pv**

不蒜子計算計算晚站訪客數有兩種算法：

- uv: 單個用戶連續點擊n篇文章只紀錄一次訪客數。
- pv: 單個用戶連續點擊n篇文章紀錄n次訪客數。

若要在統計數字與圖標間加上文字則可以在同個文件中找到下列程式碼，改動如下：

```html
{%- if theme.busuanzi_count.total_visitors %}
    <span class="post-meta-item" id="busuanzi_container_site_uv" style="display: none;">
      <span class="post-meta-item-icon">
        <i class="{{ theme.busuanzi_count.total_visitors_icon }}"></i>
      </span>
      <span class="site-uv" title="{{ __('footer.total_visitors') }}">
				總訪客：<span id="busuanzi_value_site_uv"></span>人
      </span>
    </span>
  {%- endif %}
```

```html
{%- if theme.busuanzi_count.total_views %}
    <span class="post-meta-item" id="busuanzi_container_site_pv" style="display: none;">
      <span class="post-meta-item-icon">
        <i class="{{ theme.busuanzi_count.total_views_icon }}"></i>
      </span>
      <span class="site-pv" title="{{ __('footer.total_views') }}">
        總閱讀量：<span id="busuanzi_value_site_pv"></span>次
      </span>
    </span>
  {%- endif %}
```

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673831994/Hexo%20Blog/2022-01-24-hexo-from-scratch-8/%E7%B8%BD%E4%BA%BA%E6%95%B8_g0q4cw.png)



### **統計單頁pv**

打開`themes/next/layout/_macro/post.swig`找到下列程式碼，這邊next主題已經幫我們設定好了只要確定有以下程式碼就沒問題了

```html
{%- if not is_index and theme.busuanzi_count.enable and theme.busuanzi_count.post_views %}
            <span class="post-meta-item" title="{{ __('post.views') }}" id="busuanzi_container_page_pv" style="display: none;">
              <span class="post-meta-item-icon">
                <i class="{{ theme.busuanzi_count.post_views_icon }}"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.views') + __('symbol.colon') }}</span>
              <span id="busuanzi_value_page_pv"></span>
            </span>
          {%- endif %}
```

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673831993/Hexo%20Blog/2022-01-24-hexo-from-scratch-8/%E5%96%AE%E9%A0%81%E4%BA%BA%E6%95%B8_hunlcm.png)


<br/>


## **Reference**

- [Hexo Next主题不蒜子统计的使用。](https://www.lcd1024.xyz/2020/05/31/busuanzi/)
- [使用不蒜子添加访客统计](https://blog.mikelyou.com/2020/08/18/busuanzi-visitor-counts-and-sitetime/)
