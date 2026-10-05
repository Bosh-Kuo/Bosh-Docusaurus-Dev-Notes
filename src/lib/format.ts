export function formatDate(value: string | null): string {
  if (!value) return "日期未記錄";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}
