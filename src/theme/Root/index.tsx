import ReadingProgress from "@site/src/components/ReadingProgress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { type ReactNode, useState } from "react";

/** Root 在站內換頁時保留快取；每次 SSG 渲染則使用獨立的 QueryClient。 */
export default function Root({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (count, error) =>
              count < 1 &&
              !axios.isCancel(error) &&
              !(axios.isAxiosError(error) && error.response && error.response.status < 500),
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReadingProgress />
    </QueryClientProvider>
  );
}
