# Review scenarios: images, Compose and the local stack

## Objectives

- Choose the back-end Dockerfile that keeps the dependency download cached after a source-only change and ships only a Java runtime and the jar
- Choose the datasource URL and start-up condition that let the API reach PostgreSQL by service name and container port once the database is healthy
- Predict who can reach a port published on 127.0.0.1 and what data survives docker compose down and docker compose down -v

## Teaching

### Activity 1 of 3: Fix the API image

This page wraps up Containers and Compose with new scenarios that mix its topics, all on the shop stack: a Spring Boot API and its PostgreSQL database. Answer from memory first; every option explains itself after you check.

A teammate wrote the API's first Dockerfile:

```
FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY . .
RUN ./mvnw -q package -DskipTests
ENTRYPOINT ["java", "-jar", "target/shop.jar"]
```

It works, but it has two problems. Every edit to one Java file downloads all the Maven dependencies again, and the image ships the JDK and the source along with the jar.

### Activity 2 of 3: Connect the API to its database

With the image fixed, the teammate starts the stack with `docker compose up -d`. This is `compose.yaml`:

```
services:
  api:
    build: ./backend
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:15432/shop
      SPRING_DATASOURCE_USERNAME: shop
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    depends_on:
      - db
  db:
    image: postgres:18
    ports:
      - "127.0.0.1:15432:5432"
    environment:
      POSTGRES_DB: shop
      POSTGRES_USER: shop
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql
volumes:
  pgdata:
```

`docker compose ps -a` lists the api container as `Exited (1)`, and `docker compose logs api` ends with `Connection to localhost:15432 refused`. From the teammate's laptop, `psql` connects to `localhost` port 15432 without trouble.

### Activity 3 of 3: Predict who can connect and what survives

The stack now runs with the fixed file on a current Docker Engine (release 28 or later). api publishes `127.0.0.1:8080:8080`, db publishes `127.0.0.1:15432:5432`, and db keeps its data in the named volume `pgdata`. The teammate adds three orders through the API, then:

1. A colleague on the same office network opens the teammate's laptop address on port 8080 in a browser.
2. The teammate runs `docker compose down`, then `docker compose up -d`, and lists the orders.
3. The teammate runs `docker compose down -v`, then `docker compose up -d`, and lists the orders.

## Recap

- `RUN`, `COPY` and `ADD` add layers, and a changed step rebuilds every later step: copy the dependency files, download, then copy `src`.
- Each `FROM` starts a stage and the last stage is the image. `COPY --from=build` copies only the jar into a JRE stage, leaving the JDK, the Maven cache and the source behind.
- Inside a container, `localhost` is that container. Services reach each other by service name and container port, such as `db:5432`; your laptop uses `localhost` and the published host port. A healthcheck with `condition: service_healthy` makes the API start after PostgreSQL is ready.
- A port published on `127.0.0.1` is reachable from this machine only. Named volumes survive `docker compose down`; `down -v` deletes them.

## Cheat sheet

Where to act: The build stage of each option, up to its `RUN` that downloads dependencies.

Next step: List the files each option has copied before that `RUN`, and ask whether editing one file under `src` changes any of them.

Another hint Hint 2 of 2 for Activity 1

Where to act: The final stage of each option: its `FROM` line and its `COPY --from` line.

Next step: List what that stage starts from and exactly which paths it copies out of the build stage, then compare the list with "a Java runtime and the jar".

Where to act: The host and port in `SPRING_DATASOURCE_URL`, read from inside the api container.

Next step: Ask what `localhost` means inside a container, then find the name and port another service uses to reach db on the Compose network.

Another hint Hint 2 of 2 for Activity 2

Where to act: The `depends_on` entry under api.

Next step: Ask whether a plain `depends_on` waits until PostgreSQL accepts connections or only until its container is running, and what the db service needs before Compose can tell the difference.

Where to act: The address part, `127.0.0.1`, of api's ports entry.

Next step: Ask which network interface a port published on 127.0.0.1 listens on, and whether a request from another machine arrives on it.

Another hint Hint 2 of 2 for Activity 3

Where to act: The `pgdata` volume and the two `down` commands.

Next step: List what a plain `docker compose down` removes, then what `-v` adds to that list, and check where the orders are stored.

```
FROM eclipse-temurin:25-jdk AS build       # build stage
COPY mvnw pom.xml ./                       # dependency files first
RUN ./mvnw -q dependency:go-offline        # stays CACHED after a source edit
COPY src ./src
FROM eclipse-temurin:25-jre                # the last stage is the image
COPY --from=build /app/target/*.jar app.jar

SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shop  # service name + container port
depends_on:
  db:
    condition: service_healthy              # db needs a healthcheck
ports: ["127.0.0.1:8080:8080"]             # this machine only

docker compose down                        # keeps named volumes
docker compose down -v                     # also deletes them
```

Claims on this page were checked against these official sources, retrieved 2026-11-19. Outputs are shortened examples, not captured from a running stack.

