/** Node plugin 與 React hook 共用的名稱；此檔案不載入建置端依賴。 */
export const CONTENT_INDEX_PLUGIN_NAME = "site-content-index";

export type ContentEntry = {
  title: string;
  description: string;
  permalink: string;
  date: string | null;
  tags: string[];
  image?: string;
  imageAlt?: string;
  readingTime?: number;
};

export type ContentIndex = {
  posts: ContentEntry[];
  postTags: string[];
  recentNotes: ContentEntry[];
  notesCount: number;
};
