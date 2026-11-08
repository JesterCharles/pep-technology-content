# Porting a Javalin route, service and repository to Spring Boot

## Objectives

- Port the Java Foundations Javalin route, service and in-memory repository to a Spring Boot controller, @Service and @Repository with the same JSON responses
- Replace Javalin exception mapping with a Spring handler that returns the same 400 and 404 responses
- Verify the port by running the same requests against both versions and comparing status codes and bodies

## Teaching

Your Java Foundations app has a Javalin route, a service and an in-memory repository, and returns 404 for an unknown id and 400 for a non-numeric one.

```
app.get("/items/{id}", ctx -> {
  ctx.json(service.get(Long.parseLong(ctx.pathParam("id"))));
});
app.exception(ItemNotFound.class, (e, ctx) -> ctx.status(404).json(new Err(e.getMessage())));
app.exception(NumberFormatException.class, (e, ctx) -> ctx.status(400).json(new Err("id must be a number")));
```

You port it to Spring Boot.

Port from the outside in. Each Javalin piece has a Spring home:

| Javalin | Spring Boot |
| --- | --- |
| `app.get(path, handler)` | `@GetMapping` on a method in a `@RestController` |
| `ctx.pathParam("id")` | `@PathVariable long id` |
| `ctx.json(value)` | `return value;` |
| `new Service(new Repo())` in `main` | `@Service` and `@Repository` with constructor injection |
| `app.exception(...)` | `@ExceptionHandler` |

The service and repository method bodies stay as they were. Each exception mapping becomes a handler method in the controller:

```
@ExceptionHandler(ItemNotFound.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
Err notFound(ItemNotFound e) { return new Err(e.getMessage()); }
```

A non-numeric id fails path-variable conversion with `MethodArgumentTypeMismatchException`, which a 400 handler catches. Handlers in a controller cover only that controller.

A port is only finished when clients see the same responses, including the error responses your handlers now produce.

To verify, send the same request to both versions and compare the status code and JSON body, not just whether something came back.

After your port, a missing item returns status 200 with `{"error":"item 99 not found"}`. The old version returned 404 with the same body.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- The web edge moves to annotations; the service and repository logic stays.
- `app.exception` becomes `@ExceptionHandler` with the same status and body.
- Verify a port by comparing status codes and bodies across both versions.

## Cheat sheet

Where to act: Start with the repository and service TODOs, then the route, using the table rows.

Next step: The handler lambda becomes a method. What does a `ctx.json` call become there?

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Look at the parameter of the new method.

Next step: `ctx.pathParam` plus `Long.parseLong` both disappear; which annotation replaces the pair?

Printed alternative: Register the repository and service with constructor injection, port the route to a path-variable method returning the Item, and add 404 and 400 handlers with the same error body. Starter file: `Items.java`.

Where to act: Use the command box under the log.

Next step: Use `curl -i` so you can compare status lines. Run each path against both ports.

Printed alternative: Run curl -i for /items/abc on both ports. Both answer 400 with the same error JSON.

- `ctx.pathParam` to `@PathVariable`, `ctx.json(x)` to `return x`, `app.exception` to `@ExceptionHandler`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/guides/gs/rest-service/
- https://docs.spring.io/spring-boot/reference/web/servlet.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html
- https://javalin.io/documentation

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Business logic has no web framework in it, so the web edge is what moves.
- **B. Not this one:** A service is ordinary Java. It gains an annotation and a constructor, not new logic.
- **C. Not this one:** Plain Java classes and records carry over directly.
- **D. Not this one:** Spring does not run Javalin handler lambdas. The routes must be rewritten.

### terminal

**Printed alternative:** Register the repository and service with constructor injection, port the route to a path-variable method returning the Item, and add 404 and 400 handlers with the same error body. Starter file: `Items.java`.

### terminal

**Printed alternative:** Run curl -i for /items/abc on both ports. Both answer 400 with the same error JSON.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The status code is part of the contract. Add the not-found status to the handler.
- **B. Not this one:** Many clients branch on status first, so they would treat this as success.
- **C. Not this one:** A handler chooses its status with `@ResponseStatus` or `ResponseEntity`.
- **D. Not this one:** You can return any body. Keeping it the same is the goal of this port.
