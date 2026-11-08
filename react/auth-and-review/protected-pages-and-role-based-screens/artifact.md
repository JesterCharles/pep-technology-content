# Protected pages and role-based screens

## Objectives

- Guard routes with a wrapper component that redirects signed-out users to the login page with Navigate
- Show or hide screens and controls according to the signed-in user's role
- Explain that front-end guards only shape the interface and that the server must still enforce every authorization rule

## Teaching

Screens should change based on who is signed in. Before any teaching, predict how far that goes.

A route guard is a wrapper component: if nobody is signed in, it renders React Router's `<Navigate>`, which redirects when rendered. Otherwise it renders its children.

```
if (!member) return <Navigate to="/sign-in" replace />;
return page;
```

`replace` stops Back from returning to the guarded page. Show or hide individual controls with ordinary conditional JSX on `user.role`.

Front-end guards only shape the interface: they decide what to show. All your JavaScript can be read and changed in the browser, and anyone can send requests directly.

So the server must enforce every authorization rule, on every request. A Spring Security rule such as `requestMatchers("/api/admin/**").hasRole("ADMIN")` is what actually protects the data. Client checks are for a better experience.

The rule of thumb: anything the browser holds can be read or changed by the user. That includes your routes, your role checks and any flags in state. Build guards for clarity, then assume they are not there when you design the server.

## Recap

Guard routes with a wrapper that renders `<Navigate to="/login" replace />` when there is no user, and show or hide controls with conditional JSX on `user.role`. These checks only shape the interface: anything in the browser can be read or changed, and requests can be sent directly. The server must still enforce every authorization rule on every request.

## Cheat sheet

Static version: a Delete all button shows only for admins, but the server has no role check. A non-admin sends the request directly. Decide what happens. Compare with Activity 3.

Where to act: The body of `RequireAuth`.

Next step: Test the user first and return early, as in the teaching text. Otherwise return what was nested inside it.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The JSX of `Toolbar`.

Next step: Wrap the Delete button in a condition that compares the role. Use the form that renders something or nothing.

Without JavaScript the editor cannot run. Starter: RequireAuth always renders its children, and Toolbar always shows both buttons. On paper, add the early redirect and the role condition. Compare with the teaching snippet.

A shop hides the staff door behind a curtain so customers are not confused. The lock on the door is what actually keeps people out, and it works whether or not the curtain is there.

The interface is the curtain, and the server is the lock.

Where to act: The Server role check box and the send button.

Next step: The request is the same both times. See which setting changes the result, and notice the screen did not change at all.

Without JavaScript the lab cannot run. On paper: a non-admin sends a delete request directly, while the button is hidden. Say what happens with no server check and with a server role check.

Static version: an admin route sits behind a RequireAdmin guard, and a reviewer asks if the endpoints need server checks. Compare the four answers, and choose using the rule of thumb in the teaching text.

```
function MembersOnly({ member, page }) {
  if (!member) return <Navigate to="/sign-in" replace />;
  return page;
}

{member.role === 'OWNER' && <button>Archive</button>}

// Server: requestMatchers("/api/admin/**").hasRole("ADMIN")
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html: Authorizing an Endpoint; Authorizing Requests
- reactrouter.com/api/components/Navigate: Summary; Props
- reactrouter.com/start/declarative/routing: Layout Routes

## Static interaction alternatives

### predict

Static version: a Delete all button shows only for admins, but the server has no role check. A non-admin sends the request directly. Decide what happens. Compare with Activity 3.

### terminal

Without JavaScript the editor cannot run. Starter: RequireAuth always renders its children, and Toolbar always shows both buttons. On paper, add the early redirect and the role condition. Compare with the teaching snippet.

### explore

Without JavaScript the lab cannot run. On paper: a non-admin sends a delete request directly, while the button is hidden. Say what happens with no server check and with a server role check.

### mcq

Static version: an admin route sits behind a RequireAdmin guard, and a reviewer asks if the endpoints need server checks. Compare the four answers, and choose using the rule of thumb in the teaching text.
