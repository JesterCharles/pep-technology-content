# Loading into a staging table with upserts

## Objectives

- Open a psycopg connection from an environment-variable connection string in a with block, then load parsed records into a staging table in batches with executemany or COPY instead of one statement per row
- Write an INSERT ... ON CONFLICT ... DO UPDATE upsert keyed on a unique constraint and predict the table after the same load runs twice
- Explain why the load is made idempotent so a failed or repeated run leaves no duplicate rows

## Teaching

### Load batches inside one transaction

Open the connection from an environment variable in a `with` block: `with psycopg.connect(os.environ["DATABASE_URL"]) as conn:`. A clean exit commits; an exception rolls back.

Inside, avoid one `execute` and commit per row. `cur.executemany(sql, rows)` sends the same statement for many rows. `COPY` through `cur.copy(...)` is the fastest route for plain bulk loading, but it has no conflict handling, so upserts use `executemany`, or COPY into a staging table first.

```
with conn.cursor() as cur:
    cur.executemany(
        "INSERT INTO staging_events (id, kind) VALUES (%s, %s)",
        batch,
    )
```

### ON CONFLICT turns a failure into a decision

`INSERT ... ON CONFLICT (key) DO UPDATE SET ...` inserts a new key and updates an existing one. The key columns must match a unique constraint or primary key. Inside `SET`, `EXCLUDED` is the row you tried to insert. `DO NOTHING` keeps the old row instead.

```
INSERT INTO customers (email, plan)
VALUES (%s, %s)
ON CONFLICT (email)
DO UPDATE SET plan = EXCLUDED.plan;
```

### Idempotent: running it again changes nothing extra

Pipelines get rerun: a job times out, an operator retries, yesterday's file arrives twice. A load is idempotent when any number of repeats leaves the same table as one run.

Two choices together give you that. A unique key with an upsert means a repeated row cannot add a duplicate, and one transaction means a failed run leaves no partial batch to clean up.

## Recap

- Open the connection from an environment variable in a `with` block, and send rows in batches with `executemany` or `COPY`, not one commit per row.
- `INSERT ... ON CONFLICT (key) DO UPDATE SET col = EXCLUDED.col` updates an existing key, and the key must match a unique constraint.
- One transaction plus an upsert makes a load idempotent: a repeat leaves the table unchanged and a failure leaves no partial batch.

## Cheat sheet

Moving house, you can carry one box per trip and lock the door each time, or load the whole van and drive once. If the van breaks down before you arrive, nothing has moved. If you carried boxes, half your belongings are now in the wrong house.

One transaction is the single van trip: all of it arrives or none of it.

Where to act: The Rows left in the table number in the model.

Next step: Set the crash to row 600 and compare the number across the three shapes.

Where to act: The ___ line, directly after VALUES.

Next step: Name the conflict column first, then say which action to take.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The SET list inside your clause.

Next step: Give each non-key column a value from the incoming row, using the name for the row you tried to insert.

Optional time: about 3 minutes

Success criteria: Write on paper how you would add a `loaded_at` column so each upsert records when the row last changed, using only `SET` entries from this page.

```
with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.executemany(sql, rows)

INSERT INTO t (k, v) VALUES (%s, %s)
ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v;

with cur.copy("COPY t (k, v) FROM STDIN") as copy:
    for row in rows:
        copy.write_row(row)
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- PostgreSQL: INSERT and ON CONFLICT
- psycopg 3: Using COPY TO and COPY FROM
- psycopg 3: Cursor classes
- psycopg 3: Transactions management

## Static interaction alternatives

### predict

Prediction: a plain INSERT into a table with a primary key runs twice with the same rows. Decide what the second run does.

### explore

Model over a 1000-row file. Committing per row leaves as many rows as were processed before the crash. executemany and COPY in one transaction leave zero rows after a crash and all 1000 on success.

### mcq

Question: choose the load shape that leaves no partial data after a crash.

### terminal

Coding task: add a conflict clause so a repeated load updates existing rows and adds none.

### mcq

Question: a one-transaction upsert load crashes, then is rerun. Decide the final table state.
