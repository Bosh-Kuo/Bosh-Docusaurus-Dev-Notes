---
title: 常用 Docker 指令：docker compose
sidebar_label: "docker compose"
description: 本篇文章詳細介紹了 Docker Compose 的常用 CLI 指令，包含多容器應用程式的建立、啟動、停止、日誌查看、互動執行等操作，以及常用的全域 Options 說明，幫助讀者快速掌握 docker compose 的操作方式。
last_update:
  date: 2026-03-13
keywords: [Docker, docker compose, Docker Compose 指令, Docker 多容器管理, Docker Compose CLI]
tags: [Docker]
---

`docker compose` 指令是 Docker 中用於定義和執行多容器應用程式的工具，透過 `compose.yaml`（或 `docker-compose.yml`）設定檔來描述應用的服務、網路與 Volume 配置。相較於手動逐一管理容器，Compose 能以單一指令同時啟動、停止、監控整個應用的所有服務，大幅簡化開發與部署流程。

### **常用全域 Options**

以下 Options 可接在 `docker compose` 後、子命令之前，對所有子命令生效：

- `-f, --file`：指定使用的 Compose 設定檔路徑，預設為 `compose.yaml` 或 `docker-compose.yml`。可指定多個以合併設定：
  
  ```bash
  docker compose -f docker-compose.yml -f docker-compose.override.yml up
  ```

- `-p, --project-name`：指定專案名稱，預設為目前目錄名稱。用於區分多個使用相同設定檔的專案：
  
  ```bash
  docker compose -p my-project up -d
  ```

- `--env-file`：指定要載入的環境變數檔案，預設為 `.env`。
- `--profile`：啟用特定的 Profile（選擇性服務），可一次啟用多個。
- `--dry-run`：模擬執行模式，不實際執行任何操作，用於驗證指令效果。

---

### **`build`: 建構服務映像**

| 說明     | 根據 Compose 檔案中的 `build` 設定建構各服務的映像 |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose build [OPTIONS] [SERVICE...]`       |

```bash
docker compose build
```

指定重建特定服務：

```bash
docker compose build web
```

- `--no-cache`：建構時不使用快取，強制重新執行所有步驟。
- `--pull`：強制拉取最新的基礎映像。
- `--build-arg`：傳遞建構參數，例如 `--build-arg NODE_ENV=production`。
- `-q, --quiet`：不顯示建構輸出。

> 詳細 Options 說明可參閱 [**@docker compose build**](https://docs.docker.com/reference/cli/docker/compose/build/)
>

### **`config`: 驗證並查看合併後的 Compose 設定**

| 說明     | 解析並輸出合併後的 Compose 設定內容，可用於驗證設定是否正確 |
| -------- | ------------------------------------------------------------ |
| 使用方式 | `docker compose config [OPTIONS] [SERVICE...]`               |

```bash
docker compose config
```

`config` 會合併所有 `-f` 指定的設定檔、解析環境變數，並將簡寫格式展開為完整格式後輸出，是確認最終設定的好工具。

- `--services`：只列出所有服務名稱。
- `--volumes`：只列出所有 Volume 名稱。
- `--images`：只列出所有使用到的映像名稱。
- `-q, --quiet`：只進行驗證，不輸出任何內容（有錯誤則會顯示）。

> 詳細 Options 說明可參閱 [**@docker compose config**](https://docs.docker.com/reference/cli/docker/compose/config/)
>

### **`down`: 停止並移除所有資源**

| 說明     | 停止容器，並移除容器、網路等由 `up` 建立的資源  |
| -------- | ----------------------------------------------- |
| 使用方式 | `docker compose down [OPTIONS] [SERVICE...]`     |

```bash
docker compose down
```

預設情況下，`down` 只會移除：
- Compose 檔案中定義的服務容器
- Compose 檔案中定義的網路（以及預設網路）

下列資源**不會**被預設刪除：
- 外部（external）定義的網路與 Volume
- 映像

常用 Options：

- `-v, --volumes`：同時刪除 Compose 檔案中定義的具名 Volume（**資料會遺失，請謹慎使用**）。
- `--rmi all`：同時刪除服務使用的所有映像；`--rmi local` 只刪除沒有自訂標籤的映像。
- `--remove-orphans`：移除不在目前 Compose 設定檔中的容器（孤立容器）。
- `-t, --timeout`：指定停止容器前的等待時間（秒）。

> 詳細 Options 說明可參閱 [**@docker compose down**](https://docs.docker.com/reference/cli/docker/compose/down/)
>

### **`exec`: 在執行中的服務容器內執行命令**

| 說明     | 在指定服務的運行中容器內執行命令，等同於 `docker exec` |
| -------- | ------------------------------------------------------- |
| 使用方式 | `docker compose exec [OPTIONS] SERVICE COMMAND [ARGS...]` |

```bash
docker compose exec web sh
```

與 `docker exec` 不同的是，`docker compose exec` **預設就會分配 TTY 並進入互動模式**，不需要額外加 `-it` 旗標：

```bash
# 進入 web 服務的 shell
docker compose exec web bash

