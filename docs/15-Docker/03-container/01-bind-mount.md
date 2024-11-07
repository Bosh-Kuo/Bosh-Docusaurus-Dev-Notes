---
title: 如何在 Docker 中實現本地檔案掛載：Bind Mount 完整指南
sidebar_label: "Bind Mount 掛載本地檔案"
description: 這篇文章深入介紹了如何在 Docker 中使用 Bind Mount 將本地檔案掛載到容器，包括基本指令、實作範例、常見問題排查及性能最佳化建議。無論你是開發者還是運維人員，都能透過這篇教學有效掌握 Bind Mount 技術，提升 Docker 開發效率。
last_update:
  date: 2024-11-01
keywords: [Docker, Docker Bind Mount, Docker 本地檔案掛載, Docker Volume vs Bind Mount, Docker 容器資料夾掛載教學]
tags: [Docker]
---


Docker 容器的設計初衷是隔離應用程序，在建構映像時便包含運行所需的所有依賴項，使其運行不受宿主機的環境影響。然而，有時候我們可能想要同步本地程式碼至容器內部，或將敏感資料如 API 密鑰以安全方式提供給容器。此時，Docker 的隔離性卻讓它無法直接存取宿主機的檔案資料，因此 Docker 提供了「掛載」功能，讓我們能在容器中方便地存取本地資料。

## **兩種 Docker 檔案掛載方式：Volume 和 Bind Mount**

Docker 提供了兩種主要的掛載方式來實現本地與容器之間的資料共享：**Volume** 和 **Bind Mount**。它們雖然都能掛載本地資料，但在實際應用場景和運作原理上卻有所不同。

### **Docker Volume（資料卷）**
    
Volume 是 Docker 針對「資料持久化」提供的解決方案，尤其適合需要長期保存的資料，像是資料庫檔案、應用程式設定等。當容器被刪除時，Volume 中的資料仍會保留，讓資料的管理更安全與穩定。

使用 Volume 有以下幾個好處：

1. **自動管理**：Docker 會自動選擇存儲路徑，並進行優化，無需開發人員指定路徑。
2. **跨容器共享**：同一個 Volume 可以被多個容器掛載，適合用於需要共享資料的情境，例如多個服務共用一組資料。
3. **安全隔離**：Volume 的資料與主機系統隔離，即使資料意外刪除也不會直接影響到主機的檔案。

以下為 Volume 的使用範例：

```bash
docker run -d -v my_volume:/app/data my_image
```

在此指令中，`my_volume` 是一個 Docker Volume，會掛載到容器內部的 `/app/data` 目錄中。
    

### **Bind Mount（綁定掛載）**
    
相比之下，Bind Mount 更靈活，它允許直接指定宿主機的目錄或檔案掛載到容器中，適合開發測試環境下使用。尤其是當你需要同步程式碼修改時，Bind Mount 能讓本地更改即時反映在容器中，無需重建。

Bind Mount 的優勢包括：

1. **即時同步**：可以快速同步本地編輯的代碼或文件，無需重新打包 image 或重建容器。
2. **靈活性**：我們可以指定任意本地路徑作為 Bind Mount 的來源，並掛載到容器的特定目錄中。
3. **方便測試和調試**：在開發過程中，可以隨時進行測試，不需頻繁重啟容器。

以下為 Bind Mount 的使用範例：

```bash
docker run -d -v /path/to/local/folder:/app/folder my_image
```

此指令中，`/path/to/local/folder` 是宿主機目錄，掛載至容器內部的 `/app/folder` 目錄。
    

### **Volume vs. Bind Mount：什麼時候該用哪一個？**

| 特性         | Volume               | Bind Mount           |
| ------------ | -------------------- | -------------------- |
| **管理方式** | 由 Docker 自動管理   | 需手動指定宿主機路徑 |
| **適用環境** | 生產環境、資料持久化 | 開發環境、即時同步   |
| **安全性**   | 更高的隔離性         | 依賴於宿主機檔案系統 |

綜合來說，如果你的應用程式需要穩定的資料存取，且不需頻繁更新，**Volume** 是更好的選擇；而在開發和測試階段，當需要即時同步時，**Bind Mount** 則是更為高效的方法。

## **如何在 Docker 中實作 Bind Mount 掛載？**

### **在 `docker run` 指令中使用 `-v` 或 `--mount` 選項進行 Bind Mount**

在 Docker 中，`-v` 和 `--mount` 都可以用來掛載本地檔案或目錄到容器內部。不過，這兩種方法在語法和使用情境上有些差異：

