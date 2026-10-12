# Course intake: Git/Linux/AI Foundations

Plan step R1 intake for `git-linux-ai-foundations` (calendar technology `tool`, Foundation days F1-F3).
This intake ships manifests, the F3 assessment blueprint and evidence only; it imports no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "imported in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Legacy authority (read-only): `~/pep-workspace/course-builds/git-linux-ai-foundations-20261007-evolv-terminal-repair/` `course.json` and the three `module.json` files (ids, titles, descriptions, objectives, minutes, `sourceMappings`, freshness records).
- Plan: approved PEP technology-content plan sections 2.2-2.5, 3, 4 item 9, 5, 7.1 and 10 (R1).

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| F1 | Shell, ports and AI setup | Concept | `/tracks/0/weeks/0/days/0` | 0. Navigating files and folders in the shell; 1. Pipes, grep and file permissions; 2. Environment variables and keeping secrets out of code; 3. Reading: localhost and ports; 4. Reading: AI assistant setup and rules of use; 5. Reading: how Agile teams work (Scrum, user stories) |
| F2 | Git basics, undo and remotes | Concept | `/tracks/0/weeks/0/days/1` | 0. Commits, diffs and .gitignore; 1. Branches and switching between them; 2. Undoing mistakes: revert and reset; 3. Reading: stash; 4. Remotes: SSH keys, clone, push, fetch vs pull |
| F3 | Pull requests, tooling review and check | Practice | `/tracks/0/weeks/0/days/2` | 0. Merge conflicts; 1. Reading: merge vs rebase; 2. Pull requests, review comments and checking AI-made changes before merging; 3. Git and shell review; 4. Tooling module check |

F3 carries the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70), which the plan reads as this course's course-level assessment.

## Module map

Module ids and order are kept from the legacy course: `linux-foundations`, `git-foundations`, `ai-foundations`.

| Module | Title | Topics | Legacy minutes |
|---|---|---|---|
| `linux-foundations` | Linux Foundations | 5 | 33 |
| `git-foundations` | Git Foundations | 9 | 63 |
| `ai-foundations` | AI Foundations | 5 | 45 |

Total: 19 topics, 141 legacy about-minutes (legacy `course.json` `totalAboutMinutes` 141).

## Topic list with relations

Topic ids are kept exactly. Objectives and titles are copied verbatim from the legacy `module.json`, except the changes accepted at intake reconciliation (`intake-reconciliation.json.txt`):

- `ai-foundations/foundations-course-check`: kind `review`, title "Practice: Foundations course review" (education-03).
- `ai-foundations/ai-rules-of-use`: title "Rules of use: what to share and redact" (education-05).
- `git-foundations/undoing-revert-and-reset`: prerequisite `commits-diffs-and-gitignore` and a self-contained o3 on shared versus local history (education-04).
- `git-foundations/merge-vs-rebase` o1: merge commit versus fast-forward (sme-03).
- `linux-foundations/environment-variables-and-secrets` o3: ignore `.env` before it is ever added; revoke or rotate a committed secret (sme-04).
- `linux-foundations/file-permissions` o3: execute permission for `./script.sh` versus `bash script.sh` (sme-05).

Each changed title and objective must be carried into that page's header in its module PR, where module critics check it against the page bytes.

