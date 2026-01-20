---
title: "使用 shadcn/ui 前該補的 TailwindCSS 基礎知識(六) - shadcn/ui 生態系工具鏈"
slug: tailwindcss-knowledge-before-shadcn-ui-6
authors: bosh
description: 深入探討 shadcn/ui 背後的核心工具鏈：clsx、tailwind-merge、tw-animate-css、CVA 和 components.json。學習如何透過這些工具解決條件式樣式、className 衝突、動畫實作、元件變體管理等實際開發問題，打造更靈活且易維護的 UI 元件系統。
keywords:
  [
    shadcn/ui,
    TailwindCSS,
    clsx,
    tailwind-merge,
    tw-animate-css,
    CVA,
    components.json,
  ]
tags: [shadcn/ui, TailwindCSS]
date: 2025-11-12
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1762873277/Docusaurus%20Blog/Blog/%E4%BD%BF%E7%94%A8%20shadcn%20%E5%89%8D%E8%A9%B2%E8%A3%9C%E7%9A%84%20TailwindCSS%20%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98/shadcn-tools_xmlnga.png
---

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1762873277/Docusaurus%20Blog/Blog/%E4%BD%BF%E7%94%A8%20shadcn%20%E5%89%8D%E8%A9%B2%E8%A3%9C%E7%9A%84%20TailwindCSS%20%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98/shadcn-tools_xmlnga.png)

<!-- truncate -->

