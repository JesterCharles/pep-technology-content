# Routes and handlers in Javalin

## Objectives

- Trace which registered route and handler a request reaches, and select the Context call that reads a path parameter, a query parameter or a JSON body
- Write and register a GET or POST handler that sets the status and returns JSON, and pass its public check in the required guided local run
- Map an exception to a status code and JSON body with an exception handler, and pass its public check in the required guided local run

## Teaching

This Javalin app registers two routes. Predict before any explanation.

```
var app = Javalin.create(config -> {
    config.routes.get("/books", ctx -> ctx.result("All books"));
    config.routes.get("/books/{id}", ctx ->
        ctx.result("Book " + ctx.pathParam("id")));
}).start(7070);
```

A browser sends `GET /books/7?format=short`.

Javalin 7 registers routes inside `Javalin.create(config -> { ... })` with `config.routes.get`, `post`, `put` or `delete`. A `{name}` path segment matches one request segment.

- `ctx.pathParam("id")`: the value of `{id}`, as a `String`.
- `ctx.queryParam("sort")`: the value after `sort=` in the query, or `null` if it is missing.
- `ctx.bodyAsClass(Book.class)`: the JSON request body turned into a `Book` by Javalin's JSON mapper.

A handler answers through `ctx`. `ctx.status(201)` sets the status code; unset, it is 200. `ctx.json(value)` turns a record, list or `Map` into JSON and sets a JSON content type. Use a block `ctx -> { ... }` for several statements.

```
config.routes.get("/books/{id}", ctx -> {
    Book book = books.find(ctx.pathParam("id"));
    ctx.status(200);
    ctx.json(book);
});
```

When a handler throws, Javalin runs the most specific exception handler registered for that exception's class or a superclass. It receives the exception and the Context, so it can set the status and body. If none matches, Javalin answers 500 with the text `Server Error`.

```
config.routes.exception(IllegalStateException.class, (e, ctx) -> {
    ctx.status(409);
    ctx.result("Conflict: " + e.getMessage());
});
```

`ctx.json(Map.of("count", 2))` sends the JSON object `{"count":2}`.

### Guided local run (required)

The editors above simulate Javalin. Now do both tasks with the real JDK 25 and Javalin, in this topic's coding lab:

1. In the lab's `starter` folder, run `mvn -q dependency:go-offline` once, online.
2. Do Tasks 1 and 2 of its `README.md`.
3. Run `mvn -q -o test`. You pass the public checks when it prints nothing and exits 0.

A request first needs a matching route. Only a matched handler runs, and only a thrown exception reaches an exception handler.

Take the finished app from Activity 4: the `GET /books/{id}` route from its starter, plus an exception handler that maps `BookNotFoundException` to 404 with a JSON `error` field.

## Model

The model: a table of routes, each a method, a path pattern and a handler. A request runs the first matching row; its handler reads and answers through `ctx`, the Context.

## Recap

- Routes live in `config.routes`; the first route whose method and path match runs.
- Read with `ctx.pathParam`, `ctx.queryParam`, `ctx.bodyAsClass`; answer with `ctx.status` (200 if unset) and `ctx.json`.
- An exception handler turns a thrown exception into a status and body; the most specific wins, and none means 500.

Next topic: Lambdas as handlers: shorthand for functional interfaces

## Cheat sheet

Where to act: The request inside the item after Need:.

Next step: Find where the wanted value sits in that request: in a path segment matched by `{...}`, after `?`, or in the body sent with the request.

Where to act: On the comment line inside the config block, below the existing `get` route.

Next step: Copy the shape of the `get` line, but change the method; the handler needs several steps, so give it a block body like the teaching example.

Another hint Another hint, 2 of 3 for Activity 3

Where to act: The first statement inside your block.

Next step: The new book arrives as JSON in the request body; store the Context call from Activity 2 that turns the body into a `Book` in a variable.

Another hint Another hint, 3 of 3 for Activity 3

Where to act: The statements after that variable.

Next step: The book from the body has id 0; `books.save` returns a copy with the new id. Keep that returned book in a second variable, and use it, not the first, in the JSON answer after setting the status.

A shop assistant who cannot find an item on the shelf does not walk off silently. They call the help desk, and the help desk knows what to tell the customer for each kind of problem: out of stock, wrong aisle, damaged box. A problem nobody planned for still gets an apology, just a vague one.

