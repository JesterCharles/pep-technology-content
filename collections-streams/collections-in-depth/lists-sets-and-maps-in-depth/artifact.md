# Lists, sets and maps in depth

## Objectives

- Predict the contents and encounter order after given add and put calls on a named implementation (ArrayList, HashSet, LinkedHashSet, TreeSet, HashMap, LinkedHashMap or TreeMap), treating duplicate elements, a duplicate map key (which replaces the value) and duplicate map values (which are kept) separately
- Use List, Set and Map methods (add, remove, contains, get, put, getOrDefault, entrySet) on a small data set, and remove elements during iteration with Iterator.remove or removeIf instead of a for-each loop that can throw ConcurrentModificationException
- Explain why a collection made with List.of, Set.of or Map.of throws UnsupportedOperationException when modified and rejects null elements

## Teaching

### Start with a guess

A map stores each value under a key. Read this code before any explanation.

```
Map<String, Integer> scores = new HashMap<>();
scores.put("ana", 1);
scores.put("ben", 2);
scores.put("ana", 3);
System.out.println(scores.size() + " " + scores.get("ana"));
```

### One rule per interface, one order per implementation

- A List keeps every element by index, duplicates included.
- A Set holds each element once: adding a duplicate returns `false` and changes nothing.
- A Map holds one value per key. Putting an existing key replaces its value; different keys may hold equal values.

Encounter order, the order you see when you loop or print, comes from the implementation:

| Implementation | Encounter order |
| --- | --- |
| `ArrayList` | index order |
| `HashSet`, `HashMap` | no promised order |
| `LinkedHashSet`, `LinkedHashMap` | insertion order; re-adding keeps the old place |
| `TreeSet`, `TreeMap` | sorted (natural ordering) |

### Change a collection safely

Everyday methods: `add`, `remove` and `contains` on lists and sets; `put`, `get` and `getOrDefault` on maps; `entrySet()` to loop over key-value pairs.

```
for (Map.Entry<String, Integer> e : scores.entrySet()) {
    System.out.println(e.getKey() + "=" + e.getValue());
}
int cy = scores.getOrDefault("cy", 0); // 0: no key "cy"
```

Calling `list.remove` inside a for-each loop over that list can throw `ConcurrentModificationException`. Java detects this only on a best-effort basis, so never rely on it: remove with the iterator's own `remove()` or with `removeIf`.

`List.of`, `Set.of` and `Map.of` build unmodifiable collections: any change throws `UnsupportedOperationException`, and a `null` element throws `NullPointerException`. Copy one into `new ArrayList<>(...)` when you need to change it.

### Apply all three rules at once

A grade book uses a `LinkedHashMap` so names print in the order they were first added. One student is graded twice, and two students share a grade.

## Model

The model: a `List` keeps every element by index; a `Set` keeps one copy of each element; a `Map` keeps one value per key, so a repeated key overwrites. The implementation decides the encounter order: none promised for hash-based classes, insertion order for `LinkedHash` classes, sorted order for `Tree` classes.

## Recap

- List: every element, by index. Set: each element once. Map: one value per key; a repeated key replaces the value, repeated values stay.
- Encounter order belongs to the implementation: none promised for `HashSet` and `HashMap`, insertion order for the `Linked` versions, sorted for the `Tree` versions.
- Remove during a loop with `Iterator.remove()` or `removeIf`, never with the collection's own `remove` inside for-each.
- `List.of`, `Set.of` and `Map.of` are unmodifiable and reject `null`.

Next topic: Stacks and queues

## Cheat sheet

|  |  |
| --- | --- |
| `set.add(x)` | returns `false` if `x` is already there |
| `map.put(k, v)` | returns the old value for `k`, or `null` |
| `map.getOrDefault(k, d)` | `d` when there is no key `k` |
| `map.entrySet()` | loop over key-value pairs |
| `list.removeIf(s -> s.isEmpty())` | safe removal while scanning |
| `new ArrayList<>(List.of(...))` | a changeable copy of a fixed list |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture three things at a school event. A List is the sign-in sheet: every line stays, in the order it was written, so if Ana signs twice, both lines are kept. A Set is the guest list: Ana is either on it or not, so writing her name again changes nothing. A Map is a row of labelled coat hooks: each label (the key) has one hook, hanging a new coat on a label that is already used replaces the coat there, and two labels can still hold identical coats.

The picture stops at order: how the guest list or the hooks are read back depends on the implementation you chose, as the table shows.

## Sources

Claims on this page were checked against the live official pages below on 13 October 2026 (UTC), for Java SE 25. Program output was confirmed on OpenJDK 25.0.4. Links open outside this lesson.

- List (Java SE 25 API): positional access, duplicates; Unmodifiable Lists.
- Set (Java SE 25 API): no duplicate elements; Unmodifiable Sets.
- Map (Java SE 25 API): put replaces the old value; getOrDefault, entrySet; Unmodifiable Maps.
- ConcurrentModificationException (Java SE 25 API): fail-fast on a best-effort basis.
- Iterator (Java SE 25 API): remove().
- Collection (Java SE 25 API): add, remove, contains, removeIf.
- Dev.java: Getting to know the Collection hierarchy, with the Lists, Sets, Maps, Iterating and Factory methods pages of the same tutorial.

Not promised by Java: the `HashSet` order shown in the practice model is what OpenJDK 25 printed for those strings; the API gives no order guarantee.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a HashMap gets put("ana", 1), put("ben", 2), put("ana", 3); what does printing size() and get("ana") show? Options: 2 1 (wrong: put does not keep the first value); 2 3 (correct: the second put on key ana replaces its value, so there are 2 keys and ana maps to 3); 3 3 (wrong: a map holds one entry per key); an exception for the duplicate key (wrong: put on an existing key is allowed and returns the old value).

### explore

Exploration: the calls add("pear"), add("apple"), add("fig"), add("apple") run on four implementations. ArrayList prints [pear, apple, fig, apple] size=4 (keeps duplicates in index order). HashSet printed [apple, pear, fig] size=3 on OpenJDK 25 (each once, order from hash codes and not promised). LinkedHashSet prints [pear, apple, fig] size=3 (each once, first-added order: the answer for insertion order). TreeSet prints [apple, fig, pear] size=3 (each once, sorted: the answer for sorted order).

### drag

Sorting activity. Line of code and what happens: for (String s : names) if (s.isEmpty()) names.remove(s); can throw ConcurrentModificationException. names.removeIf(s -> s.isEmpty()); works. An Iterator loop that calls it.remove() works. List.of("ana", "ben").add("cy"); throws UnsupportedOperationException. Set.of("ana", null); throws NullPointerException. new ArrayList<>(List.of("ana")).add("cy"); works. Map.of("ana", 1).put("ana", 2); throws UnsupportedOperationException.

### mcq

Apply question: a LinkedHashMap gets put("ana", 90), put("ben", 75), put("ana", 80), put("cy", 75); what prints? Correct: {ana=80, ben=75, cy=75}. The repeated key ana keeps its first place but takes the new value 80; the equal values 75 under different keys are both kept. Retry form: a TreeMap gets put("pear", 4), put("fig", 4), put("pear", 1); it prints {fig=4, pear=1}, sorted by key, with pear's value replaced.
