# Debugging with DevTools breakpoints

## Objectives

- Set a line-of-code breakpoint and a conditional breakpoint on the page's buggy practice script in real Chrome or Firefox DevTools
- Predict variable values as execution steps over, into and out of a paused function
- Identify the faulty line and its fix in the page's buggy practice script by pausing, stepping and watching values in real DevTools

## Teaching

This cart has two lines: 2 times 3, and 5 times 2, which should total 16. Trace the code before you use any tools.

```
let total = 0;
for (const item of items) {
  total = lineTotal(item);
}
return total;
```

A breakpoint pauses code at a line, so you can inspect live values. `console.log` shows what you thought to print; a paused debugger shows everything in scope.

A conditional breakpoint pauses only when an expression is true, which is ideal for loops. The `debugger;` statement also pauses, when DevTools is open. Remove it before you commit.

This step needs desktop Chrome or Firefox.

While paused, three controls move you forward. Step over runs the current line and stops at the next one, without going inside any function it calls. Step into enters the function being called. Step out finishes the current function and returns to its caller.

Watch the values in Scope after each step, and predict them first. This simulator runs a fixed trace of the same script, and real tools may stop at slightly different positions.

Debugging ends with a fix you can verify. Change only what the evidence points to, then check the original case and one edge case. A small fix on the faulty line is better than rewriting code you have not traced.

A loop processes 5,000 orders. Order 4,812 produces a wrong total, and you know its `id`. Pausing on every pass would take all day.

## Recap

Set a line breakpoint where you want to inspect, or a conditional one for a specific pass of a loop. While paused, read Scope, and step over, into or out. Predict each value before stepping. When the value surprises you, you have found where to look. Then fix one line and verify it.

## Cheat sheet

What does this code return?

- `10`: correct. Each pass replaces `total`, so only the last line, 5 times 2, survives. That is the bug you will find with real tools.
- `16`: not correct. That is what it should return. Look at how `total` is updated on each pass.
- `6`: not correct. That is the first line only. A later pass overwrites it.
- `0`: not correct. `total` is assigned inside the loop, so it does not stay 0.

Where to act: The Sources panel file tree, or Debugger in Firefox.

Next step: The script is named by a comment in the page, so search open files for its name with Ctrl+P, or Cmd+P on a Mac.

In DevTools Sources or Debugger, open buggy-cart.js. Click the line number of the assignment inside the loop to set a breakpoint, run the script, and read item and total in Scope. Edit the breakpoint to the condition item.price === 5, and it then pauses only on the second item.

Where to act: The Scope box as you step over the loop.

Next step: Note `total` before and after the second pass. Ask whether it grew or was replaced.

From line 7, Step into enters lineTotal at line 2, and Step out returns to line 7 with lineTotal's return value 6, before the assignment runs. Step over assigns total = 6 and repeats for the second item, and total becomes 10, not 16, so line 7 replaces the total rather than adding to it.

Where to act: The line you identified in the last activity.

Next step: Replace the plain assignment with the operator that adds to the current value.

function lineTotal(item) { return item.price * item.qty; } function cartTotal(items) { let total = 0; for (const item of items) { total = lineTotal(item); } return total; } console.log(cartTotal([{ price: 2, qty: 3 }, { price: 5, qty: 2 }])); console.log(cartTotal([]));

The assignment in the loop must add to total rather than replace it. The cart then totals 16, and an empty cart gives 0.

What should you do?

- Set a conditional breakpoint in the loop with a condition such as `order.id === 4812`: correct. It pauses only on the pass you care about, with all values available and no code changes.
- Set a plain breakpoint and resume 4,811 times: not correct. That works, but wastes your time. It is exactly what a condition avoids.
- Add `console.log(order)` in the loop and search 5,000 lines: not correct. It may find the order, but you cannot inspect or step from that point, and the log must be removed later.
- Step into every function from the start of the program: not correct. You would spend hours in code unrelated to the bad order.

| Control | What it does |
| --- | --- |
| Step over | Run this line, and stop at the next |
| Step into | Enter the function being called |
| Step out | Finish this function, and return to its caller |
| Conditional breakpoint | Pause only when an expression is true |
| `debugger;` | Pause here when DevTools is open |

## Sources

- Chrome DevTools: Debug JavaScript, retrieved 2026-11-04
- Chrome DevTools: Pause your code with breakpoints, retrieved 2026-11-04
- MDN: debugger, retrieved 2026-11-04
- Firefox DevTools: Debugger, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does this code return?

- `10`: correct. Each pass replaces `total`, so only the last line, 5 times 2, survives. That is the bug you will find with real tools.
- `16`: not correct. That is what it should return. Look at how `total` is updated on each pass.
- `6`: not correct. That is the first line only. A later pass overwrites it.
- `0`: not correct. `total` is assigned inside the loop, so it does not stay 0.

### explore

### Static alternative

In DevTools Sources or Debugger, open buggy-cart.js. Click the line number of the assignment inside the loop to set a breakpoint, run the script, and read item and total in Scope. Edit the breakpoint to the condition item.price === 5, and it then pauses only on the second item.

### explore

### Static alternative

From line 7, Step into enters lineTotal at line 2, and Step out returns to line 7 with lineTotal's return value 6, before the assignment runs. Step over assigns total = 6 and repeats for the second item, and total becomes 10, not 16, so line 7 replaces the total rather than adding to it.

### terminal

### Static alternative

The assignment in the loop must add to total rather than replace it. The cart then totals 16, and an empty cart gives 0.

### mcq

### Static alternative

What should you do?

- Set a conditional breakpoint in the loop with a condition such as `order.id === 4812`: correct. It pauses only on the pass you care about, with all values available and no code changes.
- Set a plain breakpoint and resume 4,811 times: not correct. That works, but wastes your time. It is exactly what a condition avoids.
- Add `console.log(order)` in the loop and search 5,000 lines: not correct. It may find the order, but you cannot inspect or step from that point, and the log must be removed later.
- Step into every function from the start of the program: not correct. You would spend hours in code unrelated to the bad order.
