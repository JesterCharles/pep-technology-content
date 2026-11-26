# Inner and left joins

## Objectives

- Combine rows from two tables with INNER JOIN ... ON a key relationship
- Use LEFT JOIN to keep rows that have no match, and predict where NULLs appear in the result
- Choose INNER JOIN or LEFT JOIN for a described report

## Teaching

### Guess who an inner join leaves out

You have not learned joins yet, so this is a guess. A join reads two tables in one query and pairs their rows up. These are the training team's instructors and the courses they teach. Each course row stores the `instructor_id` of its teacher.

`instructors` (other columns not shown)

| instructor_id | name |
| --- | --- |
| 1 | Mara |
| 2 | Tomas |
| 3 | Priya |
| 4 | Ken |

`courses` (other columns not shown)

| course_id | title | instructor_id |
| --- | --- | --- |
| 101 | SQL Basics | 2 |
| 102 | Java Foundations | 3 |
| 103 | Data Modeling | 3 |
| 104 | Web Basics | NULL |
| 105 | Intro to Testing | 4 |

No course row has `instructor_id` 1, so Mara teaches nothing yet. In the query, `instructors.name` means the `name` column of `instructors`: the table name and a dot say which table a column comes from.

### Activity checks

In progress

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: does Mara appear in this query's result?

1. Read the query and both tables in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Pair each enrollment with its student

An inner join pairs a row of one table with a row of another whenever its `ON` condition is true, usually on a foreign key and the key it points at.

Review: Tables, keys and relationships

An alias is a short name written after a table: with `courses AS c`, `c.title` means the title column of courses. Writing the alias and a dot before a column is called qualifying it. A column name both tables share, such as `instructor_id` here, must be qualified, or PostgreSQL stops with `column reference "instructor_id" is ambiguous`.

```
SELECT c.title, i.name
FROM courses AS c
INNER JOIN instructors AS i
  ON c.instructor_id = i.instructor_id
ORDER BY c.course_id;
```

Its result

| title | name |
| --- | --- |
| SQL Basics | Tomas |
| Java Foundations | Priya |
| Data Modeling | Priya |
| Intro to Testing | Ken |

Priya appears twice, once per matching course; Web Basics has no `instructor_id`, so `ON` is never true for it and it is left out.

`students` (other columns not shown)

| student_id | name |
| --- | --- |
| 1 | Ana |
| 2 | Ben |
| 3 | Chen |
| 4 | Dina |
| 5 | Eli |
| 6 | Femi |

`enrollments` (other columns not shown)

| student_id | course_id |
| --- | --- |
| 1 | 101 |
| 1 | 102 |
| 2 | 101 |
| 2 | 103 |
| 3 | 101 |
| 3 | 102 |
| 4 | 102 |
| 4 | 103 |
| 5 | 101 |

### Activity checks

In progress

- Each of the 9 enrollments appears once, with its student's name, in name order
- The result shows exactly `name` and `course_id`, sorted by name, then course_id

### Your task

Ticket: the course coordinator needs a class list showing each enrolled student's name with the course_id they take.

1. In enrolled-students.sql, on the empty line under the comment, write one SELECT that joins `students` to `enrollments` on `student_id`.
2. Show the columns `name` and `course_id`, sorted by name, then course_id.
3. Press Run and compare Output with the activity checks.

### Keep every instructor, even with no course

A left join keeps every row of the table written before `LEFT JOIN`, called the left table. Rows of the right table are paired as usual. When a left row has no match, PostgreSQL still returns it once and fills the right table's columns with NULL.

```
SELECT c.title, e.student_id
FROM courses AS c
LEFT JOIN enrollments AS e
  ON c.course_id = e.course_id
WHERE c.course_id IN (103, 104)
ORDER BY c.course_id, e.student_id;
```

Its result

| title | student_id |
| --- | --- |
| Data Modeling | 2 |
| Data Modeling | 4 |
| Web Basics | NULL |

Nobody is enrolled in Web Basics, so it appears once with a NULL `student_id`. With `INNER JOIN` it would vanish. A request for this kind of report usually says “every course, even ones nobody takes”.

`instructors` (other columns not shown)

| instructor_id | name |
| --- | --- |
| 1 | Mara |
| 2 | Tomas |
| 3 | Priya |
| 4 | Ken |

`courses` (other columns not shown)

| course_id | title | instructor_id |
| --- | --- | --- |
| 101 | SQL Basics | 2 |
| 102 | Java Foundations | 3 |
| 103 | Data Modeling | 3 |
| 104 | Web Basics | NULL |
| 105 | Intro to Testing | 4 |

### Activity checks

In progress

- Every instructor appears, once per course they teach
- Mara appears with a NULL course, in columns named `instructor` and `course`, sorted by instructor_id, then course_id

