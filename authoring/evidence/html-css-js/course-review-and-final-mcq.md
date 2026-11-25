# HTML, CSS & JS: Course Review and final MCQ coverage

Recorded 2026-11-09 on branch `fm/pep-course-ending-html-css-js`, stacked on the labs/assessments candidate `fm/pep-laa-html-css-js` at commit 8c1c1fdd (firstmate decision hcj-base, option B; section Base and dependency).
This record covers the course-end structure, the two Course Review pages, the value-free coverage plan for the graded course MCQ and the state of its protected values.
It holds no item text, options, keyed responses, feedback, scoring, rubrics or solutions.
Independent review of the course-level files is recorded in this directory. The original reports are `course-final-critic-education.json` and `course-final-critic-sme.json`. Their rechecks are `course-final-critic-*-recheck.json` and `course-final-loop2-critic-*-recheck.json`. The non-author decisions are in `course-final-reconciliation.json`, `course-final-loop2-reconciliation.json`, `course-final-loop3-reconciliation.json`, `course-final-loop4-reconciliation.json` and later `course-final-loopN-reconciliation.json` files, with later rechecks in `course-final-loopN-critic-*-recheck.json`. The two pages have their own topic-level critic, recheck and reconciliation reports under `html-css-js-course-review/<topic>/`.

## Ownership

| Part | Owner | State |
|---|---|---|
| Course manifest `moduleOrder`, Course Review module and its two pages, blueprint objective list and instructions, value-free coverage map, MCQ column of `assessment-coverage-ledger.md` | Implementation owner of this branch (authoring agent; not an independent critic). Course owner: JesterCharles | Delivered on this branch |
| Graded MCQ item values (stems, options, keyed responses, feedback) | Implementation owner of a later task, through a private-authoring route the course owner approves | Not started; no protected value exists anywhere in this task (section Protected values) |
| Graded practical `html-css-js/assessments/web-client-practical` (90 minutes) | Labs/assessments candidate `fm/pep-laa-html-css-js` | Unchanged and not part of this record |

## Taught-topic inventory

Source: catalog `topicOrder` and `curriculum` pointers at 8c1c1fdd, read 2026-11-09, and `intake.md`.

| Module | Topics | Kinds |
|---|---|---|
| `html-and-css` | 7 | core |
| `javascript-fundamentals` | 7 | 6 core, 1 reading |
| `dom-tooling-and-async` | 8 | core |
| `fetch-and-browser-client` | 7 | core (3 of them are the S27 Project-day rows) |
| **Canonical baseline** | **29** | Part of the 243-topic canonical baseline; unchanged |
| New Course Review assets (not canonical) | 2 | `html-css-js-review-page-and-language`, `html-css-js-review-browser-client`; no curriculum pointer; add nothing to the 29 or the 243 |

All 29 canonical topics are teaching topics, and each maps to at least one planned final MCQ item (see `html-css-js-final-mcq-coverage.json`, `taughtTopics`).

## Mixed teaching/review modules

None. No HTML, CSS & JS module contains a review topic, and the intake records that the slice has no review row and no module check. So nothing is moved, regrouped or re-pathed. Both Course Review pages are new, and they follow the review shape of the Java Foundations review pages: cumulative scenarios, each joining topics, with hints, a recap and a cheat sheet.

## Course end structure

1. The four taught modules in calendar order: `html-and-css`, `javascript-fundamentals`, `dom-tooling-and-async`, `fetch-and-browser-client`.
2. The module `html-css-js-course-review`, whose learner title is exactly **Course Review**:
   - `html-css-js-review-page-and-language`, "Review scenarios: markup, layout and JavaScript values" (budget 14 minutes). Reviews `html-and-css` and `javascript-fundamentals`.
   - `html-css-js-review-browser-client`, "Review scenarios: DOM, async and the browser client" (budget 15 minutes). Reviews `dom-tooling-and-async` and `fetch-and-browser-client`.
