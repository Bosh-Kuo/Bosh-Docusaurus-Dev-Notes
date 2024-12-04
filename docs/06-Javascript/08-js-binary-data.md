---
title: "一次搞懂 JS 的二進位資料處理：Blob、File、FileReader、ArrayBuffer 到 Buffer 全解析"
sidebar_label: "二進制資料處理(Binary Data)"
description: "這篇文章將帶你全面了解 JavaScript 和 Node.js 中的二進制資料處理工具，包括前端的 Blob、File、FileReader、ArrayBuffer，以及後端的 Buffer。透過深入淺出的解說和實戰範例，我們會一步步探索如何操作文字、圖片、音訊等各類型數據，並建構如 Base64 編碼器等實用工具。"
last_update:
  date: 2024-12-04
keywords: [JavaScript, Node.js, 二進制資料, Blob, File, FileList, FileReader, ArrayBuffer, TypedArray, DataView, Buffer, Base64 編碼]
tags: [Javascript]
---


## **初探 JS 二進制：基礎概念與關鍵類型**

### **什麼是二進制資料？**

在我們的日常生活中，文字、圖片、音樂、甚至影片，對我們來說可能很直觀，但電腦其實看不到這些「豐富的內容」，它只能看到由 0 和 1 組成的數據——這就是所謂的**二進制資料**。

簡單來說，二進制資料就是電腦世界裡的「原始語言」。無論是你在網頁上點擊下載的文件，還是後端伺服器處理的數據流，這些其實都脫不開二進制資料的範疇。

你可能會想，既然這些由 0 和 1 組成的二進制資料只有電腦本人看得懂，那麼在什麼情況下我們會需要去操作他們呢？以前端來說，以下這些都是常見的需求場景：

- 上傳或下載文件（比如圖片、PDF）。
- 將圖片或音訊處理後傳輸到伺服器。
- 處理流式數據，比如大文件的分塊上傳。

儘管 JavaScript 主要用於處理字符串和 JSON 等高階資料格式，但它其實也提供了一套完整的工具，來處理更底層的二進制資料。

### **JS 的二進制資料家族**

現在，讓我們來看看 JavaScript 提供的這些「工具」。我把它們整理成了一張表，這樣你可以一目了然地了解每個工具的功能和用途：

```
ArrayBuffer
 ├─ DataView
 └─ TypedArray
       ├─ Uint8Array
       ├─ Int16Array
       └─ ...
Blob
 ├─ File
 ├─ FileList
 └─ FileReader
Buffer （Node.js 環境）
```

| 成員            | 用途與特點                                                                         | 常見使用場景                                         |
| --------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **ArrayBuffer** | 固定大小的二進制緩衝區，是其他類型的基礎。                                         | 圖片處理、音訊處理、網路數據傳輸                     |
| **TypedArray**  | 基於 `ArrayBuffer` 的結構化數組，支持操作不同類型的數據（如整數或浮點數）。        | 編碼或解碼多媒體數據，例如影像像素或音訊波形         |
| **DataView**    | 提供更靈活的方式操作 `ArrayBuffer`，可以按需定義數據結構。                         | 解析複雜的二進制數據格式，如自定義檔案格式或網路協議 |
| **Blob**        | 儲存二進制數據的文件對象，可以方便地用於文件下載或傳輸。                           | 文件上傳、圖像處理、後端資料接收                     |
| **File**        | 繼承自 `Blob`，用於描述用戶選擇的文件，比如通過 `<input type="file">` 選擇的檔案。 | 文件上傳                                             |
| **FileList**    | 表示多個文件的集合，通常來自 `<input type="file" multiple>`。                      | 批量文件上傳                                         |
| **FileReader**  | 讀取文件內容，支持讀取成多種格式（如文字、ArrayBuffer、DataURL）。                 | 預覽文件、讀取文件數據                               |
| **Buffer**      | Node.js 環境專屬，用於高效處理二進制數據。                                         | 網路請求、資料庫數據處理                             |

### **二進制資料的協作關聯圖解**

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1733299355/Docusaurus%20Blog/JS/Binary%20Data/JS-Binary-Data_e9rbax.png)

