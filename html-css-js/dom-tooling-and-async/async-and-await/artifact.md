# async and await

## Objectives

- Rewrite a then chain with async and await
- Handle a rejected await with try and catch
- Predict that an async function always returns a promise

## Teaching

This function returns a plain number. Predict what the caller receives.

```
async function f() {
  return 1;
}
console.log(f());
```

`await` pauses the surrounding `async` function until a promise settles, then gives you the fulfilment value. Other code keeps running in the meantime; only this function waits.

```
async function total() {
  const order = await loadOrder();
  return order.total;
}
```

`await` works only inside `async` functions, and at the top level of a module. The result is the same promise machinery as `then`, written in straight lines.

When an awaited promise rejects, `await` throws at that line. Handle it with ordinary `try` and `catch`.

```
try {
  const order = await loadOrder();
  show(order);
} catch (err) {
  showError(err.message);
}
```

Keep `await` inside the `try`. If you return a promise without awaiting it, the `catch` will not see its rejection.

Two `await` lines in a row run one after another: the second call does not even start until the first finishes.

```
const a = await slow(300);  // starts after nothing
const b = await slow(200);  // starts after a finishes
const [c, d] = await Promise.all([slow(300), slow(200)]);
```

When the two do not depend on each other, start them together with `Promise.all` and await the combined promise.

`postData` returns a promise that rejects. A teammate says the `catch` block never runs and the console shows an unhandled rejection.

```
async function save() {
  try {
    postData();
  } catch (err) {
    console.log("caught", err.message);
  }
}
```

## Recap

An `async` function always returns a promise. `await` pauses only that function and unwraps the value, and a rejection throws at the `await`, so use `try` and `catch` around it. Consecutive awaits run one after another, while `Promise.all` starts them together.

## Cheat sheet

What does line 4 log?

- A promise, already fulfilled with 1: correct. An `async` function always returns a promise. A returned value becomes its fulfilment value, and a thrown error becomes its rejection.
- `1`: not correct. That would need `await f()`, or a `then` callback, to get the value out.
- `undefined`: not correct. The function does return something, wrapped in a promise.
- A SyntaxError, because there is no `await`: not correct. `await` is optional in an `async` function.

Where to act: The first line of `showName`.

Next step: Add the keyword that makes it return a promise, then put the user in a variable with `await`.

function showName(id) { return getUser(id) .then((user) => user.name) .then((name) => name.toUpperCase()); } showName(1).then((v) => console.log(v));

Mark the function async, await getUser to get the user, then return the upper-cased name. The last line still uses then, because an async function returns a promise. The output is ADA.

Where to act: Inside `loadName`.

Next step: Write a `try` block containing the `await` and a return of the name. The `catch` block returns the fallback.

async function loadName(id) { ___ } loadName(1).then((v) => { console.log(v); return loadName(99); }).then((v) => console.log(v));

Put the await and the return of the name in a try block, and return Unknown from the catch block. The output is Ada, then Unknown.

Where to act: The readout after each run.

Next step: Add up the two delays and compare that with the measured time for each button.

Two awaits in sequence take about 500 ms, the sum of the delays. Promise.all takes about 300 ms, the longest delay, because both started together.

Why does the catch block not run?

- `postData()` is not awaited, so the `try` finishes before the rejection happens: correct. Without `await`, the call returns a promise at once and nothing throws. Add `await` and the rejection throws inside the `try`.
- `try` and `catch` do not work in `async` functions: not correct. They work well there, but only for promises you await.
- The `catch` needs to be a `.catch` on `save()`: not correct. That handles rejections from `save` itself, and `save` does not reject here.
- `err` needs a type, as in Java: not correct. JavaScript `catch` parameters take no type.

```
async function load() {
  try {
    const [a, b] = await Promise.all([one(), two()]);
    return a + b;
  } catch (err) {
    return 0;
  }
}
```

## Sources

- MDN: await, retrieved 2026-11-04
- MDN: async function, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does line 4 log?

- A promise, already fulfilled with 1: correct. An `async` function always returns a promise. A returned value becomes its fulfilment value, and a thrown error becomes its rejection.
- `1`: not correct. That would need `await f()`, or a `then` callback, to get the value out.
- `undefined`: not correct. The function does return something, wrapped in a promise.
- A SyntaxError, because there is no `await`: not correct. `await` is optional in an `async` function.

### terminal

### Static alternative

Mark the function async, await getUser to get the user, then return the upper-cased name. The last line still uses then, because an async function returns a promise. The output is ADA.

### terminal

### Static alternative

Put the await and the return of the name in a try block, and return Unknown from the catch block. The output is Ada, then Unknown.

### explore

### Static alternative

Two awaits in sequence take about 500 ms, the sum of the delays. Promise.all takes about 300 ms, the longest delay, because both started together.

### mcq

### Static alternative

Why does the catch block not run?

- `postData()` is not awaited, so the `try` finishes before the rejection happens: correct. Without `await`, the call returns a promise at once and nothing throws. Add `await` and the rejection throws inside the `try`.
- `try` and `catch` do not work in `async` functions: not correct. They work well there, but only for promises you await.
- The `catch` needs to be a `.catch` on `save()`: not correct. That handles rejections from `save` itself, and `save` does not reject here.
- `err` needs a type, as in Java: not correct. JavaScript `catch` parameters take no type.
