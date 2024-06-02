---
title: "C++ unordered_set(STL) 用法與範例"
sidebar_label: "[Container] unordered_set"
description: 這篇技術筆記將詳細探討 std::unordered_set 的用法，包括初始化、存取元素、插入和刪除元素等常見操作，並提供簡易的程式碼範例，協助讀者深入理解和熟練運用 unordered_set 容器。
last_update:
  date: 2024-04-28
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - unordered_set
  - hash table
  - hash set
tags:
  - Programming Language
  - C++
  - STL
---


## **初始化**

### **創建一個空的 unordered_set**

```cpp
#include <unordered_set>
using namespace std;

unordered_set<int> uset;
```

### **利用現有數組創建 unordered_set**

```cpp
#include <unordered_set>
#include <vector>
using namespace std;

vector<int> vec = {10, 20, 30, 20};
unordered_set<int> uset(vec.begin(), vec.end());  // {10, 20, 30}
```

<br/>


## **操作**

### **插入元素：uset.insert()**

- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：一個包含迭代器和布林值的 **pair\<iterator, bool>**。如果插入成功，布林值為 true；否則為 false。

```cpp
auto result = uset.insert(40);
if (result.second) {
    cout << "Insert successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```

### **刪除元素：uset.erase()**

- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：刪除的元素數量，通常是 0（無元素被刪除）或 1（成功刪除）。

```cpp
size_t numErased = uset.erase(30);
cout << numErased << " elements erased." << endl;
```

### **清空集合：uset.clear()**

- 移除所有元素，清空容器。
- Time Complexity: O(n)

```cpp
uset.clear();
cout << "All elements cleared." << endl;
```

### **查找元素：uset.find()**

- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：指向找到元素的迭代器，如果未找到則為 **uset.end()**。

```cpp
auto it = uset.find(20);
if (it != uset.end()) {
    cout << "Found: " << *it << endl;
} else {
    cout << "Element not found." << endl;
}
```

### **查詢元素出現次數：uset.count()**

- 因為 **unordered_set** 不允許重複的元素，所以此函數的返回值只能是 0 或 1。
- Time Complexity: 平均 O(1), 最壞 O(n)

```cpp
unordered_set<int> uset = {10, 20, 30, 40, 50};

cout << "Count for 20: " << uset.count(20) << endl;  // 輸出 1
cout << "Count for 60: " << uset.count(60) << endl;  // 輸出 0
```

### **在容器內直接構造元素：uset.emplace()**

- 嘗試在 **unordered_set** 內直接構造元素，效率可能高於 **insert()**。
- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：與 **insert()** 相同，包含一個迭代器和一個表示是否插入的布林值的 **pair\<iterator\, bool>**。

```cpp
auto emplaceResult = uset.emplace(50);
if (emplaceResult.second) {
    cout << "Emplace successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```


<br/>


## **取值**

### **取得元素個數：uset.size()**

- Time Complexity: O(1)

```cpp
cout << "Number of elements in uset: " << uset.size() << endl;
```

### **檢查 unordered_set 是否為空：uset.empty()**

- Time Complexity: O(1)

```cpp
if (uset.empty()) {
    cout << "uset is empty." << endl;
} else {
    cout << "uset is not empty." << endl;
}
```

### **獲取最大可能元素數：uset.max_size()**

- 返回 **unordered_set** 可以達到的最大元素數量。
- Time Complexity: O(1)

```cpp
cout << "Maximum size of uset: " << uset.max_size() << endl;
```


<br/>


## **迭代器**

### **使用迭代器遍歷 unordered_set**

```cpp
for (auto it = uset.begin(); it != uset.end(); ++it) {
    cout << *it << " ";
}
cout << endl;
```


<br/>


## **Hash Policy**

### **獲取當前負載因子：uset.load_factor()**

- 返回當前負載因子，即 **size / bucket_count**
- Time Complexity: O(1)

```cpp
cout << "Current load factor: " << uset.load_factor() << endl;
```

### **獲取最大負載因子：uset.max_load_factor()**

- 返回或設置允許的最大負載因子，超過這個值將觸發自動 **rehash**。
- Time Complexity: O(1)

```cpp
cout << "Max load factor: " << uset.max_load_factor() << endl;
uset.max_load_factor(0.75);  // 設置最大負載因子
```

### **調整桶的數量：uset.rehash()**

- 明確指定最小的 **bucket** 數量，可能會觸發 **rehash** 以滿足這一需求。
- Time Complexity: 平均 O(n), 最壞 O(n^2)

```cpp
uset.rehash(100);  // 設置至少有 100 個 bucket
```

### **預留空間以最小化重哈希：uset.reserve()**

- 提前預留空間以存放指定數量的元素，而不觸發 **rehash**。
- Time Complexity: 平均 O(n), 最壞 O(n^2)

```cpp
uset.reserve(100);  // 預留足夠空間以存放至少 100 個元素
```


<br/>


## **Reference**

- **[@cpluspluse.com - std::unordered_set](https://cplusplus.com/reference/unordered_set/unordered_set/)**
- **[C++ std::unordered_set 用法與範例](https://shengyu7697.github.io/std-unordered_set/)**