# Seeding sample data

## Objectives

- Write a seed script that inserts parent rows before child rows so every foreign key holds
- Generate many sample rows with INSERT ... SELECT and generate\_series
- Choose the psql \\copy command to load rows from a CSV file and explain how it differs from server-side COPY

## Teaching

### Guess what happens to a row with no parent yet

This is a guess before any new rule. A new database has four empty tables. In `enrollments`, the `student_id` column is a foreign key to `students`: every enrollment must point at a student that exists. A script that fills the tables starts with this statement, before any student exists:

### Activity checks

In progress

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: what does PostgreSQL do with this first statement?

1. Read the statement in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Order a seed script so every key holds

A seed script is a file of INSERT statements that fills empty tables with made-up sample rows, so everyone on a team, and every automated test, starts from the same data. Never copy real customers' personal data into it.

These foreign keys are checked as each INSERT finishes, so a child row needs its parent row to exist already. Order the script by the table below: a table that others point at goes first. To empty the tables later, go in reverse order, children first, because deleting a parent row that a child still points at is rejected too.

Who points at whom (foreign keys). `lead_id` points at another instructor, the person's team lead, so within one INSERT a lead's row comes before the rows that point at it.

| table | column | points at |
| --- | --- | --- |
| instructors | lead_id | instructors |
| courses | instructor_id | instructors |
| enrollments | student_id | students |
| enrollments | course_id | courses |

### On the job

Decision: Write the sample rows by hand, generate them, or load a file?

Use it when: You need a few meaningful rows that people and tests reason about, such as the two students a test checks; write them by hand, parents before children.

→ Choose something else when: You need hundreds of similar rows, or the rows already sit in a spreadsheet export; generate them with `generate_series` (Activity 3) or load the file with psql's `\copy` (Activity 4).

At work: Many projects keep a seed script that builds a fresh development or test database; when you add a table, you add its rows to that script in an order that keeps every foreign key valid.

In interviews: You may be asked why an INSERT fails with a foreign key error, or in what order you would load a set of related tables; Activities 1 and 2 practise both.

### Activity checks

In progress

- Every statement runs without an ERROR
- All four tables end with their seed rows: 2 instructors, 1 course, 2 students, 2 enrollments, values unchanged

### Your task

Ticket: the team's seed script fails on a fresh database. Reorder its four statements so every foreign key holds.

1. In seed.sql, move whole statements (cut and paste lines) into an order where every foreign key points at a row that already exists.
2. Do not change any value.
3. Press Run. Output shows `INSERT 0 …` for each statement that worked, or PostgreSQL's foreign key ERROR.

### Generate many test rows in one statement

`generate_series(start, stop)` is a function you use like a table after `FROM`: it returns one row per whole number from start to stop. `AS n` names that column `n`.

```
SELECT n FROM generate_series(1, 3) AS n;
```

That returns three rows: 1, 2 and 3. `INSERT ... SELECT` inserts every row a query returns, instead of rows listed after VALUES. Build each column from `n`; `||` joins text and numbers into one text value:

```
INSERT INTO instructors (instructor_id, name)
SELECT n, 'Tutor ' || n
FROM generate_series(10, 12) AS n;
```

That adds Tutor 10, Tutor 11 and Tutor 12 in one statement, and psql prints `INSERT 0 3`.

### Activity checks

In progress

- `students` holds exactly students 1 to 30 with the names and emails in the task, and no city
- One INSERT ... SELECT added all 30 rows

### Your task

Ticket: a teammate needs 30 test students to try out a long list screen. Add them in one INSERT ... SELECT.

- `student_id` 1 to 30
- `name` `Student 1` to `Student 30`
- `email` `student1@example.com` to `student30@example.com`
- no city

1. The tables start empty again. In bulk.sql, write your INSERT on the empty line under the comment.
2. Leave the SELECT at the end as it is: it shows the first and last student.
3. Press Run. Output shows `INSERT 0 30`, then students 1 and 30.

### Load a CSV file from your laptop

