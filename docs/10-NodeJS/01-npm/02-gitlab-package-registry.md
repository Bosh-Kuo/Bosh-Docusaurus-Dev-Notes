---
title: 使用 Gitlab package registry 發布與下載私人 npm 套件全記錄
sidebar_label: "[實作紀錄]使用 Gitlab package registry 發布與下載私人 npm 套件"
description: 這篇技術筆記詳細介紹了如何使用 Gitlab Package Registry 來發布和下載私人 npm 套件。文章涵蓋了 Gitlab Package Registry 的基本概念、如何進行身份驗證、權限管理以及 package.json 的設定。
last_update:
  date: 2023-07-22
keywords:
  - GitLab
  - GitLab package registry
  - npm
  - yarn
  - npm package
tags:
  - GitLab
  - npm
  - yarn
---


> **前情提要：**  
> 近期，主管想要要寫一個公司內部用的 npm library，請我幫忙研究一下，由於我之前從來沒有開發過 npm library，借此機會研究了一下一般公開的 npm library 如何開發、打包、發布、維護等，以及是否有發布私人 npm library 的解決方案？以及要如何維護、管理與發布等議題。  

## **問題**
我研究了公司至今為止發布 npm library 的作法，發現公司至今為止所有共用函式庫的開發與發布流程大致如下：
- 開發端：
```
修改原始碼 → 打包 → 將原始碼與打包後的檔案一併推到 gitlab 上 → 根據改動程度決定是否需要上 tag。
```

- 用戶端：
```
在本地專案中手動指定 package.json 中套件的專案路徑與版本 -> 把整個函式庫專案從 gitlab 上 clone 到本地端的 node_module
```

我覺得目前這樣的開發與發布流程隱藏了一些問題：  
1. 使用端下載套件時，會將原始碼以及其他靜態檔案一同下載下來，造成 node_module 體積過大。
2. 供使用端下載的打包檔案沒有錨定於套件版號。
3. 發布流程（打包、更新版號、撰寫 CHANGELOG）全手動，不易維護且容易產生疏漏，比如更新版號時忘記打包最新版本的程式碼

> 上述問題中，我認為需要優先改善的地方為：供使用端下載的打包文件應該與原始碼分開託管。

一般來說，我們使用 npm install 指令下載的套件都是託管在公開的 npm registry 中。然而，免費方案下的 npm registry 只能託管開源的套件，這樣的公開託管方案對於公司內部的私人 npm 套件來說並不適用。

經過一番搜尋，我發現 Gitlab 提供了一個非常方便的解決方案——`Gitlab Package Registry`，它可以像 npm registry 一樣運作，但同時保留了私人託管的特性。經過嘗試，我發現這個工具非常強大且易於使用。本篇文章將記錄如何將私人用的 npm library 發布到 Gitlab，以及如何從 Gitlab 下載 npm library。


## **Gitlab package registry 簡介**

### **Package Registry 是什麼？**

首先，我們來談談 **package registry** 到底是什麼。簡單來說，package registry 是一個可以儲存和管理軟體套件的地方。我們可以把它想像成一個專門放軟體套件的倉庫，讓開發者們可以方便地分享和重複使用這些程式碼與模組。

Gitlab 的 Package Registry 是 Gitlab 提供的一個功能，讓我們可以在 Gitlab 的平台上管理自己的 npm packages。如此不僅可以把程式碼放在 Gitlab 上，還可以把 npm 套件一同託管於 Gitlab，這對於在使用 Gitlab 的公司或私人開發團隊來說非常方便。

### **Gitlab 如何作為 npm package 的容器？**

在介紹如何發布 library 到 Gitlab 之前，讓我們來看看 Gitlab 如何作為 npm package 的容器。

首先，每個 Gitlab 專案（project）都有自己的 Package Registry，也就是說，每個 Gitlab 專案都擁有自己獨立的 npm packages 存儲空間用來存儲和管理多個 npm packages。而每個專案的 Package Registry 都有一個類似地址的唯一 URL，這個 URL 通常是以專案 ID 為基礎構建的。比如說，我們的專案 ID 是 123，那麼 Package Registry URL 可能看起來像這樣：

```json
https://gitlab.com/api/v4/projects/123/packages/npm/
```

這個 URL 主要是用來告訴 npm 客戶端從哪裡下載或上傳套件。

接著，我們來談談 npm 如何知道哪些套件要從上述的 URL 上下載下來。

在 npm 中，Scope（命名空間）是用來組織套件的一種方式，它允許開發者將套件歸類到特定的組織或團隊之下，從而避免命名衝突。例如，`@my-org/my-package` 表示這個套件屬於 `@my-org` 組織。

若我們將 GitLab 作為託管 npm 套件的 package registry，package.json 中，套件的名稱需要遵循 Gitlab 的命名規則來命名：

```json
"name": "@scope/package-name"
```

:::tip
**@scope** 的值應該是**託管套件的專案根目錄**，而非套件原始碼的專案根目錄，且應使用小寫字母。

