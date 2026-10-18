# Choosing the right collection

## Objectives

- Choose a collection implementation from stated needs for duplicates, ordering, lookup by key and access pattern, and justify the choice
- Justify ArrayList over LinkedList for indexed access and iteration using the operation costs the Java API documentation states
- Pick LinkedHashMap, TreeMap or a sorted list when a result must keep insertion order or sorted order

## Teaching

### Start with a guess

A report reads elements by position, `list.get(i)`, a million times from a list of 100,000 names. It never inserts in the middle.

### Four questions pick the collection

1. Look up by key? Yes: a `Map`.
2. Duplicates allowed? No: a `Set`. Yes, with positions: a `List`.
3. Which order on output? None needed: `HashSet` or `HashMap`. Insertion order: `LinkedHashSet` or `LinkedHashMap`. Sorted: `TreeSet` or `TreeMap`.
4. Which access pattern? By index or full scans: `ArrayList`. Only at the ends, as a stack or queue: `ArrayDeque`. Always the smallest next: `PriorityQueue`.

State the need first, then name the class that meets it.

### ArrayList beats LinkedList for index and iteration

The ArrayList documentation states that `get` runs in constant time. A `LinkedList` reaches index i by walking node by node from the nearer end, so reading the middle is O(n).

Iterating is O(n) for both, but Dev.java's comparison finds `LinkedList` slower in practice: each step follows a reference to another place in memory ("pointer chasing"). Its conclusion: `ArrayList` outperforms `LinkedList` in almost all the classical list operations. `LinkedList` only wins at the ends, where an `ArrayDeque` usually serves better.

### When the output order is part of the requirement

If a result must keep insertion order, use `LinkedHashMap` or `LinkedHashSet`. If it must be sorted by key, use `TreeMap` or `TreeSet`. If the data is already a list, sort the list itself with `list.sort(...)`. A `HashMap` gives no order, and a `PriorityQueue`'s iterator visits elements in no particular order.

## Model

The model: a short decision path. Key lookup leads to a map; uniqueness to a set; positions and duplicates to a list. The required output order then picks the hash, linked-hash or tree version, and the access pattern picks between an array-backed list, a deque at the ends, or a priority queue for smallest-first.

## Recap

- Ask in order: lookup by key, duplicates, output order, access pattern; then pick the class.
- `ArrayList` over `LinkedList` for indexed access (stated constant-time `get` against a node-by-node walk) and for iteration (no pointer chasing).
- Insertion order: `LinkedHashMap`. Sorted by key: `TreeMap`. Already a list: sort it.

Next topic: Sorting with Comparator

## Cheat sheet

|  |  |
| --- | --- |
| List, by position, duplicates | `ArrayList` |
| Unique, fast `contains` | `HashSet` (no order), `LinkedHashSet` (insertion), `TreeSet` (sorted) |
| Key to value | `HashMap` (no order), `LinkedHashMap` (insertion), `TreeMap` (sorted) |
| Stack or queue | `ArrayDeque` |
| Smallest first | `PriorityQueue` (use `poll`, not iteration) |

Optional challenge time: about 4 minutes, in addition to this topic's time.

For each need, name the interface and the implementation you would choose, and the one fact that decided it: a duplicate rule, an output order or an operation cost.

1. A music app keeps recently played songs, adding at the front and dropping from the back; it never reads by position.
2. A help desk always serves the ticket with the smallest priority number next.
3. A spelling checker loads 50,000 words once, then answers "is this word known?" many times; output order never matters.

Success criteria: each answer names one interface and one implementation from this page and cites the stated need that decided it, and no choice relies on a cost or an order this page does not state.

## Sources

Claims on this page were checked against the live official pages below on 14 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- Collections Framework Overview (Java SE 25): the general-purpose implementations.
- ArrayList (Java SE 25 API): get in constant time.
- LinkedList (Java SE 25 API): indexing traverses from the nearer end.
- LinkedHashMap (Java SE 25 API): insertion order.
- TreeMap (Java SE 25 API): sorted by natural ordering or a comparator.
- PriorityQueue (Java SE 25 API): head is the least element; the iterator has no particular order.
- Dev.java: Choosing Between ArrayList and LinkedList: pointer chasing; which implementation to choose.
- Dev.java: Getting to Know the Collection Hierarchy; Dev.java: Sets; Dev.java: SortedMap and NavigableMap.

Derived, not stated: the step counts in the practice model follow from the documented access methods; they are not timings.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a report calls list.get(i) a million times on 100,000 names and never inserts in the middle. Options: ArrayList, because get by index runs in constant time (correct); LinkedList, because it is faster for big lists (wrong: LinkedList reaches an index by walking nodes); either, because both are lists (wrong: their get costs differ); a HashSet (wrong: a set has no positions).

### drag

Sorting activity, need and implementation: unique tags with fast contains and no order needed: HashSet. Look up a price by product code: HashMap. Cart items by position, duplicates allowed: ArrayList. Undo history, last action first: ArrayDeque. Word counts printed alphabetically: TreeMap. Settings printed in the order they were added: LinkedHashMap.

### explore

Step bench, n = 10,000, steps derived from each class's access method: get(5000) costs 1 array read on ArrayList and about 5,000 node hops on LinkedList (walk from the nearer end). get(0) costs 1 step on both. A full for-each loop visits 10,000 elements on both (the same O(n), though Dev.java finds LinkedList slower in practice because of pointer chasing). add at the end costs about 1 step on both (amortized constant for ArrayList).

### mcq

Apply question: word counts printed in the order words first appeared: a LinkedHashMap, which keeps insertion order (and a repeated put does not move a key). Wrong: HashMap (no order guarantee); TreeMap (sorted, not first-appearance order); ArrayList of words (loses the counts and keeps duplicates). Retry form: printed alphabetically: a TreeMap, which sorts keys by natural ordering. Wrong: LinkedHashMap (insertion order); HashMap (no order); PriorityQueue of words (its iterator and printing follow no particular order).
