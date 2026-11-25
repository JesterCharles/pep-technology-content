import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

/*
TASK 1 (part 2). Implement handleSubmit:
  - prevent the browser's own submission;
  - call signIn with the username and password from state;
  - on success, navigate to the page the guard remembered
    (location.state?.from?.pathname) or to "/" when the user came here
    directly - and replace the login page in the history;
  - when signIn throws with status 401, show
      Wrong username or password.
    in the alert paragraph and keep what was typed;
  - let the auth context's notice (shown below) explain an expired session.
*/
export default function LoginPage() {
  const { signIn, notice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  function handleSubmit() {
    // TODO: implement as described above
  }

  return (
    <main>
      <h2>Sign in to Beacon</h2>
      {notice && <p className="error-banner">{notice}</p>}
      {message && (
        <p className="error-banner" role="alert">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
