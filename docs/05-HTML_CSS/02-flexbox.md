---
title: CSS 彈性盒子 Flexbox
sidebar_label: "[CSS] 彈性盒子 Flexbox"
description: CSS Flexbox 彈性盒子佈局完整教學與互動範例
last_update:
  date: 2024-11-09
keywords: [CSS, Flexbox, Layout, 彈性盒子]
tags: [CSS]
---

import {
FlexboxExample,
FlexItemExample,
AlignSelfExample,
OrderExample
} from '@site/src/components/ExampleComponents/Flexbox';

## **Flexbox 基本概念**

### **主軸與交叉軸**

Flexbox 佈局基於兩個軸線:

- **主軸 (Main Axis)**: 由 `flex-direction` 定義的軸線,flex items 沿著主軸排列
- **交叉軸 (Cross Axis)**: 垂直於主軸的軸線

```
flex-direction: row (預設)
┌─────────────────────────────────┐
│  ↓ Cross Axis                   │
│  ┌───┐ ┌───┐ ┌───┐              │
│  │ 1 │ │ 2 │ │ 3 │ → Main Axis  │
│  └───┘ └───┘ └───┘              │
└─────────────────────────────────┘

flex-direction: column
┌─────────────────┐
│  → Cross Axis   │
│  ┌───┐          │
│  │ 1 │ ↓        │
│  └───┘          │
│  ┌───┐ Main     │
│  │ 2 │ Axis     │
│  └───┘          │
│  ┌───┐          │
│  │ 3 │          │
│  └───┘          │
└─────────────────┘
```

### **容器與項目**

- **Flex Container**: 設定 `display: flex` 或 `display: inline-flex` 的父元素
- **Flex Items**: Flex Container 的直接子元素

## **Flex Container 屬性**

### **1. display**

啟用 Flexbox 佈局:

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

### **2. flex-direction**

定義主軸方向,決定 flex items 的排列方向:

```css
.container {
  flex-direction: row; /* 預設值,水平從左到右 */
  flex-direction: row-reverse; /* 水平從右到左 */
  flex-direction: column; /* 垂直從上到下 */
  flex-direction: column-reverse; /* 垂直從下到上 */
}
```

<FlexboxExample 
  title="flex-direction 範例"
  description="觀察不同 flex-direction 值如何改變項目排列方向"
  flexDirection="row"
  alignItems="center"
  itemCount={4}
  showControls="flexDirection"
/>

### **3. justify-content**

定義 flex items 在主軸上的對齊方式:

```css
.container {
  justify-content: flex-start; /* 預設值,靠主軸起點對齊 */
  justify-content: flex-end; /* 靠主軸終點對齊 */
  justify-content: center; /* 置中對齊 */
  justify-content: space-between; /* 兩端對齊,項目間距相等 */
  justify-content: space-around; /* 項目兩側間距相等 */
  justify-content: space-evenly; /* 所有間距完全相等 */
}
```

:::note[間距示意]

```
space-between: [1]────[2]────[3]
space-around:  ──[1]────[2]────[3]──
space-evenly:  ───[1]───[2]───[3]───
```

:::

<FlexboxExample 
  title="justify-content 範例"
  description="調整 justify-content 觀察主軸上的對齊效果"
  justifyContent="flex-start"
  alignItems="center"
  itemCount={4}
  showControls="justifyContent"
/>

### **4. align-items**

定義 flex items 在交叉軸上的對齊方式:

```css
.container {
  align-items: stretch; /* 預設值,拉伸填滿容器 */
  align-items: flex-start; /* 靠交叉軸起點對齊 */
  align-items: flex-end; /* 靠交叉軸終點對齊 */
  align-items: center; /* 交叉軸置中對齊 */
  align-items: baseline; /* 基線對齊 */
}
```

<FlexboxExample 
  title="align-items 範例"
  description="調整 align-items 觀察交叉軸上的對齊效果"
  alignItems="stretch"
  itemCount={4}
  showControls="alignItems"
/>

### **5. flex-wrap**

定義 flex items 是否換行:

```css
.container {
  flex-wrap: nowrap; /* 預設值,不換行 */
  flex-wrap: wrap; /* 換行,第一行在上方 */
  flex-wrap: wrap-reverse; /* 換行,第一行在下方 */
}
```

