---
title: 以 React + Express 為範例探討 Web 應用中的檔案上傳機制
sidebar_label: "[實作紀錄] React+Express 實作檔案上傳功能"
description: 本篇技術筆記將以 React + Express 為例，探討 Web 應用中的檔案上傳機制。本文章將介紹如何使用 React 搭配 react-dropzone 套件建立前端上傳介面，以及如何使用 Express 搭配 multer 套件在後端處理上傳的檔案。
last_update:
  date: 2024-04-18
keywords:
  - Web 檔案上傳機制
  - upload
  - React
  - Express
  - File
  - Buffer
  - multer
  - react-dropzone
tags:
  - Web
  - React
  - Express
---

最近在工作遇到了需要處理上傳檔案的需求，借此機會完整地學習 Web 前後端處理檔案上傳的機制。本篇筆記以一個簡單範例輔助學習，該範例提供使用者在畫面中上傳任意圖片格式的單一圖片檔案，並儲存於伺服器端的特定資料夾中。使用者可以透過拖放的方式將檔案上傳至網站上，亦可以用點擊的方式打開資料總管，選擇要上傳的檔案。

:::note
本篇筆記專注於探討 React 專案中檔案上傳的各種機制與資料結構。本文不會深入討論元件的樣式問題。本筆記提供的範例程式碼將專注於功能實現。
:::

## **範例**

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1713414104/Docusaurus%20Blog/Web/%E6%AA%94%E6%A1%88%E4%B8%8A%E5%82%B3%E6%A9%9F%E5%88%B6/upload-app_espdgo.png)

### **Example Code: React**

- 使用 Vite 在 **frontend** 資料夾建立一個新的 React 專案

```bash
yarn create vite frontend --template react-ts
cd frontend
yarn
```

- 安裝必要套件

```bash

yarn add @mui/material @emotion/react @emotion/styled
yarn add axios react-dropzone
```

- **frontend/src/App.tsx**

```tsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography, Paper, Button, Snackbar } from "@mui/material";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
    preview: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress ? oldProgress * 2 : oldProgress + 10; // 每次增加 10%，可根據需求調整
      });
    }, 100); // 每 100 毫秒更新一次進度
  };

  const handleFileChange = (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      preview: URL.createObjectURL(selectedFile),
    });
    simulateUploadProgress(); // 模擬上傳進度
  };

  const uploadFile = () => {
    if (!file) {
      alert("請先選擇一個檔案。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("file", file);
    console.log("formData", formData);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((response) => {
        console.log(response.data);
        setOpenSnackbar(true); // 顯示上傳成功的通知
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    // accept: { "image/jpeg": [], "image/png": [] },
    accept: { "image/*": [] },
    onDrop: handleFileChange,
    onDragEnter: () => {
      setUploadProgress(0);
    },
    onFileDialogOpen: () => {
      setUploadProgress(0);
    },
  });
  console.log("getRootProps", getRootProps());
  console.log("getInputProps", getInputProps());

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <Paper elevation={3} sx={{ width: "50%", padding: "20px" }}>
        <Box
          {...getRootProps()}
          sx={{ border: "2px dashed #ccc", p: 3, mb: 3 }}
        >
          <input {...getInputProps()} />
          <Typography sx={{ textAlign: "center" }}>
            將檔案拖曳到這裡，或點擊選擇檔案
          </Typography>
        </Box>
        <LinearProgress
          variant='determinate'
          value={uploadProgress}
          sx={{ marginTop: "10px" }}
        />
        {uploadProgress === 100 && fileInfo && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <img
              src={fileInfo.preview}
              alt='Preview'
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                marginRight: "10px",
              }}
            />
            <Typography sx={{ flexGrow: 1 }}>{fileInfo.name}</Typography>
            <Typography sx={{ mx: 1 }}>{fileInfo.type}</Typography>
            <Typography sx={{ mx: 1 }}>
              {(fileInfo.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        )}
        <Button
          variant='contained'
          onClick={uploadFile}
          sx={{ width: "100%", marginTop: "10px" }}
        >
          上傳檔案
        </Button>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message='上傳成功！'
      />
    </Box>
  );
};

export default App;

```

### **Example Code: Express**

- 在 **backend** 資料夾建立一個新的 Express 專案

```bash
mkdir backend
cd backend
yarn init -y
```

- 安裝必要套件

```bash
yarn add express multer
yarn add @types/node @types/express @types/multer ts-node-dev typescript -D
```

