# Abstract classes

## Objectives

- Declare an abstract class with abstract and concrete methods
- Explain why an abstract class cannot be instantiated and what a subclass must implement
- Choose an abstract class when subclasses share state and code

## Teaching

`Shape` is marked `abstract`, and its `area()` method has no body. Predict before any explanation.

```
abstract class Shape {
    private final String label;
    Shape(String label) { this.label = label; }
    abstract int area();
    String describe() { return label + " with area " + area(); }
}
// in main:
Shape s = new Shape("blob");
System.out.println(s.describe());
```

Mark a class `abstract` when it should never be created on its own. It may declare abstract methods: a signature ending in `;` with no body. Its concrete methods, such as `describe()`, may call them anyway.

`new Shape(...)` does not compile, because some of a `Shape`'s behavior is missing. A concrete subclass must implement every inherited abstract method; until it does, it must be declared `abstract` too. Abstract classes still have constructors, which subclasses call with `super(...)`.

```
abstract class Shape {
    private final String label;
    Shape(String label) { this.label = label; }
    abstract int area();
    String describe() { return label + " with area " + area(); }
}
```

You may declare a variable or array of an abstract type, such as `Shape s` or `new Shape[3]`; it simply holds subclass objects. You may not create the abstract class itself, give an abstract method a body, or leave a concrete subclass with an abstract method unimplemented.

An abstract class fits when related subclasses share fields and finished code, and each must supply one or more missing steps.

## Model

The model: an abstract class is a partly built template. It can hold fields, constructors and finished methods, but it leaves named steps for each subclass to supply.

## Recap

- An `abstract` class can hold fields, constructors and concrete methods, plus abstract methods that have no body.
- `new` on an abstract class does not compile; variables and arrays of the abstract type are fine.
- A concrete subclass must implement every inherited abstract method, or be declared `abstract` itself.
- Choose an abstract class when subclasses share state and code and each supplies a missing step.

Next topic: Interfaces and default methods

## Cheat sheet

A wedding invitation printer sells a card with the border, the fonts and the reply slip already printed, and a blank box in the middle. The shop will not mail a card with the box still empty; every couple must fill in their own names and date first.

The abstract class is the preprinted card; each concrete subclass fills in the blank step before anything is created.

Where to act: The comment line inside `Rectangle`, below the constructor.

Next step: Find the method in `Shape` that ends in a semicolon instead of a body. `Rectangle` must declare a method with the same return type, name and empty parameter list.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The body of the method you declared.

Next step: Return the rectangle's area, computed from the two fields the constructor stores.

Where to act: The code shown after Code:, above the two buttons.

Next step: Ask two questions: does it create an object of an abstract class with `new`, and does every concrete class end up with a body for `area()`?

Optional time: about 4 minutes, in addition to this topic's time.

Write the abstract `Report` class from the first scenario and one subclass, `SalesReport`, in any Java 25 setup you already use.

Success criteria: `new Report("x")` is rejected by the compiler, `new SalesReport("Q3").print()` prints the title then the body, and removing `body()` from `SalesReport` makes compilation fail.

|  |  |
| --- | --- |
| Abstract class | `abstract class Shape { ... }` |
| Abstract method | `abstract int area();` |
| Concrete subclass | `class Rectangle extends Shape { int area() { ... } }` |
| Not allowed | `new Shape(...)`; an abstract method with a body |
| Allowed | `Shape s = new Rectangle(3, 4);` and `new Shape[3]` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Abstract Methods and Classes: abstract classes and methods, subclasses implementing them, abstract classes compared with interfaces.
- JLS 25, chapter 8: Classes: 8.1.1.1 abstract Classes; 8.4.3.1 abstract Methods; 8.4.8.3 requirements in overriding.
- JLS 25, chapter 15: Expressions: 15.9.1 a class instance creation expression cannot name an abstract class.

## Static interaction alternatives

### predict

Prediction (practice, not scored): new Shape("blob") where Shape is abstract and area() has no body. Options: prints blob with area 0 (wrong: there is no area() body to run); does not compile because Shape is abstract (correct); compiles then fails at run time (wrong: the compiler stops it first); prints null (wrong: nothing runs).

### explore

Java editor: Rectangle extends the abstract class Shape, which declares abstract int area() and a concrete describe() that prints the label and the area. The starter does not compile: Rectangle is not abstract and does not override abstract method area() in Shape. The target output is rectangle with area 12 for new Rectangle(3, 4).

### drag

Sorting activity using abstract class Shape. Shape s = new Rectangle(3, 4): compiles. Shape s = new Shape("x"): compile error, Shape is abstract. Shape[] all = new Shape[3]: compiles, an array of Shape references holds no Shape object yet. An abstract class declaring a constructor: compiles. abstract int area() { return 0; }: compile error, abstract methods have no body. class Square extends Shape with a constructor but no area(): compile error. abstract class Solid extends Shape without area(): compiles.

### mcq

Apply question: three report types share a title field, a constructor and print(), and differ only in body(); a plain report makes no sense. Best design: an abstract class Report with an abstract body(). Wrong: an interface with only body() (it would not share the field, constructor and print() code); an ordinary Report class with an empty body() (it can be created and subclasses may forget to override); three unrelated classes (duplicated code). Retry: payments share amount and receipt() and differ in fee(): an abstract class Payment with an abstract fee().
