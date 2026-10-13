# if/else and switch

## Objectives

- Choose between branches with if, else if and else, ordering the conditions correctly
- Write a switch with arrow labels, including a switch expression that yields a value
- Predict fall-through in an old-style colon switch that has no break

## Teaching

### Start with a guess

Practice prediction, not scored.

### The first true branch wins

An `if` / `else if` / `else` chain tests its conditions from the top. Java runs the first branch whose condition is `true` and skips every other branch; `else` catches whatever is left.

So order matters. If `score >= 60` comes first, a score of 95 stops there. Put the narrowest condition first, here the highest threshold, and widen as you go down.

### Two kinds of switch

An old-style switch uses colon labels, `case 1:`. Java jumps to the matching label and keeps running into the next cases until a `break`: this is fall-through.

Arrow labels, `case 1 ->`, run only their own branch and never fall through; `case 2, 3 ->` lists several values. A switch expression yields a value, and must cover every input, usually with `default`:

```
String medal = switch (level) {
    case 1 -> "Bronze";
    case 2 -> "Silver";
    default -> "Gold";
};
```

### Apply it: write a switch expression

Check the arrows, the commas, the semicolons and the default.

## Model

Control flow: highlighted lines are the ones that run.

The code

The ordering and switch activities highlight the lines that run.

## Recap

- if / else if / else runs the first true branch only, so order conditions from narrowest to widest.
- Arrow labels never fall through; a switch expression yields a value and needs every input covered, often with `default`.
- A colon label with no `break` falls through into the next cases.

Next topic: for, while and do-while loops

## Cheat sheet

```
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else {
    grade = "C or below";
}

String size = switch (n) {
    case 1, 2 -> "small";
    case 3 -> "medium";
    default -> "large";
};
```

Switch arrow labels and switch expressions arrived in Java 14; older code mostly uses colon labels with `break`.

## Sources

Checked against these live official sources on 2026-10-13. The switch examples were compiled and run with a real JDK 25.0.4.1.

- JLS SE 25, chapter 14: Blocks, Statements, and Patterns (if, switch)
- JLS SE 25, chapter 15: Expressions (switch expressions)
- Dev.java: Control flow statements
- Dev.java: Branching with switch statements
- Dev.java: Branching with switch expressions
- JEP 361: Switch Expressions

## Static interaction alternatives

### predict

Prediction (practice, not scored): a colon switch with no break statements and level 2. Options: Silver; Silver then Gold; Bronze, Silver then Gold; nothing. Answer: Silver then Gold. Java jumps to case 2 and, with no break, falls through into case 3. It never runs case 1, which comes before the matching label.

### drag

Ordering activity, worked example. The working order is: if (score >= 90) grade = "A"; else if (score >= 80) grade = "B"; else if (score >= 60) grade = "D"; else grade = "F". Then 95 gives A, 85 gives B, 65 gives D and 40 gives F. With score >= 60 first, 95 and 85 would both stop at D, because the first true branch wins.

### explore

Fall-through activity, worked example. Without break, level 1 prints Bronze, Silver and Gold, because execution falls through every later case. Adding break; after case 1 and after case 2 makes level 1 print only Bronze and level 2 only Silver; level 3 prints Gold either way, because it is the last case. The arrow form, case 1 -> System.out.println("Bronze"); and so on, needs no break because arrow labels never fall through.

### mcq

Apply question: which line sets label to S for 1, M for 2 and L otherwise? Options: String label = switch (size) { case 1 -> "S"; case 2 -> "M"; default -> "L"; }; (correct); the same without default (compile error: the switch expression does not cover all possible input values); case 1: "S" with colons (a colon label cannot just name a value; it would need yield); arrows without semicolons (does not compile). Retry: with size 3, case 2, 3 -> "M" matches, so it yields M.
