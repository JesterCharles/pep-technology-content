# Pass-by-value

## Objectives

- Predict that reassigning a primitive parameter leaves the caller's variable unchanged Open
- Predict that reassigning a String parameter inside a method leaves the caller's variable referring to its original String Open
- Explain that Java passes every argument by value, and that for an object the value copied is the reference Open

## Teaching

### Activity 1 of 3: Predict whether a method changes the caller’s number

Before any explanation, read this program and predict what it prints.

```
public class Main {
    static void bump(int n) {
        n = n + 1;
    }

    public static void main(String[] args) {
        int count = 5;
        bump(count);
        System.out.println(count);
    }
}
```

### Activity 2 of 3: Trace a String parameter frame by frame

Each method call gets its own frame: a private set of local variables, including its parameters. When a method is called, Java evaluates each argument and copies the resulting value into the matching parameter of the new frame. This is pass-by-value.

A `String` variable holds a reference to a `String` object, and `String` objects are constant: their text never changes. So `name = "Dog"` inside a method points that method’s own `name` at a different `String`; the caller’s variable still refers to the original one.

### Activity 3 of 3: Objects: the value copied is the reference

An array is an object that holds several values; `scores[0]` is its first element. A variable such as `int[] scores` holds a reference to that object, not the object itself.

Java passes every argument by value. For an object, the value copied into the parameter is the reference. Both frames then refer to the same object, so a change made through the parameter, like `values[0] = 42`, is visible to the caller. Reassigning the parameter itself, like `values = new int[3]`, only redirects the method’s copy of the reference. The tracer shows each reference as `ref #` with a number, so you can see when two variables share one object.

## Recap

- Every call copies each argument’s value into a new frame’s parameter: Java passes every argument by value.
- Reassigning a primitive or `String` parameter changes only the method’s copy; the caller’s variable is unchanged.
- For an object such as an array, the copied value is the reference: changes through it are shared, but reassigning the parameter is not.

## Cheat sheet

Where to act: Look at the header `static void bump(int n)`.

Next step: Notice that the parameter has its own name, `n`, separate from `count` in `main`.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Follow the line `n = n + 1;`.

Next step: Ask which variable that line stores into, and whether `count` is ever assigned again in `main`.

You read your phone number aloud and a friend writes it on a napkin. Later they cross it out and write a different number on the napkin. Your phone, and the number on your own contact card, are unchanged: only their copy was rewritten.

A parameter is the napkin copy: reassigning it never rewrites the caller’s variable.

Where to act: Step until the call stack shows `rename` on top.

Next step: Read the Variables pane: the new frame has its own `name`, holding the value copied from `pet`.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Step past line 3 and then back into `main`.

Next step: Compare the top frame’s `name` with `pet` once `main` is on top again.

Where to act: In the tracer, compare `scores` in `main` with `values` in `setFirst`.

Next step: Notice that both show the same `ref #` number, so they refer to one array.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Now read the first line of `replace`, `values = new int[] {7, 7, 7};`.

Next step: Ask whether, after that line, `values` still refers to the array that `scores` refers to.

```
void a(int n)      { n = 9; }        // caller unchanged
void b(String s)   { s = "x"; }      // caller unchanged
void c(int[] arr)  { arr[0] = 9; }   // caller sees the change
void d(int[] arr)  { arr = new int[1]; } // caller unchanged
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Dev.java: Calling Methods and Constructors (Passing Information to a Method or a Constructor) — primitive and reference arguments are passed by value
- Java Language Specification SE 25, Chapter 15 (15.12.4.2 Evaluate Arguments, 15.12.4.5 Create Frame) — argument values initialize the parameters of a new frame
- Java Language Specification SE 25, Chapter 4 (4.3.1 Objects) — arrays are objects; reference values point to objects
- Java SE 25 API: java.lang.String — strings are constant; their values cannot be changed after they are created

## Static interaction alternatives

### predict

Question: What does the program print? Option A: 5 — Correct. The call copies the value 5 into the parameter n. n = n + 1 changes only that copy, so count in main is still 5. Option B: 6 — Not quite. That would need bump to write into count itself, but it only receives a copy of the value 5. Option C: A compile error, because a parameter cannot be assigned — Not quite. A parameter is an ordinary local variable of the method and may be reassigned unless it is declared final. Option D: 1 — Not quite. n starts with the value of the argument, 5, not with 0. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Static trace of the program (key steps from the interactive tracer):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | call main | `—` |
| 2 | line 8 | `—` |
| 3 | line 9 | `pet = "Cat"` |
| 4 | call rename | `name = "Cat"` |
| 5 | line 3 | `name = "Cat"` |
| 6 | line 4 | `name = "Dog"` |
| 7 | rename returns | `name = "Dog"` |
| 8 | line 10 | `pet = "Cat"` |
| 9 | main returns | `—` |

Printed output: `inside: Dog ⏎ after: Cat`

### mcq

Question: Which variable does name = "Dog" change? Option A: Both name and pet, because they refer to the same String — Not quite. They referred to the same String only until the assignment; name = "Dog" points name elsewhere and leaves pet alone, so the program prints after: Cat. Option B: Only rename’s own parameter name — Correct. The assignment stores a reference to "Dog" in rename’s frame. pet in main’s frame still refers to "Cat". Option C: The text of the "Cat" object, which becomes "Dog" — Not quite. String objects are constant; no code can change the text of "Cat". Option D: Nothing: assigning to a String parameter does not compile — Not quite. It compiles and runs; the tracer shows name changing inside rename.

### explore

Static trace of the program (key steps from the interactive tracer):

| Step | What happens | Top frame variables |
| --- | --- | --- |
| 1 | call main | `—` |
| 2 | line 7 | `—` |
| 3 | line 8 | `scores = int[3] {1, 2, 3} (ref #963)` |
| 4 | call setFirst | `values = int[3] {1, 2, 3} (ref #963)` |
| 5 | line 3 | `values = int[3] {1, 2, 3} (ref #963)` |
| 6 | setFirst returns | `values = int[3] {42, 2, 3} (ref #963)` |
| 7 | line 9 | `scores = int[3] {42, 2, 3} (ref #963)` |
| 8 | main returns | `—` |

Printed output: `42`

### mcq

Question: What does the replace version print? Option A: 1 — Correct. values first holds a copy of the reference to scores’ array, then is pointed at a brand-new array. values[0] = 8 changes only that new array, so scores[0] is still 1. Option B: 8 — Not quite. 8 is stored in the new array created inside replace; the caller’s array was never touched. Option C: 7 — Not quite. The 7s fill the new array that only values refers to after the reassignment. Option D: 42 — Not quite. 42 comes from setFirst in the tracer; replace never writes through the caller’s reference. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
