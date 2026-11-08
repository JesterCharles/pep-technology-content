# Filtering and sorting

## Objectives

- Filter rows with WHERE using comparison operators, AND, OR, IN, BETWEEN and LIKE
- Sort results with ORDER BY on one or more columns, ascending or descending
- Predict the row order a query returns, and make it deterministic with explicit sort keys, including a tie-breaking column

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. The `students` table has two people from Leeds. Predict what PostgreSQL promises about their order before seeing the sorting rule.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: Filter before you sort

`WHERE` keeps only rows whose condition is true. Comparisons use `=`, `<>` (or `!=`), `<`, `<=`, `>` and `>=`. Combine conditions with `AND` when both must hold, or `OR` when either may hold.

`IN ('Leeds', 'York')` is a compact set of equality choices. `BETWEEN 2 AND 3` includes both endpoints. `LIKE '%Basics%'` matches text containing “Basics”; `%` stands for any sequence of characters.

```
SELECT title, credits FROM courses
WHERE credits BETWEEN 2 AND 3
  AND title LIKE '%Basics%';
```

### Where this fits

Decision: A report needs a known subset in a stable display order.

Good fit: Use WHERE for row conditions and ORDER BY for presentation or repeatable tests.

Choose something else when: Use a unique constraint, not ORDER BY, when the requirement is to prevent duplicate data; sorting only changes result presentation.

### Your task

List students from Leeds or York. Show `student_id`, `name` and `city`; sort by city ascending, then student_id descending so ties are deterministic.

1. Where to look: The sample rows and student-report.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Only the Leeds and York students appear
- Rows are ordered by city, then student_id descending

### Activity 3 of 4: Make ties deterministic

`ORDER BY column` sorts ascending by default; add `DESC` for descending. With several keys, PostgreSQL uses the second key only when the first ties, then the third for any remaining tie.

If the sort keys tie completely, PostgreSQL may return those rows in either order. Add a stable unique key, usually the primary key, last when a report, page, or test needs repeatable order.

```
SELECT course_id, title, credits
FROM courses
ORDER BY credits DESC, course_id;
```

That groups equal credit values and then makes their internal order explicit.

NULL sorts as if larger than every value, so `DESC` puts it first; `NULLS LAST` after a key moves it to the end.

### Your task

List courses with at least 3 credits. Show course_id, title, credits and fee. Sort highest fee first with the NULL fee last, then by course_id as the tie-breaker.

1. Where to look: The sample rows and course-report.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Only the courses with at least 3 credits appear
- Fees descend, the NULL fee is last, and course_id breaks ties

### Activity 4 of 4: Choose the stable report

Filtering and sorting are separate jobs: WHERE decides which rows qualify; ORDER BY decides how all qualifying rows are arranged. A stable report ends its ORDER BY with a key that distinguishes tied rows.

### Your task

A report lists all 3-credit courses, highest fee first, and must stay stable when two fees tie. Which ending does that?

Same idea, new form: Which condition keeps courses whose credits are 2 or 3 and whose title contains “Basics”?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the query that matches the report requirement and can explain why the others do not.

## Model

The query

```
SELECT student_id, name FROM students WHERE city = 'Leeds';
```

## Recap

- WHERE filters rows; AND narrows, OR widens, IN lists choices, BETWEEN includes both bounds, and LIKE matches a pattern.
- ORDER BY sorts ascending by default; add DESC to reverse a key.
- Without ORDER BY, row order is unspecified. Add a unique final key to make ties deterministic.

Next topic: Handling NULLs: COALESCE and CASE

## Cheat sheet

A music app first filters a library to songs in two chosen genres, then sorts that smaller list by artist and title.

WHERE decides which cards remain on the table; ORDER BY arranges the cards that remain.

Where to act: The empty line in student-report.sql.

Next step: Build WHERE with `city IN (...)`; the two quoted city names go inside the parentheses.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: ORDER BY accepts a comma-separated list. Put city first, then student_id with DESC.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in course-report.sql.

Next step: Keep courses with 3 or more credits; any comparison, BETWEEN or IN works.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: Sort fee descending, move the NULL fee last, then append the stable key.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `WHERE city IN ('Leeds', 'York')` | match either city |
| `WHERE credits BETWEEN 2 AND 3` | inclusive range |
| `WHERE title LIKE '%Basics%'` | contains text |
| `ORDER BY fee DESC NULLS LAST, course_id` | descending fee, explicit NULL position, stable tie-breaker |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16; NULL sort placement was rechecked on 2026-11-06. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- WHERE clause
- Sorting Rows
- Comparison operators and BETWEEN
- LIKE

## Static interaction alternatives

### predict

Prediction options: Ana must appear before Dina because her row was inserted first; Dina must appear before Ana because her id is larger; Both rows appear, but their order is not promised; The query fails because WHERE requires ORDER BY

### explore

Write a SELECT over students that keeps Leeds and York and sorts by city, then student_id descending.

### explore

Write a SELECT over courses that keeps at least 3 credits, then sorts fee descending with the NULL fee last and a stable tie-breaker.

### mcq

Apply question: A report lists all 3-credit courses, highest fee first, and must stay stable when two fees tie. Which ending does that? Options: WHERE credits = 3 ORDER BY fee DESC, course_id; (the answer: WHERE filters to 3 credits; fee sorts high to low; course_id breaks fee ties.); ORDER BY fee DESC WHERE credits = 3, course_id; (SQL places WHERE before ORDER BY, and a comma cannot add a WHERE condition inside ORDER BY.); WHERE credits = 3; (this filters correctly but leaves every row order unspecified.); WHERE credits = 3 ORDER BY fee DESC; (fee order is descending, but rows with the same fee still have no explicit order.). Retry: Which condition keeps courses whose credits are 2 or 3 and whose title contains “Basics”? The answer is credits IN (2, 3) AND title LIKE '%Basics%': IN selects the two credit values, then AND requires the title pattern too.