| # | Topic | Module | Kind | Pointer | Day | Relation | Calendar row |
|---|---|---|---|---|---|---|---|
| 1 | `navigating-the-shell` | `linux-foundations` | core | `/tracks/0/weeks/0/days/0/topics/0` | F1 | exact | Navigating files and folders in the shell |
| 2 | `pipes-and-grep` | `linux-foundations` | core | `/tracks/0/weeks/0/days/0/topics/1` | F1 | split | Pipes, grep and file permissions |
| 3 | `file-permissions` | `linux-foundations` | core | `/tracks/0/weeks/0/days/0/topics/1` | F1 | split | Pipes, grep and file permissions |
| 4 | `environment-variables-and-secrets` | `linux-foundations` | core | `/tracks/0/weeks/0/days/0/topics/2` | F1 | exact | Environment variables and keeping secrets out of code |
| 5 | `localhost-and-ports` | `linux-foundations` | reading | `/tracks/0/weeks/0/days/0/topics/3` | F1 | exact | Reading: localhost and ports |
| 6 | `commits-diffs-and-gitignore` | `git-foundations` | core | `/tracks/0/weeks/0/days/1/topics/0` | F2 | exact | Commits, diffs and .gitignore |
| 7 | `branches-and-switching` | `git-foundations` | core | `/tracks/0/weeks/0/days/1/topics/1` | F2 | exact | Branches and switching between them |
| 8 | `undoing-revert-and-reset` | `git-foundations` | core | `/tracks/0/weeks/0/days/1/topics/2` | F2 | exact | Undoing mistakes: revert and reset |
| 9 | `stash` | `git-foundations` | reading | `/tracks/0/weeks/0/days/1/topics/3` | F2 | exact | Reading: stash |
| 10 | `remotes-clone-push-fetch-pull` | `git-foundations` | core | `/tracks/0/weeks/0/days/1/topics/4` | F2 | exact | Remotes: SSH keys, clone, push, fetch vs pull |
| 11 | `merge-conflicts` | `git-foundations` | core | `/tracks/0/weeks/0/days/2/topics/0` | F3 | exact | Merge conflicts |
| 12 | `merge-vs-rebase` | `git-foundations` | reading | `/tracks/0/weeks/0/days/2/topics/1` | F3 | exact | Reading: merge vs rebase |
| 13 | `pull-requests-and-review` | `git-foundations` | core | `/tracks/0/weeks/0/days/2/topics/2` | F3 | shared | Pull requests, review comments and checking AI-made changes before merging |
| 14 | `git-and-shell-review` | `git-foundations` | review | `/tracks/0/weeks/0/days/2/topics/3` | F3 | exact | Git and shell review |
| 15 | `ai-assistant-setup` | `ai-foundations` | reading | `/tracks/0/weeks/0/days/0/topics/4` | F1 | split | Reading: AI assistant setup and rules of use |
| 16 | `ai-rules-of-use` | `ai-foundations` | reading | `/tracks/0/weeks/0/days/0/topics/4` | F1 | split | Reading: AI assistant setup and rules of use |
| 17 | `agile-scrum-user-stories` | `ai-foundations` | reading | `/tracks/0/weeks/0/days/0/topics/5` | F1 | exact | Reading: how Agile teams work (Scrum, user stories) |
| 18 | `checking-ai-changes` | `ai-foundations` | core | `/tracks/0/weeks/0/days/2/topics/2` | F3 | shared | Pull requests, review comments and checking AI-made changes before merging |
| 19 | `foundations-course-check` | `ai-foundations` | review | `/tracks/0/weeks/0/days/2/topics/4` | F3 | exact | Tooling module check |

Relations:

- **split** `/tracks/0/weeks/0/days/0/topics/1` "Pipes, grep and file permissions": `pipes-and-grep` (pipes and grep half) and `file-permissions` (permissions half), so each page stays focused.
- **split** `/tracks/0/weeks/0/days/0/topics/4` "Reading: AI assistant setup and rules of use": `ai-assistant-setup` (setup half) and `ai-rules-of-use` (rules-of-use half).
- **shared** `/tracks/0/weeks/0/days/2/topics/2` "Pull requests, review comments and checking AI-made changes before merging": `git-foundations/pull-requests-and-review` teaches PR mechanics and review comments; `ai-foundations/checking-ai-changes` teaches checking AI-made changes. The PR page links to the AI page instead of duplicating it.
- **exact** for every other row, including `/tracks/0/weeks/0/days/2/topics/4` "Tooling module check": its learner-facing formative page `ai-foundations/foundations-course-check` stays a topic, not an assessment. The same calendar row's `moduleCheck` assessment is the course blueprint `assessments/tooling-module-check`, so the row has one topic and one blueprint.
- Mapping evidence: each relation restates the legacy `sourceMappings` entry for that topic, which names the same curriculum pointer and the split or shared half.

16 calendar source rows become 19 pages: two splits and one shared row. Plan section 2.3 counts 11 core rows and 5 `Reading:` rows in F1-F3; as pages, 11 are core, 6 reading and 2 review.

## Artifact applicability

