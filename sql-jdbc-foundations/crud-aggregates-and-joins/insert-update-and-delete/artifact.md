# INSERT, UPDATE and DELETE

## Objectives

- Write INSERT statements that add one or several rows with the column list named explicitly
- Write UPDATE and DELETE statements whose WHERE clause changes only the intended rows, previewing them with SELECT first
- Use RETURNING to see the rows an INSERT, UPDATE or DELETE changed

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. The `courses` table holds 5 courses. Someone means to make one course free, but runs the statement shown in the task. Guess what happens before any rules are shown.

### Your task

1. Where to look: The statement just below.
2. What to do: Under Prediction, pick how many rows it changes.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: Add rows with INSERT

`INSERT` adds new rows. Name the table, list the columns in parentheses, then give the values in the same order after `VALUES`:

```
INSERT INTO instructors (instructor_id, name, lead_id)
VALUES (5, 'Rosa', 1);
```

Listing the columns keeps the statement correct even if the table's columns are later reordered or extended, and it lets you leave a column out so it gets its default value. Text goes in single quotes; `NULL` has none.

One INSERT can add several rows: put a comma between the parenthesised rows. If any row breaks a constraint, such as a primary key that already exists, the whole statement fails and adds no rows at all.

### Your task

Two students join. Add both in one INSERT that names its columns:

- student 7: Gus, `gus@example.com`, city Hull
- student 8: Hana, `hana@example.com`, no city recorded

1. Where to look: The students.sql editor below, and the `students` table above it.
2. What to type: Your INSERT goes on the empty line under the first comment. Leave the SELECT at the end: it shows the table after your INSERT.
3. What to expect: Press Run. Output shows `INSERT 0 2` and then the table, or PostgreSQL's ERROR if a row is rejected.
4. How to know it's done: Both checks below read done. Two runs that still miss a check settle the activity without penalty.

### What success looks like

- Students 7 and 8 are in the table with exactly the values above, added by one INSERT
- That INSERT names its columns

### Activity 3 of 4: Preview, then change, then confirm

`UPDATE` changes values in existing rows; `DELETE` removes rows. Both use `WHERE` to choose the rows, and without it they affect every row, as Activity 1 showed.

A safe habit: first run a `SELECT` with the exact `WHERE` you plan to use, check that it lists only the rows you mean, then reuse that `WHERE`. A condition on the primary key matches at most one row.

```
SELECT * FROM courses WHERE course_id = 104;
UPDATE courses SET fee = 85.00
WHERE course_id = 104 RETURNING course_id, fee;
```

`RETURNING` lists the rows the statement just changed: the new values after an INSERT or UPDATE, the removed values after a DELETE. You see the effect without writing a second query.

### Where this fits

Decision: A change must touch only some rows of a table other people rely on. Run the UPDATE or DELETE straight away, or preview it with a SELECT first?

Good fit: Preview first whenever a WHERE decides which rows change, such as correcting one customer's address or removing one cancelled booking: the SELECT shows exactly what that WHERE matches.

Choose something else when: several statements must all succeed or all be undone, such as moving a booking from one table to another. A preview cannot undo a half-finished change; run them inside a transaction (BEGIN ... COMMIT) instead.

### Your task

Ben (student 2) has moved to Hull. Change only his row, and see the change.

1. Where to look: The move.sql editor below, with the `students` table above it.
2. First statement: under comment 1, a SELECT that lists the row your WHERE will match.
3. Second statement: under comment 2, an UPDATE that sets that row's city to Hull, using the same WHERE, with RETURNING student_id, name and city. Then press Run.
4. What to expect: Output shows your preview row, then the returned row and `UPDATE 1`.
5. How to know it's done: All three checks below read done.

### What success looks like

- A SELECT before the UPDATE lists exactly the row the UPDATE changes
- The UPDATE sets student 2's city to Hull and leaves every other row as it was
- RETURNING shows the changed row's student_id, name and city

### Activity 4 of 4: Aim the WHERE

A WHERE matches every row for which its condition is true. `AND` narrows the match: both parts must hold. `OR` widens it: either part is enough.

