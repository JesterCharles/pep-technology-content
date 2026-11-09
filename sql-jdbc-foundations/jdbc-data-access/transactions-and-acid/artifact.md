# Transactions and ACID

## Objectives

- Describe atomicity, consistency, isolation and durability by what you can observe in the database
- Turn auto-commit off and end a multi-statement change with commit, or with rollback when any statement fails
- Predict what another session sees before and after a transaction commits or rolls back

## Teaching

### Start with a guess

The table is `accounts(id, owner, balance)` with `CHECK (balance >= 0)`. A moves 150 to B: the code adds 150 to B, then takes 150 from A. Practice prediction, not scored.

### All or nothing

A transaction bundles several statements into one all-or-nothing change. A new JDBC connection is in auto-commit mode: each statement is committed the moment it finishes, so a failure halfway leaves the first half saved.

| ACID | What you observe |
| --- | --- |
| Atomicity | Every statement in the transaction is kept, or none is. |
| Consistency | Constraints such as the `CHECK` still hold after each commit. |
| Isolation | Other sessions do not see your changes until you commit. PostgreSQL's default, Read Committed, shows each statement only data committed before it began. |
| Durability | Once `commit()` returns, the change survives a crash. |

### Commit or roll back in JDBC

```
conn.setAutoCommit(false);
try (...) {
    first.executeUpdate();
    second.executeUpdate();
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
}
```

Turn auto-commit off before the first statement. Commit only after the last one succeeds. If any statement throws, `rollback()` undoes everything since the transaction began, and rethrowing tells the caller the change failed.

### Apply it: name the property

Match what you observe to the ACID letter it shows.

## Model

accounts table and two sessions (simulated: no Java or database runs here)

### Committed balances

A 100 · B 20

### Session 2 reads

Not read yet.

```
No scenario run yet.
```

## Recap

- Auto-commit saves each statement on its own; a transaction keeps all of its statements or none.
- `setAutoCommit(false)` first, `commit()` after the last statement, `rollback()` in the `catch`, then rethrow.
- Other sessions see the old values until you commit, and see the new values after.

Next topic: Swapping the in-memory repository for a JDBC one

## Cheat sheet

|  |  |
| --- | --- |
| Letter | Question it answers |
| A | Did all of it happen, or none of it? |
| C | Do the constraints still hold? |
| I | What can other sessions see before I commit? |
| D | Is a committed change still there after a crash? |

Optional time: about 3 minutes, in addition to the topic time

Success criteria: you name one change in the project that must be one transaction and say what a half-finished version would leave behind.

In the project, saving a customer is one `INSERT`. Describe a change that would need two statements to succeed together, and what the database would hold if only the first ran. Nothing here is checked or counted.

Your answer (optional) Two statements: If only the first ran:

## Sources

Checked against these live official sources on 2026-11-09 for PostgreSQL 18 and Java SE 25. This page never runs Java, JDBC or a database: the timeline and editor results are simulated, and the editor checks patterns in your text rather than compiling it.

- PostgreSQL: Transactions (tutorial)
- PostgreSQL: Transaction Isolation (Read Committed is the default)
- The Java Tutorials: Using Transactions
- Java SE 25 API: Connection (setAutoCommit, commit, rollback)

## Static interaction alternatives

### predict

Prediction (practice, not scored): with auto-commit on, adding 150 to B commits at once; taking 150 from A then fails the CHECK and is not applied. Result: A 100, B 170, so money appeared from nowhere. The CHECK never lets A go negative, and the failure undoes only the failing statement, not the earlier committed one.

### explore

Activity: four scenarios from A 100, B 20. Auto-commit, move 150: B +150 commits, A -150 fails the CHECK, so A 100, B 170. Transaction, move 150: B +150, A -150 fails, rollback, so A 100, B 20. Transaction, move 50, session 2 reads before commit: session 2 sees A 100, B 20, the old committed values. Transaction, move 50, then commit: session 2 now sees A 50, B 70.

### terminal

Editor activity: make transfer atomic. Call conn.setAutoCommit(false) before the first executeUpdate, call conn.commit() after the second executeUpdate, and add catch (SQLException e) that calls conn.rollback() and rethrows e. Committing before the debit, or rolling back without a catch, leaves half a transfer; swallowing the exception hides the failure from the caller.

### mcq

Apply question: a committed change that survives a power loss shows durability. Atomicity is all-or-nothing, consistency is constraints holding, isolation is what other sessions see before a commit. Retry: session 2 seeing old values while a transfer is uncommitted shows isolation.
