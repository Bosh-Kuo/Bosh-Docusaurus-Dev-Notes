---
title: CSS 網格佈局 Grid
sidebar_label: "[CSS] 網格佈局 Grid"
description: CSS Grid 網格佈局完整教學與互動範例
last_update:
  date: 2024-11-11
keywords: [CSS, Grid, Layout, 網格佈局]
tags: [CSS]
---

import {
GridExample,
GridItemExample,
GridTemplateAreasExample,
LayoutExample
} from '@site/src/components/ExampleComponents/Grid';

## **Grid 基本概念**

### **什麼是 Grid？**

CSS Grid 是一個二維的佈局系統，可以同時處理行（rows）和列（columns）。與 Flexbox 的一維佈局不同，Grid 能夠創建複雜的網格結構，非常適合用於整體頁面佈局。

### **Grid 容器與項目**

- **Grid Container**: 設定 `display: grid` 或 `display: inline-grid` 的父元素
- **Grid Items**: Grid Container 的直接子元素
- **Grid Line**: 構成網格結構的分隔線（水平和垂直）
- **Grid Track**: 兩條相鄰網格線之間的空間（行或列）
- **Grid Cell**: 四條網格線圍成的最小單位
- **Grid Area**: 由多個 Grid Cell 組成的矩形區域

```
Grid 結構示意圖：
┌─────────┬─────────┬─────────┐
│ Cell 1  │ Cell 2  │ Cell 3  │ ← Grid Track (Row)
├─────────┼─────────┼─────────┤
│ Cell 4  │ Cell 5  │ Cell 6  │
├─────────┼─────────┼─────────┤
│ Cell 7  │ Cell 8  │ Cell 9  │
└─────────┴─────────┴─────────┘
    ↑         ↑         ↑
Grid Track (Column)
```

<br/>

## **Grid Container 屬性**

### **1. display**

啟用 Grid 佈局：

```css
.container {
  display: grid; /* 或 inline-grid */
}
```

### **2. grid-template-columns / grid-template-rows**

這兩個屬性是 Grid 佈局的核心，用於定義網格的列（columns）和行（rows）結構。你可以使用多種單位和函數來創建靈活的網格系統。

```css
.container {
  /* 固定寬度：創建三個各 200px 寬的列 */
  grid-template-columns: 200px 200px 200px;
  
  /* 使用 fr 單位（fraction，分數單位）：按比例分配空間 */
  grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 的比例，第二列是第一列的兩倍寬 */
  
  /* 混合使用：結合固定寬度和彈性寬度 */
  grid-template-columns: 200px 1fr 2fr; /* 第一列固定 200px，剩餘空間按 1:2 分配 */
  
  /* 使用 repeat() 函數：避免重複書寫 */
  grid-template-columns: repeat(3, 1fr); /* 等同於 1fr 1fr 1fr */
  grid-template-columns: repeat(2, 100px 1fr); /* 等同於 100px 1fr 100px 1fr */
  
  /* 響應式網格：自動填充列 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* auto-fill 會盡可能多地創建列，每列最小 200px，最大 1fr */
  
  /* 定義行高 */
  grid-template-rows: 100px auto 100px; /* 第一行 100px，第二行自動，第三行 100px */
  grid-template-rows: repeat(3, 150px); /* 三行各 150px */
}
```

:::tip fr 單位詳解
`fr` 單位代表網格容器中**可用空間的一個分數**（fraction）。

**計算方式**：
- 先扣除所有固定寬度（如 px、%）
- 剩餘空間按 fr 的比例分配

**範例**：容器寬度 1000px
```css
grid-template-columns: 200px 1fr 2fr;
```
- 第一列：200px（固定）
- 剩餘空間：1000px - 200px = 800px
- 第二列：800px × (1/3) ≈ 267px
- 第三列：800px × (2/3) ≈ 533px
:::

:::info repeat() 函數
`repeat()` 函數可以簡化重複的網格定義：

**語法**：`repeat(重複次數, 軌道大小)`

