---
title: Zod v4 使用指南：資料驗證核心功能
sidebar_label: Zod
description: Zod v4 是一個 TypeScript-first 的 schema 驗證庫，提供靜態型別推導。本文涵蓋基本用法、原始型別、物件、陣列、聯合型別、型別轉換、錯誤處理等核心功能，並深入探討 Schema 設計模式與實務應用。
last_update:
  date: 2024-11-26
keywords: [npm 套件, npm packages, zod, zod v4, schema validation, TypeScript, type inference]
tags: [npm packages]
---

:::note
本文基於 **Zod v4** 版本撰寫。Zod 4 於 2025 年發布，帶來了顯著的效能提升、更小的 bundle size，以及多項新功能如內建 JSON Schema 轉換、遞迴物件支援等。
:::

## **基本用法**

### **定義 Schema**

「Schema」是 Zod 的核心概念，它同時扮演兩個角色：**執行期驗證器**與**編譯期型別定義**。

傳統的 TypeScript 開發中，通常需要分別維護兩套定義：一套是 TypeScript 的 `interface` 或 `type` 用於編譯期型別檢查，另一套是執行期的驗證邏輯（如手寫的 `if` 判斷或使用其他驗證庫）。這種分離帶來同步問題——當資料結構改變時，必須同時更新兩個地方，否則就會產生型別定義與實際驗證邏輯不一致的 bug。

Zod 採用「單一來源」（Single Source of Truth）的設計理念來解決這個問題。只需要定義一次 schema，Zod 就會同時提供：

1. **執行期驗證**：在程式運行時檢查資料是否符合預期結構
2. **編譯期型別**：透過 `z.infer` 自動推導出對應的 TypeScript 型別

修改 schema 時，型別定義會自動跟著改變，不需要手動同步，從根本上消除了型別與驗證邏輯不同步的風險。

```typescript
import { z } from "zod";

const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
});
```

### **解析資料 (parse)**

使用 `.parse()` 驗證資料。驗證成功時會回傳一個經過驗證的**深層複製**資料，這確保了原始資料不會被意外修改，同時也讓 TypeScript 能夠正確推導出回傳值的型別。

```typescript
const user = UserSchema.parse({ username: "john", age: 25 });
// => { username: "john", age: 25 }

// 驗證失敗會拋出 ZodError
UserSchema.parse({ username: 123, age: "25" }); // throws ZodError
```

### **安全解析 (safeParse)**

相較於 `.parse()` 會拋出例外，`.safeParse()` 回傳一個 discriminated union，可以用 `if/else` 處理成功與失敗的情況，不需要 try/catch。在表單驗證或 API 輸入處理時，通常會選擇 `.safeParse()`，因為驗證失敗是預期中的情況，不應該用例外來處理。

```typescript
const result = UserSchema.safeParse({ username: "john", age: 25 });

if (!result.success) {
  console.log(result.error); // ZodError
} else {
  console.log(result.data); // { username: string; age: number }
}
```

### **非同步解析**

當 schema 包含非同步操作（如 async refinements 或 async transforms）時，必須使用非同步版本的解析方法。常見的應用場景包括：驗證 email 是否已被註冊、檢查使用者名稱是否可用等需要查詢資料庫的情況。

```typescript
await UserSchema.parseAsync(data);
await UserSchema.safeParseAsync(data);
```

### **型別推導 (Type Inference)**

Zod 最強大的特性之一是能夠從 schema 自動推導出 TypeScript 型別。只需要定義一次 schema，就能同時獲得執行期驗證和編譯期型別檢查。

```typescript
const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
});

// 使用 z.infer 提取型別
type User = z.infer<typeof UserSchema>;
// => { username: string; age: number }

// 現在可以在任何地方使用這個型別
const user: User = { username: "john", age: 25 };
```

當 schema 包含轉換邏輯時，輸入與輸出型別可能不同。Zod 提供了 `z.input` 和 `z.output` 來分別提取這兩種型別：

```typescript
const schema = z.string().transform((val) => val.length);

type SchemaInput = z.input<typeof schema>;  // string
type SchemaOutput = z.output<typeof schema>; // number (等同於 z.infer)
```

---

