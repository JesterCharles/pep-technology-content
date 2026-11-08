# Updating state immutably

## Objectives

- Update an object in state by copying it with spread syntax instead of mutating it, including one nested object
- Add, remove and replace items of an array in state with non-mutating operations (spread, filter, map)
- Identify a mutation bug, such as push or direct property assignment, that leaves the screen unchanged, and fix it

## Teaching

Lists and objects in state have a trap that plain numbers do not. Predict this one before any teaching.

React decides whether to render by comparing the old and new state with `Object.is`. For objects and arrays that compares identity, not contents. Hand it the same object and it sees no change.

So treat state as read-only. Create a new array or object and pass that to the setter:

```
setItems([...items, 'b']);
```

Spread copies an object's properties into a new one, and a later property overrides an earlier one:

```
const next = { ...user, name: 'Grace' };
```

Spread is shallow: nested objects are shared, not copied. So copy at every level you change:

```
{ ...person, pet: { ...person.pet, age: 3 } }
```

Arrays follow the same rule. Use operations that return a new array:

- Add: `[...items, item]`
- Remove: `items.filter(x => x.id !== id)`
- Replace: `items.map(x => x.id === id ? { ...x, done: true } : x)`

Avoid `push`, `splice`, `pop` and `sort` on state directly: each changes the original array. To sort, copy first: `[...items].sort()`.

When a screen does not change after an update, look for a mutation first. Watch for assignment into state (`state.x = y`) and for array methods that change their array, such as `push` and `sort`.

## Recap

React compares state with `Object.is`, so handing back the same object looks like no change. Treat state as read-only and produce new values: spread for objects and each nested level you change, and spread, `filter` and `map` for arrays. `push`, `splice`, `sort` and direct assignment mutate, leaving the screen stale. Copy first if you need one of those.

## Cheat sheet

Static version: items holds ['a']; the handler pushes 'b' on the same array and passes that array to setItems. Decide what the screen shows, then compare with Activity 2.

A shop window displays a printed price list. Scribbling on the back-office copy changes nothing out front; staff replace the window sign only when they are handed a brand new printed sheet.

React re-reads state only when it is handed a new object.

Where to act: The "same array as before?" line in the inspector.

Next step: Compare that line with the Screen panel after each button. Ask what connects the two.

Without JavaScript the inspector cannot run. Mutating with push keeps the same array, so Object.is reports no change and the screen stays stale. Spreading makes a new array, so React renders. On paper, trace both handlers from the array ['a'].

Where to act: The body of `renamed`.

Next step: Return a new object that starts with all the existing properties, then override one.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The body of `moved`.

Next step: Two objects change: the user and its address. Spread at both levels, overriding city in the inner one.

Without JavaScript the editor cannot run. Starter: renamed and moved assign into the object they receive. On paper, rewrite each to return a new object using spread, copying the nested address in moved. When scripted, the editor runs your code against a frozen object.

Where to act: Each function body in turn.

Next step: Match each function to Add, Remove or Replace in the teaching list, then adapt the names.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The body of `retitled`.

Next step: The matching item needs a new object as well as the new array, while other items can be returned as they are.

Without JavaScript the editor cannot run. Starter: added pushes into its input, while removed and retitled are empty. On paper, write each using spread, filter or map so the input is untouched. Check your shape against the teaching list.

Static version: compare a filter, a sort after copying with spread, a sort directly on state, and a map that copies each item. Decide which one mutates state. Check against the method list in Activity 4.

```
setUser({ ...user, name });
setUser({ ...user, address: { ...user.address, city } });
setItems([...items, item]);
setItems(items.filter(x => x.id !== id));
setItems(items.map(x => x.id === id ? { ...x, title } : x));
setItems([...items].sort(byDate));
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax: Description
- react.dev/learn/updating-arrays-in-state: Updating arrays without mutation; Updating objects inside arrays
- react.dev/learn/updating-objects-in-state: Treat state as read-only; Copying objects with the spread syntax; Updating a nested object

## Static interaction alternatives

### predict

Static version: items holds ['a']; the handler pushes 'b' on the same array and passes that array to setItems. Decide what the screen shows, then compare with Activity 2.

### explore

Without JavaScript the inspector cannot run. Mutating with push keeps the same array, so Object.is reports no change and the screen stays stale. Spreading makes a new array, so React renders. On paper, trace both handlers from the array ['a'].

### terminal

Without JavaScript the editor cannot run. Starter: renamed and moved assign into the object they receive. On paper, rewrite each to return a new object using spread, copying the nested address in moved. When scripted, the editor runs your code against a frozen object.

### terminal

Without JavaScript the editor cannot run. Starter: added pushes into its input, while removed and retitled are empty. On paper, write each using spread, filter or map so the input is untouched. Check your shape against the teaching list.

### mcq

Static version: compare a filter, a sort after copying with spread, a sort directly on state, and a map that copies each item. Decide which one mutates state. Check against the method list in Activity 4.
