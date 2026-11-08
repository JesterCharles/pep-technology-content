# == vs equals

## Objectives

- Predict the result of == and equals on primitives, strings and other objects
- Compare strings for content with equals instead of ==
- Explain why a class must override equals to compare its objects by content

## Teaching

Before any explanation, predict what this program prints.

```
// inside main:
String a = "hi";
String b = new String("hi");
System.out.println(a == b);
```

```
String a = "hi";
String b = new String("hi");
Point p1 = new Point(1, 2);   // Point does not override equals
Point p2 = new Point(1, 2);
Point p3 = p1;
```

To compare the text of two strings, call `equals`:

```
if (answer.equals("yes")) { ... }
if ("yes".equals(answer)) { ... }   // also safe when answer is null
```

Keep `==` for primitives such as `int`, `char` and `boolean`; a primitive has no methods, so `count.equals(0)` does not even compile.

For your own class to be compared by content, it must override `equals` to say which fields matter. Classes that override `equals` must also override `hashCode` so the two agree; you will meet that contract with collections in a later course.

## Model

The model: `==` compares what the two variables hold. For primitives such as `int`, that is the value. For references, that is the arrow: `==` is `true` only when both sides refer to the same object. `equals` is a method that asks whether two objects are meaningfully equal. `String` overrides it to compare characters. A class that does not override `equals` inherits the version from `Object`, which behaves exactly like `==`.

## Recap

- For primitives, `==` compares values.
- For references, `==` is `true` only when both sides refer to the same object.
- Compare string text with `equals`; never rely on `==` between strings.
- A class compares by content only if it overrides `equals`; otherwise `Object.equals` behaves like `==`.

## Cheat sheet

Where to act: The expression shown after Item:, above the two buttons.

Next step: Ask whether the operands are primitives or references. For references, decide whether `==` or an `equals` is used, and whether that class overrides `equals`.

Where to act: The three `if` conditions in `choose`.

Next step: Decide for each condition whether its operands are strings or primitives. Only the string ones change.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Each string condition.

Next step: Replace the `==` operator with a call to the comparison method from the teaching, made on one string with the other as its argument.

Optional time: about 4 minutes, in addition to this topic's time.

In your fixed `Menu`, call `choose(null, 1)` in any Java 25 setup you already use. Predict first whether it returns `unknown` or throws, then change only the order of the operands in your `equals` calls so that a `null` input safely reaches the last line.

Success criteria: `choose(null, 1)` returns `unknown` without an exception, and you can explain why the operand order matters.

|  |  |
| --- | --- |
| Primitives | `count == 0` |
| String text | `answer.equals("yes")` |
| Null-safe text test | `"yes".equals(answer)` |
| Same object? | `a == b`, or `x == null` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Java Language Specification SE 25, chapter 15: Expressions: numerical equality operators (15.21.1) and reference equality operators (15.21.3).
- Java Language Specification SE 25, chapter 3: Lexical Structure: string literals refer to the same String instance (3.10.5).
- Object (Java SE 25 API): equals: Object's version returns true only when both references refer to the same object; classes that override equals should also override hashCode.
- String (Java SE 25 API): equals compares the sequence of characters.

## Static interaction alternatives

### predict

Expected results and why. It prints false . == on references compares identity, and new String("hi") is a different object from the literal, even though the characters are equal.

### drag

Expected results and why. 5 == 5 : true. a == b : false. a.equals(b) : true. p1 == p2 : false. p1.equals(p2) : false, because Point does not override equals . p1 == p3 : true.

### explore

Practice editor, reading version. JavaScript is off, so the editor cannot check code here. Work on paper or in any Java 25 setup you already use. Task: fix the two comparisons that test the text of input so they compare content; keep count == 0 and the signature. Starter, Menu.java: class Menu { static String choose(String input, int count) { if (input == "quit") { return "bye"; } if (count == 0) { return "empty"; } if (input == "help") { return "showing help"; } return "unknown"; } } What the practice editor reads: top-level classes with fields, constructors and methods; it checks declarations and statement shapes, and reports anything else as not supported. How to compare: if you call choose(new String("quit"), 5) , the starter returns unknown because == compares identity; your fixed version must return bye , and choose("x", 0) must still return empty .

### mcq

Expected results and why. Without an override, x.equals(y) prints false : Coin inherits Object.equals , which compares identity. With the override, the code prints true false : equals now compares cents , while == still compares references.
