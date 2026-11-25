import { useState } from "react";

/*
TASK 3 moves StatusBadge and STATUS_LABELS out of this file into
StatusBadge.jsx. Until then they live here.
*/
const STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
  );
}

/*
TASK 2 (part 2). Some services have no team yet. Destructure team with a
default value so those cards read "Team: Unassigned" instead of "Team: ".

TASK 4. Two conditional-display bugs live below:
  - a card with no open incidents still renders a stray character, because a
    number sits on the left of &&;
  - the maintenance paragraph renders for every card, even when there is no
    maintenance planned. A component that has nothing to say should return
    null: make MaintenanceNotice itself return null when there is no
    maintenance. Keep it exported; the tests render it on its own.
*/
export function MaintenanceNotice({ maintenance }) {
  return <p className="maintenance">{maintenance}</p>;
}

export default function ServiceCard({ service, onAcknowledge, onHide }) {
  const { name, team, status, incident, maintenance } = service;
  const [expanded, setExpanded] = useState(false);
  const openCount = incident ? incident.open : 0;

  return (
    <li className="service-card">
      <h3>{name}</h3>
      <StatusBadge status={status} />
      <p>Team: {team}</p>
      {openCount && (
        <p>
          {openCount} open {openCount === 1 ? "incident" : "incidents"}
        </p>
      )}
      {incident && incident.acknowledged && <p>Acknowledged</p>}
      <MaintenanceNotice maintenance={maintenance} />
      {expanded && <p>Runbook: runbook/{service.id}</p>}
      <button type="button" onClick={() => setExpanded(!expanded)}>
        Details
      </button>
      {incident && !incident.acknowledged && (
        <button type="button" onClick={() => onAcknowledge(service.id)}>
          Acknowledge
        </button>
      )}
      <button type="button" onClick={() => onHide(service.id)}>
        Hide
      </button>
    </li>
  );
}
