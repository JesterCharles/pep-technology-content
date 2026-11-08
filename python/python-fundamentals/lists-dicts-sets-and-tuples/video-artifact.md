---
title: Python dictionaries are easy
channel: Bro Code
url: https://www.youtube.com/watch?v=MZZSMaEAC2g
runtimeMinutes: 8.1
embeddable: true
checkedAt: 2026-10-14
covers:
  - A dict as key-value pairs, ordered and changeable, with unique keys (0:00 to 1:04)
  - "get(): reading a value by key, None for a missing key, and using that result in an if statement (1:50 to 3:12)"
  - "update(): adding a new pair and changing an existing value (3:12 to 4:15)"
  - pop(), popitem() and clear() for removing entries (4:15 to 4:55)
  - keys() and values() in for loops (4:55 to 6:39)
  - items() unpacked into a key and a value in a for loop (6:39 to 7:42)
gaps:
  - "o1: only the dict is described; choosing between list, tuple, set and dict is not covered"
  - "o2: list operations (append, pop, remove) are not covered; dict[key] = value and the KeyError that get() avoids are not shown"
  - "o3: covered"
cautions:
  - Third-party educator channel (Bro Code), published 2022-11-10; the methods shown are unchanged in current Python 3
  - The title ends with a book emoji; the dict keys are country names and one value is changed to a joke capital
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: "Python Data Structures: When to Use List, Tuple, Set, Dict (Data with Baraa)"
    url: https://www.youtube.com/watch?v=h-zcj4DmqHk
    reason: "3:54 (234 s). Compares list, tuple, set and dict by order, duplicates, index access and mutability, then gives a decision rule (list by default, tuple when frozen, set when unique, dict when mapping), per its captions (o1); no operations"
  - title: Python Lists vs Tuples vs Sets - Visually Explained (Visually Explained)
    url: https://www.youtube.com/watch?v=11WrzU81q68
    reason: "6:00 (360 s). List, tuple and set per its title (o1); no dict; captions not reviewed"
  - title: How to Iterate Through a Dictionary in Python (Real Python)
    url: https://www.youtube.com/watch?v=Hgcd86lQc70
    reason: "6:01. Dict iteration per its title (o3); captions not reviewed"
rejected:
  - title: "Collections | Python for Beginners [25 of 44] (Microsoft Developer)"
    url: https://www.youtube.com/watch?v=beA8IsY3mQs
    reason: 11:27 (687 s) exceeds the 11-minute topic budget
  - title: "Python lists, sets, and tuples explained (Bro Code)"
    url: https://www.youtube.com/watch?v=gOMW_n2-2Mw
    reason: 15:06 exceeds the 11-minute topic budget
  - title: "Python Tutorial for Beginners 4: Lists, Tuples, and Sets (Corey Schafer)"
    url: https://www.youtube.com/watch?v=W8KRzm-HUcc
    reason: 29:05 exceeds the 11-minute topic budget
---

# Video: Python dictionaries are easy

Bro Code, 8:06 (486 s), https://www.youtube.com/watch?v=MZZSMaEAC2g.
Live, public and embeddable on 2026-10-14 (playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions, the video builds a dict of countries and their capitals:

- A dict holds key-value pairs. It keeps insertion order, can be changed, and allows no duplicate keys (0:00).
- `capitals.get("USA")` returns the value, and `get` on a missing key returns `None`. That result can drive an `if` statement that checks whether a key exists (1:50).
- `update()` adds a new pair or changes an existing value (3:12).
- `pop(key)` removes a pair, `popitem()` removes the most recently inserted pair, and `clear()` empties the dict (4:15).
- `keys()` and `values()` are each looped over with `for` (4:55).
- `for key, value in capitals.items():` unpacks each pair into two variables (6:39).

It matches objective o3 and the dict half of o2.

## Gaps against the objectives

- o1: only the dict is described; choosing between list, tuple, set and dict is not covered.
- o2: list operations are not covered, and neither is `d[key] = value` or the `KeyError` that `get` avoids.
- o3: covered.

## Alternates

- Data with Baraa, "Python Data Structures: When to Use List, Tuple, Set, Dict", https://www.youtube.com/watch?v=h-zcj4DmqHk, 3:54 (234 s). It compares the four types and gives a decision rule (o1).
- Visually Explained, "Python Lists vs Tuples vs Sets - Visually Explained", https://www.youtube.com/watch?v=11WrzU81q68, 6:00 (360 s). It covers list, tuple and set (o1).
- Real Python, "How to Iterate Through a Dictionary in Python", https://www.youtube.com/watch?v=Hgcd86lQc70, 6:01. It covers dict iteration (o3).

## Rejected

- Microsoft Developer, "Collections | Python for Beginners [25 of 44]", https://www.youtube.com/watch?v=beA8IsY3mQs: 11:27 exceeds the 11-minute budget.
- Bro Code, "Python lists, sets, and tuples explained", https://www.youtube.com/watch?v=gOMW_n2-2Mw: 15:06 exceeds the budget.
- Corey Schafer, "Python Tutorial for Beginners 4: Lists, Tuples, and Sets", https://www.youtube.com/watch?v=W8KRzm-HUcc: 29:05 exceeds the budget.
