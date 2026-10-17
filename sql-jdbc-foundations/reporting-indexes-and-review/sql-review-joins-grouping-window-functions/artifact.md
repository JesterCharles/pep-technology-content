# Review: Joins, grouping and window functions

## Objectives

- Retrieve which join keeps unmatched rows and where NULLs appear
- Choose between WHERE, GROUP BY with HAVING, and a window function for a described report
- Predict the rows a query that combines a join, grouping and a window function returns

## Teaching

Answer from memory first. `departments(id, name)` holds 1 sales, 2 support and 3 legal. `employees(name, dept_id, salary)` holds ana (1, 50), ben (1, 40), cy (2, 45) and dee, who has no department yet (`NULL`, 30).

```
SELECT d.name AS department, e.name AS employee
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id;
```

So a condition on one row belongs in `WHERE`; a condition on a group's total or count belongs in `HAVING` after `GROUP BY`; and a report that keeps every row but shows a group value, rank or running total beside it needs a window function.

Follow the stages for the same two tables. `COUNT(e.id)` counts only non-null values; `COUNT(*)` counts rows. The window function ranks the groups after grouping.

## Model

The model: a query works in stages. `FROM` and joins build the rows, `WHERE` removes single rows, `GROUP BY` folds rows into groups and `HAVING` removes groups; window functions then add a value to each surviving row without folding anything.

## Recap

- An inner `JOIN` keeps matched rows only; a `LEFT JOIN` keeps every left row and puts `NULL` in the right side's columns when nothing matches.
- `WHERE` filters rows, `HAVING` filters groups after `GROUP BY`, and a window function adds a group value or rank to every row.
- `COUNT(column)` skips `NULL`; `COUNT(*)` counts rows, including a `LEFT JOIN`'s unmatched row.

Next: Review: JDBC

## Cheat sheet

Where to act: The report described after Report:.

Next step: Ask two questions: does the result have one row per employee or one row per department, and is the condition about one row or about a whole group?

Where to act: The join line, then the `COUNT` inside the query.

Next step: Write down the joined rows first, including legal's row from the `LEFT JOIN`; then count what the `COUNT` counts in each department before ranking.

Optional time: about 5 minutes, in addition to this topic's time.

On your own PostgreSQL database, create the two tables from this page. Write one query that lists every employee, including dee, with their department name and the highest salary in that department beside them.

Success criteria: the result has 4 rows; ana and ben show sales and 50, cy shows support and 45, and dee shows `NULL` for the department and 30 as the highest salary in that group.

|  |  |
| --- | --- |
| Keep unmatched left rows | `FROM a LEFT JOIN b ON …` |
| Filter rows | `WHERE salary > 40` |
| Filter groups | `GROUP BY dept_id HAVING COUNT(*) >= 2` |
| Group value on every row | `AVG(salary) OVER (PARTITION BY dept_id)` |

## Sources

Claims on this page were checked against the live official PostgreSQL documentation below on 16 October 2026 (UTC). Every query result was confirmed on PostgreSQL 17.5. Links open outside this lesson.

- 2.6 Joins Between Tables: inner and left outer joins.
- 7.2 Table Expressions: joined tables, `WHERE`, `GROUP BY` and `HAVING`, and window function processing.
- 3.5 Window Functions.
- 9.21 Aggregate Functions: `count(*)` and `count(value)` for non-null inputs.

## Static interaction alternatives

### predict

Retrieval prediction (practice, not scored): departments LEFT JOIN employees. Options: 4 rows, with legal paired with NULL (correct: a LEFT JOIN keeps every row of the left table and fills the right side with NULL when nothing matches); 3 rows without legal (wrong: that is an inner join); 4 rows, with dee paired with a NULL department (wrong: that is employees LEFT JOIN departments); 5 rows with both legal and dee (wrong: that would need a FULL JOIN).

### drag

Sorting activity. Employees earning more than 40: WHERE, a condition on single rows. Only the employees of the sales department: WHERE. Departments whose salaries add up to more than 80: GROUP BY with HAVING, a condition on a group total. Departments with at least two employees: GROUP BY with HAVING. Every employee with their department's average salary beside them: a window function, because every row stays. Each employee's salary rank within their department: a window function.

### mcq

Apply question: departments LEFT JOIN employees, grouped by department name, with COUNT(e.id) AS staff and RANK() OVER (ORDER BY COUNT(e.id) DESC) AS place, ordered by place. Result: sales 2 1; support 1 2; legal 0 3. Wrong: only sales and support (legal is kept by the LEFT JOIN); legal with 1 (COUNT(e.id) skips the NULL employee); dee in a NULL department (the join starts from departments). Retry form: with COUNT(*) the result is sales 2 1; legal 1 2; support 1 2, because legal's NULL row is counted and ties share rank 2.
