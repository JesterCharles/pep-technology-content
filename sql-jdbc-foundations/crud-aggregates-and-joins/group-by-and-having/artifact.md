# GROUP BY and HAVING

## Objectives

- Group rows with GROUP BY and compute one aggregate value per group
- Filter groups with HAVING and explain why WHERE cannot filter on an aggregate
- Fix a query that selects a column that is neither grouped nor aggregated

## Teaching

### Guess what happens to an ungrouped name

This is a guess before the grouping rule. `GROUP BY city` asks for one result row per city, with `COUNT(*)` counting the students in each. This query also asks for each student's `name`, and Leeds has two students, Ana and Dina.

`students` (email not shown)

| student_id | name | city |
| --- | --- | --- |
| 1 | Ana | Leeds |
| 2 | Ben | York |
| 3 | Chen | NULL |
| 4 | Dina | Leeds |
| 5 | Eli | Bristol |
| 6 | Femi | NULL |

### Activity checks

In progress

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: what does PostgreSQL do with this query?

1. Read the query and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Count students in each city

`GROUP BY credits` puts the courses with the same credits value into one group, then runs the aggregate once per group. The result has one row per distinct value. When the column has NULLs, they form one group of their own.

```
SELECT credits, COUNT(*) AS course_count
FROM courses
GROUP BY credits
ORDER BY credits;
```

Its result

| credits | course_count |
| --- | --- |
| 2 | 2 |
| 3 | 2 |
| 4 | 1 |

Every column in the SELECT list must be either in GROUP BY or inside an aggregate. That is why Activity 1 failed: one city group can hold several names, but `COUNT(*)` can sum the whole group up. (PostgreSQL makes one exception, for a column fully decided by a grouped primary key; this lesson does not use it.) Sorting puts a NULL group last by default; `NULLS LAST` says so explicitly.

Starting rows of `students` (email not shown)

| student_id | name | city |
| --- | --- | --- |
| 1 | Ana | Leeds |
| 2 | Ben | York |
| 3 | Chen | NULL |
| 4 | Dina | Leeds |
| 5 | Eli | Bristol |
| 6 | Femi | NULL |

### On the job

Decision: One total for the whole table, or one total per category?

Use it when: Each output row should stand for a category, such as one count per city, per product or per week.

→ Choose something else when: You need one number for the whole table, or the detail rows themselves; use an aggregate without GROUP BY, as in the aggregate functions topic, or no aggregate at all.

At work: Breakdowns such as “orders per region” or “sign-ups per week” are typical report and dashboard requests, and each one is a GROUP BY.

In interviews: You may be asked to count rows per category, or to explain why a selected column must appear in GROUP BY.

### Activity checks

In progress

- Each city, and the NULL group, has one row with its count, sorted by city with NULL last
- The columns are named `city` and `student_count`

### Your task

Ticket: marketing wants the number of students in each city, including students with no city recorded.

1. In students-by-city.sql, write one SELECT over `students` with the columns `city` and `student_count`.
2. Count all rows in each city group.
3. Sort by city with the NULL group last, and press Run.

### Keep only the busy courses

`WHERE` runs before groups exist, so it filters rows but cannot test `COUNT(*)`. `HAVING` runs after grouping, so it can test an aggregate and keep or drop whole groups.

```
SELECT student_id, COUNT(*) AS graded
FROM enrollments
WHERE grade IS NOT NULL
GROUP BY student_id
HAVING COUNT(*) >= 2
ORDER BY student_id;
```

Its result

| student_id | graded |
| --- | --- |
| 2 | 2 |

Read it in stages: WHERE keeps the graded rows, GROUP BY makes one group per student, COUNT counts each group, and HAVING keeps only students with at least two grades. Only Ben (student 2) has two.

Rows of `enrollments`

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

- Only the courses with at least 3 enrollments appear, in columns course_id and `enrollment_count`
- HAVING, not WHERE, holds the count condition

