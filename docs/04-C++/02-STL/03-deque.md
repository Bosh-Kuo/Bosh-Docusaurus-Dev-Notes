---
title: "C++ deque(STL) 用法與範例"
sidebar_label: "[Container] deque"
description: 這篇技術筆記將詳細探討 std::deque 的用法，包括初始化、存取元素、插入和刪除元素等常見操作，並提供簡易的程式碼範例，協助讀者深入理解和熟練運用 deque 容器。
last_update:
  date: 2024-04-28
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - deque
  - dequeue
tags:
  - Programming Language
  - C++
  - STL
---

**`deque`** 是 C++ 標準模板庫（STL）中的一種具有動態大小的序列容器(Sequence Container)，與 `queue` 不同的是， **deque** 允許在其兩端快速插入和刪除元素，且支持通過隨機訪問迭代器直接訪問個別元素。

**deque** 提供了類似於 **vector** 的功能與介面，然而，與 **vector**不同的是，**deque** 不保證所有元素都存儲在連續的存儲位置中：通過偏移指向另一元素的指針來訪問 **deque** 中的元素可能會導致未定義行為。


## **初始化**

### **創建一個空的 `deque`**

```cpp
#include <deque>
using namespace std;

deque<int> dq;
```

### **利用現有數組創建 `deque`**

```cpp
#include <deque>
#include <vector>
using namespace std;

vector<int> vec = {10, 20, 30};
deque<int> dq(vec.begin(), vec.end());  // {10, 20, 30}
```


<br/>


## **取值**

### **獲取前端元素：dq.front()**

- Time Complexity: O(1)

```cpp
deque<int> dq = {10, 20, 30};
cout << dq.front(); // 輸出 10
```

### **獲取後端元素：dq.back()**

- Time Complexity: O(1)

```cpp
deque<int> dq = {10, 20, 30};
cout << dq.back(); // 輸出 30
```


<br/>


## **容量**

### **檢查是否為空：dq.empty()**

- Time Complexity: O(1)

```cpp
deque<int> dq;
cout << dq.empty(); // true
dq.push_back(10);
cout << dq.empty(); // false
```

### **取得元素個數：dq.size()**

- 返回 **deque** 中的元素數量。
- Time Complexity: O(1)

```cpp
deque<int> dq = {10, 20, 30};
cout << dq.size(); // 輸出 3
```

### **調整容量：dq.resize()**

- 調整 **deque** 的大小，多餘或缺少的元素將被刪除或以默認值補齊。
- Time Complexity: O(n)

```cpp
deque<int> dq = {10, 20, 30};
dq.resize(5);  // 大小調整為 5，新元素為 0
dq.resize(2);  // 大小調整為 2，刪除多餘元素
```

### **獲取最大可能容量：dq.max_size()**

- 返回 **deque** 可以達到的最大容量。
- Time Complexity: O(1)

```cpp
deque<int> dq;
cout << dq.max_size();  // 顯示最大容量，此值依實現而異
```


<br/>


## **操作**

### **在前端添加元素：dq.push_front()**

- Time Complexity: O(1)

```cpp
deque<int> dq;
dq.push_front(10); // {10}
dq.push_front(20); // {20, 10}
```

### **在後端添加元素：dq.push_back()**

- Time Complexity: O(1)

```cpp
deque<int> dq;
dq.push_back(30); // {30}
dq.push_back(40); // {30, 40}
```

### **在前端移除元素：dq.pop_front()**

- Time Complexity: O(1)

```cpp
deque<int> dq = {10, 20, 30};
dq.pop_front(); // 移除 10，剩餘 {20, 30}
```

### **在後端移除元素：dq.pop_back()**

- Time Complexity: O(1)

```cpp
deque<int> dq = {10, 20, 30};
dq.pop_back(); // 移除 30，剩餘 {10, 20}
```

### **在任意位置插入元素: dq.insert()**

- Time Complexity: O(n)

```cpp
deque<int> dq = {10, 20, 30};
dq.insert(dq.begin() + 1, 15); // 插入 15 在位置 1，{10, 15, 20, 30}
```

### **在任意位置移除元素: dq.erase()**

- Time Complexity: O(n)

```cpp
deque<int> dq = {10, 20, 30};
dq.erase(dq.begin() + 2); // 移除位置 2 的元素，{10, 20}
```

### **清空所有元素：dq.clear()**

```cpp
deque<int> dq = {10, 20, 30, 40};
dq.clear(); // 清空 deque，現在 dq 為空
cout << "Size after clear: " << dq.size(); // 輸出 Size after clear: 0
```


<br/>


## **迭代器**

### **使用迭代器遍歷所有元素**

```cpp
deque<int> dq = {10, 20, 30, 40};
for (auto it = dq.begin(); it != dq.end(); ++it) {
    cout << *it << " "; // 輸出 10 20 30 40
}
```

### **使用反向迭代器遍歷所有元素**

```cpp
deque<int> dq = {10, 20, 30, 40};
for (auto rit = dq.rbegin(); rit != dq.rend(); ++rit) {
    cout << *rit << " "; // 輸出 40 30 20 10
}
```


<br/>


## **Reference**

- **[@cplusplus.com - std::deque](https://cplusplus.com/reference/deque/deque/)**
- **[C++ std::deque 用法與範例](https://shengyu7697.github.io/std-deque/)**