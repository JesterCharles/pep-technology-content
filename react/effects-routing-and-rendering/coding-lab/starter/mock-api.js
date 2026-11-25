// Development-only mock of the Beacon status API, served by the Vite dev
// server (see vite.config.js). The tests never use this file; they stub fetch
// themselves. Treat it as given infrastructure.
const services = [
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
        if (req.method === "GET" && url === "/api/services") {
          return send(200, services);
        }
        const detail = url.match(/^\/api\/services\/([a-z0-9-]+)$/);
        if (req.method === "GET" && detail) {
          const service = services.find((entry) => entry.id === detail[1]);
          if (!service) {
            return send(404, { error: "unknown service" });
          }
          return send(200, service);
        }
        return send(404, { error: "unknown endpoint" });
      });
    },
  };
}
