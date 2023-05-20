---
title: "CH10 Self-defined Data Type"
sidebar_label: "[Ch10] - Self-defined Data Type"
description: C++ Self-defined Data Type
last_update:
  date: 2022-10-01
keywords:
  - C++
  - struct
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **struct**

### **struct definition**

We want to group different data types into a single type. In C, we do so by using `struct` (abbreviation of structure).
- We do so when an item naturally consists of multiple attributes. 
- We do so to make the program easier to read and maintain.
exp:

<!-- more -->

```cpp
struct Point 
{
    int x;
    int y; 
};

Point vector(Point A, Point B)
// Point as parameters 
{
    Point vecXY;
    vecXY.x = B.x - A.x;
    vecXY.y = B.y - A.y;
    return vecXY; // return a Point 
} 

int main() {
    Point a = {0, 0}, b = {10, 20};
    Point vecAB = vector(a, b);
    cout << vecAB.x << " ";
    cout << vecAB.y << "\n";
    return 0; 
}
```

- `Declare` variables with the self - defined type name. 
- `Assign` values to both attributes by grouping values by curly brackets. 
- `Access` attributes through the dot operator.
  
```cpp
// 定義
struct struct_name 
{
    type1 field 1;
    type2 field 2;
    type3 field 3;
    // more fields 
};

// 宣告
struct_name variable_name;

// 存取
struct_variable.attribute_name
```

Partial assignments are allowed (with unassigned attributes set to 0).
```C++
Point A = {0, 0, -8}; 
Point B; 
B = {10, 20, 5}; 
C = {5, 0}; 
D = {2}
```



### **struct and functions**

You may pass a struct variable as an argument into a function.  
You may return a struct variable from a function, too.   
參考[10_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_1.cpp)



### **Memory allocation for struct**
參考[10_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_2.cpp)


<br/>


## **typedef**
typedef is the abbreviation of “type definition”. It allows us to create a new data type from another data type. 

> `typedef` <old type\> <new type\>;

So we do not really create any new type. (只是幫old type取一個別名)


### **Example with typedef**

```cpp
typedef double Dollar; // define Dollar as double D
ollar nt; // declare a variable as Dollar 
Dollar us; 
cin >> us; nt = us * 29; 
cout << nt << "\n";
```
- The self-defined type can be used only in the block (if you declare it in any block). The same rule applies to struct.



### **typedef from struct**

We may combine typedef and struct.
```C++
// define Vector from Point 
typedef Point Vector;

Point a = {0, 0}; 
Point b = {10, 20}; 
Vector vecAB = vector(a, b);
```



### `Example: <ctime>`

很多C++的standard library 都會用typedef來提供函式功能，ex: function **clock()**, (defined in `<ctime>`) 回傳程式開始執行後經過了幾個system clock ticks
參考[10_3.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_3.cpp)

`clock()` returns a type `clock_t` variable (for the number of ticks).
- `clock_t` is actually a long int. In `<ctime>`, there is a statement:
> `typedef` long int clock_t;

Why clock_t?
> 假如某天C++ standard library 想要更改clock()回傳的變數型態，若原本回傳為long int，就會遇到舊版與新版回傳變數形態不同而所有程式碼都都改的窘境

To print out the number of seconds instead of ticks:

```cpp
cout << static_cast<double>(eTime - sTime) / CLOCKS_PER_SEC << "\n";
```
使用者就算不知道clock_t是什麼變數型態也可以直接使用，library就算改了clock_t的old type也不會影響到使用者。


<br/>


## **struct with member functions**

### **A member-function implementation**

We may redefine Point to include a member function:
- distOri() is a `member function` of Point.
- `No argument` is needed.


```cpp
struct Point 
{
int x;
int y;
double distOri()
    {
        return sqrt(pow(x, 2) + pow(y, 2)); 
    }
};

int main() 
{
Point a = {3, 4};
cout << a.distOri();
return 0; 
}
```

One may define a member function outside the struct statement.  
必須使用 scope resolution operator `::`，並且把 struct 的名字加在前面，以區別出 member-function 與global-function。

```cpp
struct Point 
{
    int x;
    int y;
    double distOri(); 
};

double Point::distOri() // scope resolution 
{                       // is required
    return sqrt(pow(x, 2) + pow(y, 2)); 
}
```



### **Two different perspectives**
- As a `global function`: I want to create a machine outside a point.
- As a `member function`: I want to attach an operation on a point.  
The second way also enhances modularity(讓每個模塊功能區分清楚，成為獨立自主的個體，也較容易維護)

參考[10_4.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_4.cpp)


<br/>


## **Randomization**

### **rand()**

It “randomly” returns an integer between 0 and RAND_MAX (in `<cstdlib>`, typically 32767). Actually rand() returns a “pseudo-random” integer.
- They just look like random numbers. But they are not really random.
- There is a formula to produce each number.

參考[10_5.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_5.cpp)



### **srand()**

We use srand to determine the seed.
> void srand(unsigned int);

- A seed can be generated based on the input number. 
- The sequence will become different.

參考[10_6.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_6.cpp)

In many cases, we use time(nullptr) to be the argument of srand()
- The function time(0), defined in `<ctime>`, returns the number of seconds that have past since 0:0:0, Jan, 1st, 1970.

> time_t time(time_t* timer);

參考[10_7.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_7.cpp)



### **Random numbers in a range**

If you want to produce random numbers in a specific range, use `%`.

參考[10_8.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/blob/master/Lecture_Code/10.Self-defined%20data%20types%20(in%20C)/10_8.cpp)

<br/>

## **Reference**
- **[IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)**
