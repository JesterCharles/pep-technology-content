# Python Fundamentals lab: the workshop sign-up desk

## Goal

The sign-up desk keeps its workshop records in a small Python package, and a volunteer asked for a one-line summary script.
In ten linked tasks you port two Java methods, clean and count the records, fix two aliasing bugs, raise and log a clear error, finish the summary script and write your own pytest tests.
Everything runs on your own computer: no cloud account, no Docker, no database.

About 55 minutes in total, setup included (an estimate): about 25 minutes on the first day (setup and Tasks 1-6) and 30 on the second (Tasks 7-10). If you pass 60 minutes in total, pause and finish in self-study.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/signups/records.py` | 1-8: the record functions, each marked with a `TODO Task N` comment |
| `starter/signups/cli.py` | 9: the summary script |
| `starter/test_signups.py` | 10: your own tests |

Leave `tests/`, `expected/`, `starter/signups/sample.py`, `starter/signups/__init__.py` and `starter/requirements.txt` as they are.
The checks are named after their tasks, and most failure messages say what to do next; when one stops with a plain Python error such as `TypeError`, the check's name still tells you the task.

## Prerequisites

Python 3.12 or later. Check it in a terminal:

- macOS and Linux: `python3 --version`
- Windows: `py --version`

## Setup (once, needs the internet)

Open a terminal in the lab folder (the folder that holds this README). Create and activate a virtual environment, then install the pinned test tools from the requirements file.

macOS and Linux:

```
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```
py -m venv .venv
.venv\Scripts\Activate.ps1
```

Once the environment is active, `python` means its Python on every system. Then:

```
python -m pip install -r starter/requirements.txt
```

Activate the environment again in every new terminal before you run the tests.

## Tasks

Run the one test command from the lab folder after each task:

```
python -m pytest -q
```

Before you start, 11 tests fail: the ten `test_taskNN_...` checks and the example test in `starter/test_signups.py`.
Work in order; Task 9 uses the functions from Tasks 1-6, and Task 10 tests your Task 1 and Task 8 code.
Tasks 1-6 use the first day's topics (syntax, functions, collections, comprehensions) and Tasks 7-10 the second day's (mutability, modules, exceptions and logging, scripts, pytest), so the end of Task 6 is the place to stop between the two days.

### Task 1: port the Java desk methods (`records.py`)

The old Java desk had these two methods. Rewrite each as Python in `session_status` and `tables_needed`: indentation instead of braces, no type declarations, `elif` for `else if`, and keep the `while` loop.

```java
static String sessionStatus(int capacity, int taken) {
    if (taken >= capacity) {
        return "full";
    } else if (capacity - taken <= 2) {
        return "almost full";
    } else {
        return "open";
    }
}

static int tablesNeeded(int people, int tableSize) {
    int tables = 0;
    int seated = 0;
    while (seated < people) {
        tables++;
        seated += tableSize;
    }
    return tables;
}
```

Python has no `++`: write `tables += 1`. If a test run hangs, your `while` loop never ends: press Ctrl+C and check that the loop changes `seated`.

### Task 2: look up one sign-up (`records.py`)

`find_signup(signups, email)` loops over the list with `for`, compares each `signup["email"]` with `==` and returns the first match; after the loop it returns `None`.
`describe(signups, email)` calls it and tests the result with `is None` (never `== None`, and there is no `null`): return `"<email> is not signed up"` for `None`, otherwise `"<email> is in <session>"`.

### Task 3: clean one raw row (`records.py`)

Give `normalize_signup` the default `default_session="general"` and type hints (`row: dict`, `default_session: str`, return `-> dict`).
Return a new dict: the email stripped and lower-cased (`.strip().lower()`), the name stripped and capitalised word by word (`.strip().title()`), and the row's session, or `default_session` when the row's session is the empty string.
The check calls it as `normalize_signup(row)` and as `normalize_signup(default_session="intro", row=row)`: keyword arguments may come in any order.
Type hints document the types; Python does not check them when the function runs.

### Task 4: one flexible report line (`records.py`)

