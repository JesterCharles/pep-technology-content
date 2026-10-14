# Lab: containerise the shop and describe it with Compose

## Goal

Write the files that package the shop and run it as one Compose stack:

- `backend/Dockerfile`: a two-stage build for the Spring Boot API;
- `frontend/Dockerfile`: a two-stage build for the Vite front end, served by nginx;
- `backend/.dockerignore` and `frontend/.dockerignore`;
- `compose.yaml`, plus one line in `.gitignore`.

Public tests check each file against the rules taught in this module.
They read your files as text and YAML.
Nothing in this lab builds an image, starts a container or needs Docker, Podman or any other container engine.

This lab belongs to Standard days S36 and S37.
It practises these topics, so finish their pages first: image layers and build caching, multi-stage builds, ports, volumes and environment variables, Compose with Spring Boot and its database, service-name networking, and depends_on with health checks.

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

`npm ci` installs one pinned YAML parser (`yaml` 2.8.1) from `tests/package-lock.json` into `tests/node_modules`.
After that, the tests run fully offline.

## Steps

You edit only files inside `starter/`.
Each step names the rule the tests check.

1. **Run the tests once** (see "How to test").
   All 16 fail; each message says what is missing.

2. **Back end: `backend/Dockerfile`** (multi-stage builds; image layers and build caching)
   - A first stage `FROM eclipse-temurin:25-jdk AS build`.
   - In it: `WORKDIR /app`, copy `mvnw`, `pom.xml` and `.mvn`, run `./mvnw -q dependency:go-offline`, and only then `COPY src ./src` and `RUN ./mvnw -q package -DskipTests`.
     The dependency download stays cached when only source changes.
   - A last stage `FROM eclipse-temurin:25-jre` that copies only the jar: `COPY --from=build /app/target/*.jar app.jar`.
   - Start it with `ENTRYPOINT ["java", "-jar", "app.jar"]`.

3. **Front end: `frontend/Dockerfile`** (multi-stage builds)
   - A first stage `FROM node:24-alpine AS build` with `WORKDIR /app`.
   - `COPY package.json package-lock.json ./`, then `RUN npm ci`, then `COPY . .`, then `RUN npm run build`.
   - A last stage `FROM nginx:alpine` that copies only the build output: `COPY --from=build /app/dist /usr/share/nginx/html`.

4. **Build contexts: the two `.dockerignore` files** (image layers and build caching)
   Each service is built from its own folder, so each folder needs its own `.dockerignore`.
   A `.dockerignore` at the top of `starter/` would not apply to them.
   - `backend/.dockerignore`: `target`, `.git` and `.env`.
   - `frontend/.dockerignore`: `node_modules`, `dist`, `.git` and `.env`.

5. **The stack: `compose.yaml` and `.gitignore`** (Compose; ports, volumes and environment variables; service-name networking; depends_on with health checks)
   - Copy `fixtures/.env.example` to `starter/.env`.
     It holds `DB_PASSWORD=dev-only-1`, a clearly labelled, disposable local-development value.
     Passing it through an environment variable is configuration wiring, not secret protection; production systems use Compose secrets instead.
   - Add `.env` to `starter/.gitignore`. A test fails if `.env` is not ignored, or if Git already tracks it.
   - A service `api` with `build: ./backend`, published only on this machine: `"127.0.0.1:8080:8080"`.
   - Its `environment`: `SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shop` (the service name `db`, never `localhost`), `SPRING_DATASOURCE_USERNAME: shop` and `SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}`.
   - A service `db` with `image: postgres:18`, `POSTGRES_DB: shop`, `POSTGRES_USER: shop` and `POSTGRES_PASSWORD: ${DB_PASSWORD}`.
     Never write the password itself into `compose.yaml`.
   - The database data in a named volume: `pgdata:/var/lib/postgresql` under `db`, and `pgdata:` under a top-level `volumes:` key.
     PostgreSQL 18 images keep their data under `/var/lib/postgresql`.
   - A `healthcheck` on `db` whose test runs `pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}`, and on `api` a `depends_on` entry for `db` with `condition: service_healthy`.
   - Optional: a `web` service with `build: ./frontend`. Any port it publishes must also name `127.0.0.1`.

6. **Run the tests again** until all 16 pass.

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
- **The URL test fails**: inside a container, `localhost` is that container itself. Use the database service name and its container port, `db:5432`.
- **The volume test fails**: mount the volume at `/var/lib/postgresql` exactly, and declare the volume name under the top-level `volumes:` key.
