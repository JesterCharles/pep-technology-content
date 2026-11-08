# HashMap basics: put, get, containsKey

## Objectives

- Store and look up values by key with put and get
- Use containsKey or getOrDefault to handle a missing key instead of an unexpected null
- Count occurrences of words or characters with a HashMap

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. This code stores two stock counts under the same key, then looks up that key and one that was never stored. Guess what prints before any rules are shown.

### Your task

1. Where to look: The code just below.
2. What to do: Under Prediction, pick the output you expect.
3. Then: Pick Low, Medium or High confidence and press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: Keys and values

A `HashMap` stores key-value pairs and uses hash buckets to find a key; basic `get` and `put` are usually constant time when keys are well dispersed. `Map<String, Integer> stock = new HashMap<>();` maps names to counts.

`put(key, value)` adds a pair; for a key that is already there, it replaces the value and returns the old one. Keys are unique. `get(key)` returns the value, or `null` when the key is absent.

`containsKey(key)` answers `true` or `false`, and `getOrDefault(key, fallback)` returns the fallback instead of `null`. A printed `HashMap` lists its pairs in no order you should rely on.

### Your task

1. Where to look: Map explorer, under the pairs stored in `stock`.
2. What to do: Pick a key and a value, then press a method button.
3. What to expect: Each call and its real result print under the buttons, and the stored pairs update.
4. How to know it's done: All four checks below read done.

### What success looks like

- Store a new key with `put`
- Replace the value of a key that is already stored
- See `get` return `null` for a missing key
- Check a missing key safely with `containsKey` or `getOrDefault`

### Activity 3 of 4: Counting with a map

To count occurrences, use each word as a key and its count so far as the value. For each word, find its current count, add one, and `put` the new count back under the same key.

The first time a word appears it has no entry, so `get` returns `null`. Adding 1 to that `null` makes Java unbox it, which throws `NullPointerException`. Handle the missing key: test it with `containsKey`, or read it with `getOrDefault` and a fallback of 0.

### Where this fits

Decision: You need to find a value from something you already know, such as a word, a product name or a user ID. Keep a `HashMap`, or keep a list and search it?

Good fit: A `HashMap`, when you look values up by key again and again: counting words in a document, stock levels by product name, or users by ID.

Choose something else when: you work by position or need items in order, such as a ranked list, which suits a `List`; or when keys must come back in insertion or sorted order, which needs a `LinkedHashMap` or a `TreeMap` instead.

### Your task

Finish `countWords` so the map it returns holds each word once, with the number of times it appears. Run checks it on the examples below, which are the only inputs it uses.

1. Where to look: The WordCount.java editor below. It holds only the method; the page supplies the class and calls it.
2. What to type: replace the comment inside the loop with code that adds one to the count stored for `w`, treating a word that is not stored yet as a count of 0.
3. Then: press Run.
4. What to expect: Output prints each returned map as Java would, or the exception and its line.
5. How to know it's done: All three checks below read done. After two runs of edited code—even the same edit twice—you may move on and return as often as needed; it is done and earns credit only when one run passes every check.

### What success looks like

- `{"red", "blue", "red"}` gives red 2 and blue 1
- `{"to", "be", "or", "not", "to", "be"}` gives to 2, be 2, or 1 and not 1
- The empty array `{}` gives an empty map, `{}`

### Activity 4 of 4: Missing keys without surprises

A missing key is not an error by itself: `get` just returns `null`. The surprise comes later, when that `null` lands in an `int` variable or in arithmetic and Java unboxes it. Decide what a missing key should mean before you read it: `getOrDefault` supplies a value, and `containsKey` lets you take a different branch.

### Your task

`Map<String, Integer> counts` has no key `"zebra"`. Which line sets `n` to 0 instead of throwing or leaving `null`?

Same idea, new form: `Map<String, Integer> stock` may not hold `"kiwi"`. Which code prints the kiwi count when it is stored, and the words `no kiwi` when it is not?

1. Where to look: The four lines in the options below.
2. What to do: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback explains the result. If another required activity is still open, it is named with a return link; the recap opens only after every required activity is complete.

### What success looks like

You chose the line that handles the missing key and can say what each other line does instead.

## Model

The code

```
Map<String, Integer> stock = new HashMap<>();
stock.put("apple", 3);
stock.put("apple", 5);
System.out.println(stock.get("apple") + " " + stock.get("pear"));
```

The pairs stored in `stock` now

- **"apple"**: 3

size() is 1. Printed: {apple=3}

## Recap

