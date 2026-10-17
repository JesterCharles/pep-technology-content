# Timed coding-screen patterns

## Objectives

- Recognize which pattern fits a short problem statement: a HashMap frequency count, a HashSet of seen values, an ArrayDeque stack, or two pointers open
- Solve a short problem inside a time box by restating the inputs and outputs, listing edge cases, then coding and testing the simplest correct version open
- State a solution's time complexity in Big-O terms out loud open

## Teaching

Match each prompt to the state it needs: counts by key, values seen, last-opened work, or positions moving toward each other.

Under a time box: restate inputs and outputs, list edge cases, write the simplest correct version, then test normal and edge inputs. `firstRepeat(List<Integer> values)` returns the first value seen a second time, left to right, as an `Optional`, or `Optional.empty()`.

Say the cost aloud with its assumption: how time and extra memory grow with n input values.

## Model

Model statement: Expected O(n) time for n values: one pass, and each HashSet add is expected constant time when hash codes spread well. O(n) space: the set can hold every value when nothing repeats.

## Recap

- Match the prompt to the state a pattern keeps.
- Restate, list edge cases, code simply, test.
- State time and space aloud, with assumptions.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

A coding screen is a short kitchen service: read the ticket, name the plate, check unusual orders, cook the plain version, taste it, then say how the workload grows.

Match the state: you only need “seen before?”. HashSet.add returns false when the value is already present.

Another hint Hint 2 of 2

Trace an example: walk 1, 2, 2, 1 and say what the set holds after each value; then check the empty list.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- HashMap API
- HashSet API
- ArrayDeque API
- Optional API

## Static interaction alternatives

### mcq

Count how many times each word appears.

### mcq

Report whether any order id repeats.

### mcq

Check that brackets close in order.

### mcq

Find two values in a sorted array that sum to a target.

### mcq

Result for the empty list.

### mcq

Result for 3, 1, 4.

### mcq

Result for 1, 2, 2, 1.

### terminal

Starter: firstRepeat(List<Integer> values) returns Optional.empty() for now, plus one println. Implement it in one pass with a HashSet. Checks: 5 2 5 2 gives Optional[5]; 1 2 2 1 gives Optional[2]; 7 7 gives Optional[7]; the empty list and 3 1 4 give Optional.empty; -1 0 -1 gives Optional[-1].

### explore

Say the time and space cost of firstRepeat out loud, then compare with the model statement: expected O(n) time with well-spread hash codes, O(n) space.
