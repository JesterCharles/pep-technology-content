# Access modifiers

## Objectives

- Apply private, package-private, protected and public to fields and methods
- Predict whether code in another class or package compiles against a given modifier
- Choose the most restrictive access that still lets the code work

## Teaching

Before any explanation, predict what happens. These are two files in two different packages.

```
// File shop/Item.java
package shop;

public class Item {
    int price;
}

// File app/Main.java
package app;

import shop.Item;

public class Main {
    public static void main(String[] args) {
        Item item = new Item();
        item.price = 5;
    }
}
```

| Modifier | Usable from |
| --- | --- |
| `public` | any class in any package |
| `protected` | its package, plus subclasses in other packages (subclasses come in a later module) |
| no modifier | only its own package (package access) |
| `private` | only inside its own top-level class |

To be used from another package, the class itself must also be `public`.

Give each member the narrowest access that still lets every real use compile. A narrow member can change later without breaking other classes, because no other class could depend on it.

- Used only inside its own class: `private`.
- Also used by other classes in the same package: no modifier.
- Needed by other packages: `public`, chosen on purpose.

Choose from who really uses the member, not from who might one day want it.

## Model

The model: each field, method and constructor carries one of four access levels, from widest to narrowest. The compiler rejects any use from outside the allowed area.

## Recap

- `private`: only its own class. No modifier: its package. `protected`: its package plus subclasses elsewhere. `public`: everywhere.
- Access is checked by the compiler; a forbidden use is a compile error, not a run-time error.
- A class used from another package must itself be `public`.
- Choose the narrowest access that lets every real use compile.

## Cheat sheet

Where to act: The situation shown after Item:, above the two buttons.

Next step: Find the member's modifier, then ask two questions in order: is the using class in the same package, and is it inside the same class?

Where to act: Each line in `Thermostat` that begins with `public`.

Next step: For each member, search the file for who uses it: only code inside `Thermostat`, or also `Room`?

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The two methods that `Room` calls.

Next step: `Room` sits in the same file, so in the same package. Look back at the table for the narrowest level that still includes the rest of the package.

|  |  |
| --- | --- |
| Hide data | `private double balance;` |
| Package only | `int restock()` (no modifier) |
| Everyone | `public double balance()` in a `public` class |
| Rule of thumb | Start `private`; widen only for a real caller |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 6: Names: access control (6.6), including package access, protected access (6.6.2) and private access.
- Java Language Specification SE 25, chapter 8: Classes: class and member modifiers (8.1.1, 8.3.1, 8.4.3) and the default constructor's access (8.8.9).
- Dev.java: More on Classes: controlling access to members of a class, with the access-level table.

## Static interaction alternatives

### predict

Expected results and why. The compiler rejects item.price = 5; : price has no modifier, so it has package access, and Main is in package app . new Item() is fine, because the default constructor of a public class is public . Access is a compile-time check, so nothing is thrown at run time.

### drag

Expected results and why. Private pin used by another method of Safe : compiles. Private pin read by Thief in the same package: does not compile. Package-access size read by shop.Shelf : compiles. Package-access size read by app.Main : does not compile. Public size of a public class read by app.Main : compiles. Protected size read by app.Main , not a subclass: does not compile. Protected size read by shop.Shelf : compiles; protected includes the package.

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper. Task: change only the modifiers inside Thermostat so each member has the narrowest access that still lets this file compile. Leave Room unchanged, and assume no code outside this file uses Thermostat . Starter, Room.java: class Thermostat { public int target = 20; public int current = 18; public void setTarget(int t) { target = clamp(t); } public int reading() { return current; } public int clamp(int t) { return Math.max(10, Math.min(30, t)); } } class Room { void evening(Thermostat t) { t.setTarget(21); System.out.println(t.reading()); } } What the practice editor reads: top-level classes with fields, constructors and methods; it checks the modifiers and statement shapes, and reports anything else as not supported. How to compare: for each member, list every class that uses it. A member used only inside Thermostat passes when it is as narrow as Java allows; a member that Room uses passes when it is the narrowest level that still includes another class in the same package; Room must keep both calls.

### mcq

Expected results and why. formatCents is used only inside Invoice , so private . Retry: restock() is used by Store in the same package, so no modifier (package access); private would block Store , and protected or public would open it wider than needed.
