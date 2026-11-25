# Education and SME critic review, loop 3: the 30-item extension (delta only)

recheck.of=decisions-loop2.md

- **Role:** an independent critic pair, education and Spring SME (Boot 4.1.2, Java 25). We did not author the bank. **Date:** 2026-11-19.
- **Scope:** only the delta from the accepted 22-item bank:
  - new items q31, q32 and q33;
  - the five reserve items promoted into the bank (q04, q05, q13, q23, q24);
  - cross-item cueing: q23 D → q25 D, q24 → q11, q24 vs sfcp-q06 and q26 vs sfcp-q08.
  - This is not a whole-bank campaign.
- **Bar:** T (same setup and same deciding fact) and R (every taught topic decides an option), as defined in `decisions.md`. Cueing is judged on stem and option text only, because feedback is not shown during the attempt.

| Input | sha256 |
| --- | --- |
| final-mcq-30.gift (reviewed) | ef34aa9b64708052e5a9173e19360eb70d0a6d7082163f6162288ce4d6bb8127 |
| coverage-30.json (reviewed) | 3a6143957329560b77ee72c9e9dc889e81e342df2633379fded3e36825b994bd |
| blueprint-30.json | dafcb2fff0fcd30ddf5d38442c891ac856bef600fb1d507cb0569f6930e1b86c |
| final-mcq.gift (22, base) | e166262b67b5fe243c6871417d8dfb3f9983a9c66ae360122d38ddc27468a117 |
| reserve-mcq.gift (base) | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| checkpoint-mcq-45.gift | ff929875b4b805c7ee7fcf9ae2815d7dd872960d53e1bd017ecf8a63a77f36fb |

## Byte and key checks

- **Bytes.** The 22 accepted items are byte-identical to the base bank. q04, q05, q13, q23 and q24 are byte-identical to `reserve-mcq.gift`, which SME loop 2 approved. q31 to q33 are the only new items. Keys: A8 B7 C8 D7.
- **Re-runs.** We re-ran the new keys on our own copy of the harness (JDK 25.0.5.1, Maven 3.9.16, offline), with 0 failures:
  - `ferry.Q31Test` 1/1
  - `sbf.q32.Q32TransactionalAddsFirstTest` 2/2
  - `sbf.q32.Q32TransactionalEmptyFirstTest` 2/2
  - `sbf.q32x.Q32NoTransactionalTest` 2/2 (contrast)
  - `sbf.q33.Q33Test` 2/2
- **Reserve keys.** Not re-run, because their bytes are unchanged.
- **Taught scope.** We read these sources:
  - logging-in-spring Activities 2 and 3
  - an-integration-test Activities 1, 3 and 4
  - relationship-pitfalls Activity 3
  - lazy-and-eager-loading Activity 3
  - how-auto-configuration-works
  - entities-and-ids
  - rest-design-recap
  - global-error-handling
  - path-query-and-body-parameters

## Verdict

**Approve with fixes.** 0 high, 2 medium and 6 low.

## Findings

| id | sev | item | finding | fix |
| --- | --- | --- | --- | --- |
| CFE-22 | medium | q24 → q11 | The stem says "After this advice was added … answers 500" and asks "Why did the status change?". Option B mentions "Spring's built-in handling of bad requests". Together they tell the learner that, without the advice, a missing required `@RequestParam` is not a 500 and is handled as a bad request. That refutes q11 D. CFE-10 only partly fixed this, and the fix held only while q24 was in the reserve. The blueprint does not set sequential navigation. | Reword only, so Q24Test still holds: drop the before/after framing and remove "bad requests" from B. Alternatively, deliver with sequential navigation. |
| CFE-23 | medium | q23 D, q25 D | D ("…so the gardens load in one batch") refutes itself against the stem's "removes". Its text also presents batching as an opt-in setting, which cues q25 D away. q25 D is the only option where fixing-n-1 decides (R). | Replace D with an option that does not mention batching and that a taught fact refutes, and add a probe for it. |
| CFE-24 | low | q05 | The loop-1 replacement B ("deleted a second locker") is implausible, and the key is the longest option. | Use the misconception "a different status means not idempotent", and trim the key. |
| SMR-8 | low | q33 | The stem says only "root level is INFO", but q16 in the same sitting teaches that package levels override the root level. If the controller's package were at DEBUG, (b) would also fail. | State that no `logging.level.*` is set. |
| CFE-25 | low | q31 | The deciding fact is almost verbatim from logging Activity 3, so the item reads at band 2. B and C are weak. | Harden one distractor, or re-band the item. |
| CFE-26 | low | q24 vs sfcp-q06 | Passes T. The deciding facts differ: sfcp-q06 turns on local-handler precedence, while q24 turns on `Exception.class` swallowing a framework 4xx. They share the surface "Something went wrong" handler. | Optional: rename the handler and change the body. |
| CFE-27 | low | q26 vs sfcp-q08 | Passes T. The deciding facts differ (rule order vs the JWT authority converter), and the items share only `anyRequest().authenticated()`. | None. |
| CFE-28 | low | bank | The model gives 33.8 min (30 s decision cost) and 41.3 min (45 s) against 30 minutes. Six items model over 75 s. | Owner decision; non-blocking. |

## Per item

| item | verdict | note |
| --- | --- | --- |
| q31 | approve | The key is unique and proven, and the item is a step beyond topic bank o2 and practice Q6 (CFE-25). |
| q32 | approve | Same setup as integration-test Activity 4, but a different deciding fact: rollback when the test ends, with the MockMvc request inside the test transaction. Passes T. B adds the step-up. |
| q33 | approve with fixes | Combines three taught facts; SMR-8. |
| q04 | approve | how-auto-configuration-works now refutes D (CFE-8 resolved). |
| q05 | approve with fixes | CFE-24. |
| q13 | approve | Fits entities-and-ids: a null id counts as new, and assigned ids need care. |
| q23 | approve with fixes | CFE-23. |
| q24 | approve with fixes | CFE-22. |

Other pairs swept with no leak found: q24/q17, q24/q29, q32/q28, q32/q15, q33/q16, q33/q23 and q04/q01.