3. The course-level graded MCQ `html-css-js/assessments/web-client-mcq` (listed in course.json `assessments`). Its id, day S27, kind, 30-minute duration and 70% pass mark are unchanged. Firstmate instruction 005 (2026-11-12, updated captain intent) set exactly 30 questions, so its item count is now 30. Under Firstmate decision 010 its public `weights` field is empty: per-module counts are verified on the private route. Its objective list and instructions follow the coverage plan below.
4. Separately, the graded practical `web-client-practical` (90 minutes), which is unchanged.

The Course Review pages are ungraded retrieval practice and carry no GIFT. There is no second exam.

## New Course Review assets (reported separately)

| Page | Activities | Topics joined | Answer verification |
|---|---|---|---|
| `html-css-js-review-page-and-language` | 3: fix a sign-up form (labels, input types, native button); predict a card's content-box width in a mobile-first grid and pick the fix; trace a map/object-spread copy, a reduce total and `==`/`===` | semantic structure, forms and validation, accessibility, box model, grid, responsive layout, arrow functions, map/reduce, spread, equality | Activity 3 output run on Node.js 24.2.0; Activity 2 widths measured in Chromium at 390 px by the SME critic |
| `html-css-js-review-browser-client` | 3: fix a delegated Like list that also renders visitor HTML; order the logs around an async function, a promise and a timer; handle a 400 problem details response, a proxy 502 and a network failure | DOM, events and delegation, XSS prevention, promises, async/await, event loop, fetch, problem details, calling the API, the API-address setting with the Vite proxy | Activity 2 order run on Node.js 24.2.0; Activity 1 behaviour checked in Chromium by the SME critic |

On both pages the recap and cheat sheet stay hidden until all three activities are done. They always show in print and without JavaScript.

## Final MCQ coverage

The plan is `html-css-js-final-mcq-coverage.json` (status `planned-value-free`, plan version 4). Version 3 (35 items) passed four course-final correction loops; version 4 reduces it to the 30 items `html-css-js-final-mcq-01` to `-30` and orders them easier to harder.

Answer roles are protected for every item (Firstmate decisions 009, 010 and 011, 2026-11-13). The committed files publish only the total question and time design, aggregate objective coverage and value-free aggregate review verdicts. Nothing committed records, or lets a reader reconstruct or narrow, which module, topic or objective an item keys, which objective a distractor isolates, an item's context, demand, depth, band, reading budget, notes or review findings, or per-module item counts. Per item, the plan records only an id and the format.

Everything else lives on the locked private question-bank and review route: each item's context, demand label, objectives and roles, the practice it was compared with, its depth, band, reading budget and step-up category, the per-module item counts, the per-item writer notes, item-level review findings, and the key-module and key-topic checks. The owner checked that private record on 2026-11-13. Each item elicits 2 to 4 objectives, no two items share a keyed objective, together they elicit exactly the 76 objectives listed, the per-module counts match the accepted design, and the id order follows the private difficulty plan. The private route will record this as "validated at <commit> by run <id>".

| Measure | Value |
|---|---|
| Items | 30 (12 trace, 11 debug, 7 apply), one keyed decision each, delivered easier to harder (`progressionRule`) |
| Objectives per item | 2 to 4: the key plus the distinct objectives its distractors isolate |
| Topics reached | 29 of 29 (`taughtTopics`) |
| Objectives elicited | 76 of 83 (per module: 20 / 20 / 20 / 16), equal to the blueprint's objective list, counted only where the key or a distractor depends on the objective alone (`elicitationRule`) |
| Objectives not elicited | `debugging-with-devtools-breakpoints#o1` and `#o3`, `project-setup-with-npm-and-vite#o1`, `scope-and-closures#o2`, `testing-a-plain-function-with-vitest#o1` and `#o2`: hands-on work in real tools. Vite scaffolding is evidenced by the S27 project and the graded practical. The two debugging objectives are evidenced by the debugging page's practice script and the dom-tooling-and-async mastery check; no lab or graded blueprint lists them. The closure objective is in the javascript-fundamentals lab and the graded practical, and the two Vitest objectives are in the fetch-and-browser-client lab and the graded practical. `responsive-mobile-first-layout#o2` (viewport meta) left the graded MCQ in the 30-item reduction and stays in the html-and-css lab, its topic's page activity and its practice quiz |
| Planned reading time | 1,118 seconds in total (about 37 seconds per item, at most 57), under 90% of the 1,800-second sitting |

