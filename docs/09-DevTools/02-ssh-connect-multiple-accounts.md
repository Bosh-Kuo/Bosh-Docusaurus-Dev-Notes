---
title: 同一台電腦設定不同 SSH keys 連線多個 Github/GitLab 帳號
sidebar_label: "[SSH] 以不同 SSH keys 連線多個 Github/GitLab 帳號"
description: 本篇文章紀錄在同一台電腦上如何設置 SSH Key 連線多個Github/GitLab 帳號
last_update:
  date: 2023-10-15
keywords:
  - 開發工具
  - SSH
  - Github
  - GitLab
tags:
  - 開發工具
  - SSH
---

最近在收到了公司配的新電腦，由於新電腦不管是蓄電還是性能都比我自己的舊筆電好滿多的，因此最近去咖啡廳都比較喜歡帶公司的電腦出門。這台電腦目前已經設置好連線公司 GitLab 的 SSH Key，但最近越來越常用這台電腦後開始需要用這台電腦連上自己的 github 帳號來操作自己的 repo，之前我還沒有遇過一台電腦要在兩個以上的 Github/GitLab 帳號開發的經驗，因此查了一些文章並且記錄我做的設定。

:::tip
關於使用 Secure Shell Protocol (SSH) 連線 Github 的相關知識，我非常建議去閱讀 Github 官方的 **[Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)** 系列文章，我的設定與資料來源主要也是參考此系列文，GitLab 用戶則可以參考這篇 **[Use SSH keys to communicate with GitLab](https://docs.gitlab.com/ee/user/ssh.html)**
:::

## **關於 SSH**

[SSH（Secure Shell Protocol）](https://en.wikipedia.org/wiki/Secure_Shell)是一種加密的網絡通信協議，它可讓我們的個人電腦安全地連接到遠程伺服器，並將訊息加密過後再傳送，確保只有知道解密規則的人才可以取得訊息。我們的 Github/Gitlab repo 實際上就是遠程伺服器上的一個資料夾，SSH 在這裡的作用就是幫我們的電腦與 Github/Gitlab 伺服器之間安全地建立通信連接，其中包括了**身份驗證、安全地資料傳輸、訪問權限控制**等工作。使用 SSH 金鑰，我們每次連線 Github/GitLab 以及推送 commit 時就不需重複提供用戶名稱和 token，簡單來說， SSH 對於個人電腦和 Github/GitLab 帳戶來說是一種安全且方便的和**認證**與**資料傳輸**方式。



### **SSH 在 Github/GitLab 如何運作？**
關於 SSH 的基本工作原理以及公鑰、私鑰的用途在本篇就不多做贅述。那麽我們是怎麼透過 ssh 與 Github/GitLab 連線驗證身份與加密訊息的呢？ SSH 有兩種身份驗證的方式，一種是**密碼驗證**，一種是**金鑰驗證**。Github 與 GitLab 使用的都是**金鑰驗證**。

**金鑰驗證**的工作原理很簡單，就是讓用戶在電腦上產生兩把鑰匙，一把是只有自己才知道的`私鑰`，另一把是外界(要連線的伺服器)的`公鑰`。首先讓用戶將`公鑰`上傳到 Github/GitLab 主機上。當我們要與伺服器端連線時，會依照下列步驟完成 ssh 身份驗證並建立連線，以下以客戶端代稱使用者，伺服器端代稱 Github/GitLab 主機：

1. 客戶端向伺服器端提出連線登入請求
2. 伺服器端向客戶端發送一段隨機字符串
3. 客戶端用自己的密鑰將隨機字符串加密成數位簽章
4. 伺服器端拿客戶存放在伺服器端的公鑰檢驗數位簽章是否正確，如果簽章正確，伺服器就認為使用者登入成功。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1697385499/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/%E5%90%8C%E4%B8%80%E5%8F%B0%E9%9B%BB%E8%85%A6%E8%A8%AD%E5%AE%9A%E4%B8%8D%E5%90%8C%20SSH%20keys/Github-SSH_na3whz.png)


## **產生 SSH Keys**

### **確認已存在的 SSH Keys**

如果我們的電腦中有可用的 SSH 密鑰，可以直接使用該密鑰設置 Github/GitLab 的 SSH 連線，但通常是建議替不同的連線建立不同的 SSH Keys，這麼做會比較方便管理自己的連線，當我日後決定不再使用 SSH 連線自己的 Github 帳戶，我只需要刪除用來連線 Github 的 SSH key 就可以了，同時也可以避免刪除某個密鑰造成非預期的連線失效。

- 查看 `.ssh` 資料夾中既存的 SSH Keys

```bash
# Lists the files in your .ssh directory, if they exist
ls -al ~/.ssh
```

- 默認情況下，GitHub 支持的公鑰文件名是以下之一
  - _id_rsa.pub_
  - _id_ecdsa.pub_
  - _id_ed25519.pub_
- 默認情況下，GitLab 支持的公鑰文件名是以下之一
  - _id_rsa.pub_
  - id_dsa.pub
  - _id_ecdsa.pub_
  - _id_ed25519.pub_
  - _id_ed25519_sk.pub_
  - _id_ecdsa_sk.pub_

### **分別產生個人帳戶與公司的 SSH Keys**

貼上下面的指令，替換為自己的 GitHub/GitLab 電子郵件地址，這會創建一個新的 SSH 密鑰，並且使用提供的電子郵件作為標籤。

```bash
$ ssh-keygen -t ed25519 -C "your_email@example.com"
```

接著，命令行會詢問我們要把新產生的 SSH Key pair 放在哪裡，如果直接按 Enter 的話它會把原本存在的 SSH Key 覆蓋掉，因此一定要填寫，建議填寫絕對路徑。取檔名時可以取方便辨識的名稱，像是： `id_ed25519_personal` / `id_ed25519_company`

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/XXX/.ssh/id_ed25519): /Users/XXX/.ssh/id_ed25519_personal
```

接著命令行會繼續詢問這組 Key 需不需要密碼，如果之後連線不想打密碼的話直接按 Enter 留空就可以了

```bash
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

