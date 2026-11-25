# HTML, CSS & JS course-final MCQ bank: authoring and checks

Recorded 2026-11-19 on branch `fm/pep-course-ending-html-css-js`.
This record covers the graded bank `html-css-js/assessments/web-client-mcq/final-mcq.gift`: the course-level graded MCQ that `course.json` already registers after the Course Review module.
The bank is committed with its keys and feedback under the captain's public-answer consent (Firstmate, 2026-11-19); `authoring/AGENTS.md` records the exception.

This record supersedes the ownership row for graded MCQ item values and the section Protected values in `course-review-and-final-mcq.md`. Those sentences describe the state before 2026-11-19; that file is left unchanged because its bytes are bound to its closed course-final reviews.

## Contract

- Exactly 30 single-answer items, `html-css-js-final-mcq-01` to `-30`, in the blueprint's 30 minutes (no per-question timer, pass mark 70%). Blueprint `itemCounts`, duration and instructions are unchanged.
- Delivered easier to harder in three tiers of ten. Each item asks for one decision in a new applied, debugging, browser-behaviour, accessibility or cross-topic context.
- Only syntax, APIs and facts taught on the published learner pages are needed. Where a stem supplies a fact the pages do not teach (for example that a text field's value is a string), the stem states it.
- It is not a second exam. The Course Review pages stay ungraded practice. Formative topic quizzes remain separate quick checks of at most five minutes each.

## Order

Items run easier to harder overall, not strictly.
- Items 01 to 10 are one-step decisions and single calculations: stepping, semantic choice, grid and box-model sums, a closure trace, flex-shrink, environment mode and npm ci.
- Items 11 to 20 join two ideas in one context: forms and the server, the Secure cookie, Vitest output, delegation, the mobile-first fix, XSS, the DOM run, module paths, number types and grid areas.
- Items 21 to 30 are the multi-step async, fetch, accessibility and proxy diagnoses, ending with render timing.

The box-model and flex-shrink calculations (04 and 08) come before the lighter 10 and 11 because each is a single arithmetic step on one taught rule.

## Item map

Every item's keyed objective and the other objectives its options isolate. Tier is the delivery third.

| Item | Tier | Demand | Keyed objective | Other objectives its options isolate | Key |
|---|---|---|---|---|---|
| 01 | easier | debug | `debugging-with-devtools-breakpoints#o3` | `arrays-and-objects-map-filter-reduce#o1`, `debugging-with-devtools-breakpoints#o2` | A |
| 02 | easier | apply | `semantic-html-page-structure#o1` | - | B |
| 03 | easier | apply | `grid#o1` | `responsive-mobile-first-layout#o3` | C |
| 04 | easier | trace | `the-box-model#o3` | `the-box-model#o1` | B |
| 05 | easier | trace | `scope-and-closures#o3` | `functions-as-values-arrow-functions-and-callbacks#o3` | B |
| 06 | easier | trace | `let-const-and-equals#o2` | `functions-as-values-arrow-functions-and-callbacks#o1`, `scope-and-closures#o1` | D |
| 07 | easier | trace | `arrays-and-objects-map-filter-reduce#o3` | `arrays-and-objects-map-filter-reduce#o2`, `destructuring-and-spread#o1` | C |
| 08 | easier | trace | `flexbox#o3` | `flexbox#o1`, `flexbox#o2` | C |
| 09 | easier | trace | `environment-settings-for-the-api-address#o1` | `environment-settings-for-the-api-address#o2` | D |
| 10 | easier | debug | `project-setup-with-npm-and-vite#o3` | `project-setup-with-npm-and-vite#o2` | A |
| 11 | middle | apply | `forms-and-html5-validation#o3` | `calling-your-spring-boot-api-from-the-browser#o2`, `forms-and-html5-validation#o2` | B |
| 12 | middle | debug | `cookies-vs-localstorage-where-tokens-should-live#o2` | `cookies-vs-localstorage-where-tokens-should-live#o1` | D |
| 13 | middle | debug | `testing-a-plain-function-with-vitest#o3` | `javascript-for-java-developers#o1`, `testing-a-plain-function-with-vitest#o2` | D |
| 14 | middle | debug | `events-and-event-bubbling#o3` | `events-and-event-bubbling#o1`, `events-and-event-bubbling#o2` | C |
| 15 | middle | apply | `responsive-mobile-first-layout#o1` | `flexbox#o1`, `responsive-mobile-first-layout#o2`, `responsive-mobile-first-layout#o3` | C |
| 16 | middle | apply | `preventing-cross-site-scripting#o3` | `preventing-cross-site-scripting#o1`, `preventing-cross-site-scripting#o2` | B |
| 17 | middle | trace | `selecting-and-changing-the-dom#o3` | `preventing-cross-site-scripting#o2`, `selecting-and-changing-the-dom#o1`, `selecting-and-changing-the-dom#o2` | C |
| 18 | middle | debug | `modules-import-and-export#o2` | `modules-import-and-export#o1`, `modules-import-and-export#o3` | A |
| 19 | middle | trace | `javascript-for-java-developers#o1` | `javascript-for-java-developers#o3` | D |
| 20 | middle | apply | `responsive-mobile-first-layout#o1` | `grid#o2`, `grid#o3` | C |
| 21 | harder | trace | `async-and-await#o3` | `promises#o2`, `the-event-loop#o1` | A |
| 22 | harder | debug | `the-event-loop#o2` | `async-and-await#o3`, `the-event-loop#o1` | D |
| 23 | harder | debug | `accessibility-basics#o3` | `accessibility-basics#o1`, `accessibility-basics#o2`, `forms-and-html5-validation#o1` | A |
| 24 | harder | debug | `destructuring-and-spread#o1` | `arrays-and-objects-map-filter-reduce#o1`, `functions-as-values-arrow-functions-and-callbacks#o1`, `functions-as-values-arrow-functions-and-callbacks#o2` | B |
| 25 | harder | debug | `handling-http-errors-and-problemdetail-responses#o2` | `async-and-await#o2`, `fetching-data#o2` | B |
| 26 | harder | trace | `promises#o2` | - | A |
| 27 | harder | trace | `async-and-await#o2` | `promises#o1`, `promises#o3` | A |
| 28 | harder | debug | `calling-your-spring-boot-api-from-the-browser#o1` | `destructuring-and-spread#o2`, `handling-http-errors-and-problemdetail-responses#o1` | B |
| 29 | harder | debug | `fixing-cors-spring-security-config-vs-vite-dev-proxy#o3` | `environment-settings-for-the-api-address#o1`, `fixing-cors-spring-security-config-vs-vite-dev-proxy#o1`, `fixing-cors-spring-security-config-vs-vite-dev-proxy#o2` | D |
| 30 | harder | trace | `the-event-loop#o1` | `selecting-and-changing-the-dom#o2`, `the-event-loop#o2` | A |

All 29 taught topics are reached. 65 of the blueprint's 76 listed objectives are elicited, plus three outside the list: `debugging-with-devtools-breakpoints#o3`, `responsive-mobile-first-layout#o2` and `testing-a-plain-function-with-vitest#o2`.
The correction loops replaced items that re-asked practice questions, so the elicited set moved away from the earlier per-item plan. The blueprint's objective list is left unchanged, because its bytes are bound to the closed course-final reviews. Aligning that list with this map is a follow-up.

## Checks on the committed bytes

| Check | Result |
|---|---|
| `authoring/tests/course-final-gift.test.mjs` (main's GIFT rules: `[html]` mode, indentation-safe code lines, no numeric newlines, no droppable `//` lines) | 30 questions valid; plain mode rejects the bytes as expected |
| Key positions | A 8, B 8, C 7, D 7; longest run of one letter 2 |
| Longest-option cue | key strictly longest in 4 of 30 items |
| Outcomes | every trace and debug outcome, including each distractor's behaviour where it is claimed, was run in Node.js 24.2.0 or headless Chromium (Playwright 1.55.0). This covers the grid, flex, box-model, mobile-first, event-delegation, module-loading (plain static server), DOM, XSS and fetch-stub items. Both critics re-ran them independently |
| Taught prerequisites | every API, property and syntax form in stems and options grepped against the learner `artifact.html` text; untaught forms such as the conditional operator, `Date.now`, `trim()` and `column-gap` were removed |
| Deduplication | max trigram Jaccard 0.034 against the 183 topic-quiz and mastery-check items; max trigram containment 0.170 against the 31 learner pages. Both critics also read every quiz, mastery check, page activity and Course Review activity for repeated decisions |
| Reading load | about 25 minutes estimated for stems, code and options at 200 words per minute, plus 4 seconds per code line and 15 seconds per decision; fits 30 minutes |

## Independent review

Two independent critics (SME and education) reviewed the bank bytes. A non-author reconciler then decided every finding.
- First reports: `course-final-gift-critic-sme.json` and `course-final-gift-critic-education.json`.
- Rechecks: `course-final-gift-critic-*-recheck.json` and `course-final-gift-loop2..4-critic-*-recheck.json`.
- Reconciliation: `course-final-gift-reconciliation.json`.

The education critic's first report found ten items that re-asked practised decisions. Those items were replaced in bounded correction loops, after reading all four mastery checks and the affected topics' page activities. The final rechecks bind every finding to the committed bytes.

## Delivery dependencies

- PR 100 (T25 tied-recheck ordering) landed on main as `a00a6658`, and this branch is rebased onto it.
- `course-final-gift.test.mjs` previously required exactly four tracked banks. It now accepts a bank only at a manifest-registered `gradedMcq` assessment and enforces the 30-question contract with at least one minute per question. It keeps every Foundation bank and its expectations.
