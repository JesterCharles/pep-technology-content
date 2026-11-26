# Filtering and sorting

## Objectives

- Filter rows with WHERE using comparison operators, AND, OR, IN, BETWEEN and LIKE
- Sort results with ORDER BY on one or more columns, ascending or descending
- Predict the row order a query returns, and make it deterministic with explicit sort keys, including a tie-breaking column

## Teaching

### Guess the order two matching rows come back in

This is a guess before the sorting rule. Two students live in Leeds: Ana, whose row was added first, and Dina. This query keeps only rows whose `city` is `'Leeds'`:

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

Guess: what does PostgreSQL promise about the order of Ana's and Dina's rows?

1. Read the query and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Filter a contact list by city

`WHERE` keeps only rows whose condition is true. Comparisons use `=`, `<>` (not equal), `<`, `<=`, `>` and `>=`. Join conditions with `AND` when both must hold, or `OR` when either is enough.

`IN ('Leeds', 'York')` is a short way to write “equal to any of these”. `BETWEEN 2 AND 3` includes both ends. `LIKE '%Basics%'` matches text containing “Basics”: `%` stands for any run of characters.

`ORDER BY column` sorts from low to high; add `DESC` after a column to sort it from high to low. With two columns, the second one sorts only the rows that tie on the first.

```
SELECT title, credits FROM courses
WHERE credits BETWEEN 2 AND 3
  AND title LIKE '%Basics%'
ORDER BY credits DESC, title;
```

Its result

| title | credits |
| --- | --- |
| SQL Basics | 3 |
| Web Basics | 2 |

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

Decision: Filter and sort in the query, or fetch every row and do it in Java?

Use it when: The rule is a condition on columns, such as one region or a price range; WHERE and ORDER BY do the work, so only the rows you need leave the database.

→ Choose something else when: The rows are already in your program, or the rule needs logic this SQL cannot express; then filter them in Java with an ordinary loop, as in Java Foundations.

At work: A screen such as “customers in this region, newest first” is backed by a query like this one; the JDBC code you write later in this course sends exactly these WHERE and ORDER BY clauses.

In interviews: You may be asked to write a query that filters and sorts a table, or to explain why rows can come back in a different order when there is no ORDER BY.

### Activity checks

In progress

- Only the Leeds and York students appear, with student_id, name and city
- ORDER BY sorts by city, then student_id from high to low

### Your task

Ticket: the regional coordinator wants the students from Leeds or York, grouped by city, newest student first in each city.

1. In student-report.sql, write one SELECT on the empty line under the comment, showing `student_id`, `name` and `city`.
2. Keep only Leeds and York.
3. Sort by city, then by student_id from high to low, and press Run.

### Sort a catalogue so ties stay put

If rows tie on every sort column, PostgreSQL may return them in either order, and the order can change from one run to the next. When a report, a page of results or a test needs a repeatable order, end ORDER BY with a column that is different on every row, usually the primary key. That last column is called the tie-breaker.

```
SELECT course_id, title, credits
FROM courses
ORDER BY credits DESC, course_id;
```

That puts the 4-credit course first, then the two 3-credit courses in course_id order, then the 2-credit ones. NULL sorts as if it were larger than every value, so `DESC` puts a NULL first; writing `NULLS LAST` right after a sort column moves its NULLs to the end.

Starting rows of `courses`

| course_id | title | credits | fee |
| --- | --- | --- | --- |
| 101 | SQL Basics | 3 | 120.00 |
| 102 | Java Foundations | 4 | 150.00 |
| 103 | Data Modeling | 3 | NULL |
| 104 | Web Basics | 2 | 80.00 |
| 105 | Intro to Testing | 2 | 90.00 |

### Activity checks

In progress

- Only the courses with at least 3 credits appear, with course_id, title, credits and fee
- Fees run from highest to lowest, the NULL fee is last, and course_id is the tie-breaker

### Your task

Ticket: the catalogue page lists courses with at least 3 credits, priciest first, unpriced courses last, in a repeatable order.

