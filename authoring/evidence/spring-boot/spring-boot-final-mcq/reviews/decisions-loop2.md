# Reconciliation loop 2 (terminal): Spring Boot course-final MCQ

- **Role:** non-author reconciler. **Date:** 2026-11-19.
- **recheck.of:** decisions-loop1.md.
- **Basis:** captain decision `cf-loop2-decision.txt` (terminal loop, Option 1); T, R and G as defined in `decisions.md`.

| Input | sha256 |
| --- | --- |
| final-mcq.gift | 4908a83ac1150c2204fa813bbbe211305de1295bd03713dd1d68db0818eabb7d |
| reserve-mcq.gift (= v2) | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| blueprint-proposal.json | bdc1231f8e4d1ba1980a3ab9d1ab7a01b1a394ba0f927ebdeff24395b7c3035d |
| coverage.json | 000039470f9bcf6058023bd9981cac02348e4d5f1697b5d5f86caa840687a7bf |
| audit.txt | 0e19f8093ff81da2c9bb539b63e6ab5651fa785896260a410289bdb9fad5cecb |
| README.md | ced6352b11475e698a7e37337cedab9e234b06afb239ba1329d0a8d9ff7c2bd0 |
| key-proof/results.txt | a6b4e5a927a388fc77748043e7e157c7876b2395f104c22a68168eb98c9c962b |
| reviews/education-recheck-loop2.md | e6b6ac5cef2de3f82908dbb447074217864a0447b327baaba199fddbda26f505 |
| reviews/sme-recheck-loop2.md | 6eb83c10b57a7ef3161ccc8a8acf64b33d56790f101d17ddb25eec8c590bb136 |
| reviews/decisions-loop1.md | 75974db355287fbb0b794337b803a8f554ddd9057ace87c0f01970d5f55b46a1 |
| SCR/cf-loop2-decision.txt | 0b85bd15f817628585751518256acd611e1d8a2a008dd97717157743affd367b |
| SCR/cf-v2-snapshot/final-mcq.gift | c0167b686833ea23bb415020121fc253650e21b84f20d1bc851db00573e3a59a |

## Own byte checks

- **Diff against v2:** only q14, q15, q17, q21, q25 and q28 changed. No item was added or removed, and the header is unchanged.
- **Keys:** A6 B6 C5 D5, longest run 2. q17, q25 and q28 still key C, as bound.
- **Gate G, from my own corrected script:** reading 12.57 min; 29.07 min at 45 s and 23.57 min at 30 s; maximum item 88.7 s at 45 s (q02). This agrees with the audit's 29.08.
- **Rule R:** 43 of 44 topics decide an option; only health-checks (E1) does not. Problem-detail decides q17 key o2 and distractor o1. Fixing-n-1 decides q25 D. Dev-profile decides q28's key and an-integration-test decides q28 B.
- **Key proof:** `results.txt` shows 20/20 bank keys executed plus 2 cited, and 4/4 reserve keys plus 1 cited. SME probes are reported for q14, q17, q25 and q28.

## Loop-1 binding corrections, verified on bytes

| id | status | evidence |
| --- | --- | --- |
| CFE-13 / SMR-1 (q17) | resolved | The setup is three failing requests with `problemdetails.enabled`, and no handler returns a ProblemDetail. The item is decided by the property's scope: Spring MVC's own exceptions use problem details, while the app's unhandled exception still gets the default error response (problem-detail Activity 3 and global-error-handling Activity 3). Status, media type and setProperty decide nothing, and the item never says "always". **Correction to the education recheck:** legacy validation practice Q6 is topic practice by its taught topic, not "outside the hierarchy". q17 still passes T, because Q6 is a bare rule recall with no setup, and q17's key applies that rule's boundary rather than restating Q6's key. There is no overlap with sfcp-q01 to q08. |
| CFE-14 / SMR-2 (q28) | resolved | The v1 diagnosis form is restored. Key C combines both causes. No option states the `o2 proving` remedy, and option A is a wrong consequence. |
| CFE-19 / SMR-3 (q25 D) | resolved | D now claims that lazy loads batch by default. The taught fixing-N+1 fact refutes it (batching needs `default_batch_fetch_size`); the neutral stem does not. It has a contrast run. |
| CFE-18 / SMR-4 (q14) | resolved | The key now reads "Cascading … fails on the foreign key; everything rolls back", which matches Q14Test. |
| CFE-17 (q21) | resolved | The cue phrase is gone. |
| CFE-15 (q15) | resolved | The remedy sentence is cut, and option C is kept. |
| SMR-5 (E1 wording) | resolved | README line 40 and `exceptionE1.note` cite topic practice, the coding lab (HealthEndpointTest) and source coverage. "mastery" appears nowhere in README, blueprint, coverage or audit. |
| CFE-16 | closed | Ruled low/partial in loop 1. |

