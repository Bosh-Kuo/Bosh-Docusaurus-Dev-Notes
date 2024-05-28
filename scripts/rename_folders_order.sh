#!/bin/bash

# description: 
#   This script increments the numbering of directories within the specified range.
#   Each directory within the range will have its number increased by 1.
#   The directory names should follow the pattern NN-xxx, where NN is a two-digit number.
# Usage: 
#   ./rename_folders.sh <directory> <start_number> <end_number>
# ex: 
#   ./rename_folders.sh ../docs 01 05
#   This command will rename directories in the docs folder from 01-xxx to 02-xxx, 02-xxx to 03-xxx, and so on up to 05-xxx to 06-xxx.

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
    
    for dir in ${CURRENT_NUM}-*; do
        if [ -d "$dir" ]; then
            NEW_DIR="${NEW_NUM}-${dir#*-}"
            echo "Renaming $dir to $NEW_DIR"
            mv "$dir" "$NEW_DIR"
        fi
    done
done

echo "Renaming complete."
