# Education critic review: Spring Boot course-final MCQ draft

- Role: education critic (independent; did not author the bank)
- Date: 2026-11-19
- Read in full for this review:
  - every activity, including each "Where this fits" task, on all 45 pages of MAIN a00a6658;
  - the 44 topic banks and 7 practice banks;
  - checkpoint items sfcp-q01 to q08;
  - both Spring `learner.md` files.
- Project 2 was compared only by keyword search of its Standard/Fast milestone JSON and PRD.
- Probe scripts are in `SCR/critic-education/`.

| File | sha256 |
| --- | --- |
| final-mcq.gift | 67dd4b0d0808d608d0c26ba7426d86e6a1e34b8e427184fc216ae07050ab20a6 |
| coverage.json | f43b1b3a8f2fc1755ecac94c3b990799b5f3cdfa962256aed87f6828b222ddba |
| blueprint-proposal.json | 091726ae83b6ba224a69fb14cb343629cd37a90db875a2decadb281d9972e8e5 |
| audit.txt | a856b0209cc547c6396ad5c705bd8f96cdfcd94ae649c2b0e184157b6013f7f5 |
| README.md | d1e2c6bc98a0739b2ea0f0cb919c9b4e6b865c6c98401adaabe654f3b151e18e |
| check-bank.mjs | da35b052561539bf5cfce928837b5eff2ff315d5440bd6a3ddb01b9832f25b1b |
| key-proof/results.txt | e5f285d560429122a9df9cd983c80d15dc72924ac097c63df98613c46100b9e4 |

## Verdict

**Revise.** Five items repeat practice, one primary topic is untaught on the Fast track, and six topics count as covered without deciding any answer.

Near-duplicate test used throughout: the same setup and the same deciding fact (brief §5).

## Findings

