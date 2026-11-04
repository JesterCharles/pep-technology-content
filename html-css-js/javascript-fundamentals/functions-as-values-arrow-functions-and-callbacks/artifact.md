# Functions as values: arrow functions and callbacks

## Objectives

- Store a function in a variable and pass it to another function as a callback
- Rewrite a function expression as an arrow function, including the concise body form
- Predict whether a callback runs immediately or later in a given call

## Teaching

In Java a method is not a value you can assign to a variable directly. Predict what JavaScript does here.

```
function shout(text) {
  return text.toUpperCase();
}
const speak = shout;
console.log(speak("hi"), typeof speak);
```

A function is a value, so you can store it in a variable or pass it to another function. A function passed in this way is a callback: the receiver decides when to call it.

```
const square = function (n) {
  return n * n;
};
[1, 2].map(square); // pass it, no parentheses
```

Writing `square` hands over the function. Writing `square(3)` calls it now and hands over the result. Mixing these up is the most common callback bug.

An arrow function is a shorter function expression. The parameters come first, then `=>`, then the body.

```
const add = (a, b) => a + b;        // concise: returns a + b
const log = (msg) => { console.log(msg); }; // block: no return value
```

A concise body has no braces and returns its expression automatically. With braces you must write `return` yourself. To return an object literal concisely, wrap it in parentheses. Arrow functions also have no `this` of their own, which matters when you write methods later.

The function receiving your callback decides when it runs. Synchronous callbacks run during the call, before the next line: `forEach`, `map` and `sort` work this way.

Asynchronous callbacks run later, after the current code has finished. `setTimeout` runs its callback after a delay of at least the time given, even 0, and an event listener runs when the event happens, perhaps never.

Put both kinds of callback together. Trace this program line by line.

```
console.log("A");
setTimeout(() => console.log("B"), 0);
[1].forEach(() => console.log("C"));
console.log("D");
```

## Recap

Functions are values: store them, pass them, return them. Pass a function by name without parentheses so the receiver can call it. Arrow functions are the short form, and a concise body returns its expression. The receiver decides timing: array methods call back during the call, while timers and listeners call back later.

## Cheat sheet

What does line 5 print?

- `HI function`: correct. Without parentheses, `shout` is the function itself. `speak` now refers to it, so calling `speak` runs the same code.
- `HI string`: not correct. `typeof` is asked about `speak`, which holds a function, not the string it returned.
- It throws, because `shout` was called with no argument: not correct. Line 4 does not call anything. Calling needs parentheses.
- `undefined function`: not correct. `shout` returns a value, and `speak` is the same function, so the call returns `HI`.

Where to act: The `result` line.

Next step: Pass the name of your function without parentheses, because `applyTwice` is the one that calls it.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The body of `applyTwice` near the top of the file.

Next step: Trace it by hand from 1: it calls your function once, then calls it again on that result.

function applyTwice(fn, start) { return fn(fn(start)); } // 1. Store a function that returns its argument plus 5. const addFive = ___; // 2. Pass it to applyTwice, starting from 1. const result = ___; console.log(result);

Store a function that adds 5, hand the function itself to applyTwice with a start of 1, and log the result. Starting from 1, two calls give 6 then 11.

Where to act: The `double` definition.

Next step: Delete the word `function`, put `=>` after the parameter list, then keep only the expression that follows `return`.

const double = function (n) { return n * 2; }; const isLong = function (text) { return text.length > 5; }; console.log(double(4), isLong("callback"));

Rewrite each function expression using an arrow, keeping only the returned expression as the body. The output stays 8 true.

Where to act: The row with `setTimeout`.

Next step: Consider what the current code must finish first. A delay of zero does not change the order rule on this page.

- `[1, 2].forEach(cb)`: During the call. `forEach` calls the callback for each item before it returns.
- `setTimeout(cb, 0)`: Later. Even at 0 ms it waits until the current code has finished.
- `button.addEventListener("click", cb)`: Later. It only registers the callback; it runs on each click.
- `[3, 1].map(cb)`: During the call. `map` builds its result by calling the callback before it returns.

What order do the letters print in?

- A C D B: correct. The `forEach` callback runs during its call. The timer callback must wait until all current code has finished, even with a 0 ms delay.
- A B C D: not correct. This treats the timer as running immediately. A 0 ms timer still waits for the current code to finish.
- A D C B: not correct. This treats `forEach` as delayed, but it calls back before it returns.
- B A C D: not correct. Nothing can run before line 1, and the timer has not even been set until line 2.

```
const f = (x) => x + 1;          // concise
const g = (x) => { return x + 1; }; // block
const h = () => ({ ok: true });    // returns an object
list.map(f);    // pass the function
list.map(f(1)); // bug: passes the result of calling it
```

## Sources

- MDN: Callback function, retrieved 2026-11-04
- MDN: Functions guide, retrieved 2026-11-04
- MDN: Arrow function expressions, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does line 5 print?

- `HI function`: correct. Without parentheses, `shout` is the function itself. `speak` now refers to it, so calling `speak` runs the same code.
- `HI string`: not correct. `typeof` is asked about `speak`, which holds a function, not the string it returned.
- It throws, because `shout` was called with no argument: not correct. Line 4 does not call anything. Calling needs parentheses.
- `undefined function`: not correct. `shout` returns a value, and `speak` is the same function, so the call returns `HI`.

### terminal

### Static alternative

Store a function that adds 5, hand the function itself to applyTwice with a start of 1, and log the result. Starting from 1, two calls give 6 then 11.

### terminal

### Static alternative

Rewrite each function expression using an arrow, keeping only the returned expression as the body. The output stays 8 true.

### explore

### Static alternative

- `[1, 2].forEach(cb)`: During the call. `forEach` calls the callback for each item before it returns.
- `setTimeout(cb, 0)`: Later. Even at 0 ms it waits until the current code has finished.
- `button.addEventListener("click", cb)`: Later. It only registers the callback; it runs on each click.
- `[3, 1].map(cb)`: During the call. `map` builds its result by calling the callback before it returns.

### mcq

### Static alternative

What order do the letters print in?

- A C D B: correct. The `forEach` callback runs during its call. The timer callback must wait until all current code has finished, even with a 0 ms delay.
- A B C D: not correct. This treats the timer as running immediately. A 0 ms timer still waits for the current code to finish.
- A D C B: not correct. This treats `forEach` as delayed, but it calls back before it returns.
- B A C D: not correct. Nothing can run before line 1, and the timer has not even been set until line 2.
