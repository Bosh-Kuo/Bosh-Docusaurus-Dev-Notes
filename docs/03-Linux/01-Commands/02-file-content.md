---
title: "Linux 常用指令大全 - 文件內容操作"
sidebar_label: "文件內容操作"
description: 這篇文章詳細介紹了 Linux 系統中常用的文件內容操作指令，包括 cat, less, more, head, tail, grep, sed, awk。通過學習這些指令，你將能夠高效地查看、篩選和處理文件內容。
last_update:
  date: 2024-07-21
keywords:
  - Linux
  - Command
  - 常用指令
tags:
  - Linux
---

## **cat**

顯示文件內容

**語法：**

```bash
cat [選項] [文件...]
```

**選項：**

```bash
-b      # 顯示非空行的行號，從1開始
-e      # 顯示不可見字符，並在每行結尾顯示美元符號（$）
-n      # 顯示所有行的行號，從1開始
-s      # 壓縮連續的空行，使輸出變為單行間隔
-t      # 顯示不可見字符，並將製表符顯示為‘^I’
-v      # 顯示不可見字符，控制字符顯示為‘^X’，非ASCII字符顯示為‘M-’後跟低7位字符
```

**範例：**

```bash
cat file.txt                       # 顯示file.txt的內容
cat -n file.txt                    # 顯示file.txt的內容並顯示行號
cat file1.txt file2.txt > merged.txt # 合併file1.txt和file2.txt的內容並保存到merged.txt
cat -b file.txt                    # 顯示file.txt的內容並顯示非空行的行號
cat -s file.txt                    # 顯示file.txt的內容並壓縮連續的空行
cat -e file.txt                    # 顯示file.txt的內容，並在每行結尾顯示美元符號（$）
cat file1 - file2 - file3          # 依次顯示file1、標準輸入、file2、標準輸入和file3的內容
cat -v file.txt                    # 顯示file.txt的內容，並顯示不可見字符
```


<br/>


## **less**

分頁顯示文件內容

**語法：**

```bash
less [選項] [文件]
```

**選項：**

```bash
-bN     # 設置緩衝區大小為N行
-e      # 當到達文件末尾後自動退出
-f      # 強制打開特殊文件，例如設備文件和二進制文件
-i      # 搜索時忽略大小寫
-m      # 顯示更詳細的百分比信息
-N      # 顯示行號
-s      # 壓縮連續的空行
-S      # 禁用自動換行
-xN     # 將Tab字元顯示為N個空格字元
```

**範例：**

```bash
less file.txt                 # 分頁顯示file.txt的內容
less -N file.txt              # 分頁顯示file.txt的內容並顯示行號
less -S file.txt              # 分頁顯示file.txt的內容，禁用自動換行
less -i file.txt              # 搜索時忽略大小寫
less +/pattern file.txt       # 分頁顯示file.txt的內容並跳轉到匹配pattern的位置
less -m file.txt              # 分頁顯示file.txt的內容並顯示更詳細的百分比信息
less -e file.txt              # 分頁顯示file.txt的內容，到達文件末尾後自動退出
less -f /dev/sda              # 強制打開設備文件/dev/sda
less -X file.txt              # 禁用終端初始化和重置，分頁顯示file.txt的內容
```


<br/>


## **more**

分頁顯示文件內容

**語法：**

```bash
more [選項] [文件]
```

**選項：**

```bash
-d        # 在文件結尾顯示一條消息並等待用戶輸入指令
-l        # 忽略換頁符（Ctrl-L）
-f        # 將長行視為多行
-c        # 清屏而非滾屏顯示內容
-p        # 使用清屏模式顯示文件（不滾動）
-s        # 壓縮連續的空行
-u        # 禁用下劃線顯示
-nN       # 設置顯示的行數為N行
+N        # 從第N行開始顯示文件
+/pattern # 搜索模式並從匹配行開始顯示
```

**範例：**

```bash
more file.txt                     # 分頁顯示file.txt的內容
more -d file.txt                  # 在文件結尾顯示消息並等待用戶輸入指令
more -f file.txt                  # 將長行視為多行顯示
more -c file.txt                  # 使用清屏模式顯示文件
more -p file.txt                  # 清屏模式顯示文件，不滾動
more -s file.txt                  # 壓縮連續的空行
more -n20 file.txt                # 每次顯示20行內容
more +3 file.txt                  # 從file.txt的第3行開始顯示
more +/pattern file.txt           # 搜索模式pattern並從匹配行開始顯示
```


<br/>


## **head**

顯示文件開頭部分

**語法：**

```bash
head [選項] [文件...]
```

**選項：**

