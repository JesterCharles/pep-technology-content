import StatusBadge from "../components/StatusBadge.jsx";

// Given: shows one loaded service. Render it only once the data has arrived.
function ServiceDetails({ service }) {
  return (
    <>
      <h2>{service.name}</h2>
      <StatusBadge status={service.status} />
      <p>Team: {service.team}</p>
      <p>Uptime (30 days): {service.uptime}</p>
      <p>{service.summary}</p>
    </>
  );
}

/*
TASK 3. Finish task 4 (the useFetch hook and the response.ok check) first.
The route "services/:serviceId" renders this page for one service. Build it
so that it:
  - reads the serviceId from the URL with useParams;
  - loads `/api/services/${serviceId}` with the useFetch hook from TASK 4;
  - shows a paragraph reading  Loading service...  while the request is
    pending, and on failure
      <p className="error-banner">Could not load this service (HTTP 404)</p>
    (take the code from error.message);
  - on success renders <ServiceDetails service={...} /> from above;
  - offers a "Back to overview" button that navigates to "/" from code with
    useNavigate when clicked.
*/
export default function ServiceDetailPage() {
  return <p>TODO: build the service detail page</p>;
}
