# C2 sweep checklist

Provenance: adopted from the new-learner review of six PEP pages (2026-11-25) as the per-page checklist for re-authoring learner pages into the C2 path anatomy (`data-pep-anatomy="path"`, root `DESIGN.md`).

Apply every item to every re-authored page. An item whose condition does not hold on the page (for example A6 on a page that is not a lab, or C3 on a page without a prediction-first activity) is recorded as not applicable, with a reason. The author checks each item before handing the page to critics, and the educational and technology SME critics (`authoring/docs/workflow.md` §2.3) record a finding for each item that fails. Each item is a yes/no check. ★ marks items a beginner notices first.

Items marked **Pending captain decision** state the open question. Do not record them as a failure until the captain decides; note the page's current behaviour instead.

Structural gates cover only part of this list: on path pages T08 checks the structure behind A2 and G4 (the On the job card's presence, heading, rows, order and non-empty text). Whether the card's content meets those items, and everything else, is a review judgment.

## A. Job, interview and career

- [ ] ★ **A1. Ties concept and exercise to job, interview and career use.** The page says, in plain words, (a) where this shows up in a junior developer's working week on a real team, and (b) how an interviewer is likely to probe it. Both are specific to this topic, not a generic "this is important". On path pages these are the On the job card's **At work** and **In interviews** rows, mirrored in the topic's `career` object.
- [ ] A2. An open **On the job** card is present. Its decision is phrased as the question a practitioner actually asks, and its boundary names the concrete alternative to use instead.
- [ ] A3. At least one exercise uses a workplace scenario (customers and orders, tickets, a colleague's pull request, a failing build) rather than only toy objects.
- [ ] A4. Where a common interview question or code-review comment matches an exercise or quiz item, the page says so.
- [ ] A5. The page links back to related work the learner has already done in an earlier course (for example, a Spring `@Valid` page links back to HTML forms validation, and a JDBC repository page links back to SQL joins).
- [ ] A6. A coding lab opens with ticket framing: who asked for the work, what the tests stand in for (CI), and what a reviewer would check.

## B. Beginner language

- [ ] ★ B1. Every technical term is defined in plain words at or before first use on the page, including in objectives, options, feedback, hints and On the job rows, unless a prerequisite or an earlier topic in `topicOrder` already taught it. Otherwise it is removed.
- [ ] B2. No feature from a later topic or module is needed to understand a sentence. Check against the module's `topicOrder` and the topic's `prerequisites`.
- [ ] B3. No definition is circular.
- [ ] B4. No authoring or grader vocabulary is visible to learners: "the model", "settle", "counted run", "credit", "lesson check", track or calendar codes, "review pending", or authoring estimates. See `authoring/docs/practice-feedback-policy.md`, including its known gaps in shared components.
- [ ] B5. Status, confidence and button wording follow one shared vocabulary across courses.

## C. Teaching

- [ ] ★ C1. Before any task asks the learner to write or recognise something, the reading column shows one complete worked example of exactly that thing (markup, a conflict block, a query with its result).
- [ ] C2. Any data a question refers to (people, tables, files) is visible when the question is asked.
- [ ] C3. A prediction-first activity says plainly that the learner has not been taught this yet and should guess.
- [ ] C4. Notation in sample data (arrows, compressed rows) is explained or replaced with a plain table. Data the page never uses is removed.

## D. Exercises

- [ ] ★ D1. The goal is stated in one sentence before any controls. Multi-step tasks are numbered, with one action per step and one button per checked thing.
- [ ] D2. If the objective is to write code or markup, the learner types it (the Real Task Rule). Selectors are used only for genuinely discrete choices.
- [ ] D3. Lanes and options use the vocabulary the page just taught. No item depends on an untaught distinction.
- [ ] D4. A simulated tool that stands in for a real one names the real one (for example, "these buttons match VS Code's Accept Current Change and Accept Incoming Change").
- [ ] D5. Every activity that can stall has at least one hint that adds a reasoning step. A hint never repeats the teaching and never gives the answer.
- [ ] D6. Where real problems come in more than one shape (combine both sides of a conflict, several matches), at least one shape beyond the trivial one is practised or named.
- [ ] D7. Option positions are planned with the answer-order tools (`authoring/tools/html/answer-order.mjs`, `authoring/tools/gift/answer-order.mjs`), and the correct option is not the longest. T26 reports both.

## E. Feedback and attempts

- [ ] ★ E1. Every error or failure message says what to do next in beginner words, and translates real tool errors (for example, "ambiguous column" becomes "qualify it: `s.student_id`").
- [ ] E2. **Pending captain decision.** Syntax and parse errors do not use up an attempt, on any engine. See the proposed section of `authoring/docs/practice-feedback-policy.md`.
- [ ] E3. A near-miss (the same rows without the secondary sort; the right idea in a different style) leads with a specific nudge, not a "not passed" verdict.
- [ ] E4. **Pending captain decision.** The attempt budget for code editors allows real iteration, and a page with limited attempts says so kindly before the first Run.
- [ ] E5. An error location points at the line the learner must change.
- [ ] E6. A confidence rating gets a short calibration reply when confidence and correctness disagree.

## F. Page hygiene

- [ ] F1. The first screen a learner sees is the learning goal and the first activity, not metadata.
- [ ] F2. Grading internals, anti-cheat detail and test mechanics sit after the tasks, not before them.
- [ ] F3. No paragraph in learner-facing instructions runs over about 80 words. Troubleshooting uses "If you see X, do Y" lines.
- [ ] F4. Task text is not duplicated in adjacent blocks (for example a task's "how to know it's done" and the activity checks).
- [ ] F5. Simulator disclaimers agree with status messages. A page never says both "not real SQL" and "PostgreSQL rejected the statement".

## G. Path-anatomy content

The layout cannot supply these; the author writes them.

- [ ] ★ G1. Every lesson-path row title names the skill in beginner words and, where it fits, the job situation. No "Apply it" or "Activity N".
- [ ] G2. The **Your task** lead line (at most about 160 characters) states the real-work goal ("List each enrolled student with their course"), not the mechanics ("Choose one and report confidence").
- [ ] G3. Every worked example, sample query or sample code the task depends on sits in the reading column, with any sample data it refers to.
- [ ] G4. The On the job decision headline is a question a practitioner would ask. Its **Choose something else when** alternative is already taught or explained in a clause. The card carries the **At work** and **In interviews** rows (A1).
- [ ] G5. The activity checks read sensibly before the task, because on a narrow column they come first.
- [ ] G6. **Pending captain decision.** Scenario cards present real situations. When the thing sorted is a code fragment, DESIGN.md's "scenario, never item" rule still applies; whether a plain label such as "code part" is allowed instead is not decided.
- [ ] G7. The page is checked in the narrow frame (about 570 px) as the main learner view, not only at desktop width.
