# Reading: SQL vs NoSQL

## Objectives

- Contrast a relational (SQL) store with document and key-value (NoSQL) stores on schema, querying and consistency
- Choose a store type for a described service's data and justify the choice from its access pattern
- Explain how database-per-service lets two services use different store types

## Teaching

Your shop keeps a cart per browser session. Code only reads or replaces the whole cart, by session id, and carts expire after 30 minutes.

| Store | Schema | Querying | Consistency |
| --- | --- | --- | --- |
| Relational | Declared up front | Rich SQL, joins | ACID transactions across rows |
| Document | Flexible per document | By fields inside a document | Often narrower transaction scope |
| Key-value | None for the value | Mostly get and put by key | Varies; simple operations |

Start from how the data is read and written.

Database per service has a side effect: each service can choose its own store type. Using several types in one system is called polyglot persistence.

Each store type is one more thing to learn, back up and run.

The `reports` service stores pipeline results as nested records. Fields change between pipeline versions, pages filter by region and date, and nothing joins to another service’s data.

## Recap

You finished 0 of 4 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- Relational: declared schema, rich SQL, ACID across rows.
- Document: flexible fields and field queries. Key-value: simple, fast access by key.
- Database per service lets each service pick its own store type, at the cost of more to run.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Reading without JavaScript: decide first, then read on.

Where to act: Try the shared setup first, with different stores.

Next step: Ask why one shared database cannot give each service its own store type.

Printed alternative: A shared database has one store type, so both services must use it. With database per service, orders can stay relational for transactions and joins while catalog uses a document store for varying fields.

Reading without JavaScript: decide first, then read on.

- Name the reads and writes first, then pick the store.
- A relational database is a sound default when no pattern pulls you elsewhere.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Understand data store models: relational, document, key-value
- Data considerations for microservices: polyglot persistence
- Pattern: Database per service: different services can use different database types

## Static interaction alternatives

### predict

Which store fits this cart best? Each option is explained after the question in this reading.

### drag

Which store fits best? Each row and its explanation follow in this reading.

### explore

A shared database has one store type, so both services must use it. With database per service, orders can stay relational for transactions and joins while catalog uses a document store for varying fields.

### mcq

Which choice would you defend in review? Each option is explained after the question in this reading.
