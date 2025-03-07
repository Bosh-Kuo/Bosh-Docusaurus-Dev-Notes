---
title: type 和 interface 誰才是最佳選擇？
sidebar_label: "Type & Interface"
description: 這篇文章深入剖析兩者的 異同、優勢與適用情境，幫助你在開發時做出最佳選擇！我們將從 基礎概念、語法比較、最佳實踐 到 實務案例 全面解析，並提供清晰的選擇指南。
last_update:
  date: 2025-03-07
keywords: [TypeScript, Interface, Type]
tags: [TypeScript]
---

## **前言**

在開始學習 TypeScript 時，我們很快就會接觸到 `type` 和 `interface` 這兩種型別定義方式。看起來它們都能描述物件，甚至在許多情境下可以互換使用。但讓很多初學者感到疑惑的是：

> 「在這個情況下，我到底應該用 type 還是 interface？」
> 

我自己一直以來都沒有特別在意什麼時候該用 type，什麼時候該用 interface，直到最近在維護舊專案時，發現這樣隨意交錯使用 type 和 interface 讓我的程式碼的可讀性變得很差，因此決定稍微研究一下 type 和 interface 的差異，幫助我未來在決定使用任一者時，有個比較明確的準則。


<br/>


## **`type` 與 `interface` 語法比較**

以下是 `type` 和 `interface` 在不同功能上的對比：

|                                             | `type`      | `interface` |
| ------------------------------------------- | ----------- | ----------- |
| **物件型別定義**                            | ✅           | ✅           |
| **擴展（繼承）型別**                        | `&`（交集） | `extends`   |
| **可定義聯合型別（Union）**                 | ✅           | ❌           |
| **可定義基本型別（如 `string`、`number`）** | ✅           | ❌           |
| **可定義元組（Tuple）**                     | ✅           | ❌           |
| **可多次定義（會自動合併）**                | ❌           | ✅           |
| **可用於 `class implements`**               | ⚠️           | ✅           |

### **1️⃣ 物件型別的基本定義**

**使用 `type`**

```tsx
type User = {
  name: string;
  age: number;
};
```

**使用 `interface`**

```tsx
interface User {
  name: string;
  age: number;
}
```

無論 `type` 還是 `interface`，最基本的用途都是用來定義物件型別，這兩種方式在這種簡單的物件型別定義上**完全等價**，但當我們需要進一步擴展型別時，兩者就開始出現不同了。


### **2️⃣ 型別擴展（繼承）**

**使用 `interface extends`**

`interface` 使用 `extends` 來擴展另一個 `interface`：

```tsx
interface User {
  name: string;
  age: number;
}

interface Admin extends User {
  role: string;
}

const admin: Admin = {
  name: "Alice",
  age: 30,
  role: "superadmin",
};
```

這種方式 **更接近物件導向設計**，類似於 `class` 的繼承。

**使用 `type &`**

`type` 使用 **交集（Intersection Type，`&`）** 來合併型別：

```tsx
type User = {
  name: string;
  age: number;
};

type Admin = User & { role: string };

const admin: Admin = {
  name: "Alice",
  age: 30,
  role: "superadmin",
};
```

雖然 `&` 和 `extends` 的結果在這裡看起來一樣，但 `&` **可以用來合併任何型別**，不只限於物件，這是 `type` 更靈活的地方。


### **3️⃣ `type` 可以定義聯合型別**

這是 `type` 最大的優勢之一，它可以定義「多種可能性」的型別，而 `interface` 則不行。

**`type` 定義聯合型別**

```tsx
type Status = "success" | "error" | "loading";

let currentStatus: Status;

currentStatus = "success"; // ✅ 合法
currentStatus = "loading"; // ✅ 合法
currentStatus = "failed";  // ❌ 錯誤，因為 "failed" 不是 Status 的成員
```

:::warning
`interface` 只能描述物件，不能像 `type` 一樣定義基本型別或聯合型別。
:::


### **4️⃣ `type` 可以定義基本型別**

`type` **可以用來定義基本型別的別名（alias）**，但 `interface` **只能用來定義物件**。

**`type` 定義基本型別**

```tsx
type ID = string | number;

let userId: ID;

userId = "abc123"; // ✅ 合法
userId = 123456;   // ✅ 合法
userId = true;     // ❌ 錯誤，因為 `boolean` 不是 `ID` 的成員
```

**`interface` 無法這樣做**

```tsx
interface ID = string | number; // ❌ 錯誤，interface 不能用來定義基本型別
```

### **5️⃣ `type` 可以定義元組（Tuple）**

