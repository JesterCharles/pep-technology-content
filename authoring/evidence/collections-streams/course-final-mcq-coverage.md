# Collections & Streams: Course Review and final MCQ coverage plan

Recorded 2026-11-09 on branch `fm/pep-course-ending-collections`; carried to the successor branch `fm/pep-collections-final-successor` on 2026-11-12 with the replacement-candidate records in section 9.

This record is value-free.
It holds no question stem, answer option, correct answer, feedback, key, scoring rule or other protected exam value.
This record never carries those values. The one committed graded bank is the delivered file named in section 9.1, under the captain-approved exception in `authoring/AGENTS.md`, "Never commit".

## 1. Ownership

| Part | Owner | State |
| --- | --- | --- |
| Course Review structure, the review scenario page, the final MCQ blueprint and this coverage plan | Implementation owner of branches `fm/pep-course-ending-collections` and `fm/pep-collections-final-successor`, for the course owner `JesterCharles` (`authoring/catalog/collections-streams/course.json` `owners`) | Committed on this branch |
| Graded final MCQ values: the 30 question stems, options, correct answers, feedback and scoring | One author only: task `pep-course-ending-collections`, for the course owner `JesterCharles`, through the approved private-authoring route | Authored outside Git on 2026-11-09 and delivered by PR 92; a private replacement candidate exists (section 9.2) |

No other task authors these graded items.
Lab and coding-practice work must not create a second exam for this course.

## 2. Taught-topic inventory

The course has 15 canonical topics (part of the 243 canonical-topic count), on Foundation days F25 to F28. In this record, "taught topics" means these 15 topics, the set the final MCQ covers, and includes the two review topics.
The Source day column gives the curriculum row a topic comes from. The day a learner takes it is in `course-schedule.md` section 3.
Collections & Streams is taught in Foundation only.

| # | Module | Topic id | Title | Kind | Source day | Course ending decision |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | collections-in-depth | `lists-sets-and-maps-in-depth` | Lists, sets and maps in depth | core | F25 | Taught |
| 2 | collections-in-depth | `stacks-and-queues` | Stacks and queues | core | F25 | Taught |
| 3 | collections-in-depth | `generics` | Generics | core | F25 | Taught |
| 4 | collections-in-depth | `wrapper-types-and-autoboxing` | Wrapper types and autoboxing | reading | F25 | Taught |
| 5 | collections-in-depth | `big-o-basics` | Big-O basics | core | F25 | Taught |
| 6 | collections-in-depth | `the-equals-and-hashcode-contract` | The equals and hashCode contract | core | F26 | Taught |
| 7 | collections-in-depth | `how-hashmap-works` | How HashMap works | core | F26 | Taught |
| 8 | collections-in-depth | `choosing-the-right-collection` | Choosing the right collection | core | F26 | Taught |
| 9 | collections-in-depth | `sorting-with-comparator` | Sorting with Comparator | core | F26 | Taught |
| 10 | lambdas-and-streams | `lambdas-and-functional-interfaces-in-depth` | Lambdas and functional interfaces in depth | core | F27 | Taught |
| 11 | lambdas-and-streams | `method-references` | Method references | reading | F27 | Taught |
| 12 | lambdas-and-streams | `streams-over-data-loaded-from-the-database` | Streams over data loaded from the database | core | F27 | Taught |
| 13 | lambdas-and-streams | `grouping-with-streams-and-optional` | Grouping with streams and Optional | core | F27 | Taught |
| 14 | lambdas-and-streams | `timed-coding-screen-patterns` | Timed coding-screen patterns | review | F28 | Review topic: it practises interview-screen patterns taught earlier and stays in its module, ordered before Course Review |
| 15 | lambdas-and-streams | `collections-and-streams-review` | Review: collections and streams | review | F28 | Regrouped into Course Review as activity 1, by placement only |

Mixed teaching and review modules:

- `collections-in-depth` has no review topic.
- `lambdas-and-streams` is mixed. Its cumulative review topic `collections-and-streams-review` is the course's existing review page, so it opens Course Review. It keeps its canonical id, source path `collections-streams/lambdas-and-streams/collections-and-streams-review/`, URL, content and count; it is not rewritten, moved or duplicated. The module's `topicOrder` now lists it last, so it directly precedes the Course Review module.

New review asset, reported separately from the 243 canonical topics:

