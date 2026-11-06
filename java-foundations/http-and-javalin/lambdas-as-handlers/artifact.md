# Lambdas as handlers: shorthand for functional interfaces

## Objectives

- Rewrite an anonymous class handler as a lambda
- Explain that a lambda implements the single abstract method of a functional interface
- Replace a simple lambda with a method reference

## Teaching

Javalin's `Handler` is an interface. Two ways to register `GET /ping`; predict before any explanation.

```
// A: an anonymous class
config.routes.get("/ping", new Handler() {
    @Override
    public void handle(Context ctx) {
        ctx.result("pong");
    }
});
// B: a lambda
config.routes.get("/ping", ctx -> ctx.result("pong"));
```

To rewrite an anonymous class as a lambda, keep only the parameter name and the body of the one method. The compiler already knows the rest from the interface: `new Handler()`, `@Override`, `public void handle` and the parameter's type.

```
// anonymous class: new Runnable() { public void run() { tick(); } }
Runnable r = () -> tick();         // no parameters: ()
Comparator<String> c = (a, b) -> a.length() - b.length();
Consumer<String> p = s -> { log(s); save(s); };  // several statements: { }
```

A lambda can only stand where Java expects a functional interface: an interface with exactly one abstract method. The lambda is that method's implementation; its parameters match the method's parameters and its body becomes the method's body.

Default and static methods do not count, because they already have bodies. Neither does an abstract method that matches a public method of `Object`, such as `equals`, because every object already has one. `@FunctionalInterface` is an optional annotation that makes the compiler check the rule. Javalin's `Handler` (one method, `handle(Context)`) and `ExceptionHandler` (one method, `handle(exception, ctx)`) are functional interfaces, which is why you register lambdas.

When a lambda does nothing but call one existing method with its own parameters, you can write a method reference instead: the class (or object), `::`, and the method name, with no parentheses and no arguments. It refers to the method without calling it; Javalin calls it later, once per request.

```
Consumer<String> p = s -> Logbook.write(s);
Consumer<String> q = Logbook::write;   // same behaviour
```

An exception handler lambda has two parameters because `ExceptionHandler`'s one abstract method takes two: the exception and the Context.

## Model

The model: `Handler` is a contract with exactly one empty slot, `handle(Context ctx)`. An anonymous class fills the slot with a lot of ceremony; a lambda fills the same slot with only the parameter and the body.

## Recap

- A functional interface has exactly one abstract method; default methods, static methods and public `Object` methods such as `equals` do not count.
- A lambda implements that one method: its parameters are the method's parameters and its body is the method's body.
- Anonymous class to lambda: keep the parameter names and the body.
- A lambda that only calls one existing method with its own parameters can become a method reference, `ClassName::method`.

Next topic: Project: repository, wiring and errors

## Cheat sheet

Where to act: The second argument of `config.routes.get`, from `new Handler()` to its closing `}`.

Next step: Find the two parts a lambda keeps: the parameter name of `handle`, and the single statement inside it.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The same second argument, after you delete the class lines.

Next step: Join the parameter name and the statement with an arrow. With one statement, drop its semicolon and braces; the route call still needs its own closing `);`.

Where to act: The type shown after Type:.

Next step: Check that it is an interface, then count only the methods with no body that are not also methods every `Object` has. A lambda target ends with a count of exactly one.

A market stall has a sign for refunds. One stall copies the whole refund procedure onto the sign, step by step. Another sign just says "Ask Sam about refunds", because Sam already knows the procedure. Both get the customer the same refund; the second sign is shorter and stays right if Sam's procedure changes.

Pointing to Sam is a method reference; copying the steps onto the sign is writing the work inline.

Where to act: The second argument of each `config.routes.get` call, from `ctx` up to the closing parenthesis of the inner call.

Next step: Keep the class name and the method name; between them, the dot becomes `::`, and the lambda parameter, the arrow and the argument list all disappear.

Optional time: about 4 minutes, in addition to this topic's time.

On paper, take the anonymous class from Activity 1 and write it three ways: as a lambda with a block body, as a lambda with an expression body, and as a method reference to a static method `Greetings.ping(Context ctx)` that you also write. Then name the one abstract method that all three implement.

Success criteria: all three forms register the same `GET /ping` behaviour, and you name `Handler.handle(Context)` as the method each one implements.

|  |  |
| --- | --- |
| No parameters | `() -> tick()` |
| One parameter | `ctx -> ctx.result("Hi")` |
| Two parameters | `(e, ctx) -> ctx.status(404)` |
| Several statements | `ctx -> { ...; ...; }` |
| Method reference | `Logbook::write` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25 and Javalin 7.2.3. The practice editors simulate Javalin; they do not run it. Links open outside this lesson.

- Java Language Specification SE 25, section 9.8 Functional Interfaces.
- Java Language Specification SE 25, sections 15.27 Lambda Expressions and 15.13 Method Reference Expressions.
- Dev.java: Writing your first lambda expression.
- Dev.java: Writing lambda expressions as method references.
- Javalin documentation: Handlers, Exception mapping, Handler groups (method references to controller methods).
- Javalin 7.2.3 Javadoc: Handler and ExceptionHandler.

## Static interaction alternatives

### predict

Prediction (practice, not scored): A registers an anonymous class that implements Handler; B registers a lambda. Both compile and answer GET /ping with pong (correct: the lambda supplies the body of Handler's one abstract method, handle). Wrong: B does not compile because Handler is an interface (a lambda may implement an interface that has one abstract method); B compiles but Javalin cannot call it because it has no handle method (the lambda is the handle method); only A works because @Override is required (@Override is an optional check).

### explore

Java editor for a Javalin 7 app. The starter registers GET /hello with an anonymous Handler class whose handle method calls ctx.result with Hello, Javalin. The learner rewrites the handler as a lambda. Run sends GET /hello and checks two things: the answer is still 200 with the text Hello, Javalin, and the handler is now a lambda rather than an anonymous class.

### drag

Functional interface sorting activity. A lambda can implement: interface Handler { void handle(Context ctx); } (one abstract method); interface Greeter { String greet(String name); default String hello() { return greet("you"); } } (the default method has a body); interface Checker { boolean test(String s); boolean equals(Object o); } (equals matches a public method of Object, so it does not count). Not a lambda target: interface Shape { double area(); double perimeter(); } (two abstract methods); abstract class Task { abstract void run(); } (a class, not an interface).

### explore

Java editor for a Javalin 7 app. The starter registers GET /books with the lambda ctx -> BookController.listBooks(ctx) and GET /books/{id} with the lambda ctx -> BookController.getBook(ctx). The learner replaces both lambdas with method references to the same methods. Run sends GET /books and GET /books/2 and checks that both answer as before, 200 with both books and 200 with Small Gods, and that both handlers are now method references.

### mcq

Apply question: ctx -> BookController.deleteBook(ctx) becomes BookController::deleteBook. Wrong: BookController.deleteBook(ctx) (that calls the method now, while registering, and passes its result, which is nothing); BookController::deleteBook(ctx) (a method reference has no argument list); ctx::deleteBook (deleteBook belongs to BookController, not to the Context). Retry form: (e, ctx) -> ErrorPages.notFound(e, ctx) becomes ErrorPages::notFound; both parameters are passed along in the same order.
