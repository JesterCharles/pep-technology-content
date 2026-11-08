# Seeing the generated SQL

## Objectives

- Turn on SQL logging with spring.jpa.show-sql or the org.hibernate.SQL logger and bind parameter logging
- Match each SQL statement in a log to the repository call that issued it
- Spot an unexpected extra query in a log and name the repository or entity code that caused it

## Teaching

You call `repository.findById(7L)` twice in a row, inside one transaction.

Two ways to see SQL. `spring.jpa.show-sql=true` prints to standard output. A better choice is the logger, because it goes through normal logging, where any logger level is set like this:

```
logging.level.com.acme.booking=debug
```

| Logger | Level | Shows |
| --- | --- | --- |
| `org.hibernate.SQL` | debug | Each statement, with `?` placeholders |
| `org.hibernate.orm.jdbc.bind` | trace | Values bound to each `?` |

Bound values may contain personal data, so keep this off in production.

Read a log with the code beside it. Each call has an expected statement. A statement you cannot explain is a finding.

```
service.rename(7L, "New"):
  repository.findById(7L)
  w.setTitle("New")
  // transaction commits
```

Writes usually flush at commit, so the `update` comes after your last line of Java, not at the setter. Hibernate compares the loaded entity with its snapshot to find changes. This is called dirty checking.

An endpoint returns 12 workshops. The log shows 1 select on `workshops` and 12 selects on `sessions`, each with a different `workshop_id`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Use the `org.hibernate.SQL` logger, and the bind logger only in development.
- Match each statement to a call; an unexplained statement is a finding.
- Updates usually appear at flush, from dirty checking.

## Cheat sheet

Where to act: Add one line per logger.

Next step: Each key starts with `logging.level.` followed by the logger name.

Printed alternative: Add the two logging.level lines for the Hibernate SQL and bind loggers. Starter file: `application-dev.properties`.

Where to act: Compare each line with the code in the teaching panel.

Next step: The code loads one workshop and changes its title. Does anything in it touch another table?

- Loggers: `org.hibernate.SQL` for statements, `org.hibernate.orm.jdbc.bind` for values.
- Bound values can contain personal data.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/logging.html
- https://docs.spring.io/spring-boot/reference/data/sql.html
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Within one transaction, the first-level cache already holds entity 7.
- **B. Not this one:** Not for the same id in one persistence context.
- **C. Not this one:** The first read must reach the database.
- **D. Not this one:** The SQL log shows this directly, which is the point of this topic.

### terminal

**Printed alternative:** Add the two logging.level lines for the Hibernate SQL and bind loggers. Starter file: `application-dev.properties`.

### drag

**What each line shows**

- **Line 1: `findById(7L)`.** It loads workshop 7 by id.
- **Line 2: nothing in this code.** Nothing shown reads sessions, so other code, such as a `toString` or a mapper, loaded them. That line is the finding.
- **Line 3: the dirty-checked `setTitle`.** Hibernate found the changed title and flushed the update at commit.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. One select per workshop, each with its own `workshop_id`, comes from walking a lazy association row by row.
- **B. Not this one:** One `findAll` issues one select for the workshops; the extra selects go to a different table.
- **C. Not this one:** A retry would repeat the same statement, not query `sessions` with a new id each time.
- **D. Not this one:** Logging settings change what is printed, not which statements run.
