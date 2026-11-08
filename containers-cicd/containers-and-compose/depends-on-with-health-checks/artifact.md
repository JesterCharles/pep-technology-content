# depends\_on with health checks

## Objectives

- Explain that depends\_on on its own only orders container start and does not wait until the dependency is ready
- Add a healthcheck to the database service and depends\_on with condition: service\_healthy to the service that needs it
- Read the health state in docker compose ps output to tell a starting, healthy and unhealthy service apart

## Teaching

### Start with a guess

Practice prediction, not scored.

### Started is not ready

`depends_on: [db]` makes Compose create and start `db` before `api`. It waits only until the db container is running.

PostgreSQL then needs a few seconds to initialise before it accepts connections. An API that connects at startup can hit a refused connection and exit.

### Wait for healthy

A `healthcheck` runs a test command inside the container. For PostgreSQL, `pg_isready` exits 0 once the server accepts connections.

Then `depends_on` with `condition: service_healthy` makes Compose wait until `db` is healthy before starting `api`. Write `$$` in the test so the container, not Compose, expands the variable.

### Read the health state

With a healthcheck, `docker compose ps` adds a state to STATUS: `(health: starting)` until a check passes, `(healthy)` after one passes, `(unhealthy)` after `retries` failures in a row.

### Apply it: a stuck start

Read the health state first.

## Model

Startup timeline after docker compose up (simulated)

Not started yet.

Configuration: not chosen.

## Recap

- `depends_on` alone orders start; it does not wait for ready.
- Add a `healthcheck` to `db` and `condition: service_healthy` to the service that needs it.
- `ps` shows `health: starting`, `healthy` or `unhealthy`.

Next topic: Debugging with logs and exec

## Cheat sheet

```
services:
  api:
    build: ./backend
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:18
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
```

## Sources

Checked against these live official sources on 2026-10-14. Versions shown: Docker Compose 5.6, PostgreSQL 18, Spring Boot 4.1. Timings and log lines are simulated and shortened.

- Docker Docs: Control startup and shutdown order in Compose
- Compose file reference: depends_on and healthcheck
- Dockerfile reference: HEALTHCHECK (starting, healthy, unhealthy)
- Docker CLI reference: docker compose ps
- PostgreSQL documentation: pg_isready (exit status 0 when accepting connections)
- Spring Boot reference: Actuator endpoints (health)

## Static interaction alternatives

### predict

Prediction (practice, not scored): api has depends_on: [db] and no healthcheck. Answer: Compose starts api as soon as the db container is running, not when PostgreSQL is ready. Without a healthcheck it has no way to know readiness; there is no fixed wait; and depends_on does order the start, so not in parallel.

### explore

Activity: compare startup timelines. Plain depends_on: db container starts at 0 s; api starts at 1 s while PostgreSQL is still initialising; the API logs Connection to db:5432 refused and exits with code 1. With a pg_isready healthcheck and condition: service_healthy: db starts at 0 s with health: starting; the check passes at about 6 s and db is healthy; only then api starts and connects.

### terminal

Editor activity: complete compose.yaml. db healthcheck test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"] with interval 10s, timeout 5s, retries 5, start_period 30s. api depends_on: db: condition: service_healthy. A single $ lets Compose fill the variable from your machine; service_started does not wait for healthy; the short form depends_on: [db] only waits for running.

### explore

Activity: read docker compose ps STATUS. Up 4 seconds (health: starting): no check has passed yet. Up 41 seconds (healthy): a check passed. Up 3 minutes (unhealthy): the check failed retries times in a row; the container still runs.

### mcq

Apply question: docker compose up -d fails with dependency failed to start: container shop-db-1 is unhealthy. Answer: the db healthcheck kept failing, so Compose never started api, which waits for service_healthy. It is not a build failure, depends_on is present (that is why it waited), and the API never started. Retry: check docker compose ps for db health and then the db logs; removing the healthcheck hides the problem; ports do not affect the check.
