# INSERT, UPDATE and DELETE

## Objectives

- Write INSERT statements that add one or several rows with the column list named explicitly
- Write UPDATE and DELETE statements whose WHERE clause changes only the intended rows, previewing them with SELECT first
- Use RETURNING to see the rows an INSERT, UPDATE or DELETE changed

## Teaching

### Guess what an UPDATE with no WHERE changes

You have not learned this statement yet, so this is a guess. `UPDATE courses SET fee = 0` asks PostgreSQL to set the `fee` column to 0 in the `courses` table. A colleague meant to make one course free and ran exactly this:

`courses` before it runs (other columns not shown)

| course_id | title | fee |
| --- | --- | --- |
| 101 | SQL Basics | 120.00 |
| 102 | Java Foundations | 150.00 |
| 103 | Data Modeling | NULL |
| 104 | Web Basics | 80.00 |
| 105 | Intro to Testing | 90.00 |

### Activity checks

In progress

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: how many rows of `courses` does this statement change?

1. Read the statement and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Add new rows with INSERT

`INSERT` adds new rows. Name the table, list the columns in parentheses, then give the values in the same order after `VALUES`. Text goes in single quotes; numbers and `NULL` do not.

```
INSERT INTO instructors (instructor_id, name, lead_id)
VALUES (5, 'Rosa', 1);
```

psql answers `INSERT 0 1`: the last number is how many rows were added, and you can ignore the 0. Naming the columns keeps the statement correct even if someone later adds a column to the table.

One INSERT can add several rows: put a comma between the bracketed rows. If any row breaks a constraint, such as a primary key that already exists, the whole statement fails and adds no rows at all.

Starting rows of `students` (`student_id` is the primary key; `email` is unique)

| student_id | name | email | city |
| --- | --- | --- | --- |
| 1 | Ana | ana@example.com | Leeds |
| 2 | Ben | ben@example.com | York |
| 3 | Chen | chen@example.com | NULL |
| 4 | Dina | dina@example.com | Leeds |
| 5 | Eli | eli@example.com | Bristol |
| 6 | Femi | femi@example.com | NULL |

### Activity checks

In progress

- Students 7 and 8 are in the table with exactly the values in the task, added by one INSERT
- That INSERT names its columns

### Your task

Ticket: two students enrolled today. Add both in one INSERT that names its columns.

- student 7: Gus, `gus@example.com`, city Hull
- student 8: Hana, `hana@example.com`, no city recorded

1. In students.sql, write your INSERT on the empty line under the first comment.
2. Leave the SELECT at the end as it is: it shows the table after your INSERT.
3. Press Run. Output shows `INSERT 0 2` and then the table.

### Preview, then change one row

`UPDATE` changes values in existing rows; `DELETE FROM` removes rows. Both use `WHERE` to choose rows: only rows for which its condition is true change. Without WHERE they change every row, as Activity 1 showed.

A safe habit: first run `SELECT * FROM table WHERE ...` with the exact WHERE you plan to use. It lists the rows the condition matches (`*` means every column). Check them, then reuse the same WHERE. A condition on the primary key matches at most one row.

```
SELECT * FROM courses WHERE course_id = 104;
UPDATE courses SET fee = 85.00
WHERE course_id = 104 RETURNING course_id, fee;
```

`RETURNING` lists the rows the statement just changed, with their new values (after a DELETE, the removed values), so you see the effect without a second query. psql then prints `UPDATE 1`: one row changed.

Starting rows of `students`

| student_id | name | email | city |
| --- | --- | --- | --- |
| 1 | Ana | ana@example.com | Leeds |
| 2 | Ben | ben@example.com | York |
| 3 | Chen | chen@example.com | NULL |
| 4 | Dina | dina@example.com | Leeds |
| 5 | Eli | eli@example.com | Bristol |
| 6 | Femi | femi@example.com | NULL |

### On the job

Decision: Run this UPDATE now, or preview its WHERE first?

Use it when: A WHERE decides which rows of a shared table change, such as correcting one customer's address or removing one cancelled booking; the SELECT shows exactly what that WHERE matches.

→ Choose something else when: Several statements must all succeed or all be undone, such as moving a booking from one table to another; a preview cannot undo a half-finished change, so run them in a transaction (BEGIN ... COMMIT), which makes PostgreSQL keep all of their changes or none.

At work: Correcting one customer's record in a shared database is a typical support ticket; a teammate who reviews the change will want to see the SELECT you ran first, and RETURNING shows exactly what changed.

In interviews: You may be asked what happens when an UPDATE or DELETE has no WHERE clause, or how you would change one customer's row safely.

### Activity checks

In progress

- A SELECT before the UPDATE lists exactly the row the UPDATE changes
- The UPDATE sets student 2's city to Hull and leaves every other row as it was
- RETURNING shows the changed row's student_id, name and city

### Your task

Ticket: Ben (student 2) has moved to Hull. Change only his row, and show the change.

1. In move.sql, under comment 1, write a SELECT that lists the row your WHERE will match.
2. Under comment 2, write an UPDATE that sets that row's city to Hull, with the same WHERE and RETURNING student_id, name and city.
3. Press Run. Output shows your preview row, then the returned row and `UPDATE 1`.

### Aim the WHERE at one enrollment

A WHERE matches every row for which its condition is true. `AND` narrows the match: both parts must hold. `OR` widens it: either part is enough.