Change the signature to `report_line(title, *values, **fields)`, so it takes any number of values and any keyword fields.
Return the title, `": "`, then the values joined with `", "`; when there are fields, add `" ("`, each field as `key=value` in the order given, joined with `", "`, and `")"`.
The values may be any type, such as numbers, and `", ".join(...)` accepts only strings, so turn each value into text with `str(value)` first.

- `report_line("data", "1 signed up", "3 seats left", status="open")` returns `"data: 1 signed up, 3 seats left (status=open)"`.
- `report_line("x", 1, 2, b=True, a=1)` returns `"x: 1, 2 (b=True, a=1)"`.

### Task 5: counts and lookups (`records.py`)

- `count_by_session` raises `KeyError` the first time it meets a session. Fix its one counting line with `dict.get` and a default of 0.
- `open_sessions(capacity, counts)` returns the sessions, in `capacity` order, that still have a free seat. Loop over `capacity.items()` and unpack each pair into two names in the `for` line. A session missing from `counts` has no sign-ups yet.
- `cancel(emails, email)` removes the email from that same list and returns `True`; when the email is not in the list it returns `False` and changes nothing.

### Task 6: comprehensions (`records.py`)

- Rewrite the `emails_for` loop as one list comprehension, with its `if` filter inside the brackets.
- `unique_emails` returns the distinct emails with one set comprehension.
- `seats_left_by_session(capacity, counts)` returns `{session: free seats}` for every session in `capacity` with one dict comprehension; a session missing from `counts` has every seat free.

This is the end of the first day.

### Task 7: two aliasing bugs (`records.py`)

- Calling `add_to_waitlist("a@example.com")` and then `add_to_waitlist("b@example.com")`, both without a waitlist, returns `["a@example.com", "b@example.com"]` the second time instead of `["b@example.com"]`: the default list is created once, when Python defines the function, and every call shares it. Use `waitlist=None` and create a new list inside the function when it is `None`. A waitlist that is passed in, even an empty one, is appended to and returned.
- `mark_checked_in` changes the caller's dict. Copy it first, then set `"checked_in"` on the copy.

### Task 8: a clear error for a bad seats value (`records.py`)

A sign-up form sends the number of seats as text, such as `" 2 "` or `"two"`. Make `parse_seats(text)` report bad text clearly:

1. Import the standard-library `logging` module at the top of `records.py`, and create the module logger under it with `logging.getLogger(__name__)` in a variable named `logger`.
2. Define an exception class `SignupError` that subclasses `Exception`.
3. Rewrite `parse_seats(text)` with `try` / `except ValueError` / `else` / `finally`:
   - `try` converts the text with `int(...)` (it accepts surrounding spaces);
   - `except ValueError` logs the problem with `logger.exception(...)`, then raises `SignupError("seats must be a whole number, got ...")` with the text in the message;
   - `else` raises `SignupError("seats must be at least 1, got ...")` with the number when it is below 1, and otherwise returns it;
   - `finally` logs one `logger.debug(...)` line for every value checked.

Never use a bare `except:`; it would also catch mistakes you want to see. Python has no checked exceptions: nothing forces a caller to catch `SignupError`, so the message must say what went wrong.

### Task 9: the summary script (`cli.py`)

1. Import what the script needs: the standard-library `sys` module, and the record functions you use from your own `signups.records` module with `from ... import`.
2. In `main(argv)`:
   - when the session argument is missing (`argv` has fewer than 2 items), print `usage: python -m signups.cli SESSION` to `sys.stderr` and return `2`;
   - when `argv[1]` is not a key of `CAPACITY`, print `unknown session: <name>` to `sys.stderr` and return `1`;
   - otherwise normalize every row of `SIGNUPS`, count them by session, and work out the session's seats left and its status. Call `session_status` with keyword arguments in the opposite order to its parameters (`taken=` first, then `capacity=`).
   - Build a list `parts` of the two texts `"<n> signed up"` and `"<n> seats left"` and a dict `fields` with the key `"status"`, print `report_line(session, *parts, **fields)` and return `0`.
3. Replace the bare `main(sys.argv)` at the bottom with the guard `if __name__ == "__main__":` and `sys.exit(main(sys.argv))`, so importing the module runs nothing.

