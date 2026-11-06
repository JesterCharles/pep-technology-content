# Functions and arguments

## Objectives

- Define a function with positional and default parameters and call it with keyword arguments in any order
- Write a function that accepts \*args and \*\*kwargs, and unpack a list or dict into a call with \* and \*\*
- Add type hints to parameters and the return value, and explain that Python does not enforce them at run time

## Teaching

### Start with a guess

Practice prediction, not scored. Java matches arguments by position only; Python can also match them by name.

### Positional, default and keyword arguments

`def` starts a function; no return or parameter types are required.

A parameter with `=` has a default: `nights=1` is used when the call leaves it out. Among ordinary positional-or-keyword parameters, required parameters come before defaulted ones; keyword-only parameters have additional forms.

A call can pass arguments by position, `book("A12", 3)`, or by name, `book(nights=3, room="A12")`. Named (keyword) arguments may come in any order. In introductory calls without starred unpacking, put positional arguments before keywords, and never give one parameter two values.

### *args, **kwargs and unpacking

In a `def`, `*parts` collects any extra positional arguments into a tuple, and `**fields` collects extra keyword arguments into a dict. The names are up to you; `*args` and `**kwargs` are the common ones.

In a call, the stars work the other way round: `*values` spreads a list into separate positional arguments, and `**opts` spreads a dict into keyword arguments. Without the star, the whole list arrives as one argument.

### Write the hints into a signature

You can annotate parameters and the return value: `def seats_left(capacity: int, taken: int) -> int:`. A default goes after the hint: `nights: int = 1`.

Starred parameters keep their stars and can sit after the defaulted ones: `def log(level: str = "info", *parts, **fields):`. The return hint comes last, before the colon.

### Type hints are not enforced

Unlike Java types, these hints are not checked when the code runs. Python stores them in `__annotations__` and runs the body with whatever arguments arrive. Their value is for readers and for tools such as type checkers and editors, which can flag a mismatch before you run anything.

## Model

The function being called. Results are the real Python 3 results for these exact calls.

```
def greet(name, greeting="Hello"):
    return greeting + ", " + name + "!"

print(greet(greeting="Hi", name="Ana"))
```

```
def book(room, nights=1, breakfast=False):
    return (room, nights, breakfast)
```

- **room**: not bound (last call failed or none yet)
- **nights**: not bound
- **breakfast**: not bound

```
def log(*parts, **fields):
    print(parts, fields)

values = [3, 4]
opts = {"sep": "-", "end": "!"}
```

- **parts**: not bound yet
- **fields**: not bound yet

Taught forms to reuse

```
def book(room: str, nights: int = 1) -> tuple:
    return (room, nights)

def log(*parts, **fields):
    print(parts, fields)

log(*values, **opts)
```

```
def double(x: int) -> int:
    return x * 2

double.__annotations__
# {'x': <class 'int'>, 'return': <class 'int'>}
```

| In the def | Receives |
| --- | --- |
| room | a required argument |
| nights=1 | an argument, or the default |
| *parts | extra positional arguments, as a tuple |
| **fields | extra keyword arguments, as a dict |

## Recap

- Defaults fill parameters the call leaves out; keyword arguments match by name in any order, after any positional ones.
- `*args` gathers extra positional arguments into a tuple; `**kwargs` gathers extra keyword arguments into a dict.
- In a call, `*list` and `**dict` spread values out.
- Type hints document intent; Python does not enforce them at run time.

Next topic: Lists, dicts, sets and tuples

## Cheat sheet

A courier office has two windows. At the first, you hand over any number of loose parcels and the clerk bundles them all into one crate, so the crate holds however many arrived. At the second, you hand over a crate you already packed and the clerk unpacks it onto separate shelves, one parcel per shelf. Hand that second clerk a crate without asking for it to be unpacked, and the whole crate lands on a single shelf as one item.

A starred parameter is the bundling window; a star in a call is the unpacking window; no star passes the crate as one item.

Optional time: about 4 minutes, in addition to the time above

Use the signature from this topic:

```
def log(level: str = "info", *parts, **fields):
    return level, parts, fields
```

Predict what each call returns: `log("warn", "disk", "full", host="db1")`, `log(*["error", "x"], **{"code": 7})` and `log()`. Then write a call that keeps `level` at its default but passes one keyword field.

