# Course intake: Containers & CI/CD

Course intake for `containers-cicd` (calendar technology `ops`, Standard days S36-S39 and Fast days FT21-FT23).
This intake ships manifests, the S39/FT23 module-check blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Frozen coverage matrix (read-only, firstmate data): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`), rows for course `containers-cicd`: the authoritative topic-string inventory and expected-artifact scope.
- Plan: approved PEP technology-content plan sections 2.3, 3, 4, 5, 6 (including 6.7 and approved Q4b), 7.1 and 11.
- Canonical terminal foundation: the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`, carried in this repository as `components/terminal@1` (form-free direct Run-button and Enter-key dispatch). Its behavior is captain-confirmed working in Evolv; that is platform success, not a captured DOM or console trace. This intake reuses it as is and does not re-derive it.
- Repository contracts on `main`: `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule), `docs/tools/evidence.md`, `schemas/`.

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| S36 | Containers and images | Lab | `/tracks/1/weeks/7/days/0` | 0. Containers and images (Docker and Podman); 1. Reading: image layers and build caching; 2. Multi-stage builds: back-end image, and front-end image built with Node and served with nginx; 3. Ports, volumes and environment variables |
| S37 | Compose and networking | Lab | `/tracks/1/weeks/7/days/1` | 0. Compose: the Spring Boot service and its database; 1. Service-name networking: why localhost fails between containers; 2. depends_on with health checks; 3. Debugging with logs and exec |
| S38 | Microservices with Compose | Lab | `/tracks/1/weeks/7/days/2` | 0. Monolith vs microservices: a database per service and the trade-offs; 1. Adding the FastAPI service and its database to Compose; 2. Service-to-service calls: tokens, timeouts and failed downstream calls; 3. Reading: SQL vs NoSQL, API gateways and service discovery |
| S39 | CI/CD and module check | Lab | `/tracks/1/weeks/7/days/3` | 0. A GitHub Actions pipeline: tests, then image builds; 1. Secrets in CI; 2. Reading (optional): Jenkins, registries, CD and Kubernetes; 3. Containers and CI/CD module check |
| FT21 | Containers and images + Compose and networking | Fast | `/tracks/2/weeks/4/days/0` | 0. Containers and images (Docker and Podman); 1. Ports, volumes and environment variables; 2. Multi-stage builds: back-end and front-end images; 3. Compose: the Spring Boot service and its database; 4. Service-name networking: why localhost fails between containers; 5. Image layers and build caching (skim); 6. Debugging with logs and exec (skim) |
| FT22 | Microservices with Compose | Fast | `/tracks/2/weeks/4/days/1` | 0. Health checks and depends_on; 1. Monolith vs microservices: a database per service and the trade-offs; 2. Adding the FastAPI service and its database to Compose; 3. Service-to-service calls: tokens, timeouts and failed downstream calls; 4. SQL vs NoSQL, API gateways and service discovery (skim) |
| FT23 | CI/CD and module check | Fast | `/tracks/2/weeks/4/days/2` | 0. A GitHub Actions pipeline: tests, then image builds; 1. Secrets in CI; 2. Reading (optional): Jenkins, registries, CD and Kubernetes; 3. Containers and CI/CD module check |

S39 and FT23 carry the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70). Fast days pack Standard days: FT21 = S36+S37, FT22 = S38 (plus the S37 health-check row), FT23 = S39. No day sets `requiredLab`.

## Module map

**Second-mate grouping decision, not syllabus** (closes category-A record `source-gap-containers-cicd-modules`). The calendar gives no module grouping or count for `ops`. Modules follow the Standard calendar day sequence, two Standard days each, and so match the Fast packing: FT21 is exactly S36+S37. Each module is the batch unit for one later authoring PR.

| Order | Module | Title | Standard days | Fast days | Topics |
|---|---|---|---|---|---|
| 1 | `containers-and-compose` | Containers and Compose | S36, S37 | FT21; FT22 row 0 | 8 |
| 2 | `microservices-and-ci-cd` | Microservices and CI/CD | S38, S39 | FT22 rows 1-4; FT23 rows 0-2 | 7 |

Alternatives considered: one module per day (four modules of 3-4 topics, below the usual 4-9 batch size, and S39 would hold only three topics), or one course-wide module (15 topics, too large for one author context). The FT22 row 0 health-check topic belongs to module 1 because its Standard row is S37; the Fast overlay will reference it from FT22.

## Topic list with relations

Topic ids are second-mate slugs chosen at intake (the matrix's proposed slugs are marked `pending-intake-proposed-slug`); seven are shortened from the matrix proposals for stable, readable paths: `multi-stage-builds`, `compose-spring-boot-and-database`, `service-name-networking`, `adding-fastapi-service-to-compose`, `service-to-service-calls`, `sql-nosql-gateways-and-discovery` and `github-actions-pipeline`. The slug change is recorded here so the Fast overlay and the matrix can be re-pointed.

| # | Topic | Module | Kind | Standard row | Fast row | Relation | Calendar strings |
|---|---|---|---|---|---|---|---|
| 1 | `containers-and-images` | `containers-and-compose` | core | S36 `/tracks/1/weeks/7/days/0/topics/0` | FT21 `/tracks/2/weeks/4/days/0/topics/0` | exact | S36: Containers and images (Docker and Podman)<br>FT21: Containers and images (Docker and Podman) |
| 2 | `image-layers-and-build-caching` | `containers-and-compose` | reading | S36 `/tracks/1/weeks/7/days/0/topics/1` | FT21 `/tracks/2/weeks/4/days/0/topics/5` | exact | S36: Reading: image layers and build caching<br>FT21: Image layers and build caching (skim) |
| 3 | `multi-stage-builds` | `containers-and-compose` | core | S36 `/tracks/1/weeks/7/days/0/topics/2` | FT21 `/tracks/2/weeks/4/days/0/topics/2` | exact | S36: Multi-stage builds: back-end image, and front-end image built with Node and served with nginx<br>FT21: Multi-stage builds: back-end and front-end images |
| 4 | `ports-volumes-and-environment-variables` | `containers-and-compose` | core | S36 `/tracks/1/weeks/7/days/0/topics/3` | FT21 `/tracks/2/weeks/4/days/0/topics/1` | exact | S36: Ports, volumes and environment variables<br>FT21: Ports, volumes and environment variables |
| 5 | `compose-spring-boot-and-database` | `containers-and-compose` | core | S37 `/tracks/1/weeks/7/days/1/topics/0` | FT21 `/tracks/2/weeks/4/days/0/topics/3` | exact | S37: Compose: the Spring Boot service and its database<br>FT21: Compose: the Spring Boot service and its database |
| 6 | `service-name-networking` | `containers-and-compose` | core | S37 `/tracks/1/weeks/7/days/1/topics/1` | FT21 `/tracks/2/weeks/4/days/0/topics/4` | exact | S37: Service-name networking: why localhost fails between containers<br>FT21: Service-name networking: why localhost fails between containers |
| 7 | `depends-on-with-health-checks` | `containers-and-compose` | core | S37 `/tracks/1/weeks/7/days/1/topics/2` | FT22 `/tracks/2/weeks/4/days/1/topics/0` | exact | S37: depends_on with health checks<br>FT22: Health checks and depends_on |
| 8 | `debugging-with-logs-and-exec` | `containers-and-compose` | core | S37 `/tracks/1/weeks/7/days/1/topics/3` | FT21 `/tracks/2/weeks/4/days/0/topics/6` | exact | S37: Debugging with logs and exec<br>FT21: Debugging with logs and exec (skim) |
| 9 | `monolith-vs-microservices` | `microservices-and-ci-cd` | core | S38 `/tracks/1/weeks/7/days/2/topics/0` | FT22 `/tracks/2/weeks/4/days/1/topics/1` | exact | S38: Monolith vs microservices: a database per service and the trade-offs<br>FT22: Monolith vs microservices: a database per service and the trade-offs |
| 10 | `adding-fastapi-service-to-compose` | `microservices-and-ci-cd` | core | S38 `/tracks/1/weeks/7/days/2/topics/1` | FT22 `/tracks/2/weeks/4/days/1/topics/2` | exact | S38: Adding the FastAPI service and its database to Compose<br>FT22: Adding the FastAPI service and its database to Compose |
| 11 | `service-to-service-calls` | `microservices-and-ci-cd` | core | S38 `/tracks/1/weeks/7/days/2/topics/2` | FT22 `/tracks/2/weeks/4/days/1/topics/3` | exact | S38: Service-to-service calls: tokens, timeouts and failed downstream calls<br>FT22: Service-to-service calls: tokens, timeouts and failed downstream calls |
| 12 | `sql-nosql-gateways-and-discovery` | `microservices-and-ci-cd` | reading | S38 `/tracks/1/weeks/7/days/2/topics/3` | FT22 `/tracks/2/weeks/4/days/1/topics/4` | exact | S38: Reading: SQL vs NoSQL, API gateways and service discovery<br>FT22: SQL vs NoSQL, API gateways and service discovery (skim) |
| 13 | `github-actions-pipeline` | `microservices-and-ci-cd` | core | S39 `/tracks/1/weeks/7/days/3/topics/0` | FT23 `/tracks/2/weeks/4/days/2/topics/0` | exact | S39: A GitHub Actions pipeline: tests, then image builds<br>FT23: A GitHub Actions pipeline: tests, then image builds |
| 14 | `secrets-in-ci` | `microservices-and-ci-cd` | core | S39 `/tracks/1/weeks/7/days/3/topics/1` | FT23 `/tracks/2/weeks/4/days/2/topics/1` | exact | S39: Secrets in CI<br>FT23: Secrets in CI |
| 15 | `jenkins-registries-cd-and-kubernetes` | `microservices-and-ci-cd` | reading | S39 `/tracks/1/weeks/7/days/3/topics/2` | FT23 `/tracks/2/weeks/4/days/2/topics/2` | exact | S39: Reading (optional): Jenkins, registries, CD and Kubernetes<br>FT23: Reading (optional): Jenkins, registries, CD and Kubernetes |

Relations:

- **exact** for every topic: each topic carries one mapping per track, and each calendar row maps to exactly one topic. No row is split and no row is shared, because every row names one teachable idea that fits one page within the 15-minute cap.
- Fast wording variants map to the same canonical topic (plan section 2.4): "Multi-stage builds: back-end and front-end images" and the longer Standard wording; "Health checks and depends_on" and "depends_on with health checks". `(skim)` rows (image layers, debugging, SQL vs NoSQL) are track emphasis for the Fast overlay, not separate pages.
- `Reading:` and `Reading (optional):` rows are kind `reading`; the optional status is track metadata for the overlay.
- S39 row 3 and FT23 row 3 "Containers and CI/CD module check" map to the course blueprint `containers-cicd/assessments/containers-cicd-module-check`, never to a learner topic (matrix `assessmentRef` scope `course`). No review row exists in this slice, so the intake adds no review page.
- 15 calendar rows per track (30 strings) become 15 topics plus one blueprint; plan section 2.3 counts 16 rows including the module check.

Prerequisites: in-course prerequisites are exact `<course>/<module>/<topic>` references. Course 1 topic ids exist, so `git-linux-ai-foundations` topics are named exactly. Other courses (`sql-jdbc-foundations`, `spring-boot`, `python`, `react`, `html-css-js`) have no topic ids yet and are named by course id only.

### Objectives

- `containers-cicd/containers-and-compose/containers-and-images`
  - o1: Tell an image (a read-only, layered template) from a container (a running or stopped instance created from an image) in a described scenario
  - o2: Predict what a given docker run or podman run command does: which image it starts, the container name, and the effect of -d and --rm
  - o3: Explain that Podman runs the same OCI images without a background daemon and accepts the same core build, run, ps and images commands used in this course
- `containers-cicd/containers-and-compose/image-layers-and-build-caching`
  - o1: Explain that RUN, COPY and ADD instructions each add an image layer and that a changed step invalidates the build cache for every later step
  - o2: Reorder a Dockerfile so dependency files are copied and installed before application source, and predict which steps rebuild after a source-only change
  - o3: Use a .dockerignore file to keep build output, version-control folders and local secret files out of the build context
- `containers-cicd/containers-and-compose/multi-stage-builds`
  - o1: Write a two-stage Dockerfile for the Spring Boot back end that builds the jar in a JDK stage and copies only the jar into a JRE runtime stage
  - o2: Write a two-stage Dockerfile for the front end that builds static files with Node and serves only the build output with nginx
  - o3: Explain how COPY --from keeps compilers, package caches and source files out of the final image, and why that makes the image smaller
- `containers-cicd/containers-and-compose/ports-volumes-and-environment-variables`
  - o1: Publish a container port with -p HOST:CONTAINER and predict which host URL reaches the service
  - o2: Choose a named volume for database data and a bind mount for source files you edit, and predict what survives removing the container
  - o3: Pass configuration into a container with -e or --env-file instead of writing the values into the image
- `containers-cicd/containers-and-compose/compose-spring-boot-and-database`
  - o1: Write a compose.yaml with a Spring Boot service built from its Dockerfile and a PostgreSQL service whose data lives in a named volume
  - o2: Give the Spring Boot service its datasource URL, username and password through environment variables in compose.yaml, with the password kept out of the file
  - o3: Start, inspect and stop the stack with docker compose up -d, ps and down, and state what down -v removes in addition
- `containers-cicd/containers-and-compose/service-name-networking`
  - o1: Explain why localhost inside a container refers to that container itself, not to the host or to another service
  - o2: Write a connection URL that reaches another Compose service by its service name and container port
  - o3: Tell the published host port used from a browser on the host apart from the container port one service uses to reach another
- `containers-cicd/containers-and-compose/depends-on-with-health-checks`
  - o1: Explain that depends_on on its own only orders container start and does not wait until the dependency is ready
  - o2: Add a healthcheck to the database service and depends_on with condition: service_healthy to the service that needs it
  - o3: Read the health state in docker compose ps output to tell a starting, healthy and unhealthy service apart
- `containers-cicd/containers-and-compose/debugging-with-logs-and-exec`
  - o1: Use docker compose logs with a service name, and -f to follow, to find why a service exited
  - o2: Use docker compose exec to run a command inside a running service container, such as printing its environment
  - o3: Choose logs, exec or ps as the first check for a given symptom: an exited container, wrong configuration or an unreachable service
- `containers-cicd/microservices-and-ci-cd/monolith-vs-microservices`
  - o1: Compare a monolith and microservices on deployment, scaling and failure isolation for a described system
  - o2: Explain the database-per-service pattern and why one service must not read another service's tables directly
  - o3: Name a cost that microservices add for a given design, such as network failures, consistency across services or operational overhead
- `containers-cicd/microservices-and-ci-cd/adding-fastapi-service-to-compose`
  - o1: Add a FastAPI service built from its own Dockerfile and its own database service to the existing compose.yaml
  - o2: Configure the FastAPI service's database URL with environment variables that name its own database service
  - o3: Explain why the server inside the container must listen on 0.0.0.0 rather than 127.0.0.1 for a published or service-to-service port to work
- `containers-cicd/microservices-and-ci-cd/service-to-service-calls`
  - o1: Forward a bearer token in the Authorization header on a call from one service to another, with the token taken from the incoming request or configuration rather than hard-coded
  - o2: Set connect and read timeouts on an outgoing HTTP call and predict what the caller does without them when the downstream service hangs
  - o3: Turn a failed or timed-out downstream call into a clear error response, such as 502, 503 or 504, instead of a hang or an unhandled exception
- `containers-cicd/microservices-and-ci-cd/sql-nosql-gateways-and-discovery`
  - o1: Contrast a relational (SQL) store with document and key-value (NoSQL) stores for a described data need
  - o2: Explain what an API gateway does for clients that use several services
  - o3: Explain service discovery and relate it to how Compose resolves service names
- `containers-cicd/microservices-and-ci-cd/github-actions-pipeline`
  - o1: Read a workflow file and identify its trigger (on), jobs, runner (runs-on) and steps
  - o2: Write a workflow in which a test job runs first and an image-build job runs only after it succeeds, using needs
  - o3: Explain what actions/checkout and docker/build-push-action do in the build job, and when an image is only built versus also pushed
- `containers-cicd/microservices-and-ci-cd/secrets-in-ci`
  - o1: Reference a repository secret as ${{ secrets.NAME }} in a workflow instead of writing the credential into the file
  - o2: Explain that GitHub redacts secret values in logs, and why a workflow run triggered from a fork does not receive repository secrets
  - o3: Restrict the GITHUB_TOKEN with a permissions block to the least access the workflow needs
- `containers-cicd/microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes`
  - o1: Compare a declarative Jenkinsfile pipeline with a GitHub Actions workflow: stages and steps versus jobs and steps
  - o2: Explain what a container registry stores and read an image reference as registry, repository and tag
  - o3: Describe what a Kubernetes Deployment and Service do with a pushed image, and how continuous delivery differs from continuous deployment

## Artifact applicability

Scope follows the frozen matrix rows (`expectedArtifacts`): every topic requires a topic page (`artifact.html`), its text alternative (`artifact.md`), an in-page simulator, and a practice quiz (`artifact.gift`); a video when a suitable verified one exists; a print handout (`artifact.pdf`) for the two `Reading:` rows; and a Standard lab overlay for each day S36-S39, met by the two module labs below. The matrix gives the optional S39 reading no print handout, so its PDF is recorded not applicable.

Legend: **R** required, authored in the module PR; **V** required when a suitable, live, public, embeddable video within budget exists, otherwise absent with the search record; **M** practised in the planned module lab; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `containers-and-compose/containers-and-images` | core | R | R | - | R | V | - |
| `containers-and-compose/image-layers-and-build-caching` | reading | R | R | R | R | V | M |
| `containers-and-compose/multi-stage-builds` | core | R | R | - | R | V | M |
| `containers-and-compose/ports-volumes-and-environment-variables` | core | R | R | - | R | V | M |
| `containers-and-compose/compose-spring-boot-and-database` | core | R | R | - | R | V | M |
| `containers-and-compose/service-name-networking` | core | R | R | - | R | V | M |
| `containers-and-compose/depends-on-with-health-checks` | core | R | R | - | R | V | M |
| `containers-and-compose/debugging-with-logs-and-exec` | core | R | R | - | R | V | - |
| `microservices-and-ci-cd/monolith-vs-microservices` | core | R | R | - | R | V | - |
| `microservices-and-ci-cd/adding-fastapi-service-to-compose` | core | R | R | - | R | V | M |
| `microservices-and-ci-cd/service-to-service-calls` | core | R | R | - | R | V | - |
| `microservices-and-ci-cd/sql-nosql-gateways-and-discovery` | reading | R | R | R | R | V | - |
| `microservices-and-ci-cd/github-actions-pipeline` | core | R | R | - | R | V | M |
| `microservices-and-ci-cd/secrets-in-ci` | core | R | R | - | R | V | M |
| `microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes` | reading | R | R | - | R | V | - |

Simulators: every page's simulator is an honest HTML model of real tool output (Dockerfile build steps and cache hits, `docker`/`podman` and `docker compose` command output, Compose start order and health states, workflow run graphs). Any terminal interaction uses `components/terminal@1` unchanged. Simulators never claim to run a real engine.

## Lab plan

Approved Q4b: daemon-free validation of learner-written Dockerfile, Compose and workflow files plus honest HTML simulators. No engine-based learner lab and no learner-side container engine, for setup or tests (`docs/lab-contract.md` section 4). Standard and Fast share this one tree: Standard requires these labs through its lab overlay; Fast does not require them and moves to direct project implementation.

| Lab | Scope | Standard overlay | Covers | Learner-written files validated | Test command |
|---|---|---|---|---|---|
| `containers-cicd/containers-and-compose/coding-lab` | module | S36, S37 (required); Fast not required | `image-layers-and-build-caching`, `multi-stage-builds`, `ports-volumes-and-environment-variables`, `compose-spring-boot-and-database`, `service-name-networking`, `depends-on-with-health-checks` | `backend/Dockerfile`, `frontend/Dockerfile`, `.dockerignore`, `compose.yaml` | `node --test` |
| `containers-cicd/microservices-and-ci-cd/coding-lab` | module | S38, S39 (required); Fast not required | `adding-fastapi-service-to-compose`, `github-actions-pipeline`, `secrets-in-ci` | `compose.yaml` (extended), `fastapi/Dockerfile`, `.github/workflows/ci.yml` | `node --test` |

- Language and command: JavaScript on Node.js 24, `node --test` (the lab contract's JavaScript example). One-time offline-capable setup `npm ci` installs one pinned YAML parser with its committed lockfile; the test command then runs fully offline. The public tests parse the learner's files as text and YAML and check stated rules (for example: named stages and `COPY --from`; dependency manifests copied before source; `.dockerignore` entries; a named volume for database data; credentials read from `${VAR}` interpolation or `env_file`, not literals; connection URLs that use a service name, not `localhost`; a database `healthcheck` with `depends_on` `condition: service_healthy`; a test job and a build job with `needs`; `${{ secrets.NAME }}` references and a `permissions` block). They never build images, start containers or call a daemon.
- Starters fail the named public tests with stable messages; no solutions or hidden tests are committed; the solved-run record follows `docs/lab-contract.md` section 10.
- Topics with no lab (`containers-and-images`, `debugging-with-logs-and-exec`, `monolith-vs-microservices`, `service-to-service-calls`, `sql-nosql-gateways-and-discovery`, `jenkins-registries-cd-and-kubernetes`) record `lab: none` with a reason: they need a running engine, servers or a cluster, or they are conceptual, so the page simulator gives the honest practice. The educational critic confirms each omission.
- `module.json` `moduleLabs` stays empty and topics record `lab: module:<module>` until the module PR adds the lab directory, so no manifest names a file that does not exist.
- The S39/FT23 coding part of the module check is likewise daemon-free (a Compose-file edit), so no assessment needs an engine.

## Minute budgets

Rule: the revised new-course rule merged on `main` (`docs/tools/validators.md`, section Reading time): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15 minutes, with no weighted day-pool shares and no compression. Course 1's `legacy-label:` basis is not used.

No page exists at intake, so the estimator cannot run. Each `modeledP50` is the planned estimator P50 target for the page and each `modeledWorstPath` the planned worst required route (two wrong graded attempts per interactive unit and wrong-first explores before settling). Planning basis: course-1 core pages measured estimator P50 5-8 minutes with worst routes up to about 9.4; these topics carry denser command and file syntax, so core pages plan P50 7-9 and worst 10-12, and readings plan P50 6-7 and worst 8-9. `budget` = `aboutLabel` = `ceil(max(P50, worst))`. The module PR replaces `modeledP50` with the frozen estimator's P50 on the authored bytes, re-models the worst path and raises the budget if the measured minimum is higher; T14 then enforces it.

| Topic | Days | Planned P50 | Planned worst path | Budget = about-label |
|---|---|---|---|---|
| `containers-and-images` | S36, FT21 | 8 | 11 | 11 |
| `image-layers-and-build-caching` | S36, FT21 | 6 | 8 | 8 |
| `multi-stage-builds` | S36, FT21 | 9 | 12 | 12 |
| `ports-volumes-and-environment-variables` | S36, FT21 | 9 | 12 | 12 |
| `compose-spring-boot-and-database` | S37, FT21 | 8 | 11 | 11 |
| `service-name-networking` | S37, FT21 | 7 | 10 | 10 |
| `depends-on-with-health-checks` | S37, FT22 | 7 | 10 | 10 |
| `debugging-with-logs-and-exec` | S37, FT21 | 7 | 10 | 10 |
| `monolith-vs-microservices` | S38, FT22 | 7 | 10 | 10 |
| `adding-fastapi-service-to-compose` | S38, FT22 | 7 | 10 | 10 |
| `service-to-service-calls` | S38, FT22 | 9 | 12 | 12 |
| `sql-nosql-gateways-and-discovery` | S38, FT22 | 7 | 9 | 9 |
| `github-actions-pipeline` | S39, FT23 | 9 | 12 | 12 |
| `secrets-in-ci` | S39, FT23 | 7 | 10 | 10 |
| `jenkins-registries-cd-and-kubernetes` | S39, FT23 | 7 | 9 | 9 |

Day totals against the 120-minute day (T14 sums each topic budget on every day it maps to): S36: 43; S37: 41; S38: 41; S39: 31; FT21: 74; FT22: 51; FT23: 31. All fit; the Lab and Fast day blocks keep the rest of the day for the guided lab or project, the without-AI block and the reflection.

## S39/FT23 assessment blueprint

`containers-cicd/assessments/containers-cicd-module-check/blueprint.json`, one course-level blueprint shared by Standard S39 and Fast FT23:

- Calendar identity copied verbatim from the snapshot S39 and FT23 `assessment` objects (identical): `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. `dayId` holds the Standard day `S39`, the schema's single day field; the instructions name both days. The calendar gives no weights or cut scores for a module check, so `weights` is empty.
- Objectives covered: a representative set across both modules that the 9 items can directly elicit, mapped in `objectiveFormats`. The optional reading is not assessed.

  - `containers-cicd/containers-and-compose/containers-and-images#o1` (MCQ)
  - `containers-cicd/containers-and-compose/image-layers-and-build-caching#o2` (MCQ)
  - `containers-cicd/containers-and-compose/ports-volumes-and-environment-variables#o1` (MCQ)
  - `containers-cicd/containers-and-compose/debugging-with-logs-and-exec#o3` (MCQ)
  - `containers-cicd/microservices-and-ci-cd/monolith-vs-microservices#o2` (MCQ)
  - `containers-cicd/microservices-and-ci-cd/service-to-service-calls#o2` (MCQ)
  - `containers-cicd/microservices-and-ci-cd/github-actions-pipeline#o2` (MCQ)
  - `containers-cicd/microservices-and-ci-cd/secrets-in-ci#o1` (MCQ)
  - `containers-cicd/containers-and-compose/service-name-networking#o2` (coding)
  - `containers-cicd/containers-and-compose/depends-on-with-health-checks#o2` (coding)

