---
title: "Docker concepts - Multi-stage builds"
channel: "Docker"
url: https://www.youtube.com/watch?v=vR185cjwxZ8
runtimeMinutes: 2.45
embeddable: true
checkedAt: 2026-10-14
covers:
  - "A Java example: a JDK builder stage compiles the jar and a JRE final stage takes it with COPY --from (o1, o3)"
  - "The last stage is the image; image sizes compared (o3)"
gaps:
  - "No Node and nginx front-end example (o2)"
  - "Not Spring-specific; short"
cautions:
  - "Part of the 2024 Docker Concepts series; the Docker docs pages no longer embed it"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Dockerize Spring Boot Wisely: 6 tips (BellSoft)"
    url: https://www.youtube.com/watch?v=dwVPvZAPaxQ
    reason: "6:23; Spring Boot and multi-stage builds, from a vendor channel that promotes Liberica JDK"
  - title: "Docker Multi-Stage Builds (Depot)"
    url: https://www.youtube.com/watch?v=_Q9KSFUZH0c
    reason: "6:30; Go and Node examples with a product plug"
rejected:
  - title: "Tech Primers multi-stage builds video"
    url: https://www.youtube.com/watch?v=9MAU-O5jWJg
    reason: "its caption track is Hindi, so its content could not be checked, and it dates from 2020"
  - title: "Learn With Ifte multi-stage builds video"
    url: https://www.youtube.com/watch?v=-UTkMgqCmnQ
    reason: "21:45 exceeds the budget"
---

# Video: Docker concepts - Multi-stage builds

Docker, 2:27 (147 s), https://www.youtube.com/watch?v=vR185cjwxZ8.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- A Java example: a JDK builder stage compiles the jar and a JRE final stage takes it with COPY --from (o1, o3)
- The last stage is the image; image sizes compared (o3)

## Gaps against the objectives

- No Node and nginx front-end example (o2)
- Not Spring-specific; short

## Cautions

- Part of the 2024 Docker Concepts series; the Docker docs pages no longer embed it
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Dockerize Spring Boot Wisely: 6 tips (BellSoft), https://www.youtube.com/watch?v=dwVPvZAPaxQ: 6:23; Spring Boot and multi-stage builds, from a vendor channel that promotes Liberica JDK.
- Docker Multi-Stage Builds (Depot), https://www.youtube.com/watch?v=_Q9KSFUZH0c: 6:30; Go and Node examples with a product plug.

## Rejected

- Tech Primers multi-stage builds video, https://www.youtube.com/watch?v=9MAU-O5jWJg: its caption track is Hindi, so its content could not be checked, and it dates from 2020.
- Learn With Ifte multi-stage builds video, https://www.youtube.com/watch?v=-UTkMgqCmnQ: 21:45 exceeds the budget.