The step-up rule (`difficultyRule`, `elicitationRule`, `itemConstraints`):
- Every item puts taught objectives into a new applied, debugging, browser-behaviour or accessibility context. It must not reuse, lightly reword or merely combine a topic GIFT question, a mastery-check item, a page activity or a Course Review activity.
- Each item asks for exactly one keyed decision on at most one short listing, within its private reading budget (never more than 6 lines).
- Items use only syntax, APIs and values taught on the published pages, including in their options; the item writer greps the learner artifact.html files for each one before keying.
- Each option's outcome is confirmed in Chromium or Node.js 24 before keying, with server responses stubbed as already-settled promises or a local server, or else against an official source.
- No trick questions: no key turns on an unusual reading of the stem, a typo, a double negative, an "all/none of the above" option or browser-version trivia, and every distractor is a plausible learner error on the objective it isolates.
- No busywork or padding: no two items share a keyed objective (checked on the private route) or a context type, and no item exists only to raise a module's count.
- The real item text is pilot-timed on the private authoring route, because timing cannot be measured value-free.

### 30-item reduction audit (2026-11-12)

Firstmate instruction 005 applies the updated captain intent: exactly 30 questions, complete taught-topic coverage, a useful easy-to-harder progression, productive implementation effort, and no trick questions, repetitive busywork, arbitrary padding or untaught prerequisites. No protected bank exists yet, so the audit covers the blueprint and this value-free plan; the private item writer applies the same rules to the bank.

- **Removed:** five repetitive second items from plan version 3, on topics other items still reach. The per-item reasons are kept on the private route.
- **Kept:** all 29 taught topics, every one of the candidate's 35 objectives, and all items whose step-up was set in the earlier correction loops.
- **Progression:** items run easier to harder; how difficulty is assigned is recorded on the private route, and pilot data there confirms real difficulty.
- **Untaught prerequisites and tricks:** item contexts were checked against the published pages in the earlier loops and again in loops 5 to 9, on the private route from loop 9. The no-trick and no-padding rules are explicit `itemConstraints`.
- **Formative topic quizzes** are treated separately: each `artifact.gift` practice quiz is a quick verification capped at five minutes, need not fill that cap, and has no fixed per-question duration (`formativeQuizRule`). This supersedes the intake's "about 30 seconds per question" planning note for the Concept-day Mini-quiz block; the intake itself is left unchanged because its bytes are bound to its closed intake reviews.

### Fast Track

The same MCQ is the final on both tracks. How the two tracks' teaching shapes the items is set and verified on the private route (`fastTrackPolicy`); the related open question for the captain is recorded there.

### Blueprint instructions

The blueprint `instructions` field is learner-facing: its purpose, 30 questions in 30 minutes, about one minute each with no per-question timer, the easier-to-harder step-up, one best answer, and the 70% pass mark. Closed-book use without AI assistants stays in `allowedResources`. The authoring statements live only in this record and in the coverage plan: one question can join several topics; items are limited to taught content; every production objective is also demonstrated through a lab task or the graded practical, so no production skill is assessed by multiple choice alone; and the plan's path is given here.

Crosswalk with the candidate's blueprint:

| | Before (8c1c1fdd) | After (this branch) |
|---|---|---|
| Items and time | 35 in 30 minutes | 30 in 30 minutes (Firstmate 005) |
| Item shape | one item per listed objective | one keyed decision per item; each item elicits 2 to 4 objectives through its key and distractors |
| Module weights | published per module | not published; verified on the private route (Firstmate 010) |
| Objectives listed | 35 | 76 (every one of the 35 kept) |
| Topics reached | 24 of 29 (missing `flexbox`, `functions-as-values-arrow-functions-and-callbacks`, `debugging-with-devtools-breakpoints`, `calling-your-spring-boot-api-from-the-browser`, `testing-a-plain-function-with-vitest`) | 29 of 29 |

