# Reading (optional): Jenkins, registries, CD and Kubernetes

## Objectives

- Compare a declarative Jenkinsfile pipeline with a GitHub Actions workflow: stages and steps versus jobs and steps
- Explain what a container registry stores and read an image reference as registry, repository and tag
- Describe what a Kubernetes Deployment and Service do with a pushed image, and how continuous delivery differs from continuous deployment

## Teaching

A team pushes an image as `ghcr.io/acme/shop-api:1.4.2`. A week later someone builds a different image and pushes it with the same tag.

A declarative Jenkinsfile describes a pipeline, much as a workflow does:

```
pipeline {
  agent any
  stages {
    stage('Test') {
      steps { sh './mvnw test' }
    }
    stage('Build') {
      steps { sh 'docker build -t shop-api .' }
    }
  }
}
```

One difference matters: these stages run in the listed order, while GitHub jobs run in parallel unless you add `needs`.

A container registry stores images in repositories. A reference reads as registry, repository and tag:

```
ghcr.io/acme/shop-api:1.4.2
registry/repository  :tag
```

Leave out the registry and Docker assumes Docker Hub (`docker.io`). Leave out the tag and it assumes `latest`, which is just a name and not a promise of newest.

Kubernetes runs containers across a cluster. A Deployment declares a desired state, such as three replicas of an image, and Kubernetes changes the actual state to match at a controlled rate. A Service gives those changing Pods one stable way to be reached, using a label selector.

Continuous delivery means every change is built, tested and ready to release, with a manual approval for production. Continuous deployment removes that approval.

A team’s pipeline: tests pass, the image is pushed, staging updates automatically, and production updates when a lead presses Approve.

## Recap

You finished 0 of 5 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- A Jenkinsfile has stages and steps; a workflow has jobs and steps. Listed stages run in order, while jobs run in parallel by default.
- A registry stores images; a reference reads as registry, repository and tag.
- A Deployment rolls out a pushed image, a Service gives stable access, and an approval separates continuous delivery from continuous deployment.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Reading without JavaScript: decide first, then read on.

Where to act: Start from the example reference in the field.

Next step: Change one part at a time, and watch which line of the parser output changes.

Printed alternative: nginx reads as registry docker.io, repository library/nginx and tag latest, all assumed. ghcr.io/acme/shop-api:1.4.2 reads as registry ghcr.io, repository acme/shop-api and tag 1.4.2.

Where to act: Try the push-only action first.

Next step: Then ask what must change in the cluster, and which process includes a human decision.

Printed alternative: Pushing an image stores it and changes nothing in the cluster. Updating the Deployment rolls out new Pods at a controlled rate while the Service stays the same. A crashed Pod is replaced to restore the desired state. Continuous delivery has a manual approval before production; continuous deployment does not.

Reading without JavaScript: decide first, then read on.

- `latest` is only a default name.
- Pull by digest when you need the exact same image.
- This reading is optional and has no lab.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Jenkins Pipeline: declarative pipeline, stages and steps
- Using a Jenkinsfile
- Workflow syntax: jobs run in parallel by default
- Working with the Container registry: ghcr.io, pull by digest
- docker image tag: reference format, default registry and tag
- OCI Distribution Specification: repositories, tags, manifests
- Kubernetes overview
- Kubernetes Deployments: desired state, rollout
- Kubernetes Service: selector, stable access
- Continuous delivery vs continuous deployment: manual approval is the difference

## Static interaction alternatives

### predict

What does a new pull of 1.4.2 get? Each option is explained after the question in this reading.

### drag

Closest GitHub Actions counterpart Each row and its explanation follow in this reading.

### explore

nginx reads as registry docker.io, repository library/nginx and tag latest, all assumed. ghcr.io/acme/shop-api:1.4.2 reads as registry ghcr.io, repository acme/shop-api and tag 1.4.2.

### explore

Pushing an image stores it and changes nothing in the cluster. Updating the Deployment rolls out new Pods at a controlled rate while the Service stays the same. A crashed Pod is replaced to restore the desired state. Continuous delivery has a manual approval before production; continuous deployment does not.

### mcq

What is this pipeline? Each option is explained after the question in this reading.
