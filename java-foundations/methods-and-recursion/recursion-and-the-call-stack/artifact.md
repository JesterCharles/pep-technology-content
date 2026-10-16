# Recursion: base case and the call stack

## Objectives

- Write a recursive method with a base case and a recursive step that moves toward it Open
- Trace the call stack of a recursive method, frame by frame, including the returns Open
- Explain why a missing or unreachable base case ends in StackOverflowError Open

## Teaching

### Activity 1 of 3: Predict what a method that calls itself returns

Before any explanation, read this program. The method `sum` calls itself. Predict what it prints.

```
public class Main {
    static int sum(int n) {
        if (n == 0) {
            return 0;
        }
        return n + sum(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sum(3));
    }
}
```

### Activity 2 of 3: Trace the call stack, including the returns

Each time a method is called, the Java Virtual Machine pushes a new frame onto the call stack: a private area holding that call’s parameters and local variables. A recursive call therefore gets its own `n`. The calling frame waits, paused in the middle of its `return` line, until the call it made returns. When a call returns, its frame is popped and the returned value is handed to the frame below.

A recursive method has a base case, which returns without calling itself, and a recursive step, which calls itself on a smaller problem.

The call stack while sum(3) runs Four stacked frames. main is at the bottom, then sum(3), sum(2) and sum(1), with sum(0) on top marked as the base case. Arrows on the right show the returns flowing back down: sum(0) returns 0, sum(1) returns 1, sum(2) returns 3 and sum(3) returns 6. sum(0): base case sum(1): n = 1 sum(2): n = 2 sum(3): n = 3 main returns 0 returns 1 returns 3 returns 6

Calls push frames upward until the base case; each return pops one frame and hands its value down. Text version: main calls sum(3), which calls sum(2), sum(1) and sum(0); sum(0) returns 0, then sum(1) returns 1 + 0 = 1, sum(2) returns 2 + 1 = 3 and sum(3) returns 3 + 3 = 6.

### Activity 3 of 3: Write a recursive method with a base case

To write a recursive method, first decide the base case: the simplest input you can answer directly. Then write the recursive step so that every call moves toward it. In this bounded activity, use an `int n` parameter, the equality base `n == 0`, and the step `n - 1`; that relationship makes the direction observable.

If the base case is missing, or the step never reaches it (such as passing `n + 1`), every call pushes another frame. The stack has a limited size, so the program ends with `java.lang.StackOverflowError`, which Java throws when an application recurses too deeply.

## Recap

- A recursive method has a base case that returns directly and a recursive step that calls itself on a smaller problem.
- Every call pushes a frame with its own parameters; every return pops it and hands the value to the waiting frame below.
- A missing or unreachable base case keeps pushing frames until the stack runs out: `StackOverflowError`.

## Cheat sheet

Where to act: Start with the smallest case the method handles, `sum(0)`.

Next step: Read the `if`: work out what `sum(0)` returns without calling anything else.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Now use `return n + sum(n - 1);` for `sum(1)`, then `sum(2)`.

Next step: Build each answer from the one below it until you reach `sum(3)`.

People wait in a queue and the last person wants to know how many people stand ahead. They ask the person in front, who asks the person in front of them, and so on. The person at the very front answers “nobody”. Each answer then travels back down the queue, with every person adding one before passing it on.

Each waiting person is a frame, and the front of the queue is the base case.

Where to act: Step until the status line says that sum returns 1.

Next step: Look at the call stack pane at that exact step and read every `sum` entry.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Count only the `sum` frames, not `main`.

Next step: Remember that the frame for `sum(0)` was popped when it returned, one step earlier.

Where to act: Start on the blank line under the comments, before writing any recursive call.

Next step: Write an `if` that tests for the simplest input, such as `n == 0`, and returns an answer directly inside it.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: After that `if`, inside the same method.

Next step: Write the line that calls the method itself with a smaller argument, such as `n - 1`, and combines that result with `n` or prints `n`.

Optional time: about 5 minutes, in addition to the required activity.

Success criteria: Write a recursive method that counts the digits of a positive `int` (for example 4096 has 4 digits) using `/ 10`, and test it with 7, 10 and 4096.

```
static int sum(int n) {
    if (n == 0) {          // base case: answer directly
        return 0;
    }
    return n + sum(n - 1); // recursive step: smaller problem
}
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Java Virtual Machine Specification SE 25, Chapter 2 (2.5.2 Java Virtual Machine Stacks, 2.6 Frames) — a new frame is created each time a method is invoked and destroyed when it completes
- Java Language Specification SE 25, Chapter 15 (15.12.4 Run-Time Evaluation of Method Invocation) — argument values and a new activation frame per invocation
- Java SE 25 API: java.lang.StackOverflowError — thrown when a stack overflow occurs because an application recurses too deeply

## Static interaction alternatives

### predict

Question: What does the program print? Option A: 6 — Correct. sum(0) returns 0, so sum(1) is 1 + 0, sum(2) is 2 + 1 and sum(3) is 3 + 3 = 6. Option B: 3 — Not quite. 3 is only the n of the first call; that call also adds whatever sum(2) returns. Option C: 0 — Not quite. 0 is returned by the innermost call only; each waiting call adds its own n on the way back. Option D: It never stops and ends in StackOverflowError — Not quite. Each call passes n - 1, so the argument reaches 0, where the if returns without calling again. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Static trace of the program (every call and every return):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | call main | `—` |
| 2 | call sum | `n = 3` |
| 3 | call sum | `n = 2` |
| 4 | call sum | `n = 1` |
| 5 | call sum | `n = 0` |
| 6 | sum returns 0 | `n = 0` |
| 7 | sum returns 1 | `n = 1` |
| 8 | sum returns 3 | `n = 2` |
| 9 | sum returns 6 | `n = 3` |
| 10 | main returns | `—` |

Printed output: `6`

### mcq

Question: When sum(1) is about to return 1, how many sum frames are on the stack? Option A: 1 — Not quite. sum(3) and sum(2) are still waiting below sum(1) for their calls to return. Option B: 2 — Not quite. Count sum(1) itself as well: it is still on the stack until its return finishes. Option C: 3 — Correct. sum(3), sum(2) and sum(1) are on the stack; sum(0) already returned 0 and its frame was popped. Option D: 4 — Not quite. The sum(0) frame was popped when it returned 0, just before this step.

### explore

Code editor task: Write a static method with one int n parameter that calls itself. Return directly when n == 0, recurse with n - 1, then call it from main with a whole-number literal of 3 or more and print the result. Compare: the trace reaches n equal to 0 and the program finishes; changing the step to n + 1 produces java.lang.StackOverflowError. Starter code: public class Main { // Write your recursive method here. // Base case first: when should it stop calling itself? public static void main(String[] args) { // Call your method with a small value and print the result. } }