- Docker Docs: Build cache invalidation: a changed step invalidates every later step
- Docker Docs: Optimize cache usage: copy dependency files and install before the rest of the source; .dockerignore
- Docker Docs: Multi-stage builds: each FROM starts a stage; COPY --from leaves everything else behind
- Docker Hub: eclipse-temurin: 25-jdk and 25-jre tags
- Docker Docs: Networking in Compose: services reach each other by service name and container port
- Docker Docs: Control startup order: depends_on waits for running, not ready; condition: service_healthy
- Compose file reference: services: depends_on long syntax and healthcheck
- PostgreSQL: pg_isready: exits 0 when the server accepts connections
- Docker Docs: Port publishing: a port published on 127.0.0.1 is reachable only from the Docker host (releases older than 28.0.0 had a same-network exception)
- Docker CLI: docker compose down: removes containers and networks; -v also removes named volumes
- Docker Docs: Volumes: volume contents exist outside the lifecycle of a container

## Static interaction alternatives

### mcq

Question: Which Dockerfile fixes both problems?. Option A: FROM eclipse-temurin:25-jdk AS build WORKDIR /app COPY mvnw pom.xml ./ COPY .mvn .mvn RUN ./mvnw -q dependency:go-offline COPY src ./src RUN ./mvnw -q package -DskipTests FROM eclipse-temurin:25-jre WORKDIR /app COPY --from=build /app /app ENTRYPOINT ["java", "-jar", "target/shop.jar"] - Not quite. The build stage keeps the download cached, but COPY --from=build /app /app copies the whole build folder, so the source and the Maven wrapper files ship with the jar. Copy only the jar. Option B: FROM eclipse-temurin:25-jdk AS build WORKDIR /app COPY mvnw pom.xml ./ COPY .mvn .mvn RUN ./mvnw -q dependency:go-offline COPY src ./src RUN ./mvnw -q package -DskipTests FROM eclipse-temurin:25-jre WORKDIR /app COPY --from=build /app/target/*.jar app.jar ENTRYPOINT ["java", "-jar", "app.jar"] - Correct. The build stage copies only the dependency files before dependency:go-offline, so a source-only edit first changes COPY src ./src and the download stays CACHED. The last stage starts from the JRE and copies only the jar, leaving the JDK, the Maven cache and the source behind. Option C: FROM eclipse-temurin:25-jdk AS build WORKDIR /app COPY . . RUN ./mvnw -q dependency:go-offline RUN ./mvnw -q package -DskipTests FROM eclipse-temurin:25-jre WORKDIR /app COPY --from=build /app/target/*.jar app.jar ENTRYPOINT ["java", "-jar", "app.jar"] - Not quite. The final stage is right, but COPY . . comes before the download. Editing any source file changes that step, which invalidates it and every later step, so the dependencies download again. Option D: FROM eclipse-temurin:25-jdk AS build WORKDIR /app COPY mvnw pom.xml ./ COPY .mvn .mvn RUN ./mvnw -q dependency:go-offline COPY src ./src RUN ./mvnw -q package -DskipTests FROM eclipse-temurin:25-jdk WORKDIR /app COPY --from=build /app/target/*.jar app.jar ENTRYPOINT ["java", "-jar", "app.jar"] - Not quite. The cache and the copy are right, but the last stage is the image, and it starts from the JDK, so the compiler and tools still ship. Start the last stage from eclipse-temurin:25-jre. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: Which change lets the API connect on every start?. Option A: Keep jdbc:postgresql://localhost:15432/shop, since psql reaches it from the laptop; add a pg_isready healthcheck to db and condition: service_healthy to api's depends_on. - Not quite. Inside the api container, localhost is the api container itself, and nothing listens there on 15432. The laptop reaches 15432 only because Compose publishes that port on the host. Option B: Use jdbc:postgresql://db:15432/shop; add a pg_isready healthcheck to db and condition: service_healthy to api's depends_on. - Not quite. db is the right name, but 15432 is the host port that Compose publishes for your laptop. On the Compose network, PostgreSQL listens on its container port, 5432. Option C: Use jdbc:postgresql://db:5432/shop; add a pg_isready healthcheck to db and condition: service_healthy to api's depends_on. - Correct. Services reach each other by service name and container port, so the URL names db:5432. The healthcheck passes once PostgreSQL accepts connections, and condition: service_healthy makes Compose wait for that before it starts api. Option D: Use jdbc:postgresql://db:5432/shop and keep depends_on: - db as it is. - Not quite. The URL is right, but a plain depends_on only waits until the db container is running. PostgreSQL can still be initialising when the API connects, so on some starts the API hits a refused connection and exits. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: What happens in each of the three steps?. Option A: 1: the colleague cannot connect. 2: the three orders are still there. 3: the orders are gone. - Correct. Publishing on 127.0.0.1 makes the port reachable from this machine only, the development default. down removes the containers and the network but keeps named volumes, so the data stays. down -v also deletes pgdata, so PostgreSQL starts empty. Option B: 1: the colleague reaches the API. 2: the three orders are still there. 3: the orders are gone. - Not quite. 8080:8080 without an address would listen on every host address, but 127.0.0.1:8080:8080 listens only on this machine, so other machines cannot connect. Option C: 1: the colleague cannot connect. 2: the orders are gone, because down removed the db container. 3: the orders are gone. - Not quite. The data lives in the named volume pgdata, not in the container. down removes containers and the network but keeps named volumes. Option D: 1: the colleague cannot connect. 2: the three orders are still there. 3: the orders are still there, because -v only prints more detail. - Not quite. For docker compose down, -v means also remove the named volumes, so pgdata and the orders are deleted. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
