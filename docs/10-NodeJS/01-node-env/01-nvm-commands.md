---
title: "NVM 常用指令筆記"
sidebar_label: "NVM 常用指令"
description: 本文章介紹 NVM 指令、.nvmrc 設定，以及如何切換與安裝 Node.js 版本，並解決開發環境中的版本管理問題。
last_update:
  date: 2026-03-09
keywords: [nvm, nodejs]
tags: [node-env]
---

NVM (Node Version Manager) 是一個可以輕鬆管理多個 Node.js 版本的實用工具。這篇筆記整理了平常開發時最常使用的一些 NVM 指令，以及如何透過 `.nvmrc` 檔案來維護專案指定的專屬版本。

## **NVM 常用指令**

| 功能說明                 | NVM 指令                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| **列出已安裝的版本**     | `nvm ls` 或 `nvm list`                                             |
| **列出遠端可安裝的版本** | `nvm ls-remote`                                                    |
| **安裝指定版本**         | `nvm install <version>` (e.g. `nvm install 18.17.0`)               |
| **安裝最新的 LTS 版本**  | `nvm install --lts`                                                |
| **切換至指定版本**       | `nvm use <version>`                                                |
| **設定預設版本**         | `nvm alias default <version>`                                      |
| **查看當下使用的版本**   | `nvm current`                                                      |
| **特定版本執行程式**     | `nvm run <version> <app.js>` 或 `nvm exec <version> node <app.js>` |
| **卸載指定版本**         | `nvm uninstall <version>`                                          |

### **使用特定版本執行腳本**
有時我們不想全域切換環境版本，只是想「單次」用某個特定的 Node 版本來執行腳本，可以使用：
```bash
nvm run <version> app.js
# 或是
nvm exec <version> node app.js
```
:::warning
這個指令 **不會** 自動幫你下載該版本的 Node.js。你必須先使用 `nvm install <version>` 下載安裝過該版本，指令才能順利執行。
:::

---

## **升級 Node.js 並轉移全域套件**
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

## **`.nvmrc` 檔案**

方便團隊共同開發與切換專案，我們可以在專案內引入 `.nvmrc` 檔案，讓所有人都能快速切換到專案指定的統一 Node.js 版本，避免版本不一致造成編譯失敗或語法相容性問題。

### **設定與使用流程**
1. 每當開發者進入這個專案目錄下時，只需要在終端機輸入：
   ```bash
   nvm use
   ```
   NVM 就會自動讀取 `.nvmrc` 內的版本並切換過去！
2. 如果你在該目錄想要快速地建立含有當下 Node.js 版本的 `.nvmrc` 檔案的話，可以使用此指令：
   ```bash
   node -v > .nvmrc
   ```

### **支援的版本格式**
`.nvmrc` 原則上就是一個普通的純文字檔案，裡面記錄指定的 Node 版本號。除了寫具體版本 `18.17.0`，也可以寫以下寫法：
- `18` : 以本地當下安裝的最新的 18 版為主
- `lts/*` : 以本地當前安裝的最新的 LTS (長期維護版) 為主
- `node` : 以最新的 Node 版本為主

:::note[大版號匹配行為]
如果在 `.nvmrc` 內只寫入 `18`，那麼開發協作時，不同團隊成員執行 `nvm use` 時，NVM 都會自動抓取該成員「本地端已安裝」的 18 系列中最高的那個版本。

例如我本地有 `18.16.0` 與 `18.17.0`，執行 `nvm use` 就會自動對應到 `18.17.0`。
:::

### **如果本地尚未安裝該版本？**
如果使用 `nvm use` 時，NVM 發現本地端並沒有安裝 `.nvmrc` 所指定的版本，終端機會拋出類似以下的提示訊息：
```bash
N/A: version "18.17.0 -> N/A" is not yet installed.
You need to run "nvm install 18.17.0" to install it before using it.
```
這時候我們只需要直接執行 `nvm install`（不用加任何版本號），NVM 就會自動讀取 `.nvmrc` 裡面的版本號，並直接幫我們完成下載與安裝該版本！

<br/>

## **Reference**

- [**nvm-sh/nvm**](https://github.com/nvm-sh/nvm)
