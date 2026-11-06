# Slicing and comprehensions

## Objectives

- Predict the result of slices with start, stop, negative indices and a step on lists and strings
- Rewrite a for loop that filters and transforms a list as a list comprehension, and build a dict or set with a comprehension
- Decide between a comprehension and an explicit loop for a given task, rejecting a comprehension used only for its side effects

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. Java's `list.subList(1, 3)` takes positions 1 and 2. Guess what Python's slice gives before any rules are shown.

### Your task

1. Where to look: The two lines of code just below.
2. What to do or type: Under Prediction, pick the output you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: start:stop:step

`s[start:stop]` takes items from `start` up to, but not including, `stop`. Leave one out to go from the beginning or to the end: `s[:3]`, `s[2:]`.

Negative numbers count from the end: `-1` is the last item, so `s[-2:]` is the last two.

A third number is the step: `s[::2]` takes every second item, and a step of `-1` walks backwards, so `s[::-1]` is a reversed copy. Slicing works on strings and lists and returns a same-type sequence value. A list slice is a new list; for immutable sequences such as strings, do not rely on object identity either way. Ordinary out-of-range slice bounds do not raise `IndexError`.

### Your task

Build slices of `word = "python"` or `nums = [10, 20, 30, 40, 50]` until all three checks below are done. Examples use Python 3.10 or later.

1. Where to look: Build a slice, below the positions table.
2. What to do or type: Pick a sequence, a start, a stop and a step, then press Run slice. (none) leaves that part out.
3. What to expect: The slice and its real Python result print under the button; the table marks the items taken.
4. How to know it's done: All three checks below read done.

### What success looks like

- A negative start or stop that returns items
- A step of 2
- A full reversed copy

### Activity 3 of 4: Loops that build collections become comprehensions

A loop that only fills a new list can be one expression: `big = [n * 10 for n in counts if n < 5]`. Read it as: the value to keep, then the `for`, then an optional `if` filter.

Curly braces build a set, `rems = {n % 3 for n in counts}`, which drops duplicates. Curly braces with `key: value` build a dict: `squares = {n: n * n for n in counts}`. A `key: value` inside square brackets is a `SyntaxError`.

### Where this fits

Decision: You hold a small collection in memory, such as the prices in one shopping cart, and need a new list, set or dict from it. Comprehension or ordinary loop?

Good fit: A comprehension, when each kept item gets one clear change and you want the whole new collection: discounted prices for a receipt, or the distinct tags on a page of posts.

Choose something else when: each item triggers an action such as sending an email, needs several branches or its own error handling, or should stop early: write a `for` loop. For a huge or streaming source, consider a generator expression.

### Your task

This loop visits `prices`, keeps each price over 10, doubles it and appends it, building `[24, 24, 60]`. The repeated 24 stays because a list keeps duplicates.

```
prices = [4, 12, 12, 30]
result = []
for p in prices:
    if p > 10:
        result.append(p * 2)
```

1. Where to look: The comprehensions.py editor below. Each `___` is one whole comprehension, not one number or keyword.
2. What to do or type: First, replace the placeholder in `result = ___` with one list comprehension that builds the loop's list.
3. Second edit: replace the placeholder in `doubled = ___` with one set or dict comprehension of the doubled prices over 10, then press Run.
4. What to expect: Problems points to any line to fix; Output compares each value with the loop's result.
5. How to know it's done: Both checks below read done. Two runs that still differ settle the activity without penalty.

### What success looks like

- `result`: a list comprehension equal to the loop's `[24, 24, 60]`
- `doubled`: a set or dict comprehension giving `{24, 60}` or `{12: 24, 30: 60}`

### Activity 4 of 4: Comprehension or loop?

Use a comprehension when the point is the new collection it builds and it stays readable as one expression.

Use an ordinary `for` loop when the point is an action: printing, writing a file, sending a request, appending to some other list. `[print(n) for n in names]` works, but it builds a throw-away list of `None` values and hides the real intent. A loop also suits logic that needs several statements, `try`/`except` or `break`.

### Your task

Which line is a poor use of a comprehension?

Same idea, new form: you must send a reminder to every user and you do not need any results. Which code fits best?

1. Where to look: The four lines of code in the options below.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback appears and the recap opens below the activities.

### What success looks like

You chose the line that runs only for its side effect and can say why a loop states that intent better.

## Model

The code

```
nums = [10, 20, 30, 40, 50]
print(nums[1:3])
```

Positions of `word`, with the items your last slice took

| Index | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| From the end | -6 | -5 | -4 | -3 | -2 | -1 |
| Item | p | y | t | h | o | n |

Taken, in order: nothing yet

## Recap

- `s[start:stop:step]`: start included, stop excluded, negatives count from the end.
- `s[::-1]` reverses the sequence value; a list slice is a new list, while immutable-sequence identity is not guaranteed and must not be relied upon.
- A comprehension is the value to keep, then a `for` part, then an optional `if` filter: square brackets build a list; curly braces build a set, or a dict with `key: value`.
- Comprehensions build collections; loops do actions.

