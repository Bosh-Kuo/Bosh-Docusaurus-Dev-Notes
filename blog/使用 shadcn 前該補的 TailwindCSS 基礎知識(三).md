---
title: "使用 shadcn/ui 前該補的 TailwindCSS 基礎知識(三) - TailwindCSS v4 基礎語法速查"
slug: tailwindcss-knowledge-before-shadcn-ui-3
authors: bosh
description: 這篇技術筆記整理了 TailwindCSS v4 的核心語法速查，涵蓋顏色系統、間距配置、版面布局、響應式設計等基礎概念，並提供實用的程式碼範例，幫助開發者快速掌握 TailwindCSS 的使用方式，為學習 shadcn/ui 打下紮實基礎。
keywords: [shadcn/ui, TailwindCSS]
tags: [shadcn/ui, TailwindCSS]
date: 2025-11-06
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1762431815/Docusaurus%20Blog/Blog/%E4%BD%BF%E7%94%A8%20shadcn%20%E5%89%8D%E8%A9%B2%E8%A3%9C%E7%9A%84%20TailwindCSS%20%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98/tailwind_syntax_javo4z.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1762431815/Docusaurus%20Blog/Blog/%E4%BD%BF%E7%94%A8%20shadcn%20%E5%89%8D%E8%A9%B2%E8%A3%9C%E7%9A%84%20TailwindCSS%20%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98/tailwind_syntax_javo4z.png)

<!-- truncate -->

> 本文是「使用 shadcn/ui 前該補的 TailwindCSS 基礎知識」系列文章的第二篇
>
> **系列文章：**
>
> 1. [從 MUI 到 TailwindCSS 設計哲學的轉變](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-1)
> 2. [理解 TailwindCSS 的運作原理](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-2)
> 3. **TailwindCSS v4 基礎語法速查（本篇）**
> 4. 深入 TailwindCSS v4 的進階配置
> 5. shadcn/ui 生態系工具鏈

## **顏色系統**

TailwindCSS 的顏色系統非常直覺，格式為：`{屬性}-{顏色}-{深淺度}`

### **基礎顏色語法**

**語法規則說明:**

- **屬性**: 要套用顏色的 CSS 屬性,例如:
  - `bg-` = background-color (背景色)
  - `text-` = color (文字顏色)
  - `border-` = border-color (邊框顏色)
- **顏色**: TailwindCSS 預設提供的顏色名稱,包含:
  - 灰階: `slate`, `gray`, `zinc`, `neutral`, `stone`
  - 色彩: `red`, `orange`, `amber`, `yellow`, ...
- **深淺度**: 從  `50`(最淺) 到  `950`(最深),詳見下方說明

> **完整屬性、顏色參考:** [TailwindCSS Colors 官方文件](https://tailwindcss.com/docs/customizing-colors)

```tsx
// 背景色
<div className="bg-blue-500">藍色背景</div>
<div className="bg-red-600">紅色背景（較深）</div>
<div className="bg-green-400">綠色背景（較淺）</div>

// 文字顏色
<p className="text-gray-700">深灰色文字</p>
<p className="text-blue-500">藍色文字</p>

// 邊框顏色
<div className="border border-red-500">紅色邊框</div>
```

**顏色深淺度規則：**

```
50  - 最淺（幾乎是白色）
100 - 很淺
200 - 淺
300 - 稍淺
400 - 中淺
500 - 標準（預設）
600 - 中深
700 - 深
800 - 很深
900 - 最深（幾乎是黑色）
950 - 極深（v3.2+ 新增）
```

### **語意化顏色（Shadcn/ui 使用的方式）**

在 shadcn/ui 官方範例專案的  `index.css`  或  `globals.css`  中，你會看到像這樣的定義：

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
}

:root {
  --primary: oklch(0.6171 0.1375 39.0427);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.9245 0.0138 92.9892);
  --secondary-foreground: oklch(0.2 0 0);
  /* ... */
}
```

**CSS 變數如何變成 utility classes？**

TailwindCSS v4 的  `@theme inline`  會自動將 CSS 變數轉換為 utility classes，規則如下：

- **CSS 變數格式：** `--color-{顏色名稱}`
- **生成的 utility：** `{屬性}-{顏色名稱}`

範例對應：

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-primary-foreground` → `bg-primary-foreground`, `text-primary-foreground`
- `--color-destructive` → `bg-destructive`, `text-destructive`

