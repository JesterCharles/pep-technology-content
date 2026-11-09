# Fetch and browser client lab: Trail API client

Standard track, S26 Lab day: about 55 minutes. Fast Track skips this lab; Fast learners build the same client logic in the course project, and can use this lab as optional remediation.

## Goal

The Trail Guides dashboard needs a client layer for the Spring Boot trails API: reading the API address from the environment, building request URLs and JSON POST requests, telling network failures apart from HTTP error responses, turning ProblemDetail errors into messages a hiker can read, and applying results to the page model. You write those plain functions in `starter/api.mjs`, then write your own Vitest test for a finished function.

Everything is a pure function tested with Vitest and fake fetch responses, so no server and no browser are needed: this is the same client logic you will wire to real `fetch` calls in the course project.

This lab practises these topics: Fetching data; Handling HTTP errors and ProblemDetail responses; Calling your Spring Boot API from the browser; Environment settings for the API address; Testing a plain function with Vitest. Read those topic pages first; each task names what it needs.

## What the tests check, and what they do not

- Tasks 1 to 6 are checked by behavior: the tests call your functions with their own data, fake fetch functions and frozen model objects that throw if your code mutates them.
- Task 7 checks the test file you write yourself: it must exist, import the function it tests and use `test`, `expect`, `toBe` and `toEqual`. Vitest also runs your file, so a wrong assertion fails the run with output for you to read.
- The tests do not make real network requests, and they do not check code layout or variable names inside your functions.

## Prerequisites

- Node.js 22.12 or later, with npm 10 or later (npm comes with Node.js). Check both in a terminal:

  ```sh
  node --version
  npm --version
  ```

  Expected: `v22.12.0` or higher, and `10.0.0` or higher.
- About 50 MB of free disk space for the pinned test runner, and a network connection for the one-time setup.
- A text editor. No browser, no Docker and no running API server are needed.

## Setup

1. Open a terminal in this folder, `coding-lab/`, the folder that holds this README.
2. Go into `starter/` and install the pinned test runner once:

   ```sh
   cd starter
   npm ci
   ```

   `npm ci` installs Vitest 4.1.12 exactly as pinned in `starter/package-lock.json`, into `starter/node_modules/`. Nothing is installed outside this lab folder.
3. Still in `starter/`, run the tests once before you change anything:

   ```sh
   npm test
   ```

   All seven tests fail, and each message names what is still missing. This is the expected start.

## Tasks

Work only in `starter/api.mjs`, plus the new test file you create in Task 7. Everything else is the lab's fixed support and stays as shipped: `starter/format-distance.mjs`, `starter/vitest.config.mjs`, the package files, the shipped tests in `tests/` and `expected/on-completion.txt`. A task counts as done only when the shipped tests for it pass exactly as shipped. Each task's comment in `starter/api.mjs` states its exact contract. After each task, rerun `npm test` from `starter/`: that task's test turns green. If you are stuck, open the hints one at a time; none of them gives the full code.

### Task 1: the API address comes from the environment

- **Where:** `starter/api.mjs`, the `apiBaseUrl` function.
- **Outcome:** `apiBaseUrl(env)` returns `env.VITE_API_URL` without a trailing slash, and throws an `Error` naming `VITE_API_URL` when it is missing or empty. In the real client, `env` is `import.meta.env`, filled from a `.env` file.
- **Done when:** `task 1: apiBaseUrl reads VITE_API_URL and rejects a missing address` passes.
- **Hint 1:** only `VITE_`-prefixed variables reach browser code, and anything that does reach it is public: the address may live there, a secret never may. Topic page: Environment settings, steps 1 and 2.
- **Hint 2:** check for a missing or empty value first and `throw new Error(...)`; then return the address, slicing off a final `/` when present.

### Task 2: build the trails URL

- **Where:** `starter/api.mjs`, the `trailsUrl` function.
- **Outcome:** `trailsUrl(base)` is `BASE/api/trails`; a `difficulty` and a `maxKm` filter are added as an encoded query string in that order, each only when defined; with no filters there is no `?`.
- **Done when:** `task 2: trailsUrl builds the trails endpoint with encoded query filters` passes.
- **Hint 1:** do not paste filter values into the string yourself: a value such as `short & easy` must come out encoded. Topic page: Calling your Spring Boot API, step 2.
- **Hint 2:** build the query with `URLSearchParams`, `set` each defined filter, and append `?` plus `toString()` only when it is non-empty.

### Task 3: describe the POST request

- **Where:** `starter/api.mjs`, the `createTrailRequest` function.
- **Outcome:** `createTrailRequest(base, trail)` returns `{ url, init }`: the trails URL, a `POST` method, a `Content-Type: application/json` header and the trail serialized as the JSON body — the exact shape `fetch(url, init)` takes.
- **Done when:** `task 3: createTrailRequest posts JSON with the right method, header and body` passes.
- **Hint 1:** without the `Content-Type` header, the server rejects the body it cannot parse. Topic page: Calling your Spring Boot API, step 3.
- **Hint 2:** the body is a string: `JSON.stringify(trail)`.

