---
title: Docusaurus Markdown Features 備忘錄
sidebar_label: "Markdown Features"
description: 在 Docusaurus 中，Markdown 是構建文檔和部落格文章的核心工具。這篇文章將記錄一些我平常在使用 Docusaurus 撰寫文章時，常用到的 Markdown 功能。
last_update:
  date: 2023-06-10
keywords:
  - Docusaurus
  - Markdown
tags:
  - Docusaurus
---


在 Docusaurus 中，Markdown 是構建文檔和部落格文章的核心工具。這篇文章將記錄一些我平常在使用 Docusaurus 撰寫文章時，常用到的 Markdown 功能。



## **內聯目錄 Inline table of contents**

```md
import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc}/>

```

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />


<br/>


## **添加空白行**

```md
<br/>
```


<br/>


## **Quotes 引用框**

```md
> 這是一個引用框
> - 在引用框內也可以疊加其他的 `Markdown` 功能
```

> 這是一個引用框
> - 在引用框內也可以疊加其他的 `Markdown` 功能


<br/>


## **Toggle 展開元素**

````md

<details>
  <summary>Toggle me!</summary>

  This is the detailed content

  ```js
  console.log("Markdown features including the code block are available");
  ```

  You can use Markdown here including **bold** and _italic_ text, and [inline link](https://docusaurus.io)
  <details>
    <summary>Nested toggle! Some surprise inside...</summary>

    😲😲😲😲😲
  </details>
</details>
````

<details>
  <summary>Toggle me!</summary>

  This is the detailed content

  ```js
  console.log("Markdown features including the code block are available");
  ```

  You can use Markdown here including **bold** and _italic_ text, and [inline link](https://docusaurus.io)
  <details>
    <summary>Nested toggle! Some surprise inside...</summary>

    😲😲😲😲😲
  </details>
</details>


<br/>


## **Tabs 切換元素**

```md
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="react"
  values={[
    {label: 'React', value: 'react'},
    {label: 'Angular', value: 'angular'},
    {label: 'Vue', value: 'vue'},
  ]}>
  <TabItem value="react">This is React content</TabItem>
  <TabItem value="angular">This is Angular content</TabItem>
  <TabItem value="vue">This is Vue content</TabItem>
</Tabs>
```
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="react"
  values={[
    {label: 'React', value: 'react'},
    {label: 'Angular', value: 'angular'},
    {label: 'Vue', value: 'vue'},
  ]}>
  <TabItem value="react">This is React content</TabItem>
  <TabItem value="angular">This is Angular content</TabItem>
  <TabItem value="vue">This is Vue content</TabItem>
</Tabs>


<br/>


## **Code blocks 程式碼區塊**

- 加入標題
- 顯示行號
- highlight 特定行數的程式碼

````md
```js title="example.js" showLineNumbers={true} {2-3}
console.log("title: example.js !");
console.log("Hello, world!");
console.log("This is a code block with line numbers and highlighted lines.");
```
````

```js title="example.js" showLineNumbers={true} {2-3}
console.log("title: example.js !");
console.log("Hello, world!");
console.log("This is a code block with line numbers and highlighted lines.");
```


- Interactive code editor
````md
```jsx live
function HelloWorld() {
  return <div>Hello, world!</div>;
}
```
````

```jsx live
function HelloWorld() {
  return <div>Hello, world!</div>;
}
```

- 切換多種程式語言 code blocks
````md
<Tabs>
<TabItem value="js" label="JavaScript">

```js
function helloWorld() {
  console.log('Hello, world!');
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def hello_world():
  print("Hello, world!")
```

</TabItem>
<TabItem value="java" label="Java">

```java
class HelloWorld {
  public static void main(String args[]) {
    System.out.println("Hello, World");
  }
}
```

</TabItem>
</Tabs>
````


<Tabs>
<TabItem value="js" label="JavaScript">

```js
function helloWorld() {
  console.log('Hello, world!');
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def hello_world():
  print("Hello, world!")
```

</TabItem>
<TabItem value="java" label="Java">

```java
class HelloWorld {
  public static void main(String args[]) {
    System.out.println("Hello, World");
  }
}
```

</TabItem>
</Tabs>


<br/>


## **Admonitions 告示**

```md
:::note[備註標題]
This is a note
:::

:::tip[提示標題]
This is a tip
:::

:::info[信息標題]
This is an info
:::

:::caution[警告標題]
This is a caution
:::

:::danger[危險標題]
This is a danger
:::
```

:::note[備註標題]
This is a note
:::

:::tip[提示標題]
This is a tip
:::

:::info[信息標題]
This is an info
:::

:::caution[警告標題]
This is a caution
:::

:::danger[危險標題]
This is a danger
:::


<br/>


## **圖片 Images**

```md
![Docusaurus Logo](https://docusaurus.io/img/docusaurus.png)
```

![Docusaurus Logo](https://docusaurus.io/img/docusaurus.png)


<br/>


## **靜態資源 Static assets**
靜態資源放在 **static** 資料夾中，引用時以 **static** 目錄為根目錄。

```md
![My logo](/img/logo.png)
```

![My logo](/img/logo.png)


<br/>


## **檔案下載連結 Files**
[Download my logo](/img/logo.png)


<br/>


## **Reference**
- **[@Docusaurus](https://docusaurus.io/)**
  - **[Markdown Features](https://docusaurus.io/docs/markdown-features)**
  - **[MDX and React](https://docusaurus.io/docs/markdown-features/react)**
  - **[MDX docs](https://mdxjs.com/)**
  - **[Tabs](https://docusaurus.io/docs/markdown-features/tabs)**
  - **[Code blocks](https://docusaurus.io/docs/markdown-features/code-blocks)**
  - **[Admonitions](https://docusaurus.io/docs/markdown-features/admonitions)**
  - **[Headings and Table of contents](https://docusaurus.io/docs/markdown-features/toc)**
  - **[Assets](https://docusaurus.io/docs/markdown-features/assets)**
  - **[Markdown links](https://docusaurus.io/docs/markdown-features/links)** 
  - **[MDX Plugins](https://docusaurus.io/docs/markdown-features/plugins)**
  - **[Math Equations](https://docusaurus.io/docs/markdown-features/math-equations)**
  - **[Diagrams](https://docusaurus.io/docs/markdown-features/diagrams)**
  - **[Head metadata](https://docusaurus.io/docs/markdown-features/head-metadata)**