## **原始型別 (Primitives)**

Zod 提供了對應 JavaScript 所有原始型別的 schema。這些是建構更複雜 schema 的基礎元件。

```typescript
// 基本型別
z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

// 空值型別
z.undefined();
z.null();
z.void(); // 接受 undefined

// 萬用型別
z.any();
z.unknown();

// Never 型別
z.never();
```

### **字面值 (Literals)**

字面值 schema 用於驗證特定的固定值，常用於建構 discriminated union 或定義常數型別。

```typescript
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const isTrue = z.literal(true);

// 取得字面值
tuna.value; // "tuna"
```

---

## **字串驗證 (Strings)**

字串是最常見的驗證對象。Zod 提供了豐富的內建驗證方法，涵蓋長度限制、格式驗證、內容檢查等常見需求。

### **長度與內容驗證**

```typescript
z.string().min(5);                    // 最少 5 字元
z.string().max(10);                   // 最多 10 字元
z.string().length(5);                 // 剛好 5 字元
z.string().regex(/^[a-z]+$/);         // 正則表達式
z.string().includes("hello");         // 包含子字串
z.string().startsWith("https://");    // 以特定字串開頭
z.string().endsWith(".com");          // 以特定字串結尾
```

### **格式驗證**

Zod 內建了許多常見格式的驗證器。在 v4 中，這些格式驗證也被提升為頂層函式，提供更好的 tree-shaking 支援。

```typescript
// 常用格式
z.string().email();                   // Email 格式
z.string().url();                     // URL 格式
z.string().uuid();                    // UUID 格式
z.string().ip();                      // IPv4 或 IPv6

// 識別碼格式
z.string().nanoid();
z.string().cuid();
z.string().cuid2();
z.string().ulid();

// 日期時間格式
z.string().datetime();                // ISO 8601 完整格式
z.string().date();                    // YYYY-MM-DD
z.string().time();                    // HH:mm:ss

// 編碼格式
z.string().base64();
```

### **字串轉換**

這些方法會在驗證過程中轉換字串，輸出的值會是轉換後的結果。例如，使用 `.trim()` 可以自動去除使用者輸入的前後空白，避免因為多餘空白導致的驗證失敗或資料不一致。

```typescript
z.string().trim();                    // 去除前後空白
z.string().toLowerCase();             // 轉小寫
z.string().toUpperCase();             // 轉大寫
```

### **自訂錯誤訊息**

良好的錯誤訊息對使用者體驗至關重要。Zod 允許為每個驗證規則指定自訂訊息。

```typescript
z.string().min(5, { message: "至少需要 5 個字元" });
z.string().email({ message: "無效的 Email 格式" });
z.string().url({ message: "無效的 URL" });
```

---

## **數字驗證 (Numbers)**

數字驗證涵蓋範圍檢查、整數驗證、正負數限制等常見需求。

```typescript
// 範圍驗證
z.number().gt(5);                     // > 5
z.number().gte(5);                    // >= 5 (別名: .min(5))
z.number().lt(5);                     // < 5
z.number().lte(5);                    // <= 5 (別名: .max(5))

// 整數與正負數
z.number().int();                     // 整數
z.number().positive();                // > 0
z.number().nonnegative();             // >= 0
z.number().negative();                // < 0
z.number().nonpositive();             // <= 0

// 其他驗證
z.number().multipleOf(5);             // 5 的倍數 (別名: .step(5))
z.number().finite();                  // 有限數（非 Infinity）
z.number().safe();                    // 安全整數範圍
```

### **自訂錯誤訊息**

```typescript
z.number().lte(100, { message: "數值不能超過 100" });
```

---

## **物件 (Objects)**

物件是 Zod 中最常用的複合型別。Zod 提供了豐富的物件操作方法，可以靈活地組合、修改和重用 schema。

