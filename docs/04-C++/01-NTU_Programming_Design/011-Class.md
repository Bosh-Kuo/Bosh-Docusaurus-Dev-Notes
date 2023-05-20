---
title: "CH11 Class"
sidebar_label: "[Ch11] - Class"
description: C++ Class
last_update:
  date: 2022-10-01
keywords:
  - C++
  - Class
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Basic concepts**

### **Some drawbacks of struct**

1. 我們可能會忘記inittialize struct內的變數
2. 我們可能在struct裡new一塊記憶體空間但卻忘記在main function中release  
3. struct內定義的內容可能被其他人已不正確的方式使用
4. 當struct中的變數與變數之間有所關聯，當其中一者該改時其他變數也要跟著更改，其他人不了解的人可能會不知道要一起更改
...

**In C++, a class can:**  

1. 定義member functions，當物件創建或消滅時會自動被呼叫
2. 隱藏部分member, 不讓他人隨意更改，只開放部分的member給他人使用，以保障別人對member的存取方式。



<!-- more -->

### **Instance vs. static variables/functions**

In a class, we can define member variables and member functions:
- Instance variables (default).
- Static variables.
- Instance functions (default).
- Static functions. 



### **Class Visibility**

- `Public` members can be accessed anywhere.
- `Private` members can be accessed only in the class.
- `Protected` members will be discussed later in this semester. 
By default, all members’ visibility level is `private`.  
By setting visibility, we can hide/open our instance members.

```cpp
class MyVector 
{ 
private:
    int n;
    int* m; 
public:
    void init(int dim);
    void print(); 
}; 

int main() 
{
    MyVector v;
    v.init(5); // OK!
    delete [] v.m;  // compilation error, 不能存取m!
    return 0; 
}

void MyVector::init(int dim) 
{
    n = dim;
    m = new int[n];
    for(int i = 0; i < n; i++)
        m[i] = 0; 
} 
void MyVector::print() 
{
    cout << "("; 
    for(int i = 0; i < n - 1; i++)
        cout << m[i] << ", "; 
    cout << m[n-1] << ")\n";
}
```



### **Data hiding**
當一個member為hiding，我們就可以控制它如何被使用而不是被隨意亂用。  
Public member functions are often called interfaces. All others should communicate with the class through interfaces.
- Many classes with all <u>instance variables private and all instance functions public.</u>



### **Encapsulation(封裝)**
`封裝`的概念為把多個members包成一包，且可以hiding，來決定該怎麼使用members。簡單來說，我們把data包進一個黑盒子裡面，只提供一個`controlled interfaces`給main function來存取這些資料

For OOP, there are three main characteristics/functionalities:
- Encapsulation
- Inheritance
- Polymorphism



### **Instance function overloading**

We can overload an instance function with different parameters.
```cpp
class MyVector { 
private:
    int n;
    int* m; 
public:
    void init();
    void init(int dim);
    void init(int dim, int value);
    void print(); 
};
```


<br/>


## **Constructors and the destructor**

### **constructor**

A `constructor` is an `instance function` of a class. However, a constructor will be invoked automatically when the object is created. Usually it is used to initialize the object.

- Constructor的名稱跟class名稱相同，且沒有回傳值(也沒有回傳void)，因此宣告時前面不用加回傳值型態，也不用加void直接寫名稱就可以了
- Constructor可以overloading
- 沒有傳入parameter的constructor為default constructor 
- Constructor不能被呼第兩次
- Constructor不能被programmer人為呼叫
- 若沒有自行定義constructor，compiler會呼叫一個沒有任何動作的constructor



### **Constructors for MyVector**
- If any member variable needs an initial value when an object is created, you should write a constructor to initialize it. 
- Use constructor overloading to provide flexibility.

`::在這邊為class scope，用法(class::name)，用來表示右邊的name屬於class的成員`

```cpp
class MyVector
{
private:
  int n; 
  int* m; 
public:
  MyVector();
  MyVector(int dim, int value = 0); 
  void print(); 
};

MyVector::MyVector()
{
  n = 0;
  m = nullptr;
}
MyVector::MyVector(int dim, int value)
{
  n = dim;
  m = new int[n]; 
  for(int i = 0; i < n; i++)
    m[i] = value;
}

int main() 
{
    MyVector v1(1);
    MyVector v2(3, 8);
    v1.print(); // (0)
    v2.print(); // (8, 8, 8)
    return 0; 
}
```


### **Destructors**

A destructor is invoked right before an object is destroyed.
- It must be public and have no parameter. 
- To define your own destructor, use `~`.
- Typically we release dynamically allocated space in a destructor.

```cpp
class MyVector 
{
private:
    int n;
    int* m; public:
    // ...
    ~MyVector(); 
};

MyVector:: ~MyVector() 
{
    delete [] m; 
}
```

When a class has other classes as types of instance variables, when are all the constructors/destructors invoked?  
 [11_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/11.Classes/11_1.cpp)


<br/>


## **Friends and static members**

### **Getters and setters**
In most cases, instance variables are private. For them to be accessed, sometimes people implement getters and setters for them.  
但若把所有的private member都加上getter, setter就失去private的意義了
```cpp
class MyVector 
{
private:
    int n;
    int* m; 
public:
    // ...
    int getN() { return n; }
    void setN(int v) { n = v; } 
};
```



### **friend for functions and classes**
To “open” private members, another way is to declare `“friends`.” One class can allow its friends to access its private members. Its friends can be global functions or other classes.


```cpp
class MyVector 
{
// ... 
friend void test();  // test函數中可存取MyVector的private member
friend class Test;  // Test的member function中可存取MyVector的private member
};

void test() {
    MyVector v;
    v.n = 100; // syntax error if not a friend
    cout << v.n; // syntax error if not a friend 
}

class Test { 
public:
    void test(MyVector v) {
        v.n = 200; // syntax error if not a friend 
        cout << v.n; // syntax error if not a friend
    }
};
```

