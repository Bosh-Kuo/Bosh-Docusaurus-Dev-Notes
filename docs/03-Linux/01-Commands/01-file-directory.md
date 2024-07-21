---
title: "Linux 常用指令大全 - 文件與目錄操作"
sidebar_label: "文件與目錄操作"
description: 這篇文章將詳細介紹 Linux 中最常用的文件與目錄操作指令，包括 ls, cd, pwd, mkdir, rmdir, rm, cp, mv, touch, find 和 ln。通過學習這些指令，你將能夠高效地瀏覽目錄結構、管理文件和目錄、進行文件查找以及創建鏈接等操作。
last_update:
  date: 2024-07-19
keywords:
  - Linux
  - Command
  - 常用指令
tags:
  - Linux
---


## **ls**

列出目錄內容

**語法：**

```bash
ls [選項] [目錄]
```

**選項：**

```bash
-@      # 顯示擴展屬性鍵和值的長格式輸出
-A      # 顯示除.和..之外的所有條目
-B      # 強制以八進制表示不可打印字符
-C      # 強制多列輸出（默認）
-D      # 使用自定義日期格式
-F      # 在文件名後附加文件類型指示符
-G      # 啟用彩色輸出
-H      # 跟隨命令行中的符號鏈接
-I      # 禁止超級用戶自動設置-A選項
-L      # 跟隨所有符號鏈接
-O      # 包括文件標誌在內的長格式輸出
-P      # 列出符號鏈接本身而非其目標
-R      # 遞歸列出子目錄
-S      # 按大小排序（最大優先）
-T      # 顯示完整時間信息
-U      # 使用創建時間進行排序
-W      # 顯示白化條目
-a      # 顯示以.開頭的所有條目
-b      # 使用C語言轉義碼表示不可打印字符
-c      # 使用狀態更改時間進行排序
--color=when # 根據when設置彩色輸出（always、auto、never）
-d      # 將目錄視為普通文件而非遞歸列出
-e      # 顯示文件的ACL（訪問控制列表）
-f      # 禁用排序，啟用-a選項
-g      # 顯示組名（僅兼容性）
-h      # 使用人類可讀格式顯示大小
-i      # 顯示文件的inode號
-k      # 將塊大小設置為1024字節
-l      # 使用長格式列出文件
-m      # 以流格式輸出，用逗號分隔文件名
-n      # 以數字格式顯示用戶和組ID
-o      # 長格式但省略組ID
-p      # 在目錄名後附加斜杠
-q      # 使用問號表示不可打印字符
-r      # 反轉排序順序
-s      # 顯示文件系統使用的塊數
-t      # 按修改時間排序（最近優先）
-u      # 使用最後訪問時間進行排序
-v      # 強制未編輯打印不可打印字符
-w      # 強制原樣打印不可打印字符
-x      # 多列輸出，按行排序
-y      # 按相同順序排序時間和名稱
-%      # 區分無數據文件和目錄
-1      # 每行顯示一個條目
-,      # 使用千位分隔符顯示文件大小

```

**範例：**

```bash
ls                      # 列出當前目錄下的所有文件和目錄
ls -a                   # 列出所有文件，包括隱藏文件
ls -l                   # 以詳細信息列出文件和目錄
ls -lh                  # 以詳細信息和人類可讀的格式列出文件和目錄
ls -R                   # 遞歸列出目錄及其內容
ls -S                   # 按文件大小排序列出文件和目錄
ls -lt                  # 按修改時間排序列出文件和目錄
ls -lioF                # 顯示inode號、文件標誌，並用符號表示文件類型
ls -d */                # 僅列出當前目錄下的目錄
ls --color=auto         # 自動啟用彩色輸出
ls -p                   # 在目錄名後附加斜杠
ls -i                   # 顯示文件的inode號
ls -m                   # 以逗號分隔文件名輸出
ls -n                   # 以數字格式顯示用戶和組ID
ls -1                   # 每行顯示一個條目
ls -x                   # 多列輸出，按行排序
ls -%                   # 區分無數據文件和目錄
ls -e                   # 顯示文件的ACL（訪問控制列表）
```


