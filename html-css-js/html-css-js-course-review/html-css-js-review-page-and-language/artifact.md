# Review scenarios: markup, layout and JavaScript values

## Objectives

- Choose the labels, input types and native control that make a sign-up form's fields named, checkable by the browser and operable by keyboard
- Calculate a card's rendered width under content-box sizing inside a mobile-first grid, and choose the change that removes sideways scrolling
- Predict the output of code that copies an array of objects with map and object spread, totals it with reduce from an initial value, and compares the total with == and ===

## Teaching

### Activity 1 of 3: Repair the Book Swap sign-up form

This page wraps up the first half of the course with new scenarios that mix its topics, all on Book Swap, a small site where neighbours lend each other books. Answer from memory first; every option explains itself after you check.

A teammate built this sign-up page. It works with a mouse, but its structure, its form and its Join control have problems.

```
<div class="top">
  <div class="logo">Book Swap</div>
</div>
<div class="content">
  <h1>Join Book Swap</h1>
  <h3>Your details</h3>
  <form id="join">
    <input id="email" type="text" placeholder="Email">
    <input id="age" type="text" placeholder="Age (16 to 120)">
    <div class="join" onclick="join()">Join</div>
  </form>
</div>
```

Note: inside a `form`, a `<button>` submits the form when pressed, and submission is when the browser runs its checks.

### Activity 2 of 3: Fix the book grid on a phone

Book Swap lists its books as cards. On a 390 px phone the list scrolls sideways. In DevTools the grid's single column measures 358 px. Here is the stylesheet:

```
.books { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 768px) {
  .books { grid-template-columns: repeat(3, 1fr); }
}
.card { width: 100%; padding: 16px; border: 3px solid; }
```

One reminder: `width: 100%` means the full width of the space the card sits in, here its grid column, and the card's `box-sizing` decides what that width covers.

### Activity 3 of 3: Predict the shelf report

A teammate backs up the shelf by copying each book with `map` and object spread, then edits the backup to try a change. Trace this Node.js script and commit to the two lines it prints.

```
const shelf = [
  { title: "Dune", copies: 2, tags: ["sci-fi"] },
  { title: "Emma", copies: 0, tags: [] }
];
const backup = shelf.map((book) => ({ ...book }));
backup[0].copies = 5;
backup[0].tags.push("classic");

const total = shelf.reduce((sum, book) => sum + book.copies, 0);
console.log(total, shelf[0].tags.length);
console.log(total == "2", total === "2");
```

## Recap

- Reach for native HTML first: semantic regions, a heading outline without skipped levels, a visible `label` for every field, input types and rules the browser can check, and a real `<button>` that submits the form. The server still checks every rule again.
- Under the default `content-box`, padding and border are added to the width; `box-sizing: border-box` keeps the whole box at the width you set. Fix overflow at its cause instead of hiding it.
- Mobile-first CSS writes the narrow layout as the base and adds columns with `min-width` queries.
- Spread copies one level deep: copying each object with `map` and spread separates their own properties, but nested arrays and objects stay shared. Give `reduce` its initial value, and compare with `===` by default.

## Cheat sheet

Where to act: The two fields and the Join control in the markup.

Next step: For each, say what names it once someone has typed, what the browser can check about its value, and whether it can be reached with Tab.

Another hint Hint 2 of 2 for Activity 1

Where to act: One field and one control in each option.

Next step: Pick the age field and ask which input types its range rules work on. Then pick the Join control and ask what Enter and Space do when it has focus.

Where to act: The `.card` rule and the 358 px column.

Next step: Check which `box-sizing` the card uses when none is set, then decide whether the 358 px holds the content only or the whole box.

Another hint Hint 2 of 2 for Activity 2

Where to act: The padding and border values on `.card`.

Next step: Under the default model, add the left and right padding and the left and right border to the content width. Then ask which change makes the whole box, not just the content, equal to the column.

Where to act: The line that builds `backup` and the two lines that change it.

Next step: Decide whether `backup[0]` is the same object as `shelf[0]` once `map` returns a spread copy of each book. Then decide whether the `tags` array inside that copy is a new array or the same one.

Another hint Hint 2 of 2 for Activity 3

Where to act: The `reduce` call and the second `console.log`.

Next step: Add up the copies of the books `shelf` holds now, starting from 0. Then compare that number with the string `"2"` once with type conversion and once without.

