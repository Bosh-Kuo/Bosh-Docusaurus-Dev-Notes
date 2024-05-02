---
title: "C++ stack(STL) 用法與範例"
sidebar_label: "[Adaptor] stack"
description: 本篇筆記簡單介紹 C++ 標準模板庫中的 stack 容器，包括其後進先出 (LIFO) 的資料結構特性。本文將提供多個示例，包含入堆、出堆等操作方法。
last_update:
  date: 2024-04-21
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - stack
tags:
  - Programming Language
  - C++
  - STL
---

**`stack`** 是 C++ 標準模板庫（STL） 中的 一種容器適配器(Container Adaptor)，是一個後進先出（**LIFO**, Last-In-First-Out）的資料結構，它只允許在`頂部`添加元素和刪除元素。

## **操作**

### **在頂部加入元素：s.push()**

- Time Complexity: O(1)

```cpp
#include <stack>
using namespace std;

stack<int> s;
s.push(10); // stack 中現有 {10}
s.push(20); // stack 中現有 {10, 20}
s.push(30); // stack 中現有 {10, 20, 30}
```

### **移除頂部元素：s.pop()**

- Time Complexity: O(1)

```cpp
stack<int> s;
s.push(10);
s.push(20);
s.push(30);
s.pop(); // 移除 30，堆疊中現有 {10, 20}
```

### **清空堆疊中的所有元素：s.swap()**

- 雖然 **stack** 沒有直接的 `clear()` 函數，但可以通過對空的 **stack** 使用 `swap()` 方法達到清空的效果。
- Time Complexity: O(1)

```cpp
#include <stack>
using namespace std;

stack<int> s;
s.push(10);
s.push(20);
s.push(30);
stack<int> emptyStack; // 創建一個空的 stack
s.swap(emptyStack); // 現在 s 是空的，所有元素都在 emptyStack 中
```


<br/>


## **取值**

### **獲取頂部元素：s.top()**
- Time Complexity: O(1)

```cpp
stack<int> s;
s.push(10);
s.push(20);
cout << s.top(); // 輸出 20
```

### **取得元素個數：s.size()**
- Time Complexity: O(1)

```cpp
stack<int> s;
s.push(10);
s.push(20);
s.push(30);
cout << s.size(); // 輸出 3
```

### **檢查堆疊是否為空：s.empty()**
- Time Complexity: O(1)

```cpp
stack<int> s;
cout << s.empty(); // true，因為堆疊是空的
s.push(10);
cout << s.empty(); // false，因為堆疊現在有元素
```


<br/>


## **Reference**

- **[@cplusplus.com - std::stack](https://cplusplus.com/reference/stack/stack/)**
- **[C++ std::stack 用法與範例](https://shengyu7697.github.io/std-stack/)**
- **[【筆記】常用C++ STL：stack](https://yuihuang.com/cpp-stl-stack/)**