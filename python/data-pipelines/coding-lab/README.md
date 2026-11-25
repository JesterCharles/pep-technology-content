# Data Pipelines lab: the nightly sign-up load

## Goal

Every night the workshop desk exports sign-ups as a CSV file and a JSON Lines file. Build the steps of the pipeline that loads them, in the order the pipeline runs them:
extract the records with generators, validate them with Pydantic, deduplicate them, load them into a PostgreSQL staging table with an upsert, transform them into a summary in SQL, and enrich them with an AI model without sending names, emails or phone numbers.
Each of the nine tasks builds one step, and its check gives that step its own data; in the last task you write your own offline tests for the enrichment.
Everything runs on your own computer with your local PostgreSQL server: no cloud account, no Docker, and no live or paid AI call (a scripted fake model client stands in for the model). Every person in the fixtures and the tests is made up.

About 10 minutes of setup the first time, then about 45 minutes for the tasks (an estimate): Tasks 1-4 on the first lab day and Tasks 5-9 on the second. If you pass 60 minutes in total, pause and finish in self-study.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/pipeline/records.py` | 1, 5, 6: extract, validate and deduplicate in Python |
| `starter/pipeline/database.py` | 2, 3, 4: connect, upsert and transform in SQL |
| `starter/pipeline/enrich.py` | 7, 8: minimize and enrich |
| `starter/test_enrich.py` | 9: your own tests |

Leave `tests/`, `fixtures/`, `expected/`, `starter/pipeline/schema.sql`, `starter/pipeline/fake_model.py`, `starter/pipeline/__init__.py` and `starter/requirements.txt` as they are.
Each check is named after its task, and most failure messages say what to do next; read the lines that start with `E`, or run one task's check with `python -m pytest -q -k task04`.

## Prerequisites

- Python 3.12 to 3.15 (the pinned packages ship ready-built for those versions; the lab was tested on 3.12). Check it with `python3 --version` on macOS and Linux, or `py --version` on Windows. Native ARM64 Windows Python is not supported, because the pinned `psycopg-binary` has no ARM64 Windows build: on an ARM64 Windows computer, do this lab on a macOS, Linux or x64 Windows computer instead.
- The PostgreSQL server (16 or later) and `psql`, installed and running as in the SQL course reading *Installing Postgres and a SQL client*. Check it with `psql --version`. Your PostgreSQL user must be allowed to create a schema in the database you use.

## Setup (once, needs the internet)

Open a terminal in the lab folder (the folder that holds this README).

1. Create and activate a virtual environment.

   macOS and Linux:

   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   Windows PowerShell:

   ```
   py -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

   Once the environment is active, `python` means its Python on every system.

2. Install the pinned packages (pytest, Pydantic and psycopg):

   ```
   python -m pip install -r starter/requirements.txt
   ```

3. Point the lab at your database with the `DATABASE_URL` environment variable, in the same terminal. Use your own user, port and database. On macOS with Homebrew the user is usually your login name; with the Windows installer or a Linux package it is usually `postgres`:

   - macOS and Linux: `export DATABASE_URL=postgresql://localhost:5432/postgres` (or `postgresql://postgres@localhost:5432/postgres`)
   - Windows PowerShell: `$env:DATABASE_URL = "postgresql://postgres@localhost:5432/postgres"`

   Keep passwords out of the URL and out of every file: if your server asks for one, use the password file as the SQL course's Relational design lab README shows in its Setup section (`~/.pgpass`, or `%APPDATA%\postgresql\pgpass.conf` on Windows). Check the connection:

   ```
   psql "$DATABASE_URL" -c "SELECT version();"
   ```

   (in PowerShell: `psql $env:DATABASE_URL -c "SELECT version();"`). It prints one row starting `PostgreSQL`.

Activate the environment and set `DATABASE_URL` again in every new terminal before you run the tests.
The database checks create their own schema named `pipeline_lab_` plus 12 hex characters, create the tables from `starter/pipeline/schema.sql` inside it, point `DATABASE_URL` at it while they run your code, and drop it when they finish; they never touch your other tables.

