# SQL & JDBC Foundations: Course Review and final MCQ coverage

Recorded 2026-11-09. Refreshed 2026-11-12 for this branch, `fm/pep-sql-jdbc-course-review-v5`, which is built directly on `main` `844479d1` (after PR 92 and PR 93).
This record covers the course-end structure, the Course Review pages, the value-free coverage plan for the graded course final MCQ, its time fit and where its protected values live.
It holds no item text, options, keyed responses, feedback, scoring, rubrics or solutions (`authoring/AGENTS.md`, "Never commit").

Teaching byte base: the JDBC bridge teaching head `34b23353`, landed on `main` through PR 89 at merge `2513e634`, which adds the five-topic `jdbc-data-access` module.
Reconciled against the landed bytes: from `34b23353` to `2513e634`, every `jdbc-data-access` learner, catalog and evidence file, the `reporting-indexes-and-review` module and the two review pages are byte-identical. The coverage map and the private bank therefore stand on the landed bytes. The same merge re-authored the five `relational-design` pages to the current design. Their objective sets and `artifact.gift` banks are unchanged, and the page activities that the coverage map's `differsFrom` names are still present.

## Ownership

| Part | Owner | State |
|---|---|---|
| Course manifest, Course Review module, moved review pages, blueprint objective list, this record and the value-free coverage map | Implementation owner of this branch (authoring agent; not an independent critic). Course owner: JesterCharles | On this branch; review pages under the minimum acceptance profile (`owner-essential-qa.json` per page) |
| Graded MCQ item values (stems, options, keyed responses, feedback) | Implementation owner of task `pep-course-ending-sql-jdbc`, through the private-authoring route approved by the course owner on 2026-11-09 | Authored only in private staging outside the repository, bound by an ownership record there; never committed (section Protected values) |
| Former coding part (2 tasks, 30 minutes) | Retired 2026-11-10 under the accepted assessment contract: one cumulative MCQ plus one separate graded practical | Removed from the blueprint. It duplicated the separate graded practical (`sql-jdbc-graded-practical`, owned by the SQL/JDBC labs task), and it was never a third authorized final component. No rubric, reference solution or hidden test exists for it. |

## Taught-topic inventory

Source: catalog `topicOrder`, `kind` and curriculum pointers, read 2026-11-09 on the teaching base.

| Group | Count | Members | Final MCQ mapping |
|---|---|---|---|
| Teaching topics | 22 | `relational-design` (5), `crud-aggregates-and-joins` (8), `jdbc-data-access` (5, the bridge module), `reporting-indexes-and-review` (4 taught pages) | Each is the primary topic of at least one MCQ item |
| Canonical review pages | 2 | `sql-review-joins-grouping-window-functions` and `jdbc-review` (F24), now in Course Review | Not mapped separately: they review the teaching topics |
| Lab brief (no learner HTML yet) | 1 | `reporting-indexes-and-review/jdbc-data-access-project` (F23) | Not used by any MCQ item. Its objective o2 left the final with the retired coding part; o1-o3 stay with the JDBC project lab allocation |
| New Course Review assets | 0 | none | Nothing is added to the canonical topic count |

## Mixed teaching and review modules

| Module | Review content | Decision |
|---|---|---|
| `reporting-indexes-and-review` ("Reporting Queries, Indexes, JDBC Project and Review") | `sql-review-joins-grouping-window-functions` (F24 row 0) and `jdbc-review` (F24 row 1), both kind `review` | Both are pure review pages, so both moved into Course Review. The module keeps its id, its four F22 teaching topics and the F23 project brief; its catalog title becomes "Reporting Queries, Indexes and the JDBC Project". |
| `relational-design`, `crud-aggregates-and-joins`, `jdbc-data-access` | none | Unchanged |

## Course end structure

