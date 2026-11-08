# Reading CSV and JSON files with generators

## Objectives

- Read rows from a CSV file with csv.DictReader and records from a JSON Lines file (json.loads on each line) or a small JSON document (json.load), opening each file in a with statement with an explicit encoding
- Write a generator function with yield that streams parsed records one at a time, and explain that memory stays bounded only when the source is also read record by record (csv rows or JSON Lines), not when json.load has already read the whole document
- Chain generators into an extract step (read, parse, filter) and predict what happens when a generator is iterated a second time

## Teaching

### A generator pauses between records

Calling a generator function returns a generator and runs none of its body. Each `next()`, or each pass of a `for` loop, resumes the body until the next `yield`, then pauses with the file still open.

`csv.DictReader` over an open file parses one row per pass; each row is a dict of strings keyed by the header. For JSON Lines, iterate over the file and call `json.loads` on each line.

`json.load` is different. It reads and parses the whole document before your first `yield`, so wrapping it in a generator does not bound memory.

### The streaming reader shape

This JSON Lines reader shows the pattern. The `with` block keeps the file open while the generator is paused and closes it when the generator finishes.

```
import json

def read_events(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield json.loads(line)
```

For CSV, open the file with `newline=""` as the csv docs recommend, wrap the file in `csv.DictReader`, and yield each row. Always name the encoding; the default depends on the machine.

### Pipelines, and the one-shot rule

Generators chain: a read step feeds a parse step, which feeds a filter. Nothing runs until the last step is iterated, and one record moves through at a time.

A generator is single-use. Once exhausted, iterating it again yields nothing and raises no error, so a second loop silently sees zero records. For another pass, call the generator function again to get a fresh generator.

```
lines = read_events("a.jsonl")
paid = (e for e in lines if e["paid"])
total = sum(e["amount"] for e in paid)  # pulls here
```

## Recap

- Calling a generator function runs nothing; each `next()` or `for` pass resumes to the next `yield`.
- Open files in a `with` block and name the encoding. `csv.DictReader` gives one dict of strings per row; JSON Lines needs `json.loads` per line.
- Memory stays bounded only when the source is also read record by record. `json.load` has already read the whole document.
- Chain generators into read, parse and filter steps. A generator is one-shot: a second pass silently sees nothing.

## Cheat sheet

A sushi counter makes one plate when a diner reaches for it, while a banquet caterer cooks the whole order before the first guest eats. Both feed everyone, but only the counter keeps a small amount of food out at any moment.

Streaming reads a little at a time; loading everything first holds it all at once.

Where to act: Watch the Records held in memory number in the model.

Next step: Compare that number after the first press for each of the three sources.

Where to act: The line with the ___ placeholder, indented inside read_orders.

Next step: Start from the read_events pattern; only the reader in the middle changes.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The loop inside your with block.

Next step: Decide which object the for loop iterates over, and what each pass hands back with yield.

Optional time: about 3 minutes

Success criteria: On paper, extend your reader so it skips rows whose `qty` field is empty, still yielding one row at a time and still using only what this page taught.

```
with open(path, encoding="utf-8") as f:
    for line in f:
        yield json.loads(line)   # JSON Lines

open(path, newline="")           # recommended for csv
next(gen)                        # StopIteration when exhausted
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- Python docs: csv (DictReader, newline)
- Python docs: json (load, loads)
- Python docs: Functional programming HOWTO (generators)
- Python tutorial: Generators and generator expressions

## Static interaction alternatives

### predict

Prediction: a function containing yield is called once and a message is printed afterwards. Decide which prints happen before anything asks the generator for a value.

### explore

Model with three sources over a six-record file. CSV rows and JSON Lines hold one record at a time: each next reads one record and yields it. json.load reads all six records on the first next, then yields them one by one while still holding all six. After the last record, next raises StopIteration.

### mcq

Question: for a very large export, decide which source shape keeps the records in memory bounded.

### terminal

Coding task: finish a generator function that opens a CSV with an explicit encoding and streams rows. Compare against the read_events pattern above.

### mcq

Question: a filtering generator expression over a three-row reader is counted twice. Decide what the second count prints.
