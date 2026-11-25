import { Link } from "react-router";
import StatusBadge from "./StatusBadge.jsx";

// Given: the part-1 card, slimmed down and linking to the new detail page.
export default function ServiceCard({ service }) {
  const { id, name, team = "Unassigned", status, uptime } = service;
  return (
    <li className="service-card">
      <h3>{name}</h3>
      <StatusBadge status={status} />
      <p>Team: {team}</p>
      <p>Uptime (30 days): {uptime}</p>
      <Link to={`/services/${id}`}>View details</Link>
    </li>
  );
}