然後在元件中使用：

```tsx
// primary 是藍色背景，primary-foreground 是白色文字
<button className="bg-primary text-primary-foreground">
  主要按鈕
</button>

// destructive 是紅色背景，destructive-foreground 是白色文字
<button className="bg-destructive text-destructive-foreground">
  刪除按鈕
</button>
```

:::info[補充：什麼是 foreground？ ]
foreground  是「前景色」，通常指該背景色上的文字顏色。shadcn/ui 會為每個語意化顏色提供一對顏色：主色（如  primary）作為背景色，前景色（如  primary-foreground）作為該背景上的文字顏色，確保有足夠的對比度。
:::

**為什麼要用語意化顏色？**

```tsx
// ❌ 使用固定顏色：如果要改主題色，要改很多地方
<button className="bg-blue-500 text-white">按鈕</button>
<div className="border-blue-500">邊框</div>
<p className="text-blue-600">文字</p>

// ✅ 使用語意化顏色：只需要改 CSS 變數，所有地方自動更新
<button className="bg-primary text-primary-foreground">按鈕</button>
<div className="border-primary">邊框</div>
<p className="text-primary">文字</p>
```

### **透明度控制**

TailwindCSS 支援兩種透明度語法：

```tsx
// 方法 1：使用 / 語法（推薦）
<div className="bg-blue-500/50">50% 透明度的藍色</div>
<div className="bg-red-500/75">75% 透明度的紅色</div>
<div className="text-gray-900/80">80% 透明度的文字</div>

// 方法 2：使用 opacity 屬性（影響整個元素）
<div className="bg-blue-500 opacity-50">整個元素 50% 透明</div>
```

> **重點提醒：** `bg-blue-500/50`  只影響背景色，而  `opacity-50`  會影響整個元素（包括子元素）。

<br/>

## **文字與字型**

### **字體大小**

```tsx
<p className="text-xs">極小文字 (0.75rem)</p>
<p className="text-sm">小文字 (0.875rem)</p>
<p className="text-base">基礎文字 (1rem)</p>
<p className="text-lg">大文字 (1.125rem)</p>
<p className="text-xl">特大文字 (1.25rem)</p>
<p className="text-2xl">2倍大 (1.5rem)</p>
<p className="text-3xl">3倍大 (1.875rem)</p>
<p className="text-4xl">4倍大 (2.25rem)</p>
```

**規則：** `text-{size}`，size 從  `xs`  到  `9xl`

### **字體粗細**

```tsx
<p className="font-thin">極細 (100)</p>
<p className="font-light">細 (300)</p>
<p className="font-normal">正常 (400)</p>
<p className="font-medium">中等 (500)</p>
<p className="font-semibold">半粗 (600)</p>
<p className="font-bold">粗體 (700)</p>
<p className="font-extrabold">特粗 (800)</p>
```

### **行高與字距**

```tsx
<p className="leading-none">無行高</p>
<p className="leading-tight">緊湊行高</p>
<p className="leading-normal">正常行高</p>
<p className="leading-relaxed">寬鬆行高</p>
<p className="leading-loose">很寬鬆行高</p>

// 字距
<p className="tracking-tighter">極緊字距</p>
<p className="tracking-tight">緊字距</p>
<p className="tracking-normal">正常字距</p>
<p className="tracking-wide">寬字距</p>
<p className="tracking-widest">極寬字距</p>
```

### **文字對齊與裝飾**

```tsx
<p className="text-left">靠左對齊</p>
<p className="text-center">置中對齊</p>
<p className="text-right">靠右對齊</p>
<p className="text-justify">兩端對齊</p>

// 裝飾
<p className="underline">底線</p>
<p className="line-through">刪除線</p>
<p className="no-underline">移除底線</p>

// 大小寫
<p className="uppercase">全部大寫</p>
<p className="lowercase">全部小寫</p>
<p className="capitalize">首字母大寫</p>
```

