---
title: "掌握 TypeScript 實用型別工具 Utility Types"
sidebar_label: "實用型別工具 Utility Types"
description: TypeScript 內建了一套實用的型別工具可以幫助開發者更有效地操作和轉換現有的型別。這些實用型別(Utility Types)提供了許多方便的語法，可以簡化常見的型別操作，如物件合併、物件子集、交集型別、聯合型別，以及對陣列或函式型別進行轉換等。本文將探討這些實用型別的用法和應用場景，協助讀者更好地利用 TypeScript 的強大型別系統，提高程式碼的可維護性和可讀性。
last_update:
  date: 2024-05-30
keywords:
  - TypeScript
  - Utility Types
  - Partial
  - Required
  - Pick
  - Omit
  - Exclude
  - Extract
tags:
  - TypeScript
---

在現代 Web 應用程式的開發中，TypeScript 已經成為一個不可或缺的程式語言。在 TypeScript 中，有一組非常強大的工具稱為 **`Utility Types`**，它可以幫助開發者輕鬆地操縱和轉換現有的型別，既可以減少重複定義類似的型別，也可以提高程式碼的可讀性。我在這篇文章中參考了 [Hannah Lin 的文章](https://medium.com/hannah-lin/typescript-%E7%94%A8%E7%94%9F%E6%B4%BB%E4%BE%8B%E5%AD%90%E5%9C%96%E8%A7%A3-utility-type-2eeee27a58cd)，將 TypeScript 的 **Utility Types** 也整理為幾個類別，使讀者更容易理解和記住這些工具。

我根據 **Utility Types** 的功能將其分成以下幾大類：

- **屬性操作類型**
- **提取和排除類型**
- **函數和實例操作類型**
- **字串操作類型**

這篇文章將介紹一些常見的 utility types，並展示它們的用法。

## **屬性操作類型**

### **Partial\<T>：將屬性設置為可選**

**Partial\<T>** 允許我們將某個類型的所有屬性設定為可選。

```tsx
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = Partial<User>;

// Infer:
// type PartialUser = {
//   id?: number;
//   name?: string;
//   age?: number;
// }
const updateUser: PartialUser = {
  name: "John",
};
```

### **Required\<T>：將屬性設置為必需**

**Required\<T>** 將某個類型的所有屬性設定為必需。

```tsx
interface User {
  id?: number;
  name?: string;
  age?: number;
}

type RequiredUser = Required<User>;

// Infer:
// type RequiredUser = {
//   id: number;
//   name: string;
//   age: number;
// }
const newUser: RequiredUser = {
  id: 1,
  name: "Jane",
  age: 30,
};
```

### **Readonly\<T>：將屬性設置為唯讀**

**Readonly\<T>** 可以將某個類型的所有屬性設定為唯讀，防止這些屬性被修改。

```tsx
interface User {
  id: number;
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;

// Infer:
// type ReadonlyUser = {
//   readonly id: number;
//   readonly name: string;
//   readonly age: number;
// }
const readonlyUser: ReadonlyUser = {
  id: 1,
  name: "Jane",
  age: 30,
};

// readonlyUser.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.
```

### **Record\<K\, T>：構建一個物件類型，其屬性鍵是類型 K，屬性值是類型 T。**

**Record\<K\, T>** 是用來建構一個物件類型，其屬性鍵是類型 **K**，屬性值是類型 **T**。

```tsx
type Page = "home" | "about" | "contact";

interface PageInfo {
  title: string;
}

type Pages = Record<Page, PageInfo>;

// Infer:
// type Pages = {
//   home: PageInfo;
//   about: PageInfo;
//   contact: PageInfo;
// }
const pages: Pages = {
  home: { title: "Home" },
  about: { title: "About Us" },
  contact: { title: "Contact" },
};
```

<br/>

## **提取與排除類型**

### **Pick\<T\, K>：從某個類型中挑選一組屬性來構建新類型**

**Pick\<T\, K>** 從某個類型中挑選一組屬性來建構新類型。

```tsx
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;

// Infer:
// type UserPreview = {
//   id: number;
//   name: string;
// }
const userPreview: UserPreview = {
  id: 1,
  name: "Jane",
};
```

### **Omit\<T\, K>：從某個類型中排除一組屬性來構建新類型**

**Omit\<T\, K>** 與 **Pick\<T\, K>** 相反，從某個類型中排除一組屬性來建構新類型。

```tsx
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserWithoutEmail = Omit<User, "email">;

// Infer:
// type UserWithoutEmail = {
//   id: number;
//   name: string;
//   age: number;
// }
const userWithoutEmail: UserWithoutEmail = {
  id: 1,
  name: "Jane",
  age: 30,
};
```

### **Exclude\<T\, U>：從某個類型中排除可以分配給另一個類型的所有屬性**

**Exclude\<T\, U>** 從某個類型中排除可以分配給另一個類型的所有屬性。

```tsx
type T = "a" | "b" | "c";
type U = "a";

type ExcludeTU = Exclude<T, U>; // 'b' | 'c'
```

### **Extract\<T\, U>：從某個類型中提取可以分配給另一個類型的所有屬性**

**Extract\<T\, U>** 則與 **Exclude** 相反，從某個類型中提取可以分配給另一個類型的所有屬性。

```tsx
type T = "a" | "b" | "c";
type U = "a" | "c";

type ExtractTU = Extract<T, U>; // 'a' | 'c'
```

### **NonNullable\<T>：排除類型中的 null 和 undefined**

**NonNullable\<T>** 用來排除類型中的 **null** 和 **undefined**。

```tsx
type T = string | number | null | undefined;

type NonNullableT = NonNullable<T>; // string | number
```

<br/>

## **函數與實例操作類型**

### **Parameters\<T>：獲取函數類型的參數類型組成的元組**

**Parameters\<T>** 用來獲取**函數類型**的參數類型組成的元組。

```tsx
type FunctionType = (x: number, y: string) => void;

type Params = Parameters<FunctionType>; // [number, string]
```

### **ConstructorParameters\<T>：獲取構造函數類型的參數類型組成的元組**

**ConstructorParameters\<T>** 用來獲取**建構函式類型**的參數類型組成的元組。

```tsx
type ClassType = new (x: number, y: string) => void;

type ConstructorParams = ConstructorParameters<ClassType>; // [number, string]
```

### **ReturnType\<T>：獲取函數類型的返回值類型**

**ReturnType\<T>** 用來獲取**函數類型**的返回值類型。

```tsx
type FunctionType = () => string;

type ReturnTypeOfFunction = ReturnType<FunctionType>; // string
```

### **InstanceType\<T>：獲取構造函數類型的實例類型**

**InstanceType\<T>** 用來獲取**建構函式類型**的實例類型。

```tsx
class User {
  constructor(public name: string, public age: number) {}
}

type UserInstance = InstanceType<typeof User>; // User
```

### **ThisParameterType\<T>：獲取函數類型中的 this 參數類型**

**ThisParameterType\<T>** 用來獲取**函數類型**中的 **this** 參數類型。

```tsx
function myFunction(this: { name: string }) {
  console.log(this.name);
}

type ThisType = ThisParameterType<typeof myFunction>; // { name: string }
```

### **OmitThisParameter\<T>：移除函數類型中的 this 參數**

**OmitThisParameter\<T>** 用來移除函數類型中的 **this** 參數。

```tsx
function myFunction(this: { name: string }) {
  console.log(this.name);
}

type NewFunctionType = OmitThisParameter<typeof myFunction>; // () => void
```

### **Awaited\<T>：解析 Promise 類型，獲取其解析值的類型**

**Awaited\<T>** 用來解析 Promise 類型，獲取其解析值的類型。

```tsx
type ExampleType = Promise<string>;

type AwaitedType = Awaited<ExampleType>; // string
```

<br/>

## **字串操作類型**

### **Uppercase\<S>：將字符串類型轉換為大寫**

**Uppercase\<S>** 將字串類型轉換為大寫。

```tsx
type Name = "john";

type UppercaseName = Uppercase<Name>; // 'JOHN'
```

### **Lowercase\<S>：將字符串類型轉換為小寫**

**Lowercase\<S>** 將字串類型轉換為小寫。

```tsx
type Name = "JOHN";

type LowercaseName = Lowercase<Name>; // 'john'
```

### **Capitalize\<S>：將字符串類型的首字母轉換為大寫**

**Capitalize\<S>** 將字串類型的首字母轉換為大寫。

```tsx
type Name = "john";

type CapitalizedName = Capitalize<Name>; // 'John'
```

### **Uncapitalize\<S>：將字符串類型的首字母轉換為小寫**

**Uncapitalize\<S>** 將字串類型的首字母轉換為小寫。

```tsx
type Name = "John";

type UncapitalizedName = Uncapitalize<Name>; // 'john'
```

<br/>

## **Reference**

- [**@TypeScript - Utility Types**](https://www.typescriptlang.org/docs/handbook/utility-types.html#uppercasestringtype)
- [**[TypeScript] 用生活例子圖解 Utility Types**](https://medium.com/hannah-lin/typescript-%E7%94%A8%E7%94%9F%E6%B4%BB%E4%BE%8B%E5%AD%90%E5%9C%96%E8%A7%A3-utility-type-2eeee27a58cd#f2be)