舉例來說，如果將 npm 套件託管於：

- http://\<your_domain_name>/**\<instance_name>**/\<group_name>/\<project_name>
    - @scope 的值應為 `@<instance_name>`
- http://\<your_domain_name>/**\<group_name>**/\<project_name>
    - @scope 的值應為 `@<group_name>`
- http://\<your_domain_name>/**\<user_name>**/\<project_name>
    - @scope 的值應為 `@<user_name>`

**package-name** 則可以任意命名
:::

當使用端在專案底下新增新增一個 `.npmrc` 檔案，並加入以下內容後：

```bash
# Set URL for your scoped packages.
# For example package with name `@foo/bar` will use this URL for download
@<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/
```

npm 在下載名稱以 `@<scrop>` 開頭的套件時，就會前往後面的 URL 下載

### **Npm registry 身份驗證**

在使用 Gitlab Package Registry 發布或下載 npm 套件之前，我們需要先進行身份驗證。身份驗證的具體方式取決於所使用的套件管理器，以本專案使用的 npm 為例，在發布套件時 npm 會透過 npm config / .npmrc 與 package.json 的資訊進行身分驗證；下載私人套件時，npm 也會透過 npm config / .npmrc 進行身分驗證。

對於大多數的套件類型，Gitlab 提供了以下幾種驗證方法：

- [Personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html): 以使用者權限進行身份驗證，適用於個人
- [Project deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html): 為特定 project 創建的 token，適用於多個使用者，提供專案範圍內所有 packages 的訪問權限。
- [Group deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html): 為特定群組創建的 token，適用於多個使用者，可以用來存取該群組下的所有 packages。
- [Job token](https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html):  適用於在 CI/CD pipeline 中發佈 package，如果要通過 CI/CD pipelines 發佈 npm 套件，這是唯一可以使用的選擇。

:::danger
如果在專案設置中關閉了 “Package registry” 功能，會收到 403 Forbidden
:::

### **Gitlab package registry 權限**

在 Gitlab 中，不同的專案角色對 Package Registry 的權限也有所不同，以下表格列出不同權限的最低角色要求：

| Project visibility | 操作                  | 最低角色要求 |
| ------------------ | --------------------- | ------------ |
| 公開 (Public)      | 檢視 package registry | 無           |
|                    | 發佈 package          | Developer    |
|                    | 拉取 package          | 無           |
| 內部 (Internal)    | 檢視 package registry | Guest        |
|                    | 發佈 package          | Developer    |
|                    | 拉取 package          | Guest        |
| 私有 (Private)     | 檢視 package registry | Reporter     |
|                    | 發佈 package          | Developer    |
|                    | 拉取 package          | Reporter     |

:::info
Gitlab 也允許設定不論 **Project visibility** 與**最低角色要求**使所有人都具有 pull package 的權限：
1. **Settings > General**.
2. \> **Visibility, project features, permissions**.
3. → **Allow anyone to pull from Package Registry**
4. → **Save changes**.
:::


<br/>


## **準備 GitLab Package Registry**

具備 Gitlab package registry 的基本知識後，我們就可以開始嘗試來發布一個 npm library 到 Gitlab 上。首先我們先來處理 Gitlab 的部分。

### **建立 Gitlab Project**

在這篇範例中，我在我個人的專案目錄下建立了一個新的 Gitlab 專案，專案 ID 為 691

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665264/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/gitlab_project_kd7zeb.png)


### **設定 Deploy token**

接著前往 Setting > Repository > Deploy tokens 設定 [Project deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html)。點擊 Create deploy 後會得到一組 Token，記得要把它記下來。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/deploy_token_tzkyrw.png)


<br/>


## **發布本地端的 npm 專案**

準備好 Gitlab 後，接著就可以準備將本地端的 npm library 發布到 Gitlab 上了。在這篇教學範例中，我在根目錄的 `index.js` 下創建一個簡單的 function 並且匯出它，用來簡單模擬要發布的 library：

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```


### **準備 .npmrc**

.npmrc 在發布套件時的作用有兩個：

1. 指定以 **@\<scope>** 為套件命名開頭的套件要發布到的 package registry 位置
2. 發布套件到指定 package registry url 時，提供 authToken 進行身份驗證

在套件專案底下新增一個 . npmrc 檔，並加入以下內容：

```bash
# Set URL for your scoped packages.
# For example package with name `@foo/bar` will use this URL for download
@<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/

