---
title: SQL 與 MongoDB 指令與術語對照關係
sidebar_label: "SQL to MongoDB"
description: 這篇文章將介紹 SQL 與 MongoDB 中常用指令及術語的對應關係，幫助熟悉關聯式資料庫操作的讀者快速掌握 MongoDB 的基本操作。文章將以 SQL 的概念為基礎，對照 MongoDB 的查詢語言（MQL），並說明兩者在資料操作、查詢、資料結構上的差異與相似之處。
last_update:
  date: 2024-10-26
keywords: [MongoDB, SQL, SQL to MongoDB]
tags: [MongoDB]
---

## **術語與概念對照**

以下是常見的 SQL 與 MongoDB 術語對照，包含中文和英文的對應說明：

| **SQL 術語/概念**                     | **MongoDB 術語/概念**                                                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 資料庫 (database)                     | 資料庫 (database)                                                                                                                                     |
| 資料表 (table)                        | 集合 (collection)                                                                                                                                     |
| 資料列 (row)                          | 文件 (document) 或 BSON 文件                                                                                                                          |
| 欄位 (column)                         | 欄位 (field)                                                                                                                                          |
| 索引 (index)                          | 索引 ([index](http://docs.mongodb.org/manual/reference/glossary/#term-index))                                                                         |
| 資料表聯結 (table joins)              | [`$lookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 嵌入式文件 (embedded documents) |
| 主鍵 (primary key)                    | [`_id`](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-_id)（自動設為主鍵）                                                         |
| 聚合 (aggregation)（例如 `GROUP BY`） | [`aggregation pipeline`](https://www.mongodb.com/docs/manual/reference/sql-aggregation-comparison/)                                                   |
| `SELECT INTO NEW_TABLE`               | [`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)                                          |
| `MERGE INTO TABLE`                    | [`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)                                    |
| `UNION ALL`                           | [`$unionWith`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/unionWith/#mongodb-pipeline-pipe.-unionWith)                        |
| transactions                          | [`transactions`](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)                                                       |

## **可執行檔對照**

資料庫的可執行檔是用來啟動資料庫伺服器或與資料庫互動的工具。以下是不同資料庫的伺服器和客戶端可執行檔對應：

|                              | **MongoDB** | **MySQL** | **Oracle** | **Informix (IDS)** | **DB2**      |
| ---------------------------- | ----------- | --------- | ---------- | ------------------ | ------------ |
| **伺服器 (Database Server)** | `mongod`    | `mysqld`  | `oracle`   | `IDS`              | `DB2 Server` |
| **客戶端 (Database Client)** | `mongosh`   | `mysql`   | `sqlplus`  | `DB-Access`        | `DB2 Client` |
- [**伺服器 (Database Server)**](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/)：如 `mongod`，是用來啟動 MongoDB 資料庫伺服器的可執行檔，類似於 MySQL 的 `mysqld`。
- [**客戶端 (Database Client)**](https://www.mongodb.com/docs/mongodb-shell/)：如 `mongosh`，是一個命令列工具，用來與 MongoDB 資料庫互動，執行查詢及管理操作。

## **查詢資料 (SELECT 與 `find`) 指令對照**

MongoDB 的 `find` 方法與 SQL 的 `SELECT` 類似，用來從集合中查詢文件。MongoDB 提供了強大的查詢功能，可以結合查詢操作符（如 [`$gt`](https://www.mongodb.com/docs/manual/reference/operator/query/gt/#mongodb-query-op.-gt), [`$eq`](https://www.mongodb.com/docs/manual/reference/operator/query/eq/#mongodb-query-op.-eq)）來篩選結果。

**相關連結：**

- [MongoDB `find`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/)
- [MongoDB `countDocuments`](https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/)

### **查詢所有資料**

```sql
-- SQL
SELECT * FROM people;
```

```jsx
// MongoDB
db.people.find();
```

說明：這會查詢 `people` 表/集合中的所有資料。

### **查詢特定欄位**

```sql
-- SQL
SELECT user_id, status FROM people;
```

```jsx
// MongoDB
db.people.find({}, { user_id: 1, status: 1 });
```

說明：只查詢 `user_id` 和 `status` 欄位。

### **使用條件查詢**

```sql
-- SQL
SELECT * FROM people WHERE age > 30;
```

```jsx
// MongoDB
db.people.find({ age: { $gt: 30 } });
```

說明：查詢所有 `age` 大於 30 的記錄。在 MongoDB 中，[`$gt`](https://www.mongodb.com/docs/manual/reference/operator/query/gt/#mongodb-query-op.-gt) 表示「大於」。

### **查詢特定條件的資料**

```sql
-- SQL
SELECT * FROM people WHERE status = 'A';
```

```jsx
// MongoDB
db.people.find({ status: 'A' });
```

說明：查詢 `status` 為 `'A'` 的所有資料。

### **計算資料筆數**

```sql
-- SQL
SELECT COUNT(*) FROM people;
```

```jsx
// MongoDB
db.people.countDocuments();
```

說明：計算 `people` collection 中的 document 數量。

## **插入資料 (INSERT 與 `insertOne`) 指令對照**

MongoDB 使用 [`insertOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) 和 [`insertMany`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)  來插入文件到集合中，與 SQL 不同的是，MongoDB 不需要事先定義資料結構，`_id` 自動作為主鍵生成。。

**相關連結：**

- [MongoDB `insertOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/)
- [MongoDB `insertMany`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/)

### **插入新資料**

```sql
-- SQL
INSERT INTO people (user_id, age) VALUES ('abc123', 55);
```

```jsx
// MongoDB
db.people.insertOne({ user_id: 'abc123', age: 55 });
```

說明：在 MongoDB 中，插入文件時會自動生成 `_id` 作為主鍵。

## **更新資料 (UPDATE 與 `updateMany`) 指令對照**

MongoDB 使用 [`updateOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/) 或 [`updateMany`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/) 來更新文件，並透過 [`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/#mongodb-update-up.-set) 來修改欄位的值，或是使用 [`$inc`](https://www.mongodb.com/docs/manual/reference/operator/update/inc/#mongodb-update-up.-inc) 來遞增數值。

### **更新特定欄位**

```sql
-- SQL
UPDATE people SET age = 30 WHERE user_id = 'abc123';
```

```jsx
// MongoDB
db.people.updateMany({ user_id: 'abc123' }, { $set: { age: 30 } });
```

說明：更新所有 `user_id` 為 `'abc123'` 的文件，將 `age` 設為 30。

## **刪除資料 (DELETE 與 `deleteMany`) 指令對照**

在 MongoDB 中，[`deleteOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne) 和 [`deleteMany`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/) 用來刪除符合條件的文件，與 SQL 的 `DELETE` 操作相似。

**相關連結：**

- [MongoDB `deleteOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/)
- [MongoDB `deleteMany`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/)

### **刪除符合條件的資料**

```sql
-- SQL
DELETE FROM people WHERE status = 'A';
```

```jsx
// MongoDB
db.people.deleteMany({ status: 'A' });
```

說明：刪除所有 `status` 為 `'A'` 的文件。

### **刪除所有資料**

```sql
-- SQL
DELETE FROM people;
```

```jsx
// MongoDB
db.people.deleteMany({});
```

說明：刪除 `people` 集合中的所有文件。

## **聚合查詢與資料轉換指令對照**

在 SQL 中，`GROUP BY`、`UNION ALL` 等聚合查詢是常見的操作。MongoDB 則使用 [**Aggregation Pipeline**](https://www.mongodb.com/docs/manual/aggregation/) 來實現複雜的資料處理，透過管道方式逐步處理文件，最終輸出結果。

| **SQL 操作**                        | **MongoDB 聚合操作**                                                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 群組(GROUP BY)                      | [`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)                                                                                                |
| 聯集(UNION ALL)                     | [`$unionWith`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/unionWith/)                                                                                        |
| 篩選條件(HAVING)                    | [`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/)（在 $group 之後使用）                                                                          |
| 排序(ORDER BY)                      | [`$sort`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)                                                                                                  |
| 限制筆數(LIMIT)                     | [`$limit`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/)                                                                                                |
| 跳過筆數(OFFSET)                    | [`$skip`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/skip/)                                                                                                  |
| 選擇至新表格(SELECT INTO NEW_TABLE) | [`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/)                                                                                                    |
| 合併至表格(MERGE INTO TABLE)        | [`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/)                                                                                                |
| 計算總和(SUM)                       | [`$sum`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sum/)                                                                                                    |
| 計算平均值(AVG)                     | [`$avg`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/avg/)                                                                                                    |
| 計算筆數(COUNT)                     | [`$count`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/count/)                                                                                                |
| 取得最小值(MIN)                     | [`$min`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/min/)                                                                                                    |
| 取得最大值(MAX)                     | [`$max`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/max/)                                                                                                    |
| 唯一值(DISTINCT)                    | [`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/) 或 [`$addToSet`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addToSet/) |

以下是一些常見 SQL 與 MongoDB 聚合查詢的範例

### **計算總數**

```sql
-- SQL
SELECT COUNT(*) AS count FROM orders;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: null,
      count: { $sum: 1 }
    }
  }
]);
```

**說明**：計算 `orders` 集合中的文件總數。

### **計算欄位總和**

```sql
-- SQL
SELECT SUM(price) AS total FROM orders;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$price" }
    }
  }
]);
```

**說明**：計算 `orders` 集合中 `price` 欄位的總和。

### **分組計算總和**

```sql
-- SQL
SELECT cust_id, SUM(price) AS total FROM orders GROUP BY cust_id;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: "$cust_id",
      total: { $sum: "$price" }
    }
  }
]);
```

**說明**：根據 `cust_id` 分組，計算每個客戶的 `price` 總和。

### **分組計算並排序**

```sql
-- SQL
SELECT cust_id, SUM(price) AS total FROM orders GROUP BY cust_id ORDER BY total;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: "$cust_id",
      total: { $sum: "$price" }
    }
  },
  {
    $sort: { total: 1 }
  }
]);
```

**說明**：根據 `cust_id` 分組計算 `price` 總和，並按總和排序。

### **分組計算並格式化日期**

```sql
-- SQL
SELECT cust_id, ord_date, SUM(price) AS total FROM orders GROUP BY cust_id, ord_date;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: {
        cust_id: "$cust_id",
        ord_date: { $dateToString: { format: "%Y-%m-%d", date: "$ord_date" } }
      },
      total: { $sum: "$price" }
    }
  }
]);
```

**說明**：根據 `cust_id` 和 `ord_date` 分組，計算 `price` 總和，並忽略時間部分。

### **分組後過濾筆數**

```sql
-- SQL
SELECT cust_id, COUNT(*) FROM orders GROUP BY cust_id HAVING COUNT(*) > 1;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: "$cust_id",
      count: { $sum: 1 }
    }
  },
  {
    $match: { count: { $gt: 1 } }
  }
]);
```

**說明**：返回有多筆記錄的 `cust_id` 及對應的記錄數量。

### **多重條件分組計算**

```sql
-- SQL
SELECT cust_id, ord_date, SUM(price) AS total FROM orders GROUP BY cust_id, ord_date HAVING total > 250;
```

```jsx
// MongoDB
db.orders.aggregate([
  {
    $group: {
      _id: {
        cust_id: "$cust_id",
        ord_date: { $dateToString: { format: "%Y-%m-%d", date: "$ord_date" } }
      },
      total: { $sum: "$price" }
    }
  },
  {
    $match: { total: { $gt: 250 } }
  }
]);
```

**說明**：根據 `cust_id` 和 `ord_date` 分組計算 `price` 總和，只返回總和大於 250 的結果。

## **Reference**

- [**SQL to MongoDB Mapping Chart**](https://www.mongodb.com/docs/manual/reference/sql-comparison/)
- [**SQL 及 MongoDB 基本指令對應表**](https://calvertyang.github.io/2013/11/14/sql-to-mongodb-mapping-chart/)