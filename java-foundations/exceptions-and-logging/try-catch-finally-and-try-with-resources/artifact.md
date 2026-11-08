# try/catch/finally and try-with-resources

## Objectives

- Catch a specific exception and order catch blocks from most to least specific
- Predict when a finally block runs
- Close a resource automatically with try-with-resources

## Teaching

`NumberFormatException` is a subclass of `RuntimeException`. Predict before any explanation: what does this print?

```
try {
    int n = Integer.parseInt("12a");
    System.out.println("parsed " + n);
} catch (NumberFormatException e) {
    System.out.println("not a number");
} catch (RuntimeException e) {
    System.out.println("something else");
} finally {
    System.out.println("done");
}
```

A `catch` block for a type also matches every subclass of that type. So order the blocks from most specific to least specific:

- `NumberFormatException` extends `IllegalArgumentException`, which extends `RuntimeException`, which extends `Exception`.
- `ArithmeticException`, thrown by integer division by zero, also extends `RuntimeException`.

A `catch (Exception e)` placed first would match all of them. The compiler then rejects any later block for a subclass with `exception ... has already been caught`, because that block could never run. Catch the specific types you can respond to differently.

A `finally` block comes after the `try` block and any `catch` blocks. It runs whenever the `try` statement ends, whichever way it ends:

- the `try` block finishes, or a `catch` block handles the exception and finishes: `finally` runs, then the code after the statement;
- an exception that no `catch` matches, a new exception thrown from a `catch`, or a `return`: `finally` runs first, then the method is left.

That makes `finally` the place for clean-up that must always happen. One exception: `System.exit` stops the whole JVM and never returns, so a pending `finally` block never runs.

A file reader or a database connection must be closed when you are done. try-with-resources declares such resources in parentheses after `try`; each must implement `AutoCloseable`.

When the block ends, normally or by an exception, Java calls `close()` on every resource for you, in the reverse order of opening. A `catch` or `finally` written after it runs after the resources are already closed.

In a different case, one header might declare an `InputStream source` and then an `OutputStream sink`. A semicolon separates those declarations, both resources stay open for the body, and `sink` closes before `source`.

```
try (BufferedReader in = Files.newBufferedReader(path)) {
    return in.readLine();
}   // in.close() has run here
```

## Model

The model: when the `try` block throws, Java walks down the `catch` blocks and runs only the first one whose type matches. A `finally` block, if present, runs as the `try` statement ends.

## Recap

- Only the first matching `catch` block runs, and a block also matches subclasses, so order blocks from most to least specific.
- A later `catch` for a subclass of an earlier one does not compile: it could never run.
- `finally` runs however the `try` statement ends, including a `return` or an uncaught exception; only stopping the JVM skips it.
- try-with-resources closes every resource automatically, in reverse order, before any `catch` or `finally` block runs.

Next topic: Custom exceptions

## Cheat sheet

Where to act: The two `catch` blocks after the `try` block, starting at the line the compiler names in Problems.

Next step: Ask which of the two caught types is the more specific one, using the family line in the teaching.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The whole `catch` block for the more specific type, from `catch` to its closing brace.

Next step: Java checks the blocks from the top, so the block that should win for `"12a"` must come before the block that matches everything.

A hotel asks every guest to hand back the key card at the front desk on the way out. Whether you leave after a calm stay, after the staff sorted out a broken shower, or in a hurry because your plans changed, you pass the desk and return the card. Only when the whole building is evacuated does nobody stop at the desk.

The desk stop is the finally block: it happens on every way out, unless the whole program stops.

Where to act: The situation shown after Situation:, above the three buttons.

Next step: First ask whether the JVM keeps running. If it does, `finally` runs; then ask whether the statement ended in a handled, normal way or by leaving the method with a `return` or an exception.

Where to act: Inside the empty `useBoth` method body.

Next step: Start the resource-management statement whose header owns every resource that must close automatically.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: In that statement's resource header, then its body.

Next step: Declare the two resources in opening order, separate their declarations correctly, then put the one print call in the body.

Optional time: about 5 minutes, in addition to this topic's time.

Take the `Res` class above. On paper or in any Java 25 setup you already use, write one `try` statement that opens a single `Res` named `log`, prints `working`, catches `IllegalStateException` to print `caught`, and has a `finally` block that prints `finished`. Then predict its output twice: once as written, and once after adding a line that throws `IllegalStateException` after `working`.

Success criteria: your statement compiles, and both predictions match a real run: in each, `close log` appears before any `catch` or `finally` line, and `finished` is always last.

|  |  |
| --- | --- |
| Specific first | `catch (NumberFormatException e) { ... } catch (Exception e) { ... }` |
| Several types, one block | `catch (NumberFormatException \| ArithmeticException e)`, for unrelated types only |
| Always runs | `finally { ... }` |
| Auto-close | `try (BufferedReader in = Files.newBufferedReader(path)) { ... }` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Compiler messages and program output were confirmed on OpenJDK 25.0.4.1 (Temurin). Links open outside this lesson.

- Java Language Specification, chapter 14: 14.20 the try statement; 14.20.2 try-finally; 14.20.3 try-with-resources.
- Dev.java: Catching and Handling Exceptions: catch, finally and try-with-resources.
- AutoCloseable (Java SE 25 API): close is called automatically when exiting a try-with-resources block.
- Runtime (Java SE 25 API): exit never returns normally.

## Static interaction alternatives

### predict

Prediction (practice, not scored): parseInt of 12a inside try, with catch NumberFormatException, then catch RuntimeException, then finally. Options: not a number, then done (correct); not a number, something else, done (wrong: only the first matching catch runs); parsed 12, done (wrong: parseInt throws for 12a); something else, done (wrong: the more specific catch comes first and matches).

### explore

Java editor on one method, ratio(String input), whose try block parses the input and divides 100 by it. The starter catches Exception first and NumberFormatException second, so it fails to compile: exception NumberFormatException has already been caught. Run calls ratio with 4, 12a and 0; the targets are 100 / 4 = 25, Enter digits only, and Something went wrong (0 makes 100 / n throw ArithmeticException). If 12a gives Something went wrong, the broad block still wins. If 0 stops the program with ArithmeticException: / by zero, no block catches it. Joining related types with | fails: alternatives in a multi-catch statement cannot be related by subclassing.

### drag

Sorting activity: the try block finishes without an exception: finally runs, then the code after the statement. A matching catch handles the exception and finishes: finally runs, then the code after the statement. No catch matches the exception: finally runs, then the method is left as the exception travels on. The try block executes return: finally runs, then the method returns. A catch block throws a new exception: finally runs, then the method is left. The try block calls System.exit(0): finally does not run, because the JVM stops.

### mcq

Expected output after a valid construction: open a, open b, use, close b, close a. Both resources are open for the body, then Java closes them in reverse declaration order. On retry, reason about an exception caught only after resources close.
