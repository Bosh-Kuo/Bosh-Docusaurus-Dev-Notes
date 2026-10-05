import type { PluginConfig } from "@docusaurus/types";
import contentIndex from "../src/plugins/contentIndex";
import tailwindPlugin from "../src/plugins/tailwind";
import redirects from "./redirects";

const plugins: PluginConfig[] = [
  contentIndex,
  tailwindPlugin,
  "@docusaurus/plugin-ideal-image", // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image
  [
    "@docusaurus/plugin-client-redirects", // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects
    {
      redirects,
    },
  ],
];
export default plugins;