# 在 db 服務中執行一次性指令
docker compose exec db psql -U postgres -c "\l"
```

- `-e, --env`：設置執行命令時的環境變數。
- `-u, --user`：指定執行命令的使用者。
- `-w, --workdir`：指定執行命令時的工作目錄。
- `-d, --detach`：在背景執行命令，不附加到終端。
- `--index`：當服務有多個執行實例時，指定要進入的容器索引（從 1 開始）。

> 詳細 Options 說明可參閱 [**@docker compose exec**](https://docs.docker.com/reference/cli/docker/compose/exec/)
>

### **`logs`: 查看服務日誌**

| 說明     | 顯示一個或多個服務的日誌輸出                         |
| -------- | ---------------------------------------------------- |
| 使用方式 | `docker compose logs [OPTIONS] [SERVICE...]`         |

```bash
# 查看所有服務的日誌
docker compose logs

# 只查看特定服務的日誌
docker compose logs web
```

- `-f, --follow`：即時追蹤新產生的日誌輸出。
- `-n, --tail`：只顯示最後 N 行日誌，例如 `--tail 100`。
- `-t, --timestamps`：在每行日誌前顯示時間戳。
- `--since`：只顯示指定時間之後的日誌，例如 `--since "2024-01-01T00:00:00"`。
- `--until`：只顯示指定時間之前的日誌。
- `--no-log-prefix`：不顯示服務名稱前綴，適合只追蹤單一服務時使用。

> 詳細 Options 說明可參閱 [**@docker compose logs**](https://docs.docker.com/reference/cli/docker/compose/logs/)
>

### **`ps`: 列出服務的容器狀態**

| 說明     | 列出目前 Compose 專案中所有容器的狀態與埠對應    |
| -------- | ------------------------------------------------ |
| 使用方式 | `docker compose ps [OPTIONS] [SERVICE...]`        |

```bash
docker compose ps
```

- `-a, --all`：列出所有容器，包含已停止的容器（預設只顯示執行中的）。
- `-q, --quiet`：只顯示容器 ID。
- `--services`：只列出服務名稱。
- `--status`：依狀態過濾，例如 `--status running`、`--status exited`。

> 詳細 Options 說明可參閱 [**@docker compose ps**](https://docs.docker.com/reference/cli/docker/compose/ps/)
>

### **`pull`: 拉取服務映像**

| 說明     | 拉取 Compose 檔案中各服務所指定的映像，但不啟動容器 |
| -------- | ---------------------------------------------------- |
| 使用方式 | `docker compose pull [OPTIONS] [SERVICE...]`          |

```bash
# 拉取所有服務的映像
docker compose pull

# 只拉取特定服務的映像
docker compose pull db
```

- `-q, --quiet`：抑制拉取過程的詳細輸出。
- `--ignore-pull-failures`：忽略拉取失敗的錯誤，繼續處理其他服務。
- `--ignore-buildable`：略過有 `build` 設定的服務（只拉取有 `image` 設定的服務）。
- `--include-deps`：同時拉取相依服務的映像。

> 詳細 Options 說明可參閱 [**@docker compose pull**](https://docs.docker.com/reference/cli/docker/compose/pull/)
>

### **`restart`: 重啟服務**

| 說明     | 重新啟動所有已停止或執行中的服務，或指定服務      |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker compose restart [OPTIONS] [SERVICE...]`   |

