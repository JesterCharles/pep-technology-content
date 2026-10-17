# Subqueries and CTEs

## Objectives

- Use a scalar subquery and an IN or EXISTS subquery inside a query
- Rewrite a nested query as a WITH query (common table expression) with named steps

## Teaching

A shop keeps `orders(id, customer_id, total)` with four rows: order 10 for 40, 11 for 90, 12 for 30 and 13 for 60. A query can contain another query in parentheses. Predict before any explanation.

```
SELECT id, total
FROM orders
WHERE total > (SELECT AVG(total) FROM orders);
```

A scalar subquery must return one column and at most one row; PostgreSQL uses that value, takes no rows as `NULL`, and raises an error for more than one row.

`x IN (subquery)` is true when `x` equals any row the subquery returns; that subquery must return exactly one column. `EXISTS (subquery)` is true when the subquery returns at least one row. An `EXISTS` subquery usually refers to the outer row, so it is evaluated again for each one:

```
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.id);
```

`customers(id, name)` holds 1 ana, 2 ben, 3 cy and 4 dee; orders belong to customers 1, 1, 3 and 2.

A subquery can also stand in `FROM` as a derived table, but nesting soon becomes hard to read. A WITH query, or common table expression (CTE), moves that step to the top and names it, like a temporary table that exists only for this one query:

```
SELECT c.name
FROM (SELECT customer_id, SUM(total) AS spent
      FROM orders GROUP BY customer_id) AS t
JOIN customers c ON c.id = t.customer_id
WHERE t.spent > 50;
```

The rewrite starts with `WITH name AS (…)`, then the main `SELECT` uses that name like a table. Later steps may refer to earlier ones, separated by commas. The query returns ana (130) and ben (60).

Customer 4, dee, has placed no orders. This scalar subquery in the select list is evaluated once for dee's row.

## Model

The model: a subquery is a whole `SELECT` in parentheses that answers a question for the outer query. What it may return depends on where it sits.

## Recap

- A scalar subquery returns one value; no rows gives `NULL`, and more than one row is an error.
- `IN (subquery)` tests membership in a one-column result; `EXISTS (subquery)` tests whether any row comes back, usually checked per outer row.
- A `WITH` query names each step at the top, and the main query uses those names like tables.

Next: Window functions: top N per group

## Cheat sheet

A receptionist checks each visitor against the guest list. For one visitor they only need to know whether the name appears anywhere on the list; they do not care how many times. Asking a colleague for the single guest of honour is different: if the colleague hands back three names, the question was wrong.

Membership and existence checks ask yes-or-no questions about many rows; a single-value question must get exactly one answer.

Where to act: The condition after Condition:, above the three buttons.

Next step: First name the form: is the subquery compared with `=`, used with `IN`, or wrapped in `EXISTS`? Each form has its own rule about rows and columns.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The `WHERE` inside the subquery, if it has one.

Next step: If an `EXISTS` subquery never mentions `c`, its answer is the same for every customer; ask whether the orders table is empty.

Where to act: The first line and the final `WHERE` of each option.

Next step: Check that the named step comes before the main query, and that the main query only uses columns the named step actually outputs.

Optional time: about 5 minutes, in addition to this topic's time.

On your own PostgreSQL database, recreate the four customers and four orders from this page. Write one `WITH` query with two named steps: the first totals each customer's orders, the second keeps only totals above the average of those totals. The main query then lists the names.

Success criteria: the query starts with `WITH`, the second step refers to the first by name, and the result is ana alone, because the per-customer totals are 130, 60 and 30 and their average is about 73.3.

|  |  |
| --- | --- |
| Scalar | `WHERE total > (SELECT AVG(total) FROM orders)` |
| Membership | `WHERE id IN (SELECT customer_id FROM orders)` |
| Existence | `WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)` |
| Named step | `WITH step AS (SELECT …) SELECT … FROM step;` |

## Sources

Claims on this page were checked against the live official PostgreSQL documentation below on 16 October 2026 (UTC). Every query result and error message was confirmed on PostgreSQL 17.5. Links open outside this lesson.

- 4.2.11 Scalar Subqueries: one row and one column; no rows gives null; more than one row is an error.
- 9.24 Subquery Expressions: `EXISTS` and `IN`.
- 7.8.1 SELECT in WITH: common table expressions.
- CREATE VIEW: a stored, reusable query.

## Static interaction alternatives

### predict

Prediction (practice, not scored): orders hold totals 40, 90, 30 and 60, and the query keeps orders whose total is greater than (SELECT AVG(total) FROM orders). Options: orders 11 and 13 (correct: the average is 55, and 90 and 60 are above it); only order 11 (wrong: that compares with the largest total, not the average); all four orders (wrong: the condition still filters each row); an error because the subquery is a query (wrong: a subquery that returns one row and one column can stand where a single value goes).

### drag

Sorting activity. Goal: customers who placed at least one order, from customers 1 ana, 2 ben, 3 cy, 4 dee and orders for customers 1, 1, 3 and 2. id IN (SELECT customer_id FROM orders) returns the intended customers ana, ben and cy. EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) returns the intended customers, because it is checked for each customer. EXISTS (SELECT 1 FROM orders) returns every customer, including dee, because the subquery never refers to the customer and orders is not empty. id = (SELECT customer_id FROM orders) raises ERROR: more than one row returned by a subquery used as an expression. id IN (SELECT customer_id, total FROM orders) raises ERROR: subquery has too many columns.

### mcq

Apply question: rewrite the derived-table query as a WITH query. Correct: WITH spending AS (SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id) SELECT c.name FROM spending s JOIN customers c ON c.id = s.customer_id WHERE s.spent > 50. Wrong: putting the WITH clause after the main SELECT (syntax error at or near WITH); filtering on s.total (ERROR: column s.total does not exist, because the step outputs customer_id and spent); a WITH step with no name and no AS (syntax error). Retry form: biggest order per customer over 50 uses WITH biggest AS (SELECT customer_id, MAX(total) AS top FROM orders GROUP BY customer_id) and then filters b.top > 50, returning ana and ben.

### mcq

Apply question: for customer dee, who has no orders, a scalar subquery (SELECT MAX(total) FROM orders o WHERE o.customer_id = c.id) returns no value, so the row is dee with biggest NULL. Wrong: no rows (the outer query still finds dee); an error (no rows from a scalar subquery is not an error); dee with 0 (MAX of no rows is NULL, not 0). Retry form: (SELECT COUNT(*) ...) returns dee with placed 0, because COUNT over no rows is 0.
