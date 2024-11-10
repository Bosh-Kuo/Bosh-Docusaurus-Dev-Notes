---
title: 常用 Docker 指令：docker container
sidebar_label: "docker container"
description: 本篇文章詳盡介紹了 Docker 中常用的 docker container 指令，從容器的創建、狀態保存、文件傳輸、執行命令，到監控資源使用情況等多項功能。透過這些指令，能有效管理容器的生命週期，靈活應對各種操作需求，並進一步優化開發與運維工作流程。
last_update:
  date: 2024-11-10
keywords: [Docker, docker container, Docker 常用指令, Docker 容器操作指南, Docker 容器創建與管理]
tags: [Docker]
---

### **`commit`: 創建容器當前狀態的映像**

| 說明     | 從運行中或停止的容器創建新的映像，保存容器的當前狀態             |
| -------- | ---------------------------------------------------------------- |
| 使用方式 | `docker container commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]` |
| 別名     | `docker commit`                                                  |

```bash
docker commit my-container my-new-image
```

- `-m, --message`：為這次提交添加註釋。
- `-a, --author`：指定作者名稱，記錄在映像中。

> 詳細 Options 說明可參閱 [**@docker container commit**](https://docs.docker.com/reference/cli/docker/container/commit/)
> 

### **`cp`: 在容器與本地之間複製文件**

| 說明     | 將文件從容器複製到主機，或者將本地文件複製到容器中           |
| -------- | ------------------------------------------------------------ |
| 使用方式 | `docker container cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH` |
| 別名     | `docker cp`                                                  |

```bash
docker cp my-container:/path/to/file /local/path
```

- `my-container:/path/to/file`：指定容器內的文件路徑。
- `/local/path`：指定要將文件複製到的主機路徑。

也可以反向操作，從主機複製文件到容器中：

```bash
docker cp /local/path my-container:/path/to/destination
```

> 詳細 Options 說明可參閱 [**@docker container cp**](https://docs.docker.com/reference/cli/docker/container/cp/)
> 

### **`exec`: 在運行中的容器中執行命令**

| 說明     | 在運行中的容器內執行命令，例如打開一個交互式 shell           |
| -------- | ------------------------------------------------------------ |
| 使用方式 | `docker container exec [OPTIONS] CONTAINER COMMAND [ARG...]` |
| 別名     | `docker exec`                                                |

```bash
docker container exec -it my-container /bin/bash
```

- `-i, --interactive`：保持標準輸入開放，以便與容器交互。
- `-t, --tty`：分配一個偽終端，使得你可以在容器內操作命令行。

> 詳細 Options 說明可參閱 [**@docker container exec**](https://docs.docker.com/reference/cli/docker/container/exec/)
> 

### **`inspect`: 查看容器詳細信息**

| 說明     | 查看容器的詳細配置信息，以 JSON 格式返回                      |
| -------- | ------------------------------------------------------------- |
| 使用方式 | `docker container inspect [OPTIONS] CONTAINER [CONTAINER...]` |
| 別名     | `docker inspect`                                              |

```bash
docker inspect my-container
```

- `-f, --format`：使用 Go 模板語法格式化輸出，只顯示特定信息，例如容器 IP 地址：

```bash
docker inspect --format '{{ .NetworkSettings.IPAddress }}' my-container
```

> 詳細 Options 說明可參閱 [**@docker container inspect**](https://docs.docker.com/reference/cli/docker/container/inspect/)
> 

### **`kill`: 強制停止容器**

| 說明     | 強制停止正在運行的容器，向容器的主進程發送 `SIGKILL` 信號，強制結束它 |
| -------- | --------------------------------------------------------------------- |
| 使用方式 | `docker container kill [OPTIONS] CONTAINER [CONTAINER...]`            |
| 別名     | `docker kill`                                                         |

```bash
docker kill my-container
```

- `s, --signal`：指定發送給容器的信號（默認為 `SIGKILL`）。例如，發送 `SIGTERM` 信號：

```bash
docker kill -s SIGTERM my-container
```

> 詳細 Options 說明可參閱 [**@docker container kill**](https://docs.docker.com/reference/cli/docker/container/kill/)
> 

### **`logs`: 查看容器日誌**

| 說明     | 查看容器的日誌輸出，了解應用在容器內的運行情況 |
| -------- | ---------------------------------------------- |
| 使用方式 | `docker container logs [OPTIONS] CONTAINER`    |
| 別名     | `docker logs`                                  |

```bash
docker logs my-container
```

- `-f, --follow`：實時查看容器的日誌輸出。
- `--since`：顯示自特定時間以來的日誌，例如 `-since "2023-01-01T00:00:00"`。
- `-n, --tail`：顯示最近的 `N` 行日誌，例如 `n 100` 只顯示最近的 100 行。

> 詳細 Options 說明可參閱 [**@docker container logs**](https://docs.docker.com/reference/cli/docker/container/logs/)
> 

### **`ls`: 列出容器**

| 說明     | 列出所有運行中的容器            |
| -------- | ------------------------------- |
| 使用方式 | `docker container ls [OPTIONS]` |
| 別名     | `docker ps`                     |

```bash
docker ps
```

- `-a, --all`：列出所有容器，包括停止的容器。
- `-q, --quiet`：只顯示容器 ID，適合於腳本中使用。
- `-f, --filter`：根據條件過濾容器，例如 `-filter status=exited` 只顯示已停止的容器。

> 詳細 Options 說明可參閱 [**@docker container ls**](https://docs.docker.com/reference/cli/docker/container/ls/)
> 

### **`rename`: 重命名容器**

| 說明     | 重命名已經創建的容器                         |
| -------- | -------------------------------------------- |
| 使用方式 | `docker container rename CONTAINER NEW_NAME` |
| 別名     | `docker rename`                              |

```bash
docker rename old-name new-name
```

- `old-name`：容器的當前名稱。
- `new-name`：要改成的新名稱。

這在需要更改容器名稱以便於識別時非常有用。

> 詳細 Options 說明可參閱 [**@docker container rename**](https://docs.docker.com/reference/cli/docker/container/rename/)
> 

### **`restart`: 重啟容器**

| 說明     | 停止並重新啟動容器                                            |
| -------- | ------------------------------------------------------------- |
| 使用方式 | `docker container restart [OPTIONS] CONTAINER [CONTAINER...]` |
| 別名     | `docker restart`                                              |

```bash
docker restart my-container
```

- `-t, --time`：在強制停止容器之前等待的時間（秒），默認為 10 秒。可以通過 `t 5` 來縮短等待時間。

```bash
docker restart -t 5 my-container
```

這樣做可以在重新啟動之前只等待 5 秒的時間。

> 詳細 Options 說明可參閱 [**@docker container restart**](https://docs.docker.com/reference/cli/docker/container/restart/)
> 

### **`rm`: 刪除容器**

| 說明     | 刪除一個或多個容器（容器必須先停止）                     |
| -------- | -------------------------------------------------------- |
| 使用方式 | `docker container rm [OPTIONS] CONTAINER [CONTAINER...]` |
| 別名     | `docker rm`                                              |

```bash
docker rm my-container
```

- `-f, --force`：強制刪除正在運行的容器，先停止再刪除。
- `-v, --volumes`：刪除與容器相關的卷，確保數據不會遺留在本地。

> 詳細 Options 說明可參閱 [**@docker container rm**](https://docs.docker.com/reference/cli/docker/container/rm/)
> 

### **`run`: 創建並運行容器**

| 說明     | 創建並啟動容器                                            |
| -------- | --------------------------------------------------------- |
| 使用方式 | `docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]` |
| 別名     | `docker run`                                              |

```bash
docker run -d --name my-container -p 8080:80 nginx
```

- `-d`：以「背景模式」運行容器（detached）。
- `--name`：為容器指定一個名稱（my-container）。
- `-p`：將主機的 `8080` 埠映射到容器的 `80` 埠。

---

以下列出一些常用的 Options：

- `--cpus`：限制容器可使用的 CPU 量，例如 `-cpus="1.5"`，表示容器可以使用 1.5 個 CPU。
- `-e, --env`：設置環境變數，例如 `-e ENV=production`，在容器內可通過 `ENV` 使用。
- `--env-file`：從指定的文件中載入環境變數，該文件中的每一行應為 `KEY=VALUE` 格式，方便集中管理大量的環境變數，例如 `--env-file .env`
- `-it`：使容器進入交互模式，分配一個偽終端。常與 `/bin/bash` 一起用於調試。
- `-m ,--memory`：設置容器可用的最大記憶體量，例如 `--memory="512m"` 限制為 512MB。
- `-mount`：用於掛載檔案系統。與 `-v` 類似，但提供了更多的功能，例如掛載類型和掛載選項的詳細控制。使用範例如下：
    
    ```bash
    --mount type=bind,source=/host/path,target=/container/path
    ```
    
    - 常見的選項有：
        - **`type`**：掛載的類型，可以是 `bind`、`volume` 或 `tmpfs`。
            - `bind`：將主機上的一個具體檔案或目錄掛載到容器。
            - `volume`：使用 Docker 的卷管理系統來掛載。
            - `tmpfs`：在容器的記憶體中創建一個臨時檔案系統，不會持久化到磁碟。
        - **`source`**：主機上的路徑，對於 `bind` 類型，是需要掛載的主機目錄或文件。對於 `volume`，是卷的名稱。
        - **`target`**：容器內掛載的目標路徑，類似於 `v` 的容器路徑部分。
        - **`readonly`**（可選）：將掛載設置為只讀模式，防止容器修改內容。
        
        與 `-v` 相比，`--mount` 更加清晰和嚴格，適合需要精確控制掛載行為的場景。
        
- `-network`：指定容器的網絡模式，例如 `-network bridge`。可用的模式包括：
    - **`bridge`**（預設）：使用 Docker 的虛擬網橋網絡。
    - **`host`**：容器與主機共用網絡。
    - **`none`**：容器無法進行任何網絡通信。
- `--rm`：在容器停止後自動刪除容器，適用於測試用途的臨時容器。
- `-v, --volume`：掛載到容器內，例如 `-v /host/path:/container/path`，用於共享數據。
- `-w, --workdir`：設置容器內的工作目錄，這有助於在指定的目錄中執行命令。

> 詳細 Options 說明可參閱 [**@docker container run**](https://docs.docker.com/reference/cli/docker/container/run/)
> 

### **`start`: 啟動已存在的容器**

| 說明     | 啟動已經創建但目前停止的容器                                |
| -------- | ----------------------------------------------------------- |
| 使用方式 | `docker container start [OPTIONS] CONTAINER [CONTAINER...]` |
| 別名     | `docker start`                                              |

```bash
docker start my-container
```

- `-i, --interactive`：與容器進行互動，保持標準輸入開放。

> 詳細 Options 說明可參閱 [**@docker container start**](https://docs.docker.com/reference/cli/docker/container/start/)
> 

### **`stats`: 實時監控容器資源使用情況**

| 說明     | 查看容器的 CPU、記憶體等資源使用情況              |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker container stats [OPTIONS] [CONTAINER...]` |
| 別名     | `docker stats`                                    |

```bash
docker stats my-container
```

- `--no-stream`：只顯示一次統計結果，而不持續更新。
- `-a, --all`：查看所有容器的資源使用情況，而不僅僅是正在運行的容器。

> 詳細 Options 說明可參閱 [**@docker container stats**](https://docs.docker.com/reference/cli/docker/container/stats/)
> 

### **`stop`: 停止正在運行的容器**

| 說明     | 停止正在運行的容器                                         |
| -------- | ---------------------------------------------------------- |
| 使用方式 | `docker container stop [OPTIONS] CONTAINER [CONTAINER...]` |
| 別名     | `docker stop`                                              |

```bash
docker stop my-container
```

- `-t, --time`：指定在強制停止前等待容器的時間（秒），例如 `t 10`，默認為 10 秒。

> 詳細 Options 說明可參閱 [**@docker container stop**](https://docs.docker.com/reference/cli/docker/container/stop/)
>