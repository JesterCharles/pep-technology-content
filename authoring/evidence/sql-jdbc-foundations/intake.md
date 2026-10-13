# Course intake: SQL & JDBC Foundations

Intake for `sql-jdbc-foundations` (calendar technology `sql`, Foundation days F19-F24).
This intake ships manifests, the F24 assessment blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.
It closes the two category-A records sequenced to this intake in the frozen coverage matrix (`pep-p0-matrix-v3`): `source-gap-sql-jdbc-foundations-modules` (module grouping, below) and `source-gap-sql-jdbc-foundations-official-evidence` (live source freeze, below).

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Frozen coverage matrix `matrix-v3.json` and `discrepancies-v3.json` (rows `F19:*` to `F24:*`, course `sql-jdbc-foundations`): the topic-string inventory, proposed topic ids and expected-artifact scope.
- Repository contracts on `main`: `AGENTS.md`, `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule), `schemas/`.
- Approved PEP technology-content plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Reference pattern: the merged course-1 intake (`evidence/git-linux-ai-foundations/intake.md`). Its legacy-label timing basis is course-1 only and is not used here.

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| F19 | Relational model and table design | Concept | `/tracks/0/weeks/3/days/3` | 0. Reading: installing Postgres and a SQL client; 1. Tables, keys and relationships; 2. Designing tables from a user story; 3. Reading: normalization basics; 4. CREATE TABLE, data types and constraints |
| F20 | CRUD, seed data, aggregates | Concept | `/tracks/0/weeks/3/days/4` | 0. INSERT, UPDATE and DELETE; 1. Seeding sample data; 2. Filtering and sorting; 3. Handling NULLs: COALESCE and CASE; 4. Aggregate functions |
| F21 | Grouping and joins | Concept | `/tracks/0/weeks/4/days/0` | 0. GROUP BY and HAVING; 1. Inner and left joins; 2. Anti-joins and self-joins |
| F22 | Reporting queries and indexes | Concept | `/tracks/0/weeks/4/days/1` | 0. Subqueries and CTEs; 1. Window functions: top N per group; 2. Indexes; 3. Reading: query plans with EXPLAIN |
| F23 | JDBC data access | Project | `/tracks/0/weeks/4/days/2` | 0. Connecting Java to Postgres with JDBC; 1. Prepared statements and SQL injection; 2. Reading: transactions and ACID; 3. Swapping the in-memory repository for a JDBC one; 4. Testing a repository against a provided test database |
| F24 | SQL review and check | Review | `/tracks/0/weeks/4/days/3` | 0. SQL review: joins, grouping, window functions; 1. JDBC review; 2. SQL module check |

F24 carries the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70), this course's course-level assessment.
No Standard or Fast Track day has technology `sql`, so no track day shares this blueprint; the Standard and Fast days that touch SQL (S5, S8, S16, S17, S38; FT3, FT6, FT10, FT22) belong to the `spring-boot`, `python` and `containers-cicd` courses.
Calendar `requiredLab` is false on F19-F24.

## Module map (second-mate grouping decision, not syllabus)

The calendar gives this course no module grouping (matrix record `source-gap-sql-jdbc-foundations-modules`, category A).
This intake chooses the grouping below as a second-mate grouping decision; it is not syllabus and changes no calendar row.
Rules applied: modules follow calendar day order, no day is split across modules, each module is a batch of 5-9 topics for one later module PR, and the module count is not inferred from weeks or day types.

| Module | Title | Days | Topics | Grouping reason |
|---|---|---|---|---|
| `relational-design` | Relational Design | F19 | 5 | One day that builds one model: setup, keys, design, normalization, DDL. |
| `crud-aggregates-and-joins` | CRUD, Aggregates and Joins | F20, F21 | 8 | F20 "Aggregate functions" leads straight into F21 "GROUP BY and HAVING"; F21 alone (3 topics) is too small a batch. |
| `reporting-indexes-and-review` | Reporting Queries, Indexes, JDBC Project and Review | F22, F23, F24 | 7 | F22's four topics, the F23 JDBC project brief and the two F24 review pages that close the course, as course 1 places its review pages at the end of the modules they close. |

Total: 20 pages: the matrix's 19 topic pages (17 quizzes, 3 print handouts) plus the F23 project brief, which is the matrix's one authorized project-row artifact for this course; the F24 module check is the one assessment blueprint.

## Topic list with relations

Topic ids are the matrix's proposed slugs, unchanged, except the F23 project brief, whose id `jdbc-data-access-project` follows the F23 calendar title. Every relation is `exact`: each source row maps wholly to one page and no row is split or shared; the project brief is the one page that takes all five F23 rows, because they form one project row.

| # | Topic | Module | Kind | Pointer | Day | Relation |
|---|---|---|---|---|---|---|
| 1 | `installing-postgres-and-a-sql-client` | `relational-design` | reading | `/tracks/0/weeks/3/days/3/topics/0` | F19 | exact |
| 2 | `tables-keys-and-relationships` | `relational-design` | core | `/tracks/0/weeks/3/days/3/topics/1` | F19 | exact |
| 3 | `designing-tables-from-a-user-story` | `relational-design` | core | `/tracks/0/weeks/3/days/3/topics/2` | F19 | exact |
| 4 | `normalization-basics` | `relational-design` | reading | `/tracks/0/weeks/3/days/3/topics/3` | F19 | exact |
| 5 | `create-table-data-types-and-constraints` | `relational-design` | core | `/tracks/0/weeks/3/days/3/topics/4` | F19 | exact |
| 6 | `insert-update-and-delete` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/3/days/4/topics/0` | F20 | exact |
| 7 | `seeding-sample-data` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/3/days/4/topics/1` | F20 | exact |
| 8 | `filtering-and-sorting` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/3/days/4/topics/2` | F20 | exact |
| 9 | `handling-nulls-coalesce-and-case` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/3/days/4/topics/3` | F20 | exact |
| 10 | `aggregate-functions` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/3/days/4/topics/4` | F20 | exact |
| 11 | `group-by-and-having` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/4/days/0/topics/0` | F21 | exact |
| 12 | `inner-and-left-joins` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/4/days/0/topics/1` | F21 | exact |
| 13 | `anti-joins-and-self-joins` | `crud-aggregates-and-joins` | core | `/tracks/0/weeks/4/days/0/topics/2` | F21 | exact |
| 14 | `subqueries-and-ctes` | `reporting-indexes-and-review` | core | `/tracks/0/weeks/4/days/1/topics/0` | F22 | exact |
| 15 | `window-functions-top-n-per-group` | `reporting-indexes-and-review` | core | `/tracks/0/weeks/4/days/1/topics/1` | F22 | exact |
| 16 | `indexes` | `reporting-indexes-and-review` | core | `/tracks/0/weeks/4/days/1/topics/2` | F22 | exact |
| 17 | `query-plans-with-explain` | `reporting-indexes-and-review` | reading | `/tracks/0/weeks/4/days/1/topics/3` | F22 | exact |
| 18 | `jdbc-data-access-project` | `reporting-indexes-and-review` | lab-brief | `/tracks/0/weeks/4/days/2/topics/0` to `/topics/4` | F23 | exact (five rows, one project) |
| 19 | `sql-review-joins-grouping-window-functions` | `reporting-indexes-and-review` | review | `/tracks/0/weeks/4/days/3/topics/0` | F24 | exact |
| 20 | `jdbc-review` | `reporting-indexes-and-review` | review | `/tracks/0/weeks/4/days/3/topics/1` | F24 | exact |

