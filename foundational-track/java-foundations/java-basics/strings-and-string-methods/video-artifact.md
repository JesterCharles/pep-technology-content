---
title: Java String methods 💬
channel: Bro Code
url: https://www.youtube.com/watch?v=P9hEmbfdiuc
runtimeMinutes: 6.3
embeddable: true
checkedAt: 2026-10-13
covers:
  - A String as a reference type whose methods are reached with a dot (0:25 to 0:52)
  - equals and equalsIgnoreCase returning a boolean (0:55 to 1:55)
  - length returning an int, and charAt with zero-based indexes (1:56 to 2:58)
  - indexOf returning the index of a character, and isEmpty (3:00 to 4:07)
  - toUpperCase, toLowerCase, trim and replace, each stored in a separate result variable (4:08 to 5:45)
gaps:
  - Concatenation and text blocks are not shown, so o1 is not covered
  - substring is not shown, and whitespace removal uses trim rather than strip
  - Immutability is never stated; results are stored in a new variable but the video does not say the original String is unchanged
cautions:
  - Third-party educator channel (Bro Code), published 2020-10-19; the methods shown are unchanged in current Java
  - Recorded in Eclipse; the IDE and its autocomplete list differ from the course's IDE
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: Java Strings are Immutable - Here's What That Actually Means (Coding with John)
    url: https://www.youtube.com/watch?v=Bj9Mx_Lx3q4
    reason: 7:06 (426 s). Reassigning a variable versus changing a String object, and the string pool, per its captions (o3)
  - title: substring And length (Java String Methods) (Bill Barnum)
    url: https://www.youtube.com/watch?v=VpYBR9lAhTk
    reason: 5:23 (323 s). substring and length with zero-based indexes, per its title (o2); captions not reviewed
  - title: Introduction to Text Blocks (Java)
    url: https://www.youtube.com/watch?v=HQIrpm4VZpw
    reason: 1:17 (77 s). First-party Oracle Learn.java series on text blocks (o1); captions not reviewed. Unlisted on YouTube, reachable from the channel's public Learn.java playlist
rejected:
  - title: "Text Blocks - JEP Café #5 (Java)"
    url: https://www.youtube.com/watch?v=NDaA9MrTLBM
    reason: first-party, but 10:37 (637 s) exceeds the 10-minute budget
  - title: Java substrings are easy! 📧 (Bro Code)
    url: https://www.youtube.com/watch?v=44iQGNUcik0
    reason: 8:05 (485 s), but covers substring alone; the chosen video covers more of o2
---

# Video: Java String methods

Bro Code, 6:18 (378 s), https://www.youtube.com/watch?v=P9hEmbfdiuc.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: `equals` and `equalsIgnoreCase` (0:55), `length` and zero-based `charAt` (1:56), `indexOf` and `isEmpty` (3:00), then `toUpperCase`, `toLowerCase`, `trim` and `replace` (4:08).
It matches most of objective o2.

## Gaps against the objectives

- o1: concatenation and text blocks are not shown.
- o2: `substring` is missing, and `trim` is shown instead of `strip`.
- o3: immutability is not stated.

## Alternates

- Coding with John, "Java Strings are Immutable - Here's What That Actually Means", https://www.youtube.com/watch?v=Bj9Mx_Lx3q4, 7:06 (426 s). Covers o3.
- Bill Barnum, "substring And length (Java String Methods)", https://www.youtube.com/watch?v=VpYBR9lAhTk, 5:23 (323 s). `substring` and `length` (o2).
- Java, "Introduction to Text Blocks", https://www.youtube.com/watch?v=HQIrpm4VZpw, 1:17 (77 s). First-party Learn.java; text blocks (o1). Unlisted.

## Rejected

- Java, "Text Blocks - JEP Café #5", https://www.youtube.com/watch?v=NDaA9MrTLBM: 10:37 exceeds the 10-minute budget.
- Bro Code, "Java substrings are easy!", https://www.youtube.com/watch?v=44iQGNUcik0: covers `substring` only.
