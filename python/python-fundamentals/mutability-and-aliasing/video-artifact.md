---
title: Assignment vs Mutation in Python
channel: Python Morsels
url: https://www.youtube.com/watch?v=GXSxIt8Ofik
runtimeMinutes: 3.1
embeddable: true
checkedAt: 2026-10-14
covers:
  - Two variables that point to the same list after b = a (0:00 to 0:20)
  - Appending through b and seeing a grow too, because both names point to one object (0:20 to 1:02)
  - Tuples, numbers and strings cannot be changed; lists, dicts and sets are mutable, and changing them is a mutation (1:02 to 1:23)
  - Assigning b to a new list leaves a unchanged (1:23 to 2:19)
  - "The two kinds of change: assignment changes a variable, mutation changes an object (2:19 to 3:07)"
gaps:
  - o1 is partly covered; passing a list to a function and checking identity with is are not shown
  - o2 is covered by name only; it states which types are mutable but predicts no operations on them
  - o3 is not covered; copying with a slice, list(), dict.copy() or copy.deepcopy, and mutable default arguments, are not shown
cautions:
  - Third-party educator channel (Python Morsels, a Python training site), published 2024-05-18
  - The description links to the channel's article and screencast site
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: Variables are pointers in Python (Python Morsels)
    url: https://www.youtube.com/watch?v=g-iNz91YyGw
    reason: "3:12 (192 s). b = a then append, the same id for both names, and copying with a slice, list() or list.copy() per its captions (o1, part of o3)"
  - title: Immutable vs Mutable Objects in Python (Real Python)
    url: https://www.youtube.com/watch?v=p9ppfvHv2Us
    reason: "9:55 (595 s). List vs tuple item assignment, which types are mutable, and a tuple that holds a list per its captions (o2)"
  - title: Mutable default arguments in Python (Python Morsels)
    url: https://www.youtube.com/watch?v=1PTx3-mAO1E
    reason: "3:48 (228 s). Default values evaluated once and shared, per its description chapters (part of o3); captions not reviewed"
  - title: "Python Quick Tip: The Difference Between == and is (Equality vs Identity) (Corey Schafer)"
    url: https://www.youtube.com/watch?v=mO_dS3rXDIs
    reason: "8:51 (531 s). Equality versus identity per its title (the is check in o1); captions not reviewed"
rejected:
  - title: "Python Tutorial: Clarifying the Issues with Mutable Default Arguments (Corey Schafer)"
    url: https://www.youtube.com/watch?v=_JGmemuINww
    reason: 16:04 (964 s) exceeds the 12-minute topic budget
  - title: "Programming Terms: Mutable vs Immutable (Corey Schafer)"
    url: https://www.youtube.com/watch?v=5qQQ3yzbKp8
    reason: "7:06 (426 s). Strings vs lists with id(), then spends most of its time on string-concatenation performance rather than aliasing"
---

# Video: Assignment vs Mutation in Python

Python Morsels, 3:07 (187 s), https://www.youtube.com/watch?v=GXSxIt8Ofik.
Live, public and embeddable on 2026-10-14 (playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions, the video starts with two variables, `a` and `b`, that point to the same list after `b = a` (0:00 to 0:20).
It appends a number through `b` and asks how long `a` is now. The answer is five items, not four, because both names point to one object: changing the object is visible through every name that points to it (0:20 to 1:02).
Tuples, numbers and strings cannot be changed after they are created; lists, dictionaries and sets can. Objects that can be changed are mutable, and changing one is a mutation (1:02 to 1:23).
Then `b` is assigned a new three-item list, and `a` still has its five items: assignment only moves the name `b` to another object (1:23 to 2:19).
It closes with the rule that "change" means two things in Python: an assignment changes which object a variable points to, and a mutation changes the object itself (2:19 to 3:07).

It matches objective o1 for assignment and `append`, and names the mutable and immutable types in o2.

## Gaps against the objectives

- o1: partly covered. It does not pass a list to a function, and it does not check identity with `is`.
- o2: the mutable and immutable types are named, but there are no examples predicting whether an operation changes the original.
- o3: not covered. There is no copying with a slice, `list()`, `dict.copy()` or `copy.deepcopy`, and no mutable default argument.

## Alternates

- Python Morsels, "Variables are pointers in Python", https://www.youtube.com/watch?v=g-iNz91YyGw, 3:12 (192 s). `b = a`, the same `id` for both names, and copying with a slice, `list()` or `list.copy()` (o1, part of o3).
- Real Python, "Immutable vs Mutable Objects in Python", https://www.youtube.com/watch?v=p9ppfvHv2Us, 9:55 (595 s). List vs tuple item assignment and a tuple that holds a list (o2).
- Python Morsels, "Mutable default arguments in Python", https://www.youtube.com/watch?v=1PTx3-mAO1E, 3:48 (228 s). Default values are evaluated once and shared (part of o3).
- Corey Schafer, "Python Quick Tip: The Difference Between == and is (Equality vs Identity)", https://www.youtube.com/watch?v=mO_dS3rXDIs, 8:51 (531 s). Equality versus identity (o1).

## Rejected

- Corey Schafer, "Python Tutorial: Clarifying the Issues with Mutable Default Arguments", https://www.youtube.com/watch?v=_JGmemuINww: 16:04 exceeds the 12-minute topic budget.
- Corey Schafer, "Programming Terms: Mutable vs Immutable", https://www.youtube.com/watch?v=5qQQ3yzbKp8: mostly about string-concatenation performance, not aliasing.
