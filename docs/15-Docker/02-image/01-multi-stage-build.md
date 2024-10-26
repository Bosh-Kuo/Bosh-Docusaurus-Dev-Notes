---
title: 使用 Multi-stage Build 高效建構輕量化 Docker 映像
sidebar_label: "Multi-stage Build"
description: Docker Multi-stage Build 是一種有效減少映像大小、提升構建效率的技術。本篇文章將帶你深入了解 Multi-stage Build 的原理、基本語法，並通過實際範例展示如何優化你的映像，讓應用程式更輕量、更高效地運行，解決傳統 Dockerfile 造成的映像肥大問題。
last_update:
  date: 2024-10-25
keywords: [Docker, Docker Multi-stage Build, Docker 映像優化, Docker 構建技巧]
tags: [Docker]
---

> **前言:**  
在軟體開發的流程中，打包應用程式是一個不可或缺的環節，通常需要經歷下載依賴、編譯程式碼、打包應用，然後執行的步驟。傳統的 Dockerfile 會將所有這些步驟集中在同一個建構過程中，雖然操作簡單直觀，但也伴隨著一些潛在的問題。今天，我們要介紹 **Docker Multi-stage Build** 這個強大工具，看看它如何幫助我們優化建構流程並提升應用部署的效率。
>


## **認識 Docker Multi-stage Build**

### **傳統 Dockerfile 的挑戰**

在傳統的 Dockerfile 中，我們建構映像的過程通常包含所有步驟，從下載依賴到編譯應用程式。舉個例子，這是一個常見的 Dockerfile：

```dockerfile title="Dockerfile"
FROM golang:1.16.0-alpine3.13

WORKDIR /app

# 複製 go module 和 sum 檔案並下載依賴
COPY go.mod go.sum ./
RUN go mod download

# 複製所有原始碼
COPY . .

# 執行程式碼檢查、測試及編譯
RUN go vet ./... && go test ./... && go build -o /app/server

CMD ["/app/server"]

```

這樣的 Dockerfile 執行了所有步驟，包括下載依賴、程式碼檢查、測試和編譯。而在映像建構完成後，所有這些步驟的產物，甚至是編譯器、開發工具和測試用的依賴，通通都會被保留下來，導致映像非常龐大。

這樣的巨大映像檔會造成幾個問題。首先，映像越大，部署速度就越慢，尤其是當你需要頻繁更新應用程式時。其次，映像中包含不必要的工具和依賴，增加了安全風險和潛在的攻擊面。

### **Docker Multi-stage Build 的解決方案**

為了應對映像肥大的問題，Docker 在 17.05 版本引入了 **Multi-stage Build**。這種技術讓我們能夠在一個 Dockerfile 中定義多個建構階段，每個階段可以有不同的用途和配置。舉例來說，我們可以在第一個階段進行編譯和打包的過程，然後在第二個階段中，僅複製編譯後的可執行檔到最終的映像中，並且**只保留執行應用所需的文件**。

這種方法能顯著縮減映像的大小，因為不必要的開發工具和依賴都不會被打包進最終的映像。Multi-stage Build 尤其適合建構步驟複雜、依賴繁多的應用程式，如 Go、C/C++ 或 Java 等語言開發的專案。我們可以先在前期階段進行編譯，然後只將編譯完成的二進位檔案放入最終映像，這樣不僅能減少映像的大小，還能提升安全性。

## **Multi-stage Build 的基本語法**

### **多次使用 `FROM` 指令**

在 Multi-stage Build 中，我們可以在同一個 Dockerfile 中多次使用 `FROM` 指令來定義不同的建構階段。每個階段都會有自己的基底映像和工作環境，用來完成不同的任務。例如：

```dockerfile title="Dockerfile"
# 第一階段：建構階段
FROM golang:1.16.0-alpine3.13 AS builder

WORKDIR /workspace

# 安裝所有依賴
COPY go.mod go.sum ./
RUN go mod download

# 複製所有原始碼並進行建構
COPY . .
RUN go build -o server

# 第二階段：運行階段
FROM alpine:latest

WORKDIR /app

# 從 builder 階段複製建構好的應用程式
COPY --from=builder /workspace/server .

# 設定容器的啟動指令
CMD ["./server"]
```

在這個範例中，我們將建構步驟放在第一個階段，並使用 `golang:1.16.0-alpine3.13` 作為基底映像，這個階段被命名為 `builder`。接著，在第二個階段中，我們選擇使用較小的 `alpine` 基底映像，來建立一個精簡的運行環境。這種做法可以顯著減少最終映像的大小，因為最終映像只包含了執行應用所需的文件，而不包含建構工具和開發依賴。

### **使用 `COPY --from` 指令**

`COPY --from=<stage>` 指令允許我們從之前的建構階段中，將文件複製到當前階段。例如，在上述範例中，`COPY --from=builder /workspace/server .` 的作用是把第一階段中建構好的應用程式從 `builder` 複製到運行階段。這樣，我們就能確保最終映像中只保留執行應用的必要檔案，避免因打包多餘的開發工具和依賴而增大映像大小。

## **Multi-stage Build 的實際應用範例**

### **範例：Node.js 應用的 Multi-stage Build**

讓我們來看一下如何使用 Multi-stage Build 來優化一個 Node.js 應用。假設我們有一個使用 Express 框架的應用程式，其目錄結構如下：

```jsx
my-node-app/
├── package.json
├── package-lock.json
└── app.js
```

傳統的 Dockerfile 可能長這樣：

```dockerfile title="Dockerfile"
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "app.js"]
```

