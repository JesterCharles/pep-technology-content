# Path, query and body parameters

## Objectives

- Bind a path variable, a required and an optional query parameter and a JSON request body to handler method parameters with @PathVariable, @RequestParam and @RequestBody
- Predict the response status when a required query parameter is missing or a path variable cannot be converted to the declared type
- Choose whether a value belongs in the path, the query string or the body for a described request

## Teaching

This handler exists:

```
@GetMapping("/workshops/{id}")
Workshop one(@PathVariable long id) { return service.get(id); }
```

A client sends `GET /workshops/abc`.

Each annotation reads a different part of the request:

- `@PathVariable` reads a named `{segment}` from the path.
- `@RequestParam` reads a query parameter. It is required by default, and `required = false` or `defaultValue` relaxes that.
- `@RequestBody` converts the JSON body to a Java type.

```
GET /workshops/7/seats?min=2&sort=name
POST /workshops  {"title":"Intro"}
```

Use the path to identify a resource, the query string to filter, sort or page what you get back, and the body for structured data the client sends to create or change something.

A GET normally carries no meaningful body, so put its inputs in the path and query. Secrets do not belong in URLs at all, because URLs reach logs and browser history.

A handler declares `@RequestParam int min`. A client calls `GET /workshops/7/seats` with no query string.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@PathVariable`, `@RequestParam` and `@RequestBody` each read a different part of the request.
- A failed conversion or a missing required parameter returns 400.
- Path for identity, query for refinement, body for structured data.

## Cheat sheet

Where to act: Start with the `___` in the first signature.

Next step: Each placeholder is one whole annotated parameter. Look at the example request to see where each value lives.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Compare `min` and `sort` in the task.

Next step: One of them must not fail when absent, so it needs a different attribute.

Printed alternative: Replace each placeholder with an annotated parameter: `id` from the path, `min` and optional `sort` from the query string, and `seat` from the body. Starter file: `SeatController.java`.

Where to act: Read each row and ask what the value does.

Next step: Does it identify one thing, refine a list or carry new data?

- Optional: `@RequestParam(required = false)` or `@RequestParam(defaultValue = "1")`.
- Never put secrets in URLs.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html
- https://www.rfc-editor.org/rfc/rfc9110.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** Spring does not substitute a default for a value it cannot convert.
- **B. Correct answer:** Right. A failed type conversion on a path variable is a client error.
- **C. Not this one:** The path pattern matches any segment. Conversion happens after matching.
- **D. Not this one:** The handler never runs. Spring treats this as a bad request.

### terminal

**Printed alternative:** Replace each placeholder with an annotated parameter: `id` from the path, `min` and optional `sort` from the query string, and `seat` from the body. Starter file: `SeatController.java`.

### drag

**Answer and reason for each row**

- **The id of the workshop being fetched: Path.** The id identifies one resource.
- **A page number for a listing: Query string.** It refines what the listing returns.
- **Title and capacity for a new workshop: Body.** It is structured data the client sends to create something.
- **A filter that returns only open workshops: Query string.** Optional filters belong in the query string.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@RequestParam` is required by default.
- **B. Not this one:** An `int` cannot be left absent, and Spring does not pick 0. Use `defaultValue` if a default is what you want.
- **C. Not this one:** The mapping matched. Query parameter binding fails after matching.
- **D. Not this one:** Status 204 means success with no body. This request failed.
