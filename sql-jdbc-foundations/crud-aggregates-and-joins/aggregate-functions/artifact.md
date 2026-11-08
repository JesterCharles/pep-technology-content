# Aggregate functions

## Objectives

- Summarize rows with COUNT, SUM, AVG, MIN and MAX
- Explain how COUNT(\*) differs from COUNT(column) and how aggregate functions treat NULL values

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. The courses table has 5 rows, but Web Basics has no instructor yet, so one instructor_id value is NULL. Predict the two counts before seeing the NULL rule.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: Count rows and known values

An aggregate turns a set of input rows into one summary value. `COUNT(*)` counts rows. `COUNT(expression)` counts rows where that expression is not NULL.

That distinction answers two different questions: “How many students?” and “How many students have a city recorded?”

```
SELECT COUNT(*) AS all_rows,
       COUNT(optional_column) AS known_values
FROM some_table;
```

Without GROUP BY, one aggregate query produces one summary row.

### Where this fits

Decision: A dashboard or validation check needs one number from many rows.

Good fit: Use aggregates for totals, averages, ranges, and completeness counts.

Choose something else when: Return detail rows instead when someone must inspect individual records; one aggregate value intentionally hides row-level differences.

### Your task

Return one row with `student_count` for all students and `known_city_count` for students whose city is present.

1. Where to look: The sample rows and student-counts.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- The result is one row with 6 and 4
- COUNT(*) and COUNT(city) answer the two different questions

### Activity 3 of 4: Summarize numeric values

`SUM` adds non-NULL values; `AVG` averages non-NULL values; `MIN` and `MAX` find the smallest and largest non-NULL values. Most aggregates ignore NULL inputs.

Here one course fee is NULL, so the fee total, average, minimum and maximum use the four known fees. The missing fee is not treated as zero.

```
SELECT SUM(amount), AVG(amount), MIN(amount), MAX(amount)
FROM payments;
```

If no non-NULL input exists, these aggregates return NULL; COUNT returns zero.

### Your task

Summarize course fees in one row. Name the columns `total_fee`, `average_fee`, `lowest_fee` and `highest_fee`.

1. Where to look: The sample rows and fee-summary.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- The total, average, minimum and maximum use the four known fees
- SUM, AVG, MIN and MAX each answer their named question

### Activity 4 of 4: Choose the count that answers the question

The expression inside COUNT defines what absence means. Use the star for physical rows; use a nullable column for known values in that column.

COUNT returns a `bigint`, and dividing two integers truncates toward zero. Bring a numeric value such as `100.0` into the calculation before the division when you need a fraction or percentage.

### Your task

Which expression returns the percentage of students who have a city recorded?

Same idea, new form: A table has three rows and every amount is NULL. Which result is correct?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the query that matches the report requirement and can explain why the others do not.

## Model

The query

```
SELECT COUNT(*) AS all_courses, COUNT(instructor_id) AS staffed_courses FROM courses;
```

## Recap

- COUNT(*) counts rows; COUNT(column) counts non-NULL values in that column.
- SUM, AVG, MIN and MAX ignore NULL inputs rather than treating NULL as zero.
- Without GROUP BY, aggregates summarize the qualifying rows into one result row.

Next topic: GROUP BY and HAVING

## Cheat sheet

At the end of a workshop, a facilitator counts every attendance card, then counts only cards with a phone number written on them.

COUNT(*) is the stack of cards; COUNT(phone) is the smaller stack with known phone values.

Where to act: The empty line in student-counts.sql.

Next step: The all-row count puts an asterisk inside COUNT.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: For known cities, put the nullable column name inside the second COUNT and name both output columns.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in fee-summary.sql.

Next step: Write four comma-separated expressions in one SELECT; each function receives fee.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: Use AS after each expression to give the four exact result names from the task.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `COUNT(*)` | all rows |
| `COUNT(column)` | non-NULL values |
| `SUM(column), AVG(column)` | total and average of known values |
| `MIN(column), MAX(column)` | smallest and largest known values |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16; the activity 4 percentage was rechecked on 2026-10-27. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- Aggregate Functions
- Aggregate Expressions
- Aggregate tutorial
- Mathematical operators
- NULLIF

## Static interaction alternatives

### predict

Prediction options: 5 courses, 5 staffed; 5 courses, 4 staffed; 4 courses, 4 staffed; 4 courses, 5 staffed

### explore

Write one aggregate SELECT that compares COUNT(*) with COUNT(city).

### explore

Write one SELECT with SUM, AVG, MIN and MAX over course fee.

### mcq

Apply question: Which expression returns the percentage of students who have a city recorded? Options: `100.0 * COUNT(*) / COUNT(*)` (both counts are the same, so this is always 100 when rows exist; it never inspects city.); `100.0 * COUNT(city) / COUNT(*)` (the answer: 100.0 makes the arithmetic numeric; known cities over all students gives about 66.7.); `COUNT(city) / COUNT(*) * 100` (COUNT returns bigint, so 4 / 6 is integer division and truncates to 0 before the multiply: the result is 0.); `100.0 * COUNT(*) / COUNT(city)` (this reverses the ratio, about 150, so it can exceed 100.). Retry: A table has three rows and every amount is NULL. Which result is correct? The answer is `COUNT(*)` is 3 and `SUM(amount)` is NULL: `COUNT(*)` counts rows; SUM ignores NULL inputs and has no value to return.
