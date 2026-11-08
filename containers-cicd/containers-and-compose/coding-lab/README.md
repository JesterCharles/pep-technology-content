# Lab: containerise the shop and describe it with Compose

## Goal

Package the shop's two applications as container images and describe the whole stack in one Compose file.
You write five files inside `starter/` and add one line to `starter/.gitignore`:

- `backend/Dockerfile` for the Spring Boot API;
- `frontend/Dockerfile` for the Vite front end, served by nginx;
- `backend/.dockerignore` and `frontend/.dockerignore`;
- `compose.yaml` for the API and its PostgreSQL database.

Sixteen public tests check your files against the rules taught in this module.
They read your files as text and YAML.
Nothing in this lab builds an image, starts a container or needs Docker, Podman or any other container engine.

This lab belongs to Standard days S36 and S37; Fast learners do not take it.
Finish these topic pages first, because the lab uses what they teach: image layers and build caching, multi-stage builds, ports, volumes and environment variables, Compose with Spring Boot and its database, service-name networking, and depends_on with health checks.

## Timing

Plan about 75 minutes, split across the two days' guided-lab blocks.
On S36 do phases 1 and 2 and the Dockerfile and `.dockerignore` parts of phase 3 (about 40 minutes); on S37 do the Compose part and phase 4 (about 35 minutes).
If several tests fail more than once, allow up to 95 minutes.
The setup and test commands themselves take about a second on a typical laptop once the packages are downloaded; the minutes above are the time to read, write and fix the files.

## Prerequisites

Check each version in a terminal:

```sh
node --version   # v24.x
npm --version    # the npm bundled with Node.js 24
git --version    # any 2.x
```

## Setup (once, needs the network)

```sh
cd tests
npm ci
```

`npm ci` installs one pinned YAML parser (`yaml` 2.9.1) from `tests/package-lock.json` into `tests/node_modules`.
After that, the tests run fully offline.

## Phase 1: orient (about 5 minutes)

1. Open `starter/` and find the two applications:
   - `backend/` is a Spring Boot project built with the Maven wrapper (`mvnw`, `.mvn/`, `pom.xml`, `src/`).
     `mvn package` writes its jar into `target/`.
   - `frontend/` is a Vite project (`package.json`, `package-lock.json`, `src/`).
     `npm run build` writes the finished site into `dist/`.
2. Run the tests once (see "How to test").
   All 16 fail, and each message names the rule it checks.
   Read the messages now: they are your checklist.

## Phase 2: study a worked example (about 10 minutes)

The example below packages a *different* system, so you can see every idea in action without copying.
It is an `orders` API built with **Gradle**, plus a **Redis** cache.
Read it, then answer the three questions after it before you write anything.

```dockerfile
# orders/Dockerfile
FROM eclipse-temurin:25-jdk AS compile
WORKDIR /work
# Dependency files first: this layer stays cached while only source changes.
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN ./gradlew --no-daemon dependencies   # resolves and downloads the dependencies
COPY src src
RUN ./gradlew --no-daemon bootJar        # build.gradle names the jar orders.jar

# Only the runtime and the one jar ship.
FROM eclipse-temurin:25-jre
WORKDIR /opt/orders
COPY --from=compile /work/build/libs/orders.jar orders.jar
ENTRYPOINT ["java", "-jar", "orders.jar"]
```

```yaml
# compose.yaml for the example
services:
  orders:
    build: ./orders
    ports:
      - "127.0.0.1:9000:8080"          # this machine only
    environment:
      CACHE_URL: redis://cache:6379    # service name and container port
      CACHE_PASSWORD: ${CACHE_PASSWORD} # filled from .env, never written here
    depends_on:
      cache:
        condition: service_healthy
  cache:
    image: redis:8
    environment:
      REDIS_PASSWORD: ${CACHE_PASSWORD} # Compose fills this from .env
    # $$ leaves the variable for the container's shell to expand
    command: ["sh", "-c", "exec redis-server --requirepass \"$$REDIS_PASSWORD\""]
    volumes:
      - cache-data:/data
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -a \"$$REDIS_PASSWORD\" ping | grep -q PONG"]
      interval: 5s
      retries: 10
volumes:
  cache-data:
```

The example's `.env` holds `CACHE_PASSWORD=...`, and `.gitignore` lists `.env`.
Its `orders/.dockerignore` lists `build`, `.gradle`, `.git` and `.env`.

Check yourself before moving on:

- Why does `COPY src src` come after the dependency step, not before?
- Where exactly is the jar inside the `compile` stage, and how does the start command find the copied file?
- Why does the healthcheck write `$$` while the `environment` entry writes `$`?

## Phase 3: build the shop's files (about 45 minutes)

Write each file so it meets these outcomes.
They are the rules the tests check; the words in brackets are the test names.

**`backend/Dockerfile`** (backend Dockerfile tests)

- A named build stage on a Java 25 JDK image, and a last stage on a Java 25 JRE image.
- In the build stage, the Maven dependency files are copied and the dependencies downloaded with the wrapper's `dependency:go-offline` goal before `src` is copied; then the wrapper packages the jar.
- The last stage copies only the packaged jar, from the build stage's `target` folder, and starts exactly the file it copied with `java -jar`.

**`frontend/Dockerfile`** (frontend Dockerfile tests)

- A named build stage on a Node 24 image, and a last stage on an nginx image.
- `package.json` and `package-lock.json` are copied and installed with `npm ci` before the rest of the source is copied; then the site is built.
- The nginx stage copies only the built `dist` folder, from the build stage, into the folder nginx serves.

