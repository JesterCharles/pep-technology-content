# Sorting with Comparator

## Objectives

- Sort a list by one or more keys with List.sort and Comparator.comparing, thenComparing and reversed
- Distinguish a class's natural ordering (Comparable.compareTo) from a supplied Comparator, and order null values with Comparator.nullsFirst or nullsLast

## Teaching

Passing `null` to `List.sort` means the elements' own ordering. Predict before any explanation.

```
List<String> words = new ArrayList<>(List.of("pear", "Fig", "apple"));
words.sort(null);
System.out.println(words);
```

```
record Book(String title, int year) { }
// comparing alone: oldest first; .reversed(): newest first
books.sort(Comparator.comparing(Book::year).reversed());
// oldest first; same year: title A to Z
books.sort(Comparator.comparing(Book::year)
                     .thenComparing(Book::title));
```

`Book::year` is shorthand for the lambda `b -> b.year()`. `comparing` sorts by one key, `thenComparing` breaks ties with the next key, and `reversed()` flips everything built so far. Placement matters: before `thenComparing` it flips only the first key; at the end it flips the tie-breaker too. `List.sort` is stable: equal elements keep their previous order.

A class that implements `Comparable` has a natural ordering, defined by its `compareTo`: numbers by value, `String` by character code, so `"Fig"` comes before `"apple"`. `list.sort(null)` and `Collections.sort(list)` use it; elements that are not `Comparable` make the sort throw `ClassCastException`.

A Comparator supplies any other order without changing the class. Natural ordering throws `NullPointerException` on a `null` element; wrap a comparator to place nulls deliberately: `Comparator.nullsFirst(Comparator.naturalOrder())` or `Comparator.nullsLast(...)`.

A sign-up sheet stores a blank row as `null`; the printout must place blanks without crashing.

## Model

The model: sorting keeps asking which of two elements comes first. Natural ordering answers with the class's own `compareTo`; a `Comparator` answers from outside, built from keys.

## Recap

- `list.sort(Comparator.comparing(key))` sorts by one key; `thenComparing` breaks ties; `reversed()` flips the comparator built so far.
- `List.sort` is stable: ties keep their order unless a later key breaks them.
- Natural ordering comes from `Comparable.compareTo` and is what `sort(null)` uses; a `Comparator` supplies another order.
- Natural ordering fails on `null`; `Comparator.nullsFirst` and `nullsLast` place nulls safely.

Next module: Lambdas and Streams

## Cheat sheet

A teacher pins marked essays to a wall: highest mark at the top, and when two essays share a mark, the student whose name comes first in the alphabet goes higher. Names matter only when marks tie. Turning the finished wall upside down would also flip that alphabetical order, not just the marks.

A sorting rule built from keys works the same way: the first key decides, and later keys only settle ties.

Where to act: Inside the parentheses of `players.sort(...)` on the last line of the editor.

Next step: In both targets the highest score comes first, so keep the score as the first key but make it run in the opposite direction to the starter.

Another hint Another hint, 2 of 3 for Activity 2

Where to act: Directly after `Comparator.comparing(Player::score)`.

Next step: `comparing` sorts lowest first. Chain the method from the teaching that flips the order built so far, before you add any second key.

Another hint Another hint, 3 of 3 for Activity 2

Where to act: At the end of the chain, after the flip.

Next step: Tied scores still keep their starting order, such as `ben` before `ana` in List 1. Chain the tie-breaking method with the name as its key, so only the ties are ordered A to Z.

Where to act: The call shown after Call:, above the three buttons.

Next step: First ask whether the call passes a comparator at all. If it does not, ask whether every element is `Comparable` and none is `null`.

Optional time: about 5 minutes, in addition to this topic's time.

The sign-up sheet now holds players, and a blank row is stored as `null`: `cy 80`, `null`, `ana 95`, `ben 80`. Write one `players.sort(...)` statement that puts blank rows last and sorts the other players by score, highest first, with ties broken by name from A to Z. Build it only from the `Comparator` methods on this page, then check it on paper or in any Java 25 setup you already use.