Next topic: Mutability and aliasing

## Cheat sheet

Where to act: The start, stop and step choices in Build a slice.

Next step: Change one part per run and leave the others as (none): two of the checks depend only on the step, and the third needs a negative start or stop.

A librarian walks once along a cart of returned books, picks out only the overdue ones, slips a reminder note into each, and lines them up on an empty shelf. The cart itself is left as it was; the new shelf is the result. If the shelf should hold each title only once, the librarian simply skips any title already on it.

A comprehension is that whole walk written as one sentence: what goes on the new shelf, which cart you walk, and which items you pick.

Where to act: The first placeholder, after `result =`.

Next step: Name the value the loop appends on each qualifying pass. That expression is the collected value, and it comes first, right after the opening square bracket.

Another hint Another hint, 2 of 4 for Activity 3

Where to act: The same placeholder, straight after the collected value.

Next step: Add the for part: it names the same loop variable and the same collection as the loop's own for line, without the colon.

Another hint Another hint, 3 of 4 for Activity 3

Where to act: The end of that placeholder, before the closing square bracket.

Next step: Decide whether every price is kept. The loop's if line keeps only some, so add that same condition after the for part, again without a colon.

Another hint Another hint, 4 of 4 for Activity 3

Where to act: The second placeholder, after `doubled =`.

Next step: Reuse the same three parts inside curly braces. A set keeps each doubled value once, so the repeated 24 appears once; a dict instead maps each kept price to its double, written as key, colon, value before the for part.

Optional time: about 4 minutes, in addition to the time above

Start from `names = ["ada", "bo", "cy", "dee", "eve"]`. Write one expression that builds a dict mapping every second name, starting with the first, to its length, keeping only names longer than two characters.

Try it in any Python 3.10 or later interpreter, or trace it on paper. No answer is shown here; the success criteria tell you when you are done.

Success criteria: your expression is a single dict comprehension whose `for` part loops over a slice with a step, and printing it shows `{'ada': 3, 'eve': 3}`.

|  |  |
| --- | --- |
| `s[1:3]` | positions 1 and 2 |
| `s[:3]` / `s[-3:]` | first three / last three |
| `s[::2]` | every second item |
| `s[::-1]` | reversed copy |
| `big = [n * 10 for n in counts if n < 5]` | list comprehension |
| `rems = {n % 3 for n in counts}` | set comprehension |
| `squares = {n: n * n for n in counts}` | dict comprehension |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-16. Every slice and comprehension result shown was produced by running the exact expression in CPython 3.14.

- Python tutorial: An informal introduction (indexing and slicing)
- Python tutorial: List comprehensions and dict and set comprehensions
- Language reference: Displays, comprehensions, generator expressions and slicings
- Built-in types: common sequence operations

## Static interaction alternatives

### predict

Prediction (practice, not scored): nums = [10, 20, 30, 40, 50]; print(nums[1:3]). Options: [20, 30]; [20, 30, 40]; [10, 20, 30]; [20]. Answer: [20, 30]. Indexes start at 0, the start (1, the value 20) is included and the stop (3, the value 40) is excluded, like Java's subList(1, 3).

### explore

Slice activity with real Python 3 results. word = "python" has positions 0 to 5 (p y t h o n) and -6 to -1 from the end. word[:3] is 'pyt'; word[-3:] is 'hon'; word[1:-1] is 'ytho'; word[::2] is 'pto'; word[1::2] is 'yhn'; word[::-1] is 'nohtyp'. nums = [10, 20, 30, 40, 50]: nums[1:3] is [20, 30]; nums[-2:] is [40, 50]; nums[::2] is [10, 30, 50]; nums[::-1] is [50, 40, 30, 20, 10]. With a negative step, start defaults to the end, so word[:3:-1] is 'no'. An empty result such as word[:-1:-1] is '' and raises no error.

### explore

Typed comprehension activity. comprehensions.py starts with prices = [4, 12, 12, 30] and two placeholders. The loop beside it keeps p * 2 for each price p greater than 10, which gives [24, 24, 60]. Replace the result placeholder with a list comprehension that has the same value, and the doubled placeholder with a set comprehension of the doubled prices over 10, giving {24, 60} because the duplicate 24 is dropped, or a dict comprehension mapping each price over 10 to its double, giving {12: 24, 30: 60}. Leaving out the filter gives [8, 24, 24, 60]. A key and value inside square brackets is a SyntaxError. Run evaluates only this bounded comprehension form.

### mcq

Apply question: which line is a poor use of a comprehension? Options: squares = [n * n for n in nums] (good: builds a new list); emails = {u.lower() for u in users} (good: builds a set of unique lowercase emails); [print(n) for n in names] (poor, the answer: it is used only for printing and builds a throw-away list of None values; write a for loop); lengths = {w: len(w) for w in words} (good: builds a dict). Retry: to send a reminder to every user with no results needed, use a for loop calling send_reminder(u). A list or set comprehension would build an unused collection; done = [u for u in users] copies the list and sends nothing.
