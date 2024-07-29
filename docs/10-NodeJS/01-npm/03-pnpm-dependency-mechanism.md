---
title: 解析 pnpm 的依賴管理機制
sidebar_label: "[pnpm] 解析 pnpm 的依賴管理機制"
description: 本文深入探討 pnpm 的獨特依賴管理機制，詳細解析其三層尋址策略如何通過軟連結（symlink）、硬連結（hard link）和全域存儲（global store）機制等，有效解決 Phantom Dependency 問題，節省磁碟空間，並提高依賴管理的效率。
last_update:
  date: 2023-07-29
keywords:
  - pnpm
  - npm
  - yarn
tags:
  - pnpm
---

在現代 Node.js 開發生態系中，依賴管理工具（如 npm、yarn）扮演著至關重要的角色。這些工具幫助我們管理專案中的外部套件和模組，確保我們的應用程式能夠順利運行和構建。然而，隨著專案規模和複雜度的增長，傳統的依賴管理工具也面臨了一些挑戰，例如重複安裝、安裝時間過長和依賴衝突等問題。在這樣的背景下，`pnpm` 應運而生。pnpm 是一個高效的套件管理工具，專注於快速、安全和節省空間的依賴管理。在本文中，我們將深入解析 pnpm 的依賴管理機制，並探討它如何解決上述問題。


## **pnpm 的優勢**

- **磁碟空間使用效率高**：
    
    pnpm 使用**硬連結（hard link）** 和**軟連結（symlink）** 技術來管理依賴，相同的依賴只會在硬碟上存儲一次，從而節省大量磁碟空間。
    
- **安裝速度快**：
    
    由於 pnpm 使用硬連結和軟連結，它能更快地完成套件的安裝過程。pnpm 還具有高效的套件緩存機制，可以顯著減少重複下載和解壓縮的時間。
    
- **嚴格的依賴關係隔離**：
    
    pnpm 在處理依賴關係時，比 npm 和 yarn 更嚴格。它會確保每個套件的依賴關係是獨立的，這樣可以避免依賴關係衝突，並且使得每個套件的運行環境更接近於生產環境。
    
- **一致性強**：
    
    由於 pnpm 的設計，它可以確保在不同的開發環境中得到一致的依賴樹，從而減少了「在我的機器上可以運行」的問題。
    
- **高效的 monorepo 支持**：
    
    pnpm 在 monorepo 環境中表現出色。它能夠有效地管理多個套件的依賴關係，並且支持在 monorepo 中共享依賴。
    

## **Node.js 在處理依賴引用時的邏輯**

### **1. 模組解析**

**a. 絕對和相對路徑**

- **絕對路徑**：如果 require 或 import 的是絕對路徑，Node.js 會直接引用該路徑下的模組。
    
    ```jsx
    const myModule = require('/path/to/myModule');
    ```
    
- **相對路徑**：如果 require 或 import 的是相對路徑，Node.js 會從當前文件所在的目錄開始解析路徑。
    
    ```jsx
    const myModule = require('./myModule');
    ```
    

**b. 非路徑模組（套件）**

- 如果引用的是一個套件，Node.js 會從當前文件所在目錄開始，沿著父級目錄逐層向上尋找 `node_modules` 目錄，直到找到該套件為止。

### **2. 文件類型解析**

當 Node.js 找到對應的文件或目錄時，它會按照以下順序解析文件類型：

**a. 文件解析**

- 如果 require 或 import 的路徑指向一個具體文件，如 `myModule.js`，Node.js 會直接載入該文件。

**b. 擴展名解析**

- 如果沒有指定擴展名，Node.js 會依次嘗試加上 `.js`、`.json` 和 `.node` 這三種擴展名來尋找對應的文件。
    
    ```jsx
    const myModule = require('./myModule'); // 依次嘗試 ./myModule.js, ./myModule.json, ./myModule.node
    ```
    

**c. 目錄解析**

- 如果 require 或 import 的路徑指向一個目錄，Node.js 會嘗試載入該目錄下的 `package.json` 文件，並使用其中 `main` 欄位指定的入口文件。如果 `package.json` 不存在，或者 `main` 欄位沒有指定文件，Node.js 會嘗試載入目錄下的 `index.js` 或 `index.json` 文件。
    
    ```jsx
    const myModule = require('./myDirectory'); // 尋找 ./myDirectory/package.json 的 main 欄位或 ./myDirectory/index.js
    ```
    

### **3. 快取機制**

