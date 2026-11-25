# Spring course-final MCQ: replacement independent SME recheck, loop 1

## Who, when and how

- **Role.** Replacement independent Spring SME critic. I did not author the bank and I did not reconcile it. I am read-only on the candidate files. Date: 2026-11-19.
- **Session and access.** This review runs in the existing authenticated Claude session (the same unpinned account, already in use). No account, pin, provider or runtime was changed, and no credentials were printed.
- **What I wrote.** This file and my status record, nothing else.
- **What I did not do.** No fetch, checkout, project edit, commit, push, browser check, no-mistakes run or forge/platform operation.
- **Hierarchy applied (Firstmate 010/011).** There are three layers:
  - topic-level practice MCQs (`artifact.gift`);
  - module coding labs;
  - the course-level graded MCQ.

  There is no separate module-mastery MCQ layer.

## Inputs (sha256 verified before review)

| File | sha256 | Note |
| --- | --- | --- |
| final-mcq.gift | c0167b686833ea23bb415020121fc253650e21b84f20d1bc851db00573e3a59a | Matches the required value. |
| blueprint-proposal.json | c179017623fbca159f94a595881c77e8235dca9cb75e66e706efd0d0f2c5b340 | Matches the required value. The brief named `blueprint.json`, which does not exist. Firstmate 012 confirmed that this file is the intended input. |
| reserve-mcq.gift | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc | Matches the hash the education recheck lists. |
| coverage.json | ff300c84925419a991c66c76f8a628665a2e84310e08602d8b4ba91d233e7653 | Matches the hash the education recheck lists. |

The references were read at MAIN `a00a6658` with `git show` and `git grep` only:
- the learner pages and topic practice banks;
- `authoring/catalog/spring-boot/*/module.json` (the Fast mapping notes).

I also read the checkpoint bank, `data/pep-standard-fast-final-checkpoint-gift/private-authoring-candidate.gift` (sfcp-q07 at lines 86–97), and its whole-set dedup report.

## Execution

- I copied `key-proof/harness/` to my own scratch directory.
- I did not use `run.sh`, because it rewrites the candidate's `results.txt`.
- I ran `mvn -o -q -B -fae test` with JDK 25.0.5, Maven 3.9.16 and the Boot 4.1.2 BOM. The tail repositories were read only, and nothing was written to the throwaway local repository.
- Result: exit 0. core 23/23, sec 5/5, fly 2/2, so 30 tests and 0 failures. This covers every bank and reserve item except the cited conceptual keys.
- I audited Q14Test, Q17Test and Q28Test for stem fidelity.
  - **q14:** one bed delete and one garden delete are attempted. The constraint rejects the commit. All 3 beds and the 1 garden remain.
  - **q17:** no Accept header. The response is 503 and application/problem+json, with the detail and `retryAfterSeconds` as a top-level member, plus a generated title and instance.
  - **q28:** under dev, anonymous gets 200 with either chain. Without dev, the correct chain gives 401 and the mutated chain gives 200.

## Verdict

**REVISE.** Every key in the 22-item bank and the 5-item reserve is technically correct for Boot 4.1.2, Java 25 and Security 7. My run reproduced every executed key, and the cited keys are sound.

The two education highs stand, independently confirmed:
- q17 materially duplicates checkpoint sfcp-q07.
- q28 has become recall of a topic-practice key.

Both fixes are bounded single-item edits. The rest of the bank does not need rework.

## Findings

| id | sev | item / evidence | finding | required fix |
| --- | --- | --- | --- | --- |
| SMR-1 | high | q17; checkpoint sfcp-q07 (`private-authoring-candidate.gift` lines 86–97) | **Upholds CFE-13.** See the q17 details below. | Replace q17 under T. Keep band 2 and key letter C. Keep its modelled time at or below the current q17's (see Timing). Avoid "handler returns ProblemDetail" as the setup, and avoid status, media type or setProperty as the deciding fact. |
| SMR-2 | high | q28; the topic practice item and page teaching listed below | **Upholds CFE-14.** See the q28 details below. | Restore the v1 diagnosis form ("why did no test catch it?") with the clarified premise. The deciding fact must be diagnosing the cause (dev active, so the real chain is never built, and the assertions cover only signed-in 200s), not naming the practised remedy. Keep band, letter and length within the current q28 time. |
| SMR-3 | low (new) | q25 option D; coverage `fixing-n-1` | See the q25 details below. Related to CFE-16 and CFE-19. | Replace D with a distractor that a taught fact refutes, not the stem. For example, a JOIN-FETCH misconception that the DTO mapping makes the page query fetch tracks. That gives fixing-n-1 a real deciding role. Do not lengthen the key (see the CFE-16 assessment). |
| SMR-4 | low | q14 key text; Q14Test | **Agrees with CFE-18, as a technical-accuracy point.** The key opens "Garden 1 is deleted too". In fact the garden delete is attempted, the foreign key rejects it, the transaction rolls back, and nothing is deleted (Q14Test asserts 3 beds and 1 garden remain). A learner who knows the outcome may reject the key on its first clause. | Reword along the lines of: the cascade tries to delete the shared garden too, the foreign key rejects it, and the whole transaction rolls back. Keep it no longer than the current text. |
| SMR-5 | low (new) | README "E1" paragraph and `blueprint-proposal.json` E1 wording | See the E1 details below. | Restate E1 standard coverage as topic practice MCQ plus the integration module lab and source coverage. No new MCQ layer. |

