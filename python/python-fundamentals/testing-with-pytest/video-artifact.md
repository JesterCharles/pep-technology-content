---
title: PyCharm and pytest in under 7 minutes
channel: PyCharm, a JetBrains IDE
url: https://www.youtube.com/watch?v=lSuGVpDupkc
runtimeMinutes: 6.5
embeddable: true
checkedAt: 2026-10-14
covers:
  - Setting up a project with pytest as a dependency, installing it with pip, and checking that pytest is the test runner (0:00 to 1:01)
  - A first test with a plain assert that fails, then passes (1:01 to 1:42)
  - Test-first workflow, with tests that fail until the missing code is added (1:42 to 3:22)
  - Skipping a test with pytest.mark.skip (3:22 to 4:04)
  - Pytest fixtures to remove duplicated setup, and moving a fixture into conftest.py to share it between test files (4:04 to 5:05)
  - Debugging a failing assert in the IDE (5:05 to 5:46)
  - pytest.raises to check that the expected exception is raised (5:46 to 6:07)
gaps:
  - "o1: plain assert in test files is covered, but tests are run from PyCharm's gutter and Run window, not with python -m pytest in a terminal"
  - "o2: failing tests are shown in the IDE; reading pytest's terminal failure report (the > line and E lines) is not covered"
  - "o3: fixtures and pytest.raises are covered; @pytest.mark.parametrize is not"
cautions:
  - First-party IDE vendor channel (PyCharm by JetBrains), published 2024-07-24; it is a fast tour of PyCharm features as much as of pytest
  - Uses Python 3.11 and a pyproject.toml; nothing shown is outdated for pytest 9
  - It promotes PyCharm features such as full line code completion and links to JetBrains resources
  - Fit was judged from the video description and its caption track; the video was not watched end to end
alternates:
  - title: "Python pytest Tutorial for Beginners | Fixtures, Parametrize, Mocking Explained | Ep 20 (CodeToAGI)"
    url: https://www.youtube.com/watch?v=MazbZAOlZF0
    reason: "9:19 (559 s), 2026. test_ files, assert, fixtures, parametrize, pytest.raises and how to read dots, F and summary lines, per its captions; a very new, little-viewed channel, and it adds mocking beyond this topic"
  - title: "pytest's parametrize (beginner - intermediate) anthony explains #027 (anthonywritescode)"
    url: https://www.youtube.com/watch?v=aQH7hyJn-No
    reason: "12:24 (744 s), 2020. @pytest.mark.parametrize (o3) by a pytest core developer; captions not reviewed"
  - title: "pytest: testing exceptions (beginner - intermediate) anthony explains #176 (anthonywritescode)"
    url: https://www.youtube.com/watch?v=6nRxZyQwwlE
    reason: "12:12 (732 s), 2020. pytest.raises (o3); captions not reviewed"
  - title: "getting started with pytest (beginner - intermediate) anthony explains #518 (anthonywritescode)"
    url: https://www.youtube.com/watch?v=mzlH8lp4ISA
    reason: "13:18 (798 s), 2023, now within the 15-minute topic budget; re-screened 2026-10-15. By a pytest core developer, but it has only auto-generated captions and no chapters, and its description sends viewers to separate videos for parametrize, fixtures and testing exceptions, so o3 is not covered in one place; it stays an alternate"
rejected:
  - title: "Please Learn How To Write Tests in Python... Pytest Tutorial (Tech With Tim)"
    url: https://www.youtube.com/watch?v=EgpLj86ZHFQ
    reason: "33:10 exceeds the 15-minute topic budget"
  - title: "Pytest Tutorial - How to Test Python Code (freeCodeCamp.org)"
    url: https://www.youtube.com/watch?v=cHYq1MRoyI0
    reason: "1:28:39 exceeds the 15-minute topic budget"
---

# Video: PyCharm and pytest in under 7 minutes

PyCharm, a JetBrains IDE, 6:30 (390 s), https://www.youtube.com/watch?v=lSuGVpDupkc.
Live, public and embeddable on 2026-10-14 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions:

- A new project lists pytest as a dependency and installs it with pip, and PyCharm is set to use pytest as its test runner (0:00).
- A first test fails with `assert False` and passes with `assert True` (1:01).
- A test-first loop follows: a test fails until the missing constructor or method is added (1:42).
- `pytest.mark.skip` skips a test that is not implemented yet (3:22).
- Fixtures replace duplicated setup across tests, and a fixture moved into `conftest.py` is shared between test files (4:04).
- The debugger shows why an `assert` fails (5:05).
- `pytest.raises` checks the expected exception. In the example the code raises `IndexError` where the test expects `KeyError`, so the test fails (5:46).

It matches parts of objectives o1 and o3.

## Gaps against the objectives

- o1: tests run from the IDE, not with `python -m pytest` in a terminal.
- o2: pytest's terminal failure report is not read.
- o3: fixtures and `pytest.raises` are covered; `@pytest.mark.parametrize` is not.

## Alternates

- CodeToAGI, "Python pytest Tutorial for Beginners | Fixtures, Parametrize, Mocking Explained | Ep 20", https://www.youtube.com/watch?v=MazbZAOlZF0, 9:19 (559 s). Covers all three objectives per its captions, from a very new, little-viewed channel; adds mocking.
- anthonywritescode, "pytest's parametrize", https://www.youtube.com/watch?v=aQH7hyJn-No, 12:24 (744 s). `@pytest.mark.parametrize` (o3).
- anthonywritescode, "pytest: testing exceptions", https://www.youtube.com/watch?v=6nRxZyQwwlE, 12:12 (732 s). `pytest.raises` (o3).
- anthonywritescode, "getting started with pytest", https://www.youtube.com/watch?v=mzlH8lp4ISA, 13:18 (798 s). Within the 15-minute budget, by a pytest core developer, but with auto-generated captions only, no chapters, and parametrize, fixtures and exceptions left to separate videos. Re-screened 2026-10-15.

## Rejected

- Tech With Tim, "Please Learn How To Write Tests in Python... Pytest Tutorial", https://www.youtube.com/watch?v=EgpLj86ZHFQ: 33:10 exceeds the budget.
- freeCodeCamp.org, "Pytest Tutorial - How to Test Python Code", https://www.youtube.com/watch?v=cHYq1MRoyI0: 1:28:39 exceeds the budget.