Node.js 對已載入的模組進行快取，以提高性能。每次 require 或 import 一個模組時，Node.js 會首先檢查該模組是否已經在快取中，如果是，則直接返回快取中的模組實例。

### **4. 軟連結解析**

Node.js 會解析**軟連結（symlinks）**，即使是指向其他位置的文件或目錄，Node.js 也能正確載入。這在使用像是 pnpm 這樣的依賴管理工具 時尤為重要。

### **5. 執行環境和範疇**

每個模組都有自己的執行環境和範疇。模組中的變數和函數不會污染全域範疇。Node.js 使用 CommonJS 規範來處理模組，每個模組都有一個 `module` 物件，這個物件包含模組的相關資訊。

```jsx
// myModule.js
const myVar = 'Hello World';
module.exports = myVar;

// main.js
const myModule = require('./myModule');
console.log(myModule); // 'Hello World'
```

## **npm 和 yarn 的扁平化依賴管理方式**

### **扁平化依賴管理的原理**

1. **依賴提升（Hoisting）：**
    
    npm 會將所有的模組盡可能安裝到頂層 `node_modules` 目錄中。如果不同模組之間存在相同版本的依賴，npm 會將這些依賴提升到頂層，避免重複安裝。
    
    ```bash
    project-root/
    ├── node_modules/
    │   ├── lodash/       # 提升到頂層
    │   ├── moduleA/
    │   └── moduleB/
    ```
    
2. **版本衝突：**
    
    當不同模組需要不同版本的同一依賴時，npm 會將不同版本的依賴安裝在相應模組的 `node_modules` 目錄中，這樣就能避免版本衝突。
    
    ```bash
    project-root/
    ├── node_modules/
    │   ├── lodash/       # lodash@4 提升到頂層
    │   ├── moduleA/
    │   │   └── node_modules/
    │   │       └── lodash/ # lodash@3
    │   └── moduleB/
    ```
    
3. **虛擬依賴樹（.lock 文件）：**
    
    npm 與 yarn 在安裝依賴時會建立一個虛擬依賴樹，用於確定依賴的提升和衝突解決策略，最終生成一個優化後的依賴樹。並且用 .lock 文件來記錄精確的依賴樹和依賴版本，確保團隊成員之間或不同環境中安裝的一致性。
    

### **優點**

- **節省磁碟空間**：
    
    通過將相同版本的依賴套件安裝在根目錄的 `node_modules` 中，避免了重複安裝，節省了大量磁碟空間。
    
- **安裝速度加快**：
    
    扁平化的依賴樹結構減少了文件系統的深度，使安裝過程更加高效。此外，快取機制（如 Yarn 的快取）能避免重複下載和解壓縮，進一步加快了安裝速度。
    
- **減少依賴衝突**：
    
    由於所有依賴都盡量安裝在根目錄下，扁平化管理可以更有效地解決依賴版本衝突問題，確保每個模組運行在合適的環境中。
    
- **一致性強**：
    
    使用 .lock 文件（如 `package-lock.json` 和 `yarn.lock`），能夠確保在不同環境中安裝的依賴版本一致，減少「在我的機器上可以運行」的問題。
    
- **適用於 monorepo**：
    
    在 monorepo 環境中，扁平化依賴管理能夠有效管理多個套件的依賴關係，支持在 monorepo 中共享依賴，提升開發效率。
    

### **缺點**

- **依賴解析複雜**：    
    扁平化依賴管理需要進行更複雜的依賴解析和版本衝突處理，這可能會導致某些情況下的安裝過程變慢。
    
- **幽靈依賴問題**：    
    **幽靈依賴（Phantom Dependencies）** 是指一個套件能夠訪問並使用它未明確聲明為依賴的另一個套件，這通常是由於扁平化依賴樹結構導致的。在這種情況下，套件 A 可能因為其他套件 B 的依賴而間接獲取套件 C，儘管套件 A 並沒有在它的 package.json 中明確聲明套件 C 為其依賴。這會導致未來的某次依賴更新或重新安裝時，因為套件 C 的版本變動或不存在而出現問題。
    
    **範例**：    
    假設有以下依賴關係：    
    - `packageA` 依賴 `packageB`
    - `packageB` 依賴 `packageC`
    
    在扁平化依賴管理下， `packageC` 可能被安裝在根目錄的 `node_modules` 中，而不是嵌套在 `packageB` 的 `node_modules` 中。
    
    ```bash
    project-root/
    ├── node_modules/
    │   ├── packageA/       # 提升到頂層
    │   ├── packageB/
    │   └── packageC/
    
    ```
    
    這樣 `packageA` 也能夠訪問到 `packageC`，即使它並沒有在 package.json 中聲明 `packageC` 為依賴。
    
    ```jsx
    // packageA 的文件中
    const functionC = require('packageC'); // 沒有在 packageA 的 package.json 中聲明 packageC
    ```
    
    :::danger
     這樣的使用方式是危險的，因為如果將來 `packageB` 移除或更新了它對 `packageC` 的依賴， `packageA` 也會因找不到 `packageC` 而發生錯誤。
    :::
    

