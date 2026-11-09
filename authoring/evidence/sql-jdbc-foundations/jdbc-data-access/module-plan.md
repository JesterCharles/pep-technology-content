# Module plan: `sql-jdbc-foundations/jdbc-data-access`

Bounded addition to SQL & JDBC Foundations, made on 2026-11-09 under the captain's direction that JDBC cannot be project work only: an interactive module that mimics the project work and establishes the break from SQL to the Java connection, with the JDBC HTML pages and GIFT banks built (limited exception approved).

## Inventory before authoring

- `reporting-indexes-and-review/jdbc-data-access-project` (kind `lab-brief`) takes all five F23 rows. Its `artifact.html`, `artifact.md` and `coding-lab/` are still absent ("authored in the reporting-indexes-and-review module PR"). The intake (`../intake.md`, F23 project artifact plan and Prerequisite alignment) assigns it the only JDBC instruction in the course: pgJDBC and `DriverManager`, `PreparedStatement` and SQL injection, transactions and ACID, swapping the repository behind its interface, testing against a created and dropped test database.
- `reporting-indexes-and-review/jdbc-review` (kind `review`, F24) is authored and retrieves JDBC with objectives o1 (connection, prepare, execute, ResultSet, try-with-resources), o2 (parameters prevent injection) and o3 (setAutoCommit, commit, rollback). It adds no new syllabus and has no GIFT by design.
- Missing bridge: no learner page teaches JDBC before the F23 project or the F24 review. Learners met SQL only in `psql`; nothing showed a Java program connecting, binding values, reading a cursor, committing a transaction or testing against a throwaway database.

## What this module adds

Five topics, one per F23 calendar row, titled from the row text, each with `artifact.html` (primary), `artifact.md` (generated from the HTML) and a five-question `artifact.gift` formative practice bank. Every topic maps its row with relation `shared`; the project brief keeps the same rows and stays the place the real JDBC repository is built.

| # | Topic | F23 row | Kind | Budget (min) | Interactions |
|---|---|---|---|---|---|
| 1 | `connecting-java-to-postgres-with-jdbc` | 0 | core | 8 | prediction; connection workbench (driver, refused port, unknown database, wrong password); ResultSet cursor stepper with row mapping; error-diagnosis check |
| 2 | `prepared-statements-and-sql-injection` | 1 | core | 11 | prediction; injection explorer (concatenated vs bound); `findByCity` editor rewrite to `?` + `setString`; `executeUpdate` row-count check |
| 3 | `transactions-and-acid` | 2 (Reading) | reading | 11 | prediction; two-session timeline (auto-commit, rollback, read before and after commit); `transfer` editor with `setAutoCommit(false)`, `commit`, `rollback`; ACID check |
| 4 | `swapping-the-in-memory-repository-for-a-jdbc-one` | 3 | core | 12 | prediction; wiring and two-way mapping check; `findById` editor leak fix with try-with-resources; close-order check |
| 5 | `testing-a-repository-against-a-test-database` | 4 | core | 8 | prediction; test-database lifecycle runner; failing-test reader (mapping vs bound value); fresh-database check |

All simulation is bounded and labelled on every page: no Java, JDBC driver, JUnit or PostgreSQL runs; editors run pattern checks on one method and say Java is not compiled; driver and server messages are modelled on pgJDBC and PostgreSQL wording and shortened. No project solution, hidden test or graded key is on any page. The editor answers are formative page activities, like other committed module pages.

## Counts

These 5 topics are counted separately: they are not part of the original 243-topic baseline and not part of the selected 55-page visual migration. The SQL & JDBC Foundations course grows from 20 to 25 topic pages (21 to 26 counting the module check blueprint) and from 3 to 4 modules.

## Time envelope (no days added, no objectives dropped)

- F23 is a Project day: 120 minutes = Warm-up 5, Plan the work 10, Build 80, Timed without AI 15, Commit and walkthrough note 10.
- This module's five pages total 50 minutes (8 + 11 + 11 + 12 + 8, each `ceil(max(estimator P50, modeled worst path))`) and are placed inside the Build block as its guided first part, because each page rehearses one Build step.
- Exact tradeoff: the project brief (15) and the bridge (50) leave 15 minutes of the 80-minute Build block for the hands-on project lab, unless the brief is read during Plan the work. The intake planned the lab at the full 80 minutes; that is no longer possible inside F23. Options for the captain: (a) keep F23 at 120 and plan the project lab at the remaining Build minutes, moving the rest of the build to the F24 "Practice without AI" block (25); (b) shorten the bridge by making pages 2-4 optional rehearsal for learners who pass the topic GIFT; (c) add time elsewhere. This module does not decide it; the project lab's `lab.json` records the decision when it is authored.
- Repository gate T14 counts topic budgets per day: F23 now totals 15 + 50 = 65 of 120.
- Downstream: the F24 review and module check keep their calendar blocks (review pages 2 x 15, module check 45); the module check's coverage grows without adding items or minutes (below).

## Course review and graded-final coverage

- F24 module check (graded final for this course, `sql-jdbc-foundations/assessments/sql-module-check/blueprint.json`): value-free coverage plan for the 15 new taught objectives. MCQ pool: `connecting-java-to-postgres-with-jdbc#o1`, `#o2`; `prepared-statements-and-sql-injection#o1`, `#o3`; `transactions-and-acid#o1`, `#o3`; `swapping-the-in-memory-repository-for-a-jdbc-one#o2`, `#o3`; `testing-a-repository-against-a-test-database#o1`, `#o2`, `#o3`. Coding pool: `connecting-java-to-postgres-with-jdbc#o3`, `prepared-statements-and-sql-injection#o2`, `transactions-and-acid#o2`, `swapping-the-in-memory-repository-for-a-jdbc-one#o1`. `itemCounts` (15 MCQ, 2 coding), `durationMinutes` (45) and `passMark` stay unchanged: the item pool samples a larger objective set, so no minutes are added. The blueprint file itself is bound to the intake critic reviews (gate T25), so adding these references to its `objectives` and `objectiveFormats` is a separate course-scope change that needs an education and SME critic recheck; it is not made in this module branch. No item, key, rubric or answer is written anywhere.
- Course Review (the later SQL Course Review delivery): its retrieval plan must include all five topics. Coverage targets, one retrieval prompt or more per objective: connection URL and error diagnosis (topic 1), concatenation vs binding and `executeUpdate` counts (topic 2), auto-commit, commit and rollback, and other-session visibility (topic 3), two-way mapping, close order and swap point (topic 4), fresh test database, reading expected vs actual and lifecycle order (topic 5). The existing `jdbc-review` objectives o1-o3 already retrieve topics 1-4's core; topic 5 and topic 4 o3 are new retrieval targets.
- Protected graded keys stay out of the repository pending the existing privacy decision.

## Acceptance

Minimum acceptance profile: each topic's `owner-essential-qa.json` binds its current `artifact.html` and `artifact.gift`. No independent critic reviewed these bytes; nothing here claims one did.
