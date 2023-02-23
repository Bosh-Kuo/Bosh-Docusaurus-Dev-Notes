---
title: "客製化 NexT 主題：網站運行時間、文章長度、閱讀時間與搜尋功能"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(9)] - 客製化 NexT 主題：網站運行時間、文章長度、閱讀時間與搜尋功能"
sidebar_position: 8
description: 設定網站運行時間、文章長度、閱讀時間與搜尋功能
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - 網站運行時間
  - 文章長度
  - 閱讀時間
  - 搜尋功能
  - NexT
tags:
  - Hexo
---

## **網站運行時間**

在 `/themes/next/layout/_partials` 文件夾下新建一個名稱爲 `runtime.swig` 的文件，並添加內容如下：

<!-- more -->

```html
<div id="site-runtime">
  <span class="post-meta-item-icon">
    <i class="fa fa-clock-o"></i>
  </span>
  <span id="runtime"></span>
</div>

<script language="javascript">
  function isPC() {
    var userAgentInfo = navigator.userAgent;
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for (var i = 0; i < agents.length; i++) {
      if (userAgentInfo.indexOf(agents[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  function siteTime(openOnPC, start) {
    window.setTimeout("siteTime(openOnPC, start)", 1000);
    var seconds = 1000;
    var minutes = seconds * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;

    {%- if theme.runtime.start %}
      start = new Date("{{ theme.runtime.start }}");
    {%- endif %}
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var diff = now - start;

    var diffYears = Math.floor(diff / years);
    var diffDays = Math.floor((diff / days) - diffYears * 365);
    var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours);
    var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes);
    var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes * minutes) / seconds);

    if (openOnPC) {
      document.getElementById("runtime").innerHTML = "Running: " + diffYears + " years " + diffDays + " days " + diffHours + " hours " + diffMinutes + " mins " + diffSeconds + " secs";
    } else {
      document.getElementById("runtime").innerHTML = "Running: " + diffYears + "y " + diffDays + "d " + diffHours + "h " + diffMinutes + "m " + diffSeconds + "s";
    }
  }
# 這邊可以決定要在頁面上顯示的時間精度，我覺得顯示到小時比較順眼，因此我從+ diffHours + " hours " 後面分鐘與秒鐘的部分就刪掉了（未來要加回來再看這篇文就好ＸＤ這就是寫文章的好處）

  var showOnMobile = {{ theme.runtime.mobile }};
  var openOnPC = isPC();
  var start = new Date();
  siteTime(openOnPC, start);

  if (!openOnPC && !showOnMobile) {
    document.getElementById('site-runtime').style.display = 'none';
  }
</script>
```

<br/>

編輯文件 `/themes/next/layout/_partials/footer.swig`，在文件底部添加這幾行：

```html
{%- if theme.runtime.enable %}
  {% include 'runtime.swig' %}
{%- endif %}
```

<br/>

更改 Next 主题的配置文件 `themes/next/_config.yml`，在文件底部添加以下内容：

```markdown
# Site Runtime
runtime:
  enable: true
  # The time of the site started running. If not defined, current time of local time zone will be used.
  # You can specify the time zone by adding the `+HOURS` or `-HOURS` format time zone.
  # If not specify the time zone, it will use `+0000` as default.
  # ex: "2015-06-08 07:24:13 +0800", `+0800` specify that it is the time in the East Eight Time Zone.
  start: 2022-01-20 18:00:00 +0800  # 部落格開始運行的時間
  # Whether to show on the mobile side
  mobile: false
```

<br/>

完工後就會顯示在網站最下面囉。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673832339/Hexo%20Blog/2022-01-24-hexo-from-scratch-9/%E9%81%8B%E8%A1%8C%E6%99%82%E9%96%93_qdcddf.png)

<br/>

## **添加文章字數與所需閱讀時間**

要實現自動產生文章字數與所需閱讀時間這個功能我們要使用一個plug-in：`hexo-symbols-count-time`，先到Blog專案目錄npm安裝

```shell
npm install hexo-symbols-count-time --save
```

<br/>

打開`theme/next/_config.yml`

```yaml
# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
symbols_count_time:
  separated_meta: true # 是否獨立一行
  item_text_post: true # page
  item_text_total: true # footer
```

<br/>

打開hexo根目錄的`_config.yml`，加入以下內容：

```yaml
# count
symbols_count_time:
  symbols: true # page字數顯示
  time: true # page時間顯示
  total_symbols: true # footer字數統計顯示
  total_time: true # footer閱讀時間顯示
  exclude_codeblock: false # 字數統計是否排除程式碼
  awl: 4  # 平均文字長度
  wpm: 275  # 一分鐘閱讀字數

```

> `在部署或開啟local端server前若沒有先clean再生成，所需閱讀時間很可能會出現NaN的字樣`

<br/>

完成後大概會長這樣。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673832339/Hexo%20Blog/2022-01-24-hexo-from-scratch-9/%E9%96%B1%E8%AE%80%E6%99%82%E9%96%93_h9i4cu.png)


<br/>


## **搜尋功能**

要實現在網站內搜尋這個功能我們要使用另外一個plug-in：`hexo-generator-searchdb`，先到Blog專案目錄npm安裝。

```shell
npm install hexo-generator-searchdb --save
```

<br/>

接著到`themes/_config.yml`將enable改為true就可以了。

```yaml
# Local Search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
local_search:
  enable: true
  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto
  # Show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # Unescape html strings to the readable one.
  unescape: false
  # Preload the search data when the page loads.
  preload: false
```

<br/>

完成後就會看到邊欄上多了一個搜尋可選，點擊後就可以搜尋站內文章資訊了。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673832340/Hexo%20Blog/2022-01-24-hexo-from-scratch-9/%E6%90%9C%E5%B0%8B_h7afyy.png)

<br/>

## **Reference**

- [Hexo Next 主题详细配置之一](https://www.techgrow.cn/posts/755ff30d.html)
- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)
- [(20) 試著學 Hexo - NexT 主題篇 - 可以安裝的套件](https://ithelp.ithome.com.tw/articles/10248214)