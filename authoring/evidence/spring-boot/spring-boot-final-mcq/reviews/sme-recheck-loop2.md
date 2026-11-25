# Spring course-final MCQ: independent SME recheck, loop 2 (terminal)

- Role: independent Spring SME critic; not author, not reconciler. Date 2026-11-19. Read-only; no git, network, commit or upload.
- recheck.of=sme-recheck-loop1-replacement.md

| File (CAND unless noted) | sha256 |
| --- | --- |
| final-mcq.gift | 4908a83ac1150c2204fa813bbbe211305de1295bd03713dd1d68db0818eabb7d |
| reserve-mcq.gift (= SCR/cf-v2-snapshot, byte-identical) | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc |
| blueprint-proposal.json | bdc1231f8e4d1ba1980a3ab9d1ab7a01b1a394ba0f927ebdeff24395b7c3035d |
| coverage.json | 000039470f9bcf6058023bd9981cac02348e4d5f1697b5d5f86caa840687a7bf |
| README.md | ced6352b11475e698a7e37337cedab9e234b06afb239ba1329d0a8d9ff7c2bd0 |
| audit.txt | 0e19f8093ff81da2c9bb539b63e6ab5651fa785896260a410289bdb9fad5cecb |
| key-proof/results.txt | a6b4e5a927a388fc77748043e7e157c7876b2395f104c22a68168eb98c9c962b |
| key-proof/item-tests.tsv | 850570339848fe28741fa039c2c980f13234b4173cf94ad0fc779f21024a6a54 |
| reviews/decisions-loop1.md | 75974db355287fbb0b794337b803a8f554ddd9057ace87c0f01970d5f55b46a1 |
| checkpoint private-authoring-candidate.gift | 06ddb5544c40f4ee46248e812f572115178c4f303a3613ceb41f8b5e237662b0 |
| MAIN authoring/tools/gift/validate.mjs | 6d6cf37b672bb8bb964c57d4904e750ca10a84ff41265b0999b26e2bf68ec4f8 |

## Verdict: APPROVE

No high or medium remains. Every changed key is correct for Boot 4.1.2, Spring 7 and Security 7, and I reproduced each one independently. SMR-6 and SMR-7 are lows. They are non-blocking and do not justify a loop 3.

## Rulings

| id | ruling | basis |
| --- | --- | --- |
| SMR-1 / CFE-13 (q17) | **resolved** | Key C is correct: with the property on, (1) gives 400 and (2) gives 405, both problem detail bodies; (3) gives 500 with Boot's default JSON. Every distractor is wrong and every feedback line is accurate. The constraints hold: there is no handler in the setup; the item is not decided on status, media type or setProperty; nothing says "always". The deciding facts are taught on both tracks: "wrong method" is a framework exception (problem-detail Activity 3 and Recap), and when nothing matches, default handling answers (global-error-handling Activity 3). Request 1 does not decide the item: once 2 is known to be in and 3 out, only C remains. T passes against `o2 enable`, which only names the property, and `o2 validation body`, which is a status fact. No overlap with sfcp-q01..q08 (q06 is local versus advice handler; q07 is a handler-built ProblemDetail). |
| SMR-2 / CFE-14 (q28) | **resolved** | Key C combines both causes and is exact (see the matrix below). A is decided by "permitAll admits signed-in users", B by "filters run", D by "only one `@Profile` bean exists". No option states a remedy. T passes against dev-profile `o2 proving` (a remedy) and role-protected `o3 testing` (a generic case list): q28 applies them to diagnose a profile-masked suite. |
| SMR-3 / CFE-19 (q25 D) | **resolved** | The stem ("Boot's default settings apply") does not refute D. The taught fixing-n-1 fact does: "No fix: 1 plus N"; batching needs `default_batch_fetch_size` (Activity 3 and cheat sheet). D's feedback holds: defaults give 52 statements with 50 collection fetches; batch size 50 gives 3 statements and 1 fetch. No checkpoint overlap (sfcp-q05 is a left join fetch). |
| SMR-4 / CFE-18 (q14) | **resolved** | The key now matches behaviour: the garden delete is attempted, H2 throws an FK `DataIntegrityViolationException`, and all 3 beds and the garden remain. The key is not the longest option (69/74/63/67 characters). One residual sentence in another option's feedback is SMR-7. |
| SMR-5 (E1) | **resolved** | README, blueprint `exceptionE1.note` and coverage scope now cite the topic practice MCQ, the integration-and-observability coding lab (`HealthEndpointTest`, present at MAIN `coding-lab/tests/ops/`) and source coverage. "mastery" appears nowhere in README, blueprint, coverage or audit. The q15 option-A cut and the q21 cue deletion are accurate, introduce no error, and both items re-pass (Q15Test, Q21Test). |

