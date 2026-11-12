# DOM, tooling and async lab: Trail Guides live dashboard

Standard track, S25 (a Concept day), in its 40-minute Faded then fresh coding-practice block. All six tasks are required; each has its exact contract in a `starter/app.js` comment. Authoring estimate, not a measured learner pilot: about 34 minutes for an average learner to read this README and finish all six tasks, with a 40-minute cap that leaves a buffer. Do the one-time Setup below before the block; it is not counted in those minutes. The cap is a planning allowance, not a timer. Fast Track skips this lab; Fast learners build the same dashboard behavior in the course project, and can use this lab as optional remediation.

## Goal

The static Trail Guides page becomes a live dashboard: the trail list is rendered from data, a search box filters it as you type, one delegated listener marks trails as hiked, untrusted visitor notes render safely as text, and trail conditions arrive asynchronously through promises and `async`/`await`. You write that behavior in `starter/app.js`.

This lab practises these topics: Selecting and changing the DOM; Events and event bubbling; Preventing cross-site scripting; Promises; Async and await. Read those topic pages first; each task names what it needs. The page uses plain script files, so you can open it straight from disk; project scaffolding with npm and Vite is practised in the S27 course project.

## What the tests check, and what they do not

- The tests open `starter/index.html` in the lab's own pinned headless Chromium and drive it like a visitor: they render, type in the search box, click links and wait for status messages.
- One of the committed visitor notes in `data.js` carries a real script-running payload. Task 4 passes only when that note appears as plain text, no element from it enters the page and its script never runs.
- Tasks 3, 5 and 6 also read `starter/app.js` as text, to confirm the taught shape: the click listener attached to the list itself, a `.then`/`.catch` chain, `Promise.all`, and an `async` function that `await`s. Comments and strings are ignored by those checks.
- The tests do not check styling, and they do not check `main`-less details such as variable names.

## Prerequisites

- Node.js 22.12 or later, with npm 10 or later (npm comes with Node.js). Check both in a terminal:

  ```sh
  node --version
  npm --version
  ```

  Expected: `v22.12.0` or higher, and `10.0.0` or higher.
- About 200 MB of free disk space for the test browser, and a network connection for the one-time setup.
- A text editor and a desktop browser (Chrome, Edge, Firefox or Safari) with its developer tools.
- No Docker or other container engine is used.

## Setup

1. Open a terminal in this folder, `coding-lab/`, the folder that holds this README.
2. Go into `starter/` and install the test browser once:

   ```sh
   cd starter
   npm ci
   cd ..
   ```

   `npm ci` installs the pinned test tool (Playwright 1.55.1) from `starter/package-lock.json` and downloads a headless Chromium into `starter/node_modules/`. Nothing is installed outside this lab folder.
3. Back in `coding-lab/`, run the tests once before you change anything:

   ```sh
   node --test --test-reporter=spec
   ```

   All six tests fail, and each message names the behavior that is still missing. This is the expected start.

## Tasks

Work only in `starter/app.js`; its comments repeat each task's exact contract, including the status messages. Every task is required to complete the lab. Everything else is the lab's fixed support and stays as shipped: `starter/data.js`, `starter/fake-api.js`, `starter/index.html`, `starter/styles.css`, the starter's package files, the tests in `tests/` and `expected/on-completion.txt`. A task counts as done only when the shipped tests for it pass exactly as shipped. After each task, rerun `node --test --test-reporter=spec` from `coding-lab/`. If you are stuck, open the hints one at a time; none of them gives the full code.

Open `starter/index.html` in your own browser alongside the tests. The starter page already shows the damage you will fix in Tasks 1 and 4: a broken image icon in Forest Path's note, put there by the payload in the untrusted visitor text.

### Task 1: render the trail list from data

- **Where:** `starter/app.js`, the `renderTrails` function.
- **Outcome:** `renderTrails(trails)` replaces the list's contents with one `<li>` per trail, in the exact shape shown in the starter comment, built with `document.createElement` and `textContent`. Rendering twice never duplicates items.
- **Done when:** `task 1: renderTrails rebuilds the list without duplicating items` passes.
- **Hint 1:** clear the list first; setting its `textContent` to an empty string removes every child. Topic page: Selecting and changing the DOM, step 3.
- **Hint 2:** build each part as an element, set its text with `textContent`, and `append` it to the item, then the item to the list. Leave the note's safety to Task 4, but building with `textContent` now completes both.

### Task 2: filter as the visitor types

- **Where:** `starter/app.js`, the Task 2 comment under `renderTrails`.
- **Outcome:** an `input` listener on the search box re-renders the list with only the trails whose name contains the typed text, ignoring case; an empty box shows all six.
- **Done when:** `task 2: the search box filters the list as you type` passes.
- **Hint 1:** `addEventListener("input", ...)` fires on every keystroke, unlike `"change"`. Topic page: Events and event bubbling, step 1.
- **Hint 2:** lower-case both the input value and each name, filter `window.trailData`, and reuse `renderTrails` from Task 1.

### Task 3: one delegated listener for every Mark hiked link

