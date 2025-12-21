---
title: 矩陣的反矩陣 (The Inverse of a Matrix)
sidebar_label: "2-4 矩陣的反矩陣"
description: 本篇筆記介紹反矩陣的定義與唯一性、反矩陣的重要性質定理，以及使用 Gauss-Jordan 方法求解反矩陣。
last_update:
  date: 2025-12-21
keywords:
  [
    "Linear Algebra",
    "Inverse Matrix",
    "Invertible Matrix",
    "Gauss-Jordan Method",
    "Matrix Properties",
    "線性代數",
    "反矩陣",
    "可逆矩陣",
    "高斯消去法",
  ]
tags: [Linear Algebra]
---

:::note
本系列文章內容參考自經典教材 **Elementary Linear Algebra (Pearson New International Edition)**。本文對應章節：**Ch2-4 The Inverse of a Matrix**。
:::

## **反矩陣的定義 (Definition of Inverse Matrix)**

在實數系統中，每個非零數 $a$ 都有一個乘法反元素 $a^{-1} = \frac{1}{a}$，滿足 $a \cdot a^{-1} = a^{-1} \cdot a = 1$。在矩陣的世界中，我們也會想知道：是否存在一個矩陣能「撤銷」另一個矩陣的效果？

### **定義**

對於一個 $n \times n$ 的**方陣 (Square Matrix)** $A$，若存在一個 $n \times n$ 矩陣 $B$ 使得：

$$
\colorbox{yellow}{$AB = BA = I_n$}
$$

則稱 $A$ 為**可逆的 (Invertible)** 或**非奇異的 (Nonsingular)**，稱 $B$ 為 $A$ 的**反矩陣 (Inverse Matrix)**，記作 $A^{-1}$。

若不存在這樣的 $B$，則稱 $A$ 為**不可逆的 (Non-invertible)** 或**奇異的 (Singular)**。

:::info 為何必須是方陣？
反矩陣的定義要求 $AB = BA = I$，這意味著 $A$ 與 $B$ 的乘法順序可以交換且結果相同。考慮維度：

- 若 $A$ 是 $m \times n$，$B$ 是 $n \times m$
- 則 $AB$ 是 $m \times m$，$BA$ 是 $n \times n$

若要 $AB = BA = I$，必須 $m = n$，因此**只有方陣才可能有反矩陣**。
:::

<br/>

## **反矩陣的唯一性 (Uniqueness of Inverse)**

### **定理：反矩陣若存在則唯一**

若 $A$ 是可逆矩陣，則其反矩陣 $A^{-1}$ 是**唯一的**。

**證明**：假設 $B$ 和 $C$ 都是 $A$ 的反矩陣，即 $AB = BA = I$ 且 $AC = CA = I$。則：

$$
B = BI = B(AC) = (BA)C = IC = C
$$

因此 $B = C$，反矩陣唯一。 $\square$

<br/>

:::tip 補充：2×2 矩陣的反矩陣公式
對於 2×2 矩陣，存在一個簡潔的直接公式。設 $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$，若 $ad - bc \neq 0$，則：

$$
A^{-1} = \dfrac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}
$$

其中 $ad - bc$ 稱為矩陣 $A$ 的**行列式 (Determinant)**，記作 $\det(A)$。關於行列式的詳細內容將在後續章節介紹。
:::

<br/>

## **反矩陣的性質定理 (Properties of Inverse Matrices)**

可逆矩陣具有許多重要的代數性質，這些性質在理論推導和實際計算中都非常有用。

### **定理：反矩陣的基本性質**

設 $A$ 和 $B$ 都是 $n \times n$ 可逆矩陣，$c$ 是非零純量，則：