Rows that are not topic pages:

- **F23 project rows** (`/tracks/0/weeks/4/days/2/topics/0-4`): one project row, delivered as one canonical project artifact, `jdbc-data-access-project` (captain decision `pep-project-rows`, option A; reconciliation `sql-intake-edu-001`). See "F23 project artifact plan" below. The matrix's proposed per-row slugs (`connecting-java-to-postgres-with-jdbc` and four more) are not created as topics.
- **F24 row 2 "SQL module check"**: the course blueprint `assessments/sql-module-check`, not a topic.
- **Review rows** F24 rows 0-1 are `review` pages: retrieval over earlier pages and the F23 project brief, no new syllabus.

Prerequisites: same-module topics are named by topic id, other modules by `<course>/<module>/<topic>`, and other courses by course id only (`java-foundations`, whose topic ids do not exist yet). `course.json` names `git-linux-ai-foundations` (shell and terminal use) and `java-foundations` (JDBC and the F23 repository swap build on its Java project).

## Objectives

Each topic has 2-3 observable objectives with ids `o1`-`o3` in its `topic.json`. Blueprint references use `<course>/<module>/<topic>#<objective-id>`.

## Artifact applicability

Rules (captain, as applied in course 1): core topics require HTML, derived Markdown and a practice GIFT quiz, with a curated video when a suitable verified one exists; Reading topics also carry a printable PDF; review topics carry HTML and Markdown only; absent companions record a reason. Every page embeds interactive practice (matrix `simulator`).