## Tasks

Run the one test command from the lab folder after each task:

```
python -m pytest -q
```

Before you start, all nine `test_taskNN_...` checks fail.
Each check gives its task its own data, so a task passes on its own; the exception is that Tasks 3 and 4 use your Task 2 `connect()`. Open the fixture files in `fixtures/` to see the exported records.

### Task 1: stream the records (`records.py`)

1. `read_csv(path)`: `with open(path, encoding="utf-8", newline="") as f:` then `for row in csv.DictReader(f): yield row`. Every value arrives as a string.
2. `read_jsonl(path)`: open the file the same way (no `newline` needed), loop over its lines, skip blank lines (`if line.strip():`) and `yield json.loads(line)`.
3. `extract(paths)`: for each path, pick `read_csv` when `Path(path).suffix == ".csv"`, otherwise `read_jsonl`, and yield each record whose email is not blank (`(record.get("email") or "").strip()`); the CSV export has an empty row.

Because these are generators, only one record is in memory at a time, and nothing is read until a loop asks for the next record. Before you run the check, write down what a second loop over the same `read_csv(...)` generator gives you, then compare with what the check expects.

### Task 2: connect and query safely (`database.py`)

1. `connect()` returns `psycopg.connect(os.environ["DATABASE_URL"])`, so the address stays out of your code and a missing variable raises `KeyError`.
2. `signups_for_session(conn, session)`: in `with conn.cursor() as cur:`, run `cur.execute("SELECT email, seats FROM staging_signups WHERE session = %s ORDER BY email", (session,))` and return `cur.fetchall()`.

Never build the SQL with an f-string: the check passes the session `testing' OR 'x'='x`, which would rewrite a formatted query; as a `%s` parameter it is just a session name that matches nothing.

### Task 3: an idempotent batch upsert (`database.py`)

1. Write `UPSERT_SQL`: `INSERT INTO staging_signups (email, name, session, seats, signed_up_at) VALUES (%(email)s, %(name)s, %(session)s, %(seats)s, %(signed_up_at)s)` followed by `ON CONFLICT (email) DO UPDATE SET` each other column `= EXCLUDED.<column>`. The `email` column is the table's primary key, so it is the conflict target.
2. `load_staging(records)` opens its own connection with `with connect() as conn:`, then, inside it, sends the whole batch with `cur.executemany(UPSERT_SQL, records)` in `with conn.cursor() as cur:`. Each record is a dict, and the `%(email)s` placeholders take values from its keys. Leaving the connection block cleanly commits; the check reads the rows from a different connection, so uncommitted rows are invisible to it.

Before you run the check, predict what a second load of the same batch would do with a plain `INSERT` and no `ON CONFLICT` clause, and what it does with your upsert. Then run the check, which loads the same batch twice and counts the rows, and compare the plain-`INSERT` half of your prediction with the section *ON CONFLICT turns a failure into a decision* on the page *Loading into a staging table with upserts*.

### Task 4: transform in SQL, all or nothing (`database.py`)

1. Write `TRANSFORM_SQL` as a common table expression that cleans the staged rows, then reshapes them into the summary:

   ```
   WITH cleaned AS (
       SELECT lower(trim(session)) AS session, seats
       FROM staging_signups
   )
   INSERT INTO session_summary (session, signups, seats)
   SELECT ...
   ```

   Finish the `SELECT`: per `session`, `count(*)` sign-ups and `sum(seats)` seats, with `GROUP BY session`.
2. `run_transform()` deletes the old summary and inserts the new one, but the starter runs in autocommit mode, where each statement commits by itself: if the `INSERT` fails, the summary is already empty. Replace it with one `with connect() as conn:` block that runs `conn.execute("DELETE FROM session_summary")` and then `conn.execute(TRANSFORM_SQL)`. The block commits both on a clean exit and rolls both back on an exception, so yesterday's summary survives a failure. Keep using the name `TRANSFORM_SQL` in `run_transform`: the check swaps in a failing SQL text through it.

