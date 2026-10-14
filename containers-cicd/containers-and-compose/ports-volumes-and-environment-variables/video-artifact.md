---
title: "Publishing ports"
channel: "Docker"
url: https://www.youtube.com/watch?v=9JnqOmJ96ds
runtimeMinutes: 2.97
embeddable: true
checkedAt: 2026-10-14
covers:
  - "-p HOST:CONTAINER, such as 8080:80 (o1)"
  - "EXPOSE versus -P, and ports in Compose"
gaps:
  - "Loopback binding with 127.0.0.1 was not confirmed (o1); the page teaches it"
  - "Volumes and bind mounts are not covered (o2); see the alternates"
  - "-e and --env-file are not covered (o3)"
cautions:
  - "Part of the 2024 Docker Concepts series"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Sharing Container Files Locally (Docker)"
    url: https://www.youtube.com/watch?v=2dAzsVg3Dek
    reason: "4:22; bind mounts versus volumes (o2)"
  - title: "Overriding container defaults (Docker)"
    url: https://www.youtube.com/watch?v=PFszWK3BB8I
    reason: "3:30; host-port overrides and a brief -e (o3)"
  - title: "Docker Volumes Explained (Sergei Usynin — Dev Notes)"
    url: https://www.youtube.com/watch?v=0MBHw-zeKOs
    reason: "4:27; clearest named volume versus bind mount, with PostgreSQL"
  - title: "Persisting container data (Docker)"
    url: https://www.youtube.com/watch?v=10_2BjqB_Ls
    reason: "3:01; volumes only"
rejected:
  - title: "Cloud Journey Docker ports video"
    url: https://www.youtube.com/watch?v=Ws-kVidSQ3w
    reason: "poor narration quality"
  - title: "Network Direction Docker networking video"
    url: https://www.youtube.com/watch?v=jTvUfTPVXsw
    reason: "Compose-based, with no -p or -e"
  - title: "TechRepublic Docker environment variables video"
    url: https://www.youtube.com/watch?v=WqiazgeOsiQ
    reason: "2020, environment variables only"
  - title: "CodeLucky Docker environment variables video"
    url: https://www.youtube.com/watch?v=O7sTHBFviq8
    reason: "environment variables only, generic"
  - title: "TechWorld with Nana Docker volumes video"
    url: https://www.youtube.com/watch?v=p2PH_YPCsis
    reason: "dated 2019"
---

# Video: Publishing ports

Docker, 2:58 (178 s), https://www.youtube.com/watch?v=9JnqOmJ96ds.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- -p HOST:CONTAINER, such as 8080:80 (o1)
- EXPOSE versus -P, and ports in Compose

## Gaps against the objectives

- Loopback binding with 127.0.0.1 was not confirmed (o1); the page teaches it
- Volumes and bind mounts are not covered (o2); see the alternates
- -e and --env-file are not covered (o3)

## Cautions

- Part of the 2024 Docker Concepts series
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Sharing Container Files Locally (Docker), https://www.youtube.com/watch?v=2dAzsVg3Dek: 4:22; bind mounts versus volumes (o2).
- Overriding container defaults (Docker), https://www.youtube.com/watch?v=PFszWK3BB8I: 3:30; host-port overrides and a brief -e (o3).
- Docker Volumes Explained (Sergei Usynin — Dev Notes), https://www.youtube.com/watch?v=0MBHw-zeKOs: 4:27; clearest named volume versus bind mount, with PostgreSQL.
- Persisting container data (Docker), https://www.youtube.com/watch?v=10_2BjqB_Ls: 3:01; volumes only.

## Rejected

- Cloud Journey Docker ports video, https://www.youtube.com/watch?v=Ws-kVidSQ3w: poor narration quality.
- Network Direction Docker networking video, https://www.youtube.com/watch?v=jTvUfTPVXsw: Compose-based, with no -p or -e.
- TechRepublic Docker environment variables video, https://www.youtube.com/watch?v=WqiazgeOsiQ: 2020, environment variables only.
- CodeLucky Docker environment variables video, https://www.youtube.com/watch?v=O7sTHBFviq8: environment variables only, generic.
- TechWorld with Nana Docker volumes video, https://www.youtube.com/watch?v=p2PH_YPCsis: dated 2019.