<br/>

## **間距系統（Spacing）**

TailwindCSS 的間距系統是最重要的概念之一。預設的間距單位是  `0.25rem`（4px）。

### **間距規則**

```
數字 × 0.25rem = 實際大小

0   → 0
1   → 0.25rem (4px)
2   → 0.5rem  (8px)
3   → 0.75rem (12px)
4   → 1rem    (16px)
6   → 1.5rem  (24px)
8   → 2rem    (32px)
12  → 3rem    (48px)
16  → 4rem    (64px)
```

### **Margin（外距）**

```tsx
// 四個方向
<div className="m-4">四周 margin 1rem</div>

// 單一方向
<div className="mt-4">上方 margin</div>
<div className="mr-4">右方 margin</div>
<div className="mb-4">下方 margin</div>
<div className="ml-4">左方 margin</div>

// 水平/垂直
<div className="mx-4">左右 margin</div>
<div className="my-4">上下 margin</div>

// 自動置中
<div className="mx-auto">水平置中</div>

// 負值
<div className="-mt-4">負 margin（向上移動）</div>
```

### **Padding（內距）**

```tsx
// 四個方向
<div className="p-4">四周 padding 1rem</div>

// 單一方向
<div className="pt-4">上方 padding</div>
<div className="pr-4">右方 padding</div>
<div className="pb-4">下方 padding</div>
<div className="pl-4">左方 padding</div>

// 水平/垂直
<div className="px-4">左右 padding</div>
<div className="py-4">上下 padding</div>
```

### **Gap（Flexbox/Grid 間距）**

```tsx
// Flexbox 範例
<div className="flex gap-4">
  <div>項目 1</div>
  <div>項目 2</div>
  <div>項目 3</div>
</div>

// Grid 範例
<div className="grid grid-cols-3 gap-6">
  <div>格子 1</div>
  <div>格子 2</div>
  <div>格子 3</div>
</div>

// 分別控制水平/垂直間距
<div className="flex flex-col gap-y-4 gap-x-8">
  {/* 垂直間距 4, 水平間距 8 */}
</div>
```

<br/>

## **版面配置（Layout）**

### **Display 屬性**

```tsx
<div className="block">區塊元素</div>
<div className="inline">行內元素</div>
<div className="inline-block">行內區塊</div>
<div className="flex">Flexbox 容器</div>
<div className="grid">Grid 容器</div>
<div className="hidden">隱藏元素</div>
```

### **Flexbox 布局**

```tsx
// 基礎 Flex 容器
<div className="flex">
  <div>項目 1</div>
  <div>項目 2</div>
</div>

// 方向
<div className="flex flex-row">水平排列（預設）</div>
<div className="flex flex-col">垂直排列</div>
<div className="flex flex-row-reverse">水平反向</div>
<div className="flex flex-col-reverse">垂直反向</div>

// 主軸對齊 (justify-content)
<div className="flex justify-start">靠左</div>
<div className="flex justify-center">置中</div>
<div className="flex justify-end">靠右</div>
<div className="flex justify-between">兩端對齊</div>
<div className="flex justify-around">環繞對齊</div>

// 交叉軸對齊 (align-items)
<div className="flex items-start">頂部對齊</div>
<div className="flex items-center">垂直置中</div>
<div className="flex items-end">底部對齊</div>
<div className="flex items-stretch">拉伸（預設）</div>

// 換行
<div className="flex flex-wrap">允許換行</div>
<div className="flex flex-nowrap">不換行（預設）</div>
```

### **Grid 布局**

```tsx
// 基礎 Grid
<div className="grid grid-cols-3 gap-4">
  {/*         ^^^^^^^^^^^^^ 3欄   ^^^^^ 間距 */}
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// 響應式 Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/*         ^^^^^^^^ 手機1欄 ^^^^^^ 平板2欄 ^^^^^^ 桌面3欄 */}
</div>

// 自動填充
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
  {/* 自動根據容器寬度決定欄數 */}
</div>
```

<br/>

## **尺寸控制**

### **寬度**

