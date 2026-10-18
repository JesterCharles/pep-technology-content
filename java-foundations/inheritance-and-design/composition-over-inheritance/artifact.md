# Composition over inheritance

## Objectives

- Refactor a design to hold another object as a field and delegate to it instead of extending it
- Tell a has-a relationship from an is-a relationship in a design
- Explain how a deep inheritance chain makes change harder

## Teaching

`CountingLogger` extends `Logger` to count messages. It adds to `count` in both overrides. Predict before any explanation.

```
class Logger {
    void log(String m) { System.out.println("log: " + m); }
    void logAll(String... ms) { for (String m : ms) log(m); }
}
class CountingLogger extends Logger {
    int count;
    @Override
    void log(String m) { count++; super.log(m); }
    @Override
    void logAll(String... ms) { count += ms.length; super.logAll(ms); }
}
// in main:
CountingLogger c = new CountingLogger();
c.logAll("a", "b");
System.out.println("count = " + c.count);
```

Composition means a class holds another object in a field and delegates work to it: it calls that object's methods instead of inheriting them.

The starter double counts because `Logger.logAll` happens to call `log`, which `CountingLogger` overrides. A subclass silently depends on such internal calls. With a private `Logger` field, `inner.logAll(ms)` calls `Logger`'s own `log`, never yours, so each message is counted exactly once.

```
class Logger {
    void log(String m) { System.out.println("log: " + m); }
    void logAll(String... ms) { for (String m : ms) log(m); }
}
```

Read each relationship aloud. "A circle is a shape" suits `extends` or `implements`. "A thermostat has a sensor" suits a field. When both readings sound possible, prefer the field: it is easier to change later.

Every class in a chain inherits from all the classes above it. A change high in the chain reaches every class below, including overrides that relied on the old behavior, so each of them may need changes and retesting.

## Model

The model: inheritance ties your class to how the superclass works inside. Composition keeps the other object behind a field, so you call only what you choose.

## Recap

- Composition: hold another object in a field and delegate to it, instead of extending its class.
- A subclass can break when the superclass changes how it calls its own methods, as the double count showed.
- Is-a suits `extends` or `implements`; has-a and uses-a suit a field.
- A change high in a deep chain reaches every class below it, so deep chains make change harder.

Next topic: SOLID basics: single responsibility, dependency inversion

## Cheat sheet

A bakery once rebuilt its own oven around a supplier's design, and every time the supplier changed a part, the bakery's modifications broke. Now it simply rents an oven from the supplier, uses the bake button, and keeps its own recipe book separate.

Holding another object and calling it keeps you safe from changes inside it, unlike rebuilding on top of it.

Where to act: The class header and the line below it.

Next step: After removing `extends Logger`, `super.log` and `super.logAll` no longer reach `Logger`. Declare the field exactly as step 2 shows, so there is a `Logger` to call.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The two `super.` calls inside `log` and `logAll`.

Next step: Each call should go to the object in your field, keeping the same method names and arguments, so that `Logger`'s own `logAll` runs its own `log`.

Where to act: The pair shown after Pair:, above the two buttons.

Next step: Try the sentence "every first one is a second one". If it is false, or true only for part of what the second one can do, the first one should hold the second one instead.

Optional time: about 5 minutes, in addition to this topic's time.

Sketch the `Vehicle` chain again using composition: a `Car` that holds an `Engine` field, which might be a `PetrolEngine` or an `ElectricMotor`, plus an optional `Autopilot` field.

Success criteria: each feature lives in its own small class, a car's engine can change without a new subclass, and you can name which classes a change to `ElectricMotor` can affect.

|  |  |
| --- | --- |
| Hold | `private final Logger inner = new Logger();` |
| Delegate | `void log(String m) { count++; inner.log(m); }` |
| Is-a | `class Circle extends Shape`, `class EmailNotifier implements Notifier` |
| Has-a | `class Car { private final Wheel[] wheels; }` |
| Deep chain risk | a superclass change reaches every subclass |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Preferring composition is widely taught design practice rather than a rule stated in these references; the double count it avoids is real Java behavior, shown by the programs on this page. Links open outside this lesson.

- Dev.java: Inheritance: what a subclass inherits and can do; a class has exactly one direct superclass.
- Dev.java: Overriding and Hiding Methods: an overriding method replaces the inherited one for objects of the subclass.
- JLS 25, chapter 8: Classes: 8.4.8 Inheritance, Overriding, and Hiding: an inherited method's call to an overridden method runs the override.

## Static interaction alternatives

### predict

Prediction (practice, not scored): CountingLogger extends Logger, overrides logAll to add the number of messages and call super.logAll, and overrides log to add one and call super.log. Logger's logAll calls log for each message. logAll("a", "b") gives count = 4. Wrong: 2 (Logger's logAll calls the overridden log, so each message is counted twice); 0 (both overrides add to count); a compile error (the code is valid).

### explore

Java editor: CountingLogger starts by extending Logger and overriding log and logAll; it prints log: a, log: b, count = 4, because Logger's logAll calls the overridden log. The task is to remove extends Logger, hold a private final Logger field named inner, and delegate log and logAll to it. The target output is log: a, log: b, count = 2. Calling super.log after removing extends does not compile, because the superclass is then Object.

### drag

Sorting activity. Thermostat and Sensor: has-a, hold a field. Circle and Shape: is-a. Invoice and List<LineItem>: has-a. EmailNotifier and the Notifier interface: is-a, implement it. Car and Wheel: has-a. AuditLog and FileWriter: has-a, the log writes through a writer it holds.

### mcq

Apply question: in the chain Vehicle, MotorVehicle, Car, ElectricCar, SelfDrivingCar, a change to Vehicle.start() can change the behavior of Vehicle and all four classes below it, because they all inherit start(), and overrides that call super.start() inherit the change too. Wrong: only Vehicle; only SelfDrivingCar; none, because subclasses do not hold copies of inherited methods. Retry: changing Payment.total() in a four-class chain can change all four classes.
