---
title: 同一台電腦設定不同 SSH keys 連線多個 Github/GitLab 帳號
sidebar_label: "[SSH] 以不同 SSH keys 連線多個 Github/GitLab 帳號"
description: 本篇文章紀錄在同一台電腦上如何設置 SSH Key 連線多個Github/GitLab 帳號
last_update:
  date: 2023-04-23
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

[SSH（Secure Shell Protocol）](https://en.wikipedia.org/wiki/Secure_Shell)是一種安全的連接協議，它可讓我們的個人電腦連接並驗證到遠程伺服器。使用 SSH 金鑰，我們每次連線 GitHub 以及編輯 Github 上的 repo 時就不需重複提供用戶名稱和 token，簡單來說 SSH 對於個人電腦和 Github/GitLab 帳戶來說是一種安全且方便的連線和認證方式。

在設置 SSH Keys 時我們需要生成一對新的私有/公共 SSH 金鑰，私鑰可以依需求（下面會提到）添加到 ssh-agent，公共 SSH 金鑰則必須添加到 GitHub/GitLab 帳戶設定中的 SSH Keys 設定當中才可以用這對 SSH Key pair 驗證與連線。當我們的電腦需要連線多個 GitHub/GitLab 帳戶時，我們會需要使用不同的 SSH 金鑰來區分這些帳戶。這樣做主要可以方便管理以避免混淆，因為不同的帳戶通常需要不同的存取權限。

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
# 複製用於連線個人 github 的公鑰
cat ~/.ssh/id_ed25519_personal.pub

# 複製用於連線公司 gitlab 的公鑰
cat ~/.ssh/id_ed25519_company.pub
```

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

做好以上設定以及通過連線測試後我們應該就有權限可以 clone 私人(private) repo 了，由於我們 ssh config 設置了不同的 Host，因此 clone 指令也會不一樣。舉例來說，我現在要 clone 我個人 github 的一個私人專案 `<private-repo>`，使用在 github 上複製下來的指令來 clone 應該會長這樣。

```bash
git clone git@github.com:<Github User name>/private-repo.git
```

但會發現下了這個指令明令行還是跳出了 `git@github.com: Permission denied (publickey).` 原因是因為 **git@** 代表以 **git** 作為 SSH 連線的使用者名稱， git 會默認去找名稱為 `id_rsa` 的 SSH 私鑰文件來認證。我們現在應該把 **git@** 後面的 `github.com` 改成 `github.personal`，也就是 `~/.ssh/config` 中用來連自己 github repo 的 Host。

```bash
git clone git@github.personal:<Github User name>/private-repo.git
```

又因為我們已經在 `~/.ssh/config` 中設定了連線用的 User ，因此我們也可以省略掉 **git@**

```bash
git clone github.personal:<Github User name>/private-repo.git
```

### **修改已經 Clone 下來的 repo**

如果在做以上設定前 repo 早已經 clone 下來的話，那麼我們需要修改這個 repo 的 `remote "origin”`，這邊提供兩種方法：

- 打開專案資料夾內  `/.git/config`然後修改  `[remote "origin"]`  下方的 url 中 **git@** 的 **Host：**

```bash
[remote "origin"]
	url = git@github-personal:<Github User name>/private-repo.git
```

- 或是用指令來設定：

```bash
git remote set-url origin git@github-personal:<Github User name>/private-repo.git
```

### **修改 Git config**

由於這台電腦的 Git 使用者與信箱都是設定用公司的使用者資訊，如果還沒設定過的話記得先設定：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

但當我 clone 自己 github 的專案下來後如果沒有更改 git 使用者資訊，commit 時就會用這台電腦預設的公司 Git 使用者資訊，這樣在 Git log 裡面就會出現一個陌生的使用者，因此若是要編輯自己的 repo 前應該先確認一下目前的使用者資訊：

```bash
git config user.name
git config user.email
```

如果顯示的不是這個 repo 原本的使用者，要記得幫這個專案設定使用者資訊，這個設定只會變更專案內的使用者資訊，不會影響到全域，可以放心設定。

```bash
git config user.name "Your Name(personal github)"
git config user.email "Your email(personal github)"
```

## **Reference**

- **[@Github - Checking for existing SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)**
- **[@GitLab - Use SSH keys to communicate with GitLab](https://docs.gitlab.com/ee/user/ssh.html#supported-ssh-key-types)**
- **[一台電腦使用多個 Git 帳號 (SSH 金鑰)](https://hackmd.io/@horus882/HJ2_JgGNO)**
- **[[Git] 多個 SSH Key 與帳號的設定(Mac)](https://dotblogs.com.tw/as15774/2018/04/30/174737)**
- **[在 gitlab 或 github 下使用同一個主機多個帳號用不同 ssh key](https://blog.devcker.com/same-host-use-mutiple-ssh-key/#%E8%A8%AD%E5%AE%9Assh)**
- **[如何在一台電腦使用多個 Git 帳號](https://medium.com/@hyWang/%E5%A6%82%E4%BD%95%E5%9C%A8%E4%B8%80%E5%8F%B0%E9%9B%BB%E8%85%A6%E4%BD%BF%E7%94%A8%E5%A4%9A%E5%80%8Bgit%E5%B8%B3%E8%99%9F-907c8eadbabf)**
