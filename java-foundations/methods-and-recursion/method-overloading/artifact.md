# Method overloading

## Objectives

- Overload a method by changing its parameter list Open
- Predict which overload the compiler picks for a given call, including a widening conversion Open
- Explain why a different return type alone cannot overload a method Open

## Teaching

### Activity 1 of 3: Predict which method runs

Before any explanation, read this program. Two methods share the name `show`. Predict the two lines it prints.

```
public class Main {
    static void show(int n) {
        System.out.println("int " + n);
    }

    static void show(double n) {
        System.out.println("double " + n);
    }

    public static void main(String[] args) {
        show(5);
        show(5L);
    }
}
```

The `L` in `5L` makes it a `long` literal.

### Activity 2 of 3: Overload a method by changing its parameter list

Overloading means declaring several methods with the same name but different parameter lists: a different number of parameters, different types, or types in a different order. `Math.max(int, int)` and `Math.max(double, double)` are overloads in the Java library.

javac picks the overload at compile time from the arguments’ types. An exact match wins. Otherwise it allows widening, a conversion that never loses range: `byte` → `short` → `int` → `long` → `float` → `double`, and `char` → `int`. If several overloads fit, it chooses the most specific one; if none is more specific, the call is ambiguous and does not compile.

### Activity 3 of 3: Why a return type alone cannot overload

A method’s signature is its name plus its parameter types. The return type is not part of it. Two methods in one class may not have the same signature, so changing only the return type does not create an overload.

The reason is how calls are resolved: javac chooses a method from the name and the argument types alone. A call can even ignore the result, as in `size("hi");`, so the return type gives no way to tell two such methods apart.

## Recap

- Overloads share a name and differ in their parameter lists: number, types or order.
- javac picks the overload at compile time from the argument types: exact match first, then widening such as `int` → `long` → `double`, choosing the most specific fit.
- A signature is the name plus parameter types; the return type is not part of it, so a return type alone cannot overload.

## Cheat sheet

Where to act: Compare the first call, `show(5)`, with each method header.

Next step: Find the header whose parameter type is exactly the type of `5`.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: Now compare `show(5L)` with the two headers.

Next step: No header takes a `long`; ask which parameter type a `long` can be converted to without losing range, and how a `double` prints.

A post office has one counter labelled “Send”. Hand over a letter and the clerk weighs it and adds a stamp; hand over a parcel and the clerk measures it and prints a label. You say the same word each time, and what you hand over decides which routine the clerk follows.

Overloads share one name, and the arguments you pass decide which body runs.

Where to act: Copy the header of the existing `describe` onto the blank line under the comment.

Next step: Keep the name `describe` and the return type, then change only what is inside the parentheses so the parameter list differs.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside `main`, under the existing call.

Next step: Write a call whose argument types match your new parameter list and no other overload exactly, then wrap it in `System.out.println(…)`.

Optional time: about 4 minutes, in addition to the required activity.

Success criteria: Add a third overload that takes a `double`, call `describe('x')` with a `char`, and explain from the Output which overload ran and why widening chose it.

Where to act: Write out the signature of each method: its name plus its parameter types.

Next step: Compare the two signatures you wrote, ignoring the return types.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Now think about a call such as `size("hi")`.

Next step: Ask what javac could use to choose between the two methods when only the name and argument type are known.

```
static int add(int a, int b)          // add(int,int)
static double add(double a, double b) // add(double,double)
static int add(int a, int b, int c)   // add(int,int,int)

add(1, 2);      // add(int,int): exact match
add(1, 2.5);    // add(double,double): 1 widens to double
add('a', 1);    // add(int,int): char widens to int
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The practice editor imitates javac and java for a small subset; its messages were compared with JDK 17.0.12 javac and java output.

- Dev.java: Defining Methods (Overloading Methods) — overloaded methods differ by number and type of parameters
- Java Language Specification SE 25, Chapter 8 (8.4.2 Method Signature, 8.4.9 Overloading) — signature excludes the return type; same signature twice is a compile-time error
- Java Language Specification SE 25, Chapter 15 (15.12.2 Compile-Time Step 2: Determine Method Signature) — applicability by widening and choosing the most specific method
- Java Language Specification SE 25, Chapter 5 (5.1.2 Widening Primitive Conversion) — the widening conversions listed on this page

## Static interaction alternatives

### predict

Question: What does the program print? Option A: int 5 then int 5 — Not quite. Converting a long to int could lose information, so javac never does it automatically when choosing a method. Option B: int 5 then double 5.0 — Correct. 5 is an int, an exact match. 5L is a long; no method takes long, but a long widens to double, and a double prints with a decimal point. Option C: A compile error, because no method takes a long — Not quite. A call does not need an exact match: an argument may be widened, here from long to double. Option D: int 5 then long 5 — Not quite. Neither method prints the word long; the text comes from the method that runs, and the double one prints double 5.0. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Code editor task: Add a second describe method with the same name but a different parameter list, call it from main, and print its result. Compare: the program compiles and prints one line from each describe method. Starter code: public class Main { static String describe(int n) { return "a number: " + n; } // Add an overload of describe here. public static void main(String[] args) { System.out.println(describe(4)); // Call your overload here. } }

### mcq

Question: What happens when the class is compiled? Option A: It compiles, and calls use the int version because it is declared first — Not quite. Declaration order never chooses an overload, and this class does not compile at all. Option B: javac reports method size(String) is already defined in class Main — Correct. Both methods have the signature size(String). The return type is not part of the signature, so the second declaration duplicates the first. Option C: It compiles, and double d = size("hi"); picks the double version — Not quite. javac does not use the variable a result is assigned to when choosing a method; the duplicate declaration is already an error. Option D: It compiles, but calling size throws an exception at run time — Not quite. The problem is found by javac at compile time, so the program never runs. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
