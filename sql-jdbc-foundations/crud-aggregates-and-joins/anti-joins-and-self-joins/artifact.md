# Anti-joins and self-joins

## Objectives

- Find rows that have no matching row in another table with LEFT JOIN ... IS NULL or NOT EXISTS
- Join a table to itself with table aliases to relate rows of the same table, such as an employee and their manager
- Explain why NOT IN with a subquery that returns a NULL selects no rows

## Teaching

### Guess what NOT IN does with a NULL

This is a guess before the rule. You met `IN (...)` in filtering: it is true when a value equals any item in the list. `NOT IN (...)` is meant to be true when it equals none of them. This list holds two instructor ids and one NULL.

`instructors` (other columns not shown)

| instructor_id | name |
| --- | --- |
| 1 | Mara |
| 2 | Tomas |
| 3 | Priya |
| 4 | Ken |

### Activity checks

In progress

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: which names does this NOT IN query return?

1. Read the query and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Find students with no enrollment

An anti-join returns the rows of one table that have no matching row in another. One way to write it: LEFT JOIN, which you met in the previous topic, then keep only the rows where the right table's key came back NULL.

```
SELECT c.course_id, c.title
FROM courses AS c
LEFT JOIN enrollments AS e
  ON c.course_id = e.course_id
WHERE e.course_id IS NULL
ORDER BY c.course_id;
```

Its result: the courses nobody has enrolled in

| course_id | title |
| --- | --- |
| 104 | Web Basics |
| 105 | Intro to Testing |

A real enrollment row always has a `course_id`, so NULL there can only mean “no match”. Test a right-side column that is never NULL in its own table, such as its key.

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

### On the job

Decision: Do I need the rows that have a match, or the ones that have none?

Use it when: The question is “which customers have never ordered?” or “which courses has nobody taken?”; use LEFT JOIN with an IS NULL test on the right table's key.

→ Choose something else when: Matched and unmatched rows both belong in the result; use a plain LEFT JOIN without the IS NULL test, as in the previous topic.

At work: Follow-up and clean-up tasks such as “customers who never placed an order” or “accounts that never logged in” are anti-join queries.

In interviews: You may be asked to find the customers who have never placed an order; this activity practises exactly that shape.

### Activity checks

In progress

- Only students with no enrollment appear, found with a LEFT JOIN and an IS NULL test on the enrollments key
- The result shows exactly `student_id` and `name`

### Your task

Ticket: student services wants to email every student who has not enrolled in any course yet.

1. In unenrolled-students.sql, write one SELECT with `students` on the left of a LEFT JOIN to `enrollments`.
2. Keep only the rows where the enrollments key is NULL, and show student_id and name.
3. Sort by student_id and press Run.

### List each instructor with their lead

In `instructors`, `lead_id` points at another row of the same table: the instructor's lead. A self-join joins a table to itself. Two aliases give the two copies different roles: one copy for the person, one for their lead. An alias can be a whole word, such as `employee`.

```
SELECT w.name, l.name
FROM instructors AS w
INNER JOIN instructors AS l
  ON w.lead_id = l.instructor_id
WHERE w.name = 'Ken';
```

Its result: Ken's row stores lead_id 2, which is Tomas's instructor_id

| name | name |
| --- | --- |
| Ken | Tomas |

Both result columns are called `name`, so a real report names them with AS. Mara has no lead (NULL), so an inner self-join would drop her; LEFT JOIN keeps her. The same shape answers “list each employee with their manager”.

`instructors`

| instructor_id | name | lead_id |
| --- | --- | --- |
| 1 | Mara | NULL |
| 2 | Tomas | 1 |
| 3 | Priya | 1 |
| 4 | Ken | 2 |

### Activity checks

In progress

- Every instructor appears with their lead's name, or NULL for Mara, in columns named `employee` and `manager`
- The rows come from `instructors` used twice, one copy named employee and one named manager

### Your task

Ticket: HR needs a reporting-lines list: every instructor with the name of their lead, including Mara, who has none.

1. In reporting-lines.sql, join `instructors` to itself with the aliases `employee` and `manager`, using LEFT JOIN.
2. Show two columns named `employee` and `manager`.
3. Sort by the employee's instructor_id and press Run.

### Choose a safe way to find unmatched rows

A subquery is a SELECT in brackets inside another query. `NOT EXISTS (SELECT ...)` is true when the inner SELECT returns no rows. The inner SELECT can use the outer row, so it checks each row in turn:

```
SELECT c.title
FROM courses AS c
WHERE NOT EXISTS (
  SELECT 1 FROM enrollments AS e
  WHERE e.course_id = c.course_id
);
```

