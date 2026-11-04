# Testing a plain function with Vitest

## Objectives

- Write a Vitest test with test and expect for a pure function
- Run the test suite from npm and read a failing assertion's output
- Choose toBe or toEqual for primitive and object results

## Teaching

You know JUnit's `assertEquals`. Predict what this Vitest test does.

```
test("makes a user", () => {
  expect(makeUser("Ada")).toBe({ name: "Ada" });
});
// makeUser returns { name } as a new object
```

A pure function returns a result from its inputs alone, with no page or network, so it is the easiest thing to test. `test(name, fn)` declares a test, and `expect(value)` starts an assertion.

```
test("adds tax", () => {
  expect(addTax(10)).toBe(12);
});
```

Install with `npm install --save-dev vitest`, and add a `test` script to `package.json`. Test files are usually named `*.test.js`.

Run tests with `npm test`, using the script `"test": "vitest"`. Vitest stays in watch mode during development, and runs once in CI, or with `vitest run`. A failure names the test, then shows Expected and Received.

```
FAIL  format.test.js > adds tax
AssertionError: expected 11 to be 12 // Object.is equality
- Expected: 12
+ Received: 11
```

Read the failure before changing anything. A failing test can mean the code or the test is wrong.

`toBe` uses `Object.is`, so use it for primitives: numbers, strings and booleans. `toEqual` compares contents recursively, so use it for objects and arrays.

In Java terms, `toBe` is like `==` on references, and `toEqual` is like a deep `equals`. Using `toBe` on a new object always fails, even when the contents match.

A teammate shows you this output and says "the values are identical, so Vitest is broken".

```
FAIL  cart.test.js > lists tags
AssertionError: expected [ 'new', 'sale' ] to be [ 'new', 'sale' ]
// Object.is equality
- Expected: [ 'new', 'sale' ]
+ Received: [ 'new', 'sale' ]
```

## Recap

Vitest runs test files with `npm test`. `test(name, fn)` declares a test, and `expect(value)` asserts. Use `toBe` for primitives and `toEqual` for objects and arrays. A failure names the test, then shows Expected and Received, so read it before you change anything. Keep logic in plain functions, because they are the easiest to test.

## Cheat sheet

Does this test pass?

- It fails: `toBe` needs the very same object, not an equal one: correct. `toBe` uses `Object.is`, so two separate objects never match, however alike. `toEqual` compares contents.
- It passes, because both have the same name: not correct. That describes `toEqual`, which compares contents.
- It fails because `test` must be async: not correct. A synchronous test function is fine.
- It passes, because `toBe` calls `.equals` as JUnit does: not correct. JavaScript objects have no `.equals` method, and `toBe` does not call one.

Where to act: Where the `___` is.

Next step: Follow the shape of the example on this page: a name, an arrow function, then one `expect` line inside it.

import { test, expect } from "vitest"; import { formatPrice } from "./format.js"; ___

export function formatPrice(amount) { return "$" + amount.toFixed(2); }

Call test with the name and an arrow function. In it, call expect with formatPrice(5), then toBe with the string $5.00. The report shows one test passed.

Where to act: The `Received` lines in Output.

Next step: Compare the number of decimals in Received with Expected. Numbers have a method that formats to a fixed number of decimal places.

export function formatWeight(kg) { return kg + " kg"; }

import { test, expect } from "vitest"; import { formatWeight } from "./weight.js"; test("shows a whole number with two decimals", () => { expect(formatWeight(7)).toBe("7.00 kg"); }); test("pads one decimal to two", () => { expect(formatWeight(1.5)).toBe("1.50 kg"); });

The failures report Expected 7.00 kg, Received 7 kg. The code must format the number to two decimal places. Both tests then pass.

Where to act: Each placeholder.

Next step: Look at the expected value in the parentheses: is it a primitive, or a new object or array?

import { test, expect } from "vitest"; import { add, makeLine, tags } from "./cart.js"; test("adds numbers", () => { expect(add(2, 3)).___(5); }); test("builds a line", () => { expect(makeLine("Mug", 2)).___({ name: "Mug", qty: 2 }); }); test("lists tags", () => { expect(tags()).___(["new", "sale"]); });

export const add = (a, b) => a + b; export const makeLine = (name, qty) => ({ name, qty }); export const tags = () => ["new", "sale"];

The number comparison uses toBe. The object and the array comparisons use toEqual, because each expected value is a new container with the same contents.

What is going on?

- They used `toBe` on arrays. Two separate arrays are never the same object, so use `toEqual`: correct. The `Object.is equality` comment is the clue. The contents match, but they are different arrays.
- Vitest compares arrays by length only: not correct. It printed them both, and `toBe` compares identity, not length.
- The function is wrong, and the test is right: not correct. The contents are exactly what was expected. The matcher is the problem.
- Arrays cannot be tested, so loop over the items instead: not correct. `toEqual` compares arrays directly.

```
import { test, expect } from "vitest";
test("name", () => {
  expect(sum(1, 2)).toBe(3);                 // primitive
  expect(makePoint(1)).toEqual({ x: 1 });    // object or array
});
```

## Sources

- Vitest: expect, retrieved 2026-11-04
- Vitest: test, retrieved 2026-11-04
- Vitest: Getting started, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

Does this test pass?

- It fails: `toBe` needs the very same object, not an equal one: correct. `toBe` uses `Object.is`, so two separate objects never match, however alike. `toEqual` compares contents.
- It passes, because both have the same name: not correct. That describes `toEqual`, which compares contents.
- It fails because `test` must be async: not correct. A synchronous test function is fine.
- It passes, because `toBe` calls `.equals` as JUnit does: not correct. JavaScript objects have no `.equals` method, and `toBe` does not call one.

### terminal

### Static alternative

Call test with the name and an arrow function. In it, call expect with formatPrice(5), then toBe with the string $5.00. The report shows one test passed.

### terminal

### Static alternative

The failures report Expected 7.00 kg, Received 7 kg. The code must format the number to two decimal places. Both tests then pass.

### terminal

### Static alternative

The number comparison uses toBe. The object and the array comparisons use toEqual, because each expected value is a new container with the same contents.

### mcq

### Static alternative

What is going on?

- They used `toBe` on arrays. Two separate arrays are never the same object, so use `toEqual`: correct. The `Object.is equality` comment is the clue. The contents match, but they are different arrays.
- Vitest compares arrays by length only: not correct. It printed them both, and `toBe` compares identity, not length.
- The function is wrong, and the test is right: not correct. The contents are exactly what was expected. The matcher is the problem.
- Arrays cannot be tested, so loop over the items instead: not correct. `toEqual` compares arrays directly.
