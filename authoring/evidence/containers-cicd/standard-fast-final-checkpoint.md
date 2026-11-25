# Standard/Fast final checkpoint MCQ

The cumulative graded multiple-choice checkpoint for the end of the Standard and Fast tracks.
It is distinct from the Foundation checkpoint, from every course-final bank and from the formative topic and module practice banks.

| Item | Value |
| --- | --- |
| Bank | `containers-cicd/assessments/standard-fast-final-checkpoint/checkpoint-mcq.gift` |
| Blueprint | `containers-cicd/assessments/standard-fast-final-checkpoint/blueprint.json` |
| Format | 45 single-answer MCQ (expanded from 30 on 2026-11-19, see `standard-fast-final-checkpoint-45/README.md`), four options each, `[html]` GIFT, category `standard-fast/final-checkpoint-mcq`, titles `sfcp-q01` to `sfcp-q45` |
| Duration | 90 minutes, at 2 minutes per question (blueprint; was 60 for the 30-item base) |
| Day | Standard S43 and Fast FT25 (the Final gate) |
| Content authority | learner pages at `b102584d`; `a00a6658` changes only QA tooling, so the authority is unchanged |
| Byte check | `authoring/tests/standard-fast-checkpoint-gift.test.mjs` |

## Placement

The checkpoint is not owned by one course.
It sits with Containers & CI/CD because that is the last shared course before the Final and its `course.json` already names the other four shared courses as prerequisites.
The objective references in the blueprint are fully course-qualified, so they resolve to each course's own topics.
The bank carries its answer flags in the canonical repository under the captain's 2026-11-19 public-answer consent; `authoring/AGENTS.md` records that.
It is a new file name, `checkpoint-mcq.gift`, so the course-final bank rules (`*/assessments/*/final-mcq.gift`) do not apply to it and its own test checks it instead.

## Scope

Content taught **in full on both tracks** in the five shared courses. The table below is the base 30 (q01-q30); the 15 items added later (q31-q45) are mapped in `standard-fast-final-checkpoint-45/coverage-45.json`.

| Course | Standard days | Fast days | Items |
| --- | --- | --- | --- |
| Spring Boot | S1-S13 | FT1-FT8 | 8 |
| Python | S14-S19 | FT9-FT11 | 5 |
| HTML/CSS/JS | S20-S27 | FT12-FT15 | 7 |
| React | S28-S35 | FT16-FT20 | 7 |
| Containers/CI-CD | S36-S39 | FT21-FT23 | 3 |
| **Total** | | | **30** |

Out of scope: the AWS track A1-A7 (separate, Fast only), the Foundation courses, Project 2, Standard-only topics (no FT day) and topics the calendar marks "(skim)" on their Fast day.
The skim list comes from the Fast day topic strings in `curriculum/snapshot/pep-calendar.json`; it includes beans and bean scopes, configuration files and profiles, secrets from the environment, mutability and aliasing, image layers and build caching, debugging with logs and exec, flexbox, grid, the event loop and accessible forms.

**Skim rule.** Every item's deciding fact sits on a topic taught in full on both tracks, with one recorded exception: **q37**.
q37 (test slices: `@DataJpaTest` loads only the JPA layer, `@SpringBootTest` gives `MockMvc` only with `@AutoConfigureMockMvc`) rests on `spring-boot/integration-and-observability/an-integration-test`, whose Fast day string is "An integration test (skim)" (FT8).
Reason: the owner decided to keep q37 (orchestrator decision log: "keep q37 (Fast skim exception)") rather than replace it, after the loop-3 education critic (sfcp-l3-edu-01) flagged it. It is the only item on that module, a Fast learner meets the annotation pair on two fully taught pages (`a-dev-profile-that-keeps-endpoints-open`, `spring-review-layers`) but not the stated rule, and the item is a deliberate stretch for Fast. It is the only exception; every other item obeys the rule.
(The r6 bank had another: a Dockerfile layer-caching item whose deciding fact was on the Fast-skimmed image-layers page. It was replaced in r7; see Review history.)

