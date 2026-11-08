# Readiness: java-foundations/testing-and-java-review (minimum acceptance profile)

Implementation-owner record for the independent minimum batch on branch `fm/pep-minimum-testing-independent`, 2026-11-08.
Independent education and SME critic approval was not required and was not performed for these bytes.
No earlier critic review is claimed for them.

## 1. Provenance

- Topics (from `module.json` `topicOrder`): `junit-test-first`, `test-doubles-fakes-and-stubs`, `mocking-with-mockito`, `code-coverage`, `java-review`, `reading-older-java-code`.
- GIFT applicability: four core/reading topics carry `artifact.gift`. `java-review` and `reading-older-java-code` are review topics; their catalog records the GIFT as not applicable.
- Starting bytes: only the learner `artifact.html` and `artifact.gift` files of the committed canonical draft tree `9745761e` were materialized.
  Its history was not merged, cherry-picked or rebased.
  Its receipts, proof records, critic and reconciliation records, readiness records, generated Markdown and other evidence were not imported.
- Every other file in this module was produced fresh on this branch: catalog updates, `sources.json`, `qa-paths.json`, `artifact.md`, the `code-coverage` PDF, receipts and owner records.

## 2. Owner corrections

- Shared practice runner (byte-identical on the five editor pages), checked differentially against javac on JDK 17 and against the JUnit 6.1.3 and Mockito 5.23 jars:
  - `String.trim()` now follows Java's rule (strip characters up to U+0020), so NBSP and EM SPACE stay and control characters go.
  - `"a".startsWith(null)` now throws `NullPointerException`.
  - `double` values print as Java does, for example `1.0E7`, `1.0E-4` and `-0.0`.
  - Printing a `Map` with more than one entry now stops as *Not supported here*, because the runner does not model `HashMap` order. A stopped run is not assessed.
  - These rows already matched and were not changed: assertion failure messages, null unboxing, Mockito default answers, and `verify` failures for times, never and arguments.
    Casts, `\u` escapes, boxed locals and reference `==` are still reported as *Not supported here* and are not assessed.
- `java-review`: the two tracer `<select>` controls became native radio groups, and their touch targets are the full 44 px chips.
  This makes the keyboard route work on every platform. Trace logic, statuses and feedback are unchanged.
- `code-coverage`: the line-background nuance for an `if` whose decision went only one way is listed as unverified in `topic.json`.

## 3. Checks on the final bytes

- Node gates: T01-T05, T06, T07, T14-T17, T19, T20 and T24 pass for the module, and T06 passes repository-wide.
- Browser gates: `authoring/tools/qa/run.mjs` passes T08, T09-T13 and T18 for all six topics in this task's own Playwright isolation.
- T25 needs the minimum-profile support from the inheritance-and-design module PR.
  Until that support is on the default branch, T25 reports missing critic coverage for these topics. `owner-essential-qa.json` is the record T25 will read once it is.

## 4. Private success proofs

These five topics opt in to `answerSafety.privateSuccessProof`: `junit-test-first`, `test-doubles-fakes-and-stubs`, `mocking-with-mockito`, `code-coverage` and `reading-older-java-code`.
They run in this sequence.
For each one, the owner wrote fresh private inputs to staging with mode 0700, outside the repository, and ran three overlays against the clean commit.

| Topic | Proof commit P | Receipt commit R | All-fail overlay | Mixed overlay | Success |
| --- | --- | --- | --- | --- | --- |
| junit-test-first | 95d9b9b9 | f5d60a59 | refused (task 1) | refused (task 2) | pass |
| test-doubles-fakes-and-stubs | f5d60a59 | 16de57d5 | refused (task 1) | refused (task 2) | pass |
| mocking-with-mockito | 16de57d5 | b5e5802e | refused | refused (pass withdrawn by a real edit) | pass |
| code-coverage | b5e5802e | 10f993d1 | refused | refused (pass withdrawn by a real edit) | pass |
| reading-older-java-code | 10f993d1 | 7c3ae965 | refused | refused (pass withdrawn by a real edit) | pass |

- The runner refused every all-fail and mixed overlay at its own declared-task-state postcondition, even when the overlay's page-level assertions were loosened.
- Each receipt commit R is the immediate child of its P and changes only that receipt and the module lock.
- After each success, staging was retired. No private value, resolved output or answer-derived hash is recorded in Git, receipts or this file.
- Committed QA paths contain only starter, malformed, unsupported and incomplete code.