| 性質 |               結論               | 說明                   |
| :--: | :------------------------------: | :--------------------- |
| (a)  |       $(A^{-1})^{-1} = A$        | 反矩陣的反矩陣是原矩陣 |
| (b)  |    $(AB)^{-1} = B^{-1}A^{-1}$    | **順序反轉！**         |
| (c)  |    $(A^T)^{-1} = (A^{-1})^T$     | 轉置與求逆可交換       |
| (d)  | $(cA)^{-1} = \dfrac{1}{c}A^{-1}$ | 純量提出變倒數         |

### **性質 (b) 的推廣**

對於多個可逆矩陣的乘積，反矩陣的順序必須**完全反轉**：

$$
\colorbox{yellow}{$(A_1 A_2 \cdots A_k)^{-1} = A_k^{-1} \cdots A_2^{-1} A_1^{-1}$}
$$

:::tip 穿脫衣服的比喻
我喜歡用「穿脫衣服」來記憶這個性質：

假設你依序穿上 **內衣 → 襯衫 → 外套**，要脫掉時必須**反過來**：**外套 → 襯衫 → 內衣**。

同理，若 $A_1, A_2, A_3$ 是依序作用的矩陣（越後面越「外層」），要「撤銷」這些操作時，必須從最外層開始，依序 $A_3^{-1}, A_2^{-1}, A_1^{-1}$。

這也解釋了為什麼 $(AB)^{-1} \neq A^{-1}B^{-1}$！
:::

### **性質 (b) 的證明**

要證明 $(AB)^{-1} = B^{-1}A^{-1}$，只需驗證 $(B^{-1}A^{-1})(AB) = I$：

$$
(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}IB = B^{-1}B = I \;\checkmark
$$

同理可驗證 $(AB)(B^{-1}A^{-1}) = I$。 $\square$

<br/>

## **反矩陣的冪次 (Powers of Invertible Matrices)**

### **定義**

設 $A$ 為可逆矩陣，定義 $A$ 的負整數冪次為：

$$
A^{-n} = (A^{-1})^n = \underbrace{A^{-1} \cdot A^{-1} \cdots A^{-1}}_{n \text{ 個}}
$$

### **指數律 (Laws of Exponents)**

對於可逆矩陣 $A$ 和任意整數 $m, n$，下列指數律成立：

$$
A^m A^n = A^{m+n}, \quad (A^m)^n = A^{mn}
$$

:::warning 注意事項
矩陣乘法不具交換性，因此一般而言：
$$(AB)^n \neq A^n B^n$$

只有當 $AB = BA$（即 $A$ 和 $B$ **可交換**）時，上式才成立。
:::

<br/>

## **使用 Gauss-Jordan 方法求反矩陣 (Gauss-Jordan Method for Finding Inverses)**

對於一般的 $n \times n$ 可逆矩陣，我們可以使用 **Gauss-Jordan 消去法**系統性地計算其反矩陣。

### **方法原理**

核心想法來自上一篇的觀念 $PA = R$：若 $A$ 可逆，則其 RREF 必為單位矩陣 $I$，即存在可逆矩陣 $P$ 使得：

$$
PA = I
$$

比較 $AA^{-1} = I$，可知 $P = A^{-1}$！

因此，如果我們能找到把 $A$ 化簡為 $I$ 的那個矩陣 $P$，就找到了 $A^{-1}$。

:::info 為何 RREF 必為 $I$？
從消去法的角度來看：若 $A$ 可逆，代表該矩陣沒有「多餘」的資訊，消去後**每一列都必須能產生一個主元 (Pivot)**。對於 $n \times n$ 的方陣，如果每一列都有主元，化簡到最簡形式 (RREF) 就必定是單位矩陣 $I_n$。
:::

### **演算法步驟**

**Gauss-Jordan 反矩陣演算法**：

1. 建構增廣矩陣 $[A \mid I_n]$
2. 使用基本列運算將左邊的 $A$ 化簡為 $I_n$
3. 當左邊變成 $I_n$ 時，右邊自動變成 $A^{-1}$

$$
[A \mid I] \xrightarrow{\text{列運算}} [I \mid A^{-1}]
$$

