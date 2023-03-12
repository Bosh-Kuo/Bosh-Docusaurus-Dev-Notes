---  
title: "CH8 Pointers"
sidebar_label: "[NTU Programming Design] - Ch8 Pointers"
description: C++ Pointers
last_update:
  date: 2022-03-05
keywords:
  - C++
  - Pointers
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Basics of pointers**

`pointer`是一種儲存記憶體位置的變數，`Array`也是儲存儲存記憶體位置的一種變數，但`Array`存的是**一排變數中的第一個變數的記憶體位置**。

- To declare a pointer, use `*`
 
  > type pointed* pointer name;

- Exp:
  
  > int *ptrInt;
  儲存int變數記憶體位置的指標

<!-- more -->


### **Pointer assignment**

We use the `address-of operator &` to obtain a variable’s address(取址)

 > pointer name = &variable name

Exp:
```C++
int a = 5;   
int* ptr = &a;
```



### **Address operators**

- `&`: **The address-of operator.** It returns a variable’s address. (變數->變數的位址)
- `*`: **The dereference operator.** It returns the pointed variable.（指標->被指到的變數）

Exp:

```cpp
int a = 10; 
int* p1 = &a; 
cout << "value of a = " << a << "\n"; // 10 
cout << "value of p1 = " << p1 << "\n"; // 0x123450 
cout << "address of a = " << &a << "\n"; // 0x123450 
cout << "address of p1 = " << &p1 << "\n"; // 0x543210 
cout << "value of the variable pointed by p1 = " << *p1 << "\n"; // 10
```

- `&` returns a `variable’s address`.
  - We cannot use`&100`, `&(a++)`
  - We can only perform `&` on a variable.
  - We cannot assign a value to `&x` (`&x` is a value!).

- `*` returns the pointed variable.
  - We can perform `*` on a pointer variable.
  - We cannot perform `*` on a usual variable.

- `&` and `*` cancel each other. 
  ```C++
  // if x is a variable
  *&x == x

  // if x is a pointer
  &*x == x
  ```



### **Null pointers**

If we dereference a pointers of unknown value, the outcome is unpredictable
```C++
int* ptr; 
cout << *ptr; // ?
```

A pointer `pointing to nothing` should be assigned `nullptr, NULL, or 0`.(讓程式保證會出錯)  
By using nullptr (instead of 0), everyone knows the variable must be a
pointer, and you are not talking about a number or character.

```cpp
int* p2 = nullptr; 
cout << "value of p2 = " << p2 << "\n"; // 0 
cout << "address of p2 = " << &p2 << "\n"; // 0x123450 
cout << "the variable pointed by p2 = " << *p2 << "\n"; // run-time error!
```

- When we use `*` in `declaring` a pointer, that `*` is not a dereference operator.
- When we use `&` in `declaring` a reference, that `&` is not an address-of operator.

```cpp
int* p, q;   // p is int*, q is int 
int *p, *q;  // two pointers 
int* p, *q;  // two pointers 
int* p, * q; // two pointers
```


<br/>


## **Using pointers in functions**

### **References and pointers**
When invoking a function and passing parameters, the default scheme is to `“call by value”` (or `“pass by value”`)
- function會宣告自己的local variable，傳入的arguments values會被複製成local variable的initial values

當我們想要改變傳入的變數本身時，可以用`“call by reference” or “call by pointer.”`



### **References**

- A `reference` is a variable’s `alias`. (變數的別名)  

- `int& d = c` is to declare d as c’s reference
  - 這跟 `address-of operator 的 &` 是不一樣的 



### **Call by reference**
Instead of declaring a usual local variable as a parameter, declare a `reference variable`. Thus we can call by reference and modify our arguments’ values.   
原本x, y是兩個`local value`，現在變成兩個`local reference`。  
通常reference只有call by  reference的時候才會用。

```cpp
void swap(int& x, int& y) 
{
    cout << &x << "\n";
    int temp = x;
    x = y;
    y = temp; 
}
```



### **Call by pointers**

- Declare a pointer variable as a parameter.
- Pass a pointer variable or an address (e.g., returned by &) at invocation.

You can view calling by reference as a special tool made by using pointers. 
```C++
void swap(int* ptrA, int* ptrB) 
{
    int temp = *ptrA;
    *ptrA = *ptrB;
    *ptrB = temp; 
}
```



