# Python syntax for Java developers

## Objectives

- Rewrite a short Java method body that uses variables, if/elif/else and for and while loops as Python, using indentation instead of braces and no type declarations
- Predict the output of short Python snippets that depend on dynamic typing, truthiness and true division (/) versus floor division (//)
- Compare values with == and test for None with \`is None\`, and explain how this differs from Java's equals(), == and null

## Teaching

### Start with a guess

Practice prediction, not scored. You know Java; guess how Python treats the same line.

### Blocks by indentation, no types

Python drops braces, semicolons and type declarations. Assignment is just `steps = 0`.

A colon ends each `if`, `elif`, `else`, `for` and `while` line, and the indented lines under it are the block (four spaces by convention). `else if` is spelled `elif`.

There is no `++`: write `steps += 1`. `&&`, `||` and `!` become `and`, `or` and `not`.

A for-each loop reads `for s in scores:`, and `for i in range(n):` counts 0 up to n - 1.

### Values carry types; / always gives a float

A name can hold any type, and the type travels with the value: `x = 5` then `x = "five"` is legal; `type(x)` reports it.

`/` is true division and always returns a float: `6 / 2` is `3.0`. `//` is floor division: it rounds down, toward negative infinity, so `-7 // 2` is `-4`, where Java gives `-3`.

In `if` and `while`, zero and empty values count as false: `0`, `0.0`, `""`, `[]` and `None`. Almost everything else counts as true, including `"0"` and `[0]`.

### Equality, identity and None

`==` compares values, like Java's `equals()`: `"ab" == "a" + "b"` is `True`, and so is `[1, 2] == [1, 2]`.

`is` asks whether two names point to the very same object, like Java's `==` on references.

`None` plays the role of `null`. There is only one `None` object, so test it with `x is None` or `x is not None`. Do not use `is` to compare strings or numbers: Python warns, and the answer depends on how objects happen to be stored, not on their values.

## Model

The Java and Python for this step. Python results in this panel are from real Python 3 for these exact snippets.

Java

```
int half = 7 / 2;
System.out.println(half);  // 3
```

Python

```
half = 7 / 2
print(half)
```

Java

```
String describe(int n) {
    int steps = 0;
    while (n > 1) {
        n = n / 2;
        steps++;
    }
    if (steps == 0) {
        return "tiny";
    } else if (steps < 4) {
        return "small";
    } else {
        return "large";
    }
}
```

| Call | Java returns |
| --- | --- |
| describe(1) | "tiny" |
| describe(10) | "small" |
| describe(100) | "large" |

| Expression | Result | Type |
| --- | --- | --- |
| Nothing run yet. |  |  |

| Question | Java | Python |
| --- | --- | --- |
| Same value? | a.equals(b) | a == b |
| Same object? | a == b | a is b |
| No value? | x == null | x is None |

| Java | Python |
| --- | --- |
| { } blocks | colon + indentation |
| else if | elif |
| i++ | i += 1 |
| 7 / 2 is 3 | 7 / 2 is 3.5; 7 // 2 is 3 |
| null | None, tested with is |

## Recap

- Blocks are a colon plus indentation; `elif`, no `++`, no type declarations.
- `/` always gives a float; `//` floors toward negative infinity.
- Zero, empty and `None` count as false in a condition.
- `==` compares values; `is` compares identity; test `is None`.

Next topic: Functions and arguments

## Cheat sheet

Picture a thermometer that only shows whole degrees, read by two people. The first always reports the mark just below the top of the column, even on a freezing day: three and a half degrees below zero is read as four below. The second simply ignores the half, so the same reading becomes three below. On warm days they always agree; they only differ once the temperature drops below zero.

Python's floor division reads like the first person, always stepping down; Java's integer division reads like the second, stepping toward zero.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: Click in the describe.py editor (or Tab to it) and edit the code. Tab indents; Escape, then Tab, leaves the editor.
2. What to do or type: Press Run (or Ctrl+Enter in the editor). The Problems panel lists each line Python would reject; press a problem to jump to its line.
3. What to expect: Fix the lines and run again. Once nothing is flagged, Output compares each call's result with the Java's.
4. How to know it's done: Each goal changes from open to done. If a result differs, the feedback points at the line to check; Reset code restores the start.

1. Where to look: Start in Translate the Java for loop, then use the division and truthiness controls below it.
2. What to do or type: Rewrite the shown counting loop with `range`, a colon and four-space indentation, then press Check translation.
3. What to expect: The bounded checker names any missing loop structure; the other controls print real Python results for their listed inputs.
4. How to know it's done: The four goals above read done, including the translated loop, and Continue appears.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `if x > 0:` / `elif` / `else:` | branches |
| `for s in scores:` | for-each loop |
| `for i in range(n):` | 0 to n - 1 |
| `while n > 1:` | while loop |
| `count += 1` | instead of `count++` |
| `7 / 2`, `7 // 2`, `7 % 2` | 3.5, 3, 1 |
| `and`, `or`, `not` | `&&`, `\|\|`, `!` |
| `x is None` | `x == null` |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. Error and warning text shown is from Python 3.14 and can differ slightly in older versions.

- Python tutorial: An informal introduction (numbers, / and //, while)
- Python tutorial: More control flow tools (if, elif, for, range)
- Language reference: Lexical analysis (indentation)
- Built-in types: truth value testing and numeric operations
- Language reference: Expressions (value and identity comparisons)
- Programming FAQ: relying on identity tests with is

## Static interaction alternatives

### predict

Prediction (practice, not scored): Python runs half = 7 / 2 then print(half). Options: 3; 3.5; 4; an error because half has no declared type. Answer: 3.5. In Python, / is true division and always returns a float, even for two ints. // is the floor-division operator that gives 3. Python never rounds 3.5 up to 4 here, and a name needs no type declaration.

### explore

Editor activity in a lesson simulator (it checks and runs only this exercise; it is not real Python). Starting code, a half-finished translation with Java habits: def describe(int n) { / int steps = 0 / while (n > 1) { / n = n / 2 / steps++ / then if steps == 0: return "tiny" / else if steps < 4: return "small" / else: return "large". The Problems panel flags five lines Python rejects: the { at the end of the def and while lines (Python ends a block line with a colon), the int type declaration, steps++ (write steps += 1), and else if (write elif); after the def line is fixed, int n in the parameters is flagged too (write just n). Run refuses to run while any syntax error remains, as Python does. Once the file is valid, Run calls describe(1), describe(10) and describe(100), which the Java returns as tiny, small and large. With n = n / 2 the result is tiny, large, large: / makes n a float, so 10 halves to 5.0, 2.5, 1.25 and 0.625 in 4 steps. With n = n // 2 it matches: 10, 5, 2, 1 in 3 steps. Working Python: def describe(n): / steps = 0 / while n > 1: / n = n // 2 / steps += 1 / if steps == 0: return "tiny" / elif steps < 4: return "small" / else: return "large", each block line ending with a colon and its body indented four spaces.

### explore

For-loop translation activity: translate Java for (int i = 0; i < 5; i++) { total += i; } as a Python for statement using range(5), a colon and an indented total += i body. Expected: the bounded check reports all three structures found; it does not run arbitrary Python.

### explore

Division and truthiness activity, with results from real Python 3: 7 / 2 is 3.5; 6 / 2 is 3.0 (a float even when it divides evenly); 7 // 2 is 3; -7 // 2 is -4 (floor rounds toward negative infinity; Java's -7 / 2 is -3); 7.0 // 2 is 3.0; 7 % 2 is 1; -7 % 2 is 1. In an if: 0, 0.0, empty string, empty list and None are treated as false; "0" (a one-character string) and [0] (a list holding one item) are treated as true.

### mcq

Apply question: translate the Java condition name == null || !name.equals("admin") into Python. Options: if name is None or name != "admin": (correct: is None tests for no value, != compares values, or replaces ||); if name == null or not name.equals("admin"): (null is not a Python name and str has no equals method); if name is None || name != "admin": (|| is not Python syntax); if name is not "admin": (compares identity with a string literal, which Python warns about, and drops the None test). Retry: after a = [1, 2] and b = [1, 2], print(a == b, a is b) shows True False: equal values, two separate list objects.