## New findings

| id | ruling | final sev | basis | disposition |
| --- | --- | --- | --- | --- |
| CFE-20 | accept | low | q28's second clause in the key paraphrases the stem's premise. A shares the first clause, so the choice turns on knowing that permitAll admits signed-in users, not on the echo. | Disclosed, not fixed. |
| CFE-21 | reject | none | The problem-detail page itself says "default Boot error JSON" twice, besides "default error body" and "default error response". The key's term is page wording. | No action. |
| SMR-6 | accept | low | "Both causes are needed" is loose. Precisely: both hold here, and removing only one would still not catch this change. The key itself is correct (SME matrix). | Disclosed, not fixed. |
| SMR-7 | accept | low | q14 option B feedback still says "deletes its shared garden" when it means "tries to delete". The feedback is shown only after answering, and the key is accurate. | Disclosed, not fixed. |

**Open findings:** 0 high, 0 medium, 3 low (CFE-20, SMR-6, SMR-7). CFE-21 is rejected.

## Hand-off determination

**ACCEPTABLE as the private course-final hand-off**, with the residual lows disclosed and not fixed.
- No high or medium remains. Both critics approve independently.
- Every binding correction holds on the bytes, and every changed key is executed.
- G passes at 29.07 min against the hard 30.

The loop is terminal. Delivery still requires the canonical task; no commit, publication or platform import is authorized by this record.

## Disclosed limits (travel with the hand-off)

1. **Timing is modelled, not learner-timed.**
   - The defended model gives 29.07 min at 45 s per decision, with about 0.9 min of slack.
   - It gives 23.57 min at 30 s.
   - The education critic's conservative model gives 26.0 min.
   - The README's P90 view gives about 42.6 min.
   - q25, q27 and q28 take about 90 s each under the conservative model.
2. **E1 (D1 = A).** Health-checks is Standard-only and is excluded from this shared bank; health-checks o1 and o2 are unsampled. Coverage stays with the topic practice MCQ, the integration coding lab and source coverage.
3. **22 graded items, not 30.**
   - There is a 5-item reserve, not graded and not to be restored within 30 minutes.
   - Bands are 5/11/6.
   - Coverage is by topic; 26 MCQ-only objectives are unsampled.
4. **Tooling is needed before delivery.** `course-final-gift.test.mjs` hard-codes 30 questions (line 59) and at least 7 keys per letter (line 90). The bank has 22 questions and A6 B6 C5 D5, so delivery needs a tooling change.
5. **Category and path.** The header category `spring-boot/assessments/spring-boot-module-check` and the delivery path are set by the canonical task, using the folder-path convention.
6. **Proof scope.**
   - Proof ran on macOS only, offline, with H2 only.
   - There is no hosted CI and no Linux run.
   - Moodle rendering of `<pre>` and `&nbsp;` is unverified, and the bank has not been imported into a platform.
7. **Page-owner notes.** The wording of relationship-pitfalls Activity 1 option C feedback ("can happen without orphanRemoval") is for the page owner. No page edit was made in this task.
8. **Retirement deviations.** q07 (health-checks, E1), q19 (password-hashing; it now decides q27 D) and q22 (MockMvc; it now decides q21 D) were retired rather than replaced. Item ids keep gaps.
9. **Residual lows, not fixed:**
   - CFE-20: q28 stem echo.
   - SMR-6: q28 "both causes are needed" wording.
   - SMR-7: q14 option B feedback says "deletes" instead of "tries to delete".