1. Taught modules: `relational-design`, `crud-aggregates-and-joins`, `jdbc-data-access`, then `reporting-indexes-and-review` (F22 topics and the F23 project brief).
2. Module `sql-jdbc-course-review`, learner title exactly **Course Review**:
   - `sql-review-joins-grouping-window-functions`: "Review: Joins, grouping and window functions" (existing F24 review page, moved).
   - `jdbc-review`: "Review: JDBC" (existing F24 review page, moved).
3. The course-level graded final `sql-jdbc-foundations/assessments/sql-module-check` (course.json `assessments`; id, kind, day and pass mark unchanged): the cumulative final MCQ, 30 questions in 60 minutes. Hands-on SQL and JDBC coding is assessed by the separate graded practical (120 minutes), not by this assessment.

Course Review pages are ungraded retrieval practice and carry no GIFT. There is no second exam and no duplicate learner activity.
No new review page was written: the captain allows one or two Course Review pages, and the course already has two review pages.

## Crosswalk for the moved review pages

| Identity | Before | After |
|---|---|---|
| Topic ids, titles, curriculum pointers | `sql-review-joins-grouping-window-functions` (`/tracks/0/weeks/4/days/3/topics/0`), `jdbc-review` (`/topics/1`), F24, exact | unchanged |
| Learner paths | `sql-jdbc-foundations/reporting-indexes-and-review/<topic>/` | `sql-jdbc-foundations/sql-jdbc-course-review/<topic>/` |
| Catalog paths | `authoring/catalog/sql-jdbc-foundations/reporting-indexes-and-review/<topic>/topic.json` | `authoring/catalog/sql-jdbc-foundations/sql-jdbc-course-review/<topic>/topic.json` |
| Evidence paths | `authoring/evidence/sql-jdbc-foundations/reporting-indexes-and-review/<topic>/` | `authoring/evidence/sql-jdbc-foundations/sql-jdbc-course-review/<topic>/` (`sources.json`, `qa-paths.json`, new `owner-essential-qa.json`) |
| Official source URLs | as listed in each `sources.json` | the same URLs, re-fetched 2026-11-09, all HTTP 200 |
| Page bytes | pre-move sha256 in each `owner-essential-qa.json` | only `pep:module`, `pep:source`, the `<title>` suffix and, on `jdbc-review`, the closing next-step line changed; objectives, activities, timing and QA paths are unchanged |
| Pre-move critic reports | `critic-education.json`, `critic-sme.json` at the old evidence paths (no findings) | removed from the working tree; they bind the old path and stay in git history. They are not claimed for the moved bytes |
| Blueprint references | `.../reporting-indexes-and-review/jdbc-review#o1` (coding) | removed with the retired coding part. The legacy MCQ references to `jdbc-review#o2` and `#o3` are replaced by the bridge-module objectives they review |

`jdbc-review` prerequisites now name the bridge pages it retrieves (`jdbc-data-access/transactions-and-acid`, `jdbc-data-access/swapping-the-in-memory-repository-for-a-jdbc-one`) and the project brief; the SQL review page's prerequisites are course-qualified.
Historical intake and critic evidence that names the old paths is left as recorded history.

## Final MCQ coverage

Value-free plan: `authoring/evidence/sql-jdbc-foundations/sql-jdbc-final-mcq-coverage.json`.

