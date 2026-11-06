# Reading: final and toString

## Objectives

- Tell what final means on a variable, a method and a class
- Explain that final stops reassignment of a reference but not changes to the object it points to
- Override toString to give an object a readable text form

## Teaching

Before any explanation, predict what happens when this runs.

```
// inside main:
final StringBuilder sb = new StringBuilder("a");
sb.append("b");
System.out.println(sb);
```

- A final variable or field can be assigned only once. A final field must be assigned by the end of every constructor and never afterwards.
- A final method cannot be overridden by a subclass, and a final class, such as `String`, cannot be extended at all. Subclasses arrive in the next module; here you only need to know what the keyword forbids.

For a reference variable, "assigned once" means it always refers to the same object. The object itself can still change, unless its own class prevents that.

When you print an object or join it to a string with `+`, Java calls its `toString()` method. The version every class inherits from `Object` prints the class name, an `@` and a hexadecimal number, such as `Card@1b6d3586`, which tells a reader almost nothing. Override it to return a useful text form:

```
class Point {
    private final int x;
    private final int y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
```

`@Override` asks the compiler to confirm that the method really replaces an inherited one; a misspelled name then becomes a compile error.

Printing an object and joining it to a string both call `toString()`: the inherited one, or your override if there is one.

## Model

The model: `final` means "assigned once" or "not replaced", depending on where it appears.

## Recap

- A `final` variable or field is assigned once; a final field must be set by the end of every constructor.
- `final` on a reference freezes the reference, not the object it refers to.
- A `final` method cannot be overridden, and a `final` class cannot be extended.
- Printing or joining an object calls `toString()`; override it, with `@Override`, to show useful field values.

## Cheat sheet

Where to act: The code shown after Item:, above the two buttons.

Next step: Find what is marked `final`, then ask whether the code assigns that variable a second time, or only uses or changes the object it refers to.

At a coat check, every coat gets a ticket stamped with a number. The number lets staff find the right coat, but if a friend asks what you are wearing, reading out the ticket number is useless. You describe the coat instead: the blue wool one with brass buttons.

The inherited text form is like the ticket number; your own version describes what the object actually holds.

Where to act: Under the comment inside `class Card`.

Next step: Copy the method header shape from the `Point` example: the annotation line, then a public method named `toString` with no parameters that returns a `String`.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The method's `return` line.

Next step: Build the text from three pieces joined with `+`: the rank field, the literal word between them with its spaces, and the suit field.

|  |  |
| --- | --- |
| Constant | `final int MAX = 10;` |
| Set-once field | `private final String id;`, assigned in the constructor |
| Final reference | Cannot point elsewhere; the object can still change |
| Readable text | `@Override public String toString() { return ...; }` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 4: Types, Values, and Variables: final variables (4.12.4): a final variable may be assigned only once; a final reference always refers to the same object, whose state may still change.
- Java Language Specification SE 25, chapter 8: Classes: final classes (8.1.1.2), final fields that must be definitely assigned by the end of every constructor (8.3.1.2) and final methods (8.4.3.3).
- Object (Java SE 25 API): toString: the default returns the class name, an at-sign and the unsigned hexadecimal hash code.
- Java Language Specification SE 25, chapter 15: Expressions: string concatenation converts a reference operand with toString (15.18.1, 5.1.11).
- Java Language Specification SE 25, chapter 9: Interfaces: the @Override annotation (9.6.4.4).

## Static interaction alternatives

### predict

Expected results and why. It prints ab . final stops the variable sb from being assigned again, but append changes the builder object, which final does not protect.

### drag

Expected results and why. Does not compile: max = 20 after final int max ; sb = new StringBuilder() after final ; assigning a final field in setId ; extending final class Coin . Compiles: sb.append("x") ; scores[0] = 9 ; assigning a final field once in the constructor.

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: add a toString override marked @Override so that printing new Card("Q", "hearts") shows Q of hearts ; keep both fields final . Starter, Card.java: class Card { private final String rank; private final String suit; Card(String rank, String suit) { this.rank = rank; this.suit = suit; } // Override toString so that printing new Card("Q", "hearts") // shows: Q of hearts } What the practice editor reads: top-level classes with fields, constructors and methods; it checks declarations and statement shapes, and reports anything else as not supported. How to compare: printing new Card("Q", "hearts") must show exactly Q of hearts , and new Card("7", "clubs") must show 7 of clubs . Without the override you would see Card@ followed by a hexadecimal number.

### mcq

Expected results and why. Without an override, printing a Ticket shows Ticket@ followed by a hexadecimal number, the form Object.toString produces. Retry: "Card: " + c calls the override, so it prints Card: Q of hearts ; final does not stop c being used.
