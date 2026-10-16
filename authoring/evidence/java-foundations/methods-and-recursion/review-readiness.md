# Review readiness: java-foundations/methods-and-recursion

Author-side correction receipt, 2026-10-16, for the final education findings EDU-012 to EDU-015 reported at `de2d5bd18646ebe4f17f7a8d17e62d21fe55b14f`. It routes review; it does not approve the work, replace education or Java-SME review, waive checks, or mark the module upload-safe.

## Scope

- `module.json` still lists exactly nine canonical topics, each with one `artifact.html` and its required deterministic `artifact.md`. No catalog objective or module scope changed.
- Changed in this correction: `writing-methods` and `method-practice` (EDU-012), `recursion-and-the-call-stack` (EDU-013), `static-members-and-methods` (EDU-014) and the `debugging-with-breakpoints` timing receipt (EDU-015; learner bytes unchanged).
- Learner, catalog and topic-evidence bytes are unchanged for `method-overloading` and `pass-by-value` (education- and Java-approved) and for `two-pointers-reversing-and-counting` and `ai-assistants-explain-not-answer` (education-approved, pending Java review).

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | ---: | --- | --- | --- |
| Curriculum/objective coverage | 2 | Writing and method-practice keep their helper-level probes and now also require `main` to print exactly the documented calls (quantities 2, 4, 7; pairs (3, 4) then (5, 2)) and the exact starter Output sequence. Recursion requires the `n == 0` branch to start with its return and proves in the trace that this return is the next event of that frame, before any further call or other exit. Static keeps the SME-001/002 behavior. Private actual-page regressions reproduced each reported bypass on the prior bytes and reject it now; private valid routes complete with credit 1. | Independent reviewers have not assessed these bytes. | Focused education re-review of the five changed pages; Java-SME review of the seven changed pages. |
| Official-source freshness | 1 | No sourced Java rule changed in this correction. Source receipts for the four changed HTML pages were rebound to the current bytes without source changes; T15 passes. | The rebinding is an author attestation pending Java-SME judgment. | Java-SME review. |
| Standalone/offline tests | 2 | Module-scope T01, T06, T07, T08, T09, T10, T12, T13, T14, T15, T18, T20 and T24 pass on the final bytes. | T11 times out on the already-declared current-base harness mismatch (it clicks an optional disclosure in a hidden future activity); it is not reproduced as a learner-page defect. T25 holds pending critics. | None beyond review. |
| Responsive/accessibility proof | 2 | T12 and T13 pass on the exact bytes; the shared layout was not changed. | Automated checks do not replace a human screen-reader pass. | None beyond review. |
| Answer safety/private-material exclusion | 2 | T07 passes. Public QA declarations are unchanged and negative-only. New regressions, valid inputs and their outcomes stay private; nothing successful, encoded, hashed, obfuscated or logged was committed. | Machine scanning cannot prove semantic non-leakage. | Independent review. |
| Exact-byte identity | 1 | Hashes below; frozen pages verified byte-identical with `git diff`. Timing fields and the module lock were regenerated from the final bytes. | No critic evidence exists for the changed bytes. | T25 remains blocked until fresh education and Java-SME evidence exists. |

Sum: **10/12**. Overall: **floor(10 / 12 × 100) = 83**. Route: **focused review**. Hard blockers force **review/rework** regardless of score.

## Timing (EDU-014, EDU-015)

The static page's two explanation questions, task, success criteria and no-JavaScript reading were shortened (same objectives and checks) so its required path fits the 15-minute ceiling. All five changed topics were remeasured with the frozen `authoring/tools/timing/estimate_reading.py`; `modeledWorstPath` adds the documented 3.00 minutes.

| Topic | modeledP50 | modeledWorstPath | aboutLabel/budget |
| --- | ---: | ---: | ---: |
| writing-methods | 10.34 | 13.34 | 14 |
| static-members-and-methods | 11.94 | 14.94 | 15 |
| method-practice | 11.89 | 14.89 | 15 |
| recursion-and-the-call-stack | 11.62 | 14.62 | 15 |
| debugging-with-breakpoints | 11.91 | 14.91 | 15 |

## Author evidence

- Private actual-page regressions (outcomes only): correct helper with wrong or reordered quantities (writing), correct helper with wrong pairs (method-practice), a base return nested under an extra condition and a base return that throws inside a caught call (recursion) all end with completion false and credit 0 after two checks; they completed on the prior bytes. The earlier static and debugger regressions (ignored returns, hard-coded last line, unexecuted prints, wrong or missing explanations, one-press Step Over, inner breakpoint, no same-line pause after Step Out, Activity 2/3 completion, Restart clearing selects) still pass.
- Companions were regenerated with `authoring/tools/qa/md-from-html.mjs`; T18 passes.
- `git diff --check` passes.

## Corrected HTML identity

| Topic | SHA-256 | Status |
| --- | --- | --- |
| writing-methods | `fec2c41b712d12b507580159fad8a2bf7f0c0e8e397e39ebc5d803dfbd4579d1` | Corrected for EDU-012 |
| method-overloading | `38f9de81f3d613efa3d5bf8a42ab4471dd3510b4a5d9637fa583e86bdcf59c29` | Frozen education- and Java-approved |
| static-members-and-methods | `f41578974e0e77b59ad66f50e932515a8d75b83c9ecea694a5e453db65d0e30e` | Shortened for EDU-014; SME-001/002 behavior kept |
| pass-by-value | `46f1227a9b885bbdd3960f33a81de6f611c60be657fda4b8a4cb6958bd30721f` | Frozen education- and Java-approved |
| method-practice | `3238c467f5e3444897d51fc5268ce630d64ef7bd2138501077c98644731c51c1` | Corrected for EDU-012 |
| recursion-and-the-call-stack | `3ad6c6d01cfa5ce04d45d604dc2cd0cffca71f554b1aafa815b7ce95e0ce780e` | Corrected for EDU-013 |
| two-pointers-reversing-and-counting | `de928ce7396b8f19e8150bab0e26ac6e9ef4701f7d6d49a3990488bdb6c65bc8` | Frozen education-approved |
| debugging-with-breakpoints | `4f3da9a9e89266e9c47354314389fb41bf6acc8313c9c638fd4fe4bfe8c67313` | Learner bytes unchanged; timing receipt regenerated for EDU-015 |
| ai-assistants-explain-not-answer | `1e76d7b22d7d56905e7f15c8f34c69c27dec93c6937bfab50e9abcc299675329` | Frozen education-approved |

`module.lock.json` is regenerated after this receipt so its bindings cover the final candidate bytes.