- 在 backend 目錄中，創建 **tsconfig.json**：

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "commonjs",
        "moduleResolution": "node",
        "outDir": "./dist",
        "esModuleInterop": true,
        "strict": true
    },
    "include": ["src/**/*"]
}
```

- 打開 **backend/package.json** 文件，並在其中添加如下的 **scripts** 部分：

```json
"scripts": {
  "start": "ts-node-dev src/index.ts",
  "build": "tsc",
  "serve": "node dist/index.js"
}
```

- **backend/src/index.ts**

```tsx
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
const port = 5000;
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // 先轉換檔案名編碼
    const correctedName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const ext = path.extname(correctedName);
    const baseName = path.basename(correctedName, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log(`Received file: ${req.file.path}`);
    res.json({ message: "檔案上傳成功", path: req.file.path });
  } else {
    res.status(400).json({ message: "檔案上傳失敗" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

```


<br/>


## **前端(React)上傳檔案機制**

### **HTML 元素 \<input type="file">**
在 Web 應用中，檔案上傳功能的實現通常依賴於 `<input type="file">` 這個 HTML 元素。當使用這種類型的輸入時，瀏覽器會提供一個按鈕，用戶點擊後會打開標準的系統文件選擇對話框，用戶可以從本地電腦中選擇一個或多個文件。

> 參閱 [**@MDN-\<input type="file">**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#using_file_inputs)


- **基本用法**

基本的文件輸入元素看起來像這樣：

```tsx
<input type="file" id="myfile" name="myfile">
```
這個元素會在網頁上創建一個按鈕，用戶點擊後可以選擇文件。

- **接受特定類型的文件**

**\<input>** 標籤的 `accept` 屬性允許我們限制用戶可以選擇的文件類型。例如，如果只希望用戶上傳圖片，可以這樣設定：

```tsx
<input type="file" id="imagefile" name="imagefile" accept="image/*">
```

- **多文件選擇**

如果希望允許用戶一次選擇多個文件，可以添加 `multiple` 屬性：

```tsx
<input type="file" id="multiplefiles" name="files" accept="image/*" multiple>
```


### **檔案資料類型：File, FileList**

當用戶通過 **\<input type="file">** 選擇了文件後，這些文件將會作為 DOM 元素的一部分存儲在其 `files` 屬性中。我們在前端可以寫一個事件處理函數綁定於當用戶選擇了新的檔案時觸發的 onChange 事件，這樣我們就可以從事件目標(**event.target**)中獲取檔案資料進行進一步的操作。

- **FileList**

當使用者選擇檔案後，事件的 **target.files** 屬性是一個 **`FileList`** 物件。**`FileList`** 是一個類似陣列的物件，包含了所有選擇的檔案。每個檔案都被封裝為一個 **`File`** 物件。

> 參閱 **[@MDN-FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)**
> 

- **File**

**`File`** 物件包含在 **`FileList`** 中，提供了檔案的基本訊息，它繼承自 **`Blob`**，並添加了檔案相關的屬性，像是：

- **name**：檔案的名稱（包括擴展名）。
- **size**：檔案的大小，以 byte 為單位。
- **type**：檔案的 MIME 類型，例如 "image/jpeg"。
- **lastModified**：檔案最後修改的時間戳，以毫秒為單位。這個數值表示自 1970 年 1 月 1 日午夜 (00:00 UTC) 至文件最後修改時間的毫秒數。
- **lastModifiedDate**：檔案最後修改的日期，為一個 **Date** 物件。這個屬性是對 **lastModified** 毫秒時間戳的一個更直觀的日期表示，便於讀取和顯示。

> 參閱 **[@MDN-File](https://developer.mozilla.org/en-US/docs/Web/API/File) [@MDN-Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) [@MDN-MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type)**
>


### **使用 react-dropzone 以 Drag & Drop 方式上傳檔案**

比起傳統的點擊上傳按鈕，現在的 Web 應用程式通常允許用戶直接從他們的檔案管理器中把文件拖到網頁的指定區域，本文章提供的範例中使用了 **`react-dropzone`** 套件來實現這一功能。 **react-dropzone** 封裝了很多細節和事件處理，讓開發者可以輕鬆地實現拖放功能，它提供了一個簡單的 **useDropzone API** ，讓開發者可以輕鬆的設定並管理拖放區域所需的所有屬性和方法。

> 詳細API 使用方法參閱 **[@react-dropzone](https://react-dropzone.js.org/#src)**
> 

以下簡單介紹 **`useDropzone`** 的幾個常用的參數定義與回傳

- 選項
    - **accept**：指定接受的檔案類型。
    - **onDrop**：當檔案被拖放到區域時的回呼，參數為接受和拒絕的檔案。
    - **multiple**：是否允許選擇多個檔案。
    - **minSize、maxSize**：設定檔案的最小和最大大小。
    - **disabled**：停用拖放功能。
    - **maxFiles**：限制用戶一次性能夠上傳的最大文件數量
    - **noClick**：當設置為 **true** 時，拖放區域將不會響應點擊事件，這意味著用戶不能通過點擊來打開文件選擇對話框。
    - **noDrag**：當設置為 **true** 時，禁用拖放功能。這意味著用戶不能將文件拖到指定區域來上傳，但仍可以通過點擊來觸發文件選擇。
- **回傳**
    - **getRootProps()**：返回應用於拖放區域的 props，包括 onClick, onDrop 等事件處理器等
    - **getInputProps()**：返回應用於 **\<input type="file">** 的 props，如 `{accept: 'image/*', multiple: true, type: 'file', style: {display: 'none'}, onChange: ƒ, …}`。
    - **acceptedFiles**：一個包含所有被接受檔案的陣列。
    - **fileRejections**：一個包含所有被拒絕檔案的陣列，每個對象包含檔案和錯誤資訊。
    - **open()**：一個函數，可以用來打開檔案選擇器，通常用於自訂點選行為時。


### **預覽圖片**

當我們需要在畫面上顯示一張圖片時，會需要在前端程式碼中添加一個 **\<img>** 元素， 並指定元素 **src** 為圖片的來源 URL 。這個 URL 可以來自後端伺服器或公開的網路資源。

> 然而，在前端在把照片檔案上傳至後端之前，這個 URL 由誰來提供呢？
> 

**答案就是前端自己！**

前端可以透過以下兩種常見的方法來獲取本地圖片檔案的URL，以便在上傳前進行預覽

- **方法一: 使用 FileReader**
    
    > 參閱 [**@MDN-FileReader**](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
    > 
    
    **`FileReader`** 是 Web API 的一部分，它允許 Web 應用非同步讀取儲存在用戶系統上的文件（或原始數據）內容，無論是一般檔案(**`File`** 物件)或是二進位資料(**`Blob`** 物件)。
    
    ```tsx
    import React, { useState } from 'react';
    
    function ImagePreview() {
      const [preview, setPreview] = useState(null);
    
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result);  // 使用讀取到的 Base64 URL
          };
          reader.readAsDataURL(file);  // 讀取文件並轉換成 Base64 編碼的 URL
        } else {
          setPreview(null);
        }
      };
    
      return (
        <div>
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" />}
        </div>
      );
    }
    
    export default ImagePreview;
    ```
    
    - `readAsDataURL` 方法讀取文件並將其轉換為一個 Base64 編碼的 URL
    - 當文件讀取完成後，**onload** 事件被觸發，**FileReader.result** 屬性將包含所讀取檔案的Data URI，並將其設為預覽圖的 source URL圖片顯示在畫面上。
- **方法二: URL.createObjectURL**
    
    > 參閱 **[@URL: createObjectURL() static method](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#examples)**
    > 
    
    `URL.createObjectURL` 是一個創建一個包含指定文件內容的 URL 的方法。這個 URL 的壽命為新窗口的生命周期，直到被撤銷(`URL.revokeObjectURL`)。這個方法比 **FileReader** 更為高效，因為它不需要讀取文件內容，直接生成一個指向文件的 URL。
    
    ```tsx
    import React, { useState, useEffect } from 'react';
    
    function ImagePreview() {
      const [preview, setPreview] = useState(null);
    
      useEffect(() => {
        // 這個 effect 會在組件卸載時執行
        return () => preview && URL.revokeObjectURL(preview);
      }, [preview]);
    
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
        } else {
          setPreview(null);
        }
      };
    
      return (
        <div>
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" />}
        </div>
      );
    }
    
    export default ImagePreview;
    ```


### **使用 FormData 資料格式傳輸資料給後端**

在網路的世界裡，服務之間透過 protocol 來規範資料的傳遞規則、形式。HTTP 協議定義了多種數據傳輸的內容類型(Content-Types)。[MIME Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 定義了傳輸格式的種類：

- `Content-Type: application/json` 代表 request 內容是 JSON
- `Content-Type: image/png` 代表 request 內容是圖片檔

其中，在上傳文件時，HTTP 支持一種叫做 `"multipart/form-data"` 的內容類型，這是一種專門用於優化二進位數據傳輸(如文件上傳)的編碼格式。`multipart/form-data` 會將表單數據分成多個部分（每部分可能包含不同類型的數據），每個部分都由一個 boundary 分隔符分隔開來，這種方法特別適用於傳送文本或二進位資料。

前端要傳送 Content-Type 為 **multipart/form-data** 的 request 有兩種方法：

1. **使用 \<form> 元素**

```jsx
<form method="POST" action="/upload" method="POST">
  <input type="text" name="username" />
  <input type="file"  name="avatar" />
  <button>Submit</button>
