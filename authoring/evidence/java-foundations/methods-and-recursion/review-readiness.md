# Review readiness: java-foundations/methods-and-recursion

Author-side quarantine-correction receipt, 2026-10-16. It routes review; it does not approve the work, replace education or Java-SME review, waive checks, or mark the module upload-safe.

## Scope

- `module.json` still lists exactly nine canonical topics, each with one `artifact.html` and its required deterministic `artifact.md`.
- Correction scope is EDU-008 through EDU-011 on the five quarantined pages. The four individually education-approved pages remain byte-identical to reviewed commit `54f99bdd519aa22c35387bfe3648b8e56015e271`.
- No catalog objective or module scope changed.

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | ---: | --- | --- | --- |
| Curriculum/objective coverage | 2 | Actual-page checker smokes accepted one private valid route and rejected the reproduced behavior-changing extraction, behavior-changing refactor, no-swap reversal, wrong-direction/unrelated-state recursion, and incoherent AI-record routes. Writing/refactor checks execute the visible cases; two-pointer checks inspect a method-local indexed exchange and execute odd/even cases; recursion traces the parameter to its equality base; the AI record uses objective structured fields and explicitly disclaims prose-semantic validation. | Independent education review has not assessed the corrected bytes. | Fresh education re-review of the five corrected pages. |
| Official-source freshness | 1 | Existing official-source receipts remain bound to the unchanged claims; this correction changes practice observability, not sourced Java rules. | Java claims and checker constraints still need independent SME judgment. | Fresh Java-SME review. |
| Standalone/offline tests | 1 | T08 and T10 pass the corrected scope from actual standalone pages; T10 covers strict sandbox negative routes. T18 passes deterministic companions. | T09/no-JavaScript and T11 were not rerun after this quarantine correction. | Focused final validation after independent review. |
| Responsive/accessibility proof | 1 | The frozen shared layout was not changed; the AI replacement uses labeled native selects with 44 px minimum height. Prior T12/T13 evidence passed the same page shell. | T12/T13 do not yet bind the five corrected exact bytes. | Focused exact-byte accessibility/responsive rerun. |
| Answer safety/private-material exclusion | 2 | T07 passes. Public QA contains negative inputs only. Private successful inputs, derivatives, encodings, hashes, screenshots and logs are absent from committed files; the receipt records outcomes only. | Machine scanning cannot prove semantic non-leakage. | Independent education and Java-SME review. |
| Exact-byte identity | 1 | The corrected HTML hashes are listed below; the four approved pages match the re-review hashes byte-for-byte. The module lock is regenerated from this receipt and learner/catalog/evidence bytes. | No critic evidence exists for the corrected exact bytes. | T25 remains blocked until fresh education and SME evidence exists. |

Sum: **8/12**. Overall: **floor(8 / 12 × 100) = 66**. Route: **deep review**. Hard blockers force **review/rework** regardless of score.

## Focused author evidence

Passed on the quarantine-correction scope:

- T01 schema, T07 answer safety, T08 static HTML/JavaScript, T10 sandbox behavior, T14 timing and T18 deterministic Markdown.
- Direct execution in each actual page accepted a private valid route and rejected the relevant adversarial route; only boolean outcomes were retained.
- The two-pointer and AI-record T10 routes were rerun after their final checker/UI edits.
- `git diff --check` passes.

Not run in this bounded correction handoff: T09, T11-T13, T15, T19-T20, T24-T25 and the full repository suite. T25 is expected to hold pending fresh critics.

## Corrected HTML identity

| Topic | SHA-256 | Status |
| --- | --- | --- |
| writing-methods | `d88f48e37551b35fae5c30162702340a0900ff1d07ed369da6247ca93dc945d6` | Corrected for EDU-008 |
| method-overloading | `38f9de81f3d613efa3d5bf8a42ab4471dd3510b4a5d9637fa583e86bdcf59c29` | Frozen education-approved byte identity |
| static-members-and-methods | `bfe906257f9ea507ffc513b77e055aca1d8c22a590ed95d97166e497adbe69b0` | Frozen education-approved byte identity |
| pass-by-value | `46f1227a9b885bbdd3960f33a81de6f611c60be657fda4b8a4cb6958bd30721f` | Frozen education-approved byte identity |
| method-practice | `45bf2635a39bf1ae9b255501c534df7a2f0a737ae48e3478bed26f35102d7e5d` | Corrected for EDU-008 |
| recursion-and-the-call-stack | `b467c9830c2be28cfd20f51a7a556a29b56cf1790d4a79ac6aa05e6cd4234161` | Corrected for EDU-010 |
| two-pointers-reversing-and-counting | `de928ce7396b8f19e8150bab0e26ac6e9ef4701f7d6d49a3990488bdb6c65bc8` | Corrected for EDU-009 |
| debugging-with-breakpoints | `9c16e46e32882fc8d5296eece73c4144aa433fbe1c314377f8157e39a948a700` | Frozen education-approved byte identity |
| ai-assistants-explain-not-answer | `1e76d7b22d7d56905e7f15c8f34c69c27dec93c6937bfab50e9abcc299675329` | Corrected for EDU-011 |

`module.lock.json` is regenerated after this receipt so its bindings cover the final candidate bytes.