```bash
-c, --bytes=[-]NUM   # 顯示文件的前NUM字節；NUM前可加“-”表示從文件末尾開始算
-n, --lines=[-]NUM   # 顯示文件的前NUM行；NUM前可加“-”表示從文件末尾開始算
-q, --quiet, --silent # 不顯示文件名（僅在多文件時有用）
-v, --verbose        # 顯示文件名（僅在多文件時有用）
```

**範例：**

```bash
head file.txt                 # 顯示file.txt的前10行
head -n 5 file.txt            # 顯示file.txt的前5行
head -c 20 file.txt           # 顯示file.txt的前20個字節
head -n -5 file.txt           # 顯示file.txt，除了最後5行
head -q file1.txt file2.txt   # 顯示file1.txt和file2.txt的前10行，不顯示文件名
head -v file1.txt file2.txt   # 顯示file1.txt和file2.txt的前10行，並顯示文件名
```


<br/>


## **tail**

顯示文件結尾部分

**語法：**

```bash
tail [選項] [文件...]
```

**選項：**

```bash
-c number, --bytes=number   # 顯示文件的最後number個字節
-f                          # 持續顯示文件的新內容（文件增長時顯示新內容）
-F                          # 等同於-f，但會在文件被重命名或移動時重新打開文件
-n number, --lines=number   # 顯示文件的最後number行
-q, --quiet, --silent       # 不顯示多個文件的文件名
-v, --verbose               # 顯示多個文件時，顯示文件名
```

**範例：**

```bash
tail file.txt                 # 顯示file.txt的最後10行
tail -n 20 file.txt           # 顯示file.txt的最後20行
tail -c 50 file.txt           # 顯示file.txt的最後50個字節
tail -f /var/log/syslog       # 實時顯示/var/log/syslog的新增內容
tail -F /var/log/messages     # 實時顯示/var/log/messages的新增內容，並在文件被重命名或移動時重新打開
tail -q file1.txt file2.txt   # 顯示file1.txt和file2.txt的最後10行，不顯示文件名
tail -v file1.txt file2.txt   # 顯示file1.txt和file2.txt的最後10行，並顯示文件名

```


<br/>


## **grep**

搜尋文件中的文字

**語法：**

```bash
grep [選項] PATTERN [文件...]
```

**選項：**

```bash
-E, --extended-regexp     # 使用擴展正則表達式
-F, --fixed-strings       # 使用固定字符串作為模式，而不是正則表達式
-G, --basic-regexp        # 使用基本正則表達式（默認）
-c, --count               # 只顯示匹配的行數
-i, --ignore-case         # 忽略大小寫
-v, --invert-match        # 只顯示不匹配的行
-w, --word-regexp         # 強制模式與單詞匹配
-x, --line-regexp         # 強制模式與整行匹配
-n, --line-number         # 顯示匹配行的行號
-r, --recursive           # 遞歸搜索目錄中的文件
-l, --files-with-matches  # 只顯示包含匹配的文件名
-L, --files-without-match # 只顯示不包含匹配的文件名
-m, --max-count=NUM       # 在匹配到NUM個匹配後停止搜索
-o, --only-matching       # 只顯示匹配的部分
-q, --quiet, --silent     # 靜默模式，不顯示任何輸出
-A NUM, --after-context=NUM  # 顯示匹配行後NUM行
-B NUM, --before-context=NUM # 顯示匹配行前NUM行
-C NUM, --context=NUM        # 顯示匹配行前後各NUM行
```

**範例：**

```bash
grep "pattern" file.txt                   # 搜索file.txt中包含"pattern"的行
grep -i "pattern" file.txt                # 搜索file.txt中包含"pattern"（忽略大小寫）的行
grep -v "pattern" file.txt                # 搜索file.txt中不包含"pattern"的行
grep -r "pattern" /path/to/directory      # 遞歸搜索目錄中包含"pattern"的文件
grep -n "pattern" file.txt                # 搜索file.txt中包含"pattern"的行，並顯示行號
grep -l "pattern" /path/to/directory/*    # 列出目錄中包含"pattern"的文件名
grep -c "pattern" file.txt                # 顯示file.txt中包含"pattern"的行數
grep -A 3 "pattern" file.txt              # 顯示file.txt中包含"pattern"的行及其後3行
grep -B 2 "pattern" file.txt              # 顯示file.txt中包含"pattern"的行及其前2行
grep -C 2 "pattern" file.txt              # 顯示file.txt中包含"pattern"的行及其前後各2行
grep -o "pattern" file.txt                # 只顯示file.txt中匹配的部分
```


<br/>


## **sed**

流編輯器，用於文字替換和操作

**語法：**

```bash
sed [選項] '指令' [文件...]
sed [選項] -f scriptfile [文件...]
```

**選項：**

```bash
-e<script> 或 --expression=<script>  # 以選項中的指定的script來處理輸入的文字檔
-f<script檔案> 或 --file=<script檔案>  # 以選項中指定的script檔案來處理輸入的文字檔
-h 或 --help  # 顯示幫助
-n 或 --quiet 或 --silent  # 僅顯示script處理後的結果
-V 或 --version  # 顯示版本資訊
```

