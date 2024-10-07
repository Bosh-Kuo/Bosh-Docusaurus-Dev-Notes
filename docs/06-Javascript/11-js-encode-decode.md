---
title: "JS 中常用的編碼(Encode)與解碼(Decode)"
sidebar_label: "[Advanced] 編碼與解碼"
description: 本篇技術筆記將詳細介紹 JavaScript 中常用的編碼與解碼方法，包括 ASCII、Unicode、UTF-8 以及 Base64 等格式。文章中不僅解釋了每種編碼的特點與適用場景，還通過 atob 和 btoa 函數來展示如何在 JavaScript 中進行 Base64 的編碼與解碼操作。此外，文章提供了一系列簡單的範例，幫助讀者理解如何在實際開發中應用這些編碼技術。無論您是前端開發新手還是希望深化對編碼知識的理解，這篇筆記都能為您提供寶貴的資訊和實用的技巧。
last_update:
  date: 2024-09-08
keywords:
  - Javascript
  - Encode
  - Decode
  - ASCII
  - UniCode
  - UTF-8
  - Base64
  - atob
  - btoa
tags:
  - Javascript
---

> **前情提要：**  
> 本篇筆記起初主要想記錄的內容是 JS 中常用編碼與解碼應用場景，但在查閱資料的過程中發現， JS 中常見的編碼方法牽涉了許多編碼規範的專有名詞，如：ASCII、Unicode、UTF-8、Base64 等等。為了讓讀者能更容易理解 JavaScript 中的編碼原理，我決定先介紹這些基本的編碼知識，這樣在進入 JavaScript 的具體應用時，大家對這些專有名詞會有一定程度的認識，更能掌握其背後的邏輯。


## **ASCII**

`ASCII（美國資訊交換標準代碼）`是一種早期的字符編碼系統，主要用於電腦和通訊設備間的文本資料交換。它最早於 1963 年制定，並成為國際標準。ASCII 使用 **7 位二進制數**來表示字符，總共可以表示 **128** 個字符，包含 **33 個控制字符**（如換行、退格）和 **95 個可打印字符**（如大寫和小寫字母、數字、標點符號等）。每個字符在 ASCII 表中對應一個從 0 到 127 的數字代碼。

例如：
- 字母 A 的 ASCII 碼是 65
- 字母 a 的 ASCII 碼是 97。

在 JavaScript 中，我們可以使用 **String.charCodeAt()** 方法獲取字符的 ASCII 碼，或者使用 **String.fromCharCode()** 從 ASCII 碼創建字符。例如：

```jsx
// 獲取字符的 ASCII 碼
console.log('A'.charCodeAt(0));  // 輸出 65

// 將 ASCII 碼轉換回字符
console.log(String.fromCharCode(65));  // 輸出 A
```

ASCII 在早期電腦系統中廣泛使用，但由於只能表示 128 個字符，無法涵蓋世界其他語言，因此現在已逐漸被更通用的 **Unicode** 編碼所取代。


<br/>


## **Unicode**

### **Unicode 是什麼？**

`Unicode` 是一個字符集，又被稱為`萬國碼`，旨在為全球所有的字符分配唯一的編號，稱為`代碼點（code point）`。每個代碼點以 **U+xxxx** 的16進制格式表示，例如，U+0041 表示拉丁字母 A。

Unicode 的範圍從 **U+0000** 到 **U+10FFFF**，涵蓋各種語言和符號。

### **Unicode 編碼的挑戰**

雖然 Unicode 可以表示所有字符，但不同字符需要的存儲空間（即 bytes 數）不一樣，某些字符可能只需要 1 個 byte，而其他字符可能需要 2 到 4 個 bytes。這導致了一個問題：

> 電腦要如何在連續的 bytes 中區分這些 bytes 長度不一的字符？

例如：漢字「心」的 Unicode 碼點是 U+5FC3，轉換為二進制是 101111110000011，二進制有15位，需要至少 2 個 bytes 來表示，而下個字符可能轉換為二進制後的位數會更多，需要用 3 個 bytes 來表示。那麼電腦怎麼知道前兩個 bytes 是用來表示一個字符，後三個 bytes 是用來表示另一個字符的呢？


你可能想得到，最簡單粗暴的解法就是直接取 Unicode 中需要最多 bytes 的字符為標準。假設 Unicode 中需要用到最多 bytes 的字符所需要的 bytes 數為 4 bytes，那麼讓所有字符一律用 4 bytes 來表示就可以統一規格了。但這麼做會造成極大的空間浪費。以英文字符來說，所有英文字的 Unicode 轉為二進位後都可以只用一個 byte 來表示，但如果每個字符都使用 4 bytes 表示，就必須用 4 倍的儲存空間，這種浪費是很難被接受的。