friend 被寫在private或public沒有差別



### **friend for functions and classes**

friend可以用來幫助達到data hiding，因為若所有member都為public的話直接使用struct就好了，當private member應該被特定的class或function存取而非給所有人存取時，我們應該用friend而不是寫getter/setter



### **Static members**
A member variable/function may be an attribute/operation of a `class`.
- When the attribute/operation is `class-specific` rather than object-specific (全部object共用的概念).
- A class-specific attribute/operation should be identical for all objects. 
- These variables/functions are called `static members`(靜態).



### **Static members: an example**

We have to initialize a `static` variable globally. To access static members, use 
> class name::member name.

```cpp
int Window::barColor = 0; // default 
int Window::getBarColor() 
{
return barColor; 
}

void Window::setBarColor(int color) 
{
barColor = color; 
}

int main() 
{
    Window w; // not used
    cout << Window::getBarColor();
    cout << "\n";
    Window::setBarColor(1);
    return 0; 
}
```

```cpp
class A 
{ 
private:
    static int count; 
public:
    A() { A::count++; }
    static int getCount()
    { return A::count; } 
};

int A::count = 0; 
int main() 
{
    A a1, a2, a3;
    cout << A::getCount() << "\n"; // 3
    return 0; 
}
```


<br/>


## **Object pointers and the copy constructor**

### **Object pointers**

A pointer may point to an object, i.e., store the address of an object.

**a.print()** where a is an object and **print()** is an instance function.  
If we have a pointer **ptrA** pointing to the object a, we may write **(*ptrA).print()** to invoke the instance function **print()**. 
(***ptrA** returns the object **a**.)

C++ offers the member access operator `->`. 直接存取object pointer所指到的member

`(*ptrA).print()` is equivalent to `ptrA->print()`.



### **Why object pointers?**

- 當我們想建立object array時每個object的default constructor會自動被呼叫，但我們可能不想用default constructor來initialize object，宣告object array就沒辦法辦到呼叫self-defined constructor  
  - 建立object pointer array就不會自動呼叫constructor，當要initialize object時將這些object pointers 指向動態配置的object記憶體空間
- Passing a pointer into a function can be more efficient than passing the object.
  - A pointer can be much smaller than an object. 
  - Copying a pointer is easier than copying an object.



### **Dynamic object arrays**

- Object pointers allow us to do dynamic memory allocation.

```cpp
int main() 
{
    MyVector* ptrV = new MyVector(5);
    ptrV->print();
    delete ptrV;
    return 0; 
}
```

- To delay the invocation of constructors, we create an object pointer array.

```cpp
int main() 
{
    MyVector* ptrArray[5]; // no constructor invocation
    for(int i = 0; i < 5; i++)
    ptrArray[i] = new MyVector(i + 1); // constructor 
    ptrArray[0]->print(); // (0) 
    // some delete statements 
    return 0;
}
```



### **Passing object pointers into a function**

We may pass pointers rather than objects into this function:

```cpp
MyVector sum(MyVector* v1, MyVector* v2, MyVector* v3)
{
  // assume that their dimensions are identical
  int n = v1->getN(); 
  int* sov = new int[n];
  for(int i = 0; i < n; i++) 
    sov[i] = v1->getM(i) + v2->getM(i) + v3->getM(i);
  MyVector sumOfVec(n, sov); 
  return sumOfVec; 
}
```



### **Passing object references**
We may also pass references:
```cpp
MyVector cenGrav(MyVector& v1, MyVector& v2, MyVector& v3)
{
  // assume that their dimensions are identical
  int n = v1.getN(); 
  int* sov = new int[n];
  for(int i = 0; i < n; i++) 
    sov[i] = v1.getM(i) + v2.getM(i) + v3.getM(i);
  MyVector sumOfVec(n, sov); 
  return sumOfVec; 
}
```



### **Copying an object**

Creating an object by `“copying”` an object is a special operation.

- call-by-value mechanism. 
- assign an object to another object. 
- create an object with another object as the argument of the constructor.

When this happens, the  tructor will be invoked.
- compiler會自動加一個default copy constructor，他做的事情就是把member variable一個一個的複製過去



### **Copy constructors**

我們可以自定義copy constructor
In the C++ standard, the parameter must be a `constant reference`.

```cpp
class A 
{ 
private:
    int i; 
public:
    A() { cout << "A"; }
    A(const A& a) { cout << "a"; }  //copy constructor
};

void f(A a1, A a2, A a3)
{
  A a4;
}
int main()
{
  A a1, a2, a3; // AAA
  cout << "\n===\n";
  f(a1, a2, a3); // aaaA
  return 0;
}
```

### **Copy constructors for MyVector**

default copy constructor做的是shallow copy，若object member中沒有array/pointer的話直接用default copy constructor就足夠，但若有array/pointer的話則會造成copied object中的member array/pointer與原object指向同一塊記憶體空間，更動其中一個object中的array/pointer時另一個object也會被更動。

```cpp
MyVector::MyVector(const MyVector& v) 
{
n = v.n;
m = v.m; 
}
```



### **Deep copy**

To correctly copy a vector (by creating new values), we need to write our own copy constructor. In the self-defined copy constructor, we manually create another dynamic array, set its elements’ values according to the original array, and use m to record its address.

```cpp
MyVector::MyVector(const MyVector& v) 
{
    n = v.n;
    m = new int[n]; // deep copy
    for(int i = 0; i < n; i++)
        m[i] = v.m[i]; 
}
```


<br/>

## **Reference**
- **[IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)**

