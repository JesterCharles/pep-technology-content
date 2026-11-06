# Video search record: python-fundamentals

Course `python`, module `python-fundamentals`, 9 core topics, each with a conditional video companion (intake `authoring/evidence/python/intake.md`, Artifact applicability, legend **V**).

## Supersedes the 2026-10-13 search

The first search (2026-10-13) accepted only first-party Python Software Foundation and pytest sources. It found none, so it recorded every video as absent.

That bar was stricter than the landed module pattern:

- `git-foundations` accepted vendor channels.
- `java-basics` accepted reputable third-party educators, with cautions.

On 2026-10-14 the search was rerun to that landed pattern. Every topic now has a verified `video-artifact.md` and a `video.json` receipt.

## Criteria

- **Availability:** live, public and embeddable when checked.
- **Length:** runtime no longer than the topic's minute budget.
- **Accuracy:** correct for current Python 3 and pytest; anything outdated is flagged.
- **Fit:** fit to the topic's objectives was judged from each video's description, chapters and caption track. No video was downloaded or watched end to end.
- **Channels:**
  - First-party or vendor channels (Microsoft Developer, JetBrains) were preferred when they fit.
  - Reputable educators were accepted with cautions, as in `java-basics`.
- **Gaps and alternates:** every companion lists its gaps against each objective, plus alternates that fill them.

## Method

1. YouTube search result pages were read live.
2. Each candidate's public watch-page player metadata was checked live: `lengthSeconds`, publish date, playability, `playableInEmbed` and `isUnlisted`.
3. The published caption track was read through the public player API; most tracks were auto-generated English.
4. Final receipts were written by `node authoring/tools/net/check-video.mjs python/python-fundamentals/<topic>` to `authoring/evidence/python/python-fundamentals/<topic>/video.json`. Every run returned oEmbed HTTP 200, public and embeddable.

## Selected

Budgets below are the current topic budgets from each `topic.json` (refreshed 2026-11-05). The search logs that follow keep the budget each search was run against; the 2026-10-15 re-screen at the end covers the later budget change.

