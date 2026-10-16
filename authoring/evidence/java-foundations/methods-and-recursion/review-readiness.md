# Review readiness: java-foundations/methods-and-recursion

Author-side correction receipt, 2026-10-16. It routes review; it does not approve the work, replace education or Java-SME review, waive checks, or mark the module upload-safe.

## Scope

- `module.json` lists exactly nine canonical topics, and each has one `artifact.html` plus its required derived `artifact.md`.
- Correction scope is the nine pages and their directly owned catalog, source, QA, lock and readiness evidence.
- The rejected education checkpoint was `14d6e1ec2321e9fbfa68d7029cb89197aec28400`; the hashes below identify the corrected author candidate.

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | ---: | --- | --- | --- |
| Curriculum/objective coverage | 2 | All catalog objectives retain their original scope. Visible state-linked Goals map to the activity that establishes each objective. Author-local actual-page hard smokes passed for extraction, decomposition/refactoring, reversing/counting, all debugger step controls and recursion progress. | Independent education review has not assessed transfer or cognitive load on the corrected bytes. | Fresh education review required. |
| Official-source freshness | 1 | Every `sources.json` retains official URLs, title/section notes, objective ids, retrieval time and HTTP 200 evidence from 2026-10-16; T15 binds each receipt to the corrected HTML. | Java claims still need independent SME judgment; local differential evidence uses JDK 17.0.12 rather than JDK 25. | Fresh Java-SME review required. |
| Standalone/offline tests | 1 | T09 and T10 pass all nine actual `file://` pages, including offline/sandbox behavior and negative regressions for the reveal, two-pointer, recursion and AI-record bypasses. | Current-base T11 still opens optional disclosures in hidden future activities from a fresh page and times out; direct current-activity optional accounting is non-gating. | Landed harness correction or independent disposition of the known T11 mismatch. |
| Responsive/accessibility proof | 2 | T12 and T13 pass all nine pages: axe, contrast, focus, keyboard, forced colors, 320/390/768, landscape, touch targets and 200% zoom. Visible Goals are present at initial load and update from Open to Done only after their mapped activity completes. | Impeccable detector ran in degraded regex mode because its optional parser modules are unavailable; its remaining type-scale warning conflicts with the frozen DESIGN.md 13/14/16/20 px scale. | None beyond independent review. |
| Answer safety/private-material exclusion | 2 | T07 passes. Public `qa-paths.json` files contain negative inputs/regressions only; complete production-task success inputs, answer-derived hashes and private tests are absent. Wrong-twice explanation state remains incomplete with zero credit. | Machine checks do not prove semantic non-leakage. | Independent education and Java-SME review required. |
| Exact-byte identity | 1 | T06 passes and `module.lock.json` is regenerated. Corrected HTML hashes are listed below. | No critic evidence exists for these corrected exact bytes; any later byte change requires fresh role checks. | T25 correctly blocks until current education and SME evidence exists. |

Sum: **9/12**. Overall: **floor(9 / 12 × 100) = 75**. Route: **focused review**. Hard blockers force **review/rework** regardless of score.

## Validation evidence

Passed on the corrected scope:

- T01, T06–T10, T12–T15, T18–T20 and T24.
- Direct actual-page hard smokes at 390 and 768 CSS px for visible/state-linked Goals, no reveal control, wrong-twice zero-credit behavior, required debugger controls, and each newly observable production objective.
- Inline JavaScript parse check for all nine pages.

Expected holds:

- T11: current-base harness tries optional content in hidden future activities without first navigating/unlocking.
- T25: current education and Java-SME critic evidence intentionally does not yet exist.

## Corrected HTML identity

| Topic | SHA-256 |
| --- | --- |
| writing-methods | `150da6f024eb0e04fc8cceeed2c4333b868ea9f1331a3337b856732b5ef51112` |
| method-overloading | `38f9de81f3d613efa3d5bf8a42ab4471dd3510b4a5d9637fa583e86bdcf59c29` |
| static-members-and-methods | `bfe906257f9ea507ffc513b77e055aca1d8c22a590ed95d97166e497adbe69b0` |
| pass-by-value | `46f1227a9b885bbdd3960f33a81de6f611c60be657fda4b8a4cb6958bd30721f` |
| method-practice | `8824587bcfb26f8d2eae478f3734dbd42823643c5db43e9cd15a7f2efde5ee0f` |
| recursion-and-the-call-stack | `e95c3a2c16f4a6d94ece7fc422635605c78d9fbf3da3f5a36258f25cf2e8cc94` |
| two-pointers-reversing-and-counting | `eb013f159e64b3891cf4602f7a964c6f23c03890a02924c3bb364f938752e546` |
| debugging-with-breakpoints | `9c16e46e32882fc8d5296eece73c4144aa433fbe1c314377f8157e39a948a700` |
| ai-assistants-explain-not-answer | `38398938bd514a9054a6b402c354edf8ea0f3d09737ebfe7ab1b5cc87e0dc4f3` |

`module.lock.json` must be regenerated after this receipt so its evidence bindings cover these final bytes.
