import { useEffect, useState } from "react";

/**
 * This hook refers to https://github.com/dawsonbooth/react-repo-card/blob/master/src/hooks/colors.ts
 * This is a hook for fetching the GitHub colors from [ozh/github-colors](https://raw.githubusercontent.com/ozh/github-colors/master/colors.json).
 */
export interface GithubColor {
  color: string;
  url: string;
}

export interface GithubColors {
  [key: string]: GithubColor;
}

export function useColors() {
  const [colors, setColors] = useState<GithubColors>({});
  const [hasError, setHasError] = useState<boolean>(false);
  const url =
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json";

  useEffect(() => {
    fetch(url)
      .then(async (resp) => {
        setColors(await resp.json());
      })
      .catch((error) => {
        setHasError(true);
        console.error("Error fetching GitHub colors:", error);
      });
  }, [url]);

  return { colors, hasError };
}
