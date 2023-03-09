---
title: "CH7 Complexity and Graphs"
sidebar_label: "[NTU Programming Design] - Ch7 Complexity and Graphs"
sidebar_position: 6
description: C++ Complexity and Graphs
last_update:
  date: 2022-03-05
keywords:
  - C++
  - Complexity
  - Graphs
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Complexity** 

演算法可以理解為能夠完成特定任務的一系列步驟，而演算法的優劣我們會以`複雜度complexity`去比較。

Time complexity and space complexity:
- Time: 花越少時間越好
- Space: 花越少空間越好

<!-- more -->

### **Time complexity**
為了移除機器硬體效能之間的差異，通常以計算基本operations數量來代替計算時間。
> 假設一alogorithm的基本operations數為5𝑚𝑛+10𝑚+2
- 當n或m夠大時用**5mn**來估計就足夠了
- 再者**常數5**也沒有太重要
- 我們通常只關注**bottleneck**上的operations是如何增長的


<br/>


## **The “big O” notation**
for $n ∈ ℕ$ :

> $f(n) ∈ O(g(n))$  

if and only if there exists a positive number $c$ and a number $𝑁$ such that $𝑛 ≥ 𝑁$:
> $f(n) ≤ cg(n)$

That means when 𝒏 is large enough, $g(n)$ will dominate $f(n)$
- We say the algorithm’s time complexity is $g(n)$
- We write $f(n) ∈ O(g(n))$, but some people write $f(n) = O(g(n))$

We use the “big O” notation:
- We ignore tedious details, non-bottlenecks, and constants.
- We focus on the worst case. 

Exp:   
Let $𝑓(n) = nlog(n) + n^2$, we have $g(n) = n^2$



### **Example1**
```C++
bool isPrime(int x) {
    for(int i = 2; i < x; i++)
        if(x % i == 0)
            return false;
    return true; }
```

$O(1+2+3+..+n) = O(n^2)$
The most naïve algorithm’s complexity is $O(n^2)$



### **Example2**
```C++
bool isPrime(int x) {
    for(int i = 2; i*i < x; i++)
        if(x % i == 0)
            return false;
    return true; }
```

the complexity is $O(\sqrt(x))$


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)

