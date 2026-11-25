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

## 2a. Landed-truth correction (2026-11-13)

Four defects were reproduced on the landed bytes of https://github.com/JesterCharles/pep-technology-content/pull/71 (`fa14427b`) and corrected on the five editor pages only. The shared runner is still byte-identical on those five pages. GIFT banks, teaching prose and `java-review` are unchanged.

- M3: three checker result lookups now match both owning class and method (`NamesTest.shorterNameComesFirst`, `NamesOrderCheck.checkerComparisons`, `FakeRemembersCheck.namesAreRemembered`). An identically named empty test in a decoy class now leaves each note *Missing*, with no credit.
- L8: section 2's line that `\u` escapes were reported as *Not supported here* was untrue inside comments. The runner now looks for any Java-eligible Unicode escape in the raw source (backslash preceded by an even number of backslashes, then `u+` and four hex digits). It runs that check before comments are skipped, tokens are compared or code runs, and reports any match as an unassessed limit. Ordinary comment and spacing no-ops and the non-eligible escaped-backslash case behave as before.
  - Known limit: an eligible `\u` that is not followed by four hex digits inside a comment, which javac rejects as an illegal escape, is not detected.
- L10: a literal `null` passed where every resolved candidate of that arity declares the same primitive parameter (same-class, instance, interface, static and constructor calls), and a literal `null` arithmetic operand (binary, compound or unary; `+` with a `String` stays legal), are now the javac errors. Lawful reference null, null comparisons and runtime unboxing are unchanged. An unresolved operand type next to `null +` is an unassessed limit. No overload inference was added.
- L9: the runner no longer claims that JUnit 6.1.3 would not run a private `@BeforeEach`. JUnit 6.1.3 runs the tests and warns that this will be disallowed in a future release. The JUnit User Guide still says lifecycle methods must not be private. The case stays unassessed with that wording.
- Confirmed against Temurin JDK 25.0.5+8 with the JUnit 6.1.3 jars on the neutral counterexamples and controls named in the landed-byte report:
  - ordinary, eligible and non-eligible comment escapes;
  - `sameCode` for comment, spacing, eligible and non-eligible edits;
  - the private `@BeforeEach` shape;
  - `take(null)`, `1 + null`, Map unboxing, reference null and a boxed local;
  - empty-decoy controls on reading-older A2 and test-doubles A3.

  The runner agreed with JDK 25 on every case; the boxed local stays a stated limit.
- Static-call follow-up (`23069408`): the independent Java/testing recheck of `bcdc35f6` found that a static call into a learner class (`Util.take(null)` with `static int take(int)`) still compiled, though javac 25 rejects it. The static-call branch now applies the same rule. JDK 25 controls agree on that case and on lawful static reference null. They also agree on a non-null static call and on the earlier L10 cases, which are unchanged. Because page bytes changed, the five proofs in section 4 were run again with new private inputs.

## 3. Checks on the final bytes

On the 2026-11-13 corrected bytes:

- A module-scoped `authoring/tools/qa/run.mjs` passes T09-T13 and T18 for all six topics.
- The node gates T01-T08, T14-T17, T19, T20, T24 and T25 report no error for this module.
- Repository-wide, the remaining errors are outside the module: T06 and T25 in python-fundamentals, and T17 video receipt age.

The 2026-11-08 record follows.

- Node gates: T01-T05, T06, T07, T14-T17, T19, T20 and T24 pass for the module, and T06 passes repository-wide.
- Browser gates: `authoring/tools/qa/run.mjs` passes T08, T09-T13 and T18 for all six topics in this task's own Playwright isolation.
- T25 needs the minimum-profile support from the inheritance-and-design module PR.
  Until that support is on the default branch, T25 reports missing critic coverage for these topics. `owner-essential-qa.json` is the record T25 will read once it is.

## 4. Private success proofs

These five topics opt in to `answerSafety.privateSuccessProof`: `junit-test-first`, `test-doubles-fakes-and-stubs`, `mocking-with-mockito`, `code-coverage` and `reading-older-java-code`.
They run in this sequence.
The section 2a correction changed every editor page, so the 2026-11-08 proof chain (`95d9b9b9` to `7c3ae965`) no longer binds current bytes. The first 2026-11-13 chain (`bc8c4089` to `dcfd8658`) is superseded too, by the static-call follow-up. The current five proofs were run on 2026-11-13 on the final bytes.
For each one, the owner wrote one new, captain-authorized private input file. It was distinct from every earlier input. It sat in task-owned staging outside the repository, with mode 0700 on the directory and 0600 on the file, and was read only through `PEP_QA_PRIVATE_INPUTS_FILE`. Three overlays ran against the clean commit.

| Topic | Proof commit P | Receipt commit R | All-fail overlay | Mixed overlay | Success |
| --- | --- | --- | --- | --- | --- |
| junit-test-first | 23069408 | 1dbe7037 | refused (task 1) | refused (task 2) | pass |
| test-doubles-fakes-and-stubs | 1dbe7037 | 5609ef83 | refused (task 1) | refused (task 2) | pass |
| mocking-with-mockito | 5609ef83 | b0f2bbc6 | refused | refused (pass withdrawn by a real edit) | pass |
| code-coverage | b0f2bbc6 | ddf52a72 | refused | refused (pass withdrawn by a real edit) | pass |
| reading-older-java-code | ddf52a72 | ec84dac0 | refused | refused (pass withdrawn by a real edit) | pass |

- The runner refused every all-fail and mixed overlay at its own declared-task-state postcondition. The overlays' page-level assertions had been loosened, so no earlier assertion stopped the run first.
- Each receipt commit R is the immediate child of its P and changes only that receipt. The module lock was regenerated once, after all five proofs, together with the value-free `sources.json` and `owner-essential-qa.json` HTML bindings.
- The public T09-T13 and T18 receipt content comes from one module-scoped run on `23069408`, whose learner bytes are identical through `ec84dac0`.
- After each success, staging was retired. No private value, resolved output or answer-derived hash is recorded in Git, receipts or this file.
- Committed QA paths contain only starter, malformed, unsupported and incomplete code.
