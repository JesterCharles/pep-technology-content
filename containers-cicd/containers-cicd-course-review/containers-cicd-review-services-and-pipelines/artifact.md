# Review scenarios: services, CI pipelines and secrets

## Objectives

- Choose the Compose setup and start command that add a FastAPI service with its own database, reached by service name, listening on an address other containers can reach
- Choose the workflow change that keeps a registry credential out of the file and the logs and limits GITHUB\_TOKEN to reading repository contents
- Predict whether a workflow's image job is skipped, only builds, or builds and pushes, from its trigger, its needs and its push setting

## Teaching

### Activity 1 of 3: Add the reviews service

This page wraps up Microservices and CI/CD with new scenarios that mix its topics, all on the shop stack from the first module. Answer from memory first; every option explains itself after you check.

The team adds a reviews feature as a FastAPI service built from its own Dockerfile in `./reviews`. It must deploy on its own schedule, and the api service will call it on port 8000. Every option declares any named volume it uses under the top-level `volumes:` and takes passwords from the untracked `.env` file.

### Activity 2 of 3: Fix the registry sign-in step

Before the CI pipeline can push the API image, a job must sign in to the team's registry. A teammate's first draft of that step:

```
      - name: Sign in to the registry
        env:
          REGISTRY_PASSWORD: literal-pw
        run: printenv REGISTRY_PASSWORD | docker login registry.example.com -u ci --password-stdin
```

The workflow file has no `permissions` block. The team wants no credential value in the file or in any log, and a `GITHUB_TOKEN` that can read the repository's contents and do nothing more. The registry password is already stored as the repository secret `REGISTRY_PASSWORD`.

### Activity 3 of 3: Predict the pipeline runs

This is the finished workflow, with the sign-in step from Activity 2:

```
name: ci
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - run: ./mvnw test
  image:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - name: Sign in to the registry
        env:
          REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
        run: printenv REGISTRY_PASSWORD | docker login registry.example.com -u ci --password-stdin
      - uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: registry.example.com/shop/api:${{ github.sha }}
```

Three runs start, all from branches of this repository:

1. A pull request whose change breaks one test.
2. A pull request whose tests all pass.
3. A push to `main` whose tests all pass.

## Recap

- A new service gets its own `build`, its own database service and its own named volume. Its URL names that database by service name, and its server listens on 0.0.0.0, as `fastapi run` does, so other containers can reach it.
- Database per service: one service never reads another service's tables; it calls the API of the service that owns the data.
- Reference a credential as `${{ secrets.NAME }}` and never print it. A `permissions` block limits `GITHUB_TOKEN`, and anything it does not list becomes `none`.
- A failed or skipped job skips the jobs that `needs` it. `push: ${{ github.event_name != 'pull_request' }}` builds on pull requests and pushes on the other events the workflow runs for.

## Cheat sheet

Where to act: The host in each option's `DATABASE_URL`.

Next step: Ask which container that host name reaches from inside reviews, and whether that database belongs to reviews or to another service.

Another hint Hint 2 of 2 for Activity 1

Where to act: The `CMD` line in each option.

Next step: Ask which address each fastapi command listens on, and whether a request from the api container arrives on that address.

Where to act: The value of `REGISTRY_PASSWORD` in each option, and any step that prints it.

Next step: Ask where the value would be stored in each option, and whether log redaction can be relied on to hide a value a step prints.

Another hint Hint 2 of 2 for Activity 2

Where to act: The `permissions` part of each option.

Next step: Ask which access `GITHUB_TOKEN` has when a workflow lists no permissions, compared with a block that lists only `contents: read`.

Where to act: The `needs` line in the image job, for run 1.

Next step: Ask what happens to a job that needs another job when that job fails.

Another hint Hint 2 of 2 for Activity 3

Where to act: The `push` expression, for runs 2 and 3.

Next step: Write down `github.event_name` for a pull request run and for a push run, then evaluate `!= 'pull_request'` for each.

```
DATABASE_URL: postgresql://reviews:${REVIEWS_DB_PASSWORD}@reviews-db:5432/reviews
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]   # listens on 0.0.0.0

permissions:
  contents: read                     # anything not listed becomes none
env:
  REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}   # never print it

needs: test                       # skipped when test fails or is skipped
push: ${{ github.event_name != 'pull_request' }}
```

Claims on this page were checked against these official sources, retrieved 2026-11-19.

