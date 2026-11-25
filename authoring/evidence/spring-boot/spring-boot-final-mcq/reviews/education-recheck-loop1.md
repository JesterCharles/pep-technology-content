# Education critic recheck, loop 1

recheck.of=education-review.md. Role: education critic. Date: 2026-11-19. Rules: T and R from `decisions.md`, captain decision D1 = A, and a hard 30-minute limit.

Each changed item was compared with: the topic banks, practice banks, activities, Where-this-fits sections and models, sfcp-q01..q08, toolshed, pickup, and Project 2 (keyword search only).

| File | sha256 |
| --- | --- |
| final-mcq.gift | c0167b686833ea23bb415020121fc253650e21b84f20d1bc851db00573e3a59a |
| reserve-mcq.gift | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| coverage.json | ff300c84925419a991c66c76f8a628665a2e84310e08602d8b4ba91d233e7653 |
| audit.txt | c3e2e10e9d96b3a9498808f82c90f97b28f664b598f34a68d9f0a2aa2a94bf1c |
| README.md | 71e6b598f3f9c8c373213c3c6ce90791c3f944615ac8ccf34463cda8980fdb51 |
| blueprint-proposal.json | c179017623fbca159f94a595881c77e8235dca9cb75e66e706efd0d0f2c5b340 |
| check-bank.mjs | c1ca493f4dbde21b8382f730fc0791ed0eb1a984922d40ff17bb27372586baea |
| key-proof/results.txt | 0421362d0410ec94456bc9b1e1460ed8acfe762e0411a9215e588bd4352c39f6 |
| reviews/decisions.md | 575f0ba2de4d3fd6c8ceef7aef47a83003b0048959466c5a359a5e6ed9db49c2 |

## Verdict

**Revise.** 11 of 12 prior findings are resolved. Two new high findings remain, and each has a bounded fix:

- The replacement q17 fails test T.
- The edit to q28 turned it into recall of a bank key.

## Prior findings

| id | ruling | basis |
| --- | --- | --- |
| CFE-1 | resolved | The new q15 passes T against the banks, activities and sfcp-q04. One remaining concern is CFE-15. |
| CFE-2 | **not resolved** | The replacement q17 fails T; see CFE-13. |
| CFE-3 | resolved | Retiring q19 is adequate under the hard limit. Password-hashing still decides q27 D, and its feedback names the fact. |
| CFE-4 | resolved | The new q14 passes T. Activity 2 warns about a shared parent only in prose; there is no task, model or bank item on it. |
| CFE-5 | resolved | q22 is retired. MockMvc still decides q21 D. The 401/403 fact now appears only in q30. |
| CFE-6 | resolved | R holds for all 43 topics; I spot-checked every `decides` entry. q30 (b) now varies. CFE-19 lists the thin spots. |
| CFE-7 | resolved | E1 is excluded under D1 = A, and q07 is retired. |
| CFE-8 | resolved | q04 moved to the reserve. |
| CFE-9 | resolved | q12 now has a data-dependent rule and no "All" options. q20 options differ only by outcome. In q29 the key is no longer the longest option, and no distractor is refuted by the stem. |
| CFE-10 | resolved | q21's mismatch is now meaningful (but see the cue in CFE-17). q24 moved to the reserve. |
| CFE-11 | resolved | The bank fits under every model: 16.6 min (optimistic), 23.85 (G at 30 s), 26.5 (my conservative model), 29.35 (G at 45 s). Under G no item exceeds 75 s. Under my conservative model q25, q27 and q28 take about 90 s, which is acceptable for band 3. |
| CFE-12 | resolved | q05 moved to the reserve. The q28 premise and the q18 feedback are fixed. |

**Count.** 22 items is defensible.
- Do not restore reserve items: the slack is only 0.65 to 3.5 min, each reserve item takes 1.2 to 1.7 min, and adding two would break the 45 s model.
- Bands run 5/11/6 with a sound easy-to-hard progression.
- The six skim primaries all rest on activity text.

**Author's doubts.**
- q21 A (advice not loaded) is a fair distractor. Slice error mapping is taught in the mockito and MockMvc Where-this-fits sections and in integration Activity 3.
- q29 C counts toward coverage but is thin; see CFE-19.

## New findings

| id | sev | items | finding | required fix |
| --- | --- | --- | --- | --- |
| CFE-13 | high | q17 | Fails T: sfcp-q07 uses the same setup. In both, an advice returns `ProblemDetail.forStatusAndDetail(...)` with a setter and the learner predicts the response. Its deciding facts (status taken from the PD, problem+json) are sfcp-q07's key and the feedback on its option A. The only new fact, that `setProperty` adds a member, is already in bank o1, the Activity 2 task, and toolshed task 3's `fields` property. | Replace again under T. Avoid the "handler returns PD" setup, and avoid setProperty, status and media type as the deciding fact. |
| CFE-14 | high | q28 | The edit changed the question from "why did no test catch it" to "which test change catches it". The new key restates dev-profile bank o2 ("run security tests without the dev profile and assert 401") and Activity 3. | Restore the v1 diagnosis question and keep the clarified premise. |
| CFE-15 | medium | q15 | The feedback on option A ("put them in one `@Transactional` service method") gives away the design that pickup task 4 and Project 2 approval require. Option C (first change rolled back, second kept) is implausible. | Cut the remedy sentence from the feedback and make C plausible. |
| CFE-16 | medium | q25 | Dropping the batch remedy removed the step up. What remains is N+1 Activity 1's code (title plus `getX().size()` in a DTO map) on a Page, plus pagination bank o2's count query: two practised facts in a band-3 slot. | Restore the v1 pairing ("52; batch size 50 → 3"), trimmed. This also fixes fixing-n-1's coverage (CFE-19). |
| CFE-17 | low | q21 | "Only the URL changed" points straight at the key. | Drop that phrase. |
| CFE-18 | low | q14 | The key reads as self-contradictory: "Garden 1 is deleted too, so the commit fails". | Say that the cascade also deletes garden 1, the foreign key rejects it, and the rollback leaves nothing deleted. |
| CFE-19 | low | coverage | fixing-n-1 decides q25 D only because the stem says batching is not configured. JOIN FETCH is not tested anywhere. Debugging Activity 4 B also refutes q29 C, so that option does not rest on rest-design-recap o3 alone. | Fix fixing-n-1 through CFE-16. Leave rest-design-recap as it is, since its feedback names the fact. |

## Confirmed

- `check-bank.mjs` passes: A6 B6 C5 D5 (floor 5), longest run 2, key is the single longest option in 3 items.
- No cross-item leaks.
- Scenario domains do not overlap toolshed, pickup or payments.
- The retirements add no material untaught on the Fast track.
