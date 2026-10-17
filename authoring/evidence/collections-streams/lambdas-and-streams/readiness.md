# Lambdas and Streams correction readiness receipt

Author correction evidence, checked 2026-10-16 against the bytes listed in section 3. It responds to the independent education review that rejected `8145560`. It is not critic or reconciliation evidence, and it does not claim education or Java/Streams-SME approval.

## 1. Catalog, scope and review findings

All six authoritative `topic.json` objective sets are rendered verbatim in each page's always-visible Goals list (`data-pep-objectives`). Only this module's learner pages, their Markdown companions, their `topic.json` metadata and this module's evidence changed; shared tooling, validators, the estimator and other modules are untouched.

| Review finding | Correction |
|---|---|
| Blocker 1: comments satisfied token checks | Each editor now runs the learner's code in an offline Java-subset interpreter embedded in the page. The lexer drops comments, so a comment-only edit is the starter program and uses no attempt. Completion requires public behavior checks evaluated on the resulting program, plus code-shape rules read from the comment-free syntax tree (for example, `allowed` must call `and` and `negate` on `hasText`/`isBlocked` without a new lambda). |
| Blocker 2: missing objective practice | Lambdas: all four interfaces and `and`/`negate`/`andThen` in code, a graded functional-interface/annotation rule set, a captured-local compile-error fix and a "why" question. Streams/database: ResultSet loop plus a filter/map/sorted pipeline; graded laziness and stream-reuse predictions; SQL-versus-stream placement set. Grouping: `groupingBy` with `counting` and `mapping` in code, an empty-list rerun for Optional handling, duplicate-key policy question. Review: retrieval of collection, cost and equality rule; loop-to-pipeline and pipeline-to-loop in one editor; all four named bug classes. Timed: four-pattern discrimination; a learner-controlled 6-minute time box covering the plan and the code; a plan set restating input/output and edge cases; six executed normal and edge checks; a say-it-aloud, reveal and self-check complexity step. Method references keeps its content shape. |
| Blocker 3: evidence and companions | `artifact.md` derived for all six with `md-from-html.mjs`; `qa-paths.json` added (section 4); source receipts refreshed; module lock regenerated. |
| High 4: incomplete submissions used the retry | Missing answer, missing confidence, code that does not compile and comment-only edits consume no attempt. Only complete submissions count; the second complete wrong submission settles. |
| High 5: goals marked by activity index | Each goal maps to explicit checkpoints (page config `goals`), and shows done only when they pass. Predictions are recorded but never mark a goal. The timed Goal 2 additionally requires the passing Run to happen inside a running time box. |
| High 6: Problems/Output semantics | Native `role="tab"` buttons with `aria-selected`, `aria-controls`, roving `tabindex` and arrow/Home/End keys; labeled `role="tabpanel"` panels that become focusable only when they actually scroll; problems are buttons that move the caret to their line; a separate polite status line. |

## 2. Official sources and Java behavior

All 25 learner-linked source URLs (Java SE 25 API, JLS SE 25, dev.java, PostgreSQL 18) returned HTTP 200 on 2026-10-16 through `authoring/tools/net/check-links.mjs`; each `sources.json` names the sections used and binds the current artifact hash. Key claim text was confirmed in the live pages, including the `FunctionalInterface` rule on public `Object` methods and its required compiler error, the JLS 15.27.2 effectively-final rule and its concurrency rationale, the Stream single-use rule, HashSet constant-time and ArrayList linear-time statements, and the `Collectors.toMap` duplicate-key `IllegalStateException`.

The practice interpreter was checked against a local JDK 17 (javac/java) for the page-relevant behavior: HashMap/HashSet iteration order (including head insertion by `computeIfAbsent`/`merge`), `groupingBy`/`mapping`/`toMap`/`partitioningBy` output, stream laziness and `peek` ordering, the reuse message "stream has already been operated upon or closed", the duplicate-key message, Optional and double formatting, and the javac verdicts on the functional-interface items and the captured-local starter. Exception text that varies across JDK versions is worded as such instead of imitating JVM output. No JDK 25 was available, so Java SE 25 behavior is asserted from the official sources, and this remains listed as unverified in each `topic.json`.

## 3. Exact bytes

Every page carries the same module template blocks, derived from candidate `885207e034695aaf109ef0afe61fb1de50af9468` and the current root `DESIGN.md`; the bytes strictly between the markers are identical in all six pages:

- `pep:lambdas-streams-template-css v2`: 17,270 bytes, SHA-256 `4f3ac62f5e58367b2e868e79d32363bd3740160f845c77c517934995aed059ba`
- `pep:lambdas-streams-template-engine v2` (interpreter plus page engine): 157,992 bytes, SHA-256 `205d1d9b8338f698cc4a4f4a838085a6a6bada7f33e53762d6f5380d600743df`

