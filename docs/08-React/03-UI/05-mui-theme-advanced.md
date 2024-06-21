---
title: MUI v5 主題 (Theme)：進階定制與自定義
sidebar_label: "[MUI] Theme: 進階定制與自定義"
description: "本篇文章介紹了 MUI v5 主題（Theme）的進階使用法，包含 Palette（調色板)、Dark Mode、Typography、Spacing、客製化Component"
slug: "/React/mui-theme-advanced"
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

## **Palette**

### **MUI 預設的 Palette 顏色種類**

Palette（調色板）能讓我們定義在不同情境要使用的顏色，而 MUI 本身預設提供了以下的 Palette 顏色種類：

- [`.palette.primary`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.primary)
- [`.palette.secondary`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.secondary)
- [`.palette.error`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.error)
- [`.palette.warning`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.warning)
- [`.palette.info`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.info)
- [`.palette.success`](https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette.success)

palette 的 color value 可以是一個 color object，也可以是具有以下 TypeScript  interface 的一個或多個 key 的 object

```jsx
interface PaletteColor {
  light?: string;
  main: string;
  dark?: string;
  contrastText?: string;
}
```

### **使用 color object 引入 MUI 預設顏色**

客製化 Palette 最出單的方法就是引入 MUI 提供的 color 物件，就不需要自己定義 `light/main/dark/contrastText`

```jsx
import { createTheme } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';

const theme = createTheme({
  palette: {
    primary: blue,
  },
});
```

### **直接指定顏色**

我們也可以直接定義每個顏色

```jsx
const palette = {
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
    contrastText: '#fff',
  },
  // 其他 Palette 顏色
};
```

### **自定義新顏色種類**

除了primary, secondary 等 MUI 預定好的顏色種類，我們也可以自行定義我們自己的顏色種類，假設我想定義一個顏色種類叫做 `neutral`，我可以這樣寫：

```jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});
```

:::tip
如果是 TypeScript 用戶，則需要使用 [module augmentation](https://mui.com/material-ui/guides/typescript/#customization-of-theme) 在 `Palette` 與 `PaletteOptions` 這兩個 interface 中新增`neutral` 的型別


```jsx
declare module '@mui/material/styles' {
  ...
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
```
:::


<br/>


## **Dark Mode**

### **Default palette 設置 Dark Mode**

MUI 預設提供了支援 Dark Mode 的預設 **`palette`** 設置。要啟用 Dark Mode，我們只需要在創建主題時將 **`palette.mode`** 屬性設置為 **`'dark'`**。以下是一個示例，展示了如何設置預設的 Dark Mode：

```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>This app is using the dark mode</main>
    </ThemeProvider>
  );
}

export default App;
```

在 `<ThemeProvider>` 組件中添加 `<CssBaseline />` 也將為應用程序的背景啟用 dark mode。

### **客制化 palette 設置 Dark Mode**

前述的 dark mode 設定方式僅限於我們使用 default palette 的時候，如果我們有客製化 `palette`，我們就需要確保 light mode 與 dark mode 下的 palette 是不同的。我們可以定義一個函數，根據傳入的 mode 值決定回傳 light mode 或 dark mode 的 palette。

```jsx
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: amber,
          divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: deepOrange,
          divider: deepOrange[700],
          background: {
            default: deepOrange[900],
            paper: deepOrange[900],
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
  },
}); 
```

接著我們就可以在其他 component 撰寫控制切換 mode 的邏輯：

```jsx
export default function App() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
```

## **Typography 字型與文字大小**

Typography 在 MUI 中用於設定應用程式中的文字風格，包括字型、字型大小和行高等。透過 Typography，我們可以輕鬆地調整應用程式中的文字外觀，以符合設計需求。

### **Font family**

我們可以使用 `theme.typography.fontFamily` 屬性更改字體系列。

```jsx
const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
```

### **Font size**

要更改 Material UI 的字體大小，我們可以提供 `fontSize` 屬性。默認值為 14px。

```jsx
const theme = createTheme({
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12,
  },
});
```

### **typography variant**

typography object 本身有 13 種 variants，每種 variant 都可以被客製化:

- h1
- h2
- h3
- h4
- h5
- h6
- subtitle1
- subtitle2
- body1
- body2
- button
- caption
- overline

```jsx
const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
    body1: {
      fontWeight: 500,
    },
    button: {
      fontStyle: 'italic',
    },
  },
});
```


<br/>


## **Spacing 與 Breakpoints**

### **客製化 Spacing**

MUI 以 8px 作為 scaling factor，當我們需要固定的間隔時可以呼叫 `theme.spacing()`

```jsx
const theme = createTheme();

theme.spacing(2); // `${8 * 2}px` = '16px'
```

我們也可以不要用 MUI 預設的 8px 作為 scaling factor

```jsx
const theme = createTheme({
  spacing: 4,
});

theme.spacing(2); // `${4 * 2}px` = '8px'
```

```jsx
const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`, // (Bootstrap strategy)
});

