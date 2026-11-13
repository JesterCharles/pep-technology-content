# Collections & Streams delivery schedule (Foundation F25-F28)

This record holds the approved delivery schedule for Collections & Streams and the duration sources for the workbook owner. It contains no assessment values.

## 1. Decision

- Captain decision, 2026-11-09, relayed to this task in firstmate task inbox messages 007 and 009. Message 007 approved moving later teaching to earlier days. Message 009 carried the captain's answer "approve jdbc and collections a", which approves option A.
  - Move later teaching into earlier days, in prerequisite order.
  - Place required topic-quiz practice in F28's existing Cumulative quiz block.
  - Keep every module mastery check before the practical.
  - Keep four equal two-hour days, the eight-hour total and all required activities.
- Excluded: added hours or homework, changed day caps, a mastery check after the practical, cut or shortened work, and a split or changed final sitting.
- This schedule supersedes the day-block allocation and the lab minutes in `intake.md` (sections "Day-block allocation" and "Lab plan"). That intake allocation had no room for the accepted course finals.
- It also supersedes the delivery fields of `collections-streams/assessments/collections-module-check/blueprint.json`:
  - The `dayId` F28, the 45-minute `durationMinutes` and the 15 + 30 split in `instructions` stay as the legacy record of the calendar's F28 assessment row, copied at intake.
  - The practical is delivered on F27 as its own 90-minute sitting.
  - Its 90-minute design follows the accepted course design: a supplied dataset turned into indexed and grouped reports, with correct equality and sorting and one stream-based database path (`data/pep-labs-course-assessments-design/recommended-plan.md`, section 4). The blueprint's coding tasks are the source scope for that design.
  - The practical's own tasks, rubric and solutions are not built. They are pending delivery and are excluded from this repository.
  - Follow-up: when the practical is delivered, its own blueprint or an updated legacy blueprint records F27 and 90 minutes.
- Branch scope: firstmate task inbox message 011 (2026-11-09) approved one coordinated change across three modules' notes and locks (collections-in-depth, lambdas-and-streams, course-review) and the course files. The scope is limited to this placement, the planned 30-minute lab labels, the review-practice wording, locks and directly affected evidence.
- The curriculum mappings do not change. Each `topic.json` keeps its calendar pointer, which records the source row a topic comes from. This record sets the day a learner takes it.

## 2. Required work, each estimate counted once

| Activity | Minutes | Status | Source |
|---|---:|---|---|
| 16 topic pages | 200 | modelled (frozen estimator), enforced by T14 | each `topic.json` `minutes.budget`: ceil(max(modelled P50, modelled worst required route)) with the frozen estimator. Includes the page's own embedded practice. No learner timing exists yet |
| Topic-quiz practice (13 topic GIFTs) | 25 | allocation | the accepted course plan gives 225 to content and topic practice; the 200 page minutes leave 25. No per-question minutes are assigned |
| Collections in Depth lab | 30 | planned, pending delivery | accepted plan: "keep both labs to 30 minutes"; the cap includes a modest completion buffer |
| Lambdas and Streams lab | 30 | planned, pending delivery | same |
| 2 module mastery checks | 2 x 15 | planned, pending delivery | accepted plan: 2 mastery x 15; buffer inside |
| Graded practical | 90 | planned, one sitting, pending delivery | accepted plan: final 90 + MCQ; `recommended-plan.md` section 4: "Recommended time: 90 minutes" |
| Final MCQ, 30 items | 60 | delivered by PR 92 (`collections-module-check/final-mcq.gift`); a validated private replacement candidate awaits the course owner's delivery decision (`course-final-mcq-coverage.md` section 9) | captain rule: 2 minutes per question, at most 45; blueprint `collections-streams-final-mcq` |
| **Required total** | **465** | | |
| Reserve | 15 | not activity time | the accepted plan's 35, minus the 20 extra minutes of the captain-set 60-minute MCQ (it had 40) |
| **Course envelope** | **480** | frozen | `curriculum/snapshot/pep-calendar.json`: `program.hoursPerDay` 2, times four days |

"Accepted plan" means the Collections/Streams row (line 30) of `data/pep-labs-course-assessments-design/time-budget-recommendation.md` and its "Required-time budget direction" in `data/pep-labs-course-assessments-design/decision-record.md`. Both are program design records kept outside this repository.

Overheads:
- Instruction, setup and submission time sits inside each lab, mastery-check and practical limit (the cap-includes-buffer principle).
- No record gives separate transition, instruction or submission minutes, so none are added. The earlier modeled figures of 0.25-0.5 minutes per transition and 1-3 minutes per sitting are withdrawn: they had no source and would count the same time twice.
- Any real transition time comes out of the reserve.

Labs:
- Neither lab was raised to a planning minimum. The intake's 47 and 45 minutes were day-block remainders, not work estimates.
- The accepted plan set both labs to 30, within the captain's 30-60 budgeting assumption, which "is not a reason to lengthen shorter valid labs".
- No record estimates either lab below 30.

## 3. Day plan

Quiz minutes are an even split of the 25-minute allocation over 13 quizzes (about 1.9 each). That is a planning split, not a measured time.

