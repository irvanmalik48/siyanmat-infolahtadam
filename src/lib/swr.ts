import useSWR, { SWRConfiguration } from "swr";

export function useStaleWhileRevalidate<T>(
  url: string,
  options?: SWRConfiguration
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    url,
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
    options
  );

  return { data, error, isLoading, isValidating, mutate };
}
