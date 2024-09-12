---
title: TanStack Query V5 - useQuery API 解析
sidebar_label: "[React Query] useQuery API"
description: 這篇筆記詳細說明 TanStack Query 中最常用的 useQuery 這個 hook 的 API 配置與回傳值，幫助開發者在實際專案中高效使用 useQuery。
slug: "/React/useQuery-API"
last_update:
  date: 2024-09-12
keywords:
  - React
  - Hooks
  - State Management
  - React Query
  - TanStack Query
  - useQuery
tags:
  - React
---

>  **前情提要:**  
`TanStack Query`(前身為 `React Query`) 是我過去一年內最喜歡的 React 生態系工具之一。其中 `useQuery` 則是我使用最多的 hooks。useQuery 最受我喜愛的地方，就是它幾乎集合了常見的異步請求工作流程中的所有功能。在大部分的應用場景中，我都可以只用一招 useQuery 就解決過去需要大量自己手動處理的異步邏輯。但功能與配置選項太多這件事同時也是最令我苦惱的一個點，我常常會忘記該怎麼正確使用 useQuery @@  
因此決定用這篇筆記一次摸熟 useQuery 所有配置選項、回傳值的定義與用法，希望可以減少日後閱讀文件時重新理解的時間。


**useQuery** 接受兩個參數：一個是配置物件，另一個則是可選的 **queryClient**。

```tsx
const {
  data,
  error,
  isLoading,
  refetch,
  ...otherQueryInfo
} = useQuery(options, queryClient);
```

## **基本用法**

```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
};

const fetchUser = async (id: number): Promise<User> => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

const UserComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const { data, isLoading, isError, error, refetch } = useQuery(['user', userId], () => fetchUser(userId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>Email: {data?.email}</p>
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
};

export default UserComponent;

```


<br/>


## **Options 配置物件**

### **基本配置**

1. **queryKey**: `unknown[]` (必填)
    - 查詢的唯一鍵，當這個鍵變更時，會觸發重新查詢。
    - **範例**: `['user', 1]`
2. **queryFn**: `(context: QueryFunctionContext) => Promise<TData>` (必填)
    - 負責資料請求的函數，必須返回一個 Promise。
    - **範例**: `async () => { const response = await axios.get('/api/user'); return response.data; }`

### **執行條件與狀態控制**

1. **enabled**: `boolean | (query: Query) => boolean` (選填，預設值: `true`)
    - 控制查詢是否應自動執行，適用於依賴其他資料的查詢。
2. **retry**: `boolean | number | (failureCount: number, error: TError) => boolean` (選填，預設值: `3`)
    - 查詢失敗後應重試的次數，或自訂的重試邏輯。
3. **retryOnMount**: `boolean` (選填，預設值: `true`)
    - 當元件重新掛載時，是否重新查詢（在存在錯誤的情況下）。
4. **retryDelay**: `number | (retryAttempt: number, error: TError) => number` (選填)
    - 設定重試之間的延遲時間，支援如指數型回退等策略。
5. **refetchOnMount**: `boolean | "always" | ((query: Query) => boolean | "always")` (選填，預設值: `true`)
    - 當元件掛載時是否重新查詢。
6. **refetchOnWindowFocus**: `boolean | "always" | ((query: Query) => boolean | "always")` (選填，預設值: `true`)
    - 當視窗重新獲得焦點時是否重新查詢。
7. **refetchOnReconnect**: `boolean | "always" | ((query: Query) => boolean | "always")` (選填，預設值: `true`)
    - 當網路重新連接時是否重新查詢。

### **快取與資料處理**

1. **staleTime**: `number | (query: Query) => number` (選填，預設值: `0`)
    - 控制資料被認為 "過時" 前的時間（毫秒）。
2. **gcTime**: `number | Infinity` (選填，預設值: `5 * 60 * 1000` 或 `Infinity` 用於 SSR)
    - 設定未使用的快取資料應保留在記憶體中的時間。
3. **initialData**: `TData | () => TData` (選填)
    - 設定查詢的初始資料，如果設定了此值，資料會被視為 "過時"（除非另設 `staleTime`）。
4. **initialDataUpdatedAt**: `number | (() => number | undefined)` (選填)
    - 設定初始資料的更新時間戳。
5. **placeholderData**: `TData | (previousValue: TData | undefined; previousQuery: Query | undefined,) => TData` (選填)
    - 在查詢進行中的時候顯示的佔位資料，當查詢完成後會被實際資料覆蓋。
