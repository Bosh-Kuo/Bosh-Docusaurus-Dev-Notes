---
title: iTerm2 技巧大公開：提高效率的快捷鍵
sidebar_label: "[Terminal] iTerm2 常用快捷鍵大全"
description: 本篇文章介紹 iTerm2 中常用的快捷鍵，以及許多好用但一般人很少用的快捷鍵
last_update:
  date: 2023-04-22
keywords:
  - 開發工具
  - Terminal
  - iTerm2
tags:
  - 開發工具
  - Terminal
---

**iTerm2** 是 macOS 上的一個 Terminal 模擬器，它具有許多原生 Terminal 所沒有的特色功能，例如多分頁、分屏、命令自動完成、內置的 regex 支援等等，並且也支援了各種語言所使用的 Shell。除此之外，**iTerm2** 還有許多方便的快捷鍵可以用來提高操作效率，例如在分頁之間快速切換、在命令行中快速移動游標、快速查看歷史命令等等。  在操作 **iTerm2** 的過程中，我經常會想要進行一些操作以提高效率，像是分屏、分標籤、切換標籤、查看歷史紀錄等等，但由於我之前都沒有好好的熟悉 **iTerm2** 的快捷鍵，所以常常最後還是直接用滑鼠點擊或是直接放棄操作。因此，我決定一次查好所有常用的 **iTerm2** 快捷鍵和功能，幫助自己更有效率地使用 **iTerm2**。


<br/>


## **標籤(Tabs)**

| 功能                 | 指令                      |
| -------------------- | ------------------------- |
| 新增標籤             | ⌘ + T                     |
| 切換標籤             | ⌘ + 數字/左右鍵           |
| 關閉標籤             | ⌘ + W                     |
| 關閉標籤內的所有分屏 | ⌘ + option + W            |
| 改變標籤排列順序     | ⌘ + Shift + 左右鍵        |
| 改變標籤標題         | 滑鼠點擊 Tab 標籤即可設定 |



## **分屏**

| 功能     | 指令                   |
| -------- | ---------------------- |
| 垂直分屏 | ⌘ + D                  |
| 水平分屏 | ⌘ + Shift + D          |
| 切換分屏 | ⌘ + Option + 左/右箭頭 |
| 關閉分屏 | ⌘ + W                  |


<br/>


## **其他好用功能**

| 功能                           | 指令                             |
| ------------------------------ | -------------------------------- |
| 切換全屏                       | ⌘ + Enter                        |
| 查找                           | ⌘ + F                            |
| 查看歷史命令                   | ⌘ + ;                            |
| 查看歷史剪貼簿                 | ⌘ + Shift + H                    |
| 歷史命令回放                   | ⌘ + Option + B                   |
| 打開偏好設定                   | ⌘ + ,                            |
| 開啟文件/資料夾/url連結        | ⌘ + 點擊                         |
| 光標移動到下一個單詞字首       | ESC + F (建議改為 Option + 右鍵) |
| 光標移動到上一個單詞字首       | ESC + B (建議改為 Option + 左鍵) |
| 刪除光標前一個單詞             | Ctrl + W                         |
| 刪除光標後的所有文本，直到行尾 | Ctrl + K                         |
| 刪除當前行文本，無論光標位置   | Ctrl + U                         |
| 將光標移動到行首               | Ctrl + A                         |
| 將光標移動到行尾               | Ctrl + E                         |
| 清除畫面(可取代 clear)         | Ctrl + L                         |


<br/>


## **設置光標案單詞快速移動快捷鍵**
用習慣 Linux terminal 的人可能會很習慣用 `option + ←` 和 `option + →` 在指令中移動光標到前後一個單詞，但 iTerm 預設並沒以這個功能，所以只好自己設定：

1. 打開 ITerm2 的 Preferences (`⌘ + ,`)
2. 點擊 Profiles，選擇想要設定的 Profile >> 點選 Keys >> 點選 Key Mappings
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1682155913/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/iTerm2%20%E5%B8%B8%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%A4%A7%E5%85%A8/preferences_kbczv0.png)

3. 找到 `option + ←` 和 `option + →` 兩組快捷鍵，雙擊設定新的 Key mapping: 
    - `option + ←` : Action: Send Escape Sequence,  Esc+: **f**
    - `option + →` : Action: Send Escape Sequence,  Esc+: **b**
  
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1682155913/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/iTerm2%20%E5%B8%B8%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%A4%A7%E5%85%A8/option_right_o85ux2.png)

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1682155913/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/iTerm2%20%E5%B8%B8%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%A4%A7%E5%85%A8/option_left_rd4hpc.png)
<br/>


## **Reference**
- **[iTerm2](https://iterm2.com/index.html)**
- **[[iTerm2] 最佳 mac 終端機替代方案 常用設定和常用操作](https://www.onejar99.com/iterm2-mac-terminal-usage/#4)**
- **[iTerm2牛逼的功能！！！！](https://www.twblogs.net/a/5c53eb8fbd9eee06ee217cab)**
- **[MAC iterm2 常用快捷键大全](https://segmentfault.com/a/1190000019630073)**
- **[iTerm2 快捷键大全](https://cnbin.github.io/blog/2015/06/20/iterm2-kuai-jie-jian-da-quan/)**
- **[Mac下iTerm2光标按照单词快速移动设置](https://blog.csdn.net/skyyws/article/details/78480132)**
  
