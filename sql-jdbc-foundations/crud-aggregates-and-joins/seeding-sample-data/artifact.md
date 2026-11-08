# Seeding sample data

## Objectives

- Write a seed script that inserts parent rows before child rows so every foreign key holds
- Generate many sample rows with INSERT ... SELECT and generate\_series
- Load rows from a CSV file with the psql \\copy command and explain how it differs from server-side COPY

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. A new database has empty tables. In `enrollments`, the `student_id` column is a foreign key to `students`. A seed script starts with the statement shown in the task, before any student exists. Guess what happens.

### Your task

1. Where to look: The statement just below.
2. What to do: Under Prediction, pick what PostgreSQL does.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: Parents before children

A seed script fills empty tables with sample rows, so everyone on a team starts from the same data. These ordinary foreign keys are checked as each INSERT statement finishes, so a child row needs its parent row to exist already. (Only a DEFERRABLE constraint waits until COMMIT.)

Order the script by the arrows: a table that others point at comes first. Here, `courses` points at `instructors`, and `enrollments` points at both `students` and `courses`.

To run the seed again later, empty the tables in the reverse order, children first: deleting a parent row that a child still points at is rejected too.

### Where this fits

Decision: You need sample rows for development or tests. Write them by hand, generate them, or load an existing file?

Good fit: A short hand-written seed script, in parent-before-child order, for the few meaningful rows people reason about; `generate_series` for hundreds of similar rows; `\copy` when the rows already exist as a CSV export.

Choose something else when: the rows would be real customers' personal data. Do not copy live production data into a shared seed file; generate made-up rows or use an approved, anonymised extract.

### Your task

The four tables start empty. seed.sql holds four correct INSERT statements in the wrong order.

1. Where to look: The seed.sql editor below, and the Who points at whom table above it.
2. What to do: Move whole statements (cut and paste lines) into an order where every foreign key points at a row that already exists. Do not change the values.
3. What to expect: Press Run. Output shows `INSERT 0 …` for each statement that worked, or PostgreSQL's foreign key ERROR.
4. How to know it's done: Both checks below read done. Two runs that still miss a check settle the activity without penalty.

### What success looks like

- Every statement runs without an ERROR
- All four tables end with their seed rows: 2 instructors, 1 course, 2 students, 2 enrollments, values unchanged

### Activity 3 of 4: Many rows from one statement

`generate_series(start, stop)` is a function you use like a table in `FROM`: it returns one row per whole number from start to stop. `AS n` names that column.

```
SELECT n FROM generate_series(1, 5) AS n;
```

`INSERT ... SELECT` inserts every row a query returns, instead of rows listed after VALUES. Build each column from `n`; `||` joins text and numbers into one text value:

```
INSERT INTO instructors (instructor_id, name)
SELECT n, 'Tutor ' || n
FROM generate_series(10, 12) AS n;
```

That adds Tutor 10, Tutor 11 and Tutor 12 in one statement, which makes it easy to fill a table for testing.

### Your task

The tables start empty again. Fill `students` with 30 test students in one INSERT ... SELECT:

- `student_id` 1 to 30
- `name` `Student 1` to `Student 30`
- `email` `student1@example.com` to `student30@example.com`
- no city

1. Where to look: The bulk.sql editor below.
2. What to type: Your INSERT goes on the empty line under the comment. Leave the SELECT at the end: it shows the first and last student.
3. What to expect: Press Run. Output shows `INSERT 0 30`, then students 1 and 30.
4. How to know it's done: Both checks below read done.

### What success looks like

- `students` holds exactly students 1 to 30 with the names and emails above, and no city
- One INSERT ... SELECT added all 30 rows

### Activity 4 of 4: Loading a CSV file

When rows already exist in a CSV file, load them with psql's `\copy` command, typed on one line at the psql prompt:

```
\copy students (student_id, name, email, city) FROM 'students.csv' WITH (FORMAT csv, HEADER)
```

psql reads the file on your computer and streams the rows to the server, so you only need permission to insert into the table. `HEADER` skips the file's first line of column names.

The SQL command `COPY ... FROM 'file'` looks different only by its backslash, but there the server opens the file on its own disk. That needs a superuser or the `pg_read_server_files` role.

### Your task

`students.csv` is on your laptop. The PostgreSQL server runs on a shared machine elsewhere, and your account is not a superuser. Which command loads the file?

Same idea, new form: which statement about `COPY` and `\copy` is true?

1. Where to look: The four commands below.
2. What to do: Pick one, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback appears and the recap opens below the activities.

### What success looks like

