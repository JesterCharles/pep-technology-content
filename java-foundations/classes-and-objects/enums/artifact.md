# Enums

## Objectives

- Declare an enum for a fixed set of constants and use it in a switch
- Add a field, constructor and method to an enum
- Choose an enum over int or String constants and explain the type safety it adds

## Teaching

Before any explanation, predict what this program prints.

```
enum Size { SMALL, MEDIUM, LARGE }

// inside main:
System.out.println(Size.valueOf("LARGE").ordinal());
```

```
enum Volume { LOW, HIGH }
void setVolume(Volume v) { ... }

static final int LEVEL_LOW = 0;
static final int LEVEL_HIGH = 2;
void setLevel(int level) { ... }
```

With `int` constants, the names are just labels for numbers, so any `int` is accepted. The enum gives each constant its own type.

An enum is a class, so it can have fields, a constructor and methods. Each constant passes arguments to the constructor in parentheses. The constant list comes first and ends with a semicolon, and an enum constructor is never `public`: only the constants call it.

```
enum Planet {
    MERCURY(0.38), EARTH(1.0);

    private final double gravity;

    Planet(double gravity) {
        this.gravity = gravity;
    }

    double gravity() {
        return gravity;
    }
}
```

`Planet.EARTH.gravity()` returns `1.0`.

A `switch` on an enum uses the bare constant names as case labels. A `switch` expression, one that produces a value, must cover every constant or have a `default`, so the compiler can promise a result. An ordinary `switch` statement over enum constants may leave some out; for those, nothing runs.

## Model

The model: an enum declares a type whose only values are a fixed list of named constants. A variable of type `Size` can hold only `Size.SMALL`, `Size.MEDIUM`, `Size.LARGE` or `null`, and the compiler enforces that. Compare two ways to say how loud a speaker is:

## Recap

- An enum declares a type with a fixed set of named constants; `ordinal()` counts from 0 and `valueOf` needs the exact name.
- An enum parameter accepts only its constants (or `null`), which `int` or `String` constants cannot promise.
- Enum constants can carry data through a field, a non-public constructor and methods.
- A switch expression over an enum must cover every constant or have a `default`; a plain switch statement need not.

## Cheat sheet

Where to act: The call shown after Item:, above the two buttons.

Next step: Find the parameter type of the method being called, then ask whether the argument's type matches it exactly. A name spelled in a `String` is not a constant.

Where to act: The constant list, then the space under comments 2 to 4.

Next step: Follow the `Planet` example in the same order: arguments in parentheses after each constant, then the field, the constructor and the method.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The constructor under comment 3.

Next step: Its name is the enum's name, it takes one `int`, and it has no access modifier; use `this.` because the parameter can share the field's name.

Optional time: about 4 minutes, in addition to this topic's time.

Using your `Coin` enum, write a method that takes a `Coin` and returns its common name, such as "one cent", with a switch expression that has a case for every constant and no `default`. Then add a fifth constant in any Java 25 setup you already use and read the compiler's message.

Success criteria: the method compiles with four constants, the compiler rejects it after you add a fifth, and you can say why that is a benefit.

|  |  |
| --- | --- |
| Declare | `enum Light { RED, YELLOW, GREEN }` |
| With data | `MERCURY(0.38), EARTH(1.0);` plus field, constructor, method |
| Name lookup | `Size.valueOf("LARGE")` |
| Switch | `case RED -> "stop";` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 8: Classes: enum classes (8.9): enum constants, bodies with fields, constructors and methods, and enum constructors that must not be public or protected (8.9.2).
- Java Language Specification SE 25, chapter 14: Blocks, Statements, and Patterns: the switch statement and which switch statements must be exhaustive (14.11.1.1, 14.11.2).
- Java Language Specification SE 25, chapter 15: Expressions: switch expressions must be exhaustive (15.28.1).
- Enum (Java SE 25 API): ordinal returns the position in the declaration with the first constant at 0; valueOf requires an exact name match and throws IllegalArgumentException otherwise.
- Dev.java: Enums: declaring enums, adding fields, constructors and methods, and using enums in switch.

## Static interaction alternatives

### predict

Expected results and why. It prints 2 . valueOf("LARGE") returns the constant named exactly LARGE , and ordinal() counts from 0 in declaration order. A name that does not match exactly, such as "large" , would throw IllegalArgumentException .

### drag

Expected results and why. Compiles: setVolume(Volume.HIGH) , setLevel(LEVEL_HIGH) , and also setLevel(42) , because any int fits. Rejected: setVolume("HIGH") and setVolume(2) because the types do not match.

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: give PENNY , NICKEL , DIME and QUARTER the values 1, 5, 10 and 25; add a private final int cents field, a constructor that stores the value, and a method int cents() that returns it. Starter, Coin.java: enum Coin { // 1. Give each constant its value in cents: 1, 5, 10, 25. PENNY, NICKEL, DIME, QUARTER; // 2. Add a private final int field named cents. // 3. Add a constructor that stores the value. // 4. Add a method int cents() that returns it. } What the practice editor reads: top-level classes and enums with constants, fields, constructors and methods; it checks declarations and statement shapes, and reports anything else as not supported. How to compare: Coin.DIME.cents() must return 10 and Coin.QUARTER.cents() 25 . A public constructor would not compile, and a field without final could be changed later.

### mcq

Expected results and why. The switch expression is a compile error: it has no case for GREEN and no default , and a switch expression must cover every constant. Retry: the switch statement compiles and prints nothing for GREEN , because a plain switch statement over enum constants need not be exhaustive.
