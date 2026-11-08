# Spring Data JPA with Hibernate

## Objectives

- Explain how Spring Data JPA, Jakarta Persistence and Hibernate divide the work between repository interfaces, the persistence API and the provider that issues SQL
- Configure a Boot project with the Data JPA starter and an embedded H2 database, and predict the datasource Boot auto-configures when no URL is set
- Compare a repository call with the equivalent hand-written JDBC code from the SQL course

## Teaching

In the SQL course you wrote JDBC by hand: get a connection, prepare a statement, loop over a `ResultSet`, close everything. Now look at this:

```
interface WorkshopRepository extends JpaRepository<Workshop, Long> { }

List<Workshop> all = repository.findAll();
```

Jakarta Persistence (JPA) is the specification: `@Entity`, `EntityManager` and JPQL. Hibernate is the provider that implements it and issues SQL. Spring Data JPA sits on top and generates repository implementations from your interfaces.

A repository call passes through three layers to the databaseYour code calls a Spring Data repository, which uses the Jakarta Persistence API, implemented by Hibernate, which sends SQL over JDBC to the database. Your service calls repository Spring Data JPA Jakarta Persistence API Hibernate issues SQL Database

Hibernate is the layer that actually writes the SQL.

Add `spring-boot-starter-data-jpa` and the `com.h2database:h2` runtime dependency. With an embedded database on the classpath and no `spring.datasource.url` set, Boot auto-configures an in-memory database with a generated unique name.

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

For an embedded database with no schema manager, `ddl-auto` defaults to `create-drop`, so the schema is built from entities at startup and dropped at shutdown.

Compare two ways of counting workshops. JDBC takes a connection, a prepared statement, a result set and cleanup. The repository takes `repository.count()`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Spring Data generates repositories; JPA is the standard; Hibernate issues the SQL.
- With the starter and H2 and no URL, Boot configures an embedded database.
- The SQL is still there, and you will read it in a later topic.

## Cheat sheet

A restaurant guest orders from a waiter. The menu is the agreed standard, the kitchen does the real work, and the waiter handles the routine trip so the guest does not visit the kitchen.

The specification is the menu, Hibernate the kitchen, and Spring Data the waiter.

Where to act: Use the layers in the diagram.

Next step: Is the statement about a standard API, about issuing SQL, or about generating a repository?

Where to act: Read the model output after each change.

Next step: Auto-configuration needs the classes present, and it backs off when you specify a URL yourself.

Printed alternative: Starter and H2 with no URL: embedded in-memory H2 with a unique generated name. No starter: no repository support. No H2 and no URL: Failed to configure a DataSource. A URL set: Boot connects to that URL.

- Starter: `spring-boot-starter-data-jpa`.
- Embedded default: `ddl-auto=create-drop` when no schema manager is present.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/projects/spring-data-jpa/
- https://docs.spring.io/spring-boot/reference/data/sql.html
- https://docs.spring.io/spring-data/jpa/reference/index.html
- https://docs.spring.io/spring-data/jpa/reference/jpa/getting-started.html
- https://www.h2database.com/html/main.html
- https://jakarta.ee/specifications/persistence/3.2/
- https://docs.hibernate.org/orm/7.4/introduction/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. You declare the interface; Spring Data supplies the implementation; Hibernate issues the SQL.
- **B. Not this one:** Inherited methods such as `findAll` need no query from you.
- **C. Not this one:** A database only runs the SQL it is given.
- **D. Not this one:** A relational database still runs SQL. You can see it in the log.

### drag

**Answer and reason for each row**

- **Generates an implementation of your repository interface: Spring Data JPA.** You write only the interface; Spring Data creates the implementation.
- **Defines the `@Entity` annotation and `EntityManager`: Jakarta Persistence.** These belong to the specification.
- **Issues the SQL statements seen in the log: Hibernate.** The provider translates entity operations into SQL.

### explore

**Printed alternative:** In `pom.xml`, add `spring-boot-starter-data-jpa` and `com.h2database:h2` with `runtime` scope, and no other data starter. With no `spring.datasource.url`, Boot then auto-configures an embedded in-memory H2 database.

### explore

**Printed alternative:** Starter and H2 with no URL: embedded in-memory H2 with a unique generated name. No starter: no repository support. No H2 and no URL: Failed to configure a DataSource. A URL set: Boot connects to that URL.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The SQL still exists, and you can see it in the log.
- **B. Not this one:** SQL still runs. A careless JPA call can even be slower than a tuned query.
- **C. Not this one:** The data stays in the database.
- **D. Not this one:** Spring Data JPA works with relational databases that Hibernate supports.

### drag

**Your comparison, row by row**

- **JDBC version: you write the SQL.** You prepare the statement, read the result set and close everything yourself.
- **Repository version: Hibernate writes the SQL.** Spring Data implements the interface, and Hibernate issues the statement.
- **What you still provide: the entity mapping and the interface.** Connections, statements and result-set loops move into the framework.
