# Exceptions and logging

## Objectives

- Handle an expected error with try, except, else and finally, catching a specific exception instead of using a bare except
- Raise an exception with a clear message, including a custom exception class, and explain how Python exceptions differ from Java's checked exceptions
- Use the logging module instead of print: get a module logger, choose a level and log a caught exception with its traceback

## Teaching

### Start with a guess

Practice prediction, not scored. Java's `Integer.parseInt("abc")` throws `NumberFormatException`. Guess what Python does.

### try, except, else, finally

Put the risky call in `try`. An `except ValueError:` block runs only for that exception type. `else` runs only when `try` raised nothing, and `finally` runs every time, even when an error escapes.

Catch the specific exception you expect. A bare `except:` also swallows unrelated bugs, and even Ctrl+C (`KeyboardInterrupt`). An exception that no `except` matches keeps travelling up to the caller, after `finally` has run.

### Log, don't print

Keep `print` for a script's normal output. For events, use `logging`: each module gets `logger = logging.getLogger(__name__)`, and messages carry a level: `debug`, `info`, `warning`, `error`, `critical`.

The program's entry point sets the threshold once, for example `logging.basicConfig(level=logging.INFO)`; messages below it are dropped. The default threshold is WARNING.

Inside an `except` block, `logger.exception("...")` logs at ERROR level and adds the traceback.

### Raise your own exceptions

`raise ValueError("quantity must be positive")` stops the function and hands the error to the caller; always give a clear message.

For a domain error, define a class: `class OutOfStock(Exception): pass`, then `raise OutOfStock("only 2 left")`. Callers can catch it by name with `except OutOfStock:`.

### No checked exceptions

Python has no checked exceptions: there is no `throws` clause, and nothing forces a caller to catch. An uncaught exception stops the program with a traceback, so document what a function raises.

## Model

The code being run. Output and tracebacks are the real Python 3 results for this exact code.

```
qty = int("abc")
print(qty)
```

```
def parse_qty(text):
    try:
        qty = int(text)
    except ValueError:
        print("not a number")
        return None
    else:
        print("parsed")
        return qty
    finally:
        print("done")
```

Highlighted lines ran on the last call.

inventory.py

```
import logging

logger = logging.getLogger(__name__)

def parse_qty(text):
    try:
        return int(text)
    except ValueError:
        logger.exception("could not parse %r", text)
        return None
```

app.py

```
import logging
import inventory

logging.basicConfig(level=logging.INFO)
inventory.logger.debug("starting")
inventory.logger.info("loading stock")
inventory.logger.warning("low stock: pen")
inventory.parse_qty("abc")
```

A custom exception, raised and caught by name

```
class OutOfStock(Exception):
    pass

def take(n):
    if n > 2:
        raise OutOfStock("only 2 left")
    return n

try:
    take(5)
except OutOfStock:
    print("sold out")
```

Java

```
void reserve(int n) throws OutOfStockException {
    if (n > left) throw new OutOfStockException("only " + left + " left");
}
```

```
class OutOfStock(Exception):
    pass

def reserve(n):
    if n > left:
        raise OutOfStock("only 2 left")
```

## Recap

- `try` / `except SpecificError` / `else` / `finally`; avoid bare `except:`.
- `raise` an exception with a clear message; subclass `Exception` for your own.
- No checked exceptions: nothing forces a caller to catch.
- `logger = logging.getLogger(__name__)`; set the level once; `logger.exception()` inside `except` adds the traceback.

Next topic: Writing and running script files

## Cheat sheet

A newsroom editor sets one threshold each morning: only stories at least this important reach the front page. Reporters still write up the minor items, but those stay in the notebook unless the editor lowers the threshold. With no instruction at all, the house default is fairly high, so routine updates never make the paper while warnings and emergencies always do.

A logging level is that threshold, set once where the program starts; messages below it are still written but are not shown.

Optional time: about 5 minutes, in addition to the time above

Write `parse_qty(text)`. It returns `int(text)`; when that raises `ValueError`, it logs the problem with `logger.exception` and returns `0`. Configure logging once with `logging.basicConfig(level=logging.WARNING)`.

Try it in any Python 3.10 or later interpreter, or trace it on paper. No answer is shown here; the success criteria tell you when you are done.