Rules (captain): core topics require HTML, derived Markdown and a practice GIFT quiz, with a curated video when a suitable verified one exists; Reading topics also carry a printable PDF; review topics carry HTML and Markdown only; absent companions record a reason.
The PDF applies to the six pages derived from the five `Reading:` source rows: `localhost-and-ports`, `ai-assistant-setup`, `ai-rules-of-use`, `agile-scrum-user-stories`, `stash` and `merge-vs-rebase`.

Legend: **R** required, imported in the module PR; **V** required when a suitable verified video exists (the legacy curation has one per page, re-verified live before import); **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `linux-foundations/navigating-the-shell` | core | R | R | - | R | V | - |
| `linux-foundations/pipes-and-grep` | core | R | R | - | R | V | - |
| `linux-foundations/file-permissions` | core | R | R | - | R | V | - |
| `linux-foundations/environment-variables-and-secrets` | core | R | R | - | R | V | - |
| `linux-foundations/localhost-and-ports` | reading | R | R | R | R | V | - |
| `git-foundations/commits-diffs-and-gitignore` | core | R | R | - | R | V | - |
| `git-foundations/branches-and-switching` | core | R | R | - | R | V | - |
| `git-foundations/undoing-revert-and-reset` | core | R | R | - | R | V | - |
| `git-foundations/stash` | reading | R | R | R | R | V | - |
| `git-foundations/remotes-clone-push-fetch-pull` | core | R | R | - | R | V | - |
| `git-foundations/merge-conflicts` | core | R | R | - | R | V | - |
| `git-foundations/merge-vs-rebase` | reading | R | R | R | R | V | - |
| `git-foundations/pull-requests-and-review` | core | R | R | - | R | V | - |
| `git-foundations/git-and-shell-review` | review | R | R | - | - | - | - |
| `ai-foundations/ai-assistant-setup` | reading | R | R | R | R | V | - |
| `ai-foundations/ai-rules-of-use` | reading | R | R | R | R | V | - |
| `ai-foundations/agile-scrum-user-stories` | reading | R | R | R | R | V | - |
| `ai-foundations/checking-ai-changes` | core | R | R | - | R | V | - |
| `ai-foundations/foundations-course-check` | review | R | R | - | - | - | - |

Notes:

- `foundations-course-check` is classified `review` (reconciliation education-03): all its objectives retrieve or apply earlier learning, so it carries HTML and Markdown only. It stays a formative topic, separate from the course assessment blueprint. Its legacy GIFT question and video are not imported.
- `git-and-shell-review` is `review` (legacy `kind: review`). The legacy companions include one GIFT question and one video for it; under the review rule neither is imported.
- Legacy companions live outside the package (plan section 2.5): `linux-foundations-questions.gift` (15 questions, written against the 2026-10-06 Linux pages, to be re-grounded in R4), `git-ai-foundations-questions.gift` (14 questions) and the two video curation files (19 links). R4 splits them per topic.

## Lab plan

- No topic or module coding lab: every topic records `lab: none` and the `lab` artifact absent, because the objectives are practised in the pages' own simulators.
- The course-level lab decision (a candidate "ship a safe change" lab with Git and Python standard-library tests) is **pending plan step R5**, where the educational critic decides whether it adds learning beyond the simulators. `course.json` `courseLabs` is empty until then.

## Minute budgets

Values per topic in `topic.json` `minutes`, after the course-1 timing resolution decided at reconciliation:

- `aboutLabel`: the legacy `module.json` `minutes`, copied.
- `budget`: the captain-approved legacy minutes label (equal to `aboutLabel`).
- `modeledP50`: the p50 of the frozen `tools/timing/estimate_reading.py` (sha256 `0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f`, a byte-identical copy of the legacy estimator) run on the authoritative legacy page bytes.
- `modeledWorstPath`: the legacy worst-required-route value where the legacy manifest records one (ai-foundations `timing.worstRequiredRetryP50`); otherwise the captain-approved legacy label covering the worst required route, re-measured in the module PR.