**Allocation.** Items follow each course's share of taught days, adjusted by what each course offers once Fast-skim and Standard-only topics are excluded.
Spring Boot loses several topics to that exclusion (beans, configuration and profiles, secrets from the environment and the whole integration-and-observability module), so it sits about one item under its day share (8 of 30, against 33-35% of days); Python sits about one over.
React and Containers/CI-CD match their day shares.

**Module coverage: 20 of the 20 shared modules.**
Spring Boot integration-and-observability is covered only by q37, the recorded skim exception above: every topic in that module is Standard-only or marked "(skim)" on its Fast day, so without the exception it would have no item.
React auth-and-review, which had no item in r6 by an author choice, is covered by q27 in r7.

## Coverage map

Days are Standard / Fast. "Executed" keys were run; "page-grounded" keys rest on learner-page statements a critic checked.

| Item | Deciding topics | Days | Objectives | Key check |
| --- | --- | --- | --- | --- |
| q01 | spring-boot-basics/path-query-and-body-parameters | S2 / FT2 | o2 | executed |
| q02 | porting-and-configuration/schema-migrations-with-flyway | S4 / FT4 | o2 | page-grounded |
| q03 | spring-data-jpa/repositories-derived-queries-and-at-query; pagination-and-sorting | S5-S6 / FT3-FT4 | o2; o2 | executed |
| q04 | relationships-and-transactions/how-transactions-work-in-spring | S8 / FT6 | o2 | executed |
| q05 | relationships-and-transactions/the-n-1-query-problem-spotting-it-in-sql-logs; fixing-n-1-with-join-fetch | S8 / FT6 | o1; o1 | executed |
| q06 | validation-errors-and-testing/global-error-handling | S9 / FT5 | o2 | executed |
| q07 | validation-errors-and-testing/standard-error-responses-with-problemdetail; web-layer-tests-with-mockmvc | S9-S10 / FT4-FT5 | o1; o1 | executed |
| q08 | api-security/role-protected-endpoints; issuing-and-checking-a-jwt | S12 / FT7 | o2; o3 | executed |
| q09 | python-fundamentals/functions-and-arguments | S14 / FT9 | o2 | executed |
| q10 | data-pipelines/reading-csv-and-json-files-with-generators | S16 / FT10 | o3 | executed |
| q11 | data-pipelines/loading-into-a-staging-table-with-upserts | S16 / FT10 | o2 | executed (SQLite) |
| q12 | data-pipelines/cleaning-and-validating-records-with-pydantic-and-type-hints | S17 / FT10 | o3 | executed |
| q13 | fastapi-services/calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts | S18 / FT11 | o2 | executed |
| q14 | html-and-css/accessibility-basics; forms-and-html5-validation | S20 / FT12 | o1; o1 | page-grounded |
| q15 | html-and-css/the-box-model | S20 / FT12 | o2 | executed |
| q16 | javascript-fundamentals/let-const-and-equals | S22 / FT12 | o2; o3 | executed |
| q17 | javascript-fundamentals/scope-and-closures; arrays-and-objects-map-filter-reduce | S22-S23 / FT13 | o3; o3 | executed |
| q18 | javascript-fundamentals/destructuring-and-spread | S23 / FT13 | o1; o3 | executed |
| q19 | dom-tooling-and-async/events-and-event-bubbling | S24 / FT14 | o2 | executed |
| q20 | fetch-and-browser-client/handling-http-errors-and-problemdetail-responses; fetching-data | S26 / FT15 | o1; o2 | executed |
| q21 | components-and-state/usestate | S29 / FT16 | o3 | executed |
| q22 | components-and-state/updating-state-immutably | S29 / FT16 | o3 | executed |
| q23 | effects-routing-and-rendering/loading-data-with-useeffect | S30 / FT17 | o2 | executed |
| q24 | effects-routing-and-rendering/routing-and-route-parameters | S31 / FT17 | o3 | executed |
| q25 | react forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label; html-css-js html-and-css/forms-and-html5-validation | S33 / FT20; S20 / FT12 | o1; o1 | executed |
| q26 | forms-context-and-crud/sharing-state-with-context | S32 / FT19 | o1; o2 | executed |
| q27 | react auth-and-review/handling-401-and-403-redirect-and-sign-out | S34 / FT19 | o2; o3 | executed (plain-JS router model) |
| q28 | containers-and-compose/service-name-networking; html-css-js fetch-and-browser-client/environment-settings-for-the-api-address | S37 / FT21; S27 / FT15 | o3; o1 | page-grounded |
| q29 | containers-and-compose/depends-on-with-health-checks | S37 / FT22 | o1; o2 | page-grounded |
| q30 | microservices-and-ci-cd/github-actions-pipeline | S39 / FT23 | o2; o3 | page-grounded |
| q37 | integration-and-observability/an-integration-test (Fast: "(skim)", FT8; recorded exception) | S11 / FT8 (skim) | o2 | executed |
| q31-q36, q38-q45 | see `standard-fast-final-checkpoint-45/coverage-45.json` | | | `key-verification*.txt`, `loop3-key-probes.txt` |