```
<label for="field-id">Visible name</label>
<input id="field-id" type="number" min="1" max="9" required>
<!-- min and max work on number and date types, not on text -->

/* content-box: rendered width = width + padding + border, both sides */
/* border-box: width already includes padding and border */
@media (min-width: 768px) { /* rules for wider screens */ }

const copies = list.map((item) => ({ ...item }));  // copies one level deep
const sum = list.reduce((acc, item) => acc + item.n, 0);
// == converts types first; === never does
```

Claims on this page were checked against these official sources, retrieved 2026-11-09.

- WHATWG HTML: Sections — header, main, the heading elements and the document outline
- MDN: the label element — associating a label with a control through for and id
- MDN: placeholder attribute — a placeholder is not a replacement for a label
- MDN: Constraint validation — required, type, min and max, and validation when a form is submitted
- MDN: min attribute — the input types min applies to
- MDN: the button element — a button in a form submits it by default; keyboard activation
- MDN: ARIA button role — the role adds no keyboard behavior; prefer the native button
- MDN: box-sizing — content-box adds padding and border to width; border-box includes them
- MDN: Using media queries — min-width media features
- MDN: Spread syntax — spread in object literals copies own properties one level deep
- MDN: Array.prototype.map() — map returns a new array of the callback's results
- MDN: Array.prototype.reduce() — the initial value argument
- MDN: Equality comparisons and sameness — == converts types; === does not

## Static interaction alternatives

### mcq

Question: Which set of changes fixes every problem?. Option A: The placeholders stay as the field names; email type="email" required; age type="number" min="16" max="120" required; Join becomes a <button>. - Not quite. The rules and the button are right, but a placeholder is not a label: it disappears as soon as someone types, and a screen reader may announce only "edit text". Each field needs a visible label linked to it. Option B: A visible label per field, its for matching the field's id; email type="email" required; age type="number" min="16" max="120" required; Join becomes a <button>. - Correct. Each field has a name that stays visible, and the browser can check an empty, malformed or out-of-range value. The native button is in the Tab order, works with Enter and Space, and submits the form, which is when those checks run. The server must still check every rule again. Option C: A visible label per field, its for matching the field's id; email type="email" required; age type="number" min="16" max="120" required; the Join div gets role="button" and tabindex="0". - Not quite. The role changes only what assistive technology is told, and tabindex only makes the div focusable. Enter and Space still do nothing, and a div never submits the form, so the browser checks never run. A native <button> gives all of this at once. Option D: A visible label per field, its for matching the field's id; email type="email" required; age stays type="text" with min="16" max="120" required; Join becomes a <button>. - Not quite. min and max apply to number and date fields and do nothing on a text field, so "abc" or 7 would pass the browser check. The age field needs type="number". Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: How wide is each card on the phone, and which change fixes the sideways scrolling?. Option A: 358 px. Add overflow-x: hidden to body. - Not quite. The card is wider than its column, because padding and border are added to the 358 px, and hiding the scrollbar only cuts the overflowing part off. Fix the size that causes the overflow instead. Option B: 390 px. Add box-sizing: border-box to .card. - Not quite. The fix is right, but the width forgets the border. Under the default content-box, padding and border both apply on the left and the right: 358 + 16 + 16 + 3 + 3 = 396 px. Option C: 396 px. Add box-sizing: border-box to .card. - Correct. Under the default content-box, 100% sizes only the content: 358 + 16 + 16 of padding + 3 + 3 of border = 396 px, 38 px wider than the column. With border-box, the 358 px includes padding and border, and the content shrinks to fit. Option D: 396 px. Change the media query to max-width: 768px. - Not quite. The width is right, but max-width: 768px matches every screen up to 768 px, this 390 px phone included, so the phone gets three narrow columns instead of one. Each card is still 38 px wider than its column under content-box, so the page still scrolls. Mobile-first CSS keeps the narrow layout as the base and adds min-width queries. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: What does the script print?. Option A: 2 2 true false - Correct. map returns a new object for each book, so setting backup[0].copies leaves shelf[0] at 2, and reduce from 0 gives 2 + 0 = 2. Spread copies only one level deep: the tags array is shared, so the push shows in shelf too, making its length 2. 2 == "2" converts and is true; 2 === "2" is false. Option B: 5 2 false false - Not quite. That would be true if backup held the same objects, as a plain array spread does. Here map builds a new object for each book, so shelf[0].copies stays 2. Only the nested tags array is shared. Option C: 2 1 true false - Not quite. The copies are separate, but object spread is shallow: the copy's tags points to the same array as the original's, so the push changes the array shelf sees too. Option D: 2 2 false false - Not quite. The first line is right, but == converts the string "2" to the number 2 before comparing, so it gives true. Only === refuses to compare across types. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
