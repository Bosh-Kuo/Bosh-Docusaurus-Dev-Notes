import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { Props } from "@theme/NavbarItem/LocaleDropdownNavbarItem";
import OriginalLocaleDropdownNavbarItem from "@theme-original/NavbarItem/LocaleDropdownNavbarItem";
import { cn } from "cn";

export default function LocaleDropdownNavbarItem(props: Props) {
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const label = translate(
    {
      id: "site.navbar.switchLanguage",
      message: "切換語言，目前：{language}",
      description: "語言字標按鈕的提示與無障礙名稱，包含目前語言。",
    },
    { language: localeConfigs[currentLocale].label },
  );

  // 手機語言入口由選單頂端統一提供，清單中不再重複顯示。
  if (props.mobile) return null;

  return (
    <OriginalLocaleDropdownNavbarItem
      {...props}
      className={cn(props.className, "navbar-locale-trigger")}
      data-locale-label={currentLocale === "zh-Hant" ? "中" : "En"}
      aria-label={label}
      title={label}
    />
  );
}
