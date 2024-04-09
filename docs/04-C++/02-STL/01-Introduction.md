---
title: "走進 STL：快速導覽 C++ 標準模板庫的核心要素"
sidebar_label: "STL introduction"
description: 本篇技術筆記將快速帶領讀者瞭解 STL 的基本結構和功能，包括容器、迭代器、算法、仿函數和適配器等元素。本文以 C++ 程式設計初學者的角度歸納了 STL 的重點與並附上相關連結，旨在幫助初學者快速瞭解 STL 的基礎知識。
last_update:
  date: 2024-04-10
keywords:
  - Programming Language
  - C++
  - STL
  - Container
  - Algorithms
  - Iterator
  - Functor
  - Adaptor
tags:
  - Programming Language
  - C++
  - STL
---

## **STL 是什麼？**

`STL(Standard Template Library)` 是 C++ 程式設計語言中一個非常重要和強大的函式庫，它提供了一系列資料結構，如向量(vector)、列表(list)和雜湊表(map)，以及搜尋、排序等演算法和通用函式，可用於大幅簡化 C++ 程式開發。 STL 遵循**泛型程式設計(Generic Programming)**的理念， 基於**模板(Template)**來實作各種資料結構與演算法，這使得 STL 可以處理任何符合特定需求的資料類型，而不局限於特定的類型。這種泛型性增加了 STL 的可重用性和靈活性。

STL 的核心主要由以下幾大組建所組成：

- **容器 Container**
- **演算法 Algorithms**
- **迭代器 Iterator**
- **仿函數 Functor**
- **適配器 Adaptor**


<br/>


## **容器 Container**

`容器(Container)`是 STL 中用於存放資料的資料結構類別模板，每種容器都提供了特定資料結構的功能。

### **容器類型**

STL 提供了以下幾種類型的容器：

