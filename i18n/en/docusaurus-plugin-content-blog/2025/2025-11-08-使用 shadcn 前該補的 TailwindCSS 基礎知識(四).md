---
title: "TailwindCSS Fundamentals Before shadcn/ui (4): Customizing a Design System with @theme"
slug: tailwindcss-knowledge-before-shadcn-ui-4
authors: bosh
description: "Use TailwindCSS v4’s @theme to define design tokens and generate utilities for colors, radii, fonts, and spacing, including shadcn/ui’s semantic color system."
keywords: [shadcn/ui, TailwindCSS, "@theme", Design Token]
tags: [shadcn/ui, TailwindCSS]
date: 2025-11-08
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1768926380/Docusaurus%20Blog/Blog/%E4%BD%BF%E7%94%A8%20shadcn%20%E5%89%8D%E8%A9%B2%E8%A3%9C%E7%9A%84%20TailwindCSS%20%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98/tailwindcss-theme-cover_kxkysn.png
---

<!-- truncate -->

> This is part 4 of “TailwindCSS Fundamentals Before shadcn/ui.”
>
> **The series:**
>
> 1. [From MUI to a Utility-First Mindset](/en/blog/tailwindcss-knowledge-before-shadcn-ui-1)
> 2. [Understanding How TailwindCSS Works](/en/blog/tailwindcss-knowledge-before-shadcn-ui-2)
> 3. [A Quick Reference to TailwindCSS v4's Built-in Utility Classes](/en/blog/tailwindcss-knowledge-before-shadcn-ui-3)
> 4. **Customizing a Design System with @theme (this article)**
> 5. [Understanding shadcn/ui's Design System](/en/blog/tailwindcss-knowledge-before-shadcn-ui-5)
> 6. [The shadcn/ui Ecosystem and Toolchain](/en/blog/tailwindcss-knowledge-before-shadcn-ui-6)

In the previous article, we covered TailwindCSS's built-in utility classes. In a real project, though, you may need to:

- Define brand-specific colors such as `primary` and `secondary`
- Manage design tokens such as border radii and fonts in one place
- Build a design system that supports themes

That's where `@theme` comes in.

<br/>

## **The Core Idea Behind @theme** {#theme-的核心概念}

`@theme` is a new feature in TailwindCSS v4. It lets you define **design tokens** in CSS, which TailwindCSS then converts into the corresponding utility classes.

### **Namespace Rules** {#命名空間規則}

The key concept is this: TailwindCSS determines which utility classes to generate from the **prefix of a CSS variable**.

| CSS variable prefix | Generated utility classes | Purpose |
| ------------------- | ------------------------- | ------- |
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*`, etc. | Color-related properties |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, etc. | Spacing-related properties |
| `--radius-*` | `rounded-*` | Border radius |
| `--font-family-*` | `font-*` | Font family |
| `--font-size-*` | `text-*` | Font size |
| `--font-weight-*` | `font-*` | Font weight |
| `--line-height-*` | `leading-*` | Line height |
| `--letter-spacing-*` | `tracking-*` | Letter spacing |
| `--shadow-*` | `shadow-*` | Box shadow |

### **Conversion Rules** {#轉換規則}

The type prefix is removed during conversion:

```
--color-primary       → bg-primary, text-primary, border-primary ...
--radius-lg           → rounded-lg
--font-family-heading → font-heading
--spacing-sidebar     → p-sidebar, m-sidebar, w-sidebar ...
```

<br/>

## **Customizing Colors** {#顏色系統的客製化}

### **Basic Usage** {#基礎用法}

```css {3-5}
/* index.css */
@theme inline {
  /* Define color tokens */
  --color-primary: oklch(0.6171 0.1375 39.0427);
  --color-secondary: oklch(0.9245 0.0138 92.9892);
}
```

Once defined, you can use them in JSX:

```tsx
<button className="bg-primary text-white">Primary button</button>
<button className="bg-secondary text-black">Secondary button</button>
<div className="border-2 border-primary">Primary-colored border</div>
```

:::info[**Which Utility Classes Does This Generate?**]
Defining `--color-primary` automatically produces:

- `bg-primary` for background color
- `text-primary` for text color
- `border-primary` for border color
- `ring-primary` for ring color
- `shadow-primary` for shadow color
- `from-primary`, `to-primary`, and `via-primary` for gradients
- ...and the other utility classes that take colors
:::

### **shadcn/ui's Color System** {#shadcnui-的顏色系統}

shadcn/ui takes this a step further by splitting its CSS variables into two layers:

```css {3-8,12-19}
/* index.css */
@theme inline {
  /* Layer 1: TailwindCSS design tokens (generate utility classes) */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
}

:root {
  /* Layer 2: Actual color values */
  --primary: oklch(0.6171 0.1375 39.0427);
  --primary-foreground: oklch(1 0 0);
  --destructive: oklch(0.5 0.2 30);
  --destructive-foreground: oklch(1 0 0);
}
```

**Why use two layers?**

1. The variables in `@theme inline` tell TailwindCSS to generate utility classes.
2. The variables in `:root` store the actual color values.
3. You can then override the colors in `.dark` without redefining `@theme`.

Usage:

```tsx
// primary is the background; primary-foreground is the text color on it
<button className="bg-primary text-primary-foreground">
  Primary button
</button>

// destructive is the red used for warnings or deletion
<button className="bg-destructive text-destructive-foreground">
  Delete button
</button>
```

:::info[**What Does foreground Mean?**]
`foreground` usually refers to the text color used on a given background.

shadcn/ui provides a pair for each semantic color:

- A main color, such as `primary`, for the background
- A foreground color, such as `primary-foreground`, for text on that background

This keeps enough contrast between the text and its background.
:::

### **Why Use Semantic Colors?** {#語意化顏色的好處}

```tsx
// ❌ Fixed colors: changing the theme color requires edits in many places
<button className="bg-blue-500 text-white">Button</button>
<div className="border-blue-500">Border</div>
<p className="text-blue-600">Text</p>

// ✅ Semantic colors: change the CSS variables and every usage updates
<button className="bg-primary text-primary-foreground">Button</button>
<div className="border-primary">Border</div>
<p className="text-primary">Text</p>
```

<br/>

## **Customizing Border Radii** {#圓角的客製化}

### **Defining Semantic Radii** {#定義語意化圓角}

```css {3-7,11}
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

Usage:

```tsx
<div className="rounded-sm">Smaller radius</div>
<div className="rounded-md">Medium radius</div>
<div className="rounded-lg">Standard radius</div>
<div className="rounded-xl">Larger radius</div>
```

:::tip[**Why Use calc?**]
With a value such as `calc(var(--radius) - 2px)`, changing `--radius` in `:root` adjusts all of the related radii together.
:::

<br/>

## **Customizing Fonts** {#字型的客製化}

### **Defining Custom Fonts** {#定義自訂字型}

```css {3-5}
/* index.css */
@theme inline {
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-family-heading: "Cal Sans", "Inter", sans-serif;
  --font-family-mono: "Fira Code", ui-monospace, monospace;
}
```

Usage:

```tsx
<p className="font-sans">Body text uses Inter</p>
<h1 className="font-heading">Headings use Cal Sans</h1>
<code className="font-mono">Code uses Fira Code</code>
```

<br/>

## **Customizing Spacing** {#間距的客製化}

### **Defining Semantic Spacing** {#定義語意化間距}

```css {3-5}
/* index.css */
@theme inline {
  --spacing-sidebar: 16rem;
  --spacing-header: 4rem;
  --spacing-content: 2rem;
}
```

Usage:

```tsx
<aside className="w-sidebar">Sidebar width: 16rem</aside>
<header className="h-header">Header height: 4rem</header>
<main className="p-content">Content padding: 2rem</main>
```

<br/>

## **Reference** {#reference}

- [**Customizing Colors - TailwindCSS**](https://tailwindcss.com/docs/customizing-colors)
- [**Theme Configuration - TailwindCSS**](https://tailwindcss.com/docs/v4-beta#theme)
- [**Font Family - TailwindCSS**](https://tailwindcss.com/docs/font-family)
- [**Border Radius - TailwindCSS**](https://tailwindcss.com/docs/border-radius)