:::info 重要觀念
`flex-wrap` 的值決定了 flex container 是**單行容器**還是**多行容器**：

- `flex-wrap: nowrap` → **單行容器** (即使項目很多也會強制在一行)
- `flex-wrap: wrap` 或 `wrap-reverse` → **多行容器** (即使視覺上只有一行)

這個定義會影響 `align-content` 屬性是否生效。參考：[MDN - flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)
:::

<FlexboxExample
  title="flex-wrap 範例"
  description="當容器寬度不足時,觀察 flex-wrap 的換行效果。試著切換到 nowrap 或 wrap-reverse 看看差異!"
  flexWrap="wrap"
  gap={30}
  itemCount={12}
  showControls="flexWrap"
/>

### **6. gap (row-gap, column-gap)**

定義 flex items 之間的間距:

```css
.container {
  gap: 20px; /* 行列間距都是 20px */
  gap: 20px 10px; /* 行間距 20px, 列間距 10px */

  /* 或分別設定 */
  row-gap: 20px;
  column-gap: 10px;
}
```

<FlexboxExample 
  title="gap 範例"
  description="調整 gap 值觀察項目間距變化"
  gap={30}
  flexWrap="wrap"
  itemCount={8}
  showControls="gap"
/>

### **7. align-content**

定義多行 flex container 中,各行在交叉軸上的對齊與分布方式:

```css
.container {
  flex-wrap: wrap;
  align-content: stretch; /* 預設值 */
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: space-evenly;
}
```

:::warning 重要規範
根據 [CSS Flexbox 規範](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)，`align-content` 的生效條件：

- ✅ **多行容器** (`flex-wrap: wrap` 或 `wrap-reverse`) → `align-content` **生效**
  - 即使視覺上只有一行,只要設定了 `flex-wrap: wrap`,就是多行容器
- ❌ **單行容器** (`flex-wrap: nowrap`) → `align-content` **無效**
  - 單行容器請使用 `align-items`

**關鍵概念**：單行/多行容器的定義取決於 `flex-wrap` 的值,而非實際的視覺行數。
:::

<FlexboxExample
  title="align-content 範例"
  description="當有多行時,調整 align-content 觀察行與行之間的對齊效果 (需要 flex-wrap: wrap)"
  flexWrap="wrap"
  alignContent="stretch"
  gap={10}
  itemCount={12}
  showControls="alignContent"
/>

## **Flex Item 屬性**

### **1. flex-grow**

定義 flex item 的放大比例,預設為 0 (不放大):

```css
.item {
  flex-grow: 0; /* 預設值,不放大 */
  flex-grow: 1; /* 放大比例為 1 */
  flex-grow: 2; /* 放大比例為 2 */
}
```

**計算方式**: 當容器有剩餘空間時,按照 `flex-grow` 的比例分配剩餘空間。

```
容器寬度: 600px
Item 1: flex-grow: 1, 基礎寬度: 100px
Item 2: flex-grow: 2, 基礎寬度: 100px
Item 3: flex-grow: 1, 基礎寬度: 100px

剩餘空間: 600 - 300 = 300px
總比例: 1 + 2 + 1 = 4

Item 1 最終寬度: 100 + (300 × 1/4) = 175px
Item 2 最終寬度: 100 + (300 × 2/4) = 250px
Item 3 最終寬度: 100 + (300 × 1/4) = 175px
```

<FlexItemExample 
  title="flex-grow 範例"
  description="調整各項目的 flex-grow 值,觀察剩餘空間如何分配。數值越大,獲得的剩餘空間越多。"
  showControls="flexGrow"
  initialFlexGrow1={1}
  initialFlexGrow2={2}
  initialFlexGrow3={1}
/>

### **2. flex-shrink**

定義 flex item 的縮小比例,預設為 1 (可縮小):

```css
.item {
  flex-shrink: 1; /* 預設值,可縮小 */
  flex-shrink: 0; /* 不縮小 */
  flex-shrink: 2; /* 縮小比例為 2 */
}
```

