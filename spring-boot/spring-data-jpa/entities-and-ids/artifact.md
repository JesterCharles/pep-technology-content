# Entities and IDs

## Objectives

- Map a class to a table with @Entity, @Table, @Id, @GeneratedValue and @Column, with the no-argument constructor Jakarta Persistence requires
- Choose an ID generation strategy and predict the ID before and after save
- Explain how Spring Data decides whether save inserts or updates an entity and why equals and hashCode based on a generated ID need care

## Teaching

An entity uses a database-generated id:

```
@Entity
class Workshop {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String title;
  protected Workshop() { }
  Workshop(String title) { this.title = title; }
  // getters
}

Workshop w = new Workshop("Intro");
System.out.println(w.getId());
w = repository.save(w);
System.out.println(w.getId());
```

`@Entity` marks a persistent class. `@Id` marks the primary key. `@GeneratedValue` lets the database or provider assign it. `@Table` and `@Column` rename things or add constraints when defaults do not fit.

JPA needs a no-argument constructor (public or protected) so that it can create instances when loading rows.

```
@Entity
@Table(name = "workshops")
class Workshop {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 80)
  private String title;
}
```

`save` asks whether the entity is new. By default, a `null` id (or a primitive `0`) counts as new, so it calls `persist` and an insert follows. Otherwise it calls `merge`, and an update follows if something changed.

```
IDENTITY   database assigns on insert
SEQUENCE   provider asks a database sequence first
AUTO       provider chooses
```

A generated id is `null` until saved, so `equals` and `hashCode` based on the id change their answer after saving, which breaks entities stored in a `HashSet`. Base them on a stable business key, or use only the id with a null check and a constant `hashCode`.

An entity overrides `equals` and `hashCode` using only `id`. Code adds a new, unsaved entity to a `HashSet`, saves it, then asks `set.contains(entity)`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@Entity`, `@Id` and a no-argument constructor make a class persistent.
- `save` inserts a new entity and merges an existing one, based on `isNew`.
- A generated id is `null` before saving, so be careful with `equals` and `hashCode`.

## Cheat sheet

Where to act: Work from the top of the class down.

Next step: Each TODO needs one annotation or one member. The teaching panel has a similar class.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Look at the last TODO.

Next step: JPA creates objects when loading rows, before it sets fields. What must exist for that?

Printed alternative: Add the entity and table annotations, a generated Long id, a non-null column for email, and a no-argument constructor. Starter file: `Booking.java`.

Where to act: Change one control at a time.

Next step: Which id value makes `save` think the entity is not new?

Printed alternative: Null id: insert. Existing id with changed title: update. Existing id with no change: a select, and no write.

- `IDENTITY`, `SEQUENCE` and `AUTO` are the common strategies.
- Always use the entity `save` returns.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html
- https://jakarta.ee/specifications/persistence/3.2/
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A new entity has no id until the insert runs and returns one.
- **B. Not this one:** The type is `Long`, a reference, so unset is `null`. A primitive `long` would be 0.
- **C. Not this one:** `new` runs your constructor. Nothing assigns an id there.
- **D. Not this one:** `save` returns the saved entity, with its id set.

### terminal

**Printed alternative:** Add the entity and table annotations, a generated Long id, a non-null column for email, and a no-argument constructor. Starter file: `Booking.java`.

### explore

**Printed alternative:** Null id: insert. Existing id with changed title: update. Existing id with no change: a select, and no write.

### drag

**Strategy and save, row by row**

- **Strategy for an auto-increment column: `IDENTITY`.** The database assigns the id during the insert. `SEQUENCE` asks a sequence before the insert, and `AUTO` lets the provider choose.
- **How save chooses: by asking whether the entity is new.** A null id means new, so `persist` and an insert follow; otherwise `merge`, and an update if something changed.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The entity sits in the bucket for its old hash, so the lookup misses it.
- **B. Not this one:** A hash set first looks in the bucket for the current hash, which has changed.
- **C. Not this one:** Saving works. The problem appears later, in the hash lookup.
- **D. Not this one:** JPA does not rearrange your Java collections this way.
