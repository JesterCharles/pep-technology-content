# Method practice

## Objectives

- Decompose a small problem into methods with clear inputs and outputs Open
- Test a method by calling it with ordinary, boundary and invalid inputs and checking the results Open
- Refactor duplicated code into one reusable method without changing behavior Open

## Teaching

### Activity 1 of 3: Predict the result of a small method

Before any explanation, read this method and the call to it. Predict what the program prints.

```
public class Main {
    static double average(int a, int b) {
        return (a + b) / 2;
    }

    public static void main(String[] args) {
        System.out.println(average(90, 85));
    }
}
```

### Activity 2 of 3: Test with ordinary, boundary and invalid inputs

A method is easy to test when it has clear inputs (its parameters) and one clear output (its return value). Test it by calling it and comparing each result with the result you expected. Choose three kinds of input:

- Ordinary: a typical value, such as a score of 75.
- Boundary: a value at the edge where behavior changes, such as 0, 100, 80 or 90; off-by-one bugs live here.
- Invalid: a value the method must reject, such as −5 or 101.

### Activity 3 of 3: Refactor duplication without changing behavior

Decomposing a problem means giving each part its own method with clear inputs and one output. When the same steps are duplicated, extract them into one method and call it twice. A refactor must keep the behavior: the same inputs must still print the same results, so run your tests before and after.

The starter repeats that price rule for two input pairs and prints `10` twice. You will move the shared steps into one method, then compare the refactored output with those two known results.

## Recap

- Decompose a problem into methods with clear inputs (parameters) and one clear output (the return value).
- Test a method with ordinary, boundary and invalid inputs, comparing each result with what you expected.
- Refactor duplicated code into one method, then re-run the same tests to show the behavior did not change.

## Cheat sheet

Where to act: Look inside the parentheses on the `return` line.

Next step: Work out the type and value of `a + b` when both are `int`.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Then look at `/ 2` and the return type `double`.

Next step: Decide whether the division happens with whole numbers before or after the result becomes a `double`.

Before trusting a new kettle, you boil a normal cupful, then fill it right to the max line, then switch it on empty to make sure it refuses to heat. Three quick tries tell you far more than ten normal cupfuls would.

Ordinary, boundary and invalid inputs are the cupful, the max line and the empty kettle.

Where to act: Read the two `if` conditions that compare the score with 90 and 80, and the first one that rejects scores.

Next step: Pick a boundary from a number that appears in one of those conditions, an ordinary score well between them, and an invalid score outside 0 to 100.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside `main`, one line per test.

Next step: Write each test as `System.out.println(…)` around a call with your number, adding a short text label with `+` so you can match each line to its expectation.

Optional time: about 5 minutes, in addition to the required activity.

Success criteria: Add a test that shows a bug if the condition were written `score > 90` instead of `score >= 90`, and explain in a comment which input exposes it.

Where to act: Add a method above `main`.

Next step: The two values that vary between the blocks are the quantity and unit price, so make them typed parameters.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Move the multiplication, boundary decision and returned price into the new method.

Next step: Replace each old block with one printed call, preserving the original argument pairs and strict boundary rule.

```
// ordinary, boundary, invalid
System.out.println("75 -> " + letterGrade(75));
System.out.println("90 -> " + letterGrade(90));
System.out.println("101 -> " + letterGrade(101));
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Dev.java: Defining Methods — method parameters and return values
- Dev.java: Calling Methods and Constructors — calling methods and passing arguments
- Java Language Specification SE 25, Chapter 8 (8.4 Method Declarations) — method declarations
- Java Language Specification SE 25, Chapter 15 (15.17.2 Division Operator /) — integer division rounds toward zero

## Static interaction alternatives

### predict

Question: What does the program print? Option A: 87.5 — Not quite. (a + b) / 2 divides two int values, which discards the remainder before anything becomes a double. Option B: 87.0 — Correct. 90 + 85 is 175; 175 / 2 is integer division, giving 87, which the double return type widens to 87.0. One ordinary test already finds this bug. Option C: 87 — Not quite. The value is 87, but the method returns a double, and a double prints with a decimal point. Option D: A compile error, because an int result cannot be returned as double — Not quite. An int widens to double automatically; the value is wrong, but it compiles. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: In main, call letterGrade with an ordinary score, a boundary score such as 0, 80, 90 or 100, and an invalid score below 0 or above 100, printing each result. Compare each printed result with the result you expect from reading the method. Starter code: public class Main { // Returns the letter grade for a score from 0 to 100, // or "invalid" for a score outside that range. static String letterGrade(int score) { if (score < 0 || score > 100) { return "invalid"; } if (score >= 90) { return "A"; } if (score >= 80) { return "B"; } return "C or below"; } public static void main(String[] args) { // Test letterGrade: an ordinary score, a boundary score // and an invalid score. Print each result. } }

### explore

Code editor task: Refactor two duplicated price calculations into one static int method with typed quantity and unit-price parameters. Move the multiplication and strict boundary decision into the method, return the price, and replace both blocks with printed calls. Compare the two results with the starter behavior: it prints 10 and then 10. Starter code contains two duplicated calculation and discount blocks in main.
