# Tables, keys and relationships

## Objectives

- Identify a table's primary key and explain why its values must be unique and never null
- Predict which inserts and deletes a foreign key rejects when it links a child table to a parent table
- Classify a relationship between two entities as one-to-many or many-to-many, and name the junction table a many-to-many relationship needs

## Teaching

### Start with a guess

A small library database has two tables, shown on the right. Guess before you learn the rule.

### Primary key: one row, one identity

A table stores one kind of thing; each row is one of them. The primary key is the column whose value identifies a row, like `authors.id`.

PostgreSQL requires primary key values to be unique and not null: two rows with the same id, or a row with no id, could not be told apart.

### Foreign key: a link that must point somewhere

`books.author_id` is a foreign key: it `REFERENCES authors (id)`. Every non-null value in it must match an existing author; a null author_id is not checked. Add `NOT NULL` to make the link mandatory, so every book must have an author. The table holding the foreign key is the child; the referenced table is the parent.

- A child row that points at a missing parent is rejected.
- By default, deleting a parent that a child still points at is rejected. Delete or change the child first.

### One-to-many and many-to-many

One-to-many: one author has many books, each book one author. The foreign key goes on the "many" side: `books.author_id`.

Many-to-many: a member borrows many books, and a book is borrowed by many members. No single foreign key column can hold that, so add a junction table, such as `loans (member_id, book_id)`, with a foreign key to each side. Each row is one pairing.

### Apply it

Same rules, new tables.

## Model

The library database: current rows. Bold columns are keys; a new row has a double border.

| id (primary key) | name |
| --- | --- |
| 1 | Octavia Butler |
| 2 | Ursula K. Le Guin |

| id (primary key) | title | author_id (foreign key to authors.id) |
| --- | --- | --- |
| 10 | Kindred | 1 |

One-to-many and many-to-many Top: authors, one, linked to books, many; the foreign key author_id sits in books. Bottom: members linked to books through the junction table loans; loans has member_id and book_id, a foreign key to each side, so each member has many loans and each book has many loans. authors books (author_id) 1 many members loans member_id, book_id books 1 many many 1

Text version: authors one-to-many books, through books.author_id. Members and books are many-to-many, through the junction table loans (member_id, book_id).

## Recap

- A primary key identifies each row, so its values must be unique and never null.
- A non-null foreign key value must match an existing parent row (add `NOT NULL` to make the link mandatory): inserting an orphan child is rejected, and so is deleting a parent that children still reference (the default).
- One-to-many puts the foreign key on the many side; many-to-many needs a junction table with two foreign keys.

Next topic: Designing tables from a user story

## Cheat sheet

|  |  |
| --- | --- |
| `id integer PRIMARY KEY` | unique and not null |
| `author_id integer REFERENCES authors (id)` | if not null, must match an existing authors.id |
| `ERROR: duplicate key value violates unique constraint "authors_pkey"` | repeated primary key |
| `ERROR: insert or update on table "books" violates foreign key constraint` | child points at a missing parent |
| `ERROR: update or delete on table "authors" violates foreign key constraint` | parent still referenced |
| `loans (member_id, book_id)` | junction table for many-to-many |

Options you will meet later: `ON DELETE CASCADE` deletes the children with the parent.

## Sources

Checked against these live PostgreSQL 18 pages on 2026-10-14. Error messages were copied from a real PostgreSQL 18 server.

- PostgreSQL 18: 5.1 Table Basics
- PostgreSQL 18: 5.5 Constraints (primary keys, foreign keys)
- PostgreSQL 18 tutorial: 3.3 Foreign Keys

## Static interaction alternatives

### predict

Prediction (practice, not scored): you insert a book with author_id 4 and no author 4 exists. Options: PostgreSQL rejects the insert with an error; it inserts the book with an empty author; it creates author 4 automatically; it inserts the book and shows a warning. Answer: it rejects the insert. The foreign key requires every non-null author_id to match an existing authors.id, so nothing is stored and nothing is created.

### explore

Statement activity on authors (ids 1 and 2 exist). INSERT INTO authors VALUES (2, 'Toni Morrison'); is rejected: ERROR: duplicate key value violates unique constraint "authors_pkey", DETAIL: Key (id)=(2) already exists. INSERT INTO authors VALUES (NULL, 'Toni Morrison'); is rejected: ERROR: null value in column "id" of relation "authors" violates not-null constraint. INSERT INTO authors VALUES (3, 'Toni Morrison'); is accepted: INSERT 0 1.

### explore

Statement activity. INSERT INTO books VALUES (11, 'Beloved', 4); is rejected: ERROR: insert or update on table "books" violates foreign key constraint "books_author_id_fkey", DETAIL: Key (author_id)=(4) is not present in table "authors". INSERT INTO books VALUES (11, 'Beloved', 3); is accepted. DELETE FROM authors WHERE id = 1; is rejected while Kindred (book 10) still references author 1: ERROR: update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books", DETAIL: Key (id)=(1) is still referenced from table "books". Working order: DELETE FROM books WHERE id = 10; then DELETE FROM authors WHERE id = 1;

### explore

Classification activity with answers. Author and book, where each book has one author: one-to-many. Member and book, borrowing over time: many-to-many. Customer and order, where each order belongs to one customer: one-to-many. Student and course enrollment: many-to-many. The author link goes in books, as books.author_id. Member and book borrowing needs a junction table, loans (member_id, book_id).

### mcq

Apply question: customers 1 and 2 exist; the only order references customer 2. Which statement is rejected? INSERT INTO orders VALUES (7, 1); is accepted, customer 1 exists. DELETE FROM customers WHERE id = 1; is accepted, no order references customer 1. DELETE FROM customers WHERE id = 2; is rejected (answer): an order still references customer 2. INSERT INTO customers VALUES (3, 'Kai'); is accepted, id 3 is new. Second try: the error DETAIL: Key (id)=(2) is still referenced from table "orders" came from deleting customer 2.
