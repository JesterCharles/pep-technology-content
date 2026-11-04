# Readiness receipt: java-foundations/classes-and-objects (author checkpoint)

Author-side evidence for the nine canonical learner HTML pages of this module.
It is not critic or reconciliation evidence: independent education and Java-SME exact-byte reviews of all nine pages are still required, and no page is badged verified until they pass.

## 1. Scope and objectives

- Catalog `module.json` `topicOrder` lists ten entries; `classes-in-practice-project` has `kind: lab-brief` and is excluded from the learner-page count. The nine learner topics below each have one `artifact.html` in the single canonical tree (no Standard/Fast copies).
- Each page's Objectives disclosure lists its `topic.json` objectives verbatim (three per topic). No objective was added, dropped or reworded.
- Companions: `artifact.md` is present because gate T18 requires it for every HTML topic; it is derived by `authoring/tools/qa/md-from-html.mjs` from the page, never hand-edited. GIFT, video and PDF companions are absent with recorded reasons in each `topic.json` (HTML-first build).

| Topic | Kind | Objectives | Activities | P50 / worst path / budget (min) | Page sha256 (prefix) |
| --- | --- | --- | --- | --- | --- |
| `access-modifiers` | core | 3 | predict → lanes → code → mcq | 7.77 / 14.35 / 15 | `a2b28d36485d10cb` |
| `classes-and-objects` | core | 3 | predict → lanes → code → mcq | 8.32 / 14.65 / 15 | `799fbd2f98d3aa56` |
| `constructors` | core | 3 | predict → lanes → code → mcq | 8.42 / 14.75 / 15 | `3983814349c5b94f` |
| `double-equals-vs-equals` | core | 3 | predict → lanes → code → mcq | 8.24 / 14.57 / 15 | `8b6a7714042b2dd1` |
| `encapsulation-with-getters-and-setters` | core | 3 | predict → lanes → code → mcq | 7.81 / 14.14 / 15 | `2a5ce5613a59ce8f` |
| `enums` | core | 3 | predict → lanes → code → mcq | 9.15 / 14.98 / 15 | `16f66e5b7cb5003a` |
| `final-and-tostring` | reading | 3 | predict → lanes → code → mcq | 7.95 / 14.53 / 15 | `2c41a01fd7a99e43` |
| `stack-vs-heap-and-object-references` | core | 3 | predict → lanes → mselect → mcq | 9.85 / 13.93 / 14 | `f9e2a5a1af2ddec2` |
| `string-immutability` | core | 3 | predict → lanes → code → mcq | 7.58 / 14.16 / 15 | `00e4264db15995c8` |

## 2. Template and engine provenance

- Design source: root `DESIGN.md` and the guidance contract in candidate `885207e034695aaf109ef0afe61fb1de50af9468` (topic bar with Objectives disclosure and Restart, reversible Previous/Next with locked future steps, activity checks, nested progressive hints, Where this fits, optional Anecdote and Challenge, bounded editor workspace). No shared tooling, schema or component was changed.
- Every page embeds the same shell bytes, so the shell is proven once and reused by hash:
  - shell CSS sha256 `5e59bb286dc42fa465ac0d64972bae066e009af56b7b5edd129e6f122ca2c804`
  - activity engine JS sha256 `96e99ad12f5649bd51a0a1d79d5b8977f016dfdc7be0728f0e5da7b252704787`
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
- Restart on the last activity resets only that activity's credit; earlier credit and page completion are kept. Timeline link then browser Back restore activity state without resets. A deep link to a locked `#activity-3` lands on activity 1.
- No horizontal overflow at 320, 390, 768 and 1280 px for every activity, nor at 640 px with device scale 2 (200% zoom equivalent), in dark and forced-colors modes.
- Keyboard: radios, confidence and Check operate from the keyboard; focus moves to feedback after a check and to the next heading after Next; Objectives opens with Enter and closes with Escape.
- Touch at 390 px: tap completes Activity 1. Source-list links were under 44 px and were raised to 44 px targets in the shared shell.
- Print: all four activities render, every disclosure expands, navigation hides, and `afterprint` restores the closed state.
- JavaScript disabled: all four activities and each activity's expected-results reading render.
- The estimator (`authoring/tools/timing/estimate_reading.py`) gives P50 7.58 to 9.85 min. The worst path is modeled in each `topic.json` basis. Day totals: F9 = 60 and F11 = 74 of 120 minutes.

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
- Open, owned by the next steps: focused education re-review of the three corrected pages and independent Java-SME exact-byte review of all nine pages (T25 critic coverage is expected to fail until they land) and the GIFT, video and PDF companions.

