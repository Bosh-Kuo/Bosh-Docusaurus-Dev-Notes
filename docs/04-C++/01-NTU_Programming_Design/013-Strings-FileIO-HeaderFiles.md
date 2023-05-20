---
title: "CH13 Strings, File IO and Header Files"
sidebar_label: "[Ch13] - Strings, File IO and Header Files"
description: C++ Strings, File IO and Header Files
last_update:
  date: 2022-10-03
keywords:
  - C++
  - Strings
  - File IO
  - Header Files
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **C++ Strings**

### **C++ Strings: string**

C string 是一個char array在最後一個字元加上 **\0** ，Ｃ++ string是一個`class string`，他把char array 包進class的private member裡面，只能用`class string`提供特定的function來存取這個char array，不讓別人隨意存取來保護private member，同時達到封裝與模組化的效果。

In the `class string`:
- A member variable, a pointer pointing to a dynamic character array.
- Many member functions.
- Many overloaded operators.

<!-- more -->



### **string declaration**

declare C++ string:
```cpp
string myStr;  //string::string(); 
string yourStr = "your string";  //string::string(const char* s); 
string herStr(yourStr);  //string::string(const string& str);
```

- string is a class defined in string libary. 
- string is not a C++ keyword. 
- myStr is an object. 
- Thank to constructors and encapsulation



### **string lengths**

We may use the member functions `length()` or `size()` to get the string length. Just like `strlen()` for **C strings**.

```cpp
size_t string::length() const; 
size_t string::size() const;
```

```cpp
string myStr;  
string yourStr = "your string"; 
cout << myStr.length() << endl; // 0 
cout << yourStr.size() << endl; // 11
```

How long a string may be? Call `max_size()` to see:

```cpp
string myStr;  //size_t string::max_size() const;
cout << myStr.max_size() << endl; 
// 4611686018427387897
```



### **string assignment and concatenation and indexing**

assignment: 
```cpp
string myString = "my string";  // constructor
string yourString = myString; 
string herString; herString = yourString = "a new string";  // assignment

char hisString[100] = "oh ya";  // assignment
myString = hisString;

// Thanks to operator overloading!
```

concatenation and indexing:
```cpp
string myStr = "my string "; 
string yourStr = myStr; 
string herStr; 
herStr = myStr + yourStr;  // like strcat in C string
// "my string my string "
// += also work

string myString = "my string"; 
char a = myString[0]; // m
```



### **string input: getline()**

若使用`cin>>`輸入C++ string，空白鍵會被當作delimiter而將句子分開，但也不能使用`cin.getline`，因為他的argument必須是C string(char array)。

在C++中我們使用定義在string libary的global function `getline()` :
```cpp
string s;  
getline(cin, s);  // istream& getline(istream& is, string& str);
```

by default getline() stops when reading a newline character. We may specify the delimiter character we want:
```cpp
string s;
getline(cin, s, '#');  // istream& getline(istream& is, string& str, char delim);
```



### **Substrings**

We may use `substr()` to get the substring of a string.
```cpp
string string::substr(size_t pos = 0, size_t len = npos) const;
// string::npos is a static member variable indicating the maximum possible value of type size_t. 
```

```cpp
string s = "abcdef"; 
cout << s.substr(2, 3) << endl; // "cde" 
cout << s.substr(2) << endl; // "cdef"
```



### **string finding**

We may use the member function `find()` to look for a string or character. Just like `strstr()` and `strchr()` for `C strings`.

```cpp
size_t find(const string& str, size_t pos = 0) const; 
size_t find(const char* s, size_t pos = 0) const; 
size_t find(char c, size_t pos = 0) const;
```

This will return the beginning index of the argument, if it exists, or `string::npos`(最大可能的數字) otherwise.

```cpp
string s = "abcdefg"; 
if(s.find("bcd") != string::npos)
    cout << s.find("bcd"); // 1
```



### **string comparisons**

We may use >, >=, <, <=, ==, != to compare two C++ strings. Just like `strcmp()`. String literals or C strings also work. As long as one side of the comparison is a C++ string, it is fine.



