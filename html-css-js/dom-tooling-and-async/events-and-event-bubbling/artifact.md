# Events and event bubbling

## Objectives

- Attach event listeners with addEventListener
- Trace an event's bubbling path and distinguish event.target from event.currentTarget
- Use event delegation and preventDefault in a list or form handler

## Teaching

A button sits inside a `div`, and both have click listeners. Predict what you will see when the button is clicked.

```
box.addEventListener("click", () => console.log("box"));
button.addEventListener("click", () => console.log("button"));
// <div id="box"><button>Save</button></div>
```

After firing on the clicked element, most events bubble up through each ancestor, running any listeners there.

Inside a listener, `event.target` is the element where the event started. `event.currentTarget` is the element whose listener is running now. `target` stays the same as the event rises, while `currentTarget` changes.

`event.stopPropagation()` stops the rise. Use it rarely, because other code may be listening higher up.

`addEventListener(type, handler)` registers a function to run on each event of that type. Pass the function; do not call it. The browser calls it with an event object.

```
button.addEventListener("click", (event) => {
  console.log(event.type);
});
```

You can add several listeners to one element, and they all run. Registering it is not the same as running it, so nothing happens until the event occurs.

Bubbling allows event delegation: put one listener on a parent and inspect `event.target`. It also covers items added later.

```
menu.addEventListener("click", (event) => {
  const link = event.target.closest("a.open");
  if (!link) return;
  event.preventDefault();
  showPanel(link.dataset.panel);
});
```

`preventDefault()` cancels the browser's default action, such as following a link. It does not stop bubbling. This example opens a panel; your task does something different.

Each list item now has an icon inside it. Clicks on the text work, but clicks on the icon do nothing.

```
// <li data-id="4"><span class="icon"></span> Tea</li>
list.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    select(event.target.dataset.id);
  }
});
```

## Recap

`addEventListener` registers a function to run on each event. Events bubble from the target up through ancestors: `target` is where it started, and `currentTarget` is whose listener is running. Delegation puts one listener on a parent, and `preventDefault` cancels the browser's default action without stopping the rise.

## Cheat sheet

What does one click on the button log?

- `button` then `box`: correct. The event runs on the element that was clicked, then bubbles up through its ancestors. Registration order between different elements does not matter.
- `box` then `button`: not correct. That follows registration order, but with ordinary bubble-phase listeners, the button's listeners run before the event bubbles up to box.
- Only `button`: not correct. Click events bubble, so the parent is told too.
- Only `box`: not correct. With ordinary bubble-phase listeners, the clicked element's listeners run before its ancestors' listeners.

Where to act: The checkbox under the boxes.

Next step: After ticking it, click a button and count how many listeners ran compared with before.

Clicking button#inner runs the listeners on the button, then the div, then the section. target stays button#inner, and currentTarget changes at each step. With stopPropagation in the div, the section listener does not run.

Where to act: The second argument of `addEventListener`.

Next step: Pass an arrow function with one parameter, which receives the event. The two changes go inside its body.

const save = document.querySelector("#save"); const msg = document.querySelector("#msg"); // Attach your listener here.

Call addEventListener on the button with the type click and an arrow function taking the event. Set the message text inside it and log the id of the event target. A click logs save.

Where to act: The first line inside your listener.

Next step: Return early when the target is not the remove link, so clicks elsewhere in the list do nothing.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The line that removes the item.

Next step: The link is inside the `li`. Walk upward from the target to the nearest `li`, then remove that.

const list = document.querySelector("#todos"); // Attach one listener to the list here.

Attach one click listener to the list, return early unless the target matches the remove link, call preventDefault, then remove the closest list item. Items added later work without another listener.

What is the best fix?

- Use `event.target.closest("li")`, and handle the case where it returns null: correct. When the icon is clicked, `target` is the span, so `matches("li")` is false. `closest` walks up to the item, whatever was clicked inside it.
- Use `event.currentTarget.matches("li")`: not correct. `currentTarget` is the list, because that is where the listener is. It would never match.
- Call `event.stopPropagation()` in the icon: not correct. That stops the event from reaching the list, which makes the problem worse.
- Call `event.preventDefault()` first: not correct. That cancels a default action. It does not change which element was the target.

```
parent.addEventListener("click", (event) => {
  const row = event.target.closest("li");
  if (!row) return;
  event.preventDefault();
});
```

## Sources

- MDN: Event bubbling, retrieved 2026-11-04
- MDN: EventTarget.addEventListener, retrieved 2026-11-04
- WHATWG DOM standard, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does one click on the button log?

- `button` then `box`: correct. The event runs on the element that was clicked, then bubbles up through its ancestors. Registration order between different elements does not matter.
- `box` then `button`: not correct. That follows registration order, but with ordinary bubble-phase listeners, the button's listeners run before the event bubbles up to box.
- Only `button`: not correct. Click events bubble, so the parent is told too.
- Only `box`: not correct. With ordinary bubble-phase listeners, the clicked element's listeners run before its ancestors' listeners.

### explore

### Static alternative

Clicking button#inner runs the listeners on the button, then the div, then the section. target stays button#inner, and currentTarget changes at each step. With stopPropagation in the div, the section listener does not run.

### terminal

### Static alternative

Call addEventListener on the button with the type click and an arrow function taking the event. Set the message text inside it and log the id of the event target. A click logs save.

### terminal

### Static alternative

Attach one click listener to the list, return early unless the target matches the remove link, call preventDefault, then remove the closest list item. Items added later work without another listener.

### mcq

### Static alternative

What is the best fix?

- Use `event.target.closest("li")`, and handle the case where it returns null: correct. When the icon is clicked, `target` is the span, so `matches("li")` is false. `closest` walks up to the item, whatever was clicked inside it.
- Use `event.currentTarget.matches("li")`: not correct. `currentTarget` is the list, because that is where the listener is. It would never match.
- Call `event.stopPropagation()` in the icon: not correct. That stops the event from reaching the list, which makes the problem worse.
- Call `event.preventDefault()` first: not correct. That cancels a default action. It does not change which element was the target.
