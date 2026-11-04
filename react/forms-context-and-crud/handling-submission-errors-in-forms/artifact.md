# Handling submission errors in forms

## Objectives

- Show field-level validation errors returned by the API next to the fields they belong to
- Show a form-level message for network and server errors while keeping what the user typed
- Check required fields on the client before sending, while still handling the server's validation as the authority

## Teaching

Submissions fail. What happens next decides whether people fix it or give up. Predict this one before any teaching.

Different failures belong in different places:

- Field errors: a 400 with per-field messages. Show each one next to its field.
- Form-level message: a 5xx or network failure. It is not about any one field, so show one message for the form.

Either way, keep what the user typed. Only clear the form after success. In this page's example API, a 400 body looks like `{"errors": {"email": "..."}}`. Your API contract decides the real shape.

Check required fields on the client first, for a quick answer without a round trip. That is only a convenience: the server remains the authority, because client checks can be bypassed, and only the server knows things such as whether an email is already taken.

```
if (!values.email) return { fieldErrors: { email: '...' } };
```

Then send the request, and handle a 400 body, other failures, and a rejected `fetch` separately.

Treat client checks as a courtesy and server checks as the rule. The client catches obvious slips quickly. The server catches everything, including requests that never came through your form. Always handle server validation, even if the client check has passed.

## Recap

Show field errors returned by the API next to their fields, and show a form-level message for server and network failures. Keep what the user typed, clearing the form only after success. Check required fields on the client for a fast answer, but treat the server as the authority and always handle its validation response.

## Cheat sheet

Static version: a submit handler clears the fields, then sends a request that fails, with no error handling. Decide what the person sees. Compare with Activity 2.

A clerk returns a form with a pencil mark beside the one box that is wrong, not a blank copy to start over. When the office system is down, a sign says so and your form stays yours.

Point at the field when it is the field, and say so plainly when it is not.

Where to act: The Server result list and the Submit button.

Next step: Watch which area shows each message and whether the fields keep their text. Then pick the result that should clear them.

Without JavaScript the lab cannot run. On paper, for a 400 with field errors, a 500, a network failure and a 201, say where the message appears and whether the typed text stays.

Where to act: The start of `submit`.

Next step: Handle the empty email before any request, returning in the same shape as the teaching example.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Around the `fetch`.

Next step: Wrap it in try and catch for the network failure. After the response arrives, test ok first, then the 400 status, and treat the rest as form-level.

Without JavaScript the editor cannot run. Starter: submit always sends and always returns ok. On paper, add the empty email check and handling for success, a 400, a 500 and a network failure. Check against the teaching text. When scripted, the function is run against a fake fetch.

Static version: someone proposes removing 400 handling because of client validation. Compare keeping it, agreeing, removing client checks instead, and using a generic error. Choose using the teaching text.

```
// Where each outcome goes:
empty required field -> field message, send nothing
2xx                  -> clear the form
400 with field map   -> next to each field, keep typed text
other non-2xx        -> form-level message, keep typed text
fetch rejected       -> form-level message, keep typed text
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/API/Response/ok: Value
- www.rfc-editor.org/rfc/rfc9110.html: 15.5.1 400 Bad Request; 15.6 Server Error 5xx
- www.w3.org/WAI/tutorials/forms/notifications/: Overall feedback; In-line feedback
- www.w3.org/WAI/tutorials/forms/validation/: Validating required input; Client-side validation benefits

## Static interaction alternatives

### predict

Static version: a submit handler clears the fields, then sends a request that fails, with no error handling. Decide what the person sees. Compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, for a 400 with field errors, a 500, a network failure and a 201, say where the message appears and whether the typed text stays.

### terminal

Without JavaScript the editor cannot run. Starter: submit always sends and always returns ok. On paper, add the empty email check and handling for success, a 400, a 500 and a network failure. Check against the teaching text. When scripted, the function is run against a fake fetch.

### mcq

Static version: someone proposes removing 400 handling because of client validation. Compare keeping it, agreeing, removing client checks instead, and using a generic error. Choose using the teaching text.