The private candidate report filed q25's form topic under React and q28's API-address topic under Containers; both actually live in the HTML/CSS/JS course, and this map and the blueprint use the real paths.
That correction changes no item and no day: both topics are taught in full on both tracks.

## Final-day ledger and timing defaults

**Open owner decision (not decided here).** With the 45-item bank at 90 minutes, the learner minutes below total 150 (90 + 60), while the calendar's Gate block is 120 minutes. The Final day is recorded as 150 minutes in the 45-item README; the 120-minute Gate block in the calendar has not been changed. Whether to lengthen the Gate block to 150, shorten the MCQ, or move a sitting is the owner's call. The table below is the original 60-minute ledger, kept for the arithmetic; read the MCQ row as 90 and the total as 150.

What the calendar (`curriculum/snapshot/pep-calendar.json`) fixes for S43 and FT25:

- The Gate day type is one 120-minute block, "Proctored assessment", format "MCQ + coding assessment (walkthrough recording pending in Evolv)".
- The Final's own record lists the formats coding, capstone (auto-graded) and recorded walkthrough, with weights coding without AI 32, capstone 24, communication 8, module checks 20 and walkthrough 16, and cut scores pool 70 and tier A 85. It names no MCQ format or weight.
- The walkthrough is recorded the day before (S42; FT24), and the capstone is Project 2, graded separately. Neither uses Final-day learner minutes.

