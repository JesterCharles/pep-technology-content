# Stacks and queues

## Objectives

- Trace push, pop and peek on an ArrayDeque used as a last-in-first-out stack, and offer, poll and peek on one used as a first-in-first-out queue
- Distinguish the Queue and Deque methods that throw an exception on an empty deque (remove, element, pop) from those that return null (poll, peek)
- Explain why the Java API documentation recommends a Deque such as ArrayDeque over the legacy Stack class

## Teaching

### Start with a guess

An `ArrayDeque` is a double-ended queue: elements can go in or come out at either end. Read this code before any explanation.

```
Deque<String> stack = new ArrayDeque<>();
stack.push("a");
stack.push("b");
stack.push("c");
System.out.println(stack.pop() + stack.peek());
```

### One deque, two disciplines

Every `ArrayDeque` has a head (the front) and a tail (the back). Which end you add to decides the discipline:

| Use | Add | Remove | Look |
| --- | --- | --- | --- |
| Stack, last-in-first-out | `push(e)` at the head | `pop()` from the head | `peek()` at the head |
| Queue, first-in-first-out | `offer(e)` at the tail | `poll()` from the head | `peek()` at the head |

Removing and looking always happen at the head. A stack adds at the head, so the newest element comes out first; a queue adds at the tail, so the oldest comes out first.

### When the deque is empty

The methods come in two families. On an empty deque:

- `remove()`, `element()` and `pop()` throw `NoSuchElementException`.
- `poll()` and `peek()` return `null`.

```
Deque<String> jobs = new ArrayDeque<>();
String next = jobs.poll();   // null: nothing waiting
String top  = jobs.pop();    // throws NoSuchElementException
```

Pick `poll` or `peek` when empty is normal and you will check for `null`. Because `null` means "empty", `ArrayDeque` refuses to store it: `offer(null)` and `push(null)` throw `NullPointerException`.

### Why ArrayDeque, not Stack

`java.util.Stack` is a legacy class from Java 1.0 that extends `Vector`. Its own API documentation says a "more complete and consistent set of LIFO stack operations" comes from the `Deque` interface and its implementations, "which should be used in preference to this class". The `ArrayDeque` documentation adds that it is likely to be faster than `Stack` when used as a stack.

## Model

The model: a row of elements with a head and a tail. `pop`, `poll` and `peek` always work at the head. `push` adds at the head, which gives last-in-first-out; `offer` adds at the tail, which gives first-in-first-out. On an empty row, one family of methods throws and the other returns `null`.

## Recap

- Stack: `push`, `pop` and `peek` all work at the head, so the last element in is the first out.
- Queue: `offer` adds at the tail; `poll` and `peek` work at the head, so the first in is the first out.
- On an empty deque, `remove`, `element` and `pop` throw `NoSuchElementException`; `poll` and `peek` return `null`.
- `ArrayDeque` rejects `null` elements.
- Prefer `Deque<E> s = new ArrayDeque<>()` over the legacy `Stack` class, as the API documentation recommends.

Next topic: Generics

## Cheat sheet

|  |  |
| --- | --- |
| Stack (LIFO) | `push(e)`, `pop()`, `peek()` |
| Queue (FIFO) | `offer(e)`, `poll()`, `peek()` |
| Throws when empty | `remove()`, `element()`, `pop()` |
| Returns `null` when empty | `poll()`, `peek()` |
| Declaration | `Deque<String> d = new ArrayDeque<>();` |

Optional example. Try the step 1 prediction before you read on: this example explains its answer.

Picture a pile of trays in a canteen: the tray put down last is the first one picked up. That is `push` and `pop`. Now picture the line at the counter: people join at the back and are served from the front, so whoever came first leaves first. That is `offer` and `poll`.

An `ArrayDeque` is a counter that always serves from the front. You only choose where a newcomer stands: in at the front with `push`, and you get the tray pile; at the back with `offer`, and you get the waiting line.

## Sources

Claims on this page were checked against the live official pages below on 13 October 2026 (UTC), for Java SE 25. Program output was confirmed on OpenJDK 25.0.4. Links open outside this lesson.

- Deque (Java SE 25 API): head and tail methods; use as a stack; preference over Stack.
- Queue (Java SE 25 API): Summary of Queue methods (throws exception or returns special value).
- ArrayDeque (Java SE 25 API): null elements prohibited; likely faster than Stack.
- Stack (Java SE 25 API): extends Vector; Deque should be used in preference.
- Dev.java: Storing Elements in Stacks and Queues.

## Static interaction alternatives

### predict

Prediction (practice, not scored): an ArrayDeque gets push("a"), push("b"), push("c"); what does pop() + peek() print? Options: cb (correct: c was pushed last, so pop removes it, and peek then reads b without removing it); ab (wrong: that is first-in-first-out order); cc (wrong: pop removes c, so peek sees b); ba (wrong: pop returns the newest element, c).

### explore

Practice deque: buttons call push, offer, pop, poll and peek on an ArrayDeque, adding the next job name each time. Worked example: offer("j1"), offer("j2"), offer("j3") make the deque [j1, j2, j3]; three poll() calls then return j1, j2 and j3, which is arrival order. Using push instead gives [j3, j2, j1] and removes j3 first. pop() on an empty deque throws NoSuchElementException; poll() returns null.

### drag

Sorting activity, each call on an empty ArrayDeque: pop() throws NoSuchElementException; poll() returns null; peek() returns null; remove() throws NoSuchElementException; element() throws NoSuchElementException; offer(null) throws NullPointerException because ArrayDeque prohibits null elements.

### mcq

Apply question: new code declares Stack<String> history = new Stack<>(). Correct change: declare Deque<String> history = new ArrayDeque<>(), because the Stack documentation says Deque gives a more complete and consistent set of LIFO operations and should be used in preference, and ArrayDeque is likely faster. Wrong: keep Stack because it is the only LIFO class; switch to PriorityQueue (it orders by priority, not LIFO); keep Stack because Deque cannot push. Retry form: which statement does the Stack documentation make? Correct: Deque and its implementations should be used in preference to Stack.
