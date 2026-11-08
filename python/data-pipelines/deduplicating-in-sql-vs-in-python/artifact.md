# Deduplicating: in SQL vs in Python

## Objectives

- Remove duplicates in Python with a set or a dict keyed on a chosen natural key, keeping either the first or the latest record
- Remove duplicates in SQL with DISTINCT ON or ROW\_NUMBER() over a partition
- Choose where to deduplicate, in Python before loading or in SQL after loading, for a described data size and pipeline step, and justify the choice

## Teaching

### Choose a natural key, then choose who wins

A natural key is what makes two records the same real thing, such as an order number. With a `set` of seen keys you keep the first row. With a dict you overwrite, keeping the last.

Last in the file is not the same as latest in time. To keep the latest, compare a timestamp, because rows can arrive out of order.

```
seen, kept = set(), []
for r in rows:
    if r["id"] not in seen:
        seen.add(r["id"])
        kept.append(r)
```

### DISTINCT ON and ROW_NUMBER

`DISTINCT ON (key)` keeps the first row per key, and `ORDER BY` decides which is first, so it must start with the same key. It is PostgreSQL-specific and short. `ROW_NUMBER() OVER (PARTITION BY key ORDER BY ...)` numbers rows within each key; you then keep number 1, and it also works in other databases.

```
SELECT DISTINCT ON (device_id) device_id, reading, seen_at
FROM staging_readings
ORDER BY device_id, seen_at DESC;
```

### Where the work belongs

Python before loading suits small data, or duplicates that need Python logic, but the seen keys must fit in memory and it only sees this batch. SQL after loading sees everything already in the table and handles more data than memory, at the cost of loading duplicates into staging first.

A unique constraint plus an upsert is a third guard: it stops duplicates reaching the target whichever you choose.

## Recap

- Pick a natural key first. A `set` of seen keys keeps the first row; a dict that overwrites keeps the last.
- To keep the latest, compare a timestamp, because file order is not time order.
- `DISTINCT ON (key)` with `ORDER BY key, time DESC` or `ROW_NUMBER() OVER (PARTITION BY ...)` filtered to 1 keeps one row per key in SQL.
- Use Python for small batches and Python-only keys. Use SQL for large data and duplicates across batches.

## Cheat sheet

A club secretary gets several membership forms from one person. Keeping whichever form sits on top of the pile is quick, but the pile was shuffled in the post. Only the date written on each form tells you which is really newest.

Position in the pile can differ from the true date, so compare the date.

Where to act: The Surviving row for id 1 line in the model.

Next step: Choose one strategy, then shuffle several times and see whether the survivor changes.

Where to act: The ORDER BY of your query.

Next step: List the key first, then the column that decides which row counts as first.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The sort direction on your time column.

Next step: Ask whether the row you want should sort first or last within its key, then choose the direction.

Optional time: about 3 minutes

Success criteria: Write the same result with whichever form you did not use, `DISTINCT ON` or `ROW_NUMBER`, and explain in one sentence when you would prefer it.

```
-- PostgreSQL only
SELECT DISTINCT ON (k) k, v, ts FROM t ORDER BY k, ts DESC;

-- Portable
SELECT k, v, ts FROM (
  SELECT k, v, ts,
         ROW_NUMBER() OVER (PARTITION BY k ORDER BY ts DESC) AS rn
  FROM t
) ranked WHERE rn = 1;
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- PostgreSQL: SELECT (DISTINCT ON)
- PostgreSQL: Window functions
- PostgreSQL tutorial: Window functions
- Python tutorial: Data structures

## Static interaction alternatives

### predict

Prediction: a dict comprehension keyed on id runs over three rows where one id repeats. Decide which row survives.

### explore

Model with three rows for one id, updated at 09:00, 10:00 and 11:00. Keeping the first or keeping the last gives a different survivor when the arrival order changes. Comparing updated_at always keeps the 11:00 row.

### mcq

Question: choose the reliable way to keep the latest row per key when arrival order varies.

### terminal

Coding task: write a query that keeps the most recently updated row per customer.

### mcq

Question: given file size, memory and duplicates across days, choose where to deduplicate.