The primary key of `enrollments` is the pair (`student_id`, `course_id`), so naming both columns matches exactly one enrollment.

Rows of `enrollments` (primary key: `student_id`, `course_id`)

| student_id | course_id | grade |
| --- | --- | --- |
| 1 | 101 | 82 |
| 1 | 102 | NULL |
| 2 | 101 | 67 |
| 2 | 103 | 74 |
| 3 | 101 | NULL |
| 3 | 102 | 58 |
| 4 | 102 | 91 |
| 4 | 103 | NULL |
| 5 | 101 | 45 |

### Activity checks

In progress

You chose the statement whose WHERE matches only the intended row and read what each other WHERE would also change.

### Your task

Ticket: student 4 cancelled one enrollment, course 102. Which statement removes only that enrollment?

Same idea, new form: Femi (student 6) now uses `femi.o@example.com`. Which statement changes only Femi's row?

1. Under Choose the statement, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The statement

```
UPDATE courses SET fee = 0;
```

## Recap

- `INSERT INTO table (columns) VALUES (...), (...);` names its columns and adds one or more rows; one rejected row cancels the whole statement.
- `UPDATE ... SET ... WHERE` and `DELETE FROM ... WHERE` change only the rows WHERE matches; with no WHERE they change every row.
- Preview with a SELECT that uses the same WHERE; a condition on the primary key matches at most one row. `RETURNING` shows the rows a statement changed.

Next topic: Seeding sample data

## Cheat sheet

Where to act: The empty line under the first comment in students.sql.

Next step: Copy the shape of the instructors example, but name the four columns of `students` in the order the table shows them, and give two bracketed rows after VALUES.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Hana's row, the second one after VALUES.

Next step: With four columns named, every row needs four values. Where Hana has no city, the value is NULL, written without quotes.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Before a librarian throws out damaged books, they first pull every book that matches the description onto a cart and look at it. Only when the cart holds exactly the books they meant do they discard them. A vague instruction, such as "get rid of the old ones", could empty half a shelf.

The preview is the cart: you see exactly which rows your condition matches before anything changes.

Where to act: The empty line under comment 1.

Next step: Pick a WHERE that can only ever match Ben. His name could repeat in another row one day; the column that identifies exactly one student cannot.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The empty line under comment 2.

Next step: Build the UPDATE in the example's order: the table, SET with the new city in quotes, the WHERE you just previewed, and RETURNING with the three columns the task names.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `INSERT INTO t (a, b) VALUES (1, 'x'), (2, NULL);` | add two rows, columns named |
| `SELECT * FROM t WHERE id = 3;` | preview the rows a WHERE matches |
| `UPDATE t SET b = 'y' WHERE id = 3;` | change matching rows |
| `DELETE FROM t WHERE id = 3;` | remove matching rows |
| `... RETURNING id, b;` | show the changed rows |

## Sources

Checked against these live official PostgreSQL documentation pages on 2026-11-25. The editor's outputs and error messages were compared with a real PostgreSQL 18 server and psql on the same sample tables when the editor was built.

- 6.1 Inserting Data
- 6.2 Updating Data
- 6.3 Deleting Data
- 6.4 Returning Data from Modified Rows
- INSERT, UPDATE and DELETE reference pages
- 3.4 Transactions

## Static interaction alternatives

### predict

Prediction (practice, not scored): the courses table has 5 rows and someone runs UPDATE courses SET fee = 0; with no WHERE clause. Options: 1 row, the first course; all 5 rows; no rows, because UPDATE needs a WHERE; an ERROR, because fee cannot be 0. Answer: all 5 rows. Without a WHERE clause, UPDATE changes every row in the table.

### explore

Typed INSERT activity. students.sql starts with a comment line for the INSERT and ends with SELECT student_id, name, email, city FROM students ORDER BY student_id;. The students table starts with students 1 to 6. Write one INSERT that names the columns student_id, name, email and city and adds two rows: 7, Gus, gus@example.com, Hull; and 8, Hana, hana@example.com, with no city. A correct run prints INSERT 0 2 and the table with 8 rows, Hana's city empty because it is NULL.

### explore

Typed preview-and-update activity. move.sql starts with two comment lines: 1, a SELECT that previews the row the WHERE will match, and 2, an UPDATE of that row's city with RETURNING. Ben is student 2 and lives in York. Write a SELECT that lists only Ben's row, then an UPDATE that sets his city to Hull using the same WHERE and returns student_id, name and city. A correct run shows the preview row, then one returned row with city Hull, then UPDATE 1.

### mcq

Apply question: student 4 cancelled the enrollment in course 102; which statement removes only that enrollment? Options: DELETE FROM enrollments WHERE student_id = 4; (also removes student 4's enrollment in course 103); DELETE FROM enrollments WHERE student_id = 4 AND course_id = 102; (the answer: both key columns match exactly one row); DELETE FROM enrollments WHERE course_id = 102 AND student_id >= 3; (also removes student 3's enrollment in course 102); DELETE FROM enrollments WHERE student_id = 4 OR course_id = 102; (OR matches four rows). Retry: to change only Femi's email, use UPDATE students SET email = 'femi.o@example.com' WHERE student_id = 6; the student_id primary key matches only Femi. With no WHERE, the UPDATE targets all six rows and fails on the unique email; the other WHERE clauses also match Chen, or Ana and Dina, and two rows cannot share one email.
