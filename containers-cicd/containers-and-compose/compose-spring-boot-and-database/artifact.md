# Compose: the Spring Boot service and its database

## Objectives

- Write a compose.yaml with a Spring Boot service built from its Dockerfile and a PostgreSQL service whose data lives in a named volume
- Give the Spring Boot service its datasource URL, username and password through environment variables in compose.yaml, with the password kept out of the file
- Start, inspect and stop the stack with docker compose up -d, ps and down, and state what down -v removes in addition

## Teaching

### Start with a guess

Practice prediction, not scored.

### One file describes the stack

`compose.yaml` lists services. `build: ./backend` builds the API from its Dockerfile; `image: postgres:18` uses a ready image. `ports` and `volumes` work like `-p` and `-v`; a named volume is also declared under the top-level `volumes:`.

`environment` sets variables. Spring Boot reads `SPRING_DATASOURCE_URL`, `_USERNAME` and `_PASSWORD`. Write `${DB_PASSWORD}` and Compose fills it from a `.env` file beside `compose.yaml`, listed in `.gitignore`.

This disposable value only wires local development; production uses Compose secrets.

### Up, ps, down

- `docker compose up -d` builds missing images, creates a network, the volume and the containers, and starts them in the background.
- `docker compose ps` lists the stack's containers.
- `docker compose down` stops and removes the containers and network. Named volumes stay, so the data stays.
- `docker compose down -v` also removes the named volumes: the data is gone.

### Apply it: reset the database

Which command removes the data on purpose?

## Model

Project shop: what Compose creates (simulated)

### Containers

- None yet

### Network and volume

- None yet

Nothing created yet.

## Recap

- Services: the API with `build`, PostgreSQL with `image`; data in a declared named volume; ports on `127.0.0.1`.
- Datasource settings through `environment`; the password as `${DB_PASSWORD}` from an untracked `.env`.
- `up -d` starts, `ps` lists, `down` removes containers and network, `down -v` also deletes named volumes.

Next topic: Service-name networking

## Cheat sheet

```
services:
  api:
    build: ./backend
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shop
      SPRING_DATASOURCE_USERNAME: shop
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
  db:
    image: postgres:18
    environment:
      POSTGRES_DB: shop
      POSTGRES_USER: shop
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql
volumes:
  pgdata:
```

`.env` (in `.gitignore`): `DB_PASSWORD=dev-only-1`, a disposable local value.

## Sources

Checked against these live official sources on 2026-10-13. Versions shown: Docker Compose 5.6 (the docker compose plugin), Docker Engine 29, PostgreSQL 18, Spring Boot 4.1. The project folder is called shop, so names start with shop. Output is simulated and shortened.

- Docker Docs: Docker Compose overview
- Compose file reference: services (build, image, ports, environment, volumes)
- Compose file reference: top-level volumes
- Docker Docs: Set environment variables in containers (interpolation, .env)
- Docker CLI reference: docker compose up
- Docker CLI reference: docker compose down (-v)
- Docker Docs: Manage secrets securely in Docker Compose
- Compose Specification
- Spring Boot reference: Externalized configuration (environment variables)
- Docker Hub: postgres official image (POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_DB)

## Static interaction alternatives

### predict

Prediction (practice, not scored): a stack with an API and PostgreSQL storing data in a named volume; docker compose down, then docker compose up -d. Answer: yes, the rows are still there, because down removes containers and the network but keeps named volumes. down -v would delete them; the data lives in the database volume, not the API container; rebuilding images does not matter.

### explore

Activity: complete compose.yaml. api: build: ./backend; ports: "127.0.0.1:8080:8080"; environment SPRING_DATASOURCE_URL jdbc:postgresql://db:5432/shop, SPRING_DATASOURCE_USERNAME shop, SPRING_DATASOURCE_PASSWORD ${DB_PASSWORD}. db: image: postgres:18; environment POSTGRES_DB shop, POSTGRES_USER shop, POSTGRES_PASSWORD ${DB_PASSWORD}; volumes - pgdata:/var/lib/postgresql. Top level: volumes: pgdata:. Wrong choices: image: ./backend (image names a ready image, not a folder); "8080:8080" (every host address); a literal password in the file; no volume (data lost with the container).

### terminal

Terminal activity in the shop folder: docker compose up -d builds the api image, creates network shop_default, volume shop_pgdata and containers shop-db-1 and shop-api-1, and starts them. docker compose ps lists both as Up. docker compose down removes the containers and the network; docker volume ls still lists shop_pgdata. docker compose down -v also removes the volume; docker volume ls no longer lists it.

### mcq

Apply question: to get an empty database, run docker compose down -v, then docker compose up -d. -v removes the named volume pgdata, so PostgreSQL starts empty. Plain down keeps the volume; up -d twice changes nothing; ps only lists. Retry: the single command that deletes the pgdata volume is docker compose down -v.
