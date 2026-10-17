# Polymorphism: overriding vs overloading

## Objectives

- Override a method with @Override and predict which version runs from the object's runtime type
- Tell overriding (same signature in a subclass) from overloading (different parameters)
- Call methods through a superclass reference that holds subclass objects

## Teaching

The variable `a` is declared as an `Animal`, but the object it refers to is a `Dog`. Predict before any explanation.

```
class Animal {
    String sound() { return "..."; }
}
class Dog extends Animal {
    @Override
    String sound() { return "Woof"; }
}
// in main:
Animal a = new Dog();
System.out.println(a.sound());
```

A subclass overrides an inherited method by declaring one with the same name and the same parameter types. Its return type must be the same or a subtype, and its access cannot be narrower. A call through a superclass reference, such as `Animal p`, runs the version from the object's own class.

Put `@Override` on the method. It changes nothing at run time, but the compiler then reports an error if the method does not actually override anything.

```
class Animal {
    String sound() { return "..."; }
}
class Dog extends Animal {
    @Override
    String sound() { return "Woof"; }
}
```

Overloading is different: methods in the same class, or inherited into it, share a name but take different parameter types. The compiler picks an overload from the declared argument types; nothing waits for run time.

Each item below starts from `class Shape { double area() {...} void scale(double f) {...} }`. A same-signature method in a subclass overrides; a different parameter list overloads; a clash breaks compilation.

Overloads are chosen while compiling, from the declared type of each argument. Overrides are chosen while running, from the object's class.

## Model

The model: the declared type decides which methods you may call; the object's runtime type decides which overriding version runs.

## Recap

- Overriding: a subclass declares a method with the same name and parameter types; the object's runtime class picks which version runs.
- Overloading: same name, different parameter types; the compiler picks one from the declared argument types.
- `@Override` makes the compiler check that a method really overrides one.
- A superclass reference, such as `Animal p`, can hold any subclass object and still calls each object's own override.

Next topic: Abstract classes

## Cheat sheet

A school office calls every class with the same request: send your representative to the front desk. Each class decides for itself who walks down; the office never needs to know which class answered or how it chose.

The same call reaches different objects, and each object's own version decides what actually happens.

Where to act: Inside the braces of `class Cat extends Animal`, in place of the comment.

Next step: Copy the shape of `Dog`'s method: the annotation line, then a method with the same return type, name and empty parameter list as `Animal`'s `sound()`.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The body of your new method.

Next step: Return the text the target output expects for the cat, written as a `String` literal in double quotes.

Where to act: The declaration shown after Declaration:, above the three buttons.

Next step: Compare its parameter list with `area()` and `scale(double f)` first. Same parameters in a subclass means overriding, unless the return type or an annotation makes it illegal.

Optional time: about 4 minutes, in addition to this topic's time.

Change only the declaration of `a` in the first question so that `Printer.show(a)` prints `dog: Woof`. Predict first, then try it in any Java 25 setup you already use.

Success criteria: you can say which change moves the choice to `show(Dog)` and why the object itself did not need to change.

|  |  |
| --- | --- |
| Override | `@Override String sound() { ... }` in a subclass |
| Overload | `scale(double f)` and `scale(double f, double g)` |
| Chosen when | override: at run time; overload: at compile time |
| Override rules | same parameters; compatible return type; access not narrower |
| Call through a superclass reference | `Animal p = new Cat(); p.sound();` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Overriding and Hiding Methods: instance method overriding, `@Override`, return types.
- Dev.java: Polymorphism: calling an overridden method through a superclass reference.
- JLS 25, chapter 8: Classes: 8.4.8.1 Overriding; 8.4.8.3 requirements on return type and access; 8.4.9 Overloading.
- JLS 25, chapter 9: Interfaces: 9.6.4.4 `@Override`.
- JLS 25, chapter 15: Expressions: 15.12.2 compile-time choice of method signature; 15.12.4 run-time method lookup.

## Static interaction alternatives

### predict

Prediction (practice, not scored): Animal a = new Dog(); a.sound() where Dog overrides sound(). Options: ... (wrong: the object is a Dog, and its override runs); Woof (correct); a compile error (wrong: Animal declares sound(), so the call compiles); ClassCastException (wrong: no cast happens).

### explore

Java editor: add a method to class Cat extends Animal so that the loop over a Dog and a Cat prints Woof, then Meow. The starter compiles and prints Woof, then ..., because Cat inherits Animal's sound(). A method named sound that takes a parameter is an overload, not an override: without @Override it still prints ..., and with @Override it does not compile.

### drag

Sorting activity on class Shape with double area() and void scale(double f). Circle extends Shape with double area(): overriding. Circle extends Shape with void scale(int f): overloading. Shape itself also declaring void scale(double f, double g): overloading. Circle extends Shape with @Override void scale(int f): compile error, nothing is overridden. Circle extends Shape with int area(): compile error, incompatible return type. Circle extends Shape with @Override public double area(): overriding, wider access is allowed.

### mcq

Apply question: Printer has show(Animal) and show(Dog); Animal a = new Dog(); Printer.show(a) prints animal: Woof. The overload is picked from the declared type Animal, then a.sound() runs Dog's override. Wrong: dog: Woof (overloads are not picked at run time); animal: ... (the override still runs inside); ambiguous (only show(Animal) accepts an Animal argument). Retry form: show(Animal) and show(Cat), Animal pet = new Cat(); prints animal: Meow.
