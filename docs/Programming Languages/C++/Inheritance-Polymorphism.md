---
title: "CH14 Inheritance and Polymorphism"
sidebar_label: "[NTU Programming Design] - Ch14 Inheritance and Polymorphism"
sidebar_position: 13
description: C++ Inheritance and Polymorphism
last_update:
  date: 2022-10-03
keywords:
  - C++
  - Inheritance 
  - Polymorphism
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::


## **Inheritance**

`OOP的3個主要特性：`
1. Encapsulation（封裝）: packaging + data hiding
2. Inheritance（繼承）
3. Polymorphism（多型）

`inheritance:` 用舊的class來產生新的class，child class會有些member已經被定義在parent class裡面就不用重複定義。

使用時機：判斷兩class關係為`XXX is a OOO`時，就會以XXX去繼承OOO。  
ex: Apple is a fruit

<!-- more -->


### **The first example**

two-dimensional (2D) vector is a vector

child用`: modifier parent_Class`來繼承
```cpp
class MyVector 
{
protected: // to be explained
    int n;
    double* m; 
public:
    MyVector();
    MyVector(int n, double m[]);
    MyVector(const MyVector& v);
    ~MyVector()
    void print() const;
    // ==, !=, <, [], =, += 
};
```

```cpp
class MyVector2D : public MyVector  // 繼承
{ 
public:
    MyVector2D();
    MyVector2D(double m[]); 
}; 
MyVector2D::MyVector2D() 
{
    this->n = 2; 
} 
MyVector2D::MyVector2D(double m[]) : MyVector(2, m) 
{ 
}

```



### **Inheriting parent class’ members**

除了private members, constructor and destructor外，parent class 定義好的member都會自動被定義在child class中。

對於parent class，protected member只能被class本身與child class拿來用，像是parent與child共同的private member的概念



### **Invoking parent class’ constructors**
parent class的constructor不會被繼承給child，但他會在child constructor建立之前先觸發以初始化一些member variable，若沒有指定的話觸發的是parent class的default constructor。

若想要呼叫特定的parent's constructor，使用the syntax for member initializer`:`傳入適當argument來初始化member variable



### **Invoking copy constructors**

若沒有定義child的copy constructor，系統會自動定義一個default copy constructor，在child的copy constructor被呼叫之前，會自動先呼叫parent的`copy constructor`

若我們有自己定義child的copy constructor，我們必須指定要call的parent constructor或實作自定義的功能，否則系統會自動呼叫parent's `default constructor`。



### **Invoking parent class’ destructor**

當child object要被消滅時，child's destructor會先被呼叫，然後parent's destructor會被自動呼叫，所以在child's destructor裡面不能清除parent's destructor會負責清除的動態記憶體配置。



### **Function overriding**

child可以重新定義已經存在parent裡的member function，也就是`overriding`，定義的時候function signature必須跟parent完全相同，否則就是child自己的新member function，在child class裡面我們也可以用`::`來呼叫parent's member function

```cpp
class MyVector2D : public MyVector 
{
public:
    // ...
    void print() const;
};

void MyVector2D::print() const
{
    cout << "2D: ";
    MyVector::print(); 
}
```



### **Cascade inheritance**

一個child class也可以有自己的child來繼承

```cpp
class NNVector2D : public MyVector2D 
{ 
public:
    NNVector2D(); // MyVector2D's
    // constructor?
    NNVector2D(double m[]); 
    void setValue(double i1, double i2);
};
NNVector2D::NNVector2D()
{
    // 會呼叫自己parent's default constructor : MyVector2D
    // MyVector2D的default constructor又會呼叫自己parent's default constructor
}
```