- `collections-streams/course-review/collections-and-streams-review-scenarios` ("Review scenarios: collections and streams", 14 minutes). It shares F28 row 0 "Collections and streams review" with the existing review topic. Its three activities use new cross-topic scenarios that the existing review page does not use: choosing structures for one feature under competing order and lookup-cost needs; predicting grouped and Optional results over loaded rows; and choosing the merge rule that fixes a `toMap` collector failing on a repeated key. It adds one small API detail, which it teaches itself before use: the three-argument `groupingBy` whose middle argument is a map factory, usually written as a constructor reference.

## 3. Learner-safe final structure

The course ends in this order:

1. Taught material: `collections-in-depth`, then `lambdas-and-streams` through `timed-coding-screen-patterns`.
2. The separate practical: the coding tasks (Part 2) of `collections-streams/assessments/collections-module-check`, run as the 90-minute practical of the accepted course time plan (section 7). The legacy blueprint's 30-minute Part 2 timing is superseded.
3. **Course Review** (the exact learner-facing label):
   1. "Review: collections and streams" (`lambdas-and-streams/collections-and-streams-review`, existing, regrouped).
   2. "Review scenarios: collections and streams" (`course-review/collections-and-streams-review-scenarios`, new).
   3. "Final MCQ: collections and streams" (`collections-streams/assessments/collections-streams-final-mcq`): the course's one graded cumulative MCQ. Its delivered bank file is `collections-streams/assessments/collections-module-check/final-mcq.gift` (section 9.1).

The repository expresses this with the `course-review` module titled "Course Review", appended to `course.json` `moduleOrder`, and with the final MCQ blueprint appended to `course.json` `assessments`.

The legacy blueprint `collections-module-check` stays unchanged as evidence and as the source of the practical's coding tasks. Its file still records the intake's 45-minute F28 split: Part 1 is 15 MCQ in 15 minutes and Part 2 is coding in 30 minutes. That split is superseded by the accepted course time plan, which records the course final as a 90-minute practical plus a 40-minute MCQ (section 7).
`collections-streams-final-mcq` replaces that 40-minute MCQ component as the cumulative final, with 30 questions in 60 minutes.
It is not a second exam, and learners see one final MCQ.

## 4. Value-free coverage map

Every question is new and harder than the topic practice banks.
Each one uses an unseen applied context and needs at least two reasoning steps: tracing, debugging from a symptom, predicting a data transformation, or choosing a design with a justification.
Nothing needs material the course does not teach; code uses only APIs the course pages show.

Each item has exactly one primary objective, which is the objective its result is reported against, and at most one secondary objective that shapes its context.
Every taught topic is the primary topic of exactly two items, and no primary objective repeats.
The table is in the intended delivery order: cognitive level rises from Apply (9 items: trace or predict one behavior) through Analyze (15 items: diagnose a cause, separate two cases or compare near-miss alternatives) to Evaluate (6 items: choose and defend under competing needs).
Six items are cross-topic (q02, q07, q10, q14, q23, q30); all but q02 sit in the Analyze and Evaluate levels.
Planned ids q01 to q15 keep the ids of the first plan; q16 to q30 were added when the count rose to 30 (section 7).