### **Insertion, replacement, and erasing**

We may use `insert()`, `replace()`, and `erase()` to modify a string.

```cpp
string& insert(size_t pos, const string& str); 
string& replace(size_t pos, size_t len, const string& str); 
string& erase(size_t pos = 0, size_t len = npos);
```

```cpp
int main() 
{
    cout << "01234567890123456789\n";
    string myStr = "Today is not my day.";
    myStr.insert(9, "totally "); // Today is totally not my day.
    myStr.replace(17, 3, "NOT"); // Today is totally NOT my day.
    myStr.erase(17, 4); // Today is totally my day.
    cout << myStr << endl;
    return 0; 
}
```



### **C++ strings for Chinese characters**

Nowadays, C and C++ strings all accept Chinese characters. Different environment may use different encoding systems (Big-5, UTF-8, etc.) Most of them use two bytes to represent one Chinese character.

```cpp
int main() 
{
    string s = "大家好";
    int n = s.length(); // 6
    string t = s;
    for(int i = 0; i < n; i++)
        t[n - i - 1] = s[i]; // bad
    cout << t << endl; // n地屐 
    return 0;
}

int main() 
{
    string s = "大家好";
    int n = s.length(); // 6
    string t = s;
    for(int i = 0; i < n - 1; i = i + 2)
    {
        t[n - i - 2] = s[i]; 
        t[n - i - 1] = s[i + 1];
    } // good
    cout << t << endl; // 好家大
    return 0;
}
```


<br/>


## **File I/O**

### **A plain-text file**

- A plain-text file stores characters.
- A MS Word document stores characters and format information.
- A bitmap file stores color codes. 

plan-tesxt file儲存char序列，每個字元都有自己的位置編號，當文件被打開時會有一個`position pointer`指著`current reading/writing position`，我們可以藉由控制position pointer來控制讀寫。

寫檔時寫入的字元會替換掉目前位置的字元然後poaition pointer就會往下移動一格。

### **File streams**

cin 就像資料由鍵盤流進記憶體，cout就像資料從記憶體流進螢幕，當我們要把鍵盤跟螢幕換成檔案的話，在C++中我們會用到`ifstream` and `ofstream` object  
`ifstream` and `ofstream` are classes defined in `<fstream>`.

### **Output file streams**

To open and close an `output file stream`:

```cpp
ofstream myFile; 
myFile.open("temp.txt"); 
// ... 
myFile.close(); 

// open() and close() are public member functions. 
```



### **Writing to an output file stream**

To write to an output file stream, we may use `<<`.

```cpp
ofstream myFile; 
myFile.open("temp.txt"); 
myFile << "1 abc\n &%^ " << 123.45;  // The second argument of << can be of any basic data type.
myFile.close();  

```



### **Options for an output file stream**

在開啟一個檔案的時候我們可以選擇檔案的開啟模式：
- `ios::out` (default): poaition pointer location從0開始; 清除掉檔案中所有的資料
- `ios::app`: poaition pointer location從結束點開始，不能修該已存在的資料
- `ios::ate`: poaition pointer location從結束點開始，可以修該已存在的資料

`ios` is a class; `out`, `app`, and `ate` are public static variables.



### **Constructors and other members**

The class ofstream also provides constructors:

```cpp
ofstream file object(file name, option);
```

```cpp
ofstream myFile("temp.txt"); 
myFile << "1 abc\n &%^ " << 123.45; 
myFile.close();
```

參考[13_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/13.C%2B%2B%20Strings%2C%20File%20IO%20and%20Header%20Files/13_1.cpp)



### **Input file streams**

To read data from a file, we create an input file stream, `ifstream object`. 

```cpp
ifstream myFile; 
myFile.open("temp.txt"); 
// ... 
myFile.close();
```
`ifstream`只有一個開啟模式`iso::in (default)`. 

we may use if(!myFile) to check whether a file is really opened. If the file does not exist, myFile returns false.



### **Reading from an input file stream**

