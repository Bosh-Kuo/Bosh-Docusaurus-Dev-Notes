---
title: How File Uploads Work in Web Apps, with React and Express
slug: upload_file
authors: bosh
description: A look at how file uploads work in web applications, using React and Express as an example. I use react-dropzone to build the frontend upload interface and multer to handle uploaded files on the Express backend.
keywords: [Web File Uploads, upload, React, Express, File, Buffer, multer, react-dropzone]
tags: [Web]
date: 2024-04-18
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1713414104/Docusaurus%20Blog/Web/%E6%AA%94%E6%A1%88%E4%B8%8A%E5%82%B3%E6%A9%9F%E5%88%B6/upload-app_espdgo.png
---

I recently needed to handle file uploads at work, so I took the opportunity to learn how the process works on both sides of a web application. To make things concrete, this post uses a simple example: users can upload one image at a time, in any image format, and the server saves it in a specific folder. Users can drag a file onto the page or click to open the system file picker and choose one.

<!-- truncate -->

:::note
This post focuses on the mechanisms and data structures involved in uploading files from a React project. I won't go into component styling; the examples focus on getting the functionality working.
:::

## **The Example** {#範例}

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1713414104/Docusaurus%20Blog/Web/%E6%AA%94%E6%A1%88%E4%B8%8A%E5%82%B3%E6%A9%9F%E5%88%B6/upload-app_espdgo.png)

### **Example Code: React** {#example-code-react}

- Create a React project in the **frontend** folder using Vite.

```bash
yarn create vite frontend --template react-ts
cd frontend
yarn
```

- Install the packages we'll need.

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
        return oldProgress ? oldProgress * 2 : oldProgress + 10; // Increase by 10% each time; adjust as needed
      });
    }, 100); // Update progress every 100 milliseconds
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
    simulateUploadProgress(); // Simulate upload progress
  };

  const uploadFile = () => {
    if (!file) {
      alert("Please select a file first.");
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
        setOpenSnackbar(true); // Show the upload success notification
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
            Drag a file here, or click to select one
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
          Upload File
        </Button>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message='Upload successful!'
      />
    </Box>
  );
};

export default App;

```

### **Example Code: Express** {#example-code-express}

- Create an Express project in the **backend** folder.

```bash
mkdir backend
cd backend
yarn init -y
```

- Install the packages we'll need.

```bash
yarn add express multer
yarn add @types/node @types/express @types/multer ts-node-dev typescript -D
```

- Create **tsconfig.json** in the backend directory:

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

- Open **backend/package.json** and add this **scripts** section:

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
    // Convert the filename encoding first
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
    res.json({ message: "File uploaded successfully", path: req.file.path });
  } else {
    res.status(400).json({ message: "File upload failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

```

<br/>

## **How the Frontend (React) Handles File Uploads** {#前端react上傳檔案機制}

### **The HTML \<input type="file"> Element** {#html-元素-input-typefile}

File uploads in web applications usually start with the HTML `<input type="file">` element. The browser renders a button that opens the standard system file picker, where users can select one or more files from their computer.