So the learner minutes on the Final day are this MCQ plus the end-of-track coding assessments.
Their shape is the accepted assessment-shape decision (2026-11-19, supplied through this task's steering instruction, not in a repository file): four coding questions, each on a supplied scaffold, totalling 60 minutes.

| Final-day block | Minutes | Source |
| --- | --- | --- |
| Checkpoint MCQ (this bank) | 90 (was 60 at 30 items) | this blueprint |
| Spring Boot coding question 1 (supplied scaffold) | 10 | accepted shape decision |
| Spring Boot coding question 2 (supplied scaffold) | 20 | accepted shape decision |
| Python coding question 1 (supplied scaffold) | 10 | accepted shape decision |
| Python coding question 2 (supplied scaffold) | 20 | accepted shape decision |
| **Total learner minutes** | **150** (was 120) | |
| Calendar Gate block | 120 | calendar |

**Schedule verification (superseded for 45 items).** At 30 items, 60 + 10 + 20 + 10 + 20 = 120 minutes fit the Gate block exactly. At 45 items it is 90 + 10 + 20 + 10 + 20 = 150 minutes against a 120-minute Gate block: an open owner decision (above).
The honest qualification is that any fit has no slack: the 120 minutes include no separate time for reading instructions, opening the scaffolds or moving between sittings, so those must sit inside each question's allocation.
The scaffolds being supplied is what makes 10- and 20-minute coding questions plausible; no timed learner trial of either the MCQ or the coding questions has been run, so all five figures are allocations, not measurements.

The learner timings are estimates: "10", "20" and "60" are allocated minutes, not measured times.
If a later timed trial shows the Gate block does not fit, that is an owner decision; shortening this MCQ is the first lever (see Timing basis), and cutting it below 30 items or moving it to S42/FT24 would drop coverage or displace the accepted walkthrough day.

**Weight and pass mark (beta defaults).** The calendar gives the Final no MCQ weight, so the blueprint has an empty `weights` object: the checkpoint score does not enter the published Final composite.
Its `passMark` is 70, the Final pool cut score.
It is a readiness check reported to the learner's assessor, as the blueprint's learner instructions say: it is not a pass/fail gate and changes no grade in this beta.
Neither default changes the Final weights, the cut scores or Project 2's separate grading, and neither sets a programme-wide certification policy.

**Timing basis.** Two minutes per question, set on this bank's own load rather than borrowed.
The Foundation rule of 2 minutes per question governs only the four Foundation course finals.
The Standard/Fast course finals run faster: the HTML/CSS/JS course final in progress is 30 questions in 30 minutes, and the Git/Linux/AI 30-minute course final has 20 questions.
The base 30 is dense: 25 of its 30 items put code or configuration in the stem and ask for a trace or a multi-case outcome across five courses, and total reading load is about 2,200 words.
Every item was judged answerable in about 2 minutes; the longest traces are q04, q20 and q21.
No timed learner trial was run, so 90 minutes (60 at the 30-item base) is a beta baseline: if a timed trial shows learners finish well inside it, shortening the sitting is the first lever for giving the coding assessments more of the Gate block.

## Verification

- **Parse shape.** `authoring/tests/standard-fast-checkpoint-gift.test.mjs` validates the shipped bytes with `authoring/tools/gift/validate.mjs` in `[html]` mode: 45 questions, ASCII only, four options with exactly one key, no line GIFT import would drop as a comment.
- **Code blocks** use the indentation-safe literal-newline form from `authoring/tools/gift/code-newlines.mjs`: no numeric newline references and no unsafe code lines.
- **Key positions (45 items):** A 11, B 11, C 11, D 12, longest run 2.
- **Keys executed: 25 of the base 30** (q31-q45: see `standard-fast-final-checkpoint-45/key-verification*.txt` and `loop3-key-probes.txt`; q33 re-executed after the loop-3 reword on JDK 25 / Boot 4.1.2 first with standalone MockMvc and, after sfcp-l4-sme-01, on a real embedded server (`@SpringBootTest` RANDOM_PORT, real HTTP): the `MethodArgumentTypeMismatchException` handler in the controller returns 400 with the `Err` body; `@RequestParam`, advice and `parseLong` variants do not).
  - 24 are carried forward from the private authoring run, whose scripts printed PASS/FAIL per item and, where it mattered, checked that each distractor fails:
    - Spring (q01, q03-q08): Spring Boot 4.1.2 on JDK 25, Maven 3.9.16 offline, H2.
    - Python (q09-q13): CPython 3.14, pydantic 2.12.5, fastapi 0.121.3, httpx 0.28.1 with a mock transport. q11's upsert ran on SQLite's `ON CONFLICT ... EXCLUDED`, not PostgreSQL.
    - HTML/CSS/JS (q15-q20): Node 24 with jsdom 27; q15 checked arithmetically; q20 used stubbed `fetch` responses and a network rejection.
    - React (q21-q26): React 19.2, react-router 7.9, Testing Library 16.3 under jsdom.
  - The canonical SME critic re-ran q09, q10, q11 (SQLite), q16, q17, q18 and q20 under Python 3.14 and Node 24.
  - q27 (new in r7) ran on Node 24 as a plain-JS model: the stem's `handleStatus`, a router that honours `replace` and `state`, a sign-in step that returns to `state.from`, and an API that answers 403 to a non-admin. The key and the rejection of all three distractors printed PASS. It did not run react-router itself.
- **Page-grounded keys: 5** (q02 Flyway, q14 accessibility audit, q28 browser versus service name, q29 `depends_on` chain, q30 workflow `needs` and `push`).
- **Distractors.** Each wrong option is a named misconception with feedback saying why it is wrong. The key is the single longest option in 4 of the base 30 items and never more than 1.18 times the next option.

## Duplication

Lexical scan of the shipped bytes (stems and options, entity-decoded) by a scratch script that parses every bank it is given.
It read 258 files and parsed 1,660 questions. Two of those files were legacy containers mastery files from the retired module-mastery layer; that layer is outside the assessment hierarchy, so they are not a comparison target and the real overlap checks are the topic practice, module practice, Foundation and course-final banks below:

- 252 tracked GIFT files at `a00a6658` other than this bank and the test fixtures: every topic `artifact.gift`, module `practice.gift` and Foundation `final-mcq.gift`;
- the Foundation 45-question checkpoint;
- the in-progress HTML/CSS/JS and Git/Linux/AI course-final banks from their unmerged branches;
- the private Containers/CI-CD course-final candidate.

The scan was re-run on the final r8 bytes with the same corpus.
Result: 0 exact stem matches, 0 exact option sets, 0 shared 7-grams; highest stem trigram Jaccard 0.091 (q17 against the HTML/CSS/JS course-final q01), under the 0.2 flag threshold.
A lexical scan is a signal, not the gate: in authoring it reported nothing on a draft the critic found held 14 near-duplicates of formative items.
Near-duplicate judgement belongs to the critics in `standard-fast-final-checkpoint-critic-*.json` and their rechecks.

**Release gate.** The Spring Boot, Python, React and Containers/CI-CD course-final banks are not final yet.
The last whole-set duplication comparison runs against their final pins, and the checkpoint is not released for import until it does.
It must also settle one pair the education critic flagged as partial overlap, not a duplicate: q17 and the HTML/CSS/JS course-final q05 both turn on `let` giving each loop pass its own binding, with different setups.

## Review history

The bank was authored privately overnight and reviewed by an independent non-author critic for subject matter, education and duplication:

| Round | Change | Result |
| --- | --- | --- |
| r2 | first full draft | 15 high, 6 medium, 6 low: REVISE (14 near-duplicates of formative items, an ambiguous Flyway key, an untaught generator API, several Fast-skim items) |
| r3 | 20 items rewritten | 3 high, 2 medium, all keys correct: REVISE |
| r4 | 6 items changed | 0 high, 1 medium (a q20 to q07 leak) |
| r5 | one-line q20 fix | spot check of q20 only: 0 high, 0 medium, ACCEPTED |
| r6 | two precision edits from the critic's own low findings (q02 one distractor's feedback; q20 case (c) worded as a network failure with no response) | not rechecked privately |

