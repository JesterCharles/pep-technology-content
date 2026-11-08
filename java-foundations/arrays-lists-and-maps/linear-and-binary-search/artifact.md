# Linear and binary search

## Objectives

- Write a linear search that returns the index of a target or -1
- Trace binary search on a sorted array, narrowing the low and high bounds each step
- Explain why binary search requires sorted input and how its step count grows with input size

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. Guess before any rules are shown.

### Your task

An app keeps 1,000 customer names in alphabetical order. To find one name, it looks at the middle name of the part that could still hold it, then throws away the half that cannot. At most, how many names does it look at before it finds the name or knows it is missing?

1. What to do: Under Prediction, pick the number you expect.
2. Then: Pick Low, Medium or High confidence and press Check my prediction.
3. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: Linear search

A linear search checks the elements one at a time, starting at index 0. As soon as an element equals the target, it returns that index, so a repeated value is reported at its first position.

If the loop finishes without a match, it returns `-1`. No array has an index of -1, so the caller can test the result for it. Linear search works on any array, sorted or not; in the worst case it checks every element.

### Your task

Finish `indexOf` so it returns the first index where `a` holds `target`, or `-1` when no element does. Run checks it on the examples below, which are the only inputs it uses.

1. Where to look: The Search.java editor below. It holds only the method; the page supplies the class and calls it.
2. What to type: above `return -1;`, add a loop that checks each element in index order and returns the index of the first match.
3. Then: keep `return -1;` as the last line, and press Run.
4. What to expect: Problems points to any line to fix; Output shows each call and its result.
5. How to know it's done: All three checks below read done. After two runs of edited code—even the same edit twice—you may move on and return as often as needed; it is done and earns credit only when one run passes every check.

### What success looks like

- In `{4, 8, 15, 16, 23, 42}`, targets 15, 4 and 42 give 2, 0 and 5
- Target 7, and any target in the empty array `{}`, give -1
- In `{5, 3, 5}`, target 5 gives 0, the first match

### Activity 3 of 4: Binary search, one step at a time

Binary search needs an array sorted in ascending order. Keep two bounds: `low = 0` and `high = a.length - 1`. Check the middle index, `mid = (low + high) / 2`, where integer division drops any remainder.

If `a[mid]` is the target, stop. If the target is larger, it can only be to the right, so `low = mid + 1`. If it is smaller, `high = mid - 1`. When `low` passes `high`, nothing is left to check: the target is missing.

### Where this fits

Decision: You must find values in an array. Scan it with linear search, or use binary search?

Good fit: Binary search, when a large array is already sorted and searched many times, such as a sorted list of order numbers checked on every request.

Choose something else when: the data is unsorted and you search it only once or twice, because sorting costs more than a scan; when the array is tiny; or when you look values up by key all the time, where a `HashMap` uses hash buckets for usually constant-time key lookup when keys are well dispersed.

### Your task

1. Where to look: Binary search tracer, under the sorted array.
2. What to do: Choose a target, read `a[mid]`, then press the button for the right next step: move `low`, move `high`, report found, or report missing.
3. What to expect: The boxes outside `low` to `high` are crossed out, and the trace lists every step and the number of checks.
4. How to know it's done: Both checks below read done. A wrong step is explained and changes nothing.

### What success looks like

- Trace a target that is in the array until you report it found
- Trace target 40, which is not in the array, until you report it missing

### Activity 4 of 4: Why sorted, and how fast

Discarding half is safe only in ascending sorted order: values left of `mid` are no greater than `a[mid]`, and values right of it are no smaller. Duplicates are fine; any matching copy may be found. On unsorted input binary search can report a present value as missing.

Each check halves the range, so the worst case is about log₂ n checks: about 10 for 1,000 elements and about 20 for 1,000,000. Doubling the array adds only one check. Linear search's worst case grows with n itself.

### Your task

Which statement about binary search is true?

Same idea, new form: a sorted array grows from 1,000 elements to about 1,000,000, a thousand times bigger. Binary search's worst case goes from about 10 checks to about how many?

1. Where to look: The four statements in the options below.
2. What to do: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback explains the result. If another required activity is still open, it is named with a return link; the recap opens only after every required activity is complete.

### What success looks like

You chose the true statement and can say why sorted input matters and how the number of checks grows.

## Model

`int[] a`, sorted, with each index; low, mid and high are labelled

1. 3 [0]
2. 7 [1]
3. 11 [2]
4. 15 [3]
5. 19 [4]
6. 23 [5]
7. 27 [6]
8. 31 [7]
9. 36 [8]
10. 41 [9]
11. 45 [10]
12. 52 [11]
13. 58 [12]
14. 63 [13]
15. 70 [14]
16. 77 [15]

Choose a target to start.

## Recap

