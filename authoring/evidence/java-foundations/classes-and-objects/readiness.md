# Readiness receipt: java-foundations/classes-and-objects (author checkpoint)

Author-side evidence for the nine canonical learner HTML pages of this module.
It is not critic or reconciliation evidence. The independent education and Java-SME reviews, their rechecks and the non-author reconciliation are recorded separately in each topic's `critic-*.json`, `*-critic-*-recheck.json` and `reconciliation.json` (section 8).

## 1. Scope and objectives

- Catalog `module.json` `topicOrder` lists ten entries; `classes-in-practice-project` has `kind: lab-brief` and is excluded from the learner-page count. The nine learner topics below each have one `artifact.html` in the single canonical tree (no Standard/Fast copies).
- Each page's Objectives disclosure lists its `topic.json` objectives verbatim (three per topic). No objective was added, dropped or reworded.
- Companions: `artifact.md` is present because gate T18 requires it for every HTML topic; it is derived by `authoring/tools/qa/md-from-html.mjs` from the page, never hand-edited. Each topic also has a formative practice quiz, `artifact.gift`, added after inbox 013 (section 7). Video and PDF companions are absent with recorded reasons in each `topic.json`.

| Topic | Kind | Objectives | Activities | P50 / worst path / budget (min) | Page sha256 (prefix) |
| --- | --- | --- | --- | --- | --- |
| `access-modifiers` | core | 3 | predict → lanes → code → mcq | 7.77 / 14.35 / 15 | `3dd05714e10a8d77` |
| `classes-and-objects` | core | 3 | predict → lanes → code → mcq | 8.32 / 14.65 / 15 | `6d3e91bdcc3f7b64` |
| `constructors` | core | 3 | predict → lanes → code → mcq | 8.6 / 14.93 / 15 | `0cf715fe375c50db` |
| `double-equals-vs-equals` | core | 3 | predict → lanes → code → mcq | 8.24 / 14.57 / 15 | `0a4d07b90f54c928` |
| `encapsulation-with-getters-and-setters` | core | 3 | predict → lanes → code → mcq | 7.81 / 14.14 / 15 | `207160429157f800` |
| `enums` | core | 3 | predict → lanes → code → mcq | 9.15 / 14.98 / 15 | `d1ef5c984baf178c` |
| `final-and-tostring` | reading | 3 | predict → lanes → code → mcq | 7.95 / 14.78 / 15 | `ac7082334bd73fd3` |
| `stack-vs-heap-and-object-references` | core | 3 | predict → lanes → mselect → mcq | 10.1 / 14.18 / 15 | `5ea5142002d89244` |
| `string-immutability` | core | 3 | predict → lanes → code → mcq | 7.58 / 14.16 / 15 | `d9c0024afac1f183` |

## 2. Template and engine provenance

- Design source: root `DESIGN.md` and the guidance contract in candidate `885207e034695aaf109ef0afe61fb1de50af9468` (topic bar with Objectives disclosure and Restart, reversible Previous/Next with locked future steps, activity checks, nested progressive hints, Where this fits, optional Anecdote and Challenge, bounded editor workspace). No shared tooling, schema or component was changed.
- Every page embeds the same shell bytes, so the shell is proven once and reused by hash:
  - shell CSS sha256 `e0b5f8468df825fef495f0d1d5b542aef95aeaaff27b2d9595a4939d629b7756`
  - activity engine JS sha256 `5d29553905393d11c3074bf121d0c3f8e480e77ba18245ec303d12b5aa025c65`
- Page-specific bytes are the activity HTML and the `window.PEP_PAGE` data block (options, explanations, lane items and per-task structural checks).
- `data-pep-guidance-contract` is set on each page. Each `qa-paths.json` carries the landed contract's `guidance` object (main `b80bbc4`): `activityNavigation`, `activityNavigationKeyboard` and `activityNavigationTouch` replay the existing wrong-twice route through Activity 2, press Next, then make one checked, incomplete attempt on Activity 3 (an unchanged-starter comment fill for code tasks, one wrong choice for the multi-select). `objectives` and `objectivesTouch` open the disclosure and close it with Escape or an outside tap, and `hints` is `true`. Existing routes are byte-preserved and no guidance action carries solution text.

