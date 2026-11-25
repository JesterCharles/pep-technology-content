# Spring Boot course-final MCQ: review record

Course-level evidence for `spring-boot/assessments/spring-boot-final-mcq/final-mcq.gift`: **30 graded questions, 30 minutes** (loop 3, 2026-11-19).
The bank is the loop-2 accepted 22 items (unchanged bytes), plus the 5 former reserve items (q04, q05, q13, q23, q24), promoted in full, plus 3 new items (q31, q32, q33).
`reserve-mcq.gift` is removed: every reserve item is now graded, so no reserve remains.
The candidate `README.md`, `audit.txt` and `blueprint-proposal.json` in this folder describe the 22-item loop-2 candidate and are kept unchanged as history; `coverage.json` is replaced by the 30-item coverage.

## Loop 3 (30 questions)

| File | sha256 | Note |
| --- | --- | --- |
| `final-mcq.gift` (repo) | 6c4c698d53f0fc52482304239ebc8782fdd441ad6b2299915968465a0d8852b9 | The bytes the loop-3 critic recheck approved; category already the delivery folder path. |
| `blueprint.json` (repo) | dafcb2fff0fcd30ddf5d38442c891ac856bef600fb1d507cb0569f6930e1b86c | 30 MCQ, 30 minutes, 56 objectives (49 plus 7 promoted or new primaries). |
| `coverage.json` | e08bce392a9c1fbd428fce4fc3e840e8068363dbb91ed4c554bb3388b839b26f | Author's per-item coverage for all 30, with critic fixes, cross-item cues, dedup and timing. Answer-bearing. |
| `key-proof/results-30.txt` | (this commit) | Key-proof summary for the 30 items: 27 executed PASS, 3 cited (q02, q05, q12). |
| `key-proof/item-tests.tsv` | (this commit) | All 30 rows now `bank`; q31 to q33 added. |

Author coverage summary (`coverage.json`): bands 7/12/11; keys A8 B7 C8 D7; 43 of 44 taught topics decide an option (exception E1, health-checks, unchanged); 29 topics as primary, 12 only through a distractor; lexical dedup against the 44 Spring topic banks, 7 module practice banks and checkpoint-mcq-45 finds 0 exact stems, 0 shared 7-grams and 0 Jaccard flags (max 0.264, pre-existing q14).

Review (`reviews/`): `education-sme-review-loop3.md` (independent education + SME pair, delta only: approve with fixes, 0 high / 2 medium / 6 low), `education-sme-recheck-loop3.md` (approve, 0 high / 0 medium), `decisions-loop3.md` (accepted; recorded by the critic pair, not a separate reconciler).
Open, not blocking: CFE-28 timing. The bank models at 33.9 min (30 s decision cost) and 41.4 min (45 s) against the blueprint's 30 minutes; duration is an owner decision. The loop-2 residual lows (CFE-20, SMR-6, SMR-7) stand.

# Loop 2 record (22 questions, superseded by loop 3)

## Bytes (loop 2)

| File | sha256 | Note |
| --- | --- | --- |
| `final-mcq.gift` (candidate) | 4908a83ac1150c2204fa813bbbe211305de1295bd03713dd1d68db0818eabb7d | The bytes both critics approved. |
| `final-mcq.gift` (repo) | e166262b67b5fe243c6871417d8dfb3f9983a9c66ae360122d38ddc27468a117 | Differs from the candidate only in line 3: `$CATEGORY` is the delivery folder path `spring-boot/assessments/spring-boot-final-mcq`, as the candidate README directs and `authoring/tests/course-final-gift.test.mjs` requires. No question, option or feedback byte changed. |
| `reserve-mcq.gift` (removed in loop 3) | c7f91317a4d1d259d48f6157ff6c80eeb9e55e084fc04f84074bb5694771d3dc | 5 corrected, key-proven items; not graded. Category is the candidate's (`spring-boot-module-check`). |
| `blueprint-proposal.json` | bdc1231f8e4d1ba1980a3ab9d1ab7a01b1a394ba0f927ebdeff24395b7c3035d | Applied as the split described below. |
| `coverage.json` | 000039470f9bcf6058023bd9981cac02348e4d5f1697b5d5f86caa840687a7bf | Per-item coverage; answer-bearing, permitted by the captain public-answer consent of 2026-11-19. |

## Review outcome, loop 2 (by reference)

Two independent critics (Spring SME, education) reviewed the bank through two correction loops. A non-author reconciler accepted loop 2: 0 high, 0 medium, 3 disclosed lows.
The reports are in `reviews/` (original handoff hashes in `reviews/handoff-manifest-sha256.txt`):

- `sme-review.md`, `sme-recheck-loop1-replacement.md`, `sme-recheck-loop2.md` (verdict APPROVE)
- `education-review.md`, `education-recheck-loop1.md`, `education-recheck-loop2.md` (verdict Approve)
- `decisions.md`, `decisions-loop1.md`, `decisions-loop2.md` (terminal)

Disclosed lows, not fixed and not blocking: SMR-6 (q28 key wording slightly exceeds the stem), SMR-7 (q14 option B feedback says "also deletes its shared garden"; the delete is attempted and rolled back), and one education wording low in `education-recheck-loop2.md`.
These reports are author-format Markdown, not the repository's critic-report JSON schema, so they are not bound into `course.lock.json` evidence bindings.

## Proof (loop 2)

`key-proof/results.txt` and `key-proof/item-tests.tsv`: 20 of 22 bank keys executed in a Spring Boot 4.1.2 / Java 25 harness (core 30 tests, sec 6, fly 2; 0 failures) and 2 cited; reserve 4 executed and 1 cited. Run once, on macOS, locally. The harness sources stay in the private handoff (hashes in the manifest). This is local evidence only, not hosted CI, not platform import, and not learner-timed: the 29.08-minute figure is a modelled estimate (`audit.txt` section 3).

## Structure (loop 2)

Following the HTML, CSS & JS precedent, the graded MCQ and the graded practical are separate registered assessments:

- `spring-boot-final-mcq`: kind `gradedMcq`, 22 questions, 30 minutes, 49 objectives (MCQ format).
- `spring-boot-final-assessment`: now the graded practical only (kind `gradedPractical`, 8 items, 150 minutes, 30 objectives). Its id is kept so existing module notes keep resolving.

Open decision for the owner: the former combined 60/40 weighting and single 70% overall pass mark are no longer in the blueprints; each part now carries its own 70% pass mark. Exception E1: health-checks is not sampled by the shared bank (it has no Fast row).
