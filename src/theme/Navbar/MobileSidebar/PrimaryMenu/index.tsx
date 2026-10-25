/**
 * Adapted from Docusaurus theme-classic.
 * Copyright (c) Facebook, Inc. and its affiliates. MIT license.
 */
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import { isMobileHeaderItem } from "../../mobileHeaderItems";

export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = (useThemeConfig().navbar.items as NavbarItemConfig[]).filter((item) => !isMobileHeaderItem(item));

  return (
    <ul className="menu__list">
      {items.map((item) => (
        <NavbarItem mobile {...item} key={JSON.stringify(item)} onClick={() => mobileSidebar.toggle()} />
      ))}
    </ul>
  );
}
