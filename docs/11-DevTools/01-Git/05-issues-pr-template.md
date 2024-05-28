---
title: 使用 Issues, PR 模板組織專案工作流
sidebar_label: "[Github] Issues, PR 模板"
description: 在 Github 上，Issue 和 Pull Request 是兩個重要的功能，本文章將介紹如何使用 Issue 和 Pull Request Template 組織專案工作流。 文章將涵蓋以下內容：1. 如何創建和使用 Issue Template, 2. 如何創建和使用 Pull Request Template, 3. 如何使用 Issue 和 Pull Request Template 自動化工作流
last_update:
  date: 2024-03-03
keywords:
  - 開發工具
  - Git
  - GitHub
  - GitHub issues
  - GitHub pull request
tags:
  - 開發工具
  - Git
  - GitHub
---

## **Github Issues, Pull requests 與開發工作流之間的關係**

當多個人一起開發一個沒有被完善管理的 Github 專案時，常常會遇到下列場景：「**這個 PR 解決了哪些問題呀？問題被紀錄在哪裡啊？」**、**「功能 A 被修好了，但功能 B 卻冒出了新的 Bug」**、**「你問的這個問題我已經在修了耶」**。在一個沒有完善管理的專案中工作，由於缺乏有效的規劃、控制和溝通，常常在解決問題的過程中製造新的問題。因此多數有經驗的開發者都會在專案創建初期訂定好協作開發的工作流，像是 Issues, PRs 的內容格式、 branch 名稱的命名原則、分支間 merge 的規範等等，讓所有的協作者以相同的規則、風格做工作記錄，可以大大提升團隊合作的效率。

我在前公司實習時，前公司走 **Github Flow** 的開發流程，以 **Issues** 紀錄需要被解決的問題，並規定每個 **PR** 都必須詳細描述提交的變動解決了什麼問題、用什麼方法如何解決、是否經過測試，且必須關聯到待解議題的 issue 編號。即便獨立開發時不需要考慮協作問題，使用這套工作流依然能幫助我清楚追蹤每個變動的目的是什麼、做了什麼修改、是否經過測試，如果出現問題，可以透過紀錄輕鬆追溯變更歷史，找出問題的根源，因此我自己在開發個人專案時也很喜歡用這樣的方式來管理我的專案。

以下總結獨立開發或團隊開發時使用工作流的好處：

- **清晰的開發紀錄：**透過 Issues 和 PR 的描述，可以清楚追蹤每個變動的目的是什麼、做了什麼修改、是否經過測試，以及與哪些議題相關。
- **易於追蹤：**可以幫助開發者輕鬆追蹤每個問題的狀態和進度，以及哪些 PR 解決了這個問題。
- **易於協作**：團隊開發中，清楚的紀錄可以幫助團隊成員了解彼此的進度，並在必要時提供協助。
- **可追溯性：**如果出現問題，可以透過紀錄輕鬆追溯變更歷史，找出問題的根源。


<br/>


## **為何需要 Github Issues, Pull requests 模板？**

善用 Github Issues 和 Pull requests 的**模板**功能，可以幫助你更有效率地組織專案工作流。模板可以提供結構和一致性，幫助你更有效地跟踪問題和程式碼變更請求。它們還可以確保所有參與者都提供所需的信息。

### **Issues 模板**

我們先用一個簡單的範例來看看使用 Issues, Pull requests 模板後，專案工作流會有哪些具體的改進。在這個範例中，我建立了兩種 **Issue 模板**分別用於**提交問題**與**提供功能改進意見**。
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1709457952/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Github%20Issues%20PR%20%E6%A8%A1%E6%9D%BF/issue%E6%A8%A1%E6%9D%BF_wdtbul.png)

在 Issue 模板中，我們可以規範提交的 Issue 具有相同的標題格式、同類型的問題有相同的標籤，且內容必須包含該 Issue 的概要描述以及代辦事項規劃。
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1709457952/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Github%20Issues%20PR%20%E6%A8%A1%E6%9D%BF/issue-bug_odtcvr.png)
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1709457952/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Github%20Issues%20PR%20%E6%A8%A1%E6%9D%BF/issue-feature_guwxnl.png)


### **PR 模板**
而在 PR 模板中，我們可以提醒開發者必須連結相關連的 Issue，規範 PR 內容必須說明變更項目與方法、是否經過測試等資訊。Github 提供了一個很方便的功能，只要該 PR 是以 default branch 為 base(merge target)，它能讓我們用 **close, fix, resolve** 等關鍵字將 PR 連向特定編號的 issue，並在 merge 成功後自動關閉 issue。

> 關鍵字列表參考 @[**Linking a pull request to an issue**](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
![](https://res.cloudinary.com/djtoo8orh/image/upload/v1709457952/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Github%20Issues%20PR%20%E6%A8%A1%E6%9D%BF/PR_yrhoto.png)


<br/>


## **如何創建 Github Issues, Pull requests 模板？**

### **手動添加文檔**

Issue, PR 模板通常會放在預設分支的 .github 目錄底下，如果在非預設分支建立模板，其他協作這將無法使用。

- 多模板
    - **Issue**: 在 .github/ISSUE_TEMPLATE/ 底下創建 .md 檔
    - **PR**: 在 .github/PULL_REQUEST_TEMPLATE/ 底下創建 .md 檔
- 單模板
    - **Issue**: 在 .github/ 底下創建 ISSUE_TEMPLATE.md
    - **PR**: 在 .github/ 底下創建 PULL_REQUEST_TEMPLATE.md

### **GIthub 介面添加文檔**

使用 Github 介面添加文檔相對器來更加方便，但目前只能在 Github 上添加 Issue 模板，PR 還不行。操作步驟如下

1. 點擊 repo 頁面中的 **Settings**.
2. 找到並點擊 **Features** 底下 Issues 欄位內的 **Set up templates** 按鈕
3. 點擊下圖中的 Add template 選擇 Github 預設模板或選擇空白模板

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1709457952/Docusaurus%20Blog/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/Github%20Issues%20PR%20%E6%A8%A1%E6%9D%BF/%E5%89%B5%E5%BB%BAissue%E6%A8%A1%E6%9D%BF_zm2fpt.png)


### **Github Issues Template 範例**

```markdown
<!--- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug report
about: Report a bug
title: "[Bug]"
labels: bug
assignees: Bosh-Kuo

---

## Describe
<!--- A clear and concise description of what the bug is. -->

## TODO
<!---
List all sub-tasks to fix this issue
ex:
- [ ] fix problem A
- [ ] fix problem B
-->

```

### **Github Pull requests Template 範例**

```markdown
<!--- PULL_REQUEST_TEMPLATE.md -->

## Summary
<!---
Please include a summary of the changes and the related issues. List any dependencies that are required for this change.

Fixes # (issue number)
-->

## How Has This Been Tested?
<!--- 
Please describe in detail how you tested your changes.
Include details of your testing environment, and the tests you ran to.
-->

```