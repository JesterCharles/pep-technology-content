# Review scenarios: DOM, async and the browser client

## Objectives

- Choose the list code that keeps visitor text inert and handles clicks with one delegated listener, using event.target, event.currentTarget and closest correctly
- Predict the output order of an async function, a promise callback and a timer callback around plain code
- Choose the fetch handling that separates a success, a problem details error, another HTTP error and a network failure, and shows each its matching message

## Teaching

### Activity 1 of 3: Make the review list safe and clickable

These scenarios mix the course's second half. On the Book Swap site, readers review books they borrowed and like each other's reviews. Answer from memory; every option explains itself after you check.

Two bugs were reported. Clicking Like, on its word or on its heart icon, does nothing. And a review whose text is `<a href="#" onmouseover="stealData()">spoiler</a>` runs `stealData` for every reader who hovers over it.

```
// <ul id="reviews"></ul>
const list = document.querySelector("#reviews");

function addReview(review) {   // review.text was written by a visitor
  list.innerHTML += "<li data-id='" + review.id + "'><button class='like'><span class='icon'></span> Like</button> " + review.text + "</li>";
}

list.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    like(event.target.dataset.id);
  }
});
```

### Activity 2 of 3: Predict the log order while the shelf loads

The shelf loader mixes plain code, an `async` function, a promise callback and a timer. Commit to an order first.

```
async function loadShelf() {
  console.log("A");
  const books = await Promise.resolve(["Dune", "Emma"]);
  console.log("B");
  return books.length;
}

console.log("C");
setTimeout(() => console.log("D"), 0);
loadShelf().then((n) => console.log("E", n));
console.log("F");
```

Calling an `async` function runs its body at once, up to its first `await`, then returns a promise.

### Activity 3 of 3: Diagnose the review that saved nothing

Posting a review calls the Spring Boot API. In development, `VITE_API_URL` is `/api` and the Vite dev proxy forwards `/api` to Spring Boot, so the page and API share one origin and CORS never blocks a response here. A tester reports two problems with this code.

```
const API = import.meta.env.VITE_API_URL;

async function saveReview(review) {
  try {
    const res = await fetch(API + "/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    // the change goes here, before the body is read
    const saved = await res.json();
    addReview(saved);
    showMessage("Saved");
  } catch (err) {
    showMessage("Check your internet connection");
  }
}
```

1. An empty review gets 400 from the API's exception handler, typed `application/problem+json`, with `title` `Bad Request` and `detail` `Review text must not be blank`. Yet the page says Saved and adds an empty review.
2. During a backend outage, the Vite proxy cannot reach Spring Boot and answers 502 with an empty plain-text body, and the page tells people to check their internet connection, which works.

## Recap

- Insert untrusted data as text with `textContent`, or with `setAttribute` on a harmless attribute such as a `data-` attribute (never an event handler, `href` or `src`); `innerHTML` and `insertAdjacentHTML` parse it as HTML.
- In a delegated listener, `event.target` is where the click started and `event.currentTarget` is the element with the listener; `closest` walks up from the target to the item.
- Calling an `async` function runs it up to its first `await`; the rest waits as a microtask. Plain code finishes, then all microtasks, then the next task such as a timer.
- `fetch` rejects when no response can be read: a network failure, or a cross-origin response that CORS blocks. Otherwise it fulfills, even on 400 or 502, so check `res.ok` before reading the body, read problem details only when the type says so, and show `detail` for what to fix.

## Cheat sheet

Where to act: The listener's `if` line and the `innerHTML` line.

Next step: For the first bug, ask which element `event.target` is when someone clicks the word Like, and which when they click the heart icon. For the second, ask whether the review text is parsed as HTML or inserted as text.

Another hint Hint 2 of 2 for Activity 1

Where to act: How each option builds the item and how its listener finds the item.

Next step: For each option, ask whether the review text passes through anything that builds elements from a string. Then follow a click on the heart icon through each listener and see whether it still reaches the item's `data-id`.

Where to act: The line that calls `loadShelf()`.

Next step: Say which of its lines run during the call itself, before the caller reaches `console.log("F")`, and which wait.

Another hint Hint 2 of 2 for Activity 2

Where to act: The queues after the plain code ends.

Next step: Put each waiting piece in its queue: the rest of `loadShelf` after the `await` (it waits even when the promise is already fulfilled), the `then` callback, and the timer callback. Recall which queue is emptied completely before the next task runs.

Where to act: The line that reads the body with `res.json()`.

Next step: Decide what `fetch` does when the server answers 400 or 502: does it reject and jump to `catch`, or fulfill with a response? Then ask what `res.json()` does with a body that is not JSON.

Another hint Hint 2 of 2 for Activity 3

Where to act: The branch each option takes when `res.ok` is `false`.

Next step: Follow the 400 and the 502 through each option and see which message each one ends with. Then read the 400 body in the report: which member's value would tell the reviewer what to change?

