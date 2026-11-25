# Reconciliation, loop 1: Spring Boot course-final MCQ

- Non-author reconciler (same as loop 0). Date: 2026-11-19.
- recheck.of = decisions.md.
- Binding rulings: D1 = A; 30 minutes is a hard limit and 22 items is accepted; three-layer hierarchy (no module-mastery MCQ layer); loop 2 not authorized.

| Input | sha256 |
| --- | --- |
| final-mcq.gift | c0167b686833ea23bb415020121fc253650e21b84f20d1bc851db00573e3a59a |
| reserve-mcq.gift | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| coverage.json | ff300c84925419a991c66c76f8a628665a2e84310e08602d8b4ba91d233e7653 |
| blueprint-proposal.json | c179017623fbca159f94a595881c77e8235dca9cb75e66e706efd0d0f2c5b340 |
| audit.txt | c3e2e10e9d96b3a9498808f82c90f97b28f664b598f34a68d9f0a2aa2a94bf1c |
| README.md | 71e6b598f3f9c8c373213c3c6ce90791c3f944615ac8ccf34463cda8980fdb51 |
| key-proof/results.txt | 0421362d0410ec94456bc9b1e1460ed8acfe762e0411a9215e588bd4352c39f6 |
| reviews/education-recheck-loop1.md | 23f09cbfcfa1784d6de654be8ad29b5df26be5a7a70400b707d645ef6bef2157 |
| reviews/sme-recheck-loop1-replacement.md | dbf048105c539607d1b75d66704c67b2fdcce7c727a40a3bc7d3d0462578d432 |
| reviews/decisions.md | 575f0ba2de4d3fd6c8ceef7aef47a83003b0048959466c5a359a5e6ed9db49c2 |

## How I classified the sources

I checked every finding against the bytes of the bank, the MAIN pages, the topic `artifact.gift` files and `sfcp-q07`.

- **q17:** it repeats the topic-level teaching of `standard-error-responses-with-problemdetail` Activity 2, which uses `forStatusAndDetail` plus `setProperty` and states "Returning a ProblemDetail from a handler sets the status and body". It also repeats topic practice item `o1 extras` (setProperty).
  - Separately, it repeats the setup of `sfcp-q07`. That bank is the separate graded Standard/Fast final checkpoint, not a module layer.
  - The topic-level repeat alone keeps this finding high.
- **q28:** the source it repeats is a topic-level practice MCQ. That is `a-dev-profile…/artifact.gift`, item `o2 proving`, whose key is "Run security tests without the dev profile and assert 401". The page's Activity 3 says the same.
  - q28's key paraphrases that key, and q28's option A paraphrases that item's "Run only with dev active".
  - It is not a module or checkpoint overlap.
- **No finding rests only on a legacy module `practice.gift`.** CFE-16 cites N+1 Activity 1 and pagination topic practice `o2 count query`, both topic level.

On T: a taught general rule applied to a new setup to reach a new conclusion passes T. A key that restates a practice key, or a setup plus fact that matches a practice item, fails T.

## Rulings

| id | ruling | final sev | basis / binding fix |
| --- | --- | --- | --- |
| CFE-13 + SMR-1 | accept | high | Confirmed (see q17 above). Replace q17 under T. Do not use a handler returning ProblemDetail as the setup. Do not decide the item on status, media type or setProperty. Do not write "always". |
| CFE-14 + SMR-2 | accept | high | Confirmed (see q28 above). Restore the v1 diagnosis ("why did no test catch it?") with the clarified premise. The key must combine both causes: with dev active, the real chain is never built, **and** the assertions cover only signed-in 200s. No option may restate the `o2 proving` remedy. |
| CFE-15 | partial | low | Reject the leak claim: the remedy is the transactions page's taught Activity 2 rule, and the bank is public under consent anyway. Reject "option C is implausible": it is the reversed-scope misconception. Accept, as optional, cutting the remedy sentence from the option A feedback. |
| CFE-16 | partial | low | q25's setup (a paged list with DTO mapping and a count query) differs from Activity 1 (a findAll list). The composition is applied, not a repeat, though band 3 is a generous label. Reject restoring v1's "batch 50 → 3" pairing: it re-uses the fixing-N+1 Activity 3 model output ("1 parent + 1 batch") and spends about 10 s of the 39 s slack. Use the SMR-3 fix instead, which costs 0 s. |
| CFE-19 + SMR-3 | accept | **medium** (raised) | Option D is refuted by the stem ("no batch fetching is configured"), so under R fixing-n-1 decides nothing; it is an uncovered topic. Medium, not high, because the fix is one option and the topic is still elicited. The rest-design-recap part needs no change. |
| CFE-17 | accept | low | "only the URL changed" points to the cue. Delete it. |
| CFE-18 + SMR-4 | accept | low | Q14Test shows the garden delete is attempted and then rolled back; the key's first clause says otherwise. Reword the key to: the cascade tries to delete garden 1, the foreign key rejects it, and everything rolls back. |
| SMR-5 | accept | low | README line 39 and blueprint `exceptionE1.note` cite "its mastery check". Replace that with: topic practice MCQ plus the `integration-and-observability` coding lab (`HealthEndpointTest`) and source coverage. |

