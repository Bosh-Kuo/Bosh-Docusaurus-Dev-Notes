---
title: MUI v5 主題 (Theme)：基礎概念與使用方法
sidebar_label: "[MUI] Theme: 基礎概念與使用方法"
description: 本篇文章介紹了MUI v5（Material-UI版本5）主題（Theme）的基礎概念和使用方法。文章簡要引述MUI官網的說明並且介提供了一些示例以幫助讀者更好地理解主題的應用。內容包括了 MUI 主題的API，像是createTheme、ThemeProvider 和 useTheme
slug: "/React/mui-theme-basic"
last_update:
  date: 2023-05-30
keywords:
  - UI Library
  - MUI
tags:
  - UI Library
---

:::info
本篇文章的內容來自 MUI 的官方網站的 [Theme](https://mui.com/material-ui/customization/theming/) 主題相關文件，可以將本篇文章作為官方文件的快速導讀，可以快速了解想要實作的功能以及大致使用方法，若需要進一步深入了解使用方法可以透過個段落提供的連結找到對應的官方文件。
:::

## **簡介**

[MUI](https://mui.com/)（Material-UI）是目前最流行的 React UI 框架之一，主題（Theme）功能使我們能夠自定義和並且定調應用整個應用程式的外觀和風格，我們可以定義視覺元素如顏色、字體、間距等，以確保整個應用程式保持一致的風格。

本筆記將介紹 MUI v5 中的主題功能，並提供簡單的範例說明要如何最初步地定義與使用 theme 功能

### **Example**

先來看一個簡單的範例，讓我們對主題的應用有一個直觀的了解。假設我們想要創建一個主色違白色的主題，並將主色套用在 component 上。

```jsx
import React from 'react';
import { createTheme, ThemeProvider, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" color="primary">
        Click me!
      </Button>
    </ThemeProvider>
  );
};

export default App;
```

在上面的例子中，我們首先使用 `createTheme` 函數創建了一個自定義主題，接著，我們使用 `ThemeProvider` 元件將應用程式包裹起來，以應用剛剛創建的主題。最後，我們使用 MUI 提供的 **`Button`** 元件來創建一個按鈕，並指定它的變體（`variant`）為 "contained"（填滿樣式），顏色（`color`）為 "primary"（主要顏色）。這樣，按鈕將根據我們定義的主題顯示為白色。


<br/>


## **API**

### **[createTheme](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme)**

在 MUI 中，我們可以使用 `createTheme` 函數來創建自定義 theme，再將 theme 傳給 [ThemeProvider](https://mui.com/material-ui/customization/theming/#themeprovider) 作為 prop。`createTheme` 接受一個object 作為參數，它包含了我們想要自定義的主題配置，像是調色板（palette）、字體（typography）、間距（spacing）等。

以下是一個簡單的示例，展示如何使用 **`createTheme`** 函數創建一個自定義主題，我們定義了主要（primary）和次要（secondary）顏色，並指定了它們的主要色彩值。同時，我們還設置了字體為 Arial 和 sans-serif，字體大小為 14 像素，間距為 8 像素:

```jsx
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
  },
  spacing: 8,
});
```

如果想實際合併兩個主題的設置選項並基於它們創建一個新 theme，我們會需要使用 `deepmerge` 將它們合併作為第一個參數提供給 createTheme 函數。

```jsx
import { deepmerge } from '@mui/utils';
import { createTheme } from '@mui/material/styles';

const theme = createTheme(deepmerge(options1, options2));
```


### **[ThemeProvider](https://mui.com/material-ui/customization/theming/#themeprovider)**

`ThemeProvider` 的作用是用來包裹整個應用程式或是叫上層的 component ，讓 ThemeProvider 內的 component 可以使用我們定義的主題。

```jsx
import React from 'react';
import { ThemeProvider } from '@mui/material';
import App from './App';
import theme from './theme';

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default Root;
```

我們也可以嵌套多個 `ThemeProvider`，內層的 theme 會 override 外層的 theme

```jsx
<ThemeProvider theme={outerTheme}>
  <Checkbox defaultChecked />
  <ThemeProvider theme={innerTheme}>
    <Checkbox defaultChecked />
  </ThemeProvider>
</ThemeProvider>
```

### **[`useTheme hook`](https://mui.com/material-ui/customization/theming/#accessing-the-theme-in-a-component)**

我們可以透過 useTheme hook 在 component 中取得主題變數

```jsx
import { useTheme } from '@mui/material/styles';

function DeepChild() {
  const theme = useTheme();
  return <span>{`spacing ${theme.spacing}`}</span>;
}
```


<br/>


## **主題配置**

### **預設主題配置變數**

MUI 的主題配置允許我們自定義各種變數以控制應用程式的風格，以下是一些常用的預設主題配置變數：

- [palette](https://mui.com/material-ui/customization/palette/)
- [typography](https://mui.com/material-ui/customization/typography/)
- [spacing](https://mui.com/material-ui/customization/spacing/)
- [breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [zIndex](https://mui.com/material-ui/customization/z-index/)
- [transitions](https://mui.com/material-ui/customization/transitions/)
- [components](https://mui.com/material-ui/customization/theme-components/)

### **客製化主題配置變數**

除了以上幾種常見的配置變數外，我們也可以定義自己的主題配置變數：

```jsx
const theme = createTheme({
  status: {
    danger: orange[500],
  },
});
```

:::tip
💡 如果使用 TypeScript 的話需使用 [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) 將新定義的變數加入`Theme` 與`ThemeOptions`.

```jsx
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
```
:::


<br/>


## **實用的 MUI Theme 線上編輯器**

以下為官方推薦的兩個實用主題建制工具，真的滿方便好用的

- [**mui-theme-creator**](https://zenoo.github.io/mui-theme-creator/)
- [**Material palette generator**](https://m2.material.io/inline-tools/color/)


<br/>


## **Reference**

- **[Theming](https://mui.com/material-ui/customization/theming/)**
- **[MUI Theme Creator](https://zenoo.github.io/mui-theme-creator/)**
- **[Color palettes](https://m2.material.io/inline-tools/color/)**