```tsx
// 固定寬度
<div className="w-64">寬度 16rem (256px)</div>
<div className="w-96">寬度 24rem (384px)</div>

// 百分比
<div className="w-1/2">50% 寬度</div>
<div className="w-1/3">33.333% 寬度</div>
<div className="w-2/3">66.666% 寬度</div>
<div className="w-full">100% 寬度</div>

// 特殊值
<div className="w-screen">100vw（視窗寬度）</div>
<div className="w-auto">自動寬度</div>
<div className="w-fit">適應內容</div>

// 最小/最大寬度
<div className="min-w-0">最小寬度 0</div>
<div className="max-w-md">最大寬度 28rem</div>
<div className="max-w-screen-lg">最大寬度 1024px</div>
```

### **高度**

```tsx
// 固定高度
<div className="h-64">高度 16rem</div>
<div className="h-screen">100vh（視窗高度）</div>

// 百分比
<div className="h-full">100% 高度</div>
<div className="h-1/2">50% 高度</div>

// 最小/最大高度
<div className="min-h-screen">最小高度 100vh</div>
<div className="max-h-96">最大高度 24rem</div>
```

### **Size（同時設定寬高）**

```tsx
// v4 新增：size 屬性
<div className="size-16">寬高都是 4rem</div>
<div className="size-full">寬高都是 100%</div>

// 實務範例：圖標按鈕
<button className="size-9 rounded-md">
  <Icon />
</button>
```

<br/>

## **邊框與圓角**

### **邊框**

```tsx
// 基礎邊框
<div className="border">1px 邊框（四周）</div>
<div className="border-2">2px 邊框</div>
<div className="border-4">4px 邊框</div>

// 單邊邊框
<div className="border-t">上邊框</div>
<div className="border-r">右邊框</div>
<div className="border-b">下邊框</div>
<div className="border-l">左邊框</div>

// 邊框顏色
<div className="border border-gray-300">灰色邊框</div>
<div className="border border-blue-500">藍色邊框</div>

// 邊框樣式
<div className="border border-solid">實線（預設）</div>
<div className="border border-dashed">虛線</div>
<div className="border border-dotted">點線</div>
```

### **圓角**

```tsx
// 預設圓角
<div className="rounded">0.25rem 圓角</div>
<div className="rounded-md">0.375rem 圓角</div>
<div className="rounded-lg">0.5rem 圓角</div>
<div className="rounded-xl">0.75rem 圓角</div>
<div className="rounded-2xl">1rem 圓角</div>
<div className="rounded-full">完全圓形</div>

// 單角圓角
<div className="rounded-t-lg">上方圓角</div>
<div className="rounded-r-lg">右方圓角</div>
<div className="rounded-b-lg">下方圓角</div>
<div className="rounded-l-lg">左方圓角</div>

// 單一角落
<div className="rounded-tl-lg">左上圓角</div>
<div className="rounded-tr-lg">右上圓角</div>
<div className="rounded-br-lg">右下圓角</div>
<div className="rounded-bl-lg">左下圓角</div>
```

**實務範例：**  使用語意化圓角

自定義語意化的圓角變數：

```css
/* index.css */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.5rem;
}
```

**語意化圓角的使用規則：**

圓角的轉換規則與顏色類似，都會移除類型前綴：

- **CSS 變數格式：** `--radius-{大小}`
- **生成的 utility：** `rounded-{大小}`（移除 `radius-` 前綴）

範例對應：
- `--radius-sm` → `rounded-sm`
- `--radius-md` → `rounded-md`
- `--radius-lg` → `rounded-lg`
- `--radius-xl` → `rounded-xl`

```typescript
// 使用語意化圓角
<div className="rounded-sm">較小圓角</div>
<div className="rounded-lg">標準圓角</div>
<div className="rounded-xl">較大圓角</div>
```

> **對比說明：**
> - 顏色：`--color-primary` → `bg-primary`（移除 `color-` 前綴）
> - 圓角：`--radius-lg` → `rounded-lg`（移除 `radius-` 前綴）

<br/>

## **狀態變化（Pseudo-classes）**

### **Hover 狀態**

