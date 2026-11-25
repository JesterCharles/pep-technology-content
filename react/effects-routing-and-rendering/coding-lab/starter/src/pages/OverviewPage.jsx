import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar.jsx";
import ServiceList from "../components/ServiceList.jsx";
import StatusLegend from "../components/StatusLegend.jsx";

export default function OverviewPage() {
  const [services, setServices] = useState([]);
  const [viewVersion, setViewVersion] = useState(1);

  /*
  TASK 5. This quick-and-dirty effect only handles the happy path:
  while the request is pending the page silently shows an empty dashboard, a
  server error is parsed as if it were data, and an empty fleet looks the same
  as a broken one. Replace it with the useFetch hook from TASK 4 and render
  four distinct screens:
    - while loading:               a paragraph reading  Loading services...
    - after a failure:             <p className="error-banner">
                                     Could not load services (HTTP 500)
                                   </p>  (take the code from error.message)
    - success with no services:    a paragraph reading  No services reporting yet.
    - success with services:      the toolbar, count line, list and legend below.

  Note (task 6). Using the hook here also means the request is aborted when
  the user navigates away while it is still pending; the tests check that.
  */
  useEffect(() => {
    fetch("/api/services")
      .then((response) => response.json())
      .then(setServices);
  }, []);

  /*
  TASK 7 (part 1). Lift the filter state out of Toolbar to this page: keep the
  selected filter id in state here, hand Toolbar the value and a change
  handler, and narrow the services with it. Derive the visible list and the
  count line from existing state; do not add another state variable for them.
  */
  const visibleServices = services;

  return (
    <>
      <h2>Service overview</h2>
      {/*
      Note (task 8). "Refresh view" simulates the live refresh ticker that
      part 3 of the scenario adds for real. Every click updates state here and
      re-renders this page - and, needlessly, the static legend below. Fix
      that in src/components/StatusLegend.jsx.
      */}
      <p>
        <button
          type="button"
          onClick={() => setViewVersion((version) => version + 1)}
        >
          Refresh view
        </button>{" "}
        <span>View refreshed {viewVersion} times</span>
      </p>
      <Toolbar />
      <p>
        Showing {visibleServices.length} of {services.length} services
      </p>
      <ServiceList services={visibleServices} />
      <StatusLegend />
    </>
  );
}
