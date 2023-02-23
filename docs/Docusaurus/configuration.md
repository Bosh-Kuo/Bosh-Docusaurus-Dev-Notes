---
title: Configuration
sidebar_label: Configuration
sidebar_position: 4
description: Docusaurus 專案 - Configuration 設定
last_update:
  date: 2023-02-19
keywords:
  - Docusaurus
  - Configuration
tags:
  - Docusaurus
---

`docusaurus.config.js` 為網站的配置檔，可以根據網站的需求客製化。客製化配置主要可以分成下列幾點：

- Site metadata
- Deployment configurations
- Theme, plugin, and preset configurations
- Custom configurations

## **Site metadata**

- **title**: 網站標題
- **url**: 它通常是您網站的域名或 IP 地址。當您在瀏覽器中打開網站時，它會用於構建絕對 URL
- **baseUrl**: 指部署站點時的基本 URL 路徑，例如，如果您將 baseUrl 設置為 "/docs/"，則在生成的靜態站點中，所有頁面的 URL 將以 "/docs/" 開頭
- **favicon**: 網站圖標
- **themeConfig**: 用於設置網站主題相關選項。其中包含了許多可用於自定義和設置主題的選項，例如導覽列、側邊欄、搜尋框、顏色等。
    - **navbar**: title, items
    - **footer:** style, links, copyright

## **Deployment configurations**

projectName、organizationName 和可選的 deploymentBranch，使用 github pages 來部署才需要設定。

## **Custom configurations**

要添加自定義的 fields，必須在 `customFields` 中定義它們

```json
config: {
	// ...
	customFields: {
	    image: '',
	    keywords: [],
	 },
	// ...
}
```

## **Accessing configuration from components**

```jsx
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Hello = () => {
  const {siteConfig} = useDocusaurusContext();
  const {title, tagline} = siteConfig;

  return <div>{`${title} · ${tagline}`}</div>;
};
```

## **Reference**
- [Configuration](https://docusaurus.io/docs/configuration#theme-plugin-and-preset-configurations)