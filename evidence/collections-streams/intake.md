# Course intake: Collections & Streams

Course intake for `collections-streams` (calendar technology `coll`, Foundation days F25-F28).
This intake ships the course, module and topic manifests, the F28 assessment blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Topic-string inventory and expected-artifact scope: the frozen P0 coverage matrix v3 rows for course `collections-streams` (15 topic rows, one assessment row, four day rows) and its discrepancy records.
- Contracts: `AGENTS.md`, `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule), `docs/tools/evidence.md`, `docs/tools/components.md`; plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Reference pattern: the course-1 intake (`evidence/git-linux-ai-foundations/intake.md`), without its legacy-label timing basis.

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| F25 | Collections in depth | Concept | `/tracks/0/weeks/4/days/4` | 0. Lists, sets and maps in depth; 1. Stacks and queues; 2. Generics; 3. Reading: wrapper types and autoboxing; 4. Big-O basics |
| F26 | HashMap, equality, sorting | Practice | `/tracks/0/weeks/5/days/0` | 0. The equals and hashCode contract; 1. How HashMap works; 2. Choosing the right collection; 3. Sorting with Comparator |
| F27 | Lambdas and streams | Concept | `/tracks/0/weeks/5/days/1` | 0. Lambdas and functional interfaces in depth; 1. Reading: method references; 2. Streams over data loaded from the database; 3. Grouping with streams and Optional |
| F28 | Collections review and check | Review | `/tracks/0/weeks/5/days/2` | 0. Collections and streams review; 1. Timed coding-screen patterns; 2. Collections module check |

F28 carries the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70), the course-level blueprint below. No day in F25-F28 sets `requiredLab`.
Plan section 2.3 counts 11 core rows, 2 `Reading:` rows and 3 review/other rows; this intake maps them to 11 core, 2 reading and 2 review topics plus the blueprint.
No Standard or Fast Track day carries collections-streams rows; the blueprint is the single course-level module check, referenced by any track overlay rather than duplicated.

## Module map (second-mate grouping decision, not syllabus)

The frozen curriculum gives this course no modules. This intake closes discrepancy `source-gap-collections-streams-modules` with the grouping below, recorded as a second-mate grouping decision and not as syllabus. The grouping follows calendar day sequence and content cohesion; module counts are not inferred from weeks or day types.

| Module | Title | Days | Topics | Planned budget minutes |
|---|---|---|---|---|
| `collections-in-depth` | Collections in Depth | F25, F26 | 9 | 104 |
| `lambdas-and-streams` | Lambdas and Streams | F27, F28 rows 0-1 | 6 | 66 |

Rationale: F25 and F26 both teach the collections themselves (behavior, cost, equality, hashing, choice and ordering), giving one 9-topic batch; F27 moves to functional-style processing, and the F28 review rows close the course after it, giving one 6-topic batch. Both stay within the 4-9 topic batch size. A three-module split (F25 / F26 / F27+F28) was not chosen because F26's equality, hashing and choice topics depend directly on F25's collection behavior and Big-O topics and are authored most consistently in one author context.

## Topic list with relations

Topic ids are the matrix v3 proposed slugs, kept exactly for traceability. Every row maps `exact` to one topic: no row is split or shared, because each calendar row is one focused instructional topic and none combines two separable halves.

| # | Topic | Module | Kind | Pointer | Day | Relation | Calendar row |
|---|---|---|---|---|---|---|---|
| 1 | `lists-sets-and-maps-in-depth` | `collections-in-depth` | core | `/tracks/0/weeks/4/days/4/topics/0` | F25 | exact | Lists, sets and maps in depth |
| 2 | `stacks-and-queues` | `collections-in-depth` | core | `/tracks/0/weeks/4/days/4/topics/1` | F25 | exact | Stacks and queues |
| 3 | `generics` | `collections-in-depth` | core | `/tracks/0/weeks/4/days/4/topics/2` | F25 | exact | Generics |
| 4 | `wrapper-types-and-autoboxing` | `collections-in-depth` | reading | `/tracks/0/weeks/4/days/4/topics/3` | F25 | exact | Reading: wrapper types and autoboxing |
| 5 | `big-o-basics` | `collections-in-depth` | core | `/tracks/0/weeks/4/days/4/topics/4` | F25 | exact | Big-O basics |
| 6 | `the-equals-and-hashcode-contract` | `collections-in-depth` | core | `/tracks/0/weeks/5/days/0/topics/0` | F26 | exact | The equals and hashCode contract |
| 7 | `how-hashmap-works` | `collections-in-depth` | core | `/tracks/0/weeks/5/days/0/topics/1` | F26 | exact | How HashMap works |
| 8 | `choosing-the-right-collection` | `collections-in-depth` | core | `/tracks/0/weeks/5/days/0/topics/2` | F26 | exact | Choosing the right collection |
| 9 | `sorting-with-comparator` | `collections-in-depth` | core | `/tracks/0/weeks/5/days/0/topics/3` | F26 | exact | Sorting with Comparator |
| 10 | `lambdas-and-functional-interfaces-in-depth` | `lambdas-and-streams` | core | `/tracks/0/weeks/5/days/1/topics/0` | F27 | exact | Lambdas and functional interfaces in depth |
| 11 | `method-references` | `lambdas-and-streams` | reading | `/tracks/0/weeks/5/days/1/topics/1` | F27 | exact | Reading: method references |
| 12 | `streams-over-data-loaded-from-the-database` | `lambdas-and-streams` | core | `/tracks/0/weeks/5/days/1/topics/2` | F27 | exact | Streams over data loaded from the database |
| 13 | `grouping-with-streams-and-optional` | `lambdas-and-streams` | core | `/tracks/0/weeks/5/days/1/topics/3` | F27 | exact | Grouping with streams and Optional |
| 14 | `collections-and-streams-review` | `lambdas-and-streams` | review | `/tracks/0/weeks/5/days/2/topics/0` | F28 | exact | Collections and streams review |
| 15 | `timed-coding-screen-patterns` | `lambdas-and-streams` | review | `/tracks/0/weeks/5/days/2/topics/1` | F28 | exact | Timed coding-screen patterns |
| - | (blueprint) `assessments/collections-module-check` | course | assessment | `/tracks/0/weeks/5/days/2/topics/2` | F28 | blueprint | Collections module check |

Boundaries that keep exact rows from overlapping:

- `lists-sets-and-maps-in-depth` teaches how each interface behaves; `choosing-the-right-collection` teaches selecting an implementation from stated needs; `big-o-basics` owns the cost vocabulary both use.
- `the-equals-and-hashcode-contract` owns the contract and its implementation; `how-hashmap-works` owns how HashMap uses it (buckets, load factor, map methods).
- `lambdas-and-functional-interfaces-in-depth` builds on java-foundations' F13 'Functional interfaces and anonymous classes' and F15 'Lambdas as handlers' rows; `method-references` (Reading) covers only the method-reference syntax.
- `streams-over-data-loaded-from-the-database` builds on sql-jdbc-foundations' F23 JDBC rows: it covers loading rows into records and the stream pipeline after loading, not JDBC connection or SQL syntax.
- F28 rows 0-1 are review topics: retrieval and timed practice across both modules, no new syllabus. F28 row 2 maps only to the blueprint and is not a topic.

Prerequisites: `course.json` names the cross-course prerequisites by course id only (`java-foundations`, `sql-jdbc-foundations`), because those courses' topic ids do not exist yet. Topic prerequisites name in-course topics by full reference and other courses by course id.

## Objectives

2-3 observable objectives per topic, with exact ids `o1`-`o3` in each `topic.json`. Each module PR carries them verbatim into the page header, where module critics check them against the page bytes.

- `collections-in-depth/lists-sets-and-maps-in-depth`: o1 Predict the contents and encounter order after given add and put calls on a named implementation (ArrayList, HashSet, LinkedHashSet, TreeSet, HashMap, LinkedHashMap or TreeMap), treating duplicate elements, a duplicate map key (which replaces the value) and duplicate map values (which are kept) separately | o2 Use List, Set and Map methods (add, remove, contains, get, put, getOrDefault, entrySet) on a small data set, and remove elements during iteration with Iterator.remove or removeIf instead of a for-each loop that can throw ConcurrentModificationException | o3 Explain why a collection made with List.of, Set.of or Map.of throws UnsupportedOperationException when modified and rejects null elements
- `collections-in-depth/stacks-and-queues`: o1 Trace push, pop and peek on an ArrayDeque used as a last-in-first-out stack, and offer, poll and peek on one used as a first-in-first-out queue | o2 Distinguish the Queue and Deque methods that throw an exception on an empty deque (remove, element, pop) from those that return null (poll, peek) | o3 Explain why the Java API documentation recommends a Deque such as ArrayDeque over the legacy Stack class
- `collections-in-depth/generics`: o1 Declare and use a generic class and a generic method with a type parameter | o2 Explain how List<String> lets the compiler reject adding a non-String in type-safe generic code and removes the cast when reading, while raw or unchecked code can still fail with a ClassCastException at run time | o3 Choose between List<T>, List<? extends T> and List<? super T> for a method parameter that only reads from or only writes to a list
- `collections-in-depth/wrapper-types-and-autoboxing`: o1 Identify where autoboxing and unboxing happen when primitive values go into and come out of a collection | o2 Predict the result of comparing two Integer objects with == and with equals, and of unboxing a null Integer
- `collections-in-depth/big-o-basics`: o1 Classify common collection operations (ArrayList get by index, contains on a list, HashMap get, TreeMap get) as constant, logarithmic or linear time using the costs the Java API documentation states | o2 Predict how the running time of a constant, linear, n log n or quadratic piece of code grows when the input size doubles | o3 Rewrite a nested-loop lookup as a HashSet or HashMap lookup and state its time complexity before and after
- `collections-in-depth/the-equals-and-hashcode-contract`: o1 State the equals contract (reflexive, symmetric, transitive, consistent, and false for null) and the rule that equal objects must have equal hash codes | o2 Implement equals and hashCode for a value class with Objects.equals and Objects.hash, or use a record that provides them | o3 Diagnose a HashSet or HashMap bug caused by overriding equals without hashCode, or by changing fields that participate in equals and hashCode while the object is stored as a key, and contrast it with changing an unrelated field, which does not break lookup
- `collections-in-depth/how-hashmap-works`: o1 Trace how a HashMap uses a key's hashCode to choose a bucket and equals to find the matching entry in that bucket | o2 Explain how capacity, load factor and resizing keep get and put close to constant time, and why HashMap gives no iteration-order guarantee | o3 Use getOrDefault, merge and computeIfAbsent to count and group values in a map
- `collections-in-depth/choosing-the-right-collection`: o1 Choose a collection implementation from stated needs for duplicates, ordering, lookup by key and access pattern, and justify the choice | o2 Justify ArrayList over LinkedList for indexed access and iteration using the operation costs the Java API documentation states | o3 Pick LinkedHashMap, TreeMap or a sorted list when a result must keep insertion order or sorted order
- `collections-in-depth/sorting-with-comparator`: o1 Sort a list by one or more keys with List.sort and Comparator.comparing, thenComparing and reversed | o2 Distinguish a class's natural ordering (Comparable.compareTo) from a supplied Comparator, and order null values with Comparator.nullsFirst or nullsLast
- `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth`: o1 Write lambdas for Predicate, Function, Consumer and Supplier, and combine them with and, negate and andThen | o2 Explain what makes an interface functional (exactly one abstract method) and what the @FunctionalInterface annotation makes the compiler check | o3 Explain why a lambda can use only effectively final local variables, and fix code that breaks this rule
- `lambdas-and-streams/method-references`: o1 Rewrite a lambda as each kind of method reference: static (Integer::parseInt), bound instance (System.out::println), unbound instance (String::length) and constructor (ArrayList::new) | o2 Decide when a method reference is clearer than the equivalent lambda, and recognize a lambda that cannot become one
- `lambdas-and-streams/streams-over-data-loaded-from-the-database`: o1 Load rows from a JDBC ResultSet into a list of records, then process that list with a stream pipeline of filter, map, sorted and collect | o2 Distinguish lazy intermediate operations from terminal operations, and predict the error when a stream is reused after its terminal operation | o3 Decide whether a given filter or aggregation belongs in the SQL query (WHERE, GROUP BY, HAVING) or in the stream, using the rule: reduce rows in SQL when the program needs only the reduced result; process in the stream when the rows are already loaded for another use or the logic exists only in Java
- `lambdas-and-streams/grouping-with-streams-and-optional`: o1 Group and count stream elements with Collectors.groupingBy, counting and mapping, and predict the shape of the resulting map | o2 Handle the Optional returned by findFirst, max or min with orElse, orElseThrow, map or ifPresent instead of calling get unchecked | o3 Choose Collectors.groupingBy, or Collectors.toMap with a merge function, when stream keys can repeat, instead of a toMap call that throws IllegalStateException on a duplicate key
- `lambdas-and-streams/collections-and-streams-review`: o1 Retrieve, without notes, the collection, operation cost and equality rule that fit a described scenario | o2 Rewrite a loop that filters, transforms and groups data as an equivalent stream pipeline, and rewrite a stream pipeline as a loop | o3 Diagnose a collection or stream bug from its symptom: a missing hashCode, a ConcurrentModificationException, a reused stream or an unchecked Optional.get
- `lambdas-and-streams/timed-coding-screen-patterns`: o1 Recognize which pattern fits a short problem statement: a HashMap frequency count, a HashSet of seen values, an ArrayDeque stack, sort then scan, or two pointers | o2 Solve a short problem inside a time box by restating the inputs and outputs, listing edge cases, then coding and testing the simplest correct version | o3 State a solution's time and space complexity out loud

## Artifact applicability

Rules (plan section 5 and the matrix v3 expected artifacts): core topics require HTML, derived Markdown and a practice GIFT quiz, with a curated video only when a documented search qualifies one; Reading topics also carry a printable PDF; review topics carry HTML and Markdown only; absent companions record a reason. Every required page includes its embedded interactive practice (the matrix `simulator` artifact) inside `artifact.html`.

Legend: **R** required, authored in the module PR; **V** conditional video (authored only if a documented search qualifies a live, public, embeddable, accurate video within budget; otherwise absent with the search record); **L** practised in the module lab; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `collections-in-depth/lists-sets-and-maps-in-depth` | core | R | R | - | R | V | L |
| `collections-in-depth/stacks-and-queues` | core | R | R | - | R | V | L |
| `collections-in-depth/generics` | core | R | R | - | R | V | L |
| `collections-in-depth/wrapper-types-and-autoboxing` | reading | R | R | R | R | V | - |
| `collections-in-depth/big-o-basics` | core | R | R | - | R | V | L |
| `collections-in-depth/the-equals-and-hashcode-contract` | core | R | R | - | R | V | L |
| `collections-in-depth/how-hashmap-works` | core | R | R | - | R | V | L |
| `collections-in-depth/choosing-the-right-collection` | core | R | R | - | R | V | - |
| `collections-in-depth/sorting-with-comparator` | core | R | R | - | R | V | - |
| `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth` | core | R | R | - | R | V | L |
| `lambdas-and-streams/method-references` | reading | R | R | R | R | V | - |
| `lambdas-and-streams/streams-over-data-loaded-from-the-database` | core | R | R | - | R | V | L |
| `lambdas-and-streams/grouping-with-streams-and-optional` | core | R | R | - | R | V | L |
| `lambdas-and-streams/collections-and-streams-review` | review | R | R | - | - | - | - |
| `lambdas-and-streams/timed-coding-screen-patterns` | review | R | R | - | - | - | - |

## Lab plan

No lab uses Docker, Podman, Compose, Testcontainers or any other learner-side container engine. Each lab has exactly one language-native test command, runs offline after a one-time dependency download, and holds only public tests (`docs/lab-contract.md`).

| Lab | Scope | Topics practised | Toolchain | Test command | Planned minutes |
|---|---|---|---|---|---|
| `collections-in-depth/coding-lab` | module | `lists-sets-and-maps-in-depth`, `stacks-and-queues`, `generics`, `big-o-basics`, `the-equals-and-hashcode-contract`, `how-hashmap-works` | JDK (the java-foundations pin; sources frozen for Java SE 25), Maven, JUnit Jupiter with pinned versions | `mvn -q -o test` | 47: about 35 on F25 (lists, stacks and queues, generics, the Big-O lookup rewrite) and 12 on F26 (one equals/hashCode key bug fixed and a merge-based count) |
| `lambdas-and-streams/coding-lab` | module | `lambdas-and-functional-interfaces-in-depth`, `streams-over-data-loaded-from-the-database`, `grouping-with-streams-and-optional` | JDK, Maven, JUnit Jupiter, H2 in-memory database (`jdbc:h2:mem:`) with pinned versions | `mvn -q -o test` | 45 on F27 |

- Setup: one online `mvn -q test` run downloads the pinned dependencies into the learner's local Maven repository; afterwards `mvn -q -o test` runs fully offline. The module PR's `lab.json` declares this setup step and the paths it creates (`target/`).
- Database: the streams lab creates its schema and seed rows in an H2 in-memory database inside the tests and drops it when the JVM exits, so it needs no database server and leaves nothing behind (lab contract section 3: embedded database created and dropped by the lab). It loads rows over JDBC into records, which matches the F27 row while keeping the lab deterministic.
- `choosing-the-right-collection` and `sorting-with-comparator` have no lab exercise: after their honest page budgets F26 leaves 12 lab minutes (see Day-block allocation), which the lab spends on equality and HashMap; they practise in their pages' checks and the F26 'Timed, without AI' platform block.
- Lab minutes are the remainder after honest page budgets, never the other way round: if a module PR measures a higher page budget, that lab part is narrowed by the same amount, and any day that would still exceed 120 minutes is reported as overflow for a pacing decision, never compressed.
- No topic lab and no course lab: the Reading topics (`wrapper-types-and-autoboxing`, `method-references`) and the review topics practise in their pages' own checks; F28's 'Practice without AI' coding-lab block is platform practice. `course.json` `courseLabs` and both `moduleLabs` stay empty until the labs are authored in their module PRs.
- Each lab topic records `lab: "module:<module>"`; all others record `lab: "none"` with a one-line reason for the educational critic to confirm.
- Terminal interaction: the labs run on the learner's own terminal and toolchain. Any in-page terminal simulator reuses `components/terminal` at its declared version, the canonical terminal foundation from the repaired course-1 Evolv package: its non-form direct Run/Enter dispatch is captain-confirmed working in Evolv (platform success, not a captured DOM or console trace) and is not re-derived or redesigned here.
- Solutions and hidden tests never enter the repository; the solved-run record follows lab contract section 10.

## Minute budgets

Rule: the new-course rule in `docs/tools/validators.md` (merged on main): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15 minutes, with no day-pool weighted shares and no compression. The course-1 `legacy-label:` basis does not apply.

Basis at intake: no `artifact.html` exists, so the estimator cannot run. Each value is a planning estimate for the planned page shape, recorded in `minutes.basis`; the module PR re-measures `modeledP50` with the frozen `tools/timing/estimate_reading.py` (sha256 `0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f`) and the worst required route (two wrong graded attempts and wrong-first explores per interactive unit) on the authored bytes, and raises `budget` and `aboutLabel` if the measured minimum is higher. T14 enforces this once the HTML is present.

| Topic | Day | Kind | aboutLabel | budget | planned modeledP50 | planned modeledWorstPath |
|---|---|---|---|---|---|---|
| `lists-sets-and-maps-in-depth` | F25 | core | 12 | 12 | 9 | 12 |
| `stacks-and-queues` | F25 | core | 12 | 12 | 9 | 12 |
| `generics` | F25 | core | 12 | 12 | 9 | 12 |
| `wrapper-types-and-autoboxing` | F25 | reading | 8 | 8 | 6 | 8 |
| `big-o-basics` | F25 | core | 12 | 12 | 9 | 12 |
| `the-equals-and-hashcode-contract` | F26 | core | 12 | 12 | 9 | 12 |
| `how-hashmap-works` | F26 | core | 12 | 12 | 9 | 12 |
| `choosing-the-right-collection` | F26 | core | 12 | 12 | 9 | 12 |
| `sorting-with-comparator` | F26 | core | 12 | 12 | 9 | 12 |
| `lambdas-and-functional-interfaces-in-depth` | F27 | core | 12 | 12 | 9 | 12 |
| `method-references` | F27 | reading | 8 | 8 | 6 | 8 |
| `streams-over-data-loaded-from-the-database` | F27 | core | 12 | 12 | 9 | 12 |
| `grouping-with-streams-and-optional` | F27 | core | 12 | 12 | 9 | 12 |
| `collections-and-streams-review` | F28 | review | 10 | 10 | 8 | 10 |
| `timed-coding-screen-patterns` | F28 | review | 12 | 12 | 9 | 12 |

Day totals against the 120-minute day: F25 (Concept): 56; F26 (Practice): 48; F27 (Concept): 44; F28 (Review): 22. These are topic-page totals only (what T14 sums); the Day-block allocation below adds the module labs and platform blocks and shows every day at or below 120. The F28 blueprint's 45 minutes is the calendar Module check block and is not a topic budget.

## Day-block allocation

Each calendar block is counted once (education-1). Topic budgets include each page's embedded practice and any qualified video; GIFT quizzes fill the Mini-quiz or Quiz block; warm-up, reflection, written and timed-assessment blocks are platform activities outside topic budgets.

| Day | Blocks (minutes) | Topic pages | Module lab | Platform blocks | Total |
|---|---|---|---|---|---|
| F25 Concept | Warm-up 8, Reading 15, Short video 8, Worked example 12, Short exercises 20, Faded then fresh 40, Mini-quiz 7, Reflection 10 | 56: Reading 15 + Short video 8 + Worked example 12 + Short exercises 20 + 1 of Faded then fresh | 35 of Faded then fresh (4 unused) | Warm-up 8, Mini-quiz 7 (topic GIFTs), Reflection 10 | 116 |
| F26 Practice | Warm-up 10, Refresher 5, Exercise ladder 45, AI-assisted extension 10, Timed without AI 30, Quiz 10, Explain your code 10 | 48: Refresher 5 + 43 of Exercise ladder (the pages' graded practice ladder) | 12: 2 of Exercise ladder + AI-assisted extension 10 | Warm-up 10, Timed without AI 30, Quiz 10 (topic GIFTs), Explain your code 10 | 120 |
| F27 Concept | as F25 | 44: Reading 15 + Short video 8 + Worked example 12 + 9 of Short exercises | 45: 11 of Short exercises + 34 of Faded then fresh (6 unused) | Warm-up 8, Mini-quiz 7 (topic GIFTs), Reflection 10 | 114 |
| F28 Review | Cumulative quiz 15, Error-log review 20, Practice without AI 25, Module check 45, Reflection and next-week plan 15 | 22: `collections-and-streams-review` 10 within Error-log review; `timed-coding-screen-patterns` 12 within Practice without AI | none | Cumulative quiz 15, the remaining 10 of Error-log review and 13 of Practice without AI, Module check 45 (blueprint), Reflection 15 | 120 |

No day exceeds its 120-minute template. F26 is full: any measured page-budget increase there is taken from the 12 lab minutes first and then reported as overflow.

## F28 assessment blueprint

`collections-streams/assessments/collections-module-check/blueprint.json`:

- Calendar identity copied verbatim from the snapshot F28 `assessment`: `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores, so `weights` is empty. The id follows the F28 row 'Collections module check'.
- Duration: 45 minutes, the F28 Review day 'Module check' block (MCQ + coding assessment, 45 minutes).
- Proposed item counts within that block: MCQ 15 items in 15 minutes (about 1 minute per scenario item, as in course 1); coding 2 short Java tasks in 30 minutes (about 15 minutes each). 15 + 30 = 45.
- Objectives covered: a representative subset across both modules that the 17 items can directly elicit; `objectiveFormats` maps each to the one format that checks it. Review-topic objectives are excluded because they retrieve the instructional objectives listed here.
- Coding task mapping (education-2), stated in the learner instructions: Task 1 (about 15 minutes) writes equals and hashCode for a small value class (`the-equals-and-hashcode-contract#o2`) and uses it as a HashMap key to count with merge or getOrDefault (`how-hashmap-works#o3`); Task 2 (about 15 minutes) sorts records by two keys with a Comparator (`sorting-with-comparator#o1`) and groups them with a collector (`grouping-with-streams-and-optional#o1`) where keys repeat (`grouping-with-streams-and-optional#o3`). `big-o-basics#o3` (nested-loop rewrite with before/after complexity) is not in the blueprint, because neither task elicits it within its time; `big-o-basics#o1` stays covered by MCQ and o3 is practised in the module lab.

  - `collections-streams/collections-in-depth/lists-sets-and-maps-in-depth#o1` (MCQ)
  - `collections-streams/collections-in-depth/stacks-and-queues#o2` (MCQ)
  - `collections-streams/collections-in-depth/generics#o3` (MCQ)
  - `collections-streams/collections-in-depth/wrapper-types-and-autoboxing#o2` (MCQ)
  - `collections-streams/collections-in-depth/big-o-basics#o1` (MCQ)
  - `collections-streams/collections-in-depth/the-equals-and-hashcode-contract#o1` (MCQ)
  - `collections-streams/collections-in-depth/how-hashmap-works#o2` (MCQ)
  - `collections-streams/collections-in-depth/choosing-the-right-collection#o1` (MCQ)
  - `collections-streams/collections-in-depth/sorting-with-comparator#o2` (MCQ)
  - `collections-streams/lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o2` (MCQ)
  - `collections-streams/lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o3` (MCQ)
  - `collections-streams/lambdas-and-streams/method-references#o1` (MCQ)
  - `collections-streams/lambdas-and-streams/streams-over-data-loaded-from-the-database#o2` (MCQ)
  - `collections-streams/lambdas-and-streams/streams-over-data-loaded-from-the-database#o3` (MCQ)
  - `collections-streams/lambdas-and-streams/grouping-with-streams-and-optional#o2` (MCQ)
  - `collections-streams/collections-in-depth/the-equals-and-hashcode-contract#o2` (coding)
  - `collections-streams/collections-in-depth/how-hashmap-works#o3` (coding)
  - `collections-streams/collections-in-depth/sorting-with-comparator#o1` (coding)
  - `collections-streams/lambdas-and-streams/grouping-with-streams-and-optional#o1` (coding)
  - `collections-streams/lambdas-and-streams/grouping-with-streams-and-optional#o3` (coding)

