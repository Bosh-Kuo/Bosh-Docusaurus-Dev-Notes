---
title: "Google Analytics 分析部落格文章流量"
sidebar_label: "[基本系列] - Google Analytics 分析部落格文章流量"
description: 使用 Google Analytics 分析部落格文章流量
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - Google Analytics
tags:
  - Hexo
---


## **用 Google Analytics 服務追蹤我的部落格**

雖然目前我對這個技術部落格的文章定位都還是寫給自己看為主，但要是幾年後開始有其他人看我的文章了，用GA這個服務我就能知道訪客瀏覽我的網站的一些資訊，比如說訪客年齡層、訪客尖峰時段、最多人瀏覽的文章等資訊。

<!-- more -->



### **申請Google Analytics**

- 首先進入[Google Analytics](https://analytics.google.com/analytics/web/provision/#/provision)官方網站，第一頁`帳戶設定`會需要填寫帳戶名稱，可以填寫任意名稱，下方選項默認就好點選下一頁。
- 第二頁`資源設定`必須提供長度必須介於 4 至 100 個半形字元之間的資源名稱，可以填寫網站名稱
- 第三頁`提供商家相關資訊`依照自己網站狀況勾選選項後案建立，會出現Google Analytics (分析) 服務條款合約，點選接受後接受後會跳出我的電子郵件通訊，點擊全部取消勾選並儲存就完成了建立流程。

完成建立後會進入以下頁面

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802901/Hexo%20Blog/2022-01-24-hexo-from-scratch-7/GA1_sgys9g.png)



### **設定 Google Analytics 追蹤碼並埋入Hexo**

點擊網站，輸入網址並取一個串流名稱後點選建立串流

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802902/Hexo%20Blog/2022-01-24-hexo-from-scratch-7/GA2_ce4gmt.png)

<br/>

完成後會看到建立好的網站追蹤ID，待會要回到hexo主題設定檔中進行設定

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802902/Hexo%20Blog/2022-01-24-hexo-from-scratch-7/GA3_gbzfhn.png)

<br/>

回到/theme/next/_congig.yml中，找到下列這段，將追蹤碼貼到tracking_id

```yaml
# Google Analytics
google_analytics:
  tracking_id: # <app_id>
  # By default, NexT will load an external gtag.js script on your site.
  # If you only need the pageview feature, set the following option to true to get a better performance.
  only_pageview: false
```

接下來點擊同一頁的`全域網頁代碼`將程式碼複製起來，並找到`themes/next/layout/_partials/head/head.swig`，將程式碼貼到最下面即可。



### **GA報表**

完成後重新產生靜態頁面檔案再開啟server就可以看到GA已經成功追蹤到了，就可以再次部署到Github Page上，日後就可以觀察網站的流量數據。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802902/Hexo%20Blog/2022-01-24-hexo-from-scratch-7/GA4_ganqdl.png)

<br/>

## **Reference**

- **[30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)**