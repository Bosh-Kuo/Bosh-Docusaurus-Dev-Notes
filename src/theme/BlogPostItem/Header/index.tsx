import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import OriginalHeader from "@theme-original/BlogPostItem/Header";
export default function BlogPostHeader() {
  return useBlogPost().isBlogPostPage ? null : <OriginalHeader />;
}
