---
title: Vite + React 專案在 Docker 容器中的外部訪問配置
sidebar_label: "[問題紀錄] Vite + React 專案在 Docker容器中的外部訪問配置"
description: 本篇文章記錄如何在 Vite + React 專案下設置 vite.config.js 與 Dockerfile，讓使用者通過主機的 IP 位址訪問 Docker 容器中運行的 Vite 服務。
last_update:
  date: 2023-05-30
keywords:
  - Vite
  - React
  - Docker
tags:
  - Vite
---

## **問題**

最近我嘗試使用 Vite 作為建置工具開發了一個純前端的 React 專案，為了在不同環境中獨立運行專案，我試著使用 Docker 建立了一個容器化的運行環境。然而，當我啟動容器後，卻無法透過瀏覽器開啟這個專案的頁面，以下為我的 Dokckerfile 以及所下的指令。

- Dockerfile

```
FROM node:alpine
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN yarn install
EXPOSE 5173
CMD ["yarn", "dev"]
```

- build command:

```bash
docker build -t react-flow .
```

- run command:

```bash
docker run -dp 8080:5173 react-flow
```

![docker-can't-connect](https://res.cloudinary.com/djtoo8orh/image/upload/v1685419015/Docusaurus%20Blog/Vite/React%20Project%20-%20Docker%20problem/docker-can_t-connect_qambiu.png)


![docker-log](https://res.cloudinary.com/djtoo8orh/image/upload/v1685419015/Docusaurus%20Blog/Vite/React%20Project%20-%20Docker%20problem/docker-log_p3ste2.png)


<br/>


## **原因**

從上面兩張圖大概可以猜到，原因大概是來自於目前在 Docker 環境中運行的服務不接受非本地環境的連線。預設情況下，Vite開發伺服器只會使用`localhost`作為主機位址，這意味著它只會接受來自本地環境的連接，若希望可以從從其他設備的瀏覽器連線到 Docker 內運行的伺服器，我們應該要設定伺服器監聽所有的 IP 位址而非只監聽 localhost。


<br/>


## **解決方法**

更改 `vite.config.js` 的設定，加入 `server` 選項的設定如下：

```json
// vite.config.js
export default defineConfig({
	...
  server: {
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 8080, // 順便把 port 改成 8080
  },
});
```

在`vite.config.js`中設定了`server: { host: true }` 可以確保 Vite 伺服器在啟動時能夠監聽所有位址，從而允許來自網路中其他裝置的連接，這樣我們就可以在瀏覽器中通過主機的 IP 位址訪問 Docker 容器中運行的 Vite 服務。

## **Reference**

- **[Step By Step Guide To Dockerize React App Created Using Vite](https://javascript.plainenglish.io/step-by-step-guide-to-dockerize-react-app-created-using-vite-90772423f7fb)**
- **[Config - Server Options](https://vitejs.dev/config/server-options.html#server-port) (**@Vite**)**