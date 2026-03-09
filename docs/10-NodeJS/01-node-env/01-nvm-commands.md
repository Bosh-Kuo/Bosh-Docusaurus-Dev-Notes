---
title: "NVM 常用指令筆記"
sidebar_label: "NVM 常用指令"
description: "因為專案間需要切換不同 Node 版本而撰寫這篇 NVM 常用指令與 .nvmrc 設定筆記"
tags:
  - nvm
  - nodejs
---

NVM (Node Version Manager) 是一個可以輕鬆管理多個 Node.js 版本的實用工具。這篇筆記整理了平常開發時最常使用的一些 NVM 指令，以及如何透過 `.nvmrc` 檔案來維護專案指定的專屬版本。

## NVM 常用指令

| 功能說明                 | NVM 指令                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| **列出已安裝的版本**     | `nvm ls` 或 `nvm list`                                             |
| **列出遠端可安裝的版本** | `nvm ls-remote`                                                    |
| **安裝指定版本**         | `nvm install <version>` (例如: `nvm install 18.17.0`)              |
| **切換至指定版本**       | `nvm use <version>`                                                |
| **設定預設版本**         | `nvm alias default <version>`                                      |
| **查看當下使用的版本**   | `nvm current`                                                      |
| **特定版本執行程式**     | `nvm run <version> <app.js>` 或 `nvm exec <version> node <app.js>` |
| **卸載指定版本**         | `nvm uninstall <version>`                                          |

### 使用特定版本執行腳本
有時我們不想全域切換環境版本，只是想「單次」用某個特定的 Node 版本來執行腳本，可以使用：
```bash
nvm run <version> app.js
# 或是
nvm exec <version> node app.js
```
> [!WARNING]
> 注意：這個指令 **不會** 自動幫你下載該版本的 Node.js。你必須先使用 `nvm install <version>` 下載安裝過該版本，指令才能順利執行。

### 關於「只指定大版號」的行為
如果你在安裝多個同個大版號的 Node (例如: `18.16.0` 與 `18.17.0`) 後，於終端機執行 `nvm use 18` 或是 `nvm alias default 18` 時，NVM 會怎麼做？

答：**NVM 會自動匹配你「本地已經安裝」的該大版號下，最新 (最高) 的那個小版本**。例如在上述情況下，只指定 `18` 就會自動對應到 `18.17.0`。同理，在 `.nvmrc` 內只要寫 `18`，團隊其他成員在執行 `nvm use` 時，也會自動抓取他們本地安裝好的最新 18 版。

---

## 升級 Node.js 並轉移全域套件
當有新的 Node.js 版本釋出時，我們通常會想要將舊版本的全域套件 (Global packages) 一併轉移到新版本，並把新版本設為預設。以下是完整的轉移流程：

1. **安裝新版本並從舊版本轉移套件**
   使用 `--reinstall-packages-from` 參數，NVM 會在安裝新版本後，將指定的舊版本內「所有全域套件」重新安裝至新版本內：
   ```bash
   nvm install <new_version> --reinstall-packages-from=<old_version>
   ```
   *例如：`nvm install 20 --reinstall-packages-from=18`*

2. **將新版本設為預設版本**
   ```bash
   nvm alias default <new_version>
   ```

3. **刪除不再使用的舊版本**
   確認新版本一切運作正常，且全域套件確實也都順利移轉後，就可以把舊版清掉以釋放空間：
   ```bash
   nvm uninstall <old_version>
   ```

---

## `.nvmrc` 檔案

方便團隊共同開發與切換專案，我們可以在專案內引入 `.nvmrc` 檔案，讓所有人都能快速切換到專案指定的統一 Node.js 版本，避免版本不一致造成編譯失敗或語法相容性問題。

### 設定與使用流程
1. 每當開發者進入這個專案目錄下時，只需要在終端機輸入：
   ```bash
   nvm use
   ```
   NVM 就會自動讀取 `.nvmrc` 內的版本並切換過去！
2. 如果你在該目錄想要快速地建立含有當下 Node.js 版本的 `.nvmrc` 檔案的話，可以使用此指令：
   ```bash
   node -v > .nvmrc
   ```

### 支援的版本格式
`.nvmrc` 原則上就是一個普通的純文字檔案，裡面記錄指定的 Node 版本號。除了寫具體版本 `18.17.0`，也可以寫以下寫法：
- `18` : 以本地當下安裝的最新的 18 版為主 (如上述)
- `lts/*` : 以本地當前安裝的最新的 LTS (長期維護版) 為主
- `node` : 以最新的 Node 版本為主

只要在具有該檔案的路徑下執行 `nvm use`，NVM 便會去找對應的版本做自動切換。
