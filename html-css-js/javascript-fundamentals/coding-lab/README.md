# JavaScript fundamentals lab: Trail report utilities

Standard track, S23 Lab day: about 55 minutes. Fast Track skips this lab; Fast learners practise the same JavaScript in the course project, and can use this lab as optional remediation.

## Goal

The Trail Guides site needs a small JavaScript module that turns its raw trail records into report data: filtered lists, totals, formatted lines and a private view log. You write that module in `starter/report.mjs` and `starter/format.mjs`, working with the same trails that appear on the Trail Guides page from the HTML and CSS lab.

This lab practises these topics: let, const and ===; Functions as values, arrow functions and callbacks; Arrays and objects: map, filter, reduce; Destructuring and spread; Modules: import and export; Scope and closures. Read those topic pages first; each task names what it needs.

## What the tests check, and what they do not

- Every task is checked by behavior: the tests call your functions with their own trail data, including frozen objects that throw if your code mutates them.
- Tasks 1, 2 and 4 also read `starter/report.mjs` as text, to confirm the stated style: no `var`, no loose `==` or `!=`, an arrow function for `byDistance`, and `reduce` for the total. Comments and strings are ignored by those checks.
- The tests do not check code layout, variable names inside your functions, or anything in `main.mjs`.

## Prerequisites

- Node.js 22.12 or later. Check it in a terminal:

  ```sh
  node --version
  ```

  Expected: `v22.12.0` or higher.
- A text editor. No browser, no npm packages and no network are needed: setup only runs the starter once.
- No Docker or other container engine is used.

## Setup

1. Open a terminal in this folder, `coding-lab/`, the folder that holds this README.
2. Run the starter program once to see where you start:

   ```sh
   cd starter
   node main.mjs
   cd ..
   ```

   It prints `Trails loaded: 6`, a total of `0 km` and placeholder lines: the report functions are not written yet. Rerun it whenever you like; its output grows as tasks pass.
3. Back in `coding-lab/`, run the tests once before you change anything:

   ```sh
   node --test --test-reporter=spec
   ```

   All seven tests fail, and each message names what is still missing. This is the expected start.

## Tasks

Work only in `starter/report.mjs` and `starter/format.mjs`. Each task's comment in the starter marks where it happens. After each task, rerun `node --test --test-reporter=spec` from `coding-lab/`: that task's test changes from `✖` to `✔`. If you are stuck, open the hints one at a time; none of them gives the full code.

### Task 1: strict comparisons, const and let

- **Where:** `starter/report.mjs`, the `hasDifficulty` function.
- **Outcome:** `hasDifficulty(trail, level)` is true only when the trail's difficulty is exactly `level`, and the function declares its variable with `const` rather than `var` (nothing here is reassigned, so `const` is the default choice). A trail whose difficulty is the empty string must not match the number `0`.
- **Done when:** `task 1: hasDifficulty matches only the exact difficulty, with const and ===` passes.
- **Hint 1:** the loose `==` converts values of different types before comparing, so `"" == 0` is true. Topic page: let, const and ===, step 3.
- **Hint 2:** replace `var` with the declaration for a value that is never reassigned, and `==` with the comparison that never converts types.

### Task 2: a sort callback as an arrow function

- **Where:** `starter/report.mjs`, the `byDistance` variable and the `sortTrails` function.
- **Outcome:** `byDistance` holds an arrow function that compares two trails by `distanceKm`, and `sortTrails(trails, compare)` returns a new array sorted with the given callback, leaving the input array in its original order.
- **Done when:** `task 2: byDistance is an arrow-function callback and sortTrails returns a new sorted array` passes.
- **Hint 1:** a compare callback takes two items and returns a number: negative when the first sorts earlier. Topic page: Functions as values, step 2.
- **Hint 2:** `sort` changes the array it is called on, so sort a copy. One spread expression makes that copy. Topic page: Destructuring and spread, step 2.

### Task 3: filter and map without mutation

- **Where:** `starter/report.mjs`, the `easyTrailNames` function.
- **Outcome:** `easyTrailNames(trails)` returns the names of the trails whose difficulty is exactly `"easy"`, in their original order, without changing the input. An empty list gives an empty result.
- **Done when:** `task 3: easyTrailNames keeps only easy trails and never mutates the input` passes.
- **Hint 1:** chain two array methods: one keeps matching trails, one turns each trail into its name. Topic page: Arrays and objects, steps 2 and 3.
- **Hint 2:** reuse `hasDifficulty` from Task 1 inside the filter callback.

### Task 4: a total with reduce