這種寫法的問題在於，生成的映像會非常龐大，因為 `node:14` 映像本身包含了許多開發工具和不必要的套件。使用 Multi-stage Build 可以顯著減少最終映像的大小，以下是改進後的寫法：

```dockerfile title="Dockerfile"
# 第一階段：建構階段
FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 第二階段：運行階段
FROM node:14-slim

WORKDIR /app

COPY --from=builder /app .

CMD ["node", "app.js"]
```

在這個範例中，我們先在 `builder` 階段中安裝所有的依賴和打包應用，然後使用更精簡的 `node:14-slim` 作為運行階段的基底映像。`node:14-slim` 比 `node:14` 輕量許多，只包含運行應用所需的最基本組件，這樣可以顯著減少映像的大小並加速部署。

### **範例：Golang 應用的 Multi-stage Build**

Golang 應用是使用 Multi-stage Build 的經典範例之一。假設我們有一個簡單的 HTTP 伺服器程式，傳統的 Dockerfile 通常會這樣寫：

```dockerfile title="Dockerfile"
FROM golang:1.16.0-alpine3.13

WORKDIR /app

COPY . .

RUN go build -o server

CMD ["/app/server"]
```

這種方式會把所有 Golang 開發工具都打包進映像中，但實際上，我們只需要最終編譯好的執行檔。下面是使用 Multi-stage Build 進行優化的做法：

```dockerfile title="Dockerfile"
# 第一階段：建構階段
FROM golang:1.16.0-alpine3.13 AS builder

WORKDIR /workspace

COPY . .

RUN go build -o server

# 第二階段：運行階段
FROM alpine:latest

WORKDIR /app

COPY --from=builder /workspace/server .

CMD ["./server"]
```

這種方式讓我們在第一階段完成應用的編譯，並在第二階段中使用精簡的 `alpine` 映像來建立最終運行環境。這樣做的好處是，最終的映像只包含應用程式所需的執行檔，從而大幅減少映像的大小，加快傳輸和部署速度。

## **Multi-stage Build 的最佳化技巧與常見問題**

在使用 Multi-stage Build 時，有一些常見的最佳化方法可以幫助我們進一步縮小映像大小並提升建構效率。同時，在建構過程中也可能會遇到一些常見的問題。以下將介紹如何最佳化建構流程並應對這些問題。

### **精簡建構環境與依賴**

在建構階段中，我們通常會安裝大量的依賴和開發工具，但這些在最終運行映像中通常是不需要的。因此，我們可以在第一階段（建構階段）使用較完整的開發環境進行編譯，然後在最後的運行階段只保留真正需要的檔案和依賴。以 Node.js 專案為例，我們可以通過刪除開發依賴來減少映像的大小：

```dockerfile title="Dockerfile"
# 第一階段：建構階段
FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 第二階段：運行階段
FROM node:14-slim

WORKDIR /app

COPY --from=builder /app .

# 刪除開發依賴，減少映像大小
RUN npm prune --production

CMD ["node", "app.js"]
```

這樣可以確保最終的映像只包含執行應用所需的套件，避免打包多餘的開發依賴，從而減小映像的體積。

### **減少映像層數**

在 Dockerfile 中，每個 `RUN` 指令都會生成一個新的映像層。為了減少映像的層數，可以將多個步驟合併成一個 `RUN` 指令，或刪除臨時檔案來進一步最佳化映像。例如：

```dockerfile title="Dockerfile"
# 使用單一 RUN 指令合併多個步驟
RUN apt-get update && apt-get install -y curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
```

這樣做可以減少中間層的數量，進一步縮小最終映像的大小。

### **常見問題與解決方案**

在使用 Multi-stage Build 時，可能會遇到以下幾個常見問題：

- **路徑錯誤**：不同階段之間的路徑配置不正確，可能導致 `COPY --from` 指令失敗。解決方法是仔細檢查每個階段的工作目錄是否設定正確，以及要複製的檔案路徑是否有效。
- **依賴衝突**：當基底映像切換時，可能會遇到依賴無法安裝或版本不兼容的問題。建議在建構階段安裝所有必要的依賴，並在切換基底映像前清理不必要的檔案，避免衝突。
- **映像大小意外增大**：如果最終映像的大小比預期的要大，可以檢查是否有多餘的文件被打包進去，或者中間層是否有過多的暫存文件未清理。

### **如何除錯 Multi-stage Build**

當我們使用 Multi-stage Build 建構映像時，如果遇到問題，可以通過以下幾種方式進行除錯：

1. **使用 `-target` 指定建構的階段**
    
    可以在建構指令中使用 `--target` 來指定建構的目標階段，這樣可以逐步檢查每個階段的建構結果。例如：
    
    ```bash
    docker build --target builder -t myapp-builder .
    ```
    
    這樣可以讓你只建構指定的階段，以便檢查問題所在。
    
2. **使用 `docker history` 查看映像層**
    
    可以通過 `docker history` 指令來查看每一層的大小和內容，幫助排查哪些步驟造成了映像體積過大。例如：
    
    ```bash
    docker history myapp
    ```
    
3. **在每個階段增加 `RUN echo` 等除錯訊息**
    
    在 Dockerfile 中增加一些除錯訊息，幫助定位問題。例如：
    
    ```dockerfile title="Dockerfile"
    RUN echo "建構完畢，開始測試..."
    ```
    

## **Reference**

- [**Multi-stage builds**](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/)
- [**Dockerfile - Multi-stage build 筆記**](https://amikai.github.io/2021/03/01/docker-multi-stage-build/)
- [**Docker multi-stage builds 教學**](https://myapollo.com.tw/blog/docker-multistage-builds/)