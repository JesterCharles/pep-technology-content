# Reconciliation loop 3 (terminal): Spring Boot course-final MCQ, 30 questions

- **Role:** non-author recorder. This is the same critic pair that wrote `education-sme-review-loop3.md` and its recheck. It is not a separate reconciler, and this record is disclosed as such. **Date:** 2026-11-19.
- **recheck.of:** decisions-loop2.md.
- **Basis:**
  - The user decision that course finals hold 30 questions.
  - T, R and G as defined in `decisions.md`.
  - The loop-2 acceptance of the 22 items. Those items are carried over byte for byte and were not re-reviewed.

| Input | sha256 |
| --- | --- |
| final-mcq.gift (30) | 6c4c698d53f0fc52482304239ebc8782fdd441ad6b2299915968465a0d8852b9 |
| blueprint.json (30) | dafcb2fff0fcd30ddf5d38442c891ac856bef600fb1d507cb0569f6930e1b86c |
| coverage.json (30) | e08bce392a9c1fbd428fce4fc3e840e8068363dbb91ed4c554bb3388b839b26f |
| final-mcq.gift (22, loop 2) | e166262b67b5fe243c6871417d8dfb3f9983a9c66ae360122d38ddc27468a117 |
| reserve-mcq.gift (loop 2; promoted in full and removed) | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |

## Composition

- **Carried over unchanged:** 22 items, accepted in loop 2.
- **Promoted from the reserve:** q04, q05, q13, q23 and q24. Their loop-1 fixes were rechecked for education in loop 3, and q05, q23 and q24 were edited again in loop 3.
- **New:** q31 (logging-in-spring o2), q32 (an-integration-test o3) and q33 (relationship-pitfalls o3 with logging o1 and lazy-and-eager o2).
- **Bands:** 7/12/11. **Keys:** A8 B7 C8 D7.
- **Rule R:** 43 of 44 taught topics decide an option. The exception is E1, health-checks, which is unchanged.
- **Blueprint:** 30 MCQ, 30 minutes, 56 objectives. That is the 49 objectives of loop 2 plus 7 promoted or new primaries.

## Findings ruled

| id | final sev | status |
| --- | --- | --- |
| CFE-22 (q24 → q11 cue) | medium | resolved, wording only, key re-executed |
| CFE-23 (q23 D) | medium | resolved, new D with an executed probe |
| CFE-24 (q05) | low | resolved |
| SMR-8 (q33) | low | resolved |
| CFE-25 (q31) | low | resolved |
| CFE-26 (q24 vs sfcp-q06) | low | resolved |
| CFE-27 (q26 vs sfcp-q08) | low | closed, no change |
| CFE-28 (timing) | low | open: owner decision |
| CFE-29 (author results.txt) | low | recorded in `key-proof/results-30.txt` |

**Open:** 0 high and 0 medium. The open lows are CFE-28 (timing, an owner decision) and the loop-2 residual lows CFE-20, SMR-6 and SMR-7, which are unchanged.

## Determination

**ACCEPTED as the 30-question Spring Boot course-final MCQ.** 27 keys are executed and PASS, and 3 are cited (q02, q05, q12); see `key-proof/results-30.txt`.

## Disclosed limits

1. **Timing is modelled, not measured.** The model gives 33.9 min at a 30 s decision cost and 41.4 min at 45 s, against the blueprint's 30 minutes. Six items model over 75 s: q04, q23, q24, q31, q32 and q33. Under this model the bank does not fit 30 minutes. Duration is an open owner decision; the blueprint keeps 30 minutes as instructed.
2. **Navigation.** The q24/q11 cue is fixed in wording. Delivery navigation (free or sequential) is not set by this blueprint.
3. **Proof scope.** The proof ran locally on macOS only, offline, against H2. There is no hosted CI, no platform import, and no Moodle rendering check.
4. **Reviewer independence.** This reconciliation is recorded by the loop-3 critic pair, not by a separate reconciler.
