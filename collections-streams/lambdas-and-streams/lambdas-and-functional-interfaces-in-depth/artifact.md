# Lambdas and functional interfaces in depth

## Objectives

- Write lambdas for Predicate, Function, Consumer and Supplier, and combine them with and, negate and andThen open
- Explain what makes an interface functional (exactly one abstract method) and what the @FunctionalInterface annotation makes the compiler check open
- Explain why a lambda can use only effectively final local variables, and fix code that breaks this rule open

## Teaching

A method needs a rule that receives a name and answers true or false. Predict which standard functional interface fits.

A lambda supplies the body of a functional interface's one abstract method. `Predicate<T>` tests a T; `Function<T, R>` turns a T into an R; `Consumer<T>` uses a T and returns nothing; `Supplier<T>` produces a T. Default methods combine lambdas: `p.and(q)` needs both tests, `p.negate()` reverses one, and `f.andThen(g)` applies g to f's result.

An interface is functional when it has exactly one abstract method. Default and static methods do not count, nor does an abstract method matching a public `Object` method such as `equals(Object)`. The optional `@FunctionalInterface` annotation makes the compiler report an error when the rule fails.

A lambda may use an outside local variable only if it is final or effectively final: never reassigned. A changing variable would make the lambda's view unpredictable, especially if it runs later or on another thread, so the compiler rejects it. Set the value once, before the lambda.

## Recap

- Lambdas target one-abstract-method interfaces; @FunctionalInterface checks that.
- and, negate and andThen combine lambdas.
- Captured locals must be effectively final.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

Think of each interface as a labeled socket. A lambda is a plug whose input and output shape must fit; the label says whether the job tests, transforms, uses or supplies a value. Joining plugs makes a longer route without changing either socket.

Where to act: write one declaration under each numbered comment and keep the given names unchanged.

Another hint Hint 2 of 2

How to combine: negate the rule that must be reversed, then join the two predicates with and. Pass andThen a function from a String to its length.

Count: count only abstract methods: no body, not default, not static.

Another hint Hint 2 of 2

One exception: skip an abstract method that matches a public Object method, such as equals(Object). Exactly one left compiles.

Find the cause: the error points at the lambda, but the cause is the later line that changes limit.

Another hint Hint 2 of 2

Set it once: initialize limit with the value the predicate needs and delete the later assignment.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- FunctionalInterface annotation
- java.util.function package
- Predicate (and, negate)
- Function (andThen)
- JLS 15.27 lambda expressions
- JLS 4.12.4 effectively final variables

## Static interaction alternatives

### predict

Choose one interface for a rule that receives a name and answers true or false, then read the explanation printed under every option.

### terminal

Starter: hasText, isBlocked and clean lambdas and an empty audit list. Write allowed (hasText and not isBlocked, using and and negate), cleanLength (clean, then length, using andThen), log (a Consumer that adds to audit) and guest (a Supplier of "guest"). Check each against the success list.

### mcq

Pair: two abstract methods. Compiles or compile error?

### mcq

Area: abstract area, an abstract equals(Object) and a default isEmpty. Compiles or compile error?

### terminal

Starter: limit is 5, the predicate over captures limit, then limit is set to 10, which Java rejects. Rewrite it so the threshold is 10, over.test(11) is true and over.test(10) is false.

### mcq

Choose why Java rejects the starter, record confidence, then compare the explanation printed under every option.
