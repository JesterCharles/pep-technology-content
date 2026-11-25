// Development-only mock of the Beacon status API, served by the Vite dev
// server (see vite.config.js). State lives in memory and resets when the dev
// server restarts. The tests never use this file; they stub fetch themselves.
// Treat it as given infrastructure.
const seedServices = () => [
  { id: "catalog-api", name: "Catalog API", team: "Storefront", status: "operational", notify: true },
  { id: "checkout-api", name: "Checkout API", team: "Payments", status: "degraded", notify: true },
  { id: "email-relay", name: "Email Relay", team: "Messaging", status: "down", notify: true },
  { id: "image-cdn", name: "Image CDN", team: "Storefront", status: "operational", notify: false },
  { id: "search-index", name: "Search Index", team: "Discovery", status: "degraded", notify: false },
  { id: "auth-service", name: "Auth Service", team: "Platform", status: "operational", notify: true },
];

const TEAMS = ["Storefront", "Payments", "Messaging", "Discovery", "Platform"];

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function validateService(body, services, ignoreId) {
  const errors = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    errors.name = "Enter a service name.";
  } else if (
    services.some(
      (entry) => entry.id !== ignoreId && entry.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = "A service with this name already exists.";
  }
  if (!TEAMS.includes(body.team)) {
    errors.team = "Choose the owning team.";
  }
  return errors;
}

export function mockApiPlugin() {
  let services = seedServices();
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
        const withBody = (handler) => {
          let raw = "";
          req.on("data", (chunk) => {
            raw += chunk;
          });
          req.on("end", () => {
            try {
              handler(raw ? JSON.parse(raw) : {});
            } catch {
              send(400, { errors: { body: "Invalid JSON." } });
            }
          });
        };
        const detail = url.match(/^\/api\/services\/([a-z0-9-]+)$/);
        if (req.method === "GET" && url === "/api/services") {
          return send(200, services);
        }
        if (req.method === "POST" && url === "/api/services") {
          return withBody((body) => {
            const errors = validateService(body, services);
            if (Object.keys(errors).length) {
              return send(400, { errors });
            }
            const created = {
              id: slugify(body.name),
              name: body.name.trim(),
              team: body.team,
              status: "operational",
              notify: Boolean(body.notify),
            };
            services = [...services, created];
            send(201, created);
          });
        }
        if (detail) {
          const existing = services.find((entry) => entry.id === detail[1]);
          if (!existing) {
            return send(404, { error: "unknown service" });
          }
          if (req.method === "GET") {
            return send(200, existing);
          }
          if (req.method === "PUT") {
            return withBody((body) => {
              const errors = validateService(body, services, existing.id);
              if (Object.keys(errors).length) {
                return send(400, { errors });
              }
              const updated = {
                ...existing,
                name: body.name.trim(),
                team: body.team,
                notify: Boolean(body.notify),
              };
              services = services.map((entry) =>
                entry.id === existing.id ? updated : entry,
              );
              send(200, updated);
            });
          }
          if (req.method === "DELETE") {
            services = services.filter((entry) => entry.id !== existing.id);
            // 204 No Content: status only, no body and no Content-Type.
            res.statusCode = 204;
            return res.end();
          }
        }
        return send(404, { error: "unknown endpoint" });
      });
    },
  };
}
