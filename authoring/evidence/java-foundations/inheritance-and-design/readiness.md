# Inheritance, Interfaces and Design: author readiness receipt

Author checkpoint, 2026-10-16. This receipt records author-side evidence only; it is not critic or reconciliation evidence.

## 1. Catalog and objectives

All nine `topicOrder` topics in `authoring/catalog/java-foundations/inheritance-and-design/module.json` have one `artifact.html`. Each page's Objectives disclosure lists its `topic.json` objectives verbatim; no topic, objective or syllabus row was added.

## 2. Sources

Each topic's `sources.json` is a live receipt (`node authoring/tools/net/check-links.mjs`), all 41 fetches HTTP 200, bound to the final HTML bytes.
Finding: the intake snapshot cites `https://dev.java/learn/language/oop/classes-objects/design-best-practices/` for composition, SOLID and factory guidance, but that URL is the nested/anonymous-class guide. It is not cited by these pages. The design guidance on composition, single responsibility, dependency inversion and singleton risk is listed as unverified in those topics' `freshness.unverifiedItems` and stated on the page as widely taught practice.

## 3. Learner pages and shared bytes

Every page uses the same `<style>` block, byte-identical to the proven collections-in-depth Sorting page built on candidate 885207e (block SHA-256 prefix `2cf22f1da1c975c6`), and one shared engine `<script>` (prefix `ded0a1a4a8f21b19`) with the `predict@1` and `mcq-with-confidence@1` component JS copied unchanged. Page-specific bytes are the body and the `#pep-data` JSON. Each page: predict, a bounded Java editor, a sort, a graded apply check with retry, Objectives, Where this fits, nested hints, a code-free anecdote, an optional challenge, recap, cheat sheet and sources.
`artifact.md` is derived by `authoring/tools/qa/md-from-html.mjs` because T18 requires it for every HTML topic. PDF, GIFT and video are recorded absent with reasons.

## 4. Direct proof (author run, not CI)

- Java editor honesty: 73 editor inputs across nine pages compiled and run on OpenJDK 25.0.4.1 (Temurin), compared with the page simulator; every case matched the real output or first compiler error, or was reported as not supported. Every predict, apply and sort claim with code was also compiled and run.
- Browser smoke on every page (system Chrome, Playwright): success and wrong-twice routes complete with one credit per activity and the expected grades; Previous, timeline, history Back, Restart of the current activity with replay credit; editor contents kept across navigation; locked activities refuse links and fragments; no horizontal overflow and 44 px targets at 320, 390 and 768 touch, 1280, 640 dark (200% zoom of 1280) and forced colors; no-JavaScript reading shows every activity with expected results; print expands and restores disclosures; `sandbox="allow-scripts"` iframe runs (activated through the DOM, not pointer); no non-file requests.
- Timing: `estimate_reading.py` P50 plus the modeled worst route sets budgets of 12 to 14 minutes, recorded in each `topic.json`.

## 5. Answer safety and privacy

Completed editor solutions were kept in uncommitted scratch staging only. A whole-document scan confirmed no page contains a complete success input. `qa-paths.json` settles each editor with starter runs and commits no solution. The simulator stores shape recognizers, not finished programs; MCQ keys are formative practice.

## 6. Status and blockers

- `npm ci` and `npm test` (248/248) pass. `npm run check` on main ran to completion. This checkpoint fixes two author-side failures: T24 (components `predict@1` and `mcq-with-confidence@1` now declared in each `topic.json`) and the T11 locked-timeline step (now a keyboard `press` of Enter, because the harness will not click an `aria-disabled` link). T14 reports no errors, so the raised budgets fit the day totals.
- Remaining T11 (9, one per page): main's optional-accounting step clicks every `details[data-pep-optional]` summary on a fresh page, but these pages place the anecdote and challenge inside activities that start hidden, as `DESIGN.md` lays out. Candidate 885207e's harness first walks the route and checks each disclosure in its own activity. Shared tooling was not changed; this clears when the guidance contract lands and `qa-paths.json` gains its `guidance` object.
- Remaining T25 (18): education and SME critic coverage, which belongs to the independent reviewers. Pending: independent education and Java-SME exact-byte review of all nine pages.
- No known hard blocker in answer exposure, accessibility, navigation, offline behavior or overflow.
