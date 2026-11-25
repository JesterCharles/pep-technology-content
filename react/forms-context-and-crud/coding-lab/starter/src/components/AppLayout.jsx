import { NavLink, Outlet } from "react-router";
import { useToasts } from "../ToastContext.jsx";

// Given: the layout shows every toast the context carries. role="status" is a
// polite live region, so screen readers announce new toasts without stealing
// focus.
export default function AppLayout() {
  const { toasts } = useToasts();
  return (
    <>
      <header className="masthead">
        <h1>Beacon</h1>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/services/new">Register service</NavLink>
        </nav>
      </header>
      <div className="toast-area" role="status">
        {toasts.map((toast, index) => (
          <p key={index}>{toast}</p>
        ))}
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}
