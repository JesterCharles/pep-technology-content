// Development-only mock of the secured Beacon status API, served by the Vite
// dev server (see vite.config.js). It plays the role of the Spring back end
// running WITHOUT the open dev profile: every data endpoint demands a valid
// token. The accounts and tokens are fake development fixtures. State resets
// when the dev server restarts. The tests never use this file; they stub
// fetch themselves. Treat it as given infrastructure.
const USERS = [
  { username: "avery", password: "beacon1", name: "Avery Diaz", role: "admin", token: "tok-avery" },
  { username: "omar", password: "beacon2", name: "Omar Reed", role: "operator", token: "tok-omar" },
];

const services = [
  { id: "catalog-api", name: "Catalog API", team: "Storefront", status: "operational" },
  { id: "checkout-api", name: "Checkout API", team: "Payments", status: "degraded" },
  { id: "email-relay", name: "Email Relay", team: "Messaging", status: "down" },
  { id: "image-cdn", name: "Image CDN", team: "Storefront", status: "operational" },
  { id: "search-index", name: "Search Index", team: "Discovery", status: "degraded" },
  { id: "auth-service", name: "Auth Service", team: "Platform", status: "operational" },
];

export function mockApiPlugin() {
  return {
    name: "beacon-mock-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (!url.startsWith("/api/")) {
          return next();
        }
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        // Only the Bearer scheme is accepted: "Authorization: Bearer <token>".
        const match = /^Bearer (.+)$/.exec(req.headers.authorization ?? "");
        const bearer = match ? match[1] : null;
        const caller = USERS.find((user) => user.token === bearer) ?? null;

        if (req.method === "POST" && url === "/api/login") {
          let raw = "";
          req.on("data", (chunk) => {
            raw += chunk;
          });
          req.on("end", () => {
            try {
              const body = raw ? JSON.parse(raw) : {};
              const user = USERS.find(
                (entry) =>
                  entry.username === body.username &&
                  entry.password === body.password,
              );
              if (!user) {
                return send(401, { error: "bad credentials" });
              }
              send(200, {
                token: user.token,
                user: { name: user.name, role: user.role },
              });
            } catch {
              send(400, { error: "invalid JSON" });
            }
          });
          return;
        }

        if (!caller) {
          return send(401, { error: "authentication required" });
        }
        if (req.method === "GET" && url === "/api/services") {
          return send(200, services);
        }
        const restart = url.match(/^\/api\/services\/([a-z0-9-]+)\/restart$/);
        if (req.method === "POST" && restart) {
          if (caller.role !== "admin") {
            return send(403, { error: "admin role required" });
          }
          const service = services.find((entry) => entry.id === restart[1]);
          if (!service) {
            return send(404, { error: "unknown service" });
          }
          return send(200, { ok: true, id: service.id });
        }
        return send(404, { error: "unknown endpoint" });
      });
    },
  };
}
