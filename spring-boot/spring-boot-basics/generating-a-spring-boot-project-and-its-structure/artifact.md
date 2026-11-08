# Generating a Spring Boot project and its structure

## Objectives

- Generate a Maven Spring Boot project with Spring Initializr, choosing the Java version, group, artifact and the web starter
- Locate the main application class, application.properties, src/main and src/test, and the parent and starter dependencies in pom.xml of a generated project
- Build and run the generated project's tests with Maven and start the application, then read the startup log to find the port it listens on

## Teaching

You generate a new Maven project with Spring Initializr, choosing a group of `com.acme`, an artifact of `workshops` and the web dependency.

Spring Initializr at `start.spring.io` produces a ready-to-build project. You choose the build tool, language, Java version, group, artifact and dependencies. The group is usually your organization's domain reversed, and the artifact is the project's short name; together they form the base package.

```
pom.xml
src/main/java/com/acme/workshops/WorkshopsApplication.java
src/main/resources/application.properties
src/test/java/com/acme/workshops/WorkshopsApplicationTests.java
```

The main class carries `@SpringBootApplication` and calls `SpringApplication.run`. `pom.xml` names the Boot parent and starters. In current Boot the web starter is `spring-boot-starter-webmvc`; the older `spring-boot-starter-web` name is deprecated but still appears in many projects.

The generated project includes the Maven wrapper, so `./mvnw` works even when Maven is not installed. Two commands prove the project is healthy.

```
./mvnw test
./mvnw spring-boot:run
```

`test` compiles and runs the generated test, which loads the application context. `spring-boot:run` starts the app. Read the startup log to find the port; the default is 8080 unless `server.port` says otherwise.

A teammate moves the controller to the package `com.other.web`, while the main class stays in `com.acme.workshops`. The app starts, but requests to the controller return 404.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Initializr generates the build file, main class, settings file and a test.
- Code belongs in or below the main class package so component scanning finds it.
- `./mvnw test` proves it builds; the startup log shows the port.

## Cheat sheet

Where to act: Compare each row with the tree in the teaching panel.

Next step: Ask whether the item is build setup, Java source, a setting or a test.

Where to act: Use the command box under the log.

Next step: Run the command that checks the project before the command that starts it.

Printed alternative: Run `./mvnw test` and see the test pass. Run `./mvnw spring-boot:run` and find the log line that shows port 8080.

- Sources: `src/main/java`. Settings: `src/main/resources`. Tests: `src/test/java`.
- Default port: 8080. Change it with `server.port`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/tutorial/first-application/index.html
- https://docs.spring.io/spring-boot/reference/using/build-systems.html
- https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html
- https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html
- https://docs.spring.io/spring-boot/reference/using/running-your-application.html
- https://start.spring.io/
- https://docs.spring.io/initializr/docs/current/reference/html/
- https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html
- https://docs.spring.io/spring-boot/maven-plugin/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** The root holds build files. Maven compiles Java sources from `src/main/java`.
- **B. Correct answer:** Right. Component scanning starts from the main class package, so code in or below it is found.
- **C. Not this one:** That folder holds non-code files such as `application.properties`.
- **D. Not this one:** That folder holds tests. It is not part of the packaged application.

### explore

**Printed alternative:** In Spring Initializr, choose Maven, the Java language and Java 25, enter the group `com.acme` (the domain acme.com reversed) and the artifact `workshops`, and add only the Spring Web dependency. The generated project then holds `pom.xml`, `src/main/java/com/acme/workshops/`, `src/main/resources/application.properties` and `src/test/java/com/acme/workshops/`.

### drag

**Answer and reason for each row**

- **The class annotated with `@SpringBootApplication`: src/main/java.** It is ordinary application source, placed at the root package.
- **The `server.port` setting: src/main/resources.** Settings go in `application.properties` on the classpath.
- **The parent and starter dependencies: pom.xml.** Maven reads these from the build file.
- **A class that checks the application context loads: src/test/java.** Tests live in the test tree and are not packaged in the app.

### terminal

**Printed alternative:** Run `./mvnw test` and see the test pass. Run `./mvnw spring-boot:run` and find the log line that shows port 8080.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Keep code in or below the main class package, or configure scanning deliberately.
- **B. Not this one:** Resources hold settings and static files, not compiled Java.
- **C. Not this one:** Maven never lists individual application classes.
- **D. Not this one:** A port is not tied to Java packages. The handler was never registered.
