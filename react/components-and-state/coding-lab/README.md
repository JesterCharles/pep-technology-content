# Beacon dashboard, part 1: components and state

Your team runs Beacon, the internal dashboard that shows whether the company's
services are healthy. A previous intern left it half-built: the data is there,
the styling is there, but components are missing, buttons do nothing and two
state bugs make the screen lie. You will finish it with everything this module
taught: JSX, props, conditional display, `useState`, immutable updates and
list keys.

This is part 1 of a four-part scenario. Each part is a separate, independently
resettable lab on the same dashboard.

## Prerequisites

- Node.js 22.12+ (22.x LTS) or 24+, and npm 10 or newer. Check with:

  ```
  node --version
  npm --version
  ```

## Setup (one-time, needs the network once)

From this lab folder:

```
cd tests
npm ci
```

That installs the pinned test toolchain (Vitest, Testing Library, React) into
`tests/node_modules`. After it finishes, the test command runs fully offline.

Optional, if you also want to see the dashboard in a browser while you work,
open a second terminal in this lab folder (`cd ..` first if you are still in
`tests`) and run:

```
cd starter
npm ci
npm run dev
```

`npm run dev` keeps running and serves the app for development; stop it with
Ctrl+C. `npm run build` would produce the optimised production files in
`dist/` instead.

## How to test

From the `tests` folder:

```
npm test
```

All 8 tests fail on the shipped starter. Work through the tasks in order and
re-run the command after each one; when you are done, the output matches
`expected/on-completion.txt` (timings and file order vary). One coupling to
know: tests 4, 5, 7 and 8 render the whole App, so they show their own failure
only once task 2 (Panel children) is done.

## Files you edit

Every change happens at a `TASK n` comment in these files:

- `starter/src/components/DashboardHeader.jsx` - task 1
- `starter/src/components/Panel.jsx` - task 2
- `starter/src/components/ServiceCard.jsx` - tasks 2, 3 and 4
- `starter/src/components/StatusBadge.jsx` - task 3
- `starter/src/App.jsx` - tasks 5 to 8

Everything else is support and stays as shipped - `tests/`, `expected/` and
every starter file not listed. The tests pass by implementing the tasks, not
by changing the tests.

## The tasks

Every task is marked with a `TASK n` comment in the starter source. Read the
comment at the marked spot for the details; the summary below tells you where
to look.

1. **Rebuild the masthead as JSX** - `src/components/DashboardHeader.jsx`.
   Convert the old HTML masthead in the comment into JSX returned by the
   component, with the service count computed from the `serviceCount` prop.
   The test fails if React warns about an HTML attribute spelling.
2. **Make Panel a real wrapper** - `src/components/Panel.jsx`, plus the team
   line in `src/components/ServiceCard.jsx`. Panel must render its `title`
   prop and its children; a service without a team must read
   "Team: Unassigned" via a destructuring default.
3. **Move StatusBadge into its own module** - `src/components/StatusBadge.jsx`
   and `src/components/ServiceCard.jsx`. Export the component as the default
   export and `STATUS_LABELS` as a named export, then make the card import the
   default `StatusBadge` instead of keeping its own copy.
4. **Fix the two conditional-display bugs** - `src/components/ServiceCard.jsx`.
   A healthy card currently renders a stray `0`, and the maintenance note
   renders (empty) on every card instead of only where maintenance is planned;
   make `MaintenanceNotice` itself return `null` when there is none.
5. **Wire up the status filter** - `src/App.jsx`. Add a state variable for the
   selected filter, set it from the buttons, and narrow `visibleServices`.
6. **Count all three regional checks** - `src/App.jsx`, `runChecks`. One click
   must raise the counter by three; use updater functions instead of the
   stale `checksRun` value.
7. **Acknowledge without mutating** - `src/App.jsx`, `acknowledgeIncident`.
   Rebuild the handler so it copies the changed service and its nested
   incident and builds a new log array, instead of mutating state in place.
8. **Hide cards, fix the keys, derive the Down list** - `src/App.jsx`.
   Implement `hideService` without mutation, key the cards by a stable value
   from the service, such as its id, rather than the array index, and render
   the "Down now" panel from the services state with `filter` and `map`.

## Expected output

See `expected/on-completion.txt`. The run summary must show
`Test Files  8 passed (8)` and `Tests  8 passed (8)`.

## Offline note

Only the two `npm ci` commands need the network, once. `npm test` and
`npm run dev` then work offline.

## Reset

Your edits live only in `starter/src`. To start over, restore that folder from
a fresh copy of the lab. Hidden cards and acknowledgements are React state and
reset on every reload; nothing is stored outside the app.

## Cleanup

Delete `tests/node_modules` (and `starter/node_modules` if you created it).
The lab writes nothing else.

## Troubleshooting

- `vitest: command not found` - run `npm ci` inside `tests` first, and run
  `npm test` from the `tests` folder.
- Tests cannot find a module you created - check the file name and that you
  used the exact export forms the task names (default vs named).
- The dev server shows a blank page - open the browser console; a JSX syntax
  error in one component stops the whole app.