- Allowed resources: the calendar states no AI or resource rule for the F28 Module check block, so none is invented; the platform assessment owner sets and shows the rule for each part. The coding part uses the platform coding environment with a Java JDK at the java-foundations pin.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its objective references and key names.

## Official sources per topic

This intake closes discrepancy `source-gap-collections-streams-official-evidence`. Every source below was fetched live on 2026-10-12; `evidence/collections-streams/source-snapshot.json` records each URL with retrieval time, the sha256 of the fetched bytes and the sections used. All 78 URLs returned HTTP 200, and each section name was checked against the fetched page title or text. Sources are first-party: Oracle Java SE 25 API documentation and Java Language Specification SE 25, Oracle's dev.java tutorials and JDBC tutorial, PostgreSQL 18 documentation (version-pinned, for the SQL side of the filter-or-aggregate decision, SME-004), and the Apache Maven, JUnit and H2 project documentation for the lab toolchain. Java SE 25 is the current LTS release; Java SE 26 and 27 documentation also exists, and the module PRs align to java-foundations' JDK pin.

| Topic | Official sources |
|---|---|
| `lists-sets-and-maps-in-depth` | https://dev.java/learn/api/collections-and-streams/collections-framework/intro/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/organization/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/collection-interface/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/lists/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/sets/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/maps/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/iterating/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/factory-methods/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Set.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ConcurrentModificationException.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Iterator.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Collection.html |
| `stacks-and-queues` | https://dev.java/learn/api/collections-and-streams/collections-framework/stacks-queues/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Queue.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Deque.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Stack.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html |
| `generics` | https://dev.java/learn/language/fp/generics/intro/<br>https://dev.java/learn/language/fp/generics/wildcards/<br>https://dev.java/learn/language/fp/generics/type-erasure/<br>https://dev.java/learn/language/fp/generics/type-inference/<br>https://dev.java/learn/language/fp/generics/restrictions/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html |
| `wrapper-types-and-autoboxing` | https://dev.java/learn/language/fp/generics/restrictions/<br>https://dev.java/learn/language/constructs/numbers-strings/autoboxing/<br>https://dev.java/learn/language/constructs/numbers-strings/numbers/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Integer.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html |
| `big-o-basics` | https://dev.java/learn/api/collections-and-streams/collections-framework/arraylist-vs-linkedlist/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayList.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedList.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html |
| `the-equals-and-hashcode-contract` | https://dev.java/learn/api/collections-and-streams/collections-framework/choosing-keys/<br>https://dev.java/learn/language/oop/inheritance/objects/<br>https://dev.java/learn/language/oop/records/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html |
| `how-hashmap-works` | https://dev.java/learn/api/collections-and-streams/collections-framework/choosing-keys/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/working-with-keys-and-values/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/maps-and-lambdas/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Map.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html |
| `choosing-the-right-collection` | https://dev.java/learn/api/collections-and-streams/collections-framework/organization/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/sets/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/arraylist-vs-linkedlist/<br>https://dev.java/learn/api/collections-and-streams/collections-framework/sorted-maps/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/doc-files/coll-overview.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayList.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedList.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedHashMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html |
| `sorting-with-comparator` | https://dev.java/learn/language/fp/lambdas/writing-comparators/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Comparator.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Comparable.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Collections.html |
| `lambdas-and-functional-interfaces-in-depth` | https://dev.java/learn/language/fp/lambdas/first-lambdas/<br>https://dev.java/learn/language/fp/lambdas/functional-interfaces/<br>https://dev.java/learn/language/fp/lambdas/combining-chaining-composing/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/FunctionalInterface.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/package-summary.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html |
| `method-references` | https://dev.java/learn/language/fp/lambdas/method-references/<br>https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html |
| `streams-over-data-loaded-from-the-database` | https://dev.java/learn/api/collections-and-streams/streams/creating/<br>https://dev.java/learn/api/collections-and-streams/streams/map-filter-reduce/<br>https://dev.java/learn/api/collections-and-streams/streams/intermediate-operation/<br>https://dev.java/learn/api/collections-and-streams/streams/terminal-operations/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/ResultSet.html<br>https://docs.oracle.com/javase/tutorial/jdbc/basics/retrieving.html<br>https://www.postgresql.org/docs/18/queries-table-expressions.html<br>https://www.postgresql.org/docs/18/tutorial-agg.html |
| `grouping-with-streams-and-optional` | https://dev.java/learn/api/collections-and-streams/streams/terminal-operations/<br>https://dev.java/learn/api/collections-and-streams/streams/using-collectors/<br>https://dev.java/learn/api/collections-and-streams/streams/optionals/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Collectors.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html |
| `collections-and-streams-review` | https://dev.java/learn/api/collections-and-streams/collections-framework/iterating/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ConcurrentModificationException.html |
| `timed-coding-screen-patterns` | https://dev.java/learn/api/collections-and-streams/collections-framework/maps-and-lambdas/<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html<br>https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html |
| lab plan | https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html<br>https://maven.apache.org/surefire/maven-surefire-plugin/<br>https://maven.apache.org/ref/current/maven-embedder/cli.html<br>https://docs.junit.org/current/user-guide/<br>https://h2database.com/html/features.html |

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; module SME criticism verifies the authored bytes against these frozen sources and per-topic `sources.json` receipts (T15) are created in the module PRs.