- `put(key, value)` stores a pair or replaces the value of an existing key; keys are unique.
- `get(key)` returns the value, or `null` for a missing key; unboxing that `null` into an `int` throws `NullPointerException`.
- Handle a missing key with `containsKey` or `getOrDefault(key, fallback)`.
- To count, use each item as a key and store its count plus one on every occurrence; a `HashMap` keeps no order you can rely on.

This is the last topic in Arrays, Lists and Maps.

## Cheat sheet

A hotel front desk has a wall of pigeonholes, one per room number. A note for room 12 goes straight into slot 12, and putting a new note there replaces the old one. When a guest asks about a room that has no slot at all, the clerk does not hand over an empty note; they simply say there is nothing for that room.

A map works like that wall: each key has one slot, and a missing key means “nothing here”, not zero.

Where to act: The Key choices, then the lookup buttons.

Next step: Two checks need a key that is not stored yet. Pick a key that does not appear among the stored pairs and try get first, then one of the two safer lookups.

Where to act: The comment inside the `for` loop.

Next step: Every pass ends with one `put` on `counts` with key `w`. Work out the value to store: the old count plus one.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The part of that line that reads the old count.

Next step: If a run throws `NullPointerException`, the old count was read with plain `get` for a word seen for the first time. Read it with the lookup from Activity 2 that takes a fallback, and make the fallback 0.

- Reads static methods with `int`, `boolean`, `String`, `Integer`, arrays and `Map`/`HashMap`; `if`/`else`, loops, and the map methods `put`, `get`, `getOrDefault`, `containsKey`, `size`, `isEmpty` and `keySet`.
- Anything else, such as `merge` or lambdas, is a Lesson check, not a claim that the Java is invalid; Error is used only where javac certainly rejects the code.
- A printed map uses the iteration order a real `HashMap` gives for these small examples. Exceptions use real JDK exception names; simulator detail messages are explanatory and may differ. This simulator stops after 20000 steps; a real JDK may continue, terminate later or fail for another reason.
- Run is deterministic and bounded: no network, files or arbitrary-code execution.

|  |  |
| --- | --- |
| `Map<String, Integer> m = new HashMap<>();` | empty map |
| `m.put("a", 1)` | store or replace |
| `m.get("a")` | value, or null if missing |
| `m.containsKey("a")` | true or false |
| `m.getOrDefault("a", 0)` | value, or the fallback |
| `m.size()` | number of pairs |

## Sources

Checked against these current official Java SE 25 pages on 2026-11-07. Each example's output, map order and exception name was rechecked with OpenJDK 25.

- Java SE 25 API: HashMap (hash table, constant-time performance assumptions and no guarantee of order)
- Java SE 25 API: Map (put, get, containsKey, getOrDefault)
- Java Language Specification SE 25, 5.1.8: unboxing null throws NullPointerException
- Dev.java: Storing key-value pairs with Map

## Static interaction alternatives

### predict

Prediction (practice, not scored): stock.put("apple", 3); stock.put("apple", 5); then print stock.get("apple") and stock.get("pear"). Options: 5 null; 3 null; 8 null; 5 0. Answer: 5 null. The second put replaces the value for the same key, and get returns null for a key that was never stored.

### explore

Map explorer for Map<String, Integer> stock holding apple=3, with real Java results. stock.put("pear", 2) stores a new pair and returns null. stock.put("apple", 5) replaces 3 and returns 3. stock.get("kiwi") returns null because kiwi is not a key. stock.containsKey("kiwi") is false, and stock.getOrDefault("kiwi", 0) is 0. Printing the map shows {apple=5, pear=2}.

### explore

Typed word-count activity. WordCount.java holds static Map<String, Integer> countWords(String[] words), which creates an empty HashMap named counts, loops over each word w with an empty body, and returns counts. Finish the loop body so each word's count goes up by one: {"red", "blue", "red"} gives {red=2, blue=1}; {"to", "be", "or", "not", "to", "be"} gives {not=1, be=2, or=1, to=2}; {} gives {}. Reading a missing word's count with plain get and adding 1 throws NullPointerException. Run evaluates only a bounded Java subset on these examples.

### mcq

Apply question: counts has no key zebra; which line sets n to 0? Options: int n = counts.get("zebra"); (throws NullPointerException when null is unboxed); int n = counts.getOrDefault("zebra", 0); (correct: the fallback 0 is used); int n = counts.get("zebra") + 0; (throws NullPointerException in the addition); Integer n = counts.get("zebra"); (no exception, but n is null, not 0). Retry: to print the kiwi count or the words no kiwi, test stock.containsKey("kiwi") and print one or the other; printing get alone shows null, comparing get with 0 unboxes null and throws, and getOrDefault with 0 prints 0 rather than no kiwi.
