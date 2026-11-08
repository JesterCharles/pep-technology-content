# ELT: transforming in SQL after loading

## Objectives

- Distinguish ETL from ELT and explain why this pipeline loads raw rows first and transforms them inside PostgreSQL
- Write an INSERT ... SELECT or CREATE TABLE AS statement with a common table expression that cleans and reshapes staging rows into a target table
- Run the SQL transform from Python inside one transaction so that a failure leaves the target table unchanged

## Teaching

### ETL and ELT differ in where the transform runs

ETL transforms in your program, then loads the finished rows. ELT loads raw rows first, then transforms them inside the database with SQL.

This pipeline uses ELT. Raw rows sit in staging, so when transform logic turns out to be wrong you fix the SQL and rerun without fetching the source again. Set-based SQL also runs next to the data, and the database enforces types and constraints on the result.

### A CTE names each cleaning step

`WITH name AS (SELECT ...)` names a temporary result that the next statement can read, and `INSERT INTO target SELECT ... FROM name` writes it. Staging columns are usually text, so cast them with `::int` and tidy text with `lower(trim(x))`.

```
WITH cleaned AS (
    SELECT id, lower(trim(city)) AS city
    FROM staging_users
    WHERE city IS NOT NULL
)
INSERT INTO users_clean (id, city)
SELECT id, city FROM cleaned;
```

### Run the whole transform as one transaction

A rebuild often has two steps: clear the target, then fill it. Run them in one `with psycopg.connect(...)` block so readers never see a half-built table. A failure rolls back both steps, leaving the old rows in place.

In autocommit mode each statement commits by itself, so a failure in step two leaves the target already empty.

```
with psycopg.connect(conninfo) as conn:
    conn.execute("DELETE FROM orders_clean")
    conn.execute(TRANSFORM_SQL)
```

## Recap

- ETL transforms before loading; ELT loads raw rows and transforms inside the database.
- Keeping raw rows in staging lets you fix a transform and replay it without going back to the source.
- `WITH name AS (SELECT ...)` plus `INSERT ... SELECT` cleans and reshapes in one statement. Cast staging text before comparing it.
- Run the transform in one transaction, so a failure leaves the target table unchanged.

## Cheat sheet

Where to act: The Must rerun line in the model.

Next step: Press Find a transform bug under each style and compare how far back each must go.

Where to act: The ___ line inside the WITH parentheses.

Next step: Write the columns first, then FROM, then the filter, following the staging_users example.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The filter on your SELECT.

Next step: Compare the row with qty 0 against your filter: staging values are text, so cast before you compare.

Where to act: The two checkboxes above the Run transform button.

Next step: Turn on Step 2 fails first, then run once with Autocommit off and once with it on.

Optional time: about 2 minutes

Success criteria: Describe in two sentences how `CREATE TABLE AS` could build a new table for the same transform, and what you would still have to do to swap it in safely.

```
WITH cleaned AS (
    SELECT id, upper(trim(code)) AS code, age::int AS age
    FROM staging_people
    WHERE age::int >= 18
)
INSERT INTO people (id, code, age)
SELECT id, code, age FROM cleaned;

CREATE TABLE report AS SELECT ...;   -- builds a new table
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- PostgreSQL: WITH queries (common table expressions)
- PostgreSQL: CREATE TABLE AS
- PostgreSQL: INSERT
- psycopg 3: Transactions management

## Static interaction alternatives

### predict

Prediction: Python executes an INSERT ... SELECT over a large staging table. Decide how many rows travel to Python.

### explore

Model: under ETL, a transform bug means extracting from the source again because only transformed rows were kept. Under ELT, raw rows stay in staging, so fixing a transform bug means rerunning only the SQL.

### mcq

Question: choose the main gain of keeping raw rows in a staging table.

### terminal

Coding task: write a common table expression that cleans staging rows and inserts them into a target table.

### explore

Model: orders_clean starts with 3 rows and the rebuild produces 5. With one transaction and a failing step 2, 3 rows remain. With autocommit and a failing step 2, 0 rows remain. Without failure, 5 rows remain in either case.

### mcq

Question: a delete then insert transform fails inside one transaction. Decide what readers see.