```
el.textContent = untrusted;                   // inert text
const item = event.target.closest(selector);  // also works for clicks on child elements
// run order: plain code, then microtasks (then, await), then the next task (setTimeout)
// fetch: check res.ok before reading the body; a rejection means no readable response
```

Claims on this page were checked against these official sources, retrieved 2026-11-09.

- MDN: Event.target — the element the event was dispatched to, compared with currentTarget
- MDN: Event.currentTarget — the element whose listener is running
- MDN: Element.closest() — walks up from an element and returns the first match or null
- MDN: Element.innerHTML — parses its string as HTML; security considerations
- MDN: Element.insertAdjacentHTML() — parses its string as HTML
- MDN: Node.textContent — inserts text, not HTML
- MDN: async function — the body runs until the first await; the rest continues later
- MDN: Using microtasks — microtasks run before the next task
- WHATWG HTML: Web application APIs — event loops, tasks and microtask checkpoints
- MDN: Element.setAttribute() — security considerations for attributes that run script or load URLs
- Vite: server.proxy — the dev server forwards matching request paths to another server
- MDN: Using the Fetch API — fetch fulfills on HTTP error statuses and rejects on a network error or a CORS failure; checking response status
- MDN: Response.ok — true for statuses 200 to 299
- RFC 9457: Problem Details for HTTP APIs — application/problem+json and the title and detail members
- Spring Framework: Error Responses — ProblemDetail bodies from exception handlers
- Vite: Env Variables and Modes — VITE_-prefixed variables on import.meta.env

## Static interaction alternatives

### mcq

Question: Which change fixes both bugs?. Built safely in an option means: each item is created with createElement, its data-id is set with setAttribute and the review text with textContent. Option A: Built safely. Listener: if (event.target.matches("button.like")), call like(event.target.closest("li").dataset.id). - Not quite. A click on the word Like has the button as its target, so that works, but a click on the heart icon has the span as its target. matches is then false and nothing happens. closest walks up from wherever the click started. Option B: Keep building the string, but insert it with list.insertAdjacentHTML("beforeend", ...). Listener: const button = event.target.closest("button.like"); return if it is null; call like(button.closest("li").dataset.id). - Not quite. The Like bug is fixed, but insertAdjacentHTML parses its string as HTML just like innerHTML, so the link's onmouseover handler is still created and runs. Visitor text must go in as text. Option C: Built safely. Listener: call like(event.currentTarget.dataset.id). - Not quite. In a delegated listener, event.currentTarget is the element whose listener is running: the ul, which has no data-id. So every Like calls like(undefined). The item is found from event.target. Option D: Built safely. Listener: const button = event.target.closest("button.like"); return if it is null; call like(button.closest("li").dataset.id). - Correct. textContent keeps visitor text inert, so the link shows as plain text, and setAttribute on a data- attribute stores only a value. Wherever the click starts, on the word or the icon, closest walks up from event.target to the button, then to its item. One listener on the list also covers items added later. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: In what order do the lines appear?. Option A: C F A B E 2 D - Not quite. An async function is not postponed: the call runs its body at once up to the await, so A prints before the caller reaches F. Option B: C A F B E 2 D - Correct. C is plain code. Calling loadShelf prints A and pauses at await, so F is next. Then the microtasks: the rest of loadShelf prints B and fulfills its promise with 2, so the then callback prints E 2. The timer task prints D last. Option C: C A B F E 2 D - Not quite. await always pauses the function, even on a promise that is already fulfilled. The rest of the body is queued as a microtask, so F prints before B. Option D: C A F D B E 2 - Not quite. The await continuation and the then callback are microtasks, and all microtasks run before the next task. The timer callback is a task, so D prints last, even with a 0 ms delay. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: Which code fixes both reports?. Option A: if (!res.ok) { throw new Error("Request failed: " + res.status); } - Not quite. Checking res.ok first is right, but throwing sends the 400 and the 502 into the same catch as a network failure, so both blame the connection, although a response did arrive. Option B: const body = await res.json(); if (body.detail) { showMessage(body.detail); return; } - Not quite. It parses before checking the status, so the 502's empty plain-text body makes res.json() reject and the page still blames the connection. Worse, a successful save then reads the same body a second time, which a body cannot allow, so it lands in catch too. Option C: if (!res.ok) { const type = res.headers.get("content-type") || ""; if (type.includes("application/problem+json")) { const problem = await res.json(); showMessage(problem.detail); } else { showMessage("The server had a problem. Try again later."); } return; } - Correct. fetch fulfills on 400 and 502, so the status is checked before the body is read. A problem details body is parsed and its detail says what to fix. Any other error, such as the proxy's plain-text 502, gets a server message without parsing, and a network failure still reaches the connection message in catch. Option D: if (!res.ok) { const type = res.headers.get("content-type") || ""; if (type.includes("application/problem+json")) { const problem = await res.json(); showMessage(problem.title); } else { showMessage("The server had a problem. Try again later."); } return; } - Not quite. The branches match the reports, but title only names the kind of problem, so the person sees "Bad Request" and still does not know what to fix. detail explains this occurrence: the text must not be blank. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
