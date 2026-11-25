# Practice feedback policy

Provenance: written for the C2 content sweep from the new-learner review of six PEP pages (2026-11-25). It covers how learner pages word feedback for practice activities. It changes no grading engine, credit rule or gate.

This policy sits beside `authoring/docs/html-artifact-contract.md` and root `DESIGN.md`. Where they set grading behaviour (retries, locking, restart, credit), they still govern; this policy governs the words a learner reads. The C2 sweep checklist (`authoring/docs/c2-sweep-checklist.md`) items B4, E1, E3 and E5 apply it.

## 1. Adopted rules

### 1.1 Near-misses lead with a specific nudge

- A near-miss is an attempt that is right in substance but differs in one named detail. Examples: a query returns the right rows without the secondary sort; markup is right except for one missing attribute; code is right in a different but valid style that the check does not accept.
- DESIGN.md's rule that the verdict word comes first still holds. For a near-miss that word is a near-miss verdict such as "Almost", never a failure verdict such as "Not passed" or "Incorrect", and the nudge follows it at once, naming the one detail to change and where to change it, in beginner words, before any other explanation: "Almost: your rows are right, but people with the same last name can come out in any order. In your `ORDER BY` line, add a second column to sort by after `last_name`." The nudge names the detail and the line without writing the finished clause.
- A near-miss verdict uses DESIGN.md's near-miss verdict style (warning tone, never danger red), so the learner never sees a failure colour for an answer that is right in substance.
- The message never states the full answer unless the page's existing rules reveal it at that point (for example, after the final allowed retry).

### 1.2 Learner text never uses grader words

- Learner-visible text never uses grading-engine or authoring vocabulary. The words to avoid include "settle" and "settled", "counted run", "credit" and "earned credit", "lesson check", and "the model" when it means the page's internal answer or simulator.
- Say what happened from the learner's side instead:
  - "This activity is done; you can keep practising" rather than "Practice run: this activity is already settled".
  - "Your answer is saved" rather than "credit recorded".
  - "This practice editor checks a subset of SQL" rather than "the model".
- The rule covers visible text, `aria-label`, `aria-live` announcements, hints, feedback, button labels and the Markdown and PDF companions. It does not cover attribute names and values that learners do not read, such as `data-pep-credit` or `data-pep-settled`.
- A term that is the subject of the lesson is not a grader word. "Model" in a data-modelling topic or an AI topic, and "credit" in a banking scenario, are fine when the page teaches them.
- Authoring metadata (track or calendar codes, "review pending", authoring time estimates) is not learner text either.
- Known gaps: shared components at `@1` still show some of these words, for example "Answered and settled: this check is not marked correct" in `components/mcq-with-confidence` and "settled, not correct" in `components/progress`. Pages embed components at a declared version, so an author does not edit those strings in place. A page is not failed on B4 for them until a component version changes them; page-owned text is still held to this rule.

### 1.3 Error locations point at the line to change

- When feedback names a location, it names the line or part the learner must edit, not the line where a parser or check first noticed the problem. For a missing semicolon at the end of line 4, the message points at line 4, not line 5.
- When the engine cannot locate the error precisely, the message says so and names the nearest place to look ("Check the end of the line before line 5").
- A real tool error shown to the learner comes with a plain translation and the next step ("`column reference "student_id" is ambiguous` means two tables have a `student_id` column: qualify it as `s.student_id`").

## 2. Proposed, pending captain decision

The rules in this section are not adopted. PR 106 made the java-foundations classes-and-objects lanes engine first-try-only for credit, and the captain has not decided how attempts and credit should work across engines. Authors do not change engine attempt or credit behaviour on the strength of this section, and critics do not record a page as failing these items until the captain decides.

- **Syntax and parse errors never use up an attempt.** On every engine, an attempt that cannot be parsed or run would get its error message and leave the attempt count unchanged. Today engines differ: some Java practice editors say a compile problem "does not count as a try", while the new-learner review reported that a SQL syntax error counts as one of an activity's two counted runs (not re-verified for this policy).
- **Attempt budgets allow real iteration.** Code-editor activities would allow enough runs to experiment. A page that limits attempts would say so kindly before the first Run.
- **First-try credit.** Whether first-try-only credit, as that lanes engine now applies it, should spread to other engines, or whether formative practice should stay lenient everywhere, keeping credit rules but softening the wording, is open.

Until the captain decides, follow the existing contract: `authoring/docs/html-artifact-contract.md` section 4 and the engine's own rules. The adopted wording rules in section 1 still apply to whatever attempt rule an engine uses.

## 3. Checking

- Authors and the educational critic check every page against section 1. Findings use the C2 sweep checklist item ids (B4, E1, E3, E5).
- No gate enforces this policy yet. A grader-word lint would have to be report-only or limited to path pages, because the listed words are legitimate subject matter on some pages.