<br/>


## **cd**

變更目錄

**語法：**

```bash
cd [目錄]
```

**選項：**

無特定選項

**範例：**

```bash
cd ~                     # 進入主目錄
cd ..                    # 進入上一級目錄
cd /path/to/directory    # 進入指定目錄
```


<br/>


## **pwd**

返回當前工作目錄的名稱

**語法：**

```bash
pwd [-L | -P]
```

**選項：**

```bash
-L      # 顯示邏輯當前工作目錄（默認）
-P      # 顯示物理當前工作目錄（解析所有符號鏈接）
```

**範例：**

```bash
pwd                      # 顯示邏輯當前工作目錄
pwd -L                   # 顯示邏輯當前工作目錄（與不帶選項時相同）
pwd -P                   # 顯示物理當前工作目錄（解析所有符號鏈接）
```


<br/>


## **mkdir**

創建新目錄

**語法：**

```bash
mkdir [-pv] [-m mode] 目錄名稱
```

**選項：**

```bash
-m mode  # 設置最終創建目錄的文件許可權位，可以是任何chmod(1)命令指定的格式
-p       # 根據需要創建中間目錄，不會報錯如果目錄已存在
-v       # 創建目錄時顯示詳細信息，列出創建的目錄

```

**範例：**

```bash
mkdir foobar                     # 創建名為foobar的目錄
mkdir -m 700 foobar              # 創建名為foobar的目錄並設置其許可權為700
mkdir -p cow/horse/monkey        # 創建cow/horse/monkey目錄，必要時創建中間目錄
mkdir -v foobar                  # 創建名為foobar的目錄並顯示詳細信息
```


<br/>


## **rmdir**

刪除空目錄

**語法：**

```bash
rmdir [選項] 目錄名稱
```

**選項：**

```bash
-p, --parents            # 連同父目錄一起刪除（如果變成空目錄）
-v, --verbose            # 顯示刪除目錄的詳細信息
```

**範例：**

```bash
rmdir empty_directory               # 刪除一個空目錄
rmdir -p path/to/empty_directory    # 刪除空目錄及其父目錄（如果變成空目錄）
rmdir -v empty_directory            # 刪除空目錄並顯示詳細信息
```


<br/>


## **rm**

刪除文件或目錄

**語法：**

```bash
rm [-f | -i] [-dIIRrvWx] 文件或目錄名稱
```

**選項：**

```bash
-d      # 嘗試刪除目錄以及其他類型的文件
-f      # 嘗試刪除文件而不提示確認，無論文件的許可權如何
-i      # 刪除每個文件前請求確認，無論文件的許可權如何
-I      # 如果刪除超過三個文件或遞歸刪除目錄，請求一次確認
-P      # 保留為向後兼容，無實際作用
-R      # 嘗試遞歸刪除文件層次結構
-r      # 等同於-R
-v      # 刪除文件時顯示詳細信息
-W      # 嘗試撤銷刪除指定的文件
-x      # 遞歸刪除層次結構時不跨越掛載點
```

**範例：**

```bash
rm file.txt                   # 刪除 file.txt 文件
rm -f file.txt                # 強制刪除 file.txt 文件而不提示
rm -i file.txt                # 刪除 file.txt 文件前請求確認
rm -r directory               # 遞歸刪除 directory 目錄及其內容
rm -rf directory              # 強制遞歸刪除 directory 目錄及其內容而不提示
rm -v file.txt                # 刪除 file.txt 文件時顯示詳細信息
rm -- -filename               # 刪除名稱以 - 開頭的文件 -filename
rm /home/user/-filename       # 使用絕對路徑刪除名稱以 - 開頭的文件
rm ./-filename                # 使用相對路徑刪除名稱以 - 開頭的文件
unlink file.txt               # 使用 unlink 刪除 file.txt 文件

```