Success criteria: `parse_qty("3")` returns `3` and logs nothing; `parse_qty("abc")` returns `0` and the log shows an ERROR line followed by a traceback that ends in `ValueError`; your handler names `ValueError`, not a bare `except:`.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: In Call parse_qty, read the three values for `text`.
2. What to do or type: Pick a value, then press Call parse_qty(text).
3. What to expect: The output box prints what ran and what came back, and the model highlights each line that ran.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: In Run app.py, pick a level for `basicConfig`.
2. What to do or type: Press python3 app.py.
3. What to expect: The log lines the program prints appear in the output box. Run it at each level and compare.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Use the inventory.py editor in the workspace.
2. What to do or type: Replace `___` with a `raise OutOfStock(...)` that has a message. Then, aligned with `try`, add `except OutOfStock:` calling `logger.exception(...)`, `else:` calling `logger.info(...)` and `finally:` calling `logger.debug(...)`. Press Run or Ctrl+Enter (Cmd+Enter on a Mac).
3. What to expect: Problems names any placeholder, indentation or structure outside its supplied block; Output confirms the completed scaffold.
4. How to know it's done: The author check reads done, then Continue appears. Reset code restores the incomplete starter.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `except ValueError as e:` | catch one type, keep the object |
| `else:` / `finally:` | no error / always |
| `raise ValueError("why")` | raise with a message |
| `class OutOfStock(Exception): pass` | custom exception |
| `logging.basicConfig(level=logging.INFO)` | threshold, set once at the entry point |
| `logger.exception("msg")` | ERROR plus traceback |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. Every output shown was produced by running the exact code in CPython 3.14; traceback layout differs slightly between versions.

- Python tutorial: Errors and exceptions
- Built-in exceptions
- Logging HOWTO
- logging: Logging facility for Python

## Static interaction alternatives

### predict

Prediction (practice, not scored): qty = int("abc"); print(qty). Options: it prints 0; ValueError: invalid literal for int() with base 10: 'abc'; NumberFormatException; it prints None. Answer: ValueError. int() raises ValueError when the text is not a whole number; nothing is printed because the program stops at that line unless the error is caught. NumberFormatException is the Java name; Python never substitutes 0 or None.

### explore

Flow activity for parse_qty(text), whose try block runs qty = int(text), except ValueError prints not a number and returns None, else prints parsed and returns qty, and finally prints done. Real Python 3 runs: parse_qty("5") prints parsed then done and returns 5 (try, else, finally). parse_qty("abc") prints not a number then done and returns None (try, except ValueError, finally). parse_qty(None) prints done, then the TypeError int() argument must be a string, a bytes-like object or a real number, not 'NoneType' escapes to the caller, because except ValueError does not match a TypeError; finally still ran.

### explore

Logging activity. app.py calls logging.basicConfig(level=...), then inventory.logger.debug("starting"), .info("loading stock"), .warning("low stock: pen") and inventory.parse_qty("abc"), which catches the ValueError and calls logger.exception. Real Python 3 output at level INFO: INFO:inventory:loading stock, WARNING:inventory:low stock: pen, ERROR:inventory:could not parse 'abc', followed by the traceback ending ValueError: invalid literal for int() with base 10: 'abc'. At WARNING the INFO line is dropped too. At DEBUG the first line DEBUG:inventory:starting also appears. The default format is LEVEL:logger name:message, and the logger name is the module name, inventory.

### explore

Authoring activity: complete inventory.py. Keep the supplied OutOfStock class and module logger; raise OutOfStock with a message, catch it with except, add else and finally blocks, and log the handled exception with logger.exception. Run checks only these structures in this scaffold. Expected result: all exception-flow and logging requirements are reported found.

### mcq

Apply question: translate Java void reserve(int n) throws OutOfStockException, which throws when stock is short. Options: def reserve(n) throws OutOfStock: (SyntaxError: Python has no throws clause); class OutOfStock(Exception): pass, then raise OutOfStock("only 2 left") inside reserve (correct); raise "only 2 left" (TypeError: exceptions must derive from BaseException); return OutOfStock("only 2 left") (returns an exception object instead of raising it, so the caller's code carries on). Retry: true statement: a caller may leave OutOfStock uncaught; it then travels up and stops the program with a traceback. Python has no checked exceptions or throws clause, and custom classes derived from Exception can be raised.