## 3. Sources

- Each topic's `authoring/evidence/java-foundations/classes-and-objects/<topic>/sources.json` was produced by `authoring/tools/net/check-links.mjs`: every source returned HTTP 200, and the receipt binds the current page bytes.
- Sources are the Java SE 25 JLS and JVMS, the Java SE 25 API (Object, String, StringBuilder, Enum, IllegalArgumentException) and dev.java tutorials.
- The riskiest claims were re-read in the live text on 2026-10-16: default constructor and its access (JLS 8.8.9); enum constructors may not be public or protected (8.9.2); non-enhanced switch statements need not be exhaustive (14.11.2); identical string literals refer to the same instance (3.10.5); reachability (12.6.1); the `Object.toString` form; `String.trim` returning this string when nothing is removed.
- `freshness.status` stays `unverified`, with the pending SME review listed as the unverified item.

## 4. Direct artifact proof (headless Chrome, `file://`, network blocked)

For all nine pages:

- Full route with correct answers (code tasks solved with private solutions held only in scratch, never committed): every activity completes with credit 1, graded activities score grade 1 (the Activity 1 prediction is recorded with credit 1 and is never graded), the page completes, and there are no console or page errors and no network or sibling-file requests.
- Full wrong-twice route: every activity settles with Continue available, but each failed activity stays `data-pep-completed=false` with credit 0 and grade 0, `#lesson` reports `data-pep-route-settled=true` and `data-pep-complete=false`, and the page says it is not complete. The committed success and wrong-first routes settle the code activity the same way (no solution is committed), so they also end with the page not complete.
- Restart resets only the current activity's credit and keeps earlier credit and the unlocked frontier; page completion, route settlement and the end-of-topic message are then recomputed from the activities, so a completed topic that is restarted and then failed is no longer complete. Timeline link then browser Back restore activity state without resets. A deep link to a locked `#activity-3` lands on activity 1.
- No horizontal overflow at 320, 390, 768 and 1280 px for every activity, nor at 640 px with device scale 2 (200% zoom equivalent), in dark and forced-colors modes.
- Keyboard: radios, confidence and Check operate from the keyboard; focus moves to feedback after a check and to the next heading after Next; Objectives opens with Enter and closes with Escape.
- Touch at 390 px: tap completes Activity 1. Source-list links were under 44 px and were raised to 44 px targets in the shared shell.
- Recap: with JavaScript it is hidden on load and appears only once every activity has settled (and hides again after a Restart); without JavaScript and in print it is always shown.
- Print: all four activities and the recap render, every disclosure expands, navigation hides, and `afterprint` restores the closed state.
- JavaScript disabled: all four activities, each activity's expected-results reading and the recap render.
- The estimator (`authoring/tools/timing/estimate_reading.py`) gives P50 7.58 to 10.1 min. The worst path is modeled in each `topic.json` basis. Day totals: F9 = 60 and F11 = 75 of 120 minutes.

## 5. Answer safety

- Coding tasks check structure (declarations, modifiers, statement shapes) against the topic's own criteria, using token tests. No completed solution exists in any learner-visible HTML, JavaScript, no-JS reading, hint, cheat sheet or QA JSON.
- A whole-document scan of the raw and entity-decoded bytes of every page for the private solutions' key statements found no hits. One earlier draft hit, cheat-sheet rows that restated Activity 3 answers, was fixed before this checkpoint.
- After the inbox 007 corrections, the same scan of the two changed editor pages finds only teaching-pattern residue: `String label() {` and `return switch (this) {` from the enums `Planet` example, and `void setTarget(int t) {`, which is a substring of the access-modifiers starter's own `private void setTarget(int t) {`. No enum case list or set of access levels from a solution appears.
- The committed QA routes finish the code activities only through the settle path (two checked, incomplete tries), which now leaves them incomplete with no credit or grade. They contain no solution text.
- Formative MCQ and lane answers appear in explanations and no-JS readings, as the repository contract allows for low-stakes practice.

