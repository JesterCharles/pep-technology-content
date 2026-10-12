# Course intake: Containers & CI/CD

Course intake for `containers-cicd` (calendar technology `ops`, Standard days S36-S39 and Fast days FT21-FT23).
This intake ships manifests, the S39/FT23 module-check blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Frozen coverage matrix (read-only, firstmate data): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`), rows for course `containers-cicd`: the authoritative topic-string inventory and expected-artifact scope.
- Plan: approved PEP technology-content plan sections 2.3, 3, 4, 5, 6 (including 6.7 and approved Q4b), 7.1 and 11.
- Canonical terminal foundation: the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`, carried in this repository as `components/terminal@1` (form-free direct Run-button and Enter-key dispatch). Its behavior is captain-confirmed working in Evolv; that is platform success, not a captured DOM or console trace. This intake reuses it as is and does not re-derive it.
- Repository contracts on `main`: `authoring/docs/workflow.md`, `authoring/docs/html-artifact-contract.md`, `authoring/docs/lab-contract.md`, `authoring/docs/tools/validators.md` (new-course budget rule), `authoring/docs/tools/evidence.md`, `authoring/schemas/`.

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
| 2 | `microservices-and-ci-cd` | Microservices and CI/CD | S38, S39 | FT22 rows 1-4; FT23 rows 0-2 | 8 |

Alternatives considered: one module per day (four modules of 3-4 topics, below the usual 4-9 batch size, and S39 would hold only three topics), or one course-wide module (15 topics, too large for one author context). The FT22 row 0 health-check topic belongs to module 1 because its Standard row is S37; the Fast overlay will reference it from FT22.

## Topic list with relations

