# JavaScript for Java developers

## Objectives

- Contrast JavaScript's dynamic typing and its Number and BigInt numeric primitives with Java's static numeric types
- Predict the result of typeof for primitive values, objects, arrays and null
- Run a JavaScript file with Node.js and read its console output

## Teaching

You know Java, so start by testing that instinct. Read this short program and commit to a prediction before any explanation.

```
let score = 10;
score = "ten";
console.log(typeof score);
```

In Java a variable has a declared type that the compiler checks. In JavaScript each value carries its type, and nothing is checked until the code runs.

There is no `int`, `long` or `double`. Ordinary numbers share one `Number` type, a 64-bit float, so `0.1 + 0.2` is not exactly `0.3` and integers above `Number.MAX_SAFE_INTEGER` lose precision.

`BigInt` is a separate primitive for exact large integers, written with a trailing `n`. You cannot mix the two in arithmetic: `1n + 1` throws a `TypeError`.

```
const large = 10n ** 20n; // exact
```

`typeof` returns a string naming a value's type. Most results match your expectations, with two traps.

`typeof null` is `"object"`, a long-standing language quirk, so test for null with `=== null`.

Arrays are objects, so `typeof []` is also `"object"`. Use `Array.isArray(value)` to detect one.

Functions are objects too, yet `typeof` reports them as `"function"`. A declared but unassigned variable reports `"undefined"`.

Browsers are not the only JavaScript runtime. Node.js runs a file from your terminal with `node file.js`.

`console.log` writes one line of standard output per call. An uncaught error prints the failing file and line, the error message and a stack, then the process stops, so later lines never run.

This course expects Node.js 22.12 or later; `node --version` tells you what you have.

Now combine what you have seen. A Java developer reads an order ID from a log and pastes it into a Node.js script.

```
const id = 9007199254740993;
console.log(id);
// prints 9007199254740992
```

## Recap

Values carry types and nothing checks them before the code runs. Ordinary numbers share one 64-bit float type, with BigInt for exact large integers. `typeof` reports a value's type, with `null` and arrays both reporting `object`. `node file.js` runs a file; read errors from the top for the file, line and message.

## Cheat sheet

What happens when this code runs?

- It prints `string`: correct. The variable has no declared type. It now holds a string value, and `typeof` reports the type of the value it holds right now.
- It prints `number`: not correct. That would mean the variable kept its first type. In JavaScript the type belongs to the value, not the variable.
- It fails before running because the types do not match: not correct. That is the Java compiler instinct. JavaScript has no declared variable types for a compiler to compare.
- It stops at line 2 with a TypeError: not correct. Reassigning a `let` variable to any type is allowed, so no error is raised.

Where to act: Line 5 of `numbers.js`, under the comment for step 2.

Next step: Do not declare a new variable. Assign to the name that already exists, then copy the logging line.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The `big` line.

Next step: Both sides of `**` must be BigInt values, so each literal needs the same suffix used in the example on this page.

// Step 1: give value a number. let value = ___; console.log(typeof value); // Step 2: reassign value to a string, then log typeof value. // Step 3: make big hold 2 to the power 64, exactly. const big = ___; console.log(big);

Assign a number to value and log typeof value, reassign a string and log again, then store 2 to the power 64 using BigInt literals. The expected output is number, string, then 18446744073709551616n.

Where to act: The rows with brackets or the word `null`.

Next step: Ask whether the value is one of the two traps named on this page, then answer with what `typeof` reports rather than what the value is.

- `typeof 3.14`: number. Every ordinary number is the one `Number` type, whole or fractional.
- `typeof 42n`: bigint. The trailing `n` makes a BigInt, a separate primitive.
- `typeof null`: object. This is the historic quirk. Test for null with `=== null`.
- `typeof [1, 2]`: object. Arrays are objects. `Array.isArray` is the reliable test.
- `typeof (() => 1)`: function. Functions are objects with their own `typeof` result.
- `typeof undefined`: undefined. The value `undefined` has its own type of the same name.

Where to act: The terminal input below the log.

Next step: The command is the runtime name, a space, then the file name. Use `ls` to see the two file names available.

node hello.js prints one line per console.log call. node broken.js prints the file and line /home/you/broken.js:2, then TypeError: Cannot read properties of undefined (reading 'toFixed'), then a stack, and stops.

Why did the printed value change by one?

- The literal is a `Number`, a 64-bit float, and that integer is above the safe range, so it rounds: correct. `Number.MAX_SAFE_INTEGER` is 9007199254740991. Above it, not every integer can be represented, so the nearest one is stored. A BigInt literal keeps it exact.
- It overflowed like a Java `int`: not correct. There is no 32-bit `int` here, and overflow would change the value far more than by one. This is float rounding.
- `console.log` rounds long numbers when printing: not correct. The stored value has already changed before printing. `console.log` displays what is stored.
- `const` numbers lose precision; `let` would keep it: not correct. The keyword only controls reassignment. The value is the same `Number` either way.

| Expression | Result |
| --- | --- |
| `typeof 1` | `"number"` |
| `typeof 1n` | `"bigint"` |
| `typeof null` | `"object"` |
| `typeof []` | `"object"` |
| `Array.isArray([])` | `true` |
| `Number.MAX_SAFE_INTEGER` | `9007199254740991` |

## Sources

- MDN: JavaScript data types and data structures, retrieved 2026-11-04
- MDN: Introduction to JavaScript, retrieved 2026-11-04
- ECMAScript language specification, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What happens when this code runs?

- It prints `string`: correct. The variable has no declared type. It now holds a string value, and `typeof` reports the type of the value it holds right now.
- It prints `number`: not correct. That would mean the variable kept its first type. In JavaScript the type belongs to the value, not the variable.
- It fails before running because the types do not match: not correct. That is the Java compiler instinct. JavaScript has no declared variable types for a compiler to compare.
- It stops at line 2 with a TypeError: not correct. Reassigning a `let` variable to any type is allowed, so no error is raised.

### terminal

### Static alternative

Assign a number to value and log typeof value, reassign a string and log again, then store 2 to the power 64 using BigInt literals. The expected output is number, string, then 18446744073709551616n.

### explore

### Static alternative

- `typeof 3.14`: number. Every ordinary number is the one `Number` type, whole or fractional.
- `typeof 42n`: bigint. The trailing `n` makes a BigInt, a separate primitive.
- `typeof null`: object. This is the historic quirk. Test for null with `=== null`.
- `typeof [1, 2]`: object. Arrays are objects. `Array.isArray` is the reliable test.
- `typeof (() => 1)`: function. Functions are objects with their own `typeof` result.
- `typeof undefined`: undefined. The value `undefined` has its own type of the same name.

### terminal

### Static alternative

node hello.js prints one line per console.log call. node broken.js prints the file and line /home/you/broken.js:2, then TypeError: Cannot read properties of undefined (reading 'toFixed'), then a stack, and stops.

### mcq

### Static alternative

Why did the printed value change by one?

- The literal is a `Number`, a 64-bit float, and that integer is above the safe range, so it rounds: correct. `Number.MAX_SAFE_INTEGER` is 9007199254740991. Above it, not every integer can be represented, so the nearest one is stored. A BigInt literal keeps it exact.
- It overflowed like a Java `int`: not correct. There is no 32-bit `int` here, and overflow would change the value far more than by one. This is float rounding.
- `console.log` rounds long numbers when printing: not correct. The stored value has already changed before printing. `console.log` displays what is stored.
- `const` numbers lose precision; `let` would keep it: not correct. The keyword only controls reassignment. The value is the same `Number` either way.