- 30 planned MCQ ids, `sql-jdbc-final-mcq-01` to `-30`, numbered in course order. The v5 bank (section Protected values) delivers them in level order: the 6 Apply items, then the 21 Analyze items, then the 3 Evaluate items, in course order within each level. So a learner's question number under v5 is not the planned id. The id-to-position mapping is kept with the private bank, outside the repository, as a value-free plan file with no item text or keys.
- Every one of the 22 teaching topics is the primary topic of at least one item; eight topics are primary in two items (NULL handling, anti-joins and self-joins, subqueries and CTEs, window functions, and four of the five bridge topics). No primary objective repeats.
- All five topics of the new `jdbc-data-access` bridge module are mapped: connecting (items 22, 23), prepared statements (24, 25), transactions (26, 27), swapping the repository (28, 29) and testing against a test database (30, plus items 23 and 28 as secondary).
- 59 of the 62 teaching-topic objectives are elicited by an MCQ item. The 3 not elicited are `group-by-and-having#o3`, `seeding-sample-data#o2` and `create-table-data-types-and-constraints#o1`; their topics are still assessed through other objectives. NULL behaviour decides several items (findings `final-edu-006`, recorded as balance, not a coverage defect).
- Levels: 6 Apply, 21 Analyze, 3 Evaluate. Every item is a step up from topic practice: a new trace, debug, data-analysis or choice context, most combining two or more topics. Each item's `differsFrom` names the topic GIFT or page activity it must not repeat, and `stepUp` states the change.
- The blueprint `objectives` list exactly the 59 MCQ objectives, all of format `MCQ`. The retired coding part's two coding-only objectives, `jdbc-review#o1` and `jdbc-data-access-project#o2`, left the blueprint. The JDBC production objectives are assessed hands-on by the separate graded practical: `connecting-java-to-postgres-with-jdbc#o1`, `#o3`; `prepared-statements-and-sql-injection#o2`, `#o3`; `transactions-and-acid#o2`; `swapping-the-in-memory-repository-for-a-jdbc-one#o1`-`#o3`; `testing-a-repository-against-a-test-database#o2`. Those are its objective list on the unlanded labs branch at `4cbf022b`, to be re-read after it lands.

## Fit

Course owner decision, 2026-11-09: 2 minutes per MCQ question, at most 45 questions; 30 questions and 60 minutes is acceptable when it fits full applied all-topic coverage. The count is chosen from coverage: no forced 45, no invented minimum, no dropped taught topic and no per-question timer.
30 items cover all 22 teaching topics with one keyed decision each, and a larger count would mostly add repeated coverage. So the final MCQ is 30 questions in 60 minutes, and `durationMinutes` is 60, within the captain's "no longer than 90". The legacy coding part (30 minutes) was retired on 2026-11-10. The final pair is now this MCQ (60) plus the separate graded practical (120), 180 minutes in all.

Required-time ledger for F24 (Review day; frozen blocks from `curriculum/snapshot/pep-calendar.json` `dayTypes.Review`, 120 minutes):

| Need | Minutes | Authority | Label |
|---|---|---|---|
| Course Review pages (9 + 15) | 24 | topic budgets, T14 | accepted |
| Project lab, second part, in "Practice without AI" | 25 | captain decision 2026-11-09, option A (`jdbc-data-access/module-plan.md`) | frozen |
| Final MCQ | 60 | captain timing decision 2026-11-09; coding part retired 2026-11-10 | frozen |
| Reflection and next-week plan | 15 | calendar block | frozen |
| Transitions, instructions and submission between parts | at least 5 | assumed overhead | assumed |
| **Total required** | **at least 129** | | |
| F24 day | 120 | `program.hoursPerDay` and the Review day blocks | frozen |

The final MCQ needs 60 minutes, and the frozen F24 "Module check" block is 45 minutes. Even with the 15-minute cumulative quiz and 20-minute error-log blocks given to the review pages, F24 is at least 9 minutes over. The 120-minute graded practical is a platform-scheduled sitting outside the day templates and is not in this F24 ledger. Placement is unresolved and held by the captain. Choices that would close it include running the MCQ outside the F24 day on the platform, or adding time. None is chosen here. The course-wide counted-once ledger is kept outside the repository with the task's coordination records.

## Open items

