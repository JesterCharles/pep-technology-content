# Containers and images (Docker and Podman)

## Objectives

- Tell an image (a read-only, layered template) from a container (a running or stopped instance created from an image) in a described scenario
- Predict what a given docker run or podman run command does: which image it starts, the container name, and the effect of -d and --rm
- Explain that Podman runs the same OCI images, is daemonless on Linux but on macOS and Windows runs containers inside a Linux virtual machine started with podman machine, and accepts the same core build, run, ps and images commands used in this course

## Teaching

### Start with a guess

Practice prediction, not scored.

### Image: template. Container: instance.

An image is a read-only, layered template: files, settings and a start command. It never changes once built.

A container is one instance of an image, with its own thin writable layer. Running or stopped, it exists until you remove it.

`docker run IMAGE` creates a new container every time; `docker ps` lists running ones.

### Three run flags

- `--name web` names it; otherwise Docker invents a name. Names are unique.
- `-d` (detached) runs it in the background and prints its ID.
- `--rm` removes the container when its main process exits. Without it, the container stays as `Exited`.

`docker ps` shows running containers; `docker ps -a` adds stopped ones. Removing a container never removes its image.

### Podman runs the same images

Docker and Podman follow the open OCI standards, so they run the same images. On Linux, Podman is daemonless: no background service.

On macOS and Windows, Podman runs containers inside a Linux virtual machine: `podman machine init` creates it, `podman machine start` starts it.

Core commands match: `podman build`, `run`, `ps`, `images`. A full image name such as `docker.io/library/nginx:alpine` avoids a registry prompt.

### Apply it to a new command

Read each flag, then decide.

## Model

Your machine (simulated): images and the containers made from them

### Images: read-only templates

- `nginx:alpine`
- `hello-world:latest`

### Containers: instances

- None yet.

Both images are already downloaded, so nothing is pulled in this practice.

## Recap

- Image: read-only template. Container: a running or stopped instance. One image, many containers.
- `--name` names it, `-d` runs it in the background, `--rm` deletes the container, never the image, on exit.
- Podman runs the same OCI images and core commands: daemonless on Linux, a `podman machine` VM on macOS and Windows.

Next topic: Reading: image layers and build caching

## Cheat sheet

|  |  |
| --- | --- |
| `docker run -d --name web nginx:alpine` | new background container named web |
| `docker run --rm IMAGE` | remove the container when it exits |
| `docker ps` / `docker ps -a` | running / all containers |
| `docker stop web` / `docker rm web` | stop / remove a container |
| `podman machine init`, `podman machine start` | create and start the Linux VM (macOS, Windows) |
| `podman run`, `ps`, `images`, `build` | same core commands as Docker |

**Another way to think about it (optional example).** A traveller’s hair dryer only works on the electricity supply back home. In a country with a different supply, they plug a small converter box into the wall and plug the dryer into the converter. The dryer is unchanged; it simply runs on the supply the converter provides.

Containers need a Linux kernel, so macOS and Windows provide one inside a small Linux virtual machine, and the same images run there unchanged.

## Sources

Checked against these live official sources on 2026-10-13. Versions shown: Docker Engine 29 and Podman 6 (the course compatibility baseline). Terminal output is simulated and shortened where marked; IDs, times and some message wording differ on a real machine.

- Docker Docs: What is a container?
- Docker Docs: What is an image?
- Docker CLI reference: docker container run (-d, --rm, --name)
- Docker CLI reference: docker container ls (docker ps, -a)
- Podman documentation: What is Podman?
- Podman documentation: podman machine
- Podman documentation: podman machine start
- Podman documentation: podman run
- OCI Image Format Specification

## Static interaction alternatives

### predict

Prediction (practice, not scored): you run docker run -d nginx:alpine three times. Answer: one image and three containers. Each docker run creates a new container from the same read-only image; the image is not copied. It is not three images, not one container restarted, and not one container.

### terminal

Terminal activity: start two named background containers from nginx:alpine, then list them. Worked example: docker run -d --name web1 nginx:alpine prints a long container ID; docker run -d --name web2 nginx:alpine prints another; docker ps lists web1 and web2, both with IMAGE nginx:alpine and STATUS Up. Reusing a name fails with a Conflict error because names must be unique.

### terminal

Terminal activity: hello-world prints a message and exits. docker run hello-world prints Hello from Docker!; docker ps -a then lists that container with STATUS Exited (0). docker run --rm hello-world prints the same message, but docker ps -a shows no new container, because --rm removed it when it exited. The hello-world image stays in both cases.

### terminal

Terminal activity on a simulated Mac: podman run fails until the Linux VM exists and is running. podman machine init creates it; podman machine start starts it; podman run -d --name web docker.io/library/nginx:alpine prints a container ID; podman ps lists web with STATUS Up.

### mcq

Apply question: docker run -d --rm --name api shop-api:1.0, then the main process exits. Answer: the image shop-api:1.0 stays and the container api is removed, because --rm removes the container when it exits and never removes the image. Not both removed (images are kept); not Exited in docker ps -a (that would need no --rm); not image removed (removing a container never removes its image). Retry as listings: docker ps -a has no api row and the image list still has shop-api:1.0.
