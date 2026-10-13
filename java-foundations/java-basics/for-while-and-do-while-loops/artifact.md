# for, while and do-while loops

## Objectives

- Write a for loop with the correct start, condition and update for a counted task
- Choose while or do-while for a loop whose repeat count is not known in advance
- Trace a loop to find an off-by-one error and use break and continue on purpose

## Teaching

### Start with a guess

Practice prediction, not scored.

### Three parts of a for loop

`for (int i = 1; i <= 5; i++)` has a start, a condition and an update. Java runs the start once, then checks the condition before every pass; while it is `true` the body runs, then the update.

Off-by-one errors live at the edges. `i < 5` stops before 5, and `i <= 5` includes it. Trace the first and the last pass to check.

### while, do-while, break and continue

When you do not know the number of passes in advance, use `while (condition) { ... }`: it checks first, so it may run zero times. `do { ... } while (condition);` checks after the body, so it always runs at least once, as when you ask for input before you can test it.

Inside any loop, `continue` skips the rest of this pass and goes on to the next; `break` leaves the loop at once.

### Apply it: choose the loop

Ask whether the body must run at least once.

## Model

Loop trace: each pass checks the condition first, then runs the body.

for (…; …; …)

1. The loop activities trace each pass here.

Output

## Recap

- A counted task uses `for`: start, condition, update; check the first and last pass for off-by-one errors.
- An unknown count uses `while`, or `do-while` when the body must run at least once.
- `continue` skips to the next pass; `break` leaves the loop.

Module complete. Next: the Java Basics coding lab, in its README.

## Cheat sheet

```
for (int i = 1; i <= 5; i++) { ... }   // 1, 2, 3, 4, 5
for (int i = 0; i < 5; i++) { ... }    // 0, 1, 2, 3, 4
while (balance < goal) { ... }        // may run 0 times
do { ... } while (!valid);            // runs at least once
```

A condition that never becomes false loops forever; make sure each pass moves toward the end. An enhanced for loop over arrays and lists comes in a later module.

## Sources

Checked against these live official sources on 2026-10-13. The loop examples were compiled and run with a real JDK 25.0.4.1.

- JLS SE 25, chapter 14: the for, while, do, break and continue statements
- Dev.java: Control flow statements

## Static interaction alternatives

### predict

Prediction (practice, not scored): for (int i = 0; i < 3; i++) System.out.print(i); Options: 012; 123; 0123; nothing. Answer: 012. i starts at 0, and the condition i < 3 is checked before each pass, so the body runs for 0, 1 and 2 and stops when i reaches 3.

### explore

Loop-building activity, worked example. for (int i = 1; i <= 5; i++) prints 1 2 3 4 5: it checks 1 to 5, and stops when i is 6. With i < 5 it prints only 1 2 3 4, an off-by-one error; starting at 0 adds a 0. for (int i = 2; i <= 10; i += 2) prints 2 4 6 8 10.

### explore

break and continue activity, worked example. for (int i = 1; i <= 5; i++) { if (i == 3) continue; if (i == 5) break; System.out.println(i); } prints 1 2 4: continue skips printing 3 and moves on to 4, and break leaves the loop when i is 5, before printing it. With break in the first blank the loop would stop at 3 and print only 1 2.

### mcq

Apply question: ask for a PIN until it is correct; the prompt must appear at least once. Options: do-while (correct: the body runs once before the condition is checked); while, which checks before the first prompt; for with a fixed count, which cannot know how many tries; no loop. Retry: reading lines from a file that may be empty fits while, which checks first and can run zero times.
