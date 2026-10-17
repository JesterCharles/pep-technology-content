---
title: How to Navigate the Terminal with Bash [5 of 20] | Bash for Beginners
channel: Microsoft Developer
url: https://www.youtube.com/watch?v=jq-it7dRpt4
runtimeMinutes: 6.1
embeddable: true
checkedAt: 2026-10-12
covers:
  - pwd to report the current working directory (chapter at 0:00)
  - cd to move between folders (chapter at 1:28)
gaps:
  - ls and ls -a are not in this episode; they are in episode 6 of the same series (see alternates)
  - Moving into a folder name that contains a space, with quoting or escaping, is not listed in the description or chapters
  - Absolute, relative, home (~) and parent (..) paths are not named in the description or chapters; coverage is unconfirmed
cautions:
  - First-party source, the Microsoft Developer channel, part 5 of the 20-part Bash for Beginners series (published 2023-02-15)
  - From 3:35 it covers pushd and popd and from 2:25 a stack, which the page does not teach; learners can stop at 2:25
  - Fit was judged from the video description and chapter markers; the video was not watched end to end and no transcript was read
  - Recorded in GitHub Codespaces; prompt and colours differ from a plain Linux terminal
alternates:
  - title: How to List Content in the Terminal with Bash [6 of 20] | Bash for Beginners (Microsoft Developer)
    url: https://www.youtube.com/watch?v=68s9xiC2EkQ
    reason: 3:40 (220 s). First-party; covers ls and file per its description; pairs with the chosen episode for o1
  - title: "Linux File System: Root, pwd, ls, cd & Absolute vs Relative Paths (AIDDers)"
    url: https://www.youtube.com/watch?v=vBSvCwO8VuM
    reason: 3:49 (229 s). Legacy pick (2026-10-07); covers pwd, ls -a, cd, absolute and relative paths. Third-party channel, not an official source; very new channel (39 views at check time)
  - title: Absolute and Relative Paths (Udacity)
    url: https://www.youtube.com/watch?v=ephId3mYu9o
    reason: 2:16 (136 s). Covers o2 only; no pwd, ls or cd
rejected:
  - title: "Lecture 1: Course Overview + Introduction to the Shell (MIT Missing Semester)"
    url: https://www.youtube.com/watch?v=MSgoeuMqUmU
    reason: university course channel, but 1:14:44 exceeds the 8-minute budget
  - title: Command Line - CS50 Shorts (CS50)
    url: https://www.youtube.com/watch?v=BnJ013X02b8
    reason: university course channel, but 17:52 exceeds the 8-minute budget
---

# Video: How to Navigate the Terminal with Bash

Microsoft Developer, Bash for Beginners part 5 of 20, 6:07 (367 s), https://www.youtube.com/watch?v=jq-it7dRpt4.
Live, public and embeddable on 2026-10-12 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its chapter markers: `pwd` (0:00), `cd` (1:28), a stack (2:25), and `pushd` / `popd` (3:35).
It matches objective o1 (`pwd` half) and o3 (`cd`); the page's own simulator carries `ls -a` and the space-in-name case.

## Gaps against the objectives

- o1: `ls` and `ls -a` are not in this episode.
- o2: absolute, relative, `~` and `..` paths are not named in the description; unconfirmed.
- o3: a folder name with a space is not covered according to the description.

## Alternates

- Microsoft Developer, "How to List Content in the Terminal with Bash [6 of 20] | Bash for Beginners", https://www.youtube.com/watch?v=68s9xiC2EkQ, 3:40 (220 s). First-party; covers `ls` and `file` per its description; pairs with the chosen episode for o1.
- AIDDers, "Linux File System: Root, pwd, ls, cd & Absolute vs Relative Paths", https://www.youtube.com/watch?v=vBSvCwO8VuM, 3:49 (229 s). Legacy pick (2026-10-07); covers `pwd`, `ls -a`, `cd`, absolute and relative paths. Third-party channel, not an official source; very new channel (39 views at check time).
- Udacity, "Absolute and Relative Paths", https://www.youtube.com/watch?v=ephId3mYu9o, 2:16 (136 s). Covers o2 only; no `pwd`, `ls` or `cd`.

## Rejected

- MIT Missing Semester, "Lecture 1: Course Overview + Introduction to the Shell", https://www.youtube.com/watch?v=MSgoeuMqUmU: university course channel, but 1:14:44 exceeds the 8-minute budget.
- CS50, "Command Line - CS50 Shorts", https://www.youtube.com/watch?v=BnJ013X02b8: university course channel, but 17:52 exceeds the 8-minute budget.
