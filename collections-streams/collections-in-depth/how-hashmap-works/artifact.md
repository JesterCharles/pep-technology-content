# How HashMap works

## Objectives

- Trace how a HashMap uses a key's hashCode to choose a bucket and equals to find the matching entry in that bucket
- Explain how capacity, load factor and resizing keep get and put close to constant time, and why HashMap gives no iteration-order guarantee
- Use getOrDefault, merge and computeIfAbsent to count and group values in a map

## Teaching

### Start with a guess

The strings `"Aa"` and `"BB"` are different, yet both have the hash code 2112. Read this code before any explanation.

```
Map<String, Integer> m = new HashMap<>();
m.put("Aa", 1);
m.put("BB", 2);
System.out.println(m.size() + " " + m.get("Aa"));
```

### Buckets: hashCode picks, equals confirms

A `HashMap` keeps an array of buckets. For `put(key, value)`:

1. The key's `hashCode()` chooses a bucket.
2. Inside that bucket, `equals` compares the key with each stored key.
3. A match replaces that entry's value; no match adds a new entry to the bucket.

`get(key)` follows the same path and returns `null` if no key in the bucket is equal. Two different keys may share a bucket, a collision; `equals` keeps them apart.

The exact bucket formula is an OpenJDK implementation detail: it mixes the hash code's high bits into its low bits, then keeps the low bits.

### Load factor and resizing keep buckets short

A new `HashMap()` starts with capacity 16 (buckets) and load factor 0.75. When the number of entries exceeds capacity × load factor, here 16 × 0.75 = 12, the map rehashes into about twice as many buckets.

Two OpenJDK 25 details refine that rule. The bucket table is created on the first `put`, not by the constructor. And when many keys collide in one bucket while the table has fewer than 64 buckets, OpenJDK resizes early instead of building a tree, so "rehash at the 13th entry" holds for well-spread keys like the ones below, not for every key.

Short buckets mean `get` and `put` check only a few keys, so they stay close to constant time, provided the hash codes spread well.

Rehashing moves entries to new buckets, so iteration order can change. That is why `HashMap` "makes no guarantees as to the order of the map".

### Count and group in one line

```
Map<String, Integer> counts = new HashMap<>();
for (String w : words) {
    counts.merge(w, 1, (a, b) -> a + b);          // absent: put 1; present: add 1
}
// same count: counts.put(w, counts.getOrDefault(w, 0) + 1);

Map<Integer, List<String>> byLength = new HashMap<>();
for (String w : words) {
    byLength.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
}
```

`merge` stores the given value for a new key, or combines it with the old one. `computeIfAbsent` creates the list only the first time a key appears, then returns the stored list.

## Model

The model: a row of numbered buckets. A key's hash code chooses one bucket; inside it, `equals` picks out the matching key among any that collided there. When the entries exceed capacity times load factor, the row is rebuilt about twice as long and every entry is placed again, which keeps buckets short and can change the iteration order.

## Recap

- `hashCode` picks the bucket; `equals` finds the matching key inside it. Colliding keys share a bucket and stay separate.
- Default capacity 16 and load factor 0.75: past 12 well-spread entries the map rehashes into about twice the buckets (heavy collisions can make OpenJDK resize earlier), keeping buckets short and `get` and `put` near constant time.
- Rehashing can reorder entries, so `HashMap` gives no iteration-order guarantee.
- Count with `merge(k, 1, (a, b) -> a + b)` or `getOrDefault`; group with `computeIfAbsent(k, x -> new ArrayList<>()).add(v)`.

Next topic: Choosing the right collection

## Cheat sheet

|  |  |
| --- | --- |
| Count | `m.merge(k, 1, (a, b) -> a + b);` |
| Count, longhand | `m.put(k, m.getOrDefault(k, 0) + 1);` |
| Group | `g.computeIfAbsent(key, x -> new ArrayList<>()).add(item);` |
| Defaults | capacity 16 (table created on first put in OpenJDK), load factor 0.75, rehash past 12 well-spread entries |
| Order | none promised; use `LinkedHashMap` or `TreeMap` when order matters |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture the sorting wall in a mail room: a row of numbered pigeonholes. The clerk works out a pigeonhole from each letter's number (the key's hash code), and to hand a letter over checks the full name (`equals`) only on the letters in that one pigeonhole. Two different people can land in the same pigeonhole, a collision, and still get their own letters, because the name check keeps them apart.

