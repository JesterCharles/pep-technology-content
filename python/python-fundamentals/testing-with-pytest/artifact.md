# Testing with pytest

## Objectives

- Write test functions with plain assert statements in a test\_\*.py file and run them with python -m pytest
- Read a pytest failure report to locate the failing assertion and the values it compared
- Use pytest.raises, a fixture and @pytest.mark.parametrize to test error cases and several inputs without repeating code

## Teaching

### Start with a guess

Practice prediction, not scored. JUnit needs a class, annotations and `assertEquals`. pytest needs less.

### Plain assert, discovered by name

pytest collects files named `test_*.py` (or `*_test.py`) and, inside them, functions whose names start with `test`. A test is a plain function with a plain `assert`; no class or annotation is needed.

Run every test with `python -m pytest`; add `-q` for a shorter report, or give one test's node id: `python -m pytest test_seats.py::test_some_taken`. A dot means passed, `F` failed. The exit status is 0 only when everything passed.

### Read the failure report

Read a failure from the top. The underlined name says which test failed. The line marked `>` is the `assert` that failed. The `E` lines below it show the values pytest compared and, after `where`, which call produced them. `test_seats.py:9` says where to look.

Here the test expected 0, but `seats_left(10, 12)` returned -2: the code, not the test, needs a fix for overbooking.

### Errors, fixtures and parameters

`with pytest.raises(TypeError):` passes only if the code inside raises that exception.

A fixture is a function marked `@pytest.fixture`; a test that names it as a parameter receives its return value, so setup is written once.

`@pytest.mark.parametrize("taken, left", [(3, 7), (10, 0)])` runs one test function once per tuple; the test must accept `taken` and `left` as parameters, and each case passes or fails on its own.

### Pick the right tool

Several inputs for one check: `@pytest.mark.parametrize`, which reports each case on its own. An error the code must raise: `pytest.raises`. Setup that several tests share: a fixture.

## Model

Sam's code and tests. Terminal and report output are real pytest 9.1.1 output for these exact files.

seats.py

```
def seats_left(capacity, taken):
    if taken < 0:
        raise ValueError("taken must not be negative")
    return capacity - taken
```

test_seats.py

```
from seats import seats_left


def test_some_taken():
    assert seats_left(10, 3) == 7
```

seats.py is unchanged; `cat seats.py` shows it.

test_seats.py

```
from seats import seats_left


def test_some_taken():
    assert seats_left(10, 3) == 7


def test_overbooked():
    assert seats_left(10, 12) == 0
```

What a failure report tells you

|  |  |
| --- | --- |
| Underlined name | which test failed |
| `>` line | the assert that failed |
| `E` lines | the values compared, and where they came from |
| `file:line` | where to look |

seats.py

```
def seats_left(capacity, taken):
    if taken < 0:
        raise ValueError("taken must not be negative")
    return capacity - taken
```

Example tests

```
import pytest
from seats import seats_left


@pytest.fixture
def room():
    return {"capacity": 10}


def test_uses_fixture(room):
    assert seats_left(room["capacity"], 4) == 6
```

```
@pytest.mark.parametrize("taken, left", [(3, 7), (10, 0)])
def test_left(taken, left):
    assert seats_left(10, taken) == left
```

|  |  |
| --- | --- |
| @pytest.mark.parametrize | several inputs, one test |
| pytest.raises | an expected error |
| @pytest.fixture | shared setup |

## Recap

- Tests are `test_*` functions in `test_*.py` files, checked with plain `assert`.
- Run them with `python -m pytest`; `-q` for less output; a node id for one test; status 0 means all passed.
- In a failure, find the name, the `>` line and the `E` values.
- `pytest.raises` for errors, fixtures for shared setup, `parametrize` for many inputs.

This is the last topic in this module.

## Cheat sheet

Optional time: about 5 minutes, in addition to the time above

Extend `test_seats.py` for the `seats.py` in this topic: write one `@pytest.mark.parametrize` test with at least three `(capacity, taken, left)` cases, including a full room, plus a `pytest.raises` test for a `taken` value of `-1`.

Run it with real pytest in a virtual environment, as in the modules topic. No answer is shown here; the success criteria tell you when you are done.