| Topic | Day | Budget = about-label | Estimator P50 | modeledWorstPath | Worst-path basis | Plan 4.9 formula budget (superseded) | Estimator p90 (reference) |
|---|---|---|---|---|---|---|---|
| `navigating-the-shell` | F1 | 8 | 7.95 | 8 | legacy label | 8 | 11.52 |
| `pipes-and-grep` | F1 | 6 | 5.89 | 6 | legacy label | 5 | 8.54 |
| `file-permissions` | F1 | 7 | 6.0 | 7 | legacy label | 5 | 8.69 |
| `environment-variables-and-secrets` | F1 | 6 | 5.72 | 6 | legacy label | 8 | 8.29 |
| `localhost-and-ports` | F1 | 6 | 4.78 | 6 | legacy label | 5 | 6.93 |
| `commits-diffs-and-gitignore` | F2 | 9 | 7.91 | 9 | legacy label | 8 | 11.46 |
| `branches-and-switching` | F2 | 6 | 5.28 | 6 | legacy label | 8 | 7.65 |
| `undoing-revert-and-reset` | F2 | 7 | 5.9 | 7 | legacy label | 8 | 8.55 |
| `stash` | F2 | 7 | 5.87 | 7 | legacy label | 5 | 8.51 |
| `remotes-clone-push-fetch-pull` | F2 | 8 | 7.67 | 8 | legacy label | 8 | 11.12 |
| `merge-conflicts` | F3 | 6 | 5.74 | 6 | legacy label | 3 | 8.32 |
| `merge-vs-rebase` | F3 | 6 | 5.31 | 6 | legacy label | 2 | 7.7 |
| `pull-requests-and-review` | F3 | 7 | 6.5 | 7 | legacy label | 2 | 9.42 |
| `git-and-shell-review` | F3 | 7 | 6.28 | 7 | legacy label | 3 | 9.11 |
| `ai-assistant-setup` | F1 | 9 | 5.49 | 7.9 | legacy worstRequiredRetryP50 | 3 | 7.96 |
| `ai-rules-of-use` | F1 | 8 | 5.14 | 7.31 | legacy worstRequiredRetryP50 | 3 | 7.45 |
| `agile-scrum-user-stories` | F1 | 10 | 6.7 | 9.35 | legacy worstRequiredRetryP50 | 5 | 9.71 |
| `checking-ai-changes` | F3 | 9 | 5.44 | 8.07 | legacy worstRequiredRetryP50 | 2 | 7.89 |
| `foundations-course-check` | F3 | 9 | 6.19 | 8.5 | legacy worstRequiredRetryP50 | 3 | 8.98 |

Day totals (within the 120-minute day; T14 checks estimator P50 against it): F1: budgets 60, P50 47.67; F2: budgets 37, P50 32.63; F3: budgets 44, P50 35.46.

### Budget conflict and its resolution

The first intake commit set `budget` from the plan section 4 item 9 formula: the day type's reading and worked-example pool (Concept: Reading 15 + Worked example 12 = 27 minutes; Practice: Refresher 5 minutes) split by weight (core 2, reading 1), divided between the pages of a split or shared row, plus 2 exercise minutes, floored. Those budgets (column "superseded" above) sat below the estimator P50 on 12 of 19 pages, and the legacy labels sat below the estimator p90 on 14 of 19, so gate T14 would have failed at the R2 import.

Resolution (firstmate, at reconciliation of this intake; not a critic finding): for course 1 each topic budget is its captain-approved legacy minutes label, and `modeledWorstPath` follows the legacy worst-required-route record as above. `modeledP50` stays the estimator P50, and the estimator p90 is kept here as a reference only. Revising the budget formula for new courses is deferred to the pilot retrospective (plan step R7).

## F3 assessment blueprint

`git-linux-ai-foundations/assessments/tooling-module-check/blueprint.json`:

