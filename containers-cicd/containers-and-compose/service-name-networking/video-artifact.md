---
title: "Docker Networks Explained: How Containers Talk to Each Other"
channel: "Sergei Usynin — Dev Notes"
url: https://www.youtube.com/watch?v=5i69QEDuFoM
runtimeMinutes: 5.22
embeddable: true
checkedAt: 2026-10-14
covers:
  - "A curl to localhost failing because localhost means this container (o1)"
  - "The embedded DNS server resolving names to containers (o2)"
gaps:
  - "Uses docker network create and --network, not Compose (o2)"
  - "Host port versus container port is not compared (o3)"
cautions:
  - "Third-party channel, not an official source"
  - "Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author"
alternates:
  - title: "Docker Compose Networks: Container Communication Explained! (CodeLucky)"
    url: https://www.youtube.com/watch?v=mxoFU025Lco
    reason: "3:47; the Compose default network and service names as hostnames; synthetic narration"
  - title: "Docker Compose Service Names (CodeLucky)"
    url: https://www.youtube.com/watch?v=6XJusUamN_4
    reason: "2:54; its example uses an obsolete version key"
rejected:
  - title: "Nick Janetakis Docker networking video"
    url: https://www.youtube.com/watch?v=zcGUd77Yz1M
    reason: "13:04 exceeds the 7-minute budget"
  - title: "TheCodeForge Docker Compose video"
    url: https://www.youtube.com/watch?v=fjzsmVHPhl0
    reason: "10:22 exceeds the budget"
  - title: "KodeKloud Docker networking video"
    url: https://www.youtube.com/watch?v=W7X6u2BGVRY
    reason: "about bridge networks and NAT, not service names"
  - title: "Docker Compose networking (Docker, 2016)"
    url: https://www.youtube.com/watch?v=rFQqiuFIjms
    reason: "Compose 1.6, outdated"
---

# Video: Docker Networks Explained: How Containers Talk to Each Other

Sergei Usynin — Dev Notes, 5:13 (313 s), https://www.youtube.com/watch?v=5i69QEDuFoM.
Live, public and embeddable when checked on 2026-10-14 (oEmbed HTTP 200; receipt in video.json).

## What it covers

- A curl to localhost failing because localhost means this container (o1)
- The embedded DNS server resolving names to containers (o2)

## Gaps against the objectives

- Uses docker network create and --network, not Compose (o2)
- Host port versus container port is not compared (o3)

## Cautions

- Third-party channel, not an official source
- Fit comes from the transcript and chapter review made by the search assistant on 2026-10-13; not watched end to end by the author

## Alternates

- Docker Compose Networks: Container Communication Explained! (CodeLucky), https://www.youtube.com/watch?v=mxoFU025Lco: 3:47; the Compose default network and service names as hostnames; synthetic narration.
- Docker Compose Service Names (CodeLucky), https://www.youtube.com/watch?v=6XJusUamN_4: 2:54; its example uses an obsolete version key.

## Rejected

- Nick Janetakis Docker networking video, https://www.youtube.com/watch?v=zcGUd77Yz1M: 13:04 exceeds the 7-minute budget.
- TheCodeForge Docker Compose video, https://www.youtube.com/watch?v=fjzsmVHPhl0: 10:22 exceeds the budget.
- KodeKloud Docker networking video, https://www.youtube.com/watch?v=W7X6u2BGVRY: about bridge networks and NAT, not service names.
- Docker Compose networking (Docker, 2016), https://www.youtube.com/watch?v=rFQqiuFIjms: Compose 1.6, outdated.
