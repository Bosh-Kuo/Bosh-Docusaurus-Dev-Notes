---
title: "CH9 CStrings"
sidebar_label: "[NTU Programming Design] - Ch9 CStrings"
description: C++ CStrings
last_update:
  date: 2022-03-05
keywords:
  - C++
  - CStrings
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Characters** 

### **char**

- Use one byte (–128 to 127) to store English letters, numbers, symbols, and
special characters(但不能儲存中文符號)
- It is also an `integer`!
字元本身儲存的是一個整數，再經由`ASCII code` encode成我們看到的符號，因此每個char其實都可以轉成int，也可以最整數運算，參考[9_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/9.CStrings), [9_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/9.CStrings)

The C++ standard library `<cctype>` contains some useful functions for processing characters. 
```cpp
int islower(int c)
int isupper(int c)
int tolower(int c)
int toupper(int c)
int isalpha(int c)
int isdigit(int c)
int isalnum(int c)
int isprint(int c)
int isspace(int c)
int ispunct(int c)
```

<!-- more -->


<br/>


## **C strings**

### **String**

在C++中Strings有兩種形式:
- C strings as character arrays, A character array can be initialized as a usual array.
- C++ strings as objects. (後面章節會提)



### **A special way to input a string**
在C++中char arrays被用來作為string，因此很多opration都會為了char arrays被overloaded，exp: `cin >>, cout << `  
對一般array來說沒辦法一次輸入或輸出多個元素但char array可以
```cpp
char str[10]; 
cin >> str; // if we type "abcde" 
cout << str[0]; // a 
cout << str[2]; // c

int values[5] = {0}; 
cout << values; // an address 
char str[10]; 
cin >> str; // if we type "abcde" 
cout << str; // abcde
```

### **The null character**

When we use cin >> to input a string, a null character `\0` will be appended at the end automatically.

- `\0` is an escape sequence. It marks the end of a string. 
- When you declare a character array of length n, you can store a string of length at most n – 1. 
- A C string may be initialized with a double quotation
  - char s[100] = "abc"

```cpp
char a[100] = "abcde FGH";
cout << a << "\n"; // abcde FGH 
char b[100] = "abcde\0FGH";  
cout << b << "\n"; // abcd
```

One may also initialize a C string by assigning multiple characters.
- char s[100] = {'a', 'b', 'c'};
- No null character will be appended (though uninitialized values will be
initialized to 0, which is the null character). 
- = is overloaded for “a C string” and “some characters” in different ways.



### **Comparisons**

Will a null character be appended? 

```cpp
char s[10] = "abc";  // Yes 
char s[100] = {'a', 'b', 'c'};  // No
cin >> s;  // Yes 
cin >> s[0];  // No
```



### **String assignments**

用""來 assign string 只能用在宣告時，宣告後char array variable存的就是address了
```cpp
char s[100]; 
s = "this is a string"; // compilation error!
```

How to explain the outputs of this program?
```cpp
char c[100] = {0};  // (1)
cin >> c;  // (2) "123456789" 
cin >> c; // (3) "abcde"; 
cout << c << "\n"; // "abcde" 
c[5] = '*'; 
cout << c << "\n"; // (4) "abcde*789"

// (1) 0000000……0
// (2) 123456789\0
// (3) abcde\0789\0
// (4) abcde*789\0
```



### **Array boundary**

C++ does not check array boundary! 
```cpp
char a[5] = {0}; 
cin >> a; // "123456789" 
cout << a; // "123456789" or an error
```

### **A strange case**

並不是因為空白鍵被當作C strings的結尾，而是因為`cin`
```cpp
char a1[100] = {0}; 
cin >> a1; // "this is a string" 
cout << a1; // "this"
```

```C++
char a2[100] = {'a', 'b', ' ', 'c', '\0', 'e'}; 
cout << a2; // ab c
```



### **cin >> vs. cin.getline()**

`cin >>` splits the input stream into char pieces according to white spaces. The same thing happens for the `newline character` and `tab`.

To input a string with white spaces, use `cin.getline()`.

```cpp
char a[100] = {0};
char b[100] = {0};
cin >> a >> b; // this is
cout << a << "\n"; // this
cout << b << "\n"; // is

char a[100];
cin.getline(a, 100); // Hi, it's me
cout << a << "\n"; // Hi, it's me
```



