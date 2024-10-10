---
title: 常用 npm & yarn 指令對照表
sidebar_label: "常用 npm & yarn 指令對照表"
description: 本篇文章記錄常用的 npm 與 yarn 指令
last_update:
  date: 2023-04-30
keywords:
  - npm
  - yarn
  - npm cli
  - yarn cli
tags:
  - npm
  - yarn
---

### **安裝與初始化相關**

| **功能**                                | **npm 指令**                          | **yarn 指令**                    |
| --------------------------------------- | ------------------------------------- | -------------------------------- |
| 初始化一個專案                          | `npm init`                            | `yarn init`                      |
| 安裝所有依賴                            | `npm install` 或 `npm i`              | `yarn`                           |
| 安裝指定 package                        | `npm install <package>`               | `yarn add <package>`             |
| 安裝指定版本的 package                  | `npm install <package>@<version>`     | `yarn add <package>@<version>`   |
| 安裝並將 package 保存到 devDependencies | `npm install --save-dev/-D <package>` | `yarn add <package> --dev/-D`    |
| 全局安裝 package                        | `npm install -g <package>`            | `yarn global add <package>`      |
| 安裝並鎖定 package 的版本               | `npm ci`                              | `yarn install --frozen-lockfile` |

### **卸載相關**

| **功能**         | **npm 指令**                 | **yarn 指令**                  |
| ---------------- | ---------------------------- | ------------------------------ |
| 卸載指定 package | `npm uninstall <package>`    | `yarn remove <package>`        |
| 全局卸載 package | `npm uninstall -g <package>` | `yarn global remove <package>` |

### **更新相關**

| **功能**                | **npm 指令**                   | **yarn 指令**                     |
| ----------------------- | ------------------------------ | --------------------------------- |
| 更新所有依賴            | `npm update`                   | `yarn upgrade`                    |
| 更新指定 package        | `npm update <package>`         | `yarn upgrade <package>`          |
| 更新 package 到最新版本 | `npm install <package>@latest` | `yarn upgrade <package> --latest` |

### **查詢與檢查相關**

| **功能**                  | **npm 指令**         | **yarn 指令**         |
| ------------------------- | -------------------- | --------------------- |
| 列出所有已安裝 package    | `npm list`           | `yarn list`           |
| 檢查已安裝 package 的更新 | `npm outdated`       | `yarn outdated`       |
| 顯示 package 詳細資訊     | `npm info <package>` | `yarn info <package>` |

### **執行腳本相關**

| **功能**           | **npm 指令**       | **yarn 指令**   |
| ------------------ | ------------------ | --------------- |
| 執行指定腳本       | `npm run <script>` | `yarn <script>` |
| 執行互動模式的指令 | `npm run`          | `yarn run`      |

### **清除與修復相關**

| **功能**     | **npm 指令**              | **yarn 指令**      |
| ------------ | ------------------------- | ------------------ |
| 清除本地緩存 | `npm cache clean --force` | `yarn cache clean` |
| 修復依賴     | `npm audit fix`           | `yarn audit`       |




## **Reference**

- **[@yarn (v1)](https://classic.yarnpkg.com/en/docs/cli/)**
- **[@npm](https://docs.npmjs.com/cli/v9/commands)**