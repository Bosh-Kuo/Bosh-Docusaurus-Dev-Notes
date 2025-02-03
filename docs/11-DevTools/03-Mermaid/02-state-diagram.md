---
title: Mermaid - 狀態圖(State Diagram)
sidebar_label: "State Diagram"
description: 這篇技術筆記將介紹如何使用 Mermaid 繪製狀態圖 (State Diagram)。狀態圖由一系列的狀態(states)和它們之間的轉換(transitions)組成。每個狀態代表系統在某個特定條件或模式下的情況，而轉換則描述觸發狀態改變的事件或條件。本文章簡要介紹了狀態圖的定義、用途、主要組成。
last_update:
  date: 2024-04-15
keywords: [開發工具 ,Mermaid , State Diagram]
tags: [開發工具, Mermaid]
---


> 本篇筆記的範例來自 [**@Memaid-State diagrams**](https://mermaid.js.org/語法：/stateDiagram.html)
> 

**狀態圖(State Diagrams)** 常用於描述系統、物件或組件的狀態變化及其在不同狀態間的轉換過程。這種圖表適合用來表示系統或對象在其生命週期內的行為，特別是在分析和設計軟體系統時，用來揭示物件如何根據不同事件或條件改變其狀態。在需要明確展示對象狀態的變遷規則、事件響應和條件邏輯時，狀態圖特別有用。

## **狀態 (States)**

**狀態圖 (State Diagram)** 是用來描述 **系統、物件或組件** 在不同狀態之間的轉換 (Transitions) 和變化過程。它特別適合用於：

- **描述系統的生命週期** (如用戶登入/登出、燈的開關狀態)
- **模擬狀態機 (State Machine)** (如按鍵事件、音樂播放器狀態)
- **分析系統行為與流程** (如 API 狀態變化、交易流程)

**語法：**

```
stateDiagram-v2
    stateId
    state "This is a state description1" as s2
    s2 : This is a state description2
```

```mermaid
stateDiagram-v2
    stateId
    state "This is a state description1" as s2
    s2 : This is a state description2
```

## **狀態轉換 (Transitions)**

轉換(transitions) 指的是一種狀態進入另一種狀態時的路徑。

```
stateDiagram-v2
    s1 --> s2
```

```mermaid
stateDiagram-v2
    s1 --> s2
```

## **開始與結束 (Start and End)**

**語法：**

- `[*]` 用於定義開始或停止的狀態

```
stateDiagram-v2
    [*] --> s1
    s1 --> [*]
```

```mermaid
stateDiagram-v2
    [*] --> s1
    s1 --> [*]
```

## **複合狀態 (Composite States)**

在現實世界的場景中常常會遇到一個狀態內部包含多個子狀態的狀況

**語法：**

```
stateDiagram-v2
    [*] --> First

    state First {
        [*] --> Second

        state Second {
            [*] --> second
            second --> Third

            state Third {
                [*] --> third
                third --> [*]
            }
        }
    }
```

```mermaid
stateDiagram-v2
    [*] --> First

    state First {
        [*] --> Second

        state Second {
            [*] --> second
            second --> Third

            state Third {
                [*] --> third
                third --> [*]
            }
        }
    }
```

## **條件選擇 (Choice)**

有時狀態會根據不同的情境條件來決定要轉換哪一種狀態， `<<choice>>` 相當於狀態轉換的 if-else 

```
stateDiagram-v2
    state if_state <<choice>>
    [*] --> IsPositive
    IsPositive --> if_state
    if_state --> False: if n < 0
    if_state --> True : if n >= 0
```

```mermaid
stateDiagram-v2
    state if_state <<choice>>
    [*] --> IsPositive
    IsPositive --> if_state
    if_state --> False: if n < 0
    if_state --> True : if n >= 0
```

## **分叉與合併 (Forks and Joins)**

**語法：**

- `<<fork>>`
- `<<join>>`

```
   stateDiagram-v2
    state fork_state <<fork>>
      [*] --> fork_state
      fork_state --> State2
      fork_state --> State3

      state join_state <<join>>
      State2 --> join_state
      State3 --> join_state
      join_state --> State4
      State4 --> [*]
```

```mermaid
   stateDiagram-v2
    state fork_state <<fork>>
      [*] --> fork_state
      fork_state --> State2
      fork_state --> State3

      state join_state <<join>>
      State2 --> join_state
      State3 --> join_state
      join_state --> State4
      State4 --> [*]
```

## **備註 (Notes)**

**語法：**

- `note` [ right of | left of  ] [State id]: 文字

```
    stateDiagram-v2
        State1: The state with a note
        note right of State1
            Important information! You can write
            notes.
        end note
        State1 --> State2
        note left of State2 : This is the note to the left.
```

```mermaid
    stateDiagram-v2
        State1: The state with a note
        note right of State1
            Important information! You can write
            notes.
        end note
        State1 --> State2
        note left of State2 : This is the note to the left.
```

## **並行狀態 (Concurrency)**

系統或流程中存在並行執行的情況時，可以使用 `—-` 表示並行

```
stateDiagram-v2
    [*] --> Active

    state Active {
        [*] --> NumLockOff
        NumLockOff --> NumLockOn : EvNumLockPressed
        NumLockOn --> NumLockOff : EvNumLockPressed
        --
        [*] --> CapsLockOff
        CapsLockOff --> CapsLockOn : EvCapsLockPressed
        CapsLockOn --> CapsLockOff : EvCapsLockPressed
        --
        [*] --> ScrollLockOff
        ScrollLockOff --> ScrollLockOn : EvScrollLockPressed
        ScrollLockOn --> ScrollLockOff : EvScrollLockPressed
    }
```

```mermaid
stateDiagram-v2
    [*] --> Active

    state Active {
        [*] --> NumLockOff
        NumLockOff --> NumLockOn : EvNumLockPressed
        NumLockOn --> NumLockOff : EvNumLockPressed
        --
        [*] --> CapsLockOff
        CapsLockOff --> CapsLockOn : EvCapsLockPressed
        CapsLockOn --> CapsLockOff : EvCapsLockPressed
        --
        [*] --> ScrollLockOff
        ScrollLockOff --> ScrollLockOn : EvScrollLockPressed
        ScrollLockOn --> ScrollLockOff : EvScrollLockPressed
    }
```

## **Reference**

- **[Mermaid](https://mermaid.js.org/)**
- **[State diagrams](https://mermaid.js.org/語法：/stateDiagram.html)**