Topic ids are second-mate slugs chosen at intake (the matrix's proposed slugs are marked `pending-intake-proposed-slug`); six are shortened from the matrix proposals for stable, readable paths (`multi-stage-builds`, `compose-spring-boot-and-database`, `service-name-networking`, `adding-fastapi-service-to-compose`, `service-to-service-calls`, `github-actions-pipeline`), and the matrix's single `sql-vs-nosql-api-gateways-and-service-discovery` proposal becomes the split pair `sql-vs-nosql` and `api-gateways-and-service-discovery`. The slug change is recorded here so the Fast overlay and the matrix can be re-pointed.

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
| 12 | `sql-vs-nosql` | `microservices-and-ci-cd` | reading | S38 `/tracks/1/weeks/7/days/2/topics/3` | FT22 `/tracks/2/weeks/4/days/1/topics/4` | split | S38: Reading: SQL vs NoSQL, API gateways and service discovery<br>FT22: SQL vs NoSQL, API gateways and service discovery (skim) |
| 13 | `api-gateways-and-service-discovery` | `microservices-and-ci-cd` | reading | S38 `/tracks/1/weeks/7/days/2/topics/3` | FT22 `/tracks/2/weeks/4/days/1/topics/4` | split | S38: Reading: SQL vs NoSQL, API gateways and service discovery<br>FT22: SQL vs NoSQL, API gateways and service discovery (skim) |
| 14 | `github-actions-pipeline` | `microservices-and-ci-cd` | core | S39 `/tracks/1/weeks/7/days/3/topics/0` | FT23 `/tracks/2/weeks/4/days/2/topics/0` | exact | S39: A GitHub Actions pipeline: tests, then image builds<br>FT23: A GitHub Actions pipeline: tests, then image builds |
| 15 | `secrets-in-ci` | `microservices-and-ci-cd` | core | S39 `/tracks/1/weeks/7/days/3/topics/1` | FT23 `/tracks/2/weeks/4/days/2/topics/1` | exact | S39: Secrets in CI<br>FT23: Secrets in CI |
| 16 | `jenkins-registries-cd-and-kubernetes` | `microservices-and-ci-cd` | reading | S39 `/tracks/1/weeks/7/days/3/topics/2` | FT23 `/tracks/2/weeks/4/days/2/topics/2` | exact | S39: Reading (optional): Jenkins, registries, CD and Kubernetes<br>FT23: Reading (optional): Jenkins, registries, CD and Kubernetes |

Relations:

- **split** S38 row 3 `/tracks/1/weeks/7/days/2/topics/3` "Reading: SQL vs NoSQL, API gateways and service discovery" and its Fast variant FT22 row 4 `/tracks/2/weeks/4/days/1/topics/4`: `sql-vs-nosql` (data-store choice) and `api-gateways-and-service-discovery` (gateway routing and service discovery). The row names two separate decisions, and one page cannot build both models honestly (intake reconciliation education-01). The frozen row is unchanged and no concept is added or removed.
- **exact** for every other topic: each carries one mapping per track and each of those calendar rows maps to exactly one topic. No row is shared.
- Fast wording variants map to the same canonical topic (plan section 2.4): "Multi-stage builds: back-end and front-end images" and the longer Standard wording; "Health checks and depends_on" and "depends_on with health checks". `(skim)` rows (image layers, debugging, SQL vs NoSQL) are track emphasis for the Fast overlay, not separate pages.
- `Reading:` and `Reading (optional):` rows are kind `reading`; the optional status is track metadata for the overlay.
- S39 row 3 and FT23 row 3 "Containers and CI/CD module check" map to the course blueprint `containers-cicd/assessments/containers-cicd-module-check`, never to a learner topic (matrix `assessmentRef` scope `course`). No review row exists in this slice, so the intake adds no review page.
- 15 calendar rows per track (30 strings) become 16 topics (one split) plus one blueprint; plan section 2.3 counts 16 rows including the module check.

Prerequisites: in-course prerequisites are exact `<course>/<module>/<topic>` references. Course 1 topic ids exist, so `git-linux-ai-foundations` topics are named exactly. Other courses (`sql-jdbc-foundations`, `spring-boot`, `python`, `react`, `html-css-js`) have no topic ids yet and are named by course id only.

### Objectives

- `containers-cicd/containers-and-compose/containers-and-images`
  - o1: Tell an image (a read-only, layered template) from a container (a running or stopped instance created from an image) in a described scenario
  - o2: Predict what a given docker run or podman run command does: which image it starts, the container name, and the effect of -d and --rm
  - o3: Explain that Podman runs the same OCI images, is daemonless on Linux but on macOS and Windows runs containers inside a Linux virtual machine started with podman machine, and accepts the same core build, run, ps and images commands used in this course
- `containers-cicd/containers-and-compose/image-layers-and-build-caching`
  - o1: Explain that RUN, COPY and ADD instructions each add an image layer and that a changed step invalidates the build cache for every later step
  - o2: Reorder a Dockerfile so dependency files are copied and installed before application source, and predict which steps rebuild after a source-only change
  - o3: Use a .dockerignore file to keep build output, version-control folders and local secret files out of the build context
- `containers-cicd/containers-and-compose/multi-stage-builds`
  - o1: Write a two-stage Dockerfile for the Spring Boot back end that builds the jar in a JDK stage and copies only the jar into a JRE runtime stage
  - o2: Write a two-stage Dockerfile for the front end that builds static files with Node and serves only the build output with nginx
  - o3: Explain how COPY --from keeps compilers, package caches and source files out of the final image, and why that makes the image smaller
- `containers-cicd/containers-and-compose/ports-volumes-and-environment-variables`
  - o1: Publish a container port with -p and predict who can reach it: 8080:80 listens on every host address, while 127.0.0.1:8080:80 is reachable only from the local machine, the default for development
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
  - o2: Set explicit connect and read timeouts on an outgoing call with HTTPX in the FastAPI service and with Spring's RestClient, and compare them with each client's documented default and with timeouts deliberately disabled when the downstream service hangs
  - o3: Turn a failed or timed-out downstream call into a clear error response, such as 502, 503 or 504, instead of a hang or an unhandled exception
- `containers-cicd/microservices-and-ci-cd/sql-vs-nosql`
  - o1: Contrast a relational (SQL) store with document and key-value (NoSQL) stores on schema, querying and consistency
  - o2: Choose a store type for a described service's data and justify the choice from its access pattern
  - o3: Explain how database-per-service lets two services use different store types
- `containers-cicd/microservices-and-ci-cd/api-gateways-and-service-discovery`
  - o1: Explain what an API gateway does for clients that use several services: one entry point, routing, and shared concerns such as authentication
  - o2: Explain service discovery and tell client-side discovery from server-side discovery
  - o3: Relate Compose's service-name DNS resolution to service discovery
- `containers-cicd/microservices-and-ci-cd/github-actions-pipeline`
  - o1: Read a workflow file and identify its trigger (on), jobs, runner (runs-on) and steps
  - o2: Write a workflow in which a test job runs first and an image-build job runs only after it succeeds, using needs
  - o3: Explain what actions/checkout and docker/build-push-action do in the build job, and when an image is only built versus also pushed
- `containers-cicd/microservices-and-ci-cd/secrets-in-ci`
  - o1: Reference a repository secret as ${{ secrets.NAME }} in a workflow instead of writing the credential into the file
  - o2: Explain that GitHub attempts to redact registered secrets in logs but that redaction is not a permission boundary, so a workflow never prints a secret and masks other sensitive values with add-mask, and that a run triggered from a fork receives no repository secrets (GITHUB_TOKEN excepted)
  - o3: Restrict the GITHUB_TOKEN with a permissions block to the least access the workflow needs
- `containers-cicd/microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes`
  - o1: Compare a declarative Jenkinsfile pipeline with a GitHub Actions workflow: stages and steps versus jobs and steps
  - o2: Explain what a container registry stores and read an image reference as registry, repository and tag
  - o3: Describe what a Kubernetes Deployment and Service do with a pushed image, and how continuous delivery differs from continuous deployment

## Artifact applicability

Scope follows the frozen matrix rows (`expectedArtifacts`): every topic requires a topic page (`artifact.html`), its text alternative (`artifact.md`), an in-page simulator, and a practice quiz (`artifact.gift`); a video when a suitable verified one exists; a print handout (`artifact.pdf`) for the two `Reading:` rows, which is three pages because S38 row 3 is split; and a Standard lab overlay for each day S36-S39, met by the two module labs below. The matrix gives the optional S39 reading no print handout, so its PDF is recorded not applicable.

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
| `microservices-and-ci-cd/sql-vs-nosql` | reading | R | R | R | R | V | - |
| `microservices-and-ci-cd/api-gateways-and-service-discovery` | reading | R | R | R | R | V | - |
| `microservices-and-ci-cd/github-actions-pipeline` | core | R | R | - | R | V | M |
| `microservices-and-ci-cd/secrets-in-ci` | core | R | R | - | R | V | M |
| `microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes` | reading | R | R | - | R | V | - |

Simulators: every page's simulator is an honest HTML model of real tool output (Dockerfile build steps and cache hits, `docker`/`podman` and `docker compose` command output, Compose start order and health states, workflow run graphs). Any terminal interaction uses `components/terminal@1` unchanged. Simulators never claim to run a real engine.

## Lab plan

Approved Q4b: daemon-free validation of learner-written Dockerfile, Compose and workflow files plus honest HTML simulators. No engine-based learner lab and no learner-side container engine, for setup or tests (`authoring/docs/lab-contract.md` section 4). Standard and Fast share this one tree: Standard requires these labs through its lab overlay; Fast does not require them and moves to direct project implementation.

| Lab | Scope | Standard overlay | Covers | Learner-written files validated | Test command |
|---|---|---|---|---|---|
| `containers-cicd/containers-and-compose/coding-lab` | module | S36, S37 (required); Fast not required | `image-layers-and-build-caching`, `multi-stage-builds`, `ports-volumes-and-environment-variables`, `compose-spring-boot-and-database`, `service-name-networking`, `depends-on-with-health-checks` | `backend/Dockerfile`, `frontend/Dockerfile`, `.dockerignore`, `compose.yaml` | `node --test` |
| `containers-cicd/microservices-and-ci-cd/coding-lab` | module | S38, S39 (required); Fast not required | `adding-fastapi-service-to-compose`, `github-actions-pipeline`, `secrets-in-ci` | `compose.yaml` (extended), `fastapi/Dockerfile`, `.github/workflows/ci.yml` | `node --test` |

- Language and command: JavaScript on Node.js 24, `node --test` (the lab contract's JavaScript example). One-time offline-capable setup `npm ci` installs one pinned YAML parser with its committed lockfile; the test command then runs fully offline. The public tests parse the learner's files as text and YAML and check stated rules (for example: named stages and `COPY --from`; dependency manifests copied before source; `.dockerignore` entries; a named volume for database data; database credentials read from `${VAR}` interpolation or an `env_file` rather than literals, with that env file listed in `.gitignore` and not tracked by Git (checked with `git ls-files`); connection URLs that use a service name, not `localhost`; a database `healthcheck` with `depends_on` `condition: service_healthy`; a test job and a build job with `needs`; `${{ secrets.NAME }}` references and a `permissions` block). They never build images, start containers or call a daemon.
- Credentials (intake reconciliation ops-sme-007): the database password in labs and the Fast project is a clearly labelled, disposable local-development value. Passing it through environment variables or an untracked env file is configuration wiring, not production secret protection. Teaching text names Compose secrets as the production practice, as a pointer only, with no new objective.
- Port exposure (intake reconciliation ops-sme-002): the module 1 lab rejects a Compose `ports` entry that omits the host IP and requires `127.0.0.1:HOST:CONTAINER` loopback binding for development; pages and simulators contrast `8080:80` (every host address) with `127.0.0.1:8080:80` (local machine only), and development examples default to loopback.
- Action pinning (intake reconciliation ops-sme-001): the module 2 lab has a public test, and the README a learner instruction, that rejects branch names, floating or version tags and unqualified refs in every non-local `uses:` entry and requires a full-length 40-character commit SHA, with the human-readable release tag kept in a trailing comment, for example `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1` and `docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0` (tag commits read from the GitHub API on 2026-10-12). Page examples use the same pins. GitHub documents pinning to a full-length commit SHA as the only immutable reference for a third-party action (secure use reference).
- Secrets (intake reconciliation ops-sme-003): no page, simulator or lab example prints a secret; examples mask other sensitive values with `::add-mask::`, and teaching text treats log redaction as best effort, not a permission boundary.
- Starters fail the named public tests with stable messages; no solutions or hidden tests are committed; the solved-run record follows `authoring/docs/lab-contract.md` section 10.
- Topics with no lab (`containers-and-images`, `debugging-with-logs-and-exec`, `monolith-vs-microservices`, `service-to-service-calls`, `sql-vs-nosql`, `api-gateways-and-service-discovery`, `jenkins-registries-cd-and-kubernetes`) record `lab: none` with a reason: they need a running engine, servers or a cluster, they are conceptual, or (for `service-to-service-calls`, education-04) running both services locally adds multi-runtime setup with too little learning beyond a simulator that directly checks token forwarding, timeout choice and failure responses. The educational critic confirms each omission.
- `module.json` `moduleLabs` stays empty and topics record `lab: module:<module>` until the module PR adds the lab directory, so no manifest names a file that does not exist.
- The S39/FT23 coding part of the module check is likewise daemon-free (a Compose-file edit), so no assessment needs an engine.

## Fast project increments

Captain decision `pep-fast-project-block`, option A (inventory amendment 1: three new category-B items for this course). Every Fast-template day has a 70-minute Project block. This course's Fast days FT21, FT22 and FT23 each carry one teach-before-apply increment of **one cumulative, reusable Fast project**: the learner keeps working in the same project directory, and each day extends it. The Fast overlay presents each block as a project increment, never as a coding lab. Standard does not require the project; its learners take the module labs instead. Optional Standard extensions are not a deliverable.

- Location and scope: one course-level project at `containers-cicd/coding-lab/` (the lab contract's course scope: a cumulative build across modules), covered by `course.lock.json` and listed in `course.json` `courseLabs` once it exists. `lab.json` sets `trackRequirement` to `fast: required` and `standard: not-required`, with `minutes` 70 per increment. Because it is a course-level file, it is authored in a course-scope PR after both module PRs merge, not in a module PR (branch-scope rule in `authoring/AGENTS.md`); the module PRs author the scaffold and rule checks it reuses.
- Reuse: the FT21 starter reuses the `containers-and-compose` module-lab scaffold (back-end and front-end sources with empty `Dockerfile`s and `compose.yaml`). The FT22 extension provides the FastAPI service source, a FastAPI `Dockerfile` skeleton and the Compose stanzas for the FastAPI service, its own database service and its named volume, with marked learner TODOs limited to the concepts the FT22 embedded steps teach (intake reconciliation education-recheck-01). The FT23 extension provides the workflow skeleton. All come from the `microservices-and-ci-cd` module-lab pieces. The public tests reuse the module labs' rule checks with the same rules and messages. No extension contains a completed earlier step, so no solution is committed.
- One test command: `node --test` on Node.js 24, after the one-time `npm ci` that installs the pinned YAML parser. Tests are named by increment (`ft21-…`, `ft22-…`, `ft23-…`). The README tells the learner which group must pass at the end of each day; `expected/` holds the summary for each increment's finished state. The shipped starter fails the named FT21 tests with stable messages.
- No container engine: the tests read the learner's files as text and YAML; nothing builds an image, starts a container or calls a daemon (approved Q4b). Solutions and hidden tests stay in uncommitted private staging; the solved-run record follows `authoring/docs/lab-contract.md` section 10, one per increment.

| Increment | Fast day (Project block) | Outcomes: learner-written files pass these rules | Prerequisites, all taught earlier on the Fast route | Starter scaffold or extension |
|---|---|---|---|---|
| 1 | FT21, 70 min | `backend/Dockerfile`: JDK build stage and JRE runtime stage with `COPY --from`, dependency files copied before source. `frontend/Dockerfile`: Node build stage, nginx serving only the build output. `.dockerignore` excludes build output, VCS folders and local secret files. `compose.yaml`: Spring Boot service built from its Dockerfile, PostgreSQL with a named data volume, ports bound to `127.0.0.1`, a labelled disposable local-development database password from `${VAR}` or an `env_file`, never a literal, with the env file in `.gitignore`; a public test fails if it is tracked by Git, and a datasource URL that names the database service rather than `localhost`. | FT21 pages taught that day before the Project block: `containers-and-images`, `ports-volumes-and-environment-variables` (including loopback binding), `multi-stage-builds`, `compose-spring-boot-and-database`, `service-name-networking`, `image-layers-and-build-caching` (skim). `debugging-with-logs-and-exec` needs an engine and is not applied. | New project: the FT21 starter (module 1 scaffold). |
| 2 | FT22, 70 min | The database gains a `healthcheck` and the app `depends_on` it with `condition: service_healthy`. The learner completes the provided FastAPI `Dockerfile` skeleton so the server listens on `0.0.0.0`. In the provided Compose stanzas, the learner points the FastAPI service at its own database service by service name (database per service), never `localhost` or the Spring database. The learner also gives the Spring service's downstream URL as a service name. Building the stanzas themselves is not a learner outcome. Downstream base URL and timeout values come from environment variables, not literals. | FT21 topics, plus FT22 pages taught before the block: `depends-on-with-health-checks`, `monolith-vs-microservices`, `adding-fastapi-service-to-compose`, `service-to-service-calls`, and the `sql-vs-nosql` and `api-gateways-and-service-discovery` skims. | Extends the learner's own increment 1 with the FastAPI source, `Dockerfile` skeleton and Compose stanzas with marked TODOs (module 2 scaffold pieces). |
| 3 | FT23, 70 min | `.github/workflows/ci.yml`: triggers on push and pull request, a test job, and an image-build job that `needs` it. `docker/build-push-action` only builds on pull requests. Credentials come only through `${{ secrets.NAME }}`, nothing is echoed, and there is a least-privilege `permissions` block. Every non-local `uses:` is pinned to a full-length commit SHA with its tag in a comment. | FT22 project state, plus FT23 pages taught before the block: `github-actions-pipeline` and `secrets-in-ci`. SHA pinning is not an objective of those pages; its embedded step below teaches it before first use. The optional `jenkins-registries-cd-and-kubernetes` reading is not applied. | Extends the learner's own increment 2 with the workflow skeleton (module 2 scaffold piece). |

### Embedded teach-then-check steps and day fit

Program pattern from the html-css-js and React reviews: inside each 70-minute increment, every applied concept gets a short embedded teach-then-check step, sized in minutes, just before its first use: a worked example, then one check the learner must pass. The 10-minute Skim block and the full topic pages are reference, not a prerequisite the learner must finish first. Each increment applies only concepts taught on the Fast route. Embedded steps and build time are planning estimates; the course-scope project PR re-measures them.

| Increment | Embedded teach-then-check steps (minutes) | Build and test work (minutes) | Total |
|---|---|---|---|
| 1 (FT21) | Multi-stage build with `COPY --from` 3; cache-friendly order 2; `.dockerignore` 2; Compose `build`, `image` and named volumes 3; loopback port binding 2; disposable local credential from `${VAR}` or an untracked `env_file` (wiring, not secret protection; Compose secrets named for production) 3; service-name URL instead of `localhost` 2. Subtotal 17 | Back-end Dockerfile 12; front-end Dockerfile 10; `.dockerignore` and `.gitignore` 3; `compose.yaml` 15; run tests and fix 10. Subtotal 50 | 67 |
| 2 (FT22) | Healthcheck with `condition: service_healthy` 3; listen on `0.0.0.0` in a container 2; database per service 2; downstream URL and timeout from environment variables 3. Subtotal 10 | Healthcheck and `depends_on` 10; complete the FastAPI `Dockerfile` TODO (bind address and port) 5; complete the Compose TODOs (own-database URL by service name) 8; downstream environment wiring 8; run tests and fix 10. Subtotal 41 | 51 |
| 3 (FT23) | `on`, `jobs` and `needs` 3; build-only on pull requests with build-push-action 2; `${{ secrets.NAME }}`, no echo, `add-mask` 3; least-privilege `permissions` 2; pinning to a full-length commit SHA 3. Subtotal 13 | Triggers and test job 12; build job 12; secrets and permissions 8; pin the actions 8; run tests and fix 10. Subtotal 50 | 63 |

Day fit: each Fast day keeps its frozen 120-minute Fast template (Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5). Every increment fits its 70-minute Project block, with 3, 19 and 7 minutes of slack, so no increment is reduced and there is no template overflow.

Reported, not a template overflow: the full topic pages mapped to each Fast day total FT21 74, FT22 56 and FT23 31 budget minutes, against the 10-minute Skim block. Those pages are reference on the Fast route. Fitting them is a platform pacing matter (plan section 2.4), and T14 checks only the 120-minute day total, which all three meet.

## Minute budgets

Rule: the revised new-course rule merged on `main` (`authoring/docs/tools/validators.md`, section Reading time): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15 minutes, with no weighted day-pool shares and no compression. Course 1's `legacy-label:` basis is not used.

No page exists at intake, so the estimator cannot run. Each `modeledP50` is the planned estimator P50 target for the page and each `modeledWorstPath` the planned worst required route (two wrong graded attempts per interactive unit and wrong-first explores before settling). Planning basis: course-1 core pages measured estimator P50 5-8 minutes with worst routes up to about 9.4; these topics carry denser command and file syntax, so core pages plan P50 7-9 and worst 10-12, and readings plan P50 5-7 and worst 7-9. `budget` = `aboutLabel` = `ceil(max(P50, worst))`. The module PR replaces `modeledP50` with the frozen estimator's P50 on the authored bytes, re-models the worst path and raises the budget if the measured minimum is higher; T14 then enforces it.

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
| `sql-vs-nosql` | S38, FT22 | 5 | 7 | 7 |
| `api-gateways-and-service-discovery` | S38, FT22 | 5 | 7 | 7 |
| `github-actions-pipeline` | S39, FT23 | 9 | 12 | 12 |
| `secrets-in-ci` | S39, FT23 | 7 | 10 | 10 |
| `jenkins-registries-cd-and-kubernetes` | S39, FT23 | 7 | 9 | 9 |

Day totals against the 120-minute day (T14 sums each topic budget on every day it maps to): S36: 43; S37: 41; S38: 46; S39: 31; FT21: 74; FT22: 56; FT23: 31. All fit; the Lab and Fast day blocks keep the rest of the day for the guided lab or project, the without-AI block and the reflection.

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
  - `containers-cicd/microservices-and-ci-cd/github-actions-pipeline#o1` (MCQ)
  - `containers-cicd/microservices-and-ci-cd/secrets-in-ci#o2` (MCQ)
  - `containers-cicd/containers-and-compose/service-name-networking#o2` (coding)
  - `containers-cicd/containers-and-compose/depends-on-with-health-checks#o2` (coding)

- Proposed item counts and duration, consistent with both calendar days, neither of which has a dedicated module-check block:
  - Standard S39 (Lab day): MCQ in the Warm-up quiz block (8 minutes) and coding in the "Redo one step without AI" coding-assessment block (10 minutes).
  - Fast FT23 (Fast day): MCQ in the "Try-first diagnostic" MCQ-and-coding block (15 minutes) and coding in the "Timed, without AI" coding-assessment block (15 minutes). The Fast Warm-up quiz block (5 minutes) is too short for the shared MCQ part.
  - MCQ: 8 items in 8 minutes, about 1 minute per scenario item, one item per MCQ objective. coding: 1 Compose-file task in 10 minutes covering the two coding objectives. `durationMinutes` 18 = 8 + 10, which fits the smaller Standard blocks and leaves Fast slack.
  - Where each part is scheduled on the platform is the platform assessment owner's call; this is the intake proposal for critic review.
- Allowed resources: the coding part is without AI, because the calendar's "Redo one step without AI" (S39) and "Timed, without AI" (FT23) blocks state it, and it needs only a text editor and no container engine. The MCQ part's resource rule is left to the platform assessment owner (education-03): the blueprint states no AI or notes rule for it. Any further resource rule is set and shown by the platform assessment owner; the repository invents no assessment policy.
- Objective choice (education-02): the MCQ part maps only objectives whose verbs a multiple-choice item can directly elicit (identify, explain, predict, choose); workflow-writing objectives are practised in the module 2 lab, not assessed by MCQ.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; T01 and T07 check its key names.

## Official sources per topic

Closes category-A record `source-gap-containers-cicd-official-evidence`. Every source below was fetched live on 2026-10-12 with `curl -L`; `authoring/evidence/containers-cicd/source-snapshot.json` records each final URL with its retrieval time, the sha256 of the fetched bytes and the topic sections used. All 96 sources returned HTTP 200 (84 at the first freeze, 12 added at the correction loop: the Podman machine pages and the tagged release pages for the compatibility baseline) and each page title was checked against the expected document. Raw fetched pages are not committed.

Source classes: official product documentation and references (Docker, Podman, Compose, GitHub, Spring, FastAPI, HTTPX, Vite, nginx, PostgreSQL, Jenkins, Kubernetes), open specifications (OCI image, runtime and distribution specs, the Compose Specification, IETF RFCs 6750 and 9110), and vendor architecture guidance (Microsoft Azure Architecture Center). For the microservices and gateway patterns, `microservices.io` (the pattern catalogue's author) and the Lewis and Fowler article are the primary sources of those pattern definitions and are listed as such, alongside the Azure guidance.

Version note: the documentation sources are the current published documents (Docker Docs and Compose Specification `main`, Spring Boot current reference, PostgreSQL `current`, Kubernetes current docs); their bytes are frozen by hash. The demonstrated versions are fixed by the compatibility baseline below, which cites tagged release pages.

### Compatibility baseline

Added at intake reconciliation (ops-sme-006). Every page example, simulator transcript and lab fixture names this baseline; a module PR that demonstrates a different version updates this table in a course-level change first. Versions are the latest stable releases on 2026-10-12, read from each project's GitHub releases API or release index and frozen as tagged release pages in the source snapshot. "Demonstrated minimum" is the oldest version the course claims for its examples: older lines were not checked and are not supported. "Tested" means run by the course tooling; no container tool is run, because learners and labs use no engine and pages simulate its output.

| Tool | Demonstrated minimum | Tested | Source (tagged) | OS notes |
|---|---|---|---|---|
| Docker Engine and CLI | 29.9 | not run (simulated output only) | https://github.com/moby/moby/releases/tag/docker-v29.9.0; https://docs.docker.com/engine/release-notes/29/ | Engine runs on Linux; Docker Desktop on macOS and Windows runs it in a Linux VM |
| Docker Compose (`docker compose` CLI plugin) | 5.6 | not run (simulated output; labs parse files only) | https://github.com/docker/compose/releases/tag/v5.6.0 | Same Compose file on every OS; `depends_on` `condition: service_healthy` per the current Compose reference |
| Podman | 6.1 | not run (simulated output only) | https://github.com/podman-container-tools/podman/releases/tag/v6.1.4 | Daemonless on Linux; on macOS and Windows a Linux VM started with `podman machine` (ops-sme-005) |
| Node.js | 24.21 (24.x LTS) | lab tests with `node --test` in the module PRs; repository tooling pins `engines.node` 24.x | https://nodejs.org/en/blog/release/v24.21.0 | macOS, Linux, Windows |
| Spring Boot (RestClient via its managed Spring Framework) | 4.1 | not run at intake; Spring examples are file and simulator content | https://github.com/spring-projects/spring-boot/releases/tag/v4.1.1 | RestClient timeouts depend on the configured request factory (ops-sme-004) |
| FastAPI | 0.143 | not run at intake | https://github.com/fastapi/fastapi/releases/tag/0.143.0 | `fastapi run` listens on 0.0.0.0 |
| HTTPX | 0.28 | not run at intake | https://github.com/encode/httpx/releases/tag/0.28.1 | Default five-second network-inactivity timeout; can be disabled (ops-sme-004) |
| actions/checkout | v7.0.1, pinned to `3d3c42e5aac5ba805825da76410c181273ba90b1` | lab tests check the pin format only | https://github.com/actions/checkout/releases/tag/v7.0.1 | GitHub-hosted runner |
| docker/build-push-action | v7.4.0, pinned to `c3c9e263c25d99ce0380d002d59b67737d91b0dc` | lab tests check the pin format only | https://github.com/docker/build-push-action/releases/tag/v7.4.0 | GitHub-hosted runner |

Redirects recorded: `https://learn.microsoft.com/en-us/azure/architecture/data-guide/big-data/non-relational-data` now resolves to `.../data-guide/technology-choices/understand-data-store-models`; `https://docs.github.com/en/actions/concepts/use-cases/deploying-with-github-actions` now resolves to `.../actions/how-tos/deploy/configure-and-manage-deployments/control-deployments`. The snapshot stores the final URLs.

Gaps: `https://www.uvicorn.org/settings/` (Uvicorn `--host` default) did not resolve from this host (DNS failure) and is not in the snapshot; `adding-fastapi-service-to-compose` o3 rests on the FastAPI CLI documentation instead, and the module PR re-attempts the Uvicorn source. The Docker Hub pages (`nginx`, `postgres`) are rendered client-side; their fetched bytes contain the documented environment variables and usage sections but the module PR re-checks them in a browser.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; the module PR's SME criticism verifies each claim against live official documentation and writes per-topic `sources.json` receipts.

| Topic | Official first-party sources |
|---|---|
| `containers-and-images` | https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/<br>https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/<br>https://docs.docker.com/reference/cli/docker/container/run/<br>https://docs.podman.io/en/latest/index.html<br>https://docs.podman.io/en/latest/Introduction.html<br>https://docs.podman.io/en/latest/markdown/podman-machine.1.html<br>https://docs.podman.io/en/latest/markdown/podman-machine-start.1.html<br>https://docs.podman.io/en/latest/markdown/podman-run.1.html<br>https://github.com/opencontainers/image-spec/blob/main/spec.md<br>https://github.com/opencontainers/runtime-spec/blob/main/spec.md |
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
| `sql-vs-nosql` | https://learn.microsoft.com/en-us/azure/architecture/data-guide/technology-choices/understand-data-store-models (requested https://learn.microsoft.com/en-us/azure/architecture/data-guide/big-data/non-relational-data)<br>https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations<br>https://microservices.io/patterns/data/database-per-service.html |
| `api-gateways-and-service-discovery` | https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway<br>https://microservices.io/patterns/apigateway.html<br>https://microservices.io/patterns/server-side-discovery.html<br>https://microservices.io/patterns/client-side-discovery.html<br>https://docs.docker.com/compose/how-tos/networking/ |
| `github-actions-pipeline` | https://docs.github.com/en/actions/get-started/understand-github-actions<br>https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax<br>https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs<br>https://github.com/actions/checkout<br>https://github.com/docker/build-push-action<br>https://docs.docker.com/build/ci/github-actions/ |
| `secrets-in-ci` | https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets<br>https://docs.github.com/en/actions/reference/security/secrets<br>https://docs.github.com/en/actions/reference/security/secure-use<br>https://docs.github.com/en/actions/concepts/security/github_token<br>https://docs.docker.com/build/ci/github-actions/secrets/<br>https://docs.docker.com/build/building/secrets/ |
| `jenkins-registries-cd-and-kubernetes` | https://www.jenkins.io/doc/book/pipeline/<br>https://www.jenkins.io/doc/book/pipeline/jenkinsfile/<br>https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry<br>https://docs.docker.com/docker-hub/repos/<br>https://github.com/opencontainers/distribution-spec/blob/main/spec.md<br>https://kubernetes.io/docs/concepts/overview/<br>https://kubernetes.io/docs/concepts/workloads/controllers/deployment/<br>https://kubernetes.io/docs/concepts/services-networking/service/<br>https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments (requested https://docs.github.com/en/actions/concepts/use-cases/deploying-with-github-actions) |
| compatibility baseline (all topics) | https://github.com/moby/moby/releases/tag/docker-v29.9.0<br>https://docs.docker.com/engine/release-notes/29/ (requested https://docs.docker.com/engine/release-notes/)<br>https://github.com/docker/compose/releases/tag/v5.6.0<br>https://github.com/podman-container-tools/podman/releases/tag/v6.1.4 (requested https://github.com/containers/podman/releases/tag/v6.1.4)<br>https://nodejs.org/en/blog/release/v24.21.0<br>https://github.com/spring-projects/spring-boot/releases/tag/v4.1.1<br>https://github.com/fastapi/fastapi/releases/tag/0.143.0<br>https://github.com/encode/httpx/releases/tag/0.28.1<br>https://github.com/actions/checkout/releases/tag/v7.0.1<br>https://github.com/docker/build-push-action/releases/tag/v7.4.0 |

Calendar references for the `ops` technology (snapshot `technologies` entry): [Docker: get started](https://docs.docker.com/get-started/), [Podman documentation](https://docs.podman.io/), [GitHub Actions](https://docs.github.com/en/actions). The snapshot pins the specific pages under them.

## Intake criticism

Fresh, independent educational and technology-SME critics reviewed the first intake commit (`4a66b4b`); a non-author second mate reconciled their findings. The reports and reconciliation are committed unchanged as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`, except that each reconciliation decision gains `file` and `fixedInSha256` naming the corrected bytes. Outcome: all 10 findings accepted (education-01 to 04, ops-sme-001 to 006) and applied in one correction loop:

- education-01: S38 row 3 split into `sql-vs-nosql` and `api-gateways-and-service-discovery`.
- education-02: MCQ objectives `github-actions-pipeline#o1` and `secrets-in-ci#o2` replace `#o2` and `#o1`.
- education-03: the MCQ resource rule is left to the platform assessment owner.
- education-04: the `service-to-service-calls` lab-omission reason states the applicability judgment.
- ops-sme-001: lab plan requires full-length commit-SHA pins for non-local actions.
- ops-sme-002: `ports-volumes-and-environment-variables#o1` and the lab plan make the bind address observable and default to loopback.
- ops-sme-003: `secrets-in-ci#o2` treats redaction as best effort, never printing secrets, add-mask, and the fork caveat with the GITHUB_TOKEN exception.
- ops-sme-004: `service-to-service-calls#o2` names HTTPX and Spring RestClient and compares explicit, default and disabled timeouts; versions are in the compatibility baseline.
- ops-sme-005: `containers-and-images#o3` qualifies Podman as daemonless on Linux with the macOS and Windows `podman machine` VM.
- ops-sme-006: compatibility baseline added above.

The high finding ops-sme-001 needs a same-role resolved recheck before gate 18 (T25) closes.
