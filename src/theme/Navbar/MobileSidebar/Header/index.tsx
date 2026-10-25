/**
 * Adapted from Docusaurus theme-classic.
 * Copyright (c) Facebook, Inc. and its affiliates. MIT license.
 */
import { translate } from "@docusaurus/Translate";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import IconClose from "@theme/Icon/Close";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarLogo from "@theme/Navbar/Logo";
import LocaleDropdownNavbarItem from "@theme/NavbarItem/LocaleDropdownNavbarItem";

export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <div className="mobile-locale-switcher">
        <LocaleDropdownNavbarItem position="right" items={[]} dropdownItemsBefore={[]} dropdownItemsAfter={[]} />
      </div>
      <NavbarColorModeToggle />
      <button
        type="button"
        aria-label={translate({
          id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
          message: "Close navigation bar",
        })}
        className="clean-btn navbar-sidebar__close"
        onClick={() => mobileSidebar.toggle()}
      >
        <IconClose color="var(--ifm-color-emphasis-600)" />
      </button>
    </div>
  );
}
