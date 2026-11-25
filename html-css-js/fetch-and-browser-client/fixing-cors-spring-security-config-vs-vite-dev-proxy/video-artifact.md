---
title: CORS in 100 Seconds
channel: Fireship
url: https://www.youtube.com/watch?v=4KHiSt0oLJ0
runtimeMinutes: 2.52
embeddable: true
checkedAt: 2026-11-09
covers:
  - What an origin is and why the browser blocks frontend reads of cross-origin responses (0:00 to 0:50)
  - The Access-Control-Allow-Origin response header (0:50 to 1:11)
  - Preflight OPTIONS requests for non-simple requests (1:28 to 2:02)
  - Debugging CORS errors in the browser (2:02 to 2:31)
gaps:
  - "o2: the server fix is shown in Express rather than Spring Security, and the Vite dev-server proxy is not covered"
  - "o3: reading the network panel is only touched on"
cautions:
  - Fireship, published 2021-03-29; the 1:11 to 1:28 fix uses Express middleware, a framework this course does not teach; treat it as an example of the header only
  - Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description) and from the caption track; the video was not watched end to end
alternates:
  - title: Learn CORS In 6 Minutes (Web Dev Simplified)
    url: https://www.youtube.com/watch?v=PNtFSVU-YTI
    reason: 6:06 (366 s), 2021. Origins, preflight and credentials in more depth; its server is also Express
rejected: []
---

# Video: CORS in 100 Seconds

Fireship, 2:31 (151 s), https://www.youtube.com/watch?v=4KHiSt0oLJ0.
Live, public and embeddable on 2026-11-09 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

This video is optional. The topic page teaches every objective without it, and nothing in the page or its activities depends on watching it.

## Assigned segment

Watch the whole video, 0:00 to 2:31: 2.52 optional watch minutes.

## What it covers

Per the chapter markers on its YouTube watch page, its description and its captions:

- What an origin is and why the browser blocks frontend reads of cross-origin responses (0:00 to 0:50).
- The Access-Control-Allow-Origin response header (0:50 to 1:11).
- Preflight OPTIONS requests for non-simple requests (1:28 to 2:02).
- Debugging CORS errors in the browser (2:02 to 2:31).

## Gaps against the objectives

- o2: the server fix is shown in Express rather than Spring Security, and the Vite dev-server proxy is not covered.
- o3: reading the network panel is only touched on.

## Cautions

- Fireship, published 2021-03-29; the 1:11 to 1:28 fix uses Express middleware, a framework this course does not teach; treat it as an example of the header only.
- Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description) and from the caption track; the video was not watched end to end.

## Alternates

- Web Dev Simplified, "Learn CORS In 6 Minutes", https://www.youtube.com/watch?v=PNtFSVU-YTI: 6:06 (366 s), 2021. Origins, preflight and credentials in more depth; its server is also Express.

## Rejected

- None recorded.
