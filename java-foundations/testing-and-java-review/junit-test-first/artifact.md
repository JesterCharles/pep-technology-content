# Unit tests with JUnit, written test-first: arrange, act, assert, assertThrows

## Objectives

- Write a failing JUnit test before the code, then make it pass
- Structure a test as arrange, act and assert with assertEquals and assertTrue
- Test that code throws the expected exception with assertThrows

## Teaching

### Activity 1 of 3: Predict what JUnit reports

Before any explanation, read this JUnit test. A bug means `counter.total()` currently returns `3` after two scans. Predict what JUnit reports when the test runs.

```
@Test
void countsTwoScans() {
    Counter counter = new Counter();
    counter.scan();
    counter.scan();
    assertEquals(2, counter.total());
}
```

### Activity 2 of 3: Write a failing test, then make it pass

A unit test is a small method that checks one behavior. In JUnit you mark it with `@Test` and give it a `void` return type; it may leave out `public`, but it must not be `private`.

Write it in three parts. Arrange: create the object and inputs. Act: call the one method being tested. Assert: compare the result with `assertEquals(expected, actual)`, or check a condition with `assertTrue(condition)`.

Test-first means writing that test before the code. Run it and watch it fail (red), which proves it can catch the missing behavior. Then write just enough code to make it pass (green).

### Activity 3 of 3: Test that a call is refused with assertThrows

Some behavior is “this call must be refused”. `assertThrows(ExpectedType.class, () -> call)` runs the code inside the lambda and passes only if it throws that exception type or a subtype. It fails when nothing is thrown or when a different type is thrown, and it returns the exception so you can check its message.

The lambda matters: written as `() -> ticket.cancel()`, the call happens inside `assertThrows`. A bare call on the line before would throw first and stop the test with an error.

For example, `assertThrows(ArithmeticException.class, () -> divide(1, 0));` passes when dividing by zero throws.

## Recap

- A JUnit test is a non-private `void` method marked `@Test`; static imports from `Assertions` give you `assertEquals`, `assertTrue` and `assertThrows`.
- Arrange the objects, act with one call, then assert: `assertEquals(expected, actual)` puts the expected value first.
- Test-first: write the test, watch it fail (red), then write just enough code to pass (green).
- `assertThrows(Type.class, () -> call)` passes only when the lambda throws that type or a subtype, and returns the exception.

## Cheat sheet

Where to act: The last line, `assertEquals(2, counter.total());`.

Next step: Decide which of its two arguments is the value the test wants and which is the value the code produced; JUnit names them in its failure message.

Before cutting a shelf to length, a carpenter pencils a mark on the wall where it must end. Each trial fit shows the gap until the board finally meets the mark, and then the job is done.

A failing test is that pencil mark: it states the goal first, and the work is finished when the code meets it.

Where to act: Inside the braces of `class WalletTest`, on the line under the Step 1 comment.

Next step: Start with the annotation `@Test` on its own line, then a method header such as `void depositAddsToBalance()` with an empty pair of braces; the three parts go inside.

Another hint Another hint, 2 of 3 for Activity 2

Where to act: Inside your new test method.

Next step: Arrange: declare a `Wallet` variable set to a new `Wallet`. Act: on the next line, call `deposit` on that variable with a positive number you choose.

Another hint Another hint, 3 of 3 for Activity 2

Where to act: The last line of your test, and later the body of `deposit`.

Next step: Assert with `assertEquals`: the amount you deposited is the expected value, and calling `balance()` on the same wallet is the actual. After the red run, make `deposit` add its parameter to the `balance` field.

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Where to act: The new test method inside `class AccountTest`.

Next step: Arrange an `Account` opened with a small balance, such as 100, so that some withdrawal is clearly too large.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The assert line of that test.

Next step: Call `assertThrows` with the exception class from `withdraw`’s `throw` statement followed by `.class`, then a lambda `() ->` that calls `withdraw` with more than the balance.

```
1
2
3
4
5
6
7
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Optional time: about 3 minutes, in addition to the required activity.

In the same editor, add a second test that keeps the exception `assertThrows` returns and checks its message with `assertEquals`.

Success criteria: Both tests pass, and the second one fails if you change the expected message text by one letter.

```
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PriceTest {
    @Test
    void addsTax() {
        Price price = new Price(100); // arrange
        int total = price.withTax(20); // act
        assertEquals(120, total); // expected, actual
        assertTrue(total > 100);
    }

    @Test
    void rejectsNegativeTax() {
        Price price = new Price(100);
        assertThrows(IllegalArgumentException.class, () -> price.withTax(-1));
    }
}
```

Claims on this page were checked against these official sources, retrieved 2026-10-16 (JUnit 6.1.3). The practice runner imitates JUnit Jupiter for a small Java subset; it is not the JUnit Platform.

- JUnit User Guide: Test Classes and Methods — test methods need not be public but must not be private, and must not return a value
- JUnit User Guide: Assertions — assertEquals(expected, actual), assertTrue and assertThrows examples
- JUnit API: Assertions — assertThrows passes for the expected type or a subtype, fails when nothing or another type is thrown, and returns the exception
- JUnit User Guide: Test Execution Order — default method order is deterministic but intentionally nonobvious

## Static interaction alternatives

### predict

Question: What does JUnit report?. Option A: The test passes, because assertEquals only checks that both values are numbers - Not quite. assertEquals compares the two values; 2 and 3 differ, so the assertion fails. Option B: The test fails: expected: <2> but was: <3> - Correct. The first argument is the expected value (2) and the second is the actual value the code produced (3), so JUnit reports that order. Option C: The test fails: expected: <3> but was: <2> - Not quite. That swaps the roles. In JUnit the expected value comes first, so 2 is expected and 3 is what the code returned. Option D: The test does not compile, because total() has a bug - Not quite. A wrong value is a failed test, not a compile error: the code compiles and runs, then the assertion fails. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Practice JUnit editor. WalletTest.java holds a Wallet class whose deposit method is empty and an empty WalletTest class. Task: write one @Test method that arranges a new Wallet, acts by calling deposit with a positive amount and asserts balance() with assertEquals or assertTrue; run it and see it fail because deposit is empty; then write deposit so it adds amount to balance and run again until the test passes. Checks: arrange, act and assert appear in order; the test fails while deposit is empty; every test passes with your deposit.

### explore

Practice JUnit editor. Account.java (read-only) has a withdraw method that throws IllegalStateException with the message insufficient funds when the amount is greater than the balance. AccountTest.java starts with an empty AccountTest class. Task: write one @Test method that arranges an Account with an opening balance and uses assertThrows with the exception class from withdraw and a lambda calling withdraw with more than the balance. Checks: assertThrows uses IllegalStateException.class with a lambda calling withdraw; the test passes; the test fails if withdraw did nothing.