當我們需要定義 **「固定長度、特定順序」的陣列**，使用 `type` 會更適合。

**`type` 定義元組**

```tsx
type Coordinate = [number, number];

const point: Coordinate = [10, 20]; // ✅ 合法
const invalidPoint: Coordinate = [10, "20"]; // ❌ 錯誤，因為第二個值必須是 number
```

:::warning
**`interface` 無法直接定義元組**
:::


### **6️⃣ `interface` 具備「宣告合併」特性**

當 `interface` 在不同地方出現，且名稱相同，TypeScript 會自動將它們合併。

```tsx
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = { name: "Alice", age: 30 }; // ✅ 自動合併
```

::: warning
但這種合併行為**在大型專案中可能導致難以預測的問題**，因為型別可能會在不同地方被修改，而開發者不一定能立即發現。
:::

如果嘗試使用相同名稱定義 `type`：

```tsx
type User = { name: string };
type User = { age: number }; // ❌ TypeScript 會報錯：Duplicate identifier 'User'
```

### **7️⃣ `interface` 更適合 `class implements`**

雖然 `class` **可以** `implements` `type`，但 `interface` **通常更適合**，因為 `interface` 具有擴展性，並且在 `class implements` 時提供更好的錯誤檢查。

**✅ `interface` 可搭配 `class`**

```tsx
interface Serializable {
  serialize(): string;
}

class User implements Serializable {
  serialize() {
    return JSON.stringify(this);
  }
}
```

`interface` 直接定義結構，並可以讓 `class` `implements`，這是 TypeScript 官方推薦的方式。

**✅ `type` 也可以 `implements`，但要是物件結構**

如果 `type` 定義的是物件類型，`class` 也是可以 `implements` 它的：

```tsx
type Serializable = {
  serialize(): string;
};

class User implements Serializable {
  serialize() {
    return JSON.stringify(this);
  }
}
```

這是完全合法的 `implements`，因為 `Serializable` 是一個物件類型。

**❌ `type` 不能 `implements` 非物件類型**

如果 `type` 不是單純的物件結構，而是聯合類型或函式類型，`class` **就不能 `implements` 它**：

```tsx
type StringOrNumber = string | number;

class MyClass implements StringOrNumber {} // ❌ 錯誤：無法實作聯合類型
```

這會報錯，因為 `StringOrNumber` 不是一個明確的物件結構，`class` 無法對應這種類型。


<br/>


## **`interface` 的優勢與適用情境**

雖然 `type` 更靈活，但在某些情境下，`interface` 仍然具有 **不可取代的優勢**，以下是 `interface` 在實務上的三大優勢，並搭配範例說明何時應該使用它。

### **適合用於物件導向設計**

在物件導向開發中，型別之間的關係通常是「**某個型別衍生自另一個型別**」，當型別之間存在**層級關係**，且需要**繼承**或**擴展**時，`interface` 的 `extends` 比 `type` 的 `&` 交集更直觀，這對於需要大量擴展的型別（如 API 回應物件、後端 DTO） 特別有幫助。

```tsx
interface User {
  name: string;
  age: number;
}

interface Admin extends User {
  role: string;
}

const admin: Admin = {
  name: "Alice",
  age: 30,
  role: "superadmin",
};
```

### **適合 `class implements`**

TypeScript 中，`interface` 通常比 `type` 更適合用來定義類別（class）的型別，因為 `interface` 是專門設計來描述物件結構的，並且允許類別使用 `implements` 來確保符合特定規範。此外，`interface` 也支援擴展（`extends`），更適合面向物件導向（OOP）的設計。

📌 **使用 interface 確保 class 遵守規範**

```tsx
interface Serializable {
  serialize(): string;
}

class User implements Serializable {
  serialize() {
    return JSON.stringify(this);
  }
}
```

這樣的設計讓 `class` 明確地遵循一個既定的型別規範，對於團隊開發而言，有助於維護一致的設計。

📌 **type 也可以被 implements，但 interface 更適合**

在 TypeScript 中，`type` 其實可以被 `implements`，但前提是它表示的是物件型別。如果 `type` 是聯合型別（union type）或其他非物件型別，則無法被 `implements`例如：

```tsx
type StringOrNumber = string | number;

class Example implements StringOrNumber { // ❌ 錯誤：無法 `implements` 聯合型別
  value = "hello";
}
```

### **擴展第三方函式庫型別**

在 TypeScript 中，我們經常需要擴展第三方函式庫的型別，例如 **Express.js 的 `Request` 型別**，這時 `interface` 的宣告合併特性特別有用。

