// Formatting helpers for the Trail Guides report.
//
// Task 6a: make formatKm a NAMED export and formatTrailLine the DEFAULT export,
// so report.mjs (and the tests) can import them. Do not rename the functions.

function formatKm(distanceKm) {
  return `${distanceKm} km`;
}

function formatTrailLine(trail) {
  return `${trail.name} (${formatKm(trail.distanceKm)}, ${trail.difficulty})`;
}
