// Fixed snapshot of the services Beacon watches. Treat this file as read-only:
// the dashboard uses this very array as its initial state - the same objects,
// not copies - which is exactly why nothing may ever change it in place.
export const initialServices = [
  {
    id: "catalog-api",
    name: "Catalog API",
    team: "Storefront",
    status: "operational",
    incident: null,
    maintenance: null,
  },
  {
    id: "checkout-api",
    name: "Checkout API",
    team: "Payments",
    status: "degraded",
    incident: { open: 2, acknowledged: false },
    maintenance: null,
  },
  {
    id: "email-relay",
    name: "Email Relay",
    team: "Messaging",
    status: "down",
    incident: { open: 3, acknowledged: false },
    maintenance: null,
  },
  {
    id: "image-cdn",
    name: "Image CDN",
    status: "operational",
    incident: null,
    maintenance: "Cache purge at two UTC",
  },
  {
    id: "search-index",
    name: "Search Index",
    team: "Discovery",
    status: "degraded",
    incident: { open: 1, acknowledged: false },
    maintenance: null,
  },
  {
    id: "auth-service",
    name: "Auth Service",
    team: "Platform",
    status: "operational",
    incident: null,
    maintenance: null,
  },
];
