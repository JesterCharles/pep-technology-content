---
title: Switch Expressions - Java Short
channel: Semantic Square
url: https://www.youtube.com/watch?v=2DmVrTaDRKQ
runtimeMinutes: 5.4
embeddable: true
checkedAt: 2026-10-13
covers:
  - A month-to-season switch statement with colon labels and break in every case (0:29 to 0:52)
  - A missing break letting control fall through into the next case and set the wrong season (0:52 to 1:20)
  - Arrow labels that need no break and do not fall through (1:41 to 2:47)
  - Several labels merged into one arrow case (2:47 to 2:56)
  - Assigning a switch expression to a variable, the default case it requires here, and yield inside a block (2:56 to 5:07)
gaps:
  - if, else if and else are not covered, so o1 is not covered
  - Fall-through is described for one missing break rather than traced through several cases
cautions:
  - Third-party educator channel (Semantic Square), published 2023-05-26; it describes switch expressions as a Java 14 feature, which still applies to Java 25
  - The default branch throws an exception, which is outside this topic
  - The description and closing line promote the presenter's paid course
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: Learn Java enhanced switches in 8 minutes! 💡 (Bro Code)
    url: https://www.youtube.com/watch?v=6q2JKiynteM
    reason: 8:37 (517 s). Replaces an else-if chain with an arrow-label switch statement, default and comma-separated labels per its captions; no switch expression that yields a value and no fall-through
  - title: Java Tutorial - Evaluate conditions with IF-ELSE (LinkedIn Learning)
    url: https://www.youtube.com/watch?v=YRhEqxvCzYY
    reason: 4:35 (275 s). if and else per its title (o1); captions not reviewed
  - title: "If Else Statement In Java Tutorial #17 (Alex Lee)"
    url: https://www.youtube.com/watch?v=yvWnj_HfG6s
    reason: 7:39 (459 s). if, else if and else per its title (o1); captions not reviewed
  - title: Java switch ⬇【4 minutes】 (Bro Code)
    url: https://www.youtube.com/watch?v=Om3qzMoaIUo
    reason: 4:45 (285 s). Colon-label switch with break, and the result when the breaks are removed, per its captions (o3); 2020, no arrow labels
rejected:
  - title: What's new in Java Switch | Switch Statement and Expression (Telusko)
    url: https://www.youtube.com/watch?v=AZb1wLIQ1R4
    reason: 11:08 (668 s) exceeds the 10-minute budget
---

# Video: Switch Expressions - Java Short

Semantic Square, 5:24 (324 s), https://www.youtube.com/watch?v=2DmVrTaDRKQ.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: a colon-label `switch` with `break` (0:29), fall-through from a missing `break` (0:52), arrow labels (1:41), merged labels (2:47), and a `switch` expression assigned to a variable, with `default` and `yield` (2:56).
It matches objectives o2 and o3.

## Gaps against the objectives

- o1: `if`, `else if` and `else` are not covered.
- o2: covered.
- o3: fall-through is described for one missing `break`, not traced across several cases.

## Alternates

- Bro Code, "Learn Java enhanced switches in 8 minutes!", https://www.youtube.com/watch?v=6q2JKiynteM, 8:37 (517 s). Else-if chain to arrow-label switch statement.
- LinkedIn Learning, "Java Tutorial - Evaluate conditions with IF-ELSE", https://www.youtube.com/watch?v=YRhEqxvCzYY, 4:35 (275 s). `if` and `else` (o1).
- Alex Lee, "If Else Statement In Java Tutorial #17", https://www.youtube.com/watch?v=yvWnj_HfG6s, 7:39 (459 s). `if`, `else if` and `else` (o1).
- Bro Code, "Java switch", https://www.youtube.com/watch?v=Om3qzMoaIUo, 4:45 (285 s). Colon-label `switch` with and without `break` (o3); no arrow labels.

## Rejected

- Telusko, "What's new in Java Switch | Switch Statement and Expression", https://www.youtube.com/watch?v=AZb1wLIQ1R4: 11:08 exceeds the 10-minute budget.
