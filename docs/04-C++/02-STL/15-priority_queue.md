---
title: "C++ priority_queue(STL) 用法與範例"
sidebar_label: "[Adaptor] priority_queue"
description: 這篇技術筆記將深入探討 std::priority_queue 的用法與原理，本文將說明如何使用 std::priority_queue 來建立和操作 priority_queue，包括宣告、初始化、插入元素、取出元素等常見操作。此外，本文也將介紹 std::priority_queue 的一些進階用法，例如自訂元素比較方式等。本文提供簡易的程式碼範例，協助讀者深入理解和熟練運用 priority_queue。
last_update:
  date: 2024-05-12
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Iterator
  - Adaptor
  - priority queue
tags:
  - Programming Language
  - C++
  - STL
---

**`priority_queue`** 是 C++ 標準模板庫（STL）中的一種容器適配器(Adaptor)，它提供了 **queue** 的部分功能，並自動依據元素的**優先權(priority)**排序。不同於普通隊列先進先出的規則，**priority_queue** 中的元素是自動按照某種排序準則(默認為由大到小)組織的。每次從 **priority_queue** 取出一個元素時，將取出目前最高優先權的元素。**priority_queue** 通常以 **`heap`** 的形式實作，這種資料結構可以高效地插入和刪除元素，時間複雜度為O(log n)。

## **初始化**

### **創建一個空的 max heap**

- Time Complexity: O(1)
- 在 C++ 中，使用 `priority_queue` 來實現 `heap` 資料結構。默認情況下，這會創建一個 max heap。

```cpp
#include <queue>
using namespace std;

priority_queue<int> maxHeap;
```

### **利用現有 vector 創建 max heap**

- Time Complexity: O(n)

```cpp
#include <queue>
#include <vector>
using namespace std;

vector<int> nums = {10, 20, 30, 5, 15};
priority_queue<int> maxHeap(nums.begin(), nums.end());
```

### **使用自定義比較器建立 max heap**

**1. 使用 struct 建立 Comparator 的寫法：**
當使用 struct 定義比較器時，需要創建一個含有 **operator()** 的結構，這個運算子需要接受兩個同類型的參數並返回一個 bool 值，用以表明第一個參數是否應該排在第二個參數之後。
```cpp
#include <queue>
using namespace std;

// 定義一個比較結構，用於 maxHeap
struct MaxHeapComparator {
    bool operator()(int lhs, int rhs) {
        return lhs < rhs; // 較大的元素應排前面，所以當左元素小於右元素時返回 true
    }
};

priority_queue<int, vector<int>, MaxHeapComparator> maxHeap;
```

**2. 使用 lambda 函數的寫法：**
使用 **lambda 函數**進行比較是一種更靈活且簡潔的方法，特別是當比較邏輯較為簡單或僅在局部場景中使用時。
```cpp
#include <queue>
#include <vector>
using namespace std;

// 定義一個比較結構，用於 maxHeap
auto comparator = [](int lhs, int rhs) { return lhs < rhs; };  // 較大元素優先
std::priority_queue<int, std::vector<int>, decltype(comparator)> maxHeap(comparator);
```

:::tip
**decltype** 是一個關鍵字，用於查詢表達式的類型而不進行計算表達式的值，對於需要根據表達式的類型來聲明變數非常有用，尤其在模板和類型推導中非常常見。基本用法如下：

```cpp
int x = 5;
decltype(x) y = 10; // y 的類型被推導為 int

```
:::

:::tip
**Lambda** 表達式是一種簡便的定義匿名（無名稱的）函數的方法，常用於需要臨時函數的場景，，如算法的自定義排序函數或執行小範圍內的操作。Lambda 表達式的基本語法如下：
```cpp
[捕獲列表](參數列表) -> 返回類型 {
    函數體
}
```
- 捕獲列表：定義哪些外部變數被這個 lambda 捕獲（使用），以及是通過值還是引用捕獲。
- 參數列表：和普通函數的參數列表類似。
- 返回類型：可以顯式指定，也可以讓編譯器自動推導。
- 函數體：實際的執行的邏輯。
:::

### **創建 min heap**

- Time Complexity: O(1)

