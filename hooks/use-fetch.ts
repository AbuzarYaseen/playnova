import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!url) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error: err.message || "Something went wrong",
      });
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useInfiniteFetch<
  T extends { page: number; total_pages: number },
>(url: string, baseParams: Record<string, any> = {}, options?: RequestInit) {
  const [data, setData] = useState<{ pages: T[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stabilize the base URL construction
  const getUrl = (page: number) => {
    try {
      // url might be relative or absolute. getProxyUrl returns absolute.
      const targetUrl = new URL(
        url,
        typeof window !== "undefined" ? window.location.origin : undefined,
      );
      Object.entries(baseParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          targetUrl.searchParams.append(key, String(value));
        }
      });
      targetUrl.searchParams.set("page", String(page));
      return targetUrl.toString();
    } catch (e) {
      return url; // fallback
    }
  };

  const fetchPage = useCallback(
    async (page: number, isNextPage = false) => {
      if (!url) return;
      if (isNextPage) setIsFetchingNextPage(true);
      else setLoading(true);

      setError(null);
      try {
        const response = await fetch(getUrl(page), options);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();

        setData((prev) => {
          if (!prev || !isNextPage) {
            return { pages: [result] };
          }
          return { pages: [...prev.pages, result] };
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [url, JSON.stringify(baseParams), JSON.stringify(options)],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const fetchNextPage = useCallback(() => {
    if (!data || isFetchingNextPage) return;
    const lastPage = data.pages[data.pages.length - 1];
    if (lastPage.page < lastPage.total_pages) {
      fetchPage(lastPage.page + 1, true);
    }
  }, [data, isFetchingNextPage, fetchPage]);

  const hasNextPage = data
    ? data.pages[data.pages.length - 1].page <
      data.pages[data.pages.length - 1].total_pages
    : false;

  return {
    data,
    loading,
    isLoading: loading, // for backward compatibility in components
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