**命令：**

```bash
a\  # 在當前行下面插入文字
i\  # 在當前行上面插入文字
c\  # 把選定的行改為新的文字
d  # 刪除選擇的行
D  # 刪除範本塊的第一行
s  # 替換指定字元
h  # 複製範本塊的內容到記憶體中的緩衝區
H  # 追加範本塊的內容到記憶體中的緩衝區
g  # 獲得記憶體緩衝區的內容，並替代當前範本塊中的文字
G  # 獲得記憶體緩衝區的內容，並追加到當前範本塊文字的後面
l  # 列表不能列印字元的清單
n  # 讀取下一個輸入行，用下一個命令處理新的行而不是用第一個命令
N  # 追加下一個輸入行到範本塊後面並在二者間嵌入一個新行，改變當前行號碼
p  # 列印範本塊的行
P  # 列印範本塊的第一行
q  # 退出Sed
b lable  # 分支到指令碼中帶有標記的地方，如果分支不存在則分支到指令碼的末尾
r file  # 從file中讀行
t label  # if分支，從最後一行開始，條件一旦滿足或者T，t命令，將導致分支到帶有標號的命令處，或者到指令碼的末尾
T label  # 錯誤分支，從最後一行開始，一旦發生錯誤或者T，t命令，將導致分支到帶有標號的命令處，或者到指令碼的末尾
w file  # 寫並追加範本塊到file末尾
W file  # 寫並追加範本塊的第一行到file末尾
!  # 表示後面的命令對所有沒有被選定的行發生作用
=  # 列印當前行號碼
#  # 把註釋擴展到下一個分行符號以前
```

**替換標記：**

```bash
g  # 表示行內全面替換
p  # 表示列印行
w  # 表示把行寫入一個檔案
x  # 表示互換範本塊中的文字和緩衝區中的文字
y  # 表示把一個字元翻譯為另外的字元（但是不用於正規表示式）
\1  # 子串匹配標記
&  # 已匹配字串標記
```

**元字元集：**

```bash
^  # 匹配行開始，如：/^sed/匹配所有以sed開頭的行
$  # 匹配行結束，如：/sed$/匹配所有以sed結尾的行
.  # 匹配一個非分行符號的任意字元，如：/s.d/匹配s後接一個任意字元，最後是d
*  # 匹配0個或多個字元，如：/*sed/匹配所有範本是一個或多個空格後緊跟sed的行
[]  # 匹配一個指定範圍內的字元，如/[ss]ed/匹配sed和Sed
[^]  # 匹配一個不在指定範圍內的字元，如：/[^A-RT-Z]ed/匹配不包含A-R和T-Z的一個字母開頭，緊跟ed的行
\(..\)  # 匹配子串，保存匹配的字元，如s/\(love\)able/\1rs，loveable被替換成lovers
&  # 保存搜尋字元用來替換其他字元，如s/love/**&**/，love這成**love**
\<  # 匹配單詞的開始，如:/\<love/匹配包含以love開頭的單詞的行
\>  # 匹配單詞的結束，如/love\>/匹配包含以love結尾的單詞的行
x\{m\}  # 重複字元x，m次，如：/0\{5\}/匹配包含5個0的行
x\{m,\}  # 重複字元x，至少m次，如：/0\{5,\}/匹配至少有5個0的行
x\{m,n\}  # 重複字元x，至少m次，不多於n次，如：/0\{5,10\}/匹配5~10個0的行
```

**範例：**

```bash
sed 's/old/new/g' file.txt       # 將file.txt中的"old"替換為"new"
sed -i 's/old/new/g' file.txt    # 直接在file.txt中將"old"替換為"new"
sed -n '5,10p' file.txt          # 顯示file.txt的第5行到第10行
```


<br/>


## **awk**

一種模式匹配和文字處理的語言，用於對文件中的資料進行掃描和處理。

**語法：**

```bash
awk [選項] 'script' var=value file(s)
awk [選項] -f scriptfile var=value file(s)
```

**選項：**

```bash
-F fs  # 指定輸入分隔符，fs可以是字串或正規表示式，如-F:
-v var=value  # 賦值一個使用者定義變數，將外部變數傳遞給awk
-f scriptfile  # 從指令碼檔案中讀取awk命令
-m[fr] val  # 對val值設定內在限制，-mf選項限制分配給val的最大塊數目；-mr選項限制記錄的最大數目
```

**命令：**

```bash
BEGIN { commands }  # 在讀取輸入文件之前執行的命令
pattern { commands }  # 在讀取輸入文件時對每一行進行匹配並執行的命令
END { commands }  # 在讀取完輸入文件後執行的命令
```

