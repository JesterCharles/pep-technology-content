# Validation, Errors and Testing lab: bulletproof the booking API

## Goal

This is the required lab of the Standard track's validation, errors and testing module.
Eight linked tasks on one booking API: reject invalid bookings and ids with Bean Validation, turn exceptions into RFC 9457 problem details in one global handler and with Spring MVC's built-in support, reproduce a bug report in a MockMvc test before fixing it, and test the web layer with a fake service and with `@MockitoBean`.

The lab is one sitting after all six Standard topics of the module are taught: it follows "Debugging a failing request" on S10, in its own lab slot before S11. Tasks 1 to 3 and 6 use the validation and error-handling pages (Bean Validation, global error handling, ProblemDetail); Tasks 4, 5, 7 and 8 use the testing pages (`@MockitoBean`, MockMvc, debugging a failing request).

Authoring estimate, not a measured learner pilot: about 72 minutes in all, which is about 5 minutes of setup, about 27 minutes for Tasks 1 to 3 and 6, and about 40 minutes for Tasks 4, 5, 7 and 8.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/bookings/NewBooking.java` | 1 |
| `starter/src/main/java/bookings/BookingController.java` | 1, 5 (one annotation each) |
| `starter/src/main/java/bookings/ApiErrors.java` (you create it) | 2, 3, 6 |
| `starter/src/main/resources/application.properties` | 6 (one line) |
| `tests/bookings/WebLayerTest.java` (a test you finish) | 4, 8 |
| `tests/bookings/BugReportTest.java` (a test you finish, and your prediction) | 5 |
| `tests/bookings/ErrorSliceTest.java` (a test you finish) | 7 |

Everything else is complete and stays as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later (`java -version`, `mvn -v`; both must report Java 25).

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

## Tasks

Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

### Task 1: constrain the request body

In `NewBooking.java`, add the constraints from the TODO: `attendee` `@NotBlank`, `email` `@NotBlank @Email`, `seats` `@Min(1)`.
Constraints only run when asked: in `BookingController.create`, put `@Valid` in front of the `@RequestBody` parameter.
An invalid body now stops at the door with 400 before any service code runs.
Done when `task1RejectsAnInvalidBookingWith400` no longer fails.

### Task 2: one global handler for the not-found case

`GET /bookings/999` currently explodes into a 500: the service's `NoSuchElementException` reaches the servlet container, and the client learns internal details it should never see.
Create `ApiErrors.java` in the same package: a class annotated `@RestControllerAdvice` with one method annotated `@ExceptionHandler(NoSuchElementException.class)` that returns a `ProblemDetail` built with `ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage())`, with `setTitle("Booking not found")`.
Done when `task2TurnsAnUnknownIdIntoAProblem404` no longer fails.

### Task 3: problem details for validation failures

Add a second handler to `ApiErrors` for `MethodArgumentNotValidException` (import from `org.springframework.web.bind`): return a `ProblemDetail` with status 400, title `Validation failed`, and a detail string that names the failing fields, e.g. `"Invalid fields: " + fields` where `fields` joins `exception.getBindingResult().getFieldErrors()` field names (sorted, comma-separated).
Every error from this API now has one standard shape.
Done when `task3AnswersValidationFailuresWithProblemDetail` no longer fails.

### Task 4: finish the web-layer slice test

Open `tests/bookings/WebLayerTest.java` - a `@WebMvcTest` you complete yourself, following its three TODO steps: annotate the class with `@WebMvcTest(BookingController.class)`, replace the service with a `@MockitoBean` field, and stub it with `given(service.byId(7L)).willReturn(...)` exactly as the TODO shows.
The slice starts only the web layer; the mock plays the service.
Done when `task4StubsTheServiceWithMockitoBean` no longer fails.

### Task 5: reproduce a bug report, predict, then fix it

The report: "`GET /bookings/0` answers 404 Booking not found. Booking ids start at 1, so 0 is a bad request from the client and should be a 400."

1. Reproduce it before you change any code. In `tests/bookings/BugReportTest.java`, replace `null` in `task5ReproducesTheZeroIdReport` with a MockMvc request that sends what the report describes and expects what the report says should happen; keep the result with `.andReturn()`.
   Run the tests: `task5ReproducesTheZeroIdReport` must now fail on the status, because the bug is still there.
   That failure is your proof that the test sees the bug; a test that passes before the fix proves nothing. Nothing can check the order for you, so run it now.
2. Predict. Once the fix is in, Spring itself will reject the id before your controller runs, and Task 6's setting turns that into a problem body. Write the `title` and the `detail` you expect in that body into `PREDICTED_TITLE` and `PREDICTED_DETAIL` at the top of the file. The ProblemDetail page shows how Spring builds these bodies, but its example is a request-body validation failure; this one comes from method validation on a path variable (the Bean Validation page names the exception), so predict what differs and why.
3. Fix it with Bean Validation: in `BookingController.byId`, put a constraint on the `id` parameter that rejects zero and negative numbers. A constraint on a method parameter uses Spring's method validation, which answers 400 before the service runs; no `@Valid` is needed here, and the controller class must not carry `@Validated`.

After the fix, look at the real body: in your step 1 request, add `.andDo(print())` before `.andReturn()` (import `static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print`), run the tests, and open `starter/target/surefire-reports/bookings.BugReportTest-output.txt`, where the printed `MockHttpServletResponse` shows the body. Compare its `title` and `detail` with your prediction and work out why any value differs before you change your constants. No test checks your prediction: the shipped test checks only that the answer is a 400 problem body with a title and a detail, so this comparison is yours to make honestly.

<details><summary>Hint for step 3</summary>

The constraint is `@Positive` from `jakarta.validation.constraints`, written after `@PathVariable`.

</details>

Done when `task5ReproducesTheZeroIdReport`, `task5PredictsTheProblemBodyOfTheFix` and `task5RejectsANonPositiveIdWith400` no longer fail.

### Task 6: built-in problem details for framework errors

Your handlers cover two exceptions. Spring MVC throws many others itself, for example for a body that is not JSON or cannot be read, and those still answer without a problem body.

1. In `application.properties`, switch on Spring MVC's built-in problem details with the property from the ProblemDetail page.
2. Run the tests: `task3AnswersValidationFailuresWithProblemDetail` now fails. Read the body in its message and compare it with what your `ApiErrors` returns.
   The setting registers Spring's own handler for framework exceptions, and Spring asks it before your `ApiErrors`, so it answers the validation failure first.
3. Keep your field names: give `ApiErrors` the highest precedence with Spring's `@Order` annotation (`org.springframework.core.annotation.Order`, `org.springframework.core.Ordered`).
   Spring now asks your advice first for the two exceptions it handles, and the built-in handler answers everything else.
   The ProblemDetail page shows another route, extending `ResponseEntityExceptionHandler`. Do not combine it with this lab's own `MethodArgumentNotValidException` handler: both would handle the same exception and no context starts.

<details><summary>Hint for step 1</summary>

`spring.mvc.problemdetails.enabled=true`

</details>

Done when `task6AnswersFrameworkErrorsWithProblemDetail` passes and Task 3 passes again.

### Task 7: test the error paths with a fake service

Open `tests/bookings/ErrorSliceTest.java` and follow its four TODO steps:

1. Make the class a test that starts only the web layer, for `BookingController` alone (the MockMvc page, "slice tests").
2. The slice loads no services, so give it one: a nested, `static` test configuration class whose bean method returns a fake `BookingService` that finds nothing (its `byId` always throws `NoSuchElementException`). `BookingService` is a class, so the fake is a subclass that overrides `byId`.
3. Replace the first `null` with a GET of one booking by a positive id that expects status 404 and the title `Booking not found`, ending in `.andReturn()`.
4. Replace the second `null` with a `POST /bookings` of an invalid body (blank attendee, invalid email, 0 seats) that expects status 400 and the title `Validation failed`, ending in `.andReturn()`.

The shipped checks confirm that the context is the web-layer slice rather than the full application, that it omits the real service and supplies a fake (not a Mockito mock) that finds nothing, that each request is the one the step asks for, and that each answer is your `ApiErrors` problem body.
The slice check recognises the full application by a bean only the full application registers; a full context that deliberately switches that bean's auto-configuration off and overrides the service would not be caught, so start the slice the way step 1 asks.
The slice runs your controller and your `ApiErrors` with no database and no real service.

<details><summary>Hints for steps 1 and 2</summary>

Step 1 is `@WebMvcTest(BookingController.class)` on the class.
Step 2 is a `static class` annotated `@TestConfiguration` with one `@Bean` method returning `new BookingService() { ... }` that overrides `byId` to throw.

</details>

Done when both `task7...` tests no longer fail.

### Task 8: verify an interaction on the mock

Back in `WebLayerTest.java`, `task8VerifiesTheCreateCall` posts a valid booking and checks the 201.
The status alone cannot show that the controller handed the request to the service: an unstubbed mock simply returns `null`.
1. Where the step 1 TODO is, use Mockito's `verify` on your mock to check that `create` was called once, and pass the posted booking as the argument.
   The shipped checks fail while the call is missing from the mock or any call on the mock is unverified.
   They cannot see which argument you wrote: with the posted booking, `verify` also fails if the controller passed something else; with a matcher such as `any()`, it does not.
2. Check yourself before you go on: why does the controller call this mock at all, and why would a plain `mock(BookingService.class)` created inside the test never be called by the controller?
3. `task8ShowsThatAPlainMockIsOnlyCalledWhenYouPassItIn` starts from such a plain mock and a `built` controller that is still `null`. Where its TODO is, replace `null` with a `BookingController` you build yourself with the plain mock, call `built`'s `create` with the test's `POSTED` booking, then `verify` on the plain mock that `create` was called with that booking.
   Its shipped checks require the controller you built, the recorded and verified `create` call with `POSTED`, no other unverified call on the plain mock, and an untouched context mock; they then call `built.byId(5L)` and check that the call reached the plain mock.
   They cannot tell whether your `create` call went through `built` or straight to the plain mock, so make it through `built`: that is the point of the step.

<details><summary>Check your answer</summary>

`@MockitoBean` puts the mock into the Spring context in place of the real service, so the controller is built with it. A plain Mockito mock lives only in the test object; the context, and so the controller, never sees it.

</details>

Done when `task8VerifiesTheCreateCall` and `task8ShowsThatAPlainMockIsOnlyCalledWhenYouPassItIn` no longer fail.

## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.
Tasks 1-3, 5 and 6 are checked over MockMvc against the running context (Task 5's fix also through the exception Spring resolved for the request, which shows whether method validation answered); Tasks 4, 7 and 8 and the first two steps of Task 5 are tests you finish, with shipped checks inside them.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. No database and no port are used.

## Cleanup

The lab writes only `starter/target`:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **Invalid bodies still answer 201**: constraints without `@Valid` on the parameter never run - that is the second half of Task 1.
- **`task2` fails with a 500 in the report**: the advice class is missing, not annotated `@RestControllerAdvice`, or in a package the application does not scan (keep it in `bookings`).
- **`No qualifying bean of type BookingService`** in `WebLayerTest`: step 2 is missing - the slice loads no services until the `@MockitoBean` field provides one.
- **`Failed to load ApplicationContext`** for `ErrorSliceTest`: Task 7 step 2 is missing, or the nested class is not `static` or not annotated `@TestConfiguration`.
- **`task5ReproducesTheZeroIdReport` passes before the fix**: the request in step 1 does not expect the status the report asks for - a reproduction must fail first.
- **`task5ReproducesTheZeroIdReport` says the reproduction must send the request the report describes**: your request fails for another reason (for example a non-number id); send exactly the reported request.
- **`task3` fails with the built-in body after Task 6**: expected after step 1; step 3 (`@Order` on `ApiErrors`) brings your field names back.
- **`task6` fails with `Content type not set`**: the Task 6 property is missing, so Spring answers 415 with no body.
- **`Ambiguous @ExceptionHandler method`** and no context starts: `ApiErrors` extends `ResponseEntityExceptionHandler` and also has its own `MethodArgumentNotValidException` handler; use one route, not both (Task 6 step 3).
- **`No interactions wanted here`** in `task8VerifiesTheCreateCall`: the `verify` call is missing; **`Argument(s) are different!`**: it names other values than the posted booking; **the controller's create call with the posted booking must remain recorded**: the mock was reset instead of verified.
- **`No interactions wanted here`** in `task8ShowsThatAPlainMockIsOnlyCalledWhenYouPassItIn`: either a call on the plain mock is not verified, or something else also called the context's `@MockitoBean` during this test (for example an extra request through MockMvc); step 3 must leave the context mock untouched.
- **`Wanted but not invoked`** in `task8ShowsThatAPlainMockIsOnlyCalledWhenYouPassItIn`: the call you verified never reached the plain mock - for example it went through MockMvc, whose controller the context built. Step 3 asks for a controller you build yourself.
- **`ErrorSliceTest` says to start only the web layer, or that the fake must find nothing or not be a Mockito mock**: Task 7 step 1 or 2 is missing, the class starts the full application instead of the web-layer slice, or the service bean is a Mockito mock or still finds booking 1.
- **`task5RejectsANonPositiveIdWith400` says to reject the id with a Bean Validation constraint**: the 400 does not come from Spring MVC's own method validation. Either you wrote the check by hand, or a class-level `@Validated` on `BookingController` switched validation to a proxy; put the constraint on the `byId` parameter and remove any class-level `@Validated` (Task 5 step 3).
- **`Request processing failed` caused by `ConstraintViolationException: byId.id: must be greater than 0`** in the Task 5 tests: `BookingController` carries a class-level `@Validated`, which switches to the older proxy-based method validation; remove it so Spring MVC's built-in method validation answers the 400.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
