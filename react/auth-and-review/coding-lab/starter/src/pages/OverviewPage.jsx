import { useState } from "react";
import { useAuthedFetch } from "../auth/use-authed-fetch.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { authFetch } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function OverviewPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: services, loading, error } = useAuthedFetch(
    "/services",
    refreshKey,
  );
  const { token, sessionExpired } = useAuth();
  const [actionMessage, setActionMessage] = useState(null);

  if (loading) {
    return <p>Loading services...</p>;
  }
  if (error) {
    return (
      <p className="error-banner">
        Could not load services ({error.message})
      </p>
    );
  }

  /*
  TASK 6. "Request restart" posts to /services/<id>/restart, which only the
  admin role may call. Implement handleRestart so that it:
    - calls authFetch with method POST and the signed-in token;
    - on success sets the action message to  Restart requested for <name>.
    - on a 403 sets it to  You are not allowed to do that.  - the user stays
      signed in, because a 403 means "authenticated, but refused";
    - on a 401 reports the stale session with sessionExpired() instead.
  */
  async function handleRestart(service) {
    // TODO: implement as described above
  }

  return (
    <>
      <h2>Service overview</h2>
      <p>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
        >
          Refresh list
        </button>
      </p>
      {actionMessage && <p role="alert">{actionMessage}</p>}
      <ul className="card-grid">
        {services.map((service) => (
          <li key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <StatusBadge status={service.status} />
            <p>Team: {service.team}</p>
            <button type="button" onClick={() => handleRestart(service)}>
              Request restart
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