Canonical review in this folder (two independent critics, then a non-author reconciler):

- **Loop 1 on r6.** The SME critic confirmed both r6 edits and found q27, the Dockerfile layer-caching item, a near-duplicate of a formative item whose deciding fact sat on the Fast-skimmed image-layers page (high), with an arguable second key (medium). The education critic found no high; its mediums were documentation fixes (the React auth-and-review gap reason and an unsourced schedule precedent, since removed).
- **r7.** q27 was replaced by a React auth-and-review item at the same key position, the blueprint gained the objectives the critics found missing, and this file was corrected. No other item changed.
- **Loop 1 recheck on r7.** Both critics resolved the high and every medium. The education critic found the new q27 stem gave away the redirect (it said Mia signed in again), leaving a two-way choice (medium); the SME critic noted option A settled one of q08's distractors (low).
- **Loop 3 fixes (45 items).** q33's stem no longer shows a 400 for a non-numeric id (and, per sfcp-l4-sme-01, no longer claims the default body lacks an `error` field: Boot's default 400 body does have one, so the stem says only that the specific message `id must be a number` is missing) (it leaked q01 option B, sfcp-l3-sme-02) and now asks, as an applied front-end case, which change restores the old response; key letter and objective unchanged. q37 is kept as the recorded skim exception (sfcp-l3-edu-01). This file was brought up to the 45-item, 90-minute bytes (sfcp-l3-edu-02); the 150 versus 120 minute Final day stays an open owner decision.
- **r8.** q27's stem now stops at the 403 and each option states the full sequence, so rejecting the not-allowed option needs the code reading; "not 401" was dropped from option A. The key stays at C and the plain-JS model re-ran with all four results PASS. This file's allocation sentence and release gate were corrected. No other item changed.

## Limitations

- No PostgreSQL server, Docker engine or GitHub Actions runner was used: q11 ran on SQLite, and q28-q30 are page-grounded.
- No platform import, timed learner trial or learner data.
- The Final-day fit is an open owner decision (150 learner minutes at 45 items against the 120-minute Gate block) and rests on allocated, not measured, durations; no timed trial has been run.
- The final whole-set duplication comparison waits for the remaining course-final pins.
