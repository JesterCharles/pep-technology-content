# Fixing CORS: Spring Security config vs Vite dev proxy

## Objectives

- Explain that the browser stops frontend JavaScript from reading a cross-origin response unless CORS permits it, and that only requests outside the CORS-safelisted conditions trigger a preflight
- Choose a Spring Security CORS configuration or a Vite dev-server proxy for a described setup
- Diagnose a CORS error from the browser console and network panel

## Teaching

Your page runs at `http://localhost:5173`, and calls `http://localhost:8080/api/books` with a plain GET. Spring has no CORS configuration. The console shows a CORS error.

An origin is scheme, host and port. Cross-origin JavaScript cannot read a response unless the server allows it with `Access-Control-Allow-Origin`.

Requests outside the CORS-safelisted conditions, such as JSON bodies or an `Authorization` header, first send an `OPTIONS` preflight. If that fails, the real request is never sent.

A proxy avoids CORS altogether, because the browser sees only one origin.

In Spring Security, enable CORS with `http.cors(...)` and a `CorsConfigurationSource`. It must run before authentication, because preflights carry no credentials.

Vite's `server.proxy` forwards dev requests, so the page calls relative `/api` paths. It exists only in the dev server, not in a production build.

If production serves page and API from one origin, CORS is not needed there.

The proxy maps a path prefix to a backend. Each key is the prefix, and the value is the target.

```
server: {
  proxy: {
    "/graphql": "http://localhost:4000",
  },
},
```

Your browser code then calls `fetch("/api/books")` with no host. Keep the production address in an environment setting, which is the next topic after calling your API.

A POST with a JSON body fails in the browser. Postman works fine. The Network panel shows an `OPTIONS` preflight with status 401, and the server logs show no POST at all.

```
Access to fetch at 'http://localhost:8080/api/records' from origin
'http://localhost:5173' has been blocked by CORS policy: Response to
preflight request doesn't pass access control check: It does not have
HTTP ok status.
```

## Recap

CORS is a browser rule: cross-origin JavaScript cannot read a response unless the server allows that origin. Non-safelisted requests send a preflight first, and if it fails, the real request is never sent. Use a Spring Security CORS config for real cross-origin traffic, and the Vite proxy for development. Diagnose using the console text and the Network rows together.

## Cheat sheet

What actually happened?

- The server processed the request and answered. The browser then refused to let your JavaScript read the response: correct. CORS is enforced by the browser, for your page. This simple GET reached the server, and the missing response header is why the browser hid the result.
- The server rejected the request as unsafe: not correct. The server did nothing unusual. Nothing in the server was blocking anything.
- The request never left the browser: not correct. That can happen for a preflighted request, but a simple GET is sent.
- It failed because both are on localhost, which cannot talk to itself: not correct. They are different origins because the ports differ. Localhost itself is fine.

Where to act: The Network panel box.

Next step: Compare the rows for a GET and for the POST, and find the one that says it never reached the server.

Without CORS configuration, a simple GET reaches the server but the browser blocks reading it. A JSON POST or Authorization header sends an OPTIONS preflight first; if that fails, the POST is never sent. Allowing the page origin on the server, together with the methods and request headers it uses, or using the Vite proxy so everything is same-origin, makes it work.

Where to act: Each row's description.

Next step: Ask first whether this runs in production or only on a developer machine, then whether the origins differ.

- Production page at `app.example.com` calls `api.example.com`: Spring Security CORS config. These are two real origins in production, so the API must allow the page origin.
- Local dev only: you want browser code to use relative `/api` paths: Vite dev proxy. The proxy makes dev look same-origin, and it adds nothing to the server.
- A production preflight gets 401 from Spring Security: Spring Security CORS config. Security rejected the unauthenticated `OPTIONS`. Enabling `http.cors` handles it first.
- Production: one domain, where a reverse proxy routes `/` and `/api`: No CORS needed. The browser sees one origin, so no cross-origin rules apply.