```cpp
#include <queue>
#include <vector>
using namespace std;

priority_queue<int, vector<int>, greater<int>> minHeap;
```

### **利用現有 vector 創建 min heap**

- Time Complexity: O(n)

```cpp
#include <queue>
#include <vector>
using namespace std;

vector<int> nums = {10, 20, 30, 5, 15};
priority_queue<int, vector<int>, greater<int>> minHeap(nums.begin(), nums.end());
```

### **使用自定義比較器建立 min heap**
**1. 使用 struct 建立 Comparator 的寫法：**
由於回傳的 bool 值用以表明第一個參數是否應該排在第二個參數之後。對於 min heap 來說較小的值應排在前面，因此判斷邏輯與 max heap 相反
```cpp
#include <queue>
#include <vector>
using namespace std;

// 定義一個比較結構，用於 minHeap
struct MinHeapComparator {
    bool operator()(int lhs, int rhs) {
        return lhs > rhs; // 較小的元素應排前面，所以當左元素小於右元素時返回 true
    }
};

priority_queue<int, vector<int>, MinHeapComparator> minHeap;
```

**2. 使用 lambda 函數的寫法：**
```cpp
#include <queue>
#include <vector>
using namespace std;

// 定義一個比較結構，用於 maxHeap
auto comparator = [](int lhs, int rhs) { return lhs > rhs; };  // 較小元素優先
std::priority_queue<int, std::vector<int>, decltype(comparator)> minHeap(comparator);
```


<br/>


## **取值**

### **取得最大或最小元素: v.top()**

- Time Complexity: O(1)
- 獲取 max heap 的最大值或 min heap 的最小值，但不移除該元素。

```cpp
#include <queue>using namespace std;

priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(20);
maxHeap.push(30);
cout << maxHeap.top(); // 30

priority_queue<int, vector<int>, greater<int>> minHeap;
minHeap.push(10);
minHeap.push(20);
minHeap.push(30);
cout << minHeap.top(); // 10
```

### **取得元素個數: v.size()**

- Time Complexity: O(1)
- 返回 heap 中的元素數量。

```cpp
priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(20);
maxHeap.push(30);
cout << maxHeap.size(); // 3
```

### **檢查 heap 是否為空: v.empty()**

- Time Complexity: O(1)
- 返回一個布林值，指示 heap 是否為空。

```cpp
priority_queue<int> maxHeap;
cout << maxHeap.empty(); // true
maxHeap.push(10);
cout << maxHeap.empty(); // false
```

## **修改**

### **將元素加到 heap 尾端: v.push()**

- Time Complexity: O(log n)
- 將元素添加到 heap 中，並自動進行調整以維持 heap 的特性。

```cpp
#include <queue>
using namespace std;

priority_queue<int> maxHeap;
maxHeap.push(20);
maxHeap.push(30);
maxHeap.push(10);
cout << maxHeap.top(); // 30
```

### **刪除最大或最小元素: v.pop()**

- Time Complexity: O(log n)
- 移除 heap 頂部的元素（max heap 的最大元素或 min heap 的最小元素），並重新調整 heap 以維持其特性。

```cpp
priority_queue<int> maxHeap;
maxHeap.push(30);
maxHeap.push(20);
maxHeap.push(10);
maxHeap.pop(); // 移除30
cout << maxHeap.top(); // 20
```

### **清空 heap 中的所有元素: v.clear()**

- Time Complexity: O(n)
- 移除 heap 中的所有元素，這不是 `priority_queue` 的標準成員函數。在實際應用中，如果需要清空一個 `priority_queue`，你可能需要手動地移除所有元素或者簡單地重新實例化一個新的 `priority_queue`。

```cpp
priority_queue<int> maxHeap;
maxHeap.push(30);
maxHeap.push(20);
// 重新實例化一個新的空 priority_queue
priority_queue<int> emptyHeap;
maxHeap = emptyHeap;
cout << maxHeap.empty(); // true
```


<br/>


## **Reference**

- **[【筆記】常用C++ STL：priority_queue](https://yuihuang.com/cpp-stl-priority-queue/)**
- **[Priority Queue in C++ Standard Template Library (STL)](https://www.geeksforgeeks.org/priority-queue-in-cpp-stl/)**