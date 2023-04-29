---
title: Next.js 基礎功能實作
sidebar_label: "[快速導讀] Next.js 基礎功能實作"
description: 本篇為閱讀 Next.js 官方教學文章的學習筆記
last_update:
  date: 2023-03-15
keywords:
  - React
  - Next.js
tags:
  - React
  - Next.js
---


## **Create a Next.js App**
使用 [create-next-app](https://nextjs.org/docs/api-reference/create-next-app) 建立 Next.js app
```shell
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
```

安裝 `next`, `react` and `react-dom` packages
```shell
npm install next react react-dom
# or
yarn add next react react-dom
# or
pnpm add next react react-dom
```

在 `package.json` 中添加 `scripts`:
```json
"scripts": {
  "dev": "next dev",  // to start Next.js in development mode
  "build": "next build",  // to build the application for production usage
  "start": "next start",  // to start a Next.js production server
  "lint": "next lint"  // to set up Next.js' built-in ESLint configuration
}
```


<br/>


## **Navigate Between Pages**
### **Page in Next.js**
`/pages` 文件夾是用於創建應用程式頁面的地方。在 `/pages` 文件夾中，每個檔案可以導出一個 React component，這個 component 將用於渲染相應的頁面，而每個檔案名稱代表一個 URL 路徑。例如，`pages/index.js` 檔案將處理應用程式的根路徑 `/`。

`/pages` 文件夾內的結構和命名方式也具有一定的規範。例如，`pages/posts/first-post.js`，就會創建一個路徑為 `/posts/first-post` 的頁面。同時，`pages/index.js` 文件是應用程式的首頁，也就是應用程式的根路徑 `/`。


### **Link Component**
Next.js 的 `Link` component 是一個內置的 React component(next/link)，用於在 Next.js 應用程式中實現**客戶端路由**，意味著頁面轉換使用 JavaScript 進行，這比瀏覽器完成的默認導航更快。。它可以幫助我們在不刷新整個頁面的情況下切換頁面，從而提供更好的用戶體驗。Link component 在使用時需要指定 href 屬性，該屬性指定頁面的 URL。當用戶點擊 Link component時，Next.js 將通過內部路由系統切換到新的頁面，而**無需重新加載整個應用程式**。

```jsx
import Link from 'next/link'

function IndexPage() {
  return (
    <div>
      <h1>歡迎來到首頁</h1>
      <Link href="/about">
        <a>關於我們</a>
      </Link>
    </div>
  )
}

export default IndexPage
```

:::info 補充
Next.js 自動進行 `code splitting`，因此每個頁面只加載該頁面所需的內容。這確保即使有數百個頁面，主頁也能快速加載。

僅加載請求的頁面程式碼也意味著頁面間互相獨立。如果某個頁面拋出錯誤，應用程式的其餘部分仍然可以工作。此外，在 product 階段，當 Link component 出現在瀏覽器中時，Next.js 會自動在後台預取(`prefetching`) Link 連接頁面的程式碼。點擊連結時，目標頁面的程式碼已經加載完成，可以達到更即時的頁面轉換。
:::


<br/>


## **Assets, Metadata, and CSS**

在 Next.js 中，靜態資源集中於 `/public` 文件夾中。`/public` 中的文件可以從類似於頁面的應用的根目錄中引用。如以下範例，可在其他頁面引用：

```jsx title=public/images/profile.jpg
<img src="/images/profile.jpg" alt="Your Name" />
```

### **Image Component and Image Optimization**

Next.js 的 [next/image](https://nextjs.org/docs/api-reference/next/image) 是 HTML `<img>` 元素的擴展，提供了Image Component ，是一個可優化圖像載入效能的 React 組件。使用 `Image Component` 載入圖片可以帶來幾個好處：

1. **自動優化圖片大小**：使用 Image Component 可以自動優化圖片的大小，減少圖片載入時間，提高網頁性能。
2. **支援多種格式**：Image Component 支援多種圖片格式，包括 JPEG、PNG、WebP 等。這可以確保瀏覽器可以載入最適合的格式，進一步提高載入速度。
3. **自動選擇最佳的圖片大小**：Image Component 可以根據不同螢幕大小自動選擇最佳的圖片大小，這可以確保圖片不會在大螢幕下變得模糊，也不會在小螢幕下佔用過多空間。

```jsx
import Image from 'next/image';

function MyComponent() {
  return (
    <div>
      <Image
        src="/my-image.jpg"
        alt="My Image"
        width={500}
        height={500}
      />
    </div>
  );
}
```

:::tip
Next.js 的 `Image Component` 不是在建置時自動優化圖片，而是當使用者訪問網頁時動態地優化圖片。這種做法避免了在建置時將大量的圖片進行處理和儲存所需的時間和資源。相反，只有在需要時才會進行圖片優化和載入，從而提高了性能和減少了網頁載入時間。

`Image Component` 預設啟用了 `lazy loaded`，這意味著在畫面外的圖片不會立即載入，而是當它們進入視窗範圍時才會載入。這有助於減少網頁載入時間和頁面速度的提高。此外，`Image Component` 還可以避免累積版面位移 (Cumulative Layout Shift)，這是 Google 將在搜索排名中使用的一種核心網頁指標。這通常是因為網頁中的圖片尺寸未指定或未經優化而導致的。但是，Image Component 會在圖片載入之前，確定圖片的尺寸和佔位符，以避免任何版面位移。

:::


### **CSS Modules**
CSS Modules 是一種用於管理 CSS 的技術，它的主要目的是解決 **CSS 命名衝突**的問題。在傳統的 CSS 中，當開發者編寫樣式時，往往會使用全域命名，這樣容易導致樣式的**污染**和**命名衝突**。而 CSS Modules 可以讓開發者在組件級別上創建作用域，從而避免了命名衝突的問題。

CSS Modules 的基本思想是將 CSS 文件編譯成一個 **object**，然後在 JavaScript 中引用這個 object，這樣可以在 JavaScript 中訪問 CSS 樣式，並在運行時將 CSS 樣式應用到元素上。編譯後的對象中，每個 CSS 樣式都有一個唯一的名稱，因此不會發生命名衝突的問題。在 Next.js 中，使用 CSS Modules 還可以享受到 `code splitting` 的好處。`code splitting` 可以將每個頁面所需的最小化的 CSS 加載，從而減少了頁面的加載時間和網頁大小。這種方式適用於大型應用程序，因為它可以大大提高性能和網頁速度。

```jsx
import styles from './layout.module.css';

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}
```

:::info 補充
要使用 CSS Modules，CSS 文件名必須以 .module.css 結尾。
:::


### **Global Styles**

CSS Modules 對於 **component-level style** 很有用，但若想把 CSS 添加到每一個頁面上則可以使用 `Global Styles`。在 Next.js 中，`Global Styles` 是指在整個應用程式中都會使用的樣式，使用 Global Styles 可以讓整個應用程式的外觀看起來更統一，並且減少在各個頁面上都要引入相同樣式的重複程式碼。

在 `/pages` 目錄下建立一個名為 `_app.js` 的檔案，並在裡面引入需要的 CSS 檔案。

```jsx
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```


<br/>


## **Pre-rendering and Data Fetching**

### **Pre-rendering**
Next.js 預設會進行預渲染 (`pre-rendering`)，也就是事先將每個頁面產生 HTML 檔案，而不是讓客戶端的 JavaScript 進行渲染。透過預渲染，可以提高網站的效能和搜尋引擎最佳化 (SEO)。每個產生的 HTML 檔案都會關聯到該頁面所需的最小 JavaScript 程式碼。當網頁被瀏覽器載入時，與該頁面相關連的 JavaScript 程式碼會運行。(這個過程稱為 **hydration**)。


### **SSR 與 SG 兩種 Pre-rendering**
Next.js 中提供了兩種不同的預渲染方法：`Static Generation (SG)` 與 `Server-Side Rendering (SSR)`。重要的是，Next.js 允許我們選擇每個頁面要使用的 Pre-render 方法，我們可以在部分頁面用 `SG`, 在部分頁面用 `SSR`。Next.js 官方建議：無論頁面上是否有 data, 盡可能用 `SG`。因為這樣頁面只需要在 build 階段編譯，而且可以用 CDN 伺服器儲存頁面資訊，這會比 `SSR` 還快很多。

- `Static Generation` 是在建置時先生成 HTML 檔案，之後每次接到 request 時就可以直接重複使用這些 HTML，不需要再重新生成。
- `Server-Side Rendering(SSR)` 則是每次接到 request 時都會即時生成 HTML，然後再回傳給使用者。

:::tip
在選擇 pre-rendering 方式時，可以問自己：
“我能在使用者發出 request 之前預先渲染這個頁面嗎？”如果答案是肯定的，那麼就應該選擇 `SG`。

另一方面，如果無法在使用者發出請求之前預先渲染頁面，那麼 `SG` 就不是一個好主意。若頁面顯示的是經常更新的數據，並且頁面內容在每次請求時都會變化。那 `SSR` 會是比較好的選擇。
:::


### **使用 getStaticProps 實現 SG**

有些網頁的內容需要在 **build** 階段先從外部獲取數據，例如從文件系統中讀取文件、從外部API中獲取數據，或者數據庫中查詢數據。對於這種情況，Next.js 提供了一種方法，稱為 [Static Generation with data](https://nextjs.org/docs/basic-features/pages#static-generation-with-data)，即支持在 `build` 時預先獲取外部數據並生成HTML頁面。

在 Next.js 中，`getStaticProps` 是一個用來提前獲取數據的函數。它可以在構建時靜態生成頁面所需要的數據，並將其作為 props 傳遞給頁面。這樣，當用戶訪問頁面時，就可以直接使用先前生成的數據，而不必再次獲取。

使用 `getStaticProps` 可以實現靜態生成具有動態數據的頁面。例如，你可以從 API 或數據庫中獲取數據，並在構建時生成 HTML，以便在用戶訪問頁面時快速加載。

以下是使用 `getStaticProps` 的示例：

```jsx
export async function getStaticProps() {
  // Fetch data from external API
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  // Pass data as props
  return {
    props: {
      data
    }
  }
}

function MyPage({ data }) {
  // Render data...
}

export default MyPage
```

在上面的示例中，[getStaticProps](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) 函數會從外部 API 獲取數據，然後將其作為 **data** 屬性傳遞給 `MyPage` component。當用戶訪問 `MyPage` 頁面時，Next.js 會直接使用之前生成的數據，而不必再次從 API 獲取數據。使用 `getStaticProps` 的好處是可以在每次重新生成網站時自動更新網站內容。例如，當網站上的產品頁面需要更新時，只需更新數據庫中的數據，然後重新生成網站即可。

:::tip
使用 `getStaticProps` 可以告訴 Next.js 哪些頁面具有數據依賴關係，在構建時預先解析這些依賴關係。
需要注意的是，在 `dev mode` 下，`getStaticProps` 會在每次請求時運行，而不只在 build 期間運行。
:::

除了從外部 API 獲取資料，`getStaticProps` 也可以直接跟 **database** 要資料，因為 `getStaticProps` 僅在伺服器端運行。它永遠不會在客戶端運行。它甚至不會包含在瀏覽器的 JS 包中。

```jsx
import someDatabaseSDK from 'someDatabaseSDK'

const databaseClient = someDatabaseSDK.createClient(...)

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
```


### **使用 getServerSideProps 實現 SSR**

在 Next.js 中，使用 [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) 可以實現伺服器端渲染（Server-Side Rendering，SSR），這種方式與 `getStaticProps` 類似，不同的是 `getServerSideProps` 在每次請求時都會被呼叫，而不是像 `getStaticProps`
 一樣在建置時執行。

在 Next.js 中，`getServerSideProps` 會接收一個 `context` object 作為參數。

**`context`** object包含以下屬性：

- **params**: 包含動態路由參數的object，如果該頁面沒有動態路由則為空object。
- **req**: HTTP 請求 object，只有在伺服器端運行時才有值。
- **res**: HTTP 響應 object，只有在伺服器端運行時才有值。
- **query**: 包含查詢字符串參數的對象。
- **resolvedUrl**: 當前實際解析的 URL。

```jsx
export async function getServerSideProps(context) {
  // 在此處獲取動態資料，例如從數據庫中獲取資料
  const data = await fetchDataFromDatabase();

  // 將獲取到的動態資料作為 props 返回
  return {
    props: {
      data
    }
  }
}
```

:::tip
若不需要 pre-render data，可以改用 `CSR`。像是 dashboard 這種跟使用者相關的資訊並不會幫助 SEO，就很適合用 `CSR`。
Next.js 建議在 client side 使用官方開發的 data fetching hook：**[SWR](https://swr.vercel.app/)**
，詳細可以參考 @[SWR documentation](https://swr.vercel.app/)
:::


## **Dynamic Routes**

### **Page Path Depends on External Data**

當每個頁面路徑都依賴於外部數據的情況下我們會需要用到 Next.js 的 [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)。 Next.js 的 `Dynamic Routes` 和 [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching/overview#getstaticpaths-static-generation) 是用來建立具有動態路由的靜態網頁的方法。與常規路由不同，動態路由允許我們從 URL 中捕獲變數，進而生成動態網頁內容。例如，假設我們想要建立一個 Blog，使用者可以訪問 **/posts/1** 來瀏覽第一篇博客文章，那麼這裡的 **1** 就是動態路由中的變數。

當我們使用 [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/overview#getstaticprops-static-generation) 生成靜態頁面時，我們需要事先知道所有可能的路徑。對於具有數百個或數千個可能路徑的應用程序，這是不切實際的。這就是為什麼 Next.js 提供了 `getStaticPaths` 方法。透過此方法，我們可以定義需要生成的所有可能路徑。當用戶訪問一個還沒有預先生成的路徑時，Next.js 會根據 `getStaticProps` 方法來生成該路徑的內容。

在官方教學案例中，我們想要為 blog 文章創建動態路由： 我們希望每個文章的路徑為 **/posts/`<id>`**，其中 **`<id>`** 是 markdown 文件的名稱。 由於我們有 **ssg-ssr.md** 和 **pre-rendering.md**，我們希望路徑為 **/posts/ssg-ssr** 和 **/posts/pre-rendering**。

### **Implement getStaticPaths**

使用 **`getStaticPaths`** 需要在 **pages/posts/[id].js** 等動態路由頁面中先定義一個 **`getStaticPaths`** 的 async function，並在該函數中返回一個物件，該物件包含所有動態路由的可能值，稱之為 **`paths`**。簡單來說，就是告訴 Next.js 在建置時需要生成哪些頁面。

:::tip
- 以 `[` 開頭並以 `]` 結尾的頁面表示 Next.js 中的動態路由，不一定要取名為 `[id].js`。
- `path` 必須為一個 objects array，每個 object 裏面都必須有 `params` 這個 key，並且包含一個有 `id` 這個 key 的 object
:::


下面是一個示範：

```jsx
// pages/posts/[id].js

// 首先需要引入 getStaticPaths 和 getStaticProps
import { getStaticPaths, getStaticProps } from 'next'

// 然後定義 getStaticPaths
export async function getStaticPaths() {
  // 定義一個可能的動態路由值列表
  const paths = [
    { params: { id: 'post-1' } },
    { params: { id: 'post-2' } },
    { params: { id: 'post-3' } }
  ]

  // 將該列表返回
  return {
    paths,
    fallback: false // 設定 fallback 為 false，表示只生成該列表中存在的頁面
  }
}

// 最後定義 getStaticProps
export async function getStaticProps({ params }) {
  // 在此處獲取該頁面的數據
  const postData = { title: `Post ${params.id}`, content: '...' }

  // 返回數據，用於動態生成頁面
  return {
    props: {
      postData
    }
  }
}

// 接下來就可以在頁面中使用 postData 來渲染該頁面的內容

```


<br/>


## **API Routes**

Next.js 的 `API Routes` 可以創建簡單的 `serverless API` 服務。在Next.js中，API Routes是一個特殊的目錄，它包含API路由處理程序。當客戶端使用HTTP請求訪問API路徑時，Next.js 將調用相應的 API 路由處理程序。API Routes 讓開發者輕鬆地構建基於伺服器的邏輯，而無需構建完整的 Express 或 Koa 應用程序。

使用API Routes非常簡單。只需要在**/pages/api**目錄中創建一個 JavaScript 文件，然後將處理程序導出為默認模塊。在這個文件中，你可以編寫處理客戶端請求的邏輯。例如，以下是一個簡單的API路徑，它返回當前時間的JSON格式：

```jsx
export default (req, res) => {
  const currentTime = new Date();
  res.json({ time: currentTime.toISOString() });
};
```

訪問 **`/api/time`** 路徑時，它將返回以下JSON格式的時間：

```jsx
{ "time": "2023-03-10T08:30:00.000Z" }
```

API Routes還允許您使用HTTP方法（如GET，POST，PUT等）指定路由處理程序。您可以通過在文件名中使用HTTP方法名（例如，**`pages/api/posts.js`**）或通過使用**`req.method`**在處理程序中檢查HTTP方法來實現這一點。

例如，以下是一個使用POST方法的API路徑，它從請求中接收JSON格式的數據並返回成功的 response：

```jsx
export default (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;
    console.log(`Received message: ${message}`);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid request method' });
  }
};
```

:::danger 
**不要在 getStaticProps 與 getStaticPaths 中使用 API Route**  
官方建議在 `getStaticProps` 或 `getStaticPaths` 中不要直接呼叫 API Route，主要是因為在 Static Generation 的過程中，`getStaticProps` 或 `getStaticPaths` 是在 build time 時就被執行，如果在這個階段呼叫 API Route，則會造成 API 資料在每次 build 時被緩存，導致頁面渲染的資料是舊的，不會反應最新的資料。

相對的，建議在 `getServerSideProps` 或 API Route 中呼叫 API，因為它們是在每次 request 時才會執行，可以保證取得的資料是最新的。
:::

### **API Route 適用情境 : 處理表單輸入**

API Routes 的一個很好的飯例是處理表單輸入。例如，我們可以在頁面上創建一個表單，並讓它向 API Routes 發送 `POST` 請求。我們可以直接在 API Routes 中邊寫server-side程式碼將其直接保存到 database中。 API Routes 的程式碼不會成為 **client bundle** 的一部分，因此可以安全地編寫 **server-side** 的程式碼。

### **API Route 與一般的後端 server API 有幾個不同之處**

1. 前端與後端程式碼可以放在同一個項目中，這樣更容易理解和維護整個應用程序；
2. API Routes 可以輕鬆地與你的 Next.js 頁面和路由集成，實現真正的全棧開發；
3. Next.js API Routes 具有一些內建的優化功能，例如自動解析 POST 和 GET 請求、自動處理 CORS、內置的文件上傳等等；

:::tip API Routes 如何實現 backend server 的功能?

Next.js 將前端和後端的功能都整合在了一起，讓前端工程師也可以輕鬆地使用 Node.js 和 server-side 相關技術。`API Routes` 的程式碼會在 server-side 上運行，並被編譯成為 server bundle，並不會包含在 client bundle 中。當使用者訪問 API Routes 時，它會直接透過 server-side 上的程式碼進行處理。

當我們啟動 Next.js 的 server 時，它會啟動一個 Node.js server 接著將編譯出的 `server bundle` 載入至記憶體中，並開始運行。所以當您在 API Routes 中編寫 server-side 的程式碼時，它們會被編譯成 `server bundle` 的一部分，而不會被打包成 client-side bundle。因此在使用 API Routes 時，我們不需要額外的伺服器，Next.js 會將這些程式碼打包成 server bundle，並在 Next.js 的 server 中執行。這樣即可在 client-side 獲取到 server-side 資料，而不必擔心在 bundle 中暴露敏感的 server-side 程式碼。
:::


## **Reference**
- **[@NEXT.js](https://nextjs.org/)**
  - **[Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app) **
  - **[Navigate Between Pages](https://nextjs.org/learn/basics/navigate-between-pages) **
  - **[Assets, Metadata, and CSS](https://nextjs.org/learn/basics/assets-metadata-css) **
  - **[Pre-rendering and Data Fetching](https://nextjs.org/learn/basics/data-fetching)**
  - **[Dynamic Routes](https://nextjs.org/learn/basics/dynamic-routes)**
  - **[API Routes](https://nextjs.org/learn/basics/api-routes)**

