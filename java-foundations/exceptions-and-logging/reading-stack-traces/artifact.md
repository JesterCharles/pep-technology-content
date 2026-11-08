# Reading stack traces

## Objectives

- Find the exception type, message and first line of your own code in a stack trace
- Follow a Caused by: chain to the root cause
- Explain what a helpful NullPointerException message says about which value was null

## Teaching

Your program, in the package `shop`, stopped with this output. Predict before any explanation: which line points to the code you should open first?

```
Exception in thread "main" java.lang.NumberFormatException: For input string: "x2"
	at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)
	at java.base/java.lang.Integer.parseInt(Integer.java:565)
	at java.base/java.lang.Integer.parseInt(Integer.java:662)
	at shop.PriceList.price(PriceList.java:8)
	at shop.PriceList.total(PriceList.java:14)
	at shop.PriceList.main(PriceList.java:20)
```

Read it from the top. The first line names the exception class, with its package, then a colon and the message.

Each `at` line below is one method call that was still running: package and class, method, then file name and line number in parentheses. A `java.base/` prefix marks JDK code, which is very rarely the bug.

Scan down to the first `at` line in your own package: that is where your code made the call that failed. The lines below it show how the program got there.

Code often catches one exception and throws another with the first as its cause. The trace then prints the outer exception first, then a `Caused by:` section for its cause, then that cause's cause, and so on.

The last `Caused by:` is the root cause: the original failure, and usually where the fix belongs. A line such as `... 1 more` means the rest of that section's frames match the bottom frames of the section above, so Java leaves them out.

A `NullPointerException` message on current JDKs, including Java 25, says what failed and which value was `null`:

```
Cannot invoke "String.length()" because "code" is null
```

First comes the action that failed, then the value that was `null`, here a local variable named `code`. A field of the current object is shown as `this.` followed by the field name. A value returned by a method is shown as `the return value of "Class.method()"`. A local variable's name appears only when the class was compiled with debug information (`javac -g`); otherwise you see a placeholder such as `"<local4>"`.

## Model

The model: a stack trace is a snapshot of the call stack at the moment the exception was created, newest call on top.

## Recap

- The first line gives the exception type and message; the `at` lines list running calls, newest first.
- Start with the first `at` line in your own package, not the JDK lines above it.
- With `Caused by:` sections, the last one is the root cause, usually where the fix belongs.
- A `NullPointerException` message names the failed action and the exact value that was `null`.

Next topic: Reading: logging

## Cheat sheet

Where to act: The piece shown after Piece:, then find it in the trace above.

Next step: A piece from the first line is either before the colon or after it. For an `at` line, check its prefix, then count which line in your own package comes first from the top.

A shop tells you your delivery is late because the courier was late. The courier was late because the depot released the parcel late. The depot was late because a truck broke down. Complaining to the shop changes nothing; the broken truck is what someone has to repair.

Each excuse points to an earlier one, and the last one in the chain is the real problem to fix.

Where to act: The line shown after Line:, then find it in the trace above.

Next step: Count the `Caused by:` headers above that line: none means the outer section, one means the middle section, two means the last section.

Optional time: about 5 minutes, in addition to this topic's time.

In any Java 25 setup you already use, write a short program whose `main` declares `String code = null;` and then prints `code.length()`. Compile and run it twice: once with plain `javac`, once with `javac -g`.

Success criteria: you can point to the part of each message that names the `null` value, and explain why only one run shows the name `code`.

|  |  |
| --- | --- |
| First line | `java.lang.NumberFormatException: For input string: "x2"` (type: message) |
| One frame | `at shop.Cart.quantity(Cart.java:5)` (class.method(file:line)) |
| Root cause | the last `Caused by:` section |
| Null field | `because "this.orders" is null` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC), for Java SE 25. Every stack trace and message was produced on OpenJDK 25.0.4.1 (Temurin). Links open outside this lesson.

- Throwable (Java SE 25 API): printStackTrace format, `Caused by:` and `... n more`.
- StackTraceElement (Java SE 25 API): class, method, file and line of one frame.
- NullPointerException (Java SE 25 API): getMessage and the null-detail message.
- JEP 358: Helpful NullPointerExceptions: how fields, method results and local variables are named.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a NumberFormatException trace with three java.base frames, then shop.PriceList.price line 8, total line 14 and main line 20. Options: the NumberFormatException.forInputString frame (wrong: JDK code that builds the exception); the Integer.parseInt line 565 frame (wrong: JDK code doing what it was asked); shop.PriceList.price(PriceList.java:8) (correct: the first line of your own code, where the bad text was passed to parseInt); shop.PriceList.main(PriceList.java:20) (wrong: where the program started, three calls away from the failure).

### drag

Sorting activity on the Cart trace: java.lang.NumberFormatException is the exception type. For input string: "twelve" is the message. at shop.Cart.quantity(Cart.java:5) is the first line of your own code. at java.base/java.lang.Integer.parseInt(Integer.java:565) is another frame (JDK code). at shop.Cart.addItem(Cart.java:9) is another frame (the call that led to quantity). at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67) is another frame (JDK code).

### drag

Sorting activity on the ReportLoader trace: java.lang.IllegalStateException: cannot load report is the outer exception that main saw. java.lang.IllegalArgumentException: bad line: ink, x2 is the middle cause. at shop.ReportLoader.amount(ReportLoader.java:10) belongs to the middle cause, where the IllegalArgumentException was thrown. java.lang.NumberFormatException: For input string: "x2" is the root cause. at shop.ReportLoader.amount(ReportLoader.java:8) belongs to the root cause: the line of your own code where the original failure happened.

### mcq

Apply question: for order.customer().email().toLowerCase(), the message Cannot invoke String.toLowerCase() because the return value of shop.Customer.email() is null means the value returned by email() was null. Wrong: order itself (then the message would name order); the value returned by customer() (then the failing call would be email()); the result of toLowerCase() (that call never ran). Retry form: Cannot invoke java.util.List.size() because this.orders is null means the orders field of this Mailer object was null.
