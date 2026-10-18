# Constructors

## Objectives

- Write a constructor that initializes every field from its parameters
- Use this to tell a field from a parameter with the same name, and chain constructors with this(...)
- Explain when the compiler supplies a default constructor and when it does not

## Teaching

Before any explanation, predict what this program prints. The constructor runs when `new Point(3, 4)` runs.

```
class Point {
    int x;
    int y;

    Point(int x, int y) {
        x = x;
        y = y;
    }
}

// inside main:
Point p = new Point(3, 4);
System.out.println(p.x + "," + p.y);
```

If a class declares no constructor at all, the compiler supplies a default constructor with no parameters, so `new Point()` works. As soon as you declare any constructor, no default is supplied: `new Point()` then compiles only if you also declare a constructor with no parameters yourself.

A constructor can call another constructor of the same class with `this(...)`, passing the arguments that constructor needs. This keeps the field assignments in one place:

```
class Timer {
    String label;
    int seconds;

    Timer(String label, int seconds) {
        this.label = label;
        this.seconds = seconds;
    }

    Timer(String label) {
        this(label, 60);   // default: 60 seconds
    }
}
```

Write `this(...)` as the first statement of the constructor that uses it.

Match each `new` expression against the constructors the class really has, remembering when the compiler supplies a default one.

## Model

The model: a constructor has the class's name and no return type, and it runs once for each `new` to give the new object its starting state. `this.x` always means the field of the object being built, so `this.x = x;` copies the parameter into the field.

## Recap

- A constructor has the class name and no return type; it runs for each `new` and sets the object's starting state.
- When a parameter has a field's name, `this.name` is the field and plain `name` is the parameter.
- `this(...)` as the first statement runs another constructor of the same class, so assignments stay in one place.
- The compiler supplies a no-argument default constructor only when a class declares no constructor.

## Cheat sheet

Where to act: The item shown after Item:, above the two buttons.

Next step: First check whether the class declares any constructor. Then compare the number and types of arguments in the `new` expression with the constructors the class really has.

Where to act: Under comment 1, inside `class Ticket`.

Next step: A constructor line starts with the class name and its parameter list, with no return type. Because the parameters share the field names, each assignment needs `this.` on the field side.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Under comment 2.

Next step: This constructor has one parameter. Its body is a single `this(...)` call whose two arguments line up, in order, with the first constructor's parameters.

Optional time: about 4 minutes, in addition to this topic's time.

Add a third constructor to your `Ticket`: `Ticket()`, for an unnamed event, that chains to `Ticket(String event)` rather than to the two-parameter constructor. Print the fields of a ticket made by each constructor in any Java 25 setup you already use.

Success criteria: each constructor sets fields only by calling another constructor or, for the full one, by `this.` assignments, and all three tickets print the values you expect.

|  |  |
| --- | --- |
| Constructor | `Timer(String label, int seconds) { this.label = label; this.seconds = seconds; }` |
| Chain | `Timer(String label) { this(label, 60); }` |
| Default constructor | Supplied only if the class declares no constructor |
| Call | `new Timer("tea", 180)` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 8: Classes: constructor declarations (8.8), explicit constructor invocations with this(...) (8.8.7.1) and the default constructor (8.8.9).
- Java Language Specification SE 25, chapter 6: Names: shadowing of a field by a parameter (6.4.1).
- Java Language Specification SE 25, chapter 15: Expressions: class instance creation with new (15.9) and the this keyword (15.8.3).
- Dev.java: Calling Methods and Constructors: providing constructors and the default constructor.
- Dev.java: More on Classes: using the this keyword with a field and from a constructor.

## Static interaction alternatives

### predict

Expected results and why. It prints 0,0 . In the constructor, x and y name the parameters, which shadow the fields, so the fields keep their default 0. 3,4 : wrong; the fields are never assigned. A compile error: wrong; self-assignment is legal. null,null : wrong; int fields default to 0.

### drag

Expected results and why. class Cup { int ml; } then new Cup() : compiles; the default constructor is supplied. Mug(int ml) declared, then new Mug() : does not compile; declaring a constructor removes the default. new Mug(250) : compiles; it matches Mug(int ml) . Jar() and Jar(int ml) declared, then new Jar() : compiles. new Cup(250) : does not compile; the default constructor takes no arguments. new Pot("big") : does not compile; String does not match int .

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: write Ticket(String event, int seat) that sets both fields from the same-named parameters, and Ticket(String event) that calls the first constructor with this(...) , passing the event and seat 0. Starter, Ticket.java: class Ticket { String event; int seat; // 1. Write Ticket(String event, int seat) that sets both fields. // 2. Write Ticket(String event) that calls constructor 1 // with this(...), using seat 0. } What the practice editor reads: top-level classes with fields, constructors and methods; it checks their declarations and statement shapes, and reports anything else as not supported. How to compare: the five checks are: a two-parameter constructor (String event, int seat) ; it assigns this.event and this.seat from those parameters; a one-parameter (String) constructor; its first statement is a this(...) call; and that call passes the parameter and then 0. If you then print new Ticket("Gala").seat , it prints 0 .

### mcq

Expected results and why. With Lamp(boolean on) declared, only new Lamp(true) compiles: there is no default constructor, 1 is not a boolean , and a constructor needs new . Retry: Fan declares no constructor, so only new Fan() compiles.
