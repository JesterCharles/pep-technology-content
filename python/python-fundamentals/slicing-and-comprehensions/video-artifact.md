---
title: "Python Tutorial: Slicing Lists and Strings"
channel: Corey Schafer
url: https://www.youtube.com/watch?v=ajrtAuDg3yw
runtimeMinutes: 10.7
embeddable: true
checkedAt: 2026-10-14
covers:
  - Positive and negative indexes on a list of 0 to 9, where -1 is the last item (0:00 to 1:20)
  - "start:stop slices, the stop index not included, and mixing positive and negative indexes (1:27 to 3:32)"
  - Leaving out start or stop, and [:] giving a copy of the whole list (3:32 to 4:35)
  - A step of 2 that takes every second item (4:55 to 5:59)
  - A negative step, an empty result when start and stop point the wrong way, and [::-1] to reverse (5:59 to 7:26)
  - "The same rules on a string: reversing a URL, [-4:] for the top-level domain, [7:] and [7:-4] (7:46 to 10:35)"
gaps:
  - o2 is not covered: no list, set or dict comprehension
  - o3 is not covered: no choice between a comprehension and an explicit loop
cautions:
  - Third-party educator channel (Corey Schafer), published 2015-10-29; the slicing rules shown are unchanged in current Python 3
  - The captions call the empty result an "empty array"; in Python it is an empty list
  - The description links to the presenter's Patreon
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: "22. List Set Dict Comprehensions [Python 3 Programming Tutorials] (codebasics)"
    url: https://www.youtube.com/watch?v=fz2PKpPdlRo
    reason: "6:00 (359 s). Rewrites an even-number filter loop as a list comprehension, then set and dict comprehensions, per its captions (o2); no slicing"
  - title: "Python Lists: Indexing & Slicing (Real Python)"
    url: https://www.youtube.com/watch?v=KAXvMbD1Zac
    reason: "6:56 (416 s). Zero-based and negative list indexing and slicing per its captions (o1); lists only, no strings"
  - title: "Learn Python LIST COMPREHENSIONS in 10 minutes! (Bro Code)"
    url: https://www.youtube.com/watch?v=YlY2g2xrl6Q
    reason: "10:19 (619 s). List comprehensions per its title (o2); captions not reviewed; no set or dict comprehensions in the title"
rejected:
  - title: "#2: Python List, Set & Dictionary Comprehension | Python Best Practices (Programiz)"
    url: https://www.youtube.com/watch?v=TGaKzl6p4nA
    reason: "11:11 (671 s), within the 12-minute topic budget, but by its title it covers only comprehensions (o2) and would fill almost the whole topic budget for that one objective; the 6-minute codebasics alternate covers the same objective"
  - title: "Python Tutorial: Comprehensions - How they work and why you should be using them (Corey Schafer)"
    url: https://www.youtube.com/watch?v=3dt4OGnU5sM
    reason: 18:29 (1109 s) exceeds the 12-minute topic budget
---

# Video: Python Tutorial: Slicing Lists and Strings

Corey Schafer, 10:44 (644 s), https://www.youtube.com/watch?v=ajrtAuDg3yw.
Live, public and embeddable on 2026-10-14 (playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions, the video works through slicing on `my_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]` and then on a URL string.

- Indexes: `my_list[5]` is 5, `my_list[-1]` is the last item (9) and `my_list[-10]` is the first (0) (0:00 to 1:20).
- `my_list[0:5]` gives 0 to 4, because the stop index is not included; `[0:6]` gives 0 to 5. Positive and negative indexes can be mixed: `[-7:-2]` gives 3 to 7 (1:27 to 3:32).
- Leaving out the stop runs to the end (`[1:]`), leaving out the start runs from the beginning (`[:-1]`), and `[:]` copies the whole list (3:32 to 4:35).
- A third number is the step: `[2:-1:2]` gives 2, 4, 6, 8 (4:55 to 5:59).
- A negative step walks backwards. `[2:-1:-1]` is empty because it cannot get from 2 to 8 going backwards, `[-1:2:-1]` gives 9 down to 3, and `[::-1]` reverses the whole list (5:59 to 7:26).
- The same rules work on strings: `url[::-1]` reverses it, `url[-4:]` gives `.com`, `url[7:]` drops `http://` and `url[7:-4]` drops both (7:46 to 10:35).

It matches objective o1.

## Gaps against the objectives

- o1: covered.
- o2: not covered. There is no list, set or dict comprehension.
- o3: not covered. It does not compare a comprehension with an explicit loop.

## Alternates

- codebasics, "22. List Set Dict Comprehensions [Python 3 Programming Tutorials]", https://www.youtube.com/watch?v=fz2PKpPdlRo, 6:00 (359 s). A filter loop rewritten as a list comprehension, then set and dict comprehensions (o2).
- Real Python, "Python Lists: Indexing & Slicing", https://www.youtube.com/watch?v=KAXvMbD1Zac, 6:56 (416 s). List indexing and slicing (o1).
- Bro Code, "Learn Python LIST COMPREHENSIONS in 10 minutes!", https://www.youtube.com/watch?v=YlY2g2xrl6Q, 10:19 (619 s). List comprehensions (o2).

## Rejected

- Programiz, "#2: Python List, Set & Dictionary Comprehension", https://www.youtube.com/watch?v=TGaKzl6p4nA: 11:11 is within the 12-minute topic budget, but by its title it covers only comprehensions (o2) and would fill almost the whole topic budget for that one objective; the 6-minute codebasics alternate covers the same objective.
- Corey Schafer, "Python Tutorial: Comprehensions - How they work and why you should be using them", https://www.youtube.com/watch?v=3dt4OGnU5sM: 18:29 exceeds the 12-minute topic budget.