**特殊關鍵字**：
- `auto-fill`：盡可能多地創建軌道，即使沒有內容也會保留空軌道
- `auto-fit`：只創建需要的軌道，並讓現有軌道擴展填滿空間

**範例**：
```css
/* 基本用法 */
repeat(3, 1fr) → 1fr 1fr 1fr

/* 複雜模式 */
repeat(2, 100px 1fr) → 100px 1fr 100px 1fr

/* 響應式 */
repeat(auto-fit, minmax(250px, 1fr))
```
:::

<GridExample 
  title="grid-template-columns 範例"
  description="選擇不同的 grid-template-columns 值觀察列的變化"
  gridTemplateColumns="repeat(3, 1fr)"
  itemCount={9}
  showControls="gridTemplate"
/>

### **3. gap (row-gap, column-gap)**

定義網格項目之間的間距：

```css
.container {
  gap: 20px; /* 行列間距都是 20px */
  gap: 20px 10px; /* 行間距 20px, 列間距 10px */
  
  /* 或分別設定 */
  row-gap: 20px;
  column-gap: 10px;
}
```

<GridExample 
  title="gap 範例"
  description="調整 gap 值觀察網格項目間距變化"
  gridTemplateColumns="repeat(3, 1fr)"
  gap={20}
  itemCount={9}
  showControls="gap"
/>

### **4. justify-items**

控制**所有網格項目**在其單元格內的**水平對齊方式**（行軸，inline axis）。這個屬性會影響容器內的所有項目，如果要單獨控制某個項目，請使用 `justify-self`。

```css
.container {
  justify-items: stretch; /* 預設值，拉伸填滿整個單元格寬度 */
  justify-items: start; /* 靠單元格左側對齊 */
  justify-items: end; /* 靠單元格右側對齊 */
  justify-items: center; /* 在單元格內水平置中 */
}
```

:::note 對齊方式說明
- **stretch**：項目會拉伸以填滿整個單元格（如果項目沒有設定固定寬度）
- **start/end/center**：項目保持其原始大小，並在單元格內對齊
:::

<GridExample 
  title="justify-items 範例"
  description="調整 justify-items 觀察項目在單元格內的水平對齊"
  gridTemplateColumns="repeat(3, 1fr)"
  justifyItems="stretch"
  itemCount={9}
  showControls="justifyItems"
/>

### **5. align-items**

控制**所有網格項目**在其單元格內的**垂直對齊方式**（塊軸，block axis）。與 `justify-items` 類似，但作用於垂直方向。

```css
.container {
  align-items: stretch; /* 預設值，拉伸填滿整個單元格高度 */
  align-items: start; /* 靠單元格頂部對齊 */
  align-items: end; /* 靠單元格底部對齊 */
  align-items: center; /* 在單元格內垂直置中 */
}
```

:::tip justify-items vs align-items
- **justify-items**：控制**水平方向**（左右）的對齊
- **align-items**：控制**垂直方向**（上下）的對齊
- 兩者都作用於**項目在單元格內**的對齊，而非整個網格的對齊
:::

<GridExample 
  title="align-items 範例"
  description="調整 align-items 觀察項目在單元格內的垂直對齊"
  gridTemplateColumns="repeat(3, 1fr)"
  gridTemplateRows="repeat(3, 120px)"
  alignItems="stretch"
  itemCount={9}
  showControls="alignItems"
/>

### **6. justify-content**

控制**整個網格**在容器內的**水平對齊方式**。注意：這個屬性只在**網格總寬度小於容器寬度**時才會生效。

```css
.container {
  justify-content: start; /* 預設值，網格靠容器左側 */
  justify-content: end; /* 網格靠容器右側 */
  justify-content: center; /* 網格在容器內水平置中 */
  justify-content: stretch; /* 拉伸網格填滿容器 */
  justify-content: space-between; /* 網格兩端對齊，中間平均分配空間 */
  justify-content: space-around; /* 每個軌道兩側有相等空間 */
  justify-content: space-evenly; /* 所有間距完全相等 */
}
```

:::warning 生效條件
`justify-content` 只在以下情況生效：
- 網格軌道使用**固定寬度**（如 `100px`）
- 網格總寬度**小於容器寬度**

