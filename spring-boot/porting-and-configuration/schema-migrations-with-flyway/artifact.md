# Schema migrations with Flyway

## Objectives

- Write versioned Flyway migrations named V\<version\>\_\_\<description\>.sql that create and change tables, and let Spring Boot apply them at startup
- Predict what Flyway does on startup for a new migration, an already applied migration and an edited applied migration (checksum mismatch)
- Explain why schema changes go in a new migration and why spring.jpa.hibernate.ddl-auto is set to validate or none once Flyway owns the schema

## Teaching

A project has already applied `V1__create_workshop.sql` to its database. A developer edits that file to add a column, then restarts the app.

Flyway runs versioned SQL files in order and records each in a history table. The name format is strict:

```
V1__create_room.sql
V2__add_floor_to_room.sql
```

That is `V`, a version, two underscores, a description and `.sql`. By default, Boot looks in `classpath:db/migration`, so `src/main/resources/db/migration`.

Add `spring-boot-starter-flyway`, and Boot applies pending migrations at startup, before JPA uses the schema.

On startup, Flyway compares the files with `flyway_schema_history`:

- New file: applied, then recorded with its checksum.
- Applied, unchanged: skipped.
- Applied, edited: validation fails with a checksum mismatch.

Once Flyway owns the schema, set `spring.jpa.hibernate.ddl-auto` to `validate` or `none`, so Hibernate checks the schema but never changes it.

A team has Flyway migrations but leaves `spring.jpa.hibernate.ddl-auto=update` turned on in every environment.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `V<version>__<description>.sql` files in `db/migration` run in order.
- Applied migrations are immutable; a change means a new version.
- Let Flyway own the schema: set `ddl-auto` to `validate` or `none`.

## Cheat sheet

Where to act: Write one statement in the empty file.

Next step: Existing rows need a value for a non-null column, so which clause supplies one?

Printed alternative: Finish the CREATE TABLE statement with a required title column, then write one ALTER TABLE statement that adds a required capacity integer column with a default of 20, in a second file named with the next version. Starter: two migration files.

Where to act: Change one control at a time and read the output.

Next step: Look for the setup in which the change arrives as a new file, not as an edit.

Printed alternative: V1 edited: checksum mismatch and startup fails. V1 unedited with no V2: nothing to apply. V1 unedited with a new V2: V2 applied and recorded.

- Two underscores between version and description.
- History table: `flyway_schema_history`.
- Starter: `spring-boot-starter-flyway`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/data/sql.html
- https://docs.spring.io/spring-boot/how-to/data-initialization.html
- https://documentation.red-gate.com/fd/
- https://documentation.red-gate.com/fd/quickstart-how-flyway-works-184127223.html
- https://documentation.red-gate.com/fd/migrations-271585107.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Flyway recorded the checksum of the applied file, and the edited file no longer matches.
- **B. Not this one:** An applied migration is never re-run. History is meant to be immutable.
- **C. Not this one:** Flyway validates applied migrations and reports the difference.
- **D. Not this one:** That only happens if you explicitly ask for it with a clean, never as a side effect here.

### drag

**The file name**

- **Second migration: `V2__add_capacity_to_workshop.sql`.** It needs the next version, two underscores and `.sql`. Reusing `V1` clashes with the applied migration, and a name without a version is not a versioned migration.

### terminal

**Printed alternative:** Finish the CREATE TABLE statement with a required title column, then write one ALTER TABLE statement that adds a required capacity integer column with a default of 20, in a second file named with the next version. Starter: two migration files.

### explore

**Printed alternative:** V1 edited: checksum mismatch and startup fails. V1 unedited with no V2: nothing to apply. V1 unedited with a new V2: V2 applied and recorded.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Flyway owns the schema; `validate` only checks it against the entities, and `none` leaves it alone.
- **B. Not this one:** Hibernate can add what entities imply, which then exists in no migration.
- **C. Not this one:** Flyway still runs, and `create` would rebuild the schema on every start, which is worse.
- **D. Not this one:** `update` does not delete data. It alters the schema, and that bypasses the migrations Flyway records.
