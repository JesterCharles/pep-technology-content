import { vi } from "vitest";

export const SERVICES = [
  {
    id: "catalog-api",
    name: "Catalog API",
    team: "Storefront",
    status: "operational",
    uptime: "99.98%",
    summary: "Product and price lookups for the storefront.",
  },
  {
    id: "checkout-api",
    name: "Checkout API",
    team: "Payments",
    status: "degraded",
    uptime: "97.21%",
    summary: "Order placement and payment capture.",
  },
  {
    id: "email-relay",
    name: "Email Relay",
    team: "Messaging",
    status: "down",
    uptime: "91.44%",
    summary: "Outbound transactional mail.",
  },
  {
    id: "image-cdn",
    name: "Image CDN",
    team: "Storefront",
    status: "operational",
    uptime: "99.99%",
    summary: "Resized product images at the edge.",
  },
  {
    id: "search-index",
    name: "Search Index",
    team: "Discovery",
    status: "degraded",
    uptime: "98.05%",
    summary: "Full-text product search.",
  },
  {
    id: "auth-service",
    name: "Auth Service",
    team: "Platform",
    status: "operational",
    uptime: "99.95%",
    summary: "Sign-in and session management.",
  },
];

// A real platform Response, so any standard way of reading the body works.
export function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function abortError() {
  return new DOMException("The operation was aborted.", "AbortError");
}

// Wraps a handler in a fetch stub that behaves like the real fetch: it
// settles on a later tick, and an AbortSignal passed in the options rejects
// it with an AbortError, whether the signal is already aborted or fires
// before the response arrives. The handler builds a fresh Response per call.
export function deferredFetch(handler) {
  return vi.fn(
    (url, options = {}) =>
      new Promise((resolve, reject) => {
        const signal = options.signal;
        if (signal?.aborted) {
          reject(abortError());
          return;
        }
        const onAbort = () => {
          clearTimeout(timer);
          reject(abortError());
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", onAbort);
          resolve(handler(String(url)));
        }, 0);
        signal?.addEventListener("abort", onAbort, { once: true });
      }),
  );
}

// Standard happy-path API: list and detail routes, 404 for unknown ids.
export function stubRoutedFetch() {
  const fetchMock = deferredFetch((url) => {
    const path = url.split("?")[0];
    if (path === "/api/services") {
      return jsonResponse(200, SERVICES);
    }
    const detail = path.match(/^\/api\/services\/([a-z0-9-]+)$/);
    if (detail) {
      const service = SERVICES.find((entry) => entry.id === detail[1]);
      return service
        ? jsonResponse(200, service)
        : jsonResponse(404, { error: "unknown service" });
    }
    return jsonResponse(404, { error: "unknown endpoint" });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// A fetch whose promise never settles until you resolve it; records the
// AbortSignal it was called with.
export function stubPendingFetch() {
  const state = { signal: null, resolve: null };
  const fetchMock = vi.fn(
    (url, options = {}) =>
      new Promise((resolve, reject) => {
        state.signal = options.signal ?? null;
        state.resolve = (status, body) => resolve(jsonResponse(status, body));
        if (options.signal) {
          if (options.signal.aborted) {
            reject(abortError());
            return;
          }
          options.signal.addEventListener("abort", () => reject(abortError()), {
            once: true,
          });
        }
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return state;
}

export function stubFailingFetch(status) {
  const fetchMock = deferredFetch(() => jsonResponse(status, { error: "boom" }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function stubEmptyListFetch() {
  const fetchMock = deferredFetch(() => jsonResponse(200, []));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