- **序列容器（Sequence Containers）**
    - **[vector](https://cplusplus.com/reference/vector/vector/)**：表示可動態調整大小的陣列。支持快速隨機存取，但在中間插入或刪除元素可能會比較慢。
    - **[deque](https://cplusplus.com/reference/deque/deque/)**：和 `vector` 相似，但設計上支持在頭部和尾部高效插入和刪除。
    - **[list](https://cplusplus.com/reference/list/list/)**：雙向鏈表，支持在任何位置快速插入和刪除，但不支持快速隨機存取。
    - **[forward_list](https://cplusplus.com/reference/forward_list/forward_list/)**：僅支持向前遍歷的鏈表，相比 `list` 更節省空間。
- **關聯容器（Associative Containers）**
    - **[set](https://cplusplus.com/reference/set/set/)**：基於紅黑樹實現的集合，元素唯一，自動排序。
    - **[multiset](https://cplusplus.com/reference/set/multiset/)**：與 `set` 相似，但元素可以重複。
    - **[map](https://cplusplus.com/reference/map/map/)**：鍵-值對的集合，其中的鍵唯一，基於紅黑樹。
    - **[multimap](https://cplusplus.com/reference/map/multimap/)**：與 `map` 相似，但一個鍵可以關聯多個值。
- **無序關聯容器（Unordered Associative Containers）**
    - **[unordered_set](https://cplusplus.com/reference/unordered_set/unordered_set/)**：基於哈希表的集合，元素唯一，不自動排序，提供快速查找。
    - **[unordered_multiset](https://cplusplus.com/reference/unordered_set/unordered_multiset/)**：與 `unordered_set` 相似，但元素可以重複。
    - **[unordered_map](https://cplusplus.com/reference/unordered_map/unordered_map/)**：基於哈希表的鍵-值對集合，提供快速查找。
    - **[unordered_multimap](https://cplusplus.com/reference/unordered_map/unordered_multimap/)**：與 `unordered_map` 相似，但一個鍵可以關聯多個值。

### **容器操作方法**

所有 STL 容器都提供了一些共通的操作，如：

- **size()**：返回容器中元素的數量。
- **empty()**：判斷容器是否為空。
- **insert()**：插入元素到容器中。
- **erase()**：刪除容器中的元素。
- **clear()**：移除容器中所有元素。

### **如何使用容器**

STL 容器的使用方式非常簡單。要使用 STL 容器，我們首先需要包含 STL 標頭檔。例如，要使用向量資料結構，我們需要包含以下標頭檔：

```cpp
#include <vector>
```

包含標頭檔後，我們就可以使用 STL 中提供的資料結構、演算法和函式。例如，以下程式碼使用向量資料結構來存放一組整數：

```cpp
#include <vector>

int main() {
  std::vector<int> numbers = {1, 5, 3, 4, 3};

  // 迭代器
  for (auto it = numbers.begin(); it != numbers.end(); ++it) {
    std::cout << *it << " ";
  }

  // 演算法
  std::sort(numbers.begin(), numbers.end());

  // 函式
  std::cout << std::count(numbers.begin(), numbers.end(), 3) << std::endl;

  return 0;
}

// 1 5 3 4 3
// 1 3 3 4 5
// 2
```


<br/>


## **迭代器 Iterator**

`迭代器(Iterator)`在 STL 中是一種可以用於訪問、遍歷和操作容器中元素的物件。迭代器是一種廣義的指針，大多數的時候，我們可以把它視為指向容器中元素的普通指針來使用，但它具有比普通指針更強大的功能。

以下整理迭代器的幾個特點：

- 可以指向容器中的元素。
- 可以遞增或遞減，以訪問序列中的相鄰元素。
- 可以比較兩個迭代器，以確定它們指向的元素的位置。
- 可以用於將各種 STL 算法套用在 STL 容器上，例如 `std::sort` 和 `std::find`。

### **標準容器迭代器的運算符**

以下是一些常見的標準容器迭代器運算符：

- `*iter` : 解引用迭代器，獲取其指向的元素的值。
- `iter->member`: 如果迭代器指向的是結構體或類型的物件，則可以使用此運算符訪問其成員。
- `iter++ or ++iter`: 將迭代器遞增，指向序列中的下一個元素。
- `iter-- or —-iter`: 將迭代器遞減，指向序列中的前一個元素(僅限雙向和隨機存取迭代器)。
- `iter1 - iter2 or iter1 + iter2`: 對迭代器進行算術運算，返回距離(僅限隨機存取迭代器)。
- `iter1 == iter2`: 比較兩個迭代器，確定它們是否指向相同的元素。
- `iter1 != iter2`: 比較兩個迭代器，確定它們是否指向不同的元素。

### **迭代器類型**

STL 提供了五種基本的迭代器類型：

| 迭代器類型                        | 迭代器功能                               | 範例                               |
| --------------------------------- | ---------------------------------------- | ---------------------------------- |
| 輸入迭代器 Input iterator         | 允許讀取序列中的元素，只能單向移動。     | istream                            |
| 輸出迭代器 Output iterator        | 允許寫入序列中的元素，也只能單向移動。   | ostream, inserter                  |
| 前向迭代器 Forward iterator       | 支持單向訪問和修改                       | forward_list                       |
| 雙向迭代器 Bidirectional iterator | 除了前向迭代器的功能外，還可以向後移動。 | list, set, multiset, map, multimap |
| 隨機迭代器 Random access iterator | 提供直接訪問任意元素的能力，功能最強。   | vector, deque, array, string       |

### **其他迭代器**

除了基本的迭代器類型外，STL 也提供了一些特殊用途的迭代器：

| 迭代器類型                  | 迭代器功能                                   | 範例                                    |
| --------------------------- | -------------------------------------------- | --------------------------------------- |
| 逆向迭代器 Reverse iterator | 允許以相反的順序遍歷容器。                   | vector, list, deque                     |
| 插入迭代器 Insert iterator  | 專為在容器中插入元素而設計，不進行元素訪問。 | inserter, back_inserter, front_inserter |
| 流迭代器 Stream iterator    | 用於從流中讀寫數據。                         | istream_iterator, ostream_iterator      |
| 移動迭代器 Move iterator    | 允許元素的移動而非複製，用於優化性能。       | make_move_iterator                      |

### **使用範例**

下面提供一個使用迭代器的範例遍歷與操作容器元素的範例:

```cpp
#include <vector>
#include <list>
#include <iostream>
#include <iterator> // 為了使用 inserter 和 fill_n

using namespace std;

int main() {
    // 遍歷vector
    vector<int> v = {1, 2, 3, 4, 5};
    for(auto it = v.begin(); it != v.end(); ++it) {
        cout << *it << " "; // 輸出: 1 2 3 4 5
    }
    cout << endl;

    // 反向遍歷
    for(auto rit = v.rbegin(); rit != v.rend(); ++rit) {
        cout << *rit << " "; // 輸出: 5 4 3 2 1
    }
    cout << endl;

    // 修改list中的元素
    list<string> lst = {"apple", "banana", "orange"};
    auto it = lst.begin();
    *it = "pear"; // lst變為 {"pear", "banana", "orange"}

    // 使用inserter插入元素
    vector<int> v2;
    fill_n(inserter(v2, v2.begin()), 5, 100); // v2變為{100, 100, 100, 100, 100}

    return 0;
}
```


<br/>


## **演算法 Algorithms**

STL 提供了豐富的演算法函數,能夠在各種容器上執行不同的操作。這些演算法函數定義在 `<algorithm>` 和 `<numeric>` 標頭檔案中。

根據功能，演算法大致上可以分為以下幾類：

### **非變動序列操作**

這些演算法不會修改操作對象,通常用於查詢或條件測試。



| 演算法                                                          | 功能                                     | 範例                                                 | 時間複雜度 |
| --------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- | ---------- |
| [all_of](https://cplusplus.com/reference/algorithm/all_of/)     | 檢查範圍內的所有元素是否都滿足某個條件   | all_of(v.begin(), v.end(), pred)                     | O(n)       |
| [any_of](https://cplusplus.com/reference/algorithm/any_of/)     | 檢查範圍內是否至少有一個元素滿足某個條件 | any_of(v.begin(), v.end(), pred)                     | O(n)       |
| [none_of](https://cplusplus.com/reference/algorithm/none_of/)   | 檢查範圍內是否沒有元素滿足某個條件       | none_of(v.begin(), v.end(), pred)                    | O(n)       |
| [find](https://cplusplus.com/reference/algorithm/find/)         | 在範圍內尋找第一個等於特定值的元素       | find(v.begin(), v.end(), value)                      | O(n)       |
| [find_if](https://cplusplus.com/reference/algorithm/find_if/)   | 在範圍內尋找第一個滿足條件的元素         | find_if(v.begin(), v.end(), pred)                    | O(n)       |
| [count](https://cplusplus.com/reference/algorithm/count/)       | 計算範圍內等於特定值的元素數量           | count(v.begin(), v.end(), value)                     | O(n)       |
| [count_if](https://cplusplus.com/reference/algorithm/count_if/) | 計算範圍內滿足某個條件的元素數量         | count_if(v.begin(), v.end(), pred)                   | O(n)       |
| [equal](https://cplusplus.com/reference/algorithm/equal/)       | 檢查兩個範圍內的元素是否全部相等         | equal(v1.begin(), v1.end(), v2.begin())              | O(n)       |
| [search](https://cplusplus.com/reference/algorithm/search/)     | 在範圍內尋找第一次出現的另一個範圍的序列 | search(v.begin(), v.end(), subv.begin(), subv.end()) | O(n*m)     |

### **變動序列操作**

這些演算法會修改操作對象。

| 演算法                                                                      | 功能                               | 範例                                            | 時間複雜度 |
| --------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------- | ---------- |
| [copy](https://cplusplus.com/reference/algorithm/copy/)                     | 複製範圍內的元素到另一範圍         | copy(v.begin(), v.end(), dest.begin())          | O(n)       |
| [copy_n](https://cplusplus.com/reference/algorithm/copy_n/)                 | 複製指定數量的元素到另一範圍       | copy_n(v.begin(), n, dest.begin())              | O(n)       |
| [copy_if](https://cplusplus.com/reference/algorithm/copy_if/)               | 根據條件複製元素到另一範圍         | copy_if(v.begin(), v.end(), dest.begin(), pred) | O(n)       |
| [copy_backward](https://cplusplus.com/reference/algorithm/copy_backward/)   | 反向複製元素到另一範圍             | copy_backward(v.begin(), v.end(), dest.end())   | O(n)       |
| [move](https://cplusplus.com/reference/algorithm/move/)                     | 移動範圍內的元素到另一範圍         | move(v.begin(), v.end(), dest.begin())          | O(n)       |
| [move_backward](https://cplusplus.com/reference/algorithm/move_backward/)   | 反向移動元素到另一範圍             | move_backward(v.begin(), v.end(), dest.end())   | O(n)       |
| [swap](https://cplusplus.com/reference/algorithm/swap/)                     | 交換兩個元素的值                   | swap(a, b)                                      | O(1)       |
| [transform](https://cplusplus.com/reference/algorithm/transform/)           | 將範圍內的元素轉換後存儲到另一範圍 | transform(v.begin(), v.end(), dest.begin(), op) | O(n)       |
| [remove](https://cplusplus.com/reference/algorithm/remove/)                 | 移除等於特定值的所有元素           | remove(v.begin(), v.end(), value)               | O(n)       |
| [remove_if](https://cplusplus.com/reference/algorithm/remove_if/)           | 移除滿足條件的所有元素             | remove_if(v.begin(), v.end(), pred)             | O(n)       |
| [fill](https://cplusplus.com/reference/algorithm/fill/)                     | 將範圍內的所有元素設置為特定值     | fill(v.begin(), v.end(), value)                 | O(n)       |
| [fill_n](https://cplusplus.com/reference/algorithm/fill_n/)                 | 將指定數量的元素設置為特定值       | fill_n(v.begin(), n, value)                     | O(n)       |
| [replace](https://cplusplus.com/reference/algorithm/replace/)               | 替換所有等於特定值的元素           | replace(v.begin(), v.end(), old_val, new_val)   | O(n)       |
| [replace_if](https://cplusplus.com/reference/algorithm/replace_if/)         | 根據條件替換元素                   | replace_if(v.begin(), v.end(), pred, new_val)   | O(n)       |
| [unique](https://cplusplus.com/reference/algorithm/unique/)                 | 移除連續重複的元素並返回結束迭代器 | unique(v.begin(), v.end())                      | O(n)       |
| [reverse](https://cplusplus.com/reference/algorithm/reverse/)               | 反轉範圍內的元素順序               | reverse(v.begin(), v.end())                     | O(n)       |
| [rotate](https://cplusplus.com/reference/algorithm/rotate/)                 | 將範圍內的元素循環左移             | rotate(v.begin(), v.middle(), v.end())          | O(n)       |
| [random_shuffle](https://cplusplus.com/reference/algorithm/random_shuffle/) | 隨機重排範圍內的元素               | random_shuffle(v.begin(), v.end())              | O(n)       |

### **分割操作**

這些演算法會將序列中的元素重新排列。

| 演算法                                                                          | 功能                                                   | 範例                                                                   | 時間複雜度 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | ---------- |
| [is_partitioned](https://cplusplus.com/reference/algorithm/is_partitioned/)     | 檢查範圍內的元素是否符合某個條件，已分割成兩部分       | is_partitioned(v.begin(), v.end(), pred)                               | O(n)       |
| [partition](https://cplusplus.com/reference/algorithm/partition/)               | 根據條件將範圍內的元素重新排列，滿足條件的元素排在前面 | partition(v.begin(), v.end(), pred)                                    | O(n)       |
| [stable_partition](https://cplusplus.com/reference/algorithm/stable_partition/) | 根據條件分割元素，保持相對順序不變                     | stable_partition(v.begin(), v.end(), pred)                             | O(n log n) |
| [partition_copy](https://cplusplus.com/reference/algorithm/partition_copy/)     | 根據條件分割元素到兩個不同的容器                       | partition_copy(v.begin(), v.end(), dest1.begin(), dest2.begin(), pred) | O(n)       |
| [partition_point](https://cplusplus.com/reference/algorithm/partition_point/)   | 返回一個迭代器，指向分割後第二部分的開始位置           | partition_point(v.begin(), v.end(), pred)                              | O(log n)   |

### **排序操作**

這些演算法用於對容器中的元素進行排序。

| 演算法                                                                  | 功能                                                      | 範例                                         | 時間複雜度 |
| ----------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------- | ---------- |
| [sort](https://cplusplus.com/reference/algorithm/sort/)                 | 對範圍內的元素進行排序                                    | sort(v.begin(), v.end())                     | O(n log n) |
| [stable_sort](https://cplusplus.com/reference/algorithm/stable_sort/)   | 對範圍內的元素進行穩定排序，保持相等元素的順序            | stable_sort(v.begin(), v.end())              | O(n log n) |
| [partial_sort](https://cplusplus.com/reference/algorithm/partial_sort/) | 對範圍內的部分元素進行排序，使得指定的部分是已排序的      | partial_sort(v.begin(), v.middle(), v.end()) | O(n log k) |
| [nth_element](https://cplusplus.com/reference/algorithm/nth_element/)   | 重新排列範圍內的元素，使得第n個元素會在它的最終排序位置上 | nth_element(v.begin(), v.nth(), v.end())     | O(n)       |

### **二分搜尋操作**

二分搜尋相關的演算法需要對操作的序列進行排序，通常搭配 `sort` 使用。

| 演算法                                                                    | 功能                                             | 範例                                     | 時間複雜度 |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------- | ---------- |
| [lower_bound](https://cplusplus.com/reference/algorithm/lower_bound/)     | 找到範圍內第一個大於或等於指定值的元素位置       | lower_bound(v.begin(), v.end(), value)   | O(log n)   |
| [upper_bound](https://cplusplus.com/reference/algorithm/upper_bound/)     | 找到範圍內第一個大於指定值的元素位置             | upper_bound(v.begin(), v.end(), value)   | O(log n)   |
| [equal_range](https://cplusplus.com/reference/algorithm/equal_range/)     | 同時獲得lower_bound和upper_bound，返回一對迭代器 | equal_range(v.begin(), v.end(), value)   | O(log n)   |
| [binary_search](https://cplusplus.com/reference/algorithm/binary_search/) | 檢查一個已排序範圍是否包含某個元素               | binary_search(v.begin(), v.end(), value) | O(log n)   |

### **合併操作**

合併相關的演算法需要對操作的序列進行排序，通常搭配 `sort` 使用。

| 演算法                                                                          | 功能                                                               | 範例                                                                         | 時間複雜度 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------- |
| [merge](https://cplusplus.com/reference/algorithm/merge/)                       | 合併兩個已排序的序列，結果也是排序的                               | merge(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin())            | O(n + m)   |
| [inplace_merge](https://cplusplus.com/reference/algorithm/inplace_merge/)       | 在序列中合併兩個連續的已排序範圍                                   | inplace_merge(v.begin(), v.middle(), v.end())                                | O(n log n) |
| [includes](https://cplusplus.com/reference/algorithm/includes/)                 | 檢查一個已排序範圍是否包含另一個已排序範圍的所有元素               | includes(v1.begin(), v1.end(), v2.begin(), v2.end())                         | O(n + m)   |
| [set_union](https://cplusplus.com/reference/algorithm/set_union/)               | 合併兩個已排序範圍，結果集包含每個範圍中的每個元素，不重複         | set_union(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin())        | O(n + m)   |
| [set_intersection](https://cplusplus.com/reference/algorithm/set_intersection/) | 獲得兩個已排序範圍的交集                                           | set_intersection(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin()) | O(n + m)   |
| [set_difference](https://cplusplus.com/reference/algorithm/set_difference/)     | 獲得兩個已排序範圍的差集，即存在於第一個範圍但不在第二個範圍的元素 | set_difference(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin())   | O(n + m)   |

### **堆操作**

這些演算法用於在向量上執行堆操作

| 演算法                                                            | 功能                                                     | 範例                                              | 時間複雜度 |
| ----------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- | ---------- |
| [make_heap](https://cplusplus.com/reference/algorithm/make_heap/) | 建立一個 heap，將範圍內的元素重新排列成 heap 的形式      | make_heap(v.begin(), v.end())                     | O(n)       |
| [sort_heap](https://cplusplus.com/reference/algorithm/sort_heap/) | 對一個 heap 進行排序，將 heap 轉換成一個有序的序列       | sort_heap(v.begin(), v.end())                     | O(n log n) |
| [push_heap](https://cplusplus.com/reference/algorithm/push_heap/) | 將新元素加入到 heap 中並保持 heap 的特性                 | v.push_back(value); push_heap(v.begin(), v.end()) | O(log n)   |
| [pop_heap](https://cplusplus.com/reference/algorithm/pop_heap/)   | 從 heap 中移除最大元素（或最小元素），並保持 heap 的特性 | pop_heap(v.begin(), v.end()); v.pop_back()        | O(log n)   |

### **遍歷統計操作**

這些演算法定義在 `<numeric>` 中

| 演算法                                                                              | 功能                                                         | 範例                                                           | 時間複雜度 |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- |
| [accumulate](https://cplusplus.com/reference/numeric/accumulate/)                   | 計算給定範圍內所有元素的總和或累積結果                       | accumulate(v.begin(), v.end(), initial_value)                  | O(n)       |
| [inner_product](https://cplusplus.com/reference/numeric/inner_product/)             | 計算兩個範圍的內積，或進行對應元素的乘積和其後的累加操作     | inner_product(v1.begin(), v1.end(), v2.begin(), initial_value) | O(n)       |
| [partial_sum](https://cplusplus.com/reference/numeric/partial_sum/)                 | 計算給定範圍內各個子範圍的總和，並將中間結果存儲到另一個範圍 | partial_sum(v.begin(), v.end(), result.begin())                | O(n)       |
| [adjacent_difference](https://cplusplus.com/reference/numeric/adjacent_difference/) | 計算連續元素之間的差異，並將結果存儲到另一個範圍             | adjacent_difference(v.begin(), v.end(), result.begin())        | O(n)       |
| [iota](https://cplusplus.com/reference/numeric/iota/)                               | 在範圍內填充連續遞增或遞減的值                               | iota(v.begin(), v.end(), start_value)                          | O(n)       |


<br/>


## **仿函數 Functor**

`仿函數(functor)`又稱之為函數物件(function object)，泛指任何可以使用函數調用運算子**`()`**的物件。簡單來說來說，就是重載(overload)運算子 `operator()` 的 struct 或類別的實例。仿函數可以被當作函數來使用，與一般函數不同的是，仿函數可以擁有內部狀態和其他成員函數，通常用於封裝與特定操作相關的狀態或行為。

以下舉例一個簡單的仿函數:

```cpp
struct Sum {
    int operator()(int a, int b) {
        return a + b;
    }
};
```

我們可以像呼叫一般函數一樣來使用它:

```cpp
Sum add;
int result = add(3, 4); // result = 7
```

而且仿函數還可以有自己的內部狀態:

```cpp
struct Multiplier {
    int factor;
    Multiplier(int f) : factor(f) {}
    int operator()(int a) {
        return a * factor;
    }
};
```

### **為什麼要使用仿函數呢？**

1. **帶有記憶的功能**：
- 仿函數可以存儲狀態。比如，如果你想要一個可以記住之前加過的總和的加法器，仿函數就很方便。
- 範例：創建一個計數器，每次調用時增加並記住總和。
    
    ```cpp
    class Counter {
    public:
        Counter(): count(0) {}
        int operator()() { return ++count; }
    
    private:
        int count;
    };
    
    Counter counter;
    cout << counter(); // 輸出 1
    cout << counter(); // 輸出 2
    
    ```
    

1. **靈活調整行為**：
   - 你可以為不同的情況創建不同的仿函數物件，每個物件有自己的行為和狀態。
   - 範例：創建一個加法器，可以設定初始加數。
    
    ```cpp
    class Adder {
    public:
        Adder(int number): number(number) {}
        int operator()(int x) const { return x + number; }
    
    private:
        int number;
    };
    
    Adder addFive(5);
    cout << addFive(3); // 輸出 8
    ```
    

2. **易於與STL算法結合**：
   - STL算法，如**`sort`**、**`find_if`**等，通常接受函數或仿函數作為參數，這使得使用仿函數可以更自然地與STL集成。
   - 範例：使用仿函數來自定義排序條件。
    
    ```cpp
    std::vector<int> v = {1, 5, 3, 4, 2};
    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // 用Lambda表達式，其實也是一種仿函數
    ```


<br/>


## **適配器 Adaptor**

`適配器(Adaptor)`在程式設計中是一種結構型模式，它允許將一個類別的接口轉換成客戶端期望的另一個接口。適配器讓原本因介面不兼容而不能一起工作的類可以一起工作。在 STL 中，適配器用於變換容器、迭代器或函數等的行為。

### **適配器的類型**

在C++中，適配器主要有三種類型：

1. **容器適配器**：
    - 這些適配器將底層的容器類型轉換成提供特定接口的容器類型，例如 **[stack](https://cplusplus.com/reference/stack/stack/)**、**[queue](https://cplusplus.com/reference/queue/queue/)** 和** [priority_queue](https://cplusplus.com/reference/queue/priority_queue/)**。
    - 例子：
        - `stack`適配器可以將`vector`、`deque`或`list`等類型作為其底層容器。
        - 使用`stack`適配器：
            
            ```cpp
            std::stack<int> s;
            s.push(1);
            s.push(2);
            s.push(3);
            while (!s.empty()) {
                std::cout << s.top() << std::endl;
                s.pop();
            }
            ```
            
2. **迭代器適配器**：
    - 改變迭代器的行為，例如`reverse_iterator`、`insert_iterator`、`stream_iterator`等。
    - 例子：
        - 使用`reverse_iterator`來反向遍歷容器：
            
            ```cpp
            std::vector<int> v = {1, 2, 3, 4, 5};
            for (auto it = v.rbegin(); it != v.rend(); ++it) {
                std::cout << *it << " ";
            }
            ```
            
3. **函數適配器**：
    - 這些適配器用來改變函數或者函數物件的呼叫方式，例如`bind`、`function`、`not1/not2`等。
    - 例子：
        - 使用`bind`來創建新的函數物件：
            
            ```cpp
            auto adder = std::bind(std::plus<int>(), std::placeholders::_1, 100);
            std::cout << adder(5); // 輸出 105
            ```


<br/>


## **Reference**
- **[cplusplus - Standard C++ Library reference](https://cplusplus.com/reference/)**
- **[C++ STL Tutorial](https://cui-jiacai.gitbook.io/c++-stl-tutorial)**
- **[EECS 311: STL Containers](https://courses.cs.northwestern.edu/311/html/stl-summary.html)**
- **[C++ STL入门.md](https://github.com/fupengfei058/blog/blob/master/C%2B%2B%20STL%E5%85%A5%E9%97%A8.md)**
- **[C++ STL 教程](https://www.runoob.com/cplusplus/cpp-stl-tutorial.html)**
- **[YUI HUANG 演算法學習筆記](https://yuihuang.com/)**
- **[The C++ Standard Template Library (STL)](https://www.geeksforgeeks.org/the-c-standard-template-library-stl/)**
- **[STL 容器 (一) - 基本介紹](https://jasonblog.github.io/note/c++/stl_rong_qi_4e0029_-_ji_ben_jie_shao.html#vector)**