| id | sev | items | finding | required fix |
| --- | --- | --- | --- | --- |
| CFE-1 | high | q15 | Repeats transactions Activity 1 on both counts. Setup: two writes in one `@Transactional` method, and the second throws an unchecked exception. Deciding fact: the first write rolls back. The stem says the controller catches the exception and returns ok, so nothing else is tested. Pickup task 4 and Project 2's rollback criterion share the same fact. | Replace it with a transaction fact that no practice item uses. Example: a controller calls two separately transactional methods and the second throws, so the first has already committed. |
| CFE-2 | high | q17 | Both the setup and the deciding fact come from problem-detail Activity 3: a 400 saying "Invalid request content.", no field names, and the fix of extending `ResponseEntityExceptionHandler`. The fix is also the answer to toolshed task 3 and Project 2's field-errors requirement. The key is the single longest option (123 characters against 105). Rejected, although the author named it as a risk. | Replace it. |
| CFE-3 | high | q19 | Repeats password Activity 2. Setup: an `equals`-based login check. Deciding fact: a new salt on every encode, so use `matches`. That is also bank o1's key. The page's "Where this fits" task already covers the `{id}` prefix after a default change, so that is not a safe replacement. Rejected, although the author named it as a risk. | Make password hashing a secondary topic and spend the freed primary slot on a topic from CFE-6. |
| CFE-4 | high | q14 | The "Where this fits" task on the pitfalls page has the same setup and fact: CascadeType.ALL without orphanRemoval, remove a child, and the model shows "no delete (row stays)". The only remaining discriminator is the NULL-foreign-key option. Activity 1's feedback says that outcome "can happen without orphanRemoval", but q14 marks it wrong, so the page contradicts the key. This is a skim topic. | Replace it. Flag the Activity 1 wording to the page owner. |
| CFE-5 | high | q22 | The setup and fact match the role page's "Where this fits" task: a MockMvc test where `.with(user(...).roles(...))` lacks the role, so expect `isForbidden`. They also match Activity 3, practice Q6 and q30(c), so q22 and q30 answer each other. Its primary topic, MockMvc, decides nothing. | Retarget it to a MockMvc fact the practice does not use. |
| CFE-6 | high | coverage | Of the 14 topics covered only as secondary, 8 decide at least one option: rest-controllers (q06, q11), parameters (q11), secrets (q09), pagination (q25), owning side (q14), batch fetch (q25), integration test (q28, option A only) and sessions vs JWT (q27). Six decide nothing: generating (q01), constructor injection (q08), spring-data-jpa-with-hibernate (q10, q13), DTOs (q23, q29), logging (q16, which only sets it up) and OWASP (q26, named only in feedback). Primaries with the same problem: in q30 every option has (b) = 400, so validation never discriminates. | Make each of the six decide an option, for example with a BOLA distractor in q26. Otherwise get captain sign-off. In q30, vary (b) across the options. In coverage.json, correct q25's pagination mapping (o1 to o2) and q06's claim of "other builders". |
| CFE-7 | high | q07 | Spring Actuator health checks are on no Fast day. The Fast Project 2 PRD calls them "a Standard topic". The item also sits close to health Activity 2, which turns on show-components and states the aggregate-DOWN rule. | If Fast learners sit this final, cover health checks only as a secondary topic and use the primary slot for something else. |
| CFE-8 | medium | q04 | The key ("fails: no web server factory") and option D ("starts without a server and exits") can only be told apart by the web-application-type deduction, which no page teaches. This is a skim topic in band 1. | Replace D with an option the pages refute. |
| CFE-9 | medium | q12, q20, q29 | Setup differs from practice, but the deciding fact is heavily practised. q12 decides on the bean-validation "Where this fits" sentence and is the layers Activity 2 classification task again; it is recall in band 2, with distractors A and B using "All". q20's discriminating half (add V2 rather than edit V1 or use update) is the Flyway "Where this fits" task, Activities 1 and 4, and sfcp-q02. q29 is the debugging "Where this fits" bug (an unknown id should be 404, not 500); its key is the longest option and the stem refutes two distractors. | q12: add a rule that looks like a format check but needs data. q20: let the validate outcome decide. q29: use stronger distractors, or swap for a different fact. |
| CFE-10 | medium | q21, q24/q11 | q21 turns on a single letter's case ("kai" against "Kai"), which is a trick. q24's stem ("used to answer 400") gives away half of q11. | Make the q21 mismatch meaningful. Remove the 400 from q24's stem. |
| CFE-11 | medium | all | Timing is unproven. The models give 24 minutes (optimistic) to 38 minutes (conservative: 150 wpm, 6 s per code line, extra time to trace). In the conservative model, these items run over 75 s: q24 108 s, q27 100, q25 98, q01 97, q28 96, q14 94, q23 94, q04 92, q03 90, q26 89, q15 87, q13 85, q20 82, q02 81, q21 79. | Trim the stems by about 20%, starting with q01's POM, and run a timed dry run. |
| CFE-12 | low | q06, q05, q28, q18 | q06 has the same setup as response-codes Activity 4 but a different deciding fact (no Location header without `created(uri)`), so it is acceptable. q05's options B and D are weak. q28's premise is unclear: tests that pass under an open chain cannot assert 401, so say what they do assert. q18's feedback has run-on sentences. | Polish. |

## Author's named risks

- **q03:** accepted. Tracing counts across two controllers is a real step up.
- **q16:** accepted. It shares the rename setup from seeing-SQL, but the deciding fact (readOnly) differs.
- **q29:** downgraded to CFE-9 rather than rejected.
- **q17 and q19:** rejected (CFE-2 and CFE-3).

## Checked and confirmed

- Coverage maps all 44 topics, and every objective id resolves.
- Bands are 8/14/8 and correctly ordered.
- q09, q24, q25, q26, q27 and q30 are real step-ups.
- The remaining skim primaries (q03, q05, q09, q18, q23) are fair.
- `check-bank.mjs` passes: A8/B7/C7/D8, longest run 2, and the key is the longest option in 3 items. Absolute words are balanced between keys and distractors.
- Scenario domains avoid toolshed, pickup and payments.
- The blueprint keeps the 150-minute practical. Its sampling trade-off is acceptable once CFE-6 is fixed.
