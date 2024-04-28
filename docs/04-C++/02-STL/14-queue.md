---
title: "C++ queue(STL) 用法與範例"
sidebar_label: "[Adaptor] queue"
description: 這篇技術筆記將深入探討 std::priority_queue 的用法與原理，本文將說明如何使用 std::priority_queue 來建立和操作 priority_queue，包括宣告、初始化、插入元素、取出元素等常見操作。此外，本文也將介紹 std::priority_queue 的一些進階用法，例如自訂元素比較方式等。本文提供簡易的程式碼範例，協助讀者深入理解和熟練運用 priority_queue。
last_update:
  date: 2024-04-28
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - queue
tags:
  - Programming Language
  - C++
  - STL
---

**`queue`** 是 C++ 標準程式庫(STL) 中的一種容器適配器(Container Adaptor)，是一個先進先出(**FIFO**, First-In-First-Out)的資料結構，它只允許在`隊尾`添加元素和在`隊首`刪除元素。

## **操作**

### **在末尾加入元素：q.push()**

- Time Complexity: O(1)

```cpp
#include <queue>
using namespace std;

queue<int> q;
q.push(1); // queue 現在是 {1}
q.push(2); // queue 現在是 {1, 2}
q.push(3); // queue 現在是 {1, 2, 3}
```

### **移除第一個元素：q.pop()**

- Time Complexity: O(1)

```cpp
queue<int> q;
q.push(1);
q.push(2);
q.pop(); // 移除 1，queue 現在是 {2}
```

### **清空 queue 中的所有元素：q.swap()**

- 雖然 **queue** 沒有直接的 `clear()` 函數，但可以通過對空的 **queue** 使用 `swap()` 方法來達到清空的效果。
- Time Complexity: O(1)

```cpp
queue<int> q;
q.push(1);
q.push(2);
q.push(3);
queue<int> emptyQueue; // 創建一個空的 queue
q.swap(emptyQueue); // 現在 q 是空的，所有元素都在 emptyQueue 中
```


<br/>


## **取值**

### **取得第一個元素：q.front()**
- Time Complexity: O(1)

```cpp
queue<int> q;
q.push(1);
q.push(2);
cout << q.front(); // 輸出 1
```

### **取得最後一個元素：q.back()**
- Time Complexity: O(1)

```cpp
queue<int> q;
q.push(1);
q.push(2);
cout << q.back(); // 輸出 2
```

### **取得元素個數：q.size()**
- Time Complexity: O(1)

```cpp
queue<int> q;
q.push(1);
q.push(2);
q.push(3);
cout << q.size(); // 輸出 3
```

### **檢查 queue 是否為空：q.empty()**
- Time Complexity: O(1)

```cpp
queue<int> q;
cout << q.empty(); // true，因為 queue 是空的
q.push(1);
cout << q.empty(); // false，因為 queue 現在有元素
```


<br/>


## **Reference**

- **[@cplusplus.com - std::queue](https://cplusplus.com/reference/queue/queue/)**
- **[C++ std::queue 用法與範例](https://shengyu7697.github.io/std-queue/)**
- **[【筆記】常用C++ STL：queue](https://notes.boshkuo.com/docs/C++/STL/vector#%E5%8F%96%E5%BE%97%E7%AC%AC-%EF%BD%89%E5%80%8B%E5%85%83%E7%B4%A0-vi)**