### **Returning a pointer**
May a function return a pointer? Yes!

Why returning an address?
- With the address, we also know the value.  
- If we only have the value, we do not know its address (and index).
- To obtain the index, we need `pointer arithmetic.`


<br/>


## **Dynamic memory allocation (DMA)** 

The operator `new` allocates a memory space and **returns the address**.(請求空間，並且回傳空間位址)
- In C, we use a different keyword melloc. 

```C++
int* a = new int  //makes a store the address of the 4-byte space. 
int* a = new int(5)  //makes the space contain 5 as the value. 
int* a = new int[5]  //allocates 20 bytes (for 5 integers).
```
- 動態宣告陣列就不能用`{}`來初始化陣列。
- 動態宣告出來的空間是沒有變數名字的，只有空間與位址，因此必須使用指標。



### **Memory leak**
For space allocated during the compilation time, the system will release this space automatically when the corresponding variables no longer exist.

For space allocated during the run time, the system will not release this space unless it is asked to do so. `Because the space has no name!`

```cpp
void func() 
{
    int* bPtr = new int[3]; 
} 
// 8 bytes for bPtr are released 
// 12 bytes for integers are not 
int main() 
{
    func( );
    return 0; 
}
```

```cpp
double* b = new double; 
*b = 5.2; 
double c = 10.6; 
b = &c; 
// now no one can access (沒有變數連接這塊記憶體空間了)
// the space containing 5.2

```
`記憶體用不到也清不掉就是 memory leak`



### **Releasing space manually**

手動用`delete operator`釋放記憶體空間，並且將本來指向這塊空間的指標改指向nullptr
```cpp
int* a = new int; 
delete a; // release 4 bytes 
a = nullptr; // now a points to nothing 
int* b = new int[5]; a
delete b; // release only 4 bytes!
          // Unpredictable results may happen
delete [] b; // release all 20 bytes
b = nullptr; // now b points to nothing
```



### **Two-dimensional dynamic arrays**

With dynamic arrays, we now may create matrices with different row lengths



### **Example: lower triangular arrays**
```cpp
//宣告10個整數空間，把第一個整數空間的位址存起來
int* array = new int[10]  // 接下來當作一般array用

//宣告10個整數指標空間，把第一個整數指標空間的位址存起來(指向整數指標的指標)
int** array = new int*[10]  
for (int i = 0; i < 10; i++)
{
    array[i] = new int[該row長度]  // 接下來當作一般array用
}
```
  - The type of array[0] is **int*** (指標)
  - The type of array[1] is **int*** (指標)
  - (然後再去指向一個動態陣列就好了)

釋放2d動態陣列記憶體：
```cpp
for (int i = 0; i < 10; i++)
{
    delete[] array[i];
}
```


<br/>


## **Arrays and pointer arithmetic**

### **Pointer arithmetic: ++ and --**
- ++: point to the next variable
- --: point to the previous variable

```cpp
double a[3] = {10.5, 11.5, 12.5}; 
double* b = &a[0]; 
cout << *b << " " << b << "\n";  // 10.5 
b = b + 2; // b++ and then b++ 
cout << *b << " " << b << "\n";  // 12.5 
b--; 
cout << *b << " " << b << "\n";  // 11.5
```



### **Pointers and arrays**
> x[ i ] and *(x + i) are identical, but using the former is safer and easier
```C++
int y[3] = {1, 2, 3};
int* x = y;
for(int i = 0; i < 3; i++)
    cout << *(x + i) << " "; // 1 2 3 
for(int i = 0; i < 3; i++)
    cout << *(x++) << " "; // 1 2 3 (pointer variable存的address是可以改的)
for(int i = 0; i < 3; i++)
    cout << *(x + i) << " "; // unpredictable
// 修改指標的內容是危險的
```

```cpp
int x[3] = {1, 2, 3}; 
for(int i = 0; i < 3; i++)
    cout << x[i] << " "; // x[i] == *(x + i) 
for(int i = 0; i < 3; i++)
    cout << *(x + i) << " "; // 1 2 3
```

```cpp
int x[3] = {1, 2, 3}; for(int i = 0; i < 3; i++)
cout << *(x++) << " "; // error! (array variable存的address是不可以改的)
```


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)

