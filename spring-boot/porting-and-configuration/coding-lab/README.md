# Porting and Configuration lab: the item catalog moves to Spring Boot

## Goal

Finish porting the Java Foundations item catalog from Javalin to Spring Boot, then configure it like a real deployment: a property cap, a demo profile, a secret from the environment and a Flyway seed migration.
Six linked tasks.
Everything runs on your own computer; no cloud account, no Docker.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/catalog/ItemController.java` | 1, 2 |
| `starter/src/main/resources/application.properties` | 3, 5 |
| `starter/src/main/resources/application-demo.properties` (you create it) | 4 |
| `starter/src/main/resources/db/migration/V2__seed_catalog_items.sql` (you create it) | 6 |

Every other file is complete and stays as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later:

```
java -version
mvn -v
```

Both must report Java 25.

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

If you already ran a Spring Boot 4.1.2 lab on this machine, this finishes quickly from the cache.

## Tasks

Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

### Task 1: port the list route with constructor injection

`ItemController.java` shows the Javalin original in a comment.
Declare a `private final ItemService service;` field, assign it from a constructor parameter (no `@Autowired` field), and add a `GET /items` handler that returns `service.list()`.
Done when `task1ListsTheCatalogItems` no longer fails.

### Task 2: port the detail route and its 404 mapping

Add a `GET /items/{id}` handler that returns `service.byId(id)` (`@PathVariable int id`).
`byId` throws `NoSuchElementException` for an unknown id, exactly like the Javalin version; port the `app.exception(...)` line as an `@ExceptionHandler(NoSuchElementException.class)` method annotated `@ResponseStatus(HttpStatus.NOT_FOUND)`.
Done when `task2PortsTheDetailRouteAndIts404` no longer fails.

### Task 3: cap the listing with a property

In `application.properties`, add `catalog.page-size=3`.
`CatalogProperties` binds it and `ItemService` already caps the listing when it is set; watch the listing shrink from 5 items to 3.
Done when `task3CapsTheListingAtThePageSize` no longer fails.

### Task 4: a demo profile

Create `application-demo.properties` next to `application.properties` with one line: `catalog.greeting=Demo catalog`.
When the `demo` profile is active, the profile-specific file wins over the default; the test activates the profile for you (when running the app, you would set `spring.profiles.active=demo`).
Done when `task4DemoProfileOverridesTheGreeting` no longer fails.

### Task 5: the admin token comes from the environment

`application.properties` commits an admin token: exactly what the secrets topic forbids (treat `letmein` as burned and rotated).
Replace the literal value with the placeholder `${ADMIN_TOKEN}`, so the value comes from the `ADMIN_TOKEN` environment variable instead of the committed file.
It does not fail fast: Boot binds `@ConfigurationProperties` records through a resolver that leaves unresolvable placeholders alone, so without `ADMIN_TOKEN` the app still starts and `catalog.admin-token` binds to the literal string `${ADMIN_TOKEN}`; `/admin/ping` then answers 401 unless a client sends that literal text as the header.
The build sets `ADMIN_TOKEN=test-only-token` for the tests; in a real deployment the variable would be set by the platform, and with relaxed binding the environment variable `CATALOG_ADMINTOKEN` (uppercase, dots to underscores, dashes removed) could even map to `catalog.admin-token` without a placeholder.
Done when `task5ReadsTheAdminTokenFromTheEnvironment` no longer fails.

### Task 6: seed the table with a new migration

Flyway already applies `V1__create_catalog_items.sql` on startup.
Create `V2__seed_catalog_items.sql` in the same folder with five `insert into catalog_items (id, name, price_cents) values (...);` rows matching the in-memory catalog in `ItemRepository.java` (ids 1-5, same names and prices).
Never edit `V1`: an applied migration is immutable (checksum mismatch); changes always go in a new version.
Done when `task6SeedsTheCatalogItemsTable` no longer fails.

## Test

```
mvn -q -o test
```

from the `starter` folder.
Before you start, six tests fail; when you finish, the command prints nothing and exits with status 0.
The tests check responses and database rows only, not how your code is written.
Full output stays under `starter/target/surefire-reports/`.

To run the app itself: `ADMIN_TOKEN=anything mvn -q -o spring-boot:run` from `starter/` (after Task 5 the app still starts without the variable, but the admin token is then the literal text `${ADMIN_TOKEN}`, so set it), then `curl localhost:8080/items`.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. `mvn -q -o test` runs offline; the embedded H2 database runs in memory inside the test JVM.

## Cleanup

The lab writes only `starter/target` (the H2 database lives in memory and vanishes with the JVM). Delete `target` from the `starter` folder:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
- **`FlywayValidateException` / checksum mismatch**: you edited an applied migration. Restore `V1` exactly and put your change in a new `V2` (the test database is recreated per run, so restoring the file is enough).
- **`/admin/ping` answers 401 with the token you expected** when running the app: `ADMIN_TOKEN` is not set in that terminal, so the token bound to the literal text `${ADMIN_TOKEN}`. Set it and rerun.
- **`Cannot access central in offline mode`**: run the setup command once more while online.
