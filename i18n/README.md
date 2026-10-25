# 多語系維護

本站提供繁體中文（`/`）與英文（`/en/`）介面。目前 22 篇部落格文章均有英文譯本；技術筆記尚未翻譯，英文介面會回退至中文筆記來源。

## 本機開發

在專案根目錄執行：

| 指令            | 用途                                |
| :-------------- | :---------------------------------- |
| `yarn start`    | 開發預設的中文站，有熱更新          |
| `yarn start:zh` | 明確指定中文，與 `yarn start` 等效  |
| `yarn start:en` | 開發英文站，網址為 `/en/`，有熱更新 |

**開發模式一次只提供一個語系。** 因此 `yarn start` 後切換 English 會出現 404；這不代表正式版的英文站無法使用。

## 預覽中英文切換

先按 `Ctrl+C` 停掉開發伺服器，再執行：

```bash
yarn build
yarn serve
```

`build` 會產生所有語系，`serve` 才能在同一個網站測試中英文切換。此模式沒有熱更新，修改內容後需重新 build。

## 翻譯維護

- 自訂介面文字放在各語系的 `code.json`；導覽、頁尾與內容 Plugin 的介面文字放在對應的 Plugin JSON。
- 新增文字後，執行以下指令擷取項目，再手動翻譯 `message`；避免使用 `--override` 覆寫既有譯文。

```bash
yarn write-translations --locale en
yarn write-translations --locale zh-Hant
```

完成並校閱的譯本放到以下目錄（相對於 `i18n/`），保留原始相對路徑即可：

- 文件：`en/docusaurus-plugin-content-docs/current/<原始相對路徑>`
- 部落格：`en/docusaurus-plugin-content-blog/<原始相對路徑>`


英文部落格保留原始 `slug`、日期與作者，以 `/en/blog/<slug>` 提供內容。英文標題使用明確的原始 heading ID，讓既有章節錨點在兩個語系中皆能使用。本站文章的交叉連結指向英文路由；外部連結維持原網址。技術範例中的註解、顯示文字及圖表標籤也隨文章翻譯，保留程式邏輯與指令的含義。

共用圖片可透過 `@site` 引用同一份來源，不必複製到各語系目錄。例如：

```md
![How semantic colors work](@site/blog/assets/dark-mode-flow.svg#en)
```

`dark-mode-flow.svg` 的預設標籤為中文，`#en` 選擇同一張圖內的英文標籤；版面、圖形與樣式共用。新增或更新翻譯後，執行 `yarn build` 驗證所有語系。
