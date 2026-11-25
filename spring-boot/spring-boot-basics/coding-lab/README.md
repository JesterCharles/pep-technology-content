# Spring Boot Basics lab: the workshop catalog API

## Goal

Finish a small workshop-catalog service built with Spring Boot. Seven linked tasks:
- Task 1: register the seeded catalog as a bean and inject it into the controller.
- Tasks 2 and 3: add find-by-id (200 or 404) and create (201 with a Location header).
- Task 4: give the project its settings file.
- Task 5: make component scanning find a controller in a second package.
- Task 6: implement one operation from an OpenAPI document.
- Task 7: start the application and its embedded web server from `main`.

Everything runs on your own computer; no cloud account, no Docker.
On the Standard track this lab is required, after the four Day 2 pages (it closes the module); on the Fast track it is not required.
Plan about 36 minutes for the tasks (an estimate, not piloted), after the one-time setup of about 8 minutes. Run the setup once, while online, before you start the tasks.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/workshops/CatalogConfig.java` | 1 |
| `starter/src/main/java/workshops/WorkshopController.java` | 1, 2, 3 and 6 |
| `starter/src/main/resources/application.properties` | 4 (you create this file, and its folder) |
| `starter/src/main/java/workshops/WorkshopsApplication.java` | 5 and 7 |

Every other file is complete and stays as shipped. Read `fixtures/workshops-openapi.yaml` for Task 6, but do not change it, and do not move `AboutController` out of its `about` package.

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
Each task has a `TODO` comment, except Task 4, which creates a new file. Each test is named after its task, so a failure tells you which task it belongs to.
Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

### Task 1: register and inject the catalog bean

`CatalogConfig` builds the catalog with its two seed workshops, but nothing registers it with Spring.
Register it as a bean, using the route the beans page recommends for an object whose construction needs logic.
Then, in `WorkshopController`, replace the manual `new WorkshopCatalog(List.of())` with constructor injection of that bean, and make `all()` return the catalog's workshops.
Done when `task1ListsTheSeededWorkshops` no longer fails.

### Task 2: find one workshop by id

Add `GET /workshops/{id}`. It returns `200 OK` with the matching workshop, or `404 Not Found` when the id does not exist (`findById` returns an `Optional` to build on).
Done when `task2FindsOneWorkshopByItsIdOr404` no longer fails.

### Task 3: create a workshop

Add `POST /workshops`. It takes a `NewWorkshop` request body, adds it with `catalog.add(...)`, and returns `201 Created` with a `Location` header ending in `/workshops/{newId}` and the created workshop as the body.
Done when `task3CreateReturns201AndTheCreatedWorkshop` no longer fails.

### Task 4: add the settings file

The project needs two settings: the application name `workshop-catalog` and the port `8081`.
Create the settings file where a Spring Initializr project keeps it (see the generating-a-project page), with the keys `spring.application.name` and `server.port`.
Done when `task4ApplicationPropertiesNameTheServiceAndPort` no longer fails.

### Task 5: scan a second package

`AboutController` in the `about` package maps `GET /about`, but that request returns 404.
Find out why from the auto-configuration page, then make Spring scan both packages. Remember that naming packages replaces the default.
Done when `task5ScanningFindsTheAboutController` no longer fails.

### Task 6: implement an operation from its OpenAPI document

`fixtures/workshops-openapi.yaml` describes one more operation for the catalog API.
Read it to find the path, the parameters and where each one goes, the response schema and the status codes (including what a missing or non-numeric parameter gets).
Then add that handler to `WorkshopController.java`, with a small record for the response body in the same file.
Use the field names exactly as the schema spells them.
Done when `task6AvailabilityFollowsTheOpenApiContract` no longer fails.

### Task 7: start the embedded server from main

`main` in `WorkshopsApplication.java` is empty, so running the class does nothing.
Start Spring Boot from `main` the way a generated project's main class does, passing `args` through.
Open `pom.xml` and point out the Spring Boot parent and the web starter that make this work.
The test calls `main` with `--server.port=0`, then sends one real HTTP request to the server it started.
Done when `task7MainStartsTheEmbeddedServer` no longer fails.

## Test

The one test command, run from the `starter` folder:

```
mvn -q -o test
```

Before you start, all seven tests fail; when you finish, the command prints nothing and exits with status 0.
Most tests call the API over MockMvc and check status codes and JSON bodies. The Task 4 test checks the settings file, and the Task 7 test starts the application from `main`.
None of them checks how your code is written, so compare your code with each task's steps yourself.
Full test output, including the Spring log of each run, is written under `starter/target/surefire-reports/`.

After Task 7 you can also run the API itself: run `WorkshopsApplication` from your IDE (its `main` method).
The startup log names the port, 8081 after Task 4. Call the API with curl, for example `curl localhost:8081/workshops`, and stop the application from your IDE.

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
- **Maven says it cannot access `central` in offline mode**: run the setup command once more while online.
- **Port 8081 already in use when running the app**: another server is running; stop it, or run the tests instead (the Task 7 test picks a free port).
