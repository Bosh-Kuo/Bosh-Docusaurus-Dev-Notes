---
title: "C++ vector(STL) 用法與範例"
sidebar_label: "[Container] vector"
description: 這篇技術筆記將詳細探討 std::vector 的用法,包括宣告、初始化、存取元素、插入和刪除元素等常見操作，並提供簡易的程式碼範例，協助讀者深入理解和熟練運用 vector 容器。
last_update:
  date: 2024-04-21
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - vector
tags:
  - Programming Language
  - C++
  - STL
---

**`vector`** 是 C++ 標準模板庫（STL）中的一種動態陣列（dynamic array），能夠根據需要自動調整大小。與傳統陣列不同的是，**vector** 在建立時不需要預先指定大小，可以在執行期間動態新增或移除元素。

## **初始化**

### **以 \{value1, value2,…} 初始化**

- Time Complexity: O(n)

```cpp
#include <vector>
using namespace std;

vector<int> v = {1, 2, 3};
```

### **以特定元素個數初始化**

- Time Complexity: O(n)

```cpp
#include <vector>
using namespace std;

vector<int> v(5); // 初始化一個有5個元素的 vector，元素未賦初值
```

### **以特定元素個數帶有特定初始值初始化**

- Time Complexity: O(n)

```cpp
#include <vector>
using namespace std;

vector<int> v(5, 10); // 初始化一個有5個元素的 vector，每個元素的初始值為10

```

### **從其他 vector 初始化**

- Time Complexity: O(n)

```cpp
#include <vector>
using namespace std;

vector<int> original = {1, 2, 3, 4, 5};
vector<int> v(original.begin(), original.end()); // 透過拷貝 original vector 的方式初始化

```

### **初始化 size 為 (m, n) 的 2D vector**

- Time Complexity: O(m * n)

```cpp
#include <vector>
using namespace std;

vector<vector<int>> v(3, vector<int>(4, 0)); // 初始化一個3行4列的二維 vector，每個元素的初始值為0

```

<br/>


## **取值**

### **取得第 ｉ個元素: v[i]**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
cout << v[0] << "\n"; // 1
```

### **使用 .at() 方法安全取值: v.at(i)**

- Time Complexity: O(1)
- 檢查索引超出範圍會拋出 out_of_range 異常

```cpp
vector<int> v = {1, 2, 3};
cout << v.at(2); // 3
```

### **取得第一個元素: v.front()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
cout << v.front(); // 1
```

### **取得最後一個元素: v.back()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
cout << v.back(); // 3
```

### **取得數據指針: v.data()**

- Time Complexity: O(1)
- 提供直接訪問 vector 元素的指針

```cpp
vector<int> v = {1, 2, 3};
int* ptr = v.data();
cout << *ptr; // 1
```


<br/>


## **容量**

### **取得元素個數: v.size()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
cout << v.size(); // 3
```

### **檢查 vector 是否為空: v.empty()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
cout << v.empty(); // 0 (false)
```

### **取得 vector 的容量: v.capacity()**

- Time Complexity: O(1)
- 表示 vector 目前可存放的最大元素數量，可能大於 size()

```cpp
vector<int> v = {1, 2, 3};
cout << v.capacity(); // 可能是 3 或更大的數字
```

### **改變 vector 的大小: v.resize(n)**

- Time Complexity: O(n) if the new size is greater than the old size
- 重新設定 vector 的元素個數，多出的元素初始化為0

```cpp
vector<int> v = {1, 2, 3};
v.resize(5);
cout << v.size(); // 5
```

### **保證最小容量: v.reserve(n)**

- Time Complexity: O(n) if the new capacity is greater than the current capacity
- 確保 vector 至少可以存放 n 個元素，不影響 size()

```cpp
vector<int> v = {1, 2, 3};
v.reserve(10);
cout << v.capacity(); // 至少是 10
```


<br/>


## **修改**

### **將元素加到 vector 尾端: v.push_back()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
v.push_back(4); // {1, 2, 3, 4}
```

