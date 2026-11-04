# Destructuring and spread

## Objectives

- Extract values from arrays and objects with destructuring, including default values
- Copy and merge arrays and objects with spread syntax
- Predict that a spread copy is shallow: nested objects stay shared

## Teaching

This syntax has no Java equivalent, so read it carefully and take your best guess.

```
const { name, role = "guest" } = { name: "Ada" };
console.log(name, role);
```

Object destructuring reads properties into variables of the same name. Array destructuring reads by position.

```
const { title, year } = book;
const [first, second] = list;
const { pages = 0 } = book; // default
```

A default applies only when the value is `undefined`, not when it is `null` or `0`. Destructuring also works in parameters, which you will meet in API code.

Spread `...` expands an array or object into a new one. It gives you new containers without changing the originals.

```
const more = [...list, 9];
const updated = { ...book, year: 2026 };
```

When merging objects, later properties win, so order matters: put defaults first and overrides last.

A spread copy is shallow. It makes a new outer object, but nested objects are copied by reference, so both copies share them.

Change a top-level property on the copy and the original keeps its value. Change something inside a nested object and both see it.

`structuredClone(value)` makes a deep copy when you truly need independent nested data.

Arrays of objects behave the same way. Trace this before you answer.

```
const a = [{ n: 1 }];
const b = [...a];
b[0].n = 2;
b.push({ n: 3 });
console.log(a.length, a[0].n);
```

## Recap

Destructuring reads values into variables by name or position, and defaults apply only for `undefined`. Spread builds new arrays and objects, with later properties winning. Spread is shallow: nested objects stay shared, so use `structuredClone` when you need independence.

## Cheat sheet

What does line 2 print?

- `Ada guest`: correct. Destructuring creates a variable per named property. `role` is missing, so its default applies.
- `Ada undefined`: not correct. That would be right without `= "guest"`, which supplies a default.
- `undefined guest`: not correct. `name` exists on the object, so it receives `"Ada"`.
- It throws, because `role` is missing: not correct. A missing property never throws here; it is just `undefined`, which triggers the default.

Where to act: The first placeholder.

Next step: Put the three names inside braces on the left of `=`, and put the default directly after the name it belongs to.

const user = { id: 7, name: "Ada" }; const point = [3, 4]; ___ ___ console.log(name, id, city, x, y);

One statement uses braces on the left of the assignment with a default on city, and the other uses brackets. The output is Ada 7 Unknown 3 4.

Where to act: The `settings` line.

Next step: Spread two objects inside one pair of braces. The object spread last wins any shared key, so decide which goes last.

const base = { theme: "light", size: 14 }; const saved = { size: 18 }; const first = [1, 2]; const second = [3]; const settings = ___; const all = ___; const copy = ___; copy.push(9); console.log(settings, all, copy, first);

Spread both objects into new braces with the override last, spread both arrays into new brackets, and spread first into new brackets for the copy. Pushing to the copy leaves first as [1, 2].

Where to act: The two boxes after each button press.

Next step: Compare the `city` value in the original box with the one in the copy box, and note which copy method is selected.

With a spread copy, changing copy.name leaves original.name alone, but changing copy.address.city also changes original.address.city because both share one nested object. With structuredClone, the nested change does not reach the original.

What does line 5 print?

- `1 2`: correct. `b` is a new array, so the push does not affect `a`. But `b[0]` is the same object as `a[0]`, so changing `n` shows through.
- `1 1`: not correct. This treats the copy as deep. The item object is shared.
- `2 2`: not correct. This treats `b` as the same array. Spread made a new outer array, so the push stays on `b`.
- `2 1`: not correct. This has both parts backwards: the array is new and the item is shared.

```
const { a, b = 1 } = obj;
const [x, y] = list;
const copy = [...list];
const merged = { ...defaults, ...overrides };
const deep = structuredClone(obj);
```

## Sources

- MDN: Destructuring, retrieved 2026-11-04
- MDN: Spread syntax, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does line 2 print?

- `Ada guest`: correct. Destructuring creates a variable per named property. `role` is missing, so its default applies.
- `Ada undefined`: not correct. That would be right without `= "guest"`, which supplies a default.
- `undefined guest`: not correct. `name` exists on the object, so it receives `"Ada"`.
- It throws, because `role` is missing: not correct. A missing property never throws here; it is just `undefined`, which triggers the default.

### terminal

### Static alternative

One statement uses braces on the left of the assignment with a default on city, and the other uses brackets. The output is Ada 7 Unknown 3 4.

### terminal

### Static alternative

Spread both objects into new braces with the override last, spread both arrays into new brackets, and spread first into new brackets for the copy. Pushing to the copy leaves first as [1, 2].

### explore

### Static alternative

With a spread copy, changing copy.name leaves original.name alone, but changing copy.address.city also changes original.address.city because both share one nested object. With structuredClone, the nested change does not reach the original.

### mcq

### Static alternative

What does line 5 print?

- `1 2`: correct. `b` is a new array, so the push does not affect `a`. But `b[0]` is the same object as `a[0]`, so changing `n` shows through.
- `1 1`: not correct. This treats the copy as deep. The item object is shared.
- `2 2`: not correct. This treats `b` as the same array. Spread made a new outer array, so the push stays on `b`.
- `2 1`: not correct. This has both parts backwards: the array is new and the item is shared.
