import type { Plugin, PostCssOptions } from "@docusaurus/types";
import tailwindcss from "@tailwindcss/postcss";
import postcss, { type Plugin as PostCssPlugin } from "postcss";

/** 將上游 CSS 放進較低優先序的 layer，讓 Tailwind utilities 能覆寫 Infima。 */
const docusaurusCascadeLayer: PostCssPlugin = {
  postcssPlugin: "docusaurus-cascade-layer",
  OnceExit(root) {
    const filename = root.source?.input.file ?? "";
    // globals.css 已宣告自己的 layers，只包裝 node_modules 中的上游樣式。
    if (!filename.includes("node_modules") || !root.nodes.length) return;
    // @import 與 @charset 必須留在樣式表根節點；其餘規則移進 docusaurus layer。
    const nodes = root.nodes.filter((node) => !(node.type === "atrule" && ["charset", "import"].includes(node.name)));
    if (!nodes.length) return;
    const layer = postcss.atRule({ name: "layer", params: "docusaurus" });
    // 移動原節點並保留來源資訊，維持規則順序、source map 與錯誤定位。
    layer.source = root.source;
    layer.append(nodes);
    root.append(layer);
    // OnceExit 在一般節點訪問後執行，也能包裝其他 plugin 在這一輪產生的規則。
  },
};

/** 開發與建置時，由 Docusaurus 的 PostCSS 流程載入 Tailwind v4。 */
export default function tailwindPlugin(): Plugin {
  return {
    name: "docusaurus-tailwindcss",
    configurePostCss(options: PostCssOptions): PostCssOptions {
      // 保留既有 plugins，再由 Tailwind 展開 @theme、@source 與 utilities。
      options.plugins.push(tailwindcss(), docusaurusCascadeLayer);
      return options;
    },
  };
}
