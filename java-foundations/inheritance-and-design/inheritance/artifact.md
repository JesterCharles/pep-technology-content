# Inheritance

## Objectives

- Extend a class and reuse its fields and methods in the subclass
- Call a superclass constructor with super(...) and predict the order of constructor calls
- Recognize an is-a relationship that justifies inheritance

## Teaching

`Dog extends Animal` makes every `Dog` also an `Animal`. Both classes print a line from their constructor. Predict before any explanation.

```
class Animal {
    Animal() { System.out.println("Animal ready"); }
}
class Dog extends Animal {
    Dog() { System.out.println("Dog ready"); }
}
// in main:
new Dog();
```

`class Dog extends Animal` gives `Dog` every field and method `Animal` makes visible to it, so a `Dog` can use `name` and `describe()` without repeating them. A subclass adds its own members, such as `bark()`. Constructors are not inherited.

A subclass constructor calls a superclass constructor with `super(...)`, usually as its first statement. If it does not, Java inserts `super()` with no arguments, which fails to compile when the superclass has no such constructor.

```
class Animal {
    protected String name;
    Animal(String name) {
        this.name = name;
        System.out.println("Animal constructor");
    }
    String describe() { return name + " the animal"; }
}
```

Inheritance says is-a: every subclass object can stand in wherever the superclass is expected. A `Dog` is an `Animal`, and a `SavingsAccount` is an `Account`. Test a design by reading it aloud: "every B is an A" must be true for every B, always.

When the sentence is really has-a or uses-a, such as a `Car` that has an `Engine`, give the class a field instead. Extending only to reuse a few methods drags in every other public method too.

Constructor calls chain upward: each constructor first calls its superclass constructor, so the class at the top finishes first.

## Model

The model: a subclass object contains a complete superclass part. Java builds that part first, through a superclass constructor, then runs the rest of the subclass constructor.

## Recap

- `class Dog extends Animal` makes a `Dog` an `Animal`: it reuses the fields and methods `Animal` makes visible and adds its own.
- Constructors are not inherited. A subclass constructor calls one with `super(...)`; if it does not, Java inserts `super()`.
- Superclass parts are built first, so constructors finish from the top of the hierarchy down.
- Extend only for a true is-a; a has-a or uses-a link becomes a field.

Next topic: Polymorphism: overriding vs overloading

## Cheat sheet

A food truck is built on a delivery van. The factory finishes the van first: wheels, engine and cab. Only then does the conversion shop add the kitchen and serving hatch. The finished truck still drives like any van, because it is one.

A subclass object is built the same way: the superclass part first, then the subclass's own additions.

Where to act: The line `class Dog {` at the top of the editor.

Next step: The teaching shows the keyword that names a superclass after the class name. Add it, followed by the superclass's name.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The comment inside the `Dog(String name)` constructor.

Next step: `Animal` has only one constructor, and it needs a `String`. Call it with the keyword for the superclass constructor and pass the constructor's own parameter.

Optional time: about 4 minutes, in addition to this topic's time.

Add a third class, `Puppy`, that extends `Dog`. Its constructor takes a name, passes it up, and prints `Puppy constructor`. Then create `new Puppy("Bo")` in any Java 25 setup you already use.

Success criteria: you predict all three constructor lines and their order before running it, and `Puppy` can call both `describe()` and `bark()` without declaring them.

Where to act: The pair shown after Pair:, above the two buttons.

Next step: Say the sentence "every first-class object is a second-class object". If it sounds wrong, or only some of them would be, the classes have a different relationship.

|  |  |
| --- | --- |
| Subclass | `class Dog extends Animal { ... }` |
| Call the superclass constructor | `Dog(String name) { super(name); ... }` |
| No `super(...)` written | Java inserts `super()` |
| Construction order | superclass first, then subclass |
| Is-a test | "every B is an A" is always true |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Inheritance: subclasses, superclasses, what a subclass inherits, constructors are not inherited, `super(...)`.
- JLS 25, chapter 8: Classes: 8.1.4 Superclasses and Subclasses; 8.8.7 Constructor Body, including the implicit `super()` and statements before an explicit constructor invocation.
- JLS 25, chapter 12: Execution: 12.5 Creation of New Class Instances: the superclass constructor runs before the rest of the subclass constructor.

## Static interaction alternatives

### predict

Prediction (practice, not scored): new Dog() where Dog extends Animal and each constructor prints a line. Options: Dog ready only (wrong: the Animal part is built too); Animal ready, then Dog ready (correct); Dog ready, then Animal ready (wrong: the superclass part is built first); a compile error (wrong: Java inserts super() for you).

### explore

Java editor: make Dog extend Animal and pass name to the Animal constructor. Animal has one constructor, Animal(String name), which stores the name and prints Animal constructor. The target output is: Animal constructor, Dog constructor, Rex the animal, Rex says woof. The starter does not compile: Dog has no field called name. Extending Animal without calling super(name) also fails, because Java then inserts super() and Animal has no no-argument constructor.

### drag

Sorting activity. Dog and Animal: inheritance fits, every dog is an animal. SavingsAccount and Account: inheritance fits. Car and Engine: use a field, a car has an engine. Manager and Employee: inheritance fits when every manager is an employee. Playlist and ArrayList: use a field, a playlist uses a list but should not expose every list method. Order and Customer: use a field, an order has a customer.

### mcq

Apply question: classes A, B extends A, C extends B, each constructor prints its letter; new C() prints A B C. Wrong: C only (the superclass parts are built too); C B A (the top class finishes first); a compile error (Java inserts super()). Retry form: B(String s) prints B plus s, C() calls super("!"); new C() prints A B! C.
