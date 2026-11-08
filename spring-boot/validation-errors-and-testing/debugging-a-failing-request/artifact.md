# Debugging a failing request

## Objectives

- Trace a failing request through the controller, service and repository using the response status, the server log and the stack trace
- Reproduce the failure in a MockMvc test before fixing it
- Classify a failure as a client error (4xx) or a server error (5xx) and locate the layer responsible

## Teaching

`POST /bookings` returns 500. The log shows:

```
ERROR ... Servlet.service() threw exception
java.lang.NullPointerException: Cannot invoke "Workshop.isFull()"
  at com.acme.BookingService.book(BookingService.java:31)
  at com.acme.BookingController.create(BookingController.java:18)
```

Debug in this order. Status says who to suspect: 4xx is a client problem, and 5xx is a server problem. The log says what happened during that request. The stack trace says where, and the top frame in your package is usually the first place to look.

A failure trace passes through the layersA request goes through the controller, the service and the repository; stack frames name each layer involved in the failure. Controller: did it match and bind? Service: did a rule or null fail? Repository: did the SQL fail?

Use the stack trace to find which layer failed.

To see request handling, set `logging.level.org.springframework.web=debug` in development.

Once you suspect a cause, write a test that fails the same way before changing code. Then the fix has proof, and the bug cannot quietly come back.

```
@Test
void duplicateEmailReturns409() throws Exception {
  mvc.perform(post("/users").contentType(APPLICATION_JSON)
        .content("{\"email\":\"taken@b.c\"}"))
     .andExpect(status().isConflict());
}
```

Run it, see the failure, fix the code, and run it again.

A client reports intermittent 500s. The log shows `ConstraintViolationException` on `bookings.email_unique` at `BookingRepository.save`, whenever someone books twice with the same email.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Status, then log, then stack trace: suspect, what, where.
- 4xx points to input or route; 5xx points to a server-side layer.
- Reproduce with a failing test before you fix.

## Cheat sheet

Where to act: Read the status first in each row.

Next step: A 4xx suggests the input or route; a 5xx suggests a server-side failure, and the frame names the layer.

Where to act: Replace the `___` after `.andExpect(`.

Next step: State the status you want after the fix, not the one you see today.

Printed alternative: Complete the expectation so that the test demands a 404 for an unknown workshop. Starter file: `BookingWebTest.java`.

- `logging.level.org.springframework.web=debug` shows request handling.
- The first frame in your package is usually where to start.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/logging.html
- https://docs.spring.io/spring-boot/reference/web/servlet.html
- https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- https://www.rfc-editor.org/rfc/rfc9110.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. The first frame in your own code is where the failure surfaced.
- **B. Not this one:** 5xx means the server failed. A bad request would be 4xx.
- **C. Not this one:** The message is a null reference in Java code.
- **D. Not this one:** That frame is the caller. The failure is deeper, at line 31.

### drag

**Answer and reason for each row**

- **400, with `MethodArgumentNotValidException` in the log: 4xx at the controller edge.** Validation rejected the body before the service ran.
- **500, with `NullPointerException` at `BookingService.book`: 5xx in the service.** The top application frame is in the service.
- **500, with a Hibernate exception about a missing column at `BookingRepository.save`: 5xx in the repository.** The data access call failed.
- **405, with no stack trace: 4xx at the controller edge.** The path exists, but the client used a method that is not mapped.

### terminal

**Printed alternative:** Complete the expectation so that the test demands a 404 for an unknown workshop. Starter file: `BookingWebTest.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The client can act on a 409, and the test proves it.
- **B. Not this one:** That hides a real failure from the client.
- **C. Not this one:** That removes a rule the data depends on.
- **D. Not this one:** The next duplicate fails the same way.
