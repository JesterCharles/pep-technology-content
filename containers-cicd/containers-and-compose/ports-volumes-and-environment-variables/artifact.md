# Ports, volumes and environment variables

## Objectives

- Publish a container port with -p and predict who can reach it: 8080:80 listens on every host address, while 127.0.0.1:8080:80 is reachable only from the local machine, the default for development
- Choose a named volume for database data and a bind mount for source files you edit, and predict what survives removing the container
- Pass configuration into a container with -e or --env-file instead of writing the values into the image

## Teaching

### Start with a guess

Practice prediction, not scored.

### Publish a port, and choose who can reach it

`-p HOST:CONTAINER` forwards a port on your machine to a port inside the container. `-p 8080:80` sends `localhost:8080` to nginx's port 80.

Without an address, Docker listens on every host address, so other machines on your network may reach it too. `-p 127.0.0.1:8080:80` listens only on loopback: this machine only. Use that for development.

### Where data lives

Files written inside a container vanish when the container is removed.

- A named volume (`-v pgdata:/var/lib/postgresql`) is storage Docker manages. It outlives any container: right for database data.
- A bind mount (`-v ./site:/usr/share/nginx/html`) shows a folder from your machine inside the container: right for files you edit.

### Configuration comes from outside

`-e NAME=value` sets an environment variable in the container; `--env-file .env` reads many `NAME=value` lines from a file.

Do not write settings or passwords into the image with `ENV`: anyone with the image can read them, and changing one needs a rebuild. Keep `.env` out of Git and out of the image.

### Apply it: one database command

Check each flag in turn.

## Model

Your laptop and one container (simulated)

### Published ports

- None

### Who can connect

- Nobody yet: nothing is published

### Storage

- Only the container's own writable layer

### Environment

- Image defaults only

## Recap

- `-p 8080:80` listens on every host address; `-p 127.0.0.1:8080:80` on this machine only, the development default.
- Named volume for database data, bind mount for files you edit. Both survive removing the container.
- Pass configuration with `-e` or `--env-file`, never baked into the image.

Next topic: Compose: the Spring Boot service and its database

## Cheat sheet

|  |  |
| --- | --- |
| `-p 127.0.0.1:8080:80` | host port 8080, this machine only, to container port 80 |
| `-v pgdata:/var/lib/postgresql` | named volume for PostgreSQL 18 data |
| `-v ./site:/usr/share/nginx/html` | bind mount a folder you edit |
| `-e NAME=value` | one environment variable |
| `--env-file .env` | variables from a file kept out of Git |
| `docker volume ls` | list volumes |

## Sources

Checked against these live official sources on 2026-10-13. Versions shown: Docker Engine 29 with nginx:alpine and alpine images. Output is simulated and shortened where marked. Whether another machine can really connect also depends on its network and the host firewall.

- Docker Docs: Publishing and exposing ports
- Docker Docs: Port publishing and mapping (publishing is insecure by default; 127.0.0.1)
- Docker Docs: Volumes (a volume outlives its container)
- Docker Docs: Bind mounts
- Docker Docs: Overriding container defaults (-e, --env-file)
- Docker CLI reference: docker container run (-p, -v, -e, --env-file)

## Static interaction alternatives

### predict

Prediction (practice, not scored): docker run -d -p 8080:80 nginx:alpine on a laptop on café Wi-Fi; someone else opens port 8080 at the laptop address, with no firewall in the way. Answer: they see the nginx page, because -p without an address listens on every host address. Docker does not limit it to localhost by default; they do not reach their own machine; published ports are reachable from outside unless bound to 127.0.0.1.

### terminal

Terminal activity: docker run -d --name web -p 127.0.0.1:8080:80 nginx:alpine publishes container port 80 on host port 8080 for this machine only. docker ps shows PORTS 127.0.0.1:8080->80/tcp. curl http://localhost:8080 returns the nginx welcome page. With -p 8080:80, docker ps shows 0.0.0.0:8080->80/tcp and [::]:8080->80/tcp: every host address. Publishing a host port that is already in use fails with port is already allocated.

### explore

Activity: choose storage. PostgreSQL data files: a named volume, which Docker manages and keeps after the container is removed. Front-end source you edit: a bind mount of your project folder. Scratch files nobody needs later: no mount, the container layer is enough. After docker rm -f, the named volume and the bind-mounted folder survive; files only in the container layer are gone.

### terminal

Terminal activity: docker run --rm -e APP_MODE=dev alpine env prints the container environment, including APP_MODE=dev. cat .env shows two lines, APP_MODE=dev and DB_PASSWORD=dev-only-1, a disposable local value. docker run --rm --env-file .env alpine env prints both variables inside the container. Nothing was written into an image.

### mcq

Apply question: docker run -d --name db --env-file .env -v pgdata:/var/lib/postgresql -p 127.0.0.1:5432:5432 postgres:18, add rows, docker rm -f db, run it again. Answer: the rows are still there because they live in the named volume pgdata, which outlives containers. The port is bound to 127.0.0.1, so only this machine can reach it; the password came from .env at run time and is not stored in the image. Retry as two facts: data kept in pgdata, reachable from this machine only.
