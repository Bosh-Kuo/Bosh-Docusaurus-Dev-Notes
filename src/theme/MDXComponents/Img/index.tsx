import React, {
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import OriginalImg from "@theme-original/MDXComponents/Img";
import type { Props } from "@theme/MDXComponents/Img";
import MediaPreviewModal from "@site/src/components/MediaPreview/MediaPreviewModal";
import styles from "./styles.module.css";

interface PreviewImage {
  /** 瀏覽器實際選中的圖片來源；有 srcset 時可能不同於 props.src。 */
  src: string;
  /** 預覽副本沿用原圖替代文字，避免語意資訊在 Modal 中遺失。 */
  alt: string;
  /** 建立預覽當下保存的媒體座標尺寸，避免之後重新讀取已變動的 DOM。 */
  width: number;
  height: number;
  /** 點陣圖限制為 1；SVG 可依視窗空間放大。 */
  maxInitialScale: number;
}

/** 優先採用主要尺寸，但對尚未載入完成或缺少 intrinsic size 的圖片保留 fallback。 */
function getPositiveSize(primary: number, fallback: number): number {
  return Number.isFinite(primary) && primary > 0 ? primary : fallback;
}

function isSvgSource(src: string): boolean {
  // MDX 可能產生內嵌 data URI，因此不能只檢查副檔名。
  if (src.trimStart().toLowerCase().startsWith("data:image/svg+xml")) {
    return true;
  }

  try {
    // 解析 pathname 會自然忽略 query/hash，也能同時支援相對與絕對 URL。
    return new URL(src, window.location.href).pathname
      .toLowerCase()
      .endsWith(".svg");
  } catch {
    return false;
  }
}

function prepareImageForPreview(image: HTMLImageElement): PreviewImage | null {
  const bounds = image.getBoundingClientRect();

  // currentSrc 是瀏覽器經過 srcset/sizes 選擇後真正載入的檔案；沒有時才退回 src。
  const src = image.currentSrc || image.src;
  const isSvg = isSvgSource(src);

  // 沒有 width/height 的 SVG 會被瀏覽器回報成約 300×150 的預設 intrinsic
  // size，即使它已依 viewBox 在文章內放大顯示。向量圖因此改用實際渲染尺寸
  // 作為座標基準，並允許無損放大到視窗可容納的大小。
  const width = isSvg
    ? getPositiveSize(bounds.width, image.naturalWidth)
    : getPositiveSize(image.naturalWidth, bounds.width);
  const height = isSvg
    ? getPositiveSize(bounds.height, image.naturalHeight)
    : getPositiveSize(image.naturalHeight, bounds.height);

  // 尺寸不可用時不開啟 Modal，避免產生 NaN transform 或零尺寸畫布。
  if (!src || width <= 0 || height <= 0) return null;

  return {
    src,
    width,
    height,
    alt: image.alt,
    maxInitialScale: isSvg ? Number.POSITIVE_INFINITY : 1,
  };
}

/**
 * 包裝 Docusaurus 的 MDX 圖片元件，讓 Markdown／MDX 圖片直接具備預覽能力。
 *
 * 圖片若位於連結內，會保留連結原本的導覽行為，不攔截成預覽。
 */
export default function MDXImg(props: Props): ReactNode {
  // State 保存一份開啟當下的預覽快照；null 同時代表 Modal 尚未掛載。
  const [preview, setPreview] = useState<PreviewImage | null>(null);
  const { onClick, onKeyDown } = props;
  const previewAriaLabel = props.alt
    ? `開啟圖片預覽：${props.alt}`
    : "開啟圖片預覽";

  function openPreview(image: HTMLImageElement) {
    // 圖片本身若是連結，點擊的主要意圖是導覽；不以預覽功能覆蓋既有語意。
    if (image.closest("a")) return;

    const preparedImage = prepareImageForPreview(image);
    if (preparedImage) setPreview(preparedImage);
  }

  function handleClick(event: MouseEvent<HTMLImageElement>) {
    // 先尊重呼叫端原本傳入的事件；preventDefault 是明確關閉預覽的 escape hatch。
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0) return;

    openPreview(event.currentTarget);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLImageElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "Enter" || event.key === " ") {
      // Space 在一般頁面會捲動；圖片被當成 button 時應改為啟動預覽。
      event.preventDefault();
      openPreview(event.currentTarget);
    }
  }

  return (
    <>
      <OriginalImg
        // 繼續使用 Docusaurus 原元件，保留既有的載入、屬性與主題相容行為。
        {...props}
        className={`${props.className ?? ""} ${styles.image}`}
        role={props.role ?? "button"}
        tabIndex={props.tabIndex ?? 0}
        aria-label={props["aria-label"] ?? previewAriaLabel}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />

      {preview && (
        // 條件式掛載可讓 Modal 的 useEffect 在每次開關時完整執行清理與焦點還原。
        <MediaPreviewModal
          width={preview.width}
          height={preview.height}
          maxInitialScale={preview.maxInitialScale}
          dialogLabel="圖片預覽"
          onClose={() => setPreview(null)}
        >
          <img
            // Modal 使用獨立圖片副本，不移動文章中的原始 DOM 節點。
            className={styles.previewImage}
            src={preview.src}
            alt={preview.alt}
            width={preview.width}
            height={preview.height}
            draggable={false}
          />
        </MediaPreviewModal>
      )}
    </>
  );
}
