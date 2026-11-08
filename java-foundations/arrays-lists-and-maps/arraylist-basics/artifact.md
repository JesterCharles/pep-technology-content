# ArrayList basics

## Objectives

- Create an ArrayList and use add, get, set, remove and size
- Choose an ArrayList over an array when the number of elements changes
- Explain why a list of numbers is declared List\<Integer\> rather than List\<int\>

## Teaching

### Activity 1 of 4: Start with a guess

Practice prediction, not scored. This code builds a list of three numbers, then calls `remove(1)`. Guess what prints before any rules are shown.

### Your task

1. Where to look: The code just below.
2. What to do: Under Prediction, pick the output you expect.
3. Then: Pick Low, Medium or High confidence and press Check my prediction.
4. How to know it's done: Feedback explains every option and Next activity becomes available. A wrong guess is fine.

### What success looks like

You chose a prediction and a confidence, then read why each option is right or wrong.

### Activity 2 of 4: A list that grows and shrinks

An `ArrayList` is a list whose size changes. `List<String> names = new ArrayList<>();` creates an empty one; both types come from `java.util`.

`add(x)` appends; `add(i, x)` inserts at index `i` and shifts later elements right. `get(i)` reads, `set(i, x)` replaces, and `remove(i)` deletes and shifts later elements left. `size()` counts the elements.

Indexes run from 0 to `size() - 1`. Outside that range, `get`, `set` and `remove` throw `IndexOutOfBoundsException`.

### Your task

1. Where to look: List explorer, under the boxes that show `names`.
2. What to do: Press the method buttons, and use − 1 and + 1 to choose the index for get(i).
3. What to expect: Each call and its real result print under the buttons; the boxes show every element's current index.
4. How to know it's done: All four checks below read done.

### What success looks like

- Grow the list with `add`
- Insert or remove at index 0 and watch the other indexes shift
- Replace an element with `set`
- Call `get(i)` with an index that throws `IndexOutOfBoundsException`

### Activity 3 of 4: Why List<Integer>, not List<int>

A type argument may be a reference type or a wildcard, not a primitive type, so javac rejects `List<int>` with “unexpected type”. A list of whole numbers is `List<Integer>`: `Integer` is a reference type that wraps an `int`.

Java converts between them for you. `scores.add(70)` boxes 70 into an `Integer`, and `int first = scores.get(0);` unboxes it.

One trap from Activity 1: on a `List<Integer>`, `remove(0)` removes by index. To remove the value 70 instead, pass an `Integer` object, as in `remove(Integer.valueOf(70))`.

### Your task

The lines in Scores.java run as the body of `main`. The first line does not compile yet. Follow the numbered comments, from top to bottom, using the list methods from Activity 2.

1. Where to look: The Scores.java editor below; Problems already shows the first line's error.
2. First edit: fix the declaration's type argument so it compiles.
3. Then: under each numbered comment, write the call it asks for: add three scores, replace one with `set`, remove the first, and print two values. Press Run.
4. What to expect: Output shows what your code printed and the list at the end.
5. How to know it's done: All four checks below read done. After two runs of edited code—even the same edit twice—you may move on and return as often as needed; it is done and earns credit only when one run passes every check.

### What success looks like

- The declaration compiles with `Integer`, a reference type, instead of primitive `int`
- The code performs the requested `set` and `remove` operations on `scores`
- `scores` ends as `[88, 90]`
- The code prints `2`, then `88`, on separate lines

### Activity 4 of 4: Array or ArrayList?

Choose by whether the count changes. An array's length is fixed when it is created. An `ArrayList` grows with `add` and shrinks with `remove`, so it suits a collection whose size you cannot know in advance.

### Where this fits

Decision: You need to hold several values of one type. A fixed-size array, or an `ArrayList`?

Good fit: An `ArrayList`, when items arrive and leave while the program runs: the items in a shopping cart, sign-ups for an event, or lines read from a file of unknown length.

Choose something else when: the count is fixed and known, such as 7 weekdays, 12 months or a 3 × 3 board, where an array is simpler and holds `int` values directly; or when you look items up by a key rather than a position, where a `HashMap` fits.

### Your task

Which of these should be stored in an `ArrayList` rather than an array?

Same idea, new form: which of these is the best fit for a plain array?

1. Where to look: The four collections in the options below.
2. What to do: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback explains every option. After a wrong first answer, a second question appears with Check second try.
4. How to know it's done: Feedback explains the result. If another required activity is still open, it is named with a return link; the recap opens only after every required activity is complete.

### What success looks like

You chose the collection whose size changes and can say why the fixed-size ones suit an array.

## Model

The code

```
List<Integer> nums = new ArrayList<>();
nums.add(10);
nums.add(20);
nums.add(30);
nums.remove(1);
System.out.println(nums);
```

`names` now, with each element's index