When the wall gets crowded, the clerk builds one about twice as wide and sorts every letter again. Pigeonholes stay short, and the letters may now sit in a different left-to-right order, which is why a `HashMap` promises no iteration order.

## Sources

Claims on this page were checked against the live official pages below on 14 October 2026 (UTC), for Java SE 25. Program output was confirmed on OpenJDK 25.0.4. Links open outside this lesson.

- HashMap (Java SE 25 API): buckets, constant-time get and put, capacity, load factor and rehashing, default capacity 16 and load factor 0.75, no order guarantee.
- Map (Java SE 25 API): getOrDefault, merge, computeIfAbsent.
- Dev.java: Choosing Immutable Types for Your Key: buckets and hash codes.
- Dev.java: Working with Keys and Values; Dev.java: Using Lambda Expressions to Process the Values of a Map.

Implementation details, not Java SE specification: the bucket numbers in the practice model use OpenJDK 25's formula (hash code XOR its upper 16 bits, then the low bits), and printed orders are what OpenJDK 25 produced. OpenJDK 25 also creates the bucket table on the first put, turns a bucket holding more than 8 colliding keys into a tree once the table has at least 64 buckets, and resizes instead while it is smaller; the practice model omits tree bins. Source: OpenJDK 25u HashMap.java.

## Static interaction alternatives

### predict

Prediction (practice, not scored): "Aa" and "BB" have the same hash code 2112; a HashMap gets put("Aa", 1) and put("BB", 2); what does size() and get("Aa") print? Options: 1 2 (wrong: equal hash codes do not make keys equal, so BB does not replace Aa); 2 1 (correct: both keys share a bucket and equals keeps them apart); 2 2 (wrong: get finds the key equal to Aa, whose value is 1); an exception (wrong: collisions are normal).

### explore

Bucket trace on a HashMap with 16 buckets (OpenJDK 25 bucket formula): "ana" has hash code 96724 and goes to bucket 5. "Aa" and "BB" both have hash code 2112 and go to bucket 0; equals finds Aa not equal to BB, so BB is added to the same bucket. A second put("Aa", 9) reaches bucket 0, equals matches Aa, and its value is replaced with 9. get("BB") goes to bucket 0, skips Aa because equals is false, matches BB and returns 3. get("zed") goes to bucket 8, finds no equal key and returns null.

### explore

Resize run on OpenJDK 25 with well-spread keys: the empty map has no bucket table yet, and the first put creates 16 buckets. Putting oak, elm, ash, fir, yew, bay, box, fig, gum, ivy, lime and pine (values 1 to 12) keeps 16 buckets; the map prints {pine=12, fig=8, elm=2, ash=3, lime=11, oak=1, yew=5, box=7, bay=6, ivy=10, fir=4, gum=9}. The 13th put, teak, exceeds 12 = 16 × 0.75, so the map rehashes to 32 buckets and prints {pine=12, fig=8, elm=2, lime=11, yew=5, box=7, ivy=10, teak=13, fir=4, ash=3, oak=1, bay=6, gum=9}: ash, oak and bay moved to new buckets and now print later.

### mcq

Apply question: a TreeMap counts red blue red green red with merge(w, 1, (a, b) -> a + b); it prints {blue=1, green=1, red=3}, keys sorted. Wrong: {red=3, blue=1, green=1} (insertion order, but TreeMap sorts); {blue=1, green=1, red=1} (merge adds to the old value); {red=1, blue=1, red=1, green=1, red=1} (a map keeps one entry per key). Retry form: computeIfAbsent groups ox, cat, dog, be by length into a TreeMap; it prints {2=[ox, be], 3=[cat, dog]}.