| Planned id | Level | Scope | Form | Primary objective (prefix `collections-streams/`) | Secondary objective | Planned context (no values) |
| --- | --- | --- | --- | --- | --- | --- |
| `cs-final-q01` | Apply | single-topic | Tracing | `collections-in-depth/stacks-and-queues#o1` | `collections-in-depth/stacks-and-queues#o2` | Interleaved stack and queue calls on one deque, ending at an empty-deque boundary |
| `cs-final-q02` | Apply | cross-topic | Tracing | `collections-in-depth/lists-sets-and-maps-in-depth#o1` | `collections-in-depth/choosing-the-right-collection#o3` | Mixed put calls on two map implementations with different order guarantees, including a repeated key |
| `cs-final-q19` | Apply | single-topic | Tracing | `collections-in-depth/wrapper-types-and-autoboxing#o1` | - | Put, get and getOrDefault calls on a map with wrapper values; locate each boxing and unboxing, then predict how the code ends |
| `cs-final-q03` | Apply | single-topic | Tracing | `collections-in-depth/how-hashmap-works#o1` | `collections-in-depth/how-hashmap-works#o2` | Follow one lookup through hash code and key comparison, then judge a claim about iteration order |
| `cs-final-q04` | Apply | single-topic | Data transformation | `collections-in-depth/sorting-with-comparator#o1` | `collections-in-depth/sorting-with-comparator#o2` | Predict the order a multi-key comparator chain with a reversed key and missing values produces |
| `cs-final-q25` | Apply | single-topic | Tracing | `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o1` | - | Predict the output of composed consumer and predicate pieces |
| `cs-final-q05` | Apply | single-topic | Data transformation | `lambdas-and-streams/grouping-with-streams-and-optional#o1` | `lambdas-and-streams/grouping-with-streams-and-optional#o3` | Predict the shape and values of grouped results where keys repeat |
| `cs-final-q29` | Apply | single-topic | Applied | `lambdas-and-streams/timed-coding-screen-patterns#o3` | `lambdas-and-streams/timed-coding-screen-patterns#o1` | Recognize the time complexity of a two-pass frequency-count solution to a most-frequent-item problem (the MCQ measures recognizing the complexity, not saying it aloud) |
| `cs-final-q20` | Apply | single-topic | Applied | `collections-in-depth/big-o-basics#o2` | `collections-in-depth/big-o-basics#o1` | Predict the running time of an indexed loop over a linked list when the list doubles, from the cost of reaching an index, which the big-o page derives from the documented walk from the nearer end |
| `cs-final-q06` | Analyze | single-topic | Applied | `collections-in-depth/generics#o3` | `collections-in-depth/generics#o2` | Choose a utility method's parameter types from how it uses each list, and separate compile-time from run-time failure |
| `cs-final-q18` | Analyze | single-topic | Tracing | `collections-in-depth/generics#o2` | `collections-in-depth/generics#o1` | A typed list is polluted through a raw alias and then passed to a generic method; decide what the compiler infers and whether and where the code fails |
| `cs-final-q07` | Analyze | cross-topic | Debugging | `collections-in-depth/wrapper-types-and-autoboxing#o2` | `collections-in-depth/how-hashmap-works#o3` | A check that compares two counts from a counting map behaves differently on a large log than on a small test; choose the cause and the repair |
| `cs-final-q08` | Analyze | single-topic | Debugging | `collections-in-depth/the-equals-and-hashcode-contract#o3` | `collections-in-depth/the-equals-and-hashcode-contract#o1` | A stored key is changed in two ways; separate a contract break from a harmless change |
| `cs-final-q21` | Analyze | single-topic | Debugging | `collections-in-depth/the-equals-and-hashcode-contract#o1` | `collections-in-depth/the-equals-and-hashcode-contract#o2` | A case-insensitive value class lets equal values coexist in a hash set; name the broken rule and the repair that keeps the requirement |
| `cs-final-q09` | Analyze | single-topic | Debugging | `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o3` | `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o1` | A composed condition does not compile because of a captured variable; choose the repair and read the composed result |
| `cs-final-q10` | Analyze | cross-topic | Applied | `lambdas-and-streams/method-references#o1` | `lambdas-and-streams/lambdas-and-functional-interfaces-in-depth#o2` | Decide which lambdas in a short pipeline can become which kind of method reference, and which interface a lambda can target |
| `cs-final-q26` | Analyze | single-topic | Applied | `lambdas-and-streams/method-references#o2` | `lambdas-and-streams/method-references#o1` | Recognize the one lambda in a clean-up that cannot become a method reference, and classify the kind of reference each other lambda becomes |
| `cs-final-q16` | Analyze | single-topic | Debugging | `collections-in-depth/stacks-and-queues#o2` | `collections-in-depth/stacks-and-queues#o3` | A worker that drains a deque used as a stack crashes when the work runs out; choose the change that stops it cleanly |
| `cs-final-q17` | Analyze | single-topic | Applied | `collections-in-depth/lists-sets-and-maps-in-depth#o2` | `collections-in-depth/lists-sets-and-maps-in-depth#o3` | A clean-up job must remove matching records from the same list while it scans it; choose the safe version, then predict what happens when a test passes an unmodifiable factory list |
| `cs-final-q22` | Analyze | single-topic | Debugging | `collections-in-depth/how-hashmap-works#o3` | - | A loop that groups values into a map of lists leaves the map wrong; predict the result and choose the repair |
| `cs-final-q24` | Analyze | single-topic | Applied | `collections-in-depth/sorting-with-comparator#o2` | `collections-in-depth/sorting-with-comparator#o1` | Sort records that define a natural order when one entry is missing, and predict the resulting order |
| `cs-final-q11` | Analyze | single-topic | Tracing | `lambdas-and-streams/streams-over-data-loaded-from-the-database#o2` | `lambdas-and-streams/streams-over-data-loaded-from-the-database#o3` | Rows already loaded with JDBC: one decision about when a pipeline runs or fails, in a context that also states where the reduction happens |
| `cs-final-q28` | Analyze | single-topic | Data transformation | `lambdas-and-streams/grouping-with-streams-and-optional#o3` | `lambdas-and-streams/grouping-with-streams-and-optional#o1` | Choose the collector that keeps every value for keys that repeat |
| `cs-final-q30` | Analyze | cross-topic | Applied | `lambdas-and-streams/collections-and-streams-review#o2` | `lambdas-and-streams/streams-over-data-loaded-from-the-database#o1` | Choose the stream pipeline that is equivalent to a loop that filters, transforms and sorts loaded records, among near-miss pipelines |
| `cs-final-q12` | Evaluate | single-topic | Applied | `collections-in-depth/big-o-basics#o3` | `collections-in-depth/big-o-basics#o2` | Judge the cost before and after replacing a nested matching loop with a keyed lookup, and the growth when the inputs double |
| `cs-final-q13` | Evaluate | single-topic | Design choice | `collections-in-depth/choosing-the-right-collection#o1` | `collections-in-depth/choosing-the-right-collection#o2` | Choose an implementation for competing stated needs and defend it with documented operation costs |
| `cs-final-q23` | Evaluate | cross-topic | Design choice | `collections-in-depth/choosing-the-right-collection#o3` | `collections-in-depth/sorting-with-comparator#o1` | A ranked board loses entries that tie; choose the structure and ordering that keep all of them |
| `cs-final-q14` | Evaluate | cross-topic | Debugging | `lambdas-and-streams/collections-and-streams-review#o3` | `lambdas-and-streams/grouping-with-streams-and-optional#o2` | Diagnose a report that fails only on an empty result, from its symptom, and choose the safe Optional handling |
| `cs-final-q27` | Evaluate | single-topic | Design choice | `lambdas-and-streams/streams-over-data-loaded-from-the-database#o3` | `lambdas-and-streams/streams-over-data-loaded-from-the-database#o1` | Two screens with different data needs: decide where each reduction happens |
| `cs-final-q15` | Evaluate | single-topic | Pattern choice | `lambdas-and-streams/timed-coding-screen-patterns#o1` | `lambdas-and-streams/timed-coding-screen-patterns#o3` | Match a short interview problem to its pattern and state the cost of the matching solution |

