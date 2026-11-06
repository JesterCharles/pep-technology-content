# Reading: Query plans with EXPLAIN

## Objectives

- Read an EXPLAIN plan to tell a sequential scan from an index scan
- Explain how EXPLAIN differs from EXPLAIN ANALYZE, including that EXPLAIN ANALYZE actually executes the statement

## Teaching

`EXPLAIN` placed before a statement asks PostgreSQL how it would carry that statement out. A table `sessions` has 500 rows whose `expired` column is true. Predict before any explanation.

```
EXPLAIN DELETE FROM sessions WHERE expired;
```

These plans come from the PostgreSQL manual's sample table `tenk1`, 10,000 rows with an index `tenk1_unique1`:

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 7000;
 Seq Scan on tenk1  (cost=0.00..470.00 rows=7000 width=244)
   Filter: (unique1 < 7000)

EXPLAIN SELECT * FROM tenk1 WHERE unique1 = 42;
 Index Scan using tenk1_unique1 on tenk1  (cost=0.29..8.30 rows=1 width=244)
   Index Cond: (unique1 = 42)
```

A Seq Scan reads every row and tests a `Filter` on each. An Index Scan using an index looks up matching entries first, shown as `Index Cond`. A Bitmap Index Scan under a Bitmap Heap Scan also uses an index, then fetches the rows in table order. The `cost` numbers are estimates in arbitrary units, and `rows` is an estimate too.

`EXPLAIN ANALYZE` actually executes the statement, then prints the plan with measured times and actual row counts beside the estimates. Its output is discarded for a `SELECT`, but the side effects of an `INSERT`, `UPDATE` or `DELETE` happen as usual. To measure a change without keeping it, roll it back:

```
BEGIN;
EXPLAIN ANALYZE UPDATE tenk1 SET hundred = hundred + 1 WHERE unique1 < 100;
ROLLBACK;
```

## Model

The model: a plan is a tree of nodes, printed one node per line, with child nodes indented under an arrow. The bottom nodes read a table; the first word of each says how.

## Recap

- `EXPLAIN` shows the planned tree of nodes with estimated costs and rows, without running the statement.
- `Seq Scan` reads every row; `Index Scan`, `Index Only Scan` and `Bitmap Index Scan` use an index.
- `EXPLAIN ANALYZE` runs the statement and adds actual times and row counts; wrap data changes in `BEGIN` and `ROLLBACK`.

Next: Project: JDBC data access

## Cheat sheet

Where to act: The words before `on` in the plan line after Plan line:.

Next step: Look for the word `Index` or the name of an index; a node without either reads the table itself, row by row.

|  |  |
| --- | --- |
| Plan only | `EXPLAIN SELECT …;` |
| Run and measure | `EXPLAIN ANALYZE SELECT …;` |
| Measure a change safely | `BEGIN; EXPLAIN ANALYZE UPDATE …; ROLLBACK;` |
| Reads every row | `Seq Scan on table` |
| Uses an index | `Index Scan using index on table` |

## Sources

Claims on this page were checked against the live official PostgreSQL documentation below on 16 October 2026 (UTC). The plan lines are quoted from the manual's examples. Links open outside this lesson.

- 14.1 Using EXPLAIN: 14.1.1 EXPLAIN Basics and 14.1.2 EXPLAIN ANALYZE, including the `BEGIN` and `ROLLBACK` example.
- EXPLAIN: the statement is actually executed when `ANALYZE` is used.

## Static interaction alternatives

### predict

Prediction (practice, not scored): EXPLAIN DELETE FROM sessions WHERE expired, on a table with 500 expired rows. Options: the rows stay, and PostgreSQL shows its plan (correct: plain EXPLAIN only plans the statement); the 500 rows are deleted and the plan is shown (wrong: that is what EXPLAIN ANALYZE does); the rows are deleted and nothing is shown (wrong); PostgreSQL refuses to explain a DELETE (wrong: EXPLAIN accepts DELETE).

### drag

Sorting activity on plan lines from the PostgreSQL manual. Seq Scan on tenk1 reads every row of the table. Index Scan using tenk1_unique1 on tenk1 uses an index. Bitmap Index Scan on tenk1_unique1 uses an index. Seq Scan on tenk1 with Filter: (unique1 < 7000) reads every row; the filter is tested on each one. Index Only Scan using onek_unique1 on onek uses an index and can answer from the index alone.

### mcq

Apply question: EXPLAIN ANALYZE DELETE FROM sessions WHERE expired, run with auto-commit on. True: the expired rows are deleted, and the plan shows actual times and row counts. Wrong: the rows remain because EXPLAIN only plans (that is plain EXPLAIN); the rows are deleted but only estimates are shown (ANALYZE adds measured values); PostgreSQL asks for confirmation first (it does not). Retry form: inside BEGIN and ROLLBACK, the delete runs and is measured, then the rollback undoes it, so the rows remain.
