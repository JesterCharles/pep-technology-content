# Encapsulation with getters and setters

## Objectives

- Hide fields behind private access and expose them through getters
- Write a setter or method that validates input and rejects an invalid state
- Decide when a field should have no setter at all

## Teaching

Before any explanation, predict what this program prints.

```
class Player {
    int lives = 3;
}

// inside main:
Player p = new Player();
p.lives = -5;
System.out.println(p.lives);
```

Not every field deserves a setter. A value fixed at creation is set once in the constructor and never again. A value that changes only by rules, such as a balance, changes through methods named for those actions, such as `deposit`.

A setter checks its argument before it changes the field. To refuse a value, it can throw an exception: the statement `throw new IllegalArgumentException("message");` stops the method at once and reports the bad argument to the caller, so the field keeps its old valid value. Exceptions get a full module later; here you need only this one statement.

```
class Player {
    private int lives = 3;

    public int getLives() {
        return lives;
    }

    public void setLives(int lives) {
        if (lives < 0) {
            throw new IllegalArgumentException("lives must be 0 or more");
        }
        this.lives = lives;
    }
}
```

Apply the setter decision to a new class.

## Model

The model: encapsulation makes the fields `private` and lets other classes reach the data only through methods the class controls. A getter such as `getLives()` returns a field's value. A setter such as `setLives(int lives)` changes it, and can refuse a value that would leave the object in an invalid state.

## Recap

- Encapsulation: fields are `private`, and other classes reach the data only through methods the class controls.
- A getter returns a field's value; a setter changes it after checking the new value.
- A setter can refuse a bad value with `throw new IllegalArgumentException(...)`, before the field changes.
- Give a field no setter when it is fixed at creation or changes only by a rule through action methods.

## Cheat sheet

Where to act: The field shown after Item:, above the three buttons.

Next step: Ask two questions: may the value change after the object is created at all, and if so, may a caller set it to any new value or only move it by a rule?

A hotel keeps guest keys behind the front desk instead of on an open hook board. A guest who asks gets their key handed over. Someone who asks for a key to a room that does not exist is turned away, and the board stays exactly as it was.

The desk is the class: values go out through one window, and requests to change them are checked before anything changes.

Where to act: The field line, then the space under comments 2 and 3.

Next step: Follow the `Player` example member by member: the field, then a getter with the same type as the field, then a setter with one parameter.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The setter's body, under comment 3.

Next step: The check comes first and must catch values on either side of the allowed range: build one `if` condition from two comparisons joined by `||`. Only after the `if` does the field change.

Optional time: about 5 minutes, in addition to this topic's time.

Write the `ClickCounter` from Activity 2: a private `count` field, a getter, and action methods `click()` and `reset()`, with no setter. Try it in any Java 25 setup you already use.

Success criteria: no code outside the class can make `count` negative or skip a number, and you can explain why leaving out a setter achieves that.

|  |  |
| --- | --- |
| Private field | `private int lives = 3;` |
| Getter | `public int getLives() { return lives; }` |
| Refuse a value | `throw new IllegalArgumentException("...");` |
| Setter | Check the argument first, then `this.lives = lives;` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 6: Names: private access control (6.6).
- Java Language Specification SE 25, chapter 14: Blocks, Statements, and Patterns: the throw statement (14.18) completes abruptly, so the statements after it do not run.
- IllegalArgumentException (Java SE 25 API): thrown to indicate that a method has been passed an illegal or inappropriate argument.
- Dev.java: More on Classes: controlling access to members and keeping fields private.

## Static interaction alternatives

### predict

Expected results and why. It prints -5 . The field is open to direct assignment, and Java performs no check, so the nonsense value is stored. It is not 3, 0 or an exception.

### drag

Expected results and why. Account id : no setter, set once in the constructor. Account balance : no setter; changed by deposit and withdraw . Customer email : validating setter. Thermostat targetTemperature : validating setter. Order createdAt : no setter, set once in the constructor. Counter count : no setter; changed by click() and reset() .

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: make target private; add a public getter getTarget() ; add a public setter setTarget(int target) that throws IllegalArgumentException when the value is below 10 or above 30, and otherwise stores it. Starter, Thermostat.java: class Thermostat { // 1. Make this field private. int target = 20; // 2. Add a public getter getTarget(). // 3. Add a public setter setTarget(int target) that throws // IllegalArgumentException below 10 or above 30. } What the practice editor reads: top-level classes with fields, constructors and methods; it checks declarations and statement shapes, and reports anything else as not supported. How to compare: try the values 9, 10, 30 and 31 in your head. 10 and 30 must be stored; 9 and 31 must throw before the field changes, so getTarget() still returns the old value.

### mcq

Expected results and why. loanNumber identifies the loan and never changes, so it gets no setter and is set in the constructor; renewals changes by a rule; borrowerNote may be edited. Retry: status moves only forward through packed, shipped and delivered, so action methods should change it; trackingCode never changes and deliveryInstructions suits a setter.