The blueprint's `objectives` and `objectiveFormats` list exactly these 40 primary and secondary objectives.

## 5. Topic coverage check

| # | Topic id | Primary in | Secondary in |
| --- | --- | --- | --- |
| 1 | `lists-sets-and-maps-in-depth` | q02, q17 | - |
| 2 | `stacks-and-queues` | q01, q16 | - |
| 3 | `generics` | q06, q18 | - |
| 4 | `wrapper-types-and-autoboxing` | q07, q19 | - |
| 5 | `big-o-basics` | q12, q20 | - |
| 6 | `the-equals-and-hashcode-contract` | q08, q21 | - |
| 7 | `how-hashmap-works` | q03, q22 | q07 |
| 8 | `choosing-the-right-collection` | q13, q23 | q02 |
| 9 | `sorting-with-comparator` | q04, q24 | q23 |
| 10 | `lambdas-and-functional-interfaces-in-depth` | q09, q25 | q10 |
| 11 | `method-references` | q10, q26 | - |
| 12 | `streams-over-data-loaded-from-the-database` | q11, q27 | q30 |
| 13 | `grouping-with-streams-and-optional` | q05, q28 | q14 |
| 14 | `timed-coding-screen-patterns` | q15, q29 | - |
| 15 | `collections-and-streams-review` | q14, q30 | - |

All 15 taught topics map to planned questions, each as the primary topic of exactly two items.

Objective reach, counted against the 42 objectives of the 15 taught topics:

- 30 objectives are primaries: each is the objective one item's result is reported against.
- 10 more appear only as secondaries. They shape an item's context, but no result is reported against them.
- 2 are not targeted (table below).
- The catalog holds 45 objectives for this course. The other 3 belong to the new review scenario page (`course-review/collections-and-streams-review-scenarios`). That page is retrieval practice that adds one small API detail and teaches it itself, so the final MCQ does not assess them.

| Objective | Reason not targeted |
| --- | --- |
| `lambdas-and-streams/timed-coding-screen-patterns#o2` | Solving inside a time box is a performance skill, better assessed by performance than by MCQ. It is practised on its own review page, which is scheduled after the practical (`course-schedule.md` section 3), and it is not assessed by either final; the practical blueprint maps no objective of this topic. |
| `lambdas-and-streams/collections-and-streams-review#o1` | It asks for retrieval "without notes", but the blueprint lets the platform allow notes, so an item could not measure it as written. The review page practises it. |

## 6. Differentiation from existing questions

