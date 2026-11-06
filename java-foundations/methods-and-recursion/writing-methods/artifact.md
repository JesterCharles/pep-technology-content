# Writing methods: parameters and return values

## Objectives

- Declare a method with typed parameters and a return type, and call it with matching arguments Open
- Return a compatible value on every path that can finish normally, and use void when nothing is returned Open
- Extract a repeated block of code into a well-named method Open

## Teaching

### Activity 1 of 3: Predict what a method call prints

Before any explanation, read this complete program and predict its output. You will check your idea in a moment.

```
public class Main {
    static int computeArea(int width, int height) {
        return width * height;
    }

    public static void main(String[] args) {
        int a = computeArea(3, 4);
        System.out.println(a + computeArea(2, 5));
    }
}
```

### Activity 2 of 3: Extract, declare and call a method

A method declaration names a job once so the program can call it many times. Read `static int computeArea(int width, int height)` from left to right:

- `int` is the return type: the type of value the method hands back.
- `computeArea` is the name; by convention it starts with a lowercase verb.
- `(int width, int height)` is the parameter list: each parameter has its own type and name.

A call such as `computeArea(3, 4)` must pass one argument per parameter, in order, of a compatible type. Inside the body, `return width * height;` ends the method and sends the value back. A method that sends nothing back, such as one that only prints, uses `void` as its return type. In a non-`void` method, every path that can finish normally must reach a `return` with a compatible value; otherwise javac reports `missing return statement`. A path that ends by throwing an exception, or that can never finish, needs no `return`.

### Activity 3 of 3: Extract a repeated block that returns a value

When the same steps appear in several places, extract them into one well-named method and call it from each place. The behavior must not change: the extracted method receives what varies as parameters and returns what the caller needs. This code repeats one calculation three times:

```
System.out.println(2 * 3 + 5);
System.out.println(4 * 3 + 5);
System.out.println(7 * 3 + 5);
```

Each line multiplies a quantity by a price of 3 and adds a fee of 5. Only the quantity changes, so it becomes the parameter. A value-returning method must not finish by running off the end of its body; a path that throws, or never finishes, needs no `return`. In the candidate below that returns only when `qty > 0`, the other path falls off the end, so it still needs one.

## Recap

- A method header gives the return type, the name and a typed parameter list; a call passes matching arguments in order.
- `return` ends the method and hands a value back; `void` means nothing is handed back.
- In a non-`void` method, every path that can finish normally must return a compatible value, or javac reports `missing return statement`; a path that throws or never finishes needs no `return`.
- Extract repeated steps into one well-named method: what varies becomes parameters, and behavior stays the same.

## Cheat sheet

Where to act: Look at the line `int a = computeArea(3, 4);` first.

Next step: Work out the number that `computeArea(3, 4)` gives back and store it in `a` before reading the print line.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Now look inside the parentheses of `println`.

Next step: Both sides of the `+` are `int` values, so decide whether `+` adds numbers or joins text here.

A café keeps one recipe card called “flat white”. A barista follows the card each time an order arrives, using the milk and beans handed over for that order, and passes a finished cup back across the counter.

A method is that card: arguments go in, the body runs, and one returned value comes back.

Where to act: Start on the blank line above `main`.

Next step: Write the pieces in this order: `static`, a return type such as `int`, a name, then parentheses holding one type-and-name pair.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside each method’s braces, then on the three lines in `main`.

Next step: Return the shared calculation from the first method, print a call of it inside the `void` method, then call the `void` method with each line’s quantity.

Optional time: about 4 minutes, in addition to the required activity.

Success criteria: In your own IDE, not this graded editor, write an `int` method whose only statement throws an exception, confirm that javac accepts it without a `return`, and explain why in one sentence.

Where to act: Compare each candidate’s header with the call `computeTotal(2)`.

Next step: Rule out any candidate whose parameter list or return type cannot accept one `int` and give back a printable value.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Now read the body of each remaining candidate.

Next step: Check two things: the body computes quantity × 3 + 5, and no path can reach the end of the body without a `return`.

```
// return type, name, typed parameters
static int computeArea(int width, int height) {
    return width * height;   // value handed back
}
// void: nothing handed back
static void greet(String name) {
    System.out.println("Hello, " + name);
}
// arguments match by count, order and type
int a = computeArea(3, 4);
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Dev.java: Defining Methods — method declarations, parameters and return types
- Java Language Specification SE 25, Chapter 8: Classes (8.4 Method Declarations, 8.4.7 Method Body) — a non-void method body must not complete normally

## Static interaction alternatives

### predict

Question: What does the program print? Option A: 1210 — Not quite. That would need text joining, but a and computeArea(2, 5) are both int values, so + adds them. Option B: 22 — Correct. computeArea(3, 4) returns 12, so a is 12; computeArea(2, 5) returns 10; 12 + 10 is 22. Option C: 12 — Not quite. 12 is only the value stored in a; the second call computeArea(2, 5) is evaluated and added too. Option D: Nothing: computeArea has no println, so it cannot show a value — Not quite. computeArea does not print; it returns its result to the caller, and main prints the sum. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: Refactor three repeated price calculations. Declare one well-named static method with a non-void return type and a typed quantity parameter that returns the calculation, and one static void method with an int quantity parameter that prints what the first method returns. In main, call the void method for quantities 2, 4 and 7, and verify that Output is still 11, 17 and 26. Starter code: public class Main { // Declare your two methods above main. public static void main(String[] args) { System.out.println(2 * 3 + 5); System.out.println(4 * 3 + 5); System.out.println(7 * 3 + 5); } }

### mcq

Question: Which extracted method keeps the behavior? Option A: static void computeTotal(int qty) { return qty * 3 + 5; } — Not quite. A void method cannot return a value: javac reports incompatible types: unexpected return value, and println(computeTotal(2)) would have nothing to print. Option B: static int computeTotal(int qty) { if (qty > 0) { return qty * 3 + 5; } } — Not quite. When qty > 0 is false, no return runs, so javac reports missing return statement even though the three calls use positive quantities. Option C: static int computeTotal(int qty) { return qty * 3 + 5; } — Correct. One int parameter carries the part that changes, the body keeps the calculation, and its only path returns the value, so the program still prints 11, 17 and 26. Option D: static int computeTotal(int qty, int fee) { return qty * 3 + fee; } — Not quite. This method needs two arguments, so the one-argument call computeTotal(2) does not compile: javac reports that the method cannot be applied to the given types. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