## Gaps and unverified items

No source was unreachable. Recorded as unverified rather than claimed:

- JDK version: sources are frozen for Java SE 25; java-foundations has not pinned its JDK in this repository yet. If it differs, the module PR re-freezes version-specific sources.
- `how-hashmap-works`: bucket internals beyond the HashMap API documentation (hash spreading, tree bins) are OpenJDK implementation details, not Java SE specification; pages label them as such or omit them.
- `big-o-basics`: the API documentation states operation costs only for some implementations; any other cost on a page is derived and labeled.
- `timed-coding-screen-patterns`: no first-party source defines a catalogue of coding-screen patterns; the pattern names are course pedagogy, and each Java API used is grounded in the frozen API sources.
- `streams-over-data-loaded-from-the-database` o3 bounded rule (SME-004): reduce rows in SQL (WHERE, GROUP BY, HAVING; PostgreSQL 18 sections 7.2 and 2.7) when the program needs only the reduced result, for example a count per category for a report; process in the stream when the rows are already loaded for another use or the logic exists only in Java, for example grouping loaded records by a computed Java value. The page states no blanket performance claim.
- Lab toolchain versions (Maven plugins, JUnit Jupiter, H2) are pinned and verified in the module PRs; the JUnit user guide currently resolves to JUnit 6.1.3, which requires Java 17 or higher.

