# Big-O basics

## Objectives

- Classify common collection operations (ArrayList get by index, contains on a list, HashMap get, TreeMap get) as constant, logarithmic or linear time using the costs the Java API documentation states
- Predict how the running time of a constant, linear, n log n or quadratic piece of code grows when the input size doubles
- Rewrite a nested-loop lookup as a HashSet or HashMap lookup and state its time complexity before and after

## Teaching

### Start with a guess

A method checks a list of IDs for duplicates by comparing every ID with every other ID, using two nested loops. On 10,000 IDs it takes about 1 second.

### Big-O names how cost grows with n

Big-O ignores constant factors and asks: as the number of elements n grows, how does the work grow? The Java API documentation states these costs:

| Operation | Stated cost |
| --- | --- |
| `ArrayList.get(i)` | constant, O(1) |
| `ArrayList.contains(x)` | linear, O(n): "all of the other operations" |
| `HashMap.get`, `HashSet.contains` | constant, O(1), if the hash codes spread well |
| `TreeMap.get` | logarithmic, O(log n), guaranteed |

`LinkedList.get(i)` walks from the nearer end: the documentation describes the walk, and O(n) is derived from it.

### What happens when n doubles

| Class | Typical code | n doubles, time |
| --- | --- | --- |
| O(1) | one `get` by index | stays the same |
| O(log n) | one `TreeMap.get` | grows by one step |
| O(n) | one loop over the list | doubles |
| O(n log n) | sorting the list | a little more than doubles |
| O(n²) | a loop inside a loop over the list | quadruples |

Measured times are only a hint: small inputs, warm-up and the machine all add noise. The growth pattern across sizes is what Big-O predicts.

### Swap a nested scan for a hash lookup

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

## Model

The model: picture the work as a count of steps for n elements. One step whatever n is: O(1). Halving the problem each step: O(log n). One pass: O(n). Sorting: O(n log n). Every pair: O(n²). Doubling n leaves the first the same and quadruples the last. A loop that calls a linear method such as `list.contains` multiplies the costs.

## Recap

- Stated costs: `ArrayList.get` O(1), `ArrayList.contains` O(n), `HashMap.get` O(1) with well-spread hash codes, `TreeMap.get` O(log n).
- When n doubles: O(1) stays, O(log n) adds a step, O(n) doubles, O(n log n) slightly more than doubles, O(n²) quadruples.
- A nested scan, including `list.contains` inside a loop, is O(n × m); building a `HashSet` once makes it O(n + m).

Next topic: The equals and hashCode contract

## Cheat sheet

|  |  |
| --- | --- |
| O(1) | `list.get(i)`, `map.get(k)`, `set.contains(x)` on hash classes |
| O(log n) | `treeMap.get(k)`, `treeMap.put(k, v)` |
| O(n) | one loop; `list.contains(x)`; `linkedList.get(i)` (derived) |
| O(n log n) | sorting |
| O(n²) | every pair: a loop inside a loop |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture a corridor of n numbered lockers. Opening locker 37 when you know its number is one step, however long the corridor is: O(1), like `ArrayList.get(i)`. Finding the locker that holds a red scarf means opening them one by one, so twice the lockers is about twice the walk: O(n), like `contains` on a list.

Checking every locker against every other locker for matching scarves means counting pairs: twice the lockers gives about four times the pairs, O(n²). Big-O asks "if the corridor doubles, how much longer is the walk?", not "how many seconds does it take?".

Optional challenge time: about 4 minutes, in addition to this topic's time.

A method receives a `List<String>` of n names and must report whether any name appears twice. Version A sorts a copy of the list with `copy.sort(null)`, then compares each name with the next one. Version B walks the list once, calls `seen.contains(name)` on a `HashSet`, stops if it is true and otherwise calls `seen.add(name)`, which the `HashSet` documentation also states as constant time. For each version, state its time complexity and what happens to its running time when n doubles.

Success criteria: each version gets one growth class from this page, its doubling claim matches the step 3 table for that class, and the Version B answer names the assumption this page attaches to hash lookups.

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

### mcq

Apply question: names in both lists, found with a loop over a (n names) inside which a loop over b (m names). Correct rewrite: copy b into a HashSet once, then loop over a and call contains: O(n + m) expected, down from O(n * m). Wrong: replace the inner loop with b.contains(x), still O(n * m) because contains on a list is a loop; build a HashSet of b inside the outer loop, still O(n * m); sort both lists and keep the loops, still O(n * m) plus sorting. Retry form: to find a repeated value in a list of n numbers, add each number to a HashSet and stop when add returns false: O(n) expected, instead of comparing every pair, O(n²).
