---
title: "CH12 Operator Overloading"
sidebar_label: "[NTU Programming Design] - Ch12 Operator Overloading"
description: C++ Operator Overloading
last_update:
  date: 2022-10-02
keywords:
  - C++
  - Operator Overloading
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Motivations and prerequisites**

### **Comparing MyVector objects**

MyVector是我們自定義的class，當我們想要比較用MyVector創建的object們之間的大小時，我們可以在MyVector裡加入member function(like: `bool isEqual(const MyVector& v)`)，來實踐object間的比較。

雖然instance function可以完成任務，但似乎不夠直覺，但要是兩個MyVector object: v1, v2之間可以直接用`==`來比較就更好了，然而compiler並不知道如何直接比較self-defined data type，我們需要如同寫instance function一樣，自行定義`MyVector的==`，也就是做`operator overloading`。



<!-- more -->

### **Operator overloading**

 Most operators (if not all) have been overloaded in the C++ standard. Overloading operators for self-defined classes are not required. However, it may make programs clearer and the class easier to use. 

Some restrictions:
- Not all operators can be overloaded (see your textbook).
- The number of operands for an operator cannot be modified. (**+** can only for 2 operands)
- One cannot create new operators. (不能自創符號)



### **this**

Inside an instance function, `this` is a pointer storing the address of that object.
- `this` is a C++ keyword.
- `this->variable` 表示去該object所在的address，取出variable，相當於`(*this).variable`

```cpp
class A
{
private:
    int a; 
public:
    void f() { cout << this << "\n"; }
    A* g() { return this; } 
};

int main() 
{
    A obj;
    cout << &obj << "\n"; // 0x9ffe40
    obj.f(); // 0x9ffe40
    cout << (&obj == obj.g()) << "\n"; // 1
    return 0; 
}
```



### **Why using this?**

當class的local variable與function parameter有相同的名稱時我們就需要`this->`來分別哪一個是local variable, for example: `this->n` is the instance variable and `n` is the local variable.

This will allow other programmers (or yourself in the future) to know they are
members without looking at the class definition. 

```cpp
MyVector::MyVector(int n, int m[]) 
{
    this->n = n;
    for(int i = 0; i < n; i++)
        this->m[i] = m[i]; 
}
```

<br/>

### **Constant objects**

constant object不能呼叫那些會改變他自己instance variables的function，在C++中我們可以把`instance function`宣告成`constant instance function`，如此這些function就可以被constant object給呼叫。

宣告const instance function方法：宣告時在instance function後面加一個`const`

```cpp
class MyVector 
{ 
private:
    int n;
    int* m; 
public:
    MyVector();
    MyVector(int dim, int v[]);
    MyVector(const MyVector& v);
    ~MyVector();
    void print() const; 
};
```

For a constant instance function:
- 可以被non-constant objects呼叫
- 不可以修改任何instance variable

For a non-constant instance function:
- 不可以被constant objects給呼叫，即便沒有任何instance variable被更改



### **Constant instance variables**
We may have constant instance variables. 

constant instance variable要被constructor初始化時一定會經過assign value的過程，
然而不論locally or globally, constant instance variable不能被assigned數值，因此個constant instance variable時我們需要`member initializer`。

`member initializer`的用法為在constructor後接上`:constant instance variable名稱(value)`

```cpp
MyVector::MyVector() : n(0) initializer.
{
    m = nullptr; 
} 
MyVector:: MyVector(int dim, int v[]) : n(dim) 
{
    for(int i = 0; i < n; i++)
        m[i] = v[i]; 
} 
MyVector:: MyVector(const MyVector& v) : n(v.n) 
{
    m = new double[n]; 
    for(int i = 0; i < n; i++)
        m[i] = v.m[i];
}
```


<br/>


## **Overloading comparison and indexing operators**

### **Overloading an operator**

An operator is overloaded by “`implementing a special instance function`”. 看起來就像在寫member function，且不可以宣告成static function，因為被overloaded的operators都是對object做事情，不是對class做事情。

The keyword operator is used for overloading operators:
> `operator`運算符號



### **Overloading ==**
```cpp
class MyVector 
{ 
private:
    int n;
    double* m; 
public:
    // others
    bool operator==(const MyVector& v) const; 
};

bool MyVector::operator==(const MyVector& v) const 
{
    if(this->n != v.n)
        return false; 
    else 
    {
        for(int i = 0; i < n; i++) 
        {
            if(this->m[i] != v.m[i])
                return false;
        } 
    } return true;
}

int main() // with overloading 
{
    double d1[5] = {1, 2, 3, 4, 5};
    const MyVector a1(5, d1);
    double d2[4] = {1, 2, 3, 4}; 
    const MyVector a2(4, d2); 
    const MyVector a3(a1);
    cout << (a1 == a2 ? "Y" : "N"); 
    cout << "\n"; 
    cout << (a1 == a3 ? "Y" : "N"); 
    cout << "\n";
    return 0; 
}
```



