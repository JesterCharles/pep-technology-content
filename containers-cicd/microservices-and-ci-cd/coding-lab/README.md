# Lab: grow the shop into services and automate it

## Goal

The shop from the Containers and Compose lab gets its first microservice and its first pipeline.
A teammate drafted the pieces; you repair and complete them.
Twenty-six public tests check your work. Most read your files; tests 24-26 run your service against a stand-in shop api, and tests 6-7 run your workflow's secret-using steps with made-up secrets and a stand-in `docker`.
Nothing builds an image, starts a container, opens a network connection or triggers a workflow.

## What you edit

All paths are under `starter/`. Each file names its phase in a `TODO` or header comment.

| File | What you do | Phase |
| --- | --- | --- |
| `.env` | Create it by copying `fixtures/.env.example` unchanged | 1 |
| `compose.yaml` | Uncomment the `reviews` draft and repair it | 2 |
| `reviews/Dockerfile` | Fix the start command only | 3 |
| `reviews/app/main.py` | Make the call to the shop api safe | 4 |
| `decisions.yaml` | Answer the design questions | 5 and 7 |
| `.github/workflows/ci.yml` | Repair the pipeline | 6 |

Leave everything else alone, including the provided `api` and `db` services.
Each failing test names the file and the rule to fix next.

## Timing

Estimates for a learner who has read the day's topic pages; nothing fails on time.

- **S38, about 39 minutes:** phases 1-5.
- **S39, about 19 minutes:** the Jenkins reading, then phases 6 and 7.

The 60-minute bound is a planning allowance, not a measured worst case: the typical path (about 58 minutes) plus two extra failed runs of about a minute each.
No learner has been timed yet. If you pass 60 minutes, pause and finish in self-study.
The one-time setup (about 5 minutes) is not counted.

## Setup (once, needs the network)

You need:

- Node.js 24 with its bundled npm (`node --version`)
- Git (`git --version`)
- Python 3.11 or later (`python3 --version`; on Windows, `py -3 --version`)
- bash (`bash --version`; on Windows, the tests use Git for Windows' bash, found next to `git`)

```sh
cd tests
npm run setup
```

This installs a pinned YAML parser and creates `.venv` (next to this README) with the pinned Python packages; after that, the tests run offline.
Windows is not yet tested: if the tests cannot find Python or bash there, set `LAB_PYTHON` (the `.venv` Python) or `LAB_BASH` (a `bash.exe`).

## How to test

From the `tests` folder:

```sh
node --test --test-reporter=tap
```

Read the `error:` text under each `not ok` line, change one thing, and run again.

## S38

Read the S38 topic pages first: monolith vs microservices, adding the FastAPI service to Compose, service-to-service calls, SQL vs NoSQL, and API gateways and service discovery.

### Phase 1: orient (about 7 minutes)

Read this file, copy `fixtures/.env.example` to `starter/.env`, and run the tests once. All 26 fail.

### Phase 2: repair the reviews services in Compose (about 8 minutes)

In `starter/compose.yaml`, delete only the `#` at the start of each draft line, so `reviews:` lines up with `db:`.
Then repair the defects the header comment lists, using the `notifier` example on the adding-FastAPI page as your model.
The reviews service listens on container port 8000. Its database password variable is `REVIEWS_DB_PASSWORD`.

### Phase 3: fix the start command (about 2 minutes)

Replace the Dockerfile's start command with the one the adding-FastAPI page gives for an image.

### Phase 4: a safe service-to-service call (about 8 minutes)

Fix the three rules the docstring in `starter/reviews/app/main.py` lists, using the service-to-service page:

1. Forward the caller's token. If none arrived, answer 401 before calling the api.
2. Pass an `httpx.Timeout` with a 2-second connect limit and a 3-second read limit as the call's `timeout`.
3. Turn a timeout and a refused connection (HTTPX raises `httpx.ConnectError`) into the status codes the page gives (for a refused connection either of the two it names passes). If you catch the broader `httpx.RequestError` instead, put it after the timeout handler.

Tests 24-26 judge what the service does, not how the code is written, so any correct way of writing it passes.

### Phase 5: the architecture and data review (about 14 minutes)

Read `fixtures/briefs/architecture-brief.md`.
Then fill the S38 sections of `starter/decisions.yaml`, choosing from the options listed above each question.

**End of S38:** run the tests. Tests 9-19 and 23-26 pass (15 of 26); the pipeline and the S39 sections still fail.

## S39

Read the S39 topic pages first: the GitHub Actions pipeline and secrets in CI.
Also read "Reading (optional): Jenkins, registries, CD and Kubernetes" (about 4 minutes).
The page calls itself optional and says it has no lab; on the Standard track this lab's phase 7 uses it, so read it.

### Phase 6: repair the pipeline (about 9 minutes)

Fix `starter/.github/workflows/ci.yml` without adding jobs, using the pipeline and secrets pages.
The workflow you want runs for pushes and pull requests: a pull request is built and tested but never pushes an image, and a push to `main` publishes it.

- The image goes to Docker Hub, where `GITHUB_TOKEN` cannot sign in. Keep the `run:` login step, but give it the `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` repository secrets the way the secrets page passes secrets to a step, and pipe the password to `docker login --password-stdin` instead of putting it on the command line.
- Give `GITHUB_TOKEN` the least access this workflow needs.
- Pin every action to its full commit SHA, with the release tag in a trailing comment:
  - `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`
  - `docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0`
- Optional and not tested: after phase 7, check the secrets page's rule for runs from forks and decide whether the login step needs the same guard as the push.

Tests 6 and 7 run the login step and every step that can see a secret with bash, as on a push to `main`, and check what the stand-in `docker login` receives and that no secret reaches the output.
Only `secrets`, `env` and `github.event_name`, `ref` and `ref_name` expressions are filled in; `if:` is not evaluated.
Test 7 finds a value as written (even split over lines), base64-encoded on its own, or in hex as xxd and xxd -p print it; the secrets page forbids every form.

### Phase 7: the images, secrets and delivery review (about 5 minutes)

Fill the S39 sections of `starter/decisions.yaml`. The image reference is in `fixtures/briefs/image-reference.txt`.

### Final pass (about 1 minute)

Run the tests. All 26 pass, and the result lines match `expected/solved-summary.txt`.

## Expected output

- The shipped starter's result lines match `expected/starter-summary.txt`.
- A finished lab ends with `# tests 26`, `# pass 26` and `# fail 0`. The `# duration_ms` line varies and is not compared.

## Cleanup

Delete `tests/node_modules`, `.venv` and `starter/.env`; restore starter files from Git to start over.
The lab creates no image, container, volume or workflow run. The step runs use a temporary folder that is removed afterwards.

## Troubleshooting

- **`Cannot find package 'yaml'`, or "the lab's Python environment is missing":** run `npm run setup` in `tests` first.
- **"setup needs Python 3.11 or later":** install Python from python.org and run `npm run setup` again (it rebuilds an old `.venv`; if it still fails, delete `.venv` first).
- **"bash was not found" (Windows):** install Git for Windows, which includes bash, then run the tests again.
- **"is not valid YAML":** the message gives the line. Indent with two spaces, never tabs.
