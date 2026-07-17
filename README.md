<div align="center">
    <img src="./static/img/logo.png" width="100">
    <h2 align="center">Bosh 的技術探索筆記</h2>
    <strong>這是一個使用 Docusaurus 建立的一站式筆記中心。紀錄我在軟體開發路上的技術足跡與學習旅程</strong>
</div>


## 👋 Introduction
本專案包含了 [Bosh 的技術探索筆記](https://notes.boshkuo.com/) 這個網站的所有程式碼、筆記、部落格文章。

這個網站記錄了我在軟體開發旅程中的學習心得與技術探索，內容涵蓋了軟體開發知識、程式語言、框架、常用開發工具。這些筆記紀錄了我在開發過程中遇到的問題解決方案和實作過程。我希望藉由這個公開的技術筆記網站，打造個人的知識管理系統，以筆記驅動自我成長，追蹤技術進步的軌跡，並同時為有相似學習需求的開發者提供幫助。



## ✨ Features

- **筆記** - 收錄各式單一技術主題的筆記
- **部落格** - 收錄非特定技術主題的文章，以及實作紀錄
- **近期專案** - 收錄近期在 GitHub 上更新的專案
- **客製化樣式** - 美觀的客製化主題與自定義元件
- **圖片載入優化** - 使用 [📦 plugin-ideal-image](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image) 優化圖片載入
- **媒體預覽** - 使用自訂 React theme wrappers 提供圖片與 Mermaid 的縮放、拖曳預覽
- **Dark/Light mode** - 支援 Dark/Light 主題模式
- **RWD** - 支援 RWD 響應式網頁
- **Google Analytics** - 支援 Google Analytics
- **Algolia DocSearch** - 支援 Algolia DocSearch
- **Conventional Commmit** - 使用 Conventional Commmit 規範 Commit 訊息
- **CICD** - 使用 Vercel 部署



## 🚀 Installation and Usage

### Clone
```bash
git clone https://github.com/Bosh-Kuo/Bosh-Docusaurus-Dev-Notes.git
```
### Install
```bash
yarn install
```
### Develop
```bash
yarn start
```
### Build
```bash
yarn build
```



## 📊 Project Structure
```
.
├── blog                          # 部落格文章目錄
│   └── blog.md                   # 部落格文章檔案
├── config                        # 設定檔目錄
│   ├── plugins.ts                # Docusaurus 插件設定
│   ├── presets.ts                # Docusaurus 預設設定
│   ├── redirects.ts              # 重定向設定
│   └── themeConfig.ts            # 主題設定
├── docs                          # 筆記文件目錄
│   ├── 01-Docusaurus             # 主題目錄
│   ├── ...                       
│   └── index.md                  # 筆記首頁
├── scripts                       # 腳本目錄
│   └── reindex_files_dirs.sh     # 重新索引檔案和目錄的腳本
├── src                           
│   ├── components                
│   ├── css                       
│   ├── hooks                     
│   └── pages                     # 頁面元件
├── yarn.lock                     
├── static                        # 靜態資源目錄
│   └── img                       
├── babel.config.js               
├── commitlint.config.ts          # Commit 訊息規範設定
├── docusaurus.config.ts          # Docusaurus 主要設定檔
├── package.json                  
├── sidebars.ts                   # 側邊欄設定
├── tsconfig.json                 
├── LICENSE                       # MIT LICENSE
└── README.md                     # 專案說明文件
```



## 🛠️ Tech Stack

![Docusaurus](https://img.shields.io/badge/Docusaurus-3ECC5F?logo=docusaurus&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white&style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge)



## 📝 License
- 本專案中的 **筆記文章與部落格文章** 採用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en) 授權
- 本專案中的 **程式碼** 採用 [MIT LICENSE](./LICENSE) 授權