![Gauss-Jordan 求反矩陣示意圖](./assets/gauss-jordan-inverse-method.svg)

上圖以動態方式展示了 Gauss-Jordan 方法如何同步作用於增廣矩陣的兩側，當左半部化為單位矩陣時，右半部即為反矩陣。

### **原理解釋**

為什麼這個方法有效？設化簡 $A$ 為 $I$ 需要的列運算對應基本矩陣 $E_1, E_2, \ldots, E_k$，則：

$$
E_k \cdots E_2 E_1 A = I
$$

令 $P = E_k \cdots E_2 E_1$，則 $PA = I$，故 $P = A^{-1}$。

同時，這些列運算作用在右半部的 $I$ 上：

$$
E_k \cdots E_2 E_1 I = P = A^{-1}
$$

這就是為什麼右半部會變成 $A^{-1}$！

:::tip 與上一節的連結
還記得上一節我提到的心得嗎？ $P$ 是多個 Elementary Matrix 的乘積，而每個 Elementary Matrix 都是可逆的，所以 $P$ 本身必定可逆。

這裡我們更進一步看到：當 $A$ 可逆時，$PA = I$ 意味著 $P = A^{-1}$。也就是說，**把 $A$ 化簡到 $I$ 的過程，本身就在計算 $A^{-1}$**！
:::

### **範例**

求 $A = \begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}$ 的反矩陣。

**解**：建構增廣矩陣並進行列運算：

$$
\begin{aligned}
[A \mid I] &= \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 3 & 7 & 0 & 1 \end{array}\right] \\[1em]
&\xrightarrow{R_2 - 3R_1 \to R_2} \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & -3 & 1 \end{array}\right] \\[1em]
&\xrightarrow{R_1 - 2R_2 \to R_1} \left[\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\ 0 & 1 & -3 & 1 \end{array}\right]
\end{aligned}
$$

因此 $A^{-1} = \begin{bmatrix} 7 & -2 \\ -3 & 1 \end{bmatrix}$。

**驗證**：$AA^{-1} = \begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}\begin{bmatrix} 7 & -2 \\ -3 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I_2$ ✓

<br/>

## **判斷矩陣是否可逆 (Determining Invertibility)**

使用 Gauss-Jordan 方法時，我們可以同時判斷矩陣是否可逆：

- 若化簡過程中左半部能達到 $I$，則 $A$ 可逆，右半部即為 $A^{-1}$
- 若化簡過程中出現**全零列 (Row of Zeros)**，則 $A$ 不可逆

### **範例：不可逆矩陣**

設 $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$，試求 $A^{-1}$。

**解**：

$$
[A \mid I] = \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 2 & 4 & 0 & 1 \end{array}\right] \xrightarrow{R_2 - 2R_1 \to R_2} \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 0 & -2 & 1 \end{array}\right]
$$

左半部出現全零列，無法化為 $I$，因此 **$A$ 不可逆**。

:::info 幾何直覺
為什麼 $\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$ 不可逆？

注意第二列是第一列的 2 倍，這意味著兩列**線性相依 (Linearly Dependent)**。

從線性變換的角度看，這個矩陣會把整個 $\mathbb{R}^2$ 「壓扁」到一條直線上，資訊在這個過程中遺失了，因此無法「撤銷」這個操作——也就是不可逆。
:::
:::tip 補充：以反矩陣解線性方程組
當係數矩陣可逆時，線性方程組 $A\mathbf{x} = \mathbf{b}$ 可以直接用反矩陣求解：$\mathbf{x} = A^{-1}\mathbf{b}$。

不過在實務上，對於**單一方程組**，直接使用 Gauss-Jordan 消去法通常比先求 $A^{-1}$ 再相乘更有效率。反矩陣解法的優勢在於當需要對同一個 $A$ 解多個不同的 $\mathbf{b}$ 時，可重複使用預先計算好的 $A^{-1}$。
:::
