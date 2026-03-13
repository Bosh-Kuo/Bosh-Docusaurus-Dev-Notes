---
title: 常用 Docker 指令：docker volume
sidebar_label: "docker volume"
description: 本篇文章詳細介紹了 Docker 中常用的 docker volume 指令，包含 Volume 的建立、查看、列出、刪除與清理等操作，幫助讀者全面掌握 Docker Volume 的管理方式，實現容器資料的持久化與共享。
last_update:
  date: 2026-03-13
keywords: [Docker, docker volume, Docker 常用指令, Docker Volume 管理, Docker 資料持久化]
tags: [Docker]
---

`docker volume` 指令是 Docker 中專門用於管理資料卷（Volume）的指令集合。Volume 是 Docker 實現資料持久化的核心機制，讓容器中的資料在容器停止或刪除後仍能被保留，並可在多個容器之間共享。透過這組子命令，使用者可以建立具名 Volume、查看 Volume 的詳細配置、列出所有 Volume，以及清理不再使用的 Volume 來釋放磁碟空間。

### **`create`: 建立 Volume**

| 說明     | 建立一個新的 Volume，容器可以將資料寫入並持久保存 |
| -------- | --------------------------------------------------- |
| 使用方式 | `docker volume create [OPTIONS] [VOLUME]`            |

```bash
docker volume create my-volume
```

若不指定名稱，Docker 會自動產生一個隨機名稱的匿名 Volume：

```bash
docker volume create
```

建立 Volume 後，可在啟動容器時透過 `-v` 或 `--mount` 掛載使用：

```bash
docker run -d -v my-volume:/app/data my-app
```

- `-d, --driver`：指定 Volume 的驅動程式，預設為 `local`。
- `--label`：為 Volume 加上標籤，方便管理與過濾。
- `-o, --opt`：傳遞驅動程式特定的選項，例如使用 tmpfs 建立記憶體型 Volume：

```bash
docker volume create \
  --driver local \
  --opt type=tmpfs \
  --opt device=tmpfs \
  --opt o=size=100m,uid=1000 \
  my-tmpfs-volume
```

也可以使用 NFS 掛載遠端目錄：

```bash
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  my-nfs-volume
```

:::tip
Volume 名稱在同一個驅動程式下必須唯一。若指定的 Volume 名稱已存在且使用相同驅動程式，Docker 會直接重用現有 Volume 而不報錯；若名稱相同但驅動程式不同，則會回傳錯誤。
:::

> 詳細 Options 說明可參閱 [**@docker volume create**](https://docs.docker.com/reference/cli/docker/volume/create/)
>

### **`inspect`: 查看 Volume 詳細資訊**

| 說明     | 以 JSON 格式顯示一個或多個 Volume 的詳細配置資訊     |
| -------- | ----------------------------------------------------- |
| 使用方式 | `docker volume inspect [OPTIONS] VOLUME [VOLUME...]`  |

```bash
docker volume inspect my-volume
```

輸出範例：

```json
[
  {
    "CreatedAt": "2020-04-19T11:00:21Z",
    "Driver": "local",
    "Labels": {},
    "Mountpoint": "/var/lib/docker/volumes/my-volume/_data",
    "Name": "my-volume",
    "Options": {},
    "Scope": "local"
  }
]
```

- `-f, --format`：使用 Go 模板語法格式化輸出，只顯示特定欄位，例如查看 Volume 的掛載路徑：

```bash
docker volume inspect --format '{{ .Mountpoint }}' my-volume
```

> 詳細 Options 說明可參閱 [**@docker volume inspect**](https://docs.docker.com/reference/cli/docker/volume/inspect/)
>

### **`ls`: 列出 Volume**

| 說明     | 列出所有 Docker 管理的 Volume，顯示驅動程式與名稱 |
| -------- | -------------------------------------------------- |
| 使用方式 | `docker volume ls [OPTIONS]`                       |

```bash
docker volume ls
```

- `-q, --quiet`：只顯示 Volume 名稱，適合在腳本中使用。
- `-f, --filter`：根據條件過濾 Volume，例如只顯示未被任何容器使用的懸空 Volume：

```bash
docker volume ls -f dangling=true
```

常用的過濾條件：

- `dangling=true`：未被任何容器參照的 Volume。
- `driver=<driver>`：使用指定驅動程式的 Volume。
- `label=<key>` 或 `label=<key>=<value>`：帶有指定標籤的 Volume。
- `name=<name>`：依名稱過濾（支援部分比對）。

> 詳細 Options 說明可參閱 [**@docker volume ls**](https://docs.docker.com/reference/cli/docker/volume/ls/)
>

### **`prune`: 清除未使用的 Volume**

| 說明     | 刪除所有未被任何容器使用的本地 Volume；預設只刪除匿名 Volume |
| -------- | ------------------------------------------------------------ |
| 使用方式 | `docker volume prune [OPTIONS]`                              |

```bash
docker volume prune
```

- `-a, --all`：同時刪除具名 Volume（named volumes），而不只限於匿名 Volume。
- `-f, --force`：不詢問確認直接執行刪除。
- `--filter`：根據標籤條件過濾要刪除的 Volume：

```bash
docker volume prune --filter "label=env=dev"
```

:::caution
`docker volume prune` 預設只會刪除**匿名 Volume**（沒有明確命名的 Volume）。若要連同**具名 Volume** 一起清除，必須加上 `-a` 旗標。Volume 中的資料一旦刪除便無法復原，請謹慎操作。
:::

> 詳細 Options 說明可參閱 [**@docker volume prune**](https://docs.docker.com/reference/cli/docker/volume/prune/)
>

### **`rm`: 刪除 Volume**

| 說明     | 刪除一個或多個 Volume（Volume 不可正在被容器使用） |
| -------- | --------------------------------------------------- |
| 使用方式 | `docker volume rm [OPTIONS] VOLUME [VOLUME...]`     |

```bash
docker volume rm my-volume
```

一次刪除多個 Volume：

```bash
docker volume rm volume1 volume2 volume3
```

- `-f, --force`：強制刪除，即使 Volume 仍被容器使用也會嘗試刪除。

:::caution
無法刪除正在被容器使用中的 Volume，需先停止並移除相關容器後才能刪除。
:::

> 詳細 Options 說明可參閱 [**@docker volume rm**](https://docs.docker.com/reference/cli/docker/volume/rm/)
>

## **Reference**
- [**docker volume**](https://docs.docker.com/reference/cli/docker/volume/)
