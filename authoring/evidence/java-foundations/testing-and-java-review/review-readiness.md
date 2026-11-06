# Review readiness: java-foundations/testing-and-java-review

Author-side receipt for the HTML-first module batch, written 2026-10-16 by the authoring session.
It routes review; it never approves the work, waives a gate, replaces education or Java/testing-SME review, or marks anything upload-safe.

## Scope

- Catalog: `authoring/catalog/java-foundations/testing-and-java-review/module.json` lists exactly six topics (curriculum F17 and F18); all six now have an `artifact.html`, and every page lists its three catalog objectives verbatim in the topic-bar Objectives disclosure.
- `artifact.md` is present for every topic only because base gate T18 requires it for any HTML topic; it was generated mechanically with `authoring/tools/qa/md-from-html.mjs`. GIFT, video and the Reading-topic PDF are recorded absent with deferral reasons in each `topic.json`.
- Minute budgets: 11, 15, 13, 12 (F17 total 51) and 14, 11 (F18 total 25), each `ceil(max(estimator P50, modeled worst path))` and recorded in `topic.json`.

## Objective map

| Topic | o1 | o2 | o3 |
| --- | --- | --- | --- |
| junit-test-first | A2 editor: write a failing test, then implement `deposit` (red → green) | A1 predict + A2 arrange/act/assert check | A3 editor: `assertThrows` against read-only `Account` |
| test-doubles-fakes-and-stubs | A3 editor: finish an in-memory fake `UserStore` | A2 editor: write a `Clock` stub | A1 predict (real clock) + A4 mcq (interface injection) |
| mocking-with-mockito | A1 predict (unstubbed default) + A2 editor: `mock` and `when/thenReturn` | A2 editor: `verify` with arguments | A3 mcq with Where this fits (mock or fake) |
| code-coverage | A1 predict + A2 live coverage view (line and branch states) | A3 mcq (100% coverage with no assertion) | A2 editor: add tests until every branch is taken |
| java-review | A1 predict output (references, `equals`, loop, method, `int` division) | A2 request tracer (Javalin 7 route, handler, status 200/201/404) | A3 mcq (assertion and test double) |
| reading-older-java-code | A1 predict the release (`var` 10, switch expressions 14) | A2 editor: anonymous `Comparator` to lambda under an unchanged test | A3 mcq (JAXB removed in JDK 11) |

## Scores

