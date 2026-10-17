# Java review: core language, HTTP with Javalin, testing

## Objectives

- Retrieve core language rules for types, control flow, methods and classes to predict a program's output
- Trace a Javalin request through route, handler and status code
- Choose the right assertion or test double for a unit test

## Teaching

### Activity 1 of 3: Predict a program’s output

Start by retrieving what you already know. Read this complete program, then predict its three lines of output before checking. It touches types, a loop, a method and two ways to compare strings.

```
public class Main {
    static int countOdd(int limit) {
        int n = 0;
        for (int i = 0; i < limit; i++) {
            if (i % 2 == 1) {
                n++;
            }
        }
        return n;
    }

    public static void main(String[] args) {
        String a = "pep";
        String b = new String("pep");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(countOdd(5) / 2);
    }
}
```

### Activity 2 of 3: Trace a request through route, handler and status

In Javalin 7 you register routes inside `config.routes` when you create the app. A route pairs an HTTP method and a path with a handler, a lambda that receives a `Context` named `ctx`.

When a request arrives, Javalin finds the endpoint whose method and path match. `{id}` matches one path segment, and `ctx.pathParam("id")` reads it. The handler builds the response: `ctx.result(...)` sets the body and `ctx.status(201)` sets the status; if it sets none, the status stays 200. If no endpoint and no static file matches, the answer is 404.

The app

```
var app = Javalin.create(config -> {
    config.routes.get("/books/{id}", ctx ->
        ctx.result("Book " + ctx.pathParam("id")));
    config.routes.post("/books", ctx -> {
        ctx.status(201);
        ctx.result("Created");
    });
}).start(7070);
```

### Activity 3 of 3: Choose the assertion and test double

Pick the assertion from the behavior. A returned value: `assertEquals(expected, actual)`. A yes-or-no condition: `assertTrue`. A call that must be refused: `assertThrows(Type.class, () -> call)`.

Pick the double from the dependency. A fixed answer: a stub, or a mock with `when(...).thenReturn(...)`. Data saved and read back: an in-memory fake. An outgoing call you cannot see in a return value: a mock with `verify`.

## Recap

- `==` compares references and `equals` compares content; `int` division drops the fraction; trace loops value by value.
- In Javalin 7, `config.routes` pairs a method and path with a handler; `ctx.pathParam`, `ctx.result` and `ctx.status` read the request and build the response.
- A handler that sets no status answers 200; no matching endpoint answers 404 with the default settings.
- Assert on returned values with `assertEquals`, on conditions with `assertTrue`, on refusals with `assertThrows`; verify only interactions you cannot observe otherwise.

## Cheat sheet

Where to act: The two `String` lines in `main`.

Next step: Decide whether `new String("pep")` gives the same object as the literal, then recall which comparison checks objects and which checks characters.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: The `countOdd` method and the last `println`.

Next step: List the values of `i` that the loop visits for a limit of 5 and count the odd ones; then remember that dividing two `int` values gives an `int`.

Where to act: The method and path menus in the tracer.

Next step: Pick the combination that exactly matches the first route, then the one that matches the second; read which status each handler sets or leaves.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The tracer, for the last status in the list.

Next step: Choose a method and path pair that no route in the app registers, for example the right path with the wrong method, and see what Javalin answers.

Where to act: The `if` inside `discount`.

Next step: Decide what the method does for an unknown code: does it return something to compare, or refuse the call? Then decide what the repository must answer for that path to run.

```
// core language
"pep" == new String("pep")      // false: different objects
"pep".equals(new String("pep")) // true: same characters
7 / 2                           // 3: int division

// Javalin 7
Javalin.create(config -> {
    config.routes.get("/items/{id}", ctx -> ctx.result(ctx.pathParam("id")));
    config.routes.post("/items", ctx -> ctx.status(201));
}).start(7070);

// tests
assertEquals(expected, actual);
assertThrows(IllegalArgumentException.class, () -> call());
when(repo.find("A")).thenReturn(item);
verify(mailer).send("to@example.com", "text");
```

Claims on this page were checked against these official sources, retrieved 2026-10-16 (Javalin 7.2.3, JUnit 6.1.3, Mockito 5.24.0). The request tracer follows only the two routes shown; it is not Javalin.

- Java Language Specification, Java SE 25 — reference equality, integer division, for loops and methods
- Java SE 25 API: Object — equals contract and default identity comparison
- Javalin documentation — routes in config.routes, Context pathParam, result and status, 404 when nothing matches, prefer405over404
- JUnit User Guide: Assertions — assertEquals, assertTrue and assertThrows
- Mockito 5 API: class Mockito — mock defaults (null for objects), when/thenReturn and verify

## Static interaction alternatives

### predict

Question: What does the program print?. Option A: false, true, 1 - Correct. new String creates a separate object, so ==, which compares references, is false while equals, which compares characters, is true. The loop visits 0 to 4 and counts 1 and 3, so countOdd(5) is 2, and 2 / 2 is 1. Option B: true, true, 1 - Not quite. a == b compares references, and new String("pep") is a different object from the literal, so it prints false. Option C: false, true, 1.5 - Not quite. Both operands of / are int, so the result is an int; also, countOdd(5) is 2, not 3. Option D: false, true, 2 - Not quite. That would need countOdd(5) to be 4 or 5. The loop stops before 5 and counts only 1 and 3, giving 2, and 2 / 2 is 1. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Request tracer for the Javalin app on this page. GET /books/42 matches config.routes.get with path parameter id equal to 42; the handler sets the body Book 42 and no status, so the response is 200 OK. POST /books matches config.routes.post; the handler calls ctx.status(201) and sets the body Created, so the response is 201 Created. GET /books, DELETE /books/42, POST /books/42 and GET or POST /authors/7 match no endpoint, so Javalin answers 404 Not Found by default (prefer405over404 is false). Task: send requests until 200, 201 and 404 have all been seen.

### mcq

Question: Which test body fits?. Option A: CouponRepository coupons = mock(CouponRepository.class); PriceService service = new PriceService(coupons); assertThrows(IllegalArgumentException.class,     () -> service.discount("NOPE")); - Correct. An unstubbed mock returns null for find, which is exactly the unknown-code case, and assertThrows checks that the call is refused. Option B: PriceService service = new PriceService(null); assertEquals(0, service.discount("NOPE")); - Not quite. With no repository, coupons.find throws a NullPointerException; and the method never returns 0 for an unknown code, it throws. Option C: CouponRepository coupons = mock(CouponRepository.class); new PriceService(coupons).discount("NOPE"); verify(coupons).find("NOPE"); - Not quite. The discount line throws before verify runs, so the test errors; and verify would only check the lookup, not the refusal. Option D: CouponRepository coupons = mock(CouponRepository.class); PriceService service = new PriceService(coupons); assertTrue(service.discount("NOPE") < 0); - Not quite. discount throws for an unknown code, so the comparison never runs and the test errors with the exception. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
