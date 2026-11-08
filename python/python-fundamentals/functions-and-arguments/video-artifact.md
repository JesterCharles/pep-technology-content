---
title: "Parameterized Functions | Python for Beginners [31 of 44]"
channel: Microsoft Developer
url: https://www.youtube.com/watch?v=sKW-zdYZNX4
runtimeMinutes: 6.5
embeddable: true
checkedAt: 2026-10-14
covers:
  - A function with one parameter that returns a value, and storing the result of the call (0:04 to 0:46)
  - A second parameter, and positional arguments passed in the order the parameters are declared (1:26 to 2:27)
  - A default value that makes a parameter optional in the call (2:27 to 3:49)
  - "Named notation (keyword arguments): naming each argument so their order no longer matters (3:49 to 4:50)"
  - Why keyword arguments make a long call readable, shown with an error-logging function (4:50 to 6:31)
gaps:
  - "o2: *args, **kwargs and unpacking with * and ** are not covered"
  - "o3: type hints are not covered"
cautions:
  - "First-party Microsoft Developer channel, part of the 2019 Python for Beginners series (published 2019-09-18); the calls shown are unchanged in current Python 3"
  - The video is slides only; the live code is in the series' next video (32 of 44)
  - The series calls keyword arguments "named notation"; the Python documentation calls them keyword arguments
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: Python Arguments in Functions (Positional, Keywords & Default Arguments) (Programiz)
    url: https://www.youtube.com/watch?v=Gf-Ws2cXEuA
    reason: "6:14 (374 s). Positional arguments, the missing-argument TypeError, defaults and keyword arguments in any order, per its captions (o1); it promotes the channel's app at 3:17"
  - title: Optional Arguments in Python With *args and **kwargs (Real Python)
    url: https://www.youtube.com/watch?v=WcTXxX3vYgY
    reason: "10:44 (644 s). *args and **kwargs per its title (o2); captions not reviewed; published 2017"
  - title: Python Tutorial for Beginners 22 - Default Arguments, *args and **kwargs (ProgrammingKnowledge)
    url: https://www.youtube.com/watch?v=3nrm-aTCwdQ
    reason: "7:52 (472 s). Defaults, *args and **kwargs per its title (o1, o2); captions not reviewed; published 2018"
  - title: The BIGGEST Misconception About Type Hints In Python Explained (Indently)
    url: https://www.youtube.com/watch?v=15WB30NqDT0
    reason: "5:14 (314 s). Type hints are not enforced at run time, per its title (o3); captions not reviewed"
rejected:
  - title: "*Args and **Kwargs in Python (b001)"
    url: https://www.youtube.com/watch?v=4jBJhCaNrWU
    reason: "3:48 (228 s). A good fit for o2 per its captions, but playableInEmbed is false, so it is not embeddable"
  - title: "Python *ARGS & **KWARGS are awesome! (Bro Code)"
    url: https://www.youtube.com/watch?v=Vh__2V2tXUM
    reason: 14:54 exceeds the 11-minute topic budget
  - title: Python Typing - Type Hints & Annotations (Tech With Tim)
    url: https://www.youtube.com/watch?v=QORvB-_mbZ0
    reason: 24:46 exceeds the 11-minute topic budget
---

# Video: Parameterized Functions | Python for Beginners [31 of 44]

Microsoft Developer, 6:31 (391 s), https://www.youtube.com/watch?v=sKW-zdYZNX4.
Live, public and embeddable on 2026-10-14 (playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions, the video builds a function that returns a person's initial and adds parameters to it:

- A second parameter, `force_uppercase`. Positional arguments must then be passed in the order the parameters are declared (1:26).
- A default value, `force_uppercase=True`. The caller may leave that argument out (2:27).
- "Named notation", which the Python documentation calls keyword arguments. Each argument is passed by parameter name, so the order no longer matters, and defaulted parameters stay optional (3:49).
- An error-logging call with five unnamed values, rewritten with keyword arguments to show how much easier it is to read (4:50).

It matches objective o1.

## Gaps against the objectives

- o1: covered.
- o2: `*args`, `**kwargs` and unpacking with `*` and `**` are not covered.
- o3: type hints are not covered.

## Alternates

- Programiz, "Python Arguments in Functions (Positional, Keywords & Default Arguments)", https://www.youtube.com/watch?v=Gf-Ws2cXEuA, 6:14 (374 s). It covers positional, default and keyword arguments, and the missing-argument `TypeError` (o1).
- Real Python, "Optional Arguments in Python With *args and **kwargs", https://www.youtube.com/watch?v=WcTXxX3vYgY, 10:44 (644 s). It covers `*args` and `**kwargs` (o2).
- ProgrammingKnowledge, "Default Arguments, *args and **kwargs", https://www.youtube.com/watch?v=3nrm-aTCwdQ, 7:52 (472 s). It covers defaults, `*args` and `**kwargs` (o1, o2).
- Indently, "The BIGGEST Misconception About Type Hints In Python Explained", https://www.youtube.com/watch?v=15WB30NqDT0, 5:14 (314 s). It explains that type hints are not enforced (o3).

## Rejected

- b001, "*Args and **Kwargs in Python", https://www.youtube.com/watch?v=4jBJhCaNrWU: not embeddable (playableInEmbed false).
- Bro Code, "Python *ARGS & **KWARGS are awesome!", https://www.youtube.com/watch?v=Vh__2V2tXUM: 14:54 exceeds the 11-minute budget.
- Tech With Tim, "Python Typing - Type Hints & Annotations", https://www.youtube.com/watch?v=QORvB-_mbZ0: 24:46 exceeds the budget.
