---
title: 常用 Docker 指令：docker build
sidebar_label: "docker build"
description: 本篇文章詳細介紹了 docker build 指令的使用，說明如何透過 Dockerfile 建構容器映像，並解析了多種常用選項的應用情境，如標籤、建構參數、上下文路徑、網路模式等。無論是簡單的映像建構，還是多階段建構中的細節控制，都能幫助讀者更靈活地使用 docker build
last_update:
  date: 2024-10-28
keywords: [Docker, docker build, Dockerfile]
tags: [Docker]
---

`docker build` 指令用於根據 Dockerfile 建立映像檔（Image），將應用程式的原始碼、環境配置、依賴函式庫及其他資源打包成可重複使用的容器映像。透過不同的參數選項，例如指定標籤（-t）或設置上下文路徑等，使用者能精確控制映像的生成方式。使用 `docker build`，開發者可以確保應用程式在不同環境下都能具有相同的運行條件，從而避免環境差異問題。

### **基本語法與範例**

:::tip
目前最新的 `docker build` 預設使用基於 `Buildx` 的建構方式，改進了 legacy build backend 的缺點，因此實際上完整的指令其實是 `docker buildx build`。除非你在 Windows 容器模式下執行 Docker 引擎，或者顯式地設置環境變數 `DOCKER_BUILDKIT=0`，否則建構過程都會使用 `BuildKit`。

關於 legacy builder 的缺陷可參閱 [**@docker - Build context with the legacy builder**](https://docs.docker.com/reference/cli/docker/build-legacy/#build-context-with-the-legacy-builde)
:::

Docker 提供了 `docker build` 命令來從 Dockerfile 建構映像。最基本的語法如下：

| 說明     | 建立映像檔（Image）                                      |
| -------- | -------------------------------------------------------- |
| 使用方式 | `docker build [OPTIONS] PATH                             | URL | -` |
| 別名     | `docker build, docker image build, docker builder build` |

```bash
docker build -f Dockerfile.custom -t my-app:latest --build-arg NODE_ENV=production --no-cache .
```

- **PATH**：指定 Docker 引擎從哪個本地路徑中取得建構上下文(Context)，也就是要用來建構映像的所有檔案和目錄。例如，`.` 表示當前目錄，也可以是其他路徑，如 `./myapp`。
- **URL**：可以提供一個網路上的 URL，指向包含 Dockerfile 的位置，Docker 會從這個 URL 下載 Dockerfile，然後根據它來建構映像。
- **-**：這個選項表示 Dockerfile 內容會從標準輸入中讀取，而不是來自文件或 URL。例如，可以通過管道將 Dockerfile 的內容傳給 `docker build`，這樣不需要明確地存在一個文件。
### **`--tag, -t`: 給建構的映像打標籤(Tag)**

為建構出的映像打上標籤，以便於管理。標籤的格式通常為 `<名稱>:<標籤>`，例如：

```bash
docker build -t my-app:latest .
```

在這裡，my-app 是映像的名稱，而 latest 是標籤。如果你不指定標籤，預設會使用 latest。

### **`--file, -f`: 指定要使用的 Dockerfile 路徑**

指定要使用的 Dockerfile 路徑（預設是 `PATH/Dockerfile`）。例如：

```bash
docker build -f ./custom-dir/MyDockerfile -t custom-image .
```

### **`--build-arg`: 傳遞建構時參數**

傳遞建構時參數，以影響 Dockerfile 中參數的行為。例如，為環境變數 `NODE_ENV` 設定值：

```bash
docker build --build-arg NODE_ENV=production -t my-app .
```

Dockerfile 中可以使用 `ARG` 指令來定義這些參數，例如：

```docker
ARG NODE_ENV
RUN echo "Building for environment: $NODE_ENV"
```

### **`--no-cache`: 禁用快取**

告知 Docker 在建構過程中不使用任何快取，確保所有步驟都重新執行：

```bash
docker build --no-cache -t my-app:latest .
```

### **`--target`: 多階段建構中的目標階段**

當 Dockerfile 使用多階段建構時，可以通過 `--target` 選項來指定要建構的特定中間階段作為最終結果映像，而不必從頭到尾執行所有階段。這樣可以跳過 target 之後的所有命令，減少建構時間與資源浪費。

例如，有以下 Dockerfile，分成兩個建構階段：

```Dockerfile
FROM debian AS build-env
# 編譯應用程式的相關步驟
RUN echo "Building in the build environment..."

FROM alpine AS production-env
# 設定最終的生產環境
RUN echo "Setting up production environment..."
```

使用 --target 來只建構 build-env 階段：

```bash
docker build --target builder -t my-app-builder .
```

在這裡，`--target build-env` 指定 Docker 只建構到名為 build-env 的階段，並跳過後續的 production-env 階段。

### **`--build-context`: 指定額外的建構上下文**

為多階段建構提供不同來源的建構上下文，適用於需要整合多個資料夾的情境：

```bash
docker build --build-context frontend=./frontend --build-context backend=./backend -t my-app .
```

在 Dockerfile 中，可以使用這些上下文名稱來複製檔案：

```Dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY --from=frontend /frontend /app/frontend
COPY --from=backend /backend /app/backend
RUN npm install && npm run build
```

### **`--network`: 設定建構時的網路模式**

控制建構時的網路模式：

```bash
docker build --network host -t my-app .
```

- **default**：使用預設的隔離虛擬網路（安全）。
- **none**：無網路訪問，適合完全不需要網路的建構。
- **host**：共用主機網路，加快建構需要外部資源的步驟。

### **`--progress`: 控制建構進度顯示方式**

設定建構過程中的顯示模式：

```bash
docker build --progress=plain -t my-app .
```

- **auto**：根據環境自動選擇顯示方式（預設）。
- **plain**：顯示簡單的文字輸出，適合日誌文件。
- **tty**：顯示豐富的進度條，適合終端使用。
- **rawjson**：以 JSON 格式輸出建構進度，適合自動化工具。


## **Reference**
- [**@docker build (legacy builder)**](https://docs.docker.com/reference/cli/docker/build-legacy/)
- [**@docker buildx build**](https://docs.docker.com/reference/cli/docker/buildx/build/#file)
