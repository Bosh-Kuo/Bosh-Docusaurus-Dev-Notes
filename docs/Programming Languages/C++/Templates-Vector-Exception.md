---
title: "CH15 Templates, Vector and Exception"
sidebar_label: "[NTU Programming Design] - Ch15 Templates, Vector and Exception"
sidebar_position: 14
description: C++ Templates, Vector and Exception
last_update:
  date: 2022-10-03
keywords:
  - C++
  - Templates
  - Vector
  - Exception
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Templates**

### **Recall Warriors and wizards**

```cpp
class Character 
{ 
protected:
    static const int EXP_LV = 100;
    string name;
    int level;
    int exp;
    int power;
    int knowledge;
    int luck; // ... 
};
```

在前一章節的範例中我們用 `srtring name`作為key來搜尋或區別不同的object，但當有多個object的name attribute是相同的時候就會出問題，因此可能會想要把string name這個attribute改成 int id之類的來做為區別不同object的key。然而若我們把name的type改為int，或許我們某一天又會想要把它改回來成string，我們可能會考慮implement兩個不同版本的class，但這又路造成閱讀與維護上的麻煩。

<!-- more -->



### **Templates**

從上面Character的範例中我們需要`key`的`data type`可供彈性選擇，在C++裡`templates`就可以做到這件事，且不只可以應用在class也可以應用在function。

C++ class templates 要求我們在呼叫function或建立物件時傳入一個`data-type argument`，如：
- `Warrior<string> w1("Alice", 10);`
- `Wizzard<int> w2(16, 5);`



### **Template declaration**

Template的用意就是讓使用者可以一情況決定傳入或者要使用的member的`data type`，因此data type對於template來說就像是一個變數，我們在宣告的時候會用到`template`與`typename`

```cpp
template<typename T> 
class TheClassName 
{
// T can be treated as a type inside the class definition block 
};
```

當使用template來宣告class，它的成員變數也要一起改變寫法
```cpp
template<typename T>  
T TheClassName<T>::f(T t) 
{
    // t is a variable whose type is T 
};

template<typename T>
void TheClassName<T>::f(int i) 
{
    //follow the rule even if T is not used 
};
```



### **Template invocation**

To instantiate an object, pass a type argument.

```cpp
int main() 
{
    TheClassName<int> a;
    TheClassName<double> b;
    TheClassName<AnotherClassName> c; 
};
```

exp:
```cpp
#include <iostream> 
using namespace std;

template<typename T> 
void f(T t) 
{
    cout << t; 
}

int main() 
{
    f<double>(1.2); // 1.2
    f<int>(1.2); // 1
    return 0; 
}

// When we invoke f with f<double>, the function is
void f(double t) 
{
    cout << t; 
}

// When we invoke f with f<int>, the function is
void f(int t) 
{
    cout << t; 
}
```

We may also have multiple type parameters.

```cpp
#include <iostream> 
using namespace std;
template<typename A, typename B> 
void g(A a, B b) 
{
    cout << a + b << endl; 
}

int main() 
{
    g<double, int>(1.2, 1.7); // 2.2
    return 0; 
}
```

An example with classes

```cpp
#include <iostream> 
using namespace std;

template<typename T> 
class C 
{ 
public:
    T f(T i); 
};

template<typename T> 
T C<T>::f(T i) 
{
return i * 2; 
}

int main() 
{
    C<int> c;
    cout << c.f(10) << endl;
    return 0; 
}

```



### **Revising the classes**

Let’s revise our definitions of Character, Warrior, Wizard, and Team. 

```cpp
template <typename KeyType> 
class Character 
{ 
protected:
    static const int EXP_LV = 100;
    KeyType name;
    int level;
    int exp;
    int power;
    int knowledge;
    int luck;
    void levelUp(int pInc, int kInc, int lInc); 
public:
    Character(KeyType n, int lv, int po, int kn, int lu);
    virtual void beatMonster(int exp) = 0;
    virtual void print();
    KeyType getName(); 
};
```