- Calendar identity copied verbatim from the snapshot F3 `assessment`: `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores for a module check, so `weights` is empty. Reconciliation rejected sme-01 with evidence: plan section 3.5 lists `passMark` and weights as calendar identity, and the pass mark is published in the learner-facing calendar.
- Objectives covered (education-01): a balanced representative set that the 13 items can directly elicit; `objectiveFormats` maps each to the format that checks it (sme-07). MCQ covers one objective per item across the three modules; the 3 coding tasks cover hands-on shell and Git objectives. The two review pages add no new objectives and are not listed.

  - `git-linux-ai-foundations/linux-foundations/pipes-and-grep#o1` (MCQ)
  - `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets#o2` (MCQ)
  - `git-linux-ai-foundations/linux-foundations/localhost-and-ports#o3` (MCQ)
  - `git-linux-ai-foundations/git-foundations/undoing-revert-and-reset#o3` (MCQ)
  - `git-linux-ai-foundations/git-foundations/stash#o1` (MCQ)
  - `git-linux-ai-foundations/git-foundations/remotes-clone-push-fetch-pull#o3` (MCQ)
  - `git-linux-ai-foundations/git-foundations/merge-vs-rebase#o3` (MCQ)
  - `git-linux-ai-foundations/ai-foundations/ai-rules-of-use#o1` (MCQ)
  - `git-linux-ai-foundations/ai-foundations/agile-scrum-user-stories#o3` (MCQ)
  - `git-linux-ai-foundations/ai-foundations/checking-ai-changes#o3` (MCQ)
  - `git-linux-ai-foundations/linux-foundations/navigating-the-shell#o3` (coding)
  - `git-linux-ai-foundations/linux-foundations/file-permissions#o2` (coding)
  - `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore#o2` (coding)
  - `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore#o3` (coding)
  - `git-linux-ai-foundations/git-foundations/branches-and-switching#o2` (coding)
  - `git-linux-ai-foundations/git-foundations/merge-conflicts#o3` (coding)

- Proposed item counts and duration, from the F3 Practice day blocks: the Quiz block (MCQ assessment, 10 minutes) and the "Timed, without AI" block (coding assessment, 30 minutes).
  - MCQ: 10 items in 10 minutes, about 1 minute per scenario-based item.
  - coding: 3 short shell and Git tasks in 30 minutes, about 10 minutes each.
  - `durationMinutes` 40 = 10 + 30.
- Allowed resources (education-02, sme-02): the no-AI rule applies only to the coding part, because only the calendar's "Timed, without AI" block states it; the calendar states no AI restriction for the Quiz block. The coding part uses the provided terminal with a POSIX shell and Git. Any further resource rule (notes, course pages, built-in help, web documentation) is set and shown by the platform assessment owner; the repository invents no assessment policy.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its key names.
- Criticism: fresh independent educational and technology-SME critics reviewed the blueprint and new text; their reports and the non-author reconciliation are committed verbatim (see Intake criticism).

## Official sources per topic

Each topic's legacy official sources were re-fetched live for this intake; `evidence/git-linux-ai-foundations/source-snapshot.json` records each URL with retrieval time, sha256 of the fetched bytes and the topic sections used (URL fragments from the legacy records). All 55 URLs returned HTTP 200. Three provider data-use sources were added for `ai-rules-of-use` at reconciliation (sme-06): Claude Code data usage, GitHub Copilot model-training policy and the GitHub General Privacy Statement; they are listed first in that topic's row below. Raw fetched pages are not committed.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is imported yet. Each lists the legacy freshness status and the legacy unverified items; plan step R6 SME criticism re-verifies the imported bytes.

