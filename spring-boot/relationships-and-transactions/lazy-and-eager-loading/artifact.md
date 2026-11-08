# Lazy and eager loading

## Objectives

- State the default fetch type for @ManyToOne and @OneToMany and predict when Hibernate loads the associated data
- Explain a LazyInitializationException from a stack trace and where the session closed
- Choose lazy loading with an explicit fetch for the use case instead of switching an association to eager

## Teaching

A `Workshop` has `@OneToMany(mappedBy = "workshop") List<Session> sessions`. You call `workshops.findById(1L)` with SQL logging on, and do not touch `sessions`.

JPA has two fetch types. LAZY loads an association when it is first read; EAGER loads it before the owner is returned, by a join or an immediate second select.

| Annotation | Default |
| --- | --- |
| `@ManyToOne` | EAGER |
| `@OneToOne` | EAGER |
| `@OneToMany` | LAZY |
| `@ManyToMany` | LAZY |

A lazy read needs an open persistence context. Many teams set `@ManyToOne(fetch = FetchType.LAZY)` too, so loading stays explicit and predictable.

If a lazy association is read after the persistence context has closed, Hibernate cannot query, so it throws:

```
org.hibernate.LazyInitializationException:
  failed to lazily initialize a collection: could not initialize proxy - no Session
```

Boot enables Open EntityManager in View by default for web apps, which keeps the context open during rendering and hides many of these. With `spring.jpa.open-in-view=false`, the failure appears at the code that reads after the transaction.

Fix: fetch what the use case needs inside the service, and map to a DTO before returning. Switching to EAGER only moves the cost everywhere.

An endpoint throws `LazyInitializationException` when reading `workshop.getSessions()` in a controller. A teammate suggests adding `fetch = FetchType.EAGER` on the mapping.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@ManyToOne` defaults to EAGER, and `@OneToMany` to LAZY.
- A lazy read after the session closes throws `LazyInitializationException`.
- Prefer lazy mappings plus an explicit fetch for each use case.

## Cheat sheet

Where to act: Change the Fetch type, and read the output.

Next step: A lazy load only appears in the log if the code actually reads the association.

Printed alternative: LAZY with no read: one select on workshops. LAZY with a read: a select on workshops, then a select on sessions when read. EAGER: session rows are loaded before findById returns, by a join or an immediate second select, whether or not the code reads them.

Where to act: Read the lines top to bottom, as they happened in time.

Next step: Look for the line that commits, and then for the code that runs after it and touches a collection.

- `spring.jpa.open-in-view=false` makes late reads fail where they happen.
- Map to a DTO inside the transaction.

## Sources

Status: unreviewed first draft, 2026-11-04. Sources were fetched live on 2026-11-04; no independent education or technology review has happened yet, so every claim here remains unverified by a reviewer.

- https://jakarta.ee/specifications/persistence/3.2/
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@OneToMany` defaults to LAZY, so sessions load only when first read.
- **B. Not this one:** That would be eager behavior, which is not the default for a collection.
- **C. Not this one:** A join happens only if you ask for one, for example with a fetch join.
- **D. Not this one:** The workshop itself must be loaded, because you asked for it.

### drag

**The defaults**

- **@ManyToOne: EAGER.** A single parent is loaded with the child unless you set `FetchType.LAZY`.
- **@OneToMany: LAZY.** A collection loads only when it is first read.

### explore

**Printed alternative:** LAZY with no read: one select on workshops. LAZY with a read: a select on workshops, then a select on sessions when read. EAGER: session rows are loaded before findById returns, by a join or an immediate second select, whether or not the code reads them.

### mcq

**What each line shows**

- **Line 1 (leave):** The transaction starts here, which is normal.
- **Line 2 (mark):** The commit ends the persistence context, here with open-in-view off.
- **Line 3 (mark):** The controller reads the lazy collection after the service has returned.
- **Line 4 (leave):** A startup line, unrelated to this request.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Only this use case pays for the data, and the mapping stays lazy for every other caller.
- **B. Not this one:** Every workshop load now pays for sessions, including where they are unused.
- **C. Not this one:** That reports false data to the client.
- **D. Not this one:** It stretches a transaction across the web layer, and it hides where data access happens.
