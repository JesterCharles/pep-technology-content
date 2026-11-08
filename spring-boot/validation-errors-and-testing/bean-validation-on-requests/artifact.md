# Bean Validation on requests

## Objectives

- Annotate a request DTO with constraints such as @NotBlank, @Size, @Email and @Positive and trigger validation with @Valid on a @RequestBody parameter
- Predict the status code and which fields fail for a given invalid request body
- Validate a path variable or query parameter with a constraint on the method parameter

## Teaching

A request record has constraints, and a handler accepts it:

```
record NewWorkshop(@NotBlank String title, @Positive int capacity) {}

@PostMapping("/workshops")
Workshop create(@Valid @RequestBody NewWorkshop body) { return service.create(body); }
```

A client sends `{"title":" ","capacity":-3}`.

Add `spring-boot-starter-validation`. Constraints from `jakarta.validation.constraints` go on request DTO fields, and `@Valid` on the parameter turns checking on.

| Constraint | Fails when |
| --- | --- |
| `@NotBlank` | null, empty or only whitespace |
| `@Size(max = 80)` | length is over the limit |
| `@Email` | not shaped like an email |
| `@Positive` | zero or negative |

With no `@Valid`, annotations are ignored for a request body, and bad data reaches your service.

Validation checks every constraint and collects every failure, so one response can name several fields. A `@RequestBody` failure raises `MethodArgumentNotValidException`, which becomes 400.

Constraints can also sit directly on method parameters:

```
@GetMapping("/workshops/{id}")
Workshop one(@PathVariable @Positive long id) { ... }
```

That uses Spring method validation, which raises `HandlerMethodValidationException`, also 400 by default.

A record has `@NotBlank String title`, and the handler is `create(@RequestBody NewWorkshop body)` with no `@Valid`. A client posts `{"title":""}`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Constraints describe the rule; `@Valid` on a request body triggers it.
- Failures produce 400 before the handler body runs, and name every failing field.
- Constraints on parameters use method validation.

## Cheat sheet

Where to act: Start with the two record components.

Next step: Each constraint goes right before the component it checks.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then look at the handler parameter.

Next step: Constraints do nothing for a request body until something triggers them.

Printed alternative: Add @NotBlank and @Email to email, @Positive to seats, and @Valid to the handler parameter. Starter file: `NewBooking.java`.

Where to act: Test each body against each constraint in turn.

Next step: Check the title rule first, then the capacity rule. Remember the size limit.

- Starter: `spring-boot-starter-validation`.
- `@NotBlank`, `@Size`, `@Email`, `@Positive`.
- `MethodArgumentNotValidException` and `HandlerMethodValidationException`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/io/validation.html
- https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html
- https://jakarta.ee/specifications/bean-validation/3.1/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@Valid` triggers validation during argument binding, so the service is never called.
- **B. Not this one:** Parsing and validating are separate steps.
- **C. Not this one:** The service never runs.
- **D. Not this one:** `@NotBlank` rejects blank strings, so both fields fail.

### terminal

**Printed alternative:** Add @NotBlank and @Email to email, @Positive to seats, and @Valid to the handler parameter. Starter file: `NewBooking.java`.

### drag

**Answer and reason for each row**

- **`{"title":"Intro","capacity":10}`: 200.** Both constraints pass.
- **`{"title":"","capacity":5}`: 400 title.** An empty title fails `@NotBlank`.
- **`{"title":"Spring Boot Advanced","capacity":5}`: 400 title.** The title is over 10 characters.
- **`{"title":"Intro","capacity":0}`: 400 capacity.** Zero is not positive.
- **`{"title":" ","capacity":-1}`: 400 title and capacity.** Whitespace fails `@NotBlank`, and -1 fails `@Positive`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@Valid` is what triggers validation here, so the blank title reaches your code.
- **B. Not this one:** Constraints need a trigger, such as `@Valid` here.
- **C. Not this one:** A record has no such behavior of its own.
- **D. Not this one:** It compiles normally, which is why this mistake is easy to miss.
