# Debugging with breakpoints

## Objectives

- Set a breakpoint and run a program in the IDE debugger Open
- Step over, step into and step out while watching variable values change Open
- Locate the line where a variable first takes a wrong value Open

## Teaching

### Activity 1 of 3: Predict which control goes inside a method

A program adds prices 4, 6 and 10 with a method `total`, then a fee of 5 with `withFee`. It should print 25 but prints 21. Before any explanation, predict how a debugger helps. Here is its `main` method:

```
public static void main(String[] args) {   // line 14
    int[] prices = {4, 6, 10};
    int t = total(prices);                   // line 16
    int due = withFee(t);
    System.out.println(due);
}
```

Imagine the program is paused at line 16 before that line runs.

### Activity 2 of 3: Set a breakpoint and step while watching variables

A breakpoint marks a line where the program pauses before that line runs. In IntelliJ IDEA you click the gutter next to the line number, then start the program with Debug instead of Run. While paused, the Variables view shows the current values, and the Frames view shows the call stack.

- Step Over runs the current line, including any method it calls, and pauses at the next line. If an enabled breakpoint inside a called method is reached first, it pauses there instead.
- Step Into enters a method called on the current line.
- Step Out finishes the current method and pauses back in its caller, unless an enabled breakpoint is reached first.
- Resume lets the program continue until it reaches the next breakpoint.

### Activity 3 of 3: Locate where a value first goes wrong

To locate a bug, write down what each variable should hold at each step, then step through and compare. The first line after which a variable differs from your expectation is where it first takes a wrong value. From there, look at what that line reads to find the cause.

For `{4, 6, 10}`, a correct loop would make `sum` 4, then 10, then 20.

## Recap

- Set a breakpoint in the gutter and start with Debug, not Run; execution pauses before that line runs.
- Step Over runs a line, Step Into enters a call, Step Out returns to the caller, and Resume runs to the next breakpoint.
- Compare each variable with what it should hold; the first line after which it differs is where it first goes wrong, and what that line reads points to the cause.

## Cheat sheet

Where to act: Read the four control names in the options as plain English.

Next step: Ask which one sounds like going into the call on the current line rather than past it.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Think about what “over” would mean for a line that contains a call.

Next step: Decide whether stepping over line 16 would show you the lines inside `total` or only its result.

You follow a cooking video and the sauce turns out lumpy. Instead of watching the whole video again, you jump to the moment the flour goes in, pause, and play it one step at a time, looking at the pan after each step.

A breakpoint is that jump-and-pause; stepping is playing one step at a time.

Where to act: The round markers sit in the left column of the listing, one per line.

Next step: Press the marker on line 16 so its label says the breakpoint is set, then press Debug once.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: At line 16, Step Into; inside `total`, Step Over until line 7.

Next step: Note `sum` before `return` runs, then Step Out and observe that the top frame changes back to `main`.

Where to act: Pause on line 5, `sum += prices[i];`, the first time.

Next step: Before stepping over it, note `i` and predict which price will be added.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Step over line 5 once and read `sum`.

Next step: Compare it with the first correct value, 4, and ask which line produced the difference.

| Control | What it does |
| --- | --- |
| Breakpoint | Pause before this line runs |
| Debug | Run until the first breakpoint |
| Step Over | Run this line, then pause at the next one |
| Step Into | Enter the method called on this line |
| Step Out | Finish this method, pause in the caller |
| Resume | Run to the next breakpoint or the end |

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- IntelliJ IDEA help: Debug code — starting a debug session
- IntelliJ IDEA help: Breakpoints — setting line breakpoints in the gutter
- IntelliJ IDEA help: Start the debugger session — start with Debug; pause and resume a session
- IntelliJ IDEA help: Debug tool window — the Frames and Variables tabs
- IntelliJ IDEA help: Step through the program — Step Over, Step Into, Step Out and Resume
- Visual Studio Code: Running and debugging Java — the same workflow in VS Code, as an alternative IDE

## Static interaction alternatives

### predict

Question: Which control goes to the first line inside total? Option A: Step Over — Not quite. Step Over runs the whole call to total and pauses at the next line of main, line 17, so you see only the result. Option B: Step Into — Correct. Step Into enters the method called on the current line and pauses at its first statement, line 3, int sum = 0;. Option C: Step Out — Not quite. Step Out finishes the current method, here main, and returns to its caller; it does not enter total. Option D: Resume — Not quite. Resume lets the program run until the next breakpoint, or to the end if there is none. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Static trace of the program (the pauses on lines 5, 7, 11 and 18):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | line 5 | `prices = int[3] {4, 6, 10} (ref #963), sum = 0, i = 1` |
| 2 | line 5 | `prices = int[3] {4, 6, 10} (ref #963), sum = 6, i = 2` |
| 3 | line 7 | `prices = int[3] {4, 6, 10} (ref #963), sum = 16` |
| 4 | line 11 | `amount = 16` |
| 5 | line 18 | `prices = int[3] {4, 6, 10} (ref #963), t = 16, due = 21` |

Printed output: `21`

### mcq

Question: When execution first pauses on line 7, what is sum? Option A: 20 — Not quite. 20 is the correct total of 4, 6 and 10, but the program prints 21 = 16 + 5, so the loop did not add all three. Option B: 16 — Correct. Only 6 and 10 were added; the price at index 0, 4, was skipped. Activity 3 finds where that goes wrong. Option C: 0 — Not quite. 0 is the value before the loop; by line 7 the loop has finished adding. Option D: 21 — Not quite. 21 is what the program prints after withFee adds 5; inside total, sum has not had the fee added.

### explore

Static trace of the program (the pauses on lines 3 to 7 inside total):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | line 3 | `prices = int[3] {4, 6, 10} (ref #965)` |
| 2 | line 4 | `prices = int[3] {4, 6, 10} (ref #965), sum = 0` |
| 3 | line 5 | `prices = int[3] {4, 6, 10} (ref #965), sum = 0, i = 1` |
| 4 | line 4 | `prices = int[3] {4, 6, 10} (ref #965), sum = 6, i = 1` |
| 5 | line 5 | `prices = int[3] {4, 6, 10} (ref #965), sum = 6, i = 2` |
| 6 | line 4 | `prices = int[3] {4, 6, 10} (ref #965), sum = 16, i = 2` |
| 7 | line 7 | `prices = int[3] {4, 6, 10} (ref #965), sum = 16` |

Printed output: `21`

### mcq

Question: After which line does sum first hold a wrong value? Option A: Line 3, int sum = 0; — Not quite. Starting at 0 is correct; a correct total also starts from 0. Option B: Line 4, the for header — Not quite. The for header sets i, not sum. It is where the cause lives, because i starts at 1, but sum is unchanged by that line. Option C: Line 5, sum += prices[i]; — Correct. The first time line 5 runs, i is 1, so sum becomes 6 instead of 4. Line 5 reads i, which leads to the cause: the loop starts at 1 instead of 0. Option D: Line 17, int due = withFee(t); — Not quite. withFee adds 5 correctly; t was already 16 when it arrived. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
