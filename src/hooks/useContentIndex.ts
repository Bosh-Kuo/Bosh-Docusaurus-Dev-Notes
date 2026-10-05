import { usePluginData } from "@docusaurus/useGlobalData";
import { CONTENT_INDEX_PLUGIN_NAME, type ContentIndex } from "@site/src/plugins/contentIndex/shared";

export function useContentIndex(): ContentIndex {
  return usePluginData(CONTENT_INDEX_PLUGIN_NAME) as ContentIndex;
}
