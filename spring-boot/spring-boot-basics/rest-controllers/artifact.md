# REST controllers

## Objectives

- Write a @RestController with @GetMapping and @PostMapping methods that return Java records serialized as JSON
- Map a Javalin route and handler from Java Foundations to the equivalent Spring MVC controller method and request mapping
- Send requests to a running controller with curl and match each response to the handler method that produced it

## Teaching

Your Javalin app has `app.get("/workshops", ctx -> ctx.json(service.all()))`. You write this Spring class instead:

```
@RestController
class WorkshopController {
  private final WorkshopService service;
  WorkshopController(WorkshopService service) { this.service = service; }

  @GetMapping("/workshops")
  List<Workshop> all() { return service.all(); }
}
```

`@RestController` means every handler writes its return value to the response body. `@GetMapping` and `@PostMapping` map a path and an HTTP method to a Java method.

A Java record makes a concise response shape, and Spring serializes its components to JSON fields.

```
record Workshop(long id, String title) {}
```

Compared with Javalin: the route path moves into an annotation, the handler becomes a method, and `ctx.json(value)` becomes `return value`.

A request reaches a handler by method plus path. The same path can have a GET and a POST with different methods.

```
curl localhost:8080/workshops
curl -X POST localhost:8080/workshops \
  -H "Content-Type: application/json" \
  -d '{"id":2,"title":"Advanced"}'
```

A plain URL sends GET. Adding `-d` (`--data`) sends POST unless you choose another method, so `-X POST` is optional here. Without the JSON content type, the body is not treated as JSON.

You port `app.post("/items", ctx -> ctx.json(service.add(ctx.bodyAsClass(Item.class))))` from Javalin to Spring.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@RestController` plus mapping annotations connect requests to methods.
- Return values become JSON; records are a concise response shape.
- A path and an HTTP method together select the handler.

## Cheat sheet

Where to act: Start above the class, then fill the two TODO comments in order.

Next step: Name the annotation that makes return values become the response body.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside the class, write the GET method first.

Next step: The POST parameter needs an annotation that says it is read from the JSON body.

Printed alternative: Declare the Booking record with its two components, add the class annotation, a GET mapping that returns the list and a POST mapping that reads a Booking from the request body. Starter file: `BookingController.java`.

Where to act: Use the command box under the log.

Next step: Your first command needs no method flag; the second needs a method, a content type and a body.

Printed alternative: Run the GET and see the JSON list, then run the POST with its content type and JSON body and see the created workshop.

- `ctx.pathParam` maps to `@PathVariable`; `ctx.queryParam` to `@RequestParam`; `ctx.bodyAsClass` to `@RequestBody`.
- A normal return defaults to 200.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/guides/gs/rest-service/
- https://docs.spring.io/spring-boot/reference/web/servlet.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html
- https://javalin.io/documentation
- https://docs.spring.io/spring-boot/reference/features/json.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** A `@RestController` writes the return value to the response body. It does not choose a view.
- **B. Correct answer:** Right. The return value is serialized to JSON, and a normal return defaults to 200.
- **C. Not this one:** Spring writes the returned value for you. There is no context object to call.
- **D. Not this one:** Spring registers annotated handler methods during startup.

### terminal

**Printed alternative:** Declare the Booking record with its two components, add the class annotation, a GET mapping that returns the list and a POST mapping that reads a Booking from the request body. Starter file: `BookingController.java`.

### terminal

**Printed alternative:** Run the GET and see the JSON list, then run the POST with its content type and JSON body and see the created workshop.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The annotation maps the route, `@RequestBody` replaces `bodyAsClass` and `return` replaces `ctx.json`.
- **B. Not this one:** The HTTP method must stay POST, and no annotation here reads the JSON body.
- **C. Not this one:** `Context` is a Javalin type, so this method is not the Spring approach.
- **D. Not this one:** These two annotations have swapped roles.
