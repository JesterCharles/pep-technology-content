import { vi } from "vitest";

export const SERVICES = [
  { id: "catalog-api", name: "Catalog API", team: "Storefront", status: "operational", notify: true },
  { id: "checkout-api", name: "Checkout API", team: "Payments", status: "degraded", notify: true },
  { id: "email-relay", name: "Email Relay", team: "Messaging", status: "down", notify: true },
  { id: "image-cdn", name: "Image CDN", team: "Storefront", status: "operational", notify: false },
  { id: "search-index", name: "Search Index", team: "Discovery", status: "degraded", notify: false },
  { id: "auth-service", name: "Auth Service", team: "Platform", status: "operational", notify: true },
];

const TEAMS = ["Storefront", "Payments", "Messaging", "Discovery", "Platform"];

// A real fetch Response, so json(), text() and headers all behave as in the
// browser. A 204 has no body, so json() rejects on it.
function jsonResponse(status, body) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// HTTP header names are case-insensitive and fetch's Headers normalizes them
// to lowercase; record them that way so any valid learner spelling matches.
function normalizeHeaders(headers) {
  const out = {};
  for (const [name, value] of new Headers(headers ?? {})) {
    out[name] = value;
  }
  return out;
}

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateService(body, services, ignoreId) {
  const errors = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    errors.name = "Enter a service name.";
  } else if (
    services.some(
      (entry) =>
        entry.id !== ignoreId &&
        entry.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = "A service with this name already exists.";
  }
  if (!TEAMS.includes(body.team)) {
    errors.team = "Choose the owning team.";
  }
  return errors;
}

// Stateful in-memory stand-in for the status API. Mirrors the dev server's
// mock: GET list/detail, POST create (400 on validation), PUT update,
// DELETE remove.
export function stubCrudFetch() {
  const state = {
    services: SERVICES.map((entry) => ({ ...entry })),
    calls: [],
    failNetwork: false,
    holdNextMutation: false,
    releaseHeld: null,
  };

  const handle = async (urlValue, options) => {
    const url = String(urlValue).split("?")[0];
    const method = (options.method ?? "GET").toUpperCase();
    const body = options.body ? JSON.parse(options.body) : null;
    const detail = url.match(/^\/api\/services\/([a-z0-9-]+)$/);

    if (method === "GET" && url === "/api/services") {
      return jsonResponse(200, state.services);
    }
    if (method === "POST" && url === "/api/services") {
      const errors = validateService(body ?? {}, state.services);
      if (Object.keys(errors).length) {
        return jsonResponse(400, { errors });
      }
      const created = {
        id: slugify(body.name),
        name: body.name.trim(),
        team: body.team,
        status: "operational",
        notify: Boolean(body.notify),
      };
      state.services = [...state.services, created];
      return jsonResponse(201, created);
    }
    if (detail) {
      const existing = state.services.find(
        (entry) => entry.id === detail[1],
      );
      if (!existing) {
        return jsonResponse(404, { error: "unknown service" });
      }
      if (method === "GET") {
        return jsonResponse(200, existing);
      }
      if (method === "PUT") {
        const errors = validateService(body ?? {}, state.services, existing.id);
        if (Object.keys(errors).length) {
          return jsonResponse(400, { errors });
        }
        const updated = {
          ...existing,
          name: body.name.trim(),
          team: body.team,
          notify: Boolean(body.notify),
        };
        state.services = state.services.map((entry) =>
          entry.id === existing.id ? updated : entry,
        );
        return jsonResponse(200, updated);
      }
      if (method === "DELETE") {
        state.services = state.services.filter(
          (entry) => entry.id !== existing.id,
        );
        return jsonResponse(204, {});
      }
    }
    return jsonResponse(404, { error: "unknown endpoint" });
  };

  const fetchMock = vi.fn(async (urlValue, options = {}) => {
    const method = (options.method ?? "GET").toUpperCase();
    state.calls.push({
      url: String(urlValue).split("?")[0],
      method,
      headers: normalizeHeaders(options.headers),
      body: options.body ?? null,
    });
    if (state.failNetwork && method !== "GET") {
      throw new TypeError("NetworkError when attempting to fetch resource.");
    }
    if (state.holdNextMutation && method !== "GET") {
      state.holdNextMutation = false;
      await new Promise((resolve) => {
        state.releaseHeld = resolve;
      });
    }
    return handle(urlValue, options);
  });

  vi.stubGlobal("fetch", fetchMock);
  state.fetchMock = fetchMock;
  return state;
}

export function mutationCalls(state) {
  return state.calls.filter((call) => call.method !== "GET");
}