<br/>


## **cp**

複製文件或目錄

**語法：**

```bash
cp [-R [-H | -L | -P]] [-f | -i | -n] [-alpsSvXx] source_file target_file
cp [-R [-H | -L | -P]] [-f | -i | -n] [-alpsSvXx] source_file ... target_directory
```

**選項：**

```bash
-H      # 如果指定了-R選項，則跟隨命令行中的符號鏈接
-L      # 如果指定了-R選項，則跟隨所有符號鏈接
-P      # 不跟隨符號鏈接（默認）
-R      # 遞歸地複製目錄及其內容
-a      # 存檔模式，相當於-RpP選項
-c      # 使用 clonefile(2) 複製文件，若不支持則使用 copyfile(2)
-f      # 如果無法打開目標文件，則刪除並創建新文件，不提示確認
-i      # 覆蓋文件前請求確認
-l      # 創建硬鏈接而非複製文件
-n      # 不覆蓋已存在的文件
-p      # 保留源文件的屬性（修改時間、訪問時間、文件標誌、模式、用戶ID、組ID等）
-S      # 不保留稀疏文件中的空洞
-s      # 創建符號鏈接而非複製文件
-v      # 顯示詳細的文件複製過程
-X      # 不複製擴展屬性（EAs）或資源分支
-x      # 不跨越文件系統掛載點
```

**範例：**

```bash
cp foo bar                   # 複製文件 foo 為 bar
cp *.txt /tmp                # 將所有 .txt 文件複製到 /tmp 目錄
cp -R junk /tmp              # 遞歸地將目錄 junk 及其所有內容複製到 /tmp 目錄
cp -i foo bar                # 覆蓋文件前請求確認
cp -p foo bar                # 複製文件並保留屬性
cp -l foo bar                # 創建硬鏈接而非複製文件
cp -s foo bar                # 創建符號鏈接而非複製文件
cp -v foo bar                # 顯示詳細的文件複製過程
cp -n foo bar                # 不覆蓋已存在的文件
cp -xR source_dir target_dir # 遞歸複製目錄但不跨越掛載點
```


<br/>


## **mv**

移動或重命名文件或目錄

**語法：**

```bash
mv [-f | -i | -n] [-hv] source target
mv [-f | -i | -n] [-v] source ... directory
```

**選項：**

```bash
-f      # 在覆蓋目標文件前不提示確認（覆蓋任何之前的 -i 或 -n 選項）
-h      # 如果目標是指向目錄的符號鏈接，則不跟隨，重命名符號鏈接
-i      # 在覆蓋文件前提示確認
-n      # 不覆蓋已存在的文件
-v      # 顯示移動文件的過程
```

**範例：**

```bash
mv foo bar                   # 將文件 foo 重命名為 bar
mv -f foo bar                # 在覆蓋 bar 前不提示確認
mv -i foo bar                # 在覆蓋 bar 前提示確認
mv -n foo bar                # 不覆蓋已存在的文件 bar
mv -v foo bar                # 顯示文件移動過程
mv file1 file2 dir/          # 將 file1 和 file2 移動到 dir 目錄下
mv -i file1 file2 dir/       # 將 file1 和 file2 移動到 dir 目錄下，覆蓋前提示確認
mv -f file1 file2 dir/       # 將 file1 和 file2 移動到 dir 目錄下，不提示確認
mv -h foo symlink_to_dir     # 重命名符號鏈接而不是移動到目標目錄
```


<br/>


## **touch**

創建空文件

**語法：**

```bash
touch [選項] 文件名稱
```

**選項：**

```bash
-A      # 調整文件的訪問和修改時間戳
-a      # 更改文件的訪問時間
-c      # 如果文件不存在則不創建新文件
-d      # 使用指定的日期時間設置訪問和修改時間
-h      # 如果文件是符號鏈接，則更改鏈接本身的時間
-m      # 更改文件的修改時間
-r      # 使用指定文件的訪問和修改時間
-t      # 使用指定的時間設置訪問和修改時間
```