為了解決這個問題，字符編碼方式（如 **UTF-8** 和 **UTF-16**）應運而生，它們定義了一套規則，允許不同字符使用不同長度的字節表示，且能讓電腦正確辨識每個字符的邊界。

## **UTF-8 編碼**

### **UTF-8 是什麼？**

`UTF-8` 是目前最常見的可變長度的字符編碼方式，它使用 1 到 4 個 bytes 來表示字符。它的最大優勢在於與 ASCII 兼容：ASCII 編碼的字符在 UTF-8 中保持不變，這讓英文文本和一些控制字符能直接使用 UTF-8 編碼，而不需要額外的轉換。

### **UTF-8 的編碼規則**

- 單字節字符：第一位設為 0，後面 7 位對應 ASCII 碼，這使得 UTF-8 可以與 ASCII 兼容。
- 多字節字符：首字節中的前幾位設為 1，表示該字符由多少字節組成，後續字節的前兩位為 `10`，剩下的位用來填充字符的 Unicode 代碼點。

| Unicode 範圍           | UTF-8 表示形式                      |
| ---------------------- | ----------------------------------- |
| `U+0000` - `U+007F`    | 0xxxxxxx                            |
| `U+0080` - `U+07FF`    | 110xxxxx 10xxxxxx                   |
| `U+0800` - `U+FFFF`    | 1110xxxx 10xxxxxx 10xxxxxx          |
| `U+10000` - `U+10FFFF` | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

### **UTF-8 的解碼規則**

- 如果字節的第一位是 0，則該字節單獨表示一個字符（即 ASCII 字符）。
- 如果字節的前幾位是 1，則表示該字符由多個字節組成，電腦可以根據字節的結構正確解碼。


<br/>


## **JavaScript 中的 URL 編碼與解碼**

在處理網絡資源時，經常需要對 URL 進行編碼與解碼。URL 編碼的目的在於將那些在 URL 中具有特殊意義的字符（如 **&**, **?**, **=**）或者**非 ASCII 字符**轉換為可以安全傳輸的格式，確保這些字符不會破壞 URL 結構或導致錯誤。

### **URI 的標準結構**

一個完整的 URI（Uniform Resource Identifier，統一資源標識符）通常包含多個部分，例如：

```
http://example.com:8080/path/to/resource?query=value#fragment
```

- http://：**協議（protocol）**
- example.com：**域名(domain name)**
- :8080：**端口號（port）**
- /path/to/resource：**資源路徑（path）**
- ?query=value：**查詢參數（query string）**
- #fragment：**片段識別符（fragment）**

URI 中的某些字符具有特殊的意義，它們用來區分 URI 的各部分。如果這些字符被編碼，會讓瀏覽器或伺服器無法正確解析和理解 URL 的結構。

