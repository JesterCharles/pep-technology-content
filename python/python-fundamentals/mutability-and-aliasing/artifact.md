# Mutability and aliasing

## Objectives

- Predict when two names refer to the same object after assignment, list append and passing a list to a function, and confirm it with \`is\`
- Classify list, dict and set as mutable and int, str and tuple as immutable by predicting whether an operation changes the original object
- Fix an aliasing bug by copying (slice, list(), dict.copy() or copy.deepcopy) or by replacing a mutable default argument with None

## Teaching

### Start with a guess

Practice prediction, not scored. In Java, two variables can refer to one `ArrayList`. Guess whether Python's `b = a` copies.

### Names point at objects

A Python variable is a name that points at an object, much like a Java reference. `b = a` copies the pointer, not the list: both names now share one object, so a change made through either name shows through both.

Passing a list to a function works the same way: the parameter becomes another name for the caller's list, so `items.append(0)` inside the function changes it.

`list(a)` builds a new list with the same items. `x is y` is `True` only when both names point at the same object.

### Mutable and immutable

Lists, dicts and sets are mutable: methods such as `append`, `add`, `sort` and item assignment change the object itself, so every name pointing at it sees the change.

Ints, floats, strings and tuples are immutable: nothing changes them in place. `s.upper()`, `t + (3,)` and `n += 1` build a new object, and only the name on the left of an assignment is moved to it; other names keep the old object.

### Copy, or start fresh with None

To change a list without touching the caller's, copy it first: `a[:]`, `list(a)` or, for a dict, `d.copy()`. These are shallow copies: nested lists inside are still shared, so use `copy.deepcopy(a)` for nested data.

A default value is created once, when `def` runs, so a mutable default such as `tags=[]` is shared by every call (see the right). Use `tags=None` and create the list inside: `if tags is None: tags = []`.

## Model

Names point at objects. The diagram is redrawn from the statements you run; results match real Python 3.

```
a = [1, 2]
b = a
b.append(3)
print(a)
```

Names and the objects they point toNames and objects now: a points at list #1 [1, 2]. list #1 [1, 2] a

a points at list #1 [1, 2].

```
def add_zero(items):
    items.append(0)
```

| Mutable: can change in place | Immutable: operations make a new object |
| --- | --- |
| list, dict, set | int, float, str, tuple |

```
def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags

add_tag("a")   # ['a']
add_tag("b")   # ['a', 'b']  the same default list
```

|  |  |
| --- | --- |
| b = a | no copy: one object, two names |
| a[:] / list(a) / d.copy() | shallow copy: new outer object |
| copy.deepcopy(a) | copies nested objects too |
| def f(x, items=None): | fresh list per call |

## Recap

- Assignment and argument passing never copy; they add another name for the same object.
- `is` asks "same object?"; `==` asks "equal values?".
- list, dict and set change in place; int, str and tuple never do.
- Copy with `[:]`, `list()`, `dict.copy()` or `copy.deepcopy()`; use `None` instead of a mutable default.

Next topic: Modules, imports and virtual environments

## Cheat sheet

A meeting room has a whiteboard screwed to the wall when the room is built. A meeting that brings its own board uses that one, but a meeting that forgets writes on the wall board, and the notes from every earlier meeting are still on it. A careful office instead keeps a stack of fresh boards by the door and hands a new one to each meeting that arrives without one.

A mutable default is made once, like the wall board; checking for nothing and making a fresh one on each call is the stack.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: In Run a statement, press the statement buttons, starting with `b = a`.
2. What to do or type: The output box shows each result, and the arrows in the panel show which names point at which list.
3. What to expect: Statements run in the order you press them: pressing `c.append(4)` before `c = list(a)` gives a `NameError`.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: In What does this operation do?, read the item on the card.
2. What to do or type: Press the button for the group it belongs to: Changes the original or Makes a new object.
3. What to expect: Right: the item moves to Sorted so far and the next item appears. Wrong: the feedback says Not this group and the card stays, so try another button.
4. How to know it's done: Continue appears when every item is sorted.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `b = a` | same object |
| `a is b` | identity test |
| `a[:]`, `list(a)`, `d.copy()` | shallow copy |
| `copy.deepcopy(a)` | deep copy (import copy) |
| `def f(items=None):` / `if items is None: items = []` | safe default |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. Every result shown was produced by running the exact statements in CPython 3.14.

- Language reference: Data model (objects, identity, mutability)
- Programming FAQ: shared default values and changing lists through other names
- Python tutorial: Default argument values are evaluated only once
- copy: Shallow and deep copy operations

## Static interaction alternatives

### predict

Prediction (practice, not scored): a = [1, 2]; b = a; b.append(3); print(a). Options: [1, 2]; [1, 2, 3]; [3]; an error. Answer: [1, 2, 3]. b = a makes b a second name for the same list, so appending through b changes the one list that a also refers to. Assignment never copies.

### explore

Names activity starting from a = [1, 2], with real Python 3 results. b = a points b at the same list. b.append(3) then makes a show [1, 2, 3]. c = list(a) builds a new list with the same items; c.append(4) changes only c. add_zero(a), where add_zero appends 0 to its parameter, changes a itself to end in 0, because the parameter is another name for the same list. print(a is b, a is c) prints True False after b = a and c = list(a): b shares a's list, c is a separate copy even though its items started equal.

### drag

Sorting activity, real Python 3 behaviour. nums.append(4) on a list: changes the original. name.upper() on a str: makes a new string; name is unchanged. point + (3,) on a tuple: makes a new tuple. prices["pen"] = 3 on a dict: changes the original. count += 1 on an int: makes a new int and moves count to it. tags.add("py") on a set: changes the original. sorted(nums) on a list: makes a new sorted list and leaves nums unchanged (nums.sort() would change it).

### mcq

Apply question: def add_tag(tag, tags=[]): tags.append(tag); return tags keeps tags between calls because the default list is created once. Fixes: tags=list() (still evaluated once when def runs, so still shared); tags=None then if tags is None: tags = [] (correct: a new list on every call that omits tags); calling tags.clear() at the end (the caller would receive an emptied list); returning tags.copy() (the hidden default still keeps growing). Retry: grid = [[1, 2], [3, 4]]; to change grid2[0] without touching grid, use copy.deepcopy(grid). grid2 = grid is no copy; grid.copy() and list(grid) are shallow, so grid2[0] is still the same inner list as grid[0].
