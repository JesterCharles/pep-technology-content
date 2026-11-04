# Handling HTTP errors and ProblemDetail responses

## Objectives

- Distinguish a network failure from an HTTP error response in fetch code
- Read the type, title, status and detail members of an application/problem+json response
- Show the learner-facing message that matches a 4xx or 5xx response

## Teaching

Think about two separate failures: the API answers with status 500, and the API server is switched off. Predict what this code logs in each case.

```
try {
  const res = await fetch("/api/orders");
  console.log("status", res.status);
} catch (err) {
  console.log("no response");
}
```

A network failure rejects the `fetch` promise. An HTTP error fulfills it with `ok` false. Spring Boot can describe HTTP errors with RFC 9457 problem details: JSON with the type `application/problem+json`, and the members `type`, `title`, `status`, `detail` and `instance`.

`title` summarizes the kind of problem, and `detail` explains this occurrence. Do not assume every error body is JSON: a gateway may send HTML.

A robust loader separates three outcomes: success, a described failure, and everything else.

```
const type = res.headers.get("content-type") || "";
if (type.includes("application/problem+json")) {
  const problem = await res.json();
  // problem.title, problem.detail, problem.status
}
```

Return a small result object, so the caller decides what to show. In Spring, `ProblemDetail` provides this body, for example from an `@ExceptionHandler` method.

The message should help the person do something next. Client errors (4xx) usually mean they can act, while server errors (5xx) are not their fault. RFC 9110 defines these meanings: 400 is a bad request, 401 means authentication is needed, 403 means refused, and 404 means not found.

A rejection means nothing arrived, so point to the connection and offer a retry.

A page shows "Check your internet connection" during a backend outage, and users are confused because their connection works. The gateway is returning a 502 with an HTML page.

```
try {
  const res = await fetch(url);
  const data = await res.json();
  show(data);
} catch (err) {
  showMessage("Check your internet connection");
}
```

## Recap

A rejection means no response arrived. An HTTP error fulfills with `ok` false, and you read it yourself. RFC 9457 problem details carry `type`, `title`, `status` and `detail` as `application/problem+json`, but check the content type first because not every error body is JSON. Choose a message according to who can act next.

## Cheat sheet

What is logged in each case?

- 500 logs `status 500`; server off logs `no response`: correct. A 500 is still a response, so `fetch` fulfills. With the server off, no response exists, so `fetch` rejects with a `TypeError`.
- Both log `no response`: not correct. That treats a 500 as a rejection. The server did answer.
- Both log a status: not correct. With the server off, there is no status to log.
- 500 logs `no response`; server off logs `status 0`: not correct. That is reversed, and a failed `fetch` gives no response object.

Where to act: The readout for the 502 scenario.

Next step: Note the content type, and consider what `res.json()` would do with that body.

A 200 reaches the success branch. A 404 fulfills with ok false and a problem body you can read. A 502 with HTML fulfills with ok false, and res.json() would reject, so check the content type first. A switched-off server rejects fetch with a TypeError.

Where to act: After the `await fetch` line.

Next step: Handle `res.ok` first and return early. The remaining code only sees failures.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Where you handle failures.

Next step: Read the content type header before calling `res.json()`, so an HTML body never reaches the parser.

async function loadOrder(id) { const res = await fetch("/api/orders/" + id); ___ } loadOrder(404).then((r) => console.log(r));

Test res.ok and return the data. Otherwise read the content type header. If it includes application/problem+json, parse the body and return its title, detail and status. Otherwise return the generic title with the status.

Where to act: The rows with 401 and 403.

Next step: Ask whether the server knows who the user is yet. One status means it does not; the other means it does, and still refuses.

- 400 with `detail` naming a blank field: Show the problem detail so they can fix the input. The person can correct this, and the `detail` says how.
- 401 on a protected page: Ask them to sign in. 401 means the request lacks valid authentication.
- 403 for a signed-in user: Say they do not have permission. The server knows who they are and refuses. Signing in again will not help.
- 503 from the API: Apologize and suggest trying again later. This is a server-side condition, so do not blame the person.
- `fetch` rejects with a `TypeError`: Say the server cannot be reached and offer a retry. No response arrived, so no status or detail exists.

What is the best fix?

- Check `res.ok`, and the content type, before parsing, so an HTTP failure gets its own message: correct. `res.json()` rejects with a `SyntaxError` on HTML, which lands in the same `catch` as a real network failure. Checking first separates the cases.
- Have the gateway return 200 so that `catch` is not reached: not correct. That hides a real failure from every client and monitor.
- Replace `res.json()` with `JSON.parse(res)`: not correct. `res` is a Response object, so that fails too.
- Add a second `catch` block: not correct. A `try` statement has only one `catch`. Separate the cases before parsing.

```
const res = await fetch(url);       // rejects: no response
if (res.ok) return res.json();
const type = res.headers.get("content-type") || "";
if (type.includes("problem+json")) {
  const { title, detail, status } = await res.json();
}
```

## Sources

- MDN: Response.ok, retrieved 2026-11-04
- Spring Framework: Error responses, retrieved 2026-11-04
- RFC 9110: HTTP semantics, retrieved 2026-11-04
- RFC 9457: Problem Details for HTTP APIs, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What is logged in each case?

- 500 logs `status 500`; server off logs `no response`: correct. A 500 is still a response, so `fetch` fulfills. With the server off, no response exists, so `fetch` rejects with a `TypeError`.
- Both log `no response`: not correct. That treats a 500 as a rejection. The server did answer.
- Both log a status: not correct. With the server off, there is no status to log.
- 500 logs `no response`; server off logs `status 0`: not correct. That is reversed, and a failed `fetch` gives no response object.

### explore

### Static alternative

A 200 reaches the success branch. A 404 fulfills with ok false and a problem body you can read. A 502 with HTML fulfills with ok false, and res.json() would reject, so check the content type first. A switched-off server rejects fetch with a TypeError.

### terminal

### Static alternative

Test res.ok and return the data. Otherwise read the content type header. If it includes application/problem+json, parse the body and return its title, detail and status. Otherwise return the generic title with the status.

### explore

### Static alternative

- 400 with `detail` naming a blank field: Show the problem detail so they can fix the input. The person can correct this, and the `detail` says how.
- 401 on a protected page: Ask them to sign in. 401 means the request lacks valid authentication.
- 403 for a signed-in user: Say they do not have permission. The server knows who they are and refuses. Signing in again will not help.
- 503 from the API: Apologize and suggest trying again later. This is a server-side condition, so do not blame the person.
- `fetch` rejects with a `TypeError`: Say the server cannot be reached and offer a retry. No response arrived, so no status or detail exists.

### mcq

### Static alternative

What is the best fix?

- Check `res.ok`, and the content type, before parsing, so an HTTP failure gets its own message: correct. `res.json()` rejects with a `SyntaxError` on HTML, which lands in the same `catch` as a real network failure. Checking first separates the cases.
- Have the gateway return 200 so that `catch` is not reached: not correct. That hides a real failure from every client and monitor.
- Replace `res.json()` with `JSON.parse(res)`: not correct. `res` is a Response object, so that fails too.
- Add a second `catch` block: not correct. A `try` statement has only one `catch`. Separate the cases before parsing.
