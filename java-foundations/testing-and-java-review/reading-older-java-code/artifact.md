# Reading older Java code (8, 11, 17)

## Objectives

- Recognize which Java release a feature needs, such as lambdas (8), var (10), switch expressions (14) and records (16)
- Rewrite an older idiom, such as an anonymous class or a colon switch, in its modern form
- Inspect a short Java 8, 11 or 17 example, predict whether it compiles on JDK 25, and name the feature or migration issue behind the prediction

## Teaching

### Activity 1 of 3: Predict which release a snippet needs

Before any explanation: you find this code in a project. Predict the oldest JDK release whose standard language features include everything it uses.

```
var label = switch (day) {
    case 6, 7 -> "weekend";
    default -> "weekday";
};
```

### Activity 2 of 3: Rewrite an anonymous class as a lambda

Each release added features you will meet in older code: lambdas in 8, `var` for local variables in 10, switch expressions with `case X ->` labels in 14, text blocks in 15, and records and `instanceof` patterns in 16.

Before Java 8, a one-method interface such as `Runnable` was filled in with an anonymous class: `new Runnable() { public void run() { … } }`. A lambda states the same thing as parameters, an arrow and a body: `Runnable hello = () -> System.out.println("hi");`. Likewise, a colon `switch` with `break`s often becomes a switch expression.

Refactor with tests in place: the behavior must not change.

### Activity 3 of 3: Predict whether old code compiles on JDK 25

Old source often compiles on a new JDK unchanged, but not always. When you inspect old code, look for three kinds of trouble:

- Removed APIs and modules. JDK 11 removed the Java EE and CORBA modules, including JAXB (`javax.xml.bind`); code importing them no longer compiles without adding a library.
- Removed tools and options, such as `javah`, removed in JDK 10.
- New reserved words. `var` is only a reserved type name, so a variable called `var` still compiles.

Name the cause, not just “old code”.

## Recap

- Feature releases to recognize: lambdas 8, `var` 10, switch expressions 14, text blocks 15, records and `instanceof` patterns 16.
- An anonymous class for a one-method interface usually becomes a lambda; a colon `switch` with `break`s often becomes a switch expression.
- Refactor under tests: run them before and after, and keep them unchanged.
- Old code often compiles on JDK 25, but removed APIs such as JAXB (gone since JDK 11), removed tools and options can break it; name the cause.

## Cheat sheet

Where to act: The two newest-looking pieces: the word `var` and the `switch` that produces a value.

Next step: Each piece arrived in its own release; the snippet needs whichever of the two came later.

An old recipe card says: take the stand mixer down from the shelf, plug it in, fit the whisk, and whisk two eggs. A newer card in the same box just says: whisk two eggs. Both make the same omelette; the second leaves out the ceremony.

A lambda is the shorter card: it keeps the one action and drops the surrounding boilerplate.

Where to act: The right-hand side of `static Comparator<String> byLength =`.

Next step: Keep only the parts that carry meaning: the two parameter names from `compare`, then an arrow, then what the method returns.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: After the arrow in your lambda.

Next step: A single expression needs no braces and no `return`; reuse the expression from the old `return` line exactly.

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Optional time: about 3 minutes, in addition to the required activity.

On paper or in your IDE, rewrite this colon `switch` as a switch expression that assigns `label` directly:

```
String label;
switch (day) {
    case 6:
    case 7:
        label = "weekend";
        break;
    default:
        label = "weekday";
}
```

Success criteria: Your version has no `break`, uses `case … ->` labels, and gives the same label for every day from 1 to 7.

Where to act: The `import` line.

Next step: Ask which part of the JDK the package `javax.xml.bind` belonged to, and whether that part still ships with JDK 25.

```
// Java 7: anonymous class
Runnable old = new Runnable() {
    @Override
    public void run() { System.out.println("hi"); }
};
// Java 8+: lambda
Runnable now = () -> System.out.println("hi");

// Java 10+: var for local variables
var names = new ArrayList<String>();

// Java 14+: switch expression
String size = switch (n) {
    case 1, 2 -> "small";
    default -> "large";
};
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. Release numbers come from each feature’s JEP. The practice runner checks behavior with the provided test; it does not know every javac rule.

- Dev.java: The Evolution of the Java Language — lambdas in Java 8 and var in Java 10
- JEP 126: Lambda Expressions — release 8
- JEP 286: Local-Variable Type Inference — release 10; var is a reserved type name, not a keyword
- JEP 361: Switch Expressions — release 14
- JEP 378: Text Blocks — release 15
- JEP 394: Pattern Matching for instanceof — release 16
- JEP 395: Records — release 16
- JDK 25 Migration Guide: Removed Tools and Components — Java EE and CORBA modules, including JAXB, removed in JDK 11; javah removed in JDK 10
- JDK 25 Migration Guide: Preparing for Migration — try existing code on the new JDK first; most code works without changes, and some libraries need upgrades

## Static interaction alternatives

### predict

Question: What is the oldest release that accepts it?. Option A: Java 8 - Not quite. Java 8 brought lambdas, but it had neither var nor a switch that yields a value. Option B: Java 10 - Not quite. Java 10 added var for local variables, but arrow case labels in a switch expression were not standard yet. Option C: Java 14 - Correct. var arrived in Java 10, and switch expressions with arrow labels became standard in Java 14, so Java 14 is the oldest release with both. Option D: Java 17 - Not quite. Java 17 accepts it, but so did Java 14 and 15, so 17 is not the oldest. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Practice JUnit editor. NamesTest.java holds class Names with a static Comparator of String named byLength, written as an anonymous class whose compare method returns Integer.compare of the two lengths, and a provided test checking that Bo sorts before Ada, Grace after Ada, and Ada equal to Eve. Task: replace the anonymous class with a lambda that compares the same way, keeping the test unchanged and passing. Checks: byLength is a lambda with no anonymous class left; the test passes; the test keeps its three checks.

### mcq

Question: Does it compile on JDK 25?. Option A: Yes: Java keeps every old API, so Java 8 code always compiles unchanged - Not quite. Most old source compiles, but some APIs and modules have been removed; this import is one of them. Option B: No: javax.xml.bind is JAXB, a Java EE module removed from the JDK in JDK 11, so javac reports that the package does not exist - Correct. JAXB left the JDK in JDK 11. The fix is to add a JAXB library as a dependency, or to use an API that is still in the JDK. Option C: No: array initializers such as {10, 11} were removed in a later release - Not quite. Array initializers are still ordinary Java; the problem is the import. Option D: Yes: JDK 25 downloads a missing package the first time it is imported - Not quite. The JDK never fetches libraries; a build tool such as Maven does that once you declare a dependency. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
