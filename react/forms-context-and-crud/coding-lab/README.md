# Beacon dashboard, part 3: forms, context and CRUD

Beacon becomes read-write: operators register new services, edit them and
retire them. You will build an accessible controlled form, validate on the
client while treating the server as the authority, create/update/delete
against the API, share notifications through context, and write a Testing
Library test of your own.

This is part 3 of a four-part scenario and is self-contained: the part-2
routing and data loading you need ship finished in the starter, and the dev
server carries a stateful mock of the status API (`mock-api.js`).

## Prerequisites

- Node.js 22.12+ (22.x LTS) or 24+, and npm 10 or newer. Check with:

  ```
  node --version
  npm --version
  ```

## Setup (one-time, needs the network once)

From this lab folder (the `coding-lab` folder):

```
cd tests
npm ci
```

Optional, to use the app against the mock API in a browser, from the `tests`
folder:

```
cd ../starter
npm ci
npm run dev
```

The dev server keeps that terminal busy: run the tests from `tests` in a
second terminal, and stop the server with Ctrl+C.

## When to do the tasks

Do tasks 1-3 on the S32 lab day. Do tasks 4-8 on S33, after its lessons on
create/edit/delete, submission errors and Testing Library.

## How to test

From the `tests` folder:

```
npm test
```

All 8 tests fail on the shipped starter - including test 8, which lives in
`starter/src/service-form.test.jsx` because you write it yourself. The tests
stub `fetch` and run fully offline.

Work in task order. Tests 4-7 build on tasks 1-3, and test 7 also needs the
"Service deleted" toast you add in task 6. Until tasks 4-6 are done, the run
also prints "Unhandled Rejection" errors from the unfinished API calls; they
go away as you finish those tasks. After the 8 tests pass, `npm test` also
checks your test 8 (see task 8) and exits with an error until it is complete.

## Files you edit

Every change happens at a `TASK n` comment in these files:

- `starter/src/components/ServiceForm.jsx` - tasks 1 to 5
- `starter/src/api.js` - tasks 4 and 6
- `starter/src/pages/OverviewPage.jsx` - task 6 (test 7 also exercises it)
- `starter/src/ToastContext.jsx` - task 7
- `starter/src/service-form.test.jsx` - task 8 (the test you write)

Everything else is support and stays as shipped - `tests/`, `expected/`,
`starter/mock-api.js` and every starter file not listed. The public tests
pass by implementing the tasks, not by changing the tests.

## The API you are coding against

- `GET /api/services`, `GET /api/services/<id>` - as in part 2.
- `POST /api/services` - create. 201 with the created service, or
  400 with `{ "errors": { "<field>": "<message>" } }`.
- `PUT /api/services/<id>` - update. 200, or 400 with the same error shape.
- `DELETE /api/services/<id>` - remove. 204 with no content.

All request bodies are JSON and need a `Content-Type: application/json`
header.

## The tasks

Every task is marked with a `TASK n` comment in the starter source.

1. **Control the fields** - `src/components/ServiceForm.jsx`. Text input,
   select and checkbox all read from state and write back in onChange.
2. **Associate the labels** - same file. `htmlFor`/`id` for name and team;
   mark both required.
3. **Client-side validation on submit** - same file. `preventDefault`,
   validate from state, accessible field errors (`aria-describedby`,
   `aria-invalid`), and no API call while input is invalid.
4. **Create against the API** - `src/api.js` (sendJson, createService) and the
   in-flight disable in the form. JSON POST, disabled Save while pending, and
   the overview shows the new service afterwards.
5. **Surface server errors** - `src/components/ServiceForm.jsx`, building on
   task 4's sendJson error contract. 400 field errors appear next to
   their fields; network failures show a form-level `role="alert"` message;
   the user's input is never thrown away.
6. **Edit and delete** - `src/api.js` (updateService, deleteService) and the
   delete handler in `src/pages/OverviewPage.jsx`. PUT and DELETE to the
   service's URL, announce "Service deleted" through the toast context, then
   bring the list back in line with the server.
7. **Toasts through context** - `src/ToastContext.jsx`. A real context,
   provider state, `addToast`, and the layout's live region shows every toast.
8. **Write your own test** - `starter/src/service-form.test.jsx`. Query by
   role and label to prove this scenario: start with a blank name, click Save
   with user-event, and use `findBy` to verify the visible "Enter a service
   name." error while `onSave` remains uncalled
   (`expect(onSave).not.toHaveBeenCalled()`). Then type a name, select a team
   (`user.selectOptions`), submit again, and use `queryBy` to verify the error
   is gone while `onSave` receives the entered values
   (`expect(onSave).toHaveBeenCalledWith(...)`). You may split the scenario
   into more than one test and import the form however you like.

   How test 8 is checked: `npm test` reruns your test file against an
   unchanged copy of your finished form, which must pass, and against six
   copies that each break one behaviour: ignoring the blank submission,
   calling `onSave` for it, ignoring the completed submission, never calling
   `onSave` for it, and passing `onSave` a different name or a different
   team. Your test must fail
   against each broken copy, so it is scored on four checks: the error
   appears after the blank submit, `onSave` stays uncalled for it, the
   completed submit is handled, and `onSave` receives the entered name and
   team. Using role and label queries, user-event, the right getBy/queryBy/
   findBy variant and the "error is gone" check is up to you: the check does
   not score those choices, so review them yourself. If something is missing,
   the run names the behaviour your test does not catch.

## Expected output

See `expected/on-completion.txt`. The run summary must show
`Test Files  8 passed (8)` and `Tests  8 passed (8)` (a higher Tests count,
and any todo, if you split test 8 into several tests), followed by
`✓ Task 8 rejects faulty submission behaviors`. Until test 8 is complete,
`npm test` instead lists what your test misses and exits with an error, even
though the summary shows 8 passed.

## Offline note

Only the `npm ci` commands need the network, once. Tests and the dev server
then work offline; the dev API is a local in-memory mock that resets on
restart.

## Reset

Your edits live only in `starter/src`. Restore that folder from a fresh copy
of the lab to start over. The mock API resets whenever the dev server
restarts; the tests reset it on every run.

## Cleanup

Delete `tests/node_modules` (and `starter/node_modules` if you created it).
The lab writes nothing else.

## Troubleshooting

- `vitest: command not found` - run `npm ci` inside `tests` first.
- "A component is changing an uncontrolled input to be controlled" in the
  console - a field starts with `undefined` as its value; initialValues always
  provides a string or boolean, so read from state, not from props directly.
- Test 5 cannot find the Save service button after a server error - the
  button is still disabled with its pending label; reset the pending state in
  a `finally` block so it re-enables after a failure.
- "Not implemented: HTMLFormElement.prototype.requestSubmit" in the test
  output - handleSubmit is missing `event.preventDefault()`.
- Your own test cannot find the button - its accessible name is the visible
  text; check what the form actually renders while submitting.