**awk內建變數（預定義變數）：**

```bash
$n  # 當前記錄的第n個欄位，如$1表示第一個欄位
$0  # 當前行的全部內容
ARGC  # 命令列參數的數目
ARGIND  # 命令列中當前檔案的位置（從0開始算）
ARGV  # 命令列參數的陣列
CONVFMT  # 數字轉換格式（預設值為%.6g）
ENVIRON  # 環境變數關聯陣列
ERRNO  # 最後一個系統錯誤的描述
FIELDWIDTHS  # 欄位寬度列表（用空格鍵分隔）
FILENAME  # 當前輸入檔案的名
FNR  # 當前檔案的記錄數
FS  # 欄位分隔符（默認是任何空格）
IGNORECASE  # 忽略大小寫的匹配
NF  # 當前記錄中的欄位數
NR  # 已讀取的記錄數
OFMT  # 數字的輸出格式（預設值是%.6g）
OFS  # 輸出欄位分隔符（預設值是一個空格）
ORS  # 輸出記錄分隔符（預設值是一個分行符號）
RS  # 記錄分隔符（默認是一個分行符號）
RSTART  # 由match函數所匹配的字串的第一個位置
RLENGTH  # 由match函數所匹配的字串的長度
SUBSEP  # 陣列下標分隔符（預設值是34）
```

**awk運算子：**

```bash
# 算術運算子
+ - * / %  # 加、減、乘、除、求餘
^ **  # 求冪
++ --  # 自增、自減

# 賦值運算子
= += -= *= /= %= ^= **=  # 賦值及複合賦值

# 邏輯運算子
||  # 邏輯或
&&  # 邏輯與
!  # 邏輯非

# 正則運算子
~  # 匹配正規表示式
~!  # 不匹配正規表示式

# 關係運算子
< <= > >= != ==  # 小於、小於等於、大於、大於等於、不等於、等於

# 其它運算子
$  # 欄位引用
空格  # 字串連接符
?:  # C語言的條件表示式
in  # 判斷陣列中是否存在某鍵值
```

**awk內建函數：**

```bash
# 算術函數
sin(x)  # 返回x的正弦值
cos(x)  # 返回x的餘弦值
sqrt(x)  # 返回x的平方根
exp(x)  # 返回x的冪值
log(x)  # 返回x的自然對數
int(x)  # 返回x的整數部分
rand()  # 返回一個0到1之間的隨機數
srand([expr])  # 設置隨機數種子並返回之前的種子值

# 字串函數
length([string])  # 返回字串的長度
substr(string, m, [n])  # 返回字串的子串
index(string, search)  # 返回子串在字串中的位置
split(string, array, [fs])  # 根據分隔符分割字串並存入陣列
match(string, ere)  # 返回正則表示式在字串中的位置
sub(ere, replacement, [string])  # 替換第一個匹配的子串
gsub(ere, replacement, [string])  # 替換所有匹配的子串
tolower(string)  # 將字串轉換為小寫
toupper(string)  # 將字串轉換為大寫
sprintf(format, expressions)  # 格式化字串

# 一般函數
close(expression)  # 關閉文件或管道
system(command)  # 執行系統命令並返回狀態
getline [var]  # 從輸入中讀取一行並賦值給變數
```

**awk控制流語句：**

```bash
# 條件判斷語句
if (condition) { statements } else { statements }

# 循環語句
while (condition) { statements }
for (initialization; condition; increment) { statements }
do { statements } while (condition)

# 跳出循環語句
break
continue

# 其他控制流語句
next  # 讀取下一行
exit  # 結束awk程序
```

**陣列應用：**

```bash
# 陣列的定義
array[index] = value

# 讀取陣列的值
for (index in array) { print array[index] }

# 刪除陣列元素
delete array[index]

# 二維陣列的使用
array[i, j] = value

# 檢查陣列中是否存在鍵值
if (key in array) { statements }
```

**範例：**

```bash
# 計算文件的行數
awk 'END { print NR }' filename

# 計算第一列的和
awk '{ sum += $1 } END { print sum }' filename

# 將外部變數傳遞給awk
VAR=100
echo | awk -v var=$VAR '{ print var }'

# 使用模式匹配顯示匹配行
awk '/pattern/ { print $0 }' filename

# 列印第一列和第三列
awk '{ print $1, $3 }' filename\
```


<br/>


## **Reference**[](https://notes.boshkuo.com/docs/Linux/Commands/Introduction#reference)

- [**鸟哥Linux命令大全**](https://man.niaoge.com/)
- [**Linux命令大全(手册)**](https://www.linuxcool.com/)
- [**Linux Command**](https://github.com/jaywcjlove/linux-command)
- [**Linux 命令大全**](https://www.runoob.com/linux/linux-command-manual.html)