**範例：**

```bash
touch filename                   # 創建一個空文件或更新文件的時間戳
touch -a filename                # 只更改訪問時間
touch -m filename                # 只更改修改時間
touch -c filename                # 如果文件不存在則不創建新文件
touch -d '2023-07-18 14:30:00' filename  # 使用指定的日期時間設置訪問和修改時間
touch -t 202307181430.00 filename        # 使用指定的時間設置訪問和修改時間
touch -r reference_file filename         # 使用參考文件的訪問和修改時間
touch -A -01 filename             # 調整時間戳，將時間減去1秒
```


<br/>


## **find**

搜尋文件或目錄

**語法：**

```bash
find [-H | -L | -P] [-EXdsx] [-f path] path ... [expression]
find [-H | -L | -P] [-EXdsx] -f path [path ...] [expression]
```

**選項：**

```bash
-E      # 使用擴展（現代）正則表達式
-H      # 命令行指定的符號鏈接返回其引用文件的信息
-L      # 所有符號鏈接返回其引用文件的信息
-P      # 符號鏈接返回鏈接本身的信息（默認）
-X      # 允許與xargs安全配合使用
-d      # 深度優先遍歷
-f path # 添加path到要遍歷的路徑列表
-s      # 以字典順序遍歷文件層次結構
-x      # 防止遍歷不同設備號的目錄
```

**常用表達式：**

```bash
-name pattern            # 匹配文件名
-iname pattern           # 匹配文件名（忽略大小寫）
-path pattern            # 匹配文件路徑
-ipath pattern           # 匹配文件路徑（忽略大小寫）
-type type               # 匹配文件類型（如 d 目錄, f 普通文件, l 符號鏈接）
-user uname              # 匹配文件所有者
-group gname             # 匹配文件所屬組
-size n[cwbkMG]          # 匹配文件大小
-mtime n                 # 匹配修改時間
-atime n                 # 匹配訪問時間
-ctime n                 # 匹配狀態改變時間
-newer file              # 比指定文件新
-perm mode               # 匹配文件權限
-exec command {} \;      # 對匹配文件執行命令
-delete                  # 刪除匹配文件
-empty                   # 匹配空文件或目錄
-prune                   # 不對匹配的目錄進行遞歸

```

**範例：**

```bash
find / -name "*.txt" -print              # 列出根目錄及其子目錄下所有擴展名為.txt的文件
find /srv -name "*.tar.gz" -exec rm {} \; # 刪除/srv目錄下所有擴展名為.tar.gz的文件
find /data -iname "*.jpg" -print         # 列出/data目錄下所有擴展名為.jpg（不區分大小寫）的文件
find /home -user username -print         # 列出/home目錄下屬於用戶username的所有文件
find /var -type d -name "log" -print     # 列出/var目錄下名為log的所有目錄
find /tmp -type l -print                 # 列出/tmp目錄下的所有符號鏈接
find /var/log -type f -mtime -1 -print   # 列出/var/log目錄下過去一天內修改的所有文件
find / -size +100M -print                # 列出大小超過100MB的所有文件
find / -mtime -1 -print                  # 列出過去一天內修改的所有文件
find /backup -ctime -7 -print            # 列出/backup目錄下過去7天內更改狀態的所有文件
find / -perm 755 -print                  # 列出權限為755的所有文件
find / -exec ls -l {} \;                 # 列出根目錄及其子目錄下所有文件的詳細信息
find / -empty -print                     # 列出所有空文件或目錄
```


<br/>


## **ln**

創建硬連結或軟連結

**語法：**

```bash
ln [選項] 源文件 [目標文件]
ln [選項] 源文件 ... 目標目錄
ln 源文件 目標文件
```

**選項：**