- **Where:** `starter/app.js`, the Task 3 comment.
- **Outcome:** one `click` listener on `trailList` handles every `.mark-hiked` link, toggling the `hiked` class on the clicked link's list item, and calls `preventDefault()` so the link never navigates. Links rendered later (after filtering) keep working without any new listener.
- **Done when:** `task 3: one delegated click listener marks trails hiked without navigating` passes.
- **Hint 1:** clicks on the links bubble up to the list; the listener learns which link was clicked from `event.target`. Topic page: Events and event bubbling, steps 2 and 3.
- **Hint 2:** `event.target.closest(".mark-hiked")` finds the link (or `null`: return then); from the link, `closest("li")` reaches the item to toggle.

### Task 4: visitor notes are text, not HTML

- **Where:** `starter/app.js`, inside `renderTrails`.
- **Outcome:** every note lands in the page as plain text. Forest Path's payload note displays exactly as typed, no `<img>` element enters the list, and `window.__xss` stays unset.
- **Done when:** `task 4: visitor notes render as text, never as HTML` passes.
- **Hint 1:** the starter builds items by concatenating strings into `innerHTML`: that is the risky sink that turns visitor text into live HTML. Topic page: Preventing cross-site scripting, steps 1 and 2.
- **Hint 2:** if you completed Task 1 with `createElement` and `textContent` for every part, including the note span, this already passes; the two tasks are separated so the tests can name the attack when only the duplicate-free rendering was fixed.

### Task 5: conditions through a promise chain

- **Where:** `starter/app.js`, the `showConditions` and `showAllConditions` functions.
- **Outcome:** `showConditions(name)` calls `window.trailApi.fetchConditions(name)` and chains `.then`/`.catch` to put the exact success or unavailable message into the status line. `showAllConditions(names)` runs all the requests together with `Promise.all` and reports the count, or the unavailable message when any request rejects. The exact message strings are in the starter comments.
- **Done when:** `task 5: showConditions chains then and catch, and showAllConditions uses Promise.all` passes.
- **Hint 1:** `fetchConditions` returns a promise: nothing useful happens until you chain on it. "Canyon Route" always rejects, so your `.catch` has a guaranteed case. Topic page: Promises, steps 2 and 3.
- **Hint 2:** map the names to promises, pass the array to `Promise.all`, and remember one rejection rejects the whole combined promise.

### Task 6: refresh with async and await

- **Where:** `starter/app.js`, the `refreshDashboard` function.
- **Outcome:** `refreshDashboard` is an `async` function that awaits the featured trail's conditions inside `try`/`catch` and shows the exact success or unavailable message from the starter comment. Because it is `async`, calling it always gives back a promise.
- **Done when:** `task 6: refreshDashboard is an async function that awaits and recovers` passes.
- **Hint 1:** this is the `.then`/`.catch` logic from Task 5 written as straight-line code: `await` unwraps the fulfilled value, `catch` receives the rejection. Topic page: Async and await, steps 1 and 2.
- **Hint 2:** the test replaces the fake API with one that rejects and calls your function: an unhandled rejection fails the test, so the `await` must sit inside the `try`.

## How to test

From `coding-lab/`, run the one test command:

```sh
node --test --test-reporter=spec
```

The command opens the test browser, so it takes a few seconds. While you work, failing tests show `✖` and a message naming the missing behavior.

Debugging tip, as practised in the DevTools topic: open `starter/index.html` in your own browser, open the developer tools, and set a breakpoint inside your `renderTrails` or the Task 3 listener. Stepping through a click while watching `event.target` shows delegation doing its work.

## Expected output

When you are finished, the output matches `expected/on-completion.txt`, apart from the timings, which differ on every run (shown there as `<ms>`):

```text
✔ task 1: renderTrails rebuilds the list without duplicating items (<ms>ms)
✔ task 2: the search box filters the list as you type (<ms>ms)
✔ task 3: one delegated click listener marks trails hiked without navigating (<ms>ms)
✔ task 4: visitor notes render as text, never as HTML (<ms>ms)
✔ task 5: showConditions chains then and catch, and showAllConditions uses Promise.all (<ms>ms)
✔ task 6: refreshDashboard is an async function that awaits and recovers (<ms>ms)
ℹ tests 6
ℹ pass 6
ℹ fail 0
```

## Offline note

Only setup needs the network, once, to download the pinned test tool and its browser. After that, the tests run fully offline: the page loads only its own local files, the conditions "API" is a local fake with fixed answers and delays, and the test browser blocks any request that leaves the page.

## Cleanup

Delete `starter/node_modules/` to remove the test tool and its browser; the tests create nothing else. To start your work again from scratch, copy `starter/app.js` back from a fresh copy of this lab.

## Troubleshooting

- `node: command not found`, or a version below 22.12: install Node.js 22.12 or later from nodejs.org, then open a new terminal.
- `The test browser is not installed yet`: run `npm ci` inside `starter/` (Setup, step 2), then run the tests again from `coding-lab/`.
- `npm ci` fails while downloading: check your network connection and run it again; it resumes from a clean install.
- No tests run, or `Could not find`: run the test command from the `coding-lab/` folder, the one that holds this README.
- Task 3 cannot find the link to click: the item shape from Task 1 must match the starter comment exactly, including the `mark-hiked` class and `data-name`.
- Task 5 or 6 times out: the status message must match the starter comment exactly, including the final full stop.
- The page in your own browser does nothing after an edit: reload it, and check the browser console for a syntax error in `app.js`.
