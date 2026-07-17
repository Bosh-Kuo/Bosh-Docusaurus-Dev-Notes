export interface ZoomableSvg {
  /** 已複製、隔離 ID 並固定尺寸的完整 SVG markup。 */
  markup: string;
  /** SVG 使用者座標系尺寸，供共用預覽器計算 fit-to-viewport transform。 */
  width: number;
  height: number;
}

// 僅在 SVG 同時沒有有效 viewBox 與畫面尺寸時使用，避免建立零尺寸預覽。
const FALLBACK_WIDTH = 800;
const FALLBACK_HEIGHT = 400;

// 每次複製都產生不同命名空間；同一頁重複開關或同時存在多張圖也不會撞 ID。
let cloneSequence = 0;

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function getSvgSize(svg: SVGSVGElement): Pick<ZoomableSvg, "width" | "height"> {
  const viewBox = svg.viewBox.baseVal;

  // viewBox 最能代表 SVG 的原始使用者座標系，也不會受文章 CSS 縮放結果影響。
  if (isPositiveNumber(viewBox.width) && isPositiveNumber(viewBox.height)) {
    return { width: viewBox.width, height: viewBox.height };
  }

  // 少數 SVG 沒有 viewBox；此時以文章內實際渲染尺寸建立可操作的座標系。
  const bounds = svg.getBoundingClientRect();
  return {
    width: isPositiveNumber(bounds.width) ? bounds.width : FALLBACK_WIDTH,
    height: isPositiveNumber(bounds.height) ? bounds.height : FALLBACK_HEIGHT,
  };
}

/**
 * Mermaid 產生的 SVG 會使用大量 ID，並透過 href、url(#id) 或內嵌 CSS 互相引用。
 * 直接複製到同一份 document 會產生重複 ID，可能導致 marker、clipPath 或樣式指向
 * 原圖。因此複製時必須替所有 ID 加上唯一前綴，並同步更新所有引用。
 */
function cloneSvgWithUniqueIds(source: SVGSVGElement): SVGSVGElement {
  // 一律操作深層 clone，絕不改寫文章中仍在顯示的 Mermaid 原圖。
  const clone = source.cloneNode(true) as SVGSVGElement;
  const prefix = `mermaid-zoom-${++cloneSequence}-`;

  // querySelectorAll 不包含根節點，因此手動把 clone 放入集合，以防根 SVG 自己也有 ID。
  const elements = [
    clone,
    ...Array.from(clone.querySelectorAll<SVGElement>("[id]")),
  ];
  const idMap = new Map<string, string>();

  // 第一階段只建立 old -> new 對照並改寫 ID；等 map 完整後再處理跨元素引用。
  elements.forEach((element, index) => {
    const oldId = element.id;
    if (!oldId) return;

    const newId = `${prefix}${index}`;
    idMap.set(oldId, newId);
    element.id = newId;
  });

  // 先替換較長的 ID，避免其中一個 ID 是另一個 ID 的前綴。
  // 例如同時存在 `node` 與 `node-label` 時，先換短字串會破壞後者的匹配。
  const replacements = [...idMap].sort(([a], [b]) => b.length - a.length);

  // `#id` 形式同時涵蓋 href="#id"、url(#id) 與 Mermaid 內嵌 CSS selector。
  const replaceHashReferences = (value: string) =>
    replacements.reduce(
      (result, [oldId, newId]) =>
        result.replaceAll(`#${oldId}`, `#${newId}`),
      value,
    );

  // 第二階段掃描所有 attribute。只碰包含 # 的值，避免無意改寫其他文字內容。
  [clone, ...Array.from(clone.querySelectorAll<SVGElement>("*"))].forEach(
    (element) => {
      Array.from(element.attributes).forEach((attribute) => {
        if (attribute.name !== "id" && attribute.value.includes("#")) {
          element.setAttribute(
            attribute.name,
            replaceHashReferences(attribute.value),
          );
        }
      });
    },
  );

  // <style> 的 CSS 存在 textContent 而非 attribute，需要額外處理 ID selector 與 url()。
  clone.querySelectorAll("style").forEach((style) => {
    if (style.textContent) {
      style.textContent = replaceHashReferences(style.textContent);
    }
  });

  return clone;
}

/**
 * 建立 Modal 所需的獨立 SVG markup 與穩定座標尺寸。
 * 回傳純資料可讓 React state 保存快照，也讓原始 Mermaid 因主題或路由重新渲染時
 * 不會影響已開啟的預覽內容。
 */
export function prepareSvgForZoom(source: SVGSVGElement): ZoomableSvg {
  const { width, height } = getSvgSize(source);
  const clone = cloneSvgWithUniqueIds(source);

  // Mermaid 原圖通常帶有 max-width: 100% 等響應式規則。預覽副本改成明確尺寸，
  // 讓 usePanZoom 成為唯一的縮放來源，避免 CSS 尺寸與 transform 疊加計算。
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.maxWidth = "none";

  return { markup: clone.outerHTML, width, height };
}
