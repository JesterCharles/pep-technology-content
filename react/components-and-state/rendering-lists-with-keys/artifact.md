# Rendering lists with keys

## Objectives

- Render an array of data as a list of JSX elements with map, and show a subset with filter
- Choose a stable, unique key from the data and explain why an array index or a random key can attach state to the wrong item after reordering

## Teaching

Almost every app renders lists, and each row can hold its own state. Predict this case before any teaching.

To render a list, transform your data into JSX with `map`. Use `filter` first to show a subset. Each element from `map` needs a `key` from the data.

```
const open = tasks.filter(t => !t.done);
return <ul>{open.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
```

Parentheses return JSX directly from an arrow function. With curly braces, you must write `return`.

A key tells React which item is which between renders. State belongs to the key, not to the position.

Choose a key that is stable and unique, usually an id from your data. An array index changes meaning when items are reordered or removed, so state attaches to the wrong item. A random key changes on every render, so React recreates the row and loses its state.

Two rules decide a key: unique among siblings, and stable across renders. If your data has no id, create one when the item is created, and store it with the item, not during render.

## Recap

`map` turns data into JSX and `filter` selects a subset first. Give each mapped element a `key` that is unique among siblings and stable across renders, normally an id from the data. State follows the key: an array index ties state to a position, so it lands on the wrong item after a reorder, and a random key throws state away on every render.

## Cheat sheet

Static version: a list uses index keys, and each row has an input. A note is typed in row 0, then row 0's data is removed. Decide which row keeps the note. Compare with Activity 3.

Where to act: Inside the `ul` in the return.

Next step: You need two steps on the array, one to narrow it and one to turn each lesson into JSX. The teaching example has the same shape.

Without JavaScript the editor cannot run. Data: three lessons with id, title and done, where only JSX is done. On paper, write the ul so it shows only the unfinished lessons with a key from the data. Compare with the tasks example.

Where to act: The Key strategy list and the note fields.

Next step: Watch which name your note ends up beside after each reverse. Try each strategy and ask which value truly belongs to the fruit itself.

Without JavaScript the lab cannot run. On paper, trace a note typed beside Apples through a reverse of Apples, Bananas, Cherries with index keys, id keys and random keys. Say which fruit the note ends up beside, or whether it is lost.

Static version: items are { sku, name, qty } with a unique sku, and the list reorders. Compare sku, index, a random number and qty as keys, then choose using the two rules.

```
const open = tasks.filter(t => !t.done);
<ul>
  {open.map(t => <li key={t.id}>{t.title}</li>)}
</ul>
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/rendering-lists: Rendering data from arrays; Filtering arrays of items; Keeping list items in order with key

## Static interaction alternatives

### predict

Static version: a list uses index keys, and each row has an input. A note is typed in row 0, then row 0's data is removed. Decide which row keeps the note. Compare with Activity 3.

### terminal

Without JavaScript the editor cannot run. Data: three lessons with id, title and done, where only JSX is done. On paper, write the ul so it shows only the unfinished lessons with a key from the data. Compare with the tasks example.

### explore

Without JavaScript the lab cannot run. On paper, trace a note typed beside Apples through a reverse of Apples, Bananas, Cherries with index keys, id keys and random keys. Say which fruit the note ends up beside, or whether it is lost.

### mcq

Static version: items are { sku, name, qty } with a unique sku, and the list reorders. Compare sku, index, a random number and qty as keys, then choose using the two rules.