**Counts by finding id:** 4 high (CFE-13, CFE-14, SMR-1, SMR-2), 2 medium (CFE-19, SMR-3), 6 low (CFE-15, CFE-16, CFE-17, CFE-18, SMR-4, SMR-5), 0 rejected outright. Parts of CFE-15 and CFE-16 are rejected as stated above.

## Loop 2: decision options for the captain (not authorized)

### Option 1 (recommended): the minimal required set

These three items clear every high and medium.

| item | binding fix | band / key / time cap (t45) | proof | recheck |
| --- | --- | --- | --- | --- |
| q17 | Replace under T per CFE-13. Problem-detail o1 or o2 must still decide an option. | band 2 / key C / ≤ 88.2 s | Execute stem-faithfully, with a contrast run for every behavioural feedback claim; check against `sfcp-q01..q08`. | education + SME |
| q28 | Restore the v1 diagnosis per CFE-14. Keep the decision held by an-integration-test o1 (or move it) and by dev-profile. | band 3 / key C / ≤ 88.6 s | Run Q28Test stem-faithfully under dev and under !dev. | education + SME |
| q25 | Replace option D with a distractor that only a fixing-n-1 fact refutes, such as a JOIN FETCH or fetch-plan misconception. The stem must not refute it. Keep option B's lazy-loading decision. | band 3 / key C / ≤ 87.5 s | Run a contrast test for D's feedback claim. | SME + education (R) |

Every change in Option 1 must also:
- re-run gate G: the 45 s total stays ≤ 29.35 min and must be ≤ 30.0;
- pass `check-bank.mjs`: each letter keyed at least 5 times, runs of at most 2, and the key the single longest option in at most 7 items;
- re-execute every changed key and regenerate `results.txt`;
- update the `coverage.json` `decides` lists and audit sections 3–5.

A non-author reconciler then checks the loop-2 rechecks.

### Optional lows (same pass, no extra loop)

| item | change | cap | recheck |
| --- | --- | --- | --- |
| q14 | Key wording (CFE-18/SMR-4) | key A, ≤ 76.8 s, not the single longest option | SME |
| q21 | Drop the cue phrase (CFE-17) | key C, ≤ 85.9 s | education |
| q15 | Cut the remedy sentence from option A's feedback | key D, ≤ 82.4 s | education |
| README / blueprint | E1 wording (SMR-5) | no change to any item | reconciler only |

### Option 2 (not recommended): retire q17 and q28

- This leaves 20 items.
- It adds three R exceptions needing captain sign-off: problem-detail, dev-profile and an-integration-test. The reserve covers none of them.
- q25 D still needs the Option 1 fix.
- It is cheaper to author, but it widens the coverage gap the captain asked to avoid.

## Handoff determination

**No.** The current bytes cannot be handed off as-is, even with the issues disclosed.
- **q28** reproduces a topic-practice key.
- **q17** repeats topic-level teaching and practice, and the graded checkpoint.

Both breach the operator rule against repeating practice, and disclosure does not cure a breach. fixing-n-1 also fails R.

The remaining properties do hold, so Option 1's three bounded edits are the whole gap:
- the 29.35-minute fit;
- the key letters;
- the 30/30 executed tests (per the SME re-run);
- the E1 exclusion.

This determination is not acceptance.
