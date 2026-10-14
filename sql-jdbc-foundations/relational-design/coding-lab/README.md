# Relational design lab: a course enrollment schema

Turn a user story into a PostgreSQL schema. You write one file, `starter/schema.sql`, with three `CREATE TABLE` statements. Public JUnit tests load it into a fresh database on your own PostgreSQL server and check its tables, keys, types and constraints by trying inserts and deletes that must be accepted or rejected.

This lab practises the Relational Design topics *Tables, keys and relationships*, *Designing tables from a user story* and *CREATE TABLE, data types and constraints*. It uses no containers: only your local PostgreSQL server, a JDK and Maven.

About 10 minutes of setup the first time, then about 30 minutes for the tasks.

## Prerequisites

Check each tool in a new terminal:

| Tool | Version | Check |
| --- | --- | --- |
| PostgreSQL server and `psql` | 18 (16 or later works) | `psql --version`, then `psql -d postgres -c "SELECT version();"` |
| JDK | 25 | `java -version` |
| Apache Maven | 3.9 or later | `mvn -v` |

The `psql -d postgres` check must connect without an error. If it does not, fix that first (see Troubleshooting): the tests connect the same way.

## Setup

1. Open a terminal in this lab's `starter/` folder.
2. Tell the tests how to reach your server. They read the same environment variables as `psql`:

   | Variable | Meaning | Default when unset |
   | --- | --- | --- |
   | `PGHOST` | server host | `localhost` |
   | `PGPORT` | server port | `5432` |
   | `PGUSER` | PostgreSQL user; it must be allowed to create databases | your login name |
   | `PGPASSWORD` | that user's password | none (fine if your server does not ask for one) |
   | `PGDATABASE` | an existing database to connect to while creating the lab database | `postgres` |

   Set only the ones you need, in the same terminal:

   - macOS or Linux: `export PGUSER=postgres` and `export PGPASSWORD='your password'`
   - Windows PowerShell: `$env:PGUSER = "postgres"` and `$env:PGPASSWORD = "your password"`

   A password set this way lasts only for this terminal window. Never write it into `schema.sql` or any file you share.
3. Download the test libraries once (needs the internet):

   ```
   mvn -q dependency:go-offline
   ```

After this step the test command works offline.

## The user story

> As a course coordinator, I want students to enroll in courses, so that I can see who takes each course and record their grades.

Acceptance criteria:

1. Each student has an id (a whole number), a name of at most 100 characters and an email address. Name and email are required, and no two students share an email.
2. Each course is identified by a code such as `SQL101`. It has a required title and a required capacity, a whole number greater than 0.
3. A student can enroll in many courses, and a course has many students. A student cannot enroll in the same course twice.
4. Each enrollment records when it was made (date and time, filled in with the current time when not given) and a grade: empty until graded, otherwise a number from 0 to 100 with up to two decimal places.
5. An enrollment must refer to an existing student and an existing course. A student who has enrollments cannot be deleted.

Use exactly these names, because the tests look them up:

| Table | Columns |
| --- | --- |
| `students` | `id`, `name`, `email` |
| `courses` | `code`, `title`, `capacity` |
| `enrollments` | `student_id`, `course_code`, `enrolled_at`, `grade` |

## Tasks

Write `starter/schema.sql` one table at a time, and run the tests after each.

1. **Tables.** Create the three tables with the columns above (test `task1Tables`).
2. **students.** Choose types and constraints for criterion 1: an `integer` primary key, `varchar(100)` for the name, `text` for the email (test `task2Students`).
3. **courses.** Criterion 2: `code` is `text` and the primary key; `capacity` is an `integer` with a `CHECK` (test `task3Courses`).
4. **enrollments keys.** Criteria 3 and 5: foreign keys to `students` and `courses`, both required, and a primary key on the pair `(student_id, course_code)` (test `task4EnrollmentKeys`).
5. **enrollments defaults.** Criterion 4: `enrolled_at` is a `timestamp` with `DEFAULT CURRENT_TIMESTAMP`; `grade` is `numeric(5,2)` with a `CHECK` for 0 to 100, and may be empty (test `task5EnrollmentDefaults`).

Create `students` and `courses` before `enrollments`: a foreign key can only reference a table that already exists.

## Test

In `starter/`:

```
mvn -q -o test
```

Each run creates a database named `relational_design_lab`, runs your `schema.sql` in it, runs the tests, and drops the database again. A failing test names the statement that was wrongly accepted or rejected, or the column whose type is wrong. If `schema.sql` itself has an SQL error, every test reports `schema.sql did not run:` followed by PostgreSQL's message.

As shipped, `schema.sql` creates nothing, so all five tests fail; that is expected.

## Expected output

When every task is done, `mvn -q -o test` prints nothing and exits with status 0. The full expected summary is in `expected/test-summary.txt`.

## Offline note

Only the setup step downloads anything. The test command runs offline and talks only to your local PostgreSQL server.

## Cleanup

- The tests drop `relational_design_lab` when they finish. If a run is interrupted, remove it with `psql -d postgres -c "DROP DATABASE IF EXISTS relational_design_lab;"`.
- Delete `starter/target` to remove compiled classes and test reports.
- Setup also stores the pinned libraries in your local Maven repository (`~/.m2/repository` by default); that shared cache is kept for later labs.

## Troubleshooting

- **`Could not reach PostgreSQL to create the lab database`**: the server is not running, or the settings are wrong. Run `psql -d postgres -c "SELECT 1;"` with the same variables set; fix it until that works.
- **`password authentication failed`**: set `PGPASSWORD` in this terminal, or check `PGUSER`.
- **`permission denied to create database`**: use a user that may create databases, such as the `postgres` user an installer creates.
- **`database "relational_design_lab" is being accessed by other users`**: close any `psql` session connected to it, then run the tests again.
- **`schema.sql did not run: ... relation "students" does not exist`**: a foreign key points at a table created later in the file; create `students` and `courses` first.
- **Maven says a dependency cannot be resolved offline**: run the setup step once with the internet on.
