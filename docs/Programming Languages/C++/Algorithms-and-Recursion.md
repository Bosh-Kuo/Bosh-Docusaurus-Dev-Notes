---
title: "CH6 Algorithms and Recursion"
sidebar_label: "[NTU Programming Design] - Ch6 Algorithms and Recursion"
sidebar_position: 5
description: C++ Algorithms and Recursion
last_update:
  date: 2022-02-20
keywords:
  - C++
  - Algorithms
  - Recursion
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Algorithms and complexity**

### **Example: listing all prime numbers**
- Idea:  If any number j < i can divide i, i is not a prime number.
- Algotithm: For each number j < i, check whether j divides i. If there is any
j that divides i, report no; otherwise, report yes.

> `pseudocodes: 用程式結構來描述一系列的步驟，也就是把人話排列成程式碼的樣貌。忽略一切語言文法以及如何implement有關的議題。`

<!-- more -->

**pseudocode:**
```
Given an integer n:
for i from 2 to n
    assume that i is a prime number if(i % j == 0) {
    for j from 2 to i – 1
        if j divides i
            set i to be a composite number
    if i is still considered as prime
        print i

```

**Implementation:**
```cpp
for(int i = 2; i <= n; i++) {
    bool isPrime = true;
    for(int j = 2; j < i; j++) {
        if(i % j == 0) {
            isPrime = false;
            break;
        }
    if(isPrime == true)
        cout << i << " ";
}
```

implementation 參考[6_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/6.Algorithms%20and%20Recursion/6_1.cpp)



### **Improving our algorithm**
**original:**
```C++
bool isPrime(int x) 
{
    for(int i = 2; i < x; i++)
    {
        if(x % i == 0)
            return false;
    }   
    return true;
}
```

**faster:**
```cpp
bool isPrime(int x) 
{
    for(int i = 2; i*i < x; i++)
    {
        if(x % i == 0)
            return false;
    }   
    return true;
}
```

>  We improved the `algorithm`, not the `implementation`.

<br/>

### **Improving our algorithm**
We may use a bottom-up approach to eliminate composite numbers. 

The pseudocode:
```
Given a Boolean array A of length n
Initialize all elements in A to be true // assuming prime for i from 2 to n
    if A is true 
        print i 
        for j from 1 to n/i  // eliminating composite numbers
            Set A[𝑖 × 𝑗] to fals
```

implementation 參考[6_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/6.Algorithms%20and%20Recursion/6_2.cpp)

<br/>

### **Complexity**
- **Time complexity:** the running
time of an algorithm.
(The number of basic operations is a better measurement)

- **Space complexity:**  the amount
of spaces used by an algorithm. 


<br/>


## **Recursion**

### **Recursive functions**
- A function is recursive if it invokes itself (directly or indirectly). 
- The process of using recursive functions is called recursion(遞迴). 

當某問題可以被切割成多個重複或相近的子問題，且這些子問題都可以用同一個function來解決時，就很適合用recursion。


### **Example 1: finding the maximum**

-  Suppose that we want to find the maximum number in an array A[1..n] (which means A is of size n).

- A strategy:  
    - Subtask 1: First find the maximum of A[1..(n– 1)]. 
    - Subtask 2: Then compare that with A[n].

While subtask 2 is simple, subtask 1 is **similar** to the original task.

- First, I know I need to write a function whose header is:
```cpp
double max(double array[], int len);
```

-  If the function really works, subtask 1 can be completed by invoking
```cpp
double subMax = max(array, len - 1);
```

implementation 參考[6_3.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/6.Algorithms%20and%20Recursion/6_3.cpp)



### **Example 2: computing factorials**

- A subproblem: computing the factorial of n – 1.
- A strategy: First calculate the factorial of n – 1, then multiply it with n.

```cpp
int factorial(int n) {
    if(n == 1) // stopping condition
        return 1; 
    else
        // recursive call
        return factorial(n - 1) * n;
}
```



### **Example 3: the Fibonacci sequence**

