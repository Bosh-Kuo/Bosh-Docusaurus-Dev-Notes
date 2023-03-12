---
title: "建立 hexo 部落格模板"
sidebar_label: "[從零開始使用Hexo + Github Page搭建個人技術筆記網站(1)] - 建立hexo部落格模板"
description: 本文介紹如何以 hexo 建立自己的部落格
last_update:
  date: 2022-01-20
keywords:
  - Hexo
tags:
  - Hexo
---

## **使用 Hexo 從零開始建立自己的部落格！**
### **該如何挑選架站工具？**
在建立部落格之前可以問問自己對部落格的需求，再來挑選適合的部落格架設工具。對我來說，我的需求有以下幾點：  
1. 我只需要一個靜態的頁面可以呈現我的文章、筆記，並不需要與資料庫互動，因此靜態網站產生器是一個很好的選擇。  
2. 因為這是第一個建立的部落格，其實也還不確定 hexo 這套架站工具是否適合我，以後若找到更好的工具是比得面對文章搬家問題，因此我希望文章容易搬遷，並且可以用我習慣的 Markdown 語法編輯。  
3. 我希望可以客製化自己喜歡的樣式，還有擴充功能，除了可以建立自己的網站風格，也可以滿足動手實作過程中堆城堡的成就感。
綜合上述需求，我就放棄了 `Medium`，選擇使用教學資源豐富的 `Hexo` 來建立我的筆記部落格 ～  

### **Hexo 的優點有哪些？**
Hexo 是一種以 Node.js 開發的輕量級靜態部落格生成工具，安裝和使用都非常簡單，只需要在本地端安裝 Node.js 和 Hexo 就可以使用了，非常適合稍微有學過一點程式的人來使用。它的使用方法為：在本地端寫文章、預覽、修改後，再將部落格發佈到遠端伺服器。而且它提供了許多主題可供選擇，並且支援 Markdown 語法來撰寫文章，它還支援多種插件，可以增加部落格的功能，例如SEO優化、訪客統計、註解等額外功能。而以下是幾個 Hexo 的優點：  
**1. 開源且免費:** Hexo 是一個開源的工具，它是免費的且可以自由使用。  
**2. 簡單易學:** Hexo 使用 Node.js 開發，並且使用 Markdown 語法來撰寫文章，這是一種簡單易學的文本格式，適合新手使用。  
**3. 多樣性的主題:** Hexo 提供了許多主題可供選擇，還可以自定義主題。  
**4. 支援插件:** Hexo 支援許多插件，可以增加部落格的功能，例如 SEO 优化、訪客統計、註解等。  
**5. 容易部署:** Hexo 支持多種部署方式，可以輕鬆部署到遠端伺服器或是使用靜態網頁托管服務，例如Github pages。  
**6. 輕量級:** Hexo 安裝和使用非常簡單, 是一種輕量級的部落格工具，不需要很高的服務器配置。  
**7. 社群支援:** Hexo 有大量的社群支援，有許多文件和教程可以幫助使用者學習和解決問題。  

<!-- more -->


<br/>


## **前置作業**

在開始搭建hexo部落格前需要先安裝以下軟體，可以參考[官方文件](https://hexo.io/zh-tw/docs/)依照自己的作業系統安裝。

- Git
- Node.js
- VScode


<br/>


## **安裝Hexo**
### **下載 Hexo 套件包**


```shell
npm install hexo-cli -g
```

確認hexo-cli成功下載可以輸入`hexo -v` 查看 hexo-cli 版本，若有出現下方hexo-cli版本資訊就代表安裝成功囉，`注意，hexo-cli跟hexo是不一樣的東西`，如果熟悉react的朋友，我個人覺得`hexo-cli`跟`create-react-app`有點像，都是創建環境的工具，而`hexo`跟`react`才是框架本體。許多hexo主題套件會要求hexo的版本，並不是指這邊輸入`hexo -v`顯示的hexo-cli 版本，至於hexo版本怎麼看會在下方講到。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800365/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/hexo_version_ijbhof.png)