q28 matrix (`@SpringBootTest` + `@AutoConfigureMockMvc`, my own probe):

| profile | correct chain: signed-in / anonymous | permitAll chain: signed-in / anonymous | beans |
| --- | --- | --- | --- |
| dev | 200 / 200 | 200 / 200 | open only |
| no dev | 200 / **401** | 200 / 200 | real only |

## New findings

| id | sev | item | finding | suggested fix (optional) |
| --- | --- | --- | --- | --- |
| SMR-6 | low | q28 key and its feedback | "no test makes an anonymous call" goes slightly beyond the stem, which says only that the security tests check signed-in 200s. "Both causes are needed" is loose: either cause alone masks the change, and both must be removed to catch it. A and C share their first clause, which narrows the choice to two, but the choice between them is still decided on content. | Consider "no test expects an anonymous call to fail" and "both hold, and each alone hides the change." |
| SMR-7 | low | q14 option B feedback (unchanged since v2) | "deleting a bed also deletes its shared garden" repeats the inaccuracy SMR-4 removed from the key. The delete is attempted and rolled back. | Change it to "also tries to delete its shared garden". |

## Format, timing and cues

- validateGift(..., {html:true}): bank 22 and reserve 5, both OK. check-bank: RESULT PASS for both files.
- Keys A6/B6/C5/D5, longest run 2. The key is the single longest option in 3/22 items (q02, q08, q26). Absolute-word cue items: 0. No new grammatical cue in the six changed items.
- Gate G recomputed independently: 29.08 min at 45 s and 23.58 at 30 s; max 88.7 s (q02). Every cap is met: q17 74.7 ≤ 88.2, q28 88.0 ≤ 88.6, q25 87.5 ≤ 87.5, q14 75.6 ≤ 76.8, q21 84.7 ≤ 85.9, q15 82.4 ≤ 82.4.
- The q17, q25 and q28 topics have full (not skim) rows on both tracks in the calendar.
- Tool note: `SCR/cf-timing.mjs` cuts each item at its first `{`, including an escaped `\{` in code, so it under-counts (24.57 min). The audit's figures are correct.

## What I executed (JDK 25.0.5, Maven 3.9.16, offline `-o`)

1. The copied harness (`SCR/critic-sme-loop2/full`): core 30, sec 6, fly 2, 0 failures. Regenerated results match `results.txt` line for line, apart from its two header lines (bank 20 PASS + 2 cited; reserve 4 PASS + 1 cited).
2. My own probes (`SCR/critic-sme-loop2/probe`):
   - **q17:** real port, property on with no Accept header, `*/*` and `application/json`, and property off. With the property on, 1 and 2 are problem details and 3 is Boot's default JSON. With it off, all three are Boot's default JSON.
   - **q25:** Hibernate statistics. Defaults: 52. With the batch setting: 3. With open-in-view off: 52.
   - **q14:** `deleteById` variant gives an FK violation, rollback, and 3 beds and 1 garden left.
   - **q28:** four `@SpringBootTest` classes (the matrix above).
3. check-bank, a separate key-distribution and cue script of my own, and gate G recomputation.
4. Diffs against v2, and greps of the topic practice banks, page activities, the calendar and sfcp-q01..q08.
