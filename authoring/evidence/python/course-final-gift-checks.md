# Python course-final MCQ: integration record

Recorded 2026-11-19 on `cc/python-course`. Bank: `python/assessments/python-final-mcq/final-mcq.gift`, registered in `course.json` as `python-final-mcq` (blueprint kind `gradedMcq`, S19 / Fast FT11 closing graded MCQ). Committed with keys and feedback under the captain's public-answer consent (Firstmate, 2026-11-19).

## Provenance
- Candidate: `python-final-mcq.gift` from the pep-standard-fast-labs-python-authoring lane, sha256 `7c16d50a9ca619751029e8778e2ee65c593787e0cb0449c626416aa276189b58`. That lane records two independent critics, a non-author reconciler and five correction loops, closing with both critics accepting at that sha.
- Integration changed only non-question bytes: the leading header comment and the `$CATEGORY` line (now `python/assessments/python-final-mcq`, required by `course-final-gift.test.mjs`). The 30 question blocks are byte-identical to the candidate. The blueprint differs only in `kind` (`courseFinalMcq` -> `gradedMcq`, the kind the repo checker accepts).
- The candidate's critic JSON files were not in the delivered package, so they are not committed here and the critic shas are bound to the pre-integration bytes. Item-to-topic map: `course-final-coverage-map.md`.

## Timing (modelled, not learner-timed)
- 30 items, `durationMinutes` 30, pass mark 70. The 30 minutes comes from a per-item allowance (9 x 40 s + 12 x 60 s + 9 x 80 s = 1,800 s) and a word/code-line load estimate. No learner has been timed against it.

## Checks
- Repo GIFT tests and gates: see the branch gate record in the delivery report.
- Overlap: trigram Jaccard of each final item against all 133 topic practice items (`python/*/*/artifact.gift`) peaks at 0.035. Mastery banks and legacy module-check files were not used.
- Answer keys were executed or emulated by the authoring lane (29 of 30; q15 is page-grounded; q26 also on PostgreSQL 16.2 in that lane). Not re-run here.
- Platform import is not verified.
