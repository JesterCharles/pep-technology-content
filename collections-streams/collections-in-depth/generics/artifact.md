# Generics

## Objectives

- Declare and use a generic class and a generic method with a type parameter
- Explain how List\<String\> lets the compiler reject adding a non-String in type-safe generic code and removes the cast when reading, while raw or unchecked code can still fail with a ClassCastException at run time
- Choose between List\<T\>, List\<? extends T\> and List\<? super T\> for a method parameter that only reads from or only writes to a list

## Teaching

### Start with a guess

The angle brackets in `List<String>` name the element type. Read this code before any explanation.

```
List<String> names = new ArrayList<>();
names.add("ana");
names.add(42);
```

### A type parameter is a placeholder for a type

```
class Box<T> {
    private T item;
    void put(T item) { this.item = item; }
    T get() { return item; }
}
static <T> T first(List<T> list) { return list.get(0); }
```

`T` is a type parameter. Each use fills it with a real type, the type argument: in `Box<String>`, every `T` means `String`. The compiler then rejects `put(42)` and lets `String s = box.get();` compile with no cast.

A generic method declares its own type parameter before the return type, as in `<T> T first(List<T> list)`. The compiler infers `T` from the argument: `first(names)` returns a `String`.

### Wildcards: in or out

A `List<Number>` parameter accepts only a `List<Number>`, not a `List<Integer>`. Wildcards widen what a parameter accepts:

- Only reads elements ("in"): `List<? extends Number>` accepts a list of `Number` or any subtype, such as `List<Integer>`.
- Only writes elements ("out"): `List<? super Integer>` accepts `List<Integer>`, `List<Number>` or `List<Object>`.
- Reads and writes: no wildcard; use `List<T>`.

```
double sum(List<? extends Number> in) { ... }
void addOneToTen(List<? super Integer> out) { ... }
```

### Raw types switch the check off

The compiler's guarantee holds only for type-safe code. A raw type, such as `List` with no type argument, still compiles, with an "unchecked" warning, and lets any object in. The wrong element is caught only later, at run time, when code reads it as a `String`: that read throws `ClassCastException`. Treat unchecked warnings as bugs waiting to happen.

## Model

The model: a type argument such as `String` replaces the type parameter `T` everywhere in the class or method. The compiler checks every call against it: a wrong argument is a compile error, and a read needs no cast. A raw type removes the type argument, so the compiler can no longer check, and a wrong element fails later, at run time.

## Recap

- A generic class declares a type parameter after its name, `class Box<T>`; a generic method declares it before the return type, `<T> T first(List<T> list)`.
- With `List<String>`, the compiler rejects a non-`String` add and reading needs no cast.
- Raw types and unchecked operations bypass that check, so the mistake surfaces later as a `ClassCastException`.
- Parameter that only reads: `? extends T`. Only writes: `? super T`. Both: `List<T>`.

Next topic: Wrapper types and autoboxing

## Cheat sheet

|  |  |
| --- | --- |
| Generic class | `class Box<T> { T get() {...} }` |
| Generic method | `static <T> T first(List<T> list)` |
| Diamond | `Box<String> b = new Box<>();` |
| Reads only | `List<? extends Number>` |
| Writes only | `List<? super Integer>` |
| Reads and writes | `List<T>` |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture a storage box with a label that is checked at the door. A `Box<String>` is labelled "strings only": the door, which is the compiler, turns away an `Integer` before it goes in, so whatever you take out is already known to be a `String` and needs no cast.

A raw `Box` has no label. The door lets anything in, and the mistake shows only later, when someone opens the box expecting a `String` and finds something else: that is the `ClassCastException` at run time.

## Sources

Claims on this page were checked against the live official pages below on 13 October 2026 (UTC), for Java SE 25. Compiler messages and program output were confirmed with OpenJDK 25.0.4 `javac` and `java`. Links open outside this lesson.

- Dev.java: Introducing Generics: stronger type checks, elimination of casts, generic types and methods, raw types.
- Dev.java: Wildcards: upper and lower bounded wildcards; Guidelines for Wildcard Use ("in" and "out" variables).
- Dev.java: Type Inference: inferring a generic method's type argument.
- Dev.java: Type Erasure.
- Java Language Specification SE 25, chapter 4: 4.8 Raw Types; 4.12.2 heap pollution and unchecked warnings.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a List<String> gets add("ana") and then add(42). Options: it does not compile, because 42 is not a String (correct: javac reports incompatible types: int cannot be converted to String); it runs and stores 42 (wrong: the type argument forbids it); it compiles but throws ClassCastException when run (wrong: type-safe generic code is checked at compile time); 42 becomes the String "42" (wrong: Java never converts an int to a String argument automatically).

### explore

Compiler workbench: Box<T> box = new Box<>(); box.put(value); V x = box.get(); with choices for T (String or Integer), the value ("hi" or 42) and V (String or Integer). Worked example: Box<String> with put("hi") and String x compiles and prints hi; Box<Integer> with put(42) and Integer x compiles and prints 42. A mismatch is a compile error, for example Box<String> with put(42) gives error: incompatible types: int cannot be converted to String, and Box<String> with Integer x gives error: incompatible types: String cannot be converted to Integer.

### drag

Sorting activity: sum every number in a list of Integer, Double or any Number: List<? extends Number> (only reads). Add the Integers 1 to 10 to a list of Integer, Number or Object: List<? super Integer> (only writes). The source list of copy(src, dest): List<? extends T>. The destination list of copy(src, dest): List<? super T>. Swap the first two elements of a list in place: List<T> (reads and writes). Replace each String with its trimmed version: List<String> with no wildcard (reads and writes).

### mcq

Apply question: a List<String> is aliased by a raw List, raw.add(42) runs, then String s = names.get(0). Correct: it compiles with an unchecked warning and throws ClassCastException at run time when the Integer is read as a String. Wrong: a compile error at raw.add(42) (raw types compile with a warning); s becomes "42"; NullPointerException. Retry form: a raw parameter in fill(List list) adds 3.5 to a List<String>; the failure is a ClassCastException at String w = words.get(0), not at the call or inside fill.