如果使用 `fr` 單位，網格會自動填滿容器，此屬性不會有明顯效果。
:::

:::info 間距分配說明
```
space-between: |[軌道1]────[軌道2]────[軌道3]|
space-around:  |──[軌道1]────[軌道2]────[軌道3]──|
space-evenly:  |───[軌道1]───[軌道2]───[軌道3]───|
```
:::

<GridExample 
  title="justify-content 範例"
  description="調整 justify-content 觀察整個網格的水平對齊（需要網格寬度小於容器）"
  gridTemplateColumns="repeat(3, 100px)"
  justifyContent="start"
  itemCount={9}
  showControls="justifyContent"
/>

### **7. align-content**

控制**整個網格**在容器內的**垂直對齊方式**。與 `justify-content` 類似，但作用於垂直方向，只在**網格總高度小於容器高度**時生效。

```css
.container {
  align-content: start; /* 預設值，網格靠容器頂部 */
  align-content: end; /* 網格靠容器底部 */
  align-content: center; /* 網格在容器內垂直置中 */
  align-content: stretch; /* 拉伸網格填滿容器 */
  align-content: space-between; /* 網格上下對齊，中間平均分配空間 */
  align-content: space-around; /* 每個軌道上下有相等空間 */
  align-content: space-evenly; /* 所有間距完全相等 */
}
```

:::tip justify-content vs align-content
這兩個屬性的差異：

| 屬性                | 作用對象       | 方向 | 生效條件            |
| ------------------- | -------------- | ---- | ------------------- |
| **justify-items**   | 單元格內的項目 | 水平 | 總是生效            |
| **align-items**     | 單元格內的項目 | 垂直 | 總是生效            |
| **justify-content** | 整個網格       | 水平 | 網格寬度 < 容器寬度 |
| **align-content**   | 整個網格       | 垂直 | 網格高度 < 容器高度 |

**記憶口訣**：
- **items**：控制項目在**單元格內**的對齊
- **content**：控制**整個網格**在容器內的對齊
:::

<GridExample 
  title="align-content 範例"
  description="調整 align-content 觀察整個網格的垂直對齊"
  gridTemplateColumns="repeat(3, 1fr)"
  gridTemplateRows="repeat(3, 100px)"
  alignContent="start"
  itemCount={9}
  showControls="alignContent"
/>

### **8. grid-template-areas**

使用**命名的網格區域**來定義佈局，這是 Grid 最強大且最直觀的功能之一。透過視覺化的方式定義佈局結構，讓程式碼更易讀易維護。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"   /* 第一行：header 跨越 3 列 */
    "sidebar main main"      /* 第二行：sidebar 1 列，main 2 列 */
    "footer footer footer";  /* 第三行：footer 跨越 3 列 */
}

/* 將元素指定到對應的區域 */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

:::tip 使用 . 表示空白單元格
可以使用 `.` 來表示空白的單元格，創建更靈活的佈局：

```css
grid-template-areas:
  "header header header"
  "sidebar main ."        /* 右側留空 */
  "footer footer footer";
```

**多個連續的 `.` 可以合併**：
```css
grid-template-areas:
  "header header header"
  "sidebar main ..."      /* 等同於 ". . ." */
  "footer footer footer";
```
:::

:::info 命名規則與注意事項
**命名規則**：
- 區域名稱必須是有效的 CSS 識別符
- 同一個名稱的單元格必須形成**矩形區域**（不能是 L 型或分散的）
- 每一行必須有相同數量的單元格

**範例**：
```css
/* ✅ 正確：header 形成矩形 */
"header header header"
"sidebar main main"

/* ❌ 錯誤：header 不是矩形 */
"header header sidebar"
"header main main"
```

**優點**：
- 視覺化的佈局定義，一目了然
- 易於調整和重構佈局
- 響應式設計時可以輕鬆改變區域配置
:::

<GridTemplateAreasExample 
  title="grid-template-areas 範例"
  description="使用命名區域創建常見的頁面佈局。試試看點擊預設範本按鈕！"
/>

<br/>