The primary key of `enrollments` is the pair (`student_id`, `course_id`), so naming both columns matches exactly one enrollment.

### Your task

Student 4 cancelled one enrollment: course 102. Which statement removes only that enrollment?

Same idea, new form: Femi (student 6) now uses `femi.o@example.com`. Which statement changes only Femi's row?

1. Where to look: The `enrollments` rows, then the four statements below them.
2. What to do: Pick one statement, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback appears and the recap opens below the activities.

### What success looks like

You chose the statement whose WHERE matches only the intended row, and can say what each other WHERE would also change.

## Model

The statement

```
UPDATE courses SET fee = 0;
```

## Recap

- `INSERT INTO table (columns) VALUES (...), (...);` names its columns and adds one or more rows; one rejected row cancels the whole statement.
- `UPDATE ... SET ... WHERE` and `DELETE FROM ... WHERE` change only the rows WHERE matches; with no WHERE they change every row.
- Preview with a SELECT that uses the same WHERE; a condition on the primary key matches at most one row.
- `RETURNING` shows the rows a statement changed.

Next topic: Seeding sample data

## Cheat sheet

Where to act: The empty line under the first comment in students.sql.

Next step: Copy the shape of the instructors example, but name the four columns of `students` in the order the table shows them, and give two parenthesised rows after VALUES.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Hana's row, the second one after VALUES.

Next step: With four columns named, every row needs four values. Where Hana has no city, the value is NULL, written without quotes.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is a Lesson check, not a claim that your SQL is invalid. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
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
- Anything else is a Lesson check, not a claim that your SQL is invalid. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
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

Checked against these live official PostgreSQL 18 documentation pages on 2026-10-16. Every output and error message the editor shows was compared with a real PostgreSQL 18 server and psql on the same sample tables.

- 6.1 Inserting Data
- 6.2 Updating Data
- 6.3 Deleting Data
- 6.4 Returning Data from Modified Rows
- INSERT, UPDATE and DELETE reference pages

## Static interaction alternatives

### predict

Prediction (practice, not scored): the courses table has 5 rows and someone runs UPDATE courses SET fee = 0; with no WHERE clause. Options: 1 row, the first course; all 5 rows; no rows, because UPDATE needs a WHERE; an ERROR, because fee cannot be 0. Answer: all 5 rows. Without a WHERE clause, UPDATE changes every row in the table.

### explore

Typed INSERT activity. students.sql starts with a comment line for the INSERT and ends with SELECT student_id, name, email, city FROM students ORDER BY student_id;. The students table starts with students 1 to 6. Write one INSERT that names the columns student_id, name, email and city and adds two rows: 7, Gus, gus@example.com, Hull; and 8, Hana, hana@example.com, with no city. A correct run prints INSERT 0 2 and the table with 8 rows, Hana's city empty because it is NULL.

### explore

Typed preview-and-update activity. move.sql starts with two comment lines: 1, a SELECT that previews the row the WHERE will match, and 2, an UPDATE of that row's city with RETURNING. Ben is student 2 and lives in York. Write a SELECT that lists only Ben's row, then an UPDATE that sets his city to Hull using the same WHERE and returns student_id, name and city. A correct run shows the preview row, then one returned row with city Hull, then UPDATE 1.

### mcq

Apply question: student 4 cancelled the enrollment in course 102; which statement removes only that enrollment? Options: DELETE FROM enrollments WHERE student_id = 4; (also removes student 4's enrollment in course 103); DELETE FROM enrollments WHERE student_id = 4 AND course_id = 102; (the answer: both key columns match exactly one row); DELETE FROM enrollments WHERE course_id = 102; (removes all three enrollments in course 102); DELETE FROM enrollments WHERE student_id = 4 OR course_id = 102; (OR matches four rows). Retry: to change only Femi's email, use UPDATE students SET email = 'femi.o@example.com' WHERE student_id = 6; the student_id primary key matches only Femi. With no WHERE, the UPDATE targets all six rows and fails on the unique email; WHERE city IS NULL also matches Chen.