### **基本定義**

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof UserSchema>;
// => { name: string; age: number }
```

### **擴展 (extend)**

`.extend()` 是擴展物件 schema 的推薦方式。它可以新增屬性，也可以覆寫現有屬性的 schema。相較於 `z.intersection()`，使用 `.extend()` 回傳的仍然是 `ZodObject`，保留了所有物件方法如 `.pick()`、`.omit()` 等。

```typescript
const UserWithEmail = UserSchema.extend({
  email: z.string().email(),
});
```

### **合併 (merge)**

`.merge()` 用於合併兩個獨立的 object schema。當兩個 schema 有相同的 key 時，第二個 schema 的定義會覆蓋第一個。

```typescript
const BaseUser = z.object({ name: z.string() });
const WithAge = z.object({ age: z.number() });

const User = BaseUser.merge(WithAge);
// => { name: string; age: number }
```

### **選取 (pick) 與 省略 (omit)**

這兩個方法靈感來自 TypeScript 的 `Pick` 和 `Omit` 工具型別，可以從現有 schema 建立子集。舉例來說，假設有一個完整的 `User` schema 包含 `id`、`name`、`email`、`passwordHash` 等欄位，但在回傳給前端時只想暴露 `id`、`name`、`email`，這時就可以用 `.omit({ passwordHash: true })` 來建立一個安全的公開版本。

```typescript
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

// 只保留指定屬性
const NameOnly = UserSchema.pick({ name: true });
// => { name: string }

// 移除指定屬性
const WithoutId = UserSchema.omit({ id: true });
// => { name: string; email: string }
```

### **部分可選 (partial)**

`.partial()` 將所有屬性變為可選，類似 TypeScript 的 `Partial<T>`。這個方法常用於 PATCH API 的輸入驗證——使用者可能只想更新 `name` 而不動 `email`，此時所有欄位都應該是可選的。

```typescript
const PartialUser = UserSchema.partial();
// => { id?: string; name?: string; email?: string }

// 只將部分屬性變為可選
const PartialName = UserSchema.partial({ name: true });
// => { id: string; name?: string; email: string }
```

### **深層部分可選 (deepPartial)**

當物件包含巢狀結構時，`.deepPartial()` 會遞迴地將所有層級的屬性都變為可選。

```typescript
const user = z.object({
  name: z.string(),
  address: z.object({
    city: z.string(),
    country: z.string(),
  }),
});

const deepPartialUser = user.deepPartial();
/*
{
  name?: string;
  address?: {
    city?: string;
    country?: string;
  }
}
*/
```

### **必填 (required)**

`.required()` 是 `.partial()` 的反向操作，將所有可選屬性變為必填。

```typescript
const RequiredUser = PartialUser.required();
```

### **未知鍵處理**

Zod 預設會**忽略**（strip）未定義的鍵。這是一個重要的安全特性，可以防止意外的資料注入。可以根據需求調整這個行為：

```typescript
// 預設：忽略未知鍵（推薦用於 API 輸入）
const user = z.object({ name: z.string() });
user.parse({ name: "john", extra: "ignored" }); // => { name: "john" }

// 嚴格模式：拒絕未知鍵（適合需要精確控制的場景）
const strictUser = z.object({ name: z.string() }).strict();
strictUser.parse({ name: "john", extra: "error" }); // throws ZodError

// 保留未知鍵（適合需要透傳資料的場景）
const looseUser = z.object({ name: z.string() }).passthrough();
looseUser.parse({ name: "john", extra: "kept" }); 
// => { name: "john", extra: "kept" }
```

---

## **陣列 (Arrays)**

### **基本定義**

Zod 提供兩種等價的語法來定義陣列 schema。選擇哪種主要是風格偏好，但 `.array()` 方法在鏈式呼叫時更為簡潔。

```typescript
const StringArray = z.array(z.string());
// 或
const StringArray = z.string().array();

type StringArray = z.infer<typeof StringArray>; // string[]
```

### **陣列驗證**

```typescript
z.array(z.string()).min(1);           // 至少 1 個元素
z.array(z.string()).max(10);          // 最多 10 個元素
z.array(z.string()).length(5);        // 剛好 5 個元素
z.array(z.string()).nonempty();       // 非空陣列
```

### **元素存取**

透過 `.element` 屬性可以取得陣列元素的 schema，在需要動態操作 schema 時很有用。

```typescript
const schema = z.array(z.string());
schema.element; // z.string()
```

---

## **元組 (Tuples)**

元組用於表示固定長度且每個位置有特定型別的陣列。這與 TypeScript 的 tuple 型別完全對應，適合用於表示如座標 `[x, y]`、RGB 值 `[r, g, b]` 等結構化資料。

```typescript
const athleteSchema = z.tuple([
  z.string(),  // name
  z.number(),  // jersey number
  z.object({ pointsScored: z.number() }),
]);

