---
title: "JS 常用的編碼與解碼"
sidebar_label: "[Advanced] Encode & Decode"
description: 本篇技術筆記將詳細介紹 JavaScript 中常用的編碼與解碼方法，包括 ASCII、Unicode、UTF-8 以及 Base64 等格式。文章中不僅解釋了每種編碼的特點與適用場景，還通過 atob 和 btoa 函數來展示如何在 JavaScript 中進行 Base64 的編碼與解碼操作。此外，文章提供了一系列簡單的範例，幫助讀者理解如何在實際開發中應用這些編碼技術。無論您是前端開發新手還是希望深化對編碼知識的理解，這篇筆記都能為您提供寶貴的資訊和實用的技巧。
last_update:
  date: 2024-05-05
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


## **ASCII**

[`ASCII`](https://zh.wikipedia.org/zh-tw/ASCII)（美國資訊交換標準代碼）是一套字符編碼系統，旨在於電腦和通訊設備間交換文本資料。ASCII 最早於1963年制定，並在後續幾十年內成為了國際標準。ASCII 編碼使用 **7 位二進制數**來表示每個字符，這是因為最初的電腦系統設計只考慮到了基本的英文字符需求，因此總共可以表示 **128** 個字符。其中包括**33個控制字符（如換行、退格等）** 和**95個可打印字符（包括英文大寫和小寫字母、數字、標點符號等）**。每個字符在 ASCII 表中對應一個從 0 到 127 的數字代碼。例如，大寫字母 A 的 ASCII 碼是 65，小寫字母 a 的 ASCII 碼是 97。

在 JavaScript 中，我們可以使用 `String.charCodeAt()` 方法獲取字符的 ASCII 編碼值，以及 `String.fromCharCode()` 從 ASCII 值創建字符。例如:

```jsx
// 獲取字符的 ASCII 碼
console.log('A'.charCodeAt(0));  // 輸出 65

// 將 ASCII 碼轉換回字符
console.log(String.fromCharCode(65));  // 輸出 A
```

最早和最廣為使用的編碼標準，ASCII 編碼在早期電腦歷史中扮演了重要角色，且在現今許多系統和應用中仍有其地位。但由於它只能表示有限的字符集，無法涵蓋世界上大多數其他語言中的字符，因此現在已部分被更全面的 `Unicode` 編碼所替代。


<br/>


## **Unicode 與 UTF-8 編碼**

### **Unicode**

由於 **ASCII** 只能表示少量的字符，為了解決這個問題，[`Unicode`](https://zh.wikipedia.org/zh-tw/Unicode)（萬國碼）應運而生。 **Unicode** 是一個字符集（character set）， 旨在為全世界所有的字符提供一個唯一的編號，這樣就可以用相同的編碼標準表示來自世界各地的文字。Unicode 為每個字符提供的編碼值稱為代碼點（code point），這個編碼值通常用 **U+xxxx** 的**16進制**來表示，如 U+0041 表示拉丁字母 A，範圍從 **U+0000** 到 **U+10FFFF。**

而要將這些字符的代碼點存儲和傳輸前，需要先將代碼點編碼成為電腦可以儲存的**二進制位元組(byte)序列**，這道程序稱作**字符編碼（character encoding）**。**Unicode** 規範實際上定義了多種不同的編碼方法，其中包括: **UTF-8, UTF-16, UTF-32** 等，其中 **UTF-8** 和 **UTF-16** 是當前比較常見的編碼方式。

### **Unicode 編碼方案**

現在我們知道 **Unicode**  是一種旨在包含全球所有字符的編碼系統，但它本身不規定具體的二進制存儲方式。例如，漢字「心」的 **Unicode** 碼點是 U+5FC3，轉換為**二進制**是 101111110000011，二進制有15位，需要至少 2 個 bytes 來表示，可以想像有些字符可能轉換為二進制後的位數會更多，可能需要用 3 到 4 個 bytes 來表示。這導致了一個問題：

> 電腦要如何知道這 2 個連續的 bytes 是被用來表示為一個字？ 那 3 個 bytes 是被用來表示為另一個字？

你可能想得到，最簡單粗暴的解法就是直接取 **Unicode** 中需要最多 bytes 的字符為標準。假設 Unicode 中需要用到最多 bytes 的字符所需要的 bytes 數為 4 bytes，那麼讓所有字符一律用 4 bytes 來表示就可以統一規格了。但這麼做會造成極大的空間浪費。以英文字符來說，所有英文字的 **Unicode** 轉為二進位後都可以只用一個 byte 來表示，但如果每個字符都使用 4 bytes 表示，就必須用 4 倍的儲存空間，這種浪費是很難被接受的。

為了解決這個問題，**UTF-8, UTF-16 等字符編碼（character encoding）** 方法誕生了，其最大的用途就是定義一套編碼規則，允許不同字符以不同長度的 bytes 表示，同時又讓電腦能夠辨識某幾個 bytes 代表一個字符。

### **UTF-8 編碼**

[UTF-8](https://zh.wikipedia.org/zh-tw/UTF-8) 是現在使用最廣泛的編碼標準之一，它是一種**長度可變**的字符編碼，使用 1 到 4 個 bytes 來表示一個字符。UTF-8 的優勢在於其兼容性，它與 **ASCII** 完全兼容。**ASCII** 編碼的文本在 UTF-8 編碼中保持不變，這意味著英文文本和許多控制碼在 UTF-8 中的表示與 **ASCII** 相同。

**編碼規則**

- 對於單字節字符，第一位設為 0，後面 7 位對應該字符的 Unicode 碼點，使其與 **ASCII** 編碼兼容。
- 對於多字節字符，第一字節的前 N 位設為 1，第 N + 1 位設為 0，接下來的字節前兩位為 10，其餘位使用該字符的 Unicode 碼點填充。
    
    
    | Unicode 十六進制碼點範圍 | UTF-8 二進制表示                    |
    | ------------------------ | ----------------------------------- |
    | 0000 0000 - 0000 007F    | 0xxxxxxx                            |
    | 0000 0080 - 0000 07FF    | 110xxxxx 10xxxxxx                   |
    | 0000 0800 - 0000 FFFF    | 1110xxxx 10xxxxxx 10xxxxxx          |
    | 0001 0000 - 0010 FFFF    | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

**解碼規則**

- 如果字節的第一位是 0，則該字節獨立表示一個字符。
- 如果字節的第一位是 1，則連續的 1 的數量表示該字符由相鄰的幾個字節共同表示。


<br/>


## **JavaScript 中的 URL 編碼與解碼**

在 JavaScript 中，處理網絡資源時經常需要對 URL 進行編碼與解碼。URL 編碼（又稱百分比編碼）的目的是為了將那些在 URL 中具有特殊意義的**保留字元**（如 `&`, `?`, `=`）或者**非 ASCII 字符**轉換為安全的格式，使得這些字符可以被網絡傳輸和解析。

### **encodeURI 與 decodeURI**

- `encodeURI` 函數用於將 URL 轉換為合法的 URL 格式，它將 URL 中的某些字符進行編碼。例如，空格會被編碼為 `%20`，中文字符等**非 ASCII 字符**也會被轉換成 **UTF-8** 形式並用 URL 編碼（即%加上兩個十六進制數字）表示。
- `decodeURI` 函數則用於將經過編碼的 URL 恢復為原始格式。它不會對已經是合法 URL 字元的部分進行解碼。
- 這兩個函數不會對某些保留字元進行編碼或解碼，如 **`:`, `;`**, **`/`**, **`?`**, **`&`**, **`=`, `@`, `#`, `$`** 等。

```jsx
var url = "http://example.com/測試 page.html?query=測試&name=網站";

// 使用 encodeURI 編碼
var encodedUrl = encodeURI(url);
console.log("編碼後的 URL:", encodedUrl);
// 輸出: "http://example.com/%E6%B8%AC%E8%A9%A6%20page.html?query=%E6%B8%AC%E8%A9%A6&name=%E7%B6%B2%E7%AB%99"

// 使用 decodeURI 解碼
var decodedUrl = decodeURI(encodedUrl);
console.log("解碼後的 URL:", decodedUrl);
// 輸出: "http://example.com/測試 page.html?query=測試&name=網站"

```

:::tip
補充：有時候前端在處理提交表單資料的 request URL 中會看到像是這樣的亂碼：
https://example.com/submit?text=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C

其實就是**非 ASCII** 字符的 **UTF-8** 編碼的 16 進位表示以 URL 編碼後的結果，其中 `"%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C"` 就是`"你好世界"`這個字串經過 **UTF-8** 編碼後再以 URL 編碼後的表示形式。
:::


### **encodeURIComponent 與 decodeURIComponent**

- `encodeURIComponent` 函數用於對 URI 的組成部分進行編碼，將所有非標準字元轉化成 `%XX` 格式的編碼，包括 URL 中用於分隔參數的**特殊字符**（如 `&` 和 `=`）。
- `decodeURIComponent` 函數用於將 `encodeURIComponent` 函數或其他類似機制編碼的部分解碼。

```jsx
var queryParam = "name=小明&age=20";

// 使用 encodeURIComponent 編碼 query string
var encodedQueryParam = encodeURIComponent(queryParam);
console.log("編碼後的 query string:", encodedQueryParam);
// 輸出: "name%3D%E5%B0%8F%E6%98%8E%26age%3D20"

// 嵌入到 URL 中
var urlWithEncodedParam = "http://example.com/?data=" + encodedQueryParam;
console.log("包含編碼 query string 的 URL:", urlWithEncodedParam);
// 輸出: "http://example.com/?data=name%3D%E5%B0%8F%E6%98%8E%26age%3D20"

// 使用 decodeURIComponent 解碼
var decodedQueryParam = decodeURIComponent(encodedQueryParam);
console.log("解碼後的 query string:", decodedQueryParam);
// 輸出: "name=小明&age=20"

```

### **歸納**

**共通點：**

- 它們都會將**非 ASCII** 字元，以及某些 **ASCII** 字元（如空格）編碼為 **UTF-8**，然後以 URL 編碼的形式（即%加上兩個十六進制數字）輸出。

**不同點：**

- `encodeURI` 用於編碼整個URI，但它不會對 URI 中具有特殊含義的字元進行編碼。
- `encodeURIComponent` 用於編碼 URI 中的組成部分，它將編碼所有非字母數字字元，包括在某些 URI 元件中具有特殊含義的字元

:::tip
如果需要對整個 URI 進行編碼，應該使用 **encodeURI**() 方法；如果需要對查詢字串參數進行編碼，應該使用 **encodeURIComponent**() 方法
:::


<br/>


## **JavaScript 中的 Base64 編碼與解碼**

**`Base64`** 是一種用於將二進位資料（如圖片或影片文件）轉換成純文字格式的編碼方法。這種編碼主要用於在不支援二進位數據的場合下傳輸資料，例如在網絡上傳送郵件。

**Base64** 編碼使用 64 個可打印字符來表示二進位資料，這 64 個字符包括大寫字母 **`A-Z`**、小寫字母 **`a-z`**、數字 **`0-9`**，以及符號 **`+`** 和 **`/`**。編碼過程中，每三個 bytes 的資料會合併成 24 位元的二進制數據串，然後將其劃分為四組，每組 6 位元，每 6 位元對應 **Base64** 表中的一個字符(**也就是每 3 個 bytes 會編碼為 4 個 ASCII 字元**)。

在 JavaScript 中，可以使用 `btoa()` 和 `atob()` 兩個函數來進行 **Base64** 的編碼和解碼。

### **編碼: btoa**

`btoa` 是**"Binary to ASCII"**的縮寫，作用是將二進制資料編碼為 **Base64 的 ASCII 字串表示**。除了二進制數據，也可以處理字串、Uint8Array 或 Blob 類型。

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
