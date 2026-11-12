# Validation, Errors and Testing lab: bulletproof the booking API

## Goal

This is the required lab of the Standard track's error-handling day.
Four linked tasks: reject invalid bookings with Bean Validation, turn exceptions into RFC 9457 problem details in one global handler, and finish a `@WebMvcTest` that stubs the service with `@MockitoBean`.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/bookings/NewBooking.java` | 1 |
| `starter/src/main/java/bookings/BookingController.java` | 1 (one annotation) |
| `starter/src/main/java/bookings/ApiErrors.java` (you create it) | 2, 3 |
| `tests/bookings/WebLayerTest.java` (a test you finish) | 4 |

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

## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.
Tasks 1-3 are checked over MockMvc against the running context; Task 4 is itself the test you finished.

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
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
