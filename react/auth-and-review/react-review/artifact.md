# React review

## Objectives

- Apply components, props, state, effects, routing, forms and context together on short mixed problems, including every re-render trigger taught (a state update, a parent re-render and a changed context value)
- Diagnose common React bugs (mutated state, a missing or unstable key, a wrong dependency array, an unhandled error status) and name the fix

## Teaching

This review page mixes everything from the course. Start from memory, before looking anything up.

Most React bugs fall into a few families: mutated state (screen stays stale), unstable keys (state lands on the wrong row), wrong dependency array (stale data, or endless fetching), and unhandled error status (error body treated as data). Name the family first, and the fix usually follows.

Combine two earlier fixes here. Rendering a list needs a stable key from the data. Toggling one item needs a new array and a new object for that item, not an assignment into state.

Work one bug at a time: Problems reports what the practice runtime sees, and the check then clicks a row.

An Effect's dependency array must match what it reads. With no array, it runs after every render; with `[]`, once; with values, when they change. A fetch that stores a new object in state after every render is a loop.

Good React code has one owner for each value, and data flowing down through props or context, with events flowing back up. Forms are controlled, Effects sync with the outside, and the server enforces the rules.

## Recap

Three things re-render a component: a state update, a parent re-render, and a changed context value. Common bugs come in families: mutated state leaves the screen stale, so make new objects; unstable keys put state on the wrong row, so use stable ids; a wrong dependency array leaves stale data or endless requests, so list what the Effect reads; and an unhandled status treats errors as data, so check `res.ok`.

## Cheat sheet

Static version: from memory, list the three things taught in this course that cause a component to re-render. Compare with the recap.

Where to act: Each case list.

Next step: Read the code in the symptom, and ask what the data or identity is doing, not just what the screen shows.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Any case you are unsure about.

Next step: Match the words: a stale screen after an update points to identity, a value on the wrong row points to keys, and a list of errors shown as data points to status handling.

Without JavaScript the clinic cannot run. On paper, name the bug family and fix for each: push and then set with the same array; notes jumping with index keys; a stale profile with an empty array; and an error body added to a list after a failed save.

Where to act: The `key` prop on the `li`.

Next step: Which property of a todo belongs to that item, however the list changes?

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The body of `toggle`.

Next step: Build a new array in which one item is replaced by a copy with done flipped. You have done this in Updating state immutably.

Without JavaScript the editor cannot run. Starter: Todos uses key={i}, and toggle assigns done on the found item, then sets the same array. On paper, rewrite both. When scripted, the runtime clicks the first button to check the result.

Static version: an Effect fetches using id, sets state, and has no second argument. Compare adding [id], adding [], removing the setter, and using memo. Choose using the teaching text.

Static version: the signed-in user is needed on every screen, and it changes. Compare state with context, a global variable, local toolbar state, and prop drilling. Choose using the teaching text.

```
setItems([...items, x]);                         // new array
<li key={item.id}>                               // stable key
useEffect(() => { /* ... */ }, [id]);            // list what it reads
if (!res.ok) throw new Error('Status ' + res.status);
const user = useContext(UserContext);            // widely needed value
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/API/Response/ok: Value
- react.dev/learn/rendering-lists: Keeping list items in order with key
- react.dev/learn/updating-arrays-in-state: Updating arrays without mutation
- react.dev/reference/react/useEffect: Troubleshooting
- react.dev/versions: Latest version: 19.3

## Static interaction alternatives

### predict

Static version: from memory, list the three things taught in this course that cause a component to re-render. Compare with the recap.

### explore

Without JavaScript the clinic cannot run. On paper, name the bug family and fix for each: push and then set with the same array; notes jumping with index keys; a stale profile with an empty array; and an error body added to a list after a failed save.

### terminal

Without JavaScript the editor cannot run. Starter: Todos uses key={i}, and toggle assigns done on the found item, then sets the same array. On paper, rewrite both. When scripted, the runtime clicks the first button to check the result.

### mcq

Static version: an Effect fetches using id, sets state, and has no second argument. Compare adding [id], adding [], removing the setter, and using memo. Choose using the teaching text.

### mcq

Static version: the signed-in user is needed on every screen, and it changes. Compare state with context, a global variable, local toolbar state, and prop drilling. Choose using the teaching text.