Legend: **R** required, authored in the module PR; **V** required when a suitable verified public video exists, otherwise recorded absent with the search record; **M** practised in the planned module lab; **T** the topic's own coding lab, authored in the module PR; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `relational-design/installing-postgres-and-a-sql-client` | reading | R | R | R | R | V | - |
| `relational-design/tables-keys-and-relationships` | core | R | R | - | R | V | M |
| `relational-design/designing-tables-from-a-user-story` | core | R | R | - | R | V | M |
| `relational-design/normalization-basics` | reading | R | R | R | R | V | - |
| `relational-design/create-table-data-types-and-constraints` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/insert-update-and-delete` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/seeding-sample-data` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/filtering-and-sorting` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/handling-nulls-coalesce-and-case` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/aggregate-functions` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/group-by-and-having` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/inner-and-left-joins` | core | R | R | - | R | V | M |
| `crud-aggregates-and-joins/anti-joins-and-self-joins` | core | R | R | - | R | V | M |
| `reporting-indexes-and-review/subqueries-and-ctes` | core | R | R | - | R | V | M |
| `reporting-indexes-and-review/window-functions-top-n-per-group` | core | R | R | - | R | V | M |
| `reporting-indexes-and-review/indexes` | core | R | R | - | R | V | - |
| `reporting-indexes-and-review/query-plans-with-explain` | reading | R | R | R | R | V | - |
| `reporting-indexes-and-review/jdbc-data-access-project` | lab-brief | R | R | - | - | - | T |
| `reporting-indexes-and-review/sql-review-joins-grouping-window-functions` | review | R | R | - | - | - | - |
| `reporting-indexes-and-review/jdbc-review` | review | R | R | - | - | - | - |

Totals: 20 HTML and Markdown (19 topic pages and the project brief), 17 GIFT quizzes, 3 PDF handouts, up to 17 videos and 1 topic coding lab for the project. The project brief carries no PDF, GIFT or video: it is not a Reading topic, its public tests, the F23 "Timed, without AI" block and the F24 module check assess it, and the Project day has no video block.

Terminal interaction: any page that simulates a `psql` session or other command entry reuses the canonical terminal foundation, shared component `components/terminal@1`, which carries the repaired course-1 Evolv package's non-form direct Run-button and Enter-key dispatch (`git-linux-ai-foundations-20261007-evolv-terminal-repair`). That behavior is captain-confirmed working in Evolv (platform success, not a captured DOM or console trace); module PRs embed it unchanged and do not re-derive or redesign it. SQL simulators state plainly what they do not support and never show output real PostgreSQL would not show.

## Lab plan

No lab uses Docker, Podman, Compose, Testcontainers or any other learner-side container engine (reconciliation `sql-intake-edu-002`, `sql-sme-001`, `sql-sme-002`).
Every lab runs against the learner-local PostgreSQL server that the F19 reading already has learners install, through the pinned pgJDBC driver (`jdbc:postgresql` URLs). Connection settings come from documented environment variables (`PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, as libpq and `psql` use them); each lab README documents how the password is supplied, and the module SME critic confirms that mechanism on macOS, Linux and Windows. The one Maven test command creates an isolated lab database (`CREATE DATABASE`), runs the public tests and drops it (`DROP DATABASE`); `lab.json` declares that database for cleanup. No lab uses H2 or another embedded engine, so no lab claims behavior PostgreSQL does not show.