### **刪除 vector 尾端的元素: v.pop_back()**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3, 4};
v.pop_back(); // {1, 2, 3}
```

### **在 vector 中插入元素: v.insert(pos, val)**

- Time Complexity: O(n)
- `pos` 是指向 vector 中插入點的迭代器

```cpp
vector<int> v = {1, 2, 4};
v.insert(v.begin() + 2, 3); // {1, 2, 3, 4}
```

### **修改指定位置的元素: v[index] = value**

- Time Complexity: O(1)

```cpp
vector<int> v = {1, 2, 3};
v[1] = 5; // {1, 5, 3}
```

### **清空 vector 內的所有元素: v.clear()**

- Time Complexity: O(n)
- 清空 vector 中的所有元素，將 size 重設為 0，但不改變 capacity

```cpp
vector<int> v = {1, 2, 3};
v.clear(); // {}
```

### **使用 `erase()` 移除元素: v.erase(pos)**

- Time Complexity: O(n)
- `pos` 是指向 vector 中要刪除元素的迭代器

```cpp
vector<int> v = {1, 2, 3, 4};
v.erase(v.begin() + 1); // {1, 3, 4}
```

### **使用 `erase()` 範圍移除元素: v.erase(start, end)**

- Time Complexity: O(n)
- `start` 和 `end` 是指向 vector 中要刪除範圍的起始和結束迭代器

```cpp
vector<int> v = {1, 2, 3, 4, 5};
v.erase(v.begin() + 1, v.begin() + 3); // {1, 4, 5}
```

### **使用 `sort()` 排序**

- 使用 `<algorithm>` 中的 `sort()` 函數對 vector 進行排序。默認情況下，它對元素進行升序排序。
- Time Complexity: O(n log n)

```cpp
#include <algorithm>
#include <vector>
using namespace std;

vector<int> v = {30, 10, 20};
sort(v.begin(), v.end()); // 升序排序
```

### **使用自定義比較器排序**

- 可以提供自定義的比較函數來改變排序規則（如降序）。

```cpp
#include <algorithm>
#include <vector>
using namespace std;

vector<int> v = {30, 10, 20};
sort(v.begin(), v.end(), greater<int>()); // 降序排序
```

### **使用 `reverse()` 反轉**

- 使用 `<algorithm>` 頭文件中的 `reverse()` 函數來反轉 vector 中的元素。
- Time Complexity: O(n)

```cpp
#include <algorithm>
#include <vector>
using namespace std;

vector<int> v = {1, 2, 3};
reverse(v.begin(), v.end()); // {3, 2, 1}
```

### **使用迭代器取得特定範圍的 `Slice`**

- `Slice`不是 C++ 標準庫中的直接功能，但可以通過使用迭代器和構造函數實現。
- 擷取一部分元素以創建新的 vector。

```cpp
#include <vector>
using namespace std;

vector<int> v = {1, 2, 3, 4, 5};
vector<int> slice(v.begin() + 1, v.begin() + 4); // 從索引 1 到 3 的切片 {2, 3, 4}

```


<br/>


## **迭代器**

### **取得開始迭代器: v.begin()**

- 返回指向 vector 第一個元素的迭代器

```cpp
vector<int> v = {1, 2, 3};
auto it = v.begin(); // 指向 1
```

### **取得結束迭代器: v.end()**

- 返回指向 vector 最後一個元素之後的位置的迭代器，通常用於標示範圍的結束

```cpp
vector<int> v = {1, 2, 3};
auto it = v.end(); // 指向 3 之後的位置
```

### **使用迭代器遍歷 vector**

- 可以使用迭代器在 vector 中進行遍歷

```cpp
vector<int> v = {1, 2, 3};
for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " "; // 輸出 1 2 3
}
```

### **使用 `rbegin()` 和 `rend()` 獲得反向迭代器**

- `rbegin()` 返回指向 vector 最後一個元素的反向迭代器
- `rend()` 返回指向 vector 第一個元素之前的位置的反向迭代器

```cpp
cppCopy code
vector<int> v = {1, 2, 3};
for (auto rit = v.rbegin(); rit != v.rend(); ++rit) {
    cout << *rit << " "; // 輸出 3 2 1
}
```

### **使用迭代器修改元素**

- 迭代器不僅可以訪問元素，也可以修改它們

```cpp
cppCopy code
vector<int> v = {1, 2, 3};
auto it = v.begin();
*it = 4; // 將第一個元素修改為 4
cout << v[0]; // 輸出 4

```


<br/>


## **Reference**

- **[【筆記】常用C++ STL：vector](https://yuihuang.com/cpp-stl-vector/)**
- [**C++ std::vector 用法與範例**](https://shengyu7697.github.io/std-vector/)
- **[EECS 311: STL Containers](https://courses.cs.northwestern.edu/311/html/stl-summary.html)**