The private author must write every stem in a new context and check it against these existing questions, so none is reused or lightly reworded:

- every topic practice bank `collections-streams/<module>/<topic>/artifact.gift` (13 banks);
- the checks on both Course Review pages and on `timed-coding-screen-patterns`;
- the coding tasks of the legacy `collections-module-check`.

Known close shapes to avoid:

- q13 must not reuse the help-desk needs (undo, waiting line with an id check, sorted report) of the review scenario page's Activity 1, or the choosing-the-right-collection practice scenarios.
- q07 must not repeat the wrapper-types bank item on unboxing a missing value, or coding Task 1 (counting with `merge` or `getOrDefault`).
- q04 and q05 must not repeat coding Task 2 (sort records by two keys, then group where keys repeat), the grouping topic's per-customer total, or the scenario page's Activity 2 and 3 pipelines.
- q14 must not repeat the existing review page's `findFirst().get()` symptom item.
- q12 and q20 must not repeat the big-o bank's hidden-loop item (a `contains` loop over an `ArrayList`), and q20 must not repeat the choosing page's indexed-read activities, which compare `get(i)` costs; q20 keys only the effect of doubling. q29 must not repeat the big-o bank's repeated-value check with a set.
- q15 and q29 must not reuse the problems the timed-coding page practises (closing brackets, a pair that sums to a target in a sorted array).
- q21 must not reuse the equals page's class that overrides `equals` without `hashCode`.
- q28 must not repeat the scenario page's merge-function choice for the longest ticket.
- Checked sources also include every topic page's in-page activities and checks, not only the topic banks.
- Where an item tests the same mechanism with the same decision as an existing bank item or page activity, it must add a second reasoning step. Matching shapes and their second steps:
  - q08 matches the equals page's stored-key activity; it adds the harmless-change contrast and the repair.
  - q09 matches the lambdas bank's reassigned-local items; it adds reading the composed predicate.
  - q16 matches the stacks bank's empty-deque items; it adds the draining loop and the Deque-over-Stack reason.
  - q18 matches the generics bank's unchecked-code item; it adds the inferred type argument.
  - q24 matches the sorting bank's null item and the page's sign-up sheet; it adds predicting the natural order.
  - q25 matches the lambdas bank's andThen and negate items; it combines both in one loop.
  - q26 matches the method-references bank's cannot-become-one items; it adds classifying the other three.
  - q28 matches the grouping bank's duplicate-key items; it asks for the result shape, with visible value loss in the merge option.