- The Fibonacci sequence is 1, 1, 2, 3, 5, 8, 13, 21, …. Each number is the
sum of the two proceeding numbers. 
-  The nth value can be found once we know the (n – 1)th and (n – 2)th values.

```cpp
int fib(int n) 
{
    if(n == 1)
        return 1; 
    else if(n == 2)
        return 1; 
    else // two recursive calls
        return (fib(n - 1) + fib(n - 2));
}

```



### **Complexity issue of recursion**

**recursion:**
```C++
int fib(int n)
{
  if(n == 1)
    return 1;
  else if(n == 2)
    return 1;
  else // two recursive calls
    return (fib(n - 1) + fib(n - 2));
}
```

**repetitive:**
```cpp
double fibRepetitive(int n)
{
  if(n == 1 || n == 2)
    return 1;
  int fib1 = 1, fib2 = 1;
  int fib3 = 0;
  for(int i = 2; i < n; i++)
  {
    fib3 = fib1 + fib2;
    fib1 = fib2;
    fib2 = fib3;
  }
  return fib3;
}
```

Technically, we say that:
- The repetitive way is a `polynomial-time` algorithm
- The recursive way is an `exponential-time` algorithm. 



### **Power of recursion**

Though recursion is sometimes inefficient, typically implementation is easier. 

Let’s consider the classic example “Hanoi Tower”.
implementation 參考[6_4.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/6.Algorithms%20and%20Recursion/6_4.cpp)


<br/>


## **Searching and sorting**

### **Binary search**

if the array is sorted:
- First, we compare p with the median m (e.g., A[(n + 1) / 2] if n is odd).
- If p equals m, bingo!
- If p < m, we know p must exist in the first half of A if it exists.
- If p > m, we know p must exist in the second half of A if it exists

pseudocode:
```
binarySearch(a sorted array A, search in between from and to, search for p) 
if n = 1
    return true if A_from= p; return false otherwise
else
    let median be floor((from + to) / 2)
    if p = A_median
        return true
    else if p < A_median
        return binarySearch(A, from, median, p) 
    else
        return binarySearch(A, median + 1, to, p)
```

<br/>

### **Linear search vs. binary search**

- In binary search, the number of instructions to be executed is roughly
proportional to log n.

- So binary search is much more efficient than linear search!

<br/>

### **Insertion sort**
- The key is to maintain a sorted list.
- Then for each number in the unsorted list, insert it into the proper location
so that the sorted list remains sorted.


pseudocode(Non-repetitive):
```
insertionSort(a non-repetitive array A, the array length n, an index cutoff < n)
// at any time, A_(1..cutoff) is sorted and A_(cutoff + 1..n) is unsorted
if A_(cutoff + 1) < A_(1..cutoff)
    let p be 1 
else
    find p such that A_(p–1) < A_(cutoff + 1) < A_p
insert A_(cutoff + 1) to A_p and  shift A_(p..cutoff) to A_(p + 1)..(cutoff + 1)
    if cutoff + 1 < n
        insertionSort(A, n, cutoff + 1)
```

- We need to do n insertions.
- To insert the kth value, we search for a position and shift some elements.
  - A linear search: at most k comparisons. 
  - Shifting: at most k shifts.
- Roughly we need 1 + 2 + … + n operations, which is proportional to n^2.



### **Merge sort**
- Insertion sort is simple and fast!
- A key observation is that “inserting” `another sorted list` of size k into a sorted
list can be faster than inserting k separate numbers one by one!
- Given an unsorted array, we will:
    - First split the array into two parts, the first half and second half.
    - Then sort each subarray.
    - Finally, merge these two subarrays. 

pseudocode:
```
mergeSort(an array A, the array length n)
    let median be floor((1 + n) / 2)
    mergeSort(A_(1..median) , median) // now A_(1..median) is sorted
    mergeSort(A_(median + 1)..n , n – median + 1) // now A_(median + 1)..n is sorted
    merge A_(1..median) and A_(median + 1)..n  // how?
```

- Insertion sort: Roughly proportional to n^2.
- Merge sort: Roughly proportional to n log n. 


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)