### Task 4: ProblemDetail becomes a readable message

- **Where:** `starter/api.mjs`, the `problemMessage` function.
- **Outcome:** a 4xx problem reads `Check and try again: ` plus its `detail`, or its `title` when there is no detail; every 5xx problem reads exactly `Something went wrong on the server. Try again later.`, whatever its detail says.
- **Done when:** `task 4: problemMessage maps ProblemDetail responses to learner-facing text` passes.
- **Hint 1:** a 4xx detail tells the user what to fix; a 5xx detail describes server internals that must not reach the page. Topic page: Handling HTTP errors, steps 2 and 3.
- **Hint 2:** branch on `problem.status >= 500` first, then fall back from `detail` to `title` with `??`.

### Task 5: network failure, HTTP error or success

- **Where:** `starter/api.mjs`, the `loadTrails` function.
- **Outcome:** `loadTrails(fetchFn, base)` awaits `fetchFn(trailsUrl(base))` and returns one of three result objects: `network-error` when the call rejects, `http-error` with the status and `problemMessage` text when `response.ok` is false, or `loaded` with the parsed trails. The exact shapes are in the starter comment.
- **Done when:** `task 5: loadTrails distinguishes network failure, HTTP error and success` passes.
- **Hint 1:** `fetch` only rejects when no HTTP answer arrived at all; a 404 resolves normally, and `response.ok` is how you notice it. Topic pages: Fetching data, step 2; Handling HTTP errors, step 1.
- **Hint 2:** wrap only the `await fetchFn(...)` in `try`/`catch`; after it, read `response.ok`, and remember both bodies arrive via `await response.json()`.

### Task 6: apply the result to the page model

- **Where:** `starter/api.mjs`, the `applyResult` function.
- **Outcome:** `applyResult(model, result)` returns a new model object: a `loaded` result installs the new trails with status `ready` and an empty message; either error result keeps the old trails with status `error` and the result's message. The old model never changes.
- **Done when:** `task 6: applyResult updates the page model without mutating the old one` passes.
- **Hint 1:** this is the mapping from API responses, including error responses, to what the page shows. Topic page: Calling your Spring Boot API, step 4.
- **Hint 2:** spread the old model into a new object and override the fields that change; the tests pass frozen models, so any mutation throws.

### Task 7: write your own Vitest test

- **Where:** a new file you create: `starter/format-distance.test.mjs`.
- **Outcome:** your file imports `formatDistance` from `./format-distance.mjs` (a finished function; read it first) and declares exactly two tests with `test` and `expect`: one asserting the `label` string with `toBe`, one asserting the whole result object with `toEqual`.
- **Done when:** `task 7: your format-distance.test.mjs exists and uses test, expect, toBe and toEqual` passes, and your own two tests pass with it.
- **Hint 1:** start from `import { expect, test } from "vitest";` — the same first line as any Vitest file. Topic page: Testing a plain function with Vitest, step 1.
- **Hint 2:** `toBe` compares primitives by identity; `toEqual` compares objects by structure. Assert `formatDistance(5).label` with one and `formatDistance(11.5)` with the other. To see what a failing assertion looks like, make one expectation wrong on purpose, read the output, then fix it.

## How to test

From `starter/`, run the one test command:

```sh
npm test
```

While you work, failing tests print a `FAIL` block whose message names what is missing, then a summary. When everything is done, the summary reports every test passed.

## Expected output

When you are finished, and Task 7 has exactly the two required tests, the output ends like `expected/on-completion.txt` (your lab folder path, start time and durations differ on every run):

```text
 Test Files  3 passed (3)
      Tests  9 passed (9)
```

The nine tests are the seven public tasks plus your own two from Task 7.

## Offline note

Only setup needs the network, once, to download the pinned test runner. After that, `npm test` runs fully offline: every "request" in this lab is a fake fetch function supplied by the tests.

## Cleanup

Delete `starter/node_modules/` to remove the test runner; the tests create nothing else. To start your work again from scratch, copy `starter/api.mjs` back from a fresh copy of this lab and delete your `starter/format-distance.test.mjs`.

## Troubleshooting

- `node: command not found`, or a version below 22.12: install Node.js 22.12 or later from nodejs.org, then open a new terminal.
- `vitest: command not found` or `Cannot find package 'vitest'`: run `npm ci` inside `starter/` (Setup, step 2), then run `npm test` from `starter/` again.
- `npm ci` fails while downloading: check your network connection and run it again; it resumes from a clean install.
- No tests found: run `npm test` from the `starter/` folder, the one that holds `package.json`.
- Task 5 reports the wrong result kind: check what you wrapped in `try`/`catch`; only a rejected `fetchFn` call is a network error, while a response with `ok: false` is an HTTP error.
- Your Task 7 file fails: read the printed assertion diff; it shows the expected and received values your test compared.
