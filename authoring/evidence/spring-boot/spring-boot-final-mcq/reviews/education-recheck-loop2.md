# Education critic recheck, loop 2 (terminal)

recheck.of=education-recheck-loop1.md

- Role: education critic. Date: 2026-11-19.
- Basis: captain Option 1 (`SCR/cf-loop2-decision.txt`), T and R from `decisions.md`, and the three-layer hierarchy (topic practice MCQs, module coding labs, one course graded MCQ).
- Scope: I diffed the bank against `SCR/cf-v2-snapshot/`. Only q14, q15, q17, q21, q25 and q28 changed.

| File | sha256 |
| --- | --- |
| final-mcq.gift | 4908a83ac1150c2204fa813bbbe211305de1295bd03713dd1d68db0818eabb7d |
| reserve-mcq.gift | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| coverage.json | 000039470f9bcf6058023bd9981cac02348e4d5f1697b5d5f86caa840687a7bf |
| audit.txt | 0e19f8093ff81da2c9bb539b63e6ab5651fa785896260a410289bdb9fad5cecb |
| README.md | ced6352b11475e698a7e37337cedab9e234b06afb239ba1329d0a8d9ff7c2bd0 |
| blueprint-proposal.json | bdc1231f8e4d1ba1980a3ab9d1ab7a01b1a394ba0f927ebdeff24395b7c3035d |
| check-bank.mjs | c1ca493f4dbde21b8382f730fc0791ed0eb1a984922d40ff17bb27372586baea |
| key-proof/results.txt | a6b4e5a927a388fc77748043e7e157c7876b2395f104c22a68168eb98c9c962b |
| reviews/decisions-loop1.md | 75974db355287fbb0b794337b803a8f554ddd9057ace87c0f01970d5f55b46a1 |
| SCR/cf-loop2-decision.txt | 0b85bd15f817628585751518256acd611e1d8a2a008dd97717157743affd367b |

## Verdict

**Approve.** No high or medium finding remains. The two lows below are wording only and non-blocking.

## Prior findings

| id | ruling | basis |
| --- | --- | --- |
| CFE-13 (q17) | resolved | Passes T. See the q17 notes below the table. |
| CFE-14 (q28) | resolved | The item is a diagnosis again. Every option names a cause, and none states a remedy. The key gives both causes: dev leaves the real chain unbuilt, and no test makes an anonymous call. Option A's "without dev" is a wrong consequence ("the signed-in checks would fail"), not the bank o2 remedy, so it does not echo practice. The key is not the longest option. An-integration-test o1 still decides B. |
| CFE-19 (q25 D) | resolved | D now claims that lazy loads batch by default. The fixing-N+1 Activity 3 fact refutes it: batching is something you turn on with `default_batch_fetch_size`. The stem's "Boot's default settings apply" is neutral, and the contrast run `defaultsDoNotBatchButTheBatchSettingDoes` backs the feedback. |
| CFE-15 (q15) | resolved | The remedy sentence is cut. Option C is kept, as the captain ruled. |
| CFE-16 (q25) | closed | Reconciliation ruled it low/partial; I accept that. |
| CFE-17 (q21) | resolved | "Only the URL changed" is gone. "Copied from a hive 7 test" stays as needed context, and the learner still has to compare the stub with the request. |
| CFE-18 (q14) | resolved | The key now reads "Cascading to garden 1 fails on the foreign key; everything rolls back", which matches Q14Test. |
| E1 wording | resolved | The README and the blueprint `exceptionE1.note` cite topic practice, the integration-and-observability coding lab (HealthEndpointTest) and source coverage. Neither cites a mastery check. |

### q17 (CFE-13)

**The test.** q17 sets up three failures under `spring.mvc.problemdetails.enabled=true` with no advice, and asks which ones get a problem-detail body. The deciding fact is the property's scope: it covers exceptions Spring MVC raises itself, but not an app's own unhandled exception, which still gets Boot's default error JSON. Request 3 carries that discrimination.

**Sources checked, none of which uses this setup and fact together:**
- the problem-details topic bank (o2 asks for the property name);
- Activities 1-4 and the Where-this-fits model (property off versus on for one invalid POST);
- the global-error "default error handling answers" rule;
- sfcp-q01 to q08 (sfcp-q07 is a handler returning a ProblemDetail, the setup this item now avoids);
- toolshed (every error comes through an advice);
- pickup;
- Project 2 (a ProblemDetail shape).

**Rulings on the disclosed risks:**
- **Request 2 in Activity 3 prose.** Acceptable. It is one row of three and does not decide the item alone; option B separates on it.
- **Legacy validation practice Q6.** Outside the corrected hierarchy. It is also recall of the general rule, whereas q17 applies the rule's scope.
- **The sfcp-q01 "three requests" format.** A shared format is not a duplicate. sfcp-q01 is decided by binding facts.
- **The key is the shortest option.** Not a cue. Six keys are the shortest option, about the 25% expected by chance, and the key is the single longest option in only 3 of 22.

Problem-detail o2 decides the key and o1 decides D. Fast learners meet the topic on FT5.

### Regressions

- **Gate G.** At 45 s per item the bank takes 29.08 min, under 30. No item exceeds 75 s at 30 s.
- **My conservative model.** 26.0 min in total. q25, q27 and q28 each take about 90 s, which is band 3 and unchanged from loop 1.
- **check-bank.** Passes: A6 B6 C5 D5, longest run 2, the key is the single longest option in 3 items, and there are 0 absolute-word cues.
- **Duplicates.** None new. No cross-item leak among the six changed items.

## New findings

| id | sev | items | finding | fix (optional, wording) |
| --- | --- | --- | --- | --- |
| CFE-20 | low | q28 | The key's second clause ("no test makes an anonymous call") paraphrases the stem's premise ("check only that signed-in users get 200"). That is a mild stem-echo cue, offset by distractor A sharing the key's first clause. | Optional: rephrase the premise as "the security tests assert only 200 responses". |
| CFE-21 | low | q17 | "Boot's default error JSON" appears in both the key and option A's feedback. The pages call it the "default error body". | Optional: match the page term. |
