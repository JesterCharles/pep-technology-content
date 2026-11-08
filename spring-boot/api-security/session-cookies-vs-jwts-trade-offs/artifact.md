# Reading: session cookies vs JWTs, trade-offs

## Objectives

- Compare server-side sessions identified by a cookie with self-contained JWTs on state, revocation, scaling and size
- Explain why a browser sends cookies automatically and what that means for CSRF, and why a bearer token in a header is not sent automatically
- Choose sessions or JWTs for a described client and API and justify the choice

## Teaching

An admin discovers a stolen account and wants it logged out now. API A uses server-side sessions. API B uses self-contained JWTs that are valid for 24 hours, with no extra checks.

| Topic | Session cookie | JWT |
| --- | --- | --- |
| State | On the server | In the token |
| Revocation | Delete the session | Hard without extra state |
| Scaling | Shared session store | Any instance can verify |
| Size | Small id | Larger, on every request |

A session is an opaque id in a cookie, with the data on the server. A JWT carries signed claims, so any service holding the key can verify it with no lookup. Neither is always better.

A browser sends cookies automatically with requests to the matching site. So another site can cause a logged-in browser to send a request, and that is CSRF. Defenses include CSRF tokens and the `SameSite` cookie attribute.

A bearer token in an `Authorization` header is not sent automatically; your code attaches it. That removes this CSRF path, but a token stored where scripts can read it is exposed to XSS.

Choose by client: first-party browser apps often suit sessions with `HttpOnly` cookies; separate API clients and mobile apps often suit bearer tokens.

You are building a public mobile app talking to several independent backend services. Tokens are short-lived, and revocation needs are met with a refresh flow.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Sessions keep state on the server and revoke easily; JWTs carry signed claims and verify with a key.
- Browsers send cookies automatically, which is why CSRF matters; bearer headers are added by code.
- Choose based on the client and how you need to revoke.

## Cheat sheet

A cloakroom gives you a numbered ticket, and staff keep your coat. A theatre gives you a printed pass showing your seat and date, which any usher can read. If your coat is lost, the cloakroom knows right away, but a printed pass cannot easily be cancelled once it is in your pocket.

The cloakroom ticket is like a session, and the printed pass is like a token.

Where to act: Use the table in the teaching panel.

Next step: Ask where the state lives in each case.

Where to act: Change the credential control, and read the result.

Next step: Which transport does the browser add automatically, and which does your code add?

Printed alternative: Cookie with no SameSite: the cross-site request carries it. Cookie with SameSite=Strict: it is not sent cross-site. Bearer header: the browser does not attach it, and your code must.

- Cookie flags: `HttpOnly`, `Secure`, `SameSite`.
- Keep JWTs short-lived, and never put secrets in claims.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html
- https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html
- https://www.rfc-editor.org/rfc/rfc7519.html
- https://www.rfc-editor.org/rfc/rfc6750.html
- https://www.rfc-editor.org/rfc/rfc6265.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. With sessions, the server holds the state, so it can revoke it.
- **B. Not this one:** Newer is not the point. A valid signed token keeps working until it expires unless you add a server check.
- **C. Not this one:** A plain JWT check verifies signature and expiry. It holds no revocation information by itself.
- **D. Not this one:** Server-side session deletion works regardless of the client.

### drag

**Answer and reason for each row**

- **Can be revoked at once by deleting server data: Session cookie.** The server holds the state, so it can remove it.
- **Any instance can verify it with only the key: JWT.** The signature proves it, with no session lookup.
- **Needs a shared store when many instances serve users: Session cookie.** Every instance must find the session data.
- **Grows larger as you add more claims: JWT.** Claims travel in the token on every request.

### explore

**Printed alternative:** Cookie with no SameSite: the cross-site request carries it. Cookie with SameSite=Strict: it is not sent cross-site. Bearer header: the browser does not attach it, and your code must.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. This client and topology match that design, and the trade-off on revocation is handled.
- **B. Not this one:** Other services could not see those sessions.
- **C. Not this one:** A stolen token would then work forever.
- **D. Not this one:** That spreads the password to every service.