Its result

| title |
| --- |
| Web Basics |
| Intro to Testing |

`SELECT 1` returns a placeholder; only whether a row exists matters. `NOT IN (SELECT instructor_id FROM courses)` instead compares with the list the inner SELECT returns. Course 104's instructor_id is NULL, so that list holds a NULL and, as in Activity 1, NOT IN keeps nobody. In the options, `i` is the alias of `instructors` in the outer query.

`courses` (other columns not shown)

| course_id | instructor_id |
| --- | --- |
| 101 | 2 |
| 102 | 3 |
| 103 | 3 |
| 104 | NULL |
| 105 | 4 |

### Activity checks

In progress

You chose the pattern that still works when the other table holds NULLs and read why the others do not.

### Your task

Which WHERE safely finds instructors who teach no course, even though `courses.instructor_id` can be NULL?

Same idea, new form: which self-join condition connects an employee row to its manager row?

1. Under Choose the pattern, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT name FROM instructors
WHERE instructor_id NOT IN (2, 3, NULL);
```

## Recap

- An anti-join keeps the rows of one table that have no match in another: LEFT JOIN, then test the right table's key with IS NULL, or use NOT EXISTS.
- NOT IN keeps nothing when its list or subquery contains a NULL, because the comparison becomes unknown.
- A self-join gives one table two aliases so each copy plays a different role, such as employee and manager.

This is the final topic in this module.

## Cheat sheet

A coordinator compares a class roster with a sign-in sheet, then circles every roster name that has no signature next to it.

The roster is the left table; a missing signature is the NULL right-side key.

Where to act: The FROM and LEFT JOIN lines of your query.

Next step: Which table holds every row you must be able to see, and which one may have no match? The first goes before LEFT JOIN, joined on the column they share.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The WHERE line after the join.

Next step: After a LEFT JOIN, a student with no enrollment gets NULL in every enrollments column. Keep only those rows with a WHERE test on the enrollments key.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The FROM and LEFT JOIN lines.

Next step: Write instructors twice, first AS employee, then AS manager after LEFT JOIN.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The ON line and the SELECT list.

Next step: In the Ken example, one copy's lead_id was compared with the other copy's instructor_id. Decide which of your aliases plays each part, then take one name from each copy.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `LEFT JOIN ... WHERE right.key IS NULL` | rows with no match |
| `WHERE NOT EXISTS (SELECT 1 FROM ... WHERE ...)` | no match, safe with NULLs |
| `instructors AS employee ... instructors AS manager` | two roles for one table |
| `employee.lead_id = manager.instructor_id` | follow a key within one table |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- Joined tables and aliases
- EXISTS and NOT IN
- Self and outer joins

## Static interaction alternatives

### predict

Prediction (practice, not scored): instructors are 1 Mara, 2 Tomas, 3 Priya and 4 Ken. Which names does SELECT name FROM instructors WHERE instructor_id NOT IN (2, 3, NULL); return? Options: Mara and Ken; Mara only; No rows; An ERROR because NULL is in the list. Answer: no rows, because comparing with the NULL item gives unknown, so NOT IN is never true.

### explore

Typed anti-join activity. unenrolled-students.sql starts with a comment line. Write one SELECT with students on the left of a LEFT JOIN to enrollments on student_id, keeping only rows where the enrollments key IS NULL, showing student_id and name, sorted by student_id. A correct run shows only Femi.

### explore

Typed self-join activity. reporting-lines.sql starts with a comment line. Write one SELECT that joins instructors to itself with the aliases employee and manager and a LEFT JOIN, showing the two names in columns named employee and manager, sorted by the employee's instructor_id. A correct run shows Mara with NULL, Tomas and Priya with Mara, and Ken with Tomas.

### mcq

Apply question: Which WHERE safely finds instructors who teach no course, even though courses.instructor_id can be NULL? Options: WHERE i.instructor_id NOT IN (SELECT instructor_id FROM courses) (the list contains NULL, so NOT IN keeps nobody); WHERE NOT EXISTS (SELECT 1 FROM courses AS c WHERE c.instructor_id = i.instructor_id) (the answer: it checks each instructor for a real match); WHERE i.instructor_id <> (SELECT instructor_id FROM courses) (<> needs exactly one value, but the subquery returns five rows); WHERE NOT EXISTS (SELECT 1 FROM courses AS c WHERE c.instructor_id = c.instructor_id) (the inner WHERE never mentions the outer instructor, so a match always exists and nobody is kept). Retry: which self-join condition connects an employee row to its manager row.
