# Declaring and looping over arrays

## Objectives

- Declare, create and initialize an array, and read and write elements by index
- Loop over an array with an index-based for loop and an enhanced for loop, choosing between them
- Reverse an array in place with two indexes and predict when an index throws ArrayIndexOutOfBoundsException

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. These three lines make an array of three whole numbers and set only one of them. Guess what prints before any rules are shown.

### Your task

1. Where to look: The three lines of code just below.
2. What to do: Under Prediction, pick the output you expect.
3. Then: Pick Low, Medium or High confidence and press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: Indexes, reading and writing

An array holds a fixed number of values of one type. `int[] temps = {12, 15, 9, 20, 18};` declares, creates and fills it in one line; `new int[5]` creates five elements that start at 0.

Each element has an index from 0 to `temps.length - 1`. Read one with `temps[2]` and write one with `temps[2] = 11;`. The length is fixed once the array exists.

An index below 0, or equal to the length or above, compiles but throws `ArrayIndexOutOfBoundsException` when that line runs.

### Your task

1. Where to look: Index explorer, under the five boxes of `temps`.
2. What to do: Use − 1 and + 1 to choose an index `i`, then press Read temps[i] or Write temps[i] = 30.
3. What to expect: The Java expression and its real result print under the buttons, and the boxes show the array.
4. How to know it's done: All four checks below read done.

### What success looks like

- Read the first element
- Read the last element
- Write a new value into an element
- Use an index that throws `ArrayIndexOutOfBoundsException`

### Activity 3 of 4: Two kinds of loop, and two indexes

An index-based loop, `for (int i = 0; i < temps.length; i++)`, gives you each position, so you can read, write, skip or walk backwards. The enhanced for loop, `for (int t : temps)`, hands you each value in order. It is shorter for read-only passes, but `t` is a copy: assigning to it leaves the array unchanged.

To reverse an array in place, keep two indexes: `left` starts at the first index and `right` at the last. Swap the two elements, using a temporary variable to hold one value, then move `left` up and `right` down. Stop when they meet or cross.

### Where this fits

Decision: You need to visit every element of an array. Index-based for loop or enhanced for loop?

Good fit: The enhanced for loop, when you only read each value once, front to back: totalling a week of temperatures, finding the highest score or printing every name.

Choose something else when: you need the position itself, must change elements in the array, compare neighbours, walk backwards or move two indexes at once. Then write an index-based for loop, or a while loop for two indexes.

### Your task

Finish `reverse` so it reverses any `int[]` it is given, in place, without making a new array. Run checks it on the examples below, which are the only inputs it uses.

1. Where to look: The Reverse.java editor below. It holds only the method; the page supplies the class and calls it.
2. First edit: replace the `___` after `int right =` with the last valid index of `a`.
3. Second edit: inside the `while` loop, swap `a[left]` and `a[right]`, then move both indexes toward each other. Press Run.
4. What to expect: Problems points to any line to fix; Output shows each example before and after, or the exception and its line.
5. How to know it's done: All three checks below read done. After two runs of edited code—even the same edit twice—you may move on and return as often as needed; it is done and earns credit only when one run passes every check.

### What success looks like

- `{1, 2, 3, 4, 5}` becomes `{5, 4, 3, 2, 1}`
- `{7, 8}` becomes `{8, 7}`
- `{9}` and the empty array `{}` stay as they are, with no exception

### Activity 4 of 4: Choose the loop

Pick a loop by what the pass must do. Writing back into the array needs the index, and the index runs from 0 while it is less than `length`. Reading every value once, in order, is what the enhanced for loop is for.

### Your task

You must add 5 to every element of `int[] scores`, and the array itself must change. Which loop does that?

Same idea, new form: you only need to print every name in `String[] names`, in order. Which loop fits best?

1. Where to look: The four loops in the options below.
2. What to do: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback explains the result. If another required activity is still open, it is named with a return link; the recap opens only after every required activity is complete.

### What success looks like

You chose the loop that changes every element in place and can say why each other loop fails.

## Model

The code

```
int[] scores = new int[3];
scores[1] = 7;
System.out.println(scores[0] + " " + scores[1]);
```

`temps` now, with each element's index; the chosen index is outlined

1. 12 [0] i
2. 15 [1]
3. 9 [2]
4. 20 [3]
5. 18 [4]

temps.length is 5, so valid indexes are 0 to 4.

## Recap

- An array has a fixed length and one element type; `new int[n]` fills it with 0, `{...}` fills it with your values.
- Indexes run from 0 to `length - 1`; anything else throws `ArrayIndexOutOfBoundsException` when the line runs.
- Use the enhanced for loop to read each value in order; use an index-based loop to change elements, use positions or walk backwards.
- Reverse in place with two indexes that swap and move toward each other until they meet.