### Your task

Ticket: the staffing report must list every instructor with each course they teach, including instructors who teach none.

1. In instructor-courses.sql, write one SELECT with `instructors` as the left table of a LEFT JOIN to `courses`.
2. Name the two result columns `instructor` and `course`.
3. Sort by the instructor's id, then the course's id, and press Run. Both tables have an instructor_id column, so qualify it.

### Choose the join a report needs

Before you write a join, find the phrase in the request that says what happens to rows with no match. “Only instructors who teach a course” means they go: INNER JOIN. “Every instructor, even those with no course” means they stay: LEFT JOIN, with `instructors` as the left table. A wrong choice gives no error, only a report with rows missing.

### On the job

Decision: Should rows with no match stay in this report?

Use it when: The request says every customer, every instructor or every product, even those with nothing to pair; use LEFT JOIN with that table first.

→ Choose something else when: Only rows that have a match belong, such as customers who placed an order; use INNER JOIN, which leaves unmatched rows out.

At work: A report ticket may ask for “every customer and their orders”; your join decides whether customers with no orders quietly disappear, so compare the row count with what you expected before you hand the report over.

In interviews: You may be asked to explain the difference between INNER JOIN and LEFT JOIN and when you would use each; this activity practises that choice.

### Activity checks

In progress

You chose the join that keeps exactly the rows the report needs and read why the other options do not.

### Your task

A staffing report must list every instructor, including instructors assigned to no course. Which join fits?

Same idea, new form: a report should include only students who have at least one enrollment. Which join fits?

1. Under Choose the join, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT instructors.name, courses.title
FROM instructors
INNER JOIN courses
  ON instructors.instructor_id = courses.instructor_id;
```

## Recap

- INNER JOIN returns only pairs of rows whose ON condition is true; unmatched rows are left out.
- LEFT JOIN keeps every row of the left table and fills the right table's columns with NULL when nothing matches.
- Join on the key relationship, qualify a column name that both tables share (`s.student_id`), and pick the join from what the request says about rows with no match.

Next topic: Anti-joins and self-joins

## Cheat sheet

At event check-in, staff pair each registration card with the attendee badge carrying the same registration number. Cards with no matching badge stay out of the matched stack.

An inner join is the matched stack; ON states which numbers must agree.

Where to act: The empty line in enrolled-students.sql.

Next step: Copy the shape of the courses example: start FROM students with an alias, then INNER JOIN enrollments with a second alias.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The ON line and the ORDER BY line of your query.

Next step: Both tables have student_id, so ON compares it through the two aliases; ORDER BY takes two sort columns separated by a comma.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The FROM and LEFT JOIN lines of your query.

Next step: The table written first is the one whose rows all stay, so write instructors before LEFT JOIN and courses after it.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The ON line and the ORDER BY line.

Next step: ON compares the column the two tables share, qualified on each side. For the sort, the instructor's id decides first and the course's id only breaks ties.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `a INNER JOIN b ON ...` | matched rows only |
| `a LEFT JOIN b ON ...` | every a row; unmatched b columns are NULL |
| `s.student_id = e.student_id` | join on a key relationship |
| `students AS s` | alias: a short name for qualifying columns |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- Joined Tables
- Joins Between Tables

## Static interaction alternatives

### predict

Prediction (practice, not scored): Mara is instructor 1 and no course row has instructor_id 1. Does she appear in the result of the inner join of instructors and courses on instructor_id? Options: Mara appears once with a NULL title; Mara appears once with every course; Mara does not appear; The query fails because Mara has no match. Answer: Mara does not appear, because an inner join returns only pairs of rows for which ON is true.

### explore

Typed join activity. enrolled-students.sql starts with a comment line. Write one SELECT that inner-joins students to enrollments on student_id, shows name and course_id, and sorts by name, then course_id. A correct run shows 9 rows, one per enrollment, each with its student's name.

### explore

Typed left join activity. instructor-courses.sql starts with a comment line. Write one SELECT with instructors on the left of LEFT JOIN courses, joined on instructor_id, with result columns named instructor and course, sorted by the instructor's id, then the course's id. A correct run shows Mara with a NULL course, Tomas once, Priya twice and Ken once.

### mcq

Apply question: A staffing report must list every instructor, including instructors assigned to no course. Which join fits? Options: courses INNER JOIN instructors (an inner join still removes instructors without a match); instructors INNER JOIN courses (an inner join removes instructors without a matching course); instructors LEFT JOIN courses (the answer: every instructor starts on the left and is kept, and missing course columns become NULL); courses LEFT JOIN instructors (this keeps every course, not every instructor). Retry: a report should include only students who have at least one enrollment. The answer is students INNER JOIN enrollments, because an inner join returns only matching student and enrollment pairs.
