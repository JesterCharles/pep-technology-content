import { test, expect, afterEach, vi } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { useFetch } from "../starter/src/hooks/use-fetch.js";
import { deferredFetch, jsonResponse } from "./helpers.js";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("task 4: useFetch manages loading, data and errors and refetches when the url changes", async () => {
  const bodies = {
    "/api/a": { from: "a" },
    "/api/b": { from: "b" },
  };
  const fetchMock = deferredFetch((url) => {
    if (url === "/api/fails") {
      return jsonResponse(500, { error: "boom" });
    }
    if (url === "/api/maintenance") {
      // A 200 whose body is not JSON at all.
      return new Response("<!doctype html><p>Down for maintenance</p>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }
    return jsonResponse(200, bodies[url]);
  });
  vi.stubGlobal("fetch", fetchMock);

  // Record what the hook returns on every render, starting with the first.
  const seen = [];
  const { result, rerender } = renderHook(
    ({ url }) => {
      const value = useFetch(url);
      seen.push(value);
      return value;
    },
    { initialProps: { url: "/api/a" } },
  );

  // The very first render is already loading, with no data yet.
  expect(seen[0].loading).toBe(true);
  expect(seen[0].data).toBeNull();
  expect(seen[0].error).toBeNull();

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toEqual({ from: "a" });
  expect(result.current.error).toBeNull();

  // Changing the url must re-run the Effect (it is a dependency).
  rerender({ url: "/api/b" });
  await waitFor(() => expect(result.current.data).toEqual({ from: "b" }));
  expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);

  // A non-2xx response becomes an error, not data.
  rerender({ url: "/api/fails" });
  await waitFor(() => expect(result.current.error).not.toBeNull());
  expect(result.current.error.message).toBe("HTTP 500");
  expect(result.current.data).toBeNull();
  expect(result.current.loading).toBe(false);

  // A body that cannot be parsed is an error too, but not an HTTP one.
  rerender({ url: "/api/maintenance" });
  await waitFor(() => {
    expect(result.current.error).not.toBeNull();
    expect(result.current.error.message).not.toMatch(/^HTTP /);
  });
  expect(result.current.data).toBeNull();
  expect(result.current.loading).toBe(false);

  // Two components calling the hook keep independent state.
  const first = renderHook(() => useFetch("/api/a"));
  const second = renderHook(() => useFetch("/api/b"));
  await waitFor(() => expect(first.result.current.data).toEqual({ from: "a" }));
  await waitFor(() =>
    expect(second.result.current.data).toEqual({ from: "b" }),
  );
});
