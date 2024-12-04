#!/bin/bash
# description:
#   This script adjusts the numbering prefixes of directories and files within a specified range.
#   It interacts with the user to:
#     1. Select the target directory.
#     2. Define the range of numbering (e.g., 01 to 14).
#     3. Choose to either increment or decrement the numbering by 1.
#   Files and directories must follow the naming pattern NN-xxx, where NN is a two-digit number.
#
# Usage:
#   1. Run the script:
#      ./reindex_files_dirs.sh
#
#   2. Follow the prompts:
#      - Enter the path of the target directory (e.g., ../docs/06-Javascript).
#      - Enter the start and end numbers for the range (e.g., 08 and 14).
#      - Choose the operation: Increment (add 1) or Decrement (subtract 1).
#      - Confirm the operation before execution.
#
# Examples:
#   - Renaming directories and files in ../docs/06-Javascript:
#     If the directory contains:
#       01-js-array-method.md
#       02-js-modules.md
#       ...
#       14-js-constructor-prototype.md
#
#     Input during script execution:
#       Target directory: ../docs/06-Javascript
#       Start number: 08
#       End number: 14
#       Operation: Increment
#
#     The result will be:
#       01-js-array-method.md
#       02-js-modules.md
#       ...
#       15-js-constructor-prototype.md
#
# Notes:
#   - The script ensures only files and directories within the specified range are modified.
#   - Leading zeros in the numbering (e.g., 08, 09) are correctly handled as decimal numbers.
#   - The script validates inputs and allows users to cancel the operation before execution.
#
# Troubleshooting:
#   - If files are not renamed, check that their naming follows the NN-xxx pattern.
#   - Ensure the target directory exists and is accessible.
#   - If you encounter any errors, verify that the start and end numbers are valid integers.

# 提示使用者選擇目錄
echo "請輸入要操作的目錄路徑："
read -r DIRECTORY

# 檢查目錄是否存在
if [ ! -d "$DIRECTORY" ]; then
    echo "目錄不存在，請檢查路徑後再試。"
    exit 1
fi

# 提示輸入操作的檔案編號範圍
echo "請輸入操作範圍的起始編號（例如：01）："
read -r START_NUM_RAW
echo "請輸入操作範圍的結束編號（例如：14）："
read -r END_NUM_RAW

# 移除輸入中的前導零，並轉換為十進制數字
START_NUM=$(echo "$START_NUM_RAW" | sed 's/^0*//')
END_NUM=$(echo "$END_NUM_RAW" | sed 's/^0*//')

# 檢查是否為有效的數字
if ! [[ "$START_NUM" =~ ^[0-9]+$ ]] || ! [[ "$END_NUM" =~ ^[0-9]+$ ]]; then
    echo "起始或結束編號無效，請輸入有效的數字（例如：01, 08）。"
    exit 1
fi

# 確保起始編號小於或等於結束編號
if [ "$START_NUM" -gt "$END_NUM" ]; then
    echo "起始編號必須小於或等於結束編號。"
    exit 1
fi

# 提示使用者選擇操作
echo "請選擇要進行的操作："
echo "1) 將編號加 1"
echo "2) 將編號減 1"
read -r OPERATION

if [ "$OPERATION" != "1" ] && [ "$OPERATION" != "2" ]; then
    echo "無效的操作選項，請輸入 1 或 2。"
    exit 1
fi

# 根據操作選項設定編號增量
if [ "$OPERATION" -eq 1 ]; then
    INCREMENT=1
    ACTION="加"
else
    INCREMENT=-1
    ACTION="減"
fi

# 確認操作範圍
echo "即將對目錄 '$DIRECTORY' 中編號範圍 $START_NUM 至 $END_NUM 的項目進行 $ACTION 1 的操作。"
echo "確認後按 y 開始，其他按鍵取消操作。"
read -r CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "操作已取消。"
    exit 0
fi

# 進入目錄
cd "$DIRECTORY" || exit 1

# 按範圍操作檔案與目錄
for (( i=END_NUM; i>=START_NUM; i-- )); do
    CURRENT_NUM=$(printf "%02d" "$i")
    NEW_NUM=$(printf "%02d" $((i + INCREMENT)))
    
    # 過濾符合範圍的目錄和檔案，其他不操作
    for item in ${CURRENT_NUM}-*; do
        if [ -d "$item" ]; then
            NEW_ITEM="${NEW_NUM}-${item#*-}"
            echo "Renaming directory $item to $NEW_ITEM"
            mv "$item" "$NEW_ITEM"
        elif [ -f "$item" ]; then
            NEW_ITEM="${NEW_NUM}-${item#*-}"
            echo "Renaming file $item to $NEW_ITEM"
            mv "$item" "$NEW_ITEM"
        fi
    done
done

echo "操作完成！"
