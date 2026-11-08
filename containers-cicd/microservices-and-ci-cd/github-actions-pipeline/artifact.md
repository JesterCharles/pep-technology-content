# A GitHub Actions pipeline: tests, then image builds

## Objectives

- Read a workflow file and identify its trigger (on), jobs, runner (runs-on) and steps
- Write a workflow in which a test job runs first and an image-build job runs only after it succeeds, using needs
- Explain what actions/checkout and docker/build-push-action do in the build job, and when an image is only built versus also pushed

## Teaching

Jobs `test` and `build` never mention each other. On a push, `test` fails.

A workflow is a YAML file in `.github/workflows/`, started by an event in `on`. It has jobs, each on a runner, and each job has ordered steps.

```
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - run: ./mvnw test
```

A step runs a command (`run`) or uses a packaged action (`uses`). The long commit pins the exact action version.

`needs` makes a job wait for another job. If that job fails or is skipped, this one is skipped too.

```
  package:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - run: npm pack
```

The image-build action is pinned the same way:

```
- uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
  with:
    context: .
    push: false
```

`actions/checkout` copies your repository onto the runner, which starts without it. `docker/build-push-action` builds the image, and with `context: .` it reads those checked-out files.

The action pushes the image to a registry only when `push` is true. A common setting builds on every pull request and pushes only from `main`:

```
push: ${{ github.event_name != 'pull_request' }}
```

A teammate removes the dependency on `test` from `build`, which still pushes on every push to `main`.

## Recap

You finished 0 of 5 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- A workflow is a trigger (`on`), jobs, a runner per job (`runs-on`) and ordered steps.
- `needs` makes the build job wait for tests; without it, jobs run in parallel.
- Checkout copies the repository to the runner; the build action pushes only when `push` is true.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Reading without JavaScript: decide first, then read on.

Where to act: Add the new job under `jobs`, level with `test`.

Next step: Compare with how `package` waits for `lint` in the example.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Now look at the steps of the new job.

Next step: A runner starts with no copy of your repository, and `context: .` reads local files. Decide which step has to come first.

Printed alternative: Add a build job on ubuntu-latest that runs only after test succeeds, then checks out the code and builds the image without pushing. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

Where to act: Start by setting the Event to a pull request.

Next step: Then ask which push value would still let a push to main publish the image.

Printed alternative: push true publishes on every event, including pull requests. push false publishes on no event. The expression publishes on a push to main and only builds on a pull request.

Reading without JavaScript: decide first, then read on.

Optional time: about 4 minutes

Success criteria: Sketch a third job, deploy-staging, that runs only after build succeeds and only on main, using needs and a conditional you look up in the workflow syntax reference.

- Pin actions to a full commit, with the tag in a comment.
- A failed or skipped job skips the jobs that need it.
- Build on pull requests; push from `main`.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Understanding GitHub Actions: workflows, events, jobs, runners, steps
- Workflow syntax: on, jobs, needs, runs-on, steps; jobs run in parallel by default
- Using jobs: needs, and skipped jobs when a dependency fails
- actions/checkout README
- docker/build-push-action README: Git and path context, push, tags
- Docker Build GitHub Actions

## Static interaction alternatives

### predict

What happens to build? Each option is explained after the question in this reading.

### drag

What does this line define? Each row and its explanation follow in this reading.

### terminal

Add a build job on ubuntu-latest that runs only after test succeeds, then checks out the code and builds the image without pushing. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

### explore

push true publishes on every event, including pull requests. push false publishes on no event. The expression publishes on a push to main and only builds on a pull request.

### mcq

What should the comment say? Each option is explained after the question in this reading.