</form>
```

瀏覽器會將\<form> 元素內的 \<input> 元素序列化，並 以 POST 方法送出 `Content-Type: multipart/form-data` 的 HTTP 請求

1. **使用 FormData 物件**

```jsx
// 從 HTML 表單元素自動擷取資料
const formElement = document.querySelector('form');
const formData = new FormData(formElement);

// 或者手動創建並添加數據
const formData = new FormData();
formData.append('username', 'JohnDoe');
formData.append('age', 30);
```

`FormData` 是一個 JavaScript 的 Web API，用於構建表單資料的集合，它可以封裝資料並準備傳送到伺服器。這包括文本字段（如姓名、郵件等）和二進制文件（如圖片上傳）。使用 `FormData` 最大的優勢是可以讓我們不需要手動處理表單資料的編碼問題，且如果將 FormData 作為 payload，瀏覽器會自動幫我們以 `multipart/form-data` 的形式傳送。

> 參閱 **[@MDN-FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)**
>


<br/>


## **後端(Express)接收與處理檔案資料機制**

### **multer**

**`multer`** 是一個用於處理 `multipart/form-data` 類型資料的 middleware 套件，它通常與 Express.js 框架搭配使用，用於處理上傳檔案。以下是 **multer** 的一些主要功能：

1. **檔案處理**: 開發者可以自訂檔案儲存的位置以及檔案名稱等設定。Multer 提供不同的儲存引擎(storage engines)，如 **DiskStorage** 用於儲存檔案於磁碟，以及 **MemoryStorage** 用於儲存檔案於記憶體中。
2. **檔案過濾**: 可以設定過濾器(filter),允許或拒絕特定類型的檔案上傳。
3. **錯誤處理**: Multer 提供了多個中介軟體來處理不同的錯誤,如檔案大小限制、MIME 類型錯誤等。

### **multer 設定檔案處理方法**

本範例中，我們直接將文件直接存儲到伺服器端特定的資料夾，可以使用 **`multer`** 的 **`diskStorage`** 選項來配置存儲方式。

- `destination` 設置了文件應該被存儲的目錄
- `filename` 用於生成存儲時使用的文件名

這兩者都是接收 (`req, file, cb`) 做為參數的函數。

- `req`: 代表了 HTTP 請求，包含了請求參數、內容、HTTP標頭等。
    - **req.file**：當使用 **single()** 中間件處理單個文件時，上傳的文件資訊會存儲在 req.file。
    - **req.files**：當使用 **array()、fields()** 或 **any()**  middleware 處理多個文件時，上傳的文件資訊會存儲在 req.files。
- `file`: 包含了關於上傳文件的各種資訊
    - **file.originalname**：用戶上傳的文件的原始名稱。
    - **file.mimetype**：文件的 MIME 類型。
    - **file.size**：文件的大小（字節為單位）。
    - **file.fieldname**：表單中的字段名。
    - **file.buffer**：當使用 **memoryStorage** 存儲時，文件的數據會存儲在 file.buffer。
- `cb`: 回調函數，這個函數通常有兩個參數：
    - **第一個參數**：錯誤物件（如果有錯誤發生）。如果一切正常，應該傳遞 **`null`**。
    - **第二個參數**：要傳回給 **multer** 的結果。例如，在 `filename` 函數中，你需要傳遞計算出的文件名；在 `destination` 函數中，你需要傳遞目標存儲路徑。

### **在 api route 嵌入接收檔案方法**

```jsx
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log(`Received file: ${req.file.path}`);
    res.json({ message: "檔案上傳成功", path: req.file.path });
  } else {
    res.status(400).json({ message: "檔案上傳失敗" });
  }
});
```

在這裡，`upload.single('file')` 是 **multer** 的一個 middleware，**multer** 將會處理其中的 **multipart/form-data**，尋找名為 **file** 的文件，並嘗試讀取這個文件的數據，將其儲存至配置的目標位置（磁盤或內存），然後將文件的信息放入 **req.file** 以供後續的中間件或路由處理器使用。