The help desk plays the exception handler; the vague apology is the server-error answer for problems with no handler.

Where to act: On the comment line inside the config block.

Next step: Start from the shape of the teaching example: change the exception class to the one `books.find` throws, and the status to the code for a missing resource.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The line that sets the body in your exception handler.

Next step: The body must be JSON, not text: build a map with one entry, key `"error"` and the exception's message as the value, and send it with the Context method that writes JSON.

Optional time: about 5 minutes, in addition to this topic's time.

On paper, or in any Javalin 7 project you already use, write a `GET /search` route that reads a `title` query parameter and answers with a JSON object holding that title, such as `{"title":"Dune"}` for `GET /search?title=Dune`. Then answer one question: what does your handler send when the request has no `title` parameter at all?

Success criteria: your route uses the Context call for query parameters, and you can say what value that call gives for a missing parameter and why the response then needs care.

|  |  |
| --- | --- |
| Register | `config.routes.put("/books/{id}", ctx -> { ... });` |
| Path / query | `ctx.pathParam("id")`, `ctx.queryParam("sort")` |
| JSON body in | `ctx.bodyAsClass(Book.class)` |
| Answer | `ctx.status(201)`, `ctx.json(value)` |
| Exceptions | `config.routes.exception(X.class, (e, ctx) -> { ... });` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Javalin 7.2.3 on Java 25. The practice editors simulate Javalin; they do not run it. Links open outside this lesson.

- Javalin documentation: Getting started (routes in `config.routes`), Handlers, Context, Exception mapping, Default responses, HttpConfig (`prefer405over404`).
- Javalin 7.2.3 Javadoc: Handler and ExceptionHandler.
- Javalin 7.2.3 source: ExceptionMapper: an exception with no matching handler becomes a 500 response.
- RFC 9110, HTTP Semantics, section 15: 200, 201, 404 and 500.

## Static interaction alternatives

### predict

Prediction (practice, not scored): with routes GET /books and GET /books/{id}, the request GET /books/7?format=short gets the body Book 7. Wrong: All books (the path has a second segment, so /books does not match); Book {id} (the braces name the parameter; pathParam returns the value from the request); Book 7?format=short (the query is not part of the path, so it is not in the path parameter).

### drag

Context sorting activity. Route GET /books/{id}, request GET /books/7, the value 7: ctx.pathParam("id"). Route GET /books, request GET /books?sort=year, the value year: ctx.queryParam("sort"). Route POST /books, request with a JSON book in its body, the new book: ctx.bodyAsClass(Book.class). Route GET /authors/{name}/books, request GET /authors/ana/books, the value ana: ctx.pathParam("name").

### explore

Java editor for a Javalin 7 app. The starter registers GET /books, which answers with books.all() as JSON; the store holds 1 Good Omens and 2 Small Gods. The learner registers a POST /books handler. Run sends POST /books with body {"title":"Dune","year":1965} and then GET /books. Success: POST answers 201 Created with JSON for the saved book, id 3, and GET lists Dune after the two starting books. Status 200 means the status was never set; id 0 means the answer used the book read from the body instead of the one save returned; text/plain means result was used instead of json; 404 means no POST /books route matched.

### explore

Java editor for a Javalin 7 app. The starter registers GET /books/{id}, which answers with books.find(id) as JSON; books.find throws BookNotFoundException with the message No book with id 99 when the book is missing. The learner adds an exception handler. Run sends GET /books/1 and GET /books/99. Success: GET /books/1 answers 200 with Good Omens as JSON, and GET /books/99 answers 404 with a JSON object whose error field holds No book with id 99. Without a matching exception handler, Javalin answers 500 Internal Server Error.

### mcq

Apply question: with a GET /books/{id} route that calls books.find, and an exception handler for BookNotFoundException that sets 404 and a JSON error, the request GET /books/99 matches the route, books.find throws BookNotFoundException, and that handler answers 404 with the JSON object {"error":"No book with id 99"}. Wrong: 500 (a matching exception handler exists, so Javalin does not fall back to 500); 200 with an empty body (the exception stops the handler, and a handler sets the status); 404 with Javalin's default not-found body (the route did match). Retry form: GET /authors/3 matches no route, so no handler or exception handler runs and Javalin answers 404 with its default not-found response.
