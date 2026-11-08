# Login with a session cookie or JWT

## Objectives

- Compare a session cookie and a JWT for a single-page app: where the credential is kept, how it is sent, and the cross-site scripting and cross-site request forgery trade-offs
- Submit a login form, handle success and failure, and keep the signed-in user in application state
- Send the credential on later requests: credentials: 'include' for a cookie, or an Authorization: Bearer header for a JWT

## Teaching

Once a user signs in, the browser must hold some proof of that. Where it lives matters. Predict this case before any teaching.

Session cookie: the server sets it, the browser keeps it and sends it automatically. With `HttpOnly`, scripts cannot read it. Its main risk is cross-site request forgery (CSRF), since the browser sends it even for requests another site triggered. `SameSite` and CSRF tokens reduce that.

JWT in JavaScript: your code keeps it and adds it to each request. It is not sent automatically, so classic CSRF does not apply, but XSS can steal it if it is kept in `localStorage`.

A login form POSTs the credentials. On success, keep the signed-in user in application state, such as a context. On failure, show a message.

Later requests must carry the credential:

```
fetch(url, { credentials: 'include' });           // cookie
fetch(url, { headers: { Authorization: 'Bearer ' + token } }); // JWT
```

`credentials: 'include'` lets the browser send and store cookies even across origins, which the server's CORS setup must also allow.

Keep three things separate. The credential proves who you are, and is sent with requests. The user in app state is only a copy that decides what the screen shows. A JWT can be decoded by anyone holding it, so never put secrets in it. Sensitive data in `localStorage` is readable by any script on the page.

## Recap

A session cookie is kept and sent by the browser, and `HttpOnly` hides it from scripts, so CSRF is its main risk. A JWT handled by your code is sent in an `Authorization: Bearer` header; it is not sent automatically, but it can be stolen by XSS if kept in `localStorage`. Submit the login form, handle both outcomes, and keep the user in application state. Send the credential on later requests: `credentials: 'include'` for a cookie, or the Bearer header for a JWT.

## Cheat sheet

Static version: an app stores a JWT in localStorage, and an injected script calls localStorage.getItem. Decide what the script receives. Compare with Activity 2.

Where to act: The outcome panel after each attack.

Next step: Ask for each credential: can script read it? Does the browser attach it by itself?

Without JavaScript the lab cannot run. On paper, fill in a small table: for an HttpOnly cookie and a JWT in localStorage, can script read it, and does the browser attach it by itself? Then say which attack each is more exposed to.

Where to act: The options of the login `fetch`.

Next step: Build on your earlier POST with a JSON body, adding the option that allows cookies.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: `getOrders` and `getOrdersWithJwt`.

Next step: One needs an option from the teaching text, and the other needs a header holding the word Bearer, a space and the token.

Without JavaScript the editor cannot run. Starter: an empty login function and two fetches with no credential. On paper, write the login with credentials included and both outcomes, then add credentials to one fetch and an Authorization header to the other. When scripted, it runs against a fake fetch.

Static version: someone wants to keep a password in localStorage to survive a refresh. Compare a session cookie or token with a user fetched on load, base64 encoding, a JWT claim, and React state. Choose using the teaching text.

```
// Cookie session: add this option to every request
{ credentials: 'include' }

// JWT: add this header to every request
{ headers: { Authorization: `Bearer ${jwt}` } }

// On a successful sign-in: keep the user in state
setCurrentUser(await reply.json());
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html: Storage APIs (Local Storage)
- developer.mozilla.org/en-US/docs/Web/API/RequestInit: credentials
- developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies: Creating, removing, and updating cookies; Security
- docs.spring.io/spring-security/reference/servlet/exploits/csrf.html: CSRF Considerations
- www.rfc-editor.org/rfc/rfc6265.html: 4.1.2.5 The Secure Attribute; 4.1.2.6 The HttpOnly Attribute; 8 Security Considerations
- www.rfc-editor.org/rfc/rfc7519.html: 1 Introduction; 4.1 Registered Claim Names
- www.rfc-editor.org/rfc/rfc8725.html: 3 Best Practices
- www.rfc-editor.org/rfc/rfc9110.html: 11.6.2 Authorization

## Static interaction alternatives

### predict

Static version: an app stores a JWT in localStorage, and an injected script calls localStorage.getItem. Decide what the script receives. Compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, fill in a small table: for an HttpOnly cookie and a JWT in localStorage, can script read it, and does the browser attach it by itself? Then say which attack each is more exposed to.

### terminal

Without JavaScript the editor cannot run. Starter: an empty login function and two fetches with no credential. On paper, write the login with credentials included and both outcomes, then add credentials to one fetch and an Authorization header to the other. When scripted, it runs against a fake fetch.

### mcq

Static version: someone wants to keep a password in localStorage to survive a refresh. Compare a session cookie or token with a user fetched on load, base64 encoding, a JWT claim, and React state. Choose using the teaching text.