**q17 details (SMR-1).**
- The setup is the same as sfcp-q07: an `@ExceptionHandler` in the advice returns `ProblemDetail.forStatusAndDetail(...)` with one setter, and the learner predicts the response.
- Two of q17's three deciding facts are taken from sfcp-q07:
  - "the status comes from the returned ProblemDetail" refutes q17 option B, and it is sfcp-q07 option A's feedback;
  - "the body is written as application/problem+json" refutes q17 option D, and it is sfcp-q07's key.
- The third fact, that setProperty adds an extra member, is taught on `standard-error-responses-with-problemdetail` (the page's setProperty use was confirmed by `git grep`).
- A learner who sat the checkpoint can therefore reach the key by recall.
- The key itself is correct (Q17Test, my run).
- Minor and moot once replaced: option D's feedback says the type is "always" application/problem+json. That was not executed under a restrictive Accept header, so do not carry "always" into the replacement.

**q28 details (SMR-2).**
- **Comparison source:** a topic-level practice MCQ, in the formative quiz at `spring-boot/api-security/a-dev-profile-that-keeps-endpoints-open-during-front-end-work/artifact.gift`, item `o2 proving`.
  - Its key: "Run security tests without the dev profile and assert 401".
  - Its distractor: "Run only with dev active".
- The same page's Teaching section also has the fact. It lists "Test without dev … a protected endpoint must answer 401" and prints `DefaultProfileIsProtectedTest` (anonymous, then `isUnauthorized`).
- q28's key is the o2 key paraphrased, and q28 option A paraphrases o2's distractor. This is a real duplicate against topic practice, so I preserve it.
- It is not a checkpoint or module-layer overlap.
- The key is technically correct (Q28Test, my run).

**q25 details (SMR-3).**
- Option D ("3: page, count, one select for all 50 track lists") is refuted by the stem alone, which says "no batch fetching is configured".
- So it does not discriminate, and q25 behaves as a 3-option item.
- It is also the only place where fixing-n-1 "decides". That coverage is nominal: the stem decides it, not the taught fix. JOIN FETCH is tested nowhere.

**E1 details (SMR-5).** Under the corrected hierarchy there is no module-mastery MCQ layer. The README says health-checks stays covered by "its topic quiz, its mastery check and source coverage", and the blueprint's E1 text carries the same idea. Standard learners' health-checks coverage is the topic practice MCQ and the module coding lab, `integration-and-observability/coding-lab`. Delivery wording must not cite a mastery-check MCQ as compensation. This is a wording point only: it changes no item and does not reopen E1 (D1 = A).

## Assessment of the education mediums and lows (not adopted automatically)

| id | education | SME ruling | reason |
| --- | --- | --- | --- |
| CFE-15 (q15) | medium | **low; partly agree** | Feedback is shown after the answer and restates taught content (`how-transactions-work-in-spring`). The leak risk to the toolshed/pickup coding tasks or Project 2 exists only if MCQ feedback is visible before those are done. That is a delivery review-option question: release feedback after the assessment closes. Cutting the remedy sentence is cheap and also saves reading time, so do it. I disagree that option C is implausible: "the later change is kept, the earlier one undone" is the classic reversed-scope misconception. Keep C. |
| CFE-16 (q25) | medium | **low; partly agree** | The item still asks for a computed count that combines the Page count query with N+1, so it is applied. The band-3 label is generous. Restoring the "batch 50 → 3" pairing into the key would add reading time against about 0.65 min of slack under the defended 45 s model (README, audit section 3). Prefer SMR-3, which gives a real distractor and real fixing-n-1 coverage at the same length. |
| CFE-17 (q21) | low | **agree, low** | "only the URL changed" points at the mismatch. The item still needs the argument-matching rule. Dropping the phrase also saves time. |
| CFE-18 (q14) | low | **agree, low** | See SMR-4. |
| CFE-19 (coverage) | low | **agree, low** | Fixing-n-1 coverage is nominal (SMR-3). rest-design-recap via q29 C is acceptable, because its feedback names the fact. |

## Checked and confirmed

**Technical correctness.** Each item was reviewed against Boot 4.1.2, Security 7 and Hibernate 7 semantics, and the executed ones were confirmed by my harness run:

| items | confirmed behaviour |
| --- | --- |
| q01 | missing version, so validate fails |
| q02 | path versus query parameters versus required body |
| q03 | prototype per injection point: 1, 2, 1 |
| q06 | 201, no Location |
| q08 | the qualifier overrides the primary |
| q09 | the environment variable outranks the file, and the profile file overrides the base file |
| q10 | the Or/True/OrderByDesc derivation |
| q11 | `@RequestParam` on a path id gives 400 |
| q12 | data rules belong in the service |
| q15 | separate proxied transactions |
| q16 | readOnly disables the flush |
| q18 | `retrieve()` throws on 4xx, and it is unhandled, so 500 |
| q20 | validate fails on the missing column |
| q21 | an unmatched stub returns the default, so 200 |
| q25 | 52 statements, because 200 rows exceed the page size, so the count runs |
| q26 | first match wins |
| q27 | per-instance HMAC keys |
| q29 | 500 should be mapped to 404 |
| q30 | 401, 400 and 403 ordering |
| reserve q04, q13, q23, q24 | executed |
| reserve q05 | cited; sound |

**Every distractor is wrong.** The key is never ambiguous, apart from the SMR-4 wording.

**Taught-topic scope shared by Standard and Fast.**
- I spot-checked the deciding APIs with `git grep` on the pages at `a00a6658`: prototype scope, Primary/Qualifier, the Or/True derived query, readOnly, setProperty, PagedModel, `retrieve`/`onStatus`, Flyway ddl-auto, cascade REMOVE, `@MockitoBean`/thenThrow, `requestMatchers(HttpMethod…)` and `withSecretKey`.
- Each one sits on a topic page in a module with a Fast row (`module.json` sourceCoverageNotes).
- Caveat: `audit.txt`'s grep ran over all 45 pages, not over Fast-only pages.
- Standard-only topics are constructor-injection-across-layers and health-checks.
  - No item's key or deciding distractor depends only on the constructor-injection-across-layers page. The single-constructor fact in q08 D is also on `dependency-injection-replacing-manual-wiring`.
  - Health-checks is excluded (E1).
- q18 rests on a Fast skim row (integration FT8 rows 0–1). That is taught, but on lighter emphasis. No change needed.

**Key and distractor quality.**
- Keys count A6/B6/C5/D5 from the bytes.
- The longest run is 2. Per the audit, the key is the single longest option in 3 items.
- No grammatical or absolute-word cue was found in any key.
- The one stem-refuted distractor is SMR-3.

**Easy-to-harder balance.** Bands run 5/11/6 in slot order, and the progression is sound. q25's band 3 is generous (CFE-16).

**Honest 30-minute fit.**
- The fit is modelled, not measured. No learner timing exists.
- At the defended 45 s decision cost it is 29.35 min, with about 0.65 min of slack. At 30 s it is 23.85 min. The P90 view is 42.56 min, as the README says.
- 30 minutes is the hard limit. 30 questions is only a target, so 22 is defensible and the reserve must not be restored.
- Consequence: the SMR-1 and SMR-2 replacements, and any SMR-3 or SMR-4 rewording, must each model at or below the time of the item they replace. Re-run gate G after the edits.

**Topic coverage versus objective sampling.**
- Topic coverage is defensible. Every taught topic except E1 decides at least one option (spot-checked). 18 topics decide only through a distractor, and fixing-n-1's role is nominal (SMR-3).
- This is topic coverage, not complete objective sampling. `blueprint-proposal.json` leaves 26 MCQ-only objectives unsampled for the critics to accept or swap, and health-checks o1 and o2 are left unsampled under E1. Neither should be presented as full objective coverage.

## Disclosed limits

- No learner timing exists.
- Health checks are taught on Standard but excluded from the shared graded bank (E1, D1 = A).
- 30 minutes is hard, while 30 questions is only a target.
- Python and module-check overlap facts are unrelated and were not assessed.
- The proof ran only on macOS, offline, with no hosted CI. Moodle rendering of `<pre>` is unverified.
- This file-only review clears none of the GUI, DNS, forge or Claude-owner blockers.
- I did not answer the implementation decision, reconcile my own findings, authorize loop 2, or start the Spring 10+20 coding reductions.
