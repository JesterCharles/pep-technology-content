# Review scenarios: Python values, functions and scripts

## Objectives

- Predict the output of code that slices a list, builds a list with a comprehension and floor division, tests a zero count in a condition and looks up a missing dict key with get
- Predict what each parameter of a function with a default, \*args and \*\*kwargs receives when a call unpacks a list and a dict, given that type hints are not enforced at run time
- Predict the exit status of a script whose main(argv) catches a specific exception, and the pytest result of a parametrized pytest.raises test that imports the same file

## Teaching

### Activity 1 of 3: Predict the stock report

This page wraps up Python Fundamentals with new scenarios that mix its topics, all on the order tools of a small stationery shop. Answer from memory first; every option explains itself after you check.

A teammate's stock report script runs on Python 3. Trace it and commit to the two lines it prints.

```
prices = [12, 5, 30, 8, 25]
last_three = prices[-3:]
halves = [p // 2 for p in last_three if p > 10]
stock = {"pen": 3, "ink": 0}
print(last_three[::-1], halves)
if stock["ink"]:
    print("ink in stock", stock.get("pad"))
else:
    print("ink sold out", stock.get("pad"))
```

### Activity 2 of 3: Trace the label calls

The shop's label helper takes an item, an optional quantity, any number of extra notes and any keyword options. A teammate calls it twice, the first time by unpacking a list and a dict into the call.

```
def line(item: str, qty: int = 1, *notes, **extra):
    print(item, qty * 2, notes, extra)


args = ["ink", "3"]
opts = {"gift": True}
line(*args, "fragile", **opts)
line("pen", gift=False)
```

Two reminders: `print` separates its arguments with spaces and shows a tuple, list or dict the way you would type it in code; and `* 2` doubles a number but repeats a string, so `"ab" * 2` is `"abab"`.

### Activity 3 of 3: Check the order script and its test

The order tool is a script with a `main(argv)` function and a test file beside it. Both sit in the project folder, with the project's virtual environment active.

`order.py`

```
import logging
import sys

logger = logging.getLogger(__name__)


def parse_qty(text):
    qty = int(text)
    if qty < 1:
        raise ValueError("quantity must be at least 1")
    return qty


def main(argv):
    if len(argv) < 2:
        print("usage: python order.py QTY", file=sys.stderr)
        return 2
    try:
        qty = parse_qty(argv[1])
    except ValueError:
        logger.exception("rejected quantity")
        return 1
    print("ordering", qty)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

`test_order.py`

```
import pytest
from order import parse_qty


@pytest.mark.parametrize("text", ["0", "abc", "-4"])
def test_rejects_bad_quantity(text):
    with pytest.raises(ValueError):
        parse_qty(text)
```

You run these three commands in that folder:

```
python3 order.py abc
echo $?
python -m pytest -q
```

## Recap

- A negative slice start counts from the end and `[::-1]` reverses. A comprehension is the value to keep, a `for` part and an optional `if` filter. `//` floors, while `/` always gives a float.
- Zero, empty collections and `None` are false in a condition. `d.get(key)` returns `None` for a missing key, where `d[key]` raises `KeyError`.
- `*` and `**` spread a list and a dict into a call; `*args` gathers a tuple and `**kwargs` a dict. Type hints document intent, but Python does not enforce them.
- `main(argv)` returns the exit status, `sys.exit(main(sys.argv))` hands it to the shell, and the `__name__` guard keeps an import from running it. Catch the specific exception you expect and log it with `logger.exception`; test each bad input with `parametrize` and `pytest.raises`.

## Cheat sheet

Where to act: The slice that builds `last_three` and the comprehension that builds `halves`.

Next step: Write out `last_three` as a list first, remembering that a negative start counts from the end. Then keep only its values over 10 and apply `//` to each one.

Another hint Hint 2 of 2 for Activity 1

Where to act: The `if` test on `stock["ink"]` and the `stock.get("pad")` call.

Next step: Decide whether the number 0 counts as true or false in a condition. Then decide what `get` gives back for a key the dict does not have when you pass no default.

Where to act: The first call, `line(*args, "fragile", **opts)`.

Next step: Rewrite the call the way Python sees it once `*` and `**` have spread `args` and `opts` into separate arguments, then give each value to a parameter from left to right.

Another hint Hint 2 of 2 for Activity 2

Where to act: The expression `qty * 2` and the parameter `*notes`.

Next step: Check the type of the value `qty` receives in the first call and what `* 2` does to a value of that type. Then recall which collection type `*notes` gathers extra positional arguments into.

Where to act: `main` and the `parse_qty` call inside its `try` block.

Next step: Follow `argv[1]`, which is `"abc"`, into `int()`, decide which exception that raises, then find the `except` clause and the `return` that handle it.

Another hint Hint 2 of 2 for Activity 3

Where to act: The last two lines of `order.py` and the parametrize list in `test_order.py`.

