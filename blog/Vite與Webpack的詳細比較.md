---
title: "新舊時代 JS Bundler 的世代交替 - Vite vs. Webpack 的詳細比較"
slug: vite-vs-webpack
authors: bosh
description: 透過本文的探討，我們澄清了「萬物皆物件」這一說法的真實含義。JavaScript 中的基本資料類型和物件有著本質的區別，儘管基本資料類型在某些情況下可以表現出物件的行為，但這只是因為 JavaScript 的臨時包裝機制。
keywords: [Bundler, Vite, Webpack, Hot Module Replacement, Frontend, Dev Server]
tags: [Bundler]
date: 2024-08-04
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1722742737/Docusaurus%20Blog/Blog/Vite%20vs%20Webpack/Vite_vs_Webpack_rmafcp.png
---

在過去，當我們談論到 JavaScript 前端開發環境時，很難不提到 `Webpack` 。這款在 2012 年誕生的強大工具，在過去的 10 年內一直是最主流的前端打包工具 。然而，在 2020 年一個名為 `Vite` 的新興工具迅速崛起，挑戰著 Webpack 的霸主地位。根據 2023 年 State of JavaScript 網站所統計的資料顯示，Vite 僅花了短短三年就成為使用規模第二大的 Build Tools，如果單看 Interest 或 Positivity 指標的話，甚至都穩坐第一名的位置。

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1722742737/Docusaurus%20Blog/Blog/Vite%20vs%20Webpack/state_of_js_build_tools_ufwlgt.png)

<!-- truncate -->

持續關注 JS 前端生態圈的讀者一定有感受到，近兩年 Vite 人氣竄升的速度之快，在 Vite 快速竄紅的一段時間裡甚至瀰漫著「Webpack 已死」的氛圍。由於我目前的公司所使用的工具是 Webpack，而我自己開專案練習時則會選擇 Vite，因此我能明白兩者之間易用性的差距，以及為什麼現在的前端開發者越來越偏好使用 Vite。但撇除像是開箱及用、快速的 HMR 等那些 Vite 被廣為人知的優點外，我還是想要知道兩者在更深層次的技術細節上有何不同。這篇文章整理了我對 Vite 與 Webpack 兩者如何提供現代 Bundler 所需具備的功能的理解，並探討它們各自的適用場景和潛在限制。