If the input data file is well-formatted, we may use the operator `>>`.  
參考[13_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/13.C%2B%2B%20Strings%2C%20File%20IO%20and%20Header%20Files/13_2.cpp)



### **End of file**

In each file, there is a special character “end of file”.  In C++, it is represented by the variable `EOF`. An input operation (e.g., inFile >> name) returns false if it reads `EOF`.

```cpp
while(!inFile.eof()) 
{
    inFile >> name;
    inFile >> score;
    sumScore += score;
    scoreCount++; 
}
```



### **Unformatted input files**

Sometimes a data file is not perfectly formatted. We cannot predict what the next type will be.  In this case, we read data as characters and then manually
find the types. This process is called `parsing`.

Some member functions of the class `ifstream`:
-  `get()` reads one character and returns it.
-  `getline()` reads multiple characters into a character array.


```cpp
// get()
while(!inFile.eof()) 
{
    char c = inFile.get();
    cout << c; 
}

// getline()
while(!inFile.eof()) 
{
    char name[20];
    inFile.getline(name, 20);
    cout << name << endl; 
}
```


### **getline() in a smarter way**

use getline() with a delimiter:

```
char name[20]; 
inFile.getline(name, 20, ' '); 
cout << name << endl;

```

getline() stops when the delimiter is read.
- It will be read and `discarded`.



### **getline() for C++ strings**

Determining the types and preparing a large enough buffer(C string 要先準備一個夠大的char array) are always issues. `C++ strings` may help. 

我們會用到定義在`<string>`中的global function `getline()` (The delimiter is also read and discarded.
):

```C++
istream& getline(istream& is, string& str, char delim);
```

```cpp
while(!inFile.eof()) 
{
    string name;
    getline(inFile, name, ' ');
    cout << name << endl; 
}
```



### **Updating a file**

由於plan-text file的存取形式是sequential-acess，並沒有一個方便的機制可以在中間插入文字，因此通通常需要用到copy and paste，開啟兩個檔案一個讀一個寫，當遇到要修改的地方將其改掉再寫入新的檔案，後面的文字依序複製。

參考[13_3.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/13.C%2B%2B%20Strings%2C%20File%20IO%20and%20Header%20Files/13_3.cpp)



### **>> vs. getline()**

- `>>`會依據存入容器自動將輸入轉成對影的變數型態; `getline()`只存C or C++ String，變數型態需要自己轉換。
- `>>`會停在第一個不是存入容器型態的位置，可能是' '或是\n之類的，`getline()`會停在delimiter的下一個位置

`若>> 搭配getline用時，可以用cin.ignaore()讓原本停在\n或空白字元上的position pointe往下移一格`


<br/>


## **Self-defined header files**

### **Libraries**

`<iostream>, <fstream>, <cmath>, <cctype>, <string>`這些都是C++ standard libary  
A library includes a `header file (.h)` and a `source file (.cpp)`.
– The header file contains `declarations`
– The source file contains `definitions`.

### **Including a header file**

When your main program wants to include a self-defined header file, simply
indicate its path and file name.
- #include "myMax.h" 
- #include "D:/test/myMax.h" 
- #include "lib/myMax.h" 



### **Including a header and a source file**

當main program想要使用自定義的source file，需要在header file中宣告source file的函數名稱，並且與main.cpp一起compile

`myMax.h`:
```cpp
const int LEN = 5; 
int myMax(int [], int); 
void print(int);
```

`myMax.cpp`:
```cpp
#include <iostream> 
using namespace std; 
int myMax(int a[], int len) 
{
    int max = a[0];
    for(int i = 1; i < len; i++)
    {
        if(a[i] > max) 
        max = a[i];
    } 
    return max;
}
void print(int i)
{
cout << i; 
}
```

`main.cpp`:
```cpp
#include <iostream> 
#include "myMax.h" 
using namespace std;
int main() 
{
    int a[LEN] = {7, 2, 5, 8, 9};
    print(myMax (a, LEN));
    return 0; 
}
```


<br/>


## **Reference**
- **[IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)**