Next step: Decide what `__name__` is when pytest imports `order` instead of running it. Then take each of the three strings through `parse_qty` and ask whether it ends in `ValueError`.

```
items[-3:]                          # the last three; items[::-1] reverses
[x // 2 for x in items if x > 10]   # value, for part, optional filter
d.get("key")                        # None when missing; d["key"] raises KeyError

def f(a, b=1, *args, **kwargs): ...  # args is a tuple, kwargs a dict
f(*a_list, **a_dict)                 # spread values into a call

def main(argv):
    ...
    return 0                             # 0 means success; non-zero means failure
if __name__ == "__main__":
    sys.exit(main(sys.argv))

@pytest.mark.parametrize("text", ["0", "abc"])
def test_rejects(text):
    with pytest.raises(ValueError):
        parse_qty(text)
```

Claims on this page were checked against these official sources, retrieved 2026-11-19.

- Python tutorial: An Informal Introduction: / always returns a float, // floor division; negative indices and slicing
- Python tutorial: Data Structures: list comprehensions with a for clause and an optional if clause
- Python: Built-in Types: truth value testing; s[i:j:k] slices; dict.get never raises KeyError
- Python reference: Function definitions: *identifier receives a tuple, **identifier a mapping of excess keyword arguments
- Python tutorial: More Control Flow Tools: default argument values, keyword arguments, unpacking argument lists with * and **
- Python: typing: the runtime does not enforce function and variable type annotations
- Python: __main__: __name__ is '__main__' only when the file runs as the top-level script; sys.exit(main())
- Python tutorial: Errors and Exceptions: handling specific exceptions with try and except
- Python: logging: Logger.exception logs at ERROR level with the exception information
- pytest: Assertions about expected exceptions: pytest.raises passes only when the block raises the exception
- pytest: How to parametrize: @pytest.mark.parametrize runs one test per value

## Static interaction alternatives

### predict

Question: What does the script print?. Option A: [25, 8, 30] [15.0, 12.5] ink sold out None - Not quite. The slice and the test are right, but // is floor division: on two ints it gives an int, so 30 // 2 is 15 and 25 // 2 is 12. Only / always gives a float. Option B: [25, 8, 30] [15, 12] ink sold out None - Correct. prices[-3:] is [30, 8, 25] and [::-1] reverses it. The comprehension keeps 30 and 25, the values over 10, and floors their halves to 15 and 12. A count of 0 is false in a condition, so the else branch runs, and get returns None for the missing key "pad". Option C: [25, 8, 30] [15, 12] ink in stock None - Not quite. Zero, empty collections and None count as false in a condition, so stock["ink"], which is 0, sends the code to the else branch. Option D: The first line is [25, 8, 30] [15, 12], then the script stops with KeyError: 'pad'. - Not quite. Square brackets raise KeyError for a missing key, but get does not: with no default it returns None. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: What do the two calls print?. Option A: ink 6 ('fragile',) {'gift': True} pen 2 () {'gift': False} - Not quite. Type hints are not enforced or applied at run time, so qty keeps the string "3" from the list. Multiplying a string by 2 repeats it, giving 33, not 6. Option B: The first call raises TypeError because "3" is not an int, so nothing is printed. - Not quite. Python does not check type hints when a function is called. The string "3" is accepted for qty; only a separate tool such as a type checker would flag it. Option C: ink 33 ('fragile',) {'gift': True} pen 2 () {'gift': False} - Correct. *args spreads "ink" and "3" into item and qty, "fragile" lands in notes as a tuple, and **opts passes gift=True into extra. Hints are not enforced, so "3" * 2 is "33". The second call uses the default qty=1, gets no notes, and its keyword argument lands in extra. Option D: ink 33 ['fragile'] {'gift': True} pen 2 [] {'gift': False} - Not quite. The values are right, but *notes gathers extra positional arguments into a tuple, not a list, so it prints ('fragile',) and (). Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: What does echo $? print, and what does pytest report?. Option A: echo $? prints 1; pytest reports 3 passed. - Correct. int("abc") raises ValueError; main catches it, logs it with its traceback and returns 1, which sys.exit hands to the shell. Importing order runs no main, because __name__ is "order" there. "0" and "-4" fail the range check and "abc" fails int(), so all three cases raise ValueError and pass. Option B: echo $? prints 2; pytest reports 3 passed. - Not quite. main returns 2 only when the argument is missing. Here argv has two items, so the code reaches parse_qty, and the caught ValueError returns 1. Option C: echo $? prints 1; pytest reports 3 failed, because main catches every ValueError before the test can see it. - Not quite. The test calls parse_qty directly, not main, so nothing catches the ValueError before pytest.raises sees it. Option D: echo $? prints 1; pytest stops before running any test, because importing order runs main and exits. - Not quite. The __name__ guard runs main only when the file is run as a script. When pytest imports order, __name__ is "order", so the import only defines the functions. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