## **Grid Item 屬性**

### **1. grid-column / grid-row**

控制網格項目的**位置和大小**，透過指定項目跨越的網格線來定義。這是 Grid 佈局中最常用的項目屬性。

```css
.item {
  /* 基本語法：起始線 / 結束線 */
  grid-column: 1 / 3;  /* 從第 1 條垂直線到第 3 條垂直線（跨越 2 列） */
  grid-row: 1 / 2;     /* 從第 1 條水平線到第 2 條水平線（跨越 1 行） */
  
  /* 使用 span 關鍵字：起始位置 / 跨越數量 */
  grid-column: 1 / span 2;  /* 從第 1 條線開始，跨越 2 列 */
  grid-row: 2 / span 3;     /* 從第 2 條線開始，跨越 3 行 */
  
  /* 使用負數：從末尾計數 */
  grid-column: 1 / -1;  /* 從第一條線到最後一條線（跨越所有列） */
  
  /* 只指定起始位置（預設跨越 1 個單元格） */
  grid-column: 2;  /* 等同於 grid-column: 2 / 3 */
}

/* 完整寫法（分別設定） */
.item {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

:::info 網格線編號規則
**正數編號**：從左到右、從上到下，從 1 開始
```
  1    2    3    4
1 ┌────┬────┬────┐
  │    │    │    │
2 ├────┼────┼────┤
  │    │    │    │
3 └────┴────┴────┘
```

**負數編號**：從右到左、從下到上，從 -1 開始
- `-1` 表示最後一條線
- `-2` 表示倒數第二條線
- 以此類推

**實用技巧**：
```css
/* 跨越所有列 */
grid-column: 1 / -1;

/* 跨越最後兩列 */
grid-column: -3 / -1;
```
:::

:::tip span 關鍵字的優勢
使用 `span` 可以讓程式碼更具彈性：

```css
/* 方式一：指定結束線（需要知道確切的線號） */
grid-column: 2 / 5;  /* 如果網格結構改變，可能需要調整 */

