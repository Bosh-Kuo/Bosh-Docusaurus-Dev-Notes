import { PluginConfig } from "@docusaurus/types";
import redirects from "./redirects";

const plugins: PluginConfig[] = [
  "@docusaurus/plugin-ideal-image", // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image
  "docusaurus-plugin-image-zoom", // https://github.com/gabrielcsapo/docusaurus-plugin-image-zoom
  "docusaurus-plugin-sass", // https://github.com/rlamana/docusaurus-plugin-sass
  [
    "@docusaurus/plugin-client-redirects", // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects
    {
      redirects,
    },
  ],
];
export default plugins;
