# Functional interfaces and anonymous classes

## Objectives

- Recognize a functional interface as an interface with exactly one abstract method
- Implement an interface inline with an anonymous class
- Use a standard functional interface such as Predicate, Function or Supplier

## Teaching

`@FunctionalInterface` asks the compiler to check an interface. This one declares two abstract methods. Predict before any explanation.

```
@FunctionalInterface
interface Shout {
    String loud(String s);
    String quiet(String s);
}
```

A functional interface has exactly one abstract method; default and static methods do not count. `java.util.function` provides standard ones: `Supplier<T>` with `T get()`, `Predicate<T>` with `boolean test(T t)`, and `Function<T, R>` with `R apply(T t)`.

An anonymous class implements an interface on the spot: `new Supplier<String>() { ... };` followed by the method body inside the braces. The method must be `public`, and the whole expression ends with `;`. Later, lambdas give a shorter form for the same idea.

```
// java.util.function.Supplier<T>
public interface Supplier<T> {
    T get();
}
```

Count only abstract methods. Default and static methods have bodies, so they never count. A method that matches a public method of `Object`, such as `boolean equals(Object o)`, does not count either, because every class already has it. Abstract methods inherited from another interface do count.

Match the shape of the job: something that answers yes or no about a value is a `Predicate`, something that turns one value into another is a `Function`, and something that produces a value from nothing is a `Supplier`.

## Model

The model: an anonymous class is a one-off class written where it is used. It implements an interface and creates its single object in one expression.

## Recap

- A functional interface has exactly one abstract method; defaults, statics and `Object`'s public methods do not count.
- `@FunctionalInterface` asks the compiler to check that rule.
- An anonymous class implements an interface inline: `new Supplier<String>() { public String get() { ... } };`.
- Standard shapes: `Predicate<T>` tests, `Function<T, R>` converts, `Supplier<T>` produces.

Next topic: Reading: records

## Cheat sheet

A wedding needs one extra waiter for a single evening. Instead of hiring and naming a permanent employee, the caterer sends someone who learns just one instruction at the door, serves the cake, and is never on the staff list.

An anonymous class is that one-evening helper: an unnamed class created once, right where its single job is needed.

Where to act: The word `null` after `status =`.

Next step: Start the anonymous class the way the teaching shows: `new`, the interface with its type argument, empty parentheses, then an opening brace. The statement still needs to end with `;` after the closing brace.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Between the braces of your anonymous class.

Next step: Declare the one abstract method of `Supplier<String>`: `public`, returning `String`, named as in the interface, with no parameters, and return the text the target output shows.

Where to act: The interface shown after Interface:, above the two buttons.

Next step: Cross out every method with a body and every method that `Object` already provides, add any abstract method inherited with `extends`, then count what is left: exactly one means functional.

Optional time: about 4 minutes, in addition to this topic's time.

Write a `Predicate<String>` as an anonymous class that tests whether a word is longer than 4 characters, and call its `test` method on `"tree"` and `"elephant"` in any Java 25 setup you already use.

Success criteria: it prints `false`, then `true`, and you can name the one abstract method you implemented.

|  |  |
| --- | --- |
| Functional interface | exactly one abstract method |
| Anonymous class | `new Supplier<String>() { public String get() { return "Ready"; } };` |
| Predicate | `boolean test(T t)` |
| Function | `R apply(T t)` |
| Supplier | `T get()` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Using Functional Interfaces: functional interfaces and the java.util.function package.
- Dev.java: Nested Classes: anonymous classes.
- FunctionalInterface (Java SE 25 API): the annotation and the compiler check.
- java.util.function (Java SE 25 API): `Predicate`, `Function`, `Supplier`.
- JLS 25, chapter 9: Interfaces: 9.8 Functional Interfaces, including methods of `Object`.
- JLS 25, chapter 15: Expressions: 15.9.5 Anonymous Class Declarations.

## Static interaction alternatives

### predict

Prediction (practice, not scored): an interface marked @FunctionalInterface declares two abstract methods, loud and quiet. It does not compile, because a functional interface must have exactly one abstract method. Wrong: it compiles because the annotation is documentation (the compiler checks it); it compiles with a warning (it is an error); only loud counts (both are abstract).

### explore

Java editor: replace null in Supplier<String> status = null; with an anonymous class implementing Supplier<String> whose get() returns Ready. The program then prints status.get(); the target output is Ready. The starter compiles but stops with a NullPointerException, because status is null. A get() method without public does not compile: it would weaken the interface method's public access. An anonymous class without get() does not compile: it does not override the abstract method get().

### drag

Sorting activity. interface Check { boolean test(String s); }: functional. interface Pair { int first(); int second(); }: not functional, two abstract methods. interface Named { String name(); default String hello() { ... } }: functional, the default does not count. interface Rule { boolean ok(int x); boolean equals(Object o); }: functional, equals matches Object's public method. interface Marker { }: not functional, no abstract method. interface Task extends Runnable { }: functional, it inherits run().

### mcq

Apply question: an object that receives an Order and answers true or false is a Predicate<Order>, whose test method returns boolean. Wrong: Function<Order, String> (returns a String, not a yes or no); Supplier<Order> (takes nothing and produces an Order); Runnable (takes nothing and returns nothing). Retry: receiving a String and returning its length as an Integer is a Function<String, Integer>.