1. **JDBC module landing: resolved.** The bridge module landed on `main` at merge `2513e634` with the teaching bytes this plan used (see the teaching byte base above), and this branch is built on a `main` that contains it. The value-free reuse and leak scans were rerun on the integrated tree, including the re-authored `relational-design` pages, as run 20261110T023349; its results are recorded under Protected values.
2. **What the Course Review pages do not retrieve.** The two existing review pages retrieve joins, grouping and window functions (`sql-review-...`) and the JDBC steps from connection to transaction with the close order (`jdbc-review`). They retrieve nothing from about 14 of the 22 teaching topics: relational design and normalization, CREATE TABLE constraints, CRUD and seeding, filtering and sorting, NULL handling, anti-joins, subqueries and CTEs, indexes and EXPLAIN, the repository swap point (`swapping-...#o3`) and the test-database topic (finding `final-edu-004`). Every one of those topics is covered by the cumulative final MCQ. No activity was added because `jdbc-review` is already at the 15-minute page cap (T14), and a third Course Review page would exceed the captain's one-or-two limit. Widening review coverage needs a decision: a captain exception for a short cumulative-scenarios page, or re-pacing inside the existing pages.
3. **F24 placement** of the 60-minute final MCQ (section Fit). The learner instructions name the assessment, not a day, because placement is unresolved (finding `final-edu-005`).
4. **Real PostgreSQL run.** No PostgreSQL server was available offline, so the SQL items were executed on SQLite with the emulation listed below, or checked against documentation (finding `final-sme-001`). Before platform upload, run the SQL items once on a PostgreSQL 18 server and record "validated at <commit> by run <id>".
   Item 26 (finding `final-sme-103`): the author's private check confirmed that the SQLite run and PostgreSQL semantics give the same committed state for this item. The reasoning is kept in private staging. Item 26 stays in the PostgreSQL run.
5. **Graded practical landing (findings `sql-intake-edu-003`, `final-edu-501`, `final-sme-102`).** Hands-on JDBC is now assessed only by the separate graded practical `sql-jdbc-foundations/assessments/sql-jdbc-graded-practical`. That practical is on the labs branch `fm/pep-laa-sql-jdbc` and is not yet on `main`. The agreed landing order is labs first, then this branch merges the landed `main`. On integration:
   - The practical blueprint must be on this branch's base, with the JDBC objectives listed in section Final MCQ coverage in practical format.
   - `course.json` `assessments` must list `sql-jdbc-graded-practical`.
   - The practical's sentence on its relation to `sql-module-check` must record the 2026-11-10 retirement of the coding part. At `4cbf022b` it still says the coding part is unchanged.
   - The coverage record must re-read the landed practical's objective list.
   Until then, this branch is not delivered and `sql-intake-edu-003` stays open. Three objectives are assessed by neither graded instrument: `group-by-and-having#o3`, `seeding-sample-data#o2`, and `jdbc-data-access-project#o2`. The first two were never MCQ-elicited, and the third left with the coding part. Their topics are still assessed through other objectives. `jdbc-data-access-project#o1`-`#o3` stay with the JDBC lab (practice) under option A, inbox 015.

## Protected values