| Topic | artifact.html SHA-256 | artifact.md SHA-256 | P50 / worst / budget (min) |
|---|---|---|---|
| lambdas-and-functional-interfaces-in-depth | `fbd28e5d7f9a3bee450419c9decc91b05c204969b117b2bf7f86109f59d62cad` | `1415d11dd9bc2805d050d5f650ba9cd897d02aa6703c603ed5ff9cd1d4980fac` | 11.52 / 14.19 / 15 |
| method-references | `595788b1cb50dac2c15072178e50a2c82613a90612831d482a335ab91854a0dc` | `2b647ed4c49db29d2191c7ae71265c4b3a64cb4c86448f369e4c2188502d6985` | 6.48 / 7.81 / 8 |
| streams-over-data-loaded-from-the-database | `ea846f59dfe7fa9d5a50919a77c392a494a470f00ec7e2168d2c8cf53a55442f` | `0fdf319c74215a4b9cf69ec448d4263fbaa0fedf8dc77ecf833b12483afbac17` | 12.09 / 14.92 / 15 |
| grouping-with-streams-and-optional | `dd9dd921c912c132407b2fa3ab67ea4cab482cf38ec9acda577af39df6ba5496` | `b11d4f31c734ee7374d8333aeaec05d9d2eef099ffd72e37be5521e6c33d20c3` | 8.00 / 10.08 / 11 |
| collections-and-streams-review | `2135ae43913c1ed221ca1df4aba891f9b79d91567990bba8026a5a4a7e5cd632` | `e3ae79cd54b339c621881cf68f028e6fcc0746504d3f1028b0be3e70a67df08a` | 11.71 / 13.79 / 14 |
| timed-coding-screen-patterns | `1923a389b9007c4d94ee82591b00b2e0f9071a855fddb14196cd42795435e944` | `2b352df3507120309ed912bce237100d64cb50a84a07308316d3e9cb26cd2614` | 12.10 / 14.85 / 15 |

Minutes come from the frozen estimator unchanged. Code editors use `data-interaction="terminal"` with `data-steps` for their modeled edit-and-Run cycles, the estimator category already used by repository code workspaces; this removes the former `KeyError: 'code'` without changing tooling, and T14 now passes. Worst paths are modeled per graded unit in each `topic.json` `minutes.basis`.

## 4. Answer-safe QA paths and what is public versus private

Committed `qa-paths.json` files never pass a code checkpoint. Their three routes enter only complete programs that compile and fail at least one public check, so each code activity reaches its honest settled-not-passing state after two Runs; the completion assertion is `data-pep-route-settled="true"` and every route ends asserting `data-pep-complete="false"` and open goals. Formative multiple-choice and classification selections appear in the routes; the page itself prints every option's explanation, so they disclose nothing new. The routes also assert the retry rules: an empty submission uses no attempt, wrong then retry, wrong twice settles, and a comment-only or non-compiling Run uses no attempt. Simulator edges cover comment-only edits that contain every advertised token, compile errors, an unsupported construct, keyboard Problems/Output tab switching, and one page-specific Java behavior each (captured-local error, unchanged forwarding lambda, stream reuse, duplicate key, ConcurrentModificationException, nested-loop shape).

Passing routes were proven only from a private, uncommitted overlay kept outside the repository. No passing learner input, or any encoding, hash or log of one, appears in committed files. A private whole-document scan of all 51 module files (learner pages, Markdown, catalog, evidence) found no distinctive line of any passing solution and no answer-key, rubric, hidden-test or solution marker.

## 5. Direct actual-page proof (current bytes)

Repository harness, committed answer-safe paths, Playwright Chromium: T09 offline and no-JavaScript, T10 sandbox (`allow-scripts` only), T12 axe, light/dark contrast, keyboard route and reduced motion, T13 at 1366x768, 1366x681, 320x568, 390x844, 844x390, 768x1024 and the 200% zoom equivalent with touch taps and 44 px targets, and T18 Markdown parity all pass for all six pages. T14 timing and T15 sources pass. T01-T08, T16, T17, T19, T20 and T24 pass.

Private overlay through the same harness (passing routes; overlay removed and committed paths restored byte-identical afterwards): T10 sandbox, T12 (including the full keyboard route with visible focus) and T13 all seven contexts pass for all six pages, each ending with `data-pep-complete="true"` and every goal done on the success and wrong-first routes; T11 reaches the same optional-disclosure step described in section 6 and fails there only.

Private direct proof (Chrome 155, 84/84 checks): passing success and wrong-first routes end complete with every goal done, and wrong-twice ends settled with goals open; opening every anecdote and hint inside its own activity leaves required state unchanged; Previous keeps the edited code, browser back and forward follow activities, and Restart clears only the current activity (all its checkpoints) while earlier credit and unlocks stay; no horizontal overflow across the full passing route under forced colors at 390, dark at 320, the 683 px 200% zoom equivalent, 768 and 1366; print opens every disclosure, shows every activity and result panel in the light palette, then restores state; without JavaScript every activity and every option explanation is visible at 320 px; offline `file://` makes one request (the page); page bytes use no storage, network, eval or logging API.

## 6. Remaining blockers and mismatches

- T11 fails on all six pages at one step only: main's harness opens every `details[data-pep-optional]` at page load, but each anecdote sits in its own activity, which the frozen navigation keeps hidden until the learner reaches it. The rest of T11 passes (all three routes, every simulator edge, restart without duplicate credit). The guidance-contract candidate `885207e` harness navigates to the owning activity first. The direct proof above opens each disclosure in its activity and shows no required-state change. This is a tooling-only mismatch; no validator was changed.
- T25 requires current education and Java/Streams-SME critic coverage of these bytes; independent reviews are pending, and this receipt does not provide them.
- `artifact.pdf` (method-references is a Reading topic), `artifact.gift` and video companions remain absent with reasons in `topic.json`.

Hard blockers found on the actual pages: none.