```tsx
declare module "express" {
  interface Request {
    user?: User;
  }
}
```

這樣一來，`Request` 物件就會額外擁有 `user` 屬性，而不會影響到原始的 `Request` 定義。


<br/>


## **`type` 的優勢與適用情境**

### **適合使用 TypeScript 內建的工具型別**

TypeScript 提供了許多 **工具型別（Utility Types）** 來讓型別操作更加方便，而 `type` 在使用這些工具型別時比 `interface` **語法更直覺**。

假設我們有一個 `User` 型別：

```tsx
type User = {
  name: string;
  age: number;
  createdAt: Date;
};
```

如果我們想要定義一個 `Guest` 型別，它與 `User` 相似，但不需要 `name` 和 `age`，我們可以使用 **`Omit`**：

```tsx
type Guest = Omit<User, "name" | "age">;

const guest: Guest = {
  createdAt: new Date(),
}; // ✅ 合法
```

雖然 `interface` 也能透過 `extends` 來達到類似效果，但語法較為冗長：

```tsx
interface User {
  name: string;
  age: number;
  createdAt: Date;
}

interface Guest extends Omit<User, "name" | "age"> {} // ✅ 但語法較不直覺
```

### **`type` 具備更好的 Index Signature 相容性**

另一個 `type` 和 `interface` 的細微差異在於 **索引簽名（Index Signature）** 的行為不同。

**🛑 `interface` 可能遇到的錯誤**

假設我們有一個 `KnownAttributes` 型別，它定義了 `x` 和 `y` 屬性：

```tsx
interface KnownAttributes {
  x: number;
  y: number;
}

const knownAttributes: KnownAttributes = {
  x: 1,
  y: 2,
};

type RecordType = Record<string, number>;

const oi: RecordType = knownAttributes;
// ❌ 錯誤：型別 'KnownAttributes' 無法指派給 'RecordType'。
//  缺少了索引簽名。
```

:::warning
錯誤的原因是 `interface` 可能會在未來被擴展，而 TypeScript 無法確保它不會新增與 `Record<string, number>` 不匹配的屬性。
:::

**✅ 解決方式1: 顯式為 `interface` 添加索引簽名**

我們可以透過在 `interface` 中明確聲明索引簽名來修正這個問題：

```tsx
interface KnownAttributes {
  x: number;
  y: number;
  [index: string]: unknown; // 額外新增的索引簽名
}
```

**✅ 解決方式2: 直接使用 `type`**

如果我們使用 `type`，則不需要額外的索引簽名，因為 `type` 本身允許隱式匹配：

```tsx
type KnownAttributes = {
  x: number;
  y: number;
};

const knownAttributes: KnownAttributes = {
  x: 1,
  y: 2,
};

type RecordType = Record<string, number>;

const oi: RecordType = knownAttributes; // ✅ 這裡不會報錯
```

這顯示了 **`type` 在某些情境下比 `interface` 具有更好的相容性**，因為它不會受到 `interface` 可能被擴展的影響。


<br/>


## **結論：`type` vs `interface` 如何選擇？**

早期 TypeScript 文件提到 `interface` 可能在 TypeScript 型別檢查 上有些微效能優勢，但 TypeScript 團隊後來澄清，這在現代 TypeScript 版本中已經不再是考量因素。兩者的效能基本上沒有顯著差異，所以不應該基於效能考量來選擇。經過 TypeScript 社群長時間的討論，`type` 和 `interface` 各有其優勢，最終的選擇不應該是「哪個更好」，而是「哪個在特定情境下更適合」。以下是簡要的結論：

> **`interface` 適合 OOP 設計與擴展；`type` 更靈活，適合大多數情境**
> 

綜合我們上述整理的內容，我認為在一個 TS 專案中的最佳實踐如下：

- 在大部分專案中，預設選擇 `type`，因為它更靈活且不會發生意外的合併行為。
- 當你需要 `extends`、`implements` 或擴展第三方函式庫時，選擇 `interface`。
- 團隊內應該制定統一的 型別設計規範，確保一致性，減少混用帶來的維護困難。


<br/>


## **Reference**

- [**Why use Type and not Interface in TypeScript**](https://www.youtube.com/watch?v=Idf0zh9f3qQ&ab_channel=ByteGrad)
- [**Type vs Interface: Which Should You Use?**](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)
- [**TypeScript: Should you use Types or Interfaces?**](https://www.youtube.com/watch?v=zM9UPcIyyhQ&ab_channel=MattPocock)