Next topic: Linear and binary search

## Cheat sheet

A gym has one row of five lockers bolted to the wall, numbered from zero on the left. You can look inside any locker or swap what is in it, but the row never grows. Ask the attendant for locker number five and they shrug: the last locker is number four, and there is no wall space for another.

An array is that row: a fixed count of numbered slots, starting at zero, and a slot number past the end is a mistake.

Where to act: The + 1 button beside the index value.

Next step: The array has five elements, so its last index is one less than five; step one past that index and read again to see the exception.

Where to act: The placeholder after `int right =`.

Next step: The last valid index is one less than the number of elements. Express it with the array's length field, so it works for an array of any size.

Another hint Another hint, 2 of 3 for Activity 3

Where to act: The comment inside the `while` loop.

Next step: Copying `a[right]` into `a[left]` would lose the old left value. Declare an `int` that keeps the left value first, then do the two copies.

Another hint Another hint, 3 of 3 for Activity 3

Where to act: The end of the loop body, after the swap.

Next step: If neither index changes, the loop never ends and the run stops at its step limit. Add one to the left index and take one from the right index on every pass.

- Reads static methods with `int`, `boolean`, `String` and arrays of them; `if`/`else`, `while`, `for` and the enhanced for loop; `+ - * / %`, comparisons, `&&`, `||` and `!`.
- Anything else is a Lesson check, not a claim that other Java is invalid; Error is used only where javac certainly rejects the code.
- Exceptions use real JDK exception names; simulator detail messages are explanatory and may differ. This simulator stops after 20000 steps; a real JDK may continue, terminate later or fail for another reason.
- Run is deterministic and bounded: no network, files or arbitrary-code execution.

|  |  |
| --- | --- |
| `int[] a = {3, 1, 4};` | declare, create and fill |
| `int[] b = new int[5];` | five elements, all 0 |
| `a[0]` / `a[a.length - 1]` | first / last element |
| `for (int i = 0; i < a.length; i++)` | index-based loop |
| `for (int x : a)` | enhanced for loop (x is a copy) |
| `Arrays.toString(a)` | printable text such as [3, 1, 4] |

## Sources

Checked against these current official Java SE 25 pages on 2026-11-07. Each example's output was rechecked by compiling and running it with OpenJDK 25.

- Java Language Specification SE 25, chapter 10: Arrays
- Java Language Specification SE 25, 14.14: the for statement and the enhanced for statement
- Dev.java: Arrays
- Java SE 25 API: ArrayIndexOutOfBoundsException
- Java SE 25 API: Arrays.toString

## Static interaction alternatives

### predict

Prediction (practice, not scored): int[] scores = new int[3]; scores[1] = 7; System.out.println(scores[0] + " " + scores[1]); Options: 0 7; null 7; 7 0; a compile error because scores[0] was never set. Answer: 0 7. new int[3] gives every element the int default 0, and index 1 is the second element.

### explore

Index explorer for int[] temps = {12, 15, 9, 20, 18}; with real Java results. temps[0] is 12 and temps[4] is 18; temps.length is 5, so valid indexes are 0 to 4. temps[2] = 30; changes the third element to 30. temps[5] and temps[-1] compile, but running them throws java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5 (or Index -1 out of bounds for length 5).

### explore

Typed reverse-in-place activity. Reverse.java holds static void reverse(int[] a) with int left = 0; a placeholder for the starting value of right; and an empty while (left < right) loop. Finish it so each example array is reversed in place: {1, 2, 3, 4, 5} becomes {5, 4, 3, 2, 1}, {7, 8} becomes {8, 7}, and {9} and {} are unchanged with no exception. Starting right at a.length throws ArrayIndexOutOfBoundsException; a loop that never moves its indexes never ends. Run evaluates only a bounded Java subset on these examples.

### mcq

Apply question: add 5 to every element of int[] scores so the array changes. Options: for (int s : scores) { s += 5; } (changes only the copy s); for (int i = 0; i < scores.length; i++) { scores[i] += 5; } (correct: writes through every index 0 to length - 1); for (int i = 0; i <= scores.length; i++) { scores[i] += 5; } (the last pass uses index scores.length and throws ArrayIndexOutOfBoundsException); for (int i = 1; i < scores.length; i++) { scores[i] += 5; } (skips index 0). Retry: to print every name in order, for (String n : names) { System.out.println(n); } fits; a loop starting at names.length throws, a step of 2 skips names, and a while loop that never changes i never ends.