## 6. Status and hard blockers

- Hard blockers found and fixed before checkpoint: the answer exposure through cheat sheets; and a code check that counted an unchanged starter as a try (it no longer does).
- Correction after checkpoint `ff961d7` (firstmate inbox 003): T13 reported `ed-3` clipped on access-modifiers (desktop) and classes-and-objects (phone-320). Cause: the editor's line-number gutter grew past the textarea's height cap (400 px, or 240 px on narrow screens), so the code region scrolled and moved the textarea outside its box. The shared shell now caps the gutter at the same height, hides its overflow and keeps it scrolled in step with the textarea. Only those shell CSS and JS lines changed; page content, `artifact.md`, timing and QA routes are byte-identical to the checkpoint.
- Correction after the education review (firstmate inbox 007, integrated with the inbox 008 guidance evidence): three pages now practise their whole objective on the required path, within their existing 15, 14 and 15 minute labels.
  - `enums`: Activity 3 adds comment 5, a `String label()` method returning an exhaustive `switch (this)` with no `default`, checked by two new structural checks (eight in all). The `Planet` example shows the pattern, one Activity 2 lane item (`setLevel(LEVEL_HIGH)`) was removed to rebalance time, and the optional challenge is now the fifth-constant compiler test.
  - `stack-vs-heap-and-object-references`: Activity 2 is now a memory-diagram completion for a six-statement `main`. Its three button targets are Frame of main (stack), Box 1 (heap) and Box 2 (heap). Six items place a local value, a reference variable, two fields and two reference arrows. Every wrong target has its own feedback, the controls are buttons (no drag-only path), and the no-JS reading lists every placement.
  - `access-modifiers`: Activity 3 is now `Thermostat.java` with `public class Thermostat` and every member starting `private`. Supplied context (`Room` in the package, `Dashboard` in another package, a subclass in another package, no subclass syntax shown) requires package access on `setTarget`, `public` on `reading`, `protected` on field `offset`, and `private` on `target`, `current` and `clamp`; there are six checks.
  - The other six learner pages are byte-identical to `41d4d4c`, and shell CSS and engine JS are the same bytes on all nine pages. QA lane routes for `enums` and `stack-vs-heap-and-object-references` were updated to the new items; all other routes are byte-preserved.
