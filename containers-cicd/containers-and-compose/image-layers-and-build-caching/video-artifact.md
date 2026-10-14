---
title: "How to Write a Dockerfile: Layers, Caching"
channel: "Sergei Usynin — Dev Notes"
url: https://www.youtube.com/watch?v=Tlj801RSci0
runtimeMinutes: 3.87
embeddable: true
checkedAt: 2026-10-14
covers:
  - "Each instruction adds a layer, and a change invalidates later steps (o1)"
  - "Copying dependency files and installing before copying source (o2)"
  - "A missing .dockerignore named as a common mistake (o3)"
gaps:
  - ".dockerignore entries are mentioned, not listed in detail (o3)"
cautions:
  - "Third-party channel, not an official source"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Master Docker Caching: Speed Up Builds & Shrink Images (ClearCS)"
    url: https://www.youtube.com/watch?v=BSEhYC_NNMk
    reason: "7:44; covers all three objectives, but its second half moves on to multi-stage builds and cache mounts"
  - title: "Understanding image layers (Docker)"
    url: https://www.youtube.com/watch?v=wJwqtAkmtQA
    reason: "2:23; official; invalidation rules only"
  - title: "Using the build cache (Docker)"
    url: https://www.youtube.com/watch?v=Ri6jMknjprY
    reason: "3:14; official; no dependency ordering or .dockerignore"
rejected:
  - title: "Benjamin Porter video on Docker caching"
    url: https://www.youtube.com/watch?v=RP-z4dqRTZA
    reason: "8:20 exceeds the 8-minute budget"
  - title: "Net Ninja Docker caching lesson"
    url: https://www.youtube.com/watch?v=_nMpndIyaBU
    reason: "9:52 exceeds the budget"
  - title: "Docker layer caching video"
    url: https://www.youtube.com/watch?v=uZ6t1uFM_-k
    reason: "8:07 exceeds the budget"
  - title: "Depot video on Docker layer caching"
    url: https://www.youtube.com/watch?v=tQgpBRfr5EY
    reason: "mostly layer internals plus a product pitch"
  - title: "Soof Golan BuildKit cache video"
    url: https://www.youtube.com/watch?v=YPDar18CftA
    reason: "about BuildKit cache mounts, with profanity"
  - title: "Net Ninja .dockerignore lesson"
    url: https://www.youtube.com/watch?v=UHWCkDbN0yM
    reason: "depends on earlier lessons in its series"
---

# Video: How to Write a Dockerfile: Layers, Caching

Sergei Usynin — Dev Notes, 3:52 (232 s), https://www.youtube.com/watch?v=Tlj801RSci0.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- Each instruction adds a layer, and a change invalidates later steps (o1)
- Copying dependency files and installing before copying source (o2)
- A missing .dockerignore named as a common mistake (o3)

## Gaps against the objectives

- .dockerignore entries are mentioned, not listed in detail (o3)

## Cautions

- Third-party channel, not an official source
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Master Docker Caching: Speed Up Builds & Shrink Images (ClearCS), https://www.youtube.com/watch?v=BSEhYC_NNMk: 7:44; covers all three objectives, but its second half moves on to multi-stage builds and cache mounts.
- Understanding image layers (Docker), https://www.youtube.com/watch?v=wJwqtAkmtQA: 2:23; official; invalidation rules only.
- Using the build cache (Docker), https://www.youtube.com/watch?v=Ri6jMknjprY: 3:14; official; no dependency ordering or .dockerignore.

## Rejected

- Benjamin Porter video on Docker caching, https://www.youtube.com/watch?v=RP-z4dqRTZA: 8:20 exceeds the 8-minute budget.
- Net Ninja Docker caching lesson, https://www.youtube.com/watch?v=_nMpndIyaBU: 9:52 exceeds the budget.
- Docker layer caching video, https://www.youtube.com/watch?v=uZ6t1uFM_-k: 8:07 exceeds the budget.
- Depot video on Docker layer caching, https://www.youtube.com/watch?v=tQgpBRfr5EY: mostly layer internals plus a product pitch.
- Soof Golan BuildKit cache video, https://www.youtube.com/watch?v=YPDar18CftA: about BuildKit cache mounts, with profanity.
- Net Ninja .dockerignore lesson, https://www.youtube.com/watch?v=UHWCkDbN0yM: depends on earlier lessons in its series.
