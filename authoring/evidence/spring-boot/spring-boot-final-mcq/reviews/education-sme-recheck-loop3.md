# Education and SME critic recheck, loop 3 (terminal)

recheck.of=education-sme-review-loop3.md

- **Role:** the same independent critic pair (education and Spring SME). We did not author the bank. **Date:** 2026-11-19.
- **Scope:** we diffed the bank against the pre-fix candidate (ef34aa9b…). Only q05, q23, q24, q31 and q33 changed. No other item byte changed, and the blueprint is unchanged.

| File | sha256 |
| --- | --- |
| final-mcq.gift (30) | 6c4c698d53f0fc52482304239ebc8782fdd441ad6b2299915968465a0d8852b9 |
| coverage.json (30) | e08bce392a9c1fbd428fce4fc3e840e8068363dbb91ed4c554bb3388b839b26f |
| blueprint.json (30) | dafcb2fff0fcd30ddf5d38442c891ac856bef600fb1d507cb0569f6930e1b86c |
| pre-fix final-mcq-30.gift | ef34aa9b64708052e5a9173e19360eb70d0a6d7082163f6162288ce4d6bb8127 |

Our re-run on our own harness copy, with the author's fixed sources, had 0 failures:

- `sbf.q23.Q23Test` 2/2, including the new probe `inverseCollectionOnGardenDoesNotRemoveGardenSelects`, which shows the 3 garden selects remain
- `sbf.q24.Q24Test` 1/1 (with the TrailErrors advice and the "Unexpected error" body)
- `ferry.Q31Test` 1/1
- `sbf.q33.Q33Test` 2/2

## Verdict

**Approve.** No high or medium finding remains.

## Prior findings

| id | ruling | basis |
| --- | --- | --- |
| CFE-22 (q24 → q11) | resolved | The stem now reads "The app has this advice, and a request without region answers 500" and asks "Why does that request answer 500?". No option says "bad requests". The new B (an advice runs before binding) and C (an advice makes the parameter optional) are plausible and wrong. Nothing in the stem or options states the default status that q11 tests. The key is unchanged and executed. |
| CFE-23 (q23 D) | resolved | The new D adds an inverse `@OneToMany(mappedBy = "garden")` collection to Garden. It is plausible, lazy-and-eager o1 refutes it, and the new probe confirms it. No batching text remains in q23, so q25 D is no longer cued and fixing-n-1 still decides through q25 D. |
| CFE-24 (q05) | resolved | B now states the "different status means not idempotent" misconception. The key (82 characters) is no longer the longest option. Info only: B and D both conclude "do not retry", but for different reasons. |
| SMR-8 (q33) | resolved | The stem says no `logging.level.*` property is set. |
| CFE-25 (q31) | resolved | C is now a misread from adjacent lines that names the right thread with the wrong outcome, which suits band 3. The key is unique. |
| CFE-26 (q24 vs sfcp-q06) | resolved | The advice is renamed and the body string changed; only one shared code line remains. |
| CFE-27 | closed | No change was required. |
| CFE-28 (timing) | open, owner | The bank now models at 33.9 min (30 s decision cost) and 41.4 min (45 s), against 30 minutes. |

## New

| id | sev | finding | disposition |
| --- | --- | --- | --- |
| CFE-29 | low | The author's candidate `key-proof/results.txt` was not regenerated after the fixes; its fix runs sit in `surefire-fix/`. | `key-proof/results-30.txt` in this folder records the post-fix runs. |