- **`-v` 簡便用法**：
    
    這個選項語法簡單，更適合一般的 Bind Mount 操作，尤其適合開發測試。值得注意的是，如果主機端指定的路徑不存在，Docker 會自動建立此目錄，非常方便快速測試。
    
    範例：
    
    ```bash
    docker run -v /HOST/PATH:/CONTAINER/PATH -it nginx
    ```
    
    這行指令會將本地的 `/HOST/PATH` 掛載到容器內的 `/CONTAINER/PATH`，當修改本地文件時，變更會即時同步到容器中。
    
- **`--mount` 詳細控制**：
    
    這種語法稍微複雜，但功能更強大，適合需要精細掛載控制的場景。值得注意的是，如果指定的路徑不存在，Docker 不會自動建立該目錄，這可以避免意外錯誤。
    
    範例：
    
    ```bash
    docker run --mount type=bind,source=/HOST/PATH,target=/CONTAINER/PATH,readonly nginx
    ```
    

> 建議：Docker 官方建議使用 `--mount`，因為它可以避免目錄不存在的情況，並且在掛載控制上更靈活、穩定，特別是適合生產環境中需要高度穩定的場景。
> 

### **設定掛載檔案的權限：只讀與讀寫模式**

**1. 只讀模式（Read-Only）**

如果希望容器內部的應用程式只能讀取檔案而無法修改，可以設置只讀模式（`ro`）。例如，掛載靜態資源或配置檔案時，使用只讀模式可避免誤操作。

```bash
docker run -v ~/mycode:/app:ro my-image
# 或者
docker run --mount type=bind,source=~/mycode,target=/app,readonly my-image
```

在這種情況下，容器中的應用可以讀取 `/app` 內的檔案，但無法進行修改，適合用於需保護檔案不被更動的場景。

**2. 讀寫模式（Read-Write）**

如果開發需求中允許容器修改本地資料夾，則可以設置讀寫模式（`rw`），這也是 Docker 預設的權限配置。讀寫模式在測試和開發中非常有用，能夠讓容器內的應用程式直接影響本地檔案。

```bash
docker run -v ~/mycode:/app:rw my-image
# 或者
docker run --mount type=bind,source=~/mycode,target=/app rw my-image
```

這樣一來，本地的資料夾和容器之間可以雙向同步修改。這種模式非常適合需要不斷修改、測試的開發環境。

### **Docker Compose 中配置 Bind Mount**

當我們需要在 Docker Compose 中掛載本地資料夾或檔案到多個容器時，可以使用 Bind Mount 來設定，這可以讓開發更靈活，避免頻繁重建容器。

- **基本語法**
    
    在 Docker Compose 中，掛載 Bind Mount 的基本語法如下：
    
    ```yaml
    services:
      [服務名稱]:
        image: [image-name]
        volumes:
          - [本地路徑]:[容器內路徑]:[權限]
    ```
    
- **例子 1：基本掛載範例**
    
    假設我們有一個前端應用程式，程式碼放在本地的 `./frontend` 資料夾，開發過程中希望代碼變更能即時同步到容器。可以這樣配置：
    
    ```yaml
    version: "3"
    services:
      frontend:
        image: node:latest
        volumes:
          - ./frontend:/app:rw
        working_dir: /app
        command: ["npm", "start"]
    ```
    
    這樣的設定會將本地 `frontend` 資料夾掛載至容器內的 `/app` 路徑，容器中 Web 服務將會自動同步本地程式碼變更，非常適合開發環境的使用。
    
- **例子 2：多容器共享單一資料夾**
    
    如果有多個容器需要同時存取同一組靜態資原始檔（例如 `static-files`），可以設定如下：
    
    ```yaml
    version: "3"
    services:
      frontend:
        image: nginx:latest
        volumes:
          - ./static-files:/usr/share/nginx/html:ro
    
      backend:
        image: my-backend-image
        volumes:
          - ./static-files:/app/static:ro
    ```
    
    這段配置會把本地的 `static-files` 資料夾分別掛載到 `frontend` 容器中的 `/usr/share/nginx/html` 路徑，以及 `backend` 容器的 `/app/static` 路徑。設置為只讀（`ro`）模式，避免容器無意間修改或刪除靜態資源。
    