Success criteria: `python -m pytest -q` shows one dot per parametrized case plus one for the `raises` test, and changing one expected number makes exactly that case fail under its own test id.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: Click the terminal's input line (or Tab to it), type one command at a time and press Enter after each.
2. What to do or type: Run `python -m pytest`, then `python -m pytest -q`, then `python -m pytest test_seats.py::test_some_taken`.
3. What to expect: The terminal prints a dot for each pass, `F` for each failure, and the selected report.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Read the three questions in the checks above.
2. What to do or type: In Failure report, press the line that answers one of them.
3. What to expect: Feedback below explains each line you press, and the lines that answer a question stay outlined.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Use the test_seats.py editor in the workspace; seats.py and the example tests sit above it.
2. What to do or type: Replace all four `___` placeholders: a plain `assert` in `test_some_taken`, `pytest.raises(ValueError)` in `test_bad_input`, `@pytest.fixture` above `capacity` and `@pytest.mark.parametrize("taken, left", [...])` above `test_left`. Press Run or Ctrl+Enter (Cmd+Enter on a Mac).
3. What to expect: Problems names any placeholder, indentation or construct outside its supplied test; Output confirms the completed scaffold.
4. How to know it's done: The author check reads done, then Continue appears. Reset code restores all four placeholders.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `python -m pytest` | run all tests |
| `python -m pytest -q` | quieter report |
| `python -m pytest test_seats.py::test_some_taken` | one test |
| `with pytest.raises(ValueError):` | expect an exception |
| `@pytest.fixture` | shared setup, requested by parameter name |
| `@pytest.mark.parametrize("a, b", [(1, 2)])` | one run per tuple |

## Sources

Checked against these live official pytest pages on 2026-10-13. Every report shown is real output of pytest 9.1.1 on CPython 3.14 for these exact files (the platform line and timings will differ on your machine).

- pytest: Get started
- pytest: How to write and report assertions in tests
- pytest: How to invoke pytest
- pytest: How to use fixtures
- pytest: How to parametrize fixtures and test functions
- pytest documentation home

## Static interaction alternatives

### predict

Prediction (practice, not scored): seats.py defines seats_left(capacity, taken) returning capacity - taken; test_seats.py imports it and defines test_some_taken with assert seats_left(10, 3) == 7. What does python -m pytest do? Options: finds the test and reports 1 passed; nothing runs because tests must be inside a class; an error because assert needs assertEquals; skipped because it needs @Test. Answer: 1 passed. pytest collects functions named test_* from files named test_*.py, with no class or annotation needed, and a plain assert is the check.

### terminal

Terminal activity in /home/sam/shop with the venv active, seats.py (seats_left raises ValueError when taken is negative and otherwise returns capacity - taken) and test_seats.py with test_some_taken (assert seats_left(10, 3) == 7) and test_overbooked (assert seats_left(10, 12) == 0). Real pytest 9.1.1 output: python -m pytest prints a session header, collected 2 items, test_seats.py .F, then a FAILURES section for test_overbooked showing > assert seats_left(10, 12) == 0, E assert -2 == 0 and E + where -2 = seats_left(10, 12), and ends with 1 failed, 1 passed; echo $? then prints 1. python -m pytest -q prints .F, the same failure details and 1 failed, 1 passed, without the header. python -m pytest test_seats.py::test_some_taken runs only that test: 1 passed, exit status 0.

### explore

Report-reading activity on real pytest 9.1.1 output. The report's lines: a FAILURES separator; the underlined name test_overbooked, which names the failing test; def test_overbooked():; > assert seats_left(10, 12) == 0, the line marked > that failed; E assert -2 == 0, the values compared (actual -2, expected 0); E + where -2 = seats_left(10, 12), which call produced -2; test_seats.py:9: AssertionError, the file and line; the short test summary FAILED test_seats.py::test_overbooked - assert -2 == 0; and 1 failed, 1 passed in 0.01s.

### explore

Authoring activity: complete test_seats.py with one plain assert, pytest.raises(ValueError), a @pytest.fixture and a @pytest.mark.parametrize decorator. Run checks only those structures in this scaffold; the terminal separately demonstrates real pytest output. Expected result: all four pytest techniques are reported found.

### mcq

Apply question: which test checks seats_left(10, taken) for several inputs without repeating code, reporting each case separately? Options: @pytest.mark.parametrize("taken, left", [(3, 7), (10, 0)]) on def test_left(taken, left) asserting seats_left(10, taken) == left (correct: one function, run once per tuple); the same decorator on def test_left() with no parameters (pytest reports an error: the function uses no argument named taken); one test with assert ... and ... (a single test, so the first failing case hides the second); @pytest.fixture on the test function (a fixture provides setup values; it does not run a test per case). Retry: with pytest.raises(ValueError): seats_left(10, -1) passes only if ValueError is raised. Comparing the result to ValueError compares a number with a class; try/except/pass also passes when nothing is raised; raises is not a built-in name.