:::note
本篇文章內容整理自 [Vite vs. Webpack: A Head-to-Head Comparison](https://kinsta.com/blog/vite-vs-webpack/) 與 [Vite 官方網站](https://vitejs.dev/)
:::


## **何謂 Bundler?**

在探討 Vite 與 Webpack 這兩個工具包山包海的的功能之前，我們得先了解這兩個工具在 Web 應用中所代表的角色：`Bundler`

### **Bundler 的定義與功能**

JavaScript Module Bundler 是一種用於網頁開發的工具，旨在將多個 JavaScript 檔案合併成一個或少數幾個檔案，這個合併檔案稱為 **bundle** 。這樣的合併過程可以減少網頁應用程式所需的請求數量，從而提升效能和加快載入速度。

### **實例**

假設我們有兩個獨立的 JavaScript 檔案：module1.js 和 module2.js。

```jsx
// module1.js
export const greet = (name) => {
    console.log(`Hello, ${name}!`);
}

// module2.js
export const farewell = (name) => {
    console.log(`Goodbye, ${name}!`);
}
```

透過使用 JavaScript bundler（如 **Rollup**、**Webpack** 或 **Parcel**），我們可以將這些模組與一個 index.js 檔案合併：

```jsx
// index.js
import { greet } from './module1.js';
import { farewell } from './module2.js';

greet('Kinsta');
farewell('Server Troubles');
```

Bundler 會將 module1.js、module2.js 和 index.js 合併為一個最佳化後的 bundle，方便在網頁應用程式中使用。

### **優點**

1. **減少 HTTP 請求**：合併多個檔案，減少請求數量。
2. **程式碼最佳化**：進行程式碼壓縮、混淆等，減少檔案大小。
3. **跨瀏覽器相容性**：解決瀏覽器特定問題，提供一致的使用者體驗。
4. **程式碼轉換**：進行必要的程式碼轉換，如轉譯（transpilation），以確保在所有目標環境中運行。

> 儘管現代瀏覽器支援 ES modules 及 HTTP/2 技術，這些技術能解決請求開銷問題，但 JavaScript bundlers 依然不可或缺，因為它們可以執行關鍵的程式碼轉換和最佳化。
>


<br/>


## **簡單認識 Vite 與 Webpack**

### **Vite - 最佳開發體驗的現代化工具**

Vite 是一個現代化的前端建構工具，旨在提供快速的開發體驗和高效的建構效能。由於它使用了原生 ES 模組和 Rollup 作為底層技術，Vite 可以在開發階段實現快速的**熱更新（Hot Module Replacement，HMR）**，並在生產環境中進行高效的程式碼打包。

**Vite 的特色**

1. **快速冷啟動**：利用瀏覽器的原生 ES 模組支援，Vite 只需啟動必要的部分，避免了打包整個應用程式的時間。
2. **即時模組熱更新**：Vite 的 HMR 機制能夠在程式碼改變時快速更新頁面，提升開發效率。
3. **現代化語法支援**：內建支援 TypeScript、JSX 和 CSS 前置處理器（如 Sass、Less）。
4. **輕量且易於配置**：相較於傳統的打包工具，Vite 的配置更加簡單直觀，減少了學習成本。
5. **高度擴展性**：基於外掛系統，可以輕鬆擴展 Vite 的功能，以滿足不同專案需求。

### **Webpack - 全能的模組打包工具**

Webpack 是一個功能強大的模組打包工具，曾經是前端開發的主流選擇。它能夠處理多種資源類型（如 JavaScript、CSS、影像等），並提供豐富的配置選項和外掛系統。

**Webpack 的特色**

1. **靈活性和擴展性**：Webpack 的配置文件支援多種選項和外掛，能夠處理各種複雜的應用場景。
2. **模組化管理**：支援多種模組格式（如 CommonJS、AMD、ES Modules），有效管理程式碼相依性。
3. **強大的社群支援**：擁有廣泛的使用者基礎和豐富的第三方外掛資源。
4. **豐富的功能**：提供從開發到生產環境的全面支援，包括熱模組替換、程式碼壓縮、程式碼分割(code split)、懶載入(lazy loading)和混淆等。


<br/>


## **架構與設計哲學**

### **Vite 的設計哲學**

Vite 的設計哲學圍繞輕量化和可擴展性，強調簡潔和長期的專案可維護性。Vite 的核心架構分為開發階段和生產建構階段，透過利用現代瀏覽器的原生對 ES 模組的支持和快速的模組熱更新（HMR）機制，提升開發效率。

1. **開發階段**：Vite 利用瀏覽器的原生 ES 模組支援，只需啟動必要部分，降低整個應用程式的冷啟動時間。當程式碼改變時，Vite 只重新編譯改動部分，並通過模組熱更新（HMR）快速反映在瀏覽器中，極大提升開發效率。
2. **生產建構階段**：在建構生產環境程式碼時，Vite 使用 Rollup 進行打包。Rollup 擅長生成高效的程式碼，並提供豐富的外掛系統，可以對程式碼進行各種最佳化，如：程式碼分割、壓縮、混淆等。
3. **外掛系統**：Vite 的外掛系統基於 Rollup，擴展性強。開發者可以輕鬆地新增或自訂外掛，以滿足特定的開發需求，防止核心臃腫。Vite 積極與 Rollup 專案合作，保持相容性和共享外掛生態系統。
4. **設計實踐**：Vite 的設計哲學體現在它對現代 JavaScript 特性的支援上，如 ES 模組和 Worker 語法。例如：
    
    ```jsx
    // app.js
    import { greet } from './utilities.js';
    
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    
    worker.postMessage({ input: 42 });
    
    worker.onmessage = (e) => {
      const result = e.data.result;
      console.log(`Result from the web worker: ${result}`);
    };
    
    const message = greet('Hello, Vite!');
    console.log(message);
    ```
    
    這段程式碼展示了 Vite 如何無縫支援 ES 模組和 Worker 語法。在這個例子中，我們使用 ES 模組語法從 utilities.js 模組中匯入 greet 函數，並且通過 new URL('./worker.js', import.meta.url) 建立了一個新的 Web Worker，這在 Vite 中得到原生支援而不需要額外配置。這樣的設計大大簡化了開發過程，使得開發者可以更專注於功能實現而非工具配置。
    

### **Webpack 的設計哲學**

Webpack 的設計哲學是以模組化為核心，通過強大的配置和外掛系統，實現高度靈活的打包和資源管理。Webpack 被設計為一個功能齊全的模組打包工具，適用於各種複雜的應用場景。

1. **模組化管理**：Webpack 支援多種模組格式（如 ES2015 的 import 語句、CommonJS 的 require 語句、AMD 的 define 和 require 語句，以及 CSS/Sass/Less 文件中的 @import 語句等），通過 Loader 將它們轉換為可以在 JavaScript 中引用的模組。這種模組化的處理方式類似於使用樂高積木搭建專案，提升程式碼的可讀性和維護性。
2. **配置靈活**：Webpack 提供了高度可配置的選項，開發者可以通過配置文件詳細定義打包過程中的各種行為，如入口文件、輸出文件、模組解析規則等。
3. **外掛系統**：Webpack 擁有豐富的外掛系統，幾乎所有的打包過程都可以通過外掛進行擴展和自訂，這使得 Webpack 能夠滿足各種需求，保持靈活性和可擴展性。
4. **程式碼最佳化**：Webpack 提供了多種程式碼最佳化技術，如程式碼分割、Tree Shaking、程式碼壓縮和混淆，這些技術有助於生成高效的生產環境程式碼。
5. **設計實踐**：Webpack 的模組化設計特別適合大型專案。透過配置和使用 loader，開發者可以將專案組織成模組，提高可讀性和維護性。例如：
    
    ```jsx
    // webpack.config.js
    const path = require('path');
    
    module.exports = {
      entry: './app.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
          },
        ],
      },
    };
    ```
    
    這個例子展示了 Webpack 如何配置建構過程，最佳化程式碼並高效處理資源，通過使用 Babel Loader 寫出清晰、模組化的程式碼，提高使用者體驗。
    

### **Vite 與 Webpack 的共通點**

儘管 Vite 和 Webpack 在設計哲學上有所不同，也存在一些共通點：

- **模組化設計：** 兩者都採用模組化設計哲學，鼓勵將應用程式拆分成小的、可重用的模組。這種設計方式有助於提高程式碼的可維護性和可擴展性。

- **外掛驅動架構：** Vite 和 Webpack 都使用外掛驅動的架構。這種架構允許開發者根據需求擴展工具的功能，而不需要改變其核心程式碼。外掛機制提供了極大的靈活性，讓開發者可以自訂打包流程。


<br/>


## **配置和易用性**

### **精簡的 Vite 配置**

Vite 的設計目標之一是提供簡單易用的配置，使開發者能夠快速上手並專注於開發工作。Vite 通常需要極少的配置或幾乎不需要配置，這是其「開箱即用」的關鍵所在。

1. **默認配置即用**：Vite 提供了合理的默認配置，涵蓋了大多數常見的開發需求。開發者無需進行大量配置即可啟動和運行項目。
2. **簡單的配置文件**：如果需要自定義配置，可以通過在項目根目錄下創建 `vite.config.js` 文件來完成。配置文件結構簡單直觀，例如：在上述例子中，我們僅導入並安裝了 Vite 的 Vue.js 官方插件。Vite 的優勢在於其自動檢測大多數項目的正確設置，減少配置的麻煩。
    
    ```jsx
    // vite.config.js
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    
    export default defineConfig({
      plugins: [vue()],
    });
    ```
    
3. **插件系統**：Vite 的插件系統基於 Rollup，使得配置和擴展變得簡單。只需安裝並引用相應的插件，即可輕鬆添加所需功能。
4. **開發伺服器配置**：Vite 的開發伺服器配置也非常簡單，可以在 `vite.config.js` 中進行設置，如：
    
    ```jsx
    export default defineConfig({
      server: {
        port: 3000,
      },
    });
    ```
    

### **複雜的 Webpack 配置**

相比之下，Webpack 的配置更為複雜和靈活，這是由於其強大的功能和廣泛的應用場景所決定的。雖然 Webpack 在最近的版本中也朝向零配置方向發展，但仍然不如 Vite 自動化。Webpack 可以處理各種不同的需求，但相應的配置也變得更加繁瑣和詳細。

1. **詳細的配置文件**：Webpack 的配置文件結構複雜，涵蓋了入口點、輸出、模組解析規則、插件等多個方面。例如：這段配置文件展示了 Webpack 如何配置構建過程，優化代碼並高效處理資源。相比 Vite，Webpack 的配置涉及更多手動設置，包括指定入口和輸出路徑、配置 Loader 處理不同類型的文件、設置插件以實現特定功能。
    
    ```jsx
    // webpack.config.js
    const webpack = require('webpack');
    const path = require('path');
    const { HotModuleReplacementPlugin } = require('webpack');
    const { VueLoaderPlugin } = require('vue-loader');
    
    module.exports = {
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: ['vue-style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.js',
            },
        },
        plugins: [
            new HotModuleReplacementPlugin(),
            new VueLoaderPlugin(),
        ],
    };
    ```
    
2. **豐富的插件和 Loader**：Webpack 擁有大量的插件和 Loader，可以滿足各種需求，但這也增加了配置的複雜性。開發者需要根據具體需求選擇和配置合適的插件和 Loader。
3. **靈活的自定義**：Webpack 允許開發者自定義構建流程的各個方面，這意味著開發者需要對配置有深入的理解，以充分利用其強大的功能。
4. **多配置文件**：對於大型項目，通常需要多個配置文件來處理開發、測試和生產環境，這進一步增加了配置的複雜性。


<br/>


## **開發端伺服器**

### **伺服器配置**

Vite 和 Webpack 都提供了強大的開發伺服器功能，但在配置和使用上有所不同，對開發效率和生產力有直接影響。

1. **Vite 的伺服器配置**：Vite 的開發伺服器是內建的，開箱即用，通常不需要額外配置。只需在 `vite.config.js` 中進行少量設定即可。例如：
    
    ```jsx
    // vite.config.js
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    
    export default defineConfig({
      plugins: [vue()],
      server: {
        port: 3000,
        open: true, // 啟動伺服器時自動打開瀏覽器
        proxy: {
          '/api': 'http://localhost:5000',
        },
      },
    });
    ```
    
2. **Webpack 的伺服器配置**：Webpack 提供了多種選項，如 `webpack-dev-server` 和 `webpack-dev-middleware`，需要額外設定才能自動編譯程式碼並處理變更。配置相對複雜，例如：
    
    ```jsx
    // webpack.config.js
    const webpack = require('webpack');
    const path = require('path');
    const { HotModuleReplacementPlugin } = require('webpack');
    const { VueLoaderPlugin } = require('vue-loader');
    
    module.exports = {
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: ['vue-style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.js',
            },
        },
        plugins: [
            new HotModuleReplacementPlugin(),
            new VueLoaderPlugin(),
        ],
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port: 3000,
            hot: true,
            open: true,
            proxy: {
                '/api': 'http://localhost:5000',
            },
        },
    };
    ```
    

### **冷啟動速度**

1. **Vite 的冷啟動速度**：
Vite 通過使用 esbuild（基於 Go 的高性能打包工具）來預打包依賴項，大幅減少初始化時間。Vite 的設計利用原生 ES 模組，只在瀏覽器請求時進行程式碼轉換和服務，從而顯著提高了伺服器啟動速度。
    - **高效的依賴處理**：Vite 預打包依賴項，例如將 `lodash-es` 的 600 多個內部模組合併為一個模組，減少 HTTP 請求數量，提升開發伺服器性能。
    - **按需載入**：Vite 使用原生 ES 模組按需載入原始碼，最小化伺服器負載和延遲。
2. **Webpack 的冷啟動速度**：
Webpack 傾向於在啟動時預打包原始碼和依賴項，這種捆綁方法在開發過程中延長了伺服器啟動時間。相比之下，Webpack 的伺服器設定時間通常比 Vite 更長。
    - **bundle 方法**：Webpack 的 bundle 方法確保所有站點資料都可用，使開發伺服器中的頁面導航速度更快，但初始化時間較長。

### **HMR (Hot Module Replacement)**

1. **Vite 的 HMR**：Vite 使用原生 ESM 實現 HMR，通過將部分捆綁工作轉移到瀏覽器，減少伺服器負載和延遲。這確保了快速更新而無需整頁重新載入，對開發過程中的即時反饋至關重要。
2. **Webpack 的 HMR**：Webpack 也支援 HMR，實現即時更新並保留開發過程中的應用狀態。與 Vite 不同，Webpack 需要在配置文件中啟用相關外掛和設定。

### **快取效能**

**1. Vite 的快取效能：**

- **瀏覽器原生快取**：Vite 利用瀏覽器對 ES 模組的原生支援，通過 HTTP 提供模組，瀏覽器能夠自行快取這些模組，避免了重複加載，提高了開發環境中的響應速度。
- **依賴預構建快取**：Vite 會在第一次啟動時預構建並快取第三方依賴（如 npm 包），這些依賴會被儲存在本地快取中，隨後的啟動只需要重用這些預構建的快取，減少了重新解析和打包的時間。
- **模組熱替換 (HMR) 快取**：在開發過程中，Vite 的 HMR 只會更新實際變動的模組，而不會重新加載整個應用程式。這種精細的快取策略確保了更快的開發迭代速度。

**2. Webpack 的快取效能：**

- **持久快取**：Webpack 支持持久化快取（Persistent Caching），可以將編譯過程中生成的模組和資產緩存在磁碟中。在隨後的構建中，Webpack 可以重用這些快取，顯著減少了編譯時間。
- **模組快取 (Module Caching)**：Webpack 在開發過程中會將已編譯的模組快取起來，當模組未發生變化時，會直接使用快取的結果，而不是重新編譯，從而提高建構速度。
- **DLL 外掛 (DLL Plugin)**：Webpack 提供了 DLL 外掛，用於提前打包和快取不常變化的第三方庫。這些庫可以在開發和建構過程中重複使用，減少重複編譯的開銷。
- **最佳化輸出快取 (Output Caching)**：Webpack 可以根據文件內容生成文件名的 hash 值，從而實現瀏覽器層面的快取。當文件內容未變化時，文件名不變，瀏覽器可以直接使用快取的文件，提升使用者的載入體驗。


<br/>


## **最佳化打包流程**

### **預載指令生成**

預載指令（Preload Directives）是用於告訴瀏覽器哪些資源應該優先載入的技術，以加速網頁的首次渲染。

1. **Vite 的預載指令生成**：
Vite 自動在構建的 HTML 中為入口塊(entry chunks)生成 `<link rel="modulepreload">` 指令，並直接匯入他們，從而提高載入速度。例如：
    
    ```html
    <!-- Vite - Module Preloading -->
    <link rel="modulepreload" href="/module-a.js">
    ```
    
2. **Webpack 的預載指令生成**：
Webpack 最初並不原生支持資源提示（Resource Hints），但從 v4.6.0 開始，它增加了對預加載（Prefetching）和預載（Preloading）的支持。通過在導入模組時使用內嵌指令，Webpack 可以輸出資源提示，告訴瀏覽器何時加載要導入的模組文件。例如：
    
    ```jsx
    import(/* webpackPreload: true */ '/module-a.js');
    ```
    
    這會輸出：
    
    ```html
    <!-- Webpack - Manual Module Preloading -->
    <link rel="preload" as="script" href="/module-a.js">
    ```
    

### **CSS Code Splitting**

CSS Code Splitting 是將 CSS 程式碼拆分為多個文件，以便按需載入，提高頁面載入性能。

1. **Vite 的 CSS Code Splitting**：
    
    Vite 能夠自動提取異步塊(async chunks)中的 CSS 並生成單獨的文件，這意味著當加載相關的異步塊時，只有必要的 CSS 會通過 `<link>` 標籤被加載。此外， Vite 會確保在 CSS 加載完成後才開始解析異步塊避免了 Flash of Unstyled Content（FOUC）的問題。
    
    由於這些功能是 Vite 預先配置的，我們只需像平常一樣導入 CSS 文件，Vite 就會自動處理 CSS 的拆分和加載，不需要額外的配置。
    
    ```jsx
    import './main.css';
    ```
    
2. **Webpack 的 CSS Code Splitting**：
Webpack 提供了更多的靈活性，但需要更多的配置來實現 CSS Code Splitting。開發者可以使用多種插件和配置選項來拆分 CSS，比如 `mini-css-extract-plugin`。
    
    ```jsx
    // webpack.config.js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    
    module.exports = {
      // ...其他配置
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ],
    };
    ```
    

### **Code Splitting and Chunks Loading**

Code splitting 是一種將程式碼拆分為較小的、可管理的塊（chunks）並按需載入的技術。這種方法顯著減少了初始載入時間，節省了資源，提高了應用程式的性能。

1. **Vite 的 Code Splitting**：
    
    Vite 使用 Rollup 進行程式碼拆分，在動態載入或多入口點的情況下，會自動將程式碼拆分為多個塊（chunks）。這有助於減少初次載入時間，提升應用的效能和使用者體驗。
    
    **自動程式碼拆分**
    
    Vite 通過分析模組之間的依賴關係，自動將應用程式拆分為多個塊。這些塊在應用執行階段會按需載入，避免了整個應用一次性載入帶來的性能問題。
    
    **手動配置拆分**
    
    你可以通過 Rollup 的 `output.manualChunks` 選項顯式指定哪些模組應該拆分為單獨的塊。例如，將第三方庫拆分到一個單獨的 vendor 塊中：
    
    ```jsx
    // vite.config.js
    export default defineConfig({
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['vue', 'vue-router'],
            },
          },
        },
      },
    });
    ```
    
    **動態匯入**
    
    Vite 支援動態匯入 (Dynamic Import)，允許在執行階段按需載入模組。這樣可以進一步減少初次載入時間，提高應用的響應速度。使用動態匯入時，可以通過變數來進行模組載入：
    
    ```jsx
    const module = await import(`./dir/${moduleName}.js`);
    ```
    
    **拆分 Vendor Chunk**
    
    Vite 提供了官方的 `splitVendorChunkPlugin` 外掛，用於自動拆分第三方庫，將其放入單獨的 vendor chunk 中，從而最佳化載入性能：
    
    ```jsx
    import { splitVendorChunkPlugin } from 'vite';
    
    export default defineConfig({
      plugins: [splitVendorChunkPlugin()],
    });
    ```

2. **Webpack 的 Code Splitting**：
Webpack 提供了多種程式碼拆分技術，包括入口點、SplitChunks 外掛和動態匯入。
    
    **入口點**：通過定義多個入口點來拆分程式碼，適合簡單的應用場景。然而，這種方法有其限制。如果一模組在不同的入口區塊中導入，它們最終會出現在兩個塊（chunk）中，從而導致重複的程式碼出現在多個塊（chunks）中 。
    
    ```jsx
    const path = require('path');
    module.exports = {
      mode: 'development',
      entry: {
        index: './src/index.js',
        another: './src/separate-module.js',
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
    ```
    
    **防止重複**：使用 SplitChunks 外掛或入口依賴來減少冗餘，確保共享的模組只載入一次。
    
    ```jsx
    const path = require('path');
    module.exports = {
      mode: 'development',
      entry: {
        index: {
          import: './src/index.js',
          dependOn: 'shared',
        },
        another: {
          import: './src/another-module.js',
          dependOn: 'shared',
        },
        shared: 'lodash',
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      optimization: {
        runtimeChunk: 'single',
      },
    };
    
    ```
    
    **動態匯入**：動態匯入支援按需載入程式碼，並允許使用 Webpack 的魔法註釋來設定塊名、懶載入（lazy-load）和設定載入優先順序。
    
    ```jsx
    const { default: _ } = await import('lodash');
    import(
      /* webpackChunkName: "my-chunk-name" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default", "named"] */
      /* webpackFetchPriority: "high" */
      'module'
    );
    ```
    

### **Tree-Shaking**

Tree-Shaking 是移除未使用程式碼的技術，從而減少打包後文件的大小，提高載入性能。

1. **Vite 的 Tree-Shaking**：
    
    Vite 使用 Rollup 作為其打包工具，Rollup 以其優秀的 Tree-shaking 能力而著稱。Rollup 在打包過程中會分析模組的依賴關係和引用情況，移除未使用的程式碼，僅保留應用實際需要的部分。
    
    1. **基於 ES 模組**：Vite 和 Rollup 都使用 ES 模組標準，這種標準原生支援靜態分析，能夠精確地識別並移除未使用的程式碼。
    2. **無需配置**：Vite 的 Tree-shaking 是開箱即用的，開發者不需要進行額外配置，Rollup 會自動處理這些最佳化。
2. **Webpack 的 Tree-Shaking**：
    
    Webpack 同樣支援 Tree-shaking，但需要依賴於一些配置和條件才能充分發揮其效用。
    
    1. **基於 ES 模組**：與 Vite 一樣，Webpack 的 Tree-shaking 也依賴於 ES 模組語法。使用 ES 模組的程式碼可以被靜態分析，從而識別未使用的部分。
    2. **配置要求**：
        - **mode 設定為 production：** Webpack 在生產模式下會自動啟用 Tree-shaking。確保在配置文件中設定 `mode: 'production'`。
        - **sideEffects 設定：** 需要在 `package.json` 或 Webpack 配置文件中設定 `sideEffects` 屬性來告訴 Webpack 哪些文件沒有副作用，可以安全地進行 Tree-shaking。
        
        ```json
        // package.json
        {
          "name": "your-project",
          "sideEffects": false
        }
        ```
        
        或配置文件設置：
        
        ```jsx
        // webpack.config.js
        module.exports = {
          mode: 'production',
          // 其他配置
          optimization: {
            usedExports: true,
          },
          module: {
            rules: [
              // 其他規則
              {
                test: /\.js$/,
                sideEffects: false,
              },
            ],
          },
        };
        ```


<br/>


## **靜態檔案處理**

靜態資源如圖像、字體和其他文件是網頁開發中不可或缺的一部分。Vite 和 Webpack 在處理這些資源時採用了不同的方法，各有優勢和優化方式。

### **Vite 的靜態檔案處理方式**

Vite 的靜態資源處理方式簡單高效。在開發過程中，當你導入靜態資源時，Vite 會返回解析後的公共 URL。例如：

```jsx
import kinstaImage from './kinsta-image.png';
```

在開發過程中，`kinstaImage` 會解析為 `/img.png`。在生產環境中，URL 會變成類似 `/assets/img.2d8efhg.png` 的形式，以最佳化快取和性能。

1. **靜態資源目錄**：
靜態資源可以放置在 `public` 目錄下，這些資源會在構建過程中自動拷貝到輸出目錄。資源可以通過絕對公共路徑或相對路徑引用。這種行為也延伸到 CSS 中的 URL 引用
2. **資源類型處理**：
Vite 能夠檢測常見的圖像、媒體和字體文件類型，並將它們作為資產處理。這些資源在構建過程中會被包含在資產圖（build assets graph）中，並生成帶有雜湊的文件名，以進行優化處理。

### **Webpack 的靜態檔案處理方式**

Webpack 在處理靜態資源時採用了不同的方法，提供了靈活的配置選項。通過 loader 和插件，Webpack 可以高效地處理和優化靜態資源。

1. **資源導入**：
和 Vite 一樣，Webpack 也支持通過導入靜態資源來進行處理：
    
    ```jsx
    import kinstaImage from './kinsta-image.png';
    ```
    
    Webpack 會將該圖像添加到輸出目錄，並為你提供最終的圖像 URL。
    
1. **資源模塊**：
Webpack 5 引入了資產模塊，可以處理各種類型的資源，不僅限於圖像。例如，可以配置 Webpack 來處理字體文件：
    
    ```jsx
    module.exports = {
      module: {
        rules: [
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            type: 'asset/resource',
          },
        ],
      },
    };
    ```
    
    這樣的配置允許你通過 `@font-face` 聲明將字體文件整合到項目中。
    
1. **CSS 和 HTML 處理**：
使用 `css-loader` 和 `html-loader`，Webpack 能夠在處理 CSS 和 HTML 文件時自動解析和替換資源 URL，確保輸出目錄中的路徑正確。


<br/>


## **JSON 支援**

Vite 和 Webpack 都提供了對 JSON 文件的良好支援，兩者都能自動解析 JSON 文件並將其轉換為 JavaScript 物件，讓開發者可以輕鬆地在專案中使用 JSON 資料。此外，還支持 JSON 命名導入，這有助於進行 Tree-Shaking。

```jsx
// import an object
import json from './example.json'
// import a root field as named exports.
import { test } from './example.json'
```


<br/>


## **TypeScript 支援**

TypeScript 是 JavaScript 的超集，增加了靜態類型支援，能夠提升程式碼的可維護性和開發效率。Vite 和 Webpack 都提供了對 TypeScript 的良好支援

### **Vite 的 TypeScript 支援**

Vite 提供了開箱即用的 TypeScript 支援，無需額外的配置即可使用 TypeScript 進行開發。Vite 使用 `esbuild` 作為默認的 TypeScript 編譯器，這使得 TypeScript 文件的編譯速度非常快。然而，Vite 主要關注於程式碼的轉譯（transpilation），而不是類型檢查。

### **Webpack 的 TypeScript 支援**

Webpack 對 TypeScript 的支援需要通過 `ts-loader` 或 `babel-loader` 來進行配置。這使得 Webpack 能夠編譯和處理 TypeScript 文件。雖然這需要額外的配置步驟，但它提供了靈活性和與其他 Webpack 特性的相容性。

1. **使用 ts-loader**：
    
    ```jsx
    // webpack.config.js
    const path = require('path');
    
    module.exports = {
      entry: './src/index.ts',
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
    ```
    
2. **使用 babel-loader**：
    
    ```jsx
    // webpack.config.js
    const path = require('path');
    
    module.exports = {
      entry: './src/index.ts',
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-typescript',
                ],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
    ```


<br/>


## **Glob Import 支援**

Glob Import 是一種強大的功能，允許開發者使用通配符模式來導入多個模組。Vite 和 Webpack 都提供了對 Glob Import 的支持，但它們的實現方式有所不同。

### **Vite 的 Glob Import 支援**

Vite 通過內建的 `import.meta.glob` 方法提供對 Glob Import 的支持

1. **使用 Glob Import**：
使用 Vite 的 `import.meta.glob` 來導入多個模組：
    
    ```jsx
    const modules = import.meta.glob('./kinsta/*.js');
    
    // 這會輸出如下結構：
    const modules = {
      './kinsta/isCool.js': () => import('./kinsta/isCool.js'),
      './kinsta/isAwesome.js': () => import('./kinsta/isAwesome.js'),
      './kinsta/isFun.js': () => import('./kinsta/isFun.js'),
    };
    
    // 動態導入模組
    for (const path in modules) {
      modules[path]().then((module) => {
        console.log(path, module);
      });
    }
    ```
    
2. **Glob Import As 支持**：
Vite 支持將文件作為字符串導入，使用 `import.meta.glob` 的 `as` 選項：
    
    ```jsx
    const modules = import.meta.glob('./kinsta/*.js', { as: 'raw', eager: true });
    
    // 這會被轉換成如下結構：
    const modules = {
      './kinsta/rocks.js': 'export default "rocks"\n',
      './kinsta/rules.js': 'export default "rules"\n',
    };
    ```
    
    同樣，Vite 也支持 `{ as: 'url' }` 選項來將 assets 作為 URL 加載。
    

### **Webpack 的 Glob Import 支援**

Webpack 通過插件來實現 Glob Import，例如 `webpack-import-glob-loader` 和 `glob-import-loader`。

1. **使用插件進行 Glob Import**：
在 Webpack 配置文件中配置這些插件來實現 Glob Import：
    
    ```jsx
    // webpack.config.js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'webpack-import-glob-loader',
          },
        ],
      },
    };
    ```
    
2. **導入多個模組**：
使用插件後，可以使用通配符模式導入多個模組：
    
    ```jsx
    // src/index.js
    import * as modules from './modules/**/*.js';
    
    console.log(modules);
    ```
    
    假設 `./modules` 目錄結構如下：
    
    ```
    modules/
    ├── module1.js
    ├── module2.js
    └── subfolder/
        └── module3.js
    ```
    
    以上導入會將 `modules/module1.js`、`modules/module2.js` 和 `modules/subfolder/module3.js` 這三個模組都導入到 `modules` 物件中。


<br/>


## **Web Workers 支援**

Web Workers 是一種強大的技術，允許在背景執行緒中執行 JavaScript，從而避免阻塞主執行緒，提升應用的性能和響應速度。Vite 和 Webpack 都提供了對 Web Workers 的良好支援。

### **Vite 的 Web Workers 支援**

Vite 提供了開箱即用的 Web Workers 支援，無需額外配置即可使用。Vite 提供了兩種方式來匯入 Web Worker 文件。

1. **建立 Web Worker**：
建立一個 Web Worker 文件，例如 `worker.js`：
    
    ```jsx
    // worker.js
    self.addEventListener('message', (e) => {
      const result = e.data * 2;
      self.postMessage(result);
    });
    ```
    
2. **使用 Worker 建構函式**：
使用 `new Worker()` 或 `new SharedWorker()` 建構函式來建立 Web Worker：
    
    ```jsx
    // 使用 Worker
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    
    // 使用 SharedWorker
    const sharedWorker = new SharedWorker(new URL('./worker.js', import.meta.url));
    ```
    
3. **使用 ?worker 或 ?sharedworker 後綴**：
直接匯入 Web Worker 文件，並在文件路徑後新增 `?worker` 或 `?sharedworker` 後綴：
    
    ```jsx
    import MyWorker from './worker?worker';
    
    const worker = new MyWorker();
    worker.postMessage('Hello from the main thread!');
    ```
    

### **Webpack 的 Web Workers 支援**

Webpack 從 5.0 版本開始，對 Web Workers 提供了原生支援，不再需要使用特定的 loader。這使得在 Webpack 項目中使用 Web Workers 變得更加方便。

1. **建立 Web Worker**：
建立一個 Web Worker 文件，例如 `worker.js`：
    
    ```jsx
    // worker.js
    self.addEventListener('message', (e) => {
      const result = e.data * 2;
      self.postMessage(result);
    });
    ```
    
2. **使用 Worker 建構函式在主執行緒中使用 Web Worker**：
使用 `new Worker()` 建立 Web Worker：
    
    ```jsx
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    worker.postMessage(10);
    worker.addEventListener('message', (e) => {
      console.log('Worker result:', e.data);
    });
    ```


<br/>


## **Library 開發支援**

Vite 和 Webpack 都提供了豐富的功能來支持函式庫的開發，但它們的設計哲學和特性有所不同。

### **Vite 的 Library 開發支援**

Vite 專為快速開發和現代化構建體系設計，對於庫開發提供了高效且簡單的支持。Vite 通過其專門的**庫模式（Library Mode）**，簡化了創建函式庫的過程。

1. **快速轉譯 TypeScript**：
Vite 使用 `esbuild` 作為 TypeScript 編譯器，省略了型別檢查，能夠快速將 TypeScript 轉譯成 JavaScript 文件。
2. **外部化依賴**：
Vite 允許外部化特定的依賴，例如 Vue 或 React，使得這些依賴不包含在函式庫的打包結果中，而是在使用時從外部獲取，減少韓式庫的大小。
3. **多模組格式支持**：
Vite 原生支持 ES 模組，且能夠輕鬆地打包成多種格式（如 ESM 和 CJS 和 UMD），滿足不同應用場景的需求。

```jsx
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'MyLibrary',
      fileName: (format) => `my-library.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```

### **Webpack 的 Library 開發支援**

Webpack 是一個功能強大且靈活的打包工具，也適合於建構各種 JavaScript 韓式庫。使用 Webpack 建立 JavaScript 庫時，可以根據需要配置如何打包函式庫的程式碼。

```jsx
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-library.js',
    library: 'MyLibrary',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    // 將 Vue 排除在外，不打包進庫
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```


<br/>


## **Reference**

- [**Vite vs. Webpack: A Head-to-Head Comparison**](https://kinsta.com/blog/vite-vs-webpack/)
- [**兩大 bundler 交鋒：Vite 與 Turbopack 的技術角力賽**](https://medium.com/starbugs/vite-vs-turbopack-1e139c222557)
- [**為什麼前端不愛用 Webpack 了? Vite 簡介**](https://vocus.cc/article/6603a1f6fd89780001fc872c)
- [**聊聊 ESM、Bundle 、Bundleless 、Vite 、Snowpack**](https://segmentfault.com/a/1190000025137845)
- [**如果能重来，你要选 Vite 还是 Webpack ？**](https://juejin.cn/post/7106136866381889573)