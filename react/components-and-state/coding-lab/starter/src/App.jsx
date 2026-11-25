import { useState } from "react";
import { initialServices } from "./data/services.js";
import DashboardHeader from "./components/DashboardHeader.jsx";
import Panel from "./components/Panel.jsx";
import ServiceCard from "./components/ServiceCard.jsx";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "operational", label: "Operational" },
  { id: "degraded", label: "Degraded" },
  { id: "down", label: "Down" },
];

export default function App() {
  const [services, setServices] = useState(initialServices);
  const [ackLog, setAckLog] = useState([]);
  const [checksRun, setChecksRun] = useState(0);

  /*
  TASK 5. The filter buttons below do nothing yet. Add a state variable that
  remembers the selected filter id (start on "all"), update it when a button
  is clicked, and use it to narrow which services render. "All" shows
  everything; any other filter shows only the services with that status.
  */
  const visibleServices = services;

  /*
  TASK 6. One click of "Run checks" probes a service from every region:
  us-east, eu-west and ap-south, so the counter must go up by three. It only
  goes up by one, because every call below reads the same stale checksRun.
  Fix it with updater functions.
  */
  function runChecks() {
    setChecksRun(checksRun + 1); // us-east probe done
    setChecksRun(checksRun + 1); // eu-west probe done
    setChecksRun(checksRun + 1); // ap-south probe done
  }

  /*
  TASK 7. Acknowledging changes data that lives in state, but this handler
  mutates the current objects and arrays, so React never sees a new value and
  the screen does not update. Rewrite it without mutation: copy the changed
  service (and its nested incident) and build a new log array.
  */
  function acknowledgeIncident(id) {
    const target = services.find((service) => service.id === id);
    target.incident.acknowledged = true;
    setServices(services);
    ackLog.push(target.name);
    setAckLog(ackLog);
  }

  /*
  TASK 8 (part 1). Hiding removes a card from the dashboard until the page is
  reloaded. Replace the services array with one that no longer contains the
  hidden service, without mutating the old array.
  */
  function hideService(id) {
    // TODO: remove the service with this id from the services state
  }

  return (
    <>
      <DashboardHeader serviceCount={services.length} />
      <p className="toolbar">
        {FILTERS.map((filter) => (
          <button key={filter.id} type="button">
            {filter.label}
          </button>
        ))}
        <button type="button" onClick={runChecks}>
          Run checks
        </button>{" "}
        <span>{checksRun} checks run</span>
      </p>
      <Panel title="Services">
        {/*
        TASK 8 (part 2). The list key below is the array index, so when a card
        is hidden, React matches the remaining cards to the wrong previous
        ones and per-card state (like an expanded Details section) jumps to a
        neighbour. Key each card by a stable value from the service, such as
        its id, rather than the array index.
        */}
        <ul className="card-grid">
          {visibleServices.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onAcknowledge={acknowledgeIncident}
              onHide={hideService}
            />
          ))}
        </ul>
      </Panel>
      <Panel title="Down now">
        {/*
        TASK 8 (part 3). List the name of every service whose status is
        "down", one <li> per service, inside the <ul> below. Derive it from
        the services state with filter and map; do not keep a second copy in
        state.
        */}
        <ul className="down-list"></ul>
      </Panel>
      <Panel title="Acknowledged this session">
        <ul className="ack-log">
          {ackLog.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