> 本文是「使用 shadcn/ui 前該補的 TailwindCSS 基礎知識」系列文章的第六篇
>
> **系列文章：**
>
> 1. [從 MUI 到 TailwindCSS 設計哲學的轉變](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-1)
> 2. [理解 TailwindCSS 的運作原理](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-2)
> 3. [TailwindCSS v4 內建 Utility Classes 速查](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-3)
> 4. [透過 @theme 自訂設計系統](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-4)
> 5. [解析 shadcn/ui 的設計系統](https://notes.boshkuo.com/blog/tailwindcss-knowledge-before-shadcn-ui-5)
> 6. **shadcn/ui 生態系工具鏈（本篇）**

在使用過 shadcn/ui 的提供的程式碼後，會發現 shadcn/ui 並不是只有單純使用 Tailwind 而已，常會搭配幾個工具來解決在實際開發中會遇到的各種問題，例如：條件式樣式、className 衝突、元件變體管理等。以下將逐一介紹這些工具。

## **clsx 與 tailwind-merge：className 管理的最佳拍檔**

### **clsx：條件式 className 組合**

在寫 React 元件時，經常會遇到需要根據 props 或狀態來決定要套用哪些 className 的情況。例如：

- 按鈕有不同的變體（primary、secondary、outline）
- 元件有不同的尺寸（sm、md、lg）
- 根據狀態顯示不同樣式（active、disabled、loading）

如果用傳統的字串拼接，程式碼會變得很難維護：

```tsx
// ❌ 難以維護的寫法
const className =
  "btn" +
  (isPrimary ? " btn-primary" : "") +
  (isLarge ? " btn-large" : "") +
  (isDisabled ? " btn-disabled" : "");
```

`clsx`  就是為了解決這個問題而生的工具。它讓你可以用更直觀的方式組合條件式的 className：

```tsx
import clsx from "clsx";

// ✅ 清晰易讀的寫法
const className = clsx("btn", {
  "btn-primary": isPrimary,
  "btn-large": isLarge,
  "btn-disabled": isDisabled,
});
```

### **tailwind-merge：解決 className 衝突**

在建立可重複使用的元件時，經常會遇到一個棘手的問題：**使用者傳入的 className 可能會與元件預設的 className 衝突**。

例如，元件預設有  `p-4`  的內距，但使用者想要傳入  `p-8`  來覆蓋它。如果只用 clsx，兩個 className 都會存在，而實際套用哪個取決於 CSS 載入順序，結果不可預測：

```tsx
// ❌ 問題：兩個 padding 都存在
<div className={clsx("p-4", customPadding)}>
  {/* 如果 customPadding = 'p-8'，p-4 和 p-8 都會存在 */}
  {/* 實際套用哪個？不確定！ */}
</div>
```

`tailwind-merge`  會智慧地判斷哪些 className 是衝突的，並保留後面的那一個：

```tsx
import { twMerge } from "tailwind-merge";

// ✅ 解決方案：後面的覆蓋前面的
<div className={twMerge("p-4", "p-8")}>{/* 結果: "p-8"（p-4 被移除） */}</div>;
```

### **cn 函數：clsx + tailwind-merge 的完美組合**

在實際開發中，通常會同時需要 `clsx` 的條件式組合能力和 `tailwind-merge` 的衝突解決能力。因此，shadcn/ui 定義了一個  `cn`  函數，結合了兩者的優勢。

在 shadcn/ui 的  `utils.ts`  中可以看到這個函數的定義：

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

這個簡單的函數先用 clsx 處理條件式組合，再用 tailwind-merge 解決衝突。使用者可以輕鬆地覆蓋預設樣式，而不用擔心 className 衝突的問題。

<br/>

## **tw-animate-css：TailwindCSS v4 的動畫解決方案**

在 TailwindCSS v4 推出後，原本廣泛使用的  `tailwindcss-animate`  插件因為基於舊的 JavaScript 插件系統而無法直接使用。`tw-animate-css`  就是為了解決這個問題而生的替代方案，它採用 TailwindCSS v4 的 CSS-first 架構，提供純 CSS 的動畫解決方案。

### **安裝與使用**

```bash
npm install tw-animate-css
```

在 CSS 入口檔案中引入：

```css
@import "tailwindcss";
@import "tw-animate-css";
```

### **基本用法**

**Enter/Exit 動畫：**

```tsx
// 淡入動畫
<div className="animate-in fade-in duration-500">
  淡入效果
</div>

// 從上方滑入
<div className="animate-in slide-in-from-top duration-300">
  從上方滑入
</div>

// 淡出動畫
<div className="animate-out fade-out duration-500">
  淡出效果
</div>

// 組合多種效果
<div className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
  延遲 100ms 後，從下方淡入滑入
</div>
```

**動畫參數控制：**

```tsx
// 控制動畫時長
<div className="animate-in fade-in duration-150">快速淡入</div>
<div className="animate-in fade-in duration-1000">慢速淡入</div>

// 控制緩動函數
<div className="animate-in slide-in-from-left ease-in-out">
  使用 ease-in-out
</div>

// 控制延遲
<div className="animate-in fade-in delay-500">延遲 500ms</div>

// 控制重複次數
<div className="animate-bounce repeat-infinite">無限彈跳</div>
<div className="animate-pulse repeat-3">重複 3 次</div>

// 控制方向
<div className="animate-bounce direction-alternate">來回彈跳</div>
```

**現成的動畫：**

```tsx
// Accordion 動畫（常用於展開/收合元件）
<div className="animate-accordion-down">展開</div>
<div className="animate-accordion-up">收合</div>

// 閃爍游標（常用於輸入提示）
<span className="animate-caret-blink">|</span>
```

shadcn/ui 的許多元件都內建了動畫效果，這些動畫大多使用  `tw-animate-css`  或類似的動畫工具實作。例如：

- **Accordion**：使用  `accordion-down`  和  `accordion-up`
- **Dialog**：使用  `fade-in`  和  `slide-in-from-bottom`
- **Dropdown Menu**：使用  `slide-in-from-top`  和  `fade-in`
- **Toast**：使用  `slide-in-from-right`  和  `fade-in`

可以查看  [tw-animate-css GitHub](https://github.com/Wombosvideo/tw-animate-css)  可以了解更多進階用法和完整的 API 文件。

<br/>

## **Class Variance Authority (CVA)：元件變體管理**

在建立可重複使用的元件時，經常會遇到這樣的需求：

- 按鈕有不同的外觀變體（primary、secondary、outline、ghost）
- 每個變體有不同的尺寸（sm、md、lg）
- 需要組合這些變體（例如：大尺寸的 outline 按鈕）

如果用傳統的方式，需要寫很多 if-else 或 switch-case 來處理這些組合，程式碼會變得很難維護。

**CVA (Class Variance Authority)**  就是為了解決這個問題而生的工具。它讓我們可以用宣告式的方式定義元件的「基礎樣式」和「變體樣式」，然後根據 props 自動組合出正確的 className。

### **CVA 的核心概念**

CVA 將元件的樣式分為三個部分：

1. **基礎樣式 (Base)**：所有變體都共用的樣式
2. **變體樣式 (Variants)**：不同變體的專屬樣式
3. **複合變體 (Compound Variants)**：當多個變體組合時的特殊樣式（選用）

### **實際應用：Button 元件**

以 shadcn/ui 的  Button 元件為例，來看看 CVA 如何使用：

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // 基礎樣式：所有按鈕都會套用
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // variant 變體：定義不同的外觀
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // size 變體：定義不同的尺寸
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    // 預設值：當使用者沒有指定時使用
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

定義好  `buttonVariants`  後，在元件中使用：

```tsx
function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// 使用範例
<Button>預設按鈕</Button>
<Button variant="destructive" size="lg">大尺寸刪除按鈕</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

**CVA 的核心優勢：**

1. **型別安全**：TypeScript 會自動推斷可用的變體選項，寫錯會直接報錯
2. **易於維護**：所有樣式集中在一個地方，修改時不用到處找
3. **靈活組合**：可以輕鬆組合不同的變體，不用手動處理邏輯
4. **預設值支援**：可以設定預設的變體，簡化使用

### **進階功能：compoundVariants**

CVA 還支援  `compoundVariants`，用於定義「當多個變體組合時的特殊樣式」。例如：

```tsx
const buttonVariants = cva("base-styles", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
    size: {
      sm: "text-sm",
      lg: "text-lg",
    },
    outlined: {
      true: "border-2",
      false: "",
    },
  },
  // 複合變體：當多個條件同時滿足時套用
  compoundVariants: [
    {
      // 當 variant="primary" 且 outlined=true 時
      variant: "primary",
      outlined: true,
      class: "border-blue-500 bg-transparent text-blue-500 hover:bg-blue-50",
    },
    {
      // 當 size="lg" 且 outlined=true 時
      size: "lg",
      outlined: true,
      class: "border-4", // 大尺寸的外框按鈕使用更粗的邊框
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "sm",
    outlined: false,
  },
});
```

使用範例：

```tsx
// 會套用 primary + outlined 的複合變體樣式
<Button variant="primary" outlined={true}>
  Primary Outlined Button
</Button>

// 會套用 lg + outlined 的複合變體樣式
<Button size="lg" outlined={true}>
  Large Outlined Button
</Button>

// 會同時套用兩個複合變體的樣式
<Button variant="primary" size="lg" outlined={true}>
  Large Primary Outlined Button
</Button>
```

<br/>

## **components.json：shadcn/ui 的配置中心**

`components.json`  是 shadcn/ui CLI 的核心配置檔。當使用  `npx shadcn@latest add button`  安裝元件時，CLI 會讀取這個檔案來決定：

- 元件應該安裝到哪個目錄
- 使用什麼樣的風格（default 或 new-york）
- 是否使用 TypeScript
- 路徑別名是什麼
- 是否使用 CSS 變數
- 從哪些 registry 安裝元件

### **components.json 的完整結構**

以下是一個完整的  `components.json`  範例：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### **各欄位說明**

**$schema**

```json
"$schema": "https://ui.shadcn.com/schema.json"
```

指向 shadcn/ui 的 JSON schema，提供 IDE 自動完成功能和欄位驗證。

**style**

```json
"style": "new-york"// 或 "default"
```

選擇元件風格。shadcn/ui 提供兩種預設風格：

- **default**：較為簡潔的設計
- **new-york**：更現代、更精緻的設計

不同風格的元件在視覺設計和細節上有所不同，但功能完全相同。

**rsc**

```json
"rsc": false
```

是否使用 React Server Components（Next.js 13+ 的功能）。如果專案使用 Next.js App Router，可以設為  `true`。

**tsx**

```json
"tsx": true
```

是否使用 TypeScript。設為  `true`  時，安裝的元件會是  `.tsx`  檔案；設為  `false`  則是  `.jsx`  檔案。

**tailwind**

```json
"tailwind": {
  "config": "",
  "css": "src/index.css",
  "baseColor": "neutral",
  "cssVariables": true,
  "prefix": ""
}
```

TailwindCSS 相關配置：

- **config**：tailwind.config 檔案的位置（TailwindCSS v4 通常不需要此檔案，可留空）
- **css**：CSS 入口檔案的位置，CLI 會在這個檔案中注入必要的 CSS 變數
- **baseColor**：基礎顏色主題，可選：`zinc`、`slate`、`stone`、`gray`、`neutral`
- **cssVariables**：是否使用 CSS 變數（強烈建議開啟，支援暗色模式和主題切換）
- **prefix**：TailwindCSS class 的前綴（例如設為  `"tw-"`  後，所有 class 都會變成  `tw-flex`、`tw-p-4`  等）

**iconLibrary**

```json
"iconLibrary": "lucide"
```

指定使用的圖示庫。shadcn/ui 預設使用  [Lucide Icons](https://lucide.dev/)。

**aliases**

```json
"aliases": {
  "components": "@/components",
  "utils": "@/lib/utils",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "hooks": "@/hooks"
}
```

路徑別名配置，告訴 CLI 各種檔案應該安裝到哪裡：

- **components**：元件的根目錄
- **utils**：工具函數的位置（`cn`  函數會安裝在這裡）
- **ui**：UI 元件的目標目錄
- **lib**：函式庫目錄
- **hooks**：自訂 hooks 的目錄

這些別名必須與專案的  `tsconfig.json`  或  `jsconfig.json`  中的  `paths`  設定一致。

### **registries：自訂元件來源**

`registries`  是 components.json 中最強大但也最容易被忽略的功能。它允許從多個來源安裝元件，包括：

- shadcn/ui 官方 registry
- 第三方 registry（如 v0.dev、Magic UI）
- 私有 registry（公司內部的元件庫）
- 自建 registry

### **基本配置**

```json
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@magicui": "https://magicui.design/r/{name}.json",
    "@acme": "https://registry.acme.com/{name}.json"
  }
}
```

`{name}`  會被替換成元件名稱。例如執行：

```bash
npx shadcn@latest add @v0/dashboard
```

CLI 會從  `https://v0.dev/chat/b/dashboard`  下載元件。

