# Create, edit and delete against the API

## Objectives

- Send POST, PUT or PATCH, and DELETE requests with fetch, using a JSON body and a Content-Type header
- Update the screen after a successful create, edit or delete so the list matches the server, by applying the response or reloading
- Disable the submit control while a request is in flight so a double click cannot send a duplicate

## Teaching

So far data has flowed from the server to the screen. Now the screen changes the server. Predict this request before any teaching.

Mutations use `fetch` with options:

```
fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name }),
});
```

- POST to the collection creates an item.
- PUT to one item replaces it; PATCH changes part of it.
- DELETE to one item removes it, with no body needed.

`JSON.stringify` makes the body, and the header tells the server what it is.

A successful mutation changes the server, so the screen must catch up. Two options:

- Apply the response: add the returned item or remove it from the array, using the non-mutating updates you already know.
- Reload: fetch the list again. It is simpler, at the cost of another request.

Only update after success: check `res.ok` first, or the screen will claim something that did not happen. A DELETE often returns 204 with no body, so do not parse JSON there.

Requests take time, and people double-click. Without protection, two identical POST requests create two records.

Track an in-flight status and disable the submit control while it is true:

```
<button disabled={saving}>Save</button>
```

Set it just before the request, and clear it in a `finally` block, so a failure does not leave the button stuck.

A solid save handler has one shape: set saving, send the request, **check `res.ok`**, update the screen from the result, and clear saving in `finally`. Most bugs are a missing step in that order.

## Recap

Send mutations with `fetch`, using `method`, a `Content-Type` header and a `JSON.stringify` body: POST creates, PUT or PATCH edits, DELETE removes. After success, update the list from the response or by reloading, and only after checking `res.ok`. Disable the submit control while a request is in flight, clearing that state in `finally`, so a double click cannot send a duplicate.

## Cheat sheet

Static version: fetch is called with method POST and body set to a plain object. Decide what is actually sent, then compare with Activity 2.

Where to act: The Method and URL lists.

Next step: Do one change at a time. For each, decide whether you are talking to the collection or to one item, and whether a name is needed.

Without JavaScript the builder cannot run. On paper, starting from Lamp (id 1) and Chair (id 2), write the three requests needed to rename Lamp to Desk lamp, remove Chair and add Mouse: the method, the URL and any body.

Where to act: The options object of the `fetch` call in `addItem`.

Next step: Compare it with the teaching example from Activity 2. Then parse the response and add that object to a new array.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: `removeItem`.

Next step: No body is sent and none comes back, so there is nothing to parse. After the ok check, filter the list you already have.

Without JavaScript the editor cannot run. Starter: addItem sends a raw object body and pushes to the list; removeItem is empty. On paper, rewrite both using the request shape from Activity 2, a res.ok check, and non-mutating updates. When scripted, the code runs against a fake fetch.

Where to act: The Save button and the Requests sent line.

Next step: Press Save twice in a row before responding. Compare the count of requests and of records in each mode.

Without JavaScript the lab cannot run. On paper, trace two quick presses of Save with and without a disabled-while-saving button. Say how many requests are sent, and how many records exist after the responses.

Static version: a save function sets saving, posts JSON, always adds the parsed response to the list, and clears saving last. Name what happens on a 500 and on a network failure. Then check against the teaching text.

```
setBusy(true);
try {
  const reply = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!reply.ok) throw new Error('Failed: ' + reply.status);
  const saved = await reply.json();
  setNotes(all => [...all, saved]);
} finally {
  setBusy(false);
}
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch: Making a request
- developer.mozilla.org/en-US/docs/Web/API/RequestInit: Instance properties (method, headers, body)
- react.dev/learn/updating-arrays-in-state: Updating arrays without mutation
- www.rfc-editor.org/rfc/rfc9110.html: 9.3 Method Definitions (POST, PUT, DELETE)

## Static interaction alternatives

### predict

Static version: fetch is called with method POST and body set to a plain object. Decide what is actually sent, then compare with Activity 2.

### explore

Without JavaScript the builder cannot run. On paper, starting from Lamp (id 1) and Chair (id 2), write the three requests needed to rename Lamp to Desk lamp, remove Chair and add Mouse: the method, the URL and any body.

### terminal

Without JavaScript the editor cannot run. Starter: addItem sends a raw object body and pushes to the list; removeItem is empty. On paper, rewrite both using the request shape from Activity 2, a res.ok check, and non-mutating updates. When scripted, the code runs against a fake fetch.

### explore

Without JavaScript the lab cannot run. On paper, trace two quick presses of Save with and without a disabled-while-saving button. Say how many requests are sent, and how many records exist after the responses.

### mcq

Static version: a save function sets saving, posts JSON, always adds the parsed response to the list, and clears saving last. Name what happens on a 500 and on a network failure. Then check against the teaching text.
