# Interfaces and default methods

## Objectives

- Declare an interface and implement it in more than one class
- Add a default method and predict when an implementing class's own method replaces it
- Choose between an interface and an abstract class for a design

## Teaching

`Greeter` is an interface with a `default` method that has a body. `Loud` declares its own `greet()`; `Quiet` declares nothing. Predict before any explanation.

```
interface Greeter {
    default String greet() { return "Hello"; }
}
class Loud implements Greeter {
    public String greet() { return "HELLO"; }
}
class Quiet implements Greeter { }
// in main:
System.out.println(new Loud().greet() + " " + new Quiet().greet());
```

An interface lists methods without saying which class provides them. `int price();` is abstract: every implementing class must define it. Interface methods are implicitly `public`, so implementations must be declared `public` too.

A `default` method has a body that implementing classes inherit, such as `label()` built on `price()`. A class may declare its own version, which then replaces the default for that class, as `Pen` does.

```
interface Priced {
    int price();
    default String label() { return "$" + price(); }
}
class Pen implements Priced {
    public int price() { return 3; }
    public String label() { return "Pen, $" + price(); }
}
```

A class can implement many interfaces but extend only one class. Interfaces hold no instance fields and no constructors; abstract classes can hold both.

So reach for an interface to describe a capability that unrelated classes share, and for an abstract class when closely related classes share state and code.

A class's own method always replaces an interface default, whether you call it through the class or through the interface type.

## Model

The model: an interface is a promise of methods. Any class can make the promise with `implements`, and a variable of the interface type can hold any of those objects.

## Recap

- An interface declares methods; `class Book implements Priced` promises to define each abstract one, as a `public` method.
- Many unrelated classes can implement one interface, and a variable of the interface type can hold any of them.
- A `default` method has a body that classes inherit; a class's own method with the same signature replaces it.
- Interface for a capability many classes add; abstract class for related classes sharing fields, constructors and code.

Next topic: Composition over inheritance

## Cheat sheet

Any shop can join a city gift-card scheme by agreeing to two things: accept the card at the till, and print its balance on request. The scheme also provides a standard receipt layout that most shops simply use, while a few design their own.

Joining the scheme is implementing the interface; the standard receipt is a default method a class may replace.

Where to act: The line `class Book {` at the top of the editor.

Next step: Add the keyword from the teaching that makes a class promise an interface's methods, followed by the interface's name.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside the braces of `Book`, in place of the comment.

Next step: `Priced` has one abstract method. Declare it with the same return type and name, mark it `public`, and return the book's cost.

Where to act: The design need shown after Need:, above the two buttons.

Next step: Ask whether the classes must share instance fields or a constructor, which only an abstract class can hold, or only promise methods, which unrelated classes can do through an interface.

Optional time: about 4 minutes, in addition to this topic's time.

Add a third class, `GiftCard`, that implements `Priced` with a price of 25 and its own `label()`. Try it alongside `Book` and `Pen` in any Java 25 setup you already use.

Success criteria: all three objects sit in one `Priced[]` array, each prints through the same loop, and you can say which of the three uses the default `label()`.

|  |  |
| --- | --- |
| Declare | `interface Priced { int price(); }` |
| Default method | `default String label() { return "$" + price(); }` |
| Implement | `class Book implements Priced { public int price() { ... } }` |
| Several at once | `class Pen implements Priced, Comparable<Pen>` |
| Replace a default | declare the same method in the class |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Defining an Interface: interface declarations and implicitly public methods.
- Dev.java: Implementing an Interface: implementing interfaces, default methods.
- Dev.java: Abstract Methods and Classes: abstract classes compared with interfaces.
- JLS 25, chapter 9: Interfaces: 9.4 Method Declarations, including default methods and implicit `public`.
- JLS 25, chapter 8: Classes: 8.1.5 Superinterfaces; 8.4.8 Inheritance, Overriding, and Hiding.

## Static interaction alternatives

### predict

Prediction (practice, not scored): interface Greeter has default greet() returning Hello; Loud declares its own greet() returning HELLO; Quiet declares nothing. new Loud().greet() + " " + new Quiet().greet() prints HELLO Hello. Wrong: Hello Hello (Loud's own method replaces the default); compile error (a default method needs no implementation); HELLO null (Quiet uses the default body).

### explore

Java editor: make Book implement Priced with a price of 12. Priced declares int price() and a default label() returning a dollar sign followed by price(); Pen implements both and overrides label(). The target output is $12, then Pen, $3. The starter does not compile because a Book cannot be stored in a Priced array. Implementing price() without public fails: an interface method is public, so the implementation cannot have weaker access.

### drag

Sorting activity. Printable for unrelated Invoice and Photo classes that already extend other classes: interface. Vehicle subclasses that all store wheels and share a constructor: abstract class. One class that must be both Comparable and Printable: interface. Account kinds sharing a balance field and deposit() code, each computing interest(): abstract class. A capability with one abstract method and a convenience default built on it: interface. Subclasses that update shared protected helper state: abstract class.

### mcq

Apply question: Speaker declares name() and a default intro() returning I am plus name(). Robot defines only name() as R2; Parrot defines name() as Polly and its own intro(). new Robot().intro() + " / " + new Parrot().intro() prints I am R2 / Polly wants a cracker. Wrong: I am R2 / I am Polly (Parrot's own intro() replaces the default); compile error (Robot inherits the default); I am null (name() returns R2). Retry: Speaker s = new Parrot(); s.intro() prints Polly wants a cracker.
