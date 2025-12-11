---
title: MUI 主題 (Theme) 完整指南：從基礎到進階
sidebar_label: "MUI - Theme"
description: 本篇文章完整介紹 MUI（Material-UI）主題（Theme）的概念與使用方法，包含核心 API、Palette 調色板、Dark Mode、Typography、Spacing、Breakpoints、Component 客製化，以及 CSS Theme Variables 等進階功能。
slug: "/React/mui-theme"
last_update:
  date: 2024-12-11
keywords: [UI Library, MUI, Theme, Material UI, React]
tags: [UI Library, React]
---

:::note[版本資訊]
本文內容基於 **MUI v5.x** 撰寫，同時也適用於 **MUI v6.x**。MUI v6 在主題系統上與 v5 保持高度相容，主要差異在於 v6 將 `variants` 從 `components` 移至 `styleOverrides` 內。如果你使用的是 v4 或更早版本，部分 API 可能有所不同，建議參考對應版本的官方文件。
:::

## **前言**

在開發 React 應用程式時，維持一致的視覺風格是一個常見的挑戰。當專案規模變大，散落在各處的顏色值、字體設定、間距數值會讓維護變得困難。[MUI](https://mui.com/)（Material-UI）的主題系統正是為了解決這個問題而設計的——它讓我們能夠在一個地方集中定義所有的視覺規範，並確保整個應用程式都遵循這些規範。

這篇文章整理了 MUI Theme 的核心概念與實用技巧，從最基礎的 API 使用到進階的客製化方法，希望能幫助你快速掌握 MUI 主題系統的使用方式。

:::info[官方文件導讀]
本篇文章的內容主要來自 MUI 官方網站的 [Theming](https://mui.com/material-ui/customization/theming/) 相關文件。你可以將這篇文章作為官方文件的快速導讀，快速了解想要實作的功能以及大致使用方法。若需要進一步深入了解，可以透過各段落提供的連結找到對應的官方文件。
:::


<br/>


## **快速開始**

先來看一個簡單的範例，讓我們對主題的應用有一個直觀的了解：

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

這個範例展示了 MUI 主題的三個核心步驟：

1. **建立主題**：使用 `createTheme` 定義自訂的視覺規範
2. **注入主題**：使用 `ThemeProvider` 將主題傳遞給子元件
3. **使用主題**：MUI 元件會自動套用主題中定義的樣式

接下來，讓我們深入了解每個核心 API 的使用方式。


<br/>


## **核心 API**

MUI 主題系統的核心由三個 API 組成：`createTheme`、`ThemeProvider` 和 `useTheme`。理解這三者的關係是掌握 MUI 主題的第一步。

| API             | 用途                     | 使用位置                             |
| --------------- | ------------------------ | ------------------------------------ |
| `createTheme`   | 建立主題配置物件         | 通常在獨立的 theme 檔案中            |
| `ThemeProvider` | 將主題注入 React Context | 應用程式的根元件或需要不同主題的區塊 |
| `useTheme`      | 在元件中存取主題變數     | 任何需要讀取主題值的元件             |

### **[createTheme](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme)**

`createTheme` 是建立主題的核心函數，它接受一個配置物件作為參數，包含調色板（palette）、字體（typography）、間距（spacing）等設定：

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

:::tip[合併多個主題]
如果需要合併多個主題配置，可以使用 `deepmerge` 工具：

```jsx
import { deepmerge } from '@mui/utils';
import { createTheme } from '@mui/material/styles';

const theme = createTheme(deepmerge(baseTheme, customTheme));
```
:::

### **[ThemeProvider](https://mui.com/material-ui/customization/theming/#themeprovider)**

`ThemeProvider` 利用 React Context 將主題傳遞給所有子元件。通常我們會在應用程式的根元件使用它：

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

:::note[巢狀主題]
我們也可以嵌套多個 `ThemeProvider`，內層的 theme 會覆蓋外層的 theme。這在需要局部使用不同主題時非常有用：

```jsx
<ThemeProvider theme={outerTheme}>
  <Checkbox defaultChecked />  {/* 使用 outerTheme */}
  <ThemeProvider theme={innerTheme}>
    <Checkbox defaultChecked />  {/* 使用 innerTheme */}
  </ThemeProvider>
</ThemeProvider>
```
:::

### **[useTheme Hook](https://mui.com/material-ui/customization/theming/#accessing-the-theme-in-a-component)**

當你需要在元件中動態存取主題變數時，可以使用 `useTheme` hook：

```jsx
import { useTheme } from '@mui/material/styles';

function PriceTag({ price }) {
  const theme = useTheme();
  
  return (
    <span style={{ 
      color: theme.palette.primary.main,
      padding: theme.spacing(1, 2),
    }}>
      ${price}
    </span>
  );
}
```


<br/>


## **主題配置變數總覽**

MUI 主題包含多個配置區塊，每個區塊負責不同的視覺面向：

| 配置區塊                                                                  | 用途       | 常見設定                                |
| ------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| [palette](https://mui.com/material-ui/customization/palette/)             | 調色板     | primary、secondary、error、背景色       |
| [typography](https://mui.com/material-ui/customization/typography/)       | 字體排版   | fontFamily、fontSize、各級標題樣式      |
| [spacing](https://mui.com/material-ui/customization/spacing/)             | 間距       | 基礎間距單位（預設 8px）                |
| [breakpoints](https://mui.com/material-ui/customization/breakpoints/)     | 響應式斷點 | xs、sm、md、lg、xl 的寬度值             |
| [zIndex](https://mui.com/material-ui/customization/z-index/)              | 層級       | modal、drawer、tooltip 等的 z-index     |
| [transitions](https://mui.com/material-ui/customization/transitions/)     | 過渡動畫   | duration、easing 函數                   |
| [components](https://mui.com/material-ui/customization/theme-components/) | 元件樣式   | 各元件的 defaultProps 和 styleOverrides |

### **自訂主題變數**

除了內建的配置區塊，你也可以新增自訂變數。這在需要定義專案特有的設計 token 時非常有用：

```jsx
const theme = createTheme({
  status: {
    danger: orange[500],
  },
  customShadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
});
```

:::warning[TypeScript 用戶注意]
如果使用 TypeScript，需要透過 [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) 擴展型別定義：

```tsx
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
    customShadows: {
      card: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
    customShadows?: {
      card?: string;
    };
  }
}
```
:::


<br/>


## **Palette 調色板**

Palette 是 MUI 主題中最常被客製化的部分，它定義了應用程式中使用的所有顏色。

### **預設顏色種類**

MUI 預設提供六種語意化的顏色種類，每種都有其特定用途：

| 顏色種類    | 用途               | 預設色系 |
| ----------- | ------------------ | -------- |
| `primary`   | 主要操作、品牌色   | 藍色     |
| `secondary` | 次要操作、輔助色   | 紫色     |
| `error`     | 錯誤狀態、刪除操作 | 紅色     |
| `warning`   | 警告訊息           | 橘色     |
| `info`      | 資訊提示           | 淺藍色   |
| `success`   | 成功狀態           | 綠色     |

每個顏色種類都包含以下屬性：

```tsx
interface PaletteColor {
  light?: string;      // 淺色變體
  main: string;        // 主要顏色（必填）
  dark?: string;       // 深色變體
  contrastText?: string; // 對比文字顏色
}
```

### **三種設定顏色的方式**

**方式一：使用 MUI 內建顏色**

最簡單的方式是直接引入 MUI 提供的 [color 物件](https://mui.com/material-ui/customization/color/)，它會自動包含 `light`、`main`、`dark` 等變體：

```jsx
import { createTheme } from '@mui/material/styles';
import { blue, pink } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});
```

**方式二：只指定 main 顏色**

如果只提供 `main` 顏色，MUI 會自動計算 `light`、`dark` 和 `contrastText`：

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
});
```

**方式三：完整自訂所有顏色**

如果需要精確控制每個顏色變體：

```jsx
const theme = createTheme({
  palette: {
    primary: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff',
    },
  },
});
```

### **新增自訂顏色種類**

除了預設的六種顏色，你也可以新增專案特有的顏色種類：

```jsx
const theme = createTheme({
  palette: {
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    brand: {
      main: '#FF6B35',
      light: '#FF8F66',
      dark: '#CC5529',
    },
  },
});
```

:::warning[TypeScript 用戶注意]
新增自訂顏色時，需要擴展 `Palette` 和 `PaletteOptions` 介面：

```tsx
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    brand: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    brand?: PaletteOptions['primary'];
  }
}
```

如果要在 Button 等元件上使用自訂顏色，還需要擴展對應元件的 props：

```tsx
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
    brand: true;
  }
}
```
:::


<br/>


## **Dark Mode 深色模式**

Dark Mode 已經成為現代應用程式的標配功能。MUI 提供了完整的 Dark Mode 支援，從簡單的靜態設定到動態切換都能輕鬆實現。

### **基本設定**

最簡單的方式是在 `palette.mode` 中指定 `'dark'`：

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
      <CssBaseline />  {/* 重要：會自動調整背景色和文字顏色 */}
      <main>This app is using the dark mode</main>
    </ThemeProvider>
  );
}
```

:::tip[CssBaseline 的作用]
`<CssBaseline />` 會根據當前的 `palette.mode` 自動設定適當的背景色和文字顏色。在 Dark Mode 下，它會將背景設為深色、文字設為淺色。建議在使用 Dark Mode 時一定要加上這個元件。
:::

### **動態切換 Light/Dark Mode**

實際應用中，我們通常需要讓使用者能夠切換主題。以下是一個完整的實作範例：

```tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';

// 1. 建立 Context 來管理切換功能
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// 2. 根據 mode 產生不同的主題配置
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: amber,
          background: { default: '#fafafa', paper: '#fff' },
          text: { primary: grey[900], secondary: grey[700] },
        }
      : {
          primary: deepOrange,
          background: { default: '#121212', paper: '#1e1e1e' },
          text: { primary: '#fff', secondary: grey[400] },
        }),
  },
});

// 3. 建立 Provider 元件
export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// 4. 在元件中使用
function ThemeToggleButton() {
  const { toggleColorMode } = useContext(ColorModeContext);
  return <button onClick={toggleColorMode}>切換主題</button>;
}
```

### **跟隨系統設定**

如果希望預設跟隨使用者的系統設定，可以使用 `window.matchMedia`：

```tsx
const getInitialMode = (): PaletteMode => {
  // 檢查是否有儲存的偏好
  const savedMode = localStorage.getItem('themeMode') as PaletteMode;
  if (savedMode) return savedMode;
  
  // 否則跟隨系統設定
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

const [mode, setMode] = useState<PaletteMode>(getInitialMode);
```


<br/>


## **Typography 字型設定**

Typography 定義了應用程式中所有文字的視覺規範，包括字型家族、大小、粗細等。

### **全域字型設定**

```jsx
const theme = createTheme({
  typography: {
    // 字型家族（會套用到所有文字）
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    
    // 基礎字體大小（預設 14px）
    fontSize: 14,
    
    // HTML font-size（用於 rem 計算，預設 16px）
    htmlFontSize: 16,
  },
});
```

### **Typography Variants**

MUI 提供 13 種預設的文字變體，每種都可以獨立客製化：

| 變體                 | 預設 HTML 標籤  | 用途     |
| -------------------- | --------------- | -------- |
| h1 ~ h6              | `<h1>` ~ `<h6>` | 標題     |
| subtitle1, subtitle2 | `<h6>`          | 副標題   |
| body1, body2         | `<p>`           | 內文     |
| button               | `<span>`        | 按鈕文字 |
| caption              | `<span>`        | 說明文字 |
| overline             | `<span>`        | 標籤文字 |

```jsx
const theme = createTheme({
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // 取消預設的大寫轉換
      fontWeight: 600,
    },
  },
});
```

:::tip[取消按鈕文字大寫]
MUI 預設會將 Button 的文字轉為大寫。如果不需要這個行為，可以在 `typography.button` 中設定 `textTransform: 'none'`。
:::


<br/>


## **Spacing 間距系統**

MUI 使用一致的間距系統來確保 UI 元素之間的距離保持和諧。預設以 **8px** 作為基礎單位。

### **使用 spacing 函數**

```jsx
const theme = createTheme();

// 單一值
theme.spacing(2);      // '16px' (8 * 2)
theme.spacing(0.5);    // '4px'  (8 * 0.5)

// 多個值（類似 CSS shorthand）
theme.spacing(1, 2);       // '8px 16px'
theme.spacing(1, 2, 3);    // '8px 16px 24px'
theme.spacing(1, 2, 3, 4); // '8px 16px 24px 32px'
```

### **自訂基礎單位**

```jsx
// 改用 4px 作為基礎單位
const theme = createTheme({
  spacing: 4,
});
theme.spacing(2); // '8px' (4 * 2)

// 使用函數自訂（Bootstrap 風格）
const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
});
theme.spacing(4); // '1rem'
```


<br/>


## **Breakpoints 響應式斷點**

MUI 提供五個預設斷點，用於建立響應式佈局：

| 斷點 | 寬度    | 適用裝置             |
| ---- | ------- | -------------------- |
| `xs` | 0px+    | 手機（直向）         |
| `sm` | 600px+  | 手機（橫向）、小平板 |
| `md` | 900px+  | 平板                 |
| `lg` | 1200px+ | 筆電、桌機           |
| `xl` | 1536px+ | 大螢幕               |

### **自訂斷點值**

```jsx
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,   // 改為 Bootstrap 的值
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
});
```

### **在樣式中使用斷點**

MUI 提供多種 helper 函數來建立響應式樣式：

```jsx
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  
  // 螢幕寬度 < md (900px)
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
  
  // 螢幕寬度 >= md (900px)
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
  
  // md <= 螢幕寬度 < lg
  [theme.breakpoints.between('md', 'lg')]: {
    backgroundColor: 'lightblue',
  },
  
  // 精確匹配某個斷點範圍
  [theme.breakpoints.only('sm')]: {
    border: '1px solid red',
  },
}));
```

| Helper 函數           | 說明          | 產生的 Media Query                                     |
| --------------------- | ------------- | ------------------------------------------------------ |
| `up('md')`            | md 以上       | `@media (min-width: 900px)`                            |
| `down('md')`          | md 以下       | `@media (max-width: 899.95px)`                         |
| `between('sm', 'lg')` | sm 到 lg 之間 | `@media (min-width: 600px) and (max-width: 1199.95px)` |
| `only('md')`          | 只有 md       | `@media (min-width: 900px) and (max-width: 1199.95px)` |


<br/>


## **元件樣式客製化**

MUI 提供多種方式來客製化元件樣式，從單一元件的調整到全域統一設定都能滿足。選擇哪種方式取決於你的使用場景：

| 方式               | 適用場景               | 影響範圍         |
| ------------------ | ---------------------- | ---------------- |
| `sx` prop          | 單一元件的快速調整     | 該元件實例       |
| `styled()`         | 建立可重用的客製化元件 | 使用該元件的地方 |
| Theme `components` | 全域統一設定           | 整個應用程式     |

### **sx prop：快速樣式調整**

`sx` prop 是最快速的樣式調整方式，支援主題感知的簡寫語法：

```jsx
<Button
  sx={{
    // 直接使用主題值
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    
    // 使用 spacing 函數
    p: 2,        // padding: theme.spacing(2)
    mt: 1,       // marginTop: theme.spacing(1)
    
    // 響應式樣式
    width: { xs: '100%', md: 'auto' },
    
    // 偽類和巢狀選擇器
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  }}
>
  Styled Button
</Button>
```

### **styled()：建立可重用元件**

當需要建立可重用的客製化元件時，使用 `styled()` 是更好的選擇：

```tsx
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

interface GradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'secondary';
}

const GradientButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'gradient',
})<GradientButtonProps>(({ theme, gradient = 'primary' }) => ({
  background: gradient === 'primary'
    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
    : `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
  color: theme.palette.common.white,
  '&:hover': {
    opacity: 0.9,
  },
}));