### **創建hexo專案資料夾**

我選擇將hexo專案資料夾創建於我的桌面上

```shell
cd Desktop
```

```shell
hexo init Blog
```



### **安裝專案需要的檔案**

```shell
cd Blog
```

```shell
npm install
```

完成後資料夾下應該會有下面這些檔案與資料夾：
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800364/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/folder_structure_ck5fam.png)

- _config.yml: 有關網站配置的檔案，可修改各種配置設定。例如：網站標題、網站的網址、使用主題名稱等等
- package.json: 紀錄專案的基本資訊如載入的套件、script等
- scaffolds: 當我們建立新文章時，Hexo 會根據 scaffolds 中的模板`.md`檔建立相對應的檔案，剛建立會有`draft.md, page.md, post.md`三種模板，分別對應草稿、頁面、文章。
- themes: 存放hexo網站主題，Hexo 會根據主題來解析 scouce 資料夾中的檔案並產生靜態頁面。預設主題為`landscape`
- source: 用來存放原始檔案的資料夾，例如 Markdown 檔、圖片、各種頁面（分頁、關於等）。資料夾以_開頭，如:`_posts, _imgs`但除了 `_posts` 資料夾以外以 `_` 開頭的檔案、資料夾或隱藏檔案會被忽略。
- source & public & .deploy_git: 執行`$ hexo generate`生成靜態網站文件時source資料夾中的Markdown 檔和 HTML 檔會被解析並根據主題渲染，並放到 public 資料夾，而其他檔案則會被拷貝過去。執行`$ hexo deploy`則會將 public 文件夾中的內容部署到 GitHub，並生成 `.deploy_git`資料夾，其內容與public幾乎完全同。


<br/>


## **看看部落格的雛形吧！**

當完成前述指令動作基本的hexo部落格就已經搭建好了，跟自己從零開始手刻一個部落格相比hexo真的是個快速又方便網站搭建神器！接下來使用hexo的一些基本指令來實現自己的部落格。



### **新增文章**

```shell
hexo new [layout] <title>
```

建立一篇新的文章。如果沒有設定 `layout` 的話，則會使用 `_config.yml` 中的 `default_layout` 設定代替，`default_layout`為post。如果標題有包含空格，需使用引號括住，例如`" title"。`

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800365/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/hexo_new_title_qpopgr.png)
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800364/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/new_article_fa9pml.png)



### **產生靜態網頁**

```shell
hexo generate
```

執行後，多了一個 public 目錄，點擊進去後，會發現裡面有一些內容，這是 Hexo解析`source`資料夾產生的靜態網頁資料，也就是決定部落格內容與外觀的一些文件，之後部署到github page做的事情其實就是把`public`資料夾內容搬到github上



### **清除靜態檔案與快取**

```shell
hexo clean
```

清除快取檔案 (`db.json`) 和已產生的靜態檔案 (`public`)。建議在每次更新部落格內容執行hexo generate之前先執行



### **本地伺服器**

```shell
hexo server
```

在本地端啟動 Hexo 伺服器，預設路徑為：`localhost:4000/`，可在自己電腦上預覽設定結果

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800365/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/hexo_server_xryytu.png)
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1673800365/Hexo%20Blog/2022-01-20-hexo-from-scratch-1/initial_blog_f4l2dm.png)

<br/>

## **Reference**
- [【學習筆記】如何使用 Hexo + GitHub Pages 架設個人網誌](https://hackmd.io/@Heidi-Liu/note-hexo-github#%E5%89%8D%E7%BD%AE%E4%BD%9C%E6%A5%AD)
- [30 天利用 Hexo 打造技術部落格系列](https://ithelp.ithome.com.tw/users/20139218/ironman/3910)
- [Hexo文件-指令](https://hexo.io/zh-tw/docs/commands)