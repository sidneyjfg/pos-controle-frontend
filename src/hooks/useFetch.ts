import { useState, useEffect } from "react";

interface UseFetchOptions {
  immediate?: boolean;
  deps?: any[];
}

export function useFetch<T>(
  apiFunc: () => Promise<T>,
  options: UseFetchOptions = {}
) {
  const { immediate = true, deps = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc();
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}