### **Overloading <**

```cpp
class MyVector 
{ 
private:
    int n;
    double* m; 
public:
    bool operator==(const MyVector& v) 
    const; bool operator<(const MyVector& v) const;
};

bool MyVector::operator<(const MyVector& v) const 
{
    if(this->n != v.n)
        return false; 
    else
    {
        for(int i = 0; i < n; i++) 
        {
            if(this->m[i] >= v.m[i])
                return false;
        } 
    } 
    return true;
}
```



### **Overloading !=**

```cpp
class MyVector 
{
    // ...
    bool operator==(const MyVector& v) const;
    bool operator!=(const MyVector& v) const;
};

bool MyVector::operator!=(const MyVector& v) const
{
  return !(*this == v);
}
```

<br/>

### **Parameters for overloaded operators**

傳入overloaded operators的parameters數量有限制，其他都沒有限制
```C++
class MyVector
{
    // ...
    bool operator==(const MyVector& v) const;
    bool operator==(int i, int j); // error
}
```

<br/>

### **Overloading the indexing operator**

對於我們自定義的class MyVector來說還沒有可以存取裡面任意一個數的方法，因此我們可以為MyVector overload `[]`

```cpp
class MyVector
{
    //...
    double operator[](int i) const;
    double& operator[](int i);
}

double MyVector::operator[](int i) const
{
  if(i < 0 || i >= n)
    exit(1);
  return m[i];
}
double& MyVector::operator[](int i) 
{
  if(i < 0 || i >= n)
    exit(1);
  return m[i];
}

int main() 
{
    double d1[5] = {1, 2, 3, 4, 5};
    MyVector a1(5, d1); // non-const
    cout << a1[1] << endl; // 2
    a1[1] = 4; // good
    cout << a1[1] << endl; // 4
    return 0; 
}
```

constant與non-constant版本的差別在於:
const版回傳literal value而非變數，因此無法用來賦值，non-constant版回傳reference因此可以用來賦值
- constant function只被const object使用
- non-constant function只被non-const object使用


<br/>


## **Overloading assignment and self-assignment operators**

### **Default assignment operator**

assignment operator與其他operator不一樣，它本來就被loverloaded過了，compiler會自動幫每個class加上default assignment operator，但做的是shallow copy遇到pointer/array時就會有問題，且當class中有constant member時就會出錯，因此我們可以自己做`=`的overloading



### **Overloading the assignment operator**
Just like the copy constructor, the assignment operator should be manually overloaded when there are pointers in a class. 

```cpp
class MyVector
{
    MyVector& operator=(const MyVector& v)
};

const MyVector& MyVector::operator=(const MyVector& v)
{
  if(this != &v)
  {
    if(this->n != v.n)
    {
      delete [] this->m;
      this->n = v.n;
      this->m = new double[this->n];
    }
    for(int i = 0; i < n; i++)
      this->m[i] = v.m[i];
  }  
  return *this;
}
```



### **Preventing assignments and copying**

In some cases, we `disallow` `assignments` between objects of a certain class.
- To do so, overload the assignment operator as a `private` member. 

In some cases, we `disallow` creating an object by `copying` another object.
- To do so, implement the copy constructor as a `private` member. 

The copy constructor, assignment operator, and destructor form a group.
- If there is no pointer, none of them is needed.
- If there is a pointer, all of them are needed.


<br/>


## **Overloading addition operators**

```C++
class MyVector 
{
    // ...
    const MyVector operator+(const MyVector& v); 
}; 
const MyVector MyVector::operator+(const MyVector& v) 
{
    MyVector sum(*this); // creating a local variable
    sum += v; // using the overloaded +=
    return sum; 
}
```

Why not returning `const MyVector&`?

因為sum是local variable，若回傳reference的話，local variable會在函數結束後被清除，回傳的reference也會跟著被清除而出錯，因此要直接回傳一個object(會用到deep copy)


### **Instance function vs. global function**
One last issue: addition is commutative, but the program below does not run!
```cpp
int main() 
{
    double d1[5] = {1, 2, 3, 4, 5};
    MyVector a1(5, d1);
    a1 = 4.2 + a1; // bad!
    a1.print();
    return 0; 
}
```

當double放+前面時，double variable無法使用MyVector的instance function `operator+`，若要做到的話就要overload+ 為一個`global function`



### **A global-function version**

```cpp
const MyVector operator+(const MyVector& v, double d)
{
  MyVector sum(v);
  for(int i = 0; i < v.n; i++)
    sum[i] += d;
  return sum;
}
const MyVector operator+(double d, const MyVector& v)
{
  return v + d;
}
const MyVector operator+(const MyVector& v1, const MyVector& v2)
{
  MyVector sum(v1); 
  sum += v2;
  return sum;
}
```


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)
