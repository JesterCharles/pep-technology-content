# Global error handling

## Objectives

- Handle a custom not-found exception and validation failures for all controllers in one @RestControllerAdvice with @ExceptionHandler methods
- Predict which handler runs for a thrown exception when local and global handlers both match
- Return error responses that never expose stack traces or internal details to the client while logging them on the server

## Teaching

A controller has its own handler, and so does a global advice class:

```
@RestController
class SeatController {
  @ExceptionHandler(SeatTaken.class)
  ResponseEntity<String> local(SeatTaken e) { return ResponseEntity.status(409).body("local"); }
}

@RestControllerAdvice
class ApiErrors {
  @ExceptionHandler(SeatTaken.class)
  ResponseEntity<String> global(SeatTaken e) { return ResponseEntity.status(409).body("global"); }
}
```

That controller throws `SeatTaken`.

`@RestControllerAdvice` gives every controller shared handlers, so each error maps to one response in one place.

```
@RestControllerAdvice
class BillingErrors {
  @ExceptionHandler(CardDeclined.class)
  @ResponseStatus(HttpStatus.PAYMENT_REQUIRED)
  ProblemBody declined(CardDeclined e) {
    return new ProblemBody(e.getReason());
  }
}
```

Throw domain exceptions from the service, and map them here. Validation failures can be handled the same way, through `MethodArgumentNotValidException`.

Spring checks the throwing controller first, then advice classes. Within those, it prefers the closest exception match, so a handler for `WorkshopNotFound` beats one for `RuntimeException`.

A catch-all handler for `Exception` protects clients from stack traces. Log the details on the server, and return a generic message:

```
log.error("Unhandled error", e);
return new ErrorBody("Something went wrong");
```

A stack trace reveals class names and libraries, which help attackers, and it helps no API client.

A generic handler returns `e.toString()` and `e.getStackTrace()` to the client "to make debugging easier".

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@RestControllerAdvice` shares handlers across all controllers.
- A local handler outranks advice, and the closest exception type wins.
- Log details on the server; never send stack traces to clients.

## Cheat sheet

Where to act: Add the class annotation first.

Next step: Use the annotation that applies across all controllers.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then add the handler.

Next step: Name the exception in the annotation, and set the status with `@ResponseStatus`.

Printed alternative: Mark the class as REST controller advice and add a handler for WorkshopNotFound returning 404 with an ErrorBody. Starter file: `ApiErrors.java`.

Where to act: Change one toggle at a time and read the output.

Next step: A local match wins over advice, and a specific match wins over a general one.

Printed alternative: Local handler present: local answers. No local handler: the specific global handler answers. Only the catch-all: the generic handler answers. Nothing present: the default error response with status 500.

- `@ExceptionHandler(X.class)` with `@ResponseStatus` or `ResponseEntity`.
- A catch-all for `Exception` protects clients from internals.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/web/servlet.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A controller's own `@ExceptionHandler` is checked before any advice.
- **B. Not this one:** Advice is the fallback for controllers with no match of their own.
- **C. Not this one:** One handler runs for one exception.
- **D. Not this one:** Having both is allowed. There is a defined order.

### terminal

**Printed alternative:** Mark the class as REST controller advice and add a handler for WorkshopNotFound returning 404 with an ErrorBody. Starter file: `ApiErrors.java`.

### explore

**Printed alternative:** Local handler present: local answers. No local handler: the specific global handler answers. Only the catch-all: the generic handler answers. Nothing present: the default error response with status 500.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Logs serve developers, and clients get only what they need.
- **B. Not this one:** Internals help attackers more than they help clients. A correlation id serves that need.
- **C. Not this one:** There is no safe schedule for exposing internals.
- **D. Not this one:** Encoding is not protection.
