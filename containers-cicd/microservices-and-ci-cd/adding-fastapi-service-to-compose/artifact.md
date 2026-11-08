# Adding the FastAPI service and its database to Compose

## Objectives

- Add a FastAPI service built from its own Dockerfile and its own database service to the existing compose.yaml
- Configure the FastAPI service's database URL with environment variables that name its own database service
- Explain why the server inside the container must listen on 0.0.0.0 rather than 127.0.0.1 for a published or service-to-service port to work

## Teaching

A server inside a container is listening on `127.0.0.1:8000`. The Compose file publishes that port to your laptop:

`ports: ["127.0.0.1:8000:8000"]`

You run `curl http://127.0.0.1:8000` on your laptop.

Each service is built from its own Dockerfile, and its database is a second Compose service. Here is the shape for a different service, `notifier`:

```
  notifier:
    build: ./notifier
    environment:
      DATABASE_URL: postgresql://mail:${MAIL_PW}@notifier-db:5432/mail
  notifier-db:
    image: postgres:18
    environment:
      POSTGRES_DB: mail
      POSTGRES_USER: mail
      POSTGRES_PASSWORD: ${MAIL_PW}
    volumes:
      - notifier-data:/var/lib/postgresql
```

The URL host is its own database’s service name. `${...}` reads a disposable local value from an untracked `.env`; that is wiring, not secret protection.

`127.0.0.1` accepts connections only from inside the same container. `0.0.0.0` accepts them on every interface. So a FastAPI image starts with `fastapi run`, which listens on `0.0.0.0`; `fastapi dev` uses `127.0.0.1`.

```
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]
```

Do not confuse this with `127.0.0.1:8000:8000` under `ports`. That limits which laptop addresses are published. The bind address inside the container is a separate setting.

You start the stack, and the `reports` logs show this:

`could not connect to server at "localhost", port 5432: Connection refused`

Its setting is `DATABASE_URL: postgresql://reports:${REPORTS_DB_PASSWORD}@localhost:5432/reports`.

## Recap

You finished 0 of 4 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- A new service gets its own `build`, its own database service and its own named volume.
- Its database URL names its own database service, with passwords from `${...}`.
- A server in a container must listen on `0.0.0.0` for other containers or a published port to reach it.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Where to act: Start under the `TODO` in `services`, indented like `api` and `db`.

Next step: Copy the shape of the notifier example, then change every name that belongs to that other service.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Look at the host part of `DATABASE_URL`.

Next step: Inside a container, ask which name reaches the other container that holds this service’s data.

Printed alternative: Add a reports service built from ./reports and a reports-db service using postgres:18. Point the reports database URL at its own database by service name, take the password from an environment reference, and give the database a named, declared volume. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

Where to act: Set the Caller to the api service first.

Next step: That call arrives from another container, so ask which listening address accepts it.

Printed alternative: Listening on 127.0.0.1: only a shell inside the container connects; the laptop and the api service fail. Listening on 0.0.0.0: all three connect.

Reading without JavaScript: decide first, then read on.

Optional time: about 4 minutes

Success criteria: Add a health check to reports-db, and make reports wait for it with depends_on and condition: service_healthy, using what you learned in the health-check topic.

- `fastapi run` listens on 0.0.0.0; `fastapi dev` listens on 127.0.0.1.
- In a container, `localhost` means that container.
- Local `.env` values are disposable wiring. Production uses a real secret store.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Compose services: build, environment, ports, volumes
- Compose top-level volumes
- postgres official image: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
- Networking in Compose: reaching a service by its name
- FastAPI in Containers: Dockerfile and CMD with fastapi run
- FastAPI CLI: fastapi run listens on 0.0.0.0, fastapi dev on 127.0.0.1
- FastAPI Settings and Environment Variables

## Static interaction alternatives

### predict

What does the curl get? Each option is explained after the question in this reading.

### terminal

Add a reports service built from ./reports and a reports-db service using postgres:18. Point the reports database URL at its own database by service name, take the password from an environment reference, and give the database a named, declared volume. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

### explore

Listening on 127.0.0.1: only a shell inside the container connects; the laptop and the api service fail. Listening on 0.0.0.0: all three connect.

### mcq

What is the right fix? Each option is explained after the question in this reading.