// 使用
<GradientButton gradient="secondary">Gradient</GradientButton>
```

:::note[shouldForwardProp]
`shouldForwardProp` 用於過濾不應該傳遞給底層 DOM 元素的 props。自訂的 props（如 `gradient`）如果傳給 DOM 會產生警告，所以需要過濾掉。
:::

### **Theme components：全域樣式設定**

在主題中設定元件樣式可以確保整個應用程式的一致性：

```jsx
const theme = createTheme({
  components: {
    // 元件名稱必須以 "Mui" 開頭
    MuiButton: {
      // 設定預設 props
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      // 覆寫預設樣式
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        // 針對特定 variant
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
      },
    },
    
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.spacing(2),
          boxShadow: theme.shadows[2],
        }),
      },
    },
  },
});
```

:::tip[動態樣式]
`styleOverrides` 可以接受一個函數，讓你存取 `theme` 和元件的 `ownerState`（包含所有 props）：

```jsx
styleOverrides: {
  root: ({ theme, ownerState }) => ({
    ...(ownerState.variant === 'contained' && {
      backgroundColor: theme.palette.primary.main,
    }),
  }),
},
```
:::


<br/>


## **CSS Theme Variables（進階）**

從 MUI v5.6 開始，你可以將主題變數輸出為 CSS 變數。這帶來幾個重要優勢：

- **避免 Dark Mode 閃爍**：使用 CSS 變數可以在 SSR 時避免主題切換時的閃爍問題
- **跨框架使用**：CSS 變數可以在非 React 環境中使用（如純 CSS、Web Components）
- **更好的開發體驗**：可以在瀏覽器 DevTools 中直接查看和修改主題值

### **啟用 CSS Theme Variables**

```jsx
const theme = createTheme({
  cssVariables: true,
});

