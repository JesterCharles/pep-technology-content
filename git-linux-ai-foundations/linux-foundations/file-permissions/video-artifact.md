---
title: Linux File Permissions
channel: Boot dev
url: https://www.youtube.com/watch?v=36UZr9XQ9o4
runtimeMinutes: 2.1
embeddable: true
checkedAt: 2026-10-12
covers:
  - Reading a permission string such as drwxr-xr-- with the leading type character
  - The three rwx groups for owner, group and others, with read, write and execute per group
gaps:
  - Numeric modes such as 750 (r = 4, w = 2, x = 1) were not seen
  - Changing permissions with chmod was not seen
  - Why ./script.sh needs x but bash script.sh does not was not seen
cautions:
  - Third-party channel, not an official source (Boot.dev, a commercial learning platform)
  - Fit comes from the 2026-10-07 legacy storyboard-frame review; not watched end to end and no transcript was read
  - Covers objective o1 only
alternates: []
rejected: []
---

# Video: Linux File Permissions

Boot dev, 2:08 (128 s), https://www.youtube.com/watch?v=36UZr9XQ9o4.
Live, public and embeddable on 2026-10-12 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted; published 2024-04-04).

## What it covers

Reading an `ls -l` permission string: type character, then `rwx` for owner, group and others.
Matches objective o1.

## Gaps against the objectives

- o2: no `chmod` and no numeric modes.
- o3: no executable-bit explanation for `./script.sh` versus `bash script.sh`.

## Cautions

Third-party channel, not an official source.
Both first-party candidates found exceed the 7-minute budget (see rejected).

## Alternates

- TECHtalk, "How to use the chmod command: 2-Minute Linux Tips", https://www.youtube.com/watch?v=XZLBJfQ6jTc, 2:02 (122 s). Third-party; description says it covers `chmod` and both notations (o2), fit not confirmed from frames.

## Rejected

- Red Hat, "Linux file permissions and chmod explained | RHEL Field Guide", https://www.youtube.com/watch?v=cBeHlHlIf5c: first-party and the best topical fit (ls -l string, octal 644 and 777), but 12:35 (755 s) exceeds the 7-minute budget.
- Microsoft Developer, "How to Modify File Permissions in Bash [12 of 20] | Bash for Beginners", https://www.youtube.com/watch?v=lOX2iKTMWWA: first-party, but 9:41 (581 s) exceeds the budget.
