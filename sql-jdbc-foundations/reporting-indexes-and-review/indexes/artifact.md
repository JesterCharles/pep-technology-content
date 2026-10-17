# Indexes

## Objectives

- Explain how an index speeds up a lookup and what it costs on writes and storage
- Create a B-tree index, including a multicolumn index, that matches a described query
- Identify the indexes PostgreSQL creates automatically for PRIMARY KEY and UNIQUE constraints

## Teaching

A `users` table holds a million rows. Its `email` column has no index and no constraint. Predict before any explanation.

```
SELECT * FROM users WHERE email = 'ana@example.com';
```

```
CREATE INDEX users_email_idx ON users (email);
```

The planner then uses the index when it judges that cheaper than a sequential scan. The cost: PostgreSQL keeps every index synchronized with its table, so each `INSERT`, `UPDATE` and `DELETE` does extra work, and each index takes disk space. Remove indexes no query uses.

A multicolumn index lists several columns. It is most efficient when the query constrains the leading, leftmost columns: equality tests on leading columns, plus a range test on the first column without an equality test, limit how much of the index is read.

Declaring a `PRIMARY KEY` or a `UNIQUE` constraint makes PostgreSQL create a unique B-tree index on those columns, which it uses to enforce the constraint. Declaring a `FOREIGN KEY` does not create an index on the referencing columns; add one yourself when deletes on the referenced table or joins need it. `NOT NULL` and `CHECK` create no index.

A `sensor_readings` table receives thousands of new rows every minute and is queried once a night. Someone has added eight indexes to it, "to be safe".

## Model

The model: an index is a separate, sorted lookup structure that points to table rows, like the index at the back of a book. The default kind is a B-tree, which handles `=`, `<`, `>`, `BETWEEN` and sorting.

## Recap

- Without an index, PostgreSQL must read every row; a B-tree index lets it find matching rows directly.
- Every index is kept in step with its table, so it slows `INSERT`, `UPDATE` and `DELETE` and takes disk space.
- In a multicolumn index, put equality-tested columns first and the range-tested column after them.
- `PRIMARY KEY` and `UNIQUE` create a unique B-tree index automatically; a foreign key does not.

Next: Reading: Query plans with EXPLAIN

## Cheat sheet

A phone book is sorted by surname, then first name. Finding every Garcia whose first name starts with M is quick: open at Garcia, then read only that run. Finding everyone named Maria is slow, because the Marias are scattered across every surname. And every new listing must be slotted into its place before the book is reprinted.

A sorted lookup helps most when your search fixes its first sort key, and keeping it sorted costs work on every change.

Where to act: The parentheses after `ON orders` in your statement, where the column list goes.

Next step: Sort the query's two conditions into an equality test and a range test; an index on only one of them leaves the other to be checked row by row.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The order of the columns inside those parentheses.

Next step: Apply the leading-column rule from the teaching: which kind of test should the first column carry so the range test can still narrow the read?

Optional time: about 5 minutes, in addition to this topic's time.

On your own PostgreSQL database, create a small table with a `PRIMARY KEY`, a `UNIQUE` column and a column that references another table. In `psql`, run `\d` followed by the table name and read the Indexes: section of its description.

Success criteria: you can point to the index behind the primary key and the one behind the unique constraint, and you can say why the referencing column has none until you create it.

|  |  |
| --- | --- |
| One column | `CREATE INDEX users_email_idx ON users (email);` |
| Several columns | `CREATE INDEX name ON table (equality_col, range_col);` |
| Automatic | `PRIMARY KEY`, `UNIQUE` |
| Remove | `DROP INDEX name;` |

## Sources

Claims on this page were checked against the live official PostgreSQL documentation below on 16 October 2026 (UTC). Default index names were confirmed on PostgreSQL 17.5. Links open outside this lesson.

- 11.1 Introduction: without an index the whole table is scanned; indexes add overhead to data manipulation and unused ones should be removed.
- 11.2.1 B-Tree: the default index type and the operators it supports.
- 11.3 Multicolumn Indexes: the leading-column rule.
- CREATE INDEX: synopsis, optional name and default name.
- 5.5 Constraints: unique and primary-key constraints create a unique B-tree index; a foreign key does not create one.

## Static interaction alternatives

### predict

Prediction (practice, not scored): finding one email in a million-row users table with no index on email. Options: it reads the table row by row and checks every email (correct: with no index, a sequential scan is the only way to find every match); it jumps straight to the row because the table is sorted by email (wrong: a table has no order PostgreSQL can rely on); it stops at the first match (wrong: another row could have the same email, because nothing makes it unique); it refuses to run without an index (wrong: an index is never required to run a query).

### explore

SQL practice editor for one CREATE INDEX statement on orders(id PRIMARY KEY, customer_id, created_at, status, total), for the query WHERE customer_id = 42 AND created_at >= '2026-01-01'. Run reports CREATE INDEX, PostgreSQL's default index name when none is given (table, columns, then idx, joined by underscores), and an analysis of each indexed column from the left: an equality-tested leading column and the range-tested column after it both narrow the part of the index read; a leading range-tested column narrows the read, but the equality test on a later column is then only checked inside that range; an index on only one of the two columns leaves the other condition to be checked on table rows; a first column the query does not test makes the index a poor fit. An unknown table gives ERROR: relation does not exist, and an unknown column gives ERROR: column does not exist.

### drag

Sorting activity. id integer PRIMARY KEY: index created automatically (a unique B-tree index). email text UNIQUE: index created automatically (a unique B-tree index). customer_id integer REFERENCES customers (id): no index created automatically on the referencing column. name text NOT NULL: no index. total numeric CHECK (total >= 0): no index.

### mcq

Apply question: a table with frequent inserts, rare reads and eight indexes. True: every INSERT must also add an entry to each of the eight indexes, which slows writes and uses disk space. Wrong: indexes make inserts faster (they add work); unused indexes cost nothing (they are still maintained and stored); PostgreSQL drops unused indexes on its own (it never does). Retry form: keep an index on sensor_id, which the report filters, and drop the index on note, which no query uses.
