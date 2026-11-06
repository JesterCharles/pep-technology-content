# Collections in Depth: coding lab

## Goal

Practise the collections you met in this module on your own JDK, with real compiler checks and real JUnit tests.
You complete six small classes in `starter/src/main/java/pep/collections/`:

| Part | Class | Topic | Day | About |
|---|---|---|---|---|
| 1 | `Shelf` | Lists, sets and maps in depth | F25 | 8 min |
| 2 | `Desk` | Stacks and queues | F25 | 10 min |
| 3 | `Pair` | Generics | F25 | 8 min |
| 4 | `Overlap` | Big-O basics | F25 | 9 min |
| 5 | `Seat` | The equals and hashCode contract | F26 | 6 min |
| 6 | `Tally` | How HashMap works | F26 | 6 min |

Parts 1 to 4 belong to day F25 (about 35 minutes) and parts 5 and 6 to day F26 (about 12 minutes).
This lab is part of the Foundation and Standard routes; the Fast Track route skips it.

## Prerequisites

- JDK 25. Check with `java -version`; the first line should show version 25.
- Apache Maven 3.9 or later. Check with `mvn -v`; it should also report Java version 25.
- A terminal open in this lab's `starter/` directory.

No Docker or other container engine is used.

## Setup (once, online)

From `starter/`, run:

```sh
mvn -q -Dmaven.test.failure.ignore=true clean test
```

This downloads the pinned Maven plugins and JUnit Jupiter into your local Maven repository (`~/.m2/repository`) and runs the tests once.
Failing tests are expected at this point; the flag only stops Maven from treating them as a setup error.
After this, everything runs offline.

## Tasks

Each method's comment in the starter says what it must do. Replace each `throw new UnsupportedOperationException("TODO ...")` with working code.

1. **`Shelf`**: remove blank titles in place with `removeIf` (not inside a for-each loop), keep each title once in first-appearance order, and return copies with `getOrDefault`.
2. **`Desk`**: check brackets with an `ArrayDeque` used as a stack (`push`, then `pop` or `poll`); serve jobs where urgent ones (`"!"` first) are pushed to the head and others offered to the tail, then polled; and return the next job with `peek`, or `"none"` when `peek` returns `null`.
3. **`Pair`**: store the two values in fields of type `A` and `B`, return them, build the swapped `Pair<B, A>`, and implement the generic method `lastOf`.
4. **`Overlap`**: the given method works but scans `b` once for every name in `a`, and its `both.contains` check scans the growing result list too. Rewrite the whole method to be expected O(n + m): build a `HashSet` from `b` in one pass, and remember the names you have already added in a second `HashSet` (or collect them in a `LinkedHashSet`) instead of calling `contains` on the result list. Add a comment stating the complexity before and after, with n = `a.size()` and m = `b.size()`.
   `OverlapTest.usesHashLookupsWithNoScanInsideTheLoop` reads your compiled class rather than timing it, so the result never depends on your machine's speed. It rejects a lookup that scans a list (such as `both.contains`), `retainAll` or `removeAll` with a list on either side (each calls `contains` on its argument for every element, a hidden O(n × m) scan), a sorted `TreeSet` or `TreeMap` (each lookup costs O(log n), so two of them make the method O((n + m) log(n + m))), sorting, and a loop inside another loop.
5. **`Seat`**: the starter `Seat` declares neither `equals` nor `hashCode`, so two seats with the same row and number are two different keys. Write both methods yourself from the same two fields, `row` and `number`: `equals` with `Objects.equals` for `row` (a seat with no row assigned yet has a `null` row), and `hashCode` with `Objects.hash`. Keep `Seat` a plain class that writes both methods itself: the lesson shows that a record generates both methods for you, but this part practises writing them yourself. The tests check that `Seat` is still a class, extends no other class, and declares both methods in its own code.
   Java allows two unequal seats to share a hash code, so a collision is never a contract error. This part still asks for a hash built from both fields, so `SeatTest.equalSeatsHaveEqualHashCodes` also checks that changing only `row`, or only `number`, changes the hash for a few sample seats. A constant such as `return 0;` keeps the contract but puts every seat in one bucket, and the test names the field it ignores.
   Write `equals` first and run the tests: `SeatTest.equalSeatsHaveEqualHashCodes` still fails, because an object that overrides `equals` without `hashCode` breaks the contract and can be missed by a `HashSet` lookup. Then add `hashCode` and run them again.
6. **`Tally`**: count words with `Map.merge`, and group words by first character with `Map.computeIfAbsent`.

## Test

From `starter/`, run the one test command:

```sh
mvn -q -o test
```

`-o` runs offline, and `-q` prints only problems. The tests read one small fixture, `fixtures/words.txt`.

## Expected output

- As shipped, the starter fails 20 of the 21 tests. The failure lines match `expected/starter-failures.txt`; each one names the test, its line and a message such as `TODO Desk.isBalanced`. The `Overlap` and `Seat` failures name the problem to fix.
- When you are done, `mvn -q -o test` prints no test lines and exits with status 0. `expected/passing-summary.txt` shows the full summary you see without `-q`: `Tests run: 21, Failures: 0, Errors: 0, Skipped: 0`.

Some Maven versions print `WARNING:` lines about restricted or deprecated JDK methods when they start on JDK 25. They come from Maven itself, not from this lab, and do not affect the result.

## Offline note

After the one-time setup, `mvn -q -o test` needs no network. If Maven says a plugin or dependency cannot be resolved in offline mode, run the setup command once more while online.

## Cleanup

From `starter/`, run:

```sh
mvn -q -o clean
```

This deletes `starter/target/`, the only directory the lab creates. The setup step also filled your shared local Maven repository (`~/.m2/repository`); it is left in place for other projects.

## Troubleshooting

- **`release version 25 not supported`**: Maven is using an older JDK. Check `mvn -v`, and point `JAVA_HOME` at your JDK 25.
- **Compilation errors in `tests/`**: a method signature in the starter was changed. The tests rely on the given names, parameter types and return types; restore them.
- **`OverlapTest.readsListBInASinglePass` still fails**: `b.contains(...)` inside the loop is a hidden scan of `b`. Copy `b` into a `HashSet` once, before looping over `a`.
- **`OverlapTest.readsEachListOnceWhenEveryNameIsShared` fails**: a list is read more than once. Loop over `a` once and build the `HashSet` from `b` once, before that loop.
- **`OverlapTest.usesHashLookupsWithNoScanInsideTheLoop` fails**: its message names what it found. `both.contains` or `List.contains` scans the result list; use a second `HashSet` for "already added?". `retainAll` or `removeAll` on a list, or with a list argument, calls `contains` on that list for every element; loop over `a` once and look names up in a `HashSet` built from `b`. `TreeSet` or `TreeMap` makes each lookup O(log n); use `HashSet`. A loop inside the loop over `a` repeats a scan for every name; replace it with a `HashSet` lookup.
- **`SeatTest` says `Seat does not declare ...`**: the named method is still the one inherited from `Object`; add it to `Seat`.
- **`SeatTest` says `Seat extends ...` or `was generated by the compiler`**: the methods come from a superclass rather than from `Seat`. Remove the superclass and write both methods in `Seat`.
- **`SeatTest` says `hashCode ignores row` or `hashCode ignores number`**: build the hash from both fields with `Objects.hash(row, number)`.
- **`SeatTest` still fails after adding both methods**: make both use exactly the fields `row` and `number`, and compare `row` with `Objects.equals`, not `row.equals`, so a `null` row does not throw.
