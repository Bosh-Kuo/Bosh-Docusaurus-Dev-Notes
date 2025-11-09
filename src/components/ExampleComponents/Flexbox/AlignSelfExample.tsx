import React, { useState } from "react";
import styles from "./AlignSelfExample.module.css";

// Props 介面定義
interface AlignSelfExampleProps {
  title?: string;
  description?: string;
}

// 項目控制元件 Props
interface ItemControlProps {
  itemNumber: number;
  value: string;
  onChange: (value: string) => void;
}

// Flex 項目元件 Props
interface FlexItemProps {
  itemNumber: number;
  alignSelf: string;
}

// align-self 可用選項
const alignSelfOptions = [
  { value: "auto", label: "auto" },
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "baseline", label: "baseline" },
];

/**
 * 項目控制元件
 * 用於調整單個項目的 align-self 屬性
 */
const ItemControl: React.FC<ItemControlProps> = ({ itemNumber, value, onChange }) => (
  <div className={styles.itemControls}>
    <h4>Item {itemNumber}</h4>
    <div className={styles.controlGroup}>
      <label>align-self:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {alignSelfOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

/**
 * Flex 項目顯示元件
 * 顯示項目及其當前的 align-self 值
 */
const FlexItem: React.FC<FlexItemProps> = ({ itemNumber, alignSelf }) => (
  <div 
    className={styles.flexItem}
    style={{ alignSelf: alignSelf as any }}
  >
    <div className={styles.itemLabel}>Item {itemNumber}</div>
    <div className={styles.itemCode}>
      <code>align-self: {alignSelf}</code>
    </div>
  </div>
);

/**
 * align-self 屬性範例元件
 * 用於展示 align-self 如何覆蓋容器的 align-items 設定
 */
function AlignSelfExample({
  title = "align-self 範例",
  description,
}: AlignSelfExampleProps) {
  // 狀態管理
  const [alignSelf1, setAlignSelf1] = useState<string>("auto");
  const [alignSelf2, setAlignSelf2] = useState<string>("auto");
  const [alignSelf3, setAlignSelf3] = useState<string>("auto");

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      
      {/* 控制面板 */}
      <div className={styles.controls}>
        <ItemControl itemNumber={1} value={alignSelf1} onChange={setAlignSelf1} />
        <ItemControl itemNumber={2} value={alignSelf2} onChange={setAlignSelf2} />
        <ItemControl itemNumber={3} value={alignSelf3} onChange={setAlignSelf3} />
      </div>

      {/* CSS 程式碼顯示區 */}
      <div className={styles.codeBlock}>
        <code>
          {`/* Container */
display: flex;
align-items: stretch; /* 預設對齊方式 */`}
        </code>
      </div>

      {/* Flex 容器與項目 */}
      <div className={styles.flexContainer}>
        <FlexItem itemNumber={1} alignSelf={alignSelf1} />
        <FlexItem itemNumber={2} alignSelf={alignSelf2} />
        <FlexItem itemNumber={3} alignSelf={alignSelf3} />
      </div>
    </div>
  );
}

export default AlignSelfExample;
