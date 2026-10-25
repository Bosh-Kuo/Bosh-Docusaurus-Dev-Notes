import type { Props as NavbarItemConfig } from "@theme/NavbarItem";

/** 手機版將共用操作集中在選單頂端，主選單只保留頁面導覽。 */
export function isMobileHeaderItem(item: NavbarItemConfig): boolean {
  return item.type === "localeDropdown" || Boolean(item.className?.split(/\s+/).includes("header-github-link"));
}