## **pnpm 的依賴管理策略**

### **硬連接與軟連結**

pnpm 使用`硬連接（hard links）`和`軟連結（symbolic links）`來管理依賴。這種策略可以大大節省磁碟空間並提高安裝速度。

**硬連結（永久連結）：**  
硬連結是一種文件系統技術，允許多個文件名指向同一個物理文件。pnpm 將下載的依賴存儲在全局存儲區（global store）中，並在項目的 `.pnpm` 目錄中使用硬連結指向這些文件。這意味著同一個套件只需下載和存儲一次，但可以被多個專案引用。

**軟連結（符號連結）：**  
軟連結是一種特殊的文件，包含指向另一個文件或目錄的路徑。pnpm 在專案的 `node_modules` 目錄中創建指向 `.pnpm` 目錄中依賴套件的軟連結。

**目錄結構範例：**

```bash
project-root/
├── node_modules/
│   ├── .pnpm/
│   │   ├── lodash@4.17.21/
│   │   ├── packageA@1.0.0/
│   │   └── packageB@1.0.0/
│   ├── lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
│   ├── packageA -> .pnpm/packageA@1.0.0/node_modules/packageA
│   └── packageB -> .pnpm/packageB@1.0.0/node_modules/packageB
```

在這個結構中，`lodash` 只會存儲在 `.pnpm` 目錄中一次，並且所有需要使用 `lodash` 的套件都會指向這個共享的版本。

**優點：**  
- **節省磁碟空間**：相同的依賴套件只會存儲一次，減少了重複套件的存儲空間。
- **加快安裝速度**：不需要重複解壓和寫入文件，通過創建連結即可完成安裝。
- **依賴隔離**：每個套件只能訪問它在 package.json 中聲明的依賴，避免了幽靈依賴問題。

### **三層定址策略**

pnpm 採用了一種特殊的依賴結構 - `三層定址策略`，它將依賴分成三個層次：

- **應用層（Project Node Modules）：**  
    - **目的**：        
        提供一個符合傳統 `node_modules` 目錄結構的層級，讓應用可以按照 Node.js 的模組解析邏輯引用依賴，確保每個依賴都能被正確地找到。這裡其實與 npm2 的依賴結構是類似的，只是這些依賴下沒有再巢狀依賴。
        
    - **原理**：        
        pnpm 會在專案的 `node_modules` 目錄中根據專案的依賴樹結構創建一系列指向虛擬存儲區（共享層）的**軟連結**。這些**軟連結**會指向虛擬存儲區中的相應套件，使得專案看起來像是直接安裝了這些依賴。
        
- **共享層（Shared Store）：**  
    - **目的**：  
        提供一個專案內部的依賴共享區域，確保專案中的相同依賴不會重複安裝，減少磁碟空間浪費。

    - **原理**：        
        每個專案在其 `node_modules/.pnpm` 目錄中有一個虛擬存儲區，這些虛擬存儲區包含指向全域存儲區的**硬連結**。當專案需要某個依賴套件時，會從虛擬存儲區中引用該套件，虛擬存儲區再指向全域存儲區中的實際文件。
        
- **全域層（Global Store）**：
    - **目的**：        
        作為所有依賴套件的集中存儲區，確保相同版本的依賴只需下載和存儲一次。提供一個一致的依賴套件來源，減少網絡請求和加快安裝過程。
        
    - **原理**：        
        全域存儲位通常為於 `~/.pnpm-store` 目錄中，所有下載的依賴套件都存儲在這裡。當安裝新的依賴時，pnpm 會首先檢查全域存儲區是否已經存在該版本的套件，如果存在則直接使用，否則下載並存儲到全域存儲區。
        

**範例：**

假設我們安裝了一個名為 `foo@1.0.0` 的套件，這個套件依賴於 `bar@1.0.0` 與 `qar@2.0.0`，`bar@1.0.0` 同時也依賴於 `qar@2.0.0`，如下所示：

```bash
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>/foo
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>/qar
```

