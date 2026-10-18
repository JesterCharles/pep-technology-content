# Classes and objects

## Objectives

- Define a class with fields and instance methods
- Create several objects with new and explain that each object has its own field values
- Tell a class, an object and a reference variable apart in code

## Teaching

Before any explanation, predict what this program prints. `count++` adds 1 to `count`.

```
class Counter {
    int count;
    void add() { count++; }
}

// inside main:
Counter a = new Counter();
Counter b = new Counter();
a.add();
a.add();
b.add();
System.out.println(a.count + " " + b.count);
```

```
class Lamp {
    boolean on;
    void toggle() { on = !on; }
}

// inside main:
Lamp desk = new Lamp();
Lamp hall = desk;
```

Here `Lamp` is the class, `new Lamp()` creates one object, and `desk` and `hall` are two references to that same object.

A field is declared in the class body with a type and a name, such as `int count;`. An instance method has no `static`; it can read the fields of the object it was called on, and a method that answers yes or no returns `boolean`:

```
class Counter {
    int count;
    boolean isEmpty() {
        return count == 0;
    }
}
```

In `main`, `Counter c = new Counter();` creates an object and `c.count = 5;` sets that object's field. Fields you never set start at a default: `0` for numbers, `false` for `boolean`, `null` for references.

Only `new` creates an object. Assigning one reference variable to another copies the reference, so both variables then refer to the same object.

## Model

The model: a class is the blueprint written in code. It declares fields (data each object holds) and instance methods (actions that work on one object's fields). Writing `new` with the class name creates an object while the program runs; every object gets its own copy of the fields. A reference variable does not hold the object itself; it holds a reference to one object.

## Recap

- A class declares fields and instance methods once; it is the blueprint.
- Each `new` creates a separate object with its own copy of every field.
- A reference variable holds a reference to an object; assigning it to another variable copies the reference, not the object.
- An instance method works on the fields of the object it is called on.

## Cheat sheet

An architect draws one plan for a house. A builder then puts up three houses from that plan on different streets. Painting the door of one house leaves the other doors as they were. A sticky note with a street address is not a house either: it only tells you which house to visit, and two notes can carry the same address.

The plan is the class, each built house is an object, and each address note is a reference.

Where to act: The item shown after Item:, above the three buttons.

Next step: Ask whether the part is written once as a plan, runs to make something new, or only names something that already exists.

Where to act: Inside the braces of `class Book`, under comment 1.

Next step: Each field is one line: the type, then the name, then a semicolon. Leave out `static` so every book gets its own values.

Another hint Another hint, 2 of 3 for Activity 3

Where to act: Under comment 2, still inside `Book`.

Next step: The method's return type is `boolean`, and its body can return the result of comparing `pages` with 300 directly, as `isEmpty()` does with `count`.

Another hint Another hint, 3 of 3 for Activity 3

Where to act: Under comment 3, inside `main`.

Next step: Use the `Counter c = new Counter();` line from the teaching as the pattern, once per book, then set each object's field through its own variable name.

Optional time: about 4 minutes, in addition to this topic's time.

Extend your `Book` class from Activity 3 with an instance method `describe()` that returns a `String` made from the title and the page count. In `main`, set `pages` on both books and print `describe()` for each. Check it in any Java 25 setup you already use.

Success criteria: the two printed lines differ because each object keeps its own field values, and you can point to the line where each object was created.

|  |  |
| --- | --- |
| Declare a class | `class Lamp { boolean on; void toggle() { on = !on; } }` |
| Create an object | `Lamp desk = new Lamp();` |
| Set a field | `desk.on = true;` |
| Call an instance method | `desk.toggle();` |
| Field defaults | `0`, `false`, `null` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 8: Classes: class declarations, fields (8.3) and instance methods (8.4).
- Java Language Specification SE 25, chapter 4: Types, Values, and Variables: reference values and objects (4.3.1) and default field values (4.12.5).
- Java Language Specification SE 25, chapter 15: Expressions: class instance creation with new (15.9).
- Dev.java: Creating Classes: declaring classes, fields and methods.
- Dev.java: Creating and Using Objects: creating objects with new and referring to them through variables.

## Static interaction alternatives

### predict

Expected results and why. The program prints 2 1 . 3 3 : wrong; each object has its own count , so the three calls are not shared. 2 1 : correct; a 's object was added to twice, b 's once. 0 0 : wrong; add() changes the field. 1 2 : wrong; the counts are swapped.

### drag

Expected results and why. class Lamp { ... } : class; it declares the blueprint. new Lamp() : object creation; it builds a new object. desk : reference variable; it holds a reference to the object. boolean on; : class; a field declaration is part of the blueprint. hall : reference variable; it copies the reference from desk , so no new object. Lamp as the first word of Lamp hall = desk; : class; it names the variable's type.

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: in Book , add a String field title , an int field pages , and an instance method isLong() with no parameters that returns true when pages is over 300. In main , create two Book objects with new , each in its own variable, and set a different title on each. Starter, Shelf.java: class Book { // 1. Add a String field named title and an int field named pages. // 2. Add an instance method isLong() that returns true // when pages is over 300. } class Shelf { public static void main(String[] args) { // 3. Create two Book objects with new, each in its own // variable, and give each one a different title. } } What the practice editor reads: top-level classes with fields, constructors and methods; it checks their declarations and statement shapes, and reports anything else as not supported. How to compare: the six checks are: a String field title ; an int field pages ; isLong() is not static , takes no parameters and returns boolean ; it returns a comparison of pages with 300 in which exactly 300 is not long; main declares two Book variables, each created with new Book() ; and each variable's title is set to a different value. If you add a line that prints both titles, two different titles appear.

### mcq

Expected results and why. First code: 2 objects, because two new expressions run and c = a copies a reference. Retry code: 1 object, because only one new runs and y and z copy the reference. Answering 3 counts variables instead of objects.
