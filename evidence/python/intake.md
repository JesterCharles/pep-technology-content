# Course intake: Python

Course intake for `python` (calendar technology `python`, Standard days S14-S19, Fast Track days FT9-FT11).
This intake ships the course, module and topic manifests, the S19/FT11 module-check blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Confirmed coverage matrix v3 (read-only, frozen): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`). Its 43 `python` topic-string rows are the authoritative topic inventory and expected-artifact scope.
- Repository contracts on `main`: `AGENTS.md`, `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/*.md`, `schemas/`, and the new-course budget rule in `docs/tools/validators.md`.
- Plan: approved PEP technology-content plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Terminal foundation: `components/terminal` version 1 (from the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`): form-free direct Run-button and Enter-key dispatch, captain-confirmed working in Evolv (platform success, not a captured trace). Reused as is, not re-derived.

## Course slice

| Day | Track | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|---|
| S14 | Standard | Python for Java devs | Concept | `/tracks/1/weeks/2/days/3` | 0. Python syntax for Java developers; 1. Functions and arguments; 2. Lists, dicts, sets and tuples; 3. Slicing and comprehensions |
| S15 | Standard | Modules, scripts and pytest | Concept | `/tracks/1/weeks/2/days/4` | 0. Mutability and aliasing; 1. Modules, imports and virtual environments; 2. Exceptions and logging; 3. Writing and running script files; 4. Testing with pytest |
| S16 | Standard | Extract and load | Lab | `/tracks/1/weeks/3/days/0` | 0. Reading CSV and JSON files with generators; 1. Connecting to Postgres from Python with psycopg; 2. Loading into a staging table with upserts; 3. ELT: transforming in SQL after loading |
| S17 | Standard | Transform with AI enrichment | Lab | `/tracks/1/weeks/3/days/1` | 0. Cleaning and validating records with Pydantic and type hints; 1. Deduplicating: in SQL vs in Python; 2. AI enrichment with validated outputs; 3. Reading: keeping sensitive data out of prompts |
| S18 | Standard | FastAPI and service calls | Concept | `/tracks/1/weeks/3/days/2` | 0. FastAPI routes; 1. Serving pipeline results as an API; 2. Calling the Spring Boot API from FastAPI: service URL, token and timeouts |
| S19 | Standard | Python review and check | Review | `/tracks/1/weeks/3/days/3` | 0. Python review; 1. Python module check |
| FT9 | Fast | Python for Java devs + Modules, scripts and pytest | Fast (from S14-S15) | `/tracks/2/weeks/1/days/3` | 0-5. the S14 rows plus modules/venv and pytest; 6-8. mutability, exceptions and logging, script files, each "(skim)" |
| FT10 | Fast | Extract and load + Transform with AI enrichment | Fast (from S16-S17) | `/tracks/2/weeks/1/days/4` | 0. Reading CSV and JSON files with generators; 1. Loading into a staging table with psycopg and upserts; 2. Cleaning and validating records with Pydantic and type hints; 3. ELT (skim); 4. Deduplicating (skim) |
| FT11 | Fast | FastAPI and service calls + Python review and check | Fast (from S18-S19) | `/tracks/2/weeks/2/days/0` | 0. AI enrichment with validated outputs; 1. FastAPI routes that serve pipeline results; 2. Calling the Spring Boot API from FastAPI: service URL, token and timeouts; 3. Keeping sensitive data out of prompts (skim); 4. Python module check |

S19 and FT11 both carry the calendar assessment `moduleCheck` (formats `MCQ` and `coding`, pass mark 70); both map to the one course-level blueprint below. No day in the slice sets `requiredLab: true`.

## Module map (second-mate grouping decision)

The snapshot gives `python` no module grouping or count (discrepancy `source-gap-python-modules`, category A, sequenced to this intake). This intake records the following grouping as a **second-mate grouping decision, not syllabus**: modules follow calendar day sequence, two Standard days per module, each the batch unit for one module PR. It changes no topic, day or order in the calendar, and the decision is visible for approval at merge.

| Module | Title | Standard days | Fast days | Topics |
|---|---|---|---|---|
| `python-fundamentals` | Python Fundamentals for Java Developers | S14-S15 | FT9 | 9 |
| `data-pipelines` | Data Pipelines: Extract, Load and Transform | S16-S17 | FT10, FT11 rows 0 and 3 | 8 |
| `fastapi-services` | FastAPI Services | S18-S19 | FT11 rows 1-2 | 4 |

Total: 21 canonical topics (20 instructional rows, 19 core plus 1 Reading, and 1 review row), matching plan section 2.3 (19 core, 1 reading, 2 review/other).
Why this grouping: S14-S15 are language fundamentals that FT9 packs into one day; S16-S17 are the two Lab days that build one extract-validate-enrich-load pipeline and share one module lab; S18-S19 serve that pipeline over HTTP and review the course. Alternatives rejected: one module per day (S19 would hold a single review topic, and S16/S17 would split the shared lab), and one course-wide module (21 topics, too large a batch for one author context and one PR).

## Topic list with relations

One canonical topic per instructional calendar row (core and Reading). Topic ids are the matrix v3 proposed slugs. Relations: `exact` maps a row to one topic; `split` maps one row to several topics that each cover part of it. The `(skim)` suffix on Fast rows is track emphasis metadata, not a separate page, so those rows map `exact`.

| # | Topic | Module | Kind | Mappings (day, pointer, relation, calendar row) |
|---|---|---|---|---|
| 1 | `python-syntax-for-java-developers` | `python-fundamentals` | core | S14 `/tracks/1/weeks/2/days/3/topics/0` exact: Python syntax for Java developers<br>FT9 `/tracks/2/weeks/1/days/3/topics/0` exact: Python syntax for Java developers |
| 2 | `functions-and-arguments` | `python-fundamentals` | core | S14 `/tracks/1/weeks/2/days/3/topics/1` exact: Functions and arguments<br>FT9 `/tracks/2/weeks/1/days/3/topics/1` exact: Functions and arguments |
| 3 | `lists-dicts-sets-and-tuples` | `python-fundamentals` | core | S14 `/tracks/1/weeks/2/days/3/topics/2` exact: Lists, dicts, sets and tuples<br>FT9 `/tracks/2/weeks/1/days/3/topics/2` exact: Lists, dicts, sets and tuples |
| 4 | `slicing-and-comprehensions` | `python-fundamentals` | core | S14 `/tracks/1/weeks/2/days/3/topics/3` exact: Slicing and comprehensions<br>FT9 `/tracks/2/weeks/1/days/3/topics/3` exact: Slicing and comprehensions |
| 5 | `mutability-and-aliasing` | `python-fundamentals` | core | S15 `/tracks/1/weeks/2/days/4/topics/0` exact: Mutability and aliasing<br>FT9 `/tracks/2/weeks/1/days/3/topics/6` exact: Mutability and aliasing (skim) |
| 6 | `modules-imports-and-virtual-environments` | `python-fundamentals` | core | S15 `/tracks/1/weeks/2/days/4/topics/1` exact: Modules, imports and virtual environments<br>FT9 `/tracks/2/weeks/1/days/3/topics/4` exact: Modules, imports and virtual environments |
| 7 | `exceptions-and-logging` | `python-fundamentals` | core | S15 `/tracks/1/weeks/2/days/4/topics/2` exact: Exceptions and logging<br>FT9 `/tracks/2/weeks/1/days/3/topics/7` exact: Exceptions and logging (skim) |
| 8 | `writing-and-running-script-files` | `python-fundamentals` | core | S15 `/tracks/1/weeks/2/days/4/topics/3` exact: Writing and running script files<br>FT9 `/tracks/2/weeks/1/days/3/topics/8` exact: Writing and running script files (skim) |
| 9 | `testing-with-pytest` | `python-fundamentals` | core | S15 `/tracks/1/weeks/2/days/4/topics/4` exact: Testing with pytest<br>FT9 `/tracks/2/weeks/1/days/3/topics/5` exact: Testing with pytest |
| 10 | `reading-csv-and-json-files-with-generators` | `data-pipelines` | core | S16 `/tracks/1/weeks/3/days/0/topics/0` exact: Reading CSV and JSON files with generators<br>FT10 `/tracks/2/weeks/1/days/4/topics/0` exact: Reading CSV and JSON files with generators |
| 11 | `connecting-to-postgres-from-python-with-psycopg` | `data-pipelines` | core | S16 `/tracks/1/weeks/3/days/0/topics/1` exact: Connecting to Postgres from Python with psycopg |
| 12 | `loading-into-a-staging-table-with-upserts` | `data-pipelines` | core | S16 `/tracks/1/weeks/3/days/0/topics/2` exact: Loading into a staging table with upserts<br>FT10 `/tracks/2/weeks/1/days/4/topics/1` exact: Loading into a staging table with psycopg and upserts |
| 13 | `elt-transforming-in-sql-after-loading` | `data-pipelines` | core | S16 `/tracks/1/weeks/3/days/0/topics/3` exact: ELT: transforming in SQL after loading<br>FT10 `/tracks/2/weeks/1/days/4/topics/3` exact: ELT: transforming in SQL after loading (skim) |
| 14 | `cleaning-and-validating-records-with-pydantic-and-type-hints` | `data-pipelines` | core | S17 `/tracks/1/weeks/3/days/1/topics/0` exact: Cleaning and validating records with Pydantic and type hints<br>FT10 `/tracks/2/weeks/1/days/4/topics/2` exact: Cleaning and validating records with Pydantic and type hints |
| 15 | `deduplicating-in-sql-vs-in-python` | `data-pipelines` | core | S17 `/tracks/1/weeks/3/days/1/topics/1` exact: Deduplicating: in SQL vs in Python<br>FT10 `/tracks/2/weeks/1/days/4/topics/4` exact: Deduplicating: in SQL vs in Python (skim) |
| 16 | `ai-enrichment-with-validated-outputs` | `data-pipelines` | core | S17 `/tracks/1/weeks/3/days/1/topics/2` exact: AI enrichment with validated outputs<br>FT11 `/tracks/2/weeks/2/days/0/topics/0` exact: AI enrichment with validated outputs |
| 17 | `keeping-sensitive-data-out-of-prompts` | `data-pipelines` | reading | S17 `/tracks/1/weeks/3/days/1/topics/3` exact: Reading: keeping sensitive data out of prompts<br>FT11 `/tracks/2/weeks/2/days/0/topics/3` exact: Keeping sensitive data out of prompts (skim) |
| 18 | `fastapi-routes` | `fastapi-services` | core | S18 `/tracks/1/weeks/3/days/2/topics/0` exact: FastAPI routes<br>FT11 `/tracks/2/weeks/2/days/0/topics/1` split: FastAPI routes that serve pipeline results |
| 19 | `serving-pipeline-results-as-an-api` | `fastapi-services` | core | S18 `/tracks/1/weeks/3/days/2/topics/1` exact: Serving pipeline results as an API<br>FT11 `/tracks/2/weeks/2/days/0/topics/1` split: FastAPI routes that serve pipeline results |
| 20 | `calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts` | `fastapi-services` | core | S18 `/tracks/1/weeks/3/days/2/topics/2` exact: Calling the Spring Boot API from FastAPI: service URL, token and timeouts<br>FT11 `/tracks/2/weeks/2/days/0/topics/2` exact: Calling the Spring Boot API from FastAPI: service URL, token and timeouts |
| 21 | `python-review` | `fastapi-services` | review | S19 `/tracks/1/weeks/3/days/3/topics/0` exact: Python review |

Rows that are not learner topics:

- S19 row 1 and FT11 row 4 "Python module check": the course-level blueprint `python/assessments/python-module-check` (never a learner topic).
- S19 row 0 "Python review": review page `fastapi-services/python-review` (kind `review`, no new syllabus). It is Standard-only; Fast has no review row.

Coverage: all 43 matrix v3 topic-string rows map — 41 to a canonical topic (FT11 row 1 to two, per the confirmed matrix) and 2 to the blueprint. No topic was added, merged or renamed beyond the calendar.

Relation notes:

- FT11 row 1 "FastAPI routes that serve pipeline results" combines S18 rows 0 and 1; per the confirmed matrix it is `split` across `fastapi-routes` and `serving-pipeline-results-as-an-api`.
- FT10 row 1 "Loading into a staging table with psycopg and upserts" is a wording variant of S16 row 2 and maps `exact` to `loading-into-a-staging-table-with-upserts`, as the matrix does. S16 row 1 (`connecting-to-postgres-from-python-with-psycopg`) has no Fast row, so the loading page must recap the psycopg connection basics it uses for Fast learners; that topic stays Standard depth.
- FT11 row 0 (AI enrichment) and row 3 (sensitive data, skim) are Fast's placement of S17 rows 2 and 3; they keep their `data-pipelines` home.

Prerequisites: in-course prerequisites use full `python/<module>/<topic>` ids. Cross-course prerequisites name course ids only (`git-linux-ai-foundations`, `java-foundations`, `sql-jdbc-foundations`, `spring-boot`) until those courses' topic ids exist; `java-foundations`, `sql-jdbc-foundations` and `spring-boot` are planned intake ids.

### Objectives

Two or three observable objectives per topic, with exact ids (also in each `topic.json`):

- `python-fundamentals/python-syntax-for-java-developers`
  - o1: Rewrite a short Java method body that uses variables, if/elif/else and for and while loops as Python, using indentation instead of braces and no type declarations
  - o2: Predict the output of short Python snippets that depend on dynamic typing, truthiness and true division (/) versus floor division (//)
  - o3: Compare values with == and test for None with `is None`, and explain how this differs from Java's equals(), == and null
- `python-fundamentals/functions-and-arguments`
  - o1: Define a function with positional and default parameters and call it with keyword arguments in any order
  - o2: Write a function that accepts *args and **kwargs, and unpack a list or dict into a call with * and **
  - o3: Add type hints to parameters and the return value, and explain that Python does not enforce them at run time
- `python-fundamentals/lists-dicts-sets-and-tuples`
  - o1: Choose a list, dict, set or tuple for a described data need and justify the choice by ordering, uniqueness, mutability and lookup by key
  - o2: Add, look up, update and remove entries in a list and a dict, using dict.get to handle a missing key without a KeyError
  - o3: Iterate over a dict with items() and unpack each key-value pair into two variables
- `python-fundamentals/slicing-and-comprehensions`
  - o1: Predict the result of slices with start, stop, negative indices and a step on lists and strings
  - o2: Rewrite a for loop that filters and transforms a list as a list comprehension, and build a dict or set with a comprehension
  - o3: Decide between a comprehension and an explicit loop for a given task, rejecting a comprehension used only for its side effects
- `python-fundamentals/mutability-and-aliasing`
  - o1: Predict when two names refer to the same object after assignment, list append and passing a list to a function, and confirm it with `is`
  - o2: Classify list, dict and set as mutable and int, str and tuple as immutable by predicting whether an operation changes the original object
  - o3: Fix an aliasing bug by copying (slice, list(), dict.copy() or copy.deepcopy) or by replacing a mutable default argument with None
- `python-fundamentals/modules-imports-and-virtual-environments`
  - o1: Import from the standard library and from your own module with import and from ... import, and explain how Python finds the module
  - o2: Create and activate a virtual environment with python -m venv on macOS, Linux and Windows, and install a pinned package into it with python -m pip
  - o3: Record and reinstall dependencies with a requirements file, and explain why the virtual environment folder is git-ignored rather than committed
- `python-fundamentals/exceptions-and-logging`
  - o1: Handle an expected error with try, except, else and finally, catching a specific exception instead of using a bare except
  - o2: Raise an exception with a clear message, including a custom exception class, and explain how Python exceptions differ from Java's checked exceptions
  - o3: Use the logging module instead of print: get a module logger, choose a level and log a caught exception with its traceback
- `python-fundamentals/writing-and-running-script-files`
  - o1: Write a .py script and run it from the terminal with python (or py on Windows), then read its exit status
  - o2: Guard top-level code with if __name__ == "__main__": so the same file can be imported and run
  - o3: Read command-line arguments with sys.argv and exit with a non-zero status when an argument is missing
- `python-fundamentals/testing-with-pytest`
  - o1: Write test functions with plain assert statements in a test_*.py file and run them with python -m pytest
  - o2: Read a pytest failure report to locate the failing assertion and the values it compared
  - o3: Use pytest.raises, a fixture and @pytest.mark.parametrize to test error cases and several inputs without repeating code
- `data-pipelines/reading-csv-and-json-files-with-generators`
  - o1: Read rows from a CSV file with csv.DictReader and records from a JSON file, opening each file in a with statement with an explicit encoding
  - o2: Write a generator function with yield that streams parsed records one at a time, and explain why it keeps memory use flat on a large file
  - o3: Chain generators into an extract step (read, parse, filter) and predict what happens when a generator is iterated a second time
- `data-pipelines/connecting-to-postgres-from-python-with-psycopg`
  - o1: Connect to a learner-local PostgreSQL database with psycopg.connect, reading the connection string from an environment variable instead of hard-coding it
  - o2: Run a parameterized query with %s placeholders and fetch its rows, and explain why formatting values into the SQL string invites SQL injection
  - o3: Manage the connection and transaction with with blocks, predicting when psycopg commits and when it rolls back
- `data-pipelines/loading-into-a-staging-table-with-upserts`
  - o1: Load parsed records into a staging table in batches with executemany or COPY instead of one statement per row
  - o2: Write an INSERT ... ON CONFLICT ... DO UPDATE upsert keyed on a unique constraint and predict the table after the same load runs twice
  - o3: Explain why the load is made idempotent so a failed or repeated run leaves no duplicate rows
- `data-pipelines/elt-transforming-in-sql-after-loading`
  - o1: Distinguish ETL from ELT and explain why this pipeline loads raw rows first and transforms them inside PostgreSQL
  - o2: Write an INSERT ... SELECT or CREATE TABLE AS statement with a common table expression that cleans and reshapes staging rows into a target table
  - o3: Run the SQL transform from Python inside one transaction so that a failure leaves the target table unchanged
- `data-pipelines/cleaning-and-validating-records-with-pydantic-and-type-hints`
  - o1: Define a Pydantic model with type-hinted required, optional and defaulted fields for one input record
  - o2: Validate raw records, separating accepted rows from rejected rows by catching ValidationError and recording its error details
  - o3: Normalize a field with a field validator and predict which raw inputs Pydantic converts and which it rejects
- `data-pipelines/deduplicating-in-sql-vs-in-python`
  - o1: Remove duplicates in Python with a set or a dict keyed on a chosen natural key, keeping either the first or the latest record
  - o2: Remove duplicates in SQL with DISTINCT ON or ROW_NUMBER() over a partition
  - o3: Choose where to deduplicate, in Python before loading or in SQL after loading, for a described data size and pipeline step, and justify the choice
- `data-pipelines/ai-enrichment-with-validated-outputs`
  - o1: Explain why model output is untrusted input, and design an enrichment step that requests JSON matching a declared schema
  - o2: Validate each model response against a Pydantic model and send invalid or failed responses to a retry or reject path instead of loading them
  - o3: Test the enrichment step offline with a fake model client that returns fixed valid and invalid responses
- `data-pipelines/keeping-sensitive-data-out-of-prompts`
  - o1: Identify the personal and secret fields in a record that must not be sent to an external AI service
  - o2: Minimize a record before it goes into a prompt by dropping, masking or pseudonymizing those fields
  - o3: Keep secrets and personal data out of the logs and error messages that the enrichment step writes
- `fastapi-services/fastapi-routes`
  - o1: Define GET and POST routes with path and query parameters and a Pydantic request body, and run the app locally
  - o2: Predict the status code and error body FastAPI returns when a path parameter, query parameter or request body fails validation
  - o3: Test routes with FastAPI's TestClient and pytest
- `fastapi-services/serving-pipeline-results-as-an-api`
  - o1: Expose loaded pipeline results through read-only endpoints with a response model that limits the fields returned
  - o2: Return 404 with HTTPException for a missing record, and page results with limit and offset query parameters
  - o3: Provide the database connection to routes as a dependency, and replace it in tests with a dependency override
- `fastapi-services/calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts`
  - o1: Call the Spring Boot API from a FastAPI route with httpx, reading the service base URL and bearer token from settings loaded from environment variables
  - o2: Set explicit timeouts and turn a timeout, connection error or non-2xx upstream response into a clear error response from your own API
  - o3: Test the outbound call without a running Spring Boot service by using an httpx mock transport
- `fastapi-services/python-review`
  - o1: Retrieve and apply Python syntax, collections, mutability, exceptions and pytest on mixed practice tasks without new material
  - o2: Trace a small extract, validate, load and serve flow end to end and locate where a described defect (aliasing, missing validation or missing timeout) would surface

## Cross-track model

Standard and Fast Track share this one canonical tree; there are no per-track copies. Standard adds the coding lab through its lab overlay; Fast skips coding labs and moves to direct project implementation. Fast's emphasis (`skim`) and day packing are track-overlay metadata, written when the track overlays are built, not in this course tree.

## Artifact applicability

Rules (plan section 5 and the confirmed matrix v3 expected-artifact scope): core topics require HTML (with embedded simulator practice), derived Markdown and a practice GIFT quiz, with a video only when a suitable verified one qualifies; the Reading topic also carries a printable PDF (matrix `print-handout`); the review topic carries HTML (with simulator) and Markdown only; absent companions record a reason.

Legend: **R** required, authored in the module PR; **V** conditional video, authored only if a live, public, embeddable video qualifies within budget, otherwise absent with the search record; **M** practised in the planned `data-pipelines` module lab (Standard lab overlay), with the topic-level `coding-lab/` absent; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `python-fundamentals/python-syntax-for-java-developers` | core | R | R | - | R | V | - |
| `python-fundamentals/functions-and-arguments` | core | R | R | - | R | V | - |
| `python-fundamentals/lists-dicts-sets-and-tuples` | core | R | R | - | R | V | - |
| `python-fundamentals/slicing-and-comprehensions` | core | R | R | - | R | V | - |
| `python-fundamentals/mutability-and-aliasing` | core | R | R | - | R | V | - |
| `python-fundamentals/modules-imports-and-virtual-environments` | core | R | R | - | R | V | - |
| `python-fundamentals/exceptions-and-logging` | core | R | R | - | R | V | - |
| `python-fundamentals/writing-and-running-script-files` | core | R | R | - | R | V | - |
| `python-fundamentals/testing-with-pytest` | core | R | R | - | R | V | - |
| `data-pipelines/reading-csv-and-json-files-with-generators` | core | R | R | - | R | V | M |
| `data-pipelines/connecting-to-postgres-from-python-with-psycopg` | core | R | R | - | R | V | M |
| `data-pipelines/loading-into-a-staging-table-with-upserts` | core | R | R | - | R | V | M |
| `data-pipelines/elt-transforming-in-sql-after-loading` | core | R | R | - | R | V | M |
| `data-pipelines/cleaning-and-validating-records-with-pydantic-and-type-hints` | core | R | R | - | R | V | M |
| `data-pipelines/deduplicating-in-sql-vs-in-python` | core | R | R | - | R | V | M |
| `data-pipelines/ai-enrichment-with-validated-outputs` | core | R | R | - | R | V | M |
| `data-pipelines/keeping-sensitive-data-out-of-prompts` | reading | R | R | R | R | V | M |
| `fastapi-services/fastapi-routes` | core | R | R | - | R | V | - |
| `fastapi-services/serving-pipeline-results-as-an-api` | core | R | R | - | R | V | - |
| `fastapi-services/calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts` | core | R | R | - | R | V | - |
| `fastapi-services/python-review` | review | R | R | - | - | - | - |

Terminal interaction: pages whose simulators show terminal commands (`modules-imports-and-virtual-environments`, `writing-and-running-script-files`, `testing-with-pytest`, and running the app in `fastapi-routes`) reuse `components/terminal` version 1 unchanged and declare `"components": {"terminal": "1"}` in their module PR (T24 drift check). Its form-free direct Run/Enter dispatch is the canonical terminal foundation for every track; it is not redesigned here. Intake `components` stay empty because no page exists yet.

## Lab plan

No lab uses Docker, Podman, Compose, Testcontainers or any other learner-side container engine. Each lab has exactly one language-native test command, runnable on macOS, Linux and Windows.

| Lab | Scope | Covers | Test command | Track | Status |
|---|---|---|---|---|---|
| `python/data-pipelines/coding-lab` | module | all 8 `data-pipelines` topics (S16-S17 Lab days) | `python -m pytest -q` | Standard lab overlay; Fast skips it | planned, authored in the `data-pipelines` module PR |

Planned `data-pipelines` lab design, for the module author and critics:

- Setup (one time, online): create a virtual environment with `python -m venv .venv`, then `python -m pip install -r requirements.txt` with pinned versions and a committed lock of exact versions. Version pins start from the PyPI releases frozen at intake (pytest 9.1.1, psycopg 3.3.6, pydantic 2.14.1); the author pins the stable releases current at authoring and records them in `lab.json`.
- Database: a learner-local PostgreSQL server installed natively (the platform's PostgreSQL from the SQL course), never a container. The lab creates and drops its own database or schema, read from an environment variable connection string, and `lab.json` declares it for cleanup.
- AI enrichment: tests use a deterministic fake model client with fixed valid and invalid responses; no network, API key or vendor account. The redaction step for `keeping-sensitive-data-out-of-prompts` is tested on fixture records.
- Determinism: fixed fixtures, no wall clock, network or locale dependence; the starter fails named public tests with stable messages.
- No reference solution, hidden test or key is committed; the solved-run gate runs locally against uncommitted private staging (`docs/lab-contract.md` section 8).

No lab, with reason:

- `python-fundamentals` (S14-S15) and `fastapi-services` (S18): the confirmed expected-artifact scope gives these Concept-day topics no lab overlay. Page simulators carry the practice, and the `data-pipelines` lab exercises venv, script and pytest skills on the real toolchain. `fastapi-services` practice of TestClient and the httpx mock transport stays in-page. The educational critic confirms each omission.
- `python-review`: the S19 Review day's "Practice without AI" platform block covers hands-on practice.
- No course lab; `course.json` `courseLabs` is empty.

## Minute budgets

Rule: the revised new-course budget rule merged on `main` (`docs/tools/validators.md`, Reading time): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, at most 15, never a weighted share of a day pool, and the topic budgets mapped to a calendar day must fit that day type's complete block total (120 minutes for Concept, Lab, Review and Fast days).

Basis at intake: no `artifact.html` exists, so the estimator cannot run. Each topic records an intake planning model in `minutes.basis`: `modeledP50` is the target page time (core 9, Reading 6, review 9 minutes), `modeledWorstPath` adds 2.5 minutes for the worst required route (two wrong graded attempts and wrong-first explores per interactive unit; course-1 measured gaps of 2.41-2.65 minutes above P50), and `budget = aboutLabel = ceil(max(modeledP50, modeledWorstPath))`. The module PR replaces `modeledP50` with the frozen estimator P50 on the authored bytes, re-models the worst path and keeps the budget at or above the rule's minimum; T14 then checks day totals.

| Topic | Days | modeledP50 | modeledWorstPath | budget = aboutLabel |
|---|---|---|---|---|
| `python-syntax-for-java-developers` | S14, FT9 | 9 | 11.5 | 12 |
| `functions-and-arguments` | S14, FT9 | 9 | 11.5 | 12 |
| `lists-dicts-sets-and-tuples` | S14, FT9 | 9 | 11.5 | 12 |
| `slicing-and-comprehensions` | S14, FT9 | 9 | 11.5 | 12 |
| `mutability-and-aliasing` | S15, FT9 | 9 | 11.5 | 12 |
| `modules-imports-and-virtual-environments` | S15, FT9 | 9 | 11.5 | 12 |
| `exceptions-and-logging` | S15, FT9 | 9 | 11.5 | 12 |
| `writing-and-running-script-files` | S15, FT9 | 9 | 11.5 | 12 |
| `testing-with-pytest` | S15, FT9 | 9 | 11.5 | 12 |
| `reading-csv-and-json-files-with-generators` | S16, FT10 | 9 | 11.5 | 12 |
| `connecting-to-postgres-from-python-with-psycopg` | S16 | 9 | 11.5 | 12 |
| `loading-into-a-staging-table-with-upserts` | S16, FT10 | 9 | 11.5 | 12 |
| `elt-transforming-in-sql-after-loading` | S16, FT10 | 9 | 11.5 | 12 |
| `cleaning-and-validating-records-with-pydantic-and-type-hints` | S17, FT10 | 9 | 11.5 | 12 |
| `deduplicating-in-sql-vs-in-python` | S17, FT10 | 9 | 11.5 | 12 |
| `ai-enrichment-with-validated-outputs` | S17, FT11 | 9 | 11.5 | 12 |
| `keeping-sensitive-data-out-of-prompts` | S17, FT11 | 6 | 8.5 | 9 |
| `fastapi-routes` | S18, FT11 | 9 | 11.5 | 12 |
| `serving-pipeline-results-as-an-api` | S18, FT11 | 9 | 11.5 | 12 |
| `calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts` | S18, FT11 | 9 | 11.5 | 12 |
| `python-review` | S19 | 9 | 11.5 | 12 |

Day totals of planned budgets against the 120-minute day: S14 48, S15 60, S16 48, S17 45, S18 36, S19 12, FT9 108, FT10 60, FT11 57.
FT9 carries all nine `python-fundamentals` pages and is the binding constraint: 12 minutes of headroom, so the module author must keep the module's measured budgets within a 120-minute FT9 total (an average of 13.3 minutes per page). If honest minimums overflow, T14 reports it and the overflow needs an explicit pacing decision outside the gate; budgets are never compressed.

## Python module check blueprint

`python/assessments/python-module-check/blueprint.json`, one course-level blueprint shared by Standard S19 and Fast FT11:

- Calendar identity copied verbatim from the snapshot `assessment` of both S19 and FT11 (identical): `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores, so `weights` is empty. `dayId` is `S19`, the Standard Review day whose "Module check" block sets the duration; the schema holds one day id, and the instructions and this intake record that FT11 uses the same check.
- Duration and item counts from the S19 Review day "Module check" block (MCQ + coding assessment, 45 minutes): MCQ 15 items in 15 minutes (about 1 minute per scenario item) and coding 2 short tasks in 30 minutes (about 15 minutes each); `durationMinutes` 45. The MCQ/coding split inside the 45 minutes is this intake's proposal; the calendar gives only the block total.
- Objectives: 21 exact `python/<module>/<topic>#<objective-id>` references with `objectiveFormats`. Only topics that both tracks study are assessed, so `connecting-to-postgres-from-python-with-psycopg` and `python-review` are excluded. MCQ checks one objective per item across all three modules; the coding tasks check hands-on objectives that need only Python, pytest and Pydantic (no database server, network or AI service).
  - MCQ (15): `python-syntax-for-java-developers#o2`, `functions-and-arguments#o1`, `lists-dicts-sets-and-tuples#o1`, `slicing-and-comprehensions#o1`, `mutability-and-aliasing#o1`, `modules-imports-and-virtual-environments#o1`, `exceptions-and-logging#o2`, `testing-with-pytest#o2`, `reading-csv-and-json-files-with-generators#o3`, `loading-into-a-staging-table-with-upserts#o2`, `elt-transforming-in-sql-after-loading#o1`, `ai-enrichment-with-validated-outputs#o1`, `keeping-sensitive-data-out-of-prompts#o1`, `fastapi-routes#o2`, `calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts#o2`.
  - coding (6 objectives over 2 tasks): `slicing-and-comprehensions#o2`, `exceptions-and-logging#o1`, `reading-csv-and-json-files-with-generators#o2`, `cleaning-and-validating-records-with-pydantic-and-type-hints#o2`, `deduplicating-in-sql-vs-in-python#o1`, `testing-with-pytest#o3`.
- Allowed resources: the frozen calendar states no resource rule for the S19 "Module check" block, so any rule is set and shown by the platform assessment owner; the repository invents no assessment policy. The coding part needs a Python 3 environment with pytest and Pydantic provided or named by the platform owner.
- Open pacing item (not decided here): the Fast day type has no 45-minute "Module check" block (its blocks are Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5), yet FT11 carries the same `moduleCheck`. Scheduling the check inside FT11 is a platform pacing matter outside this intake and outside assessment policy authority; it is flagged for firstmate.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its key names.

## Official sources per topic

Closes `source-gap-python-official-evidence` (category A, sequenced to this intake). On 2026-10-12 this intake fetched 81 live first-party sources: the Python documentation (docs.python.org, serving Python 3.15.0), the Python Packaging User Guide, pytest, psycopg 3, PostgreSQL 18, Pydantic, Claude Platform and OpenAI API structured-output guides, Claude Code data usage, OWASP GenAI LLM02:2025, FastAPI, HTTPX, RFC 6750, RFC 9110, Spring Boot reference, and PyPI release metadata for the lab pins. `evidence/python/source-snapshot.json` records each final URL (after redirects), retrieval time, sha256 of the fetched bytes and the topics and sections it supports. All 81 returned HTTP 200; no source was unreachable, so there are no source gaps. Raw fetched pages are not committed.

Notes for authors and SME critics:

- Redirects recorded at their final URL: `docs.python.org/3/library/stdtypes.html` and `library/exceptions.html` now serve from `docs.python.org/3/builtins/`; `docs.pydantic.dev/latest/...` serves from `pydantic.dev/docs/validation/latest/...`; Claude structured outputs from `platform.claude.com`; OpenAI structured outputs from `developers.openai.com`; `docs.pytest.org/` from `/en/stable/`.
- psycopg's documentation served the development build 3.3.7.dev1 while PyPI's latest release was 3.3.6; the module PR checks claims against the pinned stable release.
- Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; module PR SME criticism verifies the authored bytes against live sources and refreshes per-topic `sources.json` receipts.

| Topic | Official first-party sources (frozen in source-snapshot.json) |
|---|---|
| `python-syntax-for-java-developers` | https://docs.python.org/3/tutorial/<br>https://docs.python.org/3/tutorial/introduction.html<br>https://docs.python.org/3/tutorial/controlflow.html<br>https://docs.python.org/3/reference/lexical_analysis.html |
| `functions-and-arguments` | https://docs.python.org/3/tutorial/controlflow.html<br>https://docs.python.org/3/reference/compound_stmts.html<br>https://docs.python.org/3/library/typing.html |
| `lists-dicts-sets-and-tuples` | https://docs.python.org/3/tutorial/datastructures.html<br>https://docs.python.org/3/builtins/stdtypes.html |
| `slicing-and-comprehensions` | https://docs.python.org/3/tutorial/introduction.html<br>https://docs.python.org/3/tutorial/datastructures.html<br>https://docs.python.org/3/reference/expressions.html |
| `mutability-and-aliasing` | https://docs.python.org/3/tutorial/controlflow.html<br>https://docs.python.org/3/reference/datamodel.html<br>https://docs.python.org/3/library/copy.html<br>https://docs.python.org/3/faq/programming.html |
| `modules-imports-and-virtual-environments` | https://docs.python.org/3/tutorial/modules.html<br>https://docs.python.org/3/tutorial/venv.html<br>https://docs.python.org/3/library/venv.html<br>https://docs.python.org/3/reference/import.html<br>https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/ |
| `exceptions-and-logging` | https://docs.python.org/3/tutorial/errors.html<br>https://docs.python.org/3/builtins/exceptions.html<br>https://docs.python.org/3/howto/logging.html<br>https://docs.python.org/3/library/logging.html |
| `writing-and-running-script-files` | https://docs.python.org/3/tutorial/modules.html<br>https://docs.python.org/3/tutorial/interpreter.html<br>https://docs.python.org/3/using/cmdline.html<br>https://docs.python.org/3/library/__main__.html<br>https://docs.python.org/3/using/windows.html |
| `testing-with-pytest` | https://docs.pytest.org/en/stable/<br>https://docs.pytest.org/en/stable/getting-started.html<br>https://docs.pytest.org/en/stable/how-to/assert.html<br>https://docs.pytest.org/en/stable/how-to/fixtures.html<br>https://docs.pytest.org/en/stable/how-to/parametrize.html<br>https://docs.pytest.org/en/stable/how-to/usage.html |
| `reading-csv-and-json-files-with-generators` | https://docs.python.org/3/library/csv.html<br>https://docs.python.org/3/library/json.html<br>https://docs.python.org/3/howto/functional.html<br>https://docs.python.org/3/tutorial/classes.html |
| `connecting-to-postgres-from-python-with-psycopg` | https://www.psycopg.org/psycopg3/docs/basic/install.html<br>https://www.psycopg.org/psycopg3/docs/basic/usage.html<br>https://www.psycopg.org/psycopg3/docs/basic/params.html<br>https://www.psycopg.org/psycopg3/docs/basic/transactions.html<br>https://www.psycopg.org/psycopg3/docs/api/connections.html<br>https://www.postgresql.org/docs/current/libpq-connect.html |
| `loading-into-a-staging-table-with-upserts` | https://www.psycopg.org/psycopg3/docs/basic/usage.html<br>https://www.psycopg.org/psycopg3/docs/basic/params.html<br>https://www.psycopg.org/psycopg3/docs/api/cursors.html<br>https://www.psycopg.org/psycopg3/docs/basic/copy.html<br>https://www.postgresql.org/docs/current/sql-insert.html |
| `elt-transforming-in-sql-after-loading` | https://www.psycopg.org/psycopg3/docs/basic/transactions.html<br>https://www.postgresql.org/docs/current/sql-insert.html<br>https://www.postgresql.org/docs/current/queries-with.html<br>https://www.postgresql.org/docs/current/sql-createtableas.html |
| `cleaning-and-validating-records-with-pydantic-and-type-hints` | https://pydantic.dev/docs/validation/latest/concepts/models/<br>https://pydantic.dev/docs/validation/latest/concepts/validators/<br>https://pydantic.dev/docs/validation/latest/errors/validation_errors/<br>https://docs.python.org/3/library/typing.html |
| `deduplicating-in-sql-vs-in-python` | https://docs.python.org/3/builtins/stdtypes.html<br>https://www.postgresql.org/docs/current/sql-select.html<br>https://www.postgresql.org/docs/current/functions-window.html<br>https://www.postgresql.org/docs/current/tutorial-window.html |
| `ai-enrichment-with-validated-outputs` | https://pydantic.dev/docs/validation/latest/concepts/json_schema/<br>https://platform.claude.com/docs/en/build-with-claude/structured-outputs<br>https://developers.openai.com/api/docs/guides/structured-outputs<br>https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/ |
| `keeping-sensitive-data-out-of-prompts` | https://docs.python.org/3/library/logging.html<br>https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/<br>https://code.claude.com/docs/en/data-usage |
| `fastapi-routes` | https://fastapi.tiangolo.com/<br>https://fastapi.tiangolo.com/tutorial/first-steps/<br>https://fastapi.tiangolo.com/tutorial/path-params/<br>https://fastapi.tiangolo.com/tutorial/query-params/<br>https://fastapi.tiangolo.com/tutorial/body/<br>https://fastapi.tiangolo.com/tutorial/testing/ |
| `serving-pipeline-results-as-an-api` | https://www.psycopg.org/psycopg3/docs/api/connections.html<br>https://fastapi.tiangolo.com/tutorial/testing/<br>https://fastapi.tiangolo.com/tutorial/response-model/<br>https://fastapi.tiangolo.com/tutorial/handling-errors/<br>https://fastapi.tiangolo.com/tutorial/dependencies/ |
| `calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts` | https://fastapi.tiangolo.com/advanced/settings/<br>https://fastapi.tiangolo.com/async/<br>https://www.python-httpx.org/quickstart/<br>https://www.python-httpx.org/advanced/timeouts/<br>https://www.python-httpx.org/advanced/authentication/<br>https://www.python-httpx.org/advanced/transports/<br>https://www.python-httpx.org/exceptions/<br>https://www.rfc-editor.org/rfc/rfc6750.html<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://docs.spring.io/spring-boot/reference/web/servlet.html |
| `python-review` | https://docs.python.org/3/tutorial/datastructures.html<br>https://docs.python.org/3/reference/datamodel.html<br>https://docs.python.org/3/tutorial/errors.html<br>https://docs.pytest.org/en/stable/how-to/assert.html<br>https://docs.python.org/3/library/json.html<br>https://www.postgresql.org/docs/current/sql-insert.html<br>https://pydantic.dev/docs/validation/latest/concepts/validators/<br>https://fastapi.tiangolo.com/tutorial/testing/<br>https://www.python-httpx.org/advanced/timeouts/ |

Calendar references for the `python` technology: [Python tutorial](https://docs.python.org/3/tutorial/), [pytest](https://docs.pytest.org/), [FastAPI](https://fastapi.tiangolo.com/) — all three are in the snapshot.

## Category-A records closed by this intake

| Record | Resolution |
|---|---|
| `source-gap-python-modules` | Module grouping chosen and recorded above as a second-mate grouping decision, not syllabus: three modules by calendar day sequence. Pending approval at merge. |
| `source-gap-python-official-evidence` | 81 live first-party sources fetched and frozen with sha256 and retrieval times in `evidence/python/source-snapshot.json`; no gaps. |

## Intake criticism

The author does not approve this first output. Fresh independent educational and technology-SME critics review the committed manifests, objectives, blueprint and this intake; their reports and a non-author reconciliation are committed as course-level evidence (`intake-critic-education.json`, `intake-critic-sme.json`, `intake-reconciliation.json`) after review.
