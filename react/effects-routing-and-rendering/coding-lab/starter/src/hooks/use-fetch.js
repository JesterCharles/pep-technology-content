/*
TASK 4 (part 1). Both pages need the same stateful loading logic, so it belongs in a
custom hook. Implement useFetch(url) here so that it:
  - fetches the url with fetchJson from ../api.js inside an Effect (do the
    response.ok check in ../api.js too, TASK 4 part 2: the hook relies on it
    to turn a 404 or 500 into an error);
  - returns an object { data, loading, error }:
      loading is true from the first render until the request settles,
      data holds the parsed JSON after success (and is null before),
      error holds the thrown Error after a failure (and is null otherwise);
  - lists url in the Effect's dependency array so changing the url starts a
    new load (and resets loading/data/error for the new request).
Every component that calls this hook gets its own independent state.

TASK 6 (part 2). Create an AbortController in the Effect, pass its signal to
fetchJson, abort it in the cleanup function, and ignore the AbortError a
cancelled request throws: an aborted request is not a failure to show.
*/
export function useFetch(url) {
  // TODO: implement the hook described above
  return { data: null, loading: false, error: null };
}
