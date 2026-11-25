import { STATUS_LABELS } from "./StatusBadge.jsx";
import { recordRender } from "../render-count.js";

const DESCRIPTIONS = {
  operational: "Responding normally from every region.",
  degraded: "Responding, but slower than the agreed target.",
  down: "Not responding; an incident is open.",
};

/*
TASK 8. Skip the needless re-render. This legend takes no props and renders
the same static content every time, yet every click of "Refresh view" on the
overview re-renders it, because a parent re-render re-renders every child by
default. Nothing is broken: the page already shows the right thing. Wrap the
component in React's memo so React can skip it when its props have not
changed. memo is a performance optimisation: it only saves work and never
changes what is shown. The recordRender call is the diagnostic that proves
the work was skipped (see src/render-count.js).
*/
export default function StatusLegend() {
  recordRender("StatusLegend");
  return (
    <aside className="panel">
      <h2>Status legend</h2>
      <dl>
        {Object.entries(STATUS_LABELS).map(([id, label]) => (
          <div key={id}>
            <dt>
              <span className={`badge badge-${id}`}>{label}</span>
            </dt>
            <dd>{DESCRIPTIONS[id]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