| Topic | Legacy freshness | Official sources |
|---|---|---|
| `navigating-the-shell` | partially-verified | https://tiswww.case.edu/php/chet/bash/CHANGES<br>https://man7.org/linux/man-pages/man1/bash.1.html<br>https://man7.org/linux/man-pages/man1/ls.1.html<br>https://man7.org/linux/man-pages/man1/pwd.1.html<br>https://pubs.opengroup.org/onlinepubs/9799919799/utilities/ls.html |
| `pipes-and-grep` | verified | https://man7.org/linux/man-pages/man1/bash.1.html<br>https://man7.org/linux/man-pages/man1/grep.1.html<br>https://man7.org/linux/man-pages/man1/wc.1.html |
| `file-permissions` | verified | https://man7.org/linux/man-pages/man1/bash.1.html<br>https://man7.org/linux/man-pages/man1/chmod.1.html<br>https://man7.org/linux/man-pages/man2/execve.2.html<br>https://pubs.opengroup.org/onlinepubs/9799919799/utilities/ls.html |
| `environment-variables-and-secrets` | partially-verified | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository<br>https://git-scm.com/docs/gitignore<br>https://man7.org/linux/man-pages/man1/bash.1.html<br>https://man7.org/linux/man-pages/man1/env.1.html |
| `localhost-and-ports` | verified | https://man7.org/linux/man-pages/man2/bind.2.html<br>https://man7.org/linux/man-pages/man2/connect.2.html<br>https://www.rfc-editor.org/rfc/rfc1122.html<br>https://www.rfc-editor.org/rfc/rfc6335.html<br>https://www.rfc-editor.org/rfc/rfc6761.html<br>https://www.rfc-editor.org/rfc/rfc6890.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `commits-diffs-and-gitignore` | verified | https://git-scm.com/docs/git-add#_description<br>https://git-scm.com/docs/git-diff#_description<br>https://git-scm.com/docs/git-commit#_description<br>https://git-scm.com/docs/gitignore#_description<br>https://git-scm.com/docs/git-restore#_options |
| `branches-and-switching` | verified | https://git-scm.com/docs/git-branch#_description<br>https://git-scm.com/docs/git-switch#_description<br>https://git-scm.com/docs/git-commit#_description |
| `undoing-revert-and-reset` | verified | https://git-scm.com/docs/git-revert#_description<br>https://git-scm.com/docs/git-reset#_options<br>https://git-scm.com/docs/git-push#_note_about_fast_forwards |
| `stash` | verified | https://git-scm.com/docs/git-stash#_description<br>https://git-scm.com/docs/git-stash#_options<br>https://git-scm.com/docs/git-switch#_description |
| `remotes-clone-push-fetch-pull` | verified | https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent<br>https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account<br>https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey<br>https://git-scm.com/docs/git-clone#_description<br>https://git-scm.com/docs/git-fetch#_description<br>https://git-scm.com/docs/git-pull#_description<br>https://git-scm.com/docs/git-push#_note_about_fast_forwards |
| `merge-conflicts` | verified | https://git-scm.com/docs/git-merge#_how_conflicts_are_presented<br>https://git-scm.com/docs/git-merge#_how_to_resolve_conflicts<br>https://git-scm.com/docs/git-merge#_merge_strategies |
| `merge-vs-rebase` | verified | https://git-scm.com/docs/git-rebase#_description<br>https://git-scm.com/docs/git-rebase#_recovering_from_upstream_rebase<br>https://git-scm.com/docs/git-merge#_description |
| `pull-requests-and-review` | verified | https://docs.github.com/en/pull-requests/reference/pull-requests<br>https://docs.github.com/en/pull-requests/reference/pull-request-reviews<br>https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging<br>https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request |
| `git-and-shell-review` | partially-verified | https://git-scm.com/docs/git-switch#_description<br>https://git-scm.com/docs/git-add#_description<br>https://git-scm.com/docs/git-push#OPTIONS |
| `ai-assistant-setup` | partially-verified | https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions<br>https://code.claude.com/docs/en/memory<br>https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot<br>https://docs.github.com/en/copilot/get-started/best-practices<br>https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html |
| `ai-rules-of-use` | partially-verified | https://code.claude.com/docs/en/data-usage<br>https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies<br>https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement<br>https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/<br>https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent |
| `agile-scrum-user-stories` | partially-verified | https://scrumguides.org/scrum-guide.html<br>https://cucumber.io/docs/gherkin/reference/ |
| `checking-ai-changes` | verified | https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request<br>https://docs.github.com/en/copilot/get-started/best-practices |
| `foundations-course-check` | partially-verified | https://pubs.opengroup.org/onlinepubs/9799919799/utilities/cd.html<br>https://pubs.opengroup.org/onlinepubs/9799919799/utilities/chmod.html<br>https://pubs.opengroup.org/onlinepubs/9799919799/utilities/ls.html<br>https://git-scm.com/docs/gitignore<br>https://git-scm.com/docs/git-stash<br>https://docs.github.com/en/copilot/get-started/best-practices |