例如：
- **/** : 用於分隔資源路徑中的層級（如 /path/to/resource）。
- **?** : 用於引入查詢參數。
- **=** : 和 與號 &：用於表示查詢參數的鍵和值以及多個參數的分隔。
- **#** : 用於指定 URI 中的片段（fragment）。

這些字符不應被編碼，因為它們負責組織 URI 的結構。一旦編碼，瀏覽器或伺服器就無法理解這些字符的特殊用途，從而「破壞」了 URI 的結構。


### **encodeURI 與 decodeURI**

- `encodeURI` 用於編碼整個 URL。它會將 URL 中的非 ASCII 字符（如中文）以及一些無法直接在 URL 中使用的字符進行編碼，但它不會對那些保留字符（如 `:`, `;`, `/`, `?`, `&`, `=`, `@`, `#`, `$` 等）進行編碼，這些字符在 URL 中具有特殊意義，用於維持 URL 結構。
    
    **範例**：
    
    ```jsx
    const url = "http://example.com/測試 page.html?query=測試&name=網站";
    const encodedUrl = encodeURI(url);
    console.log(encodedUrl);
    // 輸出: "http://example.com/%E6%B8%AC%E8%A9%A6%20page.html?query=%E6%B8%AC%E8%A9%A6&name=%E7%B6%B2%E7%AB%99"
    ```
    
- `decodeURI` 用來解碼通過 `encodeURI` 編碼的 URL，將它還原為原始格式。它不會解碼 URL 中那些合法且具有特殊意義的字符。
    
    **範例**：
    
    ```jsx
    const decodedUrl = decodeURI(encodedUrl);
    console.log(decodedUrl);
    // 輸出: "http://example.com/測試 page.html?query=測試&name=網站"
    ```
:::note
有時候前端在處理提交表單資料的 request URL 中會看到像是這樣的亂碼：
https://example.com/submit?text=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C

其實就是**非 ASCII** 字符的 **UTF-8** 編碼的 16 進位表示以 URL 編碼後的結果，其中 `"%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C"` 就是`"你好世界"`這個字串經過 **UTF-8** 編碼後再以 URL 編碼後的表示形式。
:::


### **encodeURIComponent 與 decodeURIComponent**

- `encodeURIComponent` 用於編碼 URI 的某一部分（例如查詢字串的參數）。它會對所有非標準字符進行編碼，甚至包括那些在 URI 中具有特殊意義的字符，如 `&` 和 `=`，以確保這些字符不會破壞 URI 的結構。
    
    **範例**：
    
    ```jsx
    const queryParam = "name=小明&age=20";
    const encodedQueryParam = encodeURIComponent(queryParam);
    console.log(encodedQueryParam);
    // 輸出: "name%3D%E5%B0%8F%E6%98%8E%26age%3D20"
    ```
    
    這樣的結果會讓瀏覽器誤以為 `&` 是查詢參數的分隔符，而不是數據的一部分，導致 **query=name=小明** 和 **age=20** 被當成兩個不同的參數，破壞了原本應有的查詢結構。
    
    為了避免破壞 URI 結構，我們應使用 encodeURIComponent 來編碼查詢參數：
    
    ```tsx
    const encodedQueryParam = encodeURIComponent(queryParam);
    const url = baseURL + "?query=" + encodedQueryParam;
    console.log(url);
    // 輸出: "http://example.com/search?query=name%3D%E5%B0%8F%E6%98%8E%26age%3D20"
    ```
    
- `decodeURIComponent` 用來解碼 `encodeURIComponent` 編碼的部分，還原被編碼的字符，包括所有特殊字符。
    
    **範例**：
    
    如果需要從 URL 中解碼這些參數，可以使用 decodeURIComponent：
    
    ```jsx
    const decodedQueryParam = decodeURIComponent(encodedQueryParam);
    console.log(decodedQueryParam);
    // 輸出: "name=小明&age=20"
    ```
    

### **何時使用 encodeURI 與 encodeURIComponent**

- **使用 `encodeURI`**：當需要編碼**整個 URI**時使用，它會編碼 URI 中無法直接使用的字符（如空格和非 ASCII 字符），但保留 URI 的結構字符（如 `:`, `/`, `?`, `&`, `=` 等）。適合用於完整的 URL 編碼。
- **使用 `encodeURIComponent`**：當只需要編碼 URI 的**某個部分**（如查詢參數或片段）時使用，它會編碼所有非字母數字的字符，包括 URI 結構字符（如 `&`, `=` 等）。適合用於編碼查詢字符串或參數的值，防止這些字符破壞 URI 的結構。

> **共通點：**
它們都會將**非 ASCII** 字元，以及某些 **ASCII** 字元（如空格）編碼為 **UTF-8**，然後以 URL 編碼的形式（即%加上兩個十六進制數字）輸出。
>


<br/>


## **JavaScript 中的 Base64 編碼與解碼**

**`Base64`** 是一種用於將二進位資料（如圖片或影片文件）轉換成純文字格式的編碼方法。這種編碼主要用於在不支援二進位數據的場合下傳輸資料，例如在網絡上傳送郵件。

**Base64** 編碼使用 64 個可打印字符來表示二進位資料，這 64 個字符包括大寫字母 **`A-Z`**、小寫字母 **`a-z`**、數字 **`0-9`**，以及符號 **`+`** 和 **`/`**。編碼過程中，每三個 bytes 的資料會合併成 24 位元的二進制數據串，然後將其劃分為四組，每組 6 位元，每 6 位元對應 **Base64** 表中的一個字符(**也就是每 3 個 bytes 會編碼為 4 個 ASCII 字元**)。

在 JavaScript 中，可以使用 `btoa()` 和 `atob()` 兩個函數來進行 **Base64** 的編碼和解碼。

### **編碼: btoa**

`btoa` 是 "**Binary to ASCII**" 的縮寫，作用是將二進制資料編碼為 Base64 的 ASCII 字串表示。除了二進制數據，也可以處理字串、Uint8Array 或 Blob 類型。

```jsx
// 示例：將普通文本字串轉換為 Base64 編碼
var text = "Hello, World!";
var encodedText = btoa(text);
console.log("Base64 編碼後的字串:", encodedText);
// 輸出: "SGVsbG8sIFdvcmxkIQ=="
```

:::tip
`btoa()` 函數只能處理 **ASCII** 字串。如果試圖編碼包含非 **ASCII** 字符（例如中文）的字串，將導致錯誤。
:::

### **解碼: atob**

`atob` 和 `btoa` 作用相反，用於將 **Base64 編碼的字串解碼回原始字串**。這個過程是 **`btoa()`** 的逆過程，將 **Base64** 字串轉換為 **ASCII** 文本。

```jsx
// 示例：將 Base64 編碼的字串解碼
var decodedText = atob(encodedText);
console.log("Base64 解碼後的字串:", decodedText);
// 輸出: "Hello, World!"
```

### **注意事項**

當處理非 ASCII 字串時，應先將字串轉換為 UTF-8 編碼，然後再進行 **Base64** 編碼，從而避免 `btoa()` 和 `atob()` 函數的限制。可以通過組合 `encodeURIComponent`、`decodeURIComponent` 以及 **Base64** 編解碼函數來實現對任意字符的編解碼：

```jsx
// 將包含非 ASCII 字符的字串轉換為 Base64 編碼
var text = "你好，世界！";
var encodedText = btoa(encodeURIComponent(text));
console.log("Base64 編碼後的字串:", encodedText);

// 將 Base64 編碼的字串解碼回原始字串
var decodedText = decodeURIComponent(atob(encodedText));
console.log("Base64 解碼後的字串:", decodedText);
```


<br/>


## **JS 中編碼、解碼的應用場景**

在 JavaScript 開發中，編碼和解碼操作對於處理各種數據類型非常重要，尤其是當涉及到網絡傳輸和資料儲存時。下面是一些實際的應用場景。

### **加密 URL 中的 api payload 資訊**

當通過 URL 傳遞敏感資料時，如 API 的 payload，通常需要加密這些資料來保障資訊的安全。加密不僅是為了保護資料免受未授權訪問，也為了防止在傳輸過程中資料被篡改。一種常見的做法是將資料轉換成 JSON 格式，然後使用 **Base64** 編碼進行加密，最後通過 URL 傳輸。

```jsx
function openNewWindow() {
  const payload = { username: 'user1', password: 'passwd' };
  const encodedPayload = btoa(encodeURIComponent(JSON.stringify(payload)));
  const url = `http://example.com/${encodedPayload}`;
  window.open(url, '_blank');  // 打開新視窗
}

// 在新視窗中取得 encodedPayload 
function parseUrl() {
	const { params } = useParams();  // params 即 encodedPayload
	const payload = JSON.parse(decodeURIComponent(atob(params)));
	
	const apiUrl = 'http://example.com/api';

  axios.post(apiUrl, { data: encodedPayload })
    .then(response => {
      console.log('Server response:', response.data);
      // 處理服務器回應
    })
    .catch(error => {
      console.error('Error in sending payload:', error);
      // 處理錯誤情況
    });
}

```

### **安全地傳輸或儲存二進制資料**

處理如圖片、文檔等二進制資料時，經常需要將這些資料轉換成一種更適合傳輸或儲存的格式。**Base64** 編碼是一種常用的方法，它可以將二進制資料轉換為一串 **ASCII** 字串，這樣就可以通過文本形式的傳輸機制（如 HTTP、Email）進行傳輸。

以下例子展示處理文件上傳並將選擇的圖片轉換為 Base64 編碼以顯示在網頁上：

```jsx
import React, { useState } from 'react';

function ImageUploader() {
  const [imageSrc, setImageSrc] = useState('');  // 用於存儲圖片的 Base64 編碼

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);  // 轉換為 Base64 編碼
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '300px' }} />}
    </div>
  );
}

export default ImageUploader;

```


<br/>


## **Reference**

- **[JavaScript 常用編碼、解碼](https://www.cythilya.tw/2020/07/24/encode-decode/)**
- **[彻底弄懂Unicode编码](https://liyucang-git.github.io/2019/06/17/%E5%BD%BB%E5%BA%95%E5%BC%84%E6%87%82Unicode%E7%BC%96%E7%A0%81/)**
- [**mdn - Standard built-in objects**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [**mdn - atob() global function**](https://developer.mozilla.org/en-US/docs/Web/API/atob)
- [**mdn - btoa() global function**](https://developer.mozilla.org/en-US/docs/Web/API/btoa)
- **[JavaScript atob 轉 base64時候處理中文方法](https://malagege.github.io/blog/posts/JavaScript-atob-%E8%BD%89-base64%E6%99%82%E5%80%99%E8%99%95%E7%90%86%E4%B8%AD%E6%96%87%E6%96%B9%E6%B3%95/)**
- [**encodeURI、encodeURIComponent、btoa及其应用场景**](https://www.cnblogs.com/shytong/p/5102256.html)
- **[掌握 Web API 中常用的编码和解码技术：encodeURI、encodeURIComponent、new URL、btoa() 和 atob()](https://juejin.cn/post/7228967511407673404)**