參考[15_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/15.Templates%2C%20Vectors%2C%20and%20Exceptions/15_1.cpp)

當parent class使用template後，child繼承時就不能再使用原本的parent's class name了，必須要加上`<typename>`

```cpp
template <typename KeyType> 
class Warrior : public Character<KeyType> // no class "Character"
{                                         // there is "Character<int>",
private:                                  // "Character<string>", etc.
    static const int PO_LV = 10;
    static const int KN_LV = 5;
    static const int LU_LV = 5; 
public:
    Warrior(KeyType n, int lv = 0);
    void print();
    void beatMonster(int exp); 
};
```



### **In the main function**

使用template以後Team就可以用string作為key type也可以用int作為key type，有更靈活的運用
```cpp
int main() 
{
    Team<string> t;
    t.addWarrior("Alice", 1); 
    t.memberBeatMonster("Alice", 10000); 
    t.addWizard("Bob", 2); 
    t.printMember("Alice");

    Team<int> t2;

    t2.addWarrior(1, 1); 
    t2.memberBeatMonster(1, 10000); 
    t2.addWizard(2, 2); 
    t2.printMember(1);

    return 0; 
}

```



### **Remark**

當我們做了class template，很可能會預到自己傳入的data type不是basic data type，而不能直接做opration的狀況（像是傳入一個class進去），那這時我們就得為有可能傳入的KeyType做`operation overloading`

```cpp
template <typename KeyType> 
void Team<KeyType>::memberBeatMonster(KeyType name, int exp) {
    for(int i = 0; i < this->memberCount; i++) {
        if(this->member[i]->getName() == name) {
            this->member[i]->beatMonster(exp);
            break; }
        } 
}

```


<br/>


## **The standard library `<vector>`**

### **A good reason to use templates**

For strings:
- We use a character array to represent a C string.
- We use the class string to represent a C++ string.
- The latter is to `embed the former into a class` and `add useful functions`. 

除了char，我們也會想對int, double等data type做一樣的事，將資料包進class中的動態陣列並且添加一些有用的function。

> All we need is a class with an embedded dynamic array `for something`.  
> Perfect for `templates`!



### **The standard library `<vector>`**

In C++, there is a `standard template library (STL)`. 
- It provides containers, iterators, algorithms, and functions. 

The class `vector` with templates is defined and implemented in the standard
library `<vector>`. It is just a “dynamic vector” of any type.

- It is a class with an embedded one-dimensional dynamic array. 
- It has many useful member functions (including overloaded operators). 
- It is implemented with templates.

create a vector:

```cpp
vector<int> v1; // integer vector 
vector<double> v2; // double vector 
vector<Warrior> v3; // Warrior vector
```

- Member functions that modifies a vector: push_back(), pop_back(), insert(), erase(), swap(), =, etc. 
- Member functions for one to access a vector element: [], front(), back(), etc. 
- Member functions related to the capacity: size(), max_size(), resize(), etc.




### **Rewriting Team using vector**

```cpp
template <typename KeyType>
class Team
{
private:
  vector<Character<KeyType>*> member;  // Character<KeyType>*的vector
public:
  Team();
  ~Team();
  void addWarrior(KeyType name, int lv);
  void addWizard(KeyType name, int lv);
  void memberBeatMonster(KeyType name, int exp);
  void printMember(KeyType name);
};

template <typename KeyType>
void Team<KeyType>::addWarrior(KeyType name, int lv) 
{
  Warrior<KeyType>* wPtr = new Warrior<KeyType>(name, lv);   // 必須用動態記憶體配置，因為local variable會在函數呼叫結束自動被清除
  this->member.push_back(wPtr);
}

template <typename KeyType>
void Team<KeyType>::addWizard(KeyType name, int lv)
{
  Wizard<KeyType>* wPtr = new Wizard<KeyType>(name, lv); 
  this->member.push_back(wPtr);
}
```

參考[15_2.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/15.Templates%2C%20Vectors%2C%20and%20Exceptions/15_2.cpp)



### **Remarks**

We do need a destructor to release those dynamically created Warrior and Wizard.

