# Simulator transcripts: relational-design

Output captured on 2026-10-13 and re-run on 2026-10-14 from a real PostgreSQL 18.3 server (embedded-postgres-binaries darwin-arm64v8 18.3.0, run locally, C locale) and psql 18.3 (Homebrew libpq). The page simulators copy these formats and messages; database, user and row names are the pages' fictional ones. Raw local paths are omitted; the capture server listened on port 54329, edited to the default 5432 in the connection error below.

## installing-postgres-and-a-sql-client (database practice, owner ana)

```
                                                List of databases
   Name    |  Owner   | Encoding | Locale Provider | Collate | Ctype | Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+---------+-------+--------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | C       | C     |        |           | 
 practice  | ana      | UTF8     | libc            | C       | C     |        |           | 
 template0 | postgres | UTF8     | libc            | C       | C     |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | C       | C     |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
(4 rows) -- one unrelated scratch database row removed

          List of tables
 Schema |  Name   | Type  | Owner 
--------+---------+-------+-------
 public | courses | table | ana
(1 row)

               Table "public.courses"
 Column  |  Type   | Collation | Nullable | Default 
---------+---------+-----------+----------+---------
 id      | integer |           | not null | 
 title   | text    |           | not null | 
 credits | integer |           | not null | 
Indexes:
    "courses_pkey" PRIMARY KEY, btree (id)

        List of relations
 Schema |  Name   | Type  | Owner 
--------+---------+-------+-------
 public | courses | table | ana
(1 row)

Did not find any relation named "nosuch".
ERROR:  syntax error at or near "selec"
LINE 1: selec version();
        ^
psql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  database "nosuchdb" does not exist
```

Banner and `SELECT version();` format: PostgreSQL 18 tutorial section 1.4 (https://www.postgresql.org/docs/current/tutorial-accessdb.html).

## tables-keys-and-relationships and create-table-data-types-and-constraints

```
CREATE TABLE authors (id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE
CREATE TABLE books (id integer PRIMARY KEY, title text NOT NULL, author_id integer NOT NULL REFERENCES authors (id));
CREATE TABLE
INSERT INTO authors VALUES (1, 'Octavia Butler'), (2, 'Ursula K. Le Guin');
INSERT 0 2
INSERT INTO books VALUES (10, 'Kindred', 1);
INSERT 0 1
INSERT INTO authors VALUES (2, 'Toni Morrison');
ERROR:  duplicate key value violates unique constraint "authors_pkey"
DETAIL:  Key (id)=(2) already exists.
INSERT INTO authors VALUES (NULL, 'Toni Morrison');
ERROR:  null value in column "id" of relation "authors" violates not-null constraint
DETAIL:  Failing row contains (null, Toni Morrison).
INSERT INTO authors VALUES (3, 'Toni Morrison');
INSERT 0 1
INSERT INTO books VALUES (11, 'Beloved', 4);
ERROR:  insert or update on table "books" violates foreign key constraint "books_author_id_fkey"
DETAIL:  Key (author_id)=(4) is not present in table "authors".
INSERT INTO books VALUES (11, 'Beloved', 3);
INSERT 0 1
DELETE FROM authors WHERE id = 1;
ERROR:  update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books"
DETAIL:  Key (id)=(1) is still referenced from table "books".
DELETE FROM books WHERE id = 10;
DELETE 1
DELETE FROM authors WHERE id = 1;
DELETE 1
CREATE TABLE members (id integer PRIMARY KEY, email text NOT NULL UNIQUE, name varchar(80) NOT NULL, joined_on date NOT NULL DEFAULT CURRENT_DATE);
CREATE TABLE
CREATE TABLE loans (id integer PRIMARY KEY, member_id integer NOT NULL REFERENCES members (id), due_on date NOT NULL, returned boolean NOT NULL DEFAULT false, fine numeric(6,2) NOT NULL DEFAULT 0 CHECK (fine >= 0));
CREATE TABLE
INSERT INTO members (id, email, name) VALUES (1, 'ana@example.com', 'Ana');
INSERT 0 1
INSERT INTO members (id, email, name) VALUES (2, 'ana@example.com', 'Ben');
ERROR:  duplicate key value violates unique constraint "members_email_key"
DETAIL:  Key (email)=(ana@example.com) already exists.
INSERT INTO members (id, name) VALUES (3, 'Chen');
ERROR:  null value in column "email" of relation "members" violates not-null constraint
DETAIL:  Failing row contains (3, null, Chen, 2026-10-14).
INSERT INTO loans (id, member_id, due_on) VALUES (100, 1, '2026-11-01');
INSERT 0 1
INSERT INTO loans (id, member_id, due_on, fine) VALUES (101, 1, '2026-11-01', -2.50);
ERROR:  new row for relation "loans" violates check constraint "loans_fine_check"
DETAIL:  Failing row contains (101, 1, 2026-11-01, f, -2.50).
INSERT INTO loans (id, member_id, due_on) VALUES (102, 7, '2026-11-01');
ERROR:  insert or update on table "loans" violates foreign key constraint "loans_member_id_fkey"
DETAIL:  Key (member_id)=(7) is not present in table "members".
INSERT INTO loans (id, member_id, due_on) VALUES (103, 1, 'soon');
ERROR:  invalid input syntax for type date: "soon"
LINE 1: ... INTO loans (id, member_id, due_on) VALUES (103, 1, 'soon');
                                                               ^
INSERT INTO loans (id, member_id, due_on) VALUES (100, 1, '2026-11-01');
ERROR:  duplicate key value violates unique constraint "loans_pkey"
DETAIL:  Key (id)=(100) already exists.
SELECT id, member_id, due_on, returned, fine FROM loans;
 id  | member_id |   due_on   | returned | fine 
-----+-----------+------------+----------+------
 100 |         1 | 2026-11-01 | f        | 0.00
(1 row)

```
