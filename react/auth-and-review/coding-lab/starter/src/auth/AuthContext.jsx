import { createContext, useContext, useState } from "react";
import { postJson } from "../api.js";
import { devAutoSignIn } from "../dev-auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(
    devAutoSignIn.enabled ? devAutoSignIn.session : null,
  );
  const [notice, setNotice] = useState(null);

  /*
  TASK 1 (part 1). Implement signIn(username, password):
    - POST { username, password } to /api/login with postJson;
    - on success, clear any notice and put { token, user } from the response
      into the session state;
    - let a failure (postJson throws, 401 for wrong credentials) propagate to
      the caller - the login page knows how to show it.
  */
  async function signIn(username, password) {
    // TODO: implement as described above
    throw new Error("signIn is not implemented yet");
  }

  /*
  TASK 7 (part 1). Implement signOut(): clear the session so no component can
  reach the token any more. The router then takes the user back to the login
  page through the signed-in guards.
  */
  function signOut() {
    // TODO: implement as described above
  }

  // Given: called when any request comes back 401 mid-session. The credential
  // is gone or stale, so the client forgets it and explains why. (A 403 is
  // different: the user IS authenticated and stays signed in.)
  function sessionExpired() {
    setSession(null);
    setNotice("Your session expired - sign in again.");
  }

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    notice,
    signIn,
    signOut,
    sessionExpired,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