### **進階配置：帶認證的私有 registry**

```json
{
  "registries": {
    "@company": {
      "url": "https://registry.company.com/ui/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}",
        "X-API-Key": "${API_KEY}"
      },
      "params": {
        "version": "latest",
        "team": "frontend"
      }
    }
  }
}
```

環境變數（`${VAR_NAME}`  格式）會自動從系統環境變數中讀取。

使用方式：

```bash
# 設定環境變數export REGISTRY_TOKEN="your-token"
export API_KEY="your-api-key"

# 安裝私有元件
npx shadcn@latest add @company/custom-button
```

### **多 registry 混合使用**

```json
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/r/{name}.json",
    "@v0": "https://v0.dev/chat/b/{name}",
    "@company": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${COMPANY_TOKEN}"
      }
    },
    "@team": {
      "url": "https://team.company.com/{name}.json",
      "params": {
        "team": "frontend",
        "version": "${REGISTRY_VERSION}"
      }
    }
  }
}
```

這樣就可以從不同來源安裝元件：

```bash
# 從 shadcn/ui 官方安裝
npx shadcn@latest add @shadcn/button

# 從 v0.dev 安裝
npx shadcn@latest add @v0/dashboard

# 從公司內部 registry 安裝
npx shadcn@latest add @company/auth-form

# 從團隊 registry 安裝
npx shadcn@latest add @team/data-table
```

> components.json 與 shadcn CLI 的關係  components.json  是 shadcn CLI 的「設定檔」，CLI 會根據這個檔案：
>
> 1. **決定安裝位置**：根據  `aliases`  決定檔案要放在哪裡
> 2. **選擇元件風格**：根據  `style`  下載對應風格的元件
> 3. **處理依賴**：自動安裝元件所需的 npm 套件
> 4. **注入 CSS 變數**：在  `tailwind.css`  中注入必要的 CSS 變數
> 5. **解析 registry**：從指定的 registry 下載元件

<br/>

## **Reference**

- [**TailwindCSS**](https://tailwindcss.com/)
- [**shadcn/ui**](https://ui.shadcn.com/)
- [**clsx**](https://github.com/lukeed/clsx)
- [**tailwind-merge**](https://github.com/dcastil/tailwind-merge)
- [**tw-animate-css**](https://github.com/Wombosvideo/tw-animate-css)
- [**Class Variance Authority (CVA)**](https://cva.style/)
- [**shadcn/ui Registry**](https://ui.shadcn.com/docs/registry)