- **Where:** `starter/report.mjs`, the `totalDistance` function.
- **Outcome:** `totalDistance(trails)` adds `distanceKm` across all trails with `reduce`, and an empty list totals `0`.
- **Done when:** `task 4: totalDistance uses reduce with an explicit initial value` passes.
- **Hint 1:** `reduce` takes a callback and a second argument: the starting value. Topic page: Arrays and objects, step 4.
- **Hint 2:** without that second argument, reducing an empty array throws. Pass `0`.

### Task 5: destructuring defaults and spread copies

- **Where:** `starter/report.mjs`, the `describeTrail` and `withTag` functions.
- **Outcome:** `describeTrail(trail)` returns `"NAME: DISTANCE km (DIFFICULTY)"`, reading its three values with object destructuring and falling back to `"unknown"` when the difficulty is missing. `withTag(trail, tag)` returns a new trail object whose copied `tags` array ends with the new tag; the input object and its array never change.
- **Done when:** `task 5: describeTrail destructures with a default and withTag copies instead of mutating` passes.
- **Hint 1:** a destructuring pattern can give one name a default: it applies only when the property is missing or undefined. Topic page: Destructuring and spread, step 1.
- **Hint 2:** `withTag` needs two spreads: one copies the object's properties, one copies the tags into a new array with the tag added at the end. The tests pass frozen objects, so any mutation throws.

### Task 6: named and default exports

- **Where:** `starter/format.mjs` (6a), then `starter/report.mjs` (6b).
- **Outcome:** `format.mjs` exports `formatKm` as a named export and `formatTrailLine` as the default export. `report.mjs` imports both with the matching syntax and uses `formatTrailLine` so `trailLines(trails)` returns one formatted line per trail.
- **Done when:** `task 6: format.mjs exports formatKm (named) and formatTrailLine (default), used by trailLines` passes.
- **Hint 1:** a module has many named exports but at most one default; the import syntax differs for each. Topic page: Modules, steps 1 and 2.
- **Hint 2:** do 6a first. If Node reports an import error afterwards, the import form does not match the export form: braces import named exports, a bare name imports the default.

### Task 7: a closure with private state

- **Where:** `starter/report.mjs`, the `makeTrailLog` function.
- **Outcome:** `makeTrailLog()` returns a function. Each call to that function records one trail name and returns how many names this log has seen. Two logs count independently, and the recorded names are not reachable from outside the returned function.
- **Done when:** `task 7: makeTrailLog returns a closure with its own private count` passes.
- **Hint 1:** declare the record inside `makeTrailLog`, before the returned function; the returned function keeps it alive between calls. Topic page: Scope and closures, step 2.
- **Hint 2:** do not store the record in a module-level variable: then every log would share it, and the test for independent counts fails.

## How to test

From `coding-lab/`, run the one test command:

```sh
node --test --test-reporter=spec
```

While you work, failing tests show `✖` and a message naming what is missing. When every task is done, all seven show `✔`. You can also rerun `node main.mjs` inside `starter/` to see the finished report.

## Expected output

When you are finished, the output matches `expected/on-completion.txt`, apart from the timings, which differ on every run (shown there as `<ms>`):

```text
✔ task 1: hasDifficulty matches only the exact difficulty, with const and === (<ms>ms)
✔ task 2: byDistance is an arrow-function callback and sortTrails returns a new sorted array (<ms>ms)
✔ task 3: easyTrailNames keeps only easy trails and never mutates the input (<ms>ms)
✔ task 4: totalDistance uses reduce with an explicit initial value (<ms>ms)
✔ task 5: describeTrail destructures with a default and withTag copies instead of mutating (<ms>ms)
✔ task 6: format.mjs exports formatKm (named) and formatTrailLine (default), used by trailLines (<ms>ms)
✔ task 7: makeTrailLog returns a closure with its own private count (<ms>ms)
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

## Offline note

Nothing in this lab uses the network: there are no npm packages, no browser and no downloads. Setup only runs the starter program once with Node.js.

## Cleanup

The lab creates no files, folders or databases: there is nothing to delete. To start your work again from scratch, copy `starter/report.mjs` and `starter/format.mjs` back from a fresh copy of this lab.

## Troubleshooting

- `node: command not found`, or a version below 22.12: install Node.js 22.12 or later from nodejs.org, then open a new terminal.
- No tests run, or `Could not find`: run the test command from the `coding-lab/` folder, the one that holds this README.
- `SyntaxError` naming an import or export after Task 6: the import form in `report.mjs` does not match the export form in `format.mjs`; reread Task 6's second hint.
- A mutation error such as `Cannot add property` or `Cannot assign to read only property`: your code changes an input object or array; Tasks 2, 3 and 5 require copies instead.
- A test still fails after your change: read its message; it names the exact behavior that is missing, and the task's hints point at the topic page step that teaches it.
