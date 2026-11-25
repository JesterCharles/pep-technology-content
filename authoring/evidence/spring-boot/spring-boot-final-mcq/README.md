# Spring Boot course final MCQ: private candidate (correction loop 2)

This is the graded MCQ part (Part 2) of the Spring Boot course final (`spring-boot-final-assessment`): **22 questions in 30 minutes**, plus a private reserve of 5 corrected questions.
It is **not** a delivery. Both critics recheck it against the new hashes next, and a canonical task consumes it after that.
Nothing here has been imported into a platform or committed to any repository.

## Item count: 22, and why

30 minutes is the hard limit; 30 questions was only the default target.
The corrected 30-item bank does not fit 30 minutes under the timing model defended below, and trimming further would have removed context the items need.
So 22 items ship. Five corrected, key-proven items (q04, q05, q13, q23, q24) move to `reserve-mcq.gift`.
Three v1 slots are retired rather than replaced: q07 (health-checks, see E1), and q19 and q22, whose v1 items duplicated taught material. This departs from the brief's per-slot actions (new primary or retarget); their topics now decide options in q12, q16, q21, q26 and q27.
Every taught topic except E1 still decides at least one option (rule R; `coverage.json` `topicCoverage.*.decides`).
Loop 2 replaced q17, restored q28's v1 diagnosis question, replaced q25 option D, and made clarity edits to q14, q15 and q21.
Item ids keep their v1 slot numbers so the reviews stay traceable. The ids are therefore not consecutive, and a delivery task may renumber them.

## Timing: a modelled estimate, not a measurement

No learner has timed this bank.
The model uses the frozen estimator `authoring/tools/timing/estimate_reading.py` (sha256 `0deca96b...`):
- 200 words per minute for the stem and four options;
- 4 s per non-blank code line;
- a decision cost per item.

