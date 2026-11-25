import { vi } from "vitest";

export const SERVICES = [
  { id: "catalog-api", name: "Catalog API", team: "Storefront", status: "operational" },
  { id: "checkout-api", name: "Checkout API", team: "Payments", status: "degraded" },
  { id: "email-relay", name: "Email Relay", team: "Messaging", status: "down" },
  { id: "image-cdn", name: "Image CDN", team: "Storefront", status: "operational" },
  { id: "search-index", name: "Search Index", team: "Discovery", status: "degraded" },
  { id: "auth-service", name: "Auth Service", team: "Platform", status: "operational" },
];

const USERS = [
  { username: "avery", password: "beacon1", name: "Avery Diaz", role: "admin", token: "tok-avery" },
  { username: "omar", password: "beacon2", name: "Omar Reed", role: "operator", token: "tok-omar" },
];

// HTTP header names are case-insensitive and fetch's Headers normalizes them
// to lowercase; record and read them that way so any valid spelling matches.
function normalizeHeaders(headers) {
  const out = {};
  for (const [name, value] of new Headers(headers ?? {})) {
    out[name] = value;
  }
  return out;
}

// A real fetch Response, so any correct way of reading the body works.
function jsonResponse(status, body) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Stand-in for the SECURED status API (the back end without its open dev
// profile): /api/login issues tokens, everything else demands one.
// state.expireTokens simulates the server no longer accepting any token.
// Calls are recorded with the URL exactly as requested; routing uses only its
// path, so a request to an absolute API address reaches the same endpoints.
export function stubSecuredFetch() {
  const state = {
    calls: [],
    expireTokens: false,
  };

  const fetchMock = vi.fn(async (urlValue, options = {}) => {
    const url = String(urlValue).split("?")[0];
    const path = new URL(url, "http://localhost").pathname;
    const method = (options.method ?? "GET").toUpperCase();
    const headers = normalizeHeaders(options.headers);
    const body = options.body ? JSON.parse(options.body) : null;
    state.calls.push({ url, method, headers, body });

    if (method === "POST" && path === "/api/login") {
      const user = USERS.find(
        (entry) =>
          entry.username === body?.username &&
          entry.password === body?.password,
      );
      if (!user) {
        return jsonResponse(401, { error: "bad credentials" });
      }
      return jsonResponse(200, {
        token: user.token,
        user: { name: user.name, role: user.role },
      });
    }

    // The secured API accepts only the Bearer scheme: "Bearer <token>".
    const match = /^Bearer (.+)$/.exec(headers.authorization ?? "");
    const bearer = match ? match[1] : null;
    const caller =
      !state.expireTokens && USERS.find((entry) => entry.token === bearer);
    if (!caller) {
      return jsonResponse(401, { error: "authentication required" });
    }
    if (method === "GET" && path === "/api/services") {
      return jsonResponse(200, SERVICES);
    }
    const restart = path.match(/^\/api\/services\/([a-z0-9-]+)\/restart$/);
    if (method === "POST" && restart) {
      if (caller.role !== "admin") {
        return jsonResponse(403, { error: "admin role required" });
      }
      const service = SERVICES.find((entry) => entry.id === restart[1]);
      if (!service) {
        return jsonResponse(404, { error: "unknown service" });
      }
      return jsonResponse(200, { ok: true, id: service.id });
    }
    return jsonResponse(404, { error: "unknown endpoint" });
  });

  vi.stubGlobal("fetch", fetchMock);
  state.fetchMock = fetchMock;
  return state;
}

export async function signInAs(user, screen, userEvent) {
  const creds = USERS.find((entry) => entry.username === user);
  await userEvent.type(screen.getByLabelText("Username"), creds.username);
  await userEvent.type(screen.getByLabelText("Password"), creds.password);
  await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
}