```cpp
NNVector2D::NNVector2D(double m[])  // 沒有指定要呼叫哪個parent's constructor就會呼叫parent's default constructor
{
    this->m = new double[2];
    this->m[0] = m[0] >= 0 ? m[0] : 0;
    this->m[1] = m[1] >= 0 ? m[1] : 0; 
} 
NNVector2D::NNVector2D(double m[]) : MyVector2D(m) 
{
    if(m[0] < 0)
        this->m[0] = 0; 
    if(m[1] < 0)
        this->m[1] = 0;
}

void NNVector2D::setValue(double i1, double i2) 
{
    if(this->m == nullptr)
        this->m = new double[2]; 
    this->m[0] = i1 >= 0 ? i1 : 0; 
    this->m[1] = i2 >= 0 ? i2 : 0;
}
```

- 當一個object被創建時，會從最老的constructor呼叫到最年輕的constructor，每一個constructor都可以透過`::`指定往上一層要呼叫哪一個constructor(不能跳過上一層呼叫上上一層的constructor    )

- 當一個object被消滅時，會從最年輕的constructor呼叫到最老的constructor， ...



### **Inheritance visibility**

當child要繼承parent時我們會加一個`modifier`如`public`在parent's class name前面，
這個modifier的作用在於指定從parent繼承下來的member的`inheritnce visibility`

- 假如一個繼承下來的member在parent裡面是protected，那child能用的`inheritnce modifier`就只有protected或private 
- 假如一個繼承下來的member在parent裡面是protected，那child能用的`inheritnce modifier`就只有private

> When one inherits something from its parent, it may `narrow` the `visibility` of these members.


<br/>


## **An example**

### **An RPG game**

Given a class **Character** that defines some general features of an RPG character, let’s create two new classes **Warrior** and **Wizard**.

The class Character includes the name, current level, accumulated experience points, and three ability levels: power, knowledge, and luck.

- There is a public function `print()`:
  - It prints out the current status of a character.
- There is a public function `beatMonster(int exp)`:
  - It is invoked when the character beats a monster. 
- There is a private function levelUp():
  - The character's level will be incremented, however her abilities will remain the same because occupations should get different improvements

參考[14_1.cpp](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall/tree/master/Lecture_Code/14.Inheritance%20and%20Polymorphism/14_1.cpp)


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
    int luck;
    void levelUp(int pInc, int kInc, int lInc);
public:
    Character(string n, int lv, int po, int kn, int lu);
    void print();
    void beatMonster(int exp);
};
```

### **Character, Warrior, and Wizard**

Character should not be used to create an object. We define two derived classes
Warrior and Wizard: (升級後的能力值應該要依職業不同而有不同提升方式)

- Character is an `abstrct class`
- Warrior and Wizard are `concrete classes`

Issue:
1. Character作為`abstrct class`不應該被用來create object，但目前仍無法限制
2. 若有一個class `Team`如下： 由於`Warrior, Wizard`是不同type，因此不能開一個array既可以存Warrior的指標, 也可以存Wizard的指標。且因為有兩個職業的關係而導致任何跟Team有關的動作都要寫兩個function，既浪費空間，操作起來又沒效率

```cpp
class Team 
{ 
private:
    int warriorCount;
    int wizardCount;
    Warrior* warrior[10];
    Wizard* wizard[10]; 
public:
    Team();
    ~Team();
    void addWar(string name, int lv);
    void addWiz(string name, int lv);
    void warBeatMonster(string name, int exp);
    void wizBeatMonster(string name, int exp);
    void printWar(string name);
    void printWiz(string name); 
};
```


<br/>


## **Polymorphism**

根據前面的example，我們是否可以用一個共通的type array去存Warrior和Wizard？  
答案是可以，我們可以用Character array同時存Warrior和Wizard。像這樣用`parent type's variable去存child type's value`就稱為`Polymorphism（多型）`

In C++ a parent variable can store a child object.



### **Why a parent variable for a child value?**

```cpp
class Parent
{
protected:
    int x;
    int y; 
public:
    Parent(int a, int b) : x(a), y(b) {} 
};
class Child : public Parent 
{
protected:
    int z; 
public:
    Child(int a, int b, int c)
    : Parent(a, b) { z = c; }
};
```

```cpp
int main 
{
    Parent p1(1, 2);
    Child c1(3, 4, 5);
    Parent p2 = c1; // OK: 5 is discarded
    // Child c2 = p1; // Not OK: no v3
return 0; 
}
```



### **Polymorphism with functions**

```cpp
void printInitial(Character c) 
{
    string name = c.getName();
    cout << name[0]; 
} 
int main 
{
    Warrior alice("Alice", 10);
    Wizard bob("Bob", 8);
    printInitial(alice);
    printInitial(bob);
    return 0; 
}

