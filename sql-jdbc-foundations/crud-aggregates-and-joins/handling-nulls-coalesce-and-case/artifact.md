# Handling NULLs: COALESCE and CASE

## Objectives

- Predict the result of comparing a value with NULL, and filter missing values with IS NULL and IS NOT NULL
- Replace NULL with a fallback value using COALESCE
- Derive a labelled column from conditions with a CASE expression

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. Chen has a NULL city. Predict whether this WHERE condition finds Chen before learning PostgreSQL’s three-valued logic.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: Test missing values, then supply display text

`NULL` means no known value. Ordinary comparisons with NULL produce an unknown result, so use `IS NULL` to find missing values and `IS NOT NULL` to find present ones.

`COALESCE(a, b, c)` returns the first argument that is not NULL. It is useful at the display boundary:

```
SELECT name, COALESCE(nickname, name) AS display_name
FROM members;
```

Here the fallback is another column: a member with no nickname is shown by name. The stored nickname remains NULL; only the query result gets the fallback.

### Where this fits

Decision: A report needs readable text for optional data while the database must preserve “unknown.”

Good fit: Keep NULL in storage, test it with IS NULL, and use COALESCE for a report or API field that needs a fallback.

Choose something else when: Use a real default or NOT NULL constraint when the business meaning is genuinely “this value always exists”; a display fallback should not disguise required missing data.

### Your task

List every student’s student_id, name and a column named `city_label`. Show the stored city when present and `Not recorded` when it is NULL. Sort by student_id.

1. Where to look: The sample rows and student-cities.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- All six students appear with readable city text
- The fallback comes from COALESCE, not a filter that removes rows

### Activity 3 of 4: Label rows with CASE

A searched `CASE` checks conditions in order. It returns the result for the first true `WHEN`; `ELSE` handles everything left.

```
CASE
  WHEN score IS NULL THEN 'Awaiting grade'
  WHEN score >= 70 THEN 'Pass'
  ELSE 'Review'
END AS status
```

No comparison with NULL is true, so a NULL score skips every comparison `WHEN` and would land in `ELSE`; its own `IS NULL` branch before the ELSE gives it a label. CASE derives a column in the result; it does not update the source row.

### Your task

List course_id, title and a derived `fee_band`: `Not priced` when fee is NULL, `Premium` when fee is at least 100, otherwise `Standard`. Sort by course_id.

1. Where to look: The sample rows and course-fees.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Every course receives the required label
- CASE gives the NULL fee its own label instead of letting it fall into ELSE

### Activity 4 of 4: Keep only values that are present

`IS NULL` is true when a value is missing; `IS NOT NULL` is true when it is present. Any ordinary comparison with NULL, including `<> NULL`, is unknown, so WHERE drops that row. `COALESCE` and `CASE` change only the result, never the stored row.

### Your task

Which condition keeps only the students whose city is recorded?

Same idea, new form: Which WHERE condition keeps exactly the priced courses 101, 102, 104 and 105?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the condition that keeps exactly the rows with a recorded value and can explain why the others do not.

## Model

The query

```
SELECT name FROM students WHERE city = NULL;
```

## Recap

- Use IS NULL and IS NOT NULL to test missingness; ordinary comparisons with NULL are unknown.
- COALESCE returns the first non-NULL argument and is useful for display fallbacks.
- CASE checks WHEN conditions in order and returns one derived result.

Next topic: Aggregate functions

## Cheat sheet

A coat-check ticket with no number is not ticket number zero and not an empty numbered ticket; the number is unknown. A clerk may write “not recorded” on a display list without inventing a number.

NULL is the unknown ticket number; COALESCE supplies display text without changing what is stored.

Where to act: The empty line in student-cities.sql.

Next step: In the SELECT list, pass `city` first and the quoted fallback second to COALESCE.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: Name that expression `city_label`, then order by student_id.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in course-fees.sql.

Next step: Give a NULL fee its own `WHEN fee IS NULL` branch; without it, a NULL fee falls through to ELSE and reads Standard.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: After the premium condition, ELSE covers every remaining non-NULL fee; finish with END AS fee_band.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `value IS NULL` | value is missing |
| `value IS NOT NULL` | value is present |
| `COALESCE(value, 'Unknown')` | display fallback |
| `CASE WHEN condition THEN 'A' ELSE 'B' END` | derive a label |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16; the presence checks in activity 4 were rechecked on 2026-10-27, and the CASE and NULL comparison rules on 2026-11-06. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- Comparison predicates
- Logical operators
- CASE and COALESCE

## Static interaction alternatives

### predict

Prediction options: Chen only; Chen and Femi, because both cities are NULL; No rows; An ERROR, because NULL cannot appear in WHERE

### explore

Write a SELECT that uses COALESCE to label missing cities without removing any students.

### explore

Write a SELECT that derives the three fee labels with CASE and sorts by course_id.

### mcq

Apply question: Which condition keeps only the students whose city is recorded? Options: city <> NULL (inequality with NULL is unknown for every row, even Leeds, so WHERE keeps no students.); city IS NOT NULL (the answer: IS NOT NULL is true for the four students with a city and false for Chen and Femi.); city IS NULL (this keeps the opposite rows: Chen and Femi, whose city is missing.); NOT (city = NULL) (city = NULL is unknown, and NOT unknown is still unknown, so WHERE keeps no students.). Retry: Which WHERE condition keeps exactly the priced courses 101, 102, 104 and 105? The answer is fee IS NOT NULL: IS NOT NULL is true for the four courses with a fee and false for course 103.