A CSV file is plain text with one row per line and commas between values; spreadsheets export it. Load one with psql's `\copy` command, typed on one line at the psql prompt:

```
\copy students (student_id, name, email, city) FROM 'students.csv' WITH (FORMAT csv, HEADER)
```

psql reads the file on your computer and sends the rows to the server, so you only need permission to insert into the table. `HEADER` skips the file's first line of column names.

The SQL command `COPY ... FROM 'file'` lacks only the backslash, but there the server opens the file on its own disk. That needs a superuser (an account allowed to do anything) or the `pg_read_server_files` role, a named set of extra permissions.

### Activity checks

In progress

You chose the command that reads the file where it actually is and read which program opens the file in each case.

### Your task

`students.csv` is on your laptop; the server runs on a shared machine, and you are not a superuser. Which command loads it?

Same idea, new form: which statement about `COPY` and `\copy` is true?

1. Under Choose the command, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The first statement of the script

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

Next step: Find the table in Who points at whom that points at no other table in this seed. Its statement can safely run first.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The statement that must run last.

Next step: The table that points at two others can only go in once both of them are filled; the remaining two statements fit between the first and the last.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
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
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `SELECT n FROM generate_series(1, 5) AS n;` | rows 1 to 5 |
| `INSERT INTO t (id, label) SELECT n, 'Item ' \|\| n FROM generate_series(1, 3) AS n;` | insert generated rows |
| `\copy t (a, b) FROM 'data.csv' WITH (FORMAT csv, HEADER)` | psql: load a local CSV |
| `COPY t FROM '/server/path.csv' WITH (FORMAT csv);` | server reads its own file; needs privileges |

## Sources

Checked against these live official PostgreSQL documentation pages on 2026-11-25. The practice editor imitates PostgreSQL's results and error wording; its runs on this page were not repeated on a live PostgreSQL server.

- 2.4 Populating a Table With Rows
- INSERT
- Set Returning Functions (generate_series)
- COPY
- psql (\copy)
- SET CONSTRAINTS (when constraints are checked)

## Static interaction alternatives

### predict

Prediction (practice, not scored): on empty tables, a script first inserts an enrollment for student 1 before any student exists. Options: the row is added and the student can come later; an ERROR for the foreign key, and nothing is added; the row is added with student_id set to NULL; PostgreSQL waits for the student row. Answer: an ERROR, insert or update on table enrollments violates foreign key constraint enrollments_student_id_fkey, with DETAIL Key (student_id)=(1) is not present in table students. Nothing is added.

### explore

Typed seed-order activity. The instructors, courses, students and enrollments tables start empty. seed.sql holds four INSERT statements in this order: enrollments (students 1 and 2 in course 101), courses (course 101 taught by instructor 2), students (Ana and Ben), instructors (Mara with no lead, and Tomas led by Mara). courses.instructor_id points at instructors; enrollments.student_id points at students and enrollments.course_id at courses. Reorder the statements, without changing values, so every statement runs without an ERROR and all rows are added.

### explore

Typed generate_series activity. The tables start empty. bulk.sql has a comment line for the INSERT and ends with SELECT student_id, name, email FROM students WHERE student_id IN (1, 30) ORDER BY student_id;. Write one INSERT ... SELECT over generate_series that adds students 1 to 30 named Student 1 to Student 30 with emails student1@example.com to student30@example.com and no city. A correct run prints INSERT 0 30, then the rows for students 1 and 30.

### mcq

Apply question: students.csv is on your laptop, the server is on another machine, and you are not a superuser; which command loads the file? Options: COPY students FROM 'students.csv' WITH (FORMAT csv, HEADER); (the server would look on its own disk and needs pg_read_server_files); \copy students FROM 'students.csv' WITH (FORMAT csv, HEADER) (the answer: psql reads the file on your computer); INSERT INTO students FROM 'students.csv'; (not valid SQL); \copy students TO 'students.csv' WITH (FORMAT csv, HEADER) (TO writes the table out to the file). Retry: the true statement is that \copy reads the file with psql on the client computer, while COPY FROM a file makes the server read it.
