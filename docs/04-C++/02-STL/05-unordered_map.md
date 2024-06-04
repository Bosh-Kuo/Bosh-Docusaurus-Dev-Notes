---
title: "C++ unordered_map(STL) 用法與範例"
sidebar_label: "[Container] unordered_map"
description: 這篇技術筆記將詳細探討 std::unordered_map 的用法，包括初始化、存取元素、插入和刪除元素等常見操作，並提供簡易的程式碼範例，協助讀者深入理解和熟練運用 unordered_map 容器。
last_update:
  date: 2024-04-28
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - unordered_map
  - hash table
  - hash map
tags:
  - Programming Language
  - C++
  - STL
---


在 C++ 標準模板庫（STL）中，**`unordered_map`** 和 **`map`** 都是用於儲存鍵值對的容器，但它們在內部資料結構、效能和適用情境上有顯著差異。

**unordered_map** 是基於**哈希表(hash table)** 實現的，它使用哈希函數將鍵映射到數據儲存的**桶(bucket)** 中，每個 **bucket** 可以儲存一個或多個元素。由於是基於 **hash table**，元素不會按照任何特定順序儲存。**unordered_map** 在平均情況下，插入、刪除和查找操作的時間複雜度為 O(1)，但在最壞情況下，如發生大量哈希碰撞，這些操作的時間複雜度可能退化到 **O(n)**。

相對地，**map** 通常基於**紅黑樹**實現，這是一種自平衡二元搜尋樹。**map** 儲存的元素按鍵的排序順序組織，使得元素始終處於排序狀態。因此，**map** 在插入、刪除和查找操作的時間複雜度穩定為 **O(log n)**。

## **初始化**

### **創建一個空的 unordered_map**

```cpp
#include <unordered_map>
using namespace std;

unordered_map<string, int> umap;
```

### **利用現有數組創建 unordered_map**

```cpp
#include <unordered_map>
#include <string>
using namespace std;

unordered_map<string, int> umap {
    {"apple", 2},
    {"banana", 3},
    {"orange", 4}
};
```


<br/>


## **操作**

### **插入元素：umap.insert()**

- 插入一個新的 key value pair，如果 key 已存在則操作無效。
- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：一個包含迭代器和布林值的 **pair\<iteraotr, bool>**。如果插入成功，布林值為 true；否則為 false。

```cpp
auto result = umap.insert(make_pair("cherry", 5));
if (result.second) {
    cout << "Insert successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```

### **刪除元素：umap.erase()**

- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：刪除的元素數量，通常是 0（無元素被刪除）或 1（成功刪除）。

```cpp
size_t numErased = umap.erase("banana");
cout << numErased << " elements erased." << endl;
```

### **查找元素：umap.find()**

- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：指向找到元素的迭代器，如果未找到則為 **umap.end()**。

```cpp
auto it = umap.find("apple");
if (it != umap.end()) {
    cout << "Found: " << it->first << " -> " << it->second << endl;
} else {
    cout << "Key not found." << endl;
}
```

### **查詢元素出現次數，可用於判斷元素是否存在：umap.count()**

- 因為 **unordered_map** 不允許重複的 key，所以此函數的返回值只能是 0 或 1。
- Time Complexity: 平均 O(1), 最壞 O(n)

```cpp
unordered_map<string, int> umap = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

cout << "Count for 'apple': " << umap.count("apple") << endl;  // 輸出 1
cout << "Count for 'orange': " << umap.count("orange") << endl;  // 輸出 0
```

### **訪問元素：umap.operator[]**

- 使用鍵來訪問對應的值，如果鍵不存在，則會插入一個新的元素並返回其引用。
- Time Complexity: 平均 O(1), 最壞 O(n)

```cpp
umap["orange"] = 10;
cout << "Value for 'orange': " << umap["orange"] << endl;
```

### **清空 unordered_map 中的所有元素：umap.clear()**

- 移除所有元素，清空容器。
- Time Complexity: O(n)

```cpp
umap.clear();
cout << "All elements cleared." << endl;
```

### **在容器內直接構造元素：umap.emplace()**

- 類似於 **`insert`**，但更高效，因為它直接在容器內構造元素，避免了額外的拷貝或移動操作。
- Time Complexity: 平均 O(1), 最壞 O(n)
- 返回值：與 **`insert()`** 相同，包含一個迭代器和一個表示是否插入的布林值的 **pair\<iterator\, bool>**。

```cpp
auto emplaceResult = umap.emplace("grape", 6);
if (emplaceResult.second) {
    cout << "Emplace successful" << endl;
} else {
    cout << "Element already exists" << endl;
}
```


<br/>


## **取值**

### **取得元素個數：umap.size()**

- Time Complexity: O(1)

```cpp
cout << "Number of elements in umap: " << umap.size() << endl;
```

### **檢查 unordered_map 是否為空：umap.empty()**

- Time Complexity: O(1)

```cpp
if (umap.empty()) {
    cout << "umap is empty." << endl;
} else {
    cout << "umap is not empty." << endl;
}
```


<br/>


## **迭代器**

### **使用迭代器遍歷 unordered_map**

- **unordered_map** 提供前向迭代器(Forward iterator) 來遍歷容器中的所有 key value pair。

```cpp
for (auto it = umap.begin(); it != umap.end(); ++it) {
    cout << "Key: " << it->first << ", Value: " << it->second << endl;
}
```


<br/>


## **Hash Policy**

### **獲取當前負載因子：umap.load_factor()**

- 返回當前負載因子，即 **size / bucket_count**，**bucket** 是 **hash table** 內部用來儲存數據的基本單位。每個 bucket 可以包含零個、一個或多個元素（key value pair），這取決於哈希函數和哈希碰撞的管理方法。
- Time Complexity: O(1)

```cpp
cout << "Current load factor: " << umap.load_factor() << endl;
```

### **獲取最大負載因子：umap.max_load_factor()**

- 返回或設置允許的最大負載因子，超過這個值將觸發自動 **rehash**。
- Time Complexity: O(1)

```cpp
cout << "Max load factor: " << umap.max_load_factor() << endl;
umap.max_load_factor(0.75);  // 設置最大負載因子
```

### **調整 bucket 的數量：umap.rehash()**

- 明確指定最小的 **bucket** 數量，可能會觸發 **rehash** 以滿足這一需求。
- Time Complexity: 平均 O(n), 最壞 O(n^2)

```cpp
umap.rehash(100);  // 設置至少有 100 個 bucket
```

### **預留空間以最小化 rehash：umap.reserve()**

- 提前預留空間以存放指定數量的元素，而不觸發 **rehash**。
- Time Complexity: 平均 O(n), 最壞 O(n^2)

```cpp
umap.reserve(100);  // 預留足夠空間以存放至少 100 個元素
```


<br/>


## **Reference**

- **[@cplusplus.com - std::unordered_map](https://cplusplus.com/reference/unordered_map/unordered_map/)**
- **[C++ std::unordered_map 用法與範例](https://shengyu7697.github.io/std-unordered_map/)**
- **[【筆記】常用C++ STL：map & unordered_map](https://yuihuang.com/cpp-stl-map/)**