產生成功後就會出現這樣的訊息，這麼一來 SSH Key 就算產生成功了：

```bash
Your identification has been saved in /Users/XXX/.ssh/id_ed25519_personal
Your public key has been saved in /Users/XXX/.ssh/id_ed25519_personal.pub
The key fingerprint is:
...
```

## **SSH 設定**

### **添加 SSH 公鑰到 Github/GitLab 帳戶設定**

首先我們要先把剛剛產生的 SSH 公鑰添加到 Github/GitLab 帳戶 SSH 設定中，`id_ed25519_personal.pub` 就是我剛剛產生用來連線個人 github 的 ssh 公鑰，`id_ed25519_company.pub` 則是我剛剛產生用來連線公司 gitlab 的 ssh 公鑰

```bash
# 複製用於連線個人 github 的公鑰到 github SSH keys 設定區
cat ~/.ssh/id_ed25519_personal.pub

# 複製用於連線公司 gitlab 的公鑰到 gitlab SSH keys 設定區
cat ~/.ssh/id_ed25519_company.pub
```
<img src= "https://docs.github.com/assets/cb-65929/mw-1440/images/help/settings/userbar-account-settings.webp" width="250"/>



### **設定 `~/.ssh/config`**

要讓 SSH 使用非預設名稱的 SSH 私鑰文件，我們需要在 SSH 配置文件(**~/.ssh/config**) 中明確指定要使用的私鑰文件的路徑，以及不同的連線主機要用的連線設定

- 首先查看 `~/.ssh` 有沒有一個 `config` 檔案，如果沒有就自己建立一個空的檔案。接著分別設置公司 GitLab 帳戶與個人 Github 帳戶連線的設定:

```bash
Host gitlab.company
HostName <公司主機ip>
User git
Port <port號>
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_ed25519_company

Host github.personal
HostName github.com
User git
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_ed25519_personal
```

- **選項解釋**

| Host                     | 連線至遠端的別稱(可以取自己喜歡的名稱)                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| HostName                 | 遠端的 Domain 或 IP                                                                                 |
| Port                     | 遠端的 SSH 連接埠(為預設 22 的話可以不填)                                                           |
| User                     | SSH 連接的用戶名，若用 git 且沒有設定 IdentityFile ，則 git 會使用默認名稱為 id_rsa 的 SSH 私鑰文件 |
| PreferredAuthentications | 偏好使用的驗證(這邊的值都為 publickey)                                                              |
| IdentityFile             | 指定使用的私鑰位置(可為相對或絕對位置，但建議使用絕對位置)                                          |

