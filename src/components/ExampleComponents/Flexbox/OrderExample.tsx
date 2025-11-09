import React, { useState } from "react";
import styles from "./OrderExample.module.css";

interface OrderExampleProps {
  title?: string;
  description?: string;
}

function OrderExample({
  title = "order 範例",
  description,
}: OrderExampleProps) {
  const [order1, setOrder1] = useState(0);
  const [order2, setOrder2] = useState(0);
  const [order3, setOrder3] = useState(0);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      
      <div className={styles.controls}>
        <div className={styles.itemControls}>
          <h4>Item 1 (HTML 順序: 1)</h4>
          <div className={styles.controlGroup}>
            <label>order:</label>
            <input 
              type="number" 
              value={order1} 
              onChange={(e) => setOrder1(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.itemControls}>
          <h4>Item 2 (HTML 順序: 2)</h4>
          <div className={styles.controlGroup}>
            <label>order:</label>
            <input 
              type="number" 
              value={order2} 
              onChange={(e) => setOrder2(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.itemControls}>
          <h4>Item 3 (HTML 順序: 3)</h4>
          <div className={styles.controlGroup}>
            <label>order:</label>
            <input 
              type="number" 
              value={order3} 
              onChange={(e) => setOrder3(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.flexContainer}>
        <div 
          className={`${styles.flexItem} ${styles.item1}`}
          style={{ order: order1 }}
        >
          <div className={styles.itemLabel}>Item 1</div>
          <div className={styles.itemCode}>
            <code>order: {order1}</code>
          </div>
        </div>

        <div 
          className={`${styles.flexItem} ${styles.item2}`}
          style={{ order: order2 }}
        >
          <div className={styles.itemLabel}>Item 2</div>
          <div className={styles.itemCode}>
            <code>order: {order2}</code>
          </div>
        </div>

        <div 
          className={`${styles.flexItem} ${styles.item3}`}
          style={{ order: order3 }}
        >
          <div className={styles.itemLabel}>Item 3</div>
          <div className={styles.itemCode}>
            <code>order: {order3}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderExample;
