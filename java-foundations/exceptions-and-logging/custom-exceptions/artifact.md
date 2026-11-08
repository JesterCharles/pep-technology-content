# Custom exceptions

## Objectives

- Define a custom exception class with a constructor that takes a message and a cause
- Throw a custom exception for a broken business rule
- Wrap a low-level exception in a custom one without losing its cause

## Teaching

Every exception can carry a cause: the earlier exception that led to it. `getCause()` returns it. Predict before any explanation: what does the last line print?

```
try {
    Integer.parseInt("ten");
} catch (NumberFormatException e) {
    RuntimeException wrapped = new RuntimeException("bad quantity");
    System.out.println(wrapped.getCause());
}
```

A custom exception is a class that extends `Exception` (checked) or `RuntimeException` (unchecked). Its constructors forward to the parent with `super(...)`. `Exception` has a constructor for a message, and one for a message plus a `Throwable` cause.

```
class StockException extends Exception {
    StockException(String message) {
        super(message);
    }
}
```

Throw it where a business rule breaks: `throw new StockException("only 2 left");`. When you catch a low-level exception and throw your own, pass the caught one as the cause. Otherwise its message and stack trace are lost.

Dev.java suggests writing your own exception class when the Java platform has no type for the failure, or when callers benefit from telling your failures apart from everyone else's.

A broken business rule, such as an order for more units than are in stock, fits that well: callers can catch your `OutOfStockException` on its own and show a helpful message. A plain programming mistake already has a precise standard type: `IllegalArgumentException` for a bad argument, `NullPointerException` for a forbidden `null`, `IndexOutOfBoundsException` for a bad index.

Wrapping turns a low-level failure into one that speaks your program's language, while `getCause()` still leads back to what really happened. A caller can handle your exception, and a developer reading the stack trace still sees the original under `Caused by:`.

## Model

The model: an exception is an object with a type, a message and an optional cause. A custom exception adds a type that names a failure in your program's own terms.

## Recap

- A custom exception extends `Exception` (checked) or `RuntimeException` (unchecked), and its constructors forward a message, and optionally a cause, with `super(...)`.
- Throw it where a rule of your domain breaks; use standard JDK exceptions for ordinary programming mistakes.
- When you wrap a low-level exception, pass it as the cause so `getCause()` and `Caused by:` still show the original.

Next topic: Reading stack traces

## Cheat sheet

Where to act: Inside the `QuantityException` class, below its existing constructor.

Next step: Copy the shape of the existing constructor, add a second parameter of type `Throwable`, and forward both parameters to the parent constructor that accepts a message and a cause.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The `throw` line in the `catch` block, then the comment line about the business rule.

Next step: The caught exception is the variable named in `catch (NumberFormatException e)`; add it as a second argument. For the rule, test `n` with an `if` and throw the new exception inside it, before `return n;`.

Where to act: The failure shown after Failure:, above the two buttons.

Next step: Ask whether the failure would make sense in any Java program, like a bad index, or only in this business, like an empty stock shelf.

A shop assistant tells a customer, "Your order cannot ship this week," and staples the warehouse's original note, "Forklift broken in aisle 4," to the back of the order form. The customer gets a message they understand, and the manager who later reads the form still learns exactly what went wrong.

Your exception is the message for the customer; the cause is the stapled original note.

|  |  |
| --- | --- |
| Checked custom type | `class StockException extends Exception { ... }` |
| Message only | `super(message);` |
| Throw for a rule | `throw new StockException("only 2 left");` |
| Read the cause | `ex.getCause()` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Compiler messages and program output were confirmed on OpenJDK 25.0.4.1 (Temurin). Links open outside this lesson.

- Dev.java: How to Throw Exceptions: creating exception classes; chained exceptions.
- Exception (Java SE 25 API): constructors with a message and with a message and a cause.
- Throwable (Java SE 25 API): getCause and the cause facility.

## Static interaction alternatives

### predict

Prediction (practice, not scored): inside a catch for NumberFormatException, new RuntimeException("bad quantity") is created and its getCause() printed. Options: java.lang.NumberFormatException: For input string: "ten" (wrong: the caught exception was never passed to the new one); null (correct); bad quantity (wrong: that is the message, not the cause); it does not compile (wrong: RuntimeException has a constructor that takes only a message).

### explore

Java editor on a QuantityException class and a parseQuantity(String text) method. Run calls parseQuantity with 3, 1, ten, 0 and -1; for an exception it prints getMessage(), then | cause: and getCause(). The targets keep 3 and 1, preserve the NumberFormatException cause for ten, and throw quantity must be at least 1 with no cause for 0 and -1. Passing the caught exception before the class has a matching constructor fails to compile: constructor QuantityException in class QuantityException cannot be applied to given types. A constructor that forwards only the message leaves the cause null. Testing n before the try block assigns it fails: variable n might not have been initialized.

### drag

Sorting activity: an order for more units than are in stock calls for a custom exception. A null argument that must not be null calls for the standard NullPointerException. A transfer below an account's overdraft limit calls for a custom exception. A list index past the end calls for the standard IndexOutOfBoundsException. A booking for a flight that has already departed calls for a custom exception. A month number of 13 from buggy calling code calls for the standard IllegalArgumentException.

### mcq

Apply question: new InventoryException("cannot load stock", e) wraps the NoSuchFileException, so the caller's ex.getCause() prints java.nio.file.NoSuchFileException: stock.csv. Wrong: null (a cause was passed); cannot load stock (that is the message); InventoryException: cannot load stock (that is the wrapper, not its cause). Retry form: with only the message passed, getCause() prints null, and the original failure is lost.
