---
title: "C++ map(STL) 用法與範例"
sidebar_label: "[Container] map"
description: 這篇技術筆記將詳細探討 std::map 的用法，包括初始化、存取元素、插入和刪除元素等常見操作，並提供簡易的程式碼範例，協助讀者深入理解和熟練運用 unordered_map 容器。
last_update:
  date: 2024-06-01
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - map
  - hash table
  - hash map
tags:
  - Programming Language
  - C++
  - STL
---

在 C++ 標準模板庫（STL）中，**`map`** 是一種有序的關聯容器，用於儲存鍵值對。它基於**紅黑樹（自平衡二元搜尋樹）**實現，因此元素總是按照鍵的排序順序組織。在大多數操作中，**map** 的時間複雜度為 **O(log n)**。以下是 **map** 的詳細介紹，包括初始化、操作、取值和迭代器的使用方法。

## **初始化**

### **創建一個空的 map**

```cpp
#include <map>
using namespace std;

map<string, int> omap;
```

### **利用現有數組創建 map**

```cpp
#include <map>
#include <string>
using namespace std;

map<string, int> omap {
    {"apple", 2},
    {"banana", 3},
    {"orange", 4}
};
```

## **操作**

### **插入元素：omap.insert()**

- 插入一個新的鍵值對，如果鍵已存在則操作無效。
- 時間複雜度：O(log n)
- 返回值：一個包含迭代器和布林值的 **pair\<iterator, bool>**。如果插入成功，布林值為 true；否則為 false。

```cpp
auto result = omap.insert(make_pair("cherry", 5));
if (result.second) {
    cout << "Insert successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```

### **刪除元素：omap.erase()**

- 時間複雜度：O(log n)
- 返回值：刪除的元素數量，通常是 0（無元素被刪除）或 1（成功刪除）。

```cpp
size_t numErased = omap.erase("banana");
cout << numErased << " elements erased." << endl;
```

### **查找元素：omap.find()**

- 時間複雜度：O(log n)
- 返回值：指向找到元素的迭代器，如果未找到則為 **omap.end()**。

```cpp
auto it = omap.find("apple");
if (it != omap.end()) {
    cout << "Found: " << it->first << " -> " << it->second << endl;
} else {
    cout << "Key not found." << endl;
}
```

### **查詢元素出現次數：omap.count()**

- 因為 **map** 不允許重複的鍵，所以此函數的返回值只能是 0 或 1。
- 時間複雜度：O(log n)

```cpp
cout << "Count for 'apple': " << omap.count("apple") << endl;  // 輸出 1
cout << "Count for 'orange': " << omap.count("orange") << endl;  // 輸出 0
```

### **訪問元素：omap.operator[]**

- 使用鍵來訪問對應的值，如果鍵不存在，則會插入一個新的元素並返回其引用。
- 時間複雜度：O(log n)

```cpp
omap["orange"] = 10;
cout << "Value for 'orange': " << omap["orange"] << endl;
```

### **清空 map 中的所有元素：omap.clear()**

- 移除所有元素，清空容器。
- 時間複雜度：O(n)

```cpp
omap.clear();
cout << "All elements cleared." << endl;
```

### **在容器內直接構造元素：omap.emplace()**

- 類似於 **`insert`**，但更高效，因為它直接在容器內構造元素，避免了額外的拷貝或移動操作。
- 時間複雜度：O(log n)
- 返回值：與 **`insert()`** 相同，包含一個迭代器和一個表示是否插入的布林值的 **pair\<iterator, bool>**。

```cpp
auto emplaceResult = omap.emplace("grape", 6);
if (emplaceResult.second) {
    cout << "Emplace successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```

## **取值**

### **取得元素個數：omap.size()**

- 時間複雜度：O(1)

```cpp
cout << "Number of elements in omap: " << omap.size() << endl;
```

### **檢查 map 是否為空：omap.empty()**

- 時間複雜度：O(1)

```cpp
if (omap.empty()) {
    cout << "omap is empty." << endl;
} else {
    cout << "omap is not empty." << endl;
}
```

## **迭代器**

### **使用順向迭代器遍歷 map**

- **map** 提供雙向迭代器（Bidirectional iterator）來遍歷容器中的所有鍵值對。

```cpp
for (auto it = omap.begin(); it != omap.end(); ++it) {
    cout << "Key: " << it->first << ", Value: " << it->second << endl;
}
```

### **使用反向迭代器遍歷 map**

- **map** 提供反向迭代器來逆序遍歷容器中的所有鍵值對。

```cpp
for (auto rit = omap.rbegin(); rit != omap.rend(); ++rit) {
    cout << "Key: " << rit->first << ", Value: " << rit->second << endl;
}

```

## **Reference**

- [**@cplusplus.com - std::map**](https://cplusplus.com/reference/map/map/)
- [**C++ std::map 用法與範例**](https://cplusplus.com/reference/map/map/)