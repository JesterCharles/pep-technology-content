// Trail Guides API client helpers. Work through the tasks in README.md, in order.
// The tests import this file: keep every exported name exactly as it is.
//
// These are plain functions: no browser is needed. The tests pass their own
// fake fetch functions and response objects shaped like the real ones, so
// everything runs offline.

// Task 1: the client must read the API address from its environment object
// (shaped like import.meta.env) instead of hard-coding it.
// - Return env.VITE_API_URL without a trailing slash ("http://localhost:8080/"
//   becomes "http://localhost:8080").
// - When VITE_API_URL is missing or empty, throw an Error whose message names
//   VITE_API_URL, so the broken setup is obvious.
export function apiBaseUrl(env) {
  return "http://localhost:8080";
}

// Task 2: build the trails endpoint URL: BASE + "/api/trails". When filters
// has a difficulty or a maxKm value, add them as an encoded query string, in
// that order; leave out any filter that is undefined. No filters, no "?".
export function trailsUrl(baseUrl, filters = {}) {
  return baseUrl;
}

// Task 3: describe the POST request that creates a trail: return
// { url, init } where url is BASE + "/api/trails" and init carries the
// method, a Content-Type header for JSON, and the trail as a JSON body.
export function createTrailRequest(baseUrl, trail) {
  return { url: baseUrl, init: {} };
}

// Task 4: turn a ProblemDetail object (type, title, status, detail) from the
// API into one learner-facing message string:
// - status 400-499: "Check and try again: " followed by detail, or by title
//   when detail is missing.
// - status 500-599: exactly "Something went wrong on the server. Try again later."
//   (server internals stay private).
export function problemMessage(problem) {
  return "";
}

// Task 5: load the trail list and report what happened as a result object.
// Call fetchFn(trailsUrl(baseUrl)) with await inside try/catch:
// - fetchFn rejected (the request never got an HTTP answer):
//   { state: "network-error", message: "Check your connection and try again." }
// - response.ok is false: read the ProblemDetail with response.json() and
//   return { state: "http-error", status: response.status,
//            message: problemMessage(problem) }
// - response.ok is true: return { state: "loaded", trails: await response.json() }
export async function loadTrails(fetchFn, baseUrl) {
  return { state: "loaded", trails: [] };
}

// Task 6: apply a loadTrails result to the page model without mutating the
// old model. The model is { trails, status, message }:
// - "loaded" result: new trails, status "ready", message "".
// - "network-error" or "http-error" result: keep the old trails, status
//   "error", message from the result.
export function applyResult(model, result) {
  return model;
}