1. In course-report.sql, write one SELECT showing course_id, title, credits and fee for courses with at least 3 credits.
2. Sort by fee from high to low with the NULL fee last, then by course_id as the tie-breaker.
3. Press Run and compare Output with the activity checks.

### Choose the stable report

Filtering and sorting are separate jobs. WHERE decides which rows stay; ORDER BY decides how the rows that stayed are arranged, and it always comes after WHERE. A stable report ends its ORDER BY with a tie-breaker that is different on every row.

### Activity checks

In progress

You chose the ending that matches the report request and read why the other options do not.

### Your task

A report lists all 3-credit courses, highest fee first, and must stay stable when two fees tie. Which ending does that?

Same idea, new form: which condition keeps courses whose credits are 2 or 3 and whose title contains “Basics”?

1. Under Choose the ending, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT student_id, name FROM students WHERE city = 'Leeds';
```

## Recap

- WHERE filters rows: AND narrows, OR widens, IN lists choices, BETWEEN includes both ends, and LIKE matches a pattern.
- ORDER BY sorts from low to high unless you add DESC; NULLS LAST moves NULLs to the end.
- Without ORDER BY, row order is not promised. End ORDER BY with a tie-breaker to make it repeatable.

Next topic: Handling NULLs: COALESCE and CASE

## Cheat sheet

A music app first narrows a library to songs in two chosen genres, then sorts that smaller list by artist and title.

WHERE decides which songs stay on the list; ORDER BY arranges the songs that stayed.

Where to act: The WHERE line of your query.

Next step: Use `city IN (...)`; the two city names go inside the brackets, each in single quotes.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The ORDER BY line, at the end of the query.

Next step: ORDER BY takes a comma-separated list: city first, then student_id with DESC after it.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The WHERE line of your query.

Next step: “At least 3” includes 3 itself; one comparison operator from the reading column says exactly that.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The ORDER BY line.

Next step: The fee column needs two words after it, one for direction and one for where NULL goes; the tie-breaker comes after a comma.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `WHERE city IN ('Leeds', 'York')` | match either city |
| `WHERE credits BETWEEN 2 AND 3` | range, both ends included |
| `WHERE title LIKE '%Basics%'` | contains text |
| `ORDER BY fee DESC NULLS LAST, course_id` | high to low, NULL last, tie-breaker |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- WHERE clause
- Sorting Rows
- Comparison operators and BETWEEN
- LIKE

## Static interaction alternatives

### predict

Prediction (practice, not scored): two students live in Leeds, Ana (added first) and Dina. What does PostgreSQL promise about their order in SELECT student_id, name FROM students WHERE city = 'Leeds'; ? Options: Ana must appear before Dina because her row was added first; Dina must appear before Ana because her id is larger; Both rows appear, but their order is not promised; The query fails because WHERE requires ORDER BY. Answer: both rows appear, but without ORDER BY their order is not promised.

### explore

Typed filter-and-sort activity. student-report.sql starts with a comment line. Write one SELECT over students that shows student_id, name and city, keeps Leeds and York, and sorts by city, then student_id descending. A correct run shows Dina and Ana (Leeds, Dina first), then Ben (York).

### explore

Typed sort activity. course-report.sql starts with a comment line. Write one SELECT over courses that shows course_id, title, credits and fee for courses with at least 3 credits, sorted by fee descending with the NULL fee last, then by course_id. A correct run shows Java Foundations, SQL Basics, then Data Modeling.

### mcq

Apply question: A report lists all 3-credit courses, highest fee first, and must stay stable when two fees tie. Which ending does that? Options: WHERE credits = 3 ORDER BY fee DESC, course_id; (the answer: WHERE keeps 3 credits, fee sorts high to low and course_id breaks fee ties); ORDER BY fee DESC WHERE credits = 3, course_id; (WHERE must come before ORDER BY); WHERE credits = 3 ORDER BY course_id, fee DESC; (this sorts by course_id first, so fee order is lost); WHERE credits = 3 ORDER BY fee DESC; (rows with the same fee still have no promised order). Retry: the condition is credits IN (2, 3) AND title LIKE '%Basics%'.