| Day | Activities in order | Minutes | Unused |
|---|---|---:|---:|
| F25 | lists, sets and maps; stacks and queues; generics; wrapper types (reading); Big-O basics; equals and hashCode; how HashMap works (83); topic quizzes for lists, stacks, generics, wrapper types, Big-O and equals (11.5); Collections in Depth lab, part 1 (22) | 116.5 | 3.5 |
| F26 | Collections in Depth lab, part 2 (8); choosing the right collection; sorting with Comparator (25); Collections in Depth mastery check (15); lambdas and functional interfaces; method references (reading); streams over database data; grouping with streams and Optional (49); Lambdas and Streams lab, part 1 (19) | 116 | 4 |
| F27 | Lambdas and Streams lab, part 2 (11); Lambdas and Streams mastery check (15); graded practical, one sitting (90) | 116 | 4 |
| F28 | Cumulative quiz block: topic quizzes for how HashMap works, choosing, sorting, lambdas, method references, streams and grouping (13.5); timed coding-screen patterns (15); Course Review: review page (14), review scenarios (14), final MCQ (60), last | 116.5 | 3.5 |
| **Total** | | **465** | **15** |

Teaching moved earlier: equals and hashCode and how HashMap works (F26 source rows 0-1) move to F25. Lambdas, method references, streams and grouping (F27 source rows 0-3) move to F26. That is 73 minutes. The captain approved this direction (section 1: inbox messages 007 and 009).

Prerequisites hold:
- Every topic follows the prerequisites in its `topic.json`.
- Method references come before grouping, because the grouping page uses method references. The HashMap and sorting pages already use lambdas and method references as inline idioms before their dedicated pages; that relative order is unchanged by the move.
- Each lab follows the topics it practises (`intake.md` "Lab plan").
- Each mastery check follows its module's lab and taught topics.
- The practical follows every taught topic, both labs and both mastery checks.
- The timed coding-screen topic is a review topic: its objectives retrieve patterns taught earlier. No topic, lab, mastery check or practical objective depends on it, so it may follow the practical. The final MCQ, which does assess two of its objectives, comes after it.
- Course Review ends the course, with the final MCQ last.

Each lab is split across two days at a session boundary, as the intake already planned for the Collections in Depth lab. The practical and the final MCQ are single sittings.

Quiz placement:
- Option A places topic-quiz practice in F28's Cumulative quiz block. So the Collections in Depth mastery check comes before the quizzes for HashMap, choosing and sorting, and the Lambdas and Streams mastery check and the practical come before the four Lambdas and Streams quizzes.
- Moving those quizzes onto F25-F27 would leave less than 2 unused minutes on some days. The schedule keeps them in the block.

Limits:
- Platform blocks are not scheduled as separate activities, because the accepted plan does not budget them separately. These are the warm-ups, reflections, F26 "Timed, without AI", "Explain your code", and F28 error-log review and practice without AI. The intake allocation had used F26 "Timed, without AI" to practise choosing and sorting; they are now practised in their pages' own checks and in the F28 quiz block.
- The frozen day-type block templates (Concept, Practice, Review) serve as two-hour containers. Only F28's Cumulative quiz block is mapped by name.
- The unused minutes are the reserve, not validated slack. Lab and mastery-check durations are planned upper limits until the labs and checks are delivered and measured.

## 4. Duration sources for the workbook owner

Every Collections & Streams duration or placement in the workbook, with its value-free source:

| Workbook row | Duration | Placement | Label | Source |
|---|---:|---|---|---|
| Each topic page | its `minutes.budget` (section 2 total 200) | section 3 day | modelled, T14-enforced | `authoring/catalog/collections-streams/<module>/<topic>/topic.json` |
| Topic quiz (GIFT), per topic | inside the 25-minute topic-practice allocation; no per-quiz minutes | with its page, or F28 Cumulative quiz block per section 3 | allocation | accepted plan (225 content and topic practice); this record, section 3 |
| Collections in Depth lab | 30 | F25 part 1, F26 part 2 | planned, pending delivery | accepted plan; not built (`moduleLabs` empty) |
| Lambdas and Streams lab | 30 | F26 part 1, F27 part 2 | planned, pending delivery | accepted plan; not built |
| Collections in Depth mastery check | 15 | F26, after its lab | planned, pending delivery | accepted plan; not built |
| Lambdas and Streams mastery check | 15 | F27, before the practical | planned, pending delivery | accepted plan; not built |
| Graded practical | 90 | F27, own sitting, before Course Review | planned, pending delivery | accepted plan; `recommended-plan.md` section 4; source scope: the coding tasks of `collections-streams/assessments/collections-module-check` (its F28 day and 45-minute split are superseded, section 1) |
| Review scenarios (Course Review) | 14 | F28 | modelled, T14-enforced | its `topic.json` |
| Final MCQ (Course Review, last) | 60, 30 items | F28, last | delivered by PR 92; a validated private replacement candidate (same 30 items and 60 minutes) awaits the course owner's delivery decision (`course-final-mcq-coverage.md` section 9); no timing pilot required; platform rendering of code stems to be confirmed on a private test import | `collections-streams/assessments/collections-streams-final-mcq/blueprint.json`; `course-final-mcq-coverage.md` section 9 |
| Reserve | 15 | spread across days, unused | not activity time | section 2 |

Workbook publication does not wait for lab implementation, lab execution or any overhead validation.