### **將 Key 加入 `ssh-agent` 控管**

`ssh-agent` 是一個控制 SSH 金鑰的代理程式。當連線到 SSH 伺服器時，伺服器會要求我們提供與帳戶相關聯的 SSH 金鑰。如果將 SSH 金鑰加入 ssh-agent 中，ssh-agent 會在我們第一次使用 SSH 金鑰時，要求輸入密碼，然後將 SSH 金鑰保留在記憶體中。這樣，當我們連線到其他 SSH 伺服器時，ssh-agent 會自動提供相關的 SSH 金鑰，而無需再次輸入密碼。

但由於我已經手動配置配置 **`~/.ssh/config`** 了因此即便沒有將 SSH Keys 加入 ssh-agent ，不同的 SSH 連線仍然可以自動找到相關的私鑰來驗證，因此我就沒有設置 ssh-agent 了。

## **測試 SSH 連線**

輸入測試連線的指令:

```bash
ssh -T git@<Host>
```

Host 就是我們在 ~/.ssh/config 中設定的 Host，像我的就是 `gitlab.company` 和`github.personal`；如果想看更多資訊可以用 `ssh -vT` :

```bash
ssh -T git@gitlab.company
ssh -T git@github.personal

```

如果是第一次輸入的話可能會出現下列訊息，填寫 yes 就可以了

```bash
The authenticity of host 'github.com (IP ADDRESS)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
Are you sure you want to continue connecting (yes/no)?
```

成功的話應該會跳出下面的訊息

```bash
Hi [Username]! You've successfully authenticated, but GitHub does not provide shell access.
```

## **Clone repo 以及修改 Git config**

### **Clone with SSH 指令**

做好以上設定以及通過連線測試後，我們應該就有權限可以 clone 私人(private) repo 了，由於我們 ssh config 設置了不同的 Host，因此 clone 指令也會不一樣。舉例來說，我現在要 clone 我個人 github 的一個私人專案 `<private-repo>`，使用在 github 上複製下來的指令來 clone 應該會長這樣。

```bash
git clone git@github.com:<Github User name>/private-repo.git
```

但會發現下了這個指令後還是跳出了如下驗證錯誤訊息： 
```bash
git@github.com: Permission denied (publickey).
```
 原因是因為 **git@** 代表以 **git** 作為 SSH 連線的使用者名稱， git 會默認去找名稱為 `id_rsa` 的 SSH 私鑰文件來認證。我們現在應該把 **git@** 後面的 `github.com` 改成 `github.personal`，也就是 `~/.ssh/config` 中用來連自己 github repo 的 Host。

```bash
git clone git@github.personal:<Github User name>/private-repo.git
```

又因為我們已經在 `~/.ssh/config` 中設定了連線用的 User ，因此我們也可以省略掉 **git@**

```bash
git clone github.personal:<Github User name>/private-repo.git
```

### **Add remote repository**

如果要把一個新的專案推到公司的 gitlab，需要先在 gitlab 上建立一個新的 repository，接著在本地 repository 設定遠端 repository。同理，我們在使用 `git remote add` 指令時也要把原本的 domain 換成 `gitlab.company`，如下所示:

```bash
# 原提示指令
# git remote add origin ssh://git@<公司主機ip>:<port>/xxx/ooo.git

# 正確指令
git remote add origin ssh://git@ gitlab.company/xxx/ooo.git
```


### **修改已經 Clone 下來的 repo**

如果在做以上設定前 repo 早已經 clone 下來的話，那麼我們需要修改這個 repo 的 `remote "origin”`，這邊提供兩種方法：

- 打開專案資料夾內  `/.git/config`然後修改  `[remote "origin"]`  下方的 url 中 **git@** 的 **Host：**

```bash
[remote "origin"]
	url = git@github.personal:<Github User name>/private-repo.git
```

- 或是用指令來設定：

```bash
git remote set-url origin git@github.personal:<Github User name>/private-repo.git
```


## **設定根據不同 repo 切換 Git User**

### **方案一：修改 Git config**