- **例子 3：複雜掛載需求**
    
    當我們的專案需要同時掛載多個本地資料夾或檔案時，可以在 Docker Compose 中設定多個 Bind Mount。例如，假設我們有以下需求：
    
    1. 將 `config` 資料夾掛載到容器的 `/app/config` 路徑，以讀取配置文件。
    2. 將 `logs` 資料夾掛載到 `/app/logs` 路徑，且允許容器記錄日誌。
    3. 將 `.env` 文件掛載到 `/app/.env`，作為環境變量的來源。
    
    在這種情況下，`docker-compose.yml` 配置可以這樣寫：
    
    ```yaml
    version: "3"
    services:
      app:
        image: my-application-image
        volumes:
          - ./config:/app/config:ro
          - ./logs:/app/logs:rw
          - ./.env:/app/.env:ro
    ```
    
    這樣做能夠將本地不同來源的資料分別掛載到容器內的不同目錄，以滿足應用對不同資料夾的權限需求。
    

## **實戰操作範例**

### **使用 `docker run` 挂載本地檔案到容器**

在這個範例中，我們將使用 CLI 指令把本地的資料夾掛載到 Docker 容器，並觀察文件的同步效果。

1. **準備本地資料夾與檔案**
    
    首先，創建一個本地資料夾，並在其中放入一個簡單的文件。假設我們在主機的 `~/myapp` 目錄下操作：
    
    ```bash
    mkdir ~/myapp
    echo "Hello, Docker" > ~/myapp/index.html
    ```
    
    此時 `~/myapp` 資料夾裡會有一個名為 `index.html` 的文件，裡面的內容是 `"Hello, Docker"`。
    

1. **使用 CLI 指令掛載資料夾到容器**
    
    現在，我們來啟動一個 Nginx 容器，並將本地的 `~/myapp` 資料夾掛載到容器的 `/usr/share/nginx/html` 路徑。這樣一來，Nginx 服務就可以直接從我們的本地資料夾中讀取文件。
    
    執行以下指令：
    
    ```
    docker run -d --name my-nginx -p 8080:80 -v ~/myapp:/usr/share/nginx/html:ro nginx
    ```
    
    在這個指令中，我們使用了以下參數：
    
    - `-d`：讓容器在後台運行。
    - `--name my-nginx`：將容器命名為 `my-nginx`。
    - `-p 8080:80`：將本地的 8080 端口映射到容器的 80 端口，讓我們可以通過 `localhost:8080` 訪問 Nginx。
    - `-v ~/myapp:/usr/share/nginx/html:ro`：將本地的 `~/myapp` 資料夾掛載到容器內的 `/usr/share/nginx/html`，並設為只讀模式。

1. **測試掛載效果**
    
    現在，打開瀏覽器，訪問 `http://localhost:8080`，應該會看到畫面顯示「Hello, Docker」，這說明我們已經成功將本地文件掛載到容器中。
    

1. **修改本地檔案並同步**
    
    為了確認容器內部內容會即時反映本地變更，我們可以編輯 `~/myapp/index.html`，修改內容為「Hello, Docker! Welcome to Bind Mount」。之後，刷新瀏覽器頁面，應該會看到新內容自動更新。
    

### **使用 Docker Compose 挂載本地檔案**

接下來，我們使用 Docker Compose 來實現相同的掛載效果。

1. **準備本地資料夾與檔案(同上)**
2. 準備 Docker Compose 文件
    
    接著，創建一個 `docker-compose.yml` 文件並填入以下內容：
    
    ```yaml
    version: "3"
    services:
      web:
        image: nginx
        ports:
          - "8080:80"
        volumes:
          - ~/myapp:/usr/share/nginx/html:ro
    ```
    
    這個 Compose 檔案定義了以下幾個配置：
    
    - `services.web.image: nginx`：我們使用 Nginx 作為服務容器的基礎映像。
    - `services.web.ports: "8080:80"`：將本地的 8080 連接埠對應到容器的 80 連接埠。
    - `services.web.volumes: ~/myapp:/usr/share/nginx/html:ro`：將當前目錄中的 `myapp` 資料夾掛載到容器的 `/usr/share/nginx/html` 路徑，並設為唯讀。
3. **啟動 Docker Compose**
    
    在終端中執行以下指令來啟動服務：
    
    ```bash
    docker compose up -d
    ```
    
    這樣會啟動 Nginx 服務，並完成端口映射和文件掛載。
    
4. **測試掛載效果**
    
    和前面的 CLI 範例一樣，現在打開瀏覽器訪問 `http://localhost:8080`，應該會顯示 `index.html` 的內容「Hello, Docker」。這表明我們已經成功將本地資料夾掛載到容器中。
    
