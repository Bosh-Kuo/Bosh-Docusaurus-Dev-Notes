import { translate } from "@docusaurus/Translate";
export function formatDate(value: string | null, locale = "zh-Hant"): string {
  if (!value) return translate({ id: "site.date.unavailable", message: "日期未記錄" });
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
