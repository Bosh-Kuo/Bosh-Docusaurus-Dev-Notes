---
title: "CH5 Functions"
sidebar_label: "[NTU Programming Design] - Ch5 Functions"
sidebar_position: 4
description: C++ Functions
last_update:
  date: 2022-02-20
keywords:
  - C++
  - function
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Function**
C++中function是由header與body組成，分別有system-defined functions, user-defined functions宣告的prototype:   
> `return_type function_name(parameter_type parameter_name);`  

另外C++ funtion一次只能回傳一個變數，若要回傳多個值，要用class與object。
參考[5_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_1.cpp)

<!-- more -->

<br/>

## **Function prototype**
在C++中funtion 須在main()前先declare,並在main()後define內容。同樣也可以在main()前直接defination取代declaration，就不用另外做declaration。但需要小心若多個function間有互相呼叫關係，那要確保呼叫的function以經被define好了，若兩function間互相呼叫，就一定只能用function prototype。  
參考[5_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_2.cpp), [5_3.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_3.cpp)

<br/>

## **Function parameters v.s. arguments**
parameters: 用來稱函數block內的變數。 (function內)   
arguments: 用來稱傳入函數的原始變數。 (function外)  
參考[5_4.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_4.cpp)

<br/>

## **Function return value**
若函數在if else控制流程中沒有return指定數值，函數仍然會回傳一任意數字，這就像是宣告變數但未指定初始值的狀況一樣。  
參考[5_5.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_5.cpp) 

<br/>

## **Operator also return value**
`cin >>, cout <<` 本身會回傳`istream& object`作為回傳值，當將cin >> 寫在while中時，若是以鍵盤輸入就會永遠跳不出while迴圈，但若是以指令直接讀取文檔時，當`cin>>`讀不到檔案內的資料就會回傳一個false value。  
參考[5_6.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_6.cpp) 

<br/>

## **變數生命週期**
`1. local variable:` 出了block就消失。   
參考[5_7.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_7.cpp)   
`2. global variable:` 不定義在任何block裡面，因此任何block都可以使用它。（不建議使用）
呼叫時可以使用operator::來指定使用global variable。  
參考[5_8.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_8.cpp)    
`3. external variable:` keyword: `external`，當大型系統中多個程式同時存取同個變數`extermal int a`，在其中一個程式改動這個a，其他城市中的a也會一起變動。（不建議使用）  
`4. static variable:` 雖然是在block裡面被宣告，但其特性像global variable一樣在程式結束前都不會被清除。  
參考[5_9.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_9.cpp), [5_10.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_10.cpp), [5_11.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_11.cpp)          

<br/>

## **Call by value**
當使用call by value mechanism時，會在funtion block內建立記憶體空間宣告local variable作為parameter，再將argument的值複製給parameter，等block執行結束後便會清除local variable，釋放記憶體空間。  
其特點是function可被寫為independent entities，寫function時不需要管外部的任何變數，不會影響或被影響。   
參考[5_12.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_12.cpp)

但有些情境我們會需要function去改變傳入的arguments本身的值，我們可以：
- call by reference
- 傳入array(傳址)

<br/>

## **Passing an 1d array as an argument**
範例：
```C++
void printArray(int arr[]);
```
Array 變數事實上存的是第一個變數的address。  
參考[5_13.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_13.cpp), [5_14.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/5.Functions/5_14.cpp)    

<br/>

## **Passing an 1d array as an argument**
範例：
```C++
int num[5][2];
void printArray(int arr[][2]);
```
C++在處理２維陣列會理解為１排１維陣列，因此必須告訴compiler傳入的一排東西是長度為2的１維陣列。 

<br/>

## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)

