import { Routes, Route } from "react-router";
import { AuthProvider } from "./auth/AuthContext.jsx";
import RequireSignIn from "./auth/RequireSignIn.jsx";
import AppLayout from "./components/AppLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Given: every dashboard page sits behind RequireSignIn (TASK 3); only the
// login page is public.
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <RequireSignIn>
                <OverviewPage />
              </RequireSignIn>
            }
          />
          <Route
            path="admin"
            element={
              <RequireSignIn>
                <AdminPage />
              </RequireSignIn>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