> 此圖參考 [@**二進制資料Blob,file,ArrayBuffer,fileReader...**](https://juejin.cn/post/7416924104039694377#heading-4)
> 

這些工具並非獨立存在，而是相互協作，幫助我們完成不同任務。比如，當你需要上傳一張圖片時：

1. 使用者選擇圖片，產生一個 `File` 物件。
2. 使用 `FileReader` 將檔案內容讀取為 `ArrayBuffer`。
3. 如果需要進一步處理，可以將 `ArrayBuffer` 轉換為 `TypedArray`，用來操作像素資料。
4. 最後，將處理後的資料重新封裝成 `Blob`，供使用者下載或傳輸。


<br/>


## **Blob：從檔案到資料流的核心**

### **Blob 的定義與特性**

在 JavaScript 世界裡，`Blob` 是處理二進制文件的核心工具。它的全名是 **Binary Large Object**，意即「二進位大型物件」。簡單來說，`Blob` 代表的是一塊不可變的二進制資料，這些資料可能是文字、圖像、音訊甚至影片。這些資料通常是由一個或多個 `ArrayBuffer` 或 `DOMString` 組成的。

:::caution
`Blob` 是不可修改的。如果需要操作它的內容，必須透過工具如 `FileReader` 來讀取並生成新的 `Blob`。
:::


### **如何創建 Blob？**

JavaScript 提供了一個簡單的方法來建立 `Blob`，使用它的建構函式：

```tsx
new Blob(blobParts[, options])
```

- **blobParts**:
    - 可以由  `ArrayBuffer`、`ArrayBufferView`、`Blob` 或 `DOMString` 組成的 `Array` 物件
- **options**:
    - `type` 屬性，預設值為空字串 `""`，表示將被放進 `Blob` 物件的陣列內容之 [MIME](https://zh.wikipedia.org/zh-tw/%E5%A4%9A%E7%94%A8%E9%80%94%E4%BA%92%E8%81%AF%E7%B6%B2%E9%83%B5%E4%BB%B6%E6%93%B4%E5%B1%95) 類型。
    - `endings` 屬性，表示包含 `\n` 換行字元的字串要如何輸出，預設值為字串 `"transparent"`。

**範例：創建一個文字檔案的 Blob**

```tsx
const text = "Hello, Blob!";
const textBlob = new Blob([text], { type: "text/plain" });
console.log(textBlob); // Blob {size: 12, type: "text/plain"}
```

### **Blob 的屬性與方法**

- 屬性
    - `size`: 表示儲存的資料，總共佔了多少位元(byte)。
    - `type`: 表示儲存的資料格式(**MIME** type)。
- 方法
    - `slice`：用於將一個 Blob 切分成多個子 Blob。

**範例：分割 Blob**

```tsx
const textBlob = new Blob(["Hello, world!"], { type: "text/plain" });
console.log(textBlob.size); // 13 (字元數加空格與符號)
console.log(textBlob.type); // text/plain

const largeBlob = new Blob(["This is a large blob"], { type: "text/plain" });
const slicedBlob = largeBlob.slice(0, 4); // 包含 "This"
console.log(await slicedBlob.text()); // "This"
```

### **實戰：Blob 的常見應用**

**1. 文件下載**  
在前端中，可以利用 `URL.createObjectURL` 為 Blob 生成臨時的 URL，並賦值給 `<a>` 標籤的 `href` 屬性來實現文件下載。

**React 前端示範**：

```tsx
import React from "react";

const DownloadFile: React.FC = () => {
  const handleDownload = () => {
    const blob = new Blob(["This is a test file."], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "test.txt";
    a.click();

    URL.revokeObjectURL(url); // 釋放資源
  };

  return <button onClick={handleDownload}>下載檔案</button>;
};

export default DownloadFile;
```

**2. 圖片顯示**  
類似文件下載，我們可以將 Blob 的 URL 賦值給圖片的 `src` 屬性，來顯示圖片。

**React 前端示範**：

```tsx
import React, { useState } from "react";

const DisplayImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />}
    </div>
  );
};

export default DisplayImage;
```

**3. 資源分段上傳**  
分段上傳是一種有效解決大文件上傳的方法。我們可以利用 `Blob.slice` 將文件切成多個片段，然後通過 API 一個個上傳。

**Express 後端示範**：  
假設我們接收前端分段上傳的文件片段，並最終合併成完整文件。

```tsx
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const UPLOAD_DIR = path.join(__dirname, "uploads");

app.use(express.json());

app.post("/upload", (req: Request, res: Response) => {
  const { chunk, filename, index } = req.body;

  const chunkPath = path.join(UPLOAD_DIR, `${filename}-${index}`);
  fs.writeFileSync(chunkPath, Buffer.from(chunk, "base64")); // 將片段保存

  res.status(200).send("Chunk uploaded");
});

app.post("/merge", (req: Request, res: Response) => {
  const { filename, totalChunks } = req.body;
  const filePath = path.join(UPLOAD_DIR, filename);

  const writeStream = fs.createWriteStream(filePath);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(UPLOAD_DIR, `${filename}-${i}`);
    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
    fs.unlinkSync(chunkPath); // 刪除片段
  }
  writeStream.end();

  res.status(200).send("File merged");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```


<br/>


## **File 與 FileList：瀏覽器中的檔案處理**

### **File：特殊的Blob物件**

`File` 是 JS 中專門用來處理文件的類型，它繼承自 `Blob`，因此也具備 `Blob` 的所有特性與方法。除了 `Blob` 的基本屬性（`size` 和 `type`）外增加了一些專門用於描述文件的屬性，如：

- **`name`**：文件的名稱（不包含路徑）。
- **`lastModified`**：最後修改的時間戳，表示文件的上次修改日期（毫秒）。
- **`lastModifiedDate`**（已過時）：用來表示最後修改的日期（舊版瀏覽器支持）。
- **`webkitRelativePath`**：相對路徑，當使用多層文件夾的上傳時，這個屬性會保存文件的相對路徑。

### **FileList：多個文件的集合**

`FileList` 是一個類似陣列的物件，它用來儲存多個 `File` 物件。典型的應用場景是當使用者使用 `<input>` 或拖放文件時，瀏覽器會返回一個 `FileList`，我們可以通過遍歷這個 `FileList` 來獲取所有的文件。

- **使用 `<input type="file" multiple>` 取得 FileList**
    
    如果使用者選擇多個文件，`input` 的 `files` 屬性會返回一個包含所有選中文件的 `FileList`。
    
    ```tsx
    import React from "react";
    
    const FileDetails: React.FC = () => {
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // 獲取第一個文件
        if (file) {
          console.log(`名稱: ${file.name}`);
          console.log(`類型: ${file.type}`);
          console.log(`大小: ${file.size} bytes`);
          console.log(`最後修改: ${new Date(file.lastModified)}`);
        }
      };
    
      return <input type="file" onChange={handleFileChange} />;
    };
    
    export default FileDetails;
    ```
    

- **拖放操作**
    
    當使用拖放功能時，`DataTransfer.files` 屬性會返回一個 `FileList`。
    
    ```tsx
    import React from "react";
    
    const DragAndDrop: React.FC = () => {
      const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 阻止預設行為
        const files = event.dataTransfer.files; // 獲取 FileList
        if (files) {
          Array.from(files).forEach((file) => {
            console.log(`名稱: ${file.name}`);
            console.log(`類型: ${file.type}`);
            console.log(`大小: ${file.size} bytes`);
          });
        }
      };
    
      const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 必須阻止預設行為，否則不會觸發 drop 事件
      };
    
      return (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: "300px",
            height: "200px",
            border: "2px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          拖放檔案到這裡
        </div>
      );
    };
    
    export default DragAndDrop;
    ```


<br/>


## **FileReader：文件資料的解碼工具**

### **FileReader 的角色與用途**

在前一章中，我們聊到如何使用 `File` 和 `FileList` 來獲取用戶選擇的檔案，但這些檔案實際上還只是「包裹著內容的二進制物件」。如果我們想要讀取這些檔案的內容，比如顯示圖片、解析文字、甚至操作二進制數據，那就需要透過 `FileReader`。

簡單來說，`FileReader` 是一個能夠幫助我們「打開檔案內容」的工具，它讓我們能夠**非同步**地讀取用戶的本地檔案，或者是其他以 `Blob` 形式存在的資料。

以下是一些 FileReader 的常見應用場景：

- **顯示圖片**：使用者上傳一張圖片後，我們可以立即在頁面上預覽。
- **分析文字檔**：快速解析檔案中的文字內容，像是讀取 `.txt` 或 `.json` 文件。
- **處理二進制資料**：用於更進階的應用，例如將文件轉成 Base64 格式（適合上傳小文件）、解析音訊、影片等資料格式。

:::tip
為什麼是 **「非同步」** ？因為讀取文件可能會花時間（例如上傳一張超大的圖片），而非同步機制可以避免阻塞程式的執行。
:::

### **FileReader 的三大基石**

- **屬性**
    
    
    | **屬性名稱**   | **描述**                                                                                                 |
    | -------------- | -------------------------------------------------------------------------------------------------------- |
    | **error**      | 一個 `DOMException` 物件，用來記錄讀取資料時發生的錯誤資訊。                                             |
    | **result**     | 讀取到的資料內容，具體的格式取決於使用的讀取方法（例如文字、Base64、二進制等）。                         |
    | **readyState** | 目前的讀取狀態：`0` 表示尚未開始讀取（Empty）、`1` 表示正在讀取（Loading）、`2` 表示已完成讀取（Done）。 |
- **方法**
    
    
    | **方法名稱**           | **描述**                                                                                       |
    | ---------------------- | ---------------------------------------------------------------------------------------------- |
    | **readAsText**         | 將 `Blob` 的內容讀取為文字，完成後會將結果存放在 `result` 屬性中。                             |
    | **readAsDataURL**      | 將 `Blob` 的內容讀取為 Base64 格式的 Data URL，常用於圖片或文件預覽。                          |
    | **readAsBinaryString** | 將 `Blob` 的內容讀取為原始二進制字串，適合處理更底層的資料操作（較少使用，部分瀏覽器已棄用）。 |
    | **readAsArrayBuffer**  | 將 `Blob` 的內容讀取為 `ArrayBuffer`，適合進行高效的二進制數據處理。                           |
    | **abort**              | 中斷讀取操作，當呼叫後，`readyState` 會變成 `DONE`，並觸發 `onabort` 事件。                    |
- **事件**
    
    `FileReader` 繼承自 [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)，所以可以透過 `addEventListenter` 方法來註冊 Listener。
    
    | **事件名稱**    | **描述**                                                         |
    | --------------- | ---------------------------------------------------------------- |
    | **onabort**     | 當讀取操作被中斷時觸發。                                         |
    | **onerror**     | 當讀取過程中發生錯誤時觸發。                                     |
    | **onload**      | 當讀取完成時觸發（無論文件是多大都會執行一次）。                 |
    | **onloadstart** | 當讀取操作開始時觸發。                                           |
    | **onprogress**  | 當讀取過程中有進展時觸發（例如讀取大文件時，每次進度都會觸發）。 |
    | **onloadend**   | 當讀取操作結束時觸發（無論是成功還是失敗）。                     |

### **如何讀取不同類型的文件內容？**

以下我們用程式碼來說明幾種常見的應用情境：

**1. 讀取文字文件**  
當用戶上傳文字文件時，開發者可以透過 `readAsText` 方法來讀取它的內容：

```tsx
const handleFileText = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result); // 這裡會是文件的文字內容
  };
  reader.readAsText(file);
};
```

**2. 圖片預覽**  
對於圖片文件，可以使用 `readAsDataURL` 將其轉換為 Base64，然後直接賦值給 `<img>` 的 `src`：

```tsx
const handleImagePreview = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = document.createElement("img");
    img.src = reader.result as string;
    document.body.appendChild(img); // 在頁面中顯示圖片
  };
  reader.readAsDataURL(file);
};
```

**3. 讀取二進制數據**  
當需要操作更底層的數據時，可以使用 `readAsArrayBuffer`：

```tsx
const handleBinaryData = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result as ArrayBuffer;
    console.log(new Uint8Array(arrayBuffer)); // 將 ArrayBuffer 轉為 Uint8Array 來處理數據
  };
  reader.readAsArrayBuffer(file);
};
```

### **實戰：展示文件的內容或預覽效果**

接著我們用一個實際範例來示範，當使用者上傳檔案時，如何即時預覽圖片或顯示文字內容：

```tsx
import React, { useState } from "react";

const FileReaderExample: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setFileType(file.type);

      // 根據檔案類型選擇讀取方式
      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file); // 圖片檔案
        reader.onload = () => setFileContent(reader.result as string);
      } else {
        reader.readAsText(file); // 文字檔案
        reader.onload = () => setFileContent(reader.result as string);
      }

      reader.onerror = () => {
        console.error("讀取檔案失敗", reader.error);
        setFileContent("讀取檔案失敗，請再試一次。");
      };
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {fileContent && fileType?.startsWith("image/") ? (
        <img src={fileContent} alt="Preview" style={{ maxWidth: "100%" }} />
      ) : (
        <pre>{fileContent}</pre>
      )}
    </div>
  );
};

export default FileReaderExample;
```


<br/>


## **ArrayBuffer：二進制資料的基礎容器**

在前面幾章中，我們主要聊到了 `Blob` 和 `FileReader`，不過它們的操作仍屬於高階應用，更多時候被用來完成如文件上傳或圖片顯示這類任務。

然而，如果你想更細緻地操作檔案的內部數據，比如調整圖片的像素或解析一段音訊的波形，這時候就不能停留在 `Blob` 這種「完整物件」的層面了，而需要更底層的工具來幫助我們操作原始的二進制資料。而這就是 `ArrayBuffer` 登場的時刻。

### **什麼是 ArrayBuffer？**

簡單來說，`ArrayBuffer` 是一段用來存放二進制資料的記憶體。你可以把它想像成一個固定大小的容器，裡面全是位元組（`byte`）。不同於 `Blob`，它不是用來處理檔案整體的，而是直接讓你操作檔案內部的細節，如果把 `Blob` 比作一個「完整的檔案」，那麼 `ArrayBuffer` 更像是檔案裡最細微的「零件」。它能讓我們處理那些用於圖片、音訊、甚至是網路協議中的原始資料，像是文字的 ASCII 碼，或是圖片的 RGB 像素值之類的。

那麼，`ArrayBuffer` 能做什麼呢？其實它的應用範圍很廣，包括：

- **圖片處理**：對圖片的像素進行調整（比如黑白化或反轉顏色）。
- **音訊處理**：解析音訊的波形，進行音量調整或特效處理。
- **資料解壓縮**：操作壓縮格式中的每個位元組。
- **網路傳輸**：處理通過 WebSocket 傳遞的二進制數據。

### **ArrayBuffer 的特性**

我們說了那麼多，`ArrayBuffer` 到底長什麼樣？它有什麼特點？這裡我們一步步來認識它。

**1. 固定大小**  
`ArrayBuffer` 是在創建時就指定大小的容器，大小一旦確定，就無法改變。這意味著它就像一個固定大小的盒子，無論裡面裝的是什麼，都不能超過它的容量。

```tsx
const buffer = new ArrayBuffer(16); // 建立一個 16 bytes 的 ArrayBuffer
console.log(buffer.byteLength); // 16
```

**2. 不能直接操作**  
雖然 `ArrayBuffer` 是用來儲存數據的，但你不能直接訪問或修改它的內容。為什麼呢？因為 `ArrayBuffer` 是一段純記憶體，沒有具體的數據格式，為了能讀懂它，我們需要透過「**檢視**」來訪問它的內容。

這裡的「**檢視**」有兩種：

- **`TypedArray`**：專門用來操作特定類型數據的工具，比如整數、浮點數等。
- **`DataView`**：一種靈活的檢視方式，允許你按照自訂的數據格式來讀寫內容。

### **TypedArray：二進制數據的專用窗口**

接下來，我們先來看第一種檢視方式：**`TypedArray`**。如果把 `ArrayBuffer` 比作一個箱子，那麼 `TypedArray` 就是專門幫助我們「打開箱子並按照類型分類」的工具。

`TypedArray` 讓我們可以以指定的數據格式讀寫 `ArrayBuffer`。比如：

- 如果你要處理圖片的像素值，可能會用 `Uint8Array`，因為每個像素值可以用 8 位元來表示。
- 如果你要處理音訊的波形數據，可能會用 `Float32Array`，因為音訊數據通常是浮點數。

**TypedArray 的常見類型**

| 類型           | 單位大小 | 描述                                |
| -------------- | -------- | ----------------------------------- |
| `Uint8Array`   | 1 byte   | 8 位元無符號整數（0 ~ 255）         |
| `Int16Array`   | 2 bytes  | 16 位元有符號整數（-32768 ~ 32767） |
| `Float32Array` | 4 bytes  | 32 位元浮點數                       |

**範例：使用 TypedArray 操作 ArrayBuffer**

```tsx
const buffer = new ArrayBuffer(8); // 建立一個 8 bytes 的 ArrayBuffer
const uint8View = new Uint8Array(buffer); // 創建 Uint8Array 檢視
uint8View[0] = 255; // 將第 0 個位元組設為 255
console.log(uint8View); // Uint8Array(8) [ 255, 0, 0, 0, 0, 0, 0, 0 ]
```

### **DataView：靈活但進階的選擇**

如果 `TypedArray` 是專門用來處理固定格式的數據，那麼 **`DataView`** 就是全能型選手，允許你以更多樣化的方式讀寫 `ArrayBuffer`。

`DataView` 的設計非常靈活，它不僅能操作多種數據類型，還可以控制位元組的順序（Big Endian 或 Little Endian）。這對於處理複雜的二進制格式非常有用，比如自訂的文件格式或網路協議。

**範例：用 DataView 操作 ArrayBuffer**

```tsx
const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);

view.setInt8(0, 42); // 在第 0 個位元組寫入整數 42
console.log(view.getInt8(0)); // 42

view.setFloat32(1, 3.14, true); // 在第 1~4 個位元組寫入浮點數 3.14
console.log(view.getFloat32(1, true)); // 3.14
```

### **實戰：如何操作 ArrayBuffer 處理圖片與音訊？**

**範例 1：圖片像素反轉**  
假設我們有一張灰階圖片，我們可以用 `Uint8Array` 來操作每個像素值，將其顏色反轉。

```tsx
const invertImage = (buffer: ArrayBuffer) => {
  const pixels = new Uint8Array(buffer);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = 255 - pixels[i]; // 反轉顏色
  }
  return buffer;
};
```

**範例 2：音訊波形調整**  
使用 `Float32Array` 操作音訊數據，來調整音量。

```tsx
const adjustVolume = (buffer: ArrayBuffer, factor: number) => {
  const audioSamples = new Float32Array(buffer);
  for (let i = 0; i < audioSamples.length; i++) {
    audioSamples[i] *= factor; // 調整音量
  }
  return buffer;
};
```


<br/>


## **Buffer：Node.js 的二進制資料核心**

在前端世界中，我們使用 `Blob` 和 `ArrayBuffer` 來處理二進制數據，但到了 Node.js 環境，操作二進制數據的方式有所不同，這是因為 Node.js 本質上是為了伺服器端設計的。Node.js 的設計強調高性能和非同步處理，這使得它需要一個專門的工具來高效地處理二進制數據，那就是 **Buffer**。

### **Buffer 的定義與用途**

在 Node.js 中，**`Buffer`** 是一個用於操作二進制數據的類型，它可以看成是 Node.js 版本的 `ArrayBuffer`，但功能更強大。那麼，**Buffer** 是什麼呢？

簡單來說，`Buffer` 就是 Node.js 提供的一塊記憶體，用於暫存和操作二進制數據。它的名字（緩衝區）也說明了它的用途——緩衝。舉個例子：

- 當伺服器從客戶端接收到一段資料時，這段資料會被存放到 `Buffer` 中，然後再進行處理。
- 當你下載一段音訊，會發現播放器會先「緩衝」一部分資料，這些資料其實也可以看作是一個 `Buffer`。

`Buffer` 的用途非常廣泛，以下是一些常見的例子：

1. **二進制數據儲存**：用於存放文件內容、圖片、音訊或網路請求中的原始資料。
2. **數據轉換**：將字串轉換為二進制數據，或將二進制數據轉回字串，支持多種編碼格式。
3. **文件操作**：Node.js 的文件系統模組（`fs`）使用 `Buffer` 來讀取和寫入文件。
4. **網路通信**：`Buffer` 是構建 HTTP 請求、處理 WebSocket 數據的重要工具。
5. **加密與解密**：許多加密算法（如 AES、RSA）需要處理原始的二進制數據。

:::tip **Buffer 與前端工具的比較**

| **特性**       | **Buffer (Node.js)** | **ArrayBuffer (前端)**                |
| -------------- | -------------------- | ------------------------------------- |
| 動態大小       | 支援                 | 不支援                                |
| 可直接操作數據 | 支援                 | 需要檢視 (`TypedArray` 或 `DataView`) |
| 編碼支持       | 內建支持多種字符編碼 | 無直接支持                            |
:::

### **Buffer 與字符編碼**

在處理文字數據時，字符編碼是不可避免的話題，而 `Buffer` 本身內建對多種編碼的支持。這讓它能夠輕鬆地在字串和二進制數據之間進行轉換。

以下是一些常見的字符編碼：

1. **UTF-8**：最常用的編碼格式，用於處理多語言字符。
2. **Base64**：常用於將二進制數據轉為字串格式，方便傳輸。
3. **Hex**：十六進制編碼，常用於調試和加密。

通過使用顯式的字元編碼，就可以在 `Buffer`實例與普通的`JavaScript`字串之間進行相互轉換。

```jsx
// 將字串轉為 Buffer
const buffer = Buffer.from("Hello, 世界", "utf-8");
console.log(buffer); // <Buffer 48 65 6c 6c 6f 2c 20 e4 b8 96 e7 95 8c>

// 將 Buffer 轉回字串
const str = buffer.toString("utf-8");
console.log(str); // Hello, 世界
```

### **Buffer 的創建與操作**

Node.js 提供了多種方法來創建 `Buffer`，具體方法的選擇取決於你的需求。

- **從字串創建**
    
    ```jsx
    const buf = Buffer.from("Hello, 世界", "utf-8");
    console.log(buf); // <Buffer 48 65 6c 6c 6f 2c 20 e4 b8 96 e7 95 8c>
    ```
    
- **從陣列創建**
    
    ```jsx
    const buf = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    console.log(buf.toString()); // Hello
    ```
    
- **分配固定大小的緩衝區**
    
    ```jsx
    const buf = Buffer.alloc(10); // 建立一個 10 bytes 的緩衝區，初始值為 0
    buf[0] = 72; // 設定第一個字節的值
    console.log(buf.toString()); // 輸出時需根據數據設置編碼
    ```
    

### **Buffer 的讀寫與字串轉換**

- **寫入 Buffer**
    
    ```jsx
    	const buf = Buffer.alloc(10);
    buf.write("Hello", "utf-8");
    console.log(buf); // <Buffer 48 65 6c 6c 6f 00 00 00 00 00>
    ```
    
- **讀取 Buffer**
    
    ```jsx
    console.log(buf.toString("utf-8", 0, 5)); // Hello
    ```
    
- **轉換為 JSON**
    
    `Buffer` 還可以直接轉為 JSON 格式，方便序列化。
    
    ```jsx
    const json = buf.toJSON();
    console.log(json); // { type: 'Buffer', data: [ 72, 101, 108, 108, 111, 0, 0, 0, 0, 0 ] }
    ```
    

### **實戰：構建一個簡易的 Base64 編碼器與解碼器**

Base64 是一種常見的編碼方式，用於將二進制數據轉換為字串，方便在網路中傳輸。以下是一個簡單的 Base64 編碼器與解碼器。

**編碼器**

```tsx
const encodeBase64 = (input: string): string => {
  const buffer = Buffer.from(input, "utf-8");
  return buffer.toString("base64");
};
console.log(encodeBase64("Hello, 世界")); // SGVsbG8sIOS4lueVjw==
```

**解碼器**

```jsx
const decodeBase64 = (input: string): string => {
  const buffer = Buffer.from(input, "base64");
  return buffer.toString("utf-8");
};
console.log(decodeBase64("SGVsbG8sIOS4lueVjw==")); // Hello, 世界
```


<br/>


## **Reference**

- [**二进制数据Blob,file,ArrayBuffer,fileReader...**](https://juejin.cn/post/7416924104039694377)
- [**使用 Blob 和 File 相關 Web API 即時呈現上傳圖片檔案**](https://jiepeng.me/2018/04/17/use-blob-and-file-web-api-create-upload-image-preview-immediately)
- [**聊聊JS的二進制家族：Blob、ArrayBuffer和Buffer**](https://cloud.tencent.com/developer/article/1556948)
- [**誰說前端不需要懂二進制**](https://cloud.tencent.com/developer/article/1647277)
- [**@mdn - FileReader**](https://developer.mozilla.org/zh-TW/docs/Web/API/FileReader)
- [**@mdn - Blob**](https://developer.mozilla.org/zh-TW/docs/Web/API/Blob)
- [**搞懂 ArrayBuffer、TypedArray、DataView 的對比和使用**](https://juejin.cn/post/7005810137491308580#heading-7)
- [**Day9 NodeJS-Buffer與Stream**](https://ithelp.ithome.com.tw/m/articles/10271443)
- [**NodeJS Buffer 理解**](https://vocus.cc/article/64fc39a4fd89780001ae6237)
- [**Node.js | Buffer(緩衝區)**](https://morosedog.gitlab.io/nodejs-20200123-Nodejs-11/)