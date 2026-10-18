# SOLID basics: single responsibility, dependency inversion

## Objectives

- Identify a class with more than one reason to change and split it
- Make a class depend on an interface passed in through its constructor rather than on a concrete class
- Explain how dependency inversion lets a test supply a different implementation

## Teaching

Three groups of people care about this class: finance sets the tax rules, marketing designs the customer email, and the database team owns the tables. Predict before any explanation.

```
class OrderManager {
    // tax and discount rules
    double total(Order o) { ... }
    // customer email layout
    String toEmailText(Order o) { ... }
    // database table and columns
    void save(Order o) { ... }
}
```

The single responsibility principle says a class should have one reason to change. `OrderManager` has three: tax rules, email layout and storage. A typo fix in the email could break tax calculation in the same file, and the class grows with every request.

Split it so that each class owns one concern, such as `OrderPricing`, `OrderEmail` and `OrderStore`, each changed only for its own reason.

```
class OrderManager {
    // tax and discount rules
    double total(Order o) { ... }
    // customer email layout
    String toEmailText(Order o) { ... }
    // database table and columns
    void save(Order o) { ... }
}
```

The dependency inversion principle says high-level code should depend on abstractions, not concrete classes. `Greeter` builds its own `SystemClock`, so it always reads the real time.

Declare the field as the `Clock` interface, without creating one, and add a constructor `Greeter(Clock clock)` that stores the clock it receives. Whoever creates a `Greeter` now decides which `Clock` it uses.

```
interface Clock { int hour(); }
class SystemClock implements Clock {
    public int hour() { return java.time.LocalTime.now().getHour(); }
}
class FixedClock implements Clock {
    private final int h;
    FixedClock(int h) { this.h = h; }
    public int hour() { return h; }
}
```

Because `Greeter` receives its `Clock`, a test can pass a `FixedClock` and check both greetings instantly, at any time of day.

## Model

The model: a class should answer to one group of decisions. When unrelated decisions share a class, a change for one risks breaking the others.

The model: a class that creates its own concrete helper is welded to it. A class that receives an interface can work with any implementation it is given.

## Recap

- Single responsibility: give a class one reason to change; split classes whose parts change for different reasons.
- Dependency inversion: depend on an interface, such as `Clock`, and receive it through the constructor instead of creating a concrete class inside.
- Whoever creates the object chooses the implementation, so a test can pass a fixed or fake one.
- Do not split ideas that always change together into many tiny classes.

Next topic: Functional interfaces and anonymous classes

## Cheat sheet

Where to act: The method shown after Method:, above the three buttons.

Next step: Ask who would request a change to it: finance for prices and tax, marketing for wording and layout, or the database team for storing and loading.

A wall lamp wired straight into the house can only ever be that lamp. A lamp with a plug works with any socket, and the socket works with any lamp, a heater or a phone charger, because both sides agree only on the shape of the plug.

The interface is the plug shape: the class accepts any implementation that fits it.

Where to act: The field line `private final Clock clock = new SystemClock();`.

Next step: Keep the type `Clock` and the name, but delete the part that creates a concrete clock, so the field waits for one to be supplied.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: A new line between the field and `greet()`.

Next step: Write a constructor named after the class whose one parameter has the interface type, and store that parameter in the field using `this.`.

Optional time: about 5 minutes, in addition to this topic's time.

Write the `Mailer` interface, an `SmtpMailer` stub and a `FakeMailer` that remembers the last message, then change `InvoiceSender` to receive a `Mailer`. Try it in any Java 25 setup you already use.

Success criteria: `InvoiceSender` never mentions `SmtpMailer`, and a `main` method can pass a `FakeMailer` and print the message it captured.

|  |  |
| --- | --- |
| One reason to change | `OrderPricing`, `OrderEmail`, `OrderStore` |
| Depend on the interface | `private final Clock clock;` |
| Constructor injection | `Greeter(Clock clock) { this.clock = clock; }` |
| Real use | `new Greeter(new SystemClock())` |
| Test use | `new Greeter(new FixedClock(15))` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Single responsibility and dependency inversion are widely taught design principles rather than rules stated in these references; the Java behavior they rely on, interface types and final fields set in constructors, is. Links open outside this lesson.

- Dev.java: Using an Interface as a Type: declaring variables and parameters of an interface type.
- JLS 25, chapter 8: Classes: 8.3.1.2 final Fields; 8.8 Constructor Declarations.
- JLS 25, chapter 16: Definite Assignment: a blank final field must be assigned in every constructor.

## Static interaction alternatives

### predict

Prediction (practice, not scored): OrderManager has total() for tax and discount rules, toEmailText() for the customer email layout and save() for the database. It has three independent reasons to change: tax rules, email layout and storage. Wrong: one (sharing the Order type does not make them one responsibility); none (working code still changes when requirements change); as many as its lines (reasons to change are the people and rules it answers to, not lines).

### drag

Sorting activity splitting OrderManager. total(Order): OrderPricing. applyDiscount(Order, String code): OrderPricing. toEmailText(Order): OrderEmail. subjectLine(Order): OrderEmail. save(Order): OrderStore. findById(long id): OrderStore.

### explore

Java editor: Greeter creates its own SystemClock in a final field and greets by the hour. main creates new Greeter(new FixedClock(9)) and new Greeter(new FixedClock(15)), so the starter does not compile: constructor Greeter cannot be applied to given types. The target output is Good morning, then Good afternoon. A constructor parameter of type SystemClock is rejected: incompatible types, FixedClock cannot be converted to SystemClock.

### mcq

Apply question: to test the afternoon greeting at any time of day, create new Greeter(new FixedClock(15)) and check greet(). Wrong: changing the computer's clock (slow, fragile, affects other programs); calling greet() until the afternoon (could take hours); running the test only in the afternoon (it would not run when needed). Retry: InvoiceSender creates new SmtpMailer() inside send(); give it a constructor that takes a Mailer interface and pass a fake in the test.
