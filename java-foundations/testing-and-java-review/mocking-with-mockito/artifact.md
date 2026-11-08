# Mocking with Mockito

## Objectives

- Create a mock and stub a method with when(...).thenReturn(...)
- Verify that a method was called with expected arguments
- Decide when a hand-written fake is clearer than a mock

## Teaching

### Activity 1 of 3: Predict what an unstubbed mock returns

Before any explanation, read these lines. `mock(...)` comes from Mockito and creates a stand-in object for the interface; nothing has told it what `charge` should return. Predict what is printed.

```
interface PaymentGateway {
    boolean charge(String card, int cents);
}

// In a test method:
PaymentGateway gateway = mock(PaymentGateway.class);
boolean ok = gateway.charge("4111", 500);
System.out.println(ok);
```

### Activity 2 of 3: Stub a result, then verify a call

Mockito builds stand-ins for you. `mock(Mailer.class)` creates a mock that remembers every call made to it. Two tools then do the work:

- Stub a result: `when(rates.rate("EUR")).thenReturn(1.25);` makes that call return 1.25 from now on.
- Verify a call: `verify(audit).record("refund", 30);` fails the test unless that method was called with exactly those arguments. Add `times(2)` or `never()` as a second argument to `verify` to check a count.

Use verify for calls whose effect you cannot see in a return value, such as sending a message.

### Activity 3 of 3: Choose between a mock and a fake

A mock is quick when the test cares about one or two calls: a payment that succeeds, a receipt that must be sent. Each extra call the code makes needs another `when` line, though, and every `verify` ties the test to how the code works inside.

When the dependency stores data that the code saves and then reads back, a hand-written fake usually reads more clearly: it simply remembers, and the test asserts on results. Mockito’s own documentation warns that over-specified interaction checks make tests harder to maintain.

## Recap

- `mock(Type.class)` creates a stand-in; unstubbed methods return defaults such as `false`, `0`, `null` or an empty collection.
- `when(call).thenReturn(value)` stubs a result; `verify(mock).method(args)` checks a call happened with those arguments, once by default.
- `verify(mock, never())` and `verify(mock, times(n))` check other counts; with argument matchers, every argument must be a matcher.
- Prefer a hand-written fake when the code saves and reads back data; prefer a mock for one or two fixed answers or outgoing calls.

## Cheat sheet

Where to act: The return type of `charge` in the interface.

Next step: A mock has no real logic, so it must hand back some default; think about what the simplest default value of that type is in Java.

A stage rehearsal uses a stand-in actor who reads cue cards: when asked a question, they give the scripted reply. Afterwards, the director checks the notebook to confirm the lead actually handed over the letter at the right moment.

The scripted reply is stubbing; checking the notebook afterwards is verification.

Where to act: The line under comment 1.

Next step: The `gateway` field above the test shows how a mock is created. Do the same for the other interface that `Checkout` needs.

Another hint Another hint, 2 of 3 for Activity 2

Where to act: The line under comment 2.

Next step: A stub names one exact call and the answer to give. Read `pay` to see which call it makes on the gateway with your card and amount, and which answer lets the payment go through.

Another hint Another hint, 3 of 3 for Activity 2

Where to act: The line under comment 4.

Next step: Verification comes after the act. Read `pay` again to work out which address and receipt text it sends for your values, then check that the mailer received exactly those.

```
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CheckoutTest {
    PaymentGateway gateway = mock(PaymentGateway.class);

    @Test
    void paidOrderSendsReceipt() {
        // 1. Create a mock Mailer.

        // 2. Stub the gateway so the charge succeeds.

        // 3. Build a Checkout, pay, assert it worked.

        // 4. Verify the receipt the mailer was sent.
    }
}
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Optional time: about 3 minutes, in addition to the required activity.

Add a second test where `charge` is stubbed to return `false`. Assert that `pay` returns `false` and verify that `send` was `never()` called with any arguments, using `anyString()` for both.

Success criteria: Both tests pass, and the second fails if you change `never()` to `times(1)`.

Where to act: The sentence describing how `CartService` uses the repository.

Next step: Count how many saves and finds the test triggers, and notice that each find must return what the previous save stored.

```
import static org.mockito.Mockito.*;

RateSource rates = mock(RateSource.class);
when(rates.rate("EUR")).thenReturn(1.25);

AuditLog audit = mock(AuditLog.class);
// ... act on the code under test ...
verify(audit).record("refund", 30);
verify(audit, never()).record(anyString(), anyInt());
verify(audit, times(2)).flush();
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The Mockito site links its current API documentation on javadoc.io (mockito-core 5.24.0); the older javadoc copy on site.mockito.org shows version 2.2.7 and was not used. The practice runner imitates Mockito for interfaces only and shortens its messages.

- Mockito home page — current release and the link to its reference documentation
- Mockito 5 API: class Mockito — mock, default return values, when/thenReturn, verify with times(1) as default, never(), matcher rules, and the warning about over-specified verification
- JUnit User Guide: Assertions — assertTrue and assertEquals

## Static interaction alternatives

### predict

Question: What is printed?. Option A: true - Not quite. A mock does not approve payments on its own; until you stub charge, it returns a default value. Option B: false - Correct. An unstubbed Mockito method returns a default: false for boolean, 0 for numbers, null for most objects and an empty collection for collection types. Option C: A NullPointerException - Not quite. The mock exists, so calling a method on it is fine; a boolean result cannot be null. Option D: A compile error, because the interface has no method body - Not quite. Mockito supplies the object at run time; calling an interface method through it compiles normally. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Practice JUnit editor with Mockito. Read-only production code: interfaces PaymentGateway (boolean charge(String card, int cents)) and Mailer (void send(String to, String text)), and Checkout, whose pay(card, cents, email) charges the card and, when the charge succeeds, sends email the text Paid followed by the cents, then returns true. CheckoutTest.java has a mock gateway field and one empty test, paidOrderSendsReceipt, with four numbered comments. Task: in four steps, create a mock Mailer, stub the gateway so the charge that pay makes succeeds, build a Checkout from both mocks and assert that pay reports success, then verify that the mailer was sent the receipt pay builds; the learner chooses the card, amount and address. Checks: each step runs; the test passes; it fails if pay does nothing or never sends the receipt.

### mcq

Question: Which test double makes this test clearest?. Option A: A Mockito mock, with a when(repository.find(id)) line for each of the three states the cart passes through - Not quite. It can work, but the test must script every intermediate cart by hand and breaks if the service changes how often it saves. Option B: A hand-written in-memory fake repository that stores carts in a Map - Correct. The fake remembers each save, so every find returns the latest cart naturally, and the test only asserts on the final total. Option C: A mock with verify(repository, times(3)).save(cart) and no assertion on the total - Not quite. That checks how many times the code saved, not whether the total is right. Option D: The production database, so the test needs no double - Not quite. That turns a fast unit test into an integration test with setup and shared state; use it for database behavior, not cart totals. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
