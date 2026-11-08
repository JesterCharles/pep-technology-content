# Selecting and changing the DOM

## Objectives

- Select elements with querySelector and querySelectorAll
- Change text, attributes and classes, and add or remove elements
- Predict the page the DOM shows after a sequence of changes

## Teaching

The page has three `li` elements. Predict the result of this code before reading any explanation.

```
const items = document.querySelectorAll("li");
items.textContent = "Done";
```

The DOM is the live object tree the browser builds from HTML. CSS selectors find nodes in it.

```
const one = document.querySelector("#total"); // first match or null
const all = document.querySelectorAll(".row"); // NodeList
all.forEach((el) => console.log(el.textContent));
```

`querySelector` returns the first match, or `null` when nothing matches. `querySelectorAll` returns a list, empty if nothing matches. Set `textContent` to change an element's text.

Elements have an API for each kind of change.

```
banner.setAttribute("title", "Sale");
banner.classList.add("open");
banner.classList.remove("closed");
const row = document.createElement("p");
row.textContent = "Bread";
panel.append(row);
oldNode.remove();
```

Prefer `classList` to rewriting `className`, because it leaves other classes alone. A new element appears on the page only once you attach it.

Each DOM change works on the page as it is at that moment, so order matters. `querySelector` returns the first match at the time of the call, and new nodes join the tree exactly where you put them.

`prepend` adds at the start and `append` at the end. `lastElementChild` reads whatever is last right now.

Your page throws this error as soon as it loads, and the element really is in the HTML with the id `total`.

```
document.querySelector("#totl").textContent = "5";
// TypeError: Cannot set properties of null (setting 'textContent')
```

## Recap

`querySelector` returns the first match or `null`, and `querySelectorAll` returns a list you must loop over. Change text with `textContent`, attributes with `setAttribute`, and classes with `classList`. Create with `createElement`, attach with `append` or `prepend`, and remove with `remove`. Changes apply in order to the page as it stands.

## Cheat sheet

What does the page show afterwards?

- No visible change: the list object gets a stray property, but no element changes: correct. `querySelectorAll` returns a NodeList, not an element. Setting `textContent` on the list changes no element, and no error is raised.
- All three items now read "Done": not correct. That would need a loop over the list, setting each element in turn.
- Only the first item changes: not correct. That is how it would work with `querySelector`, which returns one element.
- A TypeError is thrown: not correct. JavaScript lets you add a property to the list object, so it fails silently.

Where to act: The two selector strings.

Next step: In a selector, an id starts with one symbol and a class starts with another. They are the same symbols you use in CSS.

const title = ___; // Set the heading's text here. const items = ___; console.log(items.length);

Select the heading with an id selector and set its textContent. Select the items with a class selector using the method that returns a list, and log its length, which is 3.

Where to act: The new list item.

Next step: After creating it and setting its text, it still is not on the page. Find the list and attach the item to it.

const link = document.querySelector("#docs"); const list = document.querySelector("#groceries"); const note = document.querySelector("#note"); // Make your four changes below.

Use setAttribute for the href, classList.add for the class, createElement then append for the list item, and remove for the note. The list then reads Tea, Milk, and the note has gone.

Where to act: Line 2 of the code in the model.

Next step: Ask which element this call returns, then carry that change through the later lines one at a time.

The list starts as Milk, Eggs, Bread. Line 2 changes the first item to Tea. Lines 3 and 4 add Jam at the start. Line 5 removes Bread, the last item. The final list is Jam, Tea, Eggs.

What does the error tell you?

- The selector matched nothing, so `querySelector` returned `null`. The selector has a typo: correct. `#totl` does not match `total`. `querySelector` returns `null` for no match, and setting a property on `null` throws.
- `textContent` cannot be set to a string containing a number: not correct. `"5"` is a string, and any string is fine.
- The element exists but is read-only: not correct. The error mentions `null`, so no element was found at all.
- It needs `querySelectorAll`: not correct. That returns a list, which would hide the mistake rather than fix it.

```
document.querySelector("#id");
document.querySelectorAll(".cls").forEach((el) => {});
el.textContent = "text";
el.setAttribute("href", "#x");
el.classList.add("on"); el.classList.remove("on");
const n = document.createElement("li"); list.append(n);
n.remove();
```

## Sources

- MDN: Document.querySelector, retrieved 2026-11-04
- MDN: Node.textContent, retrieved 2026-11-04
- WHATWG DOM standard, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does the page show afterwards?

- No visible change: the list object gets a stray property, but no element changes: correct. `querySelectorAll` returns a NodeList, not an element. Setting `textContent` on the list changes no element, and no error is raised.
- All three items now read "Done": not correct. That would need a loop over the list, setting each element in turn.
- Only the first item changes: not correct. That is how it would work with `querySelector`, which returns one element.
- A TypeError is thrown: not correct. JavaScript lets you add a property to the list object, so it fails silently.

### terminal

### Static alternative

Select the heading with an id selector and set its textContent. Select the items with a class selector using the method that returns a list, and log its length, which is 3.

### terminal

### Static alternative

Use setAttribute for the href, classList.add for the class, createElement then append for the list item, and remove for the note. The list then reads Tea, Milk, and the note has gone.

### explore

### Static alternative

The list starts as Milk, Eggs, Bread. Line 2 changes the first item to Tea. Lines 3 and 4 add Jam at the start. Line 5 removes Bread, the last item. The final list is Jam, Tea, Eggs.

### mcq

### Static alternative

What does the error tell you?

- The selector matched nothing, so `querySelector` returned `null`. The selector has a typo: correct. `#totl` does not match `total`. `querySelector` returns `null` for no match, and setting a property on `null` throws.
- `textContent` cannot be set to a string containing a number: not correct. `"5"` is a string, and any string is fine.
- The element exists but is read-only: not correct. The error mentions `null`, so no element was found at all.
- It needs `querySelectorAll`: not correct. That returns a list, which would hide the mistake rather than fix it.