You chose the command that reads the file where it actually is, and can say which program opens the file in each case.

## Model

The first statement of the seed script

```
INSERT INTO enrollments (student_id, course_id, grade)
VALUES (1, 101, 82);
```

## Recap

- Seed parent tables before the child tables that point at them; empty them in the reverse order.
- `INSERT ... SELECT ... FROM generate_series(1, 30) AS n` adds one row per number in a single statement.
- `\copy ... FROM 'file.csv'` in psql reads a file on your computer; SQL `COPY ... FROM 'file'` makes the server read a file on its own disk and needs extra privileges.

Next topic: Filtering and sorting

## Cheat sheet

When a new library opens, staff put up the shelves first, then hang the section signs, and only then file books under those signs. A book labelled for a section whose sign is not up yet has nowhere to go, so it is sent back. Closing the library runs the other way: books off the shelves before the signs come down.

Rows that others point at go in first, and come out last.

Where to act: The top of seed.sql, just after the comments.

Next step: Find the table in Who points at whom that points at nothing else in this seed. Its statement can safely run first.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The statement that must run last.

Next step: The table that points at two others can only go in once both of them are filled; the remaining two statements fit between the first and the last.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is a Lesson check, not a claim that your SQL is invalid. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line under the comment in bulk.sql.

Next step: Start from the Tutor example: change the table, list the three columns you are filling, and change the series so it runs from 1 to 30.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The email column in your SELECT list.

Next step: The email has text both before and after the number, so it needs two joins: the fixed start, then n, then the fixed ending.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is a Lesson check, not a claim that your SQL is invalid. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `SELECT n FROM generate_series(1, 5) AS n;` | rows 1 to 5 |
| `INSERT INTO t (id, label) SELECT n, 'Item ' \|\| n FROM generate_series(1, 3) AS n;` | insert generated rows |
| `\copy t (a, b) FROM 'data.csv' WITH (FORMAT csv, HEADER)` | psql: load a local CSV |
| `COPY t FROM '/server/path.csv' WITH (FORMAT csv);` | server reads its own file; needs privileges |

## Sources

Checked against these live official PostgreSQL 18 documentation pages on 2026-10-16; foreign-key check timing was rechecked on 2026-10-27. Every output and error message the editor shows was compared with a real PostgreSQL 18 server and psql on the same tables.

- 2.4 Populating a Table With Rows
- INSERT
- 9.26 Set Returning Functions (generate_series)
- COPY
- psql (\copy)
- SET CONSTRAINTS (when constraints are checked)

## Static interaction alternatives

### predict

Prediction (practice, not scored): on empty tables, a seed script first inserts an enrollment for student 1 before any student exists. Options: the row is added and the student can come later; an ERROR for the foreign key, and nothing is added; the row is added with student_id set to NULL; PostgreSQL waits for the student row. Answer: an ERROR, insert or update on table enrollments violates foreign key constraint enrollments_student_id_fkey, with DETAIL Key (student_id)=(1) is not present in table students. Nothing is added.

### explore

Typed seed-order activity. The instructors, courses, students and enrollments tables start empty. seed.sql holds four INSERT statements in this order: enrollments (students 1 and 2 in course 101), courses (course 101 taught by instructor 2), students (Ana and Ben), instructors (Mara with no lead, and Tomas led by Mara). courses.instructor_id points at instructors; enrollments.student_id points at students and enrollments.course_id at courses. Reorder the statements, without changing values, so every statement runs without an ERROR and all rows are added.

### explore

Typed generate_series activity. The tables start empty. bulk.sql has a comment line for the INSERT and ends with SELECT student_id, name, email FROM students WHERE student_id IN (1, 30) ORDER BY student_id;. Write one INSERT ... SELECT over generate_series that adds students 1 to 30 named Student 1 to Student 30 with emails student1@example.com to student30@example.com and no city. A correct run prints INSERT 0 30, then the rows for students 1 and 30.

### mcq

Apply question: students.csv is on your laptop, the server is on another machine, and you are not a superuser; which command loads the file? Options: COPY students FROM 'students.csv' WITH (FORMAT csv, HEADER); (the server would look on its own disk and needs pg_read_server_files); \copy students FROM 'students.csv' WITH (FORMAT csv, HEADER) (the answer: psql reads the file on your computer); INSERT INTO students FROM 'students.csv'; (not valid SQL); \copy students TO 'students.csv' WITH (FORMAT csv, HEADER) (TO writes the table out to the file). Retry: the true statement is that \copy reads the file with psql on the client computer, while COPY FROM a file makes the server read it.