- Azure Architecture Center: Microservices architecture style: independent deployment and the costs microservices add
- microservices.io: Database per service: data private to a service and reached only through its API
- Docker Docs: Networking in Compose: reaching another service by its service name
- Docker Hub: postgres: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD and the data volume
- FastAPI: FastAPI CLI: fastapi run listens on 0.0.0.0, fastapi dev on 127.0.0.1
- GitHub Docs: Using secrets in GitHub Actions: the secrets context in a step's env
- GitHub Docs: Secure use reference: redaction is not guaranteed; never print secrets; least privilege
- GitHub Docs: Workflow syntax: on with branch filters, permissions, needs; unlisted permissions are none
- GitHub Docs: GITHUB_TOKEN: the automatic token and its permissions
- GitHub Docs: Using jobs in a workflow: a job that needs a failed job is skipped
- actions/checkout README: the token input defaults to the workflow's GITHUB_TOKEN
- docker/build-push-action README: context, push and tags inputs

## Static interaction alternatives

### mcq

Question: Which reviews setup works and keeps its data private?. Option A: No new database: reviews gets DATABASE_URL: postgresql://shop:${DB_PASSWORD}@db:5432/shop so it can read the orders table directly. The Dockerfile ends with CMD ["fastapi", "run", "app/main.py", "--port", "8000"]. - Not quite. It connects, but database per service means one service never reads another's tables. If reviews needs orders, it calls the API that owns them; give reviews its own database service. Option B: A reviews-db service using postgres:18 with the named volume reviews-data, and DATABASE_URL: postgresql://reviews:${REVIEWS_DB_PASSWORD}@reviews-db:5432/reviews. The Dockerfile ends with CMD ["fastapi", "dev", "app/main.py", "--port", "8000"]. - Not quite. The data setup is right, but fastapi dev listens on 127.0.0.1, which accepts connections only from inside the reviews container, so the api service cannot reach it. Option C: A reviews-db service using postgres:18 with the named volume reviews-data, and DATABASE_URL: postgresql://reviews:${REVIEWS_DB_PASSWORD}@localhost:5432/reviews. The Dockerfile ends with CMD ["fastapi", "run", "app/main.py", "--port", "8000"]. - Not quite. Inside the reviews container, localhost is the reviews container itself, not reviews-db. The URL must name the database service. Option D: A reviews-db service using postgres:18 with the named volume reviews-data, and DATABASE_URL: postgresql://reviews:${REVIEWS_DB_PASSWORD}@reviews-db:5432/reviews. The Dockerfile ends with CMD ["fastapi", "run", "app/main.py", "--port", "8000"]. - Correct. reviews owns its data in its own database service and volume, and its URL reaches that database by service name and container port. fastapi run listens on 0.0.0.0, so the api container can reach port 8000. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: Which change keeps the credential safe and limits the token?. Option A: Set REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}, add a debug step with the same env that runs echo "password is $REGISTRY_PASSWORD", relying on GitHub to redact it, and add a top-level permissions: block with contents: read. - Not quite. Redaction is best effort, not a permission boundary: it matches exact values and can miss a changed or encoded form. Never print a secret. Option B: Set REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }} and add a top-level permissions: block with contents: read. - Correct. The secrets context fills the value at run time, so the file holds only the reference, and nothing prints it. The permissions block grants contents: read, and every permission it does not list becomes none. Option C: Move REGISTRY_PASSWORD: literal-pw into a top-level env: block of the same workflow file, and add a top-level permissions: block with contents: read. - Not quite. The value is still written in the workflow file, where anyone who can read the repository can see it. Store it as a repository secret and reference it as ${{ secrets.REGISTRY_PASSWORD }}. Option D: Set REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }} and leave out a permissions block, because the job never uses GITHUB_TOKEN. - Not quite. The credential is safe, but without a permissions block the token keeps the repository's default access, which can be broader than reading contents, and actions/checkout uses it by default. List contents: read, and everything else becomes none. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: What does the image job do in each run?. Option A: 1: it runs and builds without pushing. 2: it builds without pushing. 3: it builds and pushes. - Not quite. needs: test makes image wait for test, and when test fails, image is skipped. Only without needs would the two jobs run in parallel. Option B: 1: it is skipped. 2: it builds and pushes. 3: it builds and pushes. - Not quite. On a pull request run, github.event_name is pull_request, so the push expression is false: the image is built but not pushed. Option C: 1: it is skipped. 2: it builds without pushing. 3: it builds and pushes. - Correct. Test fails in run 1, so the job that needs it is skipped. In run 2 the event is pull_request, so push is false and the image is only built. In run 3 the event is push, so the expression is true and the image is pushed. Option D: 1: it is skipped. 2: it builds without pushing. 3: it builds without pushing. - Not quite. On a push run, github.event_name is push, which is not pull_request, so the expression is true and the image is pushed. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
