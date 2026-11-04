# Scope and closures

## Objectives

- Identify which variables a function can see from its block, function and module scope
- Write a function that returns a closure keeping private state between calls
- Predict the values logged by callbacks created in a loop declared with let

## Teaching

`makeCounter` has already returned when `a` is called. Predict whether its `count` is still around.

```
function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}
const a = makeCounter();
const b = makeCounter();
a();
a();
console.log(a(), b());
```

Scope decides which names a line can read. `let` and `const` are block-scoped: visible only inside their `{ }`. Parameters and function-level names are visible throughout that function. Module top-level names are visible everywhere in the file. Lookups go outward, never inward.

```
const tax = 0.2;
function price(base) {
  const total = base * (1 + tax);
  if (total > 100) {
    const note = "large";
    // line A
  }
  // line B
}
// line C
```

A closure is a function plus access to the variables around where it was created. They stay alive as long as the function does.

That gives you private state with no class: code outside cannot read the variable, only call the function that uses it. Each call to the outer function creates new variables, so results are independent.

Loops create callbacks that run later, so which `i` do they remember? With `let`, each pass of a `for` loop gets a new binding of `i`, and each callback closes over its own. With `var`, there is one function-wide `i`, so all the callbacks share it and see its final value.

You attach a handler to each button in a loop, a very common use of closures.

```
const buttons = document.querySelectorAll("button");
for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener("click", () => {
    console.log("clicked", i);
  });
}
```

## Recap

Name lookups go outward from a line through its blocks, its function and the module, never inward. A closure is a function that keeps access to the variables around where it was created, which gives you private state. A `for` loop with `let` makes a fresh binding each pass, so callbacks remember their own value.

## Cheat sheet

What does the last line print?

- `3 1`: correct. Each call to `makeCounter` creates its own `count`. The returned function keeps access to it, so `a` reaches 3 while `b` starts its own count at 1.
- `1 1`: not correct. That would mean `count` resets on every call to the returned function. It is created once per `makeCounter` call.
- `3 4`: not correct. That would mean `a` and `b` share one `count`. Each `makeCounter` call makes a new one.
- It throws, because `count` no longer exists: not correct. In Java terms you might expect the local to be gone. Here the function keeps it alive.

Where to act: The row naming `note`.

Next step: Find the braces that directly enclose its declaration, then ask whether the line in question is inside them.

- `tax` at line A: Can read it. Lookups go outward, and module scope encloses everything in the file.
- `base` at line A: Can read it. The `if` block sits inside the function that owns the parameter.
- `note` at line B: ReferenceError. The `const` is scoped to the `if` block, and line B is outside it.
- `total` at line B: Can read it. It is declared in the function block, and line B is in that block.
- `total` at line C: ReferenceError. Line C is outside the function, and lookups never go inward.

A coat-check attendant hands you a numbered ticket. You cannot walk behind the counter, but presenting the ticket gets your own coat back, and every other guest has a separate ticket and a separate coat.

You reach private things only through what you were handed, and each person has their own.

Where to act: Inside `makeTally`, before anything is returned.

Next step: Declare a variable for the running total here, so each `makeTally` call gets its own.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: After that variable, still inside `makeTally`.

Next step: Return an arrow function with one parameter. Its body updates the outer variable and then returns it.

function makeTally(start) { ___ } const t = makeTally(10); console.log(t(5)); console.log(t(1)); const other = makeTally(0); console.log(other(2));

Inside makeTally, keep a local running total and return a function that updates and returns it. Each makeTally call has its own total, so the output is 15, 16, 2.

Where to act: The Your prediction list.

Next step: Ask how many separate copies of the loop variable exist with the selected keyword, then what value each copy holds when the callbacks run.

With let, each pass has its own i, so the callbacks print 0 1 2. With var, there is one shared i, which is 3 by the time the callbacks run, so they print 3 3 3.

What is logged when the second button is clicked?

- `clicked 1`: correct. With `let`, each pass has its own `i`. The second button's listener closed over the binding holding 1.
- `clicked 3`: not correct. That is the shared-variable result you get from `var`, not `let`.
- `clicked 2`: not correct. Indexes start at 0, so the second button is index 1.
- A ReferenceError, because the loop has ended: not correct. The closure keeps its binding alive after the loop ends.

```
function makeThing() {
  let hidden = 0;            // private, one per call
  return () => (hidden += 1); // the closure
}
```

## Sources

- MDN: Scope, retrieved 2026-11-04
- MDN: Closures, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does the last line print?

- `3 1`: correct. Each call to `makeCounter` creates its own `count`. The returned function keeps access to it, so `a` reaches 3 while `b` starts its own count at 1.
- `1 1`: not correct. That would mean `count` resets on every call to the returned function. It is created once per `makeCounter` call.
- `3 4`: not correct. That would mean `a` and `b` share one `count`. Each `makeCounter` call makes a new one.
- It throws, because `count` no longer exists: not correct. In Java terms you might expect the local to be gone. Here the function keeps it alive.

### explore

### Static alternative

- `tax` at line A: Can read it. Lookups go outward, and module scope encloses everything in the file.
- `base` at line A: Can read it. The `if` block sits inside the function that owns the parameter.
- `note` at line B: ReferenceError. The `const` is scoped to the `if` block, and line B is outside it.
- `total` at line B: Can read it. It is declared in the function block, and line B is in that block.
- `total` at line C: ReferenceError. Line C is outside the function, and lookups never go inward.

### terminal

### Static alternative

Inside makeTally, keep a local running total and return a function that updates and returns it. Each makeTally call has its own total, so the output is 15, 16, 2.

### explore

### Static alternative

With let, each pass has its own i, so the callbacks print 0 1 2. With var, there is one shared i, which is 3 by the time the callbacks run, so they print 3 3 3.

### mcq

### Static alternative

What is logged when the second button is clicked?

- `clicked 1`: correct. With `let`, each pass has its own `i`. The second button's listener closed over the binding holding 1.
- `clicked 3`: not correct. That is the shared-variable result you get from `var`, not `let`.
- `clicked 2`: not correct. Indexes start at 0, so the second button is index 1.
- A ReferenceError, because the loop has ended: not correct. The closure keeps its binding alive after the loop ends.