| Planned lab | Scope and location | Covers | Test command | Authored in |
|---|---|---|---|---|
| Relational design lab | module, `sql-jdbc-foundations/relational-design/coding-lab/` | `tables-keys-and-relationships`, `designing-tables-from-a-user-story`, `create-table-data-types-and-constraints`: learner writes `schema.sql` for a user story; public JUnit tests load it into the lab database and check tables, keys and that constraint-violating inserts are rejected | `mvn -q -o test` | `relational-design` module PR |
| Queries lab | module, `sql-jdbc-foundations/crud-aggregates-and-joins/coding-lab/` | the 8 module topics: learner writes `.sql` statements and a seed script; tests run the statements through pgJDBC against seeded fixture data and compare result rows, and run the seed script, including its `\copy`, through the real `psql` client invoked from the same Maven test command, so `seeding-sample-data#o3` is genuinely exercised | `mvn -q -o test` | `crud-aggregates-and-joins` module PR |
| Reporting lab | module, `sql-jdbc-foundations/reporting-indexes-and-review/coding-lab/` | `subqueries-and-ctes`, `window-functions-top-n-per-group`: CTE and top-N-per-group queries checked against fixture data | `mvn -q -o test` | `reporting-indexes-and-review` module PR |
| JDBC data access project lab (F23 Build block) | topic, `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-data-access-project/coding-lab/` | the five F23 rows, objectives `jdbc-data-access-project#o1`-`#o3`; see "F23 project artifact plan" | `mvn -q -o test` | `reporting-indexes-and-review` module PR; required |

Setup for every lab is one online `mvn -q dependency:go-offline` (Maven Dependency Plugin), then the test command runs offline against the local server. Dependencies (pgJDBC, JUnit Jupiter) are pinned in each `pom.xml` per `docs/lab-contract.md`; prerequisites are a JDK, Maven, and PostgreSQL with `psql`, each with a version check in the README.
Not given a lab: the three Reading topics (readings carry no lab), `indexes` and `query-plans-with-explain` (plan choice on small lab data depends on table statistics and cost settings, so a graded lab could not be deterministic; the page simulator teaches PostgreSQL's documented plans), and the two review pages (the F24 Review day's platform "Practice without AI" block covers practice).
`moduleLabs` and `courseLabs` stay empty until each lab directory exists; topic manifests record `lab: module:<module-id>` for the covered topics, and `jdbc-data-access-project` records `lab: topic`.

## F23 project artifact plan

Captain decision `pep-project-rows`, option A (reconciliation `sql-intake-edu-001`): the F23 project row gets one reusable learner-facing project artifact. This intake records the plan; the `reporting-indexes-and-review` module PR authors the files.

- **Location (one canonical artifact):** `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-data-access-project/`, kind `lab-brief`: `artifact.html` (the project brief, primary) and `artifact.md`, plus `coding-lab/` (`lab.json`, `README.md`, `starter/`, `tests/`, `fixtures/`, `expected/`). No Standard or Fast day has an F23 equivalent today; any track overlay that needs this project references `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-data-access-project` and never copies it.
- **Outcomes** (`topic.json` objectives): o1 connect a Java program to the learner-local PostgreSQL through pgJDBC and `DriverManager` with settings from environment variables and try-with-resources (row 0); o2 implement a JDBC repository behind the existing repository interface with `PreparedStatement` parameters and a multi-statement transaction that commits or rolls back as a unit (rows 1, 2, 3); o3 run the public tests against an isolated test database the tests create and drop, and use a failing test to fix a repository bug (row 4).
- **Starter scaffold:** a Maven project with a pinned pgJDBC and JUnit Jupiter `pom.xml`; the repository interface and its in-memory implementation, matching the Java course's in-memory repository pattern; an empty JDBC repository class to complete; `schema.sql` and a small seed fixture; a test-database helper that reads `PGHOST`, `PGPORT`, `PGUSER` and `PGDATABASE`, creates a uniquely named database, applies the schema and drops it afterwards. As shipped, the starter compiles and the named public tests fail with stable messages.
- **Public tests and command:** JUnit tests for each repository method, for parameter binding (a value containing a quote is stored literally, not executed) and for rollback (a failing step leaves no partial change), run with `mvn -q -o test` after one online `mvn -q dependency:go-offline`. No container; the learner-local PostgreSQL server only.
- **Never in the repository:** the reference solution and any hidden tests; they live in uncommitted private staging, and the solved run is recorded only as "solved at <commit> by run <id>" (`docs/lab-contract.md`).
- **Minutes:** the brief page is budgeted at 15 (see Minute budgets); the lab's `lab.json` plans 80 minutes, the F23 Build block. The calendar's 10-minute "Plan the work" and 15-minute "Timed, without AI" blocks stay platform activities.

### Prerequisite alignment

Every concept the project applies is taught before F23, either by an earlier topic objective or by instruction inside the brief itself. Java course topic ids do not exist yet, so those rows name the course id and the calendar row that teaches the concept; the Java course intake confirms the objective ids.

