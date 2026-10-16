# Review readiness: java-foundations/methods-and-recursion

Author-side receipt for the HTML-first module batch, written 2026-10-16 by the authoring session.
It routes review; it never approves the work, waives a gate, replaces education or Java-SME review, or marks anything upload-safe.

## Scope

- Catalog: `authoring/catalog/java-foundations/methods-and-recursion/module.json` lists exactly nine topics; all nine have an `artifact.html` (each 12–15 minute budget, F6 total 59, F7 total 72, both under the 120-minute day).
- `artifact.md` is present for every topic only because base gate T18 requires it for any HTML topic; GIFT and video are recorded absent with reasons in each `topic.json`.
- All nine pages embed the same shared CSS, page engine and offline practice-Java interpreter bytes; only topic content differs.

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | --- | --- | --- | --- |
| Curriculum and objective coverage | 2 | Each topic’s three catalog objectives map to its graded activities (predict, write/trace, apply); source records list objective ids per source in `*/sources.json`. | Education review has not judged transfer, hint progression or cognitive load. | None. |
| Official-source freshness | 1 | Every `sources.json` was fetched live on 2026-10-16 with HTTP 200 and is bound to current HTML bytes (T15 passes). Key claims were re-read live (dev.java class members and argument passing, JLS SE 25 §12.1.4 including Java 25 instance `main`, JEP 512, JetBrains debugger pages, GitHub Copilot best practices). | Program outputs and javac messages were differential-tested against JDK 17.0.12 (104 programs, all matching except the intentionally unsupported `switch`), not JDK 25. The JDK 21+ `StringIndexOutOfBoundsException` message wording and JetBrains “Resume continues to the next breakpoint” are listed unverified in `topic.json`. | None. |
| Standalone and offline tests | 1 | Base gates T01–T05, T07, T08, T14, T15, T18, T19, T20 and T24 pass for the module. In a scratch copy carrying PR 43 head `3a8e8a0` tooling, T09 (file://, network blocked, no-JS reading, print) passes for all nine pages. | The PR 43 contract is not landed; the final T09–T13 proof must be rerun on the landed harness. | PR 43 not landed. |
| Responsive and accessibility proof | 1 | Same scratch copy: T10–T13 pass for all nine pages (sandbox, behavior, navigation/Restart state invariants, axe, contrast incl. CVD transforms, forced colors, 320/390/768/landscape/200% zoom, touch targets). | That pass needed three scratch-only harness accommodations, none applied to learner bytes: (1) the PR 43 head harness opens every hint and optional disclosure from a fresh load, so hints/challenges in still-locked later activities were dropped from the experiment build only; (2) its guidance-invariants step calls `fill` on the first input, a radio here; (3) the local fallback system Chrome 155 isolates sandboxed srcdoc iframes and drops input in their lower viewport, so the experiment launched it with `--disable-features=IsolateSandboxedIframes` (the pinned Playwright Chromium is not installed locally). Committed pages keep hints in every may-stall task. | PR 43 not landed; items (1)–(2) need the landed harness to traverse later activities as its contract text describes. |
| Answer safety and private-material exclusion | 1 | No keys, rubrics, hidden tests, reference solutions or secrets (T07 passes; manual scan clean). Formative MCQ answers appear in `qa-paths.json` and page data under the repository’s formative exception. Every code task is open-ended (learner chooses the method, values or rule) and is checked by visible structural and behavioral criteria; committed success inputs are example programs, not answers to a closed task. Settled code activities explain what a passing version needs in words, never in code. | A reviewer may still judge the committed example inputs for the recursion, two-pointer and test-writing tasks as too close to a worked answer; no Java answer-safety scanner exists (the PR 43 scanner is Python-only). | None. |
| Exact-byte identity | 1 | `module.lock.json` regenerated; artifact sha256 at this checkpoint is recorded below. | Integrating the landed PR 43 contract may change bytes, which would require fresh role reviews of the changed bytes. | No critic evidence exists yet (T25 fails by design until independent review). |

Sum 7 of 12. Overall floor(7 / 12 × 100) = **58**: hard blockers present, so the module routes to **review/rework with deep review**.

## Checkpoint bytes

| Topic | artifact.html sha256 |
| --- | --- |
| writing-methods | bdbbb31a6ddc9702d898f04166f39cb4303d13ba58af3bec7a617e698ddfd12a |
| method-overloading | b788dd6ea04edd6667046937aefc8aa49a8fcdd2050b4afcbda4811e9149cbfe |
| static-members-and-methods | 850b2b710b40d11e4d3b3b3cb9fd21080f581a031bb7bb8a3f4e727849a85bae |
| pass-by-value | 807ab4d94fec33bbe07ade284f32322c1e933e5d188c8d1793b0430dd1e7bda6 |
| method-practice | edc919e86b0ea6bae047d6fb0810e872df9a9ed9b29d59f103aeeccf36c35c95 |
| recursion-and-the-call-stack | fcf997dd695d90046947cfa5a694abd8c9246bb5e675e36028bfa5bbebddd698 |
| two-pointers-reversing-and-counting | c7bc8cfac55be2912c22bfd70f4cb242b9f4cfbf418cd2f2ddaeda1e522627ae |
| debugging-with-breakpoints | 0a50df9d0ab0aed4e4a24ad0f29b2484825136e021a4521d5729a7e094fea7e4 |
| ai-assistants-explain-not-answer | 64501fedc1affec553f19533e0330e22cd07207efe7d2abe7fd9de9a00673a0d |

## Notes for reviewers

- Archify was not used: it is not installed here, and the one diagram (the recursion call stack) is hand-authored inline SVG with a title, description and text caption.
- The practice editor and debugger are honest simulators of a stated Java subset: unsupported constructs show a “not supported in this practice editor” problem, and the simulated stack is capped at 600–1000 frames with a note that a real JVM is deeper.
- The AI-assistant page contacts no assistant; its assistant reply is a labelled sample written for the page.
