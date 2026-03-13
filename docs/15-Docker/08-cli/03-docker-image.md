---
title: 常用 Docker 指令：docker image
sidebar_label: "docker image"
description: 本篇文章詳細介紹了 Docker 中常用的 docker image 指令，包含映像的拉取、推送、列出、刪除、標記、查看歷史紀錄、匯出與匯入等操作，幫助讀者全面掌握 Docker 映像的管理方式。
last_update:
  date: 2026-03-13
keywords: [Docker, docker image, Docker 常用指令, Docker 映像操作指南, Docker 映像管理]
tags: [Docker]
---

`docker image` 指令是 Docker 中專門用於管理映像（Image）的指令集合，涵蓋了映像從取得、查看、標記、推送到清理的完整操作流程。透過這組子命令，使用者可以從 Docker Hub 或私有 Registry 拉取映像、將本地映像推送至遠端倉庫、查看映像的建構歷史與詳細資訊，以及匯出映像為 tar 檔案以便離線傳輸。

### **`history`: 查看映像的建構歷史**

| 說明     | 顯示映像的每一層建構紀錄，包含指令、大小與建立時間 |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker image history [OPTIONS] IMAGE`             |
| 別名     | `docker history`                                   |

```bash
docker history my-app:latest
```

- `--no-trunc`：顯示完整的指令內容，不截斷輸出。
- `-q, --quiet`：只顯示映像的 Layer ID。
- `-H, --human`：以人類可讀的格式顯示大小與日期（預設為 `true`）。

> 詳細 Options 說明可參閱 [**@docker image history**](https://docs.docker.com/reference/cli/docker/image/history/)
>

### **`inspect`: 查看映像詳細資訊**

| 說明     | 以 JSON 格式顯示一個或多個映像的詳細配置資訊      |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker image inspect [OPTIONS] IMAGE [IMAGE...]` |
| 別名     | `docker inspect`                                  |

```bash
docker image inspect nginx:latest
```

- `-f, --format`：使用 Go 模板語法格式化輸出，只顯示特定欄位，例如查看映像的作業系統：

```bash
docker image inspect --format '{{ .Os }}' nginx:latest
```