```cpp
template <typename KeyType>
Team<KeyType>::~Team()
{
  while(this->member.size() > 0)
  {
    delete this->member.back();  // 找到vector中最後一個指標，把它所指到的空間清掉
    this->member.pop_back();  // 再把存在vectore裡的指標清掉
  }
}
```

## **Exception Handling**

### **Exceptions**

Exceptions are those thing that are not expected to happen. that typically refers to `logic` or `run-time errors`. 

即便我們寫了一些檢查用的判斷式仍然不夠powerful：
- 判斷式回傳的true或false可能有千百種可能的理由，很難總是作為error的處理依據
- 判斷式回傳的通常是一個value，而不是`messages`，print out不算message，也不應該隨便print out訊息
- 我們不能強制使用者對判斷式的回傳值有所回應

C++提供`exception handling`去處理`logic` or `run time error`，當程式執行出現error時會丟出一個`exception`，使用者用`catch`去接這個exception做對應的處理。



### **Try and catch**

```cpp
try 
{
// statements that may throw exceptions 
} 
catch(ExceptionClass identifier) // this kind? 
{
// responses 
} 
catch(AnotherExceptionClass identifier) // that kind? 
{
// other responses 
}
```

當程在try block中發生error時會丟出exception，try block剩下的程式碼會被忽略，城市會找到對應的catch block執行，若沒有對應的catch block，就有可能發生`abnormal program termination`。

若在try block中發生了exception，那些在block裡的`靜態宣告物件`會自動呼叫他們的`destructor`，以避免memory leak，但是動態配置的記憶體不會，因此最好不要再try block動態配置記憶體。



### **Example: string::replace()**

`replace()`這個函式再C++ libary裡面被定義為有可能會丟一個`out_of_range exception`

`out_of_range`是定義在`<stdexcept>`裡的一個class，若我們沒有處理這個exception，成是可能會以不正常的方式關閉


```cpp
#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;
void g(string& s, int i)
{
    try {
        s.replace(i, 1, ".");
    }
    catch(out_of_range e) {
        cout << "...\n";
    }
}

int main()
{
    string s = "12345";
    int i = 0;
    cin >> i;
    g(s, i);
    cout << s << endl;
    return 0;
}
```



### **Standard exception classes**

C++ standard libary中有以下些exception classes:

exception
- logic_error
  - domain_error
  - invalid_argument
  - length_error
  - out_of_range
- runtime_error
  - range_error
  - overflow_error
  - underflow_error

這些classes之間用到了`Inheritance`and`polymorphism`! 因此我們可以用parent's class container去裝child value

```cpp
try {
    g(s, i); } // this also works 
catch(logic_error e) {
    cout << "...\n"; 
}
```



### **Throwing an exception**

We may also throw an exception by ourselves.
- `what()` returns the message generated when throwing an exception

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;
void f(int a[], int n) throw(logic_error)
{
    int i = 0;
    cin >> i;
    if(i < 0 || i > n)
    throw logic_error("...");
    a[i] = 1;
}

int main()
{
    int a[5] = {0};
    try {
        f(a, 5);
    }
    catch(logic_error e) {
        cout << e.what();
    }
    for(int i = 0; i < 5; i++)
        cout << a[i] << " ";
    return 0;
}
```



### **Modifying the function header**

如果我們在function header後面加上 `throw(type1, type2)`，代表function只能丟出header指定的exception或它的child，如果都不寫，就代表這個function可以丟出所有exception，有家的會可以提供使用這個韓式的人的閱讀性。

如果函數絕不會丟出exception，我們可以在function 後面加上`noexcept`，告訴別人使用這個函式不用catch exception。


exp:
```cpp
size_t length() const noexcept;
```

<br/>

### **Defining your own exception classes**

若要寫一個字定義的exception class，必須繼承C++ 定義的`standard exception classes`

```cpp
#include <stdexcept>
using namespace std;

class MyException : public exception
{
public:
    MyException(const string& msg = "")
        : exception(msg.c_str()) {}
};
```


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)
