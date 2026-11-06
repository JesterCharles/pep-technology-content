# Method references

## Objectives

- Rewrite a lambda as each kind of method reference: static (Integer::parseInt), bound instance (System.out::println), unbound instance (String::length) and constructor (ArrayList::new) open
- Decide when a method reference is clearer than the equivalent lambda, and recognize a lambda that cannot become one open

## Teaching

A method reference names an existing method without calling it. Predict the direct replacement for `s -> s.length()`.

A method reference is a compact lambda that delegates to one existing method or constructor. `Type::staticMethod` is static; `expression::instanceMethod` is bound to one receiver; `Type::instanceMethod` receives the future receiver as its first parameter; and `Type::new` calls a constructor. The target functional interface still supplies the parameter and return types.

A method reference can replace a lambda only when the lambda passes its arguments straight to one method or constructor. Shorter is better only when it still says the same thing clearly.

## Recap

- Static: Type::method. Bound: expression::method.
- Unbound: Type::instanceMethod. Constructor: Type::new.
- Keep a lambda when it does more than forward its arguments.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

A lambda can be a short forwarding note: “when a parcel arrives, hand it to this clerk.” A method reference replaces that note with the clerk’s direct extension. If the note contains two errands, one extension cannot express the whole job.

Find the delegate: on each line, name the one method or constructor that receives the lambda arguments.

Another hint Hint 2 of 2

Choose the left side: the declaring type for a static method, the specific object for a bound receiver, the receiver type for an unbound method, the class for new.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- Method references tutorial
- JLS 15.13 method reference expressions

## Static interaction alternatives

### predict

Choose the method reference equivalent to s -> s.length(), then read the explanation printed under every option.

### terminal

Starter: four forwarding lambdas for Integer.parseInt, System.out.println, String length and new ArrayList. Replace each with a static, bound, unbound or constructor method reference, then compare with the success list.

### mcq

Choose the lambda that cannot become one method reference, record confidence, then compare the explanation printed under every option.