Try it in any Python 3.10 or later interpreter, or trace it on paper. No answer is shown here; the success criteria tell you when you are done.

Success criteria: for every call you can say the value of `level`, `parts` and `fields` and whether each is a `str`, `tuple` or `dict`; your own call returns `'info'` as the level, an empty tuple and a dict with one entry.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: In Run a call, read the `book(...)` buttons.
2. What to do or type: Press a button to make that call.
3. What to expect: The output box shows the tuple `book` returns, or Python's error message, and the model shows what each parameter received.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: In Run a call, press one of the `log(...)` buttons.
2. What to do or type: The output box shows what `parts` (a tuple) and `fields` (a dict) received.
3. What to expect: Press `log(values)` and `log(*values)` one after the other and compare the two lines.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Use the functions.py editor in the workspace; the examples above it show the syntax.
2. What to do or type: Replace all four `___` placeholders: annotate `room` as `str`, `nights` as `int` and the return as `tuple`, add `*parts` and `**fields`, and call `describe` with `*values` and `**options`. Press Run or Ctrl+Enter (Cmd+Enter on a Mac).
3. What to expect: Problems names any placeholder or structure still out of place; Output confirms the completed scaffold.
4. How to know it's done: The author check reads done, then Continue appears. Reset code restores the starter and its placeholders.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `def f(a, b=2):` | a required, b defaulted |
| `f(b=5, a=1)` | keyword arguments, any order |
| `def f(*args, **kwargs):` | tuple and dict of extras |
| `f(*items, **options)` | spread a list and a dict |
| `def f(n: int) -> str:` | type hints, not enforced |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. Error text shown is from Python 3.14 and can differ slightly in older versions.

- Python tutorial: Defining functions and more on defining functions
- Language reference: Function definitions
- typing: Support for type hints

## Static interaction alternatives

### predict

Prediction (practice, not scored): def greet(name, greeting="Hello") returns greeting + ", " + name + "!". The call is greet(greeting="Hi", name="Ana"). Options: Hi, Ana!; Hello, Ana!; Ana, Hi!; an error because the arguments are in the wrong order. Answer: Hi, Ana!. Keyword arguments are matched by parameter name, so their order in the call does not matter, and the passed greeting replaces the default "Hello".

### explore

Call activity for def book(room, nights=1, breakfast=False): return (room, nights, breakfast). Real Python 3 results: book("A12") gives ('A12', 1, False), defaults fill nights and breakfast. book("A12", 3) gives ('A12', 3, False). book(nights=2, room="A12") gives ('A12', 2, False): keyword order does not matter. book("A12", breakfast=True) gives ('A12', 1, True). book() raises TypeError: book() missing 1 required positional argument: 'room'. book("A12", 2, nights=3) raises TypeError: book() got multiple values for argument 'nights'. book(room="A12", 2) is rejected before running: SyntaxError: positional argument follows keyword argument.

### explore

Call activity for def log(*parts, **fields): print(parts, fields), with values = [3, 4] and opts = {"sep": "-", "end": "!"}. Real Python 3 output: log(1, 2) prints (1, 2) {}. log(values) prints ([3, 4],) {}: the list arrives as one argument. log(*values) prints (3, 4) {}: the star spreads the list. log(level="info") prints () {'level': 'info'}. log(**opts) prints () {'sep': '-', 'end': '!'}. log(*values, **opts) prints (3, 4) {'sep': '-', 'end': '!'}.

### explore

Authoring activity: complete functions.py so describe has an annotated positional parameter, an annotated default parameter, *parts, **fields and a return annotation; then call it by unpacking values with * and options with **. Run checks only those required structures in this scaffold. Expected result: the checker reports the signature, annotations and both unpackings found.

### mcq

Apply question: def double(x: int) -> int: return x * 2. What does double("ab") return? Options: 'abab' (correct: the hint is not enforced, and str * 2 repeats the string); TypeError: x must be int (Python never checks the hint); 0; SyntaxError when the def runs (the hint syntax is valid). Retry: which statement about def seats_left(capacity: int, taken: int) -> int: is true? Correct: the hints document intent for readers and tools such as type checkers; Python does not enforce them at run time. Python does not check types on each call, does not convert "10" to 10, and -> int does not change what is returned.
