---
title: 常用 npm & yarn 指令對照表
sidebar_label: "常用 npm & yarn 指令對照表"
description: 本篇文章記錄常用的 npm 與 yarn 指令
last_update:
  date: 2023-04-30
keywords:
  - 開發工具
  - npm
  - yarn
tags:
  - 開發工具
  - npm
  - yarn
---


## **常用 npm & yarn 指令**
| NPM 指令                                  | Yarn 指令                        | 說明                                                                |
| ----------------------------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `npm init`                                | `yarn init`                      | 初始化一個新的專案                                                  |
| `npm install`                             | `yarn/yarn install`              | 安裝所有相依的套件，包含 dependencies 和 devDependencies            |
| `npm install package-name`                | `yarn add package-name`          | 安裝單一套件或多個套件，自動判斷加入 dependencies                   |
| `npm install package-name@version`        | `yarn add package-name@version`  | 安裝特定版本的套件                                                  |
| `npm install  package-name --save-dev/-D` | `yarn add package-name --dev/-D` | 安裝並將套件新增至 devDependencies                                  |
| `npm uninstall package-name`              | `yarn remove package-name`       | 移除套件，自動從 dependencies 或 devDependencies 中移除             |
| `npm update`                              | `yarn upgrade`                   | 更新所有套件或單一套件，包含 dependencies 和 devDependencies        |
| `npm update package-name`                 | `yarn upgrade package-name`      | 更新單一套件，自動判斷更新 dependencies 或 devDependencies 中的套件 |



## **Reference**

- **[@yarn (v1)](https://classic.yarnpkg.com/en/docs/cli/)**
- **[@yarn (v2)](https://yarnpkg.com/cli/install)**
- **[@npm](https://docs.npmjs.com/cli/v9/commands)**