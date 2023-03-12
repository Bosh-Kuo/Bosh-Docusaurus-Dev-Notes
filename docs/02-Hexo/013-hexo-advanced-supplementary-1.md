---
title: "註冊個人網域域名(with Godaddy)與Github Page 設定"
sidebar_label: "[Hexo 進階補充系列(1)] - 註冊個人網域域名(with Godaddy)與 Github Page 設定"
description: 本文紀錄如何註冊個人網域域名(with Godaddy)與 Github Page 設定
last_update:
  date: 2022-12-02
keywords:
  - Hexo
  - Goddady
  - DNS
  - Github Page
tags:
  - Hexo
---

## **自訂網域**

Github Pages 原本就會提供一個預設的網域: `<使用者名>.github.io` ，以這個的部落格為例，我的 repo 名稱為 **Bosh-Kuo-Blog**，因此 Github Pages 提供預設的網址為 `bosh-kuo.github.io/Bosh-Hexo-Blog/` 。若想要把網址換成自己喜歡的名字，可以 “買” 一個屬於自己的網址，再將原網站綁到買來的網址上。



<!-- more -->

### **購買域名**
買網域的管道有很多，我看到大多數的教學文章都是從 [godaddy](https://tw.godaddy.com/?checkAvail=1&itc=mya_dom_srch&pl_id=1&key=mya_domain_search) 這個網站買的，因此我第一次買個人網域就選擇使用它了。 godaddy 的網頁介面做的滿不錯的，至少算是新手友善，至於價格由於我是第一次買網域所以我也不太清楚自己買貴還是買便宜，總之我花了約莫 NT$ 380 購買了 `boshkuo.com` 這個網域一年的使用權，直得注意的一點是 godaddy 預設開啟自動續約服務，我個人這次買網域的目的比較偏實驗性質，因此有手動關閉自動續約，反正過期了還是可以繼續用原本 Github Pages 提供的預設網域 XD。



### **DNS server**

`DNS (Domain Name Server)` 也就是網域名稱系統，它的功能是將給人識別的網域名稱轉為給機器識別的 IP 位置，透過幫伺服器 IP 位置取一個人類比較好記的名稱，像是 google.com，讓使用者可以透過這個名稱連到該 IP 位置。



### **設定 Godaddy DNS server**
以下設定 DNS server 的 A Record 與 CNAME 來指向 Github 主機的 IP 位置： 

- **`A Record:`** A 表示 Address，對照到該 domain name (boshkuo.com) 要配對到的 IP address
  
- **`CNAME`**: CNAME 就是該網域名稱的別名紀錄，用來將子域名指向另一個網域名稱，舉例來說，我在 CNAME 的 "名稱欄" 填入了 `www`，在 "資料欄" 填入了 `boshkuo.com.	` 就會把子域名 www.boshkuo.com 導到 boshkuo.com
  
 
**1. A Record**  
我們在 godaddy 的 DNS 管理頁面新增 4 組 Github 主機的 IP，類型為 `A`，名稱為 `@` ，內容值如下依序新增四組，

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

新增完後把原本 godaddy 預設的類型 A 紀錄刪除。

**2. CNAME**  
新增一個類型為 `CNAME`，名稱為 `blog` 資料為 `bosh-kuo.github.io.` 的設定

![Godaddy DNS 設定](https://res.cloudinary.com/djtoo8orh/image/upload/v1673863366/Hexo%20Blog/2022-10-02-hexo-supplementary-domain-name/godaddy_bndcfm.png)

完成以上步驟後 `boshkuo.com` 與 `blog.boshkuo.com` 都指向了 github page 了


<br/>


## **Github Pages 設定**
為了讓 Github 主機找到要導向的 repo，以及讓原網址自動導向設定的域名，需要在對應的 repo 中做 GitHub Pages 設定。  

第一步是在 Custom domain 設定中填寫該 page 要對應的域名。以這個部落格為例，我希望將這個部落格的網址與 `blog.boshkuo.com` 配對，設定成功後 deploy branch 下會出現一個 CNAME 檔案，裡面記錄著 `blog.boshkuo.com`。由於 hexo deploy 好像會蓋掉 gh-pages branch 的 CNAME 檔案，因此要在 master branch 的 source 資料夾裡也新增一個相同的 CNAME 檔，未來在 deploy 時 custom domain 的設定才不會跑掉。

第二步則是點選 Enforce HTTPS 選項，github 會自動幫該域名做 https 安全連線憑證，不需要自己處理，超級貼心方便一定要勾！！

完成 Github Page 的設定後輸入 `blog.boshkuo.com` 可能會發現網站沒有 CSS 或是 404 not found，這是因為目前的網頁靜態內容還使用者舊的 hostname 跟 root，需要一併修改 hexo `_config.yml` 檔。

![Github Page 設定](https://res.cloudinary.com/djtoo8orh/image/upload/v1673863366/Hexo%20Blog/2022-10-02-hexo-supplementary-domain-name/github_page_r5zpw5.png)


<br/>


## **Hexo 設定**

我們需要更改 `_config.yml` 檔中的 `url` 部分，因為他會影響到靜態網頁文件所有跟 url 有關聯的地方。

```yaml
url: https://blog.boshkuo.com/  # 網站的網址:無個人網域(https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/)
root: /  # 網站根目錄:無個人網域(/Bosh-Hexo-Blog/)
```

我有嘗試過 url 用 `https://blog.boshkuo.com`，root 用 `/Bosh-Hexo-Blog/` ，但卻不 work，原因是尚未用 custom domain 時，這個網頁的網址為 `https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/`， hexo 會從url 找出 hostname: `https://Bosh-Kuo.github.io`，並接上設定的 root: `/Bosh-Hexo-Blog/` 作為靜態檔案的根路徑。但由於 http://blog.boshkuo.com 的 hostname 依然還是 `https://blog.boshkuo.com`，對應到原網址的 `https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/`，再加上 root 就會導到 `https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/Bosh-Hexo-Blog/`


![網址更新完成](https://res.cloudinary.com/djtoo8orh/image/upload/v1673863366/Hexo%20Blog/2022-10-02-hexo-supplementary-domain-name/new_link_vusjys.png)

另外，要注意的是，雖然在 Goddady DNS server 設定了 boshkuo.com 與 blog.boshkuo.com 都都導向 github 的 ip 位置，但由於github repo 中設定的 CNAME 是 blog.boshkuo.com，因此只有 blog.boshkuo.com 找得到這個部落格的靜態檔案，boshkuo.com 則是會回傳 Github 404。


<br/>


## **Reference**

- [架設部落格第一次就上手 Hexo + Github + 自訂網域](https://chanchandev.com/note/Hexo/hexo-introduction/2335841689/)
- [如何使用 Hexo + Github Page 自訂網域名稱 + Cloudflare SSL 免費憑證](https://wualnz.com/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-Hexo-Github-Page-%E7%94%A8-Cloudflare-%E7%B6%81%E5%AE%9A%E5%80%8B%E4%BA%BA%E7%B6%B2%E5%9D%80/)
- [【基礎教學】利用 Hexo 與 GitPage 建置個人 Blog](https://medium.com/@a3216lucy/%E5%9F%BA%E7%A4%8E%E6%95%99%E5%AD%B8-%E5%88%A9%E7%94%A8-hexo-%E8%88%87-gitpage-%E5%BB%BA%E7%BD%AE%E5%80%8B%E4%BA%BA-blog-79f34cbc1d86)
- [個人技術站一把罩！部落格建置大全（二）- 將 Github Page 串上自己的域名](https://medium.com/%E5%89%8D%E7%AB%AF%E5%AF%A6%E5%8A%9B%E4%B8%89%E6%98%8E%E6%B2%BB/%E5%80%8B%E4%BA%BA%E6%8A%80%E8%A1%93%E7%AB%99%E4%B8%80%E6%8A%8A%E7%BD%A9-%E9%83%A8%E8%90%BD%E6%A0%BC%E5%BB%BA%E7%BD%AE%E5%A4%A7%E5%85%A8-%E4%BA%8C-%E5%B0%87-github-page-%E4%B8%B2%E4%B8%8A%E8%87%AA%E5%B7%B1%E7%9A%84%E5%9F%9F%E5%90%8D-8f7e11cf2687)
- [Github Pages 自訂域名 - 輕鬆擁有 https 綠鎖頭 (1)](https://blog.dmoon.tw/github-pages-custom-domain/)
- [為你的 Github Page 添加 HTTPS Custom Domain](https://blog.v123582.tw/2018/08/27/%E7%82%BA%E4%BD%A0%E7%9A%84-Github-Page-%E6%B7%BB%E5%8A%A0-HTTPS-Custom-Domain/)