5. **修改本地檔案並檢查同步效果**
    
    再次打開 `~/myapp/index.html`，修改內容，然後刷新瀏覽器頁面。你應該會看到容器內部的內容也隨之更新。這證明 Docker Compose 的 Bind Mount 也實現了檔案的即時同步。
    
6. **停止並清理 Docker Compose**
    
    完成測試後，可以使用以下指令停止並清理 Docker Compose 所建立的容器和網路：
    
    ```bash
    docker compose down
    ```
    
    這樣就會停止所有服務並清除資源，讓系統保持整潔。
    

## **注意事項與常見問題**

### **1. 權限問題**

在 Docker 中使用 Bind Mount 時，權限設定會因主機與容器之間的使用者或群組權限不一致而出現問題。比如，如果本地文件的擁有者與容器內的使用者 ID 不同，容器中的服務（如 Nginx）可能無法讀取或寫入掛載的目錄，進而出現 `403 Forbidden` 或「Permission denied」等錯誤。

**解決方法：**

- **調整主機文件夾的權限**：可以使用 `chmod` 命令來修改本地文件夾的權限，確保它可供容器讀取或寫入。例如：
    
    ```bash
    chmod -R 755 myapp
    ```
    
- **使用 `-user` 選項**：在啟動容器時，使用 `-user` 指定容器的使用者 ID 與主機一致，以避免權限衝突。這樣容器中的應用程式可以以正確的身份讀取和寫入掛載目錄。例如：
    
    ```bash
    docker run --user $(id -u):$(id -g) -v ~/myapp:/app my-image
    ```
    

### **2. 性能考量**

在 Windows 和 MacOS 上，Docker 是透過虛擬機器（VM）來運行的，這會導致 Bind Mount 的文件存取速度比在 Linux 系統中慢。對於頻繁的文件讀寫，這種性能瓶頸可能會導致容器中的操作顯得遲緩。

**最佳化建議：**

- **使用同步文件共享**：在 Docker Desktop 中，有些版本提供了同步文件共享選項，可以加速虛擬機器中的文件讀寫，適合需要快速同步的場景。
- **使用 Volume**：如果掛載的資料在使用過程中不需頻繁修改，建議使用 Docker Volume 代替 Bind Mount。Volume 在性能上更優，特別適合生產環境中的持久性資料儲存。
- **減少掛載文件數量**：僅掛載開發過程中需要的特定文件或資料夾，避免不必要的文件掛載，能有效提高性能。

### **3. 問題排查**

在掛載操作中，可能遇到不同的錯誤訊息，以下是一些常見問題與解決方案。

**常見錯誤訊息：**

- **403 Forbidden**：這通常是由於容器內的服務無法讀取掛載的資料夾或文件引起。請確認本地目錄中包含所有必要文件，且其權限允許容器內的服務讀取。
- **No such file or directory**：這表明 Docker 無法找到掛載的主機路徑。確保您指定的路徑在主機上存在，並已正確建立資料夾。
- **Permission denied**：若看到此錯誤，請檢查掛載的文件或資料夾的讀寫權限，確保容器具備存取該路徑的權限。

**掛載問題的 Debug 技巧：**

- **檢查容器內的掛載點內容**：使用以下指令進入容器並檢查掛載的目錄，以確保文件已正確掛載：
    
    ```bash
    docker exec -it my-nginx ls /usr/share/nginx/html
    ```
    
    若掛載正常，您應能夠看到容器內該目錄下的文件。
    
- **使用 `docker inspect` 檢查掛載配置**：`docker inspect` 可以讓您查看容器的詳細掛載配置，檢查是否正確掛載至指定路徑。
    
    ```bash
    docker inspect my-nginx | grep Mounts -A 10
    ```
    
- **檢查文件權限與擁有者**：進入容器後，使用 `ls -l` 檢查文件或資料夾的權限，確認容器內的使用者是否有權限讀取或寫入文件夾。
    
    ```bash
    docker exec -it my-nginx ls -l /usr/share/nginx/html
    ```
    

## **Reference**

- [**Sharing local files with containers**](https://docs.docker.com/get-started/docker-concepts/running-containers/sharing-local-files/#volume-versus-bind-mounts)
- [**docker run - Add bind mounts or volumes using the --mount flag**](https://docs.docker.com/reference/cli/docker/container/run/#mount)
- [**docker run - Mount volume (-v)**](https://docs.docker.com/reference/cli/docker/container/run/#volume)
- [**Bind mounts**](https://docs.docker.com/engine/storage/bind-mounts/)