---
title: Just use button -- A11ycasts #05
channel: Chrome for Developers
url: https://www.youtube.com/watch?v=CZGqnp06DnI
runtimeMinutes: 7.57
embeddable: true
checkedAt: 2026-11-09
covers:
  - A div styled as a sign-up button has no focus, no keyboard support and is announced as a group (0:00 to 3:30)
  - Adding tabindex and click handlers to the div still leaves Enter and Space unhandled (3:30 to 5:04)
  - The native button element gives focus, keyboard activation and the button role for free (5:04 to 7:34)
gaps:
  - "o1: missing alternative text and missing labels are not covered; keyboard problems are"
  - "o3: checks one control with the keyboard rather than a whole page"
cautions:
  - First-party Chrome for Developers A11ycasts episode by Rob Dodson, published 2016-09-16; the button behavior shown is unchanged in current browsers
  - 3:30 to 5:04 adds JavaScript click and key handlers to show how much work a div needs; JavaScript is taught later in the course, so follow the idea rather than the code
  - Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description), the description and the caption track; the video was not watched end to end
alternates:
  - title: Controlling focus with tabindex -- A11ycasts #04 (Chrome for Developers)
    url: https://www.youtube.com/watch?v=Pe0Ce1WtnUM
    reason: 5:14 (314 s), 2016. tabindex 0, -1 and positive values and the focus order; supports o3 but not o2
rejected: []
---

# Video: Just use button -- A11ycasts #05

Chrome for Developers, 7:34 (454 s), https://www.youtube.com/watch?v=CZGqnp06DnI.
Live, public and embeddable on 2026-11-09 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

This video is optional. The topic page teaches every objective without it, and nothing in the page or its activities depends on watching it.

## Assigned segment

Watch the whole video, 0:00 to 7:34: 7.57 optional watch minutes.

## What it covers

Per the chapter markers on its YouTube watch page, its description and its captions:

- A div styled as a sign-up button has no focus, no keyboard support and is announced as a group (0:00 to 3:30).
- Adding tabindex and click handlers to the div still leaves Enter and Space unhandled (3:30 to 5:04).
- The native button element gives focus, keyboard activation and the button role for free (5:04 to 7:34).

## Gaps against the objectives

- o1: missing alternative text and missing labels are not covered; keyboard problems are.
- o3: checks one control with the keyboard rather than a whole page.

## Cautions

- First-party Chrome for Developers A11ycasts episode by Rob Dodson, published 2016-09-16; the button behavior shown is unchanged in current browsers.
- 3:30 to 5:04 adds JavaScript click and key handlers to show how much work a div needs; JavaScript is taught later in the course, so follow the idea rather than the code.
- Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description), the description and the caption track; the video was not watched end to end.

## Alternates

- Chrome for Developers, "Controlling focus with tabindex -- A11ycasts #04", https://www.youtube.com/watch?v=Pe0Ce1WtnUM: 5:14 (314 s), 2016. tabindex 0, -1 and positive values and the focus order; supports o3 but not o2.

## Rejected

- None recorded.