Try it: move into the `starter` folder (`cd starter`), run the script, and read its exit status (`echo $?` on macOS and Linux, `echo $LASTEXITCODE` in PowerShell):

```
python -m signups.cli general
```

It prints `general: 3 signed up, 2 seats left (status=almost full)` and exits with status 0. Run it with no session and check that the status is 2. Then go back to the lab folder (`cd ..`) before you run the tests again.
A package is a folder of modules with an `__init__.py` file, so `signups.records` means `records.py` inside the `signups` folder. `cli.py` is part of the `signups` package, so run it as a module with `-m` from the folder that contains `signups`: Python then puts that folder first on its search path and finds `signups.records`. `python signups/cli.py general` would put the `signups` folder itself first on the search path instead of `starter`, so the `signups` package cannot be found and the run fails with `ModuleNotFoundError: No module named 'signups'`.

### Task 10: your own tests (`test_signups.py`)

Add to `starter/test_signups.py`, using plain `assert` statements:

1. a `@pytest.fixture` named `room` that returns `{"capacity": 10}`;
2. one test decorated with `@pytest.mark.parametrize("taken, expected", [...])` with at least three cases, one each for `"open"`, `"almost full"` and `"full"`, that takes `room` as a parameter and checks `session_status(room["capacity"], taken)`;
3. a test that checks `parse_seats("two")` raises `SignupError`, using `with pytest.raises(SignupError):` (import `SignupError` from `signups.records`).

Run only your file while you work: `python -m pytest -q starter/test_signups.py`. When a test fails, pytest prints the failing `assert` line with the values it compared.
The Task 10 check runs your tests against your code, where they must pass, and then against four deliberately broken versions of `session_status` and `parse_seats`, where they must fail.

## Test

The one test command, run from the lab folder with the virtual environment active:

```
python -m pytest -q
```

When you finish, every test passes: your own tests plus the ten lab checks.

## Expected output

`expected/on-completion.txt` shows a completed run. The number of dots and tests depends on how many tests you wrote, and the time differs on every run.

## Offline note

Only the setup step uses the network. The tests, the summary script and your own tests run offline.

## Cleanup

The lab creates `.venv` and `.pytest_cache` in the lab folder and `__pycache__` folders under `starter/` and `tests/` (and `starter/.pytest_cache` if you ran pytest inside `starter`). Deactivate the environment with `deactivate`, then delete them from the lab folder:

- macOS and Linux: `rm -rf .venv .pytest_cache starter/.pytest_cache starter/__pycache__ starter/signups/__pycache__ tests/__pycache__`
- Windows PowerShell: `Remove-Item -Recurse -Force .venv, .pytest_cache, starter\.pytest_cache, starter\__pycache__, starter\signups\__pycache__, tests\__pycache__ -ErrorAction SilentlyContinue`

## Troubleshooting

- **`command not found: python` or `python3`**: on macOS and Linux create the environment with `python3`; after `source .venv/bin/activate`, `python` works. On Windows use `py`.
- **`No module named pytest`**: the virtual environment is not active in this terminal. Activate it and run the test command again.
- **Only your own tests ran, or `no tests ran`**: you are in the `starter` folder. Go back to the lab folder with `cd ..` and run the test command there.
- **`ModuleNotFoundError: No module named 'signups'` when running the script**: run `python -m signups.cli ...` from the `starter` folder (Task 9).
- **The whole run fails at collection with `No module named 'signups'`**: a `pytest.ini`, `pyproject.toml` or `PYTEST_ADDOPTS` setting outside this lab changed how pytest imports. Copy the lab to a folder of its own and clear `PYTEST_ADDOPTS`.
- **The test run hangs**: press Ctrl+C; a `while` loop that never ends is the usual cause (Task 1).
- **PowerShell refuses to run `Activate.ps1`**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then activate again.
- **A `SyntaxError`, `IndentationError` or `NameError` stops every test**: fix the file and line that pytest names first (a `NameError` such as `name 'logging' is not defined` usually means a missing import); one broken file stops the whole run.
- **You pass 60 minutes**: pause, note the task you are on, and finish in self-study; every check is still named after its task.
