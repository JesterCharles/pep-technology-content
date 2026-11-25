---
title: How To Prevent The Most Common Cross Site Scripting Attack
channel: Web Dev Simplified
url: https://www.youtube.com/watch?v=ns1LX6mEvyM
runtimeMinutes: 4.93
embeddable: true
checkedAt: 2026-11-09
covers:
  - How untrusted input inserted as HTML can run script (0:00 to 1:10)
  - An img tag with an onerror handler and a malicious URL as attack payloads (1:10 to 2:20)
  - Stealing cookies through the injected script (2:20 to 3:24)
  - Replacing innerHTML with a text-only property so input is shown, not run (3:24 to 4:56)
gaps:
  - "o3: rewriting several risky sinks in a code sample is left to the page"
cautions:
  - Web Dev Simplified, published 2018-10-11; the safe property is shown as innerText, while the page teaches textContent, which also renders text without parsing HTML
  - Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description) and from the caption track; the video was not watched end to end
alternates:
  - title: textContent vs innerHTML in the JavaScript DOM (dcode)
    url: https://www.youtube.com/watch?v=1UsllDMhvN4
    reason: 4:38, 2018. textContent versus innerHTML (o2); captions not reviewed
rejected:
  - title: Cross-Site Scripting: A 25-Year Threat That Is Still Going Strong (IBM Technology)
    url: https://www.youtube.com/watch?v=z4LhLJnmoZ0
    reason: 9:33, 2024. Conceptual security overview without the DOM APIs this topic teaches
---

# Video: How To Prevent The Most Common Cross Site Scripting Attack

Web Dev Simplified, 4:56 (296 s), https://www.youtube.com/watch?v=ns1LX6mEvyM.
Live, public and embeddable on 2026-11-09 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

This video is optional. The topic page teaches every objective without it, and nothing in the page or its activities depends on watching it.

## Assigned segment

Watch the whole video, 0:00 to 4:56: 4.93 optional watch minutes.

## What it covers

Per the chapter markers on its YouTube watch page, its description and its captions:

- How untrusted input inserted as HTML can run script (0:00 to 1:10).
- An img tag with an onerror handler and a malicious URL as attack payloads (1:10 to 2:20).
- Stealing cookies through the injected script (2:20 to 3:24).
- Replacing innerHTML with a text-only property so input is shown, not run (3:24 to 4:56).

## Gaps against the objectives

- o3: rewriting several risky sinks in a code sample is left to the page.

## Cautions

- Web Dev Simplified, published 2018-10-11; the safe property is shown as innerText, while the page teaches textContent, which also renders text without parsing HTML.
- Fit was judged from the chapter markers on the YouTube watch page (YouTube generates some of these automatically, so they need not appear in the description) and from the caption track; the video was not watched end to end.

## Alternates

- dcode, "textContent vs innerHTML in the JavaScript DOM", https://www.youtube.com/watch?v=1UsllDMhvN4: 4:38, 2018. textContent versus innerHTML (o2); captions not reviewed.

## Rejected

- IBM Technology, "Cross-Site Scripting: A 25-Year Threat That Is Still Going Strong", https://www.youtube.com/watch?v=z4LhLJnmoZ0: 9:33, 2024. Conceptual security overview without the DOM APIs this topic teaches.