Two versions of the graded bank exist. Both have the same 30 planned ids, objectives and levels, and the same keyed response for each item.
- **v4, delivered.** Under the captain-approved exception of 2026-11-10 (`authoring/AGENTS.md`, "Never commit"), PR 92 published the v4 bank as `sql-jdbc-foundations/assessments/sql-module-check/final-mcq.gift`. This branch does not change that file. Its delivery proof covers only the v4 bytes.
- **v5, replacement.** v5 rewords the options of 18 items so that the keyed option is no longer usually the longest: it is now the uniquely longest option in 7 items, down from 19. It also delivers the items in level order and recomputes the keyed positions. v5 is not committed. Its item text, options, keyed responses and feedback live only in private staging outside the repository, written by the implementation owner under the course owner's 2026-11-09 approval and an ownership record kept there. It reaches learners only through a separate manual re-import on the platform, which replaces v4 there.
Validation of the private items reports value-free outcomes only, with no value or hash of a value. Run 20261109T232006 checked the 30 items on teaching base 34b23353, and was repeated after the critic corrections (items 21 and 26 re-planned, per `final-mcq-reconciliation.json`) with the same results:
- All 30 items parse with the repository GIFT validator after the `[html]` markup's angle brackets were neutralised in memory. Each has four options with one keyed and feedback on every option. The text is ASCII and the category is `sql-jdbc-foundations/assessments/sql-module-check`. Keyed positions are balanced, not cyclic, with no run longer than two.
- At that run, 18 items had their keyed and distractor outcomes executed. Items 03 and 24 moved to executed after the 2026-11-10 re-authoring; the method table below is current. Sixteen ran on SQLite 3.51, with PostgreSQL's default NULL ordering emulated. Two ran on OpenJDK 17.0.12 with plain-Java resource stand-ins. The other 12 rest on the published course pages and the official PostgreSQL, Java SE and pgJDBC documentation those pages cite. No PostgreSQL server or JDBC database was available offline.
- No item reuses committed learner text. On the 34b23353 tree, the highest 7-gram overlap with any SQL & JDBC learner file is 0.07.
- Rerun 20261110T023349, on the tree integrated with landed `main` (landed `main` `2513e634` plus this record's own wording edits). It covers all 76 committed SQL & JDBC learner files, including the five re-authored `relational-design` pages. The highest 7-gram overlap of any item with that learner text is still 0.07. A scan of the 50 changed and relational-design files on this branch for the bank's novel 7-grams found 0 hits. The item-execution checks above do not read repository bytes, so they were not rerun.
- Run 20261110T074849Z, after 14 items were re-authored with new scenarios. Each kept its planned id, level, form and objectives. Results: all 30 items parse; the keyed positions are balanced; the executed checks below pass 20 of 20, but the engine versions for that run were not recorded (the v5 run below re-executed all 20 with recorded versions); the highest 7-gram overlap with learner text is at most 0.07.
- v5: run 20261112T064205Z on the private bank, then run 20261112T221253Z on this branch. The packaged v5 file passes the repository GIFT validator in `[html]` mode for this category, with every assertion that `authoring/tests/course-final-gift.test.mjs` makes for the delivered bank:
  - 30 questions, each with four options;
  - ASCII text, no obsolete header and no question line that import would drop;
  - every option letter keyed at least 7 times, with no run longer than 2.
  The coverage is unchanged: 22 of 22 teaching topics are primary, as are all 5 JDBC topics, and 59 of 62 objectives are elicited. The executed checks pass 20 of 20 on SQLite 3.53.2 and OpenJDK 17.0.12. The changed files on this branch contain no novel v5 4-, 5- or 7-grams, apart from the delivered v4 bank file. Leaving that file out, the highest 7-gram overlap of any v5 item with the 76 SQL & JDBC learner files is 0.06.

Validation method per planned item (value-free):

| Method | Planned ids |
|---|---|
| Executed on SQLite (foreign keys enabled, each script statement run on its own like a psql script, PostgreSQL's default NULL ordering emulated) | 02, 03, 05, 06, 08, 09, 10, 11, 12, 13, 14, 15, 16 (the rewrites' results only), 17, 18, 19, 24 (the SQL outcome only; pgJDBC parameter binding and PostgreSQL type coercion are docs-checked and stay in the PostgreSQL 18 run), 26 |
| Executed on OpenJDK 17.0.12 with plain-Java stand-ins for JDBC resources and the cursor | 23, 29 |
| Checked against the course pages and the official documentation they cite | 01, 04, 07, 16 (the PostgreSQL behaviour SQLite cannot reproduce), 20, 21, 22, 25, 27, 28, 30 |

Displayed numeric results are worded as values, not copied from SQLite output, because PostgreSQL prints `avg` and numeric division with more digits (finding `final-sme-006`). No item depends on AND binding tighter than OR (finding `final-sme-004`).

Practical rubrics, reference solutions, hidden tests and platform upload stay outside this task.
