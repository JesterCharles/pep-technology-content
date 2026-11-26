# Aggregate functions

## Objectives

- Summarize rows with COUNT, SUM, AVG, MIN and MAX
- Explain how COUNT(\*) differs from COUNT(column) and how aggregate functions treat NULL values

## Teaching

### Guess what two counts return

This is a guess before the counting rules. `COUNT` counts things and returns one number. The query below counts the courses twice: once with `*` inside COUNT, and once with the `instructor_id` column inside. Web Basics has no instructor yet.

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

You made a guess, chose a confidence and read why each option is right or wrong.

### Your task

Guess: what do `all_courses` and `staffed_courses` show?

1. Read the query and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Count all rows and known values

An aggregate function reads many rows and returns one value. Used without anything else in the SELECT list, it turns the whole table into one summary row. `COUNT(*)` counts rows. `COUNT(column)` counts only the rows where that column is not NULL.

```
SELECT COUNT(grade) AS graded
FROM enrollments;
```

Its result

| graded |
| --- |
| 6 |

There are 9 enrollment rows, so `COUNT(*)` on the same table returns 9; `COUNT(grade)` skips the 3 rows whose grade is still NULL. One SELECT list can hold several aggregates, separated by commas.

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

Decision: Return one summary number, or the detail rows behind it?

Use it when: A dashboard tile or a data check needs one number from many rows, such as how many customers have no city on record.

→ Choose something else when: Someone must look at the individual records, such as which customers have no city; return those rows with `WHERE city IS NULL`, as in the NULL topic, instead of a count.

At work: A colleague may ask how many customer records are missing an email; two counts side by side in one query answer it.

In interviews: You may be asked how `COUNT(*)` differs from `COUNT(column)`, or how aggregate functions treat NULL values; Activities 1 to 3 practise both.

### Activity checks

In progress

- One row shows 6 for all students and 4 for students with a city recorded
- The columns are named `student_count` and `known_city_count`

### Your task

Ticket: before a mailing, the team asks how many students there are and how many have a city recorded.

1. In student-counts.sql, write one SELECT over `students` on the empty line under the comment.
2. Return `student_count` for all students and `known_city_count` for students whose city is present.
3. Press Run and compare Output with the activity checks.

### Summarize course fees in one row

`SUM` adds values, `AVG` averages them, and `MIN` and `MAX` find the smallest and largest. All four skip NULL values: a missing value is not treated as zero.

```
SELECT AVG(grade) AS average, MAX(grade) AS highest
FROM enrollments;
```

Its result, from the 6 grades that are not NULL

| average | highest |
| --- | --- |
| 69.5000000000000000 | 91 |

SUM and MIN work the same way: the known grades add up to 417, and the lowest is 45. The average is 417 divided by 6, not by 9. PostgreSQL shows an average with many decimal places. If a column has no values that are not NULL, these four return NULL, while COUNT returns 0.

Starting rows of `courses` (other columns not shown)

| course_id | title | fee |
| --- | --- | --- |
| 101 | SQL Basics | 120.00 |
| 102 | Java Foundations | 150.00 |
| 103 | Data Modeling | NULL |
| 104 | Web Basics | 80.00 |
| 105 | Intro to Testing | 90.00 |

### Activity checks

In progress

- One row shows the total, average, lowest and highest of the four known fees, named `total_fee`, `average_fee`, `lowest_fee` and `highest_fee`
- Each value is computed from the `fee` column of `courses`

### Your task

Ticket: the finance dashboard needs one row summarizing course fees: total, average, lowest and highest.

1. In fee-summary.sql, write one SELECT over `courses` on the empty line under the comment.
2. Name the four results `total_fee`, `average_fee`, `lowest_fee` and `highest_fee`.
3. Press Run and compare Output with the activity checks.

### Choose the count a question needs

What you put inside COUNT decides what it counts: `*` counts rows, and a column counts the rows where that column is not NULL.

COUNT returns a whole number, and dividing one whole number by another in PostgreSQL drops the fraction: `4 / 6` is 0. To get a percentage, bring a decimal number such as `100.0` into the calculation before the division: `100.0 * 4 / 6` is about 66.7.

### Activity checks

In progress

You chose the expression that answers the question and read why the others do not.

### Your task

Which expression returns the percentage of students who have a city recorded?

Same idea, new form: a table has three rows and every amount is NULL. Which result is correct?

1. Under Choose the expression, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT COUNT(*) AS all_courses,
       COUNT(instructor_id) AS staffed_courses
FROM courses;
```

## Recap

- COUNT(*) counts rows; COUNT(column) counts the rows where that column is not NULL.
- SUM, AVG, MIN and MAX skip NULL values rather than treating them as zero.
- Used on their own, aggregates turn all the rows they read into one summary row. For a percentage, put a decimal such as 100.0 before the division.

Next topic: GROUP BY and HAVING

## Cheat sheet

Where to act: The first value in your SELECT list.

Next step: You need two counts: one of every row, and one that skips students whose city is NULL. Decide which form of COUNT gives each.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The second value in your SELECT list.

Next step: Name each count with AS, using the two names from the task, in the order the task gives them.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The SELECT list of your query.

Next step: The grade example uses two of the four functions; the task needs one function for each of its four results, and each reads fee from courses.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: After each function in your SELECT list.

Next step: Use AS after each function to give the four exact names from the task.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `COUNT(*)` | all rows |
| `COUNT(column)` | rows where column is not NULL |
| `SUM(column), AVG(column)` | total and average of known values |
| `MIN(column), MAX(column)` | smallest and largest known values |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- Aggregate Functions
- Aggregate Expressions
- Aggregate tutorial
- Mathematical operators
- NULLIF

## Static interaction alternatives

### predict

Prediction (practice, not scored): courses has 5 rows and Web Basics has a NULL instructor_id. What do COUNT(*) AS all_courses and COUNT(instructor_id) AS staffed_courses show? Options: 5 courses, 5 staffed; 5 courses, 4 staffed; 4 courses, 4 staffed; 4 courses, 5 staffed. Answer: 5 courses, 4 staffed, because COUNT(*) counts rows and COUNT(column) skips NULL values.

### explore

Typed COUNT activity. student-counts.sql starts with a comment line. Write one SELECT over students that returns student_count, counting all rows, and known_city_count, counting rows whose city is not NULL. A correct run shows one row: 6 and 4.

### explore

Typed aggregate activity. fee-summary.sql starts with a comment line. Write one SELECT over courses that returns total_fee, average_fee, lowest_fee and highest_fee using SUM, AVG, MIN and MAX of fee. A correct run shows one row computed from the four known fees.

### mcq

Apply question: Which expression returns the percentage of students who have a city recorded? Options: 100.0 * COUNT(*) / COUNT(*) (always 100 when rows exist; it never looks at city); 100.0 * COUNT(city) / COUNT(*) (the answer: known cities over all students, about 66.7); COUNT(city) / COUNT(*) * 100 (4 / 6 drops the fraction to 0 before the multiply, so the result is 0); 100.0 * COUNT(*) / COUNT(city) (the ratio is upside down, about 150). Retry: a table has three rows and every amount is NULL; COUNT(*) is 3 and SUM(amount) is NULL.