type Athlete = z.infer<typeof athleteSchema>;
// => [string, number, { pointsScored: number }]
```

### **可變長度元組**

使用 `.rest()` 可以定義可變長度的元組，類似 TypeScript 的 rest element。

```typescript
const variadicTuple = z.tuple([z.string()]).rest(z.number());
// => [string, ...number[]]

variadicTuple.parse(["hello", 1, 2, 3]); // ✅
```

---

## **聯合型別 (Unions)**

### **基本聯合**

聯合型別表示「多種型別之一」。Zod 會依序嘗試每個選項，回傳第一個成功的結果。

```typescript
const stringOrNumber = z.union([z.string(), z.number()]);
// 或使用更簡潔的語法
const stringOrNumber = z.string().or(z.number());

type StringOrNumber = z.infer<typeof stringOrNumber>; // string | number
```

### **區分聯合 (Discriminated Union)**

當物件有共同的「區分鍵」（discriminator）時，使用 `z.discriminatedUnion()` 可以獲得**顯著的效能提升**和**更精確的錯誤訊息**。Zod 會先檢查區分鍵的值，然後只驗證對應的 schema，而不是逐一嘗試所有選項。

常見的使用場景包括 API 回應、狀態機、Redux actions 等。

```typescript
const ResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("error"), message: z.string() }),
]);

type Result = z.infer<typeof ResultSchema>;
// => { status: "success"; data: string } | { status: "error"; message: string }

ResultSchema.parse({ status: "success", data: "hello" }); // ✅
```

---

## **記錄 (Records)**

`z.record()` 用於驗證具有動態鍵的物件，對應 TypeScript 的 `Record<K, V>` 型別。當事先不知道物件會有哪些 key，但知道所有 value 都應該是某種型別時，就適合使用 `z.record()`。例如：使用者 ID 對應使用者資料的 mapping、設定檔的 key-value 結構等。

```typescript
const UserMap = z.record(z.string(), z.number());
type UserMap = z.infer<typeof UserMap>; // Record<string, number>

UserMap.parse({ alice: 25, bob: 30 }); // ✅
```

---

## **集合 (Sets) 與 映射 (Maps)**

Zod 也支援 JavaScript 的 `Set` 和 `Map` 資料結構。

```typescript
// Set
const NumberSet = z.set(z.number());
type NumberSet = z.infer<typeof NumberSet>; // Set<number>

// Map
const UserMap = z.map(z.string(), z.number());
type UserMap = z.infer<typeof UserMap>; // Map<string, number>
```

---

## **列舉 (Enums)**

### **Zod Enum**

`z.enum()` 建立一個字串字面值的聯合型別。它提供了 `.enum` 屬性用於存取值（支援自動完成），以及 `.options` 屬性取得所有選項的陣列。

```typescript
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
type Fish = z.infer<typeof FishEnum>; // "Salmon" | "Tuna" | "Trout"

// 存取列舉值（有自動完成）
FishEnum.enum.Salmon; // "Salmon"
FishEnum.options; // ["Salmon", "Tuna", "Trout"]
```

### **Native Enum**

如果已經有 TypeScript 原生 enum，可以使用 `z.nativeEnum()` 來建立對應的 schema。

```typescript
enum Fruits {
  Apple = "apple",
  Banana = "banana",
}

const FruitEnum = z.nativeEnum(Fruits);
type Fruit = z.infer<typeof FruitEnum>; // Fruits

FruitEnum.parse("apple"); // ✅
FruitEnum.parse(Fruits.Apple); // ✅
```

---

## **可選與可空 (Optional & Nullable)**

這三個修飾符處理 JavaScript 中常見的「空值」情況。理解它們的差異對於正確建模 API 和資料庫欄位至關重要。

```typescript
// Optional: 允許 undefined（適合可省略的欄位）
const optionalString = z.string().optional();
type OptionalString = z.infer<typeof optionalString>; // string | undefined