| Concept the project applies | Taught by |
|---|---|
| Tables, primary and foreign keys | `sql-jdbc-foundations/relational-design/tables-keys-and-relationships#o1`, `#o2` |
| Reading and running a CREATE TABLE schema | `sql-jdbc-foundations/relational-design/create-table-data-types-and-constraints#o1`, `#o2` |
| INSERT, UPDATE and DELETE with a targeted WHERE | `sql-jdbc-foundations/crud-aggregates-and-joins/insert-update-and-delete#o1`, `#o2` |
| SELECT with WHERE and ORDER BY | `sql-jdbc-foundations/crud-aggregates-and-joins/filtering-and-sorting#o1`, `#o2` |
| Seed data that respects foreign keys | `sql-jdbc-foundations/crud-aggregates-and-joins/seeding-sample-data#o1` |
| Environment variables for connection settings and keeping secrets out of code | `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets` (objectives o1-o3) |
| Running `psql` against the local server | `sql-jdbc-foundations/relational-design/installing-postgres-and-a-sql-client#o2` |
| Classes, interfaces, dependency inversion | `java-foundations` (F12 "Interfaces and default methods"; F13 "SOLID basics: single responsibility, dependency inversion") |
| An in-memory repository behind an interface | `java-foundations` (F16 "An in-memory repository behind an interface") |
| Checked exceptions and try-with-resources | `java-foundations` (F14 "Checked vs unchecked exceptions"; "try/catch/finally and try-with-resources") |
| Maven builds and dependencies | `java-foundations` (F10 "Maven builds and dependencies") |
| JUnit tests: arrange, act, assert | `java-foundations` (F17 "Unit tests with JUnit, written test-first") |
| Connecting through pgJDBC: driver, `jdbc:postgresql` URL, `DriverManager`, `Connection` | brief instruction (row 0), gap closed in the brief: no earlier page teaches JDBC |
| `PreparedStatement` parameters and why concatenation allows SQL injection | brief instruction (row 1) |
| Transactions and ACID: `setAutoCommit(false)`, commit, rollback | brief instruction (row 2, the F23 Reading row) |
| Swapping the repository implementation behind its interface | brief instruction (row 3), building on the F16 Java repository |
| Testing against a provided test database that is created and dropped | brief instruction (row 4) |

## Minute budgets

Basis: the new-course rule in `docs/tools/validators.md` (Reading time, T14): every budget is at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15, never compressed to fit a day. No `artifact.html` exists yet, so this intake records planning targets, marked `intake-target:` in each `minutes.basis`:

- `modeledP50`: a per-kind target from course-1 measured estimator P50 on comparable pages (frozen `tools/timing/estimate_reading.py`, sha256 `0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f`): core 7.0, reading 5.0, review 6.5.
- `modeledWorstPath`: the target P50 times 1.42, the mean course-1 ratio of recorded worst-required-route (`worstRequiredRetryP50`) to estimator P50 over its five pages that record both (7.9/5.49, 7.31/5.14, 9.35/6.7, 8.07/5.44, 8.5/6.19): core 10.0, reading 7.1, review 9.2.
- `budget` = `aboutLabel` = `ceil(max(modeledP50, modeledWorstPath))`: core 10, reading 8, review 10.
- `jdbc-data-access-project` (lab-brief): target P50 10 (the core target plus about 3 minutes for the brief instruction that teaches JDBC concepts no earlier page covers), worst path 14.2, budget 15, the page ceiling; if the authored brief's honest minimum exceeds 15, the module PR moves teaching into the lab README rather than compressing the budget.
- Each module PR replaces the modeled values with the estimator P50 and the modeled worst required route of the authored page, raises the budget when the honest minimum is higher, and never compresses it.

