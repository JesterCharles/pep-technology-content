// Given: the part-2 data hook, upgraded for the secured API. It loads with
// authFetch (TASK 2) using the signed-in token, and when a request comes back
// 401 it reports the stale session to the auth context, which signs the user
// out (TASK 5 behavior you can read end to end).
import { useEffect, useState } from "react";
import { authFetch } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

export function useAuthedFetch(path, refreshKey = 0) {
  const { token, sessionExpired } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError(null);
    authFetch(path, { token })
      .then((body) => {
        if (cancelled) return;
        setData(body);
        setLoading(false);
      })
      .catch((cause) => {
        if (cancelled) return;
        if (cause.status === 401) {
          sessionExpired();
          return;
        }
        setError(cause);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, token, refreshKey]);

  return { data, loading, error };
}
