# Handling NULLs: COALESCE and CASE

## Objectives

- Predict the result of comparing a value with NULL, and filter missing values with IS NULL and IS NOT NULL
- Replace NULL with a fallback value using COALESCE
- Derive a labelled column from conditions with a CASE expression

## Teaching

### Guess who city = NULL finds

This is a guess before the NULL rules. NULL means “no value recorded”. Chen and Femi have no city recorded. Which rows does this query return?

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

Guess: which names does `WHERE city = NULL` return?

1. Read the query and the table in the reading column.
2. Under Prediction, choose one answer.
3. Choose your confidence, then press Check my prediction.

### Show readable text for a missing value

Any ordinary comparison with NULL, such as `= NULL` or `<> NULL`, gives unknown rather than true or false, and WHERE keeps only true rows. To test for a missing value, write `IS NULL`; for a present one, `IS NOT NULL`.

`COALESCE(a, b, ...)` returns the first of its values that is not NULL. Put a column first and a fallback after it, and every row gets something readable:

```
SELECT COALESCE(NULL, 'backup', 'last') AS first_known;
```

Its result

| first_known |
| --- |
| backup |

COALESCE changes only the query's result. The stored value stays NULL, so the database still records that nothing is known.

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

Decision: Show a fallback in the query, or store a real value instead of NULL?

Use it when: The value really is unknown and a report or screen needs readable text; keep NULL in the table and use COALESCE in the query.

→ Choose something else when: The value must always exist, such as a customer's email; make the column NOT NULL when you create the table, as in the CREATE TABLE topic, so a missing value is rejected instead of hidden.

At work: Exports, dashboards and data your back end sends to a web page often need readable text where data is missing; COALESCE in the query does that without changing what is stored.

In interviews: You may be asked why `WHERE column = NULL` returns no rows, or what COALESCE returns.

### Activity checks

In progress

- All six students appear with student_id, name and `city_label`, in student_id order
- The fallback text comes from COALESCE, not from a filter that removes rows

### Your task

Ticket: the mailing-list export needs every student's city, showing `Not recorded` where the city is missing.

1. In student-cities.sql, write one SELECT showing student_id, name and a column named `city_label`.
2. Make `city_label` the stored city, or `Not recorded` when the city is NULL.
3. Sort by student_id and press Run.

### Label rows with CASE

A `CASE` expression builds a new column from conditions. It checks its `WHEN` conditions from top to bottom and returns the result of the first one that is true; `ELSE` covers every row left over. `END` closes it, and AS names the new column.

```
SELECT course_id,
  CASE
    WHEN grade IS NULL THEN 'Awaiting grade'
    WHEN grade >= 70 THEN 'Pass'
    ELSE 'Review'
  END AS status
FROM enrollments
WHERE student_id = 1
ORDER BY course_id;
```

Its result: student 1 has grade 82 in course 101 and no grade yet in 102

| course_id | status |
| --- | --- |
| 101 | Pass |
| 102 | Awaiting grade |

No comparison with NULL is true, so without its own `IS NULL` branch the missing grade would skip `grade >= 70` and land in ELSE as Review. CASE changes only the result, never the stored row.

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

- Every course gets the label its fee calls for, in columns course_id, title and `fee_band`
- CASE gives the NULL fee its own branch instead of letting it fall into ELSE

### Your task

Ticket: the pricing page needs a fee band for each course: Not priced, Premium or Standard.

1. In course-fees.sql, write one SELECT showing course_id, title and a CASE column named `fee_band`.
2. `fee_band` is `Not priced` when fee is NULL, `Premium` when fee is at least 100, and `Standard` otherwise.
3. Sort by course_id and press Run.

### Keep only values that are present

`IS NULL` is true when a value is missing; `IS NOT NULL` is true when it is present. Any ordinary comparison with NULL, including `<> NULL`, is unknown, so WHERE drops that row, and `NOT` of unknown is still unknown. Chen and Femi are the two students with no city.

### Activity checks

In progress

You chose the condition that keeps exactly the rows with a recorded value and read why the others do not.

### Your task

A city report should include only students whose city is recorded. Which condition does that?

Same idea, new form: which WHERE condition keeps exactly the priced courses 101, 102, 104 and 105?

1. Under Choose the condition, pick one option.
2. Choose your confidence, then press Check answer.
3. If your first answer misses, a second question appears: answer it and press Check second try.

## Model

The query

```
SELECT name FROM students WHERE city = NULL;
```

## Recap

- Test for missing values with IS NULL and IS NOT NULL; ordinary comparisons with NULL are unknown, and WHERE drops unknown rows.
- COALESCE returns its first value that is not NULL, which gives a readable fallback in the result.
- CASE checks its WHEN conditions in order and returns one new value per row; give NULL its own branch.

Next topic: Aggregate functions

## Cheat sheet

A coat-check ticket with no number is not ticket number zero; the number is simply unknown. A clerk may write “not recorded” on a display list without inventing a number.

NULL is the unknown ticket number; COALESCE supplies display text without changing what is stored.

Where to act: The SELECT list of your query.

Next step: Give COALESCE two values: the city column first, then the quoted fallback text.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Right after your COALESCE, and at the end of the query.

Next step: Name the COALESCE result with AS, as in the example, then add ORDER BY student_id.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The first WHEN line of your CASE.

Next step: Give a NULL fee its own `WHEN fee IS NULL` branch first; without it, a NULL fee falls through to ELSE and reads Standard.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The lines after that first branch.

Next step: One more WHEN tests “at least 100”, ELSE covers the remaining fees, and END AS fee_band closes the column.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.
- Anything else is marked Not in this practice editor: a limit of this page, not a sign that your SQL is wrong. psql commands such as `\copy`, transactions and CREATE TABLE are not available here.
- Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `value IS NULL` | value is missing |
| `value IS NOT NULL` | value is present |
| `COALESCE(value, 'Unknown')` | readable fallback |
| `CASE WHEN condition THEN 'A' ELSE 'B' END` | build a label |

## Sources

Checked against current official PostgreSQL documentation on 2026-11-25. The practice editor runs only the subset listed under it; anything else is marked as not available in this practice editor, not as invalid PostgreSQL.

- Comparison predicates
- Logical operators
- CASE and COALESCE

## Static interaction alternatives

### predict

Prediction (practice, not scored): Chen and Femi have a NULL city. Which names does SELECT name FROM students WHERE city = NULL; return? Options: Chen only; Chen and Femi, because both cities are NULL; No rows; An ERROR, because NULL cannot appear in WHERE. Answer: no rows, because comparing anything with NULL using = gives unknown, and WHERE keeps only rows where the condition is true.

### explore

Typed COALESCE activity. student-cities.sql starts with a comment line. Write one SELECT that shows student_id, name and city_label, where city_label is the city or Not recorded when the city is NULL, sorted by student_id. A correct run shows all six students, with Not recorded for Chen and Femi.

### explore

Typed CASE activity. course-fees.sql starts with a comment line. Write one SELECT that shows course_id, title and fee_band, where fee_band is Not priced when fee is NULL, Premium when fee is at least 100 and Standard otherwise, sorted by course_id.

### mcq

Apply question: Which condition keeps only the students whose city is recorded? Options: city <> NULL (unknown for every row, so no students); city IS NOT NULL (the answer: true for the four students with a city, false for Chen and Femi); city IS NULL (keeps the opposite rows, Chen and Femi); NOT (city = NULL) (still unknown, so no students). Retry: which WHERE condition keeps exactly the priced courses 101, 102, 104 and 105? The answer is fee IS NOT NULL.
