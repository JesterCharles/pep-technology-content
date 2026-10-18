# Routes and handlers lab: guided local run

## Goal

Run a real Javalin 7 app on your own computer and make its public checks pass.
You finish two pieces of `BookApp.java`, the same two you practised in the topic *Routes and handlers in Javalin*:

1. **Task 1:** a `POST /books` handler that answers `201 Created` with the saved book as JSON (objective o2).
2. **Task 2:** an exception handler that turns `BookNotFoundException` into `404 Not Found` with a JSON error body (objective o3).

The public tests start your app on a free `localhost` port, send real HTTP requests to it, and check only the responses.

## Prerequisites

You need JDK 25 and Apache Maven 3.9 or later, as in the Java Basics lab.
Check both in a new terminal:

```
java -version
mvn -v
```

- `java -version` must report version 25.
- `mvn -v` must report Apache Maven 3.9 or later, and its `Java version:` line must also say 25.

This lab works the same on macOS, Linux and Windows. No Docker or other container tool is needed.

## Setup (once, needs the internet)

Open a terminal in the lab's `starter` folder, then run:

```
mvn -q dependency:go-offline
```

This downloads Javalin (with Jackson for JSON, Logback for logging and Javalin's test tools), JUnit and the pinned Maven plugins into your local Maven repository.
It prints nothing when it succeeds. After this step, everything else in the lab runs offline.

## Tasks

Open the `starter` folder as a project in your IDE and open `src/main/java/pep/books/BookApp.java`.
`BookStore.java`, `Book.java` and `BookNotFoundException.java` are given; you do not need to change them.
Both tasks go inside the `Javalin.create(config -> { ... })` block, where each `TODO` comment sits.

First run the tests once, from the `starter` folder, to see them fail:

```
mvn -q -o test
```

### Task 1: register a POST handler

1. Find the comment `TODO Task 1`.
2. Register a `POST /books` route. Its handler reads the `Book` from the JSON request body, saves it with `books.save`, sets the status to 201 and answers with the book that `save` returns, as JSON.
3. While it is missing, you see `Task 1: POST /books should answer status 201 Created; got 404 with body Endpoint POST /books not found`.
4. If you see `got 200`, the status was never set; if the body shows `"id":0`, you answered with the book from the request body instead of the saved one.
5. Done when no line starting with `Task 1` appears.

### Task 2: map an exception to a JSON error

1. Find the comment `TODO Task 2`.
2. Register an exception handler for `BookNotFoundException` that sets the status to 404 and answers with a JSON object whose `error` field holds the exception's message.
3. While it is missing, you see `Task 2: GET /books/99 should answer status 404 Not Found; got 500 with body Server Error`: with no exception handler, Javalin answers 500.
4. If the status is right but the body check fails, check that you send JSON, not text, and that the `error` value is the exception's own message.
5. Done when no line starting with `Task 2` appears.

## Test

The one test command, run from the `starter` folder, is:

```
mvn -q -o test
```

- Before you start, three of the four tests fail, and Maven ends with `Tests run: 4, Failures: 3`. The fourth test, `GET /books/1` still answering 200, passes from the start and must keep passing.
- When a test fails, Javalin's test tool also prints the app's log for that test. Look for the lines that start with `Task 1` or `Task 2`.
- If your code does not compile, Maven prints `COMPILATION ERROR` with the file, then `[line,column]`, then the compiler's message. Fix that line and run again.

To call the app yourself, run `BookApp.main` from your IDE, then open `http://localhost:7070/books` in a browser. Stop the app from the IDE when you are done.

## Expected output

When both tasks are complete, `mvn -q -o test` prints nothing and exits with status 0.
`expected/test-summary.txt` shows the full expected result, including the responses the tests check.

## Offline note

Only the setup step uses the network. The test command uses `-o` (offline), so it never downloads anything.
The tests talk to your app over `localhost` only. If the test command reports that an artifact is missing from the local repository, run the setup step once more while online.

## Cleanup

The lab writes only the `starter/target` folder (compiled classes and test reports). Delete it from the `starter` folder:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

The downloads stay in your local Maven repository (`~/.m2/repository` by default) so later Java labs can reuse them.

## Troubleshooting

- **`mvn: command not found`, or `'mvn' is not recognized`.** Maven's `bin` folder is not on your `PATH`. Add it, then open a new terminal.
- **`release version 25 not supported`, or `mvn -v` shows another Java.** Set `JAVA_HOME` to your JDK 25 folder, or unset it, then open a new terminal.
- **`Cannot access central in offline mode`, or a missing artifact.** The setup step has not completed. Run `mvn -q dependency:go-offline` once while online.
- **Running `BookApp.main` reports that port 7070 is in use.** Another program, perhaps an earlier run of this app, is listening on 7070. Stop it and run again. The tests are not affected: they use a free port.
