import { useEffect, useState } from "react";

/**
 * This hook refers to https://github.com/dawsonbooth/react-repo-card/blob/master/src/hooks/colors.ts
 * This is a hook for fetching the GitHub colors from [ozh/github-colors](https://raw.githubusercontent.com/ozh/github-colors/master/colors.json).
 */
const useColors = () => {
  const [colors, setColors] = useState({});
  const [hasError, setHasError] = useState(false);
  const url =
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json";

  useEffect(() => {
    fetch(url)
      .then(async (resp) => {
        setColors(await resp.json());
      })
      .catch(() => {
        setHasError(true);
      });
  }, [url]);
  return [colors, hasError];
};

export default useColors;