> See [**@MDN-\<input type="file">**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#using_file_inputs).

- **Basic usage**

A basic file input looks like this:

```tsx
<input type="file" id="myfile" name="myfile">
```

This adds a button to the page that users can click to select a file.

- **Accepting specific file types**

The **\<input>** element's `accept` attribute lets us restrict the types of files users can choose. For example, to accept images only:

```tsx
<input type="file" id="imagefile" name="imagefile" accept="image/*">
```

- **Selecting multiple files**

Add the `multiple` attribute to let users select several files at once:

```tsx
<input type="file" id="multiplefiles" name="files" accept="image/*" multiple>
```

### **File Data Types: File and FileList** {#檔案資料類型file-filelist}

When a user selects files through **\<input type="file">**, those files are available in the DOM element's `files` property. On the frontend, we can attach a handler to the onChange event, which fires when a new file is selected, and get the file data from **event.target** to work with it.

- **FileList**

After a user selects files, the event's **target.files** property contains a **`FileList`** object. A **`FileList`** is an array-like object containing all the selected files, each represented by a **`File`** object.

> See **[@MDN-FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)**.

- **File**

Each **`File`** in a **`FileList`** provides basic information about the file. It inherits from **`Blob`** and adds file-specific properties, including:

- **name**: The filename, including its extension.
- **size**: The file size in bytes.
- **type**: The file's MIME type, such as "image/jpeg".
- **lastModified**: The file's last-modified timestamp in milliseconds, measured from midnight on January 1, 1970 (00:00 UTC).
- **lastModifiedDate**: The last-modified date as a **Date** object. This provides a more readable date representation of the **lastModified** timestamp for display.

> See **[@MDN-File](https://developer.mozilla.org/en-US/docs/Web/API/File)**, **[@MDN-Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)**, and **[@MDN-MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type)**.

### **Drag-and-Drop Uploads with react-dropzone** {#使用-react-dropzone-以-drag--drop-方式上傳檔案}

Alongside the traditional upload button, modern web apps often let users drag files from their file manager onto a designated area of the page. The example here uses **`react-dropzone`** for this. It handles many of the details and events for us, exposing a simple **useDropzone API** to configure and manage the props and methods a drop zone needs.

> For the full API, see **[@react-dropzone](https://react-dropzone.js.org/#src)**.

Here are some commonly used **`useDropzone`** options and return values:

- Options
    - **accept**: The file types to accept.
    - **onDrop**: A callback invoked when files are dropped, with the accepted and rejected files as arguments.
    - **multiple**: Whether users can select multiple files.
    - **minSize, maxSize**: The minimum and maximum file sizes.
    - **disabled**: Disables the drop zone.
    - **maxFiles**: The maximum number of files users can upload at once.
    - **noClick**: When **true**, clicking the drop zone won't open the file picker.
    - **noDrag**: When **true**, disables drag and drop. Users can still click to select files.
- **Return values**
    - **getRootProps()**: Returns props for the drop zone, including event handlers such as onClick and onDrop.
    - **getInputProps()**: Returns props for **\<input type="file">**, such as `{accept: 'image/*', multiple: true, type: 'file', style: {display: 'none'}, onChange: ƒ, …}`.
    - **acceptedFiles**: An array of all accepted files.
    - **fileRejections**: An array of rejected files. Each entry contains the file and error information.
    - **open()**: Opens the file picker, typically for a custom click action.

### **Previewing Images** {#預覽圖片}

To display an image, we add an **\<img>** element and set its **src** to the image's URL. That URL might point to our backend or a public resource on the web.

> But if we haven't uploaded the image to the backend yet, where does the preview URL come from?

**The frontend can create it itself!**

There are two common ways to get a URL for a local image so we can preview it before uploading:

- **Method 1: FileReader**

    > See [**@MDN-FileReader**](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

    **`FileReader`** is a Web API that lets applications asynchronously read files or raw data stored on the user's system, whether they're **`File`** objects or binary data represented by **`Blob`** objects.

    ```tsx
    import React, { useState } from 'react';
    
    function ImagePreview() {
      const [preview, setPreview] = useState(null);
    
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result);  // Use the Base64 URL read from the file
          };
          reader.readAsDataURL(file);  // Read the file and convert it to a Base64-encoded URL
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

    - `readAsDataURL` reads the file and converts it into a Base64-encoded URL.
    - Once reading finishes, the **onload** event fires. **FileReader.result** contains the file's data URI, which we use as the preview image's source URL to display it on the page.

- **Method 2: URL.createObjectURL**

    > See **[@URL: createObjectURL() static method](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#examples)**.

    `URL.createObjectURL` creates a URL that refers to the given file's contents. It lasts for the lifetime of the window unless revoked with `URL.revokeObjectURL`. This is more efficient than **FileReader** because it creates a reference to the file without reading its contents.

    ```tsx
    import React, { useState, useEffect } from 'react';
    
    function ImagePreview() {
      const [preview, setPreview] = useState(null);
    
      useEffect(() => {
        // This effect runs when the component unmounts
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

### **Sending Data to the Backend with FormData** {#使用-formdata-資料格式傳輸資料給後端}

Services use protocols to define how they exchange data. HTTP supports several content types, with [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) identifying the format being transferred:

- `Content-Type: application/json` means the request body contains JSON.
- `Content-Type: image/png` means the request body contains an image file.

For uploads, HTTP supports the `"multipart/form-data"` content type, an encoding designed to make transfers of binary data, such as file uploads, more efficient. It splits form data into multiple parts, which can contain different kinds of data, and separates each part with a boundary. This makes it well suited to sending text and binary data together.

There are two ways to send a **multipart/form-data** request from the frontend:

1. **Using a \<form> element**

```jsx
<form method="POST" action="/upload" method="POST">
  <input type="text" name="username" />
  <input type="file"  name="avatar" />
  <button>Submit</button>
</form>
```

The browser serializes the \<input> elements inside the \<form> and sends a POST request with `Content-Type: multipart/form-data`.

1. **Using a FormData object**

```jsx
// Extract data from an HTML form element automatically
const formElement = document.querySelector('form');
const formData = new FormData(formElement);

// Or create it manually and append data
const formData = new FormData();
formData.append('username', 'JohnDoe');
formData.append('age', 30);
```

`FormData` is a JavaScript Web API for building a collection of form data to send to a server. It can hold text fields, such as names and email addresses, as well as binary files, such as images. The main benefit is that we don't have to encode the form data ourselves: when we use FormData as the payload, the browser sends it as `multipart/form-data` for us.

> See **[@MDN-FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)**.

<br/>

## **How the Backend (Express) Receives and Processes Files** {#後端express接收與處理檔案資料機制}

### **multer** {#multer}

**`multer`** is middleware for handling `multipart/form-data`. It's commonly used with Express.js to process uploaded files. Its main features include:

1. **File handling**: We can configure where files are stored and how they're named. Multer offers storage engines such as **DiskStorage**, which saves files to disk, and **MemoryStorage**, which keeps them in memory.
2. **File filtering**: Filters can accept or reject uploads of particular file types.
3. **Error handling**: Multer provides middleware for handling upload errors, such as file-size limits and MIME type errors.

### **Configuring File Storage in multer** {#multer-設定檔案處理方法}

In this example, we save files directly to a specific folder on the server. We can configure that with **`multer`**'s **`diskStorage`** option.

- `destination` sets the directory where files should be stored.
- `filename` generates the filename to use when saving them.

Both are functions that receive (`req, file, cb`) as arguments.

- `req`: The HTTP request, including parameters, the body, headers, and so on.
    - **req.file**: Holds the uploaded file's information when using the **single()** middleware.
    - **req.files**: Holds information about multiple uploaded files when using **array()**, **fields()**, or **any()** middleware.
- `file`: Information about the uploaded file.
    - **file.originalname**: The file's original name on the user's computer.
    - **file.mimetype**: Its MIME type.
    - **file.size**: Its size in bytes.
    - **file.fieldname**: The field name in the form.
    - **file.buffer**: The file's data when using **memoryStorage**.
- `cb`: A callback that usually takes two arguments:
    - **First argument**: An error object, if an error occurred. Pass **`null`** when everything is fine.
    - **Second argument**: The result to return to **multer**. For `filename`, this is the generated filename; for `destination`, it's the target storage path.

### **Adding File Upload Middleware to an API Route** {#在-api-route-嵌入接收檔案方法}

```jsx
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log(`Received file: ${req.file.path}`);
    res.json({ message: "File uploaded successfully", path: req.file.path });
  } else {
    res.status(400).json({ message: "File upload failed" });
  }
});
```

Here, `upload.single('file')` is **multer** middleware. It processes the request's **multipart/form-data**, looks for a file in the field named **file**, reads its data, and saves it to the configured destination, either disk or memory. It then puts the file information in **req.file** for subsequent middleware or the route handler to use.