Where to act: Inside the `proxy` object.

Next step: Follow the example on this page: one quoted key for the prefix, a colon, then the quoted backend address.

export default { server: { proxy: { ___ }, }, };

Add one property to the proxy object. Its key is the /api prefix, and its value is the backend address http://localhost:8080.

What is the most likely cause, and fix?

- Spring Security rejects the unauthenticated preflight. Enable `http.cors(...)` with a config allowing this origin: correct. Preflights carry no credentials, so security returned 401 before any CORS handling. Postman sends no preflight, and enforces no CORS at all.
- The JSON body is malformed, so the server answered 401: not correct. The body was never sent, as the server logs show no POST. The failure is in the `OPTIONS` step.
- Add `mode: "no-cors"` to the fetch: not correct. That gives an opaque response your code cannot read, and it drops the JSON content type. It only hides the problem.
- Disable CORS in the browser for all users: not correct. You cannot change your users' browsers, and CORS is not the actual bug.

| Clue | Meaning |
| --- | --- |
| No `Access-Control-Allow-Origin` | Origin not allowed by the server |
| `OPTIONS` fails, POST marked CORS error | Preflight failed, so the POST never reached the server |
| `OPTIONS` returns 401 | Security runs before CORS handling |
| Works in Postman only | Postman does not enforce CORS |

## Sources

- MDN: Cross-Origin Resource Sharing, retrieved 2026-11-04
- Spring Framework: CORS, retrieved 2026-11-04
- Spring Security: CORS, retrieved 2026-11-04
- WHATWG Fetch standard, retrieved 2026-11-04
- Vite: Server options, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What actually happened?

- The server processed the request and answered. The browser then refused to let your JavaScript read the response: correct. CORS is enforced by the browser, for your page. This simple GET reached the server, and the missing response header is why the browser hid the result.
- The server rejected the request as unsafe: not correct. The server did nothing unusual. Nothing in the server was blocking anything.
- The request never left the browser: not correct. That can happen for a preflighted request, but a simple GET is sent.
- It failed because both are on localhost, which cannot talk to itself: not correct. They are different origins because the ports differ. Localhost itself is fine.

### explore

### Static alternative

Without CORS configuration, a simple GET reaches the server but the browser blocks reading it. A JSON POST or Authorization header sends an OPTIONS preflight first; if that fails, the POST is never sent. Allowing the page origin on the server, together with the methods and request headers it uses, or using the Vite proxy so everything is same-origin, makes it work.

### explore

### Static alternative

- Production page at `app.example.com` calls `api.example.com`: Spring Security CORS config. These are two real origins in production, so the API must allow the page origin.
- Local dev only: you want browser code to use relative `/api` paths: Vite dev proxy. The proxy makes dev look same-origin, and it adds nothing to the server.
- A production preflight gets 401 from Spring Security: Spring Security CORS config. Security rejected the unauthenticated `OPTIONS`. Enabling `http.cors` handles it first.
- Production: one domain, where a reverse proxy routes `/` and `/api`: No CORS needed. The browser sees one origin, so no cross-origin rules apply.

### terminal

### Static alternative

Add one property to the proxy object. Its key is the /api prefix, and its value is the backend address http://localhost:8080.

### mcq

### Static alternative

What is the most likely cause, and fix?

- Spring Security rejects the unauthenticated preflight. Enable `http.cors(...)` with a config allowing this origin: correct. Preflights carry no credentials, so security returned 401 before any CORS handling. Postman sends no preflight, and enforces no CORS at all.
- The JSON body is malformed, so the server answered 401: not correct. The body was never sent, as the server logs show no POST. The failure is in the `OPTIONS` step.
- Add `mode: "no-cors"` to the fetch: not correct. That gives an opaque response your code cannot read, and it drops the JSON content type. It only hides the problem.
- Disable CORS in the browser for all users: not correct. You cannot change your users' browsers, and CORS is not the actual bug.
