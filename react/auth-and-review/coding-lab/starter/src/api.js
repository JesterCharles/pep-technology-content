/*
TASK 8 (part 2). In development the API is served from the same origin, but
the deployed dashboard talks to the real back end at another address. Build
every request URL through apiUrl so one Vite environment variable switches it:
  - read import.meta.env.VITE_API_URL inside the function (at call time);
  - when it is set, return it with the path appended;
  - when it is not set, return `/api${path}`.
Example: apiUrl("/services") is "/api/services" by default, and
"https://status.example.com/api/services" when
VITE_API_URL=https://status.example.com/api.
Why call time: test 8 changes the variable during the run (vi.stubEnv), so a
value read once at module load would miss it. In a real Vite app the value is
fixed when the dev server starts or the build runs, so after changing
VITE_API_URL you restart the dev server or rebuild.
*/
export function apiUrl(path) {
  // TODO: implement as described above
  return `/api${path}`;
}

/*
TASK 2. Signed-in requests carry the JWT in an Authorization header. Implement
authFetch(path, { token, method, body }) so that it:
  - calls fetch(apiUrl(path), ...) with the given method (default GET);
  - sets  Authorization: Bearer <token>;
  - when body is given, sends it JSON-stringified with a
    Content-Type: application/json header;
  - when the response is ok, returns the parsed JSON body;
  - when it is not ok, throws an Error with message `HTTP ${status}` and a
    status property, so callers can tell a 401 from a 403.
*/
export async function authFetch(path, options) {
  // TODO: implement as described above
  throw new Error("authFetch is not implemented yet");
}

// Given: the unauthenticated JSON POST used only for signing in.
export async function postJson(path, body) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
