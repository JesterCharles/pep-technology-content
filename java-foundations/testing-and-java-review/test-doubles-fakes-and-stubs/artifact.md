# Test doubles: fakes and stubs

## Objectives

- Replace a dependency with a hand-written fake that works in memory
- Write a stub that returns canned answers for a test
- Explain why depending on an interface makes a class testable

## Teaching

### Activity 1 of 4: Predict how a clock-dependent test behaves

Before any explanation: this `greet()` method reads the real time of day itself. Predict what happens when the build server runs its test at 15:00.

```
String greet() {
    if (LocalTime.now().getHour() < 12) {
        return "Good morning";
    }
    return "Good afternoon";
}
// Its test expects the morning greeting.
```

### Activity 2 of 4: Write a stub that returns a canned answer

The fix: let the class receive what it depends on. `GreetingService` now asks a `Clock` interface for the hour, and the caller passes one in through the constructor, so any class that implements `Clock` will do.

A test can pass a stub: a tiny class written for the test that returns a fixed, canned answer and has no real logic. With a stub that always says hour 9, the test gives the same result at any time of day.

### Activity 3 of 4: Write a fake that works in memory

A canned answer is not enough when the code saves something and later asks about it, as with a store of users.

A fake is a working but simplified implementation, written by hand for tests: a fake user store can keep names in a `List` in memory instead of a database. It runs in milliseconds and needs no setup.

A `List` already has the two operations a fake store needs: `add(value)` stores a value, and `contains(value)` answers `true` or `false` for whether the list holds it.

### Activity 4 of 4: Explain what makes a class testable

Both doubles worked because each service depends on an interface it receives, not on a class it creates with `new`. It cannot tell a stub or fake from the real thing, so the test chooses what to pass in. A class that creates its own dependency, like the first `greet()` reading the system clock, gives a test no way to swap it.

## Recap

- A class that receives its dependencies through an interface can be tested with a stand-in; one that creates them itself cannot.
- A stub returns fixed, canned answers chosen by the test, such as hour 9.
- A fake is a simple working implementation, such as a store that keeps names in a `List` in memory.
- Use a real dependency, in an integration test, when the behavior you need to prove lives in that dependency.

## Cheat sheet

Where to act: The `if` inside `greet()`.

Next step: Work out the hour the clock gives at 15:00, then follow the `if` to see which text is returned.

A flight school trains pilots in a simulator. The instructor dials in a storm at a fixed moment, so every trainee meets the same weather on a calm, sunny day.

A stub works like that dial: it hands the code the exact answer the test needs, every time.

Where to act: The blank lines under the Step 1 comment, above `class GreetingServiceTest`.

Next step: Start the header with `class`, a name you choose such as `MorningClock`, then `implements Clock`, then braces.

Another hint Another hint, 2 of 3 for Activity 2

Where to act: Inside your stub class.

Next step: Copy the method from the `Clock` interface, add `public` in front because interface methods are public, and give it a body with a single `return` of a whole number below 12.

Another hint Another hint, 3 of 3 for Activity 2

Where to act: Inside `greetsInTheMorning`.

Next step: Pass `new` followed by your stub’s name to the `GreetingService` constructor, then compare `"Good morning"` with what `greet()` returns using `assertEquals`, expected value first.

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
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Where to act: The body of `save`, under its comment.

Next step: Call a method on the `names` field that puts the `name` parameter into the list; one statement is enough.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `return` line in `exists`.

Next step: Return what the list says when you ask whether it holds the `name` parameter, instead of always returning `false`.

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
19
20
21
22
23
24
25
26
```

- It reads a small Java subset: classes and interfaces with fields, constructors and methods; `if`/`else`, for-each over a `List`, `return` and `throw`; `String`, `int`, `long`, `double`, `boolean`, `List` and `Map`; and lambdas.
- It knows JUnit Jupiter `@Test`, `@BeforeEach` and the common `Assertions` methods, plus Mockito `mock`, `when`/`thenReturn`, `verify`, `times`, `never` and a few argument matchers.
- Anything else shows Not supported here: that is a limit of this page, not a claim that the Java is wrong. Error is used only where javac or JUnit certainly rejects the code.
- It is not javac or the JUnit Platform: it runs tests in source order (JUnit itself does not promise an order), shortens failure messages, and does not perform every compile-time check. Confirm real projects with Maven or your IDE.

Where to act: The constructor of `SignupService` in the production code.

Next step: Look at the type of the parameter it receives, and ask who decides which object is passed in.

```
interface RateSource {
    double rate(String currency);
}

// stub: a canned answer
class FixedRates implements RateSource {
    public double rate(String currency) {
        return 1.25;
    }
}

// fake: works in memory
class InMemoryBasket implements Basket {
    private final List<String> items = new ArrayList<>();
    public void add(String item) { items.add(item); }
    public int count() { return items.size(); }
}
```

Claims on this page were checked against these official sources, retrieved 2026-10-16. The words fake and stub have no first-party definition in the JUnit or Mockito documentation; this page defines them as course vocabulary.

- Dev.java: Using an Interface as a Type — a variable or parameter of an interface type accepts any implementing class
- JUnit User Guide: Test Classes and Methods — @Test and @BeforeEach methods and their rules
- JUnit User Guide: Assertions — assertEquals with the expected value first

## Static interaction alternatives

### predict

Question: What happens at 15:00?. Option A: It passes: JUnit sets the clock to midnight for tests - Not quite. JUnit does not change the clock; LocalTime.now() reads the real time. Option B: It fails: greet() returns "Good afternoon" at 15:00 - Correct. The hour is 15, so the if is false. The same test passes in the morning and fails in the afternoon. Option C: It does not compile: tests cannot call code that reads the clock - Not quite. It compiles and runs; the result just depends on when it runs. Option D: It passes at any time: the if is checked only once - Not quite. The condition is evaluated on every call, with the current hour. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### explore

Practice JUnit editor. Read-only production code: interface Clock with int hour(), and GreetingService, which takes a Clock in its constructor and returns Good morning when clock.hour() is below 12, otherwise Good afternoon. GreetingServiceTest.java starts with an empty test method greetsInTheMorning. Task: write a stub class that implements Clock and whose public int hour() returns one fixed morning hour, then in the test build a GreetingService with the stub, call greet() and assert it equals Good morning. Checks: the stub returns a fixed whole number from 0 to 11; the test uses the stub, asserts on greet() and passes.

### explore

Practice JUnit editor. Read-only production code: interface UserStore with save(String name) and exists(String name), and SignupService, which returns taken when store.exists(name) is true, otherwise saves the name and returns welcome. SignupServiceTest.java holds InMemoryUserStore, a fake with a List of names whose save body is empty and whose exists returns false, and a provided test expecting welcome then taken for two signups of ada. Task: make save add the name to the list and exists answer from the list. Checks: the provided test passes, the fake still welcomes a different name, and the provided test is unchanged.

### mcq

Question: Why could SignupService be tested without a database?. Option A: It receives the UserStore interface in its constructor, so the test can pass in a fake - Correct. The service only calls the interface, so any implementation works, including an in-memory fake. Option B: JUnit swaps database classes for in-memory ones automatically - Not quite. JUnit does not swap dependencies; the test passed in the fake itself. Option C: Its store field is private, and tests skip private fields - Not quite. Private fields still run. What matters is that the field’s type is an interface supplied from outside. Option D: A database is fast enough that no double is needed - Not quite. The test used no database; a real one needs setup and can make tests slow or flaky. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
