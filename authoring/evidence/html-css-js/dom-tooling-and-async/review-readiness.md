# Review readiness: dom-tooling-and-async

Status: unreviewed first drafts with readiness bindings. Not final, not upload-safe, not published and not merged. No independent critic has reviewed these bytes.

Drafts accepted at `bf84329`. `first-draft-manifest.json` is the historical record of that commit: its HTML hashes, and its note that the catalog is unchanged, are superseded by this pass. GIFT bytes are unchanged from `bf84329`.

## Failed-attempt invariant

Retested on the `bf84329` bytes with public failing input. An editor, match or apply activity that failed twice ended `settled=true, completed=true, credit=1, grade=0`, and a page reported `5 of 5 complete` and `data-pep-complete=true` with no graded activity passed. That violated the accepted incomplete and no-credit invariant, so this pass applies the correction used by the corrected modules.

- A settled miss now ends `settled=true, continue=true, completed=false, credit=0, grade=0`, and the next activity unlocks.
- A later passing run in an editor records `completed=true, credit=1, grade=1`. Locked choice activities retry through Restart activity.
- `data-pep-complete` requires every activity to be completed. `data-pep-route-settled` marks the end of a route and opens the recap.
- A wrong prediction keeps `completed=true, credit=1, grade=0`. Predictions are ungraded, and the harness Restart check requires a prior settled grade-0 activity with one credit.

## Minimum release

This module is marked for the tonight minimum-release profile. Each topic carries `owner-essential-qa.json`, an implementation-owner record bound to the current `artifact.html` and `artifact.gift` hashes. It states that independent education and JavaScript SME critic approval was not required and was not performed. Draft status still holds: these bytes are not final, not upload-safe, not published and not merged.

Owner work on the current bytes:

1. **Choice controls simplified** (`d1cb8953`). Native selects became native radio groups (`fieldset.pep-choice`). The harness drives keyboard selects with Home and ArrowDown, which macOS ignores and no Linux run has proven. Radios work with Space on every platform, and QA select steps map one-to-one to radio checks.
2. **One bounded essential pass** (`315f9317`) covered correctness, answer safety and GIFT validity. One owner-dispatched read-only helper per module reported findings; the owner verified and applied them. No content-review wave, critic or reconciliation record was run or written.
3. **Main merged** (`39bbf50b`, main `e9a8aa28`). That merge changed `harness.mjs` and `T08-html-static.mjs`, which every private-success receipt binds.

## Checks on the current bytes (macOS, no browser)

| Check | Result |
| --- | --- |
| Inline script and JSON parse, all pages | Pass |
| T01-T05, T07, T14-T17, T19, T20, T24 | Pass |
| T06 | Fails until each answer-sensitive topic has a current private success receipt (table below) |
| T25 | Fails on this branch: minimum-profile support arrives with the T25 change on the inheritance-and-design branch. With that T25 and T01 applied to a scratch copy, T25 passes |
| T08-T13, T18, `npm test` browser suites | Not run: Chromium is held by another lane |

## Proof inventory

The "Page" and "QA paths" columns compare with `4d4fc1b5`, the last receipt checkpoint. No receipt is current, because every receipt binds the shared tool files changed by the main merge.

| Topic | Answer-sensitive | Receipt | Page | QA paths | Needed before release |
| --- | --- | --- | --- | --- | --- |
| `project-setup-with-npm-and-vite` | no | none | changed | changed | No private proof (no answer-sensitive editor); public browser gates only |
| `selecting-and-changing-the-dom` | yes | none | changed | changed | New private success proof (never proven) |
| `events-and-event-bubbling` | yes | none | changed | unchanged | New private success proof (never proven) |
| `preventing-cross-site-scripting` | yes | none | changed | changed | New private success proof (never proven) |
| `promises` | yes | none | changed | changed | New private success proof (never proven) |
| `async-and-await` | yes | none | unchanged | unchanged | New private success proof (never proven) |
| `the-event-loop` | yes | none | changed | unchanged | New private success proof (never proven) |
| `debugging-with-devtools-breakpoints` | yes | none | changed | changed | New private success proof (never proven) |

Run the proofs serially from one checkpoint, after the browser lane clears, and then run T08-T13 and T18 on the same bytes. Any later byte change to a page or its QA paths makes its proof and its `owner-essential-qa.json` stale again.

## Open gaps

- **Browser evidence is pending** for every topic. No claim is made about Linux keyboard behaviour.
- **Answer safety is owner-checked.** T08 has no JavaScript answer scanner.
- **Sources are bound per topic.** Every URL returned HTTP 200, but no claim-by-claim SME check exists.
- **Companion generator quirk.** The derived `artifact.md` repeats skipped sections under its Cheat sheet heading. This comes from shared tooling, not from the content.
- **Not built here:** labs stay deferred, and video stays absent with no search record.

## Budgets

| Topic | Budget | P50 | Worst path |
| --- | --- | --- | --- |
| `project-setup-with-npm-and-vite` | 12 | 10.01 | 11.51 |
| `selecting-and-changing-the-dom` | 13 | 10.9 | 12.4 |
| `events-and-event-bubbling` | 13 | 11.5 | 13 |
| `preventing-cross-site-scripting` | 11 | 8.83 | 10.33 |
| `promises` | 10 | 8.91 | 9.91 |
| `async-and-await` | 13 | 10.62 | 12.12 |
| `the-event-loop` | 10 | 8.68 | 9.68 |
| `debugging-with-devtools-breakpoints` | 10 | 8.45 | 9.45 |
