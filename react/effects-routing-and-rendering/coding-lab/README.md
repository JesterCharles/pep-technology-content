# Beacon dashboard, part 2: effects, routing and rendering

Beacon no longer reads its data from a file: the status API serves it. In this
part you connect the dashboard to the API with Effects, split it into real
pages with React Router, extract a reusable data-loading hook, lift shared
state to the right owner and fix an unnecessary re-render.

This is part 2 of a four-part scenario. The lab is self-contained: part 1 work
you need is already in the starter, and the dev server ships a mock of the
status API (`mock-api.js`), so nothing outside this folder is required.

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

Optional, to run the app with the mock API in a browser, from the `tests`
folder:

```
cd ../starter
npm ci
npm run dev
```

The dev server keeps that terminal busy: run `npm test` in a second terminal,
and stop the server with Ctrl+C.

## How to test

From the `tests` folder:

```
npm test
```

All 8 tests fail on the shipped starter. The tests stub `fetch` themselves, so
they run fully offline and never touch the mock API.

Do task 4 before task 3; otherwise work in order. Some tests build on other
tasks:

- Test 1 walks the whole route tree, including the data-driven detail page,
  so it turns green only once tasks 3 and 4 are done as well.
- Tests 2 and 3 need the routes from task 1; test 3 also needs task 4.
- Test 5 needs task 4, and test 6 needs task 5 (the overview must load
  through your hook).

## Files you edit

Every change happens at a `TASK n` comment in these files:

- `starter/src/App.jsx` - task 1
- `starter/src/components/AppLayout.jsx` - task 2
- `starter/src/pages/ServiceDetailPage.jsx` - task 3
- `starter/src/hooks/use-fetch.js` - tasks 4 and 6
- `starter/src/api.js` - tasks 4 and 6
- `starter/src/pages/OverviewPage.jsx` - tasks 5 and 7
- `starter/src/components/Toolbar.jsx` - task 7
- `starter/src/components/StatusLegend.jsx` - task 8

Everything else is support and stays as shipped - `tests/`, `expected/`,
`starter/mock-api.js` and every starter file not listed. The tests pass by
implementing the tasks, not by changing the tests.

## The API you are coding against

- `GET /api/services` returns the list of services.
- `GET /api/services/<id>` returns one service, or status 404 for an unknown
  id.

Responses are JSON. Remember: `fetch` resolves even for a 404 or 500; only
`response.ok` tells you the request succeeded.

## The tasks

Every task is marked with a `TASK n` comment in the starter source.

1. **Rebuild the route tree** - `src/App.jsx`. One layout route rendering
   `AppLayout` (masthead and nav once, child pages through `Outlet`), an index
   route for the overview, `services/:serviceId` for the detail page,
   `legend`, and a catch-all for unknown paths.
2. **Replace the plain anchors** - `src/components/AppLayout.jsx`. Use the
   router's link components so switching pages keeps the app alive, and let
   the active link mark itself with `aria-current="page"`.
3. **Build the service detail page** - `src/pages/ServiceDetailPage.jsx`.
   Finish task 4 first. Read the id with `useParams`, load the service with
   your hook from task 4, handle loading and error, render the given
   `ServiceDetails` component on success, and navigate back to the overview
   from code.
4. **Extract the useFetch hook** - `src/hooks/use-fetch.js` and `src/api.js`.
   One hook owns loading/data/error state and re-runs when the url changes;
   `fetchJson` treats a non-ok response as an error (`HTTP <status>`). The
   exact contract is in the files' task comments.
5. **Honest request states** - `src/pages/OverviewPage.jsx`. Replace the old
   effect with your hook and render four distinct overview screens: loading,
   error, empty and loaded.
6. **Abort stale requests** - `src/api.js` and the hook. Pass an AbortSignal
   through to `fetch`, abort it in the Effect cleanup and ignore the
   AbortError, so a request outlives no page. The test also renders the
   overview in Strict Mode, whose double Effect run in development aborts the
   first request: that abort must not show as an error.
7. **Lift the filter state** - `src/components/Toolbar.jsx` and
   `src/pages/OverviewPage.jsx`. The toolbar sets the filter, the page uses it
   to narrow the list: the state belongs to their closest common parent. The
   visible list and count line are derived, not extra state.
8. **Skip the needless re-render** - `src/components/StatusLegend.jsx`. Use
   the render counts from `src/render-count.js` to see that every "Refresh
   view" click re-renders the static legend, then memoize it. `memo` is a
   performance optimisation: it only skips work and never changes what is
   shown.

## Expected output

See `expected/on-completion.txt`. The run summary must show
`Test Files  8 passed (8)` and `Tests  8 passed (8)`.

## Offline note

Only the `npm ci` commands need the network, once. `npm test` and
`npm run dev` then work offline; the dev server's API is a local mock.

## Reset

Your edits live only in `starter/src`. Restore that folder from a fresh copy
of the lab to start over. The app stores nothing outside React state.

## Cleanup

Delete `tests/node_modules` (and `starter/node_modules` if you created it).
The lab writes nothing else.

## Troubleshooting

- `vitest: command not found` - run `npm ci` inside `tests` first.
- Test 4 fails at the HTTP 500 step - check the `response.ok` check in
  `fetchJson` (`src/api.js`, task 4 part 2).
- Every detail page shows HTTP 404 - the URL you fetch must include the id
  from `useParams`, not a literal `:serviceId`.
- A page shows "Loading ..." forever - check that your hook sets `loading` to
  false when the request settles.
