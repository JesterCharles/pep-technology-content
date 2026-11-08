# Checked vs unchecked exceptions

## Objectives

- Tell checked exceptions from unchecked exceptions in the Throwable hierarchy
- Declare a checked exception with throws or handle it, as the compiler requires
- Decide whether a failure should be signalled with a checked or an unchecked exception

## Teaching

The JDK method `Files.readString(Path)` reads a whole file into a `String`. Its declaration ends with `throws IOException`. Predict before any explanation: what happens when you compile this method?

```
// Files.readString(Path) is declared: throws IOException
// main is declared: throws IOException
static String firstLine(Path file) {
    String text = Files.readString(file);
    return text.lines().findFirst().orElse("");
}
```

- `Throwable`
    - `Error`, such as `OutOfMemoryError`: serious JVM problems. Unchecked.
    - `Exception`
          - `RuntimeException` and every class below it, such as `NullPointerException`. Unchecked.
          - Every other subclass, such as `IOException`. Checked.

For a checked exception, the compiler requires every method that can throw it to catch it or declare it with `throws`. Unchecked exceptions carry no such rule. A subclass keeps its parent's kind.

These are the direct parent links used by the cards below: `FileNotFoundException` extends `IOException`; `NumberFormatException` extends `IllegalArgumentException`; `IllegalArgumentException`, `NullPointerException` and `ArithmeticException` extend `RuntimeException`; `OutOfMemoryError` extends `VirtualMachineError`, which extends `Error`; and `InterruptedException` extends `Exception` directly.

When a method calls code that can throw a checked exception, the compiler accepts one of two choices:

- Declare it: write `throws` and the exception type after the parameter list. The duty passes to every caller.
- Handle it: put the call inside `try { ... }` followed by `catch (TheType e) { ... }`, and decide there what the method does instead.

```
// Thread.sleep is declared: throws InterruptedException
static void pause() throws InterruptedException {
    Thread.sleep(500);
}
```

The declared or caught type must cover what can be thrown. A broader parent such as `Exception` also compiles, but then every caller must deal with `Exception`.

When your own method must signal a failure, Dev.java gives one guideline: if a caller can reasonably be expected to recover, make it a checked exception; if a caller cannot do anything to recover, make it unchecked.

A missing file or a dropped connection is outside the program's control, and a caller can choose another file or try again, so the JDK uses the checked `IOException`. A bad argument from a bug in the calling code is different: the fix is to correct that code, so methods signal it with an unchecked exception such as `IllegalArgumentException`.

## Model

The model: every exception is an object whose class extends `Throwable`. Where a class sits in that family tree decides whether the compiler checks it.

## Recap

- `RuntimeException` and its subclasses, and `Error` and its subclasses, are unchecked; every other `Exception` is checked.
- For a checked exception, the compiler requires each method that can throw it to catch it or declare it with `throws`.
- Declaring a broader type passes the duty to callers in that broader form.
- Use checked exceptions for outside conditions a caller can recover from, and unchecked ones for bugs in the calling code.

Next topic: try/catch/finally and try-with-resources

## Cheat sheet

Where to act: The class shown after Class:, above the three buttons.

Next step: Walk up its parent classes toward `Throwable`. Meeting `RuntimeException` or `Error` on the way makes it unchecked; reaching `Exception` without meeting `RuntimeException` makes it checked. A name ending in `Error` is a strong clue for the third lane.

Where to act: The method header, `static String firstLine(Path file)`, or around the two lines inside the method.

Next step: Pick one of the two choices from the teaching: tell callers that the method can fail, or deal with the failure inside the method.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: To declare, between the closing parenthesis of the parameter list and the opening brace; to handle, around both lines that read the file.

Next step: Use the exact checked type named in the comment on line 1. A broader type also passes this method, but then `main`, which declares only that exact type, stops compiling.

A courier's booking form asks what to do if nobody is home: leave the parcel with a neighbour, or bring it back tomorrow. You must tick one box before the booking is accepted, because an empty house is a normal risk you can plan for. The form has no box for writing the wrong street yourself; that mistake is fixed by correcting the address.

Checked exceptions are the risks you must plan for before the code is accepted; unchecked ones are mistakes you fix in the code.

|  |  |
| --- | --- |
| Checked | `IOException`, `FileNotFoundException`, `InterruptedException` |
| Unchecked | `NullPointerException`, `IllegalArgumentException`, `ArithmeticException`, any `Error` |
| Declare | `static void pause() throws InterruptedException { ... }` |
| Handle | `try { ... } catch (InterruptedException e) { ... }` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Compiler messages and program output were confirmed on OpenJDK 25.0.4.1 (Temurin). Links open outside this lesson.

- Java Language Specification, chapter 11: Exceptions: 11.1.1 the kinds of exceptions; 11.2 compile-time checking.
- Dev.java: What Is an Exception?
- Dev.java: Unchecked Exceptions, the Controversy: the recover-or-not guideline.
- RuntimeException (Java SE 25 API) and Error (Java SE 25 API).
- Files (Java SE 25 API): `readString(Path)` throws `IOException`.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a method calls Files.readString, which is declared throws IOException, without catching or declaring it. Options: it compiles and a missing file returns an empty string (wrong: nothing in the method handles a missing file); javac stops with unreported exception IOException; must be caught or declared to be thrown (correct); it compiles, then crashes with NoSuchFileException (wrong: it never compiles, so it never runs); it compiles with a warning (wrong: this is an error, not a warning).

### drag

Sorting activity: IOException is checked (it extends Exception but not RuntimeException). NumberFormatException is unchecked under RuntimeException (via IllegalArgumentException). FileNotFoundException is checked (it extends IOException). NullPointerException is unchecked under RuntimeException. OutOfMemoryError is unchecked under Error (via VirtualMachineError). InterruptedException is checked (it extends Exception directly). ArithmeticException is unchecked under RuntimeException.

### explore

Java editor on one method, firstLine(Path file), which calls Files.readString (declared throws IOException). The starter does not compile: unreported exception IOException; must be caught or declared to be thrown. Run compiles the method and calls it from a main declared throws IOException, with notes.txt (lines hello and world) and with a missing file. Once the method compiles, notes.txt prints hello. With a missing file, a declared exception reaches main and stops it with java.nio.file.NoSuchFileException: missing.txt; a catch block decides the result itself. Declaring the broader Exception compiles the method but makes main fail with unreported exception Exception. Catching only NoSuchFileException leaves IOException unreported. Returning null or an empty string from a catch compiles, but this practice asks for a non-empty fallback message or a thrown exception instead.

### mcq

Apply question: loadSettings reads a user-chosen file that may have been deleted. Correct: a checked exception such as IOException, declared with throws, because the caller can recover by asking for another file. Wrong: an unchecked IllegalArgumentException (the path argument was valid; the outside world changed); an Error (Error is for serious JVM problems); return null and throw nothing (the caller is not told why, and may fail later). Retry form: setDiscount(150) from a caller's typo should throw an unchecked IllegalArgumentException, because the caller cannot recover from its own bug at run time; the code needs fixing.