function App() {
  return <ThemeProvider theme={theme}>...</ThemeProvider>;
}
```

啟用後，MUI 會在 `:root` 中生成 CSS 變數：

```css
:root {
  --mui-palette-primary-main: #1976d2;
  --mui-palette-primary-light: #42a5f5;
  --mui-palette-primary-dark: #1565c0;
  --mui-palette-background-default: #fff;
  --mui-spacing: 8px;
  /* ...更多變數 */
}
```

### **在樣式中使用 CSS 變數**

啟用後，可以透過 `theme.vars` 來存取 CSS 變數：

```jsx
// 在 styled components 中
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  color: theme.vars.palette.text.primary,
  borderRadius: theme.vars.shape.borderRadius,
}));

// 在 sx prop 中（自動使用 CSS 變數）
<Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }} />
```

### **在純 CSS 中使用**

CSS 變數可以在任何 CSS 檔案中使用，這對於需要在 MUI 元件之外套用主題樣式的情況非常有用：

```css
/* global.css */
.custom-element {
  background-color: var(--mui-palette-primary-main);
  padding: var(--mui-spacing);
  border-radius: var(--mui-shape-borderRadius);
}

/* 響應式樣式 */
@media (prefers-color-scheme: dark) {
  .custom-element {
    background-color: var(--mui-palette-primary-dark);
  }
}
```

### **配合 Dark Mode 使用**

CSS Theme Variables 與 Dark Mode 搭配使用時特別強大：

```jsx
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class', // 使用 class 來切換色彩模式
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1976d2' },
        background: { default: '#fafafa' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#90caf9' },
        background: { default: '#121212' },
      },
    },
  },
});
```

然後可以透過在 `<html>` 或容器元素上切換 class 來改變主題：

```jsx
// 切換到 Dark Mode
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
```


<br/>


## **Best Practice：主題檔案組織**

當專案規模變大時，建議將主題相關的程式碼獨立組織：

```
src/
├── theme/
│   ├── index.ts          # 主要 theme 匯出
│   ├── palette.ts        # 調色板設定
│   ├── typography.ts     # 字型設定
│   ├── components.ts     # 元件樣式覆寫
│   └── breakpoints.ts    # 斷點設定
```

```tsx
// theme/palette.ts
export const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  // ...
};

