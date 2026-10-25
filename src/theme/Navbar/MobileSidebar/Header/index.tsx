/**
 * Adapted from Docusaurus theme-classic.
 * Copyright (c) Facebook, Inc. and its affiliates. MIT license.
 */
import { translate } from "@docusaurus/Translate";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import IconClose from "@theme/Icon/Close";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarLogo from "@theme/Navbar/Logo";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import { isMobileHeaderItem } from "../../mobileHeaderItems";

export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = (useThemeConfig().navbar.items as NavbarItemConfig[]).filter(isMobileHeaderItem);
  return (
    // navbar-sidebar__brand：Infima 的手機選單頂端；排版可由本站 JSX 的 Tailwind 調整。
    <div className="navbar-sidebar__brand [@media(max-width:_360px)]:px-2">
      <NavbarLogo />
      {/* mobile-navbar-actions 是本站的 CSS 範圍標記；後代規則用來調整官方 NavbarItem。 */}
      <div className="mobile-navbar-actions ml-auto flex shrink-0 items-center gap-1 [@media(max-width:_360px)]:gap-0">
        {items.map((item) => (
          <NavbarItem {...item} key={String(item.className ?? item.type)} />
        ))}
        <NavbarColorModeToggle />
        <button
          type="button"
          aria-label={translate({
            id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
            message: "Close navigation bar",
          })}
          className="clean-btn navbar-sidebar__close m-0 grid size-8 place-items-center"
          onClick={() => mobileSidebar.toggle()}
        >
          <IconClose color="var(--ifm-color-emphasis-600)" />
        </button>
      </div>
    </div>
  );
}