Success criteria: the statement does not throw, and the list ends in the order `ana 95`, `ben 80`, `cy 80`, `null`; you can say which method handles the `null` and why it must wrap the score-and-name comparator.

|  |  |
| --- | --- |
| One key | `books.sort(Comparator.comparing(Book::year));` |
| Newest first, ties by title | `Comparator.comparing(Book::year).reversed().thenComparing(Book::title)` |
| Natural ordering | `list.sort(null)`, `Collections.sort(list)` |
| Reverse natural | `list.sort(Comparator.reverseOrder())` |
| Nulls at the end | `Comparator.nullsLast(Comparator.naturalOrder())` |

## Sources

Claims on this page were checked against the live official pages below on 14 October 2026 (UTC), for Java SE 25. Program output was confirmed on OpenJDK 25.0.4. Links open outside this lesson.

- List (Java SE 25 API): sort(Comparator) is stable; a null comparator means natural ordering.
- Comparator (Java SE 25 API): comparing, thenComparing, reversed, naturalOrder, reverseOrder, nullsFirst, nullsLast.
- Comparable (Java SE 25 API): natural ordering and compareTo.
- Collections (Java SE 25 API): sort(List).
- Dev.java: Writing and Combining Comparators.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a list of pear, Fig, apple is sorted with sort(null). Options: [apple, Fig, pear] (wrong: String natural ordering compares character codes, and uppercase letters come before lowercase); [Fig, apple, pear] (correct); [pear, Fig, apple] (wrong: sort(null) does sort, using natural ordering); NullPointerException (wrong: a null comparator means natural ordering, and no element is null).

### explore

Java editor on two lists of players (record Player(String name, int score)); one players.sort statement is applied to each list, and both must match their targets. List 1 starts ben 80, dee 95, ana 80, cy 70; its target is dee 95, ana 80, ben 80, cy 70. List 2 starts zed 90, al 60, bo 90, cy 60; its target is bo 90, zed 90, al 60, cy 60. The starter, comparing by score alone, gives cy 70, ben 80, ana 80, dee 95 and al 60, cy 60, zed 90, bo 90: lowest first, and the stable sort keeps tied players in their starting order. Flipping only the score order gives dee 95, ben 80, ana 80, cy 70 and zed 90, bo 90, al 60, cy 60: highest first, but ties keep their starting order. Sorting by name alone gives ana 80, ben 80, cy 70, dee 95 and al 60, bo 90, cy 60, zed 90, which ignores the scores. A reversed() at the very end of a score-then-name chain gives dee 95, ben 80, ana 80, cy 70 and zed 90, bo 90, cy 60, al 60, because it flips the name order too. players.sort(null) compiles but throws ClassCastException, because Player does not implement Comparable.

### drag

Sorting activity: words.sort(null) uses natural ordering. Collections.sort(words) uses natural ordering. words.sort(Comparator.comparing(String::length)) uses a supplied Comparator. words.sort(Comparator.reverseOrder()) uses a supplied Comparator (the reverse of natural ordering). withNull.sort(null) throws NullPointerException, because natural ordering cannot compare null. withNull.sort(Comparator.nullsFirst(Comparator.naturalOrder())) uses a supplied Comparator that puts null first. teams.sort(null) throws ClassCastException, because Team does not implement Comparable.

### mcq

Apply question: [cy, null, ana] sorted with Comparator.nullsLast(Comparator.naturalOrder()) prints [ana, cy, null]. Wrong: [null, ana, cy] (that is nullsFirst); NullPointerException (nullsLast handles the null before natural ordering is asked); [cy, ana, null] (natural ordering of the non-null names is ana then cy). Retry form: Comparator.nullsFirst(Comparator.reverseOrder()) prints [null, cy, ana].