- Linear search checks each index in order, returns the first match's index, and returns -1 only after the loop finds nothing.
- Binary search keeps `low` and `high`, checks `mid`, and moves one bound past `mid` each step until it finds the target or `low` passes `high`.
- It needs sorted input; its worst case is about log₂ n checks, so doubling the array adds one check.

Next topic: ArrayList basics

## Cheat sheet

You lost your blue mug somewhere along a shelf of mixed mugs. You start at the left end and pick each mug up in turn. The moment you hold the blue one, you stop and remember which spot it was in. If you reach the right end empty-handed, you can say for certain the mug is not on that shelf.

Linear search is that walk: first match wins, and reaching the end means a clear “not here” answer.

Where to act: The blank line above `return -1;`.

Next step: The answer is a position, not a value, so the loop needs the index. Choose the kind of loop that gives you each index from 0 up to the last one.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside that loop's body.

Next step: Compare the element at the current index with the target. Only when they are equal, leave the method at once with that index; otherwise let the loop carry on, so `return -1;` runs only after every index failed.

- Reads static methods with `int`, `boolean`, `String` and arrays of them; `if`/`else`, `while`, `for` and the enhanced for loop; `+ - * / %`, comparisons, `&&`, `||` and `!`.
- Anything else is a Lesson check, not a claim that other Java is invalid; Error is used only where javac certainly rejects the code.
- Exceptions use real JDK exception names; simulator detail messages are explanatory and may differ. This simulator stops after 20000 steps; a real JDK may continue, terminate later or fail for another reason.
- Run is deterministic and bounded: no network, files or arbitrary-code execution.

Where to act: The four step buttons, after reading the value under mid.

Next step: Compare the target with `a[mid]` only. A larger target means every box up to and including mid is too small; a smaller target means every box from mid on is too big. Report missing only once `low` is greater than `high`.

|  |  |
| --- | --- |
| first match: its index; no match: `-1` | linear search result |
| `mid = (low + high) / 2` | middle index |
| target larger: `low = mid + 1` | keep the right half |
| target smaller: `high = mid - 1` | keep the left half |
| `low > high` | target missing |
| `Arrays.binarySearch(a, key)` | the JDK's version, for a sorted array |

## Sources

Checked against these current official Java SE 25 pages on 2026-11-07. The traces and linear-search examples were rechecked by compiling and running them with OpenJDK 25.

- Java SE 25 API: Arrays.binarySearch (requires a sorted array; results are undefined otherwise)
- Java Language Specification SE 25, chapter 10: Arrays (indexes 0 to length - 1)
- Java Language Specification SE 25, 15.17.2: integer division rounds toward zero
- Dev.java: Arrays
- Java SE 25 API: HashMap (hash-table lookup and constant-time performance assumptions)

## Static interaction alternatives

### predict

Prediction (practice, not scored): 1,000 sorted names; each look checks the middle of the remaining part and discards the half that cannot hold the name. At most how many looks? Options: about 10; about 100; about 500; 1,000. Answer: about 10, because 1,000 halves to 1 in about ten steps (1,000, 500, 250, 125, 63, 32, 16, 8, 4, 2, 1). 1,000 is the worst case for checking names one by one.

### explore

Typed linear-search activity. Search.java holds static int indexOf(int[] a, int target) whose body is only return -1;. Finish it so it returns the first index holding target, or -1. Examples: in {4, 8, 15, 16, 23, 42}, 15 gives 2, 4 gives 0, 42 gives 5 and 7 gives -1; in {} any target gives -1; in {5, 3, 5}, 5 gives 0. A loop that returns -1 inside its first pass reports missing too early. Run evaluates only a bounded Java subset on these examples.

### explore

Binary search trace on the sorted array {3, 7, 11, 15, 19, 23, 27, 31, 36, 41, 45, 52, 58, 63, 70, 77} (indexes 0 to 15). Target 58: low 0, high 15, mid 7 holds 31, 58 is larger so low = 8; mid 11 holds 52, larger so low = 12; mid 13 holds 63, smaller so high = 12; mid 12 holds 58: found at index 12 after 4 checks. Target 40: mid 7 (31) larger, low = 8; mid 11 (52) smaller, high = 10; mid 9 (41) smaller, high = 8; mid 8 (36) larger, low = 9; now low 9 is greater than high 8, so 40 is missing after 4 checks. Linear search would need 13 checks to find 58 and 16 to rule out 40.

### mcq

Apply question: which statement about binary search is true? Options: it needs sorted input because it discards a half by comparing the target with the middle value (true); it works on any array and is only faster on sorted ones (false: on unsorted input it can report a present value as missing); doubling the array roughly doubles its worst-case checks (false: doubling adds about one check); it always checks fewer elements than linear search (false: a target at index 0 takes linear search one check). Retry: growing from 1,000 to about 1,000,000 sorted elements raises the worst case from about 10 to about 20 checks, because 2 to the 20th is about a million.
