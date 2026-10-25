import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { formatDate } from "@site/src/lib/format";

export function useDateFormatter() {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  return (value: string | null) => formatDate(value, currentLocale);
}