```tsx
<button className="bg-blue-500 hover:bg-blue-600">
  滑鼠移上去會變深藍色
</button>

<a className="text-blue-500 hover:underline">
  滑鼠移上去會有底線
</a>

// 多個 hover 效果
<button className="bg-white hover:bg-gray-100 hover:shadow-lg transition">
  滑鼠移上去：背景變灰 + 陰影變大
</button>
```

### **Focus 狀態**

```tsx
<input
  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  placeholder="點擊輸入框看效果"
/>

// 移除預設 outline
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
  自訂 focus 樣式
</button>
```

### **Active 狀態**

```tsx
<button className="bg-blue-500 active:bg-blue-700">點擊時會變更深</button>
```

### **Disabled 狀態**

```tsx
<button
  className="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled
>
  停用按鈕
</button>
```

<br/>

## **響應式設計**

TailwindCSS 使用  **mobile-first**  的響應式設計。

### **斷點規則**

```
（無前綴） 所有尺寸（從 0px 開始）
sm:        640px  以上
md:        768px  以上
lg:        1024px 以上
xl:        1280px 以上
2xl:       1536px 以上

```

**重要觀念：沒有前綴的 class 會套用到所有尺寸**

```tsx
// 這行的意思是：
<div className="flex flex-col md:flex-row">
  {/* 0-767px: flex-col（垂直排列）*/}
  {/* 768px以上: flex-row（水平排列）*/}
</div>

// 完整解釋：
// - flex：所有尺寸都是 Flexbox
// - flex-col：預設（0px起）使用垂直排列
// - md:flex-row：768px 以上改用水平排列
```

### **響應式範例**

```tsx
// 不同螢幕尺寸顯示不同文字大小
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  {/* 0-767px: text-2xl */}
  {/* 768-1023px: text-4xl */}
  {/* 1024px以上: text-6xl */}
  響應式標題
</h1>

// 不同螢幕尺寸不同布局
<div className="flex flex-col md:flex-row">
  {/* 0-767px: 垂直排列 */}
  {/* 768px以上: 水平排列 */}
  <div>左側</div>
  <div>右側</div>
</div>

// 不同螢幕尺寸顯示/隱藏
<div className="hidden md:block">
  {/* 0-767px: 隱藏 */}
  {/* 768px以上: 顯示 */}
  桌面版選單
</div>

<div className="block md:hidden">
  {/* 0-767px: 顯示 */}
  {/* 768px以上: 隱藏 */}
  手機版選單
</div>
```

**實務範例：**  響應式 Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* 
    手機: 1欄
    小平板: 2欄
    大平板: 3欄
    桌面: 4欄
  */}
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

<br/>

## **暗色模式**

### **基本概念：dark: 前綴**

在 TailwindCSS 中，可以用  `dark:`  前綴來指定「暗色模式時要用什麼樣式」。

首先需要在 CSS 中定義  `dark:`  前綴的行為：

```css
/* index.css */
/* 當元素在 .dark class 的範圍內時，dark: 前綴的樣式才會生效 */
@custom-variant dark (&:is(.dark *));
```

接著就可以在元件中使用：

```tsx
/*
- 平常：使用白色背景（`bg-white`）
- 切換到暗色模式時：使用深灰色背景（`dark:bg-gray-900`）
*/
<div className="bg-white dark:bg-gray-900">內容</div>
```

TailwindCSS 會檢查 HTML 有沒有  `dark`  這個 class 來決定是否套用  `dark:`  前綴的樣式：

```html
<!-- 平常（亮色模式） -->
<html>
  <body>
    <div class="bg-white dark:bg-gray-900">內容</div>
    <!-- 顯示：白色背景 -->
  </body>
</html>

<!-- 切換到暗色模式 -->
<html class="dark">
  <body>
    <div class="bg-white dark:bg-gray-900">內容</div>
    <!-- 顯示：深灰色背景 -->
  </body>
</html>
```

當  `<html>`  標籤有  `dark` class 時，所有  `dark:`  開頭的樣式就會生效。通常你會用 JavaScript 來動態加上或移除這個  `dark` class，實現主題切換功能。

### **使用語意化顏色的方式**