<FlexItemExample 
  title="flex-shrink 範例"
  description="當容器空間不足時,調整各項目的 flex-shrink 值,觀察它們如何縮小。容器寬度限制為 500px,三個項目各需 200px (總共 600px)。flex-shrink 值越大,承擔的縮小量越多。"
  showControls="flexShrink"
  initialFlexShrink1={0}
  initialFlexShrink2={1}
  initialFlexShrink3={3}
  initialFlexBasis1={200}
  initialFlexBasis2={200}
  initialFlexBasis3={200}
  basisUnit="px"
/>

### **3. flex-basis**

定義 flex item 的初始大小,預設為 `auto`:

```css
.item {
  flex-basis: auto; /* 預設值,根據內容決定 */
  flex-basis: 200px; /* 固定初始寬度 */
  flex-basis: 50%; /* 百分比寬度 */
  flex-basis: 0; /* 完全依賴 flex-grow 分配空間 */
}
```

<FlexItemExample 
  title="flex-basis 範例"
  description="調整各項目的 flex-basis 值,設定它們的初始大小。這是在分配剩餘空間之前的基礎大小。"
  showControls="flexBasis"
  initialFlexBasis1={100}
  initialFlexBasis2={200}
  initialFlexBasis3={150}
  basisUnit="px"
/>

### **4. flex (簡寫)**

`flex` 是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的簡寫:

```css
.item {
  flex: 0 1 auto; /* 預設值 */
  flex: 1; /* 等同於 flex: 1 1 0% */
  flex: 2; /* 等同於 flex: 2 1 0% */
  flex: auto; /* 等同於 flex: 1 1 auto */
  flex: none; /* 等同於 flex: 0 0 auto */
}
```

:::tip 建議
建議使用 `flex` 簡寫而不是分別設定三個屬性,這樣更簡潔且不易出錯。
:::

### **5. align-self**

允許單個 flex item 覆蓋 `align-items` 的設定:

```css
.item {
  align-self: auto; /* 預設值,繼承容器的 align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;
  align-self: baseline;
}
```

<AlignSelfExample 
  title="align-self 範例"
  description="調整各項目的 align-self 值,讓個別項目有不同的交叉軸對齊方式。容器預設使用 align-items: stretch。"
/>

### **6. order**

定義 flex item 的排列順序,預設為 0:

```css
.item {
  order: 0; /* 預設值 */
  order: 1; /* 排在後面 */
  order: -1; /* 排在前面 */
}
```

數值越小越靠前,相同數值則按照 HTML 順序排列。

<OrderExample 
  title="order 範例"
  description="調整各項目的 order 值,改變它們的視覺順序。試試看設定不同的數字(可以是負數)!"
/>

:::caution 可訪問性注意事項
使用 `order` 會改變視覺順序但不會改變 DOM 順序,這可能影響鍵盤導航和螢幕閱讀器的使用體驗。請謹慎使用。
:::

## **Flexbox 互動遊樂場**

試試看自己調整所有 Flexbox 屬性,觀察它們如何互相影響!

<FlexboxExample 
  title="Flexbox 完整互動範例"
  justifyContent="center"
  alignItems="center"
  alignContent="flex-start"
  flexWrap="nowrap"
  gap={20}
  itemCount={6}
  showControls="all"
/>

## **Flexbox vs Grid**

| 特性     | Flexbox                  | Grid                   |
| -------- | ------------------------ | ---------------------- |
| 維度     | 一維 (行或列)            | 二維 (行和列)          |
| 適用場景 | 導航列、卡片排列、工具列 | 頁面整體佈局、複雜網格 |
| 對齊方式 | 靈活的項目對齊           | 精確的網格定位         |
| 響應式   | 自動換行、彈性調整       | 明確的網格區域         |

:::tip 選擇建議

- 使用 **Flexbox** 當你需要在一個方向上排列項目
- 使用 **Grid** 當你需要同時控制行和列的佈局
- 兩者可以結合使用!
  :::

## **Reference**

- **[MDN - Flexbox](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_Flexible_Box_Layout)**
- **[CSS-Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)**
- **[Flexbox Froggy](https://flexboxfroggy.com/)**
- **[Flexbox Defense](http://www.flexboxdefense.com/)**
