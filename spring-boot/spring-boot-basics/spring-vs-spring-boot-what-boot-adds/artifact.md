# Spring vs Spring Boot: what Boot adds

## Objectives

- Distinguish the Spring Framework (the IoC container and Spring MVC) from Spring Boot (starters, auto-configuration and an embedded server) for a described application setup task
- Name what Boot adds for a web application that plain Spring leaves to the developer: curated dependency management through the spring-boot-dependencies BOM or the starter parent, starters as convenient sets of managed dependencies, auto-configured beans and an embedded server started from a main method
- Explain why a Spring Boot application runs with java -jar or mvn spring-boot:run without deploying to a separately installed server

## Teaching

A team has a working Spring MVC application. Today they configure the servlet setup by hand, pick every library version themselves and copy a WAR file into a separately installed Tomcat.

They add a Spring Boot starter, inherit the Boot parent and add a `main` method that calls `SpringApplication.run`.

Spring Framework is the engine: the IoC container that creates and wires beans, and Spring MVC, which maps requests to controller methods.

Spring Boot sits on top and removes setup work. It gives you curated dependency management through the `spring-boot-dependencies` BOM or the starter parent, starters that bundle sets of managed dependencies, auto-configured beans based on what is on the classpath, and an embedded server started from `main`.

A useful test: if the feature describes what your running code does, it is usually the framework. If it describes what you no longer have to set up, it is usually Boot.

The Spring Boot Maven plugin repackages your build into an executable jar that contains your classes, your dependencies and the embedded server.

That is why two commands both start the app without deploying anywhere: `mvn spring-boot:run` during development, and `java -jar` on the packaged file.

```
mvn -q package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Inside the jar, dependencies sit in `BOOT-INF/lib`, and `META-INF/MANIFEST.MF` names a launcher as `Main-Class` and your class as `Start-Class`. `jar tf` lists a jar; `unzip -p` prints one file from it.

A colleague is writing a new service and asks where a decision belongs.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Spring Framework is the engine: the container and Spring MVC.
- Spring Boot adds managed versions, starters, auto-configuration and an embedded server.
- An executable jar runs with `java -jar` because the server travels inside it.

## Cheat sheet

A kitchen can cook anything if you buy the ovens, wire them and stock the shelves yourself. A serviced kitchen arrives with ovens installed and shelves stocked with matching supplies. You still do the cooking the same way.

The framework does the cooking; Boot delivers a kitchen that is already set up.

Where to act: Start with the rows that mention beans or request mapping.

Next step: Ask whether the row describes running behavior or removed setup work.

Where to act: Use the command box under the terminal log.

Next step: The teaching panel shows the two commands in the order you need them.

Printed alternative: Package with `mvn -q package`, list the jar with `jar tf`, print `META-INF/MANIFEST.MF` with `unzip -p`, try running the file directly, then run it with `java -jar`. Your findings come from that output.

- Develop with `mvn spring-boot:run`.
- Package with `mvn package`, then run with `java -jar target/<name>.jar`.
- Boot needs Java 17 or later.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/projects/spring-boot/
- https://docs.spring.io/spring-boot/index.html
- https://docs.spring.io/spring-boot/system-requirements.html
- https://docs.spring.io/spring-framework/reference/core/beans/introduction.html
- https://docs.spring.io/spring-boot/maven-plugin/index.html
- https://docs.spring.io/spring-boot/reference/features/spring-application.html
- https://docs.spring.io/spring-boot/specification/executable-jar/nested-jars.html
- https://docs.spring.io/spring-boot/specification/executable-jar/launching.html
- https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** Boot does not replace Spring MVC. The same annotated controllers keep working; Boot configures the framework around them.
- **B. Correct answer:** Right. Boot adds managed dependency versions, auto-configuration and an embedded server, while Spring Framework still does the work underneath.
- **C. Not this one:** Generating a skeleton is Spring Initializr. Boot also acts at runtime by auto-configuring beans and starting the embedded server.
- **D. Not this one:** The opposite: the server is embedded in the application, so no separate install is required.

### drag

**Answer and reason for each row**

- **The IoC container that creates and injects beans: Spring Framework.** The container is core Spring Framework; Boot only starts it for you.
- **Mapping `@GetMapping` methods to requests: Spring Framework.** Spring MVC is part of Spring Framework. Boot auto-configures it but does not implement it.
- **A starter that pulls in a tested set of web dependencies: Spring Boot.** Starters are Boot artifacts: convenient dependency sets with versions Boot manages.
- **One BOM that fixes compatible library versions: Spring Boot.** The `spring-boot-dependencies` BOM, which the starter parent uses, curates versions.
- **An embedded Tomcat started from your `main` method: Spring Boot.** Boot auto-configures and starts the embedded server; plain Spring leaves server setup to you.

### terminal

**Printed alternative:** Package with `mvn -q package`, list the jar with `jar tf target/demo-0.0.1-SNAPSHOT.jar`, print its manifest with `unzip -p target/demo-0.0.1-SNAPSHOT.jar META-INF/MANIFEST.MF`, try `./target/demo-0.0.1-SNAPSHOT.jar`, then run `java -jar target/demo-0.0.1-SNAPSHOT.jar`. Your findings come from that output: the server library under BOOT-INF/lib, the Main-Class and Start-Class, and the program that ran the jar.

### explore

**Printed alternative:** Record, from your own output, the server library under BOOT-INF/lib, the Main-Class, the Start-Class and the program that ran the jar.

### mcq

**Why each option is right or wrong**

- **A. Not this one:** Spring MVC uses a JSON library at runtime, but it does not manage your build versions.
- **B. Correct answer:** Right. Declaring a managed dependency without a version picks up the curated, tested one.
- **C. Not this one:** The server handles HTTP. Dependency versions are a build concern that the BOM handles.
- **D. Not this one:** Auto-configuration creates beans at startup from what is already on the classpath. It never downloads libraries.