- Proposed item counts and duration, consistent with both calendar days, neither of which has a dedicated module-check block:
  - Standard S39 (Lab day): MCQ in the Warm-up quiz block (8 minutes) and coding in the "Redo one step without AI" coding-assessment block (10 minutes).
  - Fast FT23 (Fast day): MCQ in the "Try-first diagnostic" MCQ-and-coding block (15 minutes) and coding in the "Timed, without AI" coding-assessment block (15 minutes). The Fast Warm-up quiz block (5 minutes) is too short for the shared MCQ part.
  - MCQ: 8 items in 8 minutes, about 1 minute per scenario item, one item per MCQ objective. coding: 1 Compose-file task in 10 minutes covering the two coding objectives. `durationMinutes` 18 = 8 + 10, which fits the smaller Standard blocks and leaves Fast slack.
  - Where each part is scheduled on the platform is the platform assessment owner's call; this is the intake proposal for critic review.
- Allowed resources: the no-AI rule applies only to the coding part, because only the calendar's "Redo one step without AI" (S39) and "Timed, without AI" (FT23) blocks state it. The coding part needs only a text editor and no container engine. Any further resource rule is set and shown by the platform assessment owner; the repository invents no assessment policy.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; T01 and T07 check its key names.

## Official sources per topic

Closes category-A record `source-gap-containers-cicd-official-evidence`. Every source below was fetched live on 2026-10-12 with `curl -L`; `evidence/containers-cicd/source-snapshot.json` records each final URL with its retrieval time, the sha256 of the fetched bytes and the topic sections used. All 84 sources returned HTTP 200 and each page title was checked against the expected document. Raw fetched pages are not committed.