This is ELT: the validated rows were loaded first, and PostgreSQL does the transform where the data already is.
This is the end of the first lab day.

### Task 5: validate with Pydantic (`records.py`)

1. Give `Signup` its fields with type hints: `email: str`, `name: str`, `session: str` (required), `seats: int = 1`, `phone: str | None = None`, `signed_up_at: datetime` (required) and `comment: str = ""`.
2. Add a field validator that normalises the email:

   ```
   @field_validator("email")
   @classmethod
   def normalize_email(cls, value):
   ```

   Strip and lower-case `value`, raise `ValueError("email needs @")` when there is no `@`, and return it.
3. `validate_all(rows)`: for each row, `try:` to append `Signup(**row)` to `accepted`; `except ValidationError as err:` append `(row, err.errors())` to `rejected`. Return `accepted, rejected`.

Before you run the check, predict which of the CSV texts `"1"`, `"2026-11-03T10:00:00"` and `"two"` Pydantic converts to a number or a `datetime`, and which it rejects.

### Task 6: deduplicate in Python (`records.py`)

`latest_per_email(signups)` keeps one sign-up per email, the one with the latest `signed_up_at`. Remember the one you keep for each email in a dict `kept` keyed on `signup.email`, and replace the kept sign-up when a later one arrives. Return the kept sign-ups ordered by email: `sorted(kept.values(), key=lambda s: s.email)`.
A set works too: walk the sign-ups newest first (`sorted(signups, key=lambda s: s.signed_up_at, reverse=True)`), add each email to a `seen` set, append a sign-up to a list only when its email is not yet in `seen`, and return that list sorted by email.

### Task 7: keep personal data out of the prompt (`enrich.py`)

The model only needs to classify each sign-up's interest and level. Start from nothing and send only what that needs:
`minimize_for_prompt(signup)` returns a new dict with `"ref"` set to `pseudonym(signup["email"])`, plus the sign-up's `"session"` and `"comment"`. The name, email, phone, seats and sign-up time stay behind. Do not change `signup`.

The pseudonym lets you match the model's answer back to the sign-up. The shipped `pseudonym` is a lab shortcut: a plain hash of an email can be reversed by anyone who guesses the email. In production, use the page's method, a random token with the mapping kept on your side.
Free text such as the comment can also contain personal data; the fixture comments here do not, but in production you would mask it first, for example replacing an email inside the comment with `[email]`.

### Task 8: validated enrichment with retry and reject (`enrich.py`)

1. Give `Enrichment` two fields limited to fixed values with `Literal` (add `from typing import Literal`): `interest: Literal["testing", "data", "web", "other"]` and `level: Literal["beginner", "intermediate", "advanced"]`. `build_prompt` puts this schema into the prompt.
2. `enrich(client, signups, max_attempts=2)`: for each sign-up, minimize it, then try up to `max_attempts` times:
   - `Enrichment.model_validate_json(client.complete(build_prompt(record)))`;
   - on `ValidationError` (an answer that is not valid JSON or not one of the allowed values), log `logger.warning("invalid answer for %s (attempt %d)", record["ref"], attempt)` and try again;
   - on `ModelError` (the call itself failed), log `logger.warning("model call failed for %s (attempt %d)", record["ref"], attempt)` in its own `except` branch and try again: a transient failure gets a bounded retry, then the reject path;
   - on success, append `{"ref": record["ref"], **answer.model_dump()}` to `enriched` and stop trying.

   When every attempt failed, append the ref to `rejected` (a `for ... else:` or a flag). Return `enriched, rejected`. Use `max_attempts` for the number of tries; do not hard-code it.

Model output is untrusted input: anything that does not validate is never loaded. Log only the ref, never an email, name or phone number.

### Task 9: your own offline tests (`test_enrich.py`)

