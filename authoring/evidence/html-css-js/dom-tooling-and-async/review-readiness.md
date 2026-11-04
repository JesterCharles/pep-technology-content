# Review readiness: dom-tooling-and-async

Status: unreviewed first drafts with readiness bindings. Not final, not upload-safe, not published and not merged. No independent critic has reviewed these bytes.

Drafts accepted at `bf84329`. `first-draft-manifest.json` is the historical record of that commit: its HTML hashes, and its note that the catalog is unchanged, are superseded by this pass. GIFT bytes are unchanged from `bf84329`.

## Failed-attempt invariant

Retested on the `bf84329` bytes with public failing input. An editor, match or apply activity that failed twice ended `settled=true, completed=true, credit=1, grade=0`, and a page reported `5 of 5 complete` and `data-pep-complete=true` with no graded activity passed. That violated the accepted incomplete and no-credit invariant, so this pass applies the correction used by the corrected modules.

- A settled miss now ends `settled=true, continue=true, completed=false, credit=0, grade=0`, and the next activity unlocks.
- A later passing run in an editor records `completed=true, credit=1, grade=1`. Locked choice activities retry through Restart activity.
- `data-pep-complete` requires every activity to be completed. `data-pep-route-settled` marks the end of a route and opens the recap.
- A wrong prediction keeps `completed=true, credit=1, grade=0`. Predictions are ungraded, and the harness Restart check requires a prior settled grade-0 activity with one credit.

## Checks run by the author on this machine (macOS)

| Check | Result |
| --- | --- |
| `npm test` | 269 passed, 0 failed |
| All other gates in `npm run check`, including T05, T06, T09, T13, T14, T15 and T18 | No failures in this module |
| T10, T11, T12 in `npm run check` | Failures, see below |
| T25 in `npm run check` | Failures, see below |
| Author smoke with success inputs kept outside the repository | Passed: pass, fail, restart, history, viewports, sandbox, no-JavaScript, print |

## Exact remaining failures

1. **T25**: each `artifact.html` and `artifact.gift` reports missing current education and SME critic coverage. No review has been allocated, and no critic record was written.
2. **T10, T11, T12 on macOS**: the harness drives keyboard selects with Home and ArrowDown, which native macOS selects ignore. Pages with a select in a keyboard route stop at that step. On a throwaway copy with identical pages and QA paths, replacing only those two harness select steps gave `QA: T09-T13 and T18 passed`.

## Open gaps

- **Linux keyboard evidence is unavailable.** Keyboard operation of native selects has not been proven by the unmodified harness. This needs a Linux or CI run; the diagnostic above does not replace it.
- **Passing editor routes are not committed proof.** Committed QA paths hold only answer-free failing input, so they prove failure handling. Passing was exercised only by the uncommitted author smoke, and no receipt records it. The private-proof path supports only the Python comprehension scanner, so these JavaScript tasks cannot opt in.
- **Answer safety is author-scanned.** T08 has no JavaScript answer scanner. The author checked that no complete success input appears in the page, Markdown, GIFT, QA paths or catalog. Semantic leakage needs independent review.
- **Sources are bound per topic.** Every URL returned HTTP 200, but no claim-by-claim SME check exists.
- **Timing is an author model.** Budgets below were raised to fit the modeled worst path. T14 passes with them.
- **Not built here:** labs stay deferred, and video stays absent with no search record.

## Budgets

| Topic | Planned | Now | P50 | Worst path |
| --- | --- | --- | --- | --- |
| `project-setup-with-npm-and-vite` | 10 | 12 | 10.05 | 11.55 |
| `selecting-and-changing-the-dom` | 10 | 13 | 10.9 | 12.4 |
| `events-and-event-bubbling` | 10 | 13 | 11.5 | 13 |
| `preventing-cross-site-scripting` | 10 | 11 | 8.86 | 10.36 |
| `promises` | 10 | 10 | 8.91 | 9.91 |
| `async-and-await` | 10 | 13 | 10.62 | 12.12 |
| `the-event-loop` | 10 | 10 | 8.68 | 9.68 |
| `debugging-with-devtools-breakpoints` | 10 | 10 | 8.46 | 9.46 |