## Category-A discrepancy closure

- `source-gap-collections-streams-modules`: closed by the module map above, a second-mate grouping decision recorded as not syllabus.
- `source-gap-collections-streams-official-evidence`: closed by the live first-party source freeze in `source-snapshot.json` (78 sources with retrieval times and sha256 hashes).

## Intake criticism

Fresh independent educational and technology-SME critics reviewed the first intake commit (`321b574`); the non-author reconciliation accepted all eight findings. Their reports and the reconciliation are committed verbatim as course-level evidence (`intake-critic-education.json`, `intake-critic-sme.json`, `intake-reconciliation.json`), with `file` and `fixedInSha256` added to each reconciliation decision for the corrected bytes. Applied in one correction loop:

- education-1: lab minutes and the Day-block allocation above; `choosing-the-right-collection` and `sorting-with-comparator` lab set to none.
- education-2: explicit coding task mapping; `big-o-basics#o3` removed from the blueprint.
- education-3 and SME-003: `lists-sets-and-maps-in-depth#o1` names the implementations and separates duplicate elements, duplicate keys and duplicate values from encounter order.
- education-4: `lists-sets-and-maps-in-depth#o2` teaches removal during iteration (Iterator.remove, removeIf) and ConcurrentModificationException before the F28 review diagnoses it.
- SME-001: `generics#o2` narrowed to type-safe code, with the raw and unchecked run-time qualification.
- SME-002: `the-equals-and-hashcode-contract#o3` names fields that participate in equals and hashCode, contrasted with an unrelated field.
- SME-004: PostgreSQL 18 sources added to the snapshot and the bounded decision rule recorded in `streams-over-data-loaded-from-the-database#o3` and above.
