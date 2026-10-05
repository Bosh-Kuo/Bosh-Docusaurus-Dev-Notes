import { useState } from "react";

interface OrderExampleProps {
  title?: string;
  description?: string;
}
function OrderExample({ title = "order 範例", description }: OrderExampleProps) {
  const [order1, setOrder1] = useState(0);
  const [order2, setOrder2] = useState(0);
  const [order3, setOrder3] = useState(0);
  return (
    <div className="m-[2rem_0] p-6 [border:1px_solid_var(--ifm-color-emphasis-300)] rounded-xl bg-(--ifm-background-surface-color) in-data-[theme='dark']:border-(--ifm-color-emphasis-300)">
      <h3 className="mt-0 mb-4 text-(--ifm-color-primary) text-[1.25rem]">{title}</h3>
      {description && <p className="mb-4 text-(--ifm-color-emphasis-700) text-[0.95rem]">{description}</p>}

      <div className="flex flex-wrap gap-6 mb-6 p-4 bg-(--ifm-color-emphasis-100) rounded-[6px]">
        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-[0.95rem] [&_h4]:text-(--ifm-color-primary) in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 1 (HTML 順序: 1)</h4>
          <div className="flex flex-col gap-1 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
            <span className="block mb-2 text-sm font-medium">order:</span>
            <input type="number" value={order1} onChange={(e) => setOrder1(Number(e.target.value))} />
          </div>
        </div>

        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-[0.95rem] [&_h4]:text-(--ifm-color-primary) in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 2 (HTML 順序: 2)</h4>
          <div className="flex flex-col gap-1 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
            <span className="block mb-2 text-sm font-medium">order:</span>
            <input type="number" value={order2} onChange={(e) => setOrder2(Number(e.target.value))} />
          </div>
        </div>

        <div className="flex-1 min-w-50 p-4 bg-(--ifm-background-color) rounded-[6px] [border:1px_solid_var(--ifm-color-emphasis-300)] [&_h4]:mt-0 [&_h4]:mb-3 [&_h4]:text-[0.95rem] [&_h4]:text-(--ifm-color-primary) in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
          <h4>Item 3 (HTML 順序: 3)</h4>
          <div className="flex flex-col gap-1 [&_label]:text-[0.85rem] [&_label]:font-semibold [&_label]:text-(--ifm-color-emphasis-800) [&_input]:p-[0.4rem] [&_input]:[border:1px_solid_var(--ifm-color-emphasis-300)] [&_input]:rounded-lg [&_input]:bg-(--ifm-background-color) [&_input]:text-(--ifm-font-color-base) [&_input]:text-[0.9rem] [&_input:focus]:[outline:none] [&_input:focus]:border-(--ifm-color-primary)">
            <span className="block mb-2 text-sm font-medium">order:</span>
            <input type="number" value={order3} onChange={(e) => setOrder3(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 min-h-37.5 p-4 bg-(--ifm-color-emphasis-100) [border:2px_dashed_var(--ifm-color-primary)] rounded-[6px] in-data-[theme='dark']:bg-(--ifm-background-surface-color)">
        <div
          className="flex flex-col justify-center items-center min-w-30 p-6 text-[white] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:all_0.3s_ease] [background:linear-gradient(135deg,#667eea,#764ba2)]"
          style={{ order: order1 }}
        >
          <div className="[font-weight:bold] text-[1.2rem] mb-2">Item 1</div>
          <div className="text-[0.8rem] text-center opacity-[0.9]">
            <code>order: {order1}</code>
          </div>
        </div>

        <div
          className="flex flex-col justify-center items-center min-w-30 p-6 text-[white] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:all_0.3s_ease] [background:linear-gradient(135deg,#f093fb,#f5576c)]"
          style={{ order: order2 }}
        >
          <div className="[font-weight:bold] text-[1.2rem] mb-2">Item 2</div>
          <div className="text-[0.8rem] text-center opacity-[0.9]">
            <code>order: {order2}</code>
          </div>
        </div>

        <div
          className="flex flex-col justify-center items-center min-w-30 p-6 text-[white] rounded-[6px] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] [transition:all_0.3s_ease] [background:linear-gradient(135deg,#4facfe,#00f2fe)]"
          style={{ order: order3 }}
        >
          <div className="[font-weight:bold] text-[1.2rem] mb-2">Item 3</div>
          <div className="text-[0.8rem] text-center opacity-[0.9]">
            <code>order: {order3}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderExample;