```bash
# 重啟所有服務
docker compose restart

# 只重啟特定服務
docker compose restart web
```

- `-t, --timeout`：指定停止容器前的等待時間（秒）。

:::caution
`docker compose restart` **不會**套用 `compose.yaml` 中的設定變更（例如環境變數更新）。若要讓設定變化生效，應使用 `docker compose up` 重新建立容器，而非僅重啟。
:::

> 詳細 Options 說明可參閱 [**@docker compose restart**](https://docs.docker.com/reference/cli/docker/compose/restart/)
>

### **`run`: 對服務執行一次性命令**

| 說明     | 針對指定服務啟動一個新的臨時容器並執行指定命令    |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker compose run [OPTIONS] SERVICE [COMMAND] [ARGS...]` |

```bash
docker compose run web bash
```

`run` 與 `exec` 的差異在於：`exec` 是在**已執行中**的容器內執行命令，而 `run` 是**新建一個容器**來執行命令。

常見使用情境：

```bash
# 執行資料庫 migration
docker compose run --rm web python manage.py migrate

# 開啟 Rails console
docker compose run --rm web rails console

# 對 db 服務執行 psql
docker compose run --rm db psql -h db -U postgres
```

- `--rm`：執行完畢後自動刪除容器。
- `-e, --env`：設置環境變數。
- `--no-deps`：不啟動相依的服務，只執行指定的服務容器。
- `-P, --service-ports`：啟用設定檔中定義的埠對應（預設 `run` 不對應埠）。
- `-p, --publish`：手動指定埠對應。
- `-d, --detach`：在背景執行。

> 詳細 Options 說明可參閱 [**@docker compose run**](https://docs.docker.com/reference/cli/docker/compose/run/)
>

### **`up`: 建立並啟動服務**

| 說明     | 建構映像、建立並啟動 Compose 檔案中定義的所有服務容器 |
| -------- | ----------------------------------------------------- |
| 使用方式 | `docker compose up [OPTIONS] [SERVICE...]`             |

```bash
# 前景模式啟動（附加到終端，Ctrl+C 停止）
docker compose up

# 背景模式啟動（最常用）
docker compose up -d
```

`up` 是最核心的指令，它會自動完成以下步驟：
1. 建構有 `build` 設定的服務映像（若尚未建構）
2. 建立並啟動所有服務容器
3. 自動啟動相依的服務

常用 Options：

- `-d, --detach`：在背景執行容器，不附加到終端。
- `--build`：啟動前強制重新建構映像。
- `--no-build`：不建構映像，直接使用現有映像。
- `--force-recreate`：強制重新建立容器（即使設定未變更）。
- `--no-recreate`：若容器已存在且設定未變更，不重新建立。
- `--remove-orphans`：移除不在目前 Compose 設定檔中定義的容器。
- `--scale`：指定服務的執行實例數量，例如 `--scale web=3`。
- `-V, --renew-anon-volumes`：重新建立匿名 Volume，而不是重用舊資料。
- `--wait`：等待服務健康狀態就緒後才返回（需設定 `healthcheck`）。
- `--pull`：控制是否拉取映像的策略（`always`、`missing`、`never`）。

> 詳細 Options 說明可參閱 [**@docker compose up**](https://docs.docker.com/reference/cli/docker/compose/up/)
>

### **`create`: 建立服務容器（不啟動）**

| 說明     | 為服務建立容器，但不啟動；適合事先預備容器環境 |
| -------- | ----------------------------------------------- |
| 使用方式 | `docker compose create [OPTIONS] [SERVICE...]`   |

```bash
docker compose create
```

`create` 與 `up` 的差異在於：`create` 只建立容器但不啟動，可之後再用 `docker compose start` 啟動；`up` 則是一次建立並啟動。

- `--build`：建立容器前先建構映像。
- `--no-build`：不建構映像，直接使用現有映像。
- `--force-recreate`：強制重新建立容器。
- `--no-recreate`：若容器已存在，不重新建立。

> 詳細 Options 說明可參閱 [**@docker compose create**](https://docs.docker.com/reference/cli/docker/compose/create/)
>

### **`events`: 監聽容器事件串流**

| 說明     | 即時串流輸出 Compose 專案中所有容器的事件 |
| -------- | ------------------------------------------ |
| 使用方式 | `docker compose events [OPTIONS] [SERVICE...]` |

```bash
docker compose events
```

輸出範例（包含容器建立、啟動、停止等事件）：

```
2015-11-20 18:01:03 web container create 213cf7...
2015-11-20 18:01:03 web container start 213cf7...
```

- `--json`：以 JSON 格式輸出事件，每行一個 JSON 物件，適合程式化處理：

```bash
docker compose events --json
```

- `--since`：只顯示指定時間之後的事件。
- `--until`：只顯示指定時間之前的事件。

> 詳細 Options 說明可參閱 [**@docker compose events**](https://docs.docker.com/reference/cli/docker/compose/events/)
>

### **`images`: 列出容器使用的映像**

| 說明     | 列出目前 Compose 容器所使用的映像清單              |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose images [OPTIONS] [SERVICE...]`     |

```bash
docker compose images
```

- `-q, --quiet`：只顯示映像 ID。

> 詳細 Options 說明可參閱 [**@docker compose images**](https://docs.docker.com/reference/cli/docker/compose/images/)
>

### **`kill`: 強制終止服務容器**

| 說明     | 向容器發送 `SIGKILL` 訊號，強制停止容器           |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose kill [OPTIONS] [SERVICE...]`        |

```bash
docker compose kill
```

與 `stop` 的差異：`stop` 發送 `SIGTERM` 讓容器優雅地關閉，`kill` 則發送 `SIGKILL` 強制終止，不等待容器自行清理。

- `-s, --signal`：指定發送的信號，預設為 `SIGKILL`，可改為 `SIGINT` 等：

```bash
docker compose kill -s SIGINT
```

> 詳細 Options 說明可參閱 [**@docker compose kill**](https://docs.docker.com/reference/cli/docker/compose/kill/)
>

### **`ls`: 列出所有 Compose 專案**

| 說明     | 列出目前主機上所有執行中的 Compose 專案           |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose ls [OPTIONS]`                      |

```bash
docker compose ls
```

`ls` 列出的是**專案層級**（project level）的資訊，而非個別服務容器。

- `-a, --all`：列出所有專案，包含已停止的專案。
- `-q, --quiet`：只顯示專案名稱。
- `--filter`：依條件過濾，例如 `--filter status=running`。

> 詳細 Options 說明可參閱 [**@docker compose ls**](https://docs.docker.com/reference/cli/docker/compose/ls/)
>

### **`pause`: 暫停服務容器**

| 說明     | 暫停（凍結）指定服務的容器，容器進程會被暫停但不停止 |
| -------- | ----------------------------------------------------- |
| 使用方式 | `docker compose pause [SERVICE...]`                   |

```bash
docker compose pause
docker compose pause web
```

暫停後的容器不會佔用 CPU，但仍保留記憶體與網路狀態。可用 `docker compose unpause` 恢復執行。

> 詳細說明可參閱 [**@docker compose pause**](https://docs.docker.com/reference/cli/docker/compose/pause/)
>

### **`port`: 查詢服務的公開埠**

| 說明     | 輸出指定服務中某個容器埠所對應的主機公開埠       |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker compose port [OPTIONS] SERVICE PRIVATE_PORT` |

```bash
# 查詢 web 服務的 80 埠對應到哪個主機埠
docker compose port web 80
```

- `--protocol`：指定協定，`tcp`（預設）或 `udp`。
- `--index`：當服務有多個容器實例時，指定要查詢的容器索引。

> 詳細 Options 說明可參閱 [**@docker compose port**](https://docs.docker.com/reference/cli/docker/compose/port/)
>

### **`rm`: 刪除已停止的服務容器**

| 說明     | 移除指定服務的已停止容器（不刪除 Volume）          |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose rm [OPTIONS] [SERVICE...]`          |

```bash
docker compose rm
```

預設只刪除**已停止**的容器，且匿名 Volume 不會被刪除。此指令也會一併移除由 `docker compose run` 產生的一次性容器。

- `-f, --force`：不詢問確認直接刪除。
- `-s, --stop`：先停止容器再刪除（即使容器仍在執行）。
- `-v, --volumes`：同時刪除容器的匿名 Volume。

:::caution
容器中不在 Volume 內的資料一旦刪除便無法復原。
:::

> 詳細 Options 說明可參閱 [**@docker compose rm**](https://docs.docker.com/reference/cli/docker/compose/rm/)
>

### **`start`: 啟動已存在的服務容器**

| 說明     | 啟動已建立但尚未執行的服務容器                    |
| -------- | ------------------------------------------------- |
| 使用方式 | `docker compose start [SERVICE...]`               |

```bash
docker compose start
docker compose start web
```

`start` 與 `up` 的差異：`start` 只啟動**已存在**的容器，不會建立新容器；`up` 則會在容器不存在時自動建立並啟動。常與 `stop` 搭配使用，實現暫停/恢復應用而不刪除容器。

- `--wait`：等待服務健康狀態就緒後才返回。
- `--wait-timeout`：設定等待超時時間（秒）。

> 詳細 Options 說明可參閱 [**@docker compose start**](https://docs.docker.com/reference/cli/docker/compose/start/)
>

### **`stats`: 即時監控容器資源使用**

| 說明     | 即時顯示所有服務容器的 CPU、記憶體、網路等資源使用統計 |
| -------- | ------------------------------------------------------- |
| 使用方式 | `docker compose stats [OPTIONS] [SERVICE...]`           |

```bash
docker compose stats
```

- `-a, --all`：也顯示已停止容器的資源占用（通常為 0）。
- `--no-stream`：只輸出一次當前數據，不持續更新。
- `--format`：使用 Go 模板自訂輸出格式。

> 詳細 Options 說明可參閱 [**@docker compose stats**](https://docs.docker.com/reference/cli/docker/compose/stats/)
>

### **`stop`: 停止服務容器**

| 說明     | 停止執行中的服務容器（發送 SIGTERM），但不刪除容器 |
| -------- | --------------------------------------------------- |
| 使用方式 | `docker compose stop [OPTIONS] [SERVICE...]`         |

```bash
docker compose stop
docker compose stop web
```

`stop` 只停止容器，不刪除容器與網路。停止後可用 `docker compose start` 重新啟動。若需要同時刪除容器與網路，請使用 `docker compose down`。

- `-t, --timeout`：指定等待容器優雅停止的時間（秒），超時後強制終止。

> 詳細 Options 說明可參閱 [**@docker compose stop**](https://docs.docker.com/reference/cli/docker/compose/stop/)
>

### **`top`: 查看容器中的執行中進程**

| 說明     | 顯示各服務容器中目前執行的進程列表（類似 `top` 指令） |
| -------- | ------------------------------------------------------ |
| 使用方式 | `docker compose top [SERVICE...]`                      |

```bash
docker compose top
```

輸出範例：

```
example_foo_1
UID    PID     PPID    C    STIME    TTY    TIME        CMD
root   142353  142331  2    15:33    ?      00:00:00    ping localhost -c 5
```

> 詳細說明可參閱 [**@docker compose top**](https://docs.docker.com/reference/cli/docker/compose/top/)
>

### **`unpause`: 恢復已暫停的服務容器**

| 說明     | 恢復已被 `pause` 暫停的服務容器，繼續執行         |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker compose unpause [SERVICE...]`              |

```bash
docker compose unpause
docker compose unpause web
```

> 詳細說明可參閱 [**@docker compose unpause**](https://docs.docker.com/reference/cli/docker/compose/unpause/)
>

## **Reference**
- [**docker compose**](https://docs.docker.com/reference/cli/docker/compose/)