/* 方式二：使用 span（只需知道要跨越幾個單元格） */
grid-column: 2 / span 3;  /* 更容易維護和理解 */
```
:::

<GridItemExample 
  title="grid-column / grid-row 範例"
  description="調整各項目的 grid-column 和 grid-row 值，控制它們跨越的列和行"
  showControls="all"
/>

### **2. grid-area**

`grid-area` 可以用兩種方式：

**方式一：指定命名區域**
```css
.item {
  grid-area: header; /* 對應 grid-template-areas 中的命名 */
}
```

**方式二：簡寫形式（row-start / column-start / row-end / column-end）**
```css
.item {
  grid-area: 1 / 1 / 3 / 3; /* 等同於 */
  /* grid-row-start: 1;
     grid-column-start: 1;
     grid-row-end: 3;
     grid-column-end: 3; */
}
```

### **3. justify-self**

覆蓋容器的 `justify-items`，定義單個項目的水平對齊：

```css
.item {
  justify-self: auto; /* 預設值，繼承容器的 justify-items */
  justify-self: start;
  justify-self: end;
  justify-self: center;
  justify-self: stretch;
}
```

### **4. align-self**

覆蓋容器的 `align-items`，定義單個項目的垂直對齊：

```css
.item {
  align-self: auto; /* 預設值，繼承容器的 align-items */
  align-self: start;
  align-self: end;
  align-self: center;
  align-self: stretch;
}
```

<br/>

## **Grid 進階技巧**

### **1. 響應式網格 - auto-fill vs auto-fit**

使用 `auto-fill` 和 `auto-fit` 創建響應式網格：

```css
/* auto-fill：盡可能多地放置列，即使是空的 */
.container {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* auto-fit：只放置需要的列，並拉伸填滿空間 */
.container {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

:::tip 差異說明
- `auto-fill`：會創建盡可能多的軌道，即使沒有內容
- `auto-fit`：只創建需要的軌道，並讓現有軌道擴展填滿空間
:::

<GridExample 
  title="響應式網格範例"
  description="選擇 repeat(auto-fit, minmax(150px, 1fr)) 創建響應式網格。試著調整瀏覽器寬度觀察效果！"
  gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
  itemCount={8}
  showControls="gridTemplate"
/>

### **2. minmax() 函數**

定義網格軌道的最小和最大尺寸：

```css
.container {
  /* 列寬最小 100px，最大 1fr */
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  
  /* 行高最小 50px，最大根據內容自動調整 */
  grid-template-rows: repeat(3, minmax(50px, auto));
}
```

### **3. 命名網格線**

可以為網格線命名，讓定位更直觀：

```css
.container {
  grid-template-columns: [start] 1fr [content-start] 2fr [content-end] 1fr [end];
  grid-template-rows: [header-start] auto [header-end main-start] 1fr [main-end footer-start] auto [footer-end];
}

.item {
  grid-column: content-start / content-end;
  grid-row: main-start / main-end;
}
```

### **4. 隱式網格**

當項目被放置在顯式網格之外時，會自動創建隱式網格：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 100px);
  
  /* 控制隱式行的大小 */
  grid-auto-rows: 150px;
  
  /* 控制隱式列的大小 */
  grid-auto-columns: 200px;
  
  /* 控制自動放置的方向 */
  grid-auto-flow: row; /* 預設值，按行填充 */
  grid-auto-flow: column; /* 按列填充 */
  grid-auto-flow: dense; /* 密集填充，填補空隙 */
}
```

<br/>

## **Grid 互動遊樂場**

試試看自己調整所有 Grid 屬性，觀察它們如何互相影響！

<GridExample 
  title="Grid 完整互動範例"
  gridTemplateColumns="repeat(3, 1fr)"
  gridTemplateRows="auto"
  justifyItems="stretch"
  alignItems="stretch"
  justifyContent="start"
  alignContent="start"
  gap={20}
  itemCount={9}
  showControls="all"
/>

<br/>

## **實用佈局範例**

### **聖杯佈局（Holy Grail Layout）**

經典的頁面佈局，包含頁首、側邊欄、主內容區、輔助欄和頁尾：

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

<LayoutExample type="holy-grail" title="聖杯佈局效果" />

### **卡片網格佈局**

響應式卡片佈局，自動適應不同螢幕寬度：

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}
```

<LayoutExample type="card-grid" title="卡片網格效果" />

### **圖片畫廊**

動態圖片畫廊，每三個項目中有一個佔據較大空間：

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-auto-rows: 120px;
  gap: 0.75rem;
}

.gallery-item:nth-child(3n) {
  grid-column: span 2;
  grid-row: span 2;
}
```

<LayoutExample type="gallery" title="圖片畫廊效果" />

<br/>

## **Grid vs Flexbox**

| 特性       | Grid                   | Flexbox                  |
| ---------- | ---------------------- | ------------------------ |
| 維度       | 二維（行和列）         | 一維（行或列）           |
| 適用場景   | 頁面整體佈局、複雜網格 | 元件內部佈局、導航列     |
| 對齊控制   | 精確的網格定位         | 靈活的項目對齊           |
| 內容優先   | 佈局優先（先定義網格） | 內容優先（根據內容調整） |
| 瀏覽器支援 | 現代瀏覽器             | 更廣泛的支援             |

:::tip 選擇建議

- 使用 **Grid** 當你需要：
  - 二維佈局（同時控制行和列）
  - 複雜的頁面結構
  - 精確的元素定位
  - 重疊元素

- 使用 **Flexbox** 當你需要：
  - 一維佈局（單行或單列）
  - 內容驅動的佈局
  - 簡單的元件排列
  - 更好的瀏覽器相容性

- **兩者可以結合使用！** Grid 用於整體佈局，Flexbox 用於元件內部。
:::


<br/>


## **Reference**

- **[MDN - CSS Grid Layout](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_Grid_Layout)**
- **[CSS-Tricks - A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)**
- **[Grid by Example](https://gridbyexample.com/)**
- **[CSS Grid Garden](https://cssgridgarden.com/)** 
- **[Grid Cheatsheet](https://grid.malven.co/)** 