Calendar references for the `tool` technology: [Pro Git book](https://git-scm.com/book/en/v2), [GitHub: connecting with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh), [Learning the shell](https://linuxcommand.org/lc3_learning_the_shell.php), [GitHub Copilot docs](https://docs.github.com/en/copilot), [The Scrum Guide](https://scrumguides.org/scrum-guide.html).

## Intake criticism

The two critic reports and the reconciliation for the first intake commit are committed as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`. They are the reviewers' records unchanged except for one added top-level `reviewedPath` naming the blueprint, the file their top-level `reviewedSha256` judged, so `tools/pep lock` can bind that hash under the course-level hash-binding rules (`docs/tools/evidence.md`). Outcome: 10 findings accepted and applied in one correction loop; 1 rejected with evidence (sme-01). A later recheck accepted sme-07: blueprint objectives are exact `<course>/<module>/<topic>#<objective-id>` references, with the MCQ or coding mapping in `objectiveFormats`.

## Legacy page hashes (for R2)

| Topic | Legacy file | sha256 |
|---|---|---|
| `navigating-the-shell` | `linux-foundations/01-navigating-the-shell.html` | `14c8fa751c2d30f6cb59233118045dcb6e05cca81e610ffa46dc9d6939a12122` |
| `pipes-and-grep` | `linux-foundations/02-pipes-and-grep.html` | `137bd71bcbda83ee2255e8bbe03fb89e362e64572e24e768ac953f748923674c` |
| `file-permissions` | `linux-foundations/03-file-permissions.html` | `264063f9a9c3086e55af06ffbc81cc4fba50072f0dae545d4cb1397702f4a40c` |
| `environment-variables-and-secrets` | `linux-foundations/04-environment-variables-and-secrets.html` | `24517bb7b22c997f02cf0307fe08ae84980d28b8cb57395d87d1e7e242ffff08` |
| `localhost-and-ports` | `linux-foundations/05-localhost-and-ports.html` | `6c6aa83c6557a934f6a44a4ce73fb35e18a8f8bf96ecc30de94f497fe6f96277` |
| `commits-diffs-and-gitignore` | `git-foundations/01-commits-diffs-and-gitignore.html` | `83e98537d34e68372e546d80a32653aa2f7a7da3954b1cdc079e853905e3849c` |
| `branches-and-switching` | `git-foundations/02-branches-and-switching.html` | `c6397938e12b4eb2ca2bf0a19d000f34c5d53ce95f252fc613336ffc4ee627b4` |
| `undoing-revert-and-reset` | `git-foundations/03-undoing-revert-and-reset.html` | `7a116d8a5397030fb6be44330dcd9bcf8aef7f426a5f676f24454efb4b8116a4` |
| `stash` | `git-foundations/04-stash.html` | `2595dbb0d037b2da3e3d643571536f9e6ff09968aa9f230bf1c969f34e70cdfb` |
| `remotes-clone-push-fetch-pull` | `git-foundations/05-remotes-clone-push-fetch-pull.html` | `0d2357f42f43390fb305521b32c0b1df2331d5dd4f476ce2de8741f17155213b` |
| `merge-conflicts` | `git-foundations/06-merge-conflicts.html` | `f84cc165130397874c7c01052dd4f9a90ddd4b451d05830ffecbfee9067b7061` |
| `merge-vs-rebase` | `git-foundations/07-merge-vs-rebase.html` | `60724ab68de2414de16d40a99cb57d6b0e77b00530f9b2e4027a7c41bb57b30b` |
| `pull-requests-and-review` | `git-foundations/08-pull-requests-and-review.html` | `28c258122fad6cca7a3b9d0ca75e83103723b0be6200c0540fc0eb380682bea3` |
| `git-and-shell-review` | `git-foundations/09-git-and-shell-review.html` | `f143d8acd513d63b0a293a03c39d6d6b2f8bc5a232340f021f18df9c5056484c` |
| `ai-assistant-setup` | `ai-foundations/01-ai-assistant-setup.html` | `9007067249c0ecf91ababe5071fb7a0ccfde7f6b32a50980113c48f61d34ba56` |
| `ai-rules-of-use` | `ai-foundations/02-ai-rules-of-use.html` | `93a86d6b91203d0261d97f4473aa61eab62c1c57de89c8ede444b2192f92a6e2` |
| `agile-scrum-user-stories` | `ai-foundations/03-agile-scrum-user-stories.html` | `c027e9df191fdd444975c74ce7f70893e2f3898e8f47d73aaf4891d3f1b051f4` |
| `checking-ai-changes` | `ai-foundations/04-checking-ai-changes.html` | `8c451c308a5dfc0fcbee5f0d22000f3f1a4aa987a036753accbcdb781767ac70` |
| `foundations-course-check` | `ai-foundations/05-foundations-course-check.html` | `1713a6ed4e8463997af63082b977f6c5c5ca05a657d89a18faf05fe392cd92a3` |
