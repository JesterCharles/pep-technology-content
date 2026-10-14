# Multi-stage builds: back-end and front-end images

## Objectives

- Write a two-stage Dockerfile for the Spring Boot back end that builds the jar in a JDK stage and copies only the jar into a JRE runtime stage
- Write a two-stage Dockerfile for the front end that builds static files with Node and serves only the build output with nginx
- Explain how COPY --from keeps compilers, package caches and source files out of the final image, and why that makes the image smaller

## Teaching

### Start with a guess

Practice prediction, not scored.

### Build in one stage, run in another

Every `FROM` starts a new stage. `FROM eclipse-temurin:25-jdk AS build` names the first stage `build`; it has the JDK to compile and package.

The last stage becomes the image. Start it from a smaller JRE image and copy in only the jar with `COPY --from=build`, which reads from the named stage instead of your folder.

`ENTRYPOINT` sets the command the container runs; `RUN` runs only while building.

### Front end: Node builds, nginx serves

The front end needs Node only to build. `npm run build` (Vite) writes plain HTML, CSS and JavaScript into `dist`.

The final stage starts `FROM nginx:alpine`, a web server that serves files from `/usr/share/nginx/html`. Copy only `dist` there; Node, `node_modules` and the source stay behind.

### Why the final image is smaller

A stage left behind adds nothing to the image. Only the final stage's base layers and what you copy into it ship.

Multi-stage back-end build: what ships Two Dockerfile stages: the project goes into stage build; only the jar is copied into the final stage. The caption below describes every part. Project folder mvnw, pom.xml, src/ JDK + Maven wrapper compile and package Maven cache downloaded dependencies target/*.jar the built jar app.jar ENTRYPOINT java -jar Java runtime (JRE) from the base image COPY go-offline package COPY --from=build Stage build: eclipse-temurin:25-jdk (left behind) Final stage: eclipse-temurin:25-jre (the image)

Diagram in words: the project folder (mvnw, `pom.xml`, `src/`) is copied into stage build on `eclipse-temurin:25-jdk`. There the JDK and Maven wrapper fill the Maven cache and package `target/*.jar`. Only that jar crosses, with `COPY --from=build`, into the final stage on `eclipse-temurin:25-jre`, as `app.jar`. The JDK, cache and source stay behind.

So compilers, package caches and source files never reach production: a smaller download, fewer tools for an attacker, and the same running app.

### Apply it: find the leak

Look at what the last stage copies.

## Model

Two stages; only the last one ships (contents, not sizes)

### Stage build (JDK)

- Not chosen yet

### Final stage: the image

- Not chosen yet

Left behind: everything in stage build that is not copied.

## Recap

- Each `FROM` starts a stage; `AS build` names it; the last stage is the image.
- Back end: JDK stage packages the jar; JRE stage copies only the jar.
- Front end: Node stage runs `npm run build`; nginx stage copies only `dist`.
- `COPY --from` picks exactly what ships, so tools and source stay out.

Next topic: Ports, volumes and environment variables

## Cheat sheet

```
# backend/Dockerfile
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -q dependency:go-offline
COPY src ./src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```
# frontend/Dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

Podman builds the same file with `podman build`.

## Sources

Checked against these live official sources on 2026-10-13. Versions shown: Docker Engine 29, eclipse-temurin 25, node:24-alpine, nginx:alpine, Spring Boot 4.1 with the Maven wrapper, Vite. The model compares image contents, not measured sizes.

- Docker Docs: Multi-stage builds (AS names, COPY --from)
- Docker Docs: Building best practices (use multi-stage builds)
- Dockerfile reference: FROM ... AS, COPY --from, ENTRYPOINT
- Spring Boot reference: Dockerfiles
- Vite guide: Building for production (output in dist)
- Docker Hub: nginx official image (static content in /usr/share/nginx/html)
- Docker Hub: eclipse-temurin official image (25-jdk, 25-jre tags)
- Podman documentation: podman build

## Static interaction alternatives

### predict

Prediction (practice, not scored): a one-stage image FROM eclipse-temurin:25-jdk copies the project and packages the jar. Answer: the JDK, the Maven download cache, the source and the jar all end up in the image, because everything a single stage creates ships. Not only the jar; not just a runtime and the jar (that needs a second stage); not only source.

### explore

Activity: complete the back-end Dockerfile. Stage 1: FROM eclipse-temurin:25-jdk AS build, WORKDIR /app, copy mvnw, pom.xml and .mvn, RUN ./mvnw -q dependency:go-offline, COPY src ./src, RUN ./mvnw -q package -DskipTests. Stage 2: FROM eclipse-temurin:25-jre, WORKDIR /app, COPY --from=build /app/target/*.jar app.jar, ENTRYPOINT ["java", "-jar", "app.jar"]. Copying /app or the whole folder would ship the source and caches; RUN java -jar would run during the build instead of when the container starts.

### explore

Activity: complete the front-end Dockerfile. Stage 1: FROM node:24-alpine AS build, WORKDIR /app, COPY package.json package-lock.json ./, RUN npm ci, COPY . ., RUN npm run build. Stage 2: FROM nginx:alpine, COPY --from=build /app/dist /usr/share/nginx/html. npm run dev starts a development server instead of writing dist; copying /app would ship node_modules and source; COPY dist without --from reads your own folder, not the build stage.

### explore

Activity: which items are in the final back-end image? Inside: the Java runtime (JRE), from the final stage base, and the application jar, copied with COPY --from. Left behind in the build stage: the JDK compiler and tools, the Maven download cache and the Java source.

### mcq

Apply question: the last stage is FROM eclipse-temurin:25-jre, COPY --from=build /app /app, ENTRYPOINT java -jar /app/target/app.jar, and the image still has the source and Maven cache. Answer: COPY --from=build /app /app copies the whole build folder, so the source and cache ship. The JDK in stage 1 is left behind; the JRE base is right; ENTRYPOINT only starts the jar. Retry as a fix: copy only the jar with COPY --from=build /app/target/*.jar app.jar (and start app.jar).