1. Ada [0] i
2. Ben [1]
3. Cy [2]

size() is 3, so valid indexes are 0 to 2.

## Recap

- `new ArrayList<>()` creates an empty list; `add`, `get`, `set`, `remove` and `size` grow, read, replace, shrink and count it.
- Inserting or removing shifts the later elements' indexes; indexes outside 0 to `size() - 1` throw `IndexOutOfBoundsException`.
- Type arguments may be reference types or wildcards, not primitive types, so numbers go in a `List<Integer>`; Java boxes and unboxes for you, and `remove(int)` removes by index.
- Use an `ArrayList` when the count changes; keep an array when it is fixed.

Next topic: HashMap basics: put, get, containsKey

## Cheat sheet

At a bakery, customers stand in a numbered queue. When someone joins, the queue simply gets longer. When the person at the front is served and leaves, everyone behind steps forward, so each person's number drops by one. Calling out a number past the last person in line gets no answer.

An ArrayList behaves like that queue: it grows, and positions shift when someone leaves.

Where to act: The + 1 button, then get(i).

Next step: Press size() first. The last valid index is one less than that size, so set i equal to the size itself before you press get(i).

Where to act: The angle brackets on the first line.

Next step: Type arguments may be reference types or wildcards, not primitives. Here, use `Integer`, a reference type, instead of the primitive `int`; the right-hand side can stay as it is.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The lines for comments 3 and 4.

Next step: After the three adds, 85 sits at index 1, so `set` needs that index and the new score. Removing the first score uses index 0, which works by index because the argument is an `int`.

- Reads statements with `int`, `boolean`, `String`, `Integer`, `List`/`ArrayList`, `if`, loops and `System.out.println`; list methods `add`, `get`, `set`, `remove`, `size`, `isEmpty`, `contains`, `indexOf` and `clear`. `import` lines are not needed here.
- Other legal wrapper methods outside this bounded subset are Lesson checks, not claims that Java is invalid; Error is reserved for statically primitive receivers or other code javac certainly rejects.
- Exceptions use real JDK exception names; simulator detail messages are explanatory and may differ. This simulator stops after 20000 steps; a real JDK may continue, terminate later or fail for another reason.
- Run is deterministic and bounded: no network, files or arbitrary-code execution.

|  |  |
| --- | --- |
| `List<String> xs = new ArrayList<>();` | empty list |
| `xs.add("a")` / `xs.add(0, "a")` | append / insert |
| `xs.get(i)` / `xs.set(i, "b")` | read / replace |
| `xs.remove(i)` | delete at index i |
| `xs.size()` | number of elements |
| `List<Integer>` | a list of whole numbers |

## Sources

Checked against these current official Java SE 25 pages on 2026-11-07. Each example's output and compiler result was rechecked with OpenJDK 25.

- Java SE 25 API: ArrayList
- Java SE 25 API: List (add, get, set, remove(int) and remove(Object), size)
- Java Language Specification SE 25, 4.5.1: type arguments may be reference types or wildcards
- Java Language Specification SE 25, 5.1.7 and 5.1.8: boxing and unboxing conversion
- Dev.java: Extending Collection with List
- Dev.java: Autoboxing and unboxing

## Static interaction alternatives

### predict

Prediction (practice, not scored): a List<Integer> holds 10, 20 and 30, then nums.remove(1) runs and the list is printed. Options: [10, 30]; [10, 20, 30]; [20, 30]; a compile error. Answer: [10, 30]. With an int argument, remove(1) removes the element at index 1, which is 20, and the later element shifts left.

### explore

List explorer for List<String> names holding Ada, Ben and Cy, with real Java results. names.add("Dee") appends, so the size becomes 4. names.add(0, "Zed") inserts at the front: [Zed, Ada, Ben, Cy], and every other index goes up by one. names.remove(0) deletes the first element and the others shift left. names.set(1, "Bo") replaces the element at index 1 and returns the old one. names.get(3) on a list of size 3 throws java.lang.IndexOutOfBoundsException: Index 3 out of bounds for length 3.

### explore

Typed ArrayList activity. Scores.java runs as the body of main and starts with List<int> scores = new ArrayList<>(); which javac rejects, then five numbered comments: fix the line, add 70, 85 and 90, change 85 to 88 with set, remove the first score, and print the size and then the score at index 0. Done means the list ends as [88, 90] and the code prints 2 and then 88. Run evaluates only a bounded Java subset.

### mcq

Apply question: which should be an ArrayList rather than an array? Options: the 7 day names of a week (fixed count, array); the guests who reply to a party invitation over the next month (correct: the count changes as replies arrive); the 12 monthly sales totals for one year (fixed count, array); the 9 squares of a tic-tac-toe board (fixed count, array). Retry: the best fit for a plain array is the 4 seasons of the year; a playlist, growing search results and a shopping cart all change size.