- Regression check after firstmate inbox 011 (settled versus success): confirmed on all nine pages. On the committed wrong-twice route, each failed activity ended `settled=true`, `continue=true`, `completed=true`, `credit=1`, `grade=0`, and the page reported complete. The shared engine's `complete()` now completes an activity and awards credit only for a passing result (correct, correct on retry, or a recorded prediction); a settled miss keeps Continue but stays incomplete with credit 0 and grade 0. Inputs lock on `settled` rather than `completed`, progress counts settled activities, page completion (`data-pep-complete`) requires every activity completed, and the new `data-pep-route-settled` hook marks that every activity is answered. Each `qa-paths.json` now names `data-pep-route-settled` as its route-end completion postcondition, asserts settled, completed=false, credit 0, grade 0 and Continue for every settled miss, and ends each route with credit and page-completion assertions. Activity content, timing and `artifact.md` are unchanged; only the engine lines (including the end-of-topic message), the `#lesson` attribute and QA routes changed.
- Consolidated correction after the independent education and Java-SME reviews of `d40a74f` and `238f665` (firstmate inboxes 015 and 016). Old reviewed bytes were proven to fail first: on all nine `238f665` pages the recap was visible on load, and a completed topic restarted and failed twice stayed `data-pep-complete=true` with "Topic complete."
  - Shared engine and shell, byte-identical on all nine pages: the recap (EDU-ENG-02) and Restart recomputation (EDU-ENG-01 / CO-SME-01) above; a print rule that shows the recap; a bounded top-level statement splitter (`J.top`) for checks; and a way for a page check to report a valid shape it does not check as not supported, which never counts as a try.
  - `encapsulation-with-getters-and-setters` (CO-SME-02/03): the throw check refuses a bad-value test joined with `&&`, a throw outside any if and a test whose branch does not throw, and accepts an in-range test joined with `&&` that stores in its then branch and throws in its else branch. The objective and task text are unchanged.
  - `classes-and-objects` (CO-SME-04): `isLong()` must return the comparison, or return true when it holds and false otherwise; an inverted pair is refused.
  - `access-modifiers` (CO-SME-06, EDU-AM-01): adding `final` or `static` to a `Thermostat` member is refused because the task changes only access modifiers; the "Every" capital after a comma is fixed.
  - `string-immutability` (CO-SME-07): the builder's `toString()` must be returned by its own statement after the loop, and reassigning any `String` local inside the loop is refused.
  - `constructors` (CO-SME-05): the teaching line, task and recap now say the task checks a body that starts with `this(...)` and that Java 25 permits a restricted prologue that cannot use the object being built; a prologue that does not use the object is reported as not supported and is not a try, while one that uses `this` or a field is refused.
  - `final-and-tostring` (EDU-FT-01 / CO-SME-08): Activity 2 has an eighth lane item, overriding a `final` method; its no-JS reading, item count and worst path are updated.
  - `stack-vs-heap-and-object-references` (EDU-SVH-01): Activity 2 begins with a paper sketch of the frame, the objects and the arrows before the placements, keeping the "Draw" objective; the page's time label moves from 14 to 15 minutes.
  - New QA edges, all value-free: on every page the recap is hidden on load, shown after the wrong-twice route and hidden again after Restart with route settlement cleared; on `stack-vs-heap-and-object-references` a completed topic that is restarted and failed is no longer complete; and partial, non-solution code shows the new refusals or the not-supported report. Every new edge fails on the old `238f665` bytes. The source-owned private proof (private solutions and positive or near-complete witnesses, kept in scratch and never printed) passes on these bytes; on the old bytes the reviewers' bypasses passed and the valid inverse guard and Java 25 prologue failed.
  - The nine GIFT banks are byte-identical to `238f665`. Deferred by firstmate decision: EDU-GIFT-01, EDU-GIFT-SI-01, CO-SME-10, EDU-ENG-03/04, EDU-CO-01, EDU-TIME-01, CO-SME-09 and CO-SME-11.
- Narrow correction after the education and Java-SME rechecks of `bd531452` (firstmate inboxes 017 and 018). Only five pages changed; the shared engine, the stack-vs-heap, double-equals-vs-equals, final-and-tostring and enums pages and all nine GIFT banks are byte-identical to `bd531452`.
  - `encapsulation-with-getters-and-setters` (CO-SME-R1): the in-range if/else shortcut passes only when no earlier top-level statement stores the field.
  - `string-immutability` (CO-SME-R2): any return inside the `for` block is refused, even with another return after the loop.
  - `constructors` (CO-SME-R3): a Java 25 prologue that only checks arguments or assigns a field declared without an initializer, or another shape the checker cannot prove invalid, is reported as not supported and is not a try; a prologue that reads a field, or uses `this` other than to assign a field, is refused. The teaching line, recap, feedback and `artifact.md` state that rule, and the modeled P50 is 8.6 min with a 14.93 min worst path.
  - `classes-and-objects` (CO-SME-R4 with EDU-BD-01): recognised inverted `isLong()` forms are still refused; any other return shape, such as a boolean local or a flag, is reported as not supported and is not a try.
  - `access-modifiers` (CO-SME-R5): `final`, `abstract` or `static` on `Thermostat` itself is refused, alongside the member-level check.
  - Six new value-free QA edges, one or two per finding, pass on these bytes and fail on `bd531452`; their code fixtures stay far below a solution. The private proof (22 probes: private solutions plus positive, negative and not-supported witnesses, never printed) has no mismatch here and nine on `bd531452`, one per finding form; its script was deleted after the run.
  - Not taken, by firstmate decision: EDU-SVH-02 and EDU-FT-02 (on approved pages) and every earlier deferred finding.