theme.spacing(2); // = 0.25 * 2rem = 0.5rem = 8px
```

### **MUI 預設 breakpoints 大小**

MUI 讓我們能夠在各種斷點處調整其佈局，以滿足不同裝置的體驗。 以下每個斷點（一個鍵）都與一個固定的屏幕寬度（一個值）相匹配：

- **xs,** extra-small: 0px
- **sm,** small: 600px
- **md,** medium: 900px
- **lg,** large: 1200px
- **xl,** extra-large: 1536px

而斷點的大小也是可以被客製化的，我們可以這樣定義自己希望的 break point 大小：

```jsx
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
```

### **CSS Media Queries**

CSS media queries 是使 UI 具有響應性的慣用方法。該方法提供了五種styles helpers 來實現：

```jsx
const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      backgroundColor: theme.palette.secondary.main,
    },
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.primary.main,
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: green[500],
    },
  },
});
```


<br/>


## **客製化 Component 的方法**

### **一次性 component 客製化**

如果一個 component 只被某處使用，不是一個公用 component 的話通常會用 [sx prop](https://mui.com/system/getting-started/the-sx-prop/) 來來直接 override 原本的 CSS

```jsx
<Slider
  defaultValue={30}
  sx={{
    width: 300,
    color: 'success.main',
  }}
/>
```

### **可重複用 component 客製化**

如果一個 component 會在多個不同地方使用，且需要使它在不同地方的 style 都不同，那可以使用 `[styled()](https://mui.com/system/styled/)` utility ，透過傳入的 prop 來決定要呈現的 style

```jsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Slider, { SliderProps } from '@mui/material/Slider';

interface StyledSliderProps extends SliderProps {
  success?: boolean;
}

const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== 'success',
})<StyledSliderProps>(({ success, theme }) => ({
  ...(success &&
    {
      // the overrides added when the new prop is used
    }),
}));
```

```jsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Slider, { SliderProps } from '@mui/material/Slider';

interface StyledSliderProps extends SliderProps {
  success?: boolean;
}

const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== 'success',
})<StyledSliderProps>(({ success, theme }) => ({
  ...(success &&
    {
      // the overrides added when the new prop is used
    }),
}));
```

### **全局主題 overrides**

除此之外，我們也可以直接從 Component 的層級去定義某種 Component 的 style。由於我個人使用到這個功能的機會不高，因此就不記錄這部分的筆記，有興趣的話可以看 [**Themed components**](https://mui.com/material-ui/customization/theme-components/) 的說明。


<br/>


## **Reference**

- **[Theming](https://mui.com/material-ui/customization/theming/)**
- **[Palette](https://mui.com/material-ui/customization/palette/)**
- **[Dark mode](https://mui.com/material-ui/customization/dark-mode/)**
- **[Typography](https://mui.com/material-ui/customization/typography/#variants)**
- **[Spacing](https://mui.com/material-ui/customization/spacing/)**
- **[Breakpoints](https://mui.com/material-ui/customization/breakpoints/)**
- **[Themed components](https://mui.com/material-ui/customization/theme-components/)**
- **[Default theme viewer](https://mui.com/material-ui/customization/default-theme/)**