```bash
-F    # 如果目標文件已存在且是目錄，則將其刪除以便創建鏈接（需與-f或-i選項一起使用）
-L    # 創建硬鏈接到符號鏈接的目標
-P    # 創建硬鏈接到符號鏈接本身
-f    # 如果目標文件已存在，則刪除並創建新的鏈接
-h    # 如果目標文件或目標目錄是符號鏈接，則不跟隨
-i    # 如果目標文件已存在，則提示確認後再刪除
-n    # 同-h選項，為兼容性提供
-s    # 創建符號鏈接
-v    # 顯示正在處理的文件
-w    # 如果符號鏈接的源文件不存在，則給出警告
```

**範例：**

```bash
ln -s /usr/src /home/src                   # 創建一個指向/usr/src的符號鏈接，名為/home/src
ln /usr/local/bin/fooprog-1.0 /usr/local/bin/fooprog  # 創建硬鏈接，將/usr/local/bin/fooprog指向/usr/local/bin/fooprog-1.0
ln -shf baz foo                            # 將符號鏈接foo指向baz，替換原有的foo
ln -v -s /usr/local/bin/myapp /usr/bin/myapp  # 創建一個符號鏈接，並顯示詳細過程
ln -i file1 file2                        # 提示確認後，創建一個名為file2的硬鏈接，指向file1
```

### **硬鏈接 (Hard Link)**

硬鏈接是一種指向文件的直接引用。它們具有以下特性：

1. **指向同一個inode**：硬鏈接指向文件系統中的同一個inode（文件索引節點）。因此，硬鏈接與原文件之間沒有區別，它們是同一文件的多個名稱。
2. **文件內容共享**：因為硬鏈接指向同一個inode，所以硬鏈接和原文件共享相同的文件內容。對其中任何一個的修改會影響所有硬鏈接和原文件。
3. **文件刪除**：只有當所有指向該inode的硬鏈接都被刪除時，文件的實際數據才會從文件系統中刪除。
4. **同一文件系統**：硬鏈接必須位於同一文件系統中，不能跨文件系統創建硬鏈接。
5. **不能鏈接目錄**：普通用戶無法對目錄創建硬鏈接，這是為了避免文件系統結構的混亂。

**範例：**

```bash
ln /usr/local/bin/fooprog-1.0 /usr/local/bin/fooprog
```

這將在 `/usr/local/bin/` 目錄中創建名為 `fooprog` 的硬鏈接，指向 `fooprog-1.0` 文件。

### **符號鏈接 (Symbolic Link)**

符號鏈接（或軟鏈接）是一種指向另一個文件或目錄的間接引用。它們具有以下特性：

1. **獨立inode**：符號鏈接擁有自己的inode，並且包含指向目標文件或目錄的路徑信息。
2. **可跨文件系統**：符號鏈接可以指向不同文件系統中的文件或目錄。
3. **目標可為目錄**：符號鏈接可以指向目錄，這使得它們比硬鏈接更靈活。
4. **目標不存在**：符號鏈接可以指向不存在的目標，當目標創建後，符號鏈接將自動生效。
5. **文件刪除**：刪除符號鏈接不會刪除目標文件，但刪除目標文件會導致符號鏈接變為“斷鏈”，指向一個無效的目標。

**範例：**

```bash
ln -s /usr/src /home/src
```

這將在 `/home/` 目錄中創建名為 `src` 的符號鏈接，指向 `/usr/src` 目錄。

**總結：**

- **硬鏈接**是文件的直接引用，必須在同一文件系統中，且不能鏈接目錄。
- **符號鏈接**是包含目標路徑信息的特殊文件，可以跨文件系統創建，且能鏈接目錄和不存在的目標。


<br/>


## **Reference**

- [**鸟哥Linux命令大全**](https://man.niaoge.com/)
- [**Linux命令大全(手册)**](https://www.linuxcool.com/)
- [**Linux Command**](https://github.com/jaywcjlove/linux-command)
- [**Linux 命令大全**](https://www.runoob.com/linux/linux-command-manual.html)