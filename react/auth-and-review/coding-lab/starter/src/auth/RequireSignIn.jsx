import { useLocation, Navigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

/*
TASK 3. This wrapper guards every page that needs a signed-in user. Implement
it so that:
  - a signed-in user just sees the children;
  - a signed-out user is redirected to /login with <Navigate>, replacing the
    history entry, and carrying the page they wanted in the navigation state
    (state={{ from: location }}), so the login page can send them back there
    after they sign in.
Remember: this guard only shapes the interface. The server refuses
unauthenticated requests no matter what the client renders.
*/
export default function RequireSignIn({ children }) {
  // TODO: implement as described above
  return children;
}
