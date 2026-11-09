// Trail report utilities. Work through the tasks in README.md, in order.
// The tests import this file: keep every exported name exactly as it is.

// Task 6b: after finishing Task 6a in format.mjs, import formatKm (the named
// export) and formatTrailLine (the default export) from "./format.mjs" here,
// and use formatTrailLine in trailLines below.

// Task 1: difficulty filters must not match values of the wrong type.
export function hasDifficulty(trail, level) {
  var matches = trail.difficulty == level;
  return matches;
}

// Task 2: byDistance is a compare callback for sorting trails by distanceKm,
// shortest first. Write it as an arrow function stored in this variable.
export const byDistance = null;

// Task 2: sortTrails returns a NEW array sorted with the given compare
// callback. The input array must not change.
export function sortTrails(trails, compare) {
  return trails;
}

// Task 3: easyTrailNames returns the names of the trails whose difficulty is
// exactly "easy", in their original order, without changing the input.
export function easyTrailNames(trails) {
  return [];
}

// Task 4: totalDistance adds up distanceKm across all trails. An empty list
// totals 0.
export function totalDistance(trails) {
  return 0;
}

// Task 5: describeTrail takes one trail object and returns
// "NAME: DISTANCE km (DIFFICULTY)", for example "Lake Loop: 5 km (easy)".
// A trail without a difficulty reads "(unknown)".
export function describeTrail(trail) {
  return "";
}

// Task 5: withTag returns a NEW trail object whose tags end with the new tag.
// Neither the input object nor its tags array may change.
export function withTag(trail, tag) {
  return trail;
}

// Task 6b: trailLines turns every trail into its formatTrailLine text.
export function trailLines(trails) {
  return [];
}

// Task 7: makeTrailLog returns a logging function. Each call to that function
// records one trail name privately and returns how many names this log has
// seen so far. Two logs made by two calls to makeTrailLog count separately,
// and the list of names is not reachable from outside.
export function makeTrailLog() {
  return undefined;
}
