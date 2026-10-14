---
title: "Docker Compose Explained: One File, One Command"
channel: "Sergei Usynin — Dev Notes"
url: https://www.youtube.com/watch?v=9B8ttkKt8o4
runtimeMinutes: 5.9
embeddable: true
checkedAt: 2026-10-14
covers:
  - "Services in one compose.yaml, a PostgreSQL named volume and docker compose up (o1, o3)"
  - "Environment settings for the services (o2)"
gaps:
  - "Uses Flask, not Spring Boot (o1, o2)"
  - "The password is not shown coming from ${VAR} and an untracked .env (o2)"
  - "docker compose down -v is not confirmed (o3)"
cautions:
  - "Third-party channel, not an official source"
  - "Also shows depends_on and service-name DNS, taught in later topics"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Docker Compose with SpringBoot and PostgreSQL (Geekific)"
    url: https://www.youtube.com/watch?v=6GoEfLsTI1E
    reason: "7:59; Spring Boot and PostgreSQL, but uses the legacy docker-compose command and a top-level version key"
  - title: "What is Docker Compose? (Docker)"
    url: https://www.youtube.com/watch?v=xhcUIK4fGtY
    reason: "2:35; official, a general introduction"
rejected:
  - title: "Dan Vega spring-boot-docker-compose video"
    url: https://www.youtube.com/watch?v=lS1GwdIfk0c
    reason: "about the spring-boot-docker-compose module, where the app runs on the host: a different model"
  - title: "Dan Vega Docker Compose video"
    url: https://www.youtube.com/watch?v=NOrwxSI_VIg
    reason: "11:34 exceeds the 9-minute budget"
  - title: "Techtter Spring Boot Compose video"
    url: https://www.youtube.com/watch?v=ZZ2Llh4NhaY
    reason: "19:51 exceeds the budget"
  - title: "Docker Spring AI Compose video"
    url: https://www.youtube.com/watch?v=CZqNSjKK_yw
    reason: "about AI agents and needs a GPU"
  - title: "Spring Boot managed Compose video"
    url: https://www.youtube.com/watch?v=cqpfiT_tvAI
    reason: "Boot-managed Compose, dense and niche"
---

# Video: Docker Compose Explained: One File, One Command

Sergei Usynin — Dev Notes, 5:54 (354 s), https://www.youtube.com/watch?v=9B8ttkKt8o4.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- Services in one compose.yaml, a PostgreSQL named volume and docker compose up (o1, o3)
- Environment settings for the services (o2)

## Gaps against the objectives

- Uses Flask, not Spring Boot (o1, o2)
- The password is not shown coming from ${VAR} and an untracked .env (o2)
- docker compose down -v is not confirmed (o3)

## Cautions

- Third-party channel, not an official source
- Also shows depends_on and service-name DNS, taught in later topics
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Docker Compose with SpringBoot and PostgreSQL (Geekific), https://www.youtube.com/watch?v=6GoEfLsTI1E: 7:59; Spring Boot and PostgreSQL, but uses the legacy docker-compose command and a top-level version key.
- What is Docker Compose? (Docker), https://www.youtube.com/watch?v=xhcUIK4fGtY: 2:35; official, a general introduction.

## Rejected

- Dan Vega spring-boot-docker-compose video, https://www.youtube.com/watch?v=lS1GwdIfk0c: about the spring-boot-docker-compose module, where the app runs on the host: a different model.
- Dan Vega Docker Compose video, https://www.youtube.com/watch?v=NOrwxSI_VIg: 11:34 exceeds the 9-minute budget.
- Techtter Spring Boot Compose video, https://www.youtube.com/watch?v=ZZ2Llh4NhaY: 19:51 exceeds the budget.
- Docker Spring AI Compose video, https://www.youtube.com/watch?v=CZqNSjKK_yw: about AI agents and needs a GPU.
- Spring Boot managed Compose video, https://www.youtube.com/watch?v=cqpfiT_tvAI: Boot-managed Compose, dense and niche.