不過上面的寫法有個問題：每次要設定顏色都要寫兩次，一次  `bg-white`，一次  `dark:bg-gray-800`，很麻煩。

更好的做法是使用「語意化顏色」搭配 CSS 變數，**不需要** `@custom-variant`  那行。完整的設定如下：

```css
/* index.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

:root {
  --background: white; /* 亮色模式的背景色 */
  --foreground: black; /* 亮色模式的文字色 */
}

.dark {
  --background: #1a1a1a; /* 暗色模式的背景色 */
  --foreground: white; /* 暗色模式的文字色 */
}
```

**各部分的作用：**

1. `@theme inline`
   - 告訴 TailwindCSS 產生對應的 utility classes
   - `--color-background` → 產生  `bg-background`、`text-background`  等 class
   - `--color-foreground` → 產生  `bg-foreground`、`text-foreground`  等 class
2. `:root`  和  `.dark`
   - 定義實際的顏色值
   - `:root`  是預設值（亮色模式）
   - `.dark`  是暗色模式的覆蓋值
   - 這是原生 CSS 的寫法，不需要 TailwindCSS 的特殊配置

使用方式：

```tsx
<div className="bg-background text-foreground">內容</div>
```

**不需要**寫  `dark:`  前綴，但會自動切換顏色。原理是：

1. `bg-background`  實際上使用  `--background`  這個 CSS 變數
2. 當 HTML 有  `dark` class 時，CSS 會自動把  `--background`  的值從白色換成深灰色
3. 同一個  `bg-background` class 在不同模式下會顯示不同顏色

對比兩種寫法：

```tsx
// 傳統寫法：要寫很多 dark: 前綴
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  內容
</div>

// 語意化顏色：不用寫 dark: 前綴
<div className="bg-background text-foreground">
  內容
</div>
```

兩種寫法效果相同，但語意化顏色更簡潔、易維護。這也是 shadcn/ui 推薦的做法。

<br/>

## **Reference**

- [**Customizing Colors - TailwindCSS**](https://tailwindcss.com/docs/customizing-colors)
- [**Background Color - TailwindCSS**](https://tailwindcss.com/docs/background-color)
- [**Text Color - TailwindCSS**](https://tailwindcss.com/docs/color)
- [**Border Color - TailwindCSS**](https://tailwindcss.com/docs/border-color)
- [**Font Size - TailwindCSS**](https://tailwindcss.com/docs/font-size)
- [**Font Weight - TailwindCSS**](https://tailwindcss.com/docs/font-weight)
- [**Line Height - TailwindCSS**](https://tailwindcss.com/docs/line-height)
- [**Letter Spacing - TailwindCSS**](https://tailwindcss.com/docs/letter-spacing)
- [**Text Align - TailwindCSS**](https://tailwindcss.com/docs/text-align)
- [**Padding - TailwindCSS**](https://tailwindcss.com/docs/padding)
- [**Margin - TailwindCSS**](https://tailwindcss.com/docs/margin)
- [**Gap - TailwindCSS**](https://tailwindcss.com/docs/gap)
- [**Display - TailwindCSS**](https://tailwindcss.com/docs/display)
- [**Flexbox - TailwindCSS**](https://tailwindcss.com/docs/flex)
- [**Grid Template Columns - TailwindCSS**](https://tailwindcss.com/docs/grid-template-columns)
- [**Justify Content - TailwindCSS**](https://tailwindcss.com/docs/justify-content)
- [**Align Items - TailwindCSS**](https://tailwindcss.com/docs/align-items)
- [**Width - TailwindCSS**](https://tailwindcss.com/docs/width)
- [**Height - TailwindCSS**](https://tailwindcss.com/docs/height)
- [**Border Width - TailwindCSS**](https://tailwindcss.com/docs/border-width)
- [**Border Radius - TailwindCSS**](https://tailwindcss.com/docs/border-radius)
- [**Hover, Focus, and Other States - TailwindCSS**](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [**Responsive Design - TailwindCSS**](https://tailwindcss.com/docs/responsive-design)
- [**Dark Mode - TailwindCSS**](https://tailwindcss.com/docs/dark-mode)
