# Spring Boot Basics lab: the workshop catalog API

## Goal

Finish the REST API of a small workshop-catalog service.
Five linked tasks, all in **one file**: wire the configured catalog bean into the controller, then add the list, find-by-id, filter and create endpoints.
Everything runs on your own computer; no cloud account, no Docker.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/workshops/WorkshopController.java` | 1-5 (the only file you edit) |

Every other file is complete and stays as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later (the same install you used for the Java Foundations labs). Check both in a terminal:

```
java -version
mvn -v
```

`java -version` must report 25, and the `Java version:` line of `mvn -v` must also say 25.

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

This downloads Spring Boot 4.1.2 and the pinned plugins into your local Maven repository, then everything else runs offline.

## Tasks

Open the `starter` folder as a Maven project in your IDE and open `WorkshopController.java`.
Each task is one `TODO` comment; its test is named after it, so failures tell you which task they belong to.
Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

### Task 1: inject the catalog bean

The controller builds its own empty catalog with `new WorkshopCatalog(List.of())`, so it never sees the two seeded workshops that `CatalogConfig` puts in the real bean.
Replace the manual `new` with constructor injection: make the field `final` and assign it from a constructor parameter.
Then make `all()` return the catalog's workshops.
Done when `task1ListsTheSeededWorkshops` no longer fails.

### Task 2: find one workshop by id

Add a `GET /workshops/{id}` handler method that takes the id as a `@PathVariable int id` and returns the matching workshop from the catalog.
Done when `task2FindsOneWorkshopByItsId` no longer fails.

### Task 3: 404 for an unknown id

Change that method to return `ResponseEntity<Workshop>`: `200 OK` with the workshop when the id exists, `404 Not Found` when it does not (`findById` returns an `Optional` to build on).
Done when `task3UnknownWorkshopIdGives404` no longer fails.

### Task 4: filter with a query parameter

Give `all()` an optional `Integer minSeats` query parameter (`@RequestParam(required = false)`).
When it is present, return only workshops with at least that many seats; when absent, return all of them.
Done when `task4FiltersWorkshopsByMinSeats` no longer fails.

### Task 5: create a workshop

Add a `POST /workshops` handler that takes a `NewWorkshop` `@RequestBody`, adds it with `catalog.add(...)`, and returns `201 Created` with a `Location` header of `/workshops/{newId}` and the created workshop as the body (`ResponseEntity.created(URI.create(...)).body(...)`).
Done when `task5CreateReturns201AndTheCreatedWorkshop` no longer fails.

## Test

The one test command, run from the `starter` folder:

```
mvn -q -o test
```

Before you start, all five tests fail; when you finish, the command prints nothing and exits with status 0.
The tests call the API over MockMvc and check only status codes and JSON bodies, not how your code is written, so compare your code with each task's steps yourself.
Full test output, including the Spring log of each run, is written under `starter/target/surefire-reports/`.

You can also run the API itself from the `starter` folder with `mvn -q -o spring-boot:run` and call it with curl (`curl localhost:8080/workshops`); stop it with Ctrl-C.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. `mvn -q -o test` runs offline; if it reports a missing artifact, run the setup step once more while online.

## Cleanup

The lab writes only `starter/target`. Delete it from the `starter` folder:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
- **`COMPILATION ERROR`**: fix the file and line Maven names, then rerun the test command.
- **`Cannot access central in offline mode`**: run the setup command once more while online.
- **Port 8080 already in use when running the app**: another server is running; stop it, or run the tests instead (they do not open a port).