| decision cost | total for 22 items | longest item | status |
| --- | --- | --- | --- |
| 45 s (the estimator's `mcq` cost; **defended**) | 29.08 min | 88.7 s | fits 30 min |
| 30 s (the estimator's `predict` cost; gate G as reconciled) | 23.58 min | 73.7 s | fits; every item is at most 75 s |

- The 45 s figure is the estimator's own cost for an applied multiple-choice decision, which is what a graded item is. The 30 s cost is a page-activity figure and is not learner-tested for exam items, so it is reported only as a sensitivity.
- The bank stays within 30 minutes for any decision cost up to about 47.5 s per item. Code is laid out one statement per line, as on the pages; no lines were joined to lower the estimate.
- The estimator's P90 (1.45 × P50) would be 42.17 min. Pages are gated on P50, and this note does the same.
- At this bank's mean, 30 items would model at 32.15 min (30 s) and 39.65 min (45 s); bank plus reserve (27 items) models at 36.5 min (45 s).
- `audit.txt` section 3 has the per-item table.

## E1: health-checks

E1 is a sampling limit on this shared graded bank only, set by captain decision D1 = A.
`integration-and-observability/module.json` gives health-checks no Fast row, so a bank that both tracks sit does not sample it.
Health-checks stays in Standard teaching, its topic practice MCQ, the integration-and-observability coding lab (HealthEndpointTest) and source coverage.
The existing 40-item blueprint is broader than this shared-bank contract at this point, because it maps health-checks o1 and o2 to the MCQ. `blueprint-proposal.json` leaves them unsampled pending E1 sign-off.

## Files

| File | What it is |
| --- | --- |
| `final-mcq.gift` | The graded bank: `[html]` GIFT, ASCII only, category `spring-boot/assessments/spring-boot-module-check`. It holds 22 items with slot ids, ordered easy to hard (5 / 11 / 6 by band). Answer-bearing. |
| `reserve-mcq.gift` | Private reserve: 5 corrected items in the same format, validated, not graded and not trimmed for time. Answer-bearing. |
| `coverage.json` | Per item: set (bank or reserve), band, primary objective, `decides` (topic, role, objective), skim flag, form, value-free context, value-free `differsFrom`, and proof. Also `topicCoverage` with `decides` per topic, exception E1, reserve reasons and a summary. |
| `blueprint-proposal.json` | Value-free proposal to change the 40-item / 50-minute MCQ part to 22 items / 30 minutes. It includes the item-count rationale, E1, the objective-format changes and the modelled time-fit note. The practical is unchanged. |
| `audit.txt` | Value-free results: the item-count choice, validator and test-rule checks, cues, timing (G at 30 s and 45 s), the R table, T for the replacements, the key-proof totals, dedup and the Fast-page grep. |
| `check-bank.mjs` | Re-runs the format checks and prints counts only. Use `--reserve` for format-only checks on the reserve. |
| `key-proof/harness/` | Maven multi-module harness (Spring Boot 4.1.2 parent, Java 25): `core` (web, JPA, validation, RestClient), `sec` (Security 7 resource server) and `fly` (Flyway). Sources only. Answer-bearing. |
| `key-proof/run.sh`, `results.mjs`, `item-tests.tsv`, `results.txt` | Runs the harness offline and maps each bank and reserve item to its test classes. `results.txt` is regenerated in loop 2. |

## How to re-run

```sh
node check-bank.mjs /path/to/pep-technology-content
node check-bank.mjs /path/to/pep-technology-content reserve-mcq.gift --reserve
KEYPROOF_M2=/path/to/primed-m2,$HOME/.m2/repository bash key-proof/run.sh
```

`KEYPROOF_M2` is passed as `-Dmaven.repo.local.tail`, so those repositories are only read.
The author run used a primed scratch repository followed by `~/.m2/repository`. Maven ran with `-o`, and the throwaway local repository stayed empty.

## Notes for the delivery task and page owners

- **Category.** The category stays `spring-boot/assessments/spring-boot-module-check`, as briefed. The canonical task sets the category to the delivery folder path, per the test convention.
- **Repository test.** `authoring/tests/course-final-gift.test.mjs` hard-codes 30 questions and a floor of at least 7 per letter for registered banks. Registering this 22-item bank needs a per-bank count, with the floor at floor(N/4) = 5. That is a tooling change outside this loop. `check-bank.mjs` already applies the parametrised rules.
- **Page owner, relationship-pitfalls Activity 1.** Option C's feedback ("can happen without orphanRemoval") contradicts the page's own model, which prints "no delete (row stays)", and the v1 key proof, which executed that case. Removing a child from an inverse `mappedBy` collection without `orphanRemoval` deletes nothing. The page owner should correct that feedback; this bank no longer depends on it.
- **Page owner, problem details.** In the loop-1 harness run, the JSON of a handler-built `ProblemDetail` left out one member that the page's Activity 3 sample body shows. The page owner should check that sample against Boot 4.1. The loop-2 q17 does not depend on it.

## Limitations

- 18 of the 43 sampled topics decide only through a distractor, not a key.
- q14 states a foreign key in the stem; relationship-pitfalls says cascades "can delete far more than you meant", which may pull learners toward an all-deleted distractor. That tension is intended, and executed.

- The proof was run only on macOS, with OpenJDK 25.0.5.1 and Maven 3.9.16, on 2026-11-19. No hosted CI was used.
- One earlier run with a long scratch `TMPDIR` failed a `@MockitoBean` test. Use the default `TMPDIR`.
- The bank has not been imported into Moodle or the delivery platform, so `<pre>` rendering there is unverified.
- The behavioural keys run against H2. Items show trimmed code; the harness holds the full runnable equivalent.
- Lexical dedup is only a signal. The real dedup is the reading recorded in `differsFrom`, and a critic should repeat it.
- There are 26 old MCQ-only objectives no longer sampled in the final (21 in v1), because there are fewer items. `blueprint-proposal.json` lists them for the critics to accept or swap.
