// Run me with: node main.mjs   (from the starter/ folder)
// The output grows as you finish the tasks; nothing here needs editing.
import { trails } from "./trails.mjs";
import { easyTrailNames, totalDistance, trailLines } from "./report.mjs";

console.log(`Trails loaded: ${trails.length}`);
console.log(`Total distance: ${totalDistance(trails)} km`);
console.log(`Easy trails: ${easyTrailNames(trails).join(", ") || "(none yet - Task 3)"}`);
const lines = trailLines(trails);
console.log(lines.length ? lines.join("\n") : "(report lines appear after Task 6)");