// Nullable: 允許 null（適合資料庫的 nullable 欄位）
const nullableString = z.string().nullable();
type NullableString = z.infer<typeof nullableString>; // string | null

// Nullish: 允許 undefined 和 null（最寬鬆的空值處理）
const nullishString = z.string().nullish();
type NullishString = z.infer<typeof nullishString>; // string | null | undefined
```

### **順序影響型別**

修飾符的順序會影響最終的型別。這是一個常見的陷阱，需要特別注意。

```typescript
z.string().optional().array(); // (string | undefined)[]
z.string().array().optional(); // string[] | undefined
```

### **取得內部 Schema**

使用 `.unwrap()` 可以取得被包裝的原始 schema。

```typescript
const optionalString = z.string().optional();
optionalString.unwrap(); // z.string()
```

---

## **型別強制轉換 (Coercion)**

`z.coerce` 系列方法會在驗證前自動將輸入值轉換為目標型別。在處理表單資料、URL 參數、環境變數時，所有值都會是字串，這時就需要用 `z.coerce` 來轉換型別。

```typescript
z.coerce.string();    // String(input)
z.coerce.number();    // Number(input)
z.coerce.boolean();   // Boolean(input)
z.coerce.bigint();    // BigInt(input)
z.coerce.date();      // new Date(input)
```

```typescript
const schema = z.coerce.number();
schema.parse("42");   // => 42
schema.parse(true);   // => 1
```

:::caution
`z.coerce.boolean()` 使用 JavaScript 的 `Boolean()` 轉換，可能不符合預期。任何 truthy 值都會變成 `true`，包括字串 `"false"`：

```typescript
z.coerce.boolean().parse("false"); // => true (非空字串是 truthy)
z.coerce.boolean().parse(0);       // => false
```

如果需要將字串 `"true"/"false"` 轉換為布林值，應該使用 `z.stringbool()` 或自訂 transform。
:::

---

## **轉換 (Transforms)**

Transform 可以在驗證過程中轉換資料。常見的應用包括：資料標準化、格式轉換、計算衍生值等。

### **基本轉換**

```typescript
const schema = z.string().transform((val) => val.length);

type Input = z.input<typeof schema>;   // string
type Output = z.output<typeof schema>; // number

schema.parse("hello"); // => 5
```

### **轉換中驗證**

Transform 函式可以接收第二個參數 `ctx`（context），這是一個包含 `addIssue()` 方法的物件，可以在轉換過程中新增驗證錯誤。這種模式常用於需要同時驗證和轉換的複雜場景。

```typescript
const numberInString = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });
    return z.NEVER; // 特殊符號，表示提前結束
  }
  return parsed;
});

numberInString.parse("42");    // => 42
numberInString.parse("hello"); // throws ZodError
```

### **預處理 (Preprocess)**

`z.preprocess()` 在**驗證之前**執行轉換。這與 `.transform()` 不同，後者是在驗證**之後**執行。Preprocess 適合用於在驗證前清理或標準化輸入。

```typescript
const castToString = z.preprocess((val) => String(val), z.string());
castToString.parse(123); // => "123"
```

---

## **自訂驗證 (Refinements)**

當內建的驗證方法無法滿足需求時，可以使用 refinement 新增自訂驗證邏輯。

### **refine**

`.refine()` 是最常用的自訂驗證方法。它接收一個回傳布林值的函式，若回傳 `false` 則驗證失敗。

```typescript
const nonEmptyString = z.string().refine((val) => val.length > 0, {
  message: "String cannot be empty",
});

// 物件層級驗證：跨欄位驗證
const passwordForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // 指定錯誤應該顯示在哪個欄位
  });