- q20 must not use a nested pairwise loop (big-o Activity 1 and the page's prediction check), a single-operation cost listing (Activity 3, the page's sorting activity) or a one-pass loop of sorted-map lookups (Version B of the page's final check). Its growth comes from the cost of one named collection operation, derived from that operation's documented traversal, and the stem says which size doubles.
- q17 matches the lists page's removal activity and the lists bank's removing-while-scanning item; it uses a new record context, includes a stream option that does not change the list, and adds the unmodifiable-fixture step.
- q19 matches the wrapper bank's spotting-unboxing item and its unboxing-null item; it places the throw prediction inside a trace of five map calls, so the learner must separate the line that only stores null from the line that unboxes it.
- q30 matches the review page's loop-and-pipeline translation activity, which is a writing task; q30 instead compares near-miss pipelines that differ in one step each.
- q29 must not reuse the big-o page's repeated-value editor or q15's problem.

## 7. Time and envelope fit

- Captain's timing decision (2026-11-09, final): at most 45 questions per course, 2 minutes allotted per question; 30 questions in 60 minutes is acceptable when it better fits full applied all-topic coverage, and 45 questions receive 90 minutes. The count is chosen from coverage, with no invented minimum and no timer on single questions.
- Chosen count: 30 questions, 60 minutes. Two primary items per taught topic is a design choice within the captain's options. It weights every topic equally and tests each in two different contexts.
- The alternative considered was 40 items in 80 minutes, which would also report the 10 secondary-only objectives. It was not chosen because those 10 objectives belong to 10 different topics, so adding them as primaries would weight those 10 topics 3:2 over the other 5, while the 30-item set already reaches 40 of 42 taught-topic objectives. The course owner may still ask for the larger set within the 45-question cap.
- Every code snippet is 12 lines or fewer, and every item has at most two objectives.
- F28 delivery follows the approved schedule in `course-schedule.md` (section 3). The Cumulative quiz block holds the topic-quiz practice for seven topics (13.5 minutes). The day then runs `timed-coding-screen-patterns` 15, then Course Review: `collections-and-streams-review` 14, the new scenario page 14 and the final MCQ 60, last. Gate T14 checks topic budgets only, not assessment time.
- Time record, corrected on 2026-11-09 against the accepted course time plan (`data/pep-labs-course-assessments-design/time-budget-recommendation.md`, kept outside this repository). Collections/Streams has a 480-minute Foundation envelope:
  - 225 minutes of content and topic practice;
  - 2 labs at 30 minutes each, so 60;
  - 2 mastery checks at 15 minutes each, so 30;
  - the course final, 130 minutes: a 90-minute practical plus a 40-minute MCQ;
  - 35 minutes of reserve.
- An earlier version of this record called the practical 30 minutes; that figure was wrong. The 45 minutes in the legacy `collections-module-check` blueprint is the intake's F28 calendar block, not the accepted final duration.
- With the captain-set 60-minute final MCQ, the two course-final assessments total 150 minutes: the 90-minute practical and the 60-minute MCQ. They are separate assessments, not one sitting. The course total becomes 465 of its 480 minutes, using 20 of the 35 reserve minutes. Coverage, course hours, the practical's duration and the 45-minute module-check block are unchanged.
- Placement: **resolved** by the captain's approval of option A (2026-11-09), recorded in `course-schedule.md`.
  - Later teaching moves to earlier days in prerequisite order: 73 minutes, from source days F26 and F27.
  - Seven topic quizzes take F28's existing Cumulative quiz block.
  - Both mastery checks come before the practical. The practical is its own 90-minute sitting on F27, before Course Review. The final MCQ is the last Course Review activity on F28.
  - The days carry 116.5, 116, 116 and 116.5 minutes: 465 required, 15 unused reserve, 480 in all.
- The schedule supersedes the intake's day-block allocation (`intake.md`, Day-block allocation: 470 minutes with only the 45-minute module-check block for assessment) and its planned lab minutes (47 + 45). Those lab figures were day-block remainders; the accepted plan caps each lab at 30.
- No course hours, homework or day-cap changes were added. No required activity in `course-schedule.md` section 2 was cut or shortened, and neither final sitting was split or changed. The 45-minute module-check split is not reused. The calendar's platform blocks (warm-ups, reflections, F26 "Timed, without AI", "Explain your code", F28 error-log review and practice without AI) are not scheduled as separate activities, because the accepted time plan does not budget them separately (`course-schedule.md` section 3).
- The sitting is timed by the captain's rule alone: 30 items x 2 minutes = 60 minutes, with no per-question timer. No timing pilot is required (withdrawn 2026-11-10, firstmate inbox 015).

## 8. Authoring rules from technical review

Value-free rules the private author must follow so every key holds on Java SE 25:

- Unspecified order: no item keys the iteration or print order of a hash-based collection or of a default `groupingBy` map, nor a bucket number; such results are keyed on contents, sizes or `get` results only. This applies to every item, including q02, q03, q05, q22, q28 and q29.
- Nulls in sorting: `reversed()` reverses the whole comparator chain built so far, and `nullsFirst` or `nullsLast` must wrap the key comparator; a plain `comparing` on a null key throws. In q04 and q24 a key that relies on a null-caused exception needs at least two elements and a comparison that is sure to reach the null; otherwise key the `nullsFirst` or `nullsLast` repair.
- Laziness and reuse: q11 shows laziness only with a terminal operation that must visit elements (such as `forEach`, `toList` or `findFirst`), never with `count()`, which may skip the pipeline. Stream reuse is keyed on the exception type, not its message.
- Deques: `ArrayDeque` rejects null elements, so no item (q01, q16) is built on a null element. The legacy `Stack` class may appear only for the documented reason to prefer a Deque; its own exception types are not taught and are not keyed.
- Integer identity (q07): key `==` between two `Integer` objects as an identity comparison that is guaranteed equal only from -128 to 127, with `equals` or unboxing as the repair. Never key a definite result outside that range.
- Mutated keys (q08): changing a compared field of a stored key is keyed as unspecified behavior that can make lookup fail, never as a guaranteed false; changing an unrelated field is keyed as harmless.
- `ConcurrentModificationException` is best-effort: no item assumes it is thrown, and q17 keys the safe removal method, not a `ConcurrentModificationException`.
- Untaught list mechanics: no item depends on `remove(int)` versus `remove(Object)` on a wrapper-element list, on index shifting during removal, or on iterator internals, and no item passes an `int` argument to `remove` on such a list. q17 keys the safe removal method, never an exact list of surviving elements. q19 locates boxing only through taught operations: add or put, get, reading into a primitive, and unboxing null. Its stem states that no key is mapped to null, and the default argument of `getOrDefault` counts as a boxing site.
- Removal (q17): the stem says the same list object must change in place, only one safe removal method appears among the options, and the unmodifiable fixture contains at least one matching record, so the removal is actually attempted.
- Equivalence (q30): equivalent means the same elements in the same order. The stem sets list mutability aside explicitly, and every option sorts after the transformation, as the loop does.
- Raw types (q06, q18): a raw list is never passed straight to a generic method, because the result then has the erased type, which the course does not teach; q18 passes a parameterized list that was polluted earlier through a raw alias. The raw call is keyed as compiling with an unchecked warning. A `ClassCastException` is keyed only where the element must be a `String`, such as assignment to a `String` variable, never at an `Object` target or in string concatenation.
- Case-insensitive equality (q21): the stem limits values to ASCII letters. The keyed repair normalizes the name once and then uses `equals` and a hash code on that field. Never key `equalsIgnoreCase` paired with a `toLowerCase()` hash, and offer at most one valid repair.
- Ties and duplicates (q23, q28): q23 builds the tie loss from a repeated map key, and no option offers a valid tie-breaker alternative. In q28 the stem fixes the result shape, and the merge-function option visibly drops values.
- Method references (q10, q26): every method reference shown as valid compiles and is not overload-ambiguous (for example, never `Integer::toString`). No interface in an item redeclares a public `Object` method, so the taught one-abstract-method rule agrees with JLS 9.8.
- Taught APIs only: collect stream results with `toList()`, as the course pages do, and use no API the pages do not show.

## 9. Delivered bank and replacement candidate

### 9.1 Delivered bank (PR 92), unchanged

- The bank was authored on 2026-11-09 through the approved private-authoring route, outside Git, in the private location named by the course owner's ownership record. It was reworked in two correction loops after the independent critics' value-free reviews of this plan (`final-mcq-count-critic-{education,sme}.json` and their `-recheck` reports, reconciled in `final-mcq-count-reconciliation.json`).
- Validation history:
  - at `f4ef1a57`, run `cs-final-jdk17-20261109-r3` on JDK 17.0.12;
  - again at `6ca532cf`, run `cs-final-jdk25-20261110-r6` on Temurin 25.0.5+8. The bank was unchanged since r3.
- Delivery: under the captain-approved exception of 2026-11-10 (`authoring/AGENTS.md`, "Never commit"), PR 92 committed the bank as `collections-streams/assessments/collections-module-check/final-mcq.gift`.
  - Its sha256 is `df0e8ada6777c22acaa898babe9b3ae3b73145094de1a64a669fa5ae8b9b9011`. The private canonical copy (sha256 `7ef0a2d790aa69e39f0aa32264e76445a7984a776178feb33736afc167fd240e`) differs from it only in the line-1 comment header.
  - The delivered Downloads copy is byte-identical to the committed file: sha256 `df0e8ada6777c22acaa898babe9b3ae3b73145094de1a64a669fa5ae8b9b9011`.
  - The private workbook-link sidecar still binds the private canonical copy. Its file sha256 is `e50c8546f8cc0eaffb876dd2d3d90ed7ae3a9d5dc7872efac65f9b3ed6b513c9`. It was rewritten on 2026-11-12 with its 2026-11-10 content, and no earlier hash of its bytes was recorded, so its unchanged state rests on its content, not on a prior hash.
  - This successor changes none of these bytes, hashes or records. The PR 92 byte-identity and workbook-link proof covers only these delivered bytes.
- Intent audit, 2026-11-12, value-free counts. The delivered bank fails two of the Captain's course-final intent checks:
  - the correct option is strictly the longest option in 20 of 30 items, where chance is about 7.5, so a test-wise learner gains from picking the longest option;
  - one item calls a method that no taught or prerequisite page shows.

  It passes the remaining checks:
  - count and coverage;
  - easy-to-harder progression;
  - repetition and similarity;
  - no trick forms;
  - separate formative quizzes.

### 9.2 Replacement candidate `r7` (private, not delivered)

- The approved private correction loop produced a separate candidate. It left the delivered bank untouched. The changes:
  - option lengths rebalanced;
  - the untaught call replaced with a taught collection call;
  - the record types of two items whose accessors were used but not declared are now declared in the stems.
- What did not change:
  - the item count (30) and the time (60 minutes, 2 per item, no per-question timer);
  - item ids, Bloom levels, primary and secondary objectives (sections 4 and 5), delivery order and correct-answer positions;
  - the separate 90-minute practical.

  The wording changed in 14 items.
- Re-audit by counts:

  | Check | Result |
  |---|---|
  | Correct option strictly the longest | 7 of 30 items |
  | Length rank of the correct option, longest to shortest | 9, 14, 5, 2 |
  | Untaught methods | 0 |
  | Undeclared types | 0 |
  | Similarity within the bank | at most 0.29 |
  | Similarity to the committed topic banks | at most 0.26 |
  | Code snippets | at most 10 lines |
  | "NOT" or "EXCEPT" stems, "all/none of the above" options | 0 |

- Validated at `d633234f` by run `cs-final-jdk25-20261112-r7`:
  - the bank build reports no problems;
  - correct positions are balanced 8, 8, 7, 7;
  - every code-backed key passes on JDK 17.0.12 and on Temurin 25.0.5+8: 29 run-time checks and 12 compile-time expectations;
  - the private leak scan finds no wording new to the candidate anywhere in this repository.
- Candidate bytes, in delivery form, which is the candidate with the delivered file's line-1 header:
  - sha256 `15198c419c110d23951285fe8e750288a53ebfce90ce267ab3bdc040c25285b9`;
  - the repository validator (`node authoring/tools/gift/validate.mjs --html`, category `collections-streams/final-mcq`) exits 0 on them, run privately on this successor's base.
- The candidate is kept outside Git, with directories at 0700 and files at 0600. No independent course critic saw protected values from either version. The critics reviewed only this value-free plan and the blueprint.

### 9.3 Readiness and manual re-import

- Readiness: the candidate is **validated and ready for a manual replacement re-import, pending the course owner's separate delivery authorization**. Neither this successor nor its PR delivers it.
- A replacement delivery would need all of the following steps:
  1. Commit the candidate's delivery-form bytes (sha256 `15198c41...85b9` above) in place of `collections-streams/assessments/collections-module-check/final-mcq.gift`, in a separately authorized change.
  2. Re-run `authoring/tests/course-final-gift.test.mjs` and the `--html` validator on those bytes.
  3. Replace the Downloads copy and re-bind the workbook link to the new hash, in new versioned records rather than overwrites of the PR 92 evidence.
  4. Re-import the bank on the delivery platform in place of the delivered one. Learners who already sat the delivered version keep their recorded results.
- These records become stale at that replacement:
  - section 9.1's statement that the delivered bytes are current;
  - the PR 92 byte-identity and workbook-link proof;
  - the private workbook-link sidecar.
- Manual-import caveats, unchanged for either version:
  - 26 of the 30 items show a code snippet in an `[html]` stem, and the frozen calendar lists "code snippets in quizzes" among the delivery platform's pending features, so rendering must be confirmed on a private test import;
  - the category `collections-streams/final-mcq` may need renaming to the platform's form at import.
- Placement of the 150 course-final assessment minutes (90-minute practical on F27, 60-minute MCQ last on F28, separate sittings) is resolved (section 7; `course-schedule.md` section 3).
- Still excluded: any scoring rule beyond the blueprint pass mark, practical rubrics, reference solutions and hidden tests.

## 10. Taxonomy placement for the workbook owner

The track taxonomy workbooks live outside this repository and have their own owner.
For Collections & Streams (Foundation track only; it has no Standard or Fast placement):

- Keep "Review: collections and streams" (`collections-and-streams-review`) as Course Review activity 1, unchanged.
- Add one row after it in the same Course Review group: "Review scenarios: collections and streams", link `collections-streams/course-review/collections-and-streams-review-scenarios/artifact.html`, 14 minutes, type review HTML, planning id `[collections-streams/course-review/review-scenarios]`. It is a new review asset, not a canonical topic.
- Keep exactly one final MCQ row last in Course Review, with planning id `[collections-streams/course-review/graded-mcq]`, 30 questions in 60 minutes, now pointing at `collections-streams/assessments/collections-streams-final-mcq/blueprint.json`; its imported bank is the delivered file in section 9.1 until an authorized replacement re-binds the link to the section 9.2 candidate; keep `collections-module-check` in Sources and the Crosswalk as the legacy blueprint.
- Keep the practical row (the coding tasks of `collections-module-check`, 90 minutes per the accepted course time plan, not that blueprint's superseded 30-minute Part 2) before Course Review, on F27 as its own sitting.
- Place rows by day and take every duration, label and source from `course-schedule.md`:
  - section 3 gives the day plan;
  - section 4 gives the row-by-row duration sources.
- Keep the planned, pending-delivery labels on both module labs (30 minutes each) and both mastery checks (15 minutes each). They are not built yet, and the workbook does not wait for them.
