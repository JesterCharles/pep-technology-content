# Promises

## Objectives

- Describe the pending, fulfilled and rejected states of a promise
- Chain then calls and handle a rejection with catch
- Run independent promises together with Promise.all and predict how one rejection affects it

## Teaching

This promise is already fulfilled when `then` is called. Predict the order anyway.

```
const p = Promise.resolve(1);
p.then((v) => console.log("value", v));
console.log("after");
```

A promise stands for a result that may not exist yet. It starts pending, then settles once as either fulfilled with a value or rejected with a reason. Once settled, it never changes.

`then` registers what to do on fulfilment, and `catch` what to do on rejection. A Java developer can think of `CompletableFuture`, without blocking `get()` calls.

`then` returns a new promise, so calls chain. Whatever a callback returns becomes the next value; if it returns a promise, the chain waits for it.

```
load()
  .then((order) => order.total)
  .then((total) => console.log(total))
  .catch((err) => console.log(err.message));
```

A rejection skips ahead to the next `catch`, and a thrown error inside `then` becomes a rejection too. Without a `catch`, you get an unhandled rejection.

`Promise.all` takes promises and returns one. It fulfills with an array of results in input order, not completion order, once all have fulfilled. It rejects as soon as any one rejects, with that reason. The others still run, but their results are ignored.

`Promise.allSettled` waits for all and reports each outcome.

Two requests start together. `slow` takes 300 ms and succeeds; `fast` takes 100 ms and rejects.

```
Promise.all([slow(), fast()])
  .then((values) => console.log(values))
  .catch((err) => console.log("failed", err.message));
```

## Recap

A promise is pending, then settles once as fulfilled or rejected. `then` returns a new promise, so chains pass values along, and `catch` handles any rejection earlier in the chain. `Promise.all` gives results in input order and rejects on the first failure; `allSettled` reports every outcome.

## Cheat sheet

What is printed, in order?

- `after`, then `value 1`: correct. A `then` callback never runs during the `then` call, even for a settled promise. It waits until the current code has finished.
- `value 1`, then `after`: not correct. That treats `then` as a direct call. Callbacks are always delayed, so behavior stays consistent.
- Only `after`: not correct. The callback does run, once the current code finishes.
- It throws, because the promise has already finished: not correct. Attaching handlers to a settled promise works fine.

Where to act: The three buttons at the top of the model.

Next step: Settling a promise twice is the interesting case, so press a second settle button before creating a new promise.

A new promise is pending. resolve makes it fulfilled and runs the then handler. reject makes a new promise rejected and runs the catch handler. Calling either again after settling has no effect.

Where to act: The first `.then` of the first chain.

Next step: The callback receives a user object and returns only the part the next step needs.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `.catch` calls.

Next step: The callback receives the rejection reason, an `Error`. Log the property that holds its text.

getUser(1) .then(___) .then(___) .catch(___); getUser(99) .then(___) .then(___) .catch(___);

The first then returns the user name, the second logs it, and the catch logs the error message. getUser(1) leads to Ada, and getUser(99) skips the then callbacks and logs User not found.

Where to act: The readout after each run.

Next step: Compare the elapsed time with each delay, and see which results are present.

With no failures, Promise.all gives results in input order after about 300 ms. If orders rejects, it rejects at about 100 ms with that reason. allSettled waits about 300 ms and reports every outcome.

What happens?

- The `catch` runs at about 100 ms. `slow` still finishes, but its result is ignored: correct. `Promise.all` rejects on the first rejection. It cannot cancel the other work, so that keeps going with nothing listening for the result.
- The `catch` runs at about 300 ms, after both have finished: not correct. That is how `allSettled` waits. `Promise.all` rejects right away.
- The `then` runs with `slow`'s value and `undefined`: not correct. Any rejection rejects the whole `Promise.all`, so `then` does not run.
- Rejecting `fast` cancels `slow` immediately: not correct. A plain promise has no cancellation. The work continues.

```
task()
  .then((v) => next(v))
  .catch((e) => showError(e));
Promise.all([a(), b()]);        // all or first failure
Promise.allSettled([a(), b()]); // every outcome
```

## Sources

- MDN: Using promises, retrieved 2026-11-04
- MDN: Promise, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What is printed, in order?

- `after`, then `value 1`: correct. A `then` callback never runs during the `then` call, even for a settled promise. It waits until the current code has finished.
- `value 1`, then `after`: not correct. That treats `then` as a direct call. Callbacks are always delayed, so behavior stays consistent.
- Only `after`: not correct. The callback does run, once the current code finishes.
- It throws, because the promise has already finished: not correct. Attaching handlers to a settled promise works fine.

### explore

### Static alternative

A new promise is pending. resolve makes it fulfilled and runs the then handler. reject makes a new promise rejected and runs the catch handler. Calling either again after settling has no effect.

### terminal

### Static alternative

The first then returns the user name, the second logs it, and the catch logs the error message. getUser(1) leads to Ada, and getUser(99) skips the then callbacks and logs User not found.

### explore

### Static alternative

With no failures, Promise.all gives results in input order after about 300 ms. If orders rejects, it rejects at about 100 ms with that reason. allSettled waits about 300 ms and reports every outcome.

### mcq

### Static alternative

What happens?

- The `catch` runs at about 100 ms. `slow` still finishes, but its result is ignored: correct. `Promise.all` rejects on the first rejection. It cannot cancel the other work, so that keeps going with nothing listening for the result.
- The `catch` runs at about 300 ms, after both have finished: not correct. That is how `allSettled` waits. `Promise.all` rejects right away.
- The `then` runs with `slow`'s value and `undefined`: not correct. Any rejection rejects the whole `Promise.all`, so `then` does not run.
- Rejecting `fast` cancels `slow` immediately: not correct. A plain promise has no cancellation. The work continues.
