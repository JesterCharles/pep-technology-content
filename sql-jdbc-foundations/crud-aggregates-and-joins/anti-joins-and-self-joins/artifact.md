# Anti-joins and self-joins

## Objectives

- Find rows that have no matching row in another table with LEFT JOIN ... IS NULL or NOT EXISTS
- Join a table to itself with table aliases to relate rows of the same table, such as an employee and their manager
- Explain why NOT IN with a subquery that returns a NULL selects no rows

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. The list below holds some instructor ids and one NULL. Predict this NOT IN result before seeing the NULL trap.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: Find rows with no match

An anti-join returns left-side rows for which no related right-side row exists. One form left-joins, then keeps only rows where the right-side key is NULL:

```
SELECT c.course_id, c.title
FROM courses AS c
LEFT JOIN enrollments AS e
  ON c.course_id = e.course_id
WHERE e.course_id IS NULL;
```

That finds courses nobody has enrolled in. Because `e.course_id` is a non-NULL key in real enrollment rows, NULL here can only mean “no match.” `NOT EXISTS` is another clear form and avoids NOT IN’s NULL behavior.

### Where this fits

Decision: A report asks “which expected rows have nothing related yet?”

Good fit: Use LEFT JOIN ... IS NULL or NOT EXISTS for missing relationships, such as students with no enrollment.

Choose something else when: Use a normal LEFT JOIN without the NULL filter when both matched and unmatched rows belong in the report; an anti-join intentionally keeps only the unmatched ones.

### Your task

List student_id and name for students with no enrollment. Use LEFT JOIN and test the right-side key for NULL. Sort by student_id.

1. Where to look: The sample rows and unenrolled-students.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Only students with no enrollment appear
- The NULL test is on the right-side key after a LEFT JOIN

### Activity 3 of 4: Use two aliases for two roles

A self-join uses the same table twice. Aliases make each occurrence a different role:

```
FROM staff AS worker
LEFT JOIN staff AS boss
  ON worker.boss_id = boss.staff_id
```

The worker row stores boss_id; the boss row supplies that person’s name. LEFT JOIN keeps the top-level person whose boss_id is NULL.

### Your task

List every instructor with their lead’s name, in two result columns named `employee` and `manager`. Keep Mara, whose manager is NULL. Sort by employee.instructor_id.

1. Where to look: The sample rows and reporting-lines.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Every employee appears with the correct manager name or NULL, in columns named employee and manager
- Two aliases give the table its employee and manager roles

### Activity 4 of 4: Avoid the nullable NOT IN trap

`NOT EXISTS` asks directly whether no matching row exists. With `NOT IN`, any NULL returned by the subquery can make a non-match unknown, so WHERE selects nothing.

### Your task

Which pattern safely finds instructors who teach no course, even though courses.instructor_id may be NULL?

Same idea, new form: Which self-join condition connects an employee row to its manager row?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the query that matches the report requirement and can explain why the others do not.

## Model

The query

```
SELECT name FROM instructors WHERE instructor_id NOT IN (2, 3, NULL);
```

## Recap

- An anti-join keeps left-side rows with no right-side match; use LEFT JOIN ... IS NULL or NOT EXISTS.
- NOT IN can select no rows when its subquery returns a NULL, because the result becomes unknown.
- A self-join gives one table two aliases so each occurrence can play a different role.

This is the final topic in this module.

## Cheat sheet

A coordinator compares a roster with a sign-in sheet, then circles every roster name that has no matching signature.

The roster is the left table; the missing signature is the NULL right-side key.

Where to act: The empty line in unenrolled-students.sql.

Next step: Start with students on the left and LEFT JOIN enrollments on student_id.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: After the join, WHERE should test the enrollments alias’s student_id with IS NULL.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in reporting-lines.sql.

Next step: Write instructors twice, first AS employee and then AS manager in a LEFT JOIN.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: Compare employee.lead_id with manager.instructor_id, then select one name from each alias and name the result columns employee and manager with AS.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `LEFT JOIN ... WHERE right.key IS NULL` | unmatched left rows |
| `WHERE NOT EXISTS (correlated subquery)` | NULL-safe missing-match test |
| `table AS employee ... table AS manager` | two roles for one table |
| `employee.lead_id = manager.id` | self-referencing relationship |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- Joined tables and aliases
- EXISTS and NOT IN
- Self and outer joins

## Static interaction alternatives

### predict

Prediction options: Mara and Ken; Mara only; No rows; An ERROR because NULL is in the list

### explore

Write a left anti-join that finds students with no enrollment.

### explore

Write a self left join from employee.lead_id to manager.instructor_id.

### mcq

Apply question: Which pattern safely finds instructors who teach no course, even though courses.instructor_id may be NULL? Options: WHERE i.instructor_id NOT IN (SELECT instructor_id FROM courses) (the subquery includes NULL, so NOT IN can evaluate to unknown for every non-matching instructor.); WHERE NOT EXISTS (SELECT 1 FROM courses c WHERE c.instructor_id = i.instructor_id) (the answer: the correlated subquery tests a real match, and NOT EXISTS keeps the instructor when none exists.); WHERE i.instructor_id <> (SELECT instructor_id FROM courses) (a multi-row scalar comparison is not the anti-join needed here.); WHERE c.instructor_id = NULL (ordinary equality does not test NULL, and c is not introduced in this condition.). Retry: Which self-join condition connects an employee row to its manager row? The answer is employee.lead_id = manager.instructor_id: the employee stores the referenced manager id in lead_id.
