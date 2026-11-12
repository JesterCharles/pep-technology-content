# Review scenarios: collections and streams

## Objectives

- Choose the stack, queue, set and map implementations whose ordering and cost guarantees fit a described feature
- Predict the grouped map and the Optional results of stream pipelines over rows already loaded from a database
- Diagnose a stream collection that fails on a repeated key, and choose the merge function that produces the intended per-key result

## Teaching

### Activity 1 of 3: Choose the structures for a help desk

This page wraps up the course with new scenarios that mix its topics. All three activities follow one small help-desk app. Answer from memory first; each option explains itself after you check.

The app needs three structures:

1. Undo: an agent can undo the most recent edit, then the one before it.
2. Waiting tickets: tickets are served in the order they arrived. Thousands can wait at once, and the screen asks many times a second whether a given ticket id is still waiting.
3. Customer report: each customer name with its ticket count, printed in alphabetical order.

### Activity 2 of 3: Predict the ticket report

The app loaded these rows from its `tickets` table with JDBC into a list of records. The report needs the rows for several summaries, so it processes the loaded list with streams.

One detail is new here. `groupingBy` also has a three-argument form: its middle argument is a map factory that chooses which kind of map holds the groups. It is usually written as a constructor reference, like `ArrayList::new` from method references.

```
record Ticket(String customer, String level, int minutes) {}

List<Ticket> rows = List.of(
    new Ticket("Ana", "low", 30),
    new Ticket("Ben", "high", 10),
    new Ticket("Ana", "high", 20),
    new Ticket("Cy", "low", 45));

Map<String, List<String>> byLevel = rows.stream()
    .collect(Collectors.groupingBy(Ticket::level, TreeMap::new,
        Collectors.mapping(Ticket::customer, Collectors.toList())));
System.out.println(byLevel);

Optional<Ticket> longestHigh = rows.stream()
    .filter(t -> t.level().equals("high"))
    .max(Comparator.comparingInt(Ticket::minutes));
System.out.println(longestHigh.map(Ticket::customer).orElse("none"));

System.out.println(rows.stream()
    .filter(t -> t.minutes() > 60)
    .findFirst()
    .map(Ticket::customer)
    .orElse("none"));
```

### Activity 3 of 3: Fix the longest-ticket collector

Using the same four rows, a teammate wants each customer's longest single ticket, in minutes. Their code compiles, but the run stops with an exception:

```
Map<String, Integer> minutesPerCustomer = rows.stream()
    .collect(Collectors.toMap(Ticket::customer, Ticket::minutes));
```

```
Exception in thread "main" java.lang.IllegalStateException: Duplicate key Ana (attempted merging values 30 and 20)
```

The intended result holds Ana 30, Ben 10 and Cy 45, in any order.

## Recap

- Start from the rule a feature must keep, such as which item leaves next, which order prints or which check runs most often, then pick structures whose documented operations keep that rule cheap.
- In `groupingBy`, a map-factory argument decides the kind of map, and with it the key order; the downstream collector decides what each group holds.
- `max` and `findFirst` return an `Optional` that can be empty; `map` and `orElse` handle the empty case without an exception.
- `toMap` fails on a repeated key unless it gets a merge function, and that function decides the one value each key keeps.

## Cheat sheet

Where to act: The three needs in the list.

Next step: For each need, say what must come out or print first: the newest item, the oldest item, or the first name in order. For need 2, also note how often the app asks about one id.

Another hint Another hint, 2 of 2 for Activity 1

Where to act: The structures each option uses, need by need.

Next step: Check which end each pair of methods adds to and removes from. Then recall the documented cost of `contains` on every structure an option uses for need 2, and the iteration order of each option's map.

Where to act: The first `println` and the `groupingBy` call that builds `byLevel`.

Next step: Decide which argument sets the order of the keys and which one sets the order of the names inside each list.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: `TreeMap::new`, the `toList` collector and the last two pipelines.

Next step: Recall the key order a `TreeMap` keeps and whether a list collector reorders what it receives. Then, for the last two lines, decide whether each stream reaches `orElse` holding a value or empty.

Where to act: The exception message and the intended result on this page.

Next step: Name the key that repeats and its two values, then say which one value the intended result keeps for that key.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The third argument of each option that has one.

Next step: A merge function receives the value already stored and the new value for the same key, and returns the one value to keep. Work out what each merge function returns for 30 and 20, and whether the option without one still meets a repeated key.

```
// one class, two disciplines
Deque<String> history = new ArrayDeque<>();  // push / pop: last in, first out
Queue<String> line = new ArrayDeque<>();     // offer / poll: first in, first out
Set<String> seen = new HashSet<>();          // contains: constant expected time

// collector shapes
groupingBy(keyFunction, mapFactory, downstreamCollector)
toMap(keyMapper, valueMapper, mergeFunction)  // merge(stored, incoming) returns the kept value

// Optional without get
result.map(function).orElse(fallback)
```

