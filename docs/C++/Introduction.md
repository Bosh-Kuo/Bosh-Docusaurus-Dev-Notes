---
title: "Ch1 Introduction"
sidebar_label: "[NTU Programming Design] - Ch1 Introduction"
sidebar_position: 0
description: C++ 簡介
last_update:
  date: 2022-02-20
keywords:
  - C++
  - g++
tags:
- Programming Language
- C++
---

:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **C Program 執行階段 (補充)**
```mermaid
graph LR;
    id1(Edit) --> id2(Preprocess);
    id2 --> id3(Compile);
    id3 --> id4(Link);
    id4 --> id5(Load);
    id5 --> id6(Execute);
```

<!-- more -->

* *1. Edit*: 編輯程式碼，即Coding
* *2. Preprocess*: C preprocessor在編譯前會先執行一些特殊指令一些特殊指令，包含包裹其他檔案已進行文本交換。  
  ex: `#include <stdio.h>`
* *3. Compile*: 編譯器將C語言程式碼編譯成機器語言程式碼。
* *4. Link*: 程式碼通常參考在其他地方的function，如standard libaries, etc. `Compiler` 編譯的objet code包含許多“missing part”，linker會連接objet code與missing functions，生成`executable image`。在Linux中compiler+link指令為`gcc`。
* *5. Loading*: `loader`將`executable image`從磁碟轉移到記憶體上。
* *6. Execution*: 最後電腦在CPU控制之下運行程式。


## **C++ Program 執行階段**
```mermaid
graph LR;
    id1(Preprpcessor) --> id2(namespace) 
    id2 --> id3(main faunction) 
    id3 --> id4(statemaents)
```


```C++
#include <iostream>  
using namespace std;
int main()
{
    //statement
    return 0;
}
```


- *preprocessor*: 開始於`#include`<標頭檔>（package)，在compiler編譯之前執行一些指令
- *header file*: 標頭檔，記錄一些通用得變數與函數的定義
    - `<iostream>`: 為一標頭檔header file，此為C++標準libary，cout,cin皆為iostream定義的變數
    - `#include "路徑"`：引進自己寫的函式
- *namespace*: 命名空間：裝變數、函數、物件名稱的空間，程式執行時compiler會搜尋所看到的名稱是否定義於程式中或者是std namespace中


## **編譯與執行**
in terminal:  
cd 檔案所放的目錄  
(1) g++ 檔名.cpp (3-1)./a.out   
or  
(2) g++ 檔名.cpp -o 檔名 （3-2)./檔名


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)


