# Loading data with useEffect

## Objectives

- Fetch data inside an Effect with useEffect and store the result in state
- Set an Effect's dependency array so it re-runs exactly when the values it reads change, and state what an empty array means
- Write an Effect cleanup that ignores or aborts a stale request, and explain why Strict Mode runs Effects twice in development

## Teaching

Most screens load data from a server. React code that talks to the outside world goes in an Effect. Predict this one before any teaching.

An Effect runs code after React has updated the screen, keeping a component in sync with something outside React. Rendering must stay pure, so fetching belongs in an Effect or an event handler, not in the render itself.

The dependency array says when to re-run:

- No array: after every render.
- `[]`: only after the first mount.
- `[userId]`: after mount, and whenever `userId` changes.

List every reactive value the Effect reads.

Responses can arrive out of order. If you open user 1 and quickly switch to user 2, a slow response for user 1 can land last and overwrite the screen.

An Effect can return a cleanup function. React runs it before the next Effect run and on unmount. Use it to ignore a stale result or abort the request:

```
let ignore = false;
fetchUser(id).then(u => { if (!ignore) setUser(u); });
return () => { ignore = true; };
```

Put it together: state for the result, an Effect that fetches, the value it reads in the array, and a cleanup that ignores a stale response.

The first render happens before any data exists, so render something sensible for that moment, such as `Loading`. This practice runtime supports `useEffect` with a fake `fetch` so nothing leaves your browser. It does not run Effects twice the way Strict Mode does.

In development, Strict Mode mounts each component, runs its cleanup, then runs the Effect again. It does this on purpose, to expose Effects with missing cleanup. It does not happen in production.

So seeing two requests in development is not a bug by itself. A correct Effect with a cleanup behaves the same to the user either way.

## Recap

An Effect runs after render to synchronize with something outside React, such as a server. The dependency array controls re-runs: none means every render, `[]` means once on mount, and `[id]` means when `id` changes. Return a cleanup to ignore or abort a stale request, so a slow response cannot overwrite newer data. In development, Strict Mode runs an extra mount and cleanup cycle on purpose to expose missing cleanups.

## Cheat sheet

Static version: a component calls useEffect with a fetch and no second argument, then stores the result in state. Trace what happens after the first response arrives, then compare with Activity 2.

A pharmacist checks a prescription whenever the patient or the dose changes, not each time someone walks past the counter.

The array names the only changes that should cause the work to run again.

Where to act: The log after each button press.

Next step: Press both buttons with each choice. A correct array makes a fetch line appear after one of them only.

Without JavaScript the lab cannot run. On paper: for no array, an empty array, and an array with userId, say whether the Effect runs on mount, after userId changes, and after an unrelated theme change.

Where to act: The Cleanup checkbox and the deliver button.

Next step: User 1 is the slower request, so its response is delivered last. Watch what the screen does when that happens with and without cleanup.

Without JavaScript the lab cannot run. On paper: user 1 is slow and user 2 is fast. Open user 1 and then user 2. Trace which response arrives last, what the screen ends on without cleanup, and what changes when cleanup sets an ignore flag.

Where to act: Inside `useEffect`, and the array after it.

Next step: Start with the fetch chain from the predict step, storing the JSON in the state you already have. Then ask which value the Effect reads.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The end of the Effect function.

Next step: Return a function that marks this run as stale, and test that mark before calling the setter.

Without JavaScript the editor cannot run. Starter: Profile has user state and an empty Effect with no array. On paper, write the fetch, the dependency array and a cleanup that ignores a stale response. The ignore-flag snippet in Activity 3 shows that shape.

Static version: two requests appear on load in development only. Compare keeping Strict Mode and writing a proper cleanup, blocking the second request with a flag, removing the array, and blaming a React bug. Choose, then check against the teaching text.

```
useEffect(() => {
  let cancelled = false;
  loadPage(page).then(rows => {
    if (!cancelled) setRows(rows);
  });
  return () => { cancelled = true; };
}, [page]);
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/API/AbortController: Instance methods
- developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch: Making a request; Canceling a request
- react.dev/learn/synchronizing-with-effects: How to write an Effect; How to handle the Effect firing twice in development
- react.dev/learn/you-might-not-need-an-effect: How to remove unnecessary Effects
- react.dev/reference/react/useEffect: Reference; Usage (fetching data with Effects)

## Static interaction alternatives

### predict

Static version: a component calls useEffect with a fetch and no second argument, then stores the result in state. Trace what happens after the first response arrives, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper: for no array, an empty array, and an array with userId, say whether the Effect runs on mount, after userId changes, and after an unrelated theme change.

### explore

Without JavaScript the lab cannot run. On paper: user 1 is slow and user 2 is fast. Open user 1 and then user 2. Trace which response arrives last, what the screen ends on without cleanup, and what changes when cleanup sets an ignore flag.

### terminal

Without JavaScript the editor cannot run. Starter: Profile has user state and an empty Effect with no array. On paper, write the fetch, the dependency array and a cleanup that ignores a stale response. The ignore-flag snippet in Activity 3 shows that shape.

### mcq

Static version: two requests appear on load in development only. Compare keeping Strict Mode and writing a proper cleanup, blocking the second request with a flag, removing the array, and blaming a React bug. Choose, then check against the teaching text.
