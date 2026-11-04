# The event loop

## Objectives

- Predict the output order of synchronous code, promise callbacks and setTimeout callbacks
- Explain why a long synchronous task freezes the page

## Teaching

This mixes a timer, a promise and plain code. Commit to an order.

```
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

JavaScript on a page runs on one main thread. The call stack holds what is running now. Timer callbacks and events wait in a task queue, and promise callbacks wait in the microtask queue.

The rule: run a task to completion, then drain all microtasks, then let the browser render if it needs to, then take the next task. Nothing interrupts running code.

You can now predict order by asking where each callback waits. Plain code finishes first, then every microtask, then one task at a time. A microtask queued during a microtask runs before any task, so endless microtasks would starve the page.

Because one thread does everything, long synchronous work blocks the event loop. No timers run, no clicks are handled and nothing paints until it ends.

Splitting work into small pieces with `setTimeout` lets the loop breathe between chunks. Heavy calculations can also move to a Web Worker. `async` alone does not help: code with no `await` still runs without a break.

A click handler freezes the page for five seconds while it totals a large report. A teammate "fixes" it like this.

```
async function totalReport(rows) {
  let sum = 0;
  for (const row of rows) {
    sum += expensive(row);
  }
  return sum;
}
```

## Recap

One thread runs a task to completion, then drains all microtasks, then may render, then takes the next task. Promise callbacks are microtasks and timer callbacks are tasks. So a long synchronous stretch freezes everything: split it into chunks or use a Web Worker, because `async` alone does not yield.

## Cheat sheet

What order is printed?

- 1 4 3 2: correct. Plain code runs first. Then all promise callbacks run, and only then the timer callback, even with a 0 ms delay.
- 1 2 3 4: not correct. That is top-to-bottom order, but the two callbacks must wait for the plain code to finish.
- 1 4 2 3: not correct. This has the plain code right, but promise callbacks run before timer callbacks.
- 1 3 2 4: not correct. No callback can interrupt the plain code, so `4` must come before them.

Where to act: The queues after the plain code has ended.

Next step: Before stepping, say which queue the loop takes from next, and why.

Line 1 logs 1. setTimeout puts callback 2 in the task queue. then puts callback 3 in the microtask queue. Line 4 logs 4 and the stack empties. All microtasks run, logging 3. The next task runs, logging 2.

Where to act: The space between the two `console.log` lines.

Next step: One callback goes through `setTimeout`, the other through `Promise.resolve().then(...)`. The order of your two lines will not change their result.

console.log("start"); // Add your two callbacks here. console.log("end");

Use setTimeout for one callback and Promise.resolve().then for the other. Plain code logs start and end first, then the microtask logs promise, then the task logs timeout.

Where to act: The readout after each run.

Next step: Compare the longest gap in each case with the 50 ms the timer asked for.

A 1.2 second synchronous loop stops the timer for about 1200 ms, and the page ignores input during that time. The same work split into chunks of about 20 ms with setTimeout keeps the gap small, near the chunk length.

Does this stop the freeze?

- No. With no `await`, the loop runs start to finish in one go, so the page still freezes: correct. `async` only changes what the function returns. Yield with chunks and `setTimeout`, or move the work to a Web Worker.
- Yes. `async` functions run on a background thread: not correct. JavaScript runs them on the main thread. `async` adds no threads.
- Yes, because it returns a promise: not correct. The promise comes back only after the synchronous loop has finished.
- No, because `async` functions cannot contain loops: not correct. They can. The problem is that nothing here gives way to the loop.

| Source | Where it waits |
| --- | --- |
| Plain code | Runs now, on the call stack |
| `then`, `catch`, `await` continuation | Microtask queue |
| `setTimeout`, DOM events | Task queue |

## Sources

- MDN: Using microtasks, retrieved 2026-11-04
- MDN: JavaScript execution model, retrieved 2026-11-04
- WHATWG HTML: Web application APIs, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What order is printed?

- 1 4 3 2: correct. Plain code runs first. Then all promise callbacks run, and only then the timer callback, even with a 0 ms delay.
- 1 2 3 4: not correct. That is top-to-bottom order, but the two callbacks must wait for the plain code to finish.
- 1 4 2 3: not correct. This has the plain code right, but promise callbacks run before timer callbacks.
- 1 3 2 4: not correct. No callback can interrupt the plain code, so `4` must come before them.

### explore

### Static alternative

Line 1 logs 1. setTimeout puts callback 2 in the task queue. then puts callback 3 in the microtask queue. Line 4 logs 4 and the stack empties. All microtasks run, logging 3. The next task runs, logging 2.

### terminal

### Static alternative

Use setTimeout for one callback and Promise.resolve().then for the other. Plain code logs start and end first, then the microtask logs promise, then the task logs timeout.

### explore

### Static alternative

A 1.2 second synchronous loop stops the timer for about 1200 ms, and the page ignores input during that time. The same work split into chunks of about 20 ms with setTimeout keeps the gap small, near the chunk length.

### mcq

### Static alternative

Does this stop the freeze?

- No. With no `await`, the loop runs start to finish in one go, so the page still freezes: correct. `async` only changes what the function returns. Yield with chunks and `setTimeout`, or move the work to a Web Worker.
- Yes. `async` functions run on a background thread: not correct. JavaScript runs them on the main thread. `async` adds no threads.
- Yes, because it returns a promise: not correct. The promise comes back only after the synchronous loop has finished.
- No, because `async` functions cannot contain loops: not correct. They can. The problem is that nothing here gives way to the loop.
