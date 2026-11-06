# Inner and left joins

## Objectives

- Combine rows from two tables with INNER JOIN ... ON a key relationship
- Use LEFT JOIN to keep rows that have no match, and predict where NULLs appear in the result
- Choose INNER JOIN or LEFT JOIN for a described report

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. Mara has no course row. Predict whether an inner join includes her before seeing the join model.

### Your task

1. Where to look: The query below.
2. What to do: Choose one prediction.
3. What to expect: Pick confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option; a wrong guess is fine.

### What success looks like

You made a prediction and read why each option is right or wrong.

### Activity 2 of 4: Match rows on related keys

An inner join combines rows only when its `ON` condition is true. Join a foreign key to the key it references:

```
SELECT c.title, i.name
FROM courses AS c
INNER JOIN instructors AS i
  ON c.instructor_id = i.instructor_id;
```

Aliases keep qualified column names short and remove ambiguity. One instructor can match several course rows, so that instructor appears once per match; Web Basics, with no instructor, is absent.

### Where this fits

Decision: A report needs columns stored in related tables.

Good fit: Use INNER JOIN when unmatched rows should be absent; use LEFT JOIN when every row from the left table must remain visible.

Choose something else when: Use separate queries when the records are unrelated; joining on similar-looking text such as names can create accidental matches. Prefer declared key relationships.

### Your task

List each enrolled student name with course_id. Join students to enrollments on student_id. Show `name` and `course_id`; sort by name, then course_id.

1. Where to look: The sample rows and enrolled-students.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Every enrollment is paired with the correct student name
- ON compares the related student_id columns

### Activity 3 of 4: Keep every left-side row

A left join starts with every row from the table on the left. Matching right rows are combined as usual. When no right row matches, right-side result columns become NULL.

```
SELECT s.name, e.course_id
FROM students AS s
LEFT JOIN enrollments AS e
  ON s.student_id = e.student_id;
```

Femi remains because students is on the left, with a NULL course_id. Ana appears twice because two enrollment rows match Ana.

### Your task

Show every instructor with any course they teach. Select `i.name AS instructor` and `c.title AS course`; keep instructors with no course. Sort by instructor_id, then course_id.

1. Where to look: The sample rows and instructor-courses.sql editor below.
2. What to type: Write one SELECT on the empty line under the comment.
3. What to expect: Press Run; Output shows the result rows or an honest lesson limit.
4. How to know it's done: Every local check below reads done. Two counted runs settle the activity without penalty.

### What success looks like

- Every instructor remains, and each matching course appears
- The unmatched instructor has a NULL course

### Activity 4 of 4: Choose whether unmatched rows belong

The question decides the join type. “Only customers with orders” points to INNER JOIN. “Every customer, even with no order” points to LEFT JOIN with customers on the left.

### Your task

A staffing report must list every instructor, including instructors assigned to no course. Which join fits?

Same idea, new form: A report should include only students who have at least one enrollment. Which join fits?

1. Where to look: The four options.
2. What to do: Choose one and report confidence.
3. What to expect: Every option is explained; one wrong answer gets one retry.
4. How to know it's done: Feedback appears and the recap opens.

### What success looks like

You choose the query that matches the report requirement and can explain why the others do not.

## Model

The query

```
SELECT i.name, c.title FROM instructors i INNER JOIN courses c ON i.instructor_id = c.instructor_id;
```

## Recap

- INNER JOIN returns matching row combinations only.
- LEFT JOIN keeps every left-side row and fills unmatched right-side columns with NULL.
- Join related key columns in ON, qualify ambiguous names, and choose the left table from the report requirement.

Next topic: Anti-joins and self-joins

## Cheat sheet

At event check-in, staff pair each registration card with the attendee badge carrying the same registration number. Cards with no matching badge stay out of the matched stack.

INNER JOIN is the matched stack; ON states which numbers must agree.

Where to act: The empty line in enrolled-students.sql.

Next step: Start FROM students with an alias, then INNER JOIN enrollments with a second alias.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The unfinished clause or expression in your query.

Next step: The ON condition compares student_id from the two aliases; qualify the selected and sorted columns too.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

Where to act: The empty line in instructor-courses.sql.

Next step: Put instructors on the left of LEFT JOIN and courses on the right.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The unfinished clause or expression in your query.

Next step: Join instructor_id to instructor_id; the unmatched right-side title then appears as NULL.

- Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.
- Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.
- Anything else is a Lesson check, not a claim that your SQL is invalid. Text sorting in a real server follows its collation.
- Run is deterministic and bounded: no network, no files and no real database.

|  |  |
| --- | --- |
| `a INNER JOIN b ON ...` | matched rows only |
| `a LEFT JOIN b ON ...` | every a row; unmatched b columns are NULL |
| `s.student_id = e.student_id` | join a referenced key relationship |
| `table AS alias` | short, unambiguous qualification |

## Sources

Checked against current official PostgreSQL documentation on 2026-10-16. The bounded editor runs only the documented subset named on this page; unsupported SQL is labelled as a lesson limit, not rejected as invalid PostgreSQL.

- Joined Tables
- Joins Between Tables

## Static interaction alternatives

### predict

Prediction options: Mara appears once with a NULL title; Mara appears once with every course; Mara does not appear; The query fails because Mara has no match

### explore

Write an inner join from students to enrollments on student_id and sort by name and course_id.

### explore

Write a left join that keeps all instructors and shows matching course titles.

### mcq

Apply question: A staffing report must list every instructor, including instructors assigned to no course. Which join fits? Options: courses INNER JOIN instructors (the left table is courses and inner join still removes instructors without a match.); instructors INNER JOIN courses (inner join removes instructors without a matching course.); instructors LEFT JOIN courses (the answer: every instructor starts on the left and is kept; missing course columns become NULL.); courses LEFT JOIN instructors (this keeps every course, not every instructor.). Retry: A report should include only students who have at least one enrollment. Which join fits? The answer is students INNER JOIN enrollments: inner join returns only matching student/enrollment pairs.
