# How Agile teams work: Scrum and user stories

## Objectives

- Put the Scrum events of one sprint in order
- Build a user story in the form As a ..., I want ..., so that ...
- Tell a testable acceptance criterion from a vague one

## Teaching

### Start with a guess

A team works in two-week sprints. On the first day, the team meets to decide what to work on.

### One sprint, four events

Scrum works in sprints: fixed periods of one month or less. Sprint Planning starts each sprint by choosing work from the ordered product backlog. During the sprint, Developers meet for a 15-minute Daily Scrum to adjust their plan. At the end, the Sprint Review inspects the result with stakeholders, then the Sprint Retrospective improves how the team works.

Three accountabilities: the Product Owner orders the backlog, the Scrum Master helps the team use Scrum, and Developers build the work.

### User stories and acceptance criteria

Many Scrum teams write backlog items as user stories, a common practice the Scrum Guide does not require. Form: As a user role, I want something they can do, so that a benefit. Leave out how it will be built.

Each story gets acceptance criteria: checks with a clear yes or no. A testable criterion names a situation, an action and an observable result, often as Given, When, Then. “Works well” or “fast” cannot be checked.

### Apply it to a new story

Testable criteria are also what you will check AI-made changes against in the next topic.

## Model

One sprint

1. 1 ?
2. 2 ? every day
3. 3 ?
4. 4 ?

Then the next sprint starts with planning again.

- Product Owner orders the backlog
- Scrum Master helps the team use Scrum
- Developers build the work

As a Drop a card here Hint

I want Drop a card here Hint

so that Drop a card here Hint

Acceptance criterion Drop a card here Hint

Story card

As a …

I want …

so that …

Acceptance criterion …

## Recap

- A sprint runs Sprint Planning, Daily Scrums, the Sprint Review, then the Sprint Retrospective.
- The Product Owner orders the backlog, the Scrum Master helps the team use Scrum, Developers build.
- A user story: As a role, I want a capability, so that a benefit.
- Acceptance criteria are yes-or-no checks: a situation, an action, an observable result.

Next topic: Checking AI-made changes before merging

## Cheat sheet

|  |  |
| --- | --- |
| Sprint | fixed period, one month or less |
| Sprint Planning | choose work from the ordered product backlog |
| Daily Scrum | 15 minutes, Developers adjust the plan |
| Sprint Review | inspect the result with stakeholders |
| Sprint Retrospective | improve how the team works |
| Acceptance criterion | Given a situation, When an action, Then an observable result |

Accountabilities and events follow the 2020 Scrum Guide; user stories and Given, When, Then are common team practices, not Scrum requirements.

## Sources

Claims on this page were checked against the live official pages below on 6 October 2026 (UTC). Links open outside this lesson.

- The 2020 Scrum Guide: The Sprint; Sprint Planning; Daily Scrum; Sprint Review; Sprint Retrospective; Product Owner; Scrum Master. November 2020 edition, the current official guide as published on scrumguides.org; it does not mention user stories.
- Gherkin Reference (Cucumber): Given and Then steps. Given, When, Then is a common way to write acceptance criteria, not a Scrum requirement.

Not tied to one source: how widely teams use user stories is not measured here.

## Static interaction alternatives

### predict

Prediction (not scored). What happens at the end of a sprint? The team shows what it built, then reflects on how it worked: the Sprint Review inspects the result, then the Sprint Retrospective improves how the team works. Releasing to customers is a separate decision; the next sprint does not just start; and no manager assigns the work, because the Developers plan it in Sprint Planning with the Product Owner.

### drag

Fill the sprint loop in order: Sprint Planning (starts the sprint by choosing work from the product backlog), Daily Scrum (every day, so Developers can adjust their plan), Sprint Review (at the end, to inspect the result with stakeholders), Sprint Retrospective (closes the sprint by improving how the team works).

### drag

Build a user story from cards, with a confidence rating. The verified story reads: As a learner, I want to see which topics I have finished, so that I know what to study next. Acceptance criterion: Given I finished topic 1, when I open the course page, then topic 1 shows as finished. Rejected cards: the database or the progress bar as the user (neither is a person using the product); a four-column table or fast code as the want (build decisions, not user goals); closing the ticket or using a new framework as the benefit (team process and build choices); works well or saved with localStorage as the criterion (nothing observable, or how it is built).

### mcq

Graded check with a confidence rating. Story: as a learner, I want to start a practice topic over, so that I can try it again. The testable criterion: after I press Start over, every answer is cleared and progress shows 0 of 4. Works well and a clean, modern look cannot be checked yes or no; built with a single JavaScript function describes how it is built. Retry as Given, When, Then: Given I have answered two activities, when I press Start over, then progress shows 0 of 4. Feels smooth is an opinion, reviewers being happy is about the code, and fast has no threshold.
