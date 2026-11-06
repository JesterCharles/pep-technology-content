---
title: "Python Tutorial: Using Try/Except Blocks for Error Handling"
channel: Corey Schafer
url: https://www.youtube.com/watch?v=NIWwJbo-9_8
runtimeMinutes: 10.6
embeddable: true
checkedAt: 2026-10-14
covers:
  - A missing file raising FileNotFoundError and the traceback Python prints without handling (0:41 to 1:23)
  - Moving the risky call into try and handling it in except (1:23 to 2:26)
  - Why a general except Exception hides unrelated errors, and catching the specific FileNotFoundError instead (2:26 to 4:13)
  - Several except clauses ordered from specific to general, and except ... as e to show the exception (4:13 to 5:36)
  - The else clause, which runs only when try raised nothing (5:36 to 7:18)
  - The finally clause, which runs whether or not an exception was raised, for releasing resources (7:18 to 8:23)
  - Raising an exception yourself with raise (8:23 to 10:10)
gaps:
  - "o1: covered; it is shown with an open() call rather than int() conversion"
  - "o2: raise is shown with the general Exception class; there is no custom exception class and no comparison with Java's checked exceptions"
  - "o3: the logging module is not covered; errors are printed with print"
cautions:
  - Third-party educator channel (Corey Schafer), published 2015-11-13; the code is Python 3 and nothing in the captions is outdated for Python 3.14
  - The video opens a file without a with block and closes it by hand in else
  - It raises the bare Exception class for the demonstration; the page recommends a specific or custom exception class
  - Fit was judged from the video description and its caption track; the video was not watched end to end
alternates:
  - title: "Learn Python EXCEPTION HANDLING in 5 minutes! (Bro Code)"
    url: https://www.youtube.com/watch?v=V_NXT2-QIlE
    reason: "5:48 (348 s), 2024. try, several specific except clauses and finally per its description; no else, raise or logging"
  - title: "Python Logging: Master the Module in Under 10 Minutes (Timnology)"
    url: https://www.youtube.com/watch?v=A3FkYRN9qog
    reason: "9:29 (569 s), 2024. getLogger(__name__), levels, handlers and formatters per its captions and chapters (o3); goes well beyond this topic into filters, hierarchy and dictConfig, and does not log a caught exception"
  - title: "Python Error Handling - Visually Explained (Visually Explained)"
    url: https://www.youtube.com/watch?v=XN3udSTGAOM
    reason: "5:21 (321 s), 2026. Error handling with try and except per its title; captions not reviewed"
  - title: "Error Handling | Python for Beginners [17 of 44] (Microsoft Developer)"
    url: https://www.youtube.com/watch?v=HQqqNBZosn8
    reason: "12:53 (773 s), 2019, now within the 14-minute topic budget; re-screened 2026-10-15. Manual English captions, a strength for accessibility. Its chapters (Intro, Error Handling vs Debugging, Types of Errors, Try Except at 6:30) give try and except only the last six minutes, and neither the chapters nor the description cover else, finally, raise, custom exceptions or the logging module, so it stays an alternate rather than the pick"
rejected:
  - title: "Python Tutorial: Logging Basics - Logging to Files, Setting Levels, and Formatting (Corey Schafer)"
    url: https://www.youtube.com/watch?v=-ARI4Cz-awo
    reason: "14:25 exceeds the 14-minute topic budget"
  - title: "Python Logging - Tutorial (Tech With Tim)"
    url: https://www.youtube.com/watch?v=urrfJgHwIJA
    reason: "15:02 exceeds the 14-minute topic budget"
---

# Video: Python Tutorial: Using Try/Except Blocks for Error Handling

Corey Schafer, 10:34 (634 s), https://www.youtube.com/watch?v=NIWwJbo-9_8.
Live, public and embeddable on 2026-10-14 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions:

- Opening a misspelled file name raises `FileNotFoundError`, and Python prints a traceback (0:41).
- Wrapping the call in `try` and handling it in `except` replaces the traceback with a friendly message (1:23).
- A general `except Exception` also swallows an unrelated `NameError`, so the video narrows it to `except FileNotFoundError`; the unexpected error then shows its normal traceback (2:26).
- Several `except` clauses run from most specific to most general, and `except FileNotFoundError as e` prints the exception itself (4:13).
- `else` runs only when the `try` block raised nothing, which keeps the `try` block small (5:36).
- `finally` runs in every case and is the place to release resources such as a database connection (7:18).
- `raise` raises an exception on purpose, which the `except` clause below then handles (8:23).

It matches objective o1 and the raising part of o2.

## Gaps against the objectives

- o1: covered.
- o2: no custom exception class and no comparison with Java's checked exceptions.
- o3: `logging` is not covered.

## Alternates

- Bro Code, "Learn Python EXCEPTION HANDLING in 5 minutes!", https://www.youtube.com/watch?v=V_NXT2-QIlE, 5:48 (348 s). `try`, specific `except` clauses and `finally`.
- Timnology, "Python Logging: Master the Module in Under 10 Minutes", https://www.youtube.com/watch?v=A3FkYRN9qog, 9:29 (569 s). Module loggers, levels and handlers (o3), plus advanced configuration.
- Visually Explained, "Python Error Handling - Visually Explained", https://www.youtube.com/watch?v=XN3udSTGAOM, 5:21 (321 s). Captions not reviewed.
- Microsoft Developer, "Error Handling | Python for Beginners [17 of 44]", https://www.youtube.com/watch?v=HQqqNBZosn8, 12:53 (773 s). Within the 14-minute budget and captioned by hand, but per its chapters only the last six minutes cover `try` and `except`; it does not cover `else`, `finally`, `raise`, custom exceptions or logging. Re-screened 2026-10-15.

## Rejected

- Corey Schafer, "Python Tutorial: Logging Basics", https://www.youtube.com/watch?v=-ARI4Cz-awo: 14:25 exceeds the budget.
- Tech With Tim, "Python Logging - Tutorial", https://www.youtube.com/watch?v=urrfJgHwIJA: 15:02 exceeds the budget.
