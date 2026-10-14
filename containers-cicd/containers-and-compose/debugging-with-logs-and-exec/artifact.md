# Debugging with logs and exec

## Objectives

- Use docker compose logs with a service name, and -f to follow, to find why a service exited
- Use docker compose exec to run a command inside a running service container, such as printing its environment
- Choose logs, exec or ps as the first check for a given symptom: an exited container, wrong configuration or an unreachable service

## Teaching

### Start with a guess

Practice prediction, not scored.

### ps for state, logs for the reason

`docker compose ps` lists running containers; add `-a` to see exited ones and their exit codes.

`docker compose logs api` prints what the `api` service wrote to its output, even after it exited. The last lines usually name the error. `-f` keeps following new lines until you press Ctrl+C.

### exec: look inside a running container

`docker compose exec SERVICE COMMAND` runs a command inside that service's running container, for example `printenv NAME` to see the value a setting really has.

An exited container cannot run commands: use logs for it. Print one named variable rather than the whole environment, so passwords stay off your screen.

### Pick the first check

Exited: read its logs. Running but misconfigured: exec to check the value. Not reachable: ps to see whether it runs and which ports it publishes.

### Apply it: a stale page

Is the container running? Then decide.

## Model

The shop stack right now (simulated)

### api

State unknown

### db

Running (healthy)

Findings: none yet.

## Recap

- `docker compose ps -a` shows state and exit codes, including exited containers.
- `docker compose logs SERVICE` shows why it failed; `-f` follows new lines.
- `docker compose exec SERVICE COMMAND` checks inside a running container.
- Exited: logs. Wrong setting: exec. Unreachable: ps.

Module finished. Next module: Microservices and CI/CD.

## Cheat sheet

|  |  |
| --- | --- |
| `docker compose ps -a` | all containers with state |
| `docker compose logs api` | output of one service |
| `docker compose logs -f --tail 50 api` | last 50 lines, then follow |
| `docker compose exec db printenv POSTGRES_USER` | one value inside a running container |
| `podman logs`, `podman exec` | the same checks with Podman |

## Sources

Checked against these live official sources on 2026-10-14. Versions shown: Docker Compose 5.6, PostgreSQL 18, Spring Boot 4.1. Log lines and errors are simulated and shortened; real Spring Boot and PostgreSQL logs are longer.

- Docker CLI reference: docker compose logs (-f, --tail)
- Docker CLI reference: docker compose exec
- Docker CLI reference: docker compose ps (--all)
- Docker CLI reference: docker container logs
- Docker CLI reference: docker container exec
- Podman documentation: podman logs
- Podman documentation: podman exec

## Static interaction alternatives

### predict

Prediction (practice, not scored): after docker compose up -d the API does not answer and docker compose ps lists only shop-db-1. Answer: the API container most likely started and exited; docker compose ps shows only running containers, and docker compose ps -a would list it as Exited. Running containers are not hidden; Compose did create it; Compose does not use --rm for services.

### terminal

Terminal activity: docker compose ps lists only shop-db-1. docker compose ps -a also lists shop-api-1 with STATUS Exited (1). docker compose logs api ends with FATAL: password authentication failed for user "shop" and the application failing to start, which is why it exited.

### terminal

Terminal activity: docker compose exec api printenv SPRING_DATASOURCE_USERNAME fails with service "api" is not running, because exec needs a running container. docker compose exec db printenv POSTGRES_USER prints app: the database was created for user app while the API logs in as shop, so the configuration is wrong.

### explore

Activity: first check per symptom. The api container exited just after start: logs, because the reason is in its output and exec cannot enter an exited container. A running service seems to use the wrong setting: exec, to print the value inside the container. The browser cannot reach localhost:8080: ps, to see whether the service runs and which ports it publishes.

### mcq

Apply question: web runs but shows an old page; you suspect old files in /usr/share/nginx/html. First check: list that folder inside the running container with exec, docker compose exec web ls /usr/share/nginx/html. Logs show requests, not which files are present; ps only confirms it runs, which you already know; down -v deletes volumes and checks nothing.
