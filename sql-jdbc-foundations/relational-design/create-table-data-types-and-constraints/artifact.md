# CREATE TABLE, data types and constraints

## Objectives

- Write a CREATE TABLE statement that chooses a suitable data type for each column (integer, numeric, text or varchar, boolean, date or timestamp)
- Enforce a design's rules with PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK and DEFAULT
- Predict which INSERT a constraint rejects and identify the violated constraint from the error message

## Teaching

### Start with a guess

The library's design is ready. Now the database itself will enforce it. Guess what a rule written into a table does.

### Every column has a type

`CREATE TABLE name ( column type, ... );` lists each column with a data type. PostgreSQL rejects a value the type cannot hold.

- `integer`: whole numbers, such as ids.
- `numeric(6,2)`: exact decimals, up to 6 digits with 2 after the point; recommended for money.
- `text`: strings of any length; `varchar(80)`: at most 80 characters.
- `boolean`: true or false.
- `date`: a calendar day; `timestamp`: a date with a time of day.

### Constraints write the rules down

- `PRIMARY KEY`: unique and not null.
- `REFERENCES members (id)`: a foreign key.
- `NOT NULL`: a value is required.
- `UNIQUE`: no two rows share the value.
- `CHECK (fine >= 0)`: the condition must not be false.
- `DEFAULT false`: used when an insert leaves the column out. Without one, the default is null.

### Read the error to find the rule

A rejected insert stores nothing. The first error line names the kind of rule; the `DETAIL` line shows the value.

If you do not name a constraint, PostgreSQL chooses a name. Here the names join the table, the column and the kind: `members_email_key` is the UNIQUE rule on email, `loans_fine_check` the CHECK on fine, `loans_member_id_fkey` the foreign key.

### Apply it

Predict a rejection, then read one.

## Model

The library's CREATE TABLE statements, filled in as you decide, and the rows stored so far

```
CREATE TABLE members (
  id        ?,
  email     ?,
  name      varchar(80),
  joined_on ?
);
CREATE TABLE loans (
  id        integer,
  member_id integer,
  due_on    date,
  returned  ?,
  fine      ?
);
```

| id | email | name | joined_on |
| --- | --- | --- | --- |
| 1 | ana@example.com | Ana | 2026-09-01 |

| id | member_id | due_on | returned | fine |
| --- | --- | --- | --- | --- |
| (no rows) |  |  |  |  |

## Recap

- Choose a type per column: integer, numeric for exact money, text or varchar(n), boolean, date or timestamp.
- PRIMARY KEY, REFERENCES, NOT NULL, UNIQUE, CHECK and DEFAULT turn the design's rules into rules the database enforces.
- A rejected insert stores nothing; the error names the rule and the DETAIL line shows the value.

This is the last topic in Relational Design. Next, practise it for real in the module coding lab.

## Cheat sheet

```
CREATE TABLE members (
  id        integer PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  name      varchar(80) NOT NULL,
  joined_on date NOT NULL DEFAULT CURRENT_DATE
);
CREATE TABLE loans (
  id        integer PRIMARY KEY,
  member_id integer NOT NULL REFERENCES members (id),
  due_on    date NOT NULL,
  returned  boolean NOT NULL DEFAULT false,
  fine      numeric(6,2) NOT NULL DEFAULT 0 CHECK (fine >= 0)
);
```

|  |  |
| --- | --- |
| `violates unique constraint "..._pkey"` | repeated primary key |
| `violates unique constraint "..._key"` | repeated UNIQUE value |
| `violates not-null constraint` | missing required value |
| `violates check constraint` | CHECK condition false |
| `violates foreign key constraint` | no matching parent row |
| `invalid input syntax for type date` | value does not fit the type |

Real applications often let PostgreSQL number new rows with `GENERATED ALWAYS AS IDENTITY`. This page writes ids by hand so the keys stay visible.

## Sources

Checked against these live PostgreSQL 18 pages on 2026-10-14. Error messages were copied from a real PostgreSQL 18 server. The constraint names follow what that server generated; the manual says only that the system chooses a name, so the naming pattern is listed as unverified in this topic's review record.

- PostgreSQL 18 reference: CREATE TABLE
- PostgreSQL 18: Chapter 8 Data Types
- PostgreSQL 18: 8.1 Numeric Types
- PostgreSQL 18: 8.3 Character Types
- PostgreSQL 18: 8.5 Date/Time Types
- PostgreSQL 18: 8.6 Boolean Type
- PostgreSQL 18: 5.2 Default Values
- PostgreSQL 18: 5.5 Constraints

## Static interaction alternatives

### predict

Prediction (practice, not scored): fine is numeric(6,2) with CHECK (fine >= 0), and you insert -2.50. Options: PostgreSQL rejects the row with a check constraint error; it stores 0.00 instead; it stores -2.50 and warns; it stores 2.50. Answer: it rejects the row, and nothing is stored. A constraint never changes a value to make it fit.

### explore

Type activity with answers. members.id, a whole number: integer. members.email, a string of any length: text. members.joined_on, a calendar day: date. loans.returned, yes or no: boolean. loans.fine, an exact amount of money with cents: numeric(6,2). The moment a book was checked out, a date with a time of day: timestamp.

### explore

Constraint activity with answers. Each member has an id that identifies them: PRIMARY KEY. Every member must have an email: NOT NULL. No two members share an email: UNIQUE. A fine is never negative: CHECK (fine >= 0). A new loan counts as not returned unless the insert says otherwise: DEFAULT false. Each loan's member must exist: REFERENCES members (id).

### explore

Insert activity against the finished tables (member 1, ana@example.com, already exists). INSERT INTO members (id, email, name) VALUES (2, 'ana@example.com', 'Ben'); is rejected: ERROR: duplicate key value violates unique constraint "members_email_key", DETAIL: Key (email)=(ana@example.com) already exists. INSERT INTO members (id, name) VALUES (3, 'Chen'); is rejected: ERROR: null value in column "email" of relation "members" violates not-null constraint. INSERT INTO loans (id, member_id, due_on, fine) VALUES (101, 1, '2026-11-01', -2.50); is rejected: ERROR: new row for relation "loans" violates check constraint "loans_fine_check". INSERT INTO loans (id, member_id, due_on) VALUES (102, 7, '2026-11-01'); is rejected: ERROR: insert or update on table "loans" violates foreign key constraint "loans_member_id_fkey", DETAIL: Key (member_id)=(7) is not present in table "members". INSERT INTO loans (id, member_id, due_on) VALUES (103, 1, 'soon'); is rejected by the date type: ERROR: invalid input syntax for type date: "soon". INSERT INTO loans (id, member_id, due_on) VALUES (100, 1, '2026-11-01'); is accepted, and the defaults fill in returned false and fine 0.00.

### mcq

Apply question: member 1 has ana@example.com; members has id integer PRIMARY KEY, email text NOT NULL UNIQUE, name varchar(80) NOT NULL, joined_on date NOT NULL DEFAULT CURRENT_DATE. Which insert is rejected? (2, 'ben@example.com', 'Ben') is accepted. (3, 'ana@example.com', 'Chen') is rejected (answer): the UNIQUE rule on email. (4, 'dee@example.com', 'Dee', '2026-01-15') is accepted with joined_on given. (5, 'eve@example.com', 'Eve') is accepted: joined_on takes its default, today's date. Second try: duplicate key value violates unique constraint "members_email_key" comes from the UNIQUE constraint on email.
