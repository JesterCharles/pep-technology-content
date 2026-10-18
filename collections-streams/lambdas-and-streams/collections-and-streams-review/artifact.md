# Review: collections and streams

## Objectives

- Retrieve, without notes, the collection, operation cost and equality rule that fit a described scenario open
- Rewrite a loop that filters, transforms and groups data as an equivalent stream pipeline, and rewrite a stream pipeline as a loop open
- Diagnose a collection or stream bug from its symptom: a missing hashCode, a ConcurrentModificationException, a reused stream or an unchecked Optional.get open

## Teaching

No hints here: answer from memory. A program keeps club members unique and tests membership often; order does not matter.

Translate by stages. Loop to pipeline: the condition becomes filter, a derived value map, and counting by key groupingBy with counting. Pipeline to loop: create the result list, then test, map and add inside the loop, and sort after it.

Match each symptom to its cause; each explanation names the repair.

## Recap

- Pick collections by what must stay true; keep equals and hashCode in agreement.
- Translate loops and pipelines stage by stage, both ways.
- Diagnose from the symptom, then apply the matching repair.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

A collection is a container chosen for what must stay true: order, uniqueness, key lookup or access at the ends. A stream is a temporary assembly line over the contents.

Name each stage: the if is the filter, account.team() the key, and merge with 1L a count per key.

Another hint Hint 2 of 2

Reverse it: in a for-each loop over accounts, test the pipeline’s condition and add name(); sort loopNames after the loop.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- Collections Framework introduction
- HashSet API
- ArrayList API
- Object (equals and hashCode contract)
- ConcurrentModificationException
- java.util.stream package
- Optional API

## Static interaction alternatives

### mcq

Collection for unique members and frequent membership tests.

### mcq

Expected cost of HashSet.contains.

### mcq

Rule a Member type must follow in a HashSet.

### terminal

Given: record Account(name, team, active) and five accounts. The starter loop counts active accounts per team into totals. Write streamTotals as one accounts.stream() pipeline with filter, groupingBy and counting ({web=2, data=1}), then fill loopNames with the names of inactive accounts using a for-each loop and a sort, without a stream ([Ali, Di]).

### mcq

Equal Members both stay in a HashSet.

### mcq

A for-each loop removes from its list and throws.

### mcq

A second terminal operation on one stream throws.

### mcq

findFirst().get() on an empty result throws.
