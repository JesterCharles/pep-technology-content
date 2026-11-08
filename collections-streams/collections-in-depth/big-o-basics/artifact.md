# Big-O basics

## Objectives

- Classify common collection operations (ArrayList get by index, contains on a list, HashMap get, TreeMap get) as constant, logarithmic or linear time using the costs the Java API documentation states
- Predict how the running time of a constant, linear, n log n or quadratic piece of code grows when the input size doubles
- Rewrite a nested-loop lookup as a HashSet or HashMap lookup and state its time complexity before and after

## Teaching

A method checks a list of IDs for duplicates by comparing every ID with every other ID, using two nested loops. On 10,000 IDs it takes about 1 second.

Big-O ignores constant factors and asks: as the number of elements n grows, how does the work grow? The Java API documentation states these costs:

| Operation | Stated cost |
| --- | --- |
| `ArrayList.get(i)` | constant, O(1) |
| `ArrayList.contains(x)` | linear, O(n): "all of the other operations" |
| `HashMap.get`, `HashSet.contains` | constant, O(1), if the hash codes spread well |
| `TreeMap.get` | logarithmic, O(log n), guaranteed |

`LinkedList.get(i)` walks from the nearer end: the documentation describes the walk, and O(n) is derived from it.

| Class | Typical code | n doubles, time |
| --- | --- | --- |
| O(1) | one `get` by index | stays the same |
| O(log n) | one `TreeMap.get` | grows by one step |
| O(n) | one loop over the list | doubles |
| O(n log n) | sorting the list | a little more than doubles |
| O(n²) | a loop inside a loop over the list | quadruples |

Measured times are only a hint: small inputs, warm-up and the machine all add noise. The growth pattern across sizes is what Big-O predicts.

```
// Before: for each of n orders, contains scans m blocked IDs: O(n * m)
for (String id : orders) {
    if (blocked.contains(id)) { reject(id); }   // blocked is an ArrayList
}
// After: build the set once, O(m); then each lookup is O(1): O(n + m)
Set<String> blockedSet = new HashSet<>(blocked);
for (String id : orders) {
    if (blockedSet.contains(id)) { reject(id); }
}
```

A hidden loop counts too: `contains` on a list is a loop. The hash version is expected O(1) per lookup, assuming hash codes spread well.

## Recap

- Stated costs: `ArrayList.get` O(1), `ArrayList.contains` O(n), `HashMap.get` O(1) with well-spread hash codes, `TreeMap.get` O(log n).
- When n doubles: O(1) stays, O(log n) adds a step, O(n) doubles, O(n log n) slightly more than doubles, O(n²) quadruples.
- A nested scan, including `list.contains` inside a loop, is O(n × m); building a `HashSet` once makes it O(n + m).

Next topic: The equals and hashCode contract

## Cheat sheet

Picture a corridor of numbered lockers. If you know the number of the locker you want, you walk straight to it, and a longer corridor changes nothing. If you are looking for the one locker that holds a red scarf, you open them one by one, so a corridor twice as long means about twice the walk.

Big-O describes how the work grows as the input grows, not how many seconds one run takes.

Hint 1 (Activity 4)

Where to act: Inside `hasRepeat`, where the starter currently returns immediately.

Next step: Keep a collection of values already visited, then make one decision for each value in `nums`.

Another hint Another hint, 2 of 2 for Activity 4

Hint 2 (Activity 4)

Where to act: The operation that both tests and records the current value.

Next step: Choose the collection whose lookup stays expected constant time when hash codes spread well; stop when recording says the value was already present.

Optional challenge time: about 4 minutes, in addition to this topic's time.

A method receives a `List<String>` of n names and must report whether any name appears twice. Version A sorts a copy of the list with `copy.sort(null)`, then compares each name with the next one. Version B walks the list once and, for each name, calls `containsKey` on a `TreeMap`, stops if it is true and otherwise calls `put`. For each version, state its time complexity and what happens to its running time when n doubles.

Success criteria: each version gets one growth class from this page, its doubling claim matches the step 3 table for that class, and you can say why neither version is O(n).

|  |  |
| --- | --- |
| O(1) | `arrayList.get(i)`, `map.get(k)`, `set.contains(x)` on hash classes |
| O(log n) | `treeMap.get(k)`, `treeMap.put(k, v)` |
| O(n) | one loop; `list.contains(x)`; `linkedList.get(i)` (derived) |
| O(n log n) | sorting |
| O(n²) | every pair: a loop inside a loop |

## Sources

Claims on this page were checked against the live official pages below on 13 October 2026 (UTC), for Java SE 25. Links open outside this lesson.

- ArrayList (Java SE 25 API): get in constant time; add amortized constant; other operations linear.
- LinkedList (Java SE 25 API): indexing traverses from the nearer end.
- HashMap (Java SE 25 API): constant-time get and put, assuming well-dispersed hashes.
- HashSet (Java SE 25 API): constant-time add, remove, contains under the same assumption.
- TreeMap (Java SE 25 API): guaranteed log(n) containsKey, get, put, remove.
- ArrayDeque (Java SE 25 API): most operations amortized constant; contains linear.
- Dev.java: Choosing Between ArrayList and LinkedList.

Derived, not stated: O(n) for `LinkedList.get(i)`, and the doubling behavior of each class, follow from the definitions. The timings in the practice model are illustrative numbers, not measurements.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a nested-loop duplicate check takes about 1 second on 10,000 IDs; about how long on 20,000? Options: about 1 second (wrong: the work depends on n); about 2 seconds (wrong: that is linear growth); about 4 seconds (correct: comparing every pair is quadratic, so doubling n multiplies the work by 4); about 20 seconds (wrong: doubling n multiplies quadratic work by 4, not 20).

### drag

Sorting activity, cost on n elements: ArrayList.get(i) is O(1); ArrayList.contains(x) is O(n); HashMap.get(key) is O(1) when hash codes spread well; TreeMap.get(key) is O(log n); LinkedList.get(i) is O(n), derived from its walk from the nearer end; ArrayDeque.push(e) is O(1) amortized; HashSet.contains(x) is O(1) when hash codes spread well.

### explore

Growth bench with illustrative times. Mystery A takes 5, 20 and 80 ms at n = 1,000, 2,000 and 4,000: each doubling multiplies the time by 4, which matches O(n²). Mystery B takes 3, 6 and 12 ms: each doubling doubles the time, which matches O(n). O(1) would stay flat, O(log n) would barely grow, and O(n log n) would grow a little more than 2 times per doubling.

### explore

Java editor for Repeats.java: the starter has hasRepeat(List<Integer> nums) return false. Rewrite it so it returns true exactly when a value appears twice, in one pass. Run checks [3, 1, 4, 1] (true), [2, 7, 1, 8] (false), [] (false), [5, 5] (true), [9] (false) and [6, 2, 9, 4, 2] (true), then measures work for 1,000 and 2,000 distinct values. Activity 3 records the nested version’s growth class; the one box here asks for the rewritten version’s growth class.
