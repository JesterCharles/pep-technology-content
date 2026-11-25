/*
TASK 4 (part 2). fetch does not reject when the server answers with an error
status; it only rejects when the request itself cannot be made. This helper
therefore happily parses a 500 page as if it were data. Make it check
response.ok and, when the response is not ok, throw
  new Error(`HTTP ${response.status}`)
so callers can show what went wrong. Your useFetch hook relies on this check.

TASK 6 (part 1). Accept an optional AbortSignal as a second parameter and pass
it to fetch in the options object, so a caller can abort the request.
*/
export async function fetchJson(url) {
  const response = await fetch(url);
  return response.json();
}
