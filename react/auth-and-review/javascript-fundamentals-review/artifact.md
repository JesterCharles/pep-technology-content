# JavaScript fundamentals review

## Objectives

- Apply destructuring, spread syntax, arrow functions and array map and filter as they appear in React code
- Trace an async function that awaits fetch, including where a rejected promise or a non-2xx response is handled
- Use ES module import and export, both default and named, correctly

## Teaching

This review page revisits the JavaScript that React code leans on. Start from memory: answer before looking anything up.

Quick reminders: destructuring pulls out named values and can collect the rest; spread copies properties or items into a new object or array, with later entries overriding; arrow functions with parentheses return a value directly; map transforms every item, filter keeps some. None of these mutate the original.

`async` functions pause at each `await` and give back a promise. In a `fetch` chain, two different failures end up in two different places:

- A rejected promise (network failure) jumps to `catch`.
- A non-2xx response does not reject: `fetch` resolves, and you must check `res.ok` yourself.

Modules: a file has at most one default export, imported with no braces under any name, and many named exports, imported with braces under their exact name. You can combine both on one line: `import Page, { Footer } from './page.js';`

Bring it together as you read any React data code: what does each line give back, and where does a failure go? Async code pauses but still runs top to bottom. Non-2xx statuses travel the normal path until you check them.

## Recap

Destructuring pulls out values, and collects the rest; spread copies into new objects and arrays; arrow functions with parentheses return directly; `map` transforms and `filter` keeps, without mutating. In async code, a rejected promise jumps to the nearest `catch`, while a non-2xx response does not reject, so check `res.ok`. Modules import a default with no braces, and named exports with braces and the exact name.

## Cheat sheet

Static version: from a user with name, role and age, destructure name and the rest, then spread rest into a new object with role set to user. Work out what name and next hold, then compare with the recap.

Where to act: The `map` callback parameter.

Next step: You can destructure in the parameter itself, taking name and collecting the rest.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The object returned from the callback.

Next step: Spread what you collected, and add the new property. Remember that returning an object from an arrow function directly needs parentheses around it.

Without JavaScript the editor cannot run. Starter: summarize returns its input. On paper, use filter to keep active users, and map with destructuring and spread to build objects with an upper-case label and no name. When scripted, the code runs on frozen input.

Where to act: The Scenario list, then the Step button.

Next step: Follow the highlighted line in each scenario. Which line handled each failure?

Without JavaScript the tracer cannot run. Code: load awaits fetch, returns a message if res.ok is false, and otherwise returns the JSON, with a catch returning another message. On paper, trace it for a 200, a 500 and a network failure.

Where to act: The import line in `src/App.jsx`.

Next step: Look at each export in math.js in turn, and decide on braces or no braces. The teaching example shows how to put both on one line.

Without JavaScript the editor cannot run. math.js has a default export add and a named export PI. On paper, write one import line that brings in both from your own file, and compare with the teaching example.

Static version: load awaits fetch with no try and catch inside, and the caller uses .catch. The fetch rejects. Trace where the rejection goes, then compare with Activity 3.

```
const { name, ...rest } = user;
const next = { ...rest, role: 'user' };
const labels = users.filter(u => u.active).map(u => u.name);

try {
  const res = await fetch(url);
  if (!res.ok) { /* non-2xx */ }
} catch (e) { /* rejected */ }

export default function Page() {}
export const PI = 3.14;
import Page, { PI } from './page.js';
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules: Exporting module features; Importing features into your script; Default exports versus named exports
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map: Description
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring: Syntax; Description
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax: Description
- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function: Description

## Static interaction alternatives

### predict

Static version: from a user with name, role and age, destructure name and the rest, then spread rest into a new object with role set to user. Work out what name and next hold, then compare with the recap.

### terminal

Without JavaScript the editor cannot run. Starter: summarize returns its input. On paper, use filter to keep active users, and map with destructuring and spread to build objects with an upper-case label and no name. When scripted, the code runs on frozen input.

### explore

Without JavaScript the tracer cannot run. Code: load awaits fetch, returns a message if res.ok is false, and otherwise returns the JSON, with a catch returning another message. On paper, trace it for a 200, a 500 and a network failure.

### terminal

Without JavaScript the editor cannot run. math.js has a default export add and a named export PI. On paper, write one import line that brings in both from your own file, and compare with the teaching example.

### mcq

Static version: load awaits fetch with no try and catch inside, and the caller uses .catch. The fetch rejects. Trace where the rejection goes, then compare with Activity 3.
