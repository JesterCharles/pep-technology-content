# Fixing N+1 with JOIN FETCH

## Objectives

- Rewrite a repository query with JOIN FETCH or an @EntityGraph so that a listing loads parents and children in one query
- Verify the fix by counting queries in the SQL log before and after
- Explain when a collection JOIN FETCH pages in the database with Hibernate 7.4 and when it falls back to paging in memory, and choose a portable alternative such as a separate batch query

## Teaching

A repository method is changed to:

```
@Query("select w from Workshop w join fetch w.sessions")
List<Workshop> findAllWithSessions();
```

The listing maps each workshop's sessions to a DTO, with 3 workshops in the table.

`join fetch` in JPQL tells Hibernate to load an association in the same query. An `@EntityGraph` says the same on a method without writing the join:

```
@EntityGraph(attributePaths = "sessions")
List<Workshop> findByOpenTrue();
```

Both give the one use case what it needs while the mapping stays LAZY for everyone else. Workshops with no sessions need `left join fetch`, or an inner join drops them. Hibernate 6 and later deduplicate root entities automatically, so `distinct` is no longer needed for that.

Verify by counting statements before and after. N+1 is fixed when the count stops growing with the rows.

Paging needs care. A collection fetch join multiplies rows, so a plain database `LIMIT` would cut through a parent's children. Hibernate 7.4, which Spring Boot 4.1 manages, pages the parents in a subquery on databases that support limits and offsets in subqueries. On a database that does not, such as Sybase ASE, it warns and applies the limit in memory, or fails if `hibernate.query.fail_on_pagination_over_collection_fetch` is set.

The portable choice for paged lists, which pages in the database on any database: page the parents, then load the children with a second query, or set `spring.jpa.properties.hibernate.default_batch_fetch_size` so lazy loads run in batches.

Your application runs on a database that does not support limits in subqueries. After adding `join fetch w.sessions` and `Pageable` to the same query, the log shows `firstResult/maxResults specified with collection fetch; applying in memory`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `join fetch` or `@EntityGraph` loads an association in one statement.
- Prove the fix by counting statements before and after.
- Hibernate 7.4 pages a collection fetch join in the database only where limits in subqueries are supported; batching or a two-step query is the portable choice.

## Cheat sheet

Where to act: Replace the `___` in the annotation.

Next step: Which join keeps a parent that has no children, and which keyword makes it initialize the collection?

Printed alternative: Write a JPQL query with a left join fetch on the sessions association. Starter file: `WorkshopRepository.java`.

Where to act: Set the listing to paged first.

Next step: Read the paging line for each fix. Which one pages in the database whatever the database?

Printed alternative: Unpaged with join fetch: 1 query. Paged with join fetch: with Hibernate 7.4, paging in the database where limits in subqueries are supported, and a warning with paging in memory where they are not. Paged with batch size 50: 1 parent query plus 1 batch query, with paging in the database. No fix: 1 plus N queries.

- `left join fetch` keeps parents with no children.
- `hibernate.default_batch_fetch_size` batches lazy loads.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/querylanguage/html_single/
- https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. The association is initialized by the same query.
- **B. Not this one:** The collection is already initialized, so it needs no extra query.
- **C. Not this one:** It loads both in one statement.
- **D. Not this one:** The first load still has to reach the database.

### terminal

**Printed alternative:** Write a JPQL query with a left join fetch on the sessions association. Starter file: `WorkshopRepository.java`.

### explore

**Printed alternative:** Unpaged with join fetch: 1 query. Paged with join fetch: with Hibernate 7.4, paging in the database where limits in subqueries are supported, and a warning with paging in memory where they are not. Paged with batch size 50: 1 parent query plus 1 batch query, with paging in the database. No fix: 1 plus N queries.

### drag

**The counts**

- **Before: 11.** One select for the workshops plus one per workshop: N + 1 with N = 10.
- **After: 1.** The join fetch loads parents and children together.
- **100 workshops after: 1.** The count no longer grows with the rows, which is what proves the fix.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Use a separate query or batching for paged lists.
- **B. Not this one:** With real data, this loads the whole result into memory.
- **C. Not this one:** The SQL runs. The issue is where paging happens.
- **D. Not this one:** It only affects this query.