- Final narrow correction after the delta rechecks of `1968d200` (firstmate inbox 019). Only two pages changed; every other learner file, the shared engine and all nine GIFT banks are byte-identical to `1968d200`.
  - `encapsulation-with-getters-and-setters` (CO-SME-R6): the in-range if/else shortcut also requires that its else branch does not store the value; a store there before the throw gets the existing "Store the value after the check" feedback.
  - `classes-and-objects` (CO-SME-R7): an `if` test in `isLong()` that contains a unary `!` is reported as not supported and is not a try, whichever way round it returns; direct, literal-if, local, flag and explicitly inverted return cases keep their reviewed results.
  - Two new value-free QA edges with incomplete fixtures pass on these bytes and fail on `1968d200`. The private proof (14 browser probes) has no mismatch here and three on `1968d200`. A runtime run of the accepted setter forms showed refused values leave the old field value unchanged, and the store-in-else form stores the refused value. It ran on JDK 17.0.12 because no JDK 25 is installed; the setter uses no Java 25 feature. The private staging and solutions were deleted after the proof.
  - Not taken, by firstmate decision: EDU-SI-02, EDU-AM-02, EDU-CO-02 and specialist notes N1 to N3.
- Open, owned by the next steps: the video and PDF companions, and the deferred optional findings listed in each topic's `reconciliation.json`.

## 7. Formative GIFT banks (firstmate inbox 013)

- Nine banks, one per topic at `java-foundations/classes-and-objects/<topic>/artifact.gift`, 54 items in all: six per topic, two for each of the topic's three objectives. They follow the structure of the existing `java-foundations/java-basics` banks: header comments, `$CATEGORY: java-foundations/classes-and-objects/<topic>`, titles that name the objective id, four options, exactly one correct answer, and feedback opening `Correct.` or `Not quite.` on every option.
- Items test retention with new examples rather than repeating the page's own predictions, checks or coding tasks; distractors come from the misconceptions each page teaches against.
- Each bank passes `authoring/tools/gift/validate.mjs` (ASCII only, GIFT escapes, no angle brackets) and gate T16, and each `topic.json` now records the GIFT companion as present. No platform-only key, rubric, hidden test, reference solution, private success input or lab content was added, and the learner HTML bytes are unchanged.

## 8. Independent review and reconciliation (firstmate inbox 020)

- Both independent final reviews approve exact checkpoint `e91fd7f90554a0db9e3837e05f716fafbd71e458`. Every learner byte (nine `artifact.html`, nine `artifact.md`, nine `artifact.gift`) is frozen at that checkpoint; this record and the review records change no learner byte.
- For each topic, the review records preserve every round bound to its exact bytes: the first education and Java-SME reviews at `238f665d` (`critic-education.json`, `critic-sme.json`), and the rechecks at `bd531452`, `1968d200` and `e91fd7f9` (`bd531-`, `r1968-` and `final-critic-*-recheck.json`). Each recheck lists the status of every earlier finding for that topic. The final rechecks bind the current page, Markdown and GIFT hashes, so approvals of unchanged bytes transfer by exact identity.
- Each topic's `reconciliation.json` was decided by firstmate as the non-author reconciler, from the decisions in steering inboxes 016 to 020. Every finding is accepted; fixed findings name the bytes they were fixed in, and the rest are recorded as deferred with their reason. That includes the education observations O-1 to O-3, EDU-SI-02, EDU-AM-02, EDU-CO-02, the earlier optional lows and the specialist notes, including NB-1.
- The specialist's final review ran the encapsulation runtime claims on JDK 25.0.5, which closes the gap left by the author's JDK 17 run.
- Publication ancestry audit: the nine branch commits after `b80bbc4` touch only this module's learner, catalog and evidence files, with no logs, screenshots, traces or Java sources. All 31 distinct code fixtures ever committed in QA routes score at most 3 of 5 checks against the current pages, so none is near complete. No local path, credential or private input appears in the branch history. All private staging used for the proofs has been deleted.