**`backend/.dockerignore` and `frontend/.dockerignore`** (.dockerignore tests)

- Each build context leaves out its build output, its installed packages if it has any, version control and local secret files.
- Each service is built from its own folder, so each folder needs its own `.dockerignore`; one at the top of `starter/` would not apply.

**`compose.yaml`, `.env` and `.gitignore`** (compose tests)

- A service named `api` built from `./backend`, and a database service from the `postgres:18` image.
- The database keeps its data in a named volume, declared at the top level, mounted where PostgreSQL 18 images keep data: `/var/lib/postgresql`.
- Every published port is bound to `127.0.0.1`, and the API publishes one.
- The API gets its datasource URL, username and password through `environment`. The URL reaches the database by its **service name** and **container port**, and names the same database the database service creates.
- Both services receive the same database password, and it never appears in `compose.yaml`: it comes from `${...}` interpolation filled by an existing `.env`, or from an `env_file`.
  Start from `fixtures/.env.example`: copy it to `starter/.env`.
  Its value is a clearly labelled, disposable local-development value; passing it through the environment is configuration wiring, not secret protection.
  Production systems use Compose secrets instead.
- Every local env file is listed in `.gitignore` and not tracked by Git.
- The database has a `healthcheck` that runs `pg_isready` against the configured user and database, and the API waits for it with `condition: service_healthy`.
- Optional: a `web` service built from `./frontend`. Any port it publishes must also be bound to `127.0.0.1`.

### Hints, if you are stuck

Open one hint at a time; each says a little more.

<details>
<summary>Back end: the dependency step</summary>

1. The Maven wrapper is `./mvnw`; it reads `.mvn/` and `pom.xml`, so copy all three before running it.
2. The goal that downloads everything a build needs is `dependency:go-offline`.
3. Packaging runs the same wrapper with the `package` phase; `-DskipTests` keeps the image build fast.

</details>

<details>
<summary>Back end: copying and starting the jar</summary>

1. The jar is created in `target/` inside the build stage's working directory, so its source path starts with that directory.
2. A wildcard such as `*.jar` is fine as the source if the destination is a file name.
3. The path after `-jar` must be the destination you copied to, either absolute or relative to the last stage's `WORKDIR`.

</details>

<details>
<summary>Front end: the nginx stage</summary>

1. The nginx image serves files from `/usr/share/nginx/html`.
2. Copy from the build stage, not from your folder: add `--from=` with the stage's name.
3. The source is `dist` inside the build stage's working directory.

</details>

<details>
<summary>Compose: the password and the env file</summary>

1. `${NAME}` in `compose.yaml` is filled from a `.env` file next to it, so `.env` must exist and set `NAME`.
2. Use the same variable for the API's `SPRING_DATASOURCE_PASSWORD` and the database's `POSTGRES_PASSWORD`.
3. Add `.env` to `.gitignore`. If Git already tracks it, `git rm --cached .env` stops tracking it and keeps the file.

</details>

<details>
<summary>Compose: the healthcheck</summary>

1. `pg_isready` takes the user with `-U` and the database with `-d`.
2. Inside a `CMD-SHELL` test, refer to the container's own variables, `POSTGRES_USER` and `POSTGRES_DB`.
3. Write `$$` before those names so Compose leaves them for the container to expand; a single `$` makes Compose look them up on your machine.

</details>

## Phase 4: test, interpret, retry, verify (about 15 minutes)

1. Run the tests (see "How to test").
2. For each `not ok` line, read the `error:` text below it.
   It names the file and the rule, not the line to type.
3. Change one thing, run the tests again, and watch that line turn to `ok`.
   If a different test starts failing, your change broke a neighbouring rule; read its message too.
4. When all 16 pass, verify your understanding: explain in one sentence each why the dependency step is cached, why the API uses the service name, and why the healthcheck uses `$$`.
   Then compare your result lines with `expected/solved-summary.txt`.

## How to test

From the lab's `tests` folder:

```sh
node --test --test-reporter=tap
```

The tests read `../starter` by default.
To check a copy of the project somewhere else, set `LAB_PROJECT` to its folder first, for example `LAB_PROJECT=../../my-shop node --test --test-reporter=tap` on macOS or Linux.

## Expected output

- The shipped starter fails every test; the result lines match `expected/starter-summary.txt`.
- A finished lab passes all 16; the result lines and the summary (`# tests 16`, `# pass 16`, `# fail 0`) match `expected/solved-summary.txt`.
  The `# duration_ms` line changes from run to run and is not part of the expected output.

## Offline note

Only `npm ci` in Setup uses the network.
The tests never use the network, the clock or your locale, and they never call a container engine.

## Cleanup

Delete `tests/node_modules` (created by `npm ci`) and `starter/.env` (your local password file).
The lab creates no database, image, container or volume.

## Troubleshooting

- **`Cannot find package 'yaml'`**: run `npm ci` in `tests` first.
- **A Compose test fails although the file looks right**: YAML indentation matters. Use spaces, not tabs, and indent each level by two spaces.
- **`.env is tracked by Git`**: run `git rm --cached .env` in the project folder, then commit; the file stays on your disk.
- **The URL test fails**: inside a container, `localhost` is that container itself, and the host port belongs to your laptop. Check the host name, the port and the database name.
- **The healthcheck test fails**: check that `-U` and `-d` are both there and use `$$`, or literals equal to the database service's settings.