當我們安裝 **foo@1.0.0** 時，pnpm 會將套件的依賴安裝到 `.pnpm` 資料夾中，並使用軟連結（symlink）將 .pnpm 中的套件連結到 `node_modules` 資料夾。

首先，我們可以看到 `node_modules` 資料夾中的結構：

- `node_modules/foo` 是一個軟連結，指向 `.pnpm/foo@1.0.0/node_modules/foo`

接著，`.pnpm` 資料夾結構展示了如何儲存 **foo** 及其依賴：

- `.pnpm/foo@1.0.0` 資料夾包含 **foo** 套件及其依賴的 **bar@1.0.0** 和 **qar@2.0.0**。
- **foo** 套件本身透過硬連結指向 `<store>/foo`，這是 **foo** 套件再全域儲存的地方。
- 同樣地，**bar** 和 **qar** 也分別透過硬連結指向 `<store>/bar` 和 `<store>/qar`。

由於 **foo** 和 **bar** 都依賴 **qar**，因此

- 在 `.pnpm/foo@1.0.0/node_modules` 資料夾中，有一個指向 `.pnpm/qar@2.0.0/node_modules/qar` 的符號連結。
- 同樣地，在 `.pnpm/bar@1.0.0/node_modules` 資料夾中，也有一個指向 `.pnpm/qar@2.0.0/node_modules/qar` 的符號連結。

:::tip
💡 這樣設計確保了 **qar** 只安裝一次，而 **foo** 和 **bar** 都能正確引用到它。這種三層尋址策略不僅節省了磁碟空間，還避免了因依賴版本不一致而導致的重複安裝問題。
:::

### **pnpm 如何有效避免幽靈依賴**

假設有一個專案 my-app，並且它有兩個依賴 `pkgA` 和 `pkgB`。

**目錄結構**

```bash
my-app
│
├── node_modules
│   ├── .pnpm
│   │   ├── pkgA@1.0.0
│   │   └── pkgB@1.0.0
│   └── pkgA -> .pnpm/pkgA@1.0.0
│   └── pkgB -> .pnpm/pkgB@1.0.0
│
├── packages
│   ├── pkgA
│   │   ├── node_modules
│   │   │   └── dependency-of-pkgA -> ../../node_modules/.pnpm/dependency-of-pkgA@1.0.0
│   │   └── package.json (declares dependency-of-pkgA)
│   ├── pkgB
│   │   ├── node_modules
│   │   │   └── dependency-of-pkgB -> ../../node_modules/.pnpm/dependency-of-pkgB@1.0.0
│   │   └── package.json (declares dependency-of-pkgB)
│   └── ...
└── ...

```

在上述結構中，pkgA 和 pkgB 的 node_modules 目錄內只包含它們明確聲明的依賴，且這些依賴是透過軟連結到**共享層**的。這樣一來，即使 **pkgA** 嘗試使用 **dependency-of-pkgB**，它也無法存取，因為 **dependency-of-pkgB** 不在 **pkgA** 的 node_modules 目錄中。

### **全域 pnpm-store 的組織方式**

- **內容定址 (Content-Addressable)**
    
    pnpm 的全域快取目錄（pnpm-store）是一個全局性的快取機制，所有下載的依賴都會存儲在這個目錄中，並且在多個專案之間共享。這種機制使用基於`內容定址（content-addressable）`的方式來組織檔案，這意味著每個套件版本只需存儲一次，並且在版本更新時只需保存變更的**差異（Diff**），而無需保存新版本的全部檔案內容。
    
- **範例**
    - 假設我們安裝了一個名為 `express` 的套件，其版本為 `4.17.1`。全域存儲區的目錄結構可能如下：
        
        ```bash
        ~/.pnpm-store/
        ├── 2a/
        │   ├── 7f/
        │   │   ├── 2a7f0c8d5b8e1f5b2b4c1a8a0f9b4c3a5d1c2e
        │   │   └── ...
        ├── a3/
        │   ├── c4/
        │   │   ├── a3c4e8f5d9b2a1c7d4e0b8f9a1c2b3d5e8
        │   │   └── ...
        └── ...
        ```
        
    - 在這個範例中，每個文件都以其內容的哈希值進行命名和存儲。不同套件或不同版本的套件，如果其內部文件內容相同，則會共用相同的文件存儲。

## **Reference**

- [**pnpm**](https://pnpm.io/zh-TW/)
- [**超越 npm：探索 pnpm 的高效存储机制**](https://juejin.cn/post/7288963210954555448)
- [**在前端中，什么是幽灵依赖？**](https://www.51cto.com/article/786691.html)