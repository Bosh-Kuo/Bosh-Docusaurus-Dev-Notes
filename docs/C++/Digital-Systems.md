---
title: "CH3 Digital Systems"
sidebar_label: "[NTU Programming Design] - Ch3 Digital Systems"
sidebar_position: 2
description: C++ Digital Systems
last_update:
  date: 2022-03-05
keywords:
  - C++
  - Base-r system
  - complement
tags:
  - Programming Language
  - C++
---


:::note
本文為 2021-Fall 學期旁聽台大資管系孔令傑教授開授的 **[Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)** 所記錄的課程筆記。課程內容程式碼可以參閱我的 Github repo: **[C++ Programming-Design-2021-Fall
](https://github.com/Bosh-Kuo/Cplusplus-Programming-Design-2021-Fall)**
:::



## **Base-r system**
X可以被表示成如下式：  
$X = (a_n a_{n-1} ... ... a_1 a_0 a_{-1} ... a_{-m})_r$
<!-- <img src="https://render.githubusercontent.com/render/math?math=X = (a_n a_{n-1} ... ... a_1 a_0 a_{-1} ... a_{-m})_r"> -->

其值可由下式計算：  
$X = a_nr^n+ a_{n-1}r^{n-1} ... ... a_1r + a_0 + a_{-1}r^{-1} a_{-2}r^{-2}  ... a_{-m}r^{-m}$
<!-- <img src="https://render.githubusercontent.com/render/math?math=X = a_nr^n+ a_{n-1}r^{n-1} ... ... a_1r + a_0 + a_{-1}r^{-1} a_{-2}r^{-2}  ... a_{-m}r^{-m}"> -->

$r$ 為進位數
<!-- <img src="https://render.githubusercontent.com/render/math?math=r">為進位數 -->

<!-- more -->


### **Example(整數):**    
整數部分153  
$(153)_{10} = (2\times8^2 + 3\times8 + 1\times8^0) = (231)_{8}$  
-> `輾轉相除法  `


### **Example(小數):** 
小數部分0.513   
- 0.513 x 8 = `4`.104
- 0.104 x 8 = `0`.832
- 0.832 x 8 = `6`.656
- 0.656 x 8 = `5`.24  


$(0.513)_{10} = (4\times8^{-1} + 0\times8^{-2} + 6\times8^{-3} + 5\times8^{-4}) = (0.4065)_{8}$  
-> `輾轉相乘法  `

<br/>


## **Base $2^i$ to base $2^j$**
### **Example: $(10111010011)_2$ convert to actual and hexadecimal**  

$(10111010011)_2 \rightarrow \frac{10}{2}\frac{111}{7}\frac{010}{2}\frac{011}{3} \rightarrow (2723)_8$  

$(10111010011)_2 \rightarrow \frac{101}{5}\frac{1101}{D}\frac{0011}{3} \rightarrow (5D3)_8$ 

<br/>

## **補數 Complement**
base-r system:
- (r-1)'s complement
- r's complement


**$(r-1)'s$ complement of an n-digit number $X = (r^n-1) -X$**


<br/>


### **Example(decimal systrem):**
$9's$ complement of $546700$ is  
$(10^6-1) - 546700 = 453299$



### **Example(binary systrem):**
$1's$ complement of $01011000$ is  
$(2^8-1) - 01011000 = 11111111 - 01011000 = 10100111$  
`簡單來說：0,1互換`  


**$r's$ complement of an n-digit number**
$$X = \begin{cases} r^n - X, & \text {if $X\neq0$} \\ 0, & \text{if $X = 0$} \end{cases}$$




### **Example(decimal systrem):**
$10's$ complement of $012398$ is $987601 + 1 = 987602$ 




### **Example(binary systrem):**
$2's$ complement of $1101100$ is $0010011 + 1 = 0010100$  
`簡單來說：0,1互換外再加1`  


<br/>


## **用加法器做相減($1's-complement$)**
- $Case:(-X)+Y:$  
   $[(2^n-1)-X]+Y = (2^n-1) - (X-Y)$    
   - If $X-Y \geq  0$ (case為負): 得到 $(X-Y)$ 的 $1's complement$ 
   - If $X-Y < 0$ (case為正): $[(2^n-1)-X]+Y =$ (進位數) $2^n - 1 + (Y-X)$:   
   移除進位數，再+1即可得到 $-X+Y$
    

   - **Example**: $-9 + 13$
   $1's$ complement of $9$ $(00001001)$ is $11110110$   
   $(11110110) + (00001101) = 100000011 \rightarrow$ 移除進位數，再 $+ 1$  
   $= 00000100$  
   $= 4$  


---
-  $Case (-X)+(-Y):$   
$[(2^n-1)-X]+[(2^n-1)-Y] = (2^n-1) + [(2^n-1) - (X+Y)]:$     
移除進位數，再 +1 即可得到 $(-X)+(-Y) \equiv (X+Y)$ 的 $1's complement$ 

   - **Example**: $(-9) + (-13)$ 
   $1's$ complement of $9$ $(00001001)$ is $11110110$   
   $1's$ complement of $13$ $(00001101)$ is $11110010$   
   $(11110110) + (11110010) = 111101000 \rightarrow$ 移除進位數，再 $+ 1$  
   $= 11101001$  
   $= 1's complement of 22$  
   $= -22$ 


<br/>


## **用加法器做相減($2's-complement$)**
-  $Case:(-X)+Y:$  
$(2^n-X)+Y = 2^n - (X-Y)$    
   - If $X-Y >  0$ (case為負): 得到 $(X-Y)$ 的 $2's complement$
   - $X-Y \leq 0$ (case為正): $[(2^n-1)-X]+Y =$ (進位數) $2^n + (Y-X):$
   移除進位數，即可得到 $-X+Y$    


   - **Example**: $-9 + 13$
   $2's$ complement of $9$ $(00001001)$ is $11110111$   
   $(11110111) + (00001101) = 100000100 \rightarrow$ 移除進位數  
   $= 00000100$  
   $= 4$ 



-  $Case (-X)+(-Y):$  
$(2^n-X)+(2^n-Y) = 2^n + [2^n - (X+Y)]:$  
移除進位數即可得到 $(-X)+(-Y) \equiv (X+Y)$ 的2's complement

   - **Example**: $(-9) + (-13)$  
   $2's$ complement of $9$ $(00001001)$ is $11110111$   
   $2's$ complement of $13$ $(00001101)$ is $11110111$   
   $(11110111) + (11110111) = 111101010 \rightarrow$ 移除進位數  
   $= 11101010$  
   $= 2's complement of 22$  
   $= -22$ 


<br/>


## **Reference**
- [IM 1003 Programming Design](http://www.im.ntu.edu.tw/~lckung/courses/public/PD/)




