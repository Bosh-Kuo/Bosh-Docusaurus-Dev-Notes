---
title: CSS 選擇器 Cheat Sheet
sidebar_label: "[CSS] 選擇器 Cheat Sheet"
description: CSS 選擇器表單
last_update:
  date: 2023-02-28
keywords:
  - CSS
  - Selector
tags:
  - CSS
---



## **元素選擇器**

| 選擇器 | 語法 | 範例 | 說明 |
| --- | --- | --- | --- |
| 元素 | element | p | 選擇所有 `<p>` 元素 |
| 類別 | .class | .example | 選擇所有 class 屬性為 example 的元素 |
| ID | #id | #main-heading | 選擇 id 屬性為 main-heading 的元素 |
| 萬用字元 | * | * | 選取所有元素 |

## **複合選擇器**

| 選擇器 | 語法 | 範例 | 說明 |
| --- | --- | --- | --- |
| 後代 | A B | div p | 選取 `<div>` 元素內的所有 `<p>` 元素 |
| 子元素 | A > B | div > p | 選取 `<div>` 元素直接子元素中所有 `<p>` 元素 |
| 相鄰兄弟 | A + B | div + p | 選取在`<div>` 元素後的首個同輩 `<p>` 元素 |
| 同層兄弟 | A ~ B | p ~ ul | 選取所有在 `<p>` 元素後的所有同層級 `<ul>` 元素 |
| 選擇器組合 | A, B | div, span | 選取所有 `<div>` 元素和所有 `<span>` 元素 |
| 多個類別 | .class1.class2 | .example.warning | 選取所有同時擁有 class1和 class2 類別的元素 |
| 元素和類別 | element.class | p.example | 選取所有同時是 `<p>` 元素且擁有 example 類別的元素 |

## **屬性與屬性值**

| 選擇器種類 | Syntax | 範例 | 說明 |
| --- | --- | --- | --- |
| 等於 | [attribute=value] | [target=_blank] | 選取所有帶有 target 屬性值為 _blank 的元素 |
| 包含字串 | [attribute*=value] | [title*=flower] | 選取所有帶有 title 屬性，且其值中包含 "flower" 字串的元素 |
| 開頭字串 | [attribute^=value] | a[href^="https"] | 選取所有帶有 href 屬性，且其值以 "https" 開頭的元素 |
| 結尾字串 | [attribute$=value] | a[href$=".pdf"] | 選取所有帶有 href 屬性，且其值以 ".pdf" 結尾的元素 |
| 無此屬性 | [attribute=undefined] | a[target=undefined] | 選取所有帶有 target 屬性，但其值為 undefined 的元素 |
| 多個屬性 | [attribute1][attribute2] | [target][rel] | 選取所有帶有 target 和 rel 屬性的元素 |

## **偽類與偽元素**

| 選擇器種類 | Syntax | 範例 | 說明 |
| --- | --- | --- | --- |
| 偽類 | :link | a:link | 選取所有未被訪問過的連結 |
| 偽類 | :visited | a:visited | 選取所有已被訪問過的連結 |
| 偽類 | :hover | a:hover | 選取當前鼠標指針懸停在其上的元素 |
| 偽類 | :active | a:active | 選取被用戶點擊的元素 |
| 偽類 | :focus | input:focus | 選取當前鍵盤焦點在其中的元素 |
| 偽類 | :not(selector) | :not(p) | 選取除 `<p>` 元素以外的所有元素 |
| 偽類 | :nth-child(n) | p:nth-child(2) | 選取其父元素下的第二個 `<p>` 元素 |
| 偽類 | :nth-of-type(n) | p:nth-of-type(2) | 選取其父元素下的第二個 `<p>` 元素，且該元素必須為 `<p>` 元素 |
| 偽類 | :first-child | p:first-child | 選取其父元素下的第一個 `<p>` 元素 |
| 偽類 | :last-child | p:last-child | 選取其父元素下的最後一個 `<p>` 元素 |
| 偽類 | :nth-last-child(n) | p:nth-last-child(2) | 選取其父元素下的倒數第二個 `<p>` 元素 |
| 偽類 | :only-child | p:only-child | 選取其父元素下只有一個子元素的 `<p>` 元素 |
| 偽元素 | ::before | p::before | 在元素內容之前插入新內容 |
| 偽元素 | ::after | p::after | 在元素內容之後插入新內容 |
| 偽元素 | ::first-letter | p::first-letter | 選取元素內容的第一個字母 |
| 偽元素 | ::first-line | p::first-line | 選取元素內容的第一行 |
| 偽元素 | ::selection | ::selection | 選取被用戶選中的文本 |

## **Reference**

- **[CSS 選擇器](https://developer.mozilla.org/zh-TW/docs/Glossary/CSS_Selector)**
- **[CSS 选择器参考手册](https://www.w3school.com.cn/cssref/css_selectors.asp)**
- **[[CSS] 選擇器表 (Selectors)](https://ithelp.ithome.com.tw/articles/10243699)**