# Add the token for the scoped packages URL. Replace <your_project_id>
# with the project where your package is located.
//<your domain name>/api/v4/projects/<project id>/packages/npm/:_authToken=<your token>
```

- **@\<scope>**: 由於這個 Gitlab 專案建立於我的個人目錄專案底下，因此在此處為我的 gitlab user-name： @bosh-kuo
- **\<your domain name>**: 為公司的 gitlab domain
- **\<project id>**: 691
- **\<your token>**: 即剛剛創建的 project deploy token

### **準備 package.json**

在發布套件前，，需要先確保以下幾個選項是否正確設定，這些選項將直接影響套件的發布和使用。

- **name**: 套件名稱，須遵循上述的 Gitlab 命名規則
- **version**: 套件的版本號，每次發布新版本時，記得更新這個版本號。
- **publishConfig**: 這個選項用來配置發布時的一些參數，特別是 registry 的 URL。我們需要將這個設定為 Gitlab 的 Package Registry URL。
- **files**: 這個選項用來指定哪些文件應該包含在發布的套件中。通常我們會包括 `lib` 或 `dist` 目錄（打包後檔案的目標目錄），這取決於我們的專案結構。
- **main**: 這個選項指定了套件的主入口文件。當其他人安裝並使用你的套件時，這個文件將作為入口。
- **module**: 如果套件是用 ES module 編寫的，可以使用這個選項來指定 ES module 的入口文件。
- **types**: 如果專案使用 TypeScript，這個選項用來指定 TypeScript 的定義文件。這樣用戶在使用套件時，可以獲得完整的型別支援。

本篇範例中的 package.json 如下：

```json
{
  "name": "@bosh.kuo/published-package",
  "version": "0.0.0",
  "publishConfig": {
    "registry": "https://gitlab.dimension8ai.com/api/v4/projects/691/packages/npm/"
  },
  "main": "index.js",
  "files": [
    "index.js"
  ],
  ...
}
```

### **發布**

一切準備就緒後就可以透過以下指令發布 npm 套件

```bash
# for npm user
npm publish

# for yarn user
yarn publish
```

發布完成後就可以在 **Gitlab** **Package Registry** 中看到剛剛發佈的套件了

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/npm_package_eypqeo.png)

> 圖上顯示 @bosh-kuo/published-package1 與 @bosh-kuo/published-package2 為後來嘗試用 monorepo 管理多個 npm library 時發布的，並非本篇文章範例中發布的套件，僅用於示例。


<br/>


## **使用 GitLab Package Registry 上的 npm 套件**

完成了上述發布流程後，我們可以在本地端建立一個使用端專案，嘗試把剛剛發佈的套件下載下來使用。

1. 建立使用端測試專案
    
    ```bash
    mkdir consumer
    cd consumer
    yarn init -y
    ```
    
2. Npm registry 身份驗證
    
    ```bash
    # Set URL for your scoped packages.
    # For example package with name `@foo/bar` will use this URL for download
    @<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/
    
    # Add the token for the scoped packages URL. Replace <your_project_id>
    # with the project where your package is located.
    //<your domain name>/api/v4/projects/<project id>/packages/npm/:_authToken=<your token>
    ```
    
    同上章節的 .npmrc 檔。
    
    此外，也可以透過 npm config set 指令的方式來設定：
    
    ```bash
    npm config set @<scope>:registry <your domain name>/api/v4/packages/<project id>/npm/
    
    npm config set -- '//<your domain name>/api/v4/packages/npm/:_authToken' "<your_token>"
    ```
    
3. 下載專案
    
    ```json
    yarn add @bosh.kuo/published-package
    ```
    
    若下載成功的話，就可以在 `node_modules` 底下看到套件，其包含的目錄與檔案會與前章節中設定於 `package.json` 內的 `files` 一致。
    
    ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/package_in_node_modules_qa60do.png)

4. 測試套件
    
    ```jsx
    // index.js
    const sum = require("@bosh.kuo/published-package");
    console.log(sum(10, 20));
    ```
    
    如果所有環節都沒有出錯，應該會看到 `30` 的輸出。

:::tip
如果你看到正確的輸出結果，那麼恭喜你！你的套件已成功發布並可以正常使用。這表示你已經成功地將一個私人 npm 套件發布到了 Gitlab Package Registry，並成功地下載並使用了它。
:::

<br/>


## **Reference**

- [**Package registry**](https://docs.gitlab.com/ee/user/packages/package_registry/)
- [**npm packages in the package registry**](https://docs.gitlab.com/ee/user/packages/npm_registry/#404-not-found-errors-are-happening-on-npm-install-or-yarn)
- [**手把手將vue component打包成套件，丟到gitlab package registry-內網篇**](https://hackmd.io/@RdUg6kDRTcKHmb2WGCucdA/HyxdsQo-7q)
- [**[教學] 建立與使用 GitLab 私人 npm package registry**](https://xenby.com/b/288-%E6%95%99%E5%AD%B8-%E5%BB%BA%E7%AB%8B%E8%88%87%E4%BD%BF%E7%94%A8-gitlab-%E7%A7%81%E4%BA%BA-npm-package-registry)
- [**@npm - package.json**](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [**Publish private NPM package to Gitlab**](https://www.youtube.com/watch?v=Yn0N8_Gfcyw&t=540s&ab_channel=JackDo)
- [**Publishing Private NPM Package to Gitlab | Using Manual Command & Gitlab Action | SmrutiFy**](https://www.youtube.com/watch?v=jIA_ksPKR9w&t=235s&ab_channel=SmrutiFy)