| Day | Day type (block total) | Topics | Planned budget total | Headroom |
|---|---|---|---|---|
| F19 | Concept (120) | 2 reading, 3 core | 46 | 74 |
| F20 | Concept (120) | 5 core | 50 | 70 |
| F21 | Concept (120) | 3 core | 30 | 90 |
| F22 | Concept (120) | 1 reading, 3 core | 38 | 82 |
| F23 | Project (120) | 1 project brief (budget 15; the 80-minute Build block time lives in the lab's `lab.json`) | 15 | 105 |
| F24 | Review (120) | 2 review | 20 | 100 |

Every topic could rise to the 15-minute ceiling without a day exceeding its 120-minute block total (largest: F20 at 75), so no pacing decision is foreseeable.

## F24 assessment blueprint

`sql-jdbc-foundations/assessments/sql-module-check/blueprint.json`:

- Calendar identity copied verbatim from the snapshot F24 `assessment`: `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores, so `weights` is empty.
- Item counts and duration from the F24 Review day's "Module check" block (`MCQ + coding assessment`, 45 minutes): `durationMinutes` 45. The calendar does not split the block, so this intake proposes MCQ 15 items (about 1 minute each, 15 minutes) and coding 2 short tasks (about 15 minutes each, 30 minutes) that write SQL and query a database from Java with JDBC.
- Objectives covered: a representative set the 17 items can elicit, each exact reference mapped in `objectiveFormats` to one format. MCQ covers one objective per item across all three modules and both F24 review areas; the 2 coding tasks cover 6 hands-on objectives: four SQL query-writing objectives, the central JDBC outcome `jdbc-review#o1` (connect, prepare, execute, read, close) and the F23 project outcome `jdbc-data-access-project#o2` (a repository with bound parameters and a transaction), so the coding format elicits JDBC as well as SQL (`sql-intake-edu-003`, completed after `sql-intake-edu-001`).
  - MCQ (15): `relational-design/tables-keys-and-relationships#o2`, `relational-design/designing-tables-from-a-user-story#o3`, `relational-design/normalization-basics#o1`, `crud-aggregates-and-joins/insert-update-and-delete#o2`, `crud-aggregates-and-joins/filtering-and-sorting#o1`, `crud-aggregates-and-joins/handling-nulls-coalesce-and-case#o1`, `crud-aggregates-and-joins/aggregate-functions#o2`, `crud-aggregates-and-joins/group-by-and-having#o3`, `crud-aggregates-and-joins/anti-joins-and-self-joins#o1`, `reporting-indexes-and-review/subqueries-and-ctes#o2`, `reporting-indexes-and-review/window-functions-top-n-per-group#o3`, `reporting-indexes-and-review/indexes#o1`, `reporting-indexes-and-review/query-plans-with-explain#o2`, `reporting-indexes-and-review/jdbc-review#o2`, `reporting-indexes-and-review/jdbc-review#o3`.
  - coding (6): `relational-design/create-table-data-types-and-constraints#o2`, `crud-aggregates-and-joins/inner-and-left-joins#o2`, `crud-aggregates-and-joins/group-by-and-having#o2`, `reporting-indexes-and-review/window-functions-top-n-per-group#o2`, `reporting-indexes-and-review/jdbc-review#o1`, `reporting-indexes-and-review/jdbc-data-access-project#o2`.
  - `jdbc-review` objectives are listed, unlike course 1's review pages, because the course's JDBC instruction lives in one project brief: the review page's retrieval objectives let the check sample JDBC across all five F23 rows.
- Allowed resources: the calendar states no AI or resource rule for the F24 Module check block (its "without AI" wording belongs to the separate "Practice without AI" block), so the blueprint states none and defers to the platform assessment owner; the coding environment is whatever the platform provides. The repository invents no assessment policy.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its key names.

## Official sources per topic

Sources were fetched live on 2026-10-12 (21:10:55Z-21:11:20Z, plus four sources added at reconciliation 21:54:18Z-21:54:21Z) with HTTP GET following redirects; `evidence/sql-jdbc-foundations/source-snapshot.json` records each URL with retrieval time, the sha256 of the fetched bytes and the sections used per topic. All 70 URLs returned HTTP 200; raw fetched pages are not committed. Versions: PostgreSQL documentation `current` resolved to PostgreSQL 18; Java SE API pages are Java SE 25; the JUnit `current` user-guide URL redirected to the versioned 6.1.3 overview, recorded under the requested URL. The Microsoft Learn normalization article redirected to its `previous-versions` URL, which is recorded.
First-party only: postgresql.org (PostgreSQL documentation and downloads), jdbc.postgresql.org (pgJDBC driver), docs.oracle.com (Java Tutorials JDBC trail and Java SE 25 API), OWASP Cheat Sheet Series (SQL injection defenses), Microsoft Learn (database normalization description), maven.apache.org and docs.junit.org (lab plan).

| Topic | Official sources |
|---|---|
| `installing-postgres-and-a-sql-client` | https://www.postgresql.org/download/<br>https://www.postgresql.org/docs/current/tutorial-install.html<br>https://www.postgresql.org/docs/current/tutorial-createdb.html<br>https://www.postgresql.org/docs/current/tutorial-accessdb.html<br>https://www.postgresql.org/docs/current/app-psql.html |
| `tables-keys-and-relationships` | https://www.postgresql.org/docs/current/ddl-basics.html<br>https://www.postgresql.org/docs/current/ddl-constraints.html<br>https://www.postgresql.org/docs/current/tutorial-fk.html |
| `designing-tables-from-a-user-story` | https://www.postgresql.org/docs/current/ddl-basics.html<br>https://www.postgresql.org/docs/current/ddl-constraints.html<br>https://www.postgresql.org/docs/current/tutorial-table.html |
| `normalization-basics` | https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/access/database-normalization-description<br>https://www.postgresql.org/docs/current/ddl-constraints.html<br>https://www.postgresql.org/docs/current/tutorial-fk.html |
| `create-table-data-types-and-constraints` | https://www.postgresql.org/docs/current/sql-createtable.html<br>https://www.postgresql.org/docs/current/datatype.html<br>https://www.postgresql.org/docs/current/datatype-numeric.html<br>https://www.postgresql.org/docs/current/datatype-character.html<br>https://www.postgresql.org/docs/current/datatype-datetime.html<br>https://www.postgresql.org/docs/current/datatype-boolean.html<br>https://www.postgresql.org/docs/current/ddl-default.html<br>https://www.postgresql.org/docs/current/ddl-constraints.html |
| `insert-update-and-delete` | https://www.postgresql.org/docs/current/dml-insert.html<br>https://www.postgresql.org/docs/current/dml-update.html<br>https://www.postgresql.org/docs/current/dml-delete.html<br>https://www.postgresql.org/docs/current/dml-returning.html<br>https://www.postgresql.org/docs/current/sql-insert.html<br>https://www.postgresql.org/docs/current/sql-update.html<br>https://www.postgresql.org/docs/current/sql-delete.html |
| `seeding-sample-data` | https://www.postgresql.org/docs/current/tutorial-populate.html<br>https://www.postgresql.org/docs/current/sql-insert.html<br>https://www.postgresql.org/docs/current/functions-srf.html<br>https://www.postgresql.org/docs/current/sql-copy.html<br>https://www.postgresql.org/docs/current/app-psql.html |
| `filtering-and-sorting` | https://www.postgresql.org/docs/current/queries-table-expressions.html<br>https://www.postgresql.org/docs/current/functions-comparison.html<br>https://www.postgresql.org/docs/current/functions-matching.html<br>https://www.postgresql.org/docs/current/queries-order.html |
| `handling-nulls-coalesce-and-case` | https://www.postgresql.org/docs/current/functions-comparison.html<br>https://www.postgresql.org/docs/current/functions-conditional.html |
| `aggregate-functions` | https://www.postgresql.org/docs/current/tutorial-agg.html<br>https://www.postgresql.org/docs/current/functions-aggregate.html<br>https://www.postgresql.org/docs/current/sql-expressions.html |
| `group-by-and-having` | https://www.postgresql.org/docs/current/queries-table-expressions.html<br>https://www.postgresql.org/docs/current/tutorial-agg.html<br>https://www.postgresql.org/docs/current/sql-select.html |
| `inner-and-left-joins` | https://www.postgresql.org/docs/current/tutorial-join.html<br>https://www.postgresql.org/docs/current/queries-table-expressions.html |
| `anti-joins-and-self-joins` | https://www.postgresql.org/docs/current/tutorial-join.html<br>https://www.postgresql.org/docs/current/queries-table-expressions.html<br>https://www.postgresql.org/docs/current/functions-subquery.html |
| `subqueries-and-ctes` | https://www.postgresql.org/docs/current/functions-subquery.html<br>https://www.postgresql.org/docs/current/sql-expressions.html<br>https://www.postgresql.org/docs/current/queries-with.html |
| `window-functions-top-n-per-group` | https://www.postgresql.org/docs/current/tutorial-window.html<br>https://www.postgresql.org/docs/current/functions-window.html<br>https://www.postgresql.org/docs/current/sql-expressions.html<br>https://www.postgresql.org/docs/current/queries-with.html |
| `indexes` | https://www.postgresql.org/docs/current/indexes.html<br>https://www.postgresql.org/docs/current/indexes-intro.html<br>https://www.postgresql.org/docs/current/indexes-types.html<br>https://www.postgresql.org/docs/current/indexes-multicolumn.html<br>https://www.postgresql.org/docs/current/sql-createindex.html<br>https://www.postgresql.org/docs/current/ddl-constraints.html |
| `query-plans-with-explain` | https://www.postgresql.org/docs/current/using-explain.html<br>https://www.postgresql.org/docs/current/sql-explain.html |
| `sql-review-joins-grouping-window-functions` | https://www.postgresql.org/docs/current/tutorial-join.html<br>https://www.postgresql.org/docs/current/queries-table-expressions.html<br>https://www.postgresql.org/docs/current/tutorial-window.html<br>https://www.postgresql.org/docs/current/tutorial.html |
| `jdbc-data-access-project` | https://docs.oracle.com/javase/tutorial/jdbc/basics/connecting.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/processingsqlstatements.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/retrieving.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/DriverManager.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/Connection.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/PreparedStatement.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/ResultSet.html<br>https://jdbc.postgresql.org/documentation/use/<br>https://jdbc.postgresql.org/documentation/query/<br>https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html<br>https://www.postgresql.org/docs/current/tutorial-transactions.html<br>https://www.postgresql.org/docs/current/transaction-iso.html<br>https://www.postgresql.org/docs/current/libpq-envars.html<br>https://www.postgresql.org/docs/current/sql-createdatabase.html<br>https://www.postgresql.org/docs/current/sql-dropdatabase.html |
| `jdbc-review` | https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/connecting.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/processingsqlstatements.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/retrieving.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/DriverManager.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/Connection.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/PreparedStatement.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/ResultSet.html<br>https://jdbc.postgresql.org/documentation/use/<br>https://jdbc.postgresql.org/documentation/query/<br>https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html<br>https://www.postgresql.org/docs/current/tutorial-transactions.html<br>https://www.postgresql.org/docs/current/transaction-iso.html |
| lab plan | https://jdbc.postgresql.org/documentation/use/<br>https://www.postgresql.org/docs/current/libpq-envars.html<br>https://www.postgresql.org/docs/current/sql-createdatabase.html<br>https://www.postgresql.org/docs/current/sql-dropdatabase.html<br>https://www.postgresql.org/docs/current/app-psql.html<br>https://maven.apache.org/plugins/maven-dependency-plugin/go-offline-mojo.html<br>https://docs.junit.org/current/user-guide/ |

Calendar references for technology `sql`: [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html) and [JDBC basics](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html); both are in the snapshot.

Gaps (recorded, not invented):

- `normalization-basics` (closed at reconciliation, `sql-sme-003`): the PostgreSQL manual covers the keys and constraints a normalized design uses but not normalization theory, so the Microsoft Learn "Database normalization description" (redundancy, inconsistent dependency, first to third normal form) is added and mapped to o1 and o2; the PostgreSQL key and constraint sources stay.
- "Anti-join" is not a PostgreSQL documentation term; `anti-joins-and-self-joins` grounds the pattern in the documented `NOT EXISTS`, `NOT IN` and outer-join semantics.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; module PR SME criticism verifies the authored bytes against these frozen sources and refreshes any older than the T15 window.

## Intake criticism

Fresh independent educational and technology-SME critics reviewed the first intake commit; their reports and the non-author reconciliation are committed unchanged as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`. Outcome: all 7 findings accepted and applied in one correction loop. `sql-intake-edu-001` was escalated and the captain chose option A for project rows (`pep-project-rows`), so the reconciliation file was re-copied with that decision.

Changes applied:

- Labs use learner-local PostgreSQL through pgJDBC and real `psql`, no H2 and no container (`sql-intake-edu-002`, `sql-sme-001`, `sql-sme-002`).
- Blueprint coding maps `jdbc-review#o1`; `jdbc-review` o1 reads "Retrieve and apply" so the coding format can elicit it (`sql-intake-edu-003`).
- `filtering-and-sorting` o3 no longer adds pagination; it is now deterministic ordering with explicit sort keys, and the blueprint maps `filtering-and-sorting#o1` (`sql-intake-edu-004`); the LIMIT and OFFSET source is removed from the snapshot.
- A first-party normalization source closes that gap (`sql-sme-003`).
- F23 gets one canonical project artifact, `jdbc-data-access-project` (lab-brief, topic coding lab), with outcomes, prerequisite alignment, scaffold and public tests planned above; the blueprint coding part also maps `jdbc-data-access-project#o2` (`sql-intake-edu-001`, `sql-intake-edu-003`).
