# Review readiness: java-foundations/methods-and-recursion

Author-side correction receipt, 2026-10-16, for Java-SME findings SME-004 to SME-007 reported at `337b4079e07f3a438e90be8f86b3830c8aa0ac23`. It routes review; it does not approve the work, replace education or Java-SME review, waive checks, or mark the module upload-safe.

## Scope

- `module.json` still lists exactly nine canonical topics, each with one `artifact.html` and its required deterministic `artifact.md`. No catalog objective or module scope changed.
- Changed in this correction: `writing-methods` (SME-004, SME-005), `static-members-and-methods` (SME-006) and `method-practice` (SME-007), with their companions, timing fields and source receipts.
- Learner, catalog and topic-evidence bytes are unchanged from `337b407` for `method-overloading`, `pass-by-value`, `recursion-and-the-call-stack`, `two-pointers-reversing-and-counting`, `debugging-with-breakpoints` and `ai-assistants-explain-not-answer`, which hold education and Java approval.

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | ---: | --- | --- | --- |
| Curriculum/objective coverage | 2 | Writing Activity 2 now also requires a `static void` method with one `int` parameter that prints the extracted method's result for it, called by `main` exactly three times as statements with 2, 4 and 7; the non-void probe and exact Output 11/17/26 remain. Method-practice Activity 2 compares the `letterGrade` parameters and body AST with the starter, requires every `main` statement to print one literal-argument call (optionally concatenated with text labels), and checks each Output line against that call's probed result. Activity 3 structurally requires multiplication of the two parameters, a `> 10` decision, the only subtraction by 2 on that path, and six behavior probes including non-10 results. Private actual-page regressions reproduced each reported bypass on the prior bytes and reject it now; private valid routes complete with credit 1. | Independent reviewers have not assessed these bytes. The writing Goal text "Return a value from every path of a method" is catalog objective wording left unchanged by scope; the teaching, recap and companion now state the precise rule. | Education and Java-SME rechecks of the three changed pages. |
| Official-source freshness | 1 | The corrected non-void completion rule follows JLS SE 25 §8.4.7 (already cited on the page); the static feedback follows JLS SE 25 §8.4.3.2 and §12.1.4. Source receipts for the three changed pages were rebound to the current bytes without source changes; T15 passes. | The rebinding is an author attestation pending Java-SME judgment. | Java-SME recheck. |
| Standalone/offline tests | 2 | Module-scope T01, T06, T07, T08, T09, T10, T12, T13, T14, T15, T18, T20 and T24 pass on the final bytes. | T11 times out on the already-declared current-base harness mismatch (it clicks an optional disclosure in a hidden future activity); it is not reproduced as a learner-page defect. T25 holds pending critics. | None beyond review. |
| Responsive/accessibility proof | 2 | T12 and T13 pass on the exact bytes; the shared layout was not changed. | Automated checks do not replace a human screen-reader pass. | None beyond review. |
| Answer safety/private-material exclusion | 2 | T07 passes. Public QA declarations are unchanged and negative-only. New regressions, valid inputs and their outcomes stay private; nothing successful, encoded, hashed, obfuscated or logged was committed. The method-practice probe values derive from the public starter behavior. | Machine scanning cannot prove semantic non-leakage. | Independent review. |
| Exact-byte identity | 1 | Hashes below; the six approved pages verified byte-identical with `git diff`. Timing fields and the module lock were regenerated from the final bytes. | No critic evidence exists for the changed bytes. | T25 remains blocked until fresh education and Java-SME evidence exists. |

Sum: **10/12**. Overall: **floor(10 / 12 × 100) = 83**. Route: **focused review**. Hard blockers force **review/rework** regardless of score.

## Timing

The three changed topics were remeasured with the frozen `authoring/tools/timing/estimate_reading.py`; `modeledWorstPath` adds the documented 3.00 minutes. Method-practice success-criteria wording was kept short so its worst path stays within the ceiling.

| Topic | modeledP50 | modeledWorstPath | aboutLabel/budget |
| --- | ---: | ---: | ---: |
| writing-methods | 10.72 | 13.72 | 14 |
| static-members-and-methods | 11.97 | 14.97 | 15 |
| method-practice | 11.94 | 14.94 | 15 |

## Author evidence

- Private actual-page regressions (outcomes only), each accepted on `337b407` and now ending with completion false and credit 0 after two checks: a non-void refactor with no `void` method, and one with an unused `void` method (writing); discarded `letterGrade` results with unrelated printed lines, and a changed method body that keeps the original conditions only in a comment (method-practice Activity 2); a constant-returning method with an unrelated strict comparison, and a structurally similar method that returns a fixed value (method-practice Activity 3). A `void` route with a wrong quantity is also rejected.
- Earlier regressions still pass: wrong or reordered quantities (writing), wrong pairs (method-practice), and the static bypass, explanation and Restart routes. Private valid routes complete with credit 1 on all three pages, including a labelled method-practice test.
- Writing's optional challenge moved to the learner's own IDE (an `int` method that only throws), so optional work cannot alter the graded Output.
- Companions were regenerated with `authoring/tools/qa/md-from-html.mjs`; T18 passes.
- `git diff --check` passes.

## Corrected HTML identity

| Topic | SHA-256 | Status |
| --- | --- | --- |
| writing-methods | `139958275ad249ea5ce63fc1574afd8172d84214cd5c338959c3a99d51f6200b` | Corrected for SME-004 and SME-005 |
| method-overloading | `38f9de81f3d613efa3d5bf8a42ab4471dd3510b4a5d9637fa583e86bdcf59c29` | Frozen, education- and Java-approved |
| static-members-and-methods | `01f537f275cf0526d462a10c15b88d65e8f1132dd475997aad35a2fc1dfa920e` | Corrected for SME-006 |
| pass-by-value | `46f1227a9b885bbdd3960f33a81de6f611c60be657fda4b8a4cb6958bd30721f` | Frozen, education- and Java-approved |
| method-practice | `77853bcda5d487ebb28890d3e6cc1dea38d84fe348475227897f28e8f516f1ca` | Corrected for SME-007 |
| recursion-and-the-call-stack | `000a391ed8f54bf3e546926c03b7de5433ec9df9d16753dbfe0a486436f69ce5` | Frozen, education- and Java-approved |
| two-pointers-reversing-and-counting | `de928ce7396b8f19e8150bab0e26ac6e9ef4701f7d6d49a3990488bdb6c65bc8` | Frozen, education- and Java-approved |
| debugging-with-breakpoints | `4f3da9a9e89266e9c47354314389fb41bf6acc8313c9c638fd4fe4bfe8c67313` | Frozen, education- and Java-approved |
| ai-assistants-explain-not-answer | `1e76d7b22d7d56905e7f15c8f34c69c27dec93c6937bfab50e9abcc299675329` | Frozen, education- and Java-approved |

`module.lock.json` is regenerated after this receipt so its bindings cover the final candidate bytes.
