import { useState } from "react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "operational", label: "Operational" },
  { id: "degraded", label: "Degraded" },
  { id: "down", label: "Down" },
];

/*
TASK 7 (part 2). The selected filter is state that two components need: this
toolbar sets it, and the overview page uses it to narrow the list. Trapped
here, it can never reach the list. Lift it up: delete the local state, accept
`filter` and `onFilterChange` props from the page, and call onFilterChange
with the filter id when a button is clicked.
*/
export default function Toolbar() {
  const [filter, setFilter] = useState("all");
  return (
    <p className="toolbar">
      {FILTERS.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => setFilter(entry.id)}
        >
          {entry.label}
        </button>
      ))}
    </p>
  );
}