Source classes: official product documentation and references (Docker, Podman, Compose, GitHub, Spring, FastAPI, HTTPX, Vite, nginx, PostgreSQL, Jenkins, Kubernetes), open specifications (OCI image, runtime and distribution specs, the Compose Specification, IETF RFCs 6750 and 9110), and vendor architecture guidance (Microsoft Azure Architecture Center). For the microservices and gateway patterns, `microservices.io` (the pattern catalogue's author) and the Lewis and Fowler article are the primary sources of those pattern definitions and are listed as such, alongside the Azure guidance.

Version note: these are the current published documents (Docker Docs and Compose Specification `main`, Spring Boot current reference, PostgreSQL `current`, Kubernetes current docs). The module PR records the tool versions its pages demonstrate.

Redirects recorded: `https://learn.microsoft.com/en-us/azure/architecture/data-guide/big-data/non-relational-data` now resolves to `.../data-guide/technology-choices/understand-data-store-models`; `https://docs.github.com/en/actions/concepts/use-cases/deploying-with-github-actions` now resolves to `.../actions/how-tos/deploy/configure-and-manage-deployments/control-deployments`. The snapshot stores the final URLs.

Gaps: `https://www.uvicorn.org/settings/` (Uvicorn `--host` default) did not resolve from this host (DNS failure) and is not in the snapshot; `adding-fastapi-service-to-compose` o3 rests on the FastAPI CLI documentation instead, and the module PR re-attempts the Uvicorn source. The Docker Hub pages (`nginx`, `postgres`) are rendered client-side; their fetched bytes contain the documented environment variables and usage sections but the module PR re-checks them in a browser.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; the module PR's SME criticism verifies each claim against live official documentation and writes per-topic `sources.json` receipts.

| Topic | Official first-party sources |
|---|---|
| `containers-and-images` | https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/<br>https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/<br>https://docs.docker.com/reference/cli/docker/container/run/<br>https://docs.podman.io/en/latest/index.html<br>https://docs.podman.io/en/latest/Introduction.html<br>https://docs.podman.io/en/latest/markdown/podman-run.1.html<br>https://github.com/opencontainers/image-spec/blob/main/spec.md<br>https://github.com/opencontainers/runtime-spec/blob/main/spec.md |
| `image-layers-and-build-caching` | https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/<br>https://docs.docker.com/build/cache/<br>https://docs.docker.com/build/cache/invalidation/<br>https://docs.docker.com/build/cache/optimize/<br>https://docs.docker.com/build/concepts/context/<br>https://docs.docker.com/reference/dockerfile/ |
| `multi-stage-builds` | https://docs.docker.com/build/building/multi-stage/<br>https://docs.docker.com/build/building/best-practices/<br>https://docs.docker.com/reference/dockerfile/<br>https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html<br>https://docs.podman.io/en/latest/markdown/podman-build.1.html<br>https://vite.dev/guide/build.html<br>https://nginx.org/en/docs/beginners_guide.html<br>https://hub.docker.com/_/nginx |
| `ports-volumes-and-environment-variables` | https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/<br>https://docs.docker.com/engine/network/port-publishing/<br>https://docs.docker.com/engine/storage/volumes/<br>https://docs.docker.com/engine/storage/bind-mounts/<br>https://docs.docker.com/get-started/docker-concepts/running-containers/overriding-container-defaults/<br>https://docs.docker.com/reference/cli/docker/container/run/ |
| `compose-spring-boot-and-database` | https://docs.docker.com/compose/<br>https://docs.docker.com/reference/compose-file/services/<br>https://docs.docker.com/reference/compose-file/volumes/<br>https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/<br>https://github.com/compose-spec/compose-spec/blob/main/spec.md<br>https://docs.spring.io/spring-boot/reference/features/external-config.html<br>https://hub.docker.com/_/postgres |
| `service-name-networking` | https://docs.docker.com/compose/how-tos/networking/<br>https://docs.docker.com/engine/network/<br>https://docs.docker.com/engine/network/port-publishing/ |
| `depends-on-with-health-checks` | https://docs.docker.com/compose/how-tos/startup-order/<br>https://docs.docker.com/reference/compose-file/services/<br>https://docs.docker.com/reference/dockerfile/<br>https://docs.docker.com/reference/cli/docker/compose/ps/<br>https://www.postgresql.org/docs/current/app-pg-isready.html<br>https://docs.spring.io/spring-boot/reference/actuator/endpoints.html |
| `debugging-with-logs-and-exec` | https://docs.docker.com/reference/cli/docker/compose/logs/<br>https://docs.docker.com/reference/cli/docker/compose/exec/<br>https://docs.docker.com/reference/cli/docker/compose/ps/<br>https://docs.docker.com/reference/cli/docker/container/logs/<br>https://docs.docker.com/reference/cli/docker/container/exec/<br>https://docs.podman.io/en/latest/markdown/podman-logs.1.html<br>https://docs.podman.io/en/latest/markdown/podman-exec.1.html |
| `monolith-vs-microservices` | https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices<br>https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations<br>https://microservices.io/patterns/data/database-per-service.html<br>https://martinfowler.com/articles/microservices.html |
| `adding-fastapi-service-to-compose` | https://fastapi.tiangolo.com/deployment/docker/<br>https://fastapi.tiangolo.com/fastapi-cli/<br>https://fastapi.tiangolo.com/advanced/settings/<br>https://docs.docker.com/reference/compose-file/services/<br>https://docs.docker.com/compose/how-tos/networking/<br>https://hub.docker.com/_/postgres |
| `service-to-service-calls` | https://www.rfc-editor.org/rfc/rfc6750.html<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://www.python-httpx.org/advanced/timeouts/<br>https://docs.spring.io/spring-framework/reference/integration/rest-clients.html<br>https://learn.microsoft.com/en-us/azure/architecture/patterns/retry<br>https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker |
| `sql-nosql-gateways-and-discovery` | https://learn.microsoft.com/en-us/azure/architecture/data-guide/technology-choices/understand-data-store-models (requested https://learn.microsoft.com/en-us/azure/architecture/data-guide/big-data/non-relational-data)<br>https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway<br>https://microservices.io/patterns/apigateway.html<br>https://microservices.io/patterns/server-side-discovery.html<br>https://microservices.io/patterns/client-side-discovery.html<br>https://docs.docker.com/compose/how-tos/networking/ |
| `github-actions-pipeline` | https://docs.github.com/en/actions/get-started/understand-github-actions<br>https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax<br>https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs<br>https://github.com/actions/checkout<br>https://github.com/docker/build-push-action<br>https://docs.docker.com/build/ci/github-actions/ |
| `secrets-in-ci` | https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets<br>https://docs.github.com/en/actions/reference/security/secrets<br>https://docs.github.com/en/actions/reference/security/secure-use<br>https://docs.github.com/en/actions/concepts/security/github_token<br>https://docs.docker.com/build/ci/github-actions/secrets/<br>https://docs.docker.com/build/building/secrets/ |
| `jenkins-registries-cd-and-kubernetes` | https://www.jenkins.io/doc/book/pipeline/<br>https://www.jenkins.io/doc/book/pipeline/jenkinsfile/<br>https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry<br>https://docs.docker.com/docker-hub/repos/<br>https://github.com/opencontainers/distribution-spec/blob/main/spec.md<br>https://kubernetes.io/docs/concepts/overview/<br>https://kubernetes.io/docs/concepts/workloads/controllers/deployment/<br>https://kubernetes.io/docs/concepts/services-networking/service/<br>https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments (requested https://docs.github.com/en/actions/concepts/use-cases/deploying-with-github-actions) |

Calendar references for the `ops` technology (snapshot `technologies` entry): [Docker: get started](https://docs.docker.com/get-started/), [Podman documentation](https://docs.podman.io/), [GitHub Actions](https://docs.github.com/en/actions). The snapshot pins the specific pages under them.

## Intake criticism

Pending. The manifests, objectives, blueprint and this intake receive fresh, independent educational and technology-SME criticism on the committed bytes, followed by non-author reconciliation; the author does not approve its own first output. The critic reports, rechecks and reconciliation are committed here as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`, and accepted findings are applied in one correction loop.
