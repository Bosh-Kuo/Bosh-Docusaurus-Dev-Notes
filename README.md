<div align="center">
    <img src="./static/img/logo.png" width="100" alt="Bosh Kuo Logo">
    <h2 align="center">Bosh 的技術探索筆記</h2>
    <strong>使用 Docusaurus 建立的一站式筆記中心，記錄我在軟體開發路上的技術足跡與學習旅程。</strong>
</div>

## 👋 Introduction

本專案包含 [Bosh 的技術探索筆記](https://notes.boshkuo.com/) 的網站程式碼、技術筆記與部落格文章。

內容涵蓋軟體開發知識、程式語言、框架與常用開發工具，也記錄了我在實作過程中遇到的問題、解決方式與學習心得。我希望透過這個公開的技術筆記網站，建立自己的知識管理系統，以筆記驅動學習，並為有相似需求的開發者提供參考。

網站以 Docusaurus 管理文件、MDX 與路由，自訂頁面和部分主題元件採用 shadcn/ui、Base UI 與 Tailwind CSS。

## ✨ Features

- **技術筆記**：依主題整理知識，支援 Markdown、MDX 與互動教學範例。
- **部落格**：以封面卡片呈現文章，提供關鍵字搜尋與標籤篩選。
- **時間歸檔**：筆記與部落格分別依年份整理，支援搜尋、年份跳轉與目前閱讀年份提示。
- **近期專案**：取得 GitHub 儲存庫清單，支援名稱搜尋、程式語言篩選與分頁，並呈現貢獻紀錄。
- **閱讀體驗**：文章封面、章節導覽與閱讀進度條，支援桌面與手機版面。
- **媒體預覽**：正文圖片與 Mermaid 圖表可以放大、縮小與拖曳檢視。
- **共用設計系統**：自訂元件與 Infima 共用設計 tokens，沿用青色品牌與深淺主題。
- **內容工具**：支援 Mermaid、KaTeX、即時程式碼預覽與 Algolia DocSearch。
- **開發工具**：使用 TypeScript、Biome、Husky 與 Conventional Commits。
- **網站部署**：使用 Vercel 部署，並配置 Google Analytics。

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

```text
.
├── blog/                         # 部落格文章，依年份整理
├── config/                       # 拆分後的 Docusaurus 設定
│   ├── plugins.ts                # 官方與自訂 Plugin 註冊
│   ├── presets.ts                # classic preset 與內容功能選項
│   ├── redirects.ts              # 網址重新導向
│   └── themeConfig.ts            # Navbar、Footer、搜尋等主題設定
├── docs/                         # 技術筆記，依主題整理
│   └── 01-Docusaurus/            # Docusaurus 使用與客製化筆記
├── scripts/
│   └── reindex_files_dirs.sh     # 文件與目錄編號整理工具
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn 基礎元件與自訂變體
│   │   ├── ArchivePage/          # 筆記與部落格共用的歸檔頁
│   │   ├── ExampleComponents/    # MDX 互動教學元件
│   │   └── MediaPreview/         # 圖片與圖表預覽
│   ├── css/
│   │   ├── globals.css           # Tailwind 入口與設計 tokens
│   │   ├── docusaurus.css        # Infima 變數橋接與原生主題樣式
│   │   └── fonts.css             # 字體載入
│   ├── hooks/                    # 內容索引、GitHub 資料等 React hooks
│   ├── lib/
│   │   └── format.ts             # 日期格式化
│   ├── pages/                    # 首頁、關於我與近期專案頁
│   ├── plugins/
│   │   ├── contentIndex/         # 內容摘要、歸檔路由與資料生成
│   │   └── tailwind/             # Tailwind PostCSS 與 CSS layers
│   └── theme/                    # 本地主題覆寫與 wrappers
├── static/                       # 直接提供的靜態資產
├── components.json               # shadcn 元件工具設定
├── biome.json                    # 格式化、lint 與 imports 規則
├── docusaurus.config.ts          # 網站設定入口
├── sidebars.ts                   # 文件側欄設定
├── tsconfig.json                 # TypeScript 設定
├── package.json
├── yarn.lock
├── LICENSE
└── README.md
```

## 🛠️ Tech Stack

![Docusaurus](https://img.shields.io/badge/Docusaurus-3ECC5F?logo=docusaurus&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?logo=reactquery&logoColor=white&style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=for-the-badge)
![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=black&style=for-the-badge)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge)

## 📝 License
- 本專案中的 **筆記文章與部落格文章** 採用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en) 授權
- 本專案中的 **程式碼** 採用 [MIT LICENSE](./LICENSE) 授權