The `assessment-coverage-ledger.md` graded-MCQ column now follows the 76-objective plan. Every production objective in the plan is also demonstrated by a lab task or the graded practical, so no production skill is assessed by multiple choice alone.

## Fit

| Track | Envelope (captain timing record) | Change |
|---|---|---|
| Standard | 960 minutes: 450 content and topic practice, 120 labs, 60 mastery, 90 practical + 30 MCQ, 210 reserve | Course Review pages total 29 minutes (14 + 15), taken from the 210-minute reserve; 181 minutes of reserve remain |
| Fast | 480 minutes: 120 skim, 150 project, 40 mastery, 90 + 30 final, 50 reserve | The 29 minutes come from the 50-minute reserve; 21 minutes remain |

The MCQ stays at 30 minutes. Firstmate instruction 005 sets exactly 30 questions; decision hcj-base keeps the accepted 30-minute duration and keeps the Foundation-final rule of 2 minutes per question off this Standard/Fast course, and there is no per-question timer. That is about one minute per item, which is why stems stay short; the extra difficulty comes from combining topics, not from longer listings. The Course Review pages map no curriculum row, so T14 adds them to no calendar day.

## Base and dependency

This branch was first stacked on the labs/assessments candidate at 8c1c1fdd (`fm/pep-laa-html-css-js`), which adds `web-client-mcq`, `web-client-practical`, the module labs and the timing envelope. That candidate landed on `main` as PR 91 on 2026-11-12, and this branch was rebased onto `main` on 2026-11-13. The landed version changes no file this record or the coverage plan cites as evidence for a coverage claim in a way that alters the claim.

## Protected values

No graded item text, option, keyed response, feedback or score exists in this repository, in this task's private staging or in any critic brief. Critics reviewed only the committed blueprint, the coverage map and this record. The private-authoring route for this course's graded MCQ is an open course-owner decision. Item values will be authored only after that decision, outside Git, and validation will be recorded here as "validated at <commit> by run <id>".

## Binding item-writer notes

Correction loops 2 to 8 raised findings that bind the private item writer; the non-author decisions are in the course-final reconciliation files. Under Firstmate decision 011 the notes themselves, and every item they name, are kept only on the private route, because a per-item note can narrow a keyed topic, objective or answer role. The private item writer applies them before keying. Publicly, the binding rules are the `itemConstraints` in the plan, which apply to every item.

## Privacy corrections, loops 5 to 9 (2026-11-13)

After the labs/assessments PR landed, this branch was rebased onto `main`. Loops 5 to 8 then found committed text and metadata from which per-item answer roles could be reconstructed or narrowed. The same leak class came back each round. The course owner set the boundary in three steps:

- **Firstmate decision 009:** aggregate committed coverage only.
- **Firstmate decision 010:** no per-module weights, per-item depth or band, skim-topic depth rule, or per-item module or topic attribution in public.
- **Firstmate decision 011:** per-item contexts, demand labels, notes and review findings move to the private route too. Committed review evidence states only value-free aggregate conclusions and counts.

Applied:

- The plan items carry only an id and the format. Everything else per item is kept privately. The public objective list follows the blueprint's order.
- The blueprint's `weights` field is empty, and its instructions no longer refer to weights.
- All committed course-final critic, recheck and reconciliation text that described a specific item was replaced in place with value-free aggregate wording. Ids, severities, statuses, hashes and verdicts are kept, and the original wording is preserved privately.
- Item-level education and SME review from loop 9 runs on the private route; only aggregate verdicts are committed.
- Content corrections raised in loops 5 to 8 were applied on the private route; the not-elicited reasons agree across the plan, this record and the ledger (edu-cfl5-03).
- The branch history was squashed into one commit, so no commit carries the earlier forms. Older local references that do carry them stay local only.
