# Review readiness: fetch-and-browser-client

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

## Checks on the current bytes (macOS)

| Check | Result |
| --- | --- |
| Inline script and JSON parse, all pages | Pass |
| T01-T05, T07, T14-T17, T19, T20, T24, T25 | Pass |
| T09-T13, T18 (public browser gates, every topic) | Pass, recorded in each `qa-receipt.json` or run log |
| T06 private success proofs | Pass for every answer-sensitive topic (table below) |
| T08, full `npm run check`, `npm test` | Run once on the final branch head; results are reported with the pull request |

## Proof inventory

Proofs ran serially. Each receipt commit is the immediate child of its proof commit. Success, wrongFirst, keyboard and sandbox routes passed with every declared task completed, credited and graded. The all-fail and mixed controls were refused. Inputs were authored by the implementation owner in mode-restricted files outside the repository, and that staging is retired. Any later byte change to a page or its QA paths makes its proof and its `owner-essential-qa.json` stale.

| Topic | Answer-sensitive | Private success proof |
| --- | --- | --- |
| `fetching-data` | yes | `00c378ed` by `js-fetching-data-proof-1794145443868` |
| `handling-http-errors-and-problemdetail-responses` | yes | `3679d6af` by `js-handling-http-errors-and-problemdetail-responses-proof-1794145471043` |
| `fixing-cors-spring-security-config-vs-vite-dev-proxy` | yes | `d5f08ee7` by `js-fixing-cors-spring-security-config-vs-vite-dev-proxy-proof-1794145498081` |
| `cookies-vs-localstorage-where-tokens-should-live` | no | not applicable |
| `calling-your-spring-boot-api-from-the-browser` | yes | `4dce4b36` by `js-calling-your-spring-boot-api-from-the-browser-proof-1794145522349` |
| `environment-settings-for-the-api-address` | yes | `5cf489a9` by `js-environment-settings-for-the-api-address-proof-1794145747748` |
| `testing-a-plain-function-with-vitest` | yes | `ed7fad5c` by `js-testing-a-plain-function-with-vitest-proof-1794145771872` |

## Open gaps

- **Browser evidence is macOS only.** No claim is made about Linux keyboard behaviour.
- **Answer safety is owner-checked.** T08 has no JavaScript answer scanner.
- **Sources are bound per topic.** Every URL returned HTTP 200, but no claim-by-claim SME check exists.
- **Companion generator quirk.** The derived `artifact.md` repeats skipped sections under its Cheat sheet heading. This comes from shared tooling, not from the content.
- **Not built here:** labs stay deferred, and video stays absent with no search record.

## Budgets

| Topic | Budget | P50 | Worst path |
| --- | --- | --- | --- |
| `fetching-data` | 15 | 12.08 | 14.08 |
| `handling-http-errors-and-problemdetail-responses` | 13 | 11.06 | 12.56 |
| `fixing-cors-spring-security-config-vs-vite-dev-proxy` | 11 | 8.6 | 10.1 |
| `cookies-vs-localstorage-where-tokens-should-live` | 8 | 5.96 | 6.96 |
| `calling-your-spring-boot-api-from-the-browser` | 14 | 11.99 | 13.49 |
| `environment-settings-for-the-api-address` | 11 | 8.94 | 10.44 |
| `testing-a-plain-function-with-vitest` | 14 | 11.42 | 13.42 |
