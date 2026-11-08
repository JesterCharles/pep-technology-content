# Standard error responses with ProblemDetail

## Objectives

- Return RFC 9457 problem details with ProblemDetail, setting type, title, status, detail and an extra property
- Enable Spring MVC's built-in problem details for framework exceptions and predict the body of a validation failure
- Explain why one standard error shape helps API clients compared with ad hoc error JSON

## Teaching

One service returns `{"error":"nope"}`, another `{"message":"bad","code":12}`, and a third `{"errors":["x"]}`. A client calls all three.

Spring's `ProblemDetail` models RFC 9457. Its media type is `application/problem+json`. Standard members are `type`, `title`, `status`, `detail` and `instance`, and extra properties are allowed.

```
ProblemDetail pd = ProblemDetail.forStatusAndDetail(
    HttpStatus.NOT_FOUND, "Workshop 99 not found");
pd.setTitle("Workshop not found");
pd.setType(URI.create("https://example.com/problems/workshop-not-found"));
pd.setProperty("workshopId", 99);
```

Returning a `ProblemDetail` from a handler sets the status and body.

Framework exceptions such as validation failures or a wrong method can use the same format. Set the Boot property:

```
spring.mvc.problemdetails.enabled=true
```

A validation failure then answers `400` with a body like `{"type":"about:blank","title":"Bad Request","status":400,"detail":"Invalid request content.","instance":"/workshops"}`.

The default body names no fields. To add field errors, extend `ResponseEntityExceptionHandler` in your advice and override its handler.

A mobile client must show a special message when a booking fails because a workshop is full, and a generic message otherwise.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `ProblemDetail` models RFC 9457 with `type`, `title`, `status`, `detail` and `instance`.
- `spring.mvc.problemdetails.enabled=true` covers framework exceptions.
- One standard shape lets clients parse every error the same way.

## Cheat sheet

Where to act: Change the return type, then replace the `___`.

Next step: Use the factory shown in the teaching panel, with the status for a conflict.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: After creating it, add two more lines.

Next step: One sets the title, and the other adds the extra property.

Printed alternative: Return a ProblemDetail with status 409, a detail, a title and a workshopId property. Starter file: `ApiErrors.java`.

Where to act: Use the command box under the log.

Next step: The supported list shows a start command for each setting; send the request after each start.

Printed alternative: Setting off: 400 with the default Boot error JSON. Setting on: 400 with application/problem+json, title Bad Request and detail Invalid request content.

- `ProblemDetail.forStatusAndDetail(status, detail)`
- Media type: `application/problem+json`.
- Extra data: `setProperty`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/web/servlet.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html
- https://www.rfc-editor.org/rfc/rfc9457.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A client can parse every error the same way.
- **B. Not this one:** It changes how failures are described, not how often they occur.
- **C. Not this one:** Retries are a client decision.
- **D. Not this one:** Problem details is a format with no encryption in it.

### terminal

**Printed alternative:** Return a ProblemDetail with status 409, a detail, a title and a workshopId property. Starter file: `ApiErrors.java`.

### terminal

**Printed alternative:** Setting off: 400 with the default Boot error JSON. Setting on: 400 with application/problem+json, title Bad Request and detail Invalid request content.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. `type` identifies the problem kind; `detail` can be reworded or translated.
- **B. Not this one:** Wording can change at any time.
- **C. Not this one:** Length has no meaning.
- **D. Not this one:** JSON field order has no contract.