| Component | Score | Evidence | Uncertainty | Hard blockers |
| --- | --- | --- | --- | --- |
| Curriculum and objective coverage | 2 | Every catalog objective maps to a graded activity (table above); `sources.json` lists objective ids per source. | Education review has not judged transfer, hint progression, cognitive load or whether the editor tasks are too guided. | None. |
| Official-source freshness | 1 | All six `sources.json` were fetched live on 2026-10-16 (28 sources, all HTTP 200) and bind the current HTML bytes; T15 passes. Key claims were re-read live: JUnit 6.1.3 user guide and `Assertions` Javadoc (`assertThrows` subtype rule and messages, test order), Mockito 5.24.0 Javadoc on javadoc.io, JaCoCo counters, Javalin 7.2.3 docs plus `HttpConfig.prefer405over404 = false` in Javalin source, JEPs 126/286/361/378/394/395, JDK 25 migration guide. | `site.mockito.org/javadoc/current` serves Mockito 2.2.7, so javadoc.io (linked from the Mockito site) is cited instead. The practice runner’s shortened JUnit/Mockito messages were not differential-tested against a real JUnit Platform run (listed unverified in `topic.json`). | None. |
| Standalone and offline tests | 1 | Base gates T01–T05, T07–T10, T14–T20 and T24 pass for the module, T09 and T10 through the repository harness with the committed answer-safe `qa-paths.json` (section below). T11 passes every route, simulator edge and restart/no-duplicate-credit on all six pages; code-coverage and java-review pass T11 in full. Scratch Playwright smoke on system Chrome 155: file:// with network blocked, zero console errors, success and wrong-twice routes complete every page, no-JS shows every activity and each code workspace’s `noscript` reading, print opens every disclosure and `afterprint` restores it, and a `sandbox="allow-scripts"` iframe runs without errors. | T11 fails on junit-test-first, test-doubles-fakes-and-stubs, mocking-with-mockito and reading-older-java-code at one step only: main's harness opens every `details[data-pep-optional]` at page load, but those anecdotes and challenges sit in activities 2 and 3, which the frozen navigation keeps hidden until reached. This is the tooling mismatch the lambdas-and-streams module also records; no validator or page was changed. | T11 optional-disclosure step on four pages (tooling mismatch). |
| Responsive and accessibility proof | 1 | Repository harness, committed paths: T12 (axe, keyboard route with visible focus, reduced motion, light/dark contrast) and T13 (seven contexts with touch taps and 44 px targets) pass for all six pages. Scratch smoke at 320×568 light, 390×844 dark, 768×1024 light and 683×384 dark (200% zoom of 1366×768) with touch: no page-level horizontal overflow and no action target under 44×44 in any activity. State checks on all six pages: locked timeline link and deep link do not move the frontier, Previous/Back keep inputs and attempts, focus lands on the activity heading, browser Back restores the activity, Restart clears only the current activity and keeps the frontier and earlier credit. | Forced-colors, CVD-transform contrast and the PR 43 guidance harness were not run. java-review's keyboard route reaches the tracer's closed `<select>` menus by type-ahead (`press` a letter, then `expectValue`) rather than the harness `select` action. The harness action presses Home and ArrowDown, and on macOS system Chrome (the local harness fallback) ArrowDown on a closed `<select>` leaves the value unchanged, while a typed letter changes it. Linux/CI Chromium behaviour for either method could not be established here: no Linux browser is available locally and containers are not allowed. | None known. |
| Answer safety and private-material exclusion | 1 | No keys, rubrics, hidden tests, reference solutions or secrets; T07 passes. Formative MCQ answers live only in page data and option explanations under the formative exception. Editor tasks are checked by stated, visible criteria; the page JavaScript contains checks, not finished code: a scan of all HTML and Markdown for the completed edits (`deposit` body, fake `save`/`exists` bodies, `when`/`verify` lines, the stub class, the comparator lambda, the `assertThrows` line) finds none. Settled editor activities explain what passing needs in words. | Hints and the “what passing needs” text are close to the edits by design; education and Java SME review must judge whether they cross into a worked answer. The coverage page’s A3 example test uses inputs that also cover A2’s branches (no assertions). The test-doubles A1 example no longer prints A2's assertion line; it now says only that its test expects the morning greeting. | None. |
| Exact-byte identity | 1 | Shared bytes are copied verbatim into pages (hashes below); `module.lock.json` regenerated at this checkpoint. | PR 43 guidance tooling is not landed on `main`; if its harness forces template changes, changed bytes need fresh role review. | No critic evidence exists yet (T25 fails by design until independent review). |

Sum 7 of 12. Overall floor(7 / 12 × 100) = **58**: hard blockers present, so the module routes to **review/rework with deep review**.

## Shared bytes

| Fragment | Source | sha256 | Pages |
| --- | --- | --- | --- |
| Page CSS (first `<style>`) | unchanged copy of the java-foundations methods-and-recursion module pages | 5b2447f3e123316c9535dcfaab49b0cbc5562934b9ca3faf6aaec924d226f3d0 | all six |
| Page engine (navigation, state, choice/form activities, Restart, print) | unchanged copy of the same pages | 127686c2eb7c1a3fcda3d5cefcb5937c69b9caf6bc62f16d8d9c48c0bc15ca95 | all six |
| Module add-on CSS (second `<style>`) | this module | 2aa1401a74a3c17f049d90d50854d5ca951bb1cd7a44f7a62f56f418d73aeca0 | all six |
| `PepTest` practice JUnit/Mockito runner | this module | 7bfb70b5a656bf53a123590d1244be11a830a13844e73607046fc87bd53f8925 | all except java-review |
| Practice JUnit editor binder | this module | 6ee4fb635b2f74ff209c735f4bedb75af67dfbcf20914ae3b060171bad84ff58 | all except java-review |

Only the topic markup and the first `<script>` (`window.PEP_PAGE` answers for formative MCQs, per-activity checks, runner configuration and, on java-review, the request tracer) differ per page.

## Checkpoint bytes