```

### **superRefine**

當需要更細緻的控制時，使用 `.superRefine()`。它接收一個包含 `ctx`（context）參數的函式，`ctx.addIssue()` 可以新增多個錯誤，並指定不同的錯誤代碼。

```typescript
const uniqueArray = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 3,
      type: "array",
      inclusive: true,
      message: "Too many items",
    });
  }

  if (val.length !== new Set(val).size) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "No duplicates allowed",
    });
  }
});
```

---

## **錯誤處理 (Error Handling)**

良好的錯誤處理是使用者體驗的關鍵。Zod 提供了結構化的錯誤資訊，可以精確地向使用者回報問題。

### **ZodError 結構**

`ZodError` 包含一個 `issues` 陣列，每個 issue 都有詳細的錯誤資訊，包括錯誤代碼、預期型別、實際型別、路徑和訊息。

```typescript
try {
  UserSchema.parse({ username: 42, age: "25" });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues);
    /*
    [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['username'],
        message: 'Expected string, received number'
      },
      {
        code: 'invalid_type',
        expected: 'number',
        received: 'string',
        path: ['age'],
        message: 'Expected number, received string'
      }
    ]
    */
  }
}
```

### **格式化錯誤 (format)**

`.format()` 將錯誤轉換為巢狀物件結構，方便與 UI 元件整合。每個欄位的錯誤都放在 `_errors` 陣列中。

```typescript
const result = UserSchema.safeParse({ username: 42 });

if (!result.success) {
  const formatted = result.error.format();
  /*
  {
    username: { _errors: ['Expected string, received number'] }
  }
  */
  
  formatted.username?._errors; // ['Expected string, received number']
}
```

### **扁平化錯誤 (flatten)**

`.flatten()` 將錯誤轉換為更簡單的兩層結構，適合表單驗證場景。`formErrors` 包含頂層錯誤，`fieldErrors` 包含各欄位的錯誤。

```typescript
const result = UserSchema.safeParse({ username: 42 });

if (!result.success) {
  const flattened = result.error.flatten();
  /*
  {
    formErrors: [],
    fieldErrors: {
      username: ['Expected string, received number']
    }
  }
  */
}
```

### **自訂錯誤訊息**

Zod 提供多種方式自訂錯誤訊息，從簡單的字串到能夠存取錯誤詳情的函式。

```typescript
// 直接傳入訊息
z.string().min(5, "至少需要 5 個字元");

// 使用物件
z.string().min(5, { message: "至少需要 5 個字元" });

// 使用函式（可存取錯誤詳情）
z.string().min(5, {
  error: (issue) => `至少需要 ${issue.minimum} 個字元`,
});
```

---

## **唯讀 (Readonly)**

`.readonly()` 將 schema 的推導型別標記為唯讀，這有助於在編譯期防止意外的資料修改。

```typescript
z.object({ name: z.string() }).readonly();
// => { readonly name: string }

z.array(z.string()).readonly();
// => readonly string[]

z.tuple([z.string(), z.number()]).readonly();
// => readonly [string, number]

z.map(z.string(), z.date()).readonly();
// => ReadonlyMap<string, Date>

z.set(z.string()).readonly();
// => ReadonlySet<string>
```

---

## **預設值 (Default)**

`.default()` 可以為 `undefined` 輸入提供預設值。當輸入為 `undefined` 時，Zod 會使用指定的預設值；若輸入有值，則使用輸入值。

```typescript
const stringWithDefault = z.string().default("hello");

stringWithDefault.parse(undefined); // => "hello"
stringWithDefault.parse("world");   // => "world"
```

---

## **Zod v4 新功能**

Zod v4 帶來了多項重要的改進和新功能。

### **內建 JSON Schema 轉換**

v4 新增了 `z.toJSONSchema()` 方法，可以將 Zod schema 轉換為 JSON Schema 格式。這讓 Zod schema 可以直接產生 API 文件或與 OpenAPI 整合。

```typescript
const mySchema = z.object({
  name: z.string(),
  age: z.number(),
});

z.toJSONSchema(mySchema);
// => {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "number" },
//   },
//   required: ["name", "age"],
// }
```

### **遞迴物件支援**

v4 正式支援遞迴物件型別，使用 getter 語法定義自我參照的 schema。

```typescript
const User = z.object({
  name: z.string(),
  get friend() {
    return User; // 遞迴參照
  },
});
```

---

## **Schema 設計最佳實踐**

### **使用 extend 而非 intersection**

當需要擴展物件 schema 時，優先使用 `.extend()` 而非 `z.intersection()`。`.extend()` 回傳的是 `ZodObject`，保留了所有物件方法；而 `z.intersection()` 回傳的是 `ZodIntersection`，缺少 `.pick()`、`.omit()` 等方法。

```typescript
// ✅ 推薦
const ExtendedUser = BaseUser.extend({ email: z.string() });

