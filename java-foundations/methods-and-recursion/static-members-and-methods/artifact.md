# static members and methods

## Objectives

- Call a static method through its class name and explain why main is static Open
- Use a static field shared by all calls and tell it from a local variable Open
- Explain why a static method cannot use an instance field without an object Open

## Teaching

### Activity 1 of 3: Predict what survives between calls

Before any explanation, read this program. `ping` runs three times. Predict the last line it prints.

```
public class Main {
    static int calls = 0;

    static void ping() {
        calls++;
        int local = 0;
        local++;
        System.out.println(calls + " " + local);
    }

    public static void main(String[] args) {
        ping();
        ping();
        ping();
    }
}
```

### Activity 2 of 3: Call a static method through its class name

A `static` field belongs to the class itself: there is exactly one copy, shared by every call and every object. A local variable belongs to one call of a method and disappears when that call returns.

A `static` method also belongs to the class, so you call it through the class name, such as `Math.max(3, 7)` or `Temperature.toFahrenheit(20)`; inside the same class the name may be left out. That is why `main` is classically `static`: no `Main` object is required, so the launcher calls `Main.main` through the class. (Since Java 25 a `main` method may also be an instance method; the launcher then first creates an object with a no-argument constructor. This course uses the static form.)

### Activity 3 of 3: Why static code needs an object for instance fields

A field declared without `static` is an instance field: every object made with `new` gets its own copy. A static method runs without any particular object, so it has no copy of an instance field to read. Code in a static method reaches instance fields only through an object, for example `Main game = new Main();` then `game.score`, or the field is made `static` when one shared value really is intended.

## Recap

- A `static` field has one copy for the whole class, shared by every call; a local variable is new on every call.
- Call a static method through its class name, such as `Math.max(3, 7)`; a traditional `main` is static so the launcher can call it without first creating a `Main` object.
- An instance field belongs to each object, so static code reaches it only through an object such as `new Main().score`.

## Cheat sheet

Where to act: Find where each variable is declared: `calls` above the methods, `local` inside `ping`.

Next step: Ask which declaration runs again every time `ping` is called.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Follow `calls` and `local` through the third call only.

Next step: Decide which one starts again from 0 on that call and which one still holds the count from earlier calls.

An office keeps one whiteboard on the wall where everyone tallies finished orders. During each meeting people also scribble on sticky notes, which go in the bin when the meeting ends. The next meeting starts with fresh notes, but the whiteboard still shows every tally so far.

A static field is the shared whiteboard; local variables are each call’s sticky notes.

Where to act: Start inside `main`, under the numbered comments.

Next step: Write the class name, a dot and the method name, then a Celsius value in parentheses, all inside `System.out.println(…)`.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: For the last line, use the field declared at the top of `Temperature`.

Next step: Reach the static field the same way, class name then a dot, and compare the printed number with how many calls you made.

Where to act: Look at the declaration `int score = 10;`.

Next step: Note whether it says `static`, and so whether it belongs to the class or to each object.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Now look at the header of `main`.

Next step: Ask which object `score` would belong to while `main` runs, given that no `new Main()` appears.

```
class Counter {
    static int total = 0;  // one copy for the class
    int mine = 0;          // one copy per object
}
Counter.total++;           // static: through the class name
Counter c = new Counter(); // an object
c.mine++;                  // instance: through an object
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Dev.java: Understanding Class Members — class variables, class methods, and why class methods cannot use instance variables directly
- Dev.java: Getting Started with Java (the main method) — the main method as the program entry point
- Java Language Specification SE 25, Chapter 8 (8.3.1.1 static Fields, 8.4.3.2 static Methods) — one incarnation of a static field; static methods are invoked without reference to an object
- Java Language Specification SE 25, Chapter 12 (12.1.4 Invoke a main Method) — how execution starts by invoking a main method
- JEP 512: Compact Source Files and Instance Main Methods (delivered in JDK 25) — instance main methods; the launcher creates an object with a no-argument constructor

## Static interaction alternatives

### predict

Question: What is the last line printed? Option A: 3 3 — Not quite. local is declared inside ping, so every call creates a new local starting at 0; it reaches only 1. Option B: 3 1 — Correct. The one static field calls keeps counting across calls (1, 2, 3), while each call gets a fresh local that goes from 0 to 1. Option C: 1 1 — Not quite. calls is declared once for the class, not inside the method, so it is not reset to 0 on each call. Option D: A compile error, because local is declared three times — Not quite. Each call runs the declaration in its own new frame, which is legal; only declaring the same name twice in one scope is an error. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: Inside main, call Temperature.toFahrenheit twice through the class name with Celsius values you choose, print each result, then print Temperature.conversions. Compare: the last line equals the number of calls, because the static field is shared by every call. Starter code: class Temperature { static int conversions = 0; static double toFahrenheit(double celsius) { conversions++; return celsius * 9 / 5 + 32; } } public class Main { public static void main(String[] args) { // 1. Print two Temperature.toFahrenheit results. // 2. Then print Temperature.conversions. } }

### explore

Explanation questions: Question 1, why can the launcher call a traditional static main? Options: static methods run faster; no Main object is needed to call it; no objects exist until main returns; the launcher first creates a Main object. Question 2, how do conversions and the parameter celsius differ? Options: both keep their values between calls; each call gets its own conversions, while celsius is shared; conversions is one shared count, while celsius, like a local, belongs to one call; both reset to 0 on every call.

### mcq

Question: What happens, and why? Option A: It prints 10 — Not quite. score belongs to a Main object, and no Main object is available for that unqualified score access in the static main, so the program does not compile. Option B: javac reports non-static variable score cannot be referenced from a static context — Correct. score is an instance field, and the static main has no object whose score it could read. Use new Main().score, or make the field static if it is meant to be shared. Option C: It prints 0, the default value — Not quite. Default values apply to fields of objects that exist; here javac stops before anything runs. Option D: It compiles but throws NullPointerException when run — Not quite. The mistake is found at compile time; javac rejects the reference to an instance field from a static context. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
