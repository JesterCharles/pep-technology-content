---
title: "Docker Compose Control Container Order with depends_on"
channel: "WittCode"
url: https://www.youtube.com/watch?v=pCY6khpKqM4
runtimeMinutes: 4.28
embeddable: true
checkedAt: 2026-10-14
covers:
  - "Short depends_on producing ECONNREFUSED while the database starts (o1)"
  - "Long syntax with condition: service_healthy and a CMD-SHELL pg_isready healthcheck with interval and retries (o2)"
gaps:
  - "Uses Node, not Spring Boot"
  - "start_period and reading health states in docker compose ps are not covered (o3)"
cautions:
  - "Third-party channel with a self-promotion plug"
  - "Whether its YAML has an obsolete version key was not visible"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Docker Best Practices (Sergei Usynin — Dev Notes)"
    url: https://www.youtube.com/watch?v=01dB-u69jTU
    reason: "6:26; the first two minutes explain a PostgreSQL healthcheck and depends_on; the rest is off-topic"
  - title: "Alex Hitt Compose healthcheck video"
    url: https://www.youtube.com/watch?v=vED2RXRnHRU
    reason: "5:16; a Redis healthcheck with service_healthy"
rejected:
  - title: "TheCodeForge Docker Compose video"
    url: https://www.youtube.com/watch?v=fjzsmVHPhl0
    reason: "10:22 exceeds the 10-minute budget"
  - title: "Giovanni Pace healthcheck video"
    url: https://www.youtube.com/watch?v=bE_8yVmC9ow
    reason: "in Italian"
  - title: "Nick Janetakis depends_on video"
    url: https://www.youtube.com/watch?v=D8JwmDDg0ns
    reason: "about required: false"
  - title: "CodeLucky depends_on video"
    url: https://www.youtube.com/watch?v=Z-8-yXLFF-U
    reason: "basics only"
  - title: "DheerajTechInsight Compose video"
    url: https://www.youtube.com/watch?v=CsIZy4mBM5A
    reason: "16:47 exceeds the budget"
---

# Video: Docker Compose Control Container Order with depends_on

WittCode, 4:17 (257 s), https://www.youtube.com/watch?v=pCY6khpKqM4.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- Short depends_on producing ECONNREFUSED while the database starts (o1)
- Long syntax with condition: service_healthy and a CMD-SHELL pg_isready healthcheck with interval and retries (o2)

## Gaps against the objectives

- Uses Node, not Spring Boot
- start_period and reading health states in docker compose ps are not covered (o3)

## Cautions

- Third-party channel with a self-promotion plug
- Whether its YAML has an obsolete version key was not visible
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Docker Best Practices (Sergei Usynin — Dev Notes), https://www.youtube.com/watch?v=01dB-u69jTU: 6:26; the first two minutes explain a PostgreSQL healthcheck and depends_on; the rest is off-topic.
- Alex Hitt Compose healthcheck video, https://www.youtube.com/watch?v=vED2RXRnHRU: 5:16; a Redis healthcheck with service_healthy.

## Rejected

- TheCodeForge Docker Compose video, https://www.youtube.com/watch?v=fjzsmVHPhl0: 10:22 exceeds the 10-minute budget.
- Giovanni Pace healthcheck video, https://www.youtube.com/watch?v=bE_8yVmC9ow: in Italian.
- Nick Janetakis depends_on video, https://www.youtube.com/watch?v=D8JwmDDg0ns: about required: false.
- CodeLucky depends_on video, https://www.youtube.com/watch?v=Z-8-yXLFF-U: basics only.
- DheerajTechInsight Compose video, https://www.youtube.com/watch?v=CsIZy4mBM5A: 16:47 exceeds the budget.
