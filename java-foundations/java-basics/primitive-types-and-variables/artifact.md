# Primitive types and variables

## Objectives

- Choose among int, long, double, boolean and char for a value and declare a variable of that type
- Predict the result of integer division, overflow and a narrowing cast
- Tell a declaration from an assignment and use var only where the type is obvious

## Teaching

### Start with a guess

Practice prediction, not scored.

### A variable is a typed box

Java checks that each value fits its variable's type. Five primitive types cover most beginner work:

- `int`: whole numbers up to about ±2.1 billion.
- `long`: bigger whole numbers; write an `L` after the literal, as in `8100000000L`.
- `double`: numbers with a fractional part, such as `19.99`.
- `boolean`: `true` or `false`.
- `char`: one character in single quotes, such as `'B'`.

Declare a variable with its type and name: `int seats = 28;`

### Declare, assign, and three surprises

`int n = 5;` declares `n`; `n = 7;` assigns a new value to it. `var price = 19.99;` lets the compiler infer `double`; use `var` only when the right side makes the type obvious.

- Integer division drops the fraction: `7 / 2` is `3`. Make one side a `double` (`7 / 2.0`) to keep it.
- Overflow wraps silently: `Integer.MAX_VALUE + 1` is a large negative number.
- A narrowing cast cuts the fraction off: `(int) 3.99` is `3`.

`jshell`, the JDK's interactive shell, prints each result as `name ==> value`.

### Apply it to new code

Work out the type of each part before the value.

## Model

Typed boxes: each variable has a name, a type and one value. The shell is a simulation of jshell.

| Name | Type | Value |
| --- | --- | --- |
| Variables appear here while you use the practice jshell. |  |  |

Last result: none yet.

## Recap

- Choose `int` for counts, `long` for very large whole numbers, `double` for fractions, `boolean` for yes or no, `char` for one character.
- int ÷ int stays an int; int overflow wraps without an error; `(int)` on a `double` cuts the fraction off.
- A declaration names a type; an assignment changes the value; `var` only where the type is obvious.

Next topic: Strings and string methods

## Cheat sheet

|  |  |
| --- | --- |
| `int seats = 28;` | declaration with a starting value |
| `seats = 30;` | assignment: no type the second time |
| `long big = 8100000000L;` | L marks a long literal |
| `double avg = 175 / 2.0;` | 87.5: one double operand keeps the fraction |
| `(int) 3.99` | 3: narrowing cast truncates |
| `var name = "Ana";` | inferred String; the type is obvious |

Java has three more primitive types, `byte`, `short` and `float`, which this course does not need yet.

## Sources

Checked against these live official sources on 2026-10-13. The practice jshell was checked against a real JDK 25.0.4.1 jshell for every example on this page.

- JLS SE 25, chapter 4: Types, Values, and Variables
- JLS SE 25, chapter 5: Conversions and Contexts
- Dev.java: Primitive data types
- Dev.java: Creating variables and naming them
- Dev.java: Using the var type identifier

## Static interaction alternatives

### predict

Prediction (practice, not scored): what does int half = 7 / 2; store? Options: 3.5; 3; 4; a compile error. Answer: 3. Both operands are int, so Java does integer division and drops the fraction; it does not round up to 4, and the result fits an int, so there is no error. 3.5 would need a double operand and a double variable.

### drag

Sorting activity, worked example. Seats in a classroom, 28: int, a small whole number. Milliseconds since 1970, 1760000000000: long, a whole number far beyond int's limit of about 2.1 billion. Average score, 87.5: double, it has a fractional part. Has paid, yes or no: boolean. Grade letter B: char, one character in single quotes.

### terminal

jshell activity, worked example. int n = 5; prints n ==> 5, and n = 7 prints n ==> 7 (declaration, then assignment). 7 / 2 prints $3 ==> 3, while 7 / 2.0 prints 3.5. Integer.MAX_VALUE + 1 prints -2147483648 (overflow wraps). (int) 3.99 prints 3 (the cast truncates). int big = 3000000000; is a compile error: integer number too large.

### mcq

Apply question: double avg = (90 + 85) / 2; Options: 87.5; 87.0 (correct: 175 / 2 is int division, giving 87, which is then widened to the double 87.0); 87; a compile error. Retry: to get 87.5, divide by 2.0 so the division is done in double (correct); declaring avg with var, casting with (int) or using long all keep or add integer arithmetic.
