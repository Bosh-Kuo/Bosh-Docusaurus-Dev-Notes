---
title: "Github Page 部署"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(6)] - Github Page 部署"
sidebar_position: 5
description: 使用 Github Page 部署 Hexo 部落格
last_update:
  date: 2022-01-24
keywords:
  - Hexo
  - Github Page
tags:
  - Hexo
---

## **終於要上架Hexo部落格了！**

到目前為止我們做的所有操作與設定雖然可以透過`hexo server`指令在本機看到網頁的樣貌，但只有自己看得到的網站真的很難說服自己在寫網站。那要怎麼做才能讓其他人也能使用我寫的網站呢？其實概念很簡單，就是找一台機器（自己的也行）全年無休運行server程式，並且提供外界連接進來的窗口（也就是網址）。我們可以選擇網路上主機租用的服務或是用自己的機器架設，但這兩種方法對一個靜態網頁來說好像又略嫌麻煩或是需要花上一些錢。`Github Page`剛好提供了一個免費的靜態網站架設環境，它提供了：

- 免費的靜態網頁空間
- 1GB 空間容量
- 100GB 月流量
- 提供一組 Github帳號.github.io 子網域
- 能夠使用 Git 部署並進行版本控制

雖然空間與流量上有所限制，但對個人技術部落格來說已經非常夠用了！

<!-- more -->

<br/>

## **創建Github repo**

首先新增一個github repo，`注意!`，幾乎所有教學文章都寫Repository name要命名成`<github account>.github.io`，如果我的github帳號叫`Bosh-Kuo`，那新增的repo就要叫`Bosh-Kuo.github.io`，這樣連到該專案的網址才會是 `https://Bosh-Kuo.github.io/`。

但是要是我有第二個部落格想架設呢？或是我覺得repo就是想取其他名字呢？其實是可以的，這篇示範的就是用別的方式命名來架設Github page，我把我的github repo取名為`Bosh-Hexo-Blog`，接下來部署github-page一樣可以在這個repo下完成，但有些設定需要稍微改動。

![Imgur](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802340/Hexo%20Blog/2022-01-24-hexo-from-scratch-6/repo_impbn9.png)

<br/>

### **設定 Hexo 連結github repo**

部署前要先設定 Hexo 的 `_config.yml` 檔案中連接到 Github 儲存庫的相關設定，

```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git # 使用 Git 部署
  repo: https://github.com/Bosh-Kuo/Bosh-Hexo-Blog.git # repo clone link
  branch: gh-pages # hexo 會將靜態網頁內容放到這個repo分支
  message: "First Commit" # Commit 訊息
```

<br/>

接著進入至關重要的一環，因為我們的命名方式並不是以`<github account>.github.io`來命名，因此我的網站網址會在`Bosh-Kuo.github.io`的下一層，舉例來說我的repo命名為Bosh-Hexo-Blog因此這個Github Page架設的網站網址就會是`https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/`，因此我們必須去改`_config.yml`中的`url`和`root`，讓hexo架在正確的位置上，並且設置正確的網站根目錄，可以參考官方文件的**網站存放在子目錄**部分

```yaml
# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: https://Bosh-Kuo.github.io/Bosh-Hexo-Blog/  # 網站的網址
root: /Bosh-Hexo-Blog/  # 網站的根目錄
```

<br/>

注意！當我們這麼設定完後以後開local server也會把根目錄設在Bosh-Hexo-Blog，local網址就會變成: `http://localhost:4000/Bosh-Hexo-Blog/`



### **使用指令部署**

設定完成後首先安裝hexo的git部署套件

```shell
npm install hexo-deployer-git --save
```

<br/>

接著清理之前建立的靜態檔案 → 建立靜態檔案 → 部署至 Github Pages

```shell
hexo clean
hexo generate
hexo deploy
```

<br/>

完成後就會看到github頁面被更新囉～

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802340/Hexo%20Blog/2022-01-24-hexo-from-scratch-6/github_gq6ign.png)

<br/>

接著前往設定Settings開啟Github Pages

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802340/Hexo%20Blog/2022-01-24-hexo-from-scratch-6/github_setting_rs9t0v.png)

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802340/Hexo%20Blog/2022-01-24-hexo-from-scratch-6/github_pages_bqiyp7.png)

<br/>

接著點選repo頁面的火箭圖示，可以看到deploy的狀況，當部署完成網址就生效囉！

> **耶～ 我的部落格正式誕生了 撒花慶祝～**

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673802341/Hexo%20Blog/2022-01-24-hexo-from-scratch-6/blog_tc0lak.png)



### **`補充-移除網址末端的 #more`**

如果是點選`閱讀全文`按鍵進入文章的，文章網址後面不但會有 `#more` 的後綴詞，而且瀏覽器會自動跳到閱讀全文後的網頁內容，而不是最上層。原因是 #more 是 HTML 元素裡的一個 ID，如果進入以 ID 為 more 的文章網址，就會自動跳到 ID 為 more 的區塊。

解決方法就是修改`themes/next/lauout/_macro/post.swig`這個檔案

```html
<!--/noindex-->
{% elif post.excerpt %}
        {{ post.excerpt }}
        <!--noindex-->
        {%- if theme.read_more_btn %}
    <div class="post-button">
            <a class="btn" href="{{ url_for(post.path) }}#more" rel="contents">
        {{ __('post.read_more') }} &raquo;
            </a>
    </div>
        {%- endif %}
        <!--/noindex-->
```

將`<a class="btn" href="{{ url_for(post.path) }}#more" rel="contents">`的#more刪除就ok了

<br/>

## **Reference**

- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)
- [[教學] 使用 GitHub Pages + Hexo 來架設個人部落格](https://ed521.github.io/2019/07/hexo-install/)