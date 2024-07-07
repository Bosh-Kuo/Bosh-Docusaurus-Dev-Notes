## Github
### Issue 命名方式

`type: [Feature, Bug, Refactor, Documentation]` 

ex:

- [Bug] Docusaurus render problem
- [Feature] article archive feature

### PR 命名方式

`[type/Issue編號] PR title`

`type: [Feasture, Bugfix, Refactor, Documentation]`

ex:

- [Bugfix/#1] Solve Docusaurus render problem
- [Feature/#2] Add xxx feature




## Git
### Branch 命名方式

`type/#Issue編號`

`type: [feature, bugfix, refactor, documentation]`

ex:

- bugfix/#1
- feature/#2

### Commit log 規範

> 使用 [@Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) 定義之規範  


```
<類型 type>[(可省略)作用範圍 scope]: <描述 description>

[(可省略)正文 body]

[(可省略)頁腳 footer]
```

**commitlint** 官方建議使用 `@commitlint/config-conventional` 作為擴展配置，這個配置基於 [Angular 的提交訊息規範](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)，提供了一組預定義的規則：

- `type`: 描述這次提交的類型，常見類型包括：
    - `build`: 影響構建系統或外部依賴的更改（例如範圍：gulp、broccoli、npm）
    - `ci`: 對持續集成（CI）配置文件和腳本的更改（例如範圍：Travis、Circle、BrowserStack、SauceLabs）
    - `docs`: 僅限文檔的更改
    - `feat`: 新功能
    - `fix`: 修復錯誤
    - `perf`: 提升性能的程式碼更改
    - `refactor`: 不屬於修復錯誤或新增功能的代碼更改
    - `style`: 不影響程式碼含義的更改（空白字符、格式化、缺少的分號等）
    - `test`: 添加缺失的測試或更正現有的測試
- `scope`: 這次變更的影響範圍，例如模組或文件名稱。
- `description`: 簡短描述這次變更的內容。
- `body`: 對提交變更的詳細描述，可以分為多行。
- `footer`: 列出重大變更(**BREAKING CHANGE**) 或關聯的問題追蹤 ID。