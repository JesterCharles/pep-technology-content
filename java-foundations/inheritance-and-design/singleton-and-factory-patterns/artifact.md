# Reading: singleton and factory patterns

## Objectives

- Recognize a singleton and explain the risk of hidden global state
- Recognize a static factory method and explain what it hides from the caller
- Decide when passing a dependency in is simpler than using a singleton

## Teaching

Two unrelated parts of a program each ask `Counter` for its instance and call `next()`. Predict before any explanation.

```
class Counter {
    private static final Counter INSTANCE = new Counter();
    private int count;
    private Counter() { }
    static Counter getInstance() { return INSTANCE; }
    int next() { return ++count; }
}
// in main:
// part one of the program:
int a = Counter.getInstance().next();
// part two:
int b = Counter.getInstance().next();
System.out.println(a + " " + b);
```

A singleton allows exactly one instance: a `private` constructor, a `static final` field holding the instance, and a static method such as `getInstance()`. An `enum` with one constant is the simplest single-instance form.

A static factory method is a static method that returns an object, such as `List.of(1, 2)`, `Integer.valueOf(42)` or `Money.ofDollars(3)`. Unlike a constructor it has a descriptive name, and it may return a cached object or a subtype without the caller knowing.

```
class Counter {
    private static final Counter INSTANCE = new Counter();
    private int count;
    private Counter() { }
    static Counter getInstance() { return INSTANCE; }
    int next() { return ++count; }
}
```

`Money` stores cents, and its constructor is `private`, so other classes cannot call `new Money(...)` and pass dollars by mistake. A static factory method, declared `static` and returning `Money`, is the public way in.

`Money.ofDollars(3)` says what the number means and hides how the amount is stored. If `Money` later stores its value differently, callers do not change.

A singleton is global state in disguise: any code can reach it, so a change in one place silently affects another, and a test cannot swap it. Passing the object in through a constructor makes the dependency visible and replaceable.

## Model

The model: both patterns take object creation away from `new` at the call site. A singleton always hands back the same object; a factory decides what to hand back.

The model: a factory method is a named doorway. Callers ask for what they mean; the class decides how to build it.

## Recap

- A singleton has a private constructor, one stored instance and a static accessor; a one-constant `enum` is the simplest form.
- A singleton with changing state is hidden global state: one part of a program can silently affect another, and tests cannot swap it.
- A static factory method, such as `List.of` or `Money.ofDollars`, names the creation and hides which object, class or representation the caller gets.
- Passing a dependency in through a constructor is usually simpler than a singleton: it is visible and replaceable.

Next module: Exceptions and Logging

## Cheat sheet

An office has one shared whiteboard in the corridor. Anyone can write on it or wipe it, so a note left on Monday may be gone by Tuesday, and nobody can tell who changed it. Each team's own notebook, handed to whoever needs it, has no such surprises.

A singleton with changing state is the shared whiteboard; passing an object to whoever needs it is the notebook.

Where to act: The code shown after Code:, above the three buttons.

Next step: Look for how the object is obtained: a direct `new` call is neither pattern; a static method returning an object is a factory; a design that only ever allows one instance is a singleton.

Where to act: The comment line between the constructor and `toString()`.

Next step: Declare a method that `main` can call on the class itself, without an object: it needs the keyword `static`, the return type `Money`, the name `ofDollars` and one `long` parameter.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The body of `ofDollars`.

Next step: Inside the class, the private constructor is allowed. Call it with the amount converted from dollars to cents, which is 100 cents per dollar.

Optional time: about 4 minutes, in addition to this topic's time.

Turn `Counter` from activity 1 into an ordinary class with a public constructor, and pass one `Counter` to the two parts that should share it and a separate one to a third part that should not.

Success criteria: the shared parts print `1 2`, the separate part prints `1`, and you can point to the line where each part receives its counter.

|  |  |
| --- | --- |
| Singleton | `private` constructor, `static final INSTANCE`, `getInstance()` |
| Single-instance enum | `enum Registry { INSTANCE; }` |
| Static factory | `static Money ofDollars(long dollars) { return new Money(dollars * 100); }` |
| Library factories | `List.of(...)`, `Integer.valueOf(...)` |
| Instead of a singleton | `new ReportService(database)` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). The risks of singletons and the advice to pass dependencies in are widely taught design practice rather than rules stated in these references; the Java mechanics shown are. Links open outside this lesson.

- Dev.java: Enums: an enum with a single constant as a singleton.
- JLS 25, chapter 8: Classes: 8.8.10 Preventing Instantiation of a Class; 8.9 Enum Classes.
- List (Java SE 25 API): `List.of`, unmodifiable lists from a static factory.
- Integer (Java SE 25 API): `Integer.valueOf(int)` may cache frequently requested values.

## Static interaction alternatives

### predict

Prediction (practice, not scored): Counter keeps one private static final instance and returns it from getInstance(); two parts of the program each call getInstance().next(). It prints 1 2, because both parts share the same object and its count. Wrong: 1 1 (there is only one Counter); 2 2 (a is read before the second call); a compile error (the private constructor is called only inside Counter).

### drag

Sorting activity. A class with a private constructor, a private static final INSTANCE field and static getInstance(): singleton. enum Registry { INSTANCE; }: singleton. List.of(1, 2, 3): static factory method. Integer.valueOf(42): static factory method, which may return a cached object. Money.ofDollars(3): static factory method. new ArrayList<>(): neither, a constructor call. new Greeter(new SystemClock()): neither, a constructor call that passes a dependency in.

### explore

Java editor: Money stores cents and has a private constructor. Add static Money ofDollars(long dollars) that returns a new Money with the dollars converted to cents. main calls Money.ofDollars(3) and prints the result; the target output is 300 cents. The starter does not compile: cannot find symbol, method ofDollars. Without static, main cannot call the method on the class: non-static method cannot be referenced from a static context.

### mcq

Apply question: ReportService calls Database.getInstance(); tests need an in-memory database. Simplest fix: give ReportService a constructor that takes the database and pass an in-memory one in tests. Wrong: a test-only setter on the singleton (hidden global state that must be reset); a second singleton plus an if (more global state); testing against the real database (slow and fragile). Retry: two stores with different tax rates: pass each Checkout its own TaxRates object.
