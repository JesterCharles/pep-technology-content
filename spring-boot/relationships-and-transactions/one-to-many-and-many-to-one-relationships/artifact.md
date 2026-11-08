# One-to-many and many-to-one relationships

## Objectives

- Map a bidirectional one-to-many and many-to-one relationship with @OneToMany(mappedBy) and @ManyToOne
- Identify the owning side as the side that holds the foreign key, and predict which change Hibernate saves when only the inverse side is updated
- Keep both sides of a bidirectional relationship in sync with helper methods

## Teaching

A `Workshop` has many `Session`s, mapped on both sides. The `sessions` table holds a `workshop_id` foreign key. Code runs inside a transaction:

```
Workshop w = workshops.findById(1L).orElseThrow();
Session s = new Session("Day 1");
w.getSessions().add(s);   // only this side is set
sessions.save(s);
```

A relationship is one foreign key, mapped from two Java sides. The side holding the foreign key is the owning side: `@ManyToOne`. The other side uses `mappedBy` to point at the owning field, and is the inverse side.

```
// in OrderLine
@ManyToOne
@JoinColumn(name = "order_id")
private Order order;

// in Order
@OneToMany(mappedBy = "order")
private List<OrderLine> lines = new ArrayList<>();
```

Hibernate writes the column based on the owning side only.

Java objects do not update each other. After `w.getSessions().add(s)`, `s.getWorkshop()` is still `null`, and code reading either side in the same transaction can see stale data.

A helper method on the parent keeps both sides right, in one place: it adds the child to the collection and points the child back at the parent.

Use the helper everywhere, and consider returning an unmodifiable view from the getter so nothing bypasses it.

A teammate writes `@OneToMany` on `Workshop.sessions` with no `mappedBy`, and also `@ManyToOne` on `Session.workshop`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- The owning side holds the foreign key, and it is what Hibernate writes.
- `mappedBy` marks the inverse side and names the owning field.
- Use a helper method to keep both Java sides in sync.

## Cheat sheet

Where to act: Start in the `Session` part.

Next step: The side with the foreign key column gets the many-to-one annotation and the column name.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then fill the `Workshop` part.

Next step: `mappedBy` takes the name of the Java field on the other class, not a column name.

Printed alternative: Add @ManyToOne with a join column to Session.workshop, and @OneToMany with mappedBy to Workshop.sessions. Starter file: `Session.java + Workshop.java`.

Where to act: Toggle one side at a time and read the output.

Next step: One toggle affects the database; the other only affects a Java object.

Printed alternative: Only the collection: workshop_id NULL. Only the field: workshop_id 1, but the collection is stale in this transaction. Both: workshop_id 1, and both Java sides agree.

- `@ManyToOne` + `@JoinColumn` is the owning side.
- `@OneToMany(mappedBy = "field")` is the inverse side.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://jakarta.ee/specifications/persistence/3.2/
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Hibernate writes the foreign key from the owning side only. The collection is the inverse side.
- **B. Not this one:** That updates your Java object, but the inverse side does not drive the foreign key.
- **C. Not this one:** Collections can change. The problem here is which side was changed.
- **D. Not this one:** Hibernate does not fix your object graph. Keeping both sides in sync is your job.

### terminal

**Printed alternative:** Add @ManyToOne with a join column to Session.workshop, and @OneToMany with mappedBy to Workshop.sessions. Starter file: `Session.java + Workshop.java`.

### explore

**Printed alternative:** Only the collection: workshop_id NULL. Only the field: workshop_id 1, but the collection is stale in this transaction. Both: workshop_id 1, and both Java sides agree.

### terminal

**Printed alternative:** Complete `addSession` in `Workshop` so it updates the collection and sets the session's workshop to this workshop. The starter is the empty method; `Session` has `setWorkshop(Workshop)`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Without `mappedBy`, the two sides are not linked, so you get extra structure and writes.
- **B. Not this one:** Hibernate does not infer the link. `mappedBy` is how you state it.
- **C. Not this one:** It compiles and may start, which is why the mistake is easy to miss.
- **D. Not this one:** It processes both mappings.