> 詳細 Options 說明可參閱 [**@docker image inspect**](https://docs.docker.com/reference/cli/docker/image/inspect/)
>

### **`load`: 從 tar 檔案載入映像**

| 說明     | 從 tar 壓縮檔（支援 gzip、bzip2、xz、zstd）載入映像或倉庫，同時還原映像與標籤 |
| -------- | ----------------------------------------------------------------------------- |
| 使用方式 | `docker image load [OPTIONS]`                                                 |
| 別名     | `docker load`                                                                 |

```bash
docker load -i my-app.tar
```

- `-i, --input`：指定要載入的 tar 檔案路徑，若不指定則從標準輸入（STDIN）讀取。
- `-q, --quiet`：抑制載入過程的詳細輸出。

也可透過管道從標準輸入載入：

```bash
docker load < my-app.tar.gz
```

> 詳細 Options 說明可參閱 [**@docker image load**](https://docs.docker.com/reference/cli/docker/image/load/)
>

### **`ls`: 列出映像**

| 說明     | 列出本地所有頂層映像，顯示倉庫名稱、標籤、映像 ID、建立時間及大小 |
| -------- | ----------------------------------------------------------------- |
| 使用方式 | `docker image ls [OPTIONS] [REPOSITORY[:TAG]]`                    |
| 別名     | `docker images`                                                   |

```bash
docker images
```

- `-a, --all`：列出所有映像，包含中間層（intermediate）與懸空映像（dangling images）。
- `-q, --quiet`：只顯示映像 ID，適合在腳本中使用。
- `-f, --filter`：根據條件過濾映像，例如只顯示懸空映像：

```bash
docker images -f dangling=true
```

- `--no-trunc`：顯示完整的映像 ID，不截斷。

> 詳細 Options 說明可參閱 [**@docker image ls**](https://docs.docker.com/reference/cli/docker/image/ls/)
>

### **`prune`: 清除未使用的映像**

| 說明     | 刪除所有懸空映像（dangling images）；加上 `-a` 則刪除所有未被任何容器使用的映像 |
| -------- | ------------------------------------------------------------------------------- |
| 使用方式 | `docker image prune [OPTIONS]`                                                  |

```bash
docker image prune
```

- `-a, --all`：刪除所有未被任何容器參照的映像，而不僅限於懸空映像。
- `-f, --force`：不詢問確認直接執行刪除。
- `--filter`：根據條件過濾要刪除的映像，例如只刪除特定時間之前建立的映像：

```bash
docker image prune -a --filter "until=24h"
```

:::tip
**懸空映像（dangling images）** 是指沒有任何標籤（tag）且沒有被其他映像引用的孤立 layer，通常是在重新執行 `docker build` 時產生的舊中間層。可以放心刪除以釋放磁碟空間。
:::

> 詳細 Options 說明可參閱 [**@docker image prune**](https://docs.docker.com/reference/cli/docker/image/prune/)
>

### **`pull`: 從 Registry 拉取映像**

| 說明     | 從 Docker Hub 或其他 Registry 下載映像到本地 |
| -------- | -------------------------------------------- |
| 使用方式 | `docker image pull [OPTIONS] NAME[:TAG       | @DIGEST]` |
| 別名     | `docker pull`                                |

```bash
docker pull nginx:latest
```

- `-a, --all-tags`：拉取倉庫中所有標籤版本的映像。
- `--platform`：指定要拉取的目標平台，例如 `linux/amd64` 或 `linux/arm64`。

也可以從私有 Registry 拉取映像：

```bash
docker pull myregistry.example.com/my-app:1.0
```

或透過 digest（SHA256）來精確拉取特定版本，確保映像不會因標籤指向變動而改變：

```bash
docker pull nginx@sha256:abc123...
```

> 詳細 Options 說明可參閱 [**@docker image pull**](https://docs.docker.com/reference/cli/docker/image/pull/)
>

### **`push`: 推送映像至 Registry**

| 說明     | 將本地映像上傳至 Docker Hub 或私有 Registry |
| -------- | ------------------------------------------- |
| 使用方式 | `docker image push [OPTIONS] NAME[:TAG]`    |
| 別名     | `docker push`                               |

```bash
docker push myusername/my-app:latest
```

- `-a, --all-tags`：推送倉庫中所有本地標籤版本的映像。

:::tip
推送映像前需先執行 `docker login` 進行身份驗證。推送時顯示的進度條大小為未壓縮大小，實際上傳的資料量會在壓縮後傳送，並不會與進度條顯示的一致。
:::

> 詳細 Options 說明可參閱 [**@docker image push**](https://docs.docker.com/reference/cli/docker/image/push/)
>

### **`rm`: 刪除映像**

| 說明     | 從本地主機移除一個或多個映像（同時移除對應標籤） |
| -------- | ------------------------------------------------ |
| 使用方式 | `docker image rm [OPTIONS] IMAGE [IMAGE...]`     |
| 別名     | `docker rmi`                                     |

```bash
docker rmi my-app:latest
```

- `-f, --force`：強制刪除映像，即使有容器正在使用它。
- `--no-prune`：不自動刪除未被標記的父層映像。

:::caution
若一個映像有多個標籤（tag），使用標籤名稱執行刪除時，只會移除該標籤，不會真正刪除映像本身。只有當映像上的最後一個標籤被移除時，映像才會被真正刪除。
:::

> 詳細 Options 說明可參閱 [**@docker image rm**](https://docs.docker.com/reference/cli/docker/image/rm/)
>

### **`save`: 將映像匯出為 tar 檔案**

| 說明     | 將一個或多個映像匯出成 tar 壓縮包，包含所有父層及標籤資訊，可透過 `docker load` 還原 |
| -------- | ------------------------------------------------------------------------------------ |
| 使用方式 | `docker image save [OPTIONS] IMAGE [IMAGE...]`                                       |
| 別名     | `docker save`                                                                        |

```bash
docker save -o my-app.tar my-app:latest
```

- `-o, --output`：指定輸出的 tar 檔案路徑，若不指定則輸出至標準輸出（STDOUT）。

也可以搭配 gzip 壓縮縮小匯出檔案的大小：

```bash
docker save my-app:latest | gzip > my-app.tar.gz
```

> 詳細 Options 說明可參閱 [**@docker image save**](https://docs.docker.com/reference/cli/docker/image/save/)
>

### **`tag`: 為映像新增標籤**

| 說明     | 為現有映像新增一個新的標籤（tag），建立指向同一映像的別名 |
| -------- | --------------------------------------------------------- |
| 使用方式 | `docker image tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`  |
| 別名     | `docker tag`                                              |

```bash
docker tag my-app:latest myusername/my-app:1.0
```

Docker 映像的完整參照格式為：

```
[HOST[:PORT]/]NAMESPACE/REPOSITORY[:TAG]
```

- **HOST**：Registry 主機名稱，預設為 `docker.io`（Docker Hub）。
- **PORT**：Registry 埠號，例如私有 Registry 常用 `:5000`。
- **NAMESPACE/REPOSITORY**：命名空間與倉庫名稱，官方映像的命名空間為 `library`。
- **TAG**：版本標籤，預設為 `latest`。

`tag` 指令常用於為映像加上 Registry 前綴，以便後續 `docker push` 推送至指定倉庫：

```bash
docker tag my-app:latest myregistry.example.com/my-app:1.0
docker push myregistry.example.com/my-app:1.0
```

> 詳細 Options 說明可參閱 [**@docker image tag**](https://docs.docker.com/reference/cli/docker/image/tag/)
>

## **Reference**
- [**docker image**](https://docs.docker.com/reference/cli/docker/image/)
