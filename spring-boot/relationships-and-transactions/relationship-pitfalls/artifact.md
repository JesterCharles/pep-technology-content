# Relationship pitfalls

## Objectives

- Predict the effect of cascade types and orphanRemoval when a parent is saved or deleted or a child is removed from a collection
- Avoid infinite recursion when serializing bidirectional relationships by returning DTOs
- Explain why toString, equals and hashCode must not traverse lazy associations

## Teaching

A mapping uses cascade and orphan removal:

```
@OneToMany(mappedBy = "workshop",
           cascade = CascadeType.ALL,
           orphanRemoval = true)
private List<Session> sessions = new ArrayList<>();
```

Inside a transaction, code runs `workshop.getSessions().remove(session)`, and never calls delete.

Cascade passes an operation from parent to child: `PERSIST` saves new children with the parent, and `REMOVE` deletes children with the parent. `ALL` includes all of them.

`orphanRemoval = true` deletes a child removed from the collection.

Use these only for children that truly belong to one parent, such as an order and its lines. Cascading `REMOVE` from a child to a shared parent, such as `Session` to `Workshop`, can delete far more than you meant.

Bidirectional entities point at each other, so serializing one directly loops: workshop, sessions, workshop, and so on, until a `StackOverflowError` or a JSON failure. Return DTOs, and the cycle never reaches JSON.

The same trap hides in `toString`, `equals` and `hashCode`: if they touch a lazy collection, they run SQL, and a logging line can load half the database or throw outside a session. Keep these methods to simple fields, and never include associations.

An API returns a `Workshop` entity directly. It works in a small test, but in production the endpoint throws a `StackOverflowError` when writing JSON.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Cascade passes parent operations down; orphan removal deletes removed children.
- Bidirectional entities loop when serialized, so return DTOs.
- `toString`, `equals` and `hashCode` must not traverse lazy associations.

## Cheat sheet

Where to act: Toggle one option at a time and read both lines.

Next step: One setting controls saving with the parent; the other controls what removal from a collection means.

Printed alternative: Cascade PERSIST or ALL: new child is saved with the parent. orphanRemoval: a child removed from the collection is deleted. Neither: you must save and delete children yourself.

Where to act: Change the return line of `toString`.

Next step: Which field in that line can trigger a query or a loop?

Printed alternative: Rewrite toString so it uses only id and title and no association. Starter file: `Workshop.java`.

- Avoid cascading `REMOVE` from a child to a shared parent.
- Keep `toString` to simple fields.

## Sources

Status: unreviewed first draft, 2026-11-04. Sources were fetched live on 2026-11-04; no independent education or technology review has happened yet, so every claim here remains unverified by a reviewer.

- https://jakarta.ee/specifications/persistence/3.2/
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Removing it from the collection makes it an orphan.
- **B. Not this one:** Orphan removal is exactly the setting that deletes it without a delete call.
- **C. Not this one:** That can happen without `orphanRemoval`. With it, the row goes.
- **D. Not this one:** Removing one child does not delete the parent.

### explore

**Printed alternative:** Cascade PERSIST or ALL: new child is saved with the parent. orphanRemoval: a child removed from the collection is deleted. Neither: you must save and delete children yourself.

### drag

**Each method, row by row**

- **toString: it can run SQL or throw.** Touching a lazy collection loads it, so a log line can query the database or fail outside a session.
- **equals: it loads collections and drifts.** Two entities stop being equal as sessions change, and each comparison may load data.
- **hashCode: it changes, so hash sets lose the entity.** A hash set files the entity under its old hash and cannot find it again.

### terminal

**Printed alternative:** Rewrite toString so it uses only id and title and no association. Starter file: `Workshop.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. It also stops leaks and hidden lazy loads.
- **B. Not this one:** An infinite cycle overflows any stack size.
- **C. Not this one:** The cycle remains, and now more data loads.
- **D. Not this one:** An entity needs an id, and this does not touch the cycle.