Add two tests to `starter/test_enrich.py`, each driving `enrich` with a `FakeModelClient` of scripted answers and the `SIGNUP` dict already in the file:

1. `FakeModelClient(["not json", VALID])`: the sign-up is enriched after one retry (one item in `enriched`, `rejected == []`).
2. Two invalid answers, such as `"not json"` and `'{"interest": "cooking", "level": "beginner"}'`: nothing is enriched and its ref is rejected.

Run only your file while you work: `python -m pytest -q starter/test_enrich.py`.
The Task 9 check runs your tests against your code, where they must pass, then against four broken versions of `enrich`, where they must fail: one that accepts any answer, one that never retries, one that never rejects, and one that loads a junk answer for each rejected ref.

## Test

The one test command, run from the lab folder with the virtual environment active and `DATABASE_URL` set:

```
python -m pytest -q
```

When you finish, every test passes: your own tests plus the nine lab checks.

## Expected output

`expected/on-completion.txt` shows a completed run. The number of dots and tests depends on how many tests you wrote, and the time differs on every run.

## Offline note

Only the setup step uses the network. The tests talk only to your local PostgreSQL server, and the model is the offline `FakeModelClient`: no AI service, API key or account is used.

## Cleanup

1. The checks drop their own `pipeline_lab_...` schema. If a run was interrupted, list leftovers and drop each one:
   - macOS and Linux: `psql "$DATABASE_URL" -c "\dn pipeline_lab_*"`, then `psql "$DATABASE_URL" -c "DROP SCHEMA pipeline_lab_<hex> CASCADE"`
   - Windows PowerShell: `psql $env:DATABASE_URL -c "\dn pipeline_lab_*"`, then `psql $env:DATABASE_URL -c "DROP SCHEMA pipeline_lab_<hex> CASCADE"`
2. Deactivate the environment with `deactivate`, then delete the files the lab created, from the lab folder:
   - macOS and Linux: `rm -rf .venv .pytest_cache starter/.pytest_cache starter/__pycache__ starter/pipeline/__pycache__ tests/__pycache__`
   - Windows PowerShell: `Remove-Item -Recurse -Force .venv, .pytest_cache, starter\.pytest_cache, starter\__pycache__, starter\pipeline\__pycache__, tests\__pycache__ -ErrorAction SilentlyContinue`

## Troubleshooting

- **`command not found: python` or `python3`**: on macOS and Linux create the environment with `python3`; after `source .venv/bin/activate`, `python` works. On Windows use `py`.
- **Every database check errors with `Set DATABASE_URL ...`**: set `DATABASE_URL` in this terminal (Setup step 3).
- **`connection refused`**: your PostgreSQL server is not running, or the port in `DATABASE_URL` is wrong.
- **`role "..." does not exist`**: the user in `DATABASE_URL` is not a PostgreSQL user; put an existing one in the URL, such as `postgres`.
- **`password authentication failed`** or **`no password supplied`**: check the user in `DATABASE_URL` and your password file line.
- **`permission denied for database`**: your user may not create schemas there; use a database you own, or a user such as `postgres`.
- **`No module named pytest` or `psycopg`**: the virtual environment is not active in this terminal. Activate it and run the test command again.
- **`errors during collection`, a `NameError` or a `SyntaxError` stops every check**: fix the file and line that pytest names first (a `NameError` such as `name 'Literal' is not defined` usually means a missing import); one broken file stops the whole run.
- **Only your own tests ran, or `no tests ran`**: you are in the `starter` folder. Go back to the lab folder with `cd ..` and run the test command there.
- **`No matching distribution found for psycopg-binary==3.3.9`**: your Python is not one the pinned package is built for: Python 3.12 to 3.15 on macOS, Linux or x64 Windows (not ARM64 Windows). Check `python --version` inside the environment, then recreate `.venv` with a supported Python.
- **PowerShell refuses to run `Activate.ps1`**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then activate again.
- **You pass 60 minutes**: pause, note the task you are on, and finish in self-study; every check is still named after its task.
