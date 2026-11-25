import { Routes, Route } from "react-router";
import { ToastProvider } from "./ToastContext.jsx";
import AppLayout from "./components/AppLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import RegisterServicePage from "./pages/RegisterServicePage.jsx";
import EditServicePage from "./pages/EditServicePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Given: the part-2 route tree, extended with the register and edit pages and
// wrapped in the toast provider you implement in TASK 7.
export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="services/new" element={<RegisterServicePage />} />
          <Route
            path="services/:serviceId/edit"
            element={<EditServicePage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