```



### **Polymorphism with arrays**

錯誤寫法：因此直接宣告Character array，本來會在array中創建空物件，但是Character沒有default constructor，所以會出錯，且Character也不應該有default constructor
```cpp
int main
{
    Character c[3]; // error! Why?
    Warrior w1("Alice", 10);
    Wizard w2("Sophie", 8);
    Warrior w3("Amy", 12);
    c[0] = w1;
    c[1] = w2;
    c[2] = w3;
    for(int i = 0; i < 3; i++)
    c[i].print(); return 0;
}
```

正確寫法：先宣告Character pointer array，等有東西要存了再存進去，注意，指標陣列是3個指標指向3塊空間，不是一個指標指向一個空間，應此要一個一個delete
```cpp
int main 
{
    Character* c[3];
    c[0] = new Warrior("Alice", 10);
    c[1] = new Wizard("Sophie", 8);
    c[2] = new Warrior("Amy", 12);
    for(int i = 0; i < 3; i++)
        c[i]->print(); 
    for(int i = 0; i < 3; i++)
        delete c[i]; // not delete [] c; 
    return 0;
}

```



### **Invoking an overridden function**

目前我們仍然無法避免創建Charater物件可以自由配創建，且會發現用了`Polymorphism`後，overriding 的function都沒有被使用到。

假設我們用parent variable(pointer)存了child value，並且用parent variable去呼叫overridden function，C++預設會呼叫parent自己的function而不是overridden function。若要呼叫overriden版本的function會需要用到`late binding`與`virtual functions.`

```cpp
class A 
{ 
public:
    void a() { cout << "a\n"; }
    void f() { cout << "af\n"; } 
};
class B : public A 
{ 
public:
    void b() { cout << "b\n"; }
    void f() { cout << "bf\n"; } 
};
```



### **Early binding vs. late binding**

For `A a = b`, the system does `early binding`:
- 在compile的時候a就已經固定裝的是A type的形狀了，b被assign給a只是把b削成a的形狀再裝進去

For `A* a = &b`, the system does `late binding`:
- a 只是一個pointer，負責指向一塊空間，本身並沒有任何形狀
- a可以指向A object也可以指向B object
- a所指向的記憶體空間儲存的`type`在`run time`時才會被決定



### **Virtual functions**

當用到Polymorphism想呼叫child function時，首先一定得用`Late binding`，type才會是child type，再來就是要宣告parent’s member function 為 `virtual`，表示呼叫的優先順序比child overriden function還低

```cpp
class Parent 
{
protected:
    int x;
    int y; 
public:
    Parent(int a, int b) : x(a), y(b) {}
    virtual void print() { cout << x << " " << y; } 
};
Class Child : public Parent 
{
protected:
    int z; 
public:
    Child(int a, int b, int c) : Parent(a, b) { z = c; }
    void print() { count << z; }
...
}
```



### **Abstract classes**

We may set beatMonster() to be a `pure virtual function`(只有外殼給child繼承，裡面沒有implement內容):

```C++
class Character 
{
    // ...
    virtual void beatMonster(int exp) = 0;   // 用 = 0來宣告為pure virtual function
};

```

宣告pure virtual function後就會自動無法create Character object了，這時候我們稱這個class為`abstract class(抽象類別)`，它存在的目的就是要給child繼承


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)
