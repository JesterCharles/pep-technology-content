# Connecting to Postgres from Python with psycopg

## Objectives

- Connect to a learner-local PostgreSQL database with psycopg.connect, reading the connection string from an environment variable instead of hard-coding it
- Run a parameterized query with %s placeholders and fetch its rows, and explain why formatting values into the SQL string invites SQL injection
- Manage the connection and transaction with with blocks, predicting when psycopg commits and when it rolls back

## Teaching

### Connect, then keep values out of the SQL text

Read the connection string from the environment, so it stays out of your source and differs per machine: `os.environ["DATABASE_URL"]`. Pass it to `psycopg.connect`.

Then run a query with `%s` placeholders and a separate sequence of values. psycopg keeps values apart from the SQL text, so a value is never parsed as SQL. Use `%s` for every type, never put quotes around it, and pass a tuple even for one value: `(name,)`.

```
conninfo = os.environ["DATABASE_URL"]
with psycopg.connect(conninfo) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE city = %s", (city,))
        rows = cur.fetchall()
```

### The three parts of a safe lookup

A lookup needs three things: a connection string from the environment, a `with` block around the connection, and `execute` with `%s` plus a tuple of values. Then `fetchall()` returns a list of row tuples.

The example in the last activity looks up users by city. Your task uses orders by customer. Keep the shape and change the query.

### A connection block is a transaction

A transaction starts with the first statement. Leaving `with psycopg.connect(...) as conn:` normally commits. Leaving it because of an exception rolls back, and the exception keeps propagating. Either way the connection closes.

Without a `with` block you must call `conn.commit()` yourself. If you close the connection without committing, the work is lost. The cursor block only closes the cursor; it does not commit.

## Recap

- Read the connection string from an environment variable; never hard-code credentials.
- Pass values separately with `%s` and a tuple. Formatting values into SQL invites injection, because a value becomes part of the statement.
- Leaving `with psycopg.connect(...)` commits on a clean exit, rolls back on an exception, and closes the connection.
- A cursor block closes the cursor only. Without a connection block you must call `commit()` yourself.

## Cheat sheet

A bank teller reads a form with a printed box for the amount. Whatever you write in that box is treated as an amount, even if you write an instruction to empty the vault. A handwritten letter that mixes requests and details leaves the teller guessing which is which.

Separate values are the printed box; a formatted string is the handwritten letter.

Where to act: The SQL text box in the model.

Next step: Look for the customer text inside the SQL text, then switch modes and look again.

Where to act: The ___ line in find_orders.

Next step: Copy the structure of the users-by-city example from Activity 2, then change the SQL.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The execute call.

Next step: Check that the value arrives as a second argument, and that it is a tuple even though there is only one value.

Optional time: about 2 minutes

Success criteria: State which rows remain if the two inserts below run in separate `with psycopg.connect(...)` blocks and only the second block raises.

```
conninfo = os.environ["DATABASE_URL"]
with psycopg.connect(conninfo) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM t WHERE a = %s AND b = %s", (a, b))
        rows = cur.fetchall()
# clean exit: COMMIT, then close. exception: ROLLBACK, then close.
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- psycopg 3: Basic module usage
- psycopg 3: Passing parameters to SQL queries
- psycopg 3: Transactions management
- PostgreSQL: libpq connection strings

## Static interaction alternatives

### predict

Prediction: a user-supplied value containing a quote is formatted into a SQL string. Decide what the database receives.

### explore

Model: with an f-string, the customer text is merged into the SQL text and values sent is empty. With a %s placeholder, the SQL text stays fixed and the customer text travels separately as a value.

### mcq

Question: explain why passing values separately stops user text from changing a statement.

### terminal

Coding task: write a function that connects using an environment variable and runs a parameterized SELECT.

### mcq

Question: two inserts run inside a connection block, then an exception is raised. Decide how many rows remain.
