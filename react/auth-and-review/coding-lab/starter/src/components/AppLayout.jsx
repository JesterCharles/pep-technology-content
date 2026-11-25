import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

/*
TASK 4 (part 1). The Admin link below renders for everyone, but only admins
may use the admin tools. Render it only when the signed-in user's role is
"admin". (Hiding the link shapes the interface; the page itself and the server
still enforce the rule - see AdminPage and the mock API.)

TASK 7 (part 2). Wire up the Sign out button: sign out through the auth
context, then navigate to /login. After that, no page may still show the
user's data.
*/
export default function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="masthead">
        <h1>Beacon</h1>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        {user && (
          <p>
            Signed in as {user.name} ({user.role}){" "}
            <button type="button">Sign out</button>
          </p>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
