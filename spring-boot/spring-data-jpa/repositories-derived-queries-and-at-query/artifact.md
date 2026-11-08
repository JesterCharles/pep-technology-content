# Repositories, derived queries and @Query

## Objectives

- Declare a repository interface extending JpaRepository and use its inherited CRUD methods
- Write derived query methods such as findByTitleContainingIgnoreCase and predict the query a method name produces
- Write a JPQL @Query with a named parameter for a query a method name cannot express clearly

## Teaching

You declare this method and write no implementation:

```
interface WorkshopRepository extends JpaRepository<Workshop, Long> {
  List<Workshop> findByTitleContainingIgnoreCase(String text);
}
```

Extending `JpaRepository<Workshop, Long>` gives `save`, `findById`, `findAll`, `deleteById`, `count` and more.

A derived query is built from the method name: `findBy` plus property expressions and keywords such as `And`, `Or`, `Containing`, `IgnoreCase`, `GreaterThan` and `OrderBy...Desc`.

```
findByCapacityGreaterThan(int n)
findByCityAndOpenTrue(String city)
findByCityOrderByTitleDesc(String city)
```

A property name that does not exist fails at startup, so typos surface early.

When a name stops being readable, write JPQL with `@Query`. JPQL talks about entity classes and fields, not tables and columns.

```
@Query("select w from Workshop w where w.city = :city and w.capacity >= :min")
List<Workshop> findLargeIn(@Param("city") String city, @Param("min") int min);
```

Named parameters avoid string concatenation, and therefore SQL injection. Never build a query by joining user text.

A teammate writes `findByTitel(String t)`. The entity field is `title`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `JpaRepository` gives CRUD; a method name can define a query.
- Use `@Query` with JPQL and named parameters when a name stops being readable.
- Never concatenate user text into a query.

## Cheat sheet

Where to act: Add the `extends` clause first, then each method on its own line.

Next step: Build each name from `findBy`, a property name and, if needed, keywords.

Printed alternative: Declare the interface as a JpaRepository, add the two derived query methods, and delete by id in cancel with an inherited method. Starter file: `Bookings.java`.

Where to act: Replace the `___` in the annotation.

Next step: JPQL names the entity class and its fields, with an alias, as in the teaching panel.

Printed alternative: Write a JPQL query that selects open workshops in a city by a named parameter, and bind the parameter. Starter file: `WorkshopRepository.java`.

- Keywords: `And`, `Or`, `Containing`, `IgnoreCase`, `GreaterThan`, `OrderBy`.
- JPQL uses entity names, not table names.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html
- https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html
- https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
- https://docs.spring.io/spring-data/commons/reference/repositories/core-concepts.html
- https://docs.hibernate.org/orm/7.4/querylanguage/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. The method name is the query definition.
- **B. Not this one:** Repository interfaces have no bodies. Spring Data supplies the implementation.
- **C. Not this one:** `@Query` is optional. The name alone is enough here.
- **D. Not this one:** It builds an ordinary query with a case-insensitive `like`.

### terminal

**Printed alternative:** Declare the interface as a JpaRepository, add the two derived query methods, and delete by id in cancel with an inherited method. Starter file: `Bookings.java`.

### terminal

**Printed alternative:** Write a JPQL query that selects open workshops in a city by a named parameter, and bind the parameter. Starter file: `WorkshopRepository.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Derived queries are validated while the repository is created.
- **B. Not this one:** A method name is just a name to the compiler.
- **C. Not this one:** Derived queries are created eagerly, so it fails earlier.
- **D. Not this one:** An unknown property is an error, not an empty result.
