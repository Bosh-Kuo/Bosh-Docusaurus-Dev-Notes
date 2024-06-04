---
title: "C++ upper_bound, lower_bound(STL) 用法與範例"
sidebar_label: "[Algorithms] upper_bound & lower_bound"
description: upper_bound 和 lower_bound 這兩個函數，用於在已排序範圍中搜索元素。本文將詳細介紹 C++ STL 中的 upper_bound 和 lower_bound 函數的用法，並提供完整的使用範例。
last_update:
  date: 2024-06-04
keywords:
  - Programming Language
  - C++
  - STL
  - Iterator
  - Algorithms
  - upper_bound
  - lower_bound
tags:
  - Programming Language
  - C++
  - STL
---

在 C++ 標準模板庫（STL）中，`upper_bound` 和 `lower_bound` 是用於在**已排序**的有序容器（如 vector、deque 或 array）中搜索元素的函數，常被用來找尋一數值的左右邊界。這兩個函數都是基於二分查找算法(Binary Search)，能夠在 O(log n) 的時間複雜度內完成查找，以下將詳細介紹這兩個函數的使用方法和它們之間的區別。

- `lower_bound`：返回一個指向首個不小於(≥)指定值的元素的迭代器。
- `upper_bound`：返回一個指向首個大於(>)指定值的元素的迭代器。

## **upper_bound**

**定義：**

```cpp
template <class ForwardIterator, class T>
ForwardIterator upper_bound (ForwardIterator first, ForwardIterator last, const T& val);
```

**參數：**

- `first`：範圍的起始迭代器。
- `last`：範圍的結束迭代器。
- `val`：要搜索的值。

**返回值：**

返回指向首個大於 val 的元素的迭代器。如果沒有這樣的元素，則返回 **last**。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40, 50};
    auto it = upper_bound(v.begin(), v.end(), 30);
    
    if (it != v.end()) {
        cout << "First element greater than 30 is " << *it << endl;
    } else {
        cout << "No element greater than 30 found." << endl;
    }

    return 0;
}

// First element greater than 30 is 40
```

## **lower_bound**

**定義：**

```cpp
template <class ForwardIterator, class T>
ForwardIterator lower_bound (ForwardIterator first, ForwardIterator last, const T& val);
```

**參數：**

- `first`：範圍的起始迭代器。
- `last`：範圍的結束迭代器。
- `val`：要比較的值。

**返回值：**

返回一個指向範圍內第一個不小於 val 的元素的迭代器，如果所有元素都小於 val，則返回 **last**。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40, 50};
    auto it = lower_bound(v.begin(), v.end(), 30);
    
    if (it != v.end()) {
        cout << "First element not less than 30 is " << *it << endl;
    } else {
        cout << "No element not less than 30 found." << endl;
    }

    return 0;
}
// First element not less than 30 is 30
```

## **Reference**

- [**@cplusplus.com - std::upper_bound**](https://cplusplus.com/reference/algorithm/upper_bound/)
- [**@cplusplus.com - std::lower_bound**](https://cplusplus.com/reference/algorithm/lower_bound/)
- [**C++ STL 二分 lower_bound / upper_bound 用法详解**](https://blog.csdn.net/qq_37454669/article/details/124884772)