# Handling 401 and 403: redirect and sign out

## Objectives

- State the general HTTP meanings of 401 (the request lacks valid authentication credentials) and 403 (the server understood the request but refuses it), then apply the project API contract: 401 means sign in again, 403 means keep the session and show not-authorized
- On a 401, clear the client-side authentication state and redirect to the login page, remembering the page to return to, and distinguish that from the server ending an HttpOnly cookie session
- On a 403, show a not-allowed message instead of signing the user out

## Teaching

A signed-in app gets refused sometimes. Two status codes look similar and need opposite handling. Predict this one before any teaching.

General HTTP meanings: 401 Unauthorized means the request lacks valid authentication credentials. 403 Forbidden means the server understood the request and refuses it; a 403 alone does not prove who you are.

This project's API contract then makes them simple: 401 means sign in again, and 403 means keep the session and show not-authorized. Check your own API's contract, since servers can vary.

Send people back where they were. On a 401, pass the current location along, and read it after login:

```
go('/sign-in', { state: { from: here }, replace: true });
```

Note what clearing auth state means. Clearing the user from your app does not end the server's session: an HttpOnly cookie cannot be removed by JavaScript. Ending that session takes a logout request to the server. Here, the server has already said the session is not valid.

Two different things can be called "signing out". Client-side: forget the user in app state and go to the login page. Server-side: the server ends the session, which for an HttpOnly cookie takes a logout request, since scripts cannot touch that cookie. A Sign out button needs both.

## Recap

In general, 401 means the request lacks valid authentication credentials, and 403 means the server understood and refuses. Under the project API contract, 401 means sign in again, and 403 means keep the session and show not-authorized. On a 401, clear client auth state and redirect to login, remembering the page to return to. Clearing client state is not the same as ending an HttpOnly cookie session, which needs a request to the server.

## Cheat sheet

Static version: a signed-in editor with a valid session gets a 403 on an admin page. Compare keeping the session with a not-allowed message, signing out, retrying, and a blank page. Then compare with Activity 2.

At a venue, a guard asks for a ticket when you have none, and you can go and get one. If your ticket is fine but this room is staff only, getting another ticket will not help.

The first is fixed by proving who you are; the second is not.

Where to act: The two reaction lists.

Next step: For each status, ask whether signing in again could fix the problem.

Without JavaScript the lab cannot run. On paper, write down what the app should do for a 401 and for a 403 under the project API contract, and what would go wrong if you swapped them.

Where to act: The body of `handleStatus`.

Next step: Branch on the status value. Each branch calls one or two of the functions in the second parameter.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `navigate` call.

Next step: Its second argument is an options object. Copy the shape from the teaching text.

Without JavaScript the editor cannot run. Starter: handleStatus is empty. On paper, write the branch for 401 and the branch for 403, using the navigate shape in the teaching text. When scripted, the function runs with recorded callbacks.

Static version: a Sign out button only clears user state and redirects, with an HttpOnly cookie in use. Decide whether the server session is over, and what a complete sign out needs.

```
// 401: forget the user, go to sign-in, remember where they were
// 403: keep the user, show a not-allowed message
// other statuses: not an auth problem, handle them elsewhere

// after sign-in: go(here.state?.from ?? '/', { replace: true });
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401: Status
- developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403: Status
- reactrouter.com/api/hooks/useNavigate: Signature
- www.rfc-editor.org/rfc/rfc9110.html: 15.5.2 401 Unauthorized; 15.5.4 403 Forbidden

## Static interaction alternatives

### predict

Static version: a signed-in editor with a valid session gets a 403 on an admin page. Compare keeping the session with a not-allowed message, signing out, retrying, and a blank page. Then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, write down what the app should do for a 401 and for a 403 under the project API contract, and what would go wrong if you swapped them.

### terminal

Without JavaScript the editor cannot run. Starter: handleStatus is empty. On paper, write the branch for 401 and the branch for 403, using the navigate shape in the teaching text. When scripted, the function runs with recorded callbacks.

### mcq

Static version: a Sign out button only clears user state and redirects, with an HttpOnly cookie in use. Decide whether the server session is over, and what a complete sign out needs.
