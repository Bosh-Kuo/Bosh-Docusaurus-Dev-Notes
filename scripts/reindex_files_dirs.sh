#!/bin/bash

# description: 
#   This script increments the numbering of directories and .md files within the specified range.
#   Each directory and file within the range will have its number increased by 1.
#   The names should follow the pattern NN-xxx, where NN is a two-digit number.
# Usage: 
#   ./rename_folders.sh <directory> <start_number> <end_number>
# ex: 
#   ./rename_folders.sh ../docs 01 05
#   This command will rename directories in the docs folder from 01-xxx to 02-xxx, 02-xxx to 03-xxx, and so on up to 05-xxx to 06-xxx.
#   ./rename_items.sh ../docs/01-Docusaurus 01 05
#   This command will rename files in the ../docs/01-Docusaurus folder such as 01-xxx.md to 02-xxx.md, 02-xxx.md to 03-xxx.md, and so on up to 05-xxx.md to 06-xxx.md.

# 檢查是否提供了正確的參數
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <directory> <start_number> <end_number>"
    exit 1
fi

DIRECTORY=$1
START_NUM=$2
END_NUM=$3

# 檢查目錄是否存在
if [ ! -d "$DIRECTORY" ]; then
    echo "Directory $DIRECTORY does not exist."
    exit 1
fi

# 檢查數字區間
if [ "$START_NUM" -gt "$END_NUM" ]; then
    echo "Start number should be less than or equal to end number."
    exit 1
fi

# 進入目錄
cd "$DIRECTORY"

# 從尾到頭遍歷目錄，避免命名衝突
for (( i=END_NUM; i>=START_NUM; i-- )); do
    CURRENT_NUM=$(printf "%02d" $i)
    NEW_NUM=$(printf "%02d" $((i+1)))
    
    # 重命名目錄
    for item in ${CURRENT_NUM}-*; do
        if [ -d "$item" ]; then
            NEW_ITEM="${NEW_NUM}-${item#*-}"
            echo "Renaming directory $item to $NEW_ITEM"
            mv "$item" "$NEW_ITEM"
        fi
    done

    # 重命名文件
    for item in ${CURRENT_NUM}-*.md; do
        if [ -f "$item" ]; then
            NEW_ITEM="${NEW_NUM}-${item#*-}"
            echo "Renaming file $item to $NEW_ITEM"
            mv "$item" "$NEW_ITEM"
        fi
    done
done

echo "Renaming complete."
