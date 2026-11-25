import { useNavigate } from "react-router";
import ServiceForm from "../components/ServiceForm.jsx";
import { createService } from "../api.js";
import { useToasts } from "../ToastContext.jsx";

// Given: the page wires the form to the API (TASK 4 implements createService)
// and announces success through the toast context (TASK 7). Errors from
// createService intentionally propagate to the form, which knows how to show
// them (TASK 5).
export default function RegisterServicePage() {
  const navigate = useNavigate();
  const { addToast } = useToasts();

  async function handleSave(values) {
    await createService(values);
    addToast("Service registered");
    navigate("/");
  }

  return (
    <>
      <h2>Register a service</h2>
      <ServiceForm
        initialValues={{ name: "", team: "", notify: false }}
        onSave={handleSave}
        submitLabel="Save service"
      />
    </>
  );
}
