# Response codes with ResponseEntity

## Objectives

- Return 200, 201 with a Location header, 204 and 404 from handler methods with ResponseEntity
- Choose the status code for a described outcome (created, found, not found, no content, invalid input) by its HTTP meaning
- Predict the status, headers and body a client receives from a given ResponseEntity expression

## Teaching

This handler creates a workshop:

```
@PostMapping("/workshops")
Workshop create(@RequestBody NewWorkshop body) {
  return service.create(body);
}
```

`ResponseEntity` lets a handler control status, headers and body together.

```
ResponseEntity.ok(body)            // 200
ResponseEntity.created(uri).body(b) // 201 + Location
ResponseEntity.noContent().build()  // 204
ResponseEntity.notFound().build()   // 404
```

A `Location` header on 201 tells the client where the new resource lives. Build it from the new id, for example `URI.create("/workshops/" + saved.id())`.

Pick the status from what happened, not from what is convenient:

| Outcome | Status |
| --- | --- |
| Found and returned | 200 |
| Created | 201 with `Location` |
| Succeeded, nothing to return | 204 |
| Client sent invalid input | 400 |
| Resource does not exist | 404 |

A 200 whose body says `error` hides failure from clients, proxies and monitoring. Let the status carry the outcome.

A handler runs: `return ResponseEntity.status(HttpStatus.ACCEPTED).header("X-Queue", "bulk").body("queued");`

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- A plain return defaults to 200; use `ResponseEntity` to vary status and headers.
- 201 pairs with `Location`; 204 and 404 usually use `.build()` with no body.
- Let the status code carry the outcome.

## Cheat sheet

Where to act: Start at the `___` in `create`.

Next step: Which factory on `ResponseEntity` takes a URI? It still needs a body after that.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Move on to `remove`.

Next step: Both branches return no body, so each factory needs a call that finishes the response.

Printed alternative: Replace each placeholder with a `ResponseEntity` expression: 404 when nothing was found and 200 with the found workshop, 201 with the location and body, 204 for a delete that succeeded, and 404 for one that found nothing. Starter file: `WorkshopController.java`.

Where to act: Compare each row with the table in the teaching panel.

Next step: Ask who needs to act next: a success, a client mistake or a missing resource.

- `created(uri).body(x)`, `ok(x)`, `noContent().build()`, `notFound().build()`, `status(s).body(x)`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responseentity.html
- https://www.rfc-editor.org/rfc/rfc9110.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** Spring cannot tell that the method created something. A plain return defaults to 200.
- **B. Correct answer:** Right. To return 201 and a `Location` header, you must say so.
- **C. Not this one:** 204 means no content. This method returns a body, and POST has no special default.
- **D. Not this one:** Nothing in this code makes the work asynchronous.

### terminal

**Printed alternative:** Replace each placeholder with a `ResponseEntity` expression: 404 when nothing was found and 200 with the found workshop, 201 with the location and body, 204 for a delete that succeeded, and 404 for one that found nothing. Starter file: `WorkshopController.java`.

### drag

**Answer and reason for each row**

- **A listing returns workshops: 200.** The request succeeded and the body holds the result.
- **A new booking was stored: 201.** Something was created.
- **A delete succeeded: 204.** It succeeded and there is nothing to send back.
- **The body has a negative capacity: 400.** The client sent invalid input.
- **No workshop has that id: 404.** The resource does not exist.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Each builder call sets one part of the response.
- **B. Not this one:** The status was set explicitly first, and `.body` does not reset it.
- **C. Not this one:** A builder can chain headers and then a body.
- **D. Not this one:** Custom headers are sent to the client.