Claims on this page were checked against these official Java SE 25 sources, retrieved 2026-11-09.

- Java SE 25 API: ArrayDeque — use as a stack or a queue; most operations run in amortized constant time, while contains runs in linear time
- Java SE 25 API: Deque — push and pop at the head; offer adds at the tail and poll removes from the head
- Java SE 25 API: Stack — prefer a Deque implementation
- Java SE 25 API: HashSet — constant-time add, remove and contains, assuming the hash function disperses elements properly
- Java SE 25 API: HashMap — no guarantee about iteration order
- Java SE 25 API: TreeMap — keys sorted by their natural ordering
- Java SE 25 API: Collectors — groupingBy with a map factory, mapping, toList, and toMap with and without a merge function
- Java SE 25 API: Stream — filter, max, findFirst and distinct
- Java SE 25 API: Optional — map and orElse on an empty Optional
- Java SE 25 API: Integer — the static sum and max methods used as merge functions
- Java SE 25 API: Record — records are equal when all components are equal

## Static interaction alternatives

### mcq

Question: Which choices fit all three needs?. Option A: Undo: a Stack with push and pop. Waiting: an ArrayDeque with offer and poll, plus a HashSet of waiting ids updated with it. Report: a HashMap<String, Integer>. - Not quite. Need 2 is handled well, but the API documentation recommends a Deque over the legacy Stack class, and a HashMap promises no iteration order, so the report would not be alphabetical. Option B: Undo: an ArrayDeque with push and pop. Waiting: an ArrayDeque with offer and poll, answering the id check with the deque's own contains. Report: a TreeMap<String, Integer>. - Not quite. The order rules are all kept, but the ArrayDeque documentation lists contains among its linear-time operations. Each check may scan the whole line, so its cost grows with the number of waiting tickets, and the screen checks many times a second. Option C: Undo: an ArrayDeque with push and pop. Waiting: an ArrayDeque with offer and poll, plus a HashSet of waiting ids updated with it. Report: a TreeMap<String, Integer>. - Correct. push and pop work on the same end, so the newest edit is undone first. offer adds at the tail and poll removes from the head, so the oldest ticket is served first, and the HashSet answers the frequent id check in constant expected time as long as the app adds and removes each id together with its ticket. A TreeMap keeps its keys sorted, so the report prints alphabetically. Option D: Undo: an ArrayDeque with push and pop. Waiting: an ArrayDeque with push and pop, plus a HashSet of waiting ids updated with it. Report: a TreeMap<String, Integer>. - Not quite. push and pop make a last-in-first-out stack, so the newest ticket would be served first and the oldest could wait forever. Waiting tickets need first in, first out. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: What do the three println calls print?. Option A: {low=[Ana, Cy], high=[Ben, Ana]} Ana none - Not quite. The lists are right, but TreeMap::new makes the result a TreeMap, which sorts its keys: "high" comes before "low". Option B: {high=[Ben, Ana], low=[Ana, Cy]} Ana none - Correct. The TreeMap sorts the keys, so high prints first. mapping with toList keeps the rows' encounter order inside each list. Ana's high ticket (20 minutes) beats Ben's (10), so max holds Ana. No ticket is over 60 minutes, so findFirst is empty, map stays empty and orElse prints none. Option C: {high=[Ana, Ben], low=[Ana, Cy]} Ana none - Not quite. Only the keys are sorted. mapping with toList adds the names in the order the rows arrive, and Ben's high ticket comes before Ana's. Option D: {high=[Ben, Ana], low=[Ana, Cy]} Ana NoSuchElementException - Not quite. The first two lines are right, but nothing calls get on the empty Optional. map skips an empty value and orElse supplies "none", so no exception is thrown. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: Which change gives each customer's longest ticket?. Option A: .collect(Collectors.toMap(Ticket::customer, Ticket::minutes, Integer::sum)) - Not quite. The merge function stops the exception, but Integer::sum adds the two values, so Ana would get 50, her total minutes rather than her longest ticket. Option B: .distinct() .collect(Collectors.toMap(Ticket::customer, Ticket::minutes)) - Not quite. distinct drops only tickets that are equal, and a record is equal only when every component matches. Ana's two tickets differ in level and minutes, so both stay and toMap still throws on the duplicate key. Option C: .collect(Collectors.toMap(Ticket::customer, Ticket::minutes, (first, second) -> second)) - Not quite. The merge function stops the exception, but it keeps whichever value arrives later, not the larger one. Here Ana would get 20, her shorter ticket. Option D: .collect(Collectors.toMap(Ticket::customer, Ticket::minutes, Integer::max)) - Correct. toMap calls the merge function with the stored value and the new value whenever a key repeats. Integer::max returns the larger one, unboxing and boxing the Integer values automatically, so Ana keeps 30 while Ben and Cy keep 10 and 45. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
