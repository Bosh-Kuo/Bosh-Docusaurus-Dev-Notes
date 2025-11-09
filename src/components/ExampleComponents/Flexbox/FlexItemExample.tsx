import React, { useState } from "react";
import styles from "./FlexItemExample.module.css";

// Props 介面定義
interface FlexItemExampleProps {
  title?: string;
  description?: string;
  showControls?: "flexGrow" | "flexShrink" | "flexBasis" | false;
  initialFlexGrow1?: number;
  initialFlexGrow2?: number;
  initialFlexGrow3?: number;
  initialFlexShrink1?: number;
  initialFlexShrink2?: number;
  initialFlexShrink3?: number;
  initialFlexBasis1?: number;
  initialFlexBasis2?: number;
  initialFlexBasis3?: number;
  basisUnit?: "px" | "%" | "rem" | "em" | "auto";
}

// 項目控制元件 Props
interface ItemControlProps {
  itemNumber: number;
  showControls: "flexGrow" | "flexShrink" | "flexBasis";
  flexGrow: number;
  flexShrink: number;
  flexBasis: number;
  basisUnit: string;
  onFlexGrowChange: (value: number) => void;
  onFlexShrinkChange: (value: number) => void;
  onFlexBasisChange: (value: number) => void;
}

// Flex 項目元件 Props
interface FlexItemProps {
  itemNumber: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
}

/**
 * 項目控制元件
 * 根據 showControls 顯示對應的輸入控制項
 */
const ItemControl: React.FC<ItemControlProps> = ({
  itemNumber,
  showControls,
  flexGrow,
  flexShrink,
  flexBasis,
  basisUnit,
  onFlexGrowChange,
  onFlexShrinkChange,
  onFlexBasisChange,
}) => (
  <div className={styles.itemControls}>
    <h4>Item {itemNumber}</h4>
    {showControls === "flexGrow" && (
      <div className={styles.controlGroup}>
        <label>flex-grow:</label>
        <input 
          type="number" 
          min="0"
          value={flexGrow} 
          onChange={(e) => onFlexGrowChange(Number(e.target.value))}
        />
      </div>
    )}
    {showControls === "flexShrink" && (
      <div className={styles.controlGroup}>
        <label>flex-shrink:</label>
        <input 
          type="number" 
          min="0"
          value={flexShrink} 
          onChange={(e) => onFlexShrinkChange(Number(e.target.value))}
        />
      </div>
    )}
    {showControls === "flexBasis" && basisUnit !== "auto" && (
      <div className={styles.controlGroup}>
        <label>flex-basis ({basisUnit}):</label>
        <input 
          type="number" 
          min="0"
          value={flexBasis} 
          onChange={(e) => onFlexBasisChange(Number(e.target.value))}
        />
      </div>
    )}
  </div>
);

/**
 * Flex 項目顯示元件
 * 顯示項目及其當前的 flex 屬性值
 */
const FlexItem: React.FC<FlexItemProps> = ({
  itemNumber,
  flexGrow,
  flexShrink,
  flexBasis,
}) => (
  <div 
    className={styles.flexItem}
    style={{
      flexGrow,
      flexShrink,
      flexBasis,
    }}
  >
    <div className={styles.itemLabel}>Item {itemNumber}</div>
    <div className={styles.itemCode}>
      <code>
        {`flex-grow: ${flexGrow}
flex-shrink: ${flexShrink}
flex-basis: ${flexBasis}`}
      </code>
    </div>
  </div>
);

/**
 * Flex Item 屬性範例元件
 * 用於展示 flex-grow、flex-shrink、flex-basis 的效果
 * 
 * @param showControls - 控制顯示哪個屬性的調整選項
 */
function FlexItemExample({
  title = "Flex Item 屬性範例",
  description,
  showControls = false,
  initialFlexGrow1 = 0,
  initialFlexGrow2 = 0,
  initialFlexGrow3 = 0,
  initialFlexShrink1 = 1,
  initialFlexShrink2 = 1,
  initialFlexShrink3 = 1,
  initialFlexBasis1 = 0,
  initialFlexBasis2 = 0,
  initialFlexBasis3 = 0,
  basisUnit = "auto",
}: FlexItemExampleProps) {
  // 狀態管理 - Item 1
  const [flexGrow1, setFlexGrow1] = useState(initialFlexGrow1);
  const [flexShrink1, setFlexShrink1] = useState(initialFlexShrink1);
  const [flexBasis1, setFlexBasis1] = useState(initialFlexBasis1);

  // 狀態管理 - Item 2
  const [flexGrow2, setFlexGrow2] = useState(initialFlexGrow2);
  const [flexShrink2, setFlexShrink2] = useState(initialFlexShrink2);
  const [flexBasis2, setFlexBasis2] = useState(initialFlexBasis2);

  // 狀態管理 - Item 3
  const [flexGrow3, setFlexGrow3] = useState(initialFlexGrow3);
  const [flexShrink3, setFlexShrink3] = useState(initialFlexShrink3);
  const [flexBasis3, setFlexBasis3] = useState(initialFlexBasis3);

  // 計算 flex-basis 的最終值
  const getBasisValue = (value: number) => basisUnit === "auto" ? "auto" : `${value}${basisUnit}`;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      
      {/* 控制面板 */}
      {showControls && (
        <div className={styles.controls}>
          <ItemControl
            itemNumber={1}
            showControls={showControls}
            flexGrow={flexGrow1}
            flexShrink={flexShrink1}
            flexBasis={flexBasis1}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow1}
            onFlexShrinkChange={setFlexShrink1}
            onFlexBasisChange={setFlexBasis1}
          />
          <ItemControl
            itemNumber={2}
            showControls={showControls}
            flexGrow={flexGrow2}
            flexShrink={flexShrink2}
            flexBasis={flexBasis2}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow2}
            onFlexShrinkChange={setFlexShrink2}
            onFlexBasisChange={setFlexBasis2}
          />
          <ItemControl
            itemNumber={3}
            showControls={showControls}
            flexGrow={flexGrow3}
            flexShrink={flexShrink3}
            flexBasis={flexBasis3}
            basisUnit={basisUnit}
            onFlexGrowChange={setFlexGrow3}
            onFlexShrinkChange={setFlexShrink3}
            onFlexBasisChange={setFlexBasis3}
          />
        </div>
      )}

      {/* Flex 容器與項目 */}
      <div 
        className={styles.flexContainer}
        style={{
          maxWidth: showControls === "flexShrink" ? "500px" : "none",
        }}
      >
        <FlexItem
          itemNumber={1}
          flexGrow={flexGrow1}
          flexShrink={flexShrink1}
          flexBasis={getBasisValue(flexBasis1)}
        />
        <FlexItem
          itemNumber={2}
          flexGrow={flexGrow2}
          flexShrink={flexShrink2}
          flexBasis={getBasisValue(flexBasis2)}
        />
        <FlexItem
          itemNumber={3}
          flexGrow={flexGrow3}
          flexShrink={flexShrink3}
          flexBasis={getBasisValue(flexBasis3)}
        />
      </div>
    </div>
  );
}

export default FlexItemExample;
