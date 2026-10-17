---
title: "Linux Pipes & Grep: Standard Streams Explained"
channel: TechTooniya
url: https://www.youtube.com/watch?v=lUd_rxHCiNI
runtimeMinutes: 2.8
embeddable: true
checkedAt: 2026-10-12
covers:
  - What a pipe passes from one command's output to the next command's input (animated)
  - Filtering lines with grep in pipelines such as cat /etc/passwd | grep root and ps aux | grep bash
  - Inverting a match with grep -v (per the video description)
gaps:
  - grep -i (ignore case) was not seen in the legacy frame review
  - Counting matches by piping into wc -l was not seen
cautions:
  - Third-party channel, not an official source
  - Very new, low-audience channel (published 2026-06-08; 16 views at check time)
  - Fit comes from the 2026-10-07 legacy storyboard-frame and description review; not watched end to end and no transcript was read
  - Also covers stdin, stdout and stderr and head, beyond the page
alternates:
  - title: "Pipes, Grep, Sort Commands: Linux Tutorial 9 (Guru99)"
    url: https://www.youtube.com/watch?v=VgbnndezHbw
    reason: 5:58 in search results. Third-party; under budget; not reviewed for fit
rejected:
  - title: How to Use Redirection and Pipelines in Bash [11 of 20] | Bash for Beginners (Microsoft Developer)
    url: https://www.youtube.com/watch?v=l2kodNMKroQ
    reason: first-party, but 9:50 (590 s) exceeds the 6-minute budget, and pipelines start only at 7:10
  - title: Using grep, sed, and awk in the real world | Into the Terminal 200 (Red Hat Enterprise Linux)
    url: https://www.youtube.com/watch?v=pWJq5vyMSaI
    reason: first-party, but 1:08:09 exceeds the budget
---

# Video: Linux Pipes & Grep

TechTooniya, 2:49 (169 s), https://www.youtube.com/watch?v=lUd_rxHCiNI.
Live, public and embeddable on 2026-10-12 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

An animated explanation of a pipe and of grep filtering, with terminal demos such as `cat /etc/passwd | grep root`, `ps aux | grep bash`, `ls /usr/bin | grep zip` and `ls -l /etc | head -n 5`.
Matches objective o1 and most of o2.

## Gaps against the objectives

- o2: `grep -i` not seen.
- o3: `grep ... | wc -l` not seen.

## Cautions

Third-party channel, not an official source.
No first-party video within the 6-minute budget was found (see rejected).

## Alternates

- Guru99, "Pipes, Grep, Sort Commands: Linux Tutorial 9", https://www.youtube.com/watch?v=VgbnndezHbw, 5:58 in search results. Third-party; under budget; not reviewed for fit.

## Rejected

- Microsoft Developer, "How to Use Redirection and Pipelines in Bash [11 of 20] | Bash for Beginners", https://www.youtube.com/watch?v=l2kodNMKroQ: first-party, but 9:50 (590 s) exceeds the 6-minute budget, and pipelines start only at 7:10.
- Red Hat Enterprise Linux, "Using grep, sed, and awk in the real world | Into the Terminal 200", https://www.youtube.com/watch?v=pWJq5vyMSaI: first-party, but 1:08:09 exceeds the budget.
- Nir Lichtman, "Linux Pipes Explained in 3 Minutes": shows the C pipe() system call, not shell pipelines (legacy review).
