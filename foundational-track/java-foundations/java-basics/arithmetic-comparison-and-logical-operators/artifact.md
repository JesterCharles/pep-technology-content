# Arithmetic, comparison and logical operators

## Objectives

- Evaluate expressions using arithmetic, remainder and compound assignment operators with correct precedence
- Write boolean conditions with comparison operators and &&, || and !
- Predict when && and || short-circuit and skip evaluating their right side

## Teaching

### Start with a guess

Practice prediction, not scored.

### Which operator goes first

`*`, `/` and `%` bind tighter than `+` and `-`. Operators on the same level go left to right, and parentheses go first.

`%` gives the remainder: `17 % 5` is `2`. A compound assignment works out its right side, then combines: `x += 3` means `x = x + 3`, and `x *= 2 + 1` multiplies `x` by 3. That equivalence holds for simple `int` variables like these; in general, Java also casts the result back to the type of `x` and works out `x` only once.

### Conditions and short-circuits

Comparisons `==`, `!=`, `<`, `<=`, `>` and `>=` give a `boolean`. Combine them with `&&` (both true), `||` (at least one true) and `!` (not).

`&&` skips its right side when the left is `false`; `||` skips it when the left is `true`. That makes a guard safe: `count != 0 && total / count > 50` never divides by zero.

### Apply it to new code

Evaluate left to right, and stop where Java stops.

## Model

Precedence ladder and evaluation trace. The shell is a simulation of jshell.

1. Parentheses `( )`
2. Unary `!` and `-`
3. `* / %`
4. `+ -`
5. `< <= > >=`
6. `== !=`
7. `&&`
8. `||`
9. `= += -= *= /= %=`

Trace

1. Nothing evaluated yet.

Variables

| Name | Type | Value |
| --- | --- | --- |
| Variables appear here while you use the practice jshell. |  |  |

## Recap

- `* / %` before `+ -`, left to right on one level, parentheses first; for a simple `int` variable, `x op= e` means `x = x op (e)`; Java also casts the result back to the type of `x`.
- Comparisons give booleans; `&&`, `||` and `!` combine them.
- `&&` and `||` skip their right side once the answer is known, so put the guard on the left.

Next topic: if/else and switch

## Cheat sheet

|  |  |
| --- | --- |
| `17 % 5` | 2, the remainder |
| `2 + 3 * 4` | 14 |
| `(2 + 3) * 4` | 20 |
| `10 - 4 - 3` | 3: left to right |
| `x -= 2` | `x = x - 2` |
| `a > 0 && b > 0` | both must be true |
| `!done` | true when done is false |

Compare `int`, `double` and `char` values with `==`. Strings are compared with `equals`, which a later topic explains.

## Sources

Checked against these live official sources on 2026-10-13. The practice jshell was checked against a real JDK 25.0.4.1 jshell for every example on this page.

- JLS SE 25, chapter 15: Expressions
- Dev.java: Using operators in your programs
- Dev.java: Summary of operators

## Static interaction alternatives

### predict

Prediction (practice, not scored): int x = 10; x += 5 * 2; Options: 20; 30; 25; 15. Answer: 20. The right side 5 * 2 is worked out first, giving 10, and x += 10 adds it to x. 30 would be (10 + 5) * 2; 25 or 15 would mean only part of the right side was used.

### explore

Evaluation-order activity, worked example for 2 + 3 * 4 - 10 % 4. Step 1: 3 * 4 is 12 (* and % come before + and -, and 3 * 4 is further left than 10 % 4). Step 2: 10 % 4 is 2. Expression now 2 + 12 - 2. Step 3: 2 + 12 is 14 (left to right). Step 4: 14 - 2 is 12. The value is 12.

### terminal

jshell activity, worked example. 17 % 5 prints 2. int total = 10; then total += 5 prints 15. int age = 20; then age >= 18 && age < 65 prints true. int count = 0; then count != 0 && 10 / count > 1 prints false with no exception, because && skips the division; 10 / count > 1 alone throws ArithmeticException: / by zero.

### mcq

Apply question: int count = 0; boolean ok = count > 0 && 10 / count > 2; Options: ok is false and nothing is thrown (correct: count > 0 is false, so && skips the division); ArithmeticException; ok is true; a compile error. Retry with the sides swapped, 10 / count > 2 && count > 0: the division runs first and throws ArithmeticException: / by zero (correct).