6. **structuralSharing**: `boolean | (oldData: unknown | undefined, newData: unknown) => unknown` (選填，預設值: `true`)
    - 用於在舊資料和新資料之間進行結構共享，提升性能。
7. **select**: `(data: TData) => unknown` (選填)
    - 用來選擇或轉換查詢返回的資料。

### **網路狀態與背景操作**

1. **networkMode**: `'online' | 'always' | 'offlineFirst'` (選填，預設值: `'online'`)
    - 控制查詢應如何在網路狀態變化時運行。
2. **refetchInterval**: `number | false | ((query: Query) => number | false | undefined)` (選填)
    - 設定自動重新查詢的間隔時間（毫秒），如果為 `false`，則停用自動重新查詢。
3. **refetchIntervalInBackground**: `boolean` (選填，預設值: `false`)
    - 控制當視窗/標籤頁在背景中時，是否繼續重新查詢。

### **錯誤處理與其他**

1. **throwOnError**: `undefined | boolean | (error: TError, query: Query) => boolean` (選填，預設值: `undefined`)
    - 設定查詢發生錯誤時是否拋出錯誤，或是將錯誤返回作為狀態處理。
2. **queryKeyHashFn**: `(queryKey: QueryKey) => string` (選填)
    - 自訂 `queryKey` 的雜湊函數。
3. **notifyOnChangeProps**: `string[] | "all" | (() => string[] | "all" | undefined)` (選填)
    - 控制在哪些屬性變更時元件會重新渲染。
4. **meta**: `Record<string, unknown>` (選填)
    - 儲存查詢的額外中繼資料，這些資料可以在查詢過程中被使用。
5. **queryClient**: `QueryClient` (選填)
    - 如果需要，可以傳入自訂的 `QueryClient`。


<br/>


## **回傳值**

### **資料類**

1. **data**: `TData`
    - 查詢成功後的資料，如果查詢未成功，默認為 `undefined`。
2. **dataUpdatedAt**: `number`
    - 資料最近一次成功更新的時間戳。
3. **isStale**: `boolean`
    - 如果資料是過時的，則為 `true`。
4. **isPlaceholderData**: `boolean`
    - 如果當前顯示的是佔位資料，則為 `true`。

### **狀態類**

1. **status**: `'pending' | 'error' | 'success'`
    - 查詢的當前狀態：
        - `pending`: 尚未完成查詢。
        - `error`: 查詢失敗。
        - `success`: 查詢成功。
2. **fetchStatus**: `'fetching' | 'paused' | 'idle'`
    - 描述查詢的進行狀態：
        - `fetching`: 查詢正在執行中。
        - `paused`: 查詢暫停。
        - `idle`: 查詢處於空閒狀態。
3. **isFetched**: `boolean`
    - 查詢是否曾被取用過。
4. **isFetchedAfterMount**: `boolean`
    - 元件掛載後是否曾取用過查詢資料。

### **`status` 的衍生狀態**

1. **isPending**: `boolean`
    - 當 `status` 為 `pending` 時為 `true`。
2. **isSuccess**: `boolean`
    - 當 `status` 為 `success` 時為 `true`。
3. **isError**: `boolean`
    - 當 `status` 為 `error` 時為 `true`。

### **`fetchStatus` 的衍生狀態**

1. **isFetching**: `boolean`
    - 當查詢函數正在執行時為 `true`。
2. **isPaused**: `boolean`
    - 當查詢暫停時為 `true`。

### **`status` 與 `fetchStatus` 的共同衍生狀態**

1. **isLoading**: `boolean`
    - 當查詢首次載入時為 `true`，相當於 `isFetching && isPending`。
2. **isLoadingError**: `boolean`
    - 查詢初次請求失敗時為 `true`。
3. **isRefetching**: `boolean`
    - 當查詢在背景中重新載入時為 `true`，相當於 `isFetching && !isPending`。
4. **isRefetchError**: `boolean`
    - 查詢重新請求失敗時為 `true`。

### **其他回傳值**

1. **error**: `null | TError`
    - 查詢失敗時的錯誤物件，默認為 `null`。
2. **errorUpdatedAt**: `number`
    - 錯誤最近一次發生的時間戳。
3. **failureCount**: `number`
    - 查詢失敗的次數，成功後重設為 `0`。
4. **failureReason**: `null | TError`
    - 查詢失敗的具體原因。
5. **refetch**: `(options?: { throwOnError?: boolean, cancelRefetch?: boolean }) => Promise<UseQueryResult>`
    - 手動觸發重新查詢的函數，回傳一個 Promise。


<br/>


## **Reference**

- [**@TanStack Query v5 - useQuery**](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
