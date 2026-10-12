# Post-import edits to imported learner pages

Every change to imported page bytes after the byte-faithful import (commit 664f7ec) is listed here for the critics.

## Normalization (no learner-content change)

- `pep:` meta tags rewritten from `topic.json` (course, module, topic, topic-id, budget, per-topic source receipt path); the empty `data:` favicon link removed (T08 forbids `data:` loads).
- Next-topic links rewritten from legacy numbered filenames to `../<topic>/artifact.html`; link text unchanged.

## environment-variables-and-secrets: demo key value shortened

- File: `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets/artifact.html`, the `.env` fixture in the step-3 repository explorer.
- Change: the fixture value `demo-not-a-real-key-42` became `not-real-42`. A first attempt, `demo-fake-42`, is exactly 12 characters and still matched the scan, so it was replaced.
- Reason: the repository secret scan (gate 4, `tools/checks/T07-forbidden.mjs`) treats an API key assignment whose value has 12 or more characters as a secret. The value was always a labelled fake; the new value stays obviously fake and is under the threshold.
- Decision: approved by Firstmate on 2026-10-12; the T07 tooling is unchanged.
- Learner impact: none intended; the step still asks which files may be committed, and `.env` remains the file holding the value.

## All pages: header objectives and static interaction alternatives

- Approved by Firstmate on 2026-10-12 for every course-1 module, so `artifact.md` can be derived (T18).
- Added a header objectives list with the exact `topic.json` objective text, an author-written `data-static-alt` on every `data-interaction` element, and `data-pep-teaching` markers on teach steps 2 and later.
- Timing effect: the visible objectives list raises the frozen estimator P50 (navigating-the-shell 7.95 to 8.12, pipes-and-grep 5.89 to 6.03).

## localhost-and-ports: port-card border contrast

- Change: `.ports li` border colour `var(--line)` became `var(--rule)` (light `#6b7873`, dark `#71827c`).
- Reason: T12 measured the port-card border at 1.47:1 in the light theme, below the 3:1 minimum for meaningful borders.
- Decision: approved by Firstmate on 2026-10-12 as a one-line CSS edit; no other style or content change.

## Timing: navigating-the-shell and pipes-and-grep labels raised

- Evidence: frozen `tools/timing/estimate_reading.py` (sha256 `0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f`) P50 before the objectives list (commit 478f4b4 bytes) and after it: navigating-the-shell 7.95 to 8.12, pipes-and-grep 5.89 to 6.03. The added list alone accounts for the difference (removing only the list restores 7.95).
- Change: aboutLabel, budget and modeledWorstPath raised 8 to 9 (navigating-the-shell) and 6 to 7 (pipes-and-grep); the `pep:budget-minutes` meta follows `topic.json`. T14 passes and the F1 day total still fits.
- Decision: approved by Firstmate on 2026-10-12 (option a).
