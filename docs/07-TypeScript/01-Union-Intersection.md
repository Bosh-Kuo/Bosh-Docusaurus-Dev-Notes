---
title: "Union(聯合型別) 與 Intersection(交叉型別)"
sidebar_label: "Union & Intersection"
description: 這篇文章將探討 TypeScript 中的 Union（聯合型別）與 Intersection（交叉型別）。這篇文章示範了具體的程式碼範例，深入理解這兩種型別的使用情境，幫助開發者更有效地利用 TypeScript 的型別系統來構建穩健的應用程式。
last_update:
  date: 2024-05-28
keywords:
  - TypeScript
  - Union
  - Intersection  
tags:
  - TypeScript
---


## **Union(聯合型別)： `｜`**

### **定義與用法**

**Union(聯合型別)**用於表示一個變量可以是幾種不同型別中的一種。在 TypeScript 中，使用 **`|`** 符號來表示。

```tsx
let value: string | number;
value = 'Hello'; // 合法
value = 42;      // 合法
value = true;    // 錯誤，型別不匹配
```

**Union** 的行為類似於布林邏輯中的 `OR` 操作，即變數可以是多種類型中的任意一種。

### **常見應用場景與例子**

**Union** 常見的應用場景包括：

1. 定義一個函數的參數可以接受多種不同型別，以處理不同 API 返回值的類型
    
    ```tsx
    function formatValue(value: string | number): string {
      if (typeof value === 'string') {
        return value.toUpperCase();
      }
      return value.toFixed(2);
    }
    ```
    
2. 當配置物件可以接受多種不同類型的值時，可以使用 Union來描述這些配置選項
    
    ```tsx
    type ConfigOption = 'auto' | 'manual' | 'none';
    
    interface Config {
      mode: ConfigOption;
    }
    
    const config: Config = {
      mode: 'auto'
    };
    
    ```
    

## **Intersection(交集型別)： `&`**

### **定義與用法**

**Intersection(交叉型別)**用於表示一個變數必須同時滿足多個類型的條件。在 TypeScript 中，使用 **`&`** 符號來表示。

```tsx
interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type EmployeePerson = Person & Employee;

const john: EmployeePerson = {
  name: 'John',
  employeeId: 123
};
```

**Intersection** 的行為類似於布林邏輯中的 `AND` 操作，即變數必須同時滿足多個類型的條件。

:::info[**特別注意：Primitive 類型的 Intersection**]
當兩個都是原始類型（例如 **string** 和 **number**）進行 **Intersection** 操作時，結果會是 `never` 類型，表示沒有任何值能同時是這兩個原始類型。這一點需要特別注意，因為它會導致變數無法賦值任何值。
:::

### **常見應用場景與例子**

**Intersection** 常見的應用場景包括：

1. 在函數中，當一個參數需要同時滿足多個條件時，可以使用 **Intersection** 來強制實現這一要求
    
    ```tsx
    interface Serializable {
      serialize(): string;
    }
    
    interface Deserializable {
      deserialize(input: string): void;
    }
    
    type SerializableDeserializable = Serializable & Deserializable;
    
    function process(data: SerializableDeserializable) {
      const serialized = data.serialize();
      data.deserialize(serialized);
    }
    ```
    
2. 增強現有的類型，新增更多屬性或方法
    
    ```tsx
    interface BasicUser {
      name: string;
    }
    
    interface PremiumFeatures {
      premiumSupport: boolean;
      accessToBeta: boolean;
    }
    
    type PremiumUser = BasicUser & PremiumFeatures;
    
    const premiumUser: PremiumUser = {
      name: 'Bob',
      premiumSupport: true,
      accessToBeta: true
    };
    ```
    

## **Reference**

- **[@TypeScript - TypeScript for Functional Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#unions)**
- **[Day 17. 機動藍圖・複合型別 X 型別複合 - TypeScript Union & Intersection](https://ithelp.ithome.com.tw/articles/10216794)**