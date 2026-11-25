---
title: Does Storing JWT's In HTTP Only Cookies Stop XSS Attacks
channel: Dennis Ivy
url: https://www.youtube.com/watch?v=vq861XoZI9k
runtimeMinutes: 5.57
embeddable: true
checkedAt: 2026-11-09
covers:
  - Where a JSON Web Token can be stored: localStorage, a cookie or an HttpOnly cookie (0:00 to 1:23)
  - Script can read localStorage, so a cross-site scripting bug can steal a token stored there (1:23 to 2:46)
  - An HttpOnly cookie hides the token from script but does not stop every cross-site scripting attack (2:46 to 5:34)
gaps:
  - "o2: the Secure and SameSite attributes are not covered"
cautions:
  - Dennis Ivy, published 2021-05-27; an excerpt of a recorded conversation with Ben Awad rather than a scripted lesson
  - Fit was judged from the caption track; the video has no chapters and was not watched end to end
alternates: []
rejected:
  - title: Storing JWT tokens localStorage vs. Cookies (Ben Awad)
    url: https://www.youtube.com/watch?v=g21uHNIIewM
    reason: 6:54, 2017. Its captions never mention HttpOnly or cross-site scripting, the core of o1
---

# Video: Does Storing JWT's In HTTP Only Cookies Stop XSS Attacks

Dennis Ivy, 5:34 (334 s), https://www.youtube.com/watch?v=vq861XoZI9k.
Live, public and embeddable on 2026-11-09 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

This video is optional. The topic page teaches every objective without it, and nothing in the page or its activities depends on watching it.

## Assigned segment

Watch the whole video, 0:00 to 5:34: 5.57 optional watch minutes.

## What it covers

Per its description and captions (the video has no chapters):

- Where a JSON Web Token can be stored: localStorage, a cookie or an HttpOnly cookie (0:00 to 1:23).
- Script can read localStorage, so a cross-site scripting bug can steal a token stored there (1:23 to 2:46).
- An HttpOnly cookie hides the token from script but does not stop every cross-site scripting attack (2:46 to 5:34).

## Gaps against the objectives

- o2: the Secure and SameSite attributes are not covered.

## Cautions

- Dennis Ivy, published 2021-05-27; an excerpt of a recorded conversation with Ben Awad rather than a scripted lesson.
- Fit was judged from the caption track; the video has no chapters and was not watched end to end.

## Alternates

- None recorded.

## Rejected

- Ben Awad, "Storing JWT tokens localStorage vs. Cookies", https://www.youtube.com/watch?v=g21uHNIIewM: 6:54, 2017. Its captions never mention HttpOnly or cross-site scripting, the core of o1.