### Your task

Ticket: scheduling needs the courses with at least 3 enrollments, to book them bigger rooms.

1. In busy-courses.sql, write one SELECT over `enrollments` with the columns course_id and `enrollment_count`.
2. Keep only course groups with at least 3 enrollments.
3. Sort by course_id and press Run.

### Put each condition in the right place

A condition on single rows goes in WHERE, before GROUP BY. A condition on a group's aggregate, such as `COUNT(*) >= 2`, goes in HAVING, after GROUP BY, because no group exists until GROUP BY has run.

### Activity checks

In progress

You chose the query that puts the count condition in the right place and read why the others do not.

### Your task

Which query keeps only the city groups with at least two students?

Same idea, new form: which SELECT list is valid with `GROUP BY course_id`?

1. Under Choose the query, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT city, name, COUNT(*) FROM students GROUP BY city;
```

## Recap

- GROUP BY returns one row per distinct value of the grouping column; NULLs form one group.
- Every selected column must be in GROUP BY or inside an aggregate.
- WHERE filters rows before grouping; HAVING filters groups after the aggregates are computed.

Next topic: Inner and left joins

## Cheat sheet

A teacher sorts survey cards into piles by city, then counts each pile. They can label a pile “Leeds”, but cannot write one student's name on it as if that name stood for everyone.

GROUP BY makes the piles; aggregate functions sum each pile up.

Where to act: The SELECT list and the GROUP BY line.

Next step: Copy the shape of the credits example: select city and COUNT(*), then group by the column that is not inside an aggregate.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The ORDER BY line at the end.

Next step: Order by city; ascending order already puts the NULL group last, and NULLS LAST says so explicitly.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The SELECT list and the GROUP BY line.

Next step: Select course_id with COUNT(*), then group by course_id; this task needs no WHERE.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The line just after GROUP BY.

Next step: Add HAVING with the same COUNT(*) and compare it with 3, as the example does with 2.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `GROUP BY category` | one group per category |
| `COUNT(*)` | rows in each group |
| `WHERE row_condition` | filter before grouping |
| `HAVING COUNT(*) >= 3` | filter groups after counting |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- GROUP BY and HAVING
- SELECT: GROUP BY and HAVING
- Aggregate tutorial
- Sorting rows (NULL placement)

## Static interaction alternatives

### predict

Prediction (practice, not scored): what does PostgreSQL do with SELECT city, name, COUNT(*) FROM students GROUP BY city; ? Options: one name, picked at random, appears for each city; every name is joined into one text value; an ERROR, because name is neither grouped nor inside an aggregate; six rows appear because name cancels grouping. Answer: an ERROR, because one city group can hold several names.

### explore

Typed GROUP BY activity. students-by-city.sql starts with a comment line. Write one SELECT over students that returns city and student_count, counting all rows in each city group, sorted by city with the NULL group last. A correct run shows Bristol 1, Leeds 2, York 1 and the NULL group 2.

### explore

Typed HAVING activity. busy-courses.sql starts with a comment line. Write one grouped SELECT over enrollments that returns course_id and enrollment_count, keeps only groups with at least three rows using HAVING, and sorts by course_id. A correct run shows course 101 with 4 and course 102 with 3.

### mcq

Apply question: Which query keeps only the city groups with at least two students? Options: SELECT city, COUNT(*) FROM students WHERE COUNT(*) >= 2 GROUP BY city ORDER BY city; (WHERE runs before grouping, so COUNT(*) is not available there); SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) >= 2; (the answer: GROUP BY forms city groups, then HAVING filters their counts); SELECT city, COUNT(*) FROM students HAVING COUNT(*) >= 2; (city is selected without GROUP BY); SELECT city, COUNT(*) FROM students GROUP BY COUNT(*) >= 2; (GROUP BY needs the column to group on, not a test of an aggregate). Retry: with GROUP BY course_id, the valid SELECT list is course_id, COUNT(*).