// ❌ 不推薦
const ExtendedUser = z.intersection(BaseUser, z.object({ email: z.string() }));
```

### **善用 Discriminated Union**

當處理多種可能的物件結構時，如果它們有共同的區分鍵，使用 `z.discriminatedUnion()` 可以獲得更好的效能和錯誤訊息。

```typescript
// ✅ 推薦：使用 discriminatedUnion
const Result = z.discriminatedUnion("type", [
  z.object({ type: z.literal("success"), data: z.string() }),
  z.object({ type: z.literal("error"), code: z.number() }),
]);

// ❌ 效能較差：使用一般 union
const Result = z.union([
  z.object({ type: z.literal("success"), data: z.string() }),
  z.object({ type: z.literal("error"), code: z.number() }),
]);
```

### **Schema 重用與組合**

將常用的 schema 抽取為獨立的定義，然後透過組合來建構更複雜的 schema。這不僅提高了可維護性，也確保了型別的一致性。

```typescript
// 定義基礎 schema
const EmailSchema = z.string().email();
const PasswordSchema = z.string().min(8);
const TimestampSchema = z.string().datetime();

// 組合使用
const UserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  createdAt: TimestampSchema,
});
```

---

## **實用範例**

### **API Response 驗證**

在前端驗證 API 回應，確保資料符合預期結構，並獲得完整的型別安全。

```typescript
const ApiResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  data: z.object({
    users: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
        createdAt: z.string().datetime(),
      })
    ),
  }),
  meta: z.object({
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
  }),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;

// 使用範例
const response = await fetch("/api/users");
const json = await response.json();

const result = ApiResponseSchema.safeParse(json);
if (result.success) {
  console.log(result.data.data.users[0].name); // string
  console.log(result.data.meta.total);         // number
} else {
  console.log(result.error.flatten());
  // { formErrors: [], fieldErrors: { ... } }
}
```

### **表單驗證**

結合 React Hook Form 等表單庫使用，提供即時的表單驗證。

```typescript
const LoginFormSchema = z.object({
  email: z.string().email("請輸入有效的 Email"),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  rememberMe: z.boolean().default(false),
});

// 使用範例
const formData = { email: "test@example.com", password: "12345678" };
const result = LoginFormSchema.safeParse(formData);

if (result.success) {
  console.log(result.data);
  // { email: "test@example.com", password: "12345678", rememberMe: false }
} else {
  console.log(result.error.flatten().fieldErrors);
  // { email: ["請輸入有效的 Email"], password: ["密碼至少需要 8 個字元"] }
}

// 跨欄位驗證範例
const RegisterFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

const registerResult = RegisterFormSchema.safeParse({
  email: "test@example.com",
  password: "12345678",
  confirmPassword: "87654321",
});

console.log(registerResult.error?.flatten().fieldErrors);
// { confirmPassword: ["密碼不一致"] }
```

### **環境變數驗證**

在應用程式啟動時驗證環境變數，確保所有必要的設定都已正確配置。這是一個常見且重要的 Zod 使用場景。

```typescript
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
});

// 在應用程式啟動時驗證
const env = EnvSchema.parse(process.env);

// 現在 env 是完全型別安全的
console.log(env.PORT); // number
```

### **遞迴 JSON 驗證**

驗證任意 JSON 資料結構，這是一個展示 Zod 遞迴能力的經典範例。

```typescript
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

// 使用範例
const data = { nested: { data: [1, "two", true] } };
const result = jsonSchema.parse(data);
console.log(result);
// { nested: { data: [1, "two", true] } }

// 驗證失敗範例（函式不是合法的 JSON）
const invalid = { fn: () => {} };
jsonSchema.parse(invalid); // throws ZodError
```

---

## **Reference**

- **[Zod 官方文件](https://zod.dev/)**
- **[Zod GitHub](https://github.com/colinhacks/zod)**
- **[Zod v4 Release Notes](https://zod.dev/v4)**
