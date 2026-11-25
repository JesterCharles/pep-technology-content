// Finished in part 2 of this scenario; treat as given.
import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";

export function useFetch(url, refreshKey = 0) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setData(null);
    setError(null);
    fetchJson(url, controller.signal)
      .then((body) => {
        setData(body);
        setLoading(false);
      })
      .catch((cause) => {
        if (cause.name === "AbortError") {
          return;
        }
        setError(cause);
        setLoading(false);
      });
    return () => controller.abort();
  }, [url, refreshKey]);

  return { data, loading, error };
}
