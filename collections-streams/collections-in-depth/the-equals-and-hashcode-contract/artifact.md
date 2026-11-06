# The equals and hashCode contract

## Objectives

- State the equals contract (reflexive, symmetric, transitive, consistent, and false for null) and the rule that equal objects must have equal hash codes
- Implement equals and hashCode for a value class with Objects.equals and Objects.hash, or use a record that provides them
- Diagnose a HashSet or HashMap bug caused by overriding equals without hashCode, or by changing fields that participate in equals and hashCode while the object is stored as a key, and contrast it with changing an unrelated field, which does not break lookup

## Teaching

### Start with a guess

A `Seat` class overrides `equals`, so two seats with the same row and number are equal. It does not override `hashCode`. Read this code before any explanation.

```
Set<Seat> booked = new HashSet<>();
booked.add(new Seat("A", 1));
System.out.println(booked.contains(new Seat("A", 1)));
```

### The contract: equals, then hashCode

For non-null references, `equals` must be:

- reflexive: `x.equals(x)` is true;
- symmetric: `x.equals(y)` exactly when `y.equals(x)`;
- transitive: if x equals y and y equals z, then x equals z;
- consistent: the same answer every call while the compared fields do not change;
- false for null: `x.equals(null)` returns false.

And the rule that links them: equal objects must have equal hash codes. Unequal objects may share a hash code; that is allowed, only slower.

### Write both from the same fields, or use a record

```
final class Seat {
    private final String row;
    private final int number;
    Seat(String row, int number) { this.row = row; this.number = number; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Seat s)) return false;
        return Objects.equals(row, s.row) && number == s.number;
    }
    @Override public int hashCode() { return Objects.hash(row, number); }
}

record Seat(String row, int number) { }   // equals, hashCode, toString provided
```

`Objects.equals` is null-safe; `Objects.hash` combines the same fields `equals` compares. A record's provided `equals` and `hashCode` use every component.

### Two bugs that can break hash lookup

- `equals` without `hashCode`: equal objects can receive different inherited hash codes, so the set can look in the wrong place and a lookup can fail.
- Changing a key's compared field while it is stored: the Map documentation makes the behavior unspecified from then on. The hash code can change, so a lookup can fail even with the same object.

Changing a field that `equals` and `hashCode` ignore is harmless: lookup still works.

## Model

The model: a hash set first uses an object's `hashCode` to pick where to look, then uses `equals` to confirm the match there. Both steps must agree on which fields matter. If equal objects produce different hash codes, or a stored object's compared fields change, the set can look in the wrong place and report "not found".

## Recap

- `equals` is reflexive, symmetric, transitive, consistent, and false for `null`; equal objects must have equal hash codes.
- Build `equals` with `Objects.equals` and `hashCode` with `Objects.hash` over the same fields, or declare a record.
- Overriding `equals` without `hashCode` can make `HashSet` and `HashMap` lookup fail. Changing a compared field of a stored key makes their behavior unspecified, and lookup can fail. Changing an unrelated field does not affect lookup.

Next topic: How HashMap works

## Cheat sheet

|  |  |
| --- | --- |
| equals start | `if (this == o) return true; if (!(o instanceof T t)) return false;` |
| Reference field | `Objects.equals(name, t.name)` |
| Primitive field | `number == t.number` |
| hashCode | `Objects.hash(name, number)`: the same fields |
| Shortcut | `record T(String name, int number) { }` |
| Keys | do not change compared fields while stored |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture a library that works out a shelf number from a book's catalogue details (its `hashCode`), then checks the title page (`equals`) only among the books on that one shelf. Two copies of the same book must get the same shelf number; if they do not, the librarian can search the wrong shelf and answer "not here" while an identical copy sits elsewhere. Two different books may share a shelf: that only makes the check on that shelf a little longer.

If someone edits the catalogue details of a book while it sits on its shelf, the library makes no promise about later searches: one can start on the wrong shelf and fail, even for that very book.

## Sources

Claims on this page were checked against the live official pages below on 14 October 2026 (UTC), for Java SE 25. Program output was confirmed on OpenJDK 25.0.4. Links open outside this lesson.

- Object (Java SE 25 API): equals is an equivalence relation; the general contract of hashCode.
- Objects (Java SE 25 API): equals(Object, Object), hash(Object...).
- Record (Java SE 25 API): the implicitly provided equals and hashCode.
- HashSet (Java SE 25 API): backed by a hash table.
- Map (Java SE 25 API): behavior is not specified when a key changes in a way that affects equals.
- Dev.java: Choosing Immutable Types for Your Key; Dev.java: Object as a Superclass; Dev.java: Using Record to Model Immutable Data.

Not promised by Java: that a lookup fails after the bugs above. The failures shown are what OpenJDK 25 did; the specification leaves a mutated key's behavior unspecified and identity hash codes are not guaranteed to differ.

## Static interaction alternatives

### predict

Prediction (practice, not scored): Seat overrides equals but not hashCode; a HashSet gets new Seat("A", 1), then contains(new Seat("A", 1)) is printed. Options: true (wrong in practice: the two seats can get different inherited hash codes, and in OpenJDK 25 they did, so the set looked in another place); false in practice (correct: OpenJDK 25 printed false in 10,000 of 10,000 runs; the set did not reach equals, though Java does not guarantee this); a compile error (wrong: overriding only equals compiles); an exception (wrong: nothing is thrown).

### drag

Sorting activity: equals compares name and id, hashCode is Objects.hash(name, id): keeps the contract. hashCode always returns 0: keeps the contract (allowed, but every object shares one bucket, which is slow). a.equals(b) is true but b.equals(a) is false: breaks equals (symmetric). x.equals(null) throws NullPointerException: breaks equals (must return false). equals compares id only, hashCode is Objects.hash(name, id): breaks the hash rule, because two equal objects with different names get different hash codes. hashCode returns a new random number on every call: breaks the hash rule.

### explore

Seat lab, on OpenJDK 25. A HashSet gets a Seat for row A, number 1. Version equals only (no hashCode): contains(new Seat("A", 1)) printed false. Version equals and hashCode, or the record: it printed true. With the full version, changing the note field (not used by equals or hashCode) and then calling contains on the same object printed true. Changing the row field (used by equals and hashCode) from A to B and then calling contains on the same object printed false in this run, although the set still had size 1. Java leaves the behavior after such a change unspecified: that false is one observed outcome, not a guarantee.

### mcq

Apply question: User.equals compares email only. Correct hashCode: return Objects.hash(email), the same field equals uses. Wrong: Objects.hash(email, nickname), because two equal users with different nicknames would get different hash codes; System.identityHashCode(this), because equal users would get different codes; return 0, which keeps the contract but puts every user in one bucket. Retry form: record User(String email, String nickname) { } provides equals and hashCode over both components with no handwritten methods.
