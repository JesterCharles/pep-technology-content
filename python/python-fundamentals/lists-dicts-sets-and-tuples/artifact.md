# Lists, dicts, sets and tuples

## Objectives

- Choose a list, dict, set or tuple for a described data need and justify the choice by ordering, uniqueness, mutability and lookup by key
- Add, look up, update and remove entries in a list and a dict, using dict.get to handle a missing key without a KeyError
- Iterate over a dict with items() and unpack each key-value pair into two variables

## Teaching

### Start with a guess

Practice prediction, not scored. In Java, `map.get("B2")` on a missing key returns `null`. Guess what Python's square brackets do.

### Four collections, four jobs

A list `[...]` keeps items in order, allows duplicates and can change; you reach items by position.

A tuple `(...)` is an ordered sequence that cannot change after it is made: good for a fixed record such as a coordinate, and usable as a dict key.

A set `{...}` holds unique items in no guaranteed order and answers "is x in it?" quickly.

A dict `{key: value}` maps unique keys to values, like Java's `HashMap`, and keeps insertion order. Keys must be hashable: strings and numbers work, and a tuple works only when all its elements are hashable; a list or a tuple containing a list does not.

### Change and look up entries

Lists: `queue.append(x)` adds at the end, `queue.pop(0)` removes and returns the first item, `queue.remove(x)` deletes the first matching value (`ValueError` if absent), and `queue[0]` reads by position.

Dicts: `stock["pen"] = 5` adds the key or updates its value, and `del stock["pen"]` removes it. `stock["cap"]` raises `KeyError` for a missing key; `stock.get("cap")` returns `None`, and `stock.get("cap", 0)` returns your default instead.

`for item, qty in stock.items():` gives each key and value together.

### Unpack items() in a loop

`prices.items()` yields each entry as a `(key, value)` tuple. Writing two names in the `for` line unpacks each tuple: `for code, price in prices.items():` sets `code` to the key and `price` to the value on every pass.

Looping over the dict itself, `for code in prices:`, gives only the keys. `.values()` gives only the values.

## Model

Current values. Results are the real Python 3 results for these exact statements.

```
seats = {"A1": "Ana"}
print(seats["B2"])
```

| Type | Example | Ordered | Duplicates | Changeable | Find by |
| --- | --- | --- | --- | --- | --- |
| list | ["a", "b"] | yes | yes | yes | position |
| tuple | (4.2, 7.1) | yes | yes | no | position |
| set | {"a", "b"} | no | no | yes | membership |
| dict | {"pen": 3} | insertion | unique keys | yes | key |

- **queue**: ['ana', 'ben']
- **stock**: {'pen': 3}

```
prices = {"pen": 2, "ink": 5}

list(prices.items())
# [('pen', 2), ('ink', 5)]
```

| Need | Choose |
| --- | --- |
| Items in order, may repeat, will change | list |
| A fixed record or a dict key | tuple |
| Unique items, fast "is it in there?" | set |
| Look up a value by key | dict |

## Recap

- list: ordered, repeats, changeable. tuple: ordered, fixed. set: unique, fast membership. dict: key to value.
- `append`, `pop`, `remove` change a list; `d[k] = v` and `del d[k]` change a dict.
- `d[k]` raises `KeyError` when k is missing; `d.get(k, default)` does not.
- `for k, v in d.items():` unpacks each key and value.

Next topic: Slicing and comprehensions

## Cheat sheet

Picture a small bakery on a busy morning. The queue at the counter keeps its order, the same customer can rejoin it, and people join and leave all day. The street address painted on the sign is written once and never edited. The register for a tasting evening only answers one question: is this name on it, once? The price board pairs each cake with its price, and staff find a cake by name to read or change what it costs.

Python's four built-in collections each do one of these jobs: the ordered queue, the fixed record, the one-each register and the labeled board.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: In Which collection fits this need?, read the item on the card.
2. What to do or type: Press the button for the group it belongs to: list, tuple, set or dict.
3. What to expect: Right: the item moves to Sorted so far and the next item appears. Wrong: the feedback says Not this group and the card stays, so try another button.
4. How to know it's done: Continue appears when every item is sorted.

1. Where to look: In Run a statement, press a button under List queue or Dict stock.
2. What to do or type: The result, the changed collection, or Python's error prints in the output box below the buttons.
3. What to expect: Statements run in the order you press them, so the list and dict keep your earlier changes.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `xs.append(x)` / `xs.pop(0)` / `xs.remove(x)` | add at end / take first / delete a value |
| `d[k] = v` | add or update |
| `del d[k]` | remove a key |
| `d.get(k, 0)` | read with a default, no KeyError |
| `x in s` | membership test (set, list, dict keys) |
| `for k, v in d.items():` | keys and values together |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. Error text shown is from Python 3.14 and can differ slightly in older versions.

- Python tutorial: Data structures
- Built-in types: lists, tuples, sets and dict

## Static interaction alternatives

### predict

Prediction (practice, not scored): seats = {"A1": "Ana"}; print(seats["B2"]). Options: it prints None; KeyError: 'B2'; it prints an empty string; it adds "B2" and prints nothing. Answer: KeyError: 'B2'. Square-bracket lookup of a missing key raises KeyError. seats.get("B2") is the call that returns None instead, and reading never adds a key.

### drag

Sorting activity. Rows read from a file, kept in order, duplicates possible: list (ordered, allows repeats). The unit price for each product code: dict (lookup by key). Every distinct email that signed up, checked often for membership: set (unique items, fast membership test). One (latitude, longitude) pair that must never change and is used as a dict key: tuple (immutable, so it can be a key; a list cannot). Tasks waiting to run, added at the end and removed from the front: list (ordered and changeable). Seat assignments: seat label to attendee name: dict (look up a value by a unique key).

### explore

Statements activity starting from queue = ["ana", "ben"] and stock = {"pen": 3}. Real Python 3 behaviour: queue.append("cy") gives ['ana', 'ben', 'cy']. queue.pop(0) returns 'ana' and removes it. queue.remove("ben") deletes the value 'ben', or raises ValueError: list.remove(x): x not in list if it is gone. queue[0] reads the first item (IndexError on an empty list). stock["pen"] = 5 updates pen; stock["ink"] = 2 adds ink. del stock["pen"] removes pen (KeyError: 'pen' if absent). stock["cap"] raises KeyError: 'cap'. stock.get("cap") returns None and stock.get("cap", 0) returns 0, with no error. for item, qty in stock.items(): print(item, qty) prints each key and its value on one line, for example pen 5 then ink 2.

### mcq

Apply question: prices = {"pen": 2, "ink": 5}. Which loop prints pen 2 then ink 5? Options: for k, v in prices: (looping a dict gives keys; unpacking the string "pen" into two names raises ValueError: too many values to unpack); for k, v in prices.items(): print(k, v) (correct: items() yields (key, value) pairs that unpack into k and v); for v in prices.values(): print(v, prices[v]) (values are 2 and 5, which are not keys, so prices[2] raises KeyError); for k, v in prices.keys(): (keys are strings, the same unpacking error). Retry: for name, qty in stock.items(): is the method that yields pairs; keys and values give single items and get needs a key argument.