| Topic | Budget | Video | Channel | Runtime (s) |
|---|---|---|---|---|
| `exceptions-and-logging` | 14 | [Python Tutorial: Using Try/Except Blocks for Error Handling](https://www.youtube.com/watch?v=NIWwJbo-9_8) | Corey Schafer | 634 |
| `functions-and-arguments` | 13 | [Parameterized Functions \| Python for Beginners [31 of 44]](https://www.youtube.com/watch?v=sKW-zdYZNX4) | Microsoft Developer | 391 |
| `lists-dicts-sets-and-tuples` | 11 | [Python dictionaries are easy 📙](https://www.youtube.com/watch?v=MZZSMaEAC2g) | Bro Code | 486 |
| `modules-imports-and-virtual-environments` | 12 | [Python Virtual Environments - Full Tutorial for Beginners](https://www.youtube.com/watch?v=Y21OR1OPC9A) | Tech With Tim | 545 |
| `mutability-and-aliasing` | 11 | [Assignment vs Mutation in Python](https://www.youtube.com/watch?v=GXSxIt8Ofik) | Python Morsels | 187 |
| `python-syntax-for-java-developers` | 13 | [Python vs Java: The Mindset Shift Every Java Developer Needs](https://www.youtube.com/watch?v=1CX-OVyr_Fc) | Cave of Programming | 325 |
| `slicing-and-comprehensions` | 12 | [Python Tutorial: Slicing Lists and Strings](https://www.youtube.com/watch?v=ajrtAuDg3yw) | Corey Schafer | 644 |
| `testing-with-pytest` | 15 | [PyCharm and pytest in under 7 minutes](https://www.youtube.com/watch?v=lSuGVpDupkc) | PyCharm, a JetBrains IDE | 390 |
| `writing-and-running-script-files` | 14 | [Exiting a Python program](https://www.youtube.com/watch?v=fbqEdQP5nS8) | Python Morsels | 345 |

## Search logs (queries with UTC times, every candidate checked, decisions)

### Log a

Method: YouTube search result pages (yts.mjs), live watch-page player metadata (cap.mjs: lengthSeconds, publishDate, playability, playableInEmbed, isUnlisted) and the published caption track through the player API (cap2.mjs, mostly auto-generated English). Fit judged from captions and descriptions; no video downloaded or watched end to end.

#### Queries
- 15:18:24Z: "python for java developers"; "python syntax for java programmers indentation"; "Microsoft Developer python for beginners"; "python functions default keyword arguments args kwargs"; "python type hints tutorial"
- 15:18:32Z: "Microsoft Developer python for beginners functions"; "... collections"; "... dictionaries"; "python lists dictionaries sets tuples explained"; "python list vs tuple vs set vs dictionary"; "python dictionary get items loop"
- 15:18:55Z: "python vs java syntax comparison beginners"; "python truthiness none is vs =="; "python division floor division vs true division"

#### python-syntax-for-java-developers (budget 14)
| Video | Channel | id | s | published | decision |
|---|---|---|---|---|---|
| Python vs Java: The Mindset Shift Every Java Developer Needs | Cave of Programming | 1CX-OVyr_Fc | 325 | 2026-04-11 | SELECTED: indentation as structure, dynamic typing, less boilerplate (captions); course promo |
| Python in 8 minutes (compared to Java) | NeetCode | emNkJGwcusQ | 470 | 2020-12-15 | alternate: print, dict vs HashMap, loops; no syntax rules |
| Python vs Java: Key Syntax Differences Simplified | Tech-WHYS | nqA-Dvqol24 | 185 | 2025-06-20 | rejected: captions misstate Java at 1:46; 70 views |
| Python Tutorial for Java Programmers | EZ Coding | PCsCAMfwvos | 1408 | (search) | rejected: over budget |
| Java vs Python Syntax Comparison [2021] | Eric Programming | EN-TrZxX6Os | 1690 | (search) | rejected: over budget |
| All Python Syntax in 25 Minutes | Beau Carnes | PNSIWjWAA7o | 1499 | (search) | rejected: over budget |

#### functions-and-arguments (budget 11)
| Video | Channel | id | s | published | decision |
|---|---|---|---|---|---|
| Parameterized Functions, Python for Beginners [31 of 44] | Microsoft Developer | sKW-zdYZNX4 | 391 | 2019-09-18 | SELECTED: positional order, defaults, keyword (named) arguments; first-party |
| Python Arguments in Functions (Positional, Keywords & Default) | Programiz | Gf-Ws2cXEuA | 374 | 2020-10-02 | alternate (o1; app promo) |
| Optional Arguments in Python With *args and **kwargs | Real Python | WcTXxX3vYgY | 644 | 2017-02-21 | alternate (o2) |
| Default Arguments, *args and **kwargs | ProgrammingKnowledge | 3nrm-aTCwdQ | 472 | 2018-09-10 | alternate |
| The BIGGEST Misconception About Type Hints | Indently | 15WB30NqDT0 | 314 | 2022-12-16 | alternate (o3) |
| *Args and **Kwargs in Python | b001 | 4jBJhCaNrWU | 228 | 2023-07-25 | rejected: playableInEmbed false |
| Python *ARGS & **KWARGS are awesome! | Bro Code | Vh__2V2tXUM | 894 | (search) | rejected: over budget |
| Python Typing - Type Hints & Annotations | Tech With Tim | QORvB-_mbZ0 | 1486 | (search) | rejected: over budget |

#### lists-dicts-sets-and-tuples (budget 11)
| Video | Channel | id | s | published | decision |
|---|---|---|---|---|---|
| Python dictionaries are easy | Bro Code | MZZSMaEAC2g | 486 | 2022-11-10 | SELECTED: get/None, update, pop, keys/values, items() unpacking (o2 dict half, o3) |
| Python Data Structures: When to Use List, Tuple, Set, Dict | Data with Baraa | h-zcj4DmqHk | 234 | 2025-12-16 | alternate: o1 decision rule; no operations |
| Python Lists vs Tuples vs Sets - Visually Explained | Visually Explained | 11WrzU81q68 | 360 | 2025-08-12 | alternate (o1, no dict) |
| How to Iterate Through a Dictionary in Python | Real Python | Hgcd86lQc70 | 361 | (search) | alternate (o3) |
| Collections, Python for Beginners [25 of 44] | Microsoft Developer | beA8IsY3mQs | 687 | 2020-01-21 | rejected: 687 s over the 660 s budget |
| Python lists, sets, and tuples explained | Bro Code | gOMW_n2-2Mw | 906 | (search) | rejected: over budget |
| Python Tutorial for Beginners 4: Lists, Tuples, and Sets | Corey Schafer | W8KRzm-HUcc | 1745 | (search) | rejected: over budget |

### Log b

Date 2026-10-14. All times UTC.
Search used the YouTube results page (`yts.mjs`). Live checks used the public watch-page player metadata (`cap.mjs`: lengthSeconds, publishDate, playability status, playableInEmbed, isUnlisted). Captions came from the public caption track through the innertube player (`cap2.mjs`).

#### slicing-and-comprehensions (budget 11 min)

Queries (15:18:32Z):
- "python slicing tutorial"
- "python list comprehension tutorial"
- "corey schafer slicing lists and strings"
- "python comprehensions list set dict"
- "python for beginners microsoft developer slicing"

Microsoft Developer's "Python for Beginners" series has no slicing or comprehension episode in the results; only its intro episodes and a 2:23:27 full series came up.

| Video | Channel | Id | s | Published | Decision |
|---|---|---|---|---|---|
| Python Tutorial: Slicing Lists and Strings | Corey Schafer | ajrtAuDg3yw | 644 | 2015-10-29 | **Selected**. Captions checked 15:18:42Z: indexes, start/stop, omission, step, negative step, string slicing (o1) |
| 22. List Set Dict Comprehensions | codebasics | fz2PKpPdlRo | 359 | 2019-05-07 | Alternate. Captions: loop to list comprehension, set and dict comprehensions (o2) |
| Python Lists: Indexing & Slicing | Real Python | KAXvMbD1Zac | 416 | 2019-08-29 | Alternate. Captions: list indexing and slicing (o1) |
| Learn Python LIST COMPREHENSIONS in 10 minutes! | Bro Code | YlY2g2xrl6Q | 619 | 2024-06-02 | Alternate (o2); captions not reviewed |
| #2: Python List, Set & Dictionary Comprehension | Programiz | TGaKzl6p4nA | 671 | 2021-03-03 | Rejected: 11:11 is over the 11-minute budget |
| Python Tutorial: Comprehensions | Corey Schafer | 3dt4OGnU5sM | 1109 | 2015-08-24 | Rejected: over budget |

#### mutability-and-aliasing (budget 12 min)

Queries:
- 15:19:00Z: "python mutable vs immutable", "python aliasing lists same object", "python mutable default argument", "python names and values ned batchelder", "python shallow copy deep copy", "mcoding mutable".
- 15:19:28Z: "python morsels variables are pointers", "python variables are references not boxes", "python pass by object reference list function", "python is vs == identity".

| Video | Channel | Id | s | Published | Decision |
|---|---|---|---|---|---|
| Assignment vs Mutation in Python | Python Morsels | GXSxIt8Ofik | 187 | 2024-05-18 | **Selected**. Captions 15:19:36Z: b = a aliasing, append seen through both names, mutable vs immutable types, assignment vs mutation (o1, o2) |
| Variables are pointers in Python | Python Morsels | g-iNz91YyGw | 192 | 2024-05-02 | Alternate. Captions: aliasing, id, copying with a slice, list() and copy() (o1, part of o3) |
| Data structures contain pointers in Python | Python Morsels | TDCxdWEou-8 | 231 | 2024-06-13 | Considered. Captions: nested-list aliasing; narrower than the pick; not listed |
| Immutable vs Mutable Objects in Python | Real Python | p9ppfvHv2Us | 595 | 2017-05-15 | Alternate. Captions: list vs tuple, a tuple holding a list (o2) |
| Mutable default arguments in Python | Python Morsels | 1PTx3-mAO1E | 228 | 2025-04-07 | Alternate (o3), judged from its description chapters |
| Python Quick Tip: == vs is | Corey Schafer | mO_dS3rXDIs | 531 | 2019-08-06 | Alternate (o1, `is`); captions not reviewed |
| Programming Terms: Mutable vs Immutable | Corey Schafer | 5qQQ3yzbKp8 | 426 | 2015-07-08 | Rejected. Captions: mostly string-concatenation performance |
| Clarifying the Issues with Mutable Default Arguments | Corey Schafer | _JGmemuINww | 964 | 2019-04-24 | Rejected: over budget |
| Facts and Myths about Python names and values (PyCon 2015) | PyCon 2015 | _AEJHKGk9ns | 25:20 (search listing) | - | Not checked live: over budget from the listing |
| Your Lists Are Being Copied WRONG | Indently | pyZmtVB7ofY | 404 | 2022-12-25 | Checked live (metadata only), not chosen: shallow vs deep copy only |

#### modules-imports-and-virtual-environments (budget 12 min)

Queries:
- 15:19:55Z: "python virtual environment venv tutorial", "python for beginners virtual environments microsoft", "python venv requirements.txt pip install", "python modules and packages import tutorial" (that one returned no data), "corey schafer venv", "python venv windows mac linux activate".
- 15:20:17Z: "python import modules tutorial", "python import from own module sys.path".

| Video | Channel | Id | s | Published | Decision |
|---|---|---|---|---|---|
| Python Virtual Environments - Full Tutorial for Beginners | Tech With Tim | Y21OR1OPC9A | 545 | 2024-03-16 | **Selected**. Captions 15:20:03Z: python -m venv on Windows, macOS and Linux; activate and deactivate; install; freeze to requirements.txt and reinstall with -r (o2, most of o3) |
| Virtual Environments, Python for Beginners [34 of 44] | Microsoft Developer | _eczHOiFMZA | 355 | 2019-09-19 | Rejected. Manual captions say `pip install virtualenv` globally and use `virtualenv` on macOS and Linux (outdated) |
| Python Deep Dive: Modules, Packages & Virtual Environments | Code with Gunnar | 4SQFQCqcZ_w | 692 | 2024-10-03 | Rejected: playableInEmbed false (otherwise the best fit for o1 and o2) |
| What are Python modules? | Bro Code | XcfxkHrHTVE | 395 | 2022-12-05 | Alternate (o1), judged from its description chapters |
| VENV (Mac & Linux) | Corey Schafer | Kg1Yvry_Ydk | 857 | 2019-04-02 | Rejected: over budget |
| VENV (Windows) | Corey Schafer | APOPm01BVrk | 17:10 (search listing) | - | Rejected: over budget |

#### Summary

- slicing-and-comprehensions: ajrtAuDg3yw, "Python Tutorial: Slicing Lists and Strings", Corey Schafer, 644 s. Covers o1; o2 and o3 are gaps.
- mutability-and-aliasing: GXSxIt8Ofik, "Assignment vs Mutation in Python", Python Morsels, 187 s. Covers o1 (partly) and o2 (by name); o3 is a gap.
- modules-imports-and-virtual-environments: Y21OR1OPC9A, "Python Virtual Environments - Full Tutorial for Beginners", Tech With Tim, 545 s. Covers o2 and part of o3; o1 is a gap.

### Log c

Checked 2026-10-14. These tools ran live against YouTube:

- `yts.mjs` (search results page);
- `cap.mjs` (watch-page player metadata: lengthSeconds, publishDate, playability, playableInEmbed, isUnlisted);
- `cap2.mjs` (caption track through the public player API).

Fit was judged from captions where noted; no video was downloaded or watched end to end.

#### exceptions-and-logging (budget 12 min; o1 try/except/else/finally, o2 raise and custom exceptions vs Java checked, o3 logging)

These queries were run at 15:18:41Z:

- "python try except finally logging tutorial"
- "Corey Schafer try except error handling"
- "python logging basics tutorial"
- "python exceptions error handling Python for Beginners Microsoft"

Metadata was checked at 15:18:49Z.

| Title | Channel | Id | Seconds | Published | Decision |
|---|---|---|---|---|---|
| Python Tutorial: Using Try/Except Blocks for Error Handling | Corey Schafer | NIWwJbo-9_8 | 634 | 2015-11-13 | **Selected**: captions cover specific except, ordering, as e, else, finally, raise (o1, part of o2); no logging |
| Learn Python EXCEPTION HANDLING in 5 minutes! | Bro Code | V_NXT2-QIlE | 348 | 2024-06-29 | Alternate: try/except/finally per description |
| Python Logging: Master the Module in Under 10 Minutes | Timnology | A3FkYRN9qog | 569 | 2024-08-22 | Alternate (o3): captions and chapters show loggers, levels and handlers, plus advanced config |
| Python Error Handling - Visually Explained | Visually Explained | XN3udSTGAOM | 321 | 2026-04-26 | Alternate: captions not reviewed |
| Error Handling, Python for Beginners [17 of 44] | Microsoft Developer | HQqqNBZosn8 | 773 | 2019-09-17 | Rejected: 12:53 is over the 12-minute budget |
| Python Tutorial: Logging Basics | Corey Schafer | -ARI4Cz-awo | 865 (14:25 per search) | - | Rejected: over budget |
| Python Logging - Tutorial | Tech With Tim | urrfJgHwIJA | 902 (15:02 per search) | - | Rejected: over budget |

#### writing-and-running-script-files (budget 12 min; o1 run a script and read the exit status, o2 main guard, o3 sys.argv and non-zero exit)

Queries were run at 15:19:08Z and 15:19:17Z:

- "if __name__ == '__main__' python explained"
- "python sys.argv command line arguments tutorial"
- "run python script from terminal command line beginners" (no results data returned)
- "python exit code sys.exit status"
- "Python Morsels command line arguments sys.argv"
- "python run script terminal if name main sys.argv exit code"

Metadata was checked at 15:19:17Z.

| Title | Channel | Id | Seconds | Published | Decision |
|---|---|---|---|---|---|
| Exiting a Python program | Python Morsels | fbqEdQP5nS8 | 345 | 2026-05-01 | **Selected**: captions cover a script run from the terminal with an argument, sys.exit, exit code 0 vs non-zero, && and \|\| (o1, exit half of o3); no main guard |
| Accessing command line arguments in Python | Python Morsels | TOxsbFX2PJc | 195 | 2023-04-10 | Alternate (o3), from its chapters |
| Python Tutorial: if __name__ == '__main__' | Corey Schafer | sugvnHA7ElY | 523 | 2015-03-22 | Alternate (o2) |
| Python if __name__ == '__main__': Visually Explained | Visually Explained | KZpYtNtGxSU | 366 | 2025-02-21 | Alternate (o2) |
| What does if __name__ == '__main__' do in Python? | Tech With Tim | x5IbdKnvt6k | 308 | 2025-02-06 | Alternate (o2); promotes a paid program |
| if __name__ == '__main__' for Python beginners | Bro Code | 8A0E1dSyjFM | 552 | 2024-05-27 | Not listed: same ground as the listed o2 alternates |
| Run Python Scripts With Command Line Arguments Using sys.argv | Fabio Musanni | rJCl7t3IIbA | 23:33 per search | - | Rejected: over budget |
| Python [sys] 05 Exit Codes | John Hammond | uWEiep-ksDo | 8:49 per search | about 14 years old | Rejected: superseded by a current video |

#### testing-with-pytest (budget 13 min at this search, now 15 min; o1 assert in test_*.py and python -m pytest, o2 read the failure report, o3 raises, fixture, parametrize)

Queries were run at 15:19:38Z:

- "pytest tutorial beginners"
- "pytest fixtures parametrize raises"
- "anthonywritescode pytest"
- "Visual Studio Code python testing pytest"
- "PyCharm pytest"

Metadata was checked at 15:19:38Z-15:20:23Z.

| Title | Channel | Id | Seconds | Published | Decision |
|---|---|---|---|---|---|
| PyCharm and pytest in under 7 minutes | PyCharm, a JetBrains IDE | lSuGVpDupkc | 390 | 2024-07-24 | **Selected**: first-party vendor; captions cover assert tests, fixtures, conftest.py, pytest.raises; IDE-run, no parametrize, no terminal report |
| Python pytest Tutorial for Beginners, Ep 20 | CodeToAGI | MazbZAOlZF0 | 559 | 2026-06-11 | Alternate: captions cover all three objectives; 91 views, very new channel, adds mocking |
| pytest's parametrize, anthony explains #027 | anthonywritescode | aQH7hyJn-No | 744 | 2020-05-14 | Alternate (o3 parametrize) |
| pytest: testing exceptions, anthony explains #176 | anthonywritescode | 6nRxZyQwwlE | 732 | 2020-12-15 | Alternate (o3 raises) |
| Pytest Explained, Fixtures & Parameterization for Beginners | Besma | TtXjA-s1s6E | 305 | 2024-12-28 | Not listed: 275 views; description only |
| getting started with pytest, anthony explains #518 | anthonywritescode | mzlH8lp4ISA | 798 | 2023-01-23 | Rejected at this search: 13:18 was over the then 13-minute budget; re-screened under the current 15-minute budget below and kept as an alternate |
| Please Learn How To Write Tests in Python | Tech With Tim | EgpLj86ZHFQ | 33:10 per search | - | Rejected: over budget |
| Pytest Tutorial, How to Test Python Code | freeCodeCamp.org | cHYq1MRoyI0 | 1:28:39 per search | - | Rejected: over budget |

## Re-screen, 2026-10-15 (budget change)

The 2026-10-15 correction re-timed every page. Two candidates rejected above only for length now fit their topic budgets and were re-screened from live YouTube player metadata (duration, chapters, caption tracks and description) fetched at 2026-10-15T18:47:12Z. Caption text itself was not retrievable without a player token, so fit is judged from chapters and descriptions, and the selected videos stay.

| Topic (new budget) | Candidate | Runtime | Captions | Decision |
| --- | --- | --- | --- | --- |
| exceptions-and-logging (14) | Error Handling, Python for Beginners [17 of 44], Microsoft Developer, HQqqNBZosn8 | 773 s | manual English | Alternate: chapters give try/except only the last 6 minutes (from 6:30); no else, finally, raise, custom exceptions or logging |
| testing-with-pytest (15) | getting started with pytest, anthonywritescode, mzlH8lp4ISA | 798 s | auto-generated only | Alternate: no chapters; its description points to separate videos for parametrize, fixtures and testing exceptions |
