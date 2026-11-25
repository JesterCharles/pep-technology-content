import { useState } from "react";
import { Link } from "react-router";
import { useFetch } from "../hooks/use-fetch.js";
import { deleteService } from "../api.js";
import { useToasts } from "../ToastContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function OverviewPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: services, loading, error } = useFetch(
    "/api/services",
    refreshKey,
  );
  const { addToast } = useToasts();

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
  TASK 6 (part 2). Deleting from the dashboard must delete on the server and
  then bring the screen back in line with it:
    - call deleteService(id) (you implement it in ../api.js);
    - announce "Service deleted" through the toast context;
    - reload the list by bumping refreshKey (the given hook refetches when it
      changes), so the screen shows exactly what the server now has.
  */
  async function handleDelete(id) {
    // TODO: implement as described above
  }

  return (
    <>
      <h2>Service overview</h2>
      <ul className="card-grid">
        {services.map((service) => (
          <li key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <StatusBadge status={service.status} />
            <p>Team: {service.team}</p>
            <p>
              <Link to={`/services/${service.id}/edit`}>Edit</Link>{" "}
              <button type="button" onClick={() => handleDelete(service.id)}>
                Delete
              </button>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
