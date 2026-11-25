# Final Assessment coding challenge, Spring (basic, 10 minutes): one tool by id

## Goal

A community tool library keeps its tools in a small Spring Boot API with an in-memory database seeded from `data.sql`.
Finish one endpoint: `GET /api/tools/{id}` returns that tool, and an unknown id gets a standard 404 problem detail.

**Time: 10 minutes from the end of setup, reading included.** Do the setup below before the timer starts. The entity, repository, response DTO, exception, seed data and checks are provided.

## What you edit

Three small pieces, in `starter/src/main/java/toolshed/`:

| File | What you write |
| --- | --- |
| `ToolService.java` | the body of `byId(long id)` |
| `ToolController.java` | one handler method for `GET /api/tools/{id}` |
| `ApiErrors.java` | one `@ExceptionHandler` method |

Leave every other file as it is, including the tests in `tests/`, `starter/pom.xml`, `expected/` and `data.sql`. Keep the `byId` signature.

## Setup (before the timer, needs the internet once)

You need JDK 25 and Apache Maven 3.9 or later in the terminal (`java -version`, `mvn -v`).
Every command runs in the `starter` folder:

```
cd starter
mvn -q dependency:go-offline
mvn -q -o test
```

The first Maven command downloads the libraries once and prints nothing when it works. The second runs the checks: **all 5 fail before you start. That is expected.**

## The task

Provided: `ToolRepository` (a `JpaRepository<Tool, Long>`, so it already has `findById`), `ToolResponse` with its static `from(Tool)` mapper, and `ToolNotFoundException(long id)`, whose message is `No tool with id <id>`.

1. `ToolService.byId(id)` returns the tool with that id, or throws `ToolNotFoundException` when there is none.
2. `GET /api/tools/{id}` in `ToolController` calls `ToolService.byId` and returns the tool as a `ToolResponse` with status 200. Never return the `Tool` entity: its `purchaseNote` is staff-only.
3. In `ApiErrors` (the global `@RestControllerAdvice`), handle `ToolNotFoundException` by returning a `ProblemDetail`: status 404, title `Tool not found`, and detail equal to the exception's message. Handle it there, not in `ToolController`: the checks also call a second, test-only controller (`tests/toolshed/MissingToolProbe.java`) that throws `ToolNotFoundException`, and it must get the same answer. Handle only `ToolNotFoundException`: other errors, such as `GET /api/tools/abc` (not a number), keep Spring's own answer (400).

Example: `GET /api/tools/77` answers 404 with content type `application/problem+json` and `{"title":"Tool not found","status":404,"detail":"No tool with id 77","instance":"/api/tools/77", ...}`.

## Test

Run the checks from `starter`:

```
mvn -q -o test
```

**You are finished when `mvn -q -o test` prints nothing at all.** Otherwise each failing check's name (they all start with `task1`) and message say what is still wrong. You are scored on the checks you pass. `expected/test-summary.txt` shows what a finished run looks like.
One run takes about a minute or more (we measured 56 to 100 seconds per run on a busy machine), because it compiles your code and starts the application, so finish all three edits before your first run.

## Troubleshooting

- **`there is no POM in this directory`.** The terminal is not in `starter`. From the question folder, run `cd starter` and try again.
- **`COMPILATION ERROR`.** Your code does not compile yet, and no check can pass. Maven names the file, then `[line,column]`, then the problem.
- **`mvn -v` shows a Java version other than 25, or you see `release version 25 not supported`.** Set `JAVA_HOME` to your JDK 25 folder, then open a new terminal.
- **`Cannot access central in offline mode`, or a missing artifact.** The setup step has not finished. Run `mvn -q dependency:go-offline` once while online.

## Cleanup (optional)

Maven writes only the `starter/target` folder, and Git already ignores it. The database is in memory and disappears when the checks end.
