import type { BlogContent } from "@docusaurus/plugin-content-blog";
import type { LoadedContent } from "@docusaurus/plugin-content-docs";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { CONTENT_INDEX_PLUGIN_NAME, type ContentEntry } from "./shared";

export { CONTENT_INDEX_PLUGIN_NAME } from "./shared";

const asDate = (value: unknown): string | null => {
  if (value == null) return null;
  const date = new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const newestFirst = (a: ContentEntry, b: ContentEntry) =>
  (b.date ?? "").localeCompare(a.date ?? "") || a.permalink.localeCompare(b.permalink);

/**
 * 在開發與正式建置的 Node 程序中執行，等待所有內容 plugin 載入並註冊路由後建立索引。
 * React 頁面只讀取序列化後的結果，不直接存取 Markdown 檔案。
 */
export default function contentIndex(_context: LoadContext): Plugin {
  return {
    name: CONTENT_INDEX_PLUGIN_NAME,
    async allContentLoaded({ allContent, actions }) {
      // 本站使用 docs/blog 的 default instance；多 instance 時需在此明確選取或合併。
      const blog = allContent["docusaurus-plugin-content-blog"]?.default as BlogContent | undefined;
      const docs = allContent["docusaurus-plugin-content-docs"]?.default as LoadedContent | undefined;
      const posts: ContentEntry[] = (blog?.blogPosts ?? [])
        .filter((p) => !p.metadata.unlisted && !p.metadata.frontMatter.draft)
        .map<ContentEntry>(({ metadata: m }) => {
          // 封面由 front matter 明確指定；舊封面已在來源檔案遷移，不使用正文中的第一張圖。
          const image = typeof m.frontMatter.image === "string" ? m.frontMatter.image : undefined;
          return {
            title: m.title,
            description: m.description,
            permalink: m.permalink,
            date: asDate(m.date),
            tags: m.tags.map((t) => t.label),
            image: image ?? "/img/undraw_blogging.svg",
            imageAlt: "",
            readingTime: m.readingTime,
          };
        })
        .sort(newestFirst);
      const notes: ContentEntry[] = (docs?.loadedVersions[0]?.docs ?? [])
        .filter((d) => !d.draft && !d.unlisted)
        .map<ContentEntry>((m) => {
          return {
            title: m.title,
            description: m.description,
            permalink: m.permalink,
            // 未記錄的日期保留為未知；淺層 CI checkout 的 Git 時間不應當成發布日期。
            date: asDate(m.frontMatter.last_update?.date),
            tags: m.tags.map((t) => t.label),
          };
        })
        .sort(newestFirst);
      const recentNotes = notes.slice(0, 6);
      // 在 Node 固定排序後再序列化，避免與瀏覽器的預設語系產生差異。
      const postTags = [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "zh-TW"));
      // 頁面透過 useContentIndex 讀取全站資料；只發布六篇近期筆記，完整歸檔使用路由資料。
      actions.setGlobalData({
        posts,
        postTags,
        recentNotes,
        notesCount: notes.length,
      });
      for (const [kind, entries] of [
        ["notes", notes],
        ["blog", posts],
      ] as const) {
        // createData 將資料寫入 .docusaurus；addRoute 在瀏覽器與 SSG 都以 archive prop 傳入頁面。
        const data = await actions.createData(`${kind}-archive.json`, {
          kind,
          entries,
        });
        actions.addRoute({
          path: `/archive/${kind}`,
          component: "@site/src/components/ArchivePage/index.tsx",
          modules: { archive: data },
          exact: true,
        });
      }
    },
  };
}
