# GROUP BY and HAVING

## Objectives

- Group rows with GROUP BY and compute one aggregate value per group
- Filter groups with HAVING and explain why WHERE cannot filter on an aggregate
- Fix a query that selects a column that is neither grouped nor aggregated

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. This query asks for one count per city but also selects each student name. Predict what PostgreSQL does.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: One result row per group

`GROUP BY credits` puts courses with the same credits value into one group, then aggregates each group separately. The result has one row per distinct value; NULL values, when a column has them, form one group of their own.

```
SELECT credits, COUNT(*) AS course_count
FROM courses
GROUP BY credits
ORDER BY credits;
```

Ascending order already puts the NULL group last; with `DESC` you would add `NULLS LAST`.

Here, `name` must be grouped or aggregated: grouping by `city` does not determine one name, so a single student name cannot represent a whole city group, but COUNT(*) can summarize it. (PostgreSQL also accepts a column that a grouped primary key determines; this lesson does not rely on that.)

### Where this fits

Decision: A report needs totals per category rather than one grand total.

Good fit: Use GROUP BY when every output row represents a category, such as one count per city or course.

Choose something else when: Use a window function when detail rows must stay visible beside a group total; GROUP BY collapses the detail rows.

### Your task

Return one row per city with columns `city` and `student_count`. Count all rows in each group. Sort by city and put the NULL group last.

1. Where to look: The sample rows and students-by-city.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Each distinct city, including NULL, has one result row
- COUNT(*) reports the size of each group

### Activity 3 of 4: Filter rows before grouping, groups after

`WHERE` runs before groups exist, so it can filter input rows but cannot test `COUNT(*)`. `HAVING` runs after grouping and can test an aggregate result.

```
SELECT category, COUNT(*)
FROM items
WHERE active = true
GROUP BY category
HAVING COUNT(*) >= 3;
```

Read it in stages: keep active rows, form category groups, compute each count, then keep groups whose count reaches three.

### Your task

Show course_id and `enrollment_count` only for courses with at least 3 enrollments. Sort by course_id.

1. Where to look: The sample rows and busy-courses.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- The result has one row for each qualifying course
- HAVING filters the computed group count

### Activity 4 of 4: Place each condition in its stage

WHERE cannot use a group aggregate because no group has been built yet. HAVING can use one because it runs after GROUP BY.

### Your task

Which query keeps only city groups with at least two students?

Same idea, new form: Which SELECT list is valid with `GROUP BY course_id`?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the query that matches the report requirement and can explain why the others do not.

## Model

The query

```
SELECT city, name, COUNT(*) FROM students GROUP BY city;
```

## Recap

- GROUP BY produces one result row per distinct grouping value.
- Select grouped columns and aggregates; a column such as name that the grouping key does not determine must be grouped or aggregated.
- WHERE filters input rows before grouping; HAVING filters groups after aggregates are computed.

Next topic: Inner and left joins

## Cheat sheet

A teacher sorts survey cards into piles by city, then counts each pile. They can label a pile “Leeds,” but cannot put one student’s name on it as if that name represented everyone.

GROUP BY makes the piles; aggregate functions summarize each pile.

Where to act: The empty line in students-by-city.sql.

Next step: Select city and COUNT(*), then group by the non-aggregate selected column.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: Order by city; ascending already puts the missing-city group last, and NULLS LAST says so explicitly.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in busy-courses.sql.

Next step: Select course_id with COUNT(*), then group by course_id.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: After GROUP BY, add HAVING with the same COUNT(*) expression and compare it with 3.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `GROUP BY category` | one group per category |
| `COUNT(*)` | rows in each group |
| `WHERE row_condition` | filter before grouping |
| `HAVING COUNT(*) >= 3` | filter groups after counting |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16; NULL group placement was rechecked on 2026-11-06. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- GROUP BY and HAVING
- SELECT: GROUP BY and HAVING
- Aggregate tutorial
- Sorting rows (NULL placement)

## Static interaction alternatives

### predict

Prediction options: One arbitrary name appears for each city; Every name is joined into one text value; An ERROR: name is neither grouped nor aggregated; Six rows appear because name cancels grouping

### explore

Write a grouped SELECT that counts students per city and orders NULL last.

### explore

Write a grouped SELECT that keeps only course groups with at least three enrollment rows.

### mcq

Apply question: Which query keeps only city groups with at least two students? Options: `SELECT city, COUNT(*) FROM students WHERE COUNT(*) >= 2 GROUP BY city;` (WHERE runs before grouping, so `COUNT(*)` is not available there.); `SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) >= 2;` (the answer: GROUP BY forms city groups, then HAVING filters their counts.); `SELECT city, COUNT(*) FROM students HAVING COUNT(*) >= 2;` (city is selected without GROUP BY, so it cannot identify one aggregate result row.); `SELECT city FROM students GROUP BY COUNT(*) >= 2;` (GROUP BY needs the grouping expression, not a comparison on an aggregate.). Retry: Which SELECT list is valid with GROUP BY course_id? The answer is `course_id, COUNT(*)`: course_id identifies each group and `COUNT(*)` summarizes it.
