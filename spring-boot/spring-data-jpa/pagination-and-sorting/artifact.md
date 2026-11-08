# Pagination and sorting

## Objectives

- Accept page, size and sort query parameters as a Pageable and pass it to a repository method
- Predict the content and page metadata of a response for a given page, size and sort
- Return a stable paged JSON shape with PagedModel instead of serializing PageImpl directly

## Teaching

A table has 25 workshops. A client calls `GET /workshops?page=1&size=10&sort=title,asc` on a handler that takes a `Pageable`.

Spring MVC builds a `Pageable` from `page`, `size` and `sort` query parameters when a handler declares one. Pass it to a repository method and you get a `Page`.

```
@GetMapping("/workshops")
Page<Workshop> list(Pageable pageable) {
  return repository.findAll(pageable);
}
```

A `Page` knows its content plus `totalElements` and `totalPages`. To compute those, Spring Data runs a second, `count` query. The default size is 20. Serializing a `Page` directly has no stable JSON shape, so wrap it: `new PagedModel<>(page)`.

For 25 rows and `size=10`, there are 3 pages. Page metadata tells a client how to continue.

Serializing Spring Data `PageImpl` directly has no stable JSON guarantee. Wrap the page in `PagedModel`, or set `spring.data.web.pageable.serialization-mode=via-dto`, to get a stable shape:

```
{
  "content": [ ... ],
  "page": { "size": 10, "number": 1,
            "totalElements": 25, "totalPages": 3 }
}
```

Always give a sort when paging. Without a stable order, rows can appear on two pages or none.

A client pages through a list sorted by `city`, where many workshops share the same city. Some rows show up twice, while others never appear.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- A `Pageable` parameter reads `page`, `size` and `sort`; `page` starts at 0.
- A `Page` includes totals, and needs a count query.
- Use `PagedModel` or `via-dto` for stable JSON, and always give a stable sort.

## Cheat sheet

Where to act: Start at the method signature.

Next step: The framework fills one parameter from the three query values.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then look at the return line.

Next step: A `Page` has its own `map` method, which keeps the metadata.

Printed alternative: Change the handler to take a Pageable, pass it to findAll, and return the mapped page of WorkshopResponse wrapped in a PagedModel. Starter file: `WorkshopController.java`.

Where to act: Read `number`, `totalPages` and the rows shown.

Next step: The last page is the only one that can be partly full. With which size does it hold 5 rows?

Printed alternative: For 25 rows: size 10 gives 3 pages, and page 2 holds rows 21 to 25. Size 5 gives 5 full pages. Size 20 gives 2 pages, and page 1 holds rows 21 to 25.

- `?page=0&size=20&sort=title,desc`
- Default size is 20.
- `Page.map(...)` converts content and keeps metadata.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html
- https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html
- https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Page 0 holds rows 1 to 10, so page 1 holds rows 11 to 20.
- **B. Not this one:** Spring Data pages start at 0 by default.
- **C. Not this one:** The server limits the query itself. That is the benefit.
- **D. Not this one:** The sort applies first, and page boundaries are multiples of the size.

### terminal

**Printed alternative:** Change the handler to take a Pageable, pass it to findAll, and return the mapped page of WorkshopResponse wrapped in a PagedModel. Starter file: `WorkshopController.java`.

### explore

**Printed alternative:** For 25 rows: size 10 gives 3 pages, and page 2 holds rows 21 to 25. Size 5 gives 5 full pages. Size 20 gives 2 pages, and page 1 holds rows 21 to 25.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Ties leave the row order undefined, so a unique tie-breaker makes page boundaries stable.
- **B. Not this one:** It may hide the symptom, but the order is still undefined.
- **C. Not this one:** That defeats the purpose of paging and costs far more.
- **D. Not this one:** With no sort, the order is even less defined.
