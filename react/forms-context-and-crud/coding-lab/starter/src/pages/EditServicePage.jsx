import { useParams, useNavigate } from "react-router";
import ServiceForm from "../components/ServiceForm.jsx";
import { useFetch } from "../hooks/use-fetch.js";
import { updateService } from "../api.js";
import { useToasts } from "../ToastContext.jsx";

// Given: loads the service (part-2 hook), prefills the form with it, saves
// through updateService (TASK 6) and announces success as a toast (TASK 7).
export default function EditServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { data: service, loading, error } = useFetch(
    `/api/services/${serviceId}`,
  );

  if (loading) {
    return <p>Loading service...</p>;
  }
  if (error) {
    return (
      <p className="error-banner">
        Could not load this service ({error.message})
      </p>
    );
  }

  async function handleSave(values) {
    await updateService(serviceId, values);
    addToast("Service updated");
    navigate("/");
  }

  return (
    <>
      <h2>Edit {service.name}</h2>
      <ServiceForm
        initialValues={{
          name: service.name,
          team: service.team,
          notify: service.notify,
        }}
        onSave={handleSave}
        submitLabel="Save changes"
      />
    </>
  );
}
