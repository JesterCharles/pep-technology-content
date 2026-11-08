# Loading and error states

## Objectives

- Model a request as loading, success and error states and render a distinct screen for each
- Treat a non-2xx response as an error by checking response.ok, because fetch does not reject merely because the server returned a non-2xx HTTP status; handle aborted and malformed requests separately
- Show an empty result differently from an error

## Teaching

Requests fail in more than one way. Predict what this common code does when the server answers 404, before any teaching.

Model a request as one state at a time: loading, success, or error, plus empty when a successful answer has no items. Each state gets its own screen.

`fetch` rejects only when the request itself fails, such as a network failure or an abort. A 404 or 500 still resolves, so **check `response.ok`**, which is true for statuses 200 to 299. Parsing can fail too, if the body is not valid JSON.

Three separate checks handle all the failure kinds:

```
try {
  const res = await fetch(url);
  if (!res.ok) { /* server said no */ }
  const data = await res.json();
} catch (e) {
  if (e.name === 'AbortError') { /* we cancelled */ }
  /* network failure or bad JSON */
}
```

An abort is not an error to show the user: it means you cancelled the request because a newer one took over.

The mental model: the request has a status, and the screen is a function of that status. Rendering is then one branch per state, with no overlapping flags that could say loading and error at the same time.

## Recap

Model a request as one status at a time: loading, success, error or empty, each with its own screen. `fetch` rejects only when the request itself fails, so check `response.ok` to catch statuses such as 404 or 500. Parsing can also fail, and an abort is your own cancellation, not an error to show. An empty successful result gets a friendly message, not an error.

## Cheat sheet

Static version: fetch followed by .then(r => r.json()), .then(setItem) and .catch(setError), where the server returns 404 with a JSON body. Decide which line receives the body, then compare with Activity 2.

A courier hands you a sealed reply from a shop. The envelope arriving only proves delivery worked; you still have to open it and read whether the shop said yes or sorry.

A resolved request can still carry a refusal, so look inside before trusting it.

Where to act: The checkbox and the Response list.

Next step: Compare the code path line for 404 with the check off and on. Then think about whether an empty list means something went wrong.

Without JavaScript the lab cannot run. On paper, for 200 with items, 200 empty, 404, 500, network failure, malformed JSON and an abort, say which path runs and which screen it should reach: success, empty, error, or ignored.

Where to act: Directly after the `await fetch` line.

Next step: A failed status does not throw, so test it yourself and return early.

Another hint Another hint, 2 of 3 for Activity 3

Where to act: After the JSON is parsed.

Next step: Now you know the request worked. Use the length to pick between two statuses.

Another hint Another hint, 3 of 3 for Activity 3

Where to act: The `catch` block.

Next step: Every remaining failure lands here. Tell the cancellation apart by the error name.

Without JavaScript the editor cannot run. Starter: load awaits fetch and json and always returns success. On paper, add the status check, the length check and a try and catch that separates an abort from other failures. Check against the shape in the teaching text. When scripted, the function is run against a fake fetch.

Static version: a search returning status 200 with an empty list currently displays an error. Compare an empty-result message, keeping the error, keeping the spinner, and retrying. Choose using the three states in Activity 2.

```
// Each outcome gets its own branch and its own screen:
response.ok is false      -> server said no: error screen
response.json() rejected  -> body unreadable: error screen
fetch rejected, AbortError -> you cancelled: show nothing new
fetch rejected, other     -> network failure: error screen
empty array after parsing -> empty screen
anything else             -> success screen
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch: Handling the response
- developer.mozilla.org/en-US/docs/Web/API/Response/ok: Value
- react.dev/learn/reacting-to-input-with-state: Thinking about UI declaratively

## Static interaction alternatives

### predict

Static version: fetch followed by .then(r => r.json()), .then(setItem) and .catch(setError), where the server returns 404 with a JSON body. Decide which line receives the body, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, for 200 with items, 200 empty, 404, 500, network failure, malformed JSON and an abort, say which path runs and which screen it should reach: success, empty, error, or ignored.

### terminal

Without JavaScript the editor cannot run. Starter: load awaits fetch and json and always returns success. On paper, add the status check, the length check and a try and catch that separates an abort from other failures. Check against the shape in the teaching text. When scripted, the function is run against a fake fetch.

### mcq

Static version: a search returning status 200 with an empty list currently displays an error. Compare an empty-result message, keeping the error, keeping the spinner, and retrying. Choose using the three states in Activity 2.