由於這台電腦的 Git 已設置了公司用的使用者名稱與信箱作為**全域(global)使用者**資訊，因此如果要在我個人的 Github repo 中使用 git 工作的話，必須先將專案的 Git user 資訊改成我個人用使用者資訊， commit 紀錄中才不會出現不同的使用者。

如果還沒設定過 global user 的話可以透過以下指令設定：
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

編輯自己的 repo 前我們可以先確認一下目前的使用者資訊：

```bash
git config user.name
git config user.email
```
正常狀況下，顯示的會是我們用 `git config --global` 設定的全域使用者資訊。如果我們希望手動將這個 repo 的 git user 資訊改成個人平時在用的 git user，我們可以透過下方指令設定，這個設定只會變更專案內的使用者資訊，不會影響到全域，可以放心設定。

```bash
git config user.name "Your Name(personal github)"
git config user.email "Your email(personal github)"
```


### **方案二：設定 .gitconfig - Conditional Includes 在不同專案自動切換 Git User**
長期以來我都是使用方案一在不同專案間切換 Git user，但這麼做有個缺點，就是我可能會忘記要手動設定 `git config user.name` 與 `git config user.email`，常常已經發了好幾個 commit 甚至已經推送到 github 後才發現怎麼 commit 紀錄多了好多不是我本人的使用者＠＠？於似乎我開始查有沒有簡單的設定方法可以讓我切換到特定的資料夾底下就自動切換 Git user 呢？  
還真的有！這個方法就是設定全局配置文件 `~/.gitconfig` 中的 [conditional includes](https://git-scm.com/docs/git-config#_includes) 配置，它可以針對不同路徑底下的資料夾使用不同的 `.gitconfig` 配置文件。像我平常都把我的個人專案放在 **~/Desktop/Personal** 這個資料夾底下，如此一來我就可以另外創建一個 `.gitconfig-personal` ，設定為我個人的 Git user 資訊，讓所有放在 **~/Desktop/Personal** 這個資料夾底下的 git 專案都 follow `.gitconfig-personal` 的設定。

```bash
# ~/.gitconfig
[user]
	name = Username-in-company
	email = Email-in-company

[includeIf "gitdir:~/Desktop/Personal/"]
	path = ~/Desktop/Personal/.gitconfig-personal
```

```bash
# ~/Desktop/Personal/.gitconfig-personal
[user]
	name = Personal-Username
	email = Personal-Email
```

:::tip
- 若 gitdir 後的路徑開頭不是 `~/`, `./` or `/`，將會自動以 `**/` 匹配，舉例來說: `foo/bar` 會變成 `**/foo/bar` 可以匹配到 `/any/path/to/foo/bar`
- 若 gitdir 後的路徑結尾於 `/`，將會自動加上 `**`，舉例來說: `foo/bar/` 會變成 `foo/bar/**`，也就是說，它會匹配到 "foo/bar" 以及遞迴地匹配到所有 "foo/bar" 內的檔案
:::

## **Reference**

- **[@Github - Checking for existing SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)**
- **[@GitLab - Use SSH keys to communicate with GitLab](https://docs.gitlab.com/ee/user/ssh.html#supported-ssh-key-types)**
- **[一台電腦使用多個 Git 帳號 (SSH 金鑰)](https://hackmd.io/@horus882/HJ2_JgGNO)**
- **[[Git] 多個 SSH Key 與帳號的設定(Mac)](https://dotblogs.com.tw/as15774/2018/04/30/174737)**
- **[在 gitlab 或 github 下使用同一個主機多個帳號用不同 ssh key](https://blog.devcker.com/same-host-use-mutiple-ssh-key/#%E8%A8%AD%E5%AE%9Assh)**
- **[如何在一台電腦使用多個 Git 帳號](https://medium.com/@hyWang/%E5%A6%82%E4%BD%95%E5%9C%A8%E4%B8%80%E5%8F%B0%E9%9B%BB%E8%85%A6%E4%BD%BF%E7%94%A8%E5%A4%9A%E5%80%8Bgit%E5%B8%B3%E8%99%9F-907c8eadbabf)**
- **[Conditional includes](https://git-scm.com/docs/git-config#_conditional_includes)**
- **[如何配置多个提交用户？](https://gb.yekai.net/questions/git-config-user)**