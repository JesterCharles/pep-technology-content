# Generics

## Objectives

- Declare and use a generic class and a generic method with a type parameter
- Explain how List\<String\> lets the compiler reject adding a non-String in type-safe generic code and removes the cast when reading, while raw or unchecked code can still fail with a ClassCastException at run time
- Choose between List\<T\>, List\<? extends T\> and List\<? super T\> for a method parameter that only reads from or only writes to a list

## Teaching

The angle brackets in `List<String>` name the element type.

```
List<String> names = new ArrayList<>();
names.add("ana");
names.add(42);
```

```
class Box<T> {
    private T item;
}
static <T> boolean sameType(T left, T right) {
    return left.equals(right);
}
```

`T` is a type parameter. Each use fills it with a real type, the type argument: in `Box<String>`, `T` means `String`. The compiler can then keep a box's stored value tied to the type argument instead of treating it as an unknown `Object`.

A generic method declares its own type parameter before the return type. The `sameType` example uses one inferred type for both arguments; your task applies that declaration rule to a different relationship involving a list element and a return value.

A `List<Number>` parameter accepts only a `List<Number>`, not a `List<Integer>`. Wildcards widen what a parameter accepts:

- Only reads elements ("in"): `List<? extends Number>` accepts a list of `Number` or any subtype, such as `List<Integer>`.
- Only writes elements ("out"): `List<? super Integer>` accepts `List<Integer>`, `List<Number>` or `List<Object>`.
- Reads and writes: no wildcard; use `List<T>`.

The compiler's guarantee holds only for type-safe code. A raw type, such as `List` with no type argument, still compiles, with an "unchecked" warning, and lets any object in. The wrong element is caught only later, at run time, when code reads it as a `String`: that read throws `ClassCastException`.

## Recap

- A generic class declares a type parameter after its name, `class Box<T>`; a generic method declares its own before its return type, as in `<T> boolean sameType(T left, T right)`.
- Raw types and unchecked operations bypass that check, so the mistake surfaces later as a `ClassCastException`.
- Parameter that only reads: `? extends T`. Only writes: `? super T`. Both: `List<T>`.

Next topic: Wrapper types and autoboxing

## Cheat sheet

Picture a kitchen with labelled jars. When a jar says sugar, every cook knows what will come out of it, and nobody has to taste it first. An unlabelled jar can hold anything, so each cook has to check it before every use, and a mix-up is noticed only when a dish tastes wrong.

A type argument works like that label: it tells everyone what kind of value a container holds.

Hint 1 (Activity 2)

Where to act: The declarations immediately after `Crate` and `static`, and every matching `Object` type.

Next step: Give each declaration one type-parameter name, then make every value flowing into and out of that declaration use the same name.

|  |  |
| --- | --- |
| Generic class | `class Box<T> { T item; }` |
| Generic method | `static <T> boolean sameType(T left, T right)` |
| Diamond | `Box<String> b = new Box<>();` |
| Reads only | `List<? extends Number>` |
| Writes only | `List<? super Integer>` |
| Reads and writes | `List<T>` |

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

Java editor for Crate.java. Starter excerpt: class Crate stores an Object field, fill accepts Object, take returns Object, and static Object middle(List<Object> list) returns the middle element. Fixed Main excerpt: Crate<String> is filled with ana; Crate<Integer> is filled with 7; middle runs on List.of(3, 5, 8) and List.of("x", "y", "z"), with no casts. Target output: ana 7 5 y. Make Crate and middle generic by changing only declaration types and type parameters; their bodies stay as given. Hint 1 (Activity 2): act in the type-parameter declarations and matching Object positions, using one consistent type name for values flowing into and out of each declaration.

### drag

Sorting activity: sum every number in a list of Integer, Double or any Number: List<? extends Number> (only reads). Add the Integers 1 to 10 to a list of Integer, Number or Object: List<? super Integer> (only writes). The source list of copy(src, dest): List<? extends T>. The destination list of copy(src, dest): List<? super T>. Swap the first two elements of a list in place: List<T> (reads and writes). Replace each String with its trimmed version: List<String> with no wildcard (reads and writes).

### mcq

Apply question: a List<String> is aliased by a raw List, raw.add(42) runs, then String s = names.get(0). Correct: it compiles with an unchecked warning and throws ClassCastException at run time when the Integer is read as a String. Wrong: a compile error at raw.add(42) (raw types compile with a warning); s becomes "42"; NullPointerException. Retry form: a raw parameter in fill(List list) adds 3.5 to a List<String>; the failure is a ClassCastException at String w = words.get(0), not at the call or inside fill.
