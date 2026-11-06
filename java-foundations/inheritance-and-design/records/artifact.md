# Reading: records

## Objectives

- Declare a record and list the constructor, accessors, equals, hashCode and toString it provides
- Explain why a record's fields are final and when a record fits better than a class
- Add validation in a compact canonical constructor

## Teaching

This whole declaration is one line, and the record body is empty. Predict before any explanation.

```
record Point(int x, int y) { }
// in main:
System.out.println(new Point(1, 2));
```

`record Point(int x, int y) { }` declares a final class with two `private final` fields and generates: a canonical constructor `Point(int x, int y)`, accessors `x()` and `y()` (no `get` prefix), and `equals`, `hashCode` and `toString` based on every component.

Because the fields are `final`, a record's state never changes after construction, and a record cannot declare extra instance fields. To change a value, create a new record. Records fit plain data such as coordinates, money amounts or query results.

To check values, add a compact canonical constructor: the record's name, then a body, with no parameter list. Inside it, the parameters `lo` and `hi` are already in scope. Throw an exception for bad values; when the body finishes, Java assigns the fields automatically.

Do not assign the fields yourself in a compact constructor: `this.lo = lo;` does not compile.

```
record Temperature(double celsius) {
    Temperature {
        if (celsius < -273.15) throw new IllegalArgumentException("below absolute zero");
    }
}
```

The generated `equals` compares every component, so two records with the same values are equal, even though `==` still tells two different objects apart.

## Model

The model: a record is a named, immutable bundle of values. You list the components once; Java writes the boring parts.

The model: a compact canonical constructor runs your checks first; Java then assigns every component to its field for you.

## Recap

- `record Point(int x, int y) { }` generates the canonical constructor, accessors `x()` and `y()`, and `equals`, `hashCode` and `toString`.
- Record fields are `private final`: no setters, no extra instance fields; create a new record to change a value.
- A compact canonical constructor `Point { ... }` validates the parameters; Java then assigns the fields.
- Use a record for immutable data identified by its values; use a class for changing state or hidden representation.

Next topic: Reading: singleton and factory patterns

## Cheat sheet

A printed concert ticket lists the date, the seat and the price. Nobody edits a ticket with a pen; if the seat changes, the box office prints a new ticket. Two tickets with the same date, seat and price are interchangeable at the door.

A record is that ticket: fixed values, replaced rather than edited, and equal when all its values match.

Where to act: The member shown after Member:, above the three buttons.

Next step: First ask whether Java already generates it from the component list. If not, ask whether it would add per-object state or change a field, which a record forbids.

Where to act: The comment line inside `record Range`.

Next step: Follow the `Temperature` example: the record's own name, then braces, with no parentheses after the name.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Inside the braces of your compact constructor.

Next step: Write one `if` statement whose condition compares the two components in the direction the task names, and whose body throws a new `IllegalArgumentException`.

Optional time: about 4 minutes, in addition to this topic's time.

Give `Money` a compact constructor that rejects negative `cents` and a blank `currency`, plus a method `Money plus(Money other)` that returns a new record. Try it in any Java 25 setup you already use.

Success criteria: invalid amounts throw on construction, `plus` leaves both originals unchanged, and you can explain why `plus` returns a new `Money` instead of changing one.

|  |  |
| --- | --- |
| Declare | `record Money(String currency, long cents) { }` |
| Read a component | `m.cents()` |
| Validate | `Money { if (cents < 0) throw new IllegalArgumentException("negative"); }` |
| Equality | `a.equals(b)` compares every component |
| Not allowed | instance fields, setters assigning fields, `extends` |

## Sources

Java language and API facts on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Program output and compiler messages were confirmed on OpenJDK 25.0.4.1 (Eclipse Temurin). Links open outside this lesson.

- Dev.java: Using Records to Model Immutable Data: record declarations, generated members, compact constructors.
- Record (Java SE 25 API): the implicitly declared `equals`, `hashCode` and `toString`.
- JLS 25, chapter 8: Classes: 8.10 Record Classes; 8.10.4.2 Compact Canonical Constructors.
- JEP 395: Records: records as a standard feature since JDK 16.

## Static interaction alternatives

### predict

Prediction (practice, not scored): record Point(int x, int y) { } then println(new Point(1, 2)) prints Point[x=1, y=2]. Wrong: Point@ and a hash (records generate their own toString); (1, 2) (the generated toString names the record and each component); a compile error (records get a canonical constructor automatically).

### drag

Sorting activity about record Point(int x, int y). The accessor x(): provided automatically. equals, hashCode and toString: provided automatically. A static field static int created: you may add it. An extra method int sum(): you may add it. A setter void setX(int x) that assigns this.x: not allowed, the field is final. An instance field private int count: not allowed in a record. extends Shape in the header: not allowed, a record cannot extend a class.

### explore

Java editor: add a compact canonical constructor to record Range(int lo, int hi) that throws IllegalArgumentException when lo is greater than hi. main prints new Range(1, 5) and then tries new Range(5, 1), printing rejected if it throws. The target output is Range[lo=1, hi=5], then rejected. The starter prints Range[lo=1, hi=5] and Range[lo=5, hi=1], because nothing checks the values. Assigning this.lo inside a compact constructor does not compile.

### mcq

Apply question: two Money records with the same currency and cents: a.equals(b) + " " + (a == b) prints true false. The generated equals compares every component, while == compares object identity. Wrong: false false; true true; false true. Retry: adding both to a HashSet gives size 1, because the generated equals and hashCode treat them as the same value.