### **String literals and character pointers**

A character pointer may also be initialized as a string literal.
```cpp
char* p = "12345"; 
cout << p + 2 << "\n"; // 345
```

- When we do so, the system allocates space storing “12345”. 
- That space is `read-only`. 
- p stores the address of that space.

```cpp
char a[100] = {0}; 
a = "123"; // compilation error

char* p; 
p = "abc"; // okay
```

```cpp
char a[100] = "12345";  
char* p = a;  
p = "abc"; // does not affect a  
cout << p << "\n"; // abc  
cout << a << "\n"; // 12345


char a[100] = "12345";
char* p = a;
p = "abc";
cout << p << "\n";
cin >> p; // run-time error 因為character pointer為read-only
```

### **Main function arguments**
我們可以在main function傳入arguments
```cpp
#include<iostream> 
using namespace std;
int main(int argc, char* argv[]) 
{
    for(int i = 0; i < argc; i++)
        cout << argv[i] << "\n"; 
    return 0;
}
```
- `argv[0]` is the name of the executable file. 
- `argv[i]` is the ith string passed into main.


<br/>


## **C string processing functions**

The C++ standard library `<cstring>` contains many useful pointer-based
string processing functions.
- Query and searching strlen, strchr, strstr.
- Comparison: strcmp, strncmp.
- Concatenation: strcat, strncat.
- Copying: strcpy, strncpy.
- Splitting: strtok.

The C++ standard library `<cstdlib>` contains some more.
- String-number conversion: atoi, atof, itoa. 
- Look for detailed explanations by yourselves!
 
### **String length query**

```cpp
char* p = "12345"; 
cout << strlen(p) << "\n";  // 5
char a[100] = "1234567890";  
cout << strlen(a) << "\n";  // 10
cout << sizeof(a) << "\n";  // 100(陣列空間大小)
cout << sizeof(a + 2) << "\n";  // 8(單獨一個記憶體位置，被解讀成pointer的size)
```



### **Searching in a string**

To find the location of a character in a string (or conclude that it does not exist in the string), use `strchr`.

It returns the address of the first occurrence of the character. If the character does not exist, it returns nullptr.
- The returned address may be used to modify the given string.
- The returned address may be used as the starting location of a “new string” to search for the next occurrence of the character. 

```cpp
char* strchr(char* str, int character);
```

### **Searching for a substring**

If we want to search for a substring, we use `strstr`.  
This returns the address of the first occurrence of `str2` in `str1`.

```cpp
char* strstr(char* str1, const char* str2);
```

<br/>

### **String-number conversion**

In `<cstdlib>`, two functions converts a character array into a number:

- For atoi, str should contain only digits
- For atof, str may contain at most one ‘.’

```cpp
int atoi(const char* str);  
double atof(const char* str);
```

A function converts a number into a character array

```cpp
char* itoa(int value, char* str, int base);
```


### **String comparisons**

Strings may also be compared alphabetically
`strcmp` compares the entire strings. `strncmp` does up to num characters.
```cpp
int strcmp (const char* str1, const char* str2); 
int strncmp(const char* str1, const char* str2, unsigned int num);
```

They returns 0 if the two strings are identical, a negative number if str1 is
in front of str2, and a positive number if str2 is in front of str1. 



### **String copying**

It copies the string at source into the array at dest, including the
terminating null character in source. It returns dest.

```cpp
char* strcpy(char* dest, const char* source);
```

```cpp
char a[100] = "watermelon";  //(1)
char b[100] = "orange";  //(2)
cout << a << "\n"; 
strcpy(a, b);  //(3)
cout << a << "\n";

//(1) a watermelon\0
//(2) b orange\0
//(3) a orange\0lon\0
```



### **String concatenation**

A similar task is to concatenate two strings.
This copies source to the end of dest. The `\0` of dest is replaced by the first character of source. The `\0` of source is also copied. It returns dest.
- The destination must be an array (static or dynamic), not just a pointer.
- A programmer must make sure that there is enough space of the modification.

```cpp
char* strcat(char* dest, const char* source);
```


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)

