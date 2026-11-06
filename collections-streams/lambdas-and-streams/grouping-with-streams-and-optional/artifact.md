# Grouping with streams and Optional

## Objectives

- Group and count stream elements with Collectors.groupingBy, counting and mapping, and predict the shape of the resulting map open
- Handle the Optional returned by findFirst, max or min with orElse, orElseThrow, map or ifPresent instead of calling get unchecked open
- Choose Collectors.groupingBy, or Collectors.toMap with a merge function, when stream keys can repeat, instead of a toMap call that throws IllegalStateException on a duplicate key open

## Teaching

The names Ana, Al and Bo are collected with `groupingBy(name -> name.charAt(0), counting())`. Predict the type and values of the result.

`groupingBy(classifier, downstream)` builds a map: the classifier gives each key and the downstream collector shapes each value. `counting()` gives Long counts; `mapping(mapper, toList())` transforms elements before collecting them. `findFirst`, `max` and `min` return `Optional` because a stream may be empty. Handle absence with `orElse`, `orElseThrow`, `map` or `ifPresent`; an unchecked `get()` throws `NoSuchElementException` when empty.

`Collectors.toMap(keyMapper, valueMapper)` throws `IllegalStateException` when two elements map to the same key. When keys can repeat, state the policy: `groupingBy` keeps every element, or `toMap` with a merge function combines the values. Several purchases can share a customer id; the result needs one total per customer.

## Recap

- groupingBy picks keys; counting and mapping shape the values.
- Handle an empty Optional with orElse, orElseThrow, map or ifPresent, not get().
- When keys repeat, use groupingBy or toMap with a merge function.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

Grouping is like sorting mail into labeled trays, then asking a clerk to count or relabel each tray. Optional is a pickup locker that may be empty: decide what to do before opening it.

Shape the maps: both use the category as the classifier; only the downstream collector differs.

Another hint Hint 2 of 2

Handle the empty case: turn the Optional into an Optional holding the name, then supply the fallback.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- Collectors API
- Optional API
- Stream API

## Static interaction alternatives

### mcq

Predict the type and values produced by grouping Ana, Al and Bo by first letter with counting, record confidence, then compare the explanation printed under every option.

### terminal

Given: record Product(name, category, cents) and six products (Atlas books 4200, Chess games 3500, Kite toys 1500, Go games 2800, Saga books 1900, Uno games 900). Build countByCategory with groupingBy and counting, namesByCategory with groupingBy and mapping, and label from priciest without get(): "Atlas" for the sample, "none" for an empty list.

### mcq

Choose the collector that safely handles repeated customer ids, record confidence, then compare the explanation printed under every option.