// theme/index.ts
import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

export const theme = createTheme({
  palette,
  typography,
  components,
});
```

:::tip[主題設計建議]
1. **從設計系統開始**：先定義好 palette、typography、spacing 等基礎 token，再處理元件樣式
2. **善用 Default Theme Viewer**：MUI 提供 [Default Theme Viewer](https://mui.com/material-ui/customization/default-theme/) 讓你查看所有預設值
3. **漸進式客製化**：不需要一次定義所有設定，可以從最需要調整的部分開始
4. **保持一致性**：盡量使用主題變數而非硬編碼的值，方便日後維護
:::


<br/>


## **實用工具**

以下是一些幫助你建立和調整 MUI 主題的實用工具：

| 工具                                                                                 | 用途                                   |
| ------------------------------------------------------------------------------------ | -------------------------------------- |
| [**MUI Theme Creator**](https://zenoo.github.io/mui-theme-creator/)                  | 視覺化主題編輯器，可即時預覽各元件效果 |
| [**Material Palette Generator**](https://m2.material.io/inline-tools/color/)         | 根據主色自動生成完整的調色板           |
| [**Default Theme Viewer**](https://mui.com/material-ui/customization/default-theme/) | 查看 MUI 預設主題的所有值              |
| [**Figma MUI Kit**](https://www.figma.com/community/file/912837788133317724)         | 官方 Figma 設計套件                    |


<br/>


## **Reference**

- **[Theming](https://mui.com/material-ui/customization/theming/)** - 主題系統概覽
- **[Palette](https://mui.com/material-ui/customization/palette/)** - 調色板詳細設定
- **[Dark mode](https://mui.com/material-ui/customization/dark-mode/)** - 深色模式實作指南
- **[Typography](https://mui.com/material-ui/customization/typography/)** - 字型設定
- **[Spacing](https://mui.com/material-ui/customization/spacing/)** - 間距系統
- **[Breakpoints](https://mui.com/material-ui/customization/breakpoints/)** - 響應式斷點
- **[Themed components](https://mui.com/material-ui/customization/theme-components/)** - 元件樣式客製化
- **[CSS theme variables](https://mui.com/material-ui/customization/css-theme-variables/overview/)** - CSS 變數功能
- **[Default theme viewer](https://mui.com/material-ui/customization/default-theme/)** - 預設主題查看器