| Topic | artifact.html sha256 | bytes |
| --- | --- | --- |
| junit-test-first | 2cc5e8ff113c569d481fc610d599c70968b9cf450e0a31104ba679e09644c9fa | 184150 |
| test-doubles-fakes-and-stubs | 212b62b0b63a538904f84c516216461529932d928e99849d7a4839097d9b8b60 | 191433 |
| mocking-with-mockito | 738becd0e7199a2750267b254b45ab0d4bd193f069acdc0f0d743aa2ca2b1096 | 180561 |
| code-coverage | 42177cff145c2fb5fcff2868175fa3a7fd649e7af0dda49f14b9ad421cd7093a | 177829 |
| java-review | 579ee9e8018094fe6457fd4c70a1b7754250e5f9f5c2964cdbbaa1f25f7b3c07 | 91024 |
| reading-older-java-code | 2045ad2e81e666e974518796908ef76b6c1049710363ab0139130ce89a9a2d6f | 178861 |

## Answer-safe QA paths

Committed `qa-paths.json` (all six topics) never pass a code editor. Each editor input is a complete program that the practice runner compiles and that fails at least one public check: the starter plus a trivial extra test (for mocking-with-mockito, the starter with `Mailer mailer = null;` so it compiles). The success and wrong-first routes check two such programs and assert `Not yet`, then `Checked twice and settled, not complete yet`, `data-pep-grade="0"` and two attempts; wrong-twice checks the unchanged starter twice. Formative choice selections and the java-review tracer requests are public page content and do pass. The completion assertion is `#lesson[data-pep-complete="true"]`: in the frozen shared engine that means every activity is settled, not that every activity passed, so every route also asserts each editor's grade. Simulator edges cover the locked next activity, a compile error in Problems that uses no attempt, a `record` reported as *Not supported here* with no attempt, and a first non-passing Check that keeps the next activity locked.

Passing routes were proven only from a private overlay under gitignored `_work/qa-overlay/`, swapped into the evidence paths for one harness run and then restored. A `shasum -c` afterwards confirmed the committed paths are byte-identical to before. Overlay results: T10 passes for all six pages, and T12 (including the passing keyboard route) and T13 pass for the five editor pages; T11 fails only at the optional-disclosure step described above. After the corrections below, the overlay was re-run for java-review and test-doubles-fakes-and-stubs, with the same results, and the committed paths were again restored byte-identical. A scan of every committed module file (pages, Markdown, catalog, evidence, qa-paths) against the 21 distinctive lines of the private passing inputs finds none (33 files rescanned after the correction below).

Runner finding from the edges: a labeled `break` (legal Java) is reported as *Error … not a statement* instead of *Not supported here*, so the claim that *Error* is reserved for code javac rejects does not hold for labels. It needs a correction to the shared `PepTest` bytes, which this checkpoint did not change.

## Corrections after the QA checkpoint (20de588)

Only two learner files changed, and both were rebuilt from the module builder with exactly one line different from 20de588:

- java-review: the tracer's live region `#trace-status-2` was a visually hidden `.pep-sr` paragraph whose text T13 reported as clipped at every viewport. It is now a visible status line (`pep-code-label`, an existing add-on class) that reads, for example, *GET /books answered 404.* T13 passes, and the keyboard route asserts this text.
- test-doubles-fakes-and-stubs: the A1 code comment that printed A2's assertion now says *Its test expects the morning greeting.*

Shared CSS, the engine, `PepTest` and the editor binder are unchanged (hashes above). `artifact.md` was regenerated (test-doubles changed; java-review's Markdown was unaffected), and both `sources.json` were re-fetched (all HTTP 200) and bound to the new HTML. No workaround was added for the T11 hidden-disclosure harness mismatch or the `PepTest` labelled-break defect.

## Notes for reviewers

- The practice runner is an honest simulator of a stated subset (shown on each editor under “What this practice runner can and cannot do”): unsupported constructs show *Not supported here*, and *Error* is reserved for code javac or JUnit certainly rejects. It runs tests in source order and says JUnit does not promise an order.
- Mutation checks are stated in each activity’s checks: for example, junit-test-first re-runs the learner’s test with `deposit` emptied to prove it goes red; the fake check adds a stated second signup (“bo”) scenario.
- The code-coverage view marks statement lines and `if` branches; the page states that JaCoCo measures bytecode, so a real report may mark more lines.
- Editor activities use the engine’s `form` kind, so their success verdict reads “Record complete”, a fixed string in the shared engine bytes.
- Archify was not used; no diagrams are embedded.
