# Spring Data JPA lab: workshops move into the database

## Goal

The workshop catalog moves from memory to an embedded H2 database.
Five linked tasks: map the entity, add a derived query and a JPQL `@Query`, page and sort, and stop the API from leaking an internal entity field by returning DTOs.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/workshops/Workshop.java` | 1 |
| `starter/src/main/java/workshops/WorkshopRepository.java` | 2, 3 |
| `starter/src/main/java/workshops/WorkshopService.java` | 2, 3, 4 |
| `starter/src/main/java/workshops/WorkshopResponse.java` (you create it) | 5 |
| `starter/src/main/java/workshops/WorkshopController.java` | 5 |

The application class, `application.properties` and `data.sql` are complete and stay as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later (`java -version`, `mvn -v`; both must report Java 25).

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

## Tasks

Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

Until Task 1 is done the Spring context cannot start, so every test reports the same context error; that is the shipped state, and the first green step is yours.

### Task 1: map the entity

In `Workshop.java`, annotate the class with `@Entity`, the `id` field with `@Id` and `@GeneratedValue(strategy = GenerationType.IDENTITY)` (the imports are ready).
On startup Hibernate now creates the `workshop` table and `data.sql` seeds four rows.
Done when `task1MapsTheEntityAndListsTheSeededRows` no longer fails.

### Task 2: a derived query

In `WorkshopRepository.java`, declare `List<Workshop> findByCategoryOrderByTitleAsc(String category);` - no body, no SQL; Spring Data derives the query from the name.
In `WorkshopService.byCategory`, call it instead of returning `List.of()`.
Done when `task2DerivedQueryFiltersByCategorySortedByTitle` no longer fails.

### Task 3: a JPQL @Query

Some queries read better spelled out. Declare a search method with a JPQL `@Query` and a named parameter (the TODO in the repository shows the exact shape) and call it from `WorkshopService.search`.
Done when `task3JpqlSearchMatchesAnyCase` no longer fails.

### Task 4: pagination and sorting

In `WorkshopService.page`, return `repository.findAll(pageable)`.
The controller already binds `?page=0&size=2&sort=seats,desc` into the `Pageable` and wraps the result in `PagedModel` for a stable JSON shape (`content` plus a `page` block), instead of serializing `PageImpl` directly.
Done when `task4PagesAndSortsWithStableJsonShape` no longer fails.

### Task 5: DTOs stop the leak

Every handler currently returns `Workshop` entities, so `internalNotes` ("VIP client - discount agreed") goes to every client.
Create a `WorkshopResponse` record with exactly `Long id, String title, String category, int seats` and one static mapper method `from(Workshop)`, then change every handler in `WorkshopController` to map through it (for the page endpoint: `new PagedModel<>(service.page(pageable).map(WorkshopResponse::from))`).
Done when `task5ResponsesExposeOnlyTheDtoFields` no longer fails.

While working, uncomment `spring.jpa.show-sql=true` in `application.properties` and rerun the tests: the report files under `starter/target/surefire-reports/` then show the SQL each repository call issues, including the derived query from Task 2.

## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.
The tests check only status codes and JSON bodies.

To run the API itself: `mvn -q -o spring-boot:run` from `starter/`, then `curl "localhost:8080/workshops/page?page=0&size=2&sort=seats,desc"`.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. H2 runs in memory inside the test JVM; nothing listens on a port during tests.

## Cleanup

The lab writes only `starter/target`:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **`Not a managed type: class workshops.Workshop`**: Task 1 is not done yet; the repository needs the class annotated with `@Entity`.
- **`No property 'categoryOrder...' found`**: the derived method name does not parse; match the name in the Task 2 TODO exactly.
- **`Could not resolve attribute` in a JPQL error**: JPQL uses entity and field names (`Workshop`, `w.title`), not table or column names.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
