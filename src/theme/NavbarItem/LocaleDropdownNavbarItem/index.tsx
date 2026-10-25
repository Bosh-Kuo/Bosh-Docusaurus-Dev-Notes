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

  // 手機選單清單保留完整文字；桌面與手機選單頂端共用圖示按鈕。
  if (props.mobile) return <OriginalLocaleDropdownNavbarItem {...props} />;

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
