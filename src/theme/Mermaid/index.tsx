import React, {
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import OriginalMermaid from "@theme-original/Mermaid";
import type { Props } from "@theme/Mermaid";
import MediaPreviewModal from "@site/src/components/MediaPreview/MediaPreviewModal";
import { prepareSvgForZoom, type ZoomableSvg } from "./svg";
import styles from "./styles.module.css";

function isInteractiveTarget(target: EventTarget): boolean {
  // Mermaid 節點可包含連結等互動元素；closest 同時涵蓋點到其內部 icon/text 的情況。
  return (
    target instanceof Element &&
    target.closest("a, button, input, select, textarea") !== null
  );
}

/**
 * 包裝 Docusaurus 原本的 Mermaid 元件，僅附加預覽功能。
 *
 * 保留原元件負責 Mermaid 的載入、渲染、主題切換與錯誤處理，這裡只處理
 * 使用者互動。相較於掃描整頁 DOM，元件卸載時 React 也會自動清理事件。
 */
export default function Mermaid(props: Props): ReactNode {
  // 保存已處理過的 SVG 快照，而不是 Modal 開啟後繼續依賴文章中的原始 DOM。
  const [zoomedSvg, setZoomedSvg] = useState<ZoomableSvg | null>(null);

  function openPreview(container: HTMLDivElement) {
    // 原始 Mermaid 元件負責非同步產生 SVG；使用者能點擊時再查找即可取得完成品。
    const svg = container.querySelector("svg");
    if (svg) {
      setZoomedSvg(prepareSvgForZoom(svg));
    }
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    // Mermaid 可設定可點擊的節點連結；這類互動不應被預覽功能攔截。
    if (isInteractiveTarget(event.target)) return;

    openPreview(event.currentTarget);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPreview(event.currentTarget);
    }
  }

  return (
    <>
      <div
        // wrapper 提供一致的滑鼠與鍵盤啟動區域，不修改 Docusaurus 內部 Mermaid 元件。
        className={styles.diagram}
        role="button"
        tabIndex={0}
        aria-label="開啟 Mermaid 圖表預覽"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <OriginalMermaid {...props} />
      </div>

      {zoomedSvg && (
        <MediaPreviewModal
          width={zoomedSvg.width}
          height={zoomedSvg.height}
          // Mermaid 是向量內容，初次配適時可超過原始座標倍率而不會失真。
          maxInitialScale={2}
          dialogLabel="Mermaid 圖表預覽"
          onClose={() => setZoomedSvg(null)}
        >
          <div
            className={styles.previewSvg}
            // markup 是從 Docusaurus 已渲染的 Mermaid SVG 複製而來，並非外部 HTML；
            // prepareSvgForZoom 也已隔離其中所有 ID，避免和文章原圖互相干擾。
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: zoomedSvg.markup }}
          />
        </MediaPreviewModal>